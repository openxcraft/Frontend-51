# 10 — Performance: shipping-rate-comparator

## Route budgets (gzip JS)

S1 cards home ≤ 140KB · card editor shell ≤ 180KB (S3 import surface lazy +40KB) · S4 comparison workbench ≤ 190KB (S5 breakdown sheet lazy +30KB) · S6/S7/S8 ≤ 110KB · S10 palette ≤ 30KB incremental.

## Interaction budgets (the product IS arithmetic — its latency IS the UX)

- **Comparison compute (runComparison): ≤300ms p95 at seed scale** (≤10 active cards, single profile), **≤800ms p95 at 100 active cards** — synchronous by design (07b); if a future card library exceeds the budget, the run becomes a Job per async-contract §1 rather than a spinner lie. The budget is the contract that keeps it synchronous at v1.
- **Batch rating (runBatchComparison): ≤150ms per destination p95** (determinate progress at 40ms/destination cadence in the Mock Adapter); a 500-destination batch completes ≤75s with cancellable, honest progress.
- **The Settle (computeChargeableWeight): keystroke-to-figure ≤16ms** — the calculator re-computes on every weight/dimension keystroke; typing "2.4" into the weight field must never lag the caret (P19 discipline applied to a form, not just lists). The op is pure, stateless, and client-cacheable per identical input tuple.
- **Zone probe (resolveZone): ≤80ms** per keystroke (debounced 120ms); probe results render inline under the field.
- Quote-row disclosure (breakdown sheet open): ≤100ms; results-table re-sort after a card toggles: ≤120ms (the minimal-motion ceiling).
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (the results table reserves row geometry before the run completes; skeleton mirrors the table's grid per direction — P02; the Settle's crossfade is opacity-only and never reflows).
- Autosave (card editor, P10): debounce 800ms, save round-trip <400ms perceived; conflict surface <200ms after the 409.

## Virtualization thresholds (P19)

Comparisons history >200 rows virtualizes (focus preserved, row-count context on region entry); batch matrix >50 destinations virtualizes rows; card library >100 cards virtualizes; price grid never virtualizes (a card's ladder is bounded by data-entry reality, ≤ dozens of breaks).

## Perceived-performance strategy

- Imports and batches are honest Jobs (P12): determinate row/destination progress, cancellable, never faked-instant. Long imports show named-row progress ("تحليل الصف 12 من 24" class copy per async-contract §3).
- The workbench stays interactive DURING a batch job: profile edits queue a re-run affordance; results arrive per the job's cadence (the morning surface never blocks the what-if loop).
- Comparisons are cache-friendly by construction: immutable snapshots keyed to (profile inputs, card versions) — re-running an unchanged tuple returns the identical snapshot free (07c replay assertion doubles as the cache contract).
- Exports deliver in-context when the surface is visible (async-contract §6 ladder 1); artifact link + expiry announced once.
- Offline (P20): card/profile reads work; writes queue with per-item state; jobs reconcile to authoritative state on reconnect (async-contract §5).

## Asset strategy

Scheherazade New (400/500/600/700 ar) + Libre Caslon Text (400/700 en) subsets ≤ 150KB/direction (the book faces are heavier than UI sans stacks — budgeted honestly); line-1.5 icon sprite single file; no font-display late-swap on the price grid (data-first paint — figures render in fallback metrics rather than blanking).

## Data-path rules

Card pages ≤ 50/cursor; comparisons ≤ 40/cursor; profiles ≤ 50/cursor (07b typed pagination); job polling only on visible surfaces (S8 / history badges); calculator calls carry no cursor state (pure function); import submits carry idempotency keys (no double-import on retry); batch jobs poll at 2s while visible, 10s when backgrounded.

## Measurement protocol

1. Cold load S1 + S4, both directions (LCP/CLS/TBT).
2. Settle benchmark: 1,000-keystroke sequence across weight/dims fields, p95 ≤16ms, zero caret lag under screen-reader echo.
3. Comparison benchmark: seed scale (3 cards) p95 ≤100ms warm / ≤300ms cold; 100-card synthetic library p95 ≤800ms; byte-identical replay across 10 runs (the determinism test doubles as the performance test).
4. Batch benchmark: 500-destination synthetic batch, per-destination p95 ≤150ms, cancel latency <1 interaction, partial delivery correct at every injected failure point.
5. Zone-probe benchmark: p95 ≤80ms at 1,000 coverage entries per card.
6. RTL + reduced-motion variants repeat 1–5 at identical budgets.
7. 400% zoom reflow pass on S2 price grid + S4 results table, both directions (a11y-baseline §8.3).
