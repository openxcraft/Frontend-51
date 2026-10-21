# 06 — Component Needs: bilingual-content-calendar

## Shared primitives consumed
Button, Menu, Dialog, Tabs (grid modes), Tooltip, Toast, Skeleton, EmptyState, FilterChips+SavedViews, ActionBar (bulk pattern apply), ActivityLog, JobRow/JobDetail, CommentThread, DiffView (variant history), QuotaMeter (export quota).

## Invented components (5)

| Component | Purpose | Obligations |
|---|---|---|
| **DualCalendarHeader** | Hijri+Gregorian date header, one primary + cross-reference | P24; cross-reference on hover AND focus; method disclosure tooltip is accessible; announced as one coherent date ("الثلاثاء ١٤ رمضان ١٤٤٧ — 24 Mar 2026") |
| **SlotChip** | grid slot with parity indicator + status | Parity = icon+text (never color-only); 24px target minimum; drag has keyboard move (⌘+arrows) per 2.5.7 |
| **VariantPanes** | ar/en paired panes in slot detail (P23) | Per-pane direction; sync-state chip; length hints soft; pane switch preserves focus position |
| **MomentsPanel** | library + apply timing patterns | Pattern preview before apply; bulk apply = job (P12) with count; city selector with method disclosure |
| **SeasonConsole** | quiet-hours, iftar/suhoor windows config | Overrides require reason (recorded); guidance is visual+text, never hard-block; all settings persist per horizon |

## Layer-3 token additions
`slot.chip.parity.*`, `moment.badge.*`, `grid.mode.header.*`, `season.window.band.*` — all bind to Layer 2; no raw values.

## Reused-with-twist
- **CalendarGrid**: standard grid + RTL mirroring of time axis (rtl-rules §2 charts rule applies to time axes) and week-start by locale.
- **CommentThread**: anchored to slot AND variant granularity (comment context chip).
