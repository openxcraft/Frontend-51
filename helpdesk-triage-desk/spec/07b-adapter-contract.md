# 07b — Adapter Contract: helpdesk-triage-desk (TypeScript, v1)

SME-G pass · `HelpdeskTriageAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, Member, ChannelBinding, Ticket, LanguageAssessment, SeverityAssessment/SeverityPolicy, IntentCluster, ClusterAssignment, Queue, RoutingRule, RoutingDecision, SlaClock, ResponseLog, Escalation, Disposition, TicketNote, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table — 34 operations, 0 orphans).

```ts
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
```

## Rules

1. **Determinism floor**: language detection, severity assessment, rule-match assignment, SLA clock computation, and routing-rule evaluation implement exactly the rules specified in 07c — identical inputs (ticket text, requester facts, policy version, cluster signature terms, rule set) yield identical outputs; every clustering result carries its `engine` label ('keyword-rules' | 'keyword-rules+assist') so no surface can misrepresent which engine produced a state.
2. **The P15 gate is type-structural**: a cluster reaches status `confirmed` ONLY via `confirmCluster`; `saveCluster` may author and edit but never confirms (proposals saved stay `proposed`); on confirm, the cluster's `assist-proposal` assignments flip to `confirmed-cluster` with the confirming actor recorded. Nothing promotes machine output to authoritative state silently.
3. **Version pinning**: assessments pin `policyVersion`; assignments pin `clusterVersion`; routing decisions pin `ruleVersion`. Edits (saveSeverityPolicy, saveCluster, saveRoutingRule) never retro-mutate historical records; reconciliation happens only through runSeverityReassessment (which re-opens routing for changed tickets — named, never silent) and runClustering (which re-computes assignments forward). Stale baseVersion/baseRevision on any edit → CONFLICT with both payloads.
4. **Bulk safety**: `bulkRouteTickets` verifies `confirmCount` against the live filtered set; drift → CONFLICT with the recounted set. Tickets at severity P1 and closed tickets in the set are skipped and named (`severity-critical` / `state-closed`) — bulk never moves critical or terminal state silently.
5. **Reason-required mutations**: `routeTicket` with `method: 'manual'` and `escalateTicket` without `reason` → VALIDATION naming the missing field. Overrides, escalations, and manual routes are records, not shouts — the reason is the audit artifact (02 Maysoon's ops-review answer).
6. **Idempotency**: createTicket (paste and channel alike), runClustering, runSeverityReassessment, and exportTriageLog carry idempotency keys; a retried submit returns the original result/job (async-contract §5). Channel intake additionally deduplicates on `channelMessageId` — a redelivered message returns the existing ticket, never a duplicate.
7. **Partial-result policies** (async-contract §4): clustering delivers per-ticket results — a failed assist run keeps delivered keyword assignments and marks the failed scope for per-ticket retry; re-assessment is per-ticket re-runnable (determinism makes re-runs safe); export delivers per-format partial with per-format retry.
8. **Role capabilities**: viewer → every mutation → PERMISSION naming the seat's capability in capability language; responder may `logTicketResponse`, `setTicketDisposition`, `addTicketNote`, and acknowledge-state transitions but not route/assign/confirm/escalate/policy edits; triager/owner carry the full triage surface. Capability-consent enforcement: channel-intake operations against an unconsented capability → PERMISSION naming the capability class (credential-contract §4); paste has no consent requirement, ever (LOOP-5).
9. **Merge and disposition semantics**: `mergeTickets` enforces the 07a merge contract (child states, history append, highest-severity survival, named absorbed set) and returns the keeper view with children listed; `setTicketDisposition` with `kind: 'spam'` requires the `confirm.spamAcknowledged` literal (P04 level-2 at the type level); disposition on a closed ticket → VALIDATION naming the standing disposition.
10. **Clocks are derived**: getSlaOverview and the sla fields on rows/views compute from event history per 07c rule 6 at read time — the adapter never stores clock state as authoritative truth, so the monitor can never disagree with the ticket ledger.
11. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (34/34).
