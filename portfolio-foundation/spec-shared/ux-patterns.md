# UX Patterns — Cross-Family Principles

Status: SHARED FOUNDATION · 24 patterns expressed as principles. Products apply them with intent and record deviations in their own specs. A pattern applied "by default, without justification" is a Critic-rejection offense at every tier.

---

## State & Data Patterns

**P01 — Empty-state triage.** There are four different empties and they must never be conflated: first-run (no data yet, teach the value), no-data-after-activity (data existed, explain what removed it), no-access (data exists but is not yours to see — never say "empty"), and filtered-empty (data exists outside this filter — offer filter reset). Each surface's copy matrix (11-empty-loading-error.md) enumerates which empties apply.

**P02 — Skeleton hierarchy.** Skeletons mirror the final layout's geometry, including direction (RTL skeletons flip). Spinners are reserved for operations under ~300ms or genuinely indeterminate small operations. Long lists show progressive skeletons capped at one screen — never an infinite shimmer field.

**P03 — Optimistic writes with undo window.** Reversible mutations render immediately and expose a 5–7 second undo affordance instead of a confirm dialog. The adapter remains authoritative (07b): a failed confirmation triggers rollback and a typed error surface. Irreversible or bulk-destructive actions never use optimistic patterns.

**P04 — Destructive confirm ladder.** Level 1: single item, reversible → undo pattern. Level 2: single item, irreversible → confirm naming the consequence and the count ("Delete 1 campaign — its 12 posts are removed with it"). Level 3: bulk irreversible, or deleting a container → type-to-confirm with the item's name. Never a generic "Are you sure?".

## Navigation & Command Patterns

**P05 — Command palette.** Every Tier 1 and Tier 2 product exposes a ⌘K/Ctrl+K palette with bilingual search (Arabic normalization: alef/hamza variants, taa marbuta/haa, yaa forms), keyboard-selectable results grouped by section, and recent items. Tier 3 products include it when list surfaces exceed three.

**P06 — Inline edit with escape hatch.** Value-in-place editing where the display and the edit surface are the same region. Escape cancels and restores. Focus returns to the trigger. Tab commits and advances. Never trap focus in a cell.

**P07 — Bulk select + action bar.** Selection is initiated from row checkbox or a range gesture with a keyboard equivalent; a floating action bar anchors to the viewport bottom-inline edge, names the count, and scopes every action to "N selected". Clear selection is always one action away.

**P08 — Filter chips + saved views.** Active filters render as removable chips with an accessible description of each predicate. Filter states are shareable (saved views) and never silent — a filtered list always declares itself (ties to P01 filtered-empty).

## Form & Input Patterns

**P09 — Progressive disclosure forms.** Ask only what the current step needs to enable the next. Optional complexity hides behind explicit "Add more" affordances, never behind scroll luck. Each step must be independently valid before advancing.

**P10 — Autosave indicator states.** The save status is a persistent, calm surface cycling: saving → saved (fades after 3s) → conflict → offline-queued. Users never hunt for save state. Conflict surfaces both versions and asks for a choice; it never silently overwrites.

**P11 — Redundant-entry elimination (WCAG 2.2 §3.3.7).** Known values are pre-filled or recalled across steps and sessions within the product's own boundaries. Multi-session applications (e.g., KYC) recall prior answers and mark them as recalled.

## Async & AI Patterns

**P12 — Async job surfacing.** Any operation expected to exceed ~2s is a Job with visible state, honest progress, cancel, and completion delivery per async-contract.md. The UI never fakes instant completion of a background operation.

**P13 — Streaming text disclosure.** AI text streams into a reserved region (no layout shift). The region announces start and completion, not every token. Stop/regenerate are always available while streaming. Citation anchors bind to spans as they render.

**P14 — Quota & cost meters.** Consumption surfaces before and after metered operations, in units the buyer understands. A blocked operation says what was consumed, by whom, and when the window resets — before refusing, warn at 80%.

**P15 — Trust checkpoints.** AI output is draft-by-default. Any flow that promotes AI output to authoritative state (publish, send, save-as-record) shows a review diff and requires an explicit human confirmation.

## Accountability Patterns

**P16 — Diff views.** Versioned content exposes character- or block-level diffs with direction-aware layout (RTL diffs flow right-to-left). Deletions and insertions meet the same contrast contract as text.

**P17 — Activity log.** Every consequential mutation appends an actor-action-target-timestamp entry. The log is filterable and is the accountability surface for audits (legal/audit overlay products treat it as a compliance surface with export).

## Input Agility Patterns

**P18 — Keyboard-first grids.** Tables and boards support arrow navigation, range selection, and inline edit activation from keyboard alone. Focus is visible at 2.4.11/2.4.13 strength. Drag reordering always has a keyboard equivalent (WCAG 2.2 §2.5.7).

**P19 — Virtualized long lists with focus preservation.** Lists over ~200 rows virtualize. Scrolling never moves focus; focus moves scroll into view. Screen reader users receive row-count context on region entry.

**P20 — Offline banner + queued writes.** Connectivity loss is a persistent, non-modal banner. Writes queue locally with per-item state; queued items are reviewable and individually cancellable before reconnection flushes them.

## Communication Patterns

**P21 — Notification digest ladder.** Each notification class declares its tier: instant (page-visible or permissioned push), daily digest, weekly digest. Users control tiers per class. The product never multiplies toasts to simulate urgency.

**P22 — Onboarding value checklist.** First-run shows a short, honest checklist of value milestones (not feature tours). Each item links directly into the flow that achieves it. Tours-of-balloons are forbidden at every tier.

## Bilingual Patterns (portfolio-signature)

**P23 — Bilingual authoring columns.** When a surface authors both locales, they sit side-by-side with alignment links between corresponding blocks, per-side direction rendering, and sync-state indicators (in-sync / edited-since / length-far-apart warnings for UI strings).

**P24 — Dual-calendar dating.** Scheduling surfaces for MENA buyers can render both Hijri and Gregorian dates, with the active system explicit, hover/cross-reference to the other system, and Ramadan-aware planning mode where relevant (see seasonal-campaign-board, bilingual-content-calendar specs).
