# 10 — Performance: cod-order-confirmation

Spec commitments an implementation must meet; the Critic enforces them as budget rules. The performance story has two heroes: the **agent console queue** (a keyboard-speed instrument worked for hours — throughput IS the product, 00 §success signal 1) and the **on-call phone** (evening-surge decide actions on mid-range hardware). Reference devices: standard business laptop (console), mid-range 2024 Android-class phone on throttled 4G (on-call). The engines (risk scorecard, ladder timing, window capacity) are compute-light by design (07c) — their latency budgets are product promises, not implementation hopes.

## Route budgets (JavaScript transferred, gzip)

| Route | Budget | Strategy |
|---|---|---|
| Console shell (queue + drawer) | ≤ 220KB | queue table + drawer + trail eager; sheets, manifests, policy, templates lazy |
| Agreement + call-leg sheets | ≤ 50KB (lazy chunk) | loaded on first drawer action |
| Manifests surface | ≤ 90KB (lazy) | rail activation |
| Policy + templates + buyers | ≤ 140KB (lazy) | admin bundle, loaded on manager paths |
| On-call shell | ≤ 150KB | queue cards + order sheet + decide forms; no authoring code ships to the phone |

## Interaction budgets (the real performance surface)

- **Console TTI ≤ 2.5s / LCP ≤ 2.0s / INP ≤ 200ms / CLS ≤ 0.02 per route** on the reference laptop; on-call TTI ≤ 3.5s on throttled 4G (the evening surge starts when the buyer says "call me back at 8").
- **Queue throughput**: row focus→paint ≤ 16ms (60fps floor under j/k hold); drawer expand ≤ 120ms (in-place, no route); keystroke-to-paint in note fields ≤ 16ms with zero layout shift (bounded textarea, reserved line height).
- **Countdown ticking**: cooldown arcs and time-to-next-attempt text update at 1Hz coalesced per frame — zero reflow (tabular numerals, fixed-width columns), zero announcement (09 schedule: never announced per tick).
- **Risk computation**: `computeRiskScore` ≤ 250ms p95 client-visible (engine local-compute or adapter round-trip — either way the rail never shows a spinner for a single order); `simulateRiskPolicy` over ALL open orders (≤ 2,000) ≤ 2s with progressive per-band rendering — a Job-shaped operation per async-contract §1 if it exceeds 2s (declared threshold).
- **Window proposal**: `proposeWindowsForOrder` ≤ 200ms p95 — it sits on the tap path between confirm intent and the sheet.
- **Queue virtualization (P19)**: above 200 rows the queue virtualizes (a 2,000-order Ramadan-day book is the pathological-but-planned case); scrolling never moves focus; row-count context on region entry; event patches re-render only the affected row (subscribeOrderEvents coalescing, below).
- **Manifest build/seal**: rollup assembly for 500 orders ≤ 1.5s p95 (determinate progress if job-shaped); seal round-trip optimistic-render ≤ 100ms with adapter confirmation reconciling (P03 + idempotency — 07b rule 2).
- **Template preview**: composed buyer-view render ≤ 100ms (string composition, no layout thrash — parameters are slot fills with pre-measured widths per 11 length budgets).

## Perceived performance (console honesty)

- Queue skeletons (P02) mirror row geometry exactly (RTL-flipped, band-chip + trail columns included) so tab swaps never shift; skeleton duration is honest — first page ≤ 50 items (07b limit), one round trip.
- The drawer renders from the row's embedded data immediately (band, ladder state, countdown embedded in the list payload — one fetch for N rows), then reconciles with the authoritative getCodOrder (attempts + responses + risk drill) — detail never blocks the first paint, and corrections only ADD (a missing response can appear, an shown one never silently vanishes).
- Ladder-trail stamps fire on events (never on re-renders — the stamp choreography runs once per state change, 05); reduced-motion path is the state chip at identical cost.
- Auto-cancel resolutions arrive as events; rows patch to resolved state in place (no re-sort under the cursor — resolved rows drop out only on scroll-idle or filter refresh, announced politely if focused, 09).
- Offline queue (P20): manual-contact logs and response captures queue locally with per-item state; the drawer's action buttons render their queued state with honest timestamps; reconciliation copy per 11 (a queued capture that reaches a resolved order discards with notice — no phantom writes).

## Asset strategy

- Fonts: Arabic-first subsetting — Cairo (400/600/700/800) + Sora (400/600/700) ≈ ≤ 150KB per direction with `font-display: swap` and metric-compatible fallbacks (Noto Kufi Arabic / Noto Sans) bounding CLS (05 typography); no variable-axis bloat (rtl-rules §3 weight reality — 800 reserved for orderRef display tokens only).
- Icons: single constructed outline-geometric sprite, currentColor, 1.75px stroke grid, no per-icon requests (06).
- Explanations, labels, and rule previews are DATA (bilingual templates + numeric params — 07a), not rendered artifacts — no per-locale image variants, no layout cost per language.
- The countdown arc is SVG stroke-dashoffset on a composited layer — no width/layout animation anywhere in the tick path.

## Data-path rules

- Cursor pages ≤ 50 items (07b limit); the queue fetch embeds band, ladder micro-state, countdown basis, and agreement summary per row (one round trip, not N); drawer detail fetch carries attempts + responses + risk in one payload (getCodOrder's compound return — no waterfall).
- subscribeOrderEvents coalesces: events batch to the sink at most once per frame; attempt.state storms (a 60-order import all sending attempt 1) render as one queue patch; capacity decrements and agreement stamps are single-row patches.
- Jobs poll per async-contract only where visible (import sheet, manifests surface, jobs center); no background polling on queue surfaces — return-state (async-contract §6.3) surfaces unfinished business on app re-entry.
- Offline queue stores action payloads (bounded: response captures, contact logs), never queue snapshots.
- The risk engine's inputs are denormalized counts (07a BuyerHistory) — scoring never re-derives history from event streams at render time; recompute appends an immutable row (07a) and the rail patches in place.

## Measurement protocol (spec-level acceptance)

1. Cold load on reference laptop + throttled 4G phone: TTI/LCP/CLS for console shell and on-call shell, both directions (ar/en).
2. The 00 §success-signal walkthrough scripted end-to-end: 12-order queue cleared keyboard-only ≤ 6 min with decision round-trips logged; j/k hold at 60fps; the full order journey (import → ladder → agreement → manifest) wall-clock ≤ 4 min on the mock with zero CLS events across 6 screens.
3. Scoring benchmark: single-order compute ≤ 250ms p95; simulation over 2,000 open orders ≤ 2s progressive; explanation drill expand ≤ 100ms.
4. Queue benchmark: 2,000-row virtualized scroll at 60fps with focus preservation; event-storm patch (60 events in 1s) = one batched render.
5. Reduced-motion + RTL variants of every benchmark (same budgets — motion and direction never buy or cost performance).
6. Determinism audit: two consecutive 07c replays produce byte-identical scores, schedules, event orders, and artifact descriptors (the trust contract is also a performance guarantee — no recompute drift).
