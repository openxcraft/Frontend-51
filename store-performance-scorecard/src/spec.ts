// GENERATED from specs-source/store-performance-scorecard/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "store-performance-scorecard",
 "title": "Store Performance Scorecard",
 "family": "analytics",
 "tier": 3,
 "flagship": false,
 "adapter": "StoreScorecardAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Tajir Citron",
  "pairing": "P18",
  "radius": "8px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "energetic",
  "fonts": [
   "Lalezar",
   "Bebas Neue"
  ],
  "primary": "#D3A156",
  "accent": "#966711",
  "canvas": "#2C2213"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Chain overview",
   "purpose": "period context, latest run summary, coverage posture, onboarding checklist (P22), artifact return-state",
   "shell": "",
   "data": "getSession, getWorkspace, listScorecards, getCoverageSummary, getArtifact",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Scorecard workspace (ranked board)",
   "purpose": "the comparison surface: window/basis/peer-group context band, ranked store table with scores, LFL deltas, comp badges, flags",
   "shell": "",
   "data": "runScorecard, getScorecard, listScorecards, listFlags, getKpiDefinitions",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S3",
   "name": "Store detail",
   "purpose": "one store's scorecard card: per-KPI rows, shift breakdown, matched weeks, annotations, coverage, pattern history",
   "shell": "",
   "data": "getStoreBreakdown, getStore, listAnnotations, listShiftRecords",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S4",
   "name": "Shift lens",
   "purpose": "stores × shift-class normalized-KPI grid, matched classes only, KPI switcher, cell drill",
   "shell": "",
   "data": "getStoreBreakdown, getKpiDefinitions, listShiftRecords",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Stores directory",
   "purpose": "store register, filters/peer groups, metadata edit, trading status",
   "shell": "",
   "data": "listStores, createStore, updateStore, listPeerGroups, upsertPeerGroup",
   "archetype": "settings-admin"
  },
  {
   "id": "S6",
   "name": "Data & imports",
   "purpose": "shift-record table (filters, provenance), import paste/upload, channel binding + health, coverage summary",
   "shell": "",
   "data": "importShiftRecords, fetchChannelSales, listShiftRecords, getCoverageSummary, listJobs",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S7",
   "name": "Definitions & policy",
   "purpose": "KPI formulas (published), comp policy editor (versioned), weights editor, season-window library, pattern registry",
   "shell": "",
   "data": "getKpiDefinitions, getCompPolicy, updateCompPolicy, listSeasonWindows, upsertSeasonWindow, listOperatingPatterns, upsertOperatingPattern, getOperatingPattern",
   "archetype": "editor-studio"
  },
  {
   "id": "S8",
   "name": "Jobs & activity",
   "purpose": "consolidated job console (import/channel/export) + activity log (P17)",
   "shell": "",
   "data": "listJobs",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "locale, weekend definition, currency display, defaults",
   "shell": "",
   "data": "updateWorkspacePreferences, getWorkspace",
   "archetype": "settings-admin"
  },
  {
   "id": "S10",
   "name": "Command palette (overlay)",
   "purpose": "bilingual search across stores/runs/seasons/jobs/actions",
   "shell": "",
   "data": "client-side over S1–S8 data",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Chain setup → first scorecard (value proof)",
   "steps": [
    "He runs the first scorecard: window = last 4 retail weeks, basis = week-matched YoY, peer group = by format. Synchronous, budget-bound (10). runScorecard",
    "*Recovery: records persist across re-runs; patterns version forward; the chain never loses imported data on a job failure."
   ]
  },
  {
   "title": "CP-2 — Weekly LFL review (the daily loop)",
   "steps": [
    "He pins a context annotation — \"renovation, aisles 3–4 closed, W22\" — visible on the store's card and the run's context rail. addAnnotation · listAnnotations",
    "Coverage check before the meeting: which stores have gaps in the window; one store under 60% is out of ranking, reason shown. getCoverageSummary",
    "*Recovery: every run is an immutable snapshot; re-running after imports creates a new run, history never mutates (07a)."
   ]
  },
  {
   "title": "CP-3 — Shift-lens comparison (the signature flow)",
   "steps": [
    "Drill: the evening column for RYD-07 → its raw shift rows for the window, one keystroke. listShiftRecords",
    "*Recovery: the lens is a read surface over the run snapshot — re-openable, shareable as a saved view, never destructive."
   ]
  },
  {
   "title": "CP-4 — Season alignment + comp policy audit (the honesty flow)",
   "steps": [
    "He switches the basis to season-anchored: this named season window (Ramadan 1447) vs the same named season last year (1446). The board recomputes. runScorecard",
    "He curates a season window (a local event the defaults missed): bilingual label, fixed dates, market scope. upsertSeasonWindow",
    "*Recovery: policy changes version forward; prior runs keep the policy they ran under — audit intact."
   ]
  },
  {
   "title": "CP-5 — Data import + coverage honesty loop",
   "steps": [
    "Faisal adds the context: a power outage annotation for the JED-04 gap days. addAnnotation · listAnnotations",
    "Settings when needed: weekend definition, currency display, locale. updateWorkspacePreferences",
    "*Recovery: imports are additive and versioned; every row carries source provenance (manual/import/channel) for audit."
   ]
  },
  {
   "title": "CP-6 — Export pack + jobs console (the handoff)",
   "steps": [
    "Artifact delivery in-context when the surface is visible (async-contract §6 ladder 1); on return-state the artifact surfaces on the chain overview. getArtifact",
    "Jobs console: import/channel-fetch/export jobs, states, cancel/retry, link-to-context (T3 consolidated activity surface per async-contract §7). listJobs",
    "Run history for the audit-minded: prior runs listed with their pinned versions, re-openable, byte-identical on replay. listScorecards · getScorecard",
    "*Failures: artifact expired → NOT_FOUND + regenerate path; export failure mid-pack → partial per-section retry (async-contract §4).",
    "*Recovery: packs regenerate from run state deterministically; nothing is ever lost to an export failure."
   ]
  }
 ],
 "components": [
  {
   "name": "RankedBoard",
   "purpose": "the scorecard table: one row per comp-eligible store — composite score, per-KPI LFL deltas (glyph + signed number + tint), comp badge, coverage mark, flag chips; sortable, rank-stable",
   "obligations": "P18 grid (arrow navigation, physical mapping stable in both directions, rtl-rules §4); virtualized >200 rows (P19) with focus preservation and row-count context on region entry; every delta is glyph+text+intent tint (never color alone); sticky header never covers focus (2.4.11 scroll-margin); rank changes announce politely with the moved count; 400% reflow — rows collapse to cards at 360px"
  },
  {
   "name": "KpiTile",
   "purpose": "the signage figure: one KPI on a citron plate — Bebas/Lalezar display figure, name in citron-deep, YoY delta strip, band chip, small-sample caution",
   "obligations": "ink-on-citron 6.69:1 contract (05); numerals Western tabular; caution state is text+icon (rust-deep), never tint-only; tile is a semantic listitem with the full value in accessible text; plate elevation is soft-lift, decorative only"
  },
  {
   "name": "ShiftLensGrid",
   "purpose": "the signature surface: stores × shift classes, each cell a normalized KPI value + YoY delta; matched classes only; \"no trading\" mark for unmatched cells",
   "obligations": "Table semantics with row/column headers re-announced on arrow navigation; diverging tints carry the number ALWAYS in-cell (charts contract); unmatched cells read \"no trading\" in text, never 0; classes with <4 trading stores carry the matched-capability caution line; KPI switch is one key (M) with ≤150ms re-render and a polite announcement"
  },
  {
   "name": "CompBadge",
   "purpose": "eligibility mark: comp-eligible / non-comp (reason: new, closed, insufficient history) / partial-period",
   "obligations": "duotone double-tick glyph + text label; tooltip names the rule and the measured value (\"trading start 2026-W10; needs prior-year matched weeks — Method 2\"); never color-only; keyboard-focusable with the reason in accessible text"
  },
  {
   "name": "CompositionBar",
   "purpose": "season-composition disclosure: stacked share bar per window side (current vs prior), season names bilingual, misalignment flag",
   "obligations": "share segments labeled in text with percentages (Western numerals); misalignment flag is text+icon (rust-deep), threshold named; both window sides announced as a summary on region entry; segments never rely on hue order alone (pattern overlay per charts contract)"
  },
  {
   "name": "CoverageMeter",
   "purpose": "expected-vs-present shift rows per store/window: gap list by date and class",
   "obligations": "gaps are named rows (date + class), not a percentage alone; under-threshold exclusion (ranking-out) states the reason in text; meter direction mirrors in RTL; per-gap link to the record table filtered to that gap"
  },
  {
   "name": "OperatingPatternEditor",
   "purpose": "author versioned shift windows: class, start/end, days, effective range, timezone; Ramadan patterns as new effective-dated versions",
   "obligations": "table semantics with time inputs (never free text); save creates a version (P04 level 2 confirm on overlapping effective ranges); concurrent edit → CONFLICT both payloads; keyboard-complete authoring (no drag required); effective-range overlap warning is inline, not modal"
  },
  {
   "name": "ShiftRecordImporter",
   "purpose": "paste/CSV import: column map preview, unknown store codes surfaced (create-or-fix offer), duplicate accounting, submit as Job",
   "obligations": "paste is never blocked (3.3.8); preview table is keyboard-navigable; malformed rows named (first bad row + count); source provenance chip (manual/import/channel) on every landed row; idempotency key visible in the job row (retry-safe)"
  },
  {
   "name": "DefinitionsPanel",
   "purpose": "the published-method surface: exact KPI formulas, comp rules, weights, versions — linked from every run",
   "obligations": "formulas are text + inline tokens (no images); version chips pinned per run; SR reads the formula as text; copy action exports the definitions block into the pack (07c); diff view between versions uses P16 grammar"
  },
  {
   "name": "AnnotationThread",
   "purpose": "dated context notes per store/date-range: author, time, text (bilingual authoring optional)",
   "obligations": "list semantics with visible timestamps announced with the action (P17); edit is additive (append + edit marker), never silent rewrite; annotations render at own script direction with bidi isolation (rtl-rules §2); attach link back to the affected run window"
  }
 ],
 "ops": [
  "getSession",
  "getWorkspace",
  "updateWorkspacePreferences",
  "createStore",
  "listStores",
  "getStore",
  "updateStore",
  "upsertOperatingPattern",
  "listOperatingPatterns",
  "getOperatingPattern",
  "importShiftRecords",
  "fetchChannelSales",
  "listShiftRecords",
  "getCoverageSummary",
  "getCompPolicy",
  "updateCompPolicy",
  "listSeasonWindows",
  "upsertSeasonWindow",
  "listPeerGroups",
  "upsertPeerGroup",
  "addAnnotation",
  "listAnnotations",
  "runScorecard",
  "getScorecard",
  "listScorecards",
  "getStoreBreakdown",
  "getKpiDefinitions",
  "listFlags",
  "exportScorecardPack",
  "getArtifact",
  "listJobs"
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
     "name": "market",
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
    },
    {
     "name": "weekendDays",
     "optional": false,
     "type": "number[]"
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
     "name": "code",
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
     "optional": false,
     "type": "string"
    },
    {
     "name": "format",
     "optional": false,
     "type": "StoreFormat"
    },
    {
     "name": "city",
     "optional": false,
     "type": "string"
    },
    {
     "name": "region",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sizeSqm",
     "optional": true,
     "type": "number"
    },
    {
     "name": "openedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "closedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "StoreStatus"
    }
   ]
  },
  {
   "name": "OperatingPattern",
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
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "labelEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "effectiveFrom",
     "optional": false,
     "type": "string"
    },
    {
     "name": "effectiveTo",
     "optional": true,
     "type": "string"
    },
    {
     "name": "timezone",
     "optional": false,
     "type": "string"
    },
    {
     "name": "shifts",
     "optional": false,
     "type": "{"
    },
    {
     "name": "shiftClass",
     "optional": false,
     "type": "ShiftClass"
    },
    {
     "name": "startMinute",
     "optional": false,
     "type": "number"
    },
    {
     "name": "endMinute",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "ShiftRecord",
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
     "name": "storeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "date",
     "optional": false,
     "type": "string"
    },
    {
     "name": "shiftClass",
     "optional": false,
     "type": "ShiftClass"
    },
    {
     "name": "patternId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "patternVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "openMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "netSalesMinor",
     "optional": false,
     "type": "number"
    },
    {
     "name": "transactionCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "laborHours",
     "optional": false,
     "type": "number"
    },
    {
     "name": "laborCostMinor",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "SeasonWindow",
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
     "name": "labelEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'lunar' | 'fixed'"
    },
    {
     "name": "startDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "endDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "market",
     "optional": false,
     "type": "string"
    },
    {
     "name": "driftNote",
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
   "name": "PeerGroup",
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
     "name": "rule",
     "optional": false,
     "type": "'by-format' | 'by-region' | 'manual'"
    },
    {
     "name": "storeIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Annotation",
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
     "name": "storeId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "dateFrom",
     "optional": false,
     "type": "string"
    },
    {
     "name": "dateTo",
     "optional": true,
     "type": "string"
    },
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "editedAt",
     "optional": true,
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
   "name": "KpiResult",
   "fields": [
    {
     "name": "kpi",
     "optional": false,
     "type": "KpiKey"
    },
    {
     "name": "current",
     "optional": false,
     "type": "number"
    },
    {
     "name": "prior",
     "optional": false,
     "type": "number"
    },
    {
     "name": "deltaPct",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "percentile",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "matchedUnits",
     "optional": false,
     "type": "number"
    },
    {
     "name": "caution",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "ShiftBreakdownRow",
   "fields": [
    {
     "name": "shiftClass",
     "optional": false,
     "type": "ShiftClass"
    },
    {
     "name": "tradesInClass",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "kpis",
     "optional": false,
     "type": "KpiResult[]"
    },
    {
     "name": "matchedShifts",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "StoreResult",
   "fields": [
    {
     "name": "storeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "compEligibility",
     "optional": false,
     "type": "'comp' | 'non-comp-new' | 'non-comp-closed'"
    },
    {
     "name": "eligibilityReason",
     "optional": false,
     "type": "string"
    },
    {
     "name": "coveragePct",
     "optional": false,
     "type": "number"
    },
    {
     "name": "ranked",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "score",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "kpis",
     "optional": false,
     "type": "KpiResult[]"
    },
    {
     "name": "shiftBreakdown",
     "optional": false,
     "type": "ShiftBreakdownRow[]"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 chain first-run (no records at all)",
   "\"لا متاجر ولا سجلات ولا بطاقة أداء بعد. سجّل أول متجر مع وردياته — أو افتح السلسلة النموذجية واقرأ بطاقة أداء مكتملة أولاً.\"",
   "Create store / Open sample chain",
   "S1 filtered-empty (runs list)",
   "\"No scorecard runs match these filters.\""
  ],
  "loading": [
   "S1 overview skeleton",
   "skeleton cards ×4 + \"Loading your chain…\" (SR)",
   "بطاقات هيكلية + \"جارٍ تحميل سلسلتك…\"",
   "S2 board skeleton",
   "ranked-row skeletons ×10, basis band static + \"Loading the scorecard run…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (malformed import row)",
   "\"Row 17 has no store code — rows around it imported fine. Fix row 17 and import just it.\"",
   "\"السطر 17 بلا رمز متجر — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده.\"",
   "VALIDATION (unknown store code)"
  ],
  "success": [
   "Import done",
   "\"400 records in, 3 updated in place, 2 invalid skipped — every one listed.\"",
   "\"دخل 400 سجل، وحُدّث 3 موضعاً، وتُخطي 2 غير صالحة — كلها مدرجة.\"",
   "Run complete",
   "\"Scorecard ready — 11 stores ranked under policy v1, weights v1. Top: RYD-03. Attention: JED-02.\""
  ]
 },
 "briefLine": "roster: researched proposal, pending owner confirmation"
} as const;
export type Spec = typeof SPEC;
