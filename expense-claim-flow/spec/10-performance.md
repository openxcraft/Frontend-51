# 10 — Performance: expense-claim-flow

## Route budgets (gzip JS)

S1 claims home ≤ 150KB · **S2 composer + S3 receipt panel ≤ 260KB** (policy studio and approval workspace lazy at +70KB) · S4 approval workspace ≤ 210KB · S5 policy studio ≤ 180KB · S7 payouts & export ≤ 130KB. Fonts: Almarai (300/400/700/800) + Inter (400/500/600/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (skill rows 50/75-class discipline — no FOIT, no layout shift); the duotone icon sprite ships as one file.

## Interaction budgets

- **Keystroke-to-paint in amount/distance fields ≤ 16ms** (the typing path — the claimant's core loop; `inputmode` decimal keyboards per skill row 64).
- **Computation preview re-render ≤ 50ms p95** after a distance/day/rate change (07c simulates pure arithmetic; the budget binds the implementation's breakdown rendering).
- **Live findings recompute on item edit ≤ 50ms p95** (deterministic rules on ≤ 50 items; a claim is bounded small — the queue is the scale surface, not the claim).
- Queue row focus → highlight < 80ms; finding-row jump to its item < 80ms, zero layout shift.
- LCP ≤ 2.0s on S1 and S2 cold loads, both directions; CLS ≤ 0.02 — **the totals rail and the receipt draft region are both reserved at full size before their content arrives** (the two highest-risk layout-shift points in the product: amounts updating and drafts populating); skeletons mirror queue/composer geometry per direction (P02).
- Approval-gate state update after a resolution ≤ 120ms (a derived read recomputed from finding state, never a claim refetch).

## Data-path rules (queue scale is the design constraint)

- **Claim queue virtualization at >200 rows** (P19) — a 500-employee workspace's annual claim volume lives here, not inside any single claim; cursor pages ≤ 100 claim rows; scrolling never moves focus; row-count context announced on region entry.
- Findings lists cursor-paginated ≤ 100; the findings rail renders severity-sorted with stable keys (resolution must not re-sort mid-reading).
- Claim payloads cap items at 50 (07c seed scale ≤ 6); the composer's live totals compute client-side from the deterministic rules — the adapter's returned view is the authority on commit (optimistic reading, authoritative writing).
- **Export packages are Jobs** (async-contract §1): determinate per-claim progress ("Exporting 12 of 31 claims"); period exports at a 500-claim year cap stage by month; artifacts expire at 7 days and regenerate deterministically — the UI never simulates synchronous completion of a period pack.
- **Receipt extraction is a Job at slow configurations** (07c paces 120ms/field ≈ 600ms typical — under the 2s Job threshold, but the partial-failure path keeps Job semantics for the jobs console); the draft region's reserved size means field arrival causes zero reflow.
- Offline queue stores item patches and receipt attachments with baseRevision anchors; submission and decisions queue with idempotency keys and reconcile to authoritative state on reconnect (async-contract §5; P20).

## Perceived-performance strategy

1. **Reserved money regions**: totals rail + draft region pre-sized — the product's two live-updating surfaces never push layout (CLS ≤ 0.02 by construction).
2. **Deterministic-first rendering**: per-diem/mileage previews render instantly from the local rules; the adapter's response confirms — the claimant never waits on a round-trip to see arithmetic.
3. **Queue-first IA**: the approver's judgment surface (S4) loads the claim view once; findings and chain are part of that payload — no N+1 finding fetches during review.
4. **Honest determinate progress everywhere** (exports, extractions) — never an indeterminate bar claiming percentage (async-contract §3).
5. Route-level code splitting keeps S2+S3 inside 260KB while the policy studio and approval workspace load on first navigation.

## Measurement protocol

1. Cold load S1 + S2, both workspace directions, ar-primary and en-primary claim fixtures (LCP/CLS/TBT).
2. Typing benchmark: 12-digit amount field edit at keystroke-to-paint p95 ≤ 16ms, both `inputmode` keyboards.
3. Preview benchmark: distance edit 142 → 138 km — breakdown + totals re-render ≤ 50ms p95, zero layout shift.
4. Queue benchmark: 5,000-claim fixture — virtualized scroll performance and focus preservation (P19) with row-state announcements; filter + saved-view application < 100ms.
5. Extraction benchmark: 5-field Arabic receipt draft — reserved region zero-reflow on every field arrival; partial-failure path keeps completed fields without repaint of arrived rows.
6. Export benchmark: 31-claim period pack — determinate progress visible from job start; per-format partial retry completes without full-package re-run.
7. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
