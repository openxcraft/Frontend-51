# 06 — Component Needs: asset-register-tracker

## Shared primitives consumed

Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, ActionBar (bulk label/relocate/retire), JobRow (label batches, exports), PersonPicker (autocomplete + inline create — P05/P09 spirit), TreeView (location tree), DiffView (retirement preview: what the register loses vs keeps), QuotaMeter (label/export window per 07b `getUsage`).

## Invented components (6)

| Component | Purpose | Obligations |
|---|---|---|
| **AssetTable** | the registry grid: virtualized rows, filter/sort state, quick-add rows, inline edit, bulk select | P18 grid keyboard contract (arrows, range select, inline-edit activation); P19 virtualization with focus preservation + row-count announcement on region entry; per-row direction rendering for bilingual names (bidi isolation); tag column tabular figures; custody/label state chips are icon+text+color; sticky header at density B; 360px collapse to stacked cards (ux-guidelines 71); inline validation row-level, never blocking the grid |
| **CustodyTimeline** | append-only event chain per asset: assign/return/transfer/sighting/correction with signatures, condition, location | Timeline order mirrors in RTL; border-inline-start weight encodes chain density; correction events render with plum marker + reference link to the corrected event (history honesty is the component's job); signature seal mark (amber ring + pen glyph) with signer name, method, timestamp announced; filter by kind/person/date; keyboard-navigable in reading order; exportable context (feeds S9 pack) |
| **QrLabelSheetPreview** | print-fidelity preview of a label batch: grid of label cells (QR + tag + bilingual name), size (25/40/60mm) and layout (A4 65/24/1-up) selection | True-to-print geometry (square cells, declared deviation — 05); print-safe contrast independent of theme; QR minimum-size note surfaced at size selection (research: ~1.6cm floor); per-cell applied/pending state marks; screen-reader alternative = the batch checklist list (equal information, text-first); print stylesheet is a fidelity obligation (what you preview is what prints) |
| **ScanLookupView** | mobile companion: camera decode → asset card → scoped actions | Manual tag-entry as first-class equal path (camera never required — a11y-baseline §5 spirit + the KYC camera-guidance pattern from a11y-baseline §7 applied as an analog: short SR guidance line while scanning); decode status announced politely; asset card shows tag/holder/serial prominently (wrong-asset catch pre-signature); action set scoped to role (member vs shared-link); queue state per offline event (P20); one-thumb targets ≥24px with 44px touch comfort |
| **SignatureCapture** | the custody signature block: typed name (default), drawn mark, or scan-ack | Typed-name path is the keyboard/SR default (drawn is enhancement, never the only path); drawn path captures a mark with a typed-name witness field (a mark alone names nobody); scan-ack path renders the acknowledging device's confirmation; signature never stored on the event without signer name + timestamp + method; decline path leaves the event un-recorded (no half-signed states — 03 CP-2 edge) |
| **WalkModePanel** | audit-walk companion state: expected-vs-seen reconciliation at a location | Expected set from `listAssets` at location; scanned set from sighting events; both gaps surfaced (unscanned listed + scanned unlisted); counts as text, not heat; progress is item counts (async-contract §3); exit walk mode asks nothing (state is events, not a session artifact) |

## Layer-3 token additions

`asset.table.row.state.*` (custody/label state chips), `custody.timeline.event.kind.*` (markers), `custody.signature.seal.*` (amber seal ring), `label.sheet.cell.*` (print-fidelity cells), `scan.companion.action.*` (one-thumb action buttons) — Layer 2 bindings per token-architecture §3; no component reads Layer 1.

## Reused-with-twist

- **EmptyState**: first-run teaches the three-move loop (category → asset → label batch) with the sample-asset offer (P22); filtered-empty carries filter reset (P01).
- **JobRow**: label batches show labels-done/total (determinate); exports show pack scope; both link to context (S3/S9) per async-contract §7.
- **DiffView**: retirement preview — the asset's row moves from active to retired register, custody timeline frozen (kept), label retired; the preview names exactly what stops and what persists (P04 level-2/3 support).
- **QuotaMeter**: label batches + exports in window only; assets tracked is plan posture in settings, never a blocking wall mid-flow (P14 at 80% warn).

## Motion per component (minimal personality — motion-language §1)

All six: opacity-only ≤120ms; position changes instant with crossfade. Success = state chip + polite announcement (label applied, event recorded, retirement recorded). The signature seal appears in one 120ms fade with the announcement "signed by {name}" — the register's single most consequential moment gets its quiet treatment, and nothing else moves.
