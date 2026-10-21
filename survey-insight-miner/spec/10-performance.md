# 10 — Performance: survey-insight-miner

## Route budgets (gzip JS)

S1/S2 ≤ 150KB · **S3 theme board + S5 reader ≤ 260KB** (crosstab console + theme detail editor lazy at +70KB) · S6 ≤ 130KB · S7/S8/S9/S10 ≤ 110KB. Fonts: Noto Sans Arabic (400/500/600/700) + Manrope (400/500/600/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (skill rows 50/75 — no FOIT, no layout shift; Arabic fallback stack per rtl-rules §3).

## Interaction budgets

- **Keystroke-to-paint in the paste preview ≤ 16ms** (intake typing path — detection chips re-render per row as typed).
- **Derived-read re-render ≤ 120ms p95** (coverage strip + share updates after assign/unassign/pin/merge — recomputed from state, never a refetch of the question, 03 CP-4).
- Board card focus → highlight < 80ms; quote pin toggle < 80ms, zero layout shift (quote-spine width reserved, 05).
- LCP ≤ 2.0s on S1 and S3 cold loads, both directions; CLS ≤ 0.02 (board card geometry reserved per provenance-state — provisional dashed vs confirmed solid borders occupy identical box metrics; quote-wall chunked at 50 with reserved rows so arrivals cause no reflow; skeletons mirror board/reader geometry per direction — P02).
- Confirm-gate open (live membership re-evaluation) ≤ 200ms p95 — the gate is truth-at-open (03 CP-3 edge), so its budget is an honesty budget, not polish.
- Search/filter in the reader ≤ 100ms p95 to first page (normalized search over local state; the normalization pipeline is the hot path — precomputed normalized index per question at import).

## Data-path rules (survey scale is the design constraint)

- **Response list virtualization at >200 rows** (P19) — the seed's 300-response question is deliberately above the line; cursor pages ≤ 100 reader rows; scrolling never moves focus. **Quote-wall chunking at 50 cards** (the skill's stricter virtualization instinct adopted where cheap — 05 LOOP-9 conflict 13).
- Theme/member lists cursor-paginated ≤ 100; the board renders all themes of a question in one page (top-K bounds it at 12 by construction — a question cannot have more floor themes than topK + confirmed + proposed; >40 themes paginate).
- **Clustering is a Job** (async-contract §1): determinate per-response progress; the UI never simulates synchronous completion for a 3,000-response question; the floor run on the 300-response seed completes at the simulated cadence (30ms/10 responses ≈ 0.9s — visible as honest progress, not hidden as instant). Runs at scale (≥3,000 responses): staged delivery — floor themes stream to the board as their keyword groups close, coverage ticks live; the complete keyword table lands on job completion.
- Export is a Job: per-format progress (report, dataset); artifacts expire at 7 days with renewal by regeneration (deterministic — same state in, same package out, 07c).
- Offline queue stores assign/unassign/pin/label-edit patches with `baseVersion`/theme anchors; derived reads recompute on reconnect (determinism makes this safe — 07c oracle).

## Perceived-performance strategy

1. **Staged floor delivery**: run → theme pipeline surfaces floor groups as their keyword closes (the analyst starts curating while the run finishes); coverage ticks up live; proposals land after the floor (they are the accelerant, not the gate).
2. **Zero-reflow evidence**: quote-spine and provenance-state geometry reserved (CLS budget); quote cards arrive with 200ms fade+settle into reserved rows — motion never pushes chrome (ai-native-patterns §2 adapted for the non-streaming Job case).
3. **Optimistic reading, authoritative writing**: board/reader reads render instantly from local state; every mutation's confirmation comes from the adapter's typed response (P03-free by design — analysis state is authoritative; conflicts surface both versions instead of optimistic overwrites).
4. **Honest determinate progress everywhere** (imports, runs, exports) — never an indeterminate bar claiming percentage (async-contract §3).
5. Route-level code splitting keeps S3+S5 at 260KB while the crosstab console and theme editor load on first navigation.

## Measurement protocol

1. Cold load S1 + S3, both workspace directions (LCP/CLS/TBT).
2. Paste-preview benchmark: 300-row paste, per-row detection chips rendering at keystroke-to-paint p95 ≤ 16ms; full-preview parse < 400ms.
3. Floor-run benchmark: 300-response seed — staged floor delivery visible < 2s from run start; complete board on job completion; cancel within one interaction (async-contract §2).
4. Derived-read benchmark: assign → coverage strip + share update ≤ 120ms p95, zero layout shift; merge → quote re-selection preview ≤ 200ms.
5. Reader virtualization benchmark: 5,000-response fixture — scroll performance and focus preservation (P19) with row-state announcements; normalized search ≤ 100ms p95 to first page.
6. Confirm-gate benchmark: open → live membership re-evaluation ≤ 200ms p95 on the 300-response seed.
7. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
