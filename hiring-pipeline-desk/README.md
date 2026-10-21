# Hiring Pipeline Desk
Separate frontend project · family: business_ops · tier: 2 · adapter: HiringPipelineAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs hiring-pipeline-desk`).

## Spec traceability (source: ../specs-source/hiring-pipeline-desk/)
- Screens (10): Openings home · Pipeline board · Application detail · Kit studio · Interview detail + scorecard · Debrief console · Candidates directory · Interviews list · Jobs center · Activity log + Settings
- Adapter operations (34): getSession, getUsage, createOpening, listOpenings, getOpening, updateOpening, createCandidate, updateCandidate, listCandidates, importCandidates, createApplication, listApplications, getApplication, moveApplication, updateApplication, getKit, saveKit, proposeKitQuestions, scheduleInterview, listInterviews, getInterview, updateInterview, getScorecard, saveScorecard, submitScorecard, listScorecards, getDebrief, recordDecision, listNudges, resolveNudge, exportOpeningPackage, getArtifact, listAsyncJobs, listActivity
- Identity: Tawthif Coral, pairing P13 (Baloo Bhaijaan 2 + Plus Jakarta Sans), radius D, soft-lift, motion: energetic
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
