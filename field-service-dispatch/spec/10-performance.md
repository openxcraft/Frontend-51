# 10 — Performance: field-service-dispatch

## Route budgets (gzip JS)

S1 board shell ≤ 200KB (drawer + queue lazy +60KB) · S3 intake ≤ 120KB · S5 register ≤ 130KB · S8 exports ≤ 110KB · S10 technician shell ≤ 90KB (the mobile surface ships lean by design — a cracked-phone stairwell context, 02) · palette ≤ 30KB incremental.

## Interaction budgets

- **Board drag**: pointer-follow is direct (no physics); drop settle ≤ 80ms (press-confirm budget, motion-language §2); keyboard lane-move commits < 100ms; overlap-refusal feedback (assertive dialog) < 150ms round-trip at seed scale.
- **Board first paint**: lanes + day header ≤ 300ms perceived at seed scale (10 lanes × ≤ 12 cards); day-plan compute (tally + lanes + loads) **≤ 150ms at seed scale (≤ 500 job cards/day), ≤ 400ms at 2,000** — synchronous by design (07b); a future day beyond the budget becomes a Job rather than a spinner lie (async-contract threshold discipline, seo-brief-builder precedent).
- **Touchpoint expiry derivation at read**: ≤ 5ms per 100 touchpoints (pure clock arithmetic, 07c rule 1); queue render p95 < 200ms at 200 rows.
- **Bilingual search keystroke-to-paint ≤ 16ms** on codes/titles/customers/technicians (write-time normalization per the clm pattern — normalized forms are stored at write, search never re-normalizes at keystroke).
- **Technician mobile state actions**: optimistic-with-undo transitions render < 100ms; offline queue write < 50ms per action; reconciliation batch < 400ms on signal return.
- **The Gate Clears**: ≤ 180ms total (140ms chip flip + settle) — the crisp ceiling, success moment only.
- LCP ≤ 2.0s both directions, both shells; CLS ≤ 0.02 (lane geometry and gate-chip bounds are reserved before data arrives — skeletons mirror lane geometry per direction, P02; tally block reserves its row).

## Virtualization thresholds (P19)

Board lanes virtualize beyond 40 cards per lane (a 60-visit peak-season day); the Jobs register virtualizes beyond 200 rows; the confirmation queue virtualizes beyond 200 rows; scrolling never moves focus; row-count context announced on region entry.

## Perceived-performance strategy

- State transitions on the board are optimistic with the 5–7s undo window (P03) — reversible mutations render immediately; the adapter remains authoritative and a failed confirmation rolls back with a typed error surface. Irreversible actions (cancel, no-show, close) are never optimistic — they carry P04 level-2 confirms and render on success.
- Offline technician actions queue with per-item state and reconcile on return (P20) — the board shows last-known state with its timestamp, never a guessed live state (03 CP-2 edge; honesty over illusion).
- Jobs (sends, exports) are honest async with determinate progress (recipients / artifacts); polling only on visible surfaces; completion delivers in-context (async-contract §6).
- The non-AI fast path is a budget, not a boast: gate checks and transition validation are synchronous state-machine reads — no spinner ever appears on a synchronous read (asset-register-tracker precedent), and the mock's 80ms/recipient send pacing is the only declared cadence.

## Asset strategy

Mada (400/500/700 ar) + Instrument Sans (400–700 en) subsets ≤ 140KB/direction; outline-geometric icon sprite single file; no font-display late-swap on the board (data-first paint); tabular-figure settings preloaded for window/tally columns.

## Data-path rules

Job-card pages ≤ 100/cursor (07b typed pagination); touchpoints ≤ 100/cursor; getDayPlan is a single composite read (no client-side fan-out); day plan cached per date + invalidation on any schedule/transition event for that date; event timelines paginate inside the drawer (> 50 events); artifacts fetched by link with 7-day expiry + regeneration.

## Measurement protocol

1. Cold load S1 + S10, both directions, both shells (LCP/CLS/TBT).
2. Board benchmark: 10-lane day with 12 cards/lane — drag round-trip p95 ≤ 80ms settle, keyboard move p95 < 100ms, overlap-refusal p95 < 150ms; peak fixture 60 cards/lane at the virtualization threshold.
3. Day-plan compute: seed scale p95 ≤ 150ms; 2,000-card synthetic scale p95 ≤ 400ms.
4. Queue benchmark: 200-row render + expiry derivation p95 < 200ms; phone-outcome recording round-trip p95 < 300ms.
5. Search benchmark: bilingual keystroke p95 ≤ 16ms over 5,000 job cards + 2,000 customers (normalized-at-write).
6. Mobile benchmark: state-action optimistic render p95 < 100ms; offline write < 50ms; reconciliation < 400ms.
7. RTL + reduced-motion variants repeat 1–6 at identical budgets; 400% zoom reflow pass on S1/S4/S10 both directions (a11y-baseline §8.3).
