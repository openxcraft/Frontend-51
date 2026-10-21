# Loyalty Stamp Card
Separate frontend project · family: commerce_integrations · tier: 3 · adapter: LoyaltyStampAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs loyalty-stamp-card`).

## Spec traceability (source: ../specs-source/loyalty-stamp-card/)
- Screens (11): Console home · Stamper · Card studio · Programs · Members ledger · Member detail · Member pass (customer-facing) · Insights · Staff & audit · Settings · Command palette (overlay)
- Adapter operations (28): getSession, createProgram, updateProgram, setProgramStatus, listPrograms, getProgram, lookupMember, getMemberCard, issueStamp, undoStamp, redeemReward, adjustStamps, enrollMember, listMembers, getMember, updateMember, setMemberStatus, createPassToken, getPassView, listStaff, createStaffMember, setStaffStatus, listAuditEntries, getProgramInsights, exportMembers, getArtifact, listJobs, updateWorkspaceSettings
- Identity: Wafa Rose, pairing P13 (Baloo Bhaijaan 2 + Plus Jakarta Sans), radius D, soft-lift, motion: calm
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
