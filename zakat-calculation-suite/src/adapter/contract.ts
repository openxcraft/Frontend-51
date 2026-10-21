// VERBATIM from specs-source/zakat-calculation-suite/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entities are declared canonically in 07a and are
// part of this contract by reference; 07b adds only summaries and view types.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (bad import rows, draft/retired profile gate,
 *                                        locked-case mutation gate, unpinned nisab)
 * 'NOT_FOUND'    -> NotFoundError     (stale case/item/calculation/artifact links)
 * 'PERMISSION'   -> PermissionError   (role gates: review, lock, approve, export classes)
 * 'CONFLICT'     -> ConflictError     (concurrent case/item/profile edits)
 * 'RATE_LIMIT'   -> RateLimitError    (imports, exports — never calculations)
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
  role: 'owner' | 'officer' | 'reviewer' | 'viewer';   // 07a role grammar
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entity summaries (full shapes per 07a) ----

export type CaseStatus =
  | 'draft' | 'in-review' | 'approved' | 'locked' | 'exported-versions-exist';

export interface CaseSummary {
  id: string;
  reference: string;
  subject: { en?: string; ar?: string };   // bidi-isolated at render (rtl-rules §2)
  periodEnd: string;
  currency: string;
  status: CaseStatus;
  profileId: string;
  itemCounts: { active: number; voided: number };
  latestCalculationId?: string;
  latestComparisonId?: string;
  predecessorCaseId?: string;
  updatedAt: string;
}

export interface ItemRow {
  id: string;
  caseId: string;
  category: ItemCategory;                    // 07a union
  side: 'asset' | 'liability';
  description: { en?: string; ar?: string };
  amountDisplay: string;                     // canonical Western-digit string (rtl-rules §3);
                                            // display formatting happens above the adapter
  quantity?: { value: number; unit: 'head' | 'kg' };
  weightGrams?: number;
  isJewelry?: boolean;
  irrigation?: 'rain-fed' | 'irrigated-at-cost' | 'mixed';
  recoverability?: 'strong' | 'weak';
  acquiredMidHawl?: boolean;
  sourceNote?: string;
  voided?: { reason: string; at: string };
  createdAt: string;
}

export interface ProfileSummary {
  id: string;
  name: { en?: string; ar?: string };
  school: 'hanafi' | 'shafii' | 'maliki' | 'hanbali' | 'contemporary';
  institutionalPreset?: 'aaoifi-fas9-net-asset' | 'corporate-regulation' | 'custom-institutional';
  nisabBasis: 'gold' | 'silver';
  status: 'draft' | 'approved' | 'retired';
  version: number;
  approvedAt?: string;
  updatedAt: string;
}

export interface NisabReferenceSummary {
  id: string;
  metal: 'gold' | 'silver';
  perGramDisplay: string;                    // canonical string per 07a Money
  currency: string;
  asOf: string;
  sourceNote: string;
  active: boolean;
  createdAt: string;
}

export interface CalculationSummary {
  id: string;
  caseId: string;
  caseVersion: number;
  profileId: string;
  profileVersion: number;
  zakatDueDisplay: string;                   // canonical string; AR-indic/Western is display
  aboveNisab: boolean;
  inKindDues: { kind: string; count: number }[];
  generatedAt: string;
}

export interface ComparisonSummary {
  id: string;
  caseId: string;
  profileIds: string[];
  divergenceCount: number;
  generatedAt: string;
}

export interface JobView {
  id: string;
  kind: 'import' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  error?: AdapterError;
  createdAt: string;
}

// ---- Contract ----

export interface ZakatCalculationAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // cases
  createCase(input: {
    reference: string;
    subject: { en?: string; ar?: string };
    subjectType: 'individual' | 'entity';
    periodStart: string;
    periodEnd: string;
    currency: string;
    profileId: string;                // must reference an approved profile (typed gate)
  }): Promise<Result<CaseSummary, AdapterError>>;
  listCases(query: {
    filter?: { status?: CaseStatus[]; school?: ProfileSummary['school'][]; currency?: string[] };
    search?: string;                  // normalized bilingual search (rtl-rules §4)
    sort: 'periodEnd' | 'updatedAt' | 'reference';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CaseSummary>, AdapterError>>;
  getCase(id: string): Promise<Result<CaseSummary & {
    pinnedNisabRefs: { gold?: string; silver?: string };
    version: number;
  }, AdapterError>>;
  updateCase(id: string, patch: {
    subject?: { en?: string; ar?: string };
    periodStart?: string;
    periodEnd?: string;
    profileId?: string;               // draft-only mutation; re-runs produce new results
    baseVersion: number;
  }): Promise<Result<CaseSummary, AdapterError>>;

  // items (manual single-add is the LOOP-5 primary path; bulk import is the convenience)
  addCaseItem(caseId: string, input: Omit<ItemRow,
    'id' | 'caseId' | 'createdAt' | 'voided'
  >): Promise<Result<ItemRow, AdapterError>>;
  importItems(input: {
    caseId: string;
    rows: { rawLine: string;          // parsed per the declared import grammar (07c)
            categoryHint?: string; descriptionHint?: string;
            amountText?: string; quantityText?: string }[];
    idempotencyKey: string;           // async-contract §5 — double-submit never double-imports
  }): Promise<Result<JobView & { result?: { accepted: number; badRows: string[] } }, AdapterError>>;
  listCaseItems(query: {
    caseId: string;
    filter?: { category?: ItemCategory[]; side?: ('asset' | 'liability')[]; voided?: boolean };
    search?: string;
    sort: 'category' | 'createdAt' | 'amount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ItemRow>, AdapterError>>;
  updateCaseItem(itemId: string, patch: {
    amount?: { minorUnits: number; currency: string; minorDigits: 2 | 3 };
    quantity?: { value: number; unit: 'head' | 'kg' };
    weightGrams?: number;
    isJewelry?: boolean;
    irrigation?: 'rain-fed' | 'irrigated-at-cost' | 'mixed';
    recoverability?: 'strong' | 'weak';
    acquiredMidHawl?: boolean;
    description?: { en?: string; ar?: string };
    sourceNote?: string;
    baseCaseVersion: number;
  }): Promise<Result<ItemRow, AdapterError>>;
  voidCaseItem(itemId: string, reason: string): Promise<Result<ItemRow, AdapterError>>;

  // calculations (deterministic, synchronous, budget-bound per 10-performance)
  runCalculation(caseId: string): Promise<Result<CalculationSummary & {
    basket: { netBaseDisplay: string; nisabValueDisplay: string; aboveNisab: boolean };
    trace: unknown[];                 // TraceLine[] per 07a — the audit spine
    perCategory: unknown[];
  }, AdapterError>>;
  getCalculation(caseId: string): Promise<Result<CalculationSummary & {
    trace: unknown[];
    perCategory: unknown[];
    basket: { netBaseDisplay: string; nisabValueDisplay: string; aboveNisab: boolean };
  }, AdapterError>>;
  listCalculations(query: {
    caseId: string;
    sort: 'generatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CalculationSummary>, AdapterError>>;

  // methodology comparison (the signature flow — same items, named differences)
  createComparison(caseId: string, profileIds: string[]): Promise<Result<ComparisonSummary & {
    results: { profileId: string; calculationId: string; zakatDueDisplay: string }[];
    divergences: { category: ItemCategory; perProfile: { profileId: string; due: string }[];
                   ruleRef: string; reason: { en?: string; ar?: string } }[];
  }, AdapterError>>;
  getComparison(id: string): Promise<Result<ComparisonSummary & {
    results: { profileId: string; calculationId: string; zakatDueDisplay: string }[];
    divergences: { category: ItemCategory; perProfile: { profileId: string; due: string }[];
                   ruleRef: string; reason: { en?: string; ar?: string } }[];
  }, AdapterError>>;
  listComparisons(query: {
    filter?: { caseId?: string };
    sort: 'generatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ComparisonSummary>, AdapterError>>;

  // methodology profiles (rules as sourced data; owner-role approval gate)
  listProfiles(query: {
    filter?: { school?: ProfileSummary['school'][]; status?: ProfileSummary['status'][] };
    sort: 'updatedAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ProfileSummary>, AdapterError>>;
  getProfile(id: string): Promise<Result<ProfileSummary & {
    nisabGrams: { gold: number; silver: number };
    rules: Record<string, unknown>;          // CategoryRules per 07a, source notes included
    sourceNotes: unknown[];
  }, AdapterError>>;
  saveProfile(profile: {
    id?: string;
    name: { en?: string; ar?: string };
    school: ProfileSummary['school'];
    institutionalPreset?: ProfileSummary['institutionalPreset'];
    nisabBasis: 'gold' | 'silver';
    nisabGrams: { gold: number; silver: number };
    rules: Record<string, unknown>;
    baseVersion?: number;
  }): Promise<Result<ProfileSummary, AdapterError>>;   // owner role only (typed PERMISSION)
  approveProfile(id: string, note: string): Promise<Result<ProfileSummary, AdapterError>>;
  retireProfile(id: string, note: string): Promise<Result<ProfileSummary, AdapterError>>;

  // nisab & valuation references (entered references are the primary path — LOOP-5)
  listNisabReferences(query: {
    filter?: { metal?: ('gold' | 'silver')[]; active?: boolean };
    sort: 'asOf' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<NisabReferenceSummary>, AdapterError>>;
  setNisabReference(input: {
    metal: 'gold' | 'silver';
    perGram: { minorUnits: number; currency: string; minorDigits: 2 | 3 };
    asOf: string;
    sourceNote: string;                // where the value came from — accountability field
  }): Promise<Result<NisabReferenceSummary, AdapterError>>;
  pinNisabReferences(caseId: string, refs: {
    gold: string; silver: string;      // NisabReference ids; frozen into results
    baseCaseVersion: number;
  }): Promise<Result<CaseSummary, AdapterError>>;

  // review & certification (role-gated; locked cases are frozen evidence)
  submitCaseForReview(caseId: string, note: string): Promise<Result<CaseSummary, AdapterError>>;
  reviewCase(caseId: string, decision: { approve: true; note: string } |
    { approve: false; note: string }): Promise<Result<CaseSummary, AdapterError>>;
  lockCase(caseId: string): Promise<Result<CaseSummary, AdapterError>>;
  createSuccessorCase(caseId: string, reason: string): Promise<Result<CaseSummary, AdapterError>>;

  // exports (jobs; audit-bundle requires locked; items-csv any status)
  exportCase(input: {
    caseId: string;
    format: 'audit-bundle' | 'items-csv';
    options: { includeTrace?: boolean; locale: 'ar' | 'en' | 'bilingual' };
    idempotencyKey: string;
  }): Promise<Result<JobView & { result?: { artifacts: { artifactId: string; expiresAt: string }[] } }, AdapterError>>;
  exportComparison(input: {
    comparisonId: string;
    format: 'audit-bundle';
    options: { locale: 'ar' | 'en' | 'bilingual' };
    idempotencyKey: string;
  }): Promise<Result<JobView & { result?: { artifacts: { artifactId: string; expiresAt: string }[] } }, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string; expiresAt: string; regenerable: boolean; format: string;
  }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: JobView['state'][]; kind?: JobView['kind'][]; caseId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<JobView>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    calculationsRun: number; comparisonsRun: number; imports: number; exports: number;
    resetAt: string;
    note: string;                     // calculations never metered — determinism is not rationed
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type School = 'hanafi' | 'shafii' | 'maliki' | 'hanbali' | 'contemporary';
export type NisabBasis = 'gold' | 'silver';
export type Metal = 'gold' | 'silver';
export type ItemCategory =
  | 'cash' | 'gold-silver' | 'trade-inventory' | 'receivables' | 'investments'
  | 'livestock-camels' | 'livestock-cattle' | 'livestock-sheep-goats'
  | 'agriculture-crops' | 'minerals-rikaz';
export type Irrigation = 'rain-fed' | 'irrigated-at-cost' | 'mixed';
export type Recoverability = 'strong' | 'weak';

/** Canonical money: integer minor units, Western-digit storage, never a float.
 *  Display (numeral system, locale) is formatting only (rtl-rules §3). */
export interface Money {
  minorUnits: number;            // e.g. 10115500 = SAR 101,155.00
  currency: string;              // ISO 4217 alphabetic code, e.g. "SAR"
  minorDigits: 2 | 3;            // 3 for BHD/KWD/OMR-class currencies
}
export interface Quantity {
  value: number;                 // heads of livestock, kg of crop
  unit: 'head' | 'kg';
}
export interface BilingualString {
  en?: string;                   // missing side renders nothing — never auto-translated
  ar?: string;                   // (auto-translation of a religious-finance document
}                                //  would fabricate scholarship the product refuses)
export interface SourceNote {
  ref: string;                   // digest citation id (01) or "seeded-default"
  note: string;                  // what the source says, in one sentence
  verification: 'digest-cited' | 'seeded-default-verify';
  // 'seeded-default-verify' = modeled on commonly taught schedules; the
  // workspace's shariah authority must verify before the profile is approved.
}

// ---- Workspace & session ----
export interface Workspace {
  id: string;
  name: BilingualString;
  defaultLocale: Locale;
  numeralPolicy: 'arabic-indic-in-arabic-prose' | 'western-everywhere';
  defaultProfileId?: string;     // workspace's approved starting methodology
  hijriDisplay: 'secondary-umm-al-qura' | 'gregorian-only';  // P24; storage stays Gregorian ISO
}
export type Role = 'owner' | 'officer' | 'reviewer' | 'viewer';
// owner: methodology approval + members (the shariah/administrative authority)
// officer: create/edit cases, enter items, run calculations
// reviewer: review decisions, lock cases, export
// viewer: read locked cases + export audit artifacts (the external auditor seat)
export interface ZakatCase {
  id: string;
  workspaceId: string;
  reference: string;              // external register key from the buyer's own books
                                 // (the product mints no numbering authority — 12 Q-11)
  subject: BilingualString;       // person or entity the zakat is computed for
  subjectType: 'individual' | 'entity';
  periodStart: string;            // hawl start / fiscal year start, Gregorian ISO
  periodEnd: string;              // hawl end / valuation date, Gregorian ISO
  currency: string;               // single reporting currency per case (12 Q-12)
  minorDigits: 2 | 3;
  profileId: string;              // methodology profile in force
  status: CaseStatus;
  pinnedNisabRefs: { gold?: string; silver?: string };  // NisabReference ids frozen at calculation
  predecessorCaseId?: string;     // correction path: locked cases get successors, never edits
  itemCounts: { active: number; voided: number };
  latestCalculationId?: string;
  latestComparisonId?: string;
  version: number;                // optimistic concurrency on every mutation
  createdAt: string;
  updatedAt: string;
}
export interface CaseItem {
  id: string;
  caseId: string;
  category: ItemCategory;
  side: 'asset' | 'liability';    // liabilities = the debt side the rules may deduct
  description: BilingualString;
  amount?: Money;                 // monetary categories + liability amounts
  weightGrams?: number;           // gold-silver holdings (bullion or jewelry)
  isJewelry?: boolean;            // triggers the madhhab jewelry rule (the classic divergence)
  metal?: Metal;                  // for gold-silver valuation against the pinned reference
  quantity?: Quantity;            // livestock heads / crop kg
  irrigation?: Irrigation;        // agriculture-crops; 'mixed' requires profile.mixedRate set
  recoverability?: Recoverability; // receivables; drives treatment rules per school
  acquiredMidHawl?: boolean;      // flagged to the profile's hawl-continuity note (honest flag,
                                  //  never silently dropped or silently included)
  sourceNote?: string;            // officer's evidence note (statement ref, count sheet id)
  voided?: { reason: string; by: string; at: string };  // soft-void only; items never hard-delete
  createdAt: string;
  updatedAt: string;
}

// ---- Methodology (rules as inspectable, sourced data) ----
export interface LivestockBand {
  fromCount: number;              // inclusive
  toCount: number | null;         // null = open-ended
  dueKind: string;                // e.g. "shah" | "bint-makhad" | "tabi" | "musinn" | "head-of-sheep"
  dueCount: number | null;        // null = computed as dueCount base + floor((n - fromCount + 1)/perN)
  perN?: number;                  // for open-ended bands (e.g. sheep ≥ 400: 1 per 100)
}
export interface CategoryRules {
  rate?: number;                  // rational fraction, e.g. 0.025, 0.05, 0.10, 0.20
  hawlRequired: boolean;          // agriculture/livestock: false (own thresholds)
  valuationBasis?: 'market-value-at-period-end' | 'entered-value';
  jewelryTreatment?: 'zakatable' | 'exempt-within-uruf';
  urufThreshold?: Money;          // required when jewelryTreatment = 'exempt-within-uruf'
  receivableTreatment?: 'strong-zakatable' | 'on-receipt';
  liabilityDeduction?: 'all-due' | 'current-only' | 'none';
  livestockBands?: LivestockBand[];
  minCount?: number;              // livestock threshold (5 camels / 30 cattle / 40 sheep)
  agricultureRates?: { rainFed: number; irrigatedAtCost: number; mixed?: number };
  cropNisabKg?: number;           // 5 wasq seeded default (07c), source-noted
  investmentTreatment?: 'zakatable-at-market' | 'excluded';
  sourceNotes: SourceNote[];      // EVERY rule carries its citation or its verify-flag
}
export interface MethodologyProfile {
  id: string;
  name: BilingualString;
  school: School;
  institutionalPreset?: 'aaoifi-fas9-net-asset' | 'corporate-regulation'
    | 'custom-institutional';     // contemporary profiles only (12 Q-6)
  nisabBasis: NisabBasis;         // which metal thresholds the monetary basket
  nisabGrams: { gold: number; silver: number };  // seeded 85 / 595; authority-editable
  rules: Record<ItemCategory, CategoryRules>;
  rounding: 'half-up';            // single declared policy at the currency's minorDigits
  status: 'draft' | 'approved' | 'retired';
  approvedBy?: string;            // memberId with owner role — the approval gate
  approvedAt?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Nisab & valuation references ----
export interface NisabReference {
  id: string;
  metal: Metal;
  perGram: Money;                 // entered reference price, canonical minor units
  asOf: string;                   // Gregorian ISO date the price was observed
  enteredBy: string;              // memberId — accountability for the reference value
  sourceNote: string;             // where the officer got the price (mint table, jeweler, feed)
  active: boolean;
  createdAt: string;
}

// ---- Calculation results (immutable snapshots) ----
export type TraceStep =
  | 'classify' | 'value' | 'aggregate' | 'deduct' | 'threshold' | 'rate' | 'round';
export interface TraceLine {
  step: TraceStep;
  itemRef?: string;               // CaseItem id when the line derives from one item
  category?: ItemCategory;
  amount?: Money;                 // value entering or leaving the step
  ruleId: string;                 // profile rule applied (e.g. "shafii.gold-silver.jewelry")
  narrative: BilingualString;     // the audit sentence: what was applied and why
  sourceNote?: SourceNote;        // the rule's citation rides the line
}
export interface CategoryResult {
  category: ItemCategory;
  zakatableValue?: Money;
  dueMonetary?: Money;            // after rate + rounding
  dueInKind?: { kind: string; count: number };   // livestock heads / crop kg
  thresholdApplied: string;       // narrative id: which nisab/threshold gate fired
  excludedReason?: string;        // e.g. "jewelry within uruf — Shafi'i rule"
  divergenceNote?: string;        // set only in comparison context (07b createComparison)
}
export interface BasketResult {
  zakatableValue: Money;          // monetary classes aggregated per profile rules
  deductibleLiabilities: Money;
  netBase: Money;
  basis: NisabBasis;
  nisabValue: Money;              // nisabGrams[basis] × pinned per-gram reference
  aboveNisab: boolean;
  distanceToNisab?: Money;        // signed; present when below (the honesty figure)
}
export interface CalculationResult {
  id: string;
  caseId: string;
  caseVersion: number;            // evidence pin: item state at computation time
  profileId: string;
  profileVersion: number;         // evidence pin: rules at computation time
  nisabRefs: { gold: string; silver: string };   // evidence pin: reference values used
  basket: BasketResult;
  perCategory: CategoryResult[];
  trace: TraceLine[];             // every step, in order, auditable to the minor unit
  totals: { zakatDue: Money; inKindDues: { kind: string; count: number }[] };
  hawlStatus: { periodDays: number; lunarYears: number; midHawlFlags: string[] };
  generatedAt: string;
  generatedBy: string;            // memberId — the calculation is an accountable act
}
export interface ComparisonDivergence {
  category: ItemCategory;
  perProfile: { profileId: string; due: string }[];  // rendered amounts per profile
  ruleRef: string;                // the rule pair that produced the difference
  reason: BilingualString;        // e.g. "jewelry zakatable (Hanafi) vs within-uruf (Shafi'i)"
}
export interface ComparisonSet {
  id: string;
  caseId: string;
  caseVersion: number;
  profileIds: string[];           // 2–5 approved profiles
  results: { profileId: string; calculationId: string; zakatDue: Money }[];
  divergences: ComparisonDivergence[];
  generatedAt: string;
}

// ---- Jobs, exports, activity ----
export type JobKind = 'import' | 'export';
export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';            // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;             // import: rows accepted so far + named bad rows
  result?: unknown;              // export: artifact ids + expiry windows
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;        // async-contract §5
}
export interface ExportArtifact {
  id: string;
  caseId?: string;
  comparisonId?: string;
  format: 'audit-bundle' | 'items-csv';
  includesTrace: boolean;        // audit-bundle always true; csv never
  expiresAt: string;             // declared retention window at creation
  regenerable: boolean;
}
export interface ActivityEntry {              // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'case-created' | 'items-imported' | 'item-voided' | 'calculation-run'
    | 'comparison-run' | 'nisab-set' | 'case-submitted' | 'review-decision'
    | 'case-locked' | 'export-run' | 'profile-approved' | 'profile-retired';
  targetRef: string;
  detail?: string;              // e.g. "profile v3 under Shafi'i; zakat SAR 101,155.00"
  at: string;
}

