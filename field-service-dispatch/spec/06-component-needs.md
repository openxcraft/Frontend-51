# 06 — Component Needs: field-service-dispatch

## Shared primitives consumed

Button, Menu, Dialog, Tabs (day/register views), Tooltip, Toast, Skeleton, EmptyState, FilterChips (P08 — state/priority/date filters as removable chips), JobRow, ActionBar (bulk confirmation requests, P07), CommandPalette (P05), AutosaveIndicator (P10 — intake form), OfflineBanner (P20 — technician shell), QuotaMeter (P14 — confirmation sends when a channel is bound; NO meter renders on the phone path by design).

## Invented components (9)

| Component | Purpose | Obligations |
|---|---|---|
| **DispatchBoard** | the operating day: technician lanes + unassigned lane; drag-and-drop scheduling; day header with dual-calendar chip (P24) + confirmation tally | Lane drag has keyboard equivalent (S schedules focused card; ⌘↑/⌘↓ moves card between lanes — 2.5.7); board is a grid of lists semantically (lane = list, card = listitem, SR row-count context on region entry, P19); overlap refusal announces assertively and names both jobs; cards > 40 per day virtualize; tally is always text ("مؤكدة 8 من 12") never color-only |
| **JobCardTile** | the board card: code, title, window, state chip, gate chip, priority mark, customer name | State = icon+text+color (05 palette); gate chip is focusable with expiry announced; card is one target for open-detail and a separate visible button for the primary lane action (never nested interactive targets); truncation at word boundaries (rtl-rules §4) with worst-case Arabic titles seeded; Western numerals |
| **LifecycleTimeline** | append-only event list on the job detail: state events + touchpoint events, actor, timestamp, source (board/mobile/touchpoint) | Reverse-chronological with anchored oldest-first toggle; every entry has text (actor + action + time) — never icon-only; timestamps in workspace locale with dual-calendar on hover (P24); keyboard-scrollable list; correction events (e.g., resumed-after-pause) render inline with the event they answer |
| **GateChip** | the confirmation gate state on a card/touchpoint: awaiting / confirmed / declined / expired / superseded + unconfirmed-dispatch mark | Icon+text+color always; expiry countdown as text ("تنتهي بعد 40 دقيقة"); the Gate Clears micro-interaction lives here ONLY (05); assertive announcement on gate refusal with the two honest paths as buttons; superseded state renders strikethrough + icon (never color alone) |
| **TouchpointQueueRow** | one touchpoint in the confirmation queue: customer, job, window, state, channel, expiry, outcome actions | Phone-outcome recording is a 3-button inline group (confirmed / declined / unreachable) — one click, no dialog; recording is disabled once terminal (CONFLICT guard surfaces calmly); rows sorted expiry-first; day-of reminder action available per row; queue virtualizes > 200 (P19) |
| **MyDayStack** | technician mobile: job-card stack ordered by window; active card pinned with current state + next-action button | One-thumb: primary action button ≥44×44 (ux-guidelines row 22); state buttons are verbs-with-objects ("تسجيل الوصول" not "موافق"); pause reasons are one-tap chips + optional note; offline actions queue with per-item state (P20) — queued state visible as text; address/direction rendered own-script isolated; no desktop chrome on this surface |
| **WindowField** | schedule control: date + start/end with minimum-window validation and conflict feedback | Field-linked validation naming the minimum and the conflicting job (03 CP-1); dual-calendar date picker (P24) with active system explicit; times in 24h Western numerals; conflict surface offers the three resolutions (new window / new technician / shorter window) as buttons |
| **DayHeader** | the board's masthead: date (dual calendar), confirmation tally, lane-load summary, policy link | Tally is text counts (confirmed/declined/expired/unanswered); policy link opens the confirmation-policy disclosure at point-of-use (04 IA decision); day navigation prev/next/next-with-pending-gate — all keyboard-reachable |
| **StateTransitionBar** | the drawer's action bar for the focused job card: the legal next transitions as buttons, illegal ones absent (never disabled-littered) | Buttons render only legal transitions per the 07b state machine (adapter is authority — the UI never guesses); each names its gate requirement inline when one applies; destructive transitions (cancel) use P04 level 2 naming the consequence; dispatcher and technician roles see their own action sets |

## Layer-3 token additions

`jobcard.tile.state.*` (per-state chip bindings from the 05 palette — text-safe vs icon-duty variants), `jobcard.tile.gate.{awaiting|confirmed|declined|expired|superseded}.*`, `gate.chip.clear.*` (the Gate Clears interaction states), `board.lane.selected.*` (tint + border-step), `board.dayheader.tally.*`, `touchpoint.row.outcome.*`, `myday.action.*` (44px mobile action bindings), `window.field.conflict.*` — all Layer 2 re-binds of the 05 palette; no raw values above Layer 1 (token-architecture §1/§3).

## Reused-with-twist

- **EmptyState**: S1 first-run offers the sample day (loads the seeded fixture day so the gate, the queue, and a completed journey are experienceable before real intake — P22 value checklist, CP non-happy path).
- **OfflineBanner + queue**: technician shell only; dispatcher shell gets the P20 list-fetch banner variant (the board never fakes live state — last-known + timestamp).
- **QuotaMeter**: renders ONLY when a messaging channel is bound and its send quota is surfaced; the phone-confirmation path never renders a meter (the manual path must not read as rationed — mirrors the seo-brief-builder deterministic-mode rule).

## Icon-flip decisions (rtl-rules §2, recorded)

- **Flip in RTL**: lane-advance chevrons, day-navigation arrows, "open detail" chevron, send/next glyphs on touchpoint copy actions.
- **Never flip (semantic anchors)**: the gate barrier glyph, job-ticket glyph, clock/window glyph, check badges, slash badges, hourglass, map-pin (address display), phone, technician glyph. The gate glyph is the product's signature mark and is direction-free by construction (a half-open barrier reads identically mirrored — tested in the 09 matrix both directions).
- **Physical-metaphor decision recorded**: the ticket/job-card glyph keeps its notched-inline-start edge mirroring with direction (the notch is a physical tab metaphor — regional convention is symmetric, so the glyph mirrors with the layout without meaning change; recorded here per rtl-rules §2 requirement).

## Deviations recorded

- Fully-rounded removable filter chips inside radius-B system (P08 semantic exception, declared in 05).
- MyDayStack action buttons at 44px exceed the desktop 24px floor deliberately (mobile touch surface; ux-guidelines row 22 adopted).
