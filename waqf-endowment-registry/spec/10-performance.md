# 10 — Performance: waqf-endowment-registry

## Route budgets (gzip JS)

S1 endowments home ≤ 150KB · endowment detail shell ≤ 200KB (S5 ledger + S6 worksheet lazy +60KB) · S7 reports ≤ 130KB · S8/S9 ≤ 110KB · palette ≤ 30KB incremental.

## Interaction budgets

- **Allocation compute: ≤300ms at seed scale (one endowment, ≤2,000 ledger entries in period, ≤50 beneficiaries), ≤800ms at 20,000 entries** — synchronous by design (07b); if a future endowment exceeds the budget, allocation becomes a Job (async-contract threshold) rather than a spinner lie. The budget is the contract that keeps it synchronous at v1.
- **Report generation: ≤500ms at seed scale (one endowment, ≤5,000 lifetime entries), ≤1,200ms for a workspace-wide consolidation across 100 endowments** — synchronous snapshot computation; the same ceiling honesty applies.
- Ledger table: keystroke-to-paint in normalized bilingual search ≤16ms; row focus highlight <80ms; virtualized window at 1,000+ entries (P19) — scroll never moves focus.
- Worksheet: line hold/adjust commit <100ms; the derivation row re-renders with the adjustment in the same paint (computed and adjusted are one row pair, never two layouts).
- Seal action: server round-trip <400ms perceived; the settle animation (≤360ms) runs AFTER the state change is already visible in text (motion decorates, never delays, the pin).
- Policy/deed autosave: debounce 800ms, save round-trip <400ms perceived (P10 calm cycle).
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (the worksheet reserves its totals-band geometry before the computation lands; skeletons mirror ledger and report geometry per direction, P02 — RTL skeletons flip).

## Perceived-performance strategy

- Imports and exports are honest Jobs (P12): determinate row/format progress, cancellable, never faked-instant. Long imports show named-row progress ("استيراد الصف 9 من 14" class copy per async-contract §3); exports list per-format artifacts as they deliver (partial policy with per-format retry).
- The registry digest computes server-side (unallocated balances ride the list payload) — the home surface never runs client-side ledger arithmetic (the adapter is authoritative; the UI never guesses a balance).
- Sealed reports cache per snapshot id (immutable — free re-reads; the pin makes the cache honest by construction).
- Offline (P20): ledger reads and report views work; writes queue with per-item state; on return the surface reconciles to authoritative ledger state — a queued inflow that raced another recording surfaces as CONFLICT with both payloads, never a silent overwrite.
- Job polling only on visible surfaces (S8 badges, endowment digests).

## Asset strategy

El Messiri (400/500/600/700 ar) + Lora (400–700 en, variable subset) ≤ 140KB/direction; line-1.5 icon sprite single file; tabular-figures font-feature binding on data columns (no second family, no mono — 05); no font-display late-swap on the ledger table (data-first paint).

## Data-path rules

Ledger pages ≤ 100/cursor (07b typed pagination); beneficiaries ≤ 50/cursor; >200-row tables virtualize (P19); activity ≤ 50/cursor with endowment filter pushdown; report snapshots cached per pin; exports carry idempotency keys (no double-artifact on retry); import rows chunked at 60ms/row (07c cadence — the mock's pacing is the budget's floor).

## Measurement protocol

1. Cold load S1 + endowment detail, both directions (LCP/CLS/TBT).
2. Ledger benchmark: 1,000-entry virtualized scroll + normalized bilingual search, p95 keystroke ≤16ms, zero focus loss, both directions.
3. Allocation benchmark: W-S seed scale p95 ≤300ms; 20,000-entry synthetic scale p95 ≤800ms; every re-run byte-identical (the determinism contract is also a performance invariant — same input, same output, same cost).
4. Report benchmark: single-endowment p95 ≤500ms; 100-endowment consolidation p95 ≤1,200ms; sealed re-read ≤50ms (cache hit).
5. Seal round-trip: p95 <400ms with the pin visible in the same paint as the settle start.
6. RTL + reduced-motion variants repeat 1–5 at identical budgets.
7. 400% zoom reflow pass on S5/S6/S7 both directions (a11y-baseline §8.3).
