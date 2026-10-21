# Field Service Dispatch
Separate frontend project · family: business_ops · tier: 3 · adapter: FieldServiceDispatchAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs field-service-dispatch`).

## Spec traceability (source: ../specs-source/field-service-dispatch/)
- Screens (10): Dispatch board · Job card detail (drawer/page) · Intake (new job) · Confirmation queue · Jobs register · Customers · Technicians · Day sheet & jobs · Settings · Technician mobile — My day
- Adapter operations (34): getSession, getWorkspace, updateWorkspace, listJobCards, getJobCard, createJobCard, updateJobCard, scheduleJobCard, dispatchJobCard, recordUnconfirmedDispatch, checkInJobCard, startJobCard, pauseJobCard, resumeJobCard, completeJobCard, closeJobCard, cancelJobCard, markNoShow, requestConfirmation, recordTouchpointReply, listTouchpoints, listTechnicians, createTechnician, updateTechnician, listCustomers, createCustomer, updateCustomer, getCustomer, getDayPlan, exportDaySheet, exportJobHistory, getArtifact, listJobs, getUsage
- Identity: Mawqi Teal, pairing P15 (Mada + Instrument Sans), radius B, soft-lift, motion: crisp
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
