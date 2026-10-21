# 07a — Data Contract: meeting-notes-action-desk

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — the summarization assist (bilingual summary, decision candidates, action candidates) may bind an abstract assist capability (08); deterministic cue mode and manual note-taking are first-class execution modes, never error states. The confirmation loop, status transitions, zone derivation, and minutes assembly are deterministic by construction and never require the assist. TypeScript declarations for every entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type CaptureSource = 'typed' | 'pasted' | 'transcription-capability';
export type SummarizationMode = 'assist' | 'deterministic' | 'manual';

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction (LOOP-6: proposed bilingual-en)
  assistDefault: SummarizationMode;   // 'assist' | 'deterministic' (manual is per-meeting authoring)
  respondByDefaultDays: number;       // confirmation respond-by window default (3 at v1, 12 Q-6)
  meetingTitleLanguageHint: Locale;   // which pair side the title tends to be authored in
}

export interface Member {
  id: string;
  workspaceId: string;
  displayNameEn: string;
  displayNameAr: string;              // both authored at creation — bilingual by construction
  seat: 'lead' | 'member' | 'viewer'; // lead: full desk; member: confirm/respond/complete own
                                      // actions + read; viewer: read only
  locale: Locale;                     // owner-mode rendering preference
  createdAt: string;
  // Members are never deleted (history lineage) — seats may be downgraded. (12 Q-11)
}

export interface Meeting {
  id: string;
  workspaceId: string;
  titleEn?: string;                   // bilingual pair; either side may be empty (honest slot)
  titleAr?: string;
  heldOn: string;                     // ISO date (Gregorian storage; Hijri display is presentation, P24)
  participantMemberIds: string[];
  seriesLabel?: string;               // free-text grouping ("Weekly Ops Huddle") — no series entity at v1
  status: 'open' | 'closed';          // closed = archived for the record; never hard-deleted (07a rules)
  counts: {
    decisions: number;
    actions: number;
    actionsConfirmed: number;
    actionsAwaitingConfirmation: number;
  };
  latestCaptureRevisionId?: string;
  latestSummaryId?: string;
  createdAt: string;
  updatedAt: string;
}

export type SegmentDirection = 'ar' | 'en' | 'mixed';

export interface CaptureSegment {
  index: number;                      // 0-based order within the revision
  speakerMemberId?: string;           // speaker label where the source carried one
  speakerLabel?: string;              // raw label text if unmatched to a member
  text: string;                       // verbatim as captured; bidi-isolated at render
  direction: SegmentDirection;        // computed at ingest, disclosed (07c rules)
  startTs?: string;                   // optional timestamp from transcript sources
}

export interface CaptureRevision {
  id: string;
  meetingId: string;
  revision: number;                   // append-only revisions; never mutated in place
  source: CaptureSource;
  capturedAt: string;
  segments: CaptureSegment[];
  note?: string;                      // ingest accounting (duplicates, skipped rows)
  createdAt: string;
}

export interface Summary {
  id: string;
  meetingId: string;
  captureRevisionId: string;          // evidence pin: the revision this summary read
  mode: SummarizationMode;            // honest provenance, immutable post-run
  degraded: boolean;                  // assist requested but capability unavailable/exhausted
  textEn?: string;                    // authored or template paragraphs — one side may be empty
  textAr?: string;                    // never auto-translated from the other side (12 Q-7)
  proposedDecisions: DecisionDraft[];
  proposedActions: ActionDraft[];
  generatedAt: string;
}

export interface DecisionDraft {
  textEn?: string;
  textAr?: string;
  evidenceSpan?: { revisionId: string; segmentIndex: number; charStart: number; charEnd: number };
  confidence?: number;                // assist proposals only; <0.70 renders the 'low' label
}

export interface ActionDraft {
  textEn?: string;
  textAr?: string;
  ownerMemberId?: string;             // speaker-matched guess, disclosed; may be null
  ownerGuessBasis: 'speaker-match' | 'third-person-cue' | 'assist' | 'none';
  dueOn?: string;                     // expression-parsed guess (07c rules); may be null
  dueGuessBasis: 'date-expression' | 'assist' | 'none';
  evidenceSpan?: { revisionId: string; segmentIndex: number; charStart: number; charEnd: number };
  confidence?: number;                // assist proposals only; <0.70 renders the 'low' label
}

export interface Decision {
  id: string;
  meetingId: string;
  textEn?: string;
  textAr?: string;                    // bilingual pair; empty side is honest, never machine-filled
  evidenceSpan?: { revisionId: string; segmentIndex: number; charStart: number; charEnd: number };
  createdByMemberId: string;
  createdAt: string;
  updatedAt: string;
}

// The loop state machine: draft → proposed → (confirmed | questioned | declined)
// confirmed → in-progress → done; declined → reassignment-needed → (re-proposed)
export type ActionStatus =
  | 'draft'                 // authored, not yet sent for confirmation
  | 'proposed'              // confirmation requested, awaiting owner response
  | 'confirmed'             // owner accepted — THE COMMITMENT MOMENT
  | 'questioned'            // owner asked for clarification; back on the lead's desk
  | 'declined'              // owner refused; reassignment needed — visibly not dead
  | 'in-progress'           // confirmed and being worked
  | 'done'                  // completed by the owner (with timestamp, optional note)
  | 'withdrawn';            // removed by the lead; history retained

export type ActionZone =
  | 'awaiting-confirmation'   // status 'proposed', respondBy not yet passed
  | 'confirmation-overdue'    // status 'proposed', respondBy passed (derived)
  | 'on-track'                // confirmed/in-progress, dueOn null or far
  | 'due-soon'                // derived: dueOn within 48h, not done
  | 'overdue'                 // derived: dueOn passed, not done
  | 'none';                   // done/withdrawn/draft/questioned/declined carry no time zone

export interface ActionItem {
  id: string;
  meetingId: string;                  // every action traces to a meeting (LOOP-10 fence)
  textEn?: string;
  textAr?: string;                    // bilingual pair; empty side honest, never auto-translated
  ownerMemberId?: string;             // exactly one owner or none (draft); never two
  dueOn?: string;                     // required before requestConfirmation
  status: ActionStatus;
  evidenceSpan?: { revisionId: string; segmentIndex: number; charStart: number; charEnd: number };
  origin: 'assist-proposal' | 'deterministic-cue' | 'manual';   // provenance, never rewritten
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type ConfirmationResponse = 'confirmed' | 'questioned' | 'declined';

export interface ConfirmationRecord {   // append-only — the loop's audit trail
  id: string;
  actionId: string;
  requestedByMemberId: string;
  requestedAt: string;
  respondBy: string;                   // requestedAt + workspace/respondBy override
  response?: ConfirmationResponse;
  responseNote?: string;               // required for 'questioned' and 'declined'; optional for 'confirmed'
  respondedByMemberId?: string;
  respondedAt?: string;
  withdrawnAt?: string;                // lead withdrew the request before response
}

export interface StatusEvent {          // append-only status history per action
  id: string;
  actionId: string;
  from: ActionStatus;
  to: ActionStatus;
  actorMemberId: string;
  note?: string;                       // completion note / reopen reason / decline reason echo
  at: string;
}

export type JobKind = 'import' | 'transcribe' | 'summarize' | 'export';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';               // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                  // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;             // async-contract §5
}

export interface ExportArtifact {
  id: string;
  meetingId: string;
  format: 'minutes' | 'action-register';
  options: { includeRegisterAppendix?: boolean; includeUnconfirmed?: boolean };
  builtFromCaptureRevisionId?: string; // evidence pin for minutes (03 CP-5 edge)
  expiresAt: string;                  // declared retention window at creation (7 days)
  regenerable: boolean;
}

export interface ActivityEntry {      // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'meeting-created' | 'capture-imported' | 'summarization-run'
    | 'decision-recorded' | 'action-created' | 'confirmation-requested'
    | 'confirmation-responded' | 'confirmation-withdrawn'
    | 'action-status-changed' | 'action-reassigned' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                    // e.g. "responded: questioned — 'أي شهر؟'" — provenance audit
  at: string;
}
```

## Relationships

Workspace 1—N Member · Workspace 1—N Meeting · Meeting 1—N CaptureRevision (append-only) · Meeting 1—N Summary (each pinned to a revision) · Meeting 1—N Decision · Meeting 1—N ActionItem · ActionItem 1—N ConfirmationRecord (append-only loop trail) · ActionItem 1—N StatusEvent (append-only) · ActionItem N—1 Member (owner, 0..1) · Evidence spans reference (revisionId, segmentIndex, char range) into CaptureRevision.segments · Job spans import/transcribe/summarize/export work · Meeting 1—N ExportArtifact.

## Operations (summary; typed signatures in 07b)

Meetings: create, list, get, update. Capture: importNotes (Job; typed/pasted floor), transcribeAudio (Job; abstract capability, consent-gated), getNotes (revision read). Summarization: runSummarization (Job; assist|deterministic, honest modeUsed/degraded). Decisions: create, list, update. Actions: create, list, get, update (text/owner/due/evidence; versioned), updateActionStatus (lifecycle), requestConfirmation, respondToConfirmation. Platform: getSession, listMembers, addMember, listJobs, listActivity, getUsage. Export: exportMinutes (Job), getArtifact.

## State obligations

- **The confirmation gate is the lifecycle's spine**: an action cannot enter `in-progress` or `done` without passing through `confirmed` (07b VALIDATION rule); `done` is set only by the owner's own session or a lead acting on their behalf (labeled).
- **Confirmation records are append-only**: re-requests create new records; the decline history of a reassigned action is retained and visible; nothing in the loop trail is edited or deleted.
- **Single-owner invariant**: an ActionItem carries 0..1 owner; the composer and the adapter both refuse a second (shared ownership is declared no-ownership — 01 evidence).
- **Zone derivation is deterministic and derived-at-read** (never stored): awaiting-confirmation/confirmation-overdue from respondBy vs now; overdue/due-soon from dueOn vs now; the same state always yields the same zone (07c fixed clock).
- **Provenance is never rewritten**: an assist-proposed action keeps origin 'assist-proposal' through every later human edit; summaries keep their mode; capture revisions append.
- **Meetings are never hard-deleted**: closing archives; actions and confirmation trails keep their lineage (auditor-facing honesty).
- **Bilingual pairs are human-authored**: either side may be empty and renders as an honest empty slot; no operation writes a machine translation into a pair field (12 Q-7).
- **Partial-result policies**: capture import delivers landed-so-far + named bad rows; transcription delivers segments-so-far on mid-failure; summarize is atomic per run; export delivers per-format partial with per-format retry (async-contract §4).
- **No provider names anywhere** — the transcription path appears as source 'transcription-capability' and an abstract need in 08.
