# 07a — Data Contract: expense-claim-flow

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — exactly one operation family touches a model capability: receipt extraction (`extractReceiptDraft`), which *proposes* per-field drafts with confidence bands and is confirm-gated per field by a human (`applyReceiptDraft`, P15) before anything writes. Every other computation in the product — per-diem and mileage arithmetic, policy findings, approval routing — is deterministic rule evaluation (07c). When the extraction capability is unbound, rate-limited, or failed, the manual-entry form is the same surface and the product loses no core workflow (08 degradation map). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type CurrencyCode = string;                 // ISO-4217-shaped code; v1: single currency per workspace (12 Q-5)

// ---- Workspace, members ----

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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: claims / formats / fields
  partial?: unknown;
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;            // async-contract §5 — double-submit never double-charges the meter
  claimId?: string;
}

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
```

## Relationships

Workspace 1—N Member · Workspace 1—N RateTable · Workspace 1—N PolicyPack · Workspace 1—N Claim · PolicyPack N—1 RateTable · Workspace 1—0..1 active PolicyPack (by id) · Claim N—1 Member (claimant) · Claim N—1 PolicyPack-at-version (pinned at submission) · Claim 1—N ClaimItem · ClaimItem 1—0..1 ReceiptAsset (receipt kind; bin-pending assets exist pre-assignment) · ReceiptAsset 0..N OcrDraft (re-runs idempotent per receipt) · OcrDraft 0..N AppliedDraftRecord · Claim 1—N PolicyFinding (item-scoped or claim-scoped) · Claim 1—N ApprovalStep (level-ordered chain) · Claim 1—N PayoutRecord (append-only, supersede-linked) · Claim 1—N ExportArtifact (directly or via period scope) · Job spans export/extraction work.

## State obligations

- **Determinism contract**: identical (item inputs, pinned rate-table version, pinned policy-pack version, claim state) always yields identical computed amounts, findings, and routes (07c). Computed amounts and findings are never hand-created or hand-closed: `edit-resolved` transitions are recomputed by the rule; every other resolution records actor and reason where required.
- **Version pinning**: per-diem/mileage breakdowns pin `rateTableVersion`; findings pin `policyPackVersion`; claims pin the pack at submission. Edits to tables/packs never retro-mutate computed history — the next computation uses the new version (audit honesty).
- **The approval gate**: `decideClaim` with kind 'approve' on a claim with unresolved blocking findings → refused with named blockers (07b rule 4). Approval at the final level sets status `approved`; reject sets `rejected` with per-step reasons; query sets `queried` without unsubmitting.
- **Self-approval guard**: a step whose approver is the claimant auto-reassigns to the next level; if none exists, submission refuses with VALIDATION.
- **Withdrawal window**: `withdrawClaim` succeeds only while zero steps are approved; after a first approval it is refused (the chain has begun).
- **Payout is append-only evidence**: corrections supersede with a required reason; no record is ever rewritten; the claim reaches `paid` on the first non-superseded record.
- **OCR drafts are proposals**: `ocrState` advances none → draft → applied (only via a human `applyReceiptDraft` confirmation) or → failed; drafts are never auto-applied, and a failed/partial draft leaves the manual form fully usable (08).
- **Partial-result policies** (async-contract §4): exports deliver per-format partial with per-format retry; extraction keeps completed fields and marks the draft partial on mid-run failure; nothing all-or-nothing except payout records (financial evidence is atomic per record).
- **No provider names anywhere** — the extraction capability appears as an abstract need (08 N1) with consent semantics in capability language; receipts and drafts never leak into URLs, logs, or notification payloads (credential-contract §7 discipline extended to claim evidence).
