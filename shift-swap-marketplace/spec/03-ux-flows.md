# 03 — UX Flows: shift-swap-marketplace

SME-C pass · Critical paths with edge cases, failure modes, and recovery. Every path is the justification source for adapter operations in 07a/07b; the bidirectional traceability tables at the end prove zero orphans in BOTH directions (flagship obligation). Worker flows are specified on the mobile surface (≥360px); supervisor/admin flows on the console (≥1280px).

## CP-1 — Worker posts a shift for swap (the daily outgoing action; mobile)

1. **Entry**: Amna opens the worker surface on MY SHIFTS (M1) — her schedule for the next 14 days, each shift card showing role, site, times (dual-calendar aware per P24 where the workspace enables it), and coverage state.
2. She taps a shift card → shift detail sheet: her obligations (site, break plan, required qualifications rendered as duotone badges), and one primary action: **"Offer for swap"** (verb+object, copy-voice §1.5).
3. **Eligibility pre-flight** (checkSwapEligibility): the adapter evaluates the shift's swap window (must be ≥ N hours before start — workspace policy), the required qualifications, and posts a preview: which colleagues are *structurally* eligible (qualification match) and the blackout rules that will gate requests (minimum rest, weekly cap). If the shift is inside a non-swappable window (e.g., posted < 2h before start), the UI states it with the reason and offers the fallback path (notify supervisor directly — CP-4 surface, not a chat).
4. **Optional note** (bounded 140 chars, bilingual input respected, bidi-isolated — rtl-rules §2): why she's swapping (family event). Notes are visible to requesters and supervisors; no chat replies exist (LOOP-10: no messaging app).
5. **Post** (createSwapOffer): optimistic with undo window 7s (P03) — the offer card immediately appears in MY OFFERS with a "Posting… / Posted" state; the board receives it via subscribeSwapEvents.
6. The offer expires automatically at the workspace cutoff (default: 12h before shift start, policy-governed); expiry is a state, not a deletion.

**Edge cases**: shift owned jointly (split shift) → swap offer requires both segments or explicitly excludes one (choice, never silent); worker's own qualification expires between posting and match → offer stays live but every request is re-checked at request time; note contains mixed ar/en → bidi isolation on render; posting during offline (P20) → queued write with per-item state, offer time = sync time (fairness-neutral: ranking uses request times, not posting time).
**Failure modes**: createSwapOffer returns VALIDATION (window violation / missing required field) → field-linked inline error; RATE_LIMIT (worker exceeds open-offer cap, default 3) → cap copy with count and window; NETWORK mid-post → queued (P20) with rollback if confirmation fails; CONFLICT (shift already covered/changed upstream by schedule refresh) → both states shown, offer withdrawn with reason.
**Recovery**: every offer is reversible before match (cancelSwapOffer with reason); undo window on post; MY OFFERS shows expiry countdown.

## CP-2 — Worker browses the board and requests a swap (the daily incoming action; mobile)

1. **Entry**: Yusuf opens THE BOARD (M2): open swap offers as cards (post time is NOT the sort key — offers sort by **starting soonest** then by qualification fit for the viewer; grab-first semantics are explicitly rejected by design). Filter chips (P08): my qualification match / site / shift window / day of week; each filter carries an accessible predicate description.
2. Cards he is **not qualified for** render dimmed with the missing-qualification badge (never hidden — Yusuf's objection: rules must be visible, 02); cards blocked by **blackout rules for him specifically** (if he requested, rest rules would fail) render with the Rest Ribbon hint (tapping explains the conflict) — visible-but-gated, never silent filtering (02 objection matrix).
3. Tap a card → **OFFER DETAIL (M3)** with the **Fairness Reveal** (original interaction #1, full spec in 13 §B1): shift facts, requester note, his own eligibility pre-flight (checkSwapEligibility) as a green/amber panel — amber names the exact rule at risk (e.g., "requesting this would leave you 7h rest before your Friday night — the minimum-rest rule is 11h" in both locales) — and his **rank preview**: the current queue as a ranked ladder with rationale chips (computeFairnessRanking), his own position highlighted.
4. **The fairness policy sheet** is reachable from the ladder ("How is this ranked?" → policy view, worker-readable, versioned — inspectability is the feature).
5. **Request** (createSwapRequest): optional 140-char note; confirmation is one tap (no confirm dialog — reversible via cancelSwapRequest with 5s undo, P03); the request enters the queue and his rank preview becomes his live rank.
6. **Status ladder on his side** (M5): queued → ranked → accepted → supervisor-approved → confirmed (or declined / expired / cancelled). Each transition is a notification per the P21 ladder (instant only for accepted/supervisor decision/confirmed; the rest is digest).
7. Live board updates arrive via subscribeSwapEvents (offer withdrawn, matched, new offer matching his filters) — as non-modal list mutations, never toasts multiplying urgency (P21).

**Edge cases**: two requests by the same worker on the same offer → second is blocked with copy (one request per offer per worker, policy); offer expires while he is typing the note → sheet converts to a closed state with the next-matching offer one tap away (P11 recall preserves his typed note for the next request — redundant-entry elimination); his rank drops as stronger candidates request → his MY REQUESTS card shows live rank with a delta, announced politely on focus not on every change; zero eligible colleagues (entire team fails qualification) → offer card carries a "no eligible takers yet" state with the qualification gap named (feeds Tariq's registry work, CP-5).
**Failure modes**: createSwapRequest VALIDATION (blackout rule fails at request time — rules re-evaluated server-side on every request) → the failing rule is named in the error details and the copy offers the specific reason (11); PERMISSION (worker suspended from swaps by ops lead) → lock state with restore path; RATE_LIMIT (daily request cap, default 5/day) → count + reset window; NETWORK → queued write (P20).
**Recovery**: cancelSwapRequest any time before supervisor decision (5s undo then explicit cancel with state preserved); expired offers link to the schedule source view (M1) so the journey never dead-ends.

## CP-3 — The acceptance ladder: from ranked queue to confirmed swap (both worker surfaces)

This is the flow the product is named for. It has two actors in sequence: the **offering worker** picks from the ranked queue, then the **supervisor** confirms. The ladder is visible to all three worker parties at their own fidelity (requester sees his rank; offerer sees the full ranked ladder; supervisor sees the ladder snapshot at decision time).

1. Amna's offer has requests. She opens MY OFFERS → **the queue as a ranked ladder** (listRequestsForOffer + computeFairnessRanking): each candidate row shows name, qualification badges, and the **rationale chips** — seniority band, swap balance (received−given), rest compliance, last-swap recency — with the composite score de-emphasized (people, not numbers, are the display; the number lives in the detail).
2. **Rationale drill**: tapping a candidate expands his component rows (each chip's contribution in plain language, bilingual — "أخذ تبديلين أكثر مما منح خلال 90 يوماً" / "took 2 more swaps than given in 90 days").
3. **Accept** (acceptSwapRequest): Amna selects a candidate — the **Swap Handshake** signature moment (original interaction #2, full spec 13 §B2): the two shift cards slide together and weld with a single copper line flash (energetic personality's one controlled overshoot ≤8%, motion-language §1) — creating a **pending match** (SwapMatch, status pending-supervisor). The other queued requests resolve to `declined-by-outcome` (not personal denial — copy distinguishes, 11) with a digest notification; swap balances update only on confirmation.
4. **Supervisor leg**: the match lands in Noora's console queue (CP-4). On `recordSupervisorDecision(approved)`, the SwapMatch → `confirmed`: both workers get instant notifications; the shift's coverage state updates (Shift.status covered); the fairness ledger appends the decision with its snapshot (ApprovalRecord).
5. **Deny leg** (either actor): Amna can withdraw before supervisor decision (re-opens her offer at her original queue state — the ladder is recomputed but declined requests are NOT auto-restored; she sees who's still queued); Noora's denial requires a rationale (CP-4 step 3) and the requester receives it verbatim with the ranked-next option if the offer re-opens.
6. **Expiry and auto-resolution**: if no request is accepted before the offer cutoff → offer expires, Amna is notified with the "shift stays yours" copy + supervisor-notify fallback (11).

**Edge cases**: accepted candidate's blackout rule becomes violated between accept and supervisor decision (schedule source refresh moved his other shift) → match is auto-flagged `blackout-violated`, supervisor sees the violation named, confirm is blocked until re-ranked (the engine recomputes; the flag is a state, not a deletion); two supervisors open the same match → first decision wins, second gets CONFLICT with both payloads (P10-style compare); offering worker's own shift disappears upstream (roster re-publish) → offer auto-withdraws with reason; requester quits/leaves mid-ladder → his requests auto-cancel, swap balance frozen at close.
**Failure modes**: acceptSwapRequest CONFLICT (candidate already accepted elsewhere) → ladder re-renders, Amna's selection restores to the next candidate (state preserved, no dead click); RATE_LIMIT on decision storms (supervisor bulk decisions) → batched guidance, not refusal; NETWORK → decisions queue (P20) and reconcile against authoritative match state on reconnect (idempotency keys per async-contract §5).
**Recovery**: the full ladder history is preserved per offer (the ranking at accept-time is snapshotted into the ApprovalRecord — grievances are answerable after the fact); declined requests are visible in MY REQUESTS with outcome states, never erased.

## CP-4 — Supervisor console: approval queue with fairness visibility (desktop, keyboard-first)

1. **Entry**: Noora opens the CONSOLE (D1) → **approval queue**: pending matches as rows (worker pair, shift, time-to-shift countdown, eligibility state pre-checked: qualification match ✓/✗, blackout ✓/✗ — she never has to verify facts, only judge judgment).
2. Row focus (keyboard: j/k or arrows — P18) expands the **match drawer**: the ranked ladder snapshot (top 3 + selected candidate's rationale chips), the two workers' rest ribbons around the target shift, and any rule flags.
3. **Decide**: `A` approve / `D` deny (modified keys only — Arabic layout safe, a11y-baseline §3). Approve is one keystroke (recordSupervisorDecision with rationale optional-template "policy-conformant"); **deny requires a rationale** — template picker (coverage risk / rest rule / qualification concern / other) + editable note; the rationale reaches the requester verbatim (11) — denials that explain themselves (02 objection matrix).
4. **Queue hygiene**: filter chips (venue, rule flags, aging), saved views (P08); items aging past SLA (default 24h before shift start) rise with an aging badge (visible, not red-alert — calm accountability).
5. **Accountability surfaces**: ACTIVITY LEDGER (D7) — every consequential mutation (post, request, accept, deny, confirm, rule change, policy publish) filterable by actor/target/period (P17); **fairness ledger export** (exportFairnessLedger → Job → artifact with expiry per async-contract §2) for HR/grievance packets: actor, decision, ranking snapshot, policy version.

**Edge cases**: bulk approve (shift-range select, P07 action bar) — allowed for zero-flag matches only; flagged matches are individually decided (P04 discipline: bulk never bypasses judgment); decision on a match whose offer was withdrawn milliseconds before → CONFLICT surfaces both states; supervisor denies and worker re-requests same shift → visible re-request history on the row (no silent loops); no-access venue (permission scope) → rows hidden with a no-access note, never an "empty" lie (P01).
**Failure modes**: recordSupervisorDecision PERMISSION (venue not hers) → row locks with request-access action; NOT_FOUND (match resolved by another supervisor) → queue re-syncs; NETWORK → decisions queue offline (P20) with per-item state.
**Recovery**: decisions are immutable once recorded; corrections are new entries (ledger discipline, P17).

## CP-5 — Ops lead stands up the rules spine (admin, desktop; Tariq's flow)

1. **Entry**: RULES CENTER (D4) first-run checklist (P22, honest milestones): qualifications registry → blackout rules → fairness policy publish → worker roster.
2. **Qualifications registry** (D5): list (listQualifications); **paste-import** of a sheet (CSV/TSV paste — the manual alternative is the primary path at v1, LOOP-5; file-parse is the abstract upgrade in 08) creating qualifications with code, ar/en names, renewal months; upsertQualification per row review; conflict surface (same code, different name) → both shown, explicit keep decision (LOOP-9 pattern — never silent pick).
3. **Worker registry**: inviteWorker (phone-number-identity at v1, session provider-agnostic 07b), updateWorker (team, seniority anchor date, role), assignQualification (grant with expiry; renewal reminders ride the P21 digest).
4. **Blackout rules** (listBlackoutRules → upsertBlackoutRule): rule kinds — minimum-rest (hours), max-weekly-hours, no-clopening (derived from minimum-rest with explicit naming), qualification-required window, date-window (holiday freeze, e.g., Ramadan peak nights), jurisdiction pack reference. Each rule carries scope (workspace/team/role band), active state, notes, and a plain-language bilingual preview of what it will block ("يمنع قبول مناوبة تترك أقل من 11 ساعة راحة" / "blocks accepting a shift that leaves under 11h rest"). archiveBlackoutRule for retirement (never hard delete — ledger discipline).
5. **Fairness policy** (getFairnessPolicy): weights per component (seniority / swap balance / qualification coverage / rest compliance / recency), tiebreak order, caps (open offers, daily requests), expiry cutoffs. Rendered as the same sheet workers see (one source, 07a).
6. **Policy simulation before publish** (updateFairnessPolicy gated by preview): computeFairnessRanking re-runs against currently open offers under the proposed weights and shows before/after ladders side-by-side (P16-style diff for lists) — Tariq tunes with evidence, not faith (02 objection matrix). Publish versions the policy (fairness ledger names the version ever after).
7. **Schedule spine**: importScheduleSource (paste/manual at v1: paste a roster export or enter shifts in the read-only team schedule view D3; the abstract import binding is 08's N1) — a Job (async-contract §2) with per-row progress, awaiting-input on ambiguous rows (site code unknown → row-level choice, never silent drop), partial-results policy per §4.

**Edge cases**: rule conflicts (two minimum-rest rules different hours, overlapping scope) → precedence is scope-narrower-wins, rendered as a conflict row with explicit resolution; qualification expiring mid-week → workers see degraded eligibility immediately at request time, ops lead gets digest (not instant ping); pasting a roster with duplicate shift IDs → job marks awaiting-input with both rows shown; policy weight sum validation → VALIDATION with component-level details.
**Failure modes**: importScheduleSource VALIDATION (malformed paste) → row-linked errors with the row quoted; RATE_LIMIT on simulation spam → cooldown copy; NETWORK → import resumes (job reconcile, async-contract §5 idempotency).
**Recovery**: registry changes are versioned via activity ledger; rule archive is reversible (un-archive restores active state, history intact).

## CP-6 — Ops, notifications, and resilience (non-happy-path walkthroughs; documented and tested)

- **Offline worker mid-journey (Amna's break, dead zone)**: P20 banner; request queues locally with per-item state; on reconnect, sync reconciles against authoritative queue state — if the offer expired meanwhile, the queued request is discarded with an honest notice (never silently posted to a dead offer).
- **Notification ladder (P21)**: listNotifications + markNotificationsSeen on M6; classes: match-confirmed (instant), supervisor-decision (instant), offer-expired (digest), board-activity-matching-filters (digest), qualification-expiring (digest), fairness-policy-changed (digest). User tier control per class; never toast multiplication (02 objection).
- **Live updates**: subscribeSwapEvents drives board mutations and MY REQUESTS rank deltas; the mock (07c) replays a fixed event script deterministically.
- **Schedule source degradation** (import binding absent or failed — credential-contract §3 failed state): the product is fully useful with manually-entered shifts (LOOP-5 posture — 08 map); degraded surfaces state the staleness age explicitly ("آخر استيراد: قبل 3 أيام" / "last import: 3 days ago").
- **Full walkthrough — worker journey on a 360px phone (00 §success signal 1)**: sign in → MY SHIFTS (3 cards) → tap evening shift → eligibility pre-flight (2 eligible colleagues) → note → post (undo 7s) → BOARD (filter: my quals) → offer detail (rank preview: second) → request (amber rest-rule panel acknowledged) → rank delta notification (polite) → accepted (instant, Swap Handshake on the status card) → supervisor-approved → confirmed. Total taps: 11; total screens: 5. This walkthrough is the release-test fixture (09, 10).
- **Job center (D8)**: getJob/retryJob/cancelJob for imports and ledger exports; retry scoped to failed rows only (async-contract §4).

## Flow → operation traceability (Table A — every adapter operation ↔ its flow steps)

| Adapter method (07b) | Flow steps that require it |
|---|---|
| getSession | CP-1.1, CP-4.1, CP-5.1 (surface entry on both shells; role routing) |
| listShifts | CP-1.1 (MY SHIFTS), CP-2.7 fallback, D3 console schedule view (CP-4 ctx) |
| getShift | CP-1.2 (shift detail sheet) |
| createSwapOffer | CP-1.5 |
| cancelSwapOffer | CP-1 recovery, CP-3.5 withdrawal leg, CP-3 edge (upstream roster change) |
| listSwapOffers | CP-2.1 (board), CP-5.6 simulation targets |
| getSwapOffer | CP-2.3 (offer detail), CP-3.1 queue context |
| createSwapRequest | CP-2.5 |
| cancelSwapRequest | CP-2 recovery, CP-3 edge (requester leaves) |
| listMySwapRequests | CP-2.6 (status ladder), CP-3.3 declined-by-outcome view |
| listRequestsForOffer | CP-3.1 (ranked ladder) |
| checkSwapEligibility | CP-1.3 (pre-flight), CP-2.3 (viewer eligibility panel) |
| computeFairnessRanking | CP-2.3 (rank preview), CP-3.1 ladder, CP-5.6 policy simulation |
| getFairnessPolicy | CP-2.4 (policy sheet), CP-5.5 |
| updateFairnessPolicy | CP-5.6 (publish, simulation-gated) |
| acceptSwapRequest | CP-3.3 |
| denySwapRequest | CP-3.5 (offering-worker withdrawal alternative), CP-4.3 keyboard path |
| listMatches | CP-4.1 (approval queue), worker MY REQUESTS history |
| recordSupervisorDecision | CP-3.4, CP-4.3 |
| listBlackoutRules | CP-5.4, CP-2.3 amber panel rule naming (context) |
| upsertBlackoutRule | CP-5.4 |
| archiveBlackoutRule | CP-5.4 (retirement leg) |
| listQualifications | CP-5.2 |
| upsertQualification | CP-5.2 (incl. paste-import row commits) |
| assignQualification | CP-5.3 |
| listWorkers | CP-5.3, CP-4.2 (worker context drawer) |
| updateWorker | CP-5.3 |
| inviteWorker | CP-5.3 |
| listNotifications | CP-6 (notification ladder surface M6) |
| markNotificationsSeen | CP-6 |
| subscribeSwapEvents | CP-1.5, CP-2.7 (live board), CP-6 live updates |
| importScheduleSource | CP-5.7, CP-6 schedule spine |
| exportFairnessLedger | CP-4.5 (accountability export) |
| getJob | CP-5.7, CP-6 job center |
| retryJob | CP-6 (failed-rows-only retry) |
| cancelJob | CP-6 (import/export cancel) |
| listActivity | CP-4.5 (activity ledger), Tariq audit walkthrough |

## Operation → flow traceability (Table B — every flow step ↔ its operations; reverse proof)

Every numbered step above names its operation inline (CP-1.1→listShifts; CP-1.2→getShift; CP-1.3→checkSwapEligibility; CP-1.5→createSwapOffer+subscribeSwapEvents; CP-2.1→listSwapOffers; CP-2.3→getSwapOffer+checkSwapEligibility+computeFairnessRanking; CP-2.4→getFairnessPolicy; CP-2.5→createSwapRequest; CP-2.6→listMySwapRequests; CP-2.7→subscribeSwapEvents; CP-3.1→listRequestsForOffer+computeFairnessRanking; CP-3.3→acceptSwapRequest; CP-3.4→recordSupervisorDecision; CP-3.5→cancelSwapOffer/denySwapRequest/cancelSwapRequest; CP-4.1→listMatches; CP-4.3→recordSupervisorDecision/denySwapRequest; CP-4.5→listActivity+exportFairnessLedger; CP-5.2→listQualifications+upsertQualification; CP-5.3→inviteWorker+updateWorker+assignQualification+listWorkers; CP-5.4→listBlackoutRules+upsertBlackoutRule+archiveBlackoutRule; CP-5.5→getFairnessPolicy; CP-5.6→updateFairnessPolicy+computeFairnessRanking; CP-5.7→importScheduleSource+getJob; CP-6→listNotifications+markNotificationsSeen+subscribeSwapEvents+getJob+retryJob+cancelJob; both shells entry→getSession). Reverse check performed at Critic pass — zero orphans in either direction (37/37 operations; 37/37 traced steps).

## Failure-mode → error-class mapping (feeds 07b/11)

| UX failure | Error class | User-facing surface |
|---|---|---|
| Offer/request input violates rules or caps | ValidationError | field/rule-linked inline with the rule named |
| Offer/match/shift gone (resolved, expired, upstream change) | NotFoundError | safe-state + list re-sync + next action |
| Role/venue scope violation (worker on console ops; supervisor out of venue) | PermissionError | lock state with request-access action |
| Concurrent decisions / stale queue writes / roster re-publish collision | ConflictError | both-states compare, explicit re-decide |
| Offer/request/decision caps exceeded | RateLimitError | count + window + reset copy (P14-style transparency) |
| Offline / transport drop mid-write | NetworkError | P20 queue with per-item state + honest reconciliation |
| Anything else | UnknownError | correlation-id copy (copy-voice §1.4) |
