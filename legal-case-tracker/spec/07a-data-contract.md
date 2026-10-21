# 07a — Data Contract: legal-case-tracker

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — every computation in this product is a deterministic rule (countdown arithmetic on dates, deadline generation from rule parameters, custody-chain sequencing, closure-gate evaluation). There is no AI operation on the adapter, no AI capability any core workflow requires, and no AI affordance may appear in any surface (00/08: nothing degrades, because nothing is bound). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: package parts
  partial?: unknown;
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                 // async-contract §5 — double-submit never double-exports
  matterId?: string;                      // link-to-context for the jobs console (04 S9)
}

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
```

## Relationships

Workspace 1—N Client · Workspace 1—N Matter · Workspace 1—N DeadlineRule · Client 1—N Matter · Matter 1—N TimelineEvent (polymorphic on kind) · Matter 1—N DocumentRecord · DocumentRecord 1—N DocumentVersion (lineage append-only) · DocumentRecord 1—N CustodyEntry (append-only chain, seq contiguous from 1) · HearingEvent 1—0..N HearingOutcome (correction chain via correctionOf/supersededBy; exactly one standing outcome) · DeadlineEvent N—1 DeadlineRule (optional; generated deadlines always carry ruleId + sourceTriggerEventId) · DeadlineEvent N—1 TimelineEvent (source trigger, optional) · FilingEvent N—1 DocumentRecord (plain link) · CustodyEntry N—1 DocumentVersion/TimelineEvent (optional links) · Matter 1—0..1 ClosureRecord (immutable) · Matter 1—N ExportArtifact · Job spans export work.

## State obligations (lifecycle invariants)

- **Append-only custody chain**: `chain` is never rewritten — every custody action appends `seq = last + 1`; corrections or clarifications are new `'annotated'` entries, never edits. A chain with a seq gap or a mutated entry fails `verifyChain` with the first broken seq named.
- **Sealed versions are immutable**: once `sealed`, a DocumentVersion's fingerprint, label, and storageRef never change; new content requires a NEW version in the lineage (the chain records `version-added` then `sealed`).
- **Outcomes are facts with history**: `recordHearingOutcome` writes a HearingOutcome; corrections append a new outcome referencing `correctionOf` and set `supersededBy` on the old one — the standing outcome is always the un-superseded one; nothing is silently rewritten. An outcome with `scheduledNextHearing` creates the next HearingEvent at write time (deterministic side-effect, surfaced in the returned view).
- **Reschedules are facts with history**: moving a hearing appends a RescheduleRecord (reason required) and updates the event's date; the history array is append-only.
- **Past hearings without outcomes are outcome-due**: a HearingEvent whose date < today and with no standing outcome counts in `overdueHearings` and blocks closure (zone `overdue`, 07c rule 2) — the product never silently assumes a hearing happened or did not.
- **Deadline generation is deterministic and forward-only**: rules generate deadline events from their triggers (07c rule 4); editing/deactivating a rule regenerates only FUTURE generated deadlines — completed or past deadline events are history and stay.
- **Closure is a gate, not a checkbox** (07c rule 7): `closeMatter` succeeds only with zero scheduled future hearings, zero outcome-due hearings, zero open deadlines, and — when `requireOriginalTracking` — zero unreturned originals; success writes an immutable ClosureRecord; later mutations on a closed matter re-open it as `stage: 'active'` with a pending-activity flag while the ClosureRecord stays untouched.
- **Countdown is derived, never stored**: `HearingCountdown` is a pure function of (event date, standing outcome, the seeded clock) — recomputed at read, identical for identical state (the determinism contract, 07c rule 1–2).
- **No provider names anywhere** — documents reference storage through the abstract `storageRef`; export delivery is an abstract channel (08).
