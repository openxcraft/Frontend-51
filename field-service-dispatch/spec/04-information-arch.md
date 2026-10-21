# 04 — Information Architecture: field-service-dispatch

## Navigation model

Left rail (desktop): **Board** (home — the operating day) · **Jobs** (register: all job cards, all states, filters/saved views) · **Confirmations** (the queue) · **Customers** · **Technicians** · **Day sheet & jobs** (exports + job center) · **Settings**. The job-card detail is a mode of the board and of the Jobs register (drawer-first on desktop, full-page on mobile) — the card never leaves its day context: opening a card keeps the board visible behind and the day header persistent. ⌘K command palette (P05 — list surfaces exceed three) reaches job cards (by code, customer, or title), customers, technicians, and exports with bilingual normalized search (rtl-rules §4). Two-level IA: section → item.

**Technician shell (≤767px, Arabic-first by default, one-thumb)**: a deliberately different face over the same adapter — **My day** (job-card stack ordered by window; the active card pinned with its current state and its next action button), plus a lightweight profile (duty toggle). Nothing else: no board, no queue, no register — the dispatcher's surfaces are not the technician's (02 Waleed). The shells are routes of one product, one adapter (07b), one session model with a technician role.

## Entity overview (07a for full shapes)

Workspace → Technician (skills, duty) → JobCard (window, lane = assigned technician, lifecycle state + append-only events) → ConfirmationTouchpoint (booking / day-of / arrival-notice / completion, states incl. superseded/expired) → Customer (bilingual, address, locale preference). Jobs (async) wrap confirmation sends and exports; ExportArtifacts carry day sheets and job histories. ActivityEntry logs every consequential mutation (P17).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Dispatch board | the operating day: technician lanes + unassigned lane, drag/keyboard scheduling, day header with tally + dual-calendar chip (P24) | getDayPlan, scheduleJobCard, listJobCards, listTechnicians, getSession |
| S2 | Job card detail (drawer/page) | lifecycle timeline, touchpoints with states/expiry, notes, customer block, asset reference, dispute-ready export action | getJobCard, requestConfirmation, recordTouchpointReply, recordUnconfirmedDispatch, dispatchJobCard, closeJobCard, exportJobHistory |
| S3 | Intake (new job) | customer lookup/create + job fields + schedule action | listCustomers, createCustomer, createJobCard, updateJobCard, scheduleJobCard |
| S4 | Confirmation queue | touchpoint rows by state, expiry sort, phone-outcome recording, unconfirmed-dispatch decision | listTouchpoints, recordTouchpointReply, requestConfirmation, recordUnconfirmedDispatch, getDayPlan |
| S5 | Jobs register | all job cards; filters + saved views (P08); virtualized | listJobCards, getJobCard |
| S6 | Customers | searchable register + drawer with history and dispute export | listCustomers, getCustomer, updateCustomer, createCustomer, exportJobHistory |
| S7 | Technicians | roster, skills, duty, per-day load | listTechnicians, createTechnician, updateTechnician |
| S8 | Day sheet & jobs | export actions, job list with cancel/retry, artifact links + expiry | exportDaySheet, exportJobHistory, getArtifact, listJobs, getUsage |
| S9 | Settings | locale default, confirmation policy, day-of cadence, minimum window, lane order | getWorkspace, updateWorkspace, getSession |
| S10 | Technician mobile — My day | job-card stack, state actions, offline queue state (P20) | getJobCard, checkInJobCard, startJobCard, pauseJobCard, resumeJobCard, completeJobCard, markNoShow |

Mobile (≤767px) for the dispatcher shell: S1/S4/S5 in read-and-act form (card lists, no lane geometry — the board is a desktop authoring surface; the honest mobile dispatcher surface is the queue and the register, per the attendance-shift-planner precedent of review-vs-authoring split). The technician shell S10 is mobile-native.

## Per-screen state obligations

Four empties per P01 on every list surface: first-run (S1 offers the sample day fixture; S4 first-run teaches the phone-path sweep; S5/S6/S7 first-run state the one-object-to-create action), no-data-after-activity (cancelled/terminal jobs excluded from the active-day view — the board says what removed them), no-access (PERMISSION surface, never "empty"), filtered-empty (filter reset offered). Skeletons mirror final geometry per direction (P02). Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **The board is home, not a report**: the product's buyer opens one surface every morning (02 Salem/Nora) — the day plan with lanes is the app's spine; the register (S5) exists for history and filters, not as the default posture.
- **Confirmations earn a top-level section**: the confirmation queue is Nora's daily sweep and the product's unique feature made visible (00) — burying it inside job cards would hide the one surface the gates depend on. Its tally is the day header's honest metric.
- **Job-card detail is a drawer on the board**: a card's story (timeline + touchpoints) must be readable without losing the day — full-page only on mobile where the screen is the drawer.
- **Technician shell is separate and minimal**: the one-thumb state-button surface (03 CP-2) is the adoption-critical face; exposing board chrome to technicians would import the dispatcher's complexity into Waleed's stairwell (02).
- **Day sheet & jobs share a section**: T3 consolidation per async-contract §7 — the export surfaces and the job center are one low-frequency section, not separate IA.
- **Settings is small and honest**: the confirmation policy lives where the queue shows it (S4 header link) AND in settings — policy disclosure at point-of-use (ai-native-patterns §7.4 discipline applied to non-AI policy too).
