// VERBATIM from specs-source/hiring-pipeline-desk/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (Opening, InterviewKit,
// Candidate, Application, Interview, Scorecard, BiasNudge, Decision, Debrief —
// and their fields) are declared canonically in 07a and are part of this
// contract by reference; 07b declares only the operational wrappers (summaries,
// rows, views, jobs) its signatures need. This product is CONDITIONALLY-AI
// (ai-native-patterns §1): exactly one operation (proposeKitQuestions) may
// invoke an AI capability, behind a per-question confirm gate; it degrades to
// the deterministic template bank (07c) when the capability is unbound,
// unconsented, rate-limited, or refused. Every other operation is deterministic
// arithmetic over declared state.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (kit rules 4-6/weights/bilingual coverage at scheduling, scorecard submit completeness, decision gates, import row shape, reject-without-reason)
 * 'NOT_FOUND'    -> NotFoundError     (stale opening/candidate/application/interview/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (capability consent, role boundaries, sealed-scorecard fetches before own submission)
 * 'CONFLICT'     -> ConflictError     (concurrent kit saves, stage moves, scorecard submits, decision vs late card, interviewer double-booking)
 * 'RATE_LIMIT'   -> RateLimitError    (question-assist runs, export packages)
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
  role: 'owner' | 'recruiter' | 'hiring_manager' | 'interviewer';
  locale: 'ar' | 'en';                    // chrome direction; content renders per-side direction (05)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export type Locale = 'ar' | 'en';
export type InterviewLanguage = 'ar' | 'en' | 'bilingual';

export interface OpeningSummary {
  id: string;
  titleEn: string;
  titleAr: string;
  status: 'draft' | 'open' | 'paused' | 'filled' | 'closed';
  counts: { applications: number; activeApplications: number; interviewsScheduled: number; scorecardsPending: number };
  sample: boolean;
  version: number;
  updatedAt: string;
}

export interface CandidateRow {            // directory rows (virtualized above 200 — P19)
  id: string;
  nameLatin?: string;                      // per-side direction render, bidi isolation (rtl-rules §2)
  nameArabic?: string;
  email?: string;
  phone?: string;
  applicationCount: number;
  activeOpenings: string[];
  createdAt: string;
}

export interface ApplicationRow {          // board cards
  id: string;
  openingId: string;
  candidate: { id: string; nameLatin?: string; nameArabic?: string; displayName: string };  // displayName honors anonymized screening (07c A5)
  currentStageId: string;
  stageEnteredAt: string;                  // tenure line
  source: 'manual' | 'referral' | 'intake-channel';
  nextInterview?: { interviewId: string; at: string; language: InterviewLanguage; round: number };
  recommendationTally?: Record<'strong-yes' | 'yes' | 'no' | 'strong-no', number>;  // present once ≥1 card submitted in the current round
  currentRound: number;
  baseStage: number;
}

export interface KitView {
  kit: InterviewKit;                       // 07a full shape (competencies + questions per language)
  coverage: { language: Locale; competenciesCovered: number; competenciesTotal: number }[];  // the scheduling gate's own numbers
}

export interface QuestionProposal {
  id: string;                              // proposal-scoped, not a KitQuestion id — nothing writes without accept (P15)
  language: Locale;
  text: string;
  competencyId: string;
  origin: 'template' | 'ai-assisted';      // 'template' = deterministic bank, labeled in-product; 'ai-assisted' = capability draft
  partial: boolean;                        // mid-run failure marks proposals-so-far (async-contract §4)
}

export interface AssistJobResult {
  mode: 'assist' | 'template';             // the run's honesty stamp: which path produced the proposals
  proposals: QuestionProposal[];
  quotaConsumed: number;                   // P14: assist mode consumes; template mode never does
}

export interface ScorecardView {
  scorecard: Scorecard;                    // 07a full shape
  competencyNames: { competencyId: string; nameEn: string; nameAr: string; weight: number }[];  // at the pinned kitVersion
  questionsInLanguage: { competencyId: string; text: string }[];   // the interview's language (bilingual: both, aligned)
  nudges: BiasNudge[];
}

export interface ScorecardSealed {
  interviewId: string;
  interviewerMemberId: string;
  displayName: string;                     // the sealed row's name — status only, no content (independence seal)
  state: 'draft' | 'submitted' | 'voided' | 'not-started';
}

export interface AsyncJobView<T> {         // 07a AsyncJob with its result channel typed per kind
  id: string;
  kind: 'import' | 'export' | 'assist';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;
  openingId?: string;
  createdAt: string;
}

// ---- Contract ----

export interface HiringPipelineAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // platform
  getUsage(): Promise<Result<{
    window: string;
    assistRuns: number;
    exportPackages: number;
    resetAt: string;
  }, AdapterError>>;

  // openings
  createOpening(input: {
    titleEn: string;
    titleAr: string;                       // either side may be empty — single-language honesty; the bilingual gap surface is the kit
    department?: string;
    location?: string;
    employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
    openingsCount: number;
    stageTemplateId?: string;              // workspace default otherwise; stages frozen at creation (07a invariant)
  }): Promise<Result<OpeningSummary, AdapterError>>;
  listOpenings(query: {
    filter?: { status?: OpeningSummary['status'][]; sample?: boolean };
    search?: string;                       // normalized bilingual search over title pair (rtl-rules §4)
    sort: 'updatedAt' | 'createdAt' | 'applications';
    cursor?: string; limit: number;
  }): Promise<Result<Page<OpeningSummary>, AdapterError>>;
  getOpening(id: string): Promise<Result<OpeningSummary & {
    stages: StageDefinition[];
    kitCoverage: KitView['coverage'];
  }, AdapterError>>;
  updateOpening(id: string, patch: {
    titleEn?: string;
    titleAr?: string;
    status?: OpeningSummary['status'];     // pause/close/fill — versioned lifecycle writes
    openingsCount?: number;
    baseVersion: number;                   // stale -> CONFLICT with both payloads
  }): Promise<Result<OpeningSummary, AdapterError>>;

  // candidates (manual-first intake — LOOP-5)
  createCandidate(input: {
    nameLatin?: string;                    // at least one of the pair required -> VALIDATION naming both fields
    nameArabic?: string;
    email?: string;
    phone?: string;
    links?: string[];
    note?: string;
  }): Promise<Result<CandidateRow, AdapterError>>;
  updateCandidate(id: string, patch: {
    nameLatin?: string;
    nameArabic?: string;
    email?: string;
    phone?: string;
    links?: string[];
    note?: string;
  }): Promise<Result<CandidateRow, AdapterError>>;
  listCandidates(query: {
    search?: string;                       // normalized bilingual name search (alef/hamza, taa marbuta, yaa forms — rtl-rules §4)
    filter?: { activeInOpeningId?: string };
    sort: 'updatedAt' | 'nameLatin' | 'applicationCount';
    cursor?: string; limit: number;        // virtualized surface: cursor pages <= 100
  }): Promise<Result<Page<CandidateRow>, AdapterError>>;
  importCandidates(input: {
    openingId?: string;                    // optional: imported rows become applications at Applied
    source: 'paste' | 'intake-capability';
    content?: string;                      // paste payload: one row per line — name-latin | name-arabic | email | phone | source
    capabilityRef?: string;                // intake-capability path only; consent enforced server-side
    idempotencyKey: string;                // async-contract §5
  }): Promise<Result<AsyncJobView<{ imported: number; duplicates: string[]; invalidRows: string[]; applicationsCreated?: number }>, AdapterError>>;

  // applications & the pipeline board
  createApplication(input: {
    openingId: string;
    candidateId: string;
    source: 'manual' | 'referral' | 'intake-channel';
  }): Promise<Result<ApplicationRow, AdapterError>>;
  listApplications(query: {
    openingId: string;
    filter?: {
      stageIds?: string[];
      source?: ApplicationRow['source'][];
      hasInterview?: boolean;
      tenureOverdueDays?: number;
    };
    search?: string;                       // normalized match inside candidate name pair
    sort: 'stageEnteredAt' | 'createdAt' | 'nameLatin';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ApplicationRow>, AdapterError>>;
  getApplication(id: string): Promise<Result<{
    application: Application;              // 07a full shape incl. stage history + notes chain
    candidate: Candidate;
    interviews: { id: string; round: number; language: InterviewLanguage; state: Interview['state']; scheduledAt: string }[];
    decisions: Decision[];
    currentDebrief: Debrief;
  }, AdapterError>>;
  moveApplication(id: string, input: {
    toStageId: string;
    reason?: string;                       // REQUIRED for terminal stages -> VALIDATION without it (rejection reason)
    baseStage: number;                     // another seat moved it first -> CONFLICT with current stage shown
  }): Promise<Result<ApplicationRow, AdapterError>>;
  updateApplication(id: string, patch: {
    note?: string;                         // notes append — they are never edited after the fact (07a)
  }): Promise<Result<ApplicationRow, AdapterError>>;

  // interview kits (the bilingual artifact)
  getKit(openingId: string): Promise<Result<KitView, AdapterError>>;
  saveKit(openingId: string, input: {
    competencies: Competency[];            // 4–6, weights sum 100 -> VALIDATION naming the rule broken
    questions: KitQuestion[];              // per-language rows; per-language coverage gaps WARN (hard gate is at scheduling)
    baseVersion: number;                   // stale -> CONFLICT with both payloads side by side
  }): Promise<Result<KitView, AdapterError>>;
  proposeKitQuestions(input: {
    openingId: string;
    competencyId: string;
    language: Locale;
    count: number;                         // 1–5
    seniority?: 'junior' | 'mid' | 'senior';
    idempotencyKey: string;
  }): Promise<Result<AsyncJobView<AssistJobResult>, AdapterError>>;
  // ^ the conditionally-AI assist: capability bound+consented -> 'ai-assisted' proposals behind the P15
  //   accept/edit/dismiss gate (accepted+edited rows save via saveKit with origin 'ai-assisted');
  //   unbound/unconsented/rate-limited/refused -> mode 'template' proposals from the deterministic
  //   bank (07c) — the panel's native content, never an error state.

  // interviews
  scheduleInterview(input: {
    applicationId: string;
    round: number;
    language: InterviewLanguage;           // the bilingual coverage gate keys on this
    interviewerMemberIds: string[];        // interviewer-role members only -> PERMISSION otherwise
    scheduledAt: string;
    durationMin: number;
    modeLabel?: string;                    // free label — onsite/phone/video; no provider binding
  }): Promise<Result<Interview, AdapterError>>;
  // ^ kit coverage gate: <1 question per competency in `language` -> VALIDATION naming each gap;
  //   interviewer overlap with another scheduled interview -> CONFLICT naming both.
  listInterviews(query: {
    filter?: {
      scope?: 'mine' | 'all';              // 'mine' default for interviewer seats (04 S8)
      state?: Interview['state'][];
      openingId?: string;
      language?: InterviewLanguage[];
      from?: string; to?: string;
    };
    sort: 'scheduledAt' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<Interview>, AdapterError>>;
  getInterview(id: string): Promise<Result<{
    interview: Interview;
    application: { id: string; displayName: string };
    kitQuestionsAtVersion: KitQuestion[];  // pinned at scheduling — what the room actually had
    myScorecardState: 'not-started' | 'draft' | 'submitted' | 'voided';
    peersSealed: ScorecardSealed[];        // names + states only — content never crosses the seal (rule 5)
  }, AdapterError>>;
  updateInterview(id: string, patch: {
    scheduledAt?: string;                  // reschedule; overlap re-checked -> CONFLICT
    state?: 'cancelled' | 'no-show' | 'completed';
    cancelReason?: 'candidate' | 'interviewer' | 'scheduling';   // REQUIRED with state 'cancelled' -> VALIDATION
    interviewerMemberIds?: string[];       // additions/voided removals are named in the activity log, never silent
  }): Promise<Result<Interview, AdapterError>>;

  // scorecards (the interviewer's write path)
  getScorecard(interviewId: string): Promise<Result<ScorecardView, AdapterError>>;
  // ^ returns the CALLING member's card (draft or submitted) for that interview; another
  //   member's card id -> PERMISSION ("sealed until you submit yours"); not an interviewer
  //   on this interview -> PERMISSION naming the seat's capability.
  saveScorecard(interviewId: string, draft: {
    ratings: CompetencyRating[];           // partial allowed in draft — completeness validates at submit
    recommendation?: Scorecard['recommendation'];
  }): Promise<Result<ScorecardView, AdapterError>>;
  // ^ autosave (P10): drafts are private to the member's seat; idempotent writes keyed by card.
  submitScorecard(interviewId: string, input: {
    ratings: CompetencyRating[];           // every kit competency rated, evidence non-empty -> VALIDATION naming gaps
    recommendation: Scorecard['recommendation'];
    baseVersion: number;                   // another device saved later -> CONFLICT with both payloads
  }): Promise<Result<ScorecardView, AdapterError>>;
  // ^ on submit the deterministic nudge rules run (07c): evidence-thin + trait-language may
  //   fire and attach — the card STILL submits (nudges mark, they never block).
  listScorecards(interviewId: string): Promise<Result<{
    mine: ScorecardView | null;
    sealed: ScorecardSealed[];             // while the caller's own card is unsubmitted — the independence seal
    revealed: ScorecardView[];             // peers' full cards, present ONLY after the caller submitted their own
  }, AdapterError>>;

  // debrief & decision
  getDebrief(applicationId: string, round: number): Promise<Result<{
    debrief: Debrief;                      // aggregate withheld until allIn (07a) — honesty, not teasing
    divergenceNudges: BiasNudge[];         // round-level findings with jump links (03 CP-4.3)
    cards: ScorecardSealed[];              // readiness state pre-all-in
  }, AdapterError>>;
  recordDecision(applicationId: string, input: {
    round: number;
    kind: 'advance' | 'reject' | 'hold';
    rationale: string;                     // REQUIRED for 'reject' and 'hold' -> VALIDATION
    reviewOn?: string;                     // REQUIRED for 'hold' -> VALIDATION
    baseDebriefState: { scorecardsIn: number };   // a late card landed -> CONFLICT; the late card becomes post-decision history
  }): Promise<Result<Decision, AdapterError>>;
  // ^ gate: any outstanding current-round scorecard -> VALIDATION naming the missing card(s).

  // bias nudges (the accountability surface for the rules)
  listNudges(query: {
    filter?: {
      scope?: 'my-scorecards' | 'opening' | 'interview';
      openingId?: string;
      interviewId?: string;
      scorecardId?: string;
      kind?: BiasNudge['kind'][];
      state?: BiasNudge['state'][];
    };
    sort: 'computedAt' | 'kind';
    cursor?: string; limit: number;
  }): Promise<Result<Page<BiasNudge>, AdapterError>>;
  resolveNudge(input: {
    nudgeId: string;
    action: 'addressed' | 'dismissed';    // 'addressed' re-opens the evidence field; the rule re-runs on save (07c) —
                                          // the transition happens ONLY when the re-run passes, never by hand
    reason?: string;                       // REQUIRED for 'dismissed' -> VALIDATION
  }): Promise<Result<BiasNudge, AdapterError>>;

  // exports & platform
  exportOpeningPackage(input: {
    openingId: string;
    formats: ('candidate-slate' | 'scorecards' | 'activity-ledger')[];
    includeNames: boolean;                 // stated toggle — the audit export defaults to names included (03 CP-5)
    idempotencyKey: string;
  }): Promise<Result<AsyncJobView<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: ('candidate-slate' | 'scorecards' | 'activity-ledger')[];
  }, AdapterError>>;
  listAsyncJobs(query: {
    filter?: { state?: AsyncJobView<unknown>['state'][]; kind?: AsyncJobView<unknown>['kind'][]; openingId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<AsyncJobView<unknown>>, AdapterError>>;
  listActivity(query: {
    filter?: { openingId?: string; actorMemberId?: string; action?: ActivityEntry['action'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntry>, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
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

