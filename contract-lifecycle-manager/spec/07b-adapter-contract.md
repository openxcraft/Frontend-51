# 07b — Adapter Contract: contract-lifecycle-manager (TypeScript, v1)

SME-G pass · `ContractLifecycleAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session model. Types only — no implementation. Entity semantics (Workspace, Counterparty, ContractRecord, TermRecord, ExecutionRecord, ContractDocument, ReviewStep, Obligation, ObligationCompletion, ExtractionSuggestion, ExportArtifact, ActivityEntry): 07a — declared canonically there and part of this contract by reference; 07b declares only the operational wrappers (summaries, views, jobs) its signatures need. Every operation traces to ≥1 flow (03 coverage table).

```ts
// Single contract surface. Entity types referenced below are declared
// canonically in 07a; 07b declares the operational wrappers only.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (metadata rules, upload limits, date logic, review gates)
 * 'NOT_FOUND'    -> NotFoundError     (stale contract/document/obligation/counterparty/artifact links)
 * 'PERMISSION'   -> PermissionError   (viewer-role mutations, capability consent, workspace scoping)
 * 'CONFLICT'     -> ConflictError     (concurrent contract/obligation/counterparty edits)
 * 'RATE_LIMIT'   -> RateLimitError    (extraction-assist runs, exports)
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
  role: 'owner' | 'editor' | 'viewer';   // viewer: read + complete own obligations, no mutations
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (summaries + views; full shapes per 07a) ----

export type Locale = 'ar' | 'en';
export type ContractStatus = 'draft' | 'in-review' | 'awaiting-execution'
  | 'active' | 'terminated' | 'archived';
export type UrgencyZone = 'overdue' | 'imminent' | 'approaching' | 'later';
export type ObligationDirection = 'we-owe' | 'they-owe';
export type ObligationKind =
  | 'renewal-notice' | 'expiry' | 'payment' | 'deliverable'
  | 'report' | 'certificate' | 'other';

export interface WorkspaceView extends Workspace {           // 07a Workspace by reference
  extractionConsent: 'ungranted' | 'granted' | 'revoked';   // capability class state, kind-not-vendor
  extractionCapabilityBound: boolean;                       // abstract need N1 (08)
}

export interface CounterpartyRow extends Counterparty { }   // counterparties are small — full shape in lists

export interface ContractSummary {
  id: string;
  counterpartyId: string;
  titleEn: string;
  titleAr?: string;
  contractType: ContractRecord['contractType'];
  status: ContractStatus;                 // stored states only (07a)
  derivedLifecycle: 'expiring-soon' | 'expired' | null;      // computed at read, never stored
  ownerMemberId: string;
  tags: string[];
  valueAmount?: number;
  currency?: string;
  autoRenew: boolean;
  currentTermEnd?: string | null;
  noticeDeadline?: string;                // computed: termEnd − noticeWindowDays (autoRenew only)
  daysToNoticeDeadline?: number;          // computed from the fixed clock
  obligationCounts: { open: number; overdue: number; imminent: number };  // derived
  updatedAt: string;
}

export interface ContractDetail extends ContractSummary {
  terms: TermRecord[];
  execution?: ExecutionRecord;
  documents: { id: string; fileName: string; language: string; pageCount?: number;
    uploadedAt: string; version: number }[];
  reviewSteps: ReviewStep[];
  language: ContractRecord['language'];
  noticeWindowDays?: number;
}

export interface ObligationRow {
  id: string;
  contractId: string;
  direction: ObligationDirection;
  summaryEn: string;
  summaryAr?: string;
  kind: ObligationKind;
  ownerMemberId: string;
  status: Obligation['status'];
  zone: UrgencyZone;                      // derived at read from due date vs clock
  nextDueDate?: string;                   // recurring: computed next occurrence
  provenance: 'manual' | 'assist' | 'import';
  version: number;
}

export interface ObligationDetail extends ObligationRow {
  recurrence: Obligation['recurrence'];
  leadOverride?: Obligation['leadOverride'];
  completions: ObligationCompletion[];    // append-only evidence history
}

export interface ReminderRow {            // DERIVED view — pure computation (07c formulas)
  obligationId: string;
  contractId: string;
  kind: 'first-lead' | 'final-lead' | 'due' | 'overdue-daily' | 'notice-deadline';
  fireDate: string;
  zone: UrgencyZone;
}

export interface Job<T> {
  id: string;
  kind: 'extraction' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface ContractLifecycleAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // workspace (defaults read at S9; reminder engine parameters)
  getWorkspace(): Promise<Result<WorkspaceView, AdapterError>>;
  updateWorkspace(patch: {
    defaultLocale?: Locale;
    reminderDefaults?: { firstLeadDays: number; finalLeadDays: number };
    noticeWindowDefaultDays?: number;
  }): Promise<Result<WorkspaceView, AdapterError>>;

  // register
  listContracts(query: {
    filter?: { status?: ContractStatus[]; counterpartyId?: string; ownerMemberId?: string;
      tags?: string[]; zone?: UrgencyZone[]; contractType?: ContractRecord['contractType'][] };
    search?: string;                      // bilingual normalized (rtl-rules §4)
    sort: 'updatedAt' | 'valueAmount' | 'noticeDeadline' | 'titleEn';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ContractSummary>, AdapterError>>;
  getContract(id: string): Promise<Result<ContractDetail, AdapterError>>;
  createContract(input: {
    counterpartyId: string;
    titleEn: string; titleAr?: string;
    contractType: ContractRecord['contractType'];
    ownerMemberId: string;
    valueAmount?: number; currency?: string;
    language: ContractRecord['language'];
    autoRenew: boolean; noticeWindowDays?: number;
    effectiveDate: string; terminationDate?: string | null;
    tags?: string[];
    idempotencyKey: string;               // async-contract §5 — double-submit never double-creates
  }): Promise<Result<ContractSummary, AdapterError>>;
  updateContract(id: string, patch: {
    titleEn?: string; titleAr?: string | null;
    ownerMemberId?: string; tags?: string[];
    valueAmount?: number; currency?: string;
    autoRenew?: boolean; noticeWindowDays?: number;
    baseVersion: number;
  }): Promise<Result<ContractSummary, AdapterError>>;

  // documents (versioned whole; LOOP-10: bytes are stored, never redlined)
  uploadDocument(input: {
    contractId: string;
    fileName: string;
    language: ContractRecord['language'];
    pageCount?: number;
    idempotencyKey: string;
  }): Promise<Result<{ documentId: string; version: number }, AdapterError>>;
  getDocumentArtifact(documentId: string): Promise<Result<{ url: string; expiresAt: string }, AdapterError>>;

  // workflow (append-only steps; execution is an attestation-shaped record)
  requestReview(input: {
    contractId: string; assigneeMemberId: string; note?: string;
    idempotencyKey: string;
  }): Promise<Result<ReviewStep, AdapterError>>;
  recordReviewDecision(input: {
    stepId: string; decision: 'approved' | 'returned'; comment?: string;
    idempotencyKey: string;
  }): Promise<Result<ReviewStep, AdapterError>>;
  recordExecution(input: {
    contractId: string;
    executedAt: string;
    channel: 'manual' | 'execution-channel';   // abstract channel when bound (08 N2)
    documentId?: string;
    idempotencyKey: string;
  }): Promise<Result<ContractSummary, AdapterError>>;
  recordRenewalTerm(input: {
    contractId: string;
    newTerminationDate: string | null;
    note?: string;
    correctionOf?: string;                 // term-record id when correcting (never editing history)
    idempotencyKey: string;
  }): Promise<Result<ContractDetail, AdapterError>>;
  markTerminated(input: {
    contractId: string;
    effectiveDate: string; reason: string;
    idempotencyKey: string;
  }): Promise<Result<ContractDetail & { closedObligations: string[] }, AdapterError>>;
  archiveContract(id: string): Promise<Result<ContractSummary, AdapterError>>;

  // counterparties (bilingual identity; registry lookup is abstract N4)
  listCounterparties(query: {
    search?: string;                       // bilingual normalized (rtl-rules §4)
    sort: 'legalNameEn' | 'activeContractCount' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CounterpartyRow>, AdapterError>>;
  createCounterparty(input: {
    legalNameEn: string; legalNameAr?: string;
    kind: Counterparty['kind'];
    registryId?: string;
    note?: string;
  }): Promise<Result<CounterpartyRow, AdapterError>>;
  updateCounterparty(id: string, patch: {
    legalNameEn?: string; legalNameAr?: string | null;
    kind?: Counterparty['kind']; registryId?: string; note?: string;
    baseVersion: number;
  }): Promise<Result<CounterpartyRow, AdapterError>>;

  // obligations (the spine; manual entry is the always-available primary path)
  listObligations(query: {
    filter?: { contractId?: string; status?: Obligation['status'][];
      zone?: UrgencyZone[]; ownerMemberId?: string; kind?: ObligationKind[];
      direction?: ObligationDirection[] };
    sort: 'nextDueDate' | 'createdAt' | 'contractId';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ObligationRow>, AdapterError>>;
  getObligation(id: string): Promise<Result<ObligationDetail, AdapterError>>;
  createObligation(input: {
    contractId: string;
    direction: ObligationDirection;
    summaryEn: string; summaryAr?: string;
    kind: ObligationKind;
    ownerMemberId: string;
    recurrence: Obligation['recurrence'];
    leadOverride?: Obligation['leadOverride'];
    idempotencyKey: string;
  }): Promise<Result<ObligationRow, AdapterError>>;
  updateObligation(id: string, patch: {
    summaryEn?: string; summaryAr?: string | null;
    ownerMemberId?: string; kind?: ObligationKind;
    recurrence?: Obligation['recurrence'];
    leadOverride?: Obligation['leadOverride'] | null;
    status?: 'open' | 'acknowledged';
    baseVersion: number;
  }): Promise<Result<ObligationRow, AdapterError>>;
  completeObligation(input: {
    id: string;
    completedAt: string;
    evidenceNote?: string; documentRef?: string;
    idempotencyKey: string;                // attestations are idempotent (async-contract §4 atomic class)
  }): Promise<Result<ObligationRow, AdapterError>>;

  // extraction assist (conditionally-AI: consent-gated, draft-by-default — 08 N1)
  runExtraction(input: {
    contractId: string; documentId: string;
    idempotencyKey: string;
  }): Promise<Result<Job<{ suggestionIds: string[]; degraded: boolean;
    degradedReason?: 'unavailable' | 'quota' }>, AdapterError>>;
  listSuggestions(query: {
    contractId: string;
    filter?: { state?: ExtractionSuggestion['state'][]; targetKind?: ('metadata-field' | 'obligation')[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ExtractionSuggestion>, AdapterError>>;
  resolveSuggestion(input: {
    suggestionId: string;
    action: 'accept' | 'dismiss';
    edit?: Record<string, string>;         // field patches on accept (edit-then-accept, P15)
  }): Promise<Result<ExtractionSuggestion, AdapterError>>;

  // derived reminder schedule (deterministic computation — never stored)
  listReminders(query: {
    filter?: { zone?: UrgencyZone[]; ownerMemberId?: string; contractId?: string };
    from?: string; to?: string;            // inclusive date window around the clock
    cursor?: string; limit: number;
  }): Promise<Result<Page<ReminderRow>, AdapterError>>;

  // activity + audit exports (P17; a11y-baseline §7 exportability)
  listActivity(query: {
    filter?: { actorMemberId?: string; action?: ActivityEntry['action'][];
      targetRef?: string; from?: string; to?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntry>, AdapterError>>;
  exportRegister(input: {
    scope: 'contracts' | 'obligations' | 'activity';
    format: 'csv' | 'register-bundle';
    filters?: Record<string, string>;
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getExportArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string;
    regenerable: boolean; scope: string }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    extractionRuns: number; manualObligationsCreated: number; exports: number;
    resetAt: string;
  }, AdapterError>>;
}
```

## Rules

1. **Suggestion resolution is the P15 gate**: nothing a job proposes becomes authoritative until `resolveSuggestion` accepts it (optionally with `edit`); accepted suggestions create records with `provenance: 'assist'` and the `assistSuggestionId` chain; edit-then-accept records "assist-proposed, human-edited" in the activity detail; dismissed suggestions are retained, never purged. The adapter never auto-applies a suggestion.
2. **Assist honesty**: `runExtraction` returns `degraded` + `degradedReason` when the capability is unavailable or quota-exhausted mid-window — the UI surfaces the manual path in the same surface (ai-native-patterns §5 ladder); the manual path (createObligation/updateContract by hand) is never gated, metered, or rate-limited.
3. **Consent enforcement**: `runExtraction` without a granted extraction consent → PERMISSION naming the capability class in capability language (credential-contract §4) — never a vendor name.
4. **Stale-version semantics**: `updateContract`/`updateObligation`/`updateCounterparty` with stale `baseVersion` → CONFLICT with both payloads in `details` (P10).
5. **Append-only histories**: terms, executions, completions, review steps, and activity entries are never mutated; corrections append a referencing record (`correctionOf`) — editing history is a contract violation, not a feature.
6. **Termination closes obligations honestly**: `markTerminated` sets open obligations to `closed-by-termination` and returns the closed list; the workflow surfaces it per obligation (never silently dropped).
7. **Derived states are read-time facts**: `derivedLifecycle`, `zone`, `noticeDeadline`, `daysToNoticeDeadline`, and the entire reminder schedule are computed at read from stored state + the clock; the adapter never writes a derived value back (07c regression asserts identical outputs on replay).
8. **Workflow gates**: `recordExecution` on a contract without an approved review step → VALIDATION naming the gate; execution date before review approval → VALIDATION; `autoRenew: true` without `noticeWindowDays` (or with a window exceeding the current term) → VALIDATION at save.
9. **Idempotency**: every append-only mutation and job submit carries an idempotency key; a replayed submit returns the original result and never double-records an attestation or double-charges quota (async-contract §5).
10. **Partial-result policies**: extraction Jobs deliver partial suggestions on mid-run failure (marked per item, per-item retry — async-contract §4); exports deliver per-scope partial with per-scope retry; uploads and completions are atomic (attestation class).
11. **Typed pagination on every list; cursors opaque.** No orphan methods — 03 coverage table verified at Critic pass (32 operations, 0 orphans).
12. **Role boundaries**: viewer sessions may read everything scoped and `completeObligation` on obligations they own; every other mutation → PERMISSION naming the role and the action.
