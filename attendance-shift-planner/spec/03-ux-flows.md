# 03 — UX Flows: attendance-shift-planner

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation — no orphans. Terminology per 02: team · worker · qualification · shift · shift assignment · week plan · jurisdiction ruleset · rule · rule violation · waiver · publication · publication record · swap · publication gate · planning grid · violation inspector · Ramadan mode.

## CP-1 — Team, roster & ruleset → first authored week (value proof)

1. Fahad opens the workspace on first run: the teams home offers the value checklist (P22 — the parity moment for this product is *watching the inspector name a planted violation on the sample week*, so the sample team ships with a clopen and an overtime flag planted) and "Create team" beside it. `getSession` · `listTeams`
2. He creates the flagship team: name (ar/en both authored — "فرع الرياض — المتجر الرئيسي / Riyadh Flagship"), jurisdiction (`SA`), timezone, work-week start (Monday default, Saturday option for mall retail — 12 Q-10 records the cross-week edge semantics). `createTeam`
3. Roster entry — manual path always available, zero credentials (LOOP-5): add workers one-by-one (bilingual name, role title, weekly contract cap in hours, qualifications from the library, day-off preferences as unavailability windows) or paste a roster list (worker-per-line format per 07c). Paste is a Job with row-count progress; invalid rows named, valid rows retained (partial policy, async-contract §4). `importRoster` (paste) · `createWorker` (manual) · `listQualifications` · `listJobs`
4. Qualification library: stock entries seeded (cashier, food-safety supervisor, keyholder, barista — ar/en labels); he adds one bespoke ("fragrance-counter certified / معتمد عداد العطور") with the roles that require it. `saveQualification` · `listQualifications`
5. Ruleset selection: the ruleset picker lists stock rulesets — **KSA v1**, **UAE v1**, **custom** — each showing its rule values inline (max daily 8h, weekly 48h, rest 11h… — the values are the marketing, 00). He opens the KSA ruleset detail: every rule, its source note ("Saudi Labor Law — HRSD official text, captured 2026-10"), the capture date, and the "verify against current law" honesty line; he pins it to the team. `listJurisdictionRulesets` · `getJurisdictionRuleset` · `updateTeam` (ruleset binding, versioned)
6. He creates the week plan: team + week (navigator lands on the next unplanned week), seeded by copying the previous published week when one exists (07c seed ships the prior week for exactly this), or from blank. The grid renders: roster rail (virtualized worker rows) inline-start, day columns Mon–Sun, violation inspector inline-end. `createWeekPlan` · `listWeekPlans` · `getWeekPlan`
7. Authoring the grid: he places a shift block in a cell (role, start/end time, break minutes, required qualification, headcount), then assigns workers to it — from the cell's assign menu (filtered to qualified, available workers) or by dragging a worker chip from the rail (drag has a full keyboard equivalent — 2.5.7, 09). Each placement re-runs the live check for that worker (≤120ms budget, 10) and the inspector updates. `upsertShift` · `placeAssignment` · `updateAssignment` · `removeAssignment` · `removeShift`

**Edges**: shift crossing midnight (end < start on the entry dialog is explicit — the block renders spanning into the next day's cell edge with the overflow visually marked; rest-gap arithmetic accounts for it); a worker with a contract cap tighter than the ruleset (engine enforces the *stricter* of the two, 07c rule 2); paste rows with a role title not yet in the library (created as draft roles, flagged for review — never dropped); two workers with identical nicknames (roster rows disambiguate by worker code, Western numerals); empty team attempting a week plan (VALIDATION — a plan needs at least one active worker); day-off preference vs coverage need (preference is advisory — the inspector never treats it as a violation, only as a roster-rail mark).
**Failures**: malformed paste row → VALIDATION naming the row, prior rows retained; stale team version on ruleset binding (another seat edited the team) → CONFLICT both payloads; roster paste quota (P14) → RATE_LIMIT ladder notice; NETWORK mid-list → banner + retry, local grid state safe (P20).
**Recovery**: teams, workers, and qualifications persist across sessions; week plans are re-openable at any draft state; the sample team is clearable and never returns after clearing (12 Q-13).

## CP-2 — Guardrail violation resolution loop (the daily loop)

1. Mariam opens the draft week; the violation inspector lists current violations — blocking first (rest gap, daily/weekly max, qualification missing, unavailability, consecutive days, Ramadan cap, max-incl-overtime), then warnings (overtime thresholds, night-window, weekly rest advisory). Each row: rule name (fixed terminology), measured vs required values in Western numerals, worker + day jump link, and the ruleset version it was computed against. `listRuleViolations` · `getWeekPlan`
2. She jumps to the first blocker — the inspector row links to the offending cell(s); focus lands in the grid at the assignment, both cells named when a rule spans a pair (the clopen's Sunday close and Monday open). She resolves by editing: moves the Monday open to another worker via the cell's assign menu — the live recheck dissolves the violation (crisp 140ms chip dissolve + polite announcement, 05/09) and computes any *new* violations the move created (the engine never hides second-order effects). `updateAssignment` · `placeAssignment`
3. A violation she cannot edit away (Friday needs a food-safety supervisor and only one exists; the swap would break his weekly cap): she **waives with a reason** — dialog requiring the reason text, showing the rule, the values, and the blast radius ("waived for this week only; re-computed if the plan changes"); the waiver is recorded with actor + timestamp and renders as a persistent amber ribbon on the cell and a resolved-with-waiver row in the inspector. `waiveRuleViolation`
4. Overtime warnings do not block: she reads the weekly-threshold row ("Overtime threshold: 48h weekly cap — 7 workers over, 17h 30m of overtime between them"), opens the per-worker breakdown, and rebalances or accepts — accepted warnings travel into the publication record as listed advisories (CP-3.3). `listRuleViolations` (filter warning)
5. Full re-scan at will (she edited 20 cells and wants a clean pass): a Job with determinate per-worker progress ("Checking worker 34 of 46 — Riyadh Flagship, KSA v1"); identical draft state always yields identical findings (determinism contract, 07c). `runGuardrailCheck` · `listJobs`
6. Cross-week edges: the engine evaluates rest gaps and consecutive days across the week boundary using the *previous published plan* (a Sunday close colliding with this Monday open is caught — the seed plants exactly this, 07c); if no previous plan exists, boundary rules evaluate what exists and the inspector says so honestly ("Week-edge check limited: no published prior week found"). `getWeekPlan` (prior-week read)

**Edges**: a violation whose underlying rule was edited in the ruleset after computation (finding pins the ruleset version; re-scan enforces the new one — audit honesty, 07a); two seats editing the same cell → CONFLICT with both payloads; a waived violation whose plan edits make the rule pass (waiver auto-resolves, the record stays); a blocking violation on an assignment removed entirely (violation recomputes away, never lingers as ghost); grid at 400% zoom / narrow widths — cells reflow to per-worker stacked strips for reading, violations re-anchor (09).
**Failures**: waive without a reason → VALIDATION; waive an already-waived violation (another seat) → CONFLICT current state shown; live recheck on a stale draft revision → CONFLICT; NETWORK during scan → banner, partial findings marked, retry continues from where the job stopped (async-contract §4).
**Recovery**: every grid mutation is versioned on the week plan; violations are recomputed from draft state — a failed scan never mutates the plan; waivers are records, never silent state.

## CP-3 — Publish the week → gate → notification & export handoff

1. Mariam hits **Publish** on the finished draft. The publication gate reads live state — blocking violations standing, unassigned required shifts (coverage holes on shifts with headcount > assignments), and unreviewed rule warnings. The gate REFUSES while any blocker stands; the refusal names them with jump links, never a generic "not ready" (P04 discipline at plan scale). `getWeekPlan` (gate state) · `listRuleViolations`
2. She clears blockers (edit or waive — CP-2 grammar); the gate status updates live (≤120ms, derived read, 10).
3. Publish executes: the week plan status flips to `published`, a **PublicationRecord** is written — actor, timestamp, ruleset + version enforced, the full violation resolution ledger (waivers with reasons, accepted warnings), and the change summary against the previous publication of that week ("12 assignments changed, 3 workers added vs Sunday's publication"). The T2 signature micro-interaction "The Week Seals" plays once, here (05 motion). Post-publication edits to the same week create a new pending amendment state — the old publication stays immutable. `publishWeekPlan`
4. Export the schedule: format bundle — **team grid** (printable week view), **worker views** (per-worker weekly slips, bilingual, Western numerals), and the **marketplace-compatible export** (the published plan in the format shift-swap-marketplace and any external system can ingest — 08 N1; format is a declared artifact schema, not a provider binding). A Job with expiry + regeneration; quota shown before running (P14). Manual handoff is the default: download/copy/print. `exportSchedule` · `getArtifact` · `getUsage`
5. Notification: workers and supervisors are notified the plan is live — through the abstract notification channel when bound (kind, not vendor — credential-contract §2), otherwise the manual alternative: the export artifacts + a shareable in-workspace published-plan view (the review surface, 04). Notification tiers per class under P21 (publication = instant class; amendment = instant; waiver summaries = digest). `listJobs` (delivery job state)
6. Return state: on app re-entry, the teams home surfaces recently published weeks and any amendment awaiting attention — never orphaned in a notification center (async-contract §6). `listWeekPlans` · `getSession`

**Edges**: publishing with warnings open (allowed — warnings are advisory by definition and are listed in the publication record, exactly like accepted-length-overflows in the portfolio's review-gate grammar); publishing over a week already published (creates the amendment path — CP-4 uses this); export of a week published before a ruleset edit (the artifact carries the ruleset version enforced at publication, and flags the newer ruleset version — honesty at handoff); artifact expiry → NOT_FOUND with regenerate (plan state unchanged — regeneration is deterministic); shift with headcount shortfall at publish (gate blocker: "Coverage: Friday dinner requires 4, 3 assigned").
**Failures**: export quota → RATE_LIMIT ladder with reset time; export failure mid-bundle → per-format partial with per-format retry (async-contract §4); NETWORK during delivery → retry, artifact held; publication with stale plan version (concurrent seat published first) → CONFLICT with both publication records.
**Recovery**: publication records are immutable; exports regenerate from plan state at any time; the jobs console reconciles after reconnect (async-contract §5).

## CP-4 — Swap-aware re-plan when agreed swaps return (the boundary flow)

1. During the published week, a swap is agreed externally — in shift-swap-marketplace (the group adopted it; boundary: that product negotiated and matched the swap, 12 Q-4), or verbally on the floor with Salem's approval. The swap lands in this product through one of three paths, all first-class: **paste a swap set** (marketplace export format or a hand-typed list), **import from the change channel** when the capability is bound (08 N2), or **record a single swap manually**. `importSwapSet` (paste/channel) · `recordExternalSwap` (single)
2. Salem records the Thursday swap: from the published week view he picks the assignment, chooses "Record agreed swap", selects the receiving worker, adds the agreed-at time and a note ("agreed on floor, Tuesday huddle"). One minute, phone-sized (responsive review surface, 00). `recordExternalSwap`
3. The re-validation runs immediately and names second-order effects: the swap fixed Thursday's coverage but the receiving worker now has a 6-hour rest gap into Friday's open and crossed the weekly threshold — the amendment inspector lists **new** violations with measured-vs-required values, marked `introduced-by-swap` with provenance (from-worker, to-worker, agreed-at, source). The amendment is a pending state on the published week; the published plan stays authoritative until the amendment publishes. `listRuleViolations` (amendment-scoped) · `getWeekPlan`
4. Resolve the new blockers with the same grammar (edit surrounding cells or waive with reason — "both workers agreed; branch manager approved"), then **publish the amendment**: a new PublicationRecord with change summary ("1 swap applied — Amal → Noura, Thu evening; 1 waiver added") and the swap provenance ledger. The plan view marks swapped assignments with a teal swap glyph + provenance tooltip (icon + text, never glyph alone). `waiveRuleViolation` · `publishWeekPlan` · `getPublicationRecord`
5. Bulk path for marketplace weeks: paste/import a swap set (one-to-many swaps); a Job applies them in order, determinate per-swap progress, each application re-checked; conflicting swaps in one set (two swaps touch the same assignment) → VALIDATION naming both, earlier rows applied, later rows skipped and named (partial policy). `importSwapSet` · `listJobs`

**Edges**: a swap whose receiving worker lacks the shift's qualification (qualification rule fires — blocking, exactly as authored-time placement); a swap recorded against a week that was superseded by a newer publication (CONFLICT — re-record against the live publication); swap on an assignment inside a waived rule's blast radius (re-computed honestly, the waiver record stays); swap set pasted in the marketplace format but for a different week (VALIDATION naming week start dates, nothing applied); recording a swap where from-worker ≠ current assignee (VALIDATION naming the current assignee).
**Failures**: change-channel capability unconsented → PERMISSION in capability language with the paste path offered inline (credential-contract §4); NETWORK mid-import → typed error, applied-so-far retained; quota → RATE_LIMIT ladder.
**Recovery**: swaps are provenance-annotated assignments, never silent overwrites; every amendment is a publication record; the marketplace never writes into this product — all paths end in a human confirm (P15 discipline carried structurally, 08).

## CP-5 — Ruleset inspection, change & Ramadan mode (the guardrail's own lifecycle)

1. Amal opens the ruleset library: stock KSA v1 and UAE v1 (inspectable, read-only — versions matter for audits), workspace custom rulesets (editable, versioned). The detail view lists every rule with value, unit, severity class, and source note; the "verify against current law" honesty line renders on every stock ruleset — the product is a rules engine, not a law firm (12 Q-9). `listJurisdictionRulesets` · `getJurisdictionRuleset`
2. She clones KSA v1 into a custom ruleset ("KSA — company conservative") and tightens the rest period (11h ruleset default → 12h company policy) — the editor validates rule sanity (rest ≥ 0, daily ≤ weekly/5-class checks per 07c), saves at a new version, and the change log records actor + reason. `saveCustomRuleset` · `validateRuleset`
3. Ramadan mode: the ruleset carries a Ramadan window (start/end dates, reduced daily/weekly caps, applies-to scope from the ruleset's config — modeled as data because scope is genuinely contested, 01 legaladviceme evidence). When the week navigator's week intersects the configured window, the grid header renders the Ramadan banner (dual Hijri/Gregorian dates, brass accent — 05), the reduced caps take force in the engine, and violations against the reduced caps name the Ramadan rule explicitly. Amal sets the window dates once; every week inside them plans under the reduced caps automatically. `saveCustomRuleset` (window config) · `getWeekPlan` (mode state)
4. Mid-cycle ruleset change: a published week's team ruleset is re-bound to a newer version (e.g. UAE v1 → UAE v2 after a capture update). The product surfaces the consequence honestly — published weeks keep the version they were published under (immutability); the current draft re-validates against the new version and the inspector lists rules that changed outcome ("2 violations changed: rest gap now passes — UAE v2 rest 10h"); the change is logged. Teams with published weeks under an older ruleset show a version-drift mark in the teams home. `updateTeam` · `runGuardrailCheck` · `listTeams`
5. Qualification lifecycle: deprecate an obsolete qualification (checks stop, history stays); required-by roles update on next draft validation. `deprecateQualification` · `listQualifications`

**Edges**: custom ruleset with impossible values (min rest > 24h) → VALIDATION at save with the field named; two teams in one workspace on different rulesets (KSA branch + UAE hub — the mixed-company reality, 02 Amal; ruleset is team-scoped, drift marks per team); Ramadan window overlapping a week boundary (week intersecting the window start applies reduced caps only to in-window days — 07c rule 7 computes per-day); no delete path for custom rulesets at v1 — saved versions are immutable audit history, and a team re-binds away via `updateTeam` while the unbound ruleset stays in the library, read-only; stock rulesets never editable (clone-to-custom is the only path — audit integrity).
**Failures**: stale baseVersion on ruleset save → CONFLICT both kept; validate on an incoherent rule set → VALIDATION with per-rule issues.
**Recovery**: ruleset versions are immutable once saved; every violation pins the version it was computed against; no rule change ever mutates a published week.

## Non-happy paths

- **No teams yet** (first-run): the teams home offers the sample team + sample week with planted violations — a clopen across the week boundary and a weekly-threshold warning — so the P22 value moment (watch the inspector name a rule) lands before any real data exists. `createTeam` skipped — sample ships read-to-explore, clearable, never returns (12 Q-13). `listTeams`
- **Ruleset honesty** (any time): every stock ruleset detail carries capture date + source + "verify against current law" — an ops manager trusting the numbers without knowing their provenance date is the failure this copy prevents (00/05).
- **Swap channel unbound** (LOOP-5): paste + manual record are the primary paths from day one; the change channel renders as optional with its consent surface, never a wall (08 N2).
- **Offline**: grid reads and published-plan views work; authoring mutations queue locally with per-item state and re-validate on reconnect (determinism makes offline safe — same draft state, same findings, 07c; P20).
- **Worker-facing narrow viewport**: published week per worker, day coverage, violation summaries — review only, no authoring (00 surface; 04 mobile modes).

## Failure → error mapping

VALIDATION (malformed roster/swap paste rows, ruleset sanity, waive-without-reason, gate attempts with blockers, conflicting swap sets, coverage shortfall at publish) · NOT_FOUND (stale team/worker/plan/ruleset/artifact links, expired artifacts) · PERMISSION (capability consent, workspace scoping, viewer-role mutations) · CONFLICT (concurrent cell/plan/team/ruleset edits, superseded publication on swap record, already-waived findings) · RATE_LIMIT (guardrail scans, roster paste, swap-set imports, exports) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.1, CP-3.6 |
| `listTeams` | CP-1.1, CP-5.4 (drift marks), non-happy first-run |
| `getTeam` | CP-1.5 (ruleset binding read), CP-5.4 |
| `createTeam` | CP-1.2 |
| `updateTeam` | CP-1.5 (ruleset bind), CP-5.4 (re-bind) |
| `listWorkers` | CP-1.3 (roster list), CP-1.7 (assign menu filter) |
| `createWorker` | CP-1.3 (manual path) |
| `importRoster` | CP-1.3 (roster paste Job) |
| `updateWorker` | CP-1.3 (contract caps, unavailability edits), roster rail edits |
| `listQualifications` | CP-1.3, CP-1.4, CP-5.5 |
| `saveQualification` | CP-1.4 |
| `deprecateQualification` | CP-5.5 |
| `listJurisdictionRulesets` | CP-1.5, CP-5.1 |
| `getJurisdictionRuleset` | CP-1.5, CP-5.1 |
| `saveCustomRuleset` | CP-5.2, CP-5.3 (Ramadan window) |
| `validateRuleset` | CP-5.2 |
| `listWeekPlans` | CP-1.6, CP-3.6 (return state), teams home |
| `createWeekPlan` | CP-1.6 (blank / copy-prior) |
| `getWeekPlan` | CP-1.6, CP-2.1, CP-2.6 (prior-week edge), CP-3.1 (gate), CP-4.3 |
| `upsertShift` | CP-1.7 |
| `removeShift` | CP-1.7 |
| `placeAssignment` | CP-1.7, CP-2.2 |
| `updateAssignment` | CP-1.7 (move/stretch), CP-2.2, CP-4.4 (edit-around-swap) |
| `removeAssignment` | CP-1.7, CP-2 (edge: removal recomputes) |
| `runGuardrailCheck` | CP-2.5, CP-5.4 (post-re-bind re-validation) |
| `listRuleViolations` | CP-2.1, CP-2.4, CP-3.1, CP-4.3 |
| `waiveRuleViolation` | CP-2.3, CP-4.4 |
| `publishWeekPlan` | CP-3.3, CP-4.4 (amendment) |
| `getPublicationRecord` | CP-4.4, CP-3.3 (ledger read), S5 publication detail (04) |
| `exportSchedule` | CP-3.4 |
| `getArtifact` | CP-3.4 |
| `recordExternalSwap` | CP-4.2 |
| `importSwapSet` | CP-4.1, CP-4.5 |
| `listJobs` | CP-1.3, CP-2.5, CP-3.4–5, CP-4.5, S7 jobs center (04) |
| `getUsage` | CP-3.4 (pre-export quota), S8 settings (04) |

35 operations, 0 orphans (Critic-verified — the table above lists every 07b operation exactly once).
