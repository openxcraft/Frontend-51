# 09 — Accessibility: store-performance-scorecard

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5 — the seed's longest joined store names: "زاد الطازج — مركز المملكة" and chain name "متاجر زاد الطازجة" class) for truncation/reflow.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search — alef/hamza variants, taa marbuta/heh, yaa forms, tashkeel stripped); ? opens shortcut help; skip-link to main content; Tab order follows visual reading order per direction; focus ring = citron-deep #966711, ≥2px, 4.52:1 on canvas, with 2.4.11 scroll-margin so the sticky basis band and table headers never cover it; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class, a11y-baseline §3); every shortcut has a visible button/menu equivalent.
- **CP-1 (S5 store register, S6 importer, S7 patterns)**: store table = P18 grid (↑/↓ rows, ←/→ columns, physical mapping stable in both directions per rtl-rules §4); Space toggles row selection (P07 bulk); Enter opens the store's detail; the pattern editor walks shift rows with Tab and edits time inputs with typed values (no drag anywhere in it); ⌘V lands focus in the paste field from anywhere in the import dialog; Esc closes dialogs returning focus to the trigger (trap-free).
- **CP-2 (S2 ranked board)**: P18 grid — ↑/↓ move store rows, ←/→ move KPI columns; row focus lifts the soft-lift step (visible ≥2px ring remains the indicator — motion never replaces it); Enter drills the focused store (S3); F opens the flags rail filtered to that store; A opens the annotation composer on the focused store; C jumps to the composition bar; D opens the definitions panel scrolled to the focused KPI's formula.
- **CP-3 (S4 shift lens)**: matrix is a semantic table — arrow navigation moves cells with row (store) and column (shift class) headers re-announced; M cycles the KPI selector (re-render ≤150ms with a polite announcement of the new KPI's name and unit); Enter on a cell drills the store's raw rows filtered to that class (S6); "no trading" cells are focusable and read their text.
- **CP-4 (S7 policy)**: policy surfaces are forms — labels persist above fields (a11y-baseline §5), radio groups (Method 1/2) with visible labels, version compare via DiffView (P16) reachable with V; season-window authoring is keyboard-complete (date inputs, select, text).
- **CP-5 (S6 data)**: record table = P18 grid, virtualized >200 rows with focus preservation (P19) and row-count context on region entry; the importer's preview table is keyboard-navigable; unknown-store offer is a menu (create / fix code / skip row), not a mouse-only affordance.
- **CP-6 (S8 jobs)**: standard list navigation; Enter opens job detail with link-to-context.

## Focus order rationale

Per surface, focus follows the analytical reading order: basis band (window → basis → peer group) → content region → actions inline-end. In RTL the order mirrors. The ranked board's row-then-column order matches the visual scan (store identity before numbers); the shift lens navigates store-row-major so a screen-reader user hears one store's whole day before moving on — never interleaved cells (comparison semantics preserved for SR users, the seo-brief-builder parity precedent applied).

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Import progress (job) | polite | rows done of total, named week |
| Channel fetch progress | polite | store milestones ("store 2 of 12") |
| Scorecard run complete | polite | ranked store count + basis + top/attention store names |
| KPI switch on shift lens | polite | KPI name + unit + "grid re-rendered" |
| Rank change on re-run | polite | moved count ("3 stores changed rank — 1 entered attention band") |
| Composition flag present | polite (on focus) | current/prior shares in text with season names |
| Validation errors (import rows, empty comp set, basis gates) | assertive | row/field-linked via described association |
| Coverage gap found | polite | store + gap count, linked to S6 |
| Artifact ready / expired | polite | format + expiry window |
| Autosave cycle (pattern/policy editors) | polite | saving → saved (fade) |

Decorative layout shifts, cell tint recolors, and row soft-lift hovers are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces — a11y-baseline §4).

## Per-surface WCAG 2.2 AA checklist

- **S2 RankedBoard**: every delta is glyph + signed text + tint (never color alone); comp badges carry text reasons (CompBadge); sticky header honors 2.4.11; targets ≥24×24 (2.5.8); >200 rows virtualize with focus preservation (P19); row-count context on region entry; 400% reflow — rows collapse to cards at 360px; numerals Western, tabular, inline-end alignment mirrored in RTL.
- **S4 ShiftLensGrid**: numbers ALWAYS in cells (charts contract — tints never sole carrier); "no trading" cells are text, focusable; matched-capability caution line is text; diverging tints carry pattern-overlay variants for colorblind users (charts.csv contract).
- **S1/S3 KpiTile**: ink-on-citron 6.69:1 (05 contract); full value in accessible text (the display figure is presentation); caution states text+icon.
- **S7 DefinitionsPanel**: formulas are text + inline tokens, SR-readable; version diff uses P16 grammar; no information lives only in color.
- **S6 tables**: mixed-script store names bidi-isolated (`dir="auto"` on inputs, isolate marks on interpolations — rtl-rules §2); truncation at word boundaries (no hyphenation exists — rtl-rules §4).
- **Forms (store create, pattern editor, policy)**: labels persist above fields (ghost text never the label — a11y-baseline §5); on-blur-or-submit validation with field-linked messages; error summary focuses the first error; paste is never blocked (3.3.8).
- **Overlays (dialogs, palette)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (store names, pattern labels, season names in ar locale) · pure-English render · mixed strings (Arabic store name inside en chrome; Latin record keys inside ar chrome — bidi isolation proves out) · numeral rendering under Western policy (scores, deltas, SAR amounts, ISO week codes — the value axis on the inline-end, mirrored) · embedded Latin tokens in RTL and Arabic tokens in LTR (isolating containers) · tables/grids column order mirrored with alignment rules held (rank column stays inline-start; numerals inline-end) · charts (per-KPI mini bars run inline-start→inline-end in both directions; composition bar segments read start-to-end per direction) · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with the worst-case joined names above · 400% zoom reflow in one dimension · bidi isolation on all user-generated strings (annotations, store names). The seeded fixtures (RYD-01's bilingual name, the ar-first annotations, the chain name) are the regression set; both directions run at 200% and 400% on 1280px and 360px viewports per a11y-baseline §8.

## Reduced-motion contract (motion-language §5)

All animated state changes keep a perceivable non-motion equivalent: the energetic success overshoot (run complete, artifact ready) collapses to a state chip + polite announcement; row soft-lift hovers become border-step changes; the shift-lens ≤150ms re-render becomes an instant swap + announcement; staggered board settles render simultaneously; page transitions become hard cuts. The release matrix (a11y-baseline §8.6) repeats the keyboard and SR passes with reduced-motion enabled.
