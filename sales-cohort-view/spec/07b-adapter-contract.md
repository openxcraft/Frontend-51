# 07b — Adapter Contract: sales-cohort-view (TypeScript, v1)

SME-G pass · `SalesCohortAdapterV1` · 25 operations (within the 20–35 band). LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. **AI declaration: non-AI** — deterministic cohort arithmetic only; no operation binds any model capability (ai-native-patterns §1). Types only — no implementation. Entity semantics (Workspace, CommerceSource, ImportedSample, SeasonKind, SeasonWindow, GridQuery, GridSnapshot, CohortRow, CellValue, CohortDetail, CustomerRef, ComparisonResult, SavedView, ExportArtifact, Job, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
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
```

## Rules

1. **Determinism is the contract**: every grid, detail, comparison, and drill result is a pure function of (query, source state, season-window versions, ruleset version). Identical inputs yield byte-identical snapshots; `computeGrid` is synchronous and budget-bound (10-performance: ≤300ms at seed scale, ≤800ms at large scale) — a dataset that would exceed the budget converts the operation to a Job rather than faking a synchronous answer.
2. **Evidence pinning**: each snapshot records `rulesetVersion` + `seasonWindowVersions` + `sourceState` at compute time; `getGrid` re-reads immutably; comparisons and exports restate the pins. An edited season window or refreshed source never mutates an existing snapshot.
3. **Honest-period semantics**: the period containing `coverageEnd` is marked `inProgress` and excluded from all means and comparisons; coverage clamps are declared in `coverageClamp` (requested vs effective range), never silent. Pre-coverage customers (first order before `coverageStart`) are counted in `preCoverageCustomers` and excluded from acquisition cohorts.
4. **Suppression and caution are data, not formatting**: cells compute `suppressed` (denominator < 10 → value null, count-only) and `caution` (< 30) at compute time; the ruleset thresholds are published via `getRuleset` and versioned with the snapshot.
5. **Version-collision semantics**: `updateSeasonWindow`/`updateView` with stale `baseVersion` → CONFLICT with both payloads in `details`; `compareCohorts` against a snapshot superseded by a source refresh returns a valid NEW comparison (the old one stays readable via `getComparison`) with the supersession declared in the result — never a silent overwrite of history.
6. **Season-calendar integrity**: `createSeasonWindow`/`updateSeasonWindow` validating a zero/negative-length window → VALIDATION naming the field; overlapping an active same-kind window in the same market requires `overlapOverrideNote` (else VALIDATION naming both windows and the overlapping days); archived windows referenced by a season-anchored `computeGrid` → NOT_FOUND with the restore action named (03 CP-3 recovery).
7. **CRM boundary is structural**: `listCustomers` is the only customer-reading operation; no operation creates, updates, deletes, merges, or enriches customers; no contact data beyond `customerKey`/`displayLabel` crosses the contract (LOOP-10, roster exclusion).
8. **Idempotency**: `refreshSource`, `importOrdersSample`, `saveView`, and `exportEvidence` carries idempotency keys; a retried submit returns the original job/artifact (async-contract §5).
9. **Jobs**: sample-import and export declare partial policies (bad rows named; per-section retry with delivered sections named); source-refresh is atomic. Progress is determinate in units (rows, sections) — never fake percentages (async-contract §3). Exports carry a declared expiry with regeneration guaranteed byte-identical (snapshots immutable).
10. **Source capability language**: the commerce source appears as kind `commerce-orders` with declared coverage and a `revenueFieldMeaning` the UI renders verbatim (the metric surface says what "revenue" means — S12's definitional-baseline discipline); no vendor names anywhere (credential-contract §2).
11. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass.
