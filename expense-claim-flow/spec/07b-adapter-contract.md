# 07b — Adapter Contract: expense-claim-flow (TypeScript, v1)

SME-G pass · `ExpenseClaimAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, Member, RateTable, PolicyPack, Claim, ClaimItem, ComputationBreakdown, ReceiptAsset, OcrDraft, AppliedDraftRecord, PolicyFinding, FindingResolution, ApprovalStep, PayoutRecord, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table — 30 operations, 0 orphans).

```ts
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
```

## Rules

1. **Determinism contract**: `previewItemComputation`, the computation inside `addClaimItem`/`updateClaimItem`, `submitClaim`'s findings, `runPolicyCheck`, and the approval routing implement exactly the rules specified in 07c — identical inputs (item inputs, pinned rate-table version, pinned pack version, claim state) yield identical amounts, findings, and routes. Every check result carries `mode: 'deterministic'`. No finding or computed amount is ever created or closed by hand: `edit-resolved` transitions are recomputed by the rule; all other resolutions record actor (+ reason where required) per 07a.
2. **Conditionally-AI boundary**: `extractReceiptDraft` is the only model-touching operation; it *proposes* per-field drafts and never writes claim state. `applyReceiptDraft` is the only path by which draft values reach an item, and it writes only the explicitly confirmed field set (P15). With the extraction capability unbound → PERMISSION naming the capability class in capability language with the manual path offered inline (LOOP-5, credential-contract §4) — and every core workflow (claim → approve → payout) completes without it (08).
3. **Stale-version semantics**: `updateClaim` (baseVersion), `updateClaimItem` (baseRevision), `saveRateTable`/`savePolicyPack` (baseVersion), and `resolvePolicyFinding` (finding already resolved by another seat) → CONFLICT with both payloads in `details`. `decideClaim`/`reassignApprovalStep` on an already-decided step → CONFLICT with the current chain state shown.
4. **The approval gate**: `decideClaim` with kind `'approve'` while blocking findings stand unresolved → VALIDATION whose `details.blockers` name every blocker (finding id, kind, one-line measured-vs-required description). No acknowledge-and-approve escape exists at the type level; blocking findings resolve only by edit (recomputed) or — where the pack permits — a recorded override with reason, which the export carries. Final-level approval sets `approved`; a query never unsubmits; a rejection records per-step reasons.
5. **Role capabilities**: studio writes (`saveRateTable`, `savePolicyPack`), the finance lens of `listClaims`, and `recordPayout` require `finance-admin` → PERMISSION naming the seat's capability otherwise. `decideClaim`/`reassignApprovalStep` require the session member to be the step's assignee (or its delegator) → PERMISSION otherwise. Claim mutations (`updateClaim`, `addClaimItem`, …) are the claimant's own — cross-member draft access → PERMISSION. `getRateTable` and read paths are open to all members (citation drill-through, CP-3.3).
6. **Consent enforcement**: `attachReceipt` with `capture: 'photo'` or payload writes through the abstract storage capability; `extractReceiptDraft` through the extraction capability — each without a granted consent → PERMISSION naming the capability class (kind, not vendor — credential-contract §2/§4). Paste-captured receipts and manual entry have no consent requirement, ever (LOOP-5).
7. **Idempotency & metering**: `attachReceipt`, `extractReceiptDraft`, `submitClaim`, `decideClaim`, `recordPayout`, and `exportClaimPackage` carry idempotency keys; a retried submit returns the original result (async-contract §5) — and a retried extraction is never double-metered (`meteredUnitsCharged: 0`). Progress is determinate in units (fields, claims, formats) — an indeterminate bar claiming percentage is a contract violation (async-contract §3).
8. **Lifecycle write guards**: item and header mutations apply to `draft` and `rejected` claims only (a rejected claim's edit reopens it to draft — CP-3.6); `submitted`/`queried` claims accept findings resolutions, decisions, receipt attachments that resolve findings, and delegation — not item edits (the chain reviews a pinned state; an item change after submission requires reject-and-resubmit, honestly). `paid` claims accept payout corrections and nothing else.
9. **Partial policies**: exports deliver per-format partial with per-format retry; extraction keeps completed fields and marks the draft `partial` on mid-run failure (ai-native-patterns §2 — partial is never silently promoted to complete); payout records are atomic per record (financial evidence).
10. **Payout append-only**: `recordPayout` with `correction` requires the `supersedesRecordId` + `reason` pair → VALIDATION otherwise; a second payout on a paid claim without correction semantics → CONFLICT; corrections supersede and never rewrite; the export carries both records with reasons.
11. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (30/30).
