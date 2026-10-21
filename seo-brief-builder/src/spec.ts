// GENERATED from specs-source/seo-brief-builder/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "seo-brief-builder",
 "title": "Seo Brief Builder",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "SeoBriefBuilderAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Marsad Violet",
  "pairing": "P15",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "outline-geometric",
  "motion": "crisp",
  "fonts": [
   "Mada",
   "Instrument Sans"
  ],
  "primary": "#6B66B4",
  "accent": "#48408B",
  "canvas": "#20202B"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Topics home",
   "purpose": "topic list, parity state, onboarding checklist (P22)",
   "shell": "",
   "data": "listTopics, createTopic, getTopic, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Topic workspace — Keywords",
   "purpose": "per-locale keyword table, normalization panel, ingest actions",
   "shell": "",
   "data": "listKeywords, ingestKeywords, updateKeyword, fetchKeywordSignals",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Topic workspace — Clusters",
   "purpose": "cluster canvas, assist affordances, intent assignment",
   "shell": "",
   "data": "runClustering, listClusters, getCluster, updateCluster, getUsage",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Topic workspace — Parity",
   "purpose": "intent × locale matrix, matched pairs, gap list + resolution",
   "shell": "",
   "data": "runParityCheck, getParityCheck, updateCluster, updateKeyword, acceptParityGap",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Topic workspace — Brief",
   "purpose": "outline editor, cluster binding, locale scope, assemble/ready/export",
   "shell": "",
   "data": "assembleBrief, getBrief, updateBriefSection, setBriefStatus, exportBrief",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Briefs library",
   "purpose": "status, topic link, export history, artifact links",
   "shell": "",
   "data": "listBriefs, getArtifact",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Jobs console",
   "purpose": "all job classes, cancel/retry, link-to-context",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Settings",
   "purpose": "locale defaults, assist default, normalization disclosure, consent state",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  },
  {
   "id": "S9",
   "name": "Command palette (overlay)",
   "purpose": "bilingual search across topics/briefs/jobs",
   "shell": "",
   "data": "client-side over S1/S6/S7 data",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Topic → keyword ingestion → first clusters (value proof)",
   "steps": [
    "Dalia creates a topic: English title, Arabic title, locales (ar/en), market (e.g. \"GCC\"). createTopic",
    "First read: clusters with member counts, suggested intents, provenance chips (assisted vs deterministic). listClusters · getCluster",
    "*Recovery: keywords persist across re-runs; clustering is re-runnable and versioned; the topic never loses ingested data on job failure."
   ]
  },
  {
   "title": "CP-2 — Cluster refinement + intent confirmation (the daily loop)",
   "steps": [
    "He overrides a cluster's suggested intent, renames a cluster, or moves keywords between clusters (keyboard equivalents for every move, P18). updateCluster",
    "Keyword-level intent override or exclusion for the odd term (one keyword that doesn't fit any cluster's story). updateKeyword",
    "Usage meter visible before/after assist runs (P14). getUsage",
    "*Recovery: cluster edits are versioned; intent confirmations persist across re-clustering as \"human-confirmed\" anchors."
   ]
  },
  {
   "title": "CP-3 — Intent-parity check + gap resolution (the signature flow)",
   "steps": [
    "Re-run parity after resolutions; the matrix updates; the result is versioned and viewable later. runParityCheck · getParityCheck",
    "*Recovery: parity results are immutable snapshots keyed to cluster state; re-running never mutates history."
   ]
  },
  {
   "title": "CP-4 — Brief assembly → editing → export handoff",
   "steps": [
    "Mark the brief ready (the handoff gate — status change is logged, P17). setBriefStatus",
    "Export: markdown brief or writer-bundle (brief + cluster evidence appendix) — a Job with expiry + regeneration per async-contract. exportBrief · getArtifact",
    "*Recovery: briefs re-assemble from current cluster state; exports re-generate from brief state; nothing is ever lost to an export failure."
   ]
  },
  {
   "title": "CP-5 — Library, jobs, and workspace management (the daily surface)",
   "steps": [
    "Topics home: list with keyword counts, parity state, latest brief status; filters + saved views (P08). listTopics · getSession",
    "Briefs library: status, topic link, export history. listBriefs",
    "Jobs console: ingestion/serp-fetch/clustering/export jobs with state, cancel/retry, link-to-context (async-contract §7). listJobs",
    "*Edges: filtered-empty declares itself (P01); >200 keyword rows virtualize (P19); no-access topics → PERMISSION surface, never \"empty\".",
    "*Failures: NETWORK mid-list → banner + retry (P20); quota read failure → usage surface degrades to \"last known\".",
    "*Recovery: all list surfaces cursor-paginated and re-fetchable; session locale switches re-render without data loss."
   ]
  }
 ],
 "components": [
  {
   "name": "KeywordTable",
   "purpose": "per-locale keyword rows: text (bidi-isolated, own-direction rendering), normalized form (expandable panel — normalization disclosure per ai-native-patterns §7.4), volume/cost cells, intent override, exclude toggle",
   "obligations": "P18 grid (arrow navigation, range selection); virtualized >200 rows (P19) with focus preservation; mixed-script rows never force ambient direction; Western numerals; normalization panel is keyboard-reachable and SR-readable; row menu has visible button equivalents"
  },
  {
   "name": "ClusterCanvas",
   "purpose": "the cluster view: cluster cards (name, member count, intent chip + confidence, provenance chip assisted/deterministic) with member keywords listed inside",
   "obligations": "Drag-to-move between clusters has keyboard equivalent (move-to-cluster menu — 2.5.7); card semantics = list items, canvas is a list of cards (SR); assist suggestions render as labeled suggestions with accept/override actions (P15 draft-by-default); provenance chip is icon+text, never color-only"
  },
  {
   "name": "IntentSelector",
   "purpose": "intent assignment control for a cluster or keyword: 4 canonical intents, suggested-vs-confirmed state",
   "obligations": "Radio-group semantics with visible labels; suggestion state announced politely on focus; confirmation is an explicit action (the P15 gate feeding parity); commercial text uses commercial-deep (contrast contract, 05)"
  },
  {
   "name": "ParityMatrix",
   "purpose": "intent × locale coverage grid with matched pairs and gap list; each cell carries counts as text (never heat-only, per charts.csv contract)",
   "obligations": "Table semantics with row/column headers announced; gap rows are focusable with resolve/accept actions; accepted-gap state uses strikethrough+icon+label (never color alone); both locale columns render at their own direction; matrix state change always paired with text delta + polite announcement"
  },
  {
   "name": "BriefOutlineEditor",
   "purpose": "section list: role icon, text, locale-scope mark, bound-cluster chips, reorder",
   "obligations": "Reorder drag has keyboard equivalent (⌘↑/⌘↓ — 2.5.7); autosave status persistent (P10); stale-cluster warning chip per section (\"cluster changed since assembly\"); section-to-cluster binding is visible SR text (\"3 clusters bound\"); conflict surfaces both versions inline"
  }
 ],
 "ops": [
  "getSession",
  "createTopic",
  "listTopics",
  "getTopic",
  "ingestKeywords",
  "fetchKeywordSignals",
  "listKeywords",
  "updateKeyword",
  "runClustering",
  "listClusters",
  "getCluster",
  "updateCluster",
  "runParityCheck",
  "getParityCheck",
  "acceptParityGap",
  "assembleBrief",
  "getBrief",
  "listBriefs",
  "updateBriefSection",
  "setBriefStatus",
  "exportBrief",
  "getArtifact",
  "listJobs",
  "getUsage"
 ],
 "entities": [
  {
   "name": "Workspace",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "assistDefault",
     "optional": false,
     "type": "ClusteringMode"
    },
    {
     "name": "normalizationDisclosure",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Topic",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "workspaceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "titleEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "titleAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "locales",
     "optional": false,
     "type": "Locale[]"
    },
    {
     "name": "market",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'draft' | 'researching' | 'brief-ready'"
    },
    {
     "name": "keywordCounts",
     "optional": false,
     "type": "{ ar: number; en: number }"
    },
    {
     "name": "latestParityId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "latestBriefId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Keyword",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "topicId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "normalized",
     "optional": false,
     "type": "string"
    },
    {
     "name": "volume",
     "optional": true,
     "type": "number"
    },
    {
     "name": "cpc",
     "optional": true,
     "type": "number"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'manual' | 'import' | 'serp-capability'"
    },
    {
     "name": "intentOverride",
     "optional": true,
     "type": "IntentLabel"
    },
    {
     "name": "excluded",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "clusterId",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Cluster",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "topicId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "keywordIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "intent",
     "optional": false,
     "type": "{"
    },
    {
     "name": "label",
     "optional": false,
     "type": "IntentLabel"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'suggested' | 'confirmed'"
    },
    {
     "name": "suggestedBy",
     "optional": false,
     "type": "'assist' | 'deterministic' | 'human'"
    },
    {
     "name": "confirmedBy",
     "optional": true,
     "type": "string"
    },
    {
     "name": "provenance",
     "optional": false,
     "type": "'assist' | 'deterministic' | 'manual'"
    },
    {
     "name": "normalizationApplied",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "ParityGap",
   "fields": [
    {
     "name": "intent",
     "optional": false,
     "type": "IntentLabel"
    },
    {
     "name": "anchorLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "anchorClusterName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "missingIn",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'open' | 'accepted'"
    },
    {
     "name": "acceptanceNote",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "ParityCheckResult",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "topicId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "clusterSnapshot",
     "optional": false,
     "type": "{ arVersion: number; enVersion: number }"
    },
    {
     "name": "matrix",
     "optional": false,
     "type": "{ intent: IntentLabel; arClusters: number; enClusters: number }[]"
    },
    {
     "name": "matchedPairs",
     "optional": false,
     "type": "{"
    },
    {
     "name": "arClusterId",
     "optional": false,
     "type": "string; enClusterId: string"
    },
    {
     "name": "intent",
     "optional": false,
     "type": "IntentLabel; similarity: number"
    },
    {
     "name": "gaps",
     "optional": false,
     "type": "ParityGap[]"
    },
    {
     "name": "balance",
     "optional": false,
     "type": "{ arKeywords: number; enKeywords: number }"
    },
    {
     "name": "unconfirmedIntents",
     "optional": false,
     "type": "{ locale: Locale; count: number }"
    },
    {
     "name": "generatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ExportArtifact",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "briefId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "format",
     "optional": false,
     "type": "'markdown' | 'writer-bundle'"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "regenerable",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "includesParityAppendix",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "ActivityEntry",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "workspaceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "action",
     "optional": false,
     "type": "'topic-created' | 'ingest-run' | 'clustering-run' | 'intent-confirmed'"
    },
    {
     "name": "targetRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "detail",
     "optional": true,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "TopicSummary",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "titleEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "titleAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "locales",
     "optional": false,
     "type": "Locale[]"
    },
    {
     "name": "market",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'draft' | 'researching' | 'brief-ready'"
    },
    {
     "name": "keywordCounts",
     "optional": false,
     "type": "{ ar: number; en: number }"
    },
    {
     "name": "latestParityId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "latestBriefId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "KeywordRow",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "topicId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "normalized",
     "optional": false,
     "type": "string"
    },
    {
     "name": "volume",
     "optional": true,
     "type": "number"
    },
    {
     "name": "cpc",
     "optional": true,
     "type": "number"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'manual' | 'import' | 'serp-capability'"
    },
    {
     "name": "intentOverride",
     "optional": true,
     "type": "IntentLabel"
    },
    {
     "name": "excluded",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "clusterId",
     "optional": true,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 topics first-run",
   "\"No topics yet. Bring one bilingual topic and its keyword lists — or open the sample and watch the parity check find a gap.\"",
   "\"لا مواضيع بعد. أحضر موضوعاً ثنائي اللغة مع قائمتي كلماته المفتاحية — أو افتح العيّنة وشاهد فحص المطابقة يكتشف فجوة.\"",
   "New topic / Open sample topic",
   "S1 filtered-empty"
  ],
  "loading": [
   "S1 list skeleton",
   "skeleton rows ×8 + \"Loading your topics…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل مواضيعك…\"",
   "Ingest job (determinate)",
   "\"Importing 120 of 400 rows — 'متاجر جاهزه' recognized as a spelling variant of 'متاجر إلكترونية جاهزة'.\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (malformed ingest row)",
   "\"Row 17 has no keyword text — rows around it imported fine. Fix row 17 and import just it.\"",
   "\"السطر 17 بلا نص كلمة — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده.\"",
   "VALIDATION (parity gate)"
  ],
  "success": [
   "Ingest done",
   "\"400 rows in, 12 duplicates counted, 2 invalid skipped — every one listed.\"",
   "\"دخل 400 صف، وحُسبت 12 تكراراً، وتُخطي 2 غير صالحة — كلها مدرجة.\"",
   "Clustering done (deterministic)",
   "\"6 clusters from 14 keywords — deterministic grouping, no capability used.\""
  ]
 },
 "briefLine": "The product's second face is the one no competitor ships: the intent-parity check. Bilingual teams in MENA routinely maintain an Arabic content plan and an English content plan for the same topic, built from two keyword universes that nobody reconciles — the Arabic plan quietly misses the transactional intent the English plan covers, or the English plan never answers the informational questions Arabic searchers actually ask (evidence in 01). seo-brief-builder compares the two locales' clustered intent structure and produces a parity result: an intent-by-locale coverage matrix, matched cluster pairs, and named gaps — an intent present in one locale with no counterpart in the other. Gaps can be resolved into brief sections, so both content plans are brought into honest alignment before a single word is commissioned. The check is deterministic comparison logic, not an AI judgment — the same cluster state always yields the same parity result, which is exactly what a QA artifact requires."
} as const;
export type Spec = typeof SPEC;
