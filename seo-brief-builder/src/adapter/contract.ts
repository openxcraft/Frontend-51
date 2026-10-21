// VERBATIM from specs-source/seo-brief-builder/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;
  assistDefault: ClusteringMode;
  normalizationDisclosure: string;   // rendered ruleset version (ai-native-patterns §7.4)
}
export interface Topic {
  id: string;
  workspaceId: string;
  titleEn: string;
  titleAr?: string;
  locales: Locale[];                 // 1 or 2 — single-locale topics supported (12 Q-13)
  market: string;                    // free-text geo string, e.g. "GCC"
  status: 'draft' | 'researching' | 'brief-ready';
  keywordCounts: { ar: number; en: number };
  latestParityId?: string;
  latestBriefId?: string;
  createdAt: string;
  updatedAt: string;
}
export interface Keyword {
  id: string;
  topicId: string;
  locale: Locale;
  text: string;                      // verbatim as entered; bidi-isolated at render
  normalized: string;                // system-computed, read-only, disclosed in-product
  volume?: number;                   // optional signal; never required (12 Q-11)
  cpc?: number;
  source: 'manual' | 'import' | 'serp-capability';
  intentOverride?: IntentLabel;      // keyword-level human override
  excluded: boolean;
  note?: string;                     // reason when excluded (11 E)
  clusterId?: string;                // membership set by clustering / manual moves
  createdAt: string;
}
export interface Cluster {
  id: string;
  topicId: string;
  locale: Locale;
  name: string;                      // authored in the cluster's own locale (12 Q-9)
  keywordIds: string[];
  intent: {
    label: IntentLabel;
    state: 'suggested' | 'confirmed';
    suggestedBy: 'assist' | 'deterministic' | 'human';
    confirmedBy?: string;            // memberId — the P15 human gate
  };
  provenance: 'assist' | 'deterministic' | 'manual';
  normalizationApplied: boolean;     // ≥1 member grouped via normalization rules
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface ParityGap {
  intent: IntentLabel;
  anchorLocale: Locale;              // the locale that HAS coverage
  anchorClusterName: string;
  missingIn: Locale;                 // the locale lacking it
  state: 'open' | 'accepted';
  acceptanceNote?: string;           // required when state = 'accepted'
}
export interface ParityCheckResult {
  id: string;
  topicId: string;
  clusterSnapshot: { arVersion: number; enVersion: number };  // immutable evidence pin
  matrix: { intent: IntentLabel; arClusters: number; enClusters: number }[];
  matchedPairs: {
    arClusterId: string; enClusterId: string;
    intent: IntentLabel; similarity: number;
  }[];
  gaps: ParityGap[];
  balance: { arKeywords: number; enKeywords: number };
  unconfirmedIntents: { locale: Locale; count: number };      // reported, never blocking
  generatedAt: string;
}
export interface BriefSection {
  id: string;
  role: 'heading' | 'question' | 'term' | 'note';
  text: string;
  localeScope: 'both' | 'ar' | 'en';
  targetClusterIds: string[];        // evidence binding
  order: number;
}
export interface Brief {
  id: string;
  topicId: string;
  parityResultId: string;            // assembly pins the parity snapshot it used
  status: 'draft' | 'ready' | 'exported-versions-exist';
  version: number;
  sections: BriefSection[];
  createdAt: string;
  updatedAt: string;
}
export type JobKind = 'ingest' | 'serp-fetch' | 'clustering' | 'export';
export interface ExportArtifact {
  id: string;
  briefId: string;
  format: 'markdown' | 'writer-bundle';
  expiresAt: string;                // declared retention window at creation
  regenerable: boolean;
  includesParityAppendix: boolean;
}
export interface ActivityEntry {    // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'topic-created' | 'ingest-run' | 'clustering-run' | 'intent-confirmed'
    | 'parity-run' | 'gap-accepted' | 'brief-ready' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                  // e.g. clustering mode used — provenance audit
  at: string;
}

