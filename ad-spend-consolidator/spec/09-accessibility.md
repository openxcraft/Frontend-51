# 09 — Accessibility: ad-spend-consolidator

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions, 1280px and 360px viewports, 200%/400% zoom. The product's structural a11y problems are its identity: **a data-dense timeline with calendar bands** (chart accessibility) and **money tables whose meaning cannot ride on color** (variance/finding states) — both solved below as text-first contracts.

## Keyboard map (critical paths; no raw-letter shortcuts — Arabic-layout conflict class, a11y-baseline §3)

| Surface / path | Keys | Behavior |
|---|---|---|
| Global | ⌘K / Ctrl+K | Command palette: bilingual normalized search (rtl-rules §4) over snapshots, channels, line-item keys, moments, budget lines; recent items; jump-to-day within an open timeline |
| S1 dashboard | ←/→ · Enter · B · V | ←/→ move day-to-day on the timeline (physical mapping stable in both directions — inline-end arrow = next day in RTL, rtl-rules §4); Enter opens the day detail (channel split); B focuses the breakdown table; V reads the snapshot version chip aloud (name + health, 06) |
| S1 breakdown table (CP-2.3) | ↑/↓ · Tab · R · Space | Row traversal (P18); Tab enters the row's receipt expanders in order; R expands/collapses the focused row's receipts; Space toggles bulk-selection for bulk resolution (P07) |
| S1 timeline bands | Tab · Enter | Bands are focusable regions in DOM order (chronological, mirrored in RTL); Enter opens the band's comparison (CP-4); focus ring at 2.4.13 strength on the band boundary |
| S2 reconciliation (CP-3) | ↑/↓ · Tab · K | Finding traversal; Tab walks pair panel A → match evidence → pair panel B → resolution actions; K cycles keep-first / split / both-counted within the action group; reason field is required and receives focus on submit failure (a11y-baseline §5) |
| S3 line-item browser | ↑/↓ · / · Enter | Virtualized traversal (P19 — focus moves scroll into view, never the reverse); / focuses search; Enter opens the row's receipt detail |
| S4 snapshots & revisions | ↑/↓ · Enter · D | Version list traversal; Enter switches the read to that version; D opens the revision delta table (arrow-key cell traversal per P18) |
| S5 moment editor (CP-4.5) | Tab · ⌘S · ⌘Enter | Field order: nameEn → nameAr (alignment link jumps between them, P23) → kind → anchor fields → length → scope → status; blur validation per field; ⌘S saves; occurrence preview refreshes on anchor commit |
| S6 comparison view | ←/→ · C | ←/→ move window-to-window (this occurrence / prior occurrence / control); C reads the full comparison summary (lift ratio, delta, excluded days) as one announcement |
| S7 budgets & pacing | ↑/↓ · Enter | Budget line traversal; Enter opens the pacing detail (meter value announced as text+state, never bar-only) |
| S8 connections (CP-1) | ↑/↓ · Enter · ⌘Enter | Connection rows; Enter opens the policy editor; ⌘Enter runs verify on the focused connection |
| Modals/popovers | Tab · Escape | Trap-free with focus return to trigger (a11y-baseline §3); Escape cancels policy/moment/budget edits and restores (P10 conflict surfaces both versions) |

Every shortcut has a visible button/menu equivalent; focus-visible is the Sarf Blue ring (#5073B5 on paper at 4.31:1 — UI-component-safe ≥3:1) at 2.4.13 strength (≥2px, ≥3:1 change-contrast, ≥ area of a 2px outline) on every interactive element; sticky table headers and the timeline's fixed day gutter clear focused rows (2.4.11 — scroll-margin token obligation).

## Focus order & the chart-as-list contract

Reading order is: rail → snapshot version chip → period total → timeline → breakdown table → pace strip — in the workspace's active direction, mirrored in RTL (rtl-rules §2). **The timeline is a virtualized list to assistive tech, never a bare image**: each day row carries an accessible name ("17 October 2026, SAR 96,412, inside no overlay window" / "١٧ أكتوبر ٢٠٢٦…" under Arabic chrome with Western numerals per ledger row); band regions are focusable group landmarks with their occurrence labels; series values are exposed on day focus, not hidden in an SVG. The breakdown and line-item tables follow P18 grid semantics; the reconciliation pair renders as two labeled panels with a match-evidence region between them, announced as one unit on entry ("Overlap finding: external key mk-wf26-prep, 30 September days, delta SAR 250, within 2 percent").

## Live-region announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Timeline region entry | polite | "780 days, 5 channels, 2 overlay windows in view" (row-count context, P19) |
| Day focus | polite | date + total + band membership |
| Consolidation progress (job) | polite | determinate units only ("Normalizing 340 of 780 line items") — never percentage-only (async-contract §3) |
| Consolidation complete — "The Total Stamps" | polite | "Consolidation complete — SAR 10.6 million for the window, 5 channels, 1 open overlap. Snapshot version 4." (carries the full summary when the signature settle is reduced-motion-disabled) |
| Overlap finding arrives (recompute) | polite | "1 new overlap candidate — external key mk-wf26-prep, within epsilon" |
| Resolution recorded | polite | "Resolved keep-first — marketplace is the channel of record; your reason is in the ledger" |
| Rate-unavailable day encountered | assertive | "17 August 2025 has no declared AED rate — its spend is excluded from ratios and named in the report" (an honest gap in the number the user is reading) |
| Pacing state change (threshold cross) | polite | "White Friday 2026 is over-pace — 19 percent above the linear line" |
| Revision delta ready | polite | "Revision folded — version 4 differs from version 3 by −SAR 1,560" |
| Validation error (editors) | assertive | field-linked message; error summary focuses the first error on submit (a11y-baseline §5) |
| Gate-refusal-class errors (export/consolidation refusal) | assertive | names the blocker and the next action (11 §C) |
| Decorative band fills, chart grid lines | never | visual only; the band's information is its label + boundary token |

Live regions pair with visible equivalents — every announcement above has a visible surface (version chip, finding row, toast, delta table) per a11y-baseline §4.

## Per-surface WCAG 2.2 AA checklist

- **S1 dashboard (the hard one)**: 400% zoom reflow with worst-case Arabic strings ("مستشارو التدقيق والحوكمة" — rtl-rules §5) in band labels and moment names; timeline reflows to a day-list below 768px (the chart degrades to the same accessible list it always was to AT); truncation breaks at word boundaries only; band boundary is a ≥3:1 non-text step (gold-deep on paper 5.52:1); variance and finding states are icon+text+color, never color alone (05 semantic palette); amounts in tabular figures with stable physical order in both directions (rtl-rules §4); targets ≥24×24 (band labels, receipt expanders, chips).
- **S2/S3 reconciliation & line items**: pair panels reflow to stacked below 820px, each keeping its own data direction; mixed-script campaign names and external keys bidi-isolated (dir="auto", isolate marks); match-evidence figures announced with the panel; resolution reason field programmatically required (a11y-baseline §5).
- **S4 snapshots & revisions**: delta tables render as definition tables with Western tabular figures; superseded states carry text markers; revision chains keyboard-traversable.
- **S5/S6 moments & comparisons**: name fields persist beside inputs — never inside them as ghost text (a11y-baseline §5); occurrence previews announce on anchor commit; method disclosure (Umm al-Qura presentation) is a focusable popover, not hover-only; the Gregorian-lookalike refusal is text that explains itself (03 CP-4.4).
- **S7 budgets & pacing**: meter value text+bar never bar-only; partial-coverage states in text; closed-line amendment history keyboard-navigable.
- **S8 connections**: credential states displayed in capability language, masked by construction (credential-contract §2); verify evidence is text, not a color lamp alone.
- **S9 policy & FX**: rate table discloses provenance in text; epsilon/threshold inputs validate on blur with linked messages.
- **S10 exports/jobs, S11 settings**: JobRow states + cancel/retry keyboard-complete; honest determinate progress; consent state in capability language; no cognitive-function tests anywhere (3.3.8 — paste never blocked).

## RTL/LTR verification matrix (per surface, both workspace directions)

For each of S1–S11, both directions: pure-Arabic render · pure-English render · mixed strings (Latin campaign names and currency codes inside Arabic chrome — seeded `mk-wf26-prep` / `WF26-Prep-MKT` are the fixtures) · numeral rendering under the Western policy inside Arabic chrome · embedded Latin/numeric tokens in RTL (SAR/AED/USD codes, external keys) · tables and grids mirrored (breakdown, line items, delta tables) with alignment rules held · charts mirrored (timeline category axis right-to-left, value axis inline-end — rtl-rules §2) with day order mirroring and numbers keeping physical order (rtl-rules §4) · forms (moment editor label/error placement on the correct inline edge) · truncation at 320px container with worst-case strings · 400% zoom reflow · bidi isolation on user-generated content (campaign names arrive from channels — dir="auto" everywhere they render). The moment library's Arabic names (الجمعة البيضاء، الجمعة الصفراء، عيد الفطر) are the band-label test set; the ⌘K palette exercises normalized Arabic search in both directions.

## Reduced-motion contract (motion-language §5)

Crossfades → hard cuts; "The Total Stamps" settle → instant render + the full-summary announcement; band-label arrives → instant with the polite day-focus announcement carrying band membership; receipt expanders → instant height change; finding chips arrive/dissolve → instant with the live-region text. All state changes remain perceivable by construction — the announcement schedule is the reduced-motion equivalent of every animated transition, and the timeline's day-list degradation is identical in both motion modes.
