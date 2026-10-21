# 05 — Identity: seasonal-campaign-board

SME-D/E/I pass · Ledger row 12 (design-language-map §4), BINDING: "Hilal Green" oklch(0.55 0.14 112) | pairing P05 | density D | soft-lift elevation | filled-rounded iconography | energetic motion | Western numerals | bilingual-ar | T3. LOOP-2: clear — hue 112 unique in the portfolio; nearest managed neighbor inventory-count-assistant (118, muted moss C.09/P11/B/flat-line/outline-geometric/crisp) differs on chroma strategy, pairing, radius, icon style, motion, elevation (design-language-map §5 recorded pair). LOOP-6: direction proposed, pending owner confirmation.

## Color — "Hilal Green" (festive, crescent-season green)

- **Primary — Hilal Green**: oklch(0.55 0.14 112) ≈ #757800 — a deep festive chartreuse-green (hue 112 sits yellow-green of pure green; the name keeps the crescent association, the coordinates keep the distinctness). Text usage requires the ink variants below: primary-on-surface is 4.39:1 — passes 3:1 for large text and UI components, **fails** 4.5:1 body text, so body-size primary-colored text is forbidden; primary carries buttons (white text, 4.73:1 — AA), icons, and meter fills.
- **Primary ink** (primary-toned text): oklch(0.45 0.11 112) ≈ #575A00 — 6.8:1 on surface (AA body); used for countdown numerals and status words that need the brand hue at text size.
- **Ink green** (text primary): oklch(0.32 0.05 150) ≈ #1F3A25 — 11.6:1 on surface, 12.4:1 on white.
- **Countdown urgency ladder** (color+icon+text triplicated, never color-only):
  - on-track — primary green family;
  - attention (due ≤7d with open items) — amber marker oklch(0.72 0.15 70) ≈ #DF911A (icon/marker duty only, 2.38:1 on surface) with amber-ink text oklch(0.55 0.13 65) ≈ #A45E00 (4.67:1 AA);
  - overdue — critical terracotta oklch(0.55 0.16 30) ≈ #BD4334 (4.86:1 on surface, text-safe);
  - blocked — plum oklch(0.45 0.12 330) ≈ #793974 (7.36:1, text-safe).
- **Festive gold** (moment-kind badges, Eid/celebration accents): oklch(0.80 0.13 85) ≈ #E4B750 with ink text (6.62:1) — never white-on-gold.
- **Surfaces**: page oklch(0.975 0.006 120) ≈ #F6F7F3 (warm paper-green); raised white; primary tint oklch(0.94 0.03 125) ≈ #E6EFDA for selected lanes/moment-window shading; deeper tint oklch(0.90 0.05 118) ≈ #DBE3BE; border subtle oklch(0.86 0.02 125) ≈ #CED3C5.
- Rationale: the buyer's emotional register is seasonal anticipation — festive but operational; the green is celebration-coded (Eid, Saudi National Day green) while staying an olive-leaning hue no family sibling or famous brand occupies (brand-distance below).

## Typography (P05 — Tajawal + Hanken Grotesk)

- **Arabic: Tajawal** (400/700, plus 500 where available) — clean-humanist, warm utility; reads as modern retail Arabic at 16px+ body; headings 700.
- **Latin: Hanken Grotesk** (400/500/700) — the humanist counterpart; countdown numerals use its tabular figures (10: fixed-width digits prevent tile thrash).
- Pairing rationale: planning is warm-utility work — counts, names, dates — not editorial display; Tajawal's open counters survive long Arabic item titles at D-density.
- Line-height 1.6 ar / 1.5 en; tracking 0 for Arabic (token obligation, rtl-rules §3); headings ≥1.4.

## Numeral policy (binding: Western)

Western digits (0-9) everywhere — countdowns, readiness percentages, due offsets, Hijri day numbers, Arabic prose — per design-language-map §7 ("Western" products render 0-9 everywhere). Arabic copy therefore writes "3 بنود متأخرة", never "٣ بنود" — copy-voice §1.7 (no mid-sentence numeral-system mixing) is satisfied by the single-system rule. Numerals never change parsing semantics; storage is canonical ISO (rtl-rules §3).

## Direction model

**bilingual-ar** (proposed, LOOP-6 pending owner confirmation): buyer geography is MENA retail (02); system chrome renders RTL-first in ar locale, LTR in en, both as full citizens (rtl-rules §1 — never a mirrored afterthought). User-entered campaign names and block reasons get bidi isolation (`dir="auto"`). Full verification matrix in 09.

## Shape, elevation, icon, motion

- **Radius D (pill, 20px+ / fully-round controls)**: buttons and status chips are pills; cards 20px; countdown tiles 24px superellipse-adjacent — festive, finger-friendly, distinct from every A/B/C family sibling sharing the green band.
- **Elevation: soft-lift** (diffuse ambient shadow): campaign lanes and checklist cards lift gently; the dual-calendar strip stays flat (time is the ground truth); dark-mode elevation via surface lightness steps (token-architecture §2.10).
- **Icons: filled-rounded** — friendly solid glyphs: filled crescent (moment-kind: religious), filled flag (national-day), filled tag (commerce-event), filled check (done), filled clock (attention), filled alert (overdue), filled pause (blocked). Semantics follow the familiar calendar/clock/check vocabulary (icons.csv rows 21/22/28/77/93 semantics; style overridden from outline to filled-rounded per the ledger binding — recorded under LOOP-9).
- **Motion: energetic** (motion-language §1): 150–250ms; ONE controlled overshoot (≤8% travel) reserved for the checklist item's done-settle moment — the daily success beat; countdown tiles never animate their digits (updates are crossfades at cadence, 10); moment-window shading on the calendar strip eases in 200ms; reduced-motion: overshoot collapses to a state chip; digit crossfades become instant text swaps with announcement only on threshold crossings (09).
- Tier-3 discipline: standard set, applied cleanly; zero gratuitous motion; success moments get the default treatment; nothing else moves.

## Brand-distance check (LOOP-11)

Nearest famous neighbors: a messaging-app green (bright blue-green ~hue 145 on white chat chrome) and marketplace greens (~hue 140-150 with wordmark wordmarks). Distance strategy: hue 112 is olive-chartreuse, materially yellower than any of them; deep ink-green text on warm paper (not white-on-green chat chrome); pill geometry + filled-rounded crescent/flag/tag glyph system; gold festive accent for moment kinds; no speech-bubble idioms, no wordmark lockups. Clear.

## LOOP-9 record (skill vs ledger conflicts, resolved ledger-wins)

Six conflicts from the ui-ux-pro-max skill output, each resolved in the ledger's favor and recorded here per the integration rule (see integration record below for the full audit trail): (1) pink/cyan color system rejected — Hilal Green binding; (2) Rubik/Nunito Sans retail pairing rejected — P05 binding; (3) Anton/Epilogue loud display pairing rejected — P05 binding; (4) Motion-Driven parallax-heavy style rejected — energetic personality within motion-language bounds (parallax is a named anti-pattern, motion-language §6); (5) Lucide outline icon style rejected — filled-rounded binding (semantics adopted); (6) "E-commerce success-green + urgency-orange" hex palette rejected — the urgency *ladder concept* survives with ledger-derived amber/terracotta tokens.

## ui-ux-pro-max integration record

Mandated query run: `search.py "seasonal campaign planning board retail marketing" --design-system -p "SeasonalCampaignBoard"`; variant `search.py "marketing calendar countdown checklist workspace" --design-system`; domain searches `--domain style "seasonal campaign board"`, `--domain typography "calendar board planning"`, `--domain ux "calendar countdown checklist planning board"` — the three domain queries returned 0 rows (recorded honestly); CSVs scanned directly instead (ux-guidelines, ui-reasoning, styles, colors, typography, icons).

**Adopted (with sources)**:
- Design-system output **"Soft UI Evolution"** (styles reasoning: "evolved soft UI, better contrast, subtle depth, accessibility-focused, improved shadows; ⚡ Excellent performance, ✓ WCAG AA+") — aligns with and reinforces the ledger's soft-lift + D-radius composite; adopted as elevation guidance (soft-lift shadows kept diffuse and subtle).
- **Pre-delivery checklist** (both design-system outputs): no emojis as icons (SVG glyphs — filled-rounded per ledger); hover states 150–300ms (energetic band 150–250ms fits); light-mode text contrast ≥4.5:1 (enforced at token definition, token-architecture §2.3); visible focus states; `prefers-reduced-motion` respected (09 §reduced-motion); responsive breakpoints 375/768/1024/1440 (04 breakpoints; mobile read-only posture).
- ux-guidelines.csv rows: 28 Focus States (High) → 09 focus contract; 41 Keyboard Navigation (High) → 09 keyboard map; 45 Skip Links (Medium) → rail skip link; 10/78 Loading States & Indicators (High) → skeletons per P02; 32 Loading Buttons (High) → export/create button states; 61 Submit Feedback (High) → closure/save feedback; 79 Empty States (Medium) → P01 four-empties in 11; 81 Progress Indicators (Medium) → determinate job progress (async-contract §3); 7 Excessive Motion (High) + 8 Duration Timing (Medium: 150–300ms) + 9/99 Reduced Motion (High) → motion plan above; 13 Transform Performance (Medium: transform/opacity only) → countdown digit crossfades; 29 Hover States (Medium); 47/50/75 lazy-loading & font-display (Medium) → 10 asset strategy.
- ui-reasoning.csv row 46 **Productivity Tool** (flat + micro-interactions, "must_have: keyboard-shortcuts", quick actions ~150ms, anti-patterns "complex onboarding + slow performance") → ⌘K palette (P05), quick-start flow CP-4 (4-interaction creation), onboarding value checklist (P22) — flat-design elevation suggestion overridden by ledger soft-lift (recorded as conflict 7 below); row 19 **SaaS Dashboard** decision rule `if_large_dataset: virtualize-lists` → board/checklist virtualization (P19, 10).
- icons.csv rows 21/22/28/77/93 (check, check-circle, clock, flag, calendar semantics) → adopted as the glyph vocabulary; library/framework suggestions (Lucide outline imports) overridden by the filled-rounded style binding.
- Landing-page patterns ("Storytelling + Social Proof", "Lead Magnet + Form") — not applicable to a workspace board product; their only traceable adoption is the checklist discipline above (nothing else carried over).

**Rejected (conflicts, LOOP-9 resolution ledger-wins)**:
1. Colors #EC4899/#F472B6/#06B6D4 "bold pink + creative cyan" (both design-system outputs; colors.csv rows 3/17/33 green/orange e-commerce hexes) → Hilal Green oklch(0.55 0.14 112) binding; urgency ladder derived from ledger-adjacent tokens (verified contrast, above).
2. Typography "Rubik / Nunito Sans" (retail mood) and "Anton / Epilogue" (loud Gen-Z) → P05 Tajawal + Hanken Grotesk binding; Rubik is also a portfolio pairing component (P14) — adopting it would blur family identity.
3. "Motion-Driven" style (parallax 3–5 layers, entrance anims, performance ⚠ / a11y ⚠) → energetic personality inside motion-language rules; parallax is a §6 anti-pattern; Tier-3 standard set only.
4. Lucide outline icon style → filled-rounded binding (ledger).
5. "Flat Design" elevation (ui-reasoning row 46) → soft-lift binding (ledger).
6. Dark-mode-by-default and glassmorphism suggestions (ui-reasoning rows 1/19 posture) → warm paper light surface is the identity; dark mode exists only as a Layer-2 re-bind with its own contrast declarations (token-architecture §2.10).
