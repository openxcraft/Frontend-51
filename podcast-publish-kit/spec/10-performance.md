# 10 — Performance: podcast-publish-kit

## Route budgets (gzip JS)

S1 board ≤ 150KB · S2 workbench ≤ 280KB (notes composer + timeline + player lazy-chunked; import surface +40KB on demand) · S7 packages ≤ 110KB · S8/S9 ≤ 110KB.

## Interaction budgets (the marking surface is the product — these are the gates)

- **Transcript virtualization**: panes over 200 segments virtualize (P19); an hour-long Arabic episode is ~900–1,200 segments — the pane renders pages of 50 via cursor; segment focus moves scroll, never the reverse; SR users get row-count context on region entry.
- **Timeline interaction latency**: boundary drag/hover highlight p95 < 80ms; playhead repaint rides the audio clock (no JS animation loop when playing); boundary snap feedback ≤ 80ms (press tactile ≤ 80ms — motion-language §2).
- **Notes typing path**: keystroke-to-paint ≤ 16ms (P06 inline edit; autosave debounce 800ms, never blocking typing); parity recomputation off the critical path (idle callback).
- **Chapter-list regeneration** on chapter mutation: ≤ 100ms for 30 chapters; `edited-since` marker renders without layout shift.
- **LCP ≤ 2.0s** on board and workbench cold loads, both directions; **CLS ≤ 0.02** (suggestion region reserved pre-arrival; skeletons mirror workbench zone geometry — P02; RTL skeletons flip).
- **Import honesty**: parse jobs show determinate segment counts; never fake instant completion (async-contract §1); job polling only while the surface is visible (S2/S8).
- Package-sealed overshoot ≤ 250ms total, success-only (05).

## Asset strategy

Rubik (400/500/700, ar+en subsets) + Space Mono (400/700, Latin-only, tiny) ≤ 150KB/direction with `font-display: swap` and metric-compatible fallbacks reserved (ux-guidelines rows 50/75 — no FOIT); duotone icon sprite single file; no audio bytes ever transfer (local file reference only — 07a).

## Data-path rules

Episode/board pages ≤ 50/cursor; segment pages ≤ 50/cursor; chapters unpaginated (≤ dozens); jobs page ≤ 30; offline queue stores notes section patches + chapter mutations with their baseRevision/baseVersion (P20) and flushes with idempotency on reconnect; exports stream from artifact URLs (never buffered in UI state).

## Measurement points

1. Cold load S1 + S2, both directions, worst-case seed (Ep 47: 912 segments, 11 chapters, full notes): LCP/CLS/TBT.
2. Timeline benchmark: 30-chapter episode, boundary drag across 900 segments — p95 highlight < 80ms, zero layout shift.
3. Typing benchmark: 120-word Arabic notes section, p95 keystroke-to-paint ≤ 16ms, autosave silent.
4. Virtualization: scroll traversal of 1,200 segments with SR row-count announcements — no focus loss, no jank > 50ms.
5. Suggestion stream: 7-card arrival into reserved region — CLS ≤ 0.02, announcements once.
6. RTL + reduced-motion variants of 1–5 at identical budgets.
