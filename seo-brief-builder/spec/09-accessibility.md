# 09 — Accessibility: seo-brief-builder

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: "مستشارو التدقيق والحوكمة" class) for truncation/reflow.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search); ? opens shortcut help; skip-link to main content (ux-guidelines row 45); Tab order follows visual reading order per direction; focus ring = Marsad Violet ≥2px, 4.61:1 on canvas, 2.4.11 scroll-margin so sticky headers never cover it; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class, a11y-baseline §3); every shortcut has a visible button/menu equivalent.
- **CP-1 (S2 keyword table)**: P18 grid — ↑/↓ move rows, ←/→ move columns (physical mapping stable in both directions, rtl-rules §4); Space toggles row selection (P07 bulk); Enter opens the normalization panel for the focused row; ⌘V focus lands in the paste field from anywhere in the ingest dialog; Esc closes dialogs returning focus to trigger (trap-free).
- **CP-2 (S3 cluster canvas)**: Tab walks cluster cards in reading order, then member keywords; M opens the move-to-cluster menu on a focused keyword (drag alternative, 2.5.7); I opens IntentSelector (radio group semantics, ↑/↓ + Space); C confirms the suggested intent on the focused cluster; R re-runs clustering (confirm dialog names kept-vs-discarded edits, P04).
- **CP-3 (S4 parity matrix)**: matrix is a semantic table — arrow navigation moves cells with row/column headers re-announced; G jumps to the next open gap row; Resolve / Accept actions are buttons on the focused gap row (visible focus, ≥24px targets, 2.5.8).
- **CP-4 (S5 brief editor)**: ⌘↑/⌘↓ reorder the focused section (drag alternative, 2.5.7); E edits section text inline (P06 — Esc restores, Tab commits+advances); B binds/unbinds clusters via menu; autosave status is a live region, never focus-stealing.
- **CP-5 (S7 jobs)**: standard list navigation; Enter opens job detail with link-to-context.

## Focus order rationale

Per surface, focus follows the analytical reading order: locale tabs → content region → actions inline-end. In RTL the order mirrors; the parity view's two locale columns are navigated ar-column-then-en-column in LTR chrome and mirrored in RTL chrome — never interleaved (comparison semantics preserved for SR users).

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Ingest progress (job) | polite | rows done of total, named topic + locale |
| Clustering run started/done | polite | mode (assist/deterministic), cluster count |
| Assist suggestion appears | polite | "Suggestion: split تصميم متجر إلكتروني into its own cluster — confirm or dismiss" (never auto-applied, P15) |
| Intent confirmed | polite | cluster name + intent label (text, not color) |
| Parity result ready | polite | matched pairs + open gaps count |
| Gap resolved / accepted | polite | gap name + outcome |
| Validation errors (ingest bad row, parity gate) | assertive | field/row-linked via described association |
| Export ready / artifact expired | polite | format + expiry window |
| Autosave cycle | polite | saving → saved (fade) |

Decorative layout shifts, matrix cell recolors, and cluster settle motion are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces — a11y-baseline §4).

## Per-surface WCAG 2.2 AA checklist

- **S2 KeywordTable**: mixed-script rows bidi-isolated (`dir="auto"` on inputs, isolate marks on interpolations — rtl-rules §2); normalized-form panel keyboard-reachable; volume/cost cells Western numerals, right-aligned numerals mirrored to inline-end alignment; >200 rows virtualize with focus preservation (P19); row-count context on region entry; targets ≥24×24; 400% reflow — table collapses to cards at 360px (ux-guidelines row 71).
- **S3 ClusterCanvas**: canvas is a list of cards semantically; drag-to-move has the M-menu equivalent; assist suggestions are labeled buttons, not color; provenance chips icon+text; worst-case Arabic cluster names truncate at word boundaries (no hyphenation exists — rtl-rules §4).
- **S4 ParityMatrix**: counts as text in every cell (never heat-only — charts.csv contract); gap rows focusable with named actions; accepted-gap = strikethrough + icon + label (never color alone); both locale columns render at own direction with bidi isolation; matrix state changes pair text deltas with the 120ms cell transition (motion never carries information alone).
- **S5 BriefOutlineEditor**: section-to-cluster binding spoken as text ("3 clusters bound"); stale-cluster warning chip has text + icon; reorder keyboard path; autosave live region.
- **Forms (ingest paste, topic create)**: labels persist above fields (ghost text is never the label — a11y-baseline §5); on-blur-or-submit validation, field-linked messages, error summary focuses first error; paste is never blocked (3.3.8).
- **Overlays (dialogs, palette)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (keyword tables, cluster names) · pure-English render · mixed strings (Latin brand keyword "salla" inside Arabic-locale table; Arabic cluster name inside en chrome — bidi isolation proves out) · numeral rendering under Western policy (data tables, matrix cells, job counters) · embedded Latin tokens in RTL context and Arabic tokens in LTR context (isolating containers) · tables/grids column order mirrored with alignment rules held · parity matrix locale-column direction per content + header mirroring · forms label/input alignment + error placement on correct inline edge · truncation at 320px container with worst-case joined-word strings · 400% zoom reflow in one dimension · bidi isolation on all user-generated/ingested strings. Seeded fixtures (07c T1: متجر الكتروني variant, salla in en-locale, Arabic cluster names) are the regression set.
