# 10 — Performance: asset-register-tracker

## Route budgets (gzip JS)

S1 registry ≤ 150KB · S2 asset detail ≤ 180KB (timeline lazy +40KB) · S3 labels ≤ 160KB (QR generation + sheet renderer lazy +70KB — nothing QR-related loads on non-label routes) · S4/S5/S6 ≤ 110KB · M1 scan companion ≤ 120KB (camera decode module lazy +60KB after first user intent — never on initial load).

## Interaction budgets

- **Registry grid**: keystroke-to-paint in inline edit ≤16ms (typing path); filter chip apply → first row repaint <120ms at seed scale (312 assets); sort switch <150ms.
- **Virtualization (P19)**: >200 rows virtualize; scroll never moves focus; 10,000-row synthetic registry scrolls at 60fps with DOM nodes capped (row window ± overscroll); row-count context announced on region entry (a11y pairing, not a perf tax).
- **Scan lookup**: decode→asset-card perceived latency <600ms target on mid-tier mobile (camera decode + `lookupByScan` round trip); the card skeleton mirrors the card; manual tag entry path returns in <300ms at seed scale — both paths budgeted because manual entry is an equal path, not a fallback (09).
- **Custody event commit**: signature confirm → event rendered on the timeline + announcement <250ms; offline-queued events render instantly in queue state (P20 honesty, zero spinner theater).
- **Label sheet**: batch preview render (60 labels) <400ms; sheet artifact generation is a Job with unit-count progress (40ms/label cadence in the mock; honest pacing in any binding — never fake instant).
- LCP ≤ 2.0s on S1 and M1 cold loads; CLS ≤ 0.02 (state chips and timeline entries reserve layout; skeletons mirror geometry per direction — P02).

## Asset strategy

Almarai (400/700/800 ar) + Inter (400/500/600/700 en) subsets ≤ 150KB/direction; line-2 icon set single sprite (QR glyph included); label-sheet print renderer and camera decode are lazy routes (budgets above). No web fonts on the scan companion's first paint beyond the ar subset in use (locale-aware).

## Data-path rules

- All lists cursor-paginated (`Page<T>`); page sizes: assets 50/cursor, custody events 30/cursor (chains are long — the timeline pages by seq, never loads whole chains).
- Registry virtualization threshold 200 rows (P19); location-tree rollup counts computed read-side per query (no write amplification).
- Job polling only on visible surfaces (S3/S7/M1 in walk mode); polling pauses on `visibilitychange`.
- Offline queue: custody events and label-applied confirmations stored as idempotent payloads (≤5KB/item); per-item state reviewable; reconcile on reconnect (P20).
- Export packs generate server-side (Job); the UI never assembles a 312-row × N-event pack client-side.

## Non-AI fast-path honesty

Every read path is synchronous-fast and deterministic by design (07c): lookups, filters, timeline pages carry **no progress chrome** — a spinner on a synchronous read is a defect (the non-AI declaration is measurable here, mirroring the portfolio's deterministic-pass discipline). The only permitted progress surfaces are Jobs (label batches, exports) with unit counts (async-contract §3).

## Measurement protocol

1. Cold load S1 + M1, both directions, 1280px + 360px (LCP/CLS/TBT).
2. Virtualization benchmark: 10,000-row synthetic registry — scroll 60fps, focus preservation during scroll, row-window cap verified.
3. Scan-path benchmark: decode→card p95 <600ms on a mid-tier device profile; manual-entry path p95 <300ms at seed scale.
4. Typing benchmark in inline edit (200-char note field, p95 ≤16ms).
5. Timeline benchmark: 40-event chain (worst-case seeded) — page load, correction-link traversal, RTL variant.
6. Reduced-motion + 400% zoom variants repeat every budget above (same numbers — motion state changes nothing about data paths).
