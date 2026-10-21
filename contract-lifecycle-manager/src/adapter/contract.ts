// VERBATIM from specs-source/contract-lifecycle-manager/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type ContractType = 'msa' | 'sow' | 'lease' | 'supply' | 'nda' | 'other';
export type ContractLanguage = 'ar' | 'en' | 'bilingual';
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;
  reminderDefaults: {
    firstLeadDays: number;               // default 30 — D−firstLead reminder entry
    finalLeadDays: number;               // default 7  — D−finalLead reminder entry
  };
  noticeWindowDefaultDays: number;       // default 60 — suggested at intake ([24] band)
}
export interface Counterparty {
  id: string;
  workspaceId: string;
  legalNameEn: string;                   // bilingual identity: either side alone is valid
  legalNameAr?: string;
  kind: 'company' | 'individual' | 'government';
  registryId?: string;                   // e.g. commercial-registration number (Latin digits)
  registryIdSource: 'manual' | 'party-registry-capability';  // provenance, never vendor
  note?: string;
  activeContractCount: number;           // derived at read
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface TermRecord {            // append-only term history (CP-3)
  id: string;
  effectiveDate: string;                 // ISO date
  terminationDate: string | null;        // null = open-ended
  provenance: 'intake' | 'renewal' | 'correction';
  correctionOf?: string;                 // term-record id when correcting, never editing history
  note?: string;
  recordedByMemberId: string;
  recordedAt: string;                    // timestamp announced with the action (a11y-baseline §7)
}
export interface ContractRecord {
  id: string;
  workspaceId: string;
  counterpartyId: string;
  titleEn: string;                       // internal title; either side alone is valid (P23 logic)
  titleAr?: string;
  contractType: ContractType;
  tags: string[];
  ownerMemberId: string;                 // accountable owner (Layla/Faisal role)
  valueAmount?: number;                  // register metadata for triage; no financial posting (LOOP-10)
  currency?: string;                     // free-text ISO-style code, Latin
  language: ContractLanguage;
  autoRenew: boolean;
  noticeWindowDays?: number;             // required semantics when autoRenew = true
  terms: TermRecord[];                   // current term = last entry; history is the audit spine
  status: ContractStatus;
  execution?: ExecutionRecord;           // present once recorded (CP-4)
  primaryDocumentId?: string;
  suggestionJobIds: string[];            // extraction provenance chain
  version: number;                       // optimistic concurrency (CONFLICT on stale)
  createdAt: string;
  updatedAt: string;
}
export interface ExecutionRecord {       // attestation-shaped fact, append-only semantics
  executedAt: string;                    // ISO date
  channel: 'manual' | 'execution-channel';  // abstract channel when bound (08 N2); manual is primary
  recordedByMemberId: string;
  documentId?: string;                   // the executed copy uploaded as a document version
  recordedAt: string;
}
export interface ContractDocument {
  id: string;
  contractId: string;
  fileName: string;
  language: ContractLanguage;
  pageCount?: number;
  bytes: number;
  uploadedByMemberId: string;
  uploadedAt: string;
  version: number;                       // document versions replace whole files, never patch
}
export interface ReviewStep {            // workflow track (CP-4), append-only
  id: string;
  contractId: string;
  requestedByMemberId: string;
  requestedAt: string;
  note?: string;
  state: 'pending' | 'approved' | 'returned';
  assigneeMemberId: string;
  decisionComment?: string;
  decidedAt?: string;
}
export interface Obligation {
  id: string;
  workspaceId: string;
  contractId: string;
  direction: ObligationDirection;
  summaryEn: string;                     // plain bilingual summary; either side alone is valid
  summaryAr?: string;
  kind: ObligationKind;
  ownerMemberId: string;
  recurrence: { kind: 'one-time'; dueDate: string }
    | { kind: 'recurring'; intervalDays: number; anchorDate: string };
  leadOverride?: { firstLeadDays?: number; finalLeadDays?: number };
  status: 'open' | 'acknowledged' | 'completed' | 'closed-by-termination';
  provenance: 'manual' | 'assist' | 'import';
  assistSuggestionId?: string;           // provenance chain to the accepted suggestion
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface ObligationCompletion { // append-only evidence event (CP-2)
  id: string;
  obligationId: string;
  completedByMemberId: string;
  completedAt: string;                   // ISO datetime — announced with the action
  evidenceNote?: string;
  documentRef?: string;                  // optional reference to an uploaded document
}
export interface ReminderEntry {         // DERIVED — never stored; computed from
  // obligation state + workspace defaults + the fixed clock (07c formulas)
  obligationId: string;
  contractId: string;
  kind: 'first-lead' | 'final-lead' | 'due' | 'overdue-daily' | 'notice-deadline';
  fireDate: string;                      // deterministic date
  zone: UrgencyZone;     // overdue | imminent(≤7d) | approaching(≤30d) | later — computed
}
export interface ExtractionSuggestion { // draft-by-default (P15); never authoritative
  id: string;
  jobId: string;
  contractId: string;
  documentId: string;
  target: { kind: 'metadata-field'; field: string; proposedValue: string }
    | { kind: 'obligation'; proposed: Omit<Obligation, 'id' | 'workspaceId' | 'version'
        | 'createdAt' | 'updatedAt' | 'status' | 'provenance' | 'assistSuggestionId'> };
  confidence: number;                    // 0–1, labeled figure at render
  anchor?: { page: number; excerpt: string };  // citation anchor into the document
  state: 'proposed' | 'accepted' | 'dismissed';
  resolvedByMemberId?: string;
  resolvedAt?: string;
}
export type JobKind = 'extraction' | 'export';
export interface ExportArtifact {
  id: string;
  scope: 'contracts' | 'obligations' | 'activity';
  format: 'csv' | 'register-bundle';     // bundle = contracts + obligations appendix
  filtersApplied: Record<string, string>;
  expiresAt: string;                     // declared retention window at creation
  regenerable: boolean;
}
export interface ActivityEntry {         // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'contract-created' | 'metadata-updated' | 'document-uploaded'
    | 'review-requested' | 'review-decided' | 'execution-recorded'
    | 'renewal-recorded' | 'termination-recorded' | 'contract-archived'
    | 'obligation-created' | 'obligation-updated' | 'obligation-completed'
    | 'suggestion-accepted' | 'suggestion-dismissed' | 'counterparty-created'
    | 'counterparty-updated' | 'export-run' | 'consent-change' | 'correction-recorded';
  targetRef: string;
  detail?: string;                       // e.g. "assist-proposed, human-edited" provenance
  correctionOf?: string;                 // references the erroneous entry — never edit history
  at: string;
}

