# 04 — Information Architecture: clinic-appointment-desk

## Navigation model

Inline-start rail: **اليوم / Today** (home — the day board) · **قائمة الانتظار / Waitlist** · **الرسائل / Messages** · **المرضى / Patients** · **الجدول / Schedule** (providers & visit types) · **السياسات / Policies** · **المهام / Jobs**. The day board is the product's core mode and the landing surface; everything else is a supporting surface reached when the day's work demands it. ⌘K palette (P05 — list surfaces exceed three) reaches patients, appointments (by time or patient name), waitlist entries, providers, and jobs with bilingual normalized search (rtl-rules §4). Two-level IA: section → item; appointment detail is a drawer over the day board, not a route — the day context is never lost while working a patient's appointment (the drill-down context-preservation instinct from the portfolio's ui-reasoning adoption, 05). Desktop-first; ≤767px: day board collapses to a single-provider column list with state actions, patient lookup and messages remain full-act surfaces, schedule/policies authoring moves to desktop only.

## Entity overview (07a for full shapes)

Clinic → Providers (session hours, working-days mask) · VisitTypes (duration, labels) · Patients (bilingual identity, locale, derived no-show stats) · Appointments (lifecycle: booked → confirmed → checked-in → in-consult → completed | no-showed | cancelled; rescheduled-from provenance) · WaitlistEntries → WaitlistFills (immutable ranked proposals per open slot) → WaitlistOffers (expiry, outcome) · OutboundMessages (ladder steps, waitlist offers, confirmation requests; reply states) · Jobs (message batches, fill runs, exports) → ExportArtifacts. ActivityEntry wraps every consequential mutation (P17).

## Screen inventory (10 + overlay)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Today board | the operating day: provider columns × time ruler, appointment blocks, day summary bar, filters, booking entry | listAppointments, listProviders, getAppointment, checkInAppointment, completeAppointment, markNoShow, updateAppointment |
| S2 | Booking flow (overlay) | patient find-or-create → visit type → slot picker → confirm; no-show flag surface; waitlist alternative | listPatients, createPatient, getPatient, listVisitTypes, listProviders, listAppointments, createAppointment, addWaitlistEntry |
| S3 | Appointment detail (drawer) | lifecycle timeline, reminder ladder, waitlist-fill provenance, staff note | getAppointment, updateAppointment, cancelAppointment, rescheduleAppointment, getWaitlistFill |
| S4 | Waitlist console | entries with tier/window/age; fill proposals with ranked candidates and inputs; offer states | listWaitlistEntries, removeWaitlistEntry, runWaitlistFill, getWaitlistFill, respondWaitlistOffer, sendMessage |
| S5 | Messages outbox | outbound records with states and locale marks; batch send; record-reply; call-script path | listMessages, sendMessage, recordMessageReply |
| S6 | Patient view | contact, locale, history, no-show stats + pattern flag, waitlist entries | getPatient, updatePatient, listAppointments, listWaitlistEntries |
| S7 | Schedule | providers (bilingual names, session hours, working-days mask), visit types (duration, labels) | createProvider, listProviders, updateProvider, createVisitType, listVisitTypes, updateVisitType |
| S8 | Policies | the inspectable deterministic rules: reminder ladder + templates, no-show policy, waitlist weights; workspace locale | getClinicSettings, updateClinicSettings, getSession |
| S9 | Day sheet export | printable board + per-provider lists + counts; artifact history | exportDaySheet, getArtifact, listJobs |
| S10 | Jobs console | message batches, fill runs, exports — cancel/retry, link-to-context | listJobs |
| S11 | Command palette (overlay) | bilingual search across patients/appointments/waitlist/providers/jobs | client-side over S1/S4/S5/S6/S7 data |

## Per-screen state obligations

Four empties per P01 (11 enumerates copy): S1 first-run loads the seeded sample day (P22); S1 filtered-empty declares the filter; S4 waitlist first-run teaches the cancellation→fill loop with the sample fixture; S5 outbox empty names the ladder policy link; S6 patient history empty distinguishes new-patient from no-access. Skeletons mirror final geometry per direction — the day board's skeleton is column-shaped (P02). Errors per the 03 mapping; every string verbatim bilingual in 11.

## Workspace & permission structure

Roles (auth-agnostic Session, 07b): **owner** (clinic manager — everything incl. policies and schedule), **frontdesk** (receptionist — booking, day running, waitlist, messages, patient records; policies read-only), **provider** (own day review + consult-state transitions only; patient contact masked beyond their own day; no booking mutations). The provider role is deliberately thin (00): the console is the staff's tool; providers see their column, their day sheet, and mark in-consult/completed. All roles share one clinic workspace — no multi-clinic tenancy at v1 (12 Q-16 records the chain question honestly). PHI posture per a11y-baseline §7: no health data in page titles or URLs (appointment URLs carry opaque ids only); the reason-for-visit note renders only in S3 and never in exports, toasts, or announcements; patient phone masks on blur in S6 (shoulder-surfing consideration, declared default).

## IA decisions and rationale

- **The day board is home, not a calendar app**: the buyer's mental model is "today's sheet" (02 Reem's paper ledger) — one dated surface with columns per provider, not a month calendar with a day drill-down. Ramadan/Hijri rendering rides the date bar (P24 dual-calendar), not a calendar-mode switch.
- **Appointment detail is a drawer over the board**: every appointment decision (check-in, no-show, cancel→fill) happens with the day context visible; navigating away would recreate the context loss of the paper ledger. Drawer focus-trap and return per a11y-baseline §3.
- **Waitlist is a first-class section, not a booking-tab feature**: the auto-fill loop is the product's signature (00) and has its own lifecycle (entries, fills, offers) — burying it in the booking flow would make the ranked-candidate disclosure (the defensibility promise) invisible.
- **Messages is the outbox, not a chat**: one directional surface of outbound records with reply states — no conversation threads, no inbox (a chat surface would recreate the WhatsApp chaos this product structures; LOOP-10 spirit).
- **Policies is a reading surface, not just a form**: every deterministic rule (ladder cadence, flag threshold, ranking weights) renders with its value and a bilingual plain-language explanation — the inspectability that makes Maha trust the machine (02) and the pattern the portfolio calls the rules-engine kinship (12 Q-4c, judged honestly).
- **Jobs consolidated (T3 posture)**: per async-contract §7, Tier 3 may consolidate the job center — S10 is one console for batch sends, fill runs, and exports with link-to-context, rather than per-class IA.
- **Schedule vs Policies split**: schedule changes (who works when, what visit types exist) are operational daily edits; policies (the rules the machine applies) are governed edits Maha owns — different change cadence, different permission, different confirmation copy.
