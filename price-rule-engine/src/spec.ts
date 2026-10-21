// GENERATED from specs-source/price-rule-engine/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "price-rule-engine",
 "title": "Price Rule Engine",
 "family": "commerce_integrations",
 "tier": 2,
 "flagship": false,
 "adapter": "PriceRuleEngineAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Sarwa Cyan",
  "pairing": "P02",
  "radius": "4px",
  "elevation": "flat-line",
  "icon": "line-2",
  "motion": "crisp",
  "fonts": [
   "Noto Kufi Arabic",
   "Space Grotesk"
  ],
  "primary": "#00939A",
  "accent": "#00656B",
  "canvas": "#00383C"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Rules console home",
   "purpose": "rule list with status/priority/window/scope, first-run value checklist (P22)",
   "shell": "",
   "data": "listRules, getSession",
   "archetype": "list-console"
  },
  {
   "id": "S2",
   "name": "Rule editor",
   "purpose": "condition + action pickers, priority, window, rendered deterministic formula with worked example",
   "shell": "",
   "data": "getRule, createRule, updateRule, deleteRule, listCategories",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Catalog",
   "purpose": "item table with cost/net/margin/floor, filters + saved views (P08)",
   "shell": "",
   "data": "listCatalogItems, importCatalog",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "Item detail",
   "purpose": "cost history timeline, price history, applied-rule trace, manual price path",
   "shell": "",
   "data": "getCatalogItem, listCostRecords, saveCostRecord, updateCatalogItem, saveCategory",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "Simulation composer",
   "purpose": "scope, rule mode, cost snapshot date, pre-run quota",
   "shell": "",
   "data": "getUsage, runSimulation, listRules",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Simulation workspace",
   "purpose": "the core surface: summary header (margin preview, clamps, directions) + virtualized before/after rows + formula drawer",
   "shell": "Simulation workspace",
   "data": "getSimulation, listSimulationRows",
   "archetype": "wizard-flow"
  },
  {
   "id": "S7",
   "name": "Proposals + proposal review",
   "purpose": "proposals home; review mode with include/exclude + reasons, gate, approval",
   "shell": "Proposals + proposal review",
   "data": "listPriceProposals, getPriceProposal, updatePriceProposal, submitPriceProposal, approvePriceProposal, withdrawPriceProposal",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "Exports & jobs",
   "purpose": "jobs console (imports/simulations/exports), artifacts, cancel/retry",
   "shell": "",
   "data": "listJobs, exportPricePackage, getArtifact",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "markets/VAT/floor defaults (versioned), ending conventions, capability consent, usage window",
   "shell": "",
   "data": "getWorkspace, updateWorkspace, getUsage, getSession",
   "archetype": "settings-admin"
  },
  {
   "id": "S10",
   "name": "Activity log",
   "purpose": "actor-action-target audit chain, filterable, exportable via the package ledger",
   "shell": "",
   "data": "listActivity",
   "archetype": "review-queue"
  }
 ],
 "flows": [
  {
   "title": "CP-5 — The cost-refresh cycle (the margin-erosion loop the buyer pays for)",
   "steps": [
    "She curates the proposal from CP-4 on top of this simulation, excluding the renegotiate-first rows with reasons.",
    "*Failures: SKU match failures named per row (VALIDATION partial); stale workspace edit → CONFLICT both kept."
   ]
  }
 ],
 "components": [
  {
   "name": "RuleFormPanel",
   "purpose": "author/edit a pricing rule: scope conditions, actions, priority, validity window, status",
   "obligations": "Condition rows are ScopePicker instances (AND-composable: category / channel / market / price band / margin band); action rows are typed pickers (set-markup · set-target-margin · adjust · floor-at-markup · ending-round) with numeric fields validated on blur (skill row 56) and an error summary on save; priority field enforces total order (collision → VALIDATION naming the other rule, 03 CP-2 edge); window fields carry dual-calendar hint text (P24 — Hijri/Gregorian cross-reference in ar-locale, active system explicit); status transitions (draft/active/paused) with inert-by-time badge when window has passed; every field edit updates FormulaPanel live; Escape cancels and restores (P06 discipline on the whole form); ⌘S saves (09)"
  },
  {
   "name": "FormulaPanel",
   "purpose": "the deterministic formula rendered in plain arithmetic with a worked example",
   "obligations": "For the rule being authored: scope sentence (\"Applies to: category = Kitchen, market = KSA\"), then the arithmetic chain in order — \"net = landed cost ÷ (1 − 0.38)\" → ending → floor clamp — each step with its number on one seeded example item fetched live (getCatalogItem, 03 CP-2.2); renders as an ordered definition list for screen readers (prose, not an image of math); updates as fields change (≤120ms, no layout shift — reserved height); is the in-product documentation of the rule (ui-reasoning row 91 convergence); tabular figures for every number"
  },
  {
   "name": "SimulationSummaryHeader",
   "purpose": "the margin preview hero above the row table",
   "obligations": "Blended margin before → after per market (Space Grotesk 700, primary-ink, tabular — \"KSA 31.4% → 33.9% · UAE 28.1% → 29.0%\", never a cross-currency blend), the catalog-weighted label permanently attached (\"catalog-weighted — no sales data at v1\"), counts: price-up / down / unchanged / floor-clamped / skipped-no-cost (icon+text+color chips), per-market net-revenue delta in that market's currency, VAT rates used, cost snapshot date, rule-set pin; sticky with scroll-margin clearing focused rows (2.4.11); every figure has a visible tooltip breakdown (skill Financial Dashboard: decimals consistent, totals row posture); renders as a definition table for SR; updates ≤120ms after job completion"
  },
  {
   "name": "BeforeAfterRowTable",
   "purpose": "the virtualized core surface: per-item before → proposed",
   "obligations": "Virtualizes >200 rows (P19); focus never moves on scroll; row-count context on region entry (\"220 rows, 3 clamped\"); columns: SKU (bidi-isolated token, physical order stable), names (per-row direction, dir=\"auto\"), landed cost @snapshot, current net, proposed net (DiffView-style delta with explicit +/− sign in ink), margin before → after (MarginDeltaCell), VAT-inclusive display before → after (VatDisplayPair), floor flag; sortable + filterable with removable chips (P08) and saved views; row selection for bulk proposal exclusion (P07 ActionBar names the count); keyboard: ↑/↓ traversal, Enter opens FormulaDrawer, Space selects (09); 360px collapses to row cards (skill row 71)"
  },
  {
   "name": "FormulaDrawer",
   "purpose": "the per-row derivation trace",
   "obligations": "Opens inline-end (140ms, crisp, focus trap + return); renders the full chain: cost components → landed total → each matched rule in priority order (name + version + its arithmetic on this row's numbers) → ending round → floor check → final; steps are an ordered list with tabular figures; rules not applied carry their reason (\"window excludes simulation date\"); the drawer is the derivation-forward voice made visible (02); links jump to the rule editor (return-trip focus)"
  },
  {
   "name": "ClampChip",
   "purpose": "the floor-clamp marker on a row",
   "obligations": "Amber-deep text on amber-light border (text-safe 4.59:1), icon arrow-down-to-line + text \"Floor 96.14\" (never color alone); carries \"The Clamp Settles\" signature micro-interaction on first render (05 — strike-through raw price, final settles 140ms, chip fades 120ms, polite announcement); reduced-motion: instant + same announcement; chip click opens FormulaDrawer at the floor step"
  },
  {
   "name": "MarginDeltaCell",
   "purpose": "margin before → after with judgment coloring",
   "obligations": "Green (margin-up) / red (margin-down) at text-safe 4.88:1/4.87:1 with a trending glyph + explicit signed numerals (the numerals ARE the data; color is the judgment channel — 05 §decision palette); direction of price (+/−) renders in ink beside it, deliberately uncolored (a markdown is often a good decision — the two channels never merge); flat / unchanged renders ink-only \"0.0 pts\""
  },
  {
   "name": "VatDisplayPair",
   "purpose": "net → VAT-inclusive display per market",
   "obligations": "Two tabular figures with the market's currency code and rate label (\"SAR · VAT 15%\"): display = roundHalfUp(net × 1.15, 2) computed per 07c rule 5; both before and after columns so the shopper-facing consequence is visible (01 §E — the 599/628.95 complaint class); renders as labeled data cells (SR reads \"display price 114.09 Saudi riyal incl. VAT\"); currency code bidi-isolated in Arabic chrome"
  },
  {
   "name": "CostTimeline",
   "purpose": "effective-dated landed-cost history on item detail",
   "obligations": "Vertical timeline (mirrors in RTL), one node per CostRecord: effective date, landed total, component breakdown (supplier/freight/duty/fees/packaging), actor, note; the node effective \"now\" carries the active mark; back-dated insertions render in chronological position (03 CP-5 edge); each node announces \"effective 12 Oct, landed 96.14, recorded by Layla\"; corrections append (never overwrite — 07a invariant), with a correction badge linking to the record it corrects"
  },
  {
   "name": "ProposalReviewTable",
   "purpose": "the proposal's governed row set",
   "obligations": "Row states: included (default) / excluded-with-reason (dialog requires the reason; plum exclusion mark) / unreviewed (amber-deep count in the gate); carries the same before/after + margin cells as BeforeAfterRowTable so Faisal reviews against identical data (03 CP-4.4); bulk exclude with ActionBar (P07); review state persists across sessions (P11); the excluded reasons render in the export ledger verbatim"
  }
 ],
 "ops": [
  "getSession",
  "getWorkspace",
  "updateWorkspace",
  "importCatalog",
  "importCostSheet",
  "listCatalogItems",
  "getCatalogItem",
  "updateCatalogItem",
  "saveCostRecord",
  "listCostRecords",
  "listCategories",
  "saveCategory",
  "createRule",
  "listRules",
  "getRule",
  "updateRule",
  "deleteRule",
  "runSimulation",
  "getSimulation",
  "listSimulationRows",
  "createPriceProposal",
  "listPriceProposals",
  "getPriceProposal",
  "updatePriceProposal",
  "submitPriceProposal",
  "approvePriceProposal",
  "withdrawPriceProposal",
  "exportPricePackage",
  "getArtifact",
  "listJobs",
  "getUsage",
  "listActivity"
 ],
 "entities": [
  {
   "name": "Market",
   "fields": [
    {
     "name": "code",
     "optional": false,
     "type": "MarketCode"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "currencyMinorDigits",
     "optional": false,
     "type": "2 | 3"
    },
    {
     "name": "vatRatePermille",
     "optional": false,
     "type": "number"
    },
    {
     "name": "displayRule",
     "optional": false,
     "type": "'vat-inclusive'"
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
     "type": "string"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "markets",
     "optional": false,
     "type": "Market[]"
    },
    {
     "name": "defaultFloor",
     "optional": false,
     "type": "{"
    },
    {
     "name": "markupPermille",
     "optional": false,
     "type": "number"
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
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Category",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "CatalogItem",
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
     "name": "sku",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "categoryId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "marketCode",
     "optional": false,
     "type": "MarketCode"
    },
    {
     "name": "channel",
     "optional": false,
     "type": "string"
    },
    {
     "name": "currentNetPrice",
     "optional": false,
     "type": "number"
    },
    {
     "name": "floorOverride",
     "optional": true,
     "type": "FloorOverride"
    },
    {
     "name": "costBasis",
     "optional": true,
     "type": "{"
    },
    {
     "name": "landedCost",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "CostComponents",
   "fields": [
    {
     "name": "supplierCost",
     "optional": false,
     "type": "number"
    },
    {
     "name": "freight",
     "optional": true,
     "type": "number"
    },
    {
     "name": "duty",
     "optional": true,
     "type": "number"
    },
    {
     "name": "fees",
     "optional": true,
     "type": "number"
    },
    {
     "name": "packaging",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "CostRecord",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "itemId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "components",
     "optional": false,
     "type": "CostComponents"
    },
    {
     "name": "effectiveFrom",
     "optional": false,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "correctsRecordId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "PriceHistoryEntry",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "itemId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "fromNetPrice",
     "optional": false,
     "type": "number"
    },
    {
     "name": "toNetPrice",
     "optional": false,
     "type": "number"
    },
    {
     "name": "origin",
     "optional": false,
     "type": "'manual' | 'proposal'"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "proposalId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "PricingRule",
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
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "RuleStatus"
    },
    {
     "name": "priority",
     "optional": false,
     "type": "number"
    },
    {
     "name": "validFrom",
     "optional": true,
     "type": "string"
    },
    {
     "name": "validTo",
     "optional": true,
     "type": "string"
    },
    {
     "name": "conditions",
     "optional": false,
     "type": "RuleCondition[]"
    },
    {
     "name": "actions",
     "optional": false,
     "type": "RuleAction[]"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "SimulationScope",
   "fields": [
    {
     "name": "categoryIds",
     "optional": true,
     "type": "string[]"
    },
    {
     "name": "channels",
     "optional": true,
     "type": "string[]"
    },
    {
     "name": "marketCodes",
     "optional": true,
     "type": "MarketCode[]"
    },
    {
     "name": "itemIds",
     "optional": true,
     "type": "string[]"
    }
   ]
  },
  {
   "name": "FormulaStep",
   "fields": [
    {
     "name": "seq",
     "optional": false,
     "type": "number"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'cost' | 'rule' | 'ending' | 'floor' | 'final'"
    },
    {
     "name": "ruleId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "ruleName",
     "optional": true,
     "type": "string"
    },
    {
     "name": "ruleVersion",
     "optional": true,
     "type": "number"
    },
    {
     "name": "arithmetic",
     "optional": false,
     "type": "string"
    },
    {
     "name": "valueAfter",
     "optional": false,
     "type": "number"
    },
    {
     "name": "skipped",
     "optional": true,
     "type": "{ reason: 'window' | 'scope' | 'no-cost' }"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 rules console first-run",
   "Create rule / Open sample simulation",
   "S1 filtered-empty",
   "\"No rules match these filters.\"",
   "\"لا قواعد تطابق هذه المرشّحات.\""
  ],
  "loading": [
   "S1/S3/S7 list skeletons",
   "skeleton rows ×8 + \"Loading your rules…\" / \"Loading the catalog…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل قواعدك…\" / \"جارٍ تحميل الكتالوج…\"",
   "Catalog import (determinate)",
   "\"Importing 140 of 220 items — invalid rows are named and skipped, valid rows land.\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (import bad row)",
   "\"Row 7 is malformed — its net price is not a number. Rows 1–6 imported; fix row 7 and import it alone.\"",
   "\"السطر 7 معطوب — سعره الصافي ليس رقماً. استُوردت الأسطر 1–6؛ صحّح السطر 7 واستورده وحده.\"",
   "VALIDATION (unknown market code)"
  ],
  "success": [
   "Import done",
   "\"220 items in — 3 without costs kept and flagged, 5 SKUs updated by upsert, 1 invalid row skipped and named.\"",
   "\"دخل 220 صنفاً — 3 بلا تكاليف حُفظت ووُسمت، و5 رموز حُدّثت بالدمج، وسطر غير صالح واحد تُخطي وسُمّي.\"",
   "Cost sheet done",
   "\"18 cost records appended — each effective-dated; the margin column recomputed per item.\""
  ]
 },
 "briefLine": "The signature mechanism is the cost-floor-aware rule simulation with margin preview. A simulation runs the rule set against the catalog at a chosen cost snapshot and returns, per item and in aggregate: current net price → raw rule price → floor clamp (when the rule would price below the landed-cost floor, the clamp fires and the row says so — never silently) → ending rounding → proposed net, with margin-before/margin-after on every row, the VAT-inclusive display price per market, and a formula trace the pricing lead can read line by line. Simulation is read-only against the catalog — the same rule set, cost snapshot, and catalog always produce the same rows (the determinism contract; declared non-AI, ai-native-patterns §1: markup/margin arithmetic, clamping, and rounding are rules, and there is no demand-sensing, no elasticity guess, and no AI operation anywhere). From a simulation the pricing lead curates a price proposal: a reviewed subset of rows (floor-clamped rows excluded with reasons), which passes an approval gate that refuses while any row is unreviewed, and lands as an exportable price-update package — a price sheet plus an audit ledger — with an abstract publish channel declared for a binding-time future. At v1 the product never writes a price to any channel: the human approves, the artifact ships, the merchant's own systems apply it. That is the same deliberate stopping point the portfolio's other commerce tools take (cod-order-confirmation stops at the courier's door; this one stops at the approved price sheet)."
} as const;
export type Spec = typeof SPEC;
