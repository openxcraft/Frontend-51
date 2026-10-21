# 07b — Adapter Contract: okr-cascade-board (TypeScript, v1)

SME-G pass · `OkrCascadeAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. Types only — no implementation. Entity semantics (Workspace, CadenceConfig, Cycle, Objective, KeyResult, CheckIn, GradeSheet, DraftProposal, Job, ExportArtifact, Team, Member, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table; 34 operations, 0 orphans).

```ts
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
```

## Rules

1. **Submitted-state honesty**: rollups, coverage zones, and grading read SUBMITTED check-ins only; drafts never count, unreported KRs render null progress with a named count — never a silent 0 (07a state obligations; 03 CP-3 edges).
2. **On-behalf provenance**: a lead submitting for a KR their session does not own records `submittedBy ≠ ownerId`; the coverage grid and export carry the provenance (03 CP-3 edge; activity action 'checkin-on-behalf').
3. **State-machine gates**: `setCycleState` enforces draft→active→grading→closed; grading requires the close gate's conditions listed honestly (unreported KRs disclosed, not blocking); `updateCycle` date edits only in draft; export requires grading|closed; violations → VALIDATION naming the current and required states.
4. **Optimistic concurrency**: `updateCycle`/`updateObjective`/`updateKeyResult`/`updateCheckIn` with stale `baseVersion` → CONFLICT with both payloads in `details` (P10/P04).
5. **Metric integrity**: baseline === target, non-finite or non-numeric metric values, and re-baselines without a reason → VALIDATION; re-baselines never rewrite prior check-in values (priorValues persist; activity logs 'kr-rebaselined' with the reason).
6. **Consent enforcement**: `requestDraft` without a granted drafting-assist consent → PERMISSION naming the capability class in capability language (credential-contract §2/§4); quota exhaustion → RATE_LIMIT with resetAt and the plain-editor path stated by the UI in the same surface (08 degradation map).
7. **Idempotency**: `createCycle`, `submitCheckIn`, `requestDraft`, and `exportCycle` carry idempotency keys; a retried submit returns the original check-in (a double-tap never double-records — async-contract §5).
8. **Partial-result policies**: draft jobs deliver per-chunk streaming with a marked partial state on failure (ai-native-patterns §2 — partial text is never silently promoted); export jobs deliver per-format partial with per-format retry (async-contract §4); both are cancellable within one interaction.
9. **Cadence migration semantics**: `updateCadence` without `confirmedMigration: true` → VALIDATION (the P04 confirm is contractual, not decorative); the new period grid re-derives from cycle start; submitted check-ins keep `periodStart` and re-map into the new grid; any that fall outside all periods land in `preChangeBucket` and render as an honest pre-change list (03 CP-6.3; 07c rule 8).
10. **Corrections**: `updateCheckIn` appends to priorValues and increments revision (history preserved); corrections are available while the cycle is active or grading, never after close.
11. **Determinism disclosure**: `getObjective.lint` findings come from the fixed rule tables (07c rule 7) — the same statement pair always yields the same findings; the UI renders the rule names verbatim (inspectability).
12. **Typed pagination on every list; cursors opaque. No orphan methods** — the 03 coverage table is the verification artifact (check_coverage.py enforced).
13. **Role fences**: company-level `createObjective`, `setCycleState`, `computeCycleGrades`, `updateCadence` → admin only; team-level writes → admin or the owning team's lead; another team's objective writes → PERMISSION naming the role boundary; members write only their own check-ins (on-behalf rule 2 is the lead's path).
14. **No evaluation of persons exists on this contract**: no operation ranks, rates, or profiles members; `listMembers` is a directory read for owner pickers (LOOP-10 enforced structurally).
