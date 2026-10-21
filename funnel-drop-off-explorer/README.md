# Funnel Drop Off Explorer
Separate frontend project · family: analytics · tier: 1 · FLAGSHIP · adapter: FunnelDropOffAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs funnel-drop-off-explorer`).

## Spec traceability (source: ../specs-source/funnel-drop-off-explorer/)
- Screens (11): SIGN-IN · CANVAS HOME · EXPLORATION CANVAS · SEGMENT WORKSHOP · COHORTS & USERS · TAXONOMY MANAGER · SOURCES & SAMPLES · ANALYSES FEED · ACTIVITY & JOBS · INBOX · ONBOARDING CHECKLIST
- Adapter operations (35): getSession, listFunnels, getFunnel, saveFunnel, computeFunnelMetrics, getFunnelTrend, breakdownFunnelStep, getStepTransitionDetail, annealSegment, compareSegments, saveCohort, listCohorts, listCohortUsers, saveAnalysis, listAnalyses, getAnalysis, narrateDropOff, exportAnalysis, listTaxonomyEvents, getTaxonomyEvent, upsertTaxonomyEvent, setTaxonomyEventStatus, getTaxonomyLintReport, listEventSources, importEventSample, listActivity, listNotifications, markNotificationsSeen, subscribeWorkspaceEvents, getJob, retryJob, cancelJob, listUsers, inviteUser, updateUser
- Identity: Kashf Abyss, pairing P14 (Rubik + Space Mono), radius A, ink-press, motion: crisp
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
