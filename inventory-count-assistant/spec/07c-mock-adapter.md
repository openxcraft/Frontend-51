# 07c — Mock Adapter: inventory-count-assistant

In-memory, deterministic, zero external dependencies. Implements `InventoryCountAdapterV1` (07b). Declared non-AI: every heuristic below is exact arithmetic over fixed tables — the same state always yields the same result. Fixed seeded clock: **2026-10-17T09:00:00+03:00** (Asia/Riyadh context); all relative dates compute from it.

## Seeds (fixed, named)

### Workspace W1 — "متاجر الريّان / Rayyan Stores" (defaultLocale: ar; currency: SAR)

**Stores (2)**
- ST1 "الريّان — العليا" / "Rayyan — Olaya" (code RY-OLY)
- ST2 "الريّان — مخرج 5" / "Rayyan — Exit 5" (code RY-EX5)

**Locations (8)**
- ST1: LC1 "صالة البيع أ" / "Sales Floor A" (Z-A) · LC2 "صالة البيع ب" / "Sales Floor B" (Z-B) · LC3 "المخزن الخلفي" / "Backroom" (Z-BR) · LC4 "واجهة العرض" / "Display Window" (Z-DW) · LC5 "قفص القيم العالية" / "High-Value Cage" (Z-HV)
- ST2: LC6 "صالة البيع" / "Sales Floor" (Z-S) · LC7 "المخزن الخلفي" / "Backroom" (Z-BR2) · LC8 "منطقة الاستلام" / "Receiving Area" (Z-RC)

**Catalog (28 items; Saudi GS1-style EAN-13 barcodes with 628 prefix — SYNTHETIC fixture values, structurally authentic, not registered codes)**

| sku | barcode | nameAr | nameEn | unit | unitCost (SAR) |
|---|---|---|---|---|---|
| TC-1001 | 6281001000019 | ترمس سيراميك 0.5 لتر | Ceramic travel tumbler 0.5 L | piece | 39.00 |
| TC-1002 | 6281001000026 | زجاجة ماء معزولة 750 مل | Insulated water bottle 750 ml | piece | 45.00 |
| TC-1003 | 6281001000033 | دلة قهوة ١٠٠٠ مل | Arabic coffee dallah 1000 ml | piece | 89.00 |
| GL-2001 | 6281002000018 | طقم أكواب زجاجي 6 قطع | Glass tumbler set 6 pieces | set | 55.00 |
| GL-2002 | 6281002000025 | — | Glass teapot | piece | 62.00 |
| KD-3001 | 6281003000017 | سجادة صلاة مخملية | — | piece | 75.00 |
| KD-3002 | 6281003000024 | سجادة صلاة فاخرة | Premium prayer rug | piece | 149.00 |
| HL-4001 | 6281004000016 | لمبة LED موفرة 9 واط | LED bulb 9 W | piece | 12.00 |
| HL-4002 | 6281004000023 | لمبة LED ذكية متغيرة اللون | Smart color-changing LED bulb | piece | 34.00 |
| HL-4003 | 6281004000030 | شاحن جداري سريع 20 واط | Fast wall charger 20 W | piece | 29.00 |
| HW-5001 | 6281005000015 | مقلاة هوائية 5.5 لتر | Air fryer 5.5 L | piece | 379.00 |
| HW-5002 | 6281005000022 | خلاط يدوي 400 واط | Hand blender 400 W | piece | 129.00 |
| HW-5003 | 6281005000039 | غلاة ماء كهربائية 1.7 لتر | Electric kettle 1.7 L | piece | 119.00 |
| BT-6001 | 6281006000014 | بطارية متنقلة 20000 مللي أمبير | Power bank 20000 mAh | piece | 149.00 |
| BT-6002 | 6281006000021 | سماعات لاسلكية | Wireless earbuds | piece | 199.00 |
| BT-6003 | 6281006000038 | كابل شحن مجدول 1 م | Braided charging cable 1 m | piece | 19.00 |
| GM-7001 | 6281007000013 | علبة تمر فاخرة 1 كجم | Premium dates box 1 kg | box | 95.00 |
| GM-7002 | 6281007000020 | قهوة عربية بالزعفران 250 جم | Saffron Arabic coffee 250 g | pack | 68.00 |
| GM-7003 | 6281007000037 | شوكولاتة محشوة بالتمر | Date-filled chocolates | box | 42.00 |
| GM-7004 | 6281007000044 | مكسرات مشكلة 400 جم | Mixed nuts 400 g | pack | 49.00 |
| TX-8001 | 6281008000012 | منشفة ميكروفايبر 3 قطع | Microfiber towels 3-pack | pack | 25.00 |
| TX-8002 | 6281008000029 | بطانة سرير قطنية | Cotton bed sheet set | set | 189.00 |
| TX-8003 | 6281008000036 | وسادة دعم للرقبة | Neck support pillow | piece | 79.00 |
| BW-9001 | 6281009000011 | معطر جو بخاخ 300 مل | Air freshener spray 300 ml | piece | 18.00 |
| BW-9002 | 6281009000028 | مبخرة كهربائية | Electric incense burner | piece | 99.00 |
| BW-9003 | 6281009000035 | عود بخور ملكي 12 قطعة | Royal agarwood bakhoor 12 pcs | box | 220.00 |
| KJ-9101 | 6281010000010 | مغرفة قهوة خشبية | Wooden coffee scoop | piece | 9.00 |
| KJ-9102 | 6281010000027 | أكواب قهوة عربية 6 قطع | Arabic coffee cups set of 6 | set | 65.00 |

Regression fixtures inside the catalog: TC-1003's Arabic name carries **Arabic-Indic digits (١٠٠٠)** while its English name carries Western digits (1000) — the numeral-render and numeral-search fixtures; BT-6003 has **no barcode** (type/search fallback fixture); GL-2002 carries an English name only and KD-3001 an Arabic name only (incomplete-label fixtures, one per direction — the "—" cells above).

**Book register (StockLevel rows; explicit rows listed; all other item×store pairs carry the fixed default row: expectedQty 5, source manual-paste, lastCountedAt 2026-09-01T00:00+03:00)**

ST1 explicit rows: TC-1001 qty 48 lastCounted 2026-06-20 · TC-1002 qty 36 lastCounted 2026-06-20 · TC-1003 qty 22 lastCounted 2026-08-12 · HW-5001 qty 14 lastCounted 2026-08-12 · BT-6001 qty 0 lastCounted 2026-08-12 (zero-book fixture) · BT-6002 qty 22 lastCounted 2026-08-12 · GM-7001 qty 63 lastCounted 2026-06-20 · KD-3001 qty 30 lastCounted 2026-06-20 · KD-3002 qty 18 lastCounted 2026-06-20 · BW-9003 qty 9 lastCounted 2026-06-20 · TX-8002 qty 16 lastCounted 2026-06-20 · GL-2001 qty 40 lastCounted 2026-06-20 · HL-4002 qty 5 lastCounted 2026-06-20. (HW-5002 and all unlisted items carry the default row, lastCounted 2026-09-01.)
ST2 explicit rows: GM-7001 qty 40 lastCounted 2026-09-24 · HL-4001 qty 260 lastCounted 2026-09-24 · HW-5001 qty 9 lastCounted 2026-09-24 · BT-6002 qty 15 lastCounted 2026-09-24 · BW-9003 qty 7 lastCounted 2026-09-24 · TC-1001 qty 25 lastCounted 2026-09-24.

**Policies (3)**
- CP-1 "سياسة التجزئة القياسية" / "Retail Standard": absTolerance 2, pctTolerance 5, valueTolerance unset, bandStrategy union, autoRecount true, classIntervals {A: 30, B: 90, C: 180}, sliceSize 40. Active default.
- CP-2 "القيم العالية" / "High-Value Strict": absTolerance 0, pctTolerance 2, valueTolerance 300, bandStrategy intersect, autoRecount true, classIntervals {A: 14, B: 60, C: 120}, sliceSize 25. Applied to High-Value Cage sessions.
- CP-3 (draft, INVALID fixture): pctTolerance −1 → `savePolicy` VALIDATION with field-level error ("pctTolerance must be ≥ 0").

**Counters (typed rosters, no seats)**: amal — "أمل القحطاني / Amal Al-Qahtani" (locale ar) · sami — "سامي الحربي / Sami Al-Harbi" (locale ar) · faisal — "فيصل العتيبي / Faisal Al-Otaibi" (locale ar).

**Count sessions (4 + sample)**

- **CS-1 (closed, historical)**: ST2 full count, 2026-09-24, directed, CP-1 v1, scope = all 28 items, counters amal+sami. 27 within tolerance, 1 out: GM-7001 expected 40 counted 37 → recount 37 → review → resolved accept-count (note: "أُتلف صندوقان تالفاً — تم الإعدام بوثيقة" / two damaged boxes written off) → adjustment posted from 40 to 37 (delta −3). IRA = 27/28 = **96.4%** (computed within ÷ counted, 07a). Artifact AR-1 (variance-report) **EXPIRED** (30-day window elapsed at seed clock → NOT_FOUND + regenerable fixture).
- **CS-2 (reconciling — the demo fixture)**: ST1 cycle-slice, blind, CP-1 v1, scope = 14 items (the accepted seed-time proposal: 9 A-class + 5 B-class overdue items), counters amal+sami, revealed 2026-10-17T08:40+03:00. 12 counted, 2 uncounted (gate fixture). Variances: BW-9003 9→9 within · GM-7001 63→63 within · KD-3002 **uncounted** (gate) · TX-8002 **uncounted** (gate) · BT-6001 0→3 → expected 0 → pctDelta undefined → judged by abs rule |3| > 2 → out → **recount-pending** fixture (the zero-book case) · BT-6002 22→0 → |−22| > max(2, round(0.05×22)=1) → out → **recount-pending** · HW-5001 14→7 → recount by sami → 7 → still out (|−7| > max(2, 1)) → **review-required** fixture · TC-1003 22→22 within (the late entry, below) · HW-5002 5→5 within (default-row A item) · GL-2001 40→40 within · HL-4002 5→5 within · KD-3001 30→29 within (incomplete-label fixture — English name absent) · TC-1001 48→47 within (band max(2, round(0.05×48)=2)=2; |−1|≤2) · TC-1002 36→35 within. Late-entry fixture: at reveal TC-1003 was uncounted (11 counted, 3 uncounted); a late entry submitted 08:52 (after the 08:40 reveal) counted 22 → flagged lateEntry → now 12 counted, 2 uncounted — the mid-reconciliation correction path, recorded, never hidden.
- **CS-3 (open, directed)**: ST1 zone count of LC5 "قفص القيم العالية" / "High-Value Cage", CP-2 v1, directed, scope = 6 items (HW-5001, BT-6001, BT-6002, BT-6003, BW-9003, KD-3002), counter faisal. 5 entries submitted with inline directed variance in the acks (e.g., BW-9003 expected 9 counted 9 → within shown inline; KD-3002 uncounted). The directed-mode fixture.
- **CS-4 (draft, first-run sample — P22)**: "جلسة عيّنة" 8-item mini scope drawn from the catalog with 2 planted easy variances (one within, one out by 1 unit against absTolerance 1 in the sample policy) so the blind-reveal moment is experienceable with zero real data; cleared in one action, never mixed into exports unless explicitly included.
- **CS-5 (cancelled fixture)**: ST2 zone count cancelled 2026-09-28 with note "أُلغيت — عدّاد غير متاح" (counter unavailable).

**Jobs history (5)**: catalog-import succeeded (28 rows, 0 duplicates, 0 invalid) · stock-import ST1 succeeded (28 rows applied, 0 invalid) · stock-import ST2 succeeded (28 rows applied, 2 invalid rows named — partial fixture: "qty must be an integer ≥ 0" rows for two synthetic entries) · report-export CS-1 succeeded (variance-report; artifact expired) · report-export CS-2 (none — CS-2 not closed; exports gate on closed sessions, VALIDATION fixture).

**Activity log**: seeded with the consequential mutations above (session-created/opened/revealed, entry-submitted, recount-requested, variance-resolved, adjustment-posted, report-exported, stock-imported, catalog-imported, policy-saved).

## Deterministic computation rules (exact; the product's heuristics)

1. **Search normalization pipeline** (rtl-rules §4): strip tashkeel; أ/إ/آ → ا; ة → ه; ى → ي; case-fold Latin; trim. Applied to `nameAr` at index time and to queries; `nameEn`, `sku`, `barcode` match on trimmed case-folded values. **Numeral-form folding is NOT applied** — "1000" does not match "١٠٠٠" (declared limitation, 12 Q-8). Regression assertions: query "سجاده صلاة" (taa-marbuta written as heh) MUST match KD-3001; query "زجاجه ماء معزوله" MUST match TC-1002 (ة→ه and ى→ي together); query "dallah" MUST match TC-1003 via nameEn.
2. **ABC classification (Pareto over stock value)**: compute value share per item = unitCost × Σ(expectedQty across stores); sort desc; cumulative share < 80% → A; < 95% → B; else C; ties keep the value-desc order. Computed on import and on stock updates. Seed outcome (fixed): A = {HW-5001, BW-9003, BT-6002, TX-8002, GM-7001, KD-3002, TC-1003, BT-6001, HW-5002} (9) · B = {TC-1001, TC-1002, KD-3001, GL-2001, GL-2002, HL-4002, HL-4003, HW-5003, GM-7002, GM-7003, GM-7004, TX-8003, BW-9002, KJ-9102} (14) · C = {HL-4001, BT-6003, TX-8001, BW-9001, KJ-9101} (5). Regression assertions: HW-5001 is A; HL-4001 is C; KD-3001 is B.
3. **Cadence proposal**: for each active item with a register row at the store: interval = policy.classIntervals[effectiveClass]; daysSince = (clock − lastCountedAt) in days, or (clock − register creation) when never counted; overdueRatio = daysSince / interval; select items with overdueRatio ≥ 1, ordered by overdueRatio desc, ties by sku asc, capped at min(policy.sliceSize, input.limit). At seed clock with CP-1 on ST1 this MUST return exactly the 14-item scope of CS-2 — 9 A-class (BW-9003, GM-7001, KD-3002, TX-8002 at ratio 3.97; BT-6001, BT-6002, HW-5001, TC-1003 at 2.2; HW-5002 at 1.53) + 5 B-class (GL-2001, HL-4002, KD-3001, TC-1001, TC-1002 at ratio 1.32) — regression assertion.
4. **Variance computation**: at reveal, for every scope item: expectedQty = register row (snapshot, frozen into the Variance); countedQty = latest non-superseded entry (recount kind preferred when present); delta = counted − expected; absDelta = |delta|; pctDelta = expected > 0 ? round(absDelta / expected × 100, 1) : undefined; valueDelta = absDelta × unitCost; band = per rule 5; outcome = within iff absDelta ≤ band AND (valueTolerance unset OR valueDelta ≤ valueTolerance); uncounted items → state 'uncounted' with countedQty undefined.
5. **Tolerance band**: union → max(absTolerance, round(pctTolerance/100 × expectedQty)); intersect → min(same). Round half-up. Examples (CP-1, union): expected 48 → max(2, 2.4→2) = 2; expected 63 → max(2, 3.15→3) = 3 (GM-7001 63→63 within by 0; a hypothetical 63→59 would be |−4| > 3 → out — the worked-example fixture in the policy editor renders exactly this pair).
6. **Recount flow**: out-of-tolerance at reveal + autoRecount → variance state recount-pending with an auto request (reason "تلقائي — خارج السماحية" / auto — outside tolerance); recount entry (kind recount) recomputes countedQty from the recount; still out → review-required; within → auto-accepted (the recount is the final count).
7. **IRA**: session IRA = withinTolerance ÷ countedItems × 100 (rounded to one decimal); store IRA = latest closed session's IRA per store; a store with no closed session renders the no-data state, never 0 (11 A).
8. **Adjustment posting**: at finalize, for every variance with final state auto-accepted-or-resolved whose accepted countedQty ≠ expectedQty → adjustment (fromQty = expected, toQty = accepted count, delta signed, reason = resolution note or auto "قبل العدّ" / per count); register row updates (expectedQty = toQty, lastCountedAt = closedAt, source = session-adjustment). Within-tolerance items keep book quantities — no noise adjustments, ever (the tolerance's entire point).
9. **Entry pacing + acknowledgment**: `submitCountEntry` acknowledges in a fixed 40ms; import jobs pace 60ms/row-chunk (determinate row progress); export jobs pace 150ms/format. No timers beyond these declared cadences.

## Behavior (per operation, error-class fixtures)

- `importCatalogItems`: duplicate sku → counted in `duplicates`, both rows kept verbatim; row without any name → VALIDATION naming the row index + prior-good rows kept (partial); idempotent replay returns the original job.
- `updateStockLevels`: source 'stock-channel' with `consentGranted: false` → PERMISSION naming the stock-level capability class (credential-contract language); manual-paste always succeeds; negative or fractional qty → VALIDATION naming rows; unknown sku/barcode rows → `unknownItems` listed, valid rows still applied (partial); idempotent.
- `savePolicy`: CP-3 fixture (pctTolerance −1) → VALIDATION with field error; stale baseVersion → CONFLICT with both payloads; intervals < 1 or sliceSize outside 1..500 → VALIDATION.
- `proposeCycleSlice`: deterministic per rule 3; store without register rows → empty items list with computedAt (an honest empty, not an error).
- `createCountSession`: unknown policy/store/locations → NOT_FOUND; empty scope → VALIDATION; counters roster may repeat names (typed refs must be unique — duplicate ref → VALIDATION).
- `openCountSession`/`cancelCountSession`/`closeCountSession`: state-machine closure per 07b rule 2; reveal on CS-3 (already open) computes variances including KD-3002 uncounted; finalize on CS-2 → VALIDATION gate with `uncountedItemIds: [KD-3002, TX-8002]` and `unresolvedItemIds: [HW-5001, BT-6001, BT-6002]`; finalize after resolving/counting all → closed + adjustments posted (fixture: accepting HW-5001 at 7 posts from 14 to 7) + IRA computed.
- `submitCountEntry`: blind session → ack WITHOUT `directed` (rule 3 — regression assertion); directed session CS-3 → ack WITH `directed` (expected/delta/band/outcome inline); non-scope item → VALIDATION naming the item; scan double-fire (same idempotencyKey) → original entry returned, progress unchanged; entry in `closed`/`cancelled` state → VALIDATION naming state; entry while `draft` → VALIDATION (open first).
- `updateCountEntry`: bumps revision, marks predecessor superseded; legal only in `open` (CS-2 is reconciling → VALIDATION naming state — the correction-vs-recount boundary fixture); stale baseRevision → CONFLICT.
- `requestRecount`: on an uncounted item → VALIDATION (nothing to compare); on a resolved variance → CONFLICT; manual request on within-tolerance → allowed (recorded, reason required by UI).
- `resolveVariance`: keep-book without note → VALIDATION demanding the reason; resolving the already-resolved CS-1 variance → CONFLICT; accept-count on BT-6001 (0→3) legal (note optional — recount evidence stands).
- `listVariances`: post-reveal sessions expose full rows; the never-revealed blind CS-4 (draft) returns no rows for its scope (rule 3 — nothing to hide, nothing to show).
- `exportCountReport`: only closed sessions (CS-2 reconciling → VALIDATION "close the session first"); CS-1 → variance-report artifact AR-1 EXPIRED → `getArtifact` NOT_FOUND + regenerable path; `failExportFormatOnce` config → partial bundle (variance-report delivered, adjustment-sheet failed) with per-format retry; idempotent re-export returns the same artifact.
- `getUsage`: window "monthly"; exports 3 of 10 (30% — calm, no warning); imports 5 of 50; resetAt 2026-11-01.
- Error injection per method: MockConfig { latencyMs, errorRate, errorCode, consentGranted, quotaExhausted, failExportFormatOnce }; fixed correlationIds `ica-corr-0001`…

## Test-support

`reset()` / `snapshot()` / `replay()`: full state restore; no randomness; no network; no timers beyond the declared cadences. Regression assertions (fixed): the normalization queries of rule 1; ABC classes of rule 2; the 14-item CS-2 proposal of rule 3; blind acks carry no `directed`; the CS-2 finalize gate lists exactly its two uncounted + three unresolved items; HW-5001 accept-count posts the 14→7 adjustment and stamps lastCountedAt; within-tolerance items post no adjustments; CS-1 IRA reads 96.4; AR-1 expiry returns NOT_FOUND; every 07b error class injectable and typed.
