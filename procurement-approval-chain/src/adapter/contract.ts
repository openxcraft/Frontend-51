// VERBATIM from specs-source/procurement-approval-chain/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. UI ↔ this typed interface ↔ deterministic mock (07c).
// Declared non-AI (ai-native-patterns §1): every operation is arithmetic over
// workspace-owned policy data; no model, no generation, no scoring, anywhere.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (band gaps/overlaps, duplicate scope, quote-count
 *                                     gate, non-lowest justification gate, blocking
 *                                     budget breach, unroutable/self-only positions,
 *                                     malformed lines, delegation windows, state misuse)
 * 'NOT_FOUND'    -> NotFoundError     (stale request/step/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (deciding a step not yours, no-access detail,
 *                                     viewer-role mutations, non-policy-owner mutations)
 * 'CONFLICT'     -> ConflictError     (concurrent draft edits, superseded chain versions,
 *                                     stale envelope/matrix/pack base versions,
 *                                     decide-vs-withdraw races, double-cancel)
 * 'RATE_LIMIT'   -> RateLimitError    (defensive: export bursts, 03 mapping)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact delivery)
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
  details?: Record<string, string[]>;   // e.g. both payloads on a CONFLICT
}

export interface Session {              // auth-agnostic (credential-contract §1): the
  memberId: string;                     // product never sees a provider; authority comes
  workspaceId: string;                  // from positions, never from the session itself
  role: 'owner' | 'admin' | 'member' | 'viewer';
  locale: 'ar' | 'en';                  // presentation preference; no adapter operation
  heldPositionIds: string[];            // mutates it (Settings S10 is client-held)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Canonical unions (full declarations in 07a) ----
export type Locale = 'ar' | 'en';
export type RequestStatus =
  | 'draft' | 'in-review' | 'approved' | 'rejected'
  | 'returned' | 'withdrawn' | 'cancelled-after-approval';
export type StepState = 'queued' | 'awaiting' | 'approved' | 'rejected' | 'returned';
export type ExportFormat = 'document' | 'ledger';
export type JobKind = 'export-request-package' | 'export-audit-register';
export type JobState = 'queued' | 'running' | 'awaiting-input' | 'succeeded'
  | 'failed' | 'cancelled' | 'expired';
export type BudgetState = 'within' | 'approaching' | 'over' | 'no-envelope';
export type RuleScope =
  | { kind: 'workspace-default' }
  | { kind: 'cost-center'; costCenterId: string }
  | { kind: 'category'; categoryId: string };

// ---- List rows & views (operational wrappers; entity shapes per 07a) ----

export interface RequestRow {           // register row — visible workspace-wide (07b rule 7)
  id: string;
  code: string;                         // bidi-isolated Latin token inside Arabic chrome
  titleAr: string;
  titleEn: string;
  totalMinor: number;
  status: RequestStatus;
  requester: { memberId: string; nameAr: string; nameEn: string };
  costCenter: { id: string; nameAr: string; nameEn: string };
  currentStep: { positionTitleAr: string; positionTitleEn: string; state: StepState;
                 waitingSince: string } | null;
  band: { fromMinor: number; toMinor: number | null } | null;   // current chain's band
  overdue: boolean;                     // neededBy < clock while in-review — advisory only
  sample: boolean;
  updatedAt: string;
}

export interface QuoteView {
  quoteId: string;
  vendorId: string;
  vendorNameAr: string;
  vendorNameEn: string;
  totalMinor: number;
  leadTimeDays: number;
  terms?: string;
  validUntil?: string;
  documentRef?: string;
  receivedAt: string;
  selected: boolean;
  isLowest: boolean;                    // ties allowed: >= 2 rows may be lowest (07c rule 6)
  deltaMinor: number;                   // 0 on lowest rows
  deltaPercent: number;                 // 0 on lowest rows; round half-up 2dp otherwise
  justification?: string;               // present when selection requires it (07c rule 8)
}

export interface ApproverView {
  memberId: string;
  nameAr: string;
  nameEn: string;
  asDelegateForMemberId?: string;       // both identities on delegation decisions (CP-2.5)
}

export interface StepView {
  stepId: string;
  order: number;
  positionId: string;
  positionTitleAr: string;
  positionTitleEn: string;
  state: StepState;
  eligibleDeciders: ApproverView[];
  decision?: { outcome: 'approve' | 'return' | 'reject'; decidedBy: ApproverView;
               note?: string; at: string };
}

export interface ChainView {
  chainId: string;
  version: number;                      // v1 on submission; resubmission appends (CP-3)
  reason: 'submission' | 'resubmission';
  changeNote?: string;
  matrixVersion: number;                // pinned — in-flight chains finish under it
  ruleId: string;
  band: { fromMinor: number; toMinor: number | null };
  steps: StepView[];
}

export interface BudgetEvidence {
  envelopeId: string | null;
  costCenterNameAr: string;
  costCenterNameEn: string;
  categoryNameAr: string;
  categoryNameEn: string;
  periodLabel: string | null;
  committedMinor: number;
  projectedMinor: number;
  allocatedMinor: number | null;
  state: BudgetState;
  blocking: boolean;
  finding: string;                      // recorded finding text key + interpolated values
  computedAt: string;
}

export interface RequestDetail {
  id: string;
  code: string;
  revision: number;                     // optimistic-concurrency base for edits (P10)
  titleAr: string;
  titleEn: string;
  requester: { memberId: string; nameAr: string; nameEn: string };
  costCenter: { id: string; nameAr: string; nameEn: string };
  category: { id: string; nameAr: string; nameEn: string };
  neededBy: string;
  status: RequestStatus;
  totalMinor: number;
  lines: { lineId: string; descriptionAr: string; descriptionEn: string;
           quantity: number; unitPriceMinor: number; lineTotalMinor: number }[];
  quotes: QuoteView[];                  // sorted per 07c rule 6
  comparison: { lowestQuoteIds: string[]; selectedQuoteId: string | null;
                justificationRequired: boolean };
  currentChain: ChainView | null;       // null while draft
  chainHistory: ChainView[];            // prior versions, immutable (03 CP-3)
  budget: BudgetEvidence;               // the pinned snapshot of the current chain, or the
                                        // live projection while draft
  soleSourceJustification?: string;
  sample: boolean;
  can: { edit: boolean; decide: boolean; withdraw: boolean; resubmit: boolean;
         cancel: boolean; export: boolean };   // affordance flags derived at read (rule 7)
  createdAt: string;
  updatedAt: string;
}

export interface RoutingPreview {       // deterministic; computed from live draft state
  requestId: string;
  computedAt: string;
  previewRevision: number;              // divergence notice anchors here (03 CP-1 edge)
  matrixVersion: number;
  rule: { ruleId: string; scope: RuleScope; scopeLabelAr: string; scopeLabelEn: string };
  band: { fromMinor: number; toMinor: number | null };
  chain: { positionId: string; positionTitleAr: string; positionTitleEn: string;
           deciders: ApproverView[] }[];         // ordered, with current assignees/delegates
  budget: { envelopeId: string | null; periodLabel: string | null;
            committedMinor: number; projectedMinor: number; allocatedMinor: number | null;
            state: BudgetState; blocking: boolean };
  gates: { quoteCountRequired: boolean; quoteCountNeeded: number; quoteCountAttached: number;
           soleSourceDeclared: boolean; justificationRequired: boolean;
           justificationPresent: boolean };
}

export interface BandView {
  bandId: string;
  fromMinor: number;
  toMinor: number | null;
  chain: { positionId: string; titleAr: string; titleEn: string }[];
}

export interface RuleView {
  ruleId: string;
  scope: RuleScope;
  scopeLabelAr: string;
  scopeLabelEn: string;
  bands: BandView[];
  updatedAt: string;
}

export interface MatrixView {
  version: number;
  rules: RuleView[];                    // listed by specificity: category > cost-center >
  savedBy?: { memberId: string; nameAr: string; nameEn: string };   // default (CP-4.1)
  savedAt?: string;                     // audit weight on the studio surface (06)
}

export interface PolicyPackView {
  version: number;
  quotesRequiredThresholdMinor: number;
  minimumQuoteCount: number;
  nearLimitPercent: number;
  overBudgetDefault: 'advisory' | 'blocking';
  soleSourceExceptionEnabled: boolean;
  categories: { id: string; nameAr: string; nameEn: string }[];
  savedBy?: { memberId: string; nameAr: string; nameEn: string };
  savedAt?: string;
}

export interface EnvelopeView {         // commitments recomputed at read — never stale
  envelopeId: string;
  costCenter: { id: string; nameAr: string; nameEn: string };
  category: { id: string; nameAr: string; nameEn: string };
  period: { label: string; start: string; end: string };
  allocatedMinor: number;
  overBudget: 'advisory' | 'blocking';
  version: number;                      // optimistic-concurrency base (03 CP-4 failure)
  committed: { inFlightMinor: number; approvedMinor: number; totalMinor: number };
  state: BudgetState;                   // computed on committedMinor (07c rule 5)
  nearLimitThresholdMinor: number;
  breachMinor: number;                  // committed over allocation; 0 otherwise
}

export interface PositionView {
  positionId: string;
  titleAr: string;
  titleEn: string;
  level: number;
  assignees: { memberId: string; nameAr: string; nameEn: string }[];
  delegations: { delegationId: string; holder: { memberId: string; nameAr: string; nameEn: string };
                 delegate: { memberId: string; nameAr: string; nameEn: string };
                 window: { start: string; end: string }; note?: string }[];
}

export interface VendorRow { id: string; nameAr: string; nameEn: string; note?: string; }
export interface CostCenterRow { id: string; nameAr: string; nameEn: string; note?: string; }

export interface ActivityRow {
  entryId: string;
  actor: { memberId: string; nameAr: string; nameEn: string };
  action: string;                       // ActivityAction union per 07a
  targetRef: string;
  targetLabel?: string;                 // request code / rule scope / envelope key
  detail?: string;
  at: string;
}

export interface JobRow {
  jobId: string;
  kind: JobKind;
  state: JobState;
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: { deliveredFormats: ExportFormat[]; failedFormats: ExportFormat[] };
  artifacts: { artifactId: string; format: ExportFormat; expiresAt: string }[];
  error?: AdapterError;
  createdAt: string;
}

export interface ArtifactLink {
  artifactId: string;
  url: string;                          // opaque; delivery is the abstract channel's concern
  format: ExportFormat;
  kind: JobKind;
  expiresAt: string;                    // renewal action surfaces before expiry (06 JobRow)
  regenerable: boolean;
}

// ---- Contract ----

export interface ProcurementApprovalAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // requests — drafting (CP-1)
  createDraftRequest(input: {
    titleAr: string;
    titleEn: string;
    costCenterId: string;
    categoryId: string;
    neededBy: string;
    firstLine: { descriptionAr: string; descriptionEn: string;
                 quantity: number; unitPriceMinor: number };
    idempotencyKey: string;
  }): Promise<Result<RequestDetail, AdapterError>>;

  updateRequest(id: string, patch: {
    titleAr?: string;
    titleEn?: string;
    costCenterId?: string;
    categoryId?: string;
    neededBy?: string;
    lines?: { upsert: { lineId?: string; descriptionAr: string; descriptionEn: string;
                        quantity: number; unitPriceMinor: number }[];
              removeIds: string[] };
    soleSourceJustification?: string | null;
    baseRevision: number;               // stale → CONFLICT with both payloads (03 CP-1)
  }): Promise<Result<RequestDetail, AdapterError>>;

  addQuote(requestId: string, input: {
    vendorId: string;                   // the inline saveVendor path precedes this (CP-1.3)
    totalMinor: number;
    leadTimeDays: number;
    terms?: string;
    validUntil?: string;
    documentRef?: string;               // abstract quote-document capability (08 N1) —
                                        // typed totals always suffice (LOOP-5)
    receivedAt?: string;                // defaults to the fixed seeded clock (07c rule 12)
  }): Promise<Result<RequestDetail, AdapterError>>;

  updateQuote(requestId: string, quoteId: string, patch: {
    vendorId?: string;
    totalMinor?: number;
    leadTimeDays?: number;
    terms?: string;
    validUntil?: string;
    documentRef?: string;
    receivedAt?: string;
  }): Promise<Result<RequestDetail, AdapterError>>;

  removeQuote(requestId: string, quoteId: string): Promise<Result<RequestDetail, AdapterError>>;

  selectQuote(requestId: string, quoteId: string, justification?: string): Promise<Result<RequestDetail, AdapterError>>;
  // Non-lowest selection without a non-empty justification → VALIDATION naming the
  // rule (07c rule 8); the composer surface pre-empts the gate inline (06).

  previewRouting(requestId: string): Promise<Result<RoutingPreview, AdapterError>>;

  submitRequest(input: { requestId: string; idempotencyKey: string }): Promise<Result<RequestDetail, AdapterError>>;

  // register + detail (CP-2/CP-3/CP-5)
  listRequests(query: {
    view: 'my-requests' | 'my-queue' | 'all';   // my-queue = awaiting session's positions
    filter?: { status?: RequestStatus[]; costCenterId?: string; requesterId?: string;
               band?: { fromMinor: number; toMinor: number | null };  // amount range,
               overdue?: boolean; search?: string };                  // band-labeled in UI
    sort: 'createdAt' | 'updatedAt' | 'totalMinor' | 'waitAge';
    cursor?: string;
    limit: number;
  }): Promise<Result<Page<RequestRow>, AdapterError>>;

  getRequest(id: string): Promise<Result<RequestDetail, AdapterError>>;

  decideStep(input: {
    requestId: string;
    stepId: string;
    outcome: 'approve' | 'return' | 'reject';
    note?: string;                      // required for return and reject (03 CP-2)
    idempotencyKey: string;             // duplicate decide returns the original decision
  }): Promise<Result<RequestDetail, AdapterError>>;

  resubmitRequest(input: {
    requestId: string;
    changeNote: string;                 // "what changed" — approvers read it on v(n+1)
    idempotencyKey: string;
  }): Promise<Result<RequestDetail, AdapterError>>;

  withdrawRequest(input: { requestId: string; idempotencyKey: string }): Promise<Result<RequestDetail, AdapterError>>;

  cancelApprovedRequest(input: {
    requestId: string;
    reason: string;                     // logged with both amounts (03 CP-3.5)
    idempotencyKey: string;
  }): Promise<Result<RequestDetail, AdapterError>>;

  // accountability surfaces (CP-5)
  listActivity(query: {
    filter?: { actorId?: string; action?: string[]; requestId?: string };
    cursor?: string;
    limit: number;
  }): Promise<Result<Page<ActivityRow>, AdapterError>>;

  exportRequestPackage(input: {
    requestId: string;
    formats: ExportFormat[];            // partial delivery + per-format retry (async-contract §4)
    includeActivityAppendix: boolean;
    idempotencyKey: string;
  }): Promise<Result<JobRow, AdapterError>>;

  exportAuditRegister(input: {
    formats: ExportFormat[];            // matrix versions, pack versions, envelopes, appendix
    includeSample: boolean;             // sample-badged requests excluded unless included
    idempotencyKey: string;
  }): Promise<Result<JobRow, AdapterError>>;

  listJobs(query: {
    filter?: { state?: JobState[]; kind?: JobKind[] };
    cursor?: string;
    limit: number;
  }): Promise<Result<Page<JobRow>, AdapterError>>;

  getArtifact(artifactId: string): Promise<Result<ArtifactLink, AdapterError>>;

  // policy studio — matrix + pack + envelopes (CP-4)
  getApprovalMatrix(): Promise<Result<MatrixView, AdapterError>>;

  saveApprovalRule(input: {
    rule: { ruleId?: string;            // absent = new rule
            scope: RuleScope;
            bands: { fromMinor: number; toMinor: number | null; positionIds: string[] }[] };
    baseMatrixVersion: number;          // stale → CONFLICT; band validation at save (rule 2)
  }): Promise<Result<MatrixView, AdapterError>>;

  removeApprovalRule(input: { ruleId: string; baseMatrixVersion: number }): Promise<Result<MatrixView, AdapterError>>;

  getPolicyPack(): Promise<Result<PolicyPackView, AdapterError>>;

  savePolicyPack(input: {
    patch: { quotesRequiredThresholdMinor?: number; minimumQuoteCount?: number;
             nearLimitPercent?: number; overBudgetDefault?: 'advisory' | 'blocking';
             soleSourceExceptionEnabled?: boolean;
             categories?: { id?: string; nameAr: string; nameEn: string }[] };
    baseVersion: number;
  }): Promise<Result<PolicyPackView, AdapterError>>;

  listBudgetEnvelopes(query: {
    filter?: { periodLabel?: string; costCenterId?: string; categoryId?: string };
    cursor?: string;
    limit: number;
  }): Promise<Result<Page<EnvelopeView>, AdapterError>>;

  saveBudgetEnvelope(input: {
    envelope: { envelopeId?: string;    // absent = new envelope
                costCenterId: string; categoryId: string;
                period: { label: string; start: string; end: string };
                allocatedMinor: number; overBudget: 'advisory' | 'blocking' };
    baseVersion?: number;               // required when envelopeId present (03 CP-4 failure)
  }): Promise<Result<EnvelopeView, AdapterError>>;

  // org & delegation (CP-4)
  listPositions(query: { cursor?: string; limit: number }): Promise<Result<Page<PositionView>, AdapterError>>;

  savePosition(input: {
    position: { positionId?: string; titleAr: string; titleEn: string; level: number;
                assigneeMemberIds: string[] };
  }): Promise<Result<PositionView, AdapterError>>;

  setDelegation(input: {
    positionId: string;
    holderMemberId: string;             // must be an assignee of the position
    delegateMemberId: string;           // any active workspace member (VALIDATION otherwise,
                                        // naming "a delegate must be a workspace member")
    window: { start: string; end: string };   // end after start (03 CP-4 failure)
    note?: string;
  }): Promise<Result<PositionView, AdapterError>>;

  clearDelegation(input: { delegationId: string }): Promise<Result<PositionView, AdapterError>>;

  // reference directories (CP-1 inline + CP-4 maintenance)
  listCostCenters(query: { cursor?: string; limit: number }): Promise<Result<Page<CostCenterRow>, AdapterError>>;

  saveCostCenter(input: {
    costCenter: { id?: string; nameAr: string; nameEn: string; note?: string };
  }): Promise<Result<CostCenterRow, AdapterError>>;   // admin/owner only (rule 7)

  listVendors(query: { search?: string; cursor?: string; limit: number }): Promise<Result<Page<VendorRow>, AdapterError>>;

  saveVendor(input: {
    vendor: { id?: string; nameAr: string; nameEn: string; note?: string };
  }): Promise<Result<VendorRow, AdapterError>>;      // member+ — Amal's inline path (CP-1.3)
}


// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type MinorUnits = number;        // integer minor units of the workspace currency
                                        // (e.g. SAR 12,050.00 = 1205000). Never fractional,
                                        // never floating-point (07c rule 1).

// ---- Workspace & org ----
export interface Workspace {
  id: string;
  name: string;                         // bilingual display name is workspace chrome
  currency: 'SAR' | 'AED';              // single workspace currency at v1 (12 Q-13)
  defaultLocale: Locale;                // presentation default; per-member preference is
                                        // session-level and carries no adapter operation
}
export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';
// owner/admin: policy owners (matrix, policy pack, envelopes, positions) — Faisal's shape.
// member: drafts and collects quotes — Amal's shape (requester seats, free per 12 Q-3).
// viewer: reads the register, exports; no mutations (03 failure mapping).
// Approval authority derives from Position assignments, NEVER from role.
export interface Member {
  id: string;
  nameAr: string;
  nameEn: string;
  role: MemberRole;
  active: boolean;
  joinedAt: string;                     // ISO 8601
}
export interface Position {
  id: string;
  titleAr: string;                      // bilingual by construction (both required at save)
  titleEn: string;
  level: number;                        // display ordering: 1 Department Manager … 3 GM
  assigneeMemberIds: string[];          // may hold several members ("the next holder",
                                        // 03 CP-2 edge); never empty for resolvable chains
}
export interface Delegation {
  id: string;
  positionId: string;
  holderMemberId: string;               // must be an assignee of the position
  delegateMemberId: string;             // any active workspace member (position optional)
  window: { start: string; end: string };  // end strictly after start (03 CP-4 failure)
  note?: string;
}

// ---- Reference data ----
export interface CostCenter {
  id: string;
  nameAr: string;
  nameEn: string;
  note?: string;
}
export interface CategoryRef {
  id: string;
  nameAr: string;                       // e.g. "فعاليات" / "Events"
  nameEn: string;
  // Categories are maintained INSIDE the versioned policy pack (07b savePolicyPack) —
  // no separate category operation exists in the 35-op surface; see 12 Q-18.
}
export interface Vendor {
  id: string;
  nameAr: string;                       // a name directory for quotes only (LOOP-10:
  nameEn: string;                       // no vendor management beyond names)
  note?: string;
}

// ---- Policy: DOA matrix + policy pack ----
export interface ThresholdBand {
  id: string;
  fromMinor: number;                    // inclusive; first band starts at 0
  toMinor: number | null;               // inclusive; null = unbounded terminal band
  positionIds: string[];                // the ordered approval chain for this band
}
export interface ApprovalRule {
  id: string;
  scope: RuleScope;
  bands: ThresholdBand[];               // ascending, contiguous, non-overlapping,
                                        // terminal unbounded (07c rule 2)
  createdAt: string;
  updatedAt: string;
}
export interface ApprovalMatrix {
  version: number;                      // every rule save appends a version
  rules: ApprovalRule[];
}
export interface PolicyPack {
  id: string;
  version: number;                      // every save appends a version
  quotesRequiredThresholdMinor: number; // requests with total >= this need minimumQuoteCount
  minimumQuoteCount: number;            // the 3-quote convention as workspace policy
  nearLimitPercent: number;             // e.g. 80 — the approaching-limit band
  overBudgetDefault: 'advisory' | 'blocking';  // workspace default; per-envelope overrides
  soleSourceExceptionEnabled: boolean;  // sole-source justification waives the count gate
  categories: CategoryRef[];            // the category registry (12 Q-18)
  updatedAt: string;
}

// ---- Budget ----
export interface FiscalPeriod {
  label: string;                        // e.g. "FY2026"
  start: string;                        // ISO date, inclusive
  end: string;                          // ISO date, inclusive
}
export interface BudgetEnvelope {
  id: string;
  costCenterId: string;
  categoryId: string;
  period: FiscalPeriod;
  allocatedMinor: number;
  overBudget: 'advisory' | 'blocking';  // blocking refuses over-projections at submit
  version: number;                      // optimistic-concurrency base for edits
  updatedAt: string;
}

// ---- Purchase requests ----
export interface RequestLine {
  id: string;
  descriptionAr: string;                // bilingual by construction (both required at submit)
  descriptionEn: string;
  quantity: number;                     // positive integer at v1
  unitPriceMinor: number;               // estimated unit price, integer minor units
}
// line total = quantity * unitPriceMinor (exact integer arithmetic, 07c rule 1)
export interface VendorQuote {
  id: string;
  vendorId: string;
  totalMinor: number;                   // typed by hand — the LOOP-5 always-available path
  leadTimeDays: number;
  terms?: string;                       // free text; rendered in a bidi isolating container
  validUntil?: string;                  // ISO date
  documentRef?: string;                 // abstract quote-document capability reference (08 N1)
  receivedAt: string;                   // ISO instant — the comparison tie-breaker
  selected: boolean;                    // exactly one selected quote per submitted request
  justification?: string;               // REQUIRED when the selected quote is not the lowest
}
export interface QuoteComparison {      // derived read-only; recomputes on any quote edit
  lowestQuoteIds: string[];             // >= 2 quotes may tie at the minimum
  rows: { quoteId: string; deltaMinor: number; deltaPercent: number }[]; // percent = round
                                        // half-up to 2dp of deltaMinor / lowest total (07c rule 6)
  selectedQuoteId: string | null;
  justificationRequired: boolean;       // true iff selected total > minimum total
}
export interface BudgetCheckSnapshot { // immutable evidence pinned per chain version
  id: string;
  chainVersionId: string;
  envelopeId: string | null;            // null = no envelope mapped (advisory finding)
  costCenterId: string;
  categoryId: string;
  periodLabel: string | null;           // matched envelope's label, or the derived "FY{year}"
  committedMinor: number;               // in-flight + approved, excluding this request
  projectedMinor: number;               // committed + this request's total
  allocatedMinor: number | null;
  state: BudgetState;
  blocking: boolean;                    // the envelope's over-budget behavior
  finding: string;                      // recorded advisory/finding text key + values
  computedAt: string;
}
export interface Decision {             // immutable authority record (P03 deviation, 03 CP-2)
  stepId: string;
  decidedByMemberId: string;
  asDelegateForMemberId?: string;       // both identities recorded on delegation decisions
  outcome: 'approve' | 'return' | 'reject';
  note?: string;                        // required for return and reject
  at: string;
}
export interface ChainStep {
  id: string;
  positionId: string;
  order: number;
  state: StepState;
  eligibleDeciderMemberIds: string[];   // (assignees + active delegates) minus the requester
                                        // (07c rule 4 — self-approval is impossible)
  decision?: Decision;
}
export interface ApprovalChain {        // a chain VERSION — immutable once computed
  id: string;
  requestId: string;
  version: number;                      // v1 on submission; resubmission appends v(n+1)
  reason: 'submission' | 'resubmission';
  changeNote?: string;                  // required on resubmission ("what changed")
  matrixVersion: number;                // pinned at computation — in-flight chains complete
                                        // under their pinned matrix even after rule edits
  ruleId: string;
  band: { fromMinor: number; toMinor: number | null };
  steps: ChainStep[];                   // ordered; step 1 awaiting on activation
  budgetSnapshotId: string;
  computedAt: string;
}
export interface PurchaseRequest {
  id: string;
  code: string;                         // "PR-1041" — sequential, never reused (append-only)
  titleAr: string;
  titleEn: string;
  requesterMemberId: string;
  costCenterId: string;
  categoryId: string;
  neededBy: string;                     // ISO date; past dates are advisory, not blocking
  status: RequestStatus;
  totalMinor: number;                   // derived: sum of line totals (07c rule 1)
  revision: number;                     // optimistic-concurrency base for draft edits (P10)
  lineIds: string[];
  quoteIds: string[];
  chainIds: string[];                   // history preserved on resubmission (03 CP-3)
  currentChainId: string | null;        // null while draft
  soleSourceJustification?: string;     // waives the quote-count gate when policy allows
  sample?: boolean;                     // first-run sample badge (12 Q-15)
  createdAt: string;
  updatedAt: string;
}

// ---- Jobs & artifacts (async-contract) ----
export interface Job {
  id: string;
  kind: JobKind;
  state: JobState;
  progress: { determinate: boolean; done?: number; total?: number }; // per-format stages
  partial?: { deliveredFormats: ExportFormat[]; failedFormats: ExportFormat[] };
  result?: { artifactIds: string[] };
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;               // async-contract §5 — replay returns the original job
  createdAt: string;
}
export interface ExportArtifact {
  id: string;                           // one artifact per requested format
  jobId: string;
  kind: JobKind;
  requestId?: string;                   // export-request-package scope
  format: ExportFormat;
  expiresAt: string;                    // declared retention window at creation (7 days, 07c)
  regenerable: boolean;                 // always true — exports re-generate from live state
  includesSample: boolean;              // sample-badged requests excluded unless included (12 Q-15)
}

// ---- Activity log (P17) ----
export type ActivityAction =
  | 'request-created' | 'request-updated' | 'quote-added' | 'quote-updated'
  | 'quote-removed' | 'quote-selected' | 'request-submitted' | 'step-approved'
  | 'step-returned' | 'step-rejected' | 'request-resubmitted' | 'request-withdrawn'
  | 'request-cancelled-after-approval' | 'matrix-saved' | 'rule-removed'
  | 'policy-pack-saved' | 'envelope-saved' | 'position-saved' | 'delegation-set'
  | 'delegation-cleared' | 'vendor-saved' | 'cost-center-saved' | 'export-run';
export interface ActivityEntry {
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: ActivityAction;
  targetRef: string;                    // request / rule / envelope / position / job id
  detail?: string;                      // e.g. "released 28000.00; 34500.00 remains committed"
  at: string;
}

