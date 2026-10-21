# 07b — Adapter Contract: survey-insight-miner (TypeScript, v1)

SME-G pass · `SurveyInsightAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Project, MetadataColumn, Question, Response, LanguageDetection, ToneSignal, Theme, ThemeMembership, ThemeQuote, CoverageReport, Crosstab, ClusterRunParams/Result, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table — 30 operations, 0 orphans).

```ts
// Single contract surface. Entity types referenced below (Theme, ThemeMembership,
// ThemeQuote, CoverageReport, Crosstab, ClusterRunParams, ClusterRunResult — and
// their fields) are declared canonically in 07a and are part of this contract by
// reference; 07b declares only the operational wrappers (summaries, rows, views,
// jobs) its signatures need. This product is CONDITIONALLY-AI
// (ai-native-patterns §1): the ONLY model-touched surface is the abstract
// response-clustering capability (08 N2) whose proposals land as 'proposed'
// themes with confidence bands behind the human confirm gate; the deterministic
// keyword-frequency floor implements the rest and is the declared degradation
// path for every capability state.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed import rows, paste-format errors, theme-label collisions, confirm-gate misuse, crosstab-before-run, export-with-nothing-confirmed)
 * 'NOT_FOUND'    -> NotFoundError     (stale project/question/response/theme/artifact links, expired artifacts, merged-away themes)
 * 'PERMISSION'   -> PermissionError   (capability consent, workspace scoping, viewer-role mutations)
 * 'CONFLICT'     -> ConflictError     (concurrent theme edits, confirm on dismissed proposals, bulk count drift, stale quote pins)
 * 'RATE_LIMIT'   -> RateLimitError    (model-assisted clustering runs, export packages — the keyword floor is NEVER metered)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, the model proposal stream, export delivery)
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
  role: 'owner' | 'researcher' | 'viewer';   // viewer: read + slice (the stakeholder seat, 02 Faisal), no mutations
  locale: 'ar' | 'en';                       // chrome direction; response text follows its own detected direction (05)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export interface ProjectSummary {
  id: string;
  name: string;
  questionCount: number;
  responseCount: number;
  sample: boolean;
  archived: boolean;
  updatedAt: string;
}

export interface QuestionSummary {
  id: string;
  projectId: string;
  prompt: { ar: string; en: string };
  responseCount: number;
  languageMix: Record<'msa' | 'dialect-leaning' | 'mixed-script' | 'empty', number>;
  toneMix: Record<'positive' | 'negative' | 'neutral' | 'mixed', number>;
  lastRunAt?: string;
}

export interface ImportJobResult {
  questionId: string;
  imported: number;
  emptyTexts: number;                        // blank rows — facts, kept and counted (07a)
  refCollisions: string[];                   // suffixed refs, disclosed
  invalidRows: string[];                     // named bad rows — partial policy (async-contract §4)
}

export interface ClusterJobResult extends ClusterRunResult {}   // 07a: engine, keywordTable, groups, proposals?, coverage, mode

export interface ResponseRow {                // reader rows (virtualized above 200 — P19)
  id: string;
  respondentRef: string;
  excerpt: string;                            // bidi-isolated at render; word-boundary clamp (rtl-rules §4)
  langClass: 'msa' | 'dialect-leaning' | 'mixed-script' | 'empty';
  overriddenLangClass: boolean;               // human override present (03 CP-2.5)
  tone: 'positive' | 'negative' | 'neutral' | 'mixed';
  themeCount: number;                         // 0 = unassigned
  hasPinnedQuote: boolean;
  updatedAt: string;
}

export interface ResponseView {
  response: Response;                         // 07a full shape — verbatim at its own direction
  memberships: (ThemeMembership & { themeLabel: { ar: string; en: string }; themeState: string })[];
  isPinnedIn: string[];                       // themeIds where this response's quote is pinned
}

export interface ThemeSummary {               // board cards
  id: string;
  questionId: string;
  label: { ar: string; en: string };
  provenance: 'keyword-grouping' | 'model-proposed' | 'human-confirmed';
  state: 'proposed' | 'confirmed' | 'merged-away' | 'deleted';
  confidenceBand?: 'high' | 'medium' | 'low';
  memberCount: number;
  shareOfAssigned: number;                    // may sum past 1.0 across themes — overlap honesty (07a)
  keywords: string[];
  version: number;
  updatedAt: string;
}

export interface ThemeView {
  theme: Theme;                               // 07a full shape
  quotes: (ThemeQuote & { responseExcerpt: string; respondentRef: string; langClass: string })[];
  membersPreview: ResponseRow[];              // first page of the member set
  membershipFilterCursor: string | null;      // continue into listResponses with theme filter
}

export interface ConfirmGateView {            // the P15 preview — truth at open time, not a snapshot (03 CP-3 edge)
  themeId: string;
  label: { ar: string; en: string };
  confidenceBand: 'high' | 'medium' | 'low';
  membersIn: { responseId: string; excerpt: string }[];
  membersExcluded: { responseId: string; excerpt: string; reason: 'below-evidence-floor' }[];
  quotesPreview: ThemeView['quotes'];        // rule re-run preview
}

export interface MergePreview {
  survivorLabel: { ar: string; en: string };  // editable inline in the composer (03 CP-3.4)
  sourceCounts: { themeId: string; members: number }[];   // named counts — P04 level-2
  unionMembers: number;
  quotesPreview: ThemeView['quotes'];        // rule re-run over the union (07c rule 6)
  pinnedSurvive: string[];                    // responseIds of pinned quotes carried over, marked
}

export interface BulkAssignResult {
  assigned: number;
  skipped: { responseId: string; reason: 'already-member' | 'filter-drift' }[];
}

export interface ExportJobResult {
  artifacts: { artifactId: string; format: 'theme-report' | 'coded-dataset'; expiresAt: string }[];
}

export interface Job<T> {                     // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'import' | 'clustering' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                    // async-contract §5
  projectId?: string;                        // link-to-context for the jobs console (04 S8)
  questionId?: string;
}

// ---- Contract ----

export interface SurveyInsightAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // projects
  createProject(input: {
    name: string;
    note?: string;
    metadataColumns?: { key: string; label: { ar: string; en: string }; type: 'text' | 'enum' | 'number' }[];
  }): Promise<Result<ProjectSummary, AdapterError>>;
  listProjects(query: {
    filter?: { archived?: boolean; sample?: boolean };
    search?: string;                          // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'createdAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ProjectSummary>, AdapterError>>;
  getProject(id: string): Promise<Result<ProjectSummary & {
    metadataColumns: MetadataColumn[];               // 07a shape, by reference
    questionIds: string[];
  }, AdapterError>>;
  updateProject(id: string, patch: {
    name?: string;
    note?: string;
    archived?: boolean;
    metadataColumns?: MetadataColumn[];             // edits re-version the project; crosstab keys stay stable via column.id
  }): Promise<Result<ProjectSummary, AdapterError>>;

  // intake (paste/file-upload = the LOOP-5 always-available path; capability path consent-gated — 08 N1)
  importResponses(input: {
    projectId: string;
    prompt: { ar: string; en: string };        // the question as asked
    source: 'paste' | 'file-upload' | 'intake-capability';
    content?: string;                          // paste payload: rows of `respondent-ref | response text | metadata values`
    capabilityRef?: string;                    // intake-capability path only; consent enforced server-side
    idempotencyKey: string;                    // async-contract §5
  }): Promise<Result<Job<ImportJobResult>, AdapterError>>;
  listQuestions(query: {
    projectId: string;
    filter?: { hasRun?: boolean };
    sort: 'createdAt' | 'responseCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<QuestionSummary>, AdapterError>>;
  getQuestion(id: string): Promise<Result<QuestionSummary & {
    coverage: CoverageReport;
    metadataColumnStats: { key: string; distinctValues: number; unspecified: number }[];
  }, AdapterError>>;

  // response reading & detection honesty
  listResponses(query: {
    questionId: string;
    filter?: {
      langClass?: ('msa' | 'dialect-leaning' | 'mixed-script' | 'empty')[];
      overridden?: boolean;
      tone?: ('positive' | 'negative' | 'neutral' | 'mixed')[];
      themeId?: string | 'unassigned' | 'multi-theme';
      metadata?: Record<string, string>;
      hasPinnedQuote?: boolean;
    };
    search?: string;                          // normalized match inside verbatim text (ruleset disclosed in-panel)
    sort: 'importOrder' | 'updatedAt';
    cursor?: string; limit: number;           // virtualized surface: cursor pages ≤ 100
  }): Promise<Result<Page<ResponseRow>, AdapterError>>;
  getResponse(id: string): Promise<Result<ResponseView, AdapterError>>;
  setResponseLanguageOverride(id: string, input: {
    langClass: 'msa' | 'dialect-leaning' | 'mixed-script';   // 'empty' not overridable — text is empty
    reason?: string;
  }): Promise<Result<ResponseView, AdapterError>>;

  // clustering (deterministic floor always; model proposals only when the capability is bound+consented — 08 N2)
  runClustering(input: {
    questionId: string;
    params?: Partial<ClusterRunParams>;       // topK default 12, minGroupSize default 5, stopwords 'default'
    requestModelProposals: boolean;           // explicit opt-in; false = floor-only run (quota never charged)
    idempotencyKey: string;
  }): Promise<Result<Job<ClusterJobResult>, AdapterError>>;

  // themes & curation
  listThemes(query: {
    questionId: string;
    filter?: {
      state?: ('proposed' | 'confirmed')[];
      provenance?: ('keyword-grouping' | 'model-proposed' | 'human-confirmed')[];
      minMembers?: number;
    };
    sort: 'memberCount' | 'label' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ThemeSummary>, AdapterError>>;
  getTheme(id: string): Promise<Result<ThemeView, AdapterError>>;
  saveTheme(input: {
    questionId: string;
    theme: {
      id?: string;                            // absent = create (the from-scratch path, 03 CP-3.3)
      label: { ar: string; en: string };
      definition?: { ar: string; en: string };
      keywords?: string[];
    };
    baseVersion?: number;                     // stale -> CONFLICT with both payloads
  }): Promise<Result<ThemeView, AdapterError>>;
  confirmTheme(input: {
    themeId: string;
    decision: 'confirm' | 'reject';
    rejectReason?: string;                    // optional, recorded on the dismissed proposal
  }): Promise<Result<ThemeView, AdapterError>>;   // confirm/reject both return the post-decision state
  getConfirmGate(themeId: string): Promise<Result<ConfirmGateView, AdapterError>>;
  getMergePreview(input: { themeIds: [string, string] }): Promise<Result<MergePreview, AdapterError>>;
  mergeThemes(input: {
    themeIds: [string, string];               // [survivor, merged-away] — the composer's explicit direction
    survivorLabel: { ar: string; en: string };
    confirm: { unionMembers: number };        // P04 level-2: UI names both counts + union; adapter verifies live
  }): Promise<Result<ThemeView, AdapterError>>;
  deleteTheme(input: {
    themeId: string;
    confirm: { memberCount: number };         // P04 level-2: members become unassigned — named, never silent
  }): Promise<Result<{ deletedThemeId: string }, AdapterError>>;

  // coding (the human layer)
  setResponseTheme(input: {
    responseId: string;
    themeId: string | null;                   // null = unassign (reversible both ways, evidence kind 'manual')
  }): Promise<Result<ResponseView, AdapterError>>;
  bulkSetResponseTheme(input: {
    questionId: string;
    filter: {
      langClass?: ('msa' | 'dialect-leaning' | 'mixed-script')[];
      tone?: ('positive' | 'negative' | 'neutral' | 'mixed')[];
      themeId?: string | 'unassigned';
      search?: string;                          // the same normalized search the reader declares
    };
    themeId: string;
    confirmCount: number;                     // UI must echo the counted set (P04/P07 — the adapter verifies)
  }): Promise<Result<BulkAssignResult, AdapterError>>;

  // quotes (deterministic selection + human pins — the honesty split)
  setQuotePin(input: {
    themeId: string;
    responseId: string;
    pinned: boolean;                          // true = pin (actor recorded); false = unpin (rule list restores)
  }): Promise<Result<ThemeView, AdapterError>>;

  // derived analysis reads
  getCoverageReport(query: { questionId: string; includeProposed: boolean }): Promise<Result<CoverageReport, AdapterError>>;
  getCrosstab(query: {
    questionId: string;
    columnKey: string;                        // a MetadataColumn.key of the project
    includeProposed: boolean;
  }): Promise<Result<Crosstab, AdapterError>>;

  // export & handoff
  exportAnalysis(input: {
    projectId: string;
    questionIds?: string[];                   // omitted = whole project
    formats: ('theme-report' | 'coded-dataset')[];
    includeProposed: boolean;                 // reports carry confirmed themes by default; proposals only on explicit request
    idempotencyKey: string;
  }): Promise<Result<Job<ExportJobResult>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: ('theme-report' | 'coded-dataset')[];
    themeSetVersion: number;
    newerPending: boolean;                    // analysis changed after export — flagged, never silently re-baked (07a)
  }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; projectId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  listActivity(query: {
    filter?: { actorMemberId?: string; action?: string[]; projectId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntry>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    modelAssistedRuns: number;                // the metered unit — floor runs are unlimited (00 pricing posture)
    exportPackages: number;
    resetAt: string;
  }, AdapterError>>;
}
```

## Rules

1. **Determinism contract**: `runClustering` (floor), detection, tone, quote selection, coverage, and crosstab implement exactly the rules of 07c — identical inputs yield identical outputs; every run result carries `mode` and `engine` provenance; the published `keywordTable` is part of the result (inspectability is data, not documentation only).
2. **Confirm gate**: only `confirmTheme(decision: 'confirm')` promotes a proposed theme; auto-apply and bulk-accept do not exist on the contract (00 LOOP-10). Confirming a dismissed proposal → CONFLICT showing current state; the gate view (`getConfirmGate`) re-evaluates membership live at open — the preview is truth, not a snapshot (03 CP-3 edge). Every confirm/reject records actor + timestamp (+ optional reject reason) in the activity log.
3. **Model-proposal containment**: `requestModelProposals: false` (or capability unconsented) → floor-only run, zero quota consumption; `true` without granted consent → PERMISSION naming the capability class in capability language (credential-contract §4). A proposal stream that fails mid-run completes the job as floor-only with `engine: 'keyword-floor'` and the typed error recorded on the job (partial-result policy, async-contract §4) — the wave is never blocked on a meter.
4. **Verbatim immutability**: no operation mutates `Response.text`; `setResponseLanguageOverride` writes `detection.override` with actor + optional reason (recorded), and the override renders alongside — never instead of — the rule's named markers.
5. **Stale-version semantics**: `saveTheme` (baseVersion), `mergeThemes` (live union count vs confirm), `bulkSetResponseTheme` (confirmCount vs live filtered set), and `setQuotePin` on a membership that changed → CONFLICT with both payloads / recounted set in `details`; never a partial silent apply.
6. **Viewer role**: every mutation (saveTheme, confirm, merge, delete, assign, bulk, pin, override, export, updateProject) → PERMISSION naming the seat's capability; reads, filters, crosstab, and artifact retrieval are the viewer's surface (02 Faisal).
7. **Idempotency**: import/clustering/export submits carry idempotency keys; a retried submit returns the original job (async-contract §5). Progress is determinate in units (rows, responses, formats) — an indeterminate bar claiming percentage is a contract violation (async-contract §3).
8. **Partial policies**: import delivers imported-so-far + named invalid rows; model-assisted runs degrade to floor-only on proposal-stream failure (rule 3); export delivers per-format partial with per-format retry.
9. **Overlap honesty at the contract level**: `shareOfAssigned` fields may sum past 1.0; `getCoverageReport`/`getCrosstab` carry the structural literals (`sharesMayExceedTotal`, `overlapFootnote`); surfaces that hide overlap are non-conforming by construction.
10. **Theme scoping**: themes are per-question at v1 — `saveTheme` with a questionId whose label collides (same normalized ar OR en label within the question) → VALIDATION naming the collision; `mergeThemes` across questions → VALIDATION naming both questions.
11. **Export honesty**: `exportAnalysis` with zero confirmed themes in scope (and `includeProposed: false`) → VALIDATION offering curation ("nothing confirmed to report"); artifacts pin `themeSetVersion` and flag `newerPending` — regeneration is deterministic and never re-bakes silently.
12. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (30/30).
