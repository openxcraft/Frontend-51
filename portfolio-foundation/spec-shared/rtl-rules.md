# RTL & Arabic Typography Rules

Status: SHARED FOUNDATION · Binding on all 50 products. Direction defaults per product are proposed in each 05-identity.md under LOOP-6 and recorded in specs/_index.md.

---

## 1. Direction Decisions

Every product declares a direction model: `ar` (Arabic-first RTL), `en` (English-first LTR), or `bilingual` (workspace-locale-driven, either direction as full citizen — never a mirrored afterthought). The decision is justified by buyer geography in 05-identity.md. Bilingual products must pass the full verification matrix in both directions; `ar` products must still render embedded Latin tokens (product names, codes) correctly.

## 2. Layout & Box Model

- **Logical properties are mandatory**: `inset-inline-start`, `margin-block-end`, `padding-inline`, `border-inline-end`. Physical `left/right` in styles is permitted only for genuinely direction-free geometry (e.g., a centered overlay) — deviation must be justified in the product spec.
- **Mirroring scope**: navigation rails, breadcrumb flow, progress indicators, carousel order, chart category axes (RTL charts run right-to-left with the value axis on the inline-end), timeline order, pagination direction, and step indicators mirror. Not mirrored: logos, media playback controls, clock faces, brand marks, code blocks (Latin code stays LTR inside RTL layout with an isolating container), phone numbers, numerals inside data columns governed by the numeral system.
- **Icon flipping**: directional glyphs (arrows, chevrons, "send", indentation, next/previous, external-link arrow) flip. Symmetric or semantically anchored glyphs (refresh, trash, magnifier, volume) never flip. If an icon's meaning depends on a real-world physical metaphor (a book spine), the metaphor's regional convention decides, and the decision is recorded in 06-component-needs.md.
- **Mixed-direction text**: user-entered or API-returned strings embedded in opposite-direction context get Unicode bidi isolation (`dir="auto"` on inputs; isolate marks around inline interpolations). Never rely on ambient paragraph direction to sort it out — mixed strings are the top source of Arabic UI corruption (trailing punctuation migration, number reordering).

## 3. Arabic Typography Constraints

- **Line height**: Arabic body text requires ≥1.6 line-height (Latin 1.5 baseline); with tashkeel (diacritics) enabled, ≥1.8 or clipping of stacked marks occurs. Headings ≥1.4.
- **Letter-spacing is forbidden for Arabic scripts** — tracking breaks the joined letterforms and ligatures. This is a token-level constraint (`type.tracking.arabic = 0`); violating it is a build rejection, not a style preference.
- **Justification**: web text uses start-alignment (flush-inline-start). Full justification on the web creates ugly rags in Arabic and kashida insertion is not browser-controlled — reserve justification for print-oriented exports only.
- **Weights**: Arabic display families often ship fewer weights (e.g., 400/700 only). Pairing catalogs in design-language-map.md declare available weights; products must not assume a 9-step weight axis exists.
- **Fallback stack**: Arabic-first context: `[product Arabic family] → Noto Naskh Arabic → system Arabic`. Latin-first context: `[product Latin family] → Noto Sans → system`. Synthetic bold/oblique on Arabic is forbidden — if a weight is missing, re-bind to an available weight token.
- **Numerals**: Each product declares Western (0-9) or Arabic-Indic (٠-٩) defaults per SME-E: data/finance/analytics surfaces default Western; editorial/heritage surfaces may default Arabic-Indic with a documented toggle. Mixed rules: Arabic-Indic within Arabic prose; Western inside code, time-codes, currency amounts where the financial system expects Western, and data tables. Numeral choice must never change parsing semantics (amounts are stored canonically; display is formatting).
- **Dates**: Gregorian ISO storage; Hijri display conversion is a presentation concern with the conversion method (e.g., Umm al-Qura for KSA contexts) declared per product. Dual-calendar per ux-patterns.md P24.

## 4. Interaction Details

- **Keyboard**: bidirectional text navigation follows the caret; arrow-key list/grid navigation keeps physical mapping stable (inline-end arrow = next item in both directions) and this mapping is documented per product's 09-accessibility.md keyboard map.
- **Carousels/pagination**: advance toward inline-end in RTL. Auto-advance is forbidden (motion + a11y).
- **Search normalization** must normalize alef variants (ا أ إ آ), taa marbouta/heh (ة ه), yaa/alif maqsura (ي ى), and strip/normalize tashkeel for matching.
- **Truncation**: Arabic words are long and hyphenation does not exist — ellipsis must break at word boundaries; min-content sizes must account for long joined words (a container safe for English can overflow in Arabic; test with worst-case strings like "مستشارو التدقيق والحوكمة").

## 5. Verification Matrix (per surface, per direction)

For each screen the product's 09-accessibility.md records pass/fail on: pure-Arabic render; pure-English render; mixed strings (user data with Latin names inside Arabic sentences); numeral rendering under the declared system; embedded Latin/numeric tokens in RTL; tables and grids (column order mirrored, alignment rules held); charts (axis direction, legend position); forms (label/input alignment, error placement on the correct inline edge); truncation behavior at 320px container; 400% zoom reflow (no horizontal scrolling in one dimension — Arabic long-word cases included); bidi isolation on user-generated content.

## 6. Font Licensing Note

The pairing catalog uses open-license families (OFL/Apache) so any implementation can bind them without procurement. Commercial substitutes require an equivalence justification recorded in the product's 05-identity.md.
