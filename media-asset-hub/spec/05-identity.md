# 05 — Identity: media-asset-hub

SME-D/E/I pass · Ledger row 8 (design-language-map §4, BINDING): "Nakhl Spruce" oklch(0.55 0.09 174) | P07 | density B | soft-lift | duotone | minimal motion | Western numerals | bilingual-ar | T3. LOOP-6: direction proposed, pending owner confirmation.

## Color (OKLCh intent + hex approximations)

- **Primary — "Nakhl Spruce"**: oklch(0.55 0.09 174) ≈ #29836D — primary actions, active nav, selection, link/keyword system. A working archive wants calm authority, not creative-suite energy; muted chroma keeps long browse sessions quiet.
- **Deep spruce** oklch(0.42 0.08 174) ≈ #005B4A — hover/pressed, headline text on paper. **Tint** oklch(0.72 0.06 174) ≈ #7DB1A2 — selected-tile wash, tag-chip fills (text in deep spruce, declared 4.5:1).
- **Accent — "Dune Amber"** oklch(0.75 0.13 70) ≈ #E29E47 — strictly reserved: rights-expiry badges, extraction-confidence marks, quota warnings (≤4% of screen; never body text).
- **Surfaces**: soft-lift on cool paper oklch(0.97 0.006 170) ≈ #F1F6F4; raised cards one lightness step up. Dark theme = Layer 2 re-bind (canvas oklch(0.24 0.02 174); elevation by surface lightness — token-architecture §2.10).
- **Feedback**: success oklch(0.62 0.12 150) ≈ #4A9A5E; critical oklch(0.55 0.19 25) ≈ #C92F33; focus ring deep spruce. All pairs declare contrast at definition (4.5:1 body / 3:1 UI, both themes).
- Rationale chain: shared team archive → library materiality → spruce (worked-wood shelf tone; regional nakhl naming) → duotone catalog stamps → card-catalog stillness.

## Typography (P07 — Readex Pro + DM Sans)

- **Readex Pro** (400/500/600/700 — one family, both scripts): the bilingual-native voice; paired ar/en fields sit in optical conversation instead of two temperaments. Body 16px+; drawer labels 500; grid badges 600.
- **DM Sans** (400/500/700): Latin utility bind for dense numeric contexts (size/duration columns, manifests) — never headings; Readex Pro stays the identity face.
- Real weights respected (no synthetic bold; 600 substitutes for assumed 800). Line-height 1.6 ar / 1.5 en; tracking 0 Arabic (token-level). Fallbacks: Readex Pro → Noto Naskh Arabic → system Arabic; DM Sans → Noto Sans → system.
- **Numerals: Western (ledger-binding)**: 0–9 everywhere including Arabic strings; Arabic-Indic input parsed and stored canonically, never re-displayed as Arabic-Indic (CP-5 edge; rtl-rules §3).

## Direction model

**bilingual-ar** (proposed, LOOP-6): default workspace locale Arabic, full LTR citizen — Arabic-first by buyer geography (02), production files routinely Latin-named; grid/drawer/search render per-content direction with bidi isolation on user strings. Matrix in 09.

## Shape, elevation, iconography, motion

- **Radius B (8px)**: standard, tool-neutral — tiles, drawer, chips, buttons. A catalog, not a toy.
- **Density B**: comfortable defaults; compact = Layer 2 re-bind (token-architecture §2.9).
- **Elevation: soft-lift** — diffuse ambient shadow on drawer and raised cards; tiles lift via border+opacity only (no scale — minimal motion).
- **Icons: duotone** (spruce + tint): kind marks, tag chips, rights shield, extraction badge; the secondary tone annotates (document glyph + tinted Arabic أ mark on text-bearing assets). Directional glyphs flip per rtl-rules §2; catalog glyphs never; the أ script mark never flips (script identity, not direction cue).
- **Motion: minimal** (motion-language §1): opacity-only ≤120ms; position changes instant with crossfade; routes crossfade ≤180ms. Tier 3: zero signature choreography; success = two-step opacity settle + state chip. Reduced-motion: already ≥ contract (opacity ≤2 steps / hard cuts).
- **Brand-distance (LOOP-11)**: nearest famous neighbors = enterprise DAM blues and stock-library magentas. Distance: muted spruce (no brand-portal blue), duotone catalog-stamp icons, bilingual-native type, catalog stillness. No dark-chrome observability styling (funnel-drop-off-explorer's position).

## Collision control (LOOP-2 — green-teal band, explicit)

Band 158–182° holds four products: translation-review-hub (158 deep, P17, flat-line, crisp), field-service-dispatch (166, P15, soft-lift, crisp), **media-asset-hub (174, C.09, P07, soft-lift, minimal)**, visitor-badge-checkin (182, P06, flat-line, minimal). My composite is unique in-band: only P07 bilingual-native pairing, only duotone icons, only minimal+soft-lift combination. Outside the band, meeting-notes-action-desk shares P07/B/soft-lift/minimal but sits 101° away (275 lilac), line-1.5 icons, bilingual-en — hue+pairing never coincide simultaneously; composite distance total. Clear.

## ui-ux-pro-max integration record (LOOP-9 conflicts + resolutions)

Skill consulted per owner mandate (searches: "digital asset management library media team" --design-system; "media library search bilingual metadata"; --domain style/typography/chart; CSV scans: ux-guidelines, ui-reasoning, styles, colors, typography, icons, charts).

**Adopted (advisory → spec):** skeletons for >300ms ops; empty states with message + action (never blank); "no results" shows suggestions, not "0 results"; debounced autocomplete; step/progress indicators; alt text as obligation (→ bilingual `altText` first-class field); lazy-load heavy assets; defined z-index scale (→ 06); focus/reduced-motion/responsive 375–1440 checks (→ 09/10); no emoji-as-icon. Style advisory "Bento Box Grid" informs the tile anatomy (06), adapted to radius B (8px, not 16–24) and density B per ledger. Reasoning rows (job-board "advanced search must-have", knowledge-base "search-first") reinforce S1's search spine (04); photography-studio "poor image showcase" anti-pattern reinforces thumbnail budgets (10).

**Rejected (conflicts with BINDING ledger row 8):** skill colors (#6366F1 indigo / #22C55E CTA / #EEF2FF bg) — REJECTED, ledger binds Nakhl Spruce oklch(0.55 0.09 174); contrast-checking habit retained. Skill typography (Orbitron/Exo 2, crypto mood) — REJECTED, ledger binds P07; noted: the skill's "Tech Startup" row independently pairs DM Sans as readable body — advisory converges with the ledger's Latin choice. "Vibrant & Block-based" energy direction (neons, 48px+ gaps, 200–300ms hovers) — REJECTED for this register (minimal ≤120ms, muted chroma); its "duotone" keyword independently validates the ledger's icon axis. Video-first hero landing — REJECTED (app surface, not marketing page). Chart recommendations — DECLINED (no charts at v1, 12 Q-10). All conflicts resolved in favor of the binding ledger + shared foundations; recorded here per LOOP-9.
