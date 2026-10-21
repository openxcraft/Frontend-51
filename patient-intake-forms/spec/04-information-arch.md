# 04 — Information Architecture: patient-intake-forms

## Navigation model

Two shells over one IA. **Staff console** (desktop-first ≥1024px): left rail — **Forms** (library + builder) · **Submissions** (console + review workspace) · **Vocabulary** (symptom term manager) · **Exports** (artifacts + print) · **Queue** (jobs center) · **Settings**; the rail mirrors in RTL per rtl-rules §2. **Patient fill surface**: a separate chrome-free shell — locale door, one question per screen, progress spine, autosave indicator, review-and-attest, confirmation; no navigation except the flow itself (back/next within the submission, exit-and-resume honesty). ⌘K command palette (P05, T2 mandate) on the staff console: bilingual normalized search over forms, submissions (by state/flag/form), vocabulary terms, and jump-to-question inside the open builder; the patient shell never carries a palette. Two-level IA: section → item; the review workspace = submission detail with normalization context; the builder = form detail with section/field context.

## Entity overview (07a for full shapes)

**Workspace** (clinic) owns **IntakeForms** and **SymptomVocabularies** (v1: one workspace vocabulary, modeled as a first entity for scope honesty — 12). An **IntakeForm** (bilingual title, visit type, version, status draft/active/archived) contains **Sections** → **FormFields** (typed: text, long-text, select-one, select-many, date, number, pain-scale, contact, consent, symptom — the symptom field binds a vocabulary scope). A **FillSession** (token, channel link/kiosk/printed-qr, expiry window) opens a **Submission** (form version pinned; patient context; answers per field; state machine in-progress → submitted → flagged? → reviewed → exported; retention clock). **SymptomTerm** (canonical ar/en, colloquial variants, urgentAttention, status, version) — the vocabulary. **SymptomEntry** on a submission: raw text (immutable), matched term + **matchMode** (exact | normalized | assist | unmatched), matched span, vocabulary version, and a **confirmation lifecycle** for assist matches (pending → confirmed | corrected — P15). **Job** (async: vocabulary import, intake export), **ExportArtifact**, **ActivityEntry** (P17), **Session** (auth-agnostic; staff roles owner/builder/reviewer + the patient fill-token session kind).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Forms library | form list, status/versions, operational counters (submissions, completion, flagged, pending), onboarding checklist (P22) | listForms, getFormOverview, getSession |
| S2 | **Form builder** | section canvas + field palette + inspector; bilingual copy editing; version history | getForm, saveForm, publishForm, listSymptomTerms (inspector preview), duplicateForm, archiveForm, createForm |
| S3 | Preview & test fill | the form as the patient sees it, both locales/directions, one-question-per-screen | getForm (draft read; preview is render-only) |
| S4 | Fill sessions & links | create/monitor fill invitations: channel, expiry, state (open/filled/expired), resend | openFillSession, listSubmissions (state=in-progress filter) |
| S5 | Submissions console | queue: state, urgent-flag count, pending-confirmation count, form, age; filters + saved views (P08) | listSubmissions, getSession |
| S6 | **Submission review workspace** | answers by section, normalization panel (modes, confirmations), urgent flag banner, review gate, audit chain | getSubmission, resolveSymptomMatch, flagSubmission, setSubmissionReviewState, saveSymptomTerm (variant shortcut), exportIntakePackage |
| S7 | **Vocabulary manager** | term list + normalized search, term editor (canonical pair, variants, urgent flag), paste import, rules disclosure | listSymptomTerms, saveSymptomTerm, deleteSymptomTerm, importVocabulary |
| S8 | Patient fill surface | the chrome-free flow: locale door → questions → symptom field with chips → review & attest → confirmation | resumeFillSession, saveDraftAnswers, submitIntake, normalizeSymptomText |
| S9 | Exports & jobs | artifact list with expiry/regeneration, print view, jobs console (imports/exports with cancel/retry) | exportIntakePackage, getArtifact, listJobs, getUsage |
| S10 | Settings | locale defaults, fill-token expiry window, retention policy, capability consents (kind-not-vendor), activity audit | getSession, updateWorkspace, listActivity |

Mobile (≤767px): S1/S5/S7/S9/S10 read/report modes; S6 review reading with stacked answer/normalization panes; S2 builder is desktop/tablet only (field authoring is precision work); S4 link creation from a compact action sheet. S3/S8 are natively mobile-first (they render the patient surface). Every screen states its filters (P08) and its four empties per P01 (11 matrix).

## Per-screen state obligations

First-run (S1 offers the sample form + sample vocabulary — the planted colloquial match and red-flag escalation are the P22 value proof); skeletons mirror final geometry per direction (P02, RTL skeletons flip); errors per 03 mapping; full copy matrix in 11. S8's confirmation and S6's flag banner are the two moments with dedicated motion treatment (05); everything else is the calm standard set.

## IA decisions and rationale

- **The patient surface is a separate shell, not a console mode.** Amira never sees staff nouns, queues, or flags; the fill surface's entire chrome is the flow itself. Conflating the two would leak the console's density into the care moment (02 Amira) — the same two-shells logic as the portfolio's KYC applicant/reviewer split, arrived at independently for the same reason: the person under stress and the person under deadline need different surfaces.
- **The normalization panel lives inside the review workspace (S6), not a separate console.** Confirmation is a review action (P15) — separating it would make Tariq's two-minute loop a two-screen loop; the panel's data (listSymptomEntries via getSubmission) rides the submission read.
- **Vocabulary is a workspace-level asset (S7), not per-form.** Terms outlive forms (Nour's weekly vocabulary care, 02); forms *reference* the vocabulary and pin the term versions their submissions matched against (audit honesty, 07a).
- **Fill sessions get their own screen (S4).** The link/QR/kiosk lifecycle (open, expiring, expired, resend) is front-desk operational state, not submission state — hiding it inside S5 would bury the resend decision (CP-3.8).
- **Exports (S9) is small but first-class.** The intake package is the product's handoff artifact and the EHR-boundary honesty surface (00 exclusions; 08 N2) — burying it in settings would hide the boundary the spec promises to name.
- **Settings carries the audit surface (S10) as a tab.** Activity is a workspace-level read (listActivity); T2 scope keeps it filterable + exportable, not a full analytics console (the funnel-explorer boundary, 12 Q-6).
