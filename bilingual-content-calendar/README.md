# Bilingual Content Calendar
Separate frontend project · family: content_tools · tier: 2 · adapter: PlannerAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs bilingual-content-calendar`).

## Spec traceability (source: ../specs-source/bilingual-content-calendar/)
- Screens (10): Workspace home · Calendar grid · Slot detail · Moments library · Season mode console · Review mode · Export · Channels & workspace settings · Jobs center · Mobile review
- Adapter operations (19): getSession, listHorizons, createHorizon, updateSeasonConfig, listSlots, getSlot, createSlot, updateSlot, moveSlot, setVariant, listMomentLibrary, placeMoment, applyPattern, getReviewSummary, addComment, approveHorizon, exportHorizon, getArtifact, listJobs
- Identity: Taba Spring, pairing P13 (Baloo Bhaijaan 2 + Plus Jakarta Sans), radius D, soft-lift, motion: crisp
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
