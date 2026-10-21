# 07b — Adapter Contract: attendance-shift-planner (TypeScript, v1)

SME-G pass · `ShiftPlannerAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, Team, TeamRulesetBinding, JurisdictionRuleset/RuleDef/RamadanWindow, Qualification, Worker/UnavailabilityWindow, WeekPlan, Shift, ShiftAssignment/AssignmentProvenance, RuleViolation/Waiver, PublicationRecord, ExportArtifact, Job, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table — 35 operations, 0 orphans).

```ts
// Single contract surface. Entity types referenced below (RuleDef,
// RamadanWindow, Waiver, AssignmentProvenance — and their fields) are
// declared canonically in 07a and are part of this contract by reference;
// 07b declares only the operational wrappers (summaries, views, job
// results) its signatures need. This product is DECLARED NON-AI
// (ai-native-patterns §1): no operation invokes any AI capability, and the
// deterministic labor-rule engine specified in 07c is the whole of the
// guardrail machinery.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed roster/swap paste rows, ruleset sanity, waive-without-reason,
 *                                      publication-gate attempts with blockers, conflicting swap sets, coverage shortfall at publish)
 * 'NOT_FOUND'    -> NotFoundError     (stale team/worker/plan/ruleset/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (capability consent, workspace scoping, viewer-role mutations)
 * 'CONFLICT'     -> ConflictError     (concurrent cell/plan/team/ruleset edits, superseded publication on swap record, already-waived findings)
 * 'RATE_LIMIT'   -> RateLimitError    (guardrail scans, exports)
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
  role: 'owner' | 'planner' | 'supervisor' | 'viewer';   // planner: full authoring; supervisor: publish-view + swap recording;
  locale: 'ar' | 'en';                                    // viewer: published-plan reads only (worker review seat)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export interface TeamSummary {
  id: string;
  nameAr: string; nameEn: string;
  jurisdiction: 'SA' | 'AE' | 'custom';
  rulesetId: string;
  rulesetVersion: number;
  workerCount: number;                   // active workers
  rulesetDrift: boolean;                 // published weeks exist under an older ruleset version (03 CP-5.4)
  pendingAmendment: boolean;             // a published week sits in pending-amendment (04 S1 attention mark)
  version: number;
  updatedAt: string;
}

export interface WorkerRow {              // roster rail rows (virtualized above 200 — P19)
  id: string;
  code: string;
  nameAr: string; nameEn: string;         // each renders at its own script direction (05)
  roleTitle: string;
  qualificationCodes: string[];
  contractWeeklyMaxMinutes: number;
  status: 'active' | 'inactive';
}

export interface RulesetSummary {
  id: string;
  scope: 'stock' | 'workspace';
  jurisdiction: 'SA' | 'AE' | 'custom';
  name: string;
  version: number;
  ruleCount: number;
  hasRamadanWindow: boolean;
  capturedAt?: string;                    // stock rulesets only — honesty provenance
  updatedAt: string;
}

export interface WeekPlanSummary {
  id: string;
  teamId: string;
  weekStartsOn: string;
  status: 'draft' | 'published' | 'pending-amendment';
  rulesetVersion: number;
  openViolations: { blocking: number; warning: number };
  inRamadanWindow: boolean;
  publishedAt?: string;
  updatedAt: string;
}

export interface WeekPlanView {
  plan: WeekPlan;                         // 07a full shape
  team: TeamSummary;
  shifts: Shift[];
  assignments: ShiftAssignment[];
  violations: RuleViolation[];            // current computed state (deterministic per 07c)
  gate: {
    blocked: boolean;
    blockers: {
      violationId?: string;
      shiftId?: string;
      kind: 'blocking-violation' | 'coverage-shortfall';
    }[];                                  // coverage: headcount > assignments on a shift
  };
  boundaryCheck: 'prior-week' | 'none-found';   // cross-week honesty (03 CP-2.6)
}

export interface ScanJobResult {
  weekPlanId: string;
  mode: 'deterministic';                  // non-AI declaration made explicit in every result
  findings: { blocking: number; warning: number };
  rulesetVersion: number;
}

export interface RosterImportResult {
  workersCreated: number;
  invalidRows: string[];                  // named bad rows — partial policy (async-contract §4); importRoster's result channel
  draftRolesCreated: string[];            // role titles not yet in the library, flagged for review (03 CP-1 edge)
}

export interface SwapApplication {
  assignmentId: string;
  fromWorkerId: string;
  toWorkerId: string;
  applied: boolean;
  skipReason?: 'qualification-missing' | 'conflicting-swap' | 'worker-inactive' | 'assignment-superseded';
  newViolationIds: string[];              // second-order effects surfaced immediately (03 CP-4.3)
}

export interface SwapImportResult {
  applied: SwapApplication[];
  skipped: SwapApplication[];             // named, never silently dropped
  weekPlanStatus: 'pending-amendment';
}

export interface Job<T> {                  // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'roster-import' | 'guardrail-scan' | 'export' | 'swap-import';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                 // async-contract §5
  teamId?: string;
  weekPlanId?: string;
}

// ---- Contract ----

export interface ShiftPlannerAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // teams
  listTeams(query: {
    filter?: { jurisdiction?: ('SA' | 'AE' | 'custom')[]; rulesetDrift?: boolean; pendingAmendment?: boolean };
    search?: string;                      // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'name' | 'workerCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<TeamSummary>, AdapterError>>;
  getTeam(id: string): Promise<Result<TeamSummary & {
    rulesetBinding: TeamRulesetBinding;
    workerCounts: { active: number; inactive: number };
  }, AdapterError>>;
  createTeam(input: {
    nameAr: string; nameEn: string;
    jurisdiction: 'SA' | 'AE' | 'custom';
    rulesetId: string;                    // the picker's selection (03 CP-1.5)
    timezone: string;
    workWeekStartsOn: 0 | 1 | 6;
  }): Promise<Result<TeamSummary, AdapterError>>;
  updateTeam(id: string, patch: {
    nameAr?: string; nameEn?: string;
    rulesetId?: string;                   // re-binding re-validates open drafts; drift marks surface (03 CP-5.4)
    timezone?: string;
    workWeekStartsOn?: 0 | 1 | 6;
    baseVersion: number;                  // stale -> CONFLICT with both payloads
  }): Promise<Result<TeamSummary, AdapterError>>;

  // roster & qualifications
  listWorkers(query: {
    teamId: string;
    filter?: { status?: ('active' | 'inactive')[]; qualificationId?: string; roleTitle?: string };
    search?: string;                      // normalized bilingual name/code search
    sort: 'name' | 'code' | 'role';
    cursor?: string; limit: number;       // virtualized rail: cursor pages ≤ 100
  }): Promise<Result<Page<WorkerRow>, AdapterError>>;
  createWorker(input: {
    teamId: string;
    code: string; nameAr: string; nameEn: string; roleTitle: string;
    qualificationIds: string[];
    contract: { weeklyMaxMinutes: number; dailyMaxMinutes?: number };
    unavailability?: UnavailabilityWindow[];
  }): Promise<Result<Worker, AdapterError>>;
  updateWorker(id: string, patch: {
    nameAr?: string; nameEn?: string; roleTitle?: string;
    qualificationIds?: string[];
    contract?: { weeklyMaxMinutes: number; dailyMaxMinutes?: number };
    unavailability?: UnavailabilityWindow[];   // full-window replace; edits re-open affected validations honestly
    status?: 'active' | 'inactive';
    baseVersion: number;                  // stale -> CONFLICT with both payloads
  }): Promise<Result<Worker, AdapterError>>;

  importRoster(input: {
    teamId: string;
    content: string;                      // paste payload: worker-per-line rows (07c format)
    idempotencyKey: string;               // async-contract §5 — double-submit never double-imports
  }): Promise<Result<Job<RosterImportResult>, AdapterError>>;  // row-count progress; invalid rows named, valid rows retained

  listQualifications(query: {
    filter?: { status?: ('active' | 'deprecated')[] };
    search?: string;
    sort: 'code' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<Qualification>, AdapterError>>;
  saveQualification(input: {
    qualification: Omit<Qualification, 'createdAt' | 'updatedAt'> & { id?: string };
  }): Promise<Result<Qualification, AdapterError>>;
  deprecateQualification(id: string): Promise<Result<Qualification, AdapterError>>;   // checks stop, history intact

  // jurisdiction rulesets (the guardrail data — inspectable by contract)
  listJurisdictionRulesets(query: {
    filter?: { scope?: ('stock' | 'workspace')[]; jurisdiction?: ('SA' | 'AE' | 'custom')[] };
    sort: 'name' | 'updatedAt' | 'version';
    cursor?: string; limit: number;
  }): Promise<Result<Page<RulesetSummary>, AdapterError>>;
  getJurisdictionRuleset(id: string): Promise<Result<JurisdictionRuleset, AdapterError>>;   // full rules + sourceNote + capturedAt + verifyNote
  saveCustomRuleset(input: {
    baseRulesetId?: string;               // clone-from (the only stock-edit path — audit integrity, 03 CP-5.2)
    name: string;
    rules: RuleDef[];
    ramadan?: RamadanWindow;              // window config (03 CP-5.3); appliesTo/note rendered in-product
    baseVersion?: number;                 // stale -> CONFLICT with both payloads
  }): Promise<Result<JurisdictionRuleset, AdapterError>>;
  validateRuleset(rules: RuleDef[], ramadan?: RamadanWindow): Promise<Result<{ valid: boolean; issues: string[] }, AdapterError>>;

  // week planning (the grid — 03 CP-1/CP-2)
  listWeekPlans(query: {
    teamId: string;
    filter?: { status?: WeekPlanSummary['status'][]; inRamadanWindow?: boolean };
    sort: 'weekStartsOn' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<WeekPlanSummary>, AdapterError>>;
  createWeekPlan(input: {
    teamId: string;
    weekStartsOn: string;
    copyFrom?: 'prior-published' | 'blank';   // copy path lands a draft with recomputed violations (never copied findings)
  }): Promise<Result<WeekPlanView, AdapterError>>;
  getWeekPlan(id: string): Promise<Result<WeekPlanView, AdapterError>>;
  upsertShift(input: {
    weekPlanId: string;
    shift: Omit<Shift, 'version'> & { id?: string };
  }): Promise<Result<WeekPlanView, AdapterError>>;       // returned view carries recomputed violations (live-recheck budget, 10)
  removeShift(input: { weekPlanId: string; shiftId: string }): Promise<Result<WeekPlanView, AdapterError>>;
  placeAssignment(input: {
    weekPlanId: string;
    shiftId: string;
    workerId: string;
  }): Promise<Result<WeekPlanView, AdapterError>>;       // qualification/unavailability checks fire here (07c rules 8–9)
  updateAssignment(input: {
    weekPlanId: string;
    assignmentId: string;
    patch: { workerId?: string };                        // move-to-another-worker from the grid (03 CP-2.2)
    baseRevision: number;                                // stale -> CONFLICT with both payloads
  }): Promise<Result<WeekPlanView, AdapterError>>;
  removeAssignment(input: { weekPlanId: string; assignmentId: string }): Promise<Result<WeekPlanView, AdapterError>>;

  // deterministic guardrails (non-AI: rules per 07c)
  runGuardrailCheck(input: {
    weekPlanId: string;
    idempotencyKey: string;
  }): Promise<Result<Job<ScanJobResult>, AdapterError>>;
  listRuleViolations(query: {
    weekPlanId: string;
    filter?: {
      severity?: ('blocking' | 'warning')[];
      state?: ('open' | 'resolved' | 'waived')[];
      workerId?: string;
      ruleKey?: RuleKey[];
      introducedBySwap?: boolean;
    };
    sort: 'severity' | 'worker' | 'ruleKey';
    cursor?: string; limit: number;
  }): Promise<Result<Page<RuleViolation>, AdapterError>>;
  waiveRuleViolation(input: {
    violationId: string;
    reason: string;                        // REQUIRED -> VALIDATION without it (07a Waiver)
  }): Promise<Result<RuleViolation, AdapterError>>;

  // publication & export (the gate — 03 CP-3)
  publishWeekPlan(input: {
    weekPlanId: string;
    acknowledgeBlockers: false;            // literal type: the gate NEVER passes with blockers (07a state obligation)
  }): Promise<Result<PublicationRecord, AdapterError>>;
  getPublicationRecord(publicationRecordId: string): Promise<Result<PublicationRecord & {
    waivers: Waiver[];                     // the full ledger — Amal's export surface (02)
    swaps: AssignmentProvenance[];         // provenance entries applied under this publication
  }, AdapterError>>;
  exportSchedule(input: {
    weekPlanId: string;
    formats: ('team-grid' | 'worker-views' | 'marketplace-compatible')[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: ('team-grid' | 'worker-views' | 'marketplace-compatible')[];
  }, AdapterError>>;

  // swap-awareness (agreed swaps only — negotiation is shift-swap-marketplace's, LOOP-3)
  recordExternalSwap(input: {
    weekPlanId: string;
    assignmentId: string;
    toWorkerId: string;
    agreedAt: string;
    source: 'manual-record' | 'paste' | 'change-channel';
    note?: string;
  }): Promise<Result<WeekPlanView, AdapterError>>;       // re-validated view: new violations carry introducedBySwapProvenance
  importSwapSet(input: {
    weekPlanId: string;
    source: 'paste' | 'change-channel';
    content?: string;                      // paste payload: marketplace-compatible swap lines (07c format)
    capabilityRef?: string;                // change-channel path only; consent enforced server-side
    idempotencyKey: string;
  }): Promise<Result<Job<SwapImportResult>, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; teamId?: string; weekPlanId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    guardrailScans: number;
    rosterPastes: number;                 // the four metered classes surface in one window (P14)
    swapSetImports: number;
    exports: number;
    resetAt: string;
  }, AdapterError>>;
}
```

## Rules

1. **Determinism contract**: `runGuardrailCheck` and the recompute inside every grid mutation implement exactly the rules specified in 07c — identical inputs (plan draft state, roster state, ruleset version) yield identical violations. Every scan result carries `mode: 'deterministic'`. No finding is ever created or closed by hand: `resolved` transitions happen ONLY by recomputation after an edit; `waived` requires the actor + reason record per 07a.
2. **Publication gate**: `publishWeekPlan` with any open blocking violation or headcount shortfall → VALIDATION whose `details` name every blocker (`blockers` from the live view). The `acknowledgeBlockers: false` literal makes the gate semantics impossible to accidentally bypass at the type level. Successful publication writes an immutable PublicationRecord; later mutations set the plan to `pending-amendment` and never rewrite the record. Amendment publication (same week, prior publication exists) writes a NEW record with `isAmendment: true` and the change summary.
3. **Stale-version semantics**: `updateTeam` / `updateWorker` (baseVersion), `updateAssignment` (baseRevision), `saveCustomRuleset` (baseVersion), and `waiveRuleViolation` (finding already waived by another seat) → CONFLICT with both payloads in `details`. `recordExternalSwap` against a week superseded by a newer publication → CONFLICT naming the live publication.
4. **Role permissions**: viewer-role mutations (all authoring, publication, waiver, swap writes) → PERMISSION naming the seat's capability in capability language; the supervisor's write paths are exactly `recordExternalSwap` and published-plan reads; the planner/owner roles hold full authoring (02 persona seats).
5. **Consent enforcement**: `importSwapSet` with `source: 'change-channel'` without a granted schedule-change consent → PERMISSION naming the capability class (credential-contract §4) — never a vendor. The paste path has no consent requirement, ever (LOOP-5).
6. **Idempotency**: import/scan/export/swap-set submits carry idempotency keys; a retried submit returns the original job (async-contract §5). Progress is determinate in units (rows, workers, formats, swaps) — an indeterminate bar claiming percentage is a contract violation (async-contract §3).
7. **Partial policies**: roster import delivers created-so-far + named invalid rows + named draft roles; swap-set import applies in order, skipping and naming conflicts (never partial-silent); scans are per-worker re-runnable; exports deliver per-format partial with per-format retry (async-contract §4).
8. **Recompute honesty**: mutations return the recomputed `WeekPlanView` — the UI must render it, not assume; ruleset re-binds surface changed-outcome violations explicitly (03 CP-5.4) and never mutate published weeks or pinned findings.
9. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (35/35).
