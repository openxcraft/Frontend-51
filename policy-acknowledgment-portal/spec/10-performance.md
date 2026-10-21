# 10 — Performance: policy-acknowledgment-portal

Numbers are budgets, not aspirations; each carries its measurement point. The product is a synchronous-evidence tool with three honest Job classes (import, dispatch, export) — nothing else is allowed to feel like waiting.

## Route budgets (gzip JS)

S1 register + console shell ≤ 150KB · S2/S3 policy detail + publish ≤ 190KB (body preview lazy +40KB) · S5 coverage console ≤ 170KB · E1/E2 acknowledger portal ≤ 120KB (mobile-first shell; body-only payloads) · S7 ledger ≤ 110KB · palette ≤ 30KB incremental.

## Interaction budgets

- **Attestation submit (the product's namesake action): ≤ 400ms perceived end-to-end** (typed-name confirm → ledger entry → Ledger Line + announcement). Measured at the E2 surface on a throttled 3G-fast profile — if the ledger append cannot meet the budget, the submit stays optimistic-pending with an honest "recording…" state, never a fake instant (P12 honesty at synchronous scale).
- Reader body open (E2): **first paint of body text ≤ 1.0s** at seed scale (a 40KB body); heading-focus navigation ≤ 16ms per hop; locale toggle re-render ≤ 150ms (both bodies are loaded once, rendering is a direction swap).
- Coverage console: **zone recompute after any mutation ≤ 150ms** at seed scale (28 assignments) and ≤ 400ms at 2,000 assignments — the arithmetic is derived at read (07c G4/G5) and that derivation is the budget's subject; drill-down to a person row ≤ 100ms.
- Register: keystroke-to-paint in bilingual normalized search ≤ 16ms; row focus highlight < 80ms; virtualization window at >200 rows (P19) — scroll never moves focus.
- Ledger: page fetch ≤ 100 rows/cursor; filter apply ≤ 150ms at 10,000-entry scale (the ledger grows forever by design — pagination is the contract, not a workaround).
- Publish: body digest computation ≤ 50ms per 100KB body (the mock's declared function; real implementations must beat it or move it into the Job class).
- LCP ≤ 2.0s both directions both shells; CLS ≤ 0.02 (coverage arithmetic rows reserve their geometry before fetch; skeletons mirror register/console/ledger geometry per direction — P02; the Ledger Line reserves zero additional layout).
- Import job: paced 60ms/row-chunk with determinate row progress (async-contract §3 — "استيراد 120 من 400" class copy); dispatch: per-recipient accounting at 60ms/recipient batch tick; export: per-section determinate progress.
- No spinner on synchronous reads (non-AI fast-path honesty — the house rule from asset-register-tracker's 10): lists render skeletons only on first fetch; re-fetches swap content atomically.

## Perceived-performance strategy

- Jobs are honest: import/dispatch/export show determinate unit progress, cancel is real and fast, partial results are delivered per declared policies (07b rule 9) — no faked-instant anything.
- Coverage arithmetic re-derives locally between polls and reconciles to authoritative state on signal (optimistic zone counts, honest reconciliation — the adapter stays authoritative, P03 discipline applied to reads).
- Offline (P20): register/coverage/ledger reads work from cache; acknowledgment submits queue with per-item state and reconcile to the ledger on return — the ledger remains the single truth, and a queued submit renders as "recording…" not "recorded" (evidence honesty beats perceived speed).
- The acknowledger portal is the lightest shell in the portfolio's business_ops family by design: Mariam's phone completes an attestation without loading a single console component (route budgets above enforce the split).

## Asset strategy

IBM Plex Sans Arabic (400/500/600 + 700 reader-heading subset) + IBM Plex Sans (400/500/600/700) subsets ≤ 150KB/direction; line-2 icon sprite single file; no font-display late-swap on E2 body text (the document paints first).

## Data-path rules

People/ledger/acknowledgment pages ≤ 100/cursor (07b typed pagination); register virtualizes >200 rows; ledger pagination is permanent (append-only growth); job polling only on visible surfaces (S9 console, campaign badges); every consequential submit carries an idempotency key (no double-record on retry — 07b rule 8); body text delivered once per assignment view session (locale switch is a re-render, not a refetch).

## Measurement protocol

1. Cold load S1 and E1/E2, both directions, both viewport classes (LCP/CLS/TBT).
2. Attestation benchmark: E2 submit p95 ≤ 400ms on throttled 3G-fast, 20 consecutive submits, zero duplicate ledger entries (idempotency proof).
3. Coverage benchmark: 28-assignment seed p95 ≤ 150ms zone recompute; synthetic 2,000-assignment campaign p95 ≤ 400ms; person drill ≤ 100ms.
4. Ledger benchmark: 10,000-entry synthetic ledger, filter + page p95 ≤ 150ms.
5. Reader benchmark: 40KB AR body open ≤ 1.0s; heading-hop p95 ≤ 16ms; locale toggle ≤ 150ms.
6. RTL + reduced-motion variants repeat 1–5 at identical budgets; 400% zoom reflow pass on E2 and S5 (a11y-baseline §8.3).
