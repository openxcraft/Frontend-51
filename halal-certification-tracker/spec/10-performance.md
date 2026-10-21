# 10 — Performance: halal-certification-tracker

## Route budgets (gzip JS)

S1 register home ≤ 160KB · application workspace shell ≤ 210KB (formulation editor + decision dossier lazy +60KB) · S4/S5 directory/vault ≤ 130KB · S7 renewal console ≤ 120KB · S12 palette ≤ 30KB incremental. Fonts: Noto Naskh Arabic (400/500/600/700 ar) + Newsreader (400/500/600/700 en, text optical size) subsets ≤ 160KB/direction; line-1.5 icon sprite single file; no font-display late-swap on the register grid (register-first paint).

## Interaction budgets

- Register grid: keystroke-to-paint in normalized search ≤16ms; row focus highlight <80ms; virtualized window at 2,000+ certificate rows (P19) — scroll never moves focus.
- **Impact graph computation (the signature path): ≤300ms at seed scale (≤500 ingredients, ≤2,000 formulation lines, ≤300 certificates), ≤800ms at 10× scale (5,000 ingredients, 20,000 lines, 3,000 certificates)** — synchronous by design (07b); if a future register exceeds the 10× budget, impact becomes a Job (async-contract threshold) rather than a spinner lie. The budget is the contract that keeps the traceability answer instant at v1.
- **Rung/zone recompute after any state change: ≤150ms** for the affected certificate; cross-certificate digest refresh ≤250ms (the Monday surface must feel like arithmetic, not a query).
- Ladder timeline render (single certificate, ≤12 rungs): <100ms including dual-locale labels.
- Formulation editor: autosave debounce 800ms, save round-trip <400ms perceived (P10); line reorder commit <100ms; resolution drawer open ≤280ms (stately ceiling).
- Decision dossier first paint ≤400ms (the committee's meeting surface must not make scholars wait).
- Exports: honest Jobs (P12) with determinate document/row progress, cancellable, artifact delivery in-context when visible (async-contract §6 ladder 1).
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (impact results reserve their geometry before arrival; skeletons mirror register-grid and ladder-timeline geometry per direction, P02; no font late-swap on register rows).

## Perceived-performance strategy

- The register computes zones at read (07a derivation) — no background refresh fiction; staleness is a NETWORK banner + retry (P20), never a silently stale grid.
- Impact results render counts-first ("3 certificates affected") before the full list — the answer's magnitude arrives before its detail.
- Import jobs pace at 60ms/row-chunk with named-row progress (07c); the directory stays interactive during import (progressive merge on completion, not a locked surface).
- Ladder policy edits preview their effect as text ("future certificates pin this version; 12 live certificates keep their pinned rungs") — no speculative re-computation animation, because there is none by contract (immutability, 07a).
- Offline (P20): register reads work; writes queue with per-item state; jobs reconcile to authoritative state on reconnect.

## Data-path rules

Certificate pages ≤ 100/cursor; ingredient pages ≤ 100/cursor (07b typed pagination); supplier-certificate pages ≤ 100/cursor; >200-row grids virtualize; impact results carry no cursor (bounded by the graph itself); activity log ≤ 100/cursor with actor/action filters pushed server-side; job polling only on visible surfaces (S10 console, register badges); imports and exports carry idempotency keys (no double-charge on retry).

## Measurement protocol

1. Cold load S1 + application workspace, both directions (LCP/CLS/TBT) on 1280px and 360px.
2. Register benchmark: 2,000-row virtualized scroll + normalized Arabic search (worst-case strings from 09), p95 keystroke ≤16ms, zero focus loss.
3. Impact benchmark: 07c seed scale p95 ≤300ms; 10× synthetic scale p95 ≤800ms; severity and counts exact against the 07c regression assertions.
4. Rung/zone benchmark: single-certificate recompute p95 ≤150ms; full digest refresh p95 ≤250ms after a state mutation.
5. Dossier benchmark: first paint ≤400ms with 60-line formulation + 5 audit records.
6. RTL + reduced-motion variants repeat 1–5 at identical budgets.
7. 400% zoom reflow pass on S1/S3/S6 both directions (a11y-baseline §8.3).
