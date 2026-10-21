# 10 — Performance: interactive-story-builder

Calm-personality budgets (motion-language §1) + editor-craft latency. "Poor typography + slow loading" is the anti-pattern this file exists to prevent (05 skill record).

## Route budgets (gzip JS)

S1/S2 ≤ 150KB · S3+S4 outline+inspector ≤ 280KB (preview surface lazy +90KB) · S5/S7/S8 ≤ 130KB · S6 preview ≤ 180KB with story state rendered client-side.

## Interaction budgets

- Step selection → inspector paint ≤ 80ms; reorder keystroke → board paint ≤ 100ms (optimistic, P03).
- Inline text edit keystroke-to-paint ≤ 16ms (typing path).
- Direction toggle → full preview re-render ≤ 250ms for a 40-step story (logical-property layout: reflow, not re-authoring).
- Sync grid derivation ≤ 300ms for 48 steps.
- LCP ≤ 2.0s on S1/S3 cold load; CLS ≤ 0.02 (media boxes reserve aspect ratios; skeletons mirror geometry per direction, P02).
- Autosave debounced 800ms idle; offline queue flushes on reconnect.

## Long-story thresholds (virtualization)

- Step boards > 40 steps: windowed rendering with focus preservation (P19 — scrolling never moves focus; row-count context announced on region entry).
- Library/activity > 200 rows: virtualized.
- Preview: media lazy-loads per chapter with poster frames; only current ±1 chapter mounts scroll listeners; passive listeners + rAF-batched scroll state (p95 frame ≤ 16ms, no main-thread scroll jank).
- Suggestion streaming: reserved region pre-sized (CLS ≤ 0.02 per stream, ai-native-patterns §2).

## Perceived-performance strategy

Structure-first authoring is local: step text, layout changes, and direction reflow render from story state without server round-trips (the adapter only persists). Preview never round-trips — it renders local state. Optimistic reorders with 5s undo (P03) make the board feel instant while the adapter stays authoritative. Export honesty: determinate per-chapter labels ("Rendering chapter ٣ of ٧" — async-contract §3); never fake instant completion.

## Asset strategy

Noto Naskh Arabic (400/500/700) + Newsreader subsets ≤ 160KB/direction total; line-1.5 icon sprite single file; export-time poster generation; nothing blocks first paint of S1/S3.

## Measurement points

1. Cold load S1/S3/S6 both directions (LCP/CLS/TBT).
2. Direction-toggle benchmark on the 48-step seeded story (p95 ≤ 250ms).
3. Typing benchmark in the inspector (200-word block, p95 ≤ 16ms).
4. Virtualized board scroll (48 steps, zero focus loss, p95 frame ≤ 16ms).
5. Sync-grid derivation (48 steps ≤ 300ms).
6. Reduced-motion + RTL variants run the same budgets (a11y-baseline §8.6).
