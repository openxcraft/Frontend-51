# 06 — Component Needs: media-asset-hub

## Shared primitives consumed

Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, JobRow, QuotaMeter (P14), ActionBar (P07), CommandPalette (P05), DatePicker (dual-calendar P24).

## Invented components (6)

| Component | Purpose | Obligations |
|---|---|---|
| **AssetGrid** | virtualized bilingual tile grid | Virtualizes >200 tiles (P19): scroll never moves focus; row/filtered counts announced on region entry; tile = thumbnail OR duotone kind glyph (link-catalog mode) + filename (bidi-isolated, `dir="auto"`) + state badges (archived, rights-expired, in-asset-text). Keyboard: arrows traverse (inline-end = next, both directions), Enter opens drawer, Space selects, Shift+arrow range; focus 2.4.13 strength; selection never color-only (checkmark + border). Hover = border+opacity only. Skeleton mirrors tile geometry RTL-flipped. |
| **DualScriptSearchBar** | single input, either script, multi-index search | Script auto-detection sets direction; suggestions grouped (recent/assets/tags), debounced ≤150ms perceived; active scopes announced ("searching metadata, tags, and in-asset text"); normalization disclosure chip when normalization fired (rtl-rules §4); "/" focuses; Escape clears + restores prior results. |
| **FilterBuilder** | faceted predicates (P08) | Facets: kind, tag, collection, rights state, date range, has-in-asset-text. Removable chips with accessible predicate descriptions; filtered state declares itself; state serializes to URL (shareable saved-view links without backend — 12 Q-8); filtered-empty offers reset (P01). |
| **MetadataDrawer** | contextual bilingual editing (P06/P10/P23) | Paired ar/en fields with parity indicators: in-sync / one-side-empty (flagged, never machine-filled) / length-far-apart (keywords only, 3:1 char threshold). Inline edit: Escape cancels, Tab commits/advances, focus returns to trigger; autosave cycle visible (P10); conflict shows both versions. Alt-text completeness flag is a visible gap. Extracted-text panel states provenance (machine+confidence / human-pasted) — never hidden. |
| **TagReviewList** | ingest auto-tag review (P15) | One row per suggestion: bilingual chip + source note + confidence; accept/edit/reject (A/E/R), full keyboard path; batch-accept names scope; untouched suggestions show 7-day expiry countdown, never auto-promote; in manual mode the same component is an empty bilingual entry list — identical shape, zero AI dependency. |
| **RightsBadge** | per-asset rights state | ok / unknown / expiring-soon (amber, days-left) / expired (critical, "usage paused"); text+icon never color-only; Western numerals; long Arabic terms truncate at word boundaries with tooltip. |

## Cross-set behaviors

- Destructive ladder (P04): archive = Level 1 (undo window, no dialog); batch archive = Level 2 naming the count ("Archive 24 assets — they leave the default views and keep their metadata"); permanent delete does not exist at v1 (12 Q-7).
- Live regions pair announcement + visible surface (a11y-baseline §4); schedule in 09.
- Z-index scale defined once (ui-ux-pro-max guideline): 10 tile badges · 20 drawer · 30 action bar · 40 dialogs · 50 toasts — no arbitrary values.
- Direction: logical properties throughout; icon flip set recorded — flip: chevrons, next/previous, export/"send" glyphs, external-link arrows, reorder handles; never flip: magnifier, kind/catalog glyphs, trash, refresh, the أ annotation mark (script identity, not direction cue).

## Layer-3 token additions

`asset.tile.badge.*`, `search.bar.disclosure.*`, `filter.chip.predicate.*`, `drawer.field.parity.*`, `tag.review.confidence.*`, `rights.badge.state.*` — Layer 2 bindings per token-architecture; no raw values above Layer 1.
