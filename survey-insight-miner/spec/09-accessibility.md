# 09 — Accessibility: survey-insight-miner

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions, 1280px and 360px viewports, 200%/400% zoom. The product's structural a11y problem is also its identity: **long verbatim reading in mixed directions with evidence attached to everything** — solved below as the verbatim-direction and evidence-redundancy contracts.

## Keyboard map (critical paths; no raw-letter shortcuts — Arabic-layout conflict class, a11y-baseline §3)

| Surface / path | Keys | Behavior |
|---|---|---|
| Global | ⌘K / Ctrl+K | Command palette: bilingual normalized search (rtl-rules §4 — alef/hamza, taa marbuta/heh, yaa forms) over projects, questions, themes (both label slots), responses (respondent ref + verbatim), jump-to-theme on the open board; recent items |
| S1 projects home | ↑/↓ · Enter · / | Row traversal (P18); open project; focus search. Filter chips removable with Delete |
| S3 theme board (CP-1.5, CP-2.1) | ↓/↑ · T / ⇧T · Enter · Space | Card traversal (grid reading order, both directions); T/⇧T next/previous theme; Enter opens theme detail; Space toggles member-selection for bulk paths |
| S4 theme detail (CP-3) | Tab · ⌘S · ⌘Enter | Focus order: label pair → provenance panel → definition → members list → quotes; ⌘S saves the label/definition edit from any field; ⌘Enter confirms when the confirm gate is the screen's action (focus must be ON the Confirm control — it never fires from a field, 03 CP-3.1) |
| S5 response reader (CP-2.4) | ↑/↓ · Enter · A · Space | Row traversal (virtualized — focus moves scroll into view, never the reverse, P19); Enter opens the reading pane; **A assigns/unassigns the focused response to the active theme** (the active theme is announced); Space toggles bulk-selection (P07) |
| S5 reading pane (CP-2.3, CP-2.5) | Tab · O | Tab order: verbatim (its own direction) → detection panel → tone panel → memberships → assign controls; **O opens the language-override composer** |
| Quote wall (CP-2.2, CP-3.8) | ↑/↓ · P | Quote traversal within a theme; **P pins/unpins the focused quote** (confirm-less toggle — reversible, logged; announced politely) |
| S6 crosstab grid (CP-4) | ←→↑↓ · Enter | Cell navigation with cell-focus announcements ("Shipping theme × الرياض: 31 responses, 41% of column"); Enter drills through to the filtered reader (P18) |
| S7 intake (CP-1.2) | Tab · ⌘Enter | Field order: prompt pair → paste field → preview; ⌘Enter commits the import; per-row detection chips are focusable in preview order |
| S8/S9 jobs & activity | ↑/↓ · Enter | Row traversal; job rows expose cancel/retry as focused controls; activity rows read as actor-action-target-timestamp (P17 grammar) |

Every shortcut has a visible button/menu equivalent; focus-visible is the lavender-deep ring at 2.4.13 strength (≥2px, 6.14:1 change-contrast, ≥ area of a 2px outline — 05) on every interactive element; sticky board and reader headers clear focused rows (2.4.11 — scroll-margin token obligation). Modals/popovers trap-free with focus return (a11y-baseline §3).

## Focus order & the verbatim-direction contract

Reading order is: board → theme detail (label pair → evidence → members → quotes) → response reading pane — in the workspace's active direction, while **every verbatim renders at its own detected script direction** with bidi isolation (rtl-rules §2 — the direction model of 05, extended from trh's pane-direction contract to a reading-surface contract: text follows text, chrome follows locale). The detection panel is a labeled region (`aria-labelledby`: "الاستجابة — عربية فصحى" / "Response — MSA" variants per class); the verbatim region announces respondent ref + language class on focus so a screen-reader user hears the referent before the text. Theme labels render as a bilingual pair — the Arabic slot and Latin slot are separate labeled spans, each bidi-isolated, announced together ("محور: الشحن وتأخير التوصيل — Shipping and delivery delays"). Count/shares announce in Western numerals; respondent refs keep physical order stable in both directions (rtl-rules §4).

## Live-region announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Board region entry | polite | "13 themes, 239 assigned of 280 responses, 41 unassigned" (row-count context, P19 analog) |
| Theme card focused | polite | bilingual label + provenance + member count + share |
| Confirm gate opened | polite | "Proposal preview — 24 members in, 3 excluded below the evidence floor, confidence medium" |
| Theme confirmed | polite | "Confirmed — الشحن وتأخير التوصيل, 93 responses, by Khalid" (carries the full summary when "The Ink Sets" is reduced-motion-disabled, 05) |
| Proposal rejected | polite | "Proposal dismissed — a reason is recorded. Re-run regenerates fresh proposals." |
| Themes merged | polite | "Merged 31 + 45 responses into Shipping and pricing concerns — 81 responses, union verified" |
| Response assigned / unassigned | polite | "Assigned to Shipping and delivery delays — 94 of 280 assigned" |
| Bulk assigned | polite | "23 responses assigned — every one matched the counted filter exactly" |
| Quote pinned / unpinned | polite | "Quote pinned by Dana — sits above the rule-selected quotes" / "Unpinned — the rule's list is restored" |
| Run progress | polite | determinate units only ("Grouping 180 of 300 responses") — never percentage-only (async-contract §3) |
| Run completed (floor) | polite | "Keyword grouping complete — 12 themes, 239 assigned, 41 unassigned" |
| Run completed (model-assisted) | polite | "Keyword grouping complete, 1 proposal awaits your gate — proposals confirm nothing by themselves" |
| Coverage updated (derived) | polite | "Coverage: 239 assigned, 41 unassigned, 17 in multiple themes" |
| Validation error (label collision, intake rows) | assertive | field/row-linked message; error summary focuses the first error on submit (a11y-baseline §5) |
| Language override recorded | polite | "Class overridden to MSA by Dana — the rule's markers stay listed beside it" |
| Tone/detection chip cluster overflow | never (visual only) | the "+N more" control is the accessible path; chips are focusable when rendered |

Live regions pair with visible equivalents — every announcement above has a visible surface (card state, coverage strip, toast, gate preview) per a11y-baseline §4. **No announcement ever reads a response verbatim aloud automatically** — respondent content is read when the user focuses it (privacy posture, §RTL matrix note).

## Per-surface WCAG 2.2 AA checklist

- **S3 theme board (the hard one)**: 400% zoom reflow with worst-case Arabic strings ("مستشارو التدقيق والحوكمة" — rtl-rules §5; long joined theme labels like "الشحن وتأخير التوصيل") in cards; cards stack below 768px and at zoom overflow; truncation breaks at word boundaries only; provenance chips are icon + text (never color alone — 05 finding palette contracts); counts and shares in Western tabular figures; targets ≥24×24 (chips, pin toggles, filter chips).
- **S5 response reader**: virtualization preserves focus (P19); verbatim renders at its own direction with `dir="auto"` isolation on mixed-script rows (rtl-rules §2); detection markers listed as text (the rule's evidence, not a color glyph); tone lexicon hits are marked with icon + tooltip AND listed in the tone panel (redundant by construction).
- **S4 theme detail**: labels persist beside fields — never inside them (a11y-baseline §5); the bilingual pair renders as two labeled inputs (ar/en slots each at their own direction); confirm gate's excluded-members list is keyboard-traversable with reasons announced on focus.
- **S6 crosstab**: cells are count + share TEXT with tint redundancy (never heat-map-only); grid keyboard-navigable (P18); the overlap footnote is in the reading order (not a hover-only tooltip); "other"/"unspecified" buckets named in text.
- **S1/S2/S7/S8/S9/S10**: lists virtualize with focus preservation; intake preview rows focusable with per-row state; job progress honest-determinate; activity rows are definition-list grammar (actor-action-target-timestamp); consent state in capability language; no cognitive-function tests anywhere (3.3.8 — paste never blocked).
- **Reduced-motion (motion-language §5)**: crossfades → hard cuts; quote-card settle → instant with the polite announcement; "The Ink Sets" → border + seal render simultaneously with the full-summary announcement; board chip transitions → instant. All state changes remain perceivable by construction — the announcement schedule is the reduced-motion equivalent of every animated transition.

## RTL/LTR verification matrix (per surface, both workspace directions)

For each of S1–S10, both directions: pure-Arabic render · pure-English render · mixed strings (Latin tokens inside Arabic verbatims — seeded `resp-00189` "استلمت الطلب عبر Shippo والتغليف كان ممتاز" is the fixture) · numeral rendering under Western policy inside Arabic chrome · embedded Latin/numeric tokens in RTL · tables/grids mirrored (crosstab column order, reader list) with alignment rules held · forms (label-pair editor label/error placement on the correct inline edge) · truncation at 320px container with worst-case strings · 400% zoom reflow · bidi isolation on user-generated content (every verbatim is user-generated — the whole product is the mixed-content stress case). The bilingual label pair runs both directions by construction (each slot at its own direction, 05); pagination and step indicators mirror per rtl-rules §2 while counts and respondent refs keep physical order stable (rtl-rules §4 — numbers never re-order between directions). **Privacy note in the matrix**: respondent verbatims never appear in page titles or URLs (healthcare-class posture adopted voluntarily — survey respondents are data subjects; 09 carries it as a product rule).
