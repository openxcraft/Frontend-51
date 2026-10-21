# 07c — Mock Adapter: halal-certification-tracker

In-memory, deterministic, zero external dependencies. Implements `HalalCertificationAdapterV1` (07b). **Fixed seeded clock: NOW = 2027-03-15T08:00:00Z** — every date-derived state below is reproducible against it, and no operation consults a real clock. There is no AI simulation anywhere (non-AI declaration, 00/07a); there is no assist, no model, no quota beyond the import/export job windows. Imports and exports are simulated async stages per async-contract.md: Jobs that walk queued → running (determinate progress) → succeeded against fixed data — no network, no timers beyond declared cadences.

## Seeds (fixed, named)

### Workspace W1 — "جهة إتقان لمنح الشهادات / Itqan Halal Certification"

Members: M-01 "مريم العلي / Maryam Al-Ali" (owner) · M-02 "خالد الشامي / Khalid Al-Shami" (assessor) · M-03 "د. أحمد فتحي / Dr. Ahmad Fathi" (committee) · M-04 "سارة القاسم / Sara Al-Qasim" (viewer). Default locale ar (bilingual-ar direction, LOOP-6).

### Schemes + ladders (policy data — generic names, editable, versioned; defaults modeled on the sourced conventions recorded in 01, never branded)

| Scheme | Validity | Rungs (kind @ offsetDays before expiry) |
|---|---|---|
| S1 "النظام الخليجي / Gulf scheme" | 12 months | notify@180 · docs@120 · submit@90 (hard) · audit@45 · issue@30 (hard) |
| S2 "النظام العام / General scheme" | 12 months | notify@90 · submit@45 (hard) · issue@21 (hard) |
| S3 "النظام الرباعي / Four-year scheme" | 48 months | notify@120 · submit@90 (hard) · audit@30 · issue@14 (hard) |

Ladder versions: S1 v2 (edited once — the versioned-policy fixture: C-5 pinned v1, everything else v2), S2 v1, S3 v1.

### Ingredients (11 master records, bilingual)

| Id | Name (ar/en) | E-no | Source | Status | Evidence req |
|---|---|---|---|---|---|
| I-01 | جيلاتين / Gelatin | E441 | animal | mashbooh | yes |
| I-02 | سكر / Sugar | — | plant | halal | no |
| I-03 | ماء / Water | — | mineral | halal | no |
| I-04 | نكهة الفراولة الاصطناعية / Artificial strawberry flavour | — | synthetic | mashbooh | yes |
| I-05 | أجار / Agar | E406 | plant | halal | no |
| I-06 | جلسرين نباتي / Vegetable glycerin | E422 | plant | mashbooh | yes |
| I-07 | أحادي وثنائي الجليسريدات / Mono- and diglycerides | E471 | synthetic | mashbooh | yes |
| I-08 | حمض الستريك / Citric acid | E330 | microbial | halal | no |
| I-09 | قرمز / Carmine | E120 | animal | **haram** | yes |
| I-10 | أصفر الشفق / Sunset Yellow | E110 | synthetic | **under-review** | yes |
| I-11 | دقيق القمح / Wheat flour | — | plant | halal | no |

I-09 (haram, classified by M-03 on 2027-01-20 with justification recorded) and I-10 (under-review, committee docket pending) are the classification fixtures. Import history: I-01's directory entry carries the normalization fixture — a pasted row "جيلاتين" (alef-maksura variant spelling of جيلاتين) merges into I-01 at import (rtl-rules §4 rules; the merged variant is counted, disclosed at search time).

### Supplier certificates (4 evidence records)

| Id | Supplier | Number | Issuer | Issued | Expires | Derived state @ NOW |
|---|---|---|---|---|---|---|
| SC-01 | شركة الشرق للجيلاتين / East Gelatin Co. | SG-88214 | Halal Trust Certification | 2024-04-06 | **2027-04-05** | **expiring-soon (21d)** |
| SC-02 | شركة النكهات المتحدة / United Flavors Ltd. | UF-55190 | Crescent Halal Body | 2026-07-01 | 2028-06-30 | valid |
| SC-03 | شركة الشرق للجيلاتين (سابقاً) / East Gelatin Co. (previous) | SG-77103 | Halal Trust Certification | 2022-03-10 | **2027-01-20** | **expired — kept as history** |
| SC-04 | الشركة الكيميائية الغذائية / Food Chemical Co. | FC-33018 | Gulf Food Assurance | 2026-01-11 | 2028-01-10 | valid |

SC-01's 21-day state is the impact-analysis driver; SC-03 evidences that expired certificates remain records (history filter on the vault).

### Applicants, products, formulations (3 applicants, 4 products)

**A1 "شركة الواحة للأغذية / Al-Waha Foods Co." (jurisdiction: KSA, facility الرياض/Riyadh — bakery line)**
- P1 "جيلي الفواكه / Fruit Jelly" — formulation F-1 v2 (under initial case APP-1): I-01 gelatin (SC-01, resolution R-1: "شهادة المورد تغطي مشتقات جلود أبقار مذبوحة وفق الشريعة" — supplier-evidence basis) → line state **evidence-expiring-soon** · I-02 sugar → resolved · I-03 water → resolved · I-04 strawberry flavour (SC-02, resolution R-2) → resolved · I-08 citric acid → resolved. Completeness: 5 lines, 4 resolved + 1 gate-passing attention.
- P2 "خليط الكيك الجاهز / Ready Cake Mix" — formulation F-2 v1: I-11 دقيق القمح / wheat flour → resolved · I-02 sugar → resolved · I-07 mono-diglycerides (**no resolution yet → unresolved-mashbooh — the issuance-gate fixture**) · I-06 vegetable glycerin (SC-04, resolution R-3 by M-03, committee-ref "لجنة-٢٠٢٦-١١") → resolved. Completeness: 4 lines, 3 resolved, 1 unresolved.

**A2 "مصنع النخيل للحلويات / Al-Nakhl Sweets Factory" (jurisdiction: UAE, facility دبي/Dubai — sweets line)**
- P3 "حلوى الجيلاتين الملكية / Royal Gelatin Sweets" — formulation F-3 v3: I-01 gelatin (SC-01, resolution R-4) → **evidence-expiring-soon** · I-05 agar → resolved · I-02 sugar → resolved · I-10 sunset yellow → **unresolved-review (blocking)**.

**A3 "مصنع بركة للحلويات / Baraka Sweets Factory" (jurisdiction: KSA, facility جدة/Jeddah)**
- P4 "بسكويت التمر / Date Biscuits" — formulation F-4 v1: all-resolved clean fixture (I-02, I-08, I-05).
- P5 "كعك العجوة المحشو / Ajwa Stuffed Pastry" — formulation F-5 v1: includes I-06 glycerin (SC-04, resolution R-5) resolved; one line evidencing SC-03 historically (the expired-evidence history fixture on an older formulation version, v0).

### Applications (cases)

- APP-1 · A1 · initial · S1 · [P1] · stage `decision` — audit record AR-1 (2027-02-20, auditor "سعيد العمري", findings "لا مخالفات جوهرية؛ ملاحظة واحدة على سجلات التنظيف", non-conformities 0/closed) recorded; grant decision DC-1 by M-03 (2027-03-01, committee-ref "لجنة-٢٠٢٧-٠٣"). **Issuance-gate fixture: issueCertificate(APP-1) SUCCEEDS** (F-1's evidence-expiring-soon line is gate-passing — attention, not block).
- APP-2 · A1 · initial · S2 · [P2] · stage `formulation` — the in-progress case: F-2's unresolved E471 line blocks nothing yet (formulation stage) but will refuse issuance later.
- REN-1 · A1 · renewal · S2 · [P2] · linked C-3 · stage `formulation` · opened 2026-11-15 — the renewal-in-progress fixture (P11 recall: applicant, product, unchanged ingredients pre-populated).
- MOD-1 · A2 · modification · S1 · [P3] · linked C-2 · stage `documents` — the mid-cycle reformulation path fixture (opened 2027-03-02).

### Certificates (6 — the register)

| Id | Number | Applicant | Scheme | Products | Issued | Expires | Status | Derived @ NOW |
|---|---|---|---|---|---|---|---|---|
| C-1 | HCT-2026-0118 | A1 | S1 | [P1] | 2026-04-05 | 2027-04-05 | active | **21d · overdue** — submit rung (2027-01-05) and issue rung (2027-03-06) both missed-hard; no renewal case |
| C-2 | HCT-2026-0131 | A2 | S1 | [P3] | 2026-06-10 | 2027-06-10 | active | **87d · due-soon** — notify rung (2026-12-11) reached; submit (2027-04-11) upcoming |
| C-3 | HCT-2026-0090 | A1 | S2 | [P2] | 2026-02-28 | 2027-02-28 | active | **lapsed** (15d past) — REN-1 open since 2026-11-15; notify rung (2026-11-30) cleared by the renewal case; submit (2027-01-14) missed-hard; issue (2027-02-07) missed-hard; the gap will record honestly when REN-1 issues |
| C-4 | HCT-2024-0044 | A3 | S3 | [P4] | 2024-06-01 | 2028-06-01 | active | **473d · steady** — all rungs upcoming (first: notify 2028-02-01) |
| C-5 | HCT-2025-0067 | A2 | S1 | [P3] | 2025-06-10 | 2026-06-10 | renewed | supersededBy C-2 — the clean handover: successor issued 2026-06-10, zero-day gap; pinned ladder v1 (pre-edit) |
| C-6 | HCT-2026-0101 | A3 | S2 | [P5] | 2026-05-01 | 2027-05-01 | suspended | suspended 2027-02-10 by M-01, reason "شهادة مورد منتهية دون بديل معتمد" — zone null (suspended exits urgency) |

C-1's rung detail (the Monday alarm): notify@180 → due 2026-10-07, **reached** (no renewal case) · docs@120 → 2026-12-06, **reached** · submit@90 → 2027-01-05, **missed** (hard) · audit@45 → 2027-02-19, **reached** (soft, recordable) · issue@30 → 2027-03-06, **missed** (hard). The renewal console renders C-1 first.

### Jobs + artifacts history

- JOB-01 ingredient-import: succeeded — 14 rows in, 2 variants merged (جيلاتين spellings), 0 invalid.
- JOB-02 register-export: succeeded 2027-02-20; artifact **A-01 EXPIRED** (7-day window elapsed 2027-02-27) → `getArtifact` → NOT_FOUND + regenerable path fixture.
- Activity log: one entry for every seed mutation above (applicant-created ×3, application-created ×4, ingredients-imported, ingredient-updated ×2 [I-09 haram classification with detail "mashbooh -> haram", I-10 under-review], formulation-saved ×5, supplier-cert-recorded ×4, resolution-recorded ×5, audit-recorded ×1, decision-recorded ×1, certificate-issued ×6, certificate-suspended ×1, renewal-opened ×1, ladder-updated ×1, export-run ×1).

## Deterministic computation rules (fixed formulas — the product's core heuristics)

1. **Normalization at import**: strip tashkeel; أ/إ/آ → ا; ة → ه; ى → ي (rtl-rules §4). A pasted row whose normalized name matches an existing master merges into it (`mergedVariants` counted, disclosed at search time). Rows missing either locale's name → invalid, named by row number.
2. **Supplier-certificate state** (derived at read, never stored): `expired` if expiresAt ≤ NOW · `expiring-soon` if NOW < expiresAt ≤ NOW + 90d · `valid` if expiresAt > NOW + 90d.
3. **Formulation-line resolution** (derived at read): haram → `haram` (never resolved) · under-review → `unresolved-review` · mashbooh → `resolved` iff resolutionId present AND (evidence not required OR supplier-cert state ∈ {valid, expiring-soon}); `unresolved-mashbooh` otherwise · halal → `resolved` / `evidence-expiring-soon` / `evidence-expired` by the same cert-state split (no evidence required → `resolved`). **Gate-passing states: `resolved` and `evidence-expiring-soon` only.**
4. **Issuance gate** (issueCertificate): every line gate-passing AND an audit record with non-conformities state ∈ {closed, waived} AND a grant decision — else VALIDATION with `details.unresolvedLines` naming each line (ingredient name + state) and `details.missing` naming missing records.
5. **Rung computation**: dueDate = expiresAt − offsetDays (calendar-day arithmetic). State: `cleared` if the rung's clearance event exists (below) · else `missed` if (rung is hard: submit/issue AND today > dueDate) OR (today > expiry) · else `reached` if today ≥ dueDate · else `upcoming`. Clearance events: notify → a renewal application exists for the certificate · docs → renewal application stage ≥ formulation · submit → renewal application stage ≥ audit · audit → audit record recorded on the renewal application · issue → successor certificate issued.
6. **Urgency zones** (active certificates only): `lapsed` if today > expiry · else `overdue` if any hard rung missed OR (daysToExpiry ≤ 30 AND issue rung not cleared) · else `due-soon` if any rung reached · else `steady`. Suspended/withdrawn/renewed → zone null.
7. **Impact graph walk** (getIngredientImpact — synchronous, ≤300ms at seed scale per 10): ingredient → formulation lines (current formulations of all products) → products → certificates carrying those products with status ∈ {active, lapsed, suspended} (renewed/withdrawn excluded — historical) → applicants. Affected certificates sorted by daysToExpiry ASC. Severity: `blocking` if ingredient.status = haram · else `review` if any affected line is unresolved-mashbooh/unresolved-review · else `evidence` if any line is evidence-expiring-soon/evidence-expired · else `none`. Seed regression: I-01 → severity `evidence`, 2 affected certificates (C-1 21d, C-2 87d), 2 applicants, lineStates {evidence-expiring-soon: 2} · I-09 → severity `blocking`, 0 affected certificates (the honest-empty impact: "no issued certificate carries this ingredient") · I-07 → severity `review` via F-2's unresolved line, 1 affected certificate (C-3, lapsed — lapsed certificates are included by rule 7), lineStates {unresolved-mashbooh: 1}.
8. **Renewal case creation** (openRenewalCase): pre-populates applicant, products, and unchanged-ingredient lines from the linked certificate's formulation snapshot (P11); refuses (CONFLICT) when a successor or open renewal exists; refuses (VALIDATION) on suspended status.
9. **Numbering**: certificate numbers are the body's own strings (input at issuance); the mock enforces uniqueness (CONFLICT on reuse).

## Behavior

- `importIngredients`: paced 60ms/row-chunk; invalid row → kept-prior rows + named bad rows (partial policy, async-contract §4); duplicate normalized name → merged variant counted, master untouched; idempotency-key replay returns the original job.
- `exportRegister` / `exportCertificate`: Jobs paced in fixed stages (queued 100ms → running "document 2 of 3" milestones → succeeded); artifacts expire in 7 days; A-01 expired → NOT_FOUND + regenerable; `failExportFormatOnce` → partial failure with per-format retry; idempotent re-export returns the same artifact. Bilingual by construction: both scripts render in the document, Arabic leading (05 direction model).
- `issueCertificate`: gate per rule 4; success computes expiresAt = issuedAt + scheme.validityMonths, pins the scheme's live ladder version, sets supersedes/supersededBy when the case is renewal/modification (MOD-1 issuing → C-2 superseded, chain recorded; REN-1 issuing after lapse → the gap days render on CertChainLink).
- `setCertificateStatus`: suspend requires reason (logged); withdrawn is terminal (subsequent VALIDATION); suspended → active reinstatement allowed with reason; all transitions append ActivityEntry.
- `updateIngredient` status change (e.g., a test flipping I-01 to haram): appends detail "mashbooh -> haram"; the NEXT `getIngredientImpact` and `listCertificates` reads reflect the blocking severity and the register's attention counts — derivation is immediate and stateless.
- `advanceApplication`: forward-only per 07b rule 4; REN-1 advancing to `audit` clears C-3's submit rung on the next read (rule 5) — the rung-state change is observable without any stored mutation (computed honesty).
- `updateRenewalLadder`: version bump; C-5 keeps pinned v1 (immutable); non-monotonic offsets → VALIDATION before any mutation.
- Errors: every class injectable via MockConfig { latencyMs, errorRate, errorCode, storageAttached, notificationChannelBound, failExportFormatOnce, quotaExhausted }; fixed correlationIds `hct-corr-0001`…; `storageAttached: false` → document fields run metadata-mode with reference strings (the LOOP-5 primary path — the full CP-1→CP-5 loop completes, 00 success signal).

## Test-support

reset() / snapshot() / replay(): full state restore; no randomness; no network; no timers beyond declared cadences; the seeded clock never advances (lapse states are fixtures, not ticking). Regression assertions: (a) rule-7 impact counts exact for I-01/I-09/I-07; (b) C-1 zone = overdue with submit+issue missed; (c) C-5 pinned ladder v1 unchanged after an S1 policy edit; (d) issuance gate refuses APP-2 naming the E471 line, succeeds APP-1; (e) every error class injectable and typed per the 07b union; (f) metadata-mode loop completes with storageAttached=false; (g) expired artifact A-01 → NOT_FOUND with regenerable=true; (h) normalization fixture merges the جيلاتين variant every run.
