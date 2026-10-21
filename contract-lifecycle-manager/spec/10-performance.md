# 10 — Performance: contract-lifecycle-manager

## Route budgets (gzip JS)

S1 vault home ≤ 160KB (register grid + digest banner) · S2 contract detail ≤ 240KB (bilingual panel + ledger + extraction review lazy +70KB) · S3 intake wizard ≤ 180KB (extraction review panel shared-lazy) · S4/S6/S7 ≤ 120KB · S9 palette ≤ 30KB incremental.

## Interaction budgets

- Register: keystroke-to-paint in bilingual normalized search ≤16ms (rtl-rules §4 normalization runs on precomputed normalized forms — the normalization pass happens at write, never per keystroke); row focus highlight <80ms; virtualized window at 1,000+ contracts (P19) — scroll never moves focus.
- **Reminder schedule recompute: ≤150ms at seed scale (≤500 obligations), ≤400ms at 5,000** — the derived view recomputes on every obligation mutation (CP-2); the budget is the contract that keeps zone updates feeling instant. If a future portfolio exceeds it, the schedule becomes a Job (async-contract threshold) rather than a stale-zone lie.
- Zone arithmetic on list reads: zones + notice deadlines + derived lifecycle computed at read, ≤5ms per 100 rows (integer-day math per 07c formulas — no date-library parsing on the hot path).
- Renewal window bar day-count delta: ≤120ms settle (stately range), always paired with a text change.
- Extraction job: honest page-count progress (120ms/page in the Mock Adapter), cancellable, never faked-instant; suggestion panel renders progressively as anchors resolve (CLS-safe reserved region below).
- Metadata inline edit: keystroke-to-paint ≤16ms; autosave debounce 800ms, save round-trip <400ms perceived (P10).
- The Seal Settles moment: 360ms + ≤60ms × 4 stagger, ≤600ms total — inside the stately 480ms ceiling for the primary motion with the stagger capped at 5 elements (motion-language §1/§6).
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (register rows reserve geometry; the suggestion panel's reserved region prevents stream-push; skeletons mirror register/panel geometry per direction — P02).

## Perceived-performance strategy

- Extraction and exports are honest Jobs (P12): determinate page/artifact progress, cancellable, completion delivered in-context when the surface is visible (async-contract §6 ladder 1).
- The wizard's assist step is optional and skippable in one action — the intake path never blocks on the capability (08 degradation promise).
- Progressive register fill: rows render from the first cursor page while the digest banner counts resolve (banner states "counting…" until the derived aggregates land — honest, never a fake number).
- Reminder schedule recomputes after mutations render the new zone immediately on the mutated row; the global schedule updates within the 150ms budget (row-local instant, console-wide bounded).
- Offline (P20): register and detail reads work; obligation completions and metadata edits queue with per-item state; jobs reconcile to authoritative state on reconnect (async-contract §5).

## Asset strategy

IBM Plex Sans Arabic (400/500/600/700 ar) + IBM Plex Sans (400–700 en) subsets ≤ 150KB/direction; line-1.5 icon sprite single file; no font-display late-swap on the register grid (data-first paint); tabular-figures feature binding on numeric columns.

## Data-path rules

Contract pages ≤ 100/cursor (07b typed pagination); obligations ≤ 100/cursor; activity ≤ 100/cursor; >200-row surfaces virtualize; reminder entries computed on demand per window ([from,to] bounded — never the full future); normalized search forms stored at write (07a Keyword-class discipline adapted: `normalized` forms are read-only system fields); job polling only on visible surfaces (S8 + digest badges); all append-only mutations carry idempotency keys (no double-records on retry).

## Measurement protocol

1. Cold load S1 + S2 both directions (LCP/CLS/TBT).
2. Register benchmark: 1,000-row virtualized scroll + bilingual normalized search, p95 keystroke ≤16ms, zero focus loss.
3. Schedule benchmark: 500-obligation recompute p95 ≤150ms; 5,000-obligation synthetic scale p95 ≤400ms; zone-at-read ≤5ms/100 rows.
4. Extraction-path benchmark: 22-page document job progress smoothness (no main-thread jank >50ms during panel render).
5. Seal Settles moment: total ≤600ms including stagger; reduced-motion variant instant.
6. RTL + reduced-motion variants repeat 1–5 at identical budgets.
7. 400% zoom reflow pass on S1/S2/S4 both directions (a11y-baseline §8.3).
