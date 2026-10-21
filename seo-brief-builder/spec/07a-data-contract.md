# 07a — Data Contract: seo-brief-builder

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — the clustering operation may bind an intent-clustering assist capability (abstract, 08); deterministic grouping is a first-class execution mode, not an error state. Parity computation and brief assembly are deterministic by construction and never require the assist. TypeScript declarations for every entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type IntentLabel = 'informational' | 'commercial' | 'transactional' | 'navigational';
export type ClusteringMode = 'assist' | 'deterministic';

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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';               // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;           // async-contract §5
}

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
```

## Relationships

Workspace 1—N Topic · Topic 1—N Keyword (per locale) · Topic 1—N Cluster (per locale) · Cluster N—M Keyword (membership via keywordIds/clusterId) · Topic 1—N ParityCheckResult (immutable snapshots pinned to cluster versions) · Topic 1—N Brief · Brief 1—N BriefSection · BriefSection N—M Cluster (evidence binding) · Brief 1—N ExportArtifact · Job spans ingest/serp-fetch/clustering/export work.

## Operations (summary; typed signatures in 07b)

Topics: create, list, get. Keywords: ingest (Job; manual/import), fetchKeywordSignals (Job; abstract SERP-data capability, consent-gated), list, update (override/excluded/note only). Clusters: runClustering (Job; assist|deterministic), list, get, update (name/intent-confirm/membership; versioned). Parity: runParityCheck (deterministic, synchronous, budget-bound per 10), getParityCheck, acceptParityGap. Briefs: assemble, get, list, updateBriefSection (versioned), setBriefStatus. Exports: exportBrief (Job), getArtifact. Platform: getSession, listJobs, getUsage.

## State obligations

- **Intent confirmation is the parity gate**: runParityCheck reads confirmed intents only; unconfirmed counts are reported, never blocking (03 CP-3 edge).
- **Provenance is never rewritten**: an assist-built cluster keeps provenance:'assist' through later human edits (recorded via intent state + version); the honest history is the audit trail (Yousef's defensibility demand, 02).
- **Parity results are immutable snapshots** keyed to cluster versions; re-running after edits creates a new result; gap acceptances carry across re-runs until cluster structure changes materially (12 Q-12).
- **Keywords are immutable post-ingest** except override/excluded/note — brief evidence cannot drift.
- **Partial-result policies**: ingest delivers ingested-so-far + named bad rows; export delivers per-format partial with per-format retry (async-contract §4); clustering is atomic per locale run.
- **No provider names anywhere** — the SERP-data path appears as source:'serp-capability' and an abstract need in 08.
