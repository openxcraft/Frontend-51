# 05 — Identity: newsletter-kit

SME-D/E/I pass · Ledger row 9 (design-language-map §4, BINDING). LOOP-2: clear — hue 58 composite unique (nearest warm neighbors differ on every other axis: content-remix-studio 30/P11/D/energetic; procurement-approval-chain 70/P16/B/stately; shipping-rate-comparator 79/P16/B/minimal); P10 co-user waqf-endowment-registry differs on every axis but pairing. LOOP-6: direction proposed, pending confirmation.

## Color (OKLCh intent + validated hex approximations)

- **Primary — "Zaytoun Marigold"**: oklch(0.72 0.14 58) ≈ #E58C40 — the working color: primary actions, active locale-tab underline, selected blocks, send progress. Carries dark text only; never body text on paper.
- **"Marigold Ink"**: oklch(0.55 0.11 58) ≈ #A15F27 — links, focus ring, legible primary marks on paper (≥4.5:1 declared; verified 4.6:1).
- **Ink text**: oklch(0.30 0.03 65) ≈ #382B1E; secondary oklch(0.38 0.05 70) ≈ #543E24.
- **Paper**: oklch(0.97 0.01 80) ≈ #F9F4EE warm cream — a reading desk, not dashboard white.
- **On-accent**: oklch(0.24 0.04 60) ≈ #2D1A00 on marigold fills (declared ≥4.5:1; verified 6.4:1).
- **QA feedback**: pass oklch(0.62 0.12 150) ≈ #4A9A5E · warn oklch(0.78 0.13 80) ≈ #E3AD4B · fail oklch(0.55 0.19 25) ≈ #C92F33 — never meaning-alone; every QA row prints its status word. Contrast contract (verified at definition, token-architecture §2.3): fail-on-paper 4.9:1 (text-safe); pass-on-paper 3.2:1 and warn-on-paper 1.9:1 serve icon/mark duty only (≥3:1 UI-component contrast for pass; warn is decorative reinforcement) — status WORDS render in ink text (12.5:1) with the colored mark beside them, both directions.
- Single-hue rationale: one working color + honest signal colors — QA results are the only saturated moments on screen, matching the checklist-is-the-gate posture. Dark theme re-binds Layer 2 only (token-architecture §2.10).

## Typography (P10 — El Messiri + Lora)

- **Arabic: El Messiri** (400/500/600/700 real weights) — humanist, warm; UI chrome 13–15px (500), headings 600, preview body 400 ≥17px.
- **Latin: Lora** (400/500/600/700 + italics) — reading text and headings; Latin UI labels 500.
- Division rule: reading surfaces = Lora 400 / El Messiri 400; clickable chrome = El Messiri 500 (ar) / Lora 500 (en). No synthetic weights (rtl-rules §3).
- **Italic policy**: Lora italic for Latin quote blocks only; **never on Arabic** — Arabic quotes render 400 with an inline-start rule (client guidance, 01 [8]; enforced by QA C07). Line-height: Arabic ≥1.6 (≥1.8 with tashkeel), Latin 1.5. Tracking 0 for Arabic everywhere.
- Fallbacks per rtl-rules §3: `[El Messiri] → Noto Naskh Arabic → system Arabic`; `[Lora] → Noto Sans → system`. Email-side email-safe chains are QA C08 territory, not identity.

## Numeral policy (SME-E)

**Western (0-9) everywhere** — ledger binding: counts, budgets, progress, dates, and inside Arabic UI copy ("3,100 مشترك", never "٣٬١٠٠"). Storage canonical; display is formatting. QA C05 flags Arabic-Indic digits in issue content with a one-click normalization suggestion — flagged, never silently rewritten (P15).

## Direction model

**bilingual-ar** (proposed, LOOP-6): buyer geography (02); composer columns render per-content direction (P23); preview per selected locale; chrome mirrors per workspace locale. Mixed-direction strings get bidi isolation on input (`dir="auto"`) and isolate marks around interpolations (rtl-rules §2); QA C02 verifies the subject line, the highest-risk string. Matrix in 09.

## Shape, elevation, iconography, motion

- **Radius C (soft, 12–16px)**: cards, blocks, checklist rows, dialogs; controls share the family (no pill mixing).
- **Elevation: soft-lift**: raised cards for working objects; preview pane flatter (the render is ground truth).
- **Icons: line-2**: functional, quiet; directional glyphs flip in RTL, symmetric never (rtl-rules §2); QA marks are icon+word pairs.
- **Motion: calm** (motion-language §1): 200–320ms, symmetric ease-in-out, opacity/border-only hovers. One animated moment: QA run completion — fail rows settle (no bounce) in a single 240ms settle; reduced-motion renders state chips instantly. No overshoot anywhere. Assist stream fills a reserved region with zero layout shift (10).

## Brand-distance check (LOOP-11)

Nearest famous neighbors: growth-platform greens/creams; "AI note app" cream+black+serif. Distance: marigold-on-cream single hue with warm-brown ink (not black), El Messiri's calligraphic-modern voice, line-2 functional icons, chroma reserved for QA results. No wordmark risk (descriptive slug).

## ui-ux-pro-max integration record (Step 1.6, LOOP-9)

Queries: "newsletter composer email editor" (--design-system, -p NewsletterKit); "bilingual newsletter publishing workspace"; domain searches (ux/typography/color); CSV scans (ux-guidelines, ui-reasoning, styles, colors, typography, icons, charts).

**Adopted:** ui-reasoning row 82 (Newsletter Platform) must-haves — sample-content → first-run sample issue with seeded QA fails (S1/03/11); "no preview" anti-pattern → always-preview-before-send. ux-guidelines rows: Focus States (28, High), Keyboard Navigation (41, High), Skip Links (45), Inline Validation on blur (56), Submit Feedback (61, High), and form-label rules (43/54 — inputs must carry real, associated labels; ghost-text-only inputs rejected) → 06/09/11. Excessive Motion (7, High: animate ≤1–2 key elements per view) → reinforces calm tier. Font Loading (50: font-display swap) → 10. Pre-delivery checklist (no emoji icons, cursor-pointer, hover 150–300ms, 4.5:1 contrast, reduced-motion, 375/768/1024/1440) → 06 acceptance notes. styles.csv Editorial-Grid mood keywords → preview-pane block styles only.

**Rejected + resolution (ledger row is BINDING):** design-system colors (trust-blue primary #0369A1, orange CTA, pale-blue background) — conflict with Zaytoun Marigold oklch(0.72 0.14 58); ledger wins (blue families belong to other rows). Typography proposals (Inter from the design-system output; Newsreader/Roboto, Cormorant/Libre Baskerville, Libre Bodoni/Public Sans from typography.csv) — conflict with P10 El Messiri + Lora; ledger wins, pairings noted as mood-adjacent only. "Exaggerated Minimalism" style + hero-form/landing-page patterns (typewriter, sticky header form, social-proof counts) — wrong surface class (marketing landing vs composer workbench) and out of scope (LOOP-10); rejected wholesale. All conflicts recorded per LOOP-9.

## LOOP-9 record (internal)

SME-I proposed a ≤60ms stagger on QA result rows (calm-tier choreography); SME-F flagged announcement-timing coupling with the completion summary. Resolution: single settle on run completion, rows render simultaneously (motion-language §6 overlap rule). Both positions recorded.
