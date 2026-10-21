// GENERATED from specs-source/expense-claim-flow/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "expense-claim-flow",
 "title": "Expense Claim Flow",
 "family": "business_ops",
 "tier": 2,
 "flagship": false,
 "adapter": "ExpenseClaimAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Masruf Vermilion",
  "pairing": "P06",
  "radius": "14px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "energetic",
  "fonts": [
   "Almarai",
   "Inter"
  ],
  "primary": "#CA545A",
  "accent": "#4F191C",
  "canvas": "#972430"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Claims home",
   "purpose": "role-aware queues (my claims / approvals / finance), filters + saved views (P08), onboarding checklist (P22), chain-position chips on every row",
   "shell": "",
   "data": "listClaims, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Claim composer",
   "purpose": "draft authoring: header, item rail (3 kinds), live totals + computation breakdowns, receipt bin",
   "shell": "",
   "data": "getClaim, createClaim, updateClaim, addClaimItem, updateClaimItem, removeClaimItem, previewItemComputation",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Receipt review panel",
   "purpose": "capture (photo/paste/upload), OCR draft fields with confidence + region links, manual-entry form (the same surface)",
   "shell": "Receipt review panel",
   "data": "attachReceipt, extractReceiptDraft, applyReceiptDraft, getUsage",
   "archetype": "wizard-flow"
  },
  {
   "id": "S4",
   "name": "Approval workspace",
   "purpose": "item table + findings rail + decision bar + approval-chain steps (CP-3)",
   "shell": "",
   "data": "getClaim, listPolicyFindings, resolvePolicyFinding, decideClaim, reassignApprovalStep, attachReceipt, updateClaimItem, runPolicyCheck, getRateTable",
   "archetype": "wizard-flow"
  },
  {
   "id": "S5",
   "name": "Policy studio",
   "purpose": "rate tables (effective-dated, versioned) + policy packs (matrix, thresholds, window)",
   "shell": "",
   "data": "listRateTables, getRateTable, saveRateTable, listPolicyPacks, savePolicyPack, listMembers, previewItemComputation",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Members",
   "purpose": "bilingual directory, roles, approver eligibility",
   "shell": "",
   "data": "listMembers",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "Payouts & export",
   "purpose": "approved queue, payout recording + corrections, evidence-pack export + artifacts",
   "shell": "",
   "data": "listClaims, recordPayout, exportClaimPackage, getArtifact",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "Jobs center",
   "purpose": "exports + long assist runs, cancel/retry, link-to-context (async-contract §7)",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "workspace locale/currency (informational defaults read at creation, 07a), capability consent state (kind, not vendor — credential-contract), usage window, payout methods list",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "wizard-flow"
  }
 ],
 "flows": [
  {
   "title": "CP-4 — Policy studio: author the rate table and the policy pack (Faisal's control path)",
   "steps": [
    "*Failures: stale baseVersion on concurrent edits → CONFLICT with both payloads; PERMISSION for non-admin members on all studio writes (07b rule 5).",
    "*Recovery: tables and packs are versioned; a bad activation reverts by activating the prior version (logged); nothing a claimant does ever mutates policy data."
   ]
  },
  {
   "title": "CP-5 — Payout recording, export, and the audit handoff (Amal's close)",
   "steps": [
    "Correction edge: she mistyped the reference — a payout correction appends a superseding record with a reason; records never rewrite (07a obligation).",
    "*Recovery: payout records and exports are append-only; packages regenerate from claim state at any time; the jobs console reconciles after reconnect."
   ]
  }
 ],
 "components": [
  {
   "name": "ClaimComposer",
   "purpose": "the claimant's authoring surface: header + item rail + reserved totals rail (CP-1)",
   "obligations": "Item rail lists the three item kinds with per-kind glyph + computed amount; totals rail reserved at fixed inline-end width (zero-reflow when amounts update, 10); live per-kind split; policy-pack badge with pinned-version note; drafts autosave (P10 indicator); item add via kind-chooser (3 large targets, keyboard-complete); offline banner + queued item writes (P20); keystroke-to-paint ≤16ms on amount/distance fields (10)"
  },
  {
   "name": "ComputationBreakdownCard",
   "purpose": "the inspectable arithmetic for per-diem and mileage items (the product's trust core)",
   "obligations": "Renders per-kind: mileage — distance × rate with the rate, vehicle class, rate-table name + version + effectiveFrom cited, all in tabular figures; per-diem — days × tier daily amount with proration rows (full days at 100%, first/last at the pack's percent) and the arithmetic shown; every citation is a focusable link that opens the rate table read-only (CP-3.3); renders identically in preview (before commit) and on the saved item — same component, two placements; a11y: the breakdown is a definition list announced as one unit on item focus (never per-line); numbers Western per ledger; rerenders live during field edits (deterministic, ≤50ms budget)"
  },
  {
   "name": "ReceiptCapturePanel",
   "purpose": "capture + the OCR-assist/manual dual surface (CP-2)",
   "obligations": "States: empty (capture affordance: photograph / paste / upload) → attached (image preview at the receipt's own script direction, zoomable, never force-flipped) → extracting (draft region reserved at full size BEFORE the run — CLS contract) → draft-ready (fields with confidence bands) → applied / manual-entry (the same form, always available); confidence bands: high (one-tap confirm), medium/low (badge + explicit confirm or correct); region-link on field focus highlights the source area on the image (the evidence anchor); metered-run count shown before run (P14); assist unbound/failed/limited → manual form renders as designed default, never as an error wall (08); a11y: image preview has a text alternative from the applied/typed fields (never an empty alt on a money document); draft start/completion announced politely, per-field never; Arabic-numeral amounts shown converted to Western display with the raw string preserved (rtl-rules §3)"
  },
  {
   "name": "ApprovalChainSteps",
   "purpose": "the multi-level route as first-class data (CP-3)",
   "obligations": "Steps ordered by level: pending (hollow duotone glyph) / active (vermilion ring) / approved (filled green check + actor + decided-at) / rejected (vermilion-deep octagon + reason on focus) / reassigned (delegation provenance: from → to, at, note); the claimant's card shows \"with {approver} — level {n} of {m}\" (never a black box); keyboard: ←/→ traverse steps, Enter opens the decision detail; route recomputation after pre-submission edits is visible (a threshold-crossing edit adds the step live); self-approval guard renders as a named reassignment, never a silent skip"
  },
  {
   "name": "PolicyFindingsRail",
   "purpose": "blocking-then-advisory findings list for the focused claim (CP-3)",
   "obligations": "Rows grouped blocking first; each row: kind glyph + one-line rule statement with measured values (\"Receipt required above SAR 75.00 — item 4 is SAR 240.00 with no receipt\"), link to the item, resolution actions inline (edit-resolve jumps to the item, override-with-reason dialog, false-positive record); resolution lifecycle states render as badges with actor + at; blocking rows sit on the vermilion tint with advisory-deep/ink text per §Color duty rules; live-region surface for finding arrival/dissolve; the document-wide twin lives in the approval workspace header (same rows, jump links)"
  },
  {
   "name": "ClaimQueueTable",
   "purpose": "role-aware virtualized queue (S1; S7 approved queue)",
   "obligations": ">200 rows virtualize (P19); row: claim reference (bidi-isolated Latin token), claimant bilingual name, total (tabular, currency-formatted), kind split chips, chain-position chip (\"with Salem — 1 of 2\"), state chip (icon+text+color per 05); filters render as removable chips with accessible predicate descriptions (P08), saved views shareable; ⌘K jump-to-reference; keyboard: ↑/↓ row traversal, Enter opens claim mode by role, Space bulk-selects (P07); four empties distinct per P01 (11)"
  },
  {
   "name": "RateTableEditor",
   "purpose": "effective-dated, versioned table authoring (CP-4)",
   "obligations": "Two sections: per-diem tiers (tier name bilingual, daily amount, currency) and mileage rates (vehicle class, per-km amount); effectiveFrom/effectiveTo row on the table header; source-note field (the honesty carrier — \"captured from …, verify against current policy\"); validation on blur + error summary on save (effective-range overlap, zero amounts, currency mismatch vs workspace — VALIDATION naming both sides); version compare via DiffView (P16 direction-aware); saving bumps version with a stated consequence note (\"claims computed earlier keep their pins\"); effective-date conflicts render as a two-row comparison, never a silent overwrite"
  },
  {
   "name": "ApprovalMatrixEditor",
   "purpose": "the DOA threshold matrix (CP-4)",
   "obligations": "Rows: upToAmount → approver (member picker, bilingual names) → level; live cumulative route preview for a sample amount as rows are typed (one engine, two surfaces — 07c routing rule); threshold-order and duplicate detection → inline VALIDATION naming both rows; empty approver rows refuse; a sample amount above the highest row renders the refusal preview (\"exceeds matrix authority — add a top row\") before it can reach a claimant; reorder by drag with keyboard equivalent (2.5.7); member references resolve against the directory (stale member → named warning, never a broken pointer); activation diff summary logged (P17)"
  },
  {
   "name": "PayoutRecorder",
   "purpose": "the manual evidence + the stamp moment (CP-5)",
   "obligations": "Fields: method (workspace-configured list), reference, date, amount-as-paid; double-submit guard (skill row 33) with idempotency key; corrections append — the record row shows superseded-by/supersedes chains with reasons, never rewrites; on success: \"The Reimbursement Stamp\" (05 signature — card lift + seal stamp ≤8% overshoot, amount + method announced politely; reduced-motion renders the seal instantly with full announcement); approved-queue rows without payout show aging (days since final approval) in ink, never alarm colors"
  }
 ],
 "ops": [
  "getSession",
  "listClaims",
  "getClaim",
  "createClaim",
  "updateClaim",
  "addClaimItem",
  "updateClaimItem",
  "removeClaimItem",
  "previewItemComputation",
  "attachReceipt",
  "extractReceiptDraft",
  "applyReceiptDraft",
  "submitClaim",
  "withdrawClaim",
  "runPolicyCheck",
  "listPolicyFindings",
  "resolvePolicyFinding",
  "decideClaim",
  "reassignApprovalStep",
  "recordPayout",
  "listRateTables",
  "getRateTable",
  "saveRateTable",
  "listPolicyPacks",
  "savePolicyPack",
  "listMembers",
  "exportClaimPackage",
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
     "name": "currency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "activePolicyPackId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "payoutMethods",
     "optional": false,
     "type": "string[]"
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
   "name": "Member",
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
     "name": "email",
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
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "PerDiemTier",
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
     "optional": false,
     "type": "string"
    },
    {
     "name": "dailyAmount",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "MileageRate",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "vehicleClass",
     "optional": false,
     "type": "'own-car' | 'motorcycle' | 'other-own-vehicle'"
    },
    {
     "name": "perUnitAmount",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "RateTable",
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
     "name": "currency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "perDiemTiers",
     "optional": false,
     "type": "PerDiemTier[]"
    },
    {
     "name": "mileageRates",
     "optional": false,
     "type": "MileageRate[]"
    },
    {
     "name": "proration",
     "optional": false,
     "type": "{"
    },
    {
     "name": "firstLastDayPercent",
     "optional": false,
     "type": "number"
    },
    {
     "name": "appliesTo",
     "optional": false,
     "type": "'per-diem'"
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
     "name": "sourceNote",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ApprovalMatrixRow",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "upToAmount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "approverMemberIds",
     "optional": false,
     "type": "string[]"
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
     "name": "rateTableId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "receiptRequiredAbove",
     "optional": false,
     "type": "number"
    },
    {
     "name": "submissionWindowDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "lateSeverity",
     "optional": false,
     "type": "'advisory' | 'blocking'"
    },
    {
     "name": "taxRequiredOnReceipts",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "perDiemMealDoubleDip",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "approvalMatrix",
     "optional": false,
     "type": "ApprovalMatrixRow[]"
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
   "name": "Claim",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reference",
     "optional": false,
     "type": "string"
    },
    {
     "name": "workspaceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "claimantMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "title",
     "optional": false,
     "type": "string"
    },
    {
     "name": "purpose",
     "optional": true,
     "type": "string"
    },
    {
     "name": "tripStart",
     "optional": true,
     "type": "string"
    },
    {
     "name": "tripEnd",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "ClaimStatus"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "policyPackId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "policyPackVersion",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "ComputationBreakdown",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "'per-diem' | 'mileage'"
    },
    {
     "name": "rateTableId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rateTableVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "rateTableName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "effectiveFrom",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rows",
     "optional": false,
     "type": "{ label: string; quantity: number; unitAmount: number; lineAmount: number }[]"
    },
    {
     "name": "prorationPercent",
     "optional": true,
     "type": "number"
    },
    {
     "name": "citation",
     "optional": false,
     "type": "{ tierName?: string; vehicleClass?: string; perUnitAmount: number; unit: 'day' | 'km' }"
    },
    {
     "name": "computedAmount",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "ClaimItem",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "claimId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "ClaimItemKind"
    },
    {
     "name": "description",
     "optional": true,
     "type": "string"
    },
    {
     "name": "inputs",
     "optional": false,
     "type": "ReceiptItemInputs | PerDiemItemInputs | MileageItemInputs"
    },
    {
     "name": "computedAmount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "breakdown",
     "optional": true,
     "type": "ComputationBreakdown"
    },
    {
     "name": "receiptAssetId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "revision",
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
  }
 ],
 "copy": {
  "empty": [
   "S1 claims first-run (claimant)",
   "New claim / Open sample claim",
   "S1 filtered-empty",
   "\"No claims match these filters.\"",
   "\"لا مطالبات تطابق هذه المرشّحات.\""
  ],
  "loading": [
   "S1 queue skeleton",
   "skeleton rows ×8 + \"Loading your claims…\" (SR)",
   "صفوف هيكلية ×8 + \"جارٍ تحميل مطالباتك…\"",
   "Composer boot",
   "item-rail skeleton + reserved totals rail (no shimmer over the numbers region)"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (empty submission)",
   "\"This claim holds 0 items — nothing to submit or route. Add at least one item.\"",
   "\"تحمل هذه المطالبة 0 بنود — لا شيء لتقديمه أو توجيهه. أضف بنداً واحداً على الأقل.\"",
   "VALIDATION (malformed amount)"
  ],
  "success": [
   "Item added (computation)",
   "\"Mileage added — 142 km at SAR 1.10 per km: SAR 156.20 computed.\"",
   "\"أُضيفت المسافة — 142 كم بمعدل 1.10 ريالٍ للكيلومتر: حُسب 156.20 ريالاً.\"",
   "Per-diem computed",
   "\"Per-diem computed — 3 full days at SAR 525.00 plus the first day at 75%: SAR 1,968.75.\""
  ]
 },
 "briefLine": "The unique feature is localized per-diem/mileage rules with bilingual receipt OCR assist, and it is built as two inspectable mechanisms, not oracles. First, the rules: rate tables are workspace-owned, versioned, effective-dated tables of per-diem destination tiers and mileage rates per vehicle class, in the workspace currency, with a source note on every table (\"captured from the 2026 travel policy memo, verify against current policy\") — because in the GCC, per-diem and mileage rates are company policy, not statute (research q9/q13: no government per-diem or mileage table surfaced for KSA/UAE; Alaan's own policy example is AED 400/day UAE-domestic, unverified estimate), while the global convention the category leans on — GSA/State destination-tiered per diems with 75% first/last-day proration, IRS mileage rates that changed mid-year 2026 (72.5¢ → 76¢/mi from July 1) — is exactly the *shape* of dated, tiered rates that a Gulf policy desk needs to encode and trust (q4/q5). Every computed item shows its computation breakdown: the tier's daily amount, the days, the proration applied, the rate citation, the arithmetic — so a claimant and an approver can argue about the same numbers. Second, the OCR assist: conditionally-AI (ai-native-patterns §1) — receipt capture offers an extraction draft (vendor, date, amount, tax, receipt number) with per-field confidence bands in either Arabic or English; every field is confirmed by a human before it writes to the claim (P15 trust checkpoint), and when the capability is unbound, rate-limited, or fails, the same form stands ready for manual entry — the manual path is not a fallback bolted on, it is the same surface (08 degradation map)."
} as const;
export type Spec = typeof SPEC;
