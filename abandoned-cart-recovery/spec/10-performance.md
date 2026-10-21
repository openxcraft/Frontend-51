# 10 — Performance: abandoned-cart-recovery

The product's performance identity: a **clock-dense queue instrument** — the operator's loop is scan-rank-decide (S1), type-bilingually (S4), and read-the-clock (preview, S7). Budgets bind that loop; everything else is standard console discipline. All budgets apply identically in both directions and with reduced-motion enabled (a11y-baseline §8.6).

## Route budgets (gzip JS)

S1 queue ≤ 140KB · S2 cart detail ≤ 120KB · S3 sequence studio ≤ 240KB (step editor + versioning + gate; QuietClockTimeline lazy at +45KB) · S4 template library + editor + dock ≤ 220KB (DiffView lazy at +55KB, loaded on first promote or revision view) · S5/S6 policy editors ≤ 130KB · S7 send ledger ≤ 140KB · S8 ≤ 110KB · S9 report ≤ 160KB · S10/S11 ≤ 110KB. Fonts: Tajawal (400/500/700, 800 loaded only with the seal-eligible surfaces) + Hanken Grotesk (400/500/600/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (no FOIT, no layout shift in either script's first paint).

## Interaction budgets (the operator loop)

- **Keystroke-to-paint in template editing ≤ 16ms** p95, both columns — the bilingual authoring loop is a typing surface (P23), and the AR column's RTL layout must never cost a frame.
- **Length-budget meter recompute ≤ 50ms** p95 per edit (pure character arithmetic — the budget binds any implementation that re-renders the meter bar eagerly).
- **Queue row focus → highlight < 80ms**; ⌘↓/⌘↑ jump to next needs-decision row < 120ms including scroll-into-view (virtualized, P19 — focus moves scroll, never the reverse).
- **⌘K palette open < 120ms**; bilingual normalized search over the workspace's carts/sequences/templates/jurisdictions < 80ms per keystroke at seed scale (normalization is a table pipeline, 07c rule 12).
- **`previewSchedule` full-timeline computation ≤ 150ms** p95 for a 6-step sequence × any supported timezone (the deterministic scheduler is a pure function — 07c rule 9; the budget binds the implementation, and the preview may never fake completion of a computation it did not run).
- **QuietClockTimeline render ≤ 100ms** for the same input (bands + markers + defer arrows), zero layout shift on re-preview (same geometry, new data).
- **Report render ≤ 300ms** at seed scale (14 carts) and ≤ 800ms p95 at the 5,000-cart scale band (a derived read recomputed from recorded events — never a refetch of the workspace).
- **Deferral-arrival paint ≤ 200ms** end-to-end (ledger row update + badge settle + polite announcement dispatch — 05's 160ms settle sits inside this).
- **"The Cart Comes Back" ≤ 400ms** total (seal flip 220ms + counter count-up ≤400ms overlapped; reduced-motion: instant + jump, 09).
- Activation-gate evaluation < 100ms (rule checks over step data); gate refusal render with named blockers < 150ms.

## Page-load budgets

LCP ≤ 2.0s on S1 and S4 cold loads, both directions, 1280px and 360px; CLS ≤ 0.02 on every surface — structurally reserved: the generation dock's region (P13, ai-native-patterns §2 — reserved BEFORE the first stream), the findings-free ledger geometry, the QuietClockTimeline's band heights (fixed per step count), and skeleton shapes that mirror final geometry per direction (P02 — RTL skeletons flip with the layout). TBT ≤ 150ms on S1 cold load (the queue's first paint is rows, not chrome).

## Data-path rules (queue and ledger scale is the design constraint)

- **Virtualization at >200 rows** on S1 and S7 (P19); cursor pages ≤ 100 (07b); scrolling never moves focus; row-count context announced on region entry (09).
- **Send ledger pagination by `dueAt`** with stable keys — deferral updates must not re-sort a row the operator is reading (deterministic tie-breaks, 07c rule 12).
- **Imports, generations, exports are Jobs** (async-contract §1): determinate unit progress ("Importing 9 of 14 carts" — 40ms per 10 rows simulated in 07c; variant generation streams per-variant with per-chunk announcements); the UI never simulates synchronous completion; cancel within one interaction.
- **Offline queue stores event entries, overrides, and policy writes** with their baseVersion anchors (P20); on reconnect they reconcile to authoritative state — safe because every derived value re-derives deterministically from the same events (07c; the re-derivation oracle is the offline strategy, not optimistic writes: P03 is deliberately unused, 06).
- **Report at scale** (≥5,000 carts): derived in one pass over events with the funnel accumulated per step order; no per-cell recomputation; the recovery-rate denominator statement renders with the same pass.

## Perceived-performance strategy

1. **Rank-first paint**: S1 paints the top-ranked rows (the decisions) before lower-priority rows hydrate — the operator's first question ("what needs a human today") is answered in the first paint.
2. **Zero-reflow dock**: the generation region reserves its geometry before any stream starts (CLS ≤0.02); partial variants fill reserved slots.
3. **Preview is instant-by-construction**: the timeline computes locally from sequence + policy data (no round-trip per step); re-previewing with a changed timezone re-uses the same function at the same budget — policy craft never waits on transport.
4. **Authoritative reads, no fake writes**: queue/ledger reads render from adapter state; mutations confirm through typed responses (conflicts surface both versions — the deterministic core makes honesty cheap).
5. **Honest determinate progress everywhere** — never an indeterminate bar claiming percentage (async-contract §3).

## Measurement protocol (release gates)

1. Cold load S1 + S4, both directions, both viewports (LCP/CLS/TBT) — including the AR-chrome variant with Tajawal-first font loading.
2. Typing benchmark: 60-word Arabic body edit in the AR column — keystroke-to-paint p95 ≤ 16ms with the meter recompute ≤ 50ms.
3. Preview benchmark: 6-step sequence × 3 timezones (Asia/Riyadh, America/New_York, America/Chicago) — computation ≤ 150ms and render ≤ 100ms each, byte-identical outputs across two runs (the determinism oracle doubles as a performance assertion).
4. Virtualization benchmark: 5,000-cart fixture on S1 and a 5,000-send fixture on S7 — scroll performance, focus preservation, and row-state announcements (P19) at 60fps target.
5. Deferral-arrival benchmark: ledger update → badge + announcement ≤ 200ms with reduced-motion on and off.
6. Report benchmark: seed scale ≤ 300ms; 5,000-cart scale ≤ 800ms p95; cancel of an in-flight export within one interaction.
7. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
