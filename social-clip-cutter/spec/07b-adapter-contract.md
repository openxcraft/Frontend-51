# 07b — Adapter Contract: social-clip-cutter (TypeScript, v1)

TYPES ONLY — no implementation, no providers, no framework. Contract name: **SocialClipCutterAdapterV1**. Loop-15 satisfied: full taxonomy, typed pagination, auth-agnostic session. AI declaration: **non-AI product** — `findHighlights` is a deterministic rule-based scoring pass (07a), not a model call; the only metered class is render minutes on export jobs (`getUsage`, P14).

```ts
/* ── Error taxonomy: the 7 portfolio classes ───────────────────────────────
 * ErrorCode tokens map 1:1 to taxonomy classes:
 *   'VALIDATION'  → ValidationError   (malformed transcript input, illegal
 *                                    clip segment range, offset beyond the
 *                                    anchor segment, malformed BurnInSpec,
 *                                    invalid credential input)
 *   'NOT_FOUND'   → NotFoundError    (episode source/clip/artifact/credential
 *                                    absent, expired artifact)
 *   'PERMISSION'  → PermissionError  (workspace scoping; credential grant class)
 *   'CONFLICT'    → ConflictError    (stale baseVersion/baseRevision — both
 *                                    payloads returned)
 *   'RATE_LIMIT'  → RateLimitError   (render-minute window on export jobs)
 *   'NETWORK'     → NetworkError     (transcript source pull, export job drop,
 *                                    offline)
 *   'UNKNOWN'     → UnknownError     (typed reference + retry; never bare)   */
export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;
  correlationId: string;                    // quoted in UNKNOWN copy (11 §C)
  retryable: boolean;
  details?: Record<string, string[]>;       // e.g. { 'line': ['41'], 'segmentIndex': ['118'] }
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: AdapterError };

export interface Session {                 // auth-agnostic: membership only, never a provider token
  memberId: string;
  workspaceId: string;
  role: 'owner' | 'editor';
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

/* ── Entity types: single source of truth is 07a-data-contract.md ────────── */
export type {
  LocaleContent, EpisodeLanguage, MediaRef, EpisodeStage, EpisodeSource,
  Transcript, TranscriptSegment, HighlightCandidate, ClipBoundary,
  ClipSelection, CaptionStyle, SafeZonePreset, BurnInSpec, BurnInWarningKind,
  BurnInWarning, ExportFormat, ExportArtifact, ExportOptions, JobKind,
  JobState, ExportJob, CredentialKind, Credential, ActivityEntry, Usage,
} from './07a-data-contract';

/* ── View types ──────────────────────────────────────────────────────────── */
export interface EpisodeSourceSummary {
  id: string; title: LocaleContent; language: EpisodeLanguage;
  stage: EpisodeStage;
  hasTranscript: boolean; clipCount: number; unspecedClipCount: number;
  updatedAt: string;
}

export interface SegmentMatch {
  segment: TranscriptSegment;
  matchRanges: Array<{ start: number; end: number }>;   // char offsets within segment text
}

export interface ClipSummary {
  id: string; episodeSourceId: string; title: LocaleContent;
  origin: 'manual' | 'highlight';
  durationSec?: number;                       // derived; absent when untimed
  hasSpec: boolean; warningCount: number;
  updatedAt: string;
}

/* ══════════════════════════════════════════════════════════════════════════
 * SocialClipCutterAdapterV1 — 32 operations
 * ══════════════════════════════════════════════════════════════════════════ */
export interface SocialClipCutterAdapterV1 {

  /* Session & metering ----------------------------------------------------- */
  getSession(): Promise<Result<Session>>;
  getUsage(): Promise<Result<Usage>>;          // render-minute window (the only meter)

  /* Episode sources --------------------------------------------------------- */
  listEpisodeSources(query: {
    filter?: { language?: EpisodeLanguage[]; stage?: EpisodeStage[]; hasTranscript?: boolean };
    sort: 'updatedAt' | 'title';
    cursor?: string; limit: number;
  }): Promise<Result<Page<EpisodeSourceSummary>>>;
  createEpisodeSource(input: {
    title: LocaleContent;
    language: EpisodeLanguage;
    mediaRef?: MediaRef;                       // label + locator only — media never uploads
    plannedDurationSec?: number;
  }): Promise<Result<EpisodeSource>>;
  getEpisodeSource(id: string): Promise<Result<EpisodeSource>>;
  updateEpisodeSource(
    id: string,
    input: Partial<Pick<EpisodeSource, 'title' | 'language' | 'mediaRef' | 'plannedDurationSec'>>,
    baseVersion: number,
  ): Promise<Result<EpisodeSource>>;
  deleteEpisodeSource(id: string): Promise<Result<{
    deleted: EpisodeSource;
    cascade: { clips: number; exportJobs: number };   // named in the P04 level-3 confirm
  }>>;

  /* Transcript import & alignment -------------------------------------------- */
  importTranscript(input: {
    episodeSourceId: string;
    source: { kind: 'pasted'; text: string } | { kind: 'transcript-source'; ref: string };
                                              // transcript-source = abstract capability (08); paste always works
    format?: 'timestamped-plain' | 'srt' | 'vtt' | 'untimed-plain';
                                              // omitted → adapter detects and REPORTS the detection
  }): Promise<Result<Job<{
    transcriptId: string;
    detectedFormat: Transcript['format'];
    language: Transcript['language'];
    segmentCount: number;
  }>>>;                                       // segmentizing exceeds 2s at hour-long volumes (async-contract §1)
  getTranscript(episodeSourceId: string): Promise<Result<Transcript>>;
  listSegments(transcriptId: string, query: { cursor?: string; limit: number }): Promise<Result<Page<TranscriptSegment>>>;
  updateSegment(transcriptId: string, segmentIndex: number, text: string, baseRevision: number): Promise<Result<TranscriptSegment>>;

  searchSegments(transcriptId: string, query: {
    text: string;                             // normalized per rtl-rules §4 (alef/hamza, taa marbuta/heh, yaa/alif maqsura, tashkeel stripping)
    cursor?: string; limit: number;
  }): Promise<Result<Page<SegmentMatch>>>;

  /* Highlight heuristics (deterministic — the declared non-AI assist) -------- */
  findHighlights(input: {
    transcriptId: string;
    options?: {
      minDurationSec?: number;                // default 15
      maxDurationSec?: number;                // default 90
      focusKeywordSets?: string[][];          // optional operator-declared sets; defaults from workspace settings
    };
  }): Promise<Result<HighlightCandidate[]>>;  // SYNCHRONOUS by design: an O(n) rule pass over an
                                              // in-contract transcript — no model, no quota, no Job.
                                              // Deterministic: identical input → identical output.

  /* Clips -------------------------------------------------------------------- */
  createClip(input: {
    episodeSourceId: string;
    boundary: Pick<ClipBoundary, 'startSegmentIndex' | 'endSegmentIndex' | 'startOffsetMs' | 'endOffsetMs'>;
    title?: LocaleContent;
    origin: 'manual' | 'highlight';           // acceptance of a candidate is always a human act
    highlightRef?: HighlightCandidate;        // pinned provenance when origin = 'highlight'
  }): Promise<Result<ClipSelection>>;
  listClips(query: {
    filter?: { episodeSourceId?: string; hasSpec?: boolean };
    sort: 'createdAt' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ClipSummary>>>;
  getClip(id: string): Promise<Result<ClipSelection>>;
  updateClip(
    id: string,
    input: Partial<Pick<ClipSelection, 'boundary' | 'title'>>,
    baseRevision: number,
  ): Promise<Result<ClipSelection>>;          // boundary moves re-derive timecodes AND re-lint spec warnings
  deleteClip(id: string): Promise<Result<{ deleted: ClipSelection }>>;   // snapshot for the 7s undo re-create (P03)

  setClipBurnInSpec(
    clipId: string,
    spec: BurnInSpec,
    baseRevision: number,
  ): Promise<Result<{ clip: ClipSelection; warnings: BurnInWarning[] }>>;   // deterministic lint, never a silent accept

  /* Caption styles ------------------------------------------------------------- */
  listCaptionStyles(query: { scope?: ('stock' | 'workspace')[] }): Promise<Result<CaptionStyle[]>>;
                                              // small catalog — unpaginated by design
  saveCaptionStyle(
    style: Omit<CaptionStyle, 'version'> & { id?: string },
    baseVersion?: number,
  ): Promise<Result<CaptionStyle>>;           // workspace-scope only; stock styles are read-only pins

  /* Export (render as a simulated async stage per async-contract; recipe = manual path) --- */
  exportClips(input: {
    clipIds: string[];
    options: ExportOptions;                   // mode 'render' | 'recipe' — recipe needs no render capability
    idempotencyKey: string;                   // double-submits never double-render (async-contract §5)
  }): Promise<Result<Job<{ artifactIds: string[]; warningsCarried: string[] }>>>;
                                              // render-minute metered (P14); recipe mode unmetered

  /* Jobs & artifacts ------------------------------------------------------------- */
  listJobs(query: {
    filter?: { state?: JobState; kind?: JobKind[]; episodeSourceId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ExportJob>>>;
  getJob(id: string): Promise<Result<ExportJob>>;
  cancelJob(id: string): Promise<Result<ExportJob>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; kind: ExportFormat }>>;
  renewArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; kind: ExportFormat }>>;

  /* Credentials (credential-contract) ---------------------------------------------- */
  listCredentials(): Promise<Result<Credential[]>>;
  saveCredential(input: {
    kind: CredentialKind;                     // 'media-source' | 'notification-channel'
    displayName: string;
    identifier: string;                       // full identifier + secret travel ONCE into the adapter; UI keeps hints only
    secret: string;
    capabilities: string[];                   // explicit grant classes, shown pre-save
  }): Promise<Result<Credential>>;             // secrets NEVER return in any response — the one-time
                                              // display happens in the UI at creation (credential-contract §2)
  verifyCredential(id: string): Promise<Result<Credential>>;        // real capability round-trip; never a fake success
  revokeCredential(id: string): Promise<Result<Credential>>;

  /* Accountability (P17) -------------------------------------------------------------- */
  listActivity(query: { filter?: { action?: string; memberId?: string }; cursor?: string; limit: number }): Promise<Result<Page<ActivityEntry>>>;
}
```

## Rules

1. **Boundaries derive timecodes from segment anchors** (07a obligation 1): `createClip`/`updateClip` accept segment indices + bounded offsets only; the adapter computes `startMs`/`endMs`; `endSegmentIndex ≥ startSegmentIndex` within the transcript's range, offsets within the anchor segment's duration — violations return VALIDATION with the offending index in `details`.
2. **`findHighlights` is deterministic and rule-specified** (non-AI declaration): the scoring rules (keyword density over declared sets, pause-boundary support over inter-segment gaps, hook patterns) are fixed in 07c; identical input yields identical candidates; rationale strings are table-driven. It NEVER writes clips and is NEVER metered.
3. **`setClipBurnInSpec` lints, never silently accepts** (07a obligation 3): the response's `warnings` are the deterministic lint result; `safe-zone-violation` and `bidi-reorder-risk` block the `specced` stage while remaining exportable with the warning list carried on the manifest.
4. **Stage is adapter-derived** (07a obligation 2); no operation can set `stage` directly.
5. **Optimistic concurrency everywhere**: stale `baseVersion`/`baseRevision` → CONFLICT with both payloads (episode source/segment/clip/spec/style); resolution is a user choice, never silent overwrite.
6. **Idempotency keys** on `exportClips` make retries and double-submits safe (async-contract §5).
7. **Jobs**: import parses with determinate segment progress and parks `awaiting-input` for untimed-plain transcripts (duration declaration); export jobs show per-clip determinate progress, deliver partial results with per-clip scoped retry (async-contract §4), and attach lint warnings to the manifest. Artifacts carry `expiresAt` + renewal.
8. **Render minutes are the only meter**: `exportClips` with `mode:'render'` consumes the window (RATE_LIMIT before work when exhausted; warn-at-80% is the UI's duty via `getUsage`); `mode:'recipe'`, selection, search, heuristics, specs, and lint are never metered.
9. **Secrets cross the boundary exactly once** at `saveCredential`; nothing downstream returns them (credential-contract §2, §7 never-events).
10. **No orphans**: every operation above is traced to ≥1 flow step in 03's coverage table (32/32).
11. **No provider names** anywhere in the contract; the transcript source, media source, render capability, and notification channel are abstract capabilities with declared manual alternatives (08).
