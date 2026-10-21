# Seasonal Campaign Board
Separate frontend project · family: content_tools · tier: 3 · adapter: SeasonalCampaignBoardAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs seasonal-campaign-board`).

## Spec traceability (source: ../specs-source/seasonal-campaign-board/)
- Screens (9): Moment library · Moment detail · Campaign board · Campaign detail (checklist) · Closure & retro · Template editor · Jobs & activity · Team roster · Settings
- Adapter operations (30): getSession, listSeasons, listMoments, getMoment, getCalendarFrame, listCampaigns, getCampaign, createCampaign, updateCampaign, closeCampaign, updateClosureNote, listChecklistItems, updateChecklistItem, addChecklistItem, removeChecklistItem, bulkUpdateChecklistItems, getReadiness, listAssignees, createAssignee, updateAssignee, listChecklistTemplates, getChecklistTemplate, saveChecklistTemplate, exportReadinessReport, exportTaskHandoff, listJobs, getArtifact, renewArtifact, getUsage, listActivity
- Identity: Hilal Green, pairing P05 (Tajawal + Hanken Grotesk), radius D, soft-lift, motion: energetic
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
