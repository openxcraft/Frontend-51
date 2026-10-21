# 04 — Information Architecture: bilingual-content-calendar

## Navigation model
Left rail: horizons (plan selectors by season/month), channels filter, saved views (P08). Top bar: horizon title, mode switcher (Day/Week/Month/Season), review status, export action. Right contextual panel: slot detail / moments library (contextual). ⌘K palette reaches slots, moments, channels, and actions. Two-level model: horizon grid → slot detail (drawer on mobile review).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Workspace home | horizons list, onboarding checklist (P22), recent activity | listHorizons, getCalendarMethod |
| S2 | Calendar grid | the planning surface (4 modes) | getSlots(range, filter), getMoments(range) |
| S3 | Slot detail | variants, owners, status, history | getSlot, updateVariant, updateSlot |
| S4 | Moments library | seasonal moments + timing patterns | listMoments, applyPattern(Job) |
| S5 | Season mode console | Ramadan/season configuration, quiet hours, city | getSeasonConfig, updateSeasonConfig |
| S6 | Review mode | conflict + parity actionable list, comments | getHorizonReview, addComment, resolveComment, approveHorizon |
| S7 | Export | format choice, artifact list | exportHorizon(Job), getArtifact |
| S8 | Channels & workspace settings | channels, calendar method declaration, locale | workspace ops |
| S9 | Jobs center | bulk pattern/export jobs (P12/async §7) | listJobs |
| S10 | Mobile review | read grid + approve/comment (subset) | getSlots(range), addComment, approveHorizon |

Mobile (360–767px): S1, S2 read+edit-lite (day mode only), S6, S10. Season console and pattern bulk are desktop/tablet.

## Per-screen state obligations
Four empties (P01) per list-bearing surface; skeletons mirror grid geometry (P02 — slot skeletons are the grid's own cells); error classes per 03 mapping; all documented in 11.

## IA decisions and rationale
- **Horizon, not "project", is the unit**: planners think in horizons (a month, a season) — grid modes live inside a horizon, preserving context.
- **Moments library is a first-class panel, not a settings page**: season intelligence is a selling interaction (Yousef shows it in client meetings).
- **Slot detail is a drawer, not a route**: planners keep grid context while editing (grid IS the workspace).
- **Review is a mode over the grid + a list**: Reem gets both spatial (grid) and task (list) views — the list is the working surface, the grid the context.
