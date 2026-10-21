# 06 — Component Needs: shift-swap-marketplace

SME-C/D pass · Shared primitives consumed (from the foundation) + the product's invented components. Each invented component declares its a11y and motion obligations explicitly (flagship discipline: nothing invented without a keyboard path, a screen-reader story, and a reduced-motion behavior).

## Shared primitives consumed

Button (verb-labeled, radius-12 controls, ≥44px on worker surface), TextField/Select/DateTime (inputmode declared on numeric fields — 05 integration record), Menu, Dialog/Sheet (focus-trapped, bottom sheets on mobile), Tabs (worker bottom navigation), Toast (P21 ladder, 3–5s auto-dismiss), Tooltip (console only — no hover on touch), Skeleton (P02, RTL-mirrored geometry), EmptyState (P01 four empties), FilterChips + SavedViews (P08, URL-serialized), Action Bar (P07 bulk-safe select), ActivityLog renderer (P17), DiffView primitives (P16 — policy simulation before/after ladders), JobRow/JobDetail (async-contract §7), NotificationInbox primitives (P21), CommandPalette (P05, bilingual normalized search), OfflineBanner + queued-write rows (P20).

## Invented components (9)

| Component | Purpose | Inventor's obligations (a11y + motion) |
|---|---|---|
| **FairnessLadder** | The ranked queue: candidate rows with rationale chips (seniority band, swap balance, rest compliance, recency), drill-down component rows; used in offer detail (rank preview), offerer queue, supervisor snapshot | Semantics: ordered list (`ol`) — rank is list position, announced as "المرتبة 2 من 5" / "rank 2 of 5" on row focus, never on every change; rationale chips are text + icon (never color-only); drill is a disclosure (`aria-expanded`) within the row; ladder mutations (rank deltas) announce politely on focus only. Motion: reveal cascade stagger ≤60ms capped at 5 rows (13 §B1); reduced-motion = rows render simultaneously, rank shown as text |
| **RationaleChip** | One fairness component as a readable fact: icon + label + value ("أقدمية: 3 سنوات" / "Seniority: 3 yrs") | Text carries the value (a11y-baseline §4 pairing); chips focusable with described-by drill text; duotone icon tone maps to contribution direction but text is the signal |
| **SwapHandshake** | The signature confirm choreography: two shift cards converge + copper weld line on match confirmation (13 §B2) | Pure decoration-free success semantics: the welded state is ALSO a state chip with the weld-mark icon + text "تم تأكيد التبديل" — motion never the only carrier (motion-language §5); reduced-motion = crossfade to chip; announcement assertive-once then polite summary |
| **RestRibbon** | Blackout visualization: horizontal 48h time ribbon around a target shift showing the worker's adjacent shifts and the protected minimum-rest windows as hatched no-go bands; violations render a named flag (13 §B3) | Ribbon is an SVG+text composite where every band has a text label and the violation flag is an alert region with the rule name; the ribbon is focusable as a figure with description; tap target per shift segment ≥44px; reduced-motion = bands render at final state (draw skipped), labels identical |
| **OfferCard** | Board card: shift facts, requester, site, time-to-start, qualification match state (visible-but-gated dimming for non-qualified — never hidden) | Gated state carries `aria-disabled` + reason text on the card (not on hover); card is a single focusable element with described-by details; settle-in motion 180ms (no spin-in); dimmed contrast still ≥3:1 for its text |
| **StatusLadder** | The worker's request lifecycle: queued → ranked → accepted → supervisor-approved → confirmed (or declined/expired/cancelled) as a vertical step strip with live rank delta | Step states are text + icon; current step announced politely on transition (instant-tier events only); ladder mirrors RTL (progress toward inline-end); focus lands on the changed step with delta text |
| **EligibilityPanel** | Pre-flight result panel (CP-1.3/CP-2.3): green (eligible) / amber (rule at risk, named) / red (blocked, rule named) with the exact rule quote and the policy sheet link | Color never sole carrier — each state has icon + heading text; amber names the rule and the hours math in words; panel focusable, announced on open (polite); link to policy sheet is in tab order |
| **PolicySheet** | Worker-readable fairness policy + blackout rules, versioned, bilingual (S9) | Rendered as a definition list (component → weight → plain-language effect); version announced in the heading; numerals Western; printable/exportable as accessible text (not image) |
| **WeldMarkBadge** | The reserved confirm glyph (⊨ double-line) + "covered" state for confirmed swaps in schedule/board surfaces | Semantic reservation enforced: never used for pending states; badge = icon + text pair; contrast ≥3:1 as UI component |

## Reused-with-a-twist (documented deviations)

- **BottomTabBar (worker surface)**: standard tab primitive with RTL-mirrored order and 44px+ targets; badge counts follow the P21 class tiers (only instant-tier classes badge — digest classes never badge, preventing fake urgency).
- **QueueTable (console)**: standard table + P18 keyboard grid (arrow navigation, range select); row aging is a text badge + sort, never a red pulse (calm accountability, 02); bulk-select action bar (P07) enables bulk approve for zero-flag matches only — flagged rows are excluded from bulk with a visible reason (CP-4 edge case).
- **DateTimeSheet (post-a-swap)**: standard date-time picker wrapper with dual-calendar awareness (P24) where workspace-enabled; Hijri presentation per portfolio default Q-5 with method disclosure.
- **PasteImportSheet (S16)**: standard paste textarea + column-mapping preview; row-level validation errors quote the offending row (never silent drop); the whole flow is the LOOP-5 manual-alternative primary path (08).

## Layer-3 token additions (token-architecture §3)

`ladder.row.state.*`, `rationale.chip.tone.*`, `ribbon.band.blocked/protected/shift`, `handshake.weld.color` (→ accent.primary), `offercard.gated.opacity`, `statusladder.step.*`, `eligibility.panel.tone.*`, `policy.sheet.heading`, `weldmark.badge.*` — each binds to Layer 2 semantic tokens declared in 05's contrast ladder; no raw values anywhere above Layer 1.

## Icon metaphor ledger (rtl-rules §2 record)

Flip in RTL: swap arrows (⇄), send/request glyph, next/previous chevrons, external-link arrow. Never flip: clock (shift times), shield (blackout rule), scale/balance (fairness policy), weld-mark (⊨), magnifier (console search), calendar. Justification: flipped glyphs are directional metaphors; unflipped are physical-object or semantically anchored metaphors — recorded per rtl-rules §2 requirement.
