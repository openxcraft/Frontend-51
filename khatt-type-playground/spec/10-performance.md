# 10 — Performance: khatt-type-playground

## Route budgets (gzip JS)

S1 catalog ≤ 120KB · S3 bench ≤ 240KB (glyph inspector + comparator lazy +60KB) · S5 composer ≤ 200KB · S6 share view ≤ 90KB (the reviewer path is lightest — opened from a link).

## Canvas interaction budgets (the product's core latency)

- Control commit → repaint (weight/scale/leading/numerals): ≤ 50ms p95 local; slider drag ≤16ms/frame (rAF-batched, no layout thrash).
- Feature toggle (`calt`/`ss01`/`jalt`) → repaint: ≤ 50ms p95 (re-render the affected block only).
- Kashida recompute on justified block (≤12 lines): ≤ 80ms p95 including per-line readout.
- Glyph-grid virtualized scroll ≤16ms/frame; focus-follow scroll never janks.
- LCP ≤ 2.0s (S3 with one font file resolved); CLS ≤ 0.02; TBT ≤ 150ms cold boot.

## Font loading strategy (the heavy asset class)

- woff2 only; per-script subsetting (`arabic`/`latin`), per-weight files; a session resolves at most 2 families × active weights (default 1 per script) — never family-wide bundles.
- font-display swap with **metric-matched fallbacks** (size-adjust/ascent-override per family) so the swap is visually calm and CLS-safe — the typography-UX guidance (font-loading rows) elevated to a product obligation: a type tool that flashes invisible or shifting text has failed at its own subject.
- Progressive weight ladder: render 400 immediately, hydrate the chosen display weight on arrival (visible per-font notice, 11).
- Uploaded fonts (N2) parse once, then serve like catalog fonts; parse is Job-class with cadence declared (07c).

## Perceived-performance strategy

Controls act on the currently loaded font instantly (local re-render); the authoritative file arrives asynchronously — the bench never waits on a download to respond. Skeletons mirror block geometry incl. direction (P02); catalog cards render metadata-first with self-demonstrating strips hydrating as files arrive; job progress in units ("Rendering block ٣ of ٧").

## Data-path rules

Catalog ≤ 50/cursor; glyph pages ≤ 96 cells/cursor, virtualization beyond 200 cells; sessions/specimens ≤ 50/cursor; job polling only when S7 visible; offline queue stores session patches with baseRevision (P20), reconciling to authoritative state on reconnect.

## Measurement points

1. Cold load S3 both directions (LCP/CLS/TBT) with the seeded Amiri + Source Serif 4 session.
2. Toggle benchmark: every feature toggle on the deep-feature fixture, p95 ≤ 50ms, zero layout shift.
3. Kashida benchmark: intensity 0→1 sweep on the 12-line justified fixture, p95 ≤ 80ms per step, readout inclusive.
4. Fallback-metric audit: swap-time visual delta per seeded family (no reflow > 2px on any text line).
5. RTL + reduced-motion variants run the same budgets.
