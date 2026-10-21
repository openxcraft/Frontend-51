# 03 — UX Flows: seasonal-campaign-board

SME-C pass. Five critical flows; every step numbered; edges, failures, and recovery inline. The flow→operation coverage table at the end lists every 07b operation — no orphans.

## CP-1 — Moment selection → campaign board setup with countdown (the value-proof flow)

1. **Open the moment library** (S1): moments grouped by season ("2026 retail year", "2027 retail year"), each MomentCard showing name (ar/en), countdown-to-start, kind chip (religious-season / religious-festival / commerce-event / national-day / school-term), and drift badge ("Hijri-linked — date may shift ±1 day") for moon-sighting-dependent moments.
2. **Filter/browse**: filter chips by kind and by within-days ("next 90 days"); text search with Arabic normalization (rtl-rules §4). Empty-filter result offers filter reset (P01 filtered-empty, 11).
3. **Open moment detail** (S2): dual-calendar dates (Gregorian primary label + Hijri label with method disclosure "Umm al-Qura — presentation only, subject to official announcement"), phase map (التمهيد build-up / الذروة peak / الانحسار wind-down with day offsets), and the moment's checklist template preview — every item with role, criticality, and T-minus due offset visible *before* anything is created.
4. **Create campaign**: "Start campaign from this moment" → P09 progressive form: name (required, bilingual-friendly), template (default = moment's; override picker), go-live override (optional — defaults to moment start; explanation of what the override moves: the countdown anchor, not the moment).
5. **Instantiation**: checklist items are created from the template synchronously (small, deterministic); each item's due date = moment date + offset (or go-live override + offset). Board (S3) opens with the campaign lane, countdown tile, and readiness meter at 0%.
6. **Anchor check**: the dual-calendar strip (S3) highlights the moment window; the countdown tile counts down to the anchor; the phase strip shows the current phase relative to the fixed server clock (07b `getSession.serverTime` — countdowns never trust client clocks).

**Edges**: (a) moment already past its wind-down → create refused with the honest reason (11 VALIDATION row) and the library offers next season's same-kind moment; (b) go-live override earlier than build-up start → warning, allowed (short-fuse campaign — CP-4 makes this a feature); (c) template override for a different moment kind → confirmation naming the mismatch; (d) drift moment + campaign created before official date announcement → countdown shows "expected" treatment with drift badge until a date confirmation is recorded (updateCampaign with confirmedDate).
**Failures**: VALIDATION (empty name, past moment), CONFLICT (stale campaign revision if the form sat open), NETWORK (offline banner P20 — creation queues), RATE_LIMIT (none on creation; board reads are never metered), PERMISSION (viewer role cannot create — role surfaced from session).
**Recovery**: form input is never lost on failure; retry keeps values (P11); a newly created campaign can be returned to draft immediately via updateCampaign with undo (P03).

## CP-2 — Checklist execution & assignment (the daily loop)

1. **Enter campaign detail** (S4) from the board or ⌘K palette (list surfaces ≥3 → P05 applies): checklist grouped by template section/phase; every row shows title, owner (المسؤول), status (not_started/in_progress/blocked/done/na), due date with countdown-linkage ("T-14 · Tue 10 Feb" / overdue state), criticality marker.
2. **Change status inline** (P06): space/enter toggles not_started→in_progress→done; escape restores; done items settle with the energetic success treatment (05) and the readiness meter re-computes (17).
3. **Assign / reassign**: assignee menu on the row; unassigned items are visually flagged and listed in a "needs owner" cluster at top of the checklist; first-run edge — no assignees exist yet → inline "add teammate" (19) without leaving the flow.
4. **Blocked with reason**: marking blocked requires a reason (short text) — the block reason renders on the row and in the intervention view (CP-3); it is the accountability record that replaces approvals escalation (LOOP-10).
5. **Add a custom item** beyond the template: title + optional owner + optional T-minus offset; criticality optional; custom items are visibly marked "added beyond template" (honest, like the sibling's edited-beyond-recipe flag).
6. **Remove an item**: P04 level 1 — removal is reversible via the 7-second undo affordance; the row ghosts then leaves; activity log records actor/action/target.
7. **Bulk operations** (P07): range-select rows (keyboard equivalent) → floating action bar: "Mark 5 done", "Assign 5 to Fahad", "Set 5 to na". Bulk applies per-item with a partial-results summary (16: updated/skipped with reasons — e.g. items already done are skipped as no-ops, reported honestly).
8. **Stale-edit protection**: every mutation carries baseRevision; a colleague's concurrent edit → CONFLICT surfacing both versions side by side; choose mine/theirs (P10).

**Edges**: (a) overdue item transitioned to done → completedAt recorded, overdue count drops, activity log keeps the lateness fact; (b) item due date manually overridden → override marker + reason in tooltip, template offset preserved for next season; (c) assignee deactivated mid-campaign → rows show "المسؤول السابق: دلال" state with reassign action (20, 02 Dalal edge); (d) checklist >200 items (template override stacking) → virtualized list, focus preserved (P19).
**Failures**: VALIDATION (empty title, blocked-without-reason), NOT_FOUND (campaign/item deleted elsewhere), PERMISSION (viewers read-only — surfaces disable, not hide), CONFLICT (stale revisions), NETWORK (queued writes with per-item state, P20), UNKNOWN (correlation-quoted retry).
**Recovery**: checklist state is adapter-authoritative; the UI reconciles on reconnect rather than guessing (async-contract §5).

## CP-3 — Readiness monitoring & intervention (the "are we ready?" flow)

1. **Board scan** (S3): campaign lanes with countdown tiles (T-days, phase, urgency state: on-track/attention/overdue — states are color+icon+text, never color-only), readiness meters (percent + counts: critical open, at-risk, overdue, blocked), and the dual-calendar strip with moment windows shaded (5).
2. **Drill into the weakest campaign**: readiness meter click → intervention view (S4 filtered to at-risk + overdue + blocked first) — the answer to "what exactly is slipping".
3. **Intervene**: reassign (13), bulk-resolve (16), unblock after reading the block reason, or negotiate the due date (override with reason).
4. **Report out**: select campaigns → export readiness report (24) → Job (async-contract: queued → running → succeeded with artifact link + expiry); usage meter shows export count and window reset before running (29, P14 — warn at 80%).
5. **Hand off to executors**: export task handoff for a campaign scoped to assignees or a field cluster (25) — the artifact is a forwardable list with owners, dates, countdown state; Yousef's store-floor path (02).
6. **Jobs surface** (S7 consolidated T3 activity surface): job rows with state, cancel while queued/running, retry on failure, artifact retrieval (27) and renewal after expiry (28) with the retention window stated at creation.

**Edges**: (a) 50+ campaigns → lanes virtualize, countdown tiles update in batched cadence (10), focus never moves due to scroll (P19); (b) moment in wind-down with open critical items → campaign flagged "closing with gaps" (feeds CP-5 waiver discipline); (c) artifact expired → NOT_FOUND with renew action and re-export path (11); (d) export quota exhausted → RATE_LIMIT ladder: in-app views never blocked, only exports pause until window reset (12 Q-6; the product stays useful — credential-contract §6 posture).
**Failures**: RATE_LIMIT (export quota), NETWORK (job state reconciles), UNKNOWN (retry with correlation id), NOT_FOUND (expired artifact), VALIDATION (empty selection export).
**Recovery**: all exports re-runnable from current state; readiness computation is derived and never itself a stored artifact that can go stale.

## CP-4 — National-day quick-start (the 60-second path)

1. **Trigger**: library card for a near-term national day ("Saudi National Day — in 33 days") carries a direct "Quick-start campaign" action; the 5-item national-day template is the fastest path to value (02 Reem's objection — maintenance fatigue).
2. **One-screen creation**: name + owner + create; template pre-selected; no optional fields shown (P09 — ask only what enables the next step).
3. **Land on the checklist** with 5 items, owners unassigned (needs-owner cluster), countdown tile live.
4. **Assign owners and go** — the whole flow is 4 interactions; the moment's guidance card (cultural-tone notes from the moment record, e.g., national-day respect guidance surfaced from the library data — content, not AI) renders alongside.

**Edges**: (a) quick-starting *after* the moment passed → refused with next-year same-kind moment offered (6/3 same path as CP-1 edge a); (b) very-short-fuse (moment in build-up already, e.g., 10 days out) → template offsets compress? No — offsets are kept and overdue states surface immediately and honestly; the board never silently rewrites the plan, it shows the truth (overdue cluster + intervention).
**Failures**: same class set as CP-1.
**Recovery**: identical to CP-1.

## CP-5 — Moment closure & retro (the season-learning loop)

1. **Wind-down signal**: when the moment passes wind-down end, campaign lanes enter "closure pending" state with a calm prompt (not an alarm) — "Ramadan 1447 closed its window. Close the campaign and keep what you learned."
2. **Open closure** (S5): closure note form — what shipped (auto-summarized deterministically from checklist: X of Y done, critical open list, overdue history counts — computed, not generated), what slipped (pre-filled from open/overdue items, editable), lessons (free text, bilingual-friendly).
3. **Waiver discipline**: closing with open critical items requires an explicit confirmation naming them ("Close with 2 critical items open — they will be recorded as slipped") — this is LOOP-10's no-escalation stance: the choice is the lead's, recorded, never routed upward.
4. **Carry to template**: "Apply lessons to next season's template" → template editor (S6) opens with the moment-kind template; add/edit items; save bumps the template version (23, CONFLICT on stale base version; versions restorable).
5. **Closed state**: campaign moves to the closed lane with the closure note readable on the card; activity log records actor/close/note; next season's moment card links "your last closure note" — the loop's visible continuity.

**Edges**: (a) closure edited after the fact (typo, added lesson) → updateClosureNote with revision (11); (b) template edited concurrently by another planner → CONFLICT, both kept, choose (P10); (c) campaign closed by mistake → reopen is *not* offered as a silent undo — reopening is an explicit owner action via updateCampaign with the reopening recorded in the activity log (honesty over convenience).
**Failures**: VALIDATION (closure requires whatShipped and lessons non-empty; empty lessons allowed with explicit skip), CONFLICT (stale note/template revisions), PERMISSION (only owner/planner closes).
**Recovery**: closure notes and template versions are append-only records — recoverable by version, never destructive.

## Non-happy paths

- **First-run (no campaigns)**: the board shows the moment library as its empty state — "pick a moment" is the honest first action; a sample campaign (from the mock seed's national-day moment) is offered to walk the loop before committing real work (P01 first-run + P22 value checklist: create from moment → assign 3 items → close one).
- **Offline**: board and checklists read from last state; writes queue per-item (P20); countdown continues from the last known serverTime with an explicit staleness badge ("countdown stale — reconnecting").
- **Calendar method doubt** (settings): the dual-calendar disclosure is re-readable in settings; the active method, its limits, and the "presentation only, subject to official announcement" statement are one click from any date (Q-5 portfolio default).
- **Moment date officially shifts** (announced ±1 day drift resolves): updateCampaign records the confirmed date on affected campaigns; due dates recompute; a calm migration note lists what moved ("3 items shifted by 1 day") — never silent.

## Failure→error mapping (portfolio 7 classes)

ValidationError (form input, past-moment creation, blocked-without-reason, empty export selection, closure discipline) · NotFoundError (unknown ids, expired artifacts) · PermissionError (viewer-role writes, cross-workspace) · ConflictError (stale campaign/item/note/template revisions) · RateLimitError (export quota window) · NetworkError (transport/offline) · UnknownError (unclassified, correlation-quoted).

## Flow → operation coverage table (every 07b operation; 0 orphans)

| # | 07b operation | Flows that exercise it |
|---|---------------|------------------------|
| 1 | `getSession` | CP-1…CP-5 (boot: role, locale, serverTime anchor) |
| 2 | `listSeasons` | CP-1.1 |
| 3 | `listMoments` | CP-1.1–2, CP-4.1 (near-term trigger) |
| 4 | `getMoment` | CP-1.3, CP-4.2 (template preview + guidance) |
| 5 | `getCalendarFrame` | CP-1.6, CP-3.1 (dual-calendar strip + moment shading) |
| 6 | `listCampaigns` | CP-3.1, CP-4 (post-create board land) |
| 7 | `getCampaign` | CP-2.1, CP-3.2, CP-5.2 |
| 8 | `createCampaign` | CP-1.4–5, CP-4.2 |
| 9 | `updateCampaign` | CP-1 edges (confirm date/go-live), CP-3.3 (due negotiation), CP-5.3/edges (status, reopen, confirmedDate) |
| 10 | `closeCampaign` | CP-5.3–5 |
| 11 | `updateClosureNote` | CP-5 edge a |
| 12 | `listChecklistItems` | CP-2.1, CP-3.2 (intervention filters) |
| 13 | `updateChecklistItem` | CP-2.2–4, CP-3.3 |
| 14 | `addChecklistItem` | CP-2.5 |
| 15 | `removeChecklistItem` | CP-2.6 |
| 16 | `bulkUpdateChecklistItems` | CP-2.7, CP-3.3 |
| 17 | `getReadiness` | CP-2.2 (meter recompute), CP-3.1–2 |
| 18 | `listAssignees` | CP-2.3 |
| 19 | `createAssignee` | CP-2.3 first-run edge |
| 20 | `updateAssignee` | CP-2 edge c (deactivate/rename) |
| 21 | `listChecklistTemplates` | CP-1.4 (override picker), CP-5.4 |
| 22 | `getChecklistTemplate` | CP-1.3, CP-5.4 |
| 23 | `saveChecklistTemplate` | CP-5.4 |
| 24 | `exportReadinessReport` | CP-3.4 |
| 25 | `exportTaskHandoff` | CP-3.5 |
| 26 | `listJobs` | CP-3.6 |
| 27 | `getArtifact` | CP-3.6 |
| 28 | `renewArtifact` | CP-3 edge c |
| 29 | `getUsage` | CP-3.4 (quota before/after export) |
| 30 | `listActivity` | CP-2.6 (removal record), CP-3 (accountability), CP-5.5 |
