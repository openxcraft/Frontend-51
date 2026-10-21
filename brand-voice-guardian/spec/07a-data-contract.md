# 07a — Data Contract: brand-voice-guardian

Backend-agnostic. AI declaration: **conditionally-AI** — terminology/banned/consistency checks are deterministic rule engines; register-drift analysis is a declared AI operation that degrades per 03 non-happy path (deterministic core survives).

## Entities
**Workspace** — id, name, defaultLocale. State: active|archived.
**BrandProfile** — id, workspaceId, name, declaredRegister (mSA-plain|mSA-middle), locales[], glossaryVersion, state (draft|calibrated), health {terms, banned, samples, regulatedPhrases}. Versioned; edits create versions.
**GlossaryTerm** — id, profileId(version-scoped), termAr?, termEn?, definition, doNotUse[], conflictGroup?. Conflict discipline identical to studio's (explicit resolution).
**BannedTerm** — id, profileId, term (ar or en), severity, note? (regulated phrases = banned terms with regulated severity + citation requirement).
**CheckRun** — id, profileId, profileVersion, input (text or file ref), state (queued|running|succeeded|failed), counts by class. The Job entity per async-contract.
**Finding** — id, runId, class (terminology|banned|register|consistency), spanStart/End, excerpt, ruleId, suggestion?, state (open|accepted|dismissed), dismissReason?, resolvedBy, resolvedAt.
**Record** — id, runId, resolved findings snapshot, actor, timestamp, profileVersion. Immutable audit object.
**ReportArtifact** — id, recordId/batch, expiresAt, regenerable.
**ActivityEntry** — P17 discipline (profile edits, runs, resolutions, exports).

## Relationships
Workspace 1—N BrandProfile; Profile 1—N GlossaryTerm/BannedTerm (per version); Run 1—N Finding; Run 1—1 Record; Record 1—N ReportArtifact.

## Operations
Profiles: list/get/create/update(versioned)/importTerms(job)/calibrate(job). Checks: runCheck(job), getRun, listFindings(filter by class/state; sort; cursor), resolveFinding(accept/dismiss-with-reason), bulkResolve(class-scoped). Records: list(query)/get. Reports: export(job, batch-capable)/getArtifact. Session/workspace ops per baseline.

## State obligations
Records immutable (CP-3); profile version pinned per record; conflict terms block nothing silently — they surface (LOOP-9); quota ladder applies to check runs and exports (P14); every resolution appends ActivityEntry.
