// GENERATED from specs-source/sales-cohort-view/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "sales-cohort-view",
 "title": "Sales Cohort View",
 "family": "analytics",
 "tier": 3,
 "flagship": false,
 "adapter": "SalesCohortAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Ujra Marine",
  "pairing": "P17",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "outline-geometric",
  "motion": "crisp",
  "fonts": [
   "Noto Sans Arabic",
   "Manrope"
  ],
  "primary": "#6788B6",
  "accent": "#335686",
  "canvas": "#1C222B"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Grid workspace",
   "purpose": "the core surface: acquisition rows × period columns, metric switcher, season overlay rail, coverage/freshness chips, snapshot pin",
   "shell": "",
   "data": "computeGrid, getGrid, getRuleset, getSource, getSession",
   "archetype": "editor-studio"
  },
  {
   "id": "S2",
   "name": "Cohort detail",
   "purpose": "one cohort: window, size, composition sentence, curve, summary stats",
   "shell": "",
   "data": "getCohortDetail",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S3",
   "name": "Customer drill",
   "purpose": "member list of a cohort or cell: refs, first order, orders, revenue",
   "shell": "",
   "data": "listCustomers",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S4",
   "name": "Season calendar",
   "purpose": "kinds library + declared windows per market/year; create/edit; drift + phases",
   "shell": "",
   "data": "listSeasonKinds, listSeasonWindows, getSeasonWindow, createSeasonWindow, updateSeasonWindow",
   "archetype": "calendar-grid"
  },
  {
   "id": "S5",
   "name": "Comparison",
   "purpose": "aligned two-cohort duel: curves from period 0, deltas, composition disclosure",
   "shell": "",
   "data": "compareCohorts, getComparison",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S6",
   "name": "Views library",
   "purpose": "saved grid queries: rename, update, delete (P04)",
   "shell": "",
   "data": "listViews, updateView, deleteView, saveView (from S1)",
   "archetype": "editor-studio"
  },
  {
   "id": "S7",
   "name": "Definitions & formulas",
   "purpose": "the four canonical metrics with exact formulas, thresholds, ruleset version history",
   "shell": "",
   "data": "getRuleset",
   "archetype": "wizard-flow"
  },
  {
   "id": "S8",
   "name": "Sources",
   "purpose": "bound source state, coverage, refresh, sample import",
   "shell": "",
   "data": "getSource, refreshSource, importOrdersSample",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S9",
   "name": "Activity & jobs",
   "purpose": "consolidated console: job states with cancel/retry + P17 log",
   "shell": "",
   "data": "listJobs, getActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S10",
   "name": "Command palette (overlay)",
   "purpose": "bilingual search across views/windows/comparisons/actions",
   "shell": "",
   "data": "client-side over S1/S4/S5/S6 data",
   "archetype": "dashboard-analytics"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Open the workspace → the first grid (value proof)",
   "steps": [
    "*Trigger: Nadia signs in for the first time; the seeded commerce source is bound and fresh; she wants a cohort grid now, not a setup project.",
    "Session resolves (role owner, locale en, workspace market KSA+UAE, calendar-method disclosure). getSession",
    "Grid workspace opens; the source chip shows bound-state and freshness (last sync, coverage window). getSource",
    "She opens the definitions panel from the grid header and reads the four canonical metrics with formulas and the ruleset version the grid ran under. getRuleset",
    "She re-reads the immutable snapshot after switching tabs away and back — same numbers, same version pin. getGrid",
    "The jobs badge shows no running work; onboarding checklist (P22) marks \"first grid rendered\" done. listJobs"
   ]
  },
  {
   "title": "CP-2 — The daily read: metric, overlay, drill (the analyst's loop)",
   "steps": [
    "*Trigger: Faisal opens the grid on a Tuesday to answer \"which acquisition windows produce durable customers\" — the question behind the quarterly deck.",
    "He drills a cohort row into cohort detail: acquisition window, size, season composition sentence, the full curve, summary stats. getCohortDetail",
    "He checks the formula behind a metric he is about to quote (denominator audit). getRuleset",
    "*Recovery: drill lists are cursor-paginated and re-fetchable; nothing in the drill mutates state (read-only surface by construction)."
   ]
  },
  {
   "title": "CP-3 — Season calendar discipline (define, verify, drift)",
   "steps": [
    "He opens one window and reads it in full: dates in both calendars, phases with day ranges, ±1-day drift note, the market it applies to. getSeasonWindow",
    "He corrects a window: adjusts the peak phase by a day after the KSA declaration lands; version bump with baseVersion. updateSeasonWindow",
    "She creates a new one: UAE market, custom kind, label in both locales, Gregorian dates, phases. createSeasonWindow"
   ]
  },
  {
   "title": "CP-4 — Season-anchored comparison → evidence pack (the signature flow)",
   "steps": [
    "She re-anchors the grid: acquisition windows = season windows (ramadan peak, both years, KSA market) plus non-seasonal monthly buckets for context. computeGrid",
    "She opens each Ramadan cohort's detail to read composition and curve before quoting anything. getCohortDetail",
    "She stages the comparison: Ramadan 1447 peak (N₀ 214) vs Ramadan 1446 peak (N₀ 178), alignment mode = season-aligned. compareCohorts",
    "She saves the anchored view so next quarter starts where this one ended. saveView"
   ]
  },
  {
   "title": "CP-5 — Workspace administration: source, sample, views, jobs, activity (the daily surface)",
   "steps": [
    "*Trigger: Sami wires the workspace on day one and keeps it honest afterwards; Nadia manages what the team sees.",
    "Sources surface: bound source state (kind, coverage, last sync, health). getSource",
    "Sami triggers a freshness refresh — a Job with staged progress. refreshSource",
    "Jobs console: source-refresh, sample-import, export jobs with state, cancel/retry, link-to-context (async-contract §7 — T3 consolidated surface). listJobs",
    "Activity log: every consequential mutation (window edits, view saves, exports, setting changes) with actor-action-target-timestamp, filterable. getActivity"
   ]
  }
 ],
 "components": [
  {
   "name": "CohortGrid",
   "purpose": "the core surface: acquisition-cohort rows × period columns; four metric renderings; denominator always visible; small-sample cautions (N<30) and suppression (N<10, count-only); in-progress period marks; coverage-edge marks",
   "obligations": "P18 grid semantics (arrow navigation with physical mapping stable in both directions — rtl-rules §4); row/column headers re-announced on navigation; virtualized >60 cohort rows (P19) with focus preservation; sticky acquisition column + period header; cell values are tabular figures, Western numerals; every caution/suppression state is icon+text, never color alone; cells drill on Enter with focus return"
  },
  {
   "name": "SeasonRail",
   "purpose": "the overlay band along the acquisition axis: named season windows with phase stripes (build-up/peak/wind-down), drift ticks (±1 day), per-market lane; toggles with the signature 140ms settle",
   "obligations": "Band tint is decorative — structure carried by hairline borders, chips, and labels (05 contract); window names are text-safe deep inks; drift ticks have an accessible name (\"date may shift by one day, moon sighting\"); the rail is keyboard-navigable as a list (G jumps next window); geometry reserved before toggle (CLS ≤0.02)"
  },
  {
   "name": "MetricSwitcher",
   "purpose": "segmented control over the four canonical metrics (active customers, repeat purchase rate, cumulative revenue per customer, orders per active customer)",
   "obligations": "Radio-group semantics; current metric + its denominator sentence rendered in text next to the control (never color/icon alone); switching re-renders cells with values crossfading ≤120ms and the metric label changing in the same frame"
  },
  {
   "name": "SeasonChip",
   "purpose": "season-kind mark on cohort rows and period columns: kind icon + short label + composition share",
   "obligations": "Icon+text+color, never color alone (05 six-mark system); eid gold text uses the deep tier; chips have an accessible description carrying the full window name and dates; removable when used as filters (P08)"
  },
  {
   "name": "CompositionSentence",
   "purpose": "the disclosure line under the grid header: each cohort's season-composition share in plain arithmetic (\"Ramadan peak 62% of window days · non-seasonal 38%\")",
   "obligations": "Plain-text (SR-readable as a block); renders per content direction with bidi isolation for Arabic season names; visible wherever comparisons quote cohorts — the disclosure is a reading gate, not a footnote"
  },
  {
   "name": "SeasonWindowEditor",
   "purpose": "create/edit a season window: dual Hijri/Gregorian dates, phase map (three phase rows with day ranges), market, kind, drift disclosure toggle, provenance state",
   "obligations": "Labels persist above fields (a11y-baseline §5); dual-calendar inputs with the active system explicit + cross-reference on hover (P24); overlap validation at save with the named days and both windows (03 CP-3 edge); baseVersion carried for CONFLICT semantics; autosave indicator (P10) in the edit surface"
  },
  {
   "name": "ComparisonDuel",
   "purpose": "the season-aligned comparison: two cohort columns side by side, curves aligned at period 0, per-metric deltas, size-imbalance note, shared-complete-periods truncation note",
   "obligations": "Aligned two-column duel grammar (the CompareBoard pattern kinship — 12 Q-7): delta stated in text in every row, no animated race, no color-only direction; both cohorts' composition sentences render inside the duel; small-sample cautions propagate per period; truncation note is text, not a clipped axis"
  },
  {
   "name": "CustomerDrillTable",
   "purpose": "member list of a cohort or cell: customer key, display label (source-provided), first order date, order count, revenue to date",
   "obligations": "Read-only by construction (no customer mutations — LOOP-10 CRM exclusion); labels bidi-isolated (dir=\"auto\"); missing labels render key-only with the stated reason; Western numerals, inline-end alignment mirrored in RTL; virtualized >200 rows (P19); export-membership action is the only row action"
  },
  {
   "name": "FreshnessChip",
   "purpose": "source health on every grid header: bound-state, last sync, coverage window, stale/failed degradation",
   "obligations": "Visible on every surface that quotes data (never settings-only — credential-contract §3 posture applied to source health); states icon+text; stale chip carries the last-good timestamp and the refresh action; announced politely on change, never assertively (09 schedule)"
  },
  {
   "name": "RulesetPanel",
   "purpose": "the definitions surface: four canonical metrics with exact formulas, thresholds (30/10), incomplete-period rule, coverage rule, ruleset version history",
   "obligations": "Renders formulas as text (SR-readable); each grid snapshot's version pin is a link to the version it ran under; versioned list with change notes; no collapsible hiding of the arithmetic (inspectability is the product's posture — 04 rationale)"
  }
 ],
 "ops": [
  "getSession",
  "updateWorkspace",
  "getSource",
  "refreshSource",
  "importOrdersSample",
  "listSeasonKinds",
  "listSeasonWindows",
  "getSeasonWindow",
  "createSeasonWindow",
  "updateSeasonWindow",
  "computeGrid",
  "getGrid",
  "getCohortDetail",
  "listCustomers",
  "compareCohorts",
  "getComparison",
  "saveView",
  "listViews",
  "updateView",
  "deleteView",
  "exportEvidence",
  "getArtifact",
  "listJobs",
  "getActivity",
  "getRuleset"
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
     "name": "defaultMarket",
     "optional": false,
     "type": "Market"
    },
    {
     "name": "calendarMethodDisclosure",
     "optional": false,
     "type": "string"
    },
    {
     "name": "defaultGranularity",
     "optional": false,
     "type": "Granularity"
    }
   ]
  },
  {
   "name": "CommerceSource",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'commerce-orders'"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'bound' | 'syncing' | 'stale' | 'failed'"
    },
    {
     "name": "coverageStart",
     "optional": false,
     "type": "string"
    },
    {
     "name": "coverageEnd",
     "optional": false,
     "type": "string"
    },
    {
     "name": "lastSyncAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "revenueFieldMeaning",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ImportedSample",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "importedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rowCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "duplicateRowCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "coverageStart",
     "optional": false,
     "type": "string"
    },
    {
     "name": "coverageEnd",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "SeasonPhase",
   "fields": [
    {
     "name": "name",
     "optional": false,
     "type": "'build-up' | 'peak' | 'wind-down'"
    },
    {
     "name": "startDayOffset",
     "optional": false,
     "type": "number"
    },
    {
     "name": "endDayOffset",
     "optional": false,
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
     "name": "market",
     "optional": false,
     "type": "Market"
    },
    {
     "name": "kindId",
     "optional": false,
     "type": "SeasonKindId"
    },
    {
     "name": "yearLabel",
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
     "optional": true,
     "type": "string"
    },
    {
     "name": "gregorianStart",
     "optional": false,
     "type": "string"
    },
    {
     "name": "gregorianEnd",
     "optional": false,
     "type": "string"
    },
    {
     "name": "hijriStart",
     "optional": true,
     "type": "string"
    },
    {
     "name": "hijriEnd",
     "optional": true,
     "type": "string"
    },
    {
     "name": "phases",
     "optional": false,
     "type": "SeasonPhase[]"
    }
   ]
  },
  {
   "name": "SeasonKind",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "SeasonKindId"
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
     "name": "drift",
     "optional": false,
     "type": "0 | 1"
    },
    {
     "name": "defaultWindowPerMarket",
     "optional": false,
     "type": "Partial<Record<Market, { start: string; end: string; phases: SeasonPhase[] }>>"
    }
   ]
  },
  {
   "name": "SeasonCompositionPart",
   "fields": [
    {
     "name": "windowId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kindId",
     "optional": false,
     "type": "SeasonKindId"
    },
    {
     "name": "shareOfWindowDays",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "CohortRow",
   "fields": [
    {
     "name": "cohortId",
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
     "optional": true,
     "type": "string"
    },
    {
     "name": "acquisitionWindow",
     "optional": false,
     "type": "{ start: string; end: string; windowKind: 'gregorian-period' | 'season-window'; windowId?: string }"
    },
    {
     "name": "size",
     "optional": false,
     "type": "number"
    },
    {
     "name": "composition",
     "optional": false,
     "type": "SeasonCompositionPart[]"
    }
   ]
  },
  {
   "name": "CellValue",
   "fields": [
    {
     "name": "periodIndex",
     "optional": false,
     "type": "number"
    },
    {
     "name": "denominator",
     "optional": false,
     "type": "number"
    },
    {
     "name": "value",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "suppressed",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "caution",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "inProgress",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "seasonOverlap",
     "optional": false,
     "type": "{ windowId: string; kindId: SeasonKindId }[]"
    }
   ]
  },
  {
   "name": "GridSnapshot",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "query",
     "optional": false,
     "type": "GridQuery"
    },
    {
     "name": "cohortRows",
     "optional": false,
     "type": "CohortRow[]"
    },
    {
     "name": "cells",
     "optional": false,
     "type": "Record<MetricKey, CellValue[][]>"
    },
    {
     "name": "periodLabels",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "coverageClamp",
     "optional": false,
     "type": "{ requestedFrom: string; requestedTo: string; effectiveFrom: string; effectiveTo: string } | null"
    },
    {
     "name": "rulesetVersion",
     "optional": false,
     "type": "string"
    },
    {
     "name": "seasonWindowVersions",
     "optional": false,
     "type": "{ windowId: string; version: number }[]"
    },
    {
     "name": "sourceState",
     "optional": false,
     "type": "{ coverageStart: string; coverageEnd: string; lastSyncAt: string | null }"
    },
    {
     "name": "generatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no source, no sample)",
   "\"لا شبكة فوج بعد. افتح عالما العينة المزرعة واقرأ شبكة مثبتة على الموسم في دقيقتين — أو الصق عينة طلبات واحسب شبكتك.\"",
   "Open sample world / Paste orders sample",
   "S1 sample-data mode",
   "\"تعمل بيانات العينة — التغطية من 2024-10-01 إلى 2026-10-15. كل القواعد سارية؛ اربط مصدر التجارة متى جهزت بياناتك الحقيقية.\""
  ],
  "loading": [
   "S1 grid skeleton",
   "row-band and column-band skeleton + \"Computing the cohort grid…\" (SR)",
   "هيكل صفوف وأعمدة + \"جارٍ حساب شبكة الفوج…\"",
   "Grid compute (large scale)",
   "\"Computing 104 weekly cohorts over 24 months…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (malformed sample row)",
   "\"Row 17 has no customer key — rows around it imported fine. Fix row 17 and import just it.\"",
   "\"السطر 17 بلا مفتاح عميل — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده.\"",
   "VALIDATION (zero-length season window)"
  ],
  "success": [
   "Grid ready",
   "\"Grid ready — 104 weekly cohorts, 24 months, coverage clamp: none.\"",
   "\"الشبكة جاهزة — 104 فوج أسبوعي، 24 شهراً، بلا اقتصاص تغطية.\"",
   "Grid ready (clamped)",
   "\"Grid ready — 104 cohorts. Requested from 2024-09-01; coverage starts 2024-10-01, so the first month is excluded.\""
  ]
 },
 "briefLine": "A cohort grid analytics product for revenue operations teams at MENA retailers and e-commerce merchants: customers acquired in a defined window as rows, their repeat purchasing and cumulative revenue as columns over subsequent periods, computed over order data supplied by the buyer's existing commerce source through the adapter (the product binds a source; it is not a CRM and never becomes an order store). The grid itself is vendor-established craft (01: Mixpanel, Amplitude, and PostHog all ship retention grids; the acquisition-window × subsequent-period triangle with its period-0 column and its cell-to-member drill is the shape analysts already read). What no vendor ships — and what no storefront analytics console even attempts (01: WooCommerce's mature reporting stops at period comparison, with no cohort construct and no seasonality concept) — is the part this product owns: the grid is lying to MENA retailers about their seasons, and this product stops the lie."
} as const;
export type Spec = typeof SPEC;
