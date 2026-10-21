# 03 — UX Flows: meeting-notes-action-desk

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation — no orphans.

## CP-1 — New meeting → capture in → first proposals (value proof)

1. Sara creates a meeting: bilingual title pair (EN + AR, either optional, both encouraged), date, participants picked from the members directory (or added inline via `addMember` — a participant not yet in the workspace becomes a member with a bilingual display name). `createMeeting` · `addMember` · `listMembers`
2. Capture panel offers three paths, in honesty order: **type notes** (the always-available floor), **paste/import capture** (text from an external notetaker or a notes doc), or **transcribe audio** (the abstract transcription capability, consent-gated; renders as optional, never as the front door). `importNotes` (Job) · `transcribeAudio` (Job) · `listJobs`
3. Pasted/imported capture lands as a notes revision with per-segment direction (mixed-script segments render each at their own direction, bidi-isolated) and speaker labels where the source carried them. `getNotes`
4. She runs summarization, mode visible: **assist** (capability active) or **deterministic cue mode** (always available). It is a Job per async-contract: queued → running → succeeded, with segment-count progress and a summary region reserved before arrival (streaming disclosure per ai-native-patterns §2). `runSummarization` · `listJobs`
5. Result renders: bilingual summary paragraphs (mode-labeled, provenance chip), proposed decisions, and proposed action candidates — each with confidence label, owner guess (speaker-matched, disclosed), due-date guess (expression-parsed), and the evidence span link into the capture. She accepts one, edits one, dismisses the seeded false positive (P15). `getMeeting` (summary + proposals state) · `createAction` (accept) · `updateAction` (edit) · `createDecision` (accepted decision)
6. First read done: the meeting now has capture, summary, ≥1 decision, ≥1 authored action — the desk digest updates. `getUsage` (assist meter, P14)

**Edges**: capture with zero speaker labels (owner guesses come back null — "assign an owner" state, never a fabricated name); one-sided bilingual title (the empty side renders as an honest empty pair slot, never auto-filled); re-running summarization after new capture (new revision, prior result kept — P04 level 2 confirm names what is replaced); a locale with no parseable date expressions (due-date guesses stay empty; the action composer requires a real date before confirmation can be requested); transcript with mixed AR/EN inside one sentence (segment renders with bidi isolation; evidence spans are character-precise).
**Failures**: malformed paste (empty text) → VALIDATION naming the capture path; transcription capability unconsented → PERMISSION with the consent surface linked (capability language); assist quota exhausted mid-run → run degrades to deterministic cue mode, the job result records `modeUsed` + `degraded: true` (honest provenance — never a silent rerun); ingestion job failure → typed error + retry, previously landed segments kept (partial policy per async-contract §4).
**Recovery**: capture revisions persist across failed jobs; summarization is re-runnable; nothing entered is ever lost to a job failure.

## CP-2 — Action authoring → single owner → send for confirmation (the daily loop)

1. From the meeting's actions panel (or the desk home quick-create, which requires picking a meeting — every action traces to one), Sara opens the ActionComposer. `getMeeting`
2. She authors the bilingual text pair (EN + AR side-by-side, per-side direction; the empty side is allowed and visibly unpaired), picks **one** owner from the member picker (the composer refuses a second owner — "shared ownership is another way of saying no ownership," 02/01 evidence), and sets a due date (Gregorian; dual-calendar display per P24 where the workspace locale is ar). `createAction`
3. Evidence binding: if the action came from a proposal, the evidence span links to the capture segment; if hand-authored, she can still link a span (optional). `updateAction`
4. She sends it for confirmation: the action enters `proposed` state and a ConfirmationRecord is created with a respond-by deadline (workspace default, 3 days — 12 Q-6). The owner's loop desk and the lead's desk digest both update. `requestConfirmation`
5. Bulk variant: select several drafted actions (P07) and send them together — each gets its own confirmation record; the digest counts "4 awaiting confirmation." `requestConfirmation`

**Edges**: owner without a workspace session yet (the confirmation waits; the owner-mode link works from a shared notification — membership is auth-agnostic); respond-by window edit per action before send (override of the default); re-request after a declined response (creates a new ConfirmationRecord — the history keeps the decline); action with due date before respond-by (the composer warns: the owner would confirm an already-late action — allowed, warned).
**Failures**: stale action edit (another session changed it) → CONFLICT with both payloads; sending for confirmation with no owner or no due date → VALIDATION naming the missing field; viewer-role session attempting authoring → PERMISSION naming the seat's duties.
**Recovery**: drafts persist indefinitely; a withdrawn confirmation returns the action to draft with the history intact.

## CP-3 — The owner confirmation loop (signature flow)

1. Faisal opens owner mode (responsive page reachable from a notification link or the loop desk): his queue — every action proposed to him, with Arabic-first rendering when his locale is ar, each carrying the bilingual pair, the due date, the evidence span, and the respond-by countdown. `listActions` (owner filter, zone: awaiting-confirmation) · `getAction`
2. He **confirms** one: the action enters `confirmed` — the commitment moment; the confirmation record lands with his session, the timestamp; the lead's digest updates; the signature micro-interaction settles (05 — opacity-only, ≤120ms, polite announcement). `respondToConfirmation` (response: 'confirmed')
3. He **questions** another: types a one-line clarification ("which month's variance?"); the action enters `questioned`, returns to the lead's desk with the question attached as a thread entry. Sara answers by editing the action (which returns it to draft for re-send) or by replying in the thread and re-requesting. `respondToConfirmation` (response: 'questioned') · `updateAction` · `requestConfirmation`
4. He **declines** a third with a reason: the action enters `reassignment-needed` — visibly not dead; Sara reassigns it (new owner, same history) and the new confirmation request goes out. `respondToConfirmation` (response: 'declined') · `updateAction` (reassign) · `requestConfirmation`
5. Escalation review: on the lead's loop desk, actions proposed but unanswered past their respond-by window render in the **confirmation-overdue** zone with named values ("requested 8 Oct, respond-by 11 Oct, 10 days unanswered"). No auto-reassignment, no notification storm — the stall is visible state. `listActions` (zone filter) · `listActivity` (P17: every request/response/withdrawal is logged)

**Edges**: owner confirms after respond-by passed (allowed — the record shows both dates honestly); the owner is also the lead (self-confirmation allowed and labeled); two confirmations race (first response wins, second arrives as CONFLICT with the recorded response); the meeting is deleted? (meetings are never hard-deleted at v1 — they are closed; actions keep their lineage — 07a state obligations).
**Failures**: responding to a withdrawn confirmation → NOT_FOUND with the withdrawal stated; malformed response (empty question text) → VALIDATION on the field; viewer role → PERMISSION.
**Recovery**: every state in the loop is reversible by the lead (withdraw, reassign, re-request) except history itself — the confirmation trail is append-only.

## CP-4 — Follow-through: in-progress → done; overdue zones; the desk review

1. Sara's morning desk: the digest shows counts by zone — awaiting-confirmation, confirmation-overdue, overdue, due-soon, done-this-week — each row a live link. `listActions` (zone filters) · `getMeeting` (meeting rollups)
2. Faisal (owner mode) marks a confirmed action **in-progress**, later **done** — with an optional one-line completion note; the done timestamp and his session are recorded. `updateActionStatus`
3. Overdue is derived, not declared: an action past its due date and not done renders in the overdue zone with named values ("due 17 Oct, 4 days past"). The lead can reopen a done action (`updateActionStatus` → 'in-progress' with reason) when "done" turns out not to be. `updateActionStatus`
4. The actions register: all actions across meetings, virtualized, filterable by owner/status/zone/meeting/date; filtered states declare themselves (P08/P01). `listActions` · `getAction`
5. Any mutation is in the activity log — actor, action, target, timestamp (P17). `listActivity`

**Edges**: an action whose due date passes while still `proposed` (both zones true: confirmation-overdue AND overdue — both render, the record is honest); owner changes mid-flight (the new owner inherits a confirmed action with history; a re-confirmation is offered, not forced); done with an empty completion note (allowed — the note is optional, the timestamp is not).
**Failures**: stale status change → CONFLICT; status transition out of sequence (e.g., done from proposed without confirmation) → VALIDATION naming the required path; viewer role → PERMISSION.
**Recovery**: reopen returns the action to in-progress with the full prior history; nothing is destructive except withdrawal, which is itself logged.

## CP-5 — Decisions, minutes export, register export, workspace management

1. During CP-1's review or any time after, decisions are recorded: a decision is what was agreed (distinct from an action — what someone will do, 01 evidence); decisions carry bilingual text and optionally reference an evidence span. `createDecision` · `listDecisions` · `updateDecision`
2. Meeting metadata edits (title pair, date, participants — e.g., a name correction) with revision history. `updateMeeting` · `getMeeting` · `listMeetings`
3. Minutes export: bilingual minutes (fixed, inspectable structure — meeting header, participants, summary, decisions, actions with confirmation provenance) + the action register appendix as an export option; a Job with expiry + regeneration per async-contract. `exportMinutes` (Job) · `listJobs` · `getArtifact`
4. Register export variant: the actions register alone (filtered as displayed) for Reem's quarterly review. `exportMinutes` (register option)
5. Workspace management: members directory with bilingual names and seats (lead/member/viewer), settings — locale default, assist-mode default, respond-by default, capability consent state (credential-contract: kind, not vendor). `listMembers` · `addMember` · `getSession` · `getUsage`
6. Jobs & activity console: all job classes (import/transcribe/summarize/export) with state, cancel/retry, link-to-context; the activity feed beside it (T3 consolidation per async-contract §7). `listJobs` · `listActivity`

**Edges**: exporting with unconfirmed actions (allowed — they export flagged `proposed`, honest not blocking); exporting a meeting whose capture was edited after summarization (the minutes note the capture revision they were built from — evidence binding again); artifact expiry (7 days) with renewal action.
**Failures**: export job failure mid-artifact → partial policy (per-format retry); expired artifact fetch → NOT_FOUND with the regenerable path; consent withdrawn between export and delivery → NETWORK/PERMISSION typed surface with the manual download alternative (LOOP-5).
**Recovery**: exports re-generate from current state; jobs reconcile after connection loss (async-contract §5); settings changes never invalidate existing confirmations.

## Non-happy paths

- **Assist capability unavailable (rung 4, 08 map)**: summarization runs deterministic cue mode with an explicit notice; summary comes from fixed templates + cue-phrase highlights; proposals carry provenance 'deterministic'; the full flow — actions, confirmations, minutes — completes (the 00 success signal).
- **No transcription capability bound (LOOP-5)**: typed notes and pasted capture are the primary paths from first run; the transcribe path renders as optional with the consent surface, never as a wall.
- **First-run**: desk home offers a seeded sample meeting with a planted confirmation-overdue and overdue fixture so the loop is experienceable before any real meeting exists (P22 value checklist).
- **Offline (P20)**: reads work; writes (confirmations, status changes, edits) queue with per-item state; jobs reconcile to authoritative state on return.
- **Viewer seat**: read-only across the desk; PERMISSION surfaces name the seat's duties instead of hiding data.

## Failure → error mapping

VALIDATION (malformed capture, missing owner/due at confirmation-request time, out-of-sequence status transitions, empty question text) · NOT_FOUND (stale meeting/action/confirmation/artifact links, withdrawn confirmations) · PERMISSION (capability consent, viewer-role mutations, cross-workspace reads) · CONFLICT (concurrent action edits, racing confirmation responses) · RATE_LIMIT (assist summarization runs, transcription runs, exports) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-5.5, entry (role/locale) | `createDecision` | CP-1.5, CP-5.1 |
| `getUsage` | CP-1.6, CP-5.5 | `listDecisions` | CP-5.1 |
| `listMembers` | CP-1.1, CP-5.5 | `updateDecision` | CP-5.1 |
| `addMember` | CP-1.1 (inline participant add) | `createAction` | CP-1.5 (accept path), CP-2.2 |
| `createMeeting` | CP-1.1 | `listActions` | CP-3.1, CP-4.1/4, CP-5.4 (register export source) |
| `listMeetings` | CP-5.2, desk home | `getAction` | CP-3.1, CP-4.4 |
| `getMeeting` | CP-1.5, CP-2.1, CP-4.1 (rollups) | `updateAction` | CP-1.5 (edit), CP-2.3, CP-3.3/4 (edit/reassign) |
| `updateMeeting` | CP-5.2 | `updateActionStatus` | CP-4.2/3 (in-progress/done/reopen) |
| `importNotes` | CP-1.2 | `requestConfirmation` | CP-2.4/5, CP-3.3 (re-request) |
| `getNotes` | CP-1.3, CP-2.3 (evidence spans) | `respondToConfirmation` | CP-3.2/3/4 |
| `transcribeAudio` | CP-1.2 (capability path) | `exportMinutes` | CP-5.3/4 |
| `runSummarization` | CP-1.4 | `getArtifact` | CP-5.3 |
| `listActivity` | CP-3.5, CP-4.5, CP-5.6 | | |

26 operations, 0 orphans (Critic-verified).
