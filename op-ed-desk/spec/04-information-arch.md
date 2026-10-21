# 04 — Information Architecture: op-ed-desk

## Navigation model

Desk top rail: **الفرز Triage queue** (home) · **الجولات Rounds** · **الملفات Files** (contributors) · **النشاط Activity** (log + jobs) · **الإعدادات Desk policy**. Submission detail, blind workspace, and decision composer are modes of a submission view reached from the queue. ⌘K palette (P05 — list surfaces exceed three) reaches submissions, contributors, rounds, settings, with normalized bilingual search. Two levels only.

Contributor surface is a separate lightweight route — **submit** (form) and **status** (code lookup): no rail, no account, 360px-first.

## Entity overview

Submission (immutable text + disclosures + status) · ReviewRound · AnonymizedView (versioned) · StyleLintReport/Finding · ContributorProfile · DecisionRecord · Job (lint) · ActivityEntry (P17). Contracts in 07a.

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Triage queue | desk home: arrivals, SLA, filters, bulk | listSubmissions |
| S2 | Submission detail | full editor view: text, identity, lint sidebar, history, triage | getSubmission, getLintReport, updateFinding, updateTriage, getContributor |
| S3 | Blind workspace | reviewer view: anonymized text, findings, recommendation, integrity confirm | getAnonymizedView, getLintReport, submitReview, flagAnonymizationLeak |
| S4 | Round board | rounds in flight, overdue, reassignment, override entry | listSubmissions (rounds filter), openReviewRound, reassignReviewer |
| S5 | Decision composer | decision + structured letter + send | recordDecision, sendDecision |
| S6 | Contributor files | search + history (editor-only) | listContributors, getContributor |
| S7 | Activity & jobs | P17 log, lint jobs, usage | listJobs, getUsage |
| S8 | Desk policy | word band, rules, cliché list, SLA, anonymization | getSession + workspace ops |
| S9 | Contributor surface | intake form + status check | submitDraft, getSubmissionStatus |

Mobile (≤767px): S9 full function; S1 glance read-only; S2–S8 desktop-first (00).

## Per-screen state obligations

Four empties per P01 (S1 first-run honest + form link + sample piece; S6 teaches value; filtered-empty resets). Skeletons mirror ruled rows including direction (P02). Errors per 03 mapping; copy of record in 11.

## IA decisions and rationale

- **The queue is the product**: everything is reached from S1 — an inbox replacement, not a publication tool.
- **Blind workspace is a separate screen, not a toggle**: identity scoping is structural (PERMISSION at adapter level) — a reviewer cannot accidentally land in a full view; the IA enforces the anonymization promise.
- **Decision composer is the trust checkpoint** (P15): round digest + findings digest + letter in one view; override rationale required on splits.
- **Contributor surface is accountless by design** (00): the reference code is the only credential — no login wall on that route.
