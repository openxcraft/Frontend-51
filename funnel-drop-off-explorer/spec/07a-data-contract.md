# 07a — Data Contract: funnel-drop-off-explorer (backend-agnostic)

SME-G pass · Entities, relationships, state machines. Every entity/operation below is justified by a flow in 03; every operation appears as an adapter method in 07b (bidirectional no-orphan proof in 03 Tables A/B). No backend, provider, storage, or transport is named — this is the source of truth from which any backend can be built or bound. **TypeScript types only** (types + pure interface shapes; no implementation code).

## Entities (TypeScript)

```ts
// ===== Roles & people =====
export type Role = 'analyst' | 'admin' | 'viewer';   // viewer = read-and-annotate (04 review posture)
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
export type EventStatus = 'proposed' | 'active' | 'deprecated';
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
export type OrderingMode = 'sequential' | 'strict' | 'any';   // vendor-documented semantics (01 §3 q2)

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
```

## Relationships

Workspace 1—N User, TaxonomyEvent, EventSource, Funnel, Analysis, ActivityEntry, Cohort, NotificationEvent; 1—1 AnnealPolicy (versioned history retained). Funnel 1—N FunnelMetrics (immutable computation rows; re-query appends). Funnel 1—N TransitionDetail (per seam per computation). Funnel 1—N AnnealRun (immutable; reruns append). AnnealRun 1—0..1 inclusion in Analysis (annealRunId). Analysis 1—N SegmentDefinition (segments persist ONLY inside packs — no orphan segments). SegmentDefinition 1—N Cohort (materializations snapshot at moments; multiple cohorts per segment allowed). Cohort 1—N CohortUser (paginated drill). Analysis 1—0..1 Narrative; 1—N Annotation. TaxonomyEvent N—M Funnel (usedByFunnelIds denormalized, event-consistent). Job 1—0..1 export artifact (expiry per async-contract §2). All list-bearing relations paginate via the typed Page model (07b).

## State machines (declared transitions only — others are contract violations)

- **TaxonomyEvent**: proposed → active (activation requires lint-clean bilingual labels — VALIDATION otherwise); active → deprecated (gated: referencing funnels require explicit resolution — acknowledge-as-legacy or migrate; 07b rule 7); deprecated → active (restore — allowed, appends version). Every transition appends a version + ActivityEntry; canonical-name edits on active events require the rename migration choice (update-references or fork-and-deprecate).
- **Funnel**: draft → active (save with ≥1 valid step); active → archived (analyses pin the version they ran; archived funnels do not compute new metrics but old evidence stays readable); archived → active (re-activate appends version). No delete transition at v1 — archiving is the record-preserving path (evidence discipline).
- **FunnelMetrics / TransitionDetail / AnnealRun**: immutable rows, no transitions; re-computation and re-runs append new rows. AnnealRun inputHash dedups identical re-submissions (returns the original run — 07c §3).
- **Cohort**: created (materialized) → expired (retention sweep, seeded 90 days — a workspace policy posture, 12 Q-7); expired cohorts re-materialize from their segment as NEW cohorts (never resurrected).
- **Analysis**: created → updated (annotations append; narrative regenerate appends; drift recomputed on open) — the pack's pinned metrics/run never mutate; only annotations and the drift flag evolve.
- **Job**: async-contract §2 verbatim.

## Operations (read/write/subscribe — all typed on 07b)

- Session: getSession (auth-agnostic; role + locale + the workspace AnnealPolicy default).
- Funnels: list (query: status, search name bilingual-normalized; sort: updatedAt, name), get, save (versioned; VALIDATION: steps non-empty, events active-or-acknowledged, window 1–8784h).
- Computation: computeFunnelMetrics (funnelId + range/window/ordering overrides → immutable metrics row), getFunnelTrend (windowed points), breakdownFunnelStep (step/seam × axis → ranked rows), getStepTransitionDetail (seam dossier payload).
- Anneal: annealSegment (funnelId + seamIndex + policy (+persistAsDefault) → immutable AnnealRun with full trace).
- Comparison: compareSegments (two predicate sets at the same seam → aligned sizes/rates/excesses + delta; the CompareBoard payload — 03 CP-3.6).
- Segments/cohorts: saveCohort (materialize a segment/chain at now), listCohorts, listCohortUsers (cursor-paginated, PII-free).
- Analyses: saveAnalysis (pack write — persists segments with provenance; VALIDATION: non-empty pack), listAnalyses (feed + workshop filters: kind, author, funnel, segment-bearing), getAnalysis (re-open + drift check), narrateDropOff (conditionally-AI; template floor), exportAnalysis (Job → bilingual artifact with expiry).
- Taxonomy: listTaxonomyEvents (search bilingual-normalized; filters: status, segmentable property, owner), getTaxonomyEvent, upsertTaxonomyEvent (lint-gated publish; impact-gated rename), setTaxonomyEventStatus (deprecate/restore/activate with reference gate), getTaxonomyLintReport.
- Sources: listEventSources, importEventSample (Job; paste primary path).
- Ambient: listActivity, subscribeWorkspaceEvents, listNotifications, markNotificationsSeen, getJob, retryJob, cancelJob.
- People: listUsers, inviteUser, updateUser.

## State obligations summary (per entity)

Every async operation follows the async-contract state machine; exports carry expiry windows; the sample import declares partial-results policy (deliver imported rows, mark failures, retry scoped to failed rows — §4). Every consequential mutation appends an ActivityEntry (P17) — funnel saves, taxonomy versions, policy publishes (via annealSegment persistAsDefault), cohort materializations, analysis saves/shares, exports. Every computed artifact names its ComputationBasis (source, range, window, versions, freshness) — no metric renders without provenance. PII never enters the model: user keys are pseudonymous, properties are declared taxonomy axes, no emails/phones/names/geo exist in any interface (09 privacy posture; 08 consent semantics). The adapter's identity resolution is upstream (LOOP-10: no identity resolution). No entity references a provider, transport, or external system by name — external touchpoints are abstract needs in 08 only.

## Determinism statement (conditionally-AI — declared per ai-native-patterns §1)

The **deterministic engines** — funnel computation (07c §2.1), breakdown ranking (§2.3), transition detail incl. displaced paths and time buckets (§2.4), segment annealing (§2.2), and taxonomy lint (§2.5) — are pure functions of (declared inputs: the event world observable through the bound source or pasted sample; the funnel definition + parameters; the taxonomy version; the anneal policy). Two evaluations over identical inputs produce identical outputs, including the full anneal iteration traces and explanation strings (07c §5 guarantees this in the mock). The **declared AI surface** is exactly one: drop-off narration assist (narrateDropOff). Its deterministic floor is `engine: 'template-metrics'` — bilingual templates composed from the run's own numbers (11 §D). When an abstract model capability is bound (08 N4), the adapter MAY return `engine: 'model-assisted'` narratives, but the contract requires: (a) the deterministic template result is always composed and retained as the floor; (b) the provenance field is displayed on every narrative; (c) degradation to the template is total and instant when the capability is unbound, rate-limited, or fails; (d) the model narrative consumes run METRICS only — never raw event rows or user keys (ai-native-patterns §9). No other surface touches a model: no AI classifies events, no AI proposes segments (the anneal is published math), no AI writes taxonomy entries.
