# Translation Review Hub
Separate frontend project · family: content_tools · tier: 2 · adapter: TranslationReviewHubAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs translation-review-hub`).

## Spec traceability (source: ../specs-source/translation-review-hub/)
- Screens (9): Review-jobs home · Document overview · Review workspace · Findings console · Glossaries · Glossary editor · Sign-off & export · Jobs center · Settings
- Adapter operations (29): getSession, createReviewJob, listReviewJobs, getReviewJob, updateReviewJob, importDocument, importGlossary, listDocuments, getDocument, listSegmentPairs, getSegmentPair, updateSegmentTarget, setSegmentDecision, bulkSetSegmentDecisions, runQaScan, getQaReport, listQaFindings, resolveQaFinding, listGlossaries, createGlossary, getGlossary, listTermEntries, saveTermEntry, deleteTermEntry, signOffReviewJob, exportReviewPackage, getArtifact, listJobs, getUsage
- Identity: Jisr Teal, pairing P17 (Noto Sans Arabic + Manrope), radius B, flat-line, motion: crisp
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
