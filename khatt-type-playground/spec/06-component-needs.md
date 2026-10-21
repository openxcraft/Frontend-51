# 06 — Component Needs: khatt-type-playground

## Shared primitives consumed

Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, Slider, JobRow, QuotaMeter (export window), ActionBar (bulk specimen export), CommandPalette (P05), DiffView (comparator settings diff).

## Invented components (7)

| Component | Purpose | Obligations (states, a11y) |
|---|---|---|
| **TypeCanvas** | hero: two-script specimen blocks under a controls column; persists across rail modes (04) | Blocks are a reading-order list; per-block direction with bidi isolation on mixed lines; loading = metric-matched fallback + per-font notice; font-file failure = typed retry state, never blank |
| **GlyphGrid** | paginated Unicode-block glyph grid (S2) | P18 grid navigation (arrows, Home/End, range); row-count announced on region entry (P19); selection flagged with codepoint + name in text (never color-only); virtualized beyond ~200 cells |
| **GlyphInspector** | single glyph: codepoint, name, joining forms, alternates, components | Forms labeled in Arabic + Latin; codepoint in mono LTR-isolated; alternates as feature chips; keyboard-reachable from grid |
| **PairingComparator** | A/B of two loaded sessions on one canvas (CP-2.5) | Settings diff as DiffView rows (values, not prose); both revisions displayed; swap-sides action uses logical properties |
| **KashidaControls** | mode segmented control (Off · Tatweel · `jalt`) + intensity slider + word-spacing floor (CP-3) | Slider drag has click + arrow-key equivalents (2.5.7); value announced politely ("كثافة الكشيدة ٤٠٪"); unsupported modes disabled *with reason text* citing the font's capability list; per-line stretch readout is a live table |
| **AlternateToggles** | per-script feature panel (`calt`, `liga`, `dlig`, `ss01`…, `jalt`, `kern`, mark) | Feature codes in mono with explanation tooltip (content authored once per key — terminology discipline); unavailable features disabled + reason; toggle state text-duplicated (on/off, not color) |
| **SpecimenComposer** | block editor (CP-4): reorder, per-block overrides, numeral proof | Reorder drag has keyboard equivalent (P18); validation messages field-linked; draft autosave (P10); "final" promotion confirm names what finalizes (P04 level 2) |

## Supporting components

- **FontCatalogCard**: family, scripts, category, weight strip rendered in the family itself (self-demonstrating; aria-hidden decorative with family name in accessible text), license badge, kashida-class chip.
- **ScaleControls**: base size, ratio, leading, tracking (Latin-only, with the Arabic-zero explanation inline), numeral toggle. Values AR-indic per default policy; clamps explain themselves ("leading clamped to ١.٦ — Arabic floor").
- **SettingsProvenancePanel**: weights, scale, kashida mode, alternates, numerals printed on share views and exports — provenance as content (04).

## Layer-3 token additions

`glyph.grid.cell.state.*` · `glyph.inspector.form.label.*` · `kashida.stretch.mark.*` (brass tick + text-symbol redundancy) · `canvas.block.rule.*` (hairline per theme) · `feature.chip.state.*` (enabled/disabled-reason) · `comparator.diff.row.*`.

## Reused-with-twist

- **EmptyState**: first-run is an *interactive* demo pairing on the canvas (CP non-happy) — the empty is the first lesson.
- **DiffView**: comparator renders numeric settings rows, direction-aware, RTL-safe numerals per policy.
- **Tooltip**: feature-code explanations — one authored string per feature key (copy-voice §3).
