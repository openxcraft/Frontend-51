# 07b — Adapter Contract: translation-review-hub (TypeScript, v1)

SME-G pass · `TranslationReviewHubAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, Glossary, TermEntry, ReviewJob, SignOffRecord, Document, SegmentPair, QaFinding/TermViolation/LengthFitWarning/ConsistencyFinding, ReviewDecision, QaReport, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table — 29 operations, 0 orphans).

```ts
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
```

## Rules

1. **Determinism contract**: `runQaScan` and the per-segment recompute inside `updateSegmentTarget` implement exactly the rules specified in 07c — identical inputs (segment state, glossary term versions, length policy) yield identical findings. Every scan result carries `mode: 'deterministic'`. No finding is ever created or closed by hand: `edit-resolved` transitions are recomputed by the rule; all other resolutions record actor (+ reason where required) per 07a.
2. **Sign-off gate**: `signOffReviewJob` with any open critical finding, missing translation, or unreviewed segment → VALIDATION whose `details` name every blocker (`blockers` from the live QaReport). The `acknowledgeBlockers: false` literal makes the gate semantics impossible to accidentally bypass at the type level. Successful sign-off writes an immutable SignOffRecord; later mutations set the job to `reopened-pending` and never rewrite the record.
3. **Stale-version semantics**: `updateReviewJob` (baseVersion), `updateSegmentTarget` (baseRevision), `saveTermEntry` (baseVersion), and `resolveQaFinding` (finding already resolved by another seat) → CONFLICT with both payloads in `details`. Bulk decisions verify `confirmCount` against the live filtered set; drift → CONFLICT with the recounted set (never a partial silent apply).
4. **Viewer role**: mutation operations (updateSegmentTarget, setSegmentDecision except answering an addressed query, bulk, resolve, save/delete term, signOff, export, updateReviewJob) → PERMISSION naming the seat's capability in capability language; query-answer is the viewer's one write path (02 Sarah).
5. **Consent enforcement**: import with `source: 'intake-capability'` (document or glossary) without a granted content-intake consent → PERMISSION naming the capability class (credential-contract §4) — never a vendor. The paste path has no consent requirement, ever (LOOP-5).
6. **Idempotency**: import/scan/export submits carry idempotency keys; a retried submit returns the original job (async-contract §5). Progress is determinate in units (rows, segment pairs, formats) — an indeterminate bar claiming percentage is a contract violation (async-contract §3).
7. **Partial policies**: import delivers imported-so-far + named invalid blocks; scan is per-segment re-runnable (no atomicity requirement — determinism makes re-runs safe); export delivers per-format partial with per-format retry (async-contract §4).
8. **Recompute honesty**: term-entry edits do not mutate existing findings (they pin `termVersion`); length-policy edits re-version the job and recompute warnings, surfaced as a stated side-effect (03 CP-3.5), never silent. `updateSegmentTarget` returns the recomputed view — the UI must render it, not assume.
9. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (29/29).
