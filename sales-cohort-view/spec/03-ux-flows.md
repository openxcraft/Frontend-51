# 03 — UX Flows: sales-cohort-view

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation — no orphans, no phantoms. Workspace fixture used throughout: Qamar Retail (07c); personas from 02.

## CP-1 — Open the workspace → the first grid (value proof)

**Trigger**: Nadia signs in for the first time; the seeded commerce source is bound and fresh; she wants a cohort grid now, not a setup project.

1. Session resolves (role owner, locale en, workspace market KSA+UAE, calendar-method disclosure). `getSession`
2. Grid workspace opens; the source chip shows bound-state and freshness (last sync, coverage window). `getSource`
3. The default view renders: monthly acquisition cohorts × period columns over the declared coverage, metric = repeat purchase, the current period (October 2026) marked "period in progress", every cell carrying its denominator. `computeGrid`
4. She opens the definitions panel from the grid header and reads the four canonical metrics with formulas and the ruleset version the grid ran under. `getRuleset`
5. She re-reads the immutable snapshot after switching tabs away and back — same numbers, same version pin. `getGrid`
6. The jobs badge shows no running work; onboarding checklist (P22) marks "first grid rendered" done. `listJobs`

**Edges**: source coverage shorter than requested range → grid renders only covered periods and says which are missing (coverage honesty, never silent clamping); the in-progress period appears with a mark and is excluded from means (07b rule 3); zero orders in an early period-column (pre-launch market) → column renders empty with count-only state, never as a 0% rate.
**Failures**: source unreachable → NETWORK with the grid surface showing last-known snapshot + freshness chip degrading to stale (P20 posture; grids never fabricate); session expired mid-read → PERMISSION re-auth path, snapshot preserved client-side.
**Recovery**: snapshots are immutable (07a state obligations) — any re-read is byte-identical; recompute after source recovery produces a NEW snapshot with the old one still listed.

## CP-2 — The daily read: metric, overlay, drill (the analyst's loop)

**Trigger**: Faisal opens the grid on a Tuesday to answer "which acquisition windows produce durable customers" — the question behind the quarterly deck.

1. He cycles the metric switcher across the four canonical metrics (active customers → repeat purchase rate → cumulative revenue per customer → orders per active customer); cells re-render, denominators stay visible. `computeGrid`
2. He toggles the season overlay: season windows shade onto the acquisition axis with phase stripes and drift ticks; cohorts whose windows overlap a season get season chips with composition share. `getGrid`
3. He navigates the grid by keyboard (arrow keys, physical mapping stable), reads cell values with small-sample cautions where denominators < 30 and count-only suppression where < 10. (surface behavior; no new operation)
4. He drills a cohort row into cohort detail: acquisition window, size, season composition sentence, the full curve, summary stats. `getCohortDetail`
5. He drills a cell to the customer list: customer references (key + display label from the bound source), first order, order count, revenue to date; filters and paginates. `listCustomers`
6. He checks the formula behind a metric he is about to quote (denominator audit). `getRuleset`

**Edges**: suppressed cells (denominator < 10) — Enter still opens the drill but the list carries the suppression note, counts only, no rates rendered anywhere in the drill; customer display labels missing from the source → key-only rendering with a "source did not provide labels" note (never a blank row lie); composition share below 5% of a window → not chipped (noise floor), disclosed in the composition panel instead.
**Failures**: drill against a snapshot the workspace no longer holds (expired cache window) → NOT_FOUND with re-compute action; source label lookup fails mid-drill → PERMISSION/NAMING per 07b rule 6 (source-scoped), the list degrades to key-only with the reason stated.
**Recovery**: drill lists are cursor-paginated and re-fetchable; nothing in the drill mutates state (read-only surface by construction).

## CP-3 — Season calendar discipline (define, verify, drift)

**Trigger**: Sami is asked "are the Ramadan windows right this year?" before the quarterly review — or Nadia adds a market's national day the curated library does not carry.

1. Season calendar opens: kinds library (ramadan, eid-al-fitr, eid-al-adha, white-friday, national-day, back-to-school, custom) with curated default windows per market. `listSeasonKinds`
2. Declared windows list per market/year — dual Hijri/Gregorian dates, phase map (build-up / peak / wind-down), drift disclosure on moon-sighting-dependent kinds, provenance (curated vs workspace-authored). `listSeasonWindows`
3. He opens one window and reads it in full: dates in both calendars, phases with day ranges, ±1-day drift note, the market it applies to. `getSeasonWindow`
4. He corrects a window: adjusts the peak phase by a day after the KSA declaration lands; version bump with baseVersion. `updateSeasonWindow`
5. She creates a new one: UAE market, custom kind, label in both locales, Gregorian dates, phases. `createSeasonWindow`

**Edges**: overlapping windows of the same kind in one market → flagged at save with the overlap named (days and both windows), allowed only with an explicit override reason (audited); a window crossing the coverage boundary → partial-coverage mark on the grid, never silent; curated provenance preserved through edits (edited-from-curated is a state, not an overwrite).
**Failures**: stale baseVersion on update → CONFLICT with both payloads (P10 conflict posture); dates that produce a negative or zero-length window → VALIDATION naming the field; season-anchored compute referencing an archived window → NOT_FOUND with the window restore action.
**Recovery**: window edits are versioned; the season calendar's activity entries record every change (P17); grids pinned to old window versions stay reproducible (snapshot evidence carries the window versions it ran under — 07a).

## CP-4 — Season-anchored comparison → evidence pack (the signature flow)

**Trigger**: Nadia prepares the quarterly customer review: did Ramadan 1447's cohort retain like Ramadan 1446's — the same retail moment, eleven days apart on the Gregorian calendar?

1. She re-anchors the grid: acquisition windows = season windows (ramadan peak, both years, KSA market) plus non-seasonal monthly buckets for context. `computeGrid`
2. She opens each Ramadan cohort's detail to read composition and curve before quoting anything. `getCohortDetail`
3. She stages the comparison: Ramadan 1447 peak (N₀ 214) vs Ramadan 1446 peak (N₀ 178), alignment mode = season-aligned. `compareCohorts`
4. The comparison renders: aligned curves from period 0, per-metric deltas, composition disclosure for both cohorts, small-sample honesty where a period's denominator dips under thresholds, drift disclosure (±1 day) visible on both windows. She re-reads it after navigating away. `getComparison`
5. She saves the anchored view so next quarter starts where this one ended. `saveView`
6. She exports the evidence pack: grid snapshot + comparison + the season-window versions it ran under + ruleset version — a Job with a declared expiry. `exportEvidence` · `getArtifact`

**Edges**: cohorts of very different sizes (214 vs 178 is fine; 214 vs 14 is not) → comparison carries a size-imbalance note at ratio > 3:1, still renders (analysis, not prohibition); a period column incomplete for the younger cohort → the comparison truncates to shared complete periods and says so; comparing across different season kinds (Ramadan vs White Friday) → allowed, labeled "cross-season" with the composition disclosure doing the honesty work.
**Failures**: export failure mid-pack → partial policy: per-section retry, the delivered sections named (async-contract §4); artifact expired on later visit → NOT_FOUND with regenerate (source snapshots immutable — regeneration is byte-identical); comparison against a snapshot superseded by a source refresh → CONFLICT-style notice with re-compute action (the old comparison stays readable).
**Recovery**: comparisons are immutable snapshots; saved views re-run against current data on open (a view is a query, not a cache — 07a); exports regenerate deterministically from the pinned snapshots.

## CP-5 — Workspace administration: source, sample, views, jobs, activity (the daily surface)

**Trigger**: Sami wires the workspace on day one and keeps it honest afterwards; Nadia manages what the team sees.

1. Sources surface: bound source state (kind, coverage, last sync, health). `getSource`
2. Sami triggers a freshness refresh — a Job with staged progress. `refreshSource`
3. Before the source is bound (or for a one-off analysis slice), he pastes/imports a bounded orders sample (columns: order date, customer key, net revenue, channel, market) — the LOOP-5 always-available path, a paced Job with row-level progress and duplicate accounting. `importOrdersSample`
4. Saved views library: Faisal's team's anchored views, rename/update, delete with the P04 level-2 confirm naming what is removed. `listViews` · `updateView` · `deleteView`
5. Jobs console: source-refresh, sample-import, export jobs with state, cancel/retry, link-to-context (async-contract §7 — T3 consolidated surface). `listJobs`
6. Activity log: every consequential mutation (window edits, view saves, exports, setting changes) with actor-action-target-timestamp, filterable. `getActivity`
7. Settings: default locale, default market, calendar-method disclosure (Umm al-Qura presentation with method named), default granularity. `getSession` · `updateWorkspace`

**Edges**: filtered-empty on views/jobs/activity declares itself (P01); a second sample import overlapping the first → coverage union declared, duplicates counted, both imports listed in the job history (no silent merge); refresh while an export runs → export pins the snapshot it started from (jobs never read a moving source — 07b rule 7).
**Failures**: refresh failure → typed error + retry, freshness chip degrades honestly (stale, last-good timestamp); sample rows malformed → VALIDATION naming the first bad row with prior-good rows kept (partial policy); delete on a view referenced by a shared link → the link dies with a named consequence in the confirm (P04 level 2).
**Recovery**: all list surfaces cursor-paginated; job state reconciles to authoritative state after connectivity loss (async-contract §5); settings changes re-render without data loss in both directions.

## Non-happy paths

- **No bound source, no sample yet (first-run)**: the grid surface offers the seeded sample world (P22 value checklist: "see a season-anchored grid before wiring anything") plus the paste-import path — the product is experienceable with zero credentials (LOOP-5).
- **Sample-only mode**: every surface works over the imported bounded sample; the source chip says "sample data — coverage 2024-10-01 → 2026-10-15" and the honest-coverage rules apply unchanged (08 degradation map).
- **Season calendar empty for a market**: curated defaults are offered per market kind; the grid still runs un-anchored; the overlay renders "no declared windows for this market" with the create action (P01 first-run shape applied to calendar data).
- **Stale source**: grids render last-known snapshot with a persistent freshness chip (visible on every grid header, never only in settings); the review surfaces state the sync age in the evidence pack footer (honesty travels with the artifact).
- **Offline**: reads work from last-known snapshots; no writes queue (the product is read-heavy: the only writes are calendar/view/settings mutations, which queue with per-item state per P20).

## Failure → error mapping

VALIDATION (malformed sample rows, zero-length season windows, comparison requests without two resolvable cohorts) · NOT_FOUND (stale snapshot/comparison/artifact links, archived season window referenced) · PERMISSION (workspace scoping, source-scoped label lookups, viewer-role mutations) · CONFLICT (stale baseVersion on window/view edits, superseded-snapshot comparisons) · RATE_LIMIT (source refresh cadence, export bursts) · NETWORK (source reachability, list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, CP-5.7, entry (role/locale) | `compareCohorts` | CP-4.3 |
| `updateWorkspace` | CP-5.7 | `getComparison` | CP-4.4 |
| `getSource` | CP-1.2, CP-5.1 | `saveView` | CP-4.5 |
| `refreshSource` | CP-5.2 | `listViews` | CP-5.4 |
| `importOrdersSample` | CP-5.3, non-happy (sample-only) | `updateView` | CP-5.4 |
| `listSeasonKinds` | CP-3.1 | `deleteView` | CP-5.4 |
| `listSeasonWindows` | CP-3.2 | `exportEvidence` | CP-4.6 |
| `getSeasonWindow` | CP-3.3 | `getArtifact` | CP-4.6 |
| `createSeasonWindow` | CP-3.5, non-happy (empty calendar) | `listJobs` | CP-1.6, CP-5.5 |
| `updateSeasonWindow` | CP-3.4 | `getActivity` | CP-5.6 |
| `computeGrid` | CP-1.3, CP-2.1, CP-4.1, CP-2.2 (re-read), non-happy paths | `getRuleset` | CP-1.4, CP-2.6 |
| `getGrid` | CP-1.5, CP-2.2 | | |
| `getCohortDetail` | CP-2.4, CP-4.2 | | |
| `listCustomers` | CP-2.5 | | |

25 operations, 0 orphans (Critic-verified; check_coverage.py PASS).
