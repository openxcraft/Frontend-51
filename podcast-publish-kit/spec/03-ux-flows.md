# 03 — UX Flows: podcast-publish-kit

SME-C pass · Five critical paths, numbered, with edges / failures / recovery. The workbench is one surface; flows reference its zones (transcript pane · chapter timeline · notes composer · playback bar · checklist drawer).

## CP-1 — Episode setup → transcript import & alignment

1. **Boot**: the Episodes board (S1) renders; first-run shows the value checklist (P22: import a transcript → mark chapters → package the episode), each item linking into its flow. `getSession` resolves locale; board columns = derived stages (Draft · Transcript · Chapters · Notes · Packaged) via `listEpisodes`.
2. **Create show** (first-run): dialog collects bilingual title (P23 fields), category, numbering mode; `createShow` validates and the show appears in the rail. Later edits via `updateShow` (conflict-safe).
3. **Create episode**: inline quick-add on the board (bilingual title, optional number/season, optional release date, dual-calendar display per P24); `createEpisode` drops the card in Draft; `getEpisode` opens the workbench (S2) with the checklist drawer already flagging the missing transcript.
4. **Import transcript**: paste (always works) or pull from an abstract "transcript source" (08; paste is the LOOP-5 manual alternative). Format declared or auto-detected — the detection RESULT is shown, never a silent guess. `importTranscript` returns a Job (parsing + segmentizing exceeds 2s at hour-long volumes — async-contract §1).
5. **Job progress**: determinate segment counts ("مقاطع 340 من 912" / "Segments 340 of 912"); cancellable; on success the transcript pane renders the first virtualized page (`listSegments`) and the timeline ruler appears with duration coverage. Pasted text WITHOUT timestamps parks the job in `awaiting-input`: declare a duration or link the local audio reference — typing timecodes is never required (CP-2).
6. **Spot-fix pass**: segment text edits inline (P06: escape restores, tab commits and advances; `updateSegment` with baseRevision); suspect segments flagged `needsReview`. Playback (local audio reference from disk, never uploaded — 07a) verifies by ear; the persistent playback bar seeks to any segment's start.

**Edges**: overlapping SRT/VTT cues (warning with exact cue pair, import continues on confirmation); mixed-language transcript (language detection surfaces as a labeled guess; per-segment direction rendering, bidi-isolated Latin runs — rtl-rules §2); transcript longer than declared duration (warning, not block); re-import over an episode WITH chapters (chapters re-anchor by timecode match within ±2s; unmatched flagged, never silently dropped).
**Failures**: unparseable format → VALIDATION with the offending line number; transcript source unreachable → NETWORK with the paste path offered inline.
**Recovery**: cancelled imports leave the episode in Draft; jobs retain per-item results for retry-scoped re-runs (async-contract §4).

## CP-2 — Chapter marking with suggestion assist

1. **Request suggestions** (optional): quota context surfaces BEFORE the run (P14, in work units via `getUsage`). `suggestChapters` returns a Job; suggestion cards stream into a reserved review panel (no layout shift — P13), each with rationale, segment range, and confidence chip (icon+text).
2. **Review**: each card is a draft — proposed bilingual title + boundary + rationale ("تحوّل موضوع عند المقطع 236"). Accept applies it as a real chapter (`origin: 'assist'`); adjust edits first; reject dismisses with 7s undo (P03). Trust checkpoint (P15): acceptance is the explicit human promotion — the assist never writes chapters.
3. **Manual marking (first-class)**: focus any segment, ⌘Enter (or the timeline button) sets a boundary there; the chapter block appears; title fields focus inline. Boundaries snap to segment starts ONLY — no timecode typing, no scrubbing (02 pain #1).
4. **Edit loop**: rename (bilingual), merge, split at a segment, delete (7s undo — P03); drag a boundary along the timeline WITH keyboard equivalent (boundary + ←/→ by segment — WCAG 2.2 §2.5.7); mutations render optimistically with typed-error rollback (adapter authoritative — P03).
5. **Consistency lint**: live chips flag untitled chapters, missing-locale titles, sub-minute chapters, overlaps; `listChapters` re-fetches after mutations to reconcile.

**Edges**: assist unavailable / quota exhausted → degradation ladder (08 map; manual marking fully functional); suggestions overlapping manual chapters (overlap chips; accept merges or splits by choice); untimed transcript (order-anchored chapters; timecodes "pending timing" until duration or audio reference exists); zero chapters at package time (checklist blocks — CP-4).
**Failures**: suggestion failure mid-stream → partials retained + marked, retry-continuation offered (ai-native-patterns §2); stale baseVersion (two seats) → CONFLICT with both versions side-by-side; RATE_LIMIT at quota → ladder copy (11 §C) with the manual path affirmatively offered.
**Recovery**: all chapter mutations reversible in-session (undo windows + audit trail); deleted snapshots restorable within the window.

## CP-3 — Bilingual show notes composition

1. **Open composer**: the notes zone loads `getShowNotes` — structured sections (summary · takeaways · links · guest · chapter-list · CTA) with per-locale fields side-by-side (P23 alignment links; per-side direction; sync indicators: in-sync / edited-since / missing-locale).
2. **Draft per locale**: Arabic and English content per section (autosave P10; offline queue P20). Takeaways are list items; links are shared objects — one URL, bilingual labels (the locale-drift pain, 02).
3. **Insert the chapter list**: one action (⌘⇧P) inserts a GENERATED block — titles from chapters, timestamps derived from segment timings (single source of truth: this block cannot disagree with the chapters file — 00 unique feature). Re-renders on chapter changes with an edited-since marker.
4. **Parity pass**: indicators mark empty or dramatically-shorter locales (length-far-apart); the podcaster resolves or explicitly ships single-locale sections (conscious choice, checklist-visible).
5. **Save & stage**: `saveShowNotes` (baseRevision conflict-safe); notes completeness feeds the derived stage and the checklist.

**Edges**: tashkeel toggle (line-height widening notice — rtl-rules §3); long URLs in RTL prose (bidi isolation); intentional single-locale sections (explicit ship-as-is toggle).
**Failures**: save failure → offline-queued copy (11 §C); stale baseRevision → CONFLICT both-versions view (never silent overwrite).
**Recovery**: notes revisions retained; conflicts always offer a choice.

## CP-4 — Pre-publication checklist → package build

1. **Open checklist drawer**: `getEpisodeChecklist` renders derived items (transcript imported · chapters titled in active locales · timestamps monotonic and covered · notes summary per active locale · metadata complete) plus human sign-offs (final listen-through · guest approval) toggled via `setChecklistSignOff` (P17-traced).
2. **Resolve blockers**: every derived blocked item links directly to its fix surface (the exact untitled chapter; the exact empty section) — navigation, not scolding.
3. **Build package**: options — chapters format (namespace JSON · plain timestamps · both), locales, notes form (markdown · plain text); `buildPublicationPackage` (idempotency key) → Job → package appears in the Packages library (S7) with artifacts (`getArtifact` downloads; expiry declared at creation — async-contract §2; `renewArtifact` extends).
4. **Verify the artifact**: the package detail renders a human-readable digest of the chapters file (JSON shape as a table, mono timecodes) — the podcaster checks the deliverable, not the serialization. Rebuilds increment the version; history retained (`listPackages`/`getPackage`).

**Edges**: unknown host → "both" formats default (01 adoption evidence); expired artifact at download → expiry copy + renew; rebuild after post-package edits (version bump, prior artifacts kept to their own expiry).
**Failures**: build failure → typed error + retry with what completed reported (async-contract §4); artifact fetch failure → NETWORK retry.
**Recovery**: packages re-buildable from episode state at any time; artifacts renewable.

## CP-5 — Package delivery to a publication channel

1. **Channels surface (Settings · S9)**: `listChannelCredentials` renders publication-channel credentials with lifecycle states (unverified → active → rotating → expiring-soon → expired → revoked → failed — credential-contract §3), capability grants in operation language, masked identifiers, audit trail.
2. **Add a credential**: grant scope shown BEFORE saving ("يستقبل حزم الحلقات وينشرها باسم مساحة العمل"); the secret displays exactly once at creation (copyable, announced — §2), never again.
3. **Verify**: `verifyChannelCredential` exercises a real round-trip (never a fake success — §7); result inline.
4. **Deliver**: from the package detail, "سلّم إلى قناة النشر" → confirm naming package version + channel → `deliverPackage` Job → delivery receipt (reference + timestamp) recorded on the package.
5. **Manual alternative (always-first-class)**: the CP-4 download path is the declared LOOP-5 alternative — download the bundle, upload to the host by hand. Delivery sits BESIDE it, never above it.

**Edges**: expired/failed credential at delivery → degraded state names the credential + failure date, offers renewal or the manual path; rotating credential during delivery (grace window shown); older-version delivery (version named in the confirm).
**Failures**: channel refusal → typed error with the refusal surfaced verbatim where available; NETWORK mid-delivery → job reconciles to authoritative state (async-contract §5); grant mismatch → PERMISSION.
**Recovery**: failed deliveries retryable; idempotency keys prevent double-delivery (07b rule 5).

## Non-happy paths

- **Assist unavailable** (rung 4): suggestion entry point renders unavailability with reset estimate; manual marking unaffected and affirmatively presented (08 map).
- **First-run**: value checklist + sample episode fixture ("جرّب حلقة عيّنة" — the full pipeline on seeded data, 07c).
- **Offline (P20)**: board/packages read; notes + chapter mutations queue locally with per-item state; jobs reconcile on reconnect.
- **Job center (S8)**: `listJobs` filterable, link-to-context on every row, cancel/retry (async-contract §7; Tier-3 consolidated surface — 04).

## Flow → operation coverage table (every 07b operation; no orphans)

| # | 07b operation | Flow (step) | Screen |
|---|---------------|-------------|--------|
| 1 | `getSession` | CP-1.1 (boot, locale) | all |
| 2 | `getUsage` | CP-2.1 (pre-run quota, P14) | S2, S9 |
| 3 | `listShows` | CP-1.1 (rail context) | S1, S9 |
| 4 | `createShow` | CP-1.2 | S1 |
| 5 | `updateShow` | CP-1.2 (later edits) | S9 |
| 6 | `listEpisodes` | CP-1.1 (board) | S1 |
| 7 | `createEpisode` | CP-1.3 | S1 |
| 8 | `getEpisode` | CP-1.3 → workbench open | S2 |
| 9 | `updateEpisode` | CP-1.3 (metadata edits) | S2 |
| 10 | `importTranscript` | CP-1.4 (Job) | S2 |
| 11 | `getTranscript` | CP-1.5 (transcript metadata: coverage, language) | S2 |
| 12 | `listSegments` | CP-1.5 (virtualized pane pages) | S2 |
| 13 | `updateSegment` | CP-1.6 (spot-fix, P06) | S2 |
| 14 | `suggestChapters` | CP-2.1 (Job, metered) | S2 |
| 15 | `listChapters` | CP-2.5 (reconcile after mutations) | S2 |
| 16 | `createChapter` | CP-2.2 / CP-2.3 (accept / manual mark) | S2 |
| 17 | `updateChapter` | CP-2.4 (rename / move / merge / split) | S2 |
| 18 | `deleteChapter` | CP-2.4 (undo window) | S2 |
| 19 | `getShowNotes` | CP-3.1 (composer load) | S2 |
| 20 | `saveShowNotes` | CP-3.5 (autosave / stage) | S2 |
| 21 | `getEpisodeChecklist` | CP-4.1 (drawer) | S2 |
| 22 | `setChecklistSignOff` | CP-4.1 (human sign-offs) | S2 |
| 23 | `buildPublicationPackage` | CP-4.3 (Job) | S2, S7 |
| 24 | `listPackages` | CP-4.4 / CP-5 (library) | S7 |
| 25 | `getPackage` | CP-4.4 (digest + delivery context) | S7 |
| 26 | `deliverPackage` | CP-5.4 (Job, credential-gated) | S7 |
| 27 | `listChannelCredentials` | CP-5.1 (channels surface) | S9 |
| 28 | `saveChannelCredential` | CP-5.2 (grant shown pre-save) | S9 |
| 29 | `verifyChannelCredential` | CP-5.3 (real round-trip) | S9 |
| 30 | `revokeChannelCredential` | CP-5.1 (lifecycle action) | S9 |
| 31 | `listJobs` | non-happy (job center) | S8 |
| 32 | `getJob` | CP-1.5 / CP-2.1 / CP-4.3 / CP-5.4 (progress + await-input) | S2, S7, S8 |
| 33 | `cancelJob` | CP-1.5 (cancel parse), job center | S2, S8 |
| 34 | `getArtifact` | CP-4.3 (download) | S7 |
| 35 | `renewArtifact` | CP-4.4 (expiry renewal) | S7 |

## Failure → error mapping (portfolio 7-class taxonomy)

ValidationError (transcript format/line, chapter segment range, sign-off-while-blocked, credential input) · NotFoundError (episode/package/artifact gone) · PermissionError (workspace scoping, credential grant class) · ConflictError (concurrent chapter/notes/episode edits via baseVersion/baseRevision) · RateLimitError (suggestion-run quota ladder) · NetworkError (transcript source, delivery, offline) · UnknownError (typed reference + retry). Copy per class: 11 §C.
