// GENERATED from specs-source/content-remix-studio/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "content-remix-studio",
 "title": "Content Remix Studio",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "RemixAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Mawjawd Coral",
  "pairing": "P11",
  "radius": "14px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "energetic",
  "fonts": [
   "Changa",
   "Archivo"
  ],
  "primary": "#E86A4A",
  "accent": "#3E9A8C",
  "canvas": "#F8F4EE"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Library home",
   "purpose": "sources list + onboarding checklist",
   "shell": "",
   "data": "listSources(query)",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Recipe gallery",
   "purpose": "stock + personal recipes, structure previews",
   "shell": "Recipe gallery",
   "data": "listRecipes, getRecipe",
   "archetype": "review-queue"
  },
  {
   "id": "S3",
   "name": "Workbench",
   "purpose": "source+derivative + receipt links (CP-1/2)",
   "shell": "",
   "data": "runRecipe(Job), getDerivative, updateDerivative",
   "archetype": "list-console"
  },
  {
   "id": "S4",
   "name": "Recipe editor",
   "purpose": "structure map editing, versions",
   "shell": "",
   "data": "saveRecipe(versioned), validateRecipe",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Derivatives library",
   "purpose": "status, pairs, export selection",
   "shell": "",
   "data": "listDerivatives(query)",
   "archetype": "jobs-centre"
  },
  {
   "id": "S6",
   "name": "Export & queue",
   "purpose": "bundles, artifacts",
   "shell": "",
   "data": "exportDerivatives(Job), getArtifact",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Jobs center",
   "purpose": "runs/exports",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Settings",
   "purpose": "locale defaults, dialect policy, quotas",
   "shell": "",
   "data": "getSession, workspace ops",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Source to first derivative (value proof)",
   "steps": [
    "Recipe preview shows the STRUCTURE it will produce (sections, counts, length policy) before running — inspectability is the product.",
    "Run recipe (runRecipe Job per async-contract); derivative streams/assembles in the workbench.",
    "Fidelity receipt renders (getDerivative): source spans → derivative blocks mapping, condensation ratios, recipe additions marked.",
    "*Failures: recipe run failure (typed error, retry); quota (RATE_LIMIT ladder).",
    "*Recovery: sources and derivatives persist; runs re-executable."
   ]
  },
  {
   "title": "CP-2 — Derivative refinement loop (the daily loop)",
   "steps": [
    "Workbench (getDerivative): source (left) + derivative (right) with receipt links — click a derivative block, its source spans highlight.",
    "Edit derivative text inline (P06; updateDerivative writes with baseRevision); structure warnings live (length policy violations, tone drift per recipe notes).",
    "Re-run recipe on a single block; regenerate the whole derivative with current edits preserved-or-discard choice.",
    "Mark derivative ready (setDerivativeStatus); derivatives library (listDerivatives) status updates.",
    "*Failures: block re-run failure (scoped retry); regeneration discarding edits (explicit confirm naming what's lost — P04 ladder level 2).",
    "*Recovery: derivative revisions retained."
   ]
  },
  {
   "title": "CP-3 — Recipe editing (Yasmin/Samar's control path)",
   "steps": [
    "Duplicate a stock recipe → editable copy (structure map: sections with roles, per-section length policy, tone notes, bilingual policy).",
    "Edit; validate (validateRecipe — structure sanity: counts, min/max lengths); save as personal/workspace recipe (saveRecipe, versioned).",
    "Run (runRecipe) on an existing source; compare outputs across recipe versions (diff view P16).",
    "*Failures: version conflict on save (CONFLICT, both kept).",
    "*Recovery: recipe versions restorable."
   ]
  },
  {
   "title": "CP-4 — Export & handoff",
   "steps": [
    "Watermark option \"remixed from source\" for transparency-minded creators.",
    "Delivery (getArtifact) per async-contract with expiry + regeneration.",
    "*Edges: exporting derivative with structure warnings (explicit flag in export, allowed); bilingual pair export (bundle with both locales linked).",
    "*Failures: export quota; format failure within bundle (partial + per-format retry).",
    "*Recovery: exports re-generate from derivative state."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "No sources yet (first-run): gallery offers a sample source to experience one remix before importing real work.",
    "Offline: library reads; runs/exports queue (P20)."
   ]
  }
 ],
 "components": [
  {
   "name": "RecipeCard",
   "purpose": "gallery card with STRUCTURE preview (sections, counts, policies)",
   "obligations": "Preview is text-first (screen-reader equal); run action single target; version badge"
  },
  {
   "name": "FidelityReceipt",
   "purpose": "derivative↔source span links with condensation ratios",
   "obligations": "Links keyboard-navigable in reading order; bidi-safe spans; \"edited beyond recipe\" honest state"
  },
  {
   "name": "StructureMap",
   "purpose": "recipe editor's section-role editor",
   "obligations": "Field-level validation messages; drag-reorder has keyboard alternative (2.5.7); sanity preview live"
  },
  {
   "name": "DerivativeStack",
   "purpose": "multi-derivative result presentation with status",
   "obligations": "Overshoot ONLY on complete moment (05); stack is a list semantically; per-item export opt-in"
  }
 ],
 "ops": [
  "getSession",
  "listSources",
  "createSource",
  "updateSource",
  "listRecipes",
  "saveRecipe",
  "validateRecipe",
  "runRecipe",
  "getDerivative",
  "listDerivatives",
  "updateDerivative",
  "regenerate",
  "setDerivativeStatus",
  "exportDerivatives",
  "getArtifact",
  "getUsage"
 ],
 "entities": [
  {
   "name": "DerivativeBlock",
   "fields": [
    {
     "name": "role",
     "optional": false,
     "type": "string; text: string; }"
    },
    {
     "name": "id",
     "optional": false,
     "type": "string; sourceId: string; sourceVersion: number; recipeId: string; recipeVersion: number"
    },
    {
     "name": "locale",
     "optional": true,
     "type": "'ar'|'en'; blocks: DerivativeBlock[]; status: 'draft'|'ready'|'exported-versions-exist'"
    },
    {
     "name": "editedBeyondRecipe",
     "optional": false,
     "type": "boolean; revision: number"
    },
    {
     "name": "receipt",
     "optional": false,
     "type": "ReceiptLink[]; dialectResolution?: 'preserved'|'flagged'"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "First-run (no source)",
   "\"Write once, publish five ways. Try it on our sample issue — or paste your own.\"",
   "\"اكتب مرة، وانشر خمس طرق. جرّبها على عيّنتنا — أو الصق خاصتك.\"",
   "Remix the sample / Add source",
   "Library empty after activity"
  ],
  "loading": [
   "Recipe run",
   "\"Remixing — block {n} of {total} ({role})\"",
   "\"إعادة التركيب — الكتلة {n} من {total} ({الدور})\"",
   "Workbench boot",
   "two-column skeletons"
  ],
  "error": [
   "VALIDATION (source too short)",
   "\"This recipe needs at least 600 words to build a thread from. Yours has 412.\"",
   "\"تحتاج هذه الوصفة ٦٠٠ كلمة على الأقل لبناء سلسلة. لديك ٤١٢.\"",
   "VALIDATION (dialect choice)",
   "\"Your source carries Levantine passages. Preserve them as-is, or remix with them flagged?\""
  ],
  "success": [
   "Remix complete",
   "\"Thread ready — 8 blocks from a 1,200-word source, condensed 8:1.\"",
   "\"السلسلة جاهزة — ٨ كتل من مصدر ١٢٠٠ كلمة، تكثيف ٨:١.\"",
   "\"2 blocks were edited beyond the recipe — the receipt says so, forever.\"",
   "\"حُرّرت كتلتان خارج الوصفة — الإيصال يقول ذلك، دائماً.\""
  ]
 },
 "briefLine": "Solo creators and small marketing teams (1–3 seats) in MENA producing bilingual content across platforms: newsletter authors, podcast hosts, course creators, and boutique agency owners. The volume buyer Nour-type (studio 02) is served by the studio family; this is the self-serve tier below it."
} as const;
export type Spec = typeof SPEC;
