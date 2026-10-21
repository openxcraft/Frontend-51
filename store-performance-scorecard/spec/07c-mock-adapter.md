# 07c — Mock Adapter: store-performance-scorecard

In-memory, deterministic, zero external dependencies, implements `StoreScorecardAdapterV1` (07b). The sales-data channel (`fetchChannelSales`) is a **simulated async stage** per async-contract.md: a Job walking queued → running (milestone progress) → succeeded against fixed tables — no network, no timers beyond declared cadences. Fixed seeded clock: the workspace's "now" is **2026-10-15T09:00+03:00** (Riyadh); every timestamp the mock emits derives from it.

## 1. Seeded world (fixed, named)

**Workspace W1 — "Zad Fresh Markets" / "متاجر زاد الطازجة"**: Saudi grocery chain, market "KSA", currency SAR, weekendDays [6,7] (Saturday–Sunday; policy data per 12 Q-11), defaultLocale en. Four members: Amna (owner), Khalid (analyst), Faisal (analyst), Noura (viewer).

**12 stores** (bilingual names; codes stable):

| Code | Name (en) | Name (ar) | Format | City | Opened | Peer group |
|---|---|---|---|---|---|---|
| RYD-01 | Zad Fresh — Kingdom Centre | زاد الطازج — مركز المملكة | mall | Riyadh | 2023-03-02 | PG-mall |
| RYD-02 | Zad Fresh — Panorama Mall | زاد الطازج — بانوراما مول | mall | Riyadh | 2023-06-15 | PG-mall |
| RYD-03 | Zad Fresh — Olaya High Street | زاد الطازج — شارع العليا | high-street | Riyadh | 2022-09-08 | PG-high |
| RYD-04 | Zad Fresh — Riyadh Park | زاد الطازج — بارك الرياض | mall | Riyadh | 2024-01-11 | PG-mall |
| RYD-05 | Zad Fresh — Al Malqa | زاد الطازج — حي الملقا | community | Riyadh | 2023-10-05 | PG-comm |
| RYD-06 | Zad Fresh — Al Narjis | زاد الطازج — حي النرجس | community | Riyadh | 2024-03-14 | PG-comm |
| RYD-07 | Zad Fresh — Takhassusi | زاد الطازج — التخصصي | high-street | Riyadh | 2022-04-07 | PG-high |
| RYD-08 | Zad Fresh — Al Sulaimaniya | زاد الطازج — السليمانية | community | Riyadh | 2023-01-19 | PG-comm |
| JED-01 | Zad Fresh — Red Sea Mall | زاد الطازج — مول البحر الأحمر | mall | Jeddah | 2023-05-04 | PG-mall |
| JED-02 | Zad Fresh — Tahlia Street | زاد الطازج — شارع تحلية | high-street | Jeddah | 2022-11-03 | PG-high |
| JED-03 | Zad Fresh — Al Rawdah | زاد الطازج — حي الروضة | community | Jeddah | 2023-08-17 | PG-comm |
| RYD-12 | Zad Fresh — Qiddiya Mall | زاد الطازج — قدية مول | mall | Riyadh | **2026-03-05** (new — non-comp fixture) | PG-mall |

Peer groups: PG-mall (5), PG-high (3), PG-comm (4) — by-format rule, version 1.

**Operating patterns** (versioned; per store class):
- **Pattern P-standard v1** (all stores, effective 2024-01-01 → open-ended): morning 07:00–15:00 (Mon–Sun), evening 15:00–23:00 (Mon–Sun). openMinutes 480 each.
- **Pattern P-mall-night v1** (mall stores only: RYD-01/02/04, JED-01, RYD-12): adds night 23:00–02:00 (wrap; Thu–Sat only), openMinutes 180. The matched-capability fixture: night trades in exactly 5 mall stores; 4 are comp-eligible → night class carries the small-N caution (07c §2.5).
- **Pattern P-ramadan v1** (all stores, effective 2026-02-18 → 2026-03-19, superseding P-standard within the range): morning 10:00–16:00 (360), evening 16:00–01:00 (540, wraps), Thu–Sat night 01:00–03:00 — the Ramadan late-trading pattern (desk-research band, research digest; no statistics asserted). Records in the range carry patternVersion of P-ramadan.

**Record world** (deterministic generator, ~11,000 rows): ISO weeks 2024-W41 → 2026-W40 (104 weeks) for the 11 comp-candidate stores; RYD-12 from 2026-W10 onward. Per store, per week W, per class C trading that day:

```
weeklyBase[store]     // SAR minor: RYD-01 5,600,000 · RYD-02 4,850,000 · RYD-03 4,100,000
                      // RYD-04 5,150,000 · RYD-05 3,350,000 · RYD-06 2,950,000
                      // RYD-07 4,120,000 · RYD-08 2,600,000 · JED-01 4,900,000
                      // JED-02 3,700,000 · JED-03 2,450,000 · RYD-12 3,050,000 (ramp, see below)
yoyGrowth[store]      // netSales YoY multiplier per year: RYD-03 1.042 · RYD-05 1.051 ·
                      // JED-01 1.063 · JED-02 0.972 · RYD-07 1.031 (totals-fine fixture) ·
                      // JED-03 0.988 · others 1.01–1.03; RYD-12 none (no prior year)
ramadanMultiplier     // 1.35 for grocery during Ramadan weeks; 0.92 for Eid-al-Fitr week
shiftShare[class]     // standard: morning 0.44 / evening 0.56 (non-mall); mall adds night 0.14
                      // renormalized: morning 0.40 / evening 0.46 / night 0.14
                      // ramadan pattern: morning 0.34 / evening 0.58 / night 0.08
laborHours[class]     // standard: morning 96 / evening 108; mall night 24; ramadan: 84 / 132 / 16
weekendLift           // 1.18 on Fri+Sat (weekendDays)
transactions          // netSales / ATV where ATV[store] ∈ {38.5 .. 52.0} SAR fixed per store
```

Then per record: `netSalesMinor = weeklyBase × yoyGrowth^(yearIndex) × ramadan/weekend multipliers × shiftShare[class] / classDaysPerWeek`, rounded to 100 minor units (deterministic rounding, half-up). RYD-07's fixture overrides (the signature story): from 2026-W27, evening-class `laborHours` += 24 (a staffing bloat the totals hide) and evening `netSales` × 0.94 — so RYD-07's whole-window YoY stays ≈ +3.1% while evening-shift SPLH falls ≈ −18% and lands in the bottom decile of PG-high. JED-03 renovation fixture: 2026-W22 Tue–Sat rows absent (5 days × 2 classes) → incomplete-period mark. JED-04 coverage fixture: 2026-W39 Thu+Fri rows absent (the gap list fixture). RYD-12 ramp: weeklyBase × 0.55 in W10 growing +2%/week to × 0.85 by W40.

**Season windows** (curated defaults, market KSA, lunar windows carry driftNote "Umm al-Qura presentation; ±1 day on moon-sighting-dependent windows" per portfolio Q-5): Ramadan 1446 (2025-02-28 → 2025-03-30, lunar) · Ramadan 1447 (2026-02-18 → 2026-03-19, lunar) · Eid al-Fitr 1446 (2025-03-31 → 2025-04-02, lunar) · Eid al-Fitr 1447 (2026-03-20 → 2026-03-22, lunar) · Eid al-Adha 1447 (2026-05-26 → 2026-05-28, lunar) · White Friday 2024 (2024-11-25 → 2024-12-01, fixed) · White Friday 2025 (2025-11-24 → 2025-11-30, fixed) · Saudi National Day (fixed, annual window 09-21 → 09-23) · Founding Day (fixed, 02-22 → 02-24).

**Comp policy v1**: method 'store-period-level' (Method 2 default — the richer-data set, research S1), minTradingMonths 13. **Weights v1**: net-sales 25 · transactions 15 · atv 10 · sales-per-open-hour 20 · sales-per-labor-hour 20 · labor-cost-pct 10 (labor cost absent from seed records → weight redistributes pro-rata: 27.8/16.7/11.1/22.2/22.2 — the re-normalization rule, disclosed).

**Annotations (seeded)**: A-1 by Faisal on JED-03, 2026-05-25 → 2026-05-30, "renovation — aisles 3–4 closed" / "تجديد — ممرات ٣–٤ مغلقة" (bilingual fixture); A-2 by Amna, chain-wide, 2026-02-18 → 2026-03-19, "Ramadan trading pattern active" / "نمط تشغيل رمضان ساري".

**Seeded run R-1**: basis week-matched-yoy 2026-W27 → 2026-W40, all-days, PG-high, default KPI set — generatedAt 2026-10-12T08:15+03:00 by Khalid. Canonical story: RYD-03 top-band (score ≈ 82), JED-02 attention-band (score ≈ 31, YoY −2.8%), RYD-07 ranked mid (score ≈ 54) with its evening-shift flag carried in flags (attention-band on shift-lens evidence). **Jobs history**: import-2026-W39 succeeded (286 rows, 3 updated in place, 0 invalid) · import-2026-W40 succeeded · channel-fetch succeeded once (2026-W27, consented) · export R-1 pack succeeded, **artifact A-1 EXPIRED** (7-day window elapsed 2026-10-14 → NOT_FOUND + regenerate fixture).

## 2. Exact deterministic engine rules (the core heuristics — formulas, not vibes)

### 2.1 Comp eligibility (per run, per store)
- Method 'store-period-level' (Method 2): a (store, ISO-week) pair is comp if the store has records in BOTH the current-year week and the prior-year same-numbered week (2026-W31 ↔ 2025-W31), AND `minTradingMonths` (13) of trading precedes the current window's end (openedAt + 13×30.44 days ≤ window end). A store with SOME matched weeks but a trading span shorter than full coverage renders 'partial-period'; zero matched weeks → 'non-comp-new' (if openedAt within 13 months of window end) or 'non-comp-insufficient-history'.
- Method 'store-level' (Method 1): the store is comp only if it traded the FULL current window AND the full matched prior-year window; else excluded entirely ('non-comp-insufficient-history'). Fixture: switching to Method 1 on R-1's window drops RYD-12 (as Method 2 already did) and leaves the set unchanged at 11 — but drops JED-03's renovation week from its aggregates (its matched weeks lose W22's prior-year counterpart… none, since 2026-W22 has no current records — the partial-period mark remains visible either way).
- Closed stores (closedAt inside window) → 'non-comp-closed'.

### 2.2 Week matching + day-type
- Current window = ISO weeks [fromISOWeek..toISOWeek]; prior = same week numbers in the prior ISO-year. Weekday/weekend scope filters records by the workspace's weekendDays BEFORE aggregation (weekdays = complement).
- A matched week with <100% expected rows present is 'incomplete': it is EXCLUDED from means and COUNTED in matchedUnits with caution:true; never silently averaged (11 D).

### 2.3 KPI formulas (published verbatim on getKpiDefinitions; definitionsVersion 1)
- net-sales = Σ netSalesMinor / 100 (SAR); transactions = Σ transactionCount; atv = net-sales / transactions.
- sales-per-open-hour = net-sales / Σ openMinutes/60 (per class or window).
- sales-per-labor-hour = net-sales / Σ laborHours.
- transactions-per-open-hour = transactions / Σ openMinutes/60.
- labor-cost-pct = Σ laborCostMinor / Σ netSalesMinor × 100 (absent from seed → KPI omitted, weight redistributed §1).
- sales-per-sqm = net-sales / store.sizeSqm (only when sizeSqm set; seed sets sizeSqm on 4 stores — KPI present for those runs only, disclosed).
- conversion-rate = transactions / trafficCount × 100 (only where trafficCount present; seed supplies traffic on the 5 mall stores — the optional-input posture, 12 Q-8).
- deltaPct = (current − prior) / prior × 100, rounded 0.1; null when prior = 0 or the class/store is unmatched.

### 2.4 Shift normalization + matched classes
- Records bucket by (date, shiftClass) via the ACTIVE pattern version on that date (effective-range lookup; ties broken by latest version).
- A (store, class) pair is 'matched' for a run if the store traded that class in ≥1 matched week in BOTH years. Unmatched cells render "no trading" (never 0). A class trading in <4 stores of the peer group carries the 'unmatched-class' flag (night: 5 mall stores, 4 comp-eligible → caution, values still shown).

### 2.5 Scoring (composite)
- For each KPI in the run's kpiSet: percentile rank of the store's deltaPct among RANKED peer stores (0–100, ties share the mean rank; 0.5-offset average method, deterministic).
- score = Σ (percentile × weight) / Σ weights over KPIs present, rounded to integer 0–100.
- Ranking floor: coveragePct < 60 → ranked:false (reason text). Small-sample caution: matchedWeeks < 8 → caution:true (still ranked; the caution rides every KPI row).
- Bands: score percentile ≥ 90 → 'top-band'; ≤ 10 → 'attention-band' (flags carry text detail).

### 2.6 Composition disclosure + season-anchored basis
- For each window side: sharePct[season] = days in both window ∧ season / window days × 100, rounded to integer; unmatchedPct = remainder. Fixture: 2026-W07→W12 vs 2025-W07→W12 — Ramadan 1447 covers 100% of the current side; Ramadan 1446 covers 38% of the prior side → deltaPp = 62 ≥ 25 → misaligned:true, 'season-misaligned' flag with the composition in text.
- season-anchored basis: window = season window dates mapped to ISO weeks; prior = the SAME SEASON's prior lunar occurrence (Ramadan 1447 ↔ Ramadan 1446). Missing prior occurrence → VALIDATION (rule 3, 07b).

### 2.7 Channel simulation
- fetchChannelSales: consent flag off → PERMISSION naming the "sales-data capability" class (credential-contract language); consented → Job paced (queued 100ms → milestones "store 2 of 12" → succeeded) returning the FIXED next week's records (2026-W41, 12 stores × classes per pattern ≈ 210 rows, externalKeys `zch-<code>-<date>-<class>`) — synthetic fixture values from the §1 generator at 2026-W41 parameters.

## 3. Behavior (per operation, notable fixtures)

- `importShiftRecords`: paced 60ms/row-chunk; malformed row (empty store code / negative sales) → VALIDATION naming the first bad row + count; unknown store code → listed in unknownStoreCodes (create-or-fix is UI-side); duplicate (store,date,class) → updatedInPlace counted, latest wins; idempotency replay returns the original job. Paste path never metered (no QuotaMeter, 06).
- `runScorecard`: synchronous, ≤500ms at seed scale (10 budget fixture); zero comp-eligible stores (e.g., a window before RYD-12's trading with peer group PG-mall narrowed) → VALIDATION naming the empty set with reasons.
- `updateCompPolicy`/`upsertPeerGroup` stale baseVersion → CONFLICT both payloads; `upsertOperatingPattern` overlapping effective range → CONFLICT naming the overlap and offering the new-version shape.
- `exportScorecardPack`: leadership-pack = board + breakdowns + lens grid + composition + definitions appendix; data-csv = flat store×KPI rows; artifact expiry 7 days; `failPackSectionOnce` config → partial pack failure with per-section retry; idempotent re-export returns the same artifact.
- `getArtifact`: A-1 (R-1 pack) expired → NOT_FOUND + regenerable:true.
- Error injection per method — every 07b class injectable and typed: MockConfig { latencyMs, errorRate, errorCode: VALIDATION | NOT_FOUND | PERMISSION | CONFLICT | RATE_LIMIT | NETWORK | UNKNOWN, consentGranted, quotaExhausted, failPackSectionOnce }. quotaExhausted=true → `fetchChannelSales`/`exportScorecardPack` return RATE_LIMIT with the window reset stamped from the seeded clock (paste imports unaffected, 06 QuotaMeter rule); latencyMs+errorRate on list operations → NETWORK with stale-but-kept local state (P20 posture); unconfigured failures → UNKNOWN with fixed correlationIds `sps-corr-0001`…; CONFLICT fixtures per §3's versioned-mutation bullets; VALIDATION fixtures per the import/basis bullets above.

## 4. Reset / snapshot / replay

reset() restores the full seeded world; snapshot() captures deep state; replay(snapshot) reproduces byte-identical state — no randomness anywhere: record generation is closed-form over the §1 tables; timestamps derive from the fixed seeded clock; job cadences are declared constants.

## 5. Regression assertions (the seed cannot contradict the engines)

1. R-1 recomputed from the record world reproduces every seeded metric (RYD-03 top-band ≈ 82; JED-02 attention ≈ 31; RYD-07 mid ≈ 54 with the evening-shift flag) — byte-identical on replay.
2. RYD-12 is 'non-comp-new' with its reason text; JED-03's 2026-W22 is incomplete (excluded from means, counted); JED-04's 2026-W39 gaps appear in getCoverageSummary by date+class.
3. The composition fixture fires: 100% vs 38% → misaligned:true; switching R-1's basis to season-anchored (Ramadan 1447) re-ranks honestly and the disclosure shows both sides.
4. RYD-07's shift-lens read: whole-window YoY ≈ +3.1%, evening SPLH delta ≈ −18%, bottom decile in PG-high; morning class mid-pack.
5. Night class: 5 trading stores (4 comp) → 'unmatched-class' caution present, values rendered.
6. Method 1 toggle on the comp policy versions forward (v1→v2) and the eligibility ledger updates with the change counted.
7. Every 07b error class is injectable and typed; consent-off channel fetch → PERMISSION with capability-class language; expired artifact → NOT_FOUND + regenerate.
