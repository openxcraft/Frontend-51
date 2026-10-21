# 09 — Accessibility: khatt-type-playground

SME-F pass · WCAG 2.2 AA floor, both directions, 200%/400% zoom, 1280px + 360px viewports (a11y-baseline §1).

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K palette (P05, Arabic-normalized search); skip-to-canvas link; escape closes panels/popovers with focus return (trap-free).
- **CP-1**: rail standard; G opens glyph grid of the focused font; grid arrows ↑↓←→ cell-by-cell with physical mapping stable in both directions (rtl-rules §4); Enter opens GlyphInspector; Home/End jump; block switcher is a radio group; upload dialog is a real form (attestation = real checkbox).
- **CP-2**: Tab order = canvas blocks (reading order) → controls column; S swaps scripts; arrows adjust the focused slider (2.5.7 equivalents); ⌘Z undo; comparator pin toggles with state announcement.
- **CP-3**: K opens the kashida panel; mode control is arrow-key radio semantics; intensity = ←→ ±5% (Home=0, End=max); feature toggles are switches in a list; disabled controls stay focusable and expose their reason (disabled ≠ invisible).
- **CP-4**: block list per P18; ⌘↑/⌘↓ reorder (keyboard equivalent for drag — 2.5.7); numeral-run block is readable text, not an image.
- **CP-5**: export dialog standard; job rows focusable with cancel; artifact links standard.

Shortcut discipline: no raw-letter shortcuts outside grid contexts (Arabic keyboard-layout conflicts — a11y-baseline §3); global shortcuts are modified keys.

## Focus order & visibility

DOM order = reading order per direction (blocks read their own order, never mirrored DOM); focus-visible at 2.4.13 strength (≥2px Brass Ink ring, ≥3:1 change contrast, ≥ area of 2px outline); sticky rails keep scroll-margin so focus is never obscured (2.4.11); targets ≥24×24 CSS px incl. glyph cells and slider handles (2.5.8).

## Per-surface WCAG 2.2 AA checklist

| Surface | Checks (beyond floor) |
|---|---|
| S1 catalog | filter chips announce predicates (P08); self-demonstrating font strips aria-hidden (decorative) with family name in accessible text |
| S2 font detail | grid virtualization preserves focus (P19 — scroll follows focus, never moves it); row-count announced on region entry; joining-form figures carry text labels (Arabic + Latin) |
| S3 bench | two-column reflow stacks at narrow widths (400% safe); per-block direction with bidi isolation; leading floors prevent tashkeel clipping |
| S4 kashida lab | stretch marks = color + symbol redundancy; per-line readout is a real table with programmatic headers; slider value announced on change |
| S5 composer | validation messages field-linked; error summary focuses first error on save; reorder announced live |
| S6 share view | settings provenance is a definition list; read-only semantics announced; works at 360px |
| S7 jobs | progress in units ("Rendering block ٣ of ٧"), not bare percentages; cancel is one action |
| S8 settings | numeral toggle takes effect live with announcement; no cognitive-test auth (3.3.8) |

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render · pure-English render · mixed strings (Latin family names inside Arabic chrome — bidi isolation on every interpolation) · numerals under AR-indic default + Western toggle (both systems in numeral-run blocks as content) · embedded Latin/numeric tokens in RTL (codepoints in mono LTR-isolated containers) · grids (glyph-grid arrow mapping stable; column order mirrored) · forms (labels/errors on the correct inline edge) · truncation at 320px with worst-case Arabic ("مستشارو التدقيق والحوكمة") · 400% zoom reflow both directions · slider direction (intensity increases toward inline-end in RTL). Fixtures: seeded mixed-line block + both-numerals run (07c).

## Screen-reader announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Catalog page loaded | polite | count + active filters |
| Glyph selected | polite | name + codepoint + joining-form count |
| Font fallback engaged | polite | family name + "rendering with system fallback" |
| Kashida intensity changed | polite | "كثافة الكشيدة ٤٠٪" / "Kashida intensity 40%" |
| Feature toggle | polite | feature name + on/off + effect one-liner |
| Unsupported mode attempted | assertive | reason citing the font's capability ("Reem Kufi supports tatweel only") |
| Session saved / conflict | polite / assertive | autosave cycle; conflict names both versions |
| Export job state changes | polite | state + progress in units |
| Export ready | polite | format + expiry |

Assertive channel reserved for validation errors, conflicts, unsupported-feature attempts; decorative rendering and layout shifts never announced (a11y-baseline §4); every announcement pairs with a visible surface.

## Reduced-motion contract

Minimal personality (05): opacity-only ≤120ms; with prefers-reduced-motion all transitions become hard cuts; the export success tick renders as an instant state chip; no parallax, no autoplaying motion (motion-language §5–6). All state changes have text equivalents per the schedule above.
