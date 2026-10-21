# 04 — Information Architecture: survey-insight-miner

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Projects** (projects home) · **Workspace** (open project → its questions, theme board, response reader, coverage & crosstab) · **Intake** (import) · **Queue** (jobs center) · **Activity** (log) · **Settings.** Two-level IA: section → item; the theme board and response reader are question-scoped modes of the open project (a project with one question lands directly on its board — the common research-wavelength case). ⌘K command palette (P05, T2 mandate) reaches projects, questions, themes (bilingual label search), responses (respondent ref / verbatim search — normalized per rtl-rules §4), and jump-to-theme on the open board.

## Entity overview (07a for full shapes)

**Workspace** → owns **Projects**. A **Project** (a survey wave: name, note, metadata columns) → contains **Questions** (open-ended; verbatim **Responses** with language class, tone signal, metadata values, respondent ref, optional human language override). The clustering run produces **Themes** — bilingual labels, definition, provenance (`keyword-grouping` | `model-proposed` | `human-confirmed`), state (proposed/confirmed/merged-away), version — connected to responses through **ThemeMemberships** (evidence: matched keywords or confidence band; manual-assign actor) and evidenced by **ThemeQuotes** (rule-selected with rationale, or pinned with actor). Derived reads: **CoverageReport** (assigned/unassigned/overlap) and **Crosstab** (theme × metadata column). **Job** (async: import/clustering/export), **ExportArtifact**, **ActivityEntry** (P17), **Session** (auth-agnostic).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Projects home | projects list, filters + saved views (P08), onboarding checklist (P22), sample-project offer | listProjects, getSession |
| S2 | Project overview | questions list with response counts, language mix, tone mix, last-run coverage; metadata-column view | getProject, listQuestions, getQuestion |
| S3 | **Theme board** | the core surface: theme cards (counts, shares, provenance, keywords) + the quote wall | listThemes, getCoverageReport |
| S4 | Theme detail / editor | bilingual labels + definition, members, quotes with rationale, confirm gate, merge composer | getTheme, saveTheme, confirmTheme, mergeThemes, deleteTheme, setQuotePin |
| S5 | Response reader | virtualized verbatim list with detection chips; reading pane at each response's own direction; filters; assign paths | listResponses, getResponse, setResponseLanguageOverride, setResponseTheme, bulkSetResponseTheme |
| S6 | Coverage & crosstab console | assigned/unassigned/overlap with honesty lines; theme × metadata grid; drill to responses | getCoverageReport, getCrosstab, listResponses |
| S7 | Intake | paste format reference, per-row detection preview, import job hand-off | importResponses, listJobs |
| S8 | Jobs center | import/clustering/export jobs, cancel/retry, link-to-context (async-contract §7) | listJobs |
| S9 | Activity log | every confirm/rename/merge/assign/pin/override/export with actor + timestamp; filterable; exportable | listActivity |
| S10 | Settings | direction default, capability consent (kind-not-vendor), usage window, disclosed engine defaults reference | getSession, getUsage, updateProject (projects-home rename path documented in 03 CP-5.5) |

Mobile (≤767px): S1, S2, S3 (board + quote wall in read mode), S6 read/report modes — the sliceable report Faisal reads on his phone (02); S4/S5 curation and S7 intake are desktop/tablet (00 surface). Every screen states its filters (P08) and its four empties per P01 (11 matrix).

## Per-screen state obligations

First-run (S1 offers the sample project — one pending model-proposed theme and one merge fixture are the P22 value proof); skeletons mirror final geometry per direction (P02, RTL skeletons flip); errors per 03 mapping; copy matrix in 11.

## IA decisions and rationale

- **The theme board binds cards + quote wall permanently**: a theme count without its quotes is exactly the "trust me" theme the buyer's stakeholders already distrust (02 Faisal) — the evidence lives beside the claim, not behind a drill (04 S4 is for curation, not for first proof).
- **The response reader is separate from the board, not instead of it**: Khalid's unassigned-tail work (02 JTBD) is a list posture — filtering, bulk-assign, reading verbatims — while the board is a claim posture; same data, two postures, one membership operation set (setResponseTheme/bulk).
- **Coverage is its own console (S6), not a widget on the board**: the honesty lines (overlap sums past 100%; unassigned stays visible) are methodology statements that deserve a first-class surface — burying them in a tooltip would be the exact silent-flattening this product refuses.
- **Crosstab lives with coverage, not in a separate analytics area**: both answer "so what" over the same derived state; Faisal's slice and Mariam's audit are the same read at different roles.
- **Intake is a screen, not a dialog**: the paste format is a first-class contract (07c format) that the sample project teaches; researchers repeat it per wave — it deserves reference copy that stays visible (P09 progressive disclosure runs the other direction: complexity visible, never hidden behind scroll luck).
- **Activity is first-class (S9)**: the methodology defense IS the audit trail — who confirmed, who renamed, who pinned, with timestamps (P17); a research deliverable without provenance is a slide, not a finding.
- **Queue (S8) is small but first-class**: imports, clustering runs, and exports are the product's async Jobs (async-contract §7) — the mid-wave re-run (03 CP-3.7) makes job visibility a daily need.
