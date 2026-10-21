# Media Asset Hub
Separate frontend project · family: content_tools · tier: 3 · adapter: AssetHubAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs media-asset-hub`).

## Spec traceability (source: ../specs-source/media-asset-hub/)
- Screens (7): Library home · Asset detail (drawer/full) · Ingest console · Collections · Rights review · Activity · Settings
- Adapter operations (24): getSession, listAssets, getAsset, updateAssetMetadata, archiveAssets, updateExtractedText, createIngestJob, getIngestJob, listIngestJobs, cancelIngestJob, retryIngestItems, submitTagReview, listTags, createTag, applyTags, listCollections, getCollection, createCollection, updateCollection, modifyCollectionAssets, setRightsRecord, listRightsAlerts, getUsage, listActivity
- Identity: Nakhl Spruce, pairing P07 (Readex Pro + DM Sans), radius B, soft-lift, motion: minimal
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
