# 10 — Performance: seo-brief-builder

## Route budgets (gzip JS)

S1 topics home ≤ 150KB · topic workspace shell ≤ 200KB (S3 cluster canvas + S4 parity lazy +60KB) · S6/S7 ≤ 110KB · S9 palette ≤ 30KB incremental.

## Interaction budgets

- Keyword table: keystroke-to-paint in normalization search ≤16ms; row focus highlight <80ms; virtualized window at 1,000+ keyword rows (P19) — scroll never moves focus.
- Cluster canvas: settle-in-place on membership move ≤180ms (crisp ceiling); suggestion chip render <100ms; canvas remains interactive during a running clustering job (progressive fill, no blocking).
- **Parity computation: ≤300ms at seed scale (≤500 keywords, ≤60 clusters per locale), ≤800ms at 5,000 keywords** — synchronous by design (07b); if a future dataset exceeds the budget, parity becomes a Job (async-contract threshold) rather than a spinner lie. The budget is the contract that keeps it synchronous at v1.
- **Diff/matrix recompute after gap resolution: ≤150ms** (one gap resolution must feel instant; the matrix cell flip is 120ms per motion-language).
- Brief editor: autosave debounce 800ms, save round-trip <400ms perceived (P10 calm cycle); reorder commit <100ms.
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (cluster canvas reserves card geometry before job completion; skeleton mirrors keyword-table and matrix geometry per direction, P02).

## Perceived-performance strategy

- Ingest and clustering are honest Jobs (P12): determinate row/cluster progress, cancellable, never faked-instant. Long ingests show named-row progress ("استيراد الصف ١٢٠ من ٤٠٠" class copy per async-contract §3).
- Progressive canvas fill: clusters appear as the job emits them (deterministic cadence 100ms/cluster in the Mock Adapter) — the workbench stays useful during the run.
- assist-mode clustering keeps the deterministic result on screen until the assist refinements arrive (no blank-waiting on the upgrade path).
- Exports deliver in-context when the surface is visible (async-contract §6 ladder 1); artifact link + expiry announced once.
- Offline (P20): keyword reads and brief editing queue writes with per-item state; jobs reconcile to authoritative state on reconnect.

## Asset strategy

Mada (400/500/700 ar) + Instrument Sans (400–700 en) subsets ≤ 140KB/direction; outline-geometric icon sprite single file; no font-display late-swap on the keyword table (data-first paint).

## Data-path rules

Keyword pages ≤ 100/cursor (07b typed pagination); clusters ≤ 50/cursor; >200-row tables virtualize; parity results cached per snapshot id (immutable — free re-reads); job polling only on visible surfaces (S7 / topic badges); ingest patches carry idempotency keys (no double-ingest on retry).

## Measurement protocol

1. Cold load S1 + topic workspace, both directions (LCP/CLS/TBT).
2. Keyword-table benchmark: 1,000-row virtualized scroll + normalized search, p95 keystroke ≤16ms, zero focus loss.
3. Parity benchmark: T1 seed scale p95 ≤300ms; 5,000-keyword synthetic scale p95 ≤800ms; matrix recompute ≤150ms.
4. Cluster-canvas benchmark: 60-cluster canvas membership move p95 ≤180ms; assist-suggestion render <100ms.
5. RTL + reduced-motion variants repeat 1–4 at identical budgets.
6. 400% zoom reflow pass on S2/S4 both directions (a11y-baseline §8.3).
