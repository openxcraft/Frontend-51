// VERBATIM from specs-source/inventory-count-assistant/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Core entity types are declared canonically in 07a;
// 07b declares only the operational wrappers (rows, views, jobs, acks) its
// signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed import rows, non-scope entries,
 *                                      finalize gate refusal, invalid policy,
 *                                      blind-contract breaches, state-machine misuse)
 * 'NOT_FOUND'    -> NotFoundError     (stale session/item/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (workspace/store scoping, stock-channel consent)
 * 'CONFLICT'     -> ConflictError     (concurrent entry/catalog/policy edits, stale resolutions)
 * 'RATE_LIMIT'   -> RateLimitError    (report-export and import windows)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact delivery,
 *                                      offline-entry flush)
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
  role: 'owner' | 'manager' | 'viewer';  // viewer: read-only + exports, no mutations
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (summaries, views, acks) ----

export interface StoreSummary {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  active: boolean;
}

export interface LocationSummary {
  id: string;
  storeId: string;
  nameAr: string;
  nameEn: string;
  code: string;
  active: boolean;
}

export interface CatalogImportRow {
  sku: string;                 // required, unique
  barcode?: string;
  nameAr?: string;             // at least one name required (rule 4)
  nameEn?: string;
  unit?: string;               // defaults to 'piece'
  unitCost?: number;           // defaults to 0
}

export interface SliceProposalRow {
  itemId: string;
  sku: string;
  nameAr?: string;
  nameEn?: string;
  class: AbcClass;
  intervalDays: number;        // effective class interval (pinned policy cadence)
  lastCountedAt?: string;      // absent = never counted
  daysSince: number;           // days since lastCountedAt, or days since register creation
  overdueRatio: number;        // daysSince / intervalDays (ordering key, desc; ties by sku asc)
}

export interface CountSessionSummary {
  id: string;
  storeId: string;
  storeNameAr: string;
  storeNameEn: string;
  mode: CountMode;
  state: SessionState;
  scopeKind: 'cycle-slice' | 'zone' | 'full';
  scopeSize: number;
  policyId: string;
  policyVersion: number;
  policyNameAr: string;
  policyNameEn: string;
  counters: CounterRef[];
  progress: { counted: number; recountPending: number; uncounted: number; total: number };
  ira?: { withinTolerance: number; counted: number; pct: number };  // closed sessions only
  createdAt: string;
  openedAt?: string;
  revealedAt?: string;
  closedAt?: string;
}

export interface ScopeItemView {
  itemId: string;
  sku: string;
  barcode?: string;
  nameAr?: string;
  nameEn?: string;
  class: AbcClass;
  locationId?: string;
  counted: boolean;
  finalQty?: number;
  expectedQty?: number;        // OMITTED while mode='blind' and state is draft|open (rule 3)
  lastCountedAt?: string;
}

export interface CountSessionDetail extends CountSessionSummary {
  scopeItems: ScopeItemView[];
  gate?: { uncountedItemIds: string[]; unresolvedItemIds: string[] };  // present in 'reconciling'
}

export type CloseResult =
  | {
      action: 'reveal';
      session: CountSessionSummary;
      varianceSummary: { total: number; within: number; out: number; uncounted: number };
      revealedAt: string;
    }
  | {
      action: 'finalize';
      session: CountSessionSummary;
      posted: { adjustmentIds: string[]; itemsAdjusted: number };
      ira: { withinTolerance: number; counted: number; pct: number };
      closedAt: string;
    };

export interface EntryAck {
  entryId: string;
  kind: 'count' | 'recount';
  revision: number;
  lateEntry: boolean;
  progress: { counted: number; recountPending: number; uncounted: number; total: number };
  directed?: {                 // present ONLY when the session mode is 'directed' (rule 3)
    expectedQty: number;
    delta: number;
    band: number;
    outcome: VarianceOutcome;
  };
}

export interface CountEntryRow {
  id: string;
  sessionId: string;
  itemId: string;
  sku: string;
  nameAr?: string;
  nameEn?: string;
  locationId?: string;
  countedQty: number;
  counterRef: string;
  counterName: string;         // bidi-isolated at render (rtl-rules §2)
  kind: 'count' | 'recount';
  revision: number;
  superseded: boolean;
  lateEntry: boolean;
  submittedAt: string;
}

export interface VarianceRow {
  id: string;
  sessionId: string;
  itemId: string;
  sku: string;
  nameAr?: string;
  nameEn?: string;
  expectedQty?: number;        // omitted for un-revealed blind sessions (rule 3)
  countedQty?: number;
  delta?: number;              // signed: counted - expected
  absDelta?: number;
  pctDelta?: number;           // undefined when expectedQty === 0 (rule 5 — declared, not faked)
  valueDelta?: number;
  band: number;                // allowedBand units per the session's pinned policy
  outcome?: VarianceOutcome;
  state: 'uncounted' | VarianceState;
  resolution?: { kind: ResolutionKind; note?: string; by: string; at: string };
  recountEntryId?: string;
  computedAt: string;
}

export interface JobView<T> {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;
}

export interface ActivityRow {
  id: string;
  actorMemberId: string;
  action: ActivityEntry['action'];
  targetRef: string;
  detail?: string;
  at: string;
}

// ---- Contract ----

export interface InventoryCountAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // workspace structure
  listStores(query: {
    filter?: { active?: boolean };
    cursor?: string; limit: number;
  }): Promise<Result<Page<StoreSummary>, AdapterError>>;
  listLocations(query: {
    storeId: string;
    filter?: { active?: boolean };
    cursor?: string; limit: number;
  }): Promise<Result<Page<LocationSummary>, AdapterError>>;
  saveLocation(input: {
    id?: string; storeId: string;
    nameAr: string; nameEn: string; code: string; active?: boolean;
  }): Promise<Result<LocationSummary, AdapterError>>;

  // catalog (bilingual labels are the data; paste import is the always-available path)
  listCatalogItems(query: {
    filter?: { class?: AbcClass[]; active?: boolean; incompleteLabels?: boolean };
    search?: string;            // bilingual normalized search (rtl-rules §4): matches
                                // nameAr-normalized, nameEn, sku, barcode; numeral-form
                                // folding is NOT applied (declared limitation, 12 Q-8)
    sort: 'sku' | 'nameEn' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CatalogItem>, AdapterError>>;
  getCatalogItem(id: string): Promise<Result<CatalogItem, AdapterError>>;
  createCatalogItem(input: {
    sku: string; barcode?: string; nameAr?: string; nameEn?: string;
    unit: string; unitCost: number; classOverride?: AbcClass;
  }): Promise<Result<CatalogItem, AdapterError>>;
  updateCatalogItem(id: string, patch: {
    barcode?: string | null; nameAr?: string | null; nameEn?: string | null;
    unit?: string; unitCost?: number; classOverride?: AbcClass | null; active?: boolean;
  }, baseVersion: number): Promise<Result<CatalogItem, AdapterError>>;
  importCatalogItems(input: {
    rows: CatalogImportRow[];
    idempotencyKey: string;     // async-contract §5 — double-submit never double-imports
  }): Promise<Result<JobView<{ imported: number; duplicates: number; invalidRows: string[] }>, AdapterError>>;

  // book register (the abstract stock-level channel's mirror; paste is primary — LOOP-5)
  updateStockLevels(input: {
    storeId: string;
    rows: { skuOrBarcode: string; expectedQty: number; asOf?: string }[];
    source: 'manual-paste' | 'stock-channel';
    idempotencyKey: string;
  }): Promise<Result<JobView<{ applied: number; invalidRows: string[]; unknownItems: string[] }>, AdapterError>>;

  // count policies (tolerance band + ABC cadence)
  listPolicies(query: {
    filter?: { active?: boolean };
    cursor?: string; limit: number;
  }): Promise<Result<Page<CountPolicy>, AdapterError>>;
  savePolicy(input: {
    id?: string;
    nameAr: string; nameEn: string;
    tolerance: ToleranceBand;
    cadence: { classIntervals: Record<AbcClass, number>; sliceSize: number };
    autoRecount: boolean;
    baseVersion?: number;
  }): Promise<Result<CountPolicy, AdapterError>>;

  // cadence engine (deterministic — same register state, same proposal)
  proposeCycleSlice(input: {
    storeId: string; policyId: string; limit?: number;   // limit capped at policy sliceSize
  }): Promise<Result<{ items: SliceProposalRow[]; computedAt: string }, AdapterError>>;

  // count sessions
  createCountSession(input: {
    storeId: string;
    policyId: string;
    mode: CountMode;
    scope: SessionScope;
    counters: CounterRef[];
    note?: string;
  }): Promise<Result<CountSessionSummary, AdapterError>>;
  listCountSessions(query: {
    filter?: { storeId?: string; state?: SessionState[]; mode?: CountMode[] };
    search?: string;            // normalized bilingual match on store/policy names
    sort: 'createdAt' | 'updatedAt' | 'closedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CountSessionSummary>, AdapterError>>;
  getCountSession(id: string): Promise<Result<CountSessionDetail, AdapterError>>;
  openCountSession(id: string): Promise<Result<CountSessionSummary, AdapterError>>;
  cancelCountSession(id: string, note?: string): Promise<Result<CountSessionSummary, AdapterError>>;
  closeCountSession(input: {
    sessionId: string;
    action: 'reveal' | 'finalize';
  }): Promise<Result<CloseResult, AdapterError>>;

  // entries (scan or type; offline-queued client-side per P20, adapter-authoritative)
  submitCountEntry(input: {
    sessionId: string;
    itemId: string;
    locationId?: string;
    countedQty: number;         // integer >= 0
    counterRef: string;         // must key into the session's roster
    kind?: 'count' | 'recount'; // defaults to 'count'
    idempotencyKey: string;     // scan double-fire returns the same entry (rule 7)
  }): Promise<Result<EntryAck, AdapterError>>;
  updateCountEntry(id: string, patch: {
    countedQty: number;
  }, baseRevision: number): Promise<Result<CountEntryRow, AdapterError>>;
  listCountEntries(query: {
    sessionId: string;
    filter?: { itemId?: string; kind?: ('count' | 'recount')[]; counterRef?: string; lateOnly?: boolean };
    sort: 'submittedAt' | 'itemId';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CountEntryRow>, AdapterError>>;

  // variance + resolution
  requestRecount(input: {
    sessionId: string; itemId: string; reason?: string;
  }): Promise<Result<VarianceRow, AdapterError>>;
  resolveVariance(input: {
    sessionId: string; itemId: string;
    resolution: { kind: ResolutionKind; note?: string };  // note required for keep-book/investigate (rule 8)
  }): Promise<Result<VarianceRow, AdapterError>>;
  listVariances(query: {
    filter?: { sessionId?: string; storeId?: string; itemId?: string; state?: ('uncounted' | VarianceState)[]; outcome?: VarianceOutcome[] };
    sort: 'computedAt' | 'absDelta' | 'valueDelta';
    cursor?: string; limit: number;
  }): Promise<Result<Page<VarianceRow>, AdapterError>>;

  // reports (abstract delivery; manual path is download — 08 N4)
  exportCountReport(input: {
    sessionId: string;
    formats: ('variance-report' | 'adjustment-sheet')[];
    idempotencyKey: string;
  }): Promise<Result<JobView<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: JobView<unknown>['state'][]; kind?: JobKind[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<JobView<unknown>>, AdapterError>>;
  listActivity(query: {
    filter?: { action?: ActivityEntry['action'][]; targetRef?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityRow>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    exports: number; imports: number;
    resetAt: string;
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type AbcClass = 'A' | 'B' | 'C';
export type CountMode = 'blind' | 'directed';
export type SessionState = 'draft' | 'open' | 'reconciling' | 'closed' | 'cancelled';
export type VarianceOutcome = 'within-tolerance' | 'out-of-tolerance';
export type VarianceState =
  | 'auto-accepted'      // within tolerance at reveal (or after recount)
  | 'recount-pending'    // out-of-tolerance, recount requested, not yet submitted
  | 'recount-done'       // recount submitted; recomputed variance still out-of-band
  | 'review-required'    // manager decision owed (recount-done, or breach resolved by hand)
  | 'resolved';          // explicit manager resolution recorded
export type ResolutionKind = 'accept-count' | 'keep-book' | 'investigate';
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;            // bilingual-ar product: 'ar' default proposal
  currency: string;                 // single-currency cost context (fixtures: 'SAR')
}
export interface Store {
  id: string;
  workspaceId: string;
  nameAr: string;
  nameEn: string;
  code: string;                     // short code, e.g. 'RY-OLY'
  active: boolean;
}
export interface Location {         // a countable zone inside a store
  id: string;
  storeId: string;
  nameAr: string;
  nameEn: string;
  code: string;                     // zone code, e.g. 'Z-BR'
  active: boolean;
}
export interface CatalogItem {
  id: string;
  workspaceId: string;
  sku: string;                      // unique, Latin
  barcode?: string;                 // EAN-13-class string; optional — type/search fallback is first-class
  nameAr?: string;                  // at least one name required (07b rule 4)
  nameEn?: string;
  unit: string;                     // 'piece' | 'box' | 'set' | 'kg' | 'pack' ...
  unitCost: number;                 // single-currency, >= 0
  classComputed: AbcClass;          // Pareto rule over stock value share (07c rule 5)
  classOverride?: AbcClass;         // manager pin; visible in catalog + activity log
  class: AbcClass;                  // derived: override ?? computed
  active: boolean;
  version: number;                  // optimistic concurrency
  createdAt: string;
  updatedAt: string;
}
export interface StockLevel {       // the book register row (per item per store)
  id: string;
  storeId: string;
  itemId: string;
  expectedQty: number;              // book quantity, integer >= 0
  asOf: string;                     // when the book row was imported/last posted
  lastCountedAt?: string;           // stamped at session close (cadence input)
  source: 'manual-paste' | 'stock-channel' | 'session-adjustment';
}
export interface ToleranceBand {
  absTolerance: number;             // units, >= 0
  pctTolerance: number;             // percent, >= 0
  valueTolerance?: number;          // optional cost-value ceiling, >= 0
  bandStrategy: 'union' | 'intersect';
  // allowedBand (units) = strategy === 'union'
  //   ? max(absTolerance, round(pctTolerance/100 * expectedQty))
  //   : min(absTolerance, round(pctTolerance/100 * expectedQty))
  // within tolerance iff |delta| <= allowedBand
  // value rule (when set): a variance whose |delta * unitCost| > valueTolerance is
  // out-of-tolerance regardless of the unit band (strict ceiling, deterministic)
}
export interface CountPolicy {
  id: string;
  workspaceId: string;
  nameAr: string;
  nameEn: string;
  tolerance: ToleranceBand;
  cadence: {
    classIntervals: Record<AbcClass, number>;  // days between counts per class
    sliceSize: number;                          // max items per proposed slice
  };
  autoRecount: boolean;             // out-of-tolerance breaches request recounts automatically
  version: number;
  active: boolean;
}
export interface CounterRef {        // typed roster entry — attribution without a seat
  ref: string;                      // stable key within the session, e.g. 'amal'
  name: string;                     // display name, any script, bidi-isolated at render
  memberRef?: string;               // links a workspace member when one exists
  locale: Locale;                   // the counter's sheet locale preference
}
export type SessionScope =
  | { kind: 'cycle-slice'; itemIds: string[]; proposalRef?: string }
  | { kind: 'zone'; locationId: string; itemIds: string[] }
  | { kind: 'full'; itemIds: string[] };
export interface CountSession {
  id: string;
  storeId: string;
  policyId: string;
  policyVersion: number;            // pinned at creation — later policy edits never re-judge a running session
  mode: CountMode;
  scope: SessionScope;
  counters: CounterRef[];
  state: SessionState;
  createdAt: string;
  openedAt?: string;
  revealedAt?: string;              // blind book quantities withheld until this moment (07b rule 3)
  closedAt?: string;
  closedBy?: string;                // memberId
  note?: string;
}
export interface CountEntry {
  id: string;
  sessionId: string;
  itemId: string;
  locationId?: string;              // optional per-entry zone attribution (guided walk)
  countedQty: number;               // integer >= 0
  counterRef: string;               // key into session counters
  kind: 'count' | 'recount';        // recount entries reference a breached variance
  varianceRef?: string;             // set when kind === 'recount'
  revision: number;                 // 1-based; corrections bump, never overwrite (07b rule 7)
  superseded: boolean;              // prior revision marker
  lateEntry: boolean;               // submitted after reveal (reconciling state) — recorded, never hidden
  submittedAt: string;
}
export interface VarianceResolution {
  kind: ResolutionKind;
  note?: string;                    // required when kind === 'keep-book' or 'investigate'
  by: string;                       // memberId
  at: string;
}
export interface Variance {
  id: string;
  sessionId: string;
  itemId: string;
  expectedQty: number;              // book quantity at reveal (register snapshot)
  countedQty?: number;              // final count (recount when present); undefined while uncounted
  delta?: number;                   // counted - expected (signed)
  absDelta?: number;
  pctDelta?: number;                // undefined when expectedQty === 0 (declared, not faked — 07c rule 4)
  valueDelta?: number;              // absDelta * unitCost at reveal
  band: number;                     // allowedBand units, computed per pinned policy
  outcome?: VarianceOutcome;
  state: 'uncounted' | VarianceState;
  resolution?: VarianceResolution;  // set when state === 'resolved'
  recountEntryId?: string;
  computedAt: string;               // reveal/recompute timestamp
}
export interface Adjustment {       // posted at finalize; immutable
  id: string;
  sessionId: string;
  itemId: string;
  storeId: string;
  fromQty: number;
  toQty: number;                    // the accepted counted quantity
  delta: number;                    // toQty - fromQty (signed)
  reason: string;                   // auto note or resolution note
  postedAt: string;
  postedBy: string;
}
export interface ReportArtifact {
  id: string;
  sessionId: string;
  format: 'variance-report' | 'adjustment-sheet';
  expiresAt: string;                // declared retention window at creation
  regenerable: boolean;
}
export type JobKind = 'catalog-import' | 'stock-import' | 'report-export';
export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';               // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;               // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;           // async-contract §5
}
export interface ActivityEntry {    // P17 — actor-action-target-timestamp
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'catalog-imported' | 'item-created' | 'item-updated' | 'class-overridden'
    | 'stock-imported' | 'zone-created'
    | 'policy-saved'
    | 'session-created' | 'session-opened' | 'session-revealed' | 'session-closed'
    | 'session-cancelled'
    | 'entry-submitted' | 'entry-corrected' | 'recount-requested'
    | 'variance-resolved' | 'adjustment-posted'
    | 'report-exported' | 'consent-change';
  targetRef: string;
  detail?: string;                  // e.g. resolution kind, adjustment delta, late-entry flag
  at: string;
}

