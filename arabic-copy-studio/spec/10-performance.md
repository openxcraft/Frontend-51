# 10 — Performance: arabic-copy-studio

Targets are spec commitments an implementation must meet and the Critic enforces as budget rules. Measured on the reference device class (mid-tier laptop, throttled 4G for cold loads).

## Route budgets (JavaScript transferred, gzip)

| Route | Budget | Strategy |
|---|---|---|
| S1 workspace home | ≤ 200KB | shell + list only; editor, parity, and export modules lazy |
| S3 editor (+ AI panel) | ≤ 350KB total after lazy chunks | editor core eager; DiffBrush, Parity Weave, citation panel lazy on first need |
| S5 Parity Weave | ≤ 120KB (lazy chunk) | loaded when transform starts |
| S12/S13 usage/jobs | ≤ 80KB | tiny surfaces, shared primitives |

## Interaction budgets (the writing tool's real performance surface)

- **Keystroke-to-paint ≤ 16ms** (60fps floor) in the editor under a 200-block document — typing latency is the product's most performance-sensitive interaction; AI assistance must never sit on the typing path.
- **INP ≤ 200ms** on all interactive paths; **LCP ≤ 2.0s** (home, editor); **CLS ≤ 0.02** per route AND per stream (reserved stream regions per P13; tashkeel line-height growth pre-reserved via line-box budgeting — 09).
- Stream rendering: append-only text commits batched per frame; no re-layout per token; citation chips bind to anchors without reflowing prior text.
- Parity Weave: virtualized columns (P19); block diff computation off the interaction path.

## Asset strategy

- Fonts: Arabic-first subsetting — Amiri (400/700) + IBM Plex Sans Arabic (400/500) + Source Serif 4 Latin subset; `font-display: swap` with metric-compatible fallbacks (Noto Naskh Arabic) to bound CLS; total font budget ≤ 180KB per direction.
- Icons: constructed line-1.5 set, single sprite, currentColor.
- Skeletons (P02) mirror final geometry so route swaps never shift.

## Data-path rules

- Document list pages ≤ 50 items per cursor page (07b limit); virtualization threshold 200 rows (P19).
- Subscriptions (stream events) coalesce: token events batched to sink at most once per frame; UI never re-renders per token.
- Jobs poll per async-contract; no polling on surfaces where the job has no visible state.
- Offline queue (P20) stores block patches, not whole documents; conflict reconciliation uses baseRevisionId (07b).

## Measurement protocol (spec-level acceptance)

1. Cold load (throttled): LCP/CLS/TBT recorded for S1 and S3 in both directions.
2. Typing benchmark: 200-block document, 10-minute typing script, keystroke-to-paint p95 ≤16ms with AI panel open.
3. Stream benchmark: 140-token generation — zero layout shifts beyond the reserved region; citation chip bind without reflow.
4. Reduced-motion + RTL variants of every benchmark (same budgets).
