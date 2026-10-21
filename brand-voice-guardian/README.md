# Brand Voice Guardian
Separate frontend project · family: content_tools · tier: 3 · adapter: GuardianAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs brand-voice-guardian`).

## Spec traceability (source: ../specs-source/brand-voice-guardian/)
- Screens (8): Check surface · Findings review · Profiles list · Profile editor · History · Record view · Jobs center · Settings/members
- Adapter operations (17): getSession, listProfiles, getProfile, createProfile, updateProfile, importTerms, calibrate, runCheck, getRun, listFindings, resolveFinding, bulkResolve, listRecords, getRecord, exportReport, getArtifact, getUsage
- Identity: Hakam Plum, pairing P01 (IBM Plex Sans Arabic + IBM Plex Sans), radius B, flat-line, motion: minimal
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
