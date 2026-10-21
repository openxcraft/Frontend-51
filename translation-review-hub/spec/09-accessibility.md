# 09 — Accessibility: translation-review-hub

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions, 1280px and 360px viewports, 200%/400% zoom. The product's structural a11y problem is also its identity: **opposite-direction panes with synchronized focus** — solved below as the dual-pane focus contract.

## Keyboard map (critical paths; no raw-letter shortcuts — Arabic-layout conflict class, a11y-baseline §3)

| Surface / path | Keys | Behavior |
|---|---|---|
| Global | ⌘K / Ctrl+K | Command palette: bilingual normalized search (rtl-rules §4) over jobs, documents, glossaries, term entries; jump-to-segment-number in an open document; recent items |
| S1 jobs home | ↑/↓ · Enter · / | Row traversal (P18); open job; focus search. Filter chips removable with Delete |
| S3 navigator (CP-2.1–2) | ↑/↓ · Enter · ⌘↓ / ⌘↑ · Space | Row traversal (virtualized — focus moves scroll into view, never the reverse, P19); Enter focuses the pair view; ⌘↓/⌘↑ jump to next **unreviewed-or-flagged** segment; Space toggles bulk-selection on a row (P07) |
| S3 pair view | Tab · Escape · ⌘Enter | Tab order: pair header → source pane → findings rail → target pane → decision bar (reading order; the rail sits between panes so its links precede the editable target). Escape inside target edit cancels and restores (P06, focus returns to the edit trigger). ⌘Enter approves and advances |
| S3 target edit | Tab · Escape | Tab commits and advances to decision bar; arrow keys follow the caret per script (rtl-rules §4) |
| Findings rail (CP-2.3–5) | ↑/↓ · Enter · Menu | Finding rows focusable; Enter opens the resolution menu (edit / override-with-reason / false-positive / acknowledge); chip anchors and sibling links jump with return-trip |
| Glossary editor (CP-4) | Tab · ⌘S · ⌘Enter | Field order source→target→mandate→severity→note; blur validation (skill row 56); save from any field; Escape cancels the row edit |
| Sign-off gate (CP-5) | Tab · Enter · ⌘⇧S | Blocker links traverse in listed order; Enter follows a blocker to its segment; sign-off requires focus on the sign-off control itself (never fires from a dialog default) |

Every shortcut has a visible button/menu equivalent; focus-visible is the Jisr Teal ring at 2.4.13 strength (≥2px, ≥3:1 change-contrast, ≥ area of 2px outline) on every interactive element; sticky navigator header clears focused rows (2.4.11 — scroll-margin token obligation). Modals/popovers trap-free with focus return (a11y-baseline §3).

## Focus order & the dual-pane focus synchronization contract

Reading order is: navigator → pair header → **source pane → findings rail → target pane** → decision bar — in the workspace's active direction, while **each pane's CONTENT renders at its own locale direction** (pane-direction contract, 05). When focus enters the pair view, both panes' headers receive the pair announcement (segment number + decision state) so a screen-reader user hears the referent before either text; focus itself never splits — it moves through the six regions in reading order, and the unfocused pane's content is exposed as a labeled region (`aria-labelledby` per pane: "Source — English" / "الهدف — العربية"). In the ar→en job direction the region order mirrors (RTL reading order puts the rail inline-start of the target pane); the contract is direction-symmetric and the verification matrix exercises both. Sibling links (consistency findings) announce "segment 31" and move focus to that pair's header — a single focus target per pair, never one per pane.

## Live-region announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Navigator region entry | polite | "220 segment pairs, 6 critical findings open" (row-count context, P19) |
| Pair focused | polite | segment number + decision state + finding count |
| Finding arrives (recompute after edit) | polite | "Term check passed — 1 violation remains on this segment" |
| Finding dissolved (edit-resolved) | polite | "Violation resolved by edit" |
| Decision set | polite | "Segment 47 approved — 12 of 220 reviewed" |
| Query answered | polite | "Sarah answered the query on segment 88" |
| Gate refusal (sign-off attempt) | **assertive** | "Sign-off refused — 3 critical findings and 1 unreviewed segment block it. First blocker: segment 47" |
| Gate cleared (sign-off success) | polite | "Signed off by Rana — 220 segments, 6 overrides with reasons, 1 acknowledged overflow" (carries the full summary when the T2 signature animation is reduced-motion-disabled) |
| Import/scan/export progress | polite | determinate units only ("Importing 120 of 220 segment pairs") — never percentage-only (async-contract §3) |
| Validation error (glossary/term editor) | assertive | field-linked message; error summary focuses first error on submit (a11y-baseline §5) |
| Finding chip cluster overflow | never (visual only) | the "+N more" control is the accessible path; chips themselves are focusable when rendered |

Live regions pair with visible equivalents — every announcement above has a visible surface (rail row, navigator state, gate list, toast) per a11y-baseline §4.

## Per-surface WCAG 2.2 AA checklist

- **S3 review workspace (the hard one)**: 400% zoom reflow with worst-case Arabic strings ("مستشارو التدقيق والحوكمة" — rtl-rules §5) in the target pane; panes stack below 768px and at zoom overflow, each keeping its own direction; truncation breaks at word boundaries only; mixed-script segments bidi-isolated (`dir="auto"` on edits, isolate marks on interpolations); targets ≥24×24 (chips, meter marks); length meter is text+bar, never bar-only; TermFlagChips carry severity + mandated term as text, never color alone (05 finding palette contracts).
- **S1/S2/S4 lists & reports**: virtualization preserves focus (P19); QaScoreboard renders as definition tables with Western tabular figures; filtered states declare themselves (P08); four empties distinct per P01 (11).
- **S5/S6 glossaries**: labels persist beside fields — never inside them as ghost text (a11y-baseline §5); term previews bidi-isolated for mixed-script entries; delete confirm names the entry + open-finding count (P04); search normalization ruleset disclosed in-panel.
- **S7 sign-off & export**: blocker links keyboard-traversable; the signature moment ("The Gate Clears") is success-only and its information is fully redundant with the announcement + state chip (motion-language §2/§5); export artifacts' expiry is stated in text.
- **S8 jobs console**: JobRow states + cancel/retry keyboard-complete; progress honest-determinate.
- **S9 settings**: consent state displayed in capability language; no cognitive-function tests anywhere (3.3.8 — paste never blocked).

## RTL/LTR verification matrix (per surface, both workspace directions, both job directions)

For each of S1–S9, both directions: pure-Arabic render · pure-English render · mixed strings (Latin brand terms inside Arabic targets — seeded `seg-0113` is the fixture) · numeral rendering under Western policy inside Arabic chrome · embedded Latin/numeric tokens in RTL · tables/grids mirrored (glossary, findings console) with alignment rules held · forms (term editor label/error placement on the correct inline edge) · truncation at 320px container with worst-case strings · 400% zoom reflow · bidi isolation on user-generated content. **Job-direction fixtures run both ways**: en→ar (`rj-001`) and ar→en (`rj-002`) exercises the pane contract mirrored (07c seeds are the test set); navigator pagination and step indicators mirror per rtl-rules §2 while segment numbers keep physical order stable (rtl-rules §4 — numbers never re-order between directions).

## Reduced-motion contract (motion-language §5)

Crossfades → hard cuts; finding chip arrive/dissolve → instant with the polite announcements above; "The Gate Clears" stagger → simultaneous render + full-summary announcement; navigator settle → instant. All state changes remain perceivable by construction — the announcement schedule is the reduced-motion equivalent of every animated transition.
