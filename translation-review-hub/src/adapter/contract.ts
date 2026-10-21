// VERBATIM from specs-source/translation-review-hub/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (QaFinding,
// FindingResolution, LengthPolicy, SignOffRecord — and their fields) are
// declared canonically in 07a and are part of this contract by reference;
// 07b declares only the operational wrappers (summaries, views, jobs) its
// signatures need. This product is DECLARED NON-AI (ai-native-patterns §1):
// no operation invokes any AI capability, and the deterministic checks below
// are the whole of the QA engine.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed import rows, glossary/term field rules, length-policy sanity, sign-off gate attempts)
 * 'NOT_FOUND'    -> NotFoundError     (stale job/document/segment/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (capability consent, workspace scoping, viewer-role mutations)
 * 'CONFLICT'     -> ConflictError     (concurrent target edits, term-entry edits, finding resolutions)
 * 'RATE_LIMIT'   -> RateLimitError    (QA scan runs, export packages)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, export delivery)
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
  role: 'owner' | 'reviewer' | 'viewer';  // viewer: read + answer queries (source owner seat), no mutations
  locale: 'ar' | 'en';                    // chrome direction; content panes follow their own locales (05)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export type Locale = 'ar' | 'en';

export interface ReviewJobSummary {
  id: string;
  name: string;
  sourceLocale: Locale;
  targetLocale: Locale;
  glossaryId?: string;
  status: 'open' | 'signed' | 'reopened-pending';
  counts: {
    documents: number;
    segments: number;
    reviewed: number;
    openCriticalFindings: number;
    openAdvisoryFindings: number;
  };
  version: number;
  updatedAt: string;
}

export interface ReviewJobView extends ReviewJobSummary {
  lengthPolicy: LengthPolicy;
  gate: QaReport['gate'];                       // live sign-off gate state (03 CP-5.1)
  signOff?: SignOffRecord;
}

export interface SegmentPairRow {               // navigator rows (virtualized above 200 — P19)
  id: string;
  documentId: string;
  index: number;
  decisionState: 'unreviewed' | 'approved' | 'rejected' | 'queried';
  openFindings: { critical: number; advisory: number };
  hasLengthWarning: boolean;
  sourceStale: boolean;                          // decision predates a source edit (07a staleness)
  sourceExcerpt: string;                         // bidi-isolated at render (rtl-rules §2)
  targetExcerpt: string;
  charLimit?: number;
  targetLength: number;
}

export interface SegmentPairView {
  segment: SegmentPair;                          // 07a full shape
  findings: QaFinding[];                         // all kinds, segment-scoped (the rail's data)
  decisions: ReviewDecision[];                   // chain, newest first
  queryThread?: ReviewDecision['query'] & { segmentIndex: number };
  siblingLinks: { segmentIndex: number; documentId: string }[];   // consistency siblings (jump links)
}

export interface ImportJobResult {
  kind: 'document' | 'glossary';
  documentId?: string;
  glossaryId?: string;
  segmentPairs?: { imported: number; emptyTargets: number; duplicates: number };
  termEntries?: { imported: number; invalidRows: string[] };
  invalidBlocks?: string[];                      // named bad blocks — partial policy (async-contract §4)
}

export interface ScanJobResult {
  reviewJobId: string;
  documentIds: string[];
  findings: { term: number; length: number; consistency: number };
  mode: 'deterministic';                         // non-AI declaration made explicit in every result
}

export interface BulkDecisionResult {
  affectedSegmentIds: string[];
  decided: number;
  skipped: { segmentId: string; reason: 'open-critical-finding' | 'unreviewed-filter-mismatch' }[];
}

export interface GlossarySummary {
  id: string;
  name: string;
  sourceLocale: Locale;
  targetLocale: Locale;
  entryCount: number;                            // active entries
  version: number;
  updatedAt: string;
}

export interface Job<T> {                       // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'import' | 'scan' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                       // async-contract §5
  reviewJobId?: string;                         // link-to-context for the jobs console (04 S8)
  documentId?: string;
}

// ---- Contract ----

export interface TranslationReviewHubAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // review jobs
  createReviewJob(input: {
    name: string;
    sourceLocale: Locale;                        // either direction pair is first-class (en→ar AND ar→en)
    targetLocale: Locale;
    glossaryId?: string;
    lengthPolicy?: Partial<LengthPolicy>;        // workspace defaults otherwise (07a Workspace)
  }): Promise<Result<ReviewJobSummary, AdapterError>>;
  listReviewJobs(query: {
    filter?: { status?: ReviewJobSummary['status'][]; sourceLocale?: Locale[]; glossaryId?: string };
    search?: string;                             // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'createdAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ReviewJobSummary>, AdapterError>>;
  getReviewJob(id: string): Promise<Result<ReviewJobView, AdapterError>>;
  updateReviewJob(id: string, patch: {
    name?: string;
    lengthPolicy?: LengthPolicy;                 // edit re-versions the job and recomputes length warnings (03 CP-3.5)
    glossaryId?: string | null;                  // attaching later re-runs scans honestly
    baseVersion: number;                         // stale -> CONFLICT with both payloads
  }): Promise<Result<ReviewJobView, AdapterError>>;

  // document intake (paste/file-upload = the LOOP-5 always-available path; capability path consent-gated — 08 N1)
  importDocument(input: {
    reviewJobId: string;                         // kind 'document'
    kind: 'document';
    title: string;
    documentKind?: 'ui-strings' | 'long-form' | 'marketing' | 'legal' | 'other';
    source: 'paste' | 'file-upload' | 'intake-capability';
    content?: string;                            // paste payload: paired blocks w/ optional limit annotations
    capabilityRef?: string;                      // intake-capability path only; consent enforced server-side
    idempotencyKey: string;                      // async-contract §5
  }): Promise<Result<Job<ImportJobResult>, AdapterError>>;
  importGlossary(input: {
    glossaryId: string;                          // kind 'glossary' — termbase paste/import (03 CP-4.5)
    source: 'paste' | 'file-upload' | 'intake-capability';
    content?: string;                            // rows: source term, target term(s), severity, note
    idempotencyKey: string;
  }): Promise<Result<Job<ImportJobResult>, AdapterError>>;
  listDocuments(query: {
    reviewJobId: string;
    filter?: { kind?: string[]; lastScan?: boolean };
    sort: 'createdAt' | 'segmentCount' | 'title';
    cursor?: string; limit: number;
  }): Promise<Result<Page<DocumentSummary>, AdapterError>>;
  getDocument(id: string): Promise<Result<DocumentSummary & {
    decisionProgress: QaReport['decisionProgress'];
    openFindings: { critical: number; advisory: number };
  }, AdapterError>>;

  // segment review (the daily loop — 03 CP-2/CP-3)
  listSegmentPairs(query: {
    documentId: string;
    filter?: {
      decisionState?: SegmentPairRow['decisionState'][];
      hasOpenFindings?: boolean;
      severity?: ('critical' | 'advisory')[];
      sourceStale?: boolean;
    };
    search?: string;                             // normalized match inside source/target text
    sort: 'index' | 'updatedAt';
    cursor?: string; limit: number;              // virtualized surface: cursor pages ≤ 100
  }): Promise<Result<Page<SegmentPairRow>, AdapterError>>;
  getSegmentPair(id: string): Promise<Result<SegmentPairView, AdapterError>>;
  updateSegmentTarget(id: string, targetText: string, baseRevision: number): Promise<Result<SegmentPairView, AdapterError>>;
  // ^ findings recompute deterministically on the returned view; the ≤50ms live-recheck budget is 10's
  setSegmentDecision(id: string, input: {
    kind: 'approve' | 'reject' | 'query';
    comment?: string;                            // REQUIRED for 'reject' -> VALIDATION without it
    query?: { addresseeMemberId: string; question: string };
    baseDecisionId?: string;                     // supersedes that decision (chain — 07a)
  }): Promise<Result<SegmentPairView, AdapterError>>;
  bulkSetSegmentDecisions(input: {
    documentId: string;
    filter: SegmentPairRow['decisionState'][] | 'clean-unreviewed';   // 'clean-unreviewed' = unreviewed AND zero open findings
    decision: { kind: 'approve'; comment?: string };
    confirmCount: number;                        // UI must echo the counted set (P04/P07 — the adapter verifies)
  }): Promise<Result<BulkDecisionResult, AdapterError>>;

  // deterministic QA (non-AI: rules per 07c)
  runQaScan(input: {
    reviewJobId: string;
    documentIds?: string[];                      // omitted = all documents in the job
    idempotencyKey: string;
  }): Promise<Result<Job<ScanJobResult>, AdapterError>>;
  getQaReport(query: { reviewJobId: string; documentId?: string }): Promise<Result<QaReport, AdapterError>>;
  listQaFindings(query: {
    reviewJobId?: string;
    documentId?: string;
    segmentPairId?: string;                      // segment-scoped rail reads (03 CP-2.3)
    filter?: { kind?: ('term' | 'length' | 'consistency')[]; severity?: ('critical' | 'advisory')[]; state?: ('open' | 'resolved')[] };
    sort: 'severity' | 'computedAt' | 'segmentIndex';
    cursor?: string; limit: number;
  }): Promise<Result<Page<QaFinding>, AdapterError>>;
  resolveQaFinding(input: {
    findingId: string;
    resolution: FindingResolution;               // 07a union — reason REQUIRED for 'override' | 'acknowledge'
  }): Promise<Result<QaFinding, AdapterError>>;

  // glossaries & terminology assets
  listGlossaries(query: {
    filter?: { sourceLocale?: Locale[] };
    search?: string;
    sort: 'updatedAt' | 'name' | 'entryCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<GlossarySummary>, AdapterError>>;
  createGlossary(input: {
    name: string;
    sourceLocale: Locale;
    targetLocale: Locale;
  }): Promise<Result<GlossarySummary, AdapterError>>;
  getGlossary(id: string): Promise<Result<GlossarySummary & {
    severityCounts: { critical: number; advisory: number };
    enforcedByJobIds: string[];
  }, AdapterError>>;
  listTermEntries(query: {
    glossaryId: string;
    search?: string;                             // normalized bilingual term search; ruleset disclosed in-panel (05/09)
    filter?: { severity?: ('critical' | 'advisory')[]; status?: ('active' | 'deprecated')[]; mandate?: ('mandated' | 'forbidden')[] };
    sort: 'sourceTerm' | 'updatedAt' | 'severity';
    cursor?: string; limit: number;
  }): Promise<Result<Page<TermEntry>, AdapterError>>;
  saveTermEntry(input: {
    glossaryId: string;
    entry: Omit<TermEntry, 'version' | 'createdAt' | 'updatedAt'> & { id?: string };
    baseVersion?: number;                        // stale -> CONFLICT with both payloads
  }): Promise<Result<TermEntry, AdapterError>>;
  deleteTermEntry(input: {
    termEntryId: string;
    confirm: { openFindingCount: number };       // P04 level-2: UI names the entry + its open findings (03 CP-4.4)
  }): Promise<Result<{ deletedTermEntryId: string }, AdapterError>>;

  // sign-off & export (the governance gate — 03 CP-5)
  signOffReviewJob(input: {
    reviewJobId: string;
    acknowledgeBlockers: false;                   // literal type: the gate NEVER passes with blockers (07a state obligation)
  }): Promise<Result<SignOffRecord, AdapterError>>;
  exportReviewPackage(input: {
    reviewJobId: string;
    formats: ('bilingual-table' | 'qa-report' | 'termbase')[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: ('bilingual-table' | 'qa-report' | 'termbase')[];
  }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; reviewJobId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    qaScans: number;
    exportPackages: number;
    resetAt: string;
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction default (either direction is a full citizen — 05)
  lengthPolicyDefaults: LengthPolicy; // inherited by new review jobs; overridable per job (versioned)
}
export interface Glossary {
  id: string;
  workspaceId: string;
  name: string;
  sourceLocale: Locale;               // glossary direction must match the review job it enforces
  targetLocale: Locale;
  entryCount: number;                 // active entries
  version: number;                    // bumped on any term-entry change (audit chain)
  createdAt: string;
  updatedAt: string;
}
export type TermSeverity = 'critical' | 'advisory';   // category convention (01: Xbench-class critical vs advisory)
export type TermStatus = 'active' | 'deprecated';
export interface TermEntry {
  id: string;
  glossaryId: string;
  sourceTerm: string;                 // verbatim, in glossary sourceLocale; bidi-isolated at render
  targetTerms: string[];              // mandated renderings (≥1 when mandate = 'mandated')
  forbiddenTargets: string[];         // renderings that must NOT appear (pure blacklist entries may carry only these)
  mandate: 'mandated' | 'forbidden';
  severity: TermSeverity;             // critical blocks sign-off; advisory warns and is listed
  status: TermStatus;                 // deprecated = checks stop, history intact
  note?: string;                      // the reviewer-facing "why" (rendered in the chip detail)
  version: number;                    // findings carry the version they were computed against
  createdAt: string;
  updatedAt: string;
}

// ---- Review container ----
export interface LengthPolicy {
  proportionalBand: { min: number; max: number };  // target/source length ratio band for segments w/o declared limits
  charLimitCriticalAt: number;                    // ratio over declared limit that escalates to critical (default 1.10)
}
export interface ReviewJob {
  id: string;
  workspaceId: string;
  name: string;
  sourceLocale: Locale;               // either direction pair is first-class: en→ar AND ar→en
  targetLocale: Locale;
  glossaryId?: string;                // term checks off while unbound (honest state, 11)
  lengthPolicy: LengthPolicy;         // job-level; edits re-version the job and recompute warnings
  status: 'open' | 'signed' | 'reopened-pending';
  signOff?: SignOffRecord;            // present when status = 'signed' (immutable once written)
  counts: {                           // derived at read — never authoritative storage
    documents: number;
    segments: number;
    reviewed: number;
    openCriticalFindings: number;
    openAdvisoryFindings: number;
  };
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface SignOffRecord {
  id: string;
  reviewJobId: string;
  reviewJobVersion: number;           // the exact state that was signed
  actorMemberId: string;
  at: string;
  resolutionLedger: {                 // the audit artifact the export carries
    overrides: number;                // critical findings overridden WITH reasons
    falsePositives: number;
    acknowledgedOverflows: number;
    rejectedSegments: number;
  };
}

// ---- Documents & segments ----
export type DocumentKind = 'ui-strings' | 'long-form' | 'marketing' | 'legal' | 'other';
export type ImportSource = 'paste' | 'file-upload' | 'intake-capability';
export interface DocumentSummary {
  id: string;
  reviewJobId: string;
  title: string;
  kind: DocumentKind;
  segmentCount: number;
  importSource: ImportSource;
  lastScanAt?: string;
  createdAt: string;
  updatedAt: string;
}
export interface SegmentPair {
  id: string;
  documentId: string;
  index: number;                      // segment number — the shared referent (02 Sarah); Western numerals, physical order stable in both directions
  sourceText: string;                 // verbatim; pane renders at sourceLocale direction (pane-direction contract)
  targetText: string;                 // verbatim; pane renders at targetLocale direction
  charLimit?: number;                 // declared budget (UI strings); absence → proportional policy
  sourceRevision: number;             // late source edits re-open decisions (staleness honesty)
  targetRevision: number;             // CONFLICT base for updateSegmentTarget
  decisionState: 'unreviewed' | 'approved' | 'rejected' | 'queried';
  updatedAt: string;
}

// ---- Deterministic QA findings (one union, three kinds) ----
export type FindingState = 'open' | 'resolved';
export interface FindingResolution {
  action:
    | 'edit-resolved'                 // target edited; rule now passes (recomputed, never hand-set)
    | 'override'                      // critical finding overridden — reason REQUIRED
    | 'false-positive'                // matcher wrong; normalization note referenced
    | 'acknowledge'                   // length overflow accepted — reason REQUIRED
    | 'choose-canonical';             // consistency: sibling chosen as canonical
  reason?: string;                    // required for 'override' and 'acknowledge'
  actorMemberId: string;
  at: string;
  canonicalSegmentId?: string;        // for 'choose-canonical'
}
export interface QaFindingBase {
  id: string;
  reviewJobId: string;
  documentId: string;
  segmentPairId: string;
  kind: 'term' | 'length' | 'consistency';
  state: FindingState;
  resolution?: FindingResolution;     // present iff state = 'resolved'
  computedAt: string;                 // scan/segment-recompute stamp
}
export interface TermViolation extends QaFindingBase {
  kind: 'term';
  termEntryId: string;
  termVersion: number;                // pin: the entry version this was computed against (audit honesty)
  detail: 'missing-mandated' | 'forbidden-present' | 'preferred-variant';
  severity: TermSeverity;             // mirrors the term entry at computation time
  match?: {                           // present when the target contains a non-preferred/forbidden rendering
    matchedText: string;
    start: number;                    // offsets into targetText
    end: number;
    matcher: 'exact' | 'normalized';  // normalized = rtl-rules §4 ruleset disclosed in-product
  };
  mandatedText?: string;              // the fix, one glance away (chip + rail)
}
export interface LengthFitWarning extends QaFindingBase {
  kind: 'length';
  severity: 'advisory' | 'critical';  // critical iff ratio > charLimitCriticalAt on a declared limit (07c rules)
  policy: { type: 'char-limit'; limit: number } | { type: 'proportional'; band: { min: number; max: number } };
  measured: {
    targetLength: number;             // character count, Western numerals at display
    ratio: number;                    // targetLength/limit, or targetLength/sourceLength for proportional
  };
}
export interface ConsistencyFinding extends QaFindingBase {
  kind: 'consistency';
  severity: 'advisory';               // consistency findings advise; humans choose the canonical rendering
  variant: 'source-same-target-differs' | 'target-term-differs-source';
  siblingSegmentIds: string[];        // jump links in the rail/console (03 CP-2.8)
  exemplarTexts: { segmentIndex: number; targetText: string }[];   // the differing renderings, verbatim
}
export type QaFinding = TermViolation | LengthFitWarning | ConsistencyFinding;

// ---- Decisions (the human layer) ----
export interface ReviewDecision {
  id: string;
  segmentPairId: string;
  actorMemberId: string;
  kind: 'approve' | 'reject' | 'query';
  comment?: string;                   // required for 'reject'; free-form for others
  query?: {
    addresseeMemberId: string;        // the source-content owner (02 Sarah)
    question: string;
    answer?: string;                  // appended history — never silently re-opens a standing decision
    answeredAt?: string;
  };
  supersededByDecisionId?: string;    // decision history is a chain, never overwritten
  at: string;
}

// ---- QA report (aggregate, derived) ----
export interface QaReport {
  reviewJobId: string;
  documentId?: string;                // omitted = whole-job aggregate
  findings: {
    term: { open: { critical: number; advisory: number }; resolved: { critical: number; advisory: number } };
    length: { open: { critical: number; advisory: number }; resolved: { critical: number; advisory: number } };
    consistency: { open: number; resolved: number };
  };
  decisionProgress: { unreviewed: number; approved: number; rejected: number; queried: number };
  missingTranslations: number;        // empty targets — sign-off blockers (category check, 01 q2)
  gate: {
    blocked: boolean;
    blockers: { findingId?: string; segmentPairId?: string; kind: 'critical-finding' | 'unreviewed-segment' | 'missing-translation' }[];
  };
  generatedAt: string;
}

// ---- Async jobs, exports, activity ----
export type JobKind = 'import' | 'scan' | 'export';
export type ExportFormat = 'bilingual-table' | 'qa-report' | 'termbase';
export interface ExportArtifact {
  id: string;
  reviewJobId: string;
  formats: ExportFormat[];            // the package's parts; per-format retry on partial failure
  signedReviewJobVersion?: number;    // carries the signed state; flags newer pending state at handoff (03 CP-5 edge)
  expiresAt: string;                  // declared retention window at creation
  regenerable: boolean;               // deterministic from review state — always true in v1
}
export interface ActivityEntry {      // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'job-created' | 'document-imported' | 'scan-run'
    | 'segment-decided' | 'bulk-decided' | 'target-edited'
    | 'finding-resolved' | 'term-saved' | 'term-deprecated' | 'term-deleted'
    | 'glossary-created' | 'signed-off' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                    // e.g. override reason, scan finding counts — provenance audit
  at: string;
}

