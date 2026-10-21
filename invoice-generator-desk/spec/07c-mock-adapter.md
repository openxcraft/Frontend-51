# 07c — Mock Adapter: invoice-generator-desk

In-memory, deterministic, zero external dependencies. Implements `InvoiceGeneratorAdapterV1` (07b). Delivery and export are **simulated async stages** per async-contract.md: Jobs that walk queued → running (milestone progress) → succeeded against fixed tables — no network, no timers beyond declared cadences. **Fixed seeded clock: 2026-10-17T09:30:00Z** — every date-dependent behavior (overdue derivation, due-date suggestions, artifact expiry) is deterministic against this clock.

## Seeds (fixed, named)

### Workspace W1 — "Nakhla Studio" (Riyadh design practice; defaultLocale en; defaultNumeralSystem western; defaultDueDays 14)

**Seller profile SP1**: legalName en "Nakhla Design Studio" / ar "استوديو نخلة للتصميم" · address en "Olaya District, Riyadh 12244, Saudi Arabia" / ar "حي العليا، الرياض ١٢٢٤٤، السعودية" (the postal code renders Western inside the Arabic string — bidi-isolated fixture) · paymentInstructions en "Bank transfer — Al Rajhi Bank, IBAN SA03 8000 0000 6080 1016 7519" / ar "تحويل بنكي — مصرف الراجحي، الآيبان SA03 8000 0000 6080 1016 7519" (SYNTHETIC IBAN fixture, disclosed as synthetic; the Latin IBAN token inside the Arabic string is the worst-case bidi-isolation fixture) · taxRegistrations: { scheme SA, number "300000000000003" } (SYNTHETIC 15-digit registration fixture — not a real registration).

**Tax schemes (seeded GCC table — rates are DATA with source notes, not law; all rate figures are the research digest's 2026 market-context values, editable per workspace):**
- SA — label en "Saudi Arabia" / ar "السعودية" · taxLabel en "VAT" / ar "ضريبة القيمة المضافة" · rate 1500 bps · requiresSeller+Client tax numbers · SAR (2) · sourceNote "Public standard-rate tables, 2026 — verify against current rules"
- AE — "United Arab Emirates" / "الإمارات" · "VAT" / "ضريبة القيمة المضافة" · 500 bps · client number not required · AED (2)
- BH — "Bahrain" / "البحرين" · "VAT" / "ضريبة القيمة المضافة" · 1000 bps · BHD (3) — the 3-decimal rounding fixture
- OM — "Oman" / "عُمان" · "VAT" / "ضريبة القيمة المضافة" · 500 bps · OMR (3)
- QA — "Qatar" / "قطر" · taxLabel en "No VAT" / ar "لا توجد ضريبة" · 0 bps · QAR (2) · sourceNote "VAT not implemented — 2026 sources"
- KW — "Kuwait" / "الكويت" · 0 bps · KWD (3) · sourceNote "VAT not implemented as of 2026 sources; timing unconfirmed (12 Q-10)"
- CUSTOM — unlabeled scheme shell for user-defined rates/labels/currencies.

**Series SER1**: prefix "INV-2026-", nextValue 7 (six numbers already consumed by history — the no-gap story). **Series SER2**: prefix "EUR-2026-", nextValue 3.

**Clients:**
- C1 "شركة الفنار التجارية" / "Al-Fanar Trading Co." — Riyadh, tax number "300000000000011" (synthetic), SAR.
- C2 "Gulf Retail Group FZE" — EN-only name/address (single-script fixture), AED, no tax number.
- C3 "بيت الأعمال للاستشارات" / "Bayt Al-Amaal Consulting" — AR-primary fixture, USD.

**Invoice fixtures (the worked history):**
- **INV-2026-0001 — settled** (issued 2026-08-30, due 2026-09-13; 2 line items; 15% SA; payment marks 2: 4,000.00 then 8,120.00 SAR → settled). Bilingual notes fixture.
- **INV-2026-0002 — VOIDED** (issued 2026-09-05, voided 2026-09-06, reason "wrong quantity — reissued as 0003"; number consumed — the no-gap fixture; marks blocked on it).
- **INV-2026-0003 — OVERDUE + partial** (issued 2026-09-15, due 2026-09-29 — 18 days past the fixed clock; 1 mark of 2,500.00 against 12,000.00 SAR; residual 9,500.00; the derived-overdue fixture — `overdue: true` recomputed at read).
- **INV-2026-0004 — issued, arabic-indic render** (2026-10-02; render.numeralSystem 'arabic-indic', layout 'stacked-bilingual', showAmountInWords true, showHijriDate true — the render-config-on-issued fixture: render changes legal, content frozen).
- **INV-2026-0005 — issued, BHD 3-decimal fixture** (client C2 variant scenario seed; unit prices at 3-decimal precision; taxAmount rounding at minorDigits 3).
- **INV-2026-0006 — DRAFT (the workbench fixture)**: C1, SA scheme, 3 line items — "Brand identity design" / "تصميم هوية العلامة" qty 1 × 12,000.00; "Stationery suite" / "طقم المطبوعات" qty 3 × 450.00; "Website direction (single language)" EN-only description qty 1 × 2,500.00. Live totals: subtotal 15,850.00 · discounts 0 · tax 2,377.50 · grand 18,227.50 SAR. render western/side-by-side/words-on/hijri-off.
- **SAMPLE-1 — sample draft** (`sample: true`): bilingual 3-line invoice at AED 5% with arabic-indic render — the first-run value-checklist object; clearable in one action (`sample-cleared` logged), never returns.

**Activity history**: 42 entries covering every action kind; the invoice-issued entries carry number + actor; the render-changed entries carry "numeral system: arabic-indic (render-only)".

**Jobs history**: export of INV-2026-0004 succeeded; delivery of INV-2026-0003 delivered 2026-09-15; one failed delivery fixture (delivery channel error, retryable).

## Deterministic computation rules (fixed tables — the product's arithmetic spine)

- **Line total** = round-half-up( qty × unitPrice × (1 − discountBps/10000), minorDigits ). Quantity parses as decimal string (≤2 fractional places).
- **Totals**: subtotal = Σ round-half-up(qty × unitPrice); discountTotal = Σ (line gross − line net); taxableBase = subtotal − discountTotal; taxAmount = round-half-up( taxableBase × rateBps / 10000 ); grandTotal = taxableBase + taxAmount. On DRAFT reads these compute live against the scheme's current state; at ISSUE they are pinned with the SchemeSnapshot (regression: editing the SA scheme's rate after 0004 never changes 0004's totals).
- **BHD/KWD/OMR fixtures round at 3 places** (INV-2026-0005 regression: taxAmount MUST carry 3 decimals; a 2-decimal rendering of a 3-decimal currency is a failing test).
- **Numbering**: issue takes series.nextValue, zero-pads to 4, concatenates prefix, increments the counter — all atomically after gates pass. Void keeps the number. Duplicate copies no number. Failed gate → counter untouched (regression: failing the client-tax-number gate on INV-2026-0006 leaves nextValue 7).
- **Amount-in-words (deterministic bilingual conversion, fixed tables)**: integer part segmented in groups of 3 (thousand/million/billion); Arabic table carries the group-name forms + the dual/plural noun-forms the language requires (مائة، مئتان، مئتا + عطف); fractional part read as "and X/fifty …" per currency (هللات/فلس/درهمًا…) — e.g. 18,227.50 SAR → EN "Eighteen thousand two hundred twenty-seven Saudi riyals and fifty halalas" · AR "ثمانية عشر ألفًا ومئتان وسبعة وعشرون ريالًا سعوديًا وخمسون هللة". Fixed regression strings pinned; no locale-dependent formatting library — the tables are product data.
- **Numeral rendering**: fixed digit map 0-9 → ٠-٩ applied ONLY at render; Western render uses "," thousands + "." decimal; Arabic-Indic render uses U+066C (٬) thousands + U+066B (٫) decimal. Canonical storage is untouched by either (regression: flipping SAMPLE-1's render leaves stored amountMinor identical).
- **Hijri display (optional render flag)**: presentation-only conversion with the method disclosed in-product per portfolio Q-5 (Umm al-Qura presentation for KSA contexts); the storage date stays Gregorian ISO (rtl-rules §3). Mock uses a fixed conversion table for seed dates — no calendar library dependency.
- **Derived overdue**: dueDate < clock AND paymentState ≠ 'settled' AND status = 'issued'. Voided invoices are never overdue (INV-2026-0002 regression).
- **Payment state**: Σ marks = 0 → unmarked; 0 < Σ < grandTotal → partial; Σ ≥ grandTotal → settled (overpayment permitted, flagged: residual renders negative with a plain overpayment label — never auto-logic).

## Delivery/export simulation

- `sendInvoice`: consent flag off → PERMISSION naming the document-delivery-channel capability class + the download alternative in the same surface (credential-contract §2/§6); consented → Job paced queued 100ms → running milestones ("preparing document… sealing render") → succeeded; `failDeliveryOnce` config → honest failed state with retry (nothing re-issued, nothing re-numbered — regression).
- `exportInvoice`: atomic PDF artifact; expiry 7 days from the seeded clock; artifact A-1 (INV-2026-0004's first export) is seeded EXPIRED → NOT_FOUND + regenerable path fixture; `failExportOnce` config → typed error, idempotent retry returns a fresh artifact; the artifact snapshots the render config it was generated under (regression: exporting 0004 under arabic-indic then flipping to western then re-exporting produces a second artifact with a different snapshot, both retained).
- `getUsage`: window "monthly"; exports 3 of 20, sends 2 of 10 — the calm-meter fixture; `quotaWarn` config → 17/20 (80% warning posture, P14).

## Behavior notes

- Error injection per method: MockConfig { latencyMs, errorRate, errorCode, consentGranted, failDeliveryOnce, failExportOnce, quotaWarn, clockFixed }. Fixed correlationIds `igd-corr-0001`…
- Stale-version conflicts: `updateInvoice` with baseUpdatedAt older than the store's updatedAt → CONFLICT with both payloads in details (both sides renderable in the DiffView twist, 06).
- Bilingual VALIDATION fixtures: client with zero-script name → VALIDATION "name: at least one language required"; issue with client tax number missing under SA scheme → VALIDATION naming scheme + field (the Tariq-persona gate).
- Search normalization on lists: alef/hamza variants, taa marbuta/heh, yaa/alif maqsura, tashkeel stripped (rtl-rules §4) — "شركة الفنار التجارية" matches "شركه الفنار التجاريه" (regression).
- reset() / snapshot() / replay(): full state restore; no randomness; no network; no timers beyond the declared cadences. Every 07b error class is injectable and typed per the union.

## Regression assertions (the DoD tests)

1. First-session path (00 success signals) passes with consentGranted=false and delivery channel entirely unbound: compose → toggle numerals → issue → export → download; the manual path is exercised end to end.
2. Numeral flip is render-only: SAMPLE-1 stored amounts identical before/after toggle; announcement emitted.
3. Issue gate ordering: number never consumed on gate failure; number assigned exactly once on double-submit (idempotency replay).
4. Void consumes: INV-2026-0002 keeps its number; series shows no gap; marks blocked on it.
5. Scheme pinning: edit SA rate → drafts recompute, issued invoices (0001/0003/0004) unchanged.
6. 3-decimal currency arithmetic: BH fixture tax at 3 places.
7. Overdue derivation against the fixed clock: 0003 overdue, 0002 never.
8. Amount-in-words pinned strings match for the SAR and BHD fixtures.
9. Arabic normalization search matches the taa-marbuta variant.
10. Every error class injectable and typed; delivery failure never mutates invoice state.
