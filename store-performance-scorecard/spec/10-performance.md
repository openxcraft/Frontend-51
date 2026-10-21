# 10 — Performance: store-performance-scorecard

## Route budgets (gzip JS)

S1 chain overview ≤ 140KB · S2 scorecard workspace shell ≤ 190KB (S4 shift lens lazy +55KB; S3 store detail lazy +40KB) · S5/S6/S7 ≤ 130KB · S8 ≤ 100KB · S10 palette ≤ 30KB incremental.

## Interaction budgets

- **Ranked board**: row focus highlight <80ms; column sort re-render ≤180ms (energetic ceiling); keystroke-to-paint in the store search filter ≤16ms; virtualized window at >200 store rows (P19) — scroll never moves focus.
- **Shift lens**: KPI switch re-render ≤150ms (the one-key M switch, 09); cell drill to filtered records ≤250ms including navigation; grid stays interactive during record loads (progressive fill, no blocking).
- **Scorecard computation (runScorecard): ≤500ms at seed scale (12 stores × 104 weeks × ≤3 classes ≈ 11k records), ≤1.2s at chain scale (100 stores × 156 weeks ≈ 100k records)** — synchronous by design (07b); if a future chain exceeds the budget, the run becomes a Job (async-contract threshold) rather than a spinner lie. The budget is the contract that keeps it synchronous at v1.
- **Re-run after import (delta read): ranked-board update ≤400ms**; rank-change announcements fire once per run, never per row.
- Import jobs: paced 60ms/row-chunk (07c cadence), determinate row progress, cancellable mid-job with the partial kept (async-contract §4).
- Export jobs: leadership-pack generation paced in named sections (board → breakdowns → lens grid → definitions appendix); cancel keeps completed sections per the partial policy.
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (the board reserves row geometry before the run arrives — skeletons mirror the ranked-table and lens-grid geometry per direction, P02; KPI plates reserve their figure box so display numerals never push layout).

## Perceived-performance strategy

- Imports and channel fetches are honest Jobs (P12): determinate row/store progress, cancellable, never faked-instant; long imports show named-row progress ("استيراد سجل ١٢٠ من ٤٠٠" class copy per async-contract §3, Western numerals in tables).
- Progressive board fill: on a re-run, rows update in place (settle-in-place, no spin-in) and the rank-change announcement lands once at completion — the board never races (the comparison grammar, 13).
- The shift lens keeps the previous KPI's grid on screen until the new one renders (no blank-waiting on a 150ms switch).
- Exports deliver in-context when S8/S1 is visible (async-contract §6 ladder 1); the artifact link + expiry announces once.
- Offline (P20): reads work; annotations and preference edits queue with per-item state; jobs reconcile to authoritative state on reconnect.
- Cache discipline: runs are immutable snapshots keyed by runId (free re-reads); coverage summaries memoized per (window, record-set version); the definitions surface is static per version.

## Asset strategy

Lalezar (400 ar display) + Bebas Neue (400 en display) + Readex Pro (400/500/600, both scripts, reading) subsets ≤ 150KB/direction total; duotone icon sprite single file; no font-display late-swap on the ranked board (data-first paint); display numerals render after the plate box reserves its space (CLS budget above).

## Data-path rules

Record pages ≤ 100/cursor (07b typed pagination); store lists ≤ 50/cursor; runs ≤ 20/cursor; >200-row tables virtualize; job polling only on visible surfaces (S8 / S1 return-state chips); import submits carry idempotency keys (no double-import on retry); channel fetches bounded to the requested window (never a full-history pull).

## Measurement protocol

1. Cold load S1 + S2, both directions (LCP/CLS/TBT).
2. Ranked-board benchmark: 100-store virtualized scroll + bilingual store search, p95 keystroke ≤16ms, zero focus loss; sort re-render p95 ≤180ms.
3. Scorecard engine benchmark: seed-scale (11k records) p95 ≤500ms; synthetic chain-scale (100k records) p95 ≤1.2s; re-run delta ≤400ms.
4. Shift-lens benchmark: KPI switch p95 ≤150ms with announcement; cell drill ≤250ms.
5. Import benchmark: 400-row paste job with determinate progress; cancel at 50% keeps the partial (07c policy).
6. RTL + reduced-motion variants repeat 1–5 at identical budgets.
7. 400% zoom reflow pass on S2/S4/S6 both directions (a11y-baseline §8.3).
