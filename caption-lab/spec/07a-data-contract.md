# 07a — Data Contract: caption-lab

Backend-agnostic. Non-AI product (declared): all operations deterministic (alignment uses declared algorithm parameters, not model inference; 00 exclusion holds).

## Entities
**Workspace** — id, name, defaultLocale, policies (numeral policy, tashkeel policy defaults, audience presets). State: active.
**Project** — id, workspaceId, title, mediaRef? (abstract file reference — may be absent), duration?, policies in effect, status (importing|refining|ready|exported-versions-exist). State machine per CP flows.
**Cue** — id, projectId, index, timeStart, timeEnd (canonical ms), text, lines[] (applied break), state (proposed|verified|locked), speedCPM (derived), flags (over-gate|too-long|overlap|bidi-complex), revisionHistory[]. Immutable timecode edits are revisioned.
**StylePreset** — id, workspaceId, name, version, spec {font family+weight, sizePolicy, stroke, shadow, background, position, safeMargins, maxLines}, legibilityChecks {contrast, sizeMatrix}. Shared + versioned (Huda's desk).
**ExportBundle** — id, projectId, presetId+version, formats[], flags (has-proposed-cues watermark etc.). The Job per async-contract.
**ExportArtifact** — id, bundleId, format, expiresAt, regenerable.
**ActivityEntry** — P17 (imports, policy applications, exports with preset versions).

## Relationships
Workspace 1—N Project/StylePreset; Project 1—N Cue; ExportBundle 1—N ExportArtifact; Cue revisions 1—N.

## Operations
Projects: list/get/create/archive. Import: createProject(mediaRef?, transcript input) → alignment Job producing cues (proposed or verified by input quality). Cues: list(query: filter by state/flags/over-gate; sort by index/time; cursor), get, update (text/lines/timing with baseRevision → ConflictError), nudgeTiming(frame delta), splitCue (confirmation-required), bulkApply(policy|break-rules) Job. Presets: list/get/save(versioned)/duplicate/import(validated). Preview: requestFrame(mediaRef, time) Job. Export: createBundle(Job, per-format results), getArtifact, renew. Workspace/session/usage per baseline.

## State obligations
Cue "proposed" state watermarks exports (CP-4 edge); preset versions pin into bundles (reproducibility); bulk operations follow partial-results policy; alignment is a Job with honest progress (per-cue determinate); no entity names any provider — media refs and file outputs are abstract references.
