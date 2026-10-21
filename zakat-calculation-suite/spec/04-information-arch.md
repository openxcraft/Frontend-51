# 04 — Information Architecture: zakat-calculation-suite

SME-C pass · Desktop-first (≥1280px) web application; responsive to 360px in read/review modes. Zones follow 00 Surface; navigation is a bilingual left rail (mirrors RTL/LTR, rtl-rules §2) with the workspace switcher and ⌘K palette (P05). All list surfaces cursor-paginate (07b); the jobs console is the T3-consolidated activity surface per async-contract §7.

## Screen inventory (11 screens)

| # | Screen | Purpose | Primary ops (07b) | Rationale |
|---|---|---|---|---|
| S1 | **Cases home** — the register | The morning surface: case list with reference, bilingual subject, period-end (Hijri secondary, P24), currency, status, profile school chip, item counts; filter chips + saved views (P08); the seeded sample case lives here with its badge (P22) | `listCases` · `getSession` | The buyer's mental model is a register of files, not a calculator form — the register-first IA is the product's structural answer to the calculator category (01) |
| S2 | **Case workspace — Items** | Item intake and review: category-first progressive form (P09), the item table with filters, bilingual search, inline edit with escape hatch (P06), void-with-reason, bulk-import entry | `getCase` · `addCaseItem` · `importItems` · `listCaseItems` · `updateCaseItem` · `voidCaseItem` | Items are the evidence layer; the table is where the officer's care actually lives (CP-1). Draft-only mutation; locked/approved states refuse with the successor path named |
| S3 | **Case workspace — Calculation** | The result: basket summary, NisabGauge (threshold arithmetic), per-category dues, in-kind dues as kind names, the derivation trace with rule chips and source notes, result history | `runCalculation` · `getCalculation` · `listCalculations` | The trace IS the product's value (00) — it gets a dedicated tab, not a collapsed panel. Below-nisab renders as an honest state with the signed distance (CP-1 edge) |
| S4 | **Case workspace — Review & lock** | Review packet (evidence, trace, pins, history), submit/approve/return actions, lock, successor spawn, chain view | `submitCaseForReview` · `reviewCase` · `lockCase` · `createSuccessorCase` | Certification is a state machine with named transitions (07a); the chain view makes "corrections never rewrite" visible |
| S5 | **Compare view** | Profiles × categories matrix, per-cell dues, divergence markers with rule pairs and bilingual reasons, rule inspection side-by-side, comparison history | `createComparison` · `getComparison` · `listComparisons` · `listProfiles` · `getProfile` | The signature flow (CP-2) — needs its own surface because it reads across profiles, not within one case. "No divergence" is stated plainly when schools agree |
| S6 | **Nisab & valuations** | Entered reference values per metal (value/gram, as-of, source note, active flag), pinning to cases, reference history | `listNisabReferences` · `setNisabReference` · `pinNisabReferences` | Reference discipline is the audit spine's other half (CP-3); append-only history, supersede-never-edit |
| S7 | **Methodology profiles admin** | Profile list (school chips, status, version), rule editor with source notes, approve/retire (owner gate), preset scaffolds | `listProfiles` · `getProfile` · `saveProfile` · `approveProfile` · `retireProfile` | Methodology-as-data (00) requires an admin surface where the shariah authority works; every edit re-versions and reverts to draft (07a) |
| S8 | **Jobs & exports console** | Import/export jobs with state, progress, cancel/retry, link-to-context; artifact list with expiry windows and renew | `listJobs` · `getArtifact` · `exportCase` · `exportComparison` | async-contract §7 consolidated surface; exports carry expiry windows declared at creation |
| S9 | **Activity log** | Actor-action-target-timestamp stream, filterable (P17) | (read surface over ActivityEntry, 07a) | The accountability surface the auditor's "who did what when" question lands on; export via the audit bundle |
| S10 | **Settings** | Default locale, numeral policy, Hijri display method, workspace default profile, usage window meter | `getUsage` · `getSession` | The usage surface states the unmetered-calculations policy in-product (07b rule 9) |
| S11 | **Case reference overlay** (⌘K palette) | Bilingual normalized search across cases, profiles, references, jobs; recent items | (client surface over list ops; P05) | More than three list surfaces triggers the palette per P05; Arabic normalization per rtl-rules §4 |

## Navigation model

- **Primary rail** (mirrors per direction): Cases · Compare · Nisab & Valuations · Methodology · Jobs · Activity · Settings. The case workspace opens from Cases and carries its own tab row (Items · Calculation · Review & Lock · Chain).
- **Contextual entry points**: run-calculation affordance lives in the case workspace header (⌘Enter, 09); compare entry lives on the case's Calculation tab; pin references from S6 or from the NisabGauge's "pin" action (CP-3).
- **Breadcrumbs** over object context: case → tab → object (item, result, divergence). Bilingual subject names render bidi-isolated (rtl-rules §2).
- **Route changes** crossfade ≤180ms; case→detail uses the shared-element intent per motion-language §3 (stately personality, 05).

## Workspace & permission structure

One workspace per institution (12 Q-16 posture), roles per 07a:
- **owner** (Sheikh Salman, P-02): everything + methodology approval/retirement + member management. The fiqh gate — `saveProfile`/`approveProfile`/`retireProfile` are owner-only (07b rule 4).
- **officer** (Nadia, Huda-officer-mode, P-01/P-03): create/edit draft cases, enter and void items, enter/pin references, run calculations and comparisons, submit for review, exports.
- **reviewer** (Huda, P-03): everything officer can read plus review decisions, lock, successor spawn, exports.
- **viewer** (Ibrahim/Fatima, P-04): read locked cases + retrieve export artifacts — deliberately open export path for the auditor's seat (07b rule 4); no mutation surface renders.
- Permission refusals are typed PERMISSION surfaces (11), never "empty" states (P01 no-access discipline).
- Session locale (ar/en) re-renders chrome in either direction without data loss; direction is a full citizen per rtl-rules §1 (bilingual-ar, 05 §direction model).
