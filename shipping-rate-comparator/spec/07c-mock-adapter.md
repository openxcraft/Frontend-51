# 07c — Mock Adapter: shipping-rate-comparator

In-memory, deterministic, zero external dependencies. Implements `ShippingRateAdapterV1` (07b). Batch comparisons and exports are **simulated async stages** per async-contract.md: Jobs that walk queued → running (determinate unit progress) → succeeded against fixed tables — no network, no timers beyond declared cadences. All money/weight arithmetic is exact decimal (never binary floating point); the mock's replay test asserts byte-identical comparison results across resets. Seeded clock: **2026-10-17T09:30:00Z** frozen; every timestamp derives from it.

## Seeds (fixed, named)

Workspace: **"متجر الواحة" / "The Oasis Store"** — a Riyadh D2C merchant (perfume + home goods, COD-heavy, GCC cross-border arm). Members: Khalid (owner), Noura (editor), Hana (viewer — the seat that reads, runs comparisons, and exports but cannot mutate). Default currency SAR (minor digits 2), default unit system metric. All prices/volumes below are SYNTHETIC fixture values (honest mock — not market data; the research digest's third-party regional figures were NOT used as seed numbers).

### Card K1 — channel "البرق السريع" · service "التوصيل المحلي القياسي" (SAR, metric, ACTIVE, sample-flagged)
- DimPolicy: divisor 5000 · measurementRounding 'up' · roundingStep 500 g · minChargeable 500 g.
- Zones: **Z1 "المنطقة المركزية"** coverage [الرياض، القصيم، بريدة] · **Z2 "المنطقة الغربية والشرقية"** coverage [جدة، مكة المكرمة، الدمام، **الأحساء**] (the hamza-variant normalization fixture: typed "الاحساء" matches via أ→ا) · **Z3 "المناطق النائية"** coverage [تبوك، نجران، حائل] **remote = true** (the remote-surcharge fixture).
- Breaks (g → base): 1000→1500 · 3000→1950 · 5000→2400 · 10000→2800. priceByZone: Z1 [1500, 1950, 2400, 2800] · Z2 [1800, 2250, 2700, 3200] · Z3 [2200, 2700, 3300, 3800].
- Overage: 200 minor per 500 g. Surcharges: **fuel 12.5%** (1250 bps on base+overage) · **COD flat 5.00** (500) · **remote flat 15.00** (1500). Version 4.

### Card K2 — channel "سلسلة التوصيل" · service "الاقتصادي المحلي" (SAR, metric, ACTIVE, sample-flagged)
- DimPolicy: divisor **6000** (different divisor — the whole point) · 'up' · step 500 g · **minChargeable 1000 g** (the minimum-basis fixture).
- Zones: **Z-A "المركز والقصيم"** coverage [الرياض، القصيم، بريدة، الخرج] · **Z-B "الشرقية"** coverage [الدمام، الظهران] — **no جدة coverage** (the same-city-different-zone-systems fixture: جدة is Z2 on K1 and uncovered on K2).
- Breaks: 1000→1200 · 3000→1600 · 5000→2000 · 10000→2600. priceByZone: Z-A [1200, 1600, 2000, 2600] · Z-B [1400, 1800, 2300, 2800].
- Overage: 250 per 500 g. Surcharges: fuel 10% · COD flat 4.00 · remote flat 10.00. Version 2.

### Card K3 — channel "طريق الخليج" · service "الخليج العابر" (SAR, metric, ACTIVE)
- Divisor 5000 · 'up' · step 500 · min 500. **Country-level zones** (zone systems differ per card — this card rates countries, not cities): SA [السعودية] · AE [الإمارات، دبي، أبوظبي] · BH [البحرين] · KW [الكويت] · **OM [عُمان] remote = true** (tashkeel-strip fixture: typed "عمان" matches coverage "عُمان" after tashkeel removal) · QA [قطر].
- Breaks: 1000→4500 · 3000→5800 · 5000→7200 · 10000→9500. priceByZone: SA [4500, 5800, 7200, 9500] · AE [5200, 6600, 8200, 10800] · BH [4900, 6300, 7800, 10200] · KW/OM/QA [5500, 7000, 8700, 11400].
- Overage: 600 per 500 g. Surcharges: fuel 15% · **declared-value 0.5%** (50 bps — exercised only when the profile carries declaredValue) · remote flat 20.00. Version 3.

### Card K4 — channel "البرق السريع" · service "السريع السابق" (SAR, metric, RETIRED)
Last cycle's express terms; zones/breaks a subset of K1's shape; version 7. The `includeRetired` toggle fixture and the retirement-filter fixture — rating with default options never touches it.

### Card K5 — channel "Pacific Freight" · service "US Retail Ground" (USD, imperial, ACTIVE)
- DimPolicy: divisor **139 (in³/lb)** · measurementRounding **'nearest'** (per the official-carrier convention, research Q21) · roundingStep **453.59237 g (1 lb exactly)** · minChargeable 453.59237.
- Zones: R1 "West" [Los Angeles, San Francisco] · R2 "East" [New York, Boston]. Breaks (exact gram equivalents): 453.59237 (1 lb) → 850 · 1360.77711 (3 lb) → 1250 · 2267.96185 (5 lb) → 1600 · 4535.9237 (10 lb) → 2200. priceByZone: R1 [850, 1250, 1600, 2200] · R2 [900, 1300, 1650, 2250].
- Overage: 90 per 453.59237 g. Surcharges: fuel 16.5% · **handling flat 1.50**. Version 1. **The mixed-currency fixture** (USD quotes group separately from SAR — never ranked against them, 12 Q-9).

### Profiles
- **P1 "صندوق الرياض القياسي"** (sample-flagged): destination الرياض · 2400 g · dims 350×250×150 mm · no COD/declared value.
- **P2 "طقم الهدايا الكبير"** (sample-flagged): destination جدة · 1100 g · dims 500×400×300 mm · **COD 240.00 SAR** (24000 minor) — the DIM-surprise + COD fixture.
- **P3 "كرتون المخزون الثقيل"**: destination الرياض · 18000 g · no dims — the overage-beyond-table fixture.
- **P4 "صندوق العينة الأمريكي"**: destination New York · 2400 g · dims 350×250×150 mm — the K5 companion.

### Comparisons (seeded history)
- **C1** (single, P1 snapshot, cards K1+K2+K3): K1 **quoted 21.94 SAR** (Z1; volumetric 2625 g beats actual 2400 → chargeable 3000 at the 0.5 kg step; base 19.50; fuel 12.5% = 243.75 → **244, the half-up rounding fixture**) · K2 **quoted 17.60 SAR — the cheapest** (Z-A; volumetric 2187.5 < actual → chargeable 2500; base 16.00; fuel 1.60) · K3 **no-coverage** (a city name never matches a country-level zone — honest exact-match). currencyGroups [SAR].
- **C2** (single, P2 snapshot, K1+K2+K3): K1 **quoted 50.00 SAR** (Z2; volumetric 12000 g from 60,000 cm³ ÷ 5000 — the bulky-light shock; over the 10 kg ceiling → overage 4 × 200 = 800; base 32.00; fuel 12.5% × 40.00 = 5.00; COD 5.00) · K2 no-coverage (جدة) · K3 no-coverage. currencyGroups [SAR].
- **C3** (single, P3 snapshot, K1+K2): K1 **quoted 67.50 SAR** (Z1; 18 kg actual; base 28.00 + overage 16 × 200 = 32.00; fuel 12.5% × 60.00 = 7.50 — **K1 wins heavy**) · K2 quoted 72.60 SAR (Z-A; base 26.00 + overage 16 × 250 = 40.00; fuel 10% × 66.00 = 6.60). The card-mix lesson: economy wins the modal box (C1), express wins the heavy carton (C3).
- **C4** (single, P4 snapshot inline, K5): **quoted 27.71 USD** (R2; dims convert mm→in exactly ÷25.4 then round per-dimension 'nearest': 13.78→14, 9.84→10, 5.91→6 in; volume 840 in³ ÷ 139 = 6.0432 lb = 2741.1337… g volumetric vs 2400 g actual → chargeable rounds up to **7 lb = 3175.14659 g**; break (5 lb, 10 lb] → base 22.50; fuel 16.5% = 371.25 → 371; handling 1.50). currencyGroups [USD].
- **B1** (batch, P1 template, K1+K2+K3, destinations [الرياض، جدة، الدمام، تبوك، الاحساء، دبي]): الرياض → K1 21.94 / K2 **17.60 best** / K3 n-c · جدة → K1 **25.31 best** (Z2 22.50 + fuel 281.25→281) / K2 n-c / K3 n-c · الدمام → K1 25.31 / K2 **19.80 best** (Z-B 18.00 + fuel 1.80) / K3 n-c · تبوك → K1 **45.38 only-quote** (Z3 27.00 + fuel 337.5→**338** + remote 15.00) / K2 n-c / K3 n-c · الاحساء → K1 **25.31** via the alef normalization rule (matched coverage entry الأحساء — disclosed in the row) / K2 n-c / K3 n-c · دبي → K3 **75.90 only-quote** (AE; chargeable 3000 lands exactly at the 3-kg break ceiling → base 66.00; fuel 15% = 9.90) / K1 n-c / K2 n-c. Row order: exceptions desc, then normalized destination asc. duplicates 0; exceptions per row [1, 2, 1, 2, 2, 2].
- **C5** = **C3 pinned** with note "أساس التفاوض 2026 — الكرتون الثقيل / 2026 renewal baseline — heavy carton" (the pin fixture).
- **Artifact A-1**: markdown-table export of C1, created 2026-10-02T09:30:00Z with the 7-day window → **EXPIRED at the seeded clock** (the NOT_FOUND + regenerate fixture).

### Jobs history (seeded)
- import job for K1: succeeded — 24 rows pasted, 22 parsed, 2 issues (row 17: price "١٥٫٠٠" uses the Arabic decimal separator the parser rejects — re-enter digits; row 22: break 5 kg overlaps 3–5 kg) — the named-issue partial-policy fixture.
- batch job B1: succeeded — 6 destinations, determinate progress.
- export job for C1: succeeded → artifact A-1 (now expired).
- getUsage: window "monthly" · comparisons 9, batchComparisons 1 (counted, unmetered) · **exports 17 of 20 — the 85% warn-zone fixture** (P14) · resetAt 2026-11-01T00:00:00Z.

## Deterministic computation rules (fixed, exact)

### §2.1 Destination normalization + zone resolution
Normalization (rtl-rules §4, disclosed in-product): trim + collapse whitespace; strip tashkeel; أ/إ/آ → ا; ة → ه; ى → ي; Latin casefold. Zone resolution = **exact equality of normalized strings** against the card's normalized coverage entries — NO fuzzy/substring matching at v1 (12 Q-8). First matching zone wins (intra-card overlap is impossible — blocked at card save, 07a #2). No match → quote status `no-coverage` (a named row, never an error). The `resolveZone` probe and the rating path share this single matcher.

### §2.2 Volumetric weight
- Metric card: volume = L×W×H in cm (from mm ÷ 10); volumetric grams = volume_cm³ × 1000 ÷ divisor (divisor in cm³/kg ≡ mm³/g numerically — 5000 cm³/kg = 5000 mm³/g).
- Imperial card: convert each dimension mm → in **exactly** (÷ 25.4), then round per dimension per the card's policy — 'nearest' = half-up to whole inch; 'up' = ceiling; volume = integer in³; volumetric grams = in³ × 453.59237 ÷ divisor (divisor in in³/lb).
- No dimensions → volumetric = null; the comparison proceeds on actual weight only (07b contract).

### §2.3 Chargeable weight (the Settle's arithmetic)
`pre = max(actual_g, volumetric_g)` (exact rational compare — cross-multiplied, never decimal-truncated). If `pre < minChargeable_g` → chargeable = minChargeable_g, basis **'minimum'**. Else chargeable = `ceil(pre ÷ step_g) × step_g` (exact-decimal ceiling), basis 'actual' or 'volumetric' per which input produced the max. Weight conversions are exact by international definition (1 in = 25.4 mm; 1 lb = 453.59237 g) — the mock carries them as exact decimals and asserts no binary-float ever touches money or grams.

### §2.4 Price lookup + overage
Breaks sorted ascending; the matching break is the LOWEST with upToGrams ≥ chargeable (ceiling-inclusive: chargeable 3000 g lands in the ≤3000 break — the دبي fixture). Chargeable above the highest ceiling: with an overage policy → base = highest break price + `ceil((chargeable − highestUpTo) ÷ step_g)` × perUnit; without → quote status `out-of-weight-range` with the ceiling named. Zone-level prices come from priceByZone[zone.code].

### §2.5 Surcharges (each line rounds half-up at the currency's minor digits, independently)
- fuel: rateBps × (base + overage) — applied to the transport charge only, never to other surcharge lines.
- cod-flat: amountMinor when the profile carries codAmount > 0; cod-rate: rateBps × codAmount.
- remote-flat: amountMinor when the matched zone has remote = true.
- declared-value-rate: rateBps × declaredValue when declaredValue > 0.
- handling-flat: always.
Total = base + overage + Σ lines. **Sort**: ascending totalMinor within each currency group; ties broken by channelLabel (casefolded) then cardId; groups ordered alphabetically by currency code. No cross-currency ranking exists anywhere in the model (12 Q-9).

### §2.6 Import parsing (the spreadsheet escape)
Row grammar (documented in the surface, tolerant of column order): a header row declaring `zone | destination | upTo | price` per row OR a matrix form (zones as rows, breaks as columns) — the parser recognizes both; every price parses as digits with '.' or ',' decimal separators (the Arabic decimal separator "٫" is REJECTED with a named issue — never silently coerced); break values parse to grams (kg/lb suffix honored; lb converts exactly × 453.59237). Partial policy: valid rows become the draft card's zones/breaks/prices; bad rows are named with row number + reason + suggestion; re-import with the same idempotency key returns the original draft job (no double card). Completeness gate (07b rule 1) runs only at ACTIVATION — a draft may be incomplete between import sessions (P11 recall).

## Behavior

- `runComparison`: synchronous, <300ms at seed scale (10-performance budget fixture); immutable snapshot pins profile inputs + card versions; identical inputs replay byte-identically (regression assertion).
- `runBatchComparison`: Job paced 40ms/destination, determinate progress ("resolving 12 of 30" — destination counts, never percentages); `failBatchRemainderOnce` config → job fails at destination N with completed rows delivered as partial + remainder named + retry scoped to the remainder (async-contract §4).
- `computeChargeableWeight`: instant, pure, stateless; the derivation text is generated from the same code path that rates (the calculator CANNOT disagree with the comparison — the trust posture).
- `updateRateCard`/`updateShipmentProfile` stale version/timestamp → CONFLICT with both payloads; coverage overlap and ladder-gap patches → VALIDATION naming the zones/breaks involved.
- `setRateCardStatus(active)` on an incomplete card → VALIDATION naming the first missing piece, mutating nothing; retirement from draft → VALIDATION (retire-from-active only).
- `importRateCard`: paced 60ms/row-chunk; the seeded 2-issue fixture reproduces on the seeded paste; idempotent replay returns the original job.
- `exportComparison`: markdown-table + csv, with or without breakdowns; artifact expiry 7 days from creation (A-1 fixture expired); regeneration is free (snapshots immutable — `regenerable: true`); idempotent re-export returns the same artifact; `quotaExhausted` → RATE_LIMIT ladder copy (11 C) with the manual download path NEVER limited (07b rule 10).
- `setComparisonPin`: pin requires a note (VALIDATION if empty); unpin keeps the note in activity history (P17); pins are last-write-wins and logged.
- `deleteShipmentProfile`: hard delete; the UI's P03 undo window (7s) is a client-side affordance — the adapter delete is final and idempotent (replay → `{deleted: true}`).
- Error injection per method: MockConfig { latencyMs, errorRate, errorCode, failImportRowOnce (row index), failBatchRemainderOnce (destination index), quotaExhausted }; fixed correlationIds `src-corr-0001`… — every 07b error class injectable and typed.

## Test-support

reset() / snapshot() / replay(): full state restore, no randomness, no network, no timers beyond declared cadences. Regression assertions: C1's K1 fuel rounds 243.75 → 244 (half-up); الاحساء matches K1 Z2 via the alef rule and عمان matches K3 OM via tashkeel strip; دبي's 3000 g lands ceiling-inclusive in the 3-kg break (75.90); K5's imperial chain rounds per-dimension nearest (14×10×6 in) and chargeable to exactly 7 lb; C3's K1 total 67.50 beats K2's 72.60; P3 vs K2 with includeRetired=false never quotes K4; A-1 expired → NOT_FOUND + regenerable; batch partial failure delivers completed rows; every error class injectable per the 07b union; comparisons/calculator runs are never rate-limited.
