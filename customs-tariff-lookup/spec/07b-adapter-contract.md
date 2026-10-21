# 07b — Adapter Contract: customs-tariff-lookup (TypeScript, v1)

SME-G pass · `CustomsTariffAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. Types only — no implementation. Entity semantics (TariffSchedule, NomenclatureNode, DutyReference, RulingNote, BookmarkList, SavedCode, CodeChangeRecord, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table, 0 orphans).

```ts
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
```

## Rules

1. **Bilingual honesty**: `descriptionAr` is present only when the national schedule published it; note goods descriptions carry the side(s) the source carried — at least one, never both machine-filled; the adapter NEVER merges or synthesizes a missing side; absence is data (gap mark at render). Search matches both scripts with the disclosed normalization ruleset (rtl-rules §4; ai-native-patterns §7.4) — the matched field is reported per hit.
2. **No-guarantee contract (LOOP-10)**: `DutyReference`/`duty` carries published structure (kind, rate percent, specific amount+unit, schedule note, edition label) and nothing else; NO operation computes, estimates, or promises a payable duty; rate-compare renders published values side-by-side and stops. Any future guarantee-shaped operation requires a new contract version and a re-opened 00 exclusions discussion (LOOP-4 seam, 12 Q-12).
3. **Assist honesty**: `suggestCandidates` returns `provenance` + `degraded`; quota exhaustion or capability unavailability degrades to deterministic-keyword candidates with the notice set — never a silent rerun; suggestions are draft-by-default: nothing in the suggestion result writes to lists, statuses, or notes (P15). Assist runs are metered (`getUsage`) and idempotent by key.
4. **Status is a human signature**: `updateSavedCode.status` and re-pinning require an explicit human action through the UI; `suggestCandidates` cannot write any state; `addSavedCode` always lands at status `candidate`.
5. **Stale-version semantics**: `updateSavedCode` with stale `baseVersion` → CONFLICT with both payloads in `details`; reference data is immutable so no other optimistic-concurrency surface exists.
6. **Consent enforcement**: `suggestCandidates` without a granted assist-capability consent → PERMISSION naming the capability class in capability language (credential-contract §4) — never a vendor name; the deterministic search path is unaffected by consent state.
7. **Partial-result policies**: `exportEvidencePack` delivers per-section partials (codes / notes / render) with per-section retry and determinate section progress (async-contract §3/§4); `compareDutyRates` returns named-absent rows for schedules lacking the code; `checkCodeChanges` is atomic and synchronous (budget-bound per 10-performance).
8. **Idempotency**: assist runs and exports carry idempotency keys; a retried submit returns the original job (async-contract §5). `addSavedCode` is idempotent by (listId, hsCode, scheduleId): a duplicate → VALIDATION "already saved in this list", never a silent second row.
9. **Edition pinning and reconciliation**: saved codes render under their pinned schedule; `checkCodeChanges` produces snapshot results (never mutates the lists it inspects); retired codes keep tombstone nodes and carry successor links where the change record knows them.
10. **Accountability**: every consequential mutation (settings, lists, saved codes, note links, edition checks, assist runs, exports) appends an ActivityEntry with actor, target, and provenance detail where relevant (P17); the activity log is filterable and exportable-in-pack.
11. **Jobs honesty**: progress is determinate in sections/items (never fake percentages); cancel is real; artifacts expire with declared windows and regenerate from current list state.
12. **Typed pagination on every list; cursors opaque; no orphan methods** — the 03 coverage table is the Critic-verified trace.
