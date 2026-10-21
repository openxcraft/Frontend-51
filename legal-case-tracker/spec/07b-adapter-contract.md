# 07b — Adapter Contract: legal-case-tracker (TypeScript, v1)

SME-G pass · `LegalCaseTrackerAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, Client, PartyRef, Matter, TimelineEvent/HearingEvent/DeadlineEvent/FilingEvent/NoteEvent/CustomEvent, HearingOutcome, RescheduleRecord, DeadlineRule, DocumentRecord, DocumentVersion, CustodyEntry, ChainVerification, ClosureRecord, HearingCountdown, ActivityEntry, Job, ExportArtifact): 07a. Every operation traces to ≥1 flow (03 coverage table — 32 operations, 0 orphans).

```ts
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
```

## Rules

1. **Determinism contract**: countdown zones, deadline generation, custody sequencing, and closure-gate evaluation implement exactly the rules specified in 07c — identical (event state, rule parameters, matter state, seeded clock) yield identical derived reads. The board, the matter gate, and the timeline zones are recomputed at read; nothing derived is ever stored and nothing stored is ever silently recomputed past history.
2. **Closure gate**: `closeMatter` with any scheduled future hearing, outcome-due hearing, open deadline, or (when policy tracks originals) unreturned original → VALIDATION whose `details` name every blocker (`gate.blockers` from the live MatterView). The `acknowledgeBlockers: false` literal makes gate bypass impossible at the type level. Successful closure writes an immutable ClosureRecord; any later mutation on the matter sets it back to `stage: 'active'` with a pending-activity flag — the record is never rewritten.
3. **Stale-version semantics**: `updateMatter` (baseVersion), `updateTimelineEvent` (baseVersion), `saveDeadlineRule` (baseVersion), and `updateClient` (baseUpdatedAt) → CONFLICT with both payloads in `details`. Sealing an already-sealed version → CONFLICT showing the sealing entry. Recording an outcome on a hearing that already has a standing outcome without `correctionOfOutcomeId` → CONFLICT naming the standing outcome (corrections are explicit, never silent overwrites).
4. **Role permissions**: viewer mutations of any kind → PERMISSION naming the seat's capability in capability language; deadline-rule save/delete → owner only; closeMatter/exportMatterPackage → owner or attorney; custody and document work → paralegal and above. Client-side viewers see the matter timeline and hearing dates of matters they are attached to, and nothing else (02 Hind).
5. **Consent enforcement**: document registration always names an abstract storage reference; no operation may expose or require a storage provider. The export delivery channel (08 N2) binds only through workspace consent — never assumed, never vendor-named (credential-contract §2/§4).
6. **Idempotency**: `registerDocument` and `exportMatterPackage` carry idempotency keys; a retried submit returns the original result (async-contract §5). Export progress is determinate in package parts — an indeterminate bar claiming percentage is a contract violation (async-contract §3).
7. **Outcome side-effects are structural**: `scheduledNextHearing` in `recordHearingOutcome` creates the next HearingEvent at write time; `hearing-created` deadline rules fire on it deterministically (07c rule 4). The returned view carries the new event, the recomputed countdown, and the outcome chain — the UI renders the returned state, never assumes it.
8. **Custody is append-only**: `addCustodyEntry` computes `seq = last + 1`; the adapter rejects (VALIDATION) any input implying an insertion point, a re-sequence, or an edit of existing entries; `verifyChain` recomputes the per-entry fingerprint table and names the first broken seq on failure. `deleteTermEntry`-style chain surgery does not exist on this contract by construction.
9. **Partial policies**: export delivers per-format partial with per-format retry (async-contract §4); matter reads are whole-state. `listHearingBoard` is a cross-matter derived read — pagination is stable per seeded clock tick, never mid-read re-sorted.
10. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (32/32).
