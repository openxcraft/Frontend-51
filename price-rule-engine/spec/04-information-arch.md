# 04 — Information Architecture: price-rule-engine

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Console** (rules home) · **Catalog** (items + item detail) · **Simulate** (simulation workspace + simulations history) · **Proposals** · **Queue** (jobs center) · **Activity** · **Settings.** Two-level IA: section → item; the simulation workspace is the simulation detail (summary header + row table). ⌘K command palette (P05, T2 mandate) reaches rules, items (SKU + bilingual normalized name search), simulations, and proposals, plus jump-to-SKU inside an open simulation.

## Entity overview (07a for full shapes)

**Workspace** (markets: KSA/UAE with VAT rates, currency, minor digits; default floor markup; version) → owns **CatalogItems** (SKU, bilingual names, category, market, channel, current net price, optional absolute floor) → each carries effective-dated **CostRecords** (landed components) and a **PriceHistory** chain. **Rules** (scope conditions, priced actions, priority, validity window, status, version) evaluate over the catalog inside **Simulations** (immutable snapshots: scope, rule-set pin, cost snapshot date, per-row results, aggregate margin preview). Simulations curate into **PriceProposals** (reviewed row subset with exclusions-and-reasons, submission gate, immutable **ApprovalRecord**). Approved proposals **export** as **ExportArtifacts** (price sheet + audit ledger, expiry, regenerable). **Job** (import/simulation/export), **ActivityEntry** (P17), **Session** (auth-agnostic).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Rules console home | rule list with status/priority/window/scope, first-run value checklist (P22) | listRules, getSession |
| S2 | Rule editor | condition + action pickers, priority, window, **rendered deterministic formula** with worked example | getRule, createRule, updateRule, deleteRule, listCategories |
| S3 | Catalog | item table with cost/net/margin/floor, filters + saved views (P08) | listCatalogItems, importCatalog |
| S4 | Item detail | cost history timeline, price history, applied-rule trace, manual price path | getCatalogItem, listCostRecords, saveCostRecord, updateCatalogItem, saveCategory |
| S5 | Simulation composer | scope, rule mode, cost snapshot date, pre-run quota | getUsage, runSimulation, listRules |
| S6 | **Simulation workspace** | the core surface: summary header (margin preview, clamps, directions) + virtualized before/after rows + formula drawer | getSimulation, listSimulationRows |
| S7 | Proposals + proposal review | proposals home; review mode with include/exclude + reasons, gate, approval | listPriceProposals, getPriceProposal, updatePriceProposal, submitPriceProposal, approvePriceProposal, withdrawPriceProposal |
| S8 | Exports & jobs | jobs console (imports/simulations/exports), artifacts, cancel/retry | listJobs, exportPricePackage, getArtifact |
| S9 | Settings | markets/VAT/floor defaults (versioned), ending conventions, capability consent, usage window | getWorkspace, updateWorkspace, getUsage, getSession |
| S10 | Activity log | actor-action-target audit chain, filterable, exportable via the package ledger | listActivity |

Mobile (≤767px): S1/S3 read with filter chips; S6 summary header + read-only row cards (the Salem surface, 03 CP-3.6); S7 status reads; S8 job monitoring. Row-level proposal review and rule authoring are desktop/tablet (00 surface). Every screen states its filters (P08) and its four empties per P01 (11 matrix).

## Per-screen state obligations

First-run: S1 offers the sample workspace — 12 items, costs, one active rule, one seeded simulation (the planted floor clamp is the value proof, 07c); skeletons mirror table geometry per direction (P02, RTL skeletons flip); errors per 03 mapping; copy matrix in 11.

## IA decisions and rationale

- **Simulation is a first-class historical object, not a transient view**: every run is an immutable snapshot with its own row set — proposals pin to one, comparisons read two, and the "what would it have done before the increase?" question (03 CP-3.1) is answered by re-running against an old cost snapshot, not by mutating history.
- **The proposal is separate from the simulation because the decision lifecycle differs**: a simulation is computation; a proposal is governance (review, exclusions with reasons, gate, approval). Collapsing them would make "computed" and "approved" indistinguishable — the exact blur the product exists to prevent.
- **Cost records live on the item, but the bulk path lives in its own composer**: the cost sheet paste (03 CP-5.1) is the product's most repeated flow — it deserves its own moment in the catalog surface rather than being buried in item detail.
- **Rules console is the home screen, not the catalog**: the buyer's mental model is "my rules over my catalog" — the catalog is the substrate, the rule is the act. First-run lands on the console with the sample rule visible (P22).
- **Queue (S8) is small but first-class** (async-contract §7): imports, simulations, and exports are the product's async Jobs; the simulation job is the one the user most often waits on.
- **Activity (S10) is the audit surface**: the approval chain's answer to "who decided this and why" is a filterable log, and the export ledger is its printable twin (P17).
