# 04 — Information Architecture: sales-cohort-view

## Navigation model

Left rail: **Grid** (home, default view), **Seasons** (calendar manager), **Comparisons**, **Customers** (drill-in entry from any snapshot), **Definitions**, **Sources**, **Activity** (consolidated jobs + activity, T3 posture per async-contract §7), **Settings**. One workspace, one market scope per grid query (KSA default, UAE switchable); the cohort grid is the product's core mode and the destination of every other surface's link-outs. ⌘K palette (P05 — list surfaces exceed three) reaches grids/views, season windows, comparisons, and actions with bilingual normalized search (alef/taa-marbouta/yaa normalization — rtl-rules §4; season labels authored in Arabic are first-class search targets). Two-level IA: section → item; snapshot artifacts (grid, comparison, evidence pack) are item detail surfaces reached from their parent surface. Desktop-first ≥1280px; 768–1279px read-and-drill with collapsed rail; <768px read-only monitoring (saved grids, comparison summaries, season calendar, freshness chips — no grid authoring, no calendar editing).

## Entity overview (07a for full shapes)

Workspace → CommerceSource (bound, abstract; or ImportedSample as the LOOP-5 fallback data path) → the deterministic engine computes GridSnapshots (cohort rows × period cells, metric sets, season-composition marks, ruleset version pin) → CohortDetail (derived read from a snapshot) → CustomerDrill (paginated member list from a snapshot) → ComparisonResults (two cohorts, alignment mode, composition disclosure) → SavedViews (named grid queries) → SeasonWindows (workspace-authored or curated-from, phase maps, drift disclosure) → ExportArtifacts (evidence packs with expiry). Jobs wrap source-refresh, sample-import, and export work; ActivityEntry logs consequential mutations.

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Grid workspace | the core surface: acquisition rows × period columns, metric switcher, season overlay rail, coverage/freshness chips, snapshot pin | computeGrid, getGrid, getRuleset, getSource, getSession |
| S2 | Cohort detail | one cohort: window, size, composition sentence, curve, summary stats | getCohortDetail |
| S3 | Customer drill | member list of a cohort or cell: refs, first order, orders, revenue | listCustomers |
| S4 | Season calendar | kinds library + declared windows per market/year; create/edit; drift + phases | listSeasonKinds, listSeasonWindows, getSeasonWindow, createSeasonWindow, updateSeasonWindow |
| S5 | Comparison | aligned two-cohort duel: curves from period 0, deltas, composition disclosure | compareCohorts, getComparison |
| S6 | Views library | saved grid queries: rename, update, delete (P04) | listViews, updateView, deleteView, saveView (from S1) |
| S7 | Definitions & formulas | the four canonical metrics with exact formulas, thresholds, ruleset version history | getRuleset |
| S8 | Sources | bound source state, coverage, refresh, sample import | getSource, refreshSource, importOrdersSample |
| S9 | Activity & jobs | consolidated console: job states with cancel/retry + P17 log | listJobs, getActivity |
| S10 | Command palette (overlay) | bilingual search across views/windows/comparisons/actions | client-side over S1/S4/S5/S6 data |

Settings lives in the rail as a small surface (locale, market default, calendar-method disclosure, granularity default: getSession, updateWorkspace). Screen count 10 + palette overlay + settings = within the 8–12 band.

## Per-screen state obligations

Four empties per P01: S1 first-run offers the seeded sample world and the paste-import path (never a blank grid); S4 calendar first-run for an uncovered market offers curated defaults per kind; S5 comparisons empty points to the grid (comparisons are born from cohorts, not authored from scratch); S6 filtered-empty declares itself. Skeletons mirror grid geometry per direction (P02 — the cohort grid skeleton is row-band and column-band, flipping in RTL). Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **One grid, not a dashboard**: the product's answer to Mariam's "another dashboard?" objection — a single canonical surface with a metric switcher and an overlay rail, not a wall of widgets (00 differentiation vs the commerce-analytics dashboard class; 01). Every other screen exists to feed, explain, or export the grid.
- **Seasons is a first-class section, not a filter drawer**: the calendar is the product's differentiating data (season-overlay cohorts), and its discipline (drift disclosure, phases, provenance) needs its own surface with its own empty/edit/error states — burying it in a filter control would demote the differentiator to a setting.
- **Definitions is a screen, not a tooltip graveyard**: the inspectable-arithmetic posture (00) requires the formulas to be a readable, versioned surface — Sami audits it against his SQL, Faisal quotes it in his deck's methods note (02).
- **Comparisons as their own section**: the season-aligned comparison is the signature flow (CP-4) and the quarterly-review deliverable; it earns browse-level IA (Nadia returns to last quarter's comparison directly) rather than being reachable only through a grid's context menu.
- **Customers is read-only by construction**: the CRM exclusion (LOOP-10) is enforced structurally — the drill surface has no customer actions beyond export membership; acting on customers happens in the buyer's systems (08).
- **Activity consolidated with jobs (T3)**: per async-contract §7, Tier 3 may consolidate the job center into an activity surface — S9 is one console for job state and the P17 mutation log, rather than per-class IA.
