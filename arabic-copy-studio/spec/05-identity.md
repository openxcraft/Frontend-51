# 05 — Identity: arabic-copy-studio

SME-D + SME-E pass · Slot source: design-language-map.md ledger row 1. LOOP-2 check: no collision (P08 is flagship-exclusive; hue 268 composite unique). LOOP-6: direction proposed, pending confirmation.

## Color (OKLCh intent + hex approximations for reference)

- **Primary — "Dahriz Ink"**: oklch(0.30 0.07 268) ≈ #1E2247 (deep manuscript indigo). Carries text, chrome, and headings; chosen because the flagship buyer (Layla/Omar) works in long text sessions — a dark-ink surface reads as a writing instrument, not a dashboard, and separates the product categorically from the sans-on-white AI category.
- **Accent — "Za'faran Saffron"**: oklch(0.80 0.15 80) ≈ #F2B94B. Selection ink, active states, glossary chips, generation highlights. Saffron references Arabic manuscript illumination; used with restraint (≤5% of any screen) so the studio stays quiet.
- **Paper**: oklch(0.96 0.008 85) ≈ #F5F2EA (warm paper, not white) for light theme; ink theme inverts with oklch(0.22 0.04 268) canvas and paper text. Both themes re-bind Layer 2 only (token-architecture §2.2).
- **Feedback**: success oklch(0.62 0.12 150), critical oklch(0.55 0.19 25), focus ring saffron-dark oklch(0.55 0.12 80) — all pairs meet declared contrast contracts (4.5:1 body / 3:1 UI on both themes; saffron never carries body text, only ≥3:1 UI accents on ink).
- Rationale chain: buyer = Arabic-first craft writers → manuscript tradition → ink + illumination palette → serif identity → calm authority. No category tool occupies this position (01 §6).

## Typography (P08 — flagship-exclusive)

- **Arabic: Amiri** (Naskh, classical, book-grade). Headings 700; body 400 at ≥17px equivalent; long-form reading at 19–21px. Available weights respected (rtl-rules §3 — no synthetic bold).
- **Latin: Source Serif 4**. Same roles mirrored; optical sizes map to Arabic sizes via step tokens, not raw px parity.
- **UI microcopy exception (LOOP-9 resolution, documented)**: SME-D proposed full-serif chrome; SME-F flagged Amiri small-size legibility at 12–13px UI sizes. Resolution: dense UI microcopy (buttons, chips, labels) renders in **IBM Plex Sans Arabic** (400/500) while all reading surfaces stay serif. Both positions recorded; the resolution is a hybrid with a single rule: "text meant to be read = serif; text meant to be clicked = sans". This conflict and resolution are logged in 12-open-questions as LOOP-9 evidence.
- Line-height: Arabic body 1.7 (1.9 with tashkeel); Latin 1.55. Tracking: 0 for Arabic everywhere (rtl-rules §3 — token-level).
- Numerals: Western in counts/metadata; Arabic-Indic optional in Arabic prose (declared toggle; canonical storage unaffected).

## Direction model

**bilingual-ar** (proposed): default workspace locale Arabic with full LTR rendering as citizen (P23 columns both directions). Rationale: primary buyer geography (01/02); English-only buyers are Hussein/Layla's international clients, served by per-document locale. Verification matrix in 09.

## Shape, elevation, iconography, motion

- **Radius family A (cut, 2–4px)**: manuscripts are cut, not rounded; buttons/documents/panels share the sharp family. Pill shapes forbidden (separates from calendar/hiring family identities).
- **Elevation: layered-depth** — paper sheets over ink desk; surfaces stack with occlusion shadows; the editor canvas is the deepest sheet. No glow, no neon (distance from "AI sparkle" clichés — brand-distance check: nearest famous neighbor is generic AI-chat chrome; distance strategy = manuscript materiality, serif voice, zero sparkle glyphs).
- **Icons: line-1.5 editorial** — thin, constructed like typographic ornaments; sparkle/star glyphs are banned in this product's icon set (the AI affordance is a nib icon, not a magic wand).
- **Motion: stately** (motion-language §1): 280–480ms choreographed reveals; signature moment = **Ink Settle**: generated text settles into place like ink meeting paper (single decelerate, no overshoot; reduced-motion = paragraph-chunk fade per ai-native-patterns §5). Page transitions crossfade 280ms; panel dock 320ms emphasized.

## Brand-distance check (LOOP-11)

Nearest famous identities: note-taking apps with cream+black+serif; distance strategy: indigo-ink chroma, saffron accent system, Arabic-first typographic voice, cut radius, nib iconography. No wordmark similarity risk (name is descriptive; pronunciation "الاستوديو" — see copy register in 02).
