# 07a — Data Contract: helpdesk-triage-desk

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — exactly one capability may touch an AI: the abstract **ticket-clustering assist** (08 N1), which *proposes* clusters and assignments. The local engine (keyword rules over authored bilingual signature terms), the severity matrix, routing rules, SLA clocks, merges, dispositions, and every export are deterministic and never require the capability (the 00 success signals test that state). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';

// ---- Workspace, members, channels ----

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction default (either direction is a full citizen — 05)
  clockConvention: 'response-from-intake' | 'response-from-route';  // v1 default: response-from-intake; resolution always anchors to routedAt (12 Q-4)
}

export type MemberRole = 'owner' | 'triager' | 'responder' | 'viewer';

export interface Member {
  id: string;
  workspaceId: string;
  nameEn?: string;                    // bilingual sibling names — either may be present, never transliterated
  nameAr?: string;
  role: MemberRole;
  active: boolean;
}

export type ChannelKind = 'email-style' | 'web-form' | 'api-ingest';

export interface ChannelBinding {     // a credential of kind "message intake" (credential-contract §2 — kind, not vendor)
  id: string;
  workspaceId: string;
  kind: ChannelKind;
  displayName: string;                // capability language: "Order-support inbox", never a vendor
  health: 'unverified' | 'active' | 'failed' | 'revoked';
  verifiedAt?: string;                // set only by an explicit verify round-trip (credential-contract §7)
  lastFailure?: { at: string; code: string; correlationId: string };
  createdAt: string;
}

// ---- Tickets & intake ----

export type TicketLanguage = 'ar' | 'en' | 'mixed';
export type RequesterTier = 'standard' | 'priority' | 'key-account';

export interface Requester {
  nameEn?: string;                    // either/both scripts, bidi-isolated at render
  nameAr?: string;
  tier: RequesterTier;                // impact input to the severity matrix
  email?: string;
}

export interface LanguageAssessment {
  detected: TicketLanguage;           // deterministic script-ratio rule (07c rule 2) — never a model
  method: 'script-ratio';
  override?: {                        // human correction freezes detection — never re-triggers
    value: TicketLanguage;
    actorMemberId: string;
    at: string;
  };
}

export type TicketState =
  | 'new'                             // logged, assessed, not yet clustered/routed
  | 'clustered'                       // carries a current cluster assignment
  | 'routed'                          // carries a current routing decision (acknowledgment pending)
  | 'acknowledged'                    // a responder owns it
  | 'pending-requester'               // disposition paused the clock, awaiting the customer
  | 'closed';                         // terminal: duplicate | spam | resolved-elsewhere (dispositions below)

export interface Ticket {
  id: string;
  workspaceId: string;
  number: string;                     // "TK-0142" — Western digits, bidi-isolated token, physical order stable (rtl-rules §4)
  subject: string;                    // verbatim; body/subject render at detected direction
  body: string;                       // verbatim customer content — Arabic-Indic digits may appear HERE only (evidence, never chrome)
  requester: Requester;
  channel: { kind: ChannelKind; bindingId?: string } | { kind: 'manual' };
  channelMessageId?: string;          // idempotency anchor: a redelivered channel message never duplicates a ticket (07b rule 6)
  language: LanguageAssessment;
  severity: SeverityAssessment;
  receivedAt: string;                 // first-response clock anchor (v1 convention)
  state: TicketState;
  revision: number;                   // CONFLICT base for updateTicket
  createdAt: string;
  updatedAt: string;
}

// ---- Severity (deterministic, versioned, signal-naming) ----

export type SeverityTier = 'P1' | 'P2' | 'P3' | 'P4';

export type SignalClass =
  | 'requester-tier'                  // impact side: standard | priority | key-account
  | 'outage-term'                     // urgency side: outage/stop vocabulary present ('توقف', 'عطل', 'down', 'outage')
  | 'billing-term'                    // money vocabulary ('فاتورة', 'مبلغ', 'invoice', 'charge')
  | 'security-term'                   // compromise vocabulary ('اختراق', 'كلمة المرور', 'hacked', 'fraud')
  | 'multi-user'                      // breadth phrasing ('كل العملاء', 'all customers', 'multiple users')
  | 'howto-term';                     // guidance vocabulary ('كيف', 'how to', 'شرح')

export interface SeveritySignal {
  signalClass: SignalClass;
  evidence: string;                   // the matched term or fact, quoted verbatim — inspectability is the contract
  matched?: boolean;
}

export interface SeverityAssessment {
  severity: SeverityTier;
  signals: SeveritySignal[];          // every signal the matrix weighed, matched or not (the "why is this P2" answer)
  policyVersion: number;              // pin: the matrix version this was computed against
  at: string;
  overrides: {                        // human overrides append; they never rewrite the computed assessment
    severity: SeverityTier;
    reason: string;                   // REQUIRED — an override without a why is not recorded
    actorMemberId: string;
    at: string;
  }[];
}

export interface SeverityPolicy {
  id: string;
  workspaceId: string;
  version: number;                    // immutable once written; edits append a new version
  matrix: {                           // impact × urgency → severity (ITIL-style convention, 01 q4)
    impact: RequesterTier;
    urgency: 'outage' | 'security' | 'billing' | 'howto' | 'none';
    severity: SeverityTier;
  }[];
  urgencyKeywords: Record<SignalClass, { ar: string[]; en: string[] }>;  // the vocabulary the matcher runs (normalized, 07c rule 4)
  slaTargets: Record<SeverityTier, { firstResponseMinutes: number; resolutionHours: number }>;
  atRiskAtRatio: number;              // clock-elapsed/target ratio that flags at-risk (default 0.70)
  actorMemberId: string;
  at: string;
}

// ---- Intent clusters (bilingual; rules floor; assist proposals confirm-gated) ----

export type ClusterStatus = 'proposed' | 'confirmed' | 'archived';

export interface IntentCluster {
  id: string;
  workspaceId: string;
  labelEn: string;                    // both labels REQUIRED (bilingual by construction — the cross-language feature)
  labelAr: string;
  signatureTerms: { ar: string[]; en: string[] };  // the keyword-rule vocabulary (normalized at match, 07c rule 3)
  matchThreshold: number;             // distinct matched terms required (default 2)
  status: ClusterStatus;
  provenance: 'rules' | 'assist';     // assist-born clusters stay proposals until confirmed (P15)
  version: number;                    // assignments pin the version they were computed against
  sample: boolean;                    // seeded starter clusters carry the badge; never mix into exports unless included
  createdAt: string;
  updatedAt: string;
}

export type AssignmentMethod =
  | 'rule-match'                      // keyword engine; matchedTerms listed
  | 'assist-proposal'                 // capability proposal; confidence banded; NOT authoritative
  | 'confirmed-cluster'               // assignment inherited when its proposal's cluster was confirmed (P15 flip)
  | 'manual';                         // human placement; actor recorded

export interface ClusterAssignment {
  id: string;
  ticketId: string;
  clusterId: string;
  clusterVersion: number;             // pin — signature-term edits never retro-mutate assignments
  method: AssignmentMethod;
  matchedTerms?: string[];            // rule-match: the distinct terms that fired (both languages may appear)
  confidence?: number;                // assist-proposal only, deterministic band 0–1 (07c rule 5)
  actorMemberId?: string;             // manual assignments and confirmations name the actor
  at: string;
  retractedAt?: string;               // history is a chain — current assignment = latest non-retracted
}

// ---- Queues, routing rules, decisions ----

export type QueueCapability = 'ar-capable' | 'en-capable';

export interface Queue {
  id: string;
  workspaceId: string;
  nameEn: string;
  nameAr: string;
  ownerMemberId: string;
  capabilities: QueueCapability[];    // language routing: Arabic tickets reach ar-capable queues (02 Nora)
  businessHours?: { start: string; end: string; days: number[] };
  active: boolean;
}

export interface RoutingRule {
  id: string;
  workspaceId: string;
  name: string;                       // "R-04 Payments Arabic"
  order: number;                      // deterministic evaluation: lowest order first (07c rule 7)
  conditions: {
    severity?: SeverityTier[];
    clusterId?: string;
    language?: TicketLanguage[];
    requesterTier?: RequesterTier[];
  };
  queueId: string;
  active: boolean;                    // deactivate is reversible; rules are never deleted, only deactivated (07b rule 9)
  version: number;                    // decisions pin the rule version they executed
  actorMemberId: string;
  updatedAt: string;
}

export interface RoutingDecision {
  id: string;
  ticketId: string;
  queueId: string;
  method: 'rule' | 'manual';
  ruleId?: string;
  ruleVersion?: number;               // pin for rule-routed decisions
  suppressedMatches?: { ruleId: string; ruleName: string }[];  // named, never silent (07c rule 7)
  reason?: string;                    // REQUIRED for method 'manual' (07b rule 8)
  actorMemberId: string;
  at: string;                         // resolution-clock anchor (routedAt)
  supersededAt?: string;              // re-route supersedes with history kept — never overwritten
}

// ---- SLA clocks, responses, escalation ----

export type ClockKind = 'first-response' | 'resolution';
export type ClockState = 'running' | 'at-risk' | 'breached' | 'met' | 'paused';

export interface SlaClock {
  ticketId: string;
  kind: ClockKind;
  anchorAt: string;                   // first-response: receivedAt (v1 convention); resolution: latest routing decision's at
  target: { minutes: number };        // from the policy version in force at anchor (firstResponseMinutes / resolutionHours×60)
  policyVersion: number;
  state: ClockState;                  // derived from event history at read — clocks are never stored truth (07a obligations)
  atRiskAt: string;                   // anchor + target × atRiskAtRatio
  dueAt: string;                      // anchor + target
  metAt?: string;                     // response logged (first-response) / disposition closed (resolution)
  pausedAt?: string;                  // pending-requester disposition pauses the resolution clock
}

export interface ResponseLog {        // the no-live-chat boundary, modeled: references, not messages (00 LOOP-10)
  id: string;
  ticketId: string;
  channelKind: 'email' | 'phone' | 'external-tool';  // where the response ACTUALLY went — kind, not vendor
  reference: string;                  // the external reference the responder pastes
  sentAt: string;
  loggedBy: string;
  at: string;
}

export interface Escalation {
  id: string;
  ticketId: string;
  fromSeverity: SeverityTier;
  toSeverity?: SeverityTier;          // P2→P1 raises; an already-P1 re-routes without re-severity (03 CP-4 edge)
  toQueueId?: string;
  reason: string;                     // REQUIRED — an escalation without a why is a shout, not a record
  actorMemberId: string;
  notifyTier: 'instant' | 'digest';   // P21 ladder
  at: string;
}

// ---- Dispositions, notes, merges ----

export type DispositionKind = 'duplicate' | 'spam' | 'resolved-elsewhere' | 'pending-requester';

export interface Disposition {
  id: string;
  ticketId: string;
  kind: DispositionKind;
  note?: string;
  mergedFromTicketIds?: string[];     // duplicate: the children folded into the keeper (07c merge semantics)
  actorMemberId: string;
  at: string;
  reversedAt?: string;                // all kinds reversible EXCEPT spam (P04 level-2 confirm at action time)
}

export interface TicketNote {         // internal triage notes — never customer-facing, export scope declared at export time
  id: string;
  ticketId: string;
  body: string;
  actorMemberId: string;
  at: string;
}

// ---- Jobs, exports, activity ----

export type JobKind = 'clustering' | 'severity-reassessment' | 'export';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';  // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: tickets / tickets / formats
  partial?: unknown;                  // per-kind partial policy (07c)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;             // async-contract §5
  createdAt: string;
}

export type ExportFormat = 'triage-log' | 'cluster-digest' | 'sla-ledger';

export interface ExportArtifact {
  id: string;
  workspaceId: string;
  formats: ExportFormat[];
  range: { from: string; to: string };
  includeNotes: boolean;              // declared at export time (03 CP-5.4 boundary)
  expiresAt: string;                  // declared retention at creation
  regenerable: boolean;               // deterministic from triage state — always true in v1
}

export interface ActivityEntry {      // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'ticket-created' | 'language-overridden'
    | 'cluster-saved' | 'cluster-confirmed' | 'cluster-archived'
    | 'assigned-to-cluster' | 'clustering-run'
    | 'severity-overridden' | 'policy-saved' | 'reassessment-run'
    | 'routed' | 'bulk-routed' | 'routing-rule-saved'
    | 'escalated' | 'response-logged' | 'disposition-set' | 'merge-executed'
    | 'note-added' | 'binding-created' | 'binding-verified' | 'binding-revoked' | 'export-run';
  targetRef: string;
  detail?: string;                    // the named reason / matched terms / decision trace — provenance audit
  at: string;
}
```

## Relationships

Workspace 1—N Member · Workspace 1—N ChannelBinding · Workspace 1—N Queue · Workspace 1—N RoutingRule (versioned) · Workspace 1—N IntentCluster (versioned) · Workspace 1—N SeverityPolicy (version chain) · Workspace 1—N Ticket · Ticket 1—1 LanguageAssessment (embedded, override-appended) · Ticket 1—1 SeverityAssessment (embedded, override-appended) · Ticket 1—N ClusterAssignment (chain via retractedAt; current = latest non-retracted) · Ticket 1—N RoutingDecision (chain via supersededAt; current = latest non-superseded) · Ticket 1—2 SlaClock (first-response, resolution — derived reads) · Ticket 1—N ResponseLog · Ticket 1—N Escalation · Ticket 0..1 Disposition (terminal; reversals append) · Ticket 1—N TicketNote · IntentCluster 1—N ClusterAssignment (assignments pin clusterVersion) · RoutingRule 1—N RoutingDecision (decisions pin ruleVersion) · Queue 1—N RoutingDecision · Job spans clustering/re-assessment/export work · Workspace 1—N ExportArtifact · every consequential mutation appends ActivityEntry.

## State obligations

- **Determinism contract**: identical (ticket text, requester facts, policy version, cluster signature terms) always yields identical language detection, severity assessment, and rule-match assignments — the mock's own test oracle (07c). Language detection and severity are NEVER model outputs; the only non-deterministic-adjacent surface is the assist's proposal stream, which is quarantined behind `proposed` status and `assist-proposal` assignments until a human confirms (P15).
- **Version pinning**: SeverityAssessment pins `policyVersion`; ClusterAssignment pins `clusterVersion`; RoutingDecision pins `ruleVersion` — edits to policy/terms/rules never retro-mutate historical assessments/assignments/decisions; re-assessment and re-clustering reconcile forward (03 CP-6.2, CP-2.6).
- **The confirm gate is structural**: a cluster reaches `confirmed` ONLY through `confirmCluster` (07b); assignments flip `assist-proposal` → `confirmed-cluster` at that moment, with actor recorded. Nothing else promotes a proposal; `archived` returns members to honest `unclustered`, never a hidden reassign.
- **Language override freezes detection**: once a human overrides, the assessment records it and detection never re-runs on that ticket (the operator's correction is authoritative for that record).
- **SLA clocks are derived, never stored truth**: state is computed from event history (receivedAt, routing decisions, response logs, disposition events, pause events) at read; the monitor can therefore never disagree with the ticket ledger (02 Faisal's Friday-sheet problem answered structurally). First-response anchors to `receivedAt` under the v1 `clockConvention`; resolution anchors to the current routing decision's `at`.
- **Merge semantics**: only `new`/`clustered`/`routed` tickets merge; children close with disposition `duplicate` + `mergedFromTicketIds`; histories (assignments, notes, response logs) append to the keeper; the highest severity in the set survives on the keeper and the merge record names the absorbed set; keeper's cluster membership stands.
- **Spam is a state, not a deletion**: spam tickets stay queryable with full records; the disposition is irreversible past its P04 level-2 confirm (all other dispositions reversible by appending a reversal).
- **Idempotent intake**: `channelMessageId` deduplicates redelivered channel messages; manual paste carries no dedupe obligation (the actor is the dedupe).
- **No provider names anywhere** — channels appear as `ChannelKind` values and abstract needs in 08; response logs name kinds (`email`, `phone`, `external-tool`), never vendors.
