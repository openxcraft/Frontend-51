# Attendance Shift Planner
Separate frontend project · family: business_ops · tier: 2 · adapter: ShiftPlannerAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs attendance-shift-planner`).

## Spec traceability (source: ../specs-source/attendance-shift-planner/)
- Screens (9): Teams home · Team & roster · Planner (week grid) · Ruleset library · Publication & export · Swap log · Jobs center · Settings · Worker review view
- Adapter operations (35): getSession, listTeams, getTeam, createTeam, updateTeam, listWorkers, createWorker, updateWorker, importRoster, listQualifications, saveQualification, deprecateQualification, listJurisdictionRulesets, getJurisdictionRuleset, saveCustomRuleset, validateRuleset, listWeekPlans, createWeekPlan, getWeekPlan, upsertShift, removeShift, placeAssignment, updateAssignment, removeAssignment, runGuardrailCheck, listRuleViolations, waiveRuleViolation, publishWeekPlan, getPublicationRecord, exportSchedule, getArtifact, recordExternalSwap, importSwapSet, listJobs, getUsage
- Identity: Wijdan Indigo, pairing P05 (Tajawal + Hanken Grotesk), radius B, soft-lift, motion: crisp
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
