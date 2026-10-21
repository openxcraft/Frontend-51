# 10 — Performance: clinic-appointment-desk

## Route budgets (gzip JS)

S1 day board + shell ≤ 170KB · booking overlay + slot picker ≤ 60KB lazy · waitlist console ≤ 70KB lazy · messages ≤ 60KB lazy · schedule/policies ≤ 80KB lazy · S9/S10 ≤ 110KB · palette ≤ 30KB incremental. Non-AI fast-path honesty: every synchronous read (board, fills, patient stats) renders without a spinner — computed answers under budget never fake waiting (07c).

## Interaction budgets

- **Day board**: board render (60 appointments, 3 providers) ≤ 120ms p95; block focus highlight < 80ms; state-flip paint (check-in, complete) < 100ms including the summary-count delta; >200 blocks per day virtualize per column (P19) — scroll never moves focus.
- **Waitlist fill computation: ≤150ms at seed scale (≤200 active entries, ≤60 candidates ranked), ≤400ms at 2,000 entries** — synchronous by design (07b); if a future clinic exceeds the budget, the fill becomes a Job (async-contract threshold) rather than a spinner lie. The budget is the contract that keeps the refill moment instant.
- **Patient finder**: keystroke-to-result ≤16ms at 10,000 patients (normalized bilingual search — rtl-rules §4); phone exact-match hit renders first.
- **Offer countdown**: minute-boundary text updates ≤8ms paint; never per-second re-render (throttle is a budget, not a style choice).
- **Slot picker**: free-slot computation for one provider-day ≤40ms; picker open-to-interactive < 150ms.
- **Message batch send**: paced 60ms/message (07c cadence) as an honest Job with per-message progress; never faked-instant.
- **Exports**: 3-stage paced job (07c); artifact fetch < 400ms once ready.
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (the board reserves column geometry before data lands — skeleton mirrors per direction, P02; the drawer reserves its width; the Slot Refill settles inside an already-reserved slot outline — zero layout shift by construction).

## Perceived-performance strategy

- The day board is the working memory: it renders from last-known state instantly on re-entry and reconciles in place (P20 posture) — a receptionist's surface never blanks.
- Booking is a two-step overlay with the finder pre-focused (⌘V lands there) — the phone-call tempo is the budget the flow is designed around (02 Reem).
- Fill proposals render the ranked list before any send action — the computation is instant, the communication is paced (honest async where it is genuinely async).
- Offer countdowns are text with a minute-boundary announce throttle — urgency without animation noise (calm personality).
- Offline (P20): reads render last-known with the persistent banner; writes queue with per-item state; on return, queued writes reconcile and conflicts surface both versions.

## Asset strategy

Mada (400/500/700 ar) + Instrument Sans (400–700 en) subsets ≤ 140KB/direction; filled-rounded icon sprite single file; no font-display late-swap on the time ruler and patient names (data-first paint); the print stylesheet for S9 is a separate sheet loaded only on S9.

## Data-path rules

Appointments ≤ 100/cursor per day-provider fetch (07b typed pagination); waitlist ≤ 50/cursor; messages ≤ 50/cursor; fills are immutable snapshots cached per fillId (free re-reads); job polling only on visible surfaces (S10 / board badges); every booking/reschedule/offer-response/send/export carries an idempotency key (no double-book on retry — 07b rule 9); derived patient stats recompute server-side at read (no client-side stat drift, 07a).

## Measurement protocol

1. Cold load S1 both directions (LCP/CLS/TBT) — 1280px and 360px.
2. Day-board benchmark: 60-appointment day, state-flip p95 ≤100ms; 200-block virtualization pass with zero focus loss.
3. Fill benchmark: seed scale p95 ≤150ms; 2,000-entry synthetic scale p95 ≤400ms; F-1 regression order exact (07c assertions).
4. Finder benchmark: 10,000-patient normalized search, p95 keystroke ≤16ms; phone-exact path first.
5. Offer-clock benchmark: minute-throttle paint ≤8ms; tick(4) expiry transition ≤100ms with announcement.
6. RTL + reduced-motion variants repeat 1–5 at identical budgets.
7. 400% zoom reflow pass on S1/S4/S6 both directions (a11y-baseline §8.3).
