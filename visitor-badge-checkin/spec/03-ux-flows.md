# 03 — UX Flows: visitor-badge-checkin

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation — no orphans, no phantoms. `VisitorBadgeAdapterV1` (07b) is the single contract surface behind every step.

## CP-1 — Kiosk check-in: arrival → host notified → badge (the value proof, visitor-facing)

1. **Kiosk wakes** from idle welcome loop (language toggle ar/en front and center, workspace name, courtesy greeting per kiosk config). `getKioskConfig`
2. **Pre-registered path**: visitor types the six-character check-in code (or scans the invitation's code with the tablet camera — same lookup); the kiosk shows the pre-filled record — name rendered at its own direction, host, purpose, window — and asks only for confirmation (P11 redundant-entry elimination: known values are never retyped). `getVisitByCheckInCode`
3. **Walk-in path**: three fields — name (bidi-isolated input, `dir="auto"`), company, host (searchable picker over the host list with Arabic normalization: alef/hamza variants, taa marbuta/heh, yaa forms per rtl-rules §4). `listHosts`
4. **Returning-visitor assist**: after the name is typed, a normalized match against prior visits offers "we met you on 12 Oct — same details?" (normalize-disclosed; confirm-or-correct, never silent prefill beyond the confirmation step). `lookupReturningVisitor`
5. **Check-in commits** (idempotency key: kiosk session + visit code; a double-tap never double-checks-in). The visit transitions invited → checked-in; the **host-notification event is recorded** on the visit timeline (channel, target member, timestamp) and delivered per the notification ladder — in-app host surface first, abstract channel when bound. `checkInVisitor`
6. **Badge resolves from the spec**: the template applicable to this visitor type renders — name in the visitor's own script, type band, host, date, validity, check-out code — shown on-screen as a pass (ready state), with "badge printed" pending desk/kiosk confirmation. `issueBadge` (marks issued when the printed pass or on-screen pass is delivered; kiosk auto-issues on-screen passes, print confirmations are explicit)

**Edges**: code not found (typed vs scanned — VALIDATION with "check the code on your invitation" and the walk-in path one tap away); code valid but window not yet open (early arrival — allowed within the 30-minute grace, stated plainly); window elapsed (honest no-show state with "the host was not expecting you now — reception will help"); host no longer active (PERMISSION-shaped edge → falls to reception pick-another-host); returning-visitor match is a candidate list when the name alone matches several people (explicit confirm each time); visitor declines the phone field (optional, reason stated at the field — CP-1.4 runs fine without it).
**Failures**: kiosk offline (P20 banner; check-ins queue locally with per-item state and reconcile — the lobby must keep working); notification channel unbound (the event still records; the desk's arrival board is the fallback surface — LOOP-5 manual path); double-submit (idempotent replay returns the same visit state); NETWORK mid-commit (typed data preserved locally, reconciled by code on retry).
**Recovery**: nothing is lost on failure — the invitation record persists, walk-in forms persist locally, and the state machine is resumable by code.

## CP-2 — Pre-registration: invitation composition → send (the host's path)

1. Khalid opens the composer from the host surface (thin mode, 360px-friendly) or Muna from the desk: visitor name (bidi-isolated, both scripts welcome), optional phone, company, purpose (workspace's purpose list), visitor type (drives the badge band), host (himself by default), and a visit window (start/end with 30-minute default duration). `createVisitInvitation`
2. The invitation record lands with its **deterministic check-in code** (07c computation) and the invitation status invited; the visitor-facing link (abstract invite channel when bound, or the code shown for copy/relay by any means — the manual path) is displayed in the confirmation. `getVisit`
3. Corrections before arrival: reschedule the window, edit details, reassign the host — each edit is versioned on the visit record. `updateVisit`
4. Cancellation: host or desk cancels before arrival; the record states cancelled with actor and reason — never deleted (audit honesty). `cancelVisit`
5. A host not yet in the list is added inline from the picker (bilingual name, department, notification preference). `addHost` · `listHosts`

**Edges**: duplicate invitation for the same visitor+window (CONFLICT-shaped warning with both records shown — the desk adjudicates, no silent merge); window in the past (VALIDATION naming the field); invitation created while the visitor is already in the building (VALIDATION: an open visit exists); invitation for a deactivated host (picker filters active hosts; reassignment offered).
**Failures**: stale baseVersion on edit → CONFLICT with both payloads; invite channel unbound → code + link displayed for copy (LOOP-5); quota on outbound invites never blocks record creation (records are free; only channel sends meter — `getUsage`).
**Recovery**: invitations are re-editable and re-cancellable until check-in; after check-in the record is the visit (append-only events).

## CP-3 — Desk arrival handling: today board → badge issue/correction → check-out (the daily loop)

1. Muna's day starts on the **today board**: expected next (window-start ascending), in-building now (with duration), recent arrivals, and the no-show zone (derived, named values). `getFrontDeskBoard`
2. An arrival lands: the board moves the visit to arrived, the host-notification event shows as delivered (or fallback-flagged), and the badge state reads ready. `getVisit`
3. Badge handling: confirm print issued at the desk, show the on-screen pass, or — the correction path — preview a corrected badge (fix the visitor name typo), void the old one with a reason, and issue the replacement; the correction chain (badge → voided-by → replacement) is visible on the visit timeline. `previewBadge` · `voidBadge` · `issueBadge` · `getBadge`
4. Check-out: the visitor taps the badge's code at the kiosk, or the desk checks them out; visit → checked-out, badge → voided with the checkout reason, in-building list updates. `checkOutVisitor`
5. Filters and saved views over all visits (today/this week/host/state). `listVisits`

**Edges**: visitor leaves without checking out (end-of-day sweep is a declared, visible job — the in-building list never silently self-clears); badge printer absent (on-screen pass path is first-class, print is an option — 08 degradation map); two visitors with identical names in-building simultaneously (badge carries company + host; the record disambiguates); no-show zone at window end + 15 minutes (derived at read, never an automatic cancellation).
**Failures**: void without a reason (VALIDATION — the chain needs its why); issuing a badge for a checked-out visit (VALIDATION: re-check-in first or a new visit); stale template version between preview and issue (CONFLICT with both — re-preview).
**Recovery**: every badge action is reversible by the void/replace chain; visit state never regresses (a checked-in visit cannot become invited — corrections are new events, not edits of history).

## CP-4 — Visitor log, in-building list, retention, and export (the record's surface)

1. Salma opens the log: all visits in range with state, host, times, badge lineage columns; filters by state/host/purpose; the **in-building list** is a computed view of checked-in visits at request time. `listVisits`
2. Export the day/month or the in-building list: daily log, in-building (fire) list, or full archive — Jobs with expiry + regeneration per async-contract. `exportVisitorLog`
3. Artifact delivery: download/copy is the primary path (LOOP-5); the abstract delivery channel is optional. `getArtifact` · `listJobs`
4. Retention policy: workspace-level window (default 12 months; configurable), applied by the declared retention sweep — archived visits leave the live log, stay exportable from the archive, and the policy statement is visible on the log surface. `getWorkspaceSettings` · `saveWorkspaceSettings`
5. Session/role checks on entry (admin vs receptionist vs host vs viewer). `getSession`

**Edges**: filtered-empty declares itself (P01); archived-range queries point at the archive export rather than pretending empty; the in-building list at 400% zoom on a phone (host mode) collapses to cards; >200 log rows virtualize (P19).
**Failures**: NETWORK mid-list (banner + retry, P20); export failure mid-format (partial policy: per-format retry per async-contract §4); artifact expired (NOT_FOUND + regenerate path).
**Recovery**: exports regenerate from log state; the log itself never loses records to an export failure.

## CP-5 — Badge studio & kiosk setup (the admin's configuration path)

1. Muna opens the badge studio: the workspace's templates (seeded with one stock template); create/duplicate → the spec editor. `listBadgeTemplates` · `getBadgeTemplate`
2. Spec editing: field toggles (visitor name — always on; host; company; date; validity; check-out code), visitor-type band mapping (guest/vendor/contractor/interview/VIP with the 05 palette locks), layout direction (RTL-first default, LTR variant for Latin-visitor badges), stock size (adhesive-standard / card). `saveBadgeTemplate` (versioned; CONFLICT on stale baseVersion)
3. **Deterministic validation**: required-field sanity, band-contrast contract check (deep variants on badge stock), name-field length budget vs stock size, code presence. `validateBadgeTemplate`
4. Live preview with the seeded bilingual sample visitors (worst-case long Arabic name, Latin-name-in-RTL fixture), per direction; preview is text-first and screen-reader equal. `previewBadge`
5. Kiosk configuration: default language (ar), field requirements (phone optional + reason text), purposes list, welcome copy, idle-loop behavior. `getKioskConfig` · `saveKioskConfig`
6. Activation: a template version is activated for visitor types; badges resolve from the active version at check-in; already-issued badges keep their rendered spec (version pinning — 07a obligation). `saveBadgeTemplate` (status change on version)

**Edges**: deactivating the only template for a visitor type (VALIDATION — every type needs an active template); previewing with a template whose band mapping is incomplete (validation gates preview); direction variants must both pass validation before activation (bilingual obligation).
**Failures**: stale version on save (CONFLICT, both kept); kiosk config referencing a deactivated template (VALIDATION naming it).
**Recovery**: template versions are restorable; the stock template can always be re-cloned — the workspace can never strand itself without an active spec.

## Non-happy paths

- **No notification channel bound (LOOP-5)**: host notification records as an event with channel "in-app"; the host surface and the desk arrival board are the delivery. The loop completes; only outbound push/email/SMS-style delivery is absent.
- **No invite channel bound**: invitations display their code and link for copy/relay through any means the office already uses (chat, phone call). Pre-registration works fully.
- **No badge printer bound**: on-screen passes are the default issuance; print artifacts download for standard adhesive/card stock targets (08) — the badge spec still governs both.
- **First-run**: the desk offers the seeded sample day (four visits: a pre-registered expectation, a walk-in in the building with a badge-correction chain, a completed walk-in, and a window-missed no-show — plus the returning-visitor kiosk fixture) so the board, the kiosk, and the badge spec are experienceable before any real guest arrives (P22 value checklist — value milestones, not tours).
- **Offline kiosk**: local queue with per-item state; reconciliation by code on reconnect (async-contract §5); the desk stays read-capable (P20).
- **Unstaffed lobby**: the kiosk is the whole front desk — self-serve check-in, on-screen badge, host notified through their channel; the desk surfaces are simply not watched (01 evidence [5]).

## Failure → error mapping

VALIDATION (bad code format, expired-window arrival, void-without-reason, template sanity, kiosk config reference, past-window invitation, open-visit duplication) · NOT_FOUND (stale visit/badge/artifact links, expired artifacts) · PERMISSION (role scoping — hosts cannot edit others' invitations, viewers cannot issue badges; inactive-host edges) · CONFLICT (concurrent invitation/template edits, stale badge render at issue) · RATE_LIMIT (outbound notification volume, export volume) · NETWORK (kiosk commit, list fetches, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-4.5, entry (role/locale on every surface) | `previewBadge` | CP-3.3, CP-5.4 |
| `getFrontDeskBoard` | CP-1.5 (desk mirror), CP-3.1 | `issueBadge` | CP-1.6, CP-3.3 |
| `listVisits` | CP-3.5, CP-4.1 | `voidBadge` | CP-3.3 |
| `getVisit` | CP-2.2, CP-3.2, CP-4 detail | `getBadge` | CP-3.3, CP-3.4 (lineage) |
| `createVisitInvitation` | CP-2.1 | `getBadgeArtifact` | CP-1.6/CP-3.3 (print-ready file) |
| `updateVisit` | CP-2.3 | `listHosts` | CP-1.3, CP-2.1/5 |
| `cancelVisit` | CP-2.4 | `addHost` | CP-2.5 |
| `getVisitByCheckInCode` | CP-1.2 | `updateHost` | CP-2.5 (notify prefs, baseVersion) |
| `lookupReturningVisitor` | CP-1.4 | `getKioskConfig` | CP-1.1, CP-5.5 |
| `checkInVisitor` | CP-1.5 | `saveKioskConfig` | CP-5.5 |
| `checkOutVisitor` | CP-3.4 | `getWorkspaceSettings` | CP-4.4, CP-5 entry |
| `listBadgeTemplates` | CP-5.1 | `saveWorkspaceSettings` | CP-4.4 |
| `getBadgeTemplate` | CP-5.1/2 | `exportVisitorLog` | CP-4.2 |
| `saveBadgeTemplate` | CP-5.2/6 | `getArtifact` | CP-4.3 |
| `validateBadgeTemplate` | CP-5.3 | `listJobs` | CP-4.3, CP-3 sweep visibility |
| `getUsage` | CP-2 (pre-send channel meter), CP-4.2 | | |

31 operations, 0 orphans (Critic-verified against 07b; scripted check).
