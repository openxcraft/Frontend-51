# 09 — Accessibility: shipping-rate-comparator

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5): the seeded fixtures carry them deliberately — "مكة المكرمة" (long joined compound), "المنطقة الغربية والشرقية" (zone label class), "مستشارو التدقيق والحوكمة" (house worst-case), "عُمان" (tashkeel-bearing coverage entry).

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search — alef/hamza, taa marbuta, yaa forms per rtl-rules §4); ? opens shortcut help; skip-link to main content; Tab order follows visual reading order per direction; focus ring = amber-deep ≥2px (4.53:1 on canvas — 2.4.13 change-contrast honored), 2.4.11 scroll-margin so sticky headers never cover it; all shortcuts are modified chords (no raw letters — Arabic-layout conflicts, a11y-baseline §3); every shortcut has a visible button/menu equivalent.
- **CP-1 (S3 paste-import)**: Tab walks paste field → header form → preview grid → issue list in reading order; ↑/↓ move issue rows with reason+suggestion re-announced; Enter focuses the named row's fix field in the preview; ⌘V lands in the paste field from anywhere in the dialog; Esc closes returning focus to the trigger (trap-free).
- **CP-2 (S2 card editor)**: Tabs switch zones/breaks/surcharges/dim-policy (roving tabindex); RateCardGrid follows P18 — ↑/↓ move zone rows, ←/→ move break columns (physical mapping stable in both directions, rtl-rules §4); Enter opens the focused price cell inline (P06 — Esc restores, Tab commits + advances); Z opens the zone-probe field on the zones tab; ⌘↑/⌘↓ reorder surcharge rows (2.5.7 drag alternative).
- **CP-3 (S4 workbench)**: the profile form is a standard labeled form (Tab order: destination → weight → dims → COD → declared value); C jumps to the calculator block and announces the three weights with basis ("actual 2.4, volumetric 2.625, chargeable 3.0 — volumetric basis"); R runs the comparison (focus moves to the results table's first row on completion); ↑/↓ walk quote rows; Enter/→ opens the breakdown sheet of the focused row; G jumps to the first non-quoted row (no-coverage/out-of-range — the exception tour, mirroring the parity-gap jump key in seo-brief-builder).
- **CP-4 (S4 batch mode)**: paste field → card-selector chips (Space toggles) → run; the matrix follows P18 (arrow navigation with row/column headers re-announced per cell — destination header + card header); X jumps to the next exception row; the per-row "fix" action is a visible button on the focused row.
- **CP-5 (S6/S5 export)**: P pins/unpins the focused comparison (note field focused when pinning); E exports (format radio group with visible labels); artifact link announced with its expiry window.
- **CP-6 (S1/S7/S8 lists)**: standard list navigation; / focuses search; ↑/↓ + Enter open items; jobs rows expose cancel/retry as visible buttons.

## Focus order rationale

Per surface, focus follows the arithmetic's reading order: inputs (profile/destination) → the settle (calculator) → consequences (results) → actions (export/pin). In RTL the order mirrors wholesale; the results table's columns mirror (card channel at the inline-start) while numerals stay Western and per-cell alignment stays inline-end — the scan pattern is identical in both directions.

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Import progress (job) | polite | rows parsed of total + issues count so far |
| Card activated / retired | polite | card name + status |
| The Settle (chargeable-weight recompute) | polite | "Chargeable weight 3.0 kg — volumetric basis" (the basis IS the information) |
| Comparison ready | polite | quoted count, cheapest per currency group, exception count |
| Batch progress | polite | "resolving 12 of 30 destinations" |
| Zone probe result | polite | matched zone + the coverage entry + the normalization rule when one applied |
| Validation errors (import row, gates, form fields) | assertive | field/row-linked via described association; summary focuses first error on submit |
| Conflict (concurrent card edit) | assertive | both versions kept, choice required |
| Export ready / artifact expired | polite | format + expiry window |
| Quota warning (80% exports) | polite | window count + reset date |

Decorative layout shifts, quote-row recolors, and the Settle's crossfade are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces — a11y-baseline §4).

## Per-surface WCAG 2.2 AA checklist

- **S3 ImportTableMapper**: issue rows are focusable list items with reason + suggestion as text; the "kept rows" count is visible text (partial policy visible); normalized-name chips announce the rule ("الأحساء normalized from الاحساء" class); paste is never blocked (3.3.8).
- **S2 RateCardGrid**: cell targets ≥24×24 (2.5.8); inline edit per P06 with focus return; ladder-contiguity errors reference the neighbor cell by position (described association); money cells Western numerals, inline-end aligned, fixed decimals; 360px → horizontal scroll then per-zone stacked cards (ux-guidelines Table Handling); row/col counts announced on region entry.
- **S2 ZoneCoverageEditor**: coverage chips bidi-isolated (`dir="auto"` on the add-field); probe result is text, never color-only; the remote flag is a labeled checkbox; worst-case zone labels truncate at word boundaries (no Arabic hyphenation exists — rtl-rules §4) with the full label on the chip's tooltip AND as aria-label.
- **S4 DimWeightCalculator**: three figures always rendered as text with units; the winner mark is underline + basis word (never color/size alone); the derivation line is real text in the DOM (SR reads the arithmetic); keystroke budget ≤16ms keeps the control responsive under screen-reader echo (10-performance).
- **S4/S5 ComparisonTable + QuoteBreakdownSheet**: best-rate row = amber wash + green total + "cheapest" text badge (icon+text+color); delta chips carry sign + number + arrow icon; no-coverage/out-of-range cells carry icon + text + fix action; groups are labeled sections with currency announced in headers ("SAR quotes — 3 cards"); the breakdown sheet is an ordered list semantically (rule → amount per line); focus trap + return on the sheet (a11y-baseline §3); >200 rows virtualize with focus preservation (P19).
- **S4 BatchDestinationsPaste**: per-row `dir="auto"` isolation; duplicate-count badge is text; the matrix never renders heat-only cells (numbers always present — charts.csv contract); exception rows are focusable with named actions.
- **Forms (profile, card header, pin note)**: labels persist above fields (ghost text is never the label — a11y-baseline §5); on-blur-or-submit validation with inline linked messages; required is programmatic; weights/dims inputs accept paste and never require modal math.
- **Overlays (dialogs, palette, breakdown sheet)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (zone labels, coverage lists, channel names) · pure-English render · mixed strings (Latin channel label "Pacific Freight" inside Arabic chrome; Arabic destination "جدة" inside English chrome — bidi isolation proves out) · numeral rendering under Western policy (all money, weights, counts, divisors — never mixed systems mid-sentence) · embedded Latin tokens (currency codes "SAR"/"USD") in RTL and Arabic tokens in LTR with isolating containers · tables/grids column order mirrored with inline-end numeral alignment held · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings ("المنطقة الغربية والشرقية") · 400% zoom reflow in one dimension (price grid scrolls then stacks; results table collapses to quote cards) · bidi isolation on all user-entered strings (destinations, channel labels, pin notes). Seeded fixtures (07c: الأحساء variant, عُمان tashkeel entry, New York row) are the regression set for both directions.

## Reduced-motion contract (motion-language §5)

Minimal personality already: opacity-only ≤120ms. Under prefers-reduced-motion: the Settle becomes an instant figure swap + the same polite announcement (perceivability by construction); page transitions are hard cuts; the modal scale-step collapses to fade; the batch matrix fills row-by-row without crossfade; no transition anywhere exceeds 120ms in either mode. The release matrix (a11y-baseline §8.6) runs the keyboard-only and zoom passes with reduced-motion enabled — all state changes remain perceivable as text.
