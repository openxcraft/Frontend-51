# 03 — UX Flows: waqf-endowment-registry

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation — no orphans, no phantoms. All flows run RTL/Arabic-first by default (bilingual-ar, 05) with English a full citizen; both directions pass the 09 verification matrix.

## CP-1 — Register an endowment, deed, assets, beneficiaries, policy (value proof)

1. Abdulaziz creates the endowment: bilingual deed title ("وقف آل الراشد الخيري" / "Al-Rashid Family Charitable Waqf"), bilingual donor name, bilingual purpose, kind (family/mixed/charitable/religious), deed reference (number + Gregorian date, optional Hijri display per P24 — Umm al-Qura disclosed). `createEndowment`
2. The registry home shows the new endowment in **draft** status with a completion checklist: asset → beneficiaries → policy → activate. `listEndowments` · `getEndowment`
3. He adds the corpus asset: bilingual name, kind (real-estate), income mode (rental), note. Multiple assets supported; retirement is a recorded status, never a delete. `addAsset` · `listAssets`
4. He registers beneficiaries with deed shares — the fraction editor (1/8, 3/24…): bilingual names, class (individual/family/institution/charitable), and marks the deed's charitable end-beneficiary as residual holder. `addBeneficiary` · `listBeneficiaries`
5. He saves the distribution policy: administration cap 10%, reserve 5%, remainder rule (residual-beneficiary), period (monthly). Versioned; edits version-forward. `saveDistributionPolicy` · `getDistributionPolicy`
6. He activates the endowment with a reason; the status change logs. `setEndowmentStatus`

**Edges**: deed title or donor name authored in one script only → the activation gate names the missing side (bilingual-by-construction); share sum below 1 (allowed — the deed's unassigned remainder lands per the remainder rule; the share editor shows the live sum meter); share sum above 1 → the gate refuses naming the overflow fraction; a beneficiary registered without a share (allowed in draft — the completion checklist carries it); Hijri date conversion displayed beside the Gregorian one with the method disclosed.
**Failures**: one-script fields at activation → VALIDATION naming the exact fields; share overflow on `addBeneficiary`/`updateBeneficiary` → VALIDATION ("shares sum to 9/8 — the deed's whole is exceeded by 1/8"); policy cap out of range (admin cap >25% or reserve >20%) → VALIDATION with the allowed range; stale metadata edit → CONFLICT with both payloads.
**Recovery**: draft endowments are editable freely until activation; every completion-checklist item links to the flow that satisfies it (P22 value checklist, not a tour).

## CP-2 — Record the period's truth: inflows, expenses, corrections (the daily loop)

1. Muna opens the endowment's ledger tab at period start: existing entries by seq, filters by kind/period. `listLedgerEntries`
2. She records the building's monthly rent inflow: amount, period, asset, bilingual evidence note ("receipt R-1183, bank statement October"), optional abstract document reference. `recordInflow`
3. She records an administration expense (bank charges, registrar fee) and a maintenance expense — expense kind drives the report's expense classification and the administration cap. `recordExpense`
4. Bulk path (foundation onboarding): she imports last year's monthly inflow rows from the accounting export — a Job with row-count progress; one malformed row is named and skipped, the rest land. `importLedgerBatch` · `listJobs`
5. She discovers a duplicated inflow entry: she voids it with a reason; a reversal entry appends referencing the original — history intact, the original carries a reversal mark. `voidEntry`
6. The unallocated balance digest on the endowment summary updates — recorded inflows minus recorded expenses and distributions, derived at read. `getEndowment`

**Edges**: evidence note authored in one script only → allowed (evidence is what it is — the field renders per-side direction with the missing side simply absent, and the copy says so); delivery of an inflow for a retired asset → allowed with a retired-asset marker on the entry (history never rewrites); import rows referencing an unknown asset → named-and-skipped with the row number.
**Failures**: import with zero valid rows → Job failed with typed error + the invalid-row list; voiding an already-reversed entry → CONFLICT naming the existing reversal; import/export window exhausted → RATE_LIMIT with reset date (the only metered windows, 12 Q-3); NETWORK mid-import → partial policy (valid rows delivered, named rows skipped, per-row retry).
**Recovery**: every entry is recoverable by reference (seq + id); imports are re-runnable per failed row only; the ledger never loses an entry to a job failure (async-contract §4).

## CP-3 — Run the distribution: allocate → review → record → deliver (the signature flow)

1. With the period's entries recorded, Muna runs the allocation: the worksheet computes — inflows, capped administration, reserve, distributable, per-beneficiary lines (share × distributable), the rounding remainder landing on the deed's residual holder (or carrying forward). Synchronous, budget-bound; the derivation shows per line. `runAllocation`
2. She reviews the worksheet line by line: each line shows its own arithmetic ("3/24 × 3,504,000 = 438,000" — share × distributable, the 07c regression figure) beside the beneficiary's name and class. `getAllocation`
3. The eligibility reality check: one beneficiary is 'succeeded' (deceased, successor registered) — the worksheet holds that share with the recorded reason; the held amount stays unallocated — visible and named, never redistributed (a deed-assigned share is not the remainder's to take; 07a invariant). `updateAllocationLine` (hold with reason)
4. She adjusts one line (a deed-conditioned increase for a student beneficiary) with a reason — the computed amount stays visible beside the adjusted one, forever. `updateAllocationLine`
5. She records the distribution: the attest step (attestation note), then commit — the entries settle into the ledger (the stately settle, 05), the attestation logs with actor and timestamp. `recordDistribution`
6. Delivery tracking: as amounts reach beneficiaries, she records each delivery by hand — evidence note, method ("bank transfer, receipt 4471"), date; the line's delivery state moves pending → delivered. `recordDelivery` · `getDistribution`

**Edges**: allocation on a period with zero inflows → VALIDATION ("nothing recorded for 2026-10 — record the period's entries first"); distributable below the policy minimum → the plan carries forward with the carry-forward note (honest state, not an error); every line held → the commit refuses naming the held count; delivery on a line whose period's expense was later reversed → allowed, and the variance surfaces in the next report; a draft allocation superseded by new entries in the same period → the worksheet shows a stale-inputs banner ("2 entries recorded after this plan — re-run to include them"), never silently recomputed.
**Failures**: `recordDistribution` on a committed/voided allocation → CONFLICT carrying the state; `updateAllocationLine` without a reason on hold/adjust → VALIDATION naming the missing reason; `recordDelivery` on a voided allocation's line → CONFLICT naming the void; stale line baseVersion → CONFLICT with both payloads.
**Recovery**: draft allocations are re-runnable (the old draft voids, a fresh plan computes — recorded in activity); a committed distribution with an upstream reversal keeps its history — the next report's variance section tells the truth (12 Q-7).

## CP-4 — Generate, seal, export the transparency report (the trust artifact)

1. At period close, Muna generates the endowment's transparency report: sections compute deterministically from ledger state — opening balance, inflows by asset, expenses by kind, distributions by beneficiary class, administration and distribution ratios, remainder and its destination, variance vs prior period. `generateReport`
2. She reads the report view: every section figure is a ledger walk; the ratios render with their arithmetic shown ("administration 10.0% = 432,000 / 4,320,000"). `getReport`
3. The board treasurer's read (Dr. Yaqub, viewer seat): same report, read-only, both directions, no mutation surface. `getSession` · `getReport`
4. She seals the report: the seal mark settles onto the report header (the signature moment, 05), the ledger pin records the last seq per endowment, the sealing logs. Sealed = immutable snapshot. `sealReport`
5. She exports the sealed report: bilingual document for the board, ledger CSV for the auditor, print bundle for the beneficiary meeting — a Job with artifacts and expiry. `exportReport`
6. The auditor (Yasmin, viewer seat) retrieves the artifact before expiry and regenerates if expired. `getArtifact` · `listJobs`
7. Beneficiary statement: the same flow pointed at one beneficiary — Salman's full ledger history in one artifact. `generateReport` (kind 'beneficiary-statement') · `getReport` · `exportReport`

**Edges**: report on a period with no ledger entries → VALIDATION ("no entries recorded for 2026-09 — a report of nothing is not a receipt"); workspace-wide consolidation (no endowmentId) → aggregates across endowments with per-endowment breakdown; variance against a prior period with reversed entries → computed against the reversed-adjusted truth (the pin tells the reader exactly which state); regeneration after later entries → a NEW draft report, the sealed one untouched.
**Failures**: `sealReport` on a sealed report → CONFLICT carrying sealedAt; export of a draft (unsealed) report → allowed with the draft watermark declared in the artifact (honest, not blocking — drafts are labeled, 11); artifact expired → NOT_FOUND with the regenerable path; export window exhausted → RATE_LIMIT with reset date.
**Recovery**: sealed reports never need recovery — they are immutable; exports regenerate from the sealed snapshot at any time within the window; artifacts past expiry are re-generable (regenerable: true).

## CP-5 — Registry surfaces, governance changes, and the account trail (the daily surface)

1. Endowments home: registry grid sorted by updated, filter chips by status/kind, search by normalized bilingual name; the period digest carries each active endowment's unallocated balance. `listEndowments` · `getSession`
2. Governance changes: a beneficiary is suspended (reason recorded, distributions hold); a successor is linked on a deceased beneficiary; an asset retires; the endowment goes dormant with a reason. Each change logs with actor and timestamp. `updateBeneficiary` · `updateAsset` · `updateEndowment` · `setEndowmentStatus`
3. Deed correction: a deed reference digit error — the deed panel edits with baseVersion (the deed SUMMARY is metadata, editable with history in the activity log; the LEDGER never edits). `updateEndowment`
4. Activity log: every consequential act — entries, reversals, allocations, commits, deliveries, seals, exports — filterable by endowment/actor/action; the accountability surface for audits (P17). `listActivity`
5. Jobs console (T3-consolidated): import and export jobs with state, cancel/retry, link-to-context. `listJobs`
6. Usage: the export/import window meters render in settings and before export submits (P14 — warn at 80%). `getUsage`
7. Palette (P05): ⌘K reaches endowments, reports, jobs, ledger entries. Client-side over the list surfaces. `listEndowments` (source data)

**Edges**: filtered-empty declares itself (P01); >200 ledger rows virtualize (P19); no-access endowments → PERMISSION surface, never "empty"; dormant endowments still readable and reportable (a dormant waqf keeps its history).
**Failures**: NETWORK mid-list → banner + retry (P20); viewer attempting a mutation → PERMISSION naming the seat ("your seat reads and exports; the administrator seat records"); stale version on any governance edit → CONFLICT with both payloads.
**Recovery**: all list surfaces cursor-paginated and re-fetchable; session locale switches re-render without data loss; queued writes (P20) reconcile to authoritative ledger state on return — the ledger's authority is never guessed client-side.

## Non-happy paths

- **First-run (P22)**: the registry home offers the seeded sample endowment (07c W-S) — a fully-worked family waqf with a period of entries, a committed distribution, and a sealed report — so the seal moment and the worksheet derivation are experienceable before any real deed is typed. The value checklist: register one endowment → record one inflow → run one allocation → seal one report.
- **No capabilities bound (LOOP-5)**: document storage unbound → evidence is bilingual notes + hand-entered references; disbursement unbound → delivery is hand-recorded with method and evidence; report delivery unbound → download/print is the path; notification unbound → in-app surfaces + return-state only. The full CP-1…CP-4 loop completes with all four unbound (the 00 DoD).
- **Offline (P20)**: reads work; writes queue with per-item state; on return, the surface reconciles to authoritative ledger state — a queued inflow that raced a parallel recording elsewhere surfaces as CONFLICT with both payloads, never a silent overwrite.
- **The data hole made honest**: a beneficiary succeeded mid-period with no successor registered → the worksheet's held line names the reason; the unallocated balance grows; the transparency report's remainder section says exactly where the held amount sits — the product turns the hole into a named state (the legal-case-tracker grammar, pointed at distributions).
- **Auditor mode (02 Yasmin)**: a viewer seat walks the whole ledger, every entry's evidence, every sealed report, and exports — with zero mutation surface anywhere (07b rule set; PERMISSION on any mutation).

## Failure → error mapping

VALIDATION (one-script deed fields, share-sum overflow, policy ranges, allocation gates, seal-less export of an empty period, missing adjustment reasons) · NOT_FOUND (stale endowment/entry/allocation/report/artifact links, expired artifacts) · PERMISSION (viewer seats, workspace scoping) · CONFLICT (concurrent metadata/policy/line edits, seal-on-sealed, delivery on voided lines, double-reversal) · RATE_LIMIT (export window, import window) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation exactly once)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-4.3, CP-5.1 | `recordInflow` | CP-2.2 |
| `createEndowment` | CP-1.1 | `recordExpense` | CP-2.3 |
| `listEndowments` | CP-1.2, CP-5.1, CP-5.7 | `voidEntry` | CP-2.5 |
| `getEndowment` | CP-1.2, CP-2.6 | `listLedgerEntries` | CP-2.1, CP-5 (ledger tab) |
| `updateEndowment` | CP-5.3 | `importLedgerBatch` | CP-2.4 |
| `setEndowmentStatus` | CP-1.6, CP-5.2 | `runAllocation` | CP-3.1 |
| `addAsset` | CP-1.3 | `getAllocation` | CP-3.2 |
| `updateAsset` | CP-5.2 | `updateAllocationLine` | CP-3.3, CP-3.4 |
| `listAssets` | CP-1.3 | `recordDistribution` | CP-3.5 |
| `addBeneficiary` | CP-1.4 | `getDistribution` | CP-3.6 |
| `updateBeneficiary` | CP-5.2 | `recordDelivery` | CP-3.6 |
| `listBeneficiaries` | CP-1.4 | `generateReport` | CP-4.1, CP-4.7 |
| `saveDistributionPolicy` | CP-1.5 | `getReport` | CP-4.2, CP-4.3, CP-4.7 |
| `getDistributionPolicy` | CP-1.5 | `sealReport` | CP-4.4 |
| `exportReport` | CP-4.5, CP-4.7 | `getArtifact` | CP-4.6 |
| `listJobs` | CP-2.4, CP-4.6, CP-5.5 | `getUsage` | CP-5.6 |
| `listActivity` | CP-5.4 | — | — |

33 operations, 0 orphans, 0 phantoms (Critic-verified).
