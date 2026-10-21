# 07a — Data Contract: shipping-rate-comparator

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **non-AI** — zero AI operations exist in this product; every figure is deterministic arithmetic over canonical data (07b/07c). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

Canonical-unit discipline (the arithmetic's honesty floor): profile weights are stored as integer **grams**; dimensions as integer **millimeters**; money as integer **minor units** with the currency's minor digits. Card ladders (`upToGrams`, `roundingStepGrams`, `overage.stepGrams`) are gram-domain numbers that MAY carry exact decimals when authored from imperial terms (1 lb = 453.59237 g exactly — the fixture card in 07c carries 453.59237/1360.77711/2267.96185/4535.9237); every such value is an exact decimal by international definition, never a rounded approximation. Imperial cards declare their unit system and convert at compute time with EXACT factors — 1 inch = 25.4 mm and 1 pound = 453.59237 g are international definitions, so every conversion is exact decimal arithmetic, never floating-point luck (07c §2.3). Display is formatting only (rtl-rules §3); parsing never reads display strings back into money.

```ts
export type Locale = 'ar' | 'en';
export type UnitSystem = 'metric' | 'imperial';
export type CardStatus = 'draft' | 'active' | 'retired';
export type ComparisonKind = 'single' | 'batch';

export interface Workspace {
  id: string;
  name: string;
  defaultCurrency: string;              // ISO 4217 code, e.g. "SAR"
  defaultUnitSystem: UnitSystem;        // what the profile forms default to
  normalizationDisclosure: string;      // rendered ruleset version (rtl-rules §4 — the matcher's exact rules)
}

// ---- Rate cards ----

export interface DimPolicy {
  divisor: number;                      // cm³/kg == mm³/g numerically (07c §2.2)
  unitSystem: UnitSystem;               // the system the divisor is expressed in
  measurementRounding: 'up' | 'nearest';// per-dimension rounding BEFORE volume (07c §2.2)
  roundingStepGrams: number;            // chargeable-weight billing step (e.g. 500 = 0.5 kg)
  minChargeableGrams: number;           // minimum billable weight (e.g. 500 = 0.5 kg)
}

export interface Zone {
  code: string;                         // short code, e.g. "Z1" — manager-authored
  label: string;                        // display label, either script (bidi-isolated at render)
  coverage: string[];                   // destination names; normalized at match time (07c §2.1)
  remote: boolean;                      // true → remote-area surcharges apply (07c §2.5)
}

export interface WeightBreak {
  upToGrams: number;                    // exclusive ceiling; ladder must be contiguous from 0 (07a obligations)
  basePriceMinor: number;               // price for weights in (previousUpTo, upToGrams]
}

export interface OveragePolicy {
  perUnitMinor: number;                 // price per additional step above the highest break
  stepGrams: number;                    // overage billing step (e.g. 500 = per 0.5 kg)
}

export type SurchargeKind =
  | 'fuel'                              // rateBps on (base + overage)
  | 'cod-rate'                          // rateBps on profile.codAmount
  | 'cod-flat'                          // flat when profile.codAmount > 0
  | 'remote-flat'                       // flat when matched zone.remote
  | 'declared-value-rate'               // rateBps on profile.declaredValue
  | 'handling-flat';                    // flat, always

export interface SurchargeDefinition {
  id: string;
  kind: SurchargeKind;
  label: string;                        // manager-authored, either script
  rateBps?: number;                     // 0–10000; required for *-rate kinds
  amountMinor?: number;                 // required for *-flat kinds
}

export interface RateCard {
  id: string;
  workspaceId: string;
  channelLabel: string;                 // manager's own naming — never a vendor list (credential-contract §2 kin)
  serviceLabel: string;                 // e.g. "Domestic Standard" — manager-authored
  currency: string;                     // ISO 4217; quotes carry it verbatim (no FX — 12 Q-9)
  status: CardStatus;
  effectiveFrom: string;                // date; informational versioning anchor
  dimPolicy: DimPolicy;
  zones: Zone[];
  breaks: WeightBreak[];                // shared ladder across zones; prices live in priceByZone (below)
  priceByZone: Record<string, number[]>;// zone.code -> per-break basePriceMinor (aligned to breaks order)
  overage: OveragePolicy | null;        // null → out-of-range above the ladder
  surcharges: SurchargeDefinition[];
  version: number;                      // incremented on every mutation (CONFLICT guard)
  createdAt: string;
  updatedAt: string;
}

// ---- Shipment profiles ----

export interface ShipmentProfile {
  id: string;
  workspaceId: string;
  label: string;                        // either script ("صندوق الرياض القياسي")
  destination: string;                  // free text; normalized at match time (07c §2.1)
  weightGrams: number;                  // actual weight, canonical grams (> 0)
  dimensions?: { lengthMm: number; widthMm: number; heightMm: number };
  codAmount?: { amountMinor: number; currency: string };
  declaredValue?: { amountMinor: number; currency: string };
  createdAt: string;
  updatedAt: string;
}

// ---- Comparisons (immutable snapshots) ----

export interface ProfileSnapshot {      // the EXACT inputs a comparison rated — never drifts
  label?: string;
  destination: string;
  weightGrams: number;
  dimensions?: { lengthMm: number; widthMm: number; heightMm: number };
  codAmount?: { amountMinor: number; currency: string };
  declaredValue?: { amountMinor: number; currency: string };
}

export type QuoteStatus = 'quoted' | 'no-coverage' | 'out-of-weight-range' | 'card-inactive';

export interface SurchargeLine {
  surchargeId: string;
  kind: SurchargeKind;
  label: string;
  ruleText: string;                     // the rule as copy, e.g. "fuel 12.5% of base 15.00"
  amountMinor: number;
}

export interface QuoteResult {
  cardId: string;
  cardVersion: number;                  // the version that rated — provenance pin
  channelLabel: string;
  serviceLabel: string;
  currency: string;
  status: QuoteStatus;
  // present when status = 'quoted':
  actualWeightGrams?: number;           // as computed in the card's unit system (07c §2.3)
  volumetricWeightGrams?: number;
  chargeableWeightGrams?: number;
  weightBasis?: 'actual' | 'volumetric' | 'minimum';   // which weight won — the Settle's data
  matchedZone?: { code: string; label: string; matchedCoverage: string; remote: boolean };
  matchedBreakUpToGrams?: number;
  basePriceMinor?: number;
  overageUnits?: number;                // count of overage steps applied
  overageAmountMinor?: number;
  surchargeLines: SurchargeLine[];      // empty for non-quoted statuses
  totalMinor?: number;
}

export interface ComparisonRow {        // batch rows: same profile template, per-destination
  destination: string;
  normalizedDestination: string;
  quotes: QuoteResult[];
  exceptions: number;                   // count of non-quoted cells (sort key for the matrix)
}

export interface Comparison {
  id: string;
  workspaceId: string;
  kind: ComparisonKind;
  profileSnapshot?: ProfileSnapshot;    // single comparisons
  profileTemplate?: ProfileSnapshot;    // batch comparisons (weight/dims/options shared)
  rows?: ComparisonRow[];               // batch comparisons
  cardIds: string[];
  quotes?: QuoteResult[];               // single comparisons
  currencyGroups: string[];             // distinct quote currencies, deterministic order
  pinned: boolean;
  pinNote?: string;
  runAt: string;
}

// ---- Jobs, artifacts, activity ----

export type JobKind = 'card-import' | 'batch-comparison' | 'export';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';               // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                    // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;               // async-contract §5
}

export interface ExportArtifact {
  id: string;
  comparisonId: string;
  format: 'markdown-table' | 'csv';
  includesBreakdowns: boolean;
  expiresAt: string;                    // declared retention window at creation
  regenerable: boolean;                 // snapshots are immutable — regeneration is free
}

export interface ActivityEntry {        // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'card-created' | 'card-imported' | 'card-updated' | 'card-activated'
    | 'card-retired' | 'card-duplicated' | 'comparison-run' | 'batch-run'
    | 'comparison-pinned' | 'export-run' | 'profile-created' | 'profile-updated'
    | 'profile-deleted' | 'consent-change';
  targetRef: string;
  detail?: string;                      // e.g. "zone Z2 coverage +1; break 3kg price 19.50→21.00" — the audit trail
  at: string;
}
```

## Relationships

Workspace 1—N RateCard · Workspace 1—N ShipmentProfile · RateCard 1—N Zone · RateCard 1—N WeightBreak (shared ladder) · RateCard 1—N SurchargeDefinition · Workspace 1—N Comparison · Comparison N—M RateCard (via cardIds + per-quote version pins; never live references) · Comparison 1—N ComparisonRow (batch) / 1—N QuoteResult (single) · Comparison 1—N ExportArtifact · Job spans card-import / batch-comparison / export work.

## State obligations (lifecycle invariants)

1. **The completeness gate is the only path to `active`**: a card activates only with ≥1 zone carrying ≥1 coverage entry, a contiguous break ladder from 0 (no gaps, no overlaps — 0 < upTo₁ < upTo₂ < …), every zone priced for every break (priceByZone complete), currency set, and divisor > 0. Activation failure mutates nothing.
2. **Zone coverage must not overlap within a card** (a destination normalizing into two zones is a card defect): enforced at save with both zones named; destination matching is exact-after-normalization ONLY — no fuzzy matching at v1 (07c §2.1; 12 Q-8).
3. **Comparisons are immutable snapshots**: profile inputs and per-card versions are pinned at run time; a later card edit never rewrites an existing comparison (the "card changed since run" state is derived at read, never stored).
4. **Every quote carries its chain**: a `quoted` result always carries weights, basis, matched zone + coverage entry, break, base, overage, surcharge lines, total — there is no total-without-derivation state in the data model (the trust posture IS the schema).
5. **Cards are versioned on every mutation**; retired cards remain readable and diffable but never rate new comparisons unless the run explicitly includes retired cards (UI toggle; 03 CP-3 edge).
6. **Partial-result policies**: card-import delivers parsed-so-far + named bad rows; batch-comparison delivers completed rows + named failed remainder with retry scoped to the remainder; exports are atomic per artifact and idempotently retryable (async-contract §4).
7. **Profiles are user-authored only** — no order-source import exists in the contract (LOOP-3 boundary with cod-order-confirmation; its manifest is an export, never a live feed).
8. **Money never converts**: quotes carry their card's currency verbatim; currencyGroups records the distinct set; ranking happens within groups only (12 Q-9 — no FX data is invented).
9. **No provider names anywhere** — channelLabel is the manager's own text; the rate-quote capability (08 N1) appears as a consent-scoped abstract source only.
