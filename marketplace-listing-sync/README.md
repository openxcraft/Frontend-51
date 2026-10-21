# Marketplace Listing Sync
Separate frontend project · family: commerce_integrations · tier: 2 · adapter: MarketplaceListingAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs marketplace-listing-sync`).

## Spec traceability (source: ../specs-source/marketplace-listing-sync/)
- Screens (11): Channels home · Channel setup & rule-pack editor · Catalog · Master product editor · Field map studio · Listings board · Listing detail · Readiness console · Publish & exports · Jobs center · Settings
- Adapter operations (33): getSession, listCapabilities, listChannelTemplates, createChannel, listChannels, getChannel, updateChannel, importCatalog, listMasterProducts, getMasterProduct, createMasterProduct, updateMasterProduct, bulkUpdateMasterFields, getFieldMap, saveFieldMap, suggestFieldMappings, resolveMappingSuggestion, runComplianceCheck, getComplianceReport, listComplianceFindings, resolveComplianceFinding, createListing, bulkCreateListings, listListings, getListing, updateListing, setListingPaused, deleteListing, publishListings, exportChannelFile, getArtifact, listJobs, getUsage
- Identity: Sarraf Violet, pairing P04 (Cairo + Sora), radius B, flat-line, motion: crisp
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
