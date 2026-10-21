// VERBATIM from specs-source/expense-claim-flow/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (ClaimItem inputs,
// ComputationBreakdown, PolicyFinding, FindingResolution, PayoutRecord — and
// their fields) are declared canonically in 07a and are part of this contract
// by reference; 07b declares only the operational wrappers (summaries, views,
// jobs) its signatures need.
//
// AI DECLARATION (ai-native-patterns §1): this product is CONDITIONALLY-AI.
// The single model-touching operation is extractReceiptDraft — a proposal
// surface. Every other operation is deterministic rule evaluation or CRUD.
// The extraction capability is an abstract need (08 N1): unbound, the manual
// entry path carries the full workflow, and no core flow degrades.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (empty submission, malformed amounts/dates/distances, matrix gaps, overlapping rate-table ranges, payout correction without reason, approval-gate refusals with named blockers, self-approval dead-ends, withdraw-after-first-approval)
 * 'NOT_FOUND'    -> NotFoundError     (stale claim/item/receipt/artifact links, expired artifacts, unknown references)
 * 'PERMISSION'   -> PermissionError   (studio writes by non-admins, payout recording by non-finance roles, cross-member draft access, assist-capability consent, approver acting outside their step)
 * 'CONFLICT'     -> ConflictError     (concurrent item/header edits, decide or reassign on already-decided steps, double payout records without correction semantics, stale table/pack baseVersion)
 * 'RATE_LIMIT'   -> RateLimitError    (OCR extraction window, export packages)
 * 'NETWORK'      -> NetworkError      (queue fetches, artifact delivery, job polling)
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
  role: 'finance-admin' | 'approver' | 'employee';   // 07a MemberRole; capabilities per 07b rule 5
  locale: 'ar' | 'en';                                // chrome direction; receipt previews follow their own script (05)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export type Locale = 'ar' | 'en';
export type CurrencyCode = string;
export type ClaimStatusName = 'draft' | 'submitted' | 'queried' | 'approved' | 'rejected' | 'paid';

export interface ClaimSummary {                      // queue rows (S1/S7 — virtualized above 200, P19)
  id: string;
  reference: string;                                 // bidi-isolated Latin token at render
  claimant: { memberId: string; nameEn: string; nameAr: string };
  title: string;
  status: ClaimStatusName;
  currency: CurrencyCode;
  grandTotal: number;                                // canonical minor units
  kindSplit: { receipt: number; perDiem: number; mileage: number };   // item counts
  chainPosition?: { level: number; of: number; approverNameEn: string; approverNameAr: string };   // submitted+
  openFindings: { blocking: number; advisory: number };
  submittedAt?: string;
  updatedAt: string;
}

export interface ApprovalStepView {                  // the chain as rendered
  step: ApprovalStep;                                // 07a full shape
  approver: { memberId: string; nameEn: string; nameAr: string };
  isCurrentLevel: boolean;
}

export interface ClaimView {
  claim: Claim;                                      // 07a full shape
  items: (ClaimItem & { receiptState?: 'none' | 'attached' })[];
  findings: PolicyFinding[];
  chain: ApprovalStepView[];
  payoutRecords: PayoutRecord[];
  policyPack: { id: string; name: string; version: number } | null;
  rateTable: { id: string; name: string; version: number; effectiveFrom: string } | null;
}

export interface ComputationPreview {               // previewItemComputation result — never persisted
  kind: 'per-diem' | 'mileage';
  breakdown: ComputationBreakdown;                   // 07a shape, verbatim render contract (06)
  applicable: boolean;                               // false when no rate row is effective on the item date
  nearestEffectiveTable?: { id: string; name: string; effectiveFrom: string };   // offered, never silent fallback
  routePreview?: { levels: { thresholdAmount: number; approverNames: string[] }[] };   // CP-4.3 matrix preview (same engine)
}

export interface ExtractionJobResult {
  receiptAssetId: string;
  draftId: string;
  partial: boolean;                                  // mid-run failure keeps completed fields, marked
  meteredUnitsCharged: number;                       // 1 per completed run; 0 for retried idempotent runs
}

export interface ApplyDraftResult {
  claimItemId: string;                               // created or completed receipt item
  applied: AppliedDraftRecord;                       // per-field confirmation audit (P15)
  claim: ClaimView;                                  // recomputed totals
}

export interface SubmitResult {
  claim: ClaimView;                                  // status 'submitted'; chain populated per 07c rule 6
  findingsComputed: { blocking: number; advisory: number };
  mode: 'deterministic';                             // the check engine's declaration, every time
}

export interface DecideResult {
  claim: ClaimView;
  advancedToLevel?: number;                          // approve at non-final level
  gateRefused?: { blockers: { findingId: string; kind: string; description: string }[] };   // named, linked — never generic
}

export interface RateTableSummary {
  id: string;
  name: string;
  currency: CurrencyCode;
  tierCount: number;
  mileageRateCount: number;
  effectiveFrom: string;
  effectiveTo?: string;
  version: number;
  status: 'active' | 'superseded';
  updatedAt: string;
}

export interface PolicyPackSummary {
  id: string;
  name: string;
  rateTableId: string;
  rateTableName: string;
  receiptRequiredAbove: number;
  submissionWindowDays: number;
  lateSeverity: 'advisory' | 'blocking';
  matrixRowCount: number;
  version: number;
  isActive: boolean;                                 // matches Workspace.activePolicyPackId
  updatedAt: string;
}

export interface MemberSummary {
  id: string;
  nameEn: string;
  nameAr: string;
  role: 'finance-admin' | 'approver' | 'employee';
  active: boolean;
}

export interface Job<T> {                            // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'export' | 'receipt-extraction';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                            // async-contract §5
  claimId?: string;                                  // link-to-context for the jobs console (04 S8)
}

// ---- Contract ----

export interface ExpenseClaimAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // claims (one queue surface, three role lenses — 04)
  listClaims(query: {
    lens: 'mine' | 'approvals' | 'finance';          // role-aware filter; 'finance' requires finance-admin (rule 5)
    filter?: {
      status?: ClaimStatusName[];
      claimantMemberId?: string;
      hasOpenFindings?: boolean;
      submittedAfter?: string; submittedBefore?: string;
    };
    search?: string;                                 // normalized bilingual search over reference/title/claimant (rtl-rules §4)
    sort: 'updatedAt' | 'submittedAt' | 'grandTotal';
    cursor?: string; limit: number;                  // virtualized queue: cursor pages <= 100
  }): Promise<Result<Page<ClaimSummary>, AdapterError>>;
  getClaim(id: string): Promise<Result<ClaimView, AdapterError>>;
  createClaim(input: {
    title: string;
    purpose?: string;
    tripStart?: string;
    tripEnd?: string;
  }): Promise<Result<ClaimView, AdapterError>>;      // draft; currency + pack read from workspace at creation (07a)
  updateClaim(id: string, patch: {
    title?: string;
    purpose?: string;
    tripStart?: string;
    tripEnd?: string;
    baseVersion: number;                             // stale -> CONFLICT with both payloads
  }): Promise<Result<ClaimView, AdapterError>>;      // rejected-claim edits reopen the draft (CP-3.6); paid claims refuse (rule 8)

  // claim items (the composer loop — CP-1)
  addClaimItem(input: {
    claimId: string;
    kind: 'receipt' | 'per-diem' | 'mileage';
    description?: string;
    inputs: ReceiptItemInputs | PerDiemItemInputs | MileageItemInputs;   // discriminated by kind
    receiptAssetId?: string;                         // optional pre-captured receipt from the claim bin
  }): Promise<Result<ClaimView, AdapterError>>;      // computed amounts + breakdown per 07c; draft claims only (rule 8)
  updateClaimItem(itemId: string, patch: {
    description?: string;
    inputs?: ReceiptItemInputs | PerDiemItemInputs | MileageItemInputs;
    baseRevision: number;                            // stale -> CONFLICT
  }): Promise<Result<ClaimView, AdapterError>>;      // per-diem/mileage recompute live; findings recompute on the item (07c rule 7)
  removeClaimItem(itemId: string): Promise<Result<ClaimView, AdapterError>>;   // undo window is UI-side (P03); receipt stays in the bin
  previewItemComputation(input: {
    claimId: string;                                 // preview binds to the claim's pinned (or workspace-active) table
    kind: 'per-diem' | 'mileage';
    inputs: PerDiemItemInputs | MileageItemInputs;
    rateTableId?: string;                            // studio preview against a draft table (CP-4.3)
    sampleAmountForRoute?: number;                   // matrix route preview alongside (one engine, two surfaces)
  }): Promise<Result<ComputationPreview, AdapterError>>;   // pure function — never persists (07c rule 2)

  // receipts & the OCR assist (conditionally-AI — CP-2)
  attachReceipt(input: {
    claimId: string;
    itemId?: string;                                 // or the claim bin when omitted
    capture: 'photo' | 'paste' | 'file-upload';
    payload: string;                                 // data reference for the abstract storage capability (never a URL in UI state)
    label?: string;
    idempotencyKey: string;                          // async-contract §5
  }): Promise<Result<{ receiptAssetId: string; script: 'ar' | 'en' | 'mixed' }, AdapterError>>;
  extractReceiptDraft(input: {
    receiptAssetId: string;
    idempotencyKey: string;                          // retried run returns the original draft — never double-metered
  }): Promise<Result<Job<ExtractionJobResult>, AdapterError>>;
  // ^ THE conditionally-AI operation: proposes fields with confidence bands;
  //   unbound capability -> PERMISSION naming the capability class with the
  //   manual path offered inline (LOOP-5); metered per P14 (getUsage).
  applyReceiptDraft(input: {
    draftId: string;
    itemId?: string;                                 // creates the receipt item when omitted (CP-2.4)
    fields: { field: OcrDraftField['field']; appliedValue: string; edited: boolean }[];   // the human-confirmed set — P15
  }): Promise<Result<ApplyDraftResult, AdapterError>>;   // writes ONLY confirmed fields; drafts never auto-apply

  // submission, findings, decisions (the pipeline — CP-3)
  submitClaim(input: {
    claimId: string;
    idempotencyKey: string;                          // double-submit never double-routes
  }): Promise<Result<SubmitResult, AdapterError>>;   // computes findings + route per 07c rules 3–7; empty claim -> VALIDATION
  withdrawClaim(claimId: string): Promise<Result<ClaimView, AdapterError>>;   // refused after first approval (rule 9)
  runPolicyCheck(claimId: string): Promise<Result<ClaimView & { mode: 'deterministic' }, AdapterError>>;
  // ^ explicit re-check after fixes (CP-3.4); findings also compute at submit
  //   and live on item edits — same rules, three triggers (07c rule 7)
  listPolicyFindings(query: {
    claimId: string;
    filter?: { severity?: ('blocking' | 'advisory')[]; state?: ('open' | 'resolved')[]; kind?: PolicyFinding['kind'][] };
    sort: 'severity' | 'computedAt' | 'itemId';
    cursor?: string; limit: number;
  }): Promise<Result<Page<PolicyFinding>, AdapterError>>;
  resolvePolicyFinding(input: {
    findingId: string;
    resolution: FindingResolution;                   // 07a union — reason REQUIRED for 'override'
  }): Promise<Result<PolicyFinding, AdapterError>>;  // resolving an already-resolved finding -> CONFLICT with current state
  decideClaim(input: {
    claimId: string;
    kind: 'approve' | 'reject' | 'query';
    comment?: string;                                // REQUIRED for 'reject' -> VALIDATION without it
    query?: { question: string };                    // routed to the claimant (02 Huda's thread)
    idempotencyKey: string;                          // double-tap approve never double-advances
  }): Promise<Result<DecideResult, AdapterError>>;
  // ^ approve with unresolved blocking findings -> VALIDATION whose details
  //   name every blocker (the gate — rule 4); approve at final level sets
  //   'approved'; non-final approve advances the chain; reject sets
  //   'rejected' with per-step reasons; query sets 'queried' without unsubmitting.
  reassignApprovalStep(input: {
    stepId: string;
    toMemberId: string;
    note?: string;
  }): Promise<Result<ClaimView, AdapterError>>;      // delegation provenance recorded on the step (07a)

  // payout (the no-ERP evidence — CP-5)
  recordPayout(input: {
    claimId: string;
    method: string;                                  // must be one of Workspace.payoutMethods
    reference: string;
    amount: number;                                  // canonical minor units, as actually paid
    paidOn: string;
    correction?: { supersedesRecordId: string; reason: string };   // REQUIRED pair — corrections append (07a)
    idempotencyKey: string;                          // double-submit never double-records money
  }): Promise<Result<{ payoutRecord: PayoutRecord; claim: ClaimView }, AdapterError>>;

  // policy studio (finance-admin only — rule 5)
  listRateTables(query: {
    filter?: { status?: ('active' | 'superseded')[]; effectiveOn?: string };
    sort: 'effectiveFrom' | 'updatedAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<RateTableSummary>, AdapterError>>;
  getRateTable(id: string): Promise<Result<RateTable, AdapterError>>;   // read-only citation drill-through for approvers too (CP-3.3)
  saveRateTable(input: {
    table: Omit<RateTable, 'version' | 'createdAt' | 'updatedAt' | 'status'> & { id?: string };
    baseVersion?: number;                            // stale -> CONFLICT with both payloads
  }): Promise<Result<RateTable, AdapterError>>;      // overlap/gap/zero/currency VALIDATION per 07c rule 9
  listPolicyPacks(query: {
    filter?: { activeOnly?: boolean };
    sort: 'updatedAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<PolicyPackSummary>, AdapterError>>;
  savePolicyPack(input: {
    pack: Omit<PolicyPack, 'version' | 'createdAt' | 'updatedAt'> & { id?: string; activate?: boolean };
    baseVersion?: number;                            // stale -> CONFLICT
  }): Promise<Result<PolicyPackSummary, AdapterError>>;   // matrix-integrity VALIDATION (row order, duplicate thresholds, empty approver lists — 07c rule 9); activation switches the workspace pin + logs the diff
  listMembers(query: {
    filter?: { role?: ('finance-admin' | 'approver' | 'employee')[]; activeOnly?: boolean };
    search?: string;                                 // normalized bilingual name search
    cursor?: string; limit: number;
  }): Promise<Result<Page<MemberSummary>, AdapterError>>;

  // export & platform
  exportClaimPackage(input: {
    scope: { claimId: string } | { period: { from: string; to: string } };
    formats: ('claim-ledger' | 'receipts-manifest' | 'findings-report' | 'approval-trail' | 'payout-records')[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;                                     // delivery-scoped; never carries claim data in query strings (07a no-leak rule)
    expiresAt: string;
    regenerable: boolean;
    formats: ('claim-ledger' | 'receipts-manifest' | 'findings-report' | 'approval-trail' | 'payout-records')[];
  }, AdapterError>>;
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; claimId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    receiptExtractions: { used: number; included: number; resetAt: string };   // the metered AI capability (P14)
    exportPackages: { used: number; included: number; resetAt: string };
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;                           // chrome direction default; either direction is a full citizen (05)
  currency: CurrencyCode;                          // the one currency claims are paid in (v1 boundary)
  activePolicyPackId: string;                      // new claims pin this pack's current version at submission
  payoutMethods: string[];                         // workspace-configured disbursement methods (e.g. bank transfer, cash)
  createdAt: string;
  updatedAt: string;
}
export type MemberRole = 'finance-admin' | 'approver' | 'employee';
export interface Member {
  id: string;
  workspaceId: string;
  nameEn: string;                                   // bilingual sibling fields — rendered at their own direction
  nameAr: string;
  email: string;
  role: MemberRole;                                 // finance-admin: studio writes + payouts; approver: decide/reassign; employee: claim
  active: boolean;                                  // deactivation keeps names on every historical record (no deletion)
  createdAt: string;
}

// ---- Rate tables (the localized rules, effective-dated and versioned) ----
export interface PerDiemTier {
  id: string;
  nameEn: string;                                   // destination tier, bilingual (e.g. "Dubai — regional travel")
  nameAr: string;
  dailyAmount: number;                              // canonical minor units, workspace currency
}
export interface MileageRate {
  id: string;
  vehicleClass: 'own-car' | 'motorcycle' | 'other-own-vehicle';
  perUnitAmount: number;                            // canonical minor units per km (distance unit is km, canonical)
}
export interface RateTable {
  id: string;
  workspaceId: string;
  name: string;                                     // e.g. "KSA Travel & Mileage 2026-H2"
  currency: CurrencyCode;                           // must equal Workspace.currency (v1 — VALIDATION otherwise)
  perDiemTiers: PerDiemTier[];
  mileageRates: MileageRate[];
  proration: {
    firstLastDayPercent: number;                    // e.g. 75 — the policy convention (labeled convention, never law)
    appliesTo: 'per-diem';                          // scope of the proration rule at v1
  };
  effectiveFrom: string;                            // ISO date — rates are dated data (IRS mid-year change pattern, 01)
  effectiveTo?: string;                             // exclusive end; overlap with same-scope table -> VALIDATION
  sourceNote: string;                               // REQUIRED honesty carrier: where the rates came from + "verify against current policy"
  version: number;                                  // claims and breakdowns pin the version they computed against
  status: 'active' | 'superseded';
  createdAt: string;
  updatedAt: string;
}

// ---- Policy packs (rules + routing bound to a rate table) ----
export interface ApprovalMatrixRow {
  id: string;
  upToAmount: number;                               // canonical minor units; rows ordered ascending; gaps -> VALIDATION
  approverMemberIds: string[];                      // one or more members at this level
}
export interface PolicyPack {
  id: string;
  workspaceId: string;
  name: string;
  rateTableId: string;                              // the pack binds exactly one table
  receiptRequiredAbove: number;                     // receipt-kind items at/above this amount with no receipt -> blocking finding
  submissionWindowDays: number;                     // last item date -> submittedAt gap beyond this -> late-submission finding
  lateSeverity: 'advisory' | 'blocking';            // default advisory (12 Q-8)
  taxRequiredOnReceipts: boolean;                   // VAT-relevant receipt without tax -> 'tax-missing' advisory (ZATCA-class reality, 01)
  perDiemMealDoubleDip: boolean;                    // meals receipt inside a per-diem window -> advisory double-dip finding
  approvalMatrix: ApprovalMatrixRow[];              // routing per 07c rule 6
  version: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Claims & items ----
export type ClaimStatus =
  | 'draft' | 'submitted' | 'queried' | 'approved' | 'rejected' | 'paid';
export interface Claim {
  id: string;
  reference: string;                                // human reference "CLM-0142"; bidi-isolated Latin token
  workspaceId: string;
  claimantMemberId: string;
  title: string;
  purpose?: string;
  tripStart?: string;                               // ISO dates; trip window advisory context for dated items
  tripEnd?: string;
  status: ClaimStatus;
  currency: CurrencyCode;                           // mirrors workspace currency at creation
  policyPackId?: string;
  policyPackVersion?: number;                       // pinned at submission; findings name it (never retro-mutated)
  totals: {                                         // derived at read — never authoritative storage
    items: number;
    receiptTotal: number;                           // canonical minor units
    perDiemTotal: number;
    mileageTotal: number;
    grandTotal: number;
  };
  submittedAt?: string;
  rejectedReasons?: { stepLevel: number; actorMemberId: string; reason: string; at: string }[];
  createdAt: string;
  updatedAt: string;
  version: number;                                  // optimistic concurrency for header edits
}
export type ClaimItemKind = 'receipt' | 'per-diem' | 'mileage';
export interface ComputationBreakdown {             // the inspectable arithmetic (rendered verbatim by ComputationBreakdownCard)
  kind: 'per-diem' | 'mileage';
  rateTableId: string;
  rateTableVersion: number;
  rateTableName: string;
  effectiveFrom: string;
  rows: { label: string; quantity: number; unitAmount: number; lineAmount: number }[];  // tabular-figures render
  prorationPercent?: number;                        // per-diem rows carry 100 or the pack's first/last percent
  citation: { tierName?: string; vehicleClass?: string; perUnitAmount: number; unit: 'day' | 'km' };
  computedAmount: number;                           // canonical minor units — the ONLY authoritative amount
}
export interface ReceiptItemInputs {
  vendorName: string;                               // either script; bidi-isolated at render
  itemDate: string;                                 // ISO date
  amount: number;                                   // claimant-confirmed amount (manual or post-apply), canonical minor units
  taxAmount?: number;
  receiptNumber?: string;                           // duplicate detection key component
  expenseCategory?: 'meals' | 'travel' | 'office' | 'client' | 'other';
}
export interface PerDiemItemInputs {
  tierId: string;                                   // resolves against the pinned rate table
  dateFrom: string;                                 // inclusive
  dateTo: string;                                   // inclusive
  firstDayProrated: boolean;                        // claimant flags travel days; >2 prorated days -> VALIDATION
  lastDayProrated: boolean;
}
export interface MileageItemInputs {
  vehicleClass: MileageRate['vehicleClass'];
  distanceKm: number;                               // canonical unit km; mile entry converts at input, display-only
  fromPlace: string;                                // free text — no routing, no booking (LOOP-10)
  toPlace: string;
  itemDate: string;
}
export interface ClaimItem {
  id: string;
  claimId: string;
  kind: ClaimItemKind;
  description?: string;
  inputs: ReceiptItemInputs | PerDiemItemInputs | MileageItemInputs;   // discriminated by kind
  computedAmount: number;                           // receipt: inputs.amount; per-diem/mileage: ComputationBreakdown.computedAmount
  breakdown?: ComputationBreakdown;                 // present for per-diem and mileage kinds
  receiptAssetId?: string;                          // receipt-kind items: the attached evidence
  revision: number;                                 // CONFLICT base for updateClaimItem
  createdAt: string;
  updatedAt: string;
}

// ---- Receipts & the extraction draft (the conditionally-AI surface) ----
export type ReceiptCapture = 'photo' | 'paste' | 'file-upload';
export type ReceiptScript = 'ar' | 'en' | 'mixed';
export interface ReceiptAsset {
  id: string;
  claimId: string;
  claimItemId?: string;                             // attached to an item, or claim-bin pending assignment
  capture: ReceiptCapture;
  script: ReceiptScript;                            // detection result; preview renders at this direction (05)
  label?: string;                                   // optional claimant note
  ocrState: 'none' | 'draft' | 'applied' | 'failed';
  createdAt: string;
}
export type OcrConfidence = 'high' | 'medium' | 'low';
export interface OcrDraftField<T = string> {
  field: 'vendorName' | 'itemDate' | 'amount' | 'taxAmount' | 'receiptNumber';
  value: T;                                         // proposed value; amounts canonical minor units, dates ISO
  rawText: string;                                  // verbatim from the receipt (Arabic-Indic digits preserved here)
  confidence: OcrConfidence;
  region?: { x: number; y: number; w: number; h: number };   // normalized image rect — the evidence anchor
}
export interface OcrDraft {
  id: string;
  receiptAssetId: string;
  script: ReceiptScript;
  fields: OcrDraftField[];
  partial: boolean;                                 // true when the run failed mid-way; fields present are kept and marked
  mode: 'assist-draft';                             // every draft is a PROPOSAL — never an authoritative write
  createdAt: string;
}
export interface AppliedDraftRecord {                // audit trail of the human confirmation (P15)
  draftId: string;
  appliedFields: { field: OcrDraftField['field']; proposedValue: string; appliedValue: string; edited: boolean }[];
  actorMemberId: string;
  at: string;
}

// ---- Policy findings (deterministic — 07c rules) ----
export type FindingKind =
  | 'missing-receipt' | 'duplicate-receipt' | 'cross-claim-duplicate'
  | 'late-submission' | 'per-diem-double-dip' | 'tax-missing';
export type FindingSeverity = 'blocking' | 'advisory';
export interface FindingResolution {
  action:
    | 'edit-resolved'                // item changed; rule recomputed and now passes (never hand-set)
    | 'override'                     // accepted with reason — REQUIRED, logged, exported
    | 'false-positive';              // rule inputs recorded for policy review
  reason?: string;                   // REQUIRED for 'override'
  actorMemberId: string;
  at: string;
}
export interface PolicyFinding {
  id: string;
  claimId: string;
  claimItemId?: string;              // late-submission is claim-scoped; others item-scoped
  kind: FindingKind;
  severity: FindingSeverity;         // mirrors the policy pack at computation time
  state: 'open' | 'resolved';
  resolution?: FindingResolution;    // present iff state = 'resolved'
  detail: {
    measured?: string;               // human-readable measured value (e.g. "SAR 240.00 with no receipt")
    required?: string;               // the rule's requirement (e.g. "receipt required above SAR 75.00")
    policyPackVersion: number;       // computed against this pin — never retro-mutated
    siblingClaimRef?: string;        // cross-claim-duplicate: the other claim's reference
    siblingItemIds?: string[];       // duplicate-receipt / double-dip: the sibling items in this claim
  };
  computedAt: string;
}

// ---- Approval chain ----
export type ApprovalStepState = 'pending' | 'approved' | 'rejected' | 'reassigned';
export interface ApprovalStep {
  id: string;
  claimId: string;
  level: number;                     // 1..n ascending by matrix threshold
  thresholdAmount: number;           // the matrix row's upToAmount that created this step
  approverMemberId: string;
  state: ApprovalStepState;
  decision?: {
    kind: 'approve' | 'reject' | 'query';
    comment?: string;                // REQUIRED for 'reject'; query carries the question
    actorMemberId: string;
    at: string;
  };
  delegation?: { fromMemberId: string; toMemberId: string; note?: string; at: string };
  decidedAt?: string;
}

// ---- Payout (the no-ERP manual evidence) ----
export interface PayoutRecord {
  id: string;
  claimId: string;
  method: string;                    // one of Workspace.payoutMethods
  reference: string;                 // transfer/batch number as typed
  amount: number;                    // canonical minor units, as actually paid
  paidOn: string;                    // ISO date
  actorMemberId: string;
  supersedesRecordId?: string;       // corrections APPEND — never rewrite (07a obligation)
  supersededByRecordId?: string;
  correctionReason?: string;         // REQUIRED when supersedesRecordId is set
  createdAt: string;
}

// ---- Async jobs, exports, activity ----
export type JobKind = 'export' | 'receipt-extraction';
export type ExportFormat = 'claim-ledger' | 'receipts-manifest' | 'findings-report' | 'approval-trail' | 'payout-records';
export interface ExportArtifact {
  id: string;
  scopeClaimId?: string;             // per-claim export
  scopePeriod?: { from: string; to: string };        // or per-period (month/quarter)
  formats: ExportFormat[];           // per-format partial + retry (async-contract §4)
  expiresAt: string;                 // declared retention window at creation
  regenerable: boolean;              // deterministic from claim state — always true in v1
}
export interface ActivityEntry {      // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'claim-created' | 'item-added' | 'item-edited' | 'item-removed'
    | 'receipt-attached' | 'draft-extracted' | 'draft-applied' | 'draft-discarded'
    | 'claim-submitted' | 'claim-withdrawn' | 'claim-rejected' | 'claim-resubmitted'
    | 'finding-resolved' | 'step-approved' | 'step-rejected' | 'query-answered'
    | 'step-reassigned' | 'payout-recorded' | 'payout-corrected'
    | 'rate-table-saved' | 'policy-pack-saved' | 'pack-activated' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                   // override reasons, delegation notes, activation diffs — provenance audit
  at: string;
}

