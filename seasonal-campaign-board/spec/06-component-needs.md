# 06 — Component Needs: seasonal-campaign-board

## Shared primitives consumed

Button (pill, D-radius), Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, JobRow, ProgressBar (readiness), ActionBar (bulk P07), DiffView (template versions), QuotaMeter (export quota P14), ActivityFeed (P17).

## Invented components (7)

| Component | Purpose | Obligations |
|---|---|---|
| **CountdownTile** | per-campaign countdown: T-days numeral, phase label (التمهيد/الذروة/الانحسار), urgency state (on-track/attention/overdue — color+icon+text triplicated) | Digits in reserved-width tabular figures — no layout shift on update (10); updates at batched cadence, crossfade not slide; **reduced-motion-safe** (instant swap + threshold announcement only, 09); counts to the anchor from serverTime, never client clock; urgency thresholds announced on crossing, never per tick |
| **MomentLibraryBrowser** | season-grouped card grid with kind chips, drift badges, within-days filter | Card = single link target + quick-start action (CP-4); drift badge is text+icon (never color-only); filters are removable chips with described predicates (P08); filtered-empty offers reset (P01) |
| **ChecklistBoard** | campaign checklist rows grouped by section/phase with owner, status, due-T-minus, criticality | Inline edit P06 (escape restores, tab commits+advances); arrow-key row navigation P18; bulk select with keyboard equivalent + action bar naming the count (P07); blocked rows expose reason; needs-owner cluster pinned; virtualize >200 rows with focus preservation (P19); status words always ink-readable (11.6:1), state color is redundant coding |
| **DualCalendarStrip** | Hijri+Gregorian month strip with moment windows shaded and active-system explicit | Active system labeled ("Gregorian primary · Hijri cross-reference"); hover/focus cross-references the other system; method disclosure one click away (Q-5); strip mirrors in RTL (time flows inline-start→inline-end); moment windows shaded with tint + pattern for color-blind safety |
| **ReadinessMeter** | percent-complete + counts (critical open / at-risk / overdue / blocked) | Percentage never the only signal — counts listed as text; meter fill color is redundant; aria-describedby summary string matches visible numbers exactly |
| **ClosureNoteForm** | what-shipped (deterministic summary), what-slipped (pre-filled, editable), lessons, carry-to-template | Auto-summary is computed from checklist facts and labeled as such; waiver confirm names open critical items (P04-adjacent discipline, CP-5.3); no content is silently overwritten on edit (revision-protected) |
| **TemplateEditor** | versioned checklist-template structure editor (items: title, role, criticality, dueOffsetDays) | Row reorder via drag AND ⌘+arrow equivalent (2.5.7); version badge + restorable history; save conflict surfaces both versions (P10); offset changes preview affected future campaigns honestly |

## Behaviors, states, a11y notes (cross-cutting)

- **States**: every interactive component carries hover, focus-visible (2.4.13 strength — 2px ring, ≥3:1 change contrast), pressed, disabled, selected; countdown tiles additionally carry stale (offline badge), attention, overdue.
- **Live-region discipline**: countdown ticks NEVER enter live regions; announcements fire only on state transitions (attention/overdue threshold crossings, phase changes) — polite mode, once (09 schedule).
- **Bidi**: all user-text fields `dir="auto"` with isolate marks on inline interpolations; mixed campaign names in lanes are the fixture case (09 matrix).
- **Touch/target**: all interactive targets ≥24×24 CSS px (2.5.8) — checklist row hit areas include the status toggle cell; pill controls at D-radius still meet minimum box.
- **Terminology**: component labels use the fixed glossary (02) — one term per concept across all seven components.

## Layer-3 token additions

`countdown.tile.digit.width`, `countdown.tile.state.attention/overdue/blocked.*`, `moment.card.driftbadge.*`, `calendar.strip.momentwindow.fill/pattern`, `checklist.row.status.*`, `readiness.meter.fill.*`, `closure.form.summary.*` — all resolved as Layer-2 bindings per token-architecture (no raw values above Layer 1; states as suffixes).

## Reused-with-twist

- **DiffView**: template version comparison (structure rows — offset/role/criticality per row, not text chars).
- **EmptyState**: first-run library-as-empty-state with sample-campaign offer (CP-1 non-happy) — interactive, not dead text.
- **QuotaMeter**: export-count meter with 80% warning (P14) — the product's only metered surface.
