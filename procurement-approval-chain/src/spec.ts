// GENERATED from specs-source/procurement-approval-chain/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "procurement-approval-chain",
 "title": "Procurement Approval Chain",
 "family": "business_ops",
 "tier": 3,
 "flagship": false,
 "adapter": "ProcurementApprovalAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Tafwid Honey",
  "pairing": "P16",
  "radius": "8px",
  "elevation": "layered-depth",
  "icon": "line-1.5",
  "motion": "stately",
  "fonts": [
   "Scheherazade New",
   "Libre Caslon Text"
  ],
  "primary": "#BD853F",
  "accent": "#8A5600",
  "canvas": "#282017"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Requests home (register)",
   "purpose": "my-queue vs all-requests by role, filters + saved views, sample-request card first-run",
   "shell": "",
   "data": "listRequests, getSession, listJobs (badge)",
   "archetype": "review-queue"
  },
  {
   "id": "S2",
   "name": "Request composer (draft)",
   "purpose": "bilingual header, lines editor, quote entry, justification, routing-preview rail",
   "shell": "Request composer (draft)",
   "data": "createDraftRequest, updateRequest, addQuote, updateQuote, removeQuote, selectQuote, previewRouting, listVendors, saveVendor, submitRequest",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Request detail / approval workspace",
   "purpose": "document-paper surface: lines, quote comparison, budget evidence, chain rail, decision bar, history",
   "shell": "",
   "data": "getRequest, decideStep, resubmitRequest, withdrawRequest, cancelApprovedRequest, exportRequestPackage",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "Budgets console",
   "purpose": "envelopes by period/cost center/category, commitment bars, over-budget states",
   "shell": "",
   "data": "listBudgetEnvelopes, saveBudgetEnvelope",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "Approval matrix studio",
   "purpose": "rules by specificity, bands, chains, matrix version, policy pack",
   "shell": "",
   "data": "getApprovalMatrix, saveApprovalRule, removeApprovalRule, getPolicyPack, savePolicyPack",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Org & delegation",
   "purpose": "positions, levels, assigned members, delegation windows",
   "shell": "",
   "data": "listPositions, savePosition, setDelegation, clearDelegation",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "Vendors & cost centers",
   "purpose": "bilingual reference directories",
   "shell": "",
   "data": "listVendors, saveVendor, listCostCenters, saveCostCenter",
   "archetype": "list-console"
  },
  {
   "id": "S8",
   "name": "Activity log",
   "purpose": "filterable accountability surface (P17)",
   "shell": "",
   "data": "listActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "Jobs & artifacts",
   "purpose": "export jobs, artifact expiry, retry",
   "shell": "",
   "data": "listJobs, getArtifact",
   "archetype": "jobs-centre"
  },
  {
   "id": "S10",
   "name": "Settings",
   "purpose": "workspace locale, currency display, direction preference, sample-data clearing",
   "shell": "",
   "data": "getSession, getPolicyPack",
   "archetype": "settings-admin"
  },
  {
   "id": "S11",
   "name": "Command palette (overlay)",
   "purpose": "bilingual normalized search across requests/envelopes/positions/vendors/jobs",
   "shell": "",
   "data": "client-side over S1/S4/S5/S6/S7 data",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Draft → quotes → routing preview → submit (the requester's value proof)",
   "steps": [
    "A vendor she uses is missing from the directory — she adds it inline with both names (\"مطابع المدينة / Al-Madinah Printers\"). listVendors · saveVendor",
    "She fixes a typo in one quote's total and removes one duplicate entry. updateQuote · removeQuote"
   ]
  },
  {
   "title": "CP-4 — Policy studio: matrix, policy pack, envelopes, org & delegation (Faisal's admin surface)",
   "steps": [
    "He sets the policy pack: quotes required above 25,000, minimum 3 quotes, near-limit at 80%, over-budget advisory at workspace default. savePolicyPack",
    "He maintains reference data: cost centers and the vendor directory (bilingual names, notes). listCostCenters · saveCostCenter · listVendors · saveVendor"
   ]
  },
  {
   "title": "CP-5 — Register, activity, exports, jobs (the accountability surface)",
   "steps": [
    "Amal drills into any request she can see; no-access rows never render as \"empty\" (P01 no-access state). getRequest",
    "The activity log: filterable by actor, action, and target; every consequential mutation present (P17). listActivity",
    "He exports the audit register (matrix versions, policy pack versions, envelope states, activity appendix) at period close. exportAuditRegister",
    "Both exports are Jobs with declared artifact expiry; he retrieves the artifact link before the window closes. listJobs · getArtifact",
    "*Failures: NETWORK mid-list → banner + retry; export partial failure → per-format retry (async-contract §4); artifact expired → NOT_FOUND + renew.",
    "*Recovery: all list surfaces cursor-paginated and re-fetchable; exports re-generate from live state; nothing is ever lost to an export failure."
   ]
  }
 ],
 "components": [
  {
   "name": "RequestComposer",
   "purpose": "the draft surface: bilingual header fields (title ar/en, cost center, category, needed-by), lines editor (description ar/en, qty, unit, estimated unit price), live header total, autosave",
   "obligations": "P09 progressive disclosure (first line required before quote panel opens); P11 recalls prior values on re-entry; amounts in integer minor units via AmountInput; per-field direction containers with bidi isolation (rtl-rules §2); validation on-blur-or-submit with field-linked messages; labels persist above fields; line arithmetic announced politely on change (\"Line total 3,450.00 — request total 12,050.00\")"
  },
  {
   "name": "RoutingPreviewRail",
   "purpose": "the signature transparency surface: live chain preview while drafting — rule that will fire, band the total falls in, ordered positions with current assignees, budget projection with envelope state",
   "obligations": "Deterministic (07c rules 2–6); every element text+icon, never color-only; band label carries the amount interval (\"شريحة 5,001–50,000\" / \"Band 5,001–50,000\"); preview-vs-submit divergence surfaces a named notice (03 CP-1 edge); keyboard-reachable as a landmark region; updates announced politely with total-anchored copy"
  },
  {
   "name": "QuoteComparisonTable",
   "purpose": "quotes side by side: vendor (bilingual, own direction), total, delta vs lowest (amount + percent), lead time, terms, validity, selected mark, document reference",
   "obligations": "Table semantics with row/column headers announced; lowest row marked with icon+text (\"الأدنى\" / \"Lowest\") never color alone; deltas recompute deterministically on any quote edit; selection of a non-lowest row opens the justification requirement inline (the VALIDATION gate pre-empted at the surface); sort fixed (lowest first, ties by receivedAt then vendorId — 07c rule 6); >3 quotes scrolls within the table, never re-sorts; amount columns inline-end aligned (05 alignment rule)"
  },
  {
   "name": "BudgetEnvelopeBar",
   "purpose": "envelope consumption: allocated, committed (in-flight + approved), projected with this request; states within/approaching/over",
   "obligations": "Value labels always in text (charts.csv value-label contract); the honey→honey-deep→red ramp carries state with icon+label (\"ضمن المخصص\" / \"Within envelope\" · \"قرب الحد\" / \"Approaching limit\" · \"تجاوز\" / \"Over\"); bar geometry reserved pre-render (CLS budget, 10); over state names the breach amount (\"exceeds by 4,100.00\"); blocking-vs-advisory badge distinct from state; announced politely on projection change"
  },
  {
   "name": "ApprovalChainRail",
   "purpose": "the live chain: ordered steps with position, assignee (or delegate with window), state (queued/awaiting/approved/rejected/returned), decision note, timestamp; preserved history versions on resubmission",
   "obligations": "List semantics (ol) — a chain is an ordered record; step states icon+text; delegation badge carries both identities (\"بتفويض عن\" / \"as delegate for\"); the active step focusable with the DecisionBar anchored to it; state changes pair text deltas with the settle transition (motion-language); history versions collapsed but keyboard-expandable; self-approval block renders as an explicit named refusal, never a silent skip"
  },
  {
   "name": "DecisionBar",
   "purpose": "the approver's act: Approve / Return (with note) / Reject (with note), bound to the focused step",
   "obligations": "Buttons are verbs with objects (copy-voice §1.5); return/reject require a note (VALIDATION surfaced inline before submit); decisions are recorded authority acts — no optimistic undo (03 CP-2 edge; P03 deviation recorded); focus stays on the bar after decision with the outcome announced assertively on failure, politely on success; ≥24px targets (2.5.8), 44px on ≤767px"
  },
  {
   "name": "ThresholdMatrixEditor",
   "purpose": "DOA rule authoring: scope selector (default/cost center/category), band rows (from–to, chain of positions), validation inline",
   "obligations": "Band arithmetic validated at save (ascending, non-overlapping, terminal unbounded — gaps and overlaps NAMED, 07c rule 2); duplicate-scope detection names both rules; keyboard band reordering (2.5.7 drag alternative); amount inputs via AmountInput; the matrix version and last-save actor visible on the surface (audit weight)"
  },
  {
   "name": "AmountInput",
   "purpose": "money entry for lines, quotes, bands, envelopes: workspace currency, integer minor units internally, 2-decimal presentation, thousands separators per locale",
   "obligations": "Western numerals (ledger row) in both directions; parse never depends on numeral form (storage canonical — rtl-rules §3); paste never blocked (3.3.8); spellcheck=false; negative and non-numeric input refused inline with field-linked messages; inline-end alignment in RTL mirrored to inline-start reading order per table rules (rtl-rules §5 grids)"
  },
  {
   "name": "StatusSeal",
   "purpose": "the request's state as a circular seal mark on the document header: draft/submitted/in-review/approved/rejected/returned/withdrawn/cancelled",
   "obligations": "The one circular-radius deviation (05); state carried by icon+text label beside the seal, never the mark alone; the seal is decorative structure — the state text is the accessible carrier; \"The Chain Closes\" stamp animation fires only on the approved transition (05 signature micro-interaction) with reduced-motion instant fallback"
  }
 ],
 "ops": [
  "getSession",
  "createDraftRequest",
  "updateRequest",
  "addQuote",
  "updateQuote",
  "removeQuote",
  "selectQuote",
  "previewRouting",
  "submitRequest",
  "listRequests",
  "getRequest",
  "decideStep",
  "resubmitRequest",
  "withdrawRequest",
  "cancelApprovedRequest",
  "listActivity",
  "exportRequestPackage",
  "exportAuditRegister",
  "listJobs",
  "getArtifact",
  "getApprovalMatrix",
  "saveApprovalRule",
  "removeApprovalRule",
  "getPolicyPack",
  "savePolicyPack",
  "listBudgetEnvelopes",
  "saveBudgetEnvelope",
  "listPositions",
  "savePosition",
  "setDelegation",
  "clearDelegation",
  "listCostCenters",
  "saveCostCenter",
  "listVendors",
  "saveVendor"
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
     "name": "currency",
     "optional": false,
     "type": "'SAR' | 'AED'"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    }
   ]
  },
  {
   "name": "Member",
   "fields": [
    {
     "name": "id",
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
     "name": "role",
     "optional": false,
     "type": "MemberRole"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "joinedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Position",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "titleAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "titleEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "level",
     "optional": false,
     "type": "number"
    },
    {
     "name": "assigneeMemberIds",
     "optional": false,
     "type": "string[]"
    }
   ]
  },
  {
   "name": "Delegation",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "positionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "holderMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "delegateMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "window",
     "optional": false,
     "type": "{ start: string; end: string }"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "CostCenter",
   "fields": [
    {
     "name": "id",
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
     "name": "note",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Vendor",
   "fields": [
    {
     "name": "id",
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
     "name": "note",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "ThresholdBand",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "fromMinor",
     "optional": false,
     "type": "number"
    },
    {
     "name": "toMinor",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "positionIds",
     "optional": false,
     "type": "string[]"
    }
   ]
  },
  {
   "name": "ApprovalRule",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "scope",
     "optional": false,
     "type": "RuleScope"
    },
    {
     "name": "bands",
     "optional": false,
     "type": "ThresholdBand[]"
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
   "name": "ApprovalMatrix",
   "fields": [
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "rules",
     "optional": false,
     "type": "ApprovalRule[]"
    }
   ]
  },
  {
   "name": "PolicyPack",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "quotesRequiredThresholdMinor",
     "optional": false,
     "type": "number"
    },
    {
     "name": "minimumQuoteCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "nearLimitPercent",
     "optional": false,
     "type": "number"
    },
    {
     "name": "overBudgetDefault",
     "optional": false,
     "type": "'advisory' | 'blocking'"
    },
    {
     "name": "soleSourceExceptionEnabled",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "categories",
     "optional": false,
     "type": "CategoryRef[]"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (fresh workspace)",
   "\"No purchase requests yet. Open the sample request to see a full approval chain — quotes, budget, decision — end to end.\"",
   "\"لا طلبات شراء بعد. افتح الطلب النموذجي لرؤية سلسلة اعتماد كاملة — عروض أسعار وموازنة وقرار — من أولها إلى آخرها.\"",
   "Open sample request / افتح الطلب النموذجي",
   "S1 filtered-empty"
  ],
  "loading": [
   "S1 register skeleton",
   "skeleton rows ×8 + \"Loading your requests…\" (SR)",
   "صفوف هيكلية ×8 + \"جارٍ تحميل طلباتك…\"",
   "S3 request skeleton",
   "document-shaped skeleton + \"Loading the request and its chain…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (band gap)",
   "\"The bands leave a gap — 50,001 and above are unrouted. Make the last band unbounded or add one.\"",
   "\"تترك الشرائح فجوة — من 50,001 وما فوق بلا توجيه. اجعل الشريحة الأخيرة غير محدودة أو أضف شريحة.\"",
   "VALIDATION (band overlap)"
  ],
  "success": [
   "Submitted",
   "\"Submitted — routed to Department Manager → Finance Manager under band 5,001–50,000.\"",
   "\"أُرسل — وُجِّه إلى مدير الإدارة ← المدير المالي ضمن شريحة 5,001–50,000.\"",
   "Step advanced",
   "\"Reem approved step 1 — Finance Manager is next.\""
  ]
 },
 "briefLine": "The unique feature is budget-aware threshold routing with vendor-quote comparison, built as three interlocking inspectable mechanisms. First, threshold routing: the DOA matrix is workspace-owned, versioned policy data — scope-keyed rules (workspace default, per cost center, per category) each carrying ascending amount bands, every band naming an ordered approval chain of positions (\"≤ 5,000 → Department Manager; 5,001–50,000 → Department Manager → Finance Manager; above → + General Manager\") — the banded role-to-threshold convention practitioners already run on paper (research q4: $500 supervisor / $10,000 manager / $50,000 VP; board-ratified DOA documents). Routing computes at the header level from the request total, exactly the release strategy enterprise ERP uses, and it computes before submission as a preview the requester can read (\"who will sign this, and why\"). Second, budget-awareness: budget envelopes (cost center × category × fiscal period) hold allocated amounts and derived commitments — in-flight plus approved requests commit against the envelope, so every submission projects committed + this request and yields a named state: within, approaching (≥ the workspace near-limit percentage), or over — advisory by default, blocking per envelope policy, with the soft/hard-stop convention the category sells as \"budget control\" rendered as inspectable policy data. Third, vendor-quote comparison: quotes attach to the request with typed totals, lead times, terms, and optional document references; comparison is deterministic — lowest total named, every other quote's delta in amount and percent, and selecting a quote that is not the lowest requires a written justification before submission passes — the 3-quote-rule discipline (research q5: common internal policy and audit best practice, \"not a law\") encoded as workspace policy (minimum quote count above a threshold, sole-source exception with recorded justification) rather than as a hard-coded rule."
} as const;
export type Spec = typeof SPEC;
