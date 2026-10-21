# 09 — Accessibility: interactive-story-builder

SME-F pass · WCAG 2.2 AA floor, both directions, 200%/400% zoom, 1280px + 360px viewports (a11y-baseline §1). Numerals per ledger (AR-indic optional in Arabic prose; canonical storage).

## Keyboard map (critical paths)

| Path | Keys & order |
|---|---|
| CP-1 library → new story | List navigation; N = new story; dialog focus-trapped, Escape cancels, focus returns to trigger. Gallery: arrows between template cards; Enter previews, Enter again selects. |
| CP-1 outline editor | ChapterRail ↑/↓ (physical mapping stable in both directions, rtl-rules §4); Enter opens chapter's board. StepBoard arrow-grid; Enter selects → inspector; S = add step; ⌘/Ctrl+↑↓ reorders focused chapter/step (2.5.7 drag alternative), announcing old→new position politely. |
| CP-1/3 step inspector | Tab: layout → media → locale tabs → body blocks. P06: Escape restores, Tab commits + advances, no focus traps. Locale tabs switch the edit region's direction (announced). |
| CP-2 sync grid | Rows are focusable entries announcing both locales' state in words + word counts; E edits the missing/stale cell; R = mark reviewed; alignment link jumps preview, focus returns on close. |
| CP-3 preview | Keyboard scrolling; chapter progress announced politely on chapter change; jump-to-chapter menu (J) — the skip affordance is keyboard-reachable; media click-to-play with full player keyboard control. |
| CP-4 suggestion | Reserved region announces start/completion (never per-token); diff rows focusable; A applies; per-item opt-out via space; Stop/Regenerate reachable from first token. |
| CP-5 review/export | Notes list navigable; resolve per note; approve names the version, single target; export dialog validates scope; errors focus first finding. |
| Global | ⌘K/Ctrl+K palette with bilingual normalized search (P05); shortcuts use modified keys only (Arabic-layout conflicts, a11y-baseline §3). |

## Focus order per screen

S1 → S3 → S4 follow reading order (inline-start first; mirrored in RTL). Focus ring: crimson-dark, ≥2px, ≥3:1 change-contrast, scroll-margin so the sticky chapter rail never obscures focus (2.4.11/2.4.13). Modals trap + return-to-trigger. 400% zoom: authoring surfaces reflow to one column; no two-dimensional scrolling anywhere except the preview scroll experience itself (one-dimensional by nature).

## Per-surface WCAG 2.2 AA checklist

- **S3/S4**: drag reorder has ⌘-arrow equivalent (2.5.7); targets ≥24×24px on cards and rail (2.5.8); validation field-linked with error summary focusing first error; autosave visible + announced politely (P10).
- **S5 sync**: state never color-only — icon + word per state (06); divergence warnings polite; missing-locale actions focusable; word counts in the declared numeral system.
- **S6 preview**: captions present (1.2.x); click-to-play only (a11y-baseline §6); progress announced; reduced-motion variant renders step changes as opacity steps, no scroll-driven transforms.
- **S7 QA**: findings are links; severity by text prefix (error/warning), not color alone; re-run one target.
- **S8 review**: notes anchored to steps via described association; approval announces actor + version.
- **S2/S9/S10**: list semantics with counts on region entry; library and activity virtualize past 200 rows (P19).

## RTL/LTR verification matrix (per surface, both directions)

Mirrors: chapter rail position, step order, side-by-side layout placement (inline-start/end), progress indicator direction, breadcrumbs, pagination, reorder affordance side. Does NOT mirror: media playback controls, logos/credits (bidi-isolated), embedded Latin tokens and data figures, timecodes, numeral rendering inside stat-bands (numeral-system governed). Fixed cases per release (a11y-baseline §8): pure-Arabic render; pure-English render; mixed strings (Latin credits inside Arabic captions — seeded fixture); embedded Latin/numeric tokens in RTL; truncation at 320px with worst-case Arabic strings ("مستشارو التدقيق والحوكمة"); 400% reflow both directions; bidi isolation on all user-generated content (`dir="auto"` inputs).

## Live-region announcement schedule (async ops — every announcement pairs a visible surface)

| Event | Mode | Visible equivalent |
|---|---|---|
| Autosave cycle (P10) | polite | autosave chip |
| Step reorder | polite (old→new position) | board order |
| Suggestion start / completion | polite (summary on completion — never per-token, P13) | reserved region + summary |
| Suggestion stalled >8s | polite + retry guidance | stalled state in region |
| QA completed | assertive (issue counts) | QA panel |
| Validation errors | assertive, field-linked | inline messages + summary |
| Export progress | polite per chapter milestone | determinate job label |
| Export ready / expired | polite (artifact + expiry) | artifact row |
| Conflict (both versions kept) | assertive | conflict dialog |
| Offline queue / reconnect flush | polite | banner (P20) |
| Approval / status change | polite (actor + version) | status chip + activity log |
