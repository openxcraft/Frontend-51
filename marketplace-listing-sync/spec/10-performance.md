# 10 — Performance: marketplace-listing-sync

## Route budgets (gzip JS)

S1/S3 ≤ 150KB · **S5 mapping studio ≤ 260KB** (suggestion panel + rule-pack editor lazy at +70KB) · S4 master editor ≤ 200KB · S6/S7/S8 ≤ 160KB · S9/S10/S11 ≤ 110KB. Fonts: Cairo (400/500/600/700) + Sora (400/500/600/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (skill rows — no FOIT, no layout shift).

## Interaction budgets

- **Keystroke-to-paint in master-field editing ≤ 16ms** (the typing path — paired columns type in both locales).
- **Live finding recompute ≤ 80ms p95** per single-listing recompute after a master/override edit (07c simulates at ≤60ms; the budget binds the implementation's rule arithmetic across a 16-rule pack).
- Mapping-row focus → highlight < 80ms; suggestion accept → staged row renders < 80ms, zero layout shift.
- Board row focus → highlight < 80ms; blocker jump-to-source < 80ms.
- LCP ≤ 2.0s on S1 and S5 cold loads, both chrome directions; CLS ≤ 0.02 (table and rail geometry reserved; the attribute-rail width is reserved when collapsed; skeletons mirror the studio layout per direction — P02).
- Readiness verdict update after a resolution/edit ≤ 120ms (derived read — recomputed from finding state, never a refetch of the channel).
- Stale-count update after a mapping save ≤ 150ms (derived from pins; the save response carries the count — 07b rule 9).

## Data-path rules (catalog scale is the design constraint)

- **Listing and findings virtualization at >200 rows** (P19) — the seed's 28 listings sit below the line by design (the *sample* experience stays small); the 5,000-SKU workspace is the design constraint: cursor pages ≤ 100 rows; scrolling never moves focus; findings fan-out (listings × rules) virtualizes with the same threshold — the findings board renders severity-sorted with stable keys (resolution must not re-sort mid-reading).
- **Compliance check is a Job** (async-contract §1): determinate per-listing progress; the UI never simulates synchronous completion of a 5,000-listing check; the seeded 24-listing check completes at the simulated cadence (40ms/listing ≈ 1.0s — visible as honest progress, not hidden as instant).
- **Staged blockers at scale** (≥2,000 listings): critical (blocker) findings stream to the readiness console as their listing is computed; the complete report lands on job completion; the board's blocked counts tick up live.
- Publish jobs: per-listing determinate progress with skipped-and-named rows rendered as they resolve; export jobs render the artifact link on completion with expiry stated.
- Offline queue stores master-edit patches and mapping saves with `baseVersion` anchors; recompute of affected listings' findings runs on reconnect (determinism makes this safe — same inputs, same findings, 07c).

## Perceived-performance strategy

1. **Staged blockers**: check results surface blockers first (the seller starts on real work while the check finishes).
2. **Zero-reflow rail**: the attribute-catalog rail's width is reserved; opening it never reflows the mapping table.
3. **Optimistic reads, authoritative writes**: boards and previews render from local state; every mutation's confirmation comes from the adapter's typed response (P03-free by design — readiness is authoritative; conflicts surface both versions).
4. **Derived verdicts, not refetches**: readiness chips and stale counts recompute locally from finding/pin state within the declared budgets.
5. **Honest determinate progress everywhere** (imports, checks, publishes, exports) — never an indeterminate bar claiming percentage (async-contract §3).

## Measurement protocol

1. Cold load S1 + S5, both chrome directions, LTR content inside RTL chrome and the reverse (LCP/CLS/TBT).
2. Typing benchmark: 60-word Arabic title edit at keystroke-to-paint p95 ≤ 16ms in the master editor's RTL column.
3. Live-recheck benchmark: edit that closes a blocker (DN-1003's title shortened below ceiling) — blocker dissolve + announcement + verdict chip flip ≤ 80ms p95, zero layout shift.
4. Virtualization benchmark: 5,000-listing board + 40,000-row findings fan-out — scroll performance and focus preservation (P19) with row-state announcements.
5. Check-at-scale benchmark: 5,000-listing channel — staged blocker delivery visible < 2s from check start; full report on job completion; cancel within one interaction (async-contract §2).
6. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
