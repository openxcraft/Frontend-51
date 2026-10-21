# 04 — Information Architecture: invoice-generator-desk

## Navigation model

Left rail: **Invoices** (home) · **Clients** · **Setup** · **Jobs** · **Activity**. The invoice composer is the product's core mode — a two-pane workbench: the editing pane (client, scheme, dates, line-item grid, totals rail) and the live document preview pane (the bilingual paper as it will print). ⌘K palette (P05 — list surfaces exceed three) reaches invoices, clients, and jobs with bilingual normalized search (alef variants, taa marbuta, yaa forms — rtl-rules §4). Two-level IA: section → item; the composer and the issued-invoice view are item detail, distinguished by state (draft = editable panes; issued = read-only document with render/delivery/payment controls). Desktop-first; ≤767px: invoices list and issued-invoice read surface collapse to single column, the preview stacks above the editor in draft mode (the paper first — what you're building stays visible).

## Entity overview (07a for full shapes)

Workspace → SellerProfile (issuer identity, per-scheme registration numbers) → Clients → NumberSeries (sequential counters) → JurisdictionProfiles (tax schemes: rate, bilingual labels, required fields, currency) → Invoices (draft | issued | voided; content frozen at issue; totals pinned at issue) → LineItems → PaymentMarks (evidence) → DeliveryRecords (abstract channel or manual) → ExportArtifacts (PDF, expiry) · Jobs wrap export and delivery work · ActivityEntry logs consequential mutations.

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Invoices home | list with status/payment-state/overdue chips, filters + saved views (P08), first-run value checklist + sample draft (P22) | listInvoices, getSession, createInvoice (new draft) |
| S2 | Invoice composer (draft) | the workbench: client picker, scheme card, dates, line-item grid, totals rail + numeral toggle, live preview | getInvoice, updateInvoice, addLineItem, updateLineItem, removeLineItem, listClients, createClient, listJurisdictions, listNumberSeries, updateDocumentRender |
| S3 | Issued invoice view | read-only document, render controls (numerals, layout), delivery panel, payment marks, export, void | getInvoice, updateDocumentRender, sendInvoice, recordPayment, deletePaymentMark, exportInvoice, voidInvoice |
| S4 | Clients | bilingual client cards, tax numbers, currency; create/edit | listClients, createClient, updateClient |
| S5 | Setup — seller profile | issuer identity per scheme: bilingual legal name, addresses, registration numbers, payment-instruction text | getSellerProfile, updateSellerProfile |
| S6 | Setup — tax schemes & series | seeded GCC scheme table (editable, versioned, source-noted) + number series list/creation | listJurisdictions, updateJurisdiction, listNumberSeries, createNumberSeries |
| S7 | Jobs console | export and delivery jobs: state, cancel/retry, link-to-context, artifact expiry | listJobs, getArtifact |
| S8 | Activity log | filterable actor-action-target-timestamp audit surface (P17) | listActivity |
| S9 | Command palette (overlay) | bilingual normalized search across invoices/clients/jobs | client-side over S1/S4/S7 data |

## Per-screen state obligations

Four empties per P01: S1 first-run teaches the sample-first path; S1 filtered-empty offers filter reset; S2 first-run (empty draft) shows the paper scaffold with ghost labels — the document shape is the teaching device; S3 has no first-run empty (issued invoices are reachable only from issued documents) but carries stale-link and voided states; S4 first-run names the first-client milestone; S6 schemes are never empty (seeded table); S7/S8 declare their quiet states plainly. Skeletons mirror final geometry per direction (P02) — the composer's two-pane skeleton is direction-mirrored (preview pane sits inline-end in LTR chrome, inline-start in RTL chrome).

## IA decisions and rationale

- **The document preview is a permanent pane, not a modal**: the product's promise is the bilingual paper; the composer must never hide it. WYSIWYG-alignment between editing pane and preview is the workbench's core interaction (05 original direction).
- **Draft and issued share one IA object, split by state**: the invoice's lifecycle (compose → freeze) is the product's integrity story; separating them into different sections would break the duplicate→issue→deliver rhythm (CP-2) that is the daily loop.
- **Setup consolidates seller, schemes, and series**: these three are the workspace's "letterhead + tax + numbering" — one configuration surface, each with its own integrity rules (scheme versioning, series append-only counters). Clients live separately because clients are relationship data, growing weekly, not configuration.
- **Jobs console is shared (T3 posture)**: export and delivery job classes in one console with link-to-context per async-contract §7's Tier-3 consolidation allowance.
- **Activity log earns its own rail slot**: sequence integrity and evidence marks are audit surfaces (P17); the accountant-facing persona (02 Tariq) is served by the document, but the buyer's own audit trail is this screen, exportable.
- **No payments surface anywhere in IA**: payment marks live inside the issued invoice view as evidence — no separate "payments" section exists, keeping the no-collection boundary (LOOP-10) visible in the navigation itself.
