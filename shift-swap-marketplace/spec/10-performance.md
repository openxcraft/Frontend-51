# 10 — Performance: shift-swap-marketplace

Spec commitments an implementation must meet; the Critic enforces them as budget rules. The performance story has two very different heroes: the **worker phone** (mid-range device, prepaid data, mid-shift glances — the product's actual daily surface) and the **console** (queue throughput as a keyboard-speed instrument). Reference devices: mid-range 2024 Android-class phone on throttled 4G (worker), mid-tier laptop (console). The fairness engine is compute-light by design (deterministic rules over bounded sets — 07a); its latency budget is a product promise, not an implementation hope.

## Route budgets (JavaScript transferred, gzip)

| Route | Budget | Strategy |
|---|---|---|
| Worker shell (S1/S2/S5 tabs) | ≤ 180KB | tab shell + list/board core eager; wizard, detail drill, policy sheet lazy |
| Offer detail (S3) | ≤ 60KB (lazy chunk) | ribbon + ladder modules load on first board-card activation |
| Console queue (S11/S12) | ≤ 260KB | queue + drawer eager; rules/policy/people/ledger routes lazy |
| Rules & policy (S14–S16) | ≤ 120KB (lazy) | loaded on rail activation |
| Ledger & jobs (S17) | ≤ 80KB | tiny surfaces, shared primitives |

## Interaction budgets (the real performance surface)

- **TTI on the worker surface ≤ 3.5s on throttled 4G / mid-range phone** (the 00 §success-signal journey starts between smoke breaks — the shell must be interactive before patience ends); LCP ≤ 2.5s; **INP ≤ 200ms** on all interactive paths; CLS ≤ 0.02 per route.
- **Fairness computation latency**: `computeFairnessRanking` on a live offer (≤ 20 candidates, bounded by caps) renders the ladder in **≤ 400ms p95** client-visible (engine local-compute or adapter round-trip budget — either way, the ladder never shows a spinner for a bounded set); policy simulation over ALL open offers (≤ 200 offers × ≤ 20 candidates) ≤ 2s with per-offer progressive rendering (it is a Job-shaped operation per async-contract §1 if it exceeds 2s — the spec's declared threshold).
- **Eligibility pre-flight** (the panel that gates every request) ≤ 250ms p95 — it sits on the tap path between card and request button.
- **Board virtualization** (P19): offers list virtualizes above 200 rows (a 200-offer board is a pathological-but-possible Ramadan-season case); scrolling never moves focus; row-count context on region entry; rank-delta mutations reconcile without full re-render (event-driven row patches via subscribeSwapEvents).
- **Console queue throughput**: row focus→paint ≤ 16ms (60fps floor under j/k hold); drawer open ≤ 180ms; decision round-trip optimistic-render ≤ 100ms with adapter confirmation reconciling (P03 pattern with idempotency — 07b rule 2).
- **Keystroke-to-paint in the deny-rationale note field ≤ 16ms** — the supervisor types under time pressure; no layout shift while typing (rationale templates swap as chip text, reserved line height).

## Perceived performance (worker-surface honesty)

- Board skeletons (P02) mirror card geometry exactly (RTL-flipped) so the tab swap never shifts; skeleton duration is honest — the board is bounded (site/team scope, caps), so loads are short by construction.
- The eligibility panel renders optimistically from the offer card's embedded gaps data (fetched with the page), then reconciles with the authoritative checkSwapEligibility result — the amber/red state can only *appear*, never silently improve (a rule violation is never optimistic-away).
- Rank deltas arrive as events; the ladder row patches in place (no re-sort animation under the user's finger — reordering happens off-viewport or on scroll-idle, announced politely per 09).
- The Swap Handshake runs ONLY on the confirm event (never on re-renders); reduced-motion path is the state chip (identical cost).
- Offline queue (P20): writes queue locally with per-item state; the worker's own offer/request cards render their queued state with an honest timestamp; reconciliation copy per 11 (a queued request that reaches a dead offer discards with notice — no phantom optimism).

## Asset strategy

- Fonts: Arabic-first subsetting — Cairo (400/600/700) + Sora (400/600/700 Latin) ≈ ≤ 150KB per direction with `font-display: swap` and metric-compatible fallbacks (Noto Kufi Arabic / Noto Sans) bounding CLS (05 typography); no ninth weight, no variable-axis bloat (rtl-rules §3 weight reality).
- Icons: single constructed duotone sprite, currentColor, no per-icon requests.
- Rationale strings and rule previews are DATA (bilingual templates + numeric params — 07a), not rendered artifacts — no per-locale image variants, no layout cost per language.

## Data-path rules

- Cursor pages ≤ 50 items (07b limit); board fetches embed eligibility-gap data per card (one round trip, not N); ladder fetch (listRequestsForOffer) is un-paginated by cap design (≤ 20 rows) — the contract documents the bound.
- subscribeSwapEvents coalesces: events batch to the sink at most once per frame; rank.changed storms (10 requests in one second) render as one ladder patch.
- Jobs poll per async-contract only where visible (S17/import sheet); no background polling on worker surfaces — return-state (async-contract §6.3) surfaces unfinished business on app re-entry.
- Offline queue stores request/decision payloads (bounded), not board snapshots.

## Measurement protocol (spec-level acceptance)

1. Cold load on throttled 4G: TTI/LCP/CLS for worker shell and console queue, both directions (ar/en), both themes.
2. The 00 §success-signal walkthrough scripted end-to-end on a 360px viewport: total journey wall-clock ≤ 90s with network on; tap-to-feedback p95 ≤ 200ms per step; zero CLS events across the 5 screens.
3. Ranking benchmark: 20-candidate ladder render p95 ≤ 400ms; rationale drill expand ≤ 100ms; simulation over 200 offers ≤ 2s (progressive).
4. Console throughput benchmark: 12-item queue cleared keyboard-only ≤ 5 min (00 success signal) with decision round-trips logged; j/k hold at 60fps.
5. Reduced-motion + RTL variants of every benchmark (same budgets — motion and direction never buy or cost performance).
6. Determinism audit: two consecutive 07c replays produce byte-identical rationale strings and event orders (the trust contract is also a performance guarantee — no recompute drift).
