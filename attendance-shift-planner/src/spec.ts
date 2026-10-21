// GENERATED from specs-source/attendance-shift-planner/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "attendance-shift-planner",
 "title": "Attendance Shift Planner",
 "family": "business_ops",
 "tier": 2,
 "flagship": false,
 "adapter": "ShiftPlannerAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Wijdan Indigo",
  "pairing": "P05",
  "radius": "8px",
  "elevation": "soft-lift",
  "icon": "line-2",
  "motion": "crisp",
  "fonts": [
   "Tajawal",
   "Hanken Grotesk"
  ],
  "primary": "#00708E",
  "accent": "#005872",
  "canvas": "#0A2833"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Teams home",
   "purpose": "teams list w/ ruleset + drift marks, onboarding checklist (P22), recent publications, amendment-attention",
   "shell": "",
   "data": "listTeams, listWeekPlans, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Team & roster",
   "purpose": "team settings (jurisdiction, ruleset binding, work-week start), worker list + editor, qualification library entry",
   "shell": "",
   "data": "getTeam, updateTeam, listWorkers, createWorker, importRoster, updateWorker, listQualifications, saveQualification",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Planner (week grid)",
   "purpose": "the core surface: week navigator + ruleset badge + Ramadan banner · roster rail · planning grid · violation inspector (CP-1/2)",
   "shell": "",
   "data": "getWeekPlan, listWorkers, upsertShift, removeShift, placeAssignment, updateAssignment, removeAssignment, listRuleViolations, waiveRuleViolation",
   "archetype": "calendar-grid"
  },
  {
   "id": "S4",
   "name": "Ruleset library",
   "purpose": "stock + custom rulesets, rule values with sources & capture dates, version history, Ramadan window config",
   "shell": "",
   "data": "listJurisdictionRulesets, getJurisdictionRuleset, saveCustomRuleset, validateRuleset",
   "archetype": "wizard-flow"
  },
  {
   "id": "S5",
   "name": "Publication & export",
   "purpose": "gate state, publication records incl. amendments, waiver ledger, export bundles + artifacts",
   "shell": "",
   "data": "publishWeekPlan, getPublicationRecord, exportSchedule, getArtifact, getUsage",
   "archetype": "review-queue"
  },
  {
   "id": "S6",
   "name": "Swap log",
   "purpose": "change provenance: recorded/imported swaps, introduced-by-swap violations, amendment state",
   "shell": "",
   "data": "recordExternalSwap, importSwapSet, listRuleViolations, getWeekPlan",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Jobs center",
   "purpose": "roster imports, scans, exports, swap imports — filterable state, link-to-context, per-job detail with progress history (async-contract §7); failed-item retry is an idempotent re-submit of the failed scope through the same operation (async-contract §4/§5)",
   "shell": "",
   "data": "listJobs",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "Settings",
   "purpose": "workspace locale default, numeral display (informational — Western per ledger), capability consent (kind-not-vendor), usage window",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "wizard-flow"
  },
  {
   "id": "S9",
   "name": "Worker review view",
   "purpose": "published week per worker (mobile/narrow first-class; desktop link-share)",
   "shell": "Worker review view",
   "data": "getWeekPlan, listRuleViolations (summary)",
   "archetype": "review-queue"
  }
 ],
 "flows": [
  {
   "title": "CP-3 — Publish the week → gate → notification & export handoff",
   "steps": [
    "She clears blockers (edit or waive — CP-2 grammar); the gate status updates live (≤120ms, derived read, 10).",
    "*Recovery: publication records are immutable; exports regenerate from plan state at any time; the jobs console reconciles after reconnect (async-contract §5)."
   ]
  },
  {
   "title": "CP-5 — Ruleset inspection, change & Ramadan mode (the guardrail's own lifecycle)",
   "steps": [
    "*Failures: stale baseVersion on ruleset save → CONFLICT both kept; validate on an incoherent rule set → VALIDATION with per-rule issues.",
    "*Recovery: ruleset versions are immutable once saved; every violation pins the version it was computed against; no rule change ever mutates a published week."
   ]
  }
 ],
 "components": [
  {
   "name": "PlanningGrid",
   "purpose": "the core lattice: worker rows × day columns, one-to-many shift blocks per cell",
   "obligations": "Virtualized rows (P19 — roster >200 rows virtualize; focus moves scroll into view, never the reverse); roving tabindex: ↑/↓ worker rows, ←/→ day columns with physical mapping stable in both directions (inline-end arrow = next day in ar and en chrome — rtl-rules §4); day columns mirror with the week flowing inline-start→inline-end per workspace direction while worker names render at their own script direction (bidi-isolated, 05); cell geometry reserved for guardrail chips so violations arriving cause zero reflow (10); drag-to-move blocks with a full keyboard equivalent (select block → ⌘ arrows — 2.5.7); Shift+arrow extends selection for bulk actions (P07); alternating paper/raised day columns read in grayscale (05); targets ≥24×24 (block handles, chips); 400% zoom reflows to per-worker stacked strips with violations re-anchored (09)"
  },
  {
   "name": "ShiftBlock",
   "purpose": "a shift in a cell: role, times, break, headcount, assignment chips",
   "obligations": "Inline edit (P06: Escape restores, Tab commits — time fields validate on blur, skill row 56); midnight-crossing renders the overflow edge into the next day's cell with a visual continuation mark (never silent wrap); stretch-to-resize via end handles with keyboard equivalent; states: draft/published/swapped-in/violation-marked; assignment chips carry qualification slate marks; swap provenance teal glyph + tooltip (icon + text, never glyph alone)"
  },
  {
   "name": "ViolationInspector",
   "purpose": "the inline-end rail listing every rule the draft breaks",
   "obligations": "Two severity groups (blocking first), grouped per worker and per rule; each row: rule name (fixed terminology), measured vs required in Western numerals, ruleset version pin, jump links to the offending cell(s) (both cells of a pair-rule named — the clopen's Sunday and Monday); waive-with-reason dialog from the row (reason REQUIRED — VALIDATION without); live-region surface for arrival/dissolve (chips arrive/dissolve 120/140ms with text equivalents — 05); warning rows carry per-worker breakdown disclosure; filtered-empty declares itself (P08/P01)"
  },
  {
   "name": "WeekNavigator",
   "purpose": "week stepper + dual-calendar header + ruleset badge + Ramadan banner",
   "obligations": "Prev/next/next-unplanned jumps (⌘[ / ⌘]); Gregorian primary + Hijri secondary (Umm al-Qura for KSA, method disclosed — portfolio Q-5, P24); active ruleset badge (jurisdiction + version, opens the ruleset detail); Ramadan banner when the week intersects the configured window — brass border + the word رمضان/Ramadan + reduced caps in text (perceivable without color, 05); sticky header clears focused rows (2.4.11 — scroll-margin token obligation)"
  },
  {
   "name": "RulesetPicker",
   "purpose": "team-level ruleset selection + inline rule values",
   "obligations": "Each option shows its rule values inline (max daily 8h, weekly 48h, rest 11h… — the values are the marketing, 00); stock rulesets read-only with source notes + capture date + \"verify against current law\" line; clone-to-custom is the only edit path (audit integrity, CP-5); binding is versioned (CONFLICT on stale team version); selection announced politely with jurisdiction + version"
  },
  {
   "name": "RosterRail",
   "purpose": "virtualized worker list (inline-start edge)",
   "obligations": "Row: bilingual name (own script direction per entry), worker code (Western), role, qualification chips (slate), contract-cap mark, day-off mark; drag source for assignment with keyboard equivalent (focus worker → ⌘→ places into focused cell's assign menu); filter chips + saved views (P08); contract-cap mark tooltip states the cap and that the engine enforces the stricter of ruleset/contract (07c rule 2)"
  },
  {
   "name": "GuardrailChip",
   "purpose": "cell-level violation mark on a block",
   "obligations": "Severity + rule name as text (never color alone); focusable, Enter opens the inspector row (jump-with-return); clusters with overflow count at >3 per cell (\"+2 more\"); dissolves on resolution with polite announcement"
  },
  {
   "name": "PublicationGate",
   "purpose": "the refusal gate + the seal",
   "obligations": "Live gate state (blockers with jump links — refusal copy names them: blocking violations, coverage shortfalls; never a generic \"not ready\"); on success: the T2 signature moment \"The Week Seals\" (05 — blocker rows fold staggered ≤60ms/5 rows into the published seal with actor+timestamp; reduced-motion renders the seal + full-summary announcement); post-publication edits open a NEW pending amendment — the seal (immutability) stays; publication record exports the waiver ledger (S5)"
  },
  {
   "name": "SwapLog",
   "purpose": "change-provenance surface (S6)",
   "obligations": "Recorded/imported swaps with from-worker, to-worker, agreed-at, source (manual-record / paste / change-channel); introduced-by-swap violations linked to their swap entry; amendment state per published week; bulk swap-set import from here (CP-4.5); every entry bilingual-safe (names at own script direction, times Western)"
  }
 ],
 "ops": [
  "getSession",
  "listTeams",
  "getTeam",
  "createTeam",
  "updateTeam",
  "listWorkers",
  "createWorker",
  "updateWorker",
  "importRoster",
  "listQualifications",
  "saveQualification",
  "deprecateQualification",
  "listJurisdictionRulesets",
  "getJurisdictionRuleset",
  "saveCustomRuleset",
  "validateRuleset",
  "listWeekPlans",
  "createWeekPlan",
  "getWeekPlan",
  "upsertShift",
  "removeShift",
  "placeAssignment",
  "updateAssignment",
  "removeAssignment",
  "runGuardrailCheck",
  "listRuleViolations",
  "waiveRuleViolation",
  "publishWeekPlan",
  "getPublicationRecord",
  "exportSchedule",
  "getArtifact",
  "recordExternalSwap",
  "importSwapSet",
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
    }
   ]
  },
  {
   "name": "Team",
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
     "name": "jurisdiction",
     "optional": false,
     "type": "JurisdictionCode"
    },
    {
     "name": "rulesetId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "timezone",
     "optional": false,
     "type": "string"
    },
    {
     "name": "workWeekStartsOn",
     "optional": false,
     "type": "0 | 1 | 6"
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
   "name": "TeamRulesetBinding",
   "fields": [
    {
     "name": "teamId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rulesetId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rulesetVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "boundAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "boundByMemberId",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "RuleDef",
   "fields": [
    {
     "name": "key",
     "optional": false,
     "type": "RuleKey"
    },
    {
     "name": "enabled",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "severity",
     "optional": false,
     "type": "RuleSeverity"
    },
    {
     "name": "minutes",
     "optional": true,
     "type": "number"
    },
    {
     "name": "days",
     "optional": true,
     "type": "number"
    },
    {
     "name": "window",
     "optional": true,
     "type": "{ startMinute: number; endMinute: number }"
    }
   ]
  },
  {
   "name": "RamadanWindow",
   "fields": [
    {
     "name": "startsOn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "endsOn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "appliesTo",
     "optional": false,
     "type": "'all-workers' | 'config-note'"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "reducedDailyMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "reducedWeeklyMinutes",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "JurisdictionRuleset",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "scope",
     "optional": false,
     "type": "'stock' | 'workspace'"
    },
    {
     "name": "jurisdiction",
     "optional": false,
     "type": "JurisdictionCode"
    },
    {
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "rules",
     "optional": false,
     "type": "RuleDef[]"
    },
    {
     "name": "ramadan",
     "optional": true,
     "type": "RamadanWindow"
    },
    {
     "name": "sourceNote",
     "optional": true,
     "type": "string"
    },
    {
     "name": "capturedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "verifyNote",
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
     "name": "labelAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'deprecated'"
    },
    {
     "name": "requiredByRoles",
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
   "name": "UnavailabilityWindow",
   "fields": [
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
     "name": "kind",
     "optional": false,
     "type": "'absence' | 'leave' | 'day-off-preference'"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Worker",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "teamId",
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
     "name": "roleTitle",
     "optional": false,
     "type": "string"
    },
    {
     "name": "qualificationIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "contract",
     "optional": false,
     "type": "{ weeklyMaxMinutes: number; dailyMaxMinutes?: number }"
    },
    {
     "name": "unavailability",
     "optional": false,
     "type": "UnavailabilityWindow[]"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'inactive'"
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
   "name": "Shift",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "weekPlanId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "dayIndex",
     "optional": false,
     "type": "0 | 1 | 2 | 3 | 4 | 5 | 6"
    },
    {
     "name": "roleTitle",
     "optional": false,
     "type": "string"
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
    },
    {
     "name": "breakMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "requiredQualificationIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "headcount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no teams)",
   "\"No teams yet. Create one and pin its ruleset — or open the sample team and watch the inspector name a planted violation.\"",
   "\"لا فرق بعد. أنشئ فريقاً وثبّت مجموعة قواعده — أو افتح فريق العيّنة وشاهد المفتش يسمّي مخالفة مزروعة.\"",
   "Create team / Open sample team",
   "S1 filtered-empty"
  ],
  "loading": [
   "S1 list skeleton",
   "skeleton rows ×8 + \"Loading your teams…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل فرقك…\"",
   "S3 grid boot",
   "navigator + rail + grid + inspector skeletons, inspector width reserved"
  ],
  "error": [
   "Class & trigger (operation)",
   "VALIDATION (importRoster malformed row)",
   "\"Row 7 of the roster paste has no weekly cap — rows 1–6 imported. Fix row 7 and import it alone.\"",
   "\"السطر 7 من اللصق بلا حدّ أسبوعي — استُوردت السطور 1–6. صحّح السطر 7 واستورده وحده.\"",
   "VALIDATION (createTeam / createWorker fields)"
  ],
  "success": [
   "Roster paste done",
   "\"46 workers in — 2 invalid rows named, 1 draft role flagged for review.\"",
   "\"دخل 46 عاملاً — سطران غير صالحين سُمّيا، ودور مسودة واحد معلّم للمراجعة.\"",
   "Shift placed",
   "\"Thursday evening placed — 15:00–23:00, 4 required, 0 assigned.\""
  ]
 },
 "briefLine": "The unique feature is labor-rule guardrails per jurisdiction with swap-aware scheduling, and it is deliberately a rules engine, not an oracle: the product is declared non-AI (ai-native-patterns §1) — the engine is deterministic arithmetic over a configured, versioned JurisdictionRuleset (working-time caps, minimum rest between shifts, maximum consecutive days, overtime thresholds, night-work windows, Ramadan reduced-hours windows). Two stock rulesets ship at v1 — KSA and UAE — captured from public labor-law sources (01: HRSD official text; Federal Decree-Law No. 33 of 2021 guides) with capture dates and a \"verify against current law\" honesty note, plus a fully editable custom ruleset. Every violation names the rule it broke, the measured value, and the required value (\"Rest period: 11h required by KSA v1 — 7h 30m provided between closing Sun 23:00 and opening Mon 06:30\"), because a guardrail that says only \"scheduling conflict\" is a guardrail nobody trusts. Blocking violations refuse publication through a gate that lists its blockers; warnings (overtime thresholds, night-window marks) travel with the plan into the publication record. Waivers exist, are recorded with actor, reason, and timestamp, and are exported — the audit posture the category's compliance tier sells as an enterprise feature, here as the default grammar of the tool."
} as const;
export type Spec = typeof SPEC;
