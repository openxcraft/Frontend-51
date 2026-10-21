# 07c — Mock Adapter: okr-cascade-board

In-memory, deterministic, zero external dependencies. Implements `OkrCascadeAdapterV1` (07b). The drafting assist (`requestDraft`) and exports run as **simulated async stages** per async-contract.md: Jobs that walk queued → running (determinate chunk progress) → succeeded against fixed tables — no network, no timers beyond declared cadences. **Fixed seeded clock: 2026-10-19T09:30 workspace-local (Monday morning, 30 minutes before the period-4 grace deadline — the cadence's most honest moment).** All period/zone/derivation states below are computed against this clock.

## Seeds (fixed, named)

### Workspace — "مجموعة واحة" / "Waha Group"

defaultLocale `en` (bilingual-en proposal); cadence: weekly, dueDayOfWeek 1 (Monday), dueTime "10:00"; assistConsent: `not-granted` (the tested default — LOOP-5: the product ships with the assist unbound; `assistEnabled: false` is the tested configuration).

**Teams** (bilingual names, leads): t-ops "Store Operations / عمليات المتاجر" (Omar) · t-ecom "E-commerce / التجارة الإلكترونية" (Noura) · t-supply "Supply Chain / سلسلة الإمداد" (Yusuf) · t-cx "Customer Experience / تجربة العملاء" (Huda).

**Members** (name pairs, roles, desk locales): m-layla "Layla Haddad / ليلى حداد" admin · en · m-omar "Omar Al-Rashid / عمر الرشيد" lead t-ops · ar · m-noura "Noura Al-Sabah / نورة الصباح" lead t-ecom · en · m-yusuf "Yusuf Kamal / يوسف كمال" lead t-supply · ar · m-huda "Huda Nassar / هدى ناصر" lead t-cx · ar · m-dana "Dana Al-Fahim / دانة الفاهم" member t-ecom · en · m-tariq "Tariq Mansour / طارق منصور" member t-ops · ar.

### Cycle C-1 — "نمو الربع الأخير" / "Q4 growth" — ACTIVE (the fully-worked fixture)

startsOn **2026-09-21** (Monday), endsOn **2026-12-18** (Friday); cadence weekly/Monday/10:00 (anchor rule holds: weekday(startsOn)=1=dueDayOfWeek). 13 periods; period k covers [Sep 21 + 7(k−1), Sep 21 + 7k) days, the last truncated at endsOn. At the seeded clock: **P1** Sep 21–27 (closed) · **P2** Sep 28–Oct 4 (closed) · **P3** Oct 5–11 (closed) · **P4** Oct 12–18 (in-grace: due 2026-10-19 10:00, 30 minutes remain) · **P5** Oct 19–25 (open, current).

**Company objectives (4):**
- **CO-1 "تجربة يوصي بها العملاء" / "An experience customers recommend"** — stretch (aspirational). KR: **kr-nps** "Net Promoter Score rises from 32 to 50" / "ارتفاع صافي نقاط الترويج من 32 إلى 50" (points, 32→50, increase, owner Noura). Children: TO-2, TO-4.
- **CO-2 "نمو رقمي بلا تضحية بالهامش" / "Digital growth without margin sacrifice"** — committed. KR: **kr-share** "E-commerce share of revenue grows from 14% to 22%" / "نمو حصة التجارة الإلكترونية من 14% إلى 22%" (%, 14→22, increase, owner Noura — a company-level KR owned by a lead). Children: TO-1.
- **CO-3 "سلسلة إمداد تسبق الموسم" / "A supply chain ahead of the season"** — committed. KR: **kr-otif** "On-time-in-full delivery rises from 82% to 95%" / "ارتفاع التسليم الكامل في الموعد من 82% إلى 95%" (%, 82→95, increase, owner Yusuf). Children: TO-2, TO-3.
- **CO-4 "علامة يثق بها المجتمع" / "A brand the community trusts"** — stretch. KR: **kr-mentions** "Earned brand mentions grow from 410 to 520" / "نمو الإشارات المكتسبة للعلامة من 410 إلى 520" (mentions, 410→520, increase, owner Layla) — **zero check-ins (unreported fixture)** and **zero team children → the `unstaffed-ambition` warning fixture**.

**Team objectives (5):**
- **TO-1** (t-ecom, parents [CO-2]) "رحلة شراء بلا تردد" / "A purchase journey without hesitation" — committed. KRs: **kr-checkout** "Checkout conversion rises from 2.1% to 3.0%" / "ارتفاع تحويل إتمام الشراء من 2.1% إلى 3.0%" (%, 2.1→3.0, increase, owner Dana) · **kr-cart** "Cart abandonment falls from 68% to 55%" / "انخفاض التخلي عن السلة من 68% إلى 55%" (%, 68→55, **decrease**, owner Dana) · **kr-followers** (ARCHIVED after P1, reason "followers are a vanity signal — replaced by the share KR") "Channel followers grow from 8,100 to 9,500" / "نمو متابعي القناة من 8,100 إلى 9,500".
- **TO-2** (t-ops, parents [CO-1, CO-3] — **multiple parents exercised**) "متاجر جاهزة قبل الزحام" / "Stores ready before the rush" — committed. KR: **kr-planogram** "Planogram compliance rises from 71% to 90%" / "ارتفاع الالتزام بمخطط العرض من 71% إلى 90%" (%, 71→90, increase, owner Tariq).
- **TO-3** (t-supply, parents [CO-3]) "رفوف لا تفرغ في الموسم" / "Shelves that don't empty in season" — committed. KRs: **kr-repl** "Replenishment cycle falls from 96 hours to 48 hours" / "انخفاض دورة التجديد من 96 ساعة إلى 48 ساعة" (hours, 96→48, decrease, owner Yusuf) · **kr-stockout** "Stockout days during the peak window fall from 3 to 0" / "انخفاض أيام نفاد المخزون في نافذة الذروة من 3 إلى 0" (days, 3→0, decrease, **owner Tariq — cross-team ownership fixture: a Store Ops member owning a Supply Chain KR**).
- **TO-4** (t-cx, parents [CO-1]) "كل شكوى تجد مسارها" / "Every complaint finds a path" — committed. KR: **kr-fcr** "First-contact resolution rises from 61% to 75%" / "ارتفاع الحل من أول اتصال من 61% إلى 75%" (%, 61→75, increase, owner Huda).
- **TO-5** (t-ecom, parents [] — **`orphaned-effort` warning fixture**, state draft) "محتوى عربي يبيع" / "Arabic content that sells" — 0 KRs. **Lint fixture**: EN title 24 chars, AR title 16 chars → pair-parity ratio 0.67 < 0.75 → the pair-parity flag fires (double-warning objective).

**Check-in fixtures (period → value, confidence, zone at the seeded clock):**

| KR | P1 (closed) | P2 (closed) | P3 (closed) | P4 (in-grace) | Derived at 09:30 |
|---|---|---|---|---|---|
| kr-nps | 34, c4, ontime | 35, c4, ontime (**correction fixture**: priorValues [{36, c4}] → corrected 35, revision 2) | 37, c3, ontime | **39, c3, submitted 08:50 today (grace-submitted — late mark, still counts)** | progress (39−32)÷(50−32) = **0.39**; latest conf 3 → not at-risk |
| kr-share | 15, c4, ontime | 15.5, c4, ontime | 16, c4, ontime | not submitted | progress (16−14)÷(22−14) = **0.25** |
| kr-otif | 84, c3, ontime | 83, c2, ontime | none → **overdue** | none | progress (83−82)÷(95−82) = **0.08**; at-risk **trigger 'confidence'** ("confidence 2 on period 2"); missingStreak 1 |
| kr-checkout | 2.2, c3, ontime | 2.3, c3, ontime | **draft exists (2.35, c4) never submitted → 'missing' zone (draft-is-not-a-report fixture)** | not submitted | progress (2.3−2.1)÷(3.0−2.1) = **0.22**; missingStreak 1 (P3) |
| kr-cart | 66, c3, ontime | 64, c3, ontime | 63, c4, ontime | not submitted | progress (68−63)÷(68−55) = **0.38** (decrease formula) |
| kr-planogram | 74, c3, ontime | 76, c3, **submitted-by Omar on behalf of Tariq (on-behalf provenance fixture)** | none → overdue | none | progress (76−71)÷(90−71) = **0.26**; missingStreak 1 |
| kr-repl | 90, c3, ontime | none → overdue | none → overdue | none | progress (96−90)÷(96−48) = **0.125**; missingStreak 2 → at-risk **trigger 'cadence'** ("periods 2–3 missed after period 1 reported") |
| kr-stockout | 2, c3, ontime | 1, c3, ontime | 1, c4, ontime | **draft (0, c5) unsubmitted during grace** | progress (3−1)÷(3−0) = **0.67** |
| kr-fcr | 63, c3, ontime | 64, c3, ontime | 65, c3, ontime | not submitted | progress (65−61)÷(75−61) = **0.29** |
| kr-mentions | — | — | — | — | **unreported (null)**; objective shows "—" |

Blocker fixtures: kr-otif P2 blocker "رقم التسليم الكامل يعيش في تقرير فريق آخر" / the OTIF figure lives in another team's report (acknowledged: false — open in the digest); kr-repl P1 blocker "تقرير المخزون يصل متأخراً يوم الأحد" (acknowledged: true — read by Yusuf). **Objective rollups at the clock (weighted mean, rule 2):** CO-1 = (0.39)÷1 = 0.39 · CO-2 = 0.25 · CO-3 = 0.08 · CO-4 = null (unreported) · TO-1 = (1×0.22 + 1×0.38)÷2 = 0.30 · TO-2 = 0.26 · TO-3 = (1×0.125 + 1×0.67)÷2 = 0.40 · TO-4 = 0.29 · TO-5 = null.

**Draft proposal fixture DP-1** (state: proposed, expires 2026-10-26): kind key-results, target TO-5, focus textEn "Arabic-first product content that converts", requestedBy Noura. Proposals (3 pairs, both languages, metrics pre-filled): (1) "Raise Arabic-content conversion from 1.4% to 2.2%" / "رفع تحويل المحتوى العربي من 1.4% إلى 2.2%" (%, 1.4→2.2, increase) · (2) "Grow Arabic organic sessions from 38,000 to 52,000" / "نمو الجلسات العضوية العربية من 38,000 إلى 52,000" (sessions, 38000→52000, increase) · (3) "Cut Arabic-content bounce rate from 58% to 45%" / "خفض معدل الارتداد للمحتوى العربي من 58% إلى 45%" (%, 58→45, decrease). History fixture **DP-0** (dismissed 2026-09-28, note "generic — not our voice").

### Cycle C-0 — "متابعة الصيف" / "Summer follow-through" — CLOSED (graded fixture)

Q3 2026 (Jun 22–Sep 18). Grade sheet computed and pinned: **CO-A** committed "قاعدة عملاء أوفى" / "A more loyal customer base" — grade **0.86** (2 reported KRs, 1 unreported excluded with count) · **CO-B** aspirational "الرقمية نصف إيرادنا" / "Digital at half our revenue" — grade **0.71** → **aspirational on-target (≥0.70 threshold fixture)** · **CO-C** aspirational "أسرع تسليم في المدينة" / "Fastest delivery in the city" — grade **0.55** → below threshold, displayed honestly. Archived appendix: objective "توسيع خيارات التوصيل" / "Expand delivery options" (archived week 6, reason "initiative cut") + 3 archived KRs with reasons. Artifacts: **A-0** grade-report **EXPIRED 2026-10-12** (NOT_FOUND + regenerable path fixture) · **A-1** cycle-package, expires 2026-11-02, regenerable.

### Cycle C-2 — "نوايا الربع الأول 2027" / "Q1 2027 intentions" — DRAFT (the empty-board fixture)

startsOn 2027-01-04, endsOn 2027-04-02, zero objectives — `listObjectives` returns an empty page (P01 first-run-in-cycle copy) and the board renders its authoring invitation.

### Cycle C-S — SAMPLE — "عيّنة: متجر الحي" / "Sample: the neighborhood shop" (isSample: true)

A miniature active cycle: 2 company objectives, 2 team objectives, 3 KRs, 2 periods of check-ins (one ontime, one overdue), one at-risk KR — the whole ritual experienceable in five minutes (P22). Badge-labeled; clearable; **never regenerates after clearing** (12 Q-14).

## Deterministic computation rules (fixed — the product's heuristics, exact)

1. **KR progress** (from the latest SUBMITTED check-in; drafts never count; no submissions → null): increase → `progress = clamp((current − baseline) ÷ (target − baseline), 0, 1)`; decrease → `progress = clamp((baseline − current) ÷ (baseline − target), 0, 1)`. Rendered as 0–100% with Western numerals; null renders "—" with the unreported badge.
2. **Objective rollup**: `Σ(weight × progress) ÷ Σ(weight)` over KRs with progress ≠ null; all-null → null. Archived KRs are excluded from both sums (and counted in `unreportedKrs`'s sibling disclosure field `archivedKrs`).
3. **At-risk derivation** (computed at read, never stored): flagged when (a) latest submitted check-in has confidence ≤ 2 → trigger 'confidence' (detail: "confidence {n} on period {k}"); AND/OR (b) missingStreak ≥ 2 while ≥ 1 prior submission exists → trigger 'cadence' (detail: "periods {a}–{b} missed after period {c} reported"); both → 'both'. missingStreak counts CONSECUTIVE periods past their dueAt with no submission.
4. **Coverage cell zone** (KR × period): submitted and submittedAt ≤ period endsOn 23:59 → 'ontime'; submitted after period end (incl. during grace) → 'ontime' **with a late mark** (the timestamp is the truth); period in grace (endsOn < now ≤ dueAt) and unsubmitted → 'in-grace'; period past dueAt, unsubmitted, no draft → 'overdue'; period past dueAt, unsubmitted, **draft exists → 'missing'** (the draft-is-not-a-report honesty state — the legend says so verbatim, 11).
5. **Grading** (computeCycleGrades): per-KR grade = progress at the last submitted value (null if unreported); per-objective grade = rule 2's weighted mean; aspirational objectives display against the **0.70 on-target threshold** (semantics rendered in place, 11); grade sheet pins `{objectivesVersion, checkInRevisions[]}` and is immutable; recomputation from identical pinned inputs is bit-identical (regression assertion).
6. **Period derivation**: period k covers [startsOn + (k−1)·F, startsOn + k·F) days (F = 7 weekly, 14 biweekly), the final period truncated at endsOn; `dueAt = startsOn + k·F at dueTime` (the morning the next period begins). **Anchor constraint (VALIDATION)**: `weekday(startsOn) === dueDayOfWeek` — enforced at createCycle and on every cadence change in scope; the seeds comply (Monday starts, Monday due).
7. **Writing lint** (getObjective.lint — pure function of the statement pairs; same input, same findings, always): (a) **task-verb** — statement opens with a fixed verb list → flag "reads as a task, not an outcome": EN [build, ship, launch, create, write, design, deliver, implement, migrate, deploy] · AR [بناء، إطلاق، إنشاء، كتابة، تصميم، تنفيذ، تسليم، نشر، بنى، أطلق، أنشأ، صمم، نفذ، سلّم]; (b) **soft-verb** — statement contains a fixed list anywhere → flag "soft language — name the measurable delta": EN [help, support, contribute, assist, enable, facilitate] · AR [يساعد، يدعم، يسهم، يمكّن، يسهّل، المساعدة، الدعم، المساهمة]; (c) **length** — objective title > 12 EN words / > 10 AR words, or KR statement > 18 EN / > 15 AR → flag "trim for recall"; (d) **pair-parity** — both sides non-empty and `arChars ÷ enChars` outside **[0.75, 1.75]** → flag "pair lengths far apart — check the pair" (AR ≈ 1.25× EN expected, ±40%). Empty sides never flag parity (honest-empty rule). Findings are flags, never blocks; the matched span is included verbatim.
8. **Cadence migration** (updateCadence with confirmedMigration: true): re-derive periods per rule 6 from each cycle's startsOn; every submitted check-in keeps its pinned `periodStart` and maps into whichever new period contains it; a submission contained by no period (orphaned by re-gridding) lands in `preChangeBucket` and renders as an honest pre-change list; the anchor constraint is re-validated for every non-closed cycle in scope (violation → VALIDATION naming the cycles). `confirmedMigration: false` → VALIDATION (the P04 confirm is contractual — 07b rule 9).
9. **Assist simulation**: `requestDraft` → assistEnabled false OR consentGranted false → PERMISSION naming the drafting-assist capability class (credential-contract §2 kind-not-vendor language); quotaExhausted → RATE_LIMIT with resetAt 2026-11-01; enabled+consented+quota → Job paced 40ms/chunk, chunksTotal 6, streaming the fixed proposal table for (kind, level) — the DP-1 content above IS the table's key-results output; every run returns identical proposal content with a fresh proposalId (deterministic). Unattended proposals expire at expiresAt → NOT_FOUND. `resolveDraftProposal` 'accept' copies the pair into the composer as an editable draft (P15 — never auto-creates); 'dismiss' logs with the note.
10. **On-behalf**: submitCheckIn by a session whose role is lead and whose memberId ≠ ownerId records submittedBy = session member (activity 'checkin-on-behalf'); members submitting for a KR they do not own → PERMISSION.

## Behavior notes

- Check-in submit and corrections return in <50ms mock latency; the Cascade Settle is a UI moment, not an adapter wait. `updateCheckIn` appends priorValues and increments revision; corrections VALIDATION-reject after cycle close.
- Exports: 300ms pacing; `failExportFormatOnce` → the cycle-package delivers with the activity appendix missing → partial result + per-format retry (async-contract §4); idempotent re-export returns the same artifact; expired artifacts → NOT_FOUND with regenerable: true (cycle state is immutable post-close — regeneration is byte-identical).
- `getUsage`: window "monthly"; assistRuns 20 of 25 (the 80% P14 warn-zone fixture); exports 2; resetAt 2026-11-01. Deterministic workflows never meter.
- Error injection per method: MockConfig `{ latencyMs, errorRate, errorCode, assistEnabled, consentGranted, quotaExhausted, failExportFormatOnce }`; fixed correlationIds `okb-corr-0001`… — every ErrorCode class injectable and typed per the 07b union.
- Activity log seeded to match every fixture above (correction, on-behalf, archive, re-baseline none yet — a re-baseline is exercisable, not seeded; cadence-changed none yet).

## Test-support

`reset()` / `snapshot()` / `replay()`: full state restore, no randomness, no network, no timers beyond the declared cadences; the clock stays pinned at 2026-10-19T09:30 (a config override may move it for period-boundary tests — declared, deterministic). Regression assertions: (1) every progress/rollup number in the table above reproduces exactly; (2) kr-otif at-risk trigger 'confidence' and kr-repl trigger 'cadence' fire exactly as named; (3) the kr-checkout P3 draft renders zone 'missing', never 'ontime'; (4) TO-5 carries BOTH warnings (orphaned-effort + pair-parity 0.67); (5) C-0's CO-B displays on-target at 0.71 and CO-C below at 0.55; (6) grading recompute on C-1's current state is bit-identical across two runs; (7) cadence weekly→biweekly migration on C-1 maps the pinned submissions deterministically and produces the declared preChangeBucket when forced; (8) assist-off `requestDraft` → PERMISSION with the capability class named; (9) every error class injectable and typed; (10) the anchor VALIDATION fires for a Tuesday-start cycle against a Monday due day.
