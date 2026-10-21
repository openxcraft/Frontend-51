# 06 — Component Needs: inventory-count-assistant

## Shared primitives consumed

Button, Menu, Dialog, Tabs (session states), Tooltip, Toast, Skeleton, EmptyState, FilterChips (P08 — class/outcome/state filters), JobRow, DiffView (adjustment from→to), QuotaMeter (export window, P14), ActionBar (catalog bulk ops, P07), CommandPalette (P05), AutosaveIndicator (policy/catalog edits, P10), OfflineBanner (P20 — the guided count view's dead-zone companion).

## Invented components (9)

| Component | Purpose | Obligations |
|---|---|---|
| **GuidedCountSheet** | the live count table: rows in zone order, bilingual item labels, masked tally column (blind) or inline variance (directed), scan-focus row highlight | P18 grid (↑/↓ rows, Enter→quantity, Tab commit+advance); virtualized >200 rows (P19) with focus preservation; blind rendering is contract-backed (07b rule 3 — the sheet cannot render what the adapter omits); row count announced on region entry; quantity cells Archivo tnum; per-row state text (counted/recount/late) never color-only |
| **ScanEntryBar** | the counter's primary input: barcode scan capture + type-to-search (bilingual normalized) + quantity pad | Always-focused on view entry (one-thumb use); search matches normalized Arabic (rtl-rules §4) with disclosure per ai-native-patterns §7.4 analog (normalization is deterministic, disclosed in the empty-search hint); scan double-fire de-duplicated by idempotency key (07b rule 6); offline queue with per-item state (P20); target ≥24px for every pad key (2.5.8); announcement on entry accepted (polite) |
| **VarianceLedgerRow** | reconciliation row: item label, book qty, counted qty (final), signed delta, percent, value at cost, tolerance bracket, outcome chip, resolution state | Signed delta ALWAYS text with explicit sign (−/+) — never icon-flip or color alone; tolerance bracket is drawn geometry with the band values printed as text (charts.csv heatmap contract: numbers always present); outcome = icon+text+color (within-deep / red / amber-deep per 05 contracts); recount-pending and review-required are distinguishable by text labels, not only hue; row focus announces item + delta politely |
| **ToleranceBracket** | the visual band on a variance row and in the policy editor: expected quantity with the allowed band marked | Band edges printed as text (abs + pct combined per band strategy); colorblind-safe (pattern overlay per charts.csv row 5); never the sole carrier of the within/outside judgment — the outcome chip duplicates it; in the policy editor it recomputes live from the worked example (06 rule) |
| **CycleSliceCard** | the cadence proposal: proposed items with class chip, interval, days overdue, overdue ratio, and the why-line | Every row states its arithmetic in text ("A class · 30-day interval · 66 days since last count"); ordering deterministic (overdue ratio desc, 07c); accept-trim interactions keyboard-complete; class chips text-bearing (moss-deep per 05) |
| **PolicyEditorForm** | tolerance + cadence editing with live worked example | Field-level validation messages (negative tolerance, zero interval named precisely); the worked example recomputes on every field change (deterministic — same inputs, same example); autosave status persistent (P10); interval changes warn that the next proposal re-orders honestly; band strategy (union/intersect) rendered as a radio with plain-language consequence text |
| **CountProgressMeter** | determinate session progress: counted / recount-pending / uncounted vs scope total | Determinate always (async-contract §3 — never a fake percentage); segments carry text counts; announces progress at quarter marks politely (not per entry); the uncounted segment is actionable (focus jumps to first uncounted row) |
| **IraCard** | session/store accuracy: items within tolerance ÷ items counted, with the arithmetic shown | The formula renders as text ("27 of 28 items within tolerance — 96.4%"); no-data state for stores without closed sessions (never 0%); value copy cites the convention honestly (unverified-band note optional per 11 E); store cards compare only like-for-like closed sessions |
| **BilingualItemCell** | the item label renderer: primary-locale line + secondary line, barcode and SKU in Latin digits | Each script renders at its own direction in bidi isolation (rtl-rules §2 — `dir="auto"` inputs, isolate marks on interpolations); truncation at word boundaries (no hyphenation exists); worst-case joined-word strings tested at 320px (09); missing-locale state renders the present name + an "incomplete bilingual label" hint (text, not color) |

## Layer-3 token additions

`count.sheet.row.state.*` (counted/recount/late/uncounted), `variance.row.outcome.{within|out|recount|review}.*` (text-bearing vs UI-ink variants per 05 contracts), `tolerance.bracket.edge.*`, `slice.card.overdue.*`, `progress.meter.segment.*`, `ira.card.nodata.*`, `scan.bar.focus.*`, `item.cell.bilingual.missing.*` — all Layer 2 re-binds of the 05 palette; no raw values (token-architecture §1).

## Reused-with-twist

- **DiffView**: adjustment from→to per item (quantity-level rows, not text chars) in the close-gate confirm and the closed session detail.
- **EmptyState**: S1 first-run sample session (interactive: loads the seeded 8-item mini scope so the blind reveal is experienceable pre-import — CP non-happy path, P22).
- **QuotaMeter**: export/import window only; counting itself is deliberately unmetered — the core discipline must never read as rationed (the free-forever floor is the product's posture, 12 Q-3).

## Deviations recorded

- Fully-rounded filter/class chips inside density-B system: permitted exception for removable-chip semantics (P08), declared in 05; all other radii in the B family.
- Icon flip decisions (rtl-rules §2): scan corner-brackets are direction-symmetric (never flip); the tally-slash blind glyph is a diagonal — it does NOT flip in RTL (its semantic is "masked", anchored to the rectangle, not to reading direction; decision recorded here per rtl-rules §2); recount cycle-arrows are symmetric; the delta glyph never flips (sign lives in the text).
