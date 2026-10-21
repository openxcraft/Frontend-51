# 07b — Adapter Contract: asset-register-tracker (TypeScript, v1)

SME-G pass · TYPES ONLY — no implementation, no providers, no framework. Contract name: **AssetRegisterAdapterV1**. AI declaration: **non-AI product** — no operation invokes any model; all operations are deterministic registry/lifecycle/custody state transitions. LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. Entity semantics (Asset, AssetCategory, QrLabel, LabelBatch, CustodyEvent, CustodySignature, Location, RetirementRecord, Person, Job, ExportArtifact, ActivityEntry): 07a — declared canonically there, referenced here by summary types.

```ts
// Single contract surface. Entity field-level shapes are declared canonically in
// 07a and are part of this contract by reference; 07b declares only the
// operational wrappers (summaries, views, job payloads) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (label double-request, signature shape, retirement
 *                                      with unresolved custody, empty export scope, malformed inputs)
 * 'NOT_FOUND'    -> NotFoundError     (unknown scan code, stale asset/batch/artifact links,
 *                                      expired artifacts)
 * 'PERMISSION'   -> PermissionError   (workspace scoping, non-member scan actions, viewer role)
 * 'CONFLICT'     -> ConflictError     (concurrent asset edits, person-creation collisions)
 * 'RATE_LIMIT'   -> RateLimitError    (scan-lookup throttling, label-batch/export quotas)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact delivery, offline reconcile)
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
  role: 'owner' | 'editor' | 'viewer';   // viewer: read + scan lookups, zero mutations
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entity summaries / views (full shapes per 07a) ----

export interface AssetSummary {
  id: string;
  tag: string;                            // bidi-isolated at render (rtl-rules §2)
  nameEn: string;
  nameAr?: string;
  categoryId: string;
  locationId: string;
  status: 'draft' | 'active' | 'retired';
  labelState: 'none' | 'requested' | 'printed' | 'applied' | 'damaged' | 'missing' | 'retired';
  custody: {
    state: 'in-stock' | 'with-holder' | 'return-pending';
    holderPersonId: string | null;
    holderName: string | null;            // denormalized for list rendering (bidi-isolated)
    since: string;
    dueOn?: string;
  };
  updatedAt: string;
}

export interface AssetDetail extends AssetSummary {
  serialNumber?: string;
  model?: string;
  acquiredOn?: string;
  note?: string;
  version: number;                        // optimistic concurrency token
  currentLabelId: string | null;
  custodyEventCount: number;
  retirement?: {
    method: 'sold' | 'donated' | 'recycled' | 'destroyed' | 'transferred-out' | 'lost-writeoff';
    disposalDate: string;
    counterparty?: string;
    certificateRef?: string;
    certificateUnreferenced?: boolean;
  };
}

export interface CategorySummary {
  id: string;
  nameEn: string;
  nameAr?: string;
  code?: string;
  assetCount: number;
}

export interface LocationNode {
  id: string;
  nameEn: string;
  nameAr?: string;
  parentId: string | null;
  kind: 'building' | 'floor' | 'room' | 'storeroom' | 'vehicle' | 'other';
  assetCount: number;                     // includes descendants (tree rollup)
  depth: number;
}

export interface LabelBatchView {
  id: string;
  state: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  progress: { determinate: true; done: number; total: number };
  labelSizeMm: 25 | 40 | 60;
  sheetLayout: 'a4-65up' | 'a4-24up' | 'a4-1up';
  assetIds: string[];
  appliedCount: number;
  sheetArtifactId?: string;
  createdAt: string;
}

export interface CustodyEventView {
  id: string;
  assetId: string;
  kind: 'assign' | 'return' | 'transfer' | 'sighting' | 'retirement' | 'correction';
  seq: number;
  actorMemberId: string;
  fromPersonName?: string;                // denormalized names (bidi-isolated at render)
  toPersonName?: string;
  locationId: string;
  condition?: 'good' | 'damaged' | 'needs-attention';
  dueOn?: string;
  note?: string;
  signature: { method: 'typed-name' | 'drawn' | 'scan-ack' | 'staff-attest';
               signerName: string; at: string } | null;
  correctsEventId?: string;
  at: string;
}

export interface PersonSummary {
  id: string;
  fullName: string;
  fullNameSecondLocale?: string;
  department?: string;
  state: 'active' | 'inactive';
  holdingCount: number;                   // open custody ledger rollup
  returnPendingCount: number;
}

export interface ScanLookupResult {
  asset: AssetDetail;
  scannedLabel: { id: string; state: string; printedTag: string };
  deepLink: string;                       // the asset's scan-companion link
  actorScopes: ('handoff' | 'return' | 'transfer' | 'report-label' | 'sighting' | 'retire')[];
                                           // role-scoped actions (members see all; shared links see none)
}

export interface JobView {
  id: string;
  kind: 'label-batch' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  result?: { batchId?: string; artifactId?: string };
  error?: AdapterError;
  createdAt: string;
}

// ---- Contract ----

export interface AssetRegisterAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // registry
  listAssets(query: {
    filter?: {
      status?: ('draft' | 'active' | 'retired')[];
      categoryId?: string[];
      locationId?: string[];              // includes descendant locations
      holderPersonId?: string[];
      custodyState?: ('in-stock' | 'with-holder' | 'return-pending')[];
      labelState?: AssetSummary['labelState'][];
    };
    search?: string;                      // normalized bilingual: tag, names, serial, model (rtl-rules §4)
    sort: 'tag' | 'nameEn' | 'updatedAt' | 'acquiredOn';
    cursor?: string; limit: number;
  }): Promise<Result<Page<AssetSummary>, AdapterError>>;
  createAsset(input: {
    nameEn: string; nameAr?: string;
    categoryId: string; locationId: string;
    serialNumber?: string; model?: string; acquiredOn?: string; note?: string;
  }): Promise<Result<AssetDetail, AdapterError>>;   // tag assigned sequentially server-side
  getAsset(id: string): Promise<Result<AssetDetail, AdapterError>>;
  updateAsset(id: string, patch: {
    nameEn?: string; nameAr?: string | null;
    categoryId?: string; locationId?: string;
    serialNumber?: string | null; model?: string | null;
    acquiredOn?: string | null; note?: string | null;
  }, baseVersion: number): Promise<Result<AssetDetail, AdapterError>>;

  // retirement (immutable record; P04 confirm ladder handled UI-side)
  retireAsset(input: {
    assetId: string;
    method: 'sold' | 'donated' | 'recycled' | 'destroyed' | 'transferred-out' | 'lost-writeoff';
    disposalDate: string;
    counterparty?: string;
    certificateRef?: string;
    note?: string;
    baseVersion: number;
    idempotencyKey: string;               // double-submit never double-retires
  }): Promise<Result<AssetDetail & { retirementRecordId: string }, AdapterError>>;

  // taxonomy
  listCategories(query: { cursor?: string; limit: number }): Promise<Result<Page<CategorySummary>, AdapterError>>;
  createCategory(input: { nameEn: string; nameAr?: string; code?: string }): Promise<Result<CategorySummary, AdapterError>>;
  listLocations(query: { parentId?: string | null; cursor?: string; limit: number }): Promise<Result<Page<LocationNode>, AdapterError>>;
  createLocation(input: {
    nameEn: string; nameAr?: string; parentId: string | null;
    kind: 'building' | 'floor' | 'room' | 'storeroom' | 'vehicle' | 'other';
  }): Promise<Result<LocationNode, AdapterError>>;

  // QR label lifecycle
  requestLabelBatch(input: {
    assetIds: string[];
    labelSizeMm: 25 | 40 | 60;
    sheetLayout: 'a4-65up' | 'a4-24up' | 'a4-1up';
    idempotencyKey: string;
  }): Promise<Result<JobView & { result: { batchId: string } }, AdapterError>>;
  getLabelBatch(batchId: string): Promise<Result<LabelBatchView, AdapterError>>;
  confirmLabelApplied(input: {
    assetId: string; labelId: string;
    idempotencyKey: string;               // offline replay safety (03 CP-2 failure path)
  }): Promise<Result<AssetDetail & { label: { id: string; state: 'applied'; appliedAt: string } }, AdapterError>>;
  reportLabelState(input: {
    assetId: string; state: 'damaged' | 'missing'; note?: string;
  }): Promise<Result<AssetDetail & { label: { id: string; state: 'damaged' | 'missing' } }, AdapterError>>;

  // custody chain (append-only)
  recordCustodyEvent(input: {
    assetId: string;
    kind: 'assign' | 'return' | 'transfer' | 'sighting' | 'correction';
    toPersonId?: string;                  // required for assign/transfer
    fromPersonId?: string;                // required for transfer; inferred for return/assign
    locationId: string;                   // where it happened (scan context or chosen)
    condition?: 'good' | 'damaged' | 'needs-attention';
    dueOn?: string;                       // assign only
    note?: string;
    signature?: {                         // REQUIRED for assign/transfer/return (07a contract)
      method: 'typed-name' | 'drawn' | 'scan-ack' | 'staff-attest';
      signerPersonId: string;
      signerName: string;
      drawnMarkRef?: string;
    };
    correctsEventId?: string;             // correction only
    idempotencyKey: string;               // offline queue reconciliation (async-contract §5)
  }): Promise<Result<CustodyEventView, AdapterError>>;
  listCustodyEvents(query: {
    filter?: {
      assetId?: string; personId?: string;    // matches from/to/signer
      kind?: ('assign' | 'return' | 'transfer' | 'sighting' | 'retirement' | 'correction')[];
      since?: string; until?: string;
    };
    cursor?: string; limit: number;           // chains are long: cursor discipline is the timeline's spine
  }): Promise<Result<Page<CustodyEventView>, AdapterError>>;

  // scan companion
  lookupByScan(input: {
    code: string;                             // QR payload or typed tag ("AST-0107")
  }): Promise<Result<ScanLookupResult, AdapterError>>;

  // people (custody counterparties)
  listPeople(query: {
    filter?: { state?: ('active' | 'inactive')[]; holdingOnly?: boolean };
    search?: string;                          // normalized bilingual person search (rtl-rules §4)
    cursor?: string; limit: number;
  }): Promise<Result<Page<PersonSummary>, AdapterError>>;
  createPerson(input: {
    fullName: string; fullNameSecondLocale?: string;
    department?: string; contactNote?: string;
  }): Promise<Result<PersonSummary, AdapterError>>;

  // audit + platform
  listActivity(query: {
    filter?: { actorMemberId?: string; action?: string[]; targetRef?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntryView>, AdapterError>>;
  listJobs(query: {
    filter?: { state?: JobView['state'][]; kind?: JobView['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<JobView>, AdapterError>>;

  // evidence export (the audit pack)
  exportRegister(input: {
    format: 'csv' | 'json';
    scope: {
      locationId?: string; categoryId?: string; retiredOnly?: boolean;
      includeCustodyHistory: boolean;
    };
    idempotencyKey: string;
  }): Promise<Result<JobView & { result: { artifactId: string } }, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  getUsage(): Promise<Result<{
    window: string;
    assetsTracked: number;
    labelBatches: number; exports: number;
    resetAt: string;
  }, AdapterError>>;
}

// ActivityEntryView: 07a ActivityEntry with actor name denormalized for rendering.
export interface ActivityEntryView {
  id: string;
  actorMemberId: string;
  actorName: string;                    // bidi-isolated at render
  action: string;
  targetRef: string;
  detail?: string;
  at: string;
}
```

## Rules

1. **Custody events are append-only and idempotent**: `recordCustodyEvent` never edits; corrections arrive as `kind: 'correction'` with `correctsEventId`; replayed `idempotencyKey` returns the original event (offline queue reconciliation — 03 CP-2 failure path). `seq` is per-asset monotonic; the chain's order is data, not timestamp inference.
2. **Signatures are validated facts**: assign/transfer/return without a well-formed `signature` (signer name present, method declared, signer identified) → VALIDATION with the missing element named; sighting and correction carry `staff-attest` or null per 07a. The adapter records attestations; it does not perform cryptography (12 Q-6 boundary).
3. **Label lifecycle gates**: `requestLabelBatch` containing an asset whose live label is not in `damaged`/`missing`/`retired` (or `none`/`draft`) state → VALIDATION naming the asset and the damaged/missing path; `confirmLabelApplied` on a label not in `printed` state → VALIDATION; printed ≠ applied is a contract, not a UI nicety.
4. **Retirement integrity**: `retireAsset` on an asset with custody `with-holder`/`return-pending` → VALIDATION naming the holder; on success the asset, its live label, and the chain freeze (a `retirement` custody event is appended automatically); records are immutable; idempotent replay returns the original record.
5. **Scan honesty**: `lookupByScan` with an unknown code → NOT_FOUND including the code's last 4 characters (never the full payload — codes are capability-neutral but opaque); the same code twice is a repeated read, never an event (writes only via explicit actions).
6. **Stale-version semantics**: `updateAsset`/`retireAsset` with stale `baseVersion` → CONFLICT with both payloads in `details`.
7. **Typed pagination on every list**; cursors opaque. Jobs: label batches are atomic per batch with determinate label-count progress (async-contract §3); exports are single-artifact jobs with declared expiry and renewal (§2). Progress is unit counts — never fake percentages.
8. **No orphan methods**: every operation traces to ≥1 flow (03 coverage table, Critic-verified).
