# 07a — Data Contract: cod-order-confirmation (backend-agnostic)

SME-G pass · Entities, relationships, state machines. Every entity/operation below is justified by a flow in 03; every operation appears as an adapter method in 07b (bidirectional no-orphan proof in 03 Tables A/B). No backend, provider, storage, or transport is named — this is the source of truth from which any backend can be built or bound. **TypeScript types only** (types + pure interface shapes; no implementation code).

## Entities (TypeScript)

```ts
// ===== Roles & people =====
export type Role = 'agent' | 'manager' | 'dispatch';
export type Locale = 'ar' | 'en';

export interface User {
  id: string;
  workspaceId: string;
  displayName: string;            // bidi-isolated on render (rtl-rules §2)
  role: Role;                     // structural roles only (02 Salem: no per-user ACL at v1)
  siteIds: string[];              // scope for agents (multi-site policy, 07a LadderPolicy.siteScoped)
  locale: Locale;                 // console locale — independent of buyer template locales
  status: 'active' | 'suspended';
  joinedAt: string;
}

// ===== Buyers (the phone-book the scorecard learns from) =====
export interface Buyer {
  id: string;
  workspaceId: string;
  phone: string;                  // E.164 canonical; the buyer's identity key
  displayName: string | null;     // may be null — phone-only buyers are normal
  locale: Locale;                 // template locale for THIS buyer (independent of console locale)
  status: 'active' | 'blocked';
  blocklistReason: string | null; // REQUIRED when blocked (manager decision record)
  history: BuyerHistory;          // trailing-window outcomes (scorecard input)
  firstOrderAt: string | null;
  totalOrders: number;
}

export interface BuyerHistory {
  windowDays: number;             // trailing window (RiskPolicy.historyWindowDays, default 180)
  completed: number;              // delivered + cash collected
  refused: number;                // refused at door / RTO
  unreachable: number;            // ladder exhausted without response
  cancelled: number;              // buyer-cancelled before dispatch
  // derived elsewhere: completionRatio = completed / max(1, completed + refused + unreachable)
}

// ===== Orders =====
export type OrderSource = 'paste-import' | 'order-channel';   // abstract source (08 N1) or manual paste

export interface CodOrder {
  id: string;
  workspaceId: string;
  orderRef: string;               // the merchant's own reference; bidi-isolated Latin token
  buyerId: string;
  buyerPhoneAtOrder: string;      // snapshot — phone changes never rewrite history
  siteId: string;
  zoneCode: string | null;        // delivery zone (window-catalog match key; null = unmatched)
  district: string | null;
  city: string;
  valueAmount: number;            // workspace currency, canonical minor units
  currency: string;               // e.g. 'SAR' — display formatting only (no FX, no payment)
  itemsNote: string | null;       // bounded plain-text summary from the source
  language: Locale;               // buyer language for THIS order's templates
  source: OrderSource;
  sourceImportedAt: string | null;
  importedByUserId: string;
  createdAt: string;
  riskScoreId: string | null;     // latest computed score (immutable rows; recompute appends)
  ladderId: string | null;        // active ladder instance
  agreementId: string | null;     // WindowAgreement when confirmed-with-window
  manifestId: string | null;      // set at manifest inclusion (sealed batch)
  status: 'received' | 'triaged' | 'ladder-running' | 'awaiting-agreement' | 'confirmed'
        | 'held-review' | 'auto-cancelled' | 'buyer-cancelled' | 'merchant-cancelled'
        | 'cancelled-upstream' | 'manifested' | 'out-for-delivery' | 'delivered'
        | 'refused' | 'returned';
  holdReason: { kind: 'value-cap' | 'high-risk-band' | 'blocked-buyer' | 'manual';
                detail: string } | null;
  outcome: 'delivered' | 'refused' | 'returned' | 'lost' | null;  // post-handoff event record (LOOP-10: recorded, not worked)
  outcomeAt: string | null;
}

// ===== The confirmation ladder =====
export type AttemptKind = 'message' | 'sms' | 'voice' | 'agent-call';

export interface LadderPolicy {
  version: number;
  siteId: string | null;                 // null = workspace default; site overrides (02 Salem)
  attemptSequence: AttemptKind[];        // ordered; seeded [message, sms, voice, agent-call]
  cooldownHours: Record<AttemptKind, number>;   // wait AFTER that kind before the next (seeded: message 4, sms 16, voice 8, agent-call 0)
  quietHours: { startLocal: string; endLocal: string; enabled: boolean };  // '21:00'–'08:00' buyer-local, seeded
  ladderExpiryHours: number;             // from ladder start; seeded 48
  autoCancelOnExhaustion: boolean;       // seeded true
  autoStart: 'all' | 'below-high-risk' | 'none';   // seeded 'below-high-risk'
  minimumLeadHours: number;              // window start ≥ now + lead; seeded 6
  windowHorizonDays: number;             // propose windows within; seeded 7
  publishedAt: string;
  publishedByUserId: string;
}

export interface ConfirmationLadder {
  id: string;
  orderId: string;
  policyVersion: number;          // the ladder policy in force at start
  startedAt: string;
  startedBy: 'engine-auto' | 'user';
  expiresAt: string;              // startedAt + ladderExpiryHours (quiet-hour shifts applied)
  state: 'running' | 'completed' | 'expired' | 'halted';
  attemptIds: string[];           // ordered rung instances
}

export interface ConfirmationAttempt {
  id: string;
  ladderId: string;
  orderId: string;
  kind: AttemptKind;
  sequence: number;               // 1-based rung position
  state: 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'responded'
       | 'failed' | 'skipped' | 'cancelled';
  scheduledFor: string;           // engine-computed send time (quiet-hour aware)
  sentAt: string | null;
  stateDetail: string | null;     // channel failure class etc., verbatim-safe
  templateId: string | null;      // the template composed for this attempt
  responseIds: string[];          // responses captured against this attempt
  loggedByUserId: string | null;  // for agent-call rungs
}

// ===== Buyer responses & the agreement =====
export type BuyerResponseType = 'confirm' | 'cancel' | 'reschedule-request' | 'wrong-number';

export interface BuyerResponse {
  id: string;
  orderId: string;
  attemptId: string | null;       // null when captured free-standing (agent-initiated)
  type: BuyerResponseType;
  capturedVia: 'channel-event' | 'agent-capture' | 'manual-call';
  rawText: string | null;         // the buyer's reply verbatim, bidi-isolated (≤280 chars)
  windowId: string | null;        // set when confirm carries a window choice
  capturedByUserId: string | null;
  capturedAt: string;
}

export interface DeliveryWindow {
  id: string;
  workspaceId: string;
  siteId: string;
  zoneCode: string;
  date: string;                   // ISO date (Gregorian canonical; Hijri display per P24)
  startsAt: string;               // local time 'HH:mm'
  endsAt: string;
  dayPart: 'morning' | 'afternoon' | 'evening' | 'night';
  capacity: number;               // total slots
  committed: number;              // agreements count (denormalized, event-consistent)
  labelAr: string;                // 'صباحاً' / 'بعد الظهر' / 'مساءً' / 'ليلاً' + time range
  labelEn: string;
}

export interface WindowAgreement {
  id: string;
  orderId: string;
  windowId: string;
  responseId: string;             // the response that produced it — evidence chain
  attemptId: string;              // the rung it arrived on (channel kind derivable)
  agreedAt: string;
  supersededById: string | null;  // reschedules chain forward, never overwrite (07a immutability)
  active: boolean;
}

// ===== Risk (deterministic scorecard — conditionally-AI enrichment declared) =====
export type RiskComponentKind =
  | 'buyer-history' | 'value-band' | 'confirmation-latency'
  | 'channel-engagement' | 'address-quality' | 'buyer-tenure';

export interface RiskComponent {
  kind: RiskComponentKind;
  rawValue: number;               // e.g., completion ratio; value/cap ratio; hours-to-response
  normalized: number;             // 0–1 under the active policy (07c §2 formulas)
  weight: number;                 // policy weight at computation time
  points: number;                 // normalized × weight × 100
  explanationAr: string;          // composed from versioned bilingual templates, numeric params
  explanationEn: string;
}

export interface RiskScore {
  id: string;
  orderId: string;
  totalPoints: number;            // 0–100
  band: 'low' | 'medium' | 'high';  // thresholds from policy (seeded: low ≥70, high <40)
  components: RiskComponent[];    // the inspectable math (02 Fahad: "no black boxes")
  engine: 'rule-scorecard' | 'model-assisted';   // provenance, always displayed (ai-native §8)
  policyVersion: number;
  computedAt: string;
  computedByUserId: string | null; // explicit recomputes name the actor
}

export interface RiskPolicy {
  version: number;
  weights: Record<RiskComponentKind, number>;   // sums to 1 (VALIDATION otherwise, CP-6.2)
  valueCap: number;               // workspace currency minor units (seeded 500.00 → 50000)
  bandThresholds: { lowMin: number; highMax: number };  // seeded { lowMin: 70, highMax: 39 }
  holdRules: { overCapToHold: boolean; highBandOverHalfCapToHold: boolean };
  historyWindowDays: number;      // buyer-history trailing window (seeded 180)
  newBuyerNeutralScore: number;   // buyer-history component for zero history (seeded 0.5)
  publishedAt: string;
  publishedByUserId: string;
}

// ===== Templates (bilingual, versioned — no AI writes these) =====
export type TemplateSlot = AttemptKind | 'final-notice' | 'cancel-ack' | 'window-quick-replies';

export interface MessageTemplate {
  id: string;
  workspaceId: string;
  slot: TemplateSlot;
  bodyAr: string;                 // with {{name}} {{orderRef}} {{value}} {{window}} parameters
  bodyEn: string;
  quickReplyWindowOptions: boolean;   // message rung: encode eligible windows as reply buttons
  keypadMenuWindowOptions: boolean;   // voice rung: read windows as numbered keypad choices
  version: number;
  updatedAt: string;
  updatedByUserId: string;
}

// ===== Manifests =====
export interface HandoffManifest {
  id: string;
  workspaceId: string;
  siteId: string;
  routeDate: string;              // the delivery date band the batch targets
  orderIds: string[];             // frozen at seal
  status: 'draft' | 'sealed' | 'exported';
  rollup: { count: number; totalValue: number; windows: { windowId: string; count: number }[];
            bands: { low: number; medium: number; high: number }; agreementOwed: number };
  sealedAt: string | null;
  sealedByUserId: string | null;
  exportedAt: string | null;
  artifactId: string | null;      // export artifact (expiry per async-contract §2)
}

// ===== Ambient =====
export interface NotificationEvent {
  id: string;
  userId: string;
  kind: 'agreement-stamped' | 'hold-awaiting-decision' | 'ladder-transition'
      | 'auto-cancelled' | 'capacity-warning' | 'policy-published' | 'outcome-recorded';
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // P21 class ladder
  payload: Record<string, string>;
  createdAt: string;
  seenAt: string | null;
}

export interface ActivityEntry {   // P17 — actor-action-target-timestamp
  id: string;
  workspaceId: string;
  actorUserId: string | null;      // null = engine ('auto-cancel', 'channel-event')
  action: string;                  // 'order.imported' | 'ladder.started' | 'attempt.sent' | …
  targetId: string;
  detail: Record<string, string>;
  at: string;
}

export interface Job<T = unknown> {   // async-contract §2 state machine
  id: string;
  kind: 'order-import' | 'manifest-export' | 'ledger-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: { code: string; message: string; correlationId: string };
}
```

## Relationships

Workspace 1—N User, Buyer, CodOrder, DeliveryWindow, MessageTemplate, HandoffManifest, ActivityEntry; 1—N LadderPolicy (site-scoped + default, versioned history retained); 1—1 RiskPolicy (versioned history retained). Buyer 1—N CodOrder (orders snapshot buyerPhoneAtOrder — phone edits never rewrite history). CodOrder 1—0..1 ConfirmationLadder (released holds start one; re-halt/re-run creates a NEW ladder, history preserved). ConfirmationLadder 1—N ConfirmationAttempt (ordered by sequence). CodOrder 1—N BuyerResponse; BuyerResponse 1—0..1 WindowAgreement (confirm-with-window creates exactly one; reschedules supersede forward). CodOrder 1—N RiskScore (immutable rows; recompute appends). CodOrder 1—0..1 membership in HandoffManifest (set at inclusion; frozen at seal). User 1—N NotificationEvent. Job 1—0..1 export artifact (expiry window per async-contract §2). All list-bearing relations paginate via the typed Page model (07b).

## State machines (declared transitions only — others are contract violations)

- **CodOrder**: received → triaged → (policy auto-start or manual) ladder-running → awaiting-agreement → confirmed; triaged/ladder-running → held-review → (release) ladder-running | (decision) merchant-cancelled; ladder-running → auto-cancelled (exhaustion, policy-gated) | buyer-cancelled (response) | cancelled-upstream (source event); any pre-confirmed state → merchant-cancelled (manager, rationale); confirmed → manifested (seal includes it) → out-for-delivery (channel event) → delivered | refused | returned (outcome events, recorded only — LOOP-10). Terminal: delivered/refused/returned/auto-cancelled/buyer-cancelled/merchant-cancelled/cancelled-upstream.
- **ConfirmationLadder**: running → completed (confirm captured) | expired (expiry with no confirm → order auto-cancel per policy) | halted (order cancelled/held mid-ladder). Attempts within: queued → sending → sent → delivered → read → responded; sending/sent → failed (channel error, engine failover per policy) | skipped (reschedule carried to next rung OR explicit defer); queued → cancelled (order resolved first).
- **WindowAgreement**: created active → superseded (reschedule chain) — active flips false, supersededById set; never edited or deleted (dispute-grade immutability, 02 Salem).
- **HandoffManifest**: draft → sealed → exported. Sealed is immutable: orderIds frozen; late orders belong to the NEXT manifest (CP-5); no unsealing transition exists.
- **Job**: async-contract §2 verbatim.

## Operations (read/write/subscribe — all typed on 07b)

- Session: getSession (auth-agnostic; role + locale + site routing).
- Orders: list (query: status, band, site, zone, agreement state, aging, manifest membership, search by orderRef/phone/name; sort: nextAttemptAt, risk, value, aging; cursor page), get, import (Job; paste primary), setOrderHold (with reason), cancel (with reason class), startLadder (manual start for released holds / manual mode).
- Ladder: getLadderPolicy, updateLadderPolicy (versioned; quiet-hours preview data echoed), rescheduleAttempt (defer/advance with engine validation), logManualContact (call outcome + note — LOOP-5 primary), recordBuyerResponse (typed response + optional window; agent-capture and manual-call legs).
- Windows: list (query: site/zone/date), upsert (capacity), proposeForOrder (eligible: zone match, capacity > 0, lead time, horizon).
- Risk: computeRiskScore (pure recompute, appends immutable row), getRiskPolicy, updateRiskPolicy (simulationConfirmed gate), simulateRiskPolicy (proposed weights → before/after band rollup over open orders).
- Buyers: list (search with Arabic normalization), get (history trail), setBuyerStatus (block/restore with reason; manager+).
- Templates: list, upsert (versioned), preview (composed buyer-view for an order).
- Manifests: list, create (selection or by-filter), seal (immutable lock), export (Job → artifact).
- Ambient: listActivity, exportConfirmationLedger (Job), listNotifications, markNotificationsSeen, subscribeOrderEvents (live queue/trail/capacity patches), get/retry/cancel job.
- People: listUsers, inviteUser, updateUser.

## State obligations summary (per entity)

Every async operation follows the async-contract state machine; exports carry expiry windows; the order import declares partial-results policy (deliver succeeded rows, mark failures, retry scoped to failed rows — §4). Every consequential mutation appends an ActivityEntry (P17) — including engine actions (auto-cancel, attempt-sent) with actor null and detail naming the policy version. Every risk score names its engine provenance and policy version; every ladder names its policy version at start; every agreement chains to its response and attempt. No entity references a provider, transport, or external system by name — external touchpoints are abstract needs in 08 only. Buyer PII is bounded to phone/displayName/locale/history counts (08 consent posture); no address text beyond zone/district/city is stored — the window catalog keys on zoneCode, never on geolocation.

## Determinism statement (conditionally-AI — declared per ai-native-patterns §1)

The **rule-scorecard** risk computation is a pure function of (declared inputs: buyer history counts, order value vs policy cap, ladder timing state, response channel states, zone-match flag, buyer tenure) → (components + total + band + bilingual explanations). Two evaluations over identical inputs produce identical output (07c §5 guarantees this in the mock). The **declared AI surface** is exactly one optional capability: risk-score enrichment via an abstract model binding (08 N6) — when bound, the adapter implementation MAY return `engine: 'model-assisted'` scores, but the contract requires: (a) the deterministic scorecard result is always computed and retained as the floor; (b) the engine provenance is a first-class field the UI displays; (c) degradation to the scorecard is total and instant when the capability is unbound, rate-limited, or fails (08 degradation map). No other surface touches a model: templates are human-authored data, attempt scheduling is rules, response classification is the capturing human's judgment. There is no AI-written buyer message anywhere in the contract.
