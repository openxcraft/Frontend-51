# Procurement Approval Chain
Separate frontend project · family: business_ops · tier: 3 · adapter: ProcurementApprovalAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs procurement-approval-chain`).

## Spec traceability (source: ../specs-source/procurement-approval-chain/)
- Screens (11): Requests home (register) · Request composer (draft) · Request detail / approval workspace · Budgets console · Approval matrix studio · Org & delegation · Vendors & cost centers · Activity log · Jobs & artifacts · Settings · Command palette (overlay)
- Adapter operations (35): getSession, createDraftRequest, updateRequest, addQuote, updateQuote, removeQuote, selectQuote, previewRouting, submitRequest, listRequests, getRequest, decideStep, resubmitRequest, withdrawRequest, cancelApprovedRequest, listActivity, exportRequestPackage, exportAuditRegister, listJobs, getArtifact, getApprovalMatrix, saveApprovalRule, removeApprovalRule, getPolicyPack, savePolicyPack, listBudgetEnvelopes, saveBudgetEnvelope, listPositions, savePosition, setDelegation, clearDelegation, listCostCenters, saveCostCenter, listVendors, saveVendor
- Identity: Tafwid Honey, pairing P16 (Scheherazade New + Libre Caslon Text), radius B, layered-depth, motion: stately
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
