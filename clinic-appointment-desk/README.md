# Clinic Appointment Desk
Separate frontend project · family: specialized · tier: 3 · adapter: ClinicAppointmentAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs clinic-appointment-desk`).

## Spec traceability (source: ../specs-source/clinic-appointment-desk/)
- Screens (11): Today board · Booking flow (overlay) · Appointment detail (drawer) · Waitlist console · Messages outbox · Patient view · Schedule · Policies · Day sheet export · Jobs console · Command palette (overlay)
- Adapter operations (34): getSession, createProvider, listProviders, updateProvider, createVisitType, listVisitTypes, updateVisitType, createPatient, listPatients, getPatient, updatePatient, createAppointment, listAppointments, getAppointment, updateAppointment, cancelAppointment, rescheduleAppointment, checkInAppointment, markNoShow, completeAppointment, addWaitlistEntry, listWaitlistEntries, removeWaitlistEntry, runWaitlistFill, getWaitlistFill, respondWaitlistOffer, sendMessage, listMessages, recordMessageReply, getClinicSettings, updateClinicSettings, exportDaySheet, getArtifact, listJobs
- Identity: Sihha Leaf, pairing P15 (Mada + Instrument Sans), radius C, soft-lift, motion: calm
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
