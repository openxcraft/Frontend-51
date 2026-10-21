# 04 — Information Architecture: kyc-onboarding-flow

SME-C pass · Two shells, one IA. The applicant flow (mobile-first, ≥360px, touch, RTL-first) and the review console (desktop-first, ≥1024px, keyboard-first) are projections of the same entity graph (07a) and the same adapter (07b) — no separate information model exists. Every screen's data needs map to adapter operations; no screen renders data the contract cannot supply.

## Entity overview (navigation-relevant; full contract in 07a)

Applicant · Application · FlowProgram (versioned; StepSpec children) · StepState · CaptureRecord (+ QualityReport) · ReviewTask · ReviewDecision (+ ReasonCode catalogs) · MessageTemplate · NotificationEvent · ActivityEntry · Job · User. Movement spine: **Application (draft, autosaved) → StepStates (submitted, folded) → CaptureRecords (gate-checked evidence) → submitted → ReviewTask (deadline-ranked) → ReviewDecision (approve | reject | request-rework → needs-attention loop | escalate) → outcome + immutable ledger chain**. The ledger (ActivityEntry + the evidence chain) is a first-class IA citizen on the console — the dispute destination (02 Sami), not a settings afterthought; on the applicant shell, the Progress Spine is the movement spine's own navigation object.

## Navigation model

### Applicant shell (mobile-first ≥360px, touch; RTL-first)

A linear, one-question-per-screen flow with two persistent objects: the **Progress Spine** (the step sequence as a fold-marked rail — 13 §B1) and the **session ribbon** (idle-timeout countdown + extend — a11y-baseline §7). Screens: ENTRY (two doors + resume contract) → STEP FLOW (A2, the working surface for identity micro-steps) → CAPTURE STEP (A3, the dark-navy coached surface) → REVIEW & SUBMIT (A4) → STATUS (A5, live state incl. needs-attention). Backward navigation to completed-but-unsubmitted steps is free (amendment, timeline-noted); the spine is the map; no applicant-facing menu exists beyond the spine and a "save & exit" action — high-stakes flows do not offer exploration as a feature. The locale pick lives on ENTRY and persists with the application.

### Review console (desktop-first ≥1024px, keyboard-first)

Rail: **QUEUE** (default for reviewer + admin) · **APPLICANTS** · **TEMPLATES** · **PROGRAM** (admin-authoring) · **TEAM** (admin) · **LEDGER & JOBS** · **INBOX**. Task detail is a **drawer over QUEUE** (never a route — deadline and aging are decision information; CP-5). The Evidence Dossier, decision composer, and preview sheets are stack-pushed over the drawer (two levels max: rail surface → drawer → sheet). ⌘K palette (P05) reaches tasks (applicant name / application ref with Arabic normalization), applicants, templates, program sheets, and actions ("export ledger", "escalate task") with bilingual normalized search (rtl-rules §4).

## Screen inventory (14 screens; viewport per screen)

| # | Screen | Shell / viewport | Purpose | Key data needs (→ 07b) |
|---|---|---|---|---|
| S1 | ENTRY | Applicant ≥360 | two doors (start/resume), locale pick, resume contract, data-use statement | startApplication, resumeApplication |
| S2 | STEP FLOW | Applicant ≥360 | one-question-per-screen identity micro-steps; autosave indicator; recall chips; spine | saveStepDraft, submitStep, getApplication, getFlowProgram (context) |
| S3 | CAPTURE STEP | Applicant ≥360 (dark-navy viewport) | coached document capture: frame guide, live gate checklist, retake loop, upload alternative | evaluateCaptureFrame, submitCapture, getFlowProgram (type catalog) |
| S4 | PRESENCE STEP | Applicant ≥360 | policy-optional selfie-class capture with purpose + alternative stated | submitCapture (presence class), getFlowProgram |
| S5 | REVIEW & SUBMIT | Applicant ≥360 | full summary as readable evidence + attestation with preserved focus order | getApplication, submitApplication |
| S6 | STATUS | Applicant ≥360 | live application state; needs-attention rework instructions; outcome + dispute path | resumeApplication, getApplication, subscribeApplicationEvents |
| S7 | CONSOLE SIGN-IN | Console ≥1024 | session entry, locale pick, role routing | getSession |
| S8 | REVIEW QUEUE | Console ≥1024 (reviewer default) | deadline-ranked work order: SLA ribbons, rework badges, warning counts, counters | listReviewTasks, assignReviewTask, subscribeApplicationEvents |
| S9 | EVIDENCE DOSSIER | Console (drawer over S8) | four-layer evidence assembly + mismatch flags | getReviewTask, getApplication, requestVerificationAssessment |
| S10 | DECISION COMPOSER | Console (sheet over S9) | reason-coded decisions; rework step targeting; consequence naming | decideReviewTask, listReviewTasks (queue context) |
| S11 | APPLICANTS | Console | directory with history trails; nudge actions; retention/withdrawal admin | listApplicants, getApplicant, sendResumeLink, cancelApplication |
| S12 | TEMPLATES STUDIO | Console (admin) | bilingual applicant-facing notices; versioning; applicant-view preview | listMessageTemplates, upsertMessageTemplate, previewMessage |
| S13 | PROGRAM | Console (admin) | flow program: steps, thresholds, session policy, type catalog, reason codes, retention, capability posture | getFlowProgram, updateFlowProgram, requestVerificationAssessment (posture) |
| S14 | TEAM · LEDGER & JOBS · INBOX | Console (admin/reviewer per section) | people management; the dispute chain view; exports; jobs; notification ladder | listUsers, inviteUser, updateUser, listActivity, exportAuditLedger, getJob, retryJob, cancelJob, listNotifications, markNotificationsSeen |

Responsive behavior: the applicant shell IS the mobile surface (the applicant is phone-only by persona — 02); it renders centered ≥768px for desktop applicants with identical IA. The console never renders below 1024px: reviewers are desk-based evidence workers (02 Maryam); authoring surfaces (program, templates, team) are console-only; the queue + dossier + decision path is the reviewer's entire desktop discipline. There is deliberately NO on-call mobile console: the reviewer's evening is the applicant's evening — the product's mobile energy belongs to the applicant shell, not to a degraded console (a recorded IA decision, rejected alternative: a reviewer mobile view would imply decisions-on-phone against the evidence-density the discipline requires; escalations reach reviewers through the notification ladder, not through a mobile decision surface).

## Workspace & permission structure

Two structural console roles (07b Session): **reviewer** (queue, dossier, decisions, applicants read, ledger read, inbox) and **admin** (everything: program authoring, templates, team, capability posture, retention, exports). Applicants are NOT console roles — they are entity subjects addressed through the resume-token model (auth-agnostic, 07b). Role changes are ledger entries; suspension locks mutations with read-paths intact. No per-user ACL surface at v1 (02 Khalid's re-training objection answered with two roles the org chart already understands).

## Per-screen state obligations

Each screen declares its four empties (P01), loading shape (P02 skeletons mirroring final geometry, RTL-flipped), and error classes (03 mapping) in the 11 matrix. Applicant-shell empties are persona-critical: first-run (no application — teach the resume contract), no-data-after-activity (an application existed; submitted/resolved — show status), no-access (resume token expired/not-yours — never "empty"), filtered-empty (console queue filters only — reset + name what exists). Console empties distinguish "nothing submitted yet today" (teach the funnel's arrival) from "everything decided" (show outcomes + counters).

## IA decisions and rationale

- **The queue is the console's home and it is deadline-ranked, not feed-ordered**: SLA class + time-remaining is the work order — the reviewer's next action is always the top row (rejects consumer-inbox patterns; same IA decision lineage as cod-order-confirmation's time-to-next-attempt queue).
- **Task detail is a drawer, not a route**: deadline and aging are decision information a standalone page would orphan; keyboard flow stays j/k → Enter → decide (CP-5).
- **The Evidence Dossier is one surface with layers, not tabs**: evidence-under-decision must assemble without navigation — four layers (summary → captures+quality → assessments → mismatch flags) traversed by keyboard in one region (02 Maryam's tab-hopping objection is the rejected alternative).
- **The applicant shell has no menu**: high-stakes forms punish exploration; the spine IS the navigation, and save-and-exit is always one action (04 decision, P09-adjacent).
- **Capture is a dark-navy viewport inside a light product**: the one surface inversion is functional (viewfinder legibility, glare discipline — 05) and semantically reserved (capture-only, never decorative).
- **PROGRAM renders as the same sheets applicants and reviewers see**: inspectability is the adoption contract (02 Khalid; threshold provenance labeled "spec-proposed defaults", 12 Q-6).
- **The ledger is top-level (S14 section)**: the dispute path is a destination (Sami's two-click test — CP-5.7); exports live beside it with expiry discipline.
- **No reviewer mobile console**: recorded rejection — decisions belong at evidence density; the notification ladder carries evening urgency instead (P21).
- **Counters, not analytics**: queue depth, aging, decisions/day, rework rate are operational facts on the queue header; funnel exploration is funnel-drop-off-explorer's boundary (LOOP-3, 12 Q-5) — this IA refuses the drift by construction.
