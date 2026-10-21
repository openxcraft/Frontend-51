# 09 — Accessibility: media-asset-hub

SME-F pass. WCAG 2.2 AA floor (a11y-baseline.md) on every surface, both directions, 200%/400% zoom, 1280px and 360px viewports.

## Keyboard map (critical paths)

- **Global**: "/" focuses search; ⌘K/Ctrl+K palette (P05, modified keys only — Arabic-layout safe); "?" shortcut sheet; Escape closes topmost overlay, focus returns to trigger.
- **CP-1**: Tab = staging list → batch options → commit; review rows ↑/↓ traverse, A accept / E edit / R reject, Enter opens item detail; cancel keeps focus in-console.
- **CP-2**: type → ↓/↑ grouped suggestions → Enter; grid arrows traverse (inline-end = next in BOTH directions — rtl-rules §4); Enter opens drawer; Space selects; Shift+arrow range; Home/End row bounds.
- **CP-3**: P06 inline edit — Enter/E activates, Escape cancels/restores, Tab commits/advances; parity flags focusable and announced; tag picker = combobox with list navigation.
- **CP-4**: Space selects tiles (P07 action bar); reorder ⌘↑/⌘↓ (2.5.7 drag alternative); remove + undo = focusable toast action.
- **CP-5**: buckets are landmarks; ↑/↓ rows; dates typeable (no picker-only path); save one Tab from last field.
- **Focus visibility**: 2.4.13 strength (deep-spruce ring); sticky search bar and action bar respect 2.4.11 (scroll-margin tokens — focused tiles never covered).

## Announcement schedule (live regions; every announcement pairs a visible surface)

| Event | Mode | Copy shape |
|---|---|---|
| Ingest stage advance | polite | "File 3 of 12 — extracting text" (matches visible label) |
| Ingest completed | polite | "12 files published — 2 need tag review" |
| Job item failed | assertive | file name + stage + retry availability |
| Tag review decision | polite | "Tag مقابلة accepted/rejected" |
| Search results load | polite | "38 results — filtered by kind: video" |
| Normalization fired | polite | "Results include hamza and taa-marbuta variants" |
| Autosave cycle (P10) | polite | "Saving…" → "Saved" (visible chip mirrors) |
| Conflict on save | assertive | "Reem edited this asset — both versions shown" |
| Rights expiry entered | assertive | "License expired — usage paused" |
| Archive + undo | polite | "3 assets archived — Undo (7 seconds)" |
| Streaming/token events | never | (no text streaming; ingest progress is the only long op) |

## Per-surface WCAG 2.2 AA checklist

- **S1**: virtualization preserves focus (P19); counts announced on region entry; selection = checkmark + border (never color-only); kind badges have text alternatives; targets ≥24×24 (2.5.8) on tiles, chips, filters.
- **S2**: labels persist (hint text never serves as the label); errors field-linked via described association; error summary focuses first error; extracted-text provenance stated in text.
- **S3**: progress = text + determinate counts; batch-accept names scope; review rows single-target with visible focus.
- **S4**: reorder keyboard-complete (2.5.7); artifact links announce expiry.
- **S5**: badges text+icon; dates keyboard-enterable; days-left Western numerals with unit.
- **S6**: log is a keyboard-navigable table (P18), filterable (P17).
- **S7**: capability toggles are real switches with readable descriptions; quota meter has text equivalent.
- **All**: 400% reflow at 360px incl. worst-case Arabic strings ("مستشارو التدقيق والحوكمة" — rtl-rules §5); no two-dimensional scroll; no personal data beyond member name (no autocomplete tokens needed at v1).

## RTL/LTR verification matrix (per surface × direction)

S1–S7, both `dir=rtl`/`dir=ltr`: pure-Arabic render; pure-English; mixed strings (Arabic filenames in Latin chrome and vice versa) with bidi isolation (`dir="auto"` inputs, isolates on interpolated values); Western numerals everywhere (ledger); embedded Latin/numeric tokens in RTL (sizes, durations); grid order/alignment mirrored; drawer side (inline-end) and action bar edge mirrored; pagination and chevrons advance toward inline-end; icon flip set per 06 (أ mark never flips); truncation at 320px word-boundary ellipsis; 400% reflow. Fixtures from 07c: mixed-script filenames (38+ Arabic-extraction assets), 40-asset collection, low-confidence rows.

## Release pass plan (a11y-baseline §8)

Keyboard-only CP-1…CP-5 both directions; one desktop + one mobile SR smoke per path; Layer 2 contrast audit both themes (declared at token definition); target-size spot audit (grid toolbar, filter chips); reduced-motion pass — motion is minimal (opacity ≤120ms), so every animated state already carries a non-motion equivalent; audit verifies the two-step opacity fallback and state-chip equivalents.
