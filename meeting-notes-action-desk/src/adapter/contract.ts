// VERBATIM from specs-source/meeting-notes-action-desk/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type CaptureSource = 'typed' | 'pasted' | 'transcription-capability';
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

