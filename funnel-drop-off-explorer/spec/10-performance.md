# 10 — Performance: funnel-drop-off-explorer

SME-H pass · Spec commitments an implementation must meet; the Critic enforces them as budget rules. The performance story has one hero — **the query loop** (an analyst moving seam-to-seam, drilling, annealing, comparing under keyboard speed) and one hard ceiling — **the 2-second anneal budget** (the synchronous promise that makes the flagship engine feel like an instrument, not a job queue; beyond it the operation honestly becomes a Job per async-contract §1 — 03 CP-3 edge). Reference devices: mid-tier laptop (desktop canvas ≥1280px, keyboard-first), mid-range 2024 tablet (review view ≥820px). The mock's 400-user world is the floor fixture; the budgets are written against the declared data-path bounds (07b limit ≤ 50; the seam population, axis, and event-volume ceilings below) so they hold on any binding that honors the envelope (08 N1 risk flag).

## Route budgets (JavaScript transferred, gzip)

| Route | Budget | Strategy |
|---|---|---|
| Canvas shell + home (S2) | ≤ 200KB | shell + funnel list eager; paste sheet, composer drill lazy |
| Exploration canvas (S3) | ≤ 300KB | cascade + seam selector + dossier core eager; spine, compare, narration, export sheets lazy on first open |
| Taxonomy manager (S6) | ≤ 140KB (lazy) | dictionary grid + lint report; edit surface lazy on card open |
| Workshop / cohorts (S4/S5) | ≤ 120KB (lazy) | provenance cards, compare board, drill grid |
| Analyses feed (S8) | ≤ 100KB | feed + narration region; export sheet lazy |
| Activity / jobs / inbox / sources (S7/S9/S10) | ≤ 80KB | small surfaces, shared primitives |

## Query budgets (the real performance surface — every number is a product promise)

- **computeFunnelMetrics**: **≤ 1.5s p95 / ≤ 3s p99** client-visible, from call to cascade-patch start; the canvas retains the previous render until the patch (queries never blank the canvas — 03 CP-2 recovery; 07b rule 1). On the mock's seeded world the engine returns in < 300ms — the budget headroom belongs to bound sources (08 N1 envelope).
- **annealSegment**: **synchronous ≤ 2s** wall-clock for seam populations ≤ 100,000 and candidate sets ≤ 256 (the declared envelope: segmentable axes ≤ 32 per event × values ≤ 8, enumerated over the chain population). Beyond 2s → job-shaped continuation with iteration-landing progress, never a fake spinner (async-contract §1; 03 CP-3 edge). Candidate evaluation cost: ≤ 5ms per candidate p95 over the mock's table shapes.
- **breakdownFunnelStep / getStepTransitionDetail**: **≤ 600ms p95** each — both sit on the one-key drill path (B / Enter) where the dossier must feel attached to the seam.
- **getFunnelTrend**: ≤ 800ms p95 (windowed aggregation; the strip is context, not the main query).
- **compareSegments**: ≤ 600ms p95 (two predicate evaluations over one population).
- **listTaxonomyEvents / listAnalyses / listCohortUsers / listActivity / listNotifications**: ≤ 400ms p95 per page (cursor pages ≤ 50 items — the data-path rule below).
- **getTaxonomyLintReport**: ≤ 800ms p95 synchronous (lint runs on every upsert draft — 07c §2.5; the edit path must not feel gated by it).
- **narrateDropOff (template-metrics floor)**: first composed sentence ≤ 400ms; full template narrative ≤ 800ms. Model-assisted (when bound): first chunk ≤ 800ms, streaming into the reserved region at paragraph cadence (ai-native-patterns §2); degradation to the template floor is instant by contract (07b rule 4) — the narration budget never blocks evidence reading.
- **importEventSample**: determinate progress at ≥ 8 rows / 1.6s cadence (the mock's declared rate; a binding must match or beat honest per-row visibility, never batch-silent).

## Canvas render & interaction budgets

- **Seam traversal (j/k hold)**: focus→paint ≤ 16ms (60fps floor under key-repeat); the roving tabindex patch never re-renders strata (focus moves; geometry does not).
- **Cascade render / re-query patch**: strata settle 140ms each, stagger ≤ 60ms capped at 5 strata then simultaneous (05 Stratum Settle); the PATCH (in-place re-query, CP-2.5) swaps counts in Space Mono tabular numerals with ZERO layout shift outside the stratum-height transition (skeletons mirror final geometry, P02 — 11 §B).
- **Dossier open**: ≤ 180ms (dock slide + focus move); sheets ≤ 140ms scale+fade with focus trap (05).
- **Anneal Pinch**: 140ms total (narrow ≤ 80ms, flash 60ms, settle immediate — 05 signature); runs once per refinement, never loops; reduced-motion path is the state chip (identical cost).
- **Virtualization thresholds (P19)**: UserDrillTable above **200 rows** (06); analyses feed and activity log above 200 rows; breakdown tables are capped at 12 rendered rows (the UI rule — 03 CP-2.2) with the full-row toggle; scrolling never moves focus; row-count context on region entry.
- **INP ≤ 200ms** on all interactive paths; **TTI** desktop canvas ≤ 2.5s / tablet review ≤ 3.5s on the reference devices; **LCP ≤ 2.5s**; **CLS ≤ 0.02 per route** — the narration region reserves its space BEFORE composition starts (06 NarrationPanel; 03 CP-5.1's "CLS ≤0.02, 10" promise), and the cascade's stratum heights animate from the SKELETON's geometry, not from zero.

## Keystroke & search budgets

- Taxonomy composer search: keystroke-to-result ≤ 150ms (debounce 120ms, normalized Arabic search server-side per 07b rule 11 — the normalization is the adapter's job, not the client's re-implementation).
- ⌘K palette: open ≤ 100ms; result row ≤ 100ms per keystroke; bilingual normalized matching included in the budget (rtl-rules §4).
- Lint-report group expand: ≤ 100ms (disclosure, not fetch — the report payload arrives whole).

## Data-path rules (07b-backed)

- Cursor pages ≤ 50 items (`CursorQuery.limit` — the 07b bound); no surface fetches unbounded lists; the breakdown/transition/anneal payloads are bounded by the seam population envelope (≤ 100,000 users) and candidate set (≤ 256).
- `subscribeWorkspaceEvents` coalesces: events batch to the sink at most once per frame; a taxonomy-change storm renders as ONE staleness chip per surface (never a flicker).
- Job polling only where visible (import sheet, export sheet, jobs center — async-contract §7); no background polling anywhere; return-state surfaces unfinished business on re-entry (async-contract §6.3).
- Offline queue (P20) stores bounded write payloads (analysis saves, annotations, taxonomy edits — 07b rule 10) — never canvas snapshots, never event samples.
- Determinism is a performance guarantee: two identical replays produce byte-identical payloads (07c §5), so no recompute drift, no cache-invalidation ambiguity — the evidence path is cacheable by parameter hash (07c §2.1 rule 7 / §2.2 rule 9).

## Asset strategy

- Fonts: Rubik (400/500/600/700 — Arabic+Latin bilingual family) + Space Mono (400/700, Latin + digits) ≈ ≤ 180KB per direction with `font-display: swap` and metric-compatible fallbacks (Noto Kufi Arabic / Noto Sans) bounding CLS (05 typography); no unbound weights, no variable-axis bloat.
- Icons: single constructed line-2 sprite, currentColor, 24px grid — no per-icon requests (05/06).
- Charts render as SVG+text composites (06) — no charting library payload; the text twins ARE the accessibility surface AND the light render path (one DOM, two consumers — 09 §2).
- Narration and rationale strings are DATA (bilingual templates + numeric params — 07a/07c), not per-locale artifacts.

## Measurement protocol (spec-level acceptance)

1. Cold load on the reference devices: TTI/LCP/CLS for the canvas shell and the taxonomy manager, both directions (en/ar), reduced-motion on/off — same budgets (motion and direction never buy or cost performance).
2. The 00 §success-signal 1 journey scripted end-to-end (paste → compose → render → select → anneal → read the chain): **total wall-clock ≤ 10 minutes** with zero CLS events across the 8 surfaces; per-step tap/keystroke-to-feedback p95 ≤ 200ms.
3. The 03 CP-6.9 walkthrough scripted twice: byte-identical state (07c §5), and the degradation re-run (all capabilities unbound) completing inside the same budgets on the pasted world.
4. Query benchmark: metrics p95 ≤ 1.5s; anneal p95 ≤ 2s at the envelope ceiling (100k seam population, 256 candidates) — the job-shaped continuation triggers above, never silently; breakdown/transition p95 ≤ 600ms; seam j/k hold at 60fps for a 12-stratum funnel (the 5-stratum seed plus headroom).
5. Reduced-motion + RTL variants of every benchmark (same budgets); the 09 matrix (both directions × both motion states) runs green.
6. Keyboard-speed test (00 §success-signal 5): a working analyst moves seam-to-seam, opens breakdowns, runs the anneal, and compares segments entirely from the keyboard with every state change announced per the 09 §4 schedule — scripted completion ≤ 90s for the seeded walkthrough's drill sequence.
