# Abandoned Cart Recovery
Separate frontend project · family: commerce_integrations · tier: 2 · adapter: AbandonedCartAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs abandoned-cart-recovery`).

## Spec traceability (source: ../specs-source/abandoned-cart-recovery/)
- Screens (11): Recovery queue · Cart detail · Sequence studio · Template library + generation dock · Routing & incentives · Quiet-hours policy center · Send ledger · Suppression ledger · Recovery report · Jobs center · Settings
- Adapter operations (33): getSession, importCarts, listCarts, getCart, createSequence, listSequences, getSequence, updateSequence, setSequenceStatus, listTemplates, saveTemplate, approveTemplate, retireTemplate, generateMessageVariants, getDraftVariantSet, promoteDraftVariant, getRoutingPolicy, updateRoutingPolicy, listQuietHourPolicies, saveQuietHourPolicy, previewSchedule, listSends, assignSequence, cancelCartRecovery, recordShopperEvent, addSuppression, listSuppressions, removeSuppression, getRecoveryReport, exportRecoveryPackage, getArtifact, listJobs, getUsage
- Identity: Istijad Rosewood, pairing P05 (Tajawal + Hanken Grotesk), radius B, soft-lift, motion: energetic
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
