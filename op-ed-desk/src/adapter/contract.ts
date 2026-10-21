// VERBATIM from specs-source/op-ed-desk/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below. Implementation corrections applied: 3 (see portfolio SPEC_DEFECTS.md; specs-source untouched).
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };
export type ErrorCode = 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';
export interface AdapterError {
  code: ErrorCode; message: string; correlationId: string; retryable: boolean;
  details?: Record<string, string[]>;
}
export interface Session {
  memberId: string; deskId: string;
  role: 'editor' | 'reviewer';   // identity scoping: reviewers never resolve contributorId
  locale: 'ar' | 'en';
}
export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export interface SubmissionSummary {
  id: string; referenceCode: string; title: string; locale: 'ar' | 'en' | 'mixed';
  wordCount: number; status: 'received' | 'triage' | 'in-round' | 'decided';
  topicTags: string[]; createdAt: string; policyFlags: string[];
}
export interface LintReportSummary {
  reportId: string; submissionId: string; pass: 'deterministic' | 'full';
  findings: { policy: number; style: number; integrity: number };
  degraded: boolean; generatedAt: string;
}
export interface ReviewerRef { reviewerId: string; matchCategory: string; }  // category only, never identity

export interface OpEdDeskAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // intake (contributor surface; accountless)
  submitDraft(input: {
    title: string; body: string; locale: 'ar' | 'en' | 'mixed'; topicTags: string[];
    contributor: { displayName: string; contactEmail: string; organizations: string[] };
    disclosures: { affiliations: string[]; conflicts: string[]; exclusivityAttested: boolean };
    revisionOf?: { referenceCode: string };
  }): Promise<Result<{ referenceCode: string; submittedAt: string; wordCount: number; policyFlags: string[] }, AdapterError>>;

  getSubmissionStatus(referenceCode: string): Promise<Result<{
    status: 'received' | 'triage' | 'in-round' | 'decided'; lastChangeAt: string;
    decision?: { decision: 'accept' | 'revise' | 'reject';
      letter: { subject: string; body: string; locale: 'ar' | 'en' }; recordedAt: string };
  }, AdapterError>>;

  // desk queue & triage
  listSubmissions(query: {
    filter?: { status?: SubmissionSummary['status'][]; locale?: ('ar' | 'en' | 'mixed')[];
      topicTag?: string; slaState?: 'ok' | 'due-soon' | 'overdue'; revisionChainsOnly?: boolean };
    sort: 'createdAt' | 'wordCount'; cursor?: string; limit: number;
  }): Promise<Result<Page<SubmissionSummary>, AdapterError>>;

  getSubmission(id: string): Promise<Result<SubmissionSummary & {
    body: string;
    contributor: { contributorId: string; displayName: string; organizations: string[];
      submissionCount: number; priorDecisions: string[] };
    latestLint?: LintReportSummary;
    rounds: { roundId: string; roundNumber: number; state: string; slaDueAt: string }[];
    revisionChain: { id: string; title: string; decision?: string; createdAt: string }[];
  }, AdapterError>>;  // reviewer role → PERMISSION (full view is editor-scoped)

  updateTriage(id: string, action: { action: 'advance' | 'decline' | 'hold'; note?: string }): Promise<Result<SubmissionSummary, AdapterError>>;

  // anonymized review
  getAnonymizedView(submissionId: string): Promise<Result<{
    viewId: string; version: number; scrubbedBody: string; submissionTitle: string;
    residualLeakSuspects: { spanStart: number; spanEnd: number; rule: string }[];
  }, AdapterError>>;

  flagAnonymizationLeak(input: { submissionId: string; spanStart: number; spanEnd: number; note?: string }): Promise<Result<{ viewId: string; newVersion: number; pausedRoundId: string | null }, AdapterError>>;

  openReviewRound(input: { submissionId: string; reviewerIds: string[] }): Promise<Result<{
    roundId: string; roundNumber: number; state: 'open'; slaDueAt: string; coiWarnings: ReviewerRef[];
  }, AdapterError>>;

  reassignReviewer(input: { roundId: string; fromReviewerId: string; toReviewerId: string; reason: string }): Promise<Result<{ roundId: string; state: string; coiWarnings: ReviewerRef[] }, AdapterError>>;

  submitReview(input: { roundId: string; recommendation: 'publish' | 'publish-with-edits' | 'decline'; notes: string; integrityConfirmed: boolean }): Promise<Result<{
    roundId: string; roundState: 'open' | 'complete';
    aggregate?: { publish: number; publishWithEdits: number; decline: number };
  }, AdapterError>>;

  // decision
  recordDecision(input: {
    submissionId: string; decision: 'accept' | 'revise' | 'reject';
    letter: { subject: string; body: string; locale: 'ar' | 'en' };
    overrideOfRound?: { roundId: string; rationale: string };  // required on split rounds
  }): Promise<Result<{ decisionId: string; submissionStatus: 'decided'; sendState: 'unsent' }, AdapterError>>;

  sendDecision(decisionId: string): Promise<Result<{ decisionId: string; sendState: 'sent' | 'send-failed'; sentAt?: string; manualPathAvailable: true }, AdapterError>>;

  // style lint (conditionally-AI; deterministic core always available)
  runStyleLint(input: { submissionId: string; pass: 'deterministic' | 'full' }): Promise<Result<Job<{ reportId: string }>, AdapterError>>;

  getLintReport(reportId: string): Promise<Result<LintReportSummary & {
    findings: StyleLintFinding[];   // 07a shape incl. resolution state
    degradedCategories: string[];   // AI categories unavailable → listed, notice rendered
  }, AdapterError>>;

  updateFinding(findingId: string, resolution: { state: 'acknowledged' | 'dismissed' | 'fixed' }): Promise<Result<{ findingId: string; resolution: StyleLintFinding['resolution'] }, AdapterError>>;

  // contributor files (editor-only)
  listContributors(query: { search?: string; sort: 'lastActivity' | 'submissionCount'; cursor?: string; limit: number }): Promise<Result<Page<{ contributorId: string; displayName: string; submissionCount: number; lastActivityAt: string }>, AdapterError>>; // SPEC_DEFECTS B: Page<T> closed inside Result in spec
  getContributor(contributorId: string): Promise<Result<{ contributorId: string; displayName: string; organizations: string[]; history: { submissionId: string; title: string; decision?: string; createdAt: string }[] }, AdapterError>>;

  // jobs & usage
  listJobs(query: { filter?: { state?: Job['state'][]; kind?: Job['kind'][] }; cursor?: string; limit: number }): Promise<Result<Page<Job<{ reportId: string }>>, AdapterError>>; // SPEC_DEFECTS B: missing > in spec
  getUsage(): Promise<Result<{ window: string; fullPassRuns: number; deterministicRuns: number; resetAt: string }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export interface ContributorProfile {
  id: string; displayName: string; contactEmail: string;
  organizations: string[];                    // COI-matching input
  submissionCount: number;                    // derived
  priorDecisions: ('accept' | 'revise' | 'reject')[];  // derived
  firstSeenAt: string;
}
export interface Submission {
  id: string; referenceCode: string;          // contributor's only credential
  contributorId: string;                      // editor-visible join only (PERMISSION-scoped)
  revisionOf?: string;                        // prior submission in a revision chain
  title: string; body: string;                // immutable after submit
  locale: 'ar' | 'en' | 'mixed'; wordCount: number; topicTags: string[];
  disclosures: { affiliations: string[]; conflicts: string[]; exclusivityAttested: boolean };
  status: 'received' | 'triage' | 'in-round' | 'decided';
  triage?: { action: 'advance' | 'decline' | 'hold'; note?: string; editorId: string; at: string };
  createdAt: string;
}
export interface AnonymizedView {
  id: string; submissionId: string;
  version: number;                            // +1 on leak regeneration
  scrubbedBody: string;                       // deterministic scrubbing output
  residualLeakSuspects: { spanStart: number; spanEnd: number; rule: string }[];
  generatedAt: string;
}
export interface ReviewRound {
  id: string; submissionId: string; roundNumber: number;
  state: 'open' | 'paused-leak' | 'complete' | 'closed';
  reviewers: { reviewerId: string; assignedAt: string; recused?: boolean }[];
  reviews: { reviewerId: string; recommendation: 'publish' | 'publish-with-edits' | 'decline';
    notes: string; integrityConfirmed: boolean; submittedAt: string }[];
  slaDueAt: string;
}
export interface StyleLintFinding {
  id: string; reportId: string;
  ruleCode: string;                           // WORD_COUNT_MAX, NUMERAL_MIX, IDENTITY_LEAK, …
  category: 'policy' | 'style' | 'integrity';
  severity: 'notice' | 'warning' | 'blocker'; // blocker = integrity only
  spanStart: number; spanEnd: number;         // bidi-safe anchors into submission text
  message: string; source: 'deterministic' | 'ai-enhanced';
  resolution?: { state: 'acknowledged' | 'dismissed' | 'fixed'; by: string; at: string };
}
export interface DecisionRecord {
  id: string; submissionId: string;
  decision: 'accept' | 'revise' | 'reject';
  letter: { subject: string; body: string; locale: 'ar' | 'en' };
  overrideOfRound?: { roundId: string; rationale: string };  // required on split rounds
  editorId: string; recordedAt: string;
  sendState: 'unsent' | 'sent' | 'send-failed' | 'sent-manually';
  sentAt?: string;
}
export interface Job<T = unknown> { result?: T; partial?: T; error?: AdapterError; // SPEC_DEFECTS D: generic form used by adapter methods
  id: string; kind: 'lint-deterministic' | 'lint-full';
  state: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  progress: { determinate: boolean; done?: number; total?: number };  // rule categories
}

