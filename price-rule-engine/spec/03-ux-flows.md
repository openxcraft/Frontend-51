# 03 — UX Flows: price-rule-engine

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation — no orphans. Terminology per 02: pricing rule · catalog item · landed cost · cost floor · simulation · margin preview · price proposal · approval · export package · market · channel · category.

## CP-1 — Catalog and cost stand-up (value proof: the margin column fills)

1. Layla enters the rules console first-run. Workspace chrome renders from her session (role 'owner' or 'editor', locale — bilingual-en default, Arabic a full citizen; 05). Markets are seeded (KSA 15% VAT / SAR 2-minor-digits; UAE 5% VAT / AED 2-minor-digits) and read on the settings surface: the workspace's tax configuration is data, not hardcode. `getSession` · `getWorkspace`
2. She imports the catalog by paste — the manual LOOP-5 path, zero credentials: one row per item (`sku | nameEn | nameAr? | category | market | channel | currentNetPrice`), optionally carrying an opening landed cost and a per-item absolute floor. Import is a Job with honest row-count progress ("Importing 140 of 220 items"); invalid rows are named and skipped, valid rows land. `importCatalog` · `listJobs`
3. The catalog table fills with cost, net price, margin, and floor status per item; items without a cost record render an honest empty ("no landed cost — margin and floor unchecked for this item") rather than a fake 0. Filters: category, market, channel, floor-status, margin band; bilingual normalized search over SKU and both names (rtl-rules §4). `listCatalogItems`
4. She opens one item: cost history timeline (effective-dated cost records), price history, and the applied-rule trace from the last simulation. She records the landed cost with components — supplier cost, freight, duty, fees, packaging — as a cost record effective-dated today; the margin column for that item computes immediately (arithmetic per 07c rule 2). `getCatalogItem` · `saveCostRecord`
5. Cost history is paged per item (a two-year item carries many records); each record shows actor and timestamp (P17 discipline). `listCostRecords`
6. First-run shortcut: the sample workspace ships with 12 bilingual items, costs, one active rule, and one seeded simulation whose header carries the product's value sentence — "blended margin 31.4% → 33.9% catalog-weighted, 3 rows floor-clamped" (P22 value checklist; 07c seed). No import needed to see the product think. `listCatalogItems` · `getSimulation` (sample)

**Edges**: paste rows with a market code the workspace does not have → VALIDATION naming the row and the allowed codes; duplicate SKU on import → the row updates the existing item (idempotent upsert, recorded) rather than duplicating; category names unknown at import → categories are created on the fly as flat entries, renamable later (CP-1 edge below); a per-item absolute floor higher than any derived floor wins by max (07c).
**Failures**: malformed paste → VALIDATION naming the first bad row, prior rows retained (partial policy, async-contract §4); NETWORK mid-list → banner + retry, import state safe (P20).
**Recovery**: imports are re-runnable by paste at any time; nothing reviewed is lost to a failed import (cost records and rules are never touched by catalog imports). Category rename keeps rules working (rules reference category ids, display names follow). `saveCategory`

## CP-2 — Author a pricing rule (the deterministic authoring surface)

1. Layla creates a rule: name ("Kitchen — target margin 38%"), status draft, priority (evaluation order — lower number first), optional validity window (start/end dates — the Ramadan markdown shape, 01 §F), and scope conditions (category = Kitchen; market = KSA; optionally price band and margin band on current values). Scope pickers read the workspace's categories and channels. `createRule` · `listCategories`
2. She picks actions: `set-target-margin 38%` and `ending-round whole-unit`. Beside the form, the editor renders the deterministic formula in plain arithmetic — "net = landed cost ÷ (1 − 0.38); then round to the whole riyal; then clamp at the floor" — with a worked example on one seeded item ("landed 61.40 → raw 99.03 → rounded 99 → floor 66.31 → final 99.00, margin 38.0%"). The formula panel is the anti-spreadsheet: what the rule does is written down (00). `getCatalogItem` (example fetch)
3. She saves; the rule lands in the console list with status, priority, window, and scope summary. Rules list is filterable by status/scope and searchable by name (bilingual normalized). `listRules`
4. She edits the rule later (raise margin to 40%, shift the window): edit re-versions the rule; existing simulations keep the rule versions they were computed against (pin — audit honesty); the next simulation uses the new version. `getRule` · `updateRule` (baseVersion → CONFLICT if another seat edited)
5. Noura authors her own scoped rule (home textiles, 30% markdown for a White Friday window) the same way — pickers, rendered formula, no expression syntax (02).

**Edges**: two active rules with overlapping scope and same priority → VALIDATION on save naming the collision (priority is a total order; ties are rejected, not luck); a rule whose window has already ended → savable but the console shows it inert (paused-by-time, not an error); deleting a rule referenced by past simulations → P04 level-2 confirm naming that simulations keep their pinned snapshot (history is never rewritten). `deleteRule`
**Failures**: scope referencing a category deleted... categories are never hard-deleted, only renamed/merged-by-rename (07a invariant) — the edge does not exist by design (recorded here so the Critic sees it was considered); stale edit → CONFLICT with both payloads.
**Recovery**: rules are versioned; draft/paused/active is a status field with console-level toggles; nothing but a new simulation ever evaluates a rule against live data (there is no live data path — 00).

## CP-3 — Cost-floor-aware simulation with margin preview (the signature surface)

1. Layla opens the simulation composer: name, scope (categories/channels/markets, or "all items"), rule mode — `active-set` (all active rules with windows containing the simulation date) or a selected subset — and cost snapshot date (default: now; back-dating uses the cost records effective on that date — "what would the rule set have done before the vendor increase?"). Quota shown before running (P14). `getUsage`
2. She runs the simulation — a Job with determinate per-item progress ("Simulating item 140 of 220"); on completion the simulation is an immutable snapshot (re-running creates a new simulation, never mutates one). `runSimulation` · `listJobs`
3. The simulation workspace opens: **summary header** — blended margin before → after (catalog-weighted, labeled as such: no sales data at v1, 00), count of price-up/down/unchanged, floor-clamped count, net-revenue delta (catalog-weighted); below it the virtualized row table (P19): SKU, names (per-row direction, bidi-isolated), landed cost (at snapshot), current net, proposed net, margin before → after, VAT-inclusive display before → after per market, floor flag. `getSimulation` · `listSimulationRows`
4. She filters the rows: "floor-clamped only" — the three rows where the rule would have priced below the cost floor; each carries the trace in its drawer: raw rule price 84.50 → ending round 84 → floor 96.14 → **final 96.14, clamped** (clamp is the last step — the invariant "final ≥ floor" always holds; 07c rule 4). The clamp is visible, never silent (00's whole point).
5. She opens one ordinary row's formula drawer and reads the full derivation: cost components → landed total → each matched rule in priority order with its arithmetic → ending → floor check → final; every step's number is there (the derivation-forward voice, 02).
6. Salem opens the same simulation on mobile read mode: the summary header is the surface (02 JTBD); rows are read-only cards. `getSimulation`

**Edges**: simulation scoped to items with no cost records → those rows carry "no landed cost — not simulated" and are counted in a `skippedNoCost` field, never faked; a rule in the selected set whose window excludes the simulation date → shown in a "not applied (window)" list, not silently dropped; cost snapshot older than every cost record → the earliest record applies (07c rule 1: latest effectiveFrom ≤ snapshot date, else earliest); ending convention conflicting with the floor (rounding dips below floor) → clamp lifts the final above floor and the row records `ending-broken-by-floor` (flagged, not hidden).
**Failures**: quota exhausted → RATE_LIMIT ladder notice with reset time (P14 — reading and row inspection keep working); NETWORK during job polling → banner + retry, the job is authoritative (P20); simulation of an empty scope → VALIDATION naming the scope's zero match.
**Recovery**: simulations are immutable snapshots; the worst rule error costs a re-run, never a price (00). Offline: simulation reads work; runs queue as jobs and reconcile on reconnect (async-contract §5).

## CP-4 — Proposal, approval gate, and export (the governance chain)

1. From a simulation, Layla creates a price proposal: it copies the simulation's row set (with pinned cost snapshot + rule versions), a name, and a note; the proposal opens in review mode. `createPriceProposal`
2. She reviews row by row: include (default) or **exclude with a reason** ("floor-clamped — renegotiate supplier first"; "delisting this SKU next month"). Exclusions are recorded decisions, not deletions; the review state persists across sessions (P11). The proposals home lists all proposals with status. `updatePriceProposal` · `listPriceProposals`
3. She submits for approval: submission REFUSES while any row is unreviewed — the refusal names the first unreviewed row and the count (gate discipline; never a generic "not ready"). `submitPriceProposal` (gate)
4. Faisal opens the proposal in review mode (role 'approver'): rows with deltas and floor flags, exclusions with reasons, the margin preview summary, and the derivation source (simulation link with pinned snapshot). He approves: the gate re-checks live state; approval writes an immutable approval record (actor, timestamp, row counts); post-approval edits to the workspace do not mutate the approved proposal (it is a snapshot chain — 07a). `getPriceProposal` · `approvePriceProposal`
5. Export the price-update package: a Job producing the price sheet (SKU, market, channel, new net, new VAT-inclusive display, effective date) and the audit ledger (proposal rows, exclusions with reasons, approval record, simulation reference); artifact expiry window declared at creation; regenerable deterministically. Manual download is the default path; the abstract "price publish channel" delivers when bound (08 N2). `exportPricePackage` · `getArtifact` · `listJobs`
6. The activity log shows the whole chain — import, rule saves, simulation runs, proposal review actions, approvals, exports — actor-action-target-timestamp (P17). `listActivity`

**Edges**: a proposal withdrawn from in-review returns to draft with the withdrawal recorded (Faisal changed his mind before approving — the audit chain keeps both moves); approving from a stale proposal view (another approver already acted) → CONFLICT with current state; export of a proposal whose source simulation is old → the package carries the proposal's pinned state and states its snapshot age (honesty at handoff). `withdrawPriceProposal`
**Failures**: approval by a viewer/editor seat → PERMISSION naming the seat's capability; export quota → RATE_LIMIT ladder with reset; NETWORK mid-package → per-format partial retry (async-contract §4); artifact expired → NOT_FOUND with regenerate (proposal state unchanged — regeneration is deterministic).
**Recovery**: proposals and approvals are immutable records; packages regenerate from the approved proposal at any time; the jobs console reconciles after reconnect.

## CP-5 — The cost-refresh cycle (the margin-erosion loop the buyer pays for)

1. A vendor increase lands: Layla pastes the cost sheet — `sku | total landed cost | effective date` rows — as a bulk import Job; matched SKUs get new effective-dated cost records, unmatched rows are named. This is the delayed-response moment the research names as the erosion source (01 [53]). `importCostSheet`
2. The catalog's margin column re-computes per item; Layla filters to "margin below band" and sees the erosion per SKU — the rows that a spreadsheet would have silently carried at last quarter's costs. `listCatalogItems`
3. She re-runs the standing simulation (the same saved scope and rule mode; a new simulation with the new cost snapshot — the previous one is preserved for comparison). The margin preview shows before/after against the *new* costs; rows that now floor-clamp are the ones the vendor increase pushed under water. `runSimulation` · `getSimulation`
4. She curates the proposal from CP-4 on top of this simulation, excluding the renegotiate-first rows with reasons.
5. Manual paths stay first-class: a single price correction outside any rule (a one-off price fix) is edited directly on the item with a required note, recorded in price history and activity — the honest escape hatch that keeps the rule set from being bypassed silently. `updateCatalogItem`
6. If the workspace's floor posture itself changes (finance raises the default floor markup from 8% to 12%), the change is versioned workspace configuration; the next simulation uses the new floor and says so. `updateWorkspace` (baseVersion → CONFLICT)

**Edges**: back-dated cost sheet (effective date in the past) → allowed, recorded, and visible on the timeline (auditors ask); cost sheet raising an item's cost above its current net price → the item immediately flags "below floor" in the catalog (the live warning is catalog state, not a simulation artifact — 07a); manual price edit contradicting an active rule → allowed with note; the next simulation will show the divergence honestly (rules are not enforced on live prices at v1 — there is no enforcement surface, only preview + proposal; 00).
**Failures**: SKU match failures named per row (VALIDATION partial); stale workspace edit → CONFLICT both kept.
**Recovery**: cost records append-only history (corrections are new records with notes, never overwrites — 07a); every mutation lands in the activity log; the whole cycle is re-runnable without risk because nothing executes (00).

## Non-happy paths

- **No rules yet** (first-run): the console states it plainly — simulations without rules still run (they show the floor-only pass: nothing below cost, nothing changed except floor clamps on already-underwater items — an honest "your current price file vs your costs" report; 07c rule 4 floor-only default). The sample rule demonstrates authoring. `listRules` (empty state, 11)
- **Viewer seat** (Salem): read simulations, proposals, and the catalog; mutations → PERMISSION in capability language (07b rule 4); the margin preview on mobile is his entire surface.
- **No cost data for the scope**: simulation skips and counts `skippedNoCost`; the summary says which items were not simulated and why — margin honesty beats margin theater.
- **Offline**: reads work; job submits (simulation runs, exports) queue with per-item state and reconcile on reconnect (P20); deterministic evaluation makes offline simulation results safe to trust once reconciled.
- **Mid-session market/VAT change**: markets are workspace configuration with versioned edits; running jobs keep their snapshot (a simulation states the VAT rates it used — 07a).

## Failure → error mapping

VALIDATION (malformed import rows, scope/price sanity, priority collisions, gate attempts, empty simulation scope) · NOT_FOUND (stale item/rule/simulation/proposal/artifact links, expired artifacts) · PERMISSION (viewer-role mutations, non-approver approvals, capability consent) · CONFLICT (concurrent rule/item/workspace edits, stale approvals, concurrent proposal updates) · RATE_LIMIT (simulation runs, export packages) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.1, CP-4.4 (role/locale context) |
| `getWorkspace` | CP-1.1 (markets/VAT/floor defaults read), S9 settings (04) |
| `updateWorkspace` | CP-5.6 (floor-policy/market edit, versioned) |
| `importCatalog` | CP-1.2 |
| `importCostSheet` | CP-5.1 |
| `listCatalogItems` | CP-1.3, CP-5.2 (margin-band filter), CP-1.6 (sample) |
| `getCatalogItem` | CP-1.4, CP-2.2 (formula example) |
| `updateCatalogItem` | CP-5.5 (manual price fix with note) |
| `saveCostRecord` | CP-1.4 |
| `listCostRecords` | CP-1.5 (paged history timeline) |
| `listCategories` | CP-2.1 (scope pickers), S3 catalog filters (04) |
| `saveCategory` | CP-1 (recovery: rename keeps rules working) |
| `createRule` | CP-2.1 |
| `listRules` | CP-2.3, non-happy no-rules empty state |
| `getRule` | CP-2.4 (edit entry, revision history) |
| `updateRule` | CP-2.4 |
| `deleteRule` | CP-2 edge (P04 confirm, pinned simulations keep snapshots) |
| `runSimulation` | CP-3.2, CP-5.3, non-happy floor-only pass |
| `getSimulation` | CP-3.3, CP-3.6 (mobile summary), CP-1.6 (sample read), CP-5.3 |
| `listSimulationRows` | CP-3.3, CP-3.4 (floor-clamped filter) |
| `createPriceProposal` | CP-4.1 |
| `getPriceProposal` | CP-4.4 (review mode + gate state) |
| `listPriceProposals` | CP-4.2 (proposals home), S7 (04) |
| `updatePriceProposal` | CP-4.2 (row include/exclude with reasons, note/name) |
| `submitPriceProposal` | CP-4.3 (gate refuses unreviewed rows) |
| `approvePriceProposal` | CP-4.4 (immutable approval record) |
| `withdrawPriceProposal` | CP-4 edge (in-review → draft, recorded) |
| `exportPricePackage` | CP-4.5 |
| `getArtifact` | CP-4.5 (retrieve before expiry) |
| `listJobs` | CP-1.2, CP-3.2, CP-4.5, S8 jobs console (04) |
| `getUsage` | CP-3.1 (pre-run quota), S9 settings (04) |
| `listActivity` | CP-4.6, CP-5 (audit chain), S10 activity log (04) |

32 operations, 0 orphans (Critic-verified — the table above lists every 07b operation exactly once).
