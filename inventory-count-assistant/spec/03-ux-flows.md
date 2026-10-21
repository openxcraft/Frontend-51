# 03 — UX Flows: inventory-count-assistant

SME-C pass · 5 critical paths. Coverage table at the end traces every 07b operation exactly once — no orphans, no phantoms.

## CP-1 — Catalog paste → book import → first cycle slice (setup and value proof)

1. Faisal enters the workspace; sessions home (S1) shows the first-run checklist (P22): import items → paste book quantities → run the first slice. `getSession` · `listStores`
2. Catalog (S6): he pastes his item list (SKU, barcode, Arabic name, English name, unit, unit cost), one item per line; ingestion is a Job with row-count progress (async-contract §3). Bilingual validation: at least one name required, both encouraged; malformed rows named. `importCatalogItems` · `listJobs`
3. ABC classes compute deterministically on import (Pareto rule, 07c); the catalog table shows class chips per item. `listCatalogItems`
4. Book register: he pastes book quantities per store (item + expectedQty + optional location), a Job with per-row accounting; invalid rows named and kept-out, valid rows applied (partial policy). `updateStockLevels` · `listJobs`
5. Zones: Amal creates the store's zones (sales floor, backroom, high-value cage) — zone labels are bilingual. `listLocations` · `saveLocation`
6. Cadence proposal (S2 path): the engine lists items overdue by class interval, each row naming class, interval, days overdue, and overdue ratio; Faisal reads why the list is what it is. `proposeCycleSlice` · `listPolicies`
7. He creates the first session over the proposed slice: blind mode, typed counter roster (Amal + Sami), default policy. `createCountSession`

**Edges**: item with no barcode (type + search fallback is first-class — Zoho community pain, 01 [10]); duplicate SKU on paste (counted in job result, not silently dropped); item names in one script only (allowed, flagged as "incomplete bilingual label"); a store with no book rows yet (explicit empty, P01 — paste is the path); pasted quantity negative or non-integer (VALIDATION naming the row).
**Failures**: malformed paste row → VALIDATION with first bad row named, prior-good rows kept; stock import job failure → typed error, retry, applied rows kept; catalog import quota (RATE_LIMIT) → ladder notice.
**Recovery**: catalog and register persist across sessions; imports are re-runnable and idempotent per key.

## CP-2 — Guided blind count → end counting → variance reveal (the daily loop)

1. Amal opens session CS-2 (draft → open). `getCountSession` · `openCountSession`
2. Guided count view (S3, mobile-capable): scan field focused; each entry lands on its row — scan or type-to-search (bilingual normalized search: alef variants, taa marbuta, yaa forms, rtl-rules §4), quantity pad commits. In blind mode the sheet shows item labels, zone, and a masked tally column — never book quantities. `submitCountEntry` · `listCatalogItems`
3. Progress meter advances (12 of 14); Sami's entries attribute to his typed roster name. `getCountSession`
4. Typo correction during counting: Amal edits her own entry inline (revision-bumped, never silent). `updateCountEntry` · `listCountEntries`
5. Counting complete: she ends counting — a confirm names that the reveal is one-way and that 2 scope items remain uncounted (P04 level 2). The session computes variances and reveals them (the signature moment). `closeCountSession` (action: reveal)
6. Reconciliation screen (S4): variance ledger rows — signed delta, percent, value, tolerance band, outcome; uncounted items listed at the gate.

**Edges**: scan double-fire (idempotency key — the same scan never double-counts); offline aisle dead-zone (entry queues locally with per-item state, flushes on signal — P20); item not on the sheet (session-scoped search fallback — create ad-hoc entry for a scope item by SKU search; non-scope items rejected with a clear VALIDATION); recount entry type vs first count (distinct kinds, 07a).
**Failures**: entry submit failure → typed error, entry retried from the queue; stale entry edit (another revision landed) → CONFLICT with both payloads; NETWORK mid-session → banner, queued entries, session state authoritative on reconnect (async-contract §5).
**Recovery**: entries persist; the reveal computation is re-derivable from entries + register snapshot (deterministic); blind withholding is enforced at the adapter (07b rule 3) — the UI cannot leak what the contract omits.

## CP-3 — Recount → resolution → close gate → adjustments (the accountability loop)

1. The reveal shows variances with outcomes: within-tolerance (auto-accepted) or out-of-tolerance. Out-of-tolerance items already carry an auto recount request per policy (07c rule). `listVariances`
2. Recount: Sami (or a second counter) submits a recount entry for a breached item — a new entry kind referencing the variance; directed by default (book quantity visible to the recounting manager — controlled recount convention). `submitCountEntry` (kind: recount) · `requestRecount` (manual trigger path)
3. Still out after recount → review-required: Faisal resolves explicitly — accept the count, keep the book, or investigate with a note; every resolution is an actor-action-target event (P17). `resolveVariance`
4. Uncounted items: late entries are accepted in reconciling state (recorded as late) — the gate lists them until counted. `submitCountEntry` (late)
5. Close gate: finalize lists what closing posts — N adjustments across M items — and the adjustments post to the book register (expectedQty updated, lastCountedAt stamped); session IRA computes inline. `closeCountSession` (action: finalize)
6. Session detail (S5): the closed ledger, IRA arithmetic, adjustment list, report artifacts. `getCountSession` · `listCountEntries`

**Edges**: accept-count on an item whose recount disagrees with the first count (both entries retained — the resolution records which won and why); keep-book after two out-of-band counts (allowed, requires a note — the honest "we don't know yet"); resolve before recount (manager may resolve any out-of-tolerance variance directly, recorded); policy band strategy differences per zone (the high-value cage runs the strict policy — 07c CP-2 fixture).
**Failures**: finalize with unresolved variances or uncounted items → VALIDATION naming itemIds in details (the gate refusal); stale resolution (variance already resolved) → CONFLICT; report export failure → per-format retry (partial policy).
**Recovery**: resolutions and adjustments are immutable records; a closed session is re-readable forever; the adjustment sheet regenerates from session state.

## CP-4 — Cadence review, directed counts, and policy editing (the control path)

1. Faisal reviews the cadence proposal weekly: overdue ratios, class mix, slice size; he trims or accepts. `proposeCycleSlice` · `listCatalogItems`
2. He runs a directed zone count on the high-value cage (book quantities visible beside entries — inline variance on submit). `createCountSession` · `submitCountEntry` · `getCountSession`
3. Policy editing (S8): tolerance fields (absolute units, percent, optional value), band strategy (union/intersect), recount automation, class intervals, slice size — with a live worked example that recomputes as he edits (06 PolicyEditorForm). `listPolicies` · `savePolicy`
4. Catalog maintenance: item label fixes (both scripts), cost updates (re-class on next import/sync), deactivate an item. `getCatalogItem` · `updateCatalogItem` · `createCatalogItem`
5. Class overrides: the manager pins a class when value-share disagrees with shrink reality (recorded, visible in the catalog). `updateCatalogItem`

**Edges**: invalid policy (negative tolerance, zero interval) → VALIDATION with field-level errors; class override on an inactive item (allowed, inert); directed-mode variance visible inline (07b returns expected+variance per entry — the directed contract); interval change re-orders the next proposal honestly (overdue ratios recompute).
**Failures**: stale policy edit → CONFLICT; catalog edit on a version moved by import → CONFLICT with both payloads.
**Recovery**: policies version; catalog items version; overrides and edits are activity-logged.

## CP-5 — History, IRA, reports, and workspace management (the daily surfaces)

1. Sessions home (S1): list with state, mode, store, progress, IRA badge for closed sessions; filters + saved views (P08). `listCountSessions` · `listStores`
2. Variance history across sessions: filter by item, store, outcome — the drift watch-list for Noura. `listVariances`
3. Activity log: actor-action-target entries for every consequential mutation, exportable. `listActivity`
4. Reports: variance report + adjustment sheet exports with expiry + regeneration (async-contract §2 expired state). `exportCountReport` · `getArtifact` · `listJobs`
5. Settings: locale, numeral policy display, stock-level channel consent state (capability language only — credential-contract §2). `getSession` · `getUsage`
6. Usage: export/import window metering, calm and persistent (P14). `getUsage`

**Edges**: filtered-empty declares itself (P01); no-access stores → PERMISSION surface, never "empty"; >200-row surfaces virtualize (P19); store with no closed session → IRA badge renders the honest no-data state, not zero (11 A).
**Failures**: NETWORK mid-list → banner + retry (P20); quota read failure → usage surface degrades to last-known; artifact expired → NOT_FOUND with renew path.
**Recovery**: all list surfaces cursor-paginated and re-fetchable; session locale switches re-render without data loss.

## Non-happy paths

- **No stock-level channel bound (LOOP-5 default)**: book quantities paste in; adjustment sheets download out; the full loop (CP-1…CP-5) completes — the tested state on the Mock Adapter is channel-off.
- **First-run with no data**: sessions home offers the seeded sample session (8-item mini scope with two planted variances) so the blind-reveal moment is experienceable before real data exists (P22).
- **Offline counting (P20)**: the guided count view queues entries locally with per-item state and reconciles to authoritative session state on reconnect; blind-mode entries never render book quantities even when queued.
- **Zero-book items**: an item with book 0 counted at 3 has no meaningful percent variance — the absolute rule judges it (07c rule 4) and the row says so in text.
- **Counters without accounts**: the typed roster carries attribution (name + optional member ref) — Sami never needs a seat.

## Failure → error mapping

VALIDATION (malformed paste rows, session-scope rejection of non-scope items, finalize gate refusal, invalid policy, blind-mode contract breaches) · NOT_FOUND (stale session/item/artifact links, expired artifacts) · PERMISSION (workspace/store scoping, channel consent) · CONFLICT (concurrent entry/policy/catalog edits, stale resolutions) · RATE_LIMIT (export/import window) · NETWORK (list fetches, job polling, artifact delivery, queued-entry flush) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation exactly once; no orphans)

| # | Op | Flows |
|---|---|---|
| 1 | `getSession` | CP-1.1, CP-5.5 |
| 2 | `listStores` | CP-1.1, CP-5.1 |
| 3 | `listLocations` | CP-1.5, CP-2.2 (zone walk) |
| 4 | `saveLocation` | CP-1.5 |
| 5 | `listCatalogItems` | CP-1.3, CP-2.2 (search fallback), CP-4.1 |
| 6 | `getCatalogItem` | CP-4.4 |
| 7 | `createCatalogItem` | CP-4.4 |
| 8 | `updateCatalogItem` | CP-4.4/5 |
| 9 | `importCatalogItems` | CP-1.2 |
| 10 | `updateStockLevels` | CP-1.4 |
| 11 | `listPolicies` | CP-1.6, CP-4.3 |
| 12 | `savePolicy` | CP-4.3 |
| 13 | `proposeCycleSlice` | CP-1.6, CP-4.1 |
| 14 | `createCountSession` | CP-1.7, CP-4.2 |
| 15 | `listCountSessions` | CP-5.1 |
| 16 | `getCountSession` | CP-2.1/3, CP-3.6, CP-5.2 |
| 17 | `openCountSession` | CP-2.1 |
| 18 | `cancelCountSession` | CP-2 edge (abandon path) |
| 19 | `submitCountEntry` | CP-2.2, CP-3.2, CP-3.4 |
| 20 | `updateCountEntry` | CP-2.4 |
| 21 | `listCountEntries` | CP-2.4, CP-3.6 |
| 22 | `requestRecount` | CP-3.2 (manual trigger) |
| 23 | `resolveVariance` | CP-3.3 |
| 24 | `listVariances` | CP-3.1, CP-5.2 |
| 25 | `closeCountSession` | CP-2.5 (reveal), CP-3.5 (finalize) |
| 26 | `exportCountReport` | CP-5.4 |
| 27 | `getArtifact` | CP-5.4 |
| 28 | `listJobs` | CP-1.2/4, CP-5.4 |
| 29 | `listActivity` | CP-5.3 |
| 30 | `getUsage` | CP-5.5/6 |

30 operations, 0 orphans, 0 phantoms (script-verified: `check_coverage.py` passes 30/30).
