# 07b — Adapter Contract: inventory-count-assistant (TypeScript, v1)

SME-G pass · `InventoryCountAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. Types only — no implementation. Entity semantics (Workspace, Store, Location, CatalogItem, StockLevel, CountPolicy, CountSession, CountEntry, Variance, Adjustment, ReportArtifact, Job, ActivityEntry — and their unions `Locale`, `AbcClass`, `CountMode`, `SessionState`, `VarianceOutcome`, `VarianceState`, `ResolutionKind`, `ToleranceBand`, `CounterRef`, `SessionScope`, `JobKind`): 07a, included here by reference at compile time. Every operation traces to ≥1 flow (03 coverage table, 30/30).

```ts
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
```

## Rules

1. **Blind-mode read contract**: while a session's `mode` is `'blind'` and its state is `draft` or `open`, every read surface omits book quantities and computed variances for its scope items (`ScopeItemView.expectedQty` absent; `EntryAck.directed` absent; `VarianceRow` for such sessions omits `expectedQty`/`delta`/outcome). The withholding is contractual — the UI cannot leak what the adapter never returns; blind counting discipline is enforced at the boundary (01 [25][26][27]).
2. **State machine closure**: `openCountSession` only from `draft`; `cancelCountSession` only from `draft|open`; `closeCountSession(reveal)` only from `open` (one-way, stamps `revealedAt`, computes variances from the register snapshot at that moment); `closeCountSession(finalize)` only from `reconciling`. Any other transition → VALIDATION naming the current and requested states.
3. **Finalize gate**: `finalize` with uncounted scope items or unresolved variances → VALIDATION with `details.uncountedItemIds` and `details.unresolvedItemIds` listing every blocking item — the gate refusal is typed, not a toast. On success: adjustments post for every accepted count that differs from book (immutable records), the register's `expectedQty`/`lastCountedAt` stamp per item, session IRA computes as within-tolerance ÷ counted, and the report becomes exportable.
4. **Bilingual label validity**: `createCatalogItem`/`importCatalogItems` require at least one of `nameAr`/`nameEn` (VALIDATION naming the row otherwise); items carrying one script only are accepted and flagged `incompleteLabels` for the catalog filter — never rejected, never silently duplicated.
5. **Tolerance arithmetic (exact, deterministic)**: `allowedBand = bandStrategy === 'union' ? max(absTolerance, round(pctTolerance/100 × expectedQty)) : min(...)`; within tolerance iff `|delta| ≤ allowedBand`; when `valueTolerance` is set, `|delta × unitCost| > valueTolerance` forces out-of-tolerance regardless of the unit band; `pctDelta` is undefined when `expectedQty === 0` and such variances are judged by the absolute rule and the value rule only — declared, never a fabricated percentage.
6. **Recount automation**: at reveal, every out-of-tolerance variance gets an auto recount request when the pinned policy's `autoRecount` is true (a manual `requestRecount` is always available); a recount entry recomputes the variance from the recount quantity; still out-of-band → state `review-required` (manager decision owed — the accountability ladder of 03 CP-3).
7. **Entry discipline**: entries append with revisions — `updateCountEntry` bumps `revision`, marks the predecessor `superseded`, and is legal only while the session is `open` (VALIDATION otherwise, naming the state); late entries (submitted in `reconciling`) are accepted for scope items and flagged `lateEntry: true` at the data level; recount entries are legal in `open` and `reconciling`; a non-scope `itemId` → VALIDATION; `counterRef` not in the roster → VALIDATION; replaying an `idempotencyKey` returns the original entry (scan double-fire is a no-op).
8. **Resolution semantics**: `resolveVariance` on `keep-book` or `investigate` without a note → VALIDATION demanding the reason (the honest unknown states must say why); resolving an already-resolved variance → CONFLICT; accept-count is final at finalize (the accepted quantity becomes the adjustment's `toQty`).
9. **Stale-version semantics**: `updateCatalogItem`, `savePolicy`, `updateCountEntry`, and `resolveVariance` against moved bases → CONFLICT with both payloads in `details`; policy edits never re-judge running sessions (pinning, 07a).
10. **Consent enforcement**: `updateStockLevels` with `source: 'stock-channel'` without a granted stock-level read/update consent → PERMISSION naming the capability class in capability language (credential-contract §2/§4) — never a vendor name; `source: 'manual-paste'` never requires consent and is the v1 primary path (LOOP-5).
11. **Idempotency + partial policies**: imports, stock updates, report exports, and entry submissions carry idempotency keys (retries return the original job/entry); catalog import delivers good rows + named bad rows; stock import delivers applied rows + named invalid rows (invalid rows never half-apply); report export delivers per-format artifacts with per-format retry (async-contract §4/§5).
12. **No orphan methods**: every operation traces to the 03 coverage table (30/30); typed pagination on every list; cursors opaque; no provider names anywhere.
