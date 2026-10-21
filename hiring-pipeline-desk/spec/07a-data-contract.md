# 07a — Data Contract: hiring-pipeline-desk

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — exactly one operation touches an AI capability (`proposeKitQuestions`, 07b): it drafts interview questions behind a per-question confirm gate (P15) and degrades to the deterministic template bank when the capability is unbound, unconsented, rate-limited, or refused. Every other computation in the product — the bias nudges, the debrief means, the divergence marks, the seals, the gates — is deterministic arithmetic over declared state (07c), and no core workflow requires the assist: kits can always be authored by hand or from the template bank. There is no candidate scoring, ranking, or prediction anywhere in the data model — by construction, not by policy note (no such field exists).

```ts
export type Locale = 'ar' | 'en';
export type InterviewLanguage = 'ar' | 'en' | 'bilingual';

// ---- Workspace & members ----

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;                 // chrome direction default (bilingual-en product — either direction full citizen, 05)
  stageTemplateId: string;               // default stage set for new openings (frozen per opening at creation)
  anonymizedScreening: boolean;          // display discipline: names masked in Applied/Screening for recruiter/hm roles (07c A5)
  assistQuotaWindow: { window: string; assistRuns: number; resetAt: string };  // P14 meter for the question assist
}

export type MemberRole = 'owner' | 'recruiter' | 'hiring_manager' | 'interviewer';

export interface Member {
  id: string;
  displayName: string;                   // may carry mixed script; bidi-isolated at render
  role: MemberRole;
  locale: Locale;                        // their chrome preference; scorecard surface renders accordingly (09)
  active: boolean;                       // deactivation voids unsubmitted cards, named — never silent (03 CP-3 edge)
}

// ---- Openings & stages ----

export type OpeningStatus = 'draft' | 'open' | 'paused' | 'filled' | 'closed';

export type StageKind =
  | 'application' | 'screening' | 'interview' | 'decision'
  | 'terminal-hired' | 'terminal-rejected' | 'terminal-withdrawn';

export interface StageDefinition {
  id: string;
  kind: StageKind;
  nameEn: string;
  nameAr: string;
  order: number;                         // board column order (mirrors in RTL)
}

export interface Opening {
  id: string;
  workspaceId: string;
  titleEn: string;                       // bilingual title pair — both first-class; either may be empty (single-language honesty)
  titleAr: string;
  department?: string;
  location?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  openingsCount: number;
  status: OpeningStatus;
  stages: StageDefinition[];             // frozen at creation from the workspace template (the invariant — no silent reshuffles)
  kitId: string;
  counts: {                               // derived at read — never authoritative storage
    applications: number;
    activeApplications: number;           // non-terminal
    interviewsScheduled: number;
    scorecardsPending: number;
  };
  sample: boolean;                       // first-run fixture flag (clearable; never mixes into exports unless included)
  version: number;                       // status/title edits re-version; CONFLICT base
  createdAt: string;
  updatedAt: string;
}

// ---- Interview kits (the bilingual structured-interview artifact) ----

export interface KitQuestion {
  id: string;
  language: Locale;                      // the question exists IN a language — EN and AR variants are separate rows
  text: string;                          // renders at its own script direction inside the kit studio (per-side direction)
  origin: 'human' | 'template' | 'ai-assisted';   // visible in-product — machine proposals never laundered
  competencyId: string;
  createdAt: string;
}

export interface Competency {
  id: string;
  nameEn: string;
  nameAr: string;
  weight: number;                        // per-kit; must sum to 100 across competencies (VALIDATION)
}

export interface InterviewKit {
  id: string;
  openingId: string;
  competencies: Competency[];            // 4–6 (category convention, 01 q4) — enforced on save
  questions: KitQuestion[];
  version: number;                       // save base; findings/interviews pin the version they used
  updatedAt: string;
}

// ---- Candidates & applications ----

export interface Candidate {
  id: string;
  nameLatin?: string;                    // at least one of the pair required (VALIDATION)
  nameArabic?: string;                   // renders RTL, bidi-isolated in LTR lists (rtl-rules §2)
  email?: string;                        // duplicate detection key on import (normalized)
  phone?: string;
  links?: string[];
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationSource = 'manual' | 'referral' | 'intake-channel';

export interface StageHistoryEntry {
  fromStageId?: string;
  toStageId: string;
  actorMemberId: string;
  reason?: string;                       // REQUIRED on terminal moves (rejection reason, withdrawal reason)
  at: string;
}

export interface Application {
  id: string;
  openingId: string;
  candidateId: string;
  currentStageId: string;
  source: ApplicationSource;
  stageHistory: StageHistoryEntry[];     // append-only; the timeline's spine (03 CP-2.4)
  notes: { id: string; actorMemberId: string; text: string; at: string }[];  // append-only — never edited after the fact
  currentRound: number;                  // increments when a decision advances past an interview round
  baseStage: number;                     // moveApplication conflict anchor
  createdAt: string;
  updatedAt: string;
}

// ---- Interviews & scorecards ----

export type InterviewState = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Interview {
  id: string;
  applicationId: string;
  round: number;
  language: InterviewLanguage;           // part of the record's truth — never re-labelled after the fact (12 Q-10)
  kitVersion: number;                    // pinned: the question set this interview used, forever
  interviewerMemberIds: string[];
  scheduledAt: string;
  durationMin: number;
  modeLabel: string;                     // free text (onsite / phone / video) — no provider binding
  state: InterviewState;
  cancelReason?: 'candidate' | 'interviewer' | 'scheduling';
  createdAt: string;
  updatedAt: string;
}

export type Rating = 1 | 2 | 3 | 4;      // anchored: 1 below the bar · 2 approaching · 3 meets · 4 exceeds (no midpoint — 12 Q-8)
export type Recommendation = 'strong-yes' | 'yes' | 'no' | 'strong-no';

export interface CompetencyRating {
  competencyId: string;
  rating: Rating;
  evidence: string;                      // REQUIRED, non-empty (VALIDATION on submit); dir="auto" input, bidi-isolated render
}

export interface Scorecard {
  id: string;
  interviewId: string;
  interviewerMemberId: string;
  ratings: CompetencyRating[];           // one per kit competency at the pinned kitVersion
  recommendation: Recommendation;
  state: 'draft' | 'submitted' | 'voided';
  submittedAt?: string;
  baseVersion: number;                   // submit CONFLICT anchor (another device saved later)
  nudges: string[];                      // BiasNudge ids — computed at submit, recomputed on evidence edit (07c)
  createdAt: string;
  updatedAt: string;
}

// ---- Bias nudges (deterministic findings — rules per 07c) ----

export type NudgeKind = 'evidence-thin' | 'trait-language' | 'rating-divergence';

export interface BiasNudge {
  id: string;
  kind: NudgeKind;
  scorecardId?: string;                  // card-level kinds
  interviewId?: string;                  // divergence is round-level (computed in the debrief pass)
  competencyId: string;
  measured: {                             // the numbers ARE the nudge's argument — carried in data, rendered in text
    wordCount?: number;                  // evidence-thin
    traitWords?: string[];               // trait-language (the matched words, verbatim)
    spread?: { min: Rating; max: Rating; byMemberIds: string[] };  // rating-divergence
  };
  state: 'open' | 'addressed' | 'dismissed';
  resolution?: {
    action: 'addressed'                  // evidence edited; rule re-ran and passed (recomputed, never hand-set)
    | 'dismissed';                       // human stands by the card — reason REQUIRED
    reason?: string;                     // REQUIRED for 'dismissed'
    actorMemberId: string;
    at: string;
  };
  computedAt: string;
}

// ---- Decisions (the debrief's output) ----

export type DecisionKind = 'advance' | 'reject' | 'hold';

export interface Decision {
  id: string;
  applicationId: string;
  round: number;
  kind: DecisionKind;
  rationale: string;                     // REQUIRED for 'reject' and 'hold' (free text — never a nudge echo)
  reviewOn?: string;                     // REQUIRED for 'hold'
  decidedByMemberId: string;
  debriefSnapshot: {                     // pinned: the exact state the decision was made on (audit honesty)
    kitVersion: number;
    scorecardIds: string[];
    scorecardVersions: number[];
    means: { competencyId: string; weightedMean: number }[];
    recommendationTally: Record<Recommendation, number>;
  };
  supersededByDecisionId?: string;       // decisions append, never overwrite (07a chain)
  at: string;
}

// ---- Debrief (derived aggregate — recomputed from card state, deterministic) ----

export interface Debrief {
  applicationId: string;
  round: number;
  readiness: {
    interviewsTotal: number;             // scheduled+completed in the round (no-shows and cancellations excluded, named)
    scorecardsIn: number;
    outstanding: { interviewId: string; interviewerMemberId: string }[];   // the gate's own words
    allIn: boolean;
  };
  aggregate?: {                          // present iff allIn — means withheld until the aggregate is honest (03 CP-4.1)
    means: { competencyId: string; nameEn: string; nameAr: string; weight: number; weightedMean: number }[];
    recommendationTally: Record<Recommendation, number>;
    divergence: { competencyId: string; spread: { min: Rating; max: Rating; byMemberIds: string[] } }[];
  };
  generatedAt: string;
}

// ---- Async jobs, exports, activity ----

export type AsyncJobKind = 'import' | 'export' | 'assist';

export interface AsyncJob {
  id: string;
  kind: AsyncJobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: rows / formats / proposals
  partial?: unknown;
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                // async-contract §5 — double-submits never double-import/export/charge quota
  openingId?: string;
  createdAt: string;
}

export interface ExportArtifact {
  id: string;
  openingId: string;
  formats: ('candidate-slate' | 'scorecards' | 'activity-ledger')[];
  includeNames: boolean;                 // anonymization is display discipline; the audit export defaults to names included, toggle stated (03 CP-5)
  kitVersionsPinned: number[];           // the package pins question versions — regeneration is deterministic
  expiresAt: string;
  regenerable: boolean;                  // always true in v1
}

export interface ActivityEntry {         // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'opening-created' | 'opening-updated' | 'kit-saved'
    | 'candidate-created' | 'candidate-updated' | 'candidates-imported'
    | 'application-created' | 'application-moved' | 'application-noted'
    | 'interview-scheduled' | 'interview-updated'
    | 'scorecard-saved' | 'scorecard-submitted'
    | 'nudge-fired' | 'nudge-resolved'
    | 'decision-recorded' | 'decision-superseded'
    | 'assist-run' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                       // e.g. move reason, nudge kind, assist origin mode — provenance audit
  at: string;
}
```

## Relationships

Workspace 1—N Member · Workspace 1—1 StageTemplate (default) · Workspace 1—N Opening · Opening 1—1 InterviewKit · InterviewKit 1—N Competency · InterviewKit 1—N KitQuestion (per language; Competency 1—N KitQuestion) · Candidate 1—N Application · Opening 1—N Application · Application 1—N StageHistoryEntry (append-only) · Application 1—N Interview (per round) · Interview 1—N Scorecard (one per interviewer) · Scorecard 1—N BiasNudge (card-level kinds) · Interview 1—N BiasNudge (divergence, round-level) · Application 1—N Decision (chain via supersededByDecisionId) · Debrief is derived (Application × round → aggregate over submitted Scorecards) · AsyncJob spans import/export/assist · Opening 1—N ExportArtifact · Workspace 1—N ActivityEntry.

## State obligations

- **Stages are frozen per opening**: `Opening.stages` is copied from the workspace template at creation and never mutated afterwards — board geometry cannot silently change under live applications. Template edits affect future openings only.
- **The bilingual completeness rule has two teeth**: kit save enforces 4–6 competencies, weights 100, and warns on per-language gaps; `scheduleInterview` HARD-gates on ≥1 question per competency in the interview's language (VALIDATION naming the gaps) — an interview can never exist without its questions in the room's language.
- **The independence seal is a data rule**: scorecards of an interview are invisible to a member (any role) until that member's own card for that interview is `submitted`; owner/recruiter read-all arrives only through the debrief's all-in state. Sealed fetches → PERMISSION, never filtered silence.
- **Scorecards are immutable-append**: `draft → submitted` is one-way; evidence edits on a submitted card append a revision and re-run the card-level nudge rules (same input, same verdict — 07c); `voided` only via interviewer deactivation (named in the activity log).
- **Nudges are recomputed, never hand-set**: `addressed` transitions happen only when the rule re-runs and passes on the edited evidence; `dismissed` requires a reason and is permanent per nudge instance.
- **Decisions pin their evidence**: `debriefSnapshot` freezes kit version, card ids/versions, means, and tally at decision time; superseding appends — the old record stays. The debrief gate refuses `recordDecision` while any current-round card is outstanding (VALIDATION naming it).
- **Partial-result policies** (async-contract §4): candidate imports deliver rows-so-far + named invalid rows; exports deliver per-format partial with per-format retry; assist runs deliver proposals-so-far on mid-run failure, visibly marked partial.
- **No provider names anywhere** — intake appears as `ApplicationSource` values, interview modes as free labels, and the assist as an abstract capability (08).
