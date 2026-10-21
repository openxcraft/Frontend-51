# 10 — Performance: helpdesk-triage-desk

## Route budgets (gzip JS)

S1/S8 ≤ 150KB · **S2 triage queue ≤ 260KB** (cluster editor + policy studio lazy at +70KB) · S3 ≤ 180KB · S4/S5 ≤ 160KB · S6/S7 ≤ 150KB · S10/S11 ≤ 110KB. Fonts: Noto Kufi Arabic (400/500/700) + Space Grotesk (400/500/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (skill rows 10/78 — no FOIT, no layout shift).

## Interaction budgets

- **Queue row focus → highlight < 80ms**; ⌘↓/⌘↑ jump to next P1-or-at-risk < 100ms including scroll-into-view (the triager's core loop key).
- **Severity re-assessment on a single ticket (tier correction) ≤ 50ms p95** — deterministic matrix arithmetic, simulated ≤30ms in the mock (07c); the budget binds the implementation's rule evaluation.
- **Language detection on paste ≤ 50ms p95** for a 500-word body (script-ratio arithmetic — no model, no excuse).
- **SLA monitor derived recompute ≤ 120ms** (it is a derived read from event history — recomputed, never a refetch of the workspace, 07b rule 10).
- **Handoff Settle signature ≤ 160ms total + announcement**, route-commit path only (05).
- LCP ≤ 2.0s on S1 and S2 cold loads, both directions; CLS ≤ 0.02 (queue geometry reserved; skeletons mirror row geometry per direction — P02; the severity-badge and SLA-countdown column widths are reserved even when empty so state arrivals cause no reflow; the cluster board reserves card dimensions for proposals).
- Keyboard keystroke-to-paint in term-editor and note fields ≤ 16ms (typing path).

## Data-path rules (queue scale is the design constraint)

- **Queue virtualization at >200 rows** (P19 — the portfolio threshold, stricter than the skill's 50, wins); cursor pages ≤ 100 ticket rows; scrolling never moves focus.
- Cluster member lists and activity logs cursor-paginated ≤ 100; activity renders newest-first with stable keys (a new entry must not re-sort what is being read).
- **Clustering and re-assessment are Jobs** (async-contract §1): determinate per-ticket progress; the UI never simulates synchronous completion for a 5,000-ticket backlog; the mock's cadence (40ms/10 tickets) sets the honest-progress reference — visible, not hidden as instant.
- At-scale clustering (≥5,000 tickets): staged delivery — rule-match assignments surface as their tickets compute (the triager starts on real placements while the run finishes); the queue's unclustered count ticks down live.
- **Monitor polling only when visible** (queue surfaces) — background tabs suspend job polling; the return-state reconciliation happens on focus (async-contract §6.3).
- Offline queue stores triage writes (assignments, routes, dispositions, notes, response logs) with revision anchors; SLA clocks recompute from event history on reconnect — an offline hour never corrupts a ledger (P20 + 07a derivation rule).

## Perceived-performance strategy

1. **Staged rule-match delivery** during clustering runs (above) — the triager's queue fills with placements while the Job runs.
2. **Zero-reflow state columns**: severity badge, SLA countdown, and cluster chip column widths reserved on every row state — states arrive without layout shift.
3. **Optimistic reading, authoritative writing**: queue and detail reads render from local state instantly; every mutation's confirmation comes from the adapter's typed response (P03-free by design — triage state is authoritative; conflicts surface both versions rather than optimistic overwrites).
4. **Derived reads over refetches**: the SLA monitor and queue SLA fields recompute locally from clock arithmetic (07c rule 6) — no network on every countdown tick.
5. **Route-level code splitting** keeps S2's 260KB budget while cluster editor and policy studio load on first navigation.

## Measurement protocol

1. Cold load S1 + S2, both workspace directions (LCP/CLS/TBT).
2. Queue-traversal benchmark: 5,000-ticket fixture — ⌘↓ jump-to-P1 p95 < 100ms, focus preservation (P19) with row-state announcements intact.
3. Paste-intake benchmark: 40-ticket bilingual batch — detection + assessment complete, first row interactive < 1s; keystroke-to-paint p95 ≤ 16ms in note/term fields.
4. Tier-correction benchmark: severity re-assessment round-trip ≤ 50ms p95 with zero layout shift in the assessment panel.
5. Monitor benchmark: 2,000 open tickets — derived recompute ≤ 120ms on state change; breach-ledger timeline render < 200ms.
6. Clustering-at-scale benchmark: 5,000-ticket run — first staged assignment visible < 2s from run start; cancel within one interaction (async-contract §2).
7. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
