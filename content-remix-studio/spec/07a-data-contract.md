# 07a — Data Contract: content-remix-studio

Backend-agnostic. AI declaration: **recipe execution may bind to an AI runner** (abstract — 08); the contract models execution uniformly; the manual checklist degradation is the declared fallback (CP non-happy path).

## Entities
**Workspace** — id, name, defaultLocale, dialectPolicy (preserve|flag-only). State: active.
**Source** — id, workspaceId, title, text, language, dialectFlag (none|detected:region), lengthStats, version (edits re-version). State: imported|edited.
**Recipe** — id, scope (stock|workspace), kind (thread|carouselOutline|emailTeaser|shortVideoScript|communityAnnouncement), structureMap[] (section: role, minLength, maxLength, toneNote), bilingualPolicy (mono|paired), version. State: draft|valid|invalid.
**Derivative** — id, sourceId (pinned version), recipeId (pinned version), locale?, blocks[], status (draft|ready|exported), editedBeyondRecipe (derived), revisions[]. State machine: draft→ready→exported-versions-exist.
**Receipt** — id, derivativeId, links[] {sourceSpan, derivativeBlock, ratio, kind (drawn|condensed|recipe-added)}, editedNote?.
**Job** — id, kind (runRecipe|export), state per async-contract, perBlockResults?.
**ExportArtifact** — id, bundleId, format, expiresAt, regenerable.
**ActivityEntry** — P17 (runs, recipe saves, exports).

## Relationships
Workspace 1—N Source/Recipe(workspace-scope)/Derivative; Source 1—N Derivative (each pins a source version); Recipe 1—N Derivative (pins recipe version); Derivative 1—1 Receipt; Job 1—N ExportArtifact.

## Operations
Sources: list(query: filter language/dialect; sort; cursor), get, create, update (re-versions). Recipes: list(stock+workspace), get, save(versioned, CONFLICT on stale), validate. Derivatives: runRecipe(sourceId, recipeId, dialect resolution) → Job producing derivative+receipt; get, update (blocks, baseRevision), regenerate(scope: single-block|whole, edit-policy), setStatus. Exports: exportDerivatives(ids, format bundle) → Job; getArtifact; renew. Session/workspace/usage per baseline.

## State obligations
Receipts pin source AND recipe versions (fidelity honesty — CP-2 edge); editedBeyondRecipe is derived, never hidden; dialect resolution choice recorded on derivative; partial block failures retriable per async-contract §4; no provider names anywhere.
