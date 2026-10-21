# 10 — Performance: loyalty-stamp-card

## Route budgets (gzip JS)

S1 console home ≤ 120KB · S2 stamper shell ≤ 140KB (the product's face — smallest route budget in the product; the counter opens this 150+ times a day) · S3 studio + preview ≤ 180KB (lazy-loaded off the rail; S8 insights + 40KB) · S5/S6 members ≤ 150KB · S7 member pass ≤ 90KB (phone-first, token-keyed, loads on a member's mobile connection — the tightest budget of all) · S11 palette ≤ 30KB incremental.

## Interaction budgets (the counter is the product)

- **Stamper search: keystroke-to-paint ≤16ms** (normalized bilingual matching runs client-side over the current page; 10), result resolve ≤120ms p95 at seed scale.
- **Card sheet open ≤100ms** from resolve (geometry reserved — the stamp-dot cluster renders from counts, never re-measured).
- **Stamp commit: ≤250ms perceived** — optimistic dot fill renders immediately (P03), the adapter confirms within the budget, and the undo affordance is live from frame one; the ledger write is the authoritative completion (async-contract honesty: the UI never fakes the commit, the optimistic state is marked).
- **Undo ≤150ms**; redemption confirm → receipt line ≤250ms.
- **Member identification total (search + resolve + sheet): ≤3s** at the counter including the human — the research-anchored register-identification budget (01, source 51); the product's own share of that budget is the 120ms + 100ms above.
- **Expiry/status derivation at read: ≤5ms per card** (lazy calendar arithmetic, 07c §2.3) — the stamper never waits on a status sweep.
- **Insights: ≤300ms at seed scale (≤50k events), ≤800ms at 500k events** — synchronous by design; a dataset beyond the budget converts insights to a Job (async-contract threshold) rather than a spinner lie.
- **Flag recompute (with every audit list call): ≤40ms** at seed scale — two count queries over a windowed range.
- LCP ≤ 2.0s both directions on S2 and S7; CLS ≤ 0.02 (the stamp-dot cluster reserves dot geometry before data arrives — the card's dots never shift on load; skeletons mirror final geometry per direction, P02).
- Fonts: Baloo Bhaijaan 2 (400/500/700/800 ar) + Plus Jakarta Sans (400–700 en) subsets ≤ 140KB/direction; the pass view (S7) ships the member-locale subset first (≤ 90KB total route).

## Virtualization and data-path rules

Members ledger and audit ledger virtualize beyond 200 rows (P19) — scroll never moves focus; focus moves scroll into view; row-count context announced on region entry. Pages ≤100 rows/cursor (07b typed pagination); audit ≤100/cursor with flags riding the first page response. Job polling only on visible surfaces (S8/S10 and the export toast). Stamp submits carry idempotency keys — a retried tap never double-stamps (07b rule 7). Offline: the pass view caches last-known card state (read-only, honest "as of" timestamp); counter stamps queue with per-item state and re-validate cap/expiry/CONFLICT against authoritative state on reconnect (P20 — a queued stamp that fails re-validation surfaces its typed error at the counter, never silently drops).

## Perceived-performance strategy

- The stamper is optimistic with an honest marker: the dot fills instantly, a hairline "pending" ring marks the in-flight stamp, and the ring clears on adapter confirmation — the queue never watches a spinner for a 250ms operation (P12 does not apply: nothing here exceeds the Job threshold by design).
- Insights tiles render counters first, formulas on demand (the number is the payload; the arithmetic is one action away).
- Exports are honest Jobs (P12): determinate row progress, cancellable, artifact + expiry delivered in context.
- Studio drafts autosave at 800ms debounce with the P10 calm cycle (saving → saved fade → conflict surfaces both versions).
- The command palette indexes ≤ 2,000 recent members/programs/audit targets client-side with normalized keys (rtl-rules §4); beyond that it defers to the server-side lookup.

## Measurement protocol

1. Cold-load S2 and S7, both directions (LCP/CLS/TBT) on 1280px and 360px viewports.
2. Stamper benchmark: 10-key Arabic search sequence, p95 keystroke ≤16ms; resolve → sheet ≤120ms + 100ms; the 3-second identification budget timed end-to-end including a scripted "scan QR" gesture.
3. Stamp round-trip: 200 sequential stamps against the Mock Adapter — p95 perceived ≤250ms, zero optimistic-state orphans after reconcile.
4. Insights benchmark: seed-scale p95 ≤300ms; 500k-event synthetic scale p95 ≤800ms; flag recompute ≤40ms.
5. Ledger benchmark: 1,000-row audit virtualized scroll, zero focus loss, row-count announced once on region entry.
6. RTL + reduced-motion variants repeat 1–5 at identical budgets; 400% zoom reflow pass on S2/S5/S7 both directions (a11y-baseline §8.3).
