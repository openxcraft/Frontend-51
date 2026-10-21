# 04 — Information Architecture: waqf-endowment-registry

## Navigation model

Left rail: **Endowments** (home — the registry) · **Reports** · **Activity**. The endowment detail is the product's core mode — one endowment, four stacked surfaces switched by tabs: **Deed & policy** · **Assets** · **Beneficiaries** · **Ledger**. The distribution studio and the report view are reached from the endowment's context (period pickers on the ledger tab and the reports surface) and from the home digest. ⌘K palette (P05 — the registry, ledger, reports, and activity exceed three list surfaces) reaches endowments, reports, jobs, and ledger entries with bilingual normalized search (alef/hamza variants, taa marbuta, yaa forms — rtl-rules §4). Two-level IA: section → item; the endowment workspace is item detail with the ledger's period as the persistent dimension. Desktop-first ≥1280px; ≤767px: Endowments/Reports read-only, ledger collapses to a card list, delivery recording remains available (the 360px field surface, 09).

## Entity overview (07a for full shapes)

Workspace → Endowments (deed summary, status) → Assets (corpus, income metadata) · Beneficiaries (shares, eligibility) · DistributionPolicy (versioned; pinned by allocations) → LedgerEntry (append-only, per-endowment seq) → Allocation (draft plan over a period's entries) → Distribution (committed artifact with attestation) → Delivery states on lines → Reports (transparency / beneficiary statement; sealed snapshots) → ExportArtifacts. Jobs wrap imports and exports. ActivityEntry logs every consequential act (P17).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Endowments home | registry grid, period digest, unallocated balances, onboarding checklist (P22), sample-endowment offer | listEndowments, getEndowment, getSession |
| S2 | Endowment detail — Deed & policy | bilingual deed summary, deed ref with dual-calendar dates, policy editor with cap/reserve/remainder, completion checklist in draft | getEndowment, updateEndowment, saveDistributionPolicy, getDistributionPolicy, setEndowmentStatus |
| S3 | Endowment detail — Assets | corpus register: bilingual names, kinds, income modes, retire action, per-asset inflow totals | listAssets, addAsset, updateAsset, listLedgerEntries |
| S4 | Endowment detail — Beneficiaries | beneficiary register: share fraction editor with live sum meter, eligibility lifecycle, successor links, residual holder mark | listBeneficiaries, addBeneficiary, updateBeneficiary |
| S5 | Endowment detail — Ledger | append-only entry browser: seq, kind glyphs, amounts, evidence drawer, reversal append, period filters, import action | listLedgerEntries, recordInflow, recordExpense, voidEntry, importLedgerBatch |
| S6 | Distribution studio | allocation worksheet (derivation per line), hold/adjust with reasons, attest + commit, distribution detail with delivery tracking | runAllocation, getAllocation, updateAllocationLine, recordDistribution, getDistribution, recordDelivery |
| S7 | Transparency reports | period report view: sections, ratios with arithmetic shown, variance, seal mark, beneficiary statements, exports | generateReport, getReport, sealReport, exportReport, getArtifact |
| S8 | Jobs & exports console | import/export jobs, cancel/retry, link-to-context (T3-consolidated per async-contract §7) | listJobs, getUsage |
| S9 | Activity log | P17 accountability surface: every mutation with actor and timestamp, filterable, exportable | listActivity |
| S10 | Settings | locale default, numerals policy, currency, period convention, usage meters, capability state (credential-contract lifecycle surfaces) | getSession, getUsage |

The command palette renders as an overlay on every screen (P05), client-side over S1/S7/S8/S9 data.

## Per-screen state obligations

Four empties per P01 (S1 first-run offers the sample endowment so the seal moment is experienceable pre-registration; S5 first-run teaches record-first entry; S6 distinguishes no-entries-this-period from all-lines-held; S7 distinguishes never-generated from no-entries-in-period). Skeletons mirror final geometry per direction (P02 — RTL skeletons flip). Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **The ledger is a tab on the endowment, and the endowment is the workspace**: a waqf's assets, beneficiaries, and entries are one navigational object because they are one legal object — the deed. Splitting them into separate sections would re-create the spreadsheet sprawl the product exists to replace (02 Abdulaziz).
- **The distribution studio is a mode, not a page in the rail**: allocation belongs to (endowment, period) context — it is entered from the ledger tab's period and from the home digest's unallocated-balance nudge, so the plan always sits beside the entries it computes from.
- **Reports earn their own rail section**: the transparency report is the buyer-facing artifact (00) — board, auditor, beneficiary — and needs a surface where period, scope (single endowment vs consolidated), and sealed/draft state are the primary dimensions, independent of any one endowment.
- **Delivery tracking lives inside the distribution detail**: delivery is recorded per line, against the committed distribution — a separate "deliveries" IA would orphan lines from their evidence trail.
- **Jobs consolidated (T3 posture)**: per async-contract §7, Tier 3 may consolidate the job center into an activity surface — S8 is a single console for import/export jobs with link-to-context; S9 carries the full P17 log. Consolidation is deliberate: an administrator's day has exactly two async classes (imports and exports); everything else is synchronous arithmetic.
- **Settings is small and honest**: numerals policy (Western everywhere vs AR-indic in Arabic prose — the ledger row's optional surface) and capability states render here AND at point-of-use (evidence drawers carry the unbound-storage notice per credential-contract §3 — a state that degrades is surfaced where it is used, never only in settings).
