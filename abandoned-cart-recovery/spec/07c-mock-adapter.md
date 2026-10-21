# 07c — Mock Adapter: abandoned-cart-recovery

In-memory, deterministic, zero external dependencies. Implements `AbandonedCartAdapterV1` (07b, all 33 operations) over the entities of 07a. No randomness, no network, no wall-clock reads, no timers beyond the declared cadences; identical call sequences produce identical state — the determinism contract is the mock's own test oracle, and `previewSchedule` and the live scheduler share one arithmetic (07b rule 1).

## Seed dataset (fixed, named)

**Workspace** — `ws-001` **"Dar Yamama Home Living"** (دار يمامة للمنزل): defaultLocale `en` (bilingual-en proposal, LOOP-6), currencies `['SAR']`, abandonmentThresholdMinutes `60`, valueNormalizer `1000`, defaultQuietHourRowId `qh-row-default`. The workspace carries flag `sample: true` — the whole seed IS the first-run sample set (P22: carts, sequences, a deferred send, a recovered cart, a suppressed shopper); the S1 empty state (11) offers it, `clearSample()` retires it permanently for the session, and `reset()` restores it (test-support, below). Storefront name used by the `{{store_name}}` variable: "Dar Yamama" / "دار يمامة".

**Members** (auth-agnostic, 07b Session): `mem-001` Faisal (operator, locale en — the default session), `mem-002` Dana (owner), `mem-003` Nayla (viewer — the read-only seat), `mem-004` Karim (operator). All fixtures below were acted by these four; no other actors exist.

**Fixed seeded clock**: `now = 2026-10-19T10:30:00Z` (a Monday). Every timestamp in the seed is an absolute instant derived from this anchor; the clock advances ONLY through the declared test-support actions (§A, rule 1). Local-time conversion uses the fixed offset table (§A): `Asia/Riyadh +03:00` (no DST), `Asia/Dubai +04:00` (no DST), `America/New_York −04:00` (EDT; the mock's table carries the Nov 1 2026 transition to −05:00), `America/Chicago −05:00` (CDT; same transition date). Zones outside the table → VALIDATION naming the zone (a deterministic refusal, honest for a mock). All seeded instants sit inside Oct 12–26 2026, where the table is exact.

**Quiet-hours policy** `qhp-001` (version 2; rows versioned individually, all at row version 1 in the seed):

| row id | jurisdiction | window | source label |
|---|---|---|---|
| `qh-row-us-fed` | `US-FED` | 08:00–21:00 | statutory anchor — "47 CFR 64.1200(c)(1)" (the row 03's prose calls the "US-TCPA row") |
| `qh-row-us-fl` | `US-FL` | 08:00–20:00 | statutory anchor — "Florida/Oklahoma stricter band (TCPA)" |
| `qh-row-us-tx` | `US-TX` | 09:00–21:00 | statutory anchor — "Texas seven-day band" |
| `qh-row-ksa` | `KSA` | 09:00–21:00 | workspace policy — "no retrieved statutory hour rule for KSA" |
| `qh-row-are` | `ARE` | 09:00–21:00 | workspace policy — "no retrieved statutory hour rule for UAE" |
| `qh-row-default` | `DEFAULT` | 09:00–21:00 | workspace policy — "fallback for unmapped jurisdictions" |

**Sequences** (4):

1. `seq-001` **"Standard 3-step"** — status `active`, version 3 (v1 created Oct 8, paused Oct 12, re-activated Oct 13, step edit forked and promoted to v3 Oct 17 — the version history fixture), consentBasis `any`, expiryHours 72. Steps (delays are cumulative offsets from the anchor, §E rule 5):

   | step | delayMinutes | channelKind | template (pinned version) | incentiveRef |
   |---|---|---|---|---|
   | 1 | 60 | email | t-001 v2 | — |
   | 2 | 1440 (24h) | email | t-002 v1 | — |
   | 3 | 4320 (72h) | email | t-003 v1 | inc-001 (free-shipping, mid band) |

   Step 1's seeded default renders in the studio with the honest note "defaults are editable policy — vendors disagree" (06, 12 Q-9): the 60-minute first-touch default carries the Omnisend-vs-Klaviyo contest visibly (01 q7).
2. `seq-002` **"High-value ladder"** — status `active`, version 2, consentBasis `any`, expiryHours 72. Steps: 30 min rich-message t-004 v1 · 1440 min email t-005 v1 + inc-002 · 4320 min plain-text t-006 v1.
3. `seq-003` **"Low-band single-touch"** — status `draft`, version 1, consentBasis `consent-only`, expiryHours 48, one step (120 min, email, **t-007** — a DRAFT template). The activation-gate fixture: `setSequenceStatus → active` refuses with the named rule "step 1 binds template t-007 which is not approved" (07b rule 3).
4. `seq-000` **"Old aggressive chaser"** — status `retired`, version 2, consentBasis `any`, expiryHours 24 — retired Oct 10 (activity `sequence-retired`); `listSequences` filter `status: [retired]` finds it.

**Templates** (8, bilingual by construction; subjects ≤60 chars, bodies ≤900; variables in double braces; the known variable set is exactly `first_name, cart_items, cart_total, checkout_url, store_name, discount_code`):

- `t-001` **"Cart reminder — friendly"** — email, approved, origin `stock`, version 2 (v1 is the generation base). EN subject: "{{first_name}}, your cart at {{store_name}} is waiting" · EN body: "You left {{cart_items}} in your cart — total {{cart_total}}. It is saved and ready whenever you are.\nFinish checkout: {{checkout_url}}\nThe {{store_name}} team" · AR subject: "سلة {{first_name}} في {{store_name}} بانتظارك" · AR body: "تركت {{cart_items}} في سلتك — بإجمالي {{cart_total}}. محفوظة وجاهزة متى جهزت.\nأكمل الشراء: {{checkout_url}}\nفريق {{store_name}}". Variables: the five minus discount_code.
- `t-002` **"Still thinking it over"** — email, approved, stock, v1. EN subject "Still thinking it over, {{first_name}}?" · EN body "No rush — your selection is still saved. If anything made you hesitate, reply and tell us; a person reads every message.\nYour cart ({{cart_total}}): {{checkout_url}}" · AR subject "ما زلت تفكر يا {{first_name}}؟" · AR body "لا استعجال — اختيارك ما زال محفوظاً. إن كان شيء ما يجعلك تتردد، ردّ وأخبرنا؛ شخص حقيقي يقرأ كل رسالة.\nسلتك ({{cart_total}}): {{checkout_url}}".
- `t-003` **"Last call — shipping on us"** — email, approved, stock, v1; variables include `discount_code`. EN subject "Your cart closes soon — shipping on us" · EN body "This is the last note about your cart ({{cart_items}}). Complete it within a day and shipping is on us with code {{discount_code}}.\n{{checkout_url}}" · AR subject "سلتك تُغلق قريباً — والشحن علينا" · AR body "هذه آخر رسالة عن سلتك ({{cart_items}}). أكملها خلال يوم والشحن علينا بالرمز {{discount_code}}.\n{{checkout_url}}".
- `t-004` **"Your selection is waiting"** — rich-message, approved, stock, v1. EN subject "{{first_name}}, we held your cart at {{store_name}}" · EN body "We saved {{cart_items}} for you — {{cart_total}}. Tap to finish: {{checkout_url}}" · AR subject "{{first_name}}، حفظنا سلتك في {{store_name}}" · AR body "حفظنا لك {{cart_items}} — بقيمة {{cart_total}}. انقر للإكمال: {{checkout_url}}".
- `t-005` **"A small thank-you for coming back"** — email, approved, stock, v1; variables include `discount_code`. EN subject "Your cart, plus 15% off as our thank-you" · EN body "Complete your cart within 24 hours and use code {{discount_code}} for 15% off — our thank-you for coming back.\n{{cart_items}} — {{cart_total}}\n{{checkout_url}}" · AR subject "سلتك، وخصم 15% شكراً لعودتك" · AR body "أكمل سلتك خلال 24 ساعة واستخدم الرمز {{discount_code}} لخصم 15% — شكراً منا لعودتك.\n{{cart_items}} — {{cart_total}}\n{{checkout_url}}".
- `t-006` **"Final hours"** — plain-text, approved, stock, v1. EN subject "Final hours for your cart" · EN body "{{first_name}} — your cart expires today. {{cart_total}}, {{checkout_url}}. After that we stop writing." · AR subject "الساعات الأخيرة لسلتك" · AR body "{{first_name}} — سلتك تنتهي اليوم. {{cart_total}}، {{checkout_url}}. بعدها نتوقف عن المراسلة."
- `t-007` **"Generated draft — warm nudge"** — email, status **draft**, origin `generated-promoted`, version 1, approvedAt absent. The double-gate fixture: promoted from `dvs-001` (below) on Oct 18 17:45Z; binding it to any step → VALIDATION naming the draft (07b rule 5); `approveTemplate` is the separate human act that would clear it.
- `t-008` **"Old aggressive chase"** — email, **retired**, origin `authored`, version 1 — retired Oct 10; boundStepCount 0 (the retire gate's clean fixture).

**DraftVariantSet** `dvs-001` — baseTemplate t-001 **v1** (the diff baseline), tone `warm`, locales `[en, ar]`, variantCount 2 per locale, provenance `generated`, partial absent, createdAt 2026-10-18T17:20:00Z, expiresAt 2026-10-25T17:20:00Z (live at seed time). Variants (verbatim fixtures; EN first):
- v0 (en): subject "{{first_name}}, your cart kept its place at {{store_name}}" · body "Your cart is still exactly as you left it — {{cart_items}}, {{cart_total}}. Nothing expires for another day.\nPick up where you stopped: {{checkout_url}}"
- v1 (en): subject "We saved your cart, {{first_name}}" · body "Still deciding? Your selection waits at {{store_name}} — {{cart_items}} for {{cart_total}}.\nFinish in one tap: {{checkout_url}}"
- v2 (ar): subject "سلتك محفوظة مكانها في {{store_name}}" · body "سلتك كما تركتها تماماً — {{cart_items}} بقيمة {{cart_total}}. لا ينتهي شيء قبل يوم آخر.\nأكمل من حيث توقفت: {{checkout_url}}"
- v3 (ar): subject "حفظنا سلتك يا {{first_name}}" · body "ما زلت تفكر؟ اختيارك بانتظارك في {{store_name}} — {{cart_items}} بقيمة {{cart_total}}.\nأكمل بنقرة واحدة: {{checkout_url}}"
Variant v1 is the one promoted to t-007. `dvs-000` is an expired fixture (expiredAt Oct 15) retained in state — `getDraftVariantSet('dvs-000')` → NOT_FOUND with the expiry named (the draft-expiry fixture).

**Routing policy** `rp-001` version 2 (edited Oct 11 by Dana, activity `routing-updated`): thresholds `{lowMax: 150, highMin: 400}`; bandRoutes: low → seq-001, mid → seq-001 + incentiveId inc-001, high → seq-002 + incentiveId inc-002; incentives: `inc-001` {kind free-shipping, codeRef "SHIP4U", note "shipping costs us less than a percentage on mid carts"} · `inc-002` {kind percent, percent 15, codeRef "WELCOME15", note "high band only, final step only — the margin owner's line"}. Codes are strings the merchant's own systems issue — the mock never generates or verifies one (LOOP-10).

**Shoppers** (14; contact = email-class abstract handles, rendered masked per credential-contract §2 in any UI surface that shows them):

| id | display name | locale | jurisdiction | timezone | consentBasis |
|---|---|---|---|---|---|
| sp-001 | نورة القحطاني | ar | KSA | Asia/Riyadh | marketing-consent |
| sp-002 | Daniel Reyes | en | US-FED | America/New_York | soft-opt-in |
| sp-003 | مها الهاشمي | ar | ARE | Asia/Dubai | marketing-consent |
| sp-004 | Sarah Whitfield | en | US-FL | America/New_York | soft-opt-in |
| sp-005 | خالد المطيري | ar | KSA | Asia/Riyadh | marketing-consent |
| sp-006 | Emily Chen | en | US-FED | America/New_York | legitimate-interest |
| sp-007 | ريم الدوسري | ar | KSA | Asia/Riyadh | marketing-consent |
| sp-008 | عبدالله الغامدي | ar | KSA | Asia/Riyadh | unknown |
| sp-009 | Fatima Al-Marzooqi | ar | ARE | Asia/Dubai | marketing-consent |
| sp-010 | Marcus Webb | en | US-FED | America/New_York | soft-opt-in |
| sp-011 | هند العتيبي | ar | KSA | Asia/Riyadh | marketing-consent |
| sp-012 | Tariq Johnson | en | US-TX | America/Chicago | soft-opt-in |
| sp-013 | منى السبيعي | ar | KSA | Asia/Riyadh | unknown |
| sp-014 | ياسر الحربي | ar | KSA | Asia/Riyadh | marketing-consent |

**Carts** (14 — the pinned queue census: 8 in-recovery, 3 recovered, 2 expired, 1 suppressed-at-intake; every timestamp absolute; `LA` = lastActivityAt, `AB` = abandonedAt = LA + 60 min exactly):

| cart | shopper | items (en / ar, qty × unit SAR) | total | band | state | assignment | priority score (§D) |
|---|---|---|---|---|---|---|---|
| cart-001 | sp-001 | Wool area rug / سجادة صوف ×1 @165 · Brass incense burner / مبخرة نحاسية ×1 @75 | 240.00 | mid | in-recovery | seq-001 v3 (routing) | 0.419 |
| cart-002 | sp-002 | Ceramic dinner set, 12 pieces / طقم عشاء سيراميك 12 قطعة ×1 @310 | 310.00 | mid | in-recovery | seq-001 v3 | 0.422 |
| cart-003 | sp-003 | Oud diffuser / مبخرة عود كهربائية ×2 @47.50 | 95.00 | low | in-recovery | seq-001 v3 | 0.368 |
| cart-004 | sp-004 | Linen throw, sand / غطاء كتان — رملي ×1 @280 | 280.00 | mid | in-recovery | seq-001 v3 | 0.563 |
| cart-005 | sp-005 | Arched wall mirror / مرآة حائط مقوسة ×1 @349 | 349.00 | mid | **recovered** | seq-001 v3 | 0.374 |
| cart-006 | sp-006 | Engraved serving tray / صينية تقديم منقوشة ×1 @350 | 350.00 | mid | in-recovery | seq-001 v3 | 0.502 |
| cart-007 | sp-007 | Cotton bath towels, set of 4 / مناشف حمام قطنية — 4 قطع ×1 @175 | 175.00 | mid | **recovered** | seq-001 v3 | 0.288 |
| cart-008 | sp-008 | Arabic coffee cups, gold rim / أكواب قهوة عربية بحواف ذهبية ×2 @65 | 130.00 | low | **expired** | seq-001 v3 | 0.165 |
| cart-009 | sp-009 | Metal floor lantern / فانوس أرضي معدني ×1 @415 | 415.00 | high | **recovered** | seq-002 v2 | 0.585 |
| cart-010 | sp-010 | Wool runner / سجادة ممر صوف ×1 @420 | 420.00 | high | **expired** | seq-002 v2 | 0.310 |
| cart-011 | sp-011 | Ceramic vase, tall / مزهرية سيراميك طويلة ×1 @199 | 199.00 | mid | in-recovery | seq-001 v3 | 0.421 |
| cart-012 | sp-012 | Hand-knotted rug / سجادة يدوية معقودة ×1 @780 | 780.00 | high | in-recovery | seq-002 v2 | **0.618 — queue top, needsDecision** |
| cart-013 | sp-013 | Metal lantern pair / زوج فوانيس معدنية ×1 @260 | 260.00 | mid | **suppressed-at-intake** | none (held) | 0.420 |
| cart-014 | sp-014 | Engraved serving tray / صينية تقديم منقوشة ×1 @190 | 190.00 | mid | in-recovery | seq-001 v3 | 0.460 |

Fixed anchors (all instants UTC): cart-001 LA 10-19T09:20Z, AB 10:20Z · cart-002 LA 10-18T21:40Z, AB 10-19T02:40Z · cart-003 LA 10-18T14:20Z, AB 15:20Z · cart-004 LA 10-18T15:00Z, AB 16:00Z · cart-005 LA 10-15T09:00Z, AB 10:00Z · cart-006 LA 10-18T16:00Z, AB 17:00Z · cart-007 LA 10-16T12:00Z, AB 13:00Z · cart-008 LA 10-14T06:00Z, AB 07:00Z · cart-009 LA 10-18T04:00Z, AB 05:00Z · cart-010 LA 10-15T18:00Z, AB 19:00Z · cart-011 LA 10-18T14:40Z, AB 15:40Z · cart-012 LA 10-18T16:10Z, AB 17:10Z · cart-013 LA 10-19T07:00Z, AB 08:00Z · cart-014 LA 10-19T01:10Z, AB 02:10Z.

**Send ledger** (materialized sends only — the materialization rule is §E rule 5; `deferredUntil`/`dispatchedAt`/`deliveredAt`/`clickedAt` as absolute instants):

| send | cart · step | dueAt (UTC) | local due | state | notes |
|---|---|---|---|---|---|
| s-001-1 | cart-001 · 1 | 10-19T11:20Z | 14:20 Riyadh | scheduled | in-window at due |
| s-002-1 | cart-002 · 1 | 10-19T03:40Z | **23:40 America/New_York** | **deferred** | deferredUntil 10-19T12:00Z (08:00 local); row `qh-row-us-fed` v1; reason string per §C — CP-3.2's first fixture |
| s-003-1 | cart-003 · 1 | 10-18T16:20Z | 20:20 Dubai | delivered | dispatched 16:20Z; delivered event 16:40Z |
| s-003-2 | cart-003 · 2 | 10-19T15:20Z | 19:20 Dubai | scheduled | in-window |
| s-004-1 | cart-004 · 1 | 10-18T17:00Z | 13:00 America/New_York | clicked | dispatched 17:00Z; delivered 17:20Z; clicked 18:05Z |
| s-004-2 | cart-004 · 2 | 10-19T16:00Z | 12:00 America/New_York | **skipped-suppressed** | opt-out landed 10:00Z before due |
| s-005-1 | cart-005 · 1 | 10-15T11:00Z | 14:00 Riyadh | clicked | completion followed this click |
| s-005-2 | cart-005 · 2 | 10-16T10:00Z | 13:00 Riyadh | cancelled | recovery cancelled it |
| s-006-1 | cart-006 · 1 | 10-18T18:00Z | 14:00 America/New_York | delivered | delivered event provenance **manual** (Dana, LOOP-5) |
| s-006-2 | cart-006 · 2 | 10-19T17:00Z | 13:00 America/New_York | scheduled | |
| s-007-1 | cart-007 · 1 | 10-16T14:00Z | 17:00 Riyadh | delivered | no click |
| s-007-2 | cart-007 · 2 | 10-17T13:00Z | 16:00 Riyadh | clicked | completion followed this click |
| s-007-3 | cart-007 · 3 | 10-19T13:00Z | 16:00 Riyadh | cancelled | |
| s-008-1 | cart-008 · 1 | 10-14T08:00Z | 11:00 Riyadh | delivered | |
| s-008-2 | cart-008 · 2 | 10-15T07:00Z | 10:00 Riyadh | delivered | |
| s-008-3 | cart-008 · 3 | 10-17T07:00Z | 10:00 Riyadh | cancelled | due == expiry instant; expiry wins (§E rule 8) |
| s-009-1 | cart-009 · 1 | 10-18T05:30Z | 09:30 Dubai | clicked | |
| s-009-2 | cart-009 · 2 | 10-19T05:00Z | 09:00 Dubai | cancelled | |
| s-010-1 | cart-010 · 1 | 10-15T19:30Z | 15:30 America/New_York | delivered | dispatched at import (past-due, §E rule 6) |
| s-010-2 | cart-010 · 2 | 10-16T19:00Z | 15:00 America/New_York | delivered | dispatched at import |
| s-010-3 | cart-010 · 3 | 10-18T19:00Z | 15:00 America/New_York | cancelled | due == expiry instant |
| s-011-1 | cart-011 · 1 | 10-18T16:40Z | 19:40 Riyadh | delivered | shopper replied to support Oct 18 (CP-3.4 context) |
| s-011-2 | cart-011 · 2 | 10-19T15:40Z | 18:40 Riyadh | scheduled | override candidate row |
| s-012-1 | cart-012 · 1 | 10-18T17:40Z | 12:30 America/Chicago | **failed** | error {code NETWORK, message "the message channel refused the dispatch — connection dropped", correlationId acr-corr-0007}; needsDecision |
| s-012-2 | cart-012 · 2 | 10-19T17:10Z | 12:10 America/Chicago | scheduled | materialized because step 1 reached a terminal dispatch state |
| s-014-1 | cart-014 · 1 | 10-19T03:10Z | 06:10 Riyadh | delivered | created deferred (quiet at due), dispatched at its deferredUntil 06:00Z… see note |
| s-014-2 | cart-014 · 2 | 10-20T02:10Z | **05:10 Asia/Riyadh** | **deferred** | deferredUntil 10-20T06:00Z (09:00 local); row `qh-row-ksa` v1 — CP-3.2's second fixture |

`s-014-1` precision: its due 03:10Z fell in the quiet span (06:10 local < 09:00) → created `deferred` with deferredUntil 06:00Z (09:00 Riyadh). The import that carried cart-014 ran at 09:40Z, after that opening — so at import the send dispatched (rule 6) and its `defer` block is kept as history (07a: "present iff state was ever deferred (kept after dispatch)"). The ledger row therefore shows state `delivered` WITH the deferral that once governed it — the audit-honesty fixture.

**Shopper events** (append-only; `provenance` per 07a): cart-003 delivered (channel) · cart-004 delivered, clicked, **opt-out** (channel, occurredAt 10-19T10:00Z, eventKey evt-004-opt) · cart-005 delivered, clicked, checkout-completed (channel, 10-15T13:40Z) · cart-006 delivered (**manual**, recordedByMemberId mem-002, note "customer confirmed receipt by reply in the support inbox") · cart-007 delivered ×2, clicked, checkout-completed (channel, 10-17T16:30Z) · cart-008 delivered ×2 · cart-009 delivered, clicked, checkout-completed (channel, 10-18T08:15Z) · cart-010 delivered ×2 · cart-011 delivered · cart-014 delivered. 18 events; every eventKey unique (idempotency oracle: replaying any event writes once).

**Suppression ledger** (3): `supp-001` sp-013, reason `complaint`, note "asked for no marketing messages via the storefront contact form", suppressedAt 10-12T09:00Z by mem-002 — the intake hold that made cart-013 `suppressed-at-intake` · `supp-002` sp-005, reason `manual`, note "asked to pause messages during travel", suppressedAt 10-10Z… (10-10T11:00Z) by mem-001, **restored** 10-14T08:00Z with restoreNote "shopper re-consented on the storefront — welcome back" by mem-001 (block/restore symmetry fixture; cart-005's recovery began AFTER the restore) · `supp-003` sp-004, reason `opt-out`, sourceEventId `evt-004-opt`, suppressedAt 10-19T10:00Z, active — affectedPendingSends 1 (s-004-2, now `skipped-suppressed`).

**Jobs** (10, chronological; idempotency keys unique): `job-001` import ✓ 10-14T06:30Z (1 cart: cart-008) · `job-002` import ✓ 10-15T09:30Z (1: cart-005) · `job-003` import ✓ 10-16T12:30Z (1: cart-007) · `job-004` import ✓ 10-18T05:15Z (2: cart-009, cart-010) · `job-005` import ✓ 10-18T15:30Z (3: cart-003, cart-004, cart-011) · `job-006` import ✓ 10-18T16:30Z (2: cart-006, cart-012) · `job-007` generation ✓ 10-18T17:20Z (dvs-001; 4 variants; progress determinate "Generating variant 3 of 4") · `job-008` import ✓ 10-19T09:40Z (4: cart-001, cart-002, cart-013, cart-014 — result: imported 4, skippedRows [], parkedPending 1 (cart-001, under threshold at import), suppressedAtIntake 1 (cart-013)) · `job-009` import **failed** 10-19T10:05Z (3 pasted rows: rows 1–2 duplicate cart-001/cart-014 — idempotent skips, named; row 3 empty total → VALIDATION "row 3 — cart total is empty"; imported 0) · `job-010` export ✓ 10-19T10:15Z (artifact `art-001`, formats all three, reportWindow 10-12→10-19, expiresAt 10-26T10:15Z, regenerable). The canonical pacing fixture for any running import is determinate "Importing 9 of 14 carts" (03 CP-1.2, 11 loading matrix).

**Usage**: window "October 2026", generatedVariants 4 of 12, exports 1 of 6, resetAt 2026-11-01T00:00:00Z (P14 — the 80% warning fires at 10 variants / 5 exports; quota exhaustion is injected, not seeded).

**Activity entries** (~40): covering every action kind reachable in the seeded state — workspace-viewed (session opens), carts-imported (×7 imports), sequence-created/updated/activated/paused (seq-001 v1→v3 history)/retired (seq-000), template-saved (t-001 v2 revision)/approved (×7)/retired (t-008), generation-run (job-007), draft-promoted (t-007), routing-updated (rp-001 v2), quiet-hour-policy-updated (qhp-001 v2), shopper-suppressed (supp-001, supp-002), suppression-restored (supp-002), event-recorded (the manual event), export-run (job-010). Three kinds are exercised only by live flows (03 CP-3): sequence-overridden, recovery-cancelled, and event-recorded-for-channel arrivals — noted honestly rather than fabricated into history.

## Deterministic computation rules

Arithmetic sections §A–§D and §E–§H below; binding rules carry the numbers referenced across 03/07a/07b (rule 4 = quiet-hours evaluation and deferral; rule 9 = preview purity; §D = the queue-rank math).

### §A — The fixed clock (rule 1)

**Rule 1 — Instants and local time.** All times are absolute UTC instants; the mock never reads a wall clock. The seeded `now` is 2026-10-19T10:30:00Z and advances only via `advanceTo(instant)` / `advanceMinutes(n)` (test-support). Local rendering converts an instant through the fixed offset table (above); offset selection uses the zone's offset AT that instant (the US zones' Nov 1 2026 transition is table data, not computation). Display is formatting, never storage: `HH:MM` 24h plus the named zone (`23:40 America/New_York`), Western numerals, per 05. `previewSchedule` accepts any `anchorAt` instant and any zone in the table; a zone outside the table → VALIDATION naming the zone and listing the supported set.

### §B — Intake rules (rules 2–3)

**Rule 2 — Abandonment detection, suppression hold, idempotent re-import.** A cart is abandoned exactly when `(now − lastActivityAt) ≥ abandonmentThresholdMinutes` (60) AND no `checkout-completed` event exists; `abandonedAt = lastActivityAt + 60 min` — the anchor is arithmetic, never "when we noticed". Under-threshold carts import as `abandoned-pending` (parked, `parkedPending` in ImportJobResult) and become eligible the moment the threshold lapses. A shopper with an active suppression entry (restored entries do not hold) → the cart is `suppressed-at-intake` with `stateReason "shopper suppressed — {reason} on record ({entryId})"`, no assignment, no sends — recorded, never bounced silently. Re-import idempotency key: `(shopper contact handle, lastActivityAt)` — a paste row matching an existing cart is a named skip ("row N — duplicate of {cartId}"), never a second cart. Paste grammar (one cart per block, blank line between blocks; field order fixed):

```
shopper: Noura Al-Qahtani | ar | KSA | Asia/Riyadh | contact: email | noura@example-store.sa
consent: marketing-consent
last-activity: 2026-10-19T09:20:00Z
item: rug-001 | Wool area rug | سجادة صوف | 1 | 165.00
item: inc-002 | Brass incense burner | مبخرة نحاسية | 1 | 75.00
total: 240.00 SAR
```

Validation order is deterministic (first failure named): empty/total-less block → "row N — cart total is empty" (job-009's fixture); total ≠ sum(items) → named with both numbers; currency outside the workspace set → named with the declared set; unknown locale or consent value → named; timezone outside the offset table → named. Prior valid rows are always retained (async-contract §4). The `contact:` field is required because `Shopper.contact` is non-optional in 07a (the 07b comment lists the summary fields; the grammar adds the contact line); handles are abstract strings — the mock accepts any well-formed handle and never renders vendor semantics.

**Rule 3 — Band, routing, consent-skip, assignment.** Band: `total ≤ lowMax → low; total > highMin → high; else mid` (150/400 seeded). Routing: band → `bandRoutes[band].sequenceId`; the assignment pins `{sequenceId, sequenceVersion, assignedAt, assignedBy: 'routing'}`. Consent gate: a `consent-only` sequence meeting a shopper with consentBasis `unknown` → NO assignment; the cart parks `abandoned-pending` with the intake skip recorded (rendered in the queue row's state description and the cart drawer) — it enters recovery the moment a route admits it (basis change on re-import, an operator override, or a sequence switch). Priority components and score compute per §D at intake and re-derive deterministically on every read (07a: derived, never stored-authoritative).

### §C — Quiet-hours evaluation and deferral (rule 4)

**Rule 4 — Recipient-local evaluation; deferral is first-class.** Row resolution: `Shopper.jurisdiction` → matching row; no match → the workspace default row, recorded on the send when it governs. Evaluation happens in the SHOPPER's timezone at the due instant (never the workspace's). Window semantics `[start, end)` on minutes-of-day, with the exact circle algorithm for midnight-crossing rows:

```
sendable(t) := start ≤ end ? (start ≤ t < end) : (t ≥ start ∨ t < end)
deferredUntil := the earliest instant > dueAt whose local minutes-of-day == windowStart
```

A sendable due → state `scheduled`. A quiet-span due → state `deferred` with `DeferInfo { dueAt, deferredUntil, localDueTime, quietHourRowId, quietHourRowVersion (pinned), reason }`. The reason string is fixed-format and locale-aware (rendered in the workspace chrome locale): EN "due {localDueTime} {zone} — outside send window {start}–{end} ({jurisdiction}, {sourceLabel}); deferred to {deferredLocalTime}" / AR "الاستحقاق {localDueTime} {zone} — خارج نافذة الإرسال {start}–{end} ({jurisdiction}، {sourceLabel})؛ أُجّل إلى {deferredLocalTime}". Worked examples the fixtures pin:
- s-002-1: due 23:40 America/New_York, window [08:00, 21:00) → 23:40 not sendable → deferred to the next 08:00 local (10-19T12:00Z). ✓ CP-3.2 fixture 1.
- s-014-2: due 05:10 Asia/Riyadh, window [09:00, 21:00) → deferred to 09:00 local (10-20T06:00Z). ✓ CP-3.2 fixture 2.
- Midnight-crossing demo row (preview-only, not seeded): window 21:00–03:00 → a due at 14:00 defers to 21:00 the same day; a due at 01:30 is sendable (`t < 03:00`); a due at exactly 03:00 is quiet (`end` exclusive).
- Boundary: due exactly at `end` (e.g. 21:00 on [08:00, 21:00)) is quiet — end-exclusive — and defers to the next 08:00.

Deferral never mutates the sequence, never happens silently (the ledger row and the queue's deferral mark both render), and pins the row version that produced it. Editing a row later never rewrites an existing DeferInfo (07a pinning); a send created after the edit evaluates against the new row version.

### §D — Priority-score arithmetic (the queue-rank math 07a/03 reference; computed at intake, re-derived on read)

```
value       = min(total / valueNormalizer, 1)         // normalizer 1000, workspace-settable
recency     = max(0, 1 − hoursSinceAbandonment / 72)   // hoursSinceAbandonment from abandonedAt
engagement  = 0 (no event) · 0.5 (latest event delivered) · 1 (latest event clicked)   // latest event wins
score       = round(0.5·value + 0.3·recency + 0.2·engagement, 3)   // weights are spec-proposed — 12 Q-11
```

Deterministic total order: score desc → total desc → cartId asc (lexicographic). The queue's Western-numeral rank renders beside the components WITH their math (CP-1.4: the drawer shows value/recency/engagement and the weighted sum — an operator never meets an unexplained number). Seed verification: cart-012 = 0.5(0.780) + 0.3(0.759) + 0.2(0) = **0.618**, the queue top and the needsDecision row (CP-1.5); the full seeded order is cart-012, cart-009, cart-004, cart-006, cart-014, cart-002, cart-011, cart-001, cart-013, cart-005, cart-003, cart-010, cart-007, cart-008.

### §E — The recovery-sequence state machine (rules 5–8)

**Rule 5 — Send materialization and due times.** Step delays are cumulative offsets from the cart's anchor: `due(step N) = anchor + delayMinutes(N)` (the category's 1h/24h/72h ladder is offsets from abandonment, 01 q7; the activation gate checks each `delayMinutes ≤ expiryHours × 60` — 07b rule 3). The anchor is `abandonedAt`, or the assignment moment when `assignSequence` re-anchors with `reanchorFrom: 'now'` (CP-3.4). Materialization is lazy and event-driven: assignment materializes step 1 only; step N+1 materializes when step N reaches a terminal dispatch state (`dispatched`, `delivered`, `clicked`, `failed`) — the ledger records attempts, and later steps re-read policy versions at THEIR evaluation time (03 CP-4 edge). A step whose due would fall at or past the cart's expiry instant is never materialized.

**Rule 6 — Dispatch evaluation.** When the clock reaches a scheduled/deferred send's effective instant (due, or deferredUntil), the send transitions `dispatched` (window was already satisfied; no re-check needed — deferral computed the opening) and the send's channel kind is handed to the abstract message channel. Past-due sends at import (cart-010) dispatch at import time. `manualExportMarkedAt` stamps a send when a send-list export covers it (CP-5.3) — the manual dispatch path; a `delivered`/`clicked` event recorded manually afterwards completes the loop. Failed dispatch: `failDispatchAtSend` injects a typed 7-class error (seeded fixture s-012-1, NETWORK, correlationId `acr-corr-0007`); a failed send is terminal for materialization purposes (the next step materializes) and the row carries needsDecision.

**Rule 7 — Event-driven transitions.** Events are idempotent by `eventKey` (same key twice writes once and returns current state). `delivered`/`clicked` update the send they bind to and the engagement component. `checkout-completed` flips the cart to `recovered`, cancels every remaining scheduled/deferred send for THAT cart (`cancelled`), and freezes the history — only this event recovers a cart (07a). `opt-out` cancels every scheduled AND deferred send for the SHOPPER (state `skipped-suppressed`), writes the SuppressionEntry with `sourceEventId`, and holds future carts at intake; a send already dispatched when the opt-out lands stays history — the ledger notes the race (CP-3 edge). Manual and channel events are ledger peers; manual carries `recordedByMemberId` (seeded fixture: cart-006's delivered event by Dana).

**Rule 8 — Expiry is terminal.** The cart's expiry instant is `anchor + expiryHours`. At or after it, without a completion event: pending sends → `cancelled` (stateReason carries the expiry), the cart → `expired` with `stateReason "expired — sequence window lapsed at {expiryHours}h"`. A send due exactly AT the expiry instant is cancelled — expiry wins ties (seeded: s-008-3, s-010-3). Nothing resurrects an expired cart; a new cart for the same shopper is a new recovery object (07a).

### §F — Preview purity (rule 9)

**Rule 9 — `previewSchedule` is a pure function.** Given `{sequenceId, sequenceVersion, sampleCartTotal, shopperLocale, jurisdiction, timezone, anchorAt}` it computes every step's timing with EXACTLY rules 4–5's arithmetic — the same function the live scheduler runs (`computedBy: 'deterministic-scheduler'`, 07b) — and mutates nothing: no SendRecord, no state, no clock advance. Identical inputs → identical `timings[]` (the test oracle; re-running a preview is a no-op by construction). Worked fixture (CP-2.10's example): seq-001, jurisdiction US-FED, timezone America/New_York, anchorAt 2026-10-19T03:40:00Z → step 1 due 00:40 local (quiet) → deferred to 08:00; step 2 due 23:40 local → **"step 2 due 23:40 America/New_York — outside send window 08:00–21:00 (US-FED, statutory anchor — 47 CFR 64.1200(c)(1)); deferred to 08:00 next day"**; step 3 due 23:40 next day → deferred likewise. Every timing row carries `windowLabel` ("send window 08:00–21:00 · quiet 21:00–08:00").

### §G — Version pinning and conflict semantics (rule 10)

**Rule 10 — baseVersion everywhere a policy write lands.** `updateSequence`, `updateRoutingPolicy`, `saveQuietHourPolicy`, `saveTemplate`, `approveTemplate` → CONFLICT with both payloads in `details` when the base version is stale (seeded demo: any edit submitted against seq-001's v1 history). Editing an ACTIVE sequence forks a draft (`hasDraftFork: true`; the fork banner's copy in 11); activation promotes the fork. `setSequenceStatus → active` runs the full gate (07b rule 3) and names every failed rule with links — seq-003's fixture refusal names t-007. `retireTemplate` requires `confirm.boundStepCount` matching the live count (drift → VALIDATION with the recounted count); retiring never touches bound steps' pins. Row deletion referenced by any step → VALIDATION naming the sequences. SendRecords pin sequence/template/policy-row versions at creation and are never rewritten by later edits (07a) — the seed's v2/v3 history demonstrates the display of both with version stamps.

### §H — Report arithmetic and normalization (rules 11–12)

**Rule 11 — The recovery report derives from recorded events only.** For a window `[from, to)`: `carts` counts carts by current state; `recoveredRevenue[currency]` sums the totals of recovered carts (seed: 349.00 + 175.00 + 415.00 = **SAR 939.00**, reconciling to the recovered carts exactly); `recoveryRate = {recovered, enteredRecovery}` where enteredRecovery counts every cart that entered the pipeline in the window — including the intake-held one — because a denominator that hides holds is the definitional noise 01 documented (seed: **3 of 14**, stated on the surface, never implied); `funnel[stepOrder]` counts materialized sends by state plus `recoveredAfter` (carts whose completion event followed a clicked send at that step — seed: step 1 → 2, step 2 → 1); `deferrals` counts sends whose `defer` block exists, grouped by jurisdiction and by window-label reason (seed: total 3 — KSA 2, US-FED 1; top reason "outside send window 09:00–21:00" ×2); `suppressions` counts entries in the window (3); `perSequence` groups assigned carts by pinned sequence version (seq-001 v3: 10 carts, 2 recovered, SAR 524.00 · seq-002 v2: 3 carts, 1 recovered, SAR 415.00 — totals reconcile to 13 assigned carts / SAR 939.00). No external benchmark is quoted anywhere in the computation (01 honest gaps; 12 Q-12).

**Rule 12 — Search normalization and deterministic sorts.** List search normalizes per rtl-rules §4 (strip tashkeel U+064B–U+065F and U+0670, tatweel U+0640; unify alef variants أ إ آ ٱ → ا; taa marbuta ة → ه; alif maqsura ى → ي; Latin case-fold, trim, collapse whitespace) over shopper display names and bilingual item/template names — the applied ruleset is disclosed in-product (ai-native-patterns §7.4). Every list's default sort and every tie-break is fixed: carts per §D; sends by `dueAt` asc then sendId; sequences by `updatedAt` desc; jobs by `createdAt` desc; suppressions by `suppressedAt` desc. Cursor pages cap at 100 (07b).

## Behavior per operation (33/33)

- `getSession` — returns the seeded member seat; `MockConfig.sessionRole`/`sessionLocale` override for role/locale fixtures (viewer-seat and AR-chrome demos); no state change.
- `importCarts` — paste: parses rule 2's grammar, paces determinately (40 ms per 10 rows; the canonical progress string "Importing 9 of 14 carts"), delivers ImportJobResult with named skips, parks under-threshold carts, records intake holds; partial retention on failure (job-009). `cart-source-capability` source without granted consent → PERMISSION naming the capability class (credential-contract §4); with consent (injected via config), the mock accepts a typed capability payload through the same intake rules with `provenance: 'cart-source-capability'`. Idempotency keys: a retried submit returns the original Job.
- `listCarts` — §D ordering, rule 12 normalization, cursor pages; filters compose; `needsDecision` marks failed dispatches and override candidates; the row-count announcement source ("14 carts — 8 in recovery, 3 recovered, 2 expired, 1 suppressed") derives from the state census.
- `getCart` — full CartView (cart with priority components AND their math, shopper with suppression state, sends, events); unknown id → NOT_FOUND.
- `createSequence` — name/consentBasis/expiry persisted; status `draft`; activity `sequence-created`.
- `listSequences` / `getSequence` — summaries with `hasDraftFork`, `assignedCartCount`, and `activationBlockers` (seq-003's named t-007 rule renders pre-emptively).
- `updateSequence` — full step-array replace; drafts bind only approved templates (draft → VALIDATION naming it, 07b rule 5); ACTIVE edit forks a draft; baseVersion stale → CONFLICT both kept.
- `setSequenceStatus` — activation gate per rule 10 (seq-003 fixture refuses); pause/retire of an active sequence requires `confirm.remainingSendsCount` matching the live count (drift → VALIDATION recount); pausing cancels nothing — its pending sends hold (`cancelled` only on retire/expiry/suppression/recovery per 07a states).
- `listTemplates` / `saveTemplate` — variable validation against the known set (unknown → VALIDATION naming variable and column); per-locale budgets (subject ≤60, body ≤900 — VALIDATION on breach at save, meters render live in the editor); baseVersion conflicts both kept.
- `approveTemplate` — pins the approved version, records actor + timestamp; t-007's approval is the demo of the second human gate.
- `retireTemplate` — confirm-gated per rule 10; t-008 fixture.
- `generateMessageVariants` — the ONE conditionally-AI operation: without granted generation capability → PERMISSION with the template-library fallback in the error's next-action copy (11); with consent, runs as a Job streaming variants into the draft set (deterministic per base template + tone + locale pair; the seeded dvs-001 output is the oracle); quota-exhausted config → RATE_LIMIT with reset time and rung-3 copy; idempotent by key.
- `getDraftVariantSet` — expired or unknown → NOT_FOUND (dvs-000 fixture) with regenerate guidance.
- `promoteDraftVariant` — `confirmReviewed: true` is structural (the literal type); variantIndex bounds-checked (VALIDATION); output is a DRAFT template with origin `generated-promoted` (t-007 fixture) — never an approved one.
- `getRoutingPolicy` / `updateRoutingPolicy` — threshold sanity (lowMax < highMin, else VALIDATION naming both numbers); percent bounds 0 < p ≤ 100; code string required when an incentive references one; baseVersion conflicts.
- `listQuietHourPolicies` — the single workspace policy with row versions and source labels.
- `saveQuietHourPolicy` — full row-array replace; row edits bump only that row's version; start ≠ end; midnight-crossing accepted and modeled by rule 4's algorithm; referenced-row deletion → VALIDATION naming sequences; baseVersion conflicts.
- `previewSchedule` — rule 9 (pure; the worked fixture above).
- `listSends` — the ledger across carts; `deferredOnly` returns the pending pair (s-002-1, s-014-2) — the CP-3.2 view; every deferred row carries reason, pinned row version, and rescheduled instant.
- `assignSequence` — suppressed shopper → VALIDATION naming the suppression entry (with the restore link path, CP-3.9); overrideReason required (empty → VALIDATION); re-anchor per input; ledger + activity entries.
- `cancelCartRecovery` — reason required; remaining steps named in the UI's confirm (P04 level-2 — the adapter recounts them); history stays.
- `recordShopperEvent` — rule 7 (idempotent by eventKey; backdated occurredAt renders as claimed time); unknown cart → NOT_FOUND with the paste-import path offered; opt-out triggers the full suppression cascade.
- `addSuppression` — note required; pending sends cancel to `skipped-suppressed` (affectedPendingSends recounted live).
- `listSuppressions` — filters by reason and restored state; the restored entry (supp-002) renders its restore note.
- `removeSuppression` — restoreNote required; appends the restore (suppression history is append-only); a later cart for the shopper enters recovery normally.
- `getRecoveryReport` — rule 11; any window; deterministic re-derivation.
- `exportRecoveryPackage` — send-list with zero pending shoppers → VALIDATION naming the queue state (never a blank artifact); reportWindow required for recovery-report/send-list; sequenceId required for sequence-archive (draft sequences allowed, marked); artifact expires at creation + 7 days, regenerable; per-format failure injectable; send-list export stamps `manualExportMarkedAt` on covered pending sends.
- `getArtifact` — expired → NOT_FOUND with the regenerate path; url is a mock-internal resource identifier (no network).
- `listJobs` — filterable; link-to-context per async-contract §7; cancel within one interaction.
- `getUsage` — the seeded window; 80% warning computed; exhaustion only via injection.

## Failure injection

`MockConfig { latencyMs (default 90), errorRate (default 0 — unused; failure is configuration, not chance), errorCode?, failImportAtRow?, failDispatchAtSend?, failExportFormat?, quotaExhausted?, sessionRole?, sessionLocale?, generationCapabilityGranted?, cartSourceConsentGranted? }` — per-method injection with fixed correlationIds `acr-corr-0001`…; every injected failure follows the 7-token taxonomy of 07b exactly (VALIDATION / NOT_FOUND / PERMISSION / CONFLICT / RATE_LIMIT / NETWORK / UNKNOWN), each with a recovery path in 11. No jitter, no randomness: latency and failure points are declared, reproducible, and resettable.

## Test-support

`reset(mode: 'seed' | 'empty')` — 'seed' restores the full dataset above; 'empty' provisions the workspace with the library stock (t-001…t-006), the quiet-hour rows, routing defaults v1, and zero carts/sequences/jobs — the P22 first-run surface whose empty state offers the sample. `clearSample()` — the product-level one-way affordance (badge copy in 11): marks the sample consumed; it never returns within the session (reset() deliberately restores it — reset is the test oracle, not the product affordance). `snapshot()` → named state capture; `replay(events)` → deterministic re-derivation; `advanceTo` / `advanceMinutes` → the only clock motion. State hashes are stable across runs; replaying the identical session twice produces byte-identical state (the 00 determinism oracle). Zero external dependencies; no wall-clock, no network, no locale services — the offset table and normalization pipeline are data.
