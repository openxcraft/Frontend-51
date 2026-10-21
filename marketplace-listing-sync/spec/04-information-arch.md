# 04 — Information Architecture: marketplace-listing-sync

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Channels** (home: channel cards with connection + readiness state) · **Catalog** (master products) · **Mappings** (field map studio per channel) · **Readiness** (findings console across channels) · **Listings** (the board) · **Queue** (jobs center) · **Settings.** Three working surfaces are channel-scoped modes rather than standalone sections: the field map studio, the rule-pack editor, and the listings board all take a channel context from S1 (or "all channels" for the board). Two-level IA: section → item; the listing detail and master-product editor are item views with their own contexts. ⌘K command palette (P05, T2 mandate) reaches channels, master products, listings, findings, and jump-to-SKU, with normalized bilingual search (rtl-rules §4).

## Entity overview (07a for full shapes)

**Workspace** → owns **Channels** and **MasterProducts** and **Listings**. A **Channel** carries a locale requirement, an **AttributeCatalog** (channel attributes with required flags + constraints), and a versioned **RulePack** (compliance rules with severity + params). A **FieldMap** (one per channel, versioned) maps master fields (with locale variant + transform) onto channel attributes. A **MasterProduct** carries paired bilingual field values, images, and commercial data (price, stock level), versioned. A **Listing** joins one master product to one channel: state machine draft → checked (ready | ready-with-warnings | blocked) → publishing → published | error; derived **stale** whenever its pins (master/map/rule-pack versions) trail the current versions; paused as an operator hold. The deterministic check produces **ComplianceFindings** (per listing × rule, severity blocker|warning, resolved-by-edit recomputed / acknowledged-with-reason recorded). **MappingSuggestion** is the conditionally-AI artifact (candidate pairing + disclosed confidence + accept/edit/reject resolution). **Job** (import/check/publish/export), **ExportArtifact**, **ActivityEntry** (P17), **CapabilityState** (abstract needs), **Session** (auth-agnostic).

## Screen inventory (11)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Channels home | channel cards (state: connected/manual, readiness counts per channel), first-run checklist (P22) | listChannels, getSession, getComplianceReport (per-channel counts) |
| S2 | Channel setup & rule-pack editor | archetype pick at create; locale requirement; rule list with severity + params, editable numbers; connection state in capability language | listChannelTemplates, createChannel, getChannel, updateChannel, listCapabilities |
| S3 | Catalog | master products list (SKU, paired-title excerpts, price, stock, listing coverage per product), filters + saved views (P08), import | listMasterProducts, importCatalog, createMasterProduct |
| S4 | Master product editor | paired bilingual columns (P23) for title/description/bullets/brand/attributes; images; price + stock level; version history | getMasterProduct, updateMasterProduct, bulkUpdateMasterFields (single-product context), listListings (coverage strip) |
| S5 | **Field map studio** | the core surface: mapping table (master field + variant + transform → channel attribute), channel attribute catalog rail, suggestion panel (assist state) | getFieldMap, saveFieldMap, getChannel, suggestFieldMappings, resolveMappingSuggestion, listCapabilities |
| S6 | Listings board | per-channel/all listings with state chips (draft/ready/ready-with-warnings/blocked/publishing/published/error/stale/paused), bulk select + publish/export actions (P07) | listListings, bulkCreateListings, publishListings, exportChannelFile, getUsage |
| S7 | Listing detail | mapped preview (attribute values with transforms named, overrides flagged), focused checklist results, publish history with pins, master diff when stale | getListing, updateListing, setListingPaused, deleteListing, runComplianceCheck (scoped) |
| S8 | Readiness console | findings across a channel (grouped by rule, then severity), bulk acknowledgment paths, per-rule drill-down | getComplianceReport, listComplianceFindings, resolveComplianceFinding, runComplianceCheck |
| S9 | Publish & exports | batch composition, per-listing outcomes for running/finished jobs, artifacts with expiry | publishListings, exportChannelFile, getArtifact, listJobs |
| S10 | Jobs center | imports/checks/publishes/exports — filterable, cancel/retry, link-to-context (async-contract §7) | listJobs |
| S11 | Settings | capability consent state (kind, not vendor — credential-contract §2), usage window, workspace defaults | listCapabilities, getUsage, getSession |

Mobile (≤767px): S1, S6, S8, S9, S10 in read/monitor modes (Noura's weekly review is fully mobile); S4 paired editing and S5 mapping are desktop/tablet (00 surface); S3 read-only. Every screen states its filters (P08) and enumerates its applicable empties per P01 (11 matrix).

## Per-screen state obligations

First-run (S1 offers the sample channel + sample catalog — the planted blocker is the value proof, clearable in one action, never returning); skeletons mirror final geometry per direction (P02, RTL skeletons flip); errors per 03 mapping; copy matrix in 11. Channel cards degrade honestly: a channel with no bound capability renders "manual/export" state, never a fake connection (credential-contract §2 kind-not-vendor).

## IA decisions and rationale

- **Channels before listings in the rail**: the buyer's mental model is channel-shaped (each marketplace has its own rules and its own dashboard today) — S1 is the home that replaces the three-dashboards habit (02 Badr).
- **The field map studio is a first-class screen, not a settings tab**: the mapping is the product's unique object (00) — burying it in settings would bury the wedge; the attribute-catalog rail keeps required flags visible while mapping (CP-2).
- **The rule-pack editor lives inside channel setup**: rules are channel-scoped policy data (07a); Salem curates them per channel with full visibility (02), and rule edits re-version the pack with findings recompute declared (CP-3.4).
- **Readiness console is separate from the listing detail, not instead of it**: Salem audits channel-wide; Amira fixes listing-local (02 JTBDs) — same findings data, two scopes, one operation set (listComplianceFindings + resolveComplianceFinding).
- **The listings board carries the bulk actions**: publish/export are batch verbs (CP-4); the board is where "the ready set" is selected, counted, and handed off — with blocked/stale rows excluded-and-named by the adapter, not the UI's guess.
- **Queue (S10) is small but first-class**: imports, checks, publishes, and exports are the product's async Jobs (async-contract §7) — publish honesty depends on their visibility.
