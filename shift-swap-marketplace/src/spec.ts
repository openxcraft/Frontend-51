// GENERATED from specs-source/shift-swap-marketplace/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "shift-swap-marketplace",
 "title": "Shift Swap Marketplace",
 "family": "business_ops",
 "tier": 1,
 "flagship": true,
 "adapter": "ShiftSwapAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Nahas Copper",
  "pairing": "P04",
  "radius": "14px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "energetic",
  "fonts": [
   "Cairo",
   "Sora"
  ],
  "primary": "#B85E31",
  "accent": "#823B15",
  "canvas": "#422616"
 },
 "screens": [
  {
   "id": "S1",
   "name": "MY SHIFTS",
   "purpose": "Worker / 360px+",
   "shell": "",
   "data": "14-day schedule, coverage states, entry to post-a-swap",
   "archetype": "list-console"
  },
  {
   "id": "S2",
   "name": "THE BOARD",
   "purpose": "Worker / 360px+",
   "shell": "",
   "data": "open swap offers, filters, visible-but-gated ineligible cards",
   "archetype": "board"
  },
  {
   "id": "S3",
   "name": "OFFER DETAIL (Fairness Reveal)",
   "purpose": "Worker / 360px+",
   "shell": "",
   "data": "shift facts, viewer eligibility panel, rank preview ladder, policy sheet link",
   "archetype": "list-console"
  },
  {
   "id": "S4",
   "name": "POST-A-SWAP wizard",
   "purpose": "Worker / 360px+",
   "shell": "",
   "data": "3-step progressive form: shift → pre-flight → note",
   "archetype": "wizard-flow"
  },
  {
   "id": "S5",
   "name": "MY SWAPS (status ladder)",
   "purpose": "Worker / 360px+",
   "shell": "",
   "data": "my offers + my requests with live rank and outcome states",
   "archetype": "list-console"
  },
  {
   "id": "S6",
   "name": "RANKED LADDER (offerer view)",
   "purpose": "Worker / 360px+",
   "shell": "",
   "data": "full ranked queue for my offer; rationale drill; accept",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "INBOX",
   "purpose": "Worker / 360px+",
   "shell": "",
   "data": "notification ladder per class, seen state",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "WORKER PROFILE & QUALIFICATIONS",
   "purpose": "Worker / 360px+",
   "shell": "",
   "data": "my qualification cards, expiries, swap balance, seniority band",
   "archetype": "settings-admin"
  },
  {
   "id": "S9",
   "name": "POLICY SHEET",
   "purpose": "Worker / 360px+ (also console)",
   "shell": "",
   "data": "worker-readable fairness policy + blackout rules, versioned",
   "archetype": "settings-admin"
  },
  {
   "id": "S10",
   "name": "SIGN-IN",
   "purpose": "Both / all",
   "shell": "",
   "data": "session entry, locale pick, role routing",
   "archetype": "list-console"
  },
  {
   "id": "S11",
   "name": "CONSOLE QUEUE",
   "purpose": "Console / 1280px+",
   "shell": "",
   "data": "approval queue, aging, rule flags, bulk-safe select",
   "archetype": "review-queue"
  },
  {
   "id": "S12",
   "name": "MATCH DRAWER",
   "purpose": "Console / 1280px+",
   "shell": "",
   "data": "ladder snapshot, rationale chips, rest ribbons, decide",
   "archetype": "list-console"
  },
  {
   "id": "S13",
   "name": "TEAM SCHEDULE",
   "purpose": "Console / 1280px+",
   "shell": "",
   "data": "read-only imported schedule; swap coverage overlay",
   "archetype": "calendar-grid"
  },
  {
   "id": "S14",
   "name": "RULES CENTER",
   "purpose": "Console / 1280px+",
   "shell": "",
   "data": "blackout rules CRUD w/ plain-language previews",
   "archetype": "list-console"
  },
  {
   "id": "S15",
   "name": "FAIRNESS POLICY (edit + simulate)",
   "purpose": "Console / 1280px+",
   "shell": "",
   "data": "weights, tiebreaks, caps; before/after simulation",
   "archetype": "settings-admin"
  },
  {
   "id": "S16",
   "name": "PEOPLE & QUALIFICATIONS",
   "purpose": "Console / 1280px+",
   "shell": "",
   "data": "worker roster, qualification registry, paste-import, assignment",
   "archetype": "list-console"
  },
  {
   "id": "S17",
   "name": "LEDGER & JOBS",
   "purpose": "Console / 1280px+",
   "shell": "",
   "data": "activity log, fairness ledger export, job center",
   "archetype": "review-queue"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Worker posts a shift for swap (the daily outgoing action; mobile)",
   "steps": [
    "The offer expires automatically at the workspace cutoff (default: 12h before shift start, policy-governed); expiry is a state, not a deletion.",
    "*Recovery: every offer is reversible before match (cancelSwapOffer with reason); undo window on post; MY OFFERS shows expiry countdown."
   ]
  },
  {
   "title": "CP-5 — Ops lead stands up the rules spine (admin, desktop; Tariq's flow)",
   "steps": [
    "Entry: RULES CENTER (D4) first-run checklist (P22, honest milestones): qualifications registry → blackout rules → fairness policy publish → worker roster.",
    "*Recovery: registry changes are versioned via activity ledger; rule archive is reversible (un-archive restores active state, history intact)."
   ]
  },
  {
   "title": "CP-6 — Ops, notifications, and resilience (non-happy-path walkthroughs; documented and tested)",
   "steps": [
    "Live updates: subscribeSwapEvents drives board mutations and MY REQUESTS rank deltas; the mock (07c) replays a fixed event script deterministically.",
    "Job center (D8): getJob/retryJob/cancelJob for imports and ledger exports; retry scoped to failed rows only (async-contract §4)."
   ]
  }
 ],
 "components": [
  {
   "name": "FairnessLadder",
   "purpose": "The ranked queue: candidate rows with rationale chips (seniority band, swap balance, rest compliance, recency), drill-down component rows; used in offer detail (rank preview), offerer queue, supervisor snapshot",
   "obligations": "Semantics: ordered list (ol) — rank is list position, announced as \"المرتبة 2 من 5\" / \"rank 2 of 5\" on row focus, never on every change; rationale chips are text + icon (never color-only); drill is a disclosure (aria-expanded) within the row; ladder mutations (rank deltas) announce politely on focus only. Motion: reveal cascade stagger ≤60ms capped at 5 rows (13 §B1); reduced-motion = rows render simultaneously, rank shown as text"
  },
  {
   "name": "RationaleChip",
   "purpose": "One fairness component as a readable fact: icon + label + value (\"أقدمية: 3 سنوات\" / \"Seniority: 3 yrs\")",
   "obligations": "Text carries the value (a11y-baseline §4 pairing); chips focusable with described-by drill text; duotone icon tone maps to contribution direction but text is the signal"
  },
  {
   "name": "SwapHandshake",
   "purpose": "The signature confirm choreography: two shift cards converge + copper weld line on match confirmation (13 §B2)",
   "obligations": "Pure decoration-free success semantics: the welded state is ALSO a state chip with the weld-mark icon + text \"تم تأكيد التبديل\" — motion never the only carrier (motion-language §5); reduced-motion = crossfade to chip; announcement assertive-once then polite summary"
  },
  {
   "name": "RestRibbon",
   "purpose": "Blackout visualization: horizontal 48h time ribbon around a target shift showing the worker's adjacent shifts and the protected minimum-rest windows as hatched no-go bands; violations render a named flag (13 §B3)",
   "obligations": "Ribbon is an SVG+text composite where every band has a text label and the violation flag is an alert region with the rule name; the ribbon is focusable as a figure with description; tap target per shift segment ≥44px; reduced-motion = bands render at final state (draw skipped), labels identical"
  },
  {
   "name": "OfferCard",
   "purpose": "Board card: shift facts, requester, site, time-to-start, qualification match state (visible-but-gated dimming for non-qualified — never hidden)",
   "obligations": "Gated state carries aria-disabled + reason text on the card (not on hover); card is a single focusable element with described-by details; settle-in motion 180ms (no spin-in); dimmed contrast still ≥3:1 for its text"
  },
  {
   "name": "StatusLadder",
   "purpose": "The worker's request lifecycle: queued → ranked → accepted → supervisor-approved → confirmed (or declined/expired/cancelled) as a vertical step strip with live rank delta",
   "obligations": "Step states are text + icon; current step announced politely on transition (instant-tier events only); ladder mirrors RTL (progress toward inline-end); focus lands on the changed step with delta text"
  },
  {
   "name": "EligibilityPanel",
   "purpose": "Pre-flight result panel (CP-1.3/CP-2.3): green (eligible) / amber (rule at risk, named) / red (blocked, rule named) with the exact rule quote and the policy sheet link",
   "obligations": "Color never sole carrier — each state has icon + heading text; amber names the rule and the hours math in words; panel focusable, announced on open (polite); link to policy sheet is in tab order"
  },
  {
   "name": "PolicySheet",
   "purpose": "Worker-readable fairness policy + blackout rules, versioned, bilingual (S9)",
   "obligations": "Rendered as a definition list (component → weight → plain-language effect); version announced in the heading; numerals Western; printable/exportable as accessible text (not image)"
  },
  {
   "name": "WeldMarkBadge",
   "purpose": "The reserved confirm glyph (⊨ double-line) + \"covered\" state for confirmed swaps in schedule/board surfaces",
   "obligations": "Semantic reservation enforced: never used for pending states; badge = icon + text pair; contrast ≥3:1 as UI component"
  }
 ],
 "ops": [
  "getSession",
  "listShifts",
  "getShift",
  "listSwapOffers",
  "getSwapOffer",
  "createSwapOffer",
  "cancelSwapOffer",
  "createSwapRequest",
  "cancelSwapRequest",
  "listMySwapRequests",
  "listRequestsForOffer",
  "checkSwapEligibility",
  "computeFairnessRanking",
  "getFairnessPolicy",
  "updateFairnessPolicy",
  "acceptSwapRequest",
  "denySwapRequest",
  "listMatches",
  "recordSupervisorDecision",
  "listBlackoutRules",
  "upsertBlackoutRule",
  "archiveBlackoutRule",
  "listQualifications",
  "upsertQualification",
  "assignQualification",
  "listWorkers",
  "updateWorker",
  "inviteWorker",
  "listNotifications",
  "markNotificationsSeen",
  "subscribeSwapEvents",
  "listActivity",
  "importScheduleSource",
  "exportFairnessLedger",
  "getJob",
  "retryJob",
  "cancelJob"
 ],
 "entities": [
  {
   "name": "Worker",
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
     "name": "displayName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "role",
     "optional": false,
     "type": "Role"
    },
    {
     "name": "teamIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "seniorityAnchorDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "swapBalance",
     "optional": false,
     "type": "number"
    },
    {
     "name": "qualificationIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'suspended-from-swaps' | 'archived'"
    },
    {
     "name": "joinedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Qualification",
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
     "name": "description",
     "optional": false,
     "type": "string"
    },
    {
     "name": "renewalMonths",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'skill' | 'certificate' | 'role-band' | 'jurisdiction-eligibility'"
    },
    {
     "name": "conflictsWithIds",
     "optional": false,
     "type": "string[]"
    }
   ]
  },
  {
   "name": "WorkerQualification",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "workerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "qualificationId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "grantedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "grantedByWorkerId",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Shift",
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
     "name": "teamId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "assignedWorkerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "startsAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "endsAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "breakMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "site",
     "optional": false,
     "type": "string"
    },
    {
     "name": "requiredQualificationIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'schedule-import' | 'manual-entry'"
    },
    {
     "name": "sourceImportedAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'scheduled' | 'open-swap' | 'swap-pending' | 'covered' | 'completed' | 'cancelled-upstream'"
    }
   ]
  },
  {
   "name": "SwapOffer",
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
     "name": "shiftId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "offeringWorkerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "note",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "postedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'open' | 'awaiting-supervisor' | 'matched' | 'withdrawn' | 'expired'"
    },
    {
     "name": "requestCount",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "FairnessComponent",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "'seniority' | 'swap-balance' | 'qualification-coverage' | 'rest-compliance' | 'recent-swap-load'"
    },
    {
     "name": "rawValue",
     "optional": false,
     "type": "number"
    },
    {
     "name": "normalized",
     "optional": false,
     "type": "number"
    },
    {
     "name": "weight",
     "optional": false,
     "type": "number"
    },
    {
     "name": "points",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "FairnessScore",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "offerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "workerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "totalPoints",
     "optional": false,
     "type": "number"
    },
    {
     "name": "components",
     "optional": false,
     "type": "FairnessComponent[]"
    },
    {
     "name": "rationale",
     "optional": false,
     "type": "string"
    },
    {
     "name": "ranking",
     "optional": false,
     "type": "number"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "computedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "SwapMatch",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "offerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "acceptedRequestId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "offeringWorkerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "incomingWorkerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "shiftId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'pending-supervisor' | 'confirmed' | 'denied' | 'cancelled' | 'blackout-violated'"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "approvalRecordId",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "BlackoutRule",
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
     "name": "kind",
     "optional": false,
     "type": "'minimum-rest' | 'max-weekly-hours' | 'no-clopening' | 'qualification-required-window'"
    },
    {
     "name": "scope",
     "optional": false,
     "type": "{ kind: 'workspace' | 'team' | 'role-band'; ref?: string }"
    },
    {
     "name": "params",
     "optional": false,
     "type": "{ hours?: number; weeklyHours?: number; startsAt?: string; endsAt?: string"
    },
    {
     "name": "qualificationId",
     "optional": true,
     "type": "string; packCode?: string }"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "notes",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "createdByWorkerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "archivedAt",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "ApprovalRecord",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "matchId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "decision",
     "optional": false,
     "type": "'approved' | 'denied'"
    },
    {
     "name": "decidedByWorkerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "decidedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rationale",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "rationaleTemplate",
     "optional": false,
     "type": "'coverage-risk' | 'rest-rule' | 'qualification-concern' | 'other' | null"
    },
    {
     "name": "fairnessSnapshot",
     "optional": false,
     "type": "{"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "ranking",
     "optional": false,
     "type": "{ workerId: string; ranking: number; totalPoints: number; rationale: string }[]"
    },
    {
     "name": "selectedWorkerId",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no shifts yet)",
   "\"No shifts yet. When your roster is added — imported or entered — your next 14 days appear here.\"",
   "\"لا مناوبات بعد. عند إضافة جدولك — استيراداً أو إدخالاً — تظهر أيامك الـ14 القادمة هنا.\"",
   "Add shifts (console) / view board",
   "S1 no-data-after-activity (roster re-published; week emptied)"
  ],
  "loading": [
   "S1 shifts skeleton",
   "(skeleton cards ×5) + SR: \"Loading your shifts…\"",
   "(صفوف هيكلية ×5) + \"جارٍ تحميل مناوباتك…\"",
   "S2 board skeleton",
   "(skeleton cards ×8, gated-dim geometry included) + SR: \"Loading open swaps…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (offer window)",
   "VALIDATION (blackout at request)",
   "\"This swap would leave you 7 hours of rest before your Friday night — the minimum is 11. The rule isn't a maybe; it's a wall.\"",
   "\"سيترك لك هذا التبديل 7 ساعات راحة قبل ليلة الجمعة — والحد الأدنى 11. القاعدة ليست احتمالاً؛ إنها جدار.\""
  ],
  "success": [
   "Offer posted",
   "\"Posted to the board — Undo (7s)\"",
   "\"نُشر على اللوحة — تراجع (7 ثوانٍ)\"",
   "Request sent",
   "\"Requested — you're rank 2 of 5 so far\""
  ]
 },
 "briefLine": "This is plan renegotiation, not plan creation: schedules arrive from the schedule source (the planner product or an external roster — abstract import, 08) and the marketplace only re-shapes coverage within declared rules (blackout windows, minimum rest, weekly-hour caps, qualification requirements). Swaps are second-class citizens of the plan and first-class citizens of fairness."
} as const;
export type Spec = typeof SPEC;
