# 09 — Accessibility: arabic-copy-studio

SME-F pass · Baseline: _shared/a11y-baseline.md (WCAG 2.2 AA, both directions). This file adds the product's keyboard map, announcement schedule, per-surface checklist, and the RTL/LTR verification matrix.

## Keyboard map (critical paths)

**CP-1**: palette ⌘K → new document; brief form fields tab in declared order; RegisterDial = radio group (arrows change, space selects); generation: Enter starts, Esc stops (stream region keeps focus anchor); after done, focus moves to first generated block.
**CP-2**: selection via keyboard (shift+arrows over blocks); DiffBrush: ⌘⏎ accept, Esc reject, R re-refine; focus ring persists on the passage through accept/reject.
**CP-3**: transform via menu; Parity Weave: blocks navigable with ↑/↓, Tab crosses columns via alignment links (link order = reading order), Enter opens block actions, F flags length delta.
**CP-4**: bulk select via shift+arrows in report; apply = action bar (P07) reachable by Tab; per-item opt-out via space on row.
**CP-5**: review mode: C comment, A approve, R request-changes; comment anchors announced as "block 3 of 7".
Global: no raw-letter shortcuts (Arabic layout safety, a11y-baseline §3); all drag interactions (block reorder) have keyboard equivalents (2.5.7): ⌘↑/⌘↓ move block.

## Screen-reader announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Generation start / done | polite | "بدأت الصياغة" / "اكتملت الصياغة — ٤٠٠ كلمة تقريباً" |
| Stream tokens | never | (only start/end/summary — ai-native-patterns §2) |
| Suggestion accepted | polite | revision summary |
| Conflict detected | assertive | both revisions named + action |
| Register drift flag added | polite | drift summary on focus, not on appearance |
| Quota rung change | polite | rung + reset time |
| Export artifact ready | polite | name + expiry |
| Dialect detected | assertive | choice required |

Live regions always pair with visible surfaces (a11y-baseline §4).

## Per-surface checklist (S1–S14)

All surfaces: four-empties implemented (P01), skeletons mirror geometry RTL (P02), focus-visible at 2.4.13 strength, targets ≥24px (2.5.8), contrast per token contracts (05). Specifics:
- **S3 editor**: 400% reflow single-column with rails as sheets; long Arabic word worst-case ("مستشارو التدقيق والحوكمة") does not overflow containers; tashkeel line-height growth does not clip (rtl-rules §3).
- **S5 Parity Weave**: two columns reflow to stacked compare at narrow widths; alignment links remain operable; length-delta flags are text, not color-only.
- **S4 AI panel**: panel is not a chat log — heading structure (h2 per action); stop/regenerate are buttons with state.
- **S9 review**: diff old/new meet 4.5:1; strike-through never the only signal (icon + aria).
- **S12 usage**: meter has text equivalent (used/limit + reset date).
- **S6 glossary**: conflict resolution dialog names both definitions and requires explicit choice (CP-4, LOOP-9 UX).

## RTL/LTR verification matrix (per surface, both directions)

For each of S1–S14, recorded pass/fail on: pure-Arabic, pure-English, mixed user strings (bidi isolation), numeral rendering (policy per 05), embedded Latin tokens in RTL prose, table/grid mirroring (document list), editor toolbar order mirroring, DiffBrush strike direction, citation chip placement (inline-end), truncation at 320px, 400% zoom reflow. The mock's seeded mixed-locale documents guarantee test fixtures for every cell.

## Shortcut table (complete, Arabic-layout-safe — modified keys only)

| Context | Shortcut | Action |
|---|---|---|
| Global | ⌘K / Ctrl+K | command palette |
| Editor | ⌘⏎ | accept DiffBrush suggestion |
| Editor | Esc | reject suggestion / close panel |
| Editor | R | re-refine with note |
| Editor | ⌘↑ / ⌘↓ | move block (drag alternative, 2.5.7) |
| Parity Weave | ↑/↓ | navigate blocks |
| Parity Weave | Tab | cross columns via alignment link |
| Parity Weave | F | flag length delta |
| Review | C / A / R | comment / approve / request changes |
| Glossary report | Space | opt-out row from bulk |
| Any list | shift+arrows | range select |

## Overlay applicability

No fintech/healthcare/legal overlay for this product. Data confidentiality expectations from personas (Hussein/Omar) are honored structurally (workspace separation in 07a; no cross-workspace operation exists on the adapter).
