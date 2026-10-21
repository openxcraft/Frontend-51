# 10 — Performance: ad-spend-consolidator

## Route budgets (gzip JS)

S1 dashboard ≤ 240KB (timeline + breakdown + version chip are one surface) · S2/S3 reconciliation & line items ≤ 200KB · S4 snapshots ≤ 130KB · S5/S6 overlays ≤ 160KB (moment editor lazy at +50KB) · S7 budgets ≤ 120KB · S8/S9/S10/S11 ≤ 110KB each. Fonts: Cairo (400/600/700/800) + Sora (400/500/600/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (skill rows 50/75 — no FOIT, no layout shift; tabular-figure settings verified on the fallback stack).

## Interaction budgets

- **Timeline day-focus → accessible-name update < 80ms**; band focus → comparison link active < 80ms; zero layout shift on either (CLS ≤ 0.02 — band width and version-chip width are reserved in the skeleton, P02).
- **Receipt expander open ≤ 140ms** (crisp band; height transition never moves content the user is reading more than once — motion-language §3).
- **Breakdown row focus → highlight < 80ms**; sort re-render < 150ms with stable keys (resolution must not re-sort mid-reading).
- **Pacing meter update after snapshot switch ≤ 120ms** (derived read — recomputed from snapshot totals, never a refetch of the workspace).
- **Overlay comparison compute-and-render ≤ 150ms p95** for a 26-month window set (the arithmetic is mean-daily over ≤ 780 days — the budget binds the implementation's calendar math, 07c rule 6).
- LCP ≤ 2.0s on S1 cold loads, both directions; TBT ≤ 150ms.

## Data-path rules (window scale is the design constraint)

- **Timeline virtualization at >200 rendered day rows** (P19) — the seeded 26-month window (780 days) is deliberately above the line; cursor pages ≤ 100 timeline points; scrolling never moves focus (focus moves scroll into view).
- **Breakdown and line-item tables virtualize above 200 rows** (P19); the line-item browser pages ≤ 100 rows with row-count context announced on region entry.
- **Consolidation is a Job** (async-contract §1): determinate per-record progress at the declared cadence (07c: 40ms/100 records — the 780-day seed consolidates in ≈ 5s of visible honest progress, never hidden as instant); the UI never simulates synchronous completion; cancel within one interaction.
- **Snapshot reads are pinned, not recomputed**: getSnapshot/getSpendTimeline/getSpendBreakdown read the immutable version's stored totals (07a — totals derive once at write, served at read); switching versions is a state swap ≤ 120ms, never a recompute.
- **Export packs stream per format**: each format lands as its own artifact part (async-contract §4); the reconciliation ledger renders incrementally (receipts stream in import-batch order) so a finance reviewer starts reading while the raw-line-items part still builds.
- **Offline queue** stores policy/moment/budget edits with baseVersion anchors; imports queue with per-item row state (P20); reads work from the last snapshot — the dashboard is read-heavy by design, so offline degrades least where the product works most.

## Perceived-performance strategy

1. **Pinned snapshots first**: the dashboard paints from stored totals (no engine invocation on read) — the "one number" is always paint-ready; only consolidation and comparison math run on demand.
2. **Reserved geometry**: band width, version-chip width, receipt expander height, and pace-strip height are reserved at skeleton time — findings, bands, and receipts arrive without reflow (CLS ≤ 0.02 across all of them).
3. **Staged criticals on consolidation**: as the job normalizes, channels land in the breakdown in priority order (the version chip ticks up per channel) — the reader watches the ledger compose instead of a spinner.
4. **Honest determinate progress everywhere** (imports, consolidations, exports) — never an indeterminate bar claiming percentage (async-contract §3).
5. Route-level code splitting keeps S1's 240KB budget while the moment editor and comparison engine load on first navigation to S5/S6.

## Measurement protocol

1. Cold load S1, both workspace directions (LCP/CLS/TBT) with the 26-month seeded window.
2. Day-focus benchmark: 780-day timeline — arrow traversal p95 < 80ms with announcements, zero focus loss on scroll (P19).
3. Comparison benchmark: Ramadan 1447 vs 1446 with control window over the full seeded world — compute-and-render p95 ≤ 150ms; excluded-days flag renders with the same budget.
4. Consolidation benchmark: full 5-channel 26-month re-derivation — determinate progress visible throughout, ≈ 5s at the seeded cadence, cancel effective within one interaction, byte-identical repeat run (07c determinism oracle).
5. Receipt-expansion benchmark: opening 50 receipts in sequence on the breakdown — each ≤ 140ms, cumulative CLS 0.
6. Export benchmark: 4-format pack on snapshot v4 — first format (consolidated statement) delivered < 3s, per-format partial behavior verified by injecting a failed format (07c failure injection).
7. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
