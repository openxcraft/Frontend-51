# 07b — Adapter Contract: kpi-alert-watch (TypeScript, v1)

SME-G pass · `KpiAlertWatchAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session, idempotency keys, partial-result policies, and 11 binding rules. Types only — no implementation. Entity semantics (Workspace, Member, MetricFeed, MetricPoint, Watch, DetectionPolicy, SeasonWindow, ExplanationPair, Narration, Detection, Digest, DigestPreferences, Job, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
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
```

## Rules (binding)

1. **Explanation determinism**: every detection's `ExplanationPair` is composed by the template engine from rule state (baseline, observed, band, duration, season flag) using the fixed bilingual tables (07c) — never from the narration capability, never machine-translated. `narrateDetection` returns the template pair verbatim on every path; assist text appends below it with `provenance: 'assist'`. An assist failure degrades to `provenance: 'template'` with zero content loss — never a spinner, never a blank.
2. **Digest-first cadence**: detections land digest-class unless a policy layer explicitly declares `tier: 'page'`; the adapter refuses nothing else — page-class is an explicit opt-in recorded in policy data (the P21 ladder's cost discipline, 03 CP-3.3).
3. **Backtest purity**: `runEvaluation` with `mode: 'backtest'` computes over stored series + candidate policy, returns `BacktestReport`, emits no detections into the console queue, sends no notifications, and mutates no status (07a invariant); backtest is idempotent per (series, policy, window).
4. **Status machine enforcement**: `updateDetectionStatus` validates the closed machine (`open → acknowledged | dismissed | snoozed`; `snoozed → open` only by expiry job, never by hand); snooze requires `reason` and `days ∈ {1,3,7,14}` (14-day cap); dismissal requires `reasonCode`; stale `baseStatus` → CONFLICT with both payloads in `details`.
5. **Season-window semantics**: within active windows, the anomaly layer suspends for affected feeds (`seasonAdjusted: true`); threshold layers still evaluate; overlapping windows union. Suspensions are reported in every evaluation summary and digest season note — never silent.
6. **Consent enforcement**: `syncMetricFeed` without a granted metric-source consent → PERMISSION naming the capability class in capability language (credential-contract §2/§4) — never a vendor name. Viewer-role mutation attempts (watch/policy/status/season edits) → PERMISSION with the seat's honest scope named.
7. **Idempotency**: ingest/sync/evaluation/deliver/generateDigest submits carry idempotency keys; a retried submit returns the original job or document (async-contract §5); `generateDigest` for the same (period, date) returns the identical immutable document.
8. **Version conflict semantics**: `updateWatch`/`upsertSeasonWindow` with stale `baseVersion` → CONFLICT with both payloads; watch edits mid-run apply to the next evaluation and the running job stamps the policy version it used (provenance never rewritten).
9. **Partial-result policies**: ingest delivers ingested-so-far + named invalid rows (invalid rows are kept and marked, not dropped); sync fails per-feed with per-feed retry; evaluation is atomic per watch (a failed watch never blocks its siblings); digest delivery fails per-member with per-member retry — the digest document itself is never lost to a delivery failure (async-contract §4).
10. **Catch-up honesty**: `runEvaluation` with `mode: 'catch-up'` (missed cadence intervals) emits detections stamped with the true offending timestamps and marks the run `catch-up` — never presenting stale detections as fresh (03 CP-4 edge).
11. **Typed pagination on every list; cursors opaque; no orphan methods** — the 03 coverage table is the contract (27 operations, 0 orphans, Critic-verified).
