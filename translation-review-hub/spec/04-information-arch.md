# 04 — Information Architecture: translation-review-hub

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Jobs** (review-jobs home) · **Workspace** (current review job → its documents, findings console, sign-off) · **Glossaries** · **Queue** (jobs center) · **Settings.** The review workspace itself is a document-mode of Workspace: three-region layout (segment navigator inline-start · side-by-side pair view center · findings rail inline-end). Two-level IA: section → item; the review workspace = document detail with segment context. ⌘K command palette (P05, T2 mandate) reaches review jobs, documents, glossaries, term entries (normalized bilingual search), and jump-to-segment-number within an open document.

## Entity overview (07a for full shapes)

**Workspace** → owns **Glossaries** and **ReviewJobs**. A **ReviewJob** (direction pair: source locale, target locale; enforced glossary; length policy defaults; version) → contains **Documents** → each contains **SegmentPairs** (source text, target text, declared limit, revision, decision state + history). The deterministic QA scan produces **QaFindings** — three kinds: **TermViolation** (glossary-versioned), **LengthFitWarning** (limit/policy-versioned), **ConsistencyFinding** (job-scoped sibling links) — each with a resolution lifecycle ending in a human decision (edit / override-with-reason / false-positive / acknowledged / choose-canonical). **TermEntry** (glossary rows: source/target terms, mandate, severity, version). **Job** (async: import/scan/export), **ExportArtifact**, **ActivityEntry** (P17), **Session** (auth-agnostic).

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Review-jobs home | jobs list, filters + saved views (P08), onboarding checklist (P22) | listReviewJobs, getSession |
| S2 | Document overview | per-document QA report, counts, gate status | getDocument, getQaReport, runQaScan |
| S3 | **Review workspace** | side-by-side pair review — navigator + pair view + findings rail (CP-2/3) | listSegmentPairs, getSegmentPair, updateSegmentTarget, setSegmentDecision, bulkSetSegmentDecisions, listQaFindings, resolveQaFinding |
| S4 | Findings console | all findings for a document/job, filters by kind/severity/state, bulk resolution | listQaFindings, resolveQaFinding, getQaReport |
| S5 | Glossaries | glossary list, create, per-glossary entry counts | listGlossaries, createGlossary, getGlossary |
| S6 | Glossary editor | term-entry authoring/editing, termbase paste-import, normalized search | listTermEntries, saveTermEntry, deleteTermEntry, importGlossary |
| S7 | Sign-off & export | gate state, resolution ledger, sign-off record, package export + artifacts | getReviewJob, getQaReport, signOffReviewJob, exportReviewPackage, getArtifact, getUsage |
| S8 | Jobs center | imports/scans/exports, cancel/retry, link-to-context (async-contract §7) | listJobs |
| S9 | Settings | direction/locale defaults (informational — workspace length-policy defaults are read at job creation, 07a), capability consent (kind-not-vendor), usage window | getSession, getUsage |

Mobile (≤767px): S1, S2, S4, S7 read/report modes; S3 pair *reading* with stacked panes (source above target, each at own direction) — segment editing is desktop/tablet (00 surface); S5/S6 read-only. Every screen states its filters (P08) and its four empties per P01 (11 matrix).

## Per-screen state obligations

First-run (S1 offers the sample job + sample glossary — the planted critical violation is the product's value proof); skeletons mirror final geometry per direction (P02, RTL skeletons flip); errors per 03 mapping; copy matrix in 11.

## IA decisions and rationale

- **The review workspace binds navigator + pair view + findings rail permanently**: terminology flags, length meters, and decisions all belong to the *focused segment* — a findings list detached from the pair view is exactly the checker-report posture this product replaces (01).
- **Findings console is separate from the rail, not instead of it**: Yusuf works segment-local; Rana/Omar audit document-wide (02 JTBDs) — same data, two scopes, one operation set (listQaFindings + resolveQaFinding).
- **Glossaries are workspace-level, not job-level**: termbases outlive jobs (Omar's per-client assets); jobs *reference* a glossary and pin the term versions they enforced (audit honesty, 07a).
- **Sign-off has its own screen (S7)**: the gate + resolution ledger + export is the buyer's governance artifact (02 Rana) — burying it in settings would hide the product's answer.
- **Queue (S8) is small but first-class**: imports, scans, and exports are the product's async Jobs (async-contract §7).
