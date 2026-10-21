# 03 — UX Flows: survey-insight-miner

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation — no orphans. Terminology per 02: project · open-ended question · response · theme (محور) · clustering · keyword-frequency grouping · quote · pin · coverage · crosstab · coding/assign · merge · confirm · language detection · tone · run · export.

## CP-1 — Project → paste import → detection → first clustering run (value proof)

1. Khalid creates a project: name ("Q3 CSAT — delivery app"), client/study note, and the metadata columns the team thinks in (city, channel, plan, satisfaction) — optional, editable later. `createProject`
2. He imports the first question's responses. Manual path (always available, zero credentials — LOOP-5): paste a response block — one row per response: `respondent-ref | response text | metadata values` (the paste format is shown beside the field, seeded by the sample project, 07c) — or upload a file for the abstract intake capability to parse when bound. Import is a Job per async-contract: paced, cancellable, row-count progress ("Importing 180 of 300 responses"). `importResponses` · `listJobs`
3. Import lands the question with a per-row table: verbatim text, **language class** (MSA / dialect-leaning / mixed-script — by the disclosed marker rule, 07c rule 2), tone signal (three-class lexicon heuristic, labeled), metadata values, respondent ref (pseudonymous). The question overview shows the language mix and tone mix as counts — never a chart alone (09). `listQuestions` · `getQuestion`
4. He runs the clustering: parameters on the run (top-K keywords default 12, membership threshold default 2 distinct theme keywords, stopword list = the disclosed default). The run is a Job; the engine is the **deterministic keyword-frequency floor** unless a clustering capability is bound and consented (08 N2) — in which case model-proposed themes land as `proposed` and the floor's groups land alongside as the auditable baseline. Progress is determinate per response. `runClustering`
5. The **theme board** renders: theme cards with bilingual keyword labels, member counts, share-of-assigned, provenance chips (`keyword-grouping` | `model-proposed`), and the representative quotes beneath (selection by the published rule, 07c rule 6). Coverage strip: assigned / unassigned / overlap counts. `listThemes` · `getCoverageReport`
6. Session context: role/locale render the workspace chrome; Mariam and Dana land on the same project with the same deterministic state — same responses, same floor, same quotes, every time (07c determinism oracle). `getSession`

**Edges**: pasted rows with empty response text (imported, flagged empty — excluded from clustering, counted in coverage as invalid); respondent refs that collide (suffixed `-2`, collision disclosed); metadata values absent (blank, crosstab shows "unspecified" bucket); mixed-script rows (verbatim preserved, bidi isolation at render — rtl-rules §2); dialect-leaning rows (detected with named markers, never normalized — 07c rule 2); a re-paste of the same block (idempotency key returns the original import job — async-contract §5).
**Failures**: malformed paste → VALIDATION naming the first bad row, rows before it retained (partial policy per async-contract §4); intake capability unconsented → PERMISSION naming the capability class with the paste path offered inline (credential-contract §4); import job failure mid-way → typed error + retry, imported rows kept; run quota (P14, model-assisted runs only) → RATE_LIMIT ladder notice; the keyword floor itself is never rate-limited (00 pricing posture).
**Recovery**: questions persist across re-imports; clustering is re-runnable at will; confirmed themes are never destroyed by a re-run — proposals regenerate, confirmed state stays (07a state obligations).

## CP-2 — Reading the board, quote evidence, and the response reader (the daily loop)

1. Khalid opens the theme board: theme cards sorted by member count (or share), each with its provenance chip and top keywords; the **quote wall** beside the board shows every theme's representative quotes — verbatim, respondent ref, language-class and tone chips, pin state. `listThemes`
2. He traverses themes by keyboard: ↓/↑ move card to card; Enter opens the theme detail — labels (ar + en), definition, member count, share, quote list with selection rationale, members preview, provenance panel. `getTheme`
3. From a quote or the members list he drills into a response: full verbatim at its own detected direction (bidi-isolated), detection panel naming the markers that classified it, tone lexicon hits highlighted with the lexicon disclosed, metadata, theme memberships with evidence (which keywords matched, or the model's confidence band). `getResponse`
4. He works the unassigned tail: the response reader filtered to `unassigned` — virtualized verbatim list with detection chips; reading pane per response. Filters (language class, tone, metadata values, search — normalized per rtl-rules §4) render as removable chips with accessible predicate descriptions (P08). `listResponses`
5. A dialect misclassification he disagrees with ("this is MSA with two slang words, not dialect-leaning"): he sets a language-class override with the reason recorded — the override re-runs detection display for that response and lands in the activity log; the verbatim never changes. `setResponseLanguageOverride`
6. Mariam reads the same board from the questions view: per-question stats (response count, language mix, tone mix, last run's coverage) — the wave's shape at a glance. `listQuestions` · `getQuestion`

**Edges**: a response in 4 themes (all four memberships listed with evidence — overlap is stated, never hidden); a quote whose response was later re-assigned (quote stays computed against its theme's member set at run time; pinned quotes persist — 07a); theme cards with identical member counts (stable sort by label, then id — deterministic); a theme whose members all left (card renders at zero with its history, awaiting delete or merge — never silently vanishes).
**Failures**: NETWORK mid-list → banner + retry, board state safe (P20); stale theme link after a merge elsewhere → NOT_FOUND with the merge target offered.
**Recovery**: board filters and cursor persist per session (P11 — recall across sessions); every read is re-derivable from response state + theme definitions (determinism, 07c).

## CP-3 — Human curation: confirm, rename, merge, assign, pin (the craft loop)

1. Dana opens a `model-proposed` theme (confidence band shown, evidence per member). She reviews its members and quotes. **The confirm gate** (P15): the gate view re-evaluates membership live at open — a diff-style preview — members in, members the gate would exclude (below evidence floor), label, quotes — and an explicit Confirm action. Confirming promotes the theme to `human-confirmed` with actor + timestamp; rejecting dismisses the proposal (recorded). `getConfirmGate` · `confirmTheme`
2. She renames the theme bilingually: Arabic label "الشحن وتأخير التوصيل", English label "Shipping and delivery delays", one-line definition in each language — the report-grade act (Braun & Clarke phase 5, 01 q7). Edit is versioned; board re-renders. `saveTheme`
3. She creates a theme from scratch when the floor missed one ("المكافآت والنقاط" — rewards): empty bilingual labels + definition, then she assigns responses to it (next step). `saveTheme`
4. Two keyword groups are the same idea ("التسعير" and "السعر غالي"): she merges them — the composer preview re-evaluates the union live (`getMergePreview`), then the merge itself names both member counts and quotes ("31 + 22 responses"), shows the surviving label (hers to set, bilingual), and the quote re-selection preview (the rule re-runs over the union — 07c rule 6). Merge is P04 level-2: the confirm names both counts; the merged-away theme keeps its history (07a). `mergeThemes`
5. Stray assignment: from the unassigned filter or any response detail, she assigns a response to a theme — evidence auto-recorded (manual-assign with actor); a response can carry multiple themes; assigning is reversible (unassign = the same operation with `null`). Bulk path: filter the reader (e.g., search "كوبون" AND unassigned) and bulk-assign the counted set — the action bar names the count; the adapter verifies it against the live set (P07). `setResponseTheme` · `bulkSetResponseTheme`
6. A theme that died after curation (all members re-assigned elsewhere): delete is P04 level-2 — the confirm names its current member count and that they become unassigned. `deleteTheme`
7. Mid-wave re-run: Mariam re-runs clustering after 200 late responses arrived — new proposals land `proposed`; confirmed themes are untouched; the coverage strip re-renders. `runClustering`
8. Dana pins the quote that carries the theme best (a two-sentence dialect verbatim the rule ranked fourth): pin records her as actor, pins sit above rule-selected quotes in the wall and the export, and unpinning restores the rule's list. Computed quotes carry their selection rationale; pinned quotes carry the pinner — the honesty split. `setQuotePin`

**Edges**: confirming a theme whose evidence includes a response that was deleted (gate re-evaluates membership live — the preview is truth, not a stale snapshot); merge where one side has pinned quotes (pins survive into the union, marked); bulk-assign where the filter matched a response that just got assigned elsewhere (count drift → CONFLICT with the recounted set); rename to a label that already exists in the question (VALIDATION naming the collision — one label per language, per question).
**Failures**: stale theme edit (another seat renamed it) → CONFLICT with both payloads; confirm on an already-dismissed proposal → CONFLICT showing current state; NETWORK mid-bulk → typed error, per-response rollback state shown (no partial silent apply).
**Recovery**: every curation act is versioned and logged (P17); proposals can be re-generated by re-run; merges are recorded with their inputs (audit chain, 07a).

## CP-4 — Coverage & crosstab (the "so what" surface)

1. Mariam opens the coverage console for the question: assigned / unassigned / overlap counts and rates — with the honesty lines in writing: "theme shares may sum past 100% — responses can carry multiple themes" and "N responses match no theme and stay unassigned." `getCoverageReport`
2. She slices: theme × metadata column crosstab (e.g., theme × city) — counts per cell, share within column, row/column totals; cells render as count + share text with a tint ramp (never color alone — 09); "unspecified" bucket for blank metadata. `getCrosstab`
3. Faisal (viewer seat) reads the same surface read-only for his region question — the sliceable report (02 JTBD); no mutation affordances render for his role.
4. A suspicious cell (a theme at 3× prevalence in one city) drills straight through to the underlying responses, filtered — evidence one click from every claim. `listResponses` (filtered by theme + metadata value)

**Edges**: crosstab on a metadata column with >20 distinct values (top 19 + "other" aggregate, stated in the surface); overlap accounting in crosstab cells (a response in 2 themes counts in both rows — disclosed in the surface's footnote, matching coverage); a column with all-blank values (the console says so and offers another column rather than an empty grid).
**Failures**: crosstab before any run → VALIDATION offering the run (no themes to cross); NETWORK → banner + retry.
**Recovery**: coverage and crosstab are derived reads — recomputed from response state + theme definitions, never cached opinions; re-render after every curation act is ≤120ms (10).

## CP-5 — Export, handoff, jobs, activity, settings (the governance close)

1. Mariam opens export for the project (or one question): the **bilingual theme report** (theme labels ar+en, definitions, member counts, shares, coverage lines, quotes — rule-selected and pinned, with provenance) and/or the **coded dataset** (responses with final theme memberships, detection classes, tone, metadata — the countable deliverable Veridata-class services sell, 01 q13). Quota shown before running (P14). `exportAnalysis` · `getUsage`
2. The export is a Job: per-format progress, expiry window declared at creation (7 days), regeneration deterministic. Manual handoff is the default: download/copy; the abstract "export destination" capability delivers when bound (08 N3). `exportAnalysis` · `listJobs`
3. She retrieves the artifact; expiry is stated in text on the artifact row; expired → NOT_FOUND with regenerate (the analysis state is unchanged — regeneration is deterministic). `getArtifact`
4. Jobs console across the product: imports, clustering runs, exports — filterable, cancel/retry, link-to-context (async-contract §7). The activity log (P17) is the accountability surface: every confirm, rename, merge, assign, pin, override, export with actor and timestamp, filterable, exportable as the audit trail. `listJobs` · `listActivity`
5. Settings: direction/locale default, capability consent state (kind, not vendor — credential-contract), usage window with reset time, the disclosed engine defaults (stopword list view, thresholds) read-only reference. Project rename happens from the projects home row menu. `getSession` · `getUsage` · `updateProject`

**Edges**: export of a question whose themes changed mid-export-job (the artifact pins the theme-set version at export start — later changes flag as newer-pending on the artifact row, 07a); report with zero confirmed themes (refuses with "nothing confirmed to report — confirm or curate themes first" — honest, never an empty-branded PDF); coded dataset including unassigned responses (included as `unassigned` — the countable truth, 11 copy).
**Failures**: export quota → RATE_LIMIT ladder with reset time; export failure mid-package → per-format partial with per-format retry (async-contract §4); NETWORK during delivery → retry, artifact held.
**Recovery**: exports re-generate from analysis state at any time; the jobs console reconciles after reconnect (async-contract §5); activity log is append-only and survives everything.

## Non-happy paths

- **No project yet** (first-run): the projects home offers the **sample project** (P22 value checklist — the parity moment for this product is *watching a model-proposed theme pass a confirm gate and a keyword group become a named bilingual theme with a pinned quote*, so the sample ships with one pending proposal and one merge fixture). `createProject` on real work, or open the sample. `listProjects` first-run empty state (11).
- **Clustering capability unbound** (the tested default state — LOOP-5): the keyword floor carries the whole flow: same board, same quotes, `keyword-grouping` provenance, the disclosure panel (stopwords, thresholds, normalization ruleset) one click away. Nothing walls off; nothing pretends.
- **Capability bound but quota exhausted mid-wave**: model-assisted runs stop (RATE_LIMIT ladder); the floor keeps running unlimited; proposals already landed keep their state — the wave is never blocked on a meter (ai-native-patterns §5 rung discipline).
- **Model capability fails mid-run**: typed NETWORK/UNKNOWN on the proposal stream; the run completes as floor-only and says so in the run result (partial-result policy — the floor is the floor, honest labeling); retry re-requests proposals for unconfirmed groups only.
- **Offline**: reads work; theme edits, assigns, pins queue with per-item state (P20); determinism makes reconnect safe — same inputs, same derived reads.
- **Viewer seat** (Faisal): board, quotes, coverage, crosstab, exports read-only; PERMISSION names the seat's capability on any mutation affordance that somehow renders (they shouldn't — 07b rule).

## Failure → error mapping

VALIDATION (malformed import rows, paste format errors, theme-label collisions, confirm-gate misuse, crosstab-before-run, export-with-nothing-confirmed) · NOT_FOUND (stale project/question/response/theme/artifact links, expired artifacts, merged-away themes) · PERMISSION (capability consent, workspace scoping, viewer-role mutations) · CONFLICT (concurrent theme edits, confirm on dismissed proposals, bulk count drift, stale quote pins) · RATE_LIMIT (model-assisted clustering runs, export packages — the keyword floor is never metered) · NETWORK (list fetches, job polling, proposal stream, export delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.6, CP-5.5 |
| `createProject` | CP-1.1, non-happy first-run |
| `listProjects` | S1 projects home (04) — the app's first screen, exercised on entry by every persona in 02 |
| `getProject` | CP-1.1 (post-create landing), CP-4.3 (viewer slice entry) |
| `updateProject` | CP-5.5 (rename from projects home; metadata-column edits) |
| `importResponses` | CP-1.2, non-happy sample re-paste |
| `listQuestions` | CP-1.3, CP-2.6 |
| `getQuestion` | CP-1.3, CP-2.6 |
| `listResponses` | CP-2.1 (unassigned filter), CP-2.4, CP-4.4 (crosstab drill) |
| `getResponse` | CP-2.3, CP-2.5 |
| `setResponseLanguageOverride` | CP-2.5 |
| `runClustering` | CP-1.4, CP-3.7 (mid-wave re-run) |
| `listThemes` | CP-1.5, CP-2.1 |
| `getTheme` | CP-2.2, CP-3.1 |
| `saveTheme` | CP-3.2 (rename/define), CP-3.3 (create from scratch) |
| `confirmTheme` | CP-3.1 |
| `getConfirmGate` | CP-3.1 (the live gate preview before every confirm/reject) |
| `getMergePreview` | CP-3.4 (the union preview before every merge) |
| `mergeThemes` | CP-3.4 |
| `deleteTheme` | CP-3.6 |
| `setResponseTheme` | CP-3.5 |
| `bulkSetResponseTheme` | CP-3.5 (bulk from counted filtered set) |
| `getCoverageReport` | CP-1.5, CP-4.1 |
| `getCrosstab` | CP-4.2 |
| `setQuotePin` | CP-3.8 |
| `exportAnalysis` | CP-5.1, CP-5.2 |
| `getArtifact` | CP-5.3 |
| `listJobs` | CP-1.2, CP-5.2, CP-5.4 |
| `listActivity` | CP-5.4 |
| `getUsage` | CP-5.1 (pre-export quota), CP-5.5 |

30 operations, 0 orphans (Critic-verified — the table lists every 07b operation exactly once: 30 rows). `listProjects` is the projects-home entry surface (04 S1) — the app's first screen, exercised on app entry by every persona in 02.
