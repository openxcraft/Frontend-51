# 06 — Component Needs: loyalty-stamp-card

## Shared primitives consumed

Button (pill), Menu, Dialog (confirm ladder only — P04 levels 2/3), Tabs (studio policy tabs; console rail), Tooltip, Toast, Skeleton, EmptyState, FilterChips (P08 — members/audit filters), JobRow, ActionBar (bulk member export selection, P07), CommandPalette (P05), AutosaveIndicator (P10 — studio drafts), QuotaMeter (export artifacts window only — P14).

## Invented components (12)

| Component | Purpose | Obligations |
|---|---|---|
| **StampDotCluster** | the card's stamp dots: pending slots (rose tint) and earned stamps (Wafa Rose fill) in fill order inline-start → inline-end per direction | Dots are graphics at declared contrast (3.08:1 on tint — 05 contract); fill order mirrors in RTL; count text "6 من 8" renders beside in ink (Western numerals — the count is never color-only); the Stamp Landing is the one signature motion (05); SR: "ختم 4 من 8" polite on commit; target ≥44px on tablet view (2.5.8 exceeds) |
| **StamperSearch** | one field resolving members three ways: QR scan payload, 6-char short code, normalized phone/name search | Normalization disclosed (alef/taa-marbuta/yaa rules + phone digit stripping — rtl-rules §4); bidi-isolated rendering of mixed-script results; keystroke-to-paint ≤16ms (10); results are listbox semantics with arrow navigation; Enter resolves the top match; Esc clears and returns focus to the field |
| **MemberCardSheet** | the counter result: identity (masked phone), card face, tier ladder, state badges, stamp/redeem actions | One-hand operable (≥56px action targets tablet); state badges icon+text (expiring-soon amber-deep, blocked red, one-away rose-deep); actions disabled-with-reason, never hidden; CONFLICT re-fetch is one tap; the sheet is a dialog with focus trap + return (a11y-baseline §3) |
| **TierLadderEditor** | studio rows: stampsRequired stepper + nameAr + nameEn side-by-side (P23 columns) + final-tier mark | Both locales required — the blank-locale VALIDATION names the row and side; ascending stampsRequired enforced live; final tier must equal stampCount; alignment links between the two name fields; locale fields render at their own direction in isolation |
| **CardPreview** | live dual-direction card face: Arabic face and English face tabs, stamp dots, tier ladder, program names | Renders from program state only (never mock art); both directions true render (not mirrored CSS hacks); preview stage = raised surface, card carries the deepest soft-lift; numerals Western in both faces |
| **RewardRedeemPanel** | redeemable tiers on the card sheet/counter: tier name (member locale + other script secondary), redeem action with reset semantics | Redeemable = green-deep chip icon+text; P04 level-2 confirm names tier + reset consequence; receipt line renders bilingually post-commit; mid-tier vs final-tier semantics stated in the confirm itself; concurrent-redemption CONFLICT re-fetch in place |
| **AuditTrail** | the immutable ledger surface: actor, action kind, member, time; filter chips (actor/kind/date) | P17 grammar — active voice, named actors ("أمينة ختمت بطاقة نورة العتيبي"); rows keyboard-navigable; >200 rows virtualize (P19); timestamps Western numerals, timezone declared; no deletion affordance anywhere (append-only posture) |
| **FlagBoard** | deterministic threshold flags: staff ≥3 adjustments / 24h; member ≥2 cap-blocked attempts / 7d | Flags are computed counts with their thresholds written on the chip ("3 تعديلات خلال 24 ساعة"); each flag links to its filtered AuditTrail view; icon+text, never color alone; flags refresh with the ledger, no polling motion |
| **ExpiryBadge** | card states: active / expiring-soon (≤30 days) / expired | Amber-deep text + clock glyph (flips per direction rules — 06 flip table); the expiry date renders Western numerals; expired carries the honest consequence line (unredeemed tiers lost) |
| **PassQR** | the member's QR + short code display: on the pass view, on the counter sheet, and the printable join sheet | QR is the identity token — never the stamp authority (stamps are staff-sessioned; 00); short code renders LTR-isolated inside RTL chrome (rtl-rules §2 mixed-direction rule); print sheet carries both scripts and stock-safe geometry (08 N2 manual path) |
| **InsightsCounters** | deterministic stat tiles: stamps issued, redemptions, tier mix, adjustments by reason, active members, undo rate, completion rate | Every tile discloses its arithmetic in an expandable panel (the number visible, the formula one action away); counts Western numerals; floored percentages, never rounded up; zero-count on draft programs renders the honest draft notice |
| **OnboardingChecklist** | P22 value milestones: publish a bilingual card, stamp the first member, read the day's count | Each item links into its flow (S3, S2, S1); completed items check with calm state change; clears in one action and never returns; no tours-of-balloons |

## Layer-3 token additions

`stamp.dot.pending.*` / `stamp.dot.earned.*` (tint vs primary bindings + the landing motion token), `tier.row.name-ar.*` / `tier.row.name-en.*`, `tier.chip.redeemable.*` / `tier.chip.redeemed.*`, `card.face.*` (pass + studio preview share the face tokens), `pass.qr.sheet.*`, `audit.row.actor.*` / `audit.row.kind.*`, `flag.chip.*`, `expiry.badge.*`, `insight.tile.formula.*` — all Layer 2 re-binds of the 05 palette; no raw values above Layer 1 (token-architecture §1).

## Icon flip decisions (rtl-rules §2)

Flip in RTL: undo arrow, next-tier chevron, timeline-advance arrow, expiring clock hand (directional reading of time-left), lookup magnifier-with-caret. Never flip: stamp seal, QR glyph, coffee/cookie/gift tier glyphs (semantic anchors), phone glyph, card-face emblem. The stamp seal's rounded-square mount is direction-free by construction (symmetric). Decisions recorded here per the rtl-rules §2 mandate; 09 carries the verification matrix.

## Deviations recorded

- Pill radius D everywhere is the ledger family — no exceptions to declare (chips are pills by family, not by P08 exception).
- The counter tablet view raises action targets above the 24px minimum to 56px (one-hand-at-the-register); declared per 2.5.8's spacing-aware exception note rather than as a density deviation.
- MemberCardSheet uses a dialog on desktop but a bottom sheet on the tablet view — same semantics, same focus contract, geometry adapts; recorded so the a11y pass tests both geometries.
