# 10 — Performance: content-remix-studio

## Route budgets (gzip JS)
- S1/S2 ≤ 150KB · S3 workbench ≤ 260KB (recipe editor lazy +70KB) · S5/S6 ≤ 110KB.

## Interaction budgets
- Receipt link hover/focus highlight: <80ms; block edit keystroke-to-paint ≤16ms (typing path); LCP ≤ 2.0s; CLS ≤ 0.02 (stack layout reserved; skeleton mirrors workbench geometry).
- Recipe run: honest job progress (per-block determinate) — no fake instant generation.
- Overshoot micro-interaction: ≤250ms total, success moment only (05).

## Asset strategy
Changa (400/700 ar) + Archivo (400–700 en) subsets ≤ 150KB/direction; duotone icon sprite single file.

## Data-path rules
Derivative pages ≤ 50/cursor; library virtualization >200 rows; run jobs poll only when visible (queue surfaces); offline queue stores derivative block patches with baseRevision.

## Measurement protocol
1. Cold load S1/S3 both directions (LCP/CLS/TBT).
2. Receipt-link benchmark: 12-link receipt traversal, p95 <80ms highlight, zero layout shift.
3. Typing benchmark in block edit (200-word block, p95 ≤16ms).
4. RTL + reduced-motion variants (same budgets).
