# 10 — Performance: translation-review-hub

## Route budgets (gzip JS)

S1/S5 ≤ 150KB · **S3 review workspace ≤ 260KB** (glossary editor + findings console lazy at +70KB) · S2/S4 ≤ 130KB · S7 ≤ 110KB. Fonts: Noto Sans Arabic (400/500/700) + Manrope (400/500/600/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (skill rows 50/75 — no FOIT, no layout shift).

## Interaction budgets

- **Keystroke-to-paint in target edit ≤ 16ms** (the typing path — the reviewer's core loop).
- **Live finding recheck ≤ 50ms p95** per single-segment recompute after an edit (07c simulates at ≤30ms; the budget binds the implementation's term/length rules).
- Navigator row focus → highlight < 80ms; chip anchor jump (sibling link) < 80ms, zero layout shift.
- LCP ≤ 2.0s on S1 and S3 cold loads, both directions; CLS ≤ 0.02 (pane geometry reserved; skeletons mirror the three-region layout per direction — P02; the findings rail's width is reserved even when empty so findings arriving cause no reflow).
- Gate status update after a resolution/decision ≤ 120ms (it is a derived read — recomputed from finding/decision state, never a refetch of the job).

## Data-path rules (job scale is the design constraint)

- **Segment list virtualization at >200 rows** (P19) — the seed's 220-pair document is deliberately above the line; cursor pages ≤ 100 segment rows; scrolling never moves focus.
- Findings lists cursor-paginated ≤ 100; the findings console renders severity-sorted with stable keys (resolution must not re-sort mid-reading).
- **QA scan is a Job** (async-contract §1): determinate per-segment progress; the UI never simulates synchronous completion for a 5,000-segment document; scan of the 220-pair seed completes at the simulated cadence (40ms/10 pairs ≈ 0.9s — visible as honest progress, not hidden as instant).
- Full-document scans at scale (≥5,000 segments): staged delivery — critical findings stream to the gate surface first (perceived-performance strategy below), the complete report lands on job completion.
- Offline queue stores target-edit patches + decisions with `baseRevision`/decision-chain anchors; recompute of affected segments' findings runs on reconnect (determinism makes this safe — same input, same findings, 07c).

## Perceived-performance strategy

1. **Staged criticals**: import → scan → findings pipeline surfaces critical violations as soon as their segment is computed (the reviewer starts on real blockers while the scan finishes); the gate's blocker count ticks up live.
2. **Zero-reflow findings rail**: reserved width + skeleton geometry; findings populate without CLS.
3. **Optimistic reading, authoritative writing**: navigator/pane reads render instantly from local state; every mutation's confirmation comes from the adapter's typed response (P03-free by design — review state is authoritative; conflicts surface both versions instead of optimistic overwrites).
4. **Honest determinate progress everywhere** (imports, scans, exports) — never an indeterminate bar claiming percentage (async-contract §3).
5. Route-level code splitting keeps S3's 260KB budget while the glossary editor and findings console load on first navigation.

## Measurement protocol

1. Cold load S1 + S3, both workspace directions, en→ar and ar→en jobs (LCP/CLS/TBT).
2. Typing benchmark: 60-word Arabic target edit at keystroke-to-paint p95 ≤ 16ms.
3. Live-recheck benchmark: edit that closes a critical term violation — finding dissolve + announcement ≤ 50ms p95, zero layout shift.
4. Navigator virtualization benchmark: 5,000-segment fixture — scroll performance and focus preservation (P19) with row-state announcements.
5. Scan-at-scale benchmark: 5,000-segment document — staged critical delivery visible < 2s from scan start; full report on job completion; cancel within one interaction (async-contract §2).
6. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
