# Podcast Publish Kit
Separate frontend project · family: content_tools · tier: 3 · adapter: PodcastPublishKitAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs podcast-publish-kit`).

## Spec traceability (source: ../specs-source/podcast-publish-kit/)
- Screens (9): Episodes board · Episode workbench · Transcript import surface · Suggestion review panel · Notes composer zone · Checklist drawer · Packages library + detail · Jobs center · Settings
- Adapter operations (35): getSession, getUsage, listShows, createShow, updateShow, listEpisodes, createEpisode, getEpisode, updateEpisode, importTranscript, getTranscript, listSegments, updateSegment, suggestChapters, listChapters, createChapter, updateChapter, deleteChapter, getShowNotes, saveShowNotes, getEpisodeChecklist, setChecklistSignOff, buildPublicationPackage, listPackages, getPackage, deliverPackage, listChannelCredentials, saveChannelCredential, verifyChannelCredential, revokeChannelCredential, listJobs, getJob, cancelJob, getArtifact, renewArtifact
- Identity: Midyar Olive, pairing P14 (Rubik + Space Mono), radius C, soft-lift, motion: energetic
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
