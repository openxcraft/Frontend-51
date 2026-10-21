# 07b — Adapter Contract: shift-swap-marketplace (TypeScript, v1)

SME-G pass · Backend-agnostic by construction: no REST verbs, no provider names, no transport assumptions. The UI talks ONLY to this interface; binding to a real backend later = implementing this interface in one adapter file. Version: **v1** — breaking changes require `ShiftSwapAdapterV2`, never modified signatures. LOOP-15 checklist satisfied: full 7-class error taxonomy, typed pagination/sort/filter, auth-agnostic session model, idempotency keys on job-creating operations. **TypeScript types only** — no implementation code in this contract.

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
  details?: Record<string, string[]>;    // field/rule → issues (ValidationError names the failed rule)
}

// Auth-agnostic session: implementations resolve identity however their
// environment dictates (worker phone-identity, enterprise SSO — 08 N4).
// The UI never sees a provider.
export interface Session {
  workerId: string;
  workspaceId: string;
  role: 'worker' | 'supervisor' | 'ops-lead';
  locale: 'ar' | 'en';
  teamIds: string[];
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export interface CursorQuery<F, S> {
  filter?: F;
  sort: S;
  sortDir: 'asc' | 'desc';
  search?: string;   // Arabic-normalized server-side (rtl-rules §4: alef/taa-marbuta/yaa variants, tashkeel stripped)
  cursor?: string;
  limit: number;
}

// ===== Domain types (mirror 07a; entity contracts live there) =====
export type Role = 'worker' | 'supervisor' | 'ops-lead';

export interface WorkerSummary {
  id: string; displayName: string; role: Role; teamIds: string[];
  seniorityAnchorDate: string; swapBalance: number;
  activeQualificationIds: string[]; status: 'active' | 'suspended-from-swaps' | 'archived';
}

export interface WorkerFilter {
  teamId?: string; role?: Role; status?: WorkerSummary['status'][];
  qualificationId?: string; qualificationExpiringWithinDays?: number;
}
export type WorkerSort = 'displayName' | 'seniority' | 'swapBalance';

export interface QualificationSummary {
  id: string; code: string; nameAr: string; nameEn: string;
  renewalMonths: number | null;
  kind: 'skill' | 'certificate' | 'role-band' | 'jurisdiction-eligibility';
  conflictsWithIds: string[];
  holderCount: number;
}

export interface ShiftSummary {
  id: string; teamId: string; assignedWorkerId: string;
  startsAt: string; endsAt: string; breakMinutes: number; site: string;
  requiredQualificationIds: string[];
  status: 'scheduled' | 'open-swap' | 'swap-pending' | 'covered' | 'completed' | 'cancelled-upstream';
  source: 'schedule-import' | 'manual-entry';
  sourceImportedAt: string | null;
  hasOpenOffer: boolean;
}

export interface ShiftFilter {
  teamId?: string; assignedWorkerId?: string; status?: ShiftSummary['status'][];
  from?: string; to?: string;                 // ISO window
  source?: ('schedule-import' | 'manual-entry')[];
}
export type ShiftSort = 'startsAt' | 'status';

export interface SwapOfferSummary {
  id: string; shiftId: string; offeringWorkerId: string;
  startsAt: string; endsAt: string; site: string; teamId: string;
  note: string | null; postedAt: string; expiresAt: string;
  status: 'open' | 'awaiting-supervisor' | 'matched' | 'withdrawn' | 'expired';
  requestCount: number;
  requiredQualificationIds: string[];
}

export interface SwapOfferFilter {
  teamId?: string; site?: string; status?: SwapOfferSummary['status'][];
  offeringWorkerId?: string;                    // "my offers"
  from?: string; to?: string;
  viewerFit?: 'qualified' | 'not-qualified' | 'all';   // visible-but-gated cards (CP-2.2) — never hidden
}
export type SwapOfferSort = 'startsAt' | 'postedAt' | 'requestCount';

export interface SwapRequestSummary {
  id: string; offerId: string; requestingWorkerId: string;
  note: string | null; createdAt: string;
  status: 'queued' | 'ranked' | 'accepted' | 'declined-by-outcome' | 'declined-by-supervisor'
        | 'supervisor-approved' | 'cancelled-by-worker' | 'expired';
  currentRanking: number | null;      // live rank while ranked/queued
  fairnessScoreId: string | null;
}

export interface EligibilityReport {
  offerId: string; workerId: string;
  eligible: boolean;
  qualificationGaps: { qualificationId: string; code: string; nameAr: string; nameEn: string }[];
  blackoutViolations: { ruleId: string; kind: string; hoursShort?: number; hoursOver?: number;
                        plainLanguageAr: string; plainLanguageEn: string }[];  // rules named, never vague (CP-2.3)
  restHoursBefore: number | null;     // ribbon inputs (13 §B3)
  restHoursAfter: number | null;
  weeklyHoursIfAccepted: number | null;
}

export interface FairnessRankingRow {
  workerId: string; displayName: string;
  ranking: number; totalPoints: number;
  components: { kind: 'seniority' | 'swap-balance' | 'qualification-coverage' | 'rest-compliance'
              | 'recent-swap-load'; rawValue: number; normalized: number; weight: number; points: number }[];
  rationale: string;                 // bilingual-template-composed, params numeric (deterministic)
}

export interface FairnessPolicyDTO {
  version: number;
  weights: Record<'seniority' | 'swap-balance' | 'qualification-coverage' | 'rest-compliance'
                  | 'recent-swap-load', number>;
  tiebreakOrder: ('seniority' | 'swap-balance' | 'qualification-coverage' | 'rest-compliance'
                  | 'recent-swap-load')[];
  blackoutHardGates: boolean;
  caps: { openOffersPerWorker: number; requestsPerWorkerPerDay: number };
  offerExpiryHoursBeforeShift: number;
  balanceWindowDays: number;
  publishedAt: string; publishedByWorkerId: string;
}

export interface MatchSummary {
  id: string; offerId: string; acceptedRequestId: string;
  offeringWorkerId: string; incomingWorkerId: string; shiftId: string;
  teamId: string; site: string; startsAt: string;
  status: 'pending-supervisor' | 'confirmed' | 'denied' | 'cancelled' | 'blackout-violated';
  createdAt: string;
  ruleFlags: { ruleId: string; kind: string; plainLanguageAr: string; plainLanguageEn: string }[];
  fairnessSnapshot: { policyVersion: number;
    ranking: { workerId: string; ranking: number; totalPoints: number; rationale: string }[];
    selectedWorkerId: string } | null;
}

export interface MatchFilter {
  status?: MatchSummary['status'][]; teamId?: string; site?: string;
  decidedByWorkerId?: string; awaitingDecisionSince?: string;   // SLA aging (CP-4.4)
}
export type MatchSort = 'createdAt' | 'startsAt';

export interface BlackoutRuleDTO {
  id: string; workspaceId: string;
  kind: 'minimum-rest' | 'max-weekly-hours' | 'no-clopening' | 'qualification-required-window'
      | 'date-window' | 'jurisdiction-pack';
  scope: { kind: 'workspace' | 'team' | 'role-band'; ref?: string };
  params: { hours?: number; weeklyHours?: number; startsAt?: string; endsAt?: string;
            qualificationId?: string; packCode?: string };
  active: boolean; notes: string | null;
  plainLanguageAr: string; plainLanguageEn: string;   // rule preview (CP-5.4)
  createdByWorkerId: string; createdAt: string; archivedAt: string | null;
}

export interface NotificationEventDTO {
  id: string; workerId: string;
  kind: 'match-confirmed' | 'supervisor-decision' | 'offer-expired' | 'board-activity'
      | 'qualification-expiring' | 'policy-changed';
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // P21 ladder
  payload: Record<string, string>; createdAt: string; seenAt: string | null;
}

export interface ActivityEntryDTO {
  id: string; actorWorkerId: string; action: string; targetId: string;
  detail: Record<string, string>; at: string;
}

export interface JobDTO<T = unknown> {
  id: string; kind: 'schedule-import' | 'fairness-ledger-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T; result?: T;
  error?: { code: ErrorCode; message: string; correlationId: string };
}

// Live board events (subscribeSwapEvents payload)
export type SwapEvent =
  | { type: 'offer.posted'; offerId: string; teamId: string; startsAt: string }
  | { type: 'offer.withdrawn'; offerId: string; reason: 'worker' | 'upstream-cancel' | 'expired' }
  | { type: 'offer.matched'; offerId: string; matchId: string }
  | { type: 'request.created'; offerId: string; requestCount: number }
  | { type: 'rank.changed'; offerId: string; requestId: string; ranking: number; delta: number }
  | { type: 'match.confirmed'; matchId: string; shiftId: string }
  | { type: 'match.flagged'; matchId: string; ruleKind: string };
export type SwapEventSink = (event: SwapEvent) => void;

// ===== The Adapter (v1) =====
export interface ShiftSwapAdapterV1 {
  // Session & identity
  getSession(): Promise<Result<Session, AdapterError>>;

  // Schedule spine (read + import only — planning is attendance-shift-planner's, LOOP-10/LOOP-3)
  listShifts(query: CursorQuery<ShiftFilter, ShiftSort>): Promise<Result<Page<ShiftSummary>, AdapterError>>;
  getShift(id: string): Promise<Result<ShiftSummary, AdapterError>>;

  // Marketplace: offers
  listSwapOffers(query: CursorQuery<SwapOfferFilter, SwapOfferSort>): Promise<Result<Page<SwapOfferSummary>, AdapterError>>;
  getSwapOffer(id: string): Promise<Result<SwapOfferSummary, AdapterError>>;
  createSwapOffer(input: { shiftId: string; note?: string; idempotencyKey: string }): Promise<Result<SwapOfferSummary, AdapterError>>;
  cancelSwapOffer(id: string, reason: 'worker-choice' | 'upstream-change'): Promise<Result<SwapOfferSummary, AdapterError>>;

  // Marketplace: requests
  createSwapRequest(input: { offerId: string; note?: string; idempotencyKey: string }): Promise<Result<SwapRequestSummary, AdapterError>>;
  cancelSwapRequest(id: string): Promise<Result<SwapRequestSummary, AdapterError>>;
  listMySwapRequests(query: CursorQuery<{ status?: SwapRequestSummary['status'][] }, 'createdAt'>): Promise<Result<Page<SwapRequestSummary>, AdapterError>>;
  listRequestsForOffer(offerId: string): Promise<Result<SwapRequestSummary[], AdapterError>>;   // ladder (bounded by cap)

  // Fairness engine (deterministic, inspectable — declared non-AI)
  checkSwapEligibility(input: { offerId: string; workerId?: string }): Promise<Result<EligibilityReport, AdapterError>>;
  computeFairnessRanking(offerId: string): Promise<Result<FairnessRankingRow[], AdapterError>>;
  getFairnessPolicy(): Promise<Result<FairnessPolicyDTO, AdapterError>>;
  updateFairnessPolicy(input: FairnessPolicyDTO & { simulationConfirmed: boolean }): Promise<Result<FairnessPolicyDTO, AdapterError>>;

  // Matching & governance
  acceptSwapRequest(input: { requestId: string; idempotencyKey: string }): Promise<Result<MatchSummary, AdapterError>>;
  denySwapRequest(input: { requestId: string; reason: string }): Promise<Result<SwapRequestSummary, AdapterError>>;
  listMatches(query: CursorQuery<MatchFilter, MatchSort>): Promise<Result<Page<MatchSummary>, AdapterError>>;
  recordSupervisorDecision(input: { matchId: string; decision: 'approved' | 'denied';
    rationale?: string;                                            // REQUIRED on deny (CP-4.3; adapter rejects otherwise)
    rationaleTemplate?: 'coverage-risk' | 'rest-rule' | 'qualification-concern' | 'other';
    idempotencyKey: string }): Promise<Result<MatchSummary, AdapterError>>;

  // Rules spine
  listBlackoutRules(query: CursorQuery<{ kind?: BlackoutRuleDTO['kind'][]; activeOnly?: boolean }, 'createdAt'>): Promise<Result<Page<BlackoutRuleDTO>, AdapterError>>;
  upsertBlackoutRule(rule: Omit<BlackoutRuleDTO, 'id' | 'plainLanguageAr' | 'plainLanguageEn' | 'createdByWorkerId' | 'createdAt' | 'archivedAt'> & { id?: string }): Promise<Result<BlackoutRuleDTO, AdapterError>>;
  archiveBlackoutRule(id: string): Promise<Result<BlackoutRuleDTO, AdapterError>>;
  listQualifications(query: CursorQuery<{ kind?: QualificationSummary['kind'][]; expiringWithinDays?: number }, 'code'>): Promise<Result<Page<QualificationSummary>, AdapterError>>;
  upsertQualification(input: Omit<QualificationSummary, 'holderCount'> & { id?: string }): Promise<Result<QualificationSummary, AdapterError>>;
  assignQualification(input: { workerId: string; qualificationId: string; expiresAt?: string | null }): Promise<Result<{ workerId: string; qualificationId: string; expiresAt: string | null }, AdapterError>>;

  // People
  listWorkers(query: CursorQuery<WorkerFilter, WorkerSort>): Promise<Result<Page<WorkerSummary>, AdapterError>>;
  updateWorker(input: { workerId: string; teamIds?: string[]; seniorityAnchorDate?: string; role?: Role; status?: WorkerSummary['status'] }): Promise<Result<WorkerSummary, AdapterError>>;
  inviteWorker(input: { displayName: string; role: Role; teamIds: string[]; seniorityAnchorDate: string }): Promise<Result<WorkerSummary, AdapterError>>;

  // Ambient
  listNotifications(query: CursorQuery<{ unseenOnly?: boolean; kind?: NotificationEventDTO['kind'][] }, 'createdAt'>): Promise<Result<Page<NotificationEventDTO>, AdapterError>>;
  markNotificationsSeen(input: { ids: string[]; allSeen?: boolean }): Promise<Result<{ marked: number }, AdapterError>>;
  subscribeSwapEvents(sink: SwapEventSink): Promise<() => void>;          // returns unsubscribe
  listActivity(query: CursorQuery<{ actorWorkerId?: string; action?: string[]; since?: string }, 'at'>): Promise<Result<Page<ActivityEntryDTO>, AdapterError>>;

  // Jobs (async-contract §2; imports + ledger exports)
  importScheduleSource(input: { format: 'csv' | 'tsv'; content: string; defaultTeamId: string; idempotencyKey: string }): Promise<Result<JobDTO<{ importedShifts: number; awaitingRows: number; failedRows: { row: number; issue: string }[] }>, AdapterError>>;
  exportFairnessLedger(input: { from: string; to: string; teamId?: string; idempotencyKey: string }): Promise<Result<JobDTO<{ artifactId: string; expiresAt: string; entries: number }>, AdapterError>>;
  getJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;
  retryJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;   // failed-rows-only (async-contract §4)
  cancelJob(id: string): Promise<Result<{ cancelled: true }, AdapterError>>;
}
```

## Contract rules

1. **Authoritative adapter**: optimistic writes (P03) and the offline queue (P20) live in UI hooks; the adapter always confirms and reconciles — a queued request that reaches a dead offer resolves to a discard notice, never a phantom post (CP-6).
2. **Idempotency**: `createSwapOffer`, `createSwapRequest`, `acceptSwapRequest`, `recordSupervisorDecision`, `importScheduleSource`, `exportFairnessLedger` take `idempotencyKey` — resubmission after reconnect never double-posts a request or double-decides a match (async-contract §5). The mock demonstrates this (07c §2).
3. **Deny requires rationale**: `recordSupervisorDecision` with `decision: 'denied'` and empty rationale returns VALIDATION with details naming `rationale` — the contract itself enforces denials that explain themselves (02 objection matrix).
4. **Ranking determinism**: `computeFairnessRanking` is a pure function of declared inputs (07a determinism statement) — identical inputs, identical output, identical rationale strings; contract-level, so any binding inherits it.
5. **Visible-but-gated**: `listSwapOffers` with `viewerFit` returns non-qualified offers with gaps data — the board never silently hides rule-blocked items (CP-2.2; the gate is copy, not absence).
6. **Search normalization**: `search` normalizes Arabic variants (rtl-rules §4) — implementations must implement it; the contract demands it.
7. **No orphan rule**: every method traces to flows in 03 (Tables A/B, 37/37 both directions); every flow operation has a method. Verified at Critic pass.
8. **Jobs are honest**: import/export progress is determinate per row; `retryJob` re-runs failed rows only; export artifacts carry `expiresAt` (async-contract §2 expired state) and the UI shows the window (11).
9. **Bilingual copy parity**: every worker-facing explanation arrives from the adapter as composable bilingual data — `EligibilityReport.blackoutViolations` and `BlackoutRuleDTO` carry `plainLanguageAr`/`plainLanguageEn` pairs, rationale strings are template-composed with numeric params, and numerals render Western in BOTH locales (ledger numeral policy; copy-voice §1.7). The UI never machine-translates or re-numeralates contract copy — the glossary pinned in 11 §I is the only vocabulary.
10. **Ledger completeness**: every consequential mutation (offer post/cancel, request create/cancel, accept, deny, supervisor decision, rule change, policy publish, import/export job) appends an `ActivityEntry`, and every supervisor decision freezes a `fairnessSnapshot` naming `policyVersion` — no mutation path exists that bypasses the accountability record (P17; 00 success signal 4).
