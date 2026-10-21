# Asset Register Tracker
Separate frontend project · family: business_ops · tier: 3 · adapter: AssetRegisterAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs asset-register-tracker`).

## Spec traceability (source: ../specs-source/asset-register-tracker/)
- Screens (10): Registry home · Asset detail · Labels (batches) · People · Places & Categories · Activity · Jobs · Settings · Export studio · Scan companion (mobile)
- Adapter operations (24): getSession, listAssets, createAsset, getAsset, updateAsset, retireAsset, listCategories, createCategory, listLocations, createLocation, requestLabelBatch, getLabelBatch, confirmLabelApplied, reportLabelState, recordCustodyEvent, listCustodyEvents, lookupByScan, listPeople, createPerson, listActivity, listJobs, exportRegister, getArtifact, getUsage
- Identity: Sijill Steel, pairing P06 (Almarai + Inter), radius B, flat-line, motion: minimal
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
