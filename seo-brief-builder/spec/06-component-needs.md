# 06 — Component Needs: seo-brief-builder

## Shared primitives consumed

Button, Menu, Dialog, Tabs (locale tabs + workspace tabs), Tooltip, Toast, Skeleton, EmptyState, FilterChips (P08 — intent/locale filters with removable chips), JobRow, DiffView (parity matrix state compare), QuotaMeter (assist-run window, P14), ActionBar (bulk keyword ops, P07), CommandPalette (P05), AutosaveIndicator (P10 — brief editor).

## Invented components (5)

| Component | Purpose | Obligations |
|---|---|---|
| **KeywordTable** | per-locale keyword rows: text (bidi-isolated, own-direction rendering), normalized form (expandable panel — normalization disclosure per ai-native-patterns §7.4), volume/cost cells, intent override, exclude toggle | P18 grid (arrow navigation, range selection); virtualized >200 rows (P19) with focus preservation; mixed-script rows never force ambient direction; Western numerals; normalization panel is keyboard-reachable and SR-readable; row menu has visible button equivalents |
| **ClusterCanvas** | the cluster view: cluster cards (name, member count, intent chip + confidence, provenance chip assisted/deterministic) with member keywords listed inside | Drag-to-move between clusters has keyboard equivalent (move-to-cluster menu — 2.5.7); card semantics = list items, canvas is a list of cards (SR); assist suggestions render as labeled suggestions with accept/override actions (P15 draft-by-default); provenance chip is icon+text, never color-only |
| **IntentSelector** | intent assignment control for a cluster or keyword: 4 canonical intents, suggested-vs-confirmed state | Radio-group semantics with visible labels; suggestion state announced politely on focus; confirmation is an explicit action (the P15 gate feeding parity); commercial text uses commercial-deep (contrast contract, 05) |
| **ParityMatrix** | intent × locale coverage grid with matched pairs and gap list; each cell carries counts as text (never heat-only, per charts.csv contract) | Table semantics with row/column headers announced; gap rows are focusable with resolve/accept actions; accepted-gap state uses strikethrough+icon+label (never color alone); both locale columns render at their own direction; matrix state change always paired with text delta + polite announcement |
| **BriefOutlineEditor** | section list: role icon, text, locale-scope mark, bound-cluster chips, reorder | Reorder drag has keyboard equivalent (⌘↑/⌘↓ — 2.5.7); autosave status persistent (P10); stale-cluster warning chip per section ("cluster changed since assembly"); section-to-cluster binding is visible SR text ("3 clusters bound"); conflict surfaces both versions inline |

## Layer-3 token additions

`keyword.row.normalized.*` (disclosure panel), `cluster.card.provenance.*` (assisted/deterministic chip states), `intent.chip.{informational|navigational|commercial|transactional}.*` (UI-ink vs text-bearing variants per 05 contracts), `parity.matrix.gap.*` / `parity.matrix.accepted.*`, `brief.section.stale-cluster.*` — all Layer 2 re-binds of the 05 palette; no raw values (token-architecture §1).

## Reused-with-twist

- **DiffView**: parity matrix before/after re-run compare (structure-level rows: intent coverage counts, gap list changes) — not character diffs.
- **EmptyState**: S1 first-run sample topic (interactive: loads the seeded bilingual topic so parity is experienceable pre-import — CP non-happy path, P22).
- **QuotaMeter**: assist-run window only; deterministic runs deliberately render NO meter (unlimited by design — the degradation floor must not read as rationed).

## Deviations recorded

- Fully-rounded intent/filter chips inside density-B system: permitted exception for removable-chip semantics (P08), declared in 05; all other radii in the B family.
- Icon flip decisions (rtl-rules §2): locale-switch arrows and ingest tray glyphs are symmetric; "move to cluster" directional glyph flips in RTL; intent markers never flip (semantic anchors).
