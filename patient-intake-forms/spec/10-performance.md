# 10 — Performance: patient-intake-forms

## Route budgets (gzip JS)

Staff console: S1/S7 ≤ 150KB · **S2 builder ≤ 260KB** (preview + inspector heavy; export/print views lazy at +60KB) · S5/S6 ≤ 200KB · S9/S10 ≤ 110KB. **Patient fill shell ≤ 90KB** — the surface a patient opens on a mid-range phone at the clinic door must boot like a form, not an app (route-split from the console entirely; the shell shares only the token layer + design tokens). Fonts: Harmattan (400/500/600/700) + Work Sans (400/500/600/700) subsets ≤ 150KB per direction, `font-display: swap` with metric-matched fallbacks (no FOIT, no layout shift — the Arabic fallback stack per rtl-rules §3).

## Interaction budgets

- **Keystroke-to-paint in the symptom input ≤ 16ms** p95 (the patient's typing path — the same law as the portfolio's reviewer-desk typing budgets).
- **Dictionary suggestion chips ≤ 120ms** p95 from keystroke (the deterministic core is local arithmetic — 07c rules 1–2; the budget binds the implementation's pipeline).
- **Assist suggestions ≤ 900ms** p95 when the capability is bound, streamed into the reserved chip region — never blocking, never reflowing (CLS ≤ 0.02 per arrival; the region's height is reserved when the field is focused, ai-native-patterns §2). The assist path is async BY CONSTRUCTION: its latency budget never appears in the typing path.
- Question advance (next/back) ≤ 100ms including the 240ms slide's start (input acknowledged before the animation ends).
- LCP ≤ 2.0s on the fill shell cold load (360px, throttled mid-tier mobile) and on S1/S5 console cold loads, both directions; CLS ≤ 0.02 (question-card geometry reserved; the suggestion region reserved on focus; skeletons mirror the one-question layout per direction — P02).
- Review-workspace open (S6) ≤ 800ms to first contentful paint of the answers region (the console's most expensive read: submission + pinned form snapshot + normalization entries — cursor-paged, rendered as the definition-list semantics, 09).
- Review-gate and urgent-flag recomputation ≤ 120ms after a match resolution (derived reads — 07c rule 4/5; never a refetch of the submission).

## Data-path rules (clinic scale is the design constraint)

- **Submissions queue virtualizes beyond 200 rows** (P19) — a busy clinic's week; cursor pages ≤ 100; scrolling never moves focus.
- Vocabulary list cursor-paginated ≤ 100; normalized search runs client-side over the loaded window with server search for deep sets (the disclosed-ruleset search, 05).
- **Exports are Jobs** (async-contract §1): determinate per-format progress; the UI never simulates synchronous completion of a 50-submission bulk package; the seeded export completes at the simulated cadence (60ms/format) and larger sets scale linearly — visible honest progress, cancel within one interaction.
- Vocabulary import is a Job with row-count pacing (40ms/10 rows — 07c rule 9).
- **Offline fill path**: the fill shell queues autosave payloads locally with per-question state (P20); on reconnect, drafts replay in order with the LAST-write-wins per field and the full-draft-state write model (07b `saveDraftAnswers` carries the complete draft — replay is idempotent by construction, no merge logic on the wire).
- Print/PDF generation for the intake record happens job-side; the print preview renders from the local submission read (no round-trip per page).

## Perceived-performance strategy

1. **Reserved regions everywhere that grow**: the suggestion chip region (reserved on field focus), the normalization panel's pending rows (reserved at submission open), the gate bar's gap list (reserved at render) — findings and suggestions arrive without reflow, ever.
2. **Staged submission open**: the answers region paints first from the pinned form snapshot (static), normalization entries stream second, review history third — the reviewer reads the chief complaint while the matcher-truth surface loads (the same staged-criticals strategy as the portfolio's reviewer desks, applied to the clinical read order).
3. **The fill shell is a different app, budgeted like one**: 90KB, no console code, fonts subset per the chosen locale only (Arabic-first boot loads Harmattan, not Work Sans weights beyond the pair minimums).
4. **Determinism as speed**: identical inputs → identical suggestions means every dictionary result is cacheable by (text, vocabulary version) — the implementation's memo key is specified, not improvised.
5. Honest determinate progress on imports/exports — never an indeterminate bar claiming percentage (async-contract §3).

## Measurement protocol

1. Cold-load the fill shell at 360px, Arabic RTL, throttled mid-tier (LCP/CLS/TBT) — plus the English-locale variant; then with the assist capability bound (identical boot budgets — the capability must not tax the shell).
2. Typing benchmark: a 40-word colloquial Arabic symptom phrase — keystroke-to-paint p95 ≤ 16ms; dictionary chips ≤ 120ms p95; zero CLS across the full typing session.
3. Assist benchmark (bound state): unmatched phrase → proposal arrival ≤ 900ms p95, region-reserved, cancel/ignore honored mid-arrival.
4. Interruption/resume benchmark: mid-flow exit and re-entry — answers render with recalled marks, focus lands on the exact question, ≤ 600ms from token read to interactive.
5. Queue benchmark: 5,000-submission fixture — virtualization, focus preservation, filter/saved-view application < 150ms (P19).
6. Export benchmark: 50-submission bulk package — staged per-format delivery, per-format retry on injected failure (07c fixture), cancel within one interaction.
7. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
