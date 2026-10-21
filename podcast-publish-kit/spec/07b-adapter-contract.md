# 07b — Adapter Contract: podcast-publish-kit (TypeScript, v1)

TYPES ONLY — no implementation, no providers, no framework. Contract name: **PodcastPublishKitAdapterV1**. Loop-15 satisfied: full taxonomy, typed pagination, auth-agnostic session. AI declaration: `suggestChapters` is the single declared assist operation (conditionally-AI, 07a); every other operation is deterministic product function.

```ts
/* ── Error taxonomy: the 7 portfolio classes ───────────────────────────────
 * ErrorCode tokens map 1:1 to taxonomy classes:
 *   'VALIDATION'  → ValidationError   (malformed transcript input, illegal
 *                                    chapter segment range, bad notes shape,
 *                                    invalid credential input)
 *   'NOT_FOUND'   → NotFoundError    (episode/package/artifact/credential absent)
 *   'PERMISSION'  → PermissionError  (workspace scoping; credential grant class)
 *   'CONFLICT'    → ConflictError    (stale baseVersion/baseRevision — both payloads returned)
 *   'RATE_LIMIT'  → RateLimitError   (chapter-suggestion quota window)
 *   'NETWORK'     → NetworkError     (transcript source, delivery, offline)
 *   'UNKNOWN'     → UnknownError     (typed reference + retry; never bare)      */
export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;
  correlationId: string;          // quoted in UNKNOWN copy (11 §C)
  retryable: boolean;
  details?: Record<string, string[]>;  // e.g. { 'line': ['41'], 'segmentIndex': ['217'] }
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: AdapterError };

export interface Session {        // auth-agnostic: membership only, never a provider token
  memberId: string;
  workspaceId: string;
  role: 'owner' | 'editor';
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

/* ── Entity types: single source of truth is 07a-data-contract.md ────────── */
export type { LocaleContent, Show, Episode, EpisodeStage, Transcript,
  TranscriptSegment, Chapter, ChapterSuggestion, NotesSection, NotesLink,
  ShowNotes, NotesSectionKind, ParityState, PublicationPackage, ExportArtifact,
  DeliveryReceipt, ChecklistItem, EpisodeChecklist, ChannelCredential,
  JobKind, JobState, Usage } from './07a-data-contract';
export interface Job<T> {                 // restated for contract completeness
  id: string; kind: JobKind; episodeId?: string;
  state: JobState;
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T; result?: T; error?: AdapterError;
}

/* ── View types ──────────────────────────────────────────────────────────── */
export interface ShowSummary { id: string; title: LocaleContent; episodeCount: number; activeLocales: ('ar' | 'en')[]; updatedAt: string; }
export interface EpisodeSummary { id: string; showId: string; number?: number; season?: number; title: LocaleContent; stage: EpisodeStage; hasTranscript: boolean; chapterCount: number; packageCount: number; updatedAt: string; }

/* ══════════════════════════════════════════════════════════════════════════
 * PodcastPublishKitAdapterV1 — 35 operations
 * ══════════════════════════════════════════════════════════════════════════ */
export interface PodcastPublishKitAdapterV1 {

  /* Session & metering ---------------------------------------------------- */
  getSession(): Promise<Result<Session>>;
  getUsage(): Promise<Result<Usage>>;

  /* Shows ------------------------------------------------------------------ */
  listShows(query: { cursor?: string; limit: number }): Promise<Result<Page<ShowSummary>>>;
  createShow(input: { title: LocaleContent; category?: string; numbering: Show['numbering']; notesTemplate?: NotesSectionKind[]; activeLocales: ('ar' | 'en')[] }): Promise<Result<Show>>;
  updateShow(id: string, input: Partial<Omit<Show, 'id' | 'workspaceId' | 'version'>>, baseVersion: number): Promise<Result<Show>>;

  /* Episodes --------------------------------------------------------------- */
  listEpisodes(query: { filter?: { showId?: string; stage?: EpisodeStage[] }; sort: 'updatedAt' | 'number'; cursor?: string; limit: number }): Promise<Result<Page<EpisodeSummary>>>;
  createEpisode(input: { showId: string; title: LocaleContent; number?: number; season?: number; plannedReleaseDate?: string; recordingDate?: string; durationSec?: number }): Promise<Result<Episode>>;
  getEpisode(id: string): Promise<Result<Episode>>;
  updateEpisode(id: string, input: Partial<Omit<Episode, 'id' | 'showId' | 'stage' | 'version'>>, baseVersion: number): Promise<Result<Episode>>;

  /* Transcript import & alignment ------------------------------------------ */
  importTranscript(input: {
    episodeId: string;
    source: { kind: 'pasted'; text: string } | { kind: 'transcript-source'; ref: string };  // abstract capability (08); paste always works
    format?: 'timestamped-plain' | 'srt' | 'vtt' | 'untimed-plain';   // omitted → adapter detects and REPORTS the detection
  }): Promise<Result<Job<{ transcriptId: string; detectedFormat: Transcript['format']; language: Transcript['language']; segmentCount: number }>>>;
  getTranscript(episodeId: string): Promise<Result<Transcript>>;
  listSegments(transcriptId: string, query: { cursor?: string; limit: number }): Promise<Result<Page<TranscriptSegment>>>;
  updateSegment(transcriptId: string, segmentIndex: number, text: string, baseRevision: number): Promise<Result<TranscriptSegment>>;

  /* Chapter suggestion (the declared assist — conditionally-AI) ------------ */
  suggestChapters(input: {
    episodeId: string;
    options?: { maxChapters?: number; draftLocales?: ('ar' | 'en')[] };
  }): Promise<Result<Job<ChapterSuggestion[]>>>;   // quota-metered (P14); degrades per 08 map; NEVER writes Chapters

  /* Chapters ---------------------------------------------------------------- */
  listChapters(episodeId: string): Promise<Result<Chapter[]>>;   // ordered by startSegmentIndex; ≤ a few dozen — unpaginated by design
  createChapter(input: { episodeId: string; startSegmentIndex: number; endSegmentIndex?: number; title: LocaleContent; summaryHint?: LocaleContent; origin: 'manual' | 'assist' }): Promise<Result<Chapter>>;
  updateChapter(id: string, input: Partial<Pick<Chapter, 'startSegmentIndex' | 'endSegmentIndex' | 'title' | 'summaryHint'>>, baseVersion: number): Promise<Result<Chapter>>;
  deleteChapter(id: string): Promise<Result<{ deleted: Chapter }>>;   // returns snapshot for the 7s undo re-create (P03)

  /* Show notes --------------------------------------------------------------- */
  getShowNotes(episodeId: string): Promise<Result<ShowNotes>>;
  saveShowNotes(episodeId: string, draft: ShowNotes, baseRevision: number): Promise<Result<ShowNotes>>;

  /* Checklist ---------------------------------------------------------------- */
  getEpisodeChecklist(episodeId: string): Promise<Result<EpisodeChecklist>>;
  setChecklistSignOff(episodeId: string, itemKey: string, signOff: { done: boolean; note?: string }): Promise<Result<EpisodeChecklist>>;

  /* Publication package ------------------------------------------------------- */
  buildPublicationPackage(input: {
    episodeId: string;
    options: PublicationPackage['options'];
    idempotencyKey: string;                    // double-submit never double-builds (async-contract §5)
  }): Promise<Result<Job<{ packageId: string; version: number }>>>;
  listPackages(query: { filter?: { episodeId?: string }; cursor?: string; limit: number }): Promise<Result<Page<PublicationPackage>>>;
  getPackage(id: string): Promise<Result<PublicationPackage>>;
  deliverPackage(input: {
    packageId: string;
    channelCredentialId: string;
    idempotencyKey: string;
  }): Promise<Result<Job<DeliveryReceipt>>>;   // abstract publication channel (08); manual download is the LOOP-5 alternative

  /* Channel credentials (credential-contract) ---------------------------------- */
  listChannelCredentials(): Promise<Result<ChannelCredential[]>>;
  saveChannelCredential(input: {
    displayName: string;
    identifier: string;                        // full identifier + secret travel ONCE into the adapter; UI keeps hints only
    secret: string;
    capabilities: string[];                    // explicit grant classes, shown pre-save
  }): Promise<Result<ChannelCredential>>;      // secrets NEVER return in any response — the one-time display happens in the UI at creation (credential-contract §2)
  verifyChannelCredential(id: string): Promise<Result<ChannelCredential>>;          // real capability round-trip; never a fake success
  revokeChannelCredential(id: string): Promise<Result<ChannelCredential>>;

  /* Jobs & artifacts ------------------------------------------------------------- */
  listJobs(query: { filter?: { state?: JobState; kind?: JobKind[]; episodeId?: string }; cursor?: string; limit: number }): Promise<Result<Page<Job<unknown>>>>;
  getJob(id: string): Promise<Result<Job<unknown>>>;
  cancelJob(id: string): Promise<Result<Job<unknown>>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; kind: ExportArtifact['kind'] }>>;
  renewArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; kind: ExportArtifact['kind'] }>>;
}
```

## Rules

1. **Chapters derive timecodes from segment anchors** (07a obligation 1): `createChapter`/`updateChapter` accept segment indices ONLY; the adapter computes startMs/endMs; `endSegmentIndex ≥ startSegmentIndex` within the transcript's range — violations return VALIDATION with the offending index in `details`.
2. **Suggestion is draft-only** (P15): `suggestChapters` never mutates chapters; acceptance is a separate `createChapter` with `origin: 'assist'`. Quota breaches return RATE_LIMIT before any work (P14 warn-at-80% is the UI's duty via `getUsage`).
3. **Stage is adapter-derived** (07a obligation 2); `updateEpisode` cannot set it.
4. **Optimistic concurrency everywhere**: stale `baseVersion`/`baseRevision` → CONFLICT with both payloads (chapter/notes/show/episode/segment); resolution is a user choice, never silent overwrite.
5. **Idempotency keys** on `buildPublicationPackage`/`deliverPackage` make retries and double-submits safe (async-contract §5).
6. **Jobs**: import parses with determinate segment progress and enters `awaiting-input` for untimed-plain transcripts (duration declaration); suggestion streams partials on failure (retained, marked); delivery failures surface the channel's refusal detail when available. Expiry: artifacts carry `expiresAt` + renewal (`renewArtifact`).
7. **Secrets cross the boundary exactly once** at `saveChannelCredential`; nothing downstream returns them (credential-contract §2, §7 never-events).
8. **No orphans**: every operation above is traced to ≥1 flow step in 03's coverage table (35/35).
9. **No provider names** anywhere in the contract; the transcript source and publication channel are abstract capabilities with declared manual alternatives (08).
