# 10 — Performance: hiring-pipeline-desk

## Route budgets (gzip JS)

S1 openings home ≤ 150KB · **S2 pipeline board ≤ 260KB** (board + move-menu + bulk actions; kit studio and debrief console lazy at +80KB) · S3 application detail ≤ 180KB · **S4 kit studio ≤ 240KB** (bilingual composer + assist panel) · **S5 interview + scorecard ≤ 180KB** (the interviewer's mobile-first path — the leanest writing surface in the product) · S6 debrief ≤ 160KB · S7 candidates ≤ 160KB · S8/S9/S10 ≤ 110KB. Fonts: Baloo Bhaijaan 2 (400/500/600/700) + Plus Jakarta Sans (400/500/600/700) subsets ≤ 150KB/direction, `font-display: swap` with metric-matched fallbacks (no FOIT, no layout shift); the 800 display weights load with the debrief route only.

## Interaction budgets

- **Board card focus → highlight < 80ms**; Alt+M move-menu open < 100ms from keypress; menu commit → optimistic card settle < 100ms (the 180ms settle is presentation, not latency — the card is interactive the moment it lands).
- **Board cold boot**: first stage column interactive < 1.5s, full 7-column board interactive < 2.5s on a 100-cards-per-column page, both directions (progressive column paint — the recruiter starts reading while trailing columns load).
- **Typed move rollback** (adapter CONFLICT on a stale baseStage) < 250ms including both-payload render — the undo path must never feel slower than the move itself.
- **Nudge recompute on evidence edit ≤ 50ms p95** — word count + two fixed lexicon scans, pure deterministic arithmetic (07c rules 1/3/4); the budget binds any implementation to the mock's reference cost, not to model latency (there is no model in this path, ever).
- **Coverage meter recompute ≤ 50ms** per language on every kit edit (competencies-with-questions / total — a derived read, recomputed locally, never a refetch).
- **Debrief aggregate recompute ≤ 120ms** at seed scale (2–4 cards × 4–6 competencies) and ≤ 300ms at a 10-card round — means, tally, and divergence are arithmetic over submitted cards (07c rule 6); the debrief is derived, so re-derivation is always cheaper than refetching.
- **The Cards Unseal ≤ 600ms end-to-end** (the T2 signature, 05): 5-row × ≤60ms stagger + 250ms settle + the summary announcement — motion-language §6 caps any interactive-path transition at 480ms; the unseal's extra headroom is the one success-moment flourish, and its reduced-motion variant is 0ms render + announcement (09).
- **Scorecard submit round-trip ≤ 400ms p95** (mock reference latency 90ms); autosave draft indicator responds < 100ms from keystroke-idle (queued optimistically, P10).
- **Search keystroke-to-paint ≤ 16ms** in the ⌘K palette and the candidates directory (normalized bilingual matching over locally-held pages; normalization happens at write time, never per keystroke — the translation-review-hub rule adopted verbatim).
- LCP ≤ 2.0s on S1 and S2 cold loads, both directions; **CLS ≤ 0.02 per surface**: board card geometry reserved (the tally chip, tenure line, and next-interview chip hold their space even when absent — states arrive without reflow); skeletons mirror card geometry per direction (P02 — RTL skeletons flip); the assist panel's proposal region is sized before the first proposal arrives (ai-native-patterns §2, the panel is the product's only streaming surface).

## Data-path rules (board scale is the design constraint)

- **Board virtualization at > 200 cards per column** (P19 — the portfolio threshold wins over looser skill guidance); cursor pages ≤ 100 application rows; scrolling never moves focus — focus moves scroll into view.
- Candidates directory virtualizes above 200 rows with the same focus-preservation contract; the ⌘K palette searches locally-held pages plus a debounced normalized query — never a keystroke-per-request pattern.
- **Imports, exports, and assist runs are Jobs** (async-contract §1): determinate progress in units (rows / formats / proposals); the UI never simulates synchronous completion of a 200-CV paste-import; the mock's cadences (import row-by-row determinate; assist 80ms/proposal paced) set the honest-progress reference.
- **Polling only when visible** — job progress and debrief-readiness polls suspend in background tabs; return-state reconciliation happens on focus (async-contract §6.3).
- **Offline queue stores scorecard drafts and board moves** with revision anchors (P20 — Dalal's lobby scenario is the design case): drafts submit on reconnect against their baseVersion; a stale draft surfaces CONFLICT with both payloads, never a silent overwrite; board reads render from the local cache with the staleness banner.
- Exports regenerate deterministically from unchanged state (07c) — regeneration is a compute cost, never a data-loss risk; the artifact's 7-day expiry is a retention rule, not a performance one.

## Perceived-performance strategy

1. **Optimistic board moves** (P03): the card lands in its column within 100ms while the adapter confirms; failures roll back typed and fast. Scorecard submits and decisions are never optimistic — they are the record.
2. **Zero-reflow state reservations**: tally chip, tenure line, next-interview chip, coverage meter, and nudge-chip slots reserve geometry in every state, so every derived arrival (a card submitting, an interview scheduling) is a paint, not a layout.
3. **Progressive column paint** on board boot: stage columns render as their pages land, first column first — the board is readable before it is complete.
4. **Derived reads over refetches**: coverage meters, readiness states, tallies, and the debrief aggregate recompute locally from card state (07c rule 6 derivation); no network on a tally tick.
5. **Route-level code splitting**: the board ships alone at 260KB; kit studio and debrief load on first navigation to S4/S6 (the +80KB lazy chunk), keeping the daily-loop surface lean.

## Measurement protocol

1. Cold load S1 + S2, both workspace directions (LCP/CLS/TBT); column-paint timeline on a 700-card fixture (7 columns × 100).
2. Board-traversal benchmark: ←/→/↑/↓ across 700 cards with virtualization active — focus-visible paint < 80ms p95, focus preservation (P19) with card announcements intact.
3. Move benchmark: drag and Alt+M paths — optimistic settle < 100ms, CONFLICT rollback < 250ms with both payloads rendered, undo within its 6-second window.
4. Scorecard benchmark: mobile viewport (360px), 4-competency card — full fill + submit round-trip ≤ 400ms p95; autosave indicator < 100ms; nudge recompute ≤ 50ms p95 on evidence edit; mixed-script paste into `dir="auto"` fields with zero reflow.
5. Debrief benchmark: 10-card round — aggregate recompute ≤ 300ms; The Cards Unseal ≤ 600ms with announcement; reduced-motion variant renders instantly with the identical summary.
6. Assist benchmark: template-mode panel — 3 proposals render < 200ms from request with zero CLS; assist-mode pacing honest at 80ms/proposal; stop honored within one interaction; quota meter updates before and after.
7. Paste-import benchmark: 40-row bilingual batch with 2 named duplicates and 1 invalid row — first valid row visible < 1s, determinate progress honest to the end, partial delivery on injected failure.
8. Reduced-motion + RTL variants of every benchmark — identical budgets (a11y-baseline §8).
