# 07b — Adapter Contract: meeting-notes-action-desk (TypeScript, v1)

SME-G pass · `MeetingNotesAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. Types only — no implementation. Entity semantics (Workspace, Member, Meeting, CaptureRevision, CaptureSegment, Summary, Decision, ActionItem, ConfirmationRecord, StatusEvent, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
// Single contract surface. Entity types referenced below (ActionItem,
// ConfirmationRecord, Summary — and their fields) are declared canonically
// in 07a and are part of this contract by reference; 07b declares only the
// operational wrappers (summaries, views, jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed capture, missing owner/due at
 *                    request-confirmation, out-of-sequence status transitions)
 * 'NOT_FOUND'    -> NotFoundError     (stale meeting/action/confirmation/artifact
 *                    links, withdrawn confirmations)
 * 'PERMISSION'   -> PermissionError   (capability consent, viewer-seat mutations,
 *                    cross-workspace reads)
 * 'CONFLICT'     -> ConflictError     (concurrent action edits, racing
 *                    confirmation responses)
 * 'RATE_LIMIT'   -> RateLimitError    (assist summarization runs, transcription
 *                    runs, exports)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact delivery)
 * 'UNKNOWN'      -> UnknownError      (typed retry, correlationId)
 */
export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;
  correlationId: string;
  retryable: boolean;
  details?: Record<string, string[]>;
}

export interface Session {
  memberId: string;
  workspaceId: string;
  role: 'lead' | 'member' | 'viewer';  // member: respond to own confirmations +
                                       // update own action status + read; viewer: read only
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export type Locale = 'ar' | 'en';
export type ActionStatus = 'draft' | 'proposed' | 'confirmed' | 'questioned'
  | 'declined' | 'in-progress' | 'done' | 'withdrawn';
export type ActionZone = 'awaiting-confirmation' | 'confirmation-overdue'
  | 'on-track' | 'due-soon' | 'overdue' | 'none';
export type SummarizationMode = 'assist' | 'deterministic' | 'manual';

export interface MemberSummary {
  id: string;
  displayNameEn: string;
  displayNameAr: string;
  seat: 'lead' | 'member' | 'viewer';
  locale: Locale;
}

export interface MeetingSummary {
  id: string;
  titleEn?: string;
  titleAr?: string;
  heldOn: string;
  participantMemberIds: string[];
  seriesLabel?: string;
  status: 'open' | 'closed';
  counts: { decisions: number; actions: number;
            actionsConfirmed: number; actionsAwaitingConfirmation: number };
  latestCaptureRevisionId?: string;
  latestSummaryId?: string;
  updatedAt: string;
}

export interface CaptureRevisionView {
  id: string;
  meetingId: string;
  revision: number;
  source: 'typed' | 'pasted' | 'transcription-capability';
  capturedAt: string;
  segments: {                     // full shapes per 07a CaptureSegment
    index: number;
    speakerMemberId?: string;
    speakerLabel?: string;
    text: string;                 // verbatim; bidi-isolated at render (rtl-rules §2)
    direction: 'ar' | 'en' | 'mixed';
    startTs?: string;
  }[];
  note?: string;
}

export interface ProposalView {   // unresolved proposals inside the latest summary
  kind: 'decision' | 'action';
  draftId: string;
  textEn?: string;
  textAr?: string;
  ownerMemberId?: string;
  ownerGuessBasis: 'speaker-match' | 'third-person-cue' | 'assist' | 'none';
  dueOn?: string;
  confidence?: number;            // assist proposals only; <0.70 renders the 'low' label
  evidenceSpan?: { revisionId: string; segmentIndex: number;
                   charStart: number; charEnd: number };
  state: 'pending' | 'accepted' | 'edited' | 'dismissed';
}

export interface SummaryView {
  id: string;
  meetingId: string;
  captureRevisionId: string;
  mode: SummarizationMode;        // honest provenance, immutable post-run
  degraded: boolean;              // assist requested, capability unavailable/exhausted
  textEn?: string;
  textAr?: string;
  proposals: ProposalView[];
  generatedAt: string;
}

export interface ActionItemView {  // derived-at-read fields computed server-side
  id: string;
  meetingId: string;
  meetingTitleEn?: string;
  meetingTitleAr?: string;
  textEn?: string;
  textAr?: string;
  ownerMemberId?: string;
  ownerNameEn?: string;           // resolved for owner-mode rendering
  ownerNameAr?: string;
  dueOn?: string;
  status: ActionStatus;
  zone: ActionZone;               // DERIVED: respondBy/dueOn vs now — never stored
  respondBy?: string;             // from the latest non-withdrawn ConfirmationRecord
  overdueDays?: number;           // zone 'overdue': whole days past dueOn
  confirmationOverdueDays?: number; // zone 'confirmation-overdue': days past respondBy
  origin: 'assist-proposal' | 'deterministic-cue' | 'manual';
  version: number;
  updatedAt: string;
}

export interface ConfirmationView {
  recordId: string;
  actionId: string;
  actionTextEn?: string;
  actionTextAr?: string;
  requestedByMemberId: string;
  requestedAt: string;
  respondBy: string;
  response?: 'confirmed' | 'questioned' | 'declined';
  responseNote?: string;
  respondedByMemberId?: string;
  respondedAt?: string;
  withdrawnAt?: string;
}

export interface Job<T> {
  id: string;
  kind: 'import' | 'transcribe' | 'summarize' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface MeetingNotesAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // members (workspace people; the owner side of the loop)
  listMembers(query: {
    filter?: { seat?: MemberSummary['seat'][]; search?: string };  // normalized bilingual search
    cursor?: string; limit: number;
  }): Promise<Result<Page<MemberSummary>, AdapterError>>;
  addMember(input: {
    displayNameEn: string; displayNameAr: string;
    seat: 'lead' | 'member' | 'viewer'; locale: Locale;
  }): Promise<Result<MemberSummary, AdapterError>>;

  // meetings
  createMeeting(input: {
    titleEn?: string; titleAr?: string;           // either side optional, both encouraged
    heldOn: string; participantMemberIds: string[]; seriesLabel?: string;
  }): Promise<Result<MeetingSummary, AdapterError>>;
  listMeetings(query: {
    filter?: { status?: ('open' | 'closed')[]; seriesLabel?: string; heldOnFrom?: string; heldOnTo?: string };
    search?: string;                    // normalized bilingual search (rtl-rules §4)
    sort: 'heldOn' | 'updatedAt' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<MeetingSummary>, AdapterError>>;
  getMeeting(id: string): Promise<Result<MeetingSummary & {
    latestSummary?: SummaryView;
    decisions: { id: string; textEn?: string; textAr?: string;
                 evidenceSpan?: ProposalView['evidenceSpan']; updatedAt: string }[];
  }, AdapterError>>;
  updateMeeting(id: string, patch: {
    titleEn?: string; titleAr?: string; heldOn?: string;
    participantMemberIds?: string[]; seriesLabel?: string; status?: 'closed';
  }): Promise<Result<MeetingSummary, AdapterError>>;

  // capture ingestion (typed/pasted = the LOOP-5 always-available floor)
  importNotes(input: {
    meetingId: string;
    source: 'typed' | 'pasted';
    segments: { speakerLabel?: string; text: string; startTs?: string }[];
    idempotencyKey: string;            // async-contract §5 — double-submit never double-imports
  }): Promise<Result<Job<{ revisionId: string; landed: number; invalidRows: string[] }>, AdapterError>>;
  getNotes(query: {
    meetingId: string; revision?: number;   // defaults to latest
  }): Promise<Result<CaptureRevisionView, AdapterError>>;

  // abstract transcription capability path (consent-gated; 08 N1)
  transcribeAudio(input: {
    meetingId: string;
    audioRef: string;                  // opaque handle to an already-uploaded file — the
                                       // adapter never records or joins a call (LOOP-10)
    idempotencyKey: string;
  }): Promise<Result<Job<{ revisionId: string; segments: number; source: 'transcription-capability' }>, AdapterError>>;

  // summarization (conditionally-AI: assist degrades to deterministic — 08 map)
  runSummarization(input: {
    meetingId: string;
    captureRevisionId?: string;        // defaults to latest
    mode: 'assist' | 'deterministic';
    idempotencyKey: string;
  }): Promise<Result<Job<{ summaryId: string; modeUsed: 'assist' | 'deterministic';
                           degraded: boolean }>, AdapterError>>;

  // decisions
  createDecision(input: {
    meetingId: string; textEn?: string; textAr?: string;
    evidenceSpan?: { revisionId: string; segmentIndex: number; charStart: number; charEnd: number };
    fromDraftId?: string;             // accepting a proposal records the lineage
  }): Promise<Result<{ id: string; meetingId: string; textEn?: string; textAr?: string }, AdapterError>>;
  listDecisions(query: {
    meetingId?: string; search?: string;
    cursor?: string; limit: number;
  }): Promise<Result<Page<{ id: string; meetingId: string; textEn?: string; textAr?: string;
                            evidenceSpan?: ProposalView['evidenceSpan']; updatedAt: string }>, AdapterError>>;
  updateDecision(id: string, patch: {
    textEn?: string; textAr?: string;
    evidenceSpan?: { revisionId: string; segmentIndex: number; charStart: number; charEnd: number } | null;
  }): Promise<Result<{ id: string; meetingId: string; textEn?: string; textAr?: string }, AdapterError>>;

  // actions
  createAction(input: {
    meetingId: string;                 // every action traces to a meeting (LOOP-10 fence)
    textEn?: string; textAr?: string;
    ownerMemberId?: string;            // 0..1 — a second owner is a VALIDATION error
    dueOn?: string;
    evidenceSpan?: { revisionId: string; segmentIndex: number; charStart: number; charEnd: number };
    fromDraftId?: string;             // accepting an assist/cue proposal
  }): Promise<Result<ActionItemView, AdapterError>>;
  listActions(query: {
    filter?: {
      ownerId?: string; meetingId?: string;
      status?: ActionStatus[]; zone?: ActionZone[];
      dueOnFrom?: string; dueOnTo?: string;
    };
    search?: string;                    // bilingual, normalized (rtl-rules §4)
    sort: 'dueOn' | 'updatedAt' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActionItemView>, AdapterError>>;
  getAction(id: string): Promise<Result<ActionItemView & {
    confirmationHistory: ConfirmationView[];
    statusHistory: { from: ActionStatus; to: ActionStatus;
                     actorMemberId: string; note?: string; at: string }[];
  }, AdapterError>>;
  updateAction(id: string, patch: {
    textEn?: string; textAr?: string;
    ownerMemberId?: string | null;      // reassignment (declined → re-proposed path)
    dueOn?: string;
    evidenceSpan?: { revisionId: string; segmentIndex: number; charStart: number; charEnd: number } | null;
    baseVersion: number;
  }): Promise<Result<ActionItemView, AdapterError>>;
  updateActionStatus(input: {
    actionId: string;
    to: 'in-progress' | 'done' | 'withdrawn';
    note?: string;                      // completion note / reopen reason
    baseVersion: number;
  }): Promise<Result<ActionItemView, AdapterError>>;

  // the confirmation loop (the signature)
  requestConfirmation(input: {
    actionId: string;
    respondByOverrideDays?: number;     // else workspace default (3)
    baseVersion: number;
    idempotencyKey: string;
  }): Promise<Result<{ action: ActionItemView; confirmation: ConfirmationView }, AdapterError>>;
  respondToConfirmation(input: {
    confirmationRecordId: string;
    response: 'confirmed' | 'questioned' | 'declined';
    note?: string;                      // REQUIRED for 'questioned' and 'declined'
    idempotencyKey: string;
  }): Promise<Result<{ action: ActionItemView; confirmation: ConfirmationView }, AdapterError>>;

  // export (abstract delivery; manual path is download/copy — 08 N3)
  exportMinutes(input: {
    meetingId: string;
    format: 'minutes' | 'action-register';
    options: { includeRegisterAppendix?: boolean; includeUnconfirmed?: boolean;
               registerFilter?: { ownerId?: string; status?: ActionStatus[]; zone?: ActionZone[] } };
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; meetingId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  listActivity(query: {
    filter?: { action?: string[]; meetingId?: string; actorMemberId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<{ id: string; actorMemberId: string; action: string;
                            targetRef: string; detail?: string; at: string }>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    assistRuns: number; deterministicRuns: number; transcriptionRuns: number; exports: number;
    resetAt: string;
  }, AdapterError>>;
}
```

## Rules

1. **Confirmation gate**: `updateActionStatus` to 'in-progress'/'done' on an action whose status is not 'confirmed' → VALIDATION naming the required path ("confirm before completion"); `respondToConfirmation` with response 'confirmed' is the only transition into 'confirmed', and it requires a matching open ConfirmationRecord — a withdrawn or already-responded record is a NOT_FOUND with the recorded outcome in `details`.
2. **Single-owner invariant**: `createAction`/`updateAction` never writes two owners; the input surface carries one optional owner id and the contract has no co-owner field — "shared ownership is another way of saying no ownership" (01 evidence) is a schema-level rule.
3. **Assist honesty**: `runSummarization` returns `modeUsed` + `degraded` — quota exhaustion or capability unavailability degrades the run to deterministic cue mode and says so; the summary's `mode` is immutable post-run; the UI surfaces provenance per proposal (P15/ai-native-patterns §5 ladder), never a silent rerun.
4. **Consent enforcement**: `transcribeAudio` without a granted transcription consent → PERMISSION naming the capability class in capability language (credential-contract §4) — never a vendor name; the typed/pasted capture paths never require consent.
5. **Stale-version semantics**: `updateAction`/`updateActionStatus`/`requestConfirmation` with stale `baseVersion` → CONFLICT with both payloads in `details`; racing `respondToConfirmation` calls on one record → the first response stands and the second is CONFLICT carrying the recorded response.
6. **Idempotency**: import/transcribe/summarize/request/respond/export submits carry idempotency keys; a retried submit returns the original result (async-contract §5) — a double-tapped Confirm never double-records a commitment.
7. **Zone derivation is server-side and derived-at-read**: `ActionItemView.zone`/`overdueDays`/`confirmationOverdueDays` are computed against the authoritative clock at read time; the adapter never stores a zone, so the same state always yields the same zone (07c fixed clock proves it).
8. **Append-only trails**: ConfirmationRecords and StatusEvents are never edited or deleted; withdrawal appends `withdrawnAt`; re-requests create new records; `updateMeeting` to 'closed' archives without touching action lineage.
9. **Bilingual pair honesty**: no operation writes machine-translated text into a pair field; either side may be empty; `search` normalizes per rtl-rules §4 and the normalization is disclosed in-product (ai-native-patterns §7.4).
10. **Evidence lineage**: proposals and actions may carry spans referencing (revisionId, segmentIndex, char range); a span pointing at a revision that no longer resolves renders as a labeled stale-evidence state, never as silence.
11. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass.
