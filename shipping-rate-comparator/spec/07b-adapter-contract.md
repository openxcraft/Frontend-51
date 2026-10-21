# 07b — Adapter Contract: shipping-rate-comparator (TypeScript, v1)

SME-G pass · `ShippingRateAdapterV1` · Non-AI declaration (ai-native-patterns §1): zero AI operations exist on this contract; every computation below is deterministic arithmetic over canonical data (07a/07c). LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session, idempotency keys on every submit-shaped operation. Types only — no implementation. Entity semantics (Workspace, RateCard, Zone, WeightBreak, OveragePolicy, DimPolicy, SurchargeDefinition, ShipmentProfile, Comparison, ComparisonRow, QuoteResult, ProfileSnapshot, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
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
  }, AdapterError>>;
}
```

## Rules (binding)

1. **Completeness gate**: `setRateCardStatus(active)` validates the full gate (07a #1 — zones, contiguous ladder, complete priceByZone, currency, divisor) and mutates nothing on failure; VALIDATION names the first missing piece. Retirement is a valid status flip from active only; retiring names active pinned comparisons in the UI-side P04 confirm (the adapter simply executes what was confirmed).
2. **Deterministic rating**: `runComparison`/`runBatchComparison` compute exactly per 07c §2 (normalization → zone resolution → exact-unit conversion → volumetric vs actual vs minimum → step rounding → break lookup → overage → surcharge rules → half-up minor-unit rounding); identical inputs and card versions ALWAYS return byte-identical results (the mock's replay test).
3. **Snapshot immutability**: comparisons pin profile inputs and card versions; `getComparison` returns the pinned state forever; "card changed since run" is derived at read, never stored; re-running creates a new comparison id.
4. **Honest statuses over errors**: a destination outside every zone returns quote status `no-coverage` (a named row with a fix action), NOT an error; chargeable weight above the ladder without an overage policy returns `out-of-weight-range` with the ceiling named; only malformed INPUT (empty destination, non-positive weight, zero cards) is VALIDATION.
5. **No FX, no vendor names**: quotes carry their card's currency verbatim; `currencyGroups` records the distinct set; ranking is within-group only; `channelLabel` is the manager's own text and the adapter never injects a carrier name anywhere.
6. **Zone resolution is exact-after-normalization only** (07c §2.1): the probe (`resolveZone`) and the rating path share one matcher; intra-card coverage overlap is blocked at card-save (VALIDATION naming both zones); cross-card overlaps are normal (that IS the product — zone systems differ per card).
7. **Stale-version semantics**: `updateRateCard` (baseVersion) and `updateShipmentProfile` (baseUpdatedAt) → CONFLICT with both payloads in `details`; concurrent pins → last-write-wins recorded in activity (pins are annotations, not arithmetic).
8. **Idempotency**: status flips, duplicates, imports, batch runs, exports, pins, deletes carry idempotency keys; a retried submit returns the original result (async-contract §5) — a double-clicked export never exports twice.
9. **Partial-result policies**: card-import delivers parsed-so-far + named bad rows; batch-comparison delivers completed rows + named remainder with retry scoped to it; exports are atomic per artifact. Progress is determinate in units (rows, destinations, artifacts) — never fake percentages (async-contract §3).
10. **Soft quota ladder**: `exportComparison` near or past the window limit → RATE_LIMIT with ladder copy (reduce → notice → reset time); comparisons, calculator runs, and card edits are NEVER rate-limited (deterministic arithmetic is unmetered — the value floor cannot be rationed).
11. **Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass.**
12. **No AI operations exist on this contract** (declaration, ai-native-patterns §1); any future assist-shaped operation requires a new contract version and a re-opened 00 exclusions discussion with the owner.
