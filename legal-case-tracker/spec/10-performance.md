# 10 — Performance: legal-case-tracker

SME-I/K pass · budgets are product-specific (the docket clock, the chronicle, the chain), stated as numbers with measurement points. The engine is deterministic rules (07c) — every budget below is a property of *derivation at read*, not of background compute: there is no cron, no recompute job, no cache invalidation class in the product's core (the determinism contract makes derived reads recomputable on demand — 07b rule 1).

## Budgets

| Surface / operation | Budget | Rationale |
|---------------------|--------|-----------|
| Docket-home board derivation (cross-matter, zone sort, prep-deadline join) | ≤150ms at seed scale (~25 hearings, 5 matters); ≤400ms at 5,000 open hearings | the board is the 8:30 surface — it must render as one read; derivation is date arithmetic over indexed events (07c rules 1–2, 4) |
| Zone-at-read per hearing row | ≤5ms per 100 rows | zones recompute at read, never stored (07a); the per-row cost bounds the board budget |
| Closure-gate evaluation (live `MatterView.gate`) | ≤50ms per matter at 500 events + 200 documents + 500 chain entries | the gate re-evaluates on every mutation-adjacent read (CP-5); it is a pure function over live state (07c rule 7) |
| Timeline chronicle render | first 30 event cards ≤100ms; virtualized above 200 rows (P19, 07b row comment) | date-group virtualization on the bed; skeletons capped at one screen (P02) |
| Deadline-rule regeneration (save/edit; forward-only, 07c rule 3) | ≤100ms per 100 open generated deadlines; the regeneration preview computes before commit | the preview is part of the interaction (CP-4.3 — "3 future deadlines move" must appear before ⌘S resolves visually) |
| Bilingual normalized search (matters/clients/events/documents, ⌘K + field search) | ≤16ms per keystroke at 10,000 records | write-time normalization (rtl-rules §4 pipeline applied at ingest, disclosed in-product); keystroke-budget house pattern for bilingual search |
| Custody-strip render | ≤120ms at 200 chain entries (virtualized strip) | the strip is the document's face (S5) |
| `verifyChain` (fingerprint table recompute) | ≤200ms at 500 entries | verification is user-initiated and lands in activity — it must feel like one action (CP-3.8) |
| Outcome recording round-trip (UI → adapter → returned view → gavel begins) | ≤250ms perceived (mock latencyMs default 90); the Gavel Settles completes ≤600ms total (ring drain 360ms + card settle 320ms overlap + chip stagger ≤60ms; ≤3 moving elements — 05) | the courtroom-corridor moment; the animation never delays the data (the returned view renders first, motion expresses it) |
| Export job progress | determinate in package parts (3 formats); no indeterminate bar claiming percentage (async-contract §3 — contract violation if violated); part-boundary updates only | partial policy per format (07b rule 9) |
| Layout stability | CLS ≤0.02 on every surface incl. the gavel moment (outcome chip reserves its row before stamping — the reserve is why the stagger is ≤60ms) | ai-native-patterns §2 budget applied as a general contract; bilingual strings run ~125% of English (copy-voice §5) — card min-heights budget for the longer side at design time |
| Route transitions | crossfade ≤280ms with a single content settle (stately — 05/motion-language §3) | never two moves of content the user is reading |
| Skeleton feedback threshold | any read >300ms shows a skeleton mirroring final geometry per direction (P02; skill row 10/78) | below 300ms, no spinner noise |
| Cold boot to interactive docket home | ≤2.5s on the seed dataset at 1280px; ≤3.5s at 360px | getSession + board + matters triage are the critical path; everything else streams after |
| Activity log (S10) | virtualized above 200 entries; row render ≤5ms | keyboard-navigable grid must stay responsive at audit scale (a11y-baseline §7) |
| Hijri cross-reference conversion | cached per ISO date (memoized at first render per session); ≤1ms per cached lookup | dual-calendar is on every dated surface (P24) — conversion must never appear in a budget line above |

## What deliberately has no budget

No streaming budget (non-AI — nothing streams); no keystroke budget on outcome summaries (authoring surfaces are not search); no web-worker mandate (derivation is bounded above; workers are an implementation choice, not a spec obligation); no network-layer budgets beyond the typed-error contract (NETWORK errors map to banner + retry, P20 — the UI reconciles to authoritative state, async-contract §5).

## Measurement points (release matrix)

1. **Board derivation clock**: instrument `listHearingBoard` call→render on the seed and on a 5,000-hearing fixture; assert the two budget rows above.
2. **Zone honesty probe**: for every rendered board row, assert zone(day-count) equivalence (07c rule 2) — a zone/number mismatch is a release blocker, not a visual bug.
3. **Keystroke probe**: normalized-search latency distribution (p95) over 10,000-record fixtures, both directions, Arabic and Latin queries.
4. **Gavel timing capture**: record the full outcome moment (submit → returned view → motion complete) at 60fps with reduced-motion ON and OFF — assert identical announced content and ≤600ms total.
5. **Gate evaluation**: time `getMatter.gate` on the blocker-rich fixture (m-001: 2 unreturned originals) and on a clear fixture — assert ≤50ms and identical blocker labels across 100 evaluations (determinism).
6. **Reflow pass**: 400% zoom on 360px viewport, both directions, worst-case Arabic strings (09 matrix) — assert no one-dimensional horizontal scrolling and CLS ≤0.02 during the board load.
7. **Export honesty check**: force the `failExportFormat` injection (07c) — assert per-part determinate progress, per-format retry offered only for the failed format, and no percentage claims on indeterminate states.
8. **Determinism oracle**: two `reset()` → identical scripted call sequences → identical state hashes (07c rule 9); any drift is a release blocker (the budgets above only mean anything because the outputs are stable).
