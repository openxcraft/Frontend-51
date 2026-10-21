# Seo Brief Builder
Separate frontend project · family: content_tools · tier: 3 · adapter: SeoBriefBuilderAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs seo-brief-builder`).

## Spec traceability (source: ../specs-source/seo-brief-builder/)
- Screens (9): Topics home · Topic workspace — Keywords · Topic workspace — Clusters · Topic workspace — Parity · Topic workspace — Brief · Briefs library · Jobs console · Settings · Command palette (overlay)
- Adapter operations (24): getSession, createTopic, listTopics, getTopic, ingestKeywords, fetchKeywordSignals, listKeywords, updateKeyword, runClustering, listClusters, getCluster, updateCluster, runParityCheck, getParityCheck, acceptParityGap, assembleBrief, getBrief, listBriefs, updateBriefSection, setBriefStatus, exportBrief, getArtifact, listJobs, getUsage
- Identity: Marsad Violet, pairing P15 (Mada + Instrument Sans), radius B, flat-line, motion: crisp
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
