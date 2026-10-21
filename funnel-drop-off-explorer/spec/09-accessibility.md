# 09 — Accessibility: funnel-drop-off-explorer

SME-F pass · Baseline: _shared/a11y-baseline.md (WCAG 2.2 AA, both directions, 200% & 400% zoom, 360px and 1280px viewports). This file adds what a flagship DATA-VIZ product owes beyond the floor: the canvas keyboard instrument (j/k seam traversal, one-key drill), **chart alternatives for every visualization** (the Cascade, Anneal Spine, displaced-flow ribbon, trend spark, compare bands — each with a text-table equivalent that carries ALL the data), focus-traversal contracts for a canvas-with-docked-panel layout, live-region announcement schedules for async QUERY surfaces (this product's distinctive a11y problem: the screen fills with numbers that arrive at different times), sonification considerations (recorded honestly as deferred, with the text alternatives that ship), per-surface checklists, the RTL/LTR verification matrix, and the reduced-motion contract. The privacy posture (pseudonymous keys only) is stated in §Overlay — it is an a11y-adjacent trust surface, not decoration.

## 1. Keyboard map (per critical path; real keys; Arabic-layout-safe)

**Layout-safety rule (house pattern)**: single-letter shortcuts fire ONLY inside scoped non-text contexts (the canvas, list/grid surfaces); every letter shortcut has a modified equivalent (⌘/Ctrl + letter) that works everywhere and is Arabic-layout-safe; unmodified letters are suppressed whenever a text input, the composer, or a sheet form field holds focus. ⌘K/Ctrl+K is the only global chord. The full table is §6.

### CP-1 — first insight: sample, compose, render, select (S2 → S3)

Tab order: funnels-home list → NEW FUNNEL → paste-sample sheet (when offered) → composer strip: taxonomy search field → results listbox (arrows; Enter adds step) → per-step settings disclosure → SAVE. The composer is a labelled form region (P09: each step independently valid); the paste sheet's column-mapping table is a P18 grid (arrows move, Enter opens the per-column map/skip menu — never a silent drop, CP-1.2); the import job row is a live region per §4. After save: focus moves to the FIRST STRATUM of the rendered cascade (the render's arrival point — the analyst's eye lands there too), announced with the funnel headline.

### CP-2 — the exploration loop (S3 canvas, keyboard-first — the product's speed surface)

- **j / k** (or ↓/↑): roving-tabindex focus across SEAMS (the gaps between strata — SeamSelector is the focusable unit, 06); physical arrow keys keep their meaning in both directions (rtl-rules §4 — inline-start/end arrows mirror, j/k do not).
- **Enter / Space** on a seam: opens the SeamDossier docked inline-end — focus moves to the dossier header; the cascade STAYS in the accessibility tree (docked, not modal — 06); Esc returns focus to the seam.
- **B**: focus-jumps to the breakdown axis picker (menu), then rows (arrows); **Enter** on a row drills the segment preview; **S** saves the row's segment (from the row context).
- **T**: opens the trend strip (focusable figure with described-by, 06 TrendSpark).
- Within the dossier, ↑/↓ move across its disclosure sections (breakdown / displaced paths / time-to-convert / anneal launcher); each is a proper disclosure with `aria-expanded`.
- **Re-query discipline (focus preservation)**: when the date range or window changes and the cascade patches in place (CP-2.5), focus STAYS on the current seam (matched by step-pair identity); if the seam's identity changed, focus lands on the nearest surviving seam with a polite notice ("the funnel changed underneath — reselect the seam" — 11 §B). Focus is never dumped to the document top by a re-render — the single most common a11y failure of live query surfaces, and a hard rule here.

### CP-3 — the anneal (launcher → Spine → segment → cohort → compare)

- **A** on a seam: opens the anneal launcher sheet (focus-trapped, 05/06 sheet discipline); the policy fields are standard inputs with `inputmode="decimal"` on epsilon and `inputmode="numeric"` on depth cap (06); ⌘/Ctrl+Enter runs.
- While running (≤2s budget, 10): the launcher renders honest progress (iteration landings) in a polite live region — never a fake spinner (03 CP-3 edge; async-contract §3).
- On completion: the Anneal Spine renders as an ORDERED LIST of iterations (06); focus moves to the Spine header, which announces the chain summary ("segment chain: 2 predicates, 60 users, 60.0% drop-off — 17 excess drop-offs" / "سلسلة مقاطع: محوران، 60 مستخدماً، هبوط 60.0% — 17 هبوطاً فائضاً"); arrows walk iterations; each iteration's candidate table is a P18 grid.
- **S** on the Spine: saves the chain as a segment (focus-preserving toast per §4); **C**: opens the CompareBoard (segment A pre-set to the chain; B picker is a listbox of saved segments / breakdown rows / the complement); the board is a two-column table with scope headers (06) — arrows walk metric rows, NOT visual columns.
- Cohort drill (S5): P18 grid on UserDrillTable; row-count context on region entry (P19 — "60 rows"); virtualization above 200 rows with focus preservation (06).

### CP-4 — taxonomy governance (S6)

Lint report: groups are disclosures with counts in the summary line; ↑/↓ walk violations; **Enter** opens the edit surface with the FAILING RULE focused (06 LintReportPanel — the fix path starts at the error, not at the top of the form). Inline edit is P06 (Esc restores; Tab commits and advances; never a cell trap). The rename gate renders as a dialog with the impact list as a table; deprecation resolution options are radios with labels, not color chips. **L** (or ⌘/Ctrl+L globally — the layout-safe binding; unmodified L is honored only in non-text contexts): opens the lint report from anywhere (CP-4.1).

### CP-5 — narrate, save, share, export (S3/S8)

**N** on a chain or analysis: opens the NarrationPanel and starts composition — the region is aria-live polite with start/completion announcements ONLY (never per-token, 06); Stop and Regenerate are focusable from the first chunk. Save/Share/Export are standard verb-labeled buttons; the export job row announces completion politely ("evidence artifact ready — expires in 7 days" / "قطعة الأدلة جاهزة — تنتهي صلاحيتها بعد 7 أيام").

### CP-6 — admin spine (S7/S9/S10)

Standard P18 grids and forms throughout; job center rows carry state + progress text equivalents ("importing row 40 of 120"); the people surface's role changes are selects + ledger notes; inbox rows are standard readable content with **M** mark-seen (context-scoped).

## 2. Chart alternatives (the flagship data-viz obligation — every visualization carries ALL its data as text)

The product's a11y posture for charts is NOT "a description of the picture"; it is a **functional text twin that carries every figure the visualization carries** — a screen-reader user must be able to do the ANALYSIS (compare seams, read traces, rank paths), not merely be told a chart exists. All four twin surfaces are reachable by a "table view" toggle button on each chart region (keyboard-focusable, reflected in the URL per P08 discipline) AND by the described-by summary:

| Visualization | Text twin (complete data) | Notes |
|---|---|---|
| **CascadeChart** (the funnel) | An ordered list of strata: "step 1 of 5 — App Installed — 400 users · step 2 of 5 — Onboarding Completed — 348 users, 52 lost (13.0%) · …" — every stratum count, every seam's lost-count and drop-off rate, the largest-seam badge and slowest-step cross-reference, plus the basis line (source, range, window, freshness — 11 §D7) as the region's described-by | The stratum HEIGHTS are decorative reinforcement (06: counts and rates are TEXT in tabular numerals); no fact exists only as geometry |
| **AnnealSpine** (the trace) | An ordered list of iterations, each with its full candidate table as a grid: axis, value, size, drop-off rate, excess, separation, eligibility + reason; admitted predicate per iteration; the final chain's size/rate/excess/headcount; the support floor and epsilon in the header; the correlation-honesty sentence as required content (11 §D1) | The pinch motion is decorative (06); a screen-reader user reads the SAME trace the sighted analyst audits — the auditability promise extends to non-visual access by construction |
| **LostFlowRibbon** (displaced paths) | A ranked list: rank, event label (bilingual per reader locale), count, share — "App Exited 31 (36.0% of lost) · Restaurant Page Viewed 19 (22.1%) · …" with the "left the product" row rendered as an honest first-rank possibility | Strands are decorative (06); the ranking IS list order |
| **TrendSpark / CompareBoard bands** | Trend: the per-window rate row as text ("33.1% · 31.9% · 28.8% · 27.2% — last 4 weeks") + a described-by stating direction and range in words. Compare: the two-column table IS the primary render (06) — population bands are bars with the NUMBERS as text | Direction is text+icon, never hue or slope alone (06 TrendSpark) |

**Sonification considerations (recorded honestly — deferred, with the text alternatives that ship):** the Cascade's drop-off gradient and the Spine's narrowing bands are natural sonification candidates (descending pitch per stratum; narrowing band = rising filter cutoff), and data-viz a11y practice treats audio as a legitimate chart channel for blind users. v1 does NOT ship audio: the canvas is a long-session keyboard surface where unexpected audio is a workplace hazard, and a half-good sonification is worse than the complete text twins above. The DESIGN OBLIGATION that ships instead: (a) the text twins carry every figure (table above — the sonification use-case is answered by structure, not sound); (b) the seam TRAVERSAL order is the analytic order (j/k walks the funnel top-down, so the reading order teaches the funnel's shape); (c) the Spine's iteration list exposes the greedy search's sequence as list semantics. A v2 sonification layer, if ever built, layers ON these twins (audio as reinforcement of a complete text structure), never replaces them — recorded here so the deferral is a decision, not an omission.

## 3. Focus-order contracts (canvas + docked panel — the layout's a11y law)

1. **Onecanvas-one-region rule**: the exploration canvas (S3) is a single labelled region (`aria-label` "exploration canvas — funnel, seams, dossier"); inside it, the focus order is: composer strip (collapsed header) → basis line (focusable figure) → strata/seams (roving j/k) → dossier panel (when open) → sheets (when open, focus-trapped with return). Visual order == DOM order == tab order in BOTH directions (rtl-rules §5).
2. **The dossier docks, never modals**: while the dossier is open, the cascade remains reachable (Tab continues past the dossier into the sheet stack and back to the canvas chrome) — the cascade is decision context and must stay live (04 IA decision); only the anneal launcher / compare / narration / export SHEETS trap focus (a11y-baseline §3) and return to their trigger on Esc.
3. **Skip links**: skip-to-main on the shell; skip-to-dossier when the panel is open (the dossier can be tall — the breakdown table plus ribbon plus time distribution).
4. **Roving tabindex discipline**: exactly ONE seam carries tabindex=0 (the current seam); j/k move it; Home/End jump to first/last seam; the roving index resets to the LARGEST seam on fresh render (the pre-badged one — the analyst's likely first question).
5. **2.4.11/2.4.13**: sticky canvas chrome never obscures the focused seam (scroll-margin tokens on strata); focus-visible is the accent.bright ring at ≥3:1 change-contrast on every surface (05 ladder: 12.03:1 on canvas) — the pinch motion NEVER replaces or augments the focus ring (05).

## 4. Live-region announcement schedule (async QUERY surfaces — the product's distinctive a11y problem)

Queries arrive at different times (metrics, then breakdown rows, then transition detail, then anneal); the discipline is: **each region announces its own completion once, politely; nothing announces on arrival-by-default; errors interrupt assertively once with the next action** (a11y-baseline §4: every announcement pairs with a visible surface).

| Event | Mode | Copy shape (bilingual verbatim in 11 §B/§C) |
|---|---|---|
| Cascade metrics payload arrives | polite | "funnel computed — 400 users entered, 121 converted (30.25%)" / "حُسب المسار — دخل 400 مستخدم، وتحوّل 121 (30.25%)" |
| Re-query patches in place (range/window change) | polite | "recomputed — the largest seam moved to First Search → Add to Cart" (names the change, not every number) |
| Seam dossier opens / seam focus change | polite on focus, never on change | "seam 3: 86 of 271 lost — 31.7%" / "الدرز 3: فُقد 86 من 271 — 31.7%" |
| Breakdown rows arrive | polite | "breakdown by platform — 3 rows, largest separation web (0.0661)" |
| Displaced paths arrive | never announced on arrival | visible list mutation only; region-count context on region entry (P19): "8 paths — 86 lost users accounted for" |
| Anneal run: start / iteration landing / completion | polite (start), silent per-iteration, polite-once (completion) | start: "annealing — support floor 30, epsilon 0.02, depth cap 4"; completion: the chain summary sentence (§1 CP-3) + "2 iterations admitted, 1 rejected — full trace below" |
| Anneal launcher refusal (seam below floor) | assertive once | "seam population 24 — below the minimum support floor of 30; widen the date range or the window" (the f-3 fixture copy, 11 §C) |
| Narration streaming | polite at start and completion ONLY | "narrating from metric templates…" → "narrative ready — provenance: metric templates" (never per-token, 06 NarrationPanel) |
| Import/export job progress | polite, throttled to phase changes | "importing row 40 of 120" (not per row); "imported 116 rows — 2 failed, 2 resolved by your choices" |
| Validation errors (rule-named) | assertive once | the failing rule's plain-language string, field/row-linked (first error focused, a11y-baseline §5) |
| Taxonomy changed under an open canvas (workspace event) | polite | "taxonomy changed after this render — re-run" / "تغيّر مسرد الأحداث بعد هذا العرض — أعد الحساب" (the staleness chip's twin, 11 §G) |
| Source freshness change | never announced | visible chip only — freshness is state, not news (an exploration tool has no page-worthy emergencies, 12 Q-13) |

## 5. Per-surface WCAG 2.2 AA checklist (S1–S11)

All surfaces: four empties (P01) with correct 11 §A copy; skeletons mirror final geometry RTL-flipped (P02, 11 §B); focus-visible per 2.4.13 (§3.5); targets ≥24px (2.5.8) with the tablet review view at **≥44px** + 8px spacing; contrast per the 05 ladder contracts (text.primary AAA on every reading surface; the data-ink ramp ≥3:1 with text-grade labels; critical copy never body-size on wash — 05 usage contract); numerals Western in both locales (05); no state hue-coded alone anywhere (seams, bands, lint classes — 06).

- **S1 SIGN-IN**: locale pick is a radio pair with persistent labels; no auto-redirect on locale change; session errors announce assertively with next action.
- **S2 CANVAS HOME**: funnel rows carry their headline as text (conversion, trend arrow as text+icon, freshness chip); first-run empty teaches the paste loop with ONE action (P01).
- **S3 EXPLORATION CANVAS** (the flagship surface): everything in §1–§4; 400% zoom reflows the cascade to a single stratum-per-row stack with identical labels and the twin list order; the dossier becomes a sequential section below (docked panel collapses under 1280px — 04 responsive rule); the basis line is a described-by figure; strata settle ≤60ms stagger capped at 5 (05) with the reduced-motion render below; the largest-seam badge is text+icon.
- **S4 SEGMENT WORKSHOP**: provenance cards render origin (funnel, seam, run) as text; anneal history rows link to full traces; the CompareBoard is a real two-column table (§2); policy publish requires admin — the lock state names the surface and the request-access action (11 §C PERMISSION).
- **S5 COHORTS & USERS**: P19 row-count context on drill entry; user keys in Space Mono with bidi isolation inside Arabic rows; the privacy posture line renders in the panel footer (06); NO PII fields exist in the data model (07a) so none can render — the drill cannot leak what the contract cannot carry.
- **S6 TAXONOMY MANAGER**: the bilingual label pair renders with per-side direction and bidi isolation (06 TaxonomyCard); label gaps render as ERROR affordances, never silent; the lint report's group counts are text; rename diffs are P16 with direction-aware layout; deprecation gates are labelled radios; the CLEAN state has its own copy (11 §A — a good state).
- **S7 SOURCES & SAMPLES**: source health per credential-contract lifecycle as text+icon (never hue alone); the paste sheet's column mapping is a grid with per-column choices (CP-1.2 — never a silent drop); failed rows are quoted with row numbers in the job detail.
- **S8 ANALYSES FEED** (tablet default — the review posture): narration region per 11 §D with provenance chip as text; the Spine preview renders the chain as words; annotations are standard form posts; export expiry announced with the artifact name; touch targets ≥44px.
- **S9 ACTIVITY & JOBS**: activity log is a navigable table (filter chips per P08 with predicate-in-words descriptions); job rows carry state + progress text equivalents.
- **S10 INBOX**: digest rows are standard readable content; M marks seen (context-scoped); tier control per class is a labelled select.
- **S11 ONBOARDING CHECKLIST**: P22 value milestones, one action each, no tours-of-balloons; four persona entry paths (02) link into S2/S3/S6/S8.

## 6. Shortcut table (complete; modified keys or navigation keys only as GLOBALS)

| Context | Shortcut | Action |
|---|---|---|
| Global | ⌘K / Ctrl+K | command palette (P05, bilingual normalized search) |
| Global | ⌘L / Ctrl+L | taxonomy lint report (CP-4.1 "L from anywhere" — the layout-safe binding; unmodified L honored in non-text contexts) |
| Canvas (S3) | j / k (or ↓/↑; inline arrows mirror in RTL) | seam roving focus (physical keys stable both directions) |
| Canvas (S3) | Home / End | first / last seam |
| Seam | Enter / Space | open the SeamDossier (focus moves in; Esc returns) |
| Seam / dossier | B / ⌘B | breakdown axis picker → rows |
| Seam / dossier | A / ⌘A | anneal launcher (⌘/Ctrl+Enter runs) |
| Chain / Spine | C / ⌘C | CompareBoard (A pre-set, B picker) |
| Spine / breakdown row | S / ⌘S | save segment (focus-preserving toast) |
| Canvas (S3) | T / ⌘T | trend strip |
| Chain / analysis | N / ⌘N | narrate (NarrationPanel; Stop/Regenerate focusable from first chunk) |
| Dossier / sheets | Esc | close sheet or dossier — focus returns to trigger (trap-free guarantee) |
| Any grid (P18) | arrows / shift+arrows | cell navigation / range select |
| Drill & lists | M (context) | mark seen (inbox) |
| Any list > 200 rows | arrows | virtualized navigation — scrolling never moves focus (P19) |

## 7. RTL/LTR verification matrix (per surface, both directions — the full 09 matrix, 05's promise)

For each of S1–S11, recorded pass/fail on: pure-Arabic render; pure-English render; mixed strings (Latin user keys `u-0042` and event canonical names inside Arabic narration/prose — bidi isolation on every interpolated token per rtl-rules §2; Arabic event labels inside English copy); numeral rendering under the Western-numeral policy inside Arabic prose (no mid-sentence mixing — copy-voice §1.7); the CASCADE's reading direction (strata stack runs inline-start → inline-end in RTL — the funnel's TOP stays the reading-origin; seam badges and lost-flow drapes mirror); the SPINE's narrowing direction (bands narrow from the inline-start edge — the pinch's origin mirrors); the RIBBON's strand direction (displaced paths draw toward inline-end; the branch glyph flips — 06 metaphor ledger); grid/table mirroring (breakdown tables, drill tables, compare board — column order mirrors, the A/B pair keeps its logical order with re-labeled headers); icon flipping per the 06 ledger (chevrons, displaced-path branch, export arrow flip; lens, funnel, strata, book, pulse never); truncation at 320px container with worst-case Arabic strings ("مستشارو التدقيق والحوكمة"-class long words + the product's coined terms تلبيد/درز); 400% zoom reflow (§5); focus order matching visual order in both directions (§3.1). The mock's seeded mixed-locale fixtures (07c §1.3 bilingual labels, Latin canonical names, Arabic aliases in paste rows) guarantee a test fixture for every cell; the matrix runs against the frozen-clock walkthrough in both locales.

## 8. Reduced-motion contract (motion-language §5, per component)

`prefers-reduced-motion: reduce` collapses EVERY decorative motion to its static final state with identical information: the **Anneal Pinch** becomes an instant band change + the state announcement (the pinch is decoration; the facts are text — 05); **Stratum Settle** renders all strata at final height simultaneously (drapes render as static side-flows); the **ribbon's strand draw** renders statically with ranking as list order; narration streams in paragraph chunks with per-chunk polite announcements (06 NarrationPanel; ai-native-patterns §2); sheets crossfade to opacity-only; focus rings, staleness chips, and every text twin are unaffected (motion and direction never carry information — the §2 twins are the guarantee). The walkthrough (03 CP-6.9) runs to the SAME conclusions under reduced motion — the replay assertion includes a reduced-motion pass (10 measurement protocol step 5).

## 9. Overlay applicability & privacy posture

No fintech/healthcare/legal overlay applies (analytics family). The privacy posture is STRUCTURAL and stated on the surfaces where a user might wonder: the cohort drill's footer line ("pseudonymous user keys — no personal data" / "مفاتيح مستخدمين مستعارة — بلا بيانات شخصية", 06 UserDrillTable), the narration provenance note (model consumes run metrics only — 07b rule 4; 08 N4 grant language), and the taxonomy's declared-axes model (properties are governed dictionary entries, not free-form user attributes — 07a). The adapter cannot accept or return PII (07b rule 8) — the a11y posture and the privacy posture are the same design decision: the drill surface cannot expose what the contract cannot carry, for ANY user, in either direction, on any assistive technology.
