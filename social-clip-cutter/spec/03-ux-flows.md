# 03 — UX Flows: social-clip-cutter

SME-C pass · Five critical paths, numbered, with edges / failures / recovery. The workbench is one surface; flows reference its zones (transcript pane · clip rail · preview stage · burn-in studio mode · export bar). Non-AI declaration (ai-native-patterns §1): no streaming, no generation, no quota ladders on selection — the only metered class is render minutes on export jobs (P14).

## CP-1 — Episode source setup → transcript import & alignment

1. **Boot**: the Episodes board (S1) renders via `listEpisodeSources`; first-run shows the value checklist (P22: import a transcript → pick moments from text → ship captioned clips), each item linking into its flow. `getSession` resolves locale and role; board columns are derived stages (Draft · Transcript · Clips · Specced · Exported) — derived by the adapter, never stored client-side (07a rule).
2. **Create episode source**: quick-add dialog collects bilingual title (P23 fields), language (ar | en | mixed), optional planned duration, and an optional media reference (a label + locator the team already owns — the media NEVER uploads: the reference drives local playback only — 07a recorded rule). `createEpisodeSource` drops the card in Draft; `getEpisodeSource` opens the workbench (S2) with the checklist flagging the missing transcript.
3. **Import transcript**: paste (always works) or pull from an abstract "transcript source" (08; paste is the LOOP-5 manual alternative). Format declared or auto-detected — the detection RESULT is shown, never a silent guess. `importTranscript` returns a Job (segmentizing an hour-long transcript exceeds 2s — async-contract §1).
4. **Job progress**: determinate segment counts ("تحويل 340 من 912" / "Converting 340 of 912 segments"); cancellable; on success the transcript pane renders the first virtualized page (`listSegments`) with coverage/language from `getTranscript`. Pasted text WITHOUT timestamps parks the job in `awaiting-input`: declare a duration or link the media reference — typing timecodes is never required.
5. **Spot-fix pass**: segment text edits inline (P06: escape restores, tab commits and advances; `updateSegment` with baseRevision); suspect segments flagged `needsReview`; playback over the local media reference verifies by ear (the preview stage seeks to any segment's start).
6. **Transcript-source credential (optional pull path, Settings S9)**: `listCredentials` renders media-source credentials with lifecycle states (unverified → active → rotating → expiring-soon → expired → revoked → failed — credential-contract §3); `saveCredential` shows the grant scope BEFORE saving ("يقرأ التفريغات باسم مساحة العمل" / "Reads transcripts on behalf of the workspace") and displays the secret exactly once at creation (copyable, announced); `verifyCredential` exercises a real round-trip; `revokeCredential` ends the grant. Paste never depends on any of this.

**Edges**: overlapping SRT/VTT cues (warning with the exact cue pair, import continues on confirmation); mixed-language transcript (detection surfaces as a labeled guess; per-segment direction rendering with bidi-isolated Latin runs — rtl-rules §2); transcript longer than declared duration (warning, not block); re-import over a source WITH clips (boundaries re-anchor by timecode match within ±2s; unmatched clips flagged, never silently dropped).
**Failures**: unparseable format → VALIDATION with the offending line number in `details`; transcript source unreachable → NETWORK with the paste path offered inline; stale baseVersion on segment edits → CONFLICT with both payloads.
**Recovery**: cancelled imports leave the source in Draft; jobs retain per-item results for retry-scoped re-runs (async-contract §4); segment edits reversible in-session.

## CP-2 — Highlight selection from the transcript (the unique-feature flow)

1. **Search first (the operator's own recall)**: the transcript search box accepts Arabic or English; `searchSegments` runs normalization (alef/hamza variants, taa marbuta/heh, yaa/alif maqsura, tashkeel stripping — rtl-rules §4) and returns matched segments with match ranges; hits render highlighted; focus moves scroll (never the reverse — P19); Enter jumps hit-to-hit; the count announces politely.
2. **Run the heuristic pass (optional, deterministic)**: `findHighlights` with options (min/max duration, optional focus keyword sets) executes as a synchronous deterministic scoring pass over the loaded transcript — NOT a model call, NOT metered. Candidates render in the reserved review panel (S3), each carrying segment range, duration, score breakdown (keyword density, pause-boundary support, hook pattern), and a rationale string ("كثافة كلمات مفتاحية عالية عند المقاطع 118–162" / "High keyword density at segments 118–162") — inspectability is the contract.
3. **Review candidates**: each card is a DRAFT — accept promotes it via `createClip` with `origin:'highlight'` and a `highlightRef` to the candidate; adjust edits the range first; dismiss removes with a 7s undo affordance (P03). Acceptance is always an explicit human act — the heuristic never writes clips.
4. **Hand selection (always-first-class)**: focus a segment, ⇧+↑/↓ extends the selection range (a violet selection tint over the segment span), ⌘Enter creates the clip (`createClip` with `origin:'manual'`); the clip lands in the clip rail with derived timecodes from its segment anchors.
5. **Reconcile**: `listClips` re-fetches after mutations; `getClip` opens refinement (CP-3). The clip rail shows per-clip state chips (no burn-in spec yet · warnings pending · export-ready).

**Edges**: zero candidates (honest empty with threshold copy — 11 §A); candidate below minimum duration after adjustment (VALIDATION naming the minimum); hand selection overlapping an existing clip (offer split/merge/replace — never silent overlap); search zero hits (normalized-empty state with the normalization disclosure in the panel).
**Failures**: illegal segment range (end < start, out-of-bounds) → VALIDATION with the offending index; concurrent clip edits → CONFLICT both versions; transcript not yet imported → NOT_FOUND (entry point links back to CP-1).
**Recovery**: dismissed candidates restorable within the session; clips deletable with snapshot undo (CP-3.5).

## CP-3 — Clip boundary refinement

1. **Open the clip**: `getClip` loads boundary + title + spec state; the transcript pane highlights the clip's segment span; the preview stage plays the range over the local media reference (frame-accurate seek to `startMs + startOffsetMs`).
2. **Refine boundaries**: each boundary is a handle bound to a segment anchor; ←/→ move by one segment (⇧ for five); sub-second polish via start/end offset steppers (±250ms steps, direct numeric entry with validation — offsets are the ONLY free timecode entry in the product, bounded to the anchor segment's duration); optional snap-to-pause snaps an offset to the nearest inter-segment pause gap (the deterministic pause table from the heuristic pass, reused).
3. **Live lint**: duration bands (per-platform defaults: ≤60s Shorts-class, ≤90s Reels-class, configurable in settings); speaker-span warning (clip crosses a speaker change — the operator decides); timecode-pending state for untimed segments.
4. **Save**: `updateClip` with baseVersion — optimistic render with typed-error rollback (P03); the adapter re-derives timecodes from anchors and re-lints spec warnings; conflict surfaces both versions side-by-side (P10).
5. **Delete**: `deleteClip` returns the snapshot for the 7s undo re-create (P03); the clip rail reconciles via `listClips`.

**Edges**: boundary at transcript ends (clamp with announcement); offset beyond the anchor segment's bounds → VALIDATION with the legal range; clip spanning untimed segments (timecodes pending until duration/media reference resolves — CP-1.4 path).
**Failures**: CONFLICT (two seats refining the same clip); VALIDATION (range/offset); NETWORK mid-save → offline-queued copy (11 §C).
**Recovery**: clip revisions retained; conflicts always offer a choice; undo windows throughout.

## CP-4 — Arabic-safe caption burn-in spec

1. **Open the burn-in studio** (workbench mode, S5): `listCaptionStyles` renders the stock Arabic-safe catalog (families with real weight sets, stroke/shadow/background treatments — 07a) plus workspace styles; the picker previews each style ON THE CLIP'S OWN caption text (the actual Arabic strings, never dummies).
2. **Compose the spec**: `setClipBurnInSpec` persists {captionStyleId, placement (platform preset + vertical position + alignment within the safe zone), line policy (max lines, per-script line-length budgets), reading-speed gates (chars/sec per script), tashkeel line-height mode, sidecar flag (default on)}. The response returns the clip PLUS a deterministic warnings list — lint, not opinion: `reading-speed-exceeded`, `safe-zone-violation`, `line-overflow` (Arabic joined words cannot hyphenate), `bidi-reorder-risk` (mixed-direction run lacking isolation), `tashkeel-clipping-risk`.
3. **Preview both directions**: the preview stage composites the burn-in client-side over the local media reference (or the storyboard card fallback); a direction toggle renders the caption block RTL and LTR from identical spec data — the mixed-run fixture (a Latin product name inside an Arabic caption) must render correctly in BOTH (rtl-rules §2 bidi isolation; 09 matrix); warnings render as icon+text chips.
4. **Iterate**: placement nudges within the safe zone (drag with a keyboard equivalent — WCAG 2.2 §2.5.7; 1%-height arrow steps); reading-speed gate tuning per audience preset; warnings re-lint deterministically on every spec change; resolution is visible live.
5. **House styles (Layan/Omar path)**: duplicate a stock style → edit (family within the Arabic-safe catalog, weight from the family's REAL set — no synthetic bold, rtl-rules §3; size scale; stroke/shadow; background treatment) → `saveCaptionStyle` (workspace-scoped, versioned; CONFLICT on stale baseVersion); the new style appears in `listCaptionStyles`.

**Edges**: mixed ar/en segments (per-line direction policy: each caption line renders per its script, isolated at run boundaries); a style whose family lacks the spec'd weight (re-bind rule — the UI offers only real weights from 07a catalog data); export with warnings outstanding (allowed; the warning list rides the export manifest — honest; 11 §E states it); untimed clip (caption timing pending; lint still runs on text).
**Failures**: malformed spec (empty style id, placement out of range) → VALIDATION naming the field; stale baseVersion → CONFLICT; NOT_FOUND if the clip was deleted elsewhere.
**Recovery**: spec revisions retained per clip; style versions restorable.

## CP-5 — Export batch → artifacts

1. **Compose the batch**: bulk-select clips in the clip rail (P07 floating action bar naming the count); options: aspect ratios (9:16 default; 1:1 and 16:9 optional), burn-in on/off, sidecar caption files (default on — the accessibility answer, 01); quota context surfaces BEFORE queueing via `getUsage` (render-minute meter in the buyer's work units, warn at 80% — P14; selection and specs are NEVER metered).
2. **Queue**: `exportClips` with an idempotency key (double-submits never double-render — async-contract §5) returns a Job; the export bar and jobs center show per-clip determinate progress ("تصدير الكليب 3 من 6" / "Exporting clip 3 of 6" — written labels, not bare percentages).
3. **Monitor**: `listJobs` / `getJob` (S7); `cancelJob` is real and fast (one interaction); partial failures deliver what succeeded with failed clips marked and retryable ALONE (async-contract §4 — per-clip retry scope).
4. **Collect artifacts**: the artifacts library (S8) lists per-clip outputs (burned-in masters per aspect ratio + sidecar SRT/VTT + the batch's export manifest); `getArtifact` downloads with the expiry declared at creation; `renewArtifact` extends the window; artifacts never auto-redirect.
5. **Completion delivery ladder** (async-contract §6): in-context toast with the artifact link when visible; a permissioned notification via the workspace's notification channel when the operator navigated away (credential-gated, P21 tiers — lifecycle identical to CP-1.6); on re-entry, unfinished and recently-finished jobs surface on the board and library — never orphaned in a notification center.
6. **Manual alternative (LOOP-5, always-first-class)**: the export recipe — sidecar caption files + boundary timecodes + the burn-in spec sheet (a complete, human-readable rendering instruction set for any external editor). Downloadable WITHOUT rendering; co-equal with the render path in the same composer, never below it. The declared path for teams whose render pipeline is their own NLE.
7. **Accountability**: `listActivity` renders the filterable log (P17) — every clip mutation, spec change, export, credential event with actor + timestamp; linked from the jobs center and settings.

**Edges**: export with lint warnings outstanding (manifest carries the warning list — CP-4 edge); mixed-direction clips in one batch (per-clip sidecar files carry the direction policy); expired artifact at download (expiry copy + one-action renewal, 11 §C); re-export after clip edits (new job, prior artifacts persist to their own expiry).
**Failures**: RATE_LIMIT when the render-minute window is exhausted (ladder copy in 11 §C — selection/specs keep working, the recipe path is unlimited); render failure mid-batch → typed error + per-clip scoped retry; NETWORK mid-job → the job reconciles to authoritative state on reconnect (async-contract §5).
**Recovery**: batches re-queueable from clip state; artifacts renewable; failed clips retry alone.

## Non-happy paths

- **First-run** (no episode sources): value checklist + sample episode fixture ("جرّب حلقة عيّنة" — the full pipeline on seeded data, 07c) — an interactive empty, not dead text.
- **Render quota exhausted** (P14 rung 4): the export composer renders the clean-unavailability state with reset time; the workbench (search, selection, boundaries, specs, lint) is fully functional and unmetered; the recipe path is unlimited and affirmatively presented (08 map).
- **Offline (P20)**: board/library reads; boundary and spec edits queue locally with per-item state and baseVersion; jobs reconcile on reconnect.
- **No-access (P01)**: workspace scoping copy — never "empty".
- **Transcript source unreachable**: NETWORK with the paste path inline (CP-1.6 degraded state names the credential + failure date — credential-contract §3).

## Flow → operation coverage table (every 07b operation; no orphans)

| # | 07b operation | Flow (step) | Screen |
|---|---------------|-------------|--------|
| 1 | `getSession` | CP-1.1 (boot, locale/role) | all |
| 2 | `getUsage` | CP-5.1 (pre-queue render-minute meter, P14) | S2, S6, S9 |
| 3 | `listEpisodeSources` | CP-1.1 (board) | S1 |
| 4 | `createEpisodeSource` | CP-1.2 | S1 |
| 5 | `getEpisodeSource` | CP-1.2 → workbench open | S2 |
| 6 | `updateEpisodeSource` | CP-1.2 (later metadata edits) | S2 |
| 7 | `deleteEpisodeSource` | non-happy (container delete, P04 level 3, cascade counts named) | S1 |
| 8 | `importTranscript` | CP-1.3 (Job) | S2 |
| 9 | `getTranscript` | CP-1.4 (coverage/language surface) | S2 |
| 10 | `listSegments` | CP-1.4 (virtualized pane pages) | S2 |
| 11 | `updateSegment` | CP-1.5 (spot-fix, P06) | S2 |
| 12 | `searchSegments` | CP-2.1 (normalized bilingual search) | S2 |
| 13 | `findHighlights` | CP-2.2 (deterministic heuristic pass) | S2, S3 |
| 14 | `createClip` | CP-2.3 (accept) / CP-2.4 (hand selection) | S2, S3 |
| 15 | `listClips` | CP-2.5 (clip rail reconcile) | S2 |
| 16 | `getClip` | CP-2.5 → CP-3.1 (refinement open) | S2, S4 |
| 17 | `updateClip` | CP-3.4 (boundary/title save) | S2, S4 |
| 18 | `deleteClip` | CP-3.5 (undo snapshot) | S2, S4 |
| 19 | `setClipBurnInSpec` | CP-4.2 (spec compose + lint warnings) | S5 |
| 20 | `listCaptionStyles` | CP-4.1 (style picker) | S5, S9 |
| 21 | `saveCaptionStyle` | CP-4.5 (house styles, versioned) | S5, S9 |
| 22 | `exportClips` | CP-5.2 (batch Job, idempotency key) | S6 |
| 23 | `listJobs` | CP-5.3 (jobs center) | S7 |
| 24 | `getJob` | CP-1.4 / CP-5.3 (progress + await-input) | S2, S6, S7 |
| 25 | `cancelJob` | CP-1.4 (cancel import) / CP-5.3 | S2, S7 |
| 26 | `getArtifact` | CP-5.4 (download) | S8 |
| 27 | `renewArtifact` | CP-5.4 (expiry renewal) | S8 |
| 28 | `listCredentials` | CP-1.6 (channels surface) | S9 |
| 29 | `saveCredential` | CP-1.6 (grant shown pre-save) | S9 |
| 30 | `verifyCredential` | CP-1.6 (real round-trip) | S9 |
| 31 | `revokeCredential` | CP-1.6 (lifecycle action) | S9 |
| 32 | `listActivity` | CP-5.7 (accountability log, P17) | S7, S9 |

## Failure → error mapping (portfolio 7-class taxonomy)

ValidationError (transcript format/line; clip segment range; offset beyond anchor bounds; malformed burn-in spec; credential input) · NotFoundError (episode source/clip/artifact/credential absent) · PermissionError (workspace scoping; credential grant class) · ConflictError (concurrent clip/boundary/spec/segment/style edits via baseVersion/baseRevision) · RateLimitError (render-minute window ladder) · NetworkError (transcript source pull, export job drop, offline) · UnknownError (typed reference + retry). Copy per class: 11 §C.
