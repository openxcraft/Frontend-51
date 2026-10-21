# 10 — Performance: invoice-generator-desk

## Route budgets (gzip JS)

S1 invoices home ≤ 150KB · composer shell (S2, grid + totals + preview engine) ≤ 200KB (S3 issued view shares the preview engine; lazy +40KB for render/export options) · S4/S5/S6 ≤ 110KB · S7/S8 ≤ 90KB · S9 palette ≤ 30KB incremental.

## Interaction budgets

- **Line-item keystroke-to-paint ≤ 16ms** (quantity, price, or discount edit → the row's live total repaints within one frame budget at p95; the row never re-layouts — tnum reserves figure widths).
- **Totals rail recompute ≤ 50ms at 60 line items** (deterministic arithmetic; the tax label swap on scheme change is part of this budget); announced politely only when the tax-visible amount changes (09 schedule).
- **Numeral flip full-document re-render ≤ 120ms** (the signature ceiling — minimal personality's upper bound; two render layers swap in one opacity step; preview geometry reserved so zero CLS).
- **Document preview paint after any draft mutation ≤ 100ms** (the preview updates in the same interaction frame as the edit pane; the paper never lags the form).
- Issue gate validation ≤ 80ms (synchronous gates — number assignment is atomic and instant); void/duplicate commit ≤ 120ms.
- Invoice list: virtualization threshold 200 rows (P19); row focus highlight < 80ms; scroll never moves focus.
- Autosave (drafts): debounce 800ms, save round-trip < 400ms perceived (P10 calm cycle).
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (the composer reserves both pane geometries before first paint; skeletons mirror the two-pane layout per direction, P02).

## Perceived-performance strategy

- Export and delivery are honest Jobs (P12): determinate progress in units (artifacts, sends), cancellable, never faked-instant; the download path delivers in-context when the surface is visible (async-contract §6 ladder 1).
- The composer stays fully interactive during any background job — issuing one invoice never freezes the list or the next draft (jobs are surfaces, not locks).
- Draft autosave is silent-calm (P10); conflicts surface both versions rather than blocking the typing surface.
- Offline (P20): issued-invoice reads and draft editing queue writes with per-item state; jobs reconcile to authoritative state on reconnect (async-contract §5).
- The numeral flip and render changes are render-layer operations — they never round-trip the data path (the guarantee the 16ms/120ms pair encodes).

## Asset strategy

Almarai (400/700 ar) + Inter (400/500/600 en) subsets ≤ 140KB/direction; line-2 icon sprite single file; no font-display late-swap on the totals rail or the document preview (money-first paint); the preview engine loads the amount-in-words tables (fixed, small) with the composer shell — never lazily after first render.

## Data-path rules

Invoice pages ≤ 100/cursor (07b typed pagination); clients ≤ 50/cursor; line items render fully (invoices are small documents — a 60-line cap per invoice is the workspace data-shape assumption behind the 50ms budget); jobs ≤ 30/cursor with polling only on visible surfaces; artifacts fetched once and cached per id with expiry metadata; every submit-shaped mutation carries an idempotency key (no double-issue, no double-mark on retry).

## Measurement protocol

1. Cold load S1 + composer, both directions (LCP/CLS/TBT) at 1280px and 360px.
2. Line-item benchmark: 60-row grid, p95 keystroke ≤ 16ms, zero focus loss over 500 sequential edits.
3. Numeral flip benchmark: full-document re-render p95 ≤ 120ms at the 60-line worst case; CLS = 0 across 20 flips; reduced-motion variant identical budget.
4. Totals recompute: scheme switch on a 60-line draft p95 ≤ 50ms including bilingual tax-label swap.
5. Issue/void/duplicate latency p95 ≤ 120ms with gate validation included.
6. List benchmark: 1,000-row virtualized scroll + normalized bilingual search (taa-marbuta variant), p95 ≤ 16ms keystroke.
7. RTL + reduced-motion variants repeat 1–6 at identical budgets; 400% zoom reflow pass on S2/S3 both directions (a11y-baseline §8.3).
