// GENERATED from specs-source/ad-spend-consolidator/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "ad-spend-consolidator",
 "title": "Ad Spend Consolidator",
 "family": "analytics",
 "tier": 2,
 "flagship": false,
 "adapter": "AdSpendConsolidatorAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Sarf Blue",
  "pairing": "P04",
  "radius": "8px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "crisp",
  "fonts": [
   "Cairo",
   "Sora"
  ],
  "primary": "#5073B5",
  "accent": "#2E4B83",
  "canvas": "#202E47"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Spend dashboard (home)",
   "purpose": "period total, daily timeline with overlay bands, channel breakdown, snapshot version chip + health",
   "shell": "",
   "data": "getSnapshot, getSpendTimeline, getSpendBreakdown, getSession",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S2",
   "name": "Reconciliation console",
   "purpose": "overlap findings beside their raw line-item pairs; resolution actions; cluster grouping",
   "shell": "",
   "data": "listOverlapFindings, resolveOverlap, listSpendLines",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S3",
   "name": "Raw line items",
   "purpose": "full ledger browser: import batches, revisions, dedupe state, bidi-safe campaign names",
   "shell": "",
   "data": "listSpendLines",
   "archetype": "board"
  },
  {
   "id": "S4",
   "name": "Snapshots & revisions",
   "purpose": "version history, health flags, revision deltas, superseded markers, re-derive action",
   "shell": "",
   "data": "listSnapshots, getRevisionDelta, runConsolidation",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "Overlay library",
   "purpose": "moment authoring: bilingual names, anchor rules, market scope, status",
   "shell": "",
   "data": "listHolidayMoments, saveHolidayMoment",
   "archetype": "settings-admin"
  },
  {
   "id": "S6",
   "name": "Overlay comparison",
   "purpose": "occurrence windows, control windows, lift ratio, like-for-like delta, channel split",
   "shell": "",
   "data": "getOverlayComparison, getSpendTimeline",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S7",
   "name": "Budgets & pacing",
   "purpose": "budget lines, pace meters, variance states, amendment history",
   "shell": "",
   "data": "listBudgetLines, saveBudgetLine, getPacing",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "Channel connections",
   "purpose": "connection list, create/edit, verify, cadence + metric-shape + priority policy, health",
   "shell": "",
   "data": "listChannelKinds, listChannelConnections, createChannelConnection, updateChannelConnection, verifyChannelConnection",
   "archetype": "settings-admin"
  },
  {
   "id": "S9",
   "name": "Normalization & FX",
   "purpose": "reporting currency, FX basis, epsilon, pacing threshold; declared rate table with receipts",
   "shell": "",
   "data": "updateNormalizationPolicy, getFxRateTable",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S10",
   "name": "Exports & jobs",
   "purpose": "report-pack composer, artifacts with expiry, all async jobs (imports, consolidations, exports)",
   "shell": "",
   "data": "exportReportPack, getArtifact, getUsage, listJobs",
   "archetype": "editor-studio"
  },
  {
   "id": "S11",
   "name": "Settings",
   "purpose": "locale/direction default, capability consents (kind-not-vendor), usage window",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  }
 ],
 "flows": [],
 "components": [
  {
   "name": "SpendTimeline",
   "purpose": "the core canvas: daily normalized series in reporting currency, overlay bands, optional budget pace line, day focus",
   "obligations": "SVG/ARIA hybrid: category axis right-to-left in RTL with value axis on the inline-end (rtl-rules §2); ←/→ day traversal, Enter opens day detail (03 CP-2.4); each day carries an accessible name (date + total + band membership) — the chart is a virtualized list to assistive tech, never a bare image; band-width reserved in the skeleton so overlays arriving cause no reflow (P02, CLS ≤0.02 per 10); series updates redraw-settle (never tweened — 05 motion); rate-unavailable days render a flagged notch excluded from ratios (07c rule 6), icon+text, never color-only; ≥2 series (channel split) get pattern+legend differentiation with text labels on focus"
  },
  {
   "name": "OverlayBand",
   "purpose": "holiday-window region over the timeline: fill, boundary, bilingual label, occurrence anchor, method disclosure",
   "obligations": "Band fill gold family at 05 contracts (band-fill #F4E3BF, gold-deep boundary + label 4.76:1 inside); label renders moment name in workspace locale + market-scope chip; occurrence line (\"Ramadan 1447 · 18 Feb – 19 Mar 2026 · Umm al-Qura presentation\" / dual-calendar per P24 with Hijri cross-reference on hover/focus); method disclosure is a focusable popover, not hover-only (a11y); two overlapping bands render layered, both labeled — never merged (03 CP-2 edge); band boundary carries a 3:1 non-text contrast step against paper; keyboard: band focusable, Enter opens its comparison (CP-4)"
  },
  {
   "name": "ChannelBreakdownTable",
   "purpose": "per-channel totals with cadence, freshness, native currency, receipt expanders",
   "obligations": "Sortable columns (P18 arrow-key navigation + range selection); >200 rows virtualize (P19) with row-count context on region entry; freshness states render icon+text (fresh / late-cadence / stale / revoked — never color alone); each amount cell embeds its ConversionReceipt expander (below); native-currency column keeps Western numerals + Latin codes, bidi-isolated in RTL chrome; sticky header clears focused rows (2.4.11); 360px collapses to card layout (skill row 71)"
  },
  {
   "name": "ConversionReceipt",
   "purpose": "the evidence unit: native amount → rate → reporting amount with basis + policy version",
   "obligations": "Renders inline-expandable (140ms, crisp) from any converted figure: source amount + currency, applied rate, basis (daily-rate-per-spend-day / monthly-average), policy version, rate-source disclosure (\"declared workspace policy\" — never a market feed, 08 N3); receipt figures in Sora 600 tabular settings; rate-unavailable state renders the receipt with the gap named (07c rule 2); every receipt row is focusable with its full text as accessible content (no tooltip-only evidence, a11y-baseline §4)"
  },
  {
   "name": "OverlapPairPanel",
   "purpose": "the reconciliation decision surface: candidate pair + evidence + resolution actions",
   "obligations": "Two line-item panels side-by-side (native amounts, currencies, import batches, report dates, connection policies — the evidence the decision needs, 03 CP-3.2); match evidence block (external key, day, converted delta, match score per 07c rule 4) announced on panel focus; resolution actions: keep-first (by connection priority, named), split (declared portion), both-counted (re-key) — each with REQUIRED reason field (P04 discipline: the confirm names what is being resolved and why it will be recorded); resolution history renders as a chain (DiffView reuse for policy changes); CONFLICT state renders both payloads (P10); panel pair reflows to stacked below 820px, each keeping its own data direction"
  },
  {
   "name": "SnapshotVersionChip",
   "purpose": "the version identity of every read: version, computedAt, policy version, health flags",
   "obligations": "Renders on every snapshot-scoped surface (dashboard, timeline, breakdown — the version is part of the number, 04); health flags (open overlaps count, late-cadence channels, revisions applied, rate-unavailable days) as icon+text chips; superseded state renders slate with the newer version named and a one-action switch (03 CP-2 edge); chip focus announces \"Snapshot version 4, computed 17 October 2026 at 09:00, 2 open overlaps, 1 revision applied\""
  },
  {
   "name": "RevisionDeltaView",
   "purpose": "vN vs vN-1 per line item / channel / day + receipt-change class + affected resolutions",
   "obligations": "DiffView pattern per line item (P16, direction-aware); delta classes: amount-revised / rate-changed / basis-changed / new / superseded — each with its slate-family icon+text mark; totals row shows the net delta in tabular figures with sign; affected-resolution list links back to OverlapPairPanel; renders as a definition table for screen readers (values always present as text, never heat-map-only)"
  },
  {
   "name": "PacingMeter",
   "purpose": "budget-line progress vs linear pace with variance zones",
   "obligations": "Two-tone bar (actual vs linear-pace line) + variance percentage in Western tabular figures; zones: on-pace (≤ threshold, default 10% policy data), over-pace (red family, icon+text), under-pace (amber icon + amber-deep text on paper only — 05 contracts); meter value is text+bar never bar-only; partial-coverage state flags (\"16 of 61 days covered — pacing computes over covered days\", 03 CP-5 edge); closed budget lines render the final actual-vs-budget read with the amendment history chain"
  },
  {
   "name": "MomentEditor",
   "purpose": "holiday-moment authoring: bilingual names, kind, anchor rule, length, market scope, status",
   "obligations": "Two-column name authoring (EN + AR per P23 discipline — alignment link between the name fields, per-side direction rendering, length-parity warning since band labels are space-constrained); kind selector (hijri-anchored / gregorian-fixed / movable-gregorian) drives the anchor form: hijri anchor (month+day in Hijri + conversion-method selector with disclosure), fixed date, movable rule (e.g. \"Friday following the fourth Thursday of November\"); anchor validation per 07c rule 8 (VALIDATION names the broken rule); preview renders the next two computed occurrence windows before save (the calendar honesty made visible); market scope as multi-select chips; version + autosave states (P10); stale edit → CONFLICT both kept"
  },
  {
   "name": "ReportPackComposer",
   "purpose": "export picker: formats, window, snapshot version, quota, expiry",
   "obligations": "Format checkboxes with per-format descriptions (consolidated statement / reconciliation ledger / overlay analysis / raw line items); snapshot version selector (exports carry their version — 07a pinning); quota surface before running (P14: what the pack costs in the usage window); expiry declared at creation (7 days seed default) with renewal action; artifact list with per-artifact state and regenerate (deterministic — \"identical to the state it came from\", 11 §D); failed-format partial policy surfaces per-format retry (async-contract §4)"
  }
 ],
 "ops": [
  "getSession",
  "listChannelKinds",
  "listChannelConnections",
  "createChannelConnection",
  "updateChannelConnection",
  "verifyChannelConnection",
  "importSpendLines",
  "listSpendLines",
  "updateNormalizationPolicy",
  "getFxRateTable",
  "runConsolidation",
  "listSnapshots",
  "getSnapshot",
  "getRevisionDelta",
  "getSpendBreakdown",
  "getSpendTimeline",
  "listOverlapFindings",
  "resolveOverlap",
  "listHolidayMoments",
  "saveHolidayMoment",
  "getOverlayComparison",
  "listBudgetLines",
  "saveBudgetLine",
  "getPacing",
  "exportReportPack",
  "getArtifact",
  "listJobs",
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
     "name": "reportingCurrency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "policyId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "fxRateTableId",
     "optional": false,
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
   "name": "FxRate",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "from",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "to",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "date",
     "optional": false,
     "type": "string"
    },
    {
     "name": "month",
     "optional": true,
     "type": "string"
    },
    {
     "name": "rate",
     "optional": false,
     "type": "number"
    },
    {
     "name": "basis",
     "optional": false,
     "type": "FxBasis"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'declared-policy' | 'accepted-proposal'"
    },
    {
     "name": "enteredByMemberId",
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
   "name": "ChannelKindDescriptor",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "ChannelKind"
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
     "name": "typicalCadence",
     "optional": false,
     "type": "'daily' | 'weekly' | 'monthly'"
    },
    {
     "name": "metricShapeNotesEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "metricShapeNotesAr",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ChannelConnection",
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
     "name": "kind",
     "optional": false,
     "type": "ChannelKind"
    },
    {
     "name": "nativeCurrency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "cadence",
     "optional": false,
     "type": "Cadence"
    },
    {
     "name": "metricShape",
     "optional": false,
     "type": "MetricShape"
    },
    {
     "name": "fxBasisOverride",
     "optional": true,
     "type": "FxBasis"
    },
    {
     "name": "dedupePriority",
     "optional": false,
     "type": "number"
    },
    {
     "name": "status",
     "optional": false,
     "type": "ConnectionStatus"
    },
    {
     "name": "credential",
     "optional": true,
     "type": "{"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'unverified' | 'active' | 'expiring-soon' | 'expired' | 'revoked' | 'failed'"
    }
   ]
  },
  {
   "name": "ImportBatch",
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
     "name": "connectionId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "source",
     "optional": false,
     "type": "ImportSource"
    },
    {
     "name": "windowStart",
     "optional": true,
     "type": "string"
    },
    {
     "name": "windowEnd",
     "optional": true,
     "type": "string"
    },
    {
     "name": "revisionOfBatchId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "importedByMemberId",
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
   "name": "SpendLineItem",
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
     "name": "connectionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "batchId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "externalKey",
     "optional": false,
     "type": "string"
    },
    {
     "name": "campaignRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "spendDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reportDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nativeAmount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "nativeCurrency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number"
    },
    {
     "name": "supersededByLineItemId",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "ConversionReceipt",
   "fields": [
    {
     "name": "lineItemId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nativeAmount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "nativeCurrency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "rate",
     "optional": true,
     "type": "number"
    },
    {
     "name": "rateId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "basis",
     "optional": false,
     "type": "FxBasis"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "reportingCurrency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "reportingAmount",
     "optional": true,
     "type": "number"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'converted' | 'rate-unavailable' | 'native'"
    }
   ]
  },
  {
   "name": "NormalizedSpendRecord",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "snapshotId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "lineItemIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "connectionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "campaignRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "day",
     "optional": false,
     "type": "string"
    },
    {
     "name": "amountReporting",
     "optional": false,
     "type": "number"
    },
    {
     "name": "receipts",
     "optional": false,
     "type": "ConversionReceipt[]"
    },
    {
     "name": "dedupeState",
     "optional": false,
     "type": "'single' | 'kept-first' | 'split' | 'both-counted' | 'overlap-open'"
    }
   ]
  },
  {
   "name": "ConsolidationSnapshot",
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
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "windowStart",
     "optional": false,
     "type": "string"
    },
    {
     "name": "windowEnd",
     "optional": false,
     "type": "string"
    },
    {
     "name": "computedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "connectionVersions",
     "optional": false,
     "type": "Record<string, number>"
    },
    {
     "name": "fxRateTableVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'current' | 'superseded'"
    },
    {
     "name": "supersededByVersion",
     "optional": true,
     "type": "number"
    },
    {
     "name": "health",
     "optional": false,
     "type": "{"
    }
   ]
  },
  {
   "name": "OverlapResolution",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "OverlapResolutionKind"
    },
    {
     "name": "reason",
     "optional": false,
     "type": "string"
    },
    {
     "name": "splitPortion",
     "optional": true,
     "type": "number"
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
    },
    {
     "name": "snapshotVersionApplied",
     "optional": true,
     "type": "number"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no line items, no snapshot)",
   "\"لا إنفاق هنا بعد. الصق أول تصدير قناة — أو افتح مساحة العيّنة وشاهد تعارضاً يُكتشف ومقارنة رمضان تُحسب.\"",
   "Paste spend lines / Open sample workspace",
   "S1 filtered-empty (snapshots/lines)",
   "\"No snapshots match these filters.\""
  ],
  "loading": [
   "S1 dashboard skeleton",
   "timeline skeleton with reserved band width + breakdown rows ×8 + \"Loading the consolidated ledger…\"",
   "هيكلية الخط الزمني بعرض نطاقات محجوز + صفوف هيكلية + \"جارٍ تحميل السجل المجمَّع…\"",
   "Snapshot switch",
   "تبديل حالة خلال 120 مللي ثانية بلا مؤشر — رقاقة الإصدار تُعاد التسمية"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (import bad row)",
   "\"Row 17 is malformed — its native amount is missing. Rows 1–16 imported; fix row 17 and import it alone.\"",
   "\"الصف 17 معطوب — مبلغه الأصلي مفقود. استُوردت الصفوف 1–16؛ صحّح الصف 17 واستورده وحده.\"",
   "VALIDATION (resolution without reason)"
  ],
  "success": [
   "Import done",
   "\"180 line items in — 171 appended, 6 superseded as revisions, 3 invalid rows named and skipped.\"",
   "\"دخل 180 بند إنفاق — 171 أُلحقت، و6 سبقتها مراجعات، و3 صفوف غير صالحة سُمّيت وتُخطيت.\"",
   "Consolidation complete (the stamp)",
   "\"Consolidation complete — SAR 10.6 million for the window, 5 channels, 1 open overlap. Snapshot version 4.\""
  ]
 },
 "briefLine": "A spend consolidation dashboard for MENA marketing operations teams whose money is scattered across every channel they buy from. Marketing spend arrives here from channel connections — abstract, kind-not-vendor intake points (\"search-ads-class\", \"social-ads-class\", \"marketplace-ads-class\", \"offline-media-class\", \"agency-report-class\") each declaring its native currency, its reporting cadence, and its metric shape — or from the always-available manual path: pasted or uploaded spend line items, zero credentials required. Every line item lands raw and verbatim (native amount, native currency, spend date, report date, external key, campaign reference); the product's engine then runs a consolidation: deterministic normalization that converts every amount into the workspace's single declared reporting currency through a declared FX policy (per-day spend-date rate or monthly average — a policy, printed on every converted figure as a conversion receipt), resolves overlaps (the agency report and the marketplace console both claiming the same spend — detected by external key + day + amount-within-epsilon, never silently deduplicated), and produces a versioned snapshot. Snapshots are immutable: when an upstream channel revises its figures after the fact — a documented reality of platform-reported numbers (research digest, DataReportal caveat) — the revision lands as a new snapshot version with a named delta, and history never mutates."
} as const;
export type Spec = typeof SPEC;
