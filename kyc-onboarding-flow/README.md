# Kyc Onboarding Flow
Separate frontend project · family: specialized · tier: 1 · FLAGSHIP · adapter: KycOnboardingAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs kyc-onboarding-flow`).

## Spec traceability (source: ../specs-source/kyc-onboarding-flow/)
- Screens (14): ENTRY · STEP FLOW · CAPTURE STEP · PRESENCE STEP · REVIEW & SUBMIT · STATUS · CONSOLE SIGN-IN · REVIEW QUEUE · EVIDENCE DOSSIER · DECISION COMPOSER · APPLICANTS · TEMPLATES STUDIO · PROGRAM · TEAM · LEDGER & JOBS · INBOX
- Adapter operations (36): getSession, startApplication, resumeApplication, extendSession, getApplication, saveStepDraft, submitStep, evaluateCaptureFrame, submitCapture, submitApplication, cancelApplication, listReviewTasks, getReviewTask, assignReviewTask, decideReviewTask, requestVerificationAssessment, listApplications, listApplicants, getApplicant, sendResumeLink, getFlowProgram, updateFlowProgram, listMessageTemplates, upsertMessageTemplate, previewMessage, listUsers, inviteUser, updateUser, listNotifications, markNotificationsSeen, listActivity, exportAuditLedger, subscribeApplicationEvents, getJob, retryJob, cancelJob
- Identity: Madar Navy, pairing P07 (Readex Pro + DM Sans), radius B, layered-depth, motion: stately
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
