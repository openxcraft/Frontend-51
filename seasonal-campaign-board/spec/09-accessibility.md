# 09 — Accessibility: seasonal-campaign-board

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions (ar/en), 1280px and 360px viewports, 200% and 400% zoom. The signature risk of this product is countdown live-region spam — addressed head-on below.

## Keyboard map (critical paths)

- **CP-1 (moment → campaign)**: library grid: ↑/↓/←/→ between moment cards (P18 — inline-end arrow = next card in BOTH directions, mapping documented per rtl-rules §4); Enter opens detail; from detail, "Start campaign" is first control; form fields in tab order with labels persistent (a11y-baseline §5 — the visible label is the label; input hint text never substitutes for it); Escape from detail returns to library, focus to the originating card.
- **CP-2 (checklist loop)**: rows are a P18 grid — ↑/↓ move rows (scroll follows focus, never the reverse); Space toggles the focused row's status cycle (not_started→in_progress→done); E opens inline edit (P06: Escape restores, Tab commits+advances); A opens the assignee menu; B marks blocked and focuses the reason field (required — validation traps focus on the reason until non-empty or cancelled); ⌘/Ctrl+arrow extends selection for bulk; the action bar (P07) is reachable by Tab from the last selected row, names the count ("5 selected").
- **CP-3 (board & intervention)**: lanes navigate by ↑/↓ (lane) then ←/→ (tile); Enter drills into the weakest-campaign link; R on a tile jumps to readiness detail; export flow is a menu → dialog, focus-trapped, returns to trigger.
- **CP-4 (quick-start)**: the whole path is Tab-order (name → owner → create); no drag, no pointer-only steps (2.5.7 trivially satisfied).
- **CP-5 (closure)**: form fields in reading order; the waiver confirm dialog is focus-trapped with the open-critical list announced on open (assertive once); template editor rows reorder via ⌘+↑/↓ (drag has a keyboard equivalent, 2.5.7).
- **⌘K palette** (P05): bilingual search with normalization; results grouped (moments/campaigns/templates/assignees); Esc closes, focus returns to trigger.
- Shortcuts are modified-keys only (⌘/Ctrl chords, letters with modifiers) — no raw-letter keys, avoiding Arabic-layout conflicts (a11y-baseline §3); every shortcut has a visible button/menu equivalent.

## Focus order & visibility

Reading order: rail → main surface → detail drill-down; RTL mirrors the rail and breadcrumb flow (rtl-rules §2) while grid arrow mapping stays physically stable. Focus-visible at 2.4.13 strength (≥2px, ≥3:1 change contrast, ≥ area of 2px outline) — pill geometry never clips the ring (ring drawn outside the D-radius border). Sticky headers/lane headers honor 2.4.11 (focus scroll-margin token). No focus traps outside modals/popovers; every overlay returns focus to its trigger.

## Live-region announcement schedule (the countdown discipline)

**Countdown ticks NEVER enter live regions.** Digit updates are visual-only (batched crossfades, 10). Announcements fire on *state transitions* only:

| Event | Mode | Copy shape |
|---|---|---|
| Item status changed (toggle/assign) | polite | item title + new status + owner |
| Blocked reason saved | polite | item + "blocked: {reason}" |
| Bulk applied | polite | "5 updated, 2 skipped — reasons in the list" |
| Attention threshold crossed (open item due ≤7d) | polite, once per item per crossing | campaign + item + due date |
| Item became overdue | assertive, once per item | campaign + item + due date + "assign or reschedule" |
| Phase changed for a watched campaign | polite | campaign + new phase (التمهيد/الذروة/الانحسار) |
| Campaign closed / closure note saved | polite | campaign + counts summary |
| Export succeeded / failed | polite / assertive (failure) | artifact + expiry / error + retry |
| Validation error (blocked-without-reason, closure waiver) | assertive | field-linked message, focus moves to first error |
| Drift date confirmed / due dates shifted | polite | migration note ("3 items shifted by 1 day") |

Every announcement pairs with a visible surface (a11y-baseline §4 — an announcement without a visible equivalent is a defect): threshold/overdue announcements correspond to the intervention cluster; migration notes to the campaign's change list.

## Per-surface WCAG 2.2 AA checklist

- **S1 library**: cards are single targets (quick-start action inside is a separate 24×24 target); drift badges text+icon; filtered-empty offers reset (P01).
- **S2 moment detail**: phase map is a list semantically (not a visual-only band); template preview rows keyboard-navigable before any creation.
- **S3 board**: countdown urgency is color+icon+text (06); readiness meters expose `aria-describedby` count strings matching visible numbers; dual-calendar strip has table semantics with Hijri/Gregorian cells programmatically related; lane virtualization preserves focus (P19); 400% reflow: lanes stack vertically, tiles keep reserved digit width.
- **S4 checklist**: row status words in ink (11.6:1) — state color redundant; blocked reasons visible text; overdue rows marked with icon+text, never red alone; worst-case Arabic titles truncate at word boundaries (rtl-rules §4) with full title on focus/tooltip.
- **S5 closure**: waiver dialog lists open critical items as a real list; auto-summary labeled "computed from the checklist" (honesty for screen-reader trust).
- **S6 template editor**: reorder via ⌘+arrows; version diff rows are a table with headers.
- **S7 jobs/activity**: job states text+icon; activity rows filterable by keyboard.
- **S8/S9**: standard forms — autocomplete tokens on personal-data fields (assignee names), labels persistent, error summary focuses first error.
- **2.5.8 targets**: checklist toggle cell, tile actions, chips all ≥24×24px; dense D-radius controls audited (a11y-baseline §8.5).
- **3.3.7 redundant entry**: campaign creation recalls last-used owner and template override; closure forms pre-fill from computed facts (P11).

## RTL/LTR verification matrix (per surface, both directions)

Pure-ar render (all chrome RTL, Tajawal) · pure-en render (LTR, Hanken Grotesk) · mixed strings (campaign names like "White Friday 2026 — Mega Deals" inside Arabic lanes — bidi isolation on every interpolation) · numeral rendering under the Western policy in both directions (countdown "T-14", Hijri day numbers, percentages — never Arabic-Indic, per ledger; spot-check in RTL prose: "3 بنود متأخرة") · dual-calendar strip direction (time flows inline-start→inline-end; Gregorian and Hijri labels keep their script integrity inside RTL cells) · checklist grid column order mirrored with status column on the inline-start · urgency icons do not flip (clock/alert are symmetric-anchor glyphs; chevrons and next/previous DO flip — icon flipping table recorded per rtl-rules §2) · forms: labels and error placement on the correct inline edge · truncation at 320px with worst-case joined Arabic ("مستشارو التدقيق والحوكمة"-class strings on item titles) · 400% zoom one-dimension reflow both directions · `dir="auto"` on all user-entered text (campaign names, blocked reasons, closure lessons).

## Reduced-motion contract

Countdown digit crossfades → instant text swaps (threshold announcements still fire once, politely); done-settle overshoot → state chip appears (no movement); moment-window shading → instant fill; staggered reveals render simultaneously; page transitions are hard cuts. All state changes remain perceivable without motion (a11y-baseline §8.6 pass is part of the release matrix).
