# 03 — UX Flows: clinic-appointment-desk

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation — no orphans, no phantoms. Error classes per the 07b union: VALIDATION · NOT_FOUND · PERMISSION · CONFLICT · RATE_LIMIT · NETWORK · UNKNOWN.

## CP-1 — Book an appointment for a calling patient (value proof)

**Trigger**: the phone rings (or a WhatsApp message / walk-in); the patient asks for an appointment.

1. Reem opens the console; the day board is the home surface with the day summary bar (booked / confirmed / checked-in / completed / no-showed / cancelled counts, dual Hijri/Gregorian date per P24). `getSession`
2. She starts the booking flow and searches the patient by phone or name — normalized bilingual search (alef variants, taa marbuta, yaa forms, tashkeel stripped — rtl-rules §4); phone is the exact-match key ("2 patients share this number" when a parent and child do). `listPatients`
3. New patient: she creates the record — bilingual name (Arabic and/or Latin script, each rendering at its own direction in bidi-isolated fields), phone, preferred message locale (ar/en). `createPatient`
4. Existing patient: she opens the patient view — contact, locale, appointment history, no-show stats and the pattern flag if active ("3 في آخر 180 يوماً" — count + window, icon+text+color). The flag never blocks booking (00); it surfaces the policy link. `getPatient`
5. She picks the visit type and the provider; the slot picker renders free slots for the provider's session hours. `listVisitTypes` · `listProviders` · `listAppointments`
6. She picks a slot and confirms; the adapter validates the overlap rule (same provider, no overlapping [start, start+duration)) and books; the reminder ladder schedules itself from clinic policy; the day board renders the new block in place. `createAppointment`
7. No acceptable slot: she offers the waitlist — visit type, provider (or any), preferred window, priority tier (routine; urgent is staff-set only, never auto). `addWaitlistEntry`

**Edges**: patient with an active pattern flag → the booking confirmation shows the flag chip with count and window and the policy link; booking proceeds unchanged (00: care access beats punitive gates). Mixed-script name search (Latin "David" inside Arabic-keyed desk, Arabic name in English-keyed desk) — bidi isolation everywhere, never force-flipped. A slot that fits the visit type's duration only partially → not offered (the picker filters by duration). Same patient already booked that day → a notice naming the existing appointment; staff confirms to proceed (families legitimately book two children back-to-back). Booked-inside-the-ladder-window → the first reminder sends immediately (ladder rule, 07c).
**Failures**: overlap attempt (two receptions racing the same slot) → CONFLICT with both payloads named; malformed patient (missing phone) → VALIDATION naming the field, and the error never echoes the visit-reason or any clinical text (a11y-baseline §7 — validation errors do not echo answers); provider not found (stale link) → NOT_FOUND; viewer-role session → PERMISSION naming the seat.
**Recovery**: a failed booking leaves nothing half-written (idempotency key on submit); the patient record persists independent of the failed appointment; the slot picker re-renders from authoritative state after any error.

## CP-2 — Run the day (the operating surface)

**Trigger**: the clinic day itself; Reem lives on the day board from 07:30 to close.

1. Day board renders: provider columns × time ruler, appointment blocks with state marks, confirmation chips, and the pattern-flag glyph where active; day summary bar on top; >200 blocks virtualize per column (P19). `listAppointments`
2. A patient arrives; Reem checks them in — block state flips booked/confirmed → checked-in, polite announcement, summary bar count updates in the same frame. `checkInAppointment`
3. The provider walks the patient in; he or Reem marks in-consult → completed from the block or the detail drawer. `completeAppointment`
4. 11:00 passes with an empty chair; Reem declares the no-show — an explicit action with a confirm that names the consequence ("the patient's pattern count becomes 4 and the slot opens for refill"). Block state flips no-showed; patient stats recompute deterministically; if the slot's remaining time is still usable, the fill panel offers the refill path (CP-3). `markNoShow`
5. She opens an appointment's detail drawer: lifecycle timeline (every transition, actor, timestamp), reminder ladder state, optional staff note — the note field is free text for desk facts only, never clinical content (LOOP-10). `getAppointment`
6. She edits a staff note or corrects the visit type; baseVersion guards concurrent edits (the evening desk's session included). `updateAppointment`

**Edges**: walk-in with no record → CP-1 inline from the board (patient find-or-create never leaves the day surface); patient arrives late after a no-show was declared → the desk can undo within policy (no-show → checked-in transition allowed same-day, recorded as a correction event in the timeline); the day summary is derived live from the board data — no separate fetch, no drift; PHI discipline: the board shows names/times/visit types only — the optional reason-for-visit text renders only in the detail drawer and never in toasts, announcements, or the day sheet export.
**Failures**: stale block edit (evening desk concurrent) → CONFLICT with both versions; state transition that violates the lifecycle order (e.g. completing a cancelled appointment) → VALIDATION naming the required previous state; mid-list fetch loss → NETWORK banner + retry, board keeps rendered state (P20 posture).
**Recovery**: every state change appends to the appointment's immutable timeline — corrections are new events, never rewrites; the board re-fetches cursor-paginated per provider column and reconciles.

## CP-3 — Cancellation → waitlist auto-fill → offer accepted (the signature flow)

**Trigger**: a patient cancels (call, message reply, or walk-in), or CP-2 declares a no-show with usable remaining time.

1. Reem records the cancellation with a reason class (patient-cancelled | clinic-cancelled) — the appointment lands in cancelled state, the timeline records who and when. `cancelAppointment`
2. The slot opens; the fill panel proposes running the waitlist fill. She runs it — a deterministic computation over active waitlist entries (budget-bound synchronous, 10-performance). `runWaitlistFill`
3. The fill proposal renders: ranked candidates, each row showing every ranking input — priority tier, days waited, no-show penalty (with the patient's trailing count), and the total score; ties broken by earlier request. The ranking formula is disclosed in-product (policy panel, 06 PolicyRulesPanel). `getWaitlistFill`
4. She sends the offer to the top candidate — through the abstract patient-messaging channel when bound, or by copying the prepared bilingual call script and recording the outcome; the offer carries an honest expiry (15 minutes for same-day slots, 2 hours otherwise — policy defaults). `sendMessage`
5. The patient accepts (channel reply captured, or Reem records the phone acceptance); the appointment books into the slot from the waitlist entry, the entry closes, the block settles into the slot (the signature micro-interaction, 05), and the day summary updates. `respondWaitlistOffer`
6. Decline or expiry → the next candidate is offered, at most three candidates per slot per fill run (never a broadcast); exhausted offers close the fill run honestly with "no takers — slot remains open". `getWaitlistFill` · `respondWaitlistOffer`
7. Meanwhile a second patient on the phone says "call me if anything opens" → she adds the entry from the same surface. `addWaitlistEntry` · `listWaitlistEntries`

**Edges**: flagged patient ranked low → the row shows the penalty input verbatim; the staff can still offer out-of-order with an explicit override reason (recorded — the ranking guides, the human decides); candidate already booked elsewhere → filtered from eligibility; entry's preferred window misses the slot date → filtered with the filter named on the row (why-not-offered disclosure); same-day no-show refill uses the slot's remaining time minus a 15-minute floor (a 10-minute remainder is not offerable).
**Failures**: fill on a slot that re-filled meanwhile → CONFLICT naming the slot; entry removed by the evening desk mid-proposal → NOT_FOUND on the entry, the proposal re-renders minus the row; channel send with the capability unbound → the copy-script path IS the success path, not an error (LOOP-5); channel quota → RATE_LIMIT ladder notice with the script path stated in the same surface.
**Recovery**: fill proposals are immutable snapshots keyed to slot + waitlist state; a declined offer is recorded data (declinedAt) — the entry is never penalized for declining this slot and remains eligible for other slots; the waitlist never silently drops an entry.

## CP-4 — Reminder ladder and confirmation capture (the daily sweep)

**Trigger**: the evening sweep (Yasmin) and the automatic ladder cadence (T-48h and same-day defaults, clinic-configurable).

1. The messages outbox lists every outbound record — reminders, confirmation requests, waitlist offers — with state (scheduled, sent, replied-confirmed, replied-declined, replied-change, expired, failed) and the patient's locale mark. `listMessages`
2. Yasmin sends the next-day reminder batch (or a single manual reminder for the appointment she just re-confirmed verbally): each message renders in the patient's locale from the clinic's templates. `sendMessage`
3. A reply lands (channel capture when bound) or Yasmin records the phone outcome from the call script; the appointment's confirmation state updates and the ladder marks the step. `recordMessageReply`
4. The reply is "I can't make it" → she records declined; the cancellation path runs (CP-3) with the reply as provenance. `cancelAppointment`
5. The reply is "can I move it to Thursday?" → the reschedule flow carries the appointment's provenance (origin, actor, reason class: patient-requested) and re-books into a new slot atomically; the old slot opens for refill. `rescheduleAppointment`
6. The appointment detail shows the ladder: each step's state and the reply, so the morning desk knows which patients confirmed. `getAppointment`

**Edges**: message with no reply by expiry → honest expired state (never silently re-sent); a patient who replies in the opposite locale of their file → the reply renders bidi-isolated, the record keeps the file locale (staff corrects the file if warranted, `updatePatient`); reminder content carries the clinic's own cancellation-policy line (evidence: stating costs/consequences reduces no-shows — 01 source 7) — the text is authored by the clinic, never generated; the ladder never auto-cancels an unconfirmed appointment (staff decides; automation refuses the destructive step).
**Failures**: channel send failure → failed state with retry scoped to that message + the script path in the same surface; recording a reply on a message already replied → CONFLICT keeping both timestamps; stale appointment link → NOT_FOUND.
**Recovery**: ladder state is derived from the outbound records — re-sends are new records, history is append-only; offline capture queues per-item (P20) and reconciles to authoritative outbox state.

## CP-5 — Schedule, policies, exports, and jobs (administration)

**Trigger**: Maha's setup week and the monthly rhythm; the morning huddle needs the day sheet.

1. Maha configures providers: bilingual display names, session hours per working day, working-days mask (KSA Fri–Sat weekend vs UAE Sat–Sun is a clinic-level setting — 12 Q-9). `createProvider` · `listProviders` · `updateProvider`
2. Visit types: code, bilingual label, duration minutes, session-fit rules. `createVisitType` · `listVisitTypes` · `updateVisitType`
3. Policies — the inspectable rules surface: reminder ladder (steps, cadence, template text per locale, cancellation-policy line), no-show policy (window days, flag threshold, booking behavior: require-confirmation notice only), waitlist policy (offer expiry minutes same-day/future, max offers per slot, ranking weights and the no-show penalty cap). Every rule renders with its current value and a plain-Arabic + English explanation — the same inspectability grammar as the portfolio's labor-rule guardrails. `getClinicSettings` · `updateClinicSettings`
4. Patient-record corrections (name spelling, locale, phone) with the history intact. `listPatients` · `updatePatient`
5. Day sheet export: the printable board + per-provider lists + the day's counts — a Job with artifact expiry and regeneration. `exportDaySheet` · `getArtifact` · `listJobs`
6. Jobs/activity console: message batches, fill runs, exports with state, cancel/retry, link-to-context (T3 consolidation per async-contract §7). `listJobs`
7. Session settings: workspace locale (ar/en — the whole console flips, 05 direction model). `getSession`

**Edges**: editing a policy mid-day applies to future computations only (the day's already-sent reminders stay sent — honest, never retroactive); visit-type duration change → existing appointments keep their booked duration, new bookings use the new value (disclosed in the edit confirm); deleting a visit type with future appointments → refused with the count named (soft-archive instead); exports include PHI minimum-facts only (names, times, visit types — never the reason-for-visit note, 08 privacy boundary).
**Failures**: provider-session overlap with itself (double-entered hours) → VALIDATION naming the intersecting windows; export failure mid-bundle → partial policy with per-format retry (async-contract §4); artifact expired → NOT_FOUND with regenerate path; settings write by provider-role session → PERMISSION naming the seat.
**Recovery**: policy changes are versioned in the activity log with actor and timestamp (P17); exports regenerate from day state; every list is cursor-paginated and re-fetchable.

## Non-happy paths

- **No messaging channel bound (LOOP-5, the v1 default)**: every outbound surface renders the copy-script path as primary — reminders, waitlist offers, confirmation requests all complete by phone with recorded outcomes; the 00 success signals pass in exactly this state (07c `channelBound: false` is the audited default).
- **First-run**: the seeded sample day (07c) loads with a planted cancellation, a waitlist, and a ready fill proposal so the refill moment is experienceable before real patients exist (P22 value checklist; sample-day retention policy in 12).
- **Filtered-empty / no-access**: day board filters (provider, state), waitlist filters, messages filters — each declares itself when empty and offers filter reset; no-access surfaces say so, never "empty" (P01; copy matrix 11 A).
- **Offline (P20)**: reads render from last-known state with a persistent banner; writes queue with per-item state; on return, queued writes reconcile to authoritative state and conflicts surface both versions.
- **Reduced-motion**: the slot-refill settle renders as a ≤2-step opacity change with the same announcements (05 motion contract; 09).

## Failure → error mapping

VALIDATION (lifecycle-order violations, malformed patient/visit-type/provider inputs, self-overlapping session hours, fill on an un-offerable remainder) · NOT_FOUND (stale appointment/patient/entry/artifact links) · PERMISSION (viewer/provider-role attempts on staff mutations, workspace scoping) · CONFLICT (concurrent appointment edits, slot double-fill, already-replied messages) · RATE_LIMIT (channel sends when the bound channel meters; export bursts) · NETWORK (board/list fetches, outbox polling, artifact delivery) · UNKNOWN (typed retry with correlationId, cad-corr-0001-class references in 11).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, CP-5.7 | `checkInAppointment` | CP-2.2 |
| `createProvider` | CP-5.1 | `markNoShow` | CP-2.4 |
| `listProviders` | CP-1.5, CP-5.1 | `completeAppointment` | CP-2.3 |
| `updateProvider` | CP-5.1 | `addWaitlistEntry` | CP-1.7, CP-3.7 |
| `createVisitType` | CP-5.2 | `listWaitlistEntries` | CP-3.7, S4 console |
| `listVisitTypes` | CP-1.5, CP-5.2 | `removeWaitlistEntry` | CP-3 (entry closed/withdrawn) |
| `updateVisitType` | CP-5.2 | `runWaitlistFill` | CP-3.2 |
| `createPatient` | CP-1.3 | `getWaitlistFill` | CP-3.3, CP-3.6 |
| `listPatients` | CP-1.2, CP-5.4 | `respondWaitlistOffer` | CP-3.5, CP-3.6 |
| `getPatient` | CP-1.4, CP-2 (patient link) | `sendMessage` | CP-3.4, CP-4.2 |
| `updatePatient` | CP-4.3 (locale fix), CP-5.4 | `listMessages` | CP-4.1 |
| `createAppointment` | CP-1.6 | `recordMessageReply` | CP-4.3 |
| `listAppointments` | CP-1.5 (picker), CP-2.1 (board) | `exportDaySheet` | CP-5.5 |
| `getAppointment` | CP-2.5, CP-4.6 | `getArtifact` | CP-5.5 |
| `updateAppointment` | CP-2.6 | `listJobs` | CP-5.6 |
| `cancelAppointment` | CP-3.1, CP-4.4 | `getClinicSettings` | CP-5.3 |
| `rescheduleAppointment` | CP-4.5 | `updateClinicSettings` | CP-5.3 |

34 operations, 0 orphans, 0 phantoms (Critic-verified against 07b).
