// GENERATED from specs-source/waqf-endowment-registry/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "waqf-endowment-registry",
 "title": "Waqf Endowment Registry",
 "family": "specialized",
 "tier": 3,
 "flagship": false,
 "adapter": "WaqfRegistryAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Waqf Garnet",
  "pairing": "P10",
  "radius": "8px",
  "elevation": "layered-depth",
  "icon": "line-1.5",
  "motion": "stately",
  "fonts": [
   "El Messiri",
   "Lora"
  ],
  "primary": "#77324D",
  "accent": "#551B33",
  "canvas": "#2A1E22"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Endowments home",
   "purpose": "registry grid, period digest, unallocated balances, onboarding checklist (P22), sample-endowment offer",
   "shell": "",
   "data": "listEndowments, getEndowment, getSession",
   "archetype": "editor-studio"
  },
  {
   "id": "S2",
   "name": "Endowment detail — Deed & policy",
   "purpose": "bilingual deed summary, deed ref with dual-calendar dates, policy editor with cap/reserve/remainder, completion checklist in draft",
   "shell": "",
   "data": "getEndowment, updateEndowment, saveDistributionPolicy, getDistributionPolicy, setEndowmentStatus",
   "archetype": "calendar-grid"
  },
  {
   "id": "S3",
   "name": "Endowment detail — Assets",
   "purpose": "corpus register: bilingual names, kinds, income modes, retire action, per-asset inflow totals",
   "shell": "",
   "data": "listAssets, addAsset, updateAsset, listLedgerEntries",
   "archetype": "settings-admin"
  },
  {
   "id": "S4",
   "name": "Endowment detail — Beneficiaries",
   "purpose": "beneficiary register: share fraction editor with live sum meter, eligibility lifecycle, successor links, residual holder mark",
   "shell": "",
   "data": "listBeneficiaries, addBeneficiary, updateBeneficiary",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Endowment detail — Ledger",
   "purpose": "append-only entry browser: seq, kind glyphs, amounts, evidence drawer, reversal append, period filters, import action",
   "shell": "",
   "data": "listLedgerEntries, recordInflow, recordExpense, voidEntry, importLedgerBatch",
   "archetype": "wizard-flow"
  },
  {
   "id": "S6",
   "name": "Distribution studio",
   "purpose": "allocation worksheet (derivation per line), hold/adjust with reasons, attest + commit, distribution detail with delivery tracking",
   "shell": "",
   "data": "runAllocation, getAllocation, updateAllocationLine, recordDistribution, getDistribution, recordDelivery",
   "archetype": "editor-studio"
  },
  {
   "id": "S7",
   "name": "Transparency reports",
   "purpose": "period report view: sections, ratios with arithmetic shown, variance, seal mark, beneficiary statements, exports",
   "shell": "",
   "data": "generateReport, getReport, sealReport, exportReport, getArtifact",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Jobs & exports console",
   "purpose": "import/export jobs, cancel/retry, link-to-context (T3-consolidated per async-contract §7)",
   "shell": "",
   "data": "listJobs, getUsage",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Activity log",
   "purpose": "P17 accountability surface: every mutation with actor and timestamp, filterable, exportable",
   "shell": "",
   "data": "listActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S10",
   "name": "Settings",
   "purpose": "locale default, numerals policy, currency, period convention, usage meters, capability state (credential-contract lifecycle surfaces)",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Register an endowment, deed, assets, beneficiaries, policy (value proof)",
   "steps": [
    "The registry home shows the new endowment in draft status with a completion checklist: asset → beneficiaries → policy → activate. listEndowments · getEndowment",
    "He activates the endowment with a reason; the status change logs. setEndowmentStatus"
   ]
  },
  {
   "title": "CP-2 — Record the period's truth: inflows, expenses, corrections (the daily loop)",
   "steps": [
    "Muna opens the endowment's ledger tab at period start: existing entries by seq, filters by kind/period. listLedgerEntries",
    "The unallocated balance digest on the endowment summary updates — recorded inflows minus recorded expenses and distributions, derived at read. getEndowment"
   ]
  },
  {
   "title": "CP-4 — Generate, seal, export the transparency report (the trust artifact)",
   "steps": [
    "The board treasurer's read (Dr. Yaqub, viewer seat): same report, read-only, both directions, no mutation surface. getSession · getReport",
    "The auditor (Yasmin, viewer seat) retrieves the artifact before expiry and regenerates if expired. getArtifact · listJobs"
   ]
  },
  {
   "title": "CP-5 — Registry surfaces, governance changes, and the account trail (the daily surface)",
   "steps": [
    "Jobs console (T3-consolidated): import and export jobs with state, cancel/retry, link-to-context. listJobs",
    "Usage: the export/import window meters render in settings and before export submits (P14 — warn at 80%). getUsage",
    "Palette (P05): ⌘K reaches endowments, reports, jobs, ledger entries. Client-side over the list surfaces. listEndowments (source data)"
   ]
  }
 ],
 "components": [
  {
   "name": "EndowmentRegisterGrid",
   "purpose": "S1 registry: endowment cards/rows with bilingual title (per-side direction), kind chip, status chip, counts, unallocated balance, latest-report state",
   "obligations": "Virtualized >200 rows (P19) with focus preservation; row-count context on region entry; bilingual search input normalizes (rtl-rules §4); status and kind are icon+text+color, never color alone; targets ≥24×24 (2.5.8); 400% reflow — grid collapses to stacked cards at 360px"
  },
  {
   "name": "DeedPanel",
   "purpose": "S2 bilingual deed summary: title, donor, purpose, deed ref with dual-calendar dates (P24 — Umm al-Qura disclosed), policy chips (cap/reserve/remainder/period)",
   "obligations": "Dual-calendar hover cross-reference; bilingual fields authored both sides with per-side direction (P23 logic); the activation gate's missing-side marks render inline (named fields, 11 C); editable metadata with baseVersion → CONFLICT surfaces both versions"
  },
  {
   "name": "ShareEditor",
   "purpose": "S4 fraction editor: numerator/denominator per beneficiary with a live whole-deed sum meter (\"sums to 23/24 — 1/24 unassigned to the remainder rule\")",
   "obligations": "Keyboard grid (P18): ↑/↓ walk beneficiaries, fraction cells reachable standalone; the sum meter is a live region (polite) announcing overflow/underflow states; share values render as fractions with Western numerals; overflow refusal names the excess (\"exceeds the deed's whole by 1/8\")"
  },
  {
   "name": "BeneficiaryRegisterTable",
   "purpose": "S4 beneficiary rows: bilingual name, class chip, share, eligibility lifecycle (active/suspended/succeeded), successor link, residual-holder mark",
   "obligations": "Eligibility changes are reason-gated actions (never silent); 'succeeded' rows carry the successor link and never render as deleted (history is permanent); keyboard row menu has visible button equivalents; per-row eligibility chip is glyph+text"
  },
  {
   "name": "AllocationWorksheet",
   "purpose": "S6 the deterministic plan review: totals band (inflows → capped admin → reserve → distributable), per-beneficiary lines with computed amounts and the DERIVATION VISIBLE (\"3/24 × 3,504,000 = 438,000\" — share × distributable, the 07c regression figure), hold/adjust controls with reason fields",
   "obligations": "The derivation is a text row per line (SR-readable, never an image or a tooltip-only); held/adjusted lines show computed-vs-adjusted side by side forever; the stale-inputs banner (\"2 entries recorded after this plan\") is a live region; commit button names the line count (\"Record distribution — 9 lines, 1 held\"); keyboard: H holds, A adjusts, Enter commits from the review summary"
  },
  {
   "name": "LedgerBook",
   "purpose": "S5 append-only entry browser: seq column, kind glyphs, amounts (tabular numerals), period filters, evidence drawer, reversal append action",
   "obligations": "Rows sit in the recessed sunken bed (layered-depth); reversal appends a referencing entry — the UI never offers edit or delete on any entry (the grammar is the point); kind is glyph+text; seq is monotonic and announced per row (\"entry 214, inflow\"); >200 entries virtualize (P19); evidence drawer is keyboard-reachable (E)"
  },
  {
   "name": "EvidenceDrawer",
   "purpose": "bilingual evidence note + abstract document reference + the unbound-storage notice",
   "obligations": "The note renders at its own direction per side; documentRef renders in bidi isolation (rtl-rules §2); when the storage capability is unbound the drawer states the LOOP-5 posture (\"recorded with a note — attach the document when the storage capability is bound\"); no secret ever renders here (credential-contract §7)"
  },
  {
   "name": "TransparencyReportView",
   "purpose": "S7 the report document: sections with figures and their arithmetic, ratios strip, variance vs prior, remainder destination, ledger pin, seal state",
   "obligations": "Renders on the overlay document layer (white, shadow-2); every figure is a ledger walk (entry seq references in the margin); ratios show their division (\"administration 10.0% = 432,000 / 4,320,000\"); variance pairs with DiffView for the prior-period compare; sealed state renders the SealMark; draft state renders the draft watermark line; both directions verified (the bilingual document renders AR leading, EN side full-citizen)"
  },
  {
   "name": "SealMark",
   "purpose": "the signature component: garnet seal ring with gold ring accent, sealed-at timestamp, ledger-pin line (\"pinned to seq 214\")",
   "obligations": "The seal settle is the ONE signature micro-interaction (05): ≤360ms emphasized decelerate, text + timestamp render simultaneously, polite announcement (\"Report sealed, pinned to entry 214\"); reduced-motion: 2-step opacity + chip + announcement; the mark is a state indicator paired with text, never a brand device (05 brand-distance)"
  }
 ],
 "ops": [
  "getSession",
  "listEndowments",
  "createEndowment",
  "getEndowment",
  "updateEndowment",
  "setEndowmentStatus",
  "addAsset",
  "updateAsset",
  "listAssets",
  "addBeneficiary",
  "updateBeneficiary",
  "listBeneficiaries",
  "saveDistributionPolicy",
  "getDistributionPolicy",
  "recordInflow",
  "recordExpense",
  "voidEntry",
  "listLedgerEntries",
  "importLedgerBatch",
  "runAllocation",
  "getAllocation",
  "updateAllocationLine",
  "recordDistribution",
  "getDistribution",
  "recordDelivery",
  "generateReport",
  "getReport",
  "sealReport",
  "exportReport",
  "getArtifact",
  "listJobs",
  "listActivity",
  "getUsage"
 ],
 "entities": [
  {
   "name": "Money",
   "fields": [
    {
     "name": "minorUnits",
     "optional": false,
     "type": "number; currency: string; }"
    },
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "numeralsPolicy",
     "optional": false,
     "type": "NumeralsPolicy"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "string"
    },
    {
     "name": "periodConvention",
     "optional": false,
     "type": "'monthly' | 'quarterly' | 'annual'"
    },
    {
     "name": "hijriPresentation",
     "optional": false,
     "type": "'ummalqura-disclosed'"
    },
    {
     "name": "sampleLoaded",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "Endowment",
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
     "name": "title",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "donorName",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "purpose",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "EndowmentKind"
    },
    {
     "name": "deedRef",
     "optional": false,
     "type": "{"
    },
    {
     "name": "number",
     "optional": false,
     "type": "string"
    },
    {
     "name": "registeredAtGregorian",
     "optional": false,
     "type": "string"
    },
    {
     "name": "registeredAtHijri",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "EndowmentStatus"
    },
    {
     "name": "counts",
     "optional": false,
     "type": "{ assets: number; beneficiaries: number; ledgerEntries: number }"
    }
   ]
  },
  {
   "name": "Asset",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "endowmentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "AssetKind"
    },
    {
     "name": "incomeMode",
     "optional": false,
     "type": "IncomeMode"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'retired'"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Beneficiary",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "endowmentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "beneficiaryClass",
     "optional": false,
     "type": "BeneficiaryClass"
    },
    {
     "name": "share",
     "optional": false,
     "type": "{ numerator: number; denominator: number }"
    },
    {
     "name": "eligibility",
     "optional": false,
     "type": "EligibilityState"
    },
    {
     "name": "successorBeneficiaryId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "isResidualHolder",
     "optional": true,
     "type": "boolean"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "LedgerEntry",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "endowmentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "seq",
     "optional": false,
     "type": "number"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "EntryKind"
    },
    {
     "name": "amount",
     "optional": false,
     "type": "Money"
    },
    {
     "name": "period",
     "optional": false,
     "type": "string"
    },
    {
     "name": "assetId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "expenseKind",
     "optional": true,
     "type": "ExpenseKind"
    },
    {
     "name": "beneficiaryId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "allocationId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "reversesEntryId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "evidence",
     "optional": false,
     "type": "{ note: BilingualText; documentRef?: string }"
    }
   ]
  },
  {
   "name": "AllocationLine",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "allocationId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "beneficiaryId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "share",
     "optional": false,
     "type": "{ numerator: number; denominator: number }"
    },
    {
     "name": "computedAmount",
     "optional": false,
     "type": "Money"
    },
    {
     "name": "state",
     "optional": false,
     "type": "AllocationLineState"
    },
    {
     "name": "adjustedAmount",
     "optional": true,
     "type": "Money"
    },
    {
     "name": "adjustmentReason",
     "optional": true,
     "type": "string"
    },
    {
     "name": "delivered",
     "optional": false,
     "type": "'pending' | 'delivered' | 'waived'"
    },
    {
     "name": "deliveryEvidence",
     "optional": true,
     "type": "{ note: BilingualText; deliveredAt: string; method: string }"
    }
   ]
  },
  {
   "name": "Allocation",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "endowmentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "period",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'draft' | 'committed' | 'voided'"
    },
    {
     "name": "inputs",
     "optional": false,
     "type": "{"
    },
    {
     "name": "inflowEntryIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "expenseEntryIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "beneficiaryVersions",
     "optional": false,
     "type": "Record<string, number>"
    },
    {
     "name": "totals",
     "optional": false,
     "type": "{"
    },
    {
     "name": "inflows",
     "optional": false,
     "type": "Money"
    },
    {
     "name": "expenses",
     "optional": false,
     "type": "Money"
    }
   ]
  },
  {
   "name": "Distribution",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "allocationId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "endowmentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "period",
     "optional": false,
     "type": "string"
    },
    {
     "name": "entryIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "attestation",
     "optional": false,
     "type": "{ by: string; at: string; note?: string }"
    },
    {
     "name": "committedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ExportArtifact",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reportId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "format",
     "optional": false,
     "type": "'bilingual-document' | 'ledger-csv' | 'print-bundle'"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "regenerable",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "ActivityEntry",
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
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "action",
     "optional": false,
     "type": "'endowment-created' | 'endowment-status-changed' | 'asset-added' | 'asset-retired'"
    },
    {
     "name": "targetRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "detail",
     "optional": true,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no endowments)",
   "\"لا أوقاف بعد. سجّل الأول بصكّه وواقفه — أو افتح الوقف التجريبي وشاهد تقريراً مختوماً يقرّ قبل أن تكتب صكاً واحداً.\"",
   "Register endowment / Open the sample endowment",
   "S1 filtered-empty",
   "\"No endowments match these filters. The registry keeps them all — clear the filters to see them.\""
  ],
  "loading": [
   "S1 registry skeleton",
   "row skeletons in the grid geometry + \"Loading the endowments…\" (SR)",
   "هياكل صفوف في هيكل الشبكة + \"جارٍ تحميل الأوقاف…\"",
   "S5 ledger skeleton",
   "row skeletons in the recessed bed geometry + \"Loading the ledger…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION — createEndowment, empty required field",
   "\"The deed reference number is empty — the register files endowments by their deeds, and a deed has a number. Write it and save.\"",
   "\"رقم الصك فارغ — السجل يُرتب الأوقاف بصكوكها، وللصك رقم. اكتبه واحفظ.\"",
   "VALIDATION — setEndowmentStatus activation gate, one-script deed fields"
  ],
  "success": [
   "Endowment created (createEndowment)",
   "\"سُجّل الوقف — «وقف آل الراشد»، مختلط، الصك WQR-1187-1421. حالة مسودة؛ تُفتح قائمة الإكمال.\"",
   "Endowment activated (setEndowmentStatus)",
   "\"Endowment activated — reason recorded. The activity log carries the change.\"",
   "\"نُشّط الوقف — والسبب مسجّل. سجل النشاط يحمل التغيير.\""
  ]
 },
 "briefLine": "A bilingual (ar/en) endowment registry for waqf administrators: one authoritative register of the endowments (أوقاف) a mutawlli or foundation administers — each waqf a record carrying its deed summary (donor, purpose, deed reference in both scripts), its asset register (the income-bearing corpus: buildings, cash placements, corporate shares), its beneficiary register (who the deed says benefits, with shares), and its distribution policy (administration cap, reserve, remainder rule) — plus the product's spine, the beneficiary distribution ledger: an append-only, sequence-numbered book of entries (inflows per asset, expenses by kind, distributions per beneficiary, reversals) in which every dirham of income has exactly one traceable path from the asset that earned it to the beneficiary who received it. A distribution is never typed in as an amount: the administrator records the period's inflows and expenses, runs the allocation engine — deterministic arithmetic over the deed's own policy (distributable = inflows − capped administration expenses − policy reserve; each beneficiary receives distributable × share; the rounding remainder lands in the deed's designated residual destination) — reviews the computed plan line by line (holds and reason-coded adjustments recorded, never silent), then records it, which commits the plan to the ledger as immutable entries with an attestation. Delivery of each beneficiary's amount is *recorded* against an abstract disbursement channel — the product never moves money."
} as const;
export type Spec = typeof SPEC;
