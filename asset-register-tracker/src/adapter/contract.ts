// VERBATIM from specs-source/asset-register-tracker/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;            // bilingual-en product: 'en' default, 'ar' full citizen
  tagPrefix: string;                // printed asset tag namespace, e.g. "AST"
  nextTagSequence: number;          // tags are sequential and gap-free per workspace
}

// ---- Registry taxonomy ----
export interface AssetCategory {
  id: string;
  workspaceId: string;
  nameEn: string;                   // sibling fields, both first-class (05 direction model)
  nameAr?: string;                  // optional until the manager fills it — never auto-translated
  code?: string;                    // short label-sheet code, e.g. "LAP" (printed on labels)
  createdAt: string;
}
export interface Location {
  id: string;
  workspaceId: string;
  nameEn: string;
  nameAr?: string;
  parentId: string | null;          // tree: building -> floor -> room; null = root
  kind: 'building' | 'floor' | 'room' | 'storeroom' | 'vehicle' | 'other';
  createdAt: string;
}

// ---- The asset ----
export type AssetStatus = 'draft' | 'active' | 'retired';
// draft: registered, not yet labeled/applied. active: in service. retired: removed from
// service with an immutable RetirementRecord. Retirement freezes; it never deletes.
export interface Asset {
  id: string;
  workspaceId: string;
  tag: string;                      // human tag, e.g. "AST-0107"; Latin digits, bidi-isolated at render
  nameEn: string;
  nameAr?: string;
  categoryId: string;
  locationId: string;
  serialNumber?: string;
  model?: string;                   // free text ("ThinkPad T14 Gen2") — no vendor catalog at v1
  acquiredOn?: string;              // date fact only — procurement is LOOP-10-excluded
  note?: string;
  status: AssetStatus;
  labelId: string | null;           // current (live) label; historical labels stay in QrLabel history
  custody: {
    state: 'in-stock' | 'with-holder' | 'return-pending';
    holderPersonId: string | null;  // non-null iff with-holder/return-pending
    since: string;                  // custody state change timestamp
    dueOn?: string;                 // set at assign; drives return-pending
  };
  version: number;                  // optimistic concurrency for updateAsset
  createdAt: string;
  updatedAt: string;
}

// ---- QR label lifecycle ----
export type LabelState =
  | 'requested'                     // created, awaiting batch generation/completion
  | 'printed'                       // in a completed batch; sheet artifact available; NOT yet applied
  | 'applied'                       // confirmed on the physical asset (scan or checklist confirm)
  | 'damaged'                       // reported unreadable — replacement path open
  | 'missing'                       // reported gone — replacement path open
  | 'retired';                      // retired together with its asset; history preserved forever
export interface QrLabel {
  id: string;
  workspaceId: string;
  assetId: string;
  batchId: string;                  // the batch that generated it
  code: string;                     // the QR payload (registry-scoped, opaque, non-sequential)
  printedTag: string;               // tag repeated on the label (the manual-entry fallback)
  state: LabelState;
  appliedAt?: string;               // confirmLabelApplied timestamp
  appliedByMemberId?: string;
  stateReportedAt?: string;         // damaged/missing report time
  stateReportedByMemberId?: string;
  stateNote?: string;               // report reason ("label peeled off the projector case")
  replacedByLabelId?: string;       // set when a replacement label is applied
  createdAt: string;
}
export interface LabelBatch {
  id: string;
  workspaceId: string;
  requestedByMemberId: string;
  assetIds: string[];               // assets in the batch (each must have no live label — 07b rule 3)
  labelSizeMm: 25 | 40 | 60;        // 25mm minimum-scannable guidance surfaced at selection
  sheetLayout: 'a4-65up' | 'a4-24up' | 'a4-1up';
  state: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';  // Job-shaped (async-contract §2)
  progress: { determinate: true; done: number; total: number };        // labels generated
  sheetArtifactId?: string;         // print-ready sheet (expires; regenerable)
  appliedCount: number;             // live-updated as confirmLabelApplied lands
  createdAt: string;
}

// ---- Custody chain (append-only) ----
export type CustodyEventKind =
  | 'assign'                        // location/staff -> person (hand-out)
  | 'return'                        // person -> location/staff (check-in; condition recorded)
  | 'transfer'                      // person -> person
  | 'sighting'                      // audit-walk verification: no custody change, no signature
  | 'retirement'                    // appended automatically by retireAsset
  | 'correction';                   // references a prior event; states what actually happened
export type ConditionGrade = 'good' | 'damaged' | 'needs-attention';
export interface CustodySignature {
  method: 'typed-name' | 'drawn' | 'scan-ack' | 'staff-attest';
  signerPersonId: string;           // the party accepting custody (assign/transfer: receiver;
                                    // return: the staff member attesting receipt)
  signerName: string;               // typed name as signed — always present, even for drawn marks
  drawnMarkRef?: string;            // drawn path reference (method 'drawn'); witness = signerName
  at: string;                       // signature timestamp
  deviceNote?: string;              // 'scan-ack': acknowledging device context (no identifiers)
}
export interface CustodyEvent {
  id: string;
  workspaceId: string;
  assetId: string;
  kind: CustodyEventKind;
  seq: number;                      // per-asset monotonic chain position — the chain IS the ordering
  actorMemberId: string;            // registry member who recorded the event (accountable actor)
  fromPersonId?: string;            // assign: null (from stock); transfer/return: prior holder
  toPersonId?: string;              // assign/transfer: new holder; return/sighting: null
  locationId: string;               // where the event happened (scan context or chosen)
  condition?: ConditionGrade;       // assign/return/transfer/sighting
  dueOn?: string;                   // assign only
  note?: string;
  signature: CustodySignature | null;  // required for assign/transfer/return (the accepting party);
                                       // null for sighting; retirement carries staff-attest;
                                       // correction carries staff-attest of the correcting member
  correctsEventId?: string;         // correction only: the erroneous event, referenced — never edited
  idempotencyKey: string;           // async-contract §5 — replays never double-append
  at: string;
}

// ---- People (custody counterparties — never deleted) ----
export interface Person {
  id: string;
  workspaceId: string;
  fullName: string;                 // single field, any script; bidi-isolated at render (rtl-rules §2)
  fullNameSecondLocale?: string;    // optional second-script rendering, e.g. "عبدالرحمن الشهري"
  department?: string;
  contactNote?: string;
  state: 'active' | 'inactive';     // inactive = left the firm; custody history keeps the name
  createdAt: string;
}

// ---- Retirement ----
export type RetirementMethod =
  | 'sold' | 'donated' | 'recycled' | 'destroyed' | 'transferred-out' | 'lost-writeoff';
export interface RetirementRecord {
  id: string;
  workspaceId: string;
  assetId: string;                  // 1:1 with the retired asset (immutable once written)
  method: RetirementMethod;
  disposalDate: string;
  counterparty?: string;            // buyer / recipient / destruction vendor
  certificateRef?: string;          // certificate-of-destruction or receipt reference (string only —
                                    // no document storage; the reference is the evidence link)
  certificateUnreferenced?: boolean;// true when 'destroyed' data-bearing device has no reference —
                                    // exported with an explicit flag (03 CP-5 edge, honest not blocking)
  note?: string;
  recordedByMemberId: string;
  idempotencyKey: string;
  at: string;
}

// ---- Jobs, artifacts, activity ----
export type JobKind = 'label-batch' | 'export';
export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  result?: { batchId?: string; artifactId?: string };
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;
  createdAt: string;
}
export interface ExportArtifact {
  id: string;
  workspaceId: string;
  format: 'csv' | 'json';
  scope: {                         // the filter snapshot the pack was generated from
    locationId?: string; categoryId?: string; retiredOnly?: boolean;
    includeCustodyHistory: boolean;
  };
  expiresAt: string;               // declared retention window at creation; renewal path (async-contract §2)
  regenerable: boolean;
  createdAt: string;
}
export interface ActivityEntry {   // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'asset-created' | 'asset-updated' | 'asset-retired'
    | 'category-created' | 'location-created' | 'person-created'
    | 'label-batch-requested' | 'label-applied' | 'label-state-reported'
    | 'custody-recorded' | 'custody-corrected'
    | 'export-run' | 'consent-change';
  targetRef: string;               // asset/label/batch/person/event id as applicable
  detail?: string;                 // e.g. "assign -> P-0031 (signature: typed-name)"
  at: string;
}

