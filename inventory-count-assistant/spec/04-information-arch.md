# 04 — Information Architecture: inventory-count-assistant

## Navigation model

Left rail: **Sessions** (home) · **Catalog** · **Zones & Stores** · **Policies** · **Reports & Activity**. The count session is the product's core object with two live modes: **setup** (draft) and the **guided count view** (open — the mobile-capable surface) and **reconciliation** (reconciling), plus the read-only **closed session detail**. ⌘K command palette (P05 — list surfaces exceed three) reaches sessions, items, zones, policies, and jobs with bilingual normalized search (alef variants, taa marbuta, yaa forms — rtl-rules §4). Two-level IA: section → item; the session workspace is item detail whose tabs follow the session state machine (07a) — Setup → Count → Reconcile → Report — so navigation never disagrees with state. Desktop-first for management surfaces; ≤767px: the guided count view is a full participant (one-thumb counter surface, S3); Sessions/Catalog/Reports render read-only review modes.

## Entity overview (07a for full shapes)

Store → Locations (zones) · CatalogItem (workspace-scoped, bilingual labels) → StockLevel (per store: book quantity + lastCountedAt) · CountPolicy (tolerance band + ABC cadence) · CountSession (scope: cycle-slice | zone | full; mode: blind | directed; typed counter roster) → CountEntries (count | recount kinds, revisions) → Variances (computed at reveal; tolerance outcome; resolution state) → Adjustments (posted at finalize) → ReportArtifacts. Jobs wrap imports and exports. Workspace holds locale defaults and channel consent state.

## Screen inventory (11)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Sessions home | session list with state/mode/progress/IRA badges; first-run checklist (P22) | listCountSessions, listStores, getSession |
| S2 | Session setup | scope builder (cadence proposal / zone / full), mode, counter roster, policy pick | proposeCycleSlice, listPolicies, listLocations, createCountSession |
| S3 | Guided count view | the counter surface: scan/type entry, bilingual count sheet, progress meter (mobile-capable, blind-safe) | getCountSession, submitCountEntry, updateCountEntry, listCountEntries, listCatalogItems (search fallback) |
| S4 | Reconciliation | variance ledger, recount requests, resolutions, close gate, late entries | closeCountSession, listVariances, requestRecount, resolveVariance, submitCountEntry |
| S5 | Session detail (closed) | immutable ledger, IRA arithmetic, adjustments, artifacts | getCountSession, listCountEntries, listVariances, exportCountReport, getArtifact |
| S6 | Catalog | bilingual items, ABC class chips, import, label fixes | listCatalogItems, getCatalogItem, createCatalogItem, updateCatalogItem, importCatalogItems |
| S7 | Zones & stores | zone tree per store, bilingual zone labels, store cards | listStores, listLocations, saveLocation, updateStockLevels |
| S8 | Count policies | tolerance + cadence editor with live worked example | listPolicies, savePolicy |
| S9 | Reports & activity | variance history across sessions, activity log, jobs console, usage | listVariances, listActivity, listJobs, getUsage |
| S10 | Settings | locale, numeral display, stock-level channel consent (capability language) | getSession, getUsage |
| S11 | Command palette (overlay) | bilingual normalized search across sessions/items/zones/policies | client-side over S1/S6/S9 data |

## Per-screen state obligations

Four empties per P01 (S1 first-run offers the seeded sample session — the blind-reveal moment experienceable pre-import; S1 filtered-empty declares itself; S4 distinguishes never-revealed from all-resolved; S9 jobs empty is honest idle). Skeletons mirror final geometry per direction (P02). Errors per 03 mapping; full copy matrix in 11. The IRA badge on S1 renders an explicit no-data state for stores without a closed session — never zero (11 A).

## IA decisions and rationale

- **The session owns four states and the IA shows all four**: setup, count, reconcile, report are the same object's lifecycle (07a state machine); splitting them into separate destinations would let a reconciling session pretend to be countable — the exact drift the product kills.
- **The guided count view is a first-class surface, not a shrunken dashboard**: the counter (Sami, 02) is the highest-volume user; scan-focus, big quantity targets, zone order, and blind-safe rendering are designed-in, not responsive afterthoughts.
- **Reconciliation is its own screen with its own gate**: the close gate (uncounted + unresolved) is the product's accountability moment (P04 level 2) and needs dedicated geometry for the variance ledger's band visualization.
- **Policies live behind one small editor with a live worked example**: tolerance is policy data the manager must be able to read at a glance (Amal's objection, 02) — the editor computes a real example as fields change (06).
- **Reports & activity consolidated (T3 posture)**: per async-contract §7 Tier 3 may consolidate the job center into an activity surface — S9 merges variance history, activity log, jobs, and usage into one console with link-to-context.
- **Settings stays small and honest**: channel consent state renders in capability language wherever imports/exports happen (S6/S7/S5) — never only in a settings graveyard (credential-contract §3).
