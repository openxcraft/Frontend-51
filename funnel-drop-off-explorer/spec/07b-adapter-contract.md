# 07b — Adapter Contract: funnel-drop-off-explorer (TypeScript, v1)

SME-G pass · Backend-agnostic by construction: no REST verbs, no provider names, no transport assumptions. The UI talks ONLY to this interface; binding to a real backend later = implementing this interface in one adapter file. Version: **v1** — breaking changes require `FunnelDropOffAdapterV2`, never modified signatures. LOOP-15 checklist satisfied: full 7-class error taxonomy, typed pagination/sort/filter, auth-agnostic session model, idempotency keys on reconnectable mutations. **TypeScript types only** — no implementation code in this contract. Operation count: **35** (top of the portfolio 20–35 band; flagship scope, zero deviation — recorded in 12 Q-16).

```ts
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
```

## Contract rules

1. **Authoritative adapter**: the canvas retains its last good render on query failure (03 CP-2 recovery) — the adapter never receives write-intent from reads; optimistic writes (P03) are bounded to analysis annotations and apply only after adapter confirmation with a 7s undo affordance; the offline queue (P20) stores bounded writes (analysis saves, annotations, taxonomy edits) and reconciles against versioned state — a queued taxonomy edit that reaches a newer version resolves to CONFLICT with both drafts shown, never a silent overwrite.
2. **Idempotency**: `saveFunnel`, `annealSegment`, `saveCohort`, `saveAnalysis`, `narrateDropOff`, `exportAnalysis`, `upsertTaxonomyEvent`, `setTaxonomyEventStatus`, `importEventSample` take `idempotencyKey` — resubmission after reconnect never double-writes a run, a cohort, an analysis, or a taxonomy version (async-contract §5). Additionally, `annealSegment` dedups by **inputHash** (funnel + seam + basis + policy): an identical re-submission returns the ORIGINAL run even under a fresh idempotency key (07c §3) — the anneal is a pure function and the contract admits it.
3. **Provenance is structural**: every computed DTO carries its `ComputationBasisDTO` (source, range, window, funnel/taxonomy versions, freshness, coverage) — a metric without a basis cannot render, and the 11 copy matrix keys staleness/coverage chips off these fields. Analyses pin the funnel version and metrics row they ran; drift is recomputed on `getAnalysis` (rule 9).
4. **Narration provenance and floor** (the conditionally-AI declaration): `narrateDropOff` MUST compose the deterministic `template-metrics` narrative for every call; when the optional model capability (08 N4) is bound the returned narrative MAY carry `engine: 'model-assisted'`, but the template result is retained as floor data, the engine field is always truthful, and any model failure/rate-limit degrades to the template narrative within the same call (never a spinner, never a missing narrative — ai-native-patterns §8). The model consumes run metrics ONLY (never raw events or user keys — ai-native-patterns §9).
5. **The anneal trace is the contract**: `annealSegment` returns EVERY evaluated candidate per iteration with its size, rate, excess, and separation score, plus the stop reason — the UI renders exactly what the engine evaluated (03 CP-3.2; 07c §2.2). A run that found nothing returns the candidate table with reason `no-eligible-candidate` or `no-improvement` — the null result is a valid, evidence-bearing result, never an error.
6. **Taxonomy edits are lint-gated**: `upsertTaxonomyEvent` runs the deterministic lint (07c §2.5) synchronously; ERROR-class violations return VALIDATION with the failing rule and observed value in `details`; renames of events referenced by funnels REQUIRE `renameMigration` (impact list returned in `details` when omitted — the gate is not UI theater).
7. **Deprecation is impact-gated**: `setTaxonomyEventStatus(deprecated)` on an event referenced by active funnels returns VALIDATION with the reference list UNLESS `resolution` is provided (`acknowledge-legacy` keeps references marked legacy; `migrate-references` rewrites them). Deprecated events are excluded from NEW funnel steps (composer-side VALIDATION) but remain readable in existing definitions and evidence.
8. **PII cannot enter through this contract**: no method accepts or returns emails, phones, personal names, or free-form user identifiers — user references are pseudonymous keys (u-###-class tokens) surfaced only through `listCohortUsers`. A binding that resolves pseudonyms to persons is out of contract (LOOP-10: no identity resolution; 09 privacy posture).
9. **Analyses are drift-honest**: `getAnalysis` recomputes the drift field against current data ('none' | 'data-moved' | 'chain-no-longer-reproduces') and returns it with the pinned evidence intact — the pack never silently refreshes its historical numbers; refresh is an explicit re-analysis (a new pack or an updated basis the author chooses to publish).
10. **Reads never queue, writes bound themselves**: P20 offline queuing applies ONLY to `saveAnalysis` (incl. annotations) and `upsertTaxonomyEvent` — all other operations fail fast offline with the canvas retaining its last good render (03 CP-6.8); the queue is reviewable per-item and cancellable before reconnect.
11. **Search normalization**: `search` normalizes Arabic variants (rtl-rules §4) across funnels, taxonomy events (canonical names AND both labels), analyses, and cohorts — implementations must implement it; the contract demands it (bilingual-en posture with an AR-full-citizen dictionary).
12. **No-orphan rule**: every method traces to flows in 03 (Tables A/B, 35/35 both directions); every flow operation has a method. Verified at Critic pass. The 35-method count sits at the top of the portfolio 20–35 band (recorded in 12 Q-16 — flagship scope without deviation).
13. **Policy publishes ride the run**: the workspace anneal-policy default is published ONLY through `annealSegment` with `persistAsDefault: true` (admin role — PERMISSION otherwise); `getSession` returns the current default (03 design note (b)). There is no separate policy-write method and no policy side-door.
