// VERBATIM from specs-source/funnel-drop-off-explorer/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// ===== Foundation (shared contract shapes) =====
// Error taxonomy — the portfolio-standard 7 classes:
//   ValidationError | NotFoundError | PermissionError | ConflictError
//   | RateLimitError | NetworkError | UnknownError
// mapped onto the 7-token ErrorCode union below. Every failure in this
// product resolves to exactly one of these classes (03 failure-mode table).
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;                       // developer-facing; user copy comes from the 11 matrix
  correlationId: string;                 // surfaces in UnknownError user copy (copy-voice §1.4)
  retryable: boolean;
  details?: Record<string, string[]>;    // field/row/rule → issues (ValidationError names the failed rule)
}

// Auth-agnostic session: implementations resolve identity however their
// environment dictates (enterprise SSO, email-link, workspace pin — 08 N5).
// The UI never sees a provider. The session also carries the workspace's
// default anneal policy so launchers open with it (03 design note (b)).
export interface Session {
  userId: string;
  workspaceId: string;
  role: 'analyst' | 'admin' | 'viewer';
  locale: 'en' | 'ar';
  displayName: string;
  defaultAnnealPolicy: {
    minSupportOverride: number | null;    // null → floor formula max(30, ceil(0.02 × N))
    epsilon: number;                      // seeded 0.02
    depthCap: number;                     // seeded 4 (hard cap 8 — VALIDATION above)
    excludedAxes: string[];
    version: number;
  };
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export interface CursorQuery<F, S> {
  filter?: F;
  sort: S;
  sortDir: 'asc' | 'desc';
  search?: string;   // Arabic-normalized server-side (rtl-rules §4: alef/taa-marbuta/yaa variants, tashkeel stripped)
  cursor?: string;
  limit: number;     // ≤ 50 (10 data-path rule)
}

// ===== Domain types (mirror 07a; entity contracts live there) =====
export type Role = 'analyst' | 'admin' | 'viewer';
export type EventStatus = 'proposed' | 'active' | 'deprecated';
export type OrderingMode = 'sequential' | 'strict' | 'any';
export type FunnelStatus = 'draft' | 'active' | 'archived';

export interface UserSummary {
  id: string; displayName: string; role: Role; locale: 'en' | 'ar';
  status: 'active' | 'suspended'; joinedAt: string;
}

export interface TaxonomyEventSummary {
  id: string; canonicalName: string; labelEn: string; labelAr: string;
  status: EventStatus; active: boolean; ownerUserId: string | null;
  propertyCount: number; segmentablePropertyCount: number;
  observedCount: number; usedByFunnelCount: number;
  version: number; updatedAt: string;
}

export interface TaxonomyEventDetail extends TaxonomyEventSummary {
  descriptionEn: string | null; descriptionAr: string | null;
  properties: { name: string; type: string; segmentable: boolean; enumValues: string[] | null;
                labelEn: string; labelAr: string }[];
  usedByFunnels: { funnelId: string; funnelName: string; stepOrders: number[] }[];
  lint: { rule: string; severity: 'error' | 'warn'; detailEn: string; detailAr: string }[];
}

export interface TaxonomyLintReport {
  generatedAt: string;
  totalViolations: number;
  errorCount: number; warnCount: number;
  groups: { rule: string; labelEn: string; labelAr: string;
            violations: { eventId: string; canonicalName: string; severity: 'error' | 'warn';
                          detailEn: string; detailAr: string }[] }[];
}

export interface EventSourceDTO {
  id: string; kindLabel: string;
  health: 'unverified' | 'active' | 'expiring-soon' | 'expired' | 'failed';
  lastFreshAt: string | null;
  coverageNoteEn: string | null; coverageNoteAr: string | null;
}

export interface FunnelSummary {
  id: string; name: string; status: FunnelStatus; stepCount: number;
  conversionWindowHours: number; orderingMode: OrderingMode; version: number;
  latestHeadline: { overallConversionRate: number | null; entryUsers: number | null;
                    freshness: 'fresh' | 'stale' | 'coverage-gap' | 'never-computed';
                    computedAt: string | null } | null;
  updatedByUserId: string; updatedAt: string;
}

export interface FunnelDetail extends FunnelSummary {
  descriptionEn: string | null; descriptionAr: string | null;
  steps: { order: number; eventId: string; canonicalName: string; labelEn: string; labelAr: string;
           status: EventStatus;
           eventFilters: { property: string; op: string; value: string }[] }[];
  globalFilters: { property: string; op: string; value: string }[];
}

export interface ComputationBasisDTO {
  sourceId: string; sourceKindLabel: string;
  rangeStart: string; rangeEnd: string;
  conversionWindowHours: number; orderingMode: OrderingMode;
  funnelVersion: number; taxonomyVersion: number;
  computedAt: string; freshness: 'fresh' | 'stale' | 'coverage-gap';
  coverageDays: number | null;
}

export interface StepMetricsDTO {
  order: number; eventId: string; canonicalName: string; labelEn: string; labelAr: string;
  usersCompleted: number; stepConversionRate: number;
  droppedFromPrior: number; dropOffRate: number;
  medianTransitionMinutes: number | null; p90TransitionMinutes: number | null;
}

export interface FunnelMetricsDTO {
  id: string; funnelId: string; basis: ComputationBasisDTO;
  entryUsers: number; overallConversionRate: number; totalConverted: number;
  largestDropOffStep: number | null; largestDropOffCount: number | null;
  slowestStep: number | null;
  steps: StepMetricsDTO[];
}

export interface TrendPointDTO { windowStart: string; windowEnd: string; entryUsers: number; converted: number; conversionRate: number; }

export interface BreakdownRowDTO {
  axis: string; axisLabelEn: string; axisLabelAr: string; value: string;
  size: number; dropped: number; dropOffRate: number;
  deltaVsBaseline: number; separation: number;
}

export interface DisplacedPathDTO {
  eventId: string | null; canonicalName: string | null; labelEn: string | null; labelAr: string | null;
  users: number; shareOfLost: number;
}

export interface TransitionDetailDTO {
  id: string; funnelId: string; seamIndex: number; basis: ComputationBasisDTO;
  priorStepUsers: number; nextStepUsers: number; lostUsers: number; baselineDropOffRate: number;
  timeDistribution: { bucketLabelEn: string; bucketLabelAr: string; users: number }[];
  medianTransitionMinutes: number | null; p90TransitionMinutes: number | null;
  displacedPaths: DisplacedPathDTO[];
}

export interface AnnealPolicyInput {
  minSupportOverride: number | null;
  epsilon: number;          // > 0 — VALIDATION otherwise
  depthCap: number;         // 1–8 — VALIDATION otherwise
  excludedAxes: string[];
}

export interface AnnealCandidateDTO {
  axis: string; axisLabelEn: string; axisLabelAr: string; value: string;
  segmentSize: number; dropped: number; dropOffRate: number;
  excess: number; separation: number;
  eligible: boolean;
  ineligibilityReason: 'below-support-floor' | 'excluded-axis' | 'contradicts-chain' | 'negative-excess' | null;
}

export interface AnnealIterationDTO {
  index: number;
  candidates: AnnealCandidateDTO[];
  admittedAxis: string | null; admittedValue: string | null;
  chainSizeAfter: number; chainDropOffRateAfter: number; chainSeparationAfter: number;
  reason: 'admitted-improvement' | 'no-improvement' | 'depth-cap-reached' | 'no-eligible-candidate';
}

export interface AnnealRunDTO {
  id: string; funnelId: string; seamIndex: number; basis: ComputationBasisDTO;
  policy: AnnealPolicyInput & { version: number };
  iterations: AnnealIterationDTO[];
  chain: { axis: string; value: string; axisLabelEn: string; axisLabelAr: string }[];
  chainSize: number; chainDropOffRate: number; baselineDropOffRate: number;
  excess: number; excessHeadcount: number;
  inputHash: string; ranAt: string; ranByUserId: string;
  persistedAsDefaultPolicy: boolean;
}

export interface SegmentPredicateSet {
  predicates: { axis: string; value: string; negate?: boolean }[];   // complement = the negated set (03 CP-3.6)
  labelEn?: string; labelAr?: string;                               // composed from predicates when omitted
}

export interface SegmentComparisonSideDTO {
  predicates: { axis: string; value: string; negate?: boolean }[];
  labelEn: string; labelAr: string;
  size: number; dropped: number; dropOffRate: number;
  excess: number;                 // side dropOffRate − seam baseline (signed, points)
  excessHeadcount: number;        // round(size × excess)
}

export interface SegmentComparisonDTO {
  funnelId: string; seamIndex: number; basis: ComputationBasisDTO;
  priorStepUsers: number; lostUsers: number; baselineDropOffRate: number;
  sideA: SegmentComparisonSideDTO; sideB: SegmentComparisonSideDTO;
  deltaDropOffRate: number;       // sideA.dropOffRate − sideB.dropOffRate (points)
}

export interface CohortSummary {
  id: string; name: string; segmentId: string; size: number;
  materializedAt: string; materializedByUserId: string;
  basisNote: string; expiresAt: string | null;
}

export interface CohortUserDTO {
  userKey: string;
  properties: Record<string, string>;
  enteredAt: string; lastSeenAt: string; converted: boolean;
}

export interface NarrativeDTO {
  id: string; analysisId: string;
  engine: 'template-metrics' | 'model-assisted';   // provenance displayed in UI (contract rule 4)
  textEn: string; textAr: string;
  generatedAt: string; partial: boolean;
}

export interface AnalysisSummary {
  id: string; title: string; funnelId: string; funnelName: string;
  authorUserId: string; authorDisplayName: string;
  createdAt: string; updatedAt: string;
  sharedWithWorkspace: boolean;
  hasAnneal: boolean; segmentCount: number; hasNarrative: boolean;
  headlineEn: string; headlineAr: string;   // composed one-breath summary (11 §D2)
}

export interface AnalysisDetail extends AnalysisSummary {
  funnelVersion: number; metricsId: string; basis: ComputationBasisDTO;
  metrics: FunnelMetricsDTO;
  annealRun: AnnealRunDTO | null;
  segments: { id: string; predicates: { axis: string; value: string; negate?: boolean }[];
              labelEn: string; labelAr: string;
              originFunnelId: string; originSeamIndex: number; originAnnealRunId: string | null;
              basisNoteEn: string; basisNoteAr: string }[];
  narrative: NarrativeDTO | null;
  annotations: { id: string; authorUserId: string; authorDisplayName: string; text: string; createdAt: string }[];
  noteEn: string | null; noteAr: string | null;
  drift: 'none' | 'data-moved' | 'chain-no-longer-reproduces';
}

export interface NotificationEventDTO {
  id: string; userId: string;
  kind: 'analysis-shared' | 'taxonomy-lint-digest' | 'source-health-changed'
      | 'analysis-annotation' | 'export-ready';
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // ZERO instant classes at v1 (12 Q-13)
  payload: Record<string, string>; createdAt: string; seenAt: string | null;
}

export interface ActivityEntryDTO {
  id: string; actorUserId: string | null; action: string; targetId: string;
  detail: Record<string, string>; at: string;
}

export interface JobDTO<T = unknown> {
  id: string; kind: 'sample-import' | 'analysis-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T; result?: T;
  error?: { code: ErrorCode; message: string; correlationId: string };
}

// Live workspace events (subscribeWorkspaceEvents payload)
export type WorkspaceEvent =
  | { type: 'taxonomy.changed'; eventId: string; version: number }
  | { type: 'taxonomy.lint-changed'; errorCount: number }
  | { type: 'source.health'; sourceId: string; health: string }
  | { type: 'funnel.saved'; funnelId: string; version: number }
  | { type: 'analysis.shared'; analysisId: string; authorUserId: string }
  | { type: 'analysis.annotation'; analysisId: string; authorUserId: string }
  | { type: 'anneal.policy-published'; version: number }
  | { type: 'job.state'; jobId: string; state: string };
export type WorkspaceEventSink = (event: WorkspaceEvent) => void;

// ===== The Adapter (v1) =====
export interface FunnelDropOffAdapterV1 {
  // Session & identity
  getSession(): Promise<Result<Session, AdapterError>>;

  // Funnels (the canvas's definitions)
  listFunnels(query: CursorQuery<{ status?: FunnelStatus[]; searchName?: string }, 'updatedAt' | 'name'>): Promise<Result<Page<FunnelSummary>, AdapterError>>;
  getFunnel(id: string): Promise<Result<FunnelDetail, AdapterError>>;
  saveFunnel(input: { id?: string; name: string; descriptionEn?: string; descriptionAr?: string;
                      steps: { eventId: string; eventFilters?: { property: string; op: string; value: string }[] }[];
                      orderingMode: OrderingMode; conversionWindowHours: number;
                      globalFilters: { property: string; op: string; value: string }[];
                      status: FunnelStatus; idempotencyKey: string }): Promise<Result<FunnelDetail, AdapterError>>;

  // Computation (immutable evidence rows; every result names its basis)
  computeFunnelMetrics(input: { funnelId: string; rangeStart: string; rangeEnd: string;
                                conversionWindowHours?: number; orderingMode?: OrderingMode }): Promise<Result<FunnelMetricsDTO, AdapterError>>;
  getFunnelTrend(input: { funnelId: string; rangeStart: string; rangeEnd: string;
                          windowDays: number }): Promise<Result<TrendPointDTO[], AdapterError>>;
  breakdownFunnelStep(input: { funnelId: string; seamIndex: number; axis: string;
                               rangeStart: string; rangeEnd: string }): Promise<Result<BreakdownRowDTO[], AdapterError>>;
  getStepTransitionDetail(input: { funnelId: string; seamIndex: number;
                                   rangeStart: string; rangeEnd: string }): Promise<Result<TransitionDetailDTO, AdapterError>>;

  // Segment annealing (the flagship engine)
  annealSegment(input: { funnelId: string; seamIndex: number; rangeStart: string; rangeEnd: string;
                         policy?: AnnealPolicyInput; persistAsDefault?: boolean; idempotencyKey: string }): Promise<Result<AnnealRunDTO, AdapterError>>;
    // policy omitted → workspace default (Session.defaultAnnealPolicy)
    // persistAsDefault (admin only) publishes the policy as the new workspace default (03 design note (b))

  // Segment comparison (the CompareBoard payload — both sides at the SAME seam semantics)
  compareSegments(input: { funnelId: string; seamIndex: number; rangeStart: string; rangeEnd: string;
                           segmentA: SegmentPredicateSet; segmentB: SegmentPredicateSet }): Promise<Result<SegmentComparisonDTO, AdapterError>>;
    // predicates referencing axes not declared on the seam's prior-step events return VALIDATION
    // naming the mismatch (03 CP-3.6 edge: comparisons across funnels are blocked by named reason);
    // the complement is the negated predicate set — no special form exists

  // Segments → cohorts → user drill (PII-free by construction)
  saveCohort(input: { name: string; segment: { predicates: { axis: string; value: string; negate?: boolean }[] };
                      originAnalysisId?: string; idempotencyKey: string }): Promise<Result<CohortSummary, AdapterError>>;
  listCohorts(query: CursorQuery<{ includeExpired?: boolean }, 'materializedAt'>): Promise<Result<Page<CohortSummary>, AdapterError>>;
  listCohortUsers(query: CursorQuery<{ cohortId: string; convertedOnly?: boolean }, 'userKey'>): Promise<Result<Page<CohortUserDTO>, AdapterError>>;

  // Analyses (the evidence packs — collaboration units)
  saveAnalysis(input: { id?: string; title: string; funnelId: string; metricsId: string;
                        annealRunId?: string; noteEn?: string; noteAr?: string;
                        segments?: { predicates: { axis: string; value: string; negate?: boolean }[];
                                     labelEn: string; labelAr: string }[];
                        narrativeId?: string; sharedWithWorkspace: boolean;
                        annotationsToAppend?: { text: string }[];
                        idempotencyKey: string }): Promise<Result<AnalysisSummary, AdapterError>>;
  listAnalyses(query: CursorQuery<{ kind?: 'anneal' | 'breakdown' | 'all'; authorUserId?: string;
                                    funnelId?: string; withSegmentsOnly?: boolean; sharedOnly?: boolean }, 'createdAt'>): Promise<Result<Page<AnalysisSummary>, AdapterError>>;
  getAnalysis(id: string): Promise<Result<AnalysisDetail, AdapterError>>;   // re-opens with drift check (rule 9)
  narrateDropOff(input: { analysisId?: string; annealRunId?: string; locale: 'en' | 'ar'; idempotencyKey: string }): Promise<Result<NarrativeDTO, AdapterError>>;
    // exactly ONE AI-touching operation (conditionally-AI declaration — rule 4)
  exportAnalysis(input: { analysisId: string; idempotencyKey: string }): Promise<Result<JobDTO<{ artifactId: string; expiresAt: string; locale: 'bilingual' }>, AdapterError>>;

  // Taxonomy (the bilingual dictionary + its governance)
  listTaxonomyEvents(query: CursorQuery<{ status?: EventStatus[]; segmentableAxis?: string; ownerUserId?: string | null }, 'canonicalName'>): Promise<Result<Page<TaxonomyEventSummary>, AdapterError>>;
  getTaxonomyEvent(id: string): Promise<Result<TaxonomyEventDetail, AdapterError>>;
  upsertTaxonomyEvent(input: { id?: string; canonicalName: string; labelEn: string; labelAr: string;
                               descriptionEn?: string; descriptionAr?: string; active: boolean;
                               ownerUserId?: string | null;
                               properties: { name: string; type: string; segmentable: boolean;
                                             enumValues?: string[]; labelEn: string; labelAr: string }[];
                               renameMigration?: 'update-references' | 'fork-and-deprecate';
                               idempotencyKey: string }): Promise<Result<TaxonomyEventDetail, AdapterError>>;
    // lint ERROR class blocks publish (VALIDATION with rule details); renames of referenced
    // events REQUIRE renameMigration (VALIDATION otherwise — contract rule 6)
  setTaxonomyEventStatus(input: { eventId: string; status: EventStatus;
                                  resolution?: 'acknowledge-legacy' | 'migrate-references';
                                  idempotencyKey: string }): Promise<Result<TaxonomyEventDetail, AdapterError>>;
    // deprecating a referenced event REQUIRES resolution (VALIDATION otherwise — contract rule 7)
  getTaxonomyLintReport(): Promise<Result<TaxonomyLintReport, AdapterError>>;

  // Event sources (adapter-bound; the product stores NO raw events — LOOP-10)
  listEventSources(): Promise<Result<EventSourceDTO[], AdapterError>>;
  importEventSample(input: { format: 'csv' | 'tsv'; content: string; idempotencyKey: string }): Promise<Result<JobDTO<{ imported: number; awaitingRows: number; failedRows: { row: number; issue: string }[]; proposedEventCount: number }>, AdapterError>>;

  // Ambient
  listActivity(query: CursorQuery<{ actorUserId?: string | null; action?: string[]; targetId?: string; since?: string; until?: string }, 'at'>): Promise<Result<Page<ActivityEntryDTO>, AdapterError>>;
  listNotifications(query: CursorQuery<{ unseenOnly?: boolean; kind?: NotificationEventDTO['kind'][] }, 'createdAt'>): Promise<Result<Page<NotificationEventDTO>, AdapterError>>;
  markNotificationsSeen(input: { ids: string[]; allSeen?: boolean }): Promise<Result<{ marked: number }, AdapterError>>;
  subscribeWorkspaceEvents(sink: WorkspaceEventSink): Promise<() => void>;   // returns unsubscribe

  // Jobs (async-contract §2; sample imports + exports)
  getJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;
  retryJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;      // failed-rows/items only (async-contract §4)
  cancelJob(id: string): Promise<Result<{ cancelled: true }, AdapterError>>;

  // People (admin surface)
  listUsers(query: CursorQuery<{ role?: Role[]; status?: ('active' | 'suspended')[] }, 'displayName'>): Promise<Result<Page<UserSummary>, AdapterError>>;
  inviteUser(input: { displayName: string; role: Role; locale: 'en' | 'ar' }): Promise<Result<UserSummary, AdapterError>>;
  updateUser(input: { userId: string; role?: Role; locale?: 'en' | 'ar'; status?: 'active' | 'suspended' }): Promise<Result<UserSummary, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'en' | 'ar';
export interface User {
  id: string;
  workspaceId: string;
  displayName: string;            // bidi-isolated on render (rtl-rules §2)
  role: Role;                     // structural roles only (02: no per-user ACL at v1)
  locale: Locale;                 // console locale; flips dir for the full citizen
  status: 'active' | 'suspended';
  joinedAt: string;
}

// ===== The bilingual event taxonomy (the product's data dictionary) =====
export type PropertyType = 'string' | 'number' | 'boolean' | 'enum' | 'timestamp';
export interface TaxonomyProperty {
  name: string;                   // canonical property name, camelCase (e.g. 'paymentMethod')
  type: PropertyType;
  segmentable: boolean;           // declared eligible for breakdowns/anneal candidates
  enumValues?: string[];          // declared values for enum type (lint-gated against observed)
  labelEn: string;
  labelAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
}
export interface TaxonomyEvent {
  id: string;
  workspaceId: string;
  canonicalName: string;          // '[Noun] [Past-Tense Verb]' Title Case — lint-enforced (07c §2.5)
  labelEn: string;                // REQUIRED for active events (lint ERROR when missing — 07c §2.5)
  labelAr: string;                // REQUIRED for active events (the bilingual contract)
  descriptionEn: string | null;
  descriptionAr: string | null;
  active: boolean;                // user-initiated vs system-initiated (q10 actor discipline)
  status: EventStatus;
  ownerUserId: string | null;     // lint WARN when null (governance class)
  properties: TaxonomyProperty[];
  version: number;                // every edit appends a version (07a immutability)
  observedCount: number;          // events observed in the active basis (usage honesty)
  usedByFunnelIds: string[];      // impact surface for renames/deprecations (CP-4.3/4.4)
  createdAt: string;
  updatedAt: string;
  updatedByUserId: string;
}
export interface TaxonomyLintViolation {
  eventId: string;
  canonicalName: string;
  rule: 'naming-syntax' | 'naming-case' | 'naming-actor' | 'label-en-missing'
      | 'label-ar-missing' | 'property-undeclared-value' | 'property-type-mismatch'
      | 'deprecated-referenced' | 'owner-missing' | 'dead-event';
  severity: 'error' | 'warn';     // errors block publish; warnings render (07c §2.5)
  detailEn: string;               // rule text + observed value (composed, not free-form)
  detailAr: string;
}

// ===== Event sources (adapter-bound; the product stores NO raw events — LOOP-10) =====
export interface EventSource {
  id: string;
  workspaceId: string;
  kindLabel: string;              // capability language, kind-not-vendor (credential-contract §2)
  health: 'unverified' | 'active' | 'expiring-soon' | 'expired' | 'failed';
  lastFreshAt: string | null;     // freshness basis for every rendered metric
  coverageNoteEn: string | null;  // honest coverage statement (e.g. sample span vs requested range)
  coverageNoteAr: string | null;
}

// ===== Funnels =====
export interface FunnelStep {
  order: number;                  // 1-based
  eventId: string;                // must reference an active (or acknowledged-legacy) event
  eventFilters?: { property: string; op: 'eq' | 'neq' | 'in' | 'gt' | 'lt'; value: string }[];
}
export interface Funnel {
  id: string;
  workspaceId: string;
  name: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  steps: FunnelStep[];
  orderingMode: OrderingMode;
  conversionWindowHours: number;  // 1–8784 (1h–366d — the documented vendor range, 01 §3 q16)
  globalFilters: { property: string; op: 'eq' | 'neq' | 'in' | 'gt' | 'lt'; value: string }[];
  status: 'draft' | 'active' | 'archived';
  version: number;                // edits append versions; analyses pin the version they ran
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Computed analyses (immutable evidence rows with declared basis) =====
export interface ComputationBasis {
  sourceId: string;               // bound source or pasted-sample pseudo-source
  sourceKindLabel: string;
  rangeStart: string;
  rangeEnd: string;
  conversionWindowHours: number;
  orderingMode: OrderingMode;
  funnelVersion: number;
  taxonomyVersion: number;        // events/properties in force at computation
  computedAt: string;
  freshness: 'fresh' | 'stale' | 'coverage-gap';   // drives the honesty chips (11 §G)
  coverageDays?: number;          // present when < requested span (paste-sample honesty)
}
export interface StepMetrics {
  order: number;
  eventId: string;
  canonicalName: string;
  labelEn: string;
  labelAr: string;
  usersCompleted: number;
  stepConversionRate: number;     // usersCompleted[n] / usersCompleted[1] (4-decimal, display %)
  droppedFromPrior: number;       // usersCompleted[n-1] - usersCompleted[n]
  dropOffRate: number;            // droppedFromPrior / usersCompleted[n-1]
  medianTransitionMinutes: number | null;   // time from step n-1 completion to step n
  p90TransitionMinutes: number | null;
}
export interface FunnelMetrics {  // immutable row per computation (07c §2.1)
  id: string;
  funnelId: string;
  basis: ComputationBasis;
  entryUsers: number;             // usersCompleted[1]
  overallConversionRate: number;  // usersCompleted[k] / usersCompleted[1]
  totalConverted: number;
  largestDropOffStep: number | null;      // argmax absolute decrease (q20 craft — absolute, not percentage)
  largestDropOffCount: number | null;
  slowestStep: number | null;             // argmax medianTransitionMinutes (q20 craft)
  steps: StepMetrics[];
}
export interface TrendPoint { windowStart: string; windowEnd: string; entryUsers: number; converted: number; conversionRate: number; }
export interface BreakdownRow {
  axis: string;                   // property name
  axisLabelEn: string;
  axisLabelAr: string;
  value: string;                  // segment value (bidi-isolated on render)
  size: number;
  dropped: number;
  dropOffRate: number;
  deltaVsBaseline: number;        // signed percentage points
  separation: number;             // |delta| × sqrt(coverage) — the published score (07c §2.3)
}
export interface DisplacedPath {
  eventId: string | null;         // null = "left the product" (no subsequent event)
  canonicalName: string | null;
  labelEn: string | null;
  labelAr: string | null;
  users: number;
  shareOfLost: number;
}
export interface TransitionDetail {  // the seam dossier payload (immutable per computation)
  id: string;
  funnelId: string;
  seamIndex: number;              // transition between step seamIndex and seamIndex+1 (1-based)
  basis: ComputationBasis;
  priorStepUsers: number;
  nextStepUsers: number;
  lostUsers: number;
  baselineDropOffRate: number;
  timeDistribution: { bucketLabelEn: string; bucketLabelAr: string; users: number }[];  // fixed edges (07c §2.4)
  medianTransitionMinutes: number | null;
  p90TransitionMinutes: number | null;
  displacedPaths: DisplacedPath[];        // ranked, top-N seeded 8
}

// ===== Segment annealing (the flagship engine's evidence) =====
export interface AnnealPolicy {
  minSupportFormula: 'floor30-or-2pct';   // max(30, ceil(0.02 × seam population)) — seeded default
  minSupportOverride: number | null;      // workspace default may override (admin)
  epsilon: number;                        // min separation improvement to admit (seeded 0.02)
  depthCap: number;                       // max admitted predicates (seeded 4, hard cap 8)
  excludedAxes: string[];
  version: number;
  publishedAt: string;
  publishedByUserId: string | null;
}
export interface AnnealCandidate {        // one evaluated predicate — the trace's atom
  axis: string;
  axisLabelEn: string;
  axisLabelAr: string;
  value: string;
  segmentSize: number;
  dropped: number;
  dropOffRate: number;
  excess: number;                 // dropOffRate − baselineDropOffRate (signed)
  separation: number;             // |excess| × sqrt(segmentSize / priorStepUsers)
  eligible: boolean;
  ineligibilityReason: 'below-support-floor' | 'excluded-axis' | 'contradicts-chain' | 'negative-excess' | null;   // negative-excess = protective segment (03 CP-3.2 rejection copy)
}
export interface AnnealIteration {
  index: number;                  // 1-based
  candidates: AnnealCandidate[];  // every evaluated candidate, scores included
  admittedAxis: string | null;    // null when the iteration rejects all (stop condition)
  admittedValue: string | null;
  chainSizeAfter: number;
  chainDropOffRateAfter: number;
  chainSeparationAfter: number;   // the chain score: excess × sqrt(coverage)
  reason: 'admitted-improvement' | 'no-improvement' | 'depth-cap-reached' | 'no-eligible-candidate';
}
export interface AnnealRun {               // immutable evidence row (reruns are new runs)
  id: string;
  funnelId: string;
  seamIndex: number;
  basis: ComputationBasis;
  policy: AnnealPolicy;
  iterations: AnnealIteration[];
  chain: { axis: string; value: string; axisLabelEn: string; axisLabelAr: string }[];  // admission order
  chainSize: number;
  chainDropOffRate: number;
  baselineDropOffRate: number;
  excess: number;                 // chainDropOffRate − baselineDropOffRate (points)
  excessHeadcount: number;        // round(chainSize × excess) — the interpretability number
  inputHash: string;              // deterministic dedup key (07c §3)
  ranAt: string;
  ranByUserId: string;
  persistedAsDefaultPolicy: boolean;   // CP-6.2 publish path
}

// ===== Segments, cohorts, users =====
export interface SegmentDefinition {       // persisted ONLY inside Analysis.segments[] (03 design note (a))
  id: string;
  predicates: { axis: string; value: string; negate?: boolean }[];
  originFunnelId: string;
  originSeamIndex: number;
  originAnnealRunId: string | null;        // null for hand-built breakdown segments
  labelEn: string;                          // composed ("new-tenure users on web")
  labelAr: string;
  basisNoteEn: string;                      // provenance sentence
  basisNoteAr: string;
}
export interface Cohort {                  // a materialized user snapshot of a segment
  id: string;
  segmentId: string;
  name: string;
  userKeys: string[];                       // pseudonymous keys ONLY (LOOP-10/09 privacy posture)
  materializedAt: string;                   // the snapshot moment — cohorts are not live filters
  materializedByUserId: string;
  basisNote: string;
  size: number;
}
export interface CohortUser {              // the drill row — PII-free by construction
  userKey: string;                          // e.g. 'u-0042' — Space Mono token, bidi-isolated
  properties: Record<string, string>;       // declared taxonomy axes only
  enteredAt: string;                        // funnel entry timestamp
  lastSeenAt: string;
  converted: boolean;
}

// ===== Analyses (the evidence pack — the collaboration unit) =====
export interface Narrative {
  id: string;
  analysisId: string;
  engine: 'template-metrics' | 'model-assisted';   // provenance, always displayed (ai-native §8)
  textEn: string;                            // composed from run data (template) or model (bound)
  textAr: string;
  generatedAt: string;
  partial: boolean;                          // never silently promoted to complete (ai-native §2)
}
export interface Annotation {                // lightweight review-posture comments (no threads at v1)
  id: string;
  analysisId: string;
  authorUserId: string;
  text: string;                              // bidi-isolated user content
  createdAt: string;
}
export interface Analysis {
  id: string;
  workspaceId: string;
  title: string;
  funnelId: string;
  funnelVersion: number;
  metricsId: string;                         // the pinned computation
  basis: ComputationBasis;
  annealRunId: string | null;
  segments: SegmentDefinition[];             // segment persistence rides the pack (03 design note (a))
  narrativeId: string | null;
  annotations: Annotation[];
  authorUserId: string;
  noteEn: string | null;
  noteAr: string | null;
  sharedWithWorkspace: boolean;
  createdAt: string;
  updatedAt: string;
  drift: 'none' | 'data-moved' | 'chain-no-longer-reproduces';   // computed on re-open (11 §D6)
}

// ===== Ambient =====
export interface NotificationEvent {
  id: string;
  userId: string;
  kind: 'analysis-shared' | 'taxonomy-lint-digest' | 'source-health-changed'
      | 'analysis-annotation' | 'export-ready';
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // P21 ladder — ZERO instant classes at v1 (12 Q-13)
  payload: Record<string, string>;
  createdAt: string;
  seenAt: string | null;
}
export interface ActivityEntry {            // P17 — actor-action-target-timestamp
  id: string;
  workspaceId: string;
  actorUserId: string | null;                // null = engine
  action: string;                            // 'funnel.saved' | 'taxonomy.version' | 'anneal.policy-published' | …
  targetId: string;
  detail: Record<string, string>;
  at: string;
}
export interface Job<T = unknown> {          // async-contract §2 state machine
  id: string;
  kind: 'sample-import' | 'analysis-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: { code: string; message: string; correlationId: string };
}

