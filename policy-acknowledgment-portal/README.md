# Policy Acknowledgment Portal
Separate frontend project · family: business_ops · tier: 3 · adapter: PolicyAcknowledgmentAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs policy-acknowledgment-portal`).

## Spec traceability (source: ../specs-source/policy-acknowledgment-portal/)
- Screens (11): Policies register · Policy detail · Version publish · Campaign composer · Coverage console · Person history · Ledger · Evidence pack · People & segments · Settings · Jobs console
- Adapter operations (33): getSession, listPolicies, getPolicy, createPolicy, updatePolicyMetadata, publishPolicyVersion, listPolicyVersions, getPolicyVersion, withdrawPolicyVersion, listPeople, createPerson, importPeople, updatePerson, listSegments, createSegment, updateSegment, createCampaign, updateCampaign, listCampaigns, getCampaign, cancelCampaign, listAcknowledgments, getAcknowledgment, listMyAssignments, getPolicyVersionForReader, recordView, submitAcknowledgment, submitDecline, listLedger, exportEvidencePack, getArtifact, listJobs, getUsage
- Identity: Ittibaq Denim, pairing P01 (IBM Plex Sans Arabic + IBM Plex Sans), radius B, flat-line, motion: minimal
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
