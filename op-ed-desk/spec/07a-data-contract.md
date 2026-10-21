# 07a — Data Contract: op-ed-desk

SME-G pass · Backend-agnostic. AI declaration: **conditionally-AI** — deterministic lint rules are core; a "full pass" adds AI-backed categories via the abstract text-analysis capability (08) and degrades to the deterministic set when unavailable (ai-native-patterns §8). Types only. Canonical storage: Gregorian ISO dates, Western numerals; direction/numerals are display formatting.

```ts
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

export interface Job {
  id: string; kind: 'lint-deterministic' | 'lint-full';
  state: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  progress: { determinate: boolean; done?: number; total?: number };  // rule categories
}
```

## Relationships

Desk 1—N ContributorProfile/Submission; Submission 1—N ReviewRound; Submission 1—N AnonymizedView (latest serves rounds); Submission 1—N lint reports → findings; Submission 1—N DecisionRecord; revisionOf chains submissions; Job 1—1 report on success.

## State obligations

- Submissions immutable after submit — revisions are new linked submissions (accountability spine).
- Contributor identity is a permission-scoped join: reviewer-role requests never resolve `contributorId` (07b PERMISSION); the blind workspace reads AnonymizedView, never Submission.body.
- Leak regeneration bumps view version; `paused-leak` rounds resume only on the new version; leak flags are anonymous within the round.
- Lint reports pin immutable text — staleness is structural; resolutions persist per report.
- `sendState` is honest: failed sends never mark sent; `sent-manually` records the LOOP-5 path with actor/timestamp.
- Every consequential mutation appends an ActivityEntry (P17).
