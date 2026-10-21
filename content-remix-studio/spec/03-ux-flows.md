# 03 — UX Flows: content-remix-studio

## CP-1 — Source to first derivative (value proof)
1. Add source (`createSource`): paste text or import file (abstract parse; paste always works); source lands in the library (`listSources`) with language + length auto-detected (dialect flag if detected).
2. Choose recipe from gallery (`listRecipes`: thread / carousel outline / email teaser / short-video script / community announcement; bilingual recipes produce both locales).
3. Recipe preview shows the STRUCTURE it will produce (sections, counts, length policy) before running — inspectability is the product.
4. Run recipe (`runRecipe` Job per async-contract); derivative streams/assembles in the workbench.
5. Fidelity receipt renders (`getDerivative`): source spans → derivative blocks mapping, condensation ratios, recipe additions marked.

**Edges**: dialect detected in source (choice pre-run: preserve-as-is / flag-only — never silent normalization); source too short for a recipe's structure (validation with minimum-length statement); mixed-language source (bidi-isolated spans carried into receipts).
**Failures**: recipe run failure (typed error, retry); quota (RATE_LIMIT ladder).
**Recovery**: sources and derivatives persist; runs re-executable.

## CP-2 — Derivative refinement loop (the daily loop)
1. Workbench (`getDerivative`): source (left) + derivative (right) with receipt links — click a derivative block, its source spans highlight.
2. Edit derivative text inline (P06; `updateDerivative` writes with baseRevision); structure warnings live (length policy violations, tone drift per recipe notes).
3. Re-run recipe on a single block; `regenerate` the whole derivative with current edits preserved-or-discard choice.
4. Mark derivative ready (`setDerivativeStatus`); derivatives library (`listDerivatives`) status updates.

**Edges**: manual edit diverges from receipt (receipt shows "edited beyond recipe" — honest); concurrent edit (ConflictError both versions); receipt link points to source edited later via `updateSource` (receipt pins source VERSION — governance echo).
**Failures**: block re-run failure (scoped retry); regeneration discarding edits (explicit confirm naming what's lost — P04 ladder level 2).
**Recovery**: derivative revisions retained.

## CP-3 — Recipe editing (Yasmin/Samar's control path)
1. Duplicate a stock recipe → editable copy (structure map: sections with roles, per-section length policy, tone notes, bilingual policy).
2. Edit; validate (`validateRecipe` — structure sanity: counts, min/max lengths); save as personal/workspace recipe (`saveRecipe`, versioned).
3. Run (`runRecipe`) on an existing source; compare outputs across recipe versions (diff view P16).

**Edges**: invalid structure (validation with precise field errors); recipe references unavailable source type (typed mismatch error); client workspaces isolation (Samar — recipe scope per workspace).
**Failures**: version conflict on save (CONFLICT, both kept).
**Recovery**: recipe versions restorable.

## CP-4 — Export & handoff
1. Select derivatives → export (`exportDerivatives`: per-format text files/clipboard bundles; carousel outline exports as outline, NOT rendered design — 00 exclusion).
2. Watermark option "remixed from source" for transparency-minded creators.
3. Delivery (`getArtifact`) per async-contract with expiry + regeneration.

**Edges**: exporting derivative with structure warnings (explicit flag in export, allowed); bilingual pair export (bundle with both locales linked).
**Failures**: export quota; format failure within bundle (partial + per-format retry).
**Recovery**: exports re-generate from derivative state.

## Non-happy paths
- **Recipe runner unavailable** (AI-bound runner, rung 4): recipes degrade to interactive CHECKLISTS — the creator walks the structure by hand in the workbench (manual alternative per LOOP-5 — this is the declared manual path); receipts become self-declared.
- **No sources yet** (first-run): gallery offers a sample source to experience one remix before importing real work.
- **Offline**: library reads; runs/exports queue (P20).

## Failure→error mapping
ValidationError (source/recipe structure) · NotFoundError · PermissionError (workspace scoping) · ConflictError (concurrent derivative/recipe edits) · RateLimitError (run/export quota) · NetworkError · UnknownError.

## Flow → operation coverage table (every 07b operation; no orphans)

| # | 07b operation | Flow (step) | Screen |
|---|---------------|-------------|--------|
| 1 | `getSession` | App entry · session boot (locale ar/en, role) — every surface's frame, exercised on entry by all three personas in 02; not an authored CP step | all |
| 2 | `listSources` | CP-1.1 (library landing, source lands), non-happy first-run (sample source) | S1 |
| 3 | `createSource` | CP-1.1 (paste/import — abstract parse, paste always works) | S1 |
| 4 | `updateSource` | CP-2 edge (source edited after a run — receipts pin the version) | S1, S3 |
| 5 | `listRecipes` | CP-1.2 (gallery), CP-3.1 (duplicate a stock recipe) | S2 |
| 6 | `saveRecipe` | CP-3.2 (validate → save, versioned) | S4 |
| 7 | `validateRecipe` | CP-3.2 (structure sanity), CP-3 edge (precise field errors) | S4 |
| 8 | `runRecipe` | CP-1.4 (first run Job), CP-3.3 (re-run across recipe versions) | S3 |
| 9 | `getDerivative` | CP-1.5 (receipt render), CP-2.1 (workbench open) | S3 |
| 10 | `listDerivatives` | CP-2.4 (library status after ready), CP-4.1 (export selection) | S5 |
| 11 | `updateDerivative` | CP-2.2 (inline edit, baseRevision) | S3 |
| 12 | `regenerate` | CP-2.3 (single block / whole with preserve-or-discard confirm) | S3 |
| 13 | `setDerivativeStatus` | CP-2.4 (mark ready) | S3, S5 |
| 14 | `exportDerivatives` | CP-4.1 (bundle Job; watermark option CP-4.2) | S6 |
| 15 | `getArtifact` | CP-4.3 (delivery with expiry + regeneration) | S6 |
| 16 | `getUsage` | Metering surface · run/export quota behind the RATE_LIMIT failures in CP-1/CP-4 — not an authored CP step | S6, S8 |

16 operations, 0 orphans — every 07b operation listed exactly once. `getSession` (session boot) and `getUsage` (run/export quota meter) are entry/metering surfaces, stated as such rather than forced into an authored step. Everything else is traceable in-flow: every run, edit, and export above carries its pinned source and recipe versions.
