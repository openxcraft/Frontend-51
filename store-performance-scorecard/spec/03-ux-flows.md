# 03 — UX Flows: store-performance-scorecard

SME-C pass · 6 critical paths. Coverage table at end traces every 07b operation exactly once — no orphans, no phantoms.

## CP-1 — Chain setup → first scorecard (value proof)

1. Khalid opens the workspace: the chain overview shows the seeded world (12 stores, governed patterns, 104 weeks of records) — and the honest onboarding checklist (P22: "run your first scorecard", "read the definitions surface", "import a real week"). `getSession` · `getWorkspace`
2. Register path (real onboarding, no seed): he creates a store — bilingual name (en/ar), code, format, city, region, trading start — and the store lands in the directory with a no-data badge (P01 first-run per store). `createStore` · `listStores`
3. He declares the store's operating pattern: shift windows per class (morning 07:00–15:00, evening 15:00–23:00), effective dates, timezone; the pattern is versioned on save (Ramadan patterns are later effective-dated versions, never edits of history). `upsertOperatingPattern` · `listOperatingPatterns`
4. He imports shift records — paste CSV or file: date, store code, shift class, net sales, transactions, labor hours (labor cost and traffic optional). Ingestion is a Job per async-contract: paced, cancellable, row-count progress, duplicate accounting. `importShiftRecords` · `listJobs`
5. Channel path (optional): he binds the abstract sales-data capability — consent shown in capability language before save — and a fetch Job pulls a bounded window. `fetchChannelSales`
6. He runs the first scorecard: window = last 4 retail weeks, basis = week-matched YoY, peer group = by format. Synchronous, budget-bound (10). `runScorecard`
7. The ranked board renders: stores, scores, LFL deltas per KPI, comp badges, coverage marks, flags. He opens the definitions surface and reads the exact formulas his numbers came from. `getScorecard` · `getKpiDefinitions`

**Edges**: a store with a pattern but zero records (explicit per-store empty, P01); import rows whose shift class has no window in the store's active pattern (VALIDATION naming the row, or class auto-attachment under the pattern's declared fallback — policy, 07c rule 3); duplicate (store, date, class) rows (counted as updates-in-place, both counted in the job result — never silently dropped); bilingual store names render each at own direction (rtl-rules §2).
**Failures**: malformed paste → VALIDATION with the first bad row named, good rows kept (partial policy); channel unconsented → PERMISSION with the consent surface linked; pattern edited concurrently → CONFLICT with both payloads.
**Recovery**: records persist across re-runs; patterns version forward; the chain never loses imported data on a job failure.

## CP-2 — Weekly LFL review (the daily loop)

1. Sunday. Khalid selects the review window (last 4 weeks), confirms the basis chip (week-matched YoY · comp policy v2 · weights v1), and re-runs the scorecard on top of the week's imported records. `runScorecard` · `listScorecards`
2. The ranked board: composite score, per-KPI LFL deltas with direction glyphs + text (never color alone), comp badges, coverage marks, top/attention-band flags. `getScorecard` · `listFlags`
3. He drills the bottom-band store: its scorecard card — per-KPI rows, shift breakdown, matched weeks count, prior-year basis, annotations. `getStoreBreakdown` · `getStore`
4. The shift breakdown shows the signature read: totals healthy, evening-shift sales-per-labor-hour in the bottom decile. He opens the raw evening rows to verify (11 honesty instinct). `listShiftRecords`
5. He pins a context annotation — "renovation, aisles 3–4 closed, W22" — visible on the store's card and the run's context rail. `addAnnotation` · `listAnnotations`
6. Coverage check before the meeting: which stores have gaps in the window; one store under 60% is out of ranking, reason shown. `getCoverageSummary`

**Edges**: a store with <8 matched weeks renders count-only rows plus the small-sample caution (never silent); annotations by others render with actor and time (P17); basis chips expose the comp policy version so the room can audit what was excluded.
**Failures**: zero comp-eligible stores in the window → VALIDATION naming the empty comp set (the honest wall — the product refuses to rank on non-comparable data); stale run link → NOT_FOUND; viewer role hits a mutation → PERMISSION.
**Recovery**: every run is an immutable snapshot; re-running after imports creates a new run, history never mutates (07a).

## CP-3 — Shift-lens comparison (the signature flow)

1. Amna opens the shift lens: stores × shift classes, the KPI selector on sales per labor hour, matched classes only. `getStoreBreakdown` (matrix mode across the peer group)
2. The grid renders: each cell the store's per-class normalized KPI with YoY delta; cells for unmatched classes (a store with no night shift) render a "no trading" mark, never a zero — matched-capability honesty. Diverging tint (citron above / red-family below peer median) with the number always present in the cell (charts contract, 06).
3. She reads the outlier: RYD-07 evening-class SPLH bottom decile while its morning class ranks mid. She switches KPI to transactions per open hour — keyboard M — and the grid re-renders ≤150ms (10). `getKpiDefinitions` (formula on hover/panel)
4. Drill: the evening column for RYD-07 → its raw shift rows for the window, one keystroke. `listShiftRecords`
5. She stages the follow-up as an annotation on the store ("evening staffing mix review — W27–W40 evidence attached") rather than a verdict — the product analyzes, the manager decides. `addAnnotation`

**Edges**: a class with <4 trading stores in the peer group carries the matched-capability caution (N small); a store whose pattern changed mid-window (Ramadan) shows the pattern-version seam on its rows (provenance, 07a); night class exists in only 3 mall stores — the grid says so in text.
**Failures**: no patterns governed for a selected store set → VALIDATION directing pattern authoring first; grid request for a window with zero records → per-cell empties (P01), not a blank surface.
**Recovery**: the lens is a read surface over the run snapshot — re-openable, shareable as a saved view, never destructive.

## CP-4 — Season alignment + comp policy audit (the honesty flow)

1. In the weekly review, Khalid's eye catches the composition bar: the window's season shares — this year 100% Ramadan, prior-year matched weeks 38% — and the misalignment flag (delta beyond the 25pp threshold). `getScorecard` (compositionDisclosure) · `listSeasonWindows`
2. He switches the basis to season-anchored: this named season window (Ramadan 1447) vs the same named season last year (1446). The board recomputes. `runScorecard`
3. He audits comp eligibility: the policy surface shows Method 2 (store-period-level) active, the 13-month rule, and the per-store eligibility ledger (which weeks each store contributed). He experiments with Method 1 (store-level) and sees the comp set shrink — the richer-data tradeoff is visible, not narrated. `getCompPolicy` · `updateCompPolicy` · `runScorecard`
4. He curates a season window (a local event the defaults missed): bilingual label, fixed dates, market scope. `upsertSeasonWindow`
5. He pins the review's method: the run snapshot records the policy version, weights version, and definitions version it ran under — the pack he exports says which method produced it. `exportScorecardPack`

**Edges**: a season window overlapping another (Eid inside the Ramadan aftermath) — overlap warning at authoring, not silent double-counting; drifting lunar windows carry the ±1-day disclosure (portfolio Q-5 posture); Method 1 vs 2 differences surface as a count ("3 stores leave the comp set").
**Failures**: season-anchored basis with no prior-year occurrence of the window → VALIDATION naming the missing season; policy edit mid-review by another seat → CONFLICT both payloads.
**Recovery**: policy changes version forward; prior runs keep the policy they ran under — audit intact.

## CP-5 — Data import + coverage honesty loop

1. Monday. The new week's POS export lands as a paste. The importer previews the column map, flags unknown store codes (offer: create or fix), and submits the Job. `importShiftRecords` · `listJobs`
2. Coverage surface: per store, expected shift rows vs present, gaps named by date and class; JED-04 shows 2 missing days; RYD-12 (new store) shows its ramp status (no prior-year counterpart — non-comp, reason attached). `getCoverageSummary`
3. Faisal adds the context: a power outage annotation for the JED-04 gap days. `addAnnotation` · `listAnnotations`
4. The analyst re-runs the affected scorecard; the incomplete weeks are marked on JED-04's rows (excluded from means, shown in the count) — never silently averaged. `runScorecard`
5. Peer-group maintenance: the new mall store joins the mall peer group for benchmark reads (still non-comp for LFL), and a mis-entered profile is corrected from the directory. `upsertPeerGroup` · `listPeerGroups` · `updateStore`
6. Settings when needed: weekend definition, currency display, locale. `updateWorkspacePreferences`

**Edges**: imports carrying a class the active pattern doesn't declare (VALIDATION row-named or declared-fallback per 07c); channel fetch overlapping pasted rows (external-key + date + class dedupe detection, both kept with overlap marks — never silent overwrite); >200-row record tables virtualize (P19).
**Failures**: channel fetch failure → typed error with retry, pasted data unaffected (the ladder, 08); quota on channel fetches → RATE_LIMIT with window reset, paste unmetered.
**Recovery**: imports are additive and versioned; every row carries source provenance (manual/import/channel) for audit.

## CP-6 — Export pack + jobs console (the handoff)

1. Khalid exports the leadership pack for the monthly review: scorecard board, per-store breakdowns, shift-lens grid, composition disclosure, definitions appendix — the method stamped on the numbers. Job with expiry + regeneration. `exportScorecardPack` · `listJobs`
2. Artifact delivery in-context when the surface is visible (async-contract §6 ladder 1); on return-state the artifact surfaces on the chain overview. `getArtifact`
3. Jobs console: import/channel-fetch/export jobs, states, cancel/retry, link-to-context (T3 consolidated activity surface per async-contract §7). `listJobs`
4. Run history for the audit-minded: prior runs listed with their pinned versions, re-openable, byte-identical on replay. `listScorecards` · `getScorecard`

**Edges**: exporting a run whose underlying records later changed (a late import) — the artifact stays as-generated (immutable snapshot), a "records changed since" note offered on re-open; artifact expiry 7 days with renewal.
**Failures**: artifact expired → NOT_FOUND + regenerate path; export failure mid-pack → partial per-section retry (async-contract §4).
**Recovery**: packs regenerate from run state deterministically; nothing is ever lost to an export failure.

## Non-happy paths

- **No sales-data channel bound (LOOP-5)**: paste/import is the primary path from first run; the channel renders as an optional capability with consent surface, never a wall — the entire flow completes on pasted data.
- **First-run with zero records (fresh chain)**: chain overview offers the seeded sample world (P22) so the ranked board, shift lens, and definitions surface are experienceable before real data exists; the sample is badge-marked and clearable.
- **Offline (P20)**: reads work; annotations and preference edits queue with per-item state; jobs reconcile to authoritative state on return.
- **Viewer seat**: full read + export; mutations blocked with the PERMISSION surface naming the role boundary (11 C).

## Failure → error mapping

VALIDATION (malformed import rows, ungoverned patterns, empty comp set, missing prior-year season occurrence) · NOT_FOUND (stale store/run/artifact links) · PERMISSION (channel consent, viewer-role mutations, workspace scoping) · CONFLICT (concurrent pattern/policy/peer-group edits) · RATE_LIMIT (channel fetches, exports) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation exactly once; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, entry (role/locale) | `getCompPolicy` | CP-4.3 |
| `getWorkspace` | CP-1.1 | `updateCompPolicy` | CP-4.3 |
| `createStore` | CP-1.2 | `listSeasonWindows` | CP-4.1 |
| `listStores` | CP-1.2, CP-2.1 | `upsertSeasonWindow` | CP-4.4 |
| `getStore` | CP-2.3 | `listPeerGroups` | CP-5.5 |
| `updateStore` | CP-5.5 (metadata/status changes) | `upsertPeerGroup` | CP-5.5 |
| `upsertOperatingPattern` | CP-1.3 | `addAnnotation` | CP-2.5, CP-3.5, CP-5.3 |
| `listOperatingPatterns` | CP-1.3 | `listAnnotations` | CP-2.5, CP-5.3 |
| `getOperatingPattern` | CP-1.3 (version detail) | `runScorecard` | CP-1.6, CP-2.1, CP-3.1 basis, CP-4.2/3, CP-5.4 |
| `importShiftRecords` | CP-1.4, CP-5.1 | `getScorecard` | CP-1.7, CP-2.2, CP-4.1, CP-6.4 |
| `fetchChannelSales` | CP-1.5 | `listScorecards` | CP-6.4, CP-2.1 (basis chips) |
| `listShiftRecords` | CP-2.4, CP-3.4, CP-5.2 | `getStoreBreakdown` | CP-2.3, CP-3.1/2 |
| `getCoverageSummary` | CP-2.6, CP-5.2 | `getKpiDefinitions` | CP-1.7, CP-3.3 |
| `updateWorkspacePreferences` | CP-5.6 | `listFlags` | CP-2.2 |
| `exportScorecardPack` | CP-4.5, CP-6.1 | `getArtifact` | CP-6.2 |
| `listJobs` | CP-1.4/5, CP-5.1, CP-6.3 | | |

31 operations, 0 orphans (Critic-verified).
