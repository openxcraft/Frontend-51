# 07b — Adapter Contract: ad-spend-consolidator (TypeScript, v1)

SME-G pass · `AdSpendConsolidatorAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, ChannelKind, ChannelConnection, ImportBatch, SpendLineItem, NormalizationPolicy, FxRate, ConversionReceipt, NormalizedSpendRecord, ConsolidationSnapshot, OverlapFinding/OverlapResolution, HolidayMoment/AnchorRule/OverlayWindow/OverlayComparison, BudgetLine/PacingStatus, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table — 28 operations, 0 orphans).

```ts
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
```

## Rules

1. **Determinism contract**: `runConsolidation`, the overlay computation inside `getOverlayComparison`, the pacing computation inside `getPacing`, and the overlap detection inside every consolidation implement exactly the rules specified in 07c — identical inputs (line items, policy version, connection versions, rate-table version, moment versions) yield identical outputs. Every consolidation result carries `mode: 'deterministic'`. No computed field is ever hand-set.
2. **Snapshot immutability**: consolidation writes a NEW version; `getSnapshot`/`getRevisionDelta`/`getSpendBreakdown`/`getSpendTimeline`/`getOverlayComparison`/`getPacing`/`exportReportPack` against a superseded version return that version's pinned state (never the current). Revision deltas are computed between two immutable versions and never mutate either.
3. **Stale-version semantics**: `updateChannelConnection` (baseVersion), `updateNormalizationPolicy` (baseVersion), `saveHolidayMoment` (baseVersion), `saveBudgetLine` (baseVersion), `resolveOverlap` (finding already resolved or archived by another seat) → CONFLICT with both payloads in `details`.
4. **Viewer role**: mutation operations (updateConnection, updatePolicy, resolveOverlap, saveMoment, saveBudgetLine, importSpendLines, runConsolidation, exportReviewPack-class mutations of policy data) → PERMISSION naming the seat's capability in capability language; the viewer's write paths are `getArtifact` retrieval and pack export initiation for audit (`exportReportPack` permitted for viewer seats — finance owns its own retrieval, 02 Adel).
5. **Consent enforcement**: `importSpendLines` with `source: 'channel-pull'` without a granted spend-reporting capability → PERMISSION naming the capability class (credential-contract §4) — never a vendor; the paste path has no consent requirement, ever (LOOP-5). Rate rows entering the table from a bound rate source carry `source: 'accepted-proposal'` and require the explicit accept step (P15 on data); direct-entered rows carry `source: 'declared-policy'`.
6. **Idempotency**: import/consolidation/export submits carry idempotency keys; a retried submit returns the original job (async-contract §5). Progress is determinate in units (line items, records, formats) — an indeterminate bar claiming percentage is a contract violation (async-contract §3).
7. **Partial policies**: import delivers imported-so-far + named invalid rows; consolidation is per-record re-runnable (no atomicity requirement — determinism makes re-runs safe); export delivers per-format partial with per-format retry (async-contract §4).
8. **Honest-gap propagation**: a line item whose (from, to) pair or day has no covering rate row normalizes to `rate-unavailable` — never to zero; the snapshot's `health.rateUnavailableDays` and every affected ratio's `excludedDays` name the days (07a state obligation).
9. **Currency discipline**: the workspace reporting currency is singular; `saveBudgetLine` with an amount currency other than the reporting currency → VALIDATION (budget lines are declared in the reporting currency — conversions belong to line items, not targets); revision imports that change a line item's currency → VALIDATION (a currency change is a different line item).
10. **Occurrence matching is lunar for hijri-anchored moments**: `getOverlayComparison` matches prior occurrences by the moment's own occurrence sequence (Hijri year arithmetic under the declared method), never by Gregorian date proximity — a Gregorian-lookalike request has no representation on the adapter (03 CP-4.4 refusal is structural, 07c rule 8).
11. **Resolution application semantics**: `resolveOverlap` records the resolution immediately (activity log + ledger); its effect on normalized records applies at the NEXT consolidation (`snapshotVersionApplied`); querying normalized records against an older snapshot shows the finding as it was then — audit honesty, not staleness.
12. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (28/28).
