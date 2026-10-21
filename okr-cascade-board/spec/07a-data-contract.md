# 07a — Data Contract: okr-cascade-board

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — exactly one capability-touching operation family exists, the bilingual drafting assist (proposals for objective/KR text pairs), abstract and consent-gated (08 N1); when unbound, exhausted, or refused the product runs the plain bilingual editor with the deterministic writing lint, and every core workflow (cascade authoring, check-ins, derived states, grading, export) is AI-free by construction. TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';               // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                      // per-kind partial policy (07b rules)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                 // async-contract §5
  createdAt: string;
}

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
```

## Relationships

Workspace 1—N Member · Workspace 1—N Team (Member optionally belongs to one Team) · Workspace 1—N Cycle · Cycle 1—N Objective (company + team levels) · Objective (team) N—M Objective (company) via AlignmentLink (parentIds) · Objective 1—N KeyResult · KeyResult 1—N CheckIn (one per period; unique on (keyResultId, periodStart)) · KeyResult 1—1 KeyResultDerivedState (computed at read) · Cycle 1—N GradeSheet (one computed per grading pass; one final at close) · Cycle 1—N DraftProposal · Cycle 1—N ExportArtifact · Job spans draft runs and exports · Workspace 1—N ActivityEntry.

## State obligations (lifecycle invariants)

- **Cycle state machine**: draft → active → grading → closed. Authoring and check-ins happen in draft+active; grading and export in grading+closed; `updateCycle` date edits only in draft; cycle close requires a computed grade sheet; closed cycles are immutable (no re-open at v1 — a corrected quarter is a new cycle, 12 Q-10).
- **Progress is submitted-state-only**: rollups read latest SUBMITTED check-ins; drafts never count (a draft is not a report); KRs with zero submissions render unreported ("—"), never 0%.
- **At-risk is a derived function** (confidence ≤ 2 on the latest submission, or missing streak ≥ 2 after ≥1 prior submission — 07c rule 3): computed at read from current state, never stored as a verdict; it can appear and clear as check-ins land.
- **Bilingual pairs are human-authored**: no operation machine-fills an empty AR or EN side; the drafting assist proposes text a human resolves through the P15 gate (accept copies into the editor as an editable draft); parity warnings are advisory only.
- **Metric integrity**: baseline ≠ target enforced at authoring and re-baselining; historical check-in values are never rewritten by a re-baseline (priorValues and prior snapshots persist).
- **Corrections preserve history**: check-in updates append to priorValues and increment revision; the rollup reads the corrected current value; the trail stays auditable (P16).
- **Archived entities leave computation, never the record**: archived KRs are excluded from rollups and grading (counted in the disclosure); archived objectives keep their links, check-in history, and the archive reason; the export appendix carries both.
- **Grade sheets are immutable snapshots**: pinned to objective versions and check-in revisions at computation; recomputation from the same pinned inputs is bit-identical (07c regression assertion); the closed cycle's sheet is the record.
- **Sample-cycle honesty**: `isSample` cycles are seeded (07c), badge-labeled, clearable, and never regenerate after clearing (12 Q-14).
- **No provider names anywhere** — the drafting assist appears as an abstract capability class in consent language (credential-contract §2), and nothing in this contract names an implementation.
