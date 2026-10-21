// VERBATIM from specs-source/loyalty-stamp-card/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type StaffRole = 'owner' | 'manager' | 'staff';
export type ProgramMode = 'classic' | 'ladder';
export type ProgramStatus = 'draft' | 'published' | 'archived';
export type CardStatus = 'active' | 'expiring-soon' | 'expired' | 'archived';
export type AdjustmentReason = 'counter-error' | 'missing-purchase' | 'goodwill' | 'fraud-correction';
export type AuditActionKind =
  | 'program-created' | 'program-updated' | 'program-published' | 'program-archived'
  | 'member-enrolled' | 'member-updated' | 'member-blocked' | 'member-unblocked'
  | 'stamp-issued' | 'stamp-undone' | 'stamp-blocked' | 'card-renewed'
  | 'reward-redeemed' | 'stamps-adjusted' | 'pass-issued' | 'pass-rotated'
  | 'staff-created' | 'staff-deactivated' | 'staff-reactivated'
  | 'settings-updated' | 'export-run';
export interface Workspace {
  id: string;
  nameAr: string;                       // bilingual store identity is authored, not translated
  nameEn: string;
  defaultLocale: Locale;                // console chrome default (LOOP-6 proposal: ar)
  joinCode: string;                     // 6-char code on the counter QR; member self-enrollment key
  retentionMonths: number;              // member-data retention posture (09 privacy; 12 Q-11)
  policyDefaults: ProgramPolicy;        // seeds new programs in the studio
  timezone: string;                     // IANA zone; daily-cap calendar + display times
}
export interface ProgramPolicy {
  expiryMonths: number;                 // card expires this long after the last stamp (1–24)
  dailyStampCap: number;                // max counter stamps per member per program per day (1–3)
}
export interface RewardTier {
  id: string;
  stampsRequired: number;               // strictly ascending; final tier equals program.stampCount
  nameAr: string;                       // required — bilingual tiers are the product's spine (00)
  nameEn: string;                       // required — blank locale fails validation (CP-1 edge)
  final: boolean;                       // redeeming a final tier resets the card cycle
}
export interface LoyaltyProgram {
  id: string;
  workspaceId: string;
  nameAr: string;
  nameEn: string;
  mode: ProgramMode;                    // classic = single final tier; ladder = ordered tiers
  stampCount: number;                   // 4–12 (research band 8–10 recommended; 07c seed = 8)
  tiers: RewardTier[];                  // classic: exactly 1, final; ladder: 2–4, ascending
  policy: ProgramPolicy;
  status: ProgramStatus;
  version: number;                      // draft edits bump version; publish pins a published version
  publishedVersion?: number;            // the live card members carry; drafts never leak to members
  createdAt: string;
  updatedAt: string;
}
export interface StaffMember {
  id: string;
  displayNameAr: string;                // audit entries render the actor's name in the reading locale
  displayNameEn: string;
  role: StaffRole;                      // staff: stamp/redeem/lookup/enroll; manager+: adjust/publish/settings
  counterPin: string;                   // hashed at the binding; never rendered (credential-contract posture)
  status: 'active' | 'inactive';        // deactivated staff keep their ledger attribution (append-only)
  createdAt: string;
}
export interface Member {
  id: string;
  nameAr?: string;                      // at least one script is required; both is the norm
  nameEn?: string;
  phoneCanonical: string;               // normalized E.164-shaped digits; displayed masked (last 2–4)
  locale: Locale;                       // pass rendering + receipt line language
  status: 'active' | 'blocked';
  blockReason?: string;                 // required when status = 'blocked' (12 Q-10)
  note?: string;                        // staff-internal, never on the pass
  enrolledChannel: 'counter' | 'self';
  createdAt: string;
}
export interface Card {
  id: string;
  programId: string;
  memberId: string;
  stamps: number;                       // 0..stampCount of the program's published version
  cycle: number;                        // increments on final-tier redemption or expiry renewal
  redeemedTierIds: string[];            // tiers redeemed in the CURRENT cycle (ladder mid-tiers)
  status: CardStatus;                   // derived at read from lastStampAt + policy (lazy expiry)
  lastStampAt?: string;                 // anchor of expiry computation
  expiredAt?: string;                   // set when the derived expiry passes (read-time evaluation)
  openedAt: string;
}
export interface StampEvent {
  id: string;
  cardId: string;
  actorStaffId: string;                 // staff-verified — every stamp names its stamper (00)
  source: 'counter' | 'adjustment';
  delta: number;                        // counter: +1; adjustment: any int (clamped ≥0 at the card)
  reason?: AdjustmentReason;            // required when source = 'adjustment' (07b rule)
  note?: string;                        // free-text reason detail, ledgered verbatim
  idempotencyKey?: string;              // counter stamps only — double-tap never double-stamps
  at: string;
  undone?: boolean;                     // a counter stamp undone within the 120s window
}
export interface Redemption {
  id: string;
  cardId: string;
  tierId: string;
  actorStaffId: string;
  stampsAtRedemption: number;           // feeds insights avgStampsAtRedemption (deterministic)
  cycle: number;
  at: string;
}
export interface PassToken {
  id: string;
  memberId: string;                     // one stable token per member; rotation preserves the member
  token: string;                        // deterministic seeded value (07c); never a credential secret
  issuedBy: 'enrollment' | 'rotation';
  createdAt: string;
}
export interface AuditEntry {           // P17 — the accountability surface (S9)
  id: string;
  workspaceId: string;
  actorStaffId: string | 'self-enrollment';   // member self-join actor is the join code, not a person
  action: AuditActionKind;
  targetRef: string;                    // member/card/program/staff/artifact id
  detail?: string;                      // e.g. "cap 1/day reached — earlier stamp by أمينة at 08:12"
  at: string;
}
export interface InsightsSnapshot {     // deterministic counts; formulas in 07c §2
  programId: string;
  windowDays: number;                   // default 30
  activeMembers: number;                // ≥1 counter stamp in window, not blocked
  stampsIssued: number;                 // counter-source events in window (excludes adjustments)
  redemptions: number;
  tierMix: { tierId: string; count: number }[];
  adjustmentsByReason: { reason: AdjustmentReason; count: number }[];
  undoCount: number;
  completionRate: number;               // final-tier redemptions ÷ cards with ≥1 stamp in window; floored to 2dp, never rounded up
  avgStampsAtRedemption: number | null; // mean of stampsAtRedemption, 1dp; null when no redemptions
}
export type JobKind = 'export';
export interface Job<T = unknown> {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };   // row counts (async-contract §3)
  result?: T;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;               // async-contract §5
}
export interface ExportArtifact {
  id: string;
  kind: 'members-csv';
  expiresAt: string;                    // declared retention window at creation
  regenerable: boolean;                 // deterministically rebuildable from state
}

