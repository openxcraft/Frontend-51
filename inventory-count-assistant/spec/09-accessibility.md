# 09 — Accessibility: inventory-count-assistant

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-ar model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5) for truncation/reflow. The guided count view (S3) is the accessibility-critical surface: a counter walks an aisle with one thumb, low attention budget, and possibly screen-reader support — every S3 contract below is written for that reality.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search); ? opens shortcut help; skip-link to main content; Tab order follows visual reading order per direction; focus ring = Jarda Moss ≥2px, 5.40:1 on canvas, 2.4.11 scroll-margin so sticky headers never cover it; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class, a11y-baseline §3); every shortcut has a visible button/menu equivalent.
- **CP-1 (S6 catalog paste / S7 register paste)**: ⌘V lands focus in the paste field from anywhere in the import dialog; the job-progress dialog is non-modal and announced politely; P18 grid in the catalog (↑/↓ rows, ←/→ columns — physical mapping stable in both directions, rtl-rules §4); Space toggles row selection for bulk ops (P07).
- **CP-2 (S3 guided count — the counter's surface)**: `/` focuses the scan/search field from anywhere in S3; scan or type-to-search lands focus on the matching row and opens the quantity pad; digits type the quantity; Enter commits and advances to the next uncounted row (the walking rhythm); Tab commits and advances (same behavior, P06 escape hatch: Esc restores the prior quantity and returns focus to the scan field); ↑/↓ move rows without committing; E re-opens the quantity pad on the focused counted row (correction); ⌘Z undoes the last entry within the 7s window (P03); the masked tally column in blind mode announces "قناع — الجرد الأعمى" (masked — blind count) on focus, never a fake quantity.
- **CP-3 (S4 reconciliation)**: the variance ledger is a P18 grid — ↑/↓ rows, ←/→ move across book/counted/delta/band/outcome/resolution cells with column headers re-announced; V jumps to the next unresolved variance; U jumps to the next uncounted item; R requests a recount on the focused row; A accepts the count; K keeps book; N opens the resolution note field (required for keep-book/investigate — focus lands in the note on submit failure via error summary); the close-gate confirm is a focus-trapped dialog naming the counts (P04 level 2) with focus returned to the trigger.
- **CP-4 (S8 policy editor)**: standard form order; the worked example is a live region that recomputes politely on field change (never assertive — it follows, not interrupts); band strategy is a radio group; validation messages field-linked (error summary on save focuses the first error).
- **CP-5 (S9 console)**: standard list navigation; Enter opens job/session/activity detail with link-to-context.

## Focus order rationale

Per surface, focus follows the working order of the person on the floor: in S3 the scan field is FIRST (entry point of every action), then the sheet rows in zone order, then the progress meter; the management surfaces follow reading order (title → primary action → list). In RTL everything mirrors; the scan field stays at the inline-start edge in both directions (it is the work origin, not a decoration).

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Entry accepted | polite | item (primary-locale name) + quantity + progress ("تمر فاخرة — 3 — 12 من 14") |
| Scan double-fire | polite | "المسح نفسه — لم يُضف عدّ ثانٍ" (same scan — no second count added) |
| Entry correction saved | polite | item + old→new + revision count |
| Offline queue state | polite | queued count ("عدّان في قائمة الانتظار — سيُرسلان عند عودة الاتصال") |
| Reveal complete | polite | the counts summary ("14 صنفاً — 3 فروق خارج السماحية — 2 غير معدودة") — the signature moment's announcement, always paired with the visible ledger |
| Recount requested / submitted | polite | item + kind |
| Variance resolved | polite | item + resolution kind + actor |
| Close gate refusal | assertive | what blocks, by count and by first item ("إغلاق مرفوض — 2 غير معدودة و3 فروق بلا قرار — أولها KD-3002") |
| Validation errors (paste rows, policy fields, note-required resolutions) | assertive | field/row-linked via described association |
| Job progress (imports/exports) | polite | rows done of total |
| Progress meter quarter marks | polite | counted/total only — never per entry |
| Autosave cycle (policy/catalog) | polite | saving → saved (fade) |

Decorative layout shifts, band-bracket redraws, and the reveal crossfade are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces — a11y-baseline §4). The blind-mode masking is announced on focus in S3 — a masked column must never be silently blank.

## Per-surface WCAG 2.2 AA checklist

- **S3 GuidedCountSheet + ScanEntryBar**: quantity pad targets ≥48×48 (2.5.8 with margin — the counter is walking, not sitting); scan field auto-focus never traps (Tab leaves it into the sheet); mixed-script rows bidi-isolated (`dir="auto"` on search input; isolate marks around interpolations — rtl-rules §2); item labels render per-script direction inside the bilingual cell; worst-case joined-word truncation at 320px (rtl-rules §4 — no hyphenation exists); >200 rows virtualize with focus preservation (P19) and row-count context on region entry; blind masking is text-announced, never a blank column.
- **S4 VarianceLedgerRow**: signed deltas ALWAYS text with explicit −/+ signs (never icon-flip or color alone); tolerance band edges printed as text beside the drawn bracket (numbers always present, never heat-only — charts.csv contract); outcome chips icon+text+color with the 05 text-bearing variants; review-required vs recount-pending distinguishable by label text alone; 400% reflow — the ledger collapses to stacked rows at 360px with the delta line prominent.
- **S6 catalog**: P18 grid + P19 virtualization; incomplete-label state is a text hint, never color-only; class chips text-bearing (moss-deep, 9.07:1).
- **S8 PolicyEditorForm**: live worked example is a polite live region; field-level validation linked; the band-strategy radio renders plain-language consequences.
- **Forms (pastes, session setup, resolution notes)**: labels persist above fields (ghost text is never the label — a11y-baseline §5); on-blur-or-submit validation; error summary focuses the first error; paste is never blocked (3.3.8); redundant entry eliminated — session setup pre-fills store/policy from context (3.3.7 / P11).
- **Overlays (dialogs, palette)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05); job-progress dialogs non-modal.
- **Motion (crisp personality)**: all state changes carry text equivalents; the Ledger Reveal crossfade (140ms) announces the same summary it renders; reduced-motion: hard cut + identical announcement.

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (count sheets, variance ledgers, policy editor) · pure-English render · mixed strings (Latin barcode inside Arabic sheet row — bidi isolation proves out; Arabic counter name inside English-chrome activity log) · numeral rendering under the Western policy (quantities, deltas, percentages, IRA, barcodes — Archivo tnum in both directions; TC-1003's Arabic-Indic ١٠٠٠ inside the Arabic name renders per-context, 07c fixture) · embedded Latin tokens in RTL context and Arabic tokens in LTR context (isolating containers) · tables/grids column order mirrored with alignment rules held (the delta column's sign placement mirrors; the numbers never reorder — rtl-rules §2) · forms label/input alignment + error placement on the correct inline edge · truncation at 320px with worst-case joined-word strings ("مستشارو التدقيق والحوكمة" class) · 400% zoom reflow in one dimension · bidi isolation on all user-generated strings (counter names, item names, notes). Seeded fixtures (07c: GL-2002 English-only name in Arabic sheet, KD-3001 Arabic-only name in English chrome, "أمل القحطاني / Amal Al-Qahtani" mixed counter names) are the regression set.

## Reduced-motion contract (motion-language §5)

Crisp personality is already near-still: route changes ≤180ms crossfades become hard cuts; entry settle ≤120ms becomes instant with the polite announcement; the Ledger Reveal crossfade becomes an instant column swap with the summary announcement; no staggered reveals exist to collapse (crisp forbids them); the progress meter is geometry + text, unchanged. Every perceivable fact survives with motion fully disabled — verified in the release matrix (a11y-baseline §8.6).
