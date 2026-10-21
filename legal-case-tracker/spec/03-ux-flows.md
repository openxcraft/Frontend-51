# 03 — UX Flows: legal-case-tracker

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery; coverage table at the end traces **every one of the 32 `LegalCaseTrackerAdapterV1` operations** exactly once — zero orphans, zero phantoms (07b is authoritative for the operation set). Terminology locked per 02: matter القضية · hearing الجلسة · deadline الموعد النهائي · timeline التسلسل الزمني · document المستند · chain of custody سلسلة العهدة · outcome نتيجة الجلسة · closure إقفال القضية · deadline rule قاعدة المواعيد · hearing board لوحة الجلسات.

## CP-1 — New matter intake: client → matter → first hearing → rules fire (the week opens)

**Trigger**: the firm takes a new case (Abdullah or Layla; Faisal often does the typing). The docket home shows the intake action beside the board (04 S1).

1. Session context loads: member, workspace, role (owner / attorney / paralegal / viewer — the permission matrix of 07b rule 4 gates everything downstream), locale `ar` default with English a full citizen (05 direction model). `getSession`
2. The intake wizard first checks the client: normalized bilingual search over existing clients (alef/hamza, taa marbuta/heh, yaa/alif maqsura, tashkeel-stripped — rtl-rules §4; the normalization ruleset is disclosed beside the field). A match list prevents duplicate clients. `listClients`
3. New client: bilingual name (both languages required — VALIDATION names the empty side), optional contact, notes. The client drawer shows the client with its matters — one place to answer "what else do we run for them?" `createClient` · `getClient`
4. The matter itself: client (from step 2/3), bilingual title, court (bilingual — e.g. ar "المحكمة التجارية بالرياض" / en "Riyadh Commercial Court"), case number (Latin storage, physical order stable in both directions — rtl-rules §4), practice area, parties (bilingual names with roles), team assignment, and — optional at intake (P09 progressive disclosure) — the **first hearing** (date, location, judge). `createMatter`
5. The matter view opens: parties rail, counts (events, upcoming/overdue hearings, open deadlines, documents, unreturned originals), the closure-gate state, and the empty-but-seeded chronicle. `getMatter`
6. The rules fired: with `stockRulesOn` (workspace default), matter-opened rules generate their deadlines; when a first hearing was given, hearing-created rules fire on it — pre-hearing prep at −3 days (clamped by minLeadDays), client update at −1, the firm's own translation rule at −5 for commercial matters (07c rules table). The timeline list shows each generated deadline carrying its rule name and source trigger — the audit chain is visible on day one. `listTimelineEvents`

**Edges**: intake without a first hearing (fine — hearing-created rules fire later, on `createTimelineEvent` or on an outcome's next hearing; the matter's `nextHearing` column reads "—" and sorts accordingly); a first hearing 2 days out (prep deadline clamps to +1 day by minLeadDays — 07c rule 3, the clamp is *shown* on the deadline card, never silent); duplicate client search misses a variant spelling (normalization disclosed; user may still create — the dup risk is surfaced, not blocked); `matter-opened` rule inactive (rule-006 demonstrably does not fire — deactivation honesty, 07c).
**Failures**: empty `title.ar` or `title.en` → VALIDATION naming the field; case number already used in the workspace → VALIDATION with a link to the existing matter (data hygiene, not a wall); NETWORK on client search → the wizard proceeds offline-safe (P20) — client creation queues.
**Recovery**: matters are soft-organizational — stage patches and party edits re-version (`updateMatter`), nothing is lost; the timeline regenerates *future* deadlines only, completed/past ones are history (07a).

## CP-2 — The hearing lifecycle: board → prep → reschedule → outcome → the gavel settles (the daily loop)

**Trigger**: 8:30 morning open (Layla; Abdullah scans the same surface); or a courtroom-corridor moment mid-day.

1. **The docket home** (04 S1): the cross-matter hearing board — every hearing without a standing outcome within the horizon (default 30 days) **plus every overdue hearing regardless of horizon** (07c rule 4), zone-sorted (overdue → today → imminent → near → far), each row carrying matter title, case number, day-count, location/judge, and the nearest incomplete pre-hearing deadline. Beside it, the matters triage with the urgency-zone filter (matters whose next hearing is in-zone, matters with outcome-due hearings). The board is a derived read — recomputed at read, stable per clock tick. `listHearingBoard` · `listMatters`
2. Layla opens the imminent hearing (m-002: Labor Court, daysUntil 2, zone imminent): the event view — countdown (derived), location, judge, reschedule history, the generated deadlines hanging off it, linked documents. `getTimelineEvent`
3. The court moves the date: reschedule with a **required reason** (facts with history — 07a; VALIDATION without it). The RescheduleRecord appends, the event's date updates, and hearing-created rules re-evaluate for the NEW date forward-only (completed/past deadlines stay history). `updateTimelineEvent`
4. The prep deadline lands (m-s01's due-today fixture): completing writes `completedAt` + `completedByMemberId` — a fact with an actor. Completing an already-completed deadline → CONFLICT showing the completion record. `completeDeadlineEvent`
5. **The courtroom moment** — recording the outcome: kind (adjourned / verdict / ruling / dismissed / other), bilingual summary (both languages required), and for an adjournment the **next hearing date**. On submit: the outcome is written, `scheduledNextHearing` **creates the next hearing event at write time**, hearing-created rules fire on it, and the returned view carries the recomputed countdowns. The Gavel Settles (05 T2 signature): the hearing card's ring drains, the card settles into the bed as history, the outcome chip stamps, and the next hearing rises with its ring already running. A standing outcome already exists → CONFLICT naming it; corrections append via `correctionOfOutcomeId` and supersede — never edit history. A verdict outcome fires outcome-recorded rules (appeal window +30 — m-004's fixture). `recordHearingOutcome`
6. Between hearings the chronicle accumulates: notes, filings (outbound/inbound, optionally linked to a document — the plain link of LOOP-10's no-e-filing stance), custom events (client meeting, expert visit). `createTimelineEvent`
7. The honesty check: filter the timeline to zone `overdue` — a past hearing without an outcome surfaces red (m-003's hearing 1, daysUntil −9): the product's answer to "the hearing happened but nobody recorded what the court decided." `listTimelineEvents`

**Edges**: outcome with `scheduledNextHearing` on a *verdict* (allowed by the type; the UI guides adjourned-carries-it but never blocks legal reality); correction of a corrected outcome (chains append — outcome history newest-first in the view); reschedule to a date *before* today (VALIDATION — reschedules move forward in real practice; a data-entry error is fixed by another reschedule, and history keeps both); board filtered to one attorney (the `attorneyMemberId` filter — Abdullah checking Layla's week).
**Failures**: viewer-role attempt on any mutation → PERMISSION naming the seat's capability in capability language (Hind can never mutate); stale `baseVersion` on the reschedule edit → CONFLICT with both payloads (another seat moved it first); NETWORK mid-board → banner + retry, board state is derived and safe (P20).
**Recovery**: outcomes, reschedules, and completions are append-only facts; the timeline never rewrites itself; the board recomputes from state — nothing derived is ever lost.

## CP-3 — The document chain of custody: register → version → seal → check-out → present → check-in → verify (the paper trail)

**Trigger**: an original arrives from the client (Faisal's register); or a new draft document enters the matter.

1. The matter's documents view (04 S4): register with kind, original/copy flag, version count, chain length, last custody action, last activity; the unreturned-only filter is the closure-gate companion view. `listDocuments`
2. Register the document: bilingual title, kind (pleading / evidence / contract / power-of-attorney / correspondence / court-decision / other), `isOriginal` (originator: whose original this is), and the **first version** — label, declared content fingerprint, size, and an abstract storage reference (the adapter never names a storage provider — 07b rule 5). An idempotency key guards the double-submit (corridor-typing reality). The chain seeds `received` (originals, with the provenance note) then `registered`. `registerDocument`
3. A revision becomes a new version (append-only lineage — `seq = last + 1`): the corrected claim statement after the counter-memorandum lands, labeled "كما قُدمت / as filed". `addDocumentVersion`
4. The as-filed version is **sealed** — immutable, fingerprint-anchored (07a: sealed versions never change; new content requires a new version; the chain records version-added then sealed). Sealing an already-sealed version → CONFLICT showing the sealing entry. `sealDocumentVersion`
5. The original leaves custody: `checked-out` with location ("with counsel Layla") and note — the borrow requires its ledger line (Faisal's J4). `addCustodyEntry`
6. **In the courtroom**: `presented` — requires the hearing event link (VALIDATION without it — presentation without a hearing is a data hole, not a fact). The chain now says this document, this version, at this hearing. `addCustodyEntry`
7. Back at the firm: `checked-in`. (And at the matter's end, `returned` — the only entry that clears the unreturned-original gate check; `returned` on a non-original → VALIDATION. Only originals return.) `addCustodyEntry`
8. The challenge: **verify the chain** — recompute the per-entry fingerprint table; `intact: true` with the verified count, or `intact: false` with the first broken seq (failure injection proves detection — the mock mutates the table copy, never the chain itself, 07c rule 6). The verification lands in the activity log (P17) — the audit answer to "where was this document between September and November." `verifyChain`
9. The document view: versions lineage, the full chain rendered as the custody strip (umber marks on the timeline bed — 05), the last verification state. `getDocument`

**Edges**: a version added *after* a sealed version (a new lineage node — sealed nodes never mutate; the strip shows the seal mark mid-chain); an original that never returns (it simply keeps blocking closure until it does — the gate's honest answer); custody `annotated` entries for condition notes ("corners worn", "sealed envelope") — free-form facts, never edits; a filing event linking the document (CP-2.6) while the chain shows `checked-out` (the two views agree because both are state — where the document *is* and what it *was used for*).
**Failures**: idempotency replay (retried `registerDocument` returns the original DocumentView — no double registration); VALIDATION on `presented` without `linkedEventId`; VALIDATION on `returned` for a copy; PERMISSION on viewer mutations; NETWORK mid-chain-read → the chain renders what arrived, retry fills the rest (chain reads are page-ordered, seq-stable).
**Recovery**: the chain is append-only by construction — there is no edit path to recover from; corrections are new `annotated` entries; `verifyChain` is re-runnable at will and always reflects current state.

## CP-4 — Deadline rules: the engine's parameters (owner discipline)

**Trigger**: Abdullah tunes the firm's practice discipline — a new standing rule, a tuned offset, a retirement.

1. The rules console (04 S7): stock rules (seeded workspace defaults) vs firm-authored rules; active/inactive states; trigger kind, offset, lead, scope columns. `listDeadlineRules`
2. Author a firm rule: bilingual name ("تسليم ترجمة الدفوع / Defense translation delivery"), trigger `hearing-created`, offset −5, minLead 2, scope commercial — exactly the 07c rule-005 shape. Sanity is enforced at the contract: `offsetDays ≥ 0` with a `hearing-created` trigger → VALIDATION (prep rules are negative by definition); `minLeadDays < 0` → VALIDATION. `saveDeadlineRule`
3. Edit an existing rule: `baseVersion` → CONFLICT on stale (both payloads kept); a successful edit **regenerates future generated deadlines only** — completed and past deadlines are history and stay; the regeneration is surfaced in the result (never silent: "3 future deadlines will move" — the UI names them). `saveDeadlineRule`
4. Retire a rule: delete is P04 level-2 — the UI names the rule and its **open generated deadlines** count; the adapter requires `confirm.openGeneratedDeadlines` to match the live count (VALIDATION on drift). On delete, open generated deadlines remain pinned to the deleted rule id (audit honesty — 07c) and close only by completion; deactivation is the reversible alternative (rule-006's shape: stop generating, keep history). `deleteDeadlineRule`

**Edges**: owner-only surface (attorney/paralegal read rules in the matter context but cannot save — PERMISSION, capability-named); a rule scoped to a practice area the firm no longer runs (harmless — it fires for nothing; the console shows its last-fired date); stock rules edited by the owner (become firm-shaped: `stock: false` on save — the provenance stays honest).
**Failures**: VALIDATION sanity (above); CONFLICT on concurrent rule edits; RATE_LIMIT does not apply (rules are unmetered workspace assets — the metered surface is exports only, 07b).
**Recovery**: rules are versioned assets; every save/deactivate/delete lands in the activity log; generated deadlines carry `ruleId` + `sourceTriggerEventId` forever (07a audit chain).

## CP-5 — Closure, export, and the record (the file's end — and its defense)

**Trigger**: a matter reaches its end (verdict executed, dismissal confirmed); or the client/auditor asks for the record.

1. **The closure gate** (04 S8 / matter view): live gate state — every future hearing without an outcome, every outcome-due hearing, every open deadline, and (policy on) every unreturned original, each blocker with its bilingual label and a jump link. `closeMatter` with any blocker standing → VALIDATION whose `details` name every one; the `acknowledgeBlockers: false` literal makes bypass impossible at the type level (07b rule 2). m-001's first attempt names: unreturned originals ×2. `getMatter` (gate state)
2. Clearing blockers is real work, not clicking: record the missing outcome (CP-2.5), complete the open deadlines (CP-2.4), return the originals (CP-3.7's `returned` entry). The gate recounts live.
3. Closure succeeds: the immutable ClosureRecord is written — actor, timestamp, matter version, and the resolution ledger (outcomes recorded, deadlines completed, documents registered, originals returned). Then the archive: **export the matter package** — formats `matter-timeline` + `custody-ledger` + `deadline-report`; quota checked first (P14 — the export window shows before running); an idempotency key guards the double-submit; progress is determinate in package parts (async-contract §3 — an indeterminate bar claiming percentage is a contract violation). `closeMatter` · `getUsage` · `exportMatterPackage`
4. The artifact: retrieved with expiry window and `regenerable: true` — expired → NOT_FOUND with the regenerate path (regeneration is deterministic from matter state; the closed state is flagged honestly if activity followed closure). `getArtifact`
5. The jobs console (04 S9): export jobs filterable by state, link-to-context on every row, cancel/retry; the seeded failed-partial export (job-002: custody-ledger failed NETWORK after two formats delivered — per-format retry only the failed part, async-contract §4). `listJobs`
6. The activity log (04 S10): every consequential mutation with actor, action, target, detail, timestamp — filterable, keyboard-navigable, exportable (a11y-baseline §7 legal/audit obligation). ~45 seeded entries cover every action kind (07c). `listActivity`
7. Matter maintenance around closure: stage patch to `'closed'` through `updateMatter` → VALIDATION redirecting to the gate (the only path); party/team/practice-area edits re-version; **a mutation on a closed matter re-opens it** `stage: 'active'` with a pending-activity flag — the ClosureRecord stays untouched (07a). `updateMatter`
8. Client maintenance: contact/notes updates with `baseUpdatedAt` staleness → CONFLICT both payloads kept (Abdullah and Faisal editing the same client card). `updateClient`

**Edges**: closure with an inactive-rule's old generated deadline still open (it blocks — history is history; complete it or it stays); export of a matter closed 60 days ago with later activity (the package carries `closedMatterVersion` and flags the later activity — honesty at handoff); a re-opened matter's second closure (a second ClosureRecord — records append, never rewrite); RATE_LIMIT on export quota → the ladder copy names the reset time and the manual alternative (download what exists; regenerate later — the state never changes).
**Failures**: VALIDATION (gate, stage redirect); NOT_FOUND (expired artifact, stale links); PERMISSION (paralegal closing — attorney/owner only); CONFLICT (stale matter/client edits); RATE_LIMIT (export window); NETWORK (job polling, artifact delivery, list fetches); UNKNOWN (typed retry, correlationId).
**Recovery**: ClosureRecords and artifacts regenerate deterministically; the jobs console reconciles after reconnect (async-contract §5); the activity log is the recovery narrative itself.

## Non-happy paths

- **First-run, empty workspace**: the docket home teaches the value first (P22 checklist: create a client → open a matter → watch deadlines generate → record an outcome) and offers the sample matter m-s01 ("watch the gavel settle") — one imminent hearing, one due-today deadline, one unreturned original; clears in one action, never returns (11 matrix).
- **The outcome-due hole** (m-003): a red *overdue* hearing on the board with "ماذا قرّرت المحكمة؟ / What did the court decide?" — the product's honesty posture; the copy never blames (11).
- **Viewer arrival** (Hind): the client-side seat lands on her attached matters' timelines read-only — the board exists for her as dates and zones, nothing else; every mutation affordance is absent, not disabled-with-mystery (PERMISSION copy in capability language if API-reached, 11).
- **All capabilities unbound** (LOOP-5): documents register with declared fingerprints and abstract storage references (no storage provider required — the chain is the record, the bytes live wherever the firm keeps them); exports download directly; deadlines generate from rules alone; the full CP-1→CP-5 loop completes (00 DoD).
- **Offline** (P20): reads work; outcome recordings and custody entries queue with per-item state; the derived surfaces (board, zones, gate) recompute on reconnect — same state, same zones (determinism is offline-safe by construction).

## Failure → error mapping (7-token taxonomy, 07b)

VALIDATION (bilingual field rules, reschedule-without-reason, deadline-rule sanity, custody link requirements, closure-gate attempts, stage-to-closed bypass) · NOT_FOUND (stale matter/event/document/version/artifact links, expired artifacts) · PERMISSION (viewer-role mutations, owner-only rule management, paralegal closure attempts, workspace scoping) · CONFLICT (concurrent matter/event/rule/client edits, outcome already standing, sealing a sealed version, completing a completed deadline) · RATE_LIMIT (export packages) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation exactly once; 0 orphans, 0 phantoms)

| Op | Flows |
|---|---|
| `getSession` | CP-1.1 (role/locale context for every persona), CP-2.1 (viewer arrival, non-happy) |
| `listMatters` | CP-2.1 (docket-home matters triage, urgencyZone + hasOverdue filters), 04 S1 |
| `createMatter` | CP-1.4 (firstHearing optional, stockRulesOn) |
| `getMatter` | CP-1.5, CP-5.1 (live gate state) |
| `updateMatter` | CP-5.7 (stage redirect VALIDATION; party/team edits; closed-matter re-open) |
| `closeMatter` | CP-5.1 (refusal), CP-5.3 (success + ClosureRecord) |
| `listClients` | CP-1.2 (normalized bilingual dup-check), 04 S6 |
| `createClient` | CP-1.3 |
| `getClient` | CP-1.3 (client drawer with its matters), 04 S6 |
| `updateClient` | CP-5.8 |
| `listTimelineEvents` | CP-1.6 (generated deadlines on intake), CP-2.7 (zone=overdue honesty filter) |
| `createTimelineEvent` | CP-2.6 (notes, filings, custom events; hearing-created rules fire here) |
| `getTimelineEvent` | CP-2.2 |
| `updateTimelineEvent` | CP-2.3 (reschedule with reason; forward-only regeneration) |
| `recordHearingOutcome` | CP-2.5 (the gavel; scheduledNextHearing side-effect; correction grammar) |
| `completeDeadlineEvent` | CP-2.4, CP-5.2 (clearing gate blockers) |
| `listHearingBoard` | CP-2.1 (the daily docket), non-happy viewer arrival |
| `listDeadlineRules` | CP-4.1 |
| `saveDeadlineRule` | CP-4.2 (author), CP-4.3 (edit + forward-only regeneration) |
| `deleteDeadlineRule` | CP-4.4 (P04 level-2 confirm with live count) |
| `registerDocument` | CP-3.2 (idempotency key; chain seeds) |
| `addDocumentVersion` | CP-3.3 (append-only lineage) |
| `listDocuments` | CP-3.1 (register + unreturnedOnly companion view) |
| `getDocument` | CP-3.9 (chain + versions + verification) |
| `addCustodyEntry` | CP-3.5 (checked-out), CP-3.6 (presented), CP-3.7 (checked-in; returned in CP-5.2) |
| `sealDocumentVersion` | CP-3.4 (immutable + fingerprint-anchored) |
| `verifyChain` | CP-3.8 (intact / firstBrokenSeq) |
| `listActivity` | CP-5.6 (the accountability surface), 04 S10 |
| `exportMatterPackage` | CP-5.3 (idempotency, determinate progress, per-format partial) |
| `getArtifact` | CP-5.4 (expiry + regenerate) |
| `listJobs` | CP-5.5 (jobs console S9), CP-5.3 (export follow-through) |
| `getUsage` | CP-5.3 (pre-export quota, P14) |

**32 operations, 32 rows — 0 orphans, 0 phantoms.** Method-count verification: the 07b interface body declares exactly these 32 methods (scripted check: `check_coverage.py --slug legal-case-tracker` → PASS 32/32).
