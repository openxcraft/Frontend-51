# 07b — Adapter Contract: hiring-pipeline-desk (TypeScript, v1)

SME-G pass · `HiringPipelineAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, Member, Opening, StageDefinition, InterviewKit, Competency, KitQuestion, Candidate, Application, StageHistoryEntry, Interview, Scorecard, CompetencyRating, BiasNudge, Decision, Debrief, AsyncJob, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table — 34 operations, 0 orphans).

```ts
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
```

## Rules

1. **Determinism contract**: the nudge rules (evidence-thin, trait-language, rating-divergence), the debrief aggregates (weighted means, tally, divergence), the anonymized-screening render, and the template bank are specified exactly in 07c — identical input state yields identical output, every time. Nudge `addressed` transitions happen only via rule re-run on edited evidence; no finding is ever created or closed by hand.
2. **Bilingual coverage gate**: `scheduleInterview` with fewer than one question per competency in the interview's `language` → VALIDATION whose `details` name every missing competency+language pair. `saveKit` enforces 4–6 competencies and weights-sum-100 as hard validation; per-language coverage gaps warn (surfaced in the coverage meter) but do not block kit save — scheduling is the hard gate.
3. **The independence seal is adapter-enforced**: `getScorecard` for another member's card while the caller's own card is unsubmitted → PERMISSION ("Scorecards are sealed until you submit yours"); `listScorecards` returns `sealed` (names/states only) until the caller's card is submitted, then `revealed`. Owner/recruiter seats receive full cards through `getDebrief` only when the round is all-in. The seal is never a UI courtesy.
4. **The debrief gate**: `recordDecision` with any outstanding current-round scorecard → VALIDATION naming the interview and interviewer; `baseDebriefState` drift (a card landed between read and write) → CONFLICT — the late card becomes post-decision history, never silently absorbed. Decisions append (`supersededByDecisionId`); the snapshot pins kit version + card versions.
5. **Role boundaries**: interviewer seats may read the board and write only their own scorecards (+ nudge resolutions on their own cards, + interview reads); hiring-manager seats may move applications and record decisions for their openings but never author kits or write candidates; recruiter/owner do everything except capability consents (owner only). Violations → PERMISSION naming the seat's capability in capability language.
6. **Consent enforcement**: `proposeKitQuestions` (assist mode) and `importCandidates` with `source: 'intake-capability'` without granted consent → PERMISSION naming the capability class (credential-contract §4) — never a vendor; the template bank and paste paths carry no consent requirement, ever (LOOP-5).
7. **Idempotency**: assist/import/export submits carry idempotency keys; a retried submit returns the original job (async-contract §5) and never double-charges the assist quota. Progress is determinate in units (proposals, rows, formats) — an indeterminate bar claiming percentage is a contract violation.
8. **Partial policies**: imports deliver rows-so-far + named invalid rows (duplicates skipped and named); assist mid-run failure delivers proposals-so-far marked `partial`; exports deliver per-format partial with per-format retry (async-contract §4).
9. **Quota honesty**: `proposeKitQuestions` in assist mode consumes the windowed quota (P14 — warn at 80%, surface before and after); template mode consumes nothing and is never refused. Scorecards, nudges, moves, and decisions are never metered.
10. **Versioned writes**: `updateOpening` (baseVersion), `saveKit` (baseVersion), `moveApplication` (baseStage), `submitScorecard` (baseVersion) → CONFLICT with both payloads in `details`; nothing overwrites silently.
11. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (34/34). No operation scores, ranks, or predicts candidates — none exists on the surface (Upturn posture, 01).
