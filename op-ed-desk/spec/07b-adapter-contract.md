# 07b — Adapter Contract: op-ed-desk (TypeScript, v1)

SME-G pass · `OpEdDeskAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. Types only. Entity shapes (Submission, ReviewRound, AnonymizedView, StyleLintFinding, ContributorProfile, DecisionRecord, Job): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
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
  listContributors(query: { search?: string; sort: 'lastActivity' | 'submissionCount'; cursor?: string; limit: number }): Promise<Result<Page<{ contributorId: string; displayName: string; submissionCount: number; lastActivityAt: string }, AdapterError>>>;
  getContributor(contributorId: string): Promise<Result<{ contributorId: string; displayName: string; organizations: string[]; history: { submissionId: string; title: string; decision?: string; createdAt: string }[] }, AdapterError>>;

  // jobs & usage
  listJobs(query: { filter?: { state?: Job['state'][]; kind?: Job['kind'][] }; cursor?: string; limit: number }): Promise<Result<Page<Job<{ reportId: string }>, AdapterError>>>;
  getUsage(): Promise<Result<{ window: string; fullPassRuns: number; deterministicRuns: number; resetAt: string }, AdapterError>>;
}
```

## Rules

1. **Identity scoping is adapter-enforced**: reviewer-role calls to getSubmission / listContributors / getContributor return PERMISSION; the blind path is getAnonymizedView. The UI never "hides" identity it can still fetch.
2. **Anonymization is a promise, not a filter**: flagAnonymizationLeak pauses the round and regenerates (version+1); reviews against a superseded version are retained and marked; submitReview with `integrityConfirmed: false` → VALIDATION.
3. **COI guard is editor-side**: warnings carry match CATEGORY only; a policy block is VALIDATION naming the category.
4. **Decisions before delivery**: recordDecision is atomic; sendDecision idempotent (double-send → same result); send failure returns `send-failed` + manual path — never a silent retry loop.
5. **Lint honesty**: full pass over quota → RATE_LIMIT; deterministic pass unaffected (ladder notice is the UI's job, ai-native-patterns §5); Jobs pace per rule category (async-contract §3); degraded reports list dropped categories.
6. **Triage is non-destructive**: decline archives, hold parks, advance opens rounds; updateTriage on an in-round submission → CONFLICT.
7. Typed pagination on all lists; cursors opaque; stale revision referenceCode → NOT_FOUND with no identity hint in copy. No orphan methods — 03 coverage table verified.
