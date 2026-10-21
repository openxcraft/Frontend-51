# 07c — Mock Adapter: funnel-drop-off-explorer

SME-G pass · The mock is SPEC, not implementation: it defines the data and behavior a development environment must reproduce. Fully in-memory, deterministic, zero external dependencies, no network, no timers beyond declared cadences. It implements `FunnelDropOffAdapterV1` (07b) exactly — all **35 operations**. A CI run twice produces byte-identical transcripts, including anneal iteration traces, narration strings, and event order. The four deterministic engines (funnel computation §2.1, segment annealing §2.2, breakdown §2.3, transition detail §2.4, taxonomy lint §2.5) are PURE functions shared between seed-build and runtime: the mock COMPUTES every seeded metric from the seeded event world, so the engines and the data cannot drift (the house rule: a seeded metric that the engines cannot reproduce does not ship — 00 §Mock-Adapter Definition-of-Done).

## 1. Deterministic seed dataset (fixed, named; never random)

**Workspace**: `ws-wasl` (bilingual-en; "Wasl Commerce — تجارة وصل", a Riyadh delivery super-app growth team). **Fixed clock**: the mock's "now" is frozen at `2026-10-20T10:00:00+03:00` (Riyadh offset). Every freshness age, artifact expiry, digest timestamp, and staleness chip is computed against this instant, never wall-clock. The clock advances ONLY through the declared cadences in §2.6 (import row progression 8 rows / 1.6s; workspace-event replay 60ms/event) and `reset()` restores it.

### 1.1 People (5 named users; roles span the permission matrix)

| id | displayName | role | locale | purpose in fixtures |
|---|---|---|---|---|
| `u-omar` | Omar Al-Rashid / عمر الراشد | analyst | en | the daily canvas persona; author of the seeded analysis and anneal run |
| `u-reem` | Reem Haddad / ريم حداد | analyst | en | the taxonomy owner; author of taxonomy versions; CP-4 persona |
| `u-layla` | Layla Farsi / ليلى فارسي | admin | ar | workspace owner; the anneal-policy publisher (CP-6.2); tablet review posture |
| `u-sara` | Sara Qassem / سارة قاسم | viewer | ar | evidence consumer; the seeded annotation author (review posture) |
| `u-nadia` | Nadia Idrissi / نادية إدريسي | viewer | en | digest-only teammate; invite/role-change fixtures (CP-6.3) |

**AnnealPolicy default v1** (published by `u-layla` at `2026-10-06T09:30:00+03:00`): `minSupportFormula: 'floor30-or-2pct'`, `minSupportOverride: null`, `epsilon: 0.02`, `depthCap: 4`, `excludedAxes: []`, `version: 1`.

### 1.2 Event source (one bound source + the paste path)

`src-01` — kindLabel "product event stream" (capability language, kind-not-vendor; credential-contract §2), health `active`, `lastFreshAt: 2026-10-20T08:00:00+03:00` (2h before the frozen clock — the "fresh" chip fixture), coverageNotes null (the bound source covers the full range). The paste-sample path (CP-1.2, 08 N1 manual alternative) imports bounded samples as pseudo-sources; two paste fixtures ship (§1.7).

### 1.3 The bilingual event taxonomy (18 events; deliberate lint fixtures marked)

Properties declared per event; the three **user-constant segmentable axes** (`platform` enum [web, ios, android], `tenure` enum [new, returning], `locale` enum [ar, en]) are declared on the five funnel-step events; `locale` additionally permits unset (observed NULL) — the honest-null axis fixture (03 CP-6.9). Lint fixtures in the right column reproduce the classes 03 CP-4.1 names; the lint report computed from this table (§2.5) yields exactly **12 violations / 6 errors / 6 warns — 4 naming, 3 bilingual labels, 3 properties, 2 governance** (the 06 LintReportPanel example string, reproduced by construction).

| id | canonicalName | labelEn | labelAr | actor | status | owner | observedCount (28d) | used by funnels | seeded lint fixture |
|---|---|---|---|---|---|---|---|---|---|
| `ev-01` | App Installed | App installed | تثبيت التطبيق | system | active | u-reem | 41,970 | f-1 | platform observed "huawei" on 3 installs → `property-undeclared-value` (warn) |
| `ev-02` | Onboarding Completed | Onboarding completed | إكمال التهيئة | user | active | u-omar | 12,604 | f-1 | clean |
| `ev-03` | First Search | First search | أول بحث | user | active | u-omar | 9,318 | f-1, f-2 | clean |
| `ev-04` | Add to Cart | Add to cart | إضافة إلى السلة | user | active | u-omar | **41,203** | f-1, f-2, f-3 | clean; item-level cart adds — the usage-count fixture ("used by 3 funnels — 41,203 events in range", 03 CP-4.2 / 06 StepComposer) |
| `ev-05` | Order Placed | Order placed | إتمام الطلب | user | active | u-omar | 3,112 | f-1, f-2, f-3 | clean |
| `ev-06` | App Exited | App exited | الخروج من التطبيق | system | active | u-reem | 11,240 | — | clean; displaced-path rank 1 |
| `ev-07` | Restaurant Page Viewed | Restaurant page viewed | عرض صفحة المطعم | user | active | u-omar | 38,411 | f-2 | `dwellSeconds` (number, non-segmentable) observed "long" on 2 rows → `property-type-mismatch` (warn) |
| `ev-08` | Support Chat Opened | Support chat opened | فتح محادثة الدعم | user | active | u-omar | 612 | — | clean; displaced-path rank 3 |
| `ev-09` | Promo Code Viewed | Promo code viewed | عرض رمز الخصم | user | active | u-sara | 1,973 | — | clean |
| `ev-10` | Menu Item Shared | Menu item shared | مشاركة صنف من القائمة | user | active | u-sara | 844 | — | clean |
| `ev-11` | Payment Error Shown | Payment error shown | ظهور خطأ في الدفع | system | active | u-reem | 217 | — | clean |
| `ev-12` | Message Sent | Message sent | إرسال رسالة | user | active | u-reem | 2,408 | — | `naming-actor` (warn): agent-ambiguous name (§2.5 rule 4) |
| `ev-13` | Referral Link Copied | Referral link copied | (empty) | user | active | u-omar | 331 | — | `label-ar-missing` (error) — THE Arabic-label-gap fixture |
| `ev-14` | Old Checkout Viewed | Old checkout viewed | عرض الدفع القديم | user | **deprecated** | u-reem | 96 | f-3 (legacy-acknowledged) | `deprecated-referenced` (warn) — the deprecated-event-still-referenced fixture |
| `ev-15` | Loyalty Card Added | Loyalty card added | ربط بطاقة الولاء | user | active | (null) | 487 | — | `owner-missing` (warn) |
| `ev-16` | Restaurant Rating | Restaurant rating | تقييم المطعم | user | active | u-reem | 12 | — | `naming-syntax` (error): noun-only, no past-tense verb |
| `ev-17` | Shared Menu | Shared menu | (empty) | user | active | u-sara | 205 | — | `naming-syntax` (error, verb-first) + `label-ar-missing` (error) |
| `ev-18` | promocode applied | Promo code applied | (empty) | user | active | u-reem | 158 | — | `naming-case` (error) + `label-ar-missing` (error) |

Taxonomy version: 7 (seven seeded change versions — the activity trail carries one entry each). `ev-14`'s deprecation was resolved `acknowledge-legacy` on f-3 (the CP-4.4 demo continues from here). Non-segmentable property example: `resultCount` (number) on `ev-03` — the "not declared segmentable — ask your taxonomy owner" graying fixture (03 CP-2.2).

### 1.4 Funnels (3 saved)

| id | name (EN/AR) | steps (event → ordering) | window | status | seeded computation (28d range) |
|---|---|---|---|---|---|
| `f-1` | Activation — checkout / التفعيل — الدفع | ev-01 → ev-02 → ev-03 → ev-04 → ev-05, sequential | 7d (168h) | active v3 | **400 → 348 → 271 → 185 → 121** (overall 30.25%; largest seam 3: 86 lost of 271, 31.7%; slowest step 3: median 41m) |
| `f-2` | Search to order / من البحث إلى الطلب | ev-03 → ev-07 → ev-04 → ev-05, sequential | 3d (72h) | active v1 | 271 → 198 → 149 → 87 (overall 32.1%) |
| `f-3` | Legacy checkout view / مسار الدفع القديم | ev-14 (legacy) → ev-04 → ev-05, any order | 14d (336h) | active v2 | 24 → 11 → 5 — **seam 1 population 24 < support floor 30**: the anneal-launcher refusal fixture (03 CP-3 edge) |

### 1.5 The event world (400 users, 28 days, engineered leak)

**Range**: `2026-09-22T00:00:00+03:00` → `2026-10-19T24:00:00+03:00` (28 complete days, ending the day before the frozen clock — analytics convention). **Users**: pseudonymous keys `u-0001`…`u-0400` (install cohort). The world is a set of FIXED aggregate tables (below) plus a deterministic per-user expansion rule: users are assigned properties and funnel progress by walking each table in fixed ordinal order (user ordinal n takes row n of the expanded table; row order is part of the seed). The engines compute over the expanded per-user events; the aggregates below are therefore reproducible by construction.

**Funnel progression (f-1, sequential, 7d window from first step-1 instance — the documented vendor semantics, 01 §3 q16):** 400 entrants → 348 complete ev-02 → 271 complete ev-03 → 185 complete ev-04 → 121 complete ev-05. Seam losses: 52 (13.0%), 77 (22.1%), **86 (31.7%)**, 64 (34.6%) — the largest seam by absolute decrease is seam 3 (86), while seam 4 carries the highest RATE (34.6%): the fixture teaches the absolute-vs-percentage distinction the interpret docs publish (q20). Medians/p90 per seam: seam 1 median 6m / p90 44m; seam 2 median 22m / p90 5h; **seam 3 median 41m / p90 570m (9h 30m) — the slowest transition**; seam 4 median 18m / p90 3h.

**Trend windows (7-day, disjoint, getFunnelTrend over the range — the 06 TrendSpark string reproduces verbatim):**

| window | dates | entryUsers | converted | conversionRate (1dp) |
|---|---|---|---|---|
| W1 | 09-22 → 09-28 | 121 | 40 | 33.1% (40/121) |
| W2 | 09-29 → 10-05 | 72 | 23 | 31.9% (23/72) |
| W3 | 10-06 → 10-12 | 104 | 30 | 28.8% (30/104) |
| W4 | 10-13 → 10-19 | 103 | 28 | 27.2% (28/103) |

(The W2 entry dip is the campaign-cohort story — launch-week installs, paid-cohort trough, organic recovery; entries sum 400, conversions sum 121, both consistent with the cascade.)

**The seam-3 contingency table (the engineered leak — tenure × platform × locale over the 271 ev-03 completers; cells are users/dropped):**

| cell | ar | en | unset | total (users/dropped) |
|---|---|---|---|---|
| new ∧ web | 36 / 22 | 16 / 10 | 8 / 4 | **60 / 36** (60.0% drop-off — THE CHAIN) |
| new ∧ ios | 40 / 14 | 22 / 5 | 8 / 2 | 70 / 21 (30.0%) |
| new ∧ android | 12 / 4 | 5 / 1 | 3 / 1 | 20 / 6 (30.0%) |
| returning ∧ web | 32 / 10 | 20 / 3 | 8 / 1 | 60 / 14 (23.3%) |
| returning ∧ ios | 44 / 9 | 13 / 0 | 4 / 0 | 61 / 9 (14.8%) |
| **totals** | **164 / 59** | **76 / 19** | **31 / 8** | **271 / 86** (31.7% baseline) |

Derived marginals (the engine computes these; the mock's verification table asserts them): tenure=new **150/63** (42.0%, +10.3pts, sep 0.0764); tenure=returning 121/23 (19.0%, −12.7pts — protective); platform=web **120/50** (41.7%, +9.9pts, sep 0.0661); platform=ios 131/30 (22.9%, −8.8pts — protective); platform=android 20/6 (30.0%, −1.7pts; **size 20 < floor 30** — the "below the support floor — 20 of 271" fixture, 03 CP-3.2); locale=ar 164/59 (36.0%, +4.2pts, sep 0.0330); locale=en 76/19 (25.0%, protective); locale unset 31/8 (25.8%, protective; excluded from candidates, rendered in breakdowns — the honest-null row).

**Displaced paths (seam 3, the 86 lost users' next events within 14 days; ranked by count, ties lexicographic; top-8):** App Exited **31** (36.0% of lost) · Restaurant Page Viewed **19** (22.1%) · Support Chat Opened **11** (12.8%) · Promo Code Viewed 8 · Menu Item Shared 5 · Payment Error Shown 4 · Message Sent 3 · (no subsequent event — "left the product") 5. Sum 86. The 03 CP-2.3 ribbon string "App Exited 31 · Restaurant Page Viewed 19 · Support Chat Opened 11…" reproduces verbatim.

**Time distribution (seam 3 continuers, 185 users; fixed bucket edges — §2.4):** <5m: 20 · 5–15m: 30 · 15–60m: 75 · 1–6h: 40 · 6–24h: 12 · 1–3d: 5 · 3–7d: 3. Median (ceil-index 93rd of sorted minutes) = **41m**; p90 (ceil-index 167th) = **570m**. Per-user minutes are fixed table values within each bucket (seed data), so the percentiles are byte-stable.

**Ambient streams** (non-funnel event volume; fixed per-user count tables summing to the observedCount column of §1.3 — e.g. ev-04 fires 41,203 item-level add instances across the 400 users): the totals are pinned in §1.3 and the expansion rule reproduces them; nothing in the UI renders a number that is not either a table total or an engine output over the tables.

### 1.6 Seeded evidence (anneal run, analysis, cohort, jobs, activity, notifications)

**AnnealRun `r-1`** — run by `u-omar` at `2026-10-19T16:40:00+03:00` on `f-1` seam 3, range = the 28-day range, policy = default v1. The full deterministic trace (engine §2.2 over the §1.5 tables) is the 03 CP-6.9 walkthrough result, asserted here as the mock's verification table:

| iteration | candidates (size/dropped → rate, excess pts, sep, eligibility) | admitted | reason |
|---|---|---|---|
| 1 | tenure=returning 121/23 → 19.0%, −12.7, sep 0.0850, INELIGIBLE negative-excess · **tenure=new 150/63 → 42.0%, +10.3, sep 0.0764, ELIGIBLE** · platform=web 120/50 → 41.7%, +9.9, sep 0.0661, eligible · platform=ios 131/30 → 22.9%, −8.8, sep 0.0614, ineligible (negative-excess) · locale=en 76/19 → 25.0%, −6.7, sep 0.0357, ineligible · locale=ar 164/59 → 36.0%, +4.2, sep 0.0330, eligible · platform=android 20/6 → 30.0%, −1.7, sep 0.0047, ineligible below-support-floor (20 of 271) | tenure=new (argmax eligible; 0.0764 > 0 + ε) | admitted-improvement |
| 2 | **platform=web (new∧web) 60/36 → 60.0%, +28.3, sep 0.1330, ELIGIBLE** · locale=ar (new∧ar) 88/40 → 45.5%, +13.7, sep 0.0782, eligible · locale=en (new∧en) 43/16 → 37.2%, +5.5, sep 0.0218, eligible · platform=ios (new∧ios) 70/21 → 30.0%, −1.7, sep 0.0088, ineligible (negative-excess) · platform=android (new∧android) 20/6 → sep 0.0047, ineligible below-support-floor · tenure=returning 0/0 → contradicts-chain | platform=web (0.1330 > 0.0764 + 0.02) | admitted-improvement |
| 3 | **locale=ar (chain∧ar) 36/22 → 61.1%, +29.4, sep 0.1071, ELIGIBLE — but 0.1071 < 0.1330 + 0.02** · locale=en (chain∧en) 16/10 → 62.5%, +30.8, sep 0.0748, ineligible below-support-floor (16 < 30) · tenure=returning 0/0 → contradicts-chain · platform=ios 0/0 → contradicts-chain · platform=android 0/0 → contradicts-chain | none — stop | no-improvement |

Final chain: `[tenure = new ∧ platform = web]` — chainSize **60**, chainDropOffRate **60.0%** (36/60), baseline 31.7%, excess **+28.3 points**, excessHeadcount **round(60 × 0.2827) = 17** ("~17 excess drop-offs"). Iteration 3 is the teaching row: locale=ar inside the chain drops at 61.1% — HIGHER than the chain — yet loses on separation because coverage (36/271) is small; the greedy search trades excess against support, visibly (07b rule 5). `inputHash` = SHA-256 over the canonical serialization `f-1|3|2026-09-22T00:00:00+03:00|2026-10-19T24:00:00+03:00|168|sequential|floor30-or-2pct|null|0.02|4||taxonomy-v7` (pipe-joined, UTF-8); an identical re-submission — even under a fresh idempotency key — returns `r-1` unchanged (07b rule 2: the anneal is a pure function and the contract admits it).

**Analysis `a-1`** — "Checkout activation leak — First Search to Add to Cart / تسرّب تفعيل الدفع — من البحث الأول إلى الإضافة للسلة" by `u-omar`, created `2026-10-19T17:05:00+03:00`, shared with the workspace; pins f-1 v3 + its metrics row + `r-1`; carries 1 segment (`seg-1` = the chain, labelEn "new-tenure users on web", labelAr "مستخدمون جدد على الويب", origin r-1); narrative `n-1` (engine `template-metrics` — the model capability ships UNBOUND by default; §3) composed per the 11 §D templates; 1 annotation by `u-sara` ("هل هذا مرتبط بنسخة الويب الجديدة؟ / is this tied to the new web release?"). Drift on re-open (rule 9): `none` while the world is unchanged — the drift fixtures (`data-moved`, `chain-no-longer-reproduces`) are exercised by the world-shift test hook (§4 `replay`).

**Cohort `c-1`** — "Web new-user leak — week 41 / تسرّب مستخدمي الويب الجدد — الأسبوع 41", materialized from `seg-1` by `u-omar` at `2026-10-19T17:20:00+03:00`, **60 user keys** (the chain's exact population — the walkthrough drills these), basisNote naming the run, expiry +90d per the seeded retention policy (12 Q-7).

**Jobs**: `j-1` sample-import `succeeded` (a 96-row onboarding-week sheet; 2 failed rows quoted — partial-results fixture); `j-2` analysis-export `succeeded` (artifact `art-1`, expires `2026-10-27` — 7-day expiry per async-contract §2, 6 days remain at the frozen clock); `j-3` sample-import `queued` (the cancel fixture).

**Notifications (5, one per class — all digest tiers; ZERO instant classes at v1, 12 Q-13):** analysis-shared (a-1), taxonomy-lint-digest (12 violations), source-health-changed (src-01 → active), analysis-annotation (u-sara on a-1), export-ready (j-2); mixed seen/unseen.

**Activity (31 entries, monotonically increasing fixed timestamps)**: the full chain for every seeded mutation — 7 taxonomy versions, 3 funnel saves (+2 edits), policy v1 publish, r-1 run, a-1 save/share, c-1 materialization, j-1/j-2 jobs, notification deliveries.

### 1.7 Paste fixtures (the LOOP-5 primary path, 08 N1)

- **`sample-small.csv`** — 120 rows, spans 21 of the range's 28 days (the "sample covers 21 of the 28 requested days" coverage notice, 03 CP-1 edge). Import outcome (fixed): **116 imported, 2 failed rows** (row 17: unparseable timestamp `2026-13-32 99:00`; row 84: empty event name — both quoted verbatim in the job's error detail), **2 awaiting-input rows** (rows 44 and 91 carry the mixed-script alias `بحث أول` in the event column with both candidates shown: ev-03 First Search via normalized alias, or a new proposed event — resolving to ev-03 completes the import). 14 rows carry the event `Refund Requested` → **1 proposed taxonomy event** created (governance path, CP-4.5 — activating it requires the full bilingual label set, lint-gated).
- **`sample-world.tsv`** — the full seeded event world as a pasteable payload (the §1.5 tables expanded). The degradation re-run (03 CP-6.9 second leg; 00 success-signal 4) unbinds every capability (§3 `capabilities` preset), imports this fixture, and the evidence journey completes with **identical numbers** — full anneal, template narration, artifact download — proving the LOOP-5 bar by replay, not by claim.

## 2. Behavior specification (EXACT deterministic rules)

### 2.1 Funnel computation engine (`computeFunnelMetrics`, `getFunnelTrend`)

1. **Entry**: a user's funnel entry = their first step-1 event (matching step filters) with timestamp in `[rangeStart, rangeEnd)`. Entry cohort = all such users.
2. **Step completion (sequential — the default)**: step n is completed at the user's FIRST matching step-n event strictly after their step n−1 completion timestamp AND within `conversionWindowHours` of ENTRY (the window runs from the first step-1 instance — the documented vendor semantics, 01 §3 q16; re-entries before completion do not extend the window). **strict**: step n's event must be the user's next event of ANY kind after step n−1 (nothing in between — 01 §3 q2). **any**: order-free; each step's first matching occurrence in range; the window still bounds step-1→step-k.
3. **Metrics**: `usersCompleted[n]` per step; `droppedFromPrior[n] = usersCompleted[n−1] − usersCompleted[n]`; `dropOffRate[n] = droppedFromPrior / usersCompleted[n−1]`; `stepConversionRate[n] = usersCompleted[n] / usersCompleted[1]`; `overallConversionRate = usersCompleted[k] / usersCompleted[1]`; `largestDropOffStep = argmax droppedFromPrior` (absolute decrease, NOT percentage — q20; ties → lowest ordinal); `slowestStep = argmax medianTransitionMinutes` (ties → lowest ordinal).
4. **Transition times**: per user, step n completion minus step n−1 completion (minutes, 1-minute resolution). `medianTransitionMinutes` = the ceil-index 50th percentile of the sorted values (index = ceil(0.5 × N)); `p90` = ceil(0.9 × N)-index. Empty population → null.
5. **Basis**: every metrics row carries ComputationBasis (source id/label, range, window, ordering, funnel version, taxonomy version, computedAt = frozen clock, freshness = fresh|stale|coverage-gap — computed as: `fresh` when lastFreshAt is within 24h of computedAt and the source covered the range; `coverage-gap` when the active basis is a pasted sample with coverageDays < requested span (§1.7); `stale` when lastFreshAt is older than 24h).
6. **Trend**: disjoint windows of `windowDays` across the range; per window: entrants whose step-1 event falls in the window, and their full-funnel conversions under the same step rules (window bounded by the funnel's conversion window, not the trend window). Rounding: rates are exact rationals rendered at 1dp for display; the DTO carries 4-decimal values.
7. **Immutability**: each computation appends a new metrics row; re-query with identical parameters returns the existing row (dedup by parameter hash — same discipline as the anneal inputHash).

### 2.2 Segment annealing engine (`annealSegment` — the flagship; published math, not a magic score)

Given funnel F, seamIndex s (transition step s → s+1), range R, and policy P:

1. **Seam population** = the users who completed step s under §2.1 rules; `priorStepUsers = |population|`, `lostUsers` = those who did NOT complete step s+1 within the window; `baselineDropOffRate = lostUsers / priorStepUsers` (exact rational).
2. **Support floor** = `minSupportOverride` when set, else `max(30, ceil(0.02 × priorStepUsers))` (`floor30-or-2pct`). If `priorStepUsers` < floor → the run REFUSES with VALIDATION naming the population and the floor (the f-3 seam-1 fixture: "seam population 24 — below the minimum support floor of 30").
3. **Candidate enumeration**: for the current chain (initially the empty conjunction = full seam population), enumerate every (axis, value) where the axis is declared `segmentable` on the prior-step event's taxonomy entry, the value is non-null, and at least one chain member carries it. Candidate segment = chain ∧ (axis = value).
4. **Candidate metrics** (exact rationals; DTO carries 4-decimal rounded values, round-half-up): `segmentSize`, `dropped`, `dropOffRate = dropped/segmentSize`, `excess = dropOffRate − baselineDropOffRate` (signed, points ×100 for display), `separation = |excess| × sqrt(segmentSize / priorStepUsers)`.
5. **Eligibility** (checked in precedence order): `below-support-floor` (segmentSize < floor) → `excluded-axis` (axis ∈ P.excludedAxes) → `contradicts-chain` (the axis is already bound in the chain to a different value, or the predicate is mutually exclusive with a chain predicate — e.g. tenure=returning over a tenure=new chain: the segment is empty, size 0, separation 0) → `negative-excess` (excess ≤ 0 — a PROTECTIVE segment explains no leak; 03 CP-3.2's named rejection reason). Eligible = passes all four.
6. **Admission**: among eligible candidates take argmax separation (ties → axis name, then value, lexicographic ascending — fully deterministic). Admit iff `chainSeparationAfter > currentChainSeparation + P.epsilon`, where `chainSeparationAfter = excess(chain) × sqrt(chainSize / priorStepUsers)` and the initial chain separation is 0 (the empty chain IS the baseline). Iteration reason: `admitted-improvement`. If the best eligible candidate fails the epsilon test → stop, reason `no-improvement`. If no eligible candidate exists → stop, `no-eligible-candidate`. After `P.depthCap` admissions → stop, `depth-cap-reached` (hard cap 8 — VALIDATION above, 07b).
7. **Null result**: a run that admits nothing returns the full candidate table with its stop reason — a valid, evidence-bearing result, NEVER an error (07b rule 5); the UI renders "no separating segment found" WITH the table (11 §A).
8. **Chain outputs**: predicates in admission order; `chainSize`, `chainDropOffRate`, `excess` (points), `excessHeadcount = round(chainSize × excess)` (round-half-up; the interpretability number, "~17").
9. **Determinism & dedup**: the engine is pure over (funnelId, seamIndex, range, window, ordering, policy, taxonomyVersion). `inputHash` = SHA-256 of the canonical pipe-serialization (§1.6). Identical input → the ORIGINAL run returned (immutable evidence; reruns on drifted data differ in hash and append as NEW runs — 07a).
10. **Policy publish**: `persistAsDefault: true` (admin only — PERMISSION otherwise) bumps the workspace policy version, appends an ActivityEntry (`anneal.policy-published`), emits the workspace event, and the run's own trace IS the required before/after preview (03 design note (b)). `getSession` returns the new default thereafter.

### 2.3 Breakdown engine (`breakdownFunnelStep`, `compareSegments`)

1. **Breakdown**: over the seam population, one row per (axis, value) for the requested axis — including the unset/NULL value row (rendered `(unset)` — the honest null axis; NEVER silently dropped). Row fields per 07a BreakdownRow; `separation = |excess| × sqrt(size / priorStepUsers)`; sort: separation descending, ties → value lexicographic. The ENGINE returns all rows (the 12-row cap is a UI rule — 03 CP-2.2). A single-value axis renders the degenerate row ("no separation possible — one value in this axis"). Non-segmentable axis → VALIDATION naming the rule.
2. **Comparison**: `compareSegments` evaluates BOTH predicate sets over the SAME seam population and basis (§2.1 rules); per side: size, dropped, dropOffRate, excess (points, signed), excessHeadcount = round(size × excess); plus `baselineDropOffRate`, `priorStepUsers`, `lostUsers`, and `deltaDropOffRate = sideA.dropOffRate − sideB.dropOffRate` (points). Labels compose from predicates when not supplied (bilingual composition templates — 11 §D4). Predicates referencing axes not declared on the seam's prior-step events, or values unobserved in the population → VALIDATION with the mismatch named in `details` (the cross-funnel comparison block, 03 CP-3.6 edge). The complement is the negated predicate set; no special form exists (07b).

### 2.4 Transition detail engine (`getStepTransitionDetail`)

1. **Time distribution** — FIXED bucket edges (minutes): `<5`, `5–15`, `15–60`, `60–360` (1–6h), `360–1440` (6–24h), `1440–4320` (1–3d), `4320–10080` (3–7d), with the bilingual labels of 11 §B. Users beyond the conversion window cannot exist here by construction (the window bounds completion).
2. **Median/p90** per §2.1 rule 4 (ceil-index percentiles of the sorted continuers' minutes; the §1.5 table pins 41m / 570m for seam 3).
3. **Displaced paths**: for each LOST user, their next event of ANY kind after the prior-step completion, within 14 days; group by event (bilingual labels from the taxonomy); users with no subsequent event → the null path ("left the product" — an honest first-rank possibility, never an error). Rank: users descending, ties → canonicalName lexicographic; top-8 returned (07a: "top-N seeded 8"); `shareOfLost = users / lostUsers`.
4. **Zero-lost seam**: the dossier payload carries `lostUsers: 0`, an empty displaced list, and time-to-convert only — the "no leak at this seam" state (03 CP-2 edge; 11 §A).

### 2.5 Taxonomy lint engine (`getTaxonomyLintReport`, synchronous on every upsert draft)

Rules evaluated in fixed order; severity per 07a (errors block publish; warnings render). The past-tense lexicon is FIXED seed data (the closed set the linter accepts as a final token): {Added, Clicked, Completed, Copied, Exited, Failed, Filtered, Installed, Opened, Placed, Played, Rated, Searched, Sent, Shared, Shown, Subscribed, Tapped, Viewed}.

1. `naming-syntax` (error): canonicalName's token sequence must be `[Capitalized Noun]+ [Past-Tense Verb]` — the final token ∈ lexicon AND no earlier token ∈ lexicon. "Restaurant Rating" (no past-tense token) → error, detail "noun-only — no past-tense verb"; "Shared Menu" (past-tense token FIRST) → error, detail "verb-first — [Noun] + [Past-Tense Verb] expected".
2. `naming-case` (error): every token must match `[A-Z][a-z0-9]*` (Title Case; "Song Played" vs "song played" are two events — q10). "promocode applied" → error.
3. `naming-actor` (warn): names whose subject is an agent-ambiguous artifact noun {Message, Notification, Alert, Email, Invite} followed by a send/show verb — the name does not say WHO acted (q10's own example class). "Message Sent" → warn with the question rendered in the detail.
4. `label-en-missing` / `label-ar-missing` (error on ACTIVE events — the bilingual contract; warn on proposed/deprecated): empty or whitespace-only label. ev-13, ev-17, ev-18 fire `label-ar-missing`.
5. `property-undeclared-value` (warn): an observed enum value ∉ declared enumValues (ev-01: platform "huawei" × 3).
6. `property-type-mismatch` (warn): an observed value failing the declared type parse (ev-07: dwellSeconds "long" × 2).
7. `deprecated-referenced` (warn): an active (non-archived) funnel references a deprecated event (f-3 → ev-14).
8. `owner-missing` (warn): an active event with ownerUserId null (ev-15).
9. `dead-event` (warn): observedCount = 0 in the active basis (no seed fires it — ev-16 observes 12; the rule is exercised by narrowing the range in tests).

**Seeded report (asserted)**: 12 violations — 4 naming (ev-12 warn, ev-16 error, ev-17 error, ev-18 error), 3 bilingual (ev-13, ev-17, ev-18 — all `label-ar-missing` errors), 3 properties (ev-01, ev-07 ×2 rows... ev-07 fires one violation citing both rows), 2 governance (ev-14, ev-15 warns); errorCount 6, warnCount 6 — the 06 summary string "12 مخالفة: 4 تسمية، 3 تسميات ثنائية اللغة، 3 خصائص، 2 حوكمة / 12 violations: 4 naming, 3 bilingual labels, 3 properties, 2 governance" reproduces verbatim. Upsert flow: lint runs on the DRAFT synchronously; ERROR-class → VALIDATION with rule + observed value in `details`; the rename gate (renameMigration required when usedByFunnelIds ≠ ∅ — impact list in details) and the deprecation gate (resolution required — reference list in details) fire BEFORE lint per 07b rules 6–7. Every taxonomy change appends a version + ActivityEntry + `taxonomy.changed` workspace event.

### 2.6 Jobs, imports, live events, ambient behavior

- **importEventSample** (async-contract §2): fixed row-splitting (no randomness); column mapping preview; per-row validation (timestamp ISO-8601, user key `u-\d{4}`, event name non-empty); unknown events → `proposed` cards (never a silent drop); mixed-script ambiguous rows park `awaiting-input` (row-level choice, both candidates shown); determinate progress ("importing row 40 of 120" — 8 rows / 1.6s cadence); partial results deliver imported rows + failed-row quotes; `retryJob` re-runs failed rows only; `cancelJob` resolves within one interaction; exports produce the fixed artifact descriptor with 7-day expiry; `awaiting-input` resolves and continues.
- **narrateDropOff**: the template-metrics narrative is ALWAYS composed deterministically from the run payload via the 11 §D templates (bilingual, Western numerals, correlation-honesty sentence included). With `MockConfig.capabilities.modelBound = true` the mock returns a FIXED model-assisted text composed over the same metrics (a canned deterministic string — zero model calls, zero randomness), provenance truthful; with `narrationRateLimited = true` the call degrades to the template narrative within the same call (never a spinner — 07b rule 4; ai-native-patterns §8). Partial narration (`partial: true`) only via the explicit `narrationPartial` flag — never silently promoted.
- **subscribeWorkspaceEvents**: replays a fixed 9-event script at 60ms cadence on subscribe (taxonomy.changed ×1, taxonomy.lint-changed ×1, source.health ×1, funnel.saved ×1, analysis.shared ×1, analysis.annotation ×1, anneal.policy-published ×1, job.state ×2), then emits on real mutations; unsubscribe is exact (no leaks).
- **Offline queue (P20)**: `saveAnalysis` (incl. annotations) and `upsertTaxonomyEvent` queue with per-item state; a queued taxonomy edit that reaches a newer version resolves to CONFLICT with both drafts in `details`; reads fail fast with the canvas retaining its last good render (07b rule 10).
- **Idempotency**: every keyed mutation returns the original result on duplicate `idempotencyKey` — never a second write (07b rule 2). The anneal additionally dedups by inputHash (§2.2 rule 9).
- **People**: `inviteUser`/`updateUser` append ledger entries; role gates enforced (PERMISSION with the named surface); suspended users fail fast on writes, read-only surfaces persist.

## 3. Failure injection (per method, deterministic)

`MockConfig = { latencyMs?: number; latencyPerMethod?: Record<string, number>; failNext?: Record<string, ErrorCode>; stallAnnealAfterMs?: number; capabilities?: { sourceBound?: boolean; modelBound?: boolean; artifactDestinationBound?: boolean }; narrationRateLimited?: boolean; narrationPartial?: boolean; sourceHealthOverride?: 'unverified' | 'active' | 'expiring-soon' | 'expired' | 'failed' }` — one config object at construction (no environment variables, no network). Defaults: zero latency, zero failures, sourceBound true, modelBound false, artifactDestinationBound true. `failNext[method] = code` makes the NEXT call to that method return the typed error with fixed correlationIds (`corr-0001`…) and plausible `details` per the 03 failure-mode table — deterministic (the same injection sequence yields the same transcript). `stallAnnealAfterMs` (> 2000) exercises the job-shaped continuation (03 CP-3 edge; async-contract §1) with honest progress. The `capabilities: { sourceBound: false, modelBound: false, artifactDestinationBound: false }` preset IS the degradation re-run (§1.7) — listEventSources returns empty, narration composes template-metrics, exports deliver in-context downloads.

## 4. Test-support operations (mock-only, outside the v1 contract)

`reset()` — restores every seed and the frozen clock · `snapshot()` — deep clone for byte-identical assertion · `replay(events)` — applies a recorded event list to reach a state deterministically (the drift fixtures: replaying a taxonomy-change event then re-opening a-1 yields `data-moved`; replaying the world-shift script yields `chain-no-longer-reproduces`) · `seedSummary()` — emits the fixture tables of §1 as data (tests assert against the same named world the spec documents). Never called by product UI.

## 5. No-go guarantees

No timers beyond the declared cadences (import rows 8/1.6s; event replay 60ms); no randomness anywhere (variation = seeded fixture selection and explicit config); no network; no provider imports; no persistence across resets; the four engines are pure and shared between seed-build and runtime — the mock cannot ship a metric, a trace, or a lint count its own engines cannot reproduce. **No AI anywhere in the mock by default**: the declared conditionally-AI surface (narration) ships UNBOUND — the template-metrics composition is versioned data, and the "bound model" is a deterministic canned response behind a config flag (there is no model call to stub). Two identical runs produce identical transcripts, including anneal traces, rationale/narration strings, correlationIds, and event order — the 00 success-signal-2 replay (twice, byte-identical) is this guarantee's acceptance test.
