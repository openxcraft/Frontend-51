# 03 — UX Flows: kpi-alert-watch

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation — no orphans.

## CP-1 — Feed → paste ingestion → first watch → first explained detection (value proof)

1. Hessa creates a metric feed: bilingual name ("متوسط زمن التوصيل" / "Average delivery time"), unit (minutes), direction (lower-is-better), data cadence (daily). `createFeed`
2. Feed workspace opens with the four first-run empties distinguished (P01: no data yet — teach paste-first). The console home's feed-health strip lists the new feed as "no data". `listFeeds`
3. She pastes eight weeks of daily numbers (date, value rows) or imports a file — ingestion is a Job per async-contract: paced, cancellable, row-count progress, duplicate/invalid accounting. The metric-source capability path renders as an optional second tab, never a wall (LOOP-5). `ingestMetricPoints` · `listJobs`
4. The series renders with its computed baseline band (same-weekday seasonal mean ± 2.5σ over the trailing 8 weeks, season windows excluded — the engine's rule, disclosed on the baseline legend). Hover/keyboard inspect on any point shows observed, expected, and deviation. `getMetricSeries` · `getFeed`
5. She authors the watch: threshold bands (warning from 34 min, critical from 40 min, sustained 2 points) with severity digest-class; optional anomaly layer (sensitivity 2.5σ, digest-class). Before save, the **backtest preview** runs the policy over the trailing window and reports the count: "4 detections in the last 60 days — 1 inside the Saudi National Day season window (season-adjusted), 1 matching a reason you previously dismissed". Backtest results are read-only, flagged `backtest`, never notifications. `runEvaluation` (mode: backtest) → then `createWatch`
6. Live evaluation runs against the newest data (Job; deterministic engine; per-watch progress). New detections land in the console feed. `runEvaluation` (mode: live)
7. The detection feed lists the new detection: feed name, observed vs baseline, delta in σ or %, tier chip (digest/page), status open. `listDetections`
8. She opens the detection: the **bilingual threshold explanation card** renders both authored sentences with the same numbers — baseline, observed, band arithmetic, duration — plus the series context chart with the offending point marked. Provenance chip: "template" (narration assist unbound by default). `getDetection`

**Edges**: mixed-script paste (Latin metric names inside Arabic-labeled rows — locale per row detected, overridable); a pasted row with a date but no value (row kept, marked invalid in the job result — never silently dropped); duplicate date (counted, both kept verbatim); feed created but zero points yet (explicit per-feed empty state, P01); a watch on a feed with <14 points of history (baseline needs two same-weekday cycles — the editor says so and offers threshold-only mode, the deterministic fallback that needs no history).
**Failures**: malformed paste → VALIDATION naming the first bad row, prior-good rows kept (partial policy); capability path unconsented → PERMISSION naming the metric-source capability class in capability language (credential-contract §2); evaluation job failure → typed error + retry, previously evaluated watches unaffected (per-watch atomicity).
**Recovery**: points persist across failed jobs; backtests are pure reads over stored series; the feed never loses ingested data on a job failure.

## CP-2 — The morning digest loop (the signature flow)

1. 8:00 seeded-time. Hessa opens the console: the daily digest banner names the counts (4 detections across 3 feeds — 3 digest-class, 1 page-class item held at top; DG1's fixture arithmetic). The digest was assembled deterministically from yesterday's evaluation results. `listDigests` · `generateDigest` (idempotent — same day re-renders the same document; today's digest assembles on first open if the scheduled run has not fired)
2. The digest document renders bilingually: per-feed sections in both languages (per-side direction rendering, P23 sibling logic), every item carrying its explanation pair, tier chips, and status marks; season note rendered when a window is active on the digest's date ("نافذة موسمية: اليوم الوطني السعودي نشطة — الرصد الموسمي معلّق لـ3 من التغذيات. قواعد العتبة تبقى نافذة." / "Season window: Saudi National Day active — seasonal watching paused for 3 feeds. Threshold rules remain live." — the seeded DG3 fixture). `getDigest`
3. She opens one item's detection detail from the digest (deep link, context preserved). `getDetection`
4. She **acknowledges** one detection (it stays recorded, leaves the open queue), **dismisses** one with a reason ("rain storm — known cause", free text + reason code), and **snoozes** one for 3 days (reason required, expiry displayed, auto-resume promised in copy). Each transition is a state machine step with undo window (P03) for acknowledge; dismissal is P04 level-2 (names what is kept: the record, the reason, the journal entry). `updateDetectionStatus`
5. On the page-class item she runs the **narration assist** (bound+consented workspaces only): the narrative section appends with provenance "assist"; with the capability unbound, the same action renders the template narration with provenance "template" — the degradation IS the default text, never a spinner or blank (ai-native-patterns §2/§8). `narrateDetection`
6. Weekly digest delivery for the digest-reader seat: Shaikha's weekly digest renders and delivers through the abstract notification channel (Job; retry per digest); the manual alternative — the in-console digest view — is always stated in the delivery settings. `deliverDigest`
7. Cadence tier control lives in preferences: per watch class (page-class instant vs daily digest vs weekly digest), per member (P21 ladder). `getDigestPreferences`

**Edges**: a digest with zero detections (renders as the honest quiet day — "لا انحرافات اليوم" — with feed-health summary, never as an error); digest assembled mid-evaluation (assembles from completed evaluation results only, names the as-of time); page-class item already acknowledged by another member (digest shows the ack, no duplicate interrupt); snooze expiry lands mid-digest-cycle (the item re-opens with a "resumed after snooze" mark, never silently re-snoozed).
**Failures**: narration assist quota exhausted → RATE_LIMIT ladder notice, template narration unaffected (rung 2); delivery job failure → NETWORK typed error + per-digest retry, digest itself intact in console (async-contract §4 partial policy — delivery is the only failed part); stale detection link from an old delivered digest → NOT_FOUND with the feed's current state offered.
**Recovery**: digest documents are immutable once assembled (re-render same day = same document); status decisions append to the activity journal; delivery retries carry idempotency keys.

## CP-3 — Watch policy authoring, backtest, and tuning (the fatigue guard)

1. Tariq opens the watch editor from the watch list or a detection ("tune this watch"). `listWatches` · `getWatch`
2. The editor shows the feed's series with baseline band and the watch's current policy rendered as readable sentences (the same template engine as explanations — policy-as-prose, the authoring posture). `getFeed` · `getMetricSeries`
3. He edits threshold bands (absolute or %-vs-baseline), anomaly sensitivity (1.5σ–4σ slider with a plain-language reading at each stop), sustained-points window, and severity tier per band (page vs digest — page-class requires an explicit opt-in with the interrupt-cost sentence shown at selection, the cadence honesty).
4. **Backtest preview** re-runs the candidate policy over the trailing 60 days: detection count, per-feed breakdown, season-window intersections, and the dismissal journal's overlap ("1 of 4 would-be detections matches a reason you previously dismissed"). `runEvaluation` (mode: backtest)
5. Save with versioned policy (stale-baseVersion edit → CONFLICT with both payloads). `updateWatch`
6. Usage surface shows the window's assist narrations (P14 meter — deterministic engines deliberately render NO meter: unmetered by design). `getUsage`

**Edges**: policy edit during a running evaluation (edit applies to the next run; the running job completes on the old policy and the result is stamped with the policy version it used — provenance honesty); sensitivity below 1.5σ (editor warns with the backtest count as evidence — the warning is numeric, never moral); deleting a feed with live watches (fence: deleteWatch required first, or cascade offered with named consequences — P04 level-2 with counts).
**Failures**: backtest over a series shorter than the window (VALIDATION: run it over what exists, the count says so); assist narration meter read failure → "last known" degradation.
**Recovery**: every policy version is retained; reverting is a save of a prior version; backtest is a pure function of stored series + candidate policy.

## CP-4 — Season calendar and the evaluation rhythm (the MENA calendar flow)

1. The season calendar lists declared windows: past, active, queued — bilingual names, Gregorian dates (dual-calendar hover per P24 where the workspace enables it), expected effect (surge/dip/both), affected feeds. `listSeasonWindows`
2. Tariq adds the White Friday window: name pair ("الجمعة البيضاء" / "White Friday"), dates, expected effect surge, applies-to sales + CPA feeds. The upsert is versioned; overlapping windows are permitted and disclosed (both shown on the strip). `upsertSeasonWindow`
3. Feed data refresh through the metric-source capability (bound workspaces): sync is a Job with per-feed progress; the manual paste path remains available on the same surface. `syncMetricFeed`
4. Evaluation runs on the declared cadence (workspace clock): within active season windows, seasonal anomaly watching suspends for affected feeds — the engine marks those points "season-adjusted" — while declared threshold rules still fire (they are the lead's hard limits; seasons do not pause limits). An evaluation after the window closes re-arms anomaly watching and the first post-window baseline note says so. `runEvaluation`
5. Jobs console shows ingestion/sync/evaluation/delivery jobs with state, cancel/retry, link-to-context (T3-consolidated activity surface per async-contract §7). `listJobs`
6. Hessa can pause a watch for a season (status paused with reason auto-suggested "season window", resume date defaulting to window end). `updateWatch`

**Edges**: a season window with no affected feeds (listed, honest "no feeds attached"); Ramadan's Gregorian drift (windows are Gregorian-dated entities authored per year — the product never computes Hijri dates itself, P24 presentation only); two windows overlapping (both rendered, anomaly suspension is the union); an evaluation whose data gap spans the window boundary (gap disclosure on the series, baseline computed on what exists).
**Failures**: capability sync unconsented → PERMISSION (capability language); sync partial failure → per-feed retry (partial policy); evaluation cadence missed while the workspace was closed → catch-up run on open, stamped with the missed-interval note (honest gap disclosure, never silently backfilled detections presented as fresh).
**Recovery**: season windows are versioned data; watch pause/resume is logged with reasons; catch-up evaluations are marked catch-up.

## CP-5 — Console home, triage, jobs, and settings (the daily surface)

1. Console home: page-class banner (if any open), open detections by severity, feed-health strip (feeds, last-point age, stale feeds flagged), watch summary chips. Session renders role and workspace locale. `listDetections` · `listFeeds` · `listWatches` · `getSession`
2. Triage list: filters (status, tier, feed, date range) as removable chips (P08) + saved views; bulk acknowledge on selected rows (P07 action bar, count-scoped); watch maintenance actions including delete with P04 level-2 confirm naming consequences ("Delete watch 'متوسط زمن التوصيل' — its 34 detection records stay in the journal, no new detections fire"). `listDetections` · `updateDetectionStatus` (bulk) · `deleteWatch`
3. Jobs console: all job classes, cancel/retry, link-to-context. `listJobs`
4. Settings: digest preferences per member (P21 tier ladder per watch class), capability consent state (kind, not vendor — credential-contract §2), baseline disclosure (the engine's rules rendered as readable text — the same transparency as explanations), and the usage meter. `getDigestPreferences` · `updateDigestPreferences` · `getUsage`
5. ⌘K palette reaches feeds, watches, detections, digests, and actions with bilingual normalized search (alef/taa-marbouta/yaa normalization — rtl-rules §4). Client-side over loaded list data.

**Edges**: filtered-empty declares itself (P01); >200 detection rows virtualize (P19); no-access workspace surfaces → PERMISSION, never "empty"; stale feed (last point >3× cadence) flagged in the health strip with its own copy (11 §A).
**Failures**: NETWORK mid-list → banner + retry (P20); offline writes queue with per-item state and reconcile on return (async-contract §5).
**Recovery**: all lists cursor-paginated and re-fetchable; locale switches re-render without data loss.

## Non-happy paths

- **Narration capability unavailable (rung 4, 08 map)**: detection detail renders the full template explanation with provenance "template"; nothing else changes — the 00 success signal 3 tests exactly this against the assist-off mock configuration.
- **No metric-source capability bound (LOOP-5)**: paste/import is the primary path from first run; the capability tab renders as optional with the consent surface, never as a wall.
- **First-run**: console home offers a seeded sample feed with pre-loaded series and a sample watch so the backtest-preview and explanation moments are experienceable before pasting real work (P22 value checklist).
- **Offline**: digest reads and triage work; status decisions queue with per-item state; jobs reconcile to authoritative state on return.
- **Digest reader seat (viewer)**: the console home renders digest-first with editing surfaces absent by permission, not hidden by availability (PERMISSION copy, 11 §C).

## Failure → error mapping

VALIDATION (malformed ingest rows, backtest on insufficient history, snooze without reason, watch on sub-minimum series without threshold mode) · NOT_FOUND (stale detection/feed/watch/digest links, expired delivered-digest artifacts) · PERMISSION (capability consent, viewer-role mutations, workspace scoping) · CONFLICT (concurrent watch-policy edits, concurrent status transitions) · RATE_LIMIT (narration assists, digest deliveries, capability syncs) · NETWORK (list fetches, job polling, digest delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-5.1, entry (role/locale) | `runEvaluation` | CP-1.5 (backtest), CP-1.6 (live), CP-3.4, CP-4.4 |
| `createFeed` | CP-1.1 | `listDetections` | CP-1.7, CP-2 (digest items), CP-5.1/5.2 |
| `listFeeds` | CP-1.2, CP-5.1 (health strip) | `getDetection` | CP-1.8, CP-2.3 |
| `getFeed` | CP-1.4, CP-3.2 | `updateDetectionStatus` | CP-2.4, CP-5.2 (bulk) |
| `getMetricSeries` | CP-1.4, CP-3.2 (band context) | `narrateDetection` | CP-2.5 |
| `ingestMetricPoints` | CP-1.3 | `listDigests` | CP-2.1, CP-5 (digest nav) |
| `syncMetricFeed` | CP-4.3 | `getDigest` | CP-2.2 |
| `createWatch` | CP-1.5 | `generateDigest` | CP-2.1 |
| `listWatches` | CP-3.1, CP-5.1 | `deliverDigest` | CP-2.6 |
| `getWatch` | CP-3.2 | `getDigestPreferences` | CP-2.7, CP-5.4 |
| `updateWatch` | CP-3.5, CP-4.6 (season pause) | `updateDigestPreferences` | CP-5.4 |
| `deleteWatch` | CP-5.2 | `getUsage` | CP-3.6, CP-5.4 |
| `listSeasonWindows` | CP-4.1 | `listJobs` | CP-1.3, CP-4.5, CP-5.3 |
| `upsertSeasonWindow` | CP-4.2 | | |

27 operations, 0 orphans (Critic-verified via check_coverage.py).
