# 10 — Performance: caption-lab

## Route budgets (gzip JS)
- S1 ≤ 140KB · S3 grid + inspector ≤ 320KB (preview + studio lazy: +80KB) · S5 studio ≤ 160KB lazy · S6/S7 ≤ 100KB.

## Interaction budgets
- Cue navigation: <50ms per key (612-cue project virtualized — P19); frame nudge <16ms keystroke-to-paint; LCP ≤ 2.0s; CLS ≤ 0.02 (grid rows reserved; meter swaps never reflow).
- Break preview: <100ms per option (deterministic computation — mock cadence 0ms logic, binding must hold).
- Preview frame request: honest job (no fake instant) per async-contract; scrubber stays responsive during pending frame jobs (pending-state, not block).

## Asset strategy
Noto Kufi Arabic (400/500/700) + Space Grotesk + Space Mono subsets ≤ 170KB/direction; burn-in font LIST is data (not loaded fonts) — only preview binds actual preset fonts lazily.

## Data-path rules
Cue pages ≤ 80/cursor; bulk apply is a job with skip lists; export per-format results stream into queue; offline queue stores cue patches with baseRevision (conflict-ready).

## Measurement protocol
1. Cold load S1/S3 both directions.
2. Navigation benchmark: 600 cues keyboard-only, p95 <50ms, focus never lost.
3. Bidi rendering benchmark: mixed-cue fixtures, zero layout shift on direction resolution.
4. RTL + reduced-motion variants (same budgets).
