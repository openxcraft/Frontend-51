// VERBATIM from specs-source/legal-case-tracker/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (BilingualText,
// TimelineEvent, HearingOutcome, DeadlineRule, CustodyEntry, ClosureRecord —
// and their fields) are declared canonically in 07a and are part of this
// contract by reference; 07b declares only the operational wrappers
// (summaries, rows, views, jobs) its signatures need. This product is
// DECLARED NON-AI (ai-native-patterns §1): no operation invokes any AI
// capability; the countdown, deadline-generation, custody-sequencing, and
// closure-gate rules specified in 07c are the whole of the engine.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (bilingual field rules, reschedule-without-reason, deadline-rule sanity, custody link requirements, closure-gate attempts)
 * 'NOT_FOUND'    -> NotFoundError     (stale matter/event/document/version/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (viewer-role mutations, owner-only rule management, workspace scoping)
 * 'CONFLICT'     -> ConflictError     (concurrent matter/event/rule edits, outcome already recorded, sealing a sealed version)
 * 'RATE_LIMIT'   -> RateLimitError    (export packages)
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
  role: 'owner' | 'attorney' | 'paralegal' | 'viewer';
  // owner: managing partner (rules, closure, everything); attorney: full matter work incl.
  // closure; paralegal: matters/events/documents/custody, not closure or rule deletion;
  // viewer: client-side contact — reads the timeline and hearing dates, nothing else (02 Hind)
  locale: 'ar' | 'en';                    // chrome direction; bilingual fields render per-side (05)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export interface MatterSummary {
  id: string;
  clientId: string;
  title: BilingualText;
  caseNumber: string;
  court: BilingualText;
  practiceArea: Matter['practiceArea'];
  stage: Matter['stage'];
  counts: Matter['counts'];
  nextHearing?: {
    hearingEventId: string;
    date: string;
    daysUntil: number;
    zone: HearingCountdown['zone'];       // the docket-home countdown column (03 CP-2.1)
  };
  version: number;
  updatedAt: string;
}

export interface MatterView extends MatterSummary {
  parties: PartyRef[];
  teamMemberIds: string[];
  openedAt: string;
  closedAt?: string;
  closure?: ClosureRecord;
  gate: {                                 // live closure-gate state (03 CP-5.1)
    blocked: boolean;
    blockers: {
      kind: 'future-hearing' | 'outcome-due-hearing' | 'open-deadline' | 'unreturned-original';
      refEventId?: string;
      refDocumentId?: string;
      label: string;                      // bilingual, computed (07c rule 7)
    }[];
  };
}

export interface ClientSummary {
  id: string;
  name: BilingualText;
  matterCount: number;
  activeMatters: number;
  updatedAt: string;
}

export interface TimelineEventRow {        // timeline list rows (virtualized above 200 — P19)
  id: string;
  matterId: string;
  kind: TimelineEvent['kind'];
  date: string;
  title: BilingualText;
  state: 'upcoming' | 'past' | 'completed' | 'outcome-due' | 'rescheduled';
  zone?: HearingCountdown['zone'];         // hearings only — the countdown column
  hasOutcome: boolean;                     // hearings only
  ruleName?: BilingualText;                // generated deadlines carry the rule that made them
  excerpt?: string;                        // bidi-isolated at render (rtl-rules §2)
}

export interface TimelineEventView {
  event: TimelineEvent;                    // 07a full shape
  outcome?: HearingOutcome;                // standing outcome, when present
  outcomeHistory: HearingOutcome[];        // correction chain, newest first
  countdown?: HearingCountdown;            // hearings only — derived (07c rule 1–2)
  generatedByRule?: DeadlineRule;          // generated deadlines
  sourceTrigger?: { eventId: string; title: BilingualText };   // e.g. the verdict that opened the window
  linkedDocuments: { documentId: string; title: BilingualText }[];   // filings/presentations
}

export interface HearingBoardRow {         // cross-matter hearing board (03 CP-2.1 — the daily docket)
  hearingEventId: string;
  matterId: string;
  matterTitle: BilingualText;
  caseNumber: string;
  date: string;
  daysUntil: number;
  zone: HearingCountdown['zone'];
  location?: string;
  judge?: BilingualText;
  prepDeadline?: { eventId: string; dueAt: string; completedAt?: string };   // nearest generated pre-hearing deadline
}

export interface DocumentSummary {
  id: string;
  matterId: string;
  title: BilingualText;
  kind: DocumentRecord['kind'];
  isOriginal: boolean;
  versionCount: number;
  chainLength: number;
  lastCustodyAction: CustodyEntry['action'];
  lastActivityAt: string;
  unreturnedOriginal: boolean;             // isOriginal && no 'returned' entry — closure-gate input
}

export interface DocumentView {
  document: DocumentRecord;                // full chain included (07a)
  versions: DocumentVersion[];
  verification?: ChainVerification;        // last verifyChain result for this document
}

export interface DeadlineRuleSummary extends DeadlineRule {}   // rules are their own summary (workspace-level asset)

export interface Job<T> {                  // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                  // async-contract §5
  matterId?: string;                       // link-to-context for the jobs console (04 S9)
}

// ---- Contract ----

export interface LegalCaseTrackerAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // matters
  listMatters(query: {
    filter?: {
      stage?: MatterSummary['stage'][];
      practiceArea?: MatterSummary['practiceArea'][];
      clientId?: string;
      urgencyZone?: HearingCountdown['zone'][];   // docket-home triage: matters whose next hearing is in-zone
      hasOverdue?: boolean;                       // matters with outcome-due hearings
    };
    search?: string;                             // normalized bilingual search over titles/case numbers/courts (rtl-rules §4)
    sort: 'nextHearing' | 'updatedAt' | 'caseNumber' | 'title';
    cursor?: string; limit: number;              // virtualized surface: cursor pages ≤ 100
  }): Promise<Result<Page<MatterSummary>, AdapterError>>;
  createMatter(input: {
    clientId: string;
    title: BilingualText;                        // both languages required — VALIDATION on empty either side
    caseNumber: string;
    court: BilingualText;
    practiceArea: Matter['practiceArea'];
    parties: PartyRef[];
    teamMemberIds?: string[];
    firstHearing?: { date: string; location?: string; judge?: BilingualText };   // optional at intake (03 CP-1.4)
    stockRulesOn?: boolean;                      // workspace default otherwise (07a Workspace)
  }): Promise<Result<MatterView, AdapterError>>;
  getMatter(id: string): Promise<Result<MatterView, AdapterError>>;
  updateMatter(id: string, patch: {
    title?: BilingualText;
    court?: BilingualText;
    practiceArea?: Matter['practiceArea'];
    stage?: 'intake' | 'active' | 'suspended';   // stage 'closed' ONLY via closeMatter (gate) — VALIDATION here
    parties?: PartyRef[];
    teamMemberIds?: string[];
    baseVersion: number;                         // stale -> CONFLICT with both payloads
  }): Promise<Result<MatterView, AdapterError>>;
  closeMatter(input: {
    matterId: string;
    acknowledgeBlockers: false;                  // literal type: the gate NEVER passes with blockers (07a state obligation)
  }): Promise<Result<ClosureRecord, AdapterError>>;

  // clients
  listClients(query: {
    search?: string;                             // normalized bilingual search over client names (rtl-rules §4)
    sort: 'name' | 'matterCount' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ClientSummary>, AdapterError>>;
  createClient(input: {
    name: BilingualText;                         // both languages required
    contact?: string;
    notes?: string;
  }): Promise<Result<ClientSummary, AdapterError>>;
  getClient(id: string): Promise<Result<ClientSummary & { matters: MatterSummary[] }, AdapterError>>;
  updateClient(id: string, patch: {
    name?: BilingualText;
    contact?: string;
    notes?: string;
    baseUpdatedAt: string;                       // stale -> CONFLICT with both payloads
  }): Promise<Result<ClientSummary, AdapterError>>;

  // timeline events (the matter chronicle)
  listTimelineEvents(query: {
    matterId: string;
    filter?: {
      kind?: TimelineEventRow['kind'][];
      state?: TimelineEventRow['state'][];
      zone?: HearingCountdown['zone'][];         // hearings only — the docket triage filter
      dateFrom?: string; dateTo?: string;
    };
    search?: string;                             // normalized match inside titles/notes
    sort: 'date' | 'createdAt';
    cursor?: string; limit: number;              // virtualized surface: cursor pages ≤ 100
  }): Promise<Result<Page<TimelineEventRow>, AdapterError>>;
  createTimelineEvent(input: {
    matterId: string;
    kind: 'hearing' | 'deadline' | 'filing' | 'note' | 'custom';
    date: string;
    title: BilingualText;
    notes?: string;
    hearing?: { location?: string; judge?: BilingualText };
    filing?: { direction: 'outbound' | 'inbound'; documentId?: string };
    custom?: { subtype?: string };
  }): Promise<Result<TimelineEventView, AdapterError>>;   // hearing-created rules fire here (07c rule 4)
  getTimelineEvent(id: string): Promise<Result<TimelineEventView, AdapterError>>;
  updateTimelineEvent(id: string, patch: {
    title?: BilingualText;
    notes?: string;
    reschedule?: { toDate: string; reason: string };      // reason REQUIRED -> VALIDATION without it (07a history)
    baseVersion: number;                                  // stale -> CONFLICT with both payloads
  }): Promise<Result<TimelineEventView, AdapterError>>;
  recordHearingOutcome(input: {
    hearingEventId: string;
    kind: HearingOutcome['kind'];
    summary: BilingualText;                               // both languages required
    scheduledNextHearing?: { date: string; location?: string };   // 'adjourned' typically carries it — creates the next hearing deterministically
    correctionOfOutcomeId?: string;                       // correction grammar: appends, supersedes — never edits (07a)
  }): Promise<Result<TimelineEventView, AdapterError>>;
  completeDeadlineEvent(input: {
    deadlineEventId: string;
    note?: string;
  }): Promise<Result<TimelineEventView, AdapterError>>;   // completion is a fact: completedAt + completedBy (07a)

  // the hearing board (cross-matter daily docket — 03 CP-2.1)
  listHearingBoard(query: {
    withinDays?: number;                          // default 30; the board's horizon
    filter?: { zone?: HearingCountdown['zone'][]; practiceArea?: Matter['practiceArea'][]; attorneyMemberId?: string };
    sort: 'date' | 'zone';
    cursor?: string; limit: number;
  }): Promise<Result<Page<HearingBoardRow>, AdapterError>>;

  // deadline rules (the deterministic engine's parameters — workspace-level)
  listDeadlineRules(query: {
    filter?: { active?: boolean; stock?: boolean; triggerKind?: string[] };
    sort: 'name' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<DeadlineRuleSummary>, AdapterError>>;
  saveDeadlineRule(input: {
    rule: Omit<DeadlineRule, 'version' | 'createdAt' | 'updatedAt'> & { id?: string };
    baseVersion?: number;                         // stale -> CONFLICT with both payloads; edit regenerates FUTURE generated deadlines only (07a)
  }): Promise<Result<DeadlineRuleSummary, AdapterError>>;
  deleteDeadlineRule(input: {
    ruleId: string;
    confirm: { openGeneratedDeadlines: number };  // P04 level-2: UI names the rule + its open generated deadlines
  }): Promise<Result<{ deletedRuleId: string }, AdapterError>>;

  // documents & the custody chain
  registerDocument(input: {
    matterId: string;
    title: BilingualText;
    kind: DocumentRecord['kind'];
    isOriginal: boolean;
    originator: PartyRole;
    firstVersion: {
      label?: BilingualText;
      contentFingerprint: string;                 // declared digest of the uploaded/pasted bytes (07c computes fixed values)
      sizeBytes?: number;
    };
    receivedFrom?: string;                        // free-form provenance note on the 'received' entry
    idempotencyKey: string;                       // async-contract §5 — double-submit never double-registers
  }): Promise<Result<DocumentView, AdapterError>>;   // chain seeds 'registered' (+ 'received' first when isOriginal)
  addDocumentVersion(input: {
    documentId: string;
    label?: BilingualText;
    contentFingerprint: string;
    sizeBytes?: number;
  }): Promise<Result<DocumentView, AdapterError>>;    // appends to lineage + 'version-added' chain entry
  listDocuments(query: {
    matterId: string;
    filter?: { kind?: string[]; isOriginal?: boolean; unreturnedOnly?: boolean };
    search?: string;                              // normalized bilingual search over titles (rtl-rules §4)
    sort: 'lastActivityAt' | 'title' | 'chainLength';
    cursor?: string; limit: number;
  }): Promise<Result<Page<DocumentSummary>, AdapterError>>;
  getDocument(id: string): Promise<Result<DocumentView, AdapterError>>;
  addCustodyEntry(input: {
    documentId: string;
    action: CustodyEntry['action'];
    note?: string;
    location?: string;
    versionId?: string;                           // version-scoped actions require their version
    linkedEventId?: string;                       // 'presented' requires the hearing event
  }): Promise<Result<DocumentView, AdapterError>>;    // seq = last + 1, append-only (07a)
  sealDocumentVersion(input: {
    versionId: string;
  }): Promise<Result<DocumentView, AdapterError>>;    // appends 'sealed' chain entry; sealing a sealed version -> CONFLICT
  verifyChain(input: {
    documentId: string;
  }): Promise<Result<ChainVerification, AdapterError>>;   // recomputes per-entry fingerprints (07c rule 6)

  // accountability & delivery
  listActivity(query: {
    matterId?: string;
    filter?: { actorMemberId?: string; action?: string[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntry>, AdapterError>>;   // P17 — keyboard-navigable, exportable (a11y-baseline §7)
  exportMatterPackage(input: {
    matterId: string;
    formats: ('matter-timeline' | 'custody-ledger' | 'deadline-report')[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: ('matter-timeline' | 'custody-ledger' | 'deadline-report')[];
  }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; matterId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    exportPackages: number;
    resetAt: string;
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export interface BilingualText {
  ar: string;                              // authored, never machine-filled; renders RTL in its field container (05)
  en: string;                              // authored, never machine-filled; renders LTR
}

// ---- Workspace & policy defaults ----
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;                  // chrome direction default; either direction is a full citizen (05)
  deadlinePolicyDefaults: {
    defaultRulesOn: boolean;              // seed the stock rule set on matter creation when true
    weekendShift: 'none' | 'next-business-day';   // deadline landing on Fri/Sat moves per declared rule
  };
  custodyPolicyDefaults: {
    requireOriginalTracking: boolean;     // closure gate checks unreturned originals when true
  };
}

// ---- Clients & parties ----
export interface Client {
  id: string;
  workspaceId: string;
  name: BilingualText;                    // e.g. ar "شركة المراعي التجارية" / en "Marafi Trading Co."
  contact?: string;                       // free-form reference (phone/email kept at the firm's discretion)
  notes?: string;
  matterCount: number;                    // derived at read
  createdAt: string;
  updatedAt: string;
}
export type PartyRole = 'client' | 'opposing' | 'co-counsel' | 'court' | 'other';
export interface PartyRef {
  role: PartyRole;
  name: BilingualText;                    // court names, opposing counsel, co-counsel — bilingual by construction
  externalRef?: string;                   // plain-text reference out of the product (e.g. a contract registry id) — LOOP-3 boundary artifact
}

// ---- Matters ----
export type PracticeArea = 'commercial' | 'labor' | 'real-estate' | 'family' | 'criminal' | 'civil' | 'other';
export type MatterStage = 'intake' | 'active' | 'suspended' | 'closed';
export interface Matter {
  id: string;
  workspaceId: string;
  clientId: string;
  title: BilingualText;                   // the firm's working title, both languages authored (00: no auto-translation)
  caseNumber: string;                     // court case number, Latin storage, physical order stable in both directions (rtl-rules §4)
  court: BilingualText;                   // e.g. ar "المحكمة التجارية بالرياض" / en "Riyadh Commercial Court"
  practiceArea: PracticeArea;
  stage: MatterStage;
  parties: PartyRef[];
  teamMemberIds: string[];
  openedAt: string;                       // Gregorian ISO (storage); display dual-calendar (05)
  closedAt?: string;                      // present iff stage = 'closed'
  closure?: ClosureRecord;                // present iff stage = 'closed' (immutable once written)
  counts: {                               // derived at read — never authoritative storage
    events: number;
    upcomingHearings: number;             // scheduled hearings with date >= today
    overdueHearings: number;              // past hearings with no outcome recorded (outcome-due, 07c rule)
    openDeadlines: number;                // deadline events not completed
    documents: number;
    unreturnedOriginals: number;          // isOriginal docs with no 'returned' chain entry
  };
  version: number;                        // stage/party/team edits re-version; CONFLICT base for updateMatter
  createdAt: string;
  updatedAt: string;
}

// ---- Timeline events (one base, five kinds) ----
export type TimelineKind = 'hearing' | 'deadline' | 'filing' | 'note' | 'custom';
export interface TimelineEventBase {
  id: string;
  matterId: string;
  kind: TimelineKind;
  date: string;                           // Gregorian ISO date; dual-calendar display (05)
  title: BilingualText;
  notes?: string;
  actorMemberId: string;                  // who created it (P17 chain)
  createdAt: string;
  updatedAt: string;
  version: number;                        // CONFLICT base for updateTimelineEvent
}
export type RescheduleRecord = {
  fromDate: string;
  toDate: string;
  reason: string;                         // required — adjournments are facts with history, never silent edits
  actorMemberId: string;
  at: string;
};
export type HearingOutcomeKind = 'adjourned' | 'verdict' | 'ruling' | 'dismissed' | 'other';
export interface HearingOutcome {
  id: string;
  hearingEventId: string;
  kind: HearingOutcomeKind;
  summary: BilingualText;                 // what the court decided, in both languages, authored
  scheduledNextHearing?: {                // 'adjourned' typically carries the next date (CP-2.5)
    date: string;
    location?: string;
  };
  correctionOf?: string;                  // outcome corrections APPEND a referencing record — never edit history (house grammar)
  supersededBy?: string;                  // set when a correction exists; the standing outcome is the un-superseded one
  actorMemberId: string;
  at: string;
}
export interface HearingEvent extends TimelineEventBase {
  kind: 'hearing';
  location?: string;                      // courtroom / chamber
  judge?: BilingualText;
  rescheduleHistory: RescheduleRecord[];  // append-only; the event's date is always the CURRENT date
  outcomeId?: string;                     // standing outcome (un-superseded); absent until recorded
}
export interface DeadlineEvent extends TimelineEventBase {
  kind: 'deadline';
  ruleId?: string;                        // generated deadlines carry the rule that made them (audit chain)
  sourceTriggerEventId?: string;          // e.g. the verdict hearing that started an appeal window
  dueAt: string;
  completedAt?: string;                   // completion is a fact with actor + timestamp
  completedByMemberId?: string;
}
export interface FilingEvent extends TimelineEventBase {
  kind: 'filing';
  direction: 'outbound' | 'inbound';      // filed by us vs received from court/other party
  documentId?: string;                    // plain link into the document chain (LOOP-10: abstract, no e-filing)
}
export interface NoteEvent extends TimelineEventBase {
  kind: 'note';
}
export interface CustomEvent extends TimelineEventBase {
  kind: 'custom';
  subtype?: string;                       // client meeting, site inspection, expert visit...
}
export type TimelineEvent =
  | HearingEvent | DeadlineEvent | FilingEvent | NoteEvent | CustomEvent;

// ---- The countdown (derived view — never stored) ----
export type CountdownZone = 'far' | 'near' | 'imminent' | 'today' | 'overdue';
export interface HearingCountdown {
  hearingEventId: string;
  matterId: string;
  daysUntil: number;                      // floor((date - today)) in days; negative iff past (07c rule 1)
  zone: CountdownZone;                    // pure function of daysUntil + outcome presence (07c rule 2)
  hasOutcome: boolean;                    // a past hearing WITH outcome is not overdue — it is history
}

// ---- Deadline rules (the deterministic engine's parameters) ----
export type DeadlineTrigger =
  | { kind: 'hearing-created' }                        // e.g. pre-hearing prep deadline at hearing date - N days
  | { kind: 'outcome-recorded'; outcomeKind: HearingOutcomeKind }  // e.g. appeal window at verdict date + N days
  | { kind: 'matter-opened' };                         // e.g. limitations check at intake + N days
export interface DeadlineRule {
  id: string;
  workspaceId: string;
  name: BilingualText;                    // e.g. ar "مهلة الاستئناف" / en "Appeal window"
  trigger: DeadlineTrigger;
  offsetDays: number;                     // signed: negative = before the anchor, positive = after
  minLeadDays: number;                    // a -3d prep deadline on a hearing 2 days out clamps to +1d (07c rule 4)
  appliesToPracticeAreas?: PracticeArea[];// rule scoped to practice areas; omitted = all
  active: boolean;                        // inactive rules stop generating; existing deadline events stay (history)
  stock: boolean;                         // seeded workspace defaults vs firm-authored rules
  version: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Documents & the custody chain ----
export type DocumentKind =
  | 'pleading' | 'evidence' | 'contract' | 'power-of-attorney'
  | 'correspondence' | 'court-decision' | 'other';
export interface DocumentVersion {
  id: string;
  documentId: string;
  seq: number;                            // 1..n in creation order; lineage is append-only
  label?: BilingualText;                  // e.g. "as filed" / "with translation"
  contentFingerprint: string;             // declared digest of the version's bytes (07c computes fixed values)
  sizeBytes?: number;
  storageRef: string;                     // abstract — the adapter never names a storage provider
  sealed: boolean;                        // sealed = immutable + chain-verified anchor (rule 6)
  createdAt: string;
}
export type CustodyAction =
  | 'received'              // original entered the firm's hands (from client/court/other party)
  | 'registered'            // logged into the product
  | 'version-added'         // new version appended to the lineage
  | 'sealed'                // version frozen — content anchored
  | 'checked-out'           // left the firm's custody (to hearing, to client, to translation)
  | 'checked-in'            // returned to the firm's custody
  | 'presented'             // shown/submitted at a hearing (event-linked)
  | 'returned'              // returned to originator — clears the closure gate's original-tracking check
  | 'annotated';            // free-form custody note (location, keeper, condition)
export interface CustodyEntry {
  seq: number;                            // chain position = previous + 1, append-only (07c rule 5)
  action: CustodyAction;
  actorMemberId: string;
  at: string;
  versionId?: string;                     // version-scoped actions carry the version
  linkedEventId?: string;                 // 'presented' carries the hearing event id
  note?: string;
  location?: string;                      // "safe A", "with counsel Layla", "court file"
}
export interface DocumentRecord {
  id: string;
  matterId: string;
  title: BilingualText;
  kind: DocumentKind;
  isOriginal: boolean;                    // originals are closure-gate-tracked when policy is on
  originator: PartyRole;                  // who the original belongs to (client/court/other)
  currentVersionId: string;
  chain: CustodyEntry[];                  // ordered by seq; NEVER rewritten (append-only contract)
  createdAt: string;
  updatedAt: string;
}
export interface ChainVerification {
  documentId: string;
  intact: boolean;
  verifiedEntryCount: number;
  firstBrokenSeq?: number;                // named when intact = false (failure injection, 07c)
  checkedAt: string;
}

// ---- Closure (the gate + the record) ----
export interface ClosureRecord {
  id: string;
  matterId: string;
  actorMemberId: string;
  at: string;
  matterVersion: number;                  // the exact state that was closed
  resolutionLedger: {
    outcomesRecorded: number;             // hearings that received outcomes over the matter's life
    deadlinesCompleted: number;
    documentsRegistered: number;
    originalsReturned: number;
  };
}

// ---- Async jobs, exports, activity ----
export type JobKind = 'export';
export type ExportFormat = 'matter-timeline' | 'custody-ledger' | 'deadline-report';
export interface ExportArtifact {
  id: string;
  matterId: string;
  formats: ExportFormat[];                // package parts; per-format retry on partial failure
  closedMatterVersion?: number;           // carries the closed state; flags later activity honestly
  expiresAt: string;                      // declared retention window at creation
  regenerable: boolean;                   // deterministic from matter state — always true in v1
}
export interface ActivityEntry {          // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'matter-created' | 'matter-updated' | 'matter-closed'
    | 'client-created' | 'client-updated'
    | 'event-created' | 'event-updated' | 'outcome-recorded' | 'outcome-corrected'
    | 'deadline-completed' | 'rule-saved' | 'rule-deleted'
    | 'document-registered' | 'version-added' | 'version-sealed'
    | 'custody-entry-added' | 'chain-verified'
    | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                        // e.g. adjournment reason, reschedule from→to — provenance audit
  at: string;
}

