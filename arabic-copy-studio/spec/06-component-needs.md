# 06 — Component Needs: arabic-copy-studio

SME-C/D pass · Shared primitives consumed (from the foundation) + product-specific components to invent. Each invented component declares its a11y and motion obligations.

## Shared primitives consumed

Button (verb-labeled, cut radius), TextField/Select/Radio (P09 progressive forms), Menu, Dialog (focus-trapped), Tabs (editor modes), Toast (P21 ladder), Tooltip, Skeleton (P02, RTL-mirrored), EmptyState (P01 four empties), FilterChips + SavedViews (P08), Action Bar (P07 bulk), ActivityLog renderer (P17), DiffView primitives (P16), JobRow/JobDetail (async-contract §7), QuotaMeter (P14), StreamSurface base (P13).

## Invented components (7)

| Component | Purpose | Inventor's obligations |
|---|---|---|
| **RegisterDial** | Register selection (بيضاء/وسطى/dialect-tolerant) with plain-language effect previews | Radio-group semantics; keyboard native; preview text changes announced politely; no radial-drag dependency (2.5.7-safe) |
| **TashkeelToggle** | Vocalization layer on/off with line-height warning | Announces state + effect ("تشكيل مفعّل — سيتم تكبير تباعد الأسطر"); reflow budgeted (CLS ≤0.02 by pre-reserved line boxes) |
| **DialectWarningCard** | Dialect detection result + normalize/accept choice | Explicit choice pattern (ai-native-patterns §7); choice recorded in document metadata; Esc-safe |
| **StreamCanvas** | Reserved-region streaming text with citation anchors and Ink Settle motion | P13 contract; live-region start/end only; citation chips focusable in source panel; reduced-motion = chunk fade |
| **DiffBrush** | Inline passage refine overlay (old struck / new inked) | Accept/reject keyboard-first (⌘⏎/Esc); contrast 4.5:1 for both layers; RTL strike direction follows text direction |
| **GlossaryChip** | Term marker in text + parity chip in Parity Weave | Hover/focus shows term definition popover; chips are exemption-aware (code/Latin runs excluded); screen-reader text includes term id |
| **ParityWeave** | Side-by-side ar/en aligned blocks with sync states (P23) | Alignment links keyboard-navigable; length-delta flags; narrow-viewport stacked compare (400% reflow-safe); direction rendering per column |

## Layer-3 token additions (token-architecture §3)

`stream.canvas.background`, `stream.citation.chip.*`, `diffbrush.old/new.text`, `parity.column.gutter`, `glossary.chip.*`, `registerdial.option.state.*` — each binds to Layer 2 semantic tokens; no raw values.

## Reused-with-a-twist (documented deviations)

- **EditorToolbar**: standard toolbar primitive + RTL-aware order and bidi-isolated content actions (bold for Latin runs only within RTL paragraphs — declared capability, not assumption).
- **RevisionTimeline**: standard timeline primitive mirrored RTL with revision nodes announced as list items (not graphics).
