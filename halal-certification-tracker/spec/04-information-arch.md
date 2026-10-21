# 04 — Information Architecture: halal-certification-tracker

## Navigation model

Left rail (RTL: right rail — mirrored per rtl-rules §2): **السجل Register** (home) · **طلبات الشهادات Applications** · **مقدمو الطلبات Applicants** · **المكوّنات Ingredients** · **شهادات المورّدين Supplier certificates** · **التجديد Renewals** (console) · **السجل النشط Activity** · **المهام Jobs** · **الإعدادات Settings** (includes ladder policy). The application workspace is the product's core mode — one case, five zones switched by tabs: **Overview** (stage ladder, case facts) · **Formulation** (the ingredient graph surface) · **Evidence** (documents + supplier certificates in case context) · **Audit records** · **Decision**. The certificate detail is the register's item view: ladder timeline, traceability summary, status actions, successor chain. ⌘K palette (P05 — five list surfaces) searches applicants, applications, ingredients, certificates, and jobs with bilingual normalization (alef variants, taa marbuta, yaa forms — rtl-rules §4). Two-level IA: section → item; workspace locale (ar/en) flips chrome direction with data intact. Desktop-first; ≤767px: register and certificate detail read-only + status actions; decision surface fully operable (Dr. Ahmad's committee-mode on a tablet); formulation editor read-only on phone.

## Entity overview (07a for full shapes)

Workspace (the certification body) → Applicants → Facilities → Products (with versioned Formulations → FormulationLines → Ingredients + SupplierCertificates) → Applications (kinds: initial / renewal / modification; stage ladder; AuditRecords; CommitteeDecision) → Certificates (scheme, scope, pinned RenewalLadder, successor chain) → RenewalLadders (versioned policy per scheme) → Jobs (imports, exports) → ExportArtifacts → ActivityEntry (append-only, everything consequential).

## Screen inventory (12)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Register home | certificate grid with urgency zones, Monday renewal digest, onboarding checklist (P22) | listCertificates, getSession, getRenewalLadder (zone legend) |
| S2 | Applicants directory | applicant list (bilingual names, certificate counts), applicant detail (facilities, products, certificates, open cases) | listApplicants, createApplicant, getApplicant, updateApplicant |
| S3 | Application workspace | the case: stage ladder, formulation tab, evidence tab, audit records, decision dossier | createApplication, getApplication, advanceApplication, setFormulation, getFormulation, recordAuditOutcome, issueCertificate, listSupplierCertificates, createSupplierCertificate |
| S4 | Ingredient directory | master ingredient list with statuses, E-numbers, bilingual search; classification edits; impact drill | listIngredients, createIngredient, updateIngredient, getIngredientImpact, importIngredients |
| S5 | Supplier-certificate vault | evidence records with derived states (valid / expiring-soon / expired), expiry-sorted, line back-links | listSupplierCertificates, createSupplierCertificate, updateSupplierCertificate |
| S6 | Certificate detail | ladder timeline (rung states), traceability summary (scope products → ingredients), status actions, successor chain | getCertificate, getRenewalLadder, setCertificateStatus, openRenewalCase, getIngredientImpact (drill) |
| S7 | Renewal console | cross-certificate rung digest grouped by urgency zone; due-this-month; missed rungs first | listCertificates (zone filters), openRenewalCase, getCertificate |
| S8 | Ladder policy editor (in Settings) | scheme ladders: rung offsets, kinds, validity; versioned edits (owner role) | getRenewalLadder, updateRenewalLadder |
| S9 | Activity log | append-only accountability surface, filterable, exportable via register export | listActivity |
| S10 | Jobs console | import/export jobs with state, cancel/retry, link-to-context (async-contract §7, T3-consolidated) | listJobs, getArtifact |
| S11 | Settings | workspace locale/direction, scheme defaults, storage-mode state, session role display | getSession |
| S12 | Command palette (overlay) | bilingual normalized search across five entity lists | client-side over S1–S5/S7/S9 data (P05) |

## Workspace & permission structure

One workspace per certification body (12 Q-17 — no federation at v1). Seats are staff roles, typed on the session (07b): **owner** (the director/program-manager seat: everything, including ladder policy and the settings surfaces), **assessor** (Khalid's seat: applicants, applications, formulations, ingredients, supplier certificates, audit records, issuance — everything except policy and member administration), **committee** (Dr. Ahmad's seat: the decision dossier, resolutions, and read access to the register; no formulation or policy mutation), **viewer** (read + export only — the accreditation-prep and auditor-observer seat, free). Permission denials are typed PERMISSION errors naming the seat's rights (11 C), never silent hiding; the IA renders the same surfaces to every role with mutation affordances gated visibly (P05 palette results stay complete — role gates act at invocation, not at navigation).

## Per-screen state obligations

Four empties per P01, enumerated per surface: first-run (S1 offers the seeded sample body — three certificates across three schemes, one open application, the ladder and one impact analysis experienceable pre-import, P22); no-data-after-activity (S5 vault empty after the only supplier certificate expired — explains that records persist, offers the history filter); no-access (S2 cross-workspace applicant link → PERMISSION surface, never "empty"); filtered-empty (S1 zone filter with zero rows declares itself + reset, P08). Skeletons mirror final geometry per direction (P02) — the register grid skeleton flips in RTL. Full copy matrix in 11.

## IA decisions and rationale

- **The register is home, not the applications board**: the buyer's daily question is "what needs action across live certificates" (Maryam's Sunday question, 02) — a case-listing home would bury the ladder engine, the product's spine, one click deep. Applications are the busy surface during intake seasons; the register is forever.
- **Renewal console is a cross-certificate surface, not a certificate tab**: rungs from different schemes interleave in the real week (a Gulf-scheme T-120 rung and a general-scheme T-45 rung can fall on the same Monday) — only a cross-certificate digest answers "this month" honestly. The per-certificate ladder timeline (S6) is the drill-down.
- **Formulation lives inside the application workspace**: formulations enter the world through cases (initial, renewal refresh, modification) — the IA keeps the authoring act where the accountability is, and the ingredient directory (S4) stays the shared master surface.
- **Ladder policy sits in Settings, its effects sit everywhere**: policy is owner-typed data edited rarely (S8); computed rungs render on S1/S6/S7 without ever exposing editing affordances there — separation of policy from instance is the honesty mechanism (07a immutability).
- **Jobs consolidated (T3 posture)**: per async-contract §7, Tier 3 consolidates the job center — S10 is one console for imports and exports with link-to-context.
- **Committee decision mode is deliberately narrow**: Dr. Ahmad's surface is the decision tab (S3) rendered as a dossier — the IA never routes him through the register or the formulation editor; his role's whole world is one tab plus the renewal-console read view (02 persona).
- **Supplier-certificate vault is its own surface, not a tab of ingredients**: the vault is expiry-first (sorted by derived state) while the directory is identity-first (alphabetical bilingual search) — the same records serve two different questions and earn two surfaces.
