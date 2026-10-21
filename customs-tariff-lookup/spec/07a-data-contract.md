# 07a — Data Contract: customs-tariff-lookup

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — one operation class (bilingual search assist: free-text product description → candidate headings with provenance) may bind an abstract assist capability (08 N2); hierarchical browse, bilingual keyword search, rate reading, notes, lists, edition reconciliation, and exports are deterministic by construction and never require the assist. TypeScript declarations for every entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type NomenclatureLevel =
  | 'section' | 'chapter' | 'heading' | 'subheading' | 'tariff-line';

// ---- Schedules (national tariff editions) ----

export interface TariffSchedule {
  id: string;
  jurisdiction: string;               // 'SA' | 'AE' | ... (display label carries the country name)
  labelEn: string;                    // e.g. "Integrated Customs Tariff — 2026 edition"
  labelAr?: string;                   // e.g. "الجدول الجمركي الموحد — إصدار 2026"
  editionTag: string;                 // e.g. "2026"
  codeLength: 6 | 8 | 10 | 12;        // national extension depth (6 = bare WCO core)
  effectiveFrom: string;             // ISO date; the honesty anchor for every rate
  status: 'current' | 'superseded' | 'announced';
  supersedesScheduleId?: string;
  sourceNote: string;                 // attribution/edition note, rendered in settings
}

// ---- Nomenclature tree ----

export type DutyKind = 'ad-valorem' | 'specific' | 'compound' | 'exempt';

export interface DutyReference {
  kind: DutyKind;
  ratePercent?: number;               // ad-valorem / compound ad-valorem part
  specific?: {                        // specific / compound specific part
    amount: number;
    unit: string;                     // e.g. 'kg' | 'L' | 'unit' — schedule's own unit
    unitLabelEn?: string;
    unitLabelAr?: string;
  };
  scheduleNote?: string;              // the schedule's own note text, if any
  /** Published reference only. There is NO field for a computed or
   *  guaranteed payable amount anywhere in this contract (LOOP-10). */
}

export interface NomenclatureNode {
  id: string;
  scheduleId: string;
  code: string;                       // digits only, no separators; '' for section level
  level: NomenclatureLevel;
  descriptionEn: string;              // international/national English text
  descriptionAr?: string;             // national rendering; ABSENT when unpublished
  descriptionArSource: 'national-schedule' | 'none';  // never 'machine' — no auto-translation
  parentCode: string | null;          // null at section level
  childCount: number;
  duty?: DutyReference;               // present on subheading/tariff-line when the schedule sets one
  exciseFlagged?: boolean;            // separate regime marker; never an amount
  unitRequired?: boolean;             // line requires a declared quantity unit at clearance
  noteRefs: string[];                 // ruling notes attached to this node (incl. inherited refs)
  editionIntroducedIn?: string;       // editionTag when this code is newly added
  editionRetiredIn?: string;          // editionTag when retired
}

export interface NomenclatureSearchHit {
  node: NomenclatureNode;
  matchedField: 'en' | 'ar' | 'code';
  matchedTerms: string[];             // normalized terms that matched (disclosed per ai-native-patterns §7.4)
  rank: number;                       // deterministic rank (07c rules)
}

export type SuggestionProvenance = 'assist' | 'deterministic-keyword';

export interface ClassificationCandidate {
  code: string;
  score: number;                      // 0..1, deterministic in mock; assist scores carry confidence semantics
  matchedTerms: string[];
  rationale: string;                  // plain-language, bilingual where the input was
}

export interface ClassificationSuggestion {
  provenance: SuggestionProvenance;
  degraded: boolean;                  // true when assist was requested but unavailable (honesty flag)
  candidates: ClassificationCandidate[];
  notice?: string;                    // degradation/quota notice text
}

// ---- Ruling notes (immutable reference records) ----

export type NoteStatus = 'current' | 'superseded' | 'withdrawn';
export type AuthorityKind =
  | 'national-customs' | 'wco-committee' | 'regional-bloc' | 'port-authority';

export interface RulingNote {
  id: string;
  ref: string;                        // human reference number, mono-rendered
  authorityKind: AuthorityKind;       // capability language, never a vendor/agency brand in chrome
  jurisdiction: string;
  issuedOn: string;                   // ISO date
  appliesToCodePrefix: string;        // the heading prefix the note interprets
  goodsDescriptionEn?: string;        // source as-carried: at least ONE side is present
  goodsDescriptionAr?: string;        // absent side renders the gap mark — never machine-filled
  outcomeCode: string;
  summaryEn: string;                  // curated cataloging summary (content pipeline; EN is the library's cataloging language)
  summaryAr?: string;                 // curated where the library's editors produced one — never generated at read time
  status: NoteStatus;
  supersedesRef?: string;
  supersededByRef?: string;
  effectiveEdition: string;           // editionTag the outcome code belongs to
  sourceUrl?: string;                 // public source link where the content carried one
}

// ---- Saved classification lists (the desk's memory) ----

export type SavedCodeStatus = 'candidate' | 'desk-verified' | 'flagged';

export interface BookmarkList {
  id: string;
  workspaceId: string;
  nameEn: string;
  nameAr?: string;
  createdAt: string;
  savedCodeCount: number;
}

export interface SavedCode {
  id: string;
  listId: string;
  scheduleId: string;                 // edition pinned at save (honest pinning)
  hsCode: string;
  productDescriptionEn?: string;      // the desk's own words for THEIR product
  productDescriptionAr?: string;
  status: SavedCodeStatus;
  rationaleNote?: string;             // free-text rationale
  linkedNoteRefs: string[];           // evidence binding (audit trail)
  addedAt: string;
  addedByMemberId: string;
  lastCheckedAt?: string;
  lastCheckedAgainstEdition?: string;
  version: number;                    // optimistic concurrency base
}

// ---- Edition change records ----

export type ChangeKind =
  | 'added' | 'retired' | 'description-changed' | 'rate-changed'
  | 'code-split' | 'unchanged';

export interface CodeChangeRecord {
  hsCode: string;
  changeKind: ChangeKind;
  fromScheduleId: string;
  toScheduleId: string;
  detailEn: string;
  detailAr?: string;
  successorCode?: string;             // migration path for retired/split codes when known
  affectedSavedCodeIds: string[];     // workspace reconciliation hook
}

// ---- Jobs, artifacts, activity ----

export type JobKind = 'assist-run' | 'export' | 'content-refresh';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';               // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                 // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;            // async-contract §5
  createdAt: string;
}

export interface ExportArtifact {
  id: string;
  kind: 'evidence-pack' | 'list-export';
  listIds: string[];
  format: 'markdown' | 'csv';
  includesNotes: boolean;
  includesDutyReferences: boolean;
  expiresAt: string;                 // declared retention window at creation
  regenerable: boolean;
}

export interface ActivityEntry {      // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'settings-changed' | 'schedule-switched'
    | 'list-created' | 'list-deleted'
    | 'code-saved' | 'code-updated' | 'code-removed'
    | 'note-linked' | 'note-unlinked'
    | 'edition-check-run' | 'assist-run' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                   // e.g. provenance of an assist run — audit honesty
  at: string;
}

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;
  assistDefault: 'assist' | 'deterministic';
  activeScheduleId: string;
  normalizationDisclosureVersion: string;   // rendered ruleset id (ai-native-patterns §7.4)
}
```

## Relationships

Workspace 1—N BookmarkList · BookmarkList 1—N SavedCode · SavedCode N—M RulingNote (evidence binding via linkedNoteRefs) · TariffSchedule 1—N NomenclatureNode (tree: parentCode chain) · NomenclatureNode 1—N RulingNote (appliesToCodePrefix attachment, inherited down the tree) · TariffSchedule pair 1—N CodeChangeRecord (edition diffs) · SavedCode → NomenclatureNode (hsCode + scheduleId pin) · Job spans assist/export/content-refresh work · ExportArtifact 1—N BookmarkList (via listIds).

## Operations (summary; typed signatures in 07b)

Platform: getSession, updateWorkspaceSettings, getUsage. Schedules: listSchedules, getSchedule. Nomenclature: searchNomenclature (deterministic bilingual keyword search), suggestCandidates (conditionally-AI assist, provenance + degraded flags), listNomenclatureChildren (browse), getNomenclatureNode (reading pane), compareDutyRates (cross-schedule published-rate compare — reference rendering only). Notes: listRulingNotes, getRulingNote. Lists: createBookmarkList, listBookmarkLists, getBookmarkList, deleteBookmarkList; saved codes: addSavedCode, listSavedCodes, updateSavedCode, removeSavedCode, linkNoteToSavedCode, unlinkNoteFromSavedCode. Editions: listVersionDiffs, checkCodeChanges. Export: exportEvidencePack (Job), getArtifact. Console: listJobs, listActivity.

## State obligations (lifecycle invariants)

- **Nomenclature and notes are immutable reference data**: no operation mutates a node or a note; edition transitions arrive as new TariffSchedule rows with CodeChangeRecords (content pipeline — 08 N1); a retired code keeps its node under its edition with `editionRetiredIn` set — tombstones, never deletions.
- **Arabic is never machine-filled**: `descriptionAr` exists only when the national schedule published it (`descriptionArSource: 'national-schedule'`); absence renders the gap mark (07b rule 1). Same for note goods descriptions and summaries.
- **No guarantee-shaped state exists**: DutyReference carries published structure only; there is no payable-amount field, no "estimated duty" entity, no assessment state anywhere in the contract (LOOP-10 enforced structurally).
- **Status is a human signature**: SavedCode.status moves candidate → desk-verified / flagged only via explicit human action (07b rule 4); the assist can never write status.
- **Saved codes pin editions honestly**: a saved code renders under its pinned schedule until a human re-verifies (edition reconciliation via checkCodeChanges); re-pinning records `lastCheckedAt` + `lastCheckedAgainstEdition`.
- **Evidence links are append-with-undo**: note links append to `linkedNoteRefs` and log ActivityEntry; unlinking is an explicit action, also logged (P17).
- **Partial-result policies** (async-contract §4): exportEvidencePack delivers sections that succeeded with per-section retry (codes / notes / render); compareDutyRates returns a named-absent partial when a schedule lacks the code; checkCodeChanges is atomic and synchronous (deterministic diff, no partials).
- **Version discipline**: SavedCode updates require `version` (optimistic concurrency → CONFLICT on staleness); reference data is immutable so no other versioning surface exists.
- **No provider names anywhere**: authority and capability references are kinds ('national-customs', assist capability class), never brands; the content pipeline is an abstract need (08 N1).
