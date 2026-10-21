# 07a — Data Contract: sales-cohort-view

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — every computation is deterministic cohort arithmetic over order data; no generation, no scoring, no prediction, no model capability exists anywhere in the contract, and the UI carries zero AI affordances. TypeScript declarations for every entity follow; 07b composes these into operation signatures.

```ts
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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                  // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;             // async-contract §5
}

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
```

## Relationships

Workspace 1—N SeasonWindow · Workspace 1—1 CommerceSource (or N ImportedSample as fallback data path) · GridQuery → GridSnapshot (immutable, pins query + rulesetVersion + seasonWindowVersions + sourceState) · GridSnapshot 1—N CohortRow (per acquisition window) · CohortRow 1—N CellValue per metric · CohortDetail (derived read from a snapshot) · CohortRow/CustomerRef via the customer drill (membership = orders in the acquisition window; N—M through the snapshot's computed membership) · GridSnapshot 1—N ComparisonResult (two CohortRow refs) · SavedView N—1 GridQuery (a view is a stored query) · ExportArtifact → snapshot/comparison refs · Job spans source-refresh/sample-import/export work · ActivityEntry logs every consequential mutation.

## State obligations

- **Snapshots are immutable and complete**: a GridSnapshot carries all four metric matrices at compute time; re-reads never recompute (byte-identical); a new compute (different query, refreshed source, edited windows) creates a NEW snapshot. Evidence reproducibility is a data-contract property, not a UI promise.
- **Acquisition uniqueness**: a customer belongs to exactly one acquisition cohort per snapshot (first order within coverage — the vendor-semantic S2), and a customer's pre-coverage orders are excluded with a declared pre-coverage customer count (coverage honesty).
- **Evidence pinning travels**: every snapshot records the season-window VERSIONS and rulesetVersion it ran under; comparisons restate them; exports embed them. An edited season window never rewrites a past grid.
- **Views are queries, not caches**: opening a saved view re-computes against current data; the view's version bumps only on edit of name/query.
- **Season windows are versioned, never silently overwritten**: curated provenance is preserved through edits (`edited-from-curated`); archives are reversible states, and archived windows referenced by season-anchored queries surface a typed restore path (NOT_FOUND semantics, 07b rule 4).
- **Partial-result policies**: sample-import delivers imported-so-far + named bad rows; export delivers per-section partial with per-section retry (async-contract §4); source-refresh is atomic (freshness moves only on full success).
- **No order storage**: the product stores its own specs (windows, views, comparisons, artifacts, jobs, activity); order rows exist only inside the bound source or the bounded imported sample — the adapter computes over them and never persists raw orders into workspace state.
- **No provider names anywhere**: the source appears as kind 'commerce-orders' and an abstract need in 08.
