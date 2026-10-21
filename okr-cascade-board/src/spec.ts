// GENERATED from specs-source/okr-cascade-board/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "okr-cascade-board",
 "title": "Okr Cascade Board",
 "family": "business_ops",
 "tier": 3,
 "flagship": false,
 "adapter": "OkrCascadeAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Waraq Lime",
  "pairing": "P15",
  "radius": "22px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "energetic",
  "fonts": [
   "Mada",
   "Instrument Sans"
  ],
  "primary": "#AE9733",
  "accent": "#695300",
  "canvas": "#2D2917"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Cycles home",
   "purpose": "cycle list with state chips and rollups; first-run sample-cycle offer; onboarding checklist (P22)",
   "shell": "",
   "data": "listCycles, createCycle, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Cascade board (cycle workspace)",
   "purpose": "the core surface: company tier, team lanes, alignment edges, objective cards with rollups and confidence, alignment warnings in place",
   "shell": "",
   "data": "listObjectives, getObjective, getCycle",
   "archetype": "board"
  },
  {
   "id": "S3",
   "name": "Objective detail",
   "purpose": "bilingual pair editor with lint + assist panel; KR list (metric bars, owners); alignment links; check-in history per KR",
   "shell": "",
   "data": "getObjective, createObjective, updateObjective, archiveObjective, createKeyResult, updateKeyResult, removeKeyResult, requestDraft, getDraftProposal, resolveDraftProposal, listMembers",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Check-in desk (participant)",
   "purpose": "my due check-ins this period: metric context, last value, structured form (value, confidence, blockers, help-needed); autosave; corrections",
   "shell": "",
   "data": "listKeyResults, getCheckIn, saveCheckInDraft, submitCheckIn, updateCheckIn",
   "archetype": "wizard-flow"
  },
  {
   "id": "S5",
   "name": "Cadence dashboard",
   "purpose": "KR × period coverage grid; overdue zone; at-risk zone with named triggers; blocker digest; on-behalf provenance marks",
   "shell": "",
   "data": "listCheckIns, getCadence, listKeyResults",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Grading console",
   "purpose": "close gate, grade computation, grade sheet with formulas and thresholds, unreported/archived disclosure, export",
   "shell": "",
   "data": "getCycle, setCycleState, computeCycleGrades, getGradeSheet, exportCycle",
   "archetype": "wizard-flow"
  },
  {
   "id": "S7",
   "name": "Artifacts & jobs console",
   "purpose": "export artifacts with expiry/renewal; assist draft jobs; cancel/retry; link-to-context (T3-consolidated activity+jobs split view)",
   "shell": "",
   "data": "listJobs, getArtifact, listActivity",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Activity log",
   "purpose": "every consequential mutation, filterable by cycle/entity; exportable discipline",
   "shell": "",
   "data": "listActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "cadence (frequency, due day/time, live period-grid preview), capability consents (assist, notification, directory), usage meter, teams & members",
   "shell": "Settings",
   "data": "getCadence, updateCadence, listTeams, listMembers, getSession, getUsage",
   "archetype": "editor-studio"
  },
  {
   "id": "S10",
   "name": "Command palette (overlay)",
   "purpose": "bilingual normalized search across cycles/objectives/members/jobs",
   "shell": "",
   "data": "client-side over S1/S2/S9 data",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — Key results: bilingual statements, metrics, owners, the deterministic lint (the authoring loop)",
   "steps": [
    "The objective detail now shows the KR list with metric bars, owners, and the first-period due date. getObjective · listKeyResults",
    "*Recovery: KR edits are versioned; archived KRs are excluded from rollup and grading but remain in the log and the export appendix (nothing is silently lost)."
   ]
  },
  {
   "title": "CP-6 — Workspace management: cycles home, cadence settings, jobs, activity, usage",
   "steps": [
    "Cycle settings: rename the bilingual cycle name, adjust dates while the cycle is still in draft state. updateCycle · getCycle",
    "Teams and members: the teams rail with leads; the member directory for owner pickers. listTeams · listMembers",
    "Jobs console: assist drafts and exports with state, cancel/retry, link-to-context (async-contract §7). listJobs",
    "Activity log: every consequential mutation, filterable by cycle and entity, exportable discipline at close. listActivity",
    "Usage: the assist-run meter for the window with the 80% warning threshold (P14); deterministic workflows render no meter (unlimited by design). getUsage",
    "*Recovery: all lists cursor-paginated and re-fetchable; session locale switch re-renders without data loss."
   ]
  }
 ],
 "components": [
  {
   "name": "CascadeBoard",
   "purpose": "the core surface: company tier on top, team lanes beneath, alignment edges between objectives; lane headers carry team name (bilingual) and lead",
   "obligations": "Semantics: a nested list (company objectives → children), not a canvas — SR users traverse the tree with disclosure; lane virtualization >60 objective cards (P19) with focus preservation and row-count context on region entry; alignment edges render as described relationships (\"aligned to 2 company objectives\") never as visuals-only lines; arrow navigation P18; edges mirror in RTL (flow toward inline-start)"
  },
  {
   "name": "ObjectiveCard",
   "purpose": "one objective on the board: bilingual title pair (each side own direction, bidi-isolated), level chip (company/team), stretch badge, rollup progress (number + ring), confidence summary, unreported badge, alignment-warning chips in place",
   "obligations": "Progress always number+ring (never color-only); unreported state renders \"—\" with a text badge, never 0%; warning chips icon+text; worst-case Arabic titles truncate at word boundaries (no hyphenation — rtl-rules §4); card focus announces: level, both titles (or the locale-active one + \"available in both\"), rollup %, warning count"
  },
  {
   "name": "BilingualPairEditor",
   "purpose": "EN/AR side-by-side columns with per-side direction, alignment links between corresponding fields, live pair-parity indicators (P23: in-sync / edited-since / length-far-apart)",
   "obligations": "Each column its own writing direction with dir set per column; parity warning is a chip with text (\"AR side runs 60% longer than EN — check the pair\"), never a silent flag; empty side is an honest labeled state (\"AR side not yet authored\"), never ghost-filled; Tab moves between columns predictably; Escape restores per P06; autosave indicator persistent per column"
  },
  {
   "name": "MetricLintPanel",
   "purpose": "the deterministic writing lint: findings list per pair (rule name, the matched token, the guidance), severity chips, acknowledge action",
   "obligations": "Findings are flags-not-blocks (the author decides); every finding names its rule and shows the matched span; rules disclosed in-place with a \"see every rule\" affordance (fixed tables, 07c); findings re-evaluate on debounce (300ms) and close in place when addressed; screen readers receive the findings count on change (polite), full findings on panel open"
  },
  {
   "name": "DraftAssistPanel",
   "purpose": "the conditionally-AI surface: focus-brief input, reserved streaming region, proposal cards (objective variants, KR pairs with pre-filled metrics), accept/edit/dismiss actions, provenance chip",
   "obligations": "Reserved region sized before arrival (CLS ≤0.02, 10); P13 contract: announce start and completion only, never per-token; Stop available from first token; partial output marked partial; every proposal draft-by-default (P15) — accept copies into the editor as an editable draft, never auto-creates; provenance chip (\"drafted by the assist — edited by you\" states) icon+text; quota meter before the run (P14); rung-4 state renders the panel as the plain editor guidance (the button absent, not disabled-mysterious)"
  },
  {
   "name": "CheckInForm",
   "purpose": "the structured check-in: current value input (numeric, with unit suffix), ConfidenceDial, blocker list (add/remove free-text rows with own direction), help-needed toggle, submit",
   "obligations": "Labels persist above fields (never ghost text — a11y-baseline §5); value input carries the metric contract visibly (baseline/target/direction context row); validation on-blur-or-submit, field-linked; submit is idempotent (double-tap safe — 07b key); the 360px layout is the participant path's primary design (02 Tariq); draft state visible and persistent (P10/P11: last submitted value recalled into context, not pre-filled as the answer)"
  },
  {
   "name": "ConfidenceDial",
   "purpose": "anchored 1–5 confidence selector: 1 far off track · 2 slipping · 3 on track · 4 confident · 5 certain",
   "obligations": "Radio-group semantics with visible labels; anchors shown inline on first use and on focus thereafter; selected state icon+text+plum-family mark (never color alone); keyboard ↑/↓ + Space; the dial never auto-suggests a value (confidence is the owner's honest call — 00)"
  },
  {
   "name": "CadenceCoverageGrid",
   "purpose": "the leadership cadence surface: KR rows × period columns; cell states on-time / in-grace / overdue / missing / draft, each text+icon; period headers with dates",
   "obligations": "Table semantics with row/column headers re-announced on navigation (P18); every cell carries its state as text (SR and sighted read the same truth); overdue and at-risk zones are navigable regions with named triggers; Western numerals in dates and period indices; >200 cells virtualize with focus preservation (P19); the grid at 360px collapses to per-KR period strips (cards, 09)"
  },
  {
   "name": "GradeSheetTable",
   "purpose": "the deterministic close artifact: per-objective and per-KR grades, the formula column (visible arithmetic), aspirational threshold marks, unreported/archived disclosure rows",
   "obligations": "Every grade row shows its formula as text (inspectability, 00); aspirational rows carry the 0.70 semantics in place; unreported rows say \"excluded — unreported\" with counts; immutable-snapshot badge; table navigation P18; worst-case Arabic KR statements keep word-boundary truncation"
  },
  {
   "name": "BlockerDigest",
   "purpose": "the blocker list across the cycle's KRs for the leadership read: blocker text, KR, owner, period, status",
   "obligations": "Blocker text renders at its own direction with bidi isolation (dir=\"auto\"); each row links to the KR's check-in history; status (open/acknowledged-by-read) is text+icon; no person-ranking surface exists anywhere in the digest (LOOP-10 — blockers attach to KRs, never to people)"
  }
 ],
 "ops": [
  "getSession",
  "createCycle",
  "listCycles",
  "getCycle",
  "updateCycle",
  "setCycleState",
  "createObjective",
  "listObjectives",
  "getObjective",
  "updateObjective",
  "archiveObjective",
  "createKeyResult",
  "listKeyResults",
  "updateKeyResult",
  "removeKeyResult",
  "saveCheckInDraft",
  "submitCheckIn",
  "getCheckIn",
  "updateCheckIn",
  "listCheckIns",
  "requestDraft",
  "getDraftProposal",
  "resolveDraftProposal",
  "computeCycleGrades",
  "getGradeSheet",
  "exportCycle",
  "getArtifact",
  "listTeams",
  "listMembers",
  "getCadence",
  "updateCadence",
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
     "name": "nameAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "cadence",
     "optional": false,
     "type": "CadenceConfig"
    },
    {
     "name": "assistConsent",
     "optional": false,
     "type": "'granted' | 'not-granted'"
    }
   ]
  },
  {
   "name": "CadenceConfig",
   "fields": [
    {
     "name": "frequency",
     "optional": false,
     "type": "CheckInFrequency"
    },
    {
     "name": "dueDayOfWeek",
     "optional": false,
     "type": "0 | 1 | 2 | 3 | 4 | 5 | 6"
    },
    {
     "name": "dueTime",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Cycle",
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
     "optional": true,
     "type": "string"
    },
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
     "name": "state",
     "optional": false,
     "type": "CycleState"
    },
    {
     "name": "cadenceOverride",
     "optional": true,
     "type": "CadenceConfig"
    },
    {
     "name": "isSample",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "objectiveCounts",
     "optional": false,
     "type": "{ company: number; team: number }"
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
   "name": "CheckInPeriod",
   "fields": [
    {
     "name": "index",
     "optional": false,
     "type": "number"
    },
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
     "name": "dueAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'upcoming' | 'open' | 'in-grace' | 'closed'"
    }
   ]
  },
  {
   "name": "AlignmentLink",
   "fields": [
    {
     "name": "childObjectiveId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "parentObjectiveId",
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
   "name": "Objective",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "cycleId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "level",
     "optional": false,
     "type": "ObjectiveLevel"
    },
    {
     "name": "teamId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "titleEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "titleAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "descriptionEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "descriptionAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "stretch",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "parentIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'draft' | 'committed' | 'archived'"
    },
    {
     "name": "archivedReason",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "MetricBlock",
   "fields": [
    {
     "name": "unit",
     "optional": false,
     "type": "string"
    },
    {
     "name": "baseline",
     "optional": false,
     "type": "number"
    },
    {
     "name": "target",
     "optional": false,
     "type": "number"
    },
    {
     "name": "direction",
     "optional": false,
     "type": "MetricDirection"
    }
   ]
  },
  {
   "name": "KeyResult",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "objectiveId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "statementEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "statementAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "metric",
     "optional": false,
     "type": "MetricBlock"
    },
    {
     "name": "weight",
     "optional": false,
     "type": "number"
    },
    {
     "name": "ownerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'active' | 'archived'"
    },
    {
     "name": "archivedReason",
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
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "Blocker",
   "fields": [
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "raisedInPeriodIndex",
     "optional": false,
     "type": "number"
    },
    {
     "name": "acknowledged",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "CheckIn",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "keyResultId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "periodStart",
     "optional": false,
     "type": "string"
    },
    {
     "name": "periodIndexAtSubmission",
     "optional": false,
     "type": "number"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'draft' | 'submitted'"
    },
    {
     "name": "currentValue",
     "optional": false,
     "type": "number"
    },
    {
     "name": "confidence",
     "optional": false,
     "type": "Confidence"
    },
    {
     "name": "blockers",
     "optional": false,
     "type": "Blocker[]"
    },
    {
     "name": "helpNeeded",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "submittedBy",
     "optional": true,
     "type": "string"
    },
    {
     "name": "submittedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 cycles first-run",
   "\"No cycles yet. Create the quarter's cycle — or open the sample and watch a check-in land on the cascade.\"",
   "\"لا دورات بعد. أنشئ دورة الربع — أو افتح العيّنة وشاهد تحديث تقدم يهبط على التسلسل.\"",
   "Create cycle / Open sample cycle",
   "S1 filtered-empty"
  ],
  "loading": [
   "S1 list skeleton",
   "skeleton rows ×8 + \"Loading your cycles…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل دوراتك…\"",
   "S2 board skeleton",
   "tier/lane skeleton per direction + \"Loading the cascade…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (cycle dates)",
   "\"The cycle can't end before it starts. Fix the end date — the period grid previews as you type.\"",
   "\"لا يمكن أن تنتهي الدورة قبل أن تبدأ. صحّح تاريخ النهاية — تُعاين شبكة الفترات أثناء الكتابة.\"",
   "VALIDATION (anchor weekday)"
  ],
  "success": [
   "Check-in submitted (the Settle)",
   "\"Checkout conversion 2.3 of 3.0 — 22% · objective 30% · cascade 3 of 9 moved.\"",
   "\"تحويل إتمام الشراء 2.3 من 3.0 — 22% · الهدف 30% · تحرّك 3 من 9 في التسلسل.\"",
   "Correction saved",
   "\"Corrected 36 → 35 — revision 2 kept, the trail shows both.\""
  ]
 },
 "briefLine": "The first half of the unique feature is the bilingual objective writing assistant. In a Gulf leadership team the company objective is spoken in the room in two languages — the board meeting runs on English slides while the operating conversation runs in Arabic — and today that duality is resolved by whichever language the person who wrote the spreadsheet favored (01; research digest sources 38–40 document the side-by-side bilingual convention of Gulf business communication). This product makes the bilingual pair a first-class authored structure: every objective title, objective description, and key-result statement exists as an EN side and an AR side, each human-authored, each rendered at its own direction with bidi isolation, never machine-translated by the product itself (an empty side is an honest, visible state — the same parity discipline the portfolio's bilingual products enforce). The writing assistant is conditionally-AI (ai-native-patterns §1): when the drafting capability is bound and consented, it proposes objective and key-result drafts in *both* languages from a short focus brief the author types, lands every proposal through a review gate (accept / edit / dismiss — P15, draft-by-default), and when the capability is unbound, exhausted, or refused the product degrades to the plain bilingual editor — the same pair columns with a deterministic writing lint that is always on: task-shaped key results flagged, soft \"help/support\" verbs flagged, length budgets enforced, pair-length parity warned. The plain editor is the floor, not a stub — a full cycle, from company cascade to graded close, is authorable with the assist off (tested against the Mock Adapter's assist-off configuration)."
} as const;
export type Spec = typeof SPEC;
