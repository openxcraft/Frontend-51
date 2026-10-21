# 03 — UX Flows: ad-spend-consolidator

SME-C pass · 6 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation — no orphans. Terminology per 02: channel connection · channel kind · spend line item · import batch · normalization policy · reporting currency · conversion receipt · consolidation run · snapshot · overlap finding · resolution · holiday moment · overlay window · occurrence · control window · budget line · pacing · report pack.

## CP-1 — First window: connect/paste → declare policy → first consolidation (value proof)

1. Huda opens the workspace on first run: the onboarding checklist (P22) offers the sample workspace and the three value milestones — first one-number dashboard, first overlap cleared, first like-for-like moment read — each linking into this path. Her session renders the chrome per her locale (either direction, full citizen — 05). `getSession`
2. She surveys the channel-kind catalog before connecting anything: kinds are capability classes, never vendors — search-ads-class, social-ads-class, video-ads-class, marketplace-ads-class, offline-media-class, agency-report-class, other-class — each with its typical cadence and native metric-shape notes so the policy she declares later has a referent. `listChannelKinds`
3. Existing connections list (empty on true first run; the seeded workspace shows five — 07c). Each row shows kind, native currency, cadence, metric shape, status, and freshness. `listChannelConnections`
4. Turki connects the first channel the manual way (LOOP-5, zero credentials): name "Primary Search Ads", kind search-ads-class, native currency SAR, cadence daily, metric shape spend-date, dedupe priority 1. The create form states in capability language what a connected channel would grant ("Reads spend reports from this channel") and offers the paste path inline — no consent needed for paste, ever. `createChannelConnection`
5. Lina later edits a connection's policy (cadence weekly→daily, or priority change): the edit re-versions the connection; every snapshot computed against the old version keeps it (version pinning, 07a). `updateChannelConnection`
6. Lina verifies a connected channel before relying on it: verification exercises a real read round-trip (credential-contract §7 — no success without exercising the capability) and returns typed success or a typed error naming the failure; a paste-only workspace skips this step entirely. `verifyChannelConnection`
7. Turki imports spend lines — the always-available manual path: paste blocks (one line item per row: date, external key, campaign reference, native amount, native currency, report date) or file upload through the same parser; a connected channel can also be pulled with granted consent (capabilityRef). Import is a Job per async-contract: paced, cancellable, row-count progress ("Importing 140 of 180 line items"). `importSpendLines`
8. Huda declares the normalization policy once: reporting currency SAR (one per workspace — the functional-currency convention, 01 Source 11), FX basis daily-rate-per-spend-day (monthly-average option, declared — honest gap 3), dedupe epsilon 2% (12 Q-7), pacing variance threshold 10%. The policy edit is versioned; changing FX basis or epsilon re-declares — and the next consolidation recomputes, never silently. `updateNormalizationPolicy`
9. She runs the first consolidation — a Job (deterministic; exact rules in 07c §2): normalize every line item into SAR with conversion receipts, detect overlaps, version the window, compute totals. Progress is determinate per line item. On completion the dashboard lands on the period total with the snapshot version chip locked beside it ("The Total Stamps", the T2 signature — 05). `runConsolidation`
10. The snapshots list shows every version with its computedAt, policy version, window, and health flags (open overlaps, late-cadence channels, revisions applied). `listSnapshots`
11. Jobs console across the product: imports, consolidations, exports — filterable, cancel/retry, link-to-context (async-contract §7). `listJobs`

**Edges**: paste rows with missing native currency (VALIDATION naming the first bad row; prior rows retained — partial policy per async-contract §4); an amount that predates the FX table's earliest declared rate (imported; the conversion receipt carries rate-unavailable and the snapshot health flags it — never a silent zero); a connected channel whose pull window exceeds the granted scope (PERMISSION naming the capability class); mixed-script campaign names (bidi isolation at render, never force-flipped — rtl-rules §2); the same external key imported twice from the same channel (both kept — same-channel duplicates are overlap candidates like any other, 07c rule 4).
**Failures**: malformed paste → VALIDATION with the first bad row named and its neighborhood confirmed imported; channel pull unconsented → PERMISSION with the paste path offered inline; consolidation job failure mid-way → typed error + retry, previously normalized rows kept; FX table missing a pair → VALIDATION at policy-save time when the pair is required by an active connection.
**Recovery**: line items persist across re-imports (revision bumps, no overwrites — CP-6); consolidation is re-runnable at will and deterministic — same inputs, same snapshot content; nothing reviewed or resolved is ever lost to a failed re-run (findings are recomputed, resolutions re-checked against the live policy, human decisions are kept and re-presented).

## CP-2 — The daily consolidated review (the daily loop)

1. Turki opens the spend dashboard: the period read comes from the current snapshot — window, totals by channel and day, health chips. The snapshot is named and versioned on screen because the number he reads is *a version of the truth*, not ambient data. `getSnapshot`
2. The SpendTimeline renders the daily normalized series for the window with overlay bands for every moment intersecting it (Ramadan, Eid, White Friday — fill + boundary + bilingual label per band, occurrence anchored, method disclosed) and the linear pace line when a budget line covers the window (P18 keyboard traversal; charts run right-to-left in RTL with the value axis on the inline-end — rtl-rules §2). `getSpendTimeline`
3. The ChannelBreakdownTable lists per-channel totals in the reporting currency, each row carrying its cadence, freshness state, native currency, and a receipt expander. Sortable; >200 rows virtualize (P19). `getSpendBreakdown`
4. Keyboard path: ←/→ move day-to-day on the timeline; Enter opens the day detail (channel split for that day); B toggles the breakdown focus; R expands the focused row's receipts. Every state change announced per the live-region schedule (09).
5. He drills from a breakdown row (or a timeline day) into the raw line items that produced it: channel-native rows with native amounts, import batch, revision state, and dedupe state — the evidence trail from the one number back to the source rows (P16 discipline: the aggregate is never shown without a path to its inputs). `listSpendLines`
6. He opens the FX rate table to answer "which rate, which basis": the table declares itself workspace policy data (declared rates with basis and effective dates — never presented as a market feed, 08 N3); every rate row links to the receipts that used it. Turki can paste additional declared rates — the manual path for rate maintenance. `getFxRateTable`

**Edges**: a day whose line items carry rate-unavailable receipts (the day renders with a flagged marker and is excluded from lift ratios — 07c rule 6); a channel with zero spend in window (row renders with "no line items in window" — an honest zero, not an omitted row); a timeline day covered by two overlay bands (both bands render, layered, each labeled — overlap of *windows* is visible, never merged); a campaign reference in Latin inside Arabic chrome (bidi isolation, rtl-rules §2).
**Failures**: NETWORK mid-list → banner + retry, reads safe (P20); snapshot superseded while reading (the chip names the newer version with a one-action switch — the read never mutates under the reader); stale artifact link → NOT_FOUND with regenerate.
**Recovery**: dashboard reads are derived from the snapshot — deterministic re-read; the timeline and breakdown queries are re-runnable without side effects; the navigator's filters and cursor persist per session (P11).

## CP-3 — Overlap reconciliation (the honesty work)

1. Turki opens the reconciliation console: overlap findings for the current snapshot — each a candidate pair of line items from different channels claiming the same spend (external key + day + amounts within epsilon), with match evidence: the two native amounts, the two currencies, the converted delta, the matched key and window, and a deterministic match score (07c rule 4). `listOverlapFindings`
2. He inspects the pair beside the raw rows: both line items side-by-side with their import batches, report dates, and connection policies — because the decision needs the evidence, not just the flag (the reconciliation trap the category's "nothing slips through" copy gestures at — here it is a workflow, 01 q3).
3. He resolves: **keep-first** (by declared connection priority — the marketplace console is the channel of record, the agency report is corroboration), **split** (allocate a declared portion to each — for genuinely distinct buys that share a key), or **both-counted** (they were actually two different spends; re-key one). Every resolution requires a reason; every resolution is recorded in the activity log and the reconciliation ledger (P17). `resolveOverlap`
4. The next consolidation re-derives: resolved overlaps collapse per their resolutions; unresolved ones stay open and continue to be flagged in snapshot health (the total is honest about its own state — "2 open overlaps" is part of the number's identity, 11 copy).
5. Re-running the comparison against a different policy (epsilon 2% → 1%): the policy edit re-versions, the next consolidation recomputes findings from the same line items, and prior resolutions are re-checked — a resolution whose finding no longer exists is archived, never orphaned (07c rule 5).

**Edges**: an overlap where one side was revised since detection (the finding re-computes against the revised amount; the resolution is re-presented if the delta moved outside epsilon — never auto-closed); three line items matching the same key+day (a finding per pair, grouped in the console by key+day cluster); an overlap crossing currencies (AED vs SAR — the epsilon compares *converted* amounts, 07c rule 4); resolution by a second seat concurrently → CONFLICT with both payloads.
**Failures**: resolve on a superseded finding → CONFLICT, current state shown; resolve without a reason → VALIDATION; NOT_FOUND on a deleted line item referenced by an open finding (line items are never hard-deleted — import revisions supersede, so this surfaces only as a stale-link error with return-to-console).
**Recovery**: resolutions are versioned records; the console's filters and cursor persist (P11); re-derivation never discards a recorded decision without showing it archived.

## CP-4 — Overlay library, occurrence comparison, moment authoring (the signature read)

1. Nouf opens the overlay library: the workspace's holiday moments — each with bilingual names (EN + AR), kind (hijri-anchored / gregorian-fixed / movable-gregorian), anchor rule, length, market scope, and status; the seeded library carries Ramadan, Eid al-Fitr, Eid al-Adha, White Friday (KSA + Egypt scope), Yellow Friday (UAE scope), Saudi Founding Day, Saudi National Day, UAE National Day (07c). `listHolidayMoments`
2. She opens the overlay comparison for Ramadan: the engine computes the occurrence windows for every occurrence intersecting the snapshot window — Ramadan 1446 (2025-03-01 → 2025-03-30) and Ramadan 1447 (2026-02-18 → 2026-03-19) — by the declared conversion method (Umm al-Qura presentation for KSA contexts, disclosed on the surface), plus the control window for each (equal length immediately preceding the window start). `getOverlayComparison`
3. She reads the comparison: mean daily normalized spend inside the window, inside the control window, the **lift ratio** (window ÷ control), the **like-for-like delta** (this occurrence vs the same moment's prior occurrence — matched by lunar occurrence, never by Gregorian lookalike), and the channel split inside the window. All arithmetic is published (07c rule 6) and every figure links back to the line items behind it (CP-2 drill).
4. She asks for a comparison the engine refuses: "Ramadan this year vs February–March last year" — a Gregorian-lookalike window. The refusal explains itself: occurrence matching is lunar; the honest comparison is 1447 vs 1446, and the surface offers exactly that (the refusal is the product teaching its own calendar honesty — 11 §E).
5. She authors a market-specific moment: her Egypt market runs its own naming — she creates "White Friday — Egypt" (movable-gregorian, Friday following the fourth Thursday of November, 4 days, scope EGY) distinct from the KSA entry, with the Arabic name الجمعة البيضاء؛ and renames the UAE entry's label per the per-market naming reality (01 Source 9). Anchor edits re-version the moment; computed windows regenerate on next comparison — existing exports keep the version they were computed against (version pinning, 07a). `saveHolidayMoment`
6. The comparison view renders bilingually: band labels in both languages per market scope; dates in dual-calendar presentation (Gregorian primary with Hijri cross-reference for hijri-anchored moments — P24; method disclosure one glance away).

**Edges**: an occurrence only partially inside the snapshot window (partial window flagged — the lift ratio computes over the covered days and *says so*, never extrapolates); a moment whose anchor rule produces no occurrence in window (renders with "no occurrence in this window" — an honest absence); two moments overlapping the same days (both bands render, both comparisons compute — market scoping keeps White Friday KSA and Yellow Friday UAE answering different questions); control window overlapping another moment (flagged on the comparison — "control window overlaps Eid al-Adha; interpret with care" — the honesty surface names its own confound).
**Failures**: anchor-rule validation (movable-gregorian rule that yields no Friday; hijri anchor outside valid range) → VALIDATION naming the rule; stale moment edit → CONFLICT both kept; comparison with zero covered days → VALIDATION (no honest ratio exists).
**Recovery**: moments are versioned policy data; comparisons are derived reads — re-runnable, no side effects; the library's filters persist (P11).

## CP-5 — Budget pacing and the report pack (the governance artifact)

1. Huda opens budgets & pacing: budget lines — declared periods with amounts in the reporting currency, optionally bound to a moment occurrence (the White Friday 2026 line covers 2026-10-01 → 2026-11-30 and references the moment's planned occurrence). `listBudgetLines`
2. The pacing read computes per budget line: cumulative normalized spend in period vs the linear pace line (elapsed-days × daily budget), variance percentage, and state — on-pace / over-pace / under-pace against the declared threshold (default 10%, policy data — 12 Q-8). Deterministic arithmetic, no forecasting (07c rule 7). `getPacing`
3. She reads the pacing meter against the seeded fixtures: the White Friday 2026 line over-pace (burst campaigns front-load — the meter says so without judgment), the H2 always-on line on-pace, the closed Ramadan 1447 line with its final actual-vs-budget (the retrospective artifact Nouf turns into next year's plan).
4. She edits a budget line (raise the White Friday ceiling, re-scope the period): versioned write; pacing recomputes on next read; the closed Ramadan line is immutable history — its edit path is a *new* amendment line, never a mutation (07a state obligation). `saveBudgetLine`
5. She exports the report pack for the CFO conversation: formats — consolidated statement (by channel, campaign, day), reconciliation ledger (conversion receipts, overlap resolutions with reasons, revision deltas), overlay analysis (window comparisons), raw line items. A Job with expiry + regeneration per async-contract; quota shown before running (P14); manual download is the default and the abstract report destination delivers when bound (08 N2). `exportReportPack` — and usage window checked first: `getUsage`
6. Adel retrieves the artifact before expiry; expired artifacts regenerate deterministically from the same snapshot (the pack is a derived view of immutable state — regenerating cannot change it, and says so). `getArtifact`

**Edges**: a budget line whose period extends beyond the snapshot window (pacing computes over covered days and flags the partial coverage — never extrapolates); a budget line in a currency other than the reporting currency (rejected — VALIDATION: budget lines are declared in the reporting currency, conversions belong to line items, not to targets); pacing with rate-unavailable days inside the period (flagged days excluded and named); export of a superseded snapshot (the pack carries the version it was generated from and the newer version is named at handoff — honesty at handoff, 03 CP-5 edge pattern from the house style).
**Failures**: export quota → RATE_LIMIT ladder with reset time; export failure mid-format → per-format partial policy with per-format retry (async-contract §4); artifact expired → NOT_FOUND with regenerate; NETWORK during delivery → retry, artifact held.
**Recovery**: budget lines version; artifacts re-generate from snapshot state at any time; the jobs console reconciles after reconnect (async-contract §5).

## CP-6 — An upstream revision lands (the versioning proof)

1. Turki learns the social channel revised September figures (the platform-revision reality, 01 Source 12). He imports the revised export through the same paste path — or the connected channel pulls a revision window.
2. The import lands a **revision batch**: line items whose (channel, external key, spend date) match existing rows supersede them (revision count bumped), new days append; nothing is overwritten (the old amount stays queryable as the superseded revision — 07a state obligations).
3. He re-runs the consolidation: a new snapshot version is produced; the old one stays immutable and marked superseded.
4. He reads the revision delta: v4 vs v3 per line item, per channel, per day — the named table finance needs ("−SAR 1,560 on 2026-09-12, social-ksa") — plus which receipts changed (a rate change or a basis change shows as its own delta class) and whether any prior overlap resolution was affected (re-checked per 07c rule 5). `getRevisionDelta`
5. Huda's already-presented September total now differs from the ledger's — and that is the point: the product surfaces "presented as / now / delta" rather than quietly moving the number. The activity log carries the revision event; the next report pack includes the delta page automatically when revisions exist in window.

**Edges**: a revision that lands mid-reconciliation (open overlap findings against the revised line items re-compute; resolutions re-present if evidence moved); a revision that arrives before any consolidation ran (pure append — no delta exists yet, the UI says so honestly); multiple revision batches for the same month (delta chains v3→v4→v5, each step named).
**Failures**: revision import with a mismatched currency on the same external key (VALIDATION — a revision must be same-currency, a currency change is a different line item); revision of a line item pinned by an immutable export artifact (the artifact keeps its version — regeneration produces the current state, and both are available).
**Recovery**: revisions are additive history; superseded amounts remain queryable; snapshots never mutate (the determinism oracle asserts byte-identical re-derivation from identical inputs, 07c §5).

## Non-happy paths

- **No channels, no data (first-run)**: the product states the ledger is empty and offers the sample workspace (07c seed — a planted overlap and a Ramadan double-occurrence are the value proof) plus the paste path. Nothing requires a credential (LOOP-5, 08 N1).
- **Paste-only operation**: a workspace may run forever on pasted exports — connection surfaces render as optional enhancements, never walls; the FX rate table is maintained by pasting declared rates.
- **FX rate source unbound**: rates are declared policy data by default; a bound rate source (08 N3) only *proposes* rows for review — a rate enters the table through an explicit human accept (P15 discipline on data, not just text), and the receipt records the declared basis either way.
- **Offline**: reads work; no mutations exist in the daily loop (the dashboard is read-heavy by design) — imports and policy edits queue with per-item state (P20).
- **Reduced data (one channel only)**: consolidation, timeline, pacing all function with one channel — overlays compute (single-channel lift ratios are still honest arithmetic); overlap findings simply have nothing to find yet.

## Failure → error mapping

VALIDATION (malformed paste rows, policy sanity — epsilon range, budget-line currency, anchor rules, comparison with no covered days, resolution without reason, same-currency revision rule) · NOT_FOUND (stale snapshot/connection/moment/budget/artifact links, expired artifacts) · PERMISSION (capability consent for channel pulls and rate proposals, workspace scoping, viewer-role mutations) · CONFLICT (concurrent connection/moment/budget edits, finding resolutions, revision import against a superseded batch) · RATE_LIMIT (consolidation runs, report-pack exports) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.1 |
| `listChannelKinds` | CP-1.2 |
| `listChannelConnections` | CP-1.3 |
| `createChannelConnection` | CP-1.4 |
| `updateChannelConnection` | CP-1.5 |
| `verifyChannelConnection` | CP-1.6 |
| `importSpendLines` | CP-1.7, CP-6.1 (revision import) |
| `runConsolidation` | CP-1.9, CP-3.4 (re-derive), CP-6.3 |
| `updateNormalizationPolicy` | CP-1.8, CP-3.5 (epsilon change) |
| `listSnapshots` | CP-1.10 |
| `getSnapshot` | CP-2.1 |
| `getSpendTimeline` | CP-2.2 |
| `getSpendBreakdown` | CP-2.3 |
| `listSpendLines` | CP-2.5, CP-3.2 (pair inspection) |
| `getFxRateTable` | CP-2.6 |
| `listOverlapFindings` | CP-3.1 |
| `resolveOverlap` | CP-3.3 |
| `listHolidayMoments` | CP-4.1 |
| `getOverlayComparison` | CP-4.2 |
| `saveHolidayMoment` | CP-4.5 |
| `listBudgetLines` | CP-5.1 |
| `getPacing` | CP-5.2 |
| `saveBudgetLine` | CP-5.4 |
| `exportReportPack` | CP-5.5 |
| `getUsage` | CP-5.5 (pre-export quota) |
| `getArtifact` | CP-5.6 |
| `getRevisionDelta` | CP-6.4 |
| `listJobs` | CP-1.11, CP-5.5 (export job) |

28 operations, 0 orphans (Critic-verified — the table above lists every 07b operation exactly once). The dashboard (04 S1) is the app entry surface for every persona in 02; jobs center (04 S10) reconciles all async work.
