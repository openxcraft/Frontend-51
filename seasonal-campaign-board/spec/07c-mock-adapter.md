# 07c — Mock Adapter: seasonal-campaign-board

In-memory, deterministic, **zero external dependencies** (no network, no filesystem, no timers beyond declared cadences). Implements `SeasonalCampaignBoardAdapterV1` in full (30 operations). **Fixed clock injection**: the mock's clock is a constructor-configurable constant (`fixedClock`, default `2026-02-10T09:00:00+03:00`); every `daysUntilAnchor`, due-state, readiness derivation, and phase computation reads it — countdown output is byte-identical between runs.

## Seed dataset (named, fixed)

**Seasons (2)**: `season-2026` "2026 retail year" (current); `season-2027` "2027 retail year" (upcoming).

**Moments (9)**:
| id | name | kind | anchorDate | driftAware | hijri | phases (offsets) |
|---|---|---|---|---|---|---|
| mmt-ram1447 | Ramadan 1447 · رمضان ١٤٤٧* | religious-season | 2026-02-18 | yes (±1 day, moon-sighting note) | 1447/09/01 | build-up −35→−1 · peak −1→+20 (last-10-days note) · wind-down +21→+24 |
| mmt-fitr1447 | Eid al-Fitr 1447 | religious-festival | 2026-03-20 | yes | 1447/10/01 | build-up −21→−1 · peak 0→+3 · wind-down +4→+6 |
| mmt-adha1447 | Eid al-Adha 1447 | religious-festival | 2026-05-27 | yes | 1447/12/10 | build-up −14→−1 · peak 0→+4 · wind-down +5→+7 |
| mmt-wf2026 | White Friday 2026 | commerce-event | 2026-11-27 | no | null | build-up −30→−8 · peak −8→0 (deal week) · wind-down +1→+7 |
| mmt-ksand96 | Saudi National Day 96 | national-day | 2026-09-23 | no | null | build-up −14→−1 · peak 0 (event-day anchor) · wind-down +1→+3 |
| mmt-found26 | Saudi Founding Day 2026 | national-day | 2026-02-22 | no | null | build-up −10→−1 · peak 0 · wind-down +1→+2 |
| mmt-uaed96 | UAE Eid Al Etihad 2026 | national-day | 2026-12-02 | no | null | build-up −14→−1 · peak 0→+1 · wind-down +2→+4 |
| mmt-bts26 | Back to School (late Aug) | school-term | 2026-08-24 | no | null | build-up −28→−8 · peak −8→+7 · wind-down +8→+14 |
| mmt-ram1448 | Ramadan 1448 | religious-season | 2027-02-07 | yes | 1448/09/01 | same shape as 1447 |

\* Arabic names render with Western digits per the numeral policy: "رمضان 1447".

**Checklist templates (5)**: `tpl-ramadan-retail` v3 (14 items — storefront banner T-14, gift-guide content T-21, promo config T-7, price-file freeze T-2, iftar-hours customer-comms T-1, last-10-days push T-3 … roles: e-commerce/content/merchandising/field; 5 critical) · `tpl-eid-gifting` v2 (11 items, 4 critical) · `tpl-white-friday` v4 (16 items, 6 critical — deal-week stock lock T-10, price freeze T-2 …) · `tpl-national-quick` v1 (5 items, 2 critical) · `tpl-back-school` v1 (10 items, 3 critical). Version history retained: `tpl-ramadan-retail` v1→v3 shows the closure loop's past bumps.

**Assignees (5)**: Reem (retail marketing lead, owner) · Fahad (e-commerce specialist) · Noura (content coordinator) · Yousef (field/store marketing) · Dalal (store ops, **active: false** — deactivated mid-season fixture for CP-2 edge c).

**Campaigns (6)**:
1. `cmp-ram-nights` "Ramadan Nights — Home & Kitchen" (mmt-ram1447, active, owner Reem): 14 items — 9 done, 1 in_progress, 1 **blocked** (Fahad, reason: "price approval outside the tool — waiting on finance reply"), 1 **overdue** (gift guide at T-21 → due 2026-01-28), 2 not_started (1 unassigned). Readiness at fixedClock: 71% (10/14 done+na), criticalOpen 1, atRisk 1, overdue 1.
2. `cmp-eid-edit` "Eid Gifting Edit 1447" (mmt-fitr1447, active, owner Reem): 11 items — 2 done, 9 not_started, 3 unassigned. 18% readiness, pre-season phase (build-up opens 2026-02-27).
3. `cmp-wf-mega` "White Friday 2026 — Mega Deals" (mmt-wf2026, draft, owner Fahad): 16 items all not_started, 0% readiness — fresh-instantiation fixture.
4. `cmp-ksand96` "Saudi National Day 96 — Green Pride" (mmt-ksand96, active, owner Noura): 5 items — 4 done, 1 in_progress due 2026-09-16 (on-track far-out fixture) → 80%.
5. `cmp-bts26` "Back to School 2026" (mmt-bts26, active, owner Yousef): 10 items — 5 done, 2 not_started unassigned, 1 na, 1 in_progress, 1 blocked (Dalal legacy: deactivated assignee fixture).
6. `cmp-ram1446-closed` "Ramadan 1446 Gifting" (past moment, **closed**): closureNote present — whatShipped "12 of 14 items; gifting guide and last-10-days push shipped late by 4 days", whatSlipped "teaser brief reached content late", lessons "move content deadlines 7 days earlier; add a print-dispatch item for field", waivedCriticalItems [], carriedToTemplate true (this note is the visible reason `tpl-ramadan-retail` is at v3 — the loop, seeded).

**Jobs (2)**: `job-exp-1` export-readiness succeeded, artifact expires 2026-03-10 (within window) · `job-exp-2` export-task-handoff **queued** (cpm-ram-nights, assigneeIds [Fahad]) — queued-state fixture for S7.

**Activity (12 entries)**: campaign-created (cmp-ram-nights by Reem), item-updated ×3 (one with blockedReason detail), items-bulk-updated ("Mark 4 done" by Fahad), item-added (custom, "added beyond template"), item-removed (with undo detail), template-saved (v3 by Reem), campaign-closed (cmp-ram1446-closed), assignee-updated (Dalal deactivate), export-requested ×2.

## Behavior (deterministic rules)

- `createCampaign`: moment whose wind-down end < fixedClock → **VALIDATION** "moment already past its window" with next same-kind moment id in details (CP-1 edge a); instantiates items from template with due dates = anchor + offset; 4-interaction quick-start path identical (national-day template default).
- `getReadiness` / `daysUntilAnchor`: computed against fixedClock; attention threshold = 7 days (open items due ≤7d → atRisk); phase from anchor offsets; `cmp-ram-nights` at fixedClock sits in build-up T-8 with one overdue item — the intervention fixture.
- `updateChecklistItem`: blocked without reason → VALIDATION (field-listed); stale revision → CONFLICT with both payloads; done sets completedAt = fixedClock (lateness recorded when dueDate < completedAt).
- `removeChecklistItem`: returns undoWindowSeconds: 7; re-put within the window restores the row with its history.
- `bulkUpdateChecklistItems`: already-done items receiving status not_started are skipped with reason "done items do not reopen in bulk" (honest partial policy — reopen is explicit per item); assignee change on na items skipped "na items carry no owner".
- `closeCampaign`: open critical items + waiveOpenCriticalItems false → VALIDATION with details.openCriticalItems ids; true → closureNote created with waivedCriticalItems recorded, campaign status closed, activity `campaign-closed`.
- `saveChecklistTemplate`: stale baseVersion → CONFLICT; new version appended; live campaigns untouched (snapshot honesty).
- `exportReadinessReport`/`exportTaskHandoff`: idempotencyKey replay returns the same job; empty campaignIds → VALIDATION; jobs pace deterministically (150ms per campaign, capped — indeterminate-with-milestones never fake-percentage); artifacts expire 28 days from creation; expired `getArtifact` → NOT_FOUND with renewable flag; `renewArtifact` extends 7 days once.
- `getUsage`: exportsUsed 2 / exportsLimit 20, resetAt 2026-03-01 — warn-at-80% fixture reachable via config.
- **Failure injection** (MockConfig): `{ latencyMs, errorRate, errorCode, failMethodOnce }` — per-method error injection for all 30 operations; fixed correlationIds `scb-corr-0001`…; injected NETWORK failures leave writes queued (P20 reconciliation fixture).
- **Calendar conversion**: Hijri labels for fixed Gregorian ranges are pre-computed lookup tables per Umm al-Qura presentation (disclosed string included in every CalendarDay); drift-aware moments carry the disclosure note verbatim; no runtime computation beyond table lookup — deterministic by construction.

## Test-support

`reset()` (restore seeds), `snapshot()` / `replay()` (state capture for deterministic replays), `setFixedClock(iso)` (countdown fixture control — e.g., jump to T-1 to test attention/overdue threshold announcements without waiting). No randomness, no network, no wall-clock reads anywhere.
