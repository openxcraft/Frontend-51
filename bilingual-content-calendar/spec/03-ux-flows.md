# 03 — UX Flows: bilingual-content-calendar

SME-C pass · Paths, edges, failures, recovery. Each path maps 1:1 to adapter operations (07b).

## CP-1 — First-run → season grid in one session (value proof)
1. Workspace creation (name, channels list, calendar method declaration: Umm al-Qura default with disclosure, per _index Q-5).
2. Pick planning horizon (listHorizons on the S1 home; createHorizon when none exists yet — month/season/custom); grid renders with dual-calendar header (Hijri + Gregorian, one primary with cross-reference on hover/focus — P24), cells loaded by slot query (listSlots, S2).
3. Moments library panel (listMomentLibrary, S4): add Ramadan/Eid/White Friday/national days to the horizon (placeMoment); each moment expands into suggested timing patterns (iftar/suhoor windows for Ramadan slots).
4. First slot creation (createSlot): channel + date/time + title; variant pairing UI creates the ar/en pair automatically (P23).
5. Autosave persists (P10); onboarding checklist (P22) marks "first season planned".

**Edges**: no moments selected (grid still works; moments panel offers "suggest for this horizon"); workspace locale en-primary (grid direction LTR, Arabic variants still first-class); Ramadan mode toggled off mid-plan (timing patterns collapse to standard slots with a confirm naming what changes).
**Failures**: calendar method mismatch on imported plan (typed warning naming both methods + resolution choice); moment date collision with existing slot (conflict surface, both shown).
**Recovery**: plan is continuously autosaved; undo window on structural changes (slot move/delete) per P03.

## CP-2 — Variant parity loop (the daily loop)
1. Slot detail opens as a drawer over the grid (getSlot, S3): two variant panes (ar/en) with per-variant status (empty/briefed/drafted/approved); slot fields (title, schedule, channel) edit from the same drawer (updateSlot — base-state conflict guard, 07b rule 1).
2. Assign variant owner; status changes are instant + undoable (P03) — variant writes go through setVariant.
3. Parity indicator on the slot chip (both-ready / one-missing / diverged) — visible in grid without opening; the grid is also where slots reschedule (moveSlot, with the CP-1 undo window).
4. Fill a variant: write brief or paste final copy (setVariant); mark approved (setVariant → approved).

**Edges**: locale-optional slot (single-variant by design — e.g., an Arabic-only community post: explicit "single-locale slot" type, exempt from parity warnings but labeled); variant pasted with content longer than channel norms (soft length hint, never blocks); variant owner removed from workspace (reassignment path).
**Failures**: concurrent edit of same variant (ConflictError → both versions, choice required); stale grid after another planner moved slots (reconciliation refresh with change highlight, never silent).
**Recovery**: slot history (activity log P17) restores any prior state of a variant.

## CP-3 — Season mode planning (Ramadan)
1. Toggle season mode for a horizon (updateSeasonConfig — quiet hours + city, S5 console): grid reshapes — day segments reflect iftar/suhoor windows; quiet-hours convention applied as planning guidance (visual + text, never a hard block).
2. Moments panel populates season-specific moment suggestions with countdown links (P24).
3. Bulk-apply a timing pattern across a week (applyPattern Job — P07 bulk bar with count).
4. Review with Reem: season review mode lists timing conflicts + parity gaps as an actionable list (getReviewSummary, S6).

**Edges**: iftar timing varies by city (pattern offers city selector with method disclosure); national day overlaps Ramadan (both moments coexist; collision guidance surfaces); quiet-hours violated intentionally (explicit override with reason, recorded in activity log).
**Failures**: pattern application exceeds channel daily limits (per-channel validation with clear counts); bulk operation partially fails (per-slot results, retry failed-only per async-contract §4).
**Recovery**: bulk actions are jobs (P12) — cancellable and per-item retriable; the jobs center (listJobs, S9) is the console for pattern-apply and export jobs.

## CP-4 — Review & export handoff (the boundary of the product)
1. Send horizon to review (status in-review); Reem reviews on desktop or mobile review layout (S6/S10 — the actionable list is the getReviewSummary surface).
2. Comments anchor to slots/variants (threaded, resolvable — addComment).
3. Approve horizon (approveHorizon; status approved, approval recorded).
4. Export (exportHorizon Job): per-destination-neutral format (structured file: slots, variants, moments, times in both calendars); watermark optional; artifact with expiry per async-contract §2, delivered via getArtifact.

**Edges**: reviewer requests changes on a single slot (slot returns to draft, horizon stays in-review); export includes single-locale slots (labeled as such in the file); export of a partially-approved horizon (explicit warning, allowed with flags).
**Failures**: export job failure (typed error, retry); artifact expired (renew action regenerates from current plan).
**Recovery**: export is regenerable at any time from plan state — the artifact is a projection, never the source.

## Non-happy paths
- **Zero moments, zero channels** (fresh workspace): grid guides to add at least one channel; planning remains possible on "unspecified" channel slots.
- **Offline**: banner P20; slot edits queue; grid reads work fully.
- **Hijri/Gregorian ambiguity dispute**: method is workspace-declared and disclosed on every dual date — the product never arbitrates theology; it displays method provenance.

## Failure→error mapping
ValidationError (slot params/channel limits) · NotFoundError (slot deleted elsewhere) · PermissionError (reviewer lacks rights) · ConflictError (concurrent variant/slot edits) · RateLimitError (export quota) · NetworkError (sync) · UnknownError (correlationId).

## Operation coverage table (every 07b operation; no orphans)

| Op | Flow step (above) that exercises it |
|---|---|
| getSession | App entry · S1 first paint — the auth-agnostic session surface (role owner/planner/reviewer, locale ar/en) read once on entry; not forced into a CP step |
| listHorizons | CP-1.2 (S1 horizons list) |
| createHorizon | CP-1.2 (first run: month/season/custom span) |
| updateSeasonConfig | CP-3.1 (season toggle, quiet hours, city — S5 console) |
| listSlots | CP-1.2 (grid cells, S2 range+filter query) |
| getSlot | CP-2.1 (slot detail drawer, S3) |
| createSlot | CP-1.4 |
| updateSlot | CP-2.1 (title/schedule/channel edits; 07b rule 1 conflict guard) |
| moveSlot | CP-2.3 (grid reschedule; CP-1 recovery undo window) |
| setVariant | CP-2.2 (owner, status), CP-2.4 (content fill, approve) |
| listMomentLibrary | CP-1.3 (moments panel, S4) |
| placeMoment | CP-1.3 (add moment to the horizon) |
| applyPattern | CP-3.3 (bulk pattern Job; per-item retry per CP-3 recovery) |
| getReviewSummary | CP-3.4 (season review list), CP-4.1 (S6/S10 review surface) |
| addComment | CP-4.2 |
| approveHorizon | CP-4.3 |
| exportHorizon | CP-4.4 (Job, S7 export) |
| getArtifact | CP-4.4 (artifact with expiry; renew per CP-4 failures) |
| listJobs | CP-3 recovery (S9 jobs center) |

19 operations, 0 orphans — every 07b operation appears above exactly once (scripted coverage check verified).
