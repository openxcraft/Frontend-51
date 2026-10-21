// VERBATIM from specs-source/okr-cascade-board/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (Cycle, Objective,
// KeyResult, CheckIn, GradeSheet, DraftProposal, ExportArtifact, Team, Member,
// ActivityEntry — and their fields) are declared canonically in 07a and are part
// of this contract by reference; 07b declares only the operational wrappers
// (summaries, views, jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (cycle dates, metric spans, required reasons,
 *                                       empty check-in values, state-machine gates)
 * 'NOT_FOUND'    -> NotFoundError     (stale cycle/objective/KR/artifact links,
 *                                       expired artifacts and proposals)
 * 'PERMISSION'   -> PermissionError   (role boundaries: company authoring, grading,
 *                                       cross-team writes, capability consent)
 * 'CONFLICT'     -> ConflictError     (concurrent objective/KR/check-in edits via
 *                                       baseVersion, stale cadence migration)
 * 'RATE_LIMIT'   -> RateLimitError    (assist draft runs, exports)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact delivery)
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

export interface Session {
  memberId: string;
  workspaceId: string;
  role: 'admin' | 'lead' | 'member';     // member: check-in desk + read own KRs' objectives
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export interface CycleSummary {
  id: string;
  nameEn: string;
  nameAr?: string;
  state: 'draft' | 'active' | 'grading' | 'closed';
  startsOn: string;
  endsOn: string;
  isSample: boolean;
  objectiveCounts: { company: number; team: number };
  rollup: { progress: number | null; unreportedKrs: number; atRiskKrs: number };
  updatedAt: string;
}

export interface CadenceView {
  frequency: 'weekly' | 'biweekly';
  dueDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dueTime: string;
  scope: 'workspace' | 'cycle';
  periods: { index: number; startsOn: string; endsOn: string; dueAt: string;
             state: 'upcoming' | 'open' | 'in-grace' | 'closed' }[];
  preChangeBucket?: { checkInIds: string[] };   // honest migration residue (rule 8)
}

export interface ObjectiveSummary {
  id: string;
  cycleId: string;
  level: 'company' | 'team';
  teamId?: string;
  titleEn: string;
  titleAr?: string;
  stretch: boolean;
  state: 'draft' | 'committed' | 'archived';
  parentIds: string[];
  childIds: string[];
  krCount: number;
  rollup: { progress: number | null; confidence: number | null; unreportedKrs: number };
  warnings: ('unstaffed-ambition' | 'orphaned-effort' | 'archived-parent')[];
}

export interface KeyResultView {
  id: string;
  objectiveId: string;
  statementEn: string;
  statementAr?: string;
  metric: { unit: string; baseline: number; target: number; direction: 'increase' | 'decrease' };
  weight: number;
  ownerId: string;
  state: 'active' | 'archived';
  derived: { progress: number | null; lastSubmittedAt: string | null;
             atRisk: { flagged: boolean; trigger: 'confidence' | 'cadence' | 'both' | null; detail: string };
             missingStreak: number };
}

export interface CheckInView extends CheckIn {
  recomputedProgress: number | null;     // progress after this check-in's value (derived)
}

export interface LintFinding {
  rule: 'task-verb' | 'soft-verb' | 'length' | 'pair-parity';
  severity: 'flag' | 'notice';
  locale: 'en' | 'ar' | 'both';
  matchedSpan: string;
  guidance: string;                      // written guidance, rendered verbatim (11)
}

export interface DraftJobResult {
  proposalId: string;
  chunksTotal: number;                   // streaming progress units (P12/P13)
}

export interface ExportJobResult {
  artifacts: { artifactId: string; expiresAt: string }[];
}

export interface Job<T> {
  id: string;
  kind: 'draft' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface OkrCascadeAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // cycles
  createCycle(input: {
    nameEn: string; nameAr?: string; startsOn: string; endsOn: string;
    cadenceOverride?: { frequency: 'weekly' | 'biweekly'; dueDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; dueTime: string };
    idempotencyKey: string;
  }): Promise<Result<CycleSummary, AdapterError>>;
  listCycles(query: {
    filter?: { state?: CycleSummary['state'][]; isSample?: boolean };
    sort: 'startsOn' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CycleSummary>, AdapterError>>;
  getCycle(id: string): Promise<Result<CycleSummary & { cadence: CadenceView }, AdapterError>>;
  updateCycle(id: string, patch: {
    nameEn?: string; nameAr?: string | null; startsOn?: string; endsOn?: string;
    baseVersion: number;                   // date edits only in 'draft' state (rule 4)
  }): Promise<Result<CycleSummary, AdapterError>>;
  setCycleState(id: string, transition: 'activate' | 'start-grading' | 'close'): Promise<Result<CycleSummary, AdapterError>>;

  // objectives (the cascade)
  createObjective(input: {
    cycleId: string; level: 'company' | 'team'; teamId?: string;
    titleEn: string; titleAr?: string;
    descriptionEn?: string; descriptionAr?: string;
    stretch: boolean; parentIds: string[];
  }): Promise<Result<ObjectiveSummary, AdapterError>>;
  listObjectives(query: {
    cycleId: string;
    filter?: { level?: ('company' | 'team')[]; teamId?: string; state?: ('draft' | 'committed' | 'archived')[];
               warning?: ObjectiveSummary['warnings'] };
    search?: string;                        // normalized bilingual search (rtl-rules §4)
    sort: 'rollup' | 'updatedAt' | 'titleEn';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ObjectiveSummary>, AdapterError>>;
  getObjective(id: string): Promise<Result<ObjectiveSummary & {
    keyResults: KeyResultView[];
    checkInDigest: { keyResultId: string; lastPeriodIndex: number | null;
                     lastSubmittedAt: string | null; lastConfidence: number | null }[];
    lint: LintFinding[];                    // current pair findings (deterministic, 07c rule 7)
  }, AdapterError>>;
  updateObjective(id: string, patch: {
    titleEn?: string; titleAr?: string | null;
    descriptionEn?: string; descriptionAr?: string | null;
    stretch?: boolean; parentIds?: string[];
    baseVersion: number;
  }): Promise<Result<ObjectiveSummary, AdapterError>>;
  archiveObjective(id: string, reason: string): Promise<Result<ObjectiveSummary, AdapterError>>;

  // key results
  createKeyResult(input: {
    objectiveId: string;
    statementEn: string; statementAr?: string;
    metric: { unit: string; baseline: number; target: number; direction: 'increase' | 'decrease' };
    weight?: number; ownerId: string;
  }): Promise<Result<KeyResultView, AdapterError>>;
  listKeyResults(query: {
    cycleId?: string; objectiveId?: string; ownerId?: string;
    filter?: { state?: ('active' | 'archived')[]; dueNow?: boolean; atRisk?: boolean };
    sort: 'rollup' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<KeyResultView>, AdapterError>>;
  updateKeyResult(id: string, patch: {
    statementEn?: string; statementAr?: string | null;
    metric?: { unit: string; baseline: number; target: number; direction: 'increase' | 'decrease' };
    weight?: number; ownerId?: string;
    rebaseline?: { reason: string };        // required reason; logged as 'kr-rebaselined'
    baseVersion: number;
  }): Promise<Result<KeyResultView, AdapterError>>;
  removeKeyResult(id: string, reason: string): Promise<Result<KeyResultView, AdapterError>>;

  // check-ins (the cadence)
  saveCheckInDraft(input: {
    keyResultId: string; periodIndex: number;
    currentValue: number; confidence: 1 | 2 | 3 | 4 | 5;
    blockers?: { text: string }[]; helpNeeded?: boolean;
  }): Promise<Result<CheckInView, AdapterError>>;
  submitCheckIn(input: {
    keyResultId: string; periodIndex: number;
    currentValue: number; confidence: 1 | 2 | 3 | 4 | 5;
    blockers?: { text: string }[]; helpNeeded?: boolean;
    idempotencyKey: string;                  // async-contract §5 — double-submit never double-records
  }): Promise<Result<CheckInView, AdapterError>>;
  getCheckIn(keyResultId: string, periodIndex: number): Promise<Result<CheckInView, AdapterError>>;
  updateCheckIn(id: string, patch: {
    currentValue?: number; confidence?: 1 | 2 | 3 | 4 | 5;
    blockers?: { text: string }[]; helpNeeded?: boolean;
    correctionNote?: string;                 // optional, surfaced in the revision trail
    baseVersion: number;
  }): Promise<Result<CheckInView, AdapterError>>;
  listCheckIns(query: {
    cycleId: string; periodIndex?: number; ownerId?: string; keyResultId?: string;
    filter?: { status?: ('draft' | 'submitted')[]; zone?: ('ontime' | 'in-grace' | 'overdue' | 'missing') };
    sort: 'submittedAt' | 'keyResultId';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CheckInView>, AdapterError>>;

  // bilingual drafting assist (conditionally-AI: abstract capability, consent-gated — 08 N1)
  requestDraft(input: {
    cycleId: string; level: 'company' | 'team'; teamId?: string;
    kind: 'objective' | 'key-results'; targetObjectiveId?: string;
    focus: { textEn?: string; textAr?: string };
    idempotencyKey: string;
  }): Promise<Result<Job<DraftJobResult>, AdapterError>>;
  getDraftProposal(proposalId: string): Promise<Result<DraftProposal, AdapterError>>;
  resolveDraftProposal(proposalId: string, resolution: {
    outcome: 'accept' | 'edit' | 'dismiss'; note?: string;
  }): Promise<Result<DraftProposal, AdapterError>>;

  // grading (deterministic — 07c rule 6)
  computeCycleGrades(cycleId: string): Promise<Result<GradeSheet, AdapterError>>;
  getGradeSheet(cycleId: string): Promise<Result<GradeSheet, AdapterError>>;

  // export (abstract delivery; manual path is download — 08 N2)
  exportCycle(input: {
    cycleId: string;
    format: 'cycle-package' | 'grade-report';
    options: { checkInHistory?: boolean; activityAppendix?: boolean };
    idempotencyKey: string;
  }): Promise<Result<Job<ExportJobResult>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // directory (read; abstract source N4 with in-product manual primary)
  listTeams(query: { cursor?: string; limit: number }): Promise<Result<Page<Team>, AdapterError>>;
  listMembers(query: {
    filter?: { role?: ('admin' | 'lead' | 'member')[]; teamId?: string };
    search?: string;
    cursor?: string; limit: number;
  }): Promise<Result<Page<Member>, AdapterError>>;

  // cadence
  getCadence(cycleId?: string): Promise<Result<CadenceView, AdapterError>>;
  updateCadence(input: {
    scope: 'workspace' | 'cycle'; cycleId?: string;
    frequency: 'weekly' | 'biweekly'; dueDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; dueTime: string;
    confirmedMigration: boolean;            // the UI's P04 level-2 confirm (03 CP-6.3)
  }): Promise<Result<CadenceView, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; cycleId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  listActivity(query: {
    cycleId?: string; targetRef?: string;
    filter?: { action?: string[]; actorMemberId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntry>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    assistRuns: number; assistRunsLimit: number; exports: number;
    resetAt: string;
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type WorkspaceRole = 'admin' | 'lead' | 'member';
export type ObjectiveLevel = 'company' | 'team';
export type CycleState = 'draft' | 'active' | 'grading' | 'closed';
export type CheckInFrequency = 'weekly' | 'biweekly';
export type MetricDirection = 'increase' | 'decrease';
export type Confidence = 1 | 2 | 3 | 4 | 5;          // anchored: 1 far off track … 5 certain
export interface Workspace {
  id: string;
  name: string;
  nameAr?: string;                       // bilingual workspace name pair (honest-empty AR allowed)
  defaultLocale: Locale;                 // bilingual-en proposal, LOOP-6
  cadence: CadenceConfig;                // workspace-level default; cycles inherit unless overridden
  assistConsent: 'granted' | 'not-granted';
}
export interface CadenceConfig {
  frequency: CheckInFrequency;
  dueDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;   // 0 = Sunday (GCC work week honored)
  dueTime: string;                        // "10:00" local, HH:MM
}
export interface Cycle {
  id: string;
  workspaceId: string;
  nameEn: string;
  nameAr?: string;                        // bilingual cycle name pair; empty AR is honest
  startsOn: string;                       // ISO date
  endsOn: string;                         // ISO date; must satisfy startsOn < endsOn
  state: CycleState;
  cadenceOverride?: CadenceConfig;        // unset = inherit workspace cadence
  isSample: boolean;                      // seeded sample cycle (P22); cleared never returns
  objectiveCounts: { company: number; team: number };
  createdAt: string;
  updatedAt: string;
  version: number;                        // optimistic concurrency (07b baseVersion)
}

/**
 * CheckInPeriod is DERIVED state (07c rule 8): period k covers
 * [startsOn + (k-1)*freqDays, startsOn + k*freqDays); due = period end + dueDay/dueTime.
 * It is never stored — it is computed from the cycle + cadence so a cadence change
 * re-derives the grid deterministically. Check-ins pin periodStart at submission.
 */
export interface CheckInPeriod {
  index: number;                          // 1-based
  startsOn: string;
  endsOn: string;
  dueAt: string;                          // ISO datetime (period end + grace rule)
  state: 'upcoming' | 'open' | 'in-grace' | 'closed';
}
export interface AlignmentLink {
  childObjectiveId: string;
  parentObjectiveId: string;
  createdAt: string;
}
export interface Objective {
  id: string;
  cycleId: string;
  level: ObjectiveLevel;
  teamId?: string;                        // required for team level; unset for company level
  titleEn: string;
  titleAr?: string;                       // bilingual pair: each side human-authored, empty is honest
  descriptionEn?: string;
  descriptionAr?: string;
  stretch: boolean;                       // aspirational (graded vs 0.70) vs committed (expected 1.0)
  parentIds: string[];                    // 0..N company objectives (team level); company level = []
  state: 'draft' | 'committed' | 'archived';
  archivedReason?: string;                // required on archived (audit trail)
  keyResultIds: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
}
export interface MetricBlock {
  unit: string;                           // free-text unit label ("%", "hours", "points")
  baseline: number;
  target: number;                         // target ≠ baseline enforced (VALIDATION, 12 Q-12)
  direction: MetricDirection;
}
export interface KeyResult {
  id: string;
  objectiveId: string;
  statementEn: string;
  statementAr?: string;                   // bilingual pair, honest-empty AR allowed
  metric: MetricBlock;
  weight: number;                         // ≥1 integer; default 1; rollup weights
  ownerId: string;                        // single named member — the check-in owner
  state: 'active' | 'archived';
  archivedReason?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
export interface Blocker {
  text: string;                           // free text, own direction (dir="auto" at render)
  raisedInPeriodIndex: number;
  acknowledged: boolean;                  // read by a lead; visible state, never a workflow gate
}
export interface CheckIn {
  id: string;
  keyResultId: string;
  periodStart: string;                    // ISO date pinned at creation (cadence-change-safe)
  periodIndexAtSubmission: number;        // the grid index it was submitted under (provenance)
  status: 'draft' | 'submitted';
  currentValue: number;                   // the measured number the owner knows
  confidence: Confidence;
  blockers: Blocker[];
  helpNeeded: boolean;
  submittedBy?: string;                   // memberId; ≠ ownerId encodes on-behalf provenance
  submittedAt?: string;
  revision: number;                       // corrections increment; history kept (P16 diff)
  priorValues: { value: number; confidence: Confidence; at: string; actor: string }[];
  updatedAt: string;
}

/** Derived (07c rule 3) — computed at read, never stored as a verdict. */
export interface KeyResultDerivedState {
  progress: number | null;                // 0..1 from latest SUBMITTED value; null = unreported
  lastSubmittedAt: string | null;
  atRisk: { flagged: boolean; trigger: 'confidence' | 'cadence' | 'both' | null;
            detail: string };             // named trigger, e.g. "confidence 2 on period 1"
  missingStreak: number;                  // consecutive closed periods without submission
}
export interface ObjectiveGrade {
  objectiveId: string;
  grade: number | null;                   // weighted mean of reported KR grades; null = all unreported
  reportedKrs: number;
  unreportedKrs: number;
  archivedKrs: number;
  stretch: boolean;                       // aspirational rows scored vs 0.70 threshold at display
}
export interface KrGrade {
  keyResultId: string;
  grade: number | null;                   // final progress from last submitted value; null = unreported
  lastValue: number | null;
  formula: string;                        // rendered arithmetic ("(2.42 − 2.1) ÷ (3.0 − 2.1) = 0.36")
}
export interface GradeSheet {
  id: string;
  cycleId: string;
  computedAt: string;
  snapshot: { objectivesVersion: number; checkInRevisions: number[] };  // immutable evidence pin
  objectiveGrades: ObjectiveGrade[];
  krGrades: KrGrade[];
  archivedAppendix: { objectiveId: string; reason: string; at: string }[];
  closedAt?: string;                      // set when the cycle reaches 'closed'
}
export interface DraftProposal {
  id: string;
  cycleId: string;
  requestedBy: string;                    // memberId
  focus: { textEn?: string; textAr?: string };   // the author's short brief, verbatim
  level: ObjectiveLevel;
  teamId?: string;
  kind: 'objective' | 'key-results';
  targetObjectiveId?: string;             // KR-kind proposals attach to an objective
  proposals: {
    objectiveEn?: string;
    objectiveAr?: string;
    keyResults?: { statementEn: string; statementAr?: string;
                   metric: MetricBlock }[];
  }[];
  state: 'proposed' | 'accepted' | 'edited' | 'dismissed';
  resolutionNote?: string;                // optional human note on resolve (audit)
  provenance: 'assist';
  expiresAt: string;                      // unattended proposals expire (7 days, 07c)
  createdAt: string;
}
export type JobKind = 'draft' | 'export';
export interface ExportArtifact {
  id: string;
  cycleId: string;
  format: 'cycle-package' | 'grade-report';   // 07b options
  includesCheckInHistory: boolean;
  includesActivityAppendix: boolean;
  expiresAt: string;                      // declared retention window at creation
  regenerable: boolean;                   // true: cycle state is immutable post-close
}
export interface Team {
  id: string;
  workspaceId: string;
  nameEn: string;
  nameAr?: string;                        // bilingual team name pair
  leadMemberId: string;
}
export interface Member {
  id: string;
  workspaceId: string;
  displayName: string;                    // stored as entered; Latin/Arabic pairs are member-entered
  displayNameAr?: string;
  role: WorkspaceRole;
  teamId?: string;
  locale: Locale;                         // their check-in-desk locale
}
export interface ActivityEntry {          // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'cycle-created' | 'cycle-activated' | 'cycle-close-started' | 'cycle-closed'
    | 'objective-created' | 'objective-updated' | 'objective-archived'
    | 'alignment-changed' | 'kr-created' | 'kr-updated' | 'kr-archived'
    | 'kr-rebaselined' | 'checkin-submitted' | 'checkin-corrected'
    | 'checkin-on-behalf' | 'draft-requested' | 'draft-resolved'
    | 'grades-computed' | 'export-run' | 'cadence-changed' | 'consent-change';
  targetRef: string;                      // cycle/objective/kr/check-in/proposal id
  detail?: string;                        // e.g. re-baseline reason, on-behalf provenance
  at: string;
}

