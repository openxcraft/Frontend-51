// GENERATED from specs-source/inventory-count-assistant/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "inventory-count-assistant",
 "title": "Inventory Count Assistant",
 "family": "business_ops",
 "tier": 3,
 "flagship": false,
 "adapter": "InventoryCountAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Jarda Moss",
  "pairing": "P11",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "outline-geometric",
  "motion": "crisp",
  "fonts": [
   "Changa",
   "Archivo"
  ],
  "primary": "#5F6A29",
  "accent": "#3E4800",
  "canvas": "#212318"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Sessions home",
   "purpose": "session list with state/mode/progress/IRA badges; first-run checklist (P22)",
   "shell": "",
   "data": "listCountSessions, listStores, getSession",
   "archetype": "list-console"
  },
  {
   "id": "S2",
   "name": "Session setup",
   "purpose": "scope builder (cadence proposal / zone / full), mode, counter roster, policy pick",
   "shell": "",
   "data": "proposeCycleSlice, listPolicies, listLocations, createCountSession",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Guided count view",
   "purpose": "the counter surface: scan/type entry, bilingual count sheet, progress meter (mobile-capable, blind-safe)",
   "shell": "Guided count view",
   "data": "getCountSession, submitCountEntry, updateCountEntry, listCountEntries, listCatalogItems (search fallback)",
   "archetype": "wizard-flow"
  },
  {
   "id": "S4",
   "name": "Reconciliation",
   "purpose": "variance ledger, recount requests, resolutions, close gate, late entries",
   "shell": "",
   "data": "closeCountSession, listVariances, requestRecount, resolveVariance, submitCountEntry",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "Session detail (closed)",
   "purpose": "immutable ledger, IRA arithmetic, adjustments, artifacts",
   "shell": "",
   "data": "getCountSession, listCountEntries, listVariances, exportCountReport, getArtifact",
   "archetype": "review-queue"
  },
  {
   "id": "S6",
   "name": "Catalog",
   "purpose": "bilingual items, ABC class chips, import, label fixes",
   "shell": "",
   "data": "listCatalogItems, getCatalogItem, createCatalogItem, updateCatalogItem, importCatalogItems",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Zones & stores",
   "purpose": "zone tree per store, bilingual zone labels, store cards",
   "shell": "",
   "data": "listStores, listLocations, saveLocation, updateStockLevels",
   "archetype": "list-console"
  },
  {
   "id": "S8",
   "name": "Count policies",
   "purpose": "tolerance + cadence editor with live worked example",
   "shell": "",
   "data": "listPolicies, savePolicy",
   "archetype": "editor-studio"
  },
  {
   "id": "S9",
   "name": "Reports & activity",
   "purpose": "variance history across sessions, activity log, jobs console, usage",
   "shell": "",
   "data": "listVariances, listActivity, listJobs, getUsage",
   "archetype": "review-queue"
  },
  {
   "id": "S10",
   "name": "Settings",
   "purpose": "locale, numeral display, stock-level channel consent (capability language)",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  },
  {
   "id": "S11",
   "name": "Command palette (overlay)",
   "purpose": "bilingual normalized search across sessions/items/zones/policies",
   "shell": "",
   "data": "client-side over S1/S6/S9 data",
   "archetype": "list-console"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Catalog paste → book import → first cycle slice (setup and value proof)",
   "steps": [
    "ABC classes compute deterministically on import (Pareto rule, 07c); the catalog table shows class chips per item. listCatalogItems",
    "Zones: Amal creates the store's zones (sales floor, backroom, high-value cage) — zone labels are bilingual. listLocations · saveLocation",
    "He creates the first session over the proposed slice: blind mode, typed counter roster (Amal + Sami), default policy. createCountSession",
    "*Recovery: catalog and register persist across sessions; imports are re-runnable and idempotent per key."
   ]
  },
  {
   "title": "CP-2 — Guided blind count → end counting → variance reveal (the daily loop)",
   "steps": [
    "Amal opens session CS-2 (draft → open). getCountSession · openCountSession",
    "Progress meter advances (12 of 14); Sami's entries attribute to his typed roster name. getCountSession",
    "Typo correction during counting: Amal edits her own entry inline (revision-bumped, never silent). updateCountEntry · listCountEntries",
    "Reconciliation screen (S4): variance ledger rows — signed delta, percent, value, tolerance band, outcome; uncounted items listed at the gate."
   ]
  },
  {
   "title": "CP-3 — Recount → resolution → close gate → adjustments (the accountability loop)",
   "steps": [
    "Uncounted items: late entries are accepted in reconciling state (recorded as late) — the gate lists them until counted. submitCountEntry (late)",
    "Session detail (S5): the closed ledger, IRA arithmetic, adjustment list, report artifacts. getCountSession · listCountEntries",
    "*Recovery: resolutions and adjustments are immutable records; a closed session is re-readable forever; the adjustment sheet regenerates from session state."
   ]
  },
  {
   "title": "CP-4 — Cadence review, directed counts, and policy editing (the control path)",
   "steps": [
    "Faisal reviews the cadence proposal weekly: overdue ratios, class mix, slice size; he trims or accepts. proposeCycleSlice · listCatalogItems",
    "Class overrides: the manager pins a class when value-share disagrees with shrink reality (recorded, visible in the catalog). updateCatalogItem",
    "*Failures: stale policy edit → CONFLICT; catalog edit on a version moved by import → CONFLICT with both payloads.",
    "*Recovery: policies version; catalog items version; overrides and edits are activity-logged."
   ]
  },
  {
   "title": "CP-5 — History, IRA, reports, and workspace management (the daily surfaces)",
   "steps": [
    "Sessions home (S1): list with state, mode, store, progress, IRA badge for closed sessions; filters + saved views (P08). listCountSessions · listStores",
    "Variance history across sessions: filter by item, store, outcome — the drift watch-list for Noura. listVariances",
    "Activity log: actor-action-target entries for every consequential mutation, exportable. listActivity",
    "Reports: variance report + adjustment sheet exports with expiry + regeneration (async-contract §2 expired state). exportCountReport · getArtifact · listJobs",
    "Settings: locale, numeral policy display, stock-level channel consent state (capability language only — credential-contract §2). getSession · getUsage",
    "Usage: export/import window metering, calm and persistent (P14). getUsage",
    "*Failures: NETWORK mid-list → banner + retry (P20); quota read failure → usage surface degrades to last-known; artifact expired → NOT_FOUND with renew path.",
    "*Recovery: all list surfaces cursor-paginated and re-fetchable; session locale switches re-render without data loss."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "Zero-book items: an item with book 0 counted at 3 has no meaningful percent variance — the absolute rule judges it (07c rule 4) and the row says so in text.",
    "Counters without accounts: the typed roster carries attribution (name + optional member ref) — Sami never needs a seat."
   ]
  }
 ],
 "components": [
  {
   "name": "GuidedCountSheet",
   "purpose": "the live count table: rows in zone order, bilingual item labels, masked tally column (blind) or inline variance (directed), scan-focus row highlight",
   "obligations": "P18 grid (↑/↓ rows, Enter→quantity, Tab commit+advance); virtualized >200 rows (P19) with focus preservation; blind rendering is contract-backed (07b rule 3 — the sheet cannot render what the adapter omits); row count announced on region entry; quantity cells Archivo tnum; per-row state text (counted/recount/late) never color-only"
  },
  {
   "name": "ScanEntryBar",
   "purpose": "the counter's primary input: barcode scan capture + type-to-search (bilingual normalized) + quantity pad",
   "obligations": "Always-focused on view entry (one-thumb use); search matches normalized Arabic (rtl-rules §4) with disclosure per ai-native-patterns §7.4 analog (normalization is deterministic, disclosed in the empty-search hint); scan double-fire de-duplicated by idempotency key (07b rule 6); offline queue with per-item state (P20); target ≥24px for every pad key (2.5.8); announcement on entry accepted (polite)"
  },
  {
   "name": "VarianceLedgerRow",
   "purpose": "reconciliation row: item label, book qty, counted qty (final), signed delta, percent, value at cost, tolerance bracket, outcome chip, resolution state",
   "obligations": "Signed delta ALWAYS text with explicit sign (−/+) — never icon-flip or color alone; tolerance bracket is drawn geometry with the band values printed as text (charts.csv heatmap contract: numbers always present); outcome = icon+text+color (within-deep / red / amber-deep per 05 contracts); recount-pending and review-required are distinguishable by text labels, not only hue; row focus announces item + delta politely"
  },
  {
   "name": "ToleranceBracket",
   "purpose": "the visual band on a variance row and in the policy editor: expected quantity with the allowed band marked",
   "obligations": "Band edges printed as text (abs + pct combined per band strategy); colorblind-safe (pattern overlay per charts.csv row 5); never the sole carrier of the within/outside judgment — the outcome chip duplicates it; in the policy editor it recomputes live from the worked example (06 rule)"
  },
  {
   "name": "CycleSliceCard",
   "purpose": "the cadence proposal: proposed items with class chip, interval, days overdue, overdue ratio, and the why-line",
   "obligations": "Every row states its arithmetic in text (\"A class · 30-day interval · 66 days since last count\"); ordering deterministic (overdue ratio desc, 07c); accept-trim interactions keyboard-complete; class chips text-bearing (moss-deep per 05)"
  },
  {
   "name": "PolicyEditorForm",
   "purpose": "tolerance + cadence editing with live worked example",
   "obligations": "Field-level validation messages (negative tolerance, zero interval named precisely); the worked example recomputes on every field change (deterministic — same inputs, same example); autosave status persistent (P10); interval changes warn that the next proposal re-orders honestly; band strategy (union/intersect) rendered as a radio with plain-language consequence text"
  },
  {
   "name": "CountProgressMeter",
   "purpose": "determinate session progress: counted / recount-pending / uncounted vs scope total",
   "obligations": "Determinate always (async-contract §3 — never a fake percentage); segments carry text counts; announces progress at quarter marks politely (not per entry); the uncounted segment is actionable (focus jumps to first uncounted row)"
  },
  {
   "name": "IraCard",
   "purpose": "session/store accuracy: items within tolerance ÷ items counted, with the arithmetic shown",
   "obligations": "The formula renders as text (\"27 of 28 items within tolerance — 96.4%\"); no-data state for stores without closed sessions (never 0%); value copy cites the convention honestly (unverified-band note optional per 11 E); store cards compare only like-for-like closed sessions"
  },
  {
   "name": "BilingualItemCell",
   "purpose": "the item label renderer: primary-locale line + secondary line, barcode and SKU in Latin digits",
   "obligations": "Each script renders at its own direction in bidi isolation (rtl-rules §2 — dir=\"auto\" inputs, isolate marks on interpolations); truncation at word boundaries (no hyphenation exists); worst-case joined-word strings tested at 320px (09); missing-locale state renders the present name + an \"incomplete bilingual label\" hint (text, not color)"
  }
 ],
 "ops": [
  "getSession",
  "listStores",
  "listLocations",
  "saveLocation",
  "listCatalogItems",
  "getCatalogItem",
  "createCatalogItem",
  "updateCatalogItem",
  "importCatalogItems",
  "updateStockLevels",
  "listPolicies",
  "savePolicy",
  "proposeCycleSlice",
  "createCountSession",
  "listCountSessions",
  "getCountSession",
  "openCountSession",
  "cancelCountSession",
  "closeCountSession",
  "submitCountEntry",
  "updateCountEntry",
  "listCountEntries",
  "requestRecount",
  "resolveVariance",
  "listVariances",
  "exportCountReport",
  "getArtifact",
  "listJobs",
  "listActivity",
  "getUsage"
 ],
 "entities": [
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
     "name": "currency",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Store",
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
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "code",
     "optional": false,
     "type": "string"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "Location",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "storeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "code",
     "optional": false,
     "type": "string"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
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
     "name": "barcode",
     "optional": true,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "unit",
     "optional": false,
     "type": "string"
    },
    {
     "name": "unitCost",
     "optional": false,
     "type": "number"
    },
    {
     "name": "classComputed",
     "optional": false,
     "type": "AbcClass"
    },
    {
     "name": "classOverride",
     "optional": true,
     "type": "AbcClass"
    },
    {
     "name": "class",
     "optional": false,
     "type": "AbcClass"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "StockLevel",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "storeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "itemId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "expectedQty",
     "optional": false,
     "type": "number"
    },
    {
     "name": "asOf",
     "optional": false,
     "type": "string"
    },
    {
     "name": "lastCountedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'manual-paste' | 'stock-channel' | 'session-adjustment'"
    }
   ]
  },
  {
   "name": "ToleranceBand",
   "fields": [
    {
     "name": "absTolerance",
     "optional": false,
     "type": "number"
    },
    {
     "name": "pctTolerance",
     "optional": false,
     "type": "number"
    },
    {
     "name": "valueTolerance",
     "optional": true,
     "type": "number"
    },
    {
     "name": "bandStrategy",
     "optional": false,
     "type": "'union' | 'intersect'"
    }
   ]
  },
  {
   "name": "CountSession",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "storeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "policyId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "mode",
     "optional": false,
     "type": "CountMode"
    },
    {
     "name": "scope",
     "optional": false,
     "type": "SessionScope"
    },
    {
     "name": "counters",
     "optional": false,
     "type": "CounterRef[]"
    },
    {
     "name": "state",
     "optional": false,
     "type": "SessionState"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "openedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "revealedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "closedAt",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "CountEntry",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sessionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "itemId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locationId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "countedQty",
     "optional": false,
     "type": "number"
    },
    {
     "name": "counterRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'count' | 'recount'"
    },
    {
     "name": "varianceRef",
     "optional": true,
     "type": "string"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number"
    },
    {
     "name": "superseded",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "lateEntry",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "submittedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "VarianceResolution",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "ResolutionKind"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "by",
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
   "name": "Variance",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sessionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "itemId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "expectedQty",
     "optional": false,
     "type": "number"
    },
    {
     "name": "countedQty",
     "optional": true,
     "type": "number"
    },
    {
     "name": "delta",
     "optional": true,
     "type": "number"
    },
    {
     "name": "absDelta",
     "optional": true,
     "type": "number"
    },
    {
     "name": "pctDelta",
     "optional": true,
     "type": "number"
    },
    {
     "name": "valueDelta",
     "optional": true,
     "type": "number"
    },
    {
     "name": "band",
     "optional": false,
     "type": "number"
    },
    {
     "name": "outcome",
     "optional": true,
     "type": "VarianceOutcome"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'uncounted' | VarianceState"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 sessions first-run",
   "Open sample session / Go to catalog",
   "S1 filtered-empty",
   "\"No sessions match these filters.\"",
   "\"لا جلسات تطابق هذه المرشّحات.\""
  ],
  "loading": [
   "S1 list skeleton",
   "skeleton rows ×8 + \"Loading your sessions…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل جلساتك…\"",
   "Catalog import job",
   "\"Importing row 120 of 400…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (malformed catalog row)",
   "\"Row 17 has no SKU — rows around it imported fine. Fix row 17 and import just it.\"",
   "\"السطر 17 بلا SKU — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده.\"",
   "VALIDATION (finalize gate refusal)"
  ],
  "success": [
   "Entry accepted",
   "\"Counted — 3 — 12 of 14.\"",
   "\"عُدّ — 3 — 12 من 14.\"",
   "Entry correction saved",
   "\"Corrected — 12 → 11, revision 2 on record.\""
  ]
 },
 "briefLine": "Cycle counting is the method the product productizes (research digest A: NetSuite/DCL — continuous counts of small preselected sections instead of one or two store-closing physical counts a year). An ABC cadence engine keeps the counting honest over time: items carry an A/B/C class computed from their share of stock value, each class carries a count-interval policy (A items counted monthly-class frequency, B quarterly-class, C half-yearly-class — editable, never statutory), and the engine proposes the next slice as the items whose interval is most overdue. Blind counting is a first-class mode: in a blind session the counter sees the item and its location but never the book quantity, and the adapter itself withholds expected quantities until the manager ends counting and reveals variances — the discipline professional count crews run (digest A: Champion Business Solutions, FCB — quantity and value withheld from counters to remove anchoring). Directed mode shows the book quantity beside each entry for controlled recounts and zone checks. Variance tolerance is policy data, not a magic threshold: per policy the store declares an absolute-unit tolerance and/or a percentage tolerance, combined by a declared band strategy, and any variance outside the band triggers a recount request automatically; a recount that still lands outside hands the item to the manager for an explicit resolution — accept the count (post an adjustment), keep the book, or open an investigation note."
} as const;
export type Spec = typeof SPEC;
