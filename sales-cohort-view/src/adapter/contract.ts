// VERBATIM from specs-source/sales-cohort-view/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below are declared
// canonically in 07a and are part of this contract by reference; 07b declares
// only the operational wrappers (summaries, drill views, job payloads) its
// signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed sample rows, zero-length season windows, unresolvable comparison requests)
 * 'NOT_FOUND'    -> NotFoundError     (stale snapshot/comparison/artifact links, archived season window referenced)
 * 'PERMISSION'   -> PermissionError   (workspace scoping, source-scoped label lookups, viewer-role mutations)
 * 'CONFLICT'     -> ConflictError     (stale baseVersion on window/view edits, superseded-snapshot comparisons)
 * 'RATE_LIMIT'   -> RateLimitError    (source refresh cadence, export bursts)
 * 'NETWORK'      -> NetworkError      (source reachability, list fetches, job polling, artifact delivery)
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
  role: 'owner' | 'editor' | 'viewer';   // viewer: read + export, no mutations
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export interface SourceStateView extends CommerceSource {
  sampleOnly: boolean;                   // true when the workspace runs on imported-sample data (LOOP-5 posture)
  preCoverageCustomers: number;          // honesty counter — customers whose first order precedes declared coverage
}

export interface SeasonWindowSummary {
  id: string;
  market: 'KSA' | 'UAE';
  kindId: SeasonKindId;
  yearLabel: string;
  labelEn: string;
  labelAr?: string;
  gregorianStart: string;
  gregorianEnd: string;
  driftDays: 0 | 1;
  provenance: 'curated' | 'edited-from-curated' | 'workspace-authored';
  status: 'active' | 'archived';
  version: number;
  updatedAt: string;
}

export interface ViewSummary {
  id: string;
  name: string;
  nameAr?: string;
  market: 'KSA' | 'UAE';
  granularity: 'week' | 'month';
  anchorMode: 'gregorian' | 'season-anchored';
  shared: boolean;
  version: number;
  updatedAt: string;
}

export interface Job<T> {
  id: string;
  kind: 'source-refresh' | 'sample-import' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface SalesCohortAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // workspace
  updateWorkspace(input: {
    defaultLocale?: 'ar' | 'en';
    defaultMarket?: 'KSA' | 'UAE';
    calendarMethodDisclosure?: string;
    defaultGranularity?: 'week' | 'month';
  }): Promise<Result<Workspace, AdapterError>>;

  // data path: bound source (abstract; 08 N1) and the LOOP-5 sample path
  getSource(): Promise<Result<SourceStateView, AdapterError>>;
  refreshSource(input: {
    idempotencyKey: string;              // async-contract §5 — double-submit never double-refreshes
  }): Promise<Result<Job<{ coverageStart: string; coverageEnd: string; lastSyncAt: string }>, AdapterError>>;
  importOrdersSample(input: {
    rows: { orderDate: string; customerKey: string; netRevenue: number; channel?: string; market: 'KSA' | 'UAE' }[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ imported: number; duplicates: number; invalidRows: string[]; coverageStart: string; coverageEnd: string }>, AdapterError>>;

  // season calendar (the differentiating data)
  listSeasonKinds(): Promise<Result<SeasonKind[], AdapterError>>;
  listSeasonWindows(query: {
    filter?: { market?: ('KSA' | 'UAE')[]; kindId?: SeasonKindId[]; yearLabel?: string; status?: ('active' | 'archived')[] };
    sort: 'gregorianStart' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<SeasonWindowSummary>, AdapterError>>;
  getSeasonWindow(id: string): Promise<Result<SeasonWindowSummary & {
    phases: SeasonPhase[]; hijriStart?: string; hijriEnd?: string; overlapOverrideNote?: string;
  }, AdapterError>>;
  createSeasonWindow(input: {
    market: 'KSA' | 'UAE';
    kindId: SeasonKindId;
    yearLabel: string;
    labelEn: string; labelAr?: string;
    gregorianStart: string; gregorianEnd: string;
    phases: SeasonPhase[];
    overlapOverrideNote?: string;        // required when the window overlaps a same-kind active window (03 CP-3 edge)
  }): Promise<Result<SeasonWindowSummary, AdapterError>>;
  updateSeasonWindow(id: string, patch: {
    gregorianStart?: string; gregorianEnd?: string;
    phases?: SeasonPhase[];
    labelEn?: string; labelAr?: string;
    status?: 'active' | 'archived';
    overlapOverrideNote?: string;
    baseVersion: number;                 // CONFLICT with both payloads when stale
  }): Promise<Result<SeasonWindowSummary, AdapterError>>;

  // the grid (deterministic, synchronous, budget-bound per 10-performance)
  computeGrid(query: GridQuery): Promise<Result<GridSnapshot, AdapterError>>;
  getGrid(snapshotId: string): Promise<Result<GridSnapshot, AdapterError>>;   // immutable re-read
  getCohortDetail(snapshotId: string, cohortId: string): Promise<Result<CohortDetail, AdapterError>>;

  // customer drill (read-only; the CRM boundary is structural — 08)
  listCustomers(query: {
    snapshotId: string; cohortId: string;
    periodIndex?: number;                // cell-scoped drill; omitted = whole cohort
    filter?: { hasLabel?: boolean; minOrders?: number };
    search?: string;                     // matches customerKey + displayLabel, normalized (rtl-rules §4)
    sort: 'firstOrderDate' | 'orderCount' | 'revenueToDate';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CustomerRef>, AdapterError>>;

  // season-aligned comparison (deterministic; the signature flow CP-4)
  compareCohorts(input: {
    snapshotId: string;
    leftCohortId: string; rightCohortId: string;
    metric: MetricKey;
    alignment: 'season-aligned' | 'period-aligned' | 'cross-season';
  }): Promise<Result<ComparisonResult, AdapterError>>;
  getComparison(comparisonId: string): Promise<Result<ComparisonResult, AdapterError>>;

  // saved views
  saveView(input: {
    name: string; nameAr?: string; query: GridQuery; shared: boolean;
    idempotencyKey: string;
  }): Promise<Result<ViewSummary, AdapterError>>;
  listViews(query: {
    filter?: { market?: ('KSA' | 'UAE')[]; anchorMode?: ('gregorian' | 'season-anchored')[]; shared?: boolean };
    sort: 'updatedAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ViewSummary>, AdapterError>>;
  updateView(id: string, patch: {
    name?: string; nameAr?: string; query?: GridQuery; shared?: boolean;
    baseVersion: number;
  }): Promise<Result<ViewSummary, AdapterError>>;
  deleteView(id: string): Promise<Result<{ deleted: true; sharedLinksDied: number }, AdapterError>>;

  // evidence export (abstract delivery; manual path is download/copy — 08 N2)
  exportEvidence(input: {
    scope: { snapshotId?: string; comparisonId?: string };   // exactly one
    options: { includeSeasonWindowVersions: true; includeRuleset: true };
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getActivity(query: {
    filter?: { action?: string[]; actorMemberId?: string[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntry>, AdapterError>>;
  getRuleset(): Promise<Result<{
    version: string;
    metrics: { key: MetricKey; formula: string; denominator: string; decimalPolicy: string }[];
    thresholds: { smallSampleCaution: 30; suppression: 10; compositionChipFloor: 0.05 };
    rules: string[];                     // acquisition, bucketing, in-progress, coverage, pre-coverage — 07c §2
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type Market = 'KSA' | 'UAE';                 // workspace market scope (country-level filter, never a mapped territory)
export type Granularity = 'week' | 'month';         // ISO week or Gregorian month buckets
export type MetricKey = 'active-customers' | 'repeat-purchase-rate'
  | 'cumulative-revenue-per-customer' | 'orders-per-active-customer';
export type SeasonKindId = 'ramadan' | 'eid-al-fitr' | 'eid-al-adha'
  | 'white-friday' | 'national-day' | 'back-to-school' | 'custom';

// ---- Workspace ----
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;
  defaultMarket: Market;
  calendarMethodDisclosure: string;   // e.g. "Hijri dates presented per Umm al-Qura; ±1 day moon-sighting drift disclosed" (portfolio Q-5)
  defaultGranularity: Granularity;
}

// ---- Data path: bound source or imported sample (LOOP-5) ----
export interface CommerceSource {
  id: string;
  kind: 'commerce-orders';           // capability class, never a vendor (credential-contract §2)
  state: 'bound' | 'syncing' | 'stale' | 'failed';
  coverageStart: string;             // ISO date — declared coverage window start
  coverageEnd: string;               // ISO date — declared coverage window end
  lastSyncAt: string | null;
  revenueFieldMeaning: string;       // workspace-visible meaning of the source's revenue column (net of refunds/discounts per its own declaration)
}
export interface ImportedSample {    // the always-available manual path
  id: string;
  importedAt: string;
  rowCount: number;
  duplicateRowCount: number;
  coverageStart: string;             // derived from row dates (honest, declared)
  coverageEnd: string;
}

// ---- Season calendar (the product's differentiating data) ----
export interface SeasonPhase {
  name: 'build-up' | 'peak' | 'wind-down';
  startDayOffset: number;            // day offset from window start (0-based)
  endDayOffset: number;              // inclusive offset; phases tile the window
}
export interface SeasonWindow {
  id: string;
  workspaceId: string;
  market: Market;
  kindId: SeasonKindId;
  yearLabel: string;                 // e.g. "1447" (lunar kinds) or "2025" (fixed-season kinds)
  labelEn: string;
  labelAr?: string;                  // authored Arabic label (bidi-isolated at render)
  gregorianStart: string;            // ISO date
  gregorianEnd: string;              // ISO date, inclusive
  hijriStart?: string;               // presented per workspace calendar-method disclosure
  hijriEnd?: string;
  phases: SeasonPhase[];
  driftDays: 0 | 1;                  // moon-sighting-dependent kinds declare 1 (±1 day); fixed-season kinds 0
  provenance: 'curated' | 'edited-from-curated' | 'workspace-authored';
  status: 'active' | 'archived';
  overlapOverrideNote?: string;      // required when overlapping another same-kind window at save
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface SeasonKind {
  id: SeasonKindId;
  labelEn: string;
  labelAr: string;
  drift: 0 | 1;                      // ramadan/eid kinds: 1; white-friday/national-day/back-to-school/custom: 0
  defaultWindowPerMarket: Partial<Record<Market, { start: string; end: string; phases: SeasonPhase[] }>>;
}

// ---- Grid computation (deterministic; snapshots immutable) ----
export interface GridQuery {
  market: Market;
  granularity: Granularity;
  dateRange: { from: string; to: string };            // ISO dates, clamped to source coverage with the clamp declared
  metric: MetricKey;                                  // the metric rendered at compute; snapshot carries all four
  anchorMode: 'gregorian' | 'season-anchored';
  seasonKindFilter?: SeasonKindId[];                  // season-anchored mode: which kinds form acquisition windows
  channelFilter?: string[];                           // optional order-attribute filters (declared source attributes)
  includeNonSeasonalBuckets: boolean;                 // season-anchored mode: complement buckets for context
}
export interface SeasonCompositionPart {
  windowId: string;
  kindId: SeasonKindId;
  shareOfWindowDays: number;          // 0–1, share of the cohort acquisition window's days overlapping the season window
}
export interface CohortRow {
  cohortId: string;
  labelEn: string;                    // e.g. "Ramadan 1447 — peak" or "2026-03"
  labelAr?: string;
  acquisitionWindow: { start: string; end: string; windowKind: 'gregorian-period' | 'season-window'; windowId?: string };
  size: number;                       // N0 — customers acquired in the window
  composition: SeasonCompositionPart[];  // sorted desc by share; shares sum ≤ 1 (remainder = non-seasonal)
}
export interface CellValue {
  periodIndex: number;                // 0 = acquisition period (its repeat metric is 100%/full by construction — S2 convention, disclosed)
  denominator: number;                // always carried (N0 for rates; active customers for orders-per-active)
  value: number | null;               // null only for suppressed cells (denominator < 10 → count-only rendering)
  suppressed: boolean;                // true when denominator < 10 (07c §2.4)
  caution: boolean;                   // true when denominator < 30 (small-sample caution mark)
  inProgress: boolean;                // true when the period extends past coverage end
  seasonOverlap: { windowId: string; kindId: SeasonKindId }[];  // observation-side season marks (e.g. column crosses White Friday)
}
export interface GridSnapshot {
  id: string;
  query: GridQuery;                   // the exact query, pinned
  cohortRows: CohortRow[];
  cells: Record<MetricKey, CellValue[][]>;  // [cohortIndex][periodIndex] per metric — all four computed at once
  periodLabels: string[];             // acquisition-relative ("P0", "P1"...) with absolute date ranges carried separately
  coverageClamp: { requestedFrom: string; requestedTo: string; effectiveFrom: string; effectiveTo: string } | null;
  rulesetVersion: string;             // the computation ruleset this snapshot ran under (getRuleset)
  seasonWindowVersions: { windowId: string; version: number }[];  // evidence pin — comparisons restate these
  sourceState: { coverageStart: string; coverageEnd: string; lastSyncAt: string | null };
  generatedAt: string;
}

// ---- Cohort detail + customer drill (derived reads from a snapshot) ----
export interface CohortDetail {
  snapshotId: string;
  cohortId: string;
  row: CohortRow;
  compositionSentenceEn: string;      // plain-arithmetic disclosure (05/06 CompositionSentence data)
  compositionSentenceAr: string;
  curve: { periodIndex: number; activeCustomers: number; repeatPurchaseRate: number | null;
           cumulativeRevenuePerCustomer: number; ordersPerActiveCustomer: number | null }[];
  summary: {
    size: number;
    repeatPurchaseRateAtPeriod?: { periodIndex: number; value: number | null; denominator: number };
    cumulativeRevenuePerCustomerAtPeriod?: { periodIndex: number; value: number; denominator: number };
    suppressionNote?: string;         // set when any quoted period is suppressed
  };
}
export interface CustomerRef {
  customerKey: string;                // the bound source's key — the product's own join key
  displayLabel?: string;              // source-provided label; missing labels are stated, never blank-faked
  firstOrderDate: string;
  orderCount: number;
  revenueToDate: number;
}

// ---- Comparison (immutable) ----
export interface ComparisonResult {
  id: string;
  snapshotId: string;
  left: { cohortId: string; labelEn: string; labelAr?: string; size: number; composition: SeasonCompositionPart[] };
  right: { cohortId: string; labelEn: string; labelAr?: string; size: number; composition: SeasonCompositionPart[] };
  alignment: 'season-aligned' | 'period-aligned' | 'cross-season';
  driftDisclosures: { cohortId: string; driftDays: 0 | 1 }[];
  sizeImbalanceRatio: number;         // larger/smaller; >3 carries the imbalance note
  sharedCompletePeriods: number;      // truncation honesty (03 CP-4 edge)
  series: { periodIndex: number; left: number | null; right: number | null;
            delta: number | null; denominatorLeft: number; denominatorRight: number }[];  // per active metric at read
  rulesetVersion: string;
  generatedAt: string;
}

// ---- Saved views, exports, jobs, activity ----
export interface SavedView {
  id: string;
  name: string;
  nameAr?: string;
  query: GridQuery;                   // a view is a query, not a cache — re-runs against current data on open
  createdBy: string;
  shared: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface ExportArtifact {
  id: string;
  scope: { snapshotId?: string; comparisonId?: string };
  format: 'evidence-pack';            // grid + comparison + season-window versions + ruleset version
  expiresAt: string;                  // declared retention at creation
  regenerable: boolean;               // always true — snapshots are immutable (byte-identical regeneration)
}
export type JobKind = 'source-refresh' | 'sample-import' | 'export';
export interface ActivityEntry {      // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'workspace-settings-changed' | 'season-window-created' | 'season-window-updated'
    | 'source-refresh-run' | 'sample-imported' | 'view-saved' | 'view-updated' | 'view-deleted'
    | 'comparison-created' | 'export-run';
  targetRef: string;
  detail?: string;                    // e.g. window version bump + overlap override reason — the audit trail
  at: string;
}

