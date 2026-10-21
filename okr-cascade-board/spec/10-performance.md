# 10 — Performance: okr-cascade-board

## Route budgets (gzip JS)

S1 cycles home ≤ 150KB · cycle workspace shell (S2 board + S3 detail shell) ≤ 210KB (S5 cadence dashboard + S6 grading console lazy +50KB) · S4 check-in desk ≤ 110KB (the participant path is the lightest route — it must be fast on mid-range phones) · S7/S8 ≤ 110KB · S10 palette ≤ 30KB incremental.

## Interaction budgets

- Board render: first company tier paint <1.2s, full cascade <2.0s at 60 objectives / 180 KRs cold; warm re-entry <800ms; objective card focus highlight <80ms.
- Rollup recompute after a check-in submit: ≤50ms p95 (the Settle waits for arithmetic, never the reverse — the number must be right before it pops).
- Coverage grid: initial render ≤300ms at 200 KRs × 13 periods (2,600 cells — virtualized from >200 cells per P19); zone recompute on period close ≤150ms.
- Lint evaluation: ≤16ms per keystroke at debounce 300ms (the pair editor stays typable; findings close in place, never block typing).
- Check-in submit round-trip <400ms perceived (mock <50ms; the budget covers the real adapter contract); correction recompute ≤50ms.
- Grading computation: ≤300ms at seed scale (≤180 KRs), ≤800ms at 1,000 KRs — synchronous by design (07b); if a future cycle exceeds the budget, grading becomes a Job (async-contract threshold) rather than a spinner lie.
- Cadence re-derivation (periods + migration mapping): ≤150ms at seed scale.
- Autosave: 800ms debounce, save round-trip <400ms perceived (P10 calm cycle); conflict surfacing <250ms.
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (the assist panel's streaming region is size-reserved before arrival; KR bar and ring geometry reserved at skeleton time — progress values change, containers never jump; skeleton mirrors board tier/lane geometry per direction, P02).

## Perceived-performance strategy

- Draft runs and exports are honest Jobs (P12): determinate chunk progress ("drafting chunk 4 of 6"), cancellable, never faked-instant; the assist panel keeps the composer interactive while streaming (reserved region — no layout shift, no blocked input).
- The Settle is choreography on top of committed arithmetic (≤50ms recompute, 250ms motion): the moment reads instant because it is.
- Return-state surfacing: on app re-entry, the check-in desk badge and the cycle's cadence state render from cached summaries before the full board loads (async-contract §6 ladder 3 — never orphaned in a notification center).
- Offline (P20): reads work; check-in submits queue with per-item state and reconcile to authoritative check-in state on return (async-contract §5); queued items are individually cancellable before the flush.
- Board virtualization: lanes virtualize >60 objective cards (P19); scrolling never moves focus; row-count context on region entry for SR users.

## Asset strategy

Mada (400/500/700 ar) + Instrument Sans (400–700 en) subsets ≤ 140KB/direction; the duotone icon sprite is a single file with per-state two-tone pairs baked (no runtime recolor jank); no font-display late-swap on the coverage grid or board (data-first paint).

## Data-path rules

Objective pages ≤ 100/cursor; KR pages ≤ 100/cursor; check-in pages ≤ 100/cursor (07b typed pagination, cursors opaque); grade sheets and derived states cached per immutable snapshot id (grade sheets are free re-reads — they pin their inputs); job polling only on visible surfaces (S7 / desk badge); check-in submits and cadence changes carry idempotency/confirmation semantics per 07b rules 7/9 (double-submits never double-record).

## Measurement protocol

1. Cold load S1 + cycle workspace, both directions, LCP/CLS/TBT.
2. Board benchmark: 60-objective cascade render + lane scroll at 1280px and 360px (read mode), p95 <2.0s; card focus <80ms.
3. Settle benchmark: submit → recompute → visible number change, p95 ≤50ms compute + ≤250ms presentation; announcement coincides with the visible change (a11y pairing verified, not just timed).
4. Lint benchmark: worst-case seeded statement pairs, keystroke p95 ≤16ms at 300ms debounce; findings count announcement within one debounce cycle.
5. Coverage grid benchmark: 2,600-cell virtualized render p95 ≤300ms; zone recompute ≤150ms.
6. Grading benchmark: seed-scale p95 ≤300ms; 1,000-KR synthetic p95 ≤800ms; bit-identical recompute assertion (07c).
7. RTL + reduced-motion variants repeat 1–6 at identical budgets.
8. 400% zoom reflow pass on S2/S4/S5 both directions (a11y-baseline §8.3).
