# 07a — Data Contract: arabic-copy-studio (backend-agnostic)

SME-G pass · Entities, relationships, operations, states. Every entity/operation below is justified by a flow in 03; every operation appears as an adapter method in 07b (no orphans, either direction). No backend, provider, storage, or transport is named — this is the source of truth from which any backend can be built or bound.

## Entities

**Workspace** — id, name, defaultLocale (ar|en), defaultRegister, tashkeelPolicy, numeralsPolicy, createdAt. State: active | archived.
**Member** — id, workspaceId, identityRef (session-scoped, provider-agnostic), role (owner|editor), addedAt. State: invited | active | removed.
**BrandKit** — id, workspaceId (1:1), voiceTraits[], sampleCopy[], bannedTerms[], registerHint. State: empty | partial | complete (drives "unbranded" AI treatment in CP-1).
**GlossaryTerm** — id, workspaceId, termAr, termEn, definition, doNotUse[], register, conflictGroup?. Terms are workspace-scoped (Hussein's separation guarantee, 02). **Conflict state**: two terms sharing a conflictGroup with contradictory definitions = `conflicted` — surfaced, never auto-resolved (CP-4, LOOP-9 surface).
**Document** — id, workspaceId, title, locale, register, tashkeelEnabled, dialectFlag (none|detected:region|accepted:region), blocks[] (typed: paragraph|heading|list|cta), status, currentRevisionId, pairedDocumentId? (bilingual linkage from CP-3), createdAt/updatedAt.
  - **Document states**: draft → in-review → approved → amended → archived. Approved→edit = amended (re-approval required, CP-5).
**Revision** — id, documentId, blocks[], actorId, createdAt, changeSummary. Immutable. Conflict detection uses baseRevisionId on write (CP-2 concurrency).
**Comment** — id, documentId, blockAnchor, body, authorId, state (open|resolved).
**Suggestion** — id, documentId, blockAnchor, kind (rewrite|tighten|register|glossary), beforeSpan, afterText, state (pending|accepted|rejected), revisionId?.
**GenerationHandle** — id, brief, streamEvents[] (token|anchor|citation|stalled|done|failed|quotaBlocked), createdAt. Streaming state machine per ai-native-patterns §2.
**Job** — id, kind (transform|export|glossary-import|glossary-check), input, state machine per async-contract §2, progress, partialResults[].
**ExportArtifact** — id, jobId, documentId, format, localeBundle[], expiresAt (async-contract §2 expired state).
**UsageLedger** — workspaceId, window, metered operations count, quota rung. Drives P14 surfaces.
**ActivityEntry** — actor-action-target-timestamp per P17; includes credential-class events if integrations are later bound (credential-contract §5).

## Relationships

Workspace 1—N Member, 1—1 BrandKit, 1—N GlossaryTerm, 1—N Document. Document 1—N Revision, 1—N Comment, 1—N Suggestion, 1—N Job; Document 1—0..1 pairedDocument (self-relation, CP-3). Job 1—0..1 ExportArtifact. All list-bearing relations paginate via the typed Page model (07b).

## Operations (read/write/subscribe)

- Documents: list (query: filter by status/locale/register/collection; sort: updated|created|title; search; cursor page), get, create, updateBlocks (with baseRevisionId → ConflictError on divergence), updateStatus, archive.
- Generation: start (brief, register, locale, length policy, glossary enforcement flag), subscribe (stream events), stop, regenerate.
- Refinement: start (selection anchor, kind, note), accept/reject (→ Revision).
- Transform: create job, get job, commit transform (→ paired document + revisions).
- Inspection: inspectText (register report, dialect report, glossary hits, banned terms) — read-only.
- Glossary: list (query), upsert, resolveConflict, import job, export.
- BrandKit: get, update.
- Review: addComment, resolveComment, requestChanges, approve.
- Export: create job, list artifacts, download link within expiry.
- Workspace/usage/session: getSession (auth-agnostic session model), getUsage, getQuotaPolicy, workspace settings, member ops.

## State obligations summary (per entity)

Every async operation state machine follows async-contract §2; every AI operation honors the quota ladder (ai-native-patterns §5) and draft-by-default promotion (§6). Document lifecycle transitions are audited in ActivityEntry. No entity references a provider, transport, or external system by name — external touchpoints are abstract needs in 08 only.
