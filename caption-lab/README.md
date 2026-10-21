# Caption Lab
Separate frontend project · family: content_tools · tier: 2 · adapter: CaptionLabAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs caption-lab`).

## Spec traceability (source: ../specs-source/caption-lab/)
- Screens (9): Projects home · Import wizard · Caption grid · Cue inspector · Style studio · Export queue · Jobs center · Presets library · Settings
- Adapter operations (18): getSession, listProjects, createProject, getProject, listCues, updateCue, nudgeTiming, splitCue, suggestBreaks, bulkApply, listPresets, savePreset, importPreset, requestPreview, exportProject, getArtifact, renewArtifact, getUsage
- Identity: Sinema Cyan, pairing P02 (Noto Kufi Arabic + Space Grotesk), radius A, ink-press, motion: crisp
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
