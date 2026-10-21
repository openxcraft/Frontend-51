# 04 — Information Architecture: store-performance-scorecard

## Navigation model

Left rail: **Overview** (chain home) · **Scorecard** (the ranked board — the product's core mode) · **Shift lens** · **Stores** · **Data** · **Definitions & policy** · **Jobs**. One workspace, one chain: there is no cross-chain navigation at v1 (a workspace IS a chain). The scorecard workspace carries the persistent comparison context as a header band — window selector, basis chip (method · comp-policy version · weights version), peer-group selector, KPI set — so every surface below it (store drill, shift lens, flags) reads as "under the current basis", never as orphan screens. ⌘K palette (P05 — list surfaces exceed three) reaches stores, runs, season windows, jobs, and actions with bilingual normalized search (rtl-rules §4: alef variants, taa marbuta, yaa forms; Arabic store names searchable). Desktop-first; ≤767px: read-only (saved runs, store cards, definitions); no authoring below tablet — operating patterns and imports are desktop surfaces.

## Entity overview (07a for full shapes)

Chain/Workspace → Stores (bilingual identity, format, region, trading span) → OperatingPatterns (versioned shift windows; effective-dated) → ShiftRecords (store × date × shift class; sales/labor/optional traffic) → SeasonWindows (named, bilingual, lunar or fixed) → PeerGroups → CompPolicy (versioned method + eligibility) → ScorecardRun (immutable snapshot: basis, per-store results, per-shift breakdowns, composition disclosure, flags) → ExportArtifacts. Jobs wrap imports, channel fetches, exports. Annotations attach to stores and date ranges.

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Chain overview | period context, latest run summary, coverage posture, onboarding checklist (P22), artifact return-state | getSession, getWorkspace, listScorecards, getCoverageSummary, getArtifact |
| S2 | Scorecard workspace (ranked board) | the comparison surface: window/basis/peer-group context band, ranked store table with scores, LFL deltas, comp badges, flags | runScorecard, getScorecard, listScorecards, listFlags, getKpiDefinitions |
| S3 | Store detail | one store's scorecard card: per-KPI rows, shift breakdown, matched weeks, annotations, coverage, pattern history | getStoreBreakdown, getStore, listAnnotations, listShiftRecords |
| S4 | Shift lens | stores × shift-class normalized-KPI grid, matched classes only, KPI switcher, cell drill | getStoreBreakdown, getKpiDefinitions, listShiftRecords |
| S5 | Stores directory | store register, filters/peer groups, metadata edit, trading status | listStores, createStore, updateStore, listPeerGroups, upsertPeerGroup |
| S6 | Data & imports | shift-record table (filters, provenance), import paste/upload, channel binding + health, coverage summary | importShiftRecords, fetchChannelSales, listShiftRecords, getCoverageSummary, listJobs |
| S7 | Definitions & policy | KPI formulas (published), comp policy editor (versioned), weights editor, season-window library, pattern registry | getKpiDefinitions, getCompPolicy, updateCompPolicy, listSeasonWindows, upsertSeasonWindow, listOperatingPatterns, upsertOperatingPattern, getOperatingPattern |
| S8 | Jobs & activity | consolidated job console (import/channel/export) + activity log (P17) | listJobs |
| S9 | Settings | locale, weekend definition, currency display, defaults | updateWorkspacePreferences, getWorkspace |
| S10 | Command palette (overlay) | bilingual search across stores/runs/seasons/jobs/actions | client-side over S1–S8 data |

## Per-screen state obligations

Four empties per P01: first-run (S1 offers the seeded sample world; S5/S6/S7 teach the registration → pattern → import order; S2 first-run links the sample run); no-data-after-activity (a store whose records were all filtered out says so); no-access (PERMISSION surface, never "empty"); filtered-empty (declares itself with filter reset). Skeletons mirror final geometry per direction (P02) — the ranked board's skeleton shows table geometry, the shift lens shows the grid. Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **The basis band is the IA's spine**: like-for-like honesty lives in the basis (method, comp policy, weights, window, day-type). Every analytic surface renders under it, so a number is never seen without the rule that produced it — the anti-spreadsheet move (02 Khalid's audit-the-exclusions demand).
- **Shift lens is a first-class surface, not a tab inside the board**: the unique feature (00) is a different *question* (where in the day does performance live?) than the board's (which store, fairly ranked?). It earns its own screen, its own empties, and its own keyboard map (09).
- **Definitions & policy is a destination, not a footnote**: comp policy, weights, season windows, and pattern registry are governance surfaces (Noura's seat, 02) — versioned, diffable, linked from every run they produced.
- **Jobs consolidated with activity (T3 posture)**: per async-contract §7, Tier 3 may consolidate the job center into an activity surface — S8 lists the three job classes with link-to-context plus the P17 activity log.
- **Store detail nests under the board's basis**: drilling from the board to a store carries the run context (no re-navigation); the store's pattern history and annotations live with it because that is where Faisal defends the number (02).
