# 07c — Mock Adapter: loyalty-stamp-card

In-memory, deterministic, zero external dependencies. Implements `LoyaltyStampAdapterV1` (07b). The staff-verified stamp flow, redemption semantics, expiry derivation, flags, and insights are **computed by fixed rules over the seeded event ledger** — the same state always answers the same way. No network, no timers beyond the declared cadences, and a **fixed seeded clock**: `MOCK_NOW = 2026-10-17T09:00:00+03:00` (Saturday morning, Riyadh).

## 1. Seeds (fixed, named)

### Workspace WS-1 — "مخبز وورد" / "Ward's Bakery & Coffee"

Riyadh neighborhood bakery-and-coffee counter · timezone `Asia/Riyadh` · defaultLocale `ar` · joinCode `WARD24` (printed on the counter QR) · retentionMonths 12 · policyDefaults {expiryMonths 6, dailyStampCap 1}.

### Staff (4)

| id | name (ar/en) | role | status | fixture duty |
|---|---|---|---|---|
| ST-1 | عبدالعزيز الورد / Abdulaziz Ward | owner | active | the buyer (02 Faisal) |
| ST-2 | ماجد الشمري / Majed Al-Shammari | manager | active | corrections + redemptions (02 Majed) |
| ST-3 | أمينة حسن / Amina Hassan | staff | active | morning counter (02 Amna) — stamps most events |
| ST-4 | راشد العمري / Rashid Al-Amri | staff | active | evening counter — the 3-adjustments-in-24h flag fixture |

### Programs (2)

- **P-1 "بطاقة القهوة" / "Coffee Card"** — ladder · 8 stamps · published (version 2 = publishedVersion) · policy {expiry 6, cap 1}. Tiers: **T-1** @ 4 stamps — "كوكيز مجاني" / "free cookie" (mid) · **T-2** @ 8 stamps — "قهوة على حسابنا" / "any coffee on the house" (final).
- **P-2 "بطاقة المخبز" / "Bakery Card"** — classic · 10 stamps · **draft** (the CP-1 authoring fixture) · tier **T-B1** @ 10 — "خبز عائلي مجاني" / "family bread free" (final). Policy {expiry 6, cap 1}.

### Members (11) and cards — every fixture role seeded

| member | name (locale) | phone (canonical) | card on P-1 | fixture duty |
|---|---|---|---|---|
| M-1001 | نورة العتيبي (ar) | +966501234567 | C-1: 3 stamps, cycle 1, last stamp 10-12T08:05 | the weekly regular |
| M-1002 | سلطان الدوسري (en) | +966502345678 | C-2: 4 stamps, cycle 1, last 10-16T17:40 | **T-1 redeemable now** (CP-3 fixture) |
| M-1003 | ريم القحطاني (ar) | +966503456789 | C-3: 7 stamps, cycle 1, last 10-15T09:20 | **one stamp from the final tier** (the one-away moment) |
| M-1004 | سارة المطيري (ar) | +966504567890 | C-4: 8 stamps, cycle 2, last 10-10T08:30; cycle-1 final redemption 08-30 | **full card — T-2 redeemable; stamping it hits the full-card gate**; cycle history |
| M-1005 | محمد الأنصاري (ar) | +966505678901 | C-5: 0 stamps, opened 10-16 | brand-new member (expiry anchors to openedAt) |
| M-1006 | هدى الزهراني (ar) | +966506789012 | C-6: 5 stamps, cycle 1, last **2026-02-14T10:00** | **expired card** (8 months > 6) — the renewal-path fixture |
| M-1007 | عبدالله الغامدي (en) | +966507890123 | C-7: 2 stamps, frozen | **blocked** (reason "التقط صوراً لبطاقات عملاء آخرين", by ST-2 on 09-28; pass token rotated 09-27) |
| M-1008 | لطيفة الشمري (ar) | +966508901234 | C-8: 2 stamps (0 counter + adjustment +2) | the adjustment-ledger fixture |
| M-1009 | خالد السبيعي (en) | +966509012345 | C-9: 2 stamps (10-16T08:10 + 10-17T08:12, both ST-3; one undone pair 10-17T08:03→08:04) | **daily-cap fixture** (a third stamp today → VALIDATION naming أمينة's 08:12 stamp) + the undo pair |
| M-1010 | ساره المطيري (ar) | +966500112233 | C-10: 5 stamps, cycle 1, redeemedTierIds [T-1] (R-2 on 10-09, stampsAtRedemption 5, actor ST-4) | **name-variant normalization** (ساره vs سارة) + mid-tier-redeemed state |
| M-1011 | بدر ناصر (en) | +966501119999 | C-11: 4 stamps, cycle 3 (8 cycle-2 stamps → R-3 final redemption 10-11T18:05 by ST-2 → cycle 3: 3 counter stamps 10-12/13/14 + Rashid's net +1 adjustment) | **final-tier redemption history** + Rashid's flag ledger |

**Rashid's three adjustments (all on C-11, within the trailing 24h of MOCK_NOW)**: +1 `goodwill` 10-16T19:30 · −1 `counter-error` 10-16T20:15 · +1 `fraud-correction` 10-16T21:00 → net +1, cycle-3 stamps = 4, and the staff-adjustment-rate flag fires.

**Cap-blocked audit entries (2, trailing 7d)**: M-1009 attempts blocked 10-16T08:20 (ST-3) and 10-17T08:47 (ST-3) → the member-cap-attempts flag fires.

### Jobs & artifacts

- **J-1** export `members-csv` succeeded 10-15T14:00 (11 rows) → **A-1** expires 10-22T14:00 (regenerable).
- **A-2** export artifact from 09-20, **expired 09-27** → the NOT_FOUND fixture.
- Export quota window: 3 per rolling 7 days; used = 2 (J-1 + the 09-20 run) → the next export succeeds, the one after hits RATE_LIMIT.

### Seeded audit census (exact, for regression)

96 entries: program-created ×2 + program-updated ×3 + program-published ×2 (7) · member-enrolled ×11 + member-blocked ×1 + member-updated ×1 (13) · stamp-issued ×48 (47 live + 1 later undone) + stamp-undone ×1 + stamp-blocked ×2 (51) · reward-redeemed ×3 (R-1 08-30, R-2 10-09, R-3 10-11) · stamps-adjusted ×4 · pass-issued ×11 + pass-rotated ×1 (12) · staff-created ×3 · settings-updated ×1 · export-run ×2. No card-renewed or member-unblocked entries exist in the seed — both are exercised by the regression scripts (below).

## 2. Deterministic computation rules (fixed formulas — the product's heuristics)

### 2.1 Tier redeemability and redemption semantics

`redeemable(card, tier) ⟺ card.stamps ≥ tier.stampsRequired ∧ tier.id ∉ card.redeemedTierIds ∧ card.status ∈ {active, expiring-soon}`. On `redeemReward`: append `Redemption{stampsAtRedemption: stamps}`; if `tier.final` → `stamps := 0`, `cycle := cycle + 1`, `redeemedTierIds := []`; else → `redeemedTierIds := redeemedTierIds ∪ {tier.id}`, stamps unchanged. A `redeemReward` call against a tier already redeemed **in the current cycle** returns CONFLICT with the fresh CardView in `details` (the two-register race, 03 CP-3); the steady-state UI renders it un-redeemable with its redemption date — a state, never a silent success.

### 2.2 issueStamp eligibility ladder (evaluated in order, first failure wins)

(a) session actorKind staff ∧ role ∈ {staff, manager, owner} — else PERMISSION; (b) member.status = active — else PERMISSION (blocked, manager path named); (c) program.status = published — else VALIDATION "program not live"; (d) **daily cap**: count of non-undone counter StampEvents on this member's card for this program whose event date (workspace timezone) equals MOCK_NOW's date must be < policy.dailyStampCap — else VALIDATION with details {cap, lastActorName, lastAt} (the seeded fixture names أمينة's 10-17T08:12 stamp); (e) **expiry**: if the derived status is expired → renewal path: archive the old card (status archived, expiredAt set), open cycle+1 with stamps 0, ledger `card-renewed`, then proceed — the counter never refuses a paying member (CP-2 edge); (f) stamps < program.stampCount — else VALIDATION "card is full — redeem the reward" (seeded fixture: C-4); (g) commit: stamps + 1, lastStampAt := MOCK_NOW, ledger `stamp-issued` with actor; idempotency-key replay returns the original StampResult once.

### 2.3 Expiry derivation (lazy, at read)

`expiredAt = (lastStampAt ?? openedAt) + policy.expiryMonths` (calendar months, same day-of-month, clamped to month end). Status: `expired` iff MOCK_NOW > expiredAt; `expiring-soon` iff 0 < expiredAt − MOCK_NOW ≤ 30 days; else `active`. Seeded checks: C-6 (last stamp 2026-02-14 + 6 months = 2026-08-14 < MOCK_NOW) → expired; C-1 (10-12 + 6 months = 2027-04-12) → active; C-2 (10-16) → active.

### 2.4 Flag thresholds (fixed; counts, never verdicts)

`staff-adjustment-rate`: count of `stamps-adjusted` entries by one actor in [MOCK_NOW − 24h, MOCK_NOW] ≥ 3 → seeded TRUE for ST-4 (3 of 3 inside the window). `member-cap-attempts`: count of `stamp-blocked` entries for one member in [MOCK_NOW − 7d, MOCK_NOW] ≥ 2 → seeded TRUE for M-1009. Flags recompute on every `listAuditEntries` call; each links to its pre-filtered ledger view.

### 2.5 Insights formulas (window 30d default = [MOCK_NOW − 30d, MOCK_NOW]; seeded values in parentheses)

- `stampsIssued` = count of non-undone counter-source StampEvents in window (**34**).
- `activeMembers` = distinct members with ≥1 such event in window AND status active (**7**: M-1001/1002/1003/1004/1009/1010/1011 — M-1007 blocked, excluded).
- `redemptions` = count of Redemptions in window (**2**: R-2, R-3).
- `tierMix` = redemptions grouped by tierId (**T-1: 1, T-2: 1**).
- `adjustmentsByReason` (**counter-error: 2 · goodwill: 1 · fraud-correction: 1 · missing-purchase: 0**).
- `undoCount` (**1**).
- `completionRate` = floor(final-tier redemptions in window ÷ cards with ≥1 counter stamp in window, 2 decimal places, **floored, never rounded up**) = floor(1/7) = **0.14**.
- `avgStampsAtRedemption` = mean of `stampsAtRedemption` over window redemptions, 1 decimal (**6.5** = mean(5, 8); null when no redemptions).
- Insights on a draft program (P-2) → a valid zero-count snapshot with the draft notice (honest empty, not an error).

### 2.6 Phone canonicalization (disclosed in-product)

Strip all non-digits → drop a leading `00` → complete a bare `966…` to `+966…` → a 9-digit local number starting with 5 becomes `+966` + digits. Exact canonical match on enroll returns the existing member (duplicate members are unrepresentable — 07a invariant); near-match (same normalized name, different phone) returns the confirm-before-create token. Display hint: last 3 digits ("··· 567").

### 2.7 Name normalization for search (rtl-rules §4; disclosed at the match surface)

Strip tashkeel; أ/إ/آ → ا; ة → ه; ى → ي. Seeded regression: searching "سارة المطيري" must return both M-1004 (سارة) and M-1010 (ساره) with `normalizationApplied` listing the taa-marbuta rule.

### 2.8 Pass tokens and short codes (deterministic, no randomness)

`token = "wrd-pass-" + CODE` where CODE is a fixed 6-character base32 mapping of the member's zero-padded index through a documented substitution table (seeded table; M-1001 → `K7M2QA`, … M-1011 → `V9T4ZE`); the counter short code is the uppercased last 6 characters. Rotation mints the next code from the table (`-R1` suffix) and kills the old token; the member and card are untouched.

## 3. Behavior

- `lookupMember`: 60ms paced; QR payload, short code, and normalized search all resolve; mixed-script results render bidi-isolated (rtl-rules §2).
- `issueStamp`: 90ms commit cadence; the eligibility ladder (§2.2) evaluates in order; the seeded fixtures MUST fire exactly as declared (regression below).
- `undoStamp`: 60ms; succeeds only for the latest event on the card, source 'counter', within 120s of the event's `at` (seeded: the 10-17T08:03/08:04 pair already consumed; a fresh stamp at MOCK_NOW is undoable until 09:02) — otherwise VALIDATION naming the manager adjustment path.
- `redeemReward`: §2.1 semantics; the receipt line renders the reward name in the member's locale with the actor's name ("استبدل ماجد الشمري مكافأة 'قهوة على حسابنا' لبطاقة سارة المطيري").
- `adjustStamps`: role gate (ST-3 → PERMISSION with the honest scope line); reason mandatory; negative clamps at 0 with `clamped: true`; stale baseVersion → CONFLICT with both payloads (seeded: adjusting C-11 with baseVersion 0 while current is 2).
- `enrollMember`: canonical dedupe (exact phone → existing member + notice); near-match → confirm token; wrong joinCode on the self channel → PERMISSION naming the join surface; malformed phone → VALIDATION with the normalization rule shown.
- `getPassView`: token-keyed; unknown/rotated token → NOT_FOUND with the member-side action; the pass renders member locale with the retention statement.
- `exportMembers`: Job paced 40ms/row-chunk with determinate row progress ("تصدير الصف 8 من 11"); quota §1 (3 per 7d, used 2); `failExportSegmentOnce` → partial delivery (segment 2 of 2 fails) with per-segment retry (async-contract §4); idempotent re-submit returns the original job.
- `getArtifact`: A-1 live until 10-22T14:00; A-2 → NOT_FOUND + regenerable path.
- `listAuditEntries`: returns entries + the recomputed flag set (§2.4); filters compose.
- Error injection per method via `MockConfig { latencyMs, errorRate, errorCode, failExportSegmentOnce, quotaExhausted, blockRoleGate }`; fixed correlationIds `lsc-corr-0001`…

## 4. Error-class fixtures (all 7 classes, named)

- **VALIDATION**: (i) cap — `issueStamp(C-9)` at MOCK_NOW → cap 1 reached, details name أمينة's 10-17T08:12 stamp; (ii) full card — `issueStamp(C-4)` (8/8) → "card is full — redeem"; (iii) tier authoring — `updateProgram(P-2)` with a blank `nameEn` on T-B1 → row + rule named; (iv) empty export — `exportMembers({filter: {status: []}})` → the honest empty-export gate.
- **NOT_FOUND**: expired artifact A-2; unknown pass token `wrd-pass-UNKNOWN`.
- **PERMISSION**: staff-role `adjustStamps` as ST-3; blocked member M-1007 on `issueStamp`/`redeemReward`/self-`enrollMember`; wrong joinCode on the self channel.
- **CONFLICT**: `redeemReward(C-2, T-1)` twice in the same instant (the race window) → second call returns CONFLICT with the fresh CardView; `adjustStamps`/`updateProgram`/`updateMember` with stale baseVersion → both payloads in `details`.
- **RATE_LIMIT**: fourth export in the 7-day window (quota 3, used 2 + one live run) → reset time named; `quotaExhausted: true` forces it for tests.
- **NETWORK**: `failExportSegmentOnce` → partial artifact delivery with segment retry; `errorRate` on list fetches → stale-list banner (P20).
- **UNKNOWN**: `errorCode: 'UNKNOWN'` injection → `lsc-corr-0001` with retryable true.

## 5. Test-support

`reset()` / `snapshot()` / `replay()`: full state restore, byte-identical replays, no randomness, no network, no timers beyond the declared cadences, MOCK_NOW fixed. **Regression assertions**: (1) the C-9 cap fixture fires naming أمينة's 08:12 stamp; (2) the C-4 full-card gate fires; (3) stamping C-6 (expired) performs the renewal path — `card-renewed` ledger entry, cycle 2, stamps 1, old card archived with expiredAt; (4) T-1 redemption on C-2 leaves stamps at 4 with redeemedTierIds [T-1]; T-2 redemption on C-4 resets stamps to 0 and increments cycle; (5) Rashid's flag = 3 adjustments in 24h; M-1009's flag = 2 blocked attempts in 7d; (6) insights arithmetic equals the §2.5 census exactly (34 / 7 / 2 / tier mix / 4 adjustments / 1 undo / 0.14 floored / 6.5); (7) "سارة" search returns both M-1004 and M-1010 with the normalization disclosure; (8) canonical phone dedupe: enrolling +966501234567 returns M-1001, never a duplicate; (9) A-2 → NOT_FOUND; A-1 regenerates deterministically; (10) every error class injectable and typed per the 07b union; (11) undo window: a fresh stamp is undoable at 09:01 and refused at 09:03; (12) the pass view renders C-2's tier ladder bilingual with Western numerals in both locales.
