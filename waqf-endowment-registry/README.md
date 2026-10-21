# Waqf Endowment Registry
Separate frontend project · family: specialized · tier: 3 · adapter: WaqfRegistryAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs waqf-endowment-registry`).

## Spec traceability (source: ../specs-source/waqf-endowment-registry/)
- Screens (10): Endowments home · Endowment detail — Deed & policy · Endowment detail — Assets · Endowment detail — Beneficiaries · Endowment detail — Ledger · Distribution studio · Transparency reports · Jobs & exports console · Activity log · Settings
- Adapter operations (33): getSession, listEndowments, createEndowment, getEndowment, updateEndowment, setEndowmentStatus, addAsset, updateAsset, listAssets, addBeneficiary, updateBeneficiary, listBeneficiaries, saveDistributionPolicy, getDistributionPolicy, recordInflow, recordExpense, voidEntry, listLedgerEntries, importLedgerBatch, runAllocation, getAllocation, updateAllocationLine, recordDistribution, getDistribution, recordDelivery, generateReport, getReport, sealReport, exportReport, getArtifact, listJobs, listActivity, getUsage
- Identity: Waqf Garnet, pairing P10 (El Messiri + Lora), radius B, layered-depth, motion: stately
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
