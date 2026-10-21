# 04 — Information Architecture: expense-claim-flow

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Claims** (home: my-claims / approval queue / finance queue — role-aware tabs over one operation, `listClaims`) · **Claim composer** (contextual: opened from any claim row; not a rail destination) · **Payouts** (approved → paid pipeline + exports) · **Policy studio** (rate tables + policy packs) · **Members** · **Queue** (jobs center) · **Settings.** Two-level IA: section → item; the approval workspace and the composer are claim-detail modes (composer = own-draft mode; approval workspace = review mode). ⌘K command palette (P05, T2 mandate) reaches claims, rate tables, policy packs, members (normalized bilingual search per rtl-rules §4), and jump-to-claim/`CLM-` reference.

## Entity overview (07a for full shapes)

**Workspace** → owns **RateTables** and **PolicyPacks** (pack references a table; the workspace pins one *active* pack) and **Members** (bilingual names, role: finance-admin / approver / employee). A **Claim** (member, status draft|submitted|queried|approved|rejected|paid; pinned policyPack version; totals derived) → contains **ClaimItems** (kind receipt|per-diem|mileage; per-kind inputs; computed amount + breakdown; revision) → receipt items carry a **ReceiptAsset** (capture source, script, OCR state machine: none → draft → applied | failed; extraction draft with per-field confidence). The deterministic policy check produces **PolicyFindings** (kinds: missing-receipt | duplicate-receipt | cross-claim-duplicate | late-submission | per-diem-double-dip; severity blocking|advisory; resolution lifecycle). **ApprovalStep** (claim chain: level, approver, state, delegation provenance, decision + reason). **PayoutRecord** (append-only; method/reference/date/actor; corrections supersede). **Job** (async: export; assist runs when slow), **ExportArtifact**, **ActivityEntry** (P17), **Session** (auth-agnostic).

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Claims home | role-aware queues (my claims / approvals / finance), filters + saved views (P08), onboarding checklist (P22), chain-position chips on every row | listClaims, getSession |
| S2 | Claim composer | draft authoring: header, item rail (3 kinds), live totals + computation breakdowns, receipt bin | getClaim, createClaim, updateClaim, addClaimItem, updateClaimItem, removeClaimItem, previewItemComputation |
| S3 | Receipt review panel | capture (photo/paste/upload), OCR draft fields with confidence + region links, manual-entry form (the same surface) | attachReceipt, extractReceiptDraft, applyReceiptDraft, getUsage |
| S4 | Approval workspace | item table + findings rail + decision bar + approval-chain steps (CP-3) | getClaim, listPolicyFindings, resolvePolicyFinding, decideClaim, reassignApprovalStep, attachReceipt, updateClaimItem, runPolicyCheck, getRateTable |
| S5 | Policy studio | rate tables (effective-dated, versioned) + policy packs (matrix, thresholds, window) | listRateTables, getRateTable, saveRateTable, listPolicyPacks, savePolicyPack, listMembers, previewItemComputation |
| S6 | Members | bilingual directory, roles, approver eligibility | listMembers |
| S7 | Payouts & export | approved queue, payout recording + corrections, evidence-pack export + artifacts | listClaims, recordPayout, exportClaimPackage, getArtifact |
| S8 | Jobs center | exports + long assist runs, cancel/retry, link-to-context (async-contract §7) | listJobs |
| S9 | Settings | workspace locale/currency (informational defaults read at creation, 07a), capability consent state (kind, not vendor — credential-contract), usage window, payout methods list | getSession, getUsage |

Mobile (≤767px): **S1, S3, S4, S7 are first-class mobile-complete** (claimant capture, approver review/decision, payout recording — the three field workflows, 02); S2 composer is item-add + totals (full header editing is desktop/tablet); S5/S6/S8/S9 desktop/tablet. Every screen states its filters (P08) and its four empties per P01 (11 matrix).

## Per-screen state obligations

First-run (S1 offers the sample claim + sample pack — the planted missing-receipt blocker is the value proof); skeletons mirror final geometry per direction (P02, RTL skeletons flip); errors per 03 mapping; copy matrix in 11. The receipt review panel's draft region reserves full size before extraction starts (CLS contract, 10).

## IA decisions and rationale

- **Three role-lenses over one queue surface**: Huda, Salem, and Amal all start at `listClaims` with different filters — the pipeline is one object seen three ways; separate apps per role (an "employee app" and a "finance console") would fracture the chain's shared state, and the chain's visibility is the product's answer to the black-box approval pain (02).
- **The composer binds item rail + totals + breakdown permanently**: computation transparency is the differentiator (00) — an amount the claimant cannot decompose is exactly the spreadsheet row this product replaces.
- **Receipt review is a panel inside the composer and the approval workspace, not a separate route**: the receipt and its fields belong to the item being authored or reviewed; context survives (a standalone "receipt library" is a capture-app posture, 01's scanner-app gap).
- **Policy studio is a first-class section, not a settings tab**: the rate table is the workspace's law (02 Faisal); burying it in settings is how policies go stale (the two-year-old memo, 00).
- **Payouts has its own screen (S7)**: recording what actually moved is the finance buyer's closing ritual and the no-ERP boundary's evidence artifact — the stamp moment (05) lives here, not in a modal.
- **Queue (S8) is small but first-class**: exports (and slow assist runs) are the product's async Jobs (async-contract §7).
