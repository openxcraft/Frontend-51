# 10 — Performance: brand-voice-guardian

## Route budgets (gzip JS)
- S1 check surface ≤ 140KB · S2 findings ≤ 180KB · S4 profile editor ≤ 200KB (glossary table lazy) · S6/S5 ≤ 120KB.

## Interaction budgets
- Findings triage keyboard navigation: instant (<50ms) — triage speed is the product's feel.
- Check run on 5K-word paste: ≤ 3s to findings (mock cadence 400ms running phase declared in 07c; real binding must hold the 3s target or convert to visible job per async-contract).
- LCP ≤ 2.0s · CLS ≤ 0.02 · INP ≤ 200ms. Skeletons mirror finding-card geometry.

## Asset strategy
IBM Plex Sans Arabic + IBM Plex Sans subsets (400/500/600) ≤ 140KB; icons one line-2 sprite. No font preview features — checked text renders in system fonts as authored (the tool never restyles evidence).

## Data-path rules
Findings pages ≤ 50/cursor; virtualization >200 rows (P19); bulk resolve is a job with per-item skip counts; report regeneration reads immutable records (no recomputation).

## Measurement protocol
1. Cold load S1/S2 both directions (LCP/CLS/TBT).
2. Triage benchmark: 60-finding review, keyboard-only, p95 nav <50ms.
3. Mixed-content rendering benchmark: doc-2-style text, zero layout shift on span highlights.
4. RTL + reduced-motion variants (same budgets).
