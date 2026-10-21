# 07a — Data Contract: shift-swap-marketplace (backend-agnostic)

SME-G pass · Entities, relationships, operations, state machines. Every entity/operation below is justified by a flow in 03; every operation appears as an adapter method in 07b (bidirectional no-orphan proof in 03 Tables A/B). No backend, provider, storage, or transport is named — this is the source of truth from which any backend can be built or bound. **TypeScript types only** (types + pure interface shapes; no implementation code).

## Entities (TypeScript)

```ts
// ===== Roles & people =====
export type Role = 'worker' | 'supervisor' | 'ops-lead';
export type Locale = 'ar' | 'en';

export interface Worker {
  id: string;
  workspaceId: string;
  displayName: string;            // bidi-isolated on render (rtl-rules §2)
  role: Role;                     // structural roles only (02 Tariq: no per-worker ACL at v1)
  teamIds: string[];              // site/venue teams the worker belongs to
  seniorityAnchorDate: string;    // ISO date; tenure math anchors here (deterministic)
  locale: Locale;                 // worker's notification locale
  swapBalance: number;            // derived: swaps received − swaps given, rolling window (FairnessPolicy.balanceWindowDays)
  qualificationIds: string[];     // via WorkerQualification (active, non-expired only)
  status: 'active' | 'suspended-from-swaps' | 'archived';
  joinedAt: string;
}

export interface Qualification {
  id: string;
  workspaceId: string;
  code: string;                   // unique per workspace (e.g., 'FOOD-SAFETY-L2')
  nameAr: string;
  nameEn: string;
  description: string;
  renewalMonths: number | null;   // null = never expires
  kind: 'skill' | 'certificate' | 'role-band' | 'jurisdiction-eligibility';
    // role-band / jurisdiction-eligibility model Saudization/Nitaqat-shaped constraints (01 §5)
  conflictsWithIds: string[];     // surfaced, never auto-resolved (LOOP-9 pattern)
}

export interface WorkerQualification {
  id: string;
  workerId: string;
  qualificationId: string;
  grantedAt: string;
  expiresAt: string | null;       // drives visible degradation on the board (02 Yusuf objection)
  grantedByWorkerId: string;      // audit chain
}

// ===== Schedule spine (imported or manual; never authored here — LOOP-10) =====
export interface Shift {
  id: string;
  workspaceId: string;
  teamId: string;
  assignedWorkerId: string;
  startsAt: string;               // ISO 8601 with offset
  endsAt: string;
  breakMinutes: number;
  site: string;                   // bidi-isolated label
  requiredQualificationIds: string[];
  source: 'schedule-import' | 'manual-entry';   // abstract schedule source (08 N1) or LOOP-5 manual path
  sourceImportedAt: string | null;               // staleness surface ("آخر استيراد…", 11)
  status: 'scheduled' | 'open-swap' | 'swap-pending' | 'covered' | 'completed' | 'cancelled-upstream';
}

// ===== Marketplace =====
export interface SwapOffer {
  id: string;
  workspaceId: string;
  shiftId: string;
  offeringWorkerId: string;
  note: string | null;            // ≤140 chars, bidi-isolated (CP-1.4)
  postedAt: string;
  expiresAt: string;              // policy cutoff before shift start (CP-1.6)
  status: 'open' | 'awaiting-supervisor' | 'matched' | 'withdrawn' | 'expired';
  requestCount: number;           // denormalized for board rendering
}

export interface SwapRequest {
  id: string;
  offerId: string;
  requestingWorkerId: string;
  note: string | null;            // ≤140 chars
  createdAt: string;
  fairnessScoreId: string;        // computed at request time + on re-rank (07c rules)
  status: 'queued' | 'ranked' | 'accepted' | 'declined-by-outcome' | 'declined-by-supervisor'
        | 'supervisor-approved' | 'cancelled-by-worker' | 'expired';
}

// ===== Fairness (deterministic, inspectable — declared non-AI) =====
export interface FairnessComponent {
  kind: 'seniority' | 'swap-balance' | 'qualification-coverage' | 'rest-compliance' | 'recent-swap-load';
  rawValue: number;               // e.g., tenure months; balance delta; covered-required ratio
  normalized: number;             // 0–1 under the active policy
  weight: number;                 // policy weight at computation time
  points: number;                 // normalized × weight
}

export interface FairnessScore {
  id: string;
  offerId: string;
  workerId: string;
  totalPoints: number;
  components: FairnessComponent[];        // the inspectable math (02 Yusuf: "show me")
  rationale: string;                      // machine-composed from policy templates, bilingual params
  ranking: number;                        // position at computation time
  policyVersion: number;                  // ledger always names the version (02 Tariq)
  computedAt: string;
}

export interface FairnessPolicy {
  version: number;
  weights: Record<FairnessComponent['kind'], number>;   // sums to 1 (VALIDATION otherwise, CP-5.6)
  tiebreakOrder: FairnessComponent['kind'][];
  blackoutHardGates: boolean;    // true: blackout failures exclude from ranking entirely (default)
  caps: { openOffersPerWorker: number; requestsPerWorkerPerDay: number };
  offerExpiryHoursBeforeShift: number;
  balanceWindowDays: number;     // swap-balance rolling window
  publishedAt: string;
  publishedByWorkerId: string;
}

// ===== Matching & governance =====
export interface SwapMatch {
  id: string;
  offerId: string;
  acceptedRequestId: string;
  offeringWorkerId: string;
  incomingWorkerId: string;
  shiftId: string;
  status: 'pending-supervisor' | 'confirmed' | 'denied' | 'cancelled' | 'blackout-violated';
  createdAt: string;
  approvalRecordId: string | null;
}

export interface BlackoutRule {
  id: string;
  workspaceId: string;
  kind: 'minimum-rest' | 'max-weekly-hours' | 'no-clopening' | 'qualification-required-window'
      | 'date-window' | 'jurisdiction-pack';
  scope: { kind: 'workspace' | 'team' | 'role-band'; ref?: string };
  params: { hours?: number; weeklyHours?: number; startsAt?: string; endsAt?: string;
            qualificationId?: string; packCode?: string };
  active: boolean;
  notes: string | null;           // plain-language preview rendered bilingually (CP-5.4)
  createdByWorkerId: string;
  createdAt: string;
  archivedAt: string | null;      // archive, never delete (ledger discipline)
}

export interface ApprovalRecord {
  id: string;
  matchId: string;
  decision: 'approved' | 'denied';
  decidedByWorkerId: string;
  decidedAt: string;
  rationale: string | null;       // REQUIRED on deny (CP-4.3); template + editable note
  rationaleTemplate: 'coverage-risk' | 'rest-rule' | 'qualification-concern' | 'other' | null;
  fairnessSnapshot: {              // top-3 + selected, frozen at decision time (grievance-proof)
    policyVersion: number;
    ranking: { workerId: string; ranking: number; totalPoints: number; rationale: string }[];
    selectedWorkerId: string;
  };
}

// ===== Ambient =====
export interface NotificationEvent {
  id: string;
  workerId: string;
  kind: 'match-confirmed' | 'supervisor-decision' | 'offer-expired' | 'board-activity'
      | 'qualification-expiring' | 'policy-changed';
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // P21 class ladder
  payload: Record<string, string>;
  createdAt: string;
  seenAt: string | null;
}

export interface ActivityEntry {   // P17 — actor-action-target-timestamp
  id: string;
  workspaceId: string;
  actorWorkerId: string;
  action: string;                  // 'offer.posted' | 'request.created' | 'match.accepted' | …
  targetId: string;
  detail: Record<string, string>;
  at: string;
}

export interface Job<T = unknown> {   // async-contract §2 state machine
  id: string;
  kind: 'schedule-import' | 'fairness-ledger-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;                    // per-row partial results (async-contract §4)
  result?: T;
  error?: { code: string; message: string; correlationId: string };
}
```

## Relationships

Workspace 1—N Worker, 1—N Qualification, 1—N BlackoutRule, 1—N Shift, 1—N ActivityEntry, 1—1 FairnessPolicy (versioned history retained). Worker 1—N WorkerQualification N—1 Qualification. Shift 1—0..1 SwapOffer (an open shift has at most one live offer; a covered swap closes it). SwapOffer 1—N SwapRequest. SwapRequest 1—1 FairnessScore (per computation; re-ranks create new score rows, history preserved). SwapOffer 1—0..1 SwapMatch (accepted request creates exactly one). SwapMatch 1—0..1 ApprovalRecord. Worker 1—N NotificationEvent. Job 1—0..1 export artifact (expiry window per async-contract §2). All list-bearing relations paginate via the typed Page model (07b).

## State machines (declared transitions only — others are contract violations)

- **SwapOffer**: open → (accept) awaiting-supervisor → (decision) matched | denied-back-to-open* | expired | withdrawn. *denied-back-to-open is a supervisor-deny outcome where the offer re-opens at the offerer's choice (CP-3.5).
- **SwapRequest**: queued → ranked → accepted → supervisor-approved | declined-by-supervisor | blackout-violated→expired; or declined-by-outcome (another request won) / cancelled-by-worker / expired at any pre-accept point.
- **SwapMatch**: pending-supervisor → confirmed | denied | cancelled | blackout-violated (auto-flag on upstream schedule change, CP-3 edge) → re-ranked path creates a NEW match (immutability preserved).
- **Shift**: scheduled → open-swap → swap-pending → covered → completed; cancelled-upstream is terminal with reason (never silent deletion of downstream offers — CP-3 edge).
- **Job**: async-contract §2 verbatim.

## Operations (read/write/subscribe — all typed on 07b)

- Session: getSession (auth-agnostic; role + locale routing).
- Shifts: list (query: team, worker, window, status, source; sort: startsAt, status; cursor page), get.
- Offers: list (query: team/site, window, viewer-qualification-fit, mine; sort: startsAt, fit), get, create (with eligibility pre-flight data echoed), cancel (reason).
- Requests: create (re-validates blackout + qualifications server-side), cancel, list mine, list for offer (ladder).
- Fairness: checkEligibility (pre-flight: qualification match + blackout evaluation + structural caps, WITHOUT creating anything), computeRanking (offerId → ranked scores + rationales; used for preview, ladder, snapshot, policy simulation), getPolicy, updatePolicy (versioned publish).
- Matching: accept (offerer selects ranked request → match), deny (request-level decline by offerer), listMatches (supervisor queue + history), recordSupervisorDecision (approve/deny with mandatory rationale on deny).
- Rules: list/upsert/archive blackout rules; list/upsert qualifications; assign worker qualification.
- People: list workers, update worker, invite worker.
- Ambient: list notifications + mark seen; subscribe swap events (live board); list activity; import schedule source (Job); export fairness ledger (Job); get/retry/cancel job.

## State obligations summary (per entity)

Every async operation follows the async-contract state machine; exports carry expiry windows; imports declare partial-results policy (deliver succeeded rows, mark failures, retry scoped to failed rows — §4). Every consequential mutation appends an ActivityEntry (P17). Every supervisor decision freezes a fairnessSnapshot — the ledger is the grievance surface (02 Noora/Tariq). FairnessScore rows are immutable; re-ranking appends. No entity references a provider, transport, or external system by name — external touchpoints are abstract needs in 08 only.

## Determinism statement (declared non-AI — ai-native-patterns §1)

FairnessScore computation is a pure function of (declared inputs: worker records, qualification states, shift set, request set, policy version, blackout rules) → (ranking + rationale). The rationale string is composed from versioned bilingual templates in the policy with numeric parameters — there is no model, no learned weight, no stochastic step. Two evaluations over identical inputs produce identical output (07c §5 guarantees this in the mock; production bindings inherit the contract).
