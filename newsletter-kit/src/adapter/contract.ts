// VERBATIM from specs-source/newsletter-kit/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type NumeralPolicy = 'western'; // ledger binding; display-only, storage canonical

// ——— Issue composition ———
export type IssueStatus = 'draft' | 'scheduled' | 'sent';
export interface Issue {
  id: string; workspaceId: string;
  internalTitle: string; issueNumber: number | null;
  locales: Locale[];                      // composed locales (CP-1)
  status: IssueStatus;
  revision: number;                       // conflict base (P10 / CP-1.4)
  duplicatedFrom: { issueId: string; fromLocale: Locale; toLocale: Locale } | null;
  content: Record<Locale, LocaleContent>;
  scheduledSendJobId: string | null;      // set by scheduleSend (CP-5.3)
  sentAt: string | null;                  // send completion locks content (CP-5 recovery)
  createdAt: string; updatedAt: string;
}
export interface LocaleContent {
  locale: Locale;
  subjectVariants: SubjectVariant[];      // per-locale variant set (CP-2)
  preheader: string | null;
  blocks: IssueBlock[];                   // ordered
}
export interface SubjectVariant {
  id: string; locale: Locale;
  text: string;                           // bidi isolation applied on input (rtl-rules §2)
  characterCount: number;                 // budgets EN warn>43/fail>70, AR warn>55/fail>80 (heuristic, disclosed)
  primary: boolean;                       // at most one per locale (CP-2.2)
  source: 'manual' | 'assist' | 'imported';
  assistProposal?: { jobId: string; partial: boolean }; // P15 draft marker
}
export interface IssueBlock {
  id: string; locale: Locale;
  pairKey: string;                        // alignment link across locales (P23; preserved by duplicateIssue)
  type: 'heading' | 'paragraph' | 'quote' | 'linkList' | 'image' | 'divider' | 'cta' | 'signature';
  fields: Record<string, string>;         // per-type text/URL/alt; direction derives from locale
  style: { italic: boolean };             // C07 guard: italic renders only for 'en'
}

// ——— QA (deterministic catalog — never AI) ———
export type QaCheckId =
  | 'C01-direction-containers' | 'C02-subject-bidi-isolation' | 'C03-subject-length'
  | 'C04-preheader' | 'C05-numeral-consistency' | 'C06-arabic-line-height'
  | 'C07-italic-on-arabic' | 'C08-font-fallback-stack' | 'C09-cta-alignment' | 'C10-consent-footer';
export interface QACheckResult {
  id: string; issueId: string; issueRevision: number; locale: Locale | 'both';
  checkId: QaCheckId;
  status: 'pass' | 'warn' | 'fail' | 'not-applicable';
  detail: string;                         // written copy per 11
  blockId: string | null;                 // fix-path deep link (CP-3.3)
  checkedAt: string;
}
export interface QaRunSummary {
  issueId: string; issueRevision: number; runJobId: string;
  fails: number; warns: number; passes: number; notApplicable: number;
  sendGate: 'blocked' | 'warned' | 'clear'; // CP-3.5
}

// ——— Subscribers & consent ———
export interface SubscriberList {
  id: string; workspaceId: string; name: string; description: string | null;
  localeMix: { ar: number; en: number; unspecified: number };  // derived
  unconsentedCount: number;               // derived; send-gate input (CP-4.6)
  sourceLabels: string[];                 // import provenance
  createdAt: string; updatedAt: string;
}
export interface Subscriber {
  id: string; listId: string;
  email: string; displayName: string | null;
  localePreference: Locale | 'unspecified'; // explicit; never silently defaulted (CP-4.2)
  consent: { scope: 'broadcast'; proof: string; date: string } | null; // null = unconsented (CP-4.3)
  status: 'active' | 'removed';
  sourceImportJobId: string | null;
  addedAt: string;
}
export interface ImportRowIssue { rowIndex: number; kind: 'invalid-email' | 'duplicate' | 'consent-missing' | 'locale-missing'; value: string; }

// ——— Delivery (abstract channel — LOOP-10/LOOP-5) ———
export type ChannelStatus = 'unverified' | 'active' | 'expiring-soon' | 'expired' | 'failed' | 'revoked'; // credential-contract §3
export interface DeliveryChannelBinding {
  id: string; workspaceId: string;
  kind: 'email-delivery';                 // capability language, never vendor (credential-contract §2)
  label: string; hint: string;            // masked identifier fragment; secret never shown
  status: ChannelStatus;
  grantedOperations: ('issue-send')[];    // grant display (credential-contract §4)
  verifiedAt: string | null;
}
export type SendLocalePolicy = 'preference' | 'combined' | 'single-edition'; // CP-5.2

// ——— Jobs (async-contract §2; five kinds) ———
export type JobKind = 'qa-run' | 'subject-assist' | 'import' | 'export' | 'send';
export type JobState = 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
export interface Job<K extends JobKind, TResult> {   // K narrows kind per call-site (07b); Job<JobKind, unknown> is the any-job view
  id: string; kind: K; state: JobState;
  issueId: string | null; listId: string | null;
  progress: { determinate: boolean; done: number | null; total: number | null };
  partial: TResult | null;                // streamed/interim (assist proposals, import stats, per-locale counts)
  result: TResult | null;
  error: { code: string; message: string; correlationId: string } | null;
  note: string | null;                    // "record why sending anyway" (CP-3.5) on send jobs
  createdAt: string; updatedAt: string;
}
export interface SendOutcome {
  perLocale: { locale: Locale; sent: number; total: number }[];
  renderedEditions: { locale: Locale; artifactId: string }[]; // linked deliverables (async-contract §2)
}
export interface SendJob extends Job<'send', SendOutcome> {
  channelId: string; scheduledAt: string; localePolicy: SendLocalePolicy;
  listSnapshot: { listId: string; counts: { ar: number; en: number; unspecified: number }; takenAt: string }; // CP-5 edge
}
export interface ExportArtifact {
  id: string; exportJobId: string; issueId: string;
  format: 'html' | 'text' | 'subscriber-csv'; locale: Locale | 'n/a';
  expiresAt: string; regenerable: true;   // async-contract §2 expired + renewal
}
export interface UsageWindow { window: string; assistGenerations: number; assistGenerationsLimit: number; resetAt: string; } // P14 — assist only
export interface ActivityEntry { id: string; workspaceId: string; actorId: string; action: string; targetRef: string; timestamp: string; } // P17

