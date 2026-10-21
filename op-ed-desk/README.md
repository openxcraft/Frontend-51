# Op Ed Desk
Separate frontend project · family: content_tools · tier: 3 · adapter: OpEdDeskAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs op-ed-desk`).

## Spec traceability (source: ../specs-source/op-ed-desk/)
- Screens (9): Triage queue · Submission detail · Blind workspace · Round board · Decision composer · Contributor files · Activity & jobs · Desk policy · Contributor surface
- Adapter operations (20): getSession, submitDraft, getSubmissionStatus, listSubmissions, getSubmission, updateTriage, getAnonymizedView, flagAnonymizationLeak, openReviewRound, reassignReviewer, submitReview, recordDecision, sendDecision, runStyleLint, getLintReport, updateFinding, listContributors, getContributor, listJobs, getUsage
- Identity: Sahafa Newsprint, pairing P03 (Noto Naskh Arabic + Newsreader), radius A, flat-line, motion: minimal
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
