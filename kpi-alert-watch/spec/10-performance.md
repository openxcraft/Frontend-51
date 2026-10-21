# 10 — Performance: kpi-alert-watch

## Route budgets (gzip JS)

S1 console home ≤ 150KB · feed workspace + watch editor shell ≤ 200KB (S3 backtest panel lazy +40KB) · S6 digest view ≤ 110KB · S7/S8/S9 ≤ 110KB · S10 palette ≤ 30KB incremental. Series-chart renderer loads with S2/S5 only (the console home renders rows and chips, never charts).

## Interaction budgets (numbers are the contract)

- **Detection queue**: row focus highlight <80ms; keystroke-to-paint in triage search ≤16ms; virtualized window at 1,000+ detection rows (P19) — scroll never moves focus; arrival micro-interaction completes ≤200ms (energetic ceiling, 05).
- **Baseline + series rendering**: `getMetricSeries` 90-day window (89 points) renders <100ms; band computation is adapter-side (07c engine) and never re-computed client-side; chart point-inspector opens <80ms.
- **Backtest preview: ≤300ms at seed scale (1 watch, 89 points, 60-day window), ≤800ms at 20 feeds × 365 points** — synchronous by design (07b); a future scale beyond the budget converts backtest to a Job (async-contract threshold) rather than a spinner lie. The budget is the contract that keeps the fatigue guard instant: a preview the lead waits for is a preview she skips.
- **Digest assembly: ≤300ms at seed scale (11 detections), ≤800ms at 200-detection days** (07b `generateDigest` synchronous, idempotent per (period, date) — free re-renders).
- **Narration assist**: reserved region with estimated height before arrival (CLS ≤0.02 per stream — ai-native-patterns §2); template text renders immediately (it IS the default); assist section appends ≤2s p95 with the stall contract at >8s (retry guidance, never a frozen caret).
- **Snooze/dismiss/acknowledge round-trip**: <400ms perceived (P03 undo window is 7s — the status change must land well inside it).
- **LCP ≤ 2.0s both directions; CLS ≤ 0.02** (queue rows reserve geometry before the first fetch resolves; the digest skeleton is a document skeleton mirroring final geometry per direction, P02; the page-class banner reserves its slot before data — an interrupt that reflows the page is a double interruption).

## Perceived-performance strategy

- Ingestion, capability sync, live evaluation, and digest delivery are honest Jobs (P12): determinate progress in units (rows, points, watches, digests), cancellable, never faked-instant ("استيراد النقطة 45 من 89" class copy per async-contract §3).
- Live evaluation emits detections per-watch (deterministic cadence 100ms/watch in the Mock Adapter) — the queue fills progressively and stays interactive during the run.
- Backtest preview re-runs on every policy edit with debounce 400ms — tuning feels live without thrashing the engine.
- Same-day digest re-opens are byte-identical cache reads (07b rule 7) — the morning scan is instant the second time.
- Catch-up evaluations after workspace closure stamp true timestamps (07b rule 10) — no fake freshness, and no re-render storms: catch-up detections arrive as one batch with the missed-interval note.
- Offline (P20): digest reads and triage work from cache; status decisions queue with per-item state and reconcile on return (async-contract §5).

## Asset strategy

Harmattan (400/700 ar) + Work Sans (400/500/600/700 en) subsets ≤ 140KB/direction; duotone icon sprite single file (two-tone as SVG layers, not double requests); no font-display late-swap on the detection queue (data-first paint); the digest document renders text-first (the digest-reader seat on a slow connection reads sentences before charts).

## Data-path rules

Detection pages ≤ 100/cursor (07b typed pagination); feeds/watches ≤ 50/cursor; series reads bounded to the requested window (no unbounded series fetches — the chart requests what it shows); job polling only on visible surfaces (S8 / console badges); ingest/sync/evaluation/delivery carries idempotency keys (no double-ingest or double-delivery on retry); backtest requests carry the candidate policy inline (stateless, cacheable per (series, policy, window)).

## Measurement protocol

1. Cold load S1 + S6, both directions (LCP/CLS/TBT).
2. Queue benchmark: 1,000-row virtualized triage scroll + normalized search, p95 keystroke ≤16ms, zero focus loss.
3. Backtest benchmark: seed-scale p95 ≤300ms; 20-feed × 365-point synthetic scale p95 ≤800ms; re-run byte-identical (idempotency assertion).
4. Digest benchmark: assembly p95 ≤300ms at 11 detections; ≤800ms at 200; re-render byte-identical; page-class banner paints before digest sections (interrupt-first order).
5. Narration benchmark: template-first render <100ms; assist append p95 ≤2s with reserved region and zero CLS.
6. RTL + reduced-motion variants repeat 1–5 at identical budgets.
7. 400% zoom reflow pass on S1/S5/S6 both directions, worst-case Arabic strings (a11y-baseline §8.3).
