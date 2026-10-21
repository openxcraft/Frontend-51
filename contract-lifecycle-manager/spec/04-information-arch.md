# 04 — Information Architecture: contract-lifecycle-manager

## Navigation model

Left rail: **Vault** (home — the register) · **Obligations** (reminders console) · **Counterparties** · **Activity** · **Jobs**. The contract detail surface is the product's core mode — opened from any register row or reminder entry, carrying the contract's full context (bilingual metadata panel, document versions, obligation ledger, review track, activity thread). ⌘K command palette (P05 — list surfaces exceed three) reaches contracts (bilingual normalized search), counterparties, obligations, and jobs. Two-level IA: section → item; detail surfaces are item views with the contract as the persistent context object. Desktop-first (≥1280px); ≤767px: register, obligations console, and detail surfaces re-flow to review/complete modes (table→card collapse), intake wizard and settings are desktop/tablet.

## Entity overview (07a for full shapes)

Counterparty → ContractRecord (bilingual metadata, status machine, term history) → ContractDocuments (versioned bytes, language marks) · Obligations (direction, kind, dates/recurrence, owner; derived reminder schedule + urgency zones) · ReviewSteps (workflow track) → ExtractionSuggestions (assist drafts, P15-gated) · ExportArtifacts · ActivityEntries (append-only audit) · Jobs (extraction/export).

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Vault home | register grid (virtualized), renewal/obligation digest banner, onboarding checklist (P22), saved views | listContracts, getSession |
| S2 | Contract detail | bilingual metadata panel, document versions, obligation ledger, review track, renewal window bar, activity thread | getContract, listObligations, listActivity, getDocumentArtifact |
| S3 | Intake wizard | counterparty → metadata → upload → optional extraction → review suggestions | listCounterparties, createCounterparty, createContract, uploadDocument, runExtraction, listSuggestions, resolveSuggestion, listReminders |
| S4 | Obligations & reminders console | derived schedule by zone, complete/acknowledge, owner filters | listObligations, listReminders, completeObligation, updateObligation, getWorkspace |
| S5 | Extraction review panel (mode of S3/S2) | suggestion list with accept/edit/dismiss, confidence, document anchors | listSuggestions, resolveSuggestion |
| S6 | Counterparties directory | bilingual names, identifiers, contract counts | listCounterparties, createCounterparty, updateCounterparty |
| S7 | Activity log | append-only audit surface, filters, keyboard-navigable, exportable | listActivity, exportRegister |
| S8 | Jobs console | extraction/export jobs, cancel/retry, link-to-context | listJobs |
| S9 | Settings | workspace defaults (lead times), locale, consent state (kind-not-vendor), usage meter | getWorkspace, updateWorkspace, getSession, getUsage |

## Workspace & permission structure

One workspace = one legal team's vault (multi-workspace is the agency case — 12 Q-8). Roles: **owner** (GC-seat: everything incl. settings, archive, consent), **editor** (counsel/paralegal: all record mutations, reviews, executions, exports), **viewer** (business contract owners: scoped read + completion of obligations they own — the free seat, [9][11] counter-position). Permission boundaries surface as PERMISSION copy that names the role and the action, never as hidden buttons (data exists but is not editable — never a fake empty, P01 no-access discipline).

## Per-screen state obligations

Four empties per P01: S1 first-run (offers the sample contract — the reminder schedule is experienceable pre-load); S1 filtered-empty (declares the filter, offers reset); S1/S2 no-access (names the workspace boundary); S4 zones carry per-zone empties ("no overdue obligations" is a success state with its own copy, 11). Skeletons mirror final geometry per direction (P02); errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **The register is the home screen, not a dashboard**: the buyer's mental model is "the list of contracts" ([2] status quo is a folder-list; [19] triage advice is rank-the-register). Digests (renewal window count, overdue count) sit as a quiet banner above the register — honest counts, not KPI theater.
- **Obligations earned their own top-level section**: the reminder schedule is the product's spine (00) and Nadia's daily surface; burying it inside contract detail would recreate the tracker-spreadsheet problem (per-contract discovery, no cross-contract timeline).
- **Contract detail binds metadata + documents + obligations + activity permanently**: a contract record the vault cannot show in one place is the shared-drive problem again; the bilingual metadata panel is the detail surface's spine (S2), and every zone/urgency chip links back to the obligation that computed it.
- **Extraction review is a mode, not a destination**: suggestions live where the work is (intake wizard step, contract detail when re-running) — an "AI review center" as separate IA would fragment the P15 confirm loop.
- **Activity is first-class** (a11y-baseline §7 legal/audit obligation): keyboard-navigable, filterable, exportable — the audit surface is a destination, not a footer.
- **Jobs consolidated (T3 posture)**: per async-contract §7, the job center is one console across both job classes with link-to-context, rather than per-class IA.
