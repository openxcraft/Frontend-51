# 10 — Performance: visitor-badge-checkin

## Route budgets (gzip JS)

Desk shell (S1 board + rail) ≤ 180KB · visit detail + timeline ≤ 60KB lazy · composer S3 ≤ 40KB · studio S6 ≤ 70KB lazy (preview engine) · log S5 ≤ 50KB · **kiosk bundle ≤ 120KB total** — the lobby tablet runs ONE surface; it must boot cold fast and never lazy-load a check-in step. S10 jobs ≤ 30KB.

## Interaction budgets

- **Kiosk check-in commit (the product's critical path): typed code → confirmed badge ≤ 900ms p95 end-to-end** on the Mock Adapter at seed scale (lookup + state transition + notification event + spec resolution); each kiosk step's paint ≤ 100ms; the confirmation screen's name settle is the 120ms opacity transition (05) — inside the budget, never additive to it.
- **Board refresh after an arrival: ≤ 400ms p95** for the zone move + count update (the receptionist's peripheral glance must not wait).
- Log search keystroke-to-paint ≤ 16ms (normalized bilingual search, rtl-rules §4 pipeline); row focus highlight < 80ms.
- Badge preview re-render on spec change ≤ 150ms (both directions; text-first render makes this cheap by construction — 06).
- Export of a 23-visit day (seed scale) ≤ 2s (in-context delivery, async-contract §6 ladder 1); large archives (12 months, thousands of visits) are honest Jobs with row-count progress, never fake instant completion (P12).
- LCP ≤ 2.0s both directions on the desk shell AND the kiosk bundle; CLS ≤ 0.02 (board zones reserve geometry; skeletons mirror final layout per direction — P02; the badge preview reserves the spec's proportions before resolution).
- Kiosk idle loop: static typography, zero animation frames — the welcome screen's battery cost is a print, not a movie (10-performance spirit + motion-language §6).

## Perceived-performance strategy

- The kiosk's config is cached locally: the welcome screen renders instantly on wake with the last-known workspace name and language; config refresh happens behind the welcome, never before it (offline-tolerant first paint).
- Check-in is optimistic ONLY in the confirmation presentation: the visitor sees "تم تسجيل حضورك" the moment the local commit succeeds, while the notification event + badge resolution settle within the 900ms budget; if reconciliation fails (offline), the pass renders from the local queue state with a visible sync flag (P20 honesty — never a fake delivered notification).
- The board refreshes on arrival events (not polling timers); sweeps and exports surface as jobs with visible progress (async-contract §3: rows, visits, formats — never percentages without units).
- Offline (P20): kiosk check-ins queue locally with per-item state; reconciliation by code on reconnect (07c rule 1 makes replay deterministic); desk lists re-fetch cursor-stably; the in-building list computes from the last known state and declares its as-of instant.

## Asset strategy

Almarai (300/400/700/800 ar) + Inter (400–700 en) subsets ≤ 150KB/direction combined; the kiosk bundle ships ONLY the ar+en subsets it renders (no studio fonts); line-2 icon sprite single file; no font-display late-swap on the kiosk confirmation screen (the visitor's own name must never flash in a fallback face — 05).

## Data-path rules

Visit pages ≤ 50/cursor (07b typed pagination); log pages ≤ 100/cursor; >200 log rows virtualize with focus preservation (P19); timeline events paginate per visit (50/cursor, newest-first); job polling only on visible surfaces (S1 badge + S10); all mutation submits carry idempotency keys (no double check-in on retry); the in-building list is computed read-time, never cached beyond the declared as-of instant.

## Measurement protocol

1. Cold load desk shell + kiosk bundle, both directions (LCP/CLS/TBT) — kiosk on a mid-tier tablet profile.
2. Kiosk critical-path benchmark: code entry → confirmation ≤ 900ms p95 (V1 fixture), walk-in 3-step flow ≤ 90s wall-clock human-task budget with each step's paint ≤ 100ms.
3. Board benchmark: arrival commit → zone-move paint ≤ 400ms p95; 60-visit board render with durations ≤ 150ms.
4. Log benchmark: 1,000-visit month, virtualized scroll + normalized search, p95 keystroke ≤ 16ms, zero focus loss.
5. Studio benchmark: spec change → both-direction preview re-render ≤ 150ms; validation pass ≤ 100ms.
6. RTL + reduced-motion variants repeat 1–5 at identical budgets; 400% zoom reflow pass on S1/S5/S9 both directions (a11y-baseline §8.3).
