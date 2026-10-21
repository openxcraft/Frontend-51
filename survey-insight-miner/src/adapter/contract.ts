// VERBATIM from specs-source/survey-insight-miner/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type BilingualLabel = { ar: string; en: string };   // every theme is named in both scripts from creation (00)

// ---- Workspace & projects ----
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction default (either direction is a full citizen — 05)
}
export type MetadataColumnType = 'text' | 'enum' | 'number';
export interface MetadataColumn {      // the segments the team already thinks in (city, channel, plan, satisfaction)
  id: string;
  key: string;                         // stable slug used in imports
  label: BilingualLabel;
  type: MetadataColumnType;
  distinctValueLimit: number;          // crosstab collapses to top 19 + "other" beyond this (declared: 20)
}
export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  note?: string;
  metadataColumns: MetadataColumn[];
  sample: boolean;                     // seeded sample project (P22); clearable, never returns once cleared
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Questions & responses ----
export type LanguageClass = 'msa' | 'dialect-leaning' | 'mixed-script' | 'empty';
export interface LanguageDetection {
  langClass: LanguageClass;
  markers: string[];                   // the rule's evidence, named (e.g. ['اللي', 'بس']); empty for 'msa'/'empty'
  ruleVersion: number;                 // detection rule version at computation (07c rule 2)
  override?: {                         // human disagreement is recorded, never silent (03 CP-2.5)
    langClass: LanguageClass;
    reason?: string;
    actorMemberId: string;
    at: string;
  };
}
export type ToneClass = 'positive' | 'negative' | 'neutral' | 'mixed';
export interface ToneSignal {
  tone: ToneClass;
  lexiconHits: { positive: string[]; negative: string[] };   // verbatim matched terms — the evidence
  heuristic: true;                     // ALWAYS labeled heuristic in-product (01 q8 evidence posture)
  ruleVersion: number;
}
export interface Response {
  id: string;
  questionId: string;
  respondentRef: string;               // pseudonymous verbatim from the import; never enriched (09)
  text: string;                        // verbatim; NEVER normalized — detection/tone are views, text is data (07c rule 1)
  metadata: Record<string, string>;    // keyed by MetadataColumn.key; blanks allowed ("unspecified" bucket)
  detection: LanguageDetection;
  tone: ToneSignal;
  importBatchId: string;
  createdAt: string;
  updatedAt: string;
}
export interface Question {
  id: string;
  projectId: string;
  prompt: BilingualLabel;              // the question as asked (imported; editable by saveTheme-free path? no — immutable post-import, 07b)
  responseCount: number;               // derived at read
  languageMix: Record<LanguageClass, number>;   // derived at read — counts, never charts alone (09)
  toneMix: Record<ToneClass, number>;
  lastRunId?: string;
  createdAt: string;
}

// ---- Themes, memberships, quotes ----
export type ThemeProvenance = 'keyword-grouping' | 'model-proposed' | 'human-confirmed';
export type ThemeState = 'proposed' | 'confirmed' | 'merged-away' | 'deleted';
export interface Theme {
  id: string;
  questionId: string;                  // themes are per-question at v1 (12 Q-11)
  label: BilingualLabel;               // the craft act — named in both scripts (02 Dana)
  definition?: BilingualLabel;         // one line per language; the report's credibility layer
  keywords: string[];                  // the floor's anchor keywords (verbatim, normalized-matched — 07c rule 3)
  provenance: ThemeProvenance;
  state: ThemeState;
  confidenceBand?: 'high' | 'medium' | 'low';   // model-proposed only; disclosed on the card
  memberCount: number;                 // derived at read
  shareOfAssigned: number;             // derived; shares may sum past 100% — overlap honesty (07c rule 7)
  mergedIntoThemeId?: string;          // present when state = 'merged-away'
  version: number;                     // bumps on label/definition/keyword edits (audit chain)
  createdAt: string;
  updatedAt: string;
}
export interface ThemeMembership {
  id: string;
  themeId: string;
  responseId: string;
  evidence:
    | { kind: 'keyword'; matchedKeywords: string[] }          // the floor: which top-K keywords matched
    | { kind: 'model'; confidenceBand: 'high' | 'medium' | 'low' }
    | { kind: 'manual'; actorMemberId: string };              // human coding — the analyst's act (03 CP-3.5)
  assignedAt: string;
}
export interface ThemeQuote {
  id: string;
  themeId: string;
  responseId: string;
  selection:
    | { kind: 'rule'; rank: number; rationale: string }        // deterministic rule, rationale rendered (07c rule 6)
    | { kind: 'pinned'; actorMemberId: string; at: string };   // human override — pins sit above rule quotes (03 CP-3.8)
}

// ---- Derived reads (never authoritative storage) ----
export interface CoverageReport {
  questionId: string;
  responses: number;
  assigned: number;                    // responses in ≥1 confirmed or proposed theme
  unassigned: number;                  // the honest tail — stays visible (00)
  inMultipleThemes: number;            // overlap, counted not flattened
  emptyResponses: number;              // imported blank — excluded from clustering, counted here
  sharesMayExceedTotal: true;          // literal: the honesty line is structural, rendered in-surface (04 S6)
  generatedAt: string;
}
export interface CrosstabCell {
  themeId: string;
  columnKey: string;
  columnValue: string;                 // includes 'unspecified' and 'other' buckets
  count: number;
  shareWithinColumn: number;           // count / column total (responses — overlap counts in each theme row)
}
export interface Crosstab {
  questionId: string;
  columnKey: string;
  collapsedToTopValues: boolean;       // true when distinct values > 20 → top 19 + 'other'
  cells: CrosstabCell[];
  overlapFootnote: true;               // literal: rendered in-surface (06 CrosstabGrid)
  generatedAt: string;
}

// ---- The clustering run (deterministic floor + optional model proposals) ----
export interface ClusterRunParams {
  topK: number;                        // default 12 — top-K keywords become floor themes
  minGroupSize: number;                // groups below this member count stay in the keyword table, unthemed; default 5
  stopwords: 'default' | 'custom';     // the default list is disclosed in-product (07c rule 4)
}
export interface ClusterRunResult {
  questionId: string;
  engine: 'keyword-floor' | 'keyword-floor+model-proposals';
  keywordTable: { keyword: string; count: number }[];      // the floor's published intermediate (inspectability)
  groups: { themeId: string; label: string; members: number }[];   // floor groups landed as 'keyword-grouping' themes
  proposals?: { themeId: string; confidenceBand: 'high' | 'medium' | 'low'; members: number }[];
  coverage: CoverageReport;
  mode: 'deterministic-floor' | 'model-assisted-proposals'; // provenance made explicit in every result (ai-native-patterns §1)
}

// ---- Async jobs, exports, activity ----
export type JobKind = 'import' | 'clustering' | 'export';
export type ExportFormat = 'theme-report' | 'coded-dataset';
export interface ExportArtifact {
  id: string;
  projectId: string;
  questionId?: string;                 // omitted = whole-project package
  formats: ExportFormat[];
  themeSetVersion: number;             // pins the state the artifact came from; flags newer-pending (03 CP-5 edge)
  expiresAt: string;                   // declared retention window at creation (7 days)
  regenerable: boolean;                // deterministic from analysis state — always true in v1
}
export interface ActivityEntry {       // P17 — the methodology defense as a data surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'project-created' | 'responses-imported' | 'run-executed'
    | 'theme-created' | 'theme-renamed' | 'theme-confirmed' | 'theme-proposal-rejected'
    | 'themes-merged' | 'theme-deleted'
    | 'response-assigned' | 'response-unassigned' | 'bulk-assigned'
    | 'quote-pinned' | 'quote-unpinned'
    | 'language-override-set' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                     // e.g. merge counts, override reason, confirm confidence — provenance audit
  at: string;
}

