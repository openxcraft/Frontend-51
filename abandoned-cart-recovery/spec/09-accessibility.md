# 09 — Accessibility: abandoned-cart-recovery

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions, 1280px and 360px viewports, 200%/400% zoom. The product's structural a11y problem is also its identity: **a bilingual authoring surface whose two columns render at opposite script directions with alignment links between them** (P23), inside a clock-dense virtualized queue — solved below as the two-column focus contract and the clock-legibility contract (never color-only, never motion-only).

## Keyboard map (critical paths; no raw-letter shortcuts — Arabic-layout conflict class, a11y-baseline §3)

| Surface / path | Keys | Behavior |
|---|---|---|
| Global | ⌘K / Ctrl+K | Command palette: bilingual normalized search (rtl-rules §4 — the ruleset is disclosed in the panel) over carts (shopper handle, cart id, item names in either script), sequences, templates, jurisdiction rows, jump-to-state filters; recent items |
| S1 queue (CP-1.1, CP-1.4–5) | ↑/↓ · Enter · ⌘↓/⌘↑ · Space · / | Row traversal (P18; virtualized above 200 rows — focus moves scroll into view, never the reverse, P19); Enter opens the cart drawer; ⌘↓/⌘↑ jump to the next **needs-decision** row (failed dispatch / override candidate — 06); Space toggles row selection for the ActionBar (P07); / focuses search |
| S1 ActionBar | Tab · Enter · Escape | Batch actions scope to "N selected"; batch cancel requires the P04 level-2 confirm naming the count and remaining steps; Escape clears selection and returns focus to the last-selected row |
| S2 cart detail (CP-3) | Tab · ↑/↓ · Enter · Escape | Reading order: cart header → items table → shopper/consent block → priority sheet (components with their math) → CartTimeline → action bar. Timeline nodes traverse in listed order (newest first) with ↑/↓; each send node's full defer reason is its accessible description; actions (override / cancel / event / suppress) reach in one Tab ring from the timeline |
| S3 studio (CP-2.1–2, 8, 10–11) | Tab · ⌘S · Alt+↑/↓ · Enter | Step editor fields: delay → channel kind → template binding → incentive; blur validation per field, error summary on save focuses the first error (a11y-baseline §5); **step reordering: Alt+↑/↓ moves the focused step (the keyboard equivalent of drag, 2.5.7)** with the new order announced; ⌘S saves (fork banner announces on active-sequence edits); activation gate blockers traverse as links in listed order; the gate control itself must take focus — activation never fires from a dialog default |
| S4 template editor (CP-2.3, 6–7) | Tab · Escape · ⌘Enter | The two-column focus contract (below); Escape inside a column edit cancels and restores (P06); ⌘Enter submits the save from either column; variable chips are buttons that insert at the caret of the focused column |
| S4 generation dock (CP-2.4–5) | Tab · Enter · Escape | Request form (locale pair, tone, count) → run; while streaming, Stop and Regenerate are the first two stops in the dock's Tab ring; the promote action opens the DiffView with the review-confirm as its final focusable |
| S5/S6 policy editors (CP-4) | Tab · ⌘S · Enter | Field order: thresholds → band routes → incentive shape → code string (S5); jurisdiction → window start/end → source label (S6); blur validation; version-diff view reachable by keyboard; preview link (S6 → QuietClockTimeline) returns focus to its trigger on close |
| S7 send ledger (CP-3.1–3) | ↑/↓ · Enter · / | Virtualized row traversal; Enter opens the send detail (defer reason verbatim, policy-row version, error with retry path); filters render as removable chips (Delete removes the focused chip) |
| QuietClockTimeline (CP-2.10, CP-4.6) | ←/→ · Enter | Band-per-step rows traverse top to bottom; within a row, ←/→ move the focus marker across the 24h band (inline-end arrow = later in BOTH directions, rtl-rules §4); Enter on a defer arrow opens the deferral explanation (text, never arrow-only) |
| S9 report (CP-5.1) | Tab · ↑/↓ | Definition tables and funnel rows are focusable listitems in reading order; the recovery-rate row's denominator explanation opens on Enter |
| S10 jobs (CP-5.2) | ↑/↓ · Enter · Escape | JobRow states, cancel/retry actions; detail closes with focus return |
| S11 settings | Tab | Consent states in capability language; defaults (abandonment threshold, value normalizer) are standard fields |

Every shortcut has a visible button/menu equivalent; focus-visible is the Istijad Rosewood ring at 2.4.13 strength (≥2px, ≥3:1 change-contrast, ≥ area of a 2px outline) on every interactive element; sticky queue/ledger headers clear focused rows (2.4.11 — scroll-margin token obligation); modals/popovers trap-free with focus return (a11y-baseline §3); targets ≥24×24 CSS px including timeline nodes, chips, and meter marks (2.5.8).

## Focus-order contracts

**The two-column focus contract (S4, the P23 surface).** Reading order is: template header → alignment links → **EN column (LTR) → AR column (RTL) → shared controls** (variables, budgets, save) — in the workspace's active direction, while each column's CONTENT renders at its own script direction (05's direction model). Focus itself never splits: it moves through the regions in reading order, and the unfocused column is exposed as a labeled region (`aria-labelledby`: "Subject — English" / "الموضوع — العربية"). The alignment links between corresponding blocks announce "align with subject — English" and move focus to the corresponding block in the other column with a return-trip (Shift+Tab walks back); per-locale budget meters sit INSIDE their column's label so a screen-reader user hears the budget with the field it governs. The sync-state indicators (in-sync / edited-since / length-far-apart) are text+icon, never color-only, and are announced on column exit.

**The clock-legibility contract.** Every time in the product renders as `HH:MM` + named zone in Western tabular figures (05), physically ordered identically in both directions (rtl-rules §4 — 23:40 is 23:40 in either chrome). Send states are icon + text + color (06 SendStateChip); the QuietClockTimeline's window/quiet spans carry pattern differentiation + text labels ("send window 08:00–21:00 · quiet 21:00–08:00") — the clock is never color-only; deferral arrows carry their reason as accessible text, never as motion alone.

## Live-region announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Queue region entry | polite | "14 carts — 8 in recovery, 3 recovered, 2 expired, 1 suppressed" (row-count context, P19; derives from the state census, 07c) |
| Queue row focused | polite | rank + shopper + total + band + state + next send (with "deferred" when marked) |
| Deferral arrival (ledger update) | polite | "Send deferred — cart 002, step 1: due 23:40 America/New_York, deferred to 08:00" (motion accompanies, never replaces — 05) |
| Dispatch failure | **assertive** | "Dispatch failed for cart 012, step 1 — network error. Retry or export the send list." |
| Recovery moment ("The Cart Comes Back") | polite | "Cart 005 recovered — SAR 349.00. 3 of 14 carts recovered this window" (carries the full summary so reduced-motion users lose nothing — 05) |
| Opt-out landed | **assertive** | "Opt-out recorded — shopper Sarah Whitfield. 1 pending send stopped; future carts held at intake." |
| Override / cancel / suppression restore | polite | "Sequence overridden — cart 011 to High-value ladder. Reason recorded." |
| Gate refusal (activation) | **assertive** | "Activation refused — 1 rule failed: step 1 binds template t-007 which is not approved." |
| Gate cleared (activation) | polite | "Sequence active — version 3 serves new assignments; existing sends keep their pins." |
| Import/generation/export progress | polite | determinate units only ("Importing 9 of 14 carts" — never percentage-only, async-contract §3) |
| Stream start / completion (dock) | polite | "Generating 2 variants per locale…" / "4 variants ready — drafts only, review before promoting" (P13: start/end, never per-token) |
| Validation error (any editor) | **assertive** | field-linked message; error summary focuses the first error on submit (a11y-baseline §5) |
| Autosave state (P10) | polite | "Saving…" → "Saved" (fades after 3s); conflicts surface both versions |
| Streaming text tokens / decorative chart marks | never | per a11y-baseline §4 + P13 |

Live regions pair with visible equivalents — every announcement above has a visible surface (queue row, ledger row, toast, gate list, dock header) per a11y-baseline §4.

## Per-surface WCAG 2.2 AA checklist

- **S1 queue (the hard one)**: 400% zoom reflow with worst-case Arabic strings (shopper names — "عبدالله الغامدي", item names — "أكواب قهوة عربية بحواف ذهبية", rtl-rules §5's "مستشارو التدقيق والحوكمة" class) at 320px container; truncation breaks at word boundaries only (Arabic hyphenation does not exist); virtualization preserves focus (P19); mixed-script item names bidi-isolated (`dir="auto"` source, isolate marks at interpolation); selection checkboxes and chips ≥24×24; the deferral mark is icon + text (amber-deep text on canvas per 05 — 4.51:1, and amber-deep never body-size on tint).
- **S2 cart detail**: timeline nodes keyboard-traversable in listed order with return-trip; the recovered node's seal is text + glyph (total stated); priority sheet renders the components AND the weighted sum (a number without its math fails CP-1.4's contract); consent basis and jurisdiction are text, never color-coded alone.
- **S3 studio**: drag reorder ships the Alt+↑/↓ equivalent (2.5.7); activation blockers are links, in listed order, each naming its rule; the fork banner announces on save; step fields blur-validate with inline linked messages.
- **S4 template editor + dock**: the two-column focus contract (above); per-locale length meters are text+bar, never bar-only; variable validation errors name the variable and column; the DiffView (P16) renders direction-aware with insert/delete marks meeting text contrast; the dock's reserved region keeps CLS ≤0.02 (10) so streaming never relocates a focused control; promote requires the explicit review-confirm focus stop (P15).
- **S5/S6 policy editors**: labels persist beside fields — never ghost text inside them (a11y-baseline §5); threshold inversion errors name both numbers; the midnight-crossing circle diagram carries the rule as text ("sendable iff t ≥ 21:00 or t < 03:00" — 06); source labels (statutory anchor / workspace policy) are text chips with the citation linked.
- **S7 send ledger**: virtualized (P19); defer reasons verbatim; failed rows expose the retry/export path as real controls; jurisdiction and policy-row versions render as text with the Hijri cross-reference on KSA rows (P24 — display-only, method disclosed).
- **S8 suppressions**: restore requires the note field (programmatic required); the restore link from a suppression-named VALIDATION (CP-3 failure row) is a real navigation, not a dead reference.
- **S9 report**: definition tables with Western tabular figures; recovery-rate denominator stated as text; no plot exists without its stats table beside it (05 chart rule); export buttons name their formats.
- **S10 jobs / S11 settings**: honest determinate progress; consent state in capability language; no cognitive-function tests anywhere (3.3.8 — paste is never blocked).

## RTL/LTR verification matrix (per surface, both workspace directions)

For each of S1–S11, both directions: pure-Arabic render · pure-English render · mixed strings (Latin handles inside Arabic chrome — the seeded shopper set is the fixture set) · numeral rendering under the Western policy inside Arabic chrome (totals, times, counts — never mixed systems mid-sentence, copy-voice §1.7) · embedded Latin/numeric tokens in RTL ({{checkout_url}} and SAR amounts inside AR template bodies — bidi-isolated at preview) · tables/grids mirrored (queue, ledger, funnel) with alignment rules held · forms (step editor, policy rows — label/error placement on the correct inline edge) · truncation at 320px with worst-case strings · 400% zoom reflow · bidi isolation on user-generated content (shopper names, item names). The template editor runs the full matrix in BOTH column orders (EN-start and AR-start): the workspace direction sets the columns' arrangement; each column's script direction never changes — the two-fact separation is the P23 contract and the fixture for every mixed-direction moment in 11.

## Reduced-motion contract (motion-language §5)

Crossfades → hard cuts; queue rows settle in place instantly (nothing ever spins in); the deferred badge's 160ms amber settle → instant render WITH the polite announcement (the announcement is the reduced-motion carrier — 05); "The Cart Comes Back" → the seal renders instantly, the recovered counter jumps (no count-up), and the announcement carries the full summary ("Cart 005 recovered — SAR 349.00. 3 of 14 carts recovered this window"); the single controlled overshoot (≤8%) collapses to the state chip; streaming text renders in paragraph chunks with per-chunk polite announcements; staggered gate-clearing renders simultaneously. All state changes remain perceivable by construction — the announcement schedule is the reduced-motion equivalent of every animated transition, and the release matrix (a11y-baseline §8) runs every benchmark with reduced-motion enabled (10).
