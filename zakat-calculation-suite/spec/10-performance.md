# 10 — Performance: zakat-calculation-suite

SME-I/E pass · Budgets are the contract that keeps the deterministic core synchronous (07b: "calculations (deterministic, synchronous, budget-bound per 10-performance)"; CP-2's comparison runs "synchronously, budget-bound per 10"). The engine's determinism is itself a performance invariant: same inputs → same output → same cost (07c §3.8) — every budget below is measured against reproducible workloads, and a re-run that costs differently is a defect, not jitter. All numbers p95 unless stated; both directions (ar/en) at identical budgets — direction is never a performance excuse (rtl-rules §1).

## Route budgets (gzip JS)

S1 cases home ≤ 150KB · case workspace shell ≤ 200KB (S3 calculation surface + TraceLedger lazy +60KB; S4 review packet lazy +40KB) · S5 compare view ≤ 130KB · S6 nisab & valuations ≤ 110KB · S7 methodology admin ≤ 120KB (rule editor + side panel) · S8/S9/S10 ≤ 90KB · ⌘K palette ≤ 30KB incremental.

## Interaction budgets

- **Calculation compute (`runCalculation`): ≤ 250ms at seed scale (≤ 50 active items → ≤ ~70 trace lines), ≤ 800ms at 500 items (~700 trace lines)** — synchronous by design (07b rule 7: calculations are all-or-nothing; a spinner over a certified number is a contradiction). If a future case corpus exceeds the ceiling, the run becomes a Job (async-contract §1 threshold) rather than a spinner lie — the budget is the contract that keeps it synchronous at v1.
- **Comparison compute (`createComparison`): ≤ 600ms at seed scale (2–5 approved profiles on ≤ 50 items), ≤ 2.0s at 5 profiles × 500 items** — N deterministic per-profile calculations plus the divergence diff (07c §3.4); same ceiling honesty as above. Column fill is progressive (each profile's column lands as its pinned calculation completes) — the matrix stays useful during the run, never blank-waiting.
- **Item table (C-02)**: keystroke-to-paint in bilingual normalized search ≤ 16ms (rtl-rules §4 normalization — alef/taa-marbouta/yaa folding on every keystroke); row focus highlight < 80ms; inline-edit commit < 100ms with Escape restore in the same paint (P06); **virtualized window beyond 200 rows (P19)** — scroll never moves focus, focus moves scroll into view; row count announced on region entry.
- **Item intake form (C-01)**: category switch re-discloses the category's fields < 100ms with entered values preserved (no re-mount, no value loss); on-blur field validation round-trip < 100ms perceived.
- **TraceLedger (C-04)**: first text paint < 150ms after the result lands — the trace's text is complete before any cascade (05: motion carries no information); the ≤ 5-line-group cascade at ≤ 60ms stagger applies to the first viewport only (≤ 5 groups, ≤ 300ms total); lines beyond the first viewport render without stagger — motion never delays reading, and a 700-line trace never pays 140 staggering groups.
- **NisabGauge (C-03)**: verdict chip, threshold arc, and signed distance re-render < 150ms on a new result version (re-pin + re-run); the Verdict Settle (360ms emphasized decelerate) runs AFTER the verdict text is already visible — motion decorates the relation, never delays the number (05).
- **ComparisonMatrix (C-06)**: divergence row expand < 120ms; rule-pair side panel opens ≤ 180ms with focus trap and return (motion-language §3); in-kind cells render kind names from the bilingual label table with no extra fetch (labels ride the profile payload).
- **Exports**: locale picker and confirm are 140ms modals (motion-language §3); artifact link resolves < 300ms from cache on re-download (locked cases regenerate deterministically — 07c §5).
- Autosave (case header edits, P10): debounce 800ms, save round-trip < 400ms perceived; route crossfade ≤ 180ms; hover is a 180ms border-step (05's recorded bound — implementation does not average it with stately's 280–480ms choreography).
- LCP ≤ 2.0s both directions; **CLS ≤ 0.02 per surface**: the NisabGauge reserves its arc, verdict-chip, and distance geometry before the result lands; the trace bed reserves row height per line (text arrives into reserved rows, never pushes); the comparison matrix reserves cell geometry during per-profile compute (P02 direction-mirrored skeletons — RTL skeletons flip); the usage meter is a fixed-width rail chip (its text swap never reflows the settings surface).

## Perceived-performance strategy

- **Imports and exports are honest Jobs (P12)**: determinate row/part progress, cancellable, never faked-instant. Import shows named-row progress ("الصف ٤ من ١٢" class copy per async-contract §3); export shows bundle-part progress ("توليد الحزمة ٣ من ٣ أجزاء" — 07c job fixture); progress ticks ≤ 500ms per the 07c job schedule; a job at 99% for more than a few seconds declares a stall (async-contract §3).
- **Audit-bundle generation ≤ 4s at seed scale** (one locked case, ≤ ~70 trace lines; three artifact parts: certified-result sheet, derivation-trace section, pinned-references + methodology annex), **≤ 30s at 500-item scale**; items-csv ≤ 2s seed / ≤ 10s at scale. Exports are per-artifact atomic with scoped retry (07b rule 7); a failed part regenerates alone, never the whole bundle.
- **Determinism doubles as the cache key**: results are cached per `contentHash` (07c §3.8) — immutable snapshots make re-reads free; a locked case's re-export regenerates byte-identically from frozen state; re-download resolves < 300ms. The identical re-run (LOOP-5 DoD bar: "re-running the unchanged sample case returns the identical result id") is a cache hit, not a recompute.
- Job polling only on visible surfaces (S8 console, case badges); completion delivers in-context first (P12/async-contract §6 ladder 1), with the return-state rung greeting unfinished jobs at re-entry.
- Offline (P20): case reads, trace reads, and reference lists work; item edits and pin intents queue with per-item state; jobs reconcile to authoritative state on return; a queued item write that raced another editor surfaces CONFLICT with both payloads, never a silent overwrite.
- The usage meter (`getUsage`) is a derived read — updates within budget, no spinner and no skeleton below 300ms (C-10 "last known" degrade on read failure).

## Asset strategy

Four families by declared duty (05): display duo — Reem Kufi (400/500/700 ar) + Fraunces (400/600 + italics, optical-size axis) subsets ≤ 110KB/direction; reading pair — IBM Plex Sans Arabic (400/500) + IBM Plex Sans (400/500) subsets ≤ 140KB/direction (the documented LOOP-9 exception; display = P09, reading = Plex). Tabular-figure font-feature binding on amounts, counts, and reference values (the mono instinct adopted as a rule, not a font — 05); line-1.5 icon sprite single file; no font-display late-swap on the item table or the trace bed (data-first paint — the officer's morning surface is the register, not a wordmark).

## Data-path rules

Cases/items/profiles/references pages ≤ 100/cursor (07b typed pagination); calculations ≤ 50/cursor; comparisons ≤ 30/cursor; jobs ≤ 50/cursor; activity ≤ 50/cursor with case filter pushdown. > 200-row tables virtualize (P19; 03 CP-5 edge). Import rows parse-validate < 5ms/row (deterministic grammar, 07c); import carries an idempotency key — a double-submit never double-imports (07b rule 6); exports carry idempotency keys — a retried export never duplicates artifacts. Nisab reference entry is a single authoritative write (no optimistic pin — P03 applies to reversible row edits only, never to evidence pins, C-05). Artifact delivery streams (the browser download is the LOOP-5 floor; the N3 channel, if ever bound, must deliver unmodified bytes — 08 binding gate).

## Measurement protocol

1. Cold load S1 + case workspace (S2→S3), both directions (LCP/CLS/TBT); trace bed and gauge geometry reserved (CLS ≤ 0.02 verified at result-arrival, both directions).
2. Item-table benchmark: 200-row seed page + 1,000-row synthetic virtualized scroll, bilingual normalized search p95 keystroke ≤ 16ms, zero focus loss during virtualized scroll (P19), both directions.
3. Calculation benchmark: Z-1042 seed scale p95 ≤ 250ms (16 trace lines rendered); 500-item synthetic case p95 ≤ 800ms; **every re-run byte-identical AND same-cost** (the determinism invariant measured as a performance contract — 07c §3.8).
4. Comparison benchmark: 3-profile seed (comp-z1038-c1 shape) p95 ≤ 600ms with progressive column fill; 5-profile × 500-item synthetic p95 ≤ 2.0s; divergence rows render with rule pairs, no post-paint fetch.
5. Trace benchmark: 700-line synthetic trace — first text paint < 150ms; cascade confined to first viewport (≤ 5 groups); reduced-motion variant renders all lines simultaneously at identical first-paint budget.
6. Export benchmark: audit-bundle job at seed scale ≤ 4s (3 parts, determinate); items-csv ≤ 2s; artifact re-download from cache < 300ms; expired-artifact regenerate path ≤ 4s (deterministic from locked state).
7. RTL + reduced-motion variants repeat 1–6 at identical budgets; 400% zoom reflow pass on S2/S3/S5 both directions (a11y-baseline §8.3) — the comparison matrix's stacked-card degrade at 360px reflows without horizontal scrolling (06 C-06).
