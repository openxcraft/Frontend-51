# 06 — Component Needs: caption-lab

## Shared primitives consumed
Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, ActionBar (bulk apply), JobRow/JobDetail, ActivityLog, QuotaMeter (export quota), DiffView (preset versions).

## Invented components (5)

| Component | Purpose | Obligations |
|---|---|---|
| **CueGrid** | timecode-first caption rows with duration + reading-speed meters | P18 grid keyboard model; row targets ≥24px; meters text-duplicated; virtualization >200 cues (P19) |
| **LineBreakWorkbench** | RTL-safe break suggestions preview | Preview never mutates until applied; both break options shown on rule conflict (CP-2 edge); bidi-safe rendering of mixed cues |
| **SpeedGateMeter** | reading-speed vs audience threshold | Gate = icon+text+number; settle micro-interaction per 05; reduced-motion text swap |
| **StylePreviewScrubber** | preset preview over media frames | Frame requests are jobs; scrubber keyboard-operable (arrow frame-step); preview unavailable state honest (no media) |
| **LegibilityLinter** | contrast/size/tashkeel checks on presets | Findings as advisory list; never blocks export silently — warnings carry into export flags |

## Layer-3 token additions
`cue.row.active.*`, `speed.gate.state.*`, `timecode.text.*` (mono-bound), `preview.scrubber.*` — Layer 2 bindings.

## Reused-with-twist
- **ActionBar**: bulk policy application with per-cue skip counts (failed-only retry).
- **Skeleton**: cue-row skeletons mirror the grid's own geometry (P02 discipline on a data-dense surface).
