// VERBATIM from specs-source/waqf-endowment-registry/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type BilingualText = { en: string; ar: string };      // authored both sides; never machine-filled
export type NumeralsPolicy = 'western-everywhere' | 'ar-indic-in-arabic-prose';  // ledger row: AR-indic OPTIONAL, Arabic prose contexts only

// Money is canonical: integer minor units + ISO currency code. Display is
// formatting (numeral system, grouping) and NEVER changes parsing semantics.
export interface Money { minorUnits: number; currency: string; }
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;                       // 'ar' — bilingual-ar product (05)
  numeralsPolicy: NumeralsPolicy;              // default 'western-everywhere' (12 Q-5)
  currency: string;                            // workspace-wide display currency for reports
  periodConvention: 'monthly' | 'quarterly' | 'annual';   // report cadence default
  hijriPresentation: 'ummalqura-disclosed';    // P24 dual-calendar; method disclosed in-product
  sampleLoaded: boolean;                       // seeded sample endowment (07c W-S)
}
export type EndowmentKind = 'charitable' | 'family' | 'mixed' | 'religious';
export type EndowmentStatus = 'draft' | 'active' | 'dormant' | 'closed';
export interface Endowment {
  id: string;
  workspaceId: string;
  title: BilingualText;                        // the deed's own title, both scripts required at activation
  donorName: BilingualText;                    // الواقف — the founder/donor
  purpose: BilingualText;                      // the deed's stated purpose (غرض الوقف)
  kind: EndowmentKind;
  deedRef: {                                   // the deed's identifiers as recorded
    number: string;                            // deed/court/registration number
    registeredAtGregorian: string;             // ISO date
    registeredAtHijri?: string;                // display-side per P24 (Umm al-Qura, disclosed)
  };
  status: EndowmentStatus;
  counts: { assets: number; beneficiaries: number; ledgerEntries: number };
  latestAllocationId?: string;
  latestReportId?: string;
  unallocatedBalance?: Money;                  // recorded inflows minus recorded expenses and distributions (derived at read)
  createdAt: string;
  updatedAt: string;
}
export type AssetKind = 'real-estate' | 'cash-placement' | 'corporate-share' | 'other';
export type IncomeMode = 'rental' | 'dividend' | 'yield' | 'one-off' | 'none';
export interface Asset {
  id: string;
  endowmentId: string;
  name: BilingualText;                         // "Building in Al-Naseem" / "عمارة في النسيم"
  kind: AssetKind;
  incomeMode: IncomeMode;                      // descriptive metadata only — LOOP-10: no investment management
  note?: string;
  status: 'active' | 'retired';                // retirement is recorded; history never edits
  version: number;
  createdAt: string;
}
export type BeneficiaryClass = 'individual' | 'family' | 'institution' | 'charitable';
export type EligibilityState = 'active' | 'suspended' | 'succeeded';
export interface Beneficiary {
  id: string;
  endowmentId: string;
  name: BilingualText;
  beneficiaryClass: BeneficiaryClass;
  share: { numerator: number; denominator: number };   // deed fraction, e.g. 1/8 — canonical, display-formatted
  eligibility: EligibilityState;               // 'succeeded' = deceased, successor linked; distributions hold
  successorBeneficiaryId?: string;             // set when eligibility = 'succeeded'
  isResidualHolder?: boolean;                  // the deed's designated remainder destination
  note?: string;                               // e.g. deed condition recorded verbatim
  version: number;
  createdAt: string;
}
export interface DistributionPolicy {
  id: string;
  endowmentId: string;
  version: number;                             // pinned by allocations; edits version-forward
  adminCapPct: number;                         // 0–25 ceiling on administration expenses vs period inflows
  reservePct: number;                          // 0–20 held back from distribution
  residualRule: { mode: 'residual-beneficiary' | 'carry-forward' };
  period: 'monthly' | 'quarterly' | 'annual';
  minimumDistribution?: Money;                 // below this, distributable carries forward instead
  updatedAt: string;
}
export type EntryKind = 'inflow' | 'expense' | 'distribution' | 'reversal';
export type ExpenseKind = 'administration' | 'maintenance' | 'other';
export interface LedgerEntry {
  id: string;
  endowmentId: string;
  seq: number;                                 // append-only per endowment: seq = last + 1 (07c rule)
  kind: EntryKind;
  amount: Money;                               // positive minor units; kind carries the direction
  period: string;                              // 'YYYY-MM' — the reporting period the entry belongs to
  assetId?: string;                            // inflows: the asset that earned it
  expenseKind?: ExpenseKind;                   // expenses only
  beneficiaryId?: string;                      // distribution lines only
  allocationId?: string;                       // distribution entries: the committed allocation
  reversesEntryId?: string;                    // reversals only — the entry being reversed, with reason
  evidence: { note: BilingualText; documentRef?: string };  // abstract storage reference (08 N1)
  recordedBy: string;                          // memberId
  recordedAt: string;
  // Ledger entries are IMMUTABLE after commit. Corrections append a reversal
  // entry that references the original (reason required). There is no edit,
  // no delete, and no overwrite anywhere in the ledger grammar.
}
export type AllocationLineState = 'included' | 'held' | 'adjusted';
export interface AllocationLine {
  id: string;
  allocationId: string;
  beneficiaryId: string;
  share: { numerator: number; denominator: number };   // snapshot of the beneficiary's share at run time
  computedAmount: Money;                       // distributable × share — the engine's arithmetic, disclosed
  state: AllocationLineState;
  adjustedAmount?: Money;                      // present when state = 'adjusted'
  adjustmentReason?: string;                   // required when held or adjusted — recorded, never silent
  delivered: 'pending' | 'delivered' | 'waived';
  deliveryEvidence?: { note: BilingualText; deliveredAt: string; method: string };  // abstract channel record (08 N2)
}
export interface Allocation {
  id: string;
  endowmentId: string;
  period: string;                              // 'YYYY-MM'
  state: 'draft' | 'committed' | 'voided';
  inputs: {
    inflowEntryIds: string[];                  // the exact entries the arithmetic ran over
    expenseEntryIds: string[];
    policyVersion: number;                     // pinned policy snapshot
    beneficiaryVersions: Record<string, number>;
  };
  totals: {
    inflows: Money;
    expenses: Money;
    adminCapped: Money;                        // administration expenses AFTER policy cap applied
    reserveApplied: Money;                     // policy reserve withheld
    distributable: Money;                      // inflows − adminCapped − maintenance/other − reserve
    remainder: Money;                          // rounding residue + the deed's unassigned share mass (+ carry-forward mass when below minimum); held amounts stay unallocated, never remainder
    remainderRule: DistributionPolicy['residualRule'];
  };
  lines: AllocationLine[];
  createdBy: string;
  createdAt: string;
}
export interface Distribution {                // the committed artifact of an allocation
  id: string;
  allocationId: string;
  endowmentId: string;
  period: string;
  entryIds: string[];                          // immutable ledger entries (one per included/adjusted line)
  attestation: { by: string; at: string; note?: string };   // the human commit gate
  committedAt: string;
}
export type ReportKind = 'transparency' | 'beneficiary-statement';
export interface Report {
  id: string;
  workspaceId: string;
  scope: { endowmentId?: string };             // absent = workspace-wide consolidation
  kind: ReportKind;
  period: string;
  beneficiaryId?: string;                      // beneficiary-statement only
  state: 'draft' | 'sealed';                   // seal is one-way (07c rule)
  ledgerPin: { lastSeqByEndowment: Record<string, number> };  // immutable evidence pin
  sections: {
    openingBalance: Money;
    inflowsByAsset: { assetId: string; name: BilingualText; amount: Money }[];
    expensesByKind: { expenseKind: ExpenseKind; amount: Money }[];
    distributionsByClass: { beneficiaryClass: BeneficiaryClass; amount: Money; beneficiaries: number }[];
    ratios: { adminRatio: number; distributionRatio: number };  // admin expenses / inflows; distributions / inflows
    remainder: { amount: Money; destination: string };
    varianceVsPrior?: { period: string; inflowsDelta: number; distributionsDelta: number };
  };
  generatedAt: string;
  sealedAt?: string;                           // set by sealReport; a sealed report is an immutable snapshot
}
export type JobKind = 'import' | 'export';
export interface ExportArtifact {
  id: string;
  reportId: string;
  format: 'bilingual-document' | 'ledger-csv' | 'print-bundle';
  expiresAt: string;                // declared retention window at creation
  regenerable: boolean;
}
export interface ActivityEntry {    // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'endowment-created' | 'endowment-status-changed' | 'asset-added' | 'asset-retired'
    | 'beneficiary-added' | 'beneficiary-updated' | 'policy-saved' | 'entry-recorded'
    | 'entry-reversed' | 'allocation-run' | 'allocation-line-changed' | 'distribution-recorded'
    | 'delivery-recorded' | 'report-generated' | 'report-sealed' | 'export-run' | 'import-run';
  targetRef: string;
  detail?: string;                  // e.g. "period 2026-10; 9 lines; remainder → charitable" — provenance audit
  at: string;
}

