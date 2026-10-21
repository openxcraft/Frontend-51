# 10 — Performance: customs-tariff-lookup

## Route budgets (gzip JS)

S1 nomenclature home ≤ 150KB · navigator shell (S2 tree + S3 reading pane) ≤ 200KB (notes library + editions lazy +60KB) · S6/S7 ≤ 120KB · S8 console ≤ 110KB · S10 palette ≤ 30KB incremental.

## Interaction budgets

- **Search: keystroke-to-paint ≤16ms** for the deterministic keyword search at seed scale (≤1,000 indexed nodes), p95; results page render <80ms; typed-ahead normalization runs on the input thread's idle budget and never blocks the caret (motion during typing is forbidden — motion-language §6).
- **Tree: sibling-level expansion <80ms** (children fetch + render at seed scale); virtualized window at >200 siblings (P19) — scroll never moves focus; breadcrumb re-render <50ms.
- **Reading pane open → code settle complete ≤120ms** (the signature micro-interaction's own ceiling); full pane (descriptions + duty + notes list) ≤200ms at seed scale.
- **checkCodeChanges: ≤300ms at seed scale (≤500 saved codes), ≤800ms at 5,000 saved codes** — synchronous by design (07b); if a future workspace exceeds the budget, the check becomes a Job (async-contract threshold) rather than a spinner lie.
- **compareDutyRates: ≤150ms** for ≤5 schedules (table lookup + render; the strip never computes).
- **Assist run: first candidate ≤2.5s, completion ≤6s** at seed scale — an honest Job-shaped operation with determinate term progress; the deterministic results stay on screen while it runs (no blank-waiting on the upgrade path).
- List edits: autosave debounce 800ms, save round-trip <400ms perceived (P10 calm cycle); bulk status change commit <100ms per item batch.
- **LCP ≤ 2.0s both directions; CLS ≤ 0.02** (tree skeleton reserves the section-grid geometry; the reading pane reserves the code block's mono line before data arrives; the assist panel reserves its region before candidates stream — ai-native-patterns §2 budget).

## Data-path rules

- Typed pagination per 07b: search/nodes/notes/lists/diffs ≤ 50/cursor; saved codes ≤ 100/cursor; >200-row tables virtualize (P19).
- **Nomenclature cache**: schedule trees are immutable reference data — fetch once per edition, cache aggressively (the deterministic search index loads with the workspace; edition switch swaps the index wholesale, never patching).
- **Parity between directions**: the RTL render path reuses the same cached data — locale switch re-renders, never re-fetches; identical budgets both directions.
- Rate-compare and edition checks read local immutable tables — no spinner is ever shown on a synchronous local read (non-AI fast-path honesty: sync reads render instantly or the surface is lying).
- Job polling only on visible surfaces (S8 console + the rail's edition banner); assist/export jobs reconcile to authoritative state on reconnect (async-contract §5).

## Perceived-performance strategy

- Search-as-you-type over the cached index (the 16ms budget) with results settling in place; the assist panel streams candidates into its reserved region after the deterministic results are already usable.
- Tree virtualization is invisible: levels load as the caret/selection approaches, never ahead of intent.
- Exports deliver in-context when the surface is visible (async-contract §6 ladder 1) with determinate section progress ("codes 3 of 3, notes 2 of 5"); artifact link + expiry announced once.
- Offline (P20): reading surfaces serve from the last-fetched cache where the platform allows; saved-list writes queue with per-item state and reconcile; the edition banner honestly states the cache's date rather than implying live data.

## Asset strategy

Rubik (400/500/700, ar+en subsets) ≤ 120KB/direction · Space Mono (400/700, latin subset, digits-only usage) ≤ 40KB · outline-geometric icon sprite single file · no font-display late-swap on the code block (the code is the first paint of the product's primary object).

## Measurement protocol

1. Cold load S1 + navigator, both directions (LCP/CLS/TBT).
2. Search benchmark: 1,000-node index, p95 keystroke ≤16ms; zero-result path <80ms; normalization fixtures (شاشه / أرز / dot-stripped codes) identical latency.
3. Tree benchmark: 500-sibling virtualized level, expansion p95 <80ms, zero focus loss during scroll.
4. Reading-pane benchmark: open → settle ≤120ms, full pane ≤200ms, both directions.
5. Edition-check benchmark: seed scale p95 ≤300ms; 5,000-saved-code synthetic scale p95 ≤800ms.
6. Assist benchmark: seed scale first candidate ≤2.5s, complete ≤6s, CLS ≤0.02 during stream.
7. RTL + reduced-motion variants repeat 1–6 at identical budgets; 400% zoom reflow pass on S1–S8 both directions (a11y-baseline §8.3).
