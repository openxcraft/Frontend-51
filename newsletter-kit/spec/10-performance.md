# 10 — Performance: newsletter-kit

## Route budgets (gzip JS)

S1 ≤ 120KB · S2 composer ≤ 260KB (QA studio lazy +60KB — S3 is a mode of the issue view) · S4 ≤ 150KB (import review lazy +40KB) · S5 ≤ 130KB · S6 ≤ 90KB.

## Interaction budgets

- Composer keystroke-to-paint ≤16ms (typing path, both locales); block reorder commit ≤100ms.
- Subject-variant char-count recompute on every keystroke (budget + mobile-clip preview) ≤4ms — it must feel free.
- Preview render: ≤300ms per locale/direction/width switch (same content model as export — one render pipeline); 320px probe string render ≤300ms.
- QA checklist run: honest 120ms/check pacing (07c) — progress is the state, never faked instant results.
- Assist stream: CLS ≤0.02 (reserved region sized before first proposal — ai-native-patterns §2); proposals 400ms cadence; stop ≤80ms.
- LCP ≤2.0s cold load; skeletons mirror final geometry per direction (P02, RTL skeletons flip).

## Data-path rules

Subscriber pages ≤100/cursor; virtualization >200 rows (P19); jobs poll only while visible (async-contract §2 queue visibility); offline composer queue stores locale content patches with baseRevision (P20); issue payloads ship both locales in one fetch (composer is a two-column surface — no per-locale round-trip on open).

## Asset strategy

El Messiri (400/500/600/700 ar) + Lora (400/500/600/700 + italic en) subsets ≤150KB/direction, font-display swap (ui-ux-pro-max adopted guidance, 05 record); line-2 icon sprite single file; preview fonts additionally declare email-safe fallback chains at render time (C08 — a content property, not an app asset).

## Measurement protocol

1. Cold load S1/S2/S3 both directions (LCP/CLS/TBT).
2. Typing benchmark: 200-word paragraph block, both locales, p95 ≤16ms.
3. Variant-budget benchmark: 60-char AR subject continuous typing, p95 ≤4ms recompute.
4. Preview switch benchmark: locale × direction × width matrix (6 switches), p95 ≤300ms, zero layout shift outside the pane.
5. Virtualized-list benchmark: 12,400-row flagship list scroll, no focus loss, row-count announcement intact.
6. RTL + reduced-motion variants run the same budgets (a11y-baseline §8.3/§8.6).
