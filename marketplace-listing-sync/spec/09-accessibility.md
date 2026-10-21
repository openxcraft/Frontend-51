# 09 — Accessibility: marketplace-listing-sync

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions (bilingual-en: chrome flips, both full citizens), 1280px and 360px viewports, 200%/400% zoom. The product's structural a11y problems: **keyboard-dense grids** (mapping table, findings board, listings board) and **paired-direction content inside one workspace** — solved below as the content-direction focus contract.

## Keyboard map (critical paths; no raw-letter shortcuts — Arabic-layout conflict class, a11y-baseline §3)

| Surface / path | Keys | Behavior |
|---|---|---|
| Global | ⌘K / Ctrl+K | Command palette: bilingual normalized search (rtl-rules §4) over channels, products (SKU/title/brand), listings, findings; jump-to-SKU; recent items |
| S1 channels home | ↑/↓ · Enter · / | Card traversal; open channel context; focus search |
| S5 mapping table (CP-2) | ↑/↓ · Enter · Tab · Escape · ⌘S | P18 grid: ↑/↓ move between mapping rows; Enter edits the focused cell (P06); Tab commits and advances inline; Escape restores and returns focus to the cell; ⌘S saves the map |
| S5 attribute rail | ⌥→ / ⌥← | Move focus between the mapping table and the attribute-catalog rail (declared shortcut, announced on first focus per session) |
| S5 suggestion panel | ↑/↓ · A / E / R (with ⌘) | Traverse suggestions in reading order; ⌘A accept, ⌘E edit-then-accept (focus moves to the editable row), ⌘R reject — modified keys only, never raw letters |
| S4 master editor (P23 columns) | Tab · ⌘Enter · ⌥Tab | Tab advances within the focused locale column top-to-bottom; ⌥Tab jumps between the ar and en columns on the same field (the pair navigation); ⌘Enter saves the product |
| S6 listings board | ↑/↓ · Space · Enter · ⌘P | Row traversal (virtualized — focus moves scroll into view, never the reverse, P19); Space toggles bulk-selection (P07); Enter opens the listing detail; ⌘P publishes the selected ready set |
| S7 listing detail | Tab · F · (with ⌘) | Tab order: mapped preview → checklist column → overrides → publish history; ⌘F jumps to the first open blocker row (the fix path); blocker rows focusable with Enter jump-to-source |
| S8 findings board | ↑/↓ · Enter · Space | Finding rows grouped by rule; Enter opens the resolution menu (acknowledge for warnings; jump-to-source for blockers); Space bulk-selects a filtered set |
| S2 rule-pack editor | Tab · ⌘S | Field order kind → severity → params → note; blur validation (skill row 56); error summary focuses the first bad field on save |
| Publish gate (CP-4) | Tab · Enter | Publish requires focus on the publish control itself (never fires from a dialog default); skipped-and-named listings are focusable rows in the pre-submit summary |

Every shortcut has a visible button/menu equivalent; focus-visible is the Sarraf Violet ring at 2.4.13 strength (≥2px, ≥3:1 change-contrast — computed 4.69:1 on paper, 05) on every interactive element; sticky board headers clear focused rows (2.4.11 — scroll-margin token obligation). Modals/popovers trap-free with focus return (a11y-baseline §3). Drag-reorder does not exist in v1 (mapping rows move via declared keyboard commands — WCAG 2.2 §2.5.7 satisfied by construction).

## Focus order & the content-direction focus contract

Reading order per surface follows the workspace's active direction (bilingual-en default LTR; full-citizen RTL flip re-renders everything). The structural rule: **field values render at their own locale's direction inside LTR/RTL chrome** (content-direction contract, 05) — the master editor's Arabic column is an RTL region inside an LTR page and vice versa; focus order crosses columns in the workspace's reading order while each region's internal caret navigation follows its script (rtl-rules §4). Mixed-script values (Latin brand inside Arabic title — the DN-1007 fixture) are bidi-isolated at render (`dir="auto"` on inputs, isolate marks on interpolations — rtl-rules §2); the mapped preview labels each attribute key with its acceptsLocale mark as text so a screen-reader user hears which locale a value is before its content. SKU codes and character counts keep physical order stable in both directions (rtl-rules §4 — numbers never re-order between directions).

## Live-region announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Board/list region entry | polite | "24 listings, 4 blocked, 1 warning, 1 error" (row-count context, P19) |
| Mapping row saved | polite | "Mapping saved — 8 rows, version 4. 14 listings are now stale." |
| Suggestion resolved | polite | "Suggestion accepted — product_name_ar maps from title, Arabic variant. Save the field map to apply." |
| Finding arrives (recompute after edit) | polite | "Title check passed — 71 of 75 characters." |
| Blocker resolved ("The Checklist Closes") | polite | "Listing ready — 14 rules passed, 2 warnings acknowledged." (carries the full summary when the signature animation is reduced-motion-disabled) |
| Check job progress | polite | determinate units only ("Checking listing 9 of 24") — never percentage-only (async-contract §3) |
| Publish outcome | polite | "10 published, 1 rejected, 0 skipped — rejection: ERR-8512 on DN-1012." |
| Publish refusal (blocked set submitted) | **assertive** | "Publish refused — 4 listings are blocked. First blocker: DN-1003, title 90 characters over a 75 ceiling." |
| Validation error (mapping/rule editor) | **assertive** | field-linked message; error summary focuses first error on submit (a11y-baseline §5) |
| Channel rejection arrival (error state) | **assertive** | "The channel rejected DN-1012 — brand field contains unsupported characters. The message is verbatim; the code is ERR-8512." |
| Quota warning (80%) | polite | "6 of 8 publish batches used this window — it resets 1 Dec." |
| Decorative chip clusters overflow | never (visual only) | the "+N more" control is the accessible path; chips render focusable when listed |

Live regions pair with visible equivalents — every announcement above has a visible surface (board counts, checklist rows, job rows, toast) per a11y-baseline §4.

## Per-surface WCAG 2.2 AA checklist

- **S5 mapping studio (the hard one)**: 400% zoom reflow with worst-case Arabic strings ("مستشارو التدقيق والحوكمة" — rtl-rules §5) in mapped values; the table and attribute rail stack below 768px and at zoom overflow, each keeping its own direction; truncation breaks at word boundaries only; targets ≥24×24 (transform chips, variant tags); the suggestion confidence is text+meter, never meter-only; collisions are named in text, never a red row alone (05 readiness palette contracts: icon + text + color).
- **S4 master editor (P23)**: paired columns with alignment links; labels persist above fields — never inside them as ghost text (a11y-baseline §5); per-column direction rendering; autocomplete tokens declared for repeated fields (price/stock are numeric — no personal data; no autocomplete obligations triggered).
- **S6/S8 boards**: virtualization preserves focus (P19); state chips carry counts as text ("4 blockers"); filtered states declare themselves (P08); the four empties distinct per P01 (11).
- **S7 listing detail**: mapped preview values bidi-isolated; overrides carry the override mark as text; publish history pins render in tabular figures; the master-diff (P16) meets text contrast for deletions/insertions.
- **S2 rule pack**: param edits validate on blur with field-linked messages; severity changes (blocker↔warning) announce the consequence ("this rule will stop blocking listings") before save — the a11y-honest form of a destructive-ish policy edit.
- **S9/S10 jobs & artifacts**: JobRow states + cancel/retry keyboard-complete; progress honest-determinate; artifact expiry stated in text.
- **S11 settings**: consent state displayed in capability language (kind, not vendor); no cognitive-function tests anywhere (3.3.8 — paste never blocked); 3.3.7 redundant entry: the channel-create form recalls the last archetype and locale requirement.

## RTL/LTR verification matrix (per surface, both chrome directions; content directions fixed by locale)

For each of S1–S11, both chrome directions: pure-Arabic render · pure-English render · mixed strings (Latin brand inside Arabic title — seeded DN-1007 is the fixture) · numeral rendering under Western policy inside Arabic chrome · embedded Latin/numeric tokens in RTL · tables/grids mirrored (mapping table column order, findings board groups) with alignment rules held · forms (rule-pack editor label/error placement on the correct inline edge) · truncation at 320px container with worst-case strings · 400% zoom reflow · bidi isolation on user-generated content (catalog paste can carry anything). **Content-direction fixtures run both ways**: an Arabic title value inside English chrome and an English title value inside Arabic chrome (the master editor's paired columns guarantee both cases on every screen that shows field values). Board pagination and step indicators mirror per rtl-rules §2 while SKUs and character counts keep physical order stable (rtl-rules §4).

## Reduced-motion contract (motion-language §5)

Crossfades → hard cuts; finding chip arrive/dissolve → instant with the polite announcements above; "The Checklist Closes" stagger → simultaneous render + full-summary announcement; mapping-row settle → instant. All state changes remain perceivable by construction — the announcement schedule is the reduced-motion equivalent of every animated transition. Smooth-scroll (adopted with exceptions, 05) → `scroll-behavior: auto` under reduced motion.
