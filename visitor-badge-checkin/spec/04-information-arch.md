# 04 — Information Architecture: visitor-badge-checkin

## Navigation model

Two modes share one app and one session model:

- **Desk mode** (admin/reception/host; desktop-first ≥1280px, responsive to 360px for host reads): left rail **اليوم Today** · **الزيارات Visits** · **سجل الزوار Log** · **الاستوديو Studio** (badge templates) · **الإعدادات Settings**. The today board is home; the visit detail (timeline + badge panel) is the product's core detail surface, opened from the board, the visits list, or a notification link.
- **Kiosk mode** (visitor-facing; locked full-screen tablet surface, no rail): welcome → check-in → badge-ready → thank-you. One question per screen, kiosk-config-driven; the receptionist can unlock an assisted variant with a keyboard-driven flow (09).

⌘K command palette (P05 — desk list surfaces exceed three): reaches visits (by visitor name, host, code), templates, hosts, and exports with bilingual normalized search (rtl-rules §4). Two-level IA throughout: section → item. Kiosk mode deliberately exposes NO navigation — a visitor's path is a flow, not a tree; Back is the only global kiosk control besides the language switch and the idle-timeout reset.

## Entity overview (07a for full shapes)

Workspace → Members (hosts) → VisitInvitation/Visit (one entity, invitation-born or walk-in) → VisitEvents (append-only timeline: created, notified, checked-in, badge-issued, badge-voided, corrected, checked-out, no-show sweep) → Badge (per visit; resolved from BadgeTemplate version; artifact link) → BadgeTemplate (versioned spec) → ExportArtifacts (log/in-building/archive) → Jobs (export, retention sweep, end-of-day sweep) → VisitorProfile (returning-visitor match key, normalized). KioskConfig and WorkspaceSettings hang off the workspace.

## Screen inventory (10)

| # | Screen | Mode | Purpose | Data needs (→ 07b) |
|---|---|---|---|---|
| S1 | Today board | desk | expected next, in-building now, recent arrivals, no-show zone; arrival actions | getFrontDeskBoard, getVisit, getSession |
| S2 | Visits list | desk | all visits, filters + saved views (P08), bulk none (single-item actions only) | listVisits, cancelVisit |
| S3 | Pre-registration composer | desk/host | invitation fields, window, host, type; code + link on save | createVisitInvitation, updateVisit, cancelVisit, listHosts, addHost, getUsage |
| S4 | Visit detail | desk | timeline (P17), badge panel with lineage, host-notify events, state chip | getVisit, previewBadge, issueBadge, voidBadge, getBadge, checkOutVisitor |
| S5 | Visitor log & exports | desk | log table, in-building list view, export jobs, retention statement | listVisits, exportVisitorLog, getArtifact, listJobs, getWorkspaceSettings |
| S6 | Badge studio | desk | template list, spec editor, validation issues, live bilingual preview | listBadgeTemplates, getBadgeTemplate, saveBadgeTemplate, validateBadgeTemplate, previewBadge |
| S7 | Settings | desk | kiosk config, retention window, purposes, notification tiers, roles note | getKioskConfig, saveKioskConfig, getWorkspaceSettings, saveWorkspaceSettings |
| S8 | Host surface — my guests | host (360px-capable) | expected guests, arrival pings, compose, cancel; notification-link target | listVisits (host filter), getVisit, createVisitInvitation |
| S9 | Kiosk check-in | kiosk | welcome/language → code / walk-in / returning → confirm → badge-ready pass | getKioskConfig, getVisitByCheckInCode, listHosts, lookupReturningVisitor, checkInVisitor, issueBadge, getBadgeArtifact |
| S10 | Jobs console | desk | export jobs, retention/end-of-day sweeps, cancel/retry, link-to-context | listJobs |

## Per-screen state obligations

Four empties per P01 everywhere a list renders: S1 first-run offers the seeded sample day (interactive — loads four fixture visits so the board reads before any real guest); S2/S5 filtered-empty declares itself with filter reset; S8 no-access states for hosts without membership; S5 archived-range queries route to archive export, never "empty". Skeletons mirror final geometry per direction (P02) — the kiosk never shows a skeleton for the welcome screen (config is cached locally). Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **The today board is home, not a dashboard**: the office administrator's day is a queue of arrivals — expected/arrived/in-building is the queue's honest shape (01 complaint mining: "who is waiting" is the recurring question). KPI walls, trend charts, and visitor-analytics are excluded (LOOP-10 spirit — the product reports state, not insights).
- **Visit detail is one timeline**: invitation edits, notifications, check-in, badge actions, and check-out are events on one append-only rail (P17) — the record's honesty (Salma's persona) is an IA property before it is a data property.
- **The badge studio is a first-class section, not a settings tab**: the badge spec is the product's named differentiator (00); burying it in settings would bury the wedge. Templates get their own surface with validation + preview loops.
- **Kiosk is a mode, not an app**: one binary, one session model, one adapter — the kiosk renders the same visit state the desk renders. A separate "kiosk app" would fork the state machine the product's honesty depends on.
- **Host mode is deliberately thin**: S8 is the only host surface — the notification loop's other half never pays the complexity tax of the desk (02 Khalid).
- **Jobs console consolidated (T3 posture)**: export/retention/sweep jobs share one console with link-to-context (async-contract §7 allows Tier-3 consolidation into an activity surface).
- **Log and board are separate screens**: the board is "now" (computed, moment-scoped); the log is "history" (retention-scoped). Conflating them is how paper logbooks failed — the board must never be mistaken for the record.
