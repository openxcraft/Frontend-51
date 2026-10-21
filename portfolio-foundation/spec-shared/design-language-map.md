# Design Language Map — 50 Distinct Identities, One Foundation

Status: SHARED FOUNDATION · SME-D's collision-control ledger. This file is the single source of truth for identity allocation. LOOP-2 (primary color / typography collision) and LOOP-11 (brand-confusion) are resolved against this ledger before any 05-identity.md is accepted.

---

## 1. Distinctness Philosophy

All 50 products share one token architecture (intent), one a11y baseline, one RTL rulebook. No two products may share a composite visual identity. A product's identity is the tuple: **(primary hue slot, type pairing, radius family, elevation style, icon style, motion personality)**. Two products may coincide on at most ONE axis of the tuple, and never on hue+pairing simultaneously. "A light variation of another product" is a rejected identity.

## 2. The Axes

- **Hue slot**: OKLCh hue in degrees. Primary color = (L, C, H) composite; slots are allocated in the ledger with explicit chroma/lightness strategies. Neutrals (C ≤ 0.03) are "n" slots.
- **Type pairing**: 18 fixed Arabic+Latin couples from open catalogs (below). Max 3 products per pairing, and co-users must differ in weight strategy, radius, and motion. P08 is flagship-exclusive.
- **Radius family**: A = cut (0–4px), B = standard (6–10px), C = soft (12–16px), D = pill (20px+ / fully-round controls).
- **Elevation style**: flat-line (borders only, minimal shadow), soft-lift (diffuse ambient shadow), layered-depth (stacked surfaces with occlusion), ink-press (dark chrome, no shadow, edge highlights).
- **Icon style**: line-1.5 (thin editorial), line-2 (standard), outline-geometric (constructed grids), duotone (two-tone), filled-rounded (friendly solid).
- **Motion personality**: crisp / energetic / calm / stately / minimal — definitions and per-tier expectations in motion-language.md.

## 3. Type Pairing Catalog (open licenses; ar + en)

| # | Arabic | Latin | Temperament |
|----|--------|-------|-------------|
| P01 | IBM Plex Sans Arabic | IBM Plex Sans | governance-neutral, engineering precision |
| P02 | Noto Kufi Arabic | Space Grotesk | geometric-tech, grid-made |
| P03 | Noto Naskh Arabic | Newsreader | literary, editorial serif |
| P04 | Cairo | Sora | geo-modern, confident |
| P05 | Tajawal | Hanken Grotesk | clean-humanist, warm utility |
| P06 | Almarai | Inter | utility-neutral, invisible hand |
| P07 | Readex Pro | DM Sans | bilingual-native (one family, both scripts) |
| P08 | Amiri | Source Serif 4 | manuscript-serif — FLAGSHIP-EXCLUSIVE (arabic-copy-studio) |
| P09 | Reem Kufi | Fraunces | display-duo, headline-only temperament |
| P10 | El Messiri | Lora | warm-serif, humanist tradition |
| P11 | Changa | Archivo | condensed-energy, loud |
| P12 | Harmattan | Work Sans | readable-humanist, patient |
| P13 | Baloo Bhaijaan 2 | Plus Jakarta Sans | rounded-friendly, approachable |
| P14 | Rubik | Space Mono | quirk-tech, terminal-adjacent |
| P15 | Mada | Instrument Sans | contemporary-grotesk, current |
| P16 | Scheherazade New | Libre Caslon Text | textbook-classical, formal weight |
| P17 | Noto Sans Arabic | Manrope | quiet-modern, corporate-calm |
| P18 | Lalezar | Bebas Neue | display-poster, retail signage |

Arabic weight reality (rtl-rules.md §3): most Arabic families ship 400/700 (+ some 300/500/600/800). Product specs must design within each family's real weight set; substitute pairings are re-justified, not assumed.

Pairing reuse cap: max 4 products per pairing (amended 2026-10-17 from ≤3 at ledger ratification — P04, P05 and P06 each carry 4 co-users with fully distinct composites; amendment recorded in worklog B4-CLOSE). Co-users must still differ in weight strategy, radius, and motion. P08 is flagship-exclusive.

## 4. The 50-Product Identity Ledger

Format: slug | primary (OKLCh intent) | pairing | radius | elevation | icon | motion | numerals | direction (proposed, LOOP-6) | tier. All direction defaults are proposals pending owner confirmation.

### content_tools
1. arabic-copy-studio | "Dahriz Ink" oklch(0.30 0.07 268) + saffron accent oklch(0.80 0.15 80) | P08 | A | layered-depth | line-1.5 | stately | AR-indic optional in prose | bilingual-ar | T1
2. bilingual-content-calendar | "Taba Spring" oklch(0.62 0.13 148) | P13 | D | soft-lift | filled-rounded | crisp | Western | bilingual-ar | T2
3. brand-voice-guardian | "Hakam Plum" oklch(0.42 0.10 325) | P01 | B | flat-line | line-2 | minimal | Western | bilingual-en | T3
4. caption-lab | "Sinema Cyan" oklch(0.72 0.11 210) on ink-press chrome oklch(0.19 0.02 240) | P02 | A | ink-press | outline-geometric | crisp | Western | bilingual-ar | T2
5. content-remix-studio | "Mawjawd Coral" oklch(0.68 0.17 30) | P11 | C | soft-lift | duotone | energetic | Western | bilingual-ar | T3
6. interactive-story-builder | "Hikaya Crimson" oklch(0.58 0.15 348) | P03 | B | layered-depth | line-1.5 | calm | AR-indic optional | bilingual-ar | T3
7. khatt-type-playground | "Qalam Graphite" oklch(0.35 0.02 90)n + brass accent oklch(0.74 0.12 75) | P09 | A | flat-line | line-1.5 | minimal | AR-indic | bilingual-ar | T3
8. media-asset-hub | "Nakhl Spruce" oklch(0.55 0.09 174) | P07 | B | soft-lift | duotone | minimal | Western | bilingual-ar | T3
9. newsletter-kit | "Zaytoun Marigold" oklch(0.72 0.14 58) | P10 | C | soft-lift | line-2 | calm | Western | bilingual-ar | T3
10. op-ed-desk | "Sahafa Newsprint" paper oklch(0.94 0.01 250)n / ink oklch(0.25 0.02 250)n + editorial red accent oklch(0.55 0.18 25) | P03 | A | flat-line | line-1.5 | minimal | AR-indic optional | bilingual-ar | T3
11. podcast-publish-kit | "Midyar Olive" oklch(0.60 0.11 100) | P14 | C | soft-lift | duotone | energetic | Western | bilingual-ar | T3
12. seasonal-campaign-board | "Hilal Green" oklch(0.55 0.14 112) | P05 | D | soft-lift | filled-rounded | energetic | Western | bilingual-ar | T3
13. seo-brief-builder | "Marsad Violet" oklch(0.55 0.12 285) | P15 | B | flat-line | outline-geometric | crisp | Western | bilingual-en | T3
14. social-clip-cutter | "Qutta Neon" oklch(0.66 0.19 305) | P11 | C | layered-depth | duotone | energetic | Western | bilingual-en | T2
15. translation-review-hub | "Jisr Teal" oklch(0.40 0.08 158) | P17 | B | flat-line | line-2 | crisp | Western | bilingual-ar | T2

### business_ops
16. attendance-shift-planner | "Wijdan Indigo" oklch(0.50 0.11 220) | P05 | B | soft-lift | line-2 | crisp | Western | bilingual-ar | T2
17. asset-register-tracker | "Sijill Steel" oklch(0.52 0.08 192) | P06 | B | flat-line | line-2 | minimal | Western | bilingual-en | T3
18. contract-lifecycle-manager | "Ahd Slate" oklch(0.38 0.08 255) | P01 | B | layered-depth | line-1.5 | stately | Western | bilingual-en | T3
19. expense-claim-flow | "Masruf Vermilion" oklch(0.60 0.15 20) | P06 | C | soft-lift | duotone | energetic | Western | bilingual-en | T2
20. field-service-dispatch | "Mawqi Teal" oklch(0.48 0.10 166) | P15 | B | soft-lift | outline-geometric | crisp | Western | bilingual-ar | T3
21. helpdesk-triage-desk | "Nazim Cobalt" oklch(0.62 0.13 240) | P02 | B | flat-line | line-2 | crisp | Western | bilingual-en | T2
22. hiring-pipeline-desk | "Tawthif Coral" oklch(0.63 0.16 8) | P13 | D | soft-lift | filled-rounded | energetic | Western | bilingual-en | T2
23. inventory-count-assistant | "Jarda Moss" oklch(0.50 0.09 118) | P11 | B | flat-line | outline-geometric | crisp | Western | bilingual-ar | T3
24. meeting-notes-action-desk | "Maqam Lilac" oklch(0.62 0.09 275) | P07 | B | soft-lift | line-1.5 | minimal | Western | bilingual-en | T3
25. okr-cascade-board | "Waraq Lime" oklch(0.68 0.12 96) | P15 | D | soft-lift | duotone | energetic | Western | bilingual-en | T3
26. policy-acknowledgment-portal | "Ittibaq Denim" oklch(0.45 0.09 232) | P01 | B | flat-line | line-2 | minimal | Western | bilingual-en | T3
27. procurement-approval-chain | "Tafwid Honey" oklch(0.66 0.11 70) | P16 | B | layered-depth | line-1.5 | stately | Western | bilingual-en | T3
28. shift-swap-marketplace | "Nahas Copper" oklch(0.58 0.13 45) | P04 | C | soft-lift | duotone | energetic | Western | bilingual-ar | T1
29. visitor-badge-checkin | "Barid Sky" oklch(0.60 0.10 182) | P06 | B | flat-line | line-2 | minimal | Western | bilingual-ar | T3

### commerce_integrations
30. abandoned-cart-recovery | "Istijad Rosewood" oklch(0.52 0.12 312) | P05 | B | soft-lift | duotone | energetic | Western | bilingual-en | T2
31. cod-order-confirmation | "Task Courier Carbon" chrome oklch(0.24 0.015 260)n + signal-orange accent oklch(0.75 0.15 38) | P04 | A | ink-press | outline-geometric | crisp | Western | bilingual-ar | T1
32. invoice-generator-desk | "Hisab Slate-Blue" oklch(0.48 0.09 246) | P06 | B | flat-line | line-2 | minimal | Western | bilingual-en | T3
33. loyalty-stamp-card | "Wafa Rose" oklch(0.64 0.13 335) | P13 | D | soft-lift | filled-rounded | calm | Western | bilingual-ar | T3
34. marketplace-listing-sync | "Sarraf Violet" oklch(0.55 0.14 294) | P04 | B | flat-line | outline-geometric | crisp | Western | bilingual-en | T2
35. price-rule-engine | "Sarwa Cyan" oklch(0.60 0.11 200) | P02 | A | flat-line | line-2 | crisp | Western | bilingual-en | T2
36. shipping-rate-comparator | "Tariq Amber" oklch(0.70 0.13 79) | P16 | B | soft-lift | line-1.5 | minimal | Western | bilingual-en | T3

### specialized
37. clinic-appointment-desk | "Sihha Leaf" oklch(0.58 0.11 136) | P15 | C | soft-lift | filled-rounded | calm | Western | bilingual-ar | T3
38. customs-tariff-lookup | "Jumruk Bronze" oklch(0.50 0.10 85) | P14 | A | flat-line | outline-geometric | minimal | Western | bilingual-en | T3
39. halal-certification-tracker | "Itqan Forest" oklch(0.36 0.07 144) | P03 | B | layered-depth | line-1.5 | stately | Western | bilingual-ar | T3
40. kyc-onboarding-flow | "Madar Navy" oklch(0.32 0.09 234) | P07 | B | layered-depth | line-2 | stately | Western | bilingual-ar | T1
41. legal-case-tracker | "Qada Indigo" oklch(0.40 0.09 261) | P16 | B | layered-depth | line-1.5 | stately | Western | bilingual-ar | T2
42. patient-intake-forms | "Rahma Sage" oklch(0.66 0.08 152) | P12 | C | soft-lift | line-2 | calm | Western | bilingual-ar | T2
43. waqf-endowment-registry | "Waqf Garnet" oklch(0.42 0.10 358) | P10 | B | layered-depth | line-1.5 | stately | AR-indic optional | bilingual-ar | T3
44. zakat-calculation-suite | "Zakat Jade" oklch(0.44 0.08 128) | P09 | B | layered-depth | line-1.5 | stately | AR-indic | bilingual-ar | T3

### analytics
45. ad-spend-consolidator | "Sarf Blue" oklch(0.56 0.11 262) | P04 | B | soft-lift | duotone | crisp | Western | bilingual-en | T2
46. funnel-drop-off-explorer | "Kashf Abyss" canvas oklch(0.22 0.05 212) + chartreuse accent oklch(0.82 0.16 105) | P14 | A | ink-press | line-2 | crisp | Western | bilingual-en | T1
47. kpi-alert-watch | "Tanbih Magenta-Plum" oklch(0.60 0.15 331) | P12 | B | soft-lift | duotone | energetic | Western | bilingual-en | T3
48. sales-cohort-view | "Ujra Marine" oklch(0.62 0.08 257) | P17 | B | flat-line | outline-geometric | crisp | Western | bilingual-en | T3
49. store-performance-scorecard | "Tajir Citron" oklch(0.74 0.11 76) | P18 | B | soft-lift | duotone | energetic | Western | bilingual-en | T3
50. survey-insight-miner | "Mashour Lavender" oklch(0.70 0.06 300) | P17 | C | soft-lift | line-2 | calm | Western | bilingual-ar | T2

## 5. Managed Proximity Pairs (documented, approved)

Dense hue bands exist by design (the blue and green bands carry 15 products). These pairs sit closer than 10° in hue but are held distinct by composite differences — each pair is justified here and re-checked at every 05-identity.md review:

- **bilingual-content-calendar (148, bright C.13, P13, D, crisp) ↔ halal-certification-tracker (144, deep C.07, P03, B, stately)**: different family, lightness, chroma, type, radius, motion.
- **seasonal-campaign-board (112, festive bright) ↔ inventory-count-assistant (118, muted moss)**: different chroma strategy, pairing, radius, icon style.
- **patient-intake-forms (152 sage, light, P12) ↔ translation-review-hub (158 teal, deep, P17)**: lightness + pairing + radius + motion all differ.
- **price-rule-engine (200) ↔ asset-register-tracker (192) ↔ caption-lab (210 bright-on-dark)**: cyan band split by lightness strategy, elevation (ink-press vs flat), and pairing.
- **kyc-onboarding-flow (234 navy, T1, P07) ↔ helpdesk-triage-desk (240 cobalt, bright, P02)**: flagship deep navy vs utility bright cobalt.
- **legal-case-tracker (261) ↔ ad-spend-consolidator (262) ↔ sales-cohort-view (257)**: same band, three distinct lightness/pairing/motion composites (stately P16 deep / crisp P04 mid / crisp P17 light).
- **hiring-pipeline-desk (8) ↔ expense-claim-flow (20) ↔ content-remix-studio (30)**: warm band split by chroma, pairing (P13/P06/P11), radius (D/C/C).
- **funnel-drop-off-explorer (212 dark canvas + chartreuse 105) ↔ okr-cascade-board (96 lime, light)**: accent-vs-primary roles differ; canvases are opposite lightness.

## 6. Reuse Limits & Collision Protocol

- Pairing reuse ≤ 4 (amended 2026-10-17 from ≤3; current max: 4, on P04/P05/P06, all with distinct weight/radius/motion composites). Hue exact-match reuse: forbidden. Neutral-slot (n) primaries are exempt from hue uniqueness but must differ in temperature and accent strategy.
- **LOOP-2 procedure**: later product is reassigned by SME-D within its family band; rationale recorded in BOTH 05-identity.md files and here.
- **LOOP-11 blocklist** (identity must not read as an existing brand): payments-blue + wordmark-style for kyc-onboarding-flow; chartreuse-on-observability-dark for funnel-drop-off-explorer; yellow+red courier combos for cod-order-confirmation (hence carbon + signal-orange); any green circle + dark UI for podcast products; cream + black + serif for generic "AI note apps". Each 05-identity.md carries a "brand-distance check" paragraph naming the nearest famous neighbor and the distance strategy.

## 7. Numerals & Direction Conventions

Numerals: "Western" products render 0-9 everywhere. "AR-indic optional" products offer ٠-٩ in Arabic prose contexts only (storage is canonical; display is formatting — rtl-rules.md §3). Direction proposals above are buyer-geography-driven (LOOP-6); all are pending owner confirmation and are restated in specs/_index.md.
