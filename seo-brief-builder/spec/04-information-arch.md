# 04 — Information Architecture: seo-brief-builder

## Navigation model

Left rail: **Topics** (home) · **Briefs** · **Jobs**. The topic workspace is the product's core mode — one topic, four stacked surfaces switched by tabs: **Keywords** (per-locale table) · **Clusters** (cluster canvas + intent assignment) · **Parity** (intent-coverage view) · **Brief** (outline editor). ⌘K palette (P05 — list surfaces exceed three) reaches topics, briefs, and jobs with bilingual search normalization (alef variants, taa marbuta, yaa forms — rtl-rules §4). Two-level IA: section → item; the topic workspace is item detail with locale tabs as the persistent dimension. Desktop-first; ≤767px: Topics/Briefs/Parity read-only, keyword table collapses to a card list.

## Entity overview (07a for full shapes)

Topic → Keywords (per locale) → Clusters (group keywords per locale, carry intent) → ParityCheckResult (compares locales' cluster/intent structure) → Brief → BriefSections (bind to clusters) → ExportArtifacts. Jobs wrap ingestion, capability fetches, clustering runs, and exports. Workspace holds locale defaults and normalization disclosure.

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Topics home | topic list, parity state, onboarding checklist (P22) | listTopics, createTopic, getTopic, getSession |
| S2 | Topic workspace — Keywords | per-locale keyword table, normalization panel, ingest actions | listKeywords, ingestKeywords, updateKeyword, fetchKeywordSignals |
| S3 | Topic workspace — Clusters | cluster canvas, assist affordances, intent assignment | runClustering, listClusters, getCluster, updateCluster, getUsage |
| S4 | Topic workspace — Parity | intent × locale matrix, matched pairs, gap list + resolution | runParityCheck, getParityCheck, updateCluster, updateKeyword, acceptParityGap |
| S5 | Topic workspace — Brief | outline editor, cluster binding, locale scope, assemble/ready/export | assembleBrief, getBrief, updateBriefSection, setBriefStatus, exportBrief |
| S6 | Briefs library | status, topic link, export history, artifact links | listBriefs, getArtifact |
| S7 | Jobs console | all job classes, cancel/retry, link-to-context | listJobs |
| S8 | Settings | locale defaults, assist default, normalization disclosure, consent state | getSession, getUsage |
| S9 | Command palette (overlay) | bilingual search across topics/briefs/jobs | client-side over S1/S6/S7 data |

## Per-screen state obligations

Four empties per P01 (S1 first-run offers the sample bilingual topic; S2 first-run teaches paste-first ingestion; S4 parity empty distinguishes no-keywords-one-locale from unconfirmed-intents; S6 briefs empty points to the topic that has clusters). Skeletons mirror final geometry per direction (P02). Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **Locale is a tab, never a separate screen**: the parity product promise is that both locales are one topic's two faces — the IA must keep them one navigational object (P23 sibling logic: keyword tables and parity matrix render both scripts side-by-side where comparison is the job).
- **Parity is a first-class tab, not a report buried in brief assembly**: the parity check is the signature artifact (00) and Dalia's governance surface — it earns its own surface with its own empty/loading/error states.
- **Brief lives inside the topic workspace**: a brief is assembled from the topic's cluster state; separating them would re-create the brief-drift problem the product exists to kill (02 complaints).
- **Jobs consolidated (T3 posture)**: per async-contract §7, Tier 3 may consolidate the job center into an activity surface — S7 is a single console for all four job classes with link-to-context, rather than per-class IA.
- **Settings is small and honest**: normalization disclosure lives here AND on the keyword panel (ai-native-patterns §7.4) — disclosure at point-of-use, detail in settings.
