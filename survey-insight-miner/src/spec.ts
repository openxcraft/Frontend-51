// GENERATED from specs-source/survey-insight-miner/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "survey-insight-miner",
 "title": "Survey Insight Miner",
 "family": "analytics",
 "tier": 2,
 "flagship": false,
 "adapter": "SurveyInsightAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Mashour Lavender",
  "pairing": "P17",
  "radius": "14px",
  "elevation": "soft-lift",
  "icon": "line-2",
  "motion": "calm",
  "fonts": [
   "Noto Sans Arabic",
   "Manrope"
  ],
  "primary": "#A496BF",
  "accent": "#80719E",
  "canvas": "#655384"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Projects home",
   "purpose": "projects list, filters + saved views (P08), onboarding checklist (P22), sample-project offer",
   "shell": "",
   "data": "listProjects, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Project overview",
   "purpose": "questions list with response counts, language mix, tone mix, last-run coverage; metadata-column view",
   "shell": "",
   "data": "getProject, listQuestions, getQuestion",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S3",
   "name": "Theme board",
   "purpose": "the core surface: theme cards (counts, shares, provenance, keywords) + the quote wall",
   "shell": "",
   "data": "listThemes, getCoverageReport",
   "archetype": "board"
  },
  {
   "id": "S4",
   "name": "Theme detail / editor",
   "purpose": "bilingual labels + definition, members, quotes with rationale, confirm gate, merge composer",
   "shell": "",
   "data": "getTheme, saveTheme, confirmTheme, mergeThemes, deleteTheme, setQuotePin",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Response reader",
   "purpose": "virtualized verbatim list with detection chips; reading pane at each response's own direction; filters; assign paths",
   "shell": "",
   "data": "listResponses, getResponse, setResponseLanguageOverride, setResponseTheme, bulkSetResponseTheme",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S6",
   "name": "Coverage & crosstab console",
   "purpose": "assigned/unassigned/overlap with honesty lines; theme × metadata grid; drill to responses",
   "shell": "",
   "data": "getCoverageReport, getCrosstab, listResponses",
   "archetype": "editor-studio"
  },
  {
   "id": "S7",
   "name": "Intake",
   "purpose": "paste format reference, per-row detection preview, import job hand-off",
   "shell": "Intake",
   "data": "importResponses, listJobs",
   "archetype": "wizard-flow"
  },
  {
   "id": "S8",
   "name": "Jobs center",
   "purpose": "import/clustering/export jobs, cancel/retry, link-to-context (async-contract §7)",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Activity log",
   "purpose": "every confirm/rename/merge/assign/pin/override/export with actor + timestamp; filterable; exportable",
   "shell": "",
   "data": "listActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S10",
   "name": "Settings",
   "purpose": "direction default, capability consent (kind-not-vendor), usage window, disclosed engine defaults reference",
   "shell": "",
   "data": "getSession, getUsage, updateProject (projects-home rename path documented in 03 CP-5.5)",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-4 — Coverage & crosstab (the \"so what\" surface)",
   "steps": [
    "Faisal (viewer seat) reads the same surface read-only for his region question — the sliceable report (02 JTBD); no mutation affordances render for his role.",
    "*Failures: crosstab before any run → VALIDATION offering the run (no themes to cross); NETWORK → banner + retry."
   ]
  }
 ],
 "components": [
  {
   "name": "ThemeBoard",
   "purpose": "the core surface: theme cards sorted by member count/share + the coverage strip + the board legend (theme ramp, provenance chips)",
   "obligations": "Grid per styles.csv row 28's space-efficient discipline (adopted) with reading-first card sizes (rejected widget-wall posture, 05 LOOP-9); sort stable (count desc → label → id — deterministic); coverage strip is text-first (\"93 assigned · 41 unassigned · 17 in multiple themes\"); board announces theme count on region entry (P19 row-context analog); filters render as removable chips with accessible predicate descriptions (P08); card focus order = board reading order; ↓/↑ card traversal, Enter opens detail (09)"
  },
  {
   "name": "ThemeCard",
   "purpose": "one theme: bilingual labels, definition excerpt, member count + share, provenance chip, top keywords, preview quote, provisional-vs-confirmed border",
   "obligations": "Bilingual label pair renders as two bidi-isolated spans (Arabic at its direction, Latin at its own — the verbatim-direction contract extended to labels, 05); provenance chip = icon + text (keyword-grouping / model-proposed + confidence band / human-confirmed + actor) — never color alone; provisional state = dashed lavender-line border (4.02:1), confirmed = solid deep border (the \"Ink Sets\" signature crossfades between them, 240ms, reduced-motion = instant + announcement); counts in Western tabular figures; hover = border-step only (calm: no scale); multi-theme membership marks render as the theme-ramp chips with label+count"
  },
  {
   "name": "ResponseReader",
   "purpose": "virtualized verbatim list + reading pane: the unassigned-tail workhorse",
   "obligations": ">200 rows virtualize (P19; skill row 16 conflict resolved to portfolio line, 05); focus never moves on scroll; row = respondent ref + excerpt (bidi-isolated, word-boundary clamp) + detection chips; reading pane renders the full verbatim at its own direction with the detection panel (named markers) and tone lexicon hits highlighted (mark + tooltip, lexicon disclosed); filters: language class, tone, theme membership, metadata values, normalized search (rtl-rules §4 — alef/hamza, taa marbuta/heh, yaa/alif maqsura, tashkeel-stripped; ruleset disclosed in-panel per ai-native-patterns §7.4); bulk-select with Space, range gesture + keyboard equivalent (P07); assign action bar anchors viewport-bottom-inline and names the count"
  },
  {
   "name": "DetectionChipSet",
   "purpose": "per-response/per-row disclosure: language class (MSA / dialect-leaning / mixed-script), tone (positive/negative/neutral/mixed), provenance",
   "obligations": "Icon + text on every chip (globe/flag/message-circle + label — never color alone); dialect chip carries its named markers in the detail (the rule's evidence, 07c rule 2); tone chips use the Rida/Ta'dib/Hadir palette at text-safe contrast (05); mixed-tone renders \"mixed\" with both lexicon-hit counts; human override renders an editor glyph + the overrider's name; chips are focusable with describedby detail"
  },
  {
   "name": "EngineDisclosurePanel",
   "purpose": "the inspectability surface: normalization pipeline, stopword list, thresholds, quote-selection formula, provenance legend",
   "obligations": "One click from the board (eye glyph + text \"How this was computed\"); renders the EXACT rules of 07c as reference copy (deterministic floor disclosed, ai-native-patterns §7.4); read-only; keyboard-navigable as a document region; disclosure state persists per session (P11); the panel is the anti-black-box contract made visible — a research deliverable's methods section, in-product"
  },
  {
   "name": "ConfirmGate",
   "purpose": "the P15 trust checkpoint for model-proposed themes: members in/out, label, quotes, confidence band, explicit confirm/reject",
   "obligations": "Diff-style preview (DiffView reused): members the gate includes vs excludes at the evidence floor, side-by-side label draft, quote re-selection preview; confirm requires focus on the Confirm control itself (never a dialog default, 09); gate re-evaluates membership live at open (03 CP-3 edge); on confirm → \"The Ink Sets\" on the card (the single T2 signature, 05); rejection records a reason prompt (optional text) and is final for that proposal id (re-run regenerates)"
  },
  {
   "name": "MergeComposer",
   "purpose": "theme merge with counts named and quote re-selection preview",
   "obligations": "P04 level-2: names both member counts (\"31 + 22 responses\") and the surviving label (bilingual, editable inline); shows the union's quote re-selection by rule BEFORE commit (07c rule 6 re-runs over the union); pinned quotes from both sides survive marked; merge records inputs in the audit chain (07a); escape cancels, focus returns to the trigger"
  },
  {
   "name": "CrosstabGrid",
   "purpose": "theme × metadata column counts with share-within-column",
   "obligations": "Cells = count + share text with theme-ramp tint (never color alone; every cell's number is the data, the tint is redundancy — 09); \"unspecified\" bucket for blank metadata; >20 distinct values collapse to top-19 + \"other\" (stated in-surface); row/column totals; cell drill-through to the filtered response reader (evidence one click from every claim, 03 CP-4.4); grid is keyboard-navigable (P18) with cell focus announcements (\"Shipping theme × Riyadh: 31 responses, 41% of column\"); overlap footnote in-surface (\"responses in multiple themes count in each — shares may sum past 100%\")"
  },
  {
   "name": "CoverageMeter",
   "purpose": "assigned / unassigned / overlap honesty instrument",
   "obligations": "Text-first strip + segmented bar (bar is redundancy): \"93 assigned (74%) · 41 unassigned (26%) · 17 responses in multiple themes\"; the two honesty lines render in writing beneath (00 posture); updates ≤120ms after every curation act (derived read, 10); never a percentage-only bar (async-contract §3 analog for derived reads)"
  },
  {
   "name": "IntakePreview",
   "purpose": "paste-parse preview with per-row detection before commit",
   "obligations": "Progressive parse (P09): rows render as typed with live per-row language-class chips (detection runs on preview — the researcher sees the mix before importing); malformed rows flagged inline with row numbers (VALIDATION at commit names the first bad row, prior rows retained); format reference stays visible beside the field (04 S7 rationale); preview is cancellable; idempotency key derived from content hash + paste timestamp (07c)"
  }
 ],
 "ops": [
  "getSession",
  "createProject",
  "listProjects",
  "getProject",
  "updateProject",
  "importResponses",
  "listQuestions",
  "getQuestion",
  "listResponses",
  "getResponse",
  "setResponseLanguageOverride",
  "runClustering",
  "listThemes",
  "getTheme",
  "saveTheme",
  "confirmTheme",
  "getConfirmGate",
  "getMergePreview",
  "mergeThemes",
  "deleteTheme",
  "setResponseTheme",
  "bulkSetResponseTheme",
  "setQuotePin",
  "getCoverageReport",
  "getCrosstab",
  "exportAnalysis",
  "getArtifact",
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
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    }
   ]
  },
  {
   "name": "MetadataColumn",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "key",
     "optional": false,
     "type": "string"
    },
    {
     "name": "label",
     "optional": false,
     "type": "BilingualLabel"
    },
    {
     "name": "type",
     "optional": false,
     "type": "MetadataColumnType"
    },
    {
     "name": "distinctValueLimit",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "Project",
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
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "metadataColumns",
     "optional": false,
     "type": "MetadataColumn[]"
    },
    {
     "name": "sample",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "archived",
     "optional": false,
     "type": "boolean"
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
   "name": "LanguageDetection",
   "fields": [
    {
     "name": "langClass",
     "optional": false,
     "type": "LanguageClass"
    },
    {
     "name": "markers",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "ruleVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "override",
     "optional": true,
     "type": "{"
    },
    {
     "name": "langClass",
     "optional": false,
     "type": "LanguageClass"
    },
    {
     "name": "reason",
     "optional": true,
     "type": "string"
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
    }
   ]
  },
  {
   "name": "ToneSignal",
   "fields": [
    {
     "name": "tone",
     "optional": false,
     "type": "ToneClass"
    },
    {
     "name": "lexiconHits",
     "optional": false,
     "type": "{ positive: string[]; negative: string[] }"
    },
    {
     "name": "heuristic",
     "optional": false,
     "type": "true"
    },
    {
     "name": "ruleVersion",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "Question",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "projectId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "prompt",
     "optional": false,
     "type": "BilingualLabel"
    },
    {
     "name": "responseCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "languageMix",
     "optional": false,
     "type": "Record<LanguageClass, number>"
    },
    {
     "name": "toneMix",
     "optional": false,
     "type": "Record<ToneClass, number>"
    },
    {
     "name": "lastRunId",
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
   "name": "Theme",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "questionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "label",
     "optional": false,
     "type": "BilingualLabel"
    },
    {
     "name": "definition",
     "optional": true,
     "type": "BilingualLabel"
    },
    {
     "name": "keywords",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "provenance",
     "optional": false,
     "type": "ThemeProvenance"
    },
    {
     "name": "state",
     "optional": false,
     "type": "ThemeState"
    },
    {
     "name": "confidenceBand",
     "optional": true,
     "type": "'high' | 'medium' | 'low'"
    },
    {
     "name": "memberCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "shareOfAssigned",
     "optional": false,
     "type": "number"
    },
    {
     "name": "mergedIntoThemeId",
     "optional": true,
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
   "name": "ThemeMembership",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "themeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "responseId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "assignedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ThemeQuote",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "themeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "responseId",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "CrosstabCell",
   "fields": [
    {
     "name": "themeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "columnKey",
     "optional": false,
     "type": "string"
    },
    {
     "name": "columnValue",
     "optional": false,
     "type": "string"
    },
    {
     "name": "count",
     "optional": false,
     "type": "number"
    },
    {
     "name": "shareWithinColumn",
     "optional": false,
     "type": "number"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 projects home first-run",
   "\"No projects yet. Paste a response block from your last survey — or open the sample and watch a proposal pass the confirm gate.\"",
   "\"لا مشاريع بعد. الصق كتلة استجابات من استبيانك الأخير — أو افتح العيّنة وشاهد مقترحاً يعبر بوابة الاعتماد.\"",
   "New project / Open sample project",
   "S1 filtered-empty"
  ],
  "loading": [
   "S1 list skeleton",
   "skeleton rows ×8 + \"Loading your projects…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل مشاريعك…\"",
   "Board boot",
   "card-grid skeleton with reserved quote-wall rows"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (import bad row)",
   "\"Row 17 is malformed — it needs at least a respondent ref and a response. Rows 1–16 imported; fix row 17 and import it alone.\"",
   "\"السطر 17 معطوب — يحتاج مرجع مجيب واستجابة على الأقل. استُوردت السطور 1–16؛ صحّح السطر 17 واستورده وحده.\"",
   "VALIDATION (theme label collision)"
  ],
  "success": [
   "Import done",
   "\"300 responses in — 20 empty texts kept and counted, 1 invalid row skipped and named.\"",
   "\"دخلت 300 استجابة — 20 نصاً فارغاً حُفظت وعُدّت، وسطر غير صالح واحد تُخطي وسُمّي.\"",
   "Detection done (import)",
   "\"Language mix: 214 فصحى, 47 dialect-leaning, 19 mixed-script, 20 empty — every class names its markers.\""
  ]
 },
 "briefLine": "An analysis workspace for survey open-ends, built for research teams whose fieldwork is already done. Every survey in the world ends the same way: a column of numbers the team can tabulate in minutes, and a wall of open-ended answers nobody has time to read. Practitioner sources put manual coding at 2–5 minutes per response [01 q13] — 500 responses is a week of analyst time; one large study is \"150+ hours\" [01 q13] to \"200–300 hours\" [01 q13]; whole vendors exist to sell the acceleration (Displayr, Caplena, Veridata-class, 01). This product is the analysis-side instrument for that wall, and it deliberately starts *after* collection: responses arrive by paste or file upload from whatever survey tool the team already ran (LOOP-10 — no distribution, no panel management), as rows of verbatim text with optional metadata columns (city, channel, plan, satisfaction score — the segments the team already thinks in)."
} as const;
export type Spec = typeof SPEC;
