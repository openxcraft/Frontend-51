# 10 — Performance: inventory-count-assistant

## Route budgets (gzip JS)

S1 sessions home ≤ 130KB · S2 setup + S3 count view shell ≤ 180KB (S4 reconciliation lazy +60KB with the variance ledger) · S6 catalog ≤ 200KB (S8 policy editor lazy +40KB) · S9 console ≤ 110KB · S11 palette ≤ 30KB incremental.

## Interaction budgets (the counting path is the product)

- **S3 quantity keystroke-to-paint ≤ 16ms** (typing path — the counter's rhythm is the budget's reason); scan-to-row-focus < 80ms; entry commit → row state settle ≤ 120ms (crisp ceiling).
- **Directed-mode inline variance on entry ack: ≤ 150ms** compute+render (07c rule 9's 40ms ack leaves the budget headroom for render).
- **Reveal computation: ≤ 300ms at ≤ 2,000 scope items, ≤ 800ms at 20,000** — synchronous by design (07b CloseResult); if a future scope exceeds the budget, reveal becomes a Job (async-contract threshold) rather than a spinner lie. The budget is the contract that keeps the signature moment instant at store scale.
- Variance recompute after a recount entry or resolution: ≤ 150ms; IRA recompute ≤ 150ms (one division at session scale).
- Cadence proposal: ≤ 300ms at 10,000 catalog rows (deterministic sort over the register — 07c rule 3).
- Policy-editor worked example recompute: ≤ 100ms per field change (polite live region, never blocks typing).
- Autosave debounce 800ms; save round-trip < 400ms perceived (P10 calm cycle).
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (the count sheet reserves row geometry before session data lands; the masked tally column reserves its width — the reveal swaps content, never layout; skeletons mirror sheet/ledger geometry per direction, P02).

## Perceived-performance strategy

- Imports and exports are honest Jobs (P12): determinate row progress, cancellable, never faked-instant ("استيراد الصف 120 من 400" class copy per async-contract §3).
- The count view stays interactive during offline queueing: entries acknowledge locally in ≤ 16ms and reconcile to authoritative state on reconnect (P20 — the aisle dead-zone promise; the adapter remains authoritative per 07b rule 7).
- Blind-mode reads are structurally light (no variance computation before reveal) — the sheet paints fast by contract, not by cache luck.
- Store IRA and session badges cache per closed session (immutable — free re-reads); the S1 list never recomputes arithmetic on navigation.
- Job polling only on visible surfaces (S9 / session badges); artifact links announce expiry once.

## Asset strategy

Changa (400/600/700 ar subsets) + Archivo (400/500/600/700 en subsets) ≤ 140KB/direction; outline-geometric icon sprite single file; tabular-figure settings enabled on Archivo for the numeric columns (no third family — 05); no font-display late-swap on the count sheet (data-first paint).

## Data-path rules

Catalog pages ≤ 100/cursor (07b typed pagination); count entries ≤ 100/cursor; >200-row surfaces virtualize (P19) — the catalog at 5,000 SKUs is the benchmark case; variance history pages ≤ 50/cursor (heavier rows); parity with focus preservation (focus moves scroll, never the reverse); offline queue stores entry payloads with idempotency keys (double-fire safe after reconnect — 07b rule 7).

## Measurement protocol

1. Cold load S1 + S3 + S4 both directions (LCP/CLS/TBT).
2. Counting benchmark: 200-entry session on S3 — p95 keystroke ≤16ms, scan-to-row <80ms, commit-settle ≤120ms, zero focus loss, zero layout shift at reveal.
3. Reveal benchmark: 2,000-item synthetic scope p95 ≤300ms; 20,000-item p95 ≤800ms; recount recompute ≤150ms.
4. Offline benchmark: airplane-mode entry of 20 items with queue flush — zero lost entries, zero duplicates (idempotency), progress announcements intact.
5. RTL + reduced-motion variants repeat 1–4 at identical budgets.
6. 400% zoom reflow pass on S3/S4 both directions (a11y-baseline §8.3).
