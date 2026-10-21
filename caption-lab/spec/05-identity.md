# 05 — Identity: caption-lab

SME-D/E pass · Ledger row 4. LOOP-2: clear (cyan-on-dark chrome unique — managed-neighbor notes in ledger §5). LOOP-6: direction proposed.

## Color
- **Primary — "Sinema Cyan"**: oklch(0.72 0.11 210) ≈ #62B8D6 as the working accent on **"Sinema Chrome"** dark canvas oklch(0.19 0.02 240) ≈ #171A22 — the post-production room: dark chrome keeps color-accurate preview judgment possible (a caption tool sits next to video; light rooms fight preview monitors).
- **Accent — "Timecode Amber"**: oklch(0.78 0.12 85) ≈ #E4C25A for timecodes, active cue, duration marks — the color of film countdown leader.
- **Signals**: reading-speed over-gate oklch(0.62 0.16 25), proposed-cue dashed amber, conflict plum — all icon+text duplicated (09); all pairs meet contracts on dark canvas (4.5:1 body / 3:1 UI).
- **Light theme exists** (Layer 2 re-bind, admin/classroom contexts) with the same pairs re-declared.
- Rationale: buyer lives in edit-bay culture (02 Mariam/Huda) — dark chrome is native; cyan+amber reads as timing instrumentation, not decoration.

## Typography (P02 — Noto Kufi Arabic + Space Grotesk)
- **Arabic: Noto Kufi Arabic** (400/500/700) — geometric clarity at small caption sizes; constructed strokes survive stroke-outline burn-ins better than Naskh curves at 24–32px video-relative sizes. UI + caption text in the app.
- **Latin: Space Grotesk** (400/500/700) — technical grotesque matching the Kufi geometry; **timecodes and numerals render in a mono companion (Space Mono)** — timecode is data, not prose.
- Burn-in fonts (in STYLE PRESETS, not the UI): an Arabic-safe caption font list is part of the product's domain data (weights/sizes/stroke matrices per family) — the spec sheet's core content.
- Line-height 1.6 ar / 1.5 en; tracking 0 Arabic; numerals: Western in timecodes ALWAYS (data columns — rtl-rules §3); Arabic-Indic optional inside caption TEXT per project policy.

## Direction model
**bilingual-ar** (proposed): chrome follows workspace locale; cue text renders in ITS direction per cue (bidi isolation); timecodes always LTR-embedded (data). Matrix in 09.

## Shape, elevation, icon, motion
- **Radius A (2px)**: instrumentation aesthetic — panels, chips, cue rows. Cut shapes read as measurement tools.
- **Elevation: ink-press** on dark chrome: edge highlights instead of shadows (2px inline-start borders mark active rows); no soft shadows in a preview room.
- **Icons: outline-geometric**: constructed grid glyphs (playback marks do NOT mirror — rtl-rules §2 media convention).
- **Motion: crisp** (100–180ms ease-out, zero overshoot — frame-accurate feel): cue-row activation instant + 120ms focus ring; scrubber feedback immediate; preview style changes crossfade 160ms. Signature micro-interaction (T2): **reading-speed settle** — when a cue drops under the gate after an edit, the meter needle settles with a single 140ms decelerate + polite announcement ("١٧ كلمة/دقيقة — تحت البوابة"). Reduced-motion: meter swaps to text state instantly.
- Brand-distance (LOOP-11): nearest neighbor = video editors' dark chrome; distance: instrumentation cyan/amber, caption-first IA, no timeline-editing chrome. Clear.

## LOOP-9 record
SME-D proposed Space Grotesk for timecodes (pairing purity); SME-F flagged timecode digit-flapping during nudging as a legibility hazard. Resolution: timecodes in Space Mono (mono companion within the P14-adjacent family set — declared as the pairing's data companion in the ledger spirit). Both positions recorded; rule: "prose = pairing; timecode = mono".
