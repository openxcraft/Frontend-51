# Social Clip Cutter
Separate frontend project · family: content_tools · tier: 2 · adapter: SocialClipCutterAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs social-clip-cutter`).

## Spec traceability (source: ../specs-source/social-clip-cutter/)
- Screens (9): Episodes board · Clip workbench · Highlight review panel · Boundary editor mode · Burn-in studio mode · Export composer · Jobs center · Exports / artifacts library · Settings
- Adapter operations (32): getSession, getUsage, listEpisodeSources, createEpisodeSource, getEpisodeSource, updateEpisodeSource, deleteEpisodeSource, importTranscript, getTranscript, listSegments, updateSegment, searchSegments, findHighlights, createClip, listClips, getClip, updateClip, deleteClip, setClipBurnInSpec, listCaptionStyles, saveCaptionStyle, exportClips, listJobs, getJob, cancelJob, getArtifact, renewArtifact, listCredentials, saveCredential, verifyCredential, revokeCredential, listActivity
- Identity: Qutta Neon, pairing P11 (Changa + Archivo), radius C, layered-depth, motion: energetic
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
