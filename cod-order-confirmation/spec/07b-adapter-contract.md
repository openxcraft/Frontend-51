# 07b — Adapter Contract: cod-order-confirmation (TypeScript, v1)

SME-G pass · Backend-agnostic by construction: no REST verbs, no provider names, no transport assumptions. The UI talks ONLY to this interface; binding to a real backend later = implementing this interface in one adapter file. Version: **v1** — breaking changes require `CodOrderConfirmationAdapterV2`, never modified signatures. LOOP-15 checklist satisfied: full 7-class error taxonomy, typed pagination/sort/filter, auth-agnostic session model, idempotency keys on reconnectable mutations. **TypeScript types only** — no implementation code in this contract.

```ts
// ===== Foundation (shared contract shapes) =====
// Error taxonomy — the portfolio-standard 7 classes:
//   ValidationError | NotFoundError | PermissionError | ConflictError
//   | RateLimitError | NetworkError | UnknownError
// mapped onto the 7-token ErrorCode union below. Every failure in this
// product resolves to exactly one of these classes (03 failure-mode table).
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;                       // developer-facing; user copy comes from the 11 matrix
  correlationId: string;                 // surfaces in UnknownError user copy (copy-voice §1.4)
  retryable: boolean;
  details?: Record<string, string[]>;    // field/row/rule → issues (ValidationError names the failed rule)
}

// Auth-agnostic session: implementations resolve identity however their
// environment dictates (phone-pin for agents, enterprise SSO — 08 N7).
// The UI never sees a provider.
export interface Session {
  userId: string;
  workspaceId: string;
  role: 'agent' | 'manager' | 'dispatch';
  locale: 'ar' | 'en';
  siteIds: string[];                     // agent scope for multi-site workspaces
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export interface CursorQuery<F, S> {
  filter?: F;
  sort: S;
  sortDir: 'asc' | 'desc';
  search?: string;   // Arabic-normalized server-side (rtl-rules §4: alef/taa-marbuta/yaa variants, tashkeel stripped)
  cursor?: string;
  limit: number;     // ≤ 50 (10 data-path rule)
}

// ===== Domain types (mirror 07a; entity contracts live there) =====
export type Role = 'agent' | 'manager' | 'dispatch';
export type AttemptKind = 'message' | 'sms' | 'voice' | 'agent-call';
export type BuyerResponseType = 'confirm' | 'cancel' | 'reschedule-request' | 'wrong-number';
export type OrderStatus = 'received' | 'triaged' | 'ladder-running' | 'awaiting-agreement' | 'confirmed'
  | 'held-review' | 'auto-cancelled' | 'buyer-cancelled' | 'merchant-cancelled'
  | 'cancelled-upstream' | 'manifested' | 'out-for-delivery' | 'delivered' | 'refused' | 'returned';
export type RiskBand = 'low' | 'medium' | 'high';

export interface UserSummary {
  id: string; displayName: string; role: Role; siteIds: string[];
  locale: 'ar' | 'en'; status: 'active' | 'suspended'; joinedAt: string;
}

export interface BuyerSummary {
  id: string; phone: string; displayName: string | null;
  locale: 'ar' | 'en'; status: 'active' | 'blocked'; blocklistReason: string | null;
  history: { windowDays: number; completed: number; refused: number; unreachable: number; cancelled: number };
  firstOrderAt: string | null; totalOrders: number;
}

export interface BuyerFilter {
  status?: BuyerSummary['status'][]; siteId?: string;
  historyRatioBelow?: number;        // e.g., 0.5 surfaces the risky book (Salem's review)
  phonePrefix?: string;
}
export type BuyerSort = 'displayName' | 'totalOrders' | 'historyRatio';

export interface CodOrderSummary {
  id: string; orderRef: string; buyerId: string; buyerDisplayName: string | null;
  buyerPhone: string; siteId: string; zoneCode: string | null; district: string | null;
  city: string; valueAmount: number; currency: string; language: 'ar' | 'en';
  status: OrderStatus; holdReason: { kind: string; detail: string } | null;
  riskBand: RiskBand | null;            // null only pre-triage; never rendered unscored
  riskTotal: number | null;
  ladderState: { activeKind: AttemptKind | null; attemptCount: number;
                 nextAttemptAt: string | null; expiresAt: string | null } | null;
  agreement: { windowId: string; date: string; startsAt: string; endsAt: string;
               labelAr: string; labelEn: string } | null;   // null = agreement owed (CP-3.7 flag lives here)
  manifestId: string | null;
  agingMinutes: number;
  createdAt: string;
}

export interface CodOrderFilter {
  status?: OrderStatus[]; siteId?: string; zoneCode?: string;
  riskBand?: RiskBand[]; agreementState?: 'stamped' | 'owed' | 'none';
  holdKind?: string[]; manifestId?: string | null;   // null filters the unmanifested book
  routeDate?: string;                  // manifest draft view grouping
  agingMinutesOver?: number;
}
export type CodOrderSort = 'nextAttemptAt' | 'riskTotal' | 'valueAmount' | 'agingMinutes' | 'createdAt';

export interface LadderPolicyDTO {
  version: number; siteId: string | null;
  attemptSequence: AttemptKind[];
  cooldownHours: Record<AttemptKind, number>;
  quietHours: { startLocal: string; endLocal: string; enabled: boolean };
  ladderExpiryHours: number; autoCancelOnExhaustion: boolean;
  autoStart: 'all' | 'below-high-risk' | 'none';
  minimumLeadHours: number; windowHorizonDays: number;
  publishedAt: string; publishedByUserId: string;
  // read-only preview the engine computes for the editor (CP-6.2):
  nextEligibleSendCalendar: { from: string; to: string; eligible: { at: string }[] } | null;
}

export interface AttemptSummary {
  id: string; orderId: string; kind: AttemptKind; sequence: number;
  state: 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'responded' | 'failed' | 'skipped' | 'cancelled';
  scheduledFor: string; sentAt: string | null; stateDetail: string | null;
  templateId: string | null; loggedByUserId: string | null;
  responseSummaries: { id: string; type: BuyerResponseType; rawText: string | null;
                       capturedVia: string; capturedAt: string }[];
}

export interface DeliveryWindowDTO {
  id: string; siteId: string; zoneCode: string; date: string;
  startsAt: string; endsAt: string; dayPart: 'morning' | 'afternoon' | 'evening' | 'night';
  capacity: number; committed: number; labelAr: string; labelEn: string;
}

export interface EligibleWindow extends DeliveryWindowDTO {
  remaining: number;          // capacity − committed (never < 0)
  eligibleForLeadTime: boolean;   // false → shown-but-gated in the sheet (visible, never hidden)
}

export interface RiskComponentDTO {
  kind: 'buyer-history' | 'value-band' | 'confirmation-latency' | 'channel-engagement'
      | 'address-quality' | 'buyer-tenure';
  rawValue: number; normalized: number; weight: number; points: number;
  explanationAr: string; explanationEn: string;
}

export interface RiskScoreDTO {
  id: string; orderId: string; totalPoints: number; band: RiskBand;
  components: RiskComponentDTO[];
  engine: 'rule-scorecard' | 'model-assisted';   // provenance displayed in UI (contract rule 4)
  policyVersion: number; computedAt: string; computedByUserId: string | null;
}

export interface RiskPolicyDTO {
  version: number;
  weights: Record<'buyer-history' | 'value-band' | 'confirmation-latency' | 'channel-engagement'
                  | 'address-quality' | 'buyer-tenure', number>;   // sums to 1
  valueCap: number;
  bandThresholds: { lowMin: number; highMax: number };
  holdRules: { overCapToHold: boolean; highBandOverHalfCapToHold: boolean };
  historyWindowDays: number; newBuyerNeutralScore: number;
  publishedAt: string; publishedByUserId: string;
}

export interface RiskSimulationDTO {
  currentPolicy: RiskPolicyDTO; proposedPolicy: RiskPolicyDTO;
  ordersEvaluated: number;
  bandRollup: { band: RiskBand; currentCount: number; proposedCount: number }[];
  biggestMovers: { orderId: string; orderRef: string; currentTotal: number; proposedTotal: number;
                   currentBand: RiskBand; proposedBand: RiskBand }[];   // top 5 by |delta|
}

export interface MessageTemplateDTO {
  id: string; slot: AttemptKind | 'final-notice' | 'cancel-ack' | 'window-quick-replies';
  bodyAr: string; bodyEn: string;
  quickReplyWindowOptions: boolean; keypadMenuWindowOptions: boolean;
  version: number; updatedAt: string; updatedByUserId: string;
}

export interface MessagePreview {
  templateId: string; orderId: string;
  buyerLocale: 'ar' | 'en';               // the BUYER's locale, not the console's (05 direction model)
  composedBody: string;                   // parameters filled; bidi-isolated interpolation points
  quickReplies: { id: string; label: string; windowId: string | null }[];  // as the buyer sees them
  keypadMenu: string | null;              // numbered window menu for voice rungs
}

export interface ManifestSummary {
  id: string; siteId: string; routeDate: string;
  status: 'draft' | 'sealed' | 'exported';
  rollup: { count: number; totalValue: number;
            windows: { windowId: string; labelAr: string; labelEn: string; count: number }[];
            bands: { low: number; medium: number; high: number }; agreementOwed: number };
  sealedAt: string | null; sealedByUserId: string | null;
  exportedAt: string | null; artifactId: string | null;
  nextManifestPath: { routeDate: string } | null;   // the late-order answer (CP-5.4)
}

export interface NotificationEventDTO {
  id: string; userId: string;
  kind: 'agreement-stamped' | 'hold-awaiting-decision' | 'ladder-transition'
      | 'auto-cancelled' | 'capacity-warning' | 'policy-published' | 'outcome-recorded';
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // P21 ladder
  payload: Record<string, string>; createdAt: string; seenAt: string | null;
}

export interface ActivityEntryDTO {
  id: string; actorUserId: string | null; action: string; targetId: string;
  detail: Record<string, string>; at: string;
}

export interface JobDTO<T = unknown> {
  id: string; kind: 'order-import' | 'manifest-export' | 'ledger-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T; result?: T;
  error?: { code: ErrorCode; message: string; correlationId: string };
}

// Live order events (subscribeOrderEvents payload)
export type OrderEvent =
  | { type: 'order.imported'; orderId: string; orderRef: string }
  | { type: 'order.triaged'; orderId: string; band: RiskBand; total: number }
  | { type: 'order.held'; orderId: string; holdKind: string }
  | { type: 'ladder.started'; orderId: string; expiresAt: string }
  | { type: 'attempt.state'; orderId: string; attemptId: string; kind: AttemptKind; state: string }
  | { type: 'attempt.scheduled'; orderId: string; attemptId: string; scheduledFor: string }
  | { type: 'response.captured'; orderId: string; responseId: string; responseType: BuyerResponseType }
  | { type: 'agreement.stamped'; orderId: string; windowId: string; remaining: number }
  | { type: 'order.resolved'; orderId: string; status: OrderStatus; reason: string }
  | { type: 'window.capacity'; windowId: string; remaining: number }
  | { type: 'manifest.sealed'; manifestId: string; count: number }
  | { type: 'outcome.recorded'; orderId: string; outcome: string };
export type OrderEventSink = (event: OrderEvent) => void;

// ===== The Adapter (v1) =====
export interface CodOrderConfirmationAdapterV1 {
  // Session & identity
  getSession(): Promise<Result<Session, AdapterError>>;

  // Orders (abstract source — paste is the LOOP-5 primary path; a bound order
  // channel is 08 N1, a binding-time upgrade, never a UI assumption)
  listCodOrders(query: CursorQuery<CodOrderFilter, CodOrderSort>): Promise<Result<Page<CodOrderSummary>, AdapterError>>;
  getCodOrder(id: string): Promise<Result<CodOrderSummary & { attempts: AttemptSummary[]; responses: { id: string; type: BuyerResponseType; rawText: string | null; capturedVia: string; capturedAt: string; capturedByUserId: string | null }[]; risk: RiskScoreDTO | null }, AdapterError>>;
  importOrders(input: { format: 'csv' | 'tsv'; content: string; defaultSiteId: string; idempotencyKey: string }): Promise<Result<JobDTO<{ imported: number; awaitingRows: number; failedRows: { row: number; issue: string }[] }>, AdapterError>>;
  setOrderHold(input: { orderId: string; held: boolean; reason: string; idempotencyKey: string }): Promise<Result<CodOrderSummary, AdapterError>>;   // releasing a hold may auto-start the ladder per policy
  cancelCodOrder(input: { orderId: string; reason: 'merchant-decision' | 'stock-out' | 'duplicate' | 'other'; note?: string; idempotencyKey: string }): Promise<Result<CodOrderSummary, AdapterError>>;
  startLadder(input: { orderId: string; idempotencyKey: string }): Promise<Result<{ orderId: string; ladderExpiresAt: string; firstAttemptScheduledFor: string }, AdapterError>>;

  // Ladder engine
  getLadderPolicy(siteId?: string): Promise<Result<LadderPolicyDTO, AdapterError>>;
  updateLadderPolicy(input: Omit<LadderPolicyDTO, 'version' | 'publishedAt' | 'publishedByUserId' | 'nextEligibleSendCalendar'> & { idempotencyKey: string }): Promise<Result<LadderPolicyDTO, AdapterError>>;
  rescheduleAttempt(input: { orderId: string; attemptId: string; toAbsolute?: string; deltaMinutes?: number; reason?: string }): Promise<Result<AttemptSummary, AdapterError>>;   // defer OR advance; engine validates quiet hours + expiry (contract rule 7)
  logManualContact(input: { orderId: string; kind: 'call' | 'note'; outcome: 'confirmed-with-window' | 'confirmed-no-window' | 'cancelled' | 'reschedule-request' | 'unreachable' | 'wrong-number'; note?: string; idempotencyKey: string }): Promise<Result<{ orderId: string; attemptId: string; orderStatus: OrderStatus }, AdapterError>>;
  recordBuyerResponse(input: { orderId: string; type: BuyerResponseType; windowId?: string; rawText?: string; capturedVia: 'agent-capture' | 'manual-call'; attemptId?: string; idempotencyKey: string }): Promise<Result<{ orderId: string; responseId: string; agreementId: string | null; orderStatus: OrderStatus }, AdapterError>>;

  // Delivery windows (one catalog, three rungs — CP-3.3)
  listDeliveryWindows(query: CursorQuery<{ siteId?: string; zoneCode?: string; date?: string; dateFrom?: string; dateTo?: string }, 'date'>): Promise<Result<Page<DeliveryWindowDTO>, AdapterError>>;
  upsertDeliveryWindow(input: Omit<DeliveryWindowDTO, 'committed'> & { idempotencyKey: string }): Promise<Result<DeliveryWindowDTO, AdapterError>>;
  proposeWindowsForOrder(orderId: string): Promise<Result<EligibleWindow[], AdapterError>>;   // zone-matched, capacity>0, lead-time & horizon aware; bounded ≤ 24

  // Risk (deterministic floor + declared optional enrichment — contract rule 4)
  computeRiskScore(input: { orderId: string; note?: string }): Promise<Result<RiskScoreDTO, AdapterError>>;   // appends immutable row; UI-visible recompute names the actor
  getRiskPolicy(): Promise<Result<RiskPolicyDTO, AdapterError>>;
  updateRiskPolicy(input: RiskPolicyDTO & { simulationConfirmed: boolean; idempotencyKey: string }): Promise<Result<RiskPolicyDTO, AdapterError>>;   // simulationConfirmed false → VALIDATION (contract rule 3)
  simulateRiskPolicy(input: { proposed: RiskPolicyDTO }): Promise<Result<RiskSimulationDTO, AdapterError>>;

  // Buyers
  listBuyers(query: CursorQuery<BuyerFilter, BuyerSort>): Promise<Result<Page<BuyerSummary>, AdapterError>>;
  getBuyer(id: string): Promise<Result<BuyerSummary & { orders: { orderId: string; orderRef: string; status: OrderStatus; outcome: string | null; createdAt: string }[] }, AdapterError>>;
  setBuyerStatus(input: { buyerId: string; status: 'active' | 'blocked'; reason: string; idempotencyKey: string }): Promise<Result<BuyerSummary, AdapterError>>;   // manager+ (PERMISSION class); reason REQUIRED on block

  // Templates (bilingual, versioned — human-authored only)
  listMessageTemplates(query: CursorQuery<{ slot?: string[] }, 'slot'>): Promise<Result<Page<MessageTemplateDTO>, AdapterError>>;
  upsertMessageTemplate(input: Omit<MessageTemplateDTO, 'version' | 'updatedAt' | 'updatedByUserId'> & { idempotencyKey: string }): Promise<Result<MessageTemplateDTO, AdapterError>>;
  previewMessage(input: { templateId: string; orderId: string }): Promise<Result<MessagePreview, AdapterError>>;

  // Manifests
  listHandoffManifests(query: CursorQuery<{ siteId?: string; status?: ('draft' | 'sealed' | 'exported')[]; routeDate?: string }, 'routeDate'>): Promise<Result<Page<ManifestSummary>, AdapterError>>;
  createHandoffManifest(input: { siteId: string; routeDate: string; orderIds?: string[]; byFilter?: CodOrderFilter; idempotencyKey: string }): Promise<Result<ManifestSummary, AdapterError>>;   // engine admits confirmed orders only; exclusions named in details (contract rule 8)
  sealHandoffManifest(input: { manifestId: string; confirmedCount: number; idempotencyKey: string }): Promise<Result<ManifestSummary, AdapterError>>;   // confirmedCount mismatch → CONFLICT (the review gate is contractual)
  exportManifest(input: { manifestId: string; idempotencyKey: string }): Promise<Result<JobDTO<{ artifactId: string; expiresAt: string; orderCount: number }>, AdapterError>>;

  // Ambient
  listActivity(query: CursorQuery<{ actorUserId?: string | null; action?: string[]; targetId?: string; since?: string; until?: string }, 'at'>): Promise<Result<Page<ActivityEntryDTO>, AdapterError>>;
  exportConfirmationLedger(input: { from: string; to: string; orderId?: string; idempotencyKey: string }): Promise<Result<JobDTO<{ artifactId: string; expiresAt: string; entries: number }>, AdapterError>>;
  listNotifications(query: CursorQuery<{ unseenOnly?: boolean; kind?: NotificationEventDTO['kind'][] }, 'createdAt'>): Promise<Result<Page<NotificationEventDTO>, AdapterError>>;
  markNotificationsSeen(input: { ids: string[]; allSeen?: boolean }): Promise<Result<{ marked: number }, AdapterError>>;
  subscribeOrderEvents(sink: OrderEventSink): Promise<() => void>;          // returns unsubscribe

  // Jobs (async-contract §2; imports + both export classes)
  getJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;
  retryJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;     // failed-rows/items only (async-contract §4)
  cancelJob(id: string): Promise<Result<{ cancelled: true }, AdapterError>>;

  // People (manager+ surface)
  listUsers(query: CursorQuery<{ role?: Role[]; status?: ('active' | 'suspended')[] }, 'displayName'>): Promise<Result<Page<UserSummary>, AdapterError>>;
  inviteUser(input: { displayName: string; role: Role; siteIds: string[]; locale: 'ar' | 'en' }): Promise<Result<UserSummary, AdapterError>>;
  updateUser(input: { userId: string; role?: Role; siteIds?: string[]; locale?: 'ar' | 'en'; status?: 'active' | 'suspended' }): Promise<Result<UserSummary, AdapterError>>;
}
```

## Contract rules

1. **Authoritative adapter**: optimistic writes (P03) and the offline queue (P20) live in UI hooks; the adapter always confirms and reconciles — a queued manual-contact log or response capture that reaches a resolved order resolves to a discard notice, never a phantom write (CP-6.10).
2. **Idempotency**: `importOrders`, `setOrderHold`, `cancelCodOrder`, `startLadder`, `logManualContact`, `recordBuyerResponse`, `updateLadderPolicy`, `updateRiskPolicy`, `setBuyerStatus`, `upsertDeliveryWindow`, `upsertMessageTemplate`, `createHandoffManifest`, `sealHandoffManifest`, `exportManifest`, `exportConfirmationLedger` take `idempotencyKey` — resubmission after reconnect never double-writes a response, double-seals a manifest, or double-imports a batch (async-contract §5). The mock demonstrates this (07c §3).
3. **The simulation gate is contractual**: `updateRiskPolicy` with `simulationConfirmed: false` returns VALIDATION with details naming `simulationConfirmed` — policy publishes must pass through `simulateRiskPolicy` evidence first (CP-6.2; the gate is not UI theater).
4. **Deterministic floor + provenance**: `computeRiskScore` MUST compute the rule-scorecard result (07c §2) for every call; when the optional model enrichment (08 N6) is bound the returned score MAY carry `engine: 'model-assisted'`, but the scorecard result is retained as floor data, the engine field is always truthful, and any enrichment failure degrades to the scorecard result within the same call (never a spinner, never a missing score — ai-native-patterns §8).
5. **Evidence chains are immutable**: `recordBuyerResponse` with `type: 'confirm'` and a `windowId` creates exactly ONE `WindowAgreement` chained to (responseId, attemptId, agreedAt); agreements are never edited — reschedules supersede forward (`supersededById`), keeping the full chain for disputes (02 Salem; 07a state machine).
6. **Sealed means sealed**: after `sealHandoffManifest` succeeds, no operation adds, removes, or edits the manifest's orders — late confirmations and cancellations are surfaced through the next-manifest path (`nextManifestPath`) and post-seal flags; `sealHandoffManifest` requires the reviewer to echo `confirmedCount`, and a mismatch returns CONFLICT (the review gate is in the contract, CP-5.3).
7. **Quiet hours are engine law**: attempt scheduling (auto and `rescheduleAttempt`) validates against the site's ladder policy quiet hours and the ladder expiry — a reschedule into a quiet window returns VALIDATION naming the rule and the next eligible time; the engine never dispatches inside quiet hours (02 Hessa's objection is a contract guarantee).
8. **Nothing silently dropped**: blocked-buyer and over-cap orders import to `held-review` with `holdReason` named; manifest creation excludes non-confirmed orders and returns the exclusions in error `details` when invoked on a selection containing them; capacity-exhausted windows return as `eligibleForLeadTime: false`/`remaining: 0` entries where relevant — the visible-but-gated discipline (P01-adjacent) is contractual.
9. **Bilingual copy parity**: every buyer-facing or explanation string arrives from the adapter as composable bilingual data — `RiskComponentDTO.explanationAr/En`, `DeliveryWindowDTO.labelAr/En`, `MessageTemplateDTO.bodyAr/En`, manifest rollup labels in both locales — with Western numerals rendered in BOTH locales (ledger numeral policy; copy-voice §1.7). The UI never machine-translates contract copy; the glossary pinned in 11 §I is the only vocabulary.
10. **Ledger completeness**: every consequential mutation (import, hold, cancel, ladder start, attempt send, reschedule, manual contact, response, agreement, buyer status, template publish, policy publish, manifest seal/export, job lifecycle) appends an `ActivityEntry` naming the actor (or null for engine actions with policy version in `detail`) — no mutation path bypasses the accountability record (P17; 00 success signal 4).
11. **Search normalization**: `search` normalizes Arabic variants (rtl-rules §4) — implementations must implement it; the contract demands it (buyer/phone/order lookup by transliterated or Arabic names).
12. **No-orphan rule**: every method traces to flows in 03 (Tables A/B, 40/40 both directions); every flow operation has a method. Verified at Critic pass. The 40-method count exceeds the portfolio 20–35 band; the deviation is recorded and justified in 12 Q-16 (two-shell flagship scope: queue + ladder engine + agreement + manifest + policy/people/buyers/templates/ambient surfaces, each flow-traced).
