# 09 — Accessibility: bilingual-content-calendar

Baseline: _shared/a11y-baseline.md, both directions, dual-calendar surfaces included in verification matrix.

## Keyboard map (critical paths)
- **CP-1**: grid navigation = arrow keys across slot cells; Enter opens slot drawer; M opens moments panel; D toggles dual-calendar emphasis (announces primary system).
- **CP-2**: drawer: variant panes Tab-ordered ar→en; status changes via S key menu; parity announced on pane switch ("النسخة العربية جاهزة، الإنجليزية ناقصة").
- **CP-3**: pattern apply = P on selected week range; bulk bar (P07) Tab-reachable; override dialog requires reason text (3.3.7 satisfied by recalling last override reason pattern, not value).
- **CP-4**: review list = standard list (P19 beyond 200 rows); C comment / A approve / R request-changes; mobile review = same list semantics.
- Slot move: ⌘+arrows (keyboard alternative to drag, 2.5.7); move announces new datetime in BOTH calendars.

## Announcement schedule
| Event | Mode | Copy shape |
|---|---|---|
| Slot created/moved | polite | title + dual datetime |
| Parity state change | polite | "missing English variant" (icon+text in visual layer too) |
| Pattern applied (job done) | polite | count + conflicts count |
| Approval required (reviewer) | polite on review entry | horizon + gap count |
| Conflict on slot | assertive | reason + both datetimes |
| Export ready/expired | polite | artifact + expiry |

## Per-surface checklist
- S2 grid: cells ≥24px targets; parity icon+text; focus-visible across cells (2.4.13); month/season transitions preserve focus cell.
- DualCalendarHeader: single coherent announcement (not two fragmented dates); cross-reference reachable by focus, not hover-only.
- S3 drawer: focus trap with return; variant panes' direction rendering per pane; length hints announced softly.
- S6/S10 review: actionable list is the keyboard primary (grid is context); comments anchored with aria context.
- 400% zoom: grid degrades to day-list (declared reflow); drawer becomes full-page sheet; long Arabic titles truncate at word boundaries (rtl-rules §5).

## RTL/LTR verification matrix
Per surface S1–S10, both directions: time-axis mirroring (RTL grids run right-to-left), dual header coherence, mixed-string slot titles (bidi isolation), channel icons non-mirrored (brand-ish marks), moment badges mirrored placement, parity chips inline-end anchoring, truncation at 320px, 400% reflow. Seeded mixed-locale slots in the mock guarantee fixtures.
