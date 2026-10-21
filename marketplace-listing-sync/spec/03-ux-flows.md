# 03 — UX Flows: marketplace-listing-sync

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation exactly once — no orphans, no phantoms. Terminology per 02: channel · master product · catalog · field mapping · rule pack · compliance checklist · blocker · warning · readiness · publish · export · suggestion · staleness.

## CP-1 — First channel, catalog import, first readiness verdict (value proof)

1. Badr opens the channels home: empty first-run state offers the value checklist (P22) — map a catalog, see verdicts, publish or export — and the seeded sample channel + sample catalog (07c) so the parity moment (watch a blocker refuse a publish) is experienceable before any real data exists. `listChannels` · `getSession`
2. He creates the first real channel: pick a **channel archetype** from the seeded catalog (bilingual marketplace · global marketplace · Arabic storefront platform), name it, set its locale requirement (both locales required / en-primary / ar-primary), and confirm the seeded rule pack that comes with the archetype — every rule visible with its severity and number (title ceiling 75, image minimum 1, forbidden characters, bilingual parity…), every number editable (12 Q-9: demonstration values, never marketplace truth). `listChannelTemplates` · `createChannel`
3. Amira imports the catalog by paste (always-available manual path, LOOP-5): one block per product — SKU, paired titles, paired descriptions, bullets, brand, image URLs, price, stock — or via the abstract catalog-intake capability when bound. Import is a Job per async-contract: paced, cancellable, row-count progress ("Importing 16 of 24 products"). `importCatalog` · `listJobs`
4. The catalog lands: 24 master products with paired locale fields rendered side-by-side in the product editor (P23); Arabic normalization applies to search only (rtl-rules §4; disclosed in-panel). `listMasterProducts` · `getMasterProduct`
5. Amira links the first product to the channel — a **draft listing** is created with the channel's current field map applied; the mapped preview renders (mapped attribute values with their transforms named). `createListing` · `getListing`
6. She runs the compliance check on the channel (a Job — deterministic rules per 07c): the readiness console fills with per-listing verdicts; four seeded products arrive blocked with named blockers (title 90/75, missing Arabic description, zero images, forbidden character in the title). `runComplianceCheck` · `getComplianceReport` · `listComplianceFindings`

**Edges**: pasted block missing the Arabic title (imports as-is — the bilingual-parity rule flags it at check time, never silently dropped); SKU collision on import (existing product updated via declared merge policy, conflict named per row); image URL list empty (imports; image-count rule flags at check); archetype locale requirement changed after listings exist (all listings re-evaluate on next check — never silently).
**Failures**: malformed paste → VALIDATION naming the first broken block, prior blocks retained (partial policy, async-contract §4); catalog-intake capability unconsented → PERMISSION naming the capability class with the paste path offered inline (credential-contract §4); check quota (P14) → RATE_LIMIT ladder notice; NETWORK mid-import → typed error, imported rows kept.
**Recovery**: the catalog persists across failed imports; the compliance check re-runs at will; verdicts are recomputed from the same state — same input, same verdict (determinism oracle, 07c).

## CP-2 — Bilingual field mapping in the studio (the daily loop, incl. the conditionally-AI surface)

1. Amira opens the **field map studio** for the channel: the mapping table center (one row per mapped channel attribute: master field + locale variant + transform → channel attribute), the channel's attribute catalog on the inline-end edge (required flags, constraints per attribute), and the suggestion panel on the inline-start edge. `getFieldMap` · `getChannel`
2. She maps the bilingual pair deliberately: channel attribute `item_name` ← master `title` variant `ar` (no transform); `item_name_en` ← `title` variant `en` with transform `truncate-at-word-boundary 75`; `brand` ← `brand` variant `en` (channel takes Latin brand marks verbatim); `inventory` ← `stockLevel` (no locale — numeric). Each row is keyboard-complete (P18 grid: ↑/↓ traversal, Enter to edit, Escape restores — P06). `saveFieldMap`
3. **Suggestion path (conditionally-AI)**: with the mapping-assist capability bound, the panel ranks candidate pairings with disclosed confidence and the capability's provenance label (`assist-simulated` in the mock, `assist-bound` at binding) — she accepts a 0.78 suggestion (`product_name_ar` ← title, variant ar — applied to the draft mapping as a new row), edits a 0.51 one (`long_description` ← description/en — retargets the transform before accepting), and rejects a 0.05 misfire (brand ← attributes/category, the planted zero-overlap candidate). Every accepted suggestion lands as an ordinary mapping row — draft-by-default, human-approved (P15); the deterministic confidence formula is disclosed on the panel (07c rule 3). `suggestFieldMappings` · `resolveMappingSuggestion`
4. **Degradation path (the honest default)**: with the assist unbound, the suggestion panel states the manual editor is the full citizen — nothing else changes; mapping rows are authored by hand exactly as in step 2 (00 AI stance; 08 N3 degradation map). `listCapabilities` (panel state read)
5. She saves the field map: it re-versions; every listing on the channel goes **stale** (checkedAgainstMapVersion < new map version) with an honest banner naming the count — never silent propagation. `saveFieldMap` → `listListings` (stale filter)
6. Mapping transform preview: hovering/focusing a transform chip renders the computed result on a sample value (truncate at word boundary is computed, never guessed) — the preview is text, not a tooltip promise (07c rule 4). `getFieldMap` (preview computed client-side from the declared rule)

**Edges**: two master fields mapped to the same channel attribute (VALIDATION on save — the collision is named, first-mapping wins is never assumed); a channel attribute required by the rule pack left unmapped (the map saves; the *checklist* flags the resulting listings — mapping freedom, readiness honesty); transform on a numeric field (VALIDATION — transforms are text-only); deleting a mapping row that ready listings depend on (allowed — listings stale-mark, re-check named as the path back).
**Failures**: stale map edit from another seat → CONFLICT with both payloads; assist capability rate-limited → RATE_LIMIT with the manual path re-offered inline (the ladder never blocks the editor); assist failure mid-suggestion → typed error, panel degrades to manual state, nothing half-applied.
**Recovery**: field maps are versioned; a reverted version restores the prior mapping state and re-stales honestly; suggestions never auto-apply (accept is the only write path).

## CP-3 — Compliance checklist: blockers, warnings, and the human decisions (the signature check)

1. Salem opens the **readiness console** for his channel: findings grouped by rule, then severity — blockers (title ceiling breached, required attribute empty, bilingual parity missing, image minimum unmet, forbidden characters present) and warnings (title in the 90–100% ceiling band, single image where several are recommended, acknowledged-and-standing items). Every finding carries its arithmetic: measured value, limit, the rule's severity, and the affected listing as a link. `getComplianceReport` · `listComplianceFindings`
2. He fixes a blocker at its source: the listing detail opens with the mapped preview and the failing rule focused; he edits the master title (82→71 characters, editing the Arabic pair in place, P23 columns) — on commit, that listing's rules re-run live (deterministic recompute ≤80ms budget, 10) and the blocker dissolves only when the arithmetic passes. `updateMasterProduct` → `getListing` (recomputed)
3. Or he resolves without editing: an image-count *warning* (one image, channel recommends several) is acknowledged with a reason ("lifestyle shoot scheduled") — recorded on the finding, visible at publish time and in exports. `resolveComplianceFinding`
4. Or he adjusts the rule itself when the pack is wrong for this channel: the rule-pack editor changes the title ceiling (75→80 for this channel's category policy — an owner decision recorded in the activity log) and the affected findings recompute on the next check run, declared as a side-effect (never silent). `updateChannel`
5. Bulk path: he filters the console to one rule kind (all bilingual-parity blockers), opens each affected listing's missing Arabic description from the master editor's paired columns, and re-checks the filtered set in one action. `listComplianceFindings` (filter) · `bulkUpdateMasterFields` (the paired-field fix path where the fix is uniform) · `runComplianceCheck`
6. The readiness verdict per listing derives: **blocked** iff any blocker stands; **ready** when all blockers clear; **ready-with-warnings** carries the acknowledged set; the board's counts update live (derived read ≤120ms, 10). `listListings` (state chips)

**Edges**: a rule edited mid-open-console (findings carry the rule version they were computed against — no retroactive mutation, 07a pinning); a finding whose listing was deleted (the finding closes as `listing-removed`, kept in history); acknowledge on a *blocker* (refused — blockers resolve by data or rule change only; the ladder is the point); the same rule failing on both locales (two findings, one per locale variant — named distinctly).
**Failures**: resolving an already-resolved finding → CONFLICT with current state shown; rule-pack edit with invalid params (ceiling < 1, image minimum < 0) → VALIDATION naming the field; check quota → RATE_LIMIT ladder.
**Recovery**: findings are recomputed from declared state; decisions (acknowledgments) and rule versions are append-only history; nothing reviewed is lost to a re-run (findings regenerate, acknowledgments persist by rule+listing key, 07c rule 6).

## CP-4 — Publish and export (the handoff gate)

1. Salem selects the ready set on the listings board (P07 bulk select — action bar names the count and criteria). `listListings`
2. **Publish path (capability bound)**: he publishes the batch — a Job per async-contract with per-listing determinate progress; blocked or stale listings in the selection are skipped and named (never silently included); the adapter refuses per listing, not per batch. `publishListings` (idempotency key per batch)
3. The channel capability returns per-listing outcomes: published listings carry their `publishedAgainst` pins (master version, map version, rule-pack version — the audit chain); a rejected listing lands in `error` state with the channel's code mapped into the 7-class taxonomy and the channel's message verbatim beside our typed next-action. The batch's partial policy delivers the succeeded set + named failures with per-listing retry (async-contract §4). `publishListings` → `listListings` (error state) · `getListing`
4. **Export path (manual, permanent)**: for the Arabic storefront channel with no bound capability, he exports the ready set as a channel-ready file — the same checklist verdicts are carried into the file (blocked listings excluded and named; acknowledged warnings annotated) — a Job with artifact + expiry + regeneration. He downloads and uploads it in the channel's own seller surface; the artifact is the LOOP-5 handoff. `exportChannelFile` · `getArtifact`
5. Per-listing overrides when a channel needs one exception: he sets a channel-specific title override on a single listing (override flagged in the mapped preview — overrides never masquerade as master data) and re-publishes that listing alone. `updateListing` · `publishListings`
6. Jobs console across publish/export/import/check: filterable, cancel/retry, link-to-context (async-contract §7). `listJobs`

**Edges**: master edited while a publish job is queued (the job carries the pin set at submit; the listing goes stale after completion — the next cycle catches it, never a mid-flight mutation); export of a set containing stale listings (allowed with explicit flag — the file carries the stale marker; publish refuses them instead); artifact expiry (NOT_FOUND with regenerate — the listing state is unchanged); a channel credential failing mid-batch (per-listing outcomes so far are kept; remaining listings return to ready state with the credential's typed error surfaced where the capability is used — credential-contract §3).
**Failures**: publish quota → RATE_LIMIT ladder with reset time; channel capability NETWORK mid-batch → partial results + per-listing retry on the un-attempted remainder; channel rejection codes unmappable → UNKNOWN with the channel's message verbatim and correlationId (never a fabricated translation of the channel's error).
**Recovery**: publish jobs are idempotent per batch key (a double-submit never double-publishes — async-contract §5); error listings keep their full history; exports regenerate from listing state deterministically.

## CP-5 — Master edit propagation and staleness (the sync discipline)

1. Amira edits a master product (new Arabic description, price field, stock level 14→9): the master re-versions; every listing depending on it derives **stale** (publishedAgainst.masterVersion < new version) and the board's stale count ticks with per-channel breakdown. `updateMasterProduct` · `listListings` (stale filter)
2. Bulk stock path: a delivery lands and she bulk-updates the stock-level field on 60 products — a single Job with per-row progress; listings derive stale per product; price values ride the same path as plain data (no rules, no schedules — price-rule-engine's boundary, 12 Q-5). `bulkUpdateMasterFields`
3. Salem reviews the stale set per channel: the listing detail shows exactly what changed (master diff beside the mapped result — P16 direction-aware diff); he re-validates in one action (check re-runs on the stale set — rules re-evaluate against the *new* master state). `runComplianceCheck` (scoped) · `getListing`
4. Re-publish or pause: ready-and-stale listings re-publish through CP-4; a listing deliberately held back (channel out of stock policy) is **paused** — sync updates stop for it while the master keeps moving; unpausing re-stales honestly. `setListingPaused` (state transition) · `publishListings`
5. Noura's weekly read: the readiness board per channel with blocked/ready/warnings/stale/error/paused counts and the week's activity trail — the honest state, exportable. `getComplianceReport` · `listJobs` · viewer session (07b role rule)

**Edges**: stale listing whose channel rule pack ALSO changed since last check (both pins compared — the listing detail names both: "master v3 and rule pack v2 have moved"); paused listing whose master is deleted (listing goes stale-final: unpublish-or-archive decision offered, never auto-delete); bulk update touching a field no mapping reads (listings do NOT stale — only mapped-dependency changes stale, computed from the field map, 07c rule 8); concurrent master edits → CONFLICT both kept.
**Failures**: bulk row errors (per-row VALIDATION named; valid rows proceed — partial policy); NETWORK mid-bulk → queued writes re-flush per-item (P20).
**Recovery**: staleness is derived, never stored stale-then-forgotten; every publish carries its pin set; the activity log records the actor-action-target chain through the whole cycle (P17).

## Non-happy paths

- **No channels yet** (first-run): the sample channel + sample catalog ship the planted blocker so the value moment — watch a blocker refuse a publish — is experienceable in minute one; clearing the sample is one action and it never returns (P22; 07c `sample: true` fixtures). `listChannels` first-run empty state (11 A).
- **Mapping assist unbound** (the default state, LOOP-5): the studio is a complete manual mapping desk — the suggestion panel states the manual path is the full citizen; nothing else degrades (08 N3; 11 A row). `listCapabilities`
- **Publish capability unbound for every channel** (the all-off configuration): the product is a complete readiness + export desk — every channel exports channel-ready files with checklist verdicts baked in; the 00 success signal tests exactly this configuration. `exportChannelFile`
- **Offline**: reads work; master edits and mapping saves queue with per-item state (P20); checks and publishes are Jobs that reconcile to authoritative state on reconnect (async-contract §5).

## Failure → error mapping

VALIDATION (malformed import blocks, mapping collisions, transform misuse, rule-pack param sanity, bulk row errors) · NOT_FOUND (stale channel/listing/product/artifact links, expired artifacts) · PERMISSION (capability consent, workspace scoping, viewer-role mutations) · CONFLICT (concurrent master/mapping/rule-pack/listing edits, double-resolved findings) · RATE_LIMIT (compliance check runs, publish batches, export files, assist suggestions) · NETWORK (list fetches, job polling, publish/export delivery) · UNKNOWN (unmappable channel rejection codes, typed retry with correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.1, CP-5.5 (viewer session read) |
| `listCapabilities` | CP-2.4 (assist panel state), non-happy assist-unbound |
| `listChannelTemplates` | CP-1.2 (archetype picker) |
| `createChannel` | CP-1.2 |
| `listChannels` | CP-1.1, app entry · S1 channels home (04) — the workspace's first screen, exercised by every persona in 02 |
| `getChannel` | CP-2.1 (attribute catalog), CP-3.4 (rule-pack editor read) |
| `updateChannel` | CP-3.4 (rule-pack edit, re-versions pack) |
| `importCatalog` | CP-1.3 |
| `listMasterProducts` | CP-1.4, CP-3.5 (filtered fix set) |
| `getMasterProduct` | CP-1.4, CP-5.1 (edit surface read) |
| `createMasterProduct` | CP-1 non-happy (sample-clear path), S4 editor create (04) |
| `updateMasterProduct` | CP-3.2 (title fix), CP-5.1 (edit propagation) |
| `bulkUpdateMasterFields` | CP-3.5 (paired-field fix), CP-5.2 (bulk stock) |
| `getFieldMap` | CP-2.1, CP-2.6 (transform preview read) |
| `saveFieldMap` | CP-2.2, CP-2.5 |
| `suggestFieldMappings` | CP-2.3 (conditionally-AI surface) |
| `resolveMappingSuggestion` | CP-2.3 (accept / edit-accept / reject) |
| `runComplianceCheck` | CP-1.6, CP-3.5, CP-5.3 (scoped re-check) |
| `getComplianceReport` | CP-1.6, CP-3.1, CP-5.5 |
| `listComplianceFindings` | CP-1.6, CP-3.1, CP-3.5 (filter) |
| `resolveComplianceFinding` | CP-3.3 (acknowledge with reason) |
| `createListing` | CP-1.5 |
| `bulkCreateListings` | CP-1 non-happy scale path — S6 board "list the ready catalog on this channel" action (04); exercised in the 00 DoD via the 24-product seed |
| `listListings` | CP-2.5 (stale), CP-4.1 (ready set), CP-4.3 (error state), CP-5.2 (stale per channel) |
| `getListing` | CP-1.5 (mapped preview), CP-3.2 (focused rule), CP-4.3, CP-5.3 (master diff) |
| `updateListing` | CP-4.5 (per-channel override, baseVersion) |
| `setListingPaused` | CP-5.4 (pause/unpause transitions) |
| `deleteListing` | S7 listing detail row menu — P04 level-2 confirm naming the listing and its publish history (04; edge in CP-5 "master deleted" path) |
| `publishListings` | CP-4.2, CP-4.5, CP-5.4 |
| `exportChannelFile` | CP-4.4, non-happy all-off configuration |
| `getArtifact` | CP-4.4 |
| `listJobs` | CP-1.3, CP-4.6, S10 jobs center (04) |
| `getUsage` | CP-4.1 (pre-publish quota read), S11 settings (04) |

33 operations, 0 orphans, 0 phantoms (Critic-verified — the table above lists every 07b operation exactly once; scripted check at self-audit, §6b of the worklog entry). `listChannels` is the channels-home entry surface (04 S1) — the workspace's first screen, exercised on app entry by every persona in 02. `bulkCreateListings` is the board's one-action scale path from the seeded 24-product catalog (the 00 DoD exercises it); `deleteListing` is the P04 ladder's level-2 entry point from the listing detail (its edges and confirm copy live in 11 C and 06).
