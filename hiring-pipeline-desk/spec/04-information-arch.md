# 04 — Information Architecture: hiring-pipeline-desk

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Openings** (list home) · **Pipeline** (the board for the active opening — the workspace remembers the last-opened opening per session, P11) · **Candidates** (directory) · **Interviews** (cross-opening list, role-scoped "mine" default for interviewer seats) · **Kit** (studio for the active opening) · **Queue** (jobs center) · **Activity** (log) · **Settings.** Two-level IA: section → item; the board, kit studio, application detail, and debrief are modes/items under the active opening. ⌘K command palette (P05, T2 mandate) reaches openings, candidates (normalized bilingual name search), applications, interviews, and jump-to-stage within the open board.

## Entity overview (07a for full shapes)

**Workspace** → owns **Members** (owner / recruiter / hiring-manager / interviewer roles) and the default **StageTemplate**. **Opening** (bilingual title pair, status, stage set frozen at creation, version) → carries one **InterviewKit** (4–6 competencies, weights summing 100, questions per competency × per language, version) → **Applications** (candidate × opening, current stage, stage history, source, notes chain) → **Interviews** (round, language, interviewers, state) → **Scorecards** (interviewer × interview, anchored ratings + evidence + recommendation, sealed-until-submitted, version) → deterministic **BiasNudges** (evidence-thin / trait-language / rating-divergence, with resolution lifecycle) → **Decisions** (advance / reject / hold + rationale, pinned debrief snapshot). **Candidate** (name pair Latin/Arabic, contact) stands alone, referenced by applications. **AsyncJob** (import/export/assist), **ExportArtifact**, **ActivityEntry** (P17), **Session** (auth-agnostic).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Openings home | openings list, filters + saved views (P08), status chips, onboarding checklist (P22) | listOpenings, getSession |
| S2 | **Pipeline board** | the core surface — stage columns, bilingual candidate cards, drag + keyboard moves, bulk bar, anonymized-screening render | listApplications, getOpening, moveApplication, updateApplication, createApplication |
| S3 | Application detail | timeline (moves, notes), interviews with languages, decisions, rejection reason | getApplication, listInterviews, listScorecards, listNudges |
| S4 | **Kit studio** | bilingual competencies + weights, questions per language, coverage meters, assist panel (template bank native) | getKit, saveKit, proposeKitQuestions, getUsage |
| S5 | Interview detail + scorecard | the interviewer's surface: questions in the interview's language, the anchored card, nudges | getInterview, getScorecard, saveScorecard, submitScorecard, listNudges, resolveNudge, updateInterview |
| S6 | **Debrief console** | readiness state, sealed/unsealed cards, weighted means, recommendation tally, divergence marks, decision record | getDebrief, listScorecards, listNudges, recordDecision |
| S7 | Candidates directory | cross-opening candidate search (normalized bilingual), name-pair display, edit | listCandidates, createCandidate, updateCandidate, importCandidates |
| S8 | Interviews list | upcoming/past across openings, language chips, "mine" for interviewer seats | listInterviews, scheduleInterview |
| S9 | Jobs center | imports/exports, cancel/retry, link-to-context (async-contract §7) | listAsyncJobs, getArtifact |
| S10 | Activity log + Settings | the accountability surface (filterable P17) + stage template, anonymized toggle, consents, usage | listActivity, getSession, getUsage, updateOpening (row-menu status from S1) |

Mobile (≤767px): S1, S3, S6, S8, S10 read modes; **S5 scorecard completion is first-class mobile** (the between-meetings scenario, 02 Dalal); S2 renders read-only stage lists per stage (authoring moves are desktop/tablet — the drag surface); S4/S7 read-only. Every screen states its filters (P08) and its four empties per P01 (11 matrix).

## Permission structure (role table, enforced at 07b)

- **owner** (Yasmin-class): everything, plus capability consents and settings.
- **recruiter** (Hessa-class): everything except consents; the pipeline's operator.
- **hiring_manager** (Tarek-class): board read + move for their openings' applications, decision recording, debrief read (post-independence), no kit authoring, no candidate-directory writes.
- **interviewer** (Dalal-class): board read, their interviews, their scorecards (own writes), nudges on their own card, debrief withheld until their card is in (the seal is enforced at the data layer, not by hiding a tab).

The independence seal is a **data-layer rule**, not a UI courtesy: `listScorecards`/`getDebrief` filter by submitted-own-card state server-side (07b rule 5); an interviewer's direct fetch of a peer's sealed card → PERMISSION ("Scorecards are sealed until you submit yours").

## Per-screen state obligations

First-run (S1 offers the sample opening — the planted thin-evidence extreme rating is the product's value proof, P22); skeletons mirror final geometry per direction (P02 — RTL skeletons flip); errors per 03 mapping; copy matrix in 11.

## IA decisions and rationale

- **The board binds to one opening at a time**: a 1–3 recruiter team runs one search at a time; cross-opening Kanban would manufacture a view nobody asked for (and the openings home is the cross-opening surface).
- **Kit studio is a first-class screen, not a tab on the opening**: the bilingual kit is the product's unique artifact — 4–6 weighted competencies, per-language question banks, coverage meters — it deserves authoring focus and it is where the assist lives (the only AI surface, visibly fenced).
- **Debrief gets its own console (S6)**: the independence seal, the withheld means, the divergence marks, and the decision gate are the governance heart (02 Yasmin's audit answer); burying them in the application detail would bury the product's answer.
- **Scorecards live inside interview detail (S5), never in a settings-shaped form**: the card is work product tied to a specific conversation — language, round, interviewers — and the mobile-first card surface follows the interviewer's real day (02 Dalal).
- **Interviews list is role-scoped ("mine" default)**: interviewers land on their own commitments; recruiters see all. One list surface, one scoping rule (07b role table).
- **Queue (S9) is small but first-class**: imports, exports, and assist generations are the product's async Jobs (async-contract §7); Tier 2 gives it dedicated IA.
