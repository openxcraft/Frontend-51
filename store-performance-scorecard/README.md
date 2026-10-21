# Store Performance Scorecard
Separate frontend project · family: analytics · tier: 3 · adapter: StoreScorecardAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs store-performance-scorecard`).

## Spec traceability (source: ../specs-source/store-performance-scorecard/)
- Screens (10): Chain overview · Scorecard workspace (ranked board) · Store detail · Shift lens · Stores directory · Data & imports · Definitions & policy · Jobs & activity · Settings · Command palette (overlay)
- Adapter operations (31): getSession, getWorkspace, updateWorkspacePreferences, createStore, listStores, getStore, updateStore, upsertOperatingPattern, listOperatingPatterns, getOperatingPattern, importShiftRecords, fetchChannelSales, listShiftRecords, getCoverageSummary, getCompPolicy, updateCompPolicy, listSeasonWindows, upsertSeasonWindow, listPeerGroups, upsertPeerGroup, addAnnotation, listAnnotations, runScorecard, getScorecard, listScorecards, getStoreBreakdown, getKpiDefinitions, listFlags, exportScorecardPack, getArtifact, listJobs
- Identity: Tajir Citron, pairing P18 (Lalezar + Bebas Neue), radius B, soft-lift, motion: energetic
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
