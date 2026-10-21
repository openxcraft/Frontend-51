# 09 — Accessibility: customs-tariff-lookup

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model) · 1280px and 360px viewports · 200% and 400% zoom · worst-case Arabic strings for truncation/reflow (rtl-rules §5 class, e.g. "مصنوعات أخرى من البلاستيك وأخرى من مواد البنود 3901 إلى 3915" — long joined descriptions are the nomenclature's daily reality).

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search over codes/notes/lists/schedules); ? opens shortcut help; skip-link to main content; Tab order follows visual reading order per direction; focus ring = Jumruk Bronze ≥2px (5.50:1 on canvas — 2.4.13 area + change-contrast satisfied), 2.4.11 scroll-margin on the sticky tree rail and edition banner; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class, a11y-baseline §3); every shortcut has a visible button/menu equivalent.
- **CP-1 (search)**: typing lands focus in the search field from anywhere via `/`; ↑/↓ walk result rows with the matched-field marker re-announced per row; Enter opens the reading pane (focus moves to the code block, then the pane's reading order); A toggles the assist panel; N opens the normalization disclosure panel; chapter filter chips are Tab-reachable with Space to toggle (P08); Esc clears the search context and returns focus to the field.
- **CP-2 (tree)**: ↑/↓ walk siblings; → expands (inline-end arrow semantics stable in both directions — rtl-rules §4); ← collapses / jumps to parent; Enter opens the reading pane on the focused node; B jumps to breadcrumbs; S opens the schedule switcher; R reveals retired tombstone rows (toggle); virtualized levels keep focus while scrolling moves under it (P19 — scrolling never moves focus).
- **CP-3 (reading pane)**: Tab walks the pane's regions in reading order (code block → descriptions → duty block → compare strip → notes list → actions); C focuses the compare strip; L opens the linked-notes list; V opens the save dialog (the P15 human-signature action — dialog traps focus, Esc returns to the trigger); the no-guarantee sentence is in the tab order as visible text, never tooltip-only.
- **CP-4 (notes library)**: P18 grid (↑/↓ rows, ←/→ filter facets); Enter opens note detail; S focuses the bilingual notes search; O opens the attach-to-saved-code picker; supersession banner links are Tab-reachable in sequence (walkable chain).
- **CP-5 (saved lists)**: P18 grid with range selection (Shift+arrows); Space toggles row selection for bulk (P07); E edits a product description inline (P06 — Esc restores, Tab commits+advances); V sets desk-verified, F sets flagged (both explicit human-signature actions with undo windows, P03); K runs the edition check; Enter on an affected row opens the change record; Delete removes with the undo affordance (level 1); list deletion is type-to-confirm (level 3, P04) — the field is labeled with the list's name.
- **CP-6 (settings/console)**: standard forms (labels persist above fields — a11y-baseline §5) and list navigation; export options are radio/checkbox groups with described consequences; J jumps to jobs, M to activity within the console.

## Focus order rationale

Per surface, focus follows the desk's reading order: search field → results → reading pane (code first — the object of the work), tree rail after content. In RTL chrome the order mirrors with the tree rail on the inline-end; the reading pane's English description and Arabic rendering are separate focus stops (sibling lines, never one merged stop — SR users hear which script they are in); code blocks are always announced as digit groups ("0207 dash 14 dash 00 dash 20" at 4-digit grouping) — a 12-digit run read as one number is unreadable.

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Search results ready | polite | count + top hit's code and level ("Results: 12. Top: 0207.14, subheading") |
| Assist candidates appear | polite | provenance + count ("assist: 3 candidates — drafts, nothing saved") |
| Assist degraded / quota | polite | ladder notice + that deterministic search is unaffected |
| Code settles (reading pane open) | polite | code (digit-grouped) + level path + schedule edition |
| Normalization disclosure reveal | polite | the rule names applied to the current query |
| Duty reference read | never auto | read on focus/hover only (visible text) — rates are read deliberately, not pushed |
| Save / status change (desk-verified, flagged) | polite | code + new status + who signed ("desk-verified by Noura") |
| Note linked / unlinked | polite | note ref + saved code |
| Edition check done | polite | checked count + affected count ("Checked 7 saved codes — 2 affected by the 2026 edition") |
| Export ready / artifact expired | polite | artifact kind + expiry window |
| Validation errors (query, duplicate save, edition pair) | assertive | field/row-linked via described association |
| Job failure | assertive | typed error + next action |

Decorative layout shifts, tree expansion crossfades, and the code-settle's opacity steps are NEVER announced (the paired announcement carries the information); every state change has a visible text equivalent (live regions pair with visible surfaces — a11y-baseline §4).

## Per-surface WCAG 2.2 AA checklist

- **S1/S4 search + results**: mixed-script input `dir="auto"` with bidi isolation; matched-field marker is icon+text; code cells `dir="ltr"` mono; duty chip title is duplicated as visible text in the reading pane (tooltip never the sole carrier); >200 rows virtualize with focus preservation (P19) + SR row-count on region entry; targets ≥24×24 (2.5.8); 400% reflow — results table collapses to stacked cards at 360px (ux-guidelines row 71 class).
- **S2 tree**: aria-level/expanded per node; tombstone rows are links with change-record targets; virtualized chapters keep SR context ("Section I, chapter 2 of 9 loaded"); drag does not exist on the tree (keyboard-native by design — 2.5.7 trivially satisfied); expansion is instant + crossfade with a text delta always present.
- **S3 reading pane**: code block announced as digit groups; Arabic rendering is a sibling line at own direction with the gap mark as text+glyph ("no Arabic national rendering published"); duty block: kind + value + unit + edition + the no-guarantee sentence in visible text; excise flag renders "separate regime" as text, never an amount; compare strip headers announce schedule + edition; save dialog traps and returns focus.
- **S5 notes library**: status chips icon+text+color; supersession banner is a labeled link sequence; goods descriptions render the carried side(s) with gap marks; date filters use labeled fields with `inputmode` numeric guidance; filtered-empty declares itself (P01).
- **S6 lists**: inline edit per P06 (never trap focus in a cell); CONFLICT surfaces both versions inline with the field-linked message; bulk bar names the count and scopes every action ("3 selected"); retired-code tombstone rows link migration paths; type-to-confirm field is labeled with the list name (not a generic token).
- **S7 editions**: change-kind markers icon+text; old→new rate values in mono with both edition labels as table headers (P16 direction-aware diff); zero-affect rows still render (honesty is the feature).
- **S8 console**: job rows with state, link-to-context, cancel/retry buttons ≥24×24; activity rows announce actor-action-target in one phrase.
- **Forms (save dialog, list create, settings, export options)**: labels persist above fields (ghost text is never the label); on-blur-or-submit validation with field-linked messages; error summary focuses the first error; paste never blocked (3.3.8); autocomplete tokens declared on product-description fields where they recur (3.3.7 recall).
- **Overlays (dialogs, palette)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05); Esc closes, never orphaning focus.

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (tree, descriptions, notes summaries) · pure-English render · mixed strings (Latin HS code inside Arabic description prose — bidi isolation proves out; Arabic product descriptions inside EN chrome) · numeral rendering under the Western policy (codes, rates, counts, note refs — LTR-isolated digit runs inside RTL sentences) · embedded Latin tokens in RTL and Arabic tokens in LTR (isolating containers, rtl-rules §2) · tables/grids column order mirrored with alignment rules held (code column stays LTR content, aligned inline-start of its cell in both directions) · tree expansion direction and breadcrumb order mirrored · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings (long schedule descriptions — ellipsis breaks at word boundaries, no hyphenation exists, rtl-rules §4) · 400% zoom reflow in one dimension on S1–S8 · bidi isolation on all user-generated strings (product descriptions). Seeded fixtures (07c: شاشه taa-marbuta query, أرز alef variant, RN-0004 EN-only note, RN-0006 AR-only goods description, gap-marked new headings) are the regression set.

## Reduced-motion contract (motion-language §5)

The identity is minimal (≤120ms opacity-only) by construction: tree expansion renders instantly (crossfade collapses to a hard cut); the signature code-settle renders the code at full opacity instantly with the same polite announcement (identical information, zero motion); route changes hard-cut; modals fade in ≤2 opacity steps; every animated state has a text equivalent (the announcement schedule above). A reduced-motion pass repeats the keyboard matrix — no information is ever carried by motion alone (a11y-baseline §4).
