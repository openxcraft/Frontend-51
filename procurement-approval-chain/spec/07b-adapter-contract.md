# 07b — Adapter Contract: procurement-approval-chain (TypeScript, v1)

SME-G pass · `ProcurementApprovalAdapterV1` · 35 operations — exactly the 03 coverage table (zero orphans, zero phantoms; Critic-verified by check_coverage). Types only — no implementation. Entity semantics (PurchaseRequest, RequestLine, VendorQuote, QuoteComparison, ApprovalRule, ApprovalMatrix, PolicyPack, BudgetEnvelope, Position, Delegation, Vendor, CostCenter, ApprovalChain, ChainStep, Decision, BudgetCheckSnapshot, Job, ExportArtifact, ActivityEntry): 07a. Small unions re-declared below carry their canonical home in 07a; the compile surface dedupes them (house by-reference convention).

```ts
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

```

## Binding rules

1. **Determinism spine (declared non-AI)**: the same request state + the same matrix version + the same envelope set always yield the same routing, the same budget findings, and the same quote deltas — arithmetic over declared policy data, recomputable by hand; no operation consults a model, a score, or a heuristic (00, ai-native-patterns §1).
2. **Eligibility & self-approval**: a step's eligible deciders are the position's assignees plus members holding an active delegation window on that position, minus the requester; `decideStep` from any other member → PERMISSION naming the position; a submission whose chain resolves any step to zero eligible deciders → VALIDATION naming the position and the self-approval block (07c rule 4).
3. **Authority acts are recorded policy, never silently edited**: decide / withdraw / cancel results are immutable; idempotency-key replay returns the original decision; undo does not apply (the P03 deviation declared in 03 CP-2 — correction is a new recorded decision).
4. **Submit-time gates evaluate in a fixed order and name the failing gate**: (a) line and field VALIDATION (quantity, price, bilingual completeness), (b) chain resolution including self-approval, (c) quote-count policy with the sole-source exception, (d) non-lowest justification, (e) blocking budget breach. The first failure returns with the gate and the resolving action named; failed submits never destroy the draft (03 CP-1 recovery).
5. **Stale-version semantics**: `updateRequest` with a stale `baseRevision`, `saveApprovalRule` with a stale `baseMatrixVersion`, `savePolicyPack`/`saveBudgetEnvelope` with stale base versions → CONFLICT carrying both payloads in `details`; deciding a superseded chain version → CONFLICT naming the newer version; a decide-vs-withdraw race → first write wins, the loser receives CONFLICT with the newer state (03 edges).
6. **Idempotency keys on every double-submit-risk mutation**: submit, resubmit, decide, withdraw, cancel, and both exports — replay returns the original result, never a duplicate record or artifact (async-contract §5).
7. **Visibility is two-layered, honestly labeled**: the register index (rows with code, titles, total, status, current step) is visible workspace-wide; request **detail** is visible to the requester, members who decided or were eligible deciders or delegates on any chain version, and admins/owners — anyone else receives PERMISSION naming the rule (the P01 no-access state, 03 CP-5.2; default recorded in 12 Q-16). Viewers mutate nothing. Policy-surface mutations (matrix, pack, envelopes, positions, delegations, cost centers) require admin/owner; `saveVendor` is member-and-above because requesters add vendors inline while quoting (CP-1.3).
8. **Commitments project from live state, never stored stale**: every envelope read recomputes committed = in-flight + approved totals keyed (cost center, category, period containing neededBy); blocking envelopes in the over state refuse submissions with the breach amount named; missing envelopes record an advisory finding and never block silently (07c rule 5; 03 non-happy paths).
9. **Typed pagination on every list operation** (`Page<T>`); cursors are opaque and expire never within a session; no operation returns an unbounded collection.
10. **Exports are honest Jobs per async-contract**: determinate per-format progress ("format 1 of 2"), per-format partial delivery with per-format retry, a declared 7-day artifact expiry with renewal surfaced where the capability is used (06 JobRow), NOT_FOUND + regenerable path after expiry; job polling only on visible surfaces (S1 badge, S9).
11. **Bilingual data discipline**: titles, line descriptions, vendor names, position titles, and cost-center names are authored in both locales — both required at submit/save, no auto-translation, rendering per-side direction with bidi isolation, search normalized per rtl-rules §4; numerals Western everywhere; amount copy names the currency per locale direction ("SAR 12,050.00" / "12,050.00 ريال"), never mixed mid-sentence (02, 05).
12. **Capability language only**: no provider name or vendor kind appears in any payload, error copy, or credential surface (credential-contract §2); the typed-quote path works with every abstract capability unbound — the 00 success signal tests exactly that all-off configuration (LOOP-5).
