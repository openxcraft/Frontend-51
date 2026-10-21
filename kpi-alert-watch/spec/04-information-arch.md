# 04 — Information Architecture: kpi-alert-watch

## Navigation model

Left rail: **Console** (home) · **Digests** · **Jobs**. The console is the product's core mode — a queue, not a wall: open detections by severity with the page-class banner above, feed-health strip and watch chips below. One level deeper, three entities carry detail surfaces: **feed workspace** (series + ingestion + attached watches), **watch editor** (policy + backtest), **detection detail** (explanation card + context). **Detections** is a filterable triage list reachable from the console's "view all" and from digest items; **season calendar** and **settings** sit in the rail's secondary zone. ⌘K palette (P05 — list surfaces exceed three) reaches feeds, watches, detections, digests, and actions with bilingual normalized search (rtl-rules §4). Two-level IA: section → item; the digest view is a document surface (read-mode navigation, no authoring). Desktop-first; ≤767px: console, digest view, and detection detail are the responsive surfaces (the morning scan is one-handed); triage filters collapse to chips; feed/watch editing is desktop-only. 360px is a first-class width for CP-2 and CP-5.1 (09 reflow matrix).

## Entity overview (07a for full shapes)

MetricFeed → SeriesPoints (ingested daily/periodic values) → Watch (policy over one feed: threshold bands and/or anomaly sensitivity; tier; status) → Detection (evaluation output; bilingual explanation pair; status machine) → Digest (assembled from a date's detections; delivery records) · SeasonWindow (calendar entity consulted by the evaluation engine) · Job spans ingestion/sync/evaluation/delivery work · Member + DigestPreferences (P21 tier control per watch class).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Console home | page-class banner, open detection queue, feed-health strip, watch chips, first-run sample (P22) | listDetections, listFeeds, listWatches, getSession |
| S2 | Feed workspace | series with baseline band, ingestion (paste/import + capability tab), attached watches | getFeed, getMetricSeries, ingestMetricPoints, syncMetricFeed, listWatches |
| S3 | Watch editor | policy-as-prose authoring, sensitivity, tiers, backtest preview, version history | getWatch, getFeed, getMetricSeries, runEvaluation (backtest), createWatch, updateWatch |
| S4 | Detections triage | filterable list, bulk acknowledge, snooze/dismiss affordances, saved views (P08) | listDetections, updateDetectionStatus, deleteWatch (maintenance) |
| S5 | Detection detail | bilingual explanation card, series context chart, narration assist + provenance, actions | getDetection, narrateDetection, updateDetectionStatus |
| S6 | Digest view | the bilingual daily/weekly document; delivery state; per-item links | listDigests, generateDigest, getDigest, deliverDigest |
| S7 | Season calendar | windows list (past/active/queued), upsert, affected feeds, overlap disclosure | listSeasonWindows, upsertSeasonWindow, listFeeds |
| S8 | Jobs console | all job classes, cancel/retry, link-to-context (T3-consolidated) | listJobs |
| S9 | Settings | digest preferences (P21 ladder), consent state, baseline disclosure, usage meter | getDigestPreferences, updateDigestPreferences, getUsage, getSession |
| S10 | Command palette (overlay) | bilingual search across feeds/watches/detections/digests/actions | client-side over S1/S4/S6 data |

## Per-screen state obligations

Four empties per P01 (S1 first-run offers the seeded sample feed + sample watch — the explanation moment is experienceable before real data; S2 first-run teaches paste-first ingestion; S4 filtered-empty offers filter reset; S6 no-digest-yet distinguishes "today's digest assembles on first open" from "no evaluations have run"). Skeletons mirror final geometry per direction (P02) — the digest skeleton is a document skeleton, not a card wall. Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **The console is a queue, not a dashboard**: no KPI card gallery, no gauge wall (00 exclusions; the family posture recorded in 12 Q-4). The home surface is prioritized rows with explanations, mirroring the buyer's actual job — triage — rather than the incumbent's job — display. The feed-health strip is the only "wall-ish" element and it is three chips per feed, not a widget.
- **Digest is a first-class screen, not a notification**: the bilingual digest document is the signature artifact (00) and Shaikha's entire product surface (02); it earns its own read-mode IA with its own empty/loading/error states and its own delivery status.
- **Watch editor lives inside the feed's context**: a watch is a policy over a specific feed's series; separating them would hide the backtest's evidence (the series) from the policy being tuned — the fatigue guard only works with the evidence visible.
- **Detection detail is the explanation's home**: the bilingual explanation card, series context chart, and narration assist share one surface so that "what fired" and "why" are never more than one navigation apart (the anti-fatigue posture made structural).
- **Season calendar is small and honest**: a list + strip, not a planning board (bilingual-content-calendar owns planning; 12 Q-8 records the boundary) — windows are versioned data with dates and expected effects, nothing more.
- **Jobs consolidated (T3 posture)**: per async-contract §7, Tier 3 consolidates the job center into an activity surface — S8 is one console for ingestion/sync/evaluation/delivery with link-to-context, rather than per-class IA.
- **Settings is small and honest**: the baseline disclosure lives here AND on the series legend (ai-native-patterns §7.4 analog — disclosure at point-of-use, detail in settings); the digest tier ladder is per member, per class (P21).
