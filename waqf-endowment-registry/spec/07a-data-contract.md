# 07a — Data Contract: waqf-endowment-registry

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — zero AI operations on the adapter; allocation is arithmetic over recorded entries and policy shares, ratios are division, report generation is a pure function over ledger state, the seal is a state machine. There is no assist capability, no degradation ladder, and no metered AI surface anywhere (08's needs are storage/delivery/notification classes only). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';               // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;           // async-contract §5
}

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
```

## Relationships

Workspace 1—N Endowment · Endowment 1—N Asset · Endowment 1—N Beneficiary (one may succeed another via successorBeneficiaryId) · Endowment 1—1 current DistributionPolicy (N versions; allocations pin the version they ran) · Endowment 1—N LedgerEntry (append-only, per-endowment seq) · LedgerEntry N—1 Asset (inflows) / Beneficiary (distribution lines) / Allocation (committed distributions) / LedgerEntry (reversal target) · Allocation 1—N AllocationLine · AllocationLine N—1 Beneficiary · Allocation 1—0..1 Distribution · Report N—1 Workspace (scope: one endowment or consolidated) · Report 1—N ExportArtifact · Job spans import/export work.

## Operations (summary; typed signatures in 07b)

Endowments: create, list, get, update (metadata, versioned), setStatus. Assets: add, update, list. Beneficiaries: add, update, list. Policy: save (versioned), get. Ledger: recordInflow, recordExpense, voidEntry (reversal append), listEntries, importLedgerBatch (Job). Allocation: run (deterministic, synchronous, budget-bound per 10), get, updateLine (hold/adjust with reason), recordDistribution (commit with attestation), getDistribution, recordDelivery. Reports: generate (deterministic snapshot), get, seal (one-way), export (Job), getArtifact. Platform: getSession, listJobs, listActivity, getUsage.

## State obligations (lifecycle invariants)

- **The ledger is append-only**: entries are immutable after commit; the only correction grammar is a reversal entry (kind 'reversal', reversesEntryId set, reason required); seq is monotonic per endowment (07c: seq = last + 1). An endowment's records must outlive its administrator (02 Abdulaziz) — this is the invariant that makes the audit trail real.
- **Allocation is a pure function**: (ledger entries in period) × (pinned policy version) × (beneficiary register snapshot) → the same totals and lines, every run. Holds and adjustments are human state recorded ON the draft with reasons; the committed distribution's entries carry the adjusted amounts; the derivation (computedAmount) always remains visible next to any adjustment (03 CP-3 disclosure).
- **Commit is the gate**: an allocation moves draft → committed only through recordDistribution with an attestation (by/at/note); committed distributions are immutable; a committed allocation with a later-voided expense keeps its history and the variance surfaces in the next report (12 Q-7).
- **The seal is one-way**: a report moves draft → sealed exactly once; sealing pins the ledger state (ledgerPin) the report was computed from; regeneration after new entries creates a NEW draft report — a sealed report is never recomputed, never edited, never unsealed (the trust artifact's whole point, 02 Dr. Yaqub).
- **Eligibility gates distribution, not registration**: a 'succeeded' or 'suspended' beneficiary is never allocated; the worksheet names the held shares and their recorded reasons; **held amounts stay unallocated until eligibility resolves** — never silently redistributed (a deed-assigned share is not the remainder's to take); the remainder rule carries only the rounding residue and the deed's unassigned share mass.
- **Partial-result policies** (async-contract §4): import delivers valid rows + named invalid rows (per-row retry); export delivers per-format artifacts with per-format retry; allocation and report generation are atomic (they are synchronous computations, not Jobs).
- **Evidence is reference, not storage**: evidence notes are bilingual text; documentRef is an abstract storage reference (08 N1) that may be unbound — the entry is complete and auditable with its note alone (LOOP-5).
- **No provider names anywhere** — document storage, disbursement, report delivery, and notification appear as abstract capability classes in 08 only.
