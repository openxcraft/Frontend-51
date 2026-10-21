# 03 — UX Flows: interactive-story-builder

SME-C pass · 5 critical flows · failures use the 7-class taxonomy (07b) · every flow ends in recovery.

## CP-1 — Create story → structure → step authoring → preview (the spine)

1. Library → "New story": bilingual title (≥1 locale), default direction, starting point (blank | template | duplicate).
2. Template choice: deterministic audience arcs (newsroom five-part investigation · NGO impact · university field trip), each previewing its skeleton text-first (SR-equal). Blank = Chapter 1, Step 1 (full-bleed).
3. Outline editor: chapter rail (inline-start) + step board; autosave P10 (saving → saved → conflict → offline-queued).
4. Add step: RTL-native layout — full-bleed-media · text-over-media · media+text inline (inline-start/end) · figure-with-caption · pull-quote · stat-band; picker previews in story direction.
5. Author step: media ref (external URL or abstract capability, 08) with bilingual alt + credit; per-locale text; optional per-locale layout override (CP-3).
6. Preview any time: direction toggle (ar-rtl / en-ltr / side-by-side) + chapter progress; renders from story state, never a separate artifact.
7. Structural edits: drag reorder + ⌘/Ctrl+arrows (P18); optimistic with 5s undo (P03).

**Edges**: deleting a step removes BOTH locales' content → confirm names it (P04 level 2, both-locale counts); unreachable media URL → warning chip, step valid, preview shows the alt-text stand-in; zero-step chapter → marked empty (QA blocks export, not authoring); one-locale title → sync tracks (CP-2).
**Failures**: VALIDATION (empty title both locales; invalid media kind) field-linked, focus→first error; stale revision → CONFLICT, both versions side by side, choice required; concurrent reorder → CONFLICT, list refetched; session expiry → PERMISSION, autosave queue preserved.
**Recovery**: edits persist per step revision; conflicts keep both texts in history; offline queue (P20) flushes on reconnect.

## CP-2 — Bilingual chapter sync loop (the differentiator)

1. Sync panel per chapter: per-step alignment grid, ar/en columns, rows = shared steps (alignment by step index).
2. Derived row states: in-sync · edited-since-other (timestamped) · missing-in-locale (action: write) · length-divergent (>2× words; warning, never block) · layout-override (declared + reason).
3. Write missing locale inline (P06): Tab commits + advances; Escape restores; alignment link jumps preview to that step in that direction.
4. "Mark reviewed": explicit editorial act resetting edited-since to in-sync — parity is never silently decided.
5. Chapter rollup chips (x/y in-sync) in the outline rail; QA consumes the same derived state.

**Edges**: extra steps in one locale are impossible by design (structure is shared — extra content = locale text or override); accepted divergence → QA lists as reviewed; numeral differences follow policy, not divergence.
**Failures**: stale sync reads after offline edits → recomputed on reconnect; updateStep conflicts per CP-1.
**Recovery**: sync is derived — always recomputable; "mark reviewed" logged (P17).

## CP-3 — RTL/LTR step reflow and the QA gate

1. Direction is a rendering mode: the preview toggle renders the same story RTL (ar) or LTR (en); the editor canvas renders the default direction with a session toggle.
2. Mirroring per rtl-rules §2 (rail, step order, progress, side-by-side placement, breadcrumbs, pagination mirror; playback controls, logos, embedded Latin/numeric tokens do not).
3. Per-locale layout override: pin a step's media side for one locale; sync shows override + reason (CP-2.2).
4. Numeral policy: Arabic prose may render ٠–٩ per workspace toggle (canonical storage unchanged); stat-bands/time-codes stay Western.
5. "Check story" (validateStory): findings — missing alt (per media per locale) · missing-locale steps · unreviewed divergence · empty chapters · bidi hazards · numeral-policy violations · overrides without reasons. Each links to its step; export blocked only by errors (missing alt in export scope), never warnings.
6. Fix loop: jump-to-step per finding; re-run; rail shows checks pass / N issues.

**Edges**: mixed-direction user strings get bidi isolation on input (`dir="auto"`) + QA flag; wrong-policy digits → warning + one-click conformant render.
**Failures**: transport → NETWORK, report stale with re-run; stale story link → NOT_FOUND → library.
**Recovery**: QA re-runs deterministically at zero cost; findings persist per revision.

## CP-4 — Structure suggestion (conditionally-AI, draft-by-default)

1. "Suggest structure" from the outline editor: confirm brief (bilingual title/description or pasted summary) + audience arc.
2. suggestStructure runs as a Job: outline streams into a reserved review region (P13); announcements = start + completion summary only.
3. Proposal renders as outline diff vs current structure (P16): added/reordered/unchanged; nothing applies without explicit "Apply" with per-item opt-out (ai-native-patterns §6).
4. Apply inserts selected chapters/steps as drafts (sync starts missing-in-locale; content marked suggestion-origin until first human edit).
5. Quota (P14): window shown before/after; 80% warning; ladder per ai-native-patterns §5.

**Degradation (binding, ai-native-patterns §8)**: capability unavailable → the same review region is populated by a deterministic audience-arc template, labeled "template (non-generative)". Rungs: 1 full · 2 shorter with notice · 3 templates labeled · 4 clean unavailability + reset time. Farida's coursework runs entirely on rung 3.
**Edges**: one-locale brief → output inherits that locale, sync flags the other; applying onto existing chapters → merge proposal (append vs interleave), never silent overwrite.
**Failures**: quota → RATE_LIMIT with reset; stall >8s → stalled + retry guidance; mid-stream failure → partial kept, marked partial, retry-continue or discard.
**Recovery**: partial never promotes silently; applied suggestions are ordinary steps — editable, deletable, undoable.

## CP-5 — Review → approve → export → delivery

1. Producer sets story in-review (setStoryStatus); reviewers gain the review surface; post-submission edits re-flag the story as changed (surfaced, not silent).
2. Reviewer reviews chapter-by-chapter with the sync grid visible; pins step notes with locale context (addReviewNote); resolves as addressed; filterable list.
3. Approve — names the version; logged with actor + timestamp; later edits return the story to draft visibly.
4. Export: format (html-bundle | embed-package), locale scope (both | ar | en), watermark. validateStory gate: errors block; warnings listed with "export anyway" (never hidden).
5. exportStory runs as a Job with honest progress (chapters x of y); completion in-context; artifact linked with 7-day expiry + renew; jobs center lists all with cancel/retry.
6. Manual alternative (LOOP-5): the downloaded bundle is the deliverable — host or embed anywhere; no hosting, no analytics claims (LOOP-10).

**Edges**: unresolved notes at export → allowed, listed explicitly (editorial call); artifact expiry → expired state + one-click renew from current revision; duplicate-story copies structure + media refs, resets locale text (Omar's annual skeleton).
**Failures**: partial render failure → per-chapter partial artifact + scoped retry (async-contract §4); post-expiry fetch → NOT_FOUND + renew; reviewer mutation → PERMISSION ("comment instead"); export rate limit → RATE_LIMIT with reset.
**Recovery**: exports re-generate from story state at zero authoring cost.

## Flow → operation coverage table (every 07b operation; no orphans)

| Operation(s) | Flow(s) |
|---|---|
| getSession | all flows (session surface) |
| listStories; createStory; deleteStory; duplicateStory | CP-1.1 library actions; duplicate also CP-5.6 (Omar's annual skeleton) |
| getStory; updateStoryDetails | CP-1.3, CP-2.5, CP-3.1, CP-5.2 |
| setStoryStatus | CP-5.1, CP-5.3 |
| listTemplates | CP-1.2, CP-4 rung 3 |
| listChapters; createChapter; updateChapter; reorderChapters; deleteChapter | CP-1.3/1.7 |
| listSteps | CP-1.3, CP-2.1 |
| createStep; updateStep; reorderSteps; deleteStep | CP-1.4/1.5/1.7; updateStep also CP-2.3, CP-3.3 |
| getSyncState | CP-2.1/2.5, CP-5.2 |
| suggestStructure | CP-4.2 |
| validateStory | CP-3.5, CP-5.4 |
| addReviewNote; listReviewNotes; resolveReviewNote | CP-5.2 |
| exportStory; getExportArtifact; renewExportArtifact | CP-5.5/5.6 |
| listJobs; cancelJob | CP-4/CP-5 jobs center |
| listActivity | CP-2.5, CP-5.3 (accountability) |
| getUsage | CP-4.5, CP-5 quota meter |
