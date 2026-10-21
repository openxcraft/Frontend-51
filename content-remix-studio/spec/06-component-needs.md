# 06 — Component Needs: content-remix-studio

## Shared primitives consumed
Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, JobRow, DiffView (recipe version compare), QuotaMeter (run quota), ActionBar (bulk export).

## Invented components (4)

| Component | Purpose | Obligations |
|---|---|---|
| **RecipeCard** | gallery card with STRUCTURE preview (sections, counts, policies) | Preview is text-first (screen-reader equal); run action single target; version badge |
| **FidelityReceipt** | derivative↔source span links with condensation ratios | Links keyboard-navigable in reading order; bidi-safe spans; "edited beyond recipe" honest state |
| **StructureMap** | recipe editor's section-role editor | Field-level validation messages; drag-reorder has keyboard alternative (2.5.7); sanity preview live |
| **DerivativeStack** | multi-derivative result presentation with status | Overshoot ONLY on complete moment (05); stack is a list semantically; per-item export opt-in |

## Layer-3 token additions
`recipe.card.structure.*`, `receipt.link.state.*`, `derivative.stack.complete.*` — Layer 2 bindings.

## Reused-with-twist
- **DiffView**: recipe version output comparison (structure-level rows, not text chars).
- **EmptyState**: first-run sample-source remix (CP-1 non-happy) as an interactive empty, not dead text.
