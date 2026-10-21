# Kpi Alert Watch
Separate frontend project · family: analytics · tier: 3 · adapter: KpiAlertWatchAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs kpi-alert-watch`).

## Spec traceability (source: ../specs-source/kpi-alert-watch/)
- Screens (10): Console home · Feed workspace · Watch editor · Detections triage · Detection detail · Digest view · Season calendar · Jobs console · Settings · Command palette (overlay)
- Adapter operations (27): getSession, createFeed, listFeeds, getFeed, getMetricSeries, ingestMetricPoints, syncMetricFeed, createWatch, listWatches, getWatch, updateWatch, deleteWatch, listSeasonWindows, upsertSeasonWindow, runEvaluation, listDetections, getDetection, updateDetectionStatus, narrateDetection, listDigests, getDigest, generateDigest, deliverDigest, getDigestPreferences, updateDigestPreferences, listJobs, getUsage
- Identity: Tanbih Magenta-Plum, pairing P12 (Harmattan + Work Sans), radius B, soft-lift, motion: energetic
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
