# Invoice Generator Desk
Separate frontend project · family: commerce_integrations · tier: 3 · adapter: InvoiceGeneratorAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs invoice-generator-desk`).

## Spec traceability (source: ../specs-source/invoice-generator-desk/)
- Screens (9): Invoices home · Invoice composer (draft) · Issued invoice view · Clients · Setup — seller profile · Setup — tax schemes & series · Jobs console · Activity log · Command palette (overlay)
- Adapter operations (29): getSession, getSellerProfile, updateSellerProfile, listClients, createClient, updateClient, listJurisdictions, updateJurisdiction, listNumberSeries, createNumberSeries, createInvoice, getInvoice, listInvoices, updateInvoice, addLineItem, updateLineItem, removeLineItem, issueInvoice, voidInvoice, duplicateInvoice, updateDocumentRender, recordPayment, deletePaymentMark, sendInvoice, exportInvoice, getArtifact, listJobs, getUsage, listActivity
- Identity: Hisab Slate-Blue, pairing P06 (Almarai + Inter), radius B, flat-line, motion: minimal
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
