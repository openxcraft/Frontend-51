# 03 — UX Flows: caption-lab

## CP-1 — Import to first refined captions (value proof)
1. Projects home (`listProjects`) → New project (`createProject`): upload media reference + transcript file (or paste transcript with timecodes; manual paste is the always-path).
2. Alignment pass: transcript cues map to a timeline (Job; existing timecodes honored, untimecoded text gets auto-cue proposal marked "proposed — verify").
3. Baseline caption grid renders — project shell + policies via `getProject`, cue rows via `listCues`: timecodes, text, duration, reading-speed meter.
4. First refinement: select a cue → line-break workbench (`suggestBreaks`) suggests RTL-safe breaks; numeral policy applied; tashkeel toggle with legibility warning at small burn sizes.
5. Project autosaves (P10); onboarding checklist marks "first project refined".

**Edges**: transcript without timecodes (auto-cue proposals queued for verification — never silent); media duration shorter than transcript span (validation warning with trim suggestion); mixed-language transcript (bidi-isolated Latin runs inside Arabic cues); dialect-heavy text (flagged as "transcript quality note", not corrected — we don't rewrite content).
**Failures**: alignment job failure (typed error, retry); unsupported transcript format (VALIDATION with format list).
**Recovery**: project state continuous; cue edits undoable (P03).

## CP-2 — Refinement loop (the daily craft loop; keyboard-critical)
1. Navigate cue grid with arrows (P18).
2. Per cue: apply line-break suggestion (Tab to preview, Enter to apply); edit text inline (P06; `updateCue` writes with baseRevision); adjust timing (frame-level `nudgeTiming` with [ ] keys).
3. Reading-speed gate flags cues over threshold (per audience preset: e-learning 17 CPM, broadcast 20 CPM, lecture 15 CPM).
4. Batch operations: apply numeral policy / tashkeel policy / line-break rules across selection (`bulkApply` Job; P07 bulk bar).

**Edges**: cue text too long for duration at ANY break (warning with `splitCue` proposal — split requires confirmation); tashkeel on with small burn size (legibility warning per policy); back-to-back cues overlapping after timing nudge (auto-gap check + fix proposal); line-break rule conflicts with punctuation mirroring (workbench shows both options — editor decides).
**Failures**: bulk operation partial failure (per-cue results, retry failed-only per async-contract §4); concurrent editor (ConflictError per cue with both versions).
**Recovery**: every edit is cue-revisioned; cue history restores.

## CP-3 — Style studio & burn-in spec (Mariam's reproducibility)
1. Create/choose a style preset (`listPresets` picker): font family/weight (from Arabic-safe caption list), size policy (relative to video height), stroke/shadow/background, position, safe margins, line count max.
2. Live preview over scrubber (`requestPreview` stills Job; uses media reference frames).
3. Legibility linter: contrast pair check vs declared video background samples; small-size tashkeel warning; stroke weight vs weight matrix.
4. Save preset as workspace-shared (`savePreset`, versioned; Huda's desk presets).
5. Export bundle: caption files (standard formats) + burn-in spec sheet (render instructions document) + preview stills.

**Edges**: preset conflicts with project numeral policy (warning + resolution); dark and light video sections (dual-contrast check option); client-supplied preset import (`importPreset` — validated, conflicts listed).
**Failures**: preview render job failure (typed error + retry); export quota (RATE_LIMIT).
**Recovery**: presets versioned; spec sheet regenerable from project state.

## CP-4 — Export queue (the delivery path)
1. Export request (`exportProject`): formats, preset, watermark option; Job per async-contract with per-format progress.
2. Delivery: `getArtifact` links with expiry (7-day default), renewable via `renewArtifact`.
3. Delivery record in activity log (who exported what, when, with which preset version).

**Edges**: exporting with cues still in "proposed" state (explicit warning, allowed with flags in the file); mixed-format bundle (one job, per-format results).
**Failures**: format-level failure within bundle (partial delivery + per-format retry — async-contract §4).
**Recovery**: exports re-generate from project state — artifacts are projections.

## Non-happy paths
- **No media, transcript only** (audio-less refinement): grid works without preview; style studio preview disabled with honest copy.
- **Degradation**: core refinement (line-breaks, timing, policies, exports) is deterministic — no AI declared (00); nothing degrades except optional future auto-alignment (abstract N3 in 08).
- **Offline**: banner P20; cue edits queue; exports require reconnect.

## Failure→error mapping
ValidationError (formats/limits) · NotFoundError (project/cue gone) · PermissionError · ConflictError (concurrent cue edit) · RateLimitError (export quota) · NetworkError · UnknownError.

## Flow → operation coverage table (every 07b operation; no orphans)

| # | 07b operation | Flow (step) | Screen |
|---|---------------|-------------|--------|
| 1 | `getSession` | App entry · session boot (locale ar/en, role) — every screen's shell, exercised on entry by all three personas in 02; not an authored CP step | all |
| 2 | `listProjects` | CP-1.1 (Projects home → New project) | S1 |
| 3 | `createProject` | CP-1.1–2 (import + alignment Job) | S2 |
| 4 | `getProject` | CP-1.3 (project shell + policies on grid open) | S3 |
| 5 | `listCues` | CP-1.3 (baseline grid), CP-2.1 (paged grid navigation) | S3 |
| 6 | `updateCue` | CP-1.4 (first refinement write), CP-2.2 (inline edit, baseRevision) | S3, S4 |
| 7 | `nudgeTiming` | CP-2.2 (frame-level nudge, [ ] keys) | S4 |
| 8 | `splitCue` | CP-2 edge (too-long cue → confirmed split) | S3, S4 |
| 9 | `suggestBreaks` | CP-1.4 / CP-2.2 (workbench options — read-only, applied via `updateCue` per 07b rule 3) | S4 |
| 10 | `bulkApply` | CP-2.4 (numeral / tashkeel / break-rules across selection) | S3 |
| 11 | `listPresets` | CP-3.1 (preset picker) | S5, S8 |
| 12 | `savePreset` | CP-3.4 (workspace-shared save, versioned) | S5 |
| 13 | `importPreset` | CP-3 edge (client-supplied preset, conflicts listed) | S8 |
| 14 | `requestPreview` | CP-3.2 (scrubber stills Job), CP-3.5 (export-bundle stills) | S5 |
| 15 | `exportProject` | CP-4.1 (formats + preset + watermark, per-format Job) | S6 |
| 16 | `getArtifact` | CP-4.2 (delivery links, 7-day expiry) | S6 |
| 17 | `renewArtifact` | CP-4.2 (expiry renewal) | S6 |
| 18 | `getUsage` | Metering surface · export quota behind the RATE_LIMIT failures in CP-3/CP-4 — pre-export usage meter, not an authored CP step | S6, S9 |

18 operations, 0 orphans — every 07b operation listed exactly once. `getSession` is the session boot surface and `getUsage` the export-quota meter; both are entry/metering surfaces stated as such rather than forced into an authored step.
