# Price Rule Engine
Separate frontend project · family: commerce_integrations · tier: 2 · adapter: PriceRuleEngineAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs price-rule-engine`).

## Spec traceability (source: ../specs-source/price-rule-engine/)
- Screens (10): Rules console home · Rule editor · Catalog · Item detail · Simulation composer · Simulation workspace · Proposals + proposal review · Exports & jobs · Settings · Activity log
- Adapter operations (32): getSession, getWorkspace, updateWorkspace, importCatalog, importCostSheet, listCatalogItems, getCatalogItem, updateCatalogItem, saveCostRecord, listCostRecords, listCategories, saveCategory, createRule, listRules, getRule, updateRule, deleteRule, runSimulation, getSimulation, listSimulationRows, createPriceProposal, listPriceProposals, getPriceProposal, updatePriceProposal, submitPriceProposal, approvePriceProposal, withdrawPriceProposal, exportPricePackage, getArtifact, listJobs, getUsage, listActivity
- Identity: Sarwa Cyan, pairing P02 (Noto Kufi Arabic + Space Grotesk), radius A, flat-line, motion: crisp
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
