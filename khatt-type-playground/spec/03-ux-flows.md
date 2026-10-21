# 03 — UX Flows: khatt-type-playground

SME-C pass · 5 critical flows · Every 07b operation covered by ≥1 flow (table at end — no orphans).

## CP-1 — Catalog exploration & glyph inspection (value proof)

1. Boot: `getSession` resolves seat + locale; catalog rail opens (`listFontProfiles`; script chips All · Arabic · Latin).
2. Filter (script, category, license badge, feature support incl. kashida-aware, Arabic-normalized search); cursor pagination; filtered state always declared (P01/P08).
3. Card → font detail (`getFontProfile`): weights, styles, variable axes, feature list with script scope, kashida class, coverage, curated notes (`listPairingNotes` — human-authored, source-labeled).
4. Glyph grid (`listGlyphs`, per Unicode block, paged) → inspector (`getGlyph`): codepoint, name, joining forms (isolated/initial/medial/final), alternates, components.
5. Preview renders from the font file (`getFontFile`: weight + subset; progressive, metric-matched fallback).
6. **Licensed-font upload (edge)**: `uploadFontFile` with license attestation (names the consequence); `pending` until parse; parse failure → VALIDATION with details; unattested → VALIDATION refusing (never silently accepted).

**Edges**: `jalt`-less font — kashida controls disabled-with-reason; 400/700-only weights — axis clamps to reality (no synthetic bold); filtered-empty → reset offered. **Failures**: catalog/network typed errors (retry keeps filters); glyph page failure (scoped retry, state kept). **Recovery**: reads re-queryable; upload retriable without re-attesting (P11).

## CP-2 — Pairing session setup & bench work (daily loop)

1. New session → pick Arabic + Latin font; `createPairingSession`; canvas opens two-script blocks at a default shared scale.
2. Controls: weight per script, optical size, base size + ratio, leading, tracking (Latin-only; states why Arabic tracking is structurally zero), numeral toggle.
3. Commits via `updatePairingSession` (patch + baseRevision); P10 autosave cycle; stale → CONFLICT, both versions shown (never silent overwrite).
4. Swap/replace a font; blocks re-render from new `getFontFile` resolution, scale preserved.
5. List (`listPairingSessions`) + resume (`getPairingSession`); comparator pins a second session A/B with settings diff.

**Edges**: leading below Arabic floor (1.6; 1.8 tashkeel-on) → clamped with stated reason; missing weight → nearest re-bound, noted inline. **Failures**: font-file fetch → fallback-rendered block + typed retry; cross-tab conflict. **Recovery**: sessions persist per adapter; destructive resets carry P03 undo.

## CP-3 — Kashida & contextual alternates lab (unique feature)

1. On a justified Arabic block, open the kashida panel: mode — Off · Tatweel (تطويل) · Justification alternates (`jalt`) — intensity slider, word-spacing floor (keyboard-operable; 2.5.7 equivalents).
2. `setKashidaSettings` commits; block re-renders; per-line readout lists stretched lines and warns where joins broke (the documented failure — inspection, not decoration).
3. Alternates panel per script role: toggles (`calt`, `liga`, `dlig`, `ss01`…, `jalt`, `kern`, mark positioning) — each `setAlternateSelection`; unavailable features disabled citing the font's actual feature list.
4. Same line pinned at two settings with a text description of what changed (joins, stretch points) for screen readers.
5. Provenance: pairing notes may cite foundry guidance on justification behavior; source labels shown (curated data, non-generated — AI stance honored).

**Edges**: `jalt` on tatweel-only font → disabled + reason; intensity 0 with mode on → honest no-op; Latin blocks never show kashida controls (script-scoped). **Failures**: VALIDATION on impossible combos. **Recovery**: settings are session state — resumable; toggles reversible.

## CP-4 — Specimen composition & numeral proof

1. "Compose specimen" → `createSpecimen` with default blocks (pair-headline, body ×2, numeral-run, mixed-line, feature-notes).
2. Block editor: edit text; per-block overrides (size, weight, alignment start-only — justification reserved for the kashida demo); reorder with keyboard equivalents (P18/2.5.7).
3. Numeral-run block renders Western + Arabic-Indic (٠–٩) side by side as content; chrome numerals follow AR-indic default (05).
4. Save/version: `updateSpecimen` (blocks + baseRevision; CONFLICT ladder); draft → final is an explicit promotion naming what finalizes.
5. Library (`listSpecimens`) + read view (`getSpecimen`) — settings panel prints weights, scale, kashida mode, alternates on the artifact (committee input).

**Edges**: empty custom block = real user draft (kept); worst-case Arabic test strings pre-loaded ("مستشارو التدقيق والحوكمة" line-fit, rtl-rules §4). **Failures**: VALIDATION on size out of scale bounds (states the bound); stale revision CONFLICT. **Recovery**: versions retained; drafts never lost on cancel.

## CP-5 — Export, share & job handling

1. Export → format (specimen sheet · image sheet · CSS tokens · JSON spec) + options (numeral rendering, settings panel); `exportSpecimen` → Job (P12: visible, honest, cancellable).
2. Job surface (`listJobs`): state, progress in units, cancel within one interaction (`cancelJob`); completion delivers in-context with artifact link + expiry.
3. Artifact retrieval (`getArtifact`: URL + expiresAt); expired → NOT_FOUND + `renewArtifact` (declared retention path).
4. Share view: read-only specimen with settings provenance for reviewers; no tool-knowledge required.
5. Usage (`getUsage`): honest counters (P14); no paywall mid-bench.

**Edges**: export while fonts loading → job pauses with reason; CSS/JSON exports force Western numerals in LTR-isolated code containers. **Failures**: RATE_LIMIT (export window) with what keeps working; per-block render failure → partial results + scoped retry (async-contract §4). **Recovery**: exports regenerable from specimen state; offline queue flushes on reconnect (P20).

## Non-happy paths

- **First-run**: bench opens on a seeded demo pairing (catalog Naskh + catalog serif) with the value checklist (P22: inspect a glyph → tune the pairing → export a specimen); no tour balloons.
- **Font-file capability unavailable** (08): catalog + glyph data text-first; canvas renders system fallback with per-font notices; catalog-only work remains fully useful (LOOP-5).
- **Offline**: sessions/specimens read; patches and exports queue (P20); loaded fonts keep rendering.

## Failure → error mapping

ValidationError (impossible settings, unattested upload, block bounds) · NotFoundError (missing session/specimen/artifact incl. expired) · PermissionError (seat scope) · ConflictError (stale revision) · RateLimitError (export window) · NetworkError (catalog/font fetch) · UnknownError (typed, correlation-id'd).

## Flow → operation coverage table (every 07b operation, no orphans)

| 07b operation | Flows |
|---|---|
| getSession | CP-1.1, CP-2.1 |
| listFontProfiles | CP-1.1–2, CP-2.1 |
| getFontProfile | CP-1.3, CP-2.3, CP-3.3 |
| getFontFile | CP-1.5, CP-2.4, CP-5 (awaiting fonts) |
| listGlyphs | CP-1.4 |
| getGlyph | CP-1.4 |
| listPairingNotes | CP-1.3, CP-3.5 |
| uploadFontFile | CP-1.6 |
| createPairingSession | CP-2.1 |
| listPairingSessions | CP-2.5 |
| getPairingSession | CP-2.5–6 |
| updatePairingSession | CP-2.3–4 |
| setKashidaSettings | CP-3.2 |
| setAlternateSelection | CP-3.3 |
| createSpecimen | CP-4.1 |
| updateSpecimen | CP-4.2–4 |
| listSpecimens | CP-4.5 |
| getSpecimen | CP-4.5, CP-5.4 |
| exportSpecimen | CP-5.1 |
| getArtifact | CP-5.3 |
| renewArtifact | CP-5.3 |
| listJobs | CP-5.2 |
| cancelJob | CP-5.2 |
| getUsage | CP-5.5 |
