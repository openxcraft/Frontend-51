# Shipping Rate Comparator
Separate frontend project · family: commerce_integrations · tier: 3 · adapter: ShippingRateAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs shipping-rate-comparator`).

## Spec traceability (source: ../specs-source/shipping-rate-comparator/)
- Screens (10): Cards home · Card editor · Paste-import surface · Comparison workbench · Comparison detail · Comparison history · Profiles library · Jobs console · Settings · Command palette (overlay)
- Adapter operations (25): getSession, createRateCard, listRateCards, getRateCard, updateRateCard, setRateCardStatus, duplicateRateCard, importRateCard, resolveZone, computeChargeableWeight, createShipmentProfile, listShipmentProfiles, getShipmentProfile, updateShipmentProfile, deleteShipmentProfile, runComparison, getComparison, listComparisons, setComparisonPin, runBatchComparison, exportComparison, getArtifact, listJobs, getUsage, listActivity
- Identity: Tariq Amber, pairing P16 (Scheherazade New + Libre Caslon Text), radius B, soft-lift, motion: minimal
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
