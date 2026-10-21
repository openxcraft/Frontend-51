// VERBATIM from specs-source/helpdesk-triage-desk/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (SeverityPolicy,
// IntentCluster, ClusterAssignment, RoutingRule, Escalation, ExportArtifact —
// and their fields) are declared canonically in 07a and are part of this
// contract by reference; 07b declares only the operational wrappers
// (summaries, rows, views, jobs) its signatures need. AI declaration
// (ai-native-patterns §1): this product is CONDITIONALLY-AI — the single
// capability-touched operation is runClustering (the ticket-clustering
// assist, 08 N1); severity, routing, clocks, merges, and dispositions are
// deterministic rules and remain fully functional with the capability
// unbound (the 00 success-signal state).
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed intake fields, confirm-without-labels, escalate/route-without-required-reason, merge-state violations, disposition-on-closed, policy sanity)
 * 'NOT_FOUND'    -> NotFoundError     (stale ticket/cluster/queue/rule/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (viewer mutations, capability-consent gates, cross-workspace access)
 * 'CONFLICT'     -> ConflictError     (concurrent ticket edits, cluster/policy/rule/queue edits, bulk count drift)
 * 'RATE_LIMIT'   -> RateLimitError    (clustering-assist runs, export packages)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact retrieval)
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
  role: 'owner' | 'triager' | 'responder' | 'viewer';  // viewer: read + artifact retrieval only; responder: acknowledge/log/disposition; triager/owner: full triage
  locale: 'ar' | 'en';                    // chrome direction; ticket bodies always render at their own detected direction (05)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export type Locale = 'ar' | 'en';
export type TicketLanguage = 'ar' | 'en' | 'mixed';
export type SeverityTier = 'P1' | 'P2' | 'P3' | 'P4';

export interface TicketRow {                 // queue rows (virtualized above 200 — P19)
  id: string;
  number: string;                            // "TK-0142" — bidi-isolated Latin token
  subjectExcerpt: string;                    // bidi-isolated at render; truncation at word boundaries
  language: TicketLanguage;
  languageOverridden: boolean;
  severity: SeverityTier;
  severityOverridden: boolean;
  clusterId?: string;
  clusterLabelEn?: string;
  clusterLabelAr?: string;
  assignmentMethod?: 'rule-match' | 'assist-proposal' | 'confirmed-cluster' | 'manual';
  queueId?: string;
  state: 'new' | 'clustered' | 'routed' | 'acknowledged' | 'pending-requester' | 'closed';
  sla: {
    firstResponse: 'running' | 'at-risk' | 'breached' | 'met' | 'paused';
    firstResponseDueAt: string;
    resolution: 'running' | 'at-risk' | 'breached' | 'met' | 'paused';
    resolutionDueAt: string;
  };
  requesterTier: 'standard' | 'priority' | 'key-account';
  receivedAt: string;
  updatedAt: string;
}

export interface TicketView {                // ticket detail payload
  ticket: Ticket;                            // 07a full shape (language, severity with signals, revision)
  currentAssignment?: ClusterAssignment;
  assignmentHistory: ClusterAssignment[];
  currentRouting?: RoutingDecision;
  routingHistory: RoutingDecision[];
  escalations: Escalation[];
  responseLogs: ResponseLog[];
  disposition?: Disposition;
  notes: TicketNote[];
  activity: ActivityEntry[];
  mergeChildren?: { number: string; closedAt: string }[];
}

export interface ClusterSummary {
  id: string;
  labelEn: string;
  labelAr: string;
  status: 'proposed' | 'confirmed' | 'archived';
  provenance: 'rules' | 'assist';
  ticketCount: number;
  languageMix: { ar: number; en: number; mixed: number };
  version: number;
  sample: boolean;
  updatedAt: string;
}

export interface ClusterView extends ClusterSummary {
  signatureTerms: { ar: string[]; en: string[] };
  matchThreshold: number;
  memberTickets: {
    ticketId: string;
    number: string;
    subjectExcerpt: string;
    language: TicketLanguage;
    assignmentMethod: ClusterAssignment['method'];
    matchedTerms?: string[];
    confidence?: number;                     // assist-proposal rows only, deterministic band (07c rule 5)
  }[];
}

export interface SlaOverview {
  range: { from: string; to: string };
  bySeverity: Record<SeverityTier, {
    open: number;
    atRisk: number;
    breached: number;
    firstResponseMetRate: number;            // derived; counts, never surveyed (no CSAT — LOOP-10)
    resolutionMetRate: number;
  }>;
  hotList: { ticketId: string; number: string; severity: SeverityTier; worstClock: 'first-response' | 'resolution'; dueAt: string; queueId?: string; subjectExcerpt: string }[];
  breachLedger: { ticketId: string; number: string; severity: SeverityTier; clockKind: 'first-response' | 'resolution'; breachedAt: string; timeline: { at: string; event: string; detail?: string }[] }[];
}

export interface RoutingRuleSummary {        // S6 console rows
  id: string;
  name: string;
  order: number;
  active: boolean;
  version: number;
  queue: { id: string; nameEn: string; nameAr: string };
  conditions: RoutingRule['conditions'];
  updatedAt: string;
}

export interface QueueSummary {
  id: string;
  nameEn: string;
  nameAr: string;
  ownerMemberId: string;
  ownerMissing: boolean;                     // owner deactivated — a warning, never a blocker (03 CP-3 edge)
  capabilities: ('ar-capable' | 'en-capable')[];
  businessHours?: Queue['businessHours'];
  active: boolean;
  openTicketCount: number;
}

export interface MemberSummary {
  id: string;
  nameEn?: string;
  nameAr?: string;
  role: 'owner' | 'triager' | 'responder' | 'viewer';
  active: boolean;
}

export interface ChannelBindingView {
  id: string;
  kind: 'email-style' | 'web-form' | 'api-ingest';
  displayName: string;                       // capability language — never a vendor (credential-contract §2)
  health: 'unverified' | 'active' | 'failed' | 'revoked';
  verifiedAt?: string;
  lastFailure?: { at: string; code: string; correlationId: string };
  intakePaused: boolean;                     // health !== 'active' -> intake on this binding holds, paste unaffected
}

export interface ClusteringJobResult {
  engine: 'keyword-rules' | 'keyword-rules+assist';   // the honest label on every result (08)
  scopedTickets: number;
  ruleAssignments: number;                   // method 'rule-match'
  assistProposals: { clusterIds: string[]; assignments: number };  // all quarantined as 'proposed' (P15)
  unclustered: number;                       // honest residue — never nearest-matched
}

export interface ReassessmentJobResult {
  policyVersion: number;
  reassessed: number;
  severityChanged: number;
  routingReopened: number;                   // routes marked stale for re-commit — never silently re-routed
}

export interface BulkRouteResult {
  affectedTicketIds: string[];
  routed: number;
  skipped: { ticketId: string; reason: 'severity-critical' | 'state-closed' | 'filter-mismatch' }[];
}

export interface Job<T> {                    // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'clustering' | 'severity-reassessment' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                    // async-contract §5
  createdAt: string;
}

// ---- Contract ----

export interface HelpdeskTriageAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // tickets & intake (paste = the LOOP-5 always-available path; channel intake is the bound-credential path — 08 N2)
  createTicket(input: {
    subject: string;
    body: string;
    requester: { nameEn?: string; nameAr?: string; tier: 'standard' | 'priority' | 'key-account'; email?: string };
    receivedAt: string;                      // back-datable for pasted stragglers (03 CP-1.3)
    channel?: { kind: 'email-style' | 'web-form' | 'api-ingest'; bindingId: string; channelMessageId: string };   // channelMessageId = idempotency anchor
    idempotencyKey: string;                  // async-contract §5 — double-paste never double-creates
  }): Promise<Result<TicketRow, AdapterError>>;
  listTickets(query: {
    filter?: {
      state?: TicketRow['state'][];
      severity?: SeverityTier[];
      language?: TicketLanguage[];
      clusterId?: string | 'unclustered';
      queueId?: string | 'unrouted';
      slaState?: ('at-risk' | 'breached')[];
      requesterTier?: ('standard' | 'priority' | 'key-account')[];
    };
    search?: string;                         // normalized bilingual search over subject/body/requester (rtl-rules §4)
    sort: 'severity-then-received' | 'received' | 'updatedAt';
    cursor?: string; limit: number;          // virtualized surface: cursor pages ≤ 100
  }): Promise<Result<Page<TicketRow>, AdapterError>>;
  getTicket(id: string): Promise<Result<TicketView, AdapterError>>;
  updateTicket(id: string, patch: {
    subject?: string;
    requester?: { tier?: 'standard' | 'priority' | 'key-account' };   // tier correction re-assesses severity live (03 CP-3 edge)
    languageOverride?: TicketLanguage;       // freezes detection — recorded with actor, never re-triggers (07a)
    baseRevision: number;                    // stale -> CONFLICT with both payloads
  }): Promise<Result<TicketView, AdapterError>>;

  // channel bindings (credentials of kind "message intake" — kind, not vendor)
  listChannelBindings(): Promise<Result<Page<ChannelBindingView>, AdapterError>>;
  createChannelBinding(input: {
    kind: 'email-style' | 'web-form' | 'api-ingest';
    displayName: string;
  }): Promise<Result<ChannelBindingView, AdapterError>>;
  verifyChannelBinding(id: string): Promise<Result<ChannelBindingView, AdapterError>>;
  // ^ explicit round-trip verification — success without exercising the capability is a never-event (credential-contract §7)
  revokeChannelBinding(id: string): Promise<Result<ChannelBindingView, AdapterError>>;

  // intent clustering (the conditionally-AI surface — engine label is part of every result)
  runClustering(input: {
    ticketIds?: string[];                    // omitted = all non-closed, non-archived-assignment tickets
    idempotencyKey: string;
  }): Promise<Result<Job<ClusteringJobResult>, AdapterError>>;
  listClusters(query: {
    filter?: { status?: ('proposed' | 'confirmed' | 'archived')[]; provenance?: ('rules' | 'assist')[]; minTicketCount?: number };
    search?: string;                         // normalized bilingual label search
    sort: 'ticketCount' | 'updatedAt' | 'label';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ClusterSummary>, AdapterError>>;
  getCluster(id: string): Promise<Result<ClusterView, AdapterError>>;
  saveCluster(input: {
    cluster: Omit<IntentCluster, 'version' | 'createdAt' | 'updatedAt'> & { id?: string };
    baseVersion?: number;                    // stale -> CONFLICT with both payloads
  }): Promise<Result<ClusterView, AdapterError>>;
  confirmCluster(input: {
    clusterId: string;                       // the P15 gate: proposed -> confirmed is ONLY reachable here (rule 3)
    labelEn?: string;                        // final label corrections at the gate itself (03 CP-2.3)
    labelAr?: string;
  }): Promise<Result<ClusterView, AdapterError>>;
  assignToCluster(input: {
    ticketId: string;
    clusterId: string;                       // manual placement; method 'manual', actor recorded
    retractCurrent: boolean;                 // explicit: the prior assignment retracts into history, never silently replaced
  }): Promise<Result<TicketView, AdapterError>>;

  // severity & SLA policy (deterministic; versioned; re-assessment reconciles forward)
  saveSeverityPolicy(input: {
    policy: Omit<SeverityPolicy, 'id' | 'workspaceId' | 'version' | 'at'>;
    baseVersion: number;                     // stale -> CONFLICT with both payloads
  }): Promise<Result<{ policyVersion: number }, AdapterError>>;
  runSeverityReassessment(input: {
    policyVersion: number;
    ticketIds?: string[];                    // omitted = all open tickets
    idempotencyKey: string;
  }): Promise<Result<Job<ReassessmentJobResult>, AdapterError>>;

  // queues, routing rules, routing decisions
  listQueues(query: {
    filter?: { activeOnly?: boolean; capability?: ('ar-capable' | 'en-capable')[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<QueueSummary>, AdapterError>>;
  saveQueue(input: {
    queue: Omit<Queue, 'id'> & { id?: string };
  }): Promise<Result<QueueSummary, AdapterError>>;
  listRoutingRules(query: {
    filter?: { activeOnly?: boolean; queueId?: string };
    sort: 'order' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<RoutingRuleSummary>, AdapterError>>;
  saveRoutingRule(input: {
    rule: Omit<RoutingRule, 'id' | 'version' | 'updatedAt'> & { id?: string };
    baseVersion?: number;                    // stale -> CONFLICT with both payloads
  }): Promise<Result<RoutingRuleSummary, AdapterError>>;
  routeTicket(input: {
    ticketId: string;
    queueId: string;
    method: 'rule' | 'manual';
    reason?: string;                         // REQUIRED when method = 'manual' -> VALIDATION without it (rule 8)
  }): Promise<Result<TicketView, AdapterError>>;
  bulkRouteTickets(input: {
    filter: { severity?: SeverityTier[]; clusterId?: string; state?: TicketRow['state'][] };
    queueId: string;
    confirmCount: number;                    // UI must echo the counted set (P04/P07 — the adapter verifies)
    comment?: string;
  }): Promise<Result<BulkRouteResult, AdapterError>>;

  // SLA loop: monitor, escalation, response logging, disposition
  getSlaOverview(query: { range: { from: string; to: string } }): Promise<Result<SlaOverview, AdapterError>>;
  escalateTicket(input: {
    ticketId: string;
    toSeverity?: SeverityTier;               // P2->P1 raises; a P1 escalates by re-routing only (03 CP-4 edge)
    toQueueId?: string;
    reason: string;                          // REQUIRED — an escalation without a reason is refused (rule 8)
  }): Promise<Result<TicketView, AdapterError>>;
  logTicketResponse(input: {
    ticketId: string;
    channelKind: 'email' | 'phone' | 'external-tool';   // where it actually went — kind, not vendor (00 LOOP-10)
    reference: string;
    sentAt: string;
  }): Promise<Result<TicketView, AdapterError>>;
  setTicketDisposition(input: {
    ticketId: string;
    kind: 'duplicate' | 'spam' | 'resolved-elsewhere' | 'pending-requester';
    note?: string;
    mergeFromTicketIds?: string[];           // 'duplicate' via merge (03 CP-5.1); children must be mergeable states
    confirm?: { spamAcknowledged: true };    // P04 level-2 literal for the one irreversible disposition
  }): Promise<Result<TicketView, AdapterError>>;

  // hygiene
  mergeTickets(input: {
    keeperTicketId: string;
    childTicketIds: string[];                // all must be new|clustered|routed (07a merge semantics)
  }): Promise<Result<TicketView, AdapterError>>;
  addTicketNote(input: {
    ticketId: string;
    body: string;                            // internal-only; export scope declared at export time
  }): Promise<Result<TicketView, AdapterError>>;

  // members (queue owners, escalation addressees)
  listMembers(query: {
    filter?: { role?: ('owner' | 'triager' | 'responder' | 'viewer')[]; activeOnly?: boolean };
    search?: string;                         // normalized bilingual name search
    cursor?: string; limit: number;
  }): Promise<Result<Page<MemberSummary>, AdapterError>>;

  // jobs, usage, export
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    clusteringRuns: number;                  // assist-engine runs metered (P14); keyword-only runs are free and unmetered
    exportPackages: number;
    resetAt: string;
  }, AdapterError>>;
  exportTriageLog(input: {
    range: { from: string; to: string };
    formats: ('triage-log' | 'cluster-digest' | 'sla-ledger')[];
    includeNotes: boolean;                   // declared at export time (03 CP-5.4)
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: ('triage-log' | 'cluster-digest' | 'sla-ledger')[];
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
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

