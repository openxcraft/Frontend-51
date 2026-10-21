// VERBATIM from specs-source/shipping-rate-comparator/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below. Implementation corrections applied: 1 (see portfolio SPEC_DEFECTS.md; specs-source untouched).
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types are declared canonically in 07a and
// are part of this contract by reference; 07b declares only the operational
// wrappers (summaries, views, jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed import rows, completeness and
 *                                      ladder-contiguity gates, empty
 *                                      destination/cards, non-positive weights)
 * 'NOT_FOUND'    -> NotFoundError     (stale card/comparison/profile/artifact
 *                                      links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (capability consent, workspace scoping,
 *                                      viewer-role mutations)
 * 'CONFLICT'     -> ConflictError     (concurrent card edits, concurrent
 *                                      profile edits)
 * 'RATE_LIMIT'   -> RateLimitError    (exports near window; capability
 *                                      fetches if bound)
 * 'NETWORK'      -> NetworkError      (list fetches, artifact delivery,
 *                                      job polling)
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
  role: 'owner' | 'editor' | 'viewer';   // viewer: read + run comparisons + export, no mutations
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export type Locale = 'ar' | 'en';
export type UnitSystem = 'metric' | 'imperial';
export type CardStatus = 'draft' | 'active' | 'retired';
export type QuoteStatus = 'quoted' | 'no-coverage' | 'out-of-weight-range' | 'card-inactive';

export interface CardSummary {
  id: string;
  channelLabel: string;                 // manager-authored; never a vendor name
  serviceLabel: string;
  currency: string;
  status: CardStatus;
  effectiveFrom: string;
  zoneCount: number;
  breakCount: number;
  surchargeCount: number;
  coverageGaps: number;                 // zones with empty coverage — surfaced warning (S1)
  version: number;
  updatedAt: string;
}

export interface CardDetailView extends CardSummary {
  dimPolicy: {
    divisor: number;                    // cm³/kg == mm³/g numerically (07c §2.2)
    unitSystem: UnitSystem;
    measurementRounding: 'up' | 'nearest';
    roundingStepGrams: number;
    minChargeableGrams: number;
  };
  zones: {
    code: string; label: string; coverage: string[]; remote: boolean;
  }[];
  breaks: { upToGrams: number; basePriceMinor: number }[];      // ladder (shared nominal ceilings)
  priceByZone: Record<string, number[]>;                        // zone.code -> per-break prices
  overage: { perUnitMinor: number; stepGrams: number } | null;
  surcharges: {
    id: string; kind: 'fuel' | 'cod-rate' | 'cod-flat' | 'remote-flat'
      | 'declared-value-rate' | 'handling-flat';
    label: string; rateBps?: number; amountMinor?: number;
  }[];
  createdAt: string;
}

export interface ProfileSummary {
  id: string;
  label: string;
  destination: string;                  // verbatim; bidi-isolated at render (rtl-rules §2)
  weightGrams: number;
  hasDimensions: boolean;
  codAmount?: { amountMinor: number; currency: string };
  declaredValue?: { amountMinor: number; currency: string };
  lastRunAt?: string;
  runCount: number;
  updatedAt: string;
}

export interface ComparisonSummary {
  id: string;
  kind: 'single' | 'batch';
  destinationCount: number;             // 1 for singles; row count for batches
  cardCount: number;
  currencyGroups: string[];
  pinned: boolean;
  runAt: string;
}

export interface Job<T> {
  id: string;
  kind: 'card-import' | 'batch-comparison' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface ShippingRateAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // rate cards — authoring and lifecycle (the LOOP-5 primary path: hand-entered cards)
  createRateCard(input: {
    channelLabel: string;               // VALIDATION if empty
    serviceLabel: string;
    currency: string;                   // ISO 4217; VALIDATION if malformed
    effectiveFrom?: string;             // defaults to today (workspace clock)
    dimPolicy?: Partial<CardDetailView['dimPolicy']>;
  }): Promise<Result<CardSummary, AdapterError>>;
  listRateCards(query: {
    filter?: { status?: CardStatus[]; currency?: string };
    search?: string;                    // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'channelLabel' | 'status';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CardSummary>, AdapterError>>;
  getRateCard(id: string): Promise<Result<CardDetailView, AdapterError>>;
  updateRateCard(id: string, patch: {
    channelLabel?: string; serviceLabel?: string;
    dimPolicy?: Partial<CardDetailView['dimPolicy']>;
    zones?: CardDetailView['zones'];            // VALIDATION on intra-card coverage overlap
    breaks?: CardDetailView['breaks'];          // VALIDATION on ladder gaps/overlaps (07a #2)
    priceByZone?: Record<string, number[]>;
    overage?: { perUnitMinor: number; stepGrams: number } | null;
    surcharges?: CardDetailView['surcharges'];
    baseVersion: number;                        // stale -> CONFLICT with both payloads
  }): Promise<Result<CardDetailView, AdapterError>>;
  setRateCardStatus(input: {
    id: string;
    status: 'active' | 'retired';
    idempotencyKey: string;             // async-contract §5 — double-submit flips once
  }): Promise<Result<CardSummary, AdapterError>>;   // activation runs the completeness gate (07a #1)
  duplicateRateCard(input: {
    id: string;                         // any source (retired included: renewal workflow)
    channelLabel?: string;              // defaults to source + " (copy)"
    serviceLabel?: string;
    effectiveFrom: string;
    idempotencyKey: string;
  }): Promise<Result<CardSummary, AdapterError>>;   // new DRAFT, version 1 — never copies status

  // paste-import (the spreadsheet escape — CP-1)
  importRateCard(input: {
    rows: string[];                     // raw pasted lines; parsed per 07c §3
    channelLabel: string; serviceLabel: string;
    currency: string;
    unitSystem: UnitSystem;
    divisor: number;
    idempotencyKey: string;
  }): Promise<Result<Job<{ cardId: string; parsedRows: number; issues: { row: number; reason: string; suggestion?: string }[] }>, AdapterError>>;

  // zone resolution probe (which zone does a destination hit, and why — CP-2/3)
  resolveZone(input: {
    cardId: string;
    destination: string;                // free text; normalized per 07c §2.1
  }): Promise<Result<{
    status: 'matched' | 'no-coverage' | 'card-inactive';
    normalizedDestination: string;
    matchedZone?: { code: string; label: string; matchedCoverage: string; remote: boolean };
  }, AdapterError>>;

  // chargeable-weight calculator (the Settle's data — CP-3)
  computeChargeableWeight(input: {
    weightGrams: number;                // VALIDATION if <= 0
    dimensions?: { lengthMm: number; widthMm: number; heightMm: number };
    divisor: number;                    // the card's divisor; VALIDATION if <= 0
    unitSystem: UnitSystem;
    measurementRounding: 'up' | 'nearest';
    roundingStepGrams: number;
    minChargeableGrams: number;
  }): Promise<Result<{
    actualWeightGrams: number;
    volumetricWeightGrams: number | null;         // null when no dimensions given
    chargeableWeightGrams: number;
    weightBasis: 'actual' | 'volumetric' | 'minimum';
    derivationText: string;             // the rule chain as copy, both locales' grammar (11)
  }, AdapterError>>;

  // shipment profiles
  createShipmentProfile(input: {
    label: string;
    destination: string;                // VALIDATION if empty
    weightGrams: number;                // VALIDATION if <= 0
    dimensions?: { lengthMm: number; widthMm: number; heightMm: number };
    codAmount?: { amountMinor: number; currency: string };
    declaredValue?: { amountMinor: number; currency: string };
  }): Promise<Result<ProfileSummary, AdapterError>>;
  listShipmentProfiles(query: {
    filter?: { hasDimensions?: boolean; hasCod?: boolean };
    search?: string;                    // normalized bilingual (rtl-rules §4)
    sort: 'updatedAt' | 'label' | 'runCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ProfileSummary>, AdapterError>>;
  getShipmentProfile(id: string): Promise<Result<ProfileSummary, AdapterError>>;
  updateShipmentProfile(id: string, patch: {
    label?: string; destination?: string; weightGrams?: number;
    dimensions?: { lengthMm: number; widthMm: number; heightMm: number } | null;
    codAmount?: { amountMinor: number; currency: string } | null;
    declaredValue?: { amountMinor: number; currency: string } | null;
    baseUpdatedAt: string;              // stale -> CONFLICT
  }): Promise<Result<ProfileSummary, AdapterError>>;
  deleteShipmentProfile(input: { id: string; idempotencyKey: string }): Promise<Result<{ deleted: true }, AdapterError>>;  // P03 undo window in UI

  // comparisons (deterministic, synchronous, budget-bound per 10-performance)
  runComparison(input: {
    profileId?: string;                 // exactly one of profileId / profileInline
    profileInline?: {
      destination: string; weightGrams: number;
      dimensions?: { lengthMm: number; widthMm: number; heightMm: number };
      codAmount?: { amountMinor: number; currency: string };
      declaredValue?: { amountMinor: number; currency: string };
    };
    cardIds: string[];                  // VALIDATION if empty; NOT_FOUND names stale ids
    includeRetired?: boolean;           // default false
  }): Promise<Result<Comparison, AdapterError>>;      // immutable snapshot (07a #3)
  getComparison(id: string): Promise<Result<Comparison, AdapterError>>;
  listComparisons(query: {
    filter?: { kind?: ('single' | 'batch')[]; pinned?: boolean; profileId?: string };
    sort: 'runAt' | 'destinationCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ComparisonSummary>, AdapterError>>;
  setComparisonPin(input: {
    id: string; pinned: boolean; note?: string;   // note required when pinned = true
    idempotencyKey: string;
  }): Promise<Result<ComparisonSummary, AdapterError>>;

  // batch comparison (the morning surface — CP-4)
  runBatchComparison(input: {
    destinations: string[];             // VALIDATION if every row is empty; duplicates counted, deduplicated
    profileTemplate: {
      weightGrams: number;
      dimensions?: { lengthMm: number; widthMm: number; heightMm: number };
      codAmount?: { amountMinor: number; currency: string };
      declaredValue?: { amountMinor: number; currency: string };
    };
    cardIds: string[];                  // VALIDATION if empty
    includeRetired?: boolean;
    idempotencyKey: string;
  }): Promise<Result<Job<{ comparisonId: string; rows: number; duplicates: number; exceptions: number }>, AdapterError>>;

  // export (manual path is primary from first run — LOOP-5)
  exportComparison(input: {
    comparisonId: string;
    format: 'markdown-table' | 'csv';
    includesBreakdowns: boolean;
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifactId: string; expiresAt: string }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    comparisons: number; batchComparisons: number;   // counted, UNMETERED (12 Q-3)
    exports: number; exportLimit: number;            // soft-quota meter (P14)
    resetAt: string;
  }, AdapterError>>;
  listActivity(query: {
    filter?: { actor?: string; action?: string[]; targetRef?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<{
    id: string; actorMemberId: string; action: string;
    targetRef: string; detail?: string; at: string;
  }>, AdapterError>>; // SPEC_DEFECTS B: Page<T> closed inside Result in spec
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
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

