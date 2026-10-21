# 09 — Accessibility: attendance-shift-planner

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions, 1280px and 360px viewports, 200%/400% zoom. The product's structural a11y problem is also its identity: **a dense authoring lattice whose state changes (violations arriving and dissolving) must be perceivable without eyes on the right rail** — solved by the grid live-region contract below. No raw-letter shortcuts anywhere (Arabic-layout conflict class, a11y-baseline §3); every shortcut has a visible button/menu equivalent.

## Keyboard map (critical paths; keys are physical, mapping stays stable in both directions — rtl-rules §4)

| Surface / path | Keys | Behavior |
|---|---|---|
| Global | ⌘K / Ctrl+K | Command palette: bilingual normalized search (rtl-rules §4 pipeline — disclosed in-panel) over teams, workers, week plans, rulesets, qualifications, violations; jump-to-worker-row inside an open grid; recent items |
| S1 teams home | ↑/↓ · Enter · / | Row traversal (virtualized — focus moves scroll into view, never the reverse, P19); open team's planner; focus search. Filter chips removable with Delete |
| S3 week navigator | ⌘[ / ⌘] · N | Previous/next week (chevron icons flip in RTL; the shortcut does not — physical keys); N jumps to next-unplanned week. Navigator header is sticky and clears focused rows (2.4.11 — scroll-margin token obligation) |
| S3 planning grid (CP-1.7 / CP-2.2) | ↑/↓ · ←/→ · Enter · Space | Roving tabindex: ↑/↓ move worker rows, ←/→ move day columns — **inline-end arrow = next day in ar and en chrome alike** (physical mapping stable, rtl-rules §4); Enter opens the cell's action menu (place shift, assign worker, edit, remove); Space toggles bulk row selection (P07). Focus-visible is the Wijdan Indigo ring at 2.4.13 strength (≥2px, ≥3:1 change-contrast, ≥ area of a 2px outline) on every cell, block, and chip |
| S3 shift block | ⌘←/→/↑/↓ · ⌘⇧←/→ · Enter · Escape | Selected block moves between cells with ⌘ arrows (the full keyboard equivalent of drag — 2.5.7); ⌘⇧ + inline-axis arrows stretch the block's start/end (the keyboard equivalent of the resize handles); Enter opens inline edit (P06: Escape restores and focus returns to the block; Tab commits and advances); time fields validate on blur, errors linked inline on the correct inline edge |
| S3 roster rail | ↑/↓ · ⌘→ | Worker rows focusable; ⌘→ places the focused worker into the focused grid cell's assign menu (the rail-drag keyboard equivalent — 2.5.7); day-off and cap marks are text + icon, reached by Tab |
| S3 violation inspector (CP-2) | ↑/↓ · Enter · W | Finding rows focusable, blocking group first; Enter jumps to the offending cell — **both cells of a pair-rule are announced and the jump offers both targets** (the clopen's Sunday close and Monday open); W opens the waive-with-reason dialog from the row (reason REQUIRED — the dialog cannot submit without it) |
| Waive dialog / shift dialog | Tab · Escape · ⌘Enter | Field order: values → reason (waive) / times (shift); Escape cancels and restores focus to the trigger; ⌘Enter submits; trap-free with focus return (a11y-baseline §3) |
| S3 publication gate (CP-3) | Tab · Enter · ⌘⇧P | Blocker links traverse in listed order (blocking violations then coverage shortfalls, each with its jump link); publish fires only from the gate's own control, never a dialog default |
| S4 ruleset library (CP-5) | ↑/↓ · Enter · ⌘S | Rule rows traversed; Enter opens rule detail; editor fields blur-validate (sanity issues per 07c rule 14 — hard errors block save, soft issues render beside the field); ⌘S saves from any field |
| S5 publications / S6 swap log / S7 jobs | ↑/↓ · Enter | Row traversal; artifact regenerate and job re-submit actions keyboard-complete; swap entries read name-at-own-direction + Western times |
| S9 worker review | ↑/↓ · Enter | Day cards traversed; single-swap recording (the one write path) opens from a card action menu |

## Focus order contracts

**S3 planner reading order**: week navigator → roster rail → planning grid → violation inspector → gate bar — in the workspace's active direction, while each roster entry's name renders at its own script direction (bidi isolation, 05). The grid is ONE composite region with roving focus (arrow keys), not a tab trap: Tab exits the grid to the inspector; the inspector's jump link moves focus into the grid at the offending cell and the grid remembers the prior cell for the return trip. Waive/shift dialogs take focus fully and return it to their trigger. The command palette takes focus fully and returns it to the invoking surface. No modal ever stacks on another modal.

## Live-region announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Grid region entry | polite | "46 workers, week of 19 October — 4 blocking, 2 warnings open" (row-count + state context, P19) |
| Cell focused | polite | worker + day + blocks + any guardrail chips by name |
| Violation arrives (recompute after mutation) | polite | "Rest period violation — Sultan, 7h 30m provided, 11h required" (the rule, the worker, the numbers — never "conflict found") |
| Violation dissolves (edit-resolved) | polite | "Rest period violation resolved — rule passes" (paired with the 140ms chip dissolve, 05; the announcement IS the reduced-motion equivalent) |
| Second-order effect after a move | polite | "Move applied — 1 new violation: weekly cap, Reem 1560 of 1440" (the engine never hides what the edit created) |
| Scan progress | polite | determinate units only ("Checking worker 34 of 46 — Riyadh Flagship, KSA v1") — never percentage-only (async-contract §3) |
| Gate refusal (publish attempt) | **assertive** | "Publication refused — 4 blocking violations and 1 coverage shortfall. First blocker: rest period, Sultan" (refusals interrupt: the user asked for an outcome and got a refusal — the one place assertive is earned) |
| Publication success | polite | "Week published — Riyadh Flagship, 19 October. 2 waivers with reasons, 2 accepted warnings, 1 amendment record" (carries the full summary — under reduced motion this announcement replaces the Week-Seals stagger entirely, 05) |
| Ramadan mode engaged (week navigation) | polite | "Ramadan mode — reduced caps apply: 6h daily, 36h weekly" |
| Swap recorded | polite | "Swap recorded — Amal to Noura, Thursday evening. 2 new violations named" |
| Validation error (any form) | assertive | field-linked message; error summary on submit focuses the first error (a11y-baseline §5) |
| Chip cluster overflow ("+2 more") | never (visual only) | the overflow control is the accessible path; chips are focusable when rendered |

Every announcement has a visible equivalent — inspector row, gate list, toast, banner (a11y-baseline §4); live regions never carry information the screen lacks.

## Per-surface WCAG 2.2 AA checklist

- **S3 planner (the hard one)**: 400% zoom reflow with worst-case Arabic strings ("مستشارو التدقيق والحوكمة", rtl-rules §5, plus long role titles like "مشرف سلامة الغذاء في المطبخ الرئيسي") — cells reflow to per-worker stacked strips with violations re-anchored to their blocks (06); truncation breaks at word boundaries only (Arabic has no hyphenation); mixed-direction worker names bidi-isolated (`dir="auto"` roster entries; isolate marks on interpolations); guardrail marks are icon + text + color, never color alone (05 palette contract); targets ≥24×24 (block handles, chips, cell affordances — 2.5.8); drag interactions all carry keyboard equivalents (2.5.7, map above); alternating paper/raised day columns read in grayscale; time strings render tabular Western numerals with one physical order in both directions.
- **S1/S2 lists & editors**: labels persist beside fields — never as ghost text inside them (a11y-baseline §5); virtualization preserves focus (P19); roster rows disambiguate duplicate names by worker code; four empties distinct per P01 (11); filtered states declare themselves (P08).
- **S4 ruleset library**: rule values in tabular figures; sanity errors field-linked on the correct inline edge; source notes and capture dates are text, reachable by keyboard; the "verify against current law" line is part of the ruleset's accessible description.
- **S5/S6/S7**: blocker lists keyboard-traversable; waiver reasons and swap provenance read as text (names at own direction, times Western); artifact expiry stated in text; job rows state + re-submit keyboard-complete; the Week-Seals moment is success-only and fully redundant with its announcement + state chip (motion-language §2/§5).
- **S8 settings / S9 review**: consent surfaces in capability language (no cognitive-function tests — 3.3.8, paste never blocked); S9 day cards ≥44px touch targets on phone viewports (worker-facing surface, 02 Salem); violation summaries are text-first.

## RTL/LTR verification matrix (per surface, both workspace directions)

For each of S1–S9, both directions: pure-Arabic render · pure-English render · mixed strings (Latin worker names inside Arabic chrome — seeded `w-r04` "Ravi Kumar" in the nameAr field is the fixture; "Grace Lim" in the sample team) · numeral rendering under the Western policy inside Arabic chrome (times, minutes, codes — never mixed systems mid-sentence) · embedded Latin/numeric tokens in RTL (worker codes, shift role codes) · tables and the planning grid mirrored (day columns flow inline-start→inline-end per direction; column order mirrored; alignment rules held) · forms (label/error placement on the correct inline edge) · truncation at 320px container with worst-case strings · 400% zoom reflow (stacked strips) · bidi isolation on user-generated content (worker names, waiver reasons, swap notes). Dual-calendar dating (P24): Gregorian primary + Hijri secondary (Umm al-Qura for KSA, method disclosed); both date systems render LTR-embedded with isolation so Hijri/Gregorian pairs never re-order; the Ramadan banner carries both systems plus the reduced caps in text (perceivable without its brass color, 05). Week-stepper chevrons flip; calendar, clock, users/grid/columns, swap-exchange, alert, and award glyphs never flip (06 icon-flip decisions).

## Reduced-motion contract (motion-language §5)

Crossfades → hard cuts; violation chip arrive/dissolve → instant state change + the polite announcements above (the announcement schedule is the reduced-motion equivalent of every animated transition); the Week-Seals stagger → simultaneous seal render + full-summary announcement; shift-block settle → instant placement; scan/import/export progress remains (it is work state, not decoration) but any progress micro-motion collapses to text updates. All state changes remain perceivable by construction — nothing is carried by motion alone.
