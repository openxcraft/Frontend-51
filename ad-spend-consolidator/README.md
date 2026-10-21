# Ad Spend Consolidator
Separate frontend project · family: analytics · tier: 2 · adapter: AdSpendConsolidatorAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs ad-spend-consolidator`).

## Spec traceability (source: ../specs-source/ad-spend-consolidator/)
- Screens (11): Spend dashboard (home) · Reconciliation console · Raw line items · Snapshots & revisions · Overlay library · Overlay comparison · Budgets & pacing · Channel connections · Normalization & FX · Exports & jobs · Settings
- Adapter operations (28): getSession, listChannelKinds, listChannelConnections, createChannelConnection, updateChannelConnection, verifyChannelConnection, importSpendLines, listSpendLines, updateNormalizationPolicy, getFxRateTable, runConsolidation, listSnapshots, getSnapshot, getRevisionDelta, getSpendBreakdown, getSpendTimeline, listOverlapFindings, resolveOverlap, listHolidayMoments, saveHolidayMoment, getOverlayComparison, listBudgetLines, saveBudgetLine, getPacing, exportReportPack, getArtifact, listJobs, getUsage
- Identity: Sarf Blue, pairing P04 (Cairo + Sora), radius B, soft-lift, motion: crisp
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
