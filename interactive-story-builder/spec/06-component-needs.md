# 06 — Component Needs: interactive-story-builder

## Shared primitives consumed

Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, ActionBar, DiffView (outline diff), QuotaMeter (suggestion/export windows), JobRow, CommandPalette (P05).

## Invented components (7)

| Component | Purpose | Behaviors & states | A11y notes | Patterns |
|---|---|---|---|---|
| **ChapterRail** | ordered chapters + rollup sync chips | default/hover/focus/active/dragging/drop-target; empty-chapter state; drag + ⌘/Ctrl+↑↓ reorder; sync chip counts | list semantics; counts announced on region entry; reorder announces old→new politely | P18, P03 |
| **StepBoard** | ordered step cards of the chapter | default/hover/focus-selected/loading(media)/error(media)/dragging; sync + layout-override badges; add-step affordance | arrow grid navigation (physical mapping stable both directions, rtl-rules §4); selected card announces sync state | P18, P02 |
| **StepCard + StepInspector** | board card ↔ inspector (layout/media/locale text) | inspector: editing/disabled(reviewer)/saving/saved/conflict; media: attached/unreachable/missing-alt; locale tabs ar/en with per-tab direction | Escape restores (P06); Tab commits + advances; conflict shows both versions; validation field-linked | P06, P10, P23 |
| **LayoutPicker** | RTL-native layout chooser (6 layouts, logical-axis previews) | previews render in story direction with toggle; selected/disabled; per-locale override control | SR hears "media inline-start, text inline-end" (text-first); one target per option | — |
| **SyncGrid** | bilingual per-step alignment matrix (CP-2) | rows: in-sync/edited-since/missing-in-locale/length-divergent/layout-override; inline edit cells; "mark reviewed" per row | row = both locales' status in words + word counts; divergence never color-only; saves announced | P06, P16 |
| **PreviewSurface** | live scrollytelling render + direction toggle | rendering/partial-media/error; ar/en/side-by-side toggle; chapter progress; jump-to-chapter (skip); reduced-motion variant | click-to-play media only; progress announced politely on chapter change; keyboard scroll + jump menu | a11y-baseline §6 |
| **QaReportPanel** | findings list with jump-to-step | clean/issues/stale/error; severity order; error-vs-warning distinction; re-run | findings are focusable entries linking to steps; counts announced assertively on completion | — |

## Reused-with-twist

- **DiffView**: outline-level diff for suggestion apply (chapter/step rows, not text chars) — CP-4.3.
- **EmptyState**: template gallery and sync empties are interactive (create-first-chapter / write-first-locale) — P01.
- **JobRow**: progress labels written per async-contract §3 ("Rendering chapter ٣ of ٧").

## Icon flip decisions (rtl-rules §2, recorded)

Flip: chapter/step reorder handles, next/previous chevrons, side-by-side layout glyph (inline-start/end), external-link arrow. Never flip: playback glyphs, magnifier, trash, sync double-arrow (symmetric), pull-quote ornament. Book-spine chapter glyph: right spine in RTL by regional convention — flips; decision recorded here.

## Layer-3 token additions (Layer 2 bindings only)

`chapter.rail.sheet.*` · `step.card.elevation.*` · `step.card.sync.state.*` (in-sync/edited/missing/override — icon+text duplicated) · `sync.grid.divergence.*` · `preview.progress.indicator.*` · `layout.picker.preview.*`.
