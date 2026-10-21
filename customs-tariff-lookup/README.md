# Customs Tariff Lookup
Separate frontend project · family: specialized · tier: 3 · adapter: CustomsTariffAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs customs-tariff-lookup`).

## Spec traceability (source: ../specs-source/customs-tariff-lookup/)
- Screens (10): Nomenclature home · Hierarchy navigator · Tariff-line reading pane · Search results · Ruling-notes library · Lists home + list detail · Editions surface · Activity console · Settings · Command palette (overlay)
- Adapter operations (28): getSession, updateWorkspaceSettings, listSchedules, getSchedule, searchNomenclature, suggestCandidates, listNomenclatureChildren, getNomenclatureNode, compareDutyRates, listRulingNotes, getRulingNote, createBookmarkList, listBookmarkLists, getBookmarkList, deleteBookmarkList, addSavedCode, listSavedCodes, updateSavedCode, removeSavedCode, linkNoteToSavedCode, unlinkNoteFromSavedCode, listVersionDiffs, checkCodeChanges, exportEvidencePack, getArtifact, listJobs, listActivity, getUsage
- Identity: Jumruk Bronze, pairing P14 (Rubik + Space Mono), radius A, flat-line, motion: minimal
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
