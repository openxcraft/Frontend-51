# 08 — Integration Map: sales-cohort-view

AI declaration (ai-native-patterns §1): **declared non-AI** — there is no model capability anywhere in the product, therefore no AI degradation ladder exists; the degradation map below covers the two real capability axes (data path, delivery) and every rung keeps the full deterministic workflow alive.

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Commerce-orders source capability** ("return order history — dates, customer references, net revenue, channel/market attributes — within a declared coverage window") | Live cohort grids over the buyer's commerce data without extracts | Paste/import a bounded orders sample (date, customer key, net revenue, channel, market rows) — the seeded workflow of every persona's spreadsheet predecessor (02); the full engine, season anchoring, comparison, and export run unchanged on sample data |
| N2 | **Evidence delivery capability** ("deliver export artifacts to external destinations") | Quarterly-review automation someday | Download/copy the evidence pack — handoff is export-only at v1 (00 exclusions); the artifact carries grid + comparison + season-window versions + ruleset, reproducible by construction |
| N3 | **Notification channel** ("notify members of job completions and source-health changes") | Cross-context delivery when members navigate away (async-contract §6) | In-context completion + return-state surfacing (jobs console, freshness chips on re-entry); the digest tier is the only rung that needs the channel |
| N4 | **Curated moment-calendar data binding** ("a maintained MENA retail-season calendar service") | Keeping curated windows (lunar dates, drift) fresh across years without workspace gardening | The built-in editable season library: curated defaults per market/kind, dual-calendar entry, drift disclosure, versioned edits — plus the create-by-hand path; binding a portfolio sibling's moment library is an owner-level future decision, not v1 (LOOP-3, 12 Q-5) |

## Consent semantics (credential-contract)

- N1 is per-capability-class: the workspace grants "read order history for declared coverage windows" — displayed in capability language before save (credential-contract §4), never a vendor name. Grant extension asks explicitly if reads widen scope (new markets, longer coverage).
- The N1 credential's health surfaces wherever data is quoted: the freshness chip on every grid header, the sources surface, and the evidence-pack footer (credential-contract §3 — never a settings graveyard). Failure degrades the grid to last-known snapshots with the paste path stated in the same surface (§6 posture).
- N2 delivery never requires N3; N4 binding (if ever ratified) is read-only calendar data, consent-scoped like N1.
- Customer privacy boundary: the drill surface reads only customerKey + displayLabel + first order + aggregates through the adapter (07a); no contact graph, no enrichment, no writes — the CRM boundary is structural (07b rule 7).

## Risk flags

- N1 binding-time evaluation: revenue-field meaning fidelity (does the source's "revenue" match the net-of-refunds-and-discounts meaning the definitions surface declares?), customer-key stability across syncs (identity drift would silently split cohorts), and coverage-window honesty (a source that cannot declare coverage cannot back the honesty rules — 07c §2.4). A fixed evaluation set (seed-scale orders with known grids) must pass before N1 ships active (12 Q-8).
- N1 refresh cadence vs comparison reproducibility: snapshots pin source state (07a), so a refresh mid-analysis never mutates a quoted grid — but a workspace that never refreshes will present stale evidence as current; the freshness chip and the evidence footer are the mitigations, and staleSourceDays in the mock exercises them.
- N4 lunar-calendar drift maintenance: curated windows carry ±1-day drift disclosure rather than false precision (portfolio Q-5 posture); the risk is calendar rot, mitigated by the versioned calendar surface and the year-label review flow (03 CP-3), never by silent re-dating.

## Degradation map (per ai-native-patterns §8 — non-AI declaration: capability axes only)

| Surface | Source bound + fresh | Sample-only (N1 unbound/failed) | Delivery unbound (N2/N3) |
|---|---|---|---|
| Grid workspace (S1) + cohort detail (S2) + drill (S3) | full | full over the imported sample — coverage honestly narrower, chip says "sample data" | full |
| Season calendar (S4) + anchoring + comparison (S5) | full | full — season windows are workspace data, independent of the data path | full |
| Definitions (S7) | full | full | full |
| Sources (S8) | refresh Job + coverage declaration | sample-import Job is the primary path; binding offered, never required | full |
| Views (S6) / Activity & jobs (S9) | full | full | exports deliver in-context (download/copy); notification tier degrades to return-state surfacing |

Non-AI core statement: every workflow — grid, overlay, anchoring, comparison, drill, definitions, export — is deterministic arithmetic with no model dependency; there is no rung of the product that pauses for a capability (the 00 success signal #3 tests exactly this against the mock's sourceUnbound configuration).
