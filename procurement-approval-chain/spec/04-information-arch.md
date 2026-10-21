# 04 — Information Architecture: procurement-approval-chain

## Navigation model

Left rail: **Requests** (home) · **Budgets** · **Matrix** · **Org & Delegation** · **Vendors & Centers** · **Activity** · **Jobs**. The request is the product's core mode — the register is home, the request detail surface (composer when draft, approval workspace when live) is where all three personas meet. ⌘K palette (P05) reaches requests, envelopes, positions, vendors, and jobs with bilingual normalized search (alef variants, taa marbuta, yaa forms — rtl-rules §4). Two-level IA: section → item; request detail is item detail with the approval-chain rail as the persistent vertical dimension. Desktop-first; ≤767px: Requests/Activity read-and-decide surfaces remain full participants (composer simplified: one line at a time, quote entry stacked); Matrix and Budgets authoring surfaces render read-only on mobile with an explicit "authoring stays on desktop" notice.

## Entity overview (07a for full shapes)

Workspace → PolicyPack + DOA rules (versioned matrix) + Budget envelopes (cost center × category × period) + Positions (members, delegations) + Vendors + Cost centers → Purchase requests (lines, quotes, comparison, budget-check snapshots, chain versions, decisions) → Export artifacts. Jobs wrap exports. Activity log spans every consequential mutation (P17).

## Screen inventory (11)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Requests home (register) | my-queue vs all-requests by role, filters + saved views, sample-request card first-run | listRequests, getSession, listJobs (badge) |
| S2 | Request composer (draft) | bilingual header, lines editor, quote entry, justification, routing-preview rail | createDraftRequest, updateRequest, addQuote, updateQuote, removeQuote, selectQuote, previewRouting, listVendors, saveVendor, submitRequest |
| S3 | Request detail / approval workspace | document-paper surface: lines, quote comparison, budget evidence, chain rail, decision bar, history | getRequest, decideStep, resubmitRequest, withdrawRequest, cancelApprovedRequest, exportRequestPackage |
| S4 | Budgets console | envelopes by period/cost center/category, commitment bars, over-budget states | listBudgetEnvelopes, saveBudgetEnvelope |
| S5 | Approval matrix studio | rules by specificity, bands, chains, matrix version, policy pack | getApprovalMatrix, saveApprovalRule, removeApprovalRule, getPolicyPack, savePolicyPack |
| S6 | Org & delegation | positions, levels, assigned members, delegation windows | listPositions, savePosition, setDelegation, clearDelegation |
| S7 | Vendors & cost centers | bilingual reference directories | listVendors, saveVendor, listCostCenters, saveCostCenter |
| S8 | Activity log | filterable accountability surface (P17) | listActivity |
| S9 | Jobs & artifacts | export jobs, artifact expiry, retry | listJobs, getArtifact |
| S10 | Settings | workspace locale, currency display, direction preference, sample-data clearing | getSession, getPolicyPack |
| S11 | Command palette (overlay) | bilingual normalized search across requests/envelopes/positions/vendors/jobs | client-side over S1/S4/S5/S6/S7 data |

## Per-screen state obligations

Four empties per P01 (S1 first-run offers the sample request; S1 filtered-empty offers filter reset; no-access rows render a PERMISSION surface, never "empty"; S4 first-run teaches envelope authoring; S5 first-run offers the seeded default rule as a starting matrix). Skeletons mirror final geometry per direction (P02). Errors per 03 mapping; full copy matrix in 11. The register virtualizes past 200 rows (P19) with focus preservation.

## IA decisions and rationale

- **The register is home, and it is role-aware**: Amal sees her requests and their chains; Reem/Faisal/Noura land in My-Queue by default — the product's daily question is "what waits on me?", and the IA answers it before navigation begins.
- **The composer and the approval workspace are one surface with two modes**: the request document is a single artifact from draft to decision (S2/S3 share layout, components, and the chain rail); separating them would force approvers to re-learn what requesters built — and the routing preview that Amal reads pre-submit is the same chain rail Reem acts on post-submit (the product's core transparency loop).
- **Budgets and Matrix are separate consoles, not tabs of Settings**: they are versioned policy artifacts with their own authoring surfaces, validation rules, and audit weight (Faisal's JTBD); burying them in settings would repeat the status quo's binder problem — policy nobody can find.
- **Org & Delegation is first-class**: delegation is a governance act that changes who may decide; it earns its own surface with its own history rather than hiding as a user-profile toggle.
- **Jobs consolidated (T3 posture)**: per async-contract §7, Tier 3 consolidates the job center — S9 covers the export job class with link-to-context; no per-class IA.
- **Vendors & cost centers together**: both are lightweight reference directories serving the same authoring acts (Faisal's setup); neither is a management surface (LOOP-10 boundary visible in the IA itself — the absence of catalog/vendor-management surfaces is the exclusion made structural).
