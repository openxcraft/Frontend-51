# Expense Claim Flow
Separate frontend project · family: business_ops · tier: 2 · adapter: ExpenseClaimAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs expense-claim-flow`).

## Spec traceability (source: ../specs-source/expense-claim-flow/)
- Screens (9): Claims home · Claim composer · Receipt review panel · Approval workspace · Policy studio · Members · Payouts & export · Jobs center · Settings
- Adapter operations (30): getSession, listClaims, getClaim, createClaim, updateClaim, addClaimItem, updateClaimItem, removeClaimItem, previewItemComputation, attachReceipt, extractReceiptDraft, applyReceiptDraft, submitClaim, withdrawClaim, runPolicyCheck, listPolicyFindings, resolvePolicyFinding, decideClaim, reassignApprovalStep, recordPayout, listRateTables, getRateTable, saveRateTable, listPolicyPacks, savePolicyPack, listMembers, exportClaimPackage, getArtifact, listJobs, getUsage
- Identity: Masruf Vermilion, pairing P06 (Almarai + Inter), radius C, soft-lift, motion: energetic
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
