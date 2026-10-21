# 07b — Adapter Contract: store-performance-scorecard (TypeScript, v1)

SME-G pass · `StoreScorecardAdapterV1` · Full 7-class error taxonomy, typed pagination, auth-agnostic session, idempotency keys on every job submit. Types only — no implementation. Entity semantics (Store, OperatingPattern, ShiftRecord, SeasonWindow, PeerGroup, CompPolicy, WeightsPolicy, Annotation, ScorecardRun, KpiResult, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
// Single contract surface. Entity types referenced below (StoreResult,
// ScorecardRun, ShiftRecord — and their fields) are declared canonically in
// 07a and are part of this contract by reference; 07b declares only the
// operational wrappers (summaries, views, jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed import rows, ungoverned patterns,
 *                                       empty comp set, missing prior-year season)
 * 'NOT_FOUND'    -> NotFoundError     (stale store/run/pattern/artifact links)
 * 'PERMISSION'   -> PermissionError   (channel consent, viewer-role mutations,
 *                                       workspace scoping)
 * 'CONFLICT'     -> ConflictError     (concurrent pattern/policy/peer-group edits)
 * 'RATE_LIMIT'   -> RateLimitError    (channel fetches, exports)
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
  workspaceId: string;                      // the chain
  role: 'owner' | 'analyst' | 'viewer';     // viewer: read + export, no mutations
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export type ShiftClass = 'morning' | 'afternoon' | 'evening' | 'night';
export type StoreFormat = 'mall' | 'high-street' | 'community' | 'other';
export type KpiKey =
  | 'net-sales' | 'transactions' | 'atv'
  | 'sales-per-open-hour' | 'sales-per-labor-hour'
  | 'transactions-per-open-hour' | 'labor-cost-pct'
  | 'sales-per-sqm' | 'conversion-rate';

export interface StoreSummary {
  id: string;
  code: string;
  nameEn: string;                           // bilingual by construction (07a)
  nameAr: string;
  format: StoreFormat;
  city: string;
  region: string;
  status: 'active' | 'closed' | 'pilot';
  openedAt: string;
  closedAt?: string;
  peerGroupIds: string[];
  recordCount: number;                      // total shift records held
  latestCoveragePct?: number;
}

export interface PatternSummary {
  id: string;
  storeId: string;
  version: number;
  labelEn: string;
  labelAr: string;
  effectiveFrom: string;
  effectiveTo?: string;
  timezone: string;
  shiftClasses: ShiftClass[];               // classes declared by windows
}

export interface RecordRow {
  id: string;
  storeId: string;
  date: string;
  shiftClass: ShiftClass;
  patternVersion: number;
  openMinutes: number;
  netSalesMinor: number;
  transactionCount: number;
  laborHours: number;
  laborCostMinor?: number;
  trafficCount?: number;
  source: 'manual' | 'import' | 'sales-channel';
  receivedAt: string;
}

export interface RunSummary {
  id: string;
  basis: {
    comparison: 'week-matched-yoy' | 'season-anchored-yoy';
    fromISOWeek: string;
    toISOWeek: string;
    seasonWindowId?: string;
    dayType: 'all-days' | 'weekdays' | 'weekend-days';
    peerGroupId: string;
    kpiSet: KpiKey[];
  };
  policyVersions: { compPolicy: number; weightsPolicy: number; definitions: number };
  misaligned: boolean;                      // composition disclosure flag
  generatedAt: string;
  rankedStoreCount: number;
  topStoreId?: string;
  attentionStoreId?: string;
}

// Full entity shapes (Workspace, Store, OperatingPattern, ShiftRecord,
// SeasonWindow, PeerGroup, CompPolicy, WeightsPolicy, Annotation,
// KpiResult, StoreResult, ShiftBreakdownRow, CompositionSide, ScorecardRun,
// Job, ExportArtifact, ActivityEntry) are declared canonically in 07a. 07b
// adds the derived display fields:
export interface StoreBreakdownView {
  runId: string;
  storeId: string;
  compEligibility: StoreResult['compEligibility'];
  eligibilityReason: string;
  coveragePct: number;
  ranked: boolean;
  score: number | null;
  kpis: KpiResult[];
  shiftBreakdown: ShiftBreakdownRow[];
  annotations: Annotation[];                // joined for the drill surface
}

export interface CoverageSummary {
  fromISOWeek: string;
  toISOWeek: string;
  stores: {
    storeId: string;
    expectedRows: number;
    presentRows: number;
    coveragePct: number;
    gaps: { date: string; shiftClass: ShiftClass }[];
  }[];
}

export interface Job<T> {
  id: string;
  kind: 'import' | 'channel-fetch' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface StoreScorecardAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // workspace
  getWorkspace(): Promise<Result<Workspace, AdapterError>>;
  updateWorkspacePreferences(patch: {
    defaultLocale?: 'ar' | 'en';
    weekendDays?: number[];
    currency?: string;
  }): Promise<Result<Workspace, AdapterError>>;

  // stores
  createStore(input: {
    code: string; nameEn: string; nameAr: string;
    format: StoreFormat; city: string; region: string;
    openedAt: string; sizeSqm?: number;
  }): Promise<Result<StoreSummary, AdapterError>>;
  listStores(query: {
    filter?: { format?: StoreFormat[]; region?: string; status?: StoreSummary['status'][]; peerGroupId?: string };
    search?: string;                    // normalized bilingual search (rtl-rules §4)
    sort: 'code' | 'nameEn' | 'openedAt' | 'recordCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<StoreSummary>, AdapterError>>;
  getStore(id: string): Promise<Result<StoreSummary, AdapterError>>;
  updateStore(id: string, patch: {
    nameEn?: string; nameAr?: string; format?: StoreFormat;
    city?: string; region?: string; sizeSqm?: number;
    status?: 'active' | 'closed' | 'pilot'; closedAt?: string;
    peerGroupIds?: string[];
  }): Promise<Result<StoreSummary, AdapterError>>;

  // operating patterns (versioned; edits create versions — 07a)
  upsertOperatingPattern(input: {
    storeId: string;
    labelEn: string; labelAr: string;
    effectiveFrom: string; effectiveTo?: string;
    timezone: string;
    shifts: { shiftClass: ShiftClass; startMinute: number; endMinute: number; daysOfWeek: number[] }[];
  }): Promise<Result<PatternSummary, AdapterError>>;
  listOperatingPatterns(query: {
    storeId?: string;
    filter?: { activeOn?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<PatternSummary>, AdapterError>>;
  getOperatingPattern(id: string): Promise<Result<PatternSummary & {
    shifts: { shiftClass: ShiftClass; startMinute: number; endMinute: number; daysOfWeek: number[] }[];
    supersededByVersion?: number;
  }, AdapterError>>;

  // shift records (manual/import = the LOOP-5 always-available path)
  importShiftRecords(input: {
    records: {
      storeCode: string; date: string; shiftClass: ShiftClass;
      netSalesMinor: number; transactionCount: number; laborHours: number;
      laborCostMinor?: number; trafficCount?: number;
    }[];
    source: 'manual' | 'import';
    idempotencyKey: string;            // async-contract §5 — double-submit never double-imports
  }): Promise<Result<Job<{ imported: number; updatedInPlace: number; invalidRows: string[]; unknownStoreCodes: string[] }>, AdapterError>>;
  fetchChannelSales(input: {
    fromISOWeek: string; toISOWeek: string;
    storeIds?: string[];               // omitted = all governed stores
    idempotencyKey: string;
  }): Promise<Result<Job<{ added: number; updatedInPlace: number; overlaps: string[] }>, AdapterError>>;
  listShiftRecords(query: {
    storeId?: string;
    filter?: { fromISOWeek?: string; toISOWeek?: string; shiftClass?: ShiftClass[]; source?: RecordRow['source'][] };
    sort: 'date' | 'netSalesMinor' | 'receivedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<RecordRow>, AdapterError>>;
  getCoverageSummary(query: {
    fromISOWeek: string; toISOWeek: string; storeIds?: string[];
  }): Promise<Result<CoverageSummary, AdapterError>>;

  // policy (versioned)
  getCompPolicy(): Promise<Result<CompPolicy, AdapterError>>;
  updateCompPolicy(input: {
    method: 'store-level' | 'store-period-level';
    minTradingMonths: number;
    baseVersion: number;
  }): Promise<Result<CompPolicy, AdapterError>>;
  listSeasonWindows(query: {
    filter?: { market?: string; kind?: 'lunar' | 'fixed' };
    cursor?: string; limit: number;
  }): Promise<Result<Page<SeasonWindow>, AdapterError>>;
  upsertSeasonWindow(input: {
    id?: string;                         // absent = create
    labelEn: string; labelAr: string;
    kind: 'lunar' | 'fixed';
    startDate: string; endDate: string;
    market: string; driftNote?: string;
  }): Promise<Result<SeasonWindow, AdapterError>>;
  listPeerGroups(query: {
    cursor?: string; limit: number;
  }): Promise<Result<Page<PeerGroup>, AdapterError>>;
  upsertPeerGroup(input: {
    id?: string;
    nameEn: string; nameAr: string;
    rule: 'by-format' | 'by-region' | 'manual';
    storeIds: string[];
    baseVersion?: number;
  }): Promise<Result<PeerGroup, AdapterError>>;

  // annotations (context, never auto-exclusion — 07a)
  addAnnotation(input: {
    storeId?: string; dateFrom: string; dateTo?: string; text: string;
  }): Promise<Result<Annotation, AdapterError>>;
  listAnnotations(query: {
    storeId?: string;
    filter?: { dateFrom?: string; dateTo?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Annotation>, AdapterError>>;

  // scorecard (deterministic; synchronous — budget-bound per 10-performance)
  runScorecard(input: {
    comparison: 'week-matched-yoy' | 'season-anchored-yoy';
    fromISOWeek: string; toISOWeek: string;
    seasonWindowId?: string;            // required when comparison = 'season-anchored-yoy'
    dayType: 'all-days' | 'weekdays' | 'weekend-days';
    peerGroupId: string;
    kpiSet: KpiKey[];
  }): Promise<Result<ScorecardRun, AdapterError>>;
  getScorecard(runId: string): Promise<Result<ScorecardRun, AdapterError>>;
  listScorecards(query: {
    filter?: { fromISOWeek?: string; toISOWeek?: string; peerGroupId?: string };
    sort: 'generatedAt' | 'fromISOWeek';
    cursor?: string; limit: number;
  }): Promise<Result<Page<RunSummary>, AdapterError>>;
  getStoreBreakdown(query: {
    runId: string; storeId: string;
  }): Promise<Result<StoreBreakdownView, AdapterError>>;
  getKpiDefinitions(): Promise<Result<{
    definitionsVersion: number;
    formulas: { kpi: KpiKey; formulaEn: string; formulaAr: string; unit: string; requires?: string }[];
    compRules: { ruleEn: string; ruleAr: string }[];
    scoring: { ruleEn: string; ruleAr: string };
  }, AdapterError>>;
  listFlags(query: {
    runId: string;
    filter?: { kind?: string[]; storeId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<{ kind: string; storeId?: string; detail: string }>, AdapterError>>;

  // export handoff (abstract delivery; manual path is download/copy — 08 N4)
  exportScorecardPack(input: {
    runId: string;
    format: 'leadership-pack' | 'data-csv';
    options: { definitionsAppendix?: boolean; shiftLensGrid?: boolean };
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
}
```

## Rules

1. **Determinism is the contract**: `runScorecard` is pure over (record set, patterns, policy, weights, season windows) — the same inputs yield the same run, byte-identical (07c §6); the adapter never injects randomness, ranking jitter, or "freshness" adjustments.
2. **Comp honesty**: a window whose comp-eligible set is empty → VALIDATION naming the empty set and the eligibility reasons (the product refuses to rank non-comparable data); eligibility reasons ride on every StoreResult as text, never as an inferred color.
3. **Basis validation**: `runScorecard` with `comparison:'season-anchored-yoy'` and a season window lacking a prior-year occurrence → VALIDATION naming the missing season; a window whose stores lack governed patterns → VALIDATION directing pattern authoring (records cannot be bucketed without windows).
4. **Versioned mutations**: `updateCompPolicy`/`upsertPeerGroup` with stale `baseVersion` → CONFLICT with both payloads in `details`; `upsertOperatingPattern` on an overlapping effective range for the same store → CONFLICT naming the overlap (the UI offers the explicit re-version choice, P04 level 2).
5. **Import partiality**: malformed rows are named (`invalidRows`) and skipped; well-formed rows land (partial policy per async-contract §4); unknown store codes are listed (`unknownStoreCodes`) with create-or-fix offered in the UI — the import never invents stores silently. Duplicate (store, date, class) rows update in place, both counted — never silently dropped. Idempotency-key replay returns the original job.
6. **Channel consent + overlap**: `fetchChannelSales` without a granted sales-data consent → PERMISSION naming the capability class in capability language (credential-contract §2/§4) — never a vendor name; fetched rows overlapping pasted records are detected (externalKey + date + class) and returned in `overlaps`, both versions kept with the newer authoritative — never a silent overwrite.
7. **Viewer-role enforcement**: every mutating operation (stores, patterns, imports, policy, peer groups, annotations, exports except download) under a viewer session → PERMISSION naming the role boundary (11 C).
8. **Coverage floors surface as data**: `runScorecard` ranks only stores above the coverage floor; below-floor stores stay in `storeResults` with `ranked:false` and the gap list available via `getCoverageSummary` — never silently averaged into the middle.
9. **Immutability**: runs are immutable snapshots; artifacts regenerate from run state deterministically; `getArtifact` on expiry → NOT_FOUND with the regenerable path; export partial failure retries per-section only (async-contract §4).
10. **Typed pagination on every list**; cursors opaque; search fields normalize per rtl-rules §4 (alef/hamza variants, taa marbuta/heh, yaa forms, tashkeel stripped). No orphan methods — 03 coverage table verified at Critic pass.
