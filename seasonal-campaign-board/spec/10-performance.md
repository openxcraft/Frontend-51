# 10 — Performance: seasonal-campaign-board

## Route budgets (gzip JS, desktop-first)

S1 library ≤ 140KB · S3 board ≤ 180KB (template editor lazy +60KB) · S4 checklist ≤ 160KB · S5–S7 ≤ 110KB each. Font strategy: Tajawal (400/700 ar) + Hanken Grotesk (400/500/700 en) subsets ≤ 140KB/direction; `font-display: swap` with matched-metric fallbacks to avoid FOIT/CLS (ux-guidelines rows 50/75 adopted); filled-rounded icon sprite single file.

## Board rendering at campaign scale (the core budget)

- **Rendering**: 50 campaigns × ~15 items = ~750 checklist rows across lanes — board renders lane summaries + countdown tiles only (not items); checklist surfaces virtualize beyond 200 rows with focus preservation (P19; ui-reasoning `if_large_dataset: virtualize-lists` adopted). Budget: board first paint ≤ 1.2s on the reference desktop (1280px), interaction-to-paint on row toggle ≤ 100ms p95.
- **Readiness recompute**: one item toggle changes one campaign's counts — recompute is O(items-in-campaign), rendered as a meter/text update; never a board-wide re-render (lane summaries patch in place).

## Countdown update strategy (no layout thrash)

- **Cadence**: countdown digit labels update on a single batched timer — once per minute when the board is visible, paused when hidden (document visibility) or the tile is offscreen; serverTime anchoring (07b) means updates are corrections, not ticks.
- **No layout thrash**: digit strings render in reserved-width tabular-numeral boxes (fixed `ch`-based width tokens — `countdown.tile.digit.width`); updates mutate `textContent` only — no width/height/top/left animation (ux-guidelines row 13 adopted: transform/opacity only); the urgency-state change (attention/overdue) is a class swap on pre-reserved chip geometry.
- **Announcement cost is zero on ticks**: live regions never fire per tick (09) — the a11y cost of countdowns is bounded by state transitions, not by time.

## Perceived-performance strategy

- Skeletons mirror lane/tile/checklist geometry including direction (P02 — RTL skeletons flip); countdown tiles reserve the digit box before data (CLS contribution ~0).
- Readiness meters render a cached last-known value with a subtle staleness treatment while recomputing — the board never blanks to spinners for sub-300ms recomputes (spinners reserved per P02).
- Campaign creation is synchronous-by-design (07c: deterministic instantiation) — no fake progress on a fast operation; exports are honest Jobs with determinate item counts (async-contract §3).
- Offline: board and checklists read from last state; queued writes show per-item state (P20); countdown runs against last known serverTime with an explicit "stale" badge — honest degradation over invented precision.

## Interaction budgets

Row toggle keystroke-to-paint ≤ 100ms p95 · inline-edit typing path ≤ 16ms · assignee menu open ≤ 80ms · LCP ≤ 2.0s (S3) · CLS ≤ 0.02 (reserved digit boxes, reserved meter geometry, skeleton mirroring) · INP ≤ 200ms on checklist paths.

## Measurement points

1. Cold load S1/S3/S4, both directions, both fonts (LCP/CLS/TBT).
2. Board at scale: 50-campaign fixture (07c seeds × deterministic scale fixture) — first paint, lane patch, toggle interaction p95s.
3. Countdown benchmark: 50 visible tiles, 1-minute batched update — zero style/layout recalcs beyond the 50 text nodes (layout-thrash guard), p95 frame time ≤ 4ms during the batch.
4. Checklist typing benchmark in inline edit (200-char Arabic title, p95 ≤ 16ms, worst-case joined-word reflow).
5. RTL + reduced-motion variants of 1–4 at identical budgets.
6. Virtualization focus test: 500-row checklist, arrow-key traversal — focus never lost, scroll follows focus (P19).
