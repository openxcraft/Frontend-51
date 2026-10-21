# Contract Lifecycle Manager
Separate frontend project · family: business_ops · tier: 3 · adapter: ContractLifecycleAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs contract-lifecycle-manager`).

## Spec traceability (source: ../specs-source/contract-lifecycle-manager/)
- Screens (9): Vault home · Contract detail · Intake wizard · Obligations & reminders console · Extraction review panel (mode of S3/S2) · Counterparties directory · Activity log · Jobs console · Settings
- Adapter operations (32): getSession, getWorkspace, updateWorkspace, listContracts, getContract, createContract, updateContract, uploadDocument, getDocumentArtifact, requestReview, recordReviewDecision, recordExecution, recordRenewalTerm, markTerminated, archiveContract, listCounterparties, createCounterparty, updateCounterparty, listObligations, getObligation, createObligation, updateObligation, completeObligation, runExtraction, listSuggestions, resolveSuggestion, listReminders, listActivity, exportRegister, getExportArtifact, listJobs, getUsage
- Identity: Ahd Slate, pairing P01 (IBM Plex Sans Arabic + IBM Plex Sans), radius B, layered-depth, motion: stately
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
