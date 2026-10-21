# Legal Case Tracker
Separate frontend project · family: specialized · tier: 2 · adapter: LegalCaseTrackerAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs legal-case-tracker`).

## Spec traceability (source: ../specs-source/legal-case-tracker/)
- Screens (11): Docket home · Matter chronicle · Event detail · Documents & custody register · Document detail · Clients directory · Deadline rules console · Closure & export · Jobs console · Activity log · Settings
- Adapter operations (32): getSession, listMatters, createMatter, getMatter, updateMatter, closeMatter, listClients, createClient, getClient, updateClient, listTimelineEvents, createTimelineEvent, getTimelineEvent, updateTimelineEvent, recordHearingOutcome, completeDeadlineEvent, listHearingBoard, listDeadlineRules, saveDeadlineRule, deleteDeadlineRule, registerDocument, addDocumentVersion, listDocuments, getDocument, addCustodyEntry, sealDocumentVersion, verifyChain, listActivity, exportMatterPackage, getArtifact, listJobs, getUsage
- Identity: Qada Indigo, pairing P16 (Scheherazade New + Libre Caslon Text), radius B, layered-depth, motion: stately
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
