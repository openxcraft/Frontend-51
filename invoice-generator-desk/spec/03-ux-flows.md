# 03 — UX Flows: invoice-generator-desk

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation exactly once — no orphans, no phantoms. Deterministic arithmetic runs inline at compose time (live totals) and is pinned at issue (07a state obligations).

## CP-1 — First invoice in the first session (value proof)

1. Layla enters the empty invoices home. First-run surface offers the value checklist (P22): complete seller identity → add a client → compose → issue → download. The seeded sample draft invoice is one click away (P22 honest milestone, clearable, never returns once cleared — 07c). `getSession` · `listInvoices`
2. She opens setup and completes the seller profile: bilingual legal name, address in both scripts, tax-registration number, bank-transfer instruction text (payment instructions are document content — evidence for the payer, not payment collection). `getSellerProfile` · `updateSellerProfile`
3. She reviews the tax-scheme table, seeded with the GCC landscape (15% KSA / 5% UAE / 10% Bahrain / 5% Oman / no-VAT Qatar and Kuwait / custom). The Saudi scheme card shows the bilingual tax label, the rate, and the registration-number gate. `listJurisdictions`
4. She adds her first client with a bilingual name and address and the client's tax-registration number. `listClients` · `createClient`
5. She creates the draft invoice: client, scheme, currency (SAR), issue/due dates, notes in one or both languages. The composer renders the live document preview side-by-side. `createInvoice`
6. She adds line items: quantity, unit price, optional per-line discount, bilingual description on the Arabic-facing lines. Each row's live total updates within the keystroke budget (10). `addLineItem` · `updateLineItem` · `getInvoice` (totals refresh after each mutation)
7. She flips the numeral toggle to Arabic-Indic: every figure on the document preview re-renders ٠-٩ in the ≤120ms signature crossfade; the totals rail's stored figures are untouched (render-only, announced politely). `updateDocumentRender`
8. She issues: the confirm gate names what freezing means (content becomes immutable; the sequential number is assigned and consumed). Validation runs the scheme's required-field gates first. `issueInvoice`
9. She exports the PDF (manual path — zero credentials, the LOOP-5 primary from first run) and downloads it. `exportInvoice` · `getArtifact` · `listJobs`

**Edges**: bilingual fields accept one or both scripts per field (a single-script client renders single-script blocks — the document degrades gracefully, never blanks); currency minor digits follow the scheme's currency (BHD/KWD/OMR round at three places — shown in the totals breakdown); a client whose tax number is absent while the scheme requires it → the draft composes fine, the issue gate blocks with the named field (fail at the gate, not mid-typing); quantity accepts up to 2 decimal places; the due date is optional with a workspace default (N days).
**Failures**: seller profile missing a scheme-required field at issue → VALIDATION naming the field and the scheme; line item with zero quantity → VALIDATION on the row; export failure mid-artifact → typed error + retry (artifact partial policy per 07b); stale draft edit (another tab) → CONFLICT with both payloads.
**Recovery**: drafts are re-editable forever until issued; a failed issue never consumes a number (assignment is atomic with validation success — 07b rule 1); a failed export re-runs idempotently.

## CP-2 — The monthly rhythm: duplicate → edit → issue → deliver (the daily loop)

1. Omar opens invoices home and finds last month's retainer invoice. `listInvoices`
2. He duplicates it: a new draft copies client, scheme, currency, line items, notes, and render config — but never a number (numbers are assigned only at issue). `duplicateInvoice`
3. He adjusts: dates, one line item's quantity, a swapped deliverable description; removes a finished line and adds a new one. `updateInvoice` · `updateLineItem` · `removeLineItem` · `addLineItem`
4. He issues. The next sequential number from the series is assigned atomically. `issueInvoice`
5. He delivers through the abstract document-delivery channel (consent-gated per 08 N1) — or downloads the PDF and emails it himself; both paths are first-class. `sendInvoice` (capability path) · `exportInvoice` + `getArtifact` (manual path)
6. Delivery state lands on the issued invoice view as an honest record: queued → delivered | failed, with the channel named in capability language, never vendor language. `getInvoice`

**Edges**: duplicating an invoice whose scheme was since edited → the draft re-pins to the scheme's current rate (drafts compute live; issued invoices keep their pinned totals — 07a); duplicating a voided invoice → allowed (the document is a template source, the number is not copied); a bilingual note on one invoice and a single-script note on the duplicate → both render correctly, isolated per field.
**Failures**: unconsented delivery channel → PERMISSION naming the capability class with the download alternative stated in the same surface (credential-contract §6); channel failure after issue → delivery record state failed with retry; the invoice itself is unaffected (document and delivery are separate concerns — 07a).
**Recovery**: a failed send never re-issues or re-numbers anything; retry sends with a fresh idempotency key replay window (07b rule 7).

## CP-3 — Payment marks, partial payments, and the overdue chase

1. Layla filters invoices home to overdue (derived: due date passed and payment state not settled — never stored as a fact, always recomputed). `listInvoices`
2. She opens the issued invoice: read-only document, payment-mark panel, delivery history, render controls. `getInvoice`
3. She records the client's partial transfer: amount, date, method label, bank reference. The payment state recalculates (unmarked → partial) and the residual amount displays. `recordPayment`
4. She immediately corrects a typo in the mark (wrong reference) — delete with a 7-second undo window (P03) rather than a confirm dialog. `deletePaymentMark`
5. She flips the document's numerals to Western for the finance team's follow-up and re-sends through the channel. `updateDocumentRender` · `sendInvoice`
6. The full audit of who did what sits in the activity log (P17). `listActivity`

**Edges**: a payment mark larger than the residual → allowed (overpayment is recorded evidence, flagged plainly, never guessed into a ledger); marks on a voided invoice → blocked (VALIDATION — a voided document collects no evidence); currency mismatch between mark and invoice → VALIDATION naming both currencies; marks never mutate the issued document's content (evidence is appended, the paper is frozen).
**Failures**: concurrent mark recording → CONFLICT with both marks kept; NOT_FOUND on a stale invoice link (deleted draft in another tab).
**Recovery**: marks are append-only with delete-undo; the payment state is always recomputed from marks, so history cannot drift (07a).

## CP-4 — Jurisdiction and numbering configuration (the setup flow)

1. Omar opens setup → tax schemes. The seeded GCC table renders with rates, bilingual labels, and required-field flags; each row carries a source note ("captured from public rate tables, verify against current rules" — rates are data, not law). `listJurisdictions`
2. He edits the Bahrain scheme's default rate (his client confirmed a change) — the edit is versioned and logged; issued invoices keep their pinned totals; drafts recompute live. `updateJurisdiction`
3. He creates a second number series for the European clients ("EUR-2026-") alongside the default. `createNumberSeries` · `listNumberSeries`
4. He adds the seller tax-registration numbers per scheme — the required-field gate reads these at issue time. `updateSellerProfile`
5. He returns to compose; the new series appears in the invoice header picker with its next-number preview (the number is disclosed as a preview, not a reservation — reservation happens only at issue). `createInvoice`

**Edges**: editing a scheme's tax label in one language only → allowed (labels are per-language fields; a missing side renders that language's block without the tax label line — visible in preview, honest, fixable); a scheme rate of 0% → valid (no-VAT regimes — the tax block renders the scheme's zero-rate label or omits per scheme config); deleting a scheme → blocked while any invoice references it (referential integrity, 07a); two series with clashing prefixes → VALIDATION at creation.
**Failures**: stale scheme edit (concurrent) → CONFLICT both payloads; series creation with a next value below already-issued numbers → VALIDATION explaining the sequence would repeat.
**Recovery**: scheme edits are versioned; series counters are append-only integers — never hand-editable (sequence integrity is the product's compliance spine, 01 [39][41]).

## CP-5 — Library, exports, jobs, and workspace management (the daily surface)

1. Invoices home: filter chips + saved views (P08) by status, scheme, client, payment state, overdue; virtualized beyond 200 rows (P19). `listInvoices`
2. She voids a mistakenly issued invoice — P04 level 2: confirm names the consequence and that the number stays consumed (no gap). Reason is mandatory. `getInvoice` · `voidInvoice`
3. She exports a month's invoices as separate PDF artifacts (batch of jobs, each with expiry + renewal). `exportInvoice` · `listJobs`
4. Usage surface: exports and channel sends this window against the soft quota (P14 — calm meter, warning at 80%). `getUsage`
5. Activity log: filterable actor-action-target-timestamp surface, exportable (P17). `listActivity`
6. Session/roles: owner and editor compose and issue; viewer reads and exports only. `getSession`

**Edges**: filtered-empty declares itself (P01); no-access invoices → PERMISSION surface, never "empty"; an expired artifact → NOT_FOUND with renewal; virtualized list focus preservation (P19).
**Failures**: NETWORK mid-list → banner + retry (P20); usage read failure → "last known" posture.
**Recovery**: all lists cursor-paginated and re-fetchable; locale flip re-renders without data loss.

## Non-happy paths

- **No delivery channel bound (LOOP-5, the default first-run state)**: download/print is the primary path from minute one; the channel path renders as optional with the consent surface — never a wall (08 N1). The 00 success signals test exactly this state.
- **First-run sample**: the seeded sample draft invoice (bilingual, 3 line items, Arabic-Indic render) lets the numeral flip and the totals breakdown be experienced before any real data exists; clearing it is one action and it never returns (07c).
- **Viewer role**: composer actions hidden, not disabled-with-mystery; read/export paths fully functional.
- **Offline (P20)**: issued-invoice reads and draft editing queue writes with per-item state; jobs reconcile to authoritative state on reconnect.
- **Worst-case mixed-script day**: an Arabic client name inside English chrome, a Latin brand token inside the Arabic description, Western digits inside Arabic prose — all bidi-isolated per rtl-rules §2 (09 verification matrix).

## Failure → error mapping

VALIDATION (issue-gate fields, zero-quantity rows, series prefix clash, mark/void rules, scheme integrity) · NOT_FOUND (stale invoice/client/artifact links, expired artifacts) · PERMISSION (delivery-channel consent, viewer role, workspace scoping) · CONFLICT (concurrent draft edits, concurrent marks, concurrent scheme edits) · RATE_LIMIT (channel sends, export jobs — soft quota with ladder notice) · NETWORK (list fetches, artifact delivery, job polling) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, CP-5.6 | `issueInvoice` | CP-1.8, CP-2.4 |
| `getSellerProfile` | CP-1.2 | `voidInvoice` | CP-5.2 |
| `updateSellerProfile` | CP-1.2, CP-4.4 | `duplicateInvoice` | CP-2.2 |
| `listClients` | CP-1.4 | `updateDocumentRender` | CP-1.7, CP-3.5 |
| `createClient` | CP-1.4 | `recordPayment` | CP-3.3 |
| `updateClient` | CP-4 setup (client edits from clients surface) | `deletePaymentMark` | CP-3.4 |
| `listJurisdictions` | CP-1.3, CP-4.1 | `sendInvoice` | CP-2.5, CP-3.5 |
| `updateJurisdiction` | CP-4.2 | `exportInvoice` | CP-1.9, CP-2.5, CP-5.3 |
| `listNumberSeries` | CP-4.3, CP-5 settings | `getArtifact` | CP-1.9, CP-2.5, CP-5.3 |
| `createNumberSeries` | CP-4.3 | `listJobs` | CP-1.9, CP-5.3 |
| `createInvoice` | CP-1.5, CP-4.5 | `getUsage` | CP-5.4 |
| `getInvoice` | CP-1.6, CP-3.2, CP-5.2 | `listActivity` | CP-3.6, CP-5.5 |
| `listInvoices` | CP-2.1, CP-3.1, CP-5.1 | `updateInvoice` | CP-2.3 |
| `addLineItem` | CP-1.6, CP-2.3 | `updateLineItem` | CP-1.6, CP-2.3 |
| `removeLineItem` | CP-2.3 | | |

29 operations, 0 orphans (Critic-verified).
