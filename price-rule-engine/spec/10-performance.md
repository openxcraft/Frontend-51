# 10 — Performance: price-rule-engine

## Route budgets (gzip JS)

S1 console ≤ 150KB · S2 rule editor ≤ 200KB (FormulaPanel + scope pickers) · S3 catalog ≤ 180KB · S4 item detail ≤ 150KB · S5 composer ≤ 140KB · **S6 simulation workspace ≤ 260KB** (FormulaDrawer + saved-view engine lazy at +70KB) · S7 proposals ≤ 200KB · S8/S9/S10 ≤ 110KB. Fonts: Noto Kufi Arabic (400/600/700 — the bound instances, 05) + Space Grotesk (400/500/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (no FOIT, no layout shift — tabular figures verified on the bound substitute or the numeric companion re-bind recorded per 05).

## Interaction budgets

- **Keystroke-to-paint ≤ 16ms** in the paste composers (catalog and cost-sheet) and the rule editor's numeric fields — the typing paths.
- **Row focus → highlight < 80ms** (the crisp band, 05); bulk-select ActionBar renders < 80ms, zero layout shift (reserved viewport-inline edge).
- **FormulaDrawer opens ≤ 140ms** with zero CLS — the drawer's inline-end width is reserved even when closed, and the trace is already in the fetched row (07a carries `trace` on the row shape; the drawer never refetches).
- **FormulaPanel live update ≤ 120ms** on every field edit (06) — reserved height, no layout shift while typing.
- **SimulationSummaryHeader update ≤ 120ms after job completion** (06) — the header renders from the job result before the first row page is requested (summary-first, below).
- **Catalog margin recompute ≤ 50ms p95** per item after a cost-record save or manual price edit (07c simulates ≤ 30ms; the budget binds the implementation's rule 2/4 arithmetic incl. the `belowFloor` flip).
- **Gate status update ≤ 120ms** after any review action — a derived read recomputed from row states, never a refetch of the proposal (P11 review state is local).
- LCP ≤ 2.0s on S1 and S6 cold loads, both chrome directions; CLS ≤ 0.02 (table geometry reserved; skeletons mirror the summary-header + row-table layout per direction — P02; the FormulaPanel's height is reserved empty-or-filled).
- Arabic strings may run ~125% of English length (copy-voice §5): the names column and all chips budget for the worst case at 320px, not the average (09 matrix).

## Data-path rules (catalog scale is the design constraint)

- **Simulation-row and catalog virtualization at > 200 rows** (P19) — every "220 rows" figure in 03/06 sits deliberately above the line; the buyer's 5,000-SKU workspace (00) is the design constraint: cursor pages ≤ 100 rows on every list surface; scrolling never moves focus; row-count context announces on region entry (09).
- **Simulation is a Job and an atomic snapshot** (async-contract §1; 07b rule 8 — a half-computed margin preview is a lie): determinate per-item progress ("Simulating item 140 of 220"), the UI never fakes synchronous completion; at the 07c cadence (40ms per 10 items) the 220-item run completes ≈ 0.9s — visible as honest progress, not hidden as instant; the 5,000-item run takes ≈ 20s with progress, cancel within one interaction, and the immutable snapshot lands whole.
- Row pages carry their full `trace` arrays (07a) — 100 rows per page bounds the payload; heavier sorts (marginDelta) fetch identically through cursors; the drawer reads the fetched trace, never a per-row refetch.
- Imports (catalog, cost sheets) are Jobs at 40ms per 10 rows with named-row partial results; exports at 80ms per format with per-format retry (async-contract §4).
- Offline: reads render from local state; job submits (simulation runs, exports, imports) queue with their idempotency keys and reconcile to authoritative job state on reconnect (P20) — determinism makes reconciled results safe to trust without re-verification (07c rule 7).
- `getSimulation` re-reads are byte-identical (07c rule 7): the simulation detail cache revalidates without recompute risk — the one place the determinism contract pays a direct performance dividend.

## Perceived-performance strategy

1. **Summary-first**: on job completion the margin-preview header (the buyer's first question — 02 Salem's JTBD) renders from the job result before any row page is fetched; rows stream in behind it.
2. **Zero-reflow anatomy**: reserved drawer width, reserved FormulaPanel height, reserved ActionBar edge — findings, chips, and drawers arrive without CLS on a surface the buyer scrolls for minutes.
3. **Derived reads, not refetches**: gate status, belowFloor flags, and margin cells recompute locally within the declared budgets; every mutation's confirmation comes from the adapter's typed response (P03-free by design — simulation and proposal state are authoritative; conflicts surface both versions, 06).
4. **Honest determinate progress everywhere** (imports, simulations, exports) — never an indeterminate bar claiming percentage (async-contract §3).
5. Route-level code splitting keeps S6's 260KB budget while the drawer and saved-view engine load on first use.

## Measurement protocol

1. Cold load S1 + S6, both chrome directions (LCP/CLS/TBT), Arabic-name column populated at worst-case length.
2. Typing benchmark: 60-word Arabic item name pasted into the catalog composer and numeric rule fields — keystroke-to-paint p95 ≤ 16ms.
3. Live-recheck benchmark: a cost-record save that flips `belowFloor` — margin cell + floor flag recompute ≤ 50ms p95, zero layout shift.
4. Virtualization benchmark: 5,000-row simulation fixture — scroll performance and focus preservation (P19) with row-state announcements, both directions.
5. Job-at-scale benchmark: 5,000-item simulation — determinate progress visible < 2s from start, atomic snapshot on completion, cancel within one interaction; a 5,000-row cost-sheet import with named partial rows.
6. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
