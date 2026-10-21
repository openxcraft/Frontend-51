# 06 — Component Needs: store-performance-scorecard

## Shared primitives consumed

Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips (P08 — basis/window/store filters as removable chips), JobRow, ActionBar (bulk record ops, P07), CommandPalette (P05), DiffView (run-vs-run and policy-version compare), AutosaveIndicator (pattern/policy editors, P10), QuotaMeter (channel-fetch window only, P14).

## Invented components (10)

| Component | Purpose | Obligations |
|---|---|---|
| **RankedBoard** | the scorecard table: one row per comp-eligible store — composite score, per-KPI LFL deltas (glyph + signed number + tint), comp badge, coverage mark, flag chips; sortable, rank-stable | P18 grid (arrow navigation, physical mapping stable in both directions, rtl-rules §4); virtualized >200 rows (P19) with focus preservation and row-count context on region entry; every delta is glyph+text+intent tint (never color alone); sticky header never covers focus (2.4.11 scroll-margin); rank changes announce politely with the moved count; 400% reflow — rows collapse to cards at 360px |
| **KpiTile** | the signage figure: one KPI on a citron plate — Bebas/Lalezar display figure, name in citron-deep, YoY delta strip, band chip, small-sample caution | ink-on-citron 6.69:1 contract (05); numerals Western tabular; caution state is text+icon (rust-deep), never tint-only; tile is a semantic listitem with the full value in accessible text; plate elevation is soft-lift, decorative only |
| **ShiftLensGrid** | the signature surface: stores × shift classes, each cell a normalized KPI value + YoY delta; matched classes only; "no trading" mark for unmatched cells | Table semantics with row/column headers re-announced on arrow navigation; diverging tints carry the number ALWAYS in-cell (charts contract); unmatched cells read "no trading" in text, never 0; classes with <4 trading stores carry the matched-capability caution line; KPI switch is one key (M) with ≤150ms re-render and a polite announcement |
| **CompBadge** | eligibility mark: comp-eligible / non-comp (reason: new, closed, insufficient history) / partial-period | duotone double-tick glyph + text label; tooltip names the rule and the measured value ("trading start 2026-W10; needs prior-year matched weeks — Method 2"); never color-only; keyboard-focusable with the reason in accessible text |
| **CompositionBar** | season-composition disclosure: stacked share bar per window side (current vs prior), season names bilingual, misalignment flag | share segments labeled in text with percentages (Western numerals); misalignment flag is text+icon (rust-deep), threshold named; both window sides announced as a summary on region entry; segments never rely on hue order alone (pattern overlay per charts contract) |
| **CoverageMeter** | expected-vs-present shift rows per store/window: gap list by date and class | gaps are named rows (date + class), not a percentage alone; under-threshold exclusion (ranking-out) states the reason in text; meter direction mirrors in RTL; per-gap link to the record table filtered to that gap |
| **OperatingPatternEditor** | author versioned shift windows: class, start/end, days, effective range, timezone; Ramadan patterns as new effective-dated versions | table semantics with time inputs (never free text); save creates a version (P04 level 2 confirm on overlapping effective ranges); concurrent edit → CONFLICT both payloads; keyboard-complete authoring (no drag required); effective-range overlap warning is inline, not modal |
| **ShiftRecordImporter** | paste/CSV import: column map preview, unknown store codes surfaced (create-or-fix offer), duplicate accounting, submit as Job | paste is never blocked (3.3.8); preview table is keyboard-navigable; malformed rows named (first bad row + count); source provenance chip (manual/import/channel) on every landed row; idempotency key visible in the job row (retry-safe) |
| **DefinitionsPanel** | the published-method surface: exact KPI formulas, comp rules, weights, versions — linked from every run | formulas are text + inline tokens (no images); version chips pinned per run; SR reads the formula as text; copy action exports the definitions block into the pack (07c); diff view between versions uses P16 grammar |
| **AnnotationThread** | dated context notes per store/date-range: author, time, text (bilingual authoring optional) | list semantics with visible timestamps announced with the action (P17); edit is additive (append + edit marker), never silent rewrite; annotations render at own script direction with bidi isolation (rtl-rules §2); attach link back to the affected run window |

## Layer-3 token additions

`board.row.delta.{above|below|caution}.*` (glyph+ink variants per 05 contracts), `tile.plate.figure.*` (display-figure settings per family), `lens.cell.{above-wash|below-wash|no-trading}.*`, `comp.badge.{eligible|non-comp|partial}.*`, `composition.bar.misaligned.*`, `coverage.gap.row.*`, `pattern.window.effective.*`, `annotation.thread.entry.*` — all Layer 2 re-binds of the 05 palette; no raw values (token-architecture §1).

## Reused-with-twist

- **DiffView**: run-vs-run compare (same window re-run after imports: per-store score and delta changes as structure rows) and policy-version compare — not character diffs.
- **QuotaMeter**: channel-fetch window only; manual imports deliberately render NO meter (unmetered by design — the paste path must not read as rationed, 08).
- **EmptyState**: S1 first-run offers the seeded sample world (interactive: loads the seeded chain so the ranked board, lens, and definitions are experienceable pre-import — CP non-happy path, P22).

## Icon-flip decisions (rtl-rules §2, recorded per glyph)

Drill chevrons and week-navigation arrows FLIP in RTL (directional). Sun-rise/sun-high/sun-low/moon shift-class marks NEVER flip (semantic anchors — time-of-day is not directional). Comp double-tick, coverage partial-plate, crescent-over-square season mark, annotation tag: never flip (symmetric or semantically anchored). Store awning-front: never flips (storefront metaphor is region-neutral). External-export arrow: flips (directional).
