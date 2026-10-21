# 04 — Information Architecture: meeting-notes-action-desk

## Navigation model

Left rail: **Desk** (home — the loop digest + meetings list) · **Actions register** · **Loop desk** · **Members** · **Jobs & activity** · **Settings**. The meeting detail is the product's core mode — one meeting, four stacked surfaces switched by tabs: **Capture** (the notes/transcript revision panel) · **Summary** (mode-labeled summary + proposals review) · **Decisions** · **Actions**. ⌘K palette (P05 — list surfaces exceed three) reaches meetings, actions, members, and jobs with bilingual normalized search (alef variants, taa marbuta, yaa forms, tashkeel strip — rtl-rules §4). Two-level IA: section → item; meeting detail is item detail with tabs as the persistent dimension. Desktop-first; ≤767px: Desk/Actions register/Loop desk collapse to digest-card lists, and **owner mode** (confirm/question/decline/complete one's own actions) is a first-class narrow surface — the confirmation loop's most-used viewport is the owner's phone.

## Entity overview (07a for full shapes)

Workspace → Members · Meetings → NoteRevisions (typed notes or imported/transcribed capture, segmented) → Summaries (mode-labeled, pinned to a revision) · Meetings → Decisions · Meetings → ActionItems (bilingual pairs, single owner, evidence span) → ConfirmationRecords (request + response, append-only) → StatusEvents. Jobs wrap import/transcribe/summarize/export work. ExportArtifacts carry minutes/register deliveries with expiry.

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Desk home | loop digest (zones + counts, each row a live link), meetings list with rollups, onboarding checklist (P22) | listActions, listMeetings, getMeeting, getSession |
| S2 | Meeting detail — Capture | notes/transcript revisions, per-segment direction, speaker labels, evidence-highlight spans, ingest actions | getNotes, importNotes, transcribeAudio, getMeeting |
| S3 | Meeting detail — Summary | mode-labeled summary, proposals review (accept/edit/dismiss), regenerate, assist meter | runSummarization, getMeeting, getUsage, listJobs |
| S4 | Meeting detail — Decisions | decision list, create/edit, evidence links | createDecision, listDecisions, updateDecision |
| S5 | Meeting detail — Actions | action list for the meeting, ActionComposer drawer, send-for-confirmation | createAction, listActions, getAction, updateAction, requestConfirmation, updateActionStatus |
| S6 | Loop desk | confirmation queue (awaiting / questioned / declined / confirmation-overdue), respond surfaces for owners, escalation review | listActions, getAction, respondToConfirmation, updateAction, requestConfirmation, listActivity |
| S7 | Actions register | all actions across meetings; filters owner/status/zone/meeting/date; export register | listActions, getAction, updateActionStatus, exportMinutes |
| S8 | Members & Settings | bilingual member directory, seat roles, locale/assist/respond-by defaults, consent state | listMembers, addMember, getSession, getUsage |
| S9 | Command palette (overlay) + Jobs & activity console | bilingual search across meetings/actions/members/jobs; job rows with cancel/retry and link-to-context; activity feed | client-side over S1/S6/S7 data; listJobs, listActivity |

Owner mode is not a separate screen: it is the ≤767px presentation of S6 + S5 scoped to the session member's own actions, reachable from a notification link (no full navigation required).

## Per-screen state obligations

Four empties per P01 (S1 first-run offers the sample meeting; S2 first-run teaches the typed-notes floor path; S6 distinguishes no-requests-yet from all-answered; S7 filtered-empty offers filter reset and declares itself). Skeletons mirror final geometry per direction (P02). Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **The loop desk is a first-class nav section, not a filter on the register**: the confirmation loop is the signature artifact (00); its queue — awaiting, questioned, declined, confirmation-overdue — earns its own surface with its own empty/loading/error states and its own owner-mode presentation. Burying it inside the register would bury the product's reason to exist.
- **Meetings own their tabs; actions cross meetings**: the meeting detail keeps capture/summary/decisions/actions together because lineage is the honesty (an action without its meeting is a task-manager row — the LOOP-10 fence); the register is the cross-meeting working view because follow-through is a weekly posture, not a per-meeting one.
- **Owner mode is a viewport, not a role-gated app**: Faisal never navigates the full desk; his queue is the loop desk scoped by owner. Membership stays auth-agnostic (07b Session) so owner links work without a second product to learn.
- **Jobs consolidated with activity (T3 posture)**: per async-contract §7, Tier 3 may consolidate the job center into an activity surface — S9 carries both with link-to-context rather than per-class IA.
- **Settings is small and honest**: respond-by default and assist-mode default live where the loop lives (S8 + the composer override); capability consent state renders in capability language (credential-contract §2), never vendor names.
