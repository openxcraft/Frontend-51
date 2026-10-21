# 07a — Data Contract: bilingual-content-calendar

SME-G pass · Backend-agnostic. Non-AI product (declared): no generation/inspection entities exist; all operations are deterministic planning operations.

## Entities

**Workspace** — id, name, defaultLocale, calendarMethod (declared + disclosed, e.g., Umm al-Qura), channels[]. State: active|archived.
**Channel** — id, workspaceId, name, dailyLimit?, localePolicy (both|ar|en). State: active|paused.
**Horizon** — id, workspaceId, title, kind (month|season|custom), range {start, end}, seasonConfig?. State: planning|in-review|approved|exported-versions-exist.
**Moment** — id, libraryRef, name (ar/en), kind (ramadan|eid|whiteFriday|nationalDay|custom), dateAnchor, timingPattern? (iftar/suhoor windows, quiet hours), city?. State: planned|placed.
**Slot** — id, horizonId, channelId, scheduledAt (both calendars derived from canonical instant), title, kind (paired|single-locale), status (empty|briefed|drafted|approved), parityState (both-ready|one-missing|diverged — derived), overrideReason?. State machine: empty→briefed→drafted→approved (per variant, aggregated on slot).
**Variant** — id, slotId, locale (ar|en), status, content? (brief or final copy), ownerId?, divergenceNote?. Slot 1—2 Variant (paired) or 1—1 (single-locale).
**Comment** — id, slotId, variantId?, body, authorId, state (open|resolved).
**Job** — id, kind (applyPattern|export), input, state per async-contract §2, perSlotResults[].
**ExportArtifact** — id, jobId, horizonId, format, expiresAt.
**ActivityEntry** — actor-action-target-timestamp (P17), including overrideReason entries.

## Relationships
Workspace 1—N Channel/Horizon; Horizon 1—N Slot; Slot 1—N Variant/Comment; Horizon 1—N Moment(placed); Job 1—0..1 ExportArtifact.

## Operations
Horizons: list/get/create/update/setStatus. Slots: list(range, filter: channel/status/parity; sort: time; cursor page), get, create, update, move (reschedules), delete (undo window). Variants: set status/content/owner; markDiverged with note. Moments: listLibrary, place, remove, applyPattern (Job, bulk). Review: getReviewSummary (conflicts + parity gaps), addComment, resolveComment, approveHorizon. Export: createJob, getArtifact. Workspace: getSession, settings, channels CRUD.

## State obligations
Every structural mutation is revision-logged via ActivityEntry; slot moves are undoable (P03); bulk pattern application follows async-contract partial-results policy (per-slot success/failure). No entity references any provider — channels are abstract labels, NOT connections (the product does not authenticate to any external system; that boundary is the commerce family's concern).
