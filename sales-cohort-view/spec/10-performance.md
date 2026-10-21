# 10 — Performance: sales-cohort-view

## Route budgets (gzip JS)

S1 grid workspace ≤ 180KB (the grid + metric switcher + season rail are the product; comparison view lazy +50KB) · S4 season calendar ≤ 110KB · S7/S8 ≤ 90KB · S9 activity ≤ 90KB · palette ≤ 30KB incremental.

## Interaction budgets

- **Grid cell navigation: keystroke-to-highlight ≤16ms** (arrow keys are the analyst's primary motion — the CP-2 speed surface); cell focus announcement throttled to one per settled position.
- **Metric switch re-render ≤120ms** for a 40-cohort × 26-period grid (values crossfade within the crisp ceiling; the metric label changes in the same frame).
- **Season overlay toggle settle: 140ms** with geometry reserved before the toggle resolves — the band's height and the chips' row slots are pre-reserved, CLS ≤0.02 by construction (the signature micro-interaction's budget, 05).
- **Grid compute (the engine budget — the contract that keeps `computeGrid` synchronous, 07b rule 1): ≤300ms at seed scale** (≤7,000 orders, ≤60 cohorts, ≤26 periods); **≤800ms at 500,000 orders / ≤120 cohorts**; a dataset beyond that converts the operation to a Job (async-contract threshold) rather than faking a synchronous answer.
- **Cohort detail read ≤150ms; comparison compute ≤200ms; customer drill first page ≤250ms** at seed scale.
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (grid reserves row/column geometry before compute lands — the skeleton IS the grid geometry, P02); TBT ≤ 200ms on the grid route.
- Sample import: paced 60ms/row-chunk with determinate row progress; cancel within one interaction (async-contract §2).

## Virtualization thresholds (P19)

Cohort rows > 60 virtualize (a 2-year weekly grid = 104 rows); customer drill > 200 rows virtualizes with focus preservation; scrolling never moves focus — focus moves scroll into view; row-count context announced on region entry. Period columns render in full (bounded by range: ≤ 53 weekly / ≤ 24 monthly per query at v1).

## Perceived-performance strategy

- Grid compute is honest and synchronous under budget: no fake skeletons over fast work — the grid skeleton shows only while the compute promise is pending (≤300ms seed scale), then cells settle in place.
- Immutable snapshots make re-reads free: tab switches, drill returns, and export regeneration never recompute (07a state obligations — the evidence-reproducibility property doubles as the performance property).
- Freshness is a chip, not a blocking state: a stale source renders last-known snapshots immediately with the chip doing the honesty (08).
- Jobs (source refresh, sample import, export) are honest with determinate units (rows, sections) — never fake percentages (async-contract §3); exports deliver in-context when the surface is visible (§6 ladder 1).
- Offline (P20): reads serve from last-known snapshots; the product's only writes (calendar, views, settings) queue with per-item state; job state reconciles on reconnect (async-contract §5).

## Asset strategy

Noto Sans Arabic (400/500/700) + Manrope (400–800) subsets ≤ 140KB/direction; outline-geometric icon sprite single file; tabular-figures settings enabled via font feature, not a third family (LOOP-9 conflict 3/4 resolution); no font-display late-swap on the grid (data-first paint).

## Data-path rules

Customer drill pages ≤ 100/cursor; season windows ≤ 50/cursor; views/jobs/activity ≤ 50/cursor (07b typed pagination); snapshot re-reads cached per immutable id (free re-reads); job polling only on visible surfaces (S9 / the jobs badge); idempotency keys on every Job-carrying submit (no double-import on retry).

## Measurement protocol

1. Cold load S1 both directions (LCP/CLS/TBT), grid route at 1280px and 360px card-collapse.
2. Grid benchmark: seed-scale compute p95 ≤300ms; 500k-order synthetic scale p95 ≤800ms; metric switch p95 ≤120ms; keystroke nav p95 ≤16ms with zero focus loss over 1,000 arrow moves.
3. Overlay benchmark: toggle settle p95 ≤140ms with CLS ≤0.02 measured on the settle frame.
4. Drill benchmark: first page ≤250ms; 2,000-row virtualized scroll with focus preservation.
5. Export benchmark: evidence pack at seed scale completes ≤5s as a Job with per-section progress; expired-artifact regeneration byte-identical (replay-verified).
6. RTL + reduced-motion variants repeat 1–5 at identical budgets (a11y-baseline §8).
7. 400% zoom reflow pass on S1/S4/S5 both directions (a11y-baseline §8.3).
