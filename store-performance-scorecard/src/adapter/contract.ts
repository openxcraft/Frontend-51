// VERBATIM from specs-source/store-performance-scorecard/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type StoreStatus = 'active' | 'closed' | 'pilot';
export type RecordSource = 'manual' | 'import' | 'sales-channel';
export type ComparisonBasis = 'week-matched-yoy' | 'season-anchored-yoy';
export type DayTypeScope = 'all-days' | 'weekdays' | 'weekend-days';
export type CompMethod = 'store-level' | 'store-period-level';
export interface Workspace {                 // the chain
  id: string;
  nameEn: string;
  nameAr?: string;
  market: string;                           // free-text, e.g. "KSA"
  defaultLocale: Locale;
  currency: string;                         // display/paste currency code, e.g. "SAR"
  weekendDays: number[];                    // ISO weekday numbers; policy data (12 Q-11)
  createdAt: string;
  updatedAt: string;
}
export interface Store {
  id: string;
  workspaceId: string;
  code: string;                             // stable short code, e.g. "RYD-07"
  nameEn: string;                           // bilingual by construction
  nameAr: string;
  format: StoreFormat;
  city: string;
  region: string;
  sizeSqm?: number;                         // optional: enables sales-per-sqm KPI
  openedAt: string;                         // ISO date — comp eligibility input
  closedAt?: string;
  status: StoreStatus;
  peerGroupIds: string[];
  createdAt: string;
  updatedAt: string;
}

/** Versioned shift-window declaration. Edits create versions; history is immutable. */
export interface OperatingPattern {
  id: string;
  storeId: string;
  version: number;
  labelEn: string;                          // e.g. "Standard", "Ramadan hours"
  labelAr: string;                          // e.g. "النمط القياسي", "ساعات رمضان"
  effectiveFrom: string;                    // ISO date
  effectiveTo?: string;
  timezone: string;                         // IANA name
  shifts: {
    shiftClass: ShiftClass;
    startMinute: number;                    // minutes from midnight, local
    endMinute: number;                      // may wrap past 1440 (night)
    daysOfWeek: number[];                   // ISO weekday numbers
  }[];
  createdAt: string;
}

/** One trading record: store × date × shift class. Immutable post-import. */
export interface ShiftRecord {
  id: string;
  workspaceId: string;
  storeId: string;
  date: string;                             // ISO date, store-local trading date
  shiftClass: ShiftClass;
  patternId: string;
  patternVersion: number;                   // provenance: which pattern bucketed it
  openMinutes: number;                      // computed from the pattern window
  netSalesMinor: number;                    // canonical minor units (int)
  transactionCount: number;
  laborHours: number;                       // total staffed hours for the shift
  laborCostMinor?: number;                  // optional input
  trafficCount?: number;                    // optional input (no hardware: data only)
  source: RecordSource;
  externalKey?: string;                     // channel dedupe: key + date + class
  importJobId?: string;
  receivedAt: string;
}
export interface SeasonWindow {
  id: string;
  workspaceId: string;
  labelEn: string;                          // e.g. "Ramadan 1447"
  labelAr: string;                          // e.g. "رمضان 1447"
  kind: 'lunar' | 'fixed';
  startDate: string;                        // ISO date
  endDate: string;
  market: string;
  driftNote?: string;                       // lunar windows: ±1-day disclosure
  createdAt: string;
  updatedAt: string;
}
export interface PeerGroup {
  id: string;
  workspaceId: string;
  nameEn: string;
  nameAr: string;
  rule: 'by-format' | 'by-region' | 'manual';
  storeIds: string[];
  version: number;
  updatedAt: string;
}

/** Comp eligibility policy — versioned; every run pins the version it used. */
export interface CompPolicy {
  id: string;
  workspaceId: string;
  version: number;
  method: CompMethod;                       // S1 conventions: Method 1 vs Method 2
  minTradingMonths: number;                 // default 13 (S1/S7: ≥1 year, MoM needs 13)
  updatedAt: string;
}
export interface WeightsPolicy {
  id: string;
  workspaceId: string;
  version: number;
  weights: Partial<Record<KpiKey, number>>; // sum 100 over KPIs present in the run
  updatedAt: string;
}

/** Human context attached to a store and date range — never auto-excludes data. */
export interface Annotation {
  id: string;
  workspaceId: string;
  storeId?: string;                         // absent = chain-wide note
  dateFrom: string;
  dateTo?: string;
  text: string;                             // author's own script, bidi-isolated at render
  actorMemberId: string;
  editedAt?: string;                        // edits are additive + marked, never silent
  createdAt: string;
}
export type FlagKind =
  | 'top-band' | 'attention-band'           // score bands (top/bottom decile)
  | 'season-misaligned'                     // composition delta beyond threshold
  | 'small-sample'                          // matched weeks or shifts below floor
  | 'low-coverage'                          // window coverage below ranking floor
  | 'unmatched-class';                      // class trades in <4 peer stores
export interface KpiResult {
  kpi: KpiKey;
  current: number;                          // window aggregate (KPI-unit)
  prior: number;                            // matched prior-year aggregate
  deltaPct: number | null;                  // null when prior = 0 or unmatched
  percentile: number | null;                // within peer group; null when unranked
  matchedUnits: number;                     // matched weeks (or shifts) behind the number
  caution: boolean;                         // small-sample / incomplete marks
}
export interface ShiftBreakdownRow {
  shiftClass: ShiftClass;
  tradesInClass: boolean;                   // matched-capability honesty
  kpis: KpiResult[];                        // per-class normalized KPIs
  matchedShifts: number;
}
export interface StoreResult {
  storeId: string;
  compEligibility: 'comp' | 'non-comp-new' | 'non-comp-closed'
    | 'non-comp-insufficient-history' | 'partial-period';
  eligibilityReason: string;                // text, shown via CompBadge
  coveragePct: number;                      // window coverage
  ranked: boolean;                          // false when coverage < floor
  score: number | null;                     // 0–100 composite; null when unranked
  kpis: KpiResult[];                        // whole-window KPIs
  shiftBreakdown: ShiftBreakdownRow[];
}
export interface CompositionSide {
  windowLabel: string;                      // e.g. "2026-W07→W12" / "Ramadan 1447"
  shares: { seasonWindowId: string; sharePct: number }[];
  unmatchedPct: number;                     // days in no season window
}
export interface ScorecardRun {
  id: string;
  workspaceId: string;
  basis: {
    comparison: ComparisonBasis;
    fromISOWeek: string;                    // e.g. "2026-W07"
    toISOWeek: string;
    seasonWindowId?: string;                // season-anchored basis
    dayType: DayTypeScope;
    peerGroupId: string;
    kpiSet: KpiKey[];
  };
  policyVersions: { compPolicy: number; weightsPolicy: number; definitions: number };
  composition: { current: CompositionSide; prior: CompositionSide;
                 misaligned: boolean; deltaPp: number };
  storeResults: StoreResult[];
  chainStats: { kpi: KpiKey; median: number; best: number }[];
  flags: { kind: FlagKind; storeId?: string; detail: string }[];
  generatedAt: string;
  generatedByMemberId: string;
}
export type JobKind = 'import' | 'channel-fetch' | 'export';
export interface ExportArtifact {
  id: string;
  runId: string;
  format: 'leadership-pack' | 'data-csv';
  expiresAt: string;                        // declared retention window at creation
  regenerable: boolean;
  includesDefinitionsAppendix: boolean;
}
export interface ActivityEntry {            // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'store-created' | 'pattern-versioned' | 'import-run' | 'channel-fetch'
    | 'comp-policy-updated' | 'weights-updated' | 'season-window-updated'
    | 'peer-group-updated' | 'run-generated' | 'annotation-added' | 'export-run'
    | 'consent-change';
  targetRef: string;
  detail?: string;                          // e.g. "comp policy v2 → v3, Method 1 → 2"
  at: string;
}

