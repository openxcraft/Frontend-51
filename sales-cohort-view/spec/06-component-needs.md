# 06 — Component Needs: sales-cohort-view

## Shared primitives consumed

Button, Menu, Dialog, Tabs (metric switcher + workspace sections), Tooltip, Toast, Skeleton, EmptyState, FilterChips (P08 — market/kind/period filters with removable chips), JobRow, DiffView (window edit compare, view change preview), ActionBar (bulk window actions, P07), CommandPalette (P05), AutosaveIndicator (P10 — season-window editor), Breadcrumb (drill context preservation).

## Invented components (10)

| Component | Purpose | Obligations |
|---|---|---|
| **CohortGrid** | the core surface: acquisition-cohort rows × period columns; four metric renderings; denominator always visible; small-sample cautions (N<30) and suppression (N<10, count-only); in-progress period marks; coverage-edge marks | P18 grid semantics (arrow navigation with physical mapping stable in both directions — rtl-rules §4); row/column headers re-announced on navigation; virtualized >60 cohort rows (P19) with focus preservation; sticky acquisition column + period header; cell values are tabular figures, Western numerals; every caution/suppression state is icon+text, never color alone; cells drill on Enter with focus return |
| **SeasonRail** | the overlay band along the acquisition axis: named season windows with phase stripes (build-up/peak/wind-down), drift ticks (±1 day), per-market lane; toggles with the signature 140ms settle | Band tint is decorative — structure carried by hairline borders, chips, and labels (05 contract); window names are text-safe deep inks; drift ticks have an accessible name ("date may shift by one day, moon sighting"); the rail is keyboard-navigable as a list (G jumps next window); geometry reserved before toggle (CLS ≤0.02) |
| **MetricSwitcher** | segmented control over the four canonical metrics (active customers, repeat purchase rate, cumulative revenue per customer, orders per active customer) | Radio-group semantics; current metric + its denominator sentence rendered in text next to the control (never color/icon alone); switching re-renders cells with values crossfading ≤120ms and the metric label changing in the same frame |
| **SeasonChip** | season-kind mark on cohort rows and period columns: kind icon + short label + composition share | Icon+text+color, never color alone (05 six-mark system); eid gold text uses the deep tier; chips have an accessible description carrying the full window name and dates; removable when used as filters (P08) |
| **CompositionSentence** | the disclosure line under the grid header: each cohort's season-composition share in plain arithmetic ("Ramadan peak 62% of window days · non-seasonal 38%") | Plain-text (SR-readable as a block); renders per content direction with bidi isolation for Arabic season names; visible wherever comparisons quote cohorts — the disclosure is a reading gate, not a footnote |
| **SeasonWindowEditor** | create/edit a season window: dual Hijri/Gregorian dates, phase map (three phase rows with day ranges), market, kind, drift disclosure toggle, provenance state | Labels persist above fields (a11y-baseline §5); dual-calendar inputs with the active system explicit + cross-reference on hover (P24); overlap validation at save with the named days and both windows (03 CP-3 edge); baseVersion carried for CONFLICT semantics; autosave indicator (P10) in the edit surface |
| **ComparisonDuel** | the season-aligned comparison: two cohort columns side by side, curves aligned at period 0, per-metric deltas, size-imbalance note, shared-complete-periods truncation note | Aligned two-column duel grammar (the CompareBoard pattern kinship — 12 Q-7): delta stated in text in every row, no animated race, no color-only direction; both cohorts' composition sentences render inside the duel; small-sample cautions propagate per period; truncation note is text, not a clipped axis |
| **CustomerDrillTable** | member list of a cohort or cell: customer key, display label (source-provided), first order date, order count, revenue to date | Read-only by construction (no customer mutations — LOOP-10 CRM exclusion); labels bidi-isolated (`dir="auto"`); missing labels render key-only with the stated reason; Western numerals, inline-end alignment mirrored in RTL; virtualized >200 rows (P19); export-membership action is the only row action |
| **FreshnessChip** | source health on every grid header: bound-state, last sync, coverage window, stale/failed degradation | Visible on every surface that quotes data (never settings-only — credential-contract §3 posture applied to source health); states icon+text; stale chip carries the last-good timestamp and the refresh action; announced politely on change, never assertively (09 schedule) |
| **RulesetPanel** | the definitions surface: four canonical metrics with exact formulas, thresholds (30/10), incomplete-period rule, coverage rule, ruleset version history | Renders formulas as text (SR-readable); each grid snapshot's version pin is a link to the version it ran under; versioned list with change notes; no collapsible hiding of the arithmetic (inspectability is the product's posture — 04 rationale) |

## Layer-3 token additions

`grid.cell.metric.*` (four metric value treatments: tabular figures, decimal policy per metric), `grid.cell.caution.*` (N<30 mark), `grid.cell.suppressed.*` (N<10 count-only), `grid.cell.inprogress.*` (period-in-progress), `season.rail.window.*` / `season.rail.phase.*` / `season.rail.drift.*`, `season.chip.{ramadan|white-friday|eid-al-fitr|eid-al-adha|national-day|back-to-school|custom}.*` (six-kind system, text tiers per 05 contracts), `composition.sentence.*`, `comparison.duel.delta.*`, `freshness.chip.{bound|syncing|stale|failed}.*` — all Layer 2 re-binds of the 05 palette; no raw values (token-architecture §1).

## Reused-with-twist

- **DiffView**: season-window edits preview old vs new dates/phases before commit (day-level rows, not character diffs); view-change preview when updating a saved view's query.
- **EmptyState**: S1 first-run loads the seeded sample world as an interactive empty (P22 — the season-anchored grid is experienceable before any binding); the season-calendar empty for an uncovered market offers curated defaults per kind.
- **Skeleton**: the grid skeleton is row-band and column-band geometry that flips with direction (P02); comparison skeleton mirrors the two-column duel.
- **Breadcrumb**: grid → cohort → customer drill carries snapshot id + query context (styles.csv Drill-Down adoption, 05 LOOP-9 record).

## Deviations recorded

- Fully-rounded removable filter chips inside density-B system: permitted exception for removable-chip semantics (P08), declared in 05; all other radii in the B family; grid cells are square by data-table geometry (recorded, not a deviation — the B family governs controls and panels).
- Icon flip decisions (rtl-rules §2): the drill glyph (cell-with-arrow) and period-axis chevrons flip in RTL; the season window-frames glyph, drift ± tick, suppression slashed-zero, and lattice glyphs never flip (semantic anchors); the phase-band order mirrors with the rail (time flows inline-start→inline-end in RTL).
- No quota meter component at all: the product is declared non-AI with unmetered deterministic computation — a meter would imply a rationed capability that does not exist (ai-native-patterns §1 discipline, recorded as an absence).
