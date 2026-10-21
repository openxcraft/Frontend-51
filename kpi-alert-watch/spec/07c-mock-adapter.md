# 07c — Mock Adapter: kpi-alert-watch

In-memory, deterministic, zero external dependencies. Implements `KpiAlertWatchAdapterV1` (07b). Capability paths (`syncMetricFeed`, the narration assist) are **simulated async/generative stages** per async-contract.md and ai-native-patterns.md — fixed tables, no network, no timers beyond declared cadences. Fixed seeded clock: **2026-10-17T08:00+03:00 (Saturday, Riyadh — quick-commerce runs seven days; the morning digest covers Friday 2026-10-16)**.

## 1. Seeds (fixed, named)

### Workspace — "Sidra Market" (سوق سدرة), Riyadh quick-commerce group
Workspace defaults: `defaultLocale: 'en'` · `baselineWindowWeeks: 8` · `evaluationCadence: 'daily'`.

**Members (5)**
- M1 **Hessa Al-Otaibi** — owner, editor, locale en (ops lead; owns F1, F2, F6)
- M2 **Tariq Al-Harbi** — editor, locale en (marketing lead; owns F4)
- M3 **Amal Nasser** — editor, locale en (growth lead; owns F3 — the bilingual bridge)
- M4 **Fahad Al-Qahtani** — editor, locale ar (support lead; owns F5)
- M5 **Shaikha Al-Mansouri** — viewer, **digest-reader** seat, locale ar (regional director; weekly bilingual digest is her entire product)

### Series world — 6 feeds × 89 daily points (2026-07-20 .. 2026-10-16)

**Generation rule (EXACT, per feed):** for day index `i` (i = 0 at 2026-07-20, +1 per day) with weekday `w` (w = i mod 7, where day 0 is Monday → w: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun):

```
value(i) = round1( base × weekdayMult[w] × (1 + weeklyTrend × floor(i / 7)) + noise(i) )
noise(i) = ((i × 7) mod 13 − 6) / 10 × noiseScale        // deterministic, period-13, range ±0.6 × noiseScale
```

Fixture overrides are applied AFTER generation (exact pinned values replace the formula at pinned dates). F3 additionally multiplies by 1.35 inside SW1 (season surge is in the DATA, so post-window baselines re-arm honestly).

| Feed | nameEn / nameAr | unit | direction | base | weekdayMult (Mon..Sun) | weeklyTrend | noiseScale | fixture overrides (date → value) |
|---|---|---|---|---|---|---|---|---|
| F1 | Average delivery time / متوسط زمن التوصيل | minutes | lower-is-better | 30.5 | [0.98, 0.97, 0.99, 1.06, 1.08, 1.03, 1.02] | +0.001 | 4.0 | 09-17→37.0 · 09-24→36.8 · 10-14→35.1 · 10-15→37.2 · 10-16→34.9 |
| F2 | Order completion rate / معدل إتمام الطلبات | % | higher-is-better | 94.2 | [1.01, 1.01, 1.00, 0.99, 0.985, 1.00, 1.00] | 0 | 0.6 | 09-24→88.4 · 10-15→92.2 |
| F3 | Daily online store sales / المبيعات اليومية للمتجر | SAR | higher-is-better | 41000 | [1.00, 1.00, 1.02, 1.12, 1.15, 1.08, 1.05] | +0.0025 | 900 | 08-25→40100 · 10-16→46500; ×1.35 in SW1; points 08-12 & 09-02 quality=invalid |
| F4 | Blended acquisition cost / تكلفة الطلب الإعلانية | SAR | lower-is-better | 18.6 | [1.00, 0.99, 0.99, 1.02, 1.04, 1.06, 1.09] | 0 | 0.5 | 10-05→21.6 · 10-06→21.2 · 10-15→23.4 · 10-16→23.9 |
| F5 | CSAT score / تقييم رضا العملاء | score | higher-is-better | 4.42 | [1.005, 1.005, 1.00, 0.99, 0.985, 1.00, 1.00] | 0 | 0.09 | 10-10→4.33 |
| F6 | COD rejection rate / نسبة رفض الدفع عند الاستلام | % | lower-is-better | 6.2 | [0.98, 0.98, 1.00, 1.05, 1.07, 1.02, 1.00] | 0 | 0.35 | 10-11→8.9 |

Invalid-point fixture: F3's 2026-08-12 and 2026-09-02 points carry `quality: 'invalid'` (value 0, marked) — the honest-gap fixture: the engine skips them in baselines, the series chart renders them as gaps, and ingest job J2's result names them (`invalidRows`).

### Season windows (4)

| Id | nameEn / nameAr | dates | effect | feeds | state at clock |
|---|---|---|---|---|---|
| SW1 | Saudi National Day / اليوم الوطني السعودي | 2026-09-23 → 2026-09-26 (endsAt exclusive) | both | F1, F2, F3 | past |
| SW2 | White Friday / الجمعة البيضاء | 2026-11-24 → 2026-12-01 | surge | F3, F4 | queued |
| SW3 | Ramadan / رمضان | 2027-02-08 → 2027-03-10 | both | (none — honest empty: "no feeds attached") | queued |
| SW4 | UAE National Day / اليوم الوطني للإمارات | 2026-12-02 → 2026-12-04 | surge | F3 | queued |

### Watches (6)

| Id | feed | policy (v1 unless noted) | tier | status |
|---|---|---|---|---|
| W1 | F1 | threshold absolute: warning 34, critical 40, sustained 2, tier digest · anomaly 2.5σ tier digest | digest | active |
| W2 | F3 | anomaly 2.5σ tier digest (no threshold layer) | digest | active |
| W3 | F4 | threshold percent-vs-baseline: warning 12%, critical 20%, sustained 2, **tier page** (the explicit opt-in fixture) | page | active |
| W4 | F2 | threshold absolute: warning edge 90 (value ≤ 90 offends — direction-aware), sustained 1, tier digest | digest | active |
| W5 | F5 | anomaly 2.0σ tier digest | digest | active |
| W6 | F6 | threshold absolute: warning 8, critical 10, sustained 1, tier digest | digest | **paused** — pausedReason "season review", resumeAt 2026-10-21 |

### Detections (11)

Baseline math (the engine's rule, §2): expected = same-weekday mean over the 56 days ending 7 days before the point (season-window points and invalid points excluded); σ = same-weekday std over the same set; z = (observed − expected) / σ. Seeded detection values below are the values this rule computes from the seeded series (regression assertions pin them; render rounds to one decimal).

| Id | watch/feed | kind | tier | at (point date) | observed | baseline | deviation | status |
|---|---|---|---|---|---|---|---|---|
| D1 | W1/F1 | anomaly-deviation | digest | 2026-10-15 (Thu) | 37.2 | ≈32.6 | +3.1σ | open |
| D2 | W1/F1 | threshold-warning (sustained 3: 10-14, 10-15, 10-16) | digest | 2026-10-16 (Fri) | 34.9 | ≈33.4 | +4.5% | open |
| D3 | W2/F3 | anomaly-deviation | digest | 2026-10-16 (Fri) | 46,500 | ≈47,720 | −3.6σ | open |
| D4 | W3/F4 | threshold-critical (sustained 2: 10-15, 10-16) | **page** | 2026-10-16 (Fri) | 23.9 | ≈19.3 | +23.8% | open — the page-class banner fixture |
| D5 | W4/F2 | threshold-warning, seasonAdjusted: true (inside SW1) | digest | 2026-09-24 (Thu) | 88.4 | ≈93.3 | −5.3% | **dismissed** — reasonCode 'expected-behavior', note "National Day order surge overload — known", by Hessa |
| D6 | W5/F5 | anomaly-deviation | digest | 2026-10-10 (Sat) | 4.33 | ≈4.42 | −2.7σ | acknowledged by Fahad |
| D7 | W6/F6 | threshold-warning | digest | 2026-10-11 (Sun) | 8.9 | ≈6.2 | +43.5% | **snoozed** until 2026-10-20, reason "awaiting courier confirmation cycle" |
| D8 | W2/F3 | anomaly-deviation | digest | 2026-08-25 (Tue) | 40,100 | ≈41,205 | −3.3σ | acknowledged by Tariq |
| D9 | W1/F1 | anomaly-deviation | digest | 2026-09-17 (Thu) | 37.0 | ≈32.6 | +2.9σ | **dismissed** — reasonCode 'known-cause', note "rain storm week", by Hessa — the dismissal-journal overlap fixture |
| D11 | W3/F4 | threshold-warning (sustained 2: 10-05, 10-06) | digest-class item (warning severity under a page-tier policy) | 2026-10-06 (Tue) | 21.2 | ≈18.4 | +15.2% | acknowledged by Tariq |

Two structural facts the regression suite pins (recorded, not hidden): (1) **the seed set is 10 detections: D1–D9 + D11** — no anomaly watch exists on F2 (W4 is threshold-only and cannot emit anomaly detections; the "no anomaly layer on this feed" editor state is an honesty fixture), so no F2-anomaly detection is seeded. (2) **D11 pins the tier/severity split**: a page-TIER policy emits warning-SEVERITY items as digest-class — only critical-severity items interrupt (07b rule 2's exactness fixture; 07a SeverityTier vs DeviationKind are orthogonal).

### Digests (3)

- **DG1 — daily, 2026-10-16** (assembled 2026-10-17T08:00, from evaluation E-17): page-class section holds **D4**; digest-class sections: F1 (D1, D2), F3 (D3). Season notes: none (SW1 past, nothing active on 10-16). Delivery: M1/M2/M3/M4 console records 'delivered'; M5 'pending' (weekly-only preference).
- **DG2 — weekly, week 2026-10-04..10-10** (assembled 2026-10-11T08:00): sections F5 (D6), F4 (D11). Delivery records: M3 console 'delivered'; M5 external-channel — **first attempt failed (NETWORK, correlationId kaw-corr-0007), retry succeeded** (`retryOf` lineage — the delivery partial-failure fixture).
- **DG3 — daily, 2026-09-24** (assembled 2026-09-25T08:00): section F2 (D5, seasonAdjusted) + **season note SW1: "نافذة موسمية: اليوم الوطني السعودي نشطة — الرصد الموسمي معلّق لـ3 من التغذيات. قواعد العتبة تبقى نافذة." / "Season window: Saudi National Day active — seasonal watching paused for 3 feeds. Threshold rules remain live."** Delivery: console records only.

### Jobs history (5)

J1 ingest F1 (succeeded; 89 points, 0 duplicates) · J2 ingest F3 (succeeded; 89 points, invalidRows: 2026-08-12, 2026-09-02) · J3 evaluation live E-17 (2026-10-17T07:30; 5 active watches — W6 paused; detectionsEmitted: 4 = D1, D2, D3, D4; seasonSuspendedFeeds: []) · J4 digest-delivery DG2 (succeeded after per-member retry — the M5 record) · J5 sync F2 via capability (succeeded; addedPoints 7 — the consented-capability fixture, consentGranted default true in the seed config).

## 2. Deterministic engine rules (EXACT)

### 2.1 Baseline computation (per point t, per feed)
- Window: the 56 days ending 7 days before t (the 1-week lag keeps an anomaly out of its own baseline). Excluded from the window's sample: points inside ANY active season window whose feedIds include this feed, and points with `quality: 'invalid'`.
- expected(t) = mean of same-weekday values in the window; σ(t) = their standard deviation (population). If the window holds < 6 same-weekday points → the anomaly layer returns "insufficient history" for t (threshold layers unaffected — they need no history).
- z(t) = (observed − expected) / σ. deviationPercent = (observed − expected) / expected × 100 (signed).

### 2.2 Threshold layer (per policy ThresholdBandSpec)
- Absolute mode: a point offends when the value crosses the band edge in the feed's BAD direction (lower-is-better: value ≥ edge; higher-is-better: value ≤ edge). Percent mode: a point offends when deviationPercent crosses ±edge in the bad direction (magnitude toward the bad side).
- Severity: warning edge < critical edge; crossing critical wins. sustainedPoints N requires N consecutive offending points (the detection's `at` = the LAST point of the run; `sustainedPoints` = run length). Season windows do NOT suspend threshold layers (declared hard limits).
- Tier: from the policy (digest default; 'page' only by explicit opt-in — 07b rule 2).

### 2.3 Anomaly layer (per policy AnomalyLayerSpec)
- Fires when |z| > sensitivitySigma AND the point is NOT inside an active season window for this feed. Inside such windows the point is marked `seasonAdjusted: true` and the anomaly layer is silent — the digest's season note is the disclosure (never a silent pass).
- Direction-aware wording: for lower-is-better feeds, z > +s is "rose above"; for higher-is-better feeds, z < −s is "fell below" (template table §2.5). minHistoryPoints: 14 — a feed with fewer valid points reports "insufficient history" and the watch editor offers threshold-only mode (03 CP-1 edge).

### 2.4 Backtest mode (07b rule 3)
- Runs §2.1–2.3 over the stored series for [clock − windowDays, clock − 1] (default 60 days) with the candidate policy; returns counts, per-watch breakdown, season-window intersections (detections with `seasonAdjusted: true`), and **dismissal-journal overlap**: backtest detections whose (feedId, offending date, kind) match a dismissed detection's record. Seeded regression: **W1's current policy over trailing 60 days = 4 detections** — anomaly 09-17 (journal overlap: D9), threshold-warning 09-24 season-adjusted (season intersection: SW1), anomaly 10-15, threshold-warning sustained 10-16.

### 2.5 Explanation template tables (fixed bilingual pairs; number slots only — no machine translation anywhere)

| templateId | English (slots in braces) | Arabic |
|---|---|---|
| `anomaly.above.worse` | "{nameEn} rose to {observed}{unit} — {z} standard deviations above its {weekdayEn} baseline of {baseline}{unit} (trailing {weeks} weeks)." | "ارتفع {nameAr} إلى {obsval}{unit} — بفارق {z} انحراف معياري فوق خط أساس {weekdayAr} البالغ {baseline}{unit} (آخر {weeks} أسابيع)." |
| `anomaly.below.worse` | "{nameEn} fell to {observed}{unit} — {z} standard deviations below its {weekdayEn} baseline of {baseline}{unit} (trailing {weeks} weeks)." | "انخفض {nameAr} إلى {observed}{unit} — بفارق {z} انحراف معياري تحت خط أساس {weekdayAr} البالغ {baseline}{unit} (آخر {weeks} أسابيع)." |
| `threshold.warning.absolute` | "{nameEn} crossed the warning threshold: {observed}{unit} against the warning edge of {edge}{unit}, sustained {n} point(s)." | "تجاوز {nameAr} حد التحذير: {observed}{unit} مقابل حد تحذير قدره {edge}{unit}، لمدة {n} من النقاط." |
| `threshold.critical.absolute` | "{nameEn} crossed the critical threshold: {observed}{unit} against the critical edge of {edge}{unit}, sustained {n} point(s)." | "تجاوز {nameAr} الحد الحرج: {observed}{unit} مقابل حد حرج قدره {edge}{unit}، لمدة {n} من النقاط." |
| `threshold.warning.percent` | "{nameEn} deviated {pct}% from its {weekdayEn} baseline of {baseline}{unit} — observed {observed}{unit}, past the warning band of {edge}%." | "انحرف {nameAr} بنسبة {pct}% عن خط أساس {weekdayAr} البالغ {baseline}{unit} — القيمة المرصودة {observed}{unit}، متجاوزاً نطاق تحذير قدره {edge}%." |
| `threshold.critical.percent` | "{nameEn} deviated {pct}% from its {weekdayEn} baseline of {baseline}{unit} — observed {observed}{unit}, past the critical band of {edge}%." | "انحرف {nameAr} بنسبة {pct}% عن خط أساس {weekdayAr} البالغ {baseline}{unit} — القيمة المرصودة {observed}{unit}، متجاوزاً النطاق الحرج قدره {edge}%." |
| `season.note` (digest-level) | "Season window {windowEn} active — seasonal watching paused for {n} feed(s). Threshold rules remain live." | "نافذة موسمية: {windowAr} نشطة — الرصد الموسمي معلّق لـ{n} من التغذيات. قواعد العتبة تبقى نافذة." |
| `season.suspended.point` (detection context chip) | "Point inside season window {windowEn} — seasonal watching suspended." | "نقطة داخل نافذة موسمية: {windowAr} — الرصد الموسمي معلّق." |
| `baseline.disclosure` | "Baselines are same-weekday means over the trailing {weeks} weeks, excluding season-window points; the deviation is measured in same-weekday standard deviations." | "خطوط الأساس هي متوسطات أيام الأسبوع المطابقة خلال آخر {weeks} أسابيع، باستثناء نقاط النوافذ الموسمية؛ ويقاس الانحراف بانحرافات معيارية على الأساس نفسه." |
| `snooze.resumed` | "Watching resumed after snooze." | "استؤنف الرصد بعد الكتم المؤقت." |

Weekday slot values: EN Monday..Sunday; AR الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت، الأحد. All number slots render **Western numerals in both languages** (ledger row; storage canonical, display formatted); percent sign renders "%" in both.

### 2.6 Digest assembly (EXACT)
- Daily digest for date X assembles from the evaluation results whose detections carry `at` = X (completed runs only; the as-of evaluation id is stamped). Weekly digest for week [Sun..Sat] assembles from that week's detections. Items echo the detection's ExplanationPair verbatim (immutable echo, 07a). Page-class items collect into `pageClassItems` (held at top of both language sections); digest-class items group by feed. Season notes render for every window active on the digest's date, naming the suspended-feed count. Quiet day: zero digest-class and zero page-class items → `quietDay: true` with the honest copy (11 §A).
- `generateDigest` is idempotent per (period, date): the same day re-renders byte-identical (07b rule 7).

## 3. Narration assist simulation (mode 'assist', when `assistEnabled`)

- `narrateDetection(D1)` with assist enabled returns the template pair verbatim PLUS a fixed appended narrative, `provenance: 'assist'`:
  - assistEn: "Context: a deviation of this size appeared previously on 17 Sep and was dismissed as a rain storm. Thursday and Friday are the week's structural peaks (+6% to +8%); this Thursday exceeds the seasonal pattern rather than following it."
  - assistAr: "السياق: ظهر انحراف بهذا الحجم سابقاً في 17 سبتمبر وجُهِل لكونه أسبوع أمطار. الخميس والجمعة ذروتان هيكليتان في الأسبوع (+6% إلى +8%)؛ وهذا الخميس يتجاوز النمط الموسمي بدل أن يتبعه."
- `narrateDetection` with `assistEnabled: false`, `quotaExhausted: true`, or the capability unbound returns the template pair with `provenance: 'template'` and **no assist fields** — the degradation IS the default text (07b rule 1); quota exhaustion additionally returns the RATE_LIMIT ladder notice through the usage surface, never through the narration text.
- Deterministic, offline, fixed strings — the simulated generative stage touches nothing else.

## 4. Behavior (per operation)

- `ingestMetricPoints`: paced 60ms/row-chunk; malformed row (no value) → VALIDATION naming the first bad row, prior-good rows kept (partial policy); duplicate date → counted in `duplicates`, both kept (real behavior: re-pasted snapshots are counted, not silently merged); invalid-value rows (e.g. 0 for a rate feed) land as `quality: 'invalid'` and are named in the job result; idempotency-key replay returns the original job.
- `syncMetricFeed`: `consentGranted: false` → PERMISSION naming the metric-source capability class (credential-contract §2 kind-not-vendor language); consented → Job paced in fixed stages (queued 100ms → running "feed 1 of 1" → succeeded) appending 7 fixed points to F2 (source 'capability').
- `runEvaluation`: live/catch-up = Job, 100ms per watch, atomic per watch (07b rule 9); backtest = synchronous BacktestReport (≤300ms at seed scale, 10-performance budget fixture); mid-run policy edits apply next run and the job stamps the version used; catch-up mode stamps true offending timestamps and marks the run 'catch-up'.
- `updateDetectionStatus`: the closed machine is enforced — snooze `days ∈ {1,3,7,14}` and reason required (else VALIDATION); dismissal requires reasonCode; `snoozed → open` only via the expiry sweep (clock advanced past `until`) which emits `snooze.resumed`; stale `baseStatus` → CONFLICT with both payloads.
- `updateWatch`/`upsertSeasonWindow`: stale baseVersion → CONFLICT; pause requires pausedReason (resumeAt defaults to season-window end when the reason is a season).
- `deleteWatch`: returns retainedDetectionCount (records persist in the journal — 07a); a feed with live watches refuses cascade-free deletion (VALIDATION naming the watches — the fence).
- `generateDigest`/`deliverDigest`: assembly synchronous and idempotent; delivery Job fails per-member with `failDeliveryOnce` config (NETWORK, fixed correlationId kaw-corr-0007) and succeeds on per-member retry; the digest document is never lost to a delivery failure.
- `getUsage`: window "monthly"; narrationAssists 3 of 20; capabilitySyncs 6; digestDeliveries 9; resetAt 2026-11-01 (the 80% warning-zone fixture is NOT set — 3/20 is calm; the RATE_LIMIT rung-2 copy is exercised via `quotaExhausted`).
- Viewer-role mutations (watch/policy/status/season/preferences-for-others) → PERMISSION naming the seat's honest scope (11 §C).
- Error injection: MockConfig { latencyMs, errorRate, errorCode, assistEnabled, consentGranted, quotaExhausted, failDeliveryOnce, invalidPointInjection }; fixed correlationIds `kaw-corr-0001`… — every 07b error class injectable and typed per the union.

## 5. Test-support

reset() / snapshot() / replay(): full state restore, no randomness, no network, no timers beyond the declared cadences; clock advanced deterministically via `advanceClockTo(iso)` (the snooze-expiry fixture requires 2026-10-20T08:00+03:00). Regression assertions:
1. Baseline math reproduces D1/D3/D8's seeded numbers from the seeded series (the engine is the source of truth — a seeded value that disagrees does not ship).
2. W1 backtest over trailing 60 days = 4 detections, with the D9 journal overlap and the 09-24 season intersection present.
3. D5 renders seasonAdjusted with the season-note disclosure in DG3; threshold layers still fired inside SW1 (hard limits ignore seasons).
4. A threshold-only watch (W4) never emits anomaly detections (the corrected D10 impossibility).
5. Snooze expiry re-opens D7 with the `snooze.resumed` event; a snooze at 14 days is accepted, 15 refused (VALIDATION).
6. `generateDigest` idempotency: same (period, date) returns byte-identical documents.
7. assist-off `narrateDetection` returns the template pair with provenance 'template' and zero content loss (the 00 success signal 3).
8. Every error class injectable and typed per the 07b union; PERMISSION fires for unconsented sync and viewer mutations.
