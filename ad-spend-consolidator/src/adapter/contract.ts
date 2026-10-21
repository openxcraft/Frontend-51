// VERBATIM from specs-source/ad-spend-consolidator/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (SpendLineItem,
// ConsolidationSnapshot, OverlapFinding, HolidayMoment, BudgetLine, FxRate —
// and their fields) are declared canonically in 07a and are part of this
// contract by reference; 07b declares only the operational wrappers
// (summaries, views, jobs) its signatures need. This product is DECLARED
// NON-AI (ai-native-patterns §1): no operation invokes any AI capability;
// the deterministic engines below (conversion, overlap detection, overlay
// math, pacing) are the whole of the computation.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed paste rows, policy sanity — epsilon range, budget-line currency, anchor rules, resolution without reason, same-currency revision rule)
 * 'NOT_FOUND'    -> NotFoundError     (stale snapshot/connection/moment/budget/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (capability consent for channel pulls and rate proposals, workspace scoping, viewer-role mutations)
 * 'CONFLICT'     -> ConflictError     (concurrent connection/moment/budget/policy edits, overlap resolutions, revision imports against a superseded batch)
 * 'RATE_LIMIT'   -> RateLimitError    (consolidation runs, report-pack exports)
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
  workspaceId: string;
  role: 'owner' | 'analyst' | 'channel-manager' | 'viewer';   // viewer: finance seat — reads ledger/receipts/deltas, exports packs, no policy/reconciliation mutations
  locale: 'ar' | 'en';                                        // chrome direction; data direction follows data (rtl-rules §2)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export interface ChannelConnectionSummary {
  id: string;
  name: string;
  kind: 'search-ads-class' | 'social-ads-class' | 'video-ads-class' | 'marketplace-ads-class' | 'offline-media-class' | 'agency-report-class' | 'other-class';
  nativeCurrency: string;
  cadence: 'daily' | 'weekly' | 'monthly';
  metricShape: 'spend-date' | 'report-date';
  dedupePriority: number;
  status: 'unverified' | 'active' | 'degraded' | 'revoked';
  credential?: { state: string; kindLabel: string; lastVerifiedAt?: string };
  freshness: 'fresh' | 'late-cadence' | 'stale' | 'no-data';   // derived: latest line-item reportDate vs cadence expectation
  lineItemCount: number;
  version: number;
  updatedAt: string;
}

export interface ImportJobResult {
  kind: 'import' | 'revision';
  batchId: string;
  imported: number;
  superseded: number;                 // revision-batch rows that superseded older revisions
  appended: number;                   // new (connection, externalKey, spendDate) rows
  invalidRows: string[];              // named bad rows — partial policy (async-contract §4)
}

export interface SnapshotSummary {
  id: string;
  version: number;
  windowStart: string;
  windowEnd: string;
  computedAt: string;
  status: 'current' | 'superseded';
  supersededByVersion?: number;
  health: ConsolidationSnapshot['health'];
  totals: ConsolidationSnapshot['totals'];
}

export interface ConsolidationJobResult {
  snapshot: SnapshotSummary;
  mode: 'deterministic';              // non-AI declaration made explicit in every result
  overlapsOpen: number;
  overlapsResolvedFolded: number;     // resolutions applied by this run (07a state obligation)
}

export interface RevisionDelta {
  fromVersion: number;
  toVersion: number;
  lineItemDeltas: {
    lineItemId: string;
    externalKey: string;
    day: string;
    connectionId: string;
    deltaClass: 'amount-revised' | 'rate-changed' | 'basis-changed' | 'new' | 'superseded';
    previousReportingAmount?: number;
    currentReportingAmount?: number;
    delta: number;
  }[];
  netDelta: number;
  affectedResolutions: { overlapFindingId: string; state: string }[];   // re-checked resolutions (07c rule 5)
}

export interface BreakdownRow {
  connectionId: string;
  connectionName: string;
  kind: ChannelConnectionSummary['kind'];
  nativeCurrency: string;
  amountReporting: number;
  sharePct: number;
  lineItemCount: number;
  receiptSample: { nativeAmount: number; rate?: number; basis: string }[];   // up to 3 per row — expanders fetch full receipts via listSpendLines
  freshness: ChannelConnectionSummary['freshness'];
}

export interface TimelinePoint {
  day: string;
  amountReporting: number;
  bands: { momentId: string; nameEn: string; nameAr: string; occurrenceLabel: string }[];
  rateUnavailable: boolean;
}

export interface SpendLineRow {               // raw ledger browser rows (virtualized above 200 — P19)
  id: string;
  connectionId: string;
  connectionName: string;
  externalKey: string;                        // bidi-isolated at render (rtl-rules §2)
  campaignRef: string;
  spendDate: string;
  reportDate: string;
  nativeAmount: number;
  nativeCurrency: string;
  revision: number;
  superseded: boolean;
  batchId: string;
  dedupeState: NormalizedSpendRecord['dedupeState'];
}

export interface OverlapFindingView {
  finding: OverlapFinding;                    // 07a full shape
  lineItems: [SpendLineItem, SpendLineItem];  // the pair — evidence travels with the finding (03 CP-3.2)
  connectionPolicies: [ChannelConnectionSummary, ChannelConnectionSummary];
}

export interface FxRateView {
  rates: FxRate[];                            // declared policy data; provenance printed (08 N3)
  disclosure: string;                         // "declared workspace policy — not a market feed" (11 §B)
  missingPairs: { from: string; to: string }[];   // active-connection pairs with no covering rate rows
}

export interface MomentSummary {
  id: string;
  nameEn: string;
  nameAr: string;
  kind: 'hijri-anchored' | 'gregorian-fixed' | 'movable-gregorian';
  anchor: unknown;                            // AnchorRule per 07a — union serialized
  lengthDays: number;
  scope: ('KSA' | 'UAE' | 'EGY' | 'OTHER')[];
  status: 'active' | 'retired';
  version: number;
  nextOccurrences: OverlayWindow[];           // preview: the next two computed windows (MomentEditor renders before save)
}

export interface BudgetLineSummary {
  id: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  amount: number;
  momentRef?: { momentId: string; occurrenceLabel: string };
  status: 'draft' | 'active' | 'closed';
  version: number;
  amendmentCount: number;
}

export interface Job<T> {                     // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'import' | 'consolidation' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                     // async-contract §5
  workspaceRef?: string;                      // link-to-context for the jobs console (04 S10)
}

// ---- Contract ----

export interface AdSpendConsolidatorAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // channel kinds & connections (capability language — kind, never vendor)
  listChannelKinds(): Promise<Result<ChannelKindDescriptor[], AdapterError>>;
  listChannelConnections(query: {
    filter?: { kind?: string[]; status?: string[]; freshness?: string[] };
    search?: string;                          // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'name' | 'lineItemCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ChannelConnectionSummary>, AdapterError>>;
  createChannelConnection(input: {
    name: string;
    kind: ChannelKindDescriptor['kind'];
    nativeCurrency: string;                   // ISO 4217
    cadence: 'daily' | 'weekly' | 'monthly';
    metricShape: 'spend-date' | 'report-date';
    fxBasis?: 'daily-rate' | 'monthly-average';   // per-connection override of the workspace policy basis (07a)
    dedupePriority: number;                   // ≥ 1; duplicate priority -> VALIDATION
  }): Promise<Result<ChannelConnectionSummary, AdapterError>>;
  updateChannelConnection(id: string, patch: {
    name?: string;
    cadence?: 'daily' | 'weekly' | 'monthly';
    metricShape?: 'spend-date' | 'report-date';
    fxBasis?: 'daily-rate' | 'monthly-average';   // per-connection override (07a)
    dedupePriority?: number;
    status?: 'unverified' | 'active' | 'degraded' | 'revoked';
    baseVersion: number;                      // stale -> CONFLICT with both payloads
  }): Promise<Result<ChannelConnectionSummary, AdapterError>>;
  verifyChannelConnection(id: string): Promise<Result<{
    state: 'active' | 'failed';
    lastVerifiedAt: string;
    evidence: string;                         // names the exercised read round-trip (credential-contract §7 — no success without exercising the capability)
  }, AdapterError>>;

  // spend intake (paste/file-upload = the LOOP-5 always-available path; channel-pull consent-gated — 08 N1)
  importSpendLines(input: {
    connectionId: string;
    source: 'paste' | 'file-upload' | 'channel-pull';
    content?: string;                         // paste/upload payload: one line item per row — date, external key, campaign ref, native amount, native currency, report date
    capabilityRef?: string;                   // channel-pull path only; consent enforced server-side
    pullWindow?: { start: string; end: string };
    idempotencyKey: string;                   // async-contract §5
  }): Promise<Result<Job<ImportJobResult>, AdapterError>>;
  listSpendLines(query: {
    filter?: {
      connectionId?: string[];
      batchId?: string[];
      campaignRef?: string;
      revisionSuperseded?: boolean;
      dedupeState?: NormalizedSpendRecord['dedupeState'][];
      dayRange?: { start: string; end: string };
    };
    search?: string;                          // normalized match inside externalKey/campaignRef
    sort: 'spendDate' | 'nativeAmount' | 'reportDate';
    cursor?: string; limit: number;           // virtualized surface: cursor pages ≤ 100
  }): Promise<Result<Page<SpendLineRow>, AdapterError>>;

  // normalization policy & declared FX table
  updateNormalizationPolicy(patch: {
    fxBasis?: 'daily-rate' | 'monthly-average';
    dedupeEpsilon?: number;                   // 0 < epsilon ≤ 0.10 -> VALIDATION otherwise
    pacingVarianceThresholdPct?: number;      // 0 < threshold ≤ 50
    baseVersion: number;                      // stale -> CONFLICT
  }): Promise<Result<NormalizationPolicy, AdapterError>>;
  getFxRateTable(query: {
    filter?: { from?: string[]; basis?: string[]; dateRange?: { start: string; end: string } };
    cursor?: string; limit: number;
  }): Promise<Result<FxRateView, AdapterError>>;

  // consolidation engine (deterministic — rules per 07c §2)
  runConsolidation(input: {
    window: { start: string; end: string };
    idempotencyKey: string;
  }): Promise<Result<Job<ConsolidationJobResult>, AdapterError>>;
  listSnapshots(query: {
    filter?: { status?: ('current' | 'superseded')[]; windowIntersects?: { start: string; end: string } };
    sort: 'version' | 'computedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<SnapshotSummary>, AdapterError>>;
  getSnapshot(version: number): Promise<Result<SnapshotSummary & {
    policyVersion: number;
    connectionVersions: Record<string, number>;
  }, AdapterError>>;
  getRevisionDelta(input: { fromVersion: number; toVersion: number }): Promise<Result<RevisionDelta, AdapterError>>;
  getSpendBreakdown(query: {
    snapshotVersion?: number;                 // omitted = current
    filter?: { connectionIds?: string[]; dayRange?: { start: string; end: string }; campaignRef?: string };
    groupBy: 'connection' | 'campaign' | 'day';
  }): Promise<Result<{ rows: BreakdownRow[] | { day: string; amountReporting: number }[], reportingCurrency: string }, AdapterError>>;
  getSpendTimeline(query: {
    snapshotVersion?: number;
    dayRange: { start: string; end: string };
    connectionIds?: string[];                 // omitted = all
    includeBands: boolean;                    // overlay bands travel with the series (04 S1 — one read)
  }): Promise<Result<{ points: TimelinePoint[]; reportingCurrency: string }, AdapterError>>;

  // overlap reconciliation (dedupe flags; humans decide — 07a state obligation)
  listOverlapFindings(query: {
    filter?: { state?: ('open' | 'resolved' | 'archived')[]; connectionId?: string[]; clusterKey?: string };
    sort: 'detectedAt' | 'matchScore';
    cursor?: string; limit: number;
  }): Promise<Result<Page<OverlapFindingView>, AdapterError>>;
  resolveOverlap(input: {
    findingId: string;
    resolution: OverlapResolution;            // 07a union — reason REQUIRED for every kind; splitPortion REQUIRED for 'split'
  }): Promise<Result<OverlapFinding, AdapterError>>;

  // holiday overlays (the calendar layer — P24 discipline)
  listHolidayMoments(query: {
    filter?: { kind?: string[]; scope?: string[]; status?: ('active' | 'retired')[] };
    search?: string;                          // normalized bilingual search over nameEn/nameAr (rtl-rules §4)
    sort: 'nameEn' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<MomentSummary>, AdapterError>>;
  saveHolidayMoment(input: {
    moment: Omit<HolidayMoment, 'version' | 'createdAt' | 'updatedAt'> & { id?: string };
    baseVersion?: number;                     // stale -> CONFLICT with both payloads
  }): Promise<Result<MomentSummary, AdapterError>>;
  getOverlayComparison(input: {
    momentId: string;
    occurrenceLabel: string;                  // names the occurrence window to compare (e.g. "Ramadan 1447")
    snapshotVersion?: number;                 // omitted = current
  }): Promise<Result<OverlayComparison, AdapterError>>;

  // budgets & pacing (linear arithmetic — no forecasting)
  listBudgetLines(query: {
    filter?: { status?: ('draft' | 'active' | 'closed')[]; periodIntersects?: { start: string; end: string } };
    sort: 'periodStart' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<BudgetLineSummary>, AdapterError>>;
  saveBudgetLine(input: {
    line: Omit<BudgetLine, 'amendments' | 'version' | 'createdAt' | 'updatedAt'> & { id?: string };
    baseVersion?: number;                     // stale -> CONFLICT; closed lines -> VALIDATION with the amendment path named
    amendment?: { reason: string };           // required when editing a closed line — records a new amendment entry, never a mutation
  }): Promise<Result<BudgetLineSummary, AdapterError>>;
  getPacing(query: { budgetLineId: string; snapshotVersion?: number }): Promise<Result<PacingStatus, AdapterError>>;

  // report packs (the governance artifact — 03 CP-5)
  exportReportPack(input: {
    snapshotVersion?: number;                 // omitted = current; the pack pins what it exports (07a)
    formats: ('consolidated-statement' | 'reconciliation-ledger' | 'overlay-analysis' | 'raw-line-items')[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifactId: string; expiresAt: string; formats: string[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: string[];
    snapshotVersion: number;
    supersededAtExport?: number;              // names a newer snapshot version at handoff (honesty)
  }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    consolidationRuns: number;
    exportPacks: number;
    resetAt: string;
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';

// ISO 4217 alphabetic currency codes (research Source 10) — storage is canonical;
// display is formatting. Codes render in Latin always, bidi-isolated in RTL (rtl-rules §2).
export type CurrencyCode = string;   // validated against the workspace's active-code list (3 uppercase letters)

// ---- Workspace & policy ----
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction default (either direction is a full citizen — 05)
  reportingCurrency: CurrencyCode;    // ONE per workspace — the functional-currency convention (Source 11)
  policyId: string;                   // active NormalizationPolicy
  fxRateTableId: string;              // declared policy data — never a market feed (08 N3)
  createdAt: string;
  updatedAt: string;
}
export type FxBasis = 'daily-rate' | 'monthly-average';   // declared convention — no research source (01 honest gap 3)
export interface NormalizationPolicy {
  id: string;
  workspaceId: string;
  fxBasis: FxBasis;                   // default 'daily-rate' = the rate dated on each line item's spend day
  dedupeEpsilon: number;              // fractional tolerance for overlap amount matching (default 0.02)
  pacingVarianceThresholdPct: number; // on/over/under-pace boundary (default 10)
  version: number;                    // edits re-version; snapshots pin the version they computed under
  createdAt: string;
  updatedAt: string;
}
export interface FxRate {
  id: string;
  from: CurrencyCode;
  to: CurrencyCode;                   // 'to' is always the workspace reporting currency in v1
  date: string;                       // ISO date; the rate's effective day (daily basis)
  month?: string;                     // ISO month; set for monthly-average rows
  rate: number;                       // declared policy fixture value; provenance is 'declared-policy'
  basis: FxBasis;
  source: 'declared-policy' | 'accepted-proposal';   // accepted-proposal = entered via reviewed rate-source suggestion (08 N3, P15)
  enteredByMemberId: string;
  at: string;
}

// ---- Channel connections (abstract kinds — capability language, never vendors) ----
export type ChannelKind =
  | 'search-ads-class'
  | 'social-ads-class'
  | 'video-ads-class'
  | 'marketplace-ads-class'
  | 'offline-media-class'
  | 'agency-report-class'
  | 'other-class';
export interface ChannelKindDescriptor {
  kind: ChannelKind;
  labelEn: string;                    // e.g. "Search ads channel"
  labelAr: string;                    // e.g. "قناة إعلانات البحث"
  typicalCadence: 'daily' | 'weekly' | 'monthly';
  metricShapeNotesEn: string;         // what spend-date vs report-date means for this class (01 honest gap 2 — declared policy, not cited fact)
  metricShapeNotesAr: string;
}
export type Cadence = 'daily' | 'weekly' | 'monthly';
export type MetricShape = 'spend-date' | 'report-date';   // which day a reported amount belongs to (declared per connection)
export type ConnectionStatus = 'unverified' | 'active' | 'degraded' | 'revoked';
export interface ChannelConnection {
  id: string;
  workspaceId: string;
  name: string;                       // operator-chosen, e.g. "Primary Search Ads"
  kind: ChannelKind;
  nativeCurrency: CurrencyCode;
  cadence: Cadence;
  metricShape: MetricShape;
  fxBasisOverride?: FxBasis;         // per-connection invoicing reality (agency statements settle at monthly average; platform consoles at daily) — absent = workspace policy basis
  dedupePriority: number;             // 1 = highest; keep-first resolutions use this (07c rule 4)
  status: ConnectionStatus;
  credential?: {
    state: 'unverified' | 'active' | 'expiring-soon' | 'expired' | 'revoked' | 'failed';   // credential-contract §3
    kindLabel: string;                // capability language, e.g. "Spend report reader credential"
    lastVerifiedAt?: string;
  };
  version: number;                    // policy edits re-version; snapshots pin connection versions (audit honesty)
  createdAt: string;
  updatedAt: string;
}

// ---- Raw spend line items (the ledger's grain) ----
export type ImportSource = 'paste' | 'file-upload' | 'channel-pull' | 'revision-batch';
export interface ImportBatch {
  id: string;
  workspaceId: string;
  connectionId?: string;              // paste/upload batches may be connection-less (offline media) or bound to one
  source: ImportSource;
  windowStart?: string;
  windowEnd?: string;
  revisionOfBatchId?: string;         // set for 'revision-batch' — the superseded import
  importedByMemberId: string;
  at: string;
}
export interface SpendLineItem {
  id: string;
  workspaceId: string;
  connectionId: string;
  batchId: string;
  externalKey: string;                // channel-native campaign/line identifier — the dedupe join key (bidi-isolated at render)
  campaignRef: string;                // display name for campaign grouping (verbatim, mixed-script-safe)
  spendDate: string;                  // ISO date the amount belongs to per the connection's metricShape
  reportDate: string;                 // ISO date the channel reported it (revisions arrive after the fact — Source 12)
  nativeAmount: number;               // ≥ 0; in nativeCurrency
  nativeCurrency: CurrencyCode;
  revision: number;                   // 1 on first import; a same (connection, externalKey, spendDate) re-import bumps this and supersedes
  supersededByLineItemId?: string;    // present when a newer revision replaced this row (old rows stay queryable — never hard-deleted)
  at: string;
}

// ---- Normalization outputs (computed by the consolidation engine — 07c rules) ----
export interface ConversionReceipt {
  lineItemId: string;
  nativeAmount: number;
  nativeCurrency: CurrencyCode;
  rate?: number;                      // present unless rate-unavailable
  rateId?: string;                    // the declared FxRate row used (audit pin)
  basis: FxBasis;
  policyVersion: number;
  reportingCurrency: CurrencyCode;
  reportingAmount?: number;           // nativeAmount × rate; absent iff rate is unavailable (honest gap, flagged — never zero)
  state: 'converted' | 'rate-unavailable' | 'native';    // 'native' when nativeCurrency === reportingCurrency
}
export interface NormalizedSpendRecord {
  id: string;
  snapshotId: string;
  lineItemIds: string[];              // ≥1; >1 only for split resolutions (07c rule 4)
  connectionId: string;
  campaignRef: string;
  day: string;                        // spendDate after metric-shape normalization (07c rule 1)
  amountReporting: number;            // sum of the members' reporting amounts
  receipts: ConversionReceipt[];      // one per member line item — the evidence chain
  dedupeState: 'single' | 'kept-first' | 'split' | 'both-counted' | 'overlap-open';
}
export interface ConsolidationSnapshot {
  id: string;
  workspaceId: string;
  version: number;                    // monotonic per workspace; versions are immutable once written
  windowStart: string;
  windowEnd: string;
  computedAt: string;
  policyVersion: number;
  connectionVersions: Record<string, number>;   // pinned versions per contributing connection
  fxRateTableVersion: number;
  status: 'current' | 'superseded';
  supersededByVersion?: number;
  health: {
    openOverlaps: number;
    lateCadenceConnections: string[]; // connectionIds whose latest line item predates cadence expectation
    revisionsApplied: number;         // revision-batches folded into this version vs the previous
    rateUnavailableDays: string[];    // days excluded from ratios (07c rule 6)
  };
  totals: {                           // derived at read — never authoritative storage
    reportingCurrency: CurrencyCode;
    total: number;
    byConnection: Record<string, number>;
    byDay: Record<string, number>;
    lineItemCount: number;
  };
}

// ---- Overlap findings (dedupe detection is flagging, never silent) ----
export type OverlapResolutionKind =
  | 'keep-first'        // by declared connection priority — the named channel of record wins
  | 'split'             // a declared portion to each (genuinely distinct buys sharing a key)
  | 'both-counted';     // two different spends; one is re-keyed
export interface OverlapResolution {
  kind: OverlapResolutionKind;
  reason: string;                      // REQUIRED — recorded in the ledger and the export (P04/P17)
  splitPortion?: number;               // required for 'split' (0–1, the second connection's share)
  actorMemberId: string;
  at: string;
  snapshotVersionApplied?: number;     // the version whose re-derivation folded this resolution
}
export interface OverlapFinding {
  id: string;
  workspaceId: string;
  lineItemIds: [string, string];       // the candidate pair (different connections, 07c rule 4)
  clusterKey: string;                  // externalKey + day — groups multi-member clusters (03 CP-3 edge)
  match: {
    externalKey: string;
    day: string;
    convertedDelta: number;            // |a − b| in reporting currency after conversion
    withinEpsilon: boolean;            // convertedDelta ≤ epsilon × max(a, b) under the active policy version
    score: number;                     // deterministic match score (07c rule 4)
  };
  state: 'open' | 'resolved' | 'archived';   // archived = the finding no longer exists under a new policy (re-checked, never orphaned)
  resolution?: OverlapResolution;
  detectedInSnapshotVersion: number;
  at: string;
}

// ---- Holiday overlays (the calendar layer) ----
export type MomentKind = 'hijri-anchored' | 'gregorian-fixed' | 'movable-gregorian';
export type HijriMethod = 'umm-al-qura' | 'tabular';   // presentation method, disclosed in-product (portfolio default: Umm al-Qura for KSA contexts)
export type AnchorRule =
  | { kind: 'hijri-anchored'; hijriMonth: number; hijriDay: number; method: HijriMethod }
  | { kind: 'gregorian-fixed'; month: number; day: number }
  | { kind: 'movable-gregorian'; ruleId: 'friday-following-fourth-thursday-nov' | 'custom-weekday-offset'; weekday?: number; month?: number; ordinal?: number };
export type MarketScope = 'KSA' | 'UAE' | 'EGY' | 'OTHER';
export interface HolidayMoment {
  id: string;
  workspaceId: string;
  nameEn: string;                      // e.g. "White Friday — KSA"
  nameAr: string;                      // e.g. "الجمعة البيضاء — السعودية"
  kind: MomentKind;
  anchor: AnchorRule;
  lengthDays: number;                  // window length per occurrence
  scope: MarketScope[];                // per-market naming reality (Source 9) — same weekend, different moments per market
  status: 'active' | 'retired';
  version: number;                     // anchor/name edits re-version; computed windows and exports pin the version
  createdAt: string;
  updatedAt: string;
}
export interface OverlayWindow {
  momentId: string;
  momentVersion: number;
  occurrenceLabel: string;             // e.g. "Ramadan 1447" (hijri) or "2026" (gregorian)
  start: string;                       // ISO date — computed by the declared method (07c rule 8)
  end: string;                         // inclusive
  method?: HijriMethod;                // disclosed for hijri-anchored moments
  partialCoverage?: boolean;           // window extends beyond the snapshot window (03 CP-4 edge)
}
export interface OverlayComparison {   // derived read — deterministic arithmetic (07c rule 6)
  momentId: string;
  window: OverlayWindow;
  priorOccurrenceWindow?: OverlayWindow;   // same moment's previous occurrence — lunar matching for hijri-anchored (never Gregorian lookalike)
  controlWindow: { start: string; end: string };   // equal length immediately preceding the window start
  controlConfoundedBy?: string[];      // momentIds overlapping the control window (honesty flag, 03 CP-4 edge)
  meanDailyWindow: number;             // reporting currency — rate-unavailable days excluded AND NAMED
  meanDailyControl: number;
  liftRatio: number;                   // meanDailyWindow / meanDailyControl
  likeForLikeDelta?: number;           // this occurrence vs prior occurrence mean-daily delta (absolute + pct)
  channelSplit: Record<string, number>;
  excludedDays: string[];
}

// ---- Budgets & pacing ----
export interface BudgetLine {
  id: string;
  workspaceId: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  amount: number;                      // in the workspace reporting currency ONLY (VALIDATION otherwise — 03 CP-5 edge)
  momentRef?: { momentId: string; occurrenceLabel: string };   // optional binding to a planned occurrence
  status: 'draft' | 'active' | 'closed';
  amendments: { amount: number; periodStart: string; periodEnd: string; reason: string; actorMemberId: string; at: string }[];
  version: number;                     // closed lines are immutable — edits are new amendment entries, never mutations
  createdAt: string;
  updatedAt: string;
}
export interface PacingStatus {        // derived read — linear arithmetic, no forecasting (07c rule 7)
  budgetLineId: string;
  snapshotVersion: number;
  coveredDays: number;
  totalDays: number;                   // period length; partial coverage flagged when covered < total
  partialCoverage: boolean;
  spentToDate: number;                 // cumulative normalized spend in period (rate-unavailable days excluded and named)
  linearPaceToDate: number;            // budget × (coveredDays / totalDays)
  variancePct: number;                 // (spentToDate − linearPaceToDate) / linearPaceToDate × 100
  state: 'on-pace' | 'over-pace' | 'under-pace';   // vs the policy threshold
  excludedDays: string[];
}

// ---- Async jobs, exports, activity ----
export type JobKind = 'import' | 'consolidation' | 'export';
export type ReportFormat = 'consolidated-statement' | 'reconciliation-ledger' | 'overlay-analysis' | 'raw-line-items';
export interface ExportArtifact {
  id: string;
  workspaceId: string;
  formats: ReportFormat[];             // per-format retry on partial failure (async-contract §4)
  snapshotVersion: number;             // exports pin their version (07a pinning)
  supersededAtExport?: number;         // names a newer snapshot version at handoff (honesty, 03 CP-5 edge)
  expiresAt: string;                   // declared retention window at creation
  regenerable: boolean;                // deterministic from immutable snapshot state — always true in v1
}
export interface ActivityEntry {       // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'connection-created' | 'connection-updated' | 'connection-verified' | 'connection-revoked'
    | 'lines-imported' | 'revision-imported'
    | 'policy-updated' | 'rate-entered' | 'rate-accepted'
    | 'consolidation-run'
    | 'overlap-resolved'
    | 'moment-saved' | 'moment-retired'
    | 'budget-saved' | 'budget-amended'
    | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                     // e.g. resolution reason, delta totals — provenance audit
  at: string;
}

