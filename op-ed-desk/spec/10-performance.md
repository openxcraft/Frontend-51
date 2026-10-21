# 10 — Performance: op-ed-desk

## Route budgets (gzip JS)

S1 ≤ 140KB · S2/S3 ≤ 220KB (decision composer lazy +60KB) · S5 ≤ 120KB · S9 ≤ 90KB (360px-first).

## Interaction budgets

- Finding anchor jump (focus + scroll + highlight): **<80ms**, zero layout shift.
- Letter composer keystroke-to-paint ≤16ms.
- Queue row → detail first paint ≤300ms on the 48-row seed; LCP ≤ 2.0s; CLS ≤ 0.02 (skeletons mirror ruled geometry; job regions reserved before lint starts — P02/P13).
- **Queue at slush scale**: virtualization >200 rows (P19) with focus preservation; row render ≤2ms median; filter re-sort ≤120ms at 1,000-row production scale.
- **Lint latency**: deterministic pass on a 900-word piece ≤2s as an honest category-paced Job; full pass metered and progress-labeled — never a fake spinner (async-contract §3).

## Perceived-performance strategy

The queue is optimistic-free by design (decisions are consequential, not reversible typing) — speed comes from keyboard paths and reserved regions, not optimistic writes. Intake pre-checks run during submit (results on the receipt, no blocking wall). Job completion lands in-context (async-contract §6.1).

## Asset strategy

Noto Naskh Arabic (400/700) + Newsreader (400–700) subsets ≤150KB/direction; line-1.5 icon sprite single file; no illustration assets.

## Data-path rules

Submission pages ≤50/cursor; contributor pages ≤30/cursor; anonymized view fetched once per version, cached until version changes; job polling only while jobs/lint surfaces visible; offline = read-only queue + queued writes (P20) with idempotent send retries (07b rule 4).

## Measurement points

1. Cold load S1/S3/S9 both directions (LCP/CLS/TBT) at 1280px and 360px.
2. Anchor-jump benchmark: 14-finding traversal, p95 <80ms, zero CLS.
3. Queue-scale benchmark: 1,000-row synthetic slush — virtualized scroll + filter re-sort p95 ≤120ms, focus preserved.
4. Composer typing (200-word letter, p95 ≤16ms).
5. Lint job pacing audit: honest category progress, cancel within one interaction.
6. RTL + reduced-motion variants of all above — same budgets (minimal-motion identity makes this cheap, 05).
