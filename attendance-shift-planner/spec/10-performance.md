# 10 — Performance: attendance-shift-planner

SME-I pass · The buyer's interaction model is **many small mutations against a rules engine** (place, move, stretch, assign — each re-checked) — so the budget that defines this product is the live-recheck path, and the scale constraint is the roster (46–96 workers × multi-branch teams, 02 Fahad).

## Route budgets (gzip JS)

S1 ≤ 150KB · **S3 planner ≤ 260KB** (grid + inspector + navigator; ruleset editor and publication console lazy at +70KB on first navigation) · S2/S4 ≤ 130KB · S5/S6 ≤ 120KB · S7 ≤ 110KB · S9 ≤ 90KB (the phone surface stays lean — no authoring code ships to it). Fonts: Tajawal (400/500/700) + Hanken Grotesk (400/500/600/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (skill rows 50/75 — no FOIT, no layout shift; tabular-figure settings preloaded for time strings).

## Interaction budgets (the numbers that define the product)

- **Live guardrail recheck after a grid mutation ≤ 120ms p95** (07b's returned-view contract: the mutation response carries the recomputed WeekPlanView; 07c simulates the engine at ≤ 90ms — the budget binds the implementation's rule loop over a 96-worker week). This is the CP-1.7 placement loop and the CP-3.2 gate-derived-read budget — the two surfaces where latency would break the product's promise.
- **Gate status update after any resolution/decision ≤ 120ms** — a derived read recomputed from finding state, never a refetch.
- **Keystroke-to-paint in inline time edit ≤ 16ms** (the typing path inside shift blocks).
- Roving-cell focus → highlight < 80ms; inspector jump-to-cell < 80ms, zero layout shift (cell geometry is pre-reserved for guardrail chips — a violation arriving must not reflow the lattice).
- **Violation chip arrive/dissolve 120/140ms** (05 crisp personality) — measured as animation-frame-complete, never blocking the recheck's announcement.
- LCP ≤ 2.0s on S1 and S3 cold loads, both directions; CLS ≤ 0.02 (skeletons mirror the three-region grid geometry per direction — P02; the inspector rail's width is reserved even when empty so findings arriving cause no reflow; chip slots reserved per cell).
- Week-plan boot (grid + prior-week boundary read) ≤ 600ms p95 on the 46-worker seed; ≤ 900ms p95 at the 96-worker multi-branch ceiling.

## Data-path rules (roster scale is the design constraint)

- **Roster rail virtualization at > 200 rows** (P19) — the seed's 46-worker team sits under the line, its 30 fixed-table extras exist for the scan-progress fixture, and the 96-worker ceiling stays under it; cursor pages ≤ 100 worker rows; scrolling never moves focus.
- Violation lists cursor-paginated ≤ 100; severity-sorted with stable keys (a dissolve must not re-sort the rows a screen-reader user is mid-reading).
- **Guardrail scan is a Job** (async-contract §1): determinate per-worker progress at the declared 40ms/worker cadence (07c — the 46-worker seed scans in ≈ 1.8s of visible honest progress, never faked as instant); scans are per-worker re-runnable — determinism makes re-runs safe (same state in, same findings out).
- Swap-set import: determinate per swap (40ms each); a 12-swap set lands in ≈ 0.5s with per-swap skip reasons named as they occur, not after.
- Export: determinate per format; artifact expiry declared at creation; regeneration is deterministic from plan state — regeneration costs one job, never a re-plan.
- Offline queue stores grid mutation patches with `revision` anchors; recompute runs on reconnect (determinism makes offline safe — the queued mutation re-validates identically, P20).
- **Recompute batching**: a bulk move touching N cells issues N mutation calls — the mock accepts them in order; the implementation may coalesce the visible re-render to one paint per interaction frame, but never coalesces the *findings* (each mutation's returned view is authoritative for its own state, 07b rule 8).

## Perceived-performance strategy

1. **Zero-reflow findings**: chip slots and inspector width reserved at layout time — violations arrive into pre-shaped geometry (the CLS contract above).
2. **Optimistic moves, authoritative recheck**: block drags render immediately with a 6s undo window (P03); the adapter's returned view is the confirmation — the UI re-renders findings from it, never assumes.
3. **Derived reads, never refetches**: the gate's blocker list and the inspector's counts recompute from state the screen already holds; the 120ms budgets are render budgets, not network budgets.
4. **Honest determinate progress everywhere** (scans, imports, exports) — an indeterminate bar claiming percentage is a contract violation (async-contract §3).
5. Route-level splitting keeps S3's 260KB ceiling; S9 ships no authoring code at all (the phone is a reader, 00).

## Measurement protocol

1. Cold load S1 + S3, both workspace directions (LCP/CLS/TBT; 1280px and 360px).
2. **Live-recheck benchmark**: a placement that closes the seeded boundary clopen (w-r05) — finding dissolve + announcement ≤ 120ms p95, zero layout shift; and a placement that *creates* a second-order violation — arrival + announcement ≤ 120ms p95.
3. Typing benchmark: 60-second Arabic time-field edit at keystroke-to-paint p95 ≤ 16ms.
4. Virtualization benchmark: 200+-row roster — scroll performance and focus preservation (P19) with row-state announcements.
5. Scan-at-scale benchmark: 96-worker week — staged finding delivery visible < 2s from scan start (blockers stream to the inspector as their workers compute), full result on job completion.
6. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
