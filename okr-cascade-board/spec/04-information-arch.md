# 04 — Information Architecture: okr-cascade-board

## Navigation model

Left rail: **Cycles** (home) · **Check-in desk** · **Cadence dashboard** · **Activity & jobs** · **Settings**. The cycle board is entered from Cycles home — one active cycle is the workspace's center of gravity, and the rail shows the active cycle's name under Cycles for one-click return. Inside a cycle, the board, objective detail, and grading console are the object graph (board → objective → KR/check-in), never rail siblings — the cascade is one navigational object, not five screens that happen to share data. ⌘K palette (P05 — list surfaces exceed three) reaches cycles, objectives (bilingual normalized search — alef variants, taa marbuta, yaa forms per rtl-rules §4), members, and jobs. Two-level IA: section → item. Desktop-first (≥1280px); ≤767px: board and dashboard read-only, check-in desk fully functional (the participant path), objective detail read-optimized with pair editor deferred to desktop (participant mode is read+check-in, not authoring).

## Entity overview (07a for full shapes)

Workspace → Cadence (config) → Cycle (quarter) → Objectives (company level, team level; team objectives link to 0..N parents via alignment links) → KeyResults (metric: baseline/target/unit/direction; single owner; weight) → CheckIns (per KR per period: current value, confidence 1–5, blockers, help-needed; draft → submitted; corrections keep revisions). GradeSheet (immutable snapshot at close), DraftProposals (assist artifacts, P15-gated), Jobs (draft runs, exports), Activity entries, Teams, Members.

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Cycles home | cycle list with state chips and rollups; first-run sample-cycle offer; onboarding checklist (P22) | listCycles, createCycle, getSession |
| S2 | Cascade board (cycle workspace) | the core surface: company tier, team lanes, alignment edges, objective cards with rollups and confidence, alignment warnings in place | listObjectives, getObjective, getCycle |
| S3 | Objective detail | bilingual pair editor with lint + assist panel; KR list (metric bars, owners); alignment links; check-in history per KR | getObjective, createObjective, updateObjective, archiveObjective, createKeyResult, updateKeyResult, removeKeyResult, requestDraft, getDraftProposal, resolveDraftProposal, listMembers |
| S4 | Check-in desk (participant) | my due check-ins this period: metric context, last value, structured form (value, confidence, blockers, help-needed); autosave; corrections | listKeyResults, getCheckIn, saveCheckInDraft, submitCheckIn, updateCheckIn |
| S5 | Cadence dashboard | KR × period coverage grid; overdue zone; at-risk zone with named triggers; blocker digest; on-behalf provenance marks | listCheckIns, getCadence, listKeyResults |
| S6 | Grading console | close gate, grade computation, grade sheet with formulas and thresholds, unreported/archived disclosure, export | getCycle, setCycleState, computeCycleGrades, getGradeSheet, exportCycle |
| S7 | Artifacts & jobs console | export artifacts with expiry/renewal; assist draft jobs; cancel/retry; link-to-context (T3-consolidated activity+jobs split view) | listJobs, getArtifact, listActivity |
| S8 | Activity log | every consequential mutation, filterable by cycle/entity; exportable discipline | listActivity |
| S9 | Settings | cadence (frequency, due day/time, live period-grid preview), capability consents (assist, notification, directory), usage meter, teams & members | getCadence, updateCadence, listTeams, listMembers, getSession, getUsage |
| S10 | Command palette (overlay) | bilingual normalized search across cycles/objectives/members/jobs | client-side over S1/S2/S9 data |

## Workspace & permission structure

Roles (auth-agnostic, 07b Session): **admin** (strategy lead / PMO — everything: cycles, company objectives, grading, cadence, settings); **lead** (team lead — own team's objectives and KRs, check-ins on own behalf or on-behalf, board read everywhere); **member** (KR owner — check-in desk, read the objectives their KRs live in, sample cycle; no authoring). Permission fences: company-level objective authoring = admin; grading and cycle state = admin; cadence change = admin; other teams' objectives = read-only for leads and members (PERMISSION surfaces, never hidden-empty — P01 no-access). The check-in desk is deliberately the member's entire world: a member who owns KRs never needs another surface to do their part (02 Tariq).

## Per-screen state obligations

Four empties per P01 everywhere (S1 first-run offers the sample cycle; S2 board-empty distinguishes no-objectives-yet from filtered; S4 desk-empty distinguishes no-due-check-ins (a calm, good state) from no-owned-KRs; S5 coverage-empty states the cycle has no KR with a period yet). Skeletons mirror final geometry per direction (P02) — the board's tier/lane skeleton is direction-aware (team lanes flow inline-start in RTL). The assist panel's region is size-reserved before streaming (CLS budget, 10). Full copy matrix in 11.

## IA decisions and rationale

- **The cascade is one screen, not a tree browser**: leadership reads the quarter in one view (00); drill-in happens through objective detail, and the palette — not a nested tree IA — is the fast path (P05). Lane virtualization (P19) keeps a 60-objective cycle on one board.
- **Check-in desk is a rail sibling, not buried in objective detail**: the participant's job is a queue, not navigation (02 Tariq); the desk is reachable from a digest link with zero board context required.
- **Cadence dashboard is first-class**: coverage, overdue, and at-risk are the leadership surface (00) — the ritual's honesty lives here, not inside per-user detail pages.
- **Grading console owns cycle end-state**: the close gate, the deterministic sheet, and export in one place keeps the state machine legible (state changes are consequential and gated, 03 CP-5).
- **Jobs & activity consolidated with split views (T3 posture)**: per async-contract §7, Tier 3 may consolidate; S7 carries jobs + artifacts, S8 the activity ledger — two views of one accountability story.
- **Settings carries capability language only**: consent surfaces speak capability classes (credential-contract §2 — kind, not vendor); the usage meter renders assist runs only; deterministic workflows never render a meter (unlimited by design, 06).
