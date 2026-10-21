# 07a — Data Contract: kpi-alert-watch

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — exactly one surface (anomaly narration assist) may bind an abstract model capability (08 N2); the template explanation engine, the baseline/threshold/seasonal engines, backtest counting, and digest assembly are deterministic by construction and never require the capability. TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type FeedDirection = 'higher-is-better' | 'lower-is-better';
export type DataCadence = 'daily' | 'weekly';

export type SeverityTier = 'page' | 'digest';      // cadence tier: interrupt vs digest-class
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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                   // per-kind partial policy (07b rules)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;              // async-contract §5
}

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
```

## Relationships

Workspace 1—N Member · Workspace 1—N MetricFeed · MetricFeed 1—N MetricPoint · MetricFeed 1—N Watch · Watch 1—N Detection (each pinned to the policy version that produced it) · Workspace 1—N SeasonWindow (feedIds reference feeds; overlap permitted, disclosed) · Evaluation run 1—N Detection · Digest 1—N DigestItem (echo of detection explanations — immutable once assembled) · Digest 1—N DeliveryRecord (per member) · Member 1—1 DigestPreferences · Job spans ingest/sync/evaluation/digest-delivery · ActivityEntry records every consequential mutation.

## State obligations (lifecycle invariants)

- **The detection status machine is closed**: `open → acknowledged | dismissed | snoozed`; `snoozed → open` happens ONLY by expiry (never by hand — un-snoozing is a new decision recorded as a new event); `dismissed` is terminal (the record and reason are permanent journal entries). Concurrent transitions on one detection → CONFLICT (07b).
- **Explanations are immutable echoes**: a detection's ExplanationPair is composed at evaluation time and never recomputed or edited; policy edits produce NEW detections under the new version, never rewrites of old ones. Digest items echo the pair verbatim.
- **Provenance is never rewritten**: `lastRunPolicyVersion` and each detection's `policyVersion` record what actually ran; a watch edited mid-run completes the run on the old policy and the next run picks up the new one (03 CP-3 edge).
- **Backtest purity**: detections with `backtest: true` are read-only projections — they never enter the console queue, never notify, never mutate status, and are recomputed from stored series + candidate policy on demand.
- **Season-window semantics**: within an active window, the anomaly layer suspends for affected feeds (`seasonAdjusted: true` on such points); declared threshold layers still evaluate (hard limits ignore seasons); suspension is the union of overlapping windows.
- **Snooze is bounded**: max 14 days (07b rule); expiry re-opens the detection with a resumption event; a snooze never outlives its watch (watch deletion orphans the record but not the journal — records persist).
- **Feed deletion fence**: a feed with live watches requires explicit cascade (watches deleted first, detections retained as journal) — the P04 level-2 consequence chain (03 CP-3 edge).
- **Digest immutability**: a digest document is assembled once from completed evaluation results; same-day re-render is byte-identical; delivery records append, never rewrite the document.
- **Partial-result policies**: ingest delivers ingested-so-far + named invalid rows; sync fails per-feed with per-feed retry; evaluation is atomic per watch; digest delivery fails per-member with per-member retry (async-contract §4).
- **No provider names anywhere** — the capability path appears as `source: 'capability'` and abstract needs in 08.
