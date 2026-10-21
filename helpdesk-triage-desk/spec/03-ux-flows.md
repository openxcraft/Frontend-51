# 03 — UX Flows: helpdesk-triage-desk

SME-C pass · 6 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation exactly once — no orphans. Terminology per 02: ticket · intent cluster · severity (P1–P4) · routing rule · queue · SLA clock · escalation · merge · disposition · intake · language detection · signal · severity matrix.

## CP-1 — Intake to first triage read (value proof)

1. Tarek opens the triage console for the 07:30 wave. Session context renders his role (`triager`), the workspace locale, and the intake pulse on triage home: new since midnight, unclustered, at-risk, breached — each a jump link into the filtered queue. `getSession` · `listTickets` (state=`new`)
2. Tickets arrived overnight through the bound **email-style channel binding** (a credential of kind "message intake" — kind, not vendor, credential-contract §2; its health chip reads active after verification). Channel state is visible where intake is configured, never buried in settings only. `listChannelBindings`
3. He pastes the morning's stragglers that came in by other routes — the manual path, always available, zero credentials (LOOP-5): subject + body, requester name (either script), requester tier, received-at. `createTicket`
4. Language detection runs deterministically on every intake (script-ratio rule, 07c rule 2): Arabic tickets render their body RTL, English LTR, mixed-script tickets bidi-isolate their Latin runs (rtl-rules §2). The detected-language chip sits on the row; the ticket detail declares the detection and offers the manual override. `getTicket`
5. Severity assessment computes from the versioned matrix (impact tier × urgency signals — 07c rule 4) and **names its signals** on the row and in detail: "P2 — impact: priority account; urgency: billing term present ('فاتورة'); matrix v4." SLA clocks start: first-response due from `receivedAt`, resolution due from `routedAt` (declared convention, 07a — workspace-configurable, 12 Q-4).
6. First triage read: the queue is sorted severity-then-received, filter chips declare themselves (P08), and Tarek sees the wave's shape — 47 P3/P4, 9 P2, 1 P1 — before touching anything. `listTickets` (sort=severity,received)

**Edges**: mixed-script ticket mis-detected as English (Latin-dominant body with one Arabic clause) — the override in ticket detail records `languageOverride` with actor and never re-triggers detection (07a); requester tier wrong at paste (update corrects it and re-assesses severity live, naming what changed); channel binding arrives `failed` (intake pulses a typed warning, paste unaffected); a pasted ticket with an empty subject (VALIDATION, field-linked).
**Failures**: createTicket with malformed payload → VALIDATION naming the field; channel binding unverified → intake from it stays paused with the verify action inline (credential-contract §3); NETWORK mid-list → banner + retry, triage state safe (P20).
**Recovery**: intake is idempotent per channel message id (07b rule 6) — a redelivered email never duplicates a ticket; pasted tickets persist as-is; nothing acknowledged or routed is ever lost to a re-fetch.

## CP-2 — Clustering run → review → confirm (the daily loop, conditionally-AI)

1. Tarek selects the unclustered set and runs clustering. Quota state shows first (P14): remaining assist runs this window when the capability is bound; "keyword engine" label when it is not — the honest default state, rendered as the product's normal grammar, never as a degraded mode (08). `runClustering` (Job) · `getUsage`
2. The Job progresses determinately per ticket ("Clustering 40 of 62"). On completion, results land: assignments to existing clusters by keyword rules (method `rule-match`, matched signature terms listed on each row), and — only when the assist capability is bound — **proposed** new clusters with bilingual label drafts and per-ticket `assist-proposal` assignments carrying confidence bands. Proposals render visually distinct from confirmed state everywhere (plum ink, 05). `listClusters` · `getCluster`
3. He reviews the assist's proposal "Refund delay / تأخّر الاسترداد" (11 tickets, 7 Arabic + 4 English — the cross-language value moment): label drafts in both locales, signature terms, member tickets with per-ticket matched terms. He fixes the Arabic label draft to the team's term (تأخّر الاسترداد) and trims one signature term that over-matches. `saveCluster` (status stays `proposed`; versioned)
4. He **confirms** the cluster — the P15 gate: the proposal becomes an authoritative cluster, its assignments flip to `confirmed-cluster`, and the confirm lands in the activity log with actor and timestamp. A proposal is never silently promoted; a confirmed cluster is never silently dissolved. `confirmCluster`
5. Two tickets sit honestly `unclustered` — the engine found no cluster at threshold and says so (never a nearest-match guess). Tarek assigns one to the refund-delay cluster by hand (method `manual`, actor recorded); the other is a new intent he does not have a cluster for yet — it stays unclustered and visible, or he authors a new cluster inline from the ticket (bilingual label + first signature terms in one form). `assignToCluster` · `saveCluster` (create)
6. Maysoon later re-runs clustering after the wave grows; cluster versions pin what each run computed against — re-runs recompute assignments against the current signature terms and never mutate history (07a version pinning).

**Edges**: a rule-match tie between two clusters (deterministic tiebreak: higher distinct-match count, then earlier-created cluster — 07c rule 3d; the row names both candidates); assist proposal whose label drafts are both empty (VALIDATION on confirm — labels are required in both locales); signature-term edit that would strand member tickets (saveCluster warns with the strand count, strands allowed explicitly — tickets fall to unclustered, never silently reassigned); quota hits the 80% warning mid-run (P14 warning surface, run completes).
**Failures**: assist run fails mid-Job → partial results kept and marked, keyword assignments already delivered stay, failed portion re-runnable scoped (ai-native-patterns §2 discipline; 07c partial policy); RATE_LIMIT on the metered window → the ladder notice with reset time and the keyword engine offered inline — the workday continues (ai-native-patterns §5); stale cluster edit → CONFLICT with both payloads.
**Recovery**: every assignment records method + actor + cluster version; cluster edits are versioned; a bad confirm is reversible by archiving (saveCluster status `archived`) with members falling to unclustered honestly — never a hidden mass-reassign.

## CP-3 — Severity review + routing decision (the rules loop)

1. The P1 from CP-1 sits with its assessment panel open: impact (key account), urgency signals (outage term "توقف" present, multi-user phrasing), matrix version, and the **proposed queue** from the first matching active routing rule — with the rule's name and its full condition list readable on the row (the anti-opacity grammar, 01 q10's complaint class answered). `getTicket`
2. Tarek commits the route: the ticket moves to the Payments queue, the decision's named reason ("routed by rule R-04: severity P1 + cluster checkout-failure + queue language capability ar") lands in the activity log, the resolution SLA clock anchors to `routedAt`. `routeTicket` (method `rule`)
3. He overrides one P3→P2 with a reason (customer called twice — a fact the matrix cannot see); severity override is recorded with actor + reason and re-derives SLA clocks honestly (a decision made on stale facts is not a decision — the clocks re-anchor, the old assessment stays in history). `routeTicket` (method `manual`, reason REQUIRED)
4. Clean stretch: filter to severity P4 + cluster password-reset + state `clustered`, bulk-route the counted set to the Self-service queue — the action bar names the count and criteria (P07), the confirm echoes it (P04), the adapter verifies `confirmCount` against the live filtered set. `bulkRouteTickets`
5. Maysoon edits the routing rules when the org changes: rule R-04's queue condition changes from "language capability ar" to "capability ar OR en-pending"; the edit re-versions the rule, and **already-routed tickets stay where the old rule put them** (routing decisions are historical facts; only new routes use the new version). `listRoutingRules` · `saveRoutingRule`
6. A new queue exists for the Ramadan night shift: bilingual name, owner from the member directory, capability tags (`ar-capable`, `en-capable`), business hours — routing rules reference queues, queues never reference rules. `listQueues` · `saveQueue` · `listMembers`

**Edges**: no active rule matches a ticket (honest `unrouted` state with the rule-evaluation trace shown — which rules were evaluated and why each failed its conditions; never a silent default queue); two rules both match (deterministic: lower rule order number wins; the row names the suppressed match); routing a ticket whose cluster was archived (cluster field carries the archived label; rule conditions on clusters still evaluate — history is history); bulk set containing a P1 (skipped and named — bulk never moves severity-critical tickets silently, 07b rule 4).
**Failures**: route to a queue whose owner left (queue renders owner-missing warning — route allowed, ownership is a warning not a blocker); stale rule edit → CONFLICT both kept; bulk count drift → CONFLICT with the recounted set.
**Recovery**: routing decisions are append-only history; re-routing supersedes with a reason chain; every decision exports in the triage log.

## CP-4 — SLA monitor → rescue → close (the clock loop)

1. Maysoon opens the SLA monitor: per-severity tiers with at-risk (≥70% of target elapsed, 07c rule 6) and breached counts, met-rates, and the oldest-first hot list. The monitor is a derived read — it recomputes from clock state within 120ms, never a refetch storm (10). `getSlaOverview`
2. A P2 Arabic payments ticket is at-risk (first-response clock 80% elapsed, still unrouted — the CP-3 edge made visible). She jumps in, escalates it: severity raised P2→P1 with reason, routed to the Payments queue, the escalation recorded and the lead notified per the notification ladder (P21). `escalateTicket`
3. Nora (responder, Payments queue) acknowledges; when she sends the response through the team's existing channel, she logs the response reference — channel kind + reference + sent-at — which is the first-response SLA measurement point (the no-live-chat boundary honored: the product records the response, it never sends it). `logTicketResponse`
4. Resolution work happens downstream; when done, the ticket closes with a disposition — `resolved-elsewhere`, `duplicate`, `spam`, or `pending-requester` (clock pauses, resumable) — each a named close-out with actor and timestamp. `setTicketDisposition`
5. The breach that still happened (a P3 breached overnight while the channel binding was failed) reads in the ledger with its full timeline — intake, detection, assessment, the binding-failure window, the late route — the audit answer Maysoon takes to the ops review. `getSlaOverview` · `listJobs` (the binding failure's record)

**Edges**: response logged before acknowledgment (allowed — the clock cares about the response, not the ceremony); disposition `pending-requester` then the customer replies through intake (clock resumes, state returns to routed, history keeps the pause); escalation of an already-P1 (escalation re-routes rather than re-severities — you cannot out-severity a P1, you re-own it); breach computed exactly at the boundary (the clock state is arithmetic on declared targets — 07c rule 6; no grace-period guessing, targets are policy fields).
**Failures**: logTicketResponse on a closed ticket → VALIDATION naming the disposition; escalate with no reason → VALIDATION (reason REQUIRED — an escalation without a why is a shout, not a record); NETWORK mid-monitor → last-known state with a stale banner (P20).
**Recovery**: dispositions are reversible except `spam` (P04 level-2 confirm at action time); clocks recompute from event history — the monitor is always derivable, never separately stored truth.

## CP-5 — Hygiene: duplicate merge + spam (the honesty loop)

1. One customer emailed three times about one failed payment — three tickets, one intent. Tarek opens the oldest (the keeper), selects the two children, and merges: children close with disposition `duplicate`, their histories append to the keeper, the keeper's cluster membership and severity survive (the highest severity among the set wins and the merge record says so). `mergeTickets`
2. The two Arabic duplicates and the English original were already one cluster — the cross-language clustering made the duplicate *visible* (the CP-2 value compounding: cluster membership is the duplicate hint, the human is the decision).
3. A Marketing blast in Arabic lands in intake — spam. He closes it with disposition `spam` and a note; the P04 level-2 confirm names what closes ("Mark 1 ticket as spam — it leaves the queue counts and keeps its record"). `setTicketDisposition`
4. Internal triage note on the keeper for Nora: "same customer as TK-0142, watch for a fourth." Notes are internal-only — never customer-facing, never in exports unless the export scope includes notes (declared at export time). `addTicketNote`
5. A mis-clustered ticket moves to its right cluster by hand, method `manual`, actor recorded — the assignment history keeps both placements. `assignToCluster`

**Edges**: merge where children carry different severities (highest wins, record names the absorbed set); merge across clusters (keeper's cluster stands; children's cluster memberships archived in history); merging a ticket that already has a logged response (allowed — responses and notes append; only disposition/ownership are singular).
**Failures**: merge of tickets in different states (VALIDATION naming which child is not mergeable — only `new`/`clustered`/`routed` merge; acknowledged/closed tickets must be handled in their own right); spam without the confirm → not executed (UI-side ladder, adapter records the confirmed action only).
**Recovery**: merges are recorded as events with full member lists — undo is possible in history review (an operator action, not a silent revert); spam tickets stay queryable with their records (spam is a state, not a deletion).

## CP-6 — Policy edit, re-assessment, export (the governance loop)

1. Maysoon opens the severity & SLA policy studio: the matrix (impact tiers × urgency signal classes → P1–P4), the SLA targets per severity (first-response minutes, resolution hours), and version history. She tightens P2 first-response from 60 to 45 minutes and adds "priority-account" as a P1 impact tier. `saveSeverityPolicy` (baseVersion → CONFLICT on stale)
2. The edit re-versions the policy and kicks a **re-assessment Job** across open tickets — determinate per-ticket progress ("Re-assessing 140 of 212"). Affected tickets whose severity changed re-open their routing: the route decision made against the old assessment is marked stale, the new proposal from the current rules renders, and a triager re-commits — never a silent mass re-route. `runSeverityReassessment` (Job)
3. The jobs center shows the run with its result counts (re-assessed, severity-changed, routing-reopened) and links back to context; the binding-failure event from CP-4 is queryable beside it. `listJobs`
4. Friday: Faisal's digest. Maysoon exports the triage log for the week — cluster digest with provenance (rules vs assist-confirmed), severity ledger with signal excerpts, routing decision trail, SLA ledger including the breach timeline, disposition counts. A Job with expiry + regeneration; quota shown before running (P14). `exportTriageLog` · `getArtifact` · `getUsage`
5. The failed channel binding from CP-1 gets replaced: a new binding is created and verified (the explicit verify action exercises a real capability round-trip — credential-contract §7 never-event #3), the old one revoked with its failure record retained. `createChannelBinding` · `verifyChannelBinding` · `revokeChannelBinding`

**Edges**: policy edit mid-Cluster-run (policy is read at assessment time — the run's assessments pin the version they used; the re-assessment Job reconciles after); export spanning a policy change (the log carries per-ticket the policy version each assessment used — the audit grammar); artifact expired → NOT_FOUND with regenerate (deterministic from triage state).
**Failures**: re-assessment Job partial failure (per-ticket retry scoped, 07c); export partial per-format (per-format retry, async-contract §4); revoke of a binding mid-intake (intake pauses on that binding, queued messages hold at the channel — never dropped silently by this product's contract; the binding's own delivery semantics are its binding-time evaluation, 08 gate).
**Recovery**: policy versions are immutable history; re-assessment is idempotent per policy version; exports regenerate from state forever.

## Non-happy paths

- **First run, no channels, no clusters** (the tested default state): paste a batch (CP-1 manual path is the primary, not the fallback); language detection and severity assessment work immediately (deterministic, local); clustering offers the seeded starter clusters (6–10 authored intents with bilingual signature terms — 07c seeds) and the keyword engine assigns; the sample batch plants one cross-language incident so the value moment (Arabic + English in one cluster) is experienced before any real data arrives (P22 value checklist).
- **Clustering assist unbound** (LOOP-5): the keyword engine IS the product — same screens, same rules, honestly labeled "keyword engine"; assist-only affordances (proposal review, confidence bands) simply do not render. The 00 success signals pass in exactly this state.
- **Offline** (P20): queue reads work from local state; triage writes (assignments, routes, dispositions, notes) queue with per-item state and reconcile to adapter truth on reconnect — severity clocks are computed from event history, so an offline hour never corrupts an SLA ledger.
- **Viewer stakeholder** (Faisal): read-only surfaces + export retrieval; every mutation → PERMISSION naming the seat's capability in capability language.

## Failure → error mapping

VALIDATION (malformed intake fields, confirm-without-labels, escalate/route-without-required-reason, merge-state violations, disposition-on-closed, policy sanity min>max) · NOT_FOUND (stale ticket/cluster/queue/rule/artifact links, expired artifacts) · PERMISSION (viewer mutations, capability-consent gates, cross-workspace access) · CONFLICT (concurrent ticket edits, cluster/policy/rule/queue edits, bulk count drift, resolving already-changed state) · RATE_LIMIT (clustering-assist runs, exports) · NETWORK (list fetches, job polling, artifact retrieval) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.1 (role/locale context for every surface) |
| `createTicket` | CP-1.3 (manual paste intake), non-happy first-run sample batch |
| `listTickets` | CP-1.1, CP-1.6 (severity-sorted queue read), CP-4.1 (at-risk hot list entry), S2 queue surface (04) |
| `getTicket` | CP-1.4 (language declaration + override), CP-1.5 (assessment panel), CP-3.1 |
| `updateTicket` | CP-1.4 (language override edge), CP-3.3 (requester-tier correction edge → live re-assessment) |
| `listChannelBindings` | CP-1.2 (channel health at intake), CP-4.5 (binding-failure record), S11 settings (04) |
| `createChannelBinding` | CP-1.2 (bind a channel), CP-6.5 |
| `verifyChannelBinding` | CP-6.5 (explicit verification round-trip), CP-1 edge (unverified binding) |
| `runClustering` | CP-2.1, CP-2.6 (re-run after wave grows) |
| `getUsage` | CP-2.1 (pre-run quota), CP-6.4 (pre-export quota) |
| `listClusters` | CP-2.2, S4 cluster board (04) |
| `getCluster` | CP-2.3 (proposal review with matched terms), CP-2.6 |
| `saveCluster` | CP-2.3 (label/term edit), CP-2.5 (create from ticket, archive path) |
| `confirmCluster` | CP-2.4 (the P15 gate — the product's trust moment) |
| `assignToCluster` | CP-2.5 (manual assignment), CP-5.5 (mis-cluster correction) |
| `routeTicket` | CP-3.2 (rule commit), CP-3.3 (manual override with reason) |
| `bulkRouteTickets` | CP-3.4 (clean-set bulk with confirmCount) |
| `listRoutingRules` | CP-3.5, S6 routing console (04) |
| `saveRoutingRule` | CP-3.5 (versioned edit), CP-3 edge (deactivate via status) |
| `listQueues` | CP-3.6, S9 queues surface (04) |
| `saveQueue` | CP-3.6 (Ramadan night queue create/edit) |
| `listMembers` | CP-3.6 (queue owner picker), S9 (04) |
| `getSlaOverview` | CP-4.1 (monitor), CP-4.5 (breach ledger timeline) |
| `escalateTicket` | CP-4.2 (at-risk rescue) |
| `logTicketResponse` | CP-4.3 (first-response measurement point) |
| `setTicketDisposition` | CP-4.4 (resolved-elsewhere / pending-requester), CP-5.3 (spam), CP-5.1 (duplicate via merge) |
| `mergeTickets` | CP-5.1 (duplicate merge) |
| `addTicketNote` | CP-5.4 (internal triage note) |
| `saveSeverityPolicy` | CP-6.1 (matrix + targets edit, versioned) |
| `runSeverityReassessment` | CP-6.2 (re-assessment Job) |
| `exportTriageLog` | CP-6.4 (weekly digest) |
| `getArtifact` | CP-6.4 (artifact retrieval), CP-6 edge (expired → regenerate) |
| `listJobs` | CP-6.3 (jobs center), CP-4.5 (binding-failure record), S10 (04) |
| `revokeChannelBinding` | CP-6.5 (failed-binding replacement) |

34 operations, 0 orphans (Critic-verified — the table above lists every 07b operation exactly once; every name appears in the step prose of the cited flows).
