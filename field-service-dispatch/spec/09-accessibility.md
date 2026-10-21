# 09 — Accessibility: field-service-dispatch

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-ar model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5 class: "مستشارو التدقيق والحوكمة"; product-specific worst cases: "صيانة مكيف مركزي — برج المملكة، الطابق 23، شقة 12" and "تركيب رفوف وستائر — مجمع الفيلات 12، الربيع").

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search over job codes / titles / customers / technicians); ? opens shortcut help; skip-link to main content; Tab order follows the visual reading order per direction; focus ring = Mawqi Teal ≥2px, 5.68:1 on canvas, 2.4.11 scroll-margin keeps the sticky day header from covering it; every shortcut is a modified chord (no raw letters — Arabic-layout conflict class, a11y-baseline §3); every shortcut has a visible button/menu equivalent.
- **CP-1 (S1 board + S3 intake)**: board is a P18 grid — ←/→ move between lanes, ↑/↓ between cards within a lane (physical mapping stable in both directions, rtl-rules §4); Enter opens the card drawer; S schedules the focused card (dialog: window fields, technician menu, save); ⌘↑/⌘↓ moves the focused card between lanes (drag equivalent, 2.5.7); Esc closes the drawer returning focus to the card; intake form is a labeled field sequence with ⌘Enter submit.
- **CP-2 (S2 drawer + S10 mobile)**: drawer actions live in StateTransitionBar — Tab reaches them in reading order, Space activates; pause opens the reason chips as a radio group (↑/↓ + Space) with optional note field; on the technician shell the four state buttons are the first four Tab stops after the card header; offline-queued actions announce their queued state politely.
- **CP-3 (S4 queue)**: rows are a list — ↑/↓ moves rows; R records a phone outcome (opens the 3-outcome inline group: confirmed / declined / unreachable, ↑/↓ + Space); W records the unconfirmed dispatch with reason (reason field required, field-linked validation); D requests a day-of reminder on the focused row; expiry is announced on row focus ("expires in 40 minutes").
- **CP-4 (S1/S2 disruption)**: no-show (N) and cancel (C) are drawer actions with P04 level-2 confirms naming the consequence ("Cancel JOB-1007 — its pending confirmation is superseded"); reschedule reuses S; gate refusals surface as dialogs with the two honest paths as buttons (focus lands on the first path).
- **CP-5 (register/admin)**: standard list navigation; filters via chips with keyboard removal; exports via S8 buttons; settings form with labeled fields and on-blur validation.

## Focus order rationale

Per surface, focus follows the operating order: day header → lanes in reading order (inline-start lane first; in RTL the unassigned lane sits at the right edge and is focused first) → cards → card actions. The drawer's focus order is: title → state chip → gate chip → timeline → touchpoints → StateTransitionBar (actions last — the dispatcher reads state, then acts). The technician shell's order is: my-day stack → active card → state buttons (the next action is always within the first four stops — Waleed's stairwell rule, 02).

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Gate refusal (dispatch/close) | assertive | job code + gate state + the two honest paths |
| Validation (overlap, minimum window, malformed intake) | assertive | field/row-linked via described association, both windows named on overlap |
| Confirmation recorded (reply/waiver) | polite | touchpoint kind + outcome + actor |
| The Gate Clears (pending → confirmed) | polite | "JOB-1024: العميل أكد الموعد / customer confirmed" — never animation-only |
| State transitions (dispatched / checked in / started / paused / resumed / completed / closed) | polite | job code + new state, actor named |
| Touchpoint expiry (queue view) | polite on row focus | expiry as text, never a live countdown |
| Offline action queued / reconciled | polite | per-item state (P20) |
| Export ready / artifact expired | polite | artifact + expiry window |
| Autosave (intake) | polite | saving → saved (fades) |

Decorative lane recolors, drag ghost motion, tally increments, and the Gate Clears animation itself are NEVER announced — every state change carries its text equivalent in a visible surface (live regions pair with visible UI, a11y-baseline §4).

## Per-surface WCAG 2.2 AA checklist

- **S1 DispatchBoard**: lane = list semantics with row-count context on region entry (P19); drag has the ⌘↑/⌘↓ equivalent; > 40 cards/day virtualizes with focus preservation; state chips icon+text+color (05 palette contracts); gate chip focusable with expiry text; target sizes ≥24×24 (2.5.8); day header never covers focused cards (2.4.11 scroll-margin).
- **S2 JobCardDetail drawer**: timeline entries are text-complete (actor + action + time — never icon-only); touchpoint states use strikethrough+icon+label for superseded; the unconfirmed-dispatch record renders as a visible, permanent mark with its reason (not a tooltip).
- **S4 queue**: outcome recording is one interaction (no nested dialogs); terminal rows disable recording with the existing outcome as visible text (CONFLICT guard surfaced calmly); rows ≥44px tall.
- **S10 MyDayStack**: action buttons ≥44×44 (ux-guidelines row 22) with 8px spacing; state buttons are verbs-with-objects; address/asset-tag strings render own-script isolated (rtl-rules §2); offline banner is persistent non-modal (P20); no gesture-only affordance — every swipe has a button.
- **Forms (intake, schedule, settings)**: labels persist above fields (hint text inside the field is never the label — a11y-baseline §5); on-blur-or-submit validation with field-linked messages; error summary focuses first error; paste never blocked (3.3.8); autocomplete tokens declared for phone/name fields.
- **Overlays (drawer, dialogs, palette)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (board cards, queue rows, timeline) · pure-English render (en-preferred customer names, mixed-script titles like "Repair corridor lighting — Madarat building") · mixed strings inside Arabic chrome (Latin technician names أنوب جورج / Anoop George, the compound address "الربيع — مجمع الفيلات 12") · numeral rendering under the Western policy (windows, codes, tallies, phone fragments — never Arabic-Indic in system chrome) · embedded Latin tokens in RTL (JOB codes, AST tags) with bidi isolation (`dir="auto"` inputs, isolate marks on interpolations — rtl-rules §2) · tables/grids column order mirrored with alignment rules held (Jobs register at 360px collapses to cards) · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings (word-boundary ellipsis only) · 400% zoom reflow in one dimension on S1/S4/S10 both directions · drag direction mirrored with keyboard equivalence unchanged · the Gate Chip and gate glyph render identically mirrored (05 icon-flip record). Seeded fixtures (07c: JOB-1003 mixed-script title, Anoop George lane, the compound address) are the regression set.

## Reduced-motion contract (motion-language §5)

Crisp personality collapses to hard cuts + announcements: route changes are instant; the Gate Clears renders as an instant chip swap + the same polite announcement (perceivability never depends on the 140ms settle); drag ghost becomes instant position with the drop settling immediately; drawer opens without slide; tally changes are text-only. Every animated state change keeps its opacity-in-≤2-steps or instant+announcement equivalent — release testing matrix §8.6 runs the full board pass with reduced-motion enabled at identical budgets.
