# 03 — UX Flows: field-service-dispatch

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation exactly once — no orphans, no phantoms (script-verified at audit).

## CP-1 — Intake to scheduled job card (value proof: a call becomes a board object)

1. Salem answers a call and opens intake: customer lookup as he types (bilingual normalized search — alef/hamza, taa marbuta, yaa forms per rtl-rules §4). New customer: bilingual name, phone, district/address, preferred locale. `listCustomers` · `createCustomer`
2. Job card fields: title (bilingual), category (AC/plumbing/electrical/appliance/cleaning/handyman), priority (routine/urgent/emergency), problem note, optional asset reference (plain text tag — LOOP-3 boundary with asset-register-tracker), optional address override. Draft job card lands in the board's unassigned lane. `createJobCard` · `updateJobCard`
3. He schedules it: picks a window (date + start/end) and drags the card into a technician's lane (keyboard equivalent: ⌘⇧S opens the schedule dialog on the focused card; lane assignment via menu — 2.5.7). The adapter validates technician-window overlap (simple interval arithmetic; travel time explicitly NOT modeled — 10/Q-13) and returns the conflict by name when hit. `scheduleJobCard` · `getDayPlan` · `listTechnicians`
4. Booking confirmation request is created on schedule (auto-request per workspace policy, or the action he takes now): a pending touchpoint appears on the job card with its expiry. `requestConfirmation`
5. First read of the value: the board shows the card in the technician's lane with the gate chip "awaiting confirmation", window, and priority; the day header shows the confirmation tally. `listJobCards` · `getDayPlan`

**Edges**: existing customer with a dispute history (customer drawer link — history surfaces before he commits the intake); mixed-script title (bidi isolation on input, own-direction rendering); window shorter than the workspace minimum (validation naming the minimum); technician off-duty that day (lane renders but assignment is refused with the duty fact); same-day emergency (priority emergency, window today — same flow, priority chip only).
**Failures**: overlap with the technician's existing job → VALIDATION naming both job codes and both windows; malformed intake (missing title or customer) → VALIDATION with field-linked messages; stale job-card edit → CONFLICT with both payloads.
**Recovery**: the draft persists across validation failures; scheduling is re-attemptable; overlap resolution is either a different window, a different technician, or an explicit shorter window if the minimum allows.

## CP-2 — The dispatch run (the signature flow: gate → journey → completion → close)

1. Morning: Nora reads the board; JOB-1002 sits in Abdullah's lane at 09:00–12:00, and overnight the customer's reply landed via the bound channel — the chip reads "confirmed" (the Gate Clears micro-interaction, 05). `listTouchpoints` · `listJobCards` · `recordTouchpointReply` (channel-inbound; manual phone path in CP-3)
2. She dispatches: the card moves to en-route; the arrival-notice touchpoint is requested automatically (policy), carrying the window and a copyable link. `dispatchJobCard` · `requestConfirmation`
3. Waleed (technician, mobile): my-day stack shows the en-route card first — customer, address, window, problem note, asset reference. One tap: check in (arrival recorded). `getJobCard` · `checkInJobCard`
4. Start work; pause with a reason chip (awaiting customer / awaiting permission / other + note) when the villa's caretaker is unreachable; resume. `startJobCard` · `pauseJobCard` · `resumeJobCard`
5. Complete: one tap plus optional completion note ("replaced capacitor, advise replacement of outdoor unit within 6 months"); job moves to work-done, the completion sign-off touchpoint is requested. `completeJobCard` · `requestConfirmation`
6. The customer confirms completion (reply recorded, or Nora attests on the phone); the job closes. Terminal. `recordTouchpointReply` · `closeJobCard`
7. The card settles into the closed row of the lane with its lifecycle timeline readable in full. `getJobCard`

**Edges**: customer replies "decline" to the booking confirmation → the gate shows declined with the reply time; the dispatcher reschedules (CP-4) or calls (CP-3); technician offline in a basement → check-in/start/pause/complete queue locally with per-item state and reconcile on signal return (P20), the board shows last-known state honestly ("last update 12:40, queued") never a guessed live state; double-tap on a state button → idempotent by state (already on-site is a no-op success with a calm notice, not an error); pause exceeding the window end → flagged on the board as over-window, visible, non-blocking (honesty over policing).
**Failures**: dispatch attempted while unconfirmed and unwaived → VALIDATION naming the gate and the two honest paths (record phone confirmation / record unconfirmed dispatch — CP-3); close attempted without a completion sign-off → VALIDATION naming the sign-off requirement and the staff-attest path; technician acting on a job not assigned to them → PERMISSION; mid-journey network loss → queued writes (P20) + reconciliation per async-contract §5.
**Recovery**: every transition is append-only; a wrong transition is corrected with a subsequent recorded event (e.g., paused→resumed), never by editing history; the timeline is the truth both directions.

## CP-3 — The confirmation queue (Nora's evening and morning sweep)

1. Evening: the queue lists tomorrow's touchpoints by state — pending, confirmed, declined, expired, superseded — each row naming job, customer, window, and channel. `listTouchpoints`
2. Nora works the pending rows top-down: for each, one click records a phone outcome (confirmed / declined / customer unreachable) with actor and timestamp — her phone ritual becomes data. `recordTouchpointReply`
3. Day-of reminders are requested for still-pending jobs (policy cadence, or her bulk action). `requestConfirmation`
4. A row is expired (customer never replied; expiry per the fixed formula): the queue offers the two honest paths — record a fresh attempt, or record unconfirmed dispatch with a reason. She chooses per job; the reason is mandatory and lands on the job card forever. `recordUnconfirmedDispatch`
5. The confirmation tally on the day header updates as she works: "confirmed 8 of 12 · declined 1 · expired 2 · unanswered 1" — counts as text, always. `getDayPlan`

**Edges**: customer replies "decline" to a day-of reminder after confirming the booking (both records stand — the timeline shows both, latest governs the gate); reply arrives after expiry but before dispatch (a late confirm is recorded and clears the gate — the gate reads current touchpoint state, expiry does not delete data); reply arrives after dispatch (recorded on the timeline; does not rewind state); the channel is unbound — the queue is identical, the send action renders as "copy confirmation link" and everything else is the phone path (LOOP-5 tested posture).
**Failures**: confirmation send quota → RATE_LIMIT ladder notice with reset time; send failure via the channel → typed error + the copy-link manual path in the same surface; recording an outcome for a touchpoint already terminal → CONFLICT naming the existing outcome (double-processing guard).
**Recovery**: touchpoint outcomes are immutable once recorded; corrections are new records (the adapter refuses silent overwrites); queue state is always re-derivable from touchpoint records.

## CP-4 — Disruption day (non-happy paths as first-class operations)

1. **No-show**: Waleed arrives; customer absent after on-site wait. He records no-show with an optional note; the job moves to its terminal no-show state and frees the technician's lane slot for the rest of the window. `markNoShow`
2. **Reschedule**: the customer calls mid-morning — Thursday is impossible. Nora reschedules: new window (same or different technician); the old confirmation is superseded, a new booking confirmation is requested, and the reschedule count is visible on the card. `scheduleJobCard` · `requestConfirmation`
3. **Cancel**: a contract client cancels the whole visit. Nora cancels with a reason; cancellation from en-route records the after-dispatch fact (the technician is mid-trip — the board names it, the touchpoint history keeps the arrival notice). `cancelJobCard`
4. **The unconfirmed job that must move anyway** (emergency re-prioritization): the gate still stands — the honest bypass with reason is the path, recorded on the card. `recordUnconfirmedDispatch` · `dispatchJobCard`
5. The dispatcher re-reads the day after the disruption: lane order recomputed, tally honest, timelines intact. `getDayPlan` · `getJobCard`

**Edges**: reschedule after customer-confirmed (confirmation superseded — visible, never deleted); reschedule chain limit (3rd reschedule renders an advisory chip — visible, non-blocking); no-show on a job dispatched unconfirmed (the card carries both facts — the audit tells the whole story); cancel of a draft (no touchpoints exist — clean terminal).
**Failures**: cancel of a closed job → VALIDATION (terminal states are terminal); no-show recorded from a state before en-route → VALIDATION naming the legal states (no-show is an arrival outcome); concurrent reschedule by two dispatchers → CONFLICT with both payloads.
**Recovery**: terminal states never reopen; a cancelled or no-show job needing work again is a NEW job card (linking to the old by note) — the register never rewrites its past.

## CP-5 — Board, records, and administration (the daily surface)

1. Session and workspace: locale default, confirmation policy (auto-request on/off, day-of reminder cadence), minimum window, lane order. `getSession` · `getWorkspace` · `updateWorkspace`
2. Technicians: roster with skills, duty state, per-day load; create/update (bilingual names, skills, duty). `listTechnicians` · `createTechnician` · `updateTechnician`
3. Customers: searchable register; customer drawer with full job history and dispute-ready export. `listCustomers` · `getCustomer` · `updateCustomer`
4. Jobs register: all job cards across states and dates with filters and saved views (P08); virtualized beyond 200 rows (P19). `listJobCards` · `getJobCard`
5. Exports: the day sheet (per-technician printable day, bilingual) and a job history (full timeline + touchpoint audit) — Jobs with expiry and regeneration per async-contract; artifacts fetched by link. `exportDaySheet` · `exportJobHistory` · `getArtifact` · `listJobs`
6. Usage: confirmation sends and exports against the window (P14 — sends surface before sending when a channel is bound; the phone path never meters). `getUsage`

**Edges**: filtered-empty declares itself (P01); no-access → PERMISSION surface, never "empty"; >200 rows virtualize with focus preservation; artifact expired → NOT_FOUND with renewal.
**Failures**: NETWORK mid-list → banner + retry (P20); stale workspace-settings edit → CONFLICT; quota read failure → usage surface degrades to "last known".
**Recovery**: all list surfaces cursor-paginated and re-fetchable; exports regenerate from current state.

## Failure → error mapping

VALIDATION (illegal lifecycle transitions, dispatch gate, close gate, window minimum, malformed intake) · NOT_FOUND (stale job card / customer / technician / touchpoint / artifact links) · PERMISSION (technician-role scoping, workspace boundaries) · CONFLICT (concurrent job-card edits, double-recorded touchpoint outcomes, stale settings) · RATE_LIMIT (confirmation sends via bound channel, exports) · NETWORK (list fetches, queue writes, export delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation, exactly once)

| Op | Flows |
|---|---|
| `getSession` | CP-5.1, entry (role/locale) |
| `getWorkspace` | CP-5.1 (policy read) |
| `updateWorkspace` | CP-5.1 (policy/minimum/lanes) |
| `listJobCards` | CP-1.5, CP-2.1, CP-4.5, CP-5.4 |
| `getJobCard` | CP-2.3/7, CP-4.5, CP-5.4 |
| `createJobCard` | CP-1.2 |
| `updateJobCard` | CP-1.2 (fields/notes) |
| `scheduleJobCard` | CP-1.3, CP-4.2 (reschedule path) |
| `dispatchJobCard` | CP-2.2, CP-4.4 |
| `recordUnconfirmedDispatch` | CP-3.4, CP-4.4 |
| `checkInJobCard` | CP-2.3 |
| `startJobCard` | CP-2.4 |
| `pauseJobCard` | CP-2.4 |
| `resumeJobCard` | CP-2.4 |
| `completeJobCard` | CP-2.5 |
| `closeJobCard` | CP-2.6 |
| `cancelJobCard` | CP-4.3 |
| `markNoShow` | CP-4.1 |
| `requestConfirmation` | CP-1.4, CP-2.2/5, CP-3.3, CP-4.2 |
| `recordTouchpointReply` | CP-2.1/6, CP-3.2 |
| `listTouchpoints` | CP-2.1, CP-3.1 |
| `listTechnicians` | CP-1.3, CP-5.2 |
| `createTechnician` | CP-5.2 |
| `updateTechnician` | CP-5.2 (skills/duty) |
| `listCustomers` | CP-1.1, CP-5.3 |
| `createCustomer` | CP-1.1 |
| `updateCustomer` | CP-5.3 |
| `getCustomer` | CP-5.3 (drawer + history) |
| `getDayPlan` | CP-1.3/5, CP-3.5, CP-4.5 |
| `exportDaySheet` | CP-5.5 |
| `exportJobHistory` | CP-5.5 |
| `getArtifact` | CP-5.5 |
| `listJobs` | CP-5.5 |
| `getUsage` | CP-5.6 |

34 operations, 0 orphans, 0 phantoms (Critic-verified by scripts/check_coverage.py).
