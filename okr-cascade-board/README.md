# Okr Cascade Board
Separate frontend project · family: business_ops · tier: 3 · adapter: OkrCascadeAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs okr-cascade-board`).

## Spec traceability (source: ../specs-source/okr-cascade-board/)
- Screens (10): Cycles home · Cascade board (cycle workspace) · Objective detail · Check-in desk (participant) · Cadence dashboard · Grading console · Artifacts & jobs console · Activity log · Settings · Command palette (overlay)
- Adapter operations (34): getSession, createCycle, listCycles, getCycle, updateCycle, setCycleState, createObjective, listObjectives, getObjective, updateObjective, archiveObjective, createKeyResult, listKeyResults, updateKeyResult, removeKeyResult, saveCheckInDraft, submitCheckIn, getCheckIn, updateCheckIn, listCheckIns, requestDraft, getDraftProposal, resolveDraftProposal, computeCycleGrades, getGradeSheet, exportCycle, getArtifact, listTeams, listMembers, getCadence, updateCadence, listJobs, listActivity, getUsage
- Identity: Waraq Lime, pairing P15 (Mada + Instrument Sans), radius D, soft-lift, motion: energetic
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
