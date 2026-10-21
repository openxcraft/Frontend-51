# 07a — Data Contract: procurement-approval-chain

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — no operation generates, scores, or transforms content by model; routing is arithmetic over banded rules, budget checking is integer subtraction against declared envelopes, quote comparison is ordering and deltas. The specs must not and do not leak AI affordances (00 LOOP-10). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
// ---- Primitives ----
export type Locale = 'ar' | 'en';
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
export type RuleScope =
  | { kind: 'workspace-default' }
  | { kind: 'cost-center'; costCenterId: string }
  | { kind: 'category'; categoryId: string };
// Precedence at routing: category > cost-center > workspace-default (07c rule 3).
// Two rules with the exact same scope are refused at authoring (03 CP-4 edge).

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
export type RequestStatus =
  | 'draft' | 'in-review' | 'approved' | 'rejected'
  | 'returned' | 'withdrawn' | 'cancelled-after-approval';

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

export type BudgetState = 'within' | 'approaching' | 'over' | 'no-envelope';

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

export type StepState = 'queued' | 'awaiting' | 'approved' | 'rejected' | 'returned';

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
export type JobKind = 'export-request-package' | 'export-audit-register';
export type JobState = 'queued' | 'running' | 'awaiting-input' | 'succeeded'
  | 'failed' | 'cancelled' | 'expired';

export type ExportFormat = 'document' | 'ledger';
// 'document': the paper-shaped approval package / audit register (PDF class)
// 'ledger': the row-shaped evidence (lines, quotes, deltas, activity) for accounting desks

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
```

## Relationships

Workspace 1—1 ApprovalMatrix (versioned aggregate) · Workspace 1—1 PolicyPack (versioned; owns CategoryRef list) · Workspace 1—N Member / Position / Delegation / CostCenter / Vendor / BudgetEnvelope · Position N—M Member (assigneeMemberIds) · Position 1—N Delegation (holder-scoped) · BudgetEnvelope keyed (costCenterId × categoryId × period) — no two envelopes share the full key · PurchaseRequest N—1 Member (requester) / CostCenter / Category · PurchaseRequest 1—N RequestLine · PurchaseRequest 1—N VendorQuote (each N—1 Vendor) · QuoteComparison derived 1—1 over the live quote set · PurchaseRequest 1—N ApprovalChain (versions; exactly one current unless draft) · ApprovalChain 1—N ChainStep · ChainStep 0..1—1 Decision · ApprovalChain 1—1 BudgetCheckSnapshot (pinned evidence) · Job 1—N ExportArtifact · ActivityEntry spans every consequential mutation.

## Operations (summary; typed signatures in 07b)

Session: getSession. Requests: createDraftRequest, updateRequest, addQuote, updateQuote, removeQuote, selectQuote, previewRouting, submitRequest, listRequests, getRequest, resubmitRequest, withdrawRequest, cancelApprovedRequest, decideStep. Register surfaces: listActivity, exportRequestPackage, exportAuditRegister, listJobs, getArtifact. Policy: getApprovalMatrix, saveApprovalRule, removeApprovalRule, getPolicyPack, savePolicyPack, listBudgetEnvelopes, saveBudgetEnvelope. Org: listPositions, savePosition, setDelegation, clearDelegation. Reference: listCostCenters, saveCostCenter, listVendors, saveVendor. **35 operations — exactly the 03 coverage table; zero orphans, zero phantoms.**

## State obligations (lifecycle invariants)

- **The register is append-only**: no request-deletion operation exists at v1; withdrawal, rejection, and cancellation-after-approval are recorded states; codes are sequential and never reused. History is the audit surface (P17).
- **Chain versions are immutable**: resubmission computes v(n+1) and preserves every prior version read-only beneath the edit surface (03 CP-3); decisions never edit — correction is a new recorded decision (P03 deviation on authority acts).
- **In-flight chains complete under their pinned matrix version**; new submissions route under the latest (03 CP-4 edge). Matrix and policy-pack saves append versions; they never mutate chains already computing.
- **Commitments are always derived, never stored stale**: every envelope read recomputes committed = Σ totals of requests in `in-review` or `approved` status keyed to the envelope's (cost center, category, period); returned / rejected / withdrawn / cancelled-after-approval requests release (03 CP-3 recovery).
- **Budget snapshots are pinned evidence**: each chain version carries the snapshot computed at its submission; envelope edits never rewrite recorded evidence, only future projections.
- **Self-approval is impossible by construction**: eligible deciders = (position assignees ∪ delegates with an active window) minus the requester (07c rule 4); a submission whose chain resolves to zero eligible deciders on any step is refused with the position named (03 CP-1 failure, CP-2 edge).
- **Exactly one selected quote on a submitted request**, and a selected quote whose total exceeds the minimum requires a non-empty justification (07c rules 6–8); quote-count policy gates apply above the policy threshold with the sole-source exception recorded.
- **Bilingual by construction**: request titles, line descriptions, vendor names, position titles, and cost-center names are authored in both locales (both required at submit/save); no operation auto-translates or fabricates the other side; rendering is per-side direction with bidi isolation (rtl-rules §2).
- **Money is integer minor units end to end**: quantities are positive integers, unit prices integer minor units; all totals, deltas, projections, and thresholds are exact integer arithmetic (07c rule 1); display formatting (separators, currency naming per locale) is presentation only.
- **Declared non-AI**: no field in this contract is model-generated; every routing decision, budget finding, and quote delta is recomputable from declared inputs — the audit-facing property the whole product stakes (00).
