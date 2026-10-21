# 07a — Data Contract: store-performance-scorecard

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — no operation generates, scores, or transforms content by model; the scorecard engine, comp engine, and disclosure engine are deterministic arithmetic over imported records; zero AI affordances appear in any surface. TypeScript declarations for every entity follow; 07b composes them into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type ShiftClass = 'morning' | 'afternoon' | 'evening' | 'night';
export type StoreFormat = 'mall' | 'high-street' | 'community' | 'other';
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

export type KpiKey =
  | 'net-sales' | 'transactions' | 'atv'
  | 'sales-per-open-hour' | 'sales-per-labor-hour'
  | 'transactions-per-open-hour' | 'labor-cost-pct'
  | 'sales-per-sqm' | 'conversion-rate';

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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                        // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                   // async-contract §5
}

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
```

## Relationships

Workspace 1—N Store · Store 1—N OperatingPattern (versioned, effective-dated) · Store 1—N ShiftRecord (per date × class; pattern provenance pinned) · Workspace 1—N SeasonWindow · Workspace 1—N PeerGroup (N—M Store via storeIds/peerGroupIds) · Workspace 1—N CompPolicy (versioned) · Workspace 1—N WeightsPolicy (versioned) · Store 1—N Annotation (chain-wide notes have null store) · Workspace 1—N ScorecardRun (immutable snapshots pinning policy/weights/definitions versions) · ScorecardRun 1—N ExportArtifact · Job spans import/channel-fetch/export work.

## Operations (summary; typed signatures in 07b)

Workspace/session: getSession, getWorkspace, updateWorkspacePreferences. Stores: list, get, create, update. Patterns: upsert (versions), list, get. Records: importShiftRecords (Job), fetchChannelSales (Job, consent-gated), listShiftRecords, getCoverageSummary. Policy: getCompPolicy, updateCompPolicy; listSeasonWindows, upsertSeasonWindow; listPeerGroups, upsertPeerGroup. Annotations: add, list. Scorecard: runScorecard (synchronous, budget-bound), getScorecard, listScorecards, getStoreBreakdown, getKpiDefinitions, listFlags. Export: exportScorecardPack (Job), getArtifact. Platform: listJobs.

## State obligations (lifecycle invariants)

- **Runs are immutable snapshots**: a run pins comp-policy, weights, and definitions versions plus the record set it read; re-running creates a new run; nothing ever mutates history (the audit posture Noura buys, 02).
- **Patterns version forward**: editing a shift window creates a new effective-dated version; existing records keep the patternVersion they were bucketed under; re-bucketing is an explicit, logged recompute (07c rule 6) — history is never silently rewritten.
- **Records are immutable post-import**; corrections arrive as new records with a newer importJobId (dedupe on store+date+class keeps the latest, both counted in the job result). Channel overlap with pasted rows is DETECTED (externalKey+date+class) and marked, never silently dropped (the ad-spend-consolidator overlap posture).
- **Comp eligibility is computed, never stored as opinion**: every run recomputes eligibility from openedAt/closedAt + policy + coverage; reasons are text, carried on StoreResult.
- **Annotations never auto-exclude data**: they attach context; the ranking consequences flow only through coverage and policy, both disclosed.
- **Coverage floors are honesty gates**: below the ranking floor a store stays visible with its gap list but leaves the ranking (ranked:false, reason in text) — a low-coverage store is never silently averaged into the middle (the CP-5 edge, 11).
- **Weights re-normalize over present KPIs**: if labor-cost data is absent for a run's set, its weight redistributes by the declared rule and the definitions surface records it.
- **No provider names anywhere** — the channel path appears as source:'sales-channel' and an abstract need in 08.
