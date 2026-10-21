# 07c — Mock Adapter: expense-claim-flow

In-memory, deterministic, zero external dependencies. Implements `ExpenseClaimAdapterV1` (07b) over the entities of 07a. No randomness, no network, no timers beyond declared cadences; identical call sequences produce identical states (the determinism contract is the mock's own test oracle). The OCR assist is simulated as a **fixed-field proposal table** — the mock has no model, and that is the point: the contract's confirm-gate is testable without any capability at all (the unbound-capability configuration is the default first rung).

## Seed dataset (fixed, named)

**Workspace** — "Bayan Trading & Logistics" (Riyadh; defaultLocale `en`; currency **SAR**; payoutMethods `["bank transfer", "cash", "payroll adjustment"]`; activePolicyPackId `pp-001`).

**Members** (5):

| id | nameEn | nameAr | role |
|---|---|---|---|
| mem-001 | Faisal Al-Otaibi | فيصل العتيبي | finance-admin |
| mem-002 | Amal Haddad | أمل حداد | finance-admin |
| mem-003 | Salem Al-Dosari | سالم الدوسري | approver (Commercial Head) |
| mem-004 | Huda Nassar | هدى نصار | employee (Regional Sales) |
| mem-005 | Nasser Kareem | ناصر كريم | approver (deputy) |

**Rate tables** (2 + sample; all amounts canonical minor units, SAR):

1. **`rt-001` "KSA Travel & Mileage 2026-H1"** — effectiveFrom 2026-01-01, effectiveTo 2026-07-01, status `superseded`, version 1, sourceNote "2026 travel policy memo v2 — verify against current policy". Tiers: Riyadh — domestic 400.00/day · Dubai — regional 500.00/day · Europe — international 950.00/day. Mileage: own-car 1.05/km · motorcycle 0.50/km. Proration 75%.
2. **`rt-002` "KSA Travel & Mileage 2026-H2"** — effectiveFrom 2026-07-01, open-ended, status `active`, version 2, sourceNote "2026 travel policy memo v3 — verify against current policy". Tiers: Riyadh 400.00 · Dubai **525.00** · Europe 950.00. Mileage: own-car **1.10/km** (the mid-year rate-change fixture — the dated-data proof) · motorcycle 0.55/km. Proration 75%.
3. **`rt-s01` "Sample rate table"** (flag `sample: true`, clearable): Riyadh 100.00/day · Dubai 150.00/day; own-car 0.50/km; proration 75%; effectiveFrom 2026-01-01, sourceNote "Sample values — replace with your real policy before trusting any number".

**Policy packs** (1 + sample):

- **`pp-001` "Expense Policy v3 (2026-H2)"** — rateTableId `rt-002`; receiptRequiredAbove 75.00; submissionWindowDays 45; lateSeverity `advisory`; taxRequiredOnReceipts `true`; perDiemMealDoubleDip `true`; matrix: upTo 2,500.00 → [mem-003] · upTo 10,000.00 → [mem-001] · upTo 50,000.00 → [mem-001, mem-005]; version 3; ACTIVE.
- **`pp-s01` "Sample policy pack"** (flag `sample: true`): rateTableId `rt-s01`; receiptRequiredAbove 50.00; window 30 days; lateSeverity advisory; taxRequired false; double-dip true; matrix: upTo 500.00 → [mem-001]; version 1.

**Claims** (4 + sample; fixed seeded clock: 2026-10-17T09:00+03:00 base, advancing only on declared actions):

1. **`clm-001` "Riyadh client visits — September"** (ref CLM-0139; Huda; status `submitted`; pack pp-001 v3 pinned; submittedAt seed − 18d):
   - item-101 mileage 2026-09-02, Riyadh office → KAFD client, own-car 38 km → 38 × 1.10 = **41.80** (breakdown cites rt-002 v2, effective 2026-07-01).
   - item-102 mileage 2026-09-02, return leg 38 km → **41.80**.
   - item-103 receipt 2026-09-02, vendor "مؤسسة النور للتجهيزات المكتبية", amount 240.00, tax 36.00 (15%), receiptNo "TN-88241", category office — receipt `rcp-101` attached.
   - item-104 receipt 2026-09-03, vendor "Qasr Al-Shaab Restaurant", amount 96.00, **no receipt attached** → **planted blocking `missing-receipt`** (96.00 ≥ 75.00 threshold).
   - item-105 receipt 2026-09-03, vendor "Qasr Al-Shaab Restaurant", amount 96.00, receiptNo "TN-90112", receipt `rcp-102` attached → **planted blocking `duplicate-receipt`** with item-104 (same vendor+date+amount; item-104 lacks a number but vendor+date+amount equality fires rule 4b).
   - Totals: 419.60; route: 419.60 ≤ 2,500 → single step level 1 → **Salem, pending**. Open findings: 2 blocking + 0 advisory (the gate-refusal fixture).
2. **`clm-002` "Dubai sales trip — October"** (ref CLM-0141; Huda; status `submitted`; submittedAt seed − 3d):
   - item-201 per-diem 2026-10-05 → 2026-10-08, Dubai tier, firstDayProrated true, lastDayProrated false: 3 full days × 525.00 + 1 × 75% (393.75) = **1,968.75** (breakdown rows verbatim; proration row labeled "first day — 75% per policy convention").
   - item-202 mileage 2026-10-05, home → RUH airport, own-car 65 km → **71.50**.
   - item-203 receipt 2026-10-06, vendor "Arabian Tea House Dubai", amount 180.00, tax 27.00, receiptNo "AE-4417", category **meals**, dated inside item-201's window → **planted advisory `per-diem-double-dip`** naming both items.
   - item-204 receipt 2026-10-07, vendor "مؤسسة النور للتجهيزات المكتبية — فرع دبي", amount 460.00, tax 69.00, receiptNo "TN-88241", receipt `rcp-103` (Arabic ZATCA-class tax invoice fixture: RTL script, "الرقم الضريبي 310123456700003", raw amount text "٤٦٠٫٠٠") → **planted advisory `cross-claim-duplicate`** against clm-003's item-301 (same receiptNo TN-88241 + amount within 180 days — the finance-review fixture).
   - Totals: 2,680.25; route: 2,500 < 2,680.25 ≤ 10,000 → level 1 Salem (approved at seed − 2d, comment "Rates and trip window check out") + level 2 **Faisal, pending**. Open findings: 0 blocking + 2 advisory. OCR draft `dr-103` on rcp-103: fields vendorName **high**, itemDate **high**, amount **medium** (raw "٤٦٠٫٠٠"), taxAmount **low**, receiptNumber **high** — the mixed-confidence fixture; an AppliedDraftRecord exists showing amount confirmed with edit (460.00) and tax confirmed as typed.
3. **`clm-003` "Office supplies — September"** (ref CLM-0132; Nasser; status `paid`; pack pp-001 v3; submitted seed − 40d):
   - item-301 receipt 2026-09-10, vendor "مؤسسة النور للتجهيزات المكتبية", amount 460.00, tax 69.00, receiptNo "TN-88241", receipt attached — the cross-claim sibling.
   - item-302 receipt 2026-09-11, vendor "Jarir Bookstore", amount 312.00, tax 46.80, receiptNo "JR-2024", receipt attached.
   - Chain: 772.00 ≤ 2,500 → level 1 Salem approved (seed − 39d). Payout `pay-001`: bank transfer, ref "TRF-8841", amount 772.00, paidOn seed − 36d, actor mem-002 (Amal) — **the stamp-moment fixture**.
4. **`clm-004` "Jeddah workshop — August"** (ref CLM-0128; Huda; status `rejected`):
   - item-401 mileage 2026-08-12, Jeddah workshop leg, own-car 240 km → 240 × 1.10 = 264.00; item-402 receipt 2026-08-12, vendor "Al-Baik", amount 84.00, receipt attached (no tax recorded → advisory `tax-missing`, resolved as false-positive with note "restaurant receipt — tax included in printed total").
   - Rejection: level 1 Salem, seed − 30d, reason "Workshop registration was prepaid by the company — resubmit with the registration line removed" (per-step reason fixture; the claim reopens to draft on Huda's next edit — the resubmission-cycle fixture).
5. **`clm-s01` "Sample — watch the gate refuse"** (ref CLM-S01; Huda; flag `sample: true`, clearable; status `submitted`): 3 items against `pp-s01` — mileage 20 km × 0.50 = 10.00; per-diem 2 days Riyadh × 100.00 with first day prorated = 175.00; receipt 60.00 with **no receipt attached** (60.00 ≥ 50.00 sample threshold) → 1 planted blocking `missing-receipt` + route single step Faisal. The P22 value moment: the reviewer watches the gate refuse, attaches the sample receipt, re-checks, approves.

**Receipts** (4): `rcp-101` Arabic ZATCA-class tax invoice (script `ar`) · `rcp-102` English receipt "Qasr Al-Shaab — Table 4" (script `en`) · `rcp-103` Arabic Dubai-branch tax invoice (script `ar`, the extraction fixture above) · `rcp-104` sample receipt (script `en`, ocrState `none` — the manual-path teacher).

**Jobs history**: one succeeded export (`job-001`, formats all five, artifact `art-001`, expiresAt seed + 7 days, regenerable, scope period Sept) · one **failed extraction** (`job-002`: rcp-104 mid-run failure at field 3 — partial fixture with vendorName+itemDate kept, `partial: true`, mode 'assist-draft', meteredUnitsCharged 0) · one succeeded extraction (`job-003`, rcp-103 → dr-103, meteredUnitsCharged 1). **Activity entries**: ~45 seeded covering every action kind in 07a (incl. two override-with-reason on resolved advisories and one delegation provenance record).

## Deterministic computation rules (the whole engine — specified exactly)

1. **Units & rounding**: all amounts canonical minor units (SAR halalas); distances canonical km. Computation rounds half-up to the minor unit **once per breakdown line** (lineAmount = round-half-up(quantity × unitAmount)); no intermediate rounding elsewhere. Display divides by 100 with exactly 2 decimals (the formatting rule, never a parsing rule — rtl-rules §3).
2. **Rate resolution**: the applicable table = the claim's pinned table when the claim pins one (submitted+), else the workspace-active pack's table, else the explicit `rateTableId` (studio preview). The effective row = the table whose `[effectiveFrom, effectiveTo)` contains the item date (open-ended when effectiveTo is absent). No effective row → `previewItemComputation` returns `applicable: false` with the nearest table offered — never a silent fallback; `addClaimItem`/`updateClaimItem` with no effective row → VALIDATION naming the item date and both nearest ranges. **Per-diem**: days = inclusive count of [dateFrom, dateTo]; prorated-day count = (firstDayProrated ? 1 : 0) + (lastDayProrated ? 1 : 0), VALIDATION if > 2 or if days = 1 and any proration flag set (a one-day trip has no full day — the policy convention mirrors the no-per-diem-for-one-day-travel rule class, 01 q4); breakdown rows = one row "N full days × dailyAmount" + one row "1 day × dailyAmount × prorationPercent (first|last — 75% per policy convention)" as flagged; computedAmount = Σ lineAmounts. **Mileage**: lineAmount = round-half-up(distanceKm × perUnitAmount) for the vehicle class's effective rate; breakdown single row with citation. `previewItemComputation` is a pure function of (inputs, table, pack, sampleAmountForRoute) — never persists.
3. **Policy findings** (computed at submission, re-computed on every item edit in draft, on `attachReceipt` against a submitted claim, and on `runPolicyCheck`; identical inputs → identical findings):
   - **missing-receipt** (blocking): receipt-kind item with `amount >= pack.receiptRequiredAbove` AND no attached receipt asset. Detail: measured "SAR 96.00 with no receipt", required "receipt required above SAR 75.00".
   - **duplicate-receipt** (blocking): two receipt-kind items in the SAME claim where (normalized receiptNumber OR normalized vendorName) AND itemDate AND amount are equal (empty receiptNumber on one side falls back to vendor+date+amount equality — the item-104/item-105 fixture). Both items carry the finding with sibling links.
   - **cross-claim-duplicate** (advisory): a receipt item whose normalized receiptNumber + amount + itemDate matches an item on another member's non-draft claim with item dates within 180 days; detail carries `siblingClaimRef` (CLM-0132 for the fixture).
   - **late-submission** (severity = pack.lateSeverity): submittedAt − max(all item dates) > submissionWindowDays; measured "51 days", required "45-day window".
   - **per-diem-double-dip** (advisory, only when pack.perDiemMealDoubleDip): a receipt item with expenseCategory 'meals' whose itemDate ∈ [a per-diem item's dateFrom, dateTo] on the same claim; siblings named.
   - **tax-missing** (advisory, only when pack.taxRequiredOnReceipts): receipt item with amount ≥ receiptRequiredAbove, an attached receipt, and no taxAmount; measured "no tax recorded", required "tax field required on VAT-relevant receipts" (the ZATCA-class advisory — evidence prompt, never a legal claim).
   - Normalization for all receipt-key comparisons: the 07a text pipeline (case-fold, trim, collapse whitespace; Arabic normalization per rtl-rules §4: tashkeel/tatweel stripped, alef variants unified, taa marbuta → haa, alif maqsura → yaa) — the applied ruleset is disclosed in the finding detail (ai-native-patterns §7.4 discipline, extended to deterministic matching).
   - Findings pin `policyPackVersion`; a pack edit never retro-mutates; resolutions: `edit-resolved` only via recompute (the rule passing after an item edit or receipt attach), `override` requires reason, `false-positive` records the rule's input values.
4. **Approval routing** (the cumulative DOA rule): given claim total T and matrix rows ascending by upToAmount: chain = every row with `upToAmount < T` (ascending) followed by the least row with `upToAmount >= T`. T above every row → VALIDATION at submit naming T and the highest threshold. Each row yields one step; the step's approver = the FIRST active member of the row's approverMemberIds (others are reassign targets). **Self-approval guard**: a step whose resolved approver is the claimant auto-assigns to the next level's approver with delegation provenance recorded; when the claimant is the resolved approver of the final (or only) step → submission VALIDATION ("no approver outside the claimant covers SAR … — finance must widen the matrix").
5. **Decisions & the gate**: `decideClaim` 'approve' with any open blocking finding → VALIDATION, `details.blockers` = every open blocking finding (id, kind, measured-vs-required one-liner) — the refusal never generic. Approve at level n < max → next step becomes current; approve at final level → status `approved`. Reject at any level → status `rejected`, per-step reasons recorded, claim reopens to draft on claimant edit. Query → status `queried'; claimant answer appends to the thread; approver re-decides. `reassignApprovalStep` records from/to/note/at; only the step's current assignee or a finance-admin may reassign.
6. **Payout**: first `recordPayout` on an approved claim → status `paid`; a second record without `correction` → CONFLICT; correction requires (supersedesRecordId, reason) → appends a superseding record, never rewrites; the claim stays `paid`. Methods outside Workspace.payoutMethods → VALIDATION.
7. **Lifecycle write guards** (07b rule 8): item/header mutations on `draft`/`rejected` only; `attachReceipt` and `resolvePolicyFinding` also on `submitted`/`queried`; `decideClaim`/`reassignApprovalStep` only on `submitted`/`queried` by the current assignee; `recordPayout` only on `approved` (or `paid` for corrections); `exportClaimPackage` on any non-draft status.
8. **Extraction simulation** (the conditionally-AI boundary): `extractReceiptDraft` reads the receipt's FIXED proposal table (seeded per receipt — no inference, no variance); fields carry seeded confidence bands; the run paces 120ms/field; `failExtractionAtField` aborts after the named field → job `failed` with `partial: true`, completed fields kept, `meteredUnitsCharged: 0`. Idempotent re-submit returns the original draft with `meteredUnitsCharged: 0`. Capability unbound (config `extractionCapability: 'off'`, the DEFAULT) → PERMISSION naming the capability class with the manual path stated in `details` — the manual form never blocks (08). `applyReceiptDraft` writes ONLY the confirmed field set; unconfirmed draft fields never reach the item; the AppliedDraftRecord stores proposed vs applied per field.
9. **Policy-data integrity** (`saveRateTable` / `savePolicyPack`): rate table — VALIDATION on tier/rate ≤ 0, currency ≠ workspace currency, empty sourceNote, prorationPercent outside (0, 100], or an effective-range overlap with another non-sample table of the same scope (both ranges named); pack — VALIDATION on matrix rows out of ascending order, duplicate upToAmount (both rows named), empty approver lists, or a rateTableId referencing a table in another currency. Saving bumps versions; claims and findings keep their pins; activation (workspace.activePolicyPackId switch) logs an activity entry with a diff summary.

## Behavior (per operation class)

- `createClaim` — currency + pack reference read from workspace at creation; the claim pins the pack VERSION only at submission (07a). No active pack → VALIDATION stating the studio must run first (the sample pack covers first-run).
- `listClaims` — lens `finance` requires finance-admin (PERMISSION otherwise); lens `approvals` returns claims with a pending step assigned to the session member; cursor pages ≤ 100; normalized bilingual search over reference/title/claimant names.
- `addClaimItem` / `updateClaimItem` — per-kind VALIDATION (negative/zero distance, malformed dates, per-diem window inverted, >2 prorated days); computed amount + breakdown returned on the claim view; stale baseRevision → CONFLICT both payloads; findings recompute per rule 3.
- `removeClaimItem` — receipt stays in the claim bin (assigned receiptAssetId cleared, asset kept); findings referencing the item close as `edit-resolved` on recompute.
- `attachReceipt` — oversized payload → VALIDATION naming accepted kinds; script detection fixed per fixture (`ar`/`en`/`mixed`); photo/upload paths require the storage-consent state when configured (PERMISSION in capability language otherwise); paste never requires consent.
- `extractReceiptDraft` / `applyReceiptDraft` — per rule 8; `applyReceiptDraft` with an empty fields array → VALIDATION (confirming nothing is not a write).
- `submitClaim` — empty claim (0 items) → VALIDATION naming the count; computes findings + route per rules 3–4; writes the pack version pin; idempotent re-submit returns the original SubmitResult.
- `withdrawClaim` — refused after any step approval (VALIDATION naming the approved level and approver).
- `runPolicyCheck` — recomputes per rules 3; result carries `mode: 'deterministic'`; re-running on unchanged state returns identical findings (the test oracle).
- `decideClaim` — per rule 5; reject without comment → VALIDATION; query requires a question; idempotency key prevents double-advance.
- `recordPayout` — per rule 6; paidOn in the future → VALIDATION.
- `exportClaimPackage` — artifacts expire at creation + 7 days; `regenerable: true` always; per-format partial failure injectable (`failExportFormat`); idempotent re-submit returns the original job; period scopes include only non-draft claims.
- `getArtifact` — expired → NOT_FOUND with the regenerate path; URLs carry an opaque token — never claim data in query strings (07a no-leak rule).
- `getUsage` — fixed window: extractions used 3 / included 50; exports used 2 / included 20; resetAt seed + 14d; `quotaExhausted: 'extractions' | 'exports'` config forces the RATE_LIMIT ladder copy (11).

## Failure injection

`MockConfig { latencyMs (default 90), errorRate (default 0), errorCode?, failExtractionAtField?, failExportFormat?, quotaExhausted?, extractionCapability: 'off' | 'on' (default 'off') }` — per-method injection; fixed correlationIds `ecf-corr-0001`…; failure responses follow the 7-token taxonomy of 07b exactly. No random jitter: latency and failure points are configuration, not chance.

## Test-support

`reset()` → seed state; `snapshot()` → named state capture; `replay(events)` → deterministic re-derivation; state hashes stable across runs (the determinism oracle — identical event sequences produce identical hashes). Zero external deps; no `Date.now` in any computation (timestamps derive from the fixed seeded clock, advancing only on declared actions). The unbound-capability default (`extractionCapability: 'off'`) is itself a test configuration: the 00 success signals run entirely under it.
