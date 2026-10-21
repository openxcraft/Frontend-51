# 09 — Accessibility: visitor-badge-checkin

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-ar model, Arabic-first default) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: "مستشارو التدقيق والحوكمة" class and the seeded عبدالعزيز بن سليمان الرشد long-name fixture) for truncation/reflow.

## Keyboard map (critical paths)

- **Global (desk)**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search); ? shortcut help; skip-link to main; Tab follows visual reading order per direction; focus ring = Barid Sky ≥2px, 3.45:1 change-contrast on canvas, 2.4.11 scroll-margin under the sticky rail; all shortcuts are modified chords (no raw letters — Arabic-layout conflicts, a11y-baseline §3); every shortcut has a visible button equivalent.
- **Global (kiosk)**: the kiosk is touch-first but fully keyboard-operable for receptionist-assisted check-in: Tab advances step fields → primary action → secondary (back); Enter submits the focused step; Esc = back one step (never a trap); the language toggle is the FIRST focusable element on the welcome screen (a standing visitor's most common need); idle-timeout resets announce politely before clearing typed data (data is preserved in the local queue, never silently destroyed).
- **CP-1 (S9 kiosk)**: code pad is one field with code-grouped tabular display (LTR-pinned — rtl-rules §2); scan and type are both reachable by keyboard (scan = button, not camera-only); HostPickerField arrow-navigates results with count announced; ReturningVisitorConfirm candidates are radios requiring explicit Space (never auto-applied); check-in commit announces assertively only on failure, politely on success (the Arrival Settle's announcement, 05).
- **CP-2 (S3 composer)**: standard form order — visitor name (`dir="auto"`) → company → phone (optional, reason text) → type → purpose → host → window; on-blur-or-submit validation with field-linked messages; error summary focuses the first error; ⌘Enter submits from any field; Esc restores the last saved state of the field being edited (P06 discipline).
- **CP-3 (S1 board / S4 detail)**: board zones are labeled regions; visit rows focusable with named actions (B badge, N notify-again, O check-out); timeline is a list read newest-first with a direction toggle; the correction chain renders as linked focusable entries with a focus-follows-chain action; noShow zone rows carry the amber-deep text treatment (never amber text).
- **CP-4 (S5 log)**: P18 grid — ↑/↓ rows, ←/→ columns with physical mapping stable in both directions (rtl-rules §4); >200 rows virtualize with focus preservation (P19); in-building list toggle is a real switch announcing the count; export actions open the format dialog (focus trap + return).
- **CP-5 (S6 studio)**: spec fields are checkboxes/radios with persistent labels; validation issues list is focusable and each issue links to its field (focus moves, does not jump-scroll under sticky headers); preview direction toggle re-renders the semantic description list and announces the direction change politely; save conflicts surface both versions inline (P10).

## Focus order rationale

Kiosk: language → the step's input → primary action → secondary escape — the standing visitor's order of need. Desk: rail → content region → inline-end actions. In RTL everything mirrors except the code pad and phone fields (Latin-script tokens pinned LTR inside RTL layout with isolating containers — rtl-rules §2). The board's three zones read expected → in-building → no-show in document order in BOTH directions (the queue's semantic order is direction-free).

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Kiosk step entry | polite | "الخطوة 2 من 3 — اسم الشركة" / "Step 2 of 3 — company" |
| Returning-visitor candidates | polite | "we may have met you — 1 candidate, confirm or continue" (never auto-applied) |
| Check-in committed (success) | polite | visitor name + "host notified" + channel state (the Arrival Settle's text equivalent) |
| Host notification delivered/undelivered | polite | delivered: host name + channel class; undelivered: "recorded — the desk board shows the arrival" |
| Badge ready / issued | polite | badge id-less: "بطاقتك جاهزة" / "your badge is ready" + via (print/screen) |
| Validation errors (all surfaces) | assertive | field-linked via described association; kiosk errors also visible inline at arm's-length size |
| Void/correction committed | polite | "badge voided — replacement issued" (the chain's receipt) |
| Check-out committed | polite | visit closed + in-building count delta |
| Export ready / artifact expired | polite | format + expiry window |
| Autosave cycle (composer, studio) | polite | saving → saved (fade) |

Decorative layout shifts, board duration ticks, and the idle welcome loop are NEVER announced; every announcement pairs with a visible surface (a11y-baseline §4). The kiosk's idle reset announces politely BEFORE clearing ("العودة إلى شاشة الترحيب خلال 10 ثوانٍ — بياناتك محفوظة").

## Per-surface WCAG 2.2 AA checklist

- **S9 kiosk**: targets ≥56px primary / ≥44px secondary with ≥12px gaps (2.5.8 floor exceeded by design); labels persist above fields (ghost text never the label — a11y-baseline §5); privacy notice at the phone field in both languages; contrast: Barid Deep on paper 7.08:1 for all body text, Barid Sky only at display sizes (≥3:1 large-text contract, 05); the name confirmation renders Almarai 800 at ≥40px — the visitor verifies THEIR OWN name (the one field where misreading is a record error).
- **S1/S4 board + detail**: state chips are icon+shape+text (never color alone); no-show uses amber-deep text 5.13:1 (amber 2.49:1 is icon/ink duty only); timeline rows ≥24px targets; duration text updates without animation (minimal motion).
- **S5 log**: numerals Western right-aligned mirrored to inline-end per direction; mixed-script visitor names bidi-isolated (`dir="auto"` cells + isolate marks); archived-range queries route to the archive export link, never a fake empty; 400% reflow — table collapses to cards at 360px (ux-guidelines row 71 class).
- **S6 studio**: preview is a semantic description list (SR parity by construction); validation issues focusable + field-linked; band picker enforces the deep-variant lock (a blocking issue, not a warning — 05).
- **S8 host surface (360px)**: notification links focus-direct into visit detail with focus return; arrival pings polite; no host surface requires hover.
- **Forms (composer, kiosk, settings)**: on-blur-or-submit validation; error summary focuses first error; paste never blocked (3.3.8); autocomplete tokens declared for name/tel/org fields (3.3.7 redundant entry across the returning-visitor confirm).
- **Overlays (dialogs, palette)**: focus trap + return to trigger (a11y-baseline §3); palette results grouped and keyboard-selectable.

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (kiosk welcome, Arabic visitor names, purposes) · pure-English render (Latin visitor fixtures, EN chrome) · mixed strings (Latin company "Smart Systems LLC" inside an Arabic visit row; Arabic host name inside EN chrome — bidi isolation proves out) · numeral rendering under Western policy (times, durations, codes — tabular figures, LTR-pinned codes inside RTL layout) · embedded Latin tokens in RTL and Arabic tokens in LTR (isolating containers) · tables/grids column order mirrored with alignment rules held · badge previews BOTH direction variants (rtl-first and ltr-first render and validate — 05 obligation) · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings (the V4 long-name fixture truncates at word boundaries) · 400% zoom reflow in one dimension (kiosk single-column by construction; board columns stack) · bidi isolation on all visitor-entered strings. Seeded fixtures (V2 Latin-in-RTL, V4 long name, the normalization variant) are the regression set.

## Reduced-motion contract (motion-language §5)

The only authored motion is the Arrival Settle (opacity 0→1, 120ms) and standard opacity-only state changes: under prefers-reduced-motion every change renders instantly (opacity in ≤2 steps) with the polite announcement carrying the same information — check-in success, badge readiness, board deltas. The idle welcome loop is static typography (no motion to reduce); page transitions are hard cuts; no overshoot exists anywhere to collapse (minimal personality has none).
