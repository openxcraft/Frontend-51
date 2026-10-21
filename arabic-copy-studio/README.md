# Arabic Copy Studio
Separate frontend project · family: content_tools · tier: 1 · FLAGSHIP · adapter: ContentStudioAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs arabic-copy-studio`).

## Spec traceability (source: ../specs-source/arabic-copy-studio/)
- Screens (14): Workspace home · First-run setup · Document editor · AI panel · Parity Weave · Glossary manager · Brand kit · Register settings · Review mode · Revision history · Templates gallery · Usage & quota · Jobs center · Seats & workspace admin
- Adapter operations (27): getSession, listDocuments, getDocument, createDocument, updateBlocks, updateDocumentStatus, startGeneration, subscribeGeneration, stopGeneration, startRefinement, acceptSuggestion, transformContent, getJob, retryJob, cancelJob, inspectText, listGlossaryTerms, upsertGlossaryTerm, resolveGlossaryConflict, importGlossary, getBrandKit, updateBrandKit, addComment, approveDocument, exportDocument, getArtifact, getUsage
- Identity: Dahriz Ink, pairing P08 (Amiri + Source Serif 4), radius A, layered-depth, motion: stately
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
