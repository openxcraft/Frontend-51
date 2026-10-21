# 10 — Performance: procurement-approval-chain

## Route budgets (gzip JS)

S1 register shell ≤ 150KB · request workspace shell (S2 composer / S3 detail, shared) ≤ 200KB with the quote-comparison and chain-rail chunks lazy (+40KB) · S4+S5 policy consoles ≤ 170KB, lazy after first paint · S6/S7 directories ≤ 110KB · S8/S9 ≤ 110KB · palette ≤ 30KB incremental. The 360px approver path (read + decide) loads the S3 subset only.

## Interaction budgets

- **Register**: keystroke-to-paint in normalized bilingual search ≤ 16ms p95 (rtl-rules §4 normalization on both scripts); row focus highlight < 80ms; virtualization above 200 rows (P19) with focus preservation — scroll never moves focus; 1,000-row register scrolls with zero focus loss.
- **Routing preview recompute: ≤ 120ms p95 at seed scale (matrix ≤ 25 rules × 6 bands, ≤ 5,000 live requests), synchronous by design** — the preview is the product's transparency spine (deterministic arithmetic, 07c rules 1–5); if a future workspace exceeds the bound, preview becomes a Job (async-contract threshold) rather than a spinner lie. The budget is the contract that keeps it synchronous at v1.
- **Quote comparison recompute ≤ 100ms** on any quote edit (ordering + deltas, 07c rule 6); line arithmetic ≤ 16ms keystroke-to-paint (typed totals update live, 06).
- **Decision path: decideStep round-trip ≤ 300ms perceived** (authority acts deserve snappy confirmation); step-state settle 280ms per stately motion (05); the seal stamp 360ms with weighted decelerate, once, on final approval only.
- **Autosave** (P10): debounce 800ms, save round-trip < 400ms perceived, calm saving→saved cycle; conflict surfaces both versions without blocking the composer.
- **LCP ≤ 2.0s both directions; CLS ≤ 0.02**: envelope-bar geometry reserved pre-render (06), chain-rail width fixed, seal glyph reserved on the document header, skeletons mirror register/composer geometry per direction (P02).
- **Budgets console**: envelope read ≤ 150ms p95 at 500 envelopes × 5,000 requests — commitments recompute at read by design (07a); the console never renders a stale cached number to avoid recomputation.
- **Exports are honest Jobs** (P12/async-contract): determinate per-format milestones, cancellable, artifact expiry countdown non-blocking (1s tick, no layout shift — text-only delta).

## Perceived-performance strategy

- Submit is synchronous-feeling with typed gate results: every refusal names its gate and resolves inline (03 CP-1 recovery) — no modal spinners on authority paths.
- The register re-fetches on focus (03 CP-2 recovery) with cursor pagination and no full-list re-render; My-Queue default view keeps the approver's first paint small.
- Progressive skeleton fill capped at one screen (P02); the composer's preview rail renders band + chain immediately from cached matrix, then budget projection settles (reserved geometry).
- Offline (P20 + declared deviation, 09): reads work, drafts queue locally with per-item state, decisions refuse to queue and reconcile on reconnect — honest beats optimistic for authority acts.

## Asset strategy

Scheherazade New (400/500/600/700 Arabic) + Libre Caslon Text (400 + italic 400, 700 Latin) subsets ≤ 160KB/direction total (Scheherazade's deep vertical metrics and glyph coverage demand aggressive subsetting — declared); line-1.5 thin-editorial icon sprite in one file; font-display blocks late-swap on the register's money columns and the quote table (data-first paint, 05 alignment rule depends on stable figures).

## Data-path rules

Request pages ≤ 50/cursor · activity ≤ 100/cursor · envelopes/positions/vendors/cost-centers ≤ 100/cursor (typed `Page<T>`, 07b rule 9) · routing previews cached per request revision and invalidated on any draft mutation · job polling only on visible surfaces (S1 badge, S9) · every double-submit-risk mutation carries an idempotency key (07b rule 6) · exports re-generate from live state — no artifact rebuild ever re-runs a decision.

## Measurement protocol

1. Cold load S1 and the request workspace, both directions (LCP/CLS/TBT).
2. Register benchmark: 1,000-row virtualized scroll + normalized search, p95 keystroke ≤ 16ms, zero focus loss.
3. Preview benchmark: seed-scale matrix + 5,000 synthetic requests, p95 ≤ 120ms; comparison recompute p95 ≤ 100ms.
4. Decision-path benchmark: decideStep perceived ≤ 300ms through the settle; "The Chain Closes" stamp ≤ 360ms with CLS 0.
5. RTL + reduced-motion variants repeat 1–4 at identical budgets (a11y-baseline §8).
6. 400% zoom reflow pass on S1/S2/S3/S5 both directions, worst-case Arabic strings (09 matrix).
