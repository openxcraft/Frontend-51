# 07c — Mock Adapter: brand-voice-guardian

In-memory, deterministic, zero deps. Implements `GuardianAdapterV1`.

## Seeds (fixed)
- **Profiles** (2): "Retail Voice" (calibrated: 48 terms, 12 banned incl. 2 regulated with citations, 6 samples; register mSA-middle) and "Draft — Fintech" (partial: 9 terms, 3 banned, 0 samples, uncalibrated — exercises partial-profile posture).
- **Seeded text corpus** (4 fixed documents): doc-1 retail Arabic with 3 terminology misses + 1 banned superlative + 2 register slips ("هيّا يلا" in mSA-middle context); doc-2 mixed ar/en with a Latin regulated phrase and bidi-sensitive spans; doc-3 clean (drives CleanPassStamp); doc-4 with overlapping finding spans (nested display) and a conflicting-term trigger.
- **Runs/Records**: 6 historical records with resolved/dismissed findings (dismiss reasons seeded); one record from profile version 3 (profile now at 5 — version pinning visible).
- **Jobs**: one completed terms-import (44 imported, 1 conflict listed), one calibration job, one expired report artifact.

## Behavior
- `runCheck`: deterministic findings computed by exact-match rules over seeds (Arabic normalization applied); register slips flagged on the seeded phrases; partial profile → only banned/terminology classes + `degraded.registerHeuristicOnly` NOT set (that flag is for AI-unavailable runs, injectable via config); run state machine per async-contract with 400ms running phase.
- `resolveFinding`/`bulkResolve`: state transitions + ActivityEntry; bulk skips accepted items deterministically.
- `updateProfile` stale version → CONFLICT with both versions in details.
- `exportReport`: regenerable; expired artifact → NOT_FOUND + renewal path; batch of recordIds → single artifact job with per-record sections.
- Error injection per method: MockConfig {latencyMs, errorRate, errorCode, aiUnavailable?} — aiUnavailable=true flips register class to heuristic warnings (labeled in findings) proving deterministic core survives.
- Test-support: reset/snapshot/replay. No randomness, no network, fixed correlationIds `gv-corr-0001`…
