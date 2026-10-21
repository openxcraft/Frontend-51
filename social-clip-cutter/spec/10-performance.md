# 10 — Performance: social-clip-cutter

## Route budgets (gzip JS)

S1 board ≤ 150KB · S2 workbench ≤ 280KB (burn-in studio + preview compositor lazy-chunked; import surface +40KB on demand) · S7 jobs ≤ 110KB · S8/S9 ≤ 110KB.

## Interaction budgets (the transcript surface is the product — these are the gates)

- **Transcript virtualization**: panes over 200 segments virtualize (P19); an hour-long Arabic episode is ~900–1,200 segments (07c seeds at 912/684/557/212) — the pane renders pages of 50 via cursor; segment focus moves scroll, never the reverse; SR users get row-count context on region entry.
- **Preview scrub latency**: playhead repaint rides the media clock (no JS animation loop while playing); seek-to-segment p95 < 100ms (frame-accurate seek to `startMs + startOffsetMs` over the local reference); boundary handle drag/hover highlight p95 < 80ms; handle snap feedback ≤ 80ms (press tactile ≤ 80ms — motion-language §2).
- **Search path**: normalized search over 912 segments returns p95 < 150ms with match ranges highlighted (the normalization map is precomputed per transcript load — never re-normalizing per keystroke); keystroke-to-highlight ≤ 16ms on the typing path.
- **Highlight pass**: `findHighlights` over 912 segments p95 < 400ms — synchronous by design (07b rule 2), and the budget PROVES the non-AI honesty (no spinner theater: if it were slower it would be a Job).
- **Spec lint**: `setClipBurnInSpec` lint recompute p95 < 100ms for a 90-second clip (~60 caption lines) — warnings resolve live during CP-4 iteration without debounce cliffs.
- **Typing path**: segment/boundary/title edits keystroke-to-paint ≤ 16ms (P06); autosave debounce 800ms, never blocking typing.
- **LCP ≤ 2.0s** on board and workbench cold loads, both directions; **CLS ≤ 0.02** (highlight panel region reserved pre-arrival — P13 geometry discipline without streaming; skeletons mirror workbench zone geometry — P02; RTL skeletons flip).
- **Export honesty**: render jobs show per-clip determinate progress (140ms/clip mock cadence; real binding per its own throughput — the contract is the written label, never a fake instant render); job polling only while the surface is visible (S2/S7); recipe mode assembles locally and downloads immediately.
- Clip-ready signature pop ≤ 250ms total, success-only (05).

## Export queue throughput (the metered path)

Batch renders pace per-clip with per-clip progress and partial-results retention (async-contract §4); the queue accepts batch sizes to 50 clips; concurrent jobs per workspace: 3 (further submits queue, honestly labeled queued — position when fair, "waiting" when not estimable); retry scope is the failed clip alone, never the batch. Render-minute consumption is reported after completion in actual minutes (P14 — before/after metering).

## Perceived-performance strategy

1. **Deterministic fast paths never wear progress chrome**: search and heuristics are sync-fast (budgeted above) — a spinner on either is a defect (honesty: the product's non-AI claim is measurable here).
2. **Staged workbench boot**: shell → zones → segments (skeleton mirrors each stage's geometry); the transcript's first page renders before the full import job's coverage stats arrive.
3. **Preview never blocks editing**: the burn-in preview composites over the local reference when present and falls back to storyboard cards instantly when absent — caption iteration is never gated on media availability (02 Salma's no-NLE path).
4. **Optimistic boundary moves** with typed-error rollback (P03) — the handle moves at input speed; the adapter reconciles.
5. **Offline queue** (P20): boundary/spec/title edits queue with baseRevision and flush with idempotency on reconnect; the board reads from cache.

## Asset strategy

Changa (400/500/700/800 ar subsets) + Archivo (400/500/700 + Expanded display subset) + IBM Plex Mono (400/500, tiny) ≤ 150KB/direction with `font-display: swap` and metric-compatible fallbacks reserved (ux-guidelines rows 50/75 — no FOIT); duotone icon sprite single file; no media bytes ever transfer (local reference only — 07a).

## Data-path rules

Board/clip pages ≤ 50/cursor; segment pages ≤ 50/cursor; caption-style catalog unpaginated (≤ dozens); jobs page ≤ 30; activity page ≤ 50; offline queue stores boundary/spec patches with baseRevision (P20); artifacts stream from adapter URLs (never buffered in UI state); sidecar caption files assemble client-side from clip state for recipe mode.

## Measurement points

1. Cold load S1 + S2, both directions, worst-case seed (ES-1: 912 segments, 6 clips, full specs): LCP/CLS/TBT.
2. Virtualization: scroll traversal of 1,200 segments with SR row-count announcements — no focus loss, no jank > 50ms.
3. Search benchmark: normalized Arabic query over 912 segments, p95 < 150ms, zero layout shift on highlight.
4. Boundary benchmark: handle drag across 900 segments — p95 highlight < 80ms; offset stepper keystroke-to-paint ≤ 16ms.
5. Highlight-pass benchmark: 912 segments, p95 < 400ms synchronous.
6. Lint benchmark: 60-caption-line clip spec change → warnings re-render p95 < 100ms.
7. Export job: 6-clip batch with one injected failure — partial-results delivery, scoped retry, per-clip announcements on change only.
8. RTL + reduced-motion variants of 1–7 at identical budgets.
