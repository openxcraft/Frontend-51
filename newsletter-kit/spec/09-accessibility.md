# 09 — Accessibility: newsletter-kit

SME-F pass · WCAG 2.2 AA floor, both directions, 1280px + 360px viewports, 200%/400% zoom.

## Keyboard map (critical paths)

- **CP-1 composer**: Tab order = locale tabs → ar block column (reading order) → en column → variant editor; ↑/↓ traverse blocks; Enter activates focused block edit (P06: Escape cancels, Tab commits); ⌘↑/⌘↓ reorder (2.5.7 drag equivalent); ⌘/Ctrl+M mirrors order to the other locale (confirm chip); skip link palette → block columns.
- **CP-2 variants**: ⌘/Ctrl+Enter adds a variant in the focused locale tab; variants are a listbox-with-edit (arrows, Enter to edit, Delete with 7s undo — P03); ⌘/Ctrl+Shift+Enter marks the focused variant primary (radio semantics); ⌘/Ctrl+Shift+A triggers assist (when available — the button equivalent is always present).
- **CP-3 QA**: ⌘/Ctrl+Shift+Q runs the checklist; results are focusable rows in reading order (check → status word → detail → fix link); ⌘/Ctrl+Shift+F jumps to the first fail's fix target; preview width toggle is a segmented control (←/→).
- **CP-4 subscribers**: P18 table (arrow navigation, ⇧+arrow range select, space toggles); ⌘/Ctrl+I opens import; awaiting-rows review is a dialog of per-row radio groups (focus-trapped, Escape returns to trigger); removal type-to-confirms the list name (P04 L3).
- **CP-5 send desk**: ⌘/Ctrl+Shift+S opens schedule on the focused issue; gate-blocked states focus the blocking reason list (error-summary pattern); verify results announce inline; jobs table = P18 grid.
- Shortcuts are modified-keys only (⌘/Ctrl-chords) — no raw-letter keys, so no Arabic keyboard-layout conflicts (a11y-baseline §3); every shortcut has a visible button/menu equivalent. Focus: 2.4.11/2.4.13 strength (≥2px, ≥3:1 change contrast, scroll-margin past sticky rails); overlays trap-free with focus return.

## Announcement schedule (live regions — every announcement pairs with a visible surface)

| Event | Mode | Visible equivalent |
|---|---|---|
| Autosave cycle (saving → saved → conflict) | polite | P10 status chip in composer header |
| Assist stream start/completion (count + locale) | polite (never per-proposal) | reserved region + status line |
| Assist partial failure | assertive | partial marker + retry/discard |
| QA run started/completed (fails/warns per locale) | polite | checklist summary |
| QA fail row focused | polite | row highlight + status word |
| Send gate blocked (reason count) | assertive | gate reason list focused |
| Send job state changes | polite | SendProgress row |
| Import awaiting-input (row count) | assertive | review dialog entry |
| Channel verify outcome | assertive on failure, polite on success | inline result on binding row |
| Destructive confirm (remove N subscribers) | assertive | type-to-confirm dialog |

Decorative layout shifts, streaming proposal tokens, and per-batch send ticks are never announced (P13; locale-edition completion announces once).

## Per-surface WCAG 2.2 checklist

- **S1/S4/S5 lists**: P19 virtualization with focus preservation; row-count context on region entry; targets ≥24×24 (2.5.8); filter chips carry predicate descriptions (P08).
- **S2 composer**: columns reflow stacked at narrow widths (400% safe); per-column direction rendering (ar RTL, en LTR); bidi isolation on all text inputs (`dir="auto"`); labels persist beside/above fields — ghost text never stands in for a label; error placement on the correct inline edge per direction.
- **S2 variants / S3 QA**: status never color/icon-only (word + icon); char budgets printed as text; checklist rows are list semantics with link-to-block; the 320px preview container is a labeled region.
- **S4 import**: consent-proof field labeled; error summary on submit focuses first error (a11y-baseline §5); recalled column mappings marked (P11).
- **S5 send**: gate reasons are an ordered list; progress labels are written copy with counts (async-contract §3); job rows link to context.
- Forms: validation on blur-or-submit, inline linked messages; autocomplete tokens on email fields; required is programmatic.

## RTL/LTR verification matrix (per surface, per direction — seeded fixtures are the test set)

| Surface | ar (RTL) | en (LTR) |
|---|---|---|
| S1 issues home | mirrored order; truncation with worst-case long words; 400% reflow | same battery |
| S2 composer | ar column RTL + en LTR side-by-side (P23); pair chips on correct inline edge; mixed-direction block text isolated | en primary LTR, ar column RTL; same |
| S2 variants | AR subject with embedded Latin (C02 fixture) isolated; mobile-clip truncates at word boundary | plain subject; budgets display |
| S3 QA + preview | direction containers verified (C01); CTA inline-start (C09); 320px render; Western numerals (C05) | same battery mirrored |
| S4 subscribers | column order mirrored; email column stays LTR (data, not prose); Arabic-normalized search active | standard |
| S5 send desk | per-locale progress rows direction-aware; channel hints (Latin fragments) isolated | standard |

Mixed strings use bidi isolation wherever they render — the seeded `issue-103` C02 fixture and `list-beta` mixed rows are canonical test data. Both directions pass the full release matrix (a11y-baseline §8) including reduced-motion (QA settle → instant state chip; assist stream → paragraph-chunk reveal).
