# 07b — Adapter Contract: waqf-endowment-registry (TypeScript, v1)

SME-G pass · `WaqfRegistryAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session, idempotency keys, partial-result policies. **AI declaration (ai-native-patterns §1): declared non-AI — deterministic distribution ledger.** There is no AI operation on this interface; allocation, ratios, reports, and seals are arithmetic and state machines, and no binding may add a "smart" side door (rule 2). Types only — no implementation. Entity semantics (Workspace, Endowment, Asset, Beneficiary, DistributionPolicy, LedgerEntry, Allocation, AllocationLine, Distribution, Report, ExportArtifact, Job, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
// Single contract surface. Entity types referenced below are declared
// canonically in 07a and are part of this contract by reference; 07b declares
// only the operational wrappers (summaries, views, jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (one-script deed fields, share-sum overflow, policy ranges, allocation gates)
 * 'NOT_FOUND'    -> NotFoundError     (stale endowment/entry/allocation/report/artifact links, voided lines)
 * 'PERMISSION'   -> PermissionError   (viewer seats, owner-only policy, workspace scoping)
 * 'CONFLICT'     -> ConflictError     (concurrent metadata/policy/line edits, seal-on-sealed, delivery on voided lines)
 * 'RATE_LIMIT'   -> RateLimitError    (export window, ledger import window)
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
  details?: Record<string, string[]>;
}

export interface Session {
  memberId: string;
  workspaceId: string;
  role: 'owner' | 'administrator' | 'viewer';   // viewer: read + export, no ledger mutations (02 Yasmin/Dr. Yaqub)
  locale: 'ar' | 'en';                           // workspace default 'ar' (bilingual-ar, 05)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export interface EndowmentSummary {
  id: string;
  title: { en: string; ar: string };
  kind: 'charitable' | 'family' | 'mixed' | 'religious';
  status: 'draft' | 'active' | 'dormant' | 'closed';
  counts: { assets: number; beneficiaries: number; ledgerEntries: number };
  unallocatedBalance?: { minorUnits: number; currency: string };
  latestAllocationId?: string;
  latestReportId?: string;
  updatedAt: string;
}

export interface AssetRow { id: string; endowmentId: string; name: { en: string; ar: string };
  kind: 'real-estate' | 'cash-placement' | 'corporate-share' | 'other';
  incomeMode: 'rental' | 'dividend' | 'yield' | 'one-off' | 'none';
  status: 'active' | 'retired'; version: number; }

export interface BeneficiaryRow { id: string; endowmentId: string; name: { en: string; ar: string };
  beneficiaryClass: 'individual' | 'family' | 'institution' | 'charitable';
  share: { numerator: number; denominator: number };
  eligibility: 'active' | 'suspended' | 'succeeded';
  successorBeneficiaryId?: string; isResidualHolder?: boolean; version: number; }

export interface PolicyView {
  id: string; endowmentId: string; version: number;
  adminCapPct: number; reservePct: number;
  residualRule: { mode: 'residual-beneficiary' | 'carry-forward' };
  period: 'monthly' | 'quarterly' | 'annual';
  minimumDistribution?: { minorUnits: number; currency: string };
}

export interface LedgerEntryRow {
  id: string; endowmentId: string; seq: number;
  kind: 'inflow' | 'expense' | 'distribution' | 'reversal';
  amount: { minorUnits: number; currency: string };
  period: string;
  assetId?: string; expenseKind?: 'administration' | 'maintenance' | 'other';
  beneficiaryId?: string; allocationId?: string; reversesEntryId?: string;
  evidence: { note: { en: string; ar: string }; documentRef?: string };
  recordedBy: string; recordedAt: string;
}

export interface AllocationView {
  id: string; endowmentId: string; period: string;
  state: 'draft' | 'committed' | 'voided';
  totals: {
    inflows: { minorUnits: number; currency: string };
    expenses: { minorUnits: number; currency: string };
    adminCapped: { minorUnits: number; currency: string };
    reserveApplied: { minorUnits: number; currency: string };
    distributable: { minorUnits: number; currency: string };
    remainder: { minorUnits: number; currency: string };
    remainderRule: { mode: 'residual-beneficiary' | 'carry-forward' };
  };
  lines: {
    id: string; beneficiaryId: string;
    share: { numerator: number; denominator: number };
    computedAmount: { minorUnits: number; currency: string };
    state: 'included' | 'held' | 'adjusted';
    adjustedAmount?: { minorUnits: number; currency: string };
    adjustmentReason?: string;
    delivered: 'pending' | 'delivered' | 'waived';
    deliveryEvidence?: { note: { en: string; ar: string }; deliveredAt: string; method: string };
  }[];
  // Derivation disclosure (the product's honesty surface): per-line arithmetic
  // shown in the worksheet — share × distributable — derived at read, never stored as prose.
  createdBy: string; createdAt: string;
}

export interface ReportSummary {
  id: string;
  scope: { endowmentId?: string };
  kind: 'transparency' | 'beneficiary-statement';
  period: string;
  beneficiaryId?: string;
  state: 'draft' | 'sealed';
  ratios: { adminRatio: number; distributionRatio: number };
  generatedAt: string; sealedAt?: string;
}

export interface Job<T> {
  id: string;
  kind: 'import' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface WaqfRegistryAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // endowments (the registry)
  listEndowments(query: {
    filter?: { status?: EndowmentSummary['status'][]; kind?: EndowmentSummary['kind'][] };
    search?: string;                    // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'createdAt' | 'titleAr';
    cursor?: string; limit: number;
  }): Promise<Result<Page<EndowmentSummary>, AdapterError>>;
  createEndowment(input: {
    title: { en: string; ar: string }; donorName: { en: string; ar: string };
    purpose: { en: string; ar: string }; kind: EndowmentSummary['kind'];
    deedRef: { number: string; registeredAtGregorian: string; registeredAtHijri?: string };
  }): Promise<Result<EndowmentSummary, AdapterError>>;
  getEndowment(id: string): Promise<Result<EndowmentSummary & {
    policy: PolicyView;
    deedRef: { number: string; registeredAtGregorian: string; registeredAtHijri?: string };
  }, AdapterError>>;
  updateEndowment(id: string, patch: {
    title?: { en: string; ar: string }; purpose?: { en: string; ar: string };
    kind?: EndowmentSummary['kind'];
    deedRef?: { number: string; registeredAtGregorian: string; registeredAtHijri?: string };
    baseVersion: number;
  }): Promise<Result<EndowmentSummary, AdapterError>>;
  setEndowmentStatus(id: string, status: 'active' | 'dormant' | 'closed', reason: string): Promise<Result<EndowmentSummary, AdapterError>>;

  // assets (the corpus — descriptive income metadata only; LOOP-10: no investment management)
  addAsset(input: {
    endowmentId: string; name: { en: string; ar: string };
    kind: AssetRow['kind']; incomeMode: AssetRow['incomeMode']; note?: string;
  }): Promise<Result<AssetRow, AdapterError>>;
  updateAsset(id: string, patch: {
    name?: { en: string; ar: string }; incomeMode?: AssetRow['incomeMode'];
    note?: string; status?: 'active' | 'retired'; baseVersion: number;
  }): Promise<Result<AssetRow, AdapterError>>;
  listAssets(query: {
    endowmentId: string; filter?: { kind?: AssetRow['kind'][]; status?: AssetRow['status'][] };
    sort: 'createdAt' | 'nameAr'; cursor?: string; limit: number;
  }): Promise<Result<Page<AssetRow>, AdapterError>>;

  // beneficiaries (the deed's own terms as data — shares are canonical fractions)
  addBeneficiary(input: {
    endowmentId: string; name: { en: string; ar: string };
    beneficiaryClass: BeneficiaryRow['beneficiaryClass'];
    share: { numerator: number; denominator: number };
    isResidualHolder?: boolean; note?: string;
  }): Promise<Result<BeneficiaryRow, AdapterError>>;
  updateBeneficiary(id: string, patch: {
    share?: { numerator: number; denominator: number };
    eligibility?: 'active' | 'suspended' | 'succeeded';
    successorBeneficiaryId?: string; note?: string;
    baseVersion: number;
  }): Promise<Result<BeneficiaryRow, AdapterError>>;
  listBeneficiaries(query: {
    endowmentId: string; filter?: { eligibility?: BeneficiaryRow['eligibility'][]; beneficiaryClass?: BeneficiaryRow['beneficiaryClass'][] };
    sort: 'createdAt' | 'nameAr'; cursor?: string; limit: number;
  }): Promise<Result<Page<BeneficiaryRow>, AdapterError>>;

  // distribution policy (versioned; allocations pin the version they ran)
  saveDistributionPolicy(input: {
    endowmentId: string; adminCapPct: number; reservePct: number;
    residualRule: { mode: 'residual-beneficiary' | 'carry-forward' };
    period: PolicyView['period']; minimumDistribution?: { minorUnits: number; currency: string };
  }): Promise<Result<PolicyView, AdapterError>>;
  getDistributionPolicy(endowmentId: string): Promise<Result<PolicyView, AdapterError>>;

  // ledger — inflows and expenses (the recorded truth the engine runs on)
  recordInflow(input: {
    endowmentId: string; assetId: string; period: string;
    amount: { minorUnits: number; currency: string };
    evidence: { note: { en: string; ar: string }; documentRef?: string };   // abstract storage ref (08 N1)
    idempotencyKey: string;                // async-contract §5 — double-submit never double-records
  }): Promise<Result<LedgerEntryRow, AdapterError>>;
  recordExpense(input: {
    endowmentId: string; assetId?: string; period: string;
    expenseKind: 'administration' | 'maintenance' | 'other';
    amount: { minorUnits: number; currency: string };
    evidence: { note: { en: string; ar: string }; documentRef?: string };
    idempotencyKey: string;
  }): Promise<Result<LedgerEntryRow, AdapterError>>;
  voidEntry(entryId: string, reason: string): Promise<Result<LedgerEntryRow, AdapterError>>;
  // ^ appends a reversal entry referencing the original — the ONLY correction grammar; never edits history.
  listLedgerEntries(query: {
    endowmentId?: string; filter?: {
      kind?: LedgerEntryRow['kind'][]; expenseKind?: LedgerEntryRow['expenseKind'][];
      period?: string; beneficiaryId?: string; allocationId?: string;
    };
    sort: 'seq' | 'recordedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<LedgerEntryRow>, AdapterError>>;
  importLedgerBatch(input: {
    endowmentId: string;
    rows: { assetId: string; period: string; amount: { minorUnits: number; currency: string };
      evidence: { note: { en: string; ar: string } }; expenseKind?: 'administration' | 'maintenance' | 'other' }[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ recorded: number; skipped: { row: number; reason: string }[] }>, AdapterError>>;

  // allocation — the deterministic engine (declared non-AI: pure arithmetic over entries × policy × shares)
  runAllocation(input: {
    endowmentId: string; period: string; idempotencyKey: string;
  }): Promise<Result<AllocationView, AdapterError>>;
  // ^ synchronous by design; budget-bound per 10-performance (<300ms seed scale). Same ledger state, same plan, every run.
  getAllocation(id: string): Promise<Result<AllocationView, AdapterError>>;
  updateAllocationLine(allocationId: string, lineId: string, patch: {
    state?: 'included' | 'held' | 'adjusted';
    adjustedAmount?: { minorUnits: number; currency: string };
    adjustmentReason?: string;              // REQUIRED when state is 'held' or 'adjusted' — recorded, never silent
    baseVersion: number;
  }): Promise<Result<AllocationView, AdapterError>>;
  recordDistribution(input: {
    allocationId: string;
    attestation: { note?: string };
    idempotencyKey: string;
  }): Promise<Result<{ distribution: { id: string; entryIds: string[]; committedAt: string };
    allocation: AllocationView }, AdapterError>>;
  // ^ the commit gate: draft -> committed, immutable entries appended, attestation logged (session actor).
  getDistribution(id: string): Promise<Result<{ distribution: { id: string; allocationId: string; endowmentId: string;
    period: string; entryIds: string[]; attestation: { by: string; at: string; note?: string }; committedAt: string };
    lines: AllocationView['lines'] }, AdapterError>>;
  recordDelivery(input: {
    distributionLineId: string;
    evidence: { note: { en: string; ar: string }; method: string };
    deliveredAt: string; idempotencyKey: string;
  }): Promise<Result<AllocationView['lines'][number], AdapterError>>;
  // ^ records THAT delivery happened (abstract channel, 08 N2). The product never moves money (LOOP-10).

  // reports — transparency artifacts (deterministic snapshots; the seal is one-way)
  generateReport(input: {
    scope: { endowmentId?: string };       // absent = workspace consolidation
    kind: 'transparency' | 'beneficiary-statement';
    period: string; beneficiaryId?: string;
    idempotencyKey: string;
  }): Promise<Result<ReportSummary, AdapterError>>;
  getReport(id: string): Promise<Result<ReportSummary & {
    ledgerPin: { lastSeqByEndowment: Record<string, number> };
    sections: {
      openingBalance: { minorUnits: number; currency: string };
      inflowsByAsset: { assetId: string; name: { en: string; ar: string }; amount: { minorUnits: number; currency: string } }[];
      expensesByKind: { expenseKind: string; amount: { minorUnits: number; currency: string } }[];
      distributionsByClass: { beneficiaryClass: string; amount: { minorUnits: number; currency: string }; beneficiaries: number }[];
      ratios: { adminRatio: number; distributionRatio: number };
      remainder: { amount: { minorUnits: number; currency: string }; destination: string };
      varianceVsPrior?: { period: string; inflowsDelta: number; distributionsDelta: number };
    };
  }, AdapterError>>;
  sealReport(id: string): Promise<Result<ReportSummary, AdapterError>>;
  // ^ draft -> sealed exactly once; pins ledger state; a sealed report is never recomputed or edited (07a invariants).
  exportReport(input: {
    reportId: string; format: 'bilingual-document' | 'ledger-csv' | 'print-bundle';
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  listActivity(query: {
    filter?: { endowmentId?: string; actorMemberId?: string; action?: string[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<{ id: string; actorMemberId: string; action: string; targetRef: string; detail?: string; at: string }>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    exports: number; imports: number;          // the only metered windows (12 Q-3)
    exportWindowLimit: number; importWindowLimit: number;
    resetAt: string;
  }, AdapterError>>;
}
```

## Rules (binding)

1. **Determinism contract**: `runAllocation` is a pure function over (ledger entries in period) × (pinned policy version) × (beneficiary register snapshot at run time). The same state yields the same totals and the same computed lines on every call; holds and adjustments are human state recorded on the draft with reasons (rule 3), and the computedAmount beside every adjustment stays visible — the derivation is never hidden.
2. **Non-AI closure**: the interface exposes no generation, inspection, clustering, or transformation operation; no binding may add one. There is no assist, no suggestion surface, no metered AI window — `getUsage` meters exports and imports only, and the UI never renders a sparkle glyph or a "smart" affordance (ai-native-patterns §1; enforced in 05/06).
3. **Recorded-never-silent adjustments**: `updateAllocationLine` REQUIRES `adjustmentReason` when state is 'held' or 'adjusted' — a VALIDATION error naming the missing reason fires otherwise; the committed distribution's entries carry adjusted amounts with the reason attached to the allocation line forever.
4. **Append-only ledger**: entries are immutable; `voidEntry` appends a reversal (reversesEntryId + reason required) and returns the REVERSAL row; a reversed entry keeps its place in history with a reversal mark; nothing is ever edited or deleted (07a invariant — the audit surface depends on it).
5. **Commit gate**: `recordDistribution` refuses (VALIDATION) an allocation whose state is not 'draft', and refuses when every line is held or removed (nothing to commit — the refusal names the held-line count); on success it appends one immutable distribution entry per included/adjusted line, records the attestation with the session actor, and the distribution is permanent — there is no un-record.
6. **Delivery is a record, not a payment**: `recordDelivery` requires the distribution line's parent distribution to exist and its entry to be live (delivery on a line whose expense was later reversed is allowed and the variance surfaces in the next report — history stays honest); delivery on a line from a voided allocation → CONFLICT naming the void.
7. **Seal is one-way**: `sealReport` on a sealed report → CONFLICT carrying the sealedAt timestamp; on success it pins `ledgerPin` (last seq per endowment) — the immutable evidence pin; regeneration after later entries creates a NEW draft report; a sealed report is never recomputed, never edited, never unsealed.
8. **Stale-version semantics**: `updateEndowment`, `updateAsset`, `updateBeneficiary`, `updateAllocationLine` with stale `baseVersion` → CONFLICT with both payloads in `details` (P10 conflict grammar).
9. **Share-sum gate**: `addBeneficiary`/`updateBeneficiary` refuse when the endowment's share sum would exceed 1 (the deed's whole) — VALIDATION naming the overflow fraction; a 'succeeded' beneficiary's share is never silently redistributed (the remainder rule carries what the deed recorded).
10. **Idempotency**: recordInflow/recordExpense/importLedgerBatch/runAllocation/recordDistribution/recordDelivery/generateReport/exportReport submits carry idempotency keys; a retried submit returns the original result — a double-submitted distribution never double-commits (async-contract §5).
11. **Partial-result policies**: import delivers recorded-so-far + named skipped rows (per-row retry); export delivers per-format artifacts with per-format retry (async-contract §4); allocation and report generation are atomic synchronous computations.
12. **Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass.**
