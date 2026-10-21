# Interactive Story Builder
Separate frontend project · family: content_tools · tier: 3 · adapter: StoryBuilderAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs interactive-story-builder`).

## Spec traceability (source: ../specs-source/interactive-story-builder/)
- Screens (10): Story library · Template gallery · Outline editor · Step editor · Sync panel · Preview · QA report · Review surface · Jobs & exports · Settings
- Adapter operations (32): getSession, listStories, createStory, getStory, updateStoryDetails, duplicateStory, deleteStory, setStoryStatus, listTemplates, listChapters, createChapter, updateChapter, reorderChapters, deleteChapter, listSteps, createStep, updateStep, reorderSteps, deleteStep, getSyncState, suggestStructure, validateStory, addReviewNote, listReviewNotes, resolveReviewNote, exportStory, getExportArtifact, renewExportArtifact, listJobs, cancelJob, listActivity, getUsage
- Identity: Hikaya Crimson, pairing P03 (Noto Naskh Arabic + Newsreader), radius B, layered-depth, motion: calm
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
