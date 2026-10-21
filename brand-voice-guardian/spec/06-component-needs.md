# 06 — Component Needs: brand-voice-guardian

## Shared primitives consumed
Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, ActionBar (bulk resolve), ActivityLog, JobRow, DiffView (profile versions), QuotaMeter (pass quota), CommentThread (dismiss-reason threads, lightweight).

## Invented components (3)

| Component | Purpose | Obligations |
|---|---|---|
| **FindingCard** | one finding: span excerpt, rule, class, suggested fix, accept/dismiss | Keyboard triage (P18): ↑/↓, A accept, D dismiss-with-reason; span highlight bidi-safe in both directions; class = icon+text |
| **ProfileHealth** | coverage meter (terms/banned/samples/calibration) | Text equivalent always (counts); "partial profile" state visible wherever checks run |
| **CleanPassStamp** | zero-findings success state | 140ms settle (05); announced politely with rules-checked count; never confetti |

## Layer-3 token additions
`finding.card.class.*`, `profile.health.coverage.*`, `check.surface.paste.*` — Layer 2 bindings only.

## Reused-with-twist
- **DiffView**: profile version comparison (glossary changes as term-level rows).
- **Bulk ActionBar**: bulk-accept findings by class with count and per-item opt-out (ai-native-patterns §6 discipline applied to deterministic suggestions too).
