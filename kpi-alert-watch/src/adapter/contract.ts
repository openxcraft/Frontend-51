// VERBATIM from specs-source/kpi-alert-watch/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (Watch, Detection,
// Digest, SeasonWindow — and their fields) are declared canonically in 07a and
// are part of this contract by reference; 07b declares only the operational
// wrappers (summaries, views, jobs, inputs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed ingest rows, snooze without reason,
 *                                       backtest on insufficient series, sub-minimum feeds)
 * 'NOT_FOUND'    -> NotFoundError     (stale detection/feed/watch/digest links, expired delivery artifacts)
 * 'PERMISSION'   -> PermissionError   (capability consent, viewer-role mutations, workspace scoping)
 * 'CONFLICT'     -> ConflictError     (concurrent watch-policy edits, concurrent status transitions)
 * 'RATE_LIMIT'   -> RateLimitError    (narration assists, digest deliveries, capability syncs)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, digest delivery)
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
  role: 'owner' | 'editor' | 'viewer';   // viewer: digest read + delivery preferences, no mutations
  locale: 'ar' | 'en';
  seatKind: 'operator' | 'digest-reader';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export type Locale = 'ar' | 'en';
export type SeverityTier = 'page' | 'digest';
export type FeedDirection = 'higher-is-better' | 'lower-is-better';

export interface FeedSummary {
  id: string;
  nameEn: string;
  nameAr: string;
  unit: string;
  direction: FeedDirection;
  cadence: 'daily' | 'weekly';
  pointCount: number;
  lastPointAt?: string;                // staleness = now - lastPointAt vs cadence (S1 health strip)
  sourceKind: 'manual' | 'capability' | 'both';
  activeWatchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeriesView {
  feedId: string;
  from: string;                        // window start (ISO date)
  to: string;                          // window end (ISO date)
  points: { at: string; value: number; quality: 'ok' | 'invalid';
            expected: number; deviationSigma: number; seasonAdjusted: boolean }[];
  baselineRule: string;                // the engine's rule, rendered text (disclosure at point-of-use)
  seasonWindowsInRange: { id: string; nameEn: string; nameAr: string }[];
}

export interface WatchSummary {
  id: string;
  feedId: string;
  feedNameEn: string;
  feedNameAr: string;
  nameEn: string;
  nameAr: string;
  policyVersion: number;
  policyProseEn: string;               // policy-as-prose: the template engine's sentence for this policy
  policyProseAr: string;
  tier: SeverityTier;                  // highest tier across layers (page beats digest)
  status: 'active' | 'paused';
  pausedReason?: string;
  resumeAt?: string;
  lastEvaluatedAt?: string;
  lastRunPolicyVersion?: number;
}

export interface DetectionSummary {
  id: string;
  watchId: string;
  feedId: string;
  feedNameEn: string;
  feedNameAr: string;
  kind: 'threshold-warning' | 'threshold-critical' | 'anomaly-deviation';
  tier: SeverityTier;
  at: string;
  observed: number;
  baseline: number;
  deviationSigma?: number;
  deviationPercent: number;
  status: 'open' | 'acknowledged' | 'dismissed' | 'snoozed';
  backtest: boolean;
  explanationExcerptEn: string;        // truncated at word boundary (rtl-rules §4)
  explanationExcerptAr: string;
}

export interface BacktestReport {
  mode: 'backtest';
  windowDays: number;
  totalDetections: number;
  perWatch: { watchId?: string; candidatePolicyLabel: string; detections: number;
              seasonIntersections: number }[];
  dismissalJournalOverlap: { detectionId: string; reasonCode: string }[]; // would-be repeats of past noise
}

export interface DigestSummary {
  id: string;
  period: 'daily' | 'weekly';
  date: string;
  assembledAt: string;
  quietDay: boolean;
  pageClassCount: number;
  digestClassCount: number;
  seasonNoteCount: number;
}

export interface NarrationResult {
  detectionId: string;
  provenance: 'template' | 'assist';   // honesty first: which engine produced the text
  en: string;                           // template pair text (always present)
  ar: string;
  assistEn?: string;                    // present only when provenance = 'assist'
  assistAr?: string;
}

export interface Job<T> {
  id: string;
  kind: 'ingest' | 'sync' | 'evaluation' | 'digest-delivery';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface KpiAlertWatchAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // feeds (manual paste/import is the LOOP-5 always-available path)
  createFeed(input: {
    nameEn: string; nameAr: string; unit: string;
    direction: FeedDirection; cadence: 'daily' | 'weekly';
  }): Promise<Result<FeedSummary, AdapterError>>;
  listFeeds(query: {
    filter?: { sourceKind?: FeedSummary['sourceKind'][]; stale?: boolean };
    search?: string;                    // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'nameEn' | 'pointCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<FeedSummary>, AdapterError>>;
  getFeed(id: string): Promise<Result<FeedSummary & { attachedWatches: WatchSummary[] }, AdapterError>>;
  getMetricSeries(query: {
    feedId: string; from: string; to: string;
  }): Promise<Result<SeriesView, AdapterError>>;
  ingestMetricPoints(input: {
    feedId: string;
    points: { at: string; value: number }[];
    source: 'manual' | 'import';
    idempotencyKey: string;             // async-contract §5 — double-submit never double-ingests
  }): Promise<Result<Job<{ ingested: number; duplicates: number; invalidRows: string[] }>, AdapterError>>;

  // abstract metric-source capability path (consent-gated; 08 N1)
  syncMetricFeed(input: {
    feedId: string;
    idempotencyKey: string;
  }): Promise<Result<Job<{ addedPoints: number; from: string; to: string }>, AdapterError>>;

  // watches
  createWatch(input: {
    feedId: string; nameEn: string; nameAr: string;
    policy: { threshold?: unknown; anomaly?: unknown };  // ThresholdBandSpec | AnomalyLayerSpec (07a)
    idempotencyKey: string;
  }): Promise<Result<WatchSummary, AdapterError>>;
  listWatches(query: {
    filter?: { feedId?: string; status?: WatchSummary['status'][]; tier?: SeverityTier[] };
    search?: string;
    sort: 'updatedAt' | 'lastEvaluatedAt' | 'nameEn';
    cursor?: string; limit: number;
  }): Promise<Result<Page<WatchSummary>, AdapterError>>;
  getWatch(id: string): Promise<Result<WatchSummary & {
    policy: unknown;                     // full DetectionPolicy (07a)
    recentDetections: DetectionSummary[];
  }, AdapterError>>;
  updateWatch(id: string, patch: {
    nameEn?: string; nameAr?: string;
    policy?: unknown;                    // new DetectionPolicy; versioned — stale baseVersion conflicts
    status?: 'active' | 'paused';
    pausedReason?: string; resumeAt?: string;
    baseVersion: number;
  }): Promise<Result<WatchSummary, AdapterError>>;
  deleteWatch(id: string): Promise<Result<{ deletedWatchId: string; retainedDetectionCount: number }, AdapterError>>;

  // season calendar (Gregorian-dated entities; Hijri is presentation only — P24)
  listSeasonWindows(query: {
    filter?: { state?: 'past' | 'active' | 'queued'[]; feedId?: string };
    sort: 'startsAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<SeasonWindow & { state: 'past' | 'active' | 'queued' }>, AdapterError>>;
  upsertSeasonWindow(input: {
    id?: string; nameEn: string; nameAr: string;
    startsAt: string; endsAt: string;
    expectedEffect: 'surge' | 'dip' | 'both';
    feedIds: string[];
    baseVersion?: number;               // required on update — versioned data
  }): Promise<Result<SeasonWindow, AdapterError>>;

  // evaluation (deterministic engine; live | backtest | catch-up)
  runEvaluation(input: {
    watchIds?: string[];                // omitted = all due watches
    mode: 'live' | 'backtest' | 'catch-up';
    windowDays?: number;                // backtest only; defaults to 60
    candidatePolicy?: unknown;          // backtest only: run an unsaved candidate (03 CP-3)
    idempotencyKey: string;
  }): Promise<Result<Job<unknown> | BacktestReport | { runId: string; summary: unknown }, AdapterError>>;
  // live/catch-up return a Job (async: engine may exceed 2s across many watches);
  // backtest returns the synchronous BacktestReport (budget-bound per 10-performance).

  // detections
  listDetections(query: {
    filter?: {
      status?: DetectionSummary['status'][];
      tier?: SeverityTier[];
      feedId?: string; watchId?: string;
      kind?: DetectionSummary['kind'][];
      from?: string; to?: string;
      backtest?: boolean;               // default false — backtest projections are opt-in reads
    };
    search?: string;                    // matches feed names + explanation text, normalized
    sort: 'at' | 'deviationPercent' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<DetectionSummary>, AdapterError>>;
  getDetection(id: string): Promise<Result<DetectionSummary & {
    explanation: unknown;               // full ExplanationPair (07a)
    narration?: unknown;                // Narration, when one was ever generated
    statusHistory: unknown[];           // StatusEvent[]
    seriesContext: unknown;             // SeriesView scoped to the detection's neighborhood
    snooze?: { until: string; reason: string };
    dismissal?: { reasonCode: string; note?: string; at: string; by: string };
  }, AdapterError>>;
  updateDetectionStatus(input: {
    detectionId: string;
    action: 'acknowledge' | 'dismiss' | 'snooze';
    snooze?: { days: 1 | 3 | 7 | 14; reason: string };  // reason required for dismiss AND snooze
    dismissal?: { reasonCode: 'known-cause' | 'data-error' | 'expected-behavior'
                  | 'wrong-threshold' | 'other'; note?: string };
    baseStatus: DetectionSummary['status'];             // optimistic-concurrency guard
  }): Promise<Result<DetectionSummary, AdapterError>>;

  // narration assist (the single conditionally-AI surface — 08 N2)
  narrateDetection(id: string): Promise<Result<NarrationResult, AdapterError>>;
  // Always returns the template pair; appends assist text only when the capability
  // is bound, consented, within quota, and succeeds — degradation IS the default text.

  // digests
  listDigests(query: {
    filter?: { period?: 'daily' | 'weekly'; dateFrom?: string; dateTo?: string };
    sort: 'date' | 'assembledAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<DigestSummary>, AdapterError>>;
  getDigest(id: string): Promise<Result<DigestSummary & {
    pageClassItems: unknown[]; sections: unknown[]; seasonNotes: unknown[];
    delivery: unknown[];                 // DeliveryRecord[]
  }, AdapterError>>;
  generateDigest(input: {
    period: 'daily' | 'weekly'; date: string;
    idempotencyKey: string;             // same day+period re-render returns the same document
  }): Promise<Result<DigestSummary, AdapterError>>;   // synchronous, budget-bound per 10-performance
  deliverDigest(input: {
    digestId: string;
    idempotencyKey: string;
  }): Promise<Result<Job<{ deliveredTo: string[]; failed: string[] }>, AdapterError>>;

  // preferences (P21 tier ladder, per member)
  getDigestPreferences(memberId: string): Promise<Result<DigestPreferences, AdapterError>>;
  updateDigestPreferences(memberId: string, patch: {
    pageClassDelivery?: 'instant-console' | 'instant-console+channel';
    digestClassDelivery?: 'daily' | 'weekly' | 'off';
    locale?: Locale;
  }): Promise<Result<DigestPreferences, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    narrationAssists: number; narrationQuota: number;
    capabilitySyncs: number; digestDeliveries: number;
    resetAt: string;
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type DataCadence = 'daily' | 'weekly';
export type WatchStatus = 'active' | 'paused';
export type DetectionStatus =
  | 'open' | 'acknowledged' | 'dismissed' | 'snoozed';
export type DeviationKind =
  | 'threshold-warning' | 'threshold-critical'     // declared hard limits
  | 'anomaly-deviation';                            // seasonal baseline breach
export type JobKind = 'ingest' | 'sync' | 'evaluation' | 'digest-delivery';
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;
  baselineWindowWeeks: number;        // trailing baseline window (default 8)
  evaluationCadence: DataCadence;     // workspace clock rhythm
}
export interface Member {
  id: string;
  workspaceId: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';  // viewer: digest read + delivery, no mutations
  locale: Locale;                        // workspace chrome locale preference
  seatKind: 'operator' | 'digest-reader'; // Shaikha seat: digest-reader = viewer + delivery
}
export interface MetricFeed {
  id: string;
  workspaceId: string;
  nameEn: string;
  nameAr: string;                      // authored pair; both required (the bilingual rule)
  unit: string;                        // e.g. "minutes", "SAR", "%", "score"
  direction: FeedDirection;
  cadence: DataCadence;
  pointCount: number;                  // derived at read
  lastPointAt?: string;                // derived at read — staleness computation
  sourceKind: 'manual' | 'capability' | 'both';
  createdAt: string;
  updatedAt: string;
}
export interface MetricPoint {
  feedId: string;
  at: string;                          // ISO date (cadence-aligned)
  value: number;                       // canonical; Western numerals at display only
  source: 'manual' | 'import' | 'capability';
  quality: 'ok' | 'invalid';           // invalid rows are kept and marked, never dropped
}

// ---- Detection policy (versioned; policy-as-prose derives from these shapes) ----
export interface ThresholdBandSpec {
  kind: 'absolute' | 'percent-vs-baseline';
  warningEdge: number;                 // absolute value, or percent deviation (e.g. 15 = 15%)
  criticalEdge: number;
  sustainedPoints: number;             // consecutive offending points required (>= 1)
  tier: SeverityTier;                  // digest default; 'page' is the explicit opt-in
}
export interface AnomalyLayerSpec {
  sensitivitySigma: number;            // 1.5 .. 4.0; backtest preview is the tuning evidence
  minHistoryPoints: number;            // engine floor: 14 (two same-weekday cycles)
  tier: SeverityTier;                  // 'digest' by policy default
}
export interface DetectionPolicy {
  version: number;
  threshold?: ThresholdBandSpec;       // optional layer (works with zero history)
  anomaly?: AnomalyLayerSpec;          // optional layer (needs minHistoryPoints)
}
export interface Watch {
  id: string;
  workspaceId: string;
  feedId: string;
  nameEn: string;
  nameAr: string;                      // authored pair
  policy: DetectionPolicy;
  status: WatchStatus;
  pausedReason?: string;               // required when status = 'paused'
  resumeAt?: string;                   // default = season-window end when paused for a season
  lastEvaluatedAt?: string;
  lastRunPolicyVersion?: number;       // provenance: the version the last run used
  createdAt: string;
  updatedAt: string;
}

// ---- Season calendar (Gregorian-dated entities; Hijri presentation is display-only) ----
export interface SeasonWindow {
  id: string;
  workspaceId: string;
  nameEn: string;                      // e.g. "White Friday"
  nameAr: string;                      // e.g. "الجمعة البيضاء"
  startsAt: string;                    // ISO date
  endsAt: string;                      // ISO date (exclusive)
  expectedEffect: 'surge' | 'dip' | 'both';
  feedIds: string[];                   // affected feeds; empty list is honest and allowed
  version: number;
}

// ---- Explanations (the signature artifact) ----
export interface ExplanationPair {
  templateId: string;                  // e.g. 'anomaly.above' | 'threshold.warn.lower'
  en: string;                          // authored English sentence with number slots filled
  ar: string;                          // authored Arabic sentence — NOT a translation of en;
                                       // both derive from the same rule state (07c tables)
  slots: Record<string, number | string>; // the arithmetic both sentences share
}
export interface Narration {
  provenance: 'template' | 'assist';  // assist appends; never replaces the template pair
  en?: string;                         // present only when provenance = 'assist' (bound + succeeded)
  ar?: string;
  generatedAt: string;
}

// ---- Detections ----
export interface Detection {
  id: string;
  workspaceId: string;
  watchId: string;
  feedId: string;
  policyVersion: number;               // the version that produced this detection
  kind: DeviationKind;
  tier: SeverityTier;
  at: string;                          // offending point timestamp
  observed: number;
  baseline: number;                    // seasonal expected value at that point
  deviationSigma?: number;             // anomaly detections
  deviationPercent: number;
  sustainedPoints: number;             // how many consecutive points offend (>= 1)
  seasonAdjusted: boolean;             // true when the point sits in an active season window
  explanation: ExplanationPair;
  status: DetectionStatus;
  statusHistory: StatusEvent[];
  snooze?: { until: string; reason: string };       // present while status = 'snoozed'
  dismissal?: { reasonCode: DismissalReasonCode; note?: string; at: string; by: string };
  backtest: boolean;                   // backtest results never notify and never mutate status
}
export type DismissalReasonCode =
  | 'known-cause' | 'data-error' | 'expected-behavior' | 'wrong-threshold' | 'other';
export interface StatusEvent {
  status: DetectionStatus;
  at: string;
  byMemberId: string;
  note?: string;
}

// ---- Evaluation (deterministic engine output) ----
export interface EvaluationSummary {
  runId: string;
  mode: 'live' | 'backtest' | 'catch-up';
  windowDays?: number;                 // backtest only
  evaluatedWatches: number;
  detectionsEmitted: number;
  seasonSuspendedFeeds: string[];      // feeds whose anomaly layer was suspended this run
  policyVersions: Record<string, number>; // watchId -> policy version used (provenance)
  finishedAt: string;
}

// ---- Digests ----
export interface DigestItem {
  detectionId: string;
  feedNameEn: string;
  feedNameAr: string;
  tier: SeverityTier;
  kind: DeviationKind;
  observed: number;
  baseline: number;
  deviationPercent: number;
  explanation: ExplanationPair;        // the same pair as the detection (immutable echo)
  statusAtAssembly: DetectionStatus;
}
export interface Digest {
  id: string;
  workspaceId: string;
  period: 'daily' | 'weekly';
  date: string;                        // the digest's day (daily) or week-ending (weekly)
  assembledAt: string;                 // immutable once assembled
  asOfEvaluation: string;              // the evaluation run it was built from
  pageClassItems: DigestItem[];        // held at top, in both language sections
  sections: { feedId: string; nameEn: string; nameAr: string; items: DigestItem[] }[];
  seasonNotes: { windowNameEn: string; windowNameAr: string; suspendedFeedCount: number }[];
  quietDay: boolean;                   // honest zero-detection digest
  delivery: DeliveryRecord[];
}
export interface DeliveryRecord {
  memberId: string;
  channelKind: 'console' | 'external-channel';  // capability language (credential-contract §2)
  state: 'pending' | 'delivered' | 'failed';
  at?: string;
  error?: { code: string; message: string; correlationId: string };
  retryOf?: string;                    // idempotent retry lineage
}

// ---- Preferences (P21 tier ladder) ----
export interface DigestPreferences {
  memberId: string;
  pageClassDelivery: 'instant-console' | 'instant-console+channel'; // never digest — page is page
  digestClassDelivery: 'daily' | 'weekly' | 'off';
  locale: Locale;                      // which language section leads the delivered digest
}

// ---- Jobs (async-contract §2) ----
export interface ActivityEntry {       // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'feed-created' | 'ingest-run' | 'sync-run' | 'watch-created'
    | 'watch-updated' | 'watch-paused' | 'watch-resumed' | 'watch-deleted'
    | 'backtest-run' | 'evaluation-run' | 'detection-acknowledged'
    | 'detection-dismissed' | 'detection-snoozed' | 'digest-assembled'
    | 'digest-delivered' | 'season-window-upserted' | 'consent-change';
  targetRef: string;
  detail?: string;                     // e.g. policy version, reason code — provenance audit
  at: string;
}

