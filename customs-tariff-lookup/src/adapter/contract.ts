// VERBATIM from specs-source/customs-tariff-lookup/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (NomenclatureNode,
// RulingNote, SavedCode, CodeChangeRecord — and their fields) are declared
// canonically in 07a and are part of this contract by reference; 07b declares
// only the operational wrappers (summaries, views, jobs, search inputs) its
// signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed/empty-after-normalization queries, duplicate saves, non-comparable edition pairs)
 * 'NOT_FOUND'    -> NotFoundError     (stale code/note/list/artifact deep links, retired codes in the current edition)
 * 'PERMISSION'   -> PermissionError   (assist consent, workspace scoping, viewer-role mutations)
 * 'CONFLICT'     -> ConflictError     (concurrent saved-code edits)
 * 'RATE_LIMIT'   -> RateLimitError    (assist runs, exports)
 * 'NETWORK'      -> NetworkError      (list/tree fetches, job polling, artifact delivery)
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
  role: 'owner' | 'editor' | 'viewer';  // viewer: read + export, no mutations
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entity summaries for lists (full shapes per 07a) ----

export interface ScheduleSummary {
  id: string;
  jurisdiction: string;
  labelEn: string;
  labelAr?: string;
  editionTag: string;
  codeLength: 6 | 8 | 10 | 12;
  effectiveFrom: string;
  status: 'current' | 'superseded' | 'announced';
  supersedesScheduleId?: string;
}

export interface NodeSummary {           // tree/search row shape
  id: string;
  scheduleId: string;
  code: string;
  level: 'section' | 'chapter' | 'heading' | 'subheading' | 'tariff-line';
  descriptionEn: string;
  descriptionAr?: string;                // absent = published-no-Arabic gap (07b rule 1)
  descriptionArSource: 'national-schedule' | 'none';
  childCount: number;
  hasDuty: boolean;                      // duty block present at this node
  noteCount: number;
  editionIntroducedIn?: string;
  editionRetiredIn?: string;
}

export interface NodeDetail extends NodeSummary {
  parentChain: { code: string; level: string; descriptionEn: string; descriptionAr?: string }[];
  duty?: {
    kind: 'ad-valorem' | 'specific' | 'compound' | 'exempt';
    ratePercent?: number;
    specific?: { amount: number; unit: string; unitLabelEn?: string; unitLabelAr?: string };
    scheduleNote?: string;
    /** Published reference, structurally incapable of carrying a guaranteed
     *  payable amount — the no-guarantee contract (LOOP-10) lives in the TYPE. */
  };
  exciseFlagged?: boolean;
  unitRequired?: boolean;
  noteRefs: string[];
}

export interface SearchHitView {
  node: NodeSummary;
  matchedField: 'en' | 'ar' | 'code';
  matchedTerms: string[];               // normalized matched terms (disclosure, ai-native-patterns §7.4)
}

export interface SuggestionView {
  provenance: 'assist' | 'deterministic-keyword';
  degraded: boolean;                    // requested assist, ran deterministic — surfaced, never silent
  candidates: {
    code: string;
    score: number;                      // 0..1
    matchedTerms: string[];
    rationale: string;                  // plain-language; bilingual where input was
  }[];
  notice?: string;
}

export interface NoteSummary {
  id: string;
  ref: string;
  authorityKind: 'national-customs' | 'wco-committee' | 'regional-bloc' | 'port-authority';
  jurisdiction: string;
  issuedOn: string;
  appliesToCodePrefix: string;
  outcomeCode: string;
  status: 'current' | 'superseded' | 'withdrawn';
  hasArabic: boolean;                   // goods description + summary Arabic side presence
}

export interface SavedCodeSummary {
  id: string;
  listId: string;
  scheduleId: string;                   // pinned edition
  hsCode: string;
  productDescriptionEn?: string;
  productDescriptionAr?: string;
  status: 'candidate' | 'desk-verified' | 'flagged';
  linkedNoteCount: number;
  addedAt: string;
  addedByMemberId: string;
  lastCheckedAt?: string;
  lastCheckedAgainstEdition?: string;
  version: number;
}

export interface ChangeRecordView {
  hsCode: string;
  changeKind: 'added' | 'retired' | 'description-changed' | 'rate-changed' | 'code-split' | 'unchanged';
  fromScheduleId: string;
  toScheduleId: string;
  detailEn: string;
  detailAr?: string;
  successorCode?: string;
  affectedSavedCodeIds: string[];
}

export interface JobView {
  id: string;
  kind: 'assist-run' | 'export' | 'content-refresh';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;
  result?: unknown;
  error?: AdapterError;
  createdAt: string;
}

// ---- Contract ----

export interface CustomsTariffAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // workspace
  updateWorkspaceSettings(patch: {
    defaultLocale?: 'ar' | 'en';
    assistDefault?: 'assist' | 'deterministic';
    activeScheduleId?: string;
  }): Promise<Result<Session, AdapterError>>;

  // schedules (national tariff editions)
  listSchedules(query: {
    filter?: { jurisdiction?: string[]; status?: ScheduleSummary['status'][] };
    sort: 'effectiveFrom' | 'jurisdiction';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ScheduleSummary>, AdapterError>>;
  getSchedule(id: string): Promise<Result<ScheduleSummary & { sourceNote: string; labelAr?: string }, AdapterError>>;

  // nomenclature — deterministic bilingual keyword search (the always-available spine)
  searchNomenclature(query: {
    scheduleId: string;
    text: string;                       // mixed-script; code-shaped input normalized (dots/spaces stripped)
    filter?: { chapterPrefix?: string; level?: NodeSummary['level'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<SearchHitView>, AdapterError>>;

  // nomenclature — conditionally-AI assist (abstract capability, 08 N2; consent-gated)
  suggestCandidates(input: {
    scheduleId: string;
    productDescription: string;         // free text, either script or mixed
    mode: 'assist' | 'deterministic';
    idempotencyKey: string;             // metered run — double-submit never double-charges
  }): Promise<Result<SuggestionView, AdapterError>>;

  // nomenclature — hierarchical browse (the deterministic spine's second face)
  listNomenclatureChildren(query: {
    scheduleId: string;
    parentCode: string | null;          // null = section level
    filter?: { includeRetired?: boolean };
    cursor?: string; limit: number;
  }): Promise<Result<Page<NodeSummary>, AdapterError>>;
  getNomenclatureNode(input: { scheduleId: string; code: string }): Promise<Result<NodeDetail, AdapterError>>;

  // published-rate compare across schedules (reference rendering only — 07b rule 2)
  compareDutyRates(input: {
    code: string;                       // 6-digit core or deeper; matched per schedule
    scheduleIds: string[];
  }): Promise<Result<{
    rows: { scheduleId: string; code: string; duty?: NodeDetail['duty']; absent?: boolean }[];
    absentSchedules: string[];          // named-absent partial (async-contract §4)
  }, AdapterError>>;

  // ruling notes library
  listRulingNotes(query: {
    filter?: {
      codePrefix?: string;
      authorityKind?: NoteSummary['authorityKind'][];
      status?: NoteSummary['status'][];
      jurisdiction?: string[];
      issuedAfter?: string; issuedBefore?: string;
    };
    search?: string;                    // bilingual notes search; same normalization grammar
    cursor?: string; limit: number;
  }): Promise<Result<Page<NoteSummary>, AdapterError>>;
  getRulingNote(id: string): Promise<Result<NoteSummary & {
    goodsDescriptionEn?: string;             // at least one side present (07a); absent side gap-marked
    goodsDescriptionAr?: string;
    summaryEn: string;                       // curated cataloging summary (EN = cataloging language)
    summaryAr?: string;
    supersedesRef?: string;
    supersededByRef?: string;
    effectiveEdition: string;
    sourceUrl?: string;
    linkedCodes: string[];
  }, AdapterError>>;

  // saved classification lists
  createBookmarkList(input: { nameEn: string; nameAr?: string }): Promise<Result<{ id: string; savedCodeCount: 0 }, AdapterError>>;
  listBookmarkLists(query: {
    cursor?: string; limit: number;
  }): Promise<Result<Page<{ id: string; nameEn: string; nameAr?: string; savedCodeCount: number; createdAt: string }>, AdapterError>>;
  getBookmarkList(id: string): Promise<Result<{ id: string; nameEn: string; nameAr?: string; savedCodeCount: number; createdAt: string; reviewState: { flagged: number; candidate: number; deskVerified: number } }, AdapterError>>;
  deleteBookmarkList(id: string): Promise<Result<{ deleted: true }, AdapterError>>;  // UI-side P04 level-3 confirm precedes this call

  // saved codes
  addSavedCode(input: {
    listId: string;
    scheduleId: string;                 // pinned edition at save
    hsCode: string;
    productDescriptionEn?: string;
    productDescriptionAr?: string;
    rationaleNote?: string;
  }): Promise<Result<SavedCodeSummary, AdapterError>>;
  listSavedCodes(query: {
    filter?: { listId?: string; scheduleId?: string; status?: SavedCodeSummary['status'][]; changedSinceEdition?: string };
    search?: string;                    // product description / code search
    sort: 'addedAt' | 'hsCode' | 'status';
    cursor?: string; limit: number;
  }): Promise<Result<Page<SavedCodeSummary>, AdapterError>>;
  updateSavedCode(id: string, patch: {
    productDescriptionEn?: string;
    productDescriptionAr?: string;
    status?: 'candidate' | 'desk-verified' | 'flagged';  // human signature (07b rule 4)
    rationaleNote?: string;
    repinScheduleId?: string;           // edition re-pin after human re-verification
    baseVersion: number;
  }): Promise<Result<SavedCodeSummary, AdapterError>>;
  removeSavedCode(id: string): Promise<Result<{ removed: true; undoWindowSeconds: 7 }, AdapterError>>;
  linkNoteToSavedCode(input: { savedCodeId: string; noteId: string }): Promise<Result<SavedCodeSummary, AdapterError>>;
  unlinkNoteFromSavedCode(input: { savedCodeId: string; noteId: string }): Promise<Result<SavedCodeSummary, AdapterError>>;

  // edition reconciliation
  listVersionDiffs(query: {
    fromScheduleId: string;
    toScheduleId: string;
    filter?: { changeKind?: ChangeRecordView['changeKind'][]; affectedSavedCodesOnly?: boolean };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ChangeRecordView>, AdapterError>>;
  checkCodeChanges(input: {
    fromScheduleId: string;
    toScheduleId: string;
    scope: { listIds?: string[] } | { allSavedCodes: true };
  }): Promise<Result<{
    checkedSavedCodes: number;
    affected: (ChangeRecordView & { savedCodeId: string; savedCodeStatus: SavedCodeSummary['status'] })[];
    unaffectedCount: number;
  }, AdapterError>>;                    // synchronous, deterministic, snapshot semantics

  // export handoff (abstract delivery; manual path is download — 08 N3, LOOP-5)
  exportEvidencePack(input: {
    listIds: string[];
    format: 'markdown' | 'csv';
    options: { includeNotes: boolean; includeDutyReferences: boolean };
    idempotencyKey: string;
  }): Promise<Result<JobView & { result?: { artifacts: { artifactId: string; expiresAt: string }[] } }, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: JobView['state'][]; kind?: JobView['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<JobView>, AdapterError>>;
  listActivity(query: {
    filter?: { actorMemberId?: string; action?: string[]; since?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<{ id: string; actorMemberId: string; action: string; targetRef: string; detail?: string; at: string }>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    assistRuns: number; assistQuota: number;
    exports: number;
    resetAt: string;
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
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

