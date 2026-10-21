# Zakat Calculation Suite
Separate frontend project · family: specialized · tier: 3 · adapter: ZakatCalculationAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs zakat-calculation-suite`).

## Spec traceability (source: ../specs-source/zakat-calculation-suite/)
- Screens (11): Cases home — the register · Case workspace — Items · Case workspace — Calculation · Case workspace — Review & lock · Compare view · Nisab & valuations · Methodology profiles admin · Jobs & exports console · Activity log · Settings · Case reference overlay (⌘K palette)
- Adapter operations (33): getSession, createCase, listCases, getCase, updateCase, addCaseItem, importItems, listCaseItems, updateCaseItem, voidCaseItem, runCalculation, getCalculation, listCalculations, createComparison, getComparison, listComparisons, listProfiles, getProfile, saveProfile, approveProfile, retireProfile, listNisabReferences, setNisabReference, pinNisabReferences, submitCaseForReview, reviewCase, lockCase, createSuccessorCase, exportCase, exportComparison, getArtifact, listJobs, getUsage
- Identity: Zakat Jade, pairing P09 (Reem Kufi + Fraunces), radius B, layered-depth, motion: stately
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
