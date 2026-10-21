# 05 — Identity: interactive-story-builder

SME-D/E/I pass · Ledger row 6 (design-language-map §4): "Hikaya Crimson" oklch(0.58 0.15 348) | P03 | radius B | layered-depth | line-1.5 | calm | AR-indic optional | bilingual-ar | T3. LOOP-2: clear — hue 348 composite unique; band neighbors waqf-endowment-registry (358, P10, stately) and loyalty-stamp-card (335, P13, D, filled-rounded) differ on pairing/radius/icon/motion. LOOP-6: direction proposed, pending owner confirmation.

## Color (OKLCh anchors; hex reference-only)

- **Primary — "Hikaya Crimson"**: oklch(0.58 0.15 348) ≈ #B84F8A (OKLCh authoritative; hex computed reference) — narrative margin-pen red with rose depth, not a signal alarm (distant from op-ed-desk's editorial red oklch(0.55 0.18 25)). Chapter accents, active step state, primary actions; never body text. Computed: 4.1:1 on paper (UI/large grade, ≥3:1); white on-accent text 4.6:1 (AA body).
- **Ink** oklch(0.26 0.03 350) ≈ #2F1E26 (plum-ink tinted toward the primary family; 14:1 on paper — the body-text pair) · **Paper** oklch(0.96 0.008 350) ≈ #F6F0F2 · raised steps oklch(0.985 0.004 350) ≈ #FCF9FA. Dark theme re-binds Layer 2 only: canvas oklch(0.22 0.02 350) ≈ #22171C with surface-lightness steps for depth, paper-text oklch(0.93 0.005 350) ≈ #EBE6E8 (14:1), crimson accent lightened to oklch(0.68 0.13 348) ≈ #D275A6 (5.7:1 on canvas).
- **Sync-state palette** (working colors; every state icon+text duplicated, never color-only — 09): in-sync oklch(0.55 0.09 150) ≈ #488055 · edited-since amber oklch(0.72 0.11 75) ≈ #CD9A50 · missing-in-locale oklch(0.60 0.10 348) ≈ #AC678B · layout-override oklch(0.55 0.10 255) ≈ #4773AB. Mark-grade anchors carry chips/badges (≥3:1 UI); any state color that must carry *text* binds its darker text-safe pair at token time: green oklch(0.45 0.09 150) ≈ #2B6339 (6.3:1), amber oklch(0.52 0.10 75) ≈ #8A5F18 (5.0:1), crimson-tint oklch(0.50 0.11 348) ≈ #90466E (5.7:1), slate oklch(0.45 0.09 255) ≈ #305686 (6.7:1).
- **Focus ring**: crimson-dark oklch(0.45 0.12 348) ≈ #833561, 7:1 change-contrast on paper, re-bound to the lightened accent family in dark theme (≥3:1 both).
- Rationale: story editors → reading-room register → crimson margin ink on warm paper → serif literary voice → calm layered surfaces. Contrast contracts declared at token definition (4.5:1 body, 3:1 UI/large) both themes.

## Typography (P03 — Noto Naskh Arabic + Newsreader)

- **Arabic: Noto Naskh Arabic** (400/500/700 — real weight set; no synthetic bold): headings 700, body ≥17px, prose 19–21px. **Latin: Newsreader** (variable; used 400/500/700) — built for long-form reading; the pairing is the genre statement: a tool that makes reading experiences should read like one.
- UI microcopy may bind a sans companion at implementation time only if Naskh at 12–13px fails legibility review (arabic-copy-studio's LOOP-9 hybrid pattern, re-justified at binding, not now).
- Line-height ≥1.6 Arabic (1.8 with tashkeel in quoted prose), 1.5 Latin; tracking 0 Arabic (token-level); step text blocks budget 65–75 chars/line (10).

## Numeral policy + bidi approach (rtl-rules §3/§2)

AR-indic **optional**: workspace toggle renders ٠–٩ in Arabic prose; storage canonical (Western) — display is formatting. Stat-bands, time-codes, credit years, data-like fields stay Western. Bidi: authoring inputs `dir="auto"`; interpolated Latin tokens (credits, URLs) carry isolate marks; QA flags unisolated mixed-direction runs (CP-3.5).

## Shape, elevation, iconography, motion

- **Radius B (6–10px)**: standard editorial controls — step cards, chapter rail, dialogs; nothing pill, nothing cut.
- **Elevation: layered-depth** — surfaces stack like pages on a desk with occlusion shadows: paper base → chapter rail sheet → step cards → floating preview inspector; dark theme expresses depth as surface-lightness steps (token-architecture §2.10).
- **Icons: line-1.5** — thin editorial glyphs, typographic ornaments; directional flips recorded in 06.
- **Motion: calm** (motion-language §1): 200–320ms, symmetric ease-in-out, no scale on hover (opacity/border only). Tier 3 standard set: step cards settle in place; one default success treatment (export-complete settle). Preview scroll behavior belongs to the story artifact, not editor chrome — the builder UI is motion-minimal. Reduced-motion: ≤2-step opacity or instant + announcement (motion-language §5).

## Brand-distance check (LOOP-11)

Nearest famous neighbors: editorial storytelling platforms' clean-template look; classic news-brand signal reds. Distance: rose-crimson 348 (not news-red 25, not platform blue), Naskh/Newsreader literary pairing, layered paper depth, line-1.5 ornaments, sync-state palette. Clear.

## ui-ux-pro-max integration record (owner-mandated; LOOP-9 discipline)

**Searches run** (skills/ui-ux-pro-max/scripts/search.py, 2026-10-16):
1. `"scrollytelling interactive storytelling newsroom" --design-system -p "HikayaStoryBuilder"` → Scroll-Triggered Storytelling pattern; Motion-Driven style; palette #2563EB/#F97316; Inter/Inter; parallax effects; pre-delivery checklist.
2. `"editorial storytelling visual narrative" --design-system -p "HikayaEditorial"` → Vibrant & Block-based style; editorial black + pink #EC4899; Newsreader/Roboto.
3. `--domain typography "editorial serif"` → Editorial Classic; News Editorial (Newsreader/Roboto); Magazine Style rows.
4. `--domain ux "storytelling scroll progress"` → Progress Indicators; Smooth Scroll; Horizontal Scroll rules.
5. `--domain ux "media video long content"` → Truncation with expand; Auto-Play Video (click-to-play); Line Length 65–75.
6. Data scans (rg, assets/data): ux-reasoning.csv "Magazine/Blog" row (anti-patterns: poor typography + slow loading); styles.csv "Storytelling-Driven" (chapter structure; "skip option available") and "Motion-Driven" (prefers-reduced-motion caution); typography.csv row 26 "Arabic Elegant" (Noto Naskh Arabic — "Arabic sites, Middle East market, bilingual sites, RTL"); colors.csv row 71 "Magazine/Blog" (editorial black + accent pink).

**Adopted** (advisory; ledger binding): chapter progress indicator in preview (03 CP-1.6; 06) — Scroll-Triggered Storytelling + Progress Indicators rows · "skip option available" → preview jump-to-chapter navigation is mandatory (09) — narrative pacing is never a trap · Newsreader for long-form reading (News Editorial row) → confirms ledger P03 Latin · Noto Naskh Arabic for RTL/bilingual MENA contexts (Arabic Elegant row) → confirms ledger P03 Arabic · line-length 65–75 chars for step text blocks → 10 · click-to-play media, no autoplay → 09 (also a11y-baseline §6) · truncate-with-expand for long credits/captions → 06 · pre-delivery checklist (contrast 4.5:1, visible focus, reduced-motion respected, no emoji-as-icons, cursor affordance) → folded into 09/10 release checks · "poor typography + slow loading" anti-pattern (Magazine/Blog row) → drives 10's font-subset and LCP budgets.

**Rejected** (conflicts with the binding ledger; LOOP-9 record): palette #2563EB blue + #F97316 orange (search 1) — conflicts with "Hikaya Crimson" hue 348; ledger wins (LOOP-2 discipline) · editorial black + pink #EC4899 (search 2; colors.csv row 71) — hue 357 adjacent but not the ledger composite (0.58/0.15/348); rejected as the color system, noted only as spirit-confirmation of an editorial accent direction · typography Inter/Inter (search 1) and Roboto body (searches 2–3) — conflict with P03 · Vibrant & Block-based style (48px+ gaps, neon contrast, 32px+ type) — conflicts with calm personality + serif literary identity · parallax 3–5 layers and 600ms reveals (Motion-Driven / Storytelling-Driven rows) — conflict with motion-language §6 and calm's 200–320ms band; rejected for editor chrome (preview scroll behavior is content-level, reduced-motion gated) · scroll-snap in the builder UI — rejected (editor chrome is a document, not a story); scroll-snap may live inside the preview artifact only.

## LOOP-9 record

SME-I proposed a scroll-linked "page-turn" flourish on chapter switch in the outline editor (storytelling-appropriate read). SME-F flagged motion carrying structural information + reduced-motion parity cost. Resolution: chapter switch = standard calm crossfade ≤240ms; the flourish was reassigned to the preview artifact's optional theme, off by default. Both positions recorded; ledger untouched.
