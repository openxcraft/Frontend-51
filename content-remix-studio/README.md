# Content Remix Studio
Separate frontend project · family: content_tools · tier: 3 · adapter: RemixAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs content-remix-studio`).

## Spec traceability (source: ../specs-source/content-remix-studio/)
- Screens (8): Library home · Recipe gallery · Workbench · Recipe editor · Derivatives library · Export & queue · Jobs center · Settings
- Adapter operations (16): getSession, listSources, createSource, updateSource, listRecipes, saveRecipe, validateRecipe, runRecipe, getDerivative, listDerivatives, updateDerivative, regenerate, setDerivativeStatus, exportDerivatives, getArtifact, getUsage
- Identity: Mawjawd Coral, pairing P11 (Changa + Archivo), radius C, soft-lift, motion: energetic
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
