// GENERATED from specs-source/zakat-calculation-suite/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "zakat-calculation-suite",
 "title": "Zakat Calculation Suite",
 "family": "specialized",
 "tier": 3,
 "flagship": false,
 "adapter": "ZakatCalculationAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Zakat Jade",
  "pairing": "P09",
  "radius": "8px",
  "elevation": "layered-depth",
  "icon": "line-1.5",
  "motion": "stately",
  "fonts": [
   "Reem Kufi",
   "Fraunces"
  ],
  "primary": "#465B28",
  "accent": "#F2F4F0",
  "canvas": "#FBFCF9"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Cases home — the register",
   "purpose": "The morning surface: case list with reference, bilingual subject, period-end (Hijri secondary, P24), currency, status, profile school chip, item counts; filter chips + saved views (P08); the seeded sample case lives here with its badge (P22)",
   "shell": "",
   "data": "listCases · getSession",
   "archetype": "settings-admin"
  },
  {
   "id": "S2",
   "name": "Case workspace — Items",
   "purpose": "Item intake and review: category-first progressive form (P09), the item table with filters, bilingual search, inline edit with escape hatch (P06), void-with-reason, bulk-import entry",
   "shell": "Case workspace — Items",
   "data": "getCase · addCaseItem · importItems · listCaseItems · updateCaseItem · voidCaseItem",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Case workspace — Calculation",
   "purpose": "The result: basket summary, NisabGauge (threshold arithmetic), per-category dues, in-kind dues as kind names, the derivation trace with rule chips and source notes, result history",
   "shell": "",
   "data": "runCalculation · getCalculation · listCalculations",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Case workspace — Review & lock",
   "purpose": "Review packet (evidence, trace, pins, history), submit/approve/return actions, lock, successor spawn, chain view",
   "shell": "Case workspace — Review & lock",
   "data": "submitCaseForReview · reviewCase · lockCase · createSuccessorCase",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Compare view",
   "purpose": "Profiles × categories matrix, per-cell dues, divergence markers with rule pairs and bilingual reasons, rule inspection side-by-side, comparison history",
   "shell": "",
   "data": "createComparison · getComparison · listComparisons · listProfiles · getProfile",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S6",
   "name": "Nisab & valuations",
   "purpose": "Entered reference values per metal (value/gram, as-of, source note, active flag), pinning to cases, reference history",
   "shell": "",
   "data": "listNisabReferences · setNisabReference · pinNisabReferences",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Methodology profiles admin",
   "purpose": "Profile list (school chips, status, version), rule editor with source notes, approve/retire (owner gate), preset scaffolds",
   "shell": "",
   "data": "listProfiles · getProfile · saveProfile · approveProfile · retireProfile",
   "archetype": "editor-studio"
  },
  {
   "id": "S8",
   "name": "Jobs & exports console",
   "purpose": "Import/export jobs with state, progress, cancel/retry, link-to-context; artifact list with expiry windows and renew",
   "shell": "",
   "data": "listJobs · getArtifact · exportCase · exportComparison",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Activity log",
   "purpose": "Actor-action-target-timestamp stream, filterable (P17)",
   "shell": "",
   "data": "(read surface over ActivityEntry, 07a)",
   "archetype": "review-queue"
  },
  {
   "id": "S10",
   "name": "Settings",
   "purpose": "Default locale, numeral policy, Hijri display method, workspace default profile, usage window meter",
   "shell": "",
   "data": "getUsage · getSession",
   "archetype": "settings-admin"
  },
  {
   "id": "S11",
   "name": "Case reference overlay (⌘K palette)",
   "purpose": "Bilingual normalized search across cases, profiles, references, jobs; recent items",
   "shell": "",
   "data": "(client surface over list ops; P05)",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — Madhhab comparison (the signature flow)",
   "steps": [
    "The shariah authority decides; the officer exports the comparison for the methodology file. exportComparison · getArtifact · listJobs",
    "*Failures: export failure mid-bundle → per-artifact retry (async-contract §4); artifact expired → NOT_FOUND with renew path.",
    "*Recovery: comparisons are immutable snapshots; re-running after item edits creates a new comparison, never mutates history. listComparisons"
   ]
  },
  {
   "title": "CP-3 — Nisab references & pinning (reference discipline)",
   "steps": [
    "*Failures: pin on a locked case → VALIDATION naming the successor path; stale case version at pin → CONFLICT.",
    "*Recovery: references are append-only history; wrong entries are superseded (new entry, old one deactivated), never edited in place."
   ]
  },
  {
   "title": "CP-4 — Review → lock → audit export (certification)",
   "steps": [
    "The officer submits the case for review with a note (draft → in-review; the case freezes for review). submitCaseForReview",
    "Lock (⌘⇧L): the case freezes — items, profile, period, pins all immutable; the locked calculation becomes the certified number. lockCase",
    "*Recovery: locked cases are re-exportable forever; artifact expiry never loses the case — regeneration is deterministic from the frozen state."
   ]
  },
  {
   "title": "CP-5 — Case register, methodology admin, jobs, settings (the daily surface)",
   "steps": [
    "Cases home: register list with status, period-end dates (Hijri secondary), currency, profile school chips, filters + saved views (P08). listCases · getSession",
    "Jobs console: import/export jobs with state, cancel/retry, link-to-context (async-contract §7). listJobs",
    "*Failures: NETWORK mid-list → banner + retry (P20); usage read failure → \"last known\" degrade.",
    "*Recovery: all list surfaces cursor-paginated; session locale switch re-renders both directions without data loss."
   ]
  }
 ],
 "components": [],
 "ops": [
  "getSession",
  "createCase",
  "listCases",
  "getCase",
  "updateCase",
  "addCaseItem",
  "importItems",
  "listCaseItems",
  "updateCaseItem",
  "voidCaseItem",
  "runCalculation",
  "getCalculation",
  "listCalculations",
  "createComparison",
  "getComparison",
  "listComparisons",
  "listProfiles",
  "getProfile",
  "saveProfile",
  "approveProfile",
  "retireProfile",
  "listNisabReferences",
  "setNisabReference",
  "pinNisabReferences",
  "submitCaseForReview",
  "reviewCase",
  "lockCase",
  "createSuccessorCase",
  "exportCase",
  "exportComparison",
  "getArtifact",
  "listJobs",
  "getUsage"
 ],
 "entities": [
  {
   "name": "Money",
   "fields": [
    {
     "name": "minorUnits",
     "optional": false,
     "type": "number"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "string"
    },
    {
     "name": "minorDigits",
     "optional": false,
     "type": "2 | 3"
    }
   ]
  },
  {
   "name": "Quantity",
   "fields": [
    {
     "name": "value",
     "optional": false,
     "type": "number"
    },
    {
     "name": "unit",
     "optional": false,
     "type": "'head' | 'kg'"
    }
   ]
  },
  {
   "name": "BilingualString",
   "fields": [
    {
     "name": "en",
     "optional": true,
     "type": "string"
    },
    {
     "name": "ar",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "SourceNote",
   "fields": [
    {
     "name": "ref",
     "optional": false,
     "type": "string"
    },
    {
     "name": "note",
     "optional": false,
     "type": "string"
    },
    {
     "name": "verification",
     "optional": false,
     "type": "'digest-cited' | 'seeded-default-verify'"
    }
   ]
  },
  {
   "name": "Workspace",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "numeralPolicy",
     "optional": false,
     "type": "'arabic-indic-in-arabic-prose' | 'western-everywhere'"
    },
    {
     "name": "defaultProfileId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "hijriDisplay",
     "optional": false,
     "type": "'secondary-umm-al-qura' | 'gregorian-only'"
    }
   ]
  },
  {
   "name": "ZakatCase",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "workspaceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reference",
     "optional": false,
     "type": "string"
    },
    {
     "name": "subject",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "subjectType",
     "optional": false,
     "type": "'individual' | 'entity'"
    },
    {
     "name": "periodStart",
     "optional": false,
     "type": "string"
    },
    {
     "name": "periodEnd",
     "optional": false,
     "type": "string"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "string"
    },
    {
     "name": "minorDigits",
     "optional": false,
     "type": "2 | 3"
    },
    {
     "name": "profileId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "CaseStatus"
    },
    {
     "name": "pinnedNisabRefs",
     "optional": false,
     "type": "{ gold?: string; silver?: string }"
    }
   ]
  },
  {
   "name": "CaseItem",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "caseId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "category",
     "optional": false,
     "type": "ItemCategory"
    },
    {
     "name": "side",
     "optional": false,
     "type": "'asset' | 'liability'"
    },
    {
     "name": "description",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "amount",
     "optional": true,
     "type": "Money"
    },
    {
     "name": "weightGrams",
     "optional": true,
     "type": "number"
    },
    {
     "name": "isJewelry",
     "optional": true,
     "type": "boolean"
    },
    {
     "name": "metal",
     "optional": true,
     "type": "Metal"
    },
    {
     "name": "quantity",
     "optional": true,
     "type": "Quantity"
    },
    {
     "name": "irrigation",
     "optional": true,
     "type": "Irrigation"
    },
    {
     "name": "recoverability",
     "optional": true,
     "type": "Recoverability"
    }
   ]
  },
  {
   "name": "LivestockBand",
   "fields": [
    {
     "name": "fromCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "toCount",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "dueKind",
     "optional": false,
     "type": "string"
    },
    {
     "name": "dueCount",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "perN",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "CategoryRules",
   "fields": [
    {
     "name": "rate",
     "optional": true,
     "type": "number"
    },
    {
     "name": "hawlRequired",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "valuationBasis",
     "optional": true,
     "type": "'market-value-at-period-end' | 'entered-value'"
    },
    {
     "name": "jewelryTreatment",
     "optional": true,
     "type": "'zakatable' | 'exempt-within-uruf'"
    },
    {
     "name": "urufThreshold",
     "optional": true,
     "type": "Money"
    },
    {
     "name": "receivableTreatment",
     "optional": true,
     "type": "'strong-zakatable' | 'on-receipt'"
    },
    {
     "name": "liabilityDeduction",
     "optional": true,
     "type": "'all-due' | 'current-only' | 'none'"
    },
    {
     "name": "livestockBands",
     "optional": true,
     "type": "LivestockBand[]"
    },
    {
     "name": "minCount",
     "optional": true,
     "type": "number"
    },
    {
     "name": "agricultureRates",
     "optional": true,
     "type": "{ rainFed: number; irrigatedAtCost: number; mixed?: number }"
    },
    {
     "name": "cropNisabKg",
     "optional": true,
     "type": "number"
    },
    {
     "name": "investmentTreatment",
     "optional": true,
     "type": "'zakatable-at-market' | 'excluded'"
    }
   ]
  },
  {
   "name": "MethodologyProfile",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "school",
     "optional": false,
     "type": "School"
    },
    {
     "name": "institutionalPreset",
     "optional": true,
     "type": "'aaoifi-fas9-net-asset' | 'corporate-regulation'"
    },
    {
     "name": "nisabBasis",
     "optional": false,
     "type": "NisabBasis"
    },
    {
     "name": "nisabGrams",
     "optional": false,
     "type": "{ gold: number; silver: number }"
    },
    {
     "name": "rules",
     "optional": false,
     "type": "Record<ItemCategory, CategoryRules>"
    },
    {
     "name": "rounding",
     "optional": false,
     "type": "'half-up'"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'draft' | 'approved' | 'retired'"
    },
    {
     "name": "approvedBy",
     "optional": true,
     "type": "string"
    },
    {
     "name": "approvedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no cases)",
   "\"لا حالات بعد. أنشئ الأولى بحولها وملف منهجية معتمد — أو افتح الحالة التجريبية واقرأ اشتقاقًا موثّقًا سطرًا سطرًا.\"",
   "Create case / Open the sample case",
   "S1 filtered-empty",
   "\"No cases match these filters. The register keeps them all — clear the filters to see them.\""
  ],
  "loading": [
   "S1 register skeleton",
   "row skeletons ×8 in the grid geometry + \"Loading your cases…\" (SR)",
   "هياكل صفوف في هيكل الشبكة + \"جارٍ تحميل حالاتك…\"",
   "Case workspace / item table skeleton",
   "table-row skeletons capped at one screen (P02) + \"Loading the items…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION — createCase, non-approved profileId (07b rule 2, refused at the door)",
   "\"رُفض إنشاء الحالة — ملف المالكية مسودة لا منهجية معتمدة. أنشئ الحالة تحت ملف معتمد، أو اطلب من مالك الملف اعتماده أولًا.\"",
   "VALIDATION — runCalculation, draft/retired profile at run time",
   "\"رُفض الحساب — ملف منهجية هذه الحالة مسودة. المنهجيات المعتمدة فقط تحسب؛ وبوابة الاعتماد فعل مالك الملف.\""
  ],
  "success": [
   "Case created (createCase)",
   "Item added (addCaseItem)",
   "\"Item added — gold bullion, 480 g, non-jewelry. The trace will value it against the pinned gold reference.\"",
   "\"أُضيف البند — سبائك ذهب ٤٨٠ غرامًا، غير حلي. سيقيّمه سجل الاشتقاق على مرجع الذهب المثبّت.\"",
   "Item voided (voidCaseItem)"
  ]
 },
 "briefLine": "A bilingual (ar/en) zakat calculation workflow for Islamic finance officers and nonprofit finance desks: one workspace in which a zakat case — an individual or an entity, one hawl or fiscal period, one reporting currency — is built item by item from evidence (cash and bank balances, gold and silver holdings, trade inventory, receivables, investments, livestock counts, crop weights, deductible liabilities), then computed under a methodology profile: an inspectable, sourced rule set covering the nisab basis and grams convention, per-category rates, jewelry treatment, receivables treatment, liability deduction scope, livestock band schedules, and agriculture rates. The output is not just a number. Every calculation is an immutable snapshot carrying the full derivation trace — classify, value, aggregate, deduct, threshold, rate, round — one auditable line per step, each line naming the rule that fired and the source note behind it, to the minor unit. The calculation engine is deterministic arithmetic over typed data (07a/07b): same items at the same case version, same profile version, same pinned nisab references → the identical result, every time. The AI stance is declared non-AI (ai-native-patterns §1): no generation, no inspection, no clustering, no transformation by model exists anywhere in the contract — the engine's promise is reproducibility, and reproducibility is exactly what a trust-facing number requires."
} as const;
export type Spec = typeof SPEC;
