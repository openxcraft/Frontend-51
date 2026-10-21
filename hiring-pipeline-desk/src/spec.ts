// GENERATED from specs-source/hiring-pipeline-desk/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "hiring-pipeline-desk",
 "title": "Hiring Pipeline Desk",
 "family": "business_ops",
 "tier": 2,
 "flagship": false,
 "adapter": "HiringPipelineAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Tawthif Coral",
  "pairing": "P13",
  "radius": "22px",
  "elevation": "soft-lift",
  "icon": "filled-rounded",
  "motion": "energetic",
  "fonts": [
   "Baloo Bhaijaan 2",
   "Plus Jakarta Sans"
  ],
  "primary": "#D65877",
  "accent": "#CA545A",
  "canvas": "#EF6856"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Openings home",
   "purpose": "openings list, filters + saved views (P08), status chips, onboarding checklist (P22)",
   "shell": "",
   "data": "listOpenings, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Pipeline board",
   "purpose": "the core surface — stage columns, bilingual candidate cards, drag + keyboard moves, bulk bar, anonymized-screening render",
   "shell": "",
   "data": "listApplications, getOpening, moveApplication, updateApplication, createApplication",
   "archetype": "board"
  },
  {
   "id": "S3",
   "name": "Application detail",
   "purpose": "timeline (moves, notes), interviews with languages, decisions, rejection reason",
   "shell": "",
   "data": "getApplication, listInterviews, listScorecards, listNudges",
   "archetype": "list-console"
  },
  {
   "id": "S4",
   "name": "Kit studio",
   "purpose": "bilingual competencies + weights, questions per language, coverage meters, assist panel (template bank native)",
   "shell": "",
   "data": "getKit, saveKit, proposeKitQuestions, getUsage",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Interview detail + scorecard",
   "purpose": "the interviewer's surface: questions in the interview's language, the anchored card, nudges",
   "shell": "",
   "data": "getInterview, getScorecard, saveScorecard, submitScorecard, listNudges, resolveNudge, updateInterview",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S6",
   "name": "Debrief console",
   "purpose": "readiness state, sealed/unsealed cards, weighted means, recommendation tally, divergence marks, decision record",
   "shell": "",
   "data": "getDebrief, listScorecards, listNudges, recordDecision",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "Candidates directory",
   "purpose": "cross-opening candidate search (normalized bilingual), name-pair display, edit",
   "shell": "",
   "data": "listCandidates, createCandidate, updateCandidate, importCandidates",
   "archetype": "list-console"
  },
  {
   "id": "S8",
   "name": "Interviews list",
   "purpose": "upcoming/past across openings, language chips, \"mine\" for interviewer seats",
   "shell": "",
   "data": "listInterviews, scheduleInterview",
   "archetype": "list-console"
  },
  {
   "id": "S9",
   "name": "Jobs center",
   "purpose": "imports/exports, cancel/retry, link-to-context (async-contract §7)",
   "shell": "",
   "data": "listAsyncJobs, getArtifact",
   "archetype": "jobs-centre"
  },
  {
   "id": "S10",
   "name": "Activity log + Settings",
   "purpose": "the accountability surface (filterable P17) + stage template, anonymized toggle, consents, usage",
   "shell": "",
   "data": "listActivity, getSession, getUsage, updateOpening (row-menu status from S1)",
   "archetype": "review-queue"
  }
 ],
 "flows": [
  {
   "title": "CP-3 — Schedule → conduct → scorecard (the interviewer's path, with the nudges)",
   "steps": [
    "She rates \"Communication in Arabic\" a 4 and types one line: \"متحدثة رائعة، لبقة، وأجابت بثقة على كل الأسئلة.\" (8 words). Autosave fires. saveScorecard (draft)",
    "*Recovery: drafts autosave; submitted cards are immutable (corrections append — the 07a chain); every submit and nudge resolution logs (P17)."
   ]
  },
  {
   "title": "CP-5 — Export, activity, jobs, settings (the governance path)",
   "steps": [
    "The jobs console lists imports and exports — filterable, cancel/retry, link-to-context (async-contract §7). listAsyncJobs",
    "The interviews list across openings — upcoming and past, mine vs all (role-scoped), with language chips. listInterviews",
    "*Recovery: exports regenerate deterministically; the jobs console reconciles after reconnect (async-contract §5)."
   ]
  }
 ],
 "components": [
  {
   "name": "PipelineBoard",
   "purpose": "the core surface: stage columns × bilingual candidate cards, drag-and-drop + full keyboard path",
   "obligations": "Columns render per workspace direction (RTL board runs right-to-left, value-free stage order mirrored, rtl-rules §2); drag has the Alt+M move menu as its complete equivalent (2.5.7) — a separate accessible interaction model, never drag-only; card moves are optimistic with 6s undo (P03) and adapter-authoritative confirmation; bulk select via row checkbox + Space with the floating action bar naming the count (P07); anonymized-screening render swaps name pair for \"Candidate #N\" in Applied/Screening (07c rule A5 — display discipline, icon eye-off + text, never color-only); column headers sticky and clear focused cards (2.4.11); >200 cards per column virtualizes with focus preservation (P19)"
  },
  {
   "name": "CandidateCard",
   "purpose": "the bilingual unit of the pipeline",
   "obligations": "Name pair renders per-side direction with bidi isolation (Latin LTR inside RTL chrome and vice versa, rtl-rules §2); display name follows workspace locale with the other side on expand; stage-tenure line (\"in Screening 6 days\"), next-interview chip (language chip, date), recommendation tally once cards exist; 24px target floor on all controls (2.5.8); truncation breaks at word boundaries only — worst-case Arabic names budgeted (\"مستشارو التدقيق والحوكمة\" class)"
  },
  {
   "name": "KitComposer",
   "purpose": "bilingual competency + question authoring",
   "obligations": "Competency rows: EN name, AR name (per-side direction inputs), weight stepper (must sum 100 — inline validation naming the drift); question lists per competency × per language with origin badges (human/template/ai-assisted — the machine-proposed origin is visible, never laundered); coverage meter per language: competencies-with-≥1-question / total, text+bar never bar-only; save = P10 autosave states + versioned base (CONFLICT surfaces both); keyboard-complete field traversal; validation on blur (skill row 56) with error summary on save"
  },
  {
   "name": "QuestionAssistPanel",
   "purpose": "the conditionally-AI surface (fenced)",
   "obligations": "Reserved region sized before arrival (CLS budget, 10); proposals render as draft rows with accept/edit/dismiss per question (P15 — nothing writes without a click); streaming disclosure per P13: start/completion announced politely, stop + regenerate always available, stall >8s declared; quota shown before running (P14) and after; template-bank mode is native content, not an error state: rows labeled \"from the template bank — not generated\", deterministically ordered; quota-exhausted → explicit ladder notice + template path inline (ai-native-patterns §5); the panel's icon is a draft-document glyph — no sparkles (05)"
  },
  {
   "name": "InterviewScheduler",
   "purpose": "round + language + interviewer assignment",
   "obligations": "Language selector ('ar'/'en'/'bilingual') drives the kit-coverage pre-check — the meter warns before submit, the adapter gates on it (VALIDATION names the missing competencies); interviewer picker respects the role table (interviewer seats only); double-booking surfaces pre-submit as a typed warning (adapter CONFLICT on submit); mode field is a free label (onsite/phone/video — no provider binding); date fields dual-calendar capable (P24, Gregorian default, Hijri display toggle)"
  },
  {
   "name": "ScorecardForm",
   "purpose": "the interviewer's anchored card",
   "obligations": "One rating control per competency: anchored 1–4 segmented radios (1 \"below the bar\" · 2 \"approaching the bar\" · 3 \"meets the bar\" · 4 \"exceeds the bar\" — anchors render inside the control, never as a legend once-read); evidence textarea per competency (dir=\"auto\", bidi isolation on mixed-script paste); recommendation segmented control (strong-yes/yes/no/strong-no — no neutral midpoint, 12 Q-8); autosave draft states (P10) private to the seat; submit validates completeness (missing rating → VALIDATION naming the competency, error summary focuses first); mobile-first layout (the between-meetings scenario, 04 S5); nudge chips render inline on the affected competency row post-submit"
  },
  {
   "name": "NudgeChip",
   "purpose": "the bias-nudge surface",
   "obligations": "Kinds: evidence-thin / trait-language (card-level) and rating-divergence (debrief-level); always icon + text + color (amber glyph, advisory-deep text — never color alone); carries the rule's own words with the measured value (\"8 words\" — the number is the argument); resolve actions inline: address (re-opens the evidence field, rule re-runs on save) or dismiss-with-reason (recorded); arrival 160ms pop-fade, dissolve 140ms, live-region text equivalents both ways (09); nudges never disable any control — they mark, they do not block (00)"
  },
  {
   "name": "IndependenceSeal",
   "purpose": "the sealed-card stack on the debrief",
   "obligations": "Sealed rows render as name + status (\"Sealed — Dalal has not submitted\") with the teal accent and the eye-off glyph; data-layer enforcement (07b rule 5) — the component only renders what the adapter already filtered; the T2 signature moment \"The Cards Unseal\" (05): ≤60ms stagger capped 5, single 4% overshoot on the tally numerals, full announcement; reduced-motion: simultaneous render + identical summary (motion never carries the information alone); the unseal lift (one soft-lift step) has its announcement equivalent"
  },
  {
   "name": "DebriefSummary",
   "purpose": "the honest arithmetic",
   "obligations": "Weighted competency means (kit weights) with tabular figures; recommendation tally (strong-yes/yes/no/strong-no counts); per-card ratings grid (rows = interviewers, columns = competencies, cell = rating + evidence on open — keyboard-navigable grid per P18); divergence marks (plum, spread \"4 vs 2 — Dalal / Tarek\", jump links to both evidence texts); readiness state pre-all-in (\"1 of 2 scorecards in — means withheld\"); decision control gated on all-in with the refusal naming the missing card"
  },
  {
   "name": "StageReasonDialog",
   "purpose": "terminal moves + rejects (P04 ladder)",
   "obligations": "Level-2 for single reject: names the consequence (\"Rejecting Nouf Al-Rashed — the reason is on the record permanently\"); reason category + free text both required; bulk reject names the count (\"Reject 4 applications — one reason applies to all\"); advance/hold variants (hold requires a review-on date); focus returns to the triggering card on close (a11y-baseline §3); Escape cancels without effect"
  }
 ],
 "ops": [
  "getSession",
  "getUsage",
  "createOpening",
  "listOpenings",
  "getOpening",
  "updateOpening",
  "createCandidate",
  "updateCandidate",
  "listCandidates",
  "importCandidates",
  "createApplication",
  "listApplications",
  "getApplication",
  "moveApplication",
  "updateApplication",
  "getKit",
  "saveKit",
  "proposeKitQuestions",
  "scheduleInterview",
  "listInterviews",
  "getInterview",
  "updateInterview",
  "getScorecard",
  "saveScorecard",
  "submitScorecard",
  "listScorecards",
  "getDebrief",
  "recordDecision",
  "listNudges",
  "resolveNudge",
  "exportOpeningPackage",
  "getArtifact",
  "listAsyncJobs",
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
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "stageTemplateId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "anonymizedScreening",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "assistQuotaWindow",
     "optional": false,
     "type": "{ window: string; assistRuns: number; resetAt: string }"
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
     "name": "displayName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "role",
     "optional": false,
     "type": "MemberRole"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "StageDefinition",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "StageKind"
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
     "name": "order",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "Opening",
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
     "name": "titleEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "titleAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "department",
     "optional": true,
     "type": "string"
    },
    {
     "name": "location",
     "optional": true,
     "type": "string"
    },
    {
     "name": "employmentType",
     "optional": true,
     "type": "'full-time' | 'part-time' | 'contract' | 'internship'"
    },
    {
     "name": "openingsCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "status",
     "optional": false,
     "type": "OpeningStatus"
    },
    {
     "name": "stages",
     "optional": false,
     "type": "StageDefinition[]"
    },
    {
     "name": "kitId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "counts",
     "optional": false,
     "type": "{"
    }
   ]
  },
  {
   "name": "KitQuestion",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "language",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "origin",
     "optional": false,
     "type": "'human' | 'template' | 'ai-assisted'"
    },
    {
     "name": "competencyId",
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
   "name": "Competency",
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
     "name": "weight",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "InterviewKit",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "openingId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "competencies",
     "optional": false,
     "type": "Competency[]"
    },
    {
     "name": "questions",
     "optional": false,
     "type": "KitQuestion[]"
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
   "name": "Candidate",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameLatin",
     "optional": true,
     "type": "string"
    },
    {
     "name": "nameArabic",
     "optional": true,
     "type": "string"
    },
    {
     "name": "email",
     "optional": true,
     "type": "string"
    },
    {
     "name": "phone",
     "optional": true,
     "type": "string"
    },
    {
     "name": "links",
     "optional": true,
     "type": "string[]"
    },
    {
     "name": "note",
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
   "name": "StageHistoryEntry",
   "fields": [
    {
     "name": "fromStageId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "toStageId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reason",
     "optional": true,
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
   "name": "Application",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "openingId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "candidateId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "currentStageId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "source",
     "optional": false,
     "type": "ApplicationSource"
    },
    {
     "name": "stageHistory",
     "optional": false,
     "type": "StageHistoryEntry[]"
    },
    {
     "name": "notes",
     "optional": false,
     "type": "{ id: string; actorMemberId: string; text: string; at: string }[]"
    },
    {
     "name": "currentRound",
     "optional": false,
     "type": "number"
    },
    {
     "name": "baseStage",
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
   "S1 first-run (no openings)",
   "\"No openings yet. Create one with a bilingual title, or open the sample and watch a bias nudge fire on a real scorecard.\"",
   "\"لا وظائف شاغرة بعد. أنشئ واحدة بعنوانٍ ثنائي اللغة، أو افتح النموذج وشاهد تنبيه انحياز يظهر على بطاقة تقييم حقيقية.\"",
   "Create opening / Open the sample",
   "S1 filtered-empty"
  ],
  "loading": [
   "S2 board skeleton",
   "skeleton cards ×8 + \"Loading the board…\" (SR)",
   "بطاقات هيكلية ×8 + \"جارٍ تحميل لوح المسار…\"",
   "S3 application detail boot",
   "timeline skeleton with the interviews block reserved"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (kit competency count)",
   "\"A kit carries 4 to 6 competencies — this one has 3. Add at least one more.\"",
   "\"يحمل الدليل من 4 إلى 6 جدارات — هذا يحمل 3. أضف جدارةً أخرى على الأقل.\"",
   "VALIDATION (weights drift)"
  ],
  "success": [
   "Opening created",
   "\"Opening created — bilingual titles on record. The kit studio is one click away.\"",
   "\"أُنشئت الوظيفة الشاغرة — العنوانان على السجل. استوديو الدليل على بعد نقرة.\"",
   "Kit saved",
   "\"Kit saved — version 3. Scheduled interviews keep the version they were scheduled on.\""
  ]
 },
 "briefLine": "The unique feature is bilingual structured interviews with scorecards and bias nudges, and it is built as three inspectable mechanisms, not oracles. First, bilingual by construction: the kit carries EN and AR question variants for every competency; an interview is scheduled *in a language* ('ar', 'en', or 'bilingual' with side-by-side delivery), and the adapter refuses to schedule an interview whose kit has no questions in that language — the bilingual gap is caught at scheduling, not discovered in the room. Candidate names live as a pair (Latin / Arabic) rendered per-side direction with bidi isolation, so \"Danielle Haddad\" and \"دانيال حداد\" are one record, not two pipelines. Second, scorecards as structured evidence: anchored 1–4 ratings (no neutral midpoint — the scale forces a lean), evidence notes required per competency, recommendation required, and the independence seal — the evaluator-independence principle the structured-interview literature insists on (Bohnet: evaluators should not see peers' judgments before recording their own, 01). Third, bias nudges as deterministic rules (07c, exact formulas): an extreme rating (1 or 4) with thin evidence (fewer than 15 words) is nudged to justify itself; trait adjectives (\"brilliant\", \"ذكي\") without observable behavior are nudged toward evidence; rating divergence across interviewers (spread ≥ 2 on the 1–4 scale) is surfaced in the debrief by name. The nudges mark, they never block, and they never score a candidate — no candidate is ever ranked, auto-screened, or model-predicted anywhere in the product (the Upturn warning: predictions trained on past hiring reproduce its inequities, 01). The AI stance is conditionally-AI (ai-native-patterns §1): exactly one assist exists — interview-question drafting — which proposes kit questions when the capability is bound and consented, lands every proposal through a review-and-confirm gate, and degrades to a seeded, deterministic template bank (competency-class × seniority matrix of vetted bilingual questions) when unbound, rate-limited, or refused. Structured interviewing must survive the absence of the model — the kit, the cards, the nudges, and the debrief run with zero AI."
} as const;
export type Spec = typeof SPEC;
