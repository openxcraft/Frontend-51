# 03 — UX Flows: brand-voice-guardian

## CP-1 — Brand profile setup (the 30-minute commitment)
1. Create profile from the profiles list (S3 — listProfiles): name, declared register (بيضاء/وسطى), locales in scope (createProfile).
2. Glossary builder: add preferred terms (ar+en pairs optional), do-not-use lists (updateProfile, versioned); paste-import a term sheet (importTerms Job — manual alternative always present).
3. Banned terms + optional regulated-phrases list (Tariq) — same versioned updateProfile write.
4. Optional sample-copy upload (calibrate Job) → profile marked "calibrated" (drift thresholds informed by samples).
5. Save; the profile health surface (getProfile — the S4 editor load) shows coverage (terms, banned, samples) — first-run checklist (P22).

**Edges**: contradictory terms imported (conflict state carried per glossary rules; resolution is an explicit choice — LOOP-9 surface, same discipline as studio's CP-4); register declaration conflicts with sample copy register (warning card, choice: re-declare or recalibrate); empty profile run (allowed — findings limited to banned-terms + basic register, clearly labeled "partial profile").
**Failures**: import parse failure (typed error with row numbers); calibration analysis timeout (job per async-contract, retry).
**Recovery**: profile is versioned; changes are diffable (P16).

## CP-2 — Governance pass (the daily value loop)
1. Check surface: paste text or upload a supported file (abstract parse need — paste always works).
2. Choose profile (listProfiles — defaults to last) + run pass (runCheck Job, <2s for typical paste — still modeled as job for files; getRun reads state/progress and the degraded flag).
3. Findings review (listFindings): list grouped by class (terminology / banned / register / consistency), each finding shows span, rule, suggested fix (word/phrase level only — 00 exclusion), and accept-fix / dismiss-with-reason (resolveFinding); sweep-clears bulk-resolve by class (bulkResolve Job — the B-key path, 09 CP-2).
4. Resolved state produces a pass record (actor, timestamp, profile version) — the audit unit.

**Edges**: mixed ar/en text (bidi-safe span highlighting; Latin runs checked against en rules); finding spans overlap (priority: banned > terminology > register; overlaps shown nested); text longer than limits (typed limit copy, split suggestion with one click).
**Failures**: job failure (typed error, retry — no partial silence); quota (RATE_LIMIT ladder per P14 — usage window + reset read via getUsage).
**Recovery**: every pass record is retained and re-openable; dismissed findings carry reasons in the record.

## CP-3 — Report & audit export (Tariq's path)
1. Pass history list (listRecords — S5; filter by date/profile/author).
2. Open record (getRecord, S6) → export audit report (exportReport Job — structured file: findings, resolutions, actors, timestamps, profile version).
3. Artifact with expiry per async-contract (getArtifact); re-generable from record at any time.

**Edges**: export spanning multiple records (batch export job); profile changed since a record (report pins the profile VERSION used — governance honesty).
**Failures**: export quota (RATE_LIMIT); expired artifact (renew).
**Recovery**: records immutable; reports regenerate.

## Non-happy paths
- **Zero findings**: a clean-pass state with equal craft ("Clean pass — 0 findings against 214 rules checked") — the success state IS a feature for Salma.
- **Degradation** (AI-reduced rungs if register analysis capability is bound later): banned/terminology checks always run (deterministic rules); register drift degrades to heuristic warnings labeled as such; at rung 4 only deterministic checks run. Core value (deterministic governance) survives fully — LOOP-5 posture.
- **Offline**: paste checks queue? No — checks require the adapter; offline banner (P20) with queue only for report exports. Honest boundary.

## Failure→error mapping
ValidationError (profile fields/limits) · NotFoundError (record deleted) · PermissionError (profile scoped to another workspace) · ConflictError (concurrent profile edit) · RateLimitError (pass/export quota) · NetworkError · UnknownError.

## Operation coverage table (every 07b operation; no orphans)

| Op | Flow step (above) that exercises it |
|---|---|
| getSession | App entry · first paint — the auth-agnostic session surface (role owner/checker, locale ar/en) read once on entry (reflected in S8 settings, 04); not forced into a CP step |
| listProfiles | CP-1.1 (S3 profiles list), CP-2.2 (choose profile — defaults to last) |
| getProfile | CP-1.5 (profile health/coverage surface; S4 editor load) |
| createProfile | CP-1.1 |
| updateProfile | CP-1.2/CP-1.3 (terms, banned, regulated phrases; versioned writes), CP-1.5 save |
| importTerms | CP-1.2 (term-sheet paste-import Job) |
| calibrate | CP-1.4 (sample-copy upload → drift thresholds) |
| runCheck | CP-2.2 (run pass; the CP-2.1 paste/upload surface is its input, S1) |
| getRun | CP-2.2 (job state/progress; degraded flag per 07b rule 3) |
| listFindings | CP-2.3 (grouped findings, S2) |
| resolveFinding | CP-2.3 (accept-fix / dismiss-with-reason) |
| bulkResolve | CP-2.3 (bulk by class — the B-key sweep) |
| listRecords | CP-3.1 (pass history, S5) |
| getRecord | CP-3.2 (open record, S6) |
| exportReport | CP-3.2 (audit report Job; batch export per CP-3 edges) |
| getArtifact | CP-3.3 (artifact with expiry; renew per CP-3 failures) |
| getUsage | CP-2 failures (quota ladder usage window + reset, P14) |

17 operations, 0 orphans — every 07b operation appears above exactly once (scripted coverage check verified).
