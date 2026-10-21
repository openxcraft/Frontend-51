# 04 — Information Architecture: shipping-rate-comparator

## Navigation model

Left rail: **Cards** (home) · **Comparisons** (workbench + history) · **Profiles** · **Jobs**. The comparison workbench is the product's core mode — one screen carrying the profile form (inline-start pane), the live chargeable-weight calculator (between the panes), and the results table (inline-end pane). ⌘K palette (P05 — list surfaces exceed three) reaches cards, comparisons, profiles, and jobs with bilingual normalized search (alef/hamza variants, taa marbuta, yaa forms — rtl-rules §4). Two-level IA: section → item; the card editor and comparison detail are item-detail surfaces with internal tabs. Desktop-first; ≤767px: Cards/Comparisons/Profiles read-only card lists, workbench stacks profile-then-results, batch matrix scrolls horizontally then collapses to per-destination cards.

## Entity overview (07a for full shapes)

Workspace → RateCards (zones, weight breaks, surcharges, dimensional policy; versioned) · ShipmentProfiles (destination, weight, dimensions, COD/declared value) → Comparisons (immutable snapshots pinning profile inputs + card versions; single or batch) → ExportArtifacts (expiry + regeneration). Jobs wrap card imports, batch comparisons, and exports. Activity log spans every consequential mutation (P17).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Cards home | card library, status/channel filters, coverage-gap warnings, onboarding checklist (P22) | listRateCards, createRateCard, getSession |
| S2 | Card editor | zones + coverage, break grid, dimensional policy, surcharge stack; completeness gate state | getRateCard, updateRateCard, setRateCardStatus, resolveZone, duplicateRateCard |
| S3 | Paste-import surface | paste field, header form, live parsed preview, named issues | importRateCard, listJobs |
| S4 | Comparison workbench | profile form, live calculator, card selector, results table, batch mode | listRateCards, resolveZone, computeChargeableWeight, runComparison, runBatchComparison, createShipmentProfile |
| S5 | Comparison detail | full breakdown sheet per quote, derivation chain, pin, export | getComparison, setComparisonPin, exportComparison |
| S6 | Comparison history | singles + batches, pinned filter, date/status sorts | listComparisons |
| S7 | Profiles library | reusable shipment profiles, last-run, usage counts | listShipmentProfiles, getShipmentProfile, updateShipmentProfile, deleteShipmentProfile |
| S8 | Jobs console | import/batch/export jobs, cancel/retry, link-to-context | listJobs |
| S9 | Settings | defaults (currency, unit system), normalization disclosure, consent state | getSession, getUsage |
| S10 | Command palette (overlay) | bilingual search across cards/comparisons/profiles/jobs | client-side over S1/S6/S7/S8 data |

## Per-screen state obligations

Four empties per P01: S1 first-run offers the sample card + sample profile (the comparison moment experienceable pre-import); S4 never-run state teaches profile-first entry; S6 history empty points to the workbench; S2/S4 filtered-empties declare themselves. Skeletons mirror final geometry per direction (P02) — the results table skeleton reserves row height for the derivation chip. Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **The workbench is one screen, not a wizard**: the comparison job is a what-if loop (Noura changes a dimension, the settle happens, quotes flip) — a step wizard would amputate the loop the product exists for. The three-pane layout (profile · calculator · results) keeps inputs and consequences in one eye-span.
- **Batch mode lives INSIDE the workbench, not as a separate surface**: a batch is the same profile template with a destinations list instead of one destination (07a: same entity kind, `rows[]`); a separate surface would duplicate the card selector and calculator.
- **Card editor is tabbed, not paged**: zones/breaks/surcharges/dim-policy are four views of one versioned object; tabs keep the completeness gate visible from every view (the gate is the editor's spine).
- **Comparison detail is a view of history, not a mode of the run**: every comparison is an immutable snapshot (07a state obligations); the detail surface reads snapshots, never re-computes — re-running is an explicit new action (the honesty rule that makes pinning meaningful).
- **Jobs consolidated (T3 posture)**: per async-contract §7, Tier 3 may consolidate the job center into an activity-adjacent console — S8 covers all three job classes with link-to-context.
- **Settings is small and honest**: the normalization disclosure lives here AND at point-of-use (S3 import preview, S2 zone probe) — disclosure where the matching happens (rtl-rules §4 discipline).
