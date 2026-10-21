# 07b — Adapter Contract: seo-brief-builder (TypeScript, v1)

SME-G pass · `SeoBriefBuilderAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. Types only — no implementation. Entity semantics (Topic, Keyword, Cluster, IntentLabel, Brief, BriefSection, ParityCheckResult, Job, ExportArtifact): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
// Single contract surface. Entity types referenced below (BriefSection,
// ParityCheckResult — and their fields) are declared canonically in 07a and
// are part of this contract by reference; 07b declares only the operational
// wrappers (summaries, views, jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed ingest rows, parity gates, locale re-config)
 * 'NOT_FOUND'    -> NotFoundError     (stale topic/cluster/brief/artifact links)
 * 'PERMISSION'   -> PermissionError   (capability consent, workspace scoping)
 * 'CONFLICT'     -> ConflictError     (concurrent cluster/brief-section edits)
 * 'RATE_LIMIT'   -> RateLimitError    (assist runs, SERP-data fetches, exports)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, export delivery)
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
  role: 'owner' | 'editor' | 'viewer';  // viewer: read + export, no mutations
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export type IntentLabel = 'informational' | 'commercial' | 'transactional' | 'navigational';
export type Locale = 'ar' | 'en';
export type ClusteringMode = 'assist' | 'deterministic';

export interface TopicSummary {
  id: string;
  titleEn: string;
  titleAr?: string;
  locales: Locale[];
  market: string;
  status: 'draft' | 'researching' | 'brief-ready';
  keywordCounts: { ar: number; en: number };
  latestParityId?: string;
  latestBriefId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KeywordRow {
  id: string;
  topicId: string;
  locale: Locale;
  text: string;                      // verbatim, bidi-isolated at render (rtl-rules §2)
  normalized: string;                // system-computed, read-only, disclosed in-product
  volume?: number;                   // optional signal; Western numerals at display
  cpc?: number;
  source: 'manual' | 'import' | 'serp-capability';
  intentOverride?: IntentLabel;
  excluded: boolean;
  note?: string;
  clusterId?: string;
}

export interface ClusterSummary {
  id: string;
  topicId: string;
  locale: Locale;
  name: string;
  keywordCount: number;
  intent: {
    label: IntentLabel;
    state: 'suggested' | 'confirmed';
    suggestedBy: 'assist' | 'deterministic' | 'human';
    confirmedBy?: string;            // memberId
  };
  provenance: 'assist' | 'deterministic' | 'manual';
  normalizationApplied: boolean;
  version: number;
}

// Full entity shapes (Workspace, Topic, Keyword, Cluster, ParityGap,
// ParityCheckResult, Brief, BriefSection, Job, ExportArtifact, ActivityEntry)
// are declared canonically in 07a. 07b adds the derived display field:
export interface BriefSectionView extends BriefSection {
  staleClusterWarning: boolean;      // derived at read: cluster version moved past assembly
}

export interface BriefSummary {
  id: string;
  topicId: string;
  parityResultId: string;
  status: 'draft' | 'ready' | 'exported-versions-exist';
  version: number;
  sectionCount: number;
  updatedAt: string;
}

export interface Job<T> {
  id: string;
  kind: 'ingest' | 'serp-fetch' | 'clustering' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface SeoBriefBuilderAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // topics
  createTopic(input: {
    titleEn: string; titleAr?: string; locales: Locale[]; market: string;
  }): Promise<Result<TopicSummary, AdapterError>>;
  listTopics(query: {
    filter?: { locale?: Locale[]; status?: TopicSummary['status'][]; market?: string };
    search?: string;                    // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'createdAt' | 'titleEn';
    cursor?: string; limit: number;
  }): Promise<Result<Page<TopicSummary>, AdapterError>>;
  getTopic(id: string): Promise<Result<TopicSummary, AdapterError>>;

  // keyword ingestion (manual/import = the LOOP-5 always-available path)
  ingestKeywords(input: {
    topicId: string;
    locale: Locale;
    keywords: { text: string; volume?: number; cpc?: number }[];
    source: 'manual' | 'import';
    idempotencyKey: string;            // async-contract §5 — double-submit never double-ingests
  }): Promise<Result<Job<{ ingested: number; duplicates: number; invalidRows: string[] }>, AdapterError>>;

  // abstract SERP-data capability path (consent-gated; 08 N1)
  fetchKeywordSignals(input: {
    topicId: string;
    locale: Locale;
    seedTerms: string[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ added: number; source: 'serp-capability' }>, AdapterError>>;

  listKeywords(query: {
    topicId: string; locale?: Locale;
    filter?: { excluded?: boolean; intent?: IntentLabel[]; clusterId?: string; source?: KeywordRow['source'][] };
    search?: string;                    // matches normalized form; disclosure per ai-native-patterns §7.4
    sort: 'volume' | 'text' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<KeywordRow>, AdapterError>>;
  updateKeyword(id: string, patch: {
    intentOverride?: IntentLabel | null; excluded?: boolean; note?: string;
  }): Promise<Result<KeywordRow, AdapterError>>;

  // clustering (conditionally-AI: assist degrades to deterministic — 08 degradation map)
  runClustering(input: {
    topicId: string;
    locales: Locale[];
    mode: ClusteringMode;
    editPolicy: 'preserve' | 'discard';   // 'discard' only after the UI-side P04 level-2 confirm (03 CP-2.4)
    idempotencyKey: string;
  }): Promise<Result<Job<{ clusterIds: string[]; modeUsed: ClusteringMode; degraded: boolean }>, AdapterError>>;
  listClusters(query: {
    topicId: string; locale?: Locale;
    filter?: { intent?: IntentLabel[]; intentState?: ('suggested' | 'confirmed')[]; provenance?: ClusterSummary['provenance'][] };
    sort: 'keywordCount' | 'name' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ClusterSummary>, AdapterError>>;
  getCluster(id: string): Promise<Result<ClusterSummary & { keywords: KeywordRow[] }, AdapterError>>;
  updateCluster(id: string, patch: {
    name?: string;
    intent?: { label: IntentLabel; confirm: true };   // confirmation is explicit (P15 gate to parity)
    keywordIds?: string[];                            // manual membership moves
    baseVersion: number;
  }): Promise<Result<ClusterSummary, AdapterError>>;

  // intent parity (deterministic; synchronous — budget-bound per 10-performance)
  runParityCheck(topicId: string): Promise<Result<ParityCheckResult, AdapterError>>;
  getParityCheck(topicId: string): Promise<Result<ParityCheckResult, AdapterError>>;  // latest snapshot
  acceptParityGap(input: {
    topicId: string; parityResultId: string; gapIndex: number; note?: string;
  }): Promise<Result<ParityCheckResult, AdapterError>>;   // records acceptance; re-run carries it forward

  // briefs (deterministic assembly from cluster state)
  assembleBrief(input: {
    topicId: string;
    parityResultId?: string;           // defaults to latest
    includeGapsAsSections?: boolean;
  }): Promise<Result<BriefSummary, AdapterError>>;
  getBrief(id: string): Promise<Result<BriefSummary & { sections: BriefSectionView[] }, AdapterError>>;
  listBriefs(query: {
    filter?: { topicId?: string; status?: BriefSummary['status'][] };
    sort: 'updatedAt' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<BriefSummary>, AdapterError>>;
  updateBriefSection(input: {
    briefId: string; sectionId: string;
    patch: { text?: string; localeScope?: 'both' | 'ar' | 'en'; targetClusterIds?: string[]; order?: number };
    baseVersion: number;
  }): Promise<Result<BriefSummary & { sections: BriefSectionView[] }, AdapterError>>;
  setBriefStatus(id: string, status: 'ready'): Promise<Result<BriefSummary, AdapterError>>;

  // export handoff (abstract delivery; manual path is download/copy — 08 N3)
  exportBrief(input: {
    briefId: string;
    format: 'markdown' | 'writer-bundle';
    options: { parityAppendix?: boolean };
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; topicId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    assistRuns: number; deterministicRuns: number; serpFetches: number; exports: number;
    resetAt: string;
  }, AdapterError>>;
}
```

## Rules

1. **Assist honesty**: `runClustering` returns `modeUsed` + `degraded` — quota exhaustion or capability unavailability degrades the run to deterministic mode and says so; the UI surfaces provenance per cluster (P15/ai-native-patterns §5 ladder), never a silent rerun.
2. **Parity gate**: `runParityCheck` with zero confirmed intents on either locale → VALIDATION explaining the gate; with one locale empty of keywords → a valid single-locale notice inside the result (reported, not errored — 03 CP-3 edge). Parity reads confirmed intents only; unconfirmed counts are reported in `unconfirmedIntents`.
3. **Immutability**: keywords are post-ingest immutable except override/excluded/note; parity results are immutable snapshots; `acceptParityGap` records acceptance (a state on the gap, logged) rather than mutating computed fields.
4. **Stale-version semantics**: `updateCluster`/`updateBriefSection` with stale `baseVersion` → CONFLICT with both payloads in `details`; brief-section view `staleClusterWarning` is derived server-side from cluster versions at read time.
5. **Consent enforcement**: `fetchKeywordSignals` without a granted SERP-data consent → PERMISSION naming the capability class in capability language (credential-contract §4) — never a vendor name.
6. **Idempotency**: ingest/fetch/clustering/export submits carry idempotency keys; a retried submit returns the original job (async-contract §5).
7. **Jobs**: ingest and export declare partial policies (bad rows named; per-format retry); clustering is atomic per locale run. Progress is determinate in units (rows, keywords, formats) — never fake percentages (async-contract §3).
8. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass.
