# 07b — Adapter Contract: loyalty-stamp-card (TypeScript, v1)

SME-G pass · `LoyaltyStampAdapterV1` · 28 operations · full 7-class taxonomy, typed pagination, auth-agnostic session, idempotency keys on every stamp/export submit, declared partial-result policies. TYPES ONLY — no implementation. AI declaration: **declared non-AI** (ai-native-patterns §1) — no operation invokes a model; deterministic rules throughout. Entity semantics (Workspace, LoyaltyProgram, RewardTier, Member, Card, StampEvent, Redemption, PassToken, AuditEntry, InsightsSnapshot, Job (generic `Job<T>`, defaulted to unknown), ExportArtifact):
07a, declared canonically there and part of this contract by reference.

```ts
// Single contract surface. Entity types referenced below are declared canonically
// in 07a and are part of this contract by reference; 07b declares only the
// operational wrappers (summaries, views, job shapes) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (tier authoring rules, policy bounds, daily-cap reached,
 *                                       full-card stamp, expired-card redemption, malformed phone,
 *                                       adjustment without reason, empty export)
 * 'NOT_FOUND'    -> NotFoundError     (unknown pass token, expired artifact, stale program/member links)
 * 'PERMISSION'   -> PermissionError   (staff-role gates, blocked members, unconsented capability classes)
 * 'CONFLICT'     -> ConflictError     (concurrent card-sheet stamps, concurrent redemptions, stale versions)
 * 'RATE_LIMIT'   -> RateLimitError    (export artifacts within the window)
 * 'NETWORK'      -> NetworkError      (lookup/list fetches, job polling, artifact delivery)
 * 'UNKNOWN'      -> UnknownError      (typed retry, correlationId)
 */
export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;
  correlationId: string;
  retryable: boolean;
  details?: Record<string, string[]>;
}

// Auth-agnostic session: the counter PIN, the workspace owner login, and the public
// join code all resolve to this shape; the adapter never knows the provider.
export interface Session {
  workspaceId: string;
  actorKind: 'staff' | 'public-join';
  staffId?: string;                     // present when actorKind = 'staff'
  role?: 'owner' | 'manager' | 'staff'; // staff-role gate inputs (07b rules 3–4)
  locale: 'ar' | 'en';
  joinCode?: string;                    // present when actorKind = 'public-join'
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (summaries + derived views) ----
// Locale and Job<T> are NOT re-declared here — they are canonical in 07a and
// part of this contract by reference (the header's by-reference list).

export interface ProgramSummary {
  id: string;
  nameAr: string; nameEn: string;
  mode: 'classic' | 'ladder';
  stampCount: number;
  status: 'draft' | 'published' | 'archived';
  version: number;
  publishedVersion?: number;
  activeCards?: number;                 // on published programs (read-derived)
  updatedAt: string;
}

export interface TierView {             // the bilingual tier row as staff/pass render it
  tierId: string;
  stampsRequired: number;
  nameAr: string; nameEn: string;
  final: boolean;
}

export interface MemberSummary {
  id: string;
  nameAr?: string; nameEn?: string;      // at least one is present
  phoneHint: string;                     // last 2–4 digits only — masking is a data contract (07a)
  locale: Locale;
  status: 'active' | 'blocked';
  activeCard?: { programId: string; stamps: number; stampCount: number; status: string };
  lastStampAt?: string;
}

export interface CardView {              // the counter sheet + member pass share this shape
  cardId: string;
  memberId: string;
  program: ProgramSummary;
  tiers: TierView[];
  stamps: number;
  cycle: number;
  redeemedTierIds: string[];
  cardStatus: 'active' | 'expiring-soon' | 'expired' | 'archived';
  expiresAt?: string;                    // ISO; present when derivable
  member: MemberSummary;
  passShortCode: string;                 // the 6-char counter code (identity, never authority)
}

export interface StampResult {
  card: CardView;
  stampEventId: string;
  renewal: boolean;                      // true when this stamp opened a new cycle (CP-2 edge)
  cappedDayCount?: number;               // present in the cap VALIDATION detail, not on success
}

export interface RedemptionResult {
  card: CardView;
  receiptLine: { locale: Locale; rewardName: string; actorName: string; at: string };
}

export interface StaffSummary {
  id: string;
  displayNameAr: string; displayNameEn: string;
  role: 'owner' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface AuditEntryView {
  id: string;
  actorNameAr: string; actorNameEn: string;   // self-enrollment renders the join-code actor
  action: string;                              // AuditActionKind (07a)
  targetRef: string;
  targetLabel?: string;                        // member/program display name for SR context
  detail?: string;
  at: string;
}

export interface FlagView {              // deterministic thresholds — computed counts, never verdicts
  kind: 'staff-adjustment-rate' | 'member-cap-attempts';
  subjectLabel: string;
  count: number;
  windowHours: number;
  threshold: number;
  auditFilterHint: { actor?: string; member?: string };
}

export interface PassView {              // token-keyed, read-only — the member's entire surface
  card: CardView;
  storeName: { ar: string; en: string };
  memberLocale: Locale;
  retentionStatement: string;            // rendered on the pass (09 privacy posture)
}

export interface ArtifactView {
  artifactId: string;
  kind: 'members-csv';
  url: string;
  expiresAt: string;
  regenerable: boolean;
}

// ---- Contract ----

export interface LoyaltyStampAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // programs (studio + list)
  createProgram(input: {
    nameAr: string; nameEn: string;
    mode: 'classic' | 'ladder';
    stampCount: number;                  // 4–12
    tiers: { stampsRequired: number; nameAr: string; nameEn: string }[];
    policy: { expiryMonths: number; dailyStampCap: number };
  }): Promise<Result<ProgramSummary, AdapterError>>;
  updateProgram(id: string, patch: {
    nameAr?: string; nameEn?: string;
    stampCount?: number;
    tiers?: { stampsRequired: number; nameAr: string; nameEn: string }[];  // full-row replace, versioned
    policy?: { expiryMonths?: number; dailyStampCap?: number };
    baseVersion: number;                 // stale version -> CONFLICT with both payloads
  }): Promise<Result<ProgramSummary, AdapterError>>;
  setProgramStatus(id: string, status: 'published' | 'archived'): Promise<Result<ProgramSummary, AdapterError>>;
  listPrograms(query: {
    filter?: { status?: ProgramSummary['status'][] };
    sort: 'updatedAt' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ProgramSummary>, AdapterError>>;
  getProgram(id: string): Promise<Result<ProgramSummary & { tiers: TierView[] }, AdapterError>>;

  // counter: identification + the card sheet
  lookupMember(query: {
    workspaceId: string;
    by: { qrPayload?: string; shortCode?: string; searchText?: string };
    limit?: number;                      // default 8; normalized bilingual + phone matching (rtl-rules §4)
  }): Promise<Result<{ members: MemberSummary[]; normalizationApplied: string[] }, AdapterError>>;
  getMemberCard(memberId: string, programId?: string): Promise<Result<CardView, AdapterError>>;

  // the staff-verified stamp flow
  issueStamp(input: {
    cardId: string;
    actorStaffId: string;                // staff-attributed or it does not exist (07a invariant)
    idempotencyKey: string;              // double-tap returns the original stamp once
  }): Promise<Result<StampResult, AdapterError>>;
  undoStamp(input: {
    stampEventId: string;
    actorStaffId: string;
  }): Promise<Result<{ card: CardView } , AdapterError>>;   // 120s window + latest-event rule (rule 5)
  redeemReward(input: {
    cardId: string;
    tierId: string;
    actorStaffId: string;
  }): Promise<Result<RedemptionResult, AdapterError>>;      // not undoable by design (rule 6)
  adjustStamps(input: {
    cardId: string;
    delta: number;                       // may be negative; clamps at 0, clamp recorded
    reason: 'counter-error' | 'missing-purchase' | 'goodwill' | 'fraud-correction';
    note?: string;
    actorStaffId: string;                // role manager/owner enforced (rule 3)
    baseVersion: number;                 // stamps + cycle snapshot -> stale -> CONFLICT
  }): Promise<Result<{ card: CardView; clamped: boolean; stampEventId: string }, AdapterError>>;

  // members + enrollment
  enrollMember(input: {
    nameAr?: string; nameEn?: string;
    phone: string;                       // normalized server-side; canonical dedupe (rule 8)
    locale: Locale;
    channel: 'counter' | 'self';
    actorStaffId?: string;               // counter channel; joinCode for self channel
    joinCode?: string;
    nearMatchConfirmToken?: string;      // dedupe honesty: confirm-before-create on near matches
  }): Promise<Result<{ member: MemberSummary; passToken: string }, AdapterError>>;
  listMembers(query: {
    filter?: { status?: ('active' | 'blocked')[]; cardStatus?: string[]; programId?: string };
    search?: string;                     // normalized bilingual search (rtl-rules §4)
    sort: 'lastStampAt' | 'createdAt' | 'nameAr' | 'nameEn';
    cursor?: string; limit: number;
  }): Promise<Result<Page<MemberSummary>, AdapterError>>;
  getMember(id: string): Promise<Result<MemberSummary & {
    timeline: { stampEvents: unknown[]; redemptions: unknown[]; audit: AuditEntryView[] };
  }, AdapterError>>;
  updateMember(id: string, patch: {
    nameAr?: string; nameEn?: string; locale?: Locale; note?: string;
    baseVersion: number;
  }): Promise<Result<MemberSummary, AdapterError>>;
  setMemberStatus(id: string, status: 'blocked' | 'active', reason: string): Promise<Result<MemberSummary, AdapterError>>;

  // pass lifecycle
  createPassToken(input: {
    memberId: string;
    purpose: 'enrollment' | 'rotation';
    actorStaffId?: string;               // rotation is manager-gated (rule 3)
  }): Promise<Result<{ token: string; shortCode: string }, AdapterError>>;
  getPassView(token: string): Promise<Result<PassView, AdapterError>>;   // token-keyed, read-only

  // staff + audit
  listStaff(query: {
    filter?: { role?: ('owner' | 'manager' | 'staff')[]; status?: ('active' | 'inactive')[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<StaffSummary>, AdapterError>>;
  createStaffMember(input: {
    displayNameAr: string; displayNameEn: string;
    role: 'manager' | 'staff';
    counterPin: string;                  // transported once; hashed at binding, never returned
  }): Promise<Result<StaffSummary, AdapterError>>;
  setStaffStatus(id: string, status: 'active' | 'inactive'): Promise<Result<StaffSummary, AdapterError>>;
  listAuditEntries(query: {
    filter?: { actorStaffId?: string; action?: string[]; memberId?: string; since?: string; until?: string };
    cursor?: string; limit: number;      // >200 rows virtualize (P19)
  }): Promise<Result<Page<AuditEntryView> & { flags: FlagView[] }, AdapterError>>;

  // insights + exports + jobs + settings
  getProgramInsights(programId: string, windowDays?: number): Promise<Result<InsightsSnapshot, AdapterError>>;
  exportMembers(input: {
    filter?: { programId?: string; status?: ('active' | 'blocked')[] };
    idempotencyKey: string;              // re-submit returns the original job (rule 7)
  }): Promise<Result<Job<{ artifactId: string; rows: number }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<ArtifactView, AdapterError>>;
  listJobs(query: {
    filter?: { state?: ('queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired')[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  updateWorkspaceSettings(patch: {
    defaultLocale?: Locale;
    policyDefaults?: { expiryMonths?: number; dailyStampCap?: number };
    retentionMonths?: number;            // role owner/manager (rule 3); pass statement re-renders
  }): Promise<Result<{ retentionStatement: string }, AdapterError>>;
}
```

## Rules (binding)

1. **Staff-verified stamps only**: `issueStamp` requires a staff-context session and an `actorStaffId`; member tokens (`getPassView`) are read-only by construction — a member-originated stamp is not representable in this contract (the 00 anti-fraud spine).
2. **Deterministic eligibility**: tier redeemability, card expiry, and daily-cap decisions are pure functions of recorded state (07a invariants; 07c §2 formulas) — the same state always answers the same way; no scoring, no model, no probabilistic gate anywhere.
3. **Role gates**: `adjustStamps`, `setProgramStatus`, `createPassToken(purpose: 'rotation')`, `createStaffMember`, `setStaffStatus`, `updateWorkspaceSettings` require manager/owner; a staff-role call returns PERMISSION naming the gate and the honest scope ("staff seats stamp and redeem; corrections need a manager") — never a generic refusal.
4. **Blocked members**: stamping, redemption, and self-join for a blocked member return PERMISSION with the status and the manager path; the member's records and audit history are untouched (blocking freezes, it never deletes).
5. **Undo window**: `undoStamp` succeeds only when the stamp is the latest event on its card, its source is 'counter', and ≤120 seconds have elapsed (the UI's 7-second affordance is a subset); otherwise VALIDATION directing to the manager adjustment path — undo is bounded, adjustments are ledgered.
6. **Redemption is not undoable**: a mistaken redemption is corrected by `adjustStamps` with a reason (append-only correction), never by reversing the redemption record — the trade-off is declared in 00/12 and the receipt line remains in history.
7. **Idempotency**: `issueStamp` and `exportMembers` carries idempotency keys; a replay returns the original result and never double-stamps or double-exports (async-contract §5).
8. **Concurrency honesty**: `issueStamp`/`redeemReward` validate against current card state at commit — a second register's concurrent stamp surfaces as CONFLICT with the fresh card in `details`, and the cap check runs server-side on the committed order (offline queues re-validate identically — P20).
9. **Bilingual tiers are validated data**: `createProgram`/`updateProgram` reject a tier with a blank `nameAr` or `nameEn`, non-ascending `stampsRequired`, or a final tier that does not equal `stampCount` — VALIDATION names the row and the failing rule; a card's tiers always render both scripts (the unique feature is a contract, not a convention).
10. **Phone canonicalization + dedupe**: enrollment normalizes phone digits (strip non-digits; complete country prefix) and returns the existing member on an exact canonical match — a duplicate member is unrepresentable; near-matches return a confirm-before-create token rather than a silent merge (rule 8 of 07a, operationalized).
11. **Audit completeness**: every listed mutation appends exactly one AuditEntry with actor and timestamp; `listAuditEntries` also returns the deterministic flag set (thresholds fixed in 07c §2.4 — counts, never verdicts); no operation exposes deletion of ledger entries.
12. **Typed pagination on every list; cursors opaque; no orphan methods** — 03's coverage table traces all 28 exactly once.
