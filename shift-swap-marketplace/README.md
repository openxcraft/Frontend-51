# Shift Swap Marketplace
Separate frontend project · family: business_ops · tier: 1 · FLAGSHIP · adapter: ShiftSwapAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs shift-swap-marketplace`).

## Spec traceability (source: ../specs-source/shift-swap-marketplace/)
- Screens (17): MY SHIFTS · THE BOARD · OFFER DETAIL (Fairness Reveal) · POST-A-SWAP wizard · MY SWAPS (status ladder) · RANKED LADDER (offerer view) · INBOX · WORKER PROFILE & QUALIFICATIONS · POLICY SHEET · SIGN-IN · CONSOLE QUEUE · MATCH DRAWER · TEAM SCHEDULE · RULES CENTER · FAIRNESS POLICY (edit + simulate) · PEOPLE & QUALIFICATIONS · LEDGER & JOBS
- Adapter operations (37): getSession, listShifts, getShift, listSwapOffers, getSwapOffer, createSwapOffer, cancelSwapOffer, createSwapRequest, cancelSwapRequest, listMySwapRequests, listRequestsForOffer, checkSwapEligibility, computeFairnessRanking, getFairnessPolicy, updateFairnessPolicy, acceptSwapRequest, denySwapRequest, listMatches, recordSupervisorDecision, listBlackoutRules, upsertBlackoutRule, archiveBlackoutRule, listQualifications, upsertQualification, assignQualification, listWorkers, updateWorker, inviteWorker, listNotifications, markNotificationsSeen, subscribeSwapEvents, listActivity, importScheduleSource, exportFairnessLedger, getJob, retryJob, cancelJob
- Identity: Nahas Copper, pairing P04 (Cairo + Sora), radius C, soft-lift, motion: energetic
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
