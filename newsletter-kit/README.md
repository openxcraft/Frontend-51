# Newsletter Kit
Separate frontend project · family: content_tools · tier: 3 · adapter: NewsletterKitAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs newsletter-kit`).

## Spec traceability (source: ../specs-source/newsletter-kit/)
- Screens (6): Issues home · Issue composer · QA & preview studio · Subscribers · Send desk · Settings
- Adapter operations (26): getSession, listIssues, getIssue, createIssue, updateIssueContent, duplicateIssue, runQaChecklist, listQaResults, suggestSubjectVariants, listSubscriberLists, createSubscriberList, listSubscribers, updateSubscriber, removeSubscribers, importSubscribers, resolveImportRows, listDeliveryChannels, verifyDeliveryChannel, scheduleSend, getJob, listJobs, cancelJob, retryJob, exportIssue, getArtifact, getUsage
- Identity: Zaytoun Marigold, pairing P10 (El Messiri + Lora), radius C, soft-lift, motion: calm
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
