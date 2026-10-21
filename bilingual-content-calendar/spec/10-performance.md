# 10 — Performance: bilingual-content-calendar

## Route budgets (gzip JS)
- S1 home ≤ 180KB · S2 grid ≤ 300KB (season mode lazy chunk +60KB) · S6/S10 review ≤ 120KB · S7 export ≤ 80KB.

## Interaction budgets
- Grid pan/scroll: 60fps sustained on a 500-slot horizon (virtualized cells, P19); INP ≤ 200ms on slot interactions; LCP ≤ 2.0s; CLS ≤ 0.02 (grid reserves cell rows; skeleton cells mirror geometry — P02).
- Slot drag: pickup ≤ 100ms; keyboard move instant with announcement (09).
- Season mode reshape: ≤ 180ms crossfade + settle (motion: crisp); no reflow cascades on other rows (only affected week).

## Asset strategy
Fonts: Baloo Bhaijaan 2 (Arabic subset 500/700) + Plus Jakarta Sans (400–700) + Almarai 400 (notes) ≤ 160KB/direction; swap with metric fallbacks. Icons: one filled-rounded sprite.

## Data-path rules
Slot pages ≤ 60/cursor; range queries bounded (a horizon's slots load by range, not infinity); review summary computed on demand; jobs poll only on visible surfaces; offline queue stores slot/variant patches with baseUpdatedAt for conflict detection.

## Measurement protocol
1. Cold load S1/S2 both directions: LCP/CLS/TBT.
2. 500-slot horizon scroll benchmark: zero dropped frames >5ms p99.
3. Pattern-apply job with 2 seeded conflicts: per-slot results render without full-grid re-render.
4. RTL + reduced-motion variants of every benchmark (same budgets).
