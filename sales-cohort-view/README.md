# Sales Cohort View
Separate frontend project · family: analytics · tier: 3 · adapter: SalesCohortAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs sales-cohort-view`).

## Spec traceability (source: ../specs-source/sales-cohort-view/)
- Screens (10): Grid workspace · Cohort detail · Customer drill · Season calendar · Comparison · Views library · Definitions & formulas · Sources · Activity & jobs · Command palette (overlay)
- Adapter operations (25): getSession, updateWorkspace, getSource, refreshSource, importOrdersSample, listSeasonKinds, listSeasonWindows, getSeasonWindow, createSeasonWindow, updateSeasonWindow, computeGrid, getGrid, getCohortDetail, listCustomers, compareCohorts, getComparison, saveView, listViews, updateView, deleteView, exportEvidence, getArtifact, listJobs, getActivity, getRuleset
- Identity: Ujra Marine, pairing P17 (Noto Sans Arabic + Manrope), radius B, flat-line, motion: crisp
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
