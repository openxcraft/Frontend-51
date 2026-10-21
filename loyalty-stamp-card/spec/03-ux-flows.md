# 03 — UX Flows: loyalty-stamp-card

SME-C pass · 6 critical paths. Coverage table at the end traces every 07b operation — no orphans, no phantoms. All flows run on the Mock Adapter (07c) with the seeded store "مخبز وورد / Ward's Bakery & Coffee" unless noted.

## CP-1 — Card authoring → publish (the owner's first-evening flow)

1. Faisal signs in to the empty-store first run and meets the value checklist (P22 — three honest milestones: publish a bilingual card, stamp the first member, read the day's count), then opens Card Studio. `getSession` (role owner; locale ar)
2. He creates the program: Arabic + English program names, mode `ladder`, 8 stamps per card. Draft state. `createProgram`
3. He authors the tiers: row 1 — 4 stamps, "كوكيز مجاني" / "free cookie"; row 2 (final) — 8 stamps, "قهوة على حسابنا" / "any coffee on the house". Validation live per row: both locales required (a blank English name fails the row), stampsRequired strictly ascending, final tier must equal the card's stamp count. `updateProgram` (draft, versioned)
4. Policies tab: expiry 6 months since last stamp; daily stamp cap 1; the undo window note (staff undo ≤120s at the counter, corrections after that are manager adjustments). `updateProgram`
5. Live preview renders the card face in both directions — Arabic face right-to-left with the English face a tab away; tier rows render in both scripts (P23 authoring-columns logic applied to tier rows).
6. Publish: a P04 level-2 confirm names the consequence ("publishing makes this card live for members at the counter; 41 enrolled members receive it on their next stamp") — Faisal confirms. `setProgramStatus` (published)
7. Programs list shows the new card live beside the seeded draft fixture. `listPrograms`

**Edges**: a tier row with one blank locale → VALIDATION naming the row and the missing side; final tier below stamp count → VALIDATION explaining the ladder rule; editing a published program creates a draft version while the published version stays live (members never see a half-edited card); archiving a program requires the P04 level-2 confirm naming the live-card count.
**Failures**: Majed edits the same draft concurrently → CONFLICT with both payloads in `details` (baseVersion); policy out of bounds (expiry < 1 month or > 24; cap > 3) → VALIDATION with the allowed range.
**Recovery**: drafts persist indefinitely; publish is versioned and reversible only by publishing a prior version (never silent rollback); archived programs leave existing cards to complete their cycle — nothing is deleted.

## CP-2 — The counter stamp flow (the speed surface)

1. Amna opens the stamper at shift start; her staff session resolves role and locale (role gate: staff may stamp and redeem; corrections and program edits are refused here with the honest reason). `getSession`
2. A member arrives. Resolution is one gesture, three ways: scan the pass QR (camera), type the 6-character short code, or search phone/name — the search normalizes Arabic (alef variants, taa marbuta, yaa forms — rtl-rules §4) and phone digits (stripped, country-code completed). `lookupMember`
3. The card sheet renders in under a second: member identity (masked phone, locale), the stamp card (dots, count "3 من 8" in Western numerals), tier ladder with reachability, and state badges (expiring-soon, blocked, one-away). `getMemberCard`
4. She stamps: the dot fills optimistically with the 7-second undo affordance visible (P03); the adapter is authoritative — the ledger entry records actor, member, card, register time. `issueStamp`
5. Wrong member or double-tap mistake: undo within the 120s counter window, before any later stamp on the same card. `undoStamp`
6. When stamps hit the final tier, the sheet's primary action flips from stamp to redeem (the counter never offers a full-card stamp).

**Edges**: same member, same calendar day, cap reached → VALIDATION naming the cap ("one stamp per day for this card"), the staff member who stamped the earlier one, and its time — never a silent refusal; card already full → VALIDATION directing to redemption; **expired card → the stamp succeeds by opening a new card cycle** (stamps 0→1, old card archived with its unredeemed tiers lost — stated in the notice and ledgered as card-renewal; the counter never tells a paying member "no"); expiring-soon badge at ≤30 days; blocked member → PERMISSION naming the status and the manager path.
**Failures**: network drops mid-lookup → P20 banner, retry, reads cached last-known sheet; a second register stamped the same card between resolution and tap → CONFLICT, the sheet re-fetches and re-validates the cap; double-tap submit → idempotency key returns the original stamp once.
**Recovery**: undo is bounded and ledgered as its own entry; every cap-blocked attempt is recorded as a `stamp-blocked` audit entry (the flag surface's input — 07a); queued offline stamps re-validate caps and expiry against authoritative state on reconnect (P20 + async-contract §5).

## CP-3 — Reward redemption (the payoff moment)

1. The member's card sheet (resolved as CP-2.2/2.3) shows redeemable tiers — green-deep chip, icon + text, never color alone. Tier redeemability is deterministic: stamps ≥ tier requirement AND the tier not already redeemed this cycle.
2. Amna taps "استبدال المكافأة" on the redeemable tier; a P04 level-2 confirm names the tier and the reset semantics ("redeeming the final tier starts a new card — 8 stamps become 0"). `redeemReward`
3. The receipt line renders bilingually — reward name in the member's locale, actor name, time — and is spoken-aloud-ready; the member pass reflects it on next open.
4. Ladder semantics: a mid-tier redemption leaves stamps untouched (the march to the final tier continues); the final tier (or the single tier of a classic card) resets stamps to 0 and opens the next cycle. The tier's redeemed-this-cycle state blocks double redemption — a state, not an error.

**Edges**: redemption on an expired card → VALIDATION explaining what expired cards forfeit; mid-tier already redeemed → renders un-redeemable with its redemption date, no dialog; blocked member → PERMISSION with the manager path.
**Failures**: concurrent redemption at two registers → CONFLICT, the loser re-fetches and sees the tier consumed; redemption is **not undoable by design** — a mistaken redemption becomes a manager correction (`adjustStamps` with a reason code, ledgered) rather than a quiet reversal; the trade-off is stated in 00 and 12.
**Recovery**: every redemption is an immutable ledger entry with actor and tier; the dispute answer is two clicks (member detail → timeline).

## CP-4 — Member enrollment + pass delivery

1. Noura scans the counter's join QR on her phone: the join view asks name, phone, locale (three fields, P09 progressive — nothing else; no account, no email, no marketing consent). Her submission creates the member and issues the pass in one step; the staff session is represented by the workspace join code (auth-agnostic session). `enrollMember` (channel `self`)
2. Counter-assisted path for the walk-in without a phone out: Amna enters the same three fields at the stamper; the member's pass token is issued so the QR can be shown on the counter screen for the member to scan now or later. `enrollMember` (channel `counter`) → `createPassToken`
3. The pass view opens on Noura's phone, token-keyed and read-only: the wallet-style card (stamp dots filling inline-start → inline-end in her locale's direction), tier ladder with distances ("ختمان حتى الكوكيز"), and her own QR for the counter. `getPassView`
4. Staff-side follow-through: the members ledger finds her by the same normalized search; her detail shows the card timeline. `listMembers` · `getMember`
5. A name correction (or locale preference flip, or an internal note) edits the member record without touching card state. `updateMember`

**Edges**: an already-enrolled phone (normalized match) → the existing member returns with an "already a member" notice — no duplicate is ever created (07a invariant); a near-match name with a different phone → the near-match renders as a confirm-before-create (dedupe honesty); blocked member attempts self-join → PERMISSION with the manager path; Arabic name variants (ساره/سارة) resolve through normalization at lookup, disclosed at the match surface.
**Failures**: malformed phone → VALIDATION with the normalization rule shown (what was stripped, what was completed); pass token unknown/revoked → NOT_FOUND with the member-side next action (ask the counter to re-issue).
**Recovery**: pass tokens are re-issuable by manager action (CP-5.6) without losing the member or card; member records are correctable; nothing about enrollment is destructive.

## CP-5 — The manager integrity loop

1. Majed reviews the day before close on the audit surface: every consequential mutation in one filterable ledger (actor, action, member, time — P17). Filters: actor, action kind, member, date window. `listAuditEntries`
2. The flag board shows deterministic threshold flags — Rashid with 3 adjustments in the trailing 24h; a member with 2 cap-blocked attempts in 7 days — computed counts, never model verdicts; each flag links to its ledger entries.
3. A correction is needed (a stamp was issued against the wrong card): Majed opens the member card and adjusts with a reason from the enum (`counter-error`, `missing-purchase`, `goodwill`, `fraud-correction`) — the reason is mandatory, the delta may be negative, and the entry lands in the ledger with his name. `adjustStamps` (role gate: manager/owner; staff → PERMISSION naming the gate)
4. A member who photographs other people's passes gets blocked, with a reason, from the member detail. `setMemberStatus` (blocked/unblocked; reason mandatory both ways)
5. Staff lifecycle: a new hire gets a staff record with a counter PIN; a leaving shift lead is deactivated (never deleted — the ledger must keep the actor). `listStaff` · `createStaffMember` · `setStaffStatus`
6. A compromised pass QR is rotated: the member keeps the card, the old token dies. `createPassToken` (rotate)

**Edges**: negative adjustment clamps at zero — the clamp is recorded in the adjustment result, never silent; adjustment on an archived or expired card → VALIDATION explaining the boundary; blocking a member with a redeemable tier → the confirm names what freezes (redemption and stamping stop; the card state is preserved for the record).
**Failures**: staff-role caller → PERMISSION with the honest scope statement; stale card version → CONFLICT with both payloads.
**Recovery**: adjustments are immutable entries (a wrong correction is a second correction, not an edit — the append-only posture the portfolio's ledger products share); blocked members are un-blockable with a mandatory reason, symmetric by design.

## CP-6 — Insights, exports, and settings

1. The insights surface renders one program at a time as deterministic counters — stamps issued (window), redemptions, tier mix, adjustments by reason, active members, undo rate, completion rate — each count with its arithmetic disclosed on demand (a11y-baseline §4 pairing: the number is visible, the formula is one hover/panel away). `getProgramInsights`
2. Faisal exports the member list (compliance copy): a Job with declared expiry, cancellable, honest row progress. `exportMembers`
3. The artifact downloads from its link until expiry; after that, regeneration from unchanged state. `getArtifact`
4. The jobs console consolidates exports (T3 posture per async-contract §7) with link-to-context and retry. `listJobs`
5. Settings: workspace default locale, default policy values for new programs (expiry months, daily cap), member-data retention window with its statement rendered on the pass (09 privacy posture). `updateWorkspaceSettings`

**Edges**: insights on a draft program → a valid zero-count result with a draft notice (honest empty, not an error); filtered-empty declares itself (P01); export with zero members → VALIDATION explaining what an empty export would mean, offering the insights print instead.
**Failures**: NETWORK mid-export → the job declares partial delivery with a segment retry (async-contract §4); artifact expired → NOT_FOUND with the regenerate path; export quota exhausted → RATE_LIMIT with the reset time (the only metered surface, and it meters artifacts, never stamps).
**Recovery**: exports regenerate deterministically from state; jobs reconcile on re-entry (async-contract §6).

## Non-happy paths

- **Every abstract capability unbound (LOOP-5 bar, the 00 success signal)**: no sale-feed capability → staff stamp manually at the counter exactly as with paper (manual is the primary path, not the fallback); no wallet-delivery channel → the pass renders in-browser with a shareable link and a printable QR sheet; no notification channel → reward-ready renders on the counter surface and the member pass itself. The full loop — enroll, stamp, redeem, audit, export — completes with all channels off.
- **First-run**: the P22 checklist on console home links each milestone into the flow that achieves it; no tours-of-balloons.
- **Offline**: reads and the pass view work; stamps queue with per-item state and re-validate cap/expiry/CONFLICT against authoritative state on reconnect (P20; the stamp is never counted twice).
- **Reduced motion**: the stamp landing degrades to an instant fill + polite announcement (motion-language §5; 09).

## Failure → error mapping

VALIDATION (tier authoring rules, policy bounds, cap reached, full-card stamp, expired-card redemption, malformed phone, adjustment without reason, empty export) · NOT_FOUND (unknown pass token, expired artifact, stale program/member links) · PERMISSION (staff-role gates on adjustments/program edits/settings, blocked members, unconsented capability classes) · CONFLICT (concurrent card-sheet stamps, concurrent redemptions, stale program/member versions) · RATE_LIMIT (export artifacts within the window) · NETWORK (lookup and list fetches, job polling, artifact delivery) · UNKNOWN (typed retry with correlationId `lsc-corr-0001`…).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, CP-2.1 (role/locale gates) | `redeemReward` | CP-3.2 |
| `createProgram` | CP-1.2 | `enrollMember` | CP-4.1, CP-4.2 |
| `updateProgram` | CP-1.3, CP-1.4 | `createPassToken` | CP-4.2, CP-5.6 |
| `setProgramStatus` | CP-1.6 (publish), CP-1 edge (archive) | `getPassView` | CP-4.3 |
| `listPrograms` | CP-1.7, S4 lists | `listMembers` | CP-4.4, S5 ledger |
| `getProgram` | CP-1.5 (preview reads), S4 detail | `getMember` | CP-4.4, CP-5.3 |
| `lookupMember` | CP-2.2, CP-3.1 (sheet resolution) | `updateMember` | CP-4.5 |
| `getMemberCard` | CP-2.3, CP-3.1, CP-5.3 | `setMemberStatus` | CP-5.4 |
| `issueStamp` | CP-2.4 (+ CP-2 expired-card edge: renewal) | `adjustStamps` | CP-5.3 |
| `undoStamp` | CP-2.5 | `listAuditEntries` | CP-5.1 |
| `listStaff` | CP-5.5 | `createStaffMember` | CP-5.5 |
| `setStaffStatus` | CP-5.5 | `listJobs` | CP-6.4 |
| `exportMembers` | CP-6.2 | `getArtifact` | CP-6.3 |
| `getProgramInsights` | CP-6.1 | `updateWorkspaceSettings` | CP-6.5 |

28 operations, 0 orphans, 0 phantoms (Critic-verified by check_coverage.py).
