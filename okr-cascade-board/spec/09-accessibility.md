# 09 — Accessibility: okr-cascade-board

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model — the workspace flips; every surface verified both ways) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5 class; seeded fixtures include "ارتفاع التسليم الكامل في الموعد من 82% إلى 95%" and the joined-word stress case "مستشارو التدقيق والحوكمة" in member-entered blocker text).

## Keyboard map (critical paths; modified chords only — no raw letter keys, the Arabic-layout conflict class a11y-baseline §3 bans)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search); ? opens shortcut help; skip-link to main content; Tab order follows the visual reading order per direction; focus ring = lime-deep ≥2px, 6.77:1 on canvas (05 contract), 2.4.11 scroll-margin so sticky headers never cover it; every shortcut has a visible button/menu equivalent.
- **CP-1 (cascade authoring, S2/S3)**: on the board, ↑/↓ move between objective cards in a lane, ←/→ move between company tier and team lanes (physical mapping stable in both directions — rtl-rules §4); Enter opens objective detail; Alt+N opens the new-objective composer (level prefilled by context); in the pair editor, Tab walks EN column → AR column → controls (never traps); Esc restores the field being edited (P06) and returns focus to its trigger; Alt+P toggles the pair-parity panel; Alt+D requests drafting proposals (the assist panel's visible button equivalent); Alt+A accepts / Alt+E edit / Alt+X dismiss on the focused proposal card (P15 gate fully keyboard-operable).
- **CP-2 (KR authoring, S3)**: Alt+R adds a key result on the focused objective; metric fields are a standard field group (labels persist above, a11y-baseline §5); the lint panel is reached by Alt+L and read as a list (rule, matched span, guidance); findings close live (polite announcement of count change); Alt+Shift+R archives the focused KR (P04 confirm names the consequence — the confirm's buttons are the path, never a raw key).
- **CP-3 (check-in desk, S4)**: the due list is a single-column queue — ↑/↓ move check-ins, Enter opens the focused form; value, confidence (radio group, ↑/↓ + Space), blockers (list with add/remove buttons), help-needed (checkbox), submit (button; double-activation safe by 07b idempotency); the desk renders fully at 360px (participant path); correction re-opens via the check-in history's Edit button.
- **CP-4 (governance, S2/S3/S5)**: Alt+M opens the re-align (parents) menu on the focused objective; Alt+B opens re-baseline (reason field required — validation announces assertively); archive flows through visible confirm-ladder buttons; the cadence dashboard's zones are navigable regions (G jumps region-to-region is NOT used — zone navigation is via Tab and named landmarks, no raw G).
- **CP-5 (grading, S6)**: the close gate and grade computation are buttons; the grade sheet is a semantic table — arrow navigation with headers re-announced (P18); export options are a field group; artifact links are standard links.
- **CP-6 (workspace, S1/S7/S8/S9)**: standard list navigation throughout; jobs rows expose cancel/retry as buttons; the cadence preview grid is read-only text; usage meter is a progress region with text values (never visual-only).

## Focus-order rationale

Per surface, focus follows the leadership reading order: cycle context → cascade structure (company tier before team lanes, reading direction honored) → per-objective detail → actions inline-end. In RTL the order mirrors and lane flow reverses toward inline-start (rtl-rules §2). The pair editor's EN→AR column order follows the workspace locale: LTR chrome walks EN then AR; RTL chrome walks AR then EN — the *author's* first language leads in both configurations, and the parity indicators sit between the columns so focus passes them predictably. The check-in desk's queue order is due-date then KR name; focus never jumps when the Cascade Settle animates (motion never steals focus — motion-language §2).

## Announcement schedule (a11y-baseline §4 — live regions pair with visible surfaces)

| Event | Mode | Copy shape |
|---|---|---|
| Check-in submitted (the Settle) | polite | KR + value + progress + objective rollup ("Checkout conversion 2.3 of 3.0 — 22% · objective 30%") — mirrors the visible numbers exactly |
| Check-in correction saved | polite | value before → after + revision count |
| Lint findings count changed | polite | "3 findings — task verb, length, pair parity" (full list on panel open) |
| Draft stream started / completed | polite | start: "Drafting proposals…" · completion: "3 proposals ready — review each" (never per-token, P13) |
| Draft proposal resolved | polite | outcome + what happened next ("copied into the editor as a draft") |
| Validation errors (metric span, empty value, required reason, state gates) | assertive | field-linked via described association; error summary focuses the first error on submit |
| Coverage zone change (period closed, grace entered) | polite | period index + zone counts on dashboard entry, never on every cell |
| At-risk flag appears/clears | polite | KR + named trigger ("confidence 2 on period 2") |
| Grade computation done | polite | cycle + objective count + unreported count |
| Export ready / artifact expired | polite | format + expiry window |
| Autosave cycle (pair editor, check-in form) | polite | saving → saved (fade) |
| Cadence change applied | polite | new frequency + migration result (re-mapped count, pre-change bucket count) |

Decorative layout shifts, progress-bar fills, ring arcs, and grid recolors are NEVER announced; every state change has a visible text equivalent (a11y-baseline §4 — the announcement table above maps 1:1 to visible surfaces in 11).

## Per-surface WCAG 2.2 AA checklist

- **S2 CascadeBoard**: nested-list semantics (SR traverses the tree with disclosure); alignment edges render as described relationships, never visuals-only; lane virtualization >60 cards with focus preservation + row-count context on region entry (P19); unreported rollups announce "—" as "not yet reported", never "zero percent"; target sizes ≥24×24 (2.5.8); 400% reflow — lanes stack vertically, one dimension scrolls.
- **S3 Objective detail + pair editor + assist panel**: each column its own `dir` (bidi isolation on all user text — rtl-rules §2); empty pair sides announce "AR side not yet authored" (honest, never ghost-filled); assist streaming region reserved (CLS ≤0.02, 10) and announces start/completion only; Stop is keyboard-reachable from first token; partial output marked partial; the lint panel is keyboard-reachable (Alt+L) and reads as a list; worst-case Arabic titles truncate at word boundaries (no hyphenation exists — rtl-rules §4).
- **S4 CheckInForm**: labels persist above fields (ghost text never labels — a11y-baseline §5); metric context row (baseline/target/direction) announced with the field; confidence radio group with visible anchored labels; validation on-blur-or-submit, field-linked, summary focuses first error; 360px single-column layout is the designed primary, not a squeezed desktop.
- **S5 CadenceCoverageGrid**: table semantics, headers re-announced (P18); every cell's state as text (SR and sighted read the same truth — 'missing' says "missing — unsubmitted draft exists"); overdue/at-risk zones are named regions with counts; >200 cells virtualize (P19); at 360px the grid collapses to per-KR period strips (cards, not horizontal scroll).
- **S6 GradeSheetTable**: formula text in every row (numbers-as-text, never color-only grades); aspirational threshold semantics in place; archived/unreported disclosure rows are text rows with counts.
- **S7/S8 Jobs & activity**: standard list navigation; cancel/retry buttons; activity rows read actor-action-target-timestamp (P17 grammar).
- **Forms (cycle create, cadence settings, composer)**: labels persist; autocomplete tokens declared for member fields; required is programmatic; paste is never blocked (3.3.8 — focus briefs and blocker text accept pasted content).
- **Overlays (palette, confirms, assist panel modals)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05); confirm ladders name consequences in text (P04).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (objective titles, KR statements, cycle names, team names) · pure-English render · mixed strings (Latin metric units "%" beside Arabic statements; Arabic member names inside LTR chrome and vice versa — bidi isolation proves out; blocker free text at own direction via dir="auto") · numeral rendering under Western policy (progress %, confidence digits, period indices, baselines/targets, dates) · embedded Latin tokens in RTL context (product names, "NPS" inside Arabic statements — isolating containers) · tables/grids column order mirrored with alignment rules held (coverage grid period columns flow toward inline-end in RTL) · the pair editor's column order follows workspace locale (05 focus-order rule) · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings · 400% zoom reflow in one dimension · bidi isolation on all user-generated strings. Seeded regression set (07c): the C-1 bilingual objective/KR pairs, the mixed-script blocker fixtures, kr-stockout's zero-target Arabic statement, TO-5's parity-flagged pair.

## Reduced-motion contract (motion-language §5)

The Cascade Settle's overshoot collapses to an in-place value change + the identical polite announcement (perceivability preserved by construction — the numbers carry the information, never the motion); bar fills and ring arcs render as instant state with text deltas; route changes are hard cuts; the coverage grid's cell transitions collapse to opacity in ≤2 steps; streaming text renders in paragraph chunks announced per chunk completion, politely. A reduced-motion pass of every CP at both directions is part of the release matrix (a11y-baseline §8.6).
