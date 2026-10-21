# 07b — Adapter Contract: newsletter-kit (TypeScript, v1)

SME-G pass · LOOP-15 satisfied: full taxonomy, typed pagination, auth-agnostic session. Types only. Entity types referenced from 07a (single contract surface).

```ts
// Shared entity types are declared ONCE in 07a-data-contract.md and referenced here
// by name (single contract surface): Issue, SubjectVariant, IssueBlock, QACheckResult,
// QaRunSummary, SubscriberList, Subscriber, ImportRowIssue, DeliveryChannelBinding,
// SendLocalePolicy, Job, JobKind, JobState, SendJob, SendOutcome, ExportArtifact,
// UsageWindow, Locale.

// ——— Result & error taxonomy (EXACTLY seven classes) ———
export type ErrorCode = 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT' | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';
export interface AdapterError {
  code: ErrorCode;
  message: string;                    // copy-voice §1.4: [what]+[why]+[next]
  correlationId: string;              // surfaces as ref in UNKNOWN copy
  retryable: boolean;                 // NETWORK/UNKNOWN default true; others false unless declared
  details?: Record<string, string[]>; // field-scoped reasons (e.g. subject over budget, unconsented count)
}
export type Result<T> = { ok: true; data: T } | { ok: false; error: AdapterError };

// ——— Session (auth-agnostic; binding at implementation) ———
export interface Session { memberId: string; workspaceId: string; role: 'owner' | 'editor'; locale: Locale; }

// ——— Typed pagination (cursor; no offsets) ———
export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ——— Query shapes ———
export interface IssueListQuery { filter?: { status?: Issue['status'][]; locales?: Locale[] }; sort: 'updatedAt' | 'title'; search?: string; cursor?: string; limit: number; }
export interface QaResultQuery { issueId: string; runJobId?: string; filter?: { status?: QACheckResult['status'][]; locale?: (Locale | 'both')[] }; cursor?: string; limit: number; }
export interface SubscriberListQuery { sort: 'updatedAt' | 'name'; search?: string; cursor?: string; limit: number; }
export interface SubscriberQuery { listId: string; filter?: { localePreference?: (Locale | 'unspecified')[]; status?: Subscriber['status'][] }; search?: string; cursor?: string; limit: number; }
export interface JobListQuery { filter?: { kind?: JobKind[]; state?: JobState[] }; cursor?: string; limit: number; }

// ——— Operation payloads ———
export interface CreateIssueInput { internalTitle: string; locales: Locale[]; }
export interface IssueContentPatch {
  locale: Locale;
  subjectVariants?: { upsert: SubjectVariant[]; deleteIds: string[] }; // primary uniqueness per locale
  preheader?: string | null;
  blocks?: IssueBlock[];             // full ordered set for the locale (autosave payload)
}
export type DuplicateIssueMode = { fromLocale: Locale; toLocale: Locale } | { full: true };
export interface SuggestVariantsInput { count: number; tone?: string; } // proposals derive from the issue heading block
export interface ImportInput {
  sourceLabel: string;               // provenance + idempotency key part
  csvText: string;                   // paste path always available (LOOP-5); bound sources resolve to this shape
  columnMap: { email: number; displayName?: number; localePreference?: number; consentProof?: number; consentDate?: number };
  contentHash: string;               // idempotency: same (list, sourceLabel, hash) returns the original job
}
export type ImportResolution =
  | { rowIndex: number; decision: 'skip' }
  | { rowIndex: number; decision: 'keep-existing' }
  | { rowIndex: number; decision: 'replace' }
  | { rowIndex: number; decision: 'provide'; localePreference?: Locale; consentProof?: string; consentDate?: string };
export interface ScheduleSendInput {
  listId: string; channelId: string; scheduledAt: string; localePolicy: SendLocalePolicy;
  sendAnywayNote?: string;           // CP-3.5 — warns only; fails still block
}
export interface ExportOptions { formats: ('html' | 'text')[]; locales: Locale[]; includeSubscriberCsv: boolean; csvSegmentPolicy: SendLocalePolicy; }

// ——— The contract ———
export interface NewsletterKitAdapterV1 {
  // Session
  getSession(): Promise<Result<Session>>;

  // Issues (CP-1)
  listIssues(query: IssueListQuery): Promise<Result<Page<Issue>>>;
  getIssue(id: string): Promise<Result<Issue>>;
  createIssue(input: CreateIssueInput): Promise<Result<Issue>>;
  updateIssueContent(id: string, patch: IssueContentPatch, baseRevision: number): Promise<Result<Issue>>;
  duplicateIssue(id: string, mode: DuplicateIssueMode): Promise<Result<Issue>>;

  // QA (CP-3)
  runQaChecklist(issueId: string, locales?: Locale[]): Promise<Result<Job<'qa-run', QaRunSummary>>>;
  listQaResults(query: QaResultQuery): Promise<Result<Page<QACheckResult>>>;

  // Subject variant assist (CP-2; the ONLY conditionally-AI operation)
  suggestSubjectVariants(issueId: string, locale: Locale, input: SuggestVariantsInput): Promise<Result<Job<'subject-assist', { variants: SubjectVariant[] }>>>;

  // Subscribers & import (CP-4)
  listSubscriberLists(query: SubscriberListQuery): Promise<Result<Page<SubscriberList>>>;
  createSubscriberList(input: { name: string; description?: string }): Promise<Result<SubscriberList>>;
  listSubscribers(query: SubscriberQuery): Promise<Result<Page<Subscriber>>>;
  updateSubscriber(id: string, patch: { localePreference?: Locale | 'unspecified'; displayName?: string | null }): Promise<Result<Subscriber>>;
  removeSubscribers(ids: string[]): Promise<Result<{ removed: number }>>; // bulk irreversible — UI applies P04 L3 first
  importSubscribers(listId: string, input: ImportInput): Promise<Result<Job<'import', { imported: number; skipped: number; awaiting: ImportRowIssue[] }>>>;
  resolveImportRows(jobId: string, resolutions: ImportResolution[]): Promise<Result<Job<'import', { imported: number; skipped: number; awaiting: ImportRowIssue[] }>>>;

  // Delivery channels — abstract capability presentation (CP-5; credential-contract)
  listDeliveryChannels(): Promise<Result<DeliveryChannelBinding[]>>;
  verifyDeliveryChannel(channelId: string): Promise<Result<DeliveryChannelBinding>>; // real round-trip; typed failure inline

  // Send (CP-5)
  scheduleSend(issueId: string, input: ScheduleSendInput): Promise<Result<SendJob>>;

  // Jobs (async-contract §7 consolidated surface)
  getJob(id: string): Promise<Result<Job<JobKind, unknown>>>;
  listJobs(query: JobListQuery): Promise<Result<Page<Job<JobKind, unknown>>>>;
  cancelJob(id: string): Promise<Result<Job<JobKind, unknown>>>;  // real, fast (async-contract §5)
  retryJob(id: string): Promise<Result<Job<JobKind, unknown>>>;   // scoped: failed import rows / unsent send batch only

  // Export — manual alternative path (CP-5.5; LOOP-5)
  exportIssue(issueId: string, options: ExportOptions): Promise<Result<Job<'export', { artifacts: ExportArtifact[] }>>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string }>>;

  // Usage (P14 — assist generations only)
  getUsage(): Promise<Result<UsageWindow>>;
}
```

## Rules

1. **Send gate is adapter-enforced** (CP-3.5/CP-5.3): `scheduleSend` returns VALIDATION when the latest QA run has any fail (details list checkIds), the channel is not `active`, the list has unconsented rows > 0 (details carry the count), or `single-edition` is requested for a two-locale issue. Warns never block; `sendAnywayNote` is recorded on the job.
2. **Double-schedule CONFLICT**: an issue with a non-terminal (queued/running/awaiting-input) send job returns CONFLICT with both job references.
3. **Stale revision CONFLICT**: `updateIssueContent` with diverged `baseRevision` returns CONFLICT carrying both revisions — never silent overwrite (P10). Sent issues reject content updates with VALIDATION (locked — duplicate to continue).
4. **Assist contract**: jobs stream proposals via `partial` (P13/P15); mid-stream failure keeps partial proposals marked `partial: true` with retry-continuation or discard (ai-native-patterns §2). Quota exhaustion → RATE_LIMIT with window reset; rungs 2–3 surface through `getUsage` before refusal (P14 warn-at-80%).
5. **Import idempotency**: identical `(listId, sourceLabel, contentHash)` returns the original job — no duplicate rows (async-contract §5). Ambiguous rows pause in `awaiting-input`; `resolveImportRows` resumes; skipped rows listed with reasons, never silently dropped (§4 partial results).
6. **Channel verification** exercises a real capability round-trip (credential-contract §7 — no fake success); a `failed` result degrades the send desk per 08's map; the export path never depends on channel state.
7. **Errors map to the exact seven classes** — no eighth kind, no stringly codes. NETWORK (job/stream drops, mid-run send failure) is retryable via scoped `retryJob`; UNKNOWN carries `correlationId` into UI copy; the other five are deterministic user-action errors whose copy matrix lives in 11.
8. **No orphan methods**: every operation traces to ≥1 flow step in 03's coverage table, and every flow-step data need traces back here (Critic pass).
