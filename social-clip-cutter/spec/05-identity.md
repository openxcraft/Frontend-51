# 05 — Identity: social-clip-cutter

SME-D/E/I pass · Ledger row 14 (design-language-map §4, BINDING): "Qutta Neon" oklch(0.66 0.19 305) | pairing P11 | density C | layered-depth elevation | duotone iconography | energetic motion | Western numerals | bilingual-en direction | T2. LOOP-6: direction proposed, pending owner confirmation.

## LOOP-2 co-use check (honest, flagged for owner/SME-D)

P11 co-users: content-remix-studio (row 5: coral 30, C, soft-lift, duotone, energetic, bilingual-ar, T3) and inventory-count-assistant (row 23: moss 118, B, flat-line, outline-geometric, crisp, bilingual-ar, T3). social-clip-cutter coincides with content-remix-studio on FOUR axes (pairing, radius, icon, motion) — the BINDING ledger allocation accepts this, but design-language-map §1's "at most ONE axis" rule reads stricter: recorded rather than hidden, mirrored in 12 (Q-11). Differentiation that keeps the composites legibly distinct: (a) hue 275° apart — electric violet 305 vs warm coral 30; (b) elevation — layered-depth (stacked, occluded) vs soft-lift (ambient); (c) direction — bilingual-en vs bilingual-ar, flipping the chrome default and reading posture; (d) weight strategy — Changa 700/800 + Archivo 700 as the LOUD display register vs remix's utility register; (e) the mono utility face (below), absent from remix. Composite verdict: distinct at first glance; coincident only under a components-only lens. No hue+pairing collision exists with ANY product (305 is unique in the ledger).

## Color (OKLCh intent + hex approximations + measured contrasts)

- **Primary — "Qutta Neon"**: oklch(0.66 0.19 305) ≈ #AE6DEE — selection tints, active states, clip-card edges, large headings. 3.09:1 on paper → UI-component and large-text duty only (AA ≥3:1), never body text. A cutting tool for short-form video wants one unapologetic electric color; violet 305 is ledger-unique and distant from every category tool's coral/red (01).
- **Primary deep — "Neon Ink"**: oklch(0.48 0.16 305) ≈ #733EA4 — primary buttons, links, violet-as-text. 6.51:1 on paper (AA body); white-on-neon-ink 7.11:1.
- **Primary deeper — "Deep Violet"**: oklch(0.40 0.14 305) ≈ #5A2D83 — display headings. 9.00:1 on paper.
- **Accent — "Signal Amber"**: marks oklch(0.78 0.15 45) ≈ #FF9661 (playhead, boundary handles on dark; 7.73:1 on canvas); text-safe amber-deep oklch(0.52 0.15 45) ≈ #AB4400 — 5.41:1 on paper, white-on-amber-deep 5.90:1. The ONE hot UI color is the playhead and boundary handles — the objects that say "you are cutting here".
- **Ink & paper**: ink oklch(0.30 0.03 305) ≈ #312A3A on paper oklch(0.97 0.008 305) ≈ #F6F4FA (12.63:1 AAA); raised tint oklch(0.94 0.025 305) ≈ #EFE7F9 (ink-on-tint 11.47:1); selection tint oklch(0.92 0.05 305) ≈ #ECDDFF (ink-on-selection 10.74:1).
- **Focus ring**: oklch(0.52 0.17 305) ≈ #8048B6 — 5.47:1 on paper (2.4.13-strong), ≥2px.
- **Feedback**: success #4A9A5E (3.17:1 → icon/mark duty; text uses success-deep #1D6835, 6.24:1); critical #C92F33 (4.89:1 text-safe; critical-deep #AC1922, 6.60:1). Icon+text duplicated, never color-only (ux-guidelines rows 36/37).
- **Dark theme (Layer 2 re-bind, token-architecture §2.10)**: canvas oklch(0.24 0.035 305) ≈ #231B2D; raised by lightness step oklch(0.30 0.045 305) ≈ #332840 (elevation by lightness, never stronger shadows); darktext #E9E6ED (13.43:1 on canvas; 11.20:1 on raised); primary on canvas 4.91:1 (large/UI duty). The DEFAULT theme is light violet-on-paper — distance from caption-lab's ink-press dark edit-bay (the family's dark product); dark is a first-class re-bind for long night sessions, not the identity.
- **Preview stage**: always a dark well (media content) regardless of theme — a layered-depth occlusion moment: violet papers stacking around a dark stage where the clip lives; caption contrast is computed against the actual frame luminance per caption style (below).

**Brand-distance check (LOOP-11)**: nearest famous neighbors — (a) the video-streaming dark+red category brand (colors.csv row 48): distance is light violet-paper default, no red CTA, no dark chrome; (b) purple-quantum/crypto neon systems (rows 19/91): single-hue violet with an amber signal accent, no cyan/magenta interference, no glow; (c) the AI-clip category's coral/red family: 305° violet, 275° away. The product mark is a duotone bracket-glyph (a cut mark through a segment bar), not a play triangle. Clear.

## Typography (P11 — Changa + Archivo, plus a mono utility)

- **Arabic: Changa** (200–800 variable; UI 400/500, display 700/800 — real set, no synthetic bold — rtl-rules §3). Condensed-energy Arabic, loud and modern; body 16px+, line-height 1.6 (1.8 with tashkeel).
- **Latin: Archivo** (100–900 variable + widths; UI 400/500, display 700; Expanded reserved for zone labels).
- **Mono utility — IBM Plex Mono** (400/500): timecodes, offsets, durations, safe-zone percentages, checksums. NOT part of the pairing identity (P11 is the identity; this is a component-level utility), open-license (OFL), distinct from podcast-publish-kit's Space Mono signature — recorded per rtl-rules §6. Rule: **anything that is a time renders in mono, Western numerals, LTR-isolated inside Arabic prose** (bidi isolation — rtl-rules §2; a timecode is a direction-fragile token that must never re-order inside an RTL sentence).
- Tracking 0 for Arabic everywhere (token-level build rejection); numerals Western everywhere per ledger, including inside Arabic strings (copy-voice §1.7).
- Fallbacks per rtl-rules §3: Changa → Noto Naskh Arabic → system Arabic; Archivo → Noto Sans → system; IBM Plex Mono → system mono. Open licenses — no procurement.

## Direction model

**bilingual-en** (proposed, LOOP-6 pending confirmation): the buyer is a production team working in English-chrome conventions with Arabic-first CONTENT (02: Layan's English-convention agency; Nawaf's Arabic-first studio needing Arabic as a full rendering citizen). Full RTL rendering as citizen: workspace locale switch flips chrome direction; transcript segments render per-content direction (`dir="auto"` + isolated Latin runs); the burn-in preview verifies BOTH directions on every spec (09 matrix).

## Shape, elevation, iconography, motion

- **Radius C (soft, 12–16px)**: clip cards, transcript rows, composer panels; density C (comfortable) — a reading-and-cutting surface, not a data grid.
- **Elevation: layered-depth** — stacked surfaces with occlusion: transcript pane = ground paper; clip rail cards stack one layer up; highlight panel and burn-in drawers sit a third layer up with occlusion shadows at inline edges; the preview stage is the deepest well. The layer stack maps to work maturity: reading → cutting → captioning → the stage where the artifact lives. In the dark re-bind, the same stack expresses by lightness steps.
- **Icons: duotone** — two-tone glyphs (violet + ink; amber for playhead/boundary set): cut-bracket, segment bar, caption bubble, safe-zone frame, export arrow. Sparkles banned (ai-native-patterns §1 — non-AI product; the heuristic affordance is a "target/rank" glyph with rationale text, never a wand).
- **Motion: energetic** (motion-language §1): 150–250ms, standard ease; **Tier-2 signature micro-interaction — the clip-ready pop**: when a clip is created (accepted or hand-drawn), the clip card settles into the rail with ONE controlled overshoot (1.05→1.0, ≤8% travel, ≤250ms, success-only — never on errors, never on routine saves). Boundary snaps 150ms tactile; highlight cards settle in place (never spin in); the playhead rides the media clock. Reduced-motion: the pop collapses to a state chip; snaps render instantly with announcement; page transitions hard cuts (motion-language §5).

## Caption bidi & typographic policy (rtl-rules §2–3 applied to BURN-IN captions — the unique feature's rendering contract)

1. **Per-line direction**: each caption line renders per its dominant script; mixed runs are isolated with directional marks at run boundaries so a Latin token inside an Arabic line keeps its internal order (the documented breakage class — 01).
2. **No mid-word breaks**: line breaking is word-boundary-only for Arabic (joined letterforms cannot hyphenate — rtl-rules §3); the lint's `line-overflow` warning fires rather than allowing a renderer to break a joined word.
3. **Punctuation mirroring**: terminal punctuation attaches to the line's flow direction; mirrored pairs (parentheses, quotes) flip per line direction — encoded in the BurnInSpec's bidi policy, validated by lint.
4. **Tashkeel line boxes**: caption line-height reserves stacking room when tashkeel mode is on (≥1.8 — rtl-rules §3); `tashkeel-clipping-risk` fires when a style cannot host marks.
5. **Tracking 0**: caption letter-spacing is 0 for Arabic lines at the token level (`caption.tracking.ar = 0`); Latin caption lines may kern normally.
6. **Numerals in captions**: Western per ledger; a transcript/caption numeral-system mismatch is a normalization surface, not a copy error; sidecar files carry the same policy (storage canonical, display formatting — rtl-rules §3).
7. **Safe zones**: placement presets encode the platform overlay bands (TikTok-class ≈ 14% top / 35% bottom / 6% sides — 01 conventions); `safe-zone-violation` is geometric, computed against the preset's band, never eyeballed.

## ui-ux-pro-max integration record (LOOP-9)

Skill runs: `search.py "video clip editor transcript driven captions" --design-system -p "SocialClipCutter"` (mandated) + variants ("short form video clipping workspace"; "transcript highlight selection clip maker social media") + domain searches (ux "video editor timeline clip trimming"; style "dark video editing workspace"; typography "condensed bold sans display typography"; icons "video play clip icons duotone") + CSV scans (ux-guidelines, ui-reasoning, styles, colors, typography, icons).

**Adopted (advisory, non-conflicting):**
- ux-guidelines rows: 10/78 (loading states >300ms — skeleton/spinner discipline), 81 (progress indicators — per-clip determinate), 28/41/45 (focus, keyboard nav, skip links — High), 36/37 (contrast 4.5:1; color-never-alone), 22 (touch targets → portfolio ≥24×24 floor at density C), 33/44/55/61 (error feedback near the problem, announced, field-linked, submit feedback), 79/80 (empty states with an action; error recovery paths), 84 (truncation with expand — Arabic word-boundary discipline), 73 (line length 65–75ch — transcript measure), 47/50 (lazy loading; font-display swap → 10), 8 (micro-interactions 150–300ms — the energetic band exactly), 99 (prefers-reduced-motion — High), 96 (auto-play video anti-pattern — click-to-play preview; already portfolio law, a11y-baseline §6), 16 (overflow-hidden caution on the virtualized pane), 12 (continuous animation reserved for loading), 1 (smooth scroll for in-pane jumps).
- ui-reasoning row 22 (Video Streaming/OTT): anti-patterns "Static layout + Slow video player" adopted as a rejection bar (keyboard-operable, never-janky preview — 10); "continue-watching" translated to return-state job surfacing (async-contract §6 rung 3). Row 57 (Podcast Platform): "audio-player-ux" must-have adopted as the preview bar's full keyboard contract (09); "cluttered layout" as a density-C discipline.
- Pre-delivery checklist: no emojis as icons (duotone SVG set), hover transitions 150–300ms, visible focus, prefers-reduced-motion, responsive breakpoints (portfolio 360/768/1280+), light-mode contrast floor 4.5:1 (exceeded: 12.63:1).
- icons.csv Lucide media glyphs (play/video/pause) as construction templates for the duotone media set (outline geometry, re-stroked two-tone).
- typography.csv "Sports/Fitness — Barlow Condensed" row's mood keywords (energetic, condensed, action) noted as temperament validation for P11 — families themselves rejected (below).

**Rejected (conflicts with the BINDING ledger row; ledger wins — LOOP-9):**
1. Style **"Dark Mode (OLED)"** + colors #0F0F23/#1E1B4B/#E11D48/#000000 (colors.csv row 48; also returned by the mandated search) — conflicts with Qutta Neon + layered-depth on light paper; a dark-first identity would collide with caption-lab's ink-press chrome (row 4). Resolution: light violet-paper default; dark as Layer 2 re-bind. The search's "86% higher engagement with video" conversion claim was NOT adopted as evidence (uncited vendor-style claim; hard rule 10 discipline).
2. Typography **Inter/Inter** (all three design-system runs) — conflicts with ledger P11. Rejected.
3. Typography **Barlow Condensed/Barlow**, **Clash Display/Satoshi**, **Lexend Mega/Public Sans** (typography domain rows) — conflict with P11; only mood metadata kept.
4. Pattern **"Video-First Hero"** (hero video background, CTA overlays) — marketing-site conventions, not a production workbench; its "No preview" anti-pattern inverted into an obligation: the workbench ALWAYS previews the actual clip.
5. Style **"Exaggerated Minimalism"** (clamp(3rem…) display type, massive whitespace) — conflicts with density C and a reading-dense transcript surface.
6. Style **"Cyberpunk UI"** (neon glow, scanlines, glitch) — glow conflicts with occlusion-based elevation and duotone iconography; the skill's own rating flags "⚠ Limited (dark+neon)". The "neon" in Qutta Neon is chroma, not glow.
7. Style **"Vibrant & Block-based"** + colors #E11D48/#FB7185/#2563EB (variant 3; matched on "duotone, energetic") — temperament already ledger-bound; its rose/blue system conflicts with the violet composite.
8. Key effect **"Minimal glow (text-shadow)"** — emission conflicts with occlusion elevation and the contrast discipline on paper.

All eight conflicts + resolutions recorded per LOOP-9; none silently dropped.
