# 07c — Mock Adapter: zakat-calculation-suite (deterministic, zero external dependencies)

SME-G pass · `ZakatCalculationAdapterV1` (07b) implemented as a fully deterministic in-memory mock. No network, no clock, no model, no provider. Every rule the engine applies is seeded profile DATA with a source note or a verify flag (07a SourceNote) — citations refer to the research digest (`research/batch9/zakat-calculation-suite-research.md`); nothing asserts unsourced fiqh. All arithmetic is integer arithmetic on minor units; rates are exact rationals; the only rounding is the declared half-up at the currency's minorDigits. Storage is canonical Western-digit; display formatting (numeral system, locale) happens above the adapter (rtl-rules §3).

## 1. Fixed clock

`T0 = 2026-10-15T09:30:00+03:00` (Asia/Riyadh). Every seeded timestamp derives from T0; job state advances on the scripted schedule in §7 (no wall clock anywhere). Hijri presentation is a FROZEN seeded table for fixture dates only — `2025-10-01 → 1447-04-09`, `2026-09-30 → 1448-04-19`, `2025-10-26 → 1447-05-04`, `2026-10-15 → 1448-05-03` — disclosed in-product as fixture data under the Umm al-Qura presentation method; a production binding replaces the table (12 Q-9). Gregorian ISO is the only stored form (07a).

## 2. Seeded world

**Workspace** `ws-nk-01` — "مؤسسة نور الخير" / "Noor Al-Kheir Foundation" · defaultLocale `ar` · numeralPolicy `arabic-indic-in-arabic-prose` · hijriDisplay `secondary-umm-al-qura` · defaultProfileId `prf-shafii-std`.

**Members** (07a role grammar): `mbr-salman` الشيخ سلمان العتيبي / Sheikh Salman Al-Otaibi — owner (the shariah authority seat) · `mbr-nadia` نادية الرشيد / Nadia Al-Rashid — officer · `mbr-huda` هدى القحطاني / Huda Al-Qahtani — reviewer · `mbr-ibrahim` إبراهيم شاه / Ibrahim Shah — viewer (external auditor) · `mbr-fatima` فاطمة الزهراني / Fatima Al-Zahrani — viewer (external auditor). Sessions mint per member with locale `ar` default; `mbr-ibrahim` session fixture uses `en` (the auditor's LTR path).

### 2.1 Methodology profiles (rules as sourced data)

| id | name (ar/en) | school / preset | status·ver | nisabBasis | nisabGrams g/s |
|---|---|---|---|---|---|
| `prf-shafii-std` | الشافعي — الأساس / Shafi'i — Standard | shafii | approved·3 (by salman, T0−40d) | silver | 85 / 595 |
| `prf-hanafi-std` | الحنفي — الأساس / Hanafi — Standard | hanafi | approved·2 (T0−40d) | silver | 85 / 595 |
| `prf-hanbali-std` | الحنبلي — الأساس / Hanbali — Standard | hanbali | approved·2 (T0−40d) | silver | 85 / 595 |
| `prf-maliki-draft` | المالكي — قيد المراجعة / Maliki — In Review | maliki | **draft·1** | silver | 85 / 595 |
| `prf-contemp-aaoifi` | معاصر — مؤسسي (AAOIFI FAS 9) / Contemporary — Institutional (AAOIFI FAS 9) | contemporary · `aaoifi-fas9-net-asset` | approved·4 (T0−90d) | gold | 87.48 / 612.36 |
| `prf-contemp-reg` | معاصر — لائحة المنشآت / Contemporary — Corporate Regulation | contemporary · `corporate-regulation` | approved·2 (T0−60d) | gold | 87.48 / 612.36 |

Nisab grams 85/595 = 20 mithqal × 4.25 g and 200 dirham × 2.975 g (digest-cited [2]); 87.48/612.36 = the NZF convention (digest-cited [4][10]); silver basis for mixed assets "safer for the recipients" vs "some scholars maintain gold regardless" — both positions documented verbatim in the field's own guidance (digest [4]) and carried as the basis divergence between madhhab profiles (silver) and contemporary institutional profiles (gold). All grams are authority-editable data (07a).

**Seeded CategoryRules (differences bold; everything else shared):**

- `cash` · `trade-inventory` (valuationBasis market-value-at-period-end) · `investments` (zakatable-at-market): rate 1/40, hawlRequired true — all six profiles (digest [1][5][10]; inventory's intention-to-sell scoping per digest [7]).
- `gold-silver`: rate 1/40, market-value-at-period-end. **jewelryTreatment**: `exempt-within-uruf` + urufThreshold SAR 18,000.00 (shafii, hanbali) — divergence existence digest-cited [1], treatment seeded-default-verify; `zakatable` (hanafi, both contemporary presets) — seeded-default-verify. Entered weight is the PURE metal content (karat adjustment is the officer's evidence step; the 24-karat rule is digest-cited [3] and rides the rule's source note).
- `receivables`: strong → zakatable now (all profiles; digest [5][7]); **weak** → `on-receipt` (shafii/hanafi/hanbali/maliki — digest [6] committee-money treatment) vs `strong-zakatable` (both contemporary presets — seeded-default-verify, net-asset posture).
- `livestock-camels/cattle/sheep-goats`: hawlRequired false; minCount 5/30/40 (digest-cited [2]); band schedules below; **camel band 121–129**: 3 × hiqqah (three-year-old she-camel) in shafii/hanbali/maliki (digest-cited [3] table) vs **3 × bint-labun** (two-year-old) in hanafi — seeded-default-verify, the fixture's in-kind divergence.
- `agriculture-crops`: hawlRequired false; cropNisabKg 609.84 (digest-cited [2][3]); agricultureRates rain-fed 1/10, irrigated-at-cost 1/20, mixed 3/40 (5/10 split seeded-default-verify within the sourced 2.5–20% band [1]; mixed rate requires profile configuration else VALIDATION). Hanafi's broader produce scope (digest [2]) rides as a source-note on the hanafi profile's rule — v1 has one crop category, so the scope difference is narrated, not computed (12 Q-13).
- `minerals-rikaz`: rate 1/5, hawlRequired false, no threshold gate ("rikaz — no nisab" thresholdApplied; seeded-default-verify within [1]).
- **liabilityDeduction**: `current-only` (shafii, hanbali — seeded-default-verify) vs `all-due` (hanafi + both contemporary presets — digest-cited [6][10] "any debt that is owed is to be subtracted"; corporate regular-accounts posture digest [14]).
- `rounding`: half-up at the case currency's minorDigits (all profiles).

**Livestock band schedules (dueKind tokens with bilingual labels; counts exact):**

Camels: 1–4 → 0 · 5–9 → 1 shah (شاة) · 10–14 → 2 shah · 15–19 → 3 shah · 20–24 → 4 shah · 25–35 → 1 bint-makhad (بنت مخاض، ناقة سنة) · 36–45 → 1 bint-labun (بنت لبون، ناقة سنتين) · 46–60 → 1 hiqqah (حِقّة، ناقة ثلاث سنوات) · 61–75 → 1 jadhaa (جذعة، ناقة أربع سنوات) · 76–90 → 2 bint-labun · 91–120 → 2 hiqqah · **121–129 → 3 hiqqah (hanafi: 3 bint-labun)** · 130–139 → 1 bint-labun + 1 hiqqah · 140–149 → 1 bint-labun + 2 hiqqah · 150–159 → 3 hiqqah · 160–169 → 4 bint-labun · 170–179 → 1 hiqqah + 3 bint-labun · 180–189 → 2 hiqqah + 2 bint-labun · 190–199 → 3 hiqqah + 1 bint-labun · 200–209 → 4 hiqqah or 5 bint-labun (alternative recorded in trace narrative; certified in-kind uses the first-listed kind). Source: the majority schedule digest-cited [3] (per that page, after al-Qaradawi's *Fiqh az-Zakat*); the hanafi 121–129 variant seeded-default-verify.

Cattle: 1–29 → 0 · 30–39 → 1 tabi (تبيع، عجل سنة) · 40–59 → 1 musinn (مسنّ، بقرة سنتين) · 60–69 → 2 tabi · 70–79 → 1 musinn + 1 tabi · 80–89 → 2 musinn · 90–99 → 3 tabi (one-year-old cow-calf) · 100–109 → 1 musinn + 2 tabi · 110–119 → 2 musinn + 2 tabi · 120–129 → 3 musinn or 4 tabi. Source [3]; the 30-cattle nisab and four-school position digest-cited [2][3].

Sheep/goats: 1–39 → 0 · 40–120 → 1 head-of-sheep · 121–200 → 2 · 201–300 → 3 · 301–400 → 4 · 401–500 → 5 · 501+ → 5 + floor((n − 501 + 1)/100) (open band, perN 100). Source [3]. Kinds are never mixed for nisab purposes (digest [2]) — three livestock categories, three thresholds.

### 2.2 Nisab references (append-only; synthetic values marked)

| id | metal | per gram | asOf | enteredBy | sourceNote | active |
|---|---|---|---|---|---|---|
| `nis-g-01` | gold | SAR 228.40 | 2026-09-30 | nadia | "قيمة مرجعية مُصطنعة للتجربة — نمط جدول الدار؛ ليست بيانات سوق" / seeded fixture value, mint-table style; not market data | true |
| `nis-s-01` | silver | SAR 2.85 | 2026-09-30 | nadia | same seeded-fixture note | true |
| `nis-g-02` | gold | SAR 210.15 | 2025-09-30 | nadia | prior-year seeded fixture | false (superseded) |
| `nis-s-02` | silver | SAR 2.60 | 2025-09-30 | nadia | prior-year seeded fixture | false (superseded) |

### 2.3 Cases, items, and the deterministic results (verification table)

**Z-1041** — شركة النور للتجارة — دورة ٢٠٢٥ / Al-Noor Trading Co. — FY2025 · entity · 2024-10-01→2025-09-30 · SAR · prf-shafii-std · **locked** · exported · pins {nis-g-02, nis-s-02} · version 4. The prior-year certified case; its audit bundle artifact exists (§7).

**Z-1042 (the sample case, P22 badge)** — شركة النور للتجارة / Al-Noor Trading Co. · entity · 2025-10-01→2026-09-30 · SAR (minorDigits 2) · prf-shafii-std(v3) · **locked** · predecessorCaseId Z-1041 (reason: "تعديل ما بعد الدورة في الذمم" / post-period receivables adjustment) · pins {gold nis-g-01, silver nis-s-01} · version 6 · latestCalculation `calc-z1042-r2`. Items `z1042-i1…i8`: cash 1,250,000.00 · gold bullion 480 g (non-jewelry) · trade inventory 890,000.00 (market at period end) · strong trade receivable 340,000.00 · weak contested loan 75,000.00 · sukuk investments 210,000.00 · liability trade payables 430,000.00 · liability current bank-financing portion 120,000.00 — bilingual descriptions seeded (e.g. i2: "سبائك ذهب ٤٨٠ غرامًا" / "Gold bullion, 480 g").

**`calc-z1042-r2` exact derivation** (caseVersion 5 · profileVersion 3 · generatedBy nadia at T0−12d):
1. classify+value i1 → 1,250,000.00 zakatable (rule `shafii.cash.base`)
2. classify i2 gold-silver → value = 480 × 228.40 = **109,632.00** (rule `shafii.gold-silver.valuation`, pinned nis-g-01)
3. classify+value i3 inventory at market → 890,000.00 (`shafii.trade-inventory.market`)
4. classify i4 strong receivable → zakatable 340,000.00 (`shafii.receivables.strong`)
5. classify i5 weak receivable → **on-receipt, excluded** — excludedReason "weak recoverability — on-receipt rule" (`shafii.receivables.weak`)
6. classify+value i6 investments at market → 210,000.00 (`shafii.investments.zakatable-at-market`)
7. aggregate zakatableValue = **2,799,632.00**
8. classify i7, i8 liabilities → current-only scope (`shafii.liabilities.current-only`) → deduct 550,000.00
9. aggregate netBase = **2,249,632.00**
10. threshold: nisabValue = 595 g × 2.85 = **1,695.75** (silver basis) → **above**
11. rate 1/40 on netBase → 56,240.80 → round half-up (no change) → **zakatDue SAR 56,240.80**
12. hawlStatus: periodDays 365 · lunarYears 1.03 · midHawlFlags []
Trace = 16 lines (the count the completion announcement cites, 11); every line carries its rule id + source chip (jewelry/uruf rules absent here — no jewelry item). Per-category `dueMonetary` are standalone derivations (cash 31,250.00 · gold 2,740.80 · inventory 22,250.00 · strong receivables 8,500.00 · investments 5,250.00); the certified total is the aggregate-then-rate basket line (step 11) — declared policy, visible in the trace's authoritative final line.

**Z-1038 — هدى القحطاني — ملف شخصي / Huda Al-Qahtani — personal file** · individual · hawl 2025-10-26→2026-10-15 (354 days) · SAR · prf-shafii-std · **in-review** · pins {nis-g-01, nis-s-01}. Items: cash 46,500.00 · silver non-jewelry 210 g · **gold jewelry 60 g (isJewelry)** · weak loan receivable 9,000.00 · liability current renovation-loan portion 6,000.00 · liability non-current balance 16,000.00. Three seeded calculations (the comparison fixture):

| run | profile | jewelry | weak recv | liabilities deducted | netBase | zakatDue |
|---|---|---|---|---|---|---|
| `calc-z1038-r1` | shafii v3 | 60 × 228.40 = 13,704.00 → **exempt within uruf** (≤ 18,000.00) | excluded (on-receipt) | 6,000.00 (current-only) | 41,098.50 | **1,027.46** (4,109,850 ÷ 40 = 102,746.25 halalas → half-up → 102,746) |
| `calc-z1038-r2` | hanafi v2 | 13,704.00 **zakatable** | excluded (on-receipt) | 22,000.00 (all-due) | 38,802.50 | **970.06** (3,880,250 ÷ 40 = 97,006.25 → 97,006) |
| `calc-z1038-r3` | hanbali v2 | exempt within uruf | excluded (on-receipt) | 6,000.00 | 41,098.50 | **1,027.46** |

**`comp-z1038-c1`** (caseVersion 7): results shafii 1,027.46 · hanafi 970.06 · hanbali 1,027.46; **divergenceCount 1** — category gold-silver, perProfile dues 0.00 / 342.60 / 0.00, ruleRef `shafii.gold-silver.jewelry ↔ hanafi.gold-silver.jewelry`, reason: "الحلي ضمن العرف معفى (شافعي/حنبلي) مقابل خاضع للزكاة (حنفي)" / "jewelry exempt within uruf (Shafi'i/Hanbali) vs zakatable (Hanafi)". Basket-level narration from profile data (not a divergence row): the liability rule pair (current-only vs all-due) explains why the Hanafi total is LOWER by 57.40 despite including jewelry — jewelry +342.60 gross, extra deduction −400.00 gross at 1/40; the matrix states the shafii/hanbali pair plainly as "لا اختلاف / no divergence".

**Z-1040 — مزرعة الوادي الأخضر / Al-Wadi Al-Akhdar Farm** · entity · 2025-10-01→2026-09-30 · SAR · prf-shafii-std · **draft** · pins set. Items: camels 121 head · cattle 65 head · sheep/goats 145 head · rain-fed wheat 7,200 kg · irrigated barley 3,000 kg · operating cash 900.00. **`calc-z1040-r1`**: camels 121 → band 121–129 → **3 × hiqqah** (hanafi run would give 3 × bint-labun) · cattle 65 → band 60–69 → **2 × tabi** · sheep 145 → band 121–200 → **2 × head-of-sheep** · wheat 7,200 kg ≥ 609.84 → 1/10 → **720.0 kg** · barley 3,000 kg ≥ 609.84 → 1/20 → **150.0 kg** · monetary basket: netBase 900.00 < nisab 1,695.75 → **below** · zakatDue 0.00 · distanceToNisab **−795.75** (signed, present) · in-kind dues fire independently of the metal nisab — the honest below state (03 non-happy path).

**Z-1044 — سعيد المهنا / Saeed Al-Muhanna** · individual · hawl 2025-10-26→2026-10-15 · SAR · prf-shafii-std · **draft** · one item: cash 1,100.00. `calc-z1044-r1`: netBase 1,100.00 < 1,695.75 → below · zakatDue 0.00 · distance **−595.75**. The pure below-nisab fixture (exportable like any result — auditors ask for negatives too).

**Z-1045 — مؤسسة البركة التجارية / Al-Baraka Trading Est.** · entity · 2025-10-01→2026-09-30 · SAR · prf-contemp-reg · **draft** · empty items (the import-exercise case; §7 job fixture).

## 3. Exact computation rules (the engine — formulas, not vibes)

1. **Money**: integer minor units only. Rates are rationals (num/den): 1/40, 1/20, 3/40, 1/10, 1/5. `due_minor = floor(netBase_minor × num / den + 1/2)` (half-up; all seeded values positive). Never floats; never intermediate rounding.
2. **Gold/silver value**: `value_minor = weightGrams × perGram_minor` (integer grams × integer minor-per-gram — exact). **Nisab value**: grams at 2dp precision as integer centigrams — `nisabValue_minor = floor(nisabCg × perGram_minor / 100 + 1/2)` (silver 595 g = 59,500 cg × 285 minor/g ÷ 100 = 169,575 minor = SAR 1,695.75 ✓; gold-basis 87.48 g = 8,748 cg × 22,840 ÷ 100 = 1,997,923.2 → 1,997,923 = SAR 19,979.23 ✓; 85 g basis = 8,500 cg × 22,840 ÷ 100 = 1,941,400 = SAR 19,414.00 ✓).
3. **Basket (monetary classes)**: zakatableValue = Σ(cash, gold-silver value, inventory, strong-or-rule receivables, rule-eligible investments) − excluded per rules; deductibleLiabilities per profile scope; netBase = zakatableValue − deductibleLiabilities; aboveNisab ⇔ netBase ≥ nisabValue(basis); zakatDue = rate(netBase) per rule 1; below → 0.00 + signed distance. Livestock/crops/rikaz gates fire per category independently (07a hawlRequired false classes never wait for the metal nisab).
4. **Per-category dues** (comparison divergence rows + review display): standalone `floor(catValue × num / den + 1/2)`; the certified total is ALWAYS the basket computation — the trace's final aggregate line is authoritative and the divergence rows label themselves derivations.
5. **Livestock**: band lookup on head count per category (never mixed across kinds); fixed-count bands emit their exact due list; the open sheep band computes `5 + floor((n − 501 + 1)/100)`; alternative-kind bands (200–209 camels, 120–129 cattle) certify the first-listed kind and narrate the alternative; multi-kind bands emit every kind in totals.inKindDues with the primary kind in CategoryResult.dueInKind.
6. **Agriculture**: per crop item: nisab check `quantity.value ≥ 609.84` kg; due kg = `floor(kg × num / den + 1/2)` at 1dp (720.0, 150.0); irrigation `mixed` with no profile mixedRate → VALIDATION naming the configuration path.
7. **Hawl**: periodDays = periodEnd − periodStart (Gregorian date diff); lunarYears = round(periodDays / 354.367, 2) (the mean lunar year constant, declared); midHawlFlags = flagged item ids — included per the seeded 'include-with-flag' policy with the flag ON its trace line (never silently dropped or included); period < 340 days appends a threshold TRACE NOTE "period shorter than a lunar year — verify hawl completion" (a narrated warning, not a refusal — the officer's declared period is the hawl claim).
8. **Determinism**: a calculation is a pure function of (items at caseVersion, profile at profileVersion, pinned refs). `id = "calc-" + caseRef.toLowerCase() + "-r" + seq` where seq is keyed by `contentHash = sha256(canonical(items, profile, pins))[0..8]` — re-running unchanged inputs returns the IDENTICAL id and payload (07b rule 1); any edit bumps caseVersion and produces a new result, never a mutation.
9. **Gates** (all VALIDATION with named paths — 07b rules 2/3/5): draft/retired profile at run → names the approval gate and profile owner; createCase with non-approved profileId → refused at the door; locked/approved-case mutations (updateCase, item writes, pin, submit) → names `createSuccessorCase`; unpinned metal for a gold-silver item → names the metal and the manual entry path (CP-3); audit-bundle export requires locked; items-csv any status.
10. **Role gates** (PERMISSION, capability language — 07b rule 4): profile save/approve/retire → owner; review/lock/successor → reviewer+; submit → officer+; viewer → read + artifact reads only (exports of locked cases deliberately open — the auditor's seat).

## 4. Failure injection (MockConfig)

| flag | effect |
|---|---|
| `gates: true` (default) | every §3.9/§3.10 gate fires with its named path |
| `importBadRows` | `job-z1045-im1` accepts 5 of 6 rows; badRows = ["row 4 — 'أبقار ستون': quantity not numeric"]; prior-good kept; per-row retry offered |
| `conflictInjection` | `updateCaseItem` with stale `baseCaseVersion` → CONFLICT, details carry both payloads (server value + attempted patch) |
| `networkDrop` | one `listJobs`/poll cycle returns NETWORK (retryable, correlationId) then reconciles to authoritative state (async-contract §5) |
| `expiredArtifact` | `art-z1041-a0` pre-expired (T0−1d) → getArtifact NOT_FOUND with renew path (regenerable: true — locked case regenerates deterministically) |
| `unknownInjection` | `getArtifact("art-corrupt")` → UNKNOWN retryable with correlationId |
| `rateLimitWindows` | imports 40 / exports 60 per monthly window (reset at next month start); the 80% warn state is reachable by scripted calls (P14); **calculations and comparisons are unbounded by construction** — `getUsage.note` asserts it in-product |
| `permissionGates` | viewer session attempts `saveProfile` → PERMISSION (names the capability, never shames the role) |

## 5. Reset · snapshot · replay

`reset()` returns the store to the seed state of this document verbatim. `snapshot(name)` serializes the full store (workspace, members, profiles, references, cases, items, calculations, comparisons, jobs, artifacts, activity, usage counters, clock offset) to a named JSON snapshot; `restore(name)` rebuilds it byte-identically. `replay()` re-executes the recorded operation log from seed — because every computation is pure (§3.8), replay rebuilds identical results, ids included; the replay proof is part of the DoD. Snapshots never include secrets (there are none — zero credentials exist in the mock; LOOP-5 needs stay unbound).

## 6. Seeded jobs, artifacts, activity, usage

- **Jobs**: `job-z1041-e1` export·audit-bundle·succeeded (progress determinate: "توليد الحزمة ٣ من ٣ أجزاء" / "bundle part 3 of 3") · `job-z1045-im1` import·failed-rows-kept (awaiting-input on the bad row, links to its decision) · `job-z1038-c1` export·comparison-bundle·succeeded. Job schedule: queued@T0 → running@T0+2s (progress every 500ms) → terminal@T0+6s (import) / T0+4s (export); cancellation inside one interaction leaves the partial artifact policy visible.
- **Artifacts**: `art-z1041-a1` audit-bundle (bilingual, trace included) expires T0+14d, regenerable true · `art-z1041-a0` pre-expired (§4) · `art-z1038-a1` comparison audit-bundle expires T0+14d. Expiry windows are declared at creation (async-contract §2); the sample case's artifacts never mix into other exports unless explicitly included.
- **Activity** (P17, 18 seeded entries): case-created ×5 · items-imported ×1 (Z-1045 partial) · item-voided ×1 (an earlier mis-keyed weak-loan row in Z-1042, voided with reason then re-entered corrected — both events pre-lock, which is why the locked calculation pins caseVersion 5 while the case record reads version 6 after the lock transition) · calculation-run ×7 (five case runs + two comparison-internal runs) · comparison-run ×1 · nisab-set ×4 · case-submitted ×2 (Z-1041, Z-1042) · review-decision ×2 (both approve, notes seeded bilingual) · case-locked ×2 · export-run ×3 · profile-approved ×4 · profile-retired ×0. Every entry: actor, action, targetRef, timestamp (T0-relative), bilingual detail (e.g. "profile v3 under Shafi'i; zakat SAR 56,240.80" — 07a's example shape).
- **Usage**: window 2026-10 · calculationsRun 12 · comparisonsRun 2 · imports 3 · exports 5 · resetAt 2026-11-01 · note: "الحسابات غير خاضعة للعدّ أبدًا — الحتمية لا تُقتّر" / "Calculations are never metered — determinism is not rationed."

## 7. Mock-Adapter Definition-of-Done (00's contract, made checkable)

On the mock with every capability unbound: open Z-1042 → read all 16 trace lines with rule chips; create a case against `prf-maliki-draft` → VALIDATION naming the approval gate; enter Z-1045 items by hand AND import 6 rows (1 bad, named); set references, pin, run → exact figures per §2.3's verification table (56,240.80 / 1,027.46 / 970.06 / 1,027.46 / below-with-distance); run the comparison → divergenceCount 1 with the jewelry rule pair and the no-divergence pair stated plainly; run Z-1040 → in-kind dues as kind names + below-nisab monetary state; attempt a locked-case edit → successor path named; spawn successor → chain visible; export Z-1042's bundle (locked ✓) and Z-1045's items-csv (draft ✓); retrieve artifact; hit the expired artifact → NOT_FOUND + regenerate; re-run Z-1042 unchanged → identical `calc-z1042-r2`; replay the log → identical store; read every mutation in the activity log. Zero credentials, zero network, zero non-determinism.
