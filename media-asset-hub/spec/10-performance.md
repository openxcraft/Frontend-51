# 10 — Performance: media-asset-hub

SME-K pass. Budgets = intent; measurement points = release gates. ui-ux-pro-max checklist items adopted: lazy-loaded heavy assets, focus/contrast/reduced-motion (09), responsive verification 375/768/1024/1440.

## Route budgets (gzip JS)

S1 ≤180KB (grid + search + filters); S2 ≤220KB (S1 + metadata editor); S3 ≤240KB (staging + review); S4/S5 ≤150KB; S6/S7 ≤120KB; palette lazy +30KB on first ⌘K.

## Grid & thumbnail pipeline (hot path)

- **Virtualization threshold**: >200 tiles (P19) — the 240-asset seed must virtualize on first load; recycled-tile paint ≤8ms; scroll never moves focus (09).
- **Thumbnails**: ≤30KB per tile; skeleton tile → opacity fade ≤120ms; drawer previews ≤300KB lazy on open; originals never requested by the grid; link-catalog mode renders 0-image duotone glyphs (designed degradation).
- **Request policy**: ≤6 concurrent, viewport-prioritized (visible first, ≤1 row inline-end prefetch), dedup by variant id; failure = glyph fallback + retry-on-focus (never a broken-image glyph).

## Search latency

- Keystroke-to-suggestion ≤150ms perceived (120ms debounce, ≤8 grouped suggestions); full search → first results paint ≤400ms p75 on the mock (240-asset deterministic index); hit-highlighting after paint (never blocks first paint); normalization cost negligible (fixed-table, 07c).
- Filter chip add/remove → grid update ≤200ms (client refacet on warm page, refetch otherwise).

## Async jobs (ingest)

- Honesty only (async-contract §3): stage cadence adapter-determined; stage-advance repaint ≤100ms; per-item rows update without list reflow (CLS ≤0.02 in-console).
- Polling only while console/Activity visible (visibility-gated); completion via return-state or notification (§6) — no background polling from closed surfaces.

## Layout stability & zoom

CLS ≤0.02 on S1 first load (skeletons reserve tile geometry — fixed aspect per kind); drawer opens with reserved sheet width (grid narrows via template, not re-measure); 400% zoom at 360px single-column reflow with worst-case Arabic filenames (09 matrix).

## Perceived-performance strategy

Optimistic UI only where reversible (P03): tag apply/remove, collection add/remove render immediately with undo; metadata autosave visible (P10), never blocking the next field. Skeletons mirror tile geometry RTL-flipped (P02); first 24 tiles render before cursor pagination completes. Offline (P20): cached reads; queued metadata writes with per-item state; ingest blocked honestly.

## Measurement points (release gates)

1. Cold S1 both directions: LCP ≤2.0s, CLS ≤0.02, TBT ≤150ms (mock, 240-asset seed).
2. Scroll: 100-tile virtualized scroll RTL + LTR, zero focus loss, zero long tasks >50ms.
3. Search: 12-query bilingual set (normalized variants + extracted-text-only matches), p75 ≤400ms first paint, hit badges correct 12/12.
4. Ingest: 12-file staged job to publish with review; stage-advance repaint p95 ≤100ms; CLS ≤0.02.
5. Thumbnails: 60-tile cold grid, p95 tile paint ≤600ms after first paint, ≤6 concurrent enforced.
6. Reduced-motion + 200%/400% zoom variants of 1–5 (same budgets; motion already minimal).
