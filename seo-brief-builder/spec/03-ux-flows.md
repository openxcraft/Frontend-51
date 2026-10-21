# 03 — UX Flows: seo-brief-builder

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation — no orphans.

## CP-1 — Topic → keyword ingestion → first clusters (value proof)

1. Dalia creates a topic: English title, Arabic title, locales (ar/en), market (e.g. "GCC"). `createTopic`
2. She opens the topic workspace: per-locale keyword table, empty on first run. She pastes her keyword export (text with optional volume/cost columns) or imports a file; ingestion is a Job per async-contract (paced, cancellable, row-count progress). `ingestKeywords` · `listJobs`
3. Alternative ingestion: the SERP-data capability path — she supplies seed terms, the abstract capability returns keyword sets with signals (consent-scoped; PERMISSION if unconsented). `fetchKeywordSignals`
4. Ingestion lands keywords with system-normalized forms visible on hover/panel (normalization disclosure, ai-native-patterns §7.4) and duplicate accounting in the job result. `listKeywords`
5. She runs clustering on both locales, mode visible: assist (if capability active) or deterministic grouping (always available). Job per async-contract; cluster canvas fills as the job progresses. `runClustering` · `getTopic`
6. First read: clusters with member counts, suggested intents, provenance chips (assisted vs deterministic). `listClusters` · `getCluster`

**Edges**: mixed-script rows in one paste (locale per row auto-detected, overridable); keywords with volume column absent (signals optional, never required); duplicate keywords (counted in job result, not silently dropped); a locale with zero keywords after ingestion (explicit per-locale empty state, P01); normalize-visible: two spellings of the same Arabic term group together and the normalization rule is disclosed.
**Failures**: malformed paste → VALIDATION with the first bad row named; capability path unconsented → PERMISSION with the consent surface linked; assist quota exhausted mid-run → run degrades to deterministic and the job result records the mode actually used (honest provenance — never silently reruns); ingestion job failure → typed error, retry, previously ingested rows kept (partial policy).
**Recovery**: keywords persist across re-runs; clustering is re-runnable and versioned; the topic never loses ingested data on job failure.

## CP-2 — Cluster refinement + intent confirmation (the daily loop)

1. Yousef opens the cluster canvas: cluster cards with member keywords (bidi-isolated rendering both scripts), suggested intent with confidence, provenance. `getCluster`
2. He overrides a cluster's suggested intent, renames a cluster, or moves keywords between clusters (keyboard equivalents for every move, P18). `updateCluster`
3. Keyword-level intent override or exclusion for the odd term (one keyword that doesn't fit any cluster's story). `updateKeyword`
4. Re-run clustering after major edits — a confirm names what changes (cluster memberships rebuilt; manual edits kept or discarded, his choice — P04 level 2). `runClustering`
5. Intent confirmation sweep: intent label per cluster goes suggested → confirmed; the parity check only reads confirmed intents (P15 gate — parity is a governance artifact). `updateCluster` (intent + confirmed)
6. Usage meter visible before/after assist runs (P14). `getUsage`

**Edges**: assisted suggestion disagrees with his manual label (both shown, human label wins, disagreement recorded in provenance); a cluster with mixed-intent members (split suggestion surfaces as an action); empty cluster after moves (auto-dissolved, logged); unconfirmed intents at parity time (parity lists them as "unconfirmed — confirm to include", never blocks).
**Failures**: stale cluster edit → CONFLICT with both payloads; assist unavailable on re-run → deterministic mode with notice (degradation ladder, 08); quota → RATE_LIMIT ladder notice, deterministic unaffected.
**Recovery**: cluster edits are versioned; intent confirmations persist across re-clustering as "human-confirmed" anchors.

## CP-3 — Intent-parity check + gap resolution (the signature flow)

1. Dalia runs the parity check on the topic: deterministic comparison of the two locales' confirmed cluster/intent structure. Synchronous, budget-bound (10-performance: <300ms at seed scale). `runParityCheck`
2. Parity view renders: intent × locale coverage matrix, matched cluster pairs, gap list — each gap names the intent, the locale missing it, and the anchor cluster on the side that has it. `getParityCheck`
3. She resolves a gap: create the counterpart cluster on the missing side (seeded from the anchor cluster's keywords) or explicitly accept the gap as intentional for this topic (market reality: some intents legitimately don't cross locales — acceptance is recorded with a reason, gaps become "accepted" not "open"). `updateCluster` (create-side) · `acceptParityGap` (accept-side)
4. Re-run parity after resolutions; the matrix updates; the result is versioned and viewable later. `runParityCheck` · `getParityCheck`

**Edges**: one locale has no keywords at all → parity returns a single-locale notice (cannot compare — honest, not an error); intents confirmed on one side only → those rows marked "unconfirmed on the other side"; volume skew between locales (declared, not judged — the product reports coverage, not strategy).
**Failures**: parity on a topic with no confirmed intents → VALIDATION explaining the gate; topic locale config changed after clustering → VALIDATION directing re-cluster.
**Recovery**: parity results are immutable snapshots keyed to cluster state; re-running never mutates history.

## CP-4 — Brief assembly → editing → export handoff

1. With confirmed intents and a parity result, Dalia assembles the brief: sections generated deterministically from cluster structure (headings from cluster names, question sections from informational clusters, terms from high-frequency members), parity gaps offered as sections. `assembleBrief`
2. Brief outline editor: reorder sections (keyboard alternative for drag, 2.5.7), edit text, bind/unbind target clusters, set a section's locale scope (both/ar/en). Autosave with revision base (P10); conflicts surface both versions (P10/P04). `updateBriefSection` · `getBrief`
3. Mark the brief ready (the handoff gate — status change is logged, P17). `setBriefStatus`
4. Export: markdown brief or writer-bundle (brief + cluster evidence appendix) — a Job with expiry + regeneration per async-contract. `exportBrief` · `getArtifact`
5. Handoff is export-only at v1: paste into the destination, or the abstract handoff-export capability when bound (08 N3; manual alternative always available). `listJobs`

**Edges**: brief references a cluster later edited → the section shows "cluster changed since assembly — re-assemble?" (evidence binding is the product's honesty, never silently stale); bilingual pair export → both locales' sections in one bundle with locale-scope marks; exporting with unconfirmed intents → allowed, flagged in the artifact (honest, not blocking).
**Failures**: stale section edit → CONFLICT both kept; export failure mid-bundle → partial policy (per-format retry, async-contract §4); artifact expired → NOT_FOUND with renew path.
**Recovery**: briefs re-assemble from current cluster state; exports re-generate from brief state; nothing is ever lost to an export failure.

## CP-5 — Library, jobs, and workspace management (the daily surface)

1. Topics home: list with keyword counts, parity state, latest brief status; filters + saved views (P08). `listTopics` · `getSession`
2. Briefs library: status, topic link, export history. `listBriefs`
3. Jobs console: ingestion/serp-fetch/clustering/export jobs with state, cancel/retry, link-to-context (async-contract §7). `listJobs`
4. Settings: default locale, normalization disclosure, assist-mode default, capability consent state (credential-contract: kind, not vendor). `getSession` · `getUsage`

**Edges**: filtered-empty declares itself (P01); >200 keyword rows virtualize (P19); no-access topics → PERMISSION surface, never "empty".
**Failures**: NETWORK mid-list → banner + retry (P20); quota read failure → usage surface degrades to "last known".
**Recovery**: all list surfaces cursor-paginated and re-fetchable; session locale switches re-render without data loss.

## Non-happy paths

- **Assist capability unavailable (rung 4, 08 map)**: clustering runs deterministic grouping with an explicit notice; intents come from cue rules; the full flow — including parity and export — completes (the 00 success signal).
- **No SERP-data capability bound (LOOP-5)**: manual paste/import is the primary path from first run; the capability path renders as optional with the consent surface, never as a wall.
- **First-run**: topics home offers a sample bilingual topic with pre-loaded keywords so the parity moment is experienceable before importing real work (P22 value checklist).
- **Offline**: reads work; writes queue with per-item state (P20); jobs reconcile to authoritative state on return (async-contract §5).

## Failure → error mapping

VALIDATION (malformed ingest rows, parity gate, topic/locale re-config) · NOT_FOUND (stale topic/cluster/brief/artifact links) · PERMISSION (capability consent, workspace scoping) · CONFLICT (concurrent cluster/brief edits) · RATE_LIMIT (assist runs, SERP-data fetches, exports) · NETWORK (list fetches, job polling, export delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-5.1/4, entry (role/locale) | `updateCluster` | CP-2.2/5, CP-3.3 |
| `createTopic` | CP-1.1 | `runParityCheck` | CP-3.1/4, CP-4.1 (input gate) |
| `listTopics` | CP-5.1 | `getParityCheck` | CP-3.2/4 |
| `getTopic` | CP-1.5, CP-5.1 (summary cards) | `acceptParityGap` | CP-3.3 (accept-side) |
| `ingestKeywords` | CP-1.2 | `assembleBrief` | CP-4.1 |
| `fetchKeywordSignals` | CP-1.3 | `getBrief` | CP-4.2 |
| `listKeywords` | CP-1.4, CP-2 (member tables) | `listBriefs` | CP-5.2 |
| `updateKeyword` | CP-2.3 (intent override, exclusion) | `setBriefStatus` | CP-4.3 |
| `runClustering` | CP-1.5, CP-2.4 | `updateBriefSection` | CP-4.2 |
| `listClusters` | CP-1.6, CP-2/3 (canvas) | `exportBrief` | CP-4.4 |
| `getCluster` | CP-2.1 | `getArtifact` | CP-4.4 |
| `getUsage` | CP-2.6, CP-5.4 | `listJobs` | CP-1.2, CP-4.5, CP-5.3 |

24 operations, 0 orphans (Critic-verified).
