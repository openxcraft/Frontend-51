// GENERATED from specs-source/translation-review-hub/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "translation-review-hub",
 "title": "Translation Review Hub",
 "family": "content_tools",
 "tier": 2,
 "flagship": false,
 "adapter": "TranslationReviewHubAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Jisr Teal",
  "pairing": "P17",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "line-2",
  "motion": "crisp",
  "fonts": [
   "Noto Sans Arabic",
   "Manrope"
  ],
  "primary": "#175437",
  "accent": "#003820",
  "canvas": "#0A2B1A"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Review-jobs home",
   "purpose": "jobs list, filters + saved views (P08), onboarding checklist (P22)",
   "shell": "Review-jobs home",
   "data": "listReviewJobs, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Document overview",
   "purpose": "per-document QA report, counts, gate status",
   "shell": "",
   "data": "getDocument, getQaReport, runQaScan",
   "archetype": "list-console"
  },
  {
   "id": "S3",
   "name": "Review workspace",
   "purpose": "side-by-side pair review — navigator + pair view + findings rail (CP-2/3)",
   "shell": "Review workspace",
   "data": "listSegmentPairs, getSegmentPair, updateSegmentTarget, setSegmentDecision, bulkSetSegmentDecisions, listQaFindings, resolveQaFinding",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "Findings console",
   "purpose": "all findings for a document/job, filters by kind/severity/state, bulk resolution",
   "shell": "",
   "data": "listQaFindings, resolveQaFinding, getQaReport",
   "archetype": "jobs-centre"
  },
  {
   "id": "S5",
   "name": "Glossaries",
   "purpose": "glossary list, create, per-glossary entry counts",
   "shell": "",
   "data": "listGlossaries, createGlossary, getGlossary",
   "archetype": "wizard-flow"
  },
  {
   "id": "S6",
   "name": "Glossary editor",
   "purpose": "term-entry authoring/editing, termbase paste-import, normalized search",
   "shell": "",
   "data": "listTermEntries, saveTermEntry, deleteTermEntry, importGlossary",
   "archetype": "editor-studio"
  },
  {
   "id": "S7",
   "name": "Sign-off & export",
   "purpose": "gate state, resolution ledger, sign-off record, package export + artifacts",
   "shell": "",
   "data": "getReviewJob, getQaReport, signOffReviewJob, exportReviewPackage, getArtifact, getUsage",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "Jobs center",
   "purpose": "imports/scans/exports, cancel/retry, link-to-context (async-contract §7)",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "direction/locale defaults (informational — workspace length-policy defaults are read at job creation, 07a), capability consent (kind-not-vendor), usage window",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "wizard-flow"
  }
 ],
 "flows": [
  {
   "title": "CP-3 — Length-fit warnings + resolution (the signature check)",
   "steps": [
    "*Failures: none specific — falls into the shared error mapping (VALIDATION on policy edit sanity, e.g., band min > max).",
    "*Recovery: length policies are versioned on the review job; warnings are recomputed from declared values — re-running never mutates decision history."
   ]
  }
 ],
 "components": [
  {
   "name": "SegmentPairView",
   "purpose": "the side-by-side core: source pane + target pane + shared pair header (segment number, decision state, finding summary)",
   "obligations": "Pane-direction contract is structural: each pane's dir follows its locale, independent of workspace chrome (05); panes reflow to stacked (source above target, each keeping own direction) below 768px and at 400% zoom; one-step surface difference (paper vs raised) survives grayscale; mixed-script content bidi-isolated (rtl-rules §2); keyboard: focus enters source → findings rail → target in reading order, both panes announce pair number (dual-pane sync, 09); long-word truncation breaks at word boundaries only (rtl-rules §4); edit-in-place on target (P06: Escape restores, Tab commits) with live recompute ≤50ms (10)"
  },
  {
   "name": "SegmentNavigator",
   "purpose": "virtualized pair list (P19) with per-row decision + finding state",
   "obligations": ">200 rows virtualize; focus never moves on scroll (focus moves scroll into view); row-count context announced on region entry; row = segment number (Western, physical order stable in both directions) + state chips (unreviewed/approved/rejected/queried) + severity dots (icon+text on row focus, never color-only); ⌘↓/⌘↑ jump next unreviewed-or-flagged; selection follows focus; filters declared as removable chips (P08) with accessible predicate descriptions"
  },
  {
   "name": "TermFlagChip",
   "purpose": "inline terminology-violation marker on the matched target span",
   "obligations": "Renders on the matched text span with severity (critical/advisory), the mandated term, and the term entry's note on open; chip is focusable, resolves via menu (edit target / override with reason / false-positive); clusters with overflow count at >5 per segment (\"+7 more\") — never a wall; arrival/dissolve motion 120/140ms with live-region text equivalents (05 motion); matcher's normalization note disclosed on the chip detail (ai-native-patterns §7.4)"
  },
  {
   "name": "LengthFitMeter",
   "purpose": "per-segment character budget instrument",
   "obligations": "Two-tone bar + \"current/limit\" in Western numerals + ratio; zones: fits (≤100%) / tight (100–110%, advisory) / over (>110%, critical for limit-declared segments); proportional documents render ratio-vs-band instead; updates live during target editing (the number is the budget); meter value is text+bar (never bar-only); sits adjacent to the target pane, inline-end; acknowledges-with-reason from its own menu (03 CP-3.4)"
  },
  {
   "name": "FindingsRail",
   "purpose": "segment-scoped findings list (kinds: term / length / consistency)",
   "obligations": "Groups by kind, then severity; each row links to its anchor (chip in pane, sibling segment via ConsistencySibling link); resolution actions inline; rail is the live-region surface for finding arrival/dissolve; document-wide twin is the Findings console (04 S4) — same rows, no pane anchors, bulk resolution"
  },
  {
   "name": "DecisionBar",
   "purpose": "per-segment decision controls + comment composer",
   "obligations": "Approve (⌘Enter → advances), reject (comment required), query (addressee + question; Sarah's viewer surface renders the read-only pair + query thread); re-decide always available with history kept; buttons disable during submit (double-submit guard — skill row 32); state announced politely"
  },
  {
   "name": "QaScoreboard",
   "purpose": "document/job QA report summary (S2/S7)",
   "obligations": "Counts by kind × severity, decision progress, gate blockers list with jump links; numbers Western tabular figures; renders as a definition table for screen readers (not a heatmap — values always present as text); re-run scan affordance with honest determinate progress"
  },
  {
   "name": "SignOffGate",
   "purpose": "the governance gate + signed seal",
   "obligations": "Live gate state (blockers with links, refusal copy names them — never generic); on success: the T2 signature moment \"The Gate Clears\" (05 — blocker rows collapse staggered ≤60ms/5 rows into the signed chip with actor+timestamp; reduced-motion renders chip + announcement); post-sign-off edits re-open a NEW pending state — the seal (immutability) stays; seal exportable in the package"
  }
 ],
 "ops": [
  "getSession",
  "createReviewJob",
  "listReviewJobs",
  "getReviewJob",
  "updateReviewJob",
  "importDocument",
  "importGlossary",
  "listDocuments",
  "getDocument",
  "listSegmentPairs",
  "getSegmentPair",
  "updateSegmentTarget",
  "setSegmentDecision",
  "bulkSetSegmentDecisions",
  "runQaScan",
  "getQaReport",
  "listQaFindings",
  "resolveQaFinding",
  "listGlossaries",
  "createGlossary",
  "getGlossary",
  "listTermEntries",
  "saveTermEntry",
  "deleteTermEntry",
  "signOffReviewJob",
  "exportReviewPackage",
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
     "name": "lengthPolicyDefaults",
     "optional": false,
     "type": "LengthPolicy"
    }
   ]
  },
  {
   "name": "Glossary",
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
     "name": "sourceLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "targetLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "entryCount",
     "optional": false,
     "type": "number"
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
   "name": "TermEntry",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "glossaryId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sourceTerm",
     "optional": false,
     "type": "string"
    },
    {
     "name": "targetTerms",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "forbiddenTargets",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "mandate",
     "optional": false,
     "type": "'mandated' | 'forbidden'"
    },
    {
     "name": "severity",
     "optional": false,
     "type": "TermSeverity"
    },
    {
     "name": "status",
     "optional": false,
     "type": "TermStatus"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
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
   "name": "ReviewJob",
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
     "name": "sourceLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "targetLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "glossaryId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "lengthPolicy",
     "optional": false,
     "type": "LengthPolicy"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'open' | 'signed' | 'reopened-pending'"
    },
    {
     "name": "signOff",
     "optional": true,
     "type": "SignOffRecord"
    },
    {
     "name": "counts",
     "optional": false,
     "type": "{"
    },
    {
     "name": "documents",
     "optional": false,
     "type": "number"
    },
    {
     "name": "segments",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "SignOffRecord",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reviewJobId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reviewJobVersion",
     "optional": false,
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
     "name": "resolutionLedger",
     "optional": false,
     "type": "{"
    },
    {
     "name": "overrides",
     "optional": false,
     "type": "number"
    },
    {
     "name": "falsePositives",
     "optional": false,
     "type": "number"
    },
    {
     "name": "acknowledgedOverflows",
     "optional": false,
     "type": "number"
    },
    {
     "name": "rejectedSegments",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "DocumentSummary",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reviewJobId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "title",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "DocumentKind"
    },
    {
     "name": "segmentCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "importSource",
     "optional": false,
     "type": "ImportSource"
    },
    {
     "name": "lastScanAt",
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
   "name": "SegmentPair",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "documentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "index",
     "optional": false,
     "type": "number"
    },
    {
     "name": "sourceText",
     "optional": false,
     "type": "string"
    },
    {
     "name": "targetText",
     "optional": false,
     "type": "string"
    },
    {
     "name": "charLimit",
     "optional": true,
     "type": "number"
    },
    {
     "name": "sourceRevision",
     "optional": false,
     "type": "number"
    },
    {
     "name": "targetRevision",
     "optional": false,
     "type": "number"
    },
    {
     "name": "decisionState",
     "optional": false,
     "type": "'unreviewed' | 'approved' | 'rejected' | 'queried'"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "FindingResolution",
   "fields": [
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
    },
    {
     "name": "canonicalSegmentId",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "QaFindingBase",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reviewJobId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "documentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "segmentPairId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'term' | 'length' | 'consistency'"
    },
    {
     "name": "state",
     "optional": false,
     "type": "FindingState"
    },
    {
     "name": "resolution",
     "optional": true,
     "type": "FindingResolution"
    },
    {
     "name": "computedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ReviewDecision",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "segmentPairId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'approve' | 'reject' | 'query'"
    },
    {
     "name": "comment",
     "optional": true,
     "type": "string"
    },
    {
     "name": "query",
     "optional": true,
     "type": "{"
    },
    {
     "name": "addresseeMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "question",
     "optional": false,
     "type": "string"
    },
    {
     "name": "answer",
     "optional": true,
     "type": "string"
    },
    {
     "name": "answeredAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "supersededByDecisionId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 jobs home first-run",
   "\"لا مهام مراجعة بعد. أنشئ واحدة، وأرفق مسرداً، والصق مستندك الأول — أو افتح العيّنة وشاهد البوابة ترفض مخالفة حرجة بلا تفسير.\"",
   "New review job / Open sample job",
   "S1 filtered-empty",
   "\"No review jobs match these filters.\""
  ],
  "loading": [
   "S1 list skeleton",
   "skeleton rows ×8 + \"Loading your review jobs…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل مهام المراجعة…\"",
   "Pair view boot",
   "two-pane skeleton with reserved rail width"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (import bad block)",
   "\"Block 17 is malformed — its source line has no target line. Blocks 1–16 imported; fix block 17 and import it alone.\"",
   "\"الكتلة 17 معطوبة — سطر مصدرها بلا سطر هدف. استُوردت الكتل 1–16؛ صحّح الكتلة 17 واستوردها وحدها.\"",
   "VALIDATION (reject without comment)"
  ],
  "success": [
   "Import done",
   "\"220 segment pairs in — 3 empty targets kept and flagged, 2 duplicates counted, 1 invalid block skipped and named.\"",
   "\"دخل 220 زوج مقاطع — 3 أهداف فارغة حُفظت ووُسمت، وحُسبت تكرارات 2، وتُخطيت كتلة غير صالحة واحدة وسُمّيت.\"",
   "Scan done",
   "\"Scan complete — 6 critical and 4 advisory term violations, 9 length warnings, 2 consistency notes, 1 missing translation.\""
  ]
 },
 "briefLine": "The product's checks are rules, not judgments — declared non-AI (ai-native-patterns §1): terminology enforcement is normalized term matching (Arabic normalization per rtl-rules §4: alef/hamza variants, taa marbuta/heh, yaa/alif maqsura, tashkeel stripping), length-fit is arithmetic on declared limits, and consistency is same-source/different-target and same-target-term/different-source comparison across segment pairs. The same input state always produces the same findings — which is exactly what a review artifact requires (Smartling's own LQA framing: evaluation \"against a defined schema of objective errors\", 01). Reviewers make the human decisions the machinery cannot: approve, reject, or query a segment; edit a target in place and watch the findings recompute; override a critical violation with a recorded reason; and carry the job to sign-off, a gate that refuses to pass while critical violations stand unresolved and unexplained. Every consequential action lands in the activity log (P17), and the deliverable is an export package — bilingual review table, QA report, and the termbase as reviewed — never a silent channel write."
} as const;
export type Spec = typeof SPEC;
