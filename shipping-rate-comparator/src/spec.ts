// GENERATED from specs-source/shipping-rate-comparator/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "shipping-rate-comparator",
 "title": "Shipping Rate Comparator",
 "family": "commerce_integrations",
 "tier": 3,
 "flagship": false,
 "adapter": "ShippingRateAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Tariq Amber",
  "pairing": "P16",
  "radius": "8px",
  "elevation": "soft-lift",
  "icon": "line-1.5",
  "motion": "minimal",
  "fonts": [
   "Scheherazade New",
   "Libre Caslon Text"
  ],
  "primary": "#C9942D",
  "accent": "#976700",
  "canvas": "#6A4500"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Cards home",
   "purpose": "card library, status/channel filters, coverage-gap warnings, onboarding checklist (P22)",
   "shell": "",
   "data": "listRateCards, createRateCard, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Card editor",
   "purpose": "zones + coverage, break grid, dimensional policy, surcharge stack; completeness gate state",
   "shell": "",
   "data": "getRateCard, updateRateCard, setRateCardStatus, resolveZone, duplicateRateCard",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Paste-import surface",
   "purpose": "paste field, header form, live parsed preview, named issues",
   "shell": "Paste-import surface",
   "data": "importRateCard, listJobs",
   "archetype": "wizard-flow"
  },
  {
   "id": "S4",
   "name": "Comparison workbench",
   "purpose": "profile form, live calculator, card selector, results table, batch mode",
   "shell": "",
   "data": "listRateCards, resolveZone, computeChargeableWeight, runComparison, runBatchComparison, createShipmentProfile",
   "archetype": "wizard-flow"
  },
  {
   "id": "S5",
   "name": "Comparison detail",
   "purpose": "full breakdown sheet per quote, derivation chain, pin, export",
   "shell": "",
   "data": "getComparison, setComparisonPin, exportComparison",
   "archetype": "jobs-centre"
  },
  {
   "id": "S6",
   "name": "Comparison history",
   "purpose": "singles + batches, pinned filter, date/status sorts",
   "shell": "",
   "data": "listComparisons",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Profiles library",
   "purpose": "reusable shipment profiles, last-run, usage counts",
   "shell": "",
   "data": "listShipmentProfiles, getShipmentProfile, updateShipmentProfile, deleteShipmentProfile",
   "archetype": "settings-admin"
  },
  {
   "id": "S8",
   "name": "Jobs console",
   "purpose": "import/batch/export jobs, cancel/retry, link-to-context",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "defaults (currency, unit system), normalization disclosure, consent state",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  },
  {
   "id": "S10",
   "name": "Command palette (overlay)",
   "purpose": "bilingual search across cards/comparisons/profiles/jobs",
   "shell": "",
   "data": "client-side over S1/S6/S7/S8 data",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — Card maintenance: zone/break/surcharge editing + renewal duplicate (the manager's daily loop)",
   "steps": [
    "Card status flip (retire) is a P04 level-2 confirm naming active comparisons that reference it. setRateCardStatus",
    "*Recovery: all card edits are versioned (activity log records every mutation, P17); retired cards remain readable and diffable."
   ]
  },
  {
   "title": "CP-3 — Single comparison: profile → live chargeable-weight settle → side-by-side quotes (the signature flow)",
   "steps": [
    "She types the destination; per-card zone resolution renders inline (\"Zone 2 · Zone A · no coverage\" per selected card) as she types. resolveZone (per card)",
    "*Recovery: comparisons are immutable snapshots keyed to profile + card versions; re-running creates a new snapshot, history never mutates."
   ]
  },
  {
   "title": "CP-4 — Batch comparison: paste destinations → per-destination cheapest (the morning surface)",
   "steps": [
    "Paste 30 destinations; per-row normalization preview with duplicate accounting; she runs the batch. runBatchComparison",
    "Exception rows float to the top: destinations with any no-coverage or out-of-range cell, sorted by exception count, each with its fix action.",
    "She saves the batch's single-destination rows she wants to keep as profiles (P11: the repeated destinations become recallable profiles). createShipmentProfile",
    "*Recovery: batch results are immutable snapshots like singles; the job's partial artifact is kept."
   ]
  },
  {
   "title": "CP-5 — Pin + export: comparison → negotiation evidence (the renewal file)",
   "steps": [
    "Hana opens a comparison from history (S6), filters to the pre-renewal snapshot. listComparisons · getComparison",
    "She pins it as evidence with a note (\"2026 renewal baseline — standard box, 3 cards\"). setComparisonPin",
    "Export: markdown table or CSV, with or without per-quote breakdowns — a Job with expiry + regeneration per async-contract §2. exportComparison",
    "The artifact downloads (manual path, zero credentials, LOOP-5); the export panel states the retention window. getArtifact",
    "*Recovery: artifacts regenerate from immutable snapshots; nothing is ever lost to an export failure."
   ]
  },
  {
   "title": "CP-6 — Libraries, jobs, settings (the management surface)",
   "steps": [
    "Cards home: filter by status/channel, saved views (P08), coverage-gap warnings (\"2 active cards have zones with empty coverage\"). listRateCards · getSession",
    "Profiles library: labels, last-run, usage counts. listShipmentProfiles · getShipmentProfile · updateShipmentProfile · deleteShipmentProfile",
    "Comparisons history: singles + batches, pinned filter, date sorts. listComparisons",
    "Jobs console: import/batch/export jobs with state, cancel/retry, link-to-context (async-contract §7; T3-consolidated console). listJobs",
    "Activity log: every card mutation, status flip, pin, and export (P17). listActivity",
    "*Edges: filtered-empty declares itself (P01); >200 history rows virtualize (P19); no-access surfaces → PERMISSION, never \"empty\".",
    "*Failures: NETWORK mid-list → banner + retry (P20); usage read failure → \"last known\" degradation.",
    "*Recovery: all lists cursor-paginated and re-fetchable; session locale switch re-renders without data loss."
   ]
  }
 ],
 "components": [
  {
   "name": "RateCardGrid",
   "purpose": "the zone × weight-break price matrix editor: one row per zone, one column per break, inline-editable price cells with contiguity enforcement",
   "obligations": "P18 grid semantics (arrow navigation, range selection); inline edit per P06 (Esc restores, Tab commits + advances); ladder-contiguity violations blocked inline with the neighbor cell named; money renders Western numerals, inline-end aligned, fixed decimals per currency; cells ≥24×24 targets (2.5.8); grid state announced on region entry (row/col counts); 360px → horizontal scroll then stacked per-zone cards (ux-guidelines Table Handling)"
  },
  {
   "name": "ZoneCoverageEditor",
   "purpose": "per-zone destination coverage: removable chips, add-field with live probe (\"does this destination resolve?\")",
   "obligations": "Coverage chips bidi-isolated (dir=\"auto\" on the add-field — rtl-rules §2); probe result is text (\"الاحساء → Zone 2 — matched الأحساء via normalization\"), never color-only; overlapping-coverage conflicts blocked at save with both zones named; probe is keyboard-reachable and SR-readable; zone.remote flag is a labeled checkbox, not a color state"
  },
  {
   "name": "DimWeightCalculator",
   "purpose": "the live three-figure settle: actual / volumetric / chargeable + the derivation line + divisor meaning",
   "obligations": "Keystroke-to-settle ≤16ms (10-performance); the winning figure carries amber-deep underline + derivation text (the Settle signature — 05 motion); all three figures always visible as text with units; rounding step and divisor shown as copy (\"÷ 5000 · step 0.5 kg\"); figures never animate value (crossfade only); reduced-motion → instant swap + polite announcement"
  },
  {
   "name": "ComparisonTable",
   "purpose": "results side-by-side: card row per quote — total, currency badge, delta chip vs cheapest, derivation summary, state cells (no-coverage / out-of-range / retired)",
   "obligations": "Sorted ascending within currency group; groups are labeled table sections (SR announces group headers); best-rate row = amber wash + green total + \"cheapest\" text badge (icon+text+color, never color alone); delta chips sign+number+arrow-icon; state cells carry icon + text + fix action (link to the card's zones); every total is text (never heat-only); >200 rows virtualize (P19) with focus preservation"
  },
  {
   "name": "QuoteBreakdownSheet",
   "purpose": "the full derivation chain for one quote: weights (which won), zone + matched coverage entry, break + base, overage math, surcharge lines each with its rule, pinned card version",
   "obligations": "Opens as a side sheet (focus trap + return to trigger); each line states rule-then-amount (\"fuel 12.5% of base 15.00 = 1.88\"); the chain is one ordered list semantically (SR reads it as arithmetic); card-version pin rendered as a chip; exportable content mirrors the sheet exactly (the artifact IS this sheet, typeset)"
  },
  {
   "name": "SurchargeStackEditor",
   "purpose": "typed surcharge definitions: fuel-percentage, COD (rate or flat), remote-area flat, declared-value rate, handling flat — each row its own rule in copy",
   "obligations": "Type selection is a radio-group with visible labels; each rule's copy updates live from its fields; percentages render bps-exact (\"12.5%\", never \"0.125\"); rule copy is bilingual and SR-read; delete is P03 undo-window (7s); rows reorder by keyboard (⌘↑/⌘↓, 2.5.7)"
  },
  {
   "name": "ImportTableMapper",
   "purpose": "paste-import surface: paste field, header form (channel/service/currency/unit system/divisor), live parsed preview grid, named-issue list",
   "obligations": "Parse preview is determinate and instant (client-side preview; the Job formalizes it); issues name row + reason + suggested fix; \"kept rows\" count always visible (partial policy visible); normalization applied visibly (chip per normalized name — \"متاجر جاهزه → متاجر جاهزة\" class disclosure); re-import idempotency stated in copy; job progress per async-contract §3 (row counts, never percentages)"
  },
  {
   "name": "BatchDestinationsPaste",
   "purpose": "batch mode entry: paste field (one destination per line), per-row normalization preview, duplicate accounting, card selector chips, run button",
   "obligations": "Per-row dir=\"auto\" isolation (mixed-script pastes — rtl-rules §2); duplicate rows counted with a badge, deduplicated in the matrix; empty/whitespace rows named as issues, never silently dropped; the run is a Job with destination-count progress (\"resolving 12 of 30\"); exception rows float with fix actions; matrix cells numeric (charts contract)"
  }
 ],
 "ops": [
  "getSession",
  "createRateCard",
  "listRateCards",
  "getRateCard",
  "updateRateCard",
  "setRateCardStatus",
  "duplicateRateCard",
  "importRateCard",
  "resolveZone",
  "computeChargeableWeight",
  "createShipmentProfile",
  "listShipmentProfiles",
  "getShipmentProfile",
  "updateShipmentProfile",
  "deleteShipmentProfile",
  "runComparison",
  "getComparison",
  "listComparisons",
  "setComparisonPin",
  "runBatchComparison",
  "exportComparison",
  "getArtifact",
  "listJobs",
  "getUsage",
  "listActivity"
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
     "name": "defaultCurrency",
     "optional": false,
     "type": "string"
    },
    {
     "name": "defaultUnitSystem",
     "optional": false,
     "type": "UnitSystem"
    },
    {
     "name": "normalizationDisclosure",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Zone",
   "fields": [
    {
     "name": "code",
     "optional": false,
     "type": "string"
    },
    {
     "name": "label",
     "optional": false,
     "type": "string"
    },
    {
     "name": "coverage",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "remote",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "WeightBreak",
   "fields": [
    {
     "name": "upToGrams",
     "optional": false,
     "type": "number"
    },
    {
     "name": "basePriceMinor",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "SurchargeDefinition",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "SurchargeKind"
    },
    {
     "name": "label",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rateBps",
     "optional": true,
     "type": "number"
    },
    {
     "name": "amountMinor",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "RateCard",
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
     "name": "channelLabel",
     "optional": false,
     "type": "string"
    },
    {
     "name": "serviceLabel",
     "optional": false,
     "type": "string"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "CardStatus"
    },
    {
     "name": "effectiveFrom",
     "optional": false,
     "type": "string"
    },
    {
     "name": "dimPolicy",
     "optional": false,
     "type": "DimPolicy"
    },
    {
     "name": "zones",
     "optional": false,
     "type": "Zone[]"
    },
    {
     "name": "breaks",
     "optional": false,
     "type": "WeightBreak[]"
    },
    {
     "name": "priceByZone",
     "optional": false,
     "type": "Record<string, number[]>"
    },
    {
     "name": "overage",
     "optional": false,
     "type": "OveragePolicy | null"
    }
   ]
  },
  {
   "name": "ShipmentProfile",
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
     "name": "label",
     "optional": false,
     "type": "string"
    },
    {
     "name": "destination",
     "optional": false,
     "type": "string"
    },
    {
     "name": "weightGrams",
     "optional": false,
     "type": "number"
    },
    {
     "name": "dimensions",
     "optional": true,
     "type": "{ lengthMm: number; widthMm: number; heightMm: number }"
    },
    {
     "name": "codAmount",
     "optional": true,
     "type": "{ amountMinor: number; currency: string }"
    },
    {
     "name": "declaredValue",
     "optional": true,
     "type": "{ amountMinor: number; currency: string }"
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
   "name": "ProfileSnapshot",
   "fields": [
    {
     "name": "label",
     "optional": true,
     "type": "string"
    },
    {
     "name": "destination",
     "optional": false,
     "type": "string"
    },
    {
     "name": "weightGrams",
     "optional": false,
     "type": "number"
    },
    {
     "name": "dimensions",
     "optional": true,
     "type": "{ lengthMm: number; widthMm: number; heightMm: number }"
    },
    {
     "name": "codAmount",
     "optional": true,
     "type": "{ amountMinor: number; currency: string }"
    },
    {
     "name": "declaredValue",
     "optional": true,
     "type": "{ amountMinor: number; currency: string }"
    }
   ]
  },
  {
   "name": "SurchargeLine",
   "fields": [
    {
     "name": "surchargeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "SurchargeKind"
    },
    {
     "name": "label",
     "optional": false,
     "type": "string"
    },
    {
     "name": "ruleText",
     "optional": false,
     "type": "string"
    },
    {
     "name": "amountMinor",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "QuoteResult",
   "fields": [
    {
     "name": "cardId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "cardVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "channelLabel",
     "optional": false,
     "type": "string"
    },
    {
     "name": "serviceLabel",
     "optional": false,
     "type": "string"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "QuoteStatus"
    },
    {
     "name": "actualWeightGrams",
     "optional": true,
     "type": "number"
    },
    {
     "name": "volumetricWeightGrams",
     "optional": true,
     "type": "number"
    },
    {
     "name": "chargeableWeightGrams",
     "optional": true,
     "type": "number"
    },
    {
     "name": "weightBasis",
     "optional": true,
     "type": "'actual' | 'volumetric' | 'minimum'"
    },
    {
     "name": "matchedZone",
     "optional": true,
     "type": "{ code: string; label: string; matchedCoverage: string; remote: boolean }"
    },
    {
     "name": "matchedBreakUpToGrams",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "ComparisonRow",
   "fields": [
    {
     "name": "destination",
     "optional": false,
     "type": "string"
    },
    {
     "name": "normalizedDestination",
     "optional": false,
     "type": "string"
    },
    {
     "name": "quotes",
     "optional": false,
     "type": "QuoteResult[]"
    },
    {
     "name": "exceptions",
     "optional": false,
     "type": "number"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 cards first-run",
   "Paste a card / Open samples",
   "S1 filtered-empty",
   "\"No cards match these filters.\"",
   "\"لا بطاقات تطابق هذه المرشّحات.\""
  ],
  "loading": [
   "S1 list skeleton",
   "skeleton rows ×8 + \"Loading your cards…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل بطاقاتك…\"",
   "Import job (determinate)",
   "\"Parsing 12 of 24 rows — 2 issues listed below the preview.\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (import bad row)",
   "\"Row 17's price '١٥٫٠٠' uses a decimal separator the parser doesn't accept — re-enter it as digits. Rows around it parsed fine.\"",
   "\"سعر السطر 17 '١٥٫٠٠' يستخدم فاصلة عشرية لا يقبلها المحلّل — أعد إدخاله أرقاماً. الأسطر من حوله حُلّلت سليمة.\"",
   "VALIDATION (break overlap)"
  ],
  "success": [
   "Card activated",
   "\"Card active — 'التوصيل المحلي القياسي' now rates comparisons at version 4.\"",
   "\"البطاقة نشطة — 'التوصيل المحلي القياسي' تسعّر المقارنات الآن بالإصدار 4.\"",
   "Import done",
   "\"24 rows in — 22 parsed, 2 issues listed, nothing silently dropped.\""
  ]
 },
 "briefLine": "The second half is the comparison engine, and it is deliberately deterministic arithmetic, not an oracle (ai-native-patterns §1 declaration: non-AI; every figure below is computable by hand). A shipment profile — destination, actual weight, box dimensions, optional declared value and cash-on-delivery amount — runs through every active card the manager selects. Each run performs the same traceable chain per card: normalize the destination and resolve the card's zone (a destination can be Zone 2 on one card and Zone B on another — zone systems are carrier-specific, research digest Q4/Q38); compute volumetric weight from the box dimensions against that card's divisor; take chargeable weight as the greater of actual and volumetric, rounded up to the card's billing step; look up the weight break; apply base price plus overage beyond the table; apply each surcharge by its own rule; and produce a quote with its full arithmetic visible — the manager never sees a total without the chain that produced it. Results sit side by side, sorted within each currency, with the cheapest per card set flagged, no-coverage and out-of-range results named honestly, and every quote pinned to the card version that produced it. The same profile can be re-run after a card is updated to see exactly what the renewal changed — which is the product's quiet second job: negotiation evidence. Comparisons export as procurement-ready artifacts, and a comparison can be pinned as the documented basis of a courier renewal discussion."
} as const;
export type Spec = typeof SPEC;
