# Meeting Notes Action Desk
Separate frontend project · family: business_ops · tier: 3 · adapter: MeetingNotesAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs meeting-notes-action-desk`).

## Spec traceability (source: ../specs-source/meeting-notes-action-desk/)
- Screens (9): Desk home · Meeting detail — Capture · Meeting detail — Summary · Meeting detail — Decisions · Meeting detail — Actions · Loop desk · Actions register · Members & Settings · Command palette (overlay) + Jobs & activity console
- Adapter operations (26): getSession, listMembers, addMember, createMeeting, listMeetings, getMeeting, updateMeeting, importNotes, getNotes, transcribeAudio, runSummarization, createDecision, listDecisions, updateDecision, createAction, listActions, getAction, updateAction, updateActionStatus, requestConfirmation, respondToConfirmation, exportMinutes, getArtifact, listJobs, listActivity, getUsage
- Identity: Maqam Lilac, pairing P07 (Readex Pro + DM Sans), radius B, soft-lift, motion: minimal
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
