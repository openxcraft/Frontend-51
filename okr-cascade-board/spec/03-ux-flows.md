# 03 — UX Flows: okr-cascade-board

SME-C pass · 6 critical paths. Coverage table at end traces every 07b operation — no orphans.

## CP-1 — Create the cycle, author the company cascade (first-session value proof)

1. Layla signs in; the session resolves her role (admin) and workspace locale (EN default, AR full citizen). Cycles home shows the workspace's cycles; first-run offers the seeded sample cycle (P22) and the onboarding value checklist. `getSession` · `listCycles`
2. She creates the cycle: bilingual name pair ("نمو الربع الرابع" / "Q4 growth"), start and end dates (a quarter), and accepts the workspace cadence default (weekly, due Monday 10:00) — the cadence preview shows the period grid her choice produces. `createCycle` · `getCadence`
3. She authors the first company objective in the objective composer: the bilingual pair editor shows EN and AR columns side-by-side with per-side direction, alignment links between the two text areas, and live pair-parity indicators (P23). The deterministic lint evaluates as she types (debounced). `createObjective` (level: company)
4. She types a two-line focus brief ("reduce the hesitation at checkout; the Arabic journey is the priority") and requests drafting proposals. The assist panel opens its reserved region, streams the proposal set (objective pair variants + 3 key-result pairs with baseline/target pre-filled), announces start and completion politely — never per-token (P13). The usage meter shows before the run. `requestDraft` · `getUsage` · `getDraftProposal`
5. She reviews the proposals through the P15 gate: accepts one key-result proposal (it copies into the composer as an editable draft), edits one (the AR side reads soft; she tightens it; the lint re-runs), dismisses the objective variant (dismissal is logged). `resolveDraftProposal`
6. She repeats for the second company objective, then creates the first team objective (level: team, owning team picked from the teams rail) and links it to both company objectives — the cascade board renders the company tier, the team lane, and the two alignment edges. `createObjective` · `listTeams` · `listObjectives`
7. She previews the board: objective cards roll up key-result progress (zero check-ins yet — the unreported badge, not a fake 0%) and alignment warnings render in place: a company objective with no team children shows "unstaffed ambition", a team objective with no parent shows "orphaned effort". `listObjectives` · `getObjective`

**Edges**: a bilingual pair with one side empty is valid and renders honestly (empty side is a visible state — never machine-filled); mixed-script input in the wrong column (English typed into the AR column) gets bidi isolation, never a forced flip; the assist panel when unbound renders the plain bilingual editor with the lint (the rung-4 floor — the button is absent, not disabled); the draft proposal expires unattended after 7 days (proposal lifecycle, 07c).
**Failures**: malformed cycle dates (end before start) → VALIDATION naming the field; assist capability unconsented → PERMISSION naming the capability class in capability language; assist quota exhausted → RATE_LIMIT with reset date and the plain-editor path stated in the same surface; assist job stalls >8s → stalled state with retry guidance (ai-native-patterns §2).
**Recovery**: draft proposals are discardable without side effects; the objective composer is autosaved (P10); cycle creation is idempotent on double-submit via the operation's idempotency key.

## CP-2 — Key results: bilingual statements, metrics, owners, the deterministic lint (the authoring loop)

1. Omar opens the objective detail for his team objective and adds a key result: bilingual statement pair, metric block (unit label, baseline, target, direction increase/decrease), weight (default 1), and a single named owner picked from the member directory. `createKeyResult` · `listMembers`
2. The deterministic lint evaluates the statement pair against fixed tables and renders findings inline with the rule named (never a vague warning): task-shaped opening verbs, soft "help/support" verbs, length budgets (objective ≤ 12 EN words / ≤ 10 AR; KR ≤ 18 EN / ≤ 15 AR), pair-length parity beyond ±40% of the expected AR≈1.25×EN ratio. Findings are flags, not blocks — the author decides; the flags persist visibly until addressed or acknowledged.
3. He corrects the flagged statement ("support the checkout redesign" → "raise checkout conversion from 2.1% to 3.0%"; AR side re-tightened) and the lint findings close in place. `updateKeyResult`
4. He sets the metric: baseline 2.1, target 3.0, unit "%" — the composer previews the progress formula ("progress = (current − baseline) ÷ (target − baseline)") so the arithmetic is visible at authoring time (inspectability, 00).
5. A key result proves wrong mid-authoring (duplicate of another) — he archives it; the confirm ladder names the consequence ("Archive 1 key result — its 3 check-ins leave the rollup and stay in the activity log"). `removeKeyResult`
6. The objective detail now shows the KR list with metric bars, owners, and the first-period due date. `getObjective` · `listKeyResults`

**Edges**: target equal to baseline → VALIDATION at metric save (zero-span progress is undefined — the rule is named, 12 Q-12); a KR owned by a member outside the objective's team is allowed and visible (cross-team ownership is real; the board shows it plainly); weight changes re-roll the objective rollup deterministically.
**Failures**: stale edit (another lead edited the KR meanwhile) → CONFLICT with both versions kept side by side (P10/P04); owner not in the workspace → VALIDATION naming the member field; lint itself never errors — it is a pure function of the statement pair (07c).
**Recovery**: KR edits are versioned; archived KRs are excluded from rollup and grading but remain in the log and the export appendix (nothing is silently lost).

## CP-3 — The check-in cadence (the weekly loop — the product's heartbeat)

1. Monday 09:30. Tariq opens his check-in desk from the digest link (responsive 360px participant mode): the KRs he owns that have a due check-in this period, each with its metric, last submitted value, and the structured form. `getSession` · `listKeyResults` · `getCheckIn` (prior period's submission for context)
2. He fills the form: current value (typed — the number he knows), confidence 1–5 (anchored labels inline on first use: 1 far off track … 3 on track … 5 certain), blocker text (free text, own direction, bidi-isolated), and a help-needed flag when he wants escalation. Autosave persists drafts (P10). `saveCheckInDraft`
3. He submits. The check-in lands: progress recomputes by formula, the KR's bar and the objective rollup tick, and the company-tier ring advances with the Cascade Settle moment (the one energetic overshoot — success only); the announcement is polite and mirrors the visible numbers. `submitCheckIn`
4. A value arrives wrong (transposed digits) — he reopens the submitted check-in and corrects it; the correction keeps its revision trail and the recomputation re-runs from the corrected value (history preserved, never overwritten silently). `updateCheckIn`
5. Layla opens the cadence dashboard before the leadership meeting: the KR × period coverage grid (on-time / in-grace / overdue / draft states as text+icon, never color alone), the overdue zone with named owners and periods, the at-risk zone with its trigger named ("confidence 2 on period 1" / "two consecutive missing periods"), and the blocker digest. `listCheckIns` · `getCadence`
6. The leadership meeting reads the board: rollups that moved, the at-risk KR, the overdue owner — the 30-second state of the quarter. `listObjectives` · `getObjective`

**Edges**: a lead submits a check-in on behalf of an absent owner — allowed, recorded with submittedBy ≠ owner and the on-behalf provenance shown (honesty about who reported); the grace window (period close → due time) renders in-grace, not overdue; a KR created mid-period has its first check-in due the following full period (07c rule — never an instantly-due surprise); a draft exists but was never submitted at close → the period renders missing, and the draft is visibly retained for the author (a draft is not a report).
**Failures**: submit for a closed cycle → VALIDATION naming the cycle state; submit with empty value → VALIDATION field-linked; stale draft version → CONFLICT both kept; offline at submit → queued write with per-item state (P20), reconciled to authoritative check-in state on return (async-contract §5).
**Recovery**: check-in drafts persist across sessions (P11 recall — last value pre-filled into the next period's form); corrections are always available while the cycle is active, always logged.

## CP-4 — Mid-cycle governance (at-risk reading, re-alignment, re-baseline, archive)

1. The cadence dashboard surfaces a supply-chain KR at-risk (trigger: two consecutive missing periods). Layla opens the objective detail and reads the check-in history: period 1 submitted with confidence 2 and a blocker ("the replenishment cycle number lives in a different team's report") — the context for the derived state is on the same screen. `getObjective` · `listCheckIns`
2. The team objective under it needs re-alignment — the division reorganized: Omar edits the objective's parent links (drop one company objective, add another); the cascade edges re-render and the alignment warnings recompute. `updateObjective`
3. A target proves wrong (baseline moved because the measurement itself changed): Noura re-baselines the KR (new baseline, new target, reason required) — a logged, versioned mutation; the rollup re-derives and the change is visible in the activity trail. `updateKeyResult`
4. An objective is abandoned mid-quarter (the initiative was cut): Layla archives it through the confirm ladder that names the consequence ("Archive 1 objective — its 4 key results and their 11 check-ins leave the rollup and grading, and stay in the log and export"). `archiveObjective`
5. Every governance action lands in the activity log with actor, action, target, and timestamp (P17); the log is filterable by cycle and entity. `listActivity`

**Edges**: archiving a company objective with children → the children keep their links to an archived parent and render an "archived parent" state (never silently re-parented); re-baselining does not rewrite historical check-in values — prior progress snapshots stay pinned to what was reported then; at-risk is derived at read time from current state — it can appear and clear within a day as check-ins land (the rule is a function, not a stored verdict).
**Failures**: stale baseVersion on objective/KR edits → CONFLICT both payloads; archive without a reason → VALIDATION (the reason is the audit trail); permission on another team's objective → PERMISSION naming the role boundary.
**Recovery**: archived entities are read-visible forever at v1 (no purge — 12 Q-12); every governance mutation is reversible in effect by authoring a new state, never by rewriting history.

## CP-5 — Cycle close, deterministic grading, export

1. The quarter ends. Layla opens the grading console on the active cycle and starts the close: the gate lists what must be true — all periods closed, no check-in corrections pending — and what is honestly open (unreported KRs named, not blocked). `setCycleState` (start-grading) · `getCycle`
2. She runs the grading computation: per-KR final grades from the last submitted values (formula visible), per-objective weighted means, aspirational objectives scored against the 0.70 on-target threshold with the semantics stated in place, unreported KRs excluded with a count. `computeCycleGrades`
3. She reads the grade sheet — grades, the formulas that produced them, unreported counts, the archived-KR appendix — and closes the cycle (state: closed; the grade sheet becomes an immutable snapshot). `getGradeSheet` · `setCycleState` (close)
4. She exports the cycle package: the cascade with final rollups, the full check-in history, the grade sheet, and the activity appendix — a Job with declared expiry and regeneration (async-contract §2, §7). `exportCycle` · `listJobs`
5. She retrieves the artifact before expiry; a later retrieval after expiry offers deterministic regeneration (the cycle state is immutable, so the artifact is reproducible). `getArtifact`

**Edges**: grading with unreported KRs → allowed, disclosed in the sheet (excluded, counted — never silently zero); grading a cycle with archived objectives → the appendix carries them with their archive reasons; re-open after close → not offered at v1 (the grade sheet is the record; a corrected quarter is a new cycle — 12 Q-10); export format partial failure → per-format retry (async-contract §4).
**Failures**: grade computation on a non-grading cycle → VALIDATION naming the state machine; export of a draft cycle → VALIDATION (only closed or grading states export); expired artifact → NOT_FOUND with the regeneration path; export job failure → typed error, retry, partial delivery policy per format.
**Recovery**: grades are computed from immutable inputs (submitted values + archive record) — recomputation is bit-identical (07c regression assertion); artifacts regenerate from cycle state.

## CP-6 — Workspace management: cycles home, cadence settings, jobs, activity, usage

1. Cycles home: the cycle list with state chips and rollup summaries; filters + saved views (P08); the first-run sample cycle (P22) with its honest badge; creating the next cycle from here. `listCycles` · `createCycle` · `getSession`
2. Cycle settings: rename the bilingual cycle name, adjust dates while the cycle is still in draft state. `updateCycle` · `getCycle`
3. Cadence settings: the workspace cadence (frequency weekly/bi-weekly, due day, due time) with a live preview of the period grid; a cadence change confirms its migration semantics first (P04 level 2: "periods re-derive from cycle start; submitted check-ins keep their timestamps and re-map into the new grid; any that fall outside all periods render in a pre-change bucket"). `getCadence` · `updateCadence`
4. Teams and members: the teams rail with leads; the member directory for owner pickers. `listTeams` · `listMembers`
5. Jobs console: assist drafts and exports with state, cancel/retry, link-to-context (async-contract §7). `listJobs`
6. Activity log: every consequential mutation, filterable by cycle and entity, exportable discipline at close. `listActivity`
7. Usage: the assist-run meter for the window with the 80% warning threshold (P14); deterministic workflows render no meter (unlimited by design). `getUsage`

**Edges**: filtered-empty declares itself (P01); >60 objective cards on the board virtualize lanes (P19); no-access surfaces → PERMISSION states, never "empty"; sample cycle cleared never returns (deterministic regeneration would surprise — 12 Q-14).
**Failures**: NETWORK mid-list → banner + retry (P20); usage read failure → "last known" degradation; cadence change with check-ins outside the new grid → the pre-change bucket renders honestly (07c rule 8).
**Recovery**: all lists cursor-paginated and re-fetchable; session locale switch re-renders without data loss.

## Non-happy paths

- **Assist capability unavailable (rung 4, 08 map)**: the composer renders the plain bilingual editor — pair columns, deterministic lint, metric block — and the assist affordance is absent (not disabled-mysterious); the entire CP-1…CP-5 flow completes (the 00 success signal).
- **No notification channel bound (LOOP-5)**: the cadence reaches participants through the in-app check-in desk, the return-state surfacing on app entry, and the digest's manual alternative (copy-the-link); nothing blocks.
- **First-run**: cycles home offers the seeded sample cycle — a fully-worked miniature cascade with check-ins, an at-risk KR, and a closed cycle with a grade sheet — so the whole ritual is experienceable before real work is entered (P22).
- **The restart team** (Layla's actual history — a failed earlier OKR attempt): the sample cycle and the honest overdue/at-risk zones demonstrate that missing check-ins are visible-but-survivable; the product never ambushes.
- **Offline**: reads work; check-in submits queue with per-item state (P20) and reconcile on return (async-contract §5).

## Failure → error mapping

VALIDATION (cycle dates/metric spans/required reasons/empty check-in values/state-machine gates) · NOT_FOUND (stale cycle/objective/KR/artifact links, expired artifacts) · PERMISSION (role boundaries — company-level authoring, other teams' objectives, capability consent) · CONFLICT (concurrent objective/KR/check-in edits via baseVersion) · RATE_LIMIT (assist draft runs, exports) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, CP-3.1, CP-6.1 | `submitCheckIn` | CP-3.3 |
| `listCycles` | CP-1.1, CP-6.1 | `getCheckIn` | CP-3.1 (prior-period context), CP-4.1 |
| `createCycle` | CP-1.2, CP-6.1 | `updateCheckIn` | CP-3.4 (correction) |
| `getCycle` | CP-1.2 (cadence preview), CP-5.1, CP-6.2 | `listCheckIns` | CP-3.5, CP-4.1 |
| `updateCycle` | CP-6.2 | `requestDraft` | CP-1.4 |
| `setCycleState` | CP-5.1 (start-grading), CP-5.3 (close) | `getDraftProposal` | CP-1.4 |
| `createObjective` | CP-1.3, CP-1.6 | `resolveDraftProposal` | CP-1.5 |
| `getObjective` | CP-1.7, CP-2.6, CP-3.6, CP-4.1 | `computeCycleGrades` | CP-5.2 |
| `listObjectives` | CP-1.6/7, CP-3.6 | `getGradeSheet` | CP-5.3 |
| `updateObjective` | CP-4.2 | `exportCycle` | CP-5.4 |
| `archiveObjective` | CP-4.4 | `getArtifact` | CP-5.5 |
| `createKeyResult` | CP-2.1 | `listTeams` | CP-1.6, CP-6.4 |
| `updateKeyResult` | CP-2.3, CP-4.3 (re-baseline) | `listMembers` | CP-2.1, CP-6.4 |
| `removeKeyResult` | CP-2.5 | `getCadence` | CP-1.2, CP-3.5, CP-6.3 |
| `listKeyResults` | CP-3.1 (my due KRs), CP-2.6 | `updateCadence` | CP-6.3 |
| `saveCheckInDraft` | CP-3.2 | `listJobs` | CP-5.4, CP-6.5 |
| `listActivity` | CP-4.5, CP-6.6 | `getUsage` | CP-1.4, CP-6.7 |

34 operations, 0 orphans (Critic-verified).
