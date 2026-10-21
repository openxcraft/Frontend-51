# 09 — Accessibility: helpdesk-triage-desk

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions, 1280px and 360px viewports, 200%/400% zoom. The product's structural a11y problem is also its identity: **a fast, dense, keyboard-first queue where severity and SLA states must never ride on color or motion alone** — solved below as the queue focus contract.

## Keyboard map (critical paths; no raw-letter shortcuts — Arabic-layout conflict class, a11y-baseline §3)

| Surface / path | Keys | Behavior |
|---|---|---|
| Global | ⌘K / Ctrl+K | Command palette: bilingual normalized search (rtl-rules §4) over tickets (number + subject), clusters (labels), queues, routing rules, filter presets; recent items |
| S2 triage queue (CP-1) | ↑/↓ · Enter · Space · ⌘↓ / ⌘↑ · / | Row traversal (virtualized — focus moves scroll into view, never the reverse, P19); Enter opens ticket detail; Space toggles bulk-selection (P07); ⌘↓/⌘↑ jump to next **P1-or-at-risk** row; `/` focuses search |
| S3 ticket detail | Tab · Escape · ⌘R | Tab order: subject/body (reading surface, at its own direction) → language chip (override menu) → assessment panel (signals) → cluster membership → routing trace → response/disposition actions → notes → activity. Escape closes any open panel menu and returns focus to its trigger; ⌘R focuses the route action |
| S3 routing (CP-3.2) | Tab · Enter · ⌘Enter | Queue picker is a menu of radio options (arrow-traversable, wrap off); manual-method reason field auto-focuses when method switches to manual; ⌘Enter commits the route (the Handoff Settle fires with its announcement) |
| S4/S5 clusters (CP-2) | ↑/↓ · Enter · ⌘C | Board cards arrow-traversable (grid semantics, P18); Enter opens the editor; ⌘C on a **proposed** card focuses the confirm control (the P15 gate is one chord away, never buried); term editor fields Tab in order ar-terms → en-terms → threshold |
| S5 confirm gate (CP-2.4) | Tab · Enter | Confirm requires focus on the confirm control itself — never fires from a dialog default; the gate names what becomes authoritative before the action |
| S6/S7 consoles (CP-6) | Tab · ⌘S · ⌘Enter | Rule/policy editors: field-order tabbing, blur validation (skill row 56), error summary on save focuses the first error; ⌘S saves; deactivation is a labeled toggle, not a delete key |
| S8 SLA monitor (CP-4) | ↑/↓ · Enter | Hot list and breach ledger rows focusable; Enter jumps to the ticket detail with the timeline section focused; counts render in a definition table for screen readers |
| S9 queues & members | ↑/↓ · Enter | Standard list traversal; capability toggles are checkbox groups |
| S10/S11 jobs, bindings, settings | Tab · Enter | JobRow cancel/retry keyboard-complete; verify/revoke on bindings are explicit buttons with confirmation surfaces |

Every shortcut has a visible button/menu equivalent; focus-visible is the Nazim Cobalt ring at 2.4.13 strength (≥2px, ≥3:1 change-contrast — 3.29:1 on canvas, cobalt-ink 10.39:1 on tint surfaces, ≥ area of a 2px outline) on every interactive element; sticky queue headers clear focused rows (2.4.11 — scroll-margin token obligation); modals/popovers trap-free with focus return (a11y-baseline §3).

## Focus order & the queue focus contract

Reading order in the console chrome is the workspace's active direction (LTR default, mirrored fully on locale flip — 05). Inside S3 ticket detail, the reading surface (subject/body) renders at the ticket's own detected direction while focus follows the chrome's reading order — focus and content direction are independent (the pane-direction discipline of the family applied to a single-message surface: an RTL body inside the LTR console is a labeled region "المحتوى — العربية" exposed via `aria-labelledby`, never force-flipped, never reordered by focus). The queue's single focus target per row carries the row announcement (number + severity + SLA state + language) so a screen-reader user hears the row's meaning before interacting; severity and SLA states are announced as words ("P1 — at risk, first response due in 2 minutes"), never as color or icon alone.

## Live-region announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Queue region entry | polite | "28 tickets in view, 1 P1, 3 at risk" (row-count context, P19) |
| Ticket focused | polite | number + severity + language + SLA state |
| Language detected on intake | polite | "Detected Arabic — 12 of 40 in this batch" |
| Clustering run started / completed | polite | engine label + counts ("Keyword engine clustered 18 of 22 — 4 need a human") |
| Proposal arrived (assist) | polite | "Proposed cluster: Refund delay — 11 tickets, 7 Arabic, 4 English. It waits for your confirmation" |
| Cluster confirmed (P15) | polite | "Cluster confirmed — 11 assignments became authoritative, by [actor]" |
| Route committed (the Handoff Settle) | polite | "Routed to Payments by rule R-04 — first response due 12:40" |
| Severity overridden | assertive | "Severity overridden to P2 — reason recorded" |
| At-risk transition | polite | "TK-0142 first response is at risk — 2 minutes remain" |
| Breach | **assertive** | "First response breached on TK-0163 — the timeline is in the ledger" |
| Escalation recorded | assertive | "Escalated to P1 and routed to Payments — reason recorded, lead notified" |
| Validation error (any editor) | assertive | field-linked message; error summary focuses first error on submit (a11y-baseline §5) |
| Binding health change | polite | "The contact-form channel failed at 22:40 — intake on it is paused; pasting works" |
| Export ready | polite | formats + expiry |
| Countdown digits / row hover | never | data and affordance, not announcements |

Live regions pair with visible equivalents — every announcement above has a visible surface (row state, monitor strip, gate bar, toast) per a11y-baseline §4.

## Per-surface WCAG 2.2 AA checklist

- **S2 queue (the dense one)**: rows ≥44px hit height with ≥24×24 targets (2.5.8); severity = glyph + tier word + weight, never color alone (05 palette contracts); SLA countdown in tabular figures as text; mixed-script subjects bidi-isolated (rtl-rules §2); truncation at word boundaries with worst-case Arabic ("مستشارو التدقيق والحوكمة" — rtl-rules §5); virtualization preserves focus (P19); drag has no place in the queue (ordering is policy-driven, 2.5.7 satisfied trivially — the cluster board's card focus is arrow-traversal, no drag API).
- **S3 ticket detail**: body at own direction with labeled region; assessment signals as definition rows (screen-reader-equal inspectability); override fields require reason (validation announced assertively); activity log is a focusable list with jump links.
- **S4/S5 cluster surfaces**: bilingual labels at own directions in bidi-isolated lines; the confirm gate names counts before the action; term editor validates on blur with field-linked errors; proposal vs confirmed is text + ink, never hue alone (violet vs cobalt duplicated by the words "proposed"/"confirmed").
- **S6/S7 consoles**: matrix cells are buttons with state text; policy edits' re-assessment consequence is announced before save (the "re-computes findings" honesty, CP-6.1); version history is a table, keyboard-navigable.
- **S8 monitor**: counts in definition tables (never heatmap-only); at-risk threshold declared in text; breach timeline rows focusable and announced.
- **S10/S11**: binding health as text + icon; usage figures tabular; consent surfaces in capability language; no cognitive-function tests anywhere (3.3.8 — paste never blocked).
- **All surfaces**: labels persist beside fields — never inside them as ghost text (a11y-baseline §5); autocomplete tokens on requester-name/email fields (skill row 58); 400% reflow without one-dimensional horizontal scroll (skill row 69) — queue collapses to stacked cards at 360px (skill row 71).

## RTL/LTR verification matrix (per surface, both chrome directions)

For each of S1–S11, both directions: pure-Arabic render (ticket bodies, cluster labels, queue names at own direction) · pure-English render · mixed strings (Latin runs inside Arabic bodies — seeded TK-0146 is the fixture) · numeral rendering under Western policy inside Arabic chrome · embedded Latin tokens (ticket numbers "TK-0142") bidi-isolated with physical order stable (rtl-rules §4) · tables/grids mirrored (queue columns, policy matrix, version history) with alignment held · forms (cluster editor label/error placement on the correct inline edge) · truncation at 320px container with worst-case strings · 400% zoom reflow · bidi isolation on user-generated content (subjects, bodies, notes). Chrome-flip fixtures: the full mirrored re-render (rail, queue column order, SLA progress direction, pagination) is exercised by locale toggle in the mock's seeded session; ticket-body direction is content-driven regardless of chrome (05 direction model).

## Reduced-motion contract (motion-language §5)

Crossfades → hard cuts; the Handoff Settle (T2 signature) → chip and row render instantly in place, queue count updates, and the announcement carries the full decision ("Routed to Payments by rule R-04 — first response due 12:40"); proposal arrival → instant with polite announcement; confirm-gate flip → instant state change with the confirmation announcement; press feedback → opacity step ≤2. All state changes remain perceivable by construction — the announcement schedule is the reduced-motion equivalent of every animated transition, and no information ever travels by motion alone (a11y-baseline §4).
