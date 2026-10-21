# 09 — Accessibility: sales-cohort-view

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: "مستشارو التدقيق والحوكمة" class) for truncation/reflow — season labels authored in Arabic are the standing worst case (e.g. "الجمعة البيضاء — موجة الشراء الممتدة ٢٠٢٥" class lengths).

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search over views/windows/comparisons/actions); ? opens shortcut help; skip-link to main content; Tab order follows visual reading order per direction; focus ring = Ujra Marine ≥2px at **3.33:1** change-contrast on canvas (2.4.13 area contract), scroll-margin so the sticky period header and rail never cover it (2.4.11); every shortcut has a visible button/menu equivalent. Grid-context single-key shortcuts are bound by physical key position (event.code — KeyM, KeyS…), so Arabic keyboard layouts keep the physical mapping stable (rtl-rules §4); this is declared per a11y-baseline §3's layout-conflict note rather than avoided, because a one-key metric switch on a speed surface is the CP-2 value.
- **CP-1/S1 grid**: ↑/↓ move cohort rows, ←/→ move period cells (physical mapping stable in both directions); Enter opens cohort detail from the focused row; M cycles the metric switcher (radio semantics, announced); S toggles the season overlay (the signature settle + polite announcement); Home/End jump first/last period.
- **CP-2/S2–S3 drill**: from a focused cell, D opens the customer drill (period-scoped); the drill table is a P18 grid (arrows, range selection via Shift+arrows for export membership); Esc returns focus to the originating cell (trap-free return).
- **CP-3/S4 calendar**: Tab walks windows then phases; Enter opens a window for edit; O invokes overlap resolution when the validator flags it; ⌘↑/⌘↓ reorder phases (drag alternative, 2.5.7); autosave status is a live region, never focus-stealing (P10).
- **CP-4/S5 comparison**: C stages the comparison between the last two focused cohorts (visible focus check — the two cohort rows render selected state in text); ←/→ move period-aligned rows; the delta column is read as text ("plus 4.0 points, denominators 214 and 178").
- **CP-5/S8–S9 admin**: standard list navigation; Enter opens job detail with link-to-context; every job action (cancel/retry) is a visible button.

## Focus order rationale

Per surface, focus follows the analytical reading order: grid header controls (metric switcher, overlay toggle, market/granularity) → the grid itself (rows inline-start column → periods inline-end) → disclosure surfaces (composition sentence, freshness chip) → actions. In RTL the entire order mirrors, period columns flowing right-to-left with the value scale on the inline-end (rtl-rules §2 chart rule applied to tabular time); the season rail mirrors with the time axis (phase stripes flow inline-start→inline-end); the drill breadcrumb mirrors; numerals inside cells remain Western and read LTR inside their cells with bidi isolation.

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Grid compute complete | polite | cohorts count, periods count, coverage clamp if any, in-progress period named |
| Metric switch (M) | polite | metric name + its denominator sentence ("repeat purchase rate — share of the cohort's size active in the period") |
| Season overlay toggle (S) | polite | "Season overlay on — 12 windows on the acquisition axis" / off |
| Cell focus move | polite (throttled) | cohort label, period index, value with denominator ("Ramadan 1447 — peak, period 6, repeat purchase 11.0%, of 214") |
| Suppression encountered on focus | polite | "count only — 8 customers, below the 10 threshold for rates" |
| Comparison staged/ready | polite | both cohort labels, alignment mode, shared complete periods |
| Source freshness change | NEVER announced (state, not news — chip only; the funnel-drop-off-explorer posture, shared as a family discipline) |
| Validation errors (window dates, sample rows, comparison requests) | assertive | field/row-linked via described association |
| Export ready / artifact expired | polite | format + expiry window |
| Autosave cycle (calendar editor) | polite | saving → saved (fade) |

Decorative layout shifts, cell recolors, and the season-band settle are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces — the composition sentence IS the overlay's non-motion equivalent, 05 motion contract).

## Per-surface WCAG 2.2 AA checklist

- **S1 CohortGrid**: semantic table with row headers (cohort labels) and column headers (period labels) announced on navigation; sticky acquisition column and period header never obscure focus (2.4.11); cells drill on Enter with focus return; virtualized >60 rows with focus preservation (P19) and row-count context on region entry; values are tabular Western figures at inline-end alignment mirrored in RTL; suppression/caution/in-progress states are icon+text (never color-only); heatmap tint layer always number-bearing (charts.csv contract — a tinted cell without its value in text is a defect); targets ≥24×24 (2.5.8); 400% reflow — the grid collapses to cohort cards with period lists at 360px (ux-guidelines table-handling adoption).
- **SeasonRail**: navigable as a list (G jumps next window); drift ticks carry accessible names ("dates may shift by one day — moon sighting"); phase stripes have text labels in the rail legend; the band tint is decorative with structure carried by borders/chips/labels (05 contract).
- **S2 CohortDetail / S3 drill**: mixed-script labels bidi-isolated (`dir="auto"`); missing source labels render key-only with the stated reason; read-only surface (no mutation affordances to trap on); breadcrumb context preserved.
- **S4 SeasonWindowEditor**: labels persist above fields (ghost text is never the label — a11y-baseline §5); dual-calendar inputs with the active system explicit and hover cross-reference (P24); on-blur-or-submit validation with field-linked messages and error summary focusing the first error; overlap warning names both windows and the day count in text.
- **S5 ComparisonDuel**: delta stated in text in every row; both composition sentences render inside the duel; truncation note is text ("comparison shows 6 shared complete periods"); size-imbalance note is text; no animated race (the aligned-duel grammar, 06).
- **Forms (sample import paste, view save)**: paste is never blocked (3.3.8); no cognitive-function tests; required is programmatic.
- **Overlays (palette, dialogs)**: focus trap + return to trigger (a11y-baseline §3); palette results grouped and keyboard-selectable (P05).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (season labels, composition sentences under locale flip) · pure-English render · mixed strings (Arabic season label inside English chrome; Latin customer key inside Arabic-rendered drill — bidi isolation proves out) · numeral rendering under Western policy (cells, dates, percentages — never mixed systems mid-sentence, copy-voice §1.7) · embedded Latin tokens in RTL and Arabic tokens in LTR (isolating containers) · tables/grids column order mirrored with alignment rules held (period axis inline-start→inline-end in RTL; sticky column flips) · season rail time-axis mirroring with phase order · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word season labels (word-boundary ellipsis, no hyphenation exists — rtl-rules §4) · 400% zoom reflow in one dimension · bidi isolation on all source-provided strings (customer labels, channel values). Seeded fixtures (07c: the Arabic-labeled saved view V2, label-missing customer keys, the Arabic-authored overlap window) are the regression set.

## Reduced-motion contract

The season-overlay settle (the one signature micro-interaction) collapses to an instant band + chip render with the same polite announcement — identical perceivability (motion-language §5). Metric switches render values instantly (crossfade removed). Route changes are hard cuts. No state change in the product carries information by motion alone: cell focus uses the ring, suppression uses icon+text, the overlay uses the composition sentence. The release matrix (a11y-baseline §8.6) re-runs every CP with reduced-motion enabled at identical budgets (10).
