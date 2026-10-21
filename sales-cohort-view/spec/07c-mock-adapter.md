# 07c — Mock Adapter: sales-cohort-view

In-memory, deterministic, zero external dependencies. Implements `SalesCohortAdapterV1` (07b) exactly. The mock clock is **fixed at 2026-10-17T10:00:00Z**; every date comparison resolves against it. No network, no timers beyond declared cadences. **AI declaration: non-AI — the mock has no model capability to simulate, no quota surface, and no degradation ladder; every rung of every surface is deterministic.**

## 1. Seeds (fixed, named)

### 1.1 Workspace — Qamar Retail

Riyadh-headquartered omnichannel retailer (home goods and small electronics), storefront + marketplaces, markets KSA and UAE. Four members: **Nadia Al-Rashid** (owner — revenue-ops lead), **Faisal Haddad** (editor — retention analyst), **Sami Qasim** (editor — BI/data owner), **Mariam Al-Zahrani** (viewer — commercial director). Default locale en, default market KSA, calendar disclosure: "Hijri dates presented per Umm al-Qura; moon-sighting-dependent windows carry ±1 day drift" (portfolio Q-5), default granularity month.

### 1.2 Commerce source (bound)

Kind `commerce-orders`; state `bound`; coverage **2024-10-01 → 2026-10-15**; lastSyncAt 2026-10-15T06:30:00Z; revenueFieldMeaning: "net revenue: order value net of refunds and discounts, excluding shipping and tax" (the storefront metric baseline — 01 S12). `preCoverageCustomers: 132` (orders only before 2024-10-01; excluded from acquisition cohorts, counted honestly).

### 1.3 Order world (deterministic generator, no RNG)

2,412 customers · 6,847 orders. The world is BUILT from the fixture table below — a customer's population fixes their acquisition window and their per-period order probabilities; order counts per cell are the generator's output, so every seeded metric is reproducible by the engine (§2) from the world, or it does not ship. Populations (synthetic fixture values — honest mock, not market data):

| Population | Acquisition window | N₀ | Repeat-purchase-rate by period (months since acquisition) |
|---|---|---|---|
| baseline-2024Q4 | 2024-10 … 2024-12 (monthly) | 71 / 68 / 74 | P1 0.22 · P2 0.13 · P3 0.09 · P6 0.05 |
| baseline-2025 | 2025-01 … 2025-12 (monthly, non-seasonal buckets only) | 64–78/mo | same curve |
| baseline-2026 | 2026-01 … 2026-09 (monthly, non-seasonal buckets only) | 66–80/mo | same curve (observed to P6 where complete) |
| ramadan-1446-buildup | 2025-03-01 → 2025-03-10 | 96 | P1 0.23 · P6 0.06 |
| ramadan-1446-peak | 2025-03-11 → 2025-03-25 | **178** | P1 0.24 · P2 0.14 · P6 **0.07** |
| ramadan-1446-winddown | 2025-03-26 → 2025-03-30 | 41 | P1 0.21 · P6 0.05 |
| ramadan-1447-buildup | 2026-02-18 → 2026-02-27 | 121 | P1 0.26 · P3 0.12 |
| ramadan-1447-peak | 2026-02-28 → 2026-03-14 | **214** | P1 0.31 · P2 0.19 · P6 **0.11** |
| ramadan-1447-winddown | 2026-03-15 → 2026-03-19 | 47 | P1 0.27 |
| wf-2024 | 2024-11-26 → 2024-12-03 (peak phase) | **406** | P1 0.14 · P2 0.07 · P6 **0.03** |
| wf-2025 | 2025-11-25 → 2025-12-02 (peak phase) | **438** | P1 0.15 · P2 0.07 · P6 0.03 |
| eid-fitr-1446 | 2025-03-31 → 2025-04-06 | 88 | P1 0.25 · P6 0.08 |
| eid-fitr-1447 | 2026-03-20 → 2026-03-26 | 104 | P1 0.29 |
| eid-adha-1446 | 2025-06-01 → 2025-06-09 | 24 | P1 0.20 — **the N₀<30 caution fixture** |
| eid-adha-1447 | 2026-05-21 → 2026-05-29 | 31 | P1 0.22 |
| uae-nd-2025 | 2025-11-30 → 2025-12-03 (UAE market) | 8 | P1 0.25 — **the N₀<10 suppression fixture** (cells count-only) |
| uae-baseline | UAE market monthly buckets | 22–29/mo | P1 0.19 · P6 0.04 |

The engineered story (the canonical narrative the mock must reproduce): **Ramadan 1447's peak cohort retains better than 1446's at every shared period (P6: 0.11 vs 0.07, +4.0 points); White Friday cohorts are the largest acquisitions and the worst repeaters (deal-hunter story); UAE national-day 2025 is the suppression fixture; Eid al-Adha 1446 is the caution fixture.** Customer keys: `qmr-c-0001`…`qmr-c-2412`; display labels present for ~96% of customers (the missing-label fixture: keys `qmr-c-2214`…`qmr-c-2301` carry no source label — key-only rendering, 07b rule via 03 CP-2 edge). Order revenue: 85–920 SAR-range synthetic values (fixed table, currency-neutral rendering — the grid shows plain numbers with the workspace unit note).

### 1.4 Season calendar (curated, seeded)

KSA market: **Ramadan 1446** 2025-03-01 → 2025-03-30 (Hijri 1–30 Ramadan 1446; drift 1; phases: build-up d1–10, peak d11–25, wind-down d26–30) · **Ramadan 1447** 2026-02-18 → 2026-03-19 (Hijri 1–30 Ramadan 1447; drift 1; same phase tiling) · **Eid al-Fitr 1446** 2025-03-31 → 2025-04-06 (drift 1; build-up d1–3, peak d4–7) · **Eid al-Fitr 1447** 2026-03-20 → 2026-03-26 (drift 1; same tiling) · **Eid al-Adha 1446** 2025-06-01 → 2025-06-09 (drift 1; build-up d1–5, peak d6–9) · **Eid al-Adha 1447** 2026-05-21 → 2026-05-29 (drift 1; same tiling) · **White Friday 2024** 2024-11-26 → 2024-12-03 (drift 0; build-up d1–3, peak d4–8) · **White Friday 2025** 2025-11-25 → 2025-12-02 (drift 0; build-up d1–3, peak d4–8) · **Saudi National Day 2025** 2025-09-21 → 2025-09-24 (drift 0; peak 2025-09-23) · **Saudi National Day 2026** 2026-09-20 → 2026-09-24 (drift 0; peak 2026-09-23) · **Back-to-school 2025** 2025-08-14 → 2025-09-05 (drift 0; build-up d1–11, peak d12–23) · **Back-to-school 2026** 2026-08-13 → 2026-09-04 (drift 0; same tiling). UAE market: **UAE National Day 2024** 2024-11-30 → 2024-12-03 and **2025** 2025-11-30 → 2025-12-03 (drift 0; peak 12-02) · White Friday windows shared with KSA scope per market · an **overlap fixture**: a workspace-authored `eid-al-fitr` window "Eid gifting extended 1447" (2026-03-18 → 2026-03-27) created WITH an overlapOverrideNote — provenance `workspace-authored`, the same-kind overlap rule's allowed path (03 CP-3 edge).

Ramadan 1446 starts 2025-03-01; Ramadan 1447 starts 2026-02-18 — **the 11-day Gregorian drift is visible in the seeded calendar itself** (S7), which is the fixture that makes March-to-March visibly wrong.

### 1.5 Views, comparison, jobs, artifacts (seeded history)

**Views**: V1 "Monthly revenue cohorts — KSA" (gregorian · month · repeat-purchase-rate · KSA · shared) · V2 "شبكات رمضان المثبتة على الموسم — KSA" (season-anchored · month · kinds [ramadan] · includeNonSeasonalBuckets true · shared) · V3 "White Friday quality check" (season-anchored · week · kinds [white-friday] · includeNonSeasonalBuckets false). **Comparison C1** (seeded): Ramadan 1447 peak vs Ramadan 1446 peak, season-aligned, metric repeat-purchase-rate — sharedCompletePeriods 6 (the younger cohort's complete periods bound the comparison — truncation fixture), sizeImbalanceRatio 1.20, driftDisclosures [{1447-peak, 1}, {1446-peak, 1}], P6 delta +0.040. **Jobs history**: source-refresh succeeded 2026-10-15T06:30Z · sample-import succeeded 2024-10-02 (the pre-binding import: 40 rows, 2 duplicates counted) · export succeeded 2026-09-28. **Artifact A-1**: evidence pack for C1, **EXPIRED** (7-day window elapsed 2026-10-05) — the NOT_FOUND + regenerate fixture.

## 2. Deterministic computation rules (EXACT — the engine the seed cannot contradict)

### 2.1 Acquisition assignment

A customer's acquisition = the date of their FIRST order within [coverageStart, coverageEnd]. Customers whose orders all precede coverageStart are counted in `preCoverageCustomers` and belong to no cohort. Every customer belongs to exactly ONE acquisition cohort per snapshot (vendor-semantic — 01 S2).

### 2.2 Acquisition-window bucketing

`gregorian` mode: ISO weeks (Monday-start) or calendar months over the effective (coverage-clamped) range. `season-anchored` mode: one acquisition window PER PHASE of each active, in-scope season window of the filtered kinds and market (windows sorted by gregorianStart; phases tile their window per offsets); when `includeNonSeasonalBuckets` is true, the complement — calendar-month buckets overlapping no included season window — is appended as non-seasonal cohorts. A season window crossing the coverage boundary contributes its clipped portion with a partial-coverage mark (never silent).

### 2.3 Cell metrics (formulas; period i = the i-th period AFTER the acquisition period; P0 = the acquisition period itself)

- `activeCustomers(i)` = |{c ∈ cohort : c has ≥1 order in periodRange(i)}|; `activeCustomers(0)` = N₀ **by construction** (every cohort member ordered in the acquisition period — the vendor convention, disclosed as such, 01 S2).
- `repeatPurchaseRate(i)` = activeCustomers(i) / N₀ for i ≥ 1; P0 renders "—" with the by-construction note (never a misleading 100% rate cell).
- `cumulativeRevenuePerCustomer(i)` = Σ netRevenue(orders of cohort customers with orderDate ∈ [windowStart, periodRange(i).end]) / N₀.
- `ordersPerActiveCustomer(i)` = ordersInPeriod(i) / activeCustomers(i) for i ≥ 1; P0 = ordersInPeriod(0) / N₀.
- Decimal policy: rates 3 decimals rendered 1 (e.g. 0.110 → "11.0%"); revenue 2 decimals with thousands separators; counts integer. All Western numerals.

### 2.4 Honesty thresholds (data, computed at compute time — 07b rule 4)

Cell denominator < 10 → `suppressed` (value null; count-only rendering). < 30 → `caution`. Period containing coverageEnd → `inProgress` (excluded from every mean and comparison; marked). Clamps declared in `coverageClamp`. Cross-cohort means (where rendered) are **N₀-weighted** (01 S2 weighted-mean convention), disclosed in place.

### 2.5 Season composition

For each cohort: for each active season window in the cohort's market, `shareOfWindowDays` = (overlap days with the acquisition window) / (acquisition window days). Shares > 0.05 render chips (compositionChipFloor); the sentence lists parts sorted desc with the non-seasonal remainder: "Ramadan 1447 — peak: 100% of window days" (owning phase) or "2025-03: Ramadan peak 73% · Eid al-Fitr 26% · non-seasonal 1%".

### 2.6 Comparison rules

Alignment: `season-aligned` (curves indexed at P0 of each cohort's own window — Gregorian dates need not align; drift disclosures carried), `period-aligned` (cohort periods matched), `cross-season` (different kinds — labeled, composition disclosure carries the honesty). `sharedCompletePeriods` = min(complete periods of each cohort) — the comparison truncates to it and says so. Deltas computed per period on the active metric, rendered with sign and absolute points; null (suppressed) periods render count-only on both sides. `sizeImbalanceRatio` = max(N₀)/min(N₀); > 3 carries the imbalance note (still renders — analysis, not prohibition).

### 2.7 Sample/import semantics

Rows: orderDate (ISO), customerKey, netRevenue, optional channel, market. Duplicate = same (orderDate, customerKey, netRevenue) as an existing row → counted in `duplicates`, both kept. Malformed row (unparseable date, non-numeric revenue, empty key) → VALIDATION naming the first bad row; prior-good rows kept (partial policy). Sample coverage = min/max of imported row dates (declared, never assumed). Sample-only mode: every engine rule applies unchanged; `sampleOnly: true` on the source view.

## 3. Operation behavior (per method, deterministic cadences)

- `getSession`: resolves member/role/locale; fixed correlationIds `scv-corr-0001`… on errors.
- `computeGrid`: synchronous; ≤300ms at seed scale (10-performance fixture); emits the full four-metric snapshot with rulesetVersion `scv-rules-1.0.0` and the seasonWindowVersions pins. Requests whose effective range is empty (coverage clamp to zero periods) → VALIDATION naming the requested vs covered range.
- `getGrid`/`getComparison`/`getArtifact`: immutable re-reads; A-1 expired → NOT_FOUND + regenerable path (byte-identical regeneration from the pinned snapshot — verified by replay).
- `compareCohorts`: mismatched markets or unresolvable cohort ids → VALIDATION naming both; archived-window-backed season-anchored snapshot → NOT_FOUND with the restore action (07b rule 6).
- `listCustomers`: paced 60ms/row-chunk; label-missing keys render key-only with the stated reason; search normalizes per rtl-rules §4.
- `createSeasonWindow`/`updateSeasonWindow`: zero/negative-length → VALIDATION naming the field; same-kind active overlap without `overlapOverrideNote` → VALIDATION naming both windows + overlapping days; with note → allowed and logged (the seeded overlap fixture exercises the allowed path); stale baseVersion → CONFLICT with both payloads; version bumps on every accepted edit; provenance `curated` → `edited-from-curated` on first edit (never overwritten silently).
- `refreshSource`: Job staged queued 100ms → running ("syncing coverage window") → succeeded; `failSyncOnce` → failed with typed error, freshness chip degrades to stale with last-good timestamp (atomic — coverage moves only on success).
- `importOrdersSample`: paced 60ms/row-chunk, determinate row progress ("استيراد الصف 120 من 400" class copy per async-contract §3); idempotency replay returns the original job.
- `exportEvidence`: evidence pack = grid snapshot + comparison + season-window versions + ruleset version; artifact expiry 7 days; `failExportSectionOnce` → partial delivery (per-section retry, delivered sections named — async-contract §4); idempotent re-export returns the same artifact.
- `listViews`/`updateView`/`deleteView`: delete returns `sharedLinksDied` count (the P04 level-2 consequence data); viewer role on any mutation → PERMISSION (07b rule via 03 CP-5).
- `getActivity`/`listJobs`: cursor-paginated; every seeded mutation has its activity entry (window edits carry version + overlap reason in `detail`).
- `getRuleset`: returns `scv-rules-1.0.0` with the four metric formulas verbatim from §2.3, thresholds {30, 10, 0.05}, and the rules list (acquisition, bucketing, in-progress, coverage, pre-coverage, composition, comparison) — the definitions surface (S7) renders exactly this.

## 4. Failure injection (MockConfig)

`{ latencyMs, errorRate, errorCode, failSyncOnce, failExportSectionOnce, staleSourceDays, sourceUnbound }` — `staleSourceDays` shifts lastSyncAt/coverageEnd backwards (the stale-chip fixture); `sourceUnbound` switches the workspace to sample-only mode (the LOOP-5 honesty test: full flow on the imported sample). Every 07b error class injectable and typed.

## 5. Test-support

`reset()` / `snapshot()` / `replay()`: full state restore; no randomness; no network; no timers beyond declared cadences; the fixed clock never advances. **Regression assertions**: (1) Ramadan 1447 peak vs 1446 peak P6 repeat rates reproduce 0.11 vs 0.07 (delta +4.0 points) and sharedCompletePeriods 6; (2) WF-2025 P1 0.15 < baseline P1 0.22 (the deal-hunter fixture); (3) uae-nd-2025 cells render suppressed (count-only) and never a rate; (4) eid-adha-1446 carries the caution mark at every quoted period; (5) October 2026 is inProgress and excluded from means; (6) preCoverageCustomers = 132 on the source view; (7) the Ramadan windows' Gregorian starts differ by exactly 11 days (2025-03-01 → 2026-02-18); (8) the overlap fixture saves only with its override note; (9) A-1 regenerates byte-identically after expiry; (10) the full CP-1→CP-4 journey replays twice with byte-identical state (00 DoD #2).
