# 07a — Data Contract: asset-register-tracker

SME-G pass · Backend-agnostic · TypeScript interfaces ONLY (no implementation). AI declaration (ai-native-patterns §1): **non-AI product** — zero model-backed operations; the registry, label lifecycle, custody chain, and exports are deterministic state transitions specified exactly in 07b/07c. The mandated entity set (Asset, AssetCategory, QrLabel, LabelBatch, CustodyEvent, CustodySignature, Location, RetirementRecord) is declared below in full, with Workspace, Person, Job, ExportArtifact, and ActivityEntry completing the contract.

```ts
// ---- Foundations ----

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
```

## Relationships

Workspace 1—N AssetCategory / Location / Asset / QrLabel / LabelBatch / CustodyEvent / Person / RetirementRecord / ExportArtifact / ActivityEntry · Location self-referencing tree (parentId) · Asset N—1 AssetCategory · Asset N—1 Location · Asset 1—N QrLabel over time (labelId points at the live one; damaged/missing/retired labels keep history with replacedByLabelId chaining replacements) · LabelBatch 1—N QrLabel · Asset 1—N CustodyEvent (seq is the per-asset chain) · CustodyEvent 1—N CustodyEvent (correction edges) · Person 1—N CustodyEvent as from/to/signer · Asset 1—1 RetirementRecord · Job 1—1 LabelBatch-or-ExportArtifact.

## Operations (summary; typed signatures in 07b)

Assets: create, list, get, update (versioned), retire (creates RetirementRecord + retirement custody event; sets asset+label retired). Taxonomy: list/create categories; list/create locations. Labels: requestLabelBatch (Job), getLabelBatch, confirmLabelApplied, reportLabelState. Custody: recordCustodyEvent (all kinds; idempotent), listCustodyEvents. Scan: lookupByScan. People: list, create. Platform: getSession, listActivity, listJobs, exportRegister (Job), getArtifact, getUsage.

## State obligations

- **Append-only custody**: events are immutable; errors are corrected by appending a correction event referencing `correctsEventId` — never by edit (the audit trail's integrity is the product's core promise; 03 CP-2 edge).
- **Label lifecycle honesty**: a new label for an asset requires the prior label to be in a terminal-for-replacement state (damaged/missing/retired) — enforced by requestLabelBatch VALIDATION; applied labels are confirmed (printed ≠ applied); replacement chains preserved via replacedByLabelId.
- **Retirement freezes**: a retired asset's records (events, labels, retirement record) persist and remain readable; only mutations stop. Retirement with unresolved custody (with-holder/return-pending) is rejected.
- **People are never deleted**: inactive people keep their names in every historical event (custody chains must name real people; 12 Q-8).
- **Tag discipline**: tags are workspace-sequential, never reused after retirement (the printed namespace stays unambiguous forever).
- **Signatures are facts, not cryptography**: typed-name/drawn/scan-ack/staff-attest are operational attestations recorded with signer name + method + timestamp; legal e-signature posture is a recorded boundary (12 Q-6).
- **Partial-result policies**: label batches are atomic per batch (no half-printed sets); exports are single-artifact jobs with retry; custody events are atomic per event with offline-queue reconciliation (idempotencyKey).
- **No provider names anywhere** — print, notification, directory, and delivery capabilities are abstract needs (08).
