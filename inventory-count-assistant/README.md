# Inventory Count Assistant
Separate frontend project · family: business_ops · tier: 3 · adapter: InventoryCountAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs inventory-count-assistant`).

## Spec traceability (source: ../specs-source/inventory-count-assistant/)
- Screens (11): Sessions home · Session setup · Guided count view · Reconciliation · Session detail (closed) · Catalog · Zones & stores · Count policies · Reports & activity · Settings · Command palette (overlay)
- Adapter operations (30): getSession, listStores, listLocations, saveLocation, listCatalogItems, getCatalogItem, createCatalogItem, updateCatalogItem, importCatalogItems, updateStockLevels, listPolicies, savePolicy, proposeCycleSlice, createCountSession, listCountSessions, getCountSession, openCountSession, cancelCountSession, closeCountSession, submitCountEntry, updateCountEntry, listCountEntries, requestRecount, resolveVariance, listVariances, exportCountReport, getArtifact, listJobs, listActivity, getUsage
- Identity: Jarda Moss, pairing P11 (Changa + Archivo), radius B, flat-line, motion: crisp
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
