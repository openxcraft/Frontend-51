// VERBATIM from specs-source/attendance-shift-planner/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type JurisdictionCode = 'SA' | 'AE' | 'custom';

// ---- Workspace & teams ----
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction default (either direction is a full citizen — 05)
}
export interface Team {
  id: string;
  workspaceId: string;
  nameAr: string;                      // authored bilingual names (P23 discipline; both required)
  nameEn: string;
  jurisdiction: JurisdictionCode;
  rulesetId: string;                   // bound ruleset (stock or custom); binding is versioned via TeamRulesetBinding
  timezone: string;                    // IANA zone; grid day boundaries derive from it
  workWeekStartsOn: 0 | 1 | 6;         // Monday default; Saturday option for mall-retail weeks (12 Q-10)
  version: number;                     // CONFLICT base for updateTeam
  createdAt: string;
  updatedAt: string;
}
export interface TeamRulesetBinding {
  teamId: string;
  rulesetId: string;
  rulesetVersion: number;              // the version the team's DRAFTS validate against
  boundAt: string;
  boundByMemberId: string;
}

// ---- Rulesets (the guardrail data) ----
export type RuleKey =
  | 'R_DAILY_MAX'          // worked minutes per day over cap
  | 'R_WEEKLY_MAX'         // worked minutes per week over cap
  | 'R_REST_GAP'           // rest between consecutive assignments under minimum (the clopening guard)
  | 'R_CONSEC_DAYS'        // consecutive worked days over maximum
  | 'R_OT_DAILY'           // daily overtime threshold crossed (warning)
  | 'R_OT_WEEKLY'          // weekly overtime threshold crossed (warning)
  | 'R_RAMADAN_CAP'        // reduced Ramadan daily/weekly cap crossed within the configured window
  | 'R_QUALIFICATION'      // assignment requires a qualification the worker lacks
  | 'R_UNAVAILABILITY'     // assignment overlaps a declared unavailability window
  | 'R_NIGHT_WINDOW'       // assignment hours inside the night window (warning flag — no pay)
  | 'R_MAX_INCL_OT'        // daily minutes incl. overtime over the absolute maximum
  | 'R_WEEKLY_REST';       // required weekly rest days absent (advisory)
export type RuleSeverity = 'blocking' | 'warning';
export interface RuleDef {
  key: RuleKey;
  enabled: boolean;
  severity: RuleSeverity;
  minutes?: number;                    // caps, thresholds, minimums — rule-dependent meaning, always minutes
  days?: number;                       // consecutive-day and weekly-rest counts
  window?: { startMinute: number; endMinute: number };   // night window, e.g. 21:00–04:00
}
export interface RamadanWindow {
  startsOn: string;                    // Gregorian ISO dates (author sets them from the Hijri calendar,
  endsOn: string;                      //   Umm al-Qura for KSA contexts, method disclosed in-app — portfolio Q-5)
  appliesTo: 'all-workers' | 'config-note';   // scope is genuinely contested (01) — modeled as data + note
  note?: string;                       // the workspace's own scope statement, rendered in-product
  reducedDailyMinutes: number;         // e.g. 360 (KSA 6h) / 480 (UAE 8h after −2h)
  reducedWeeklyMinutes: number;        // e.g. 2160 (KSA 36h)
}
export interface JurisdictionRuleset {
  id: string;
  scope: 'stock' | 'workspace';        // stock (SA v1 / AE v1) is read-only; clone-to-custom is the edit path
  jurisdiction: JurisdictionCode;
  name: string;
  version: number;                     // immutable once saved; violations pin the version they computed against
  rules: RuleDef[];                    // the inspectable rule list (05 S4 renders every entry)
  ramadan?: RamadanWindow;             // SA/AE stock rulesets carry a seeded window the workspace overrides on clone
  sourceNote?: string;                 // e.g. "Saudi Labor Law — HRSD official text, captured 2026-10"
  capturedAt?: string;                 // honesty: rules are captured data, not legal advice (12 Q-9)
  verifyNote?: string;                 // "verify against current law" line rendered on every stock ruleset
  createdAt: string;
  updatedAt: string;
}

// ---- People & qualifications ----
export interface Qualification {
  id: string;
  workspaceId: string;
  code: string;                        // stable referent (worker-facing chips, swap-qualification checks)
  labelAr: string;
  labelEn: string;
  status: 'active' | 'deprecated';     // deprecated = checks stop, history intact
  requiredByRoles: string[];           // role titles that require it (advisory to shift authoring)
  createdAt: string;
  updatedAt: string;
}
export interface UnavailabilityWindow {
  startsAt: string;                    // ISO datetimes — absence, leave, declared day-off preferences
  endsAt: string;
  kind: 'absence' | 'leave' | 'day-off-preference';   // preference is advisory (roster mark, never a violation)
  note?: string;
}
export interface Worker {
  id: string;
  teamId: string;
  code: string;                        // Western numerals; the roster's stable referent
  nameAr: string;                      // bilingual names — each renders at its own script direction (05)
  nameEn: string;
  roleTitle: string;
  qualificationIds: string[];
  contract: { weeklyMaxMinutes: number; dailyMaxMinutes?: number };   // engine enforces the STRICTER of contract/ruleset
  unavailability: UnavailabilityWindow[];
  status: 'active' | 'inactive';
  version: number;                     // CONFLICT base for updateWorker
  createdAt: string;
  updatedAt: string;
}

// ---- Week plans, shifts, assignments ----
export interface Shift {
  id: string;
  weekPlanId: string;
  dayIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6;         // index from the plan's workWeekStartsOn
  roleTitle: string;
  startMinute: number;                 // minutes from midnight, team timezone (e.g. 390 = 06:30)
  endMinute: number;                   // end < start = crosses midnight into the next day (explicit, 03 CP-1 edge)
  breakMinutes: number;
  requiredQualificationIds: string[];
  headcount: number;                   // required workers; shortfall is a publication-gate blocker
  version: number;
}
export type AssignmentProvenance =
  | { kind: 'authored' }
  | {                                   // an AGREED swap applied to the plan — negotiation lives elsewhere (LOOP-3, 12 Q-4)
      kind: 'external-swap';
      fromWorkerId: string;
      toWorkerId: string;
      agreedAt: string;
      source: 'manual-record' | 'paste' | 'change-channel';
      note?: string;
    };
export interface ShiftAssignment {
  id: string;
  shiftId: string;
  workerId: string;
  provenance: AssignmentProvenance;
  version: number;
}
export type WeekPlanStatus =
  | 'draft'
  | 'published'
  | 'pending-amendment';               // post-publication edits/swaps await a new publication (CP-4)
export interface WeekPlan {
  id: string;
  teamId: string;
  weekStartsOn: string;                // ISO date of the workWeekStartsOn day
  rulesetId: string;
  rulesetVersion: number;              // pins the version the plan validates against (audit honesty)
  status: WeekPlanStatus;
  publication?: PublicationRecord;     // present when published; superseded publications stay immutable
  priorWeekPlanId?: string;            // cross-week boundary checks read the prior published plan (07c rule 6)
  revision: number;                    // CONFLICT base for all grid mutations
  createdAt: string;
  updatedAt: string;
}

// ---- Rule violations (deterministic findings) ----
export type ViolationState = 'open' | 'resolved' | 'waived';
export interface Waiver {
  reason: string;                      // REQUIRED — the audit artifact (exported with the publication record)
  actorMemberId: string;
  at: string;
  appliesToWeekOnly: true;             // waivers are week-scoped by contract; plan edits recompute them away
}
export interface RuleViolation {
  id: string;
  weekPlanId: string;
  ruleKey: RuleKey;
  rulesetVersion: number;              // pin: ruleset edits never mutate existing findings (07c)
  severity: RuleSeverity;
  state: ViolationState;
  waiver?: Waiver;                     // present iff state = 'waived'
  workerId?: string;                   // worker-scoped rules; shift-level rules (coverage) omit
  assignmentIds: string[];             // the offending assignments — 1 or 2 (pair rules like R_REST_GAP)
  measured: { minutes?: number; days?: number };        // what the draft actually has
  required: { minutes?: number; days?: number };       // what the ruleset demands — both render in the row (00)
  inRamadanWindow: boolean;            // true when computed under Ramadan reduced caps
  introducedBySwapProvenance?: AssignmentProvenance;   // second-order effects of a recorded swap (CP-4.3)
  computedAt: string;
}

// ---- Publication, export, jobs, activity ----
export interface PublicationRecord {
  id: string;
  weekPlanId: string;
  planRevisionAtPublish: number;       // the exact draft state that was published
  rulesetId: string;
  rulesetVersion: number;              // the version enforced at publication (immutable)
  actorMemberId: string;
  at: string;
  isAmendment: boolean;                // true when superseding a prior publication of the same week
  changeSummary?: {                    // vs the previous publication of this week (CP-3.3)
    assignmentsChanged: number;
    workersAdded: number;
    workersRemoved: number;
    swapsApplied: number;
    waiversAdded: number;
  };
  resolutionLedger: {                  // the audit artifact the export carries (02 Amal)
    waivers: number;                   // all with reasons, listed in full in the export
    acceptedWarnings: number;
    blockingResolved: number;
  };
}
export type ExportFormat =
  | 'team-grid'                        // printable week view
  | 'worker-views'                     // per-worker weekly slips, bilingual, Western numerals
  | 'marketplace-compatible';          // the declared artifact schema shift-swap-marketplace / external systems ingest (08 N1)
export interface ExportArtifact {
  id: string;
  weekPlanId: string;
  publicationRecordId: string;
  formats: ExportFormat[];             // per-format retry on partial failure (async-contract §4)
  expiresAt: string;                   // declared retention window at creation
  regenerable: boolean;                // deterministic from plan state — always true in v1
}
export type JobKind = 'roster-import' | 'guardrail-scan' | 'export' | 'swap-import';
export interface ActivityEntry {       // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'team-created' | 'team-updated' | 'ruleset-bound'
    | 'worker-created' | 'worker-updated' | 'qualification-saved' | 'qualification-deprecated'
    | 'plan-created' | 'shift-saved' | 'assignment-placed' | 'assignment-updated' | 'assignment-removed'
    | 'scan-run' | 'violation-waived'
    | 'published' | 'amendment-published'
    | 'swap-recorded' | 'swap-set-imported'
    | 'ruleset-saved' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                     // e.g. waiver reason, change summary counts — provenance audit
  at: string;
}

