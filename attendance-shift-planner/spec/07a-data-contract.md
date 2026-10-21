# 07a — Data Contract: attendance-shift-planner

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — every check in this product is a deterministic rule (time arithmetic, interval overlap, sequence counting) over a configured, versioned JurisdictionRuleset. There is no AI operation on the adapter, no capability any core workflow requires, and no AI affordance may appear in any surface (00/08 degradation map: nothing degrades, because nothing is bound). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: rows / workers / formats / swaps
  partial?: unknown;                   // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;              // async-contract §5 — double-submit never double-imports/scans/exports
  teamId?: string;
  weekPlanId?: string;
}

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
```

## Relationships

Workspace 1—N Team · Team 1—N Worker · Team 1—N WeekPlan · Team N—1 JurisdictionRuleset (via TeamRulesetBinding, versioned) · Workspace 1—N JurisdictionRuleset (custom scope) & 1—N Qualification · Worker N—M Qualification (via qualificationIds) · WeekPlan 1—N Shift · Shift 1—N ShiftAssignment · ShiftAssignment N—1 Worker · WeekPlan 1—N RuleViolation (violation N—1 ruleset-at-version; violation N—M ShiftAssignment via assignmentIds) · WeekPlan 1—N PublicationRecord (immutable; latest is authoritative) · PublicationRecord 1—N ExportArtifact · Job spans roster-import/guardrail-scan/export/swap-import work · WeekPlan N—0..1 prior WeekPlan (boundary checks, `priorWeekPlanId`).

## State obligations

- **Determinism is a contract**: identical (plan draft state, roster state, ruleset version) always yields identical violations; findings are never hand-created or hand-closed — `resolved` happens only by recomputation after an edit, `waived` only through the waiver record with actor + reason.
- **Version pinning**: RuleViolation pins `rulesetVersion` and `inRamadanWindow`; PublicationRecord pins ruleset + plan revision; stock rulesets are immutable (clone-to-custom is the only edit path) — no rule change ever mutates a published week or an existing finding.
- **The gate is a contract, not a checkbox**: publication succeeds only with zero open blocking violations and zero headcount shortfalls; post-publication mutations set the plan to `pending-amendment` — the prior publication record stays immutable, and the amendment path publishes a NEW record.
- **Swap provenance is data, not negotiation**: an `external-swap` assignment records from/to/agreed-at/source and nothing else — no matching, no ranking, no request state (shift-swap-marketplace owns those, LOOP-3/12 Q-4). Every swap-in change is re-validated and its second-order violations carry `introducedBySwapProvenance`.
- **Engine precedence**: where contract caps and ruleset caps disagree, the engine enforces the **stricter** (lower) of the two (07c rule 2) — surfaced in the roster-rail cap tooltip, never silent.
- **Cross-week honesty**: rest-gap and consecutive-day rules evaluate across the week boundary against the prior published plan; when none exists the inspector states the limitation (03 CP-2.6).
- **Partial-result policies** (async-contract §4): roster import and swap-set import deliver rows-so-far + named invalid/conflicting rows; scans are per-worker re-runnable (determinism makes re-runs safe); exports deliver per-format partial with per-format retry.
- **No provider names anywhere** — channels appear as provenance `source` values and abstract needs in 08.
