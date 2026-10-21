# 05 — Identity: podcast-publish-kit

SME-D/E/I pass · Ledger row 11 (design-language-map §4, BINDING): "Midyar Olive" oklch(0.60 0.11 100) | pairing P14 | density C | soft-lift elevation | duotone iconography | energetic motion | Western numerals | bilingual-ar direction | T3. LOOP-2 check: hue 100 (olive) is 70° from nearest family sibling hue (content-remix-studio coral 30) and pairing P14 is not co-used with that composite (P14 co-users: customs-tariff-lookup — hue 85 differs by 15° in hue but differs completely on radius A/flat-line/outline-geometric/minimal/bilingual-en — composite distinct); hue+pairing never coincide with any product. LOOP-6: direction proposed, pending confirmation.

## Color (OKLCh intent + hex approximations, measured contrasts)

- **Primary — "Midyar Olive"**: oklch(0.60 0.11 100) ≈ #908126 — chapter blocks, timeline fills, active states, large headings. Measured 3.6:1 on paper: UI-component and large-text duty only (AA ≥3:1), never body text. Rationale: the microphone-booth materiality of a producer's bench — a grown-up green-gold, distant from every category tool's blue/coral (01).
- **Primary deep — "Olive Ink"**: oklch(0.48 0.10 105) ≈ #666005 — primary buttons and olive-as-text (white-on-olive-ink 6.5:1 AA body; olive-ink-on-paper 5.9:1 AA body).
- **Accent — "Signal Clay"**: oklch(0.60 0.14 45) ≈ #C26030 — the playback head, "on-air" moments, suggestion drafts. 3.8:1 on paper → UI marks only; clay-as-text uses clay-deep oklch(0.48 0.12 45) ≈ #934319 (6.3:1). The one hot color is the moving playhead — the studio's recording signal; nothing else carries it.
- **Ink & paper**: studio ink oklch(0.32 0.025 110) ≈ #333425 on warm paper oklch(0.97 0.008 90) ≈ #F7F5EF (11.6:1 AAA); olive tint oklch(0.94 0.02 105) ≈ #EDECDD for raised surfaces (10.6:1).
- **Focus ring**: oklch(0.50 0.11 100) ≈ #726400, 5.4:1 on paper (2.4.13-strong).
- **Feedback**: success oklch(0.62 0.12 150) ≈ #4A9A5E, critical oklch(0.55 0.19 25) ≈ #C92F33 — icon+text duplicated, never color-only (ux-guidelines rows 36/37).
- **Dark theme (Layer 2 re-bind, token-architecture §2.10)**: canvas oklch(0.24 0.02 110) ≈ #202015, raised surfaces by lightness step oklch(0.30 0.025 110) ≈ #2E2F20 (no stronger shadows); paper-text 15.1:1; olive on canvas 4.19:1 → UI/large duty; tint text 13.8:1.

**Brand-distance check (LOOP-11, binding blocklist: "any green circle + dark UI for podcast products")**: the nearest famous neighbor is the global green-circle audio brand. Distance strategy: olive-on-warm-light-paper as the DEFAULT theme (not dark), green-gold hue 100 (not their saturated green ~150), NO circular brand mark treatment (the product mark is a duotone chapter-bracket glyph), quirk-tech mono timecodes, and a clay signal accent they do not use. The dark theme re-bind is desaturated olive-on-graphite with flat chapter rectangles — verified against the blocklist wording (green + circle + dark UI as a composite); recorded here and re-checked at implementation token-review.

## Typography (P14 — Rubik + Space Mono)

- **Arabic + Latin UI: Rubik** (one family serving both scripts — weights 400/500/700 within the family's real set; no synthetic bold — rtl-rules §3). Rounded quirk-technician voice: friendly enough for a solo creator's nightly bench, constructed enough for a production tool.
- **Latin + numerals: Space Mono** (400/700) for timecodes, timestamps, durations, counts — the typographic signature: **anything that is a time renders in mono, Western numerals, LTR-isolated inside Arabic prose** (bidi isolation per rtl-rules §2; a timecode is a direction-fragile token that must never re-order inside an RTL sentence). Headings and body remain Rubik.
- Line-height: Arabic 1.6 body (1.8 with tashkeel — 11 §E); Latin 1.5. Tracking 0 for Arabic everywhere (token-level build rejection). Numerals: Western everywhere per ledger, including inside Arabic strings (copy-voice §1.7 forbids mid-sentence mixing).
- Fallbacks per rtl-rules §3: Rubik → Noto Sans Arabic → system; Space Mono → Noto Sans Mono → system. Open licenses — no procurement (rtl-rules §6).

## Direction model

**bilingual-ar** (proposed, LOOP-6 pending confirmation): buyer geography (01: 52% KSA share of Arab-world listening; Arabic-first personas 02). Full LTR rendering as citizen (Fahad persona, 02): workspace locale switch flips chrome direction; content renders per its own direction (P23 columns per-side). Matrix in 09.

## Shape, elevation, iconography, motion

- **Radius C (soft, 12–16px)**: chapter blocks, cards, composer panels; density C (comfortable, breathing room between timeline elements — a marking surface, not a data grid).
- **Elevation: soft-lift**: raised surfaces (suggestion panel, checklist drawer, package cards) lift gently on warm paper; the transcript pane stays flatter (transcript = ground truth; work objects lift).
- **Icons: duotone**: two-tone glyphs (olive + ink) — chapter bracket, waveform ticks, clipboard-check; sparkle glyphs are banned (the assist affordance is a "compass" glyph with rationale text, never a magic wand — ai-native-patterns §1).
- **Motion: energetic** (motion-language §1): 150–250ms, standard ease; ONE controlled overshoot (≤8% travel) reserved for the **package-sealed success moment** (the publication package card pops 1.04→1.0 once, success-only — Tier 3 standard set, zero gratuitous motion elsewhere). Chapter boundary snaps are 150ms; suggestion cards settle in place (never spin in — motion-language §2). Reduced-motion: overshoot collapses to a state chip; page transitions hard cuts; streaming suggestions render in card chunks announced politely (§5).

## ui-ux-pro-max integration record (LOOP-9)

Skill runs: `search.py "podcast episode production show notes chapters" --design-system -p "PodcastPublishKit"` + variants ("audio production companion workspace"; "transcript editor timeline chapter markers bilingual") + domain searches (style, typography, ux, icons); CSV scans (ux-guidelines, ui-reasoning, styles, colors, typography, icons).

**Adopted (advisory, non-conflicting):**
- ui-reasoning row 57 "Podcast Platform": must-have **audio-player-ux** → adopted as obligation: the playback bar is fully keyboard-operable with state announcements (a11y-baseline §6; 09); anti-patterns "Poor audio player + Cluttered layout" adopted as a rejection bar in 06/09. Key effect "waveform visualizations" adopted as the timeline's amplitude texture — with text+time equivalents (never wave-only information, ux-guidelines row 37).
- ux-guidelines rows: 10/78 (skeleton loading, >300ms feedback), 81 (progress indicators), 93 (streaming), 28/41/45 (focus, keyboard nav, skip links — High), 9/99 (reduced motion), 22 (touch targets — mapped to ≥24px CSS portfolio floor), 36/37 (contrast, color-not-only), 47/50 (lazy loading, font-display swap → 10), 61 (submit feedback), 84 (truncation with expand), 73 (line length 65–75ch → transcript pane measure), 91 (bulk actions → multi-select chapters), 90 (no-results copy), 89 (autocomplete → ⌘K palette), 35 (confirmation dialogs — folded into the P04 ladder).
- Pre-delivery checklist: no emojis as icons (duotone SVG set), hover transitions 150–300ms (energetic band), visible focus, prefers-reduced-motion, responsive breakpoints (mapped to portfolio 360/768/1280+).

**Rejected (conflicts with the BINDING ledger row; ledger wins — LOOP-9):**
1. Style "Dark Mode (OLED)" + colors #1E1B4B/#312E81/#F97316/#0F0F23 (colors.csv row 29 "Podcast Platform"; styles.csv "Dark Mode (OLED)") — conflicts with Midyar Olive + soft-lift on warm paper AND collides directly with the LOOP-11 podcast blocklist (green-circle + dark UI adjacency). Resolution: light-first olive system; dark theme is a desaturated Layer 2 re-bind with the blocklist re-check above.
2. Typography **Inter/Inter** — conflicts with ledger P14 (Rubik + Space Mono). Rejected.
3. **Noto Sans Hebrew** pairing (variant search result, "bilingual RTL") — inapplicable script (Arabic, not Hebrew). Rejected.
4. Landing-page patterns ("Comparison Table Focus", "Storytelling + Feature-Rich", "Scroll-Triggered Storytelling") — marketing-site conventions, not a production workbench; the honesty principle (factual value display) is kept, the patterns are not.
5. "Exaggerated Minimalism" style + clamp(3rem…) display type (variant 2) — conflicts with density C and a data-adjacent marking surface. Rejected.
6. "Minimal glow (text-shadow)" key effect — glow conflicts with soft-lift elevation on paper. Rejected.
7. "Interactive Cursor Design" style (domain search) — its own accessibility flag reads "⚠ Not for touch/SR"; fails the portfolio floor. Rejected.

All seven conflicts + resolutions recorded here per LOOP-9; none silently dropped.
