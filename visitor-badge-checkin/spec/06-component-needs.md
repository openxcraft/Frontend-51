# 06 — Component Needs: visitor-badge-checkin

## Shared primitives consumed

Button, Menu, Dialog, Tabs (desk rail sections; kiosk has NO tabs), Tooltip (desk only — kiosk forbids hover affordances), Toast (desk only), Skeleton (desk lists; kiosk welcome is cached, never a skeleton), EmptyState, FilterChips (P08 — state/host/purpose filters), JobRow (exports/sweeps), CommandPalette (P05, desk), DateRangeField (visit windows, Gregorian, both-direction rendering), AutosaveIndicator (P10 — spec editor + composer).

## Invented components (8)

| Component | Purpose | Obligations |
|---|---|---|
| **KioskFlowStep** | one question per screen with step count ("Step 2 of 3"), giant labels (Almarai 800 at confirmation), ≥56px primary targets, ≥12px gaps | Focus order enforced (form → primary action → secondary); every step SR-announced on entry (polite); input `dir="auto"` with bidi isolation; back action is a real button with focus return; idle-timeout resets to welcome with a polite announcement; keyboard path exists for receptionist-assisted mode (09) |
| **CheckInCodePad** | the six-character code entry: large numeric-capacity field with code-grouped display, camera-scan affordance, and "no code? walk in" escape | Code renders tabular figures LTR always (an alphanumeric code is a Latin-script token — rtl-rules §2); scan and type are the same lookup; failure copy names the next action; auto-submit on 6th character is OFF by default (deliberate — premature submit is the standing-visitor's worst moment) |
| **HostPickerField** | searchable host selection with Arabic normalization (alef/hamza, taa marbuta/heh, yaa forms — rtl-rules §4), normalized-match disclosure | Search input `dir="auto"`; results announce count on region entry; normalization rule disclosed at point-of-use (ai-native-patterns §7.4 discipline applies to deterministic matching too); "host not listed → add host" is an inline action, not a dead end |
| **TodayBoardColumn** | the board's three zones (expected next / in-building now / recent arrivals) + derived no-show strip | Zone semantics as labeled regions; visit rows are focusable with named actions (badge, notify-again, check-out); counts as text in every zone header (never color-only); in-building durations tick in text, never by animation (minimal motion); column order mirrors in RTL |
| **VisitTimeline** | append-only event rail per visit (created, notified ×channel, checked-in, badge issued/voided/corrected, checked-out, swept) | List semantics, newest-first with a toggle; each event carries actor+timestamp+channel as TEXT; correction chains render as linked entries (voided-by → replacement) with focus-follows-chain action; log-style density with row-count context on region entry |
| **BadgeSpecEditor** | the studio's field toggles, band mapping, direction variant, stock size, and live validation issues | Field-level validation messages linked by described association; both direction variants must validate before activation (05 obligation); band picker enforces the deep-variant lock (type text never renders on band amber); version badge + autosave (P10); save conflict surfaces both versions (P10/P04) |
| **BadgePreviewCard** | deterministic preview of the spec with sample or real visit data, per direction, text-first | Preview is a semantic description list (field → value), not an image-only render — SR parity by construction; worst-case long-name fixture toggle (مستشارو التدقيق والحوكمة class); preview re-renders per direction on toggle; the band strip and code render exactly as the artifact will |
| **ReturningVisitorConfirm** | the "we met you on 12 Oct — same details?" candidate match surface | Match is offered, never applied silently (P15-shaped discipline on a deterministic suggestion); normalized-name disclosure ("مطابقة بعد التطبيع"); each candidate requires explicit confirm; declining falls through to the manual form with typed data preserved |

## Layer-3 token additions

`kiosk.step.target.*` (≥56px primary / ≥44px secondary + gap floors), `kiosk.confirm.name-display.*` (Almarai 800 lock), `badge.band.{guest|vendor|contractor|interview|vip}.*` (strip + deep text variants per 05 contracts), `badge.field.{name|host|company|date|validity|code}.*`, `visit.state.{expected|checkedin|checkedout|noshow|void}.*` (icon+shape+text, amber no-show text forces amber-deep), `code.display.tabular.*` (LTR-pinned tabular figures), `board.zone.*` (column border-weight steps). All are Layer 2 re-binds of the 05 palette — no raw values (token-architecture §1).

## Reused-with-twist

- **EmptyState**: S1 first-run is interactive — "load the sample day" seeds four fixture visits so the board, timeline, and badge lineage read before any real guest (P22; CP non-happy path).
- **FilterChips**: state/host/purpose filters on S2/S5; removable chips carry an accessible predicate description; the no-show zone is a filter chip, never a hidden default.
- **JobRow**: export/retention/sweep jobs; the end-of-day sweep renders as a VISIBLE job with counts ("checked out 1 visit left open at 18:05"), never a background mystery (03 CP-3 edge).

## Icon-flip decisions (rtl-rules §2; recorded per component)

- **Flip in RTL**: back/forward arrows (kiosk back, timeline pagination), the "advance toward inline-end" chevrons in the composer's step indicator, external-link arrows on notification links.
- **Never flip**: badge glyph, host person-pulse glyph, code hash-mark, void slash (semantic anchors); clock/validity glyphs; the check-out door glyph mirrors by DOOR-side convention only if the regional convention demands — recorded as an implementation-time decision with the default "no flip" (a door reads the same both ways).
- **Kiosk language toggle**: a pill with the two script labels "ع / EN" — scripts never mirror, the pill's position travels with direction (inline-start).

## Deviations recorded

- Fully-rounded kiosk language toggle inside density-B system: declared exception (05) — the one control a standing visitor must never miss.
- Kiosk mode disables Tooltip/Toast hover-dependent affordances entirely: feedback is inline text + announcements (09), not transient chrome.
