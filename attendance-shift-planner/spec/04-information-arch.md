# 04 — Information Architecture: attendance-shift-planner

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Teams** (teams home — the workspace's first screen) · **Planner** (the week grid for the selected team — the core surface) · **Rulesets** · **Publications** (publication & export history incl. amendments) · **Swaps** (swap log / change provenance) · **Queue** (jobs center) · **Settings.** The planner is a team-scoped mode: team selector lives inside the planner header, and the week navigator, roster rail, grid, and violation inspector bind to it — one team, one week, one ruleset on screen at a time (the IA refuses the multi-team mosaic; multi-branch managers work branch-by-branch the way they actually plan, 02 Fahad). Two-level IA: section → item; the planner = team detail in week mode. ⌘K command palette (P05, T2 mandate) reaches teams, workers, week plans, rulesets, qualifications, and jump-to-worker-row inside an open grid (normalized bilingual search, rtl-rules §4).

## Entity overview (07a for full shapes)

**Workspace** → owns **Teams**. A **Team** (bilingual name, jurisdiction, timezone, work-week start) → binds a **JurisdictionRuleset** (versioned; stock SA/AE read-only or custom editable; rules: working-time caps, rest minimums, consecutive-day maxima, overtime thresholds, night window, Ramadan window) → contains **Workers** (bilingual name, role, contract caps, **Qualifications**, unavailability windows) and **WeekPlans**. A **WeekPlan** (team + week start; status draft/published/pending-amendment; pins the ruleset version) → contains **Shifts** (day, role, times, break, required qualification, headcount) and **ShiftAssignments** (worker ↔ shift, provenance: authored or external-swap with from/to/agreed-at). The deterministic rule engine produces **RuleViolations** (rule key, measured vs required, severity blocking/warning, state open/resolved/waived, waiver with actor+reason) — blocking violations gate **Publication**; **PublicationRecords** (immutable; resolution ledger, change summary, swap provenance) produce **ExportArtifacts** (team grid, worker views, marketplace-compatible format). **Job** (async: roster import, scans, exports, swap-set imports), **ActivityEntry** (P17), **Session** (auth-agnostic).

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Teams home | teams list w/ ruleset + drift marks, onboarding checklist (P22), recent publications, amendment-attention | listTeams, listWeekPlans, getSession |
| S2 | Team & roster | team settings (jurisdiction, ruleset binding, work-week start), worker list + editor, qualification library entry | getTeam, updateTeam, listWorkers, createWorker, importRoster, updateWorker, listQualifications, saveQualification |
| S3 | **Planner (week grid)** | the core surface: week navigator + ruleset badge + Ramadan banner · roster rail · planning grid · violation inspector (CP-1/2) | getWeekPlan, listWorkers, upsertShift, removeShift, placeAssignment, updateAssignment, removeAssignment, listRuleViolations, waiveRuleViolation |
| S4 | Ruleset library | stock + custom rulesets, rule values with sources & capture dates, version history, Ramadan window config | listJurisdictionRulesets, getJurisdictionRuleset, saveCustomRuleset, validateRuleset |
| S5 | Publication & export | gate state, publication records incl. amendments, waiver ledger, export bundles + artifacts | publishWeekPlan, getPublicationRecord, exportSchedule, getArtifact, getUsage |
| S6 | Swap log | change provenance: recorded/imported swaps, introduced-by-swap violations, amendment state | recordExternalSwap, importSwapSet, listRuleViolations, getWeekPlan |
| S7 | Jobs center | roster imports, scans, exports, swap imports — filterable state, link-to-context, per-job detail with progress history (async-contract §7); failed-item retry is an idempotent re-submit of the failed scope through the same operation (async-contract §4/§5) | listJobs |
| S8 | Settings | workspace locale default, numeral display (informational — Western per ledger), capability consent (kind-not-vendor), usage window | getSession, getUsage |
| S9 | Worker review view | published week per worker (mobile/narrow first-class; desktop link-share) | getWeekPlan, listRuleViolations (summary) |

Mobile (≤767px): S9 is the worker/supervisor surface (published week, day coverage, violation summary read-only; CP-4.2 single swap recording is the one write path); S1/S5/S6 read/report modes. S3 grid authoring is desktop/tablet only (00 surface); S2/S4/S7/S8 desktop/tablet. Every screen states its filters (P08) and its four empties per P01 (11 matrix).

## Per-screen state obligations

First-run (S1 offers the sample team + sample week — planted clopen + overtime flag is the product's value proof, CP-1.1); skeletons mirror final geometry per direction (P02, RTL skeletons flip — the grid's day columns mirror, the roster rail mirrors, worker names render at their own direction); errors per 03 mapping; copy matrix in 11.

## IA decisions and rationale

- **One team, one week, one ruleset on screen**: the guardrail story collapses if the grid mixes jurisdictions; multi-branch managers work sequentially (02 Fahad), and the teams-home drift marks carry the cross-team state (ruleset versions, pending amendments) between visits.
- **The violation inspector is a permanent rail, not a report**: violations resolve by *editing the grid* (CP-2) — an inspector detached from the cells is exactly the after-the-fact report posture this product replaces (01 positioning vs QA-report tools).
- **Rulesets get their own top-level section (S4)**: the differentiator is inspectable rules with sources and versions — burying them in settings would hide the product's answer (02 Amal reads them before trusting them).
- **Swaps get a dedicated log (S6)**: provenance (from/to/agreed-at/source) is the boundary artifact with shift-swap-marketplace — it deserves an auditable surface, not a changelog footnote (12 Q-4).
- **Worker review is a first-class screen (S9), not a mobile afterthought**: "who's on tonight" is the most-asked question on the floor (02 Salem); the mobile review surface is where the workforce *feels* the product without ever being asked to author.
- **Queue (S7) is small but first-class**: imports, scans, exports, and swap-set applications are the product's async Jobs (async-contract §7).
