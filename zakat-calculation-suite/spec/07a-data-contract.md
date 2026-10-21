# 07a — Data Contract: zakat-calculation-suite

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — every operation is deterministic arithmetic over typed data (rules, items, reference values); no generation, no inspection, no clustering, no transformation by model exists anywhere in the contract. The methodology rule sets are DATA with source notes, not model output; the engine's promise is same inputs + same rules + same reference values → identical result, to the minor unit. 07b composes these entities into operation signatures; 07c fixes the deterministic computation rules and seeds.

```ts
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

export interface Session {
  memberId: string;
  workspaceId: string;
  role: Role;
  locale: Locale;
}

// ---- Zakat cases ----

export type CaseStatus =
  | 'draft' | 'in-review' | 'approved' | 'locked' | 'exported-versions-exist';

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
```

## Relationships

Workspace 1—N ZakatCase · ZakatCase 1—N CaseItem (soft-void only) · ZakatCase N—1 MethodologyProfile (profileId at calculation; results pin the version used) · MethodologyProfile 1—N CategoryRules (per category, versioned as one profile document) · Workspace 1—N NisabReference · ZakatCase N—2 NisabReference (pinned refs) · ZakatCase 1—N CalculationResult (immutable snapshots) · ZakatCase 1—N ComparisonSet · ComparisonSet N—M MethodologyProfile via pinned CalculationResults · ZakatCase 1—N ExportArtifact · locked ZakatCase 0..1—N successor ZakatCase (predecessorCaseId chain) · Job spans import/export work · ActivityEntry references any target.

## State obligations

- **Same inputs → same result**: a calculation is a pure function of (case items at caseVersion, profile at profileVersion, pinned nisab references). Re-running without edits returns the identical result; the audit export and the comparison view depend on this invariant.
- **Locked means frozen**: once locked, a case accepts no item, profile, or period mutations — corrections travel through a successor case linked via `predecessorCaseId` (the chain is the audit trail; the register never rewrites what it certified).
- **Calculations are immutable evidence pins**: `caseVersion`, `profileVersion`, and `nisabRefs` are frozen on the result; a later profile edit or reference change never rewrites an existing result — it produces a new one.
- **Profiles version as documents**: any rule edit bumps `version` and reverts status to `draft`; only the owner role approves (the shariah authority gate — Salman's demand, 02); retired profiles stay computable for existing locked cases and are refused for new cases.
- **Items never disappear**: voiding records reason, actor, and time; voided items stay queryable because the audit export must be able to show what was excluded and why.
- **Only approved profiles compute**: `runCalculation` on a case whose profile is `draft` or `retired` is a typed VALIDATION refusal naming the approval gate (07c fixture).
- **Partial-result policies**: import delivers accepted-so-far plus named bad rows (per-row retry); exports are per-artifact atomic — a failed bundle retry regenerates only the failed artifact (async-contract §4).
- **No provider names anywhere**: reference-price feeds appear as an abstract capability in 08; the manual entered-reference path is the primary path from first run (LOOP-5).
