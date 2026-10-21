# 06 — Component Needs: op-ed-desk

## Shared primitives consumed

Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, JobRow, DiffView (revision chains, P16), QuotaMeter (full-pass lint, P14), ActionBar (bulk triage, P07), CommandPalette (P05).

## Invented components (5)

| Component | Purpose | Obligations |
|---|---|---|
| **TriageQueue** | S1 ruled-table queue: arrival order, SLA state, language, policy flags, bulk select | P18 grid (arrows navigate; physical mapping stable in RTL); P19 virtualization >200 rows with row-count announcement; SLA = text+icon, never color-only; filter state shareable as URL (P08) |
| **AnonymizedReviewPanel** | S3 blind reading surface: versioned scrubbed text with leak-flag affordance | Document-direction rendering in isolating container; leak-flag is span selection with keyboard equivalent (⌘/Ctrl+B marks start/end, 2.5.7); view version announced; identity structurally absent (PERMISSION-backed, not CSS-hidden) |
| **LintSidebar** | findings grouped policy/style/integrity with span anchors | Anchor jump <80ms; severity = icon+text+pattern, never color alone; bidi-safe anchors; acknowledge/dismiss/fixed resolutions with undo window (P03); degraded-mode notice when full pass unavailable |
| **DecisionComposer** | decision class + structured letter (round digest, findings digest) + send | Double-submit prevention (busy state — adopted ui-ux-pro-max guideline); letter preview renders at its own direction with AR-indic numeral toggle; send failure keeps letter + manual copy path; idempotent retry |
| **RoundSummary** | aggregate + individual reviews + COI-guard record | Aggregate labeled as arithmetic; reviews keyboard-navigable; split state renders override entry with REQUIRED rationale (P15 — submit disabled until non-empty) |

## Layer-3 token additions

`queue.row.sla.*`, `finding.anchor.severity.*`, `anonview.leak.flag.*`, `round.override.gate.*`, `letter.sheet.*` — Layer 2 bindings to paper/ink/red (05).

## Reused-with-twist

- **DiffView**: revision chains compare versions at block level, direction-aware (RTL diffs flow right-to-left, P16).
- **EmptyState**: S1 first-run is interactive — form link + one sample piece (CP-5 non-happy), not dead text.
- **JobRow**: lint jobs with per-category progress labels ("فحص فئة ٣ من ٧" — copy-voice numeral rules).
