# Khatt Type Playground
Separate frontend project · family: content_tools · tier: 3 · adapter: KhattPlaygroundAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs khatt-type-playground`).

## Spec traceability (source: ../specs-source/khatt-type-playground/)
- Screens (8): Catalog · Font detail + glyph grid · Session bench (canvas) · Kashida & alternates lab · Specimen composer · Specimens library + share view · Exports (jobs) · Settings
- Adapter operations (24): getSession, listFontProfiles, getFontProfile, getFontFile, listGlyphs, getGlyph, listPairingNotes, uploadFontFile, createPairingSession, listPairingSessions, getPairingSession, updatePairingSession, setKashidaSettings, setAlternateSelection, createSpecimen, listSpecimens, getSpecimen, updateSpecimen, exportSpecimen, getArtifact, renewArtifact, listJobs, cancelJob, getUsage
- Identity: Qalam Graphite, pairing P09 (Reem Kufi + Fraunces), radius A, flat-line, motion: minimal
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
