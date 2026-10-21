// GENERATED from specs-source/op-ed-desk/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "op-ed-desk",
 "title": "Op Ed Desk",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "OpEdDeskAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Sahafa Newsprint",
  "pairing": "P03",
  "radius": "4px",
  "elevation": "flat-line",
  "icon": "line-1.5",
  "motion": "minimal",
  "fonts": [
   "Noto Naskh Arabic",
   "Newsreader"
  ],
  "primary": "#EDEEF2",
  "accent": "#2B2D36",
  "canvas": "#C33D23"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Triage queue",
   "purpose": "desk home: arrivals, SLA, filters, bulk",
   "shell": "",
   "data": "listSubmissions",
   "archetype": "review-queue"
  },
  {
   "id": "S2",
   "name": "Submission detail",
   "purpose": "full editor view: text, identity, lint sidebar, history, triage",
   "shell": "",
   "data": "getSubmission, getLintReport, updateFinding, updateTriage, getContributor",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Blind workspace",
   "purpose": "reviewer view: anonymized text, findings, recommendation, integrity confirm",
   "shell": "Blind workspace",
   "data": "getAnonymizedView, getLintReport, submitReview, flagAnonymizationLeak",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "Round board",
   "purpose": "rounds in flight, overdue, reassignment, override entry",
   "shell": "",
   "data": "listSubmissions (rounds filter), openReviewRound, reassignReviewer",
   "archetype": "board"
  },
  {
   "id": "S5",
   "name": "Decision composer",
   "purpose": "decision + structured letter + send",
   "shell": "",
   "data": "recordDecision, sendDecision",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Contributor files",
   "purpose": "search + history (editor-only)",
   "shell": "",
   "data": "listContributors, getContributor",
   "archetype": "editor-studio"
  },
  {
   "id": "S7",
   "name": "Activity & jobs",
   "purpose": "P17 log, lint jobs, usage",
   "shell": "",
   "data": "listJobs, getUsage",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "Desk policy",
   "purpose": "word band, rules, cliché list, SLA, anonymization",
   "shell": "",
   "data": "getSession + workspace ops",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "Contributor surface",
   "purpose": "intake form + status check",
   "shell": "",
   "data": "submitDraft, getSubmissionStatus",
   "archetype": "wizard-flow"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — Style-lint pass (the gate every piece passes)",
   "steps": [
    "Trigger from detail or blind workspace: deterministic pass always; full pass (AI categories) when capability active (08 N2). runStyleLint",
    "Lint is a Job per async-contract — category-paced progress, cancellable. listJobs",
    "Report renders in the sidebar: policy / style / integrity groups, span anchors, bidi-safe. getLintReport",
    "Resolve findings: acknowledge / dismiss / fixed; resolutions persist per report; unresolved ride into the decision summary. updateFinding",
    "Full-pass quota metered before/after (P14). getUsage",
    "*Recovery: reports re-runnable; resolutions preserved; deterministic core never depends on the capability (08 map)."
   ]
  },
  {
   "title": "CP-3 — Escalation, reassignment, override",
   "steps": [
    "Round overdue (visible SLA state, never a hidden timer) → reassign with reason (logged). reassignReviewer",
    "Reviewer recuses mid-round → reassign; if recusal implies identity knowledge, view regenerates. reassignReviewer · getAnonymizedView",
    "Split round (1–1) → decision with override flag + REQUIRED rationale (P15: UI shows the split, blocks submit until rationale non-empty). recordDecision",
    "Second round on a revision → new round, fresh anonymized view. openReviewRound · getAnonymizedView",
    "*Edges: reassign to COI match → guard warns; every reassignment/override logs (P17).",
    "*Failures: unknown/inactive reviewer → NOT_FOUND/VALIDATION; override without rationale → VALIDATION.",
    "*Recovery: reassignment retains prior reviewer's partial notes; overrides final but appealable via a new linked submission."
   ]
  },
  {
   "title": "CP-4 — Contributor revision cycle",
   "steps": [
    "(C) Farida checks status → \"طلب تعديل\" + feedback letter (findings digest + notes). getSubmissionStatus",
    "(C) She revises, resubmits with her reference code → linked chain; desk sees direction-aware diff (P16). submitDraft (revisionOf)",
    "Desk triages the revision with prior findings as baseline; round opens on revised text. listSubmissions · getSubmission · runStyleLint · openReviewRound",
    "*Failures: revision of a differently-decided piece → CONFLICT explaining both states.",
    "*Recovery: chain view keeps every version and letter (accountability spine)."
   ]
  },
  {
   "title": "CP-5 — Slush queue management (the daily surface)",
   "steps": [
    "Work the queue with filters (status, language, topic, SLA); shareable URL views (P08, client-side). listSubmissions",
    "Contributor files: search + history (editor-only). listContributors · getContributor",
    "Activity/jobs console: P17 log + lint jobs. listJobs",
    "*Edges: filtered-empty declares itself (P01); >200 rows virtualize (P19); bulk decline on a piece advanced elsewhere → CONFLICT naming the row.",
    "*Failures: NETWORK mid-bulk → per-item states, retry scoped to unsent letters (async-contract §4).",
    "*Recovery: triage is non-destructive — declines archive, holds park, advances open rounds."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "First-run desk: honest queue empty + intake link + sample piece (11 A).",
    "Text-analysis capability down: full-pass affordance disabled with reason; deterministic lint unaffected.",
    "Notification channel down: letters render with copy-to-clipboard manual path, marked unsent."
   ]
  }
 ],
 "components": [
  {
   "name": "TriageQueue",
   "purpose": "S1 ruled-table queue: arrival order, SLA state, language, policy flags, bulk select",
   "obligations": "P18 grid (arrows navigate; physical mapping stable in RTL); P19 virtualization >200 rows with row-count announcement; SLA = text+icon, never color-only; filter state shareable as URL (P08)"
  },
  {
   "name": "AnonymizedReviewPanel",
   "purpose": "S3 blind reading surface: versioned scrubbed text with leak-flag affordance",
   "obligations": "Document-direction rendering in isolating container; leak-flag is span selection with keyboard equivalent (⌘/Ctrl+B marks start/end, 2.5.7); view version announced; identity structurally absent (PERMISSION-backed, not CSS-hidden)"
  },
  {
   "name": "LintSidebar",
   "purpose": "findings grouped policy/style/integrity with span anchors",
   "obligations": "Anchor jump <80ms; severity = icon+text+pattern, never color alone; bidi-safe anchors; acknowledge/dismiss/fixed resolutions with undo window (P03); degraded-mode notice when full pass unavailable"
  },
  {
   "name": "DecisionComposer",
   "purpose": "decision class + structured letter (round digest, findings digest) + send",
   "obligations": "Double-submit prevention (busy state — adopted ui-ux-pro-max guideline); letter preview renders at its own direction with AR-indic numeral toggle; send failure keeps letter + manual copy path; idempotent retry"
  },
  {
   "name": "RoundSummary",
   "purpose": "aggregate + individual reviews + COI-guard record",
   "obligations": "Aggregate labeled as arithmetic; reviews keyboard-navigable; split state renders override entry with REQUIRED rationale (P15 — submit disabled until non-empty)"
  }
 ],
 "ops": [
  "getSession",
  "submitDraft",
  "getSubmissionStatus",
  "listSubmissions",
  "getSubmission",
  "updateTriage",
  "getAnonymizedView",
  "flagAnonymizationLeak",
  "openReviewRound",
  "reassignReviewer",
  "submitReview",
  "recordDecision",
  "sendDecision",
  "runStyleLint",
  "getLintReport",
  "updateFinding",
  "listContributors",
  "getContributor",
  "listJobs",
  "getUsage"
 ],
 "entities": [
  {
   "name": "ContributorProfile",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; displayName: string; contactEmail: string"
    },
    {
     "name": "organizations",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "submissionCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "priorDecisions",
     "optional": false,
     "type": "('accept' | 'revise' | 'reject')[]"
    },
    {
     "name": "firstSeenAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Submission",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; referenceCode: string"
    },
    {
     "name": "contributorId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "revisionOf",
     "optional": true,
     "type": "string"
    },
    {
     "name": "title",
     "optional": false,
     "type": "string; body: string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "'ar' | 'en' | 'mixed'; wordCount: number; topicTags: string[]"
    },
    {
     "name": "disclosures",
     "optional": false,
     "type": "{ affiliations: string[]; conflicts: string[]; exclusivityAttested: boolean }"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'received' | 'triage' | 'in-round' | 'decided'"
    },
    {
     "name": "triage",
     "optional": true,
     "type": "{ action: 'advance' | 'decline' | 'hold'; note?: string; editorId: string; at: string }"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ReviewRound",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; submissionId: string; roundNumber: number"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'open' | 'paused-leak' | 'complete' | 'closed'"
    },
    {
     "name": "reviewers",
     "optional": false,
     "type": "{ reviewerId: string; assignedAt: string; recused?: boolean }[]"
    },
    {
     "name": "reviews",
     "optional": false,
     "type": "{ reviewerId: string; recommendation: 'publish' | 'publish-with-edits' | 'decline'"
    },
    {
     "name": "notes",
     "optional": false,
     "type": "string; integrityConfirmed: boolean; submittedAt: string }[]"
    },
    {
     "name": "slaDueAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "StyleLintFinding",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; reportId: string"
    },
    {
     "name": "ruleCode",
     "optional": false,
     "type": "string"
    },
    {
     "name": "category",
     "optional": false,
     "type": "'policy' | 'style' | 'integrity'"
    },
    {
     "name": "severity",
     "optional": false,
     "type": "'notice' | 'warning' | 'blocker'"
    },
    {
     "name": "spanStart",
     "optional": false,
     "type": "number; spanEnd: number"
    },
    {
     "name": "message",
     "optional": false,
     "type": "string; source: 'deterministic' | 'ai-enhanced'"
    },
    {
     "name": "resolution",
     "optional": true,
     "type": "{ state: 'acknowledged' | 'dismissed' | 'fixed'; by: string; at: string }"
    }
   ]
  },
  {
   "name": "DecisionRecord",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; submissionId: string"
    },
    {
     "name": "decision",
     "optional": false,
     "type": "'accept' | 'revise' | 'reject'"
    },
    {
     "name": "letter",
     "optional": false,
     "type": "{ subject: string; body: string; locale: 'ar' | 'en' }"
    },
    {
     "name": "overrideOfRound",
     "optional": true,
     "type": "{ roundId: string; rationale: string }"
    },
    {
     "name": "editorId",
     "optional": false,
     "type": "string; recordedAt: string"
    },
    {
     "name": "sendState",
     "optional": false,
     "type": "'unsent' | 'sent' | 'send-failed' | 'sent-manually'"
    },
    {
     "name": "sentAt",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "SubmissionSummary",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; referenceCode: string; title: string; locale: 'ar' | 'en' | 'mixed'"
    },
    {
     "name": "wordCount",
     "optional": false,
     "type": "number; status: 'received' | 'triage' | 'in-round' | 'decided'"
    },
    {
     "name": "topicTags",
     "optional": false,
     "type": "string[]; createdAt: string; policyFlags: string[]"
    }
   ]
  },
  {
   "name": "LintReportSummary",
   "fields": [
    {
     "name": "reportId",
     "optional": false,
     "type": "string; submissionId: string; pass: 'deterministic' | 'full'"
    },
    {
     "name": "findings",
     "optional": false,
     "type": "{ policy: number; style: number; integrity: number }"
    },
    {
     "name": "degraded",
     "optional": false,
     "type": "boolean; generatedAt: string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 queue first-run",
   "\"The queue is empty. Share the intake form — the first submission lands here.\"",
   "\"القائمة فارغة. شارك نموذج الاستلام — أول مقال مُرسَل يصل إلى هنا.\"",
   "S1 filtered-empty",
   "\"No submissions match these filters.\""
  ],
  "loading": [
   "S1 queue boot",
   "(skeleton rows ×10) + SR: \"Loading the submissions queue…\"",
   "\"جارٍ تحميل قائمة المقالات المُرسَلة…\"",
   "S3 blind workspace",
   "\"تحضير النسخة المُجهَّلة…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (exclusivity, S9)",
   "\"The exclusivity confirmation is required — the desk only considers unpublished, exclusive submissions.\"",
   "\"تأكيد الحصرية مطلوب — القسم لا ينظر إلا في المقالات غير المنشورة والحصرية.\"",
   "VALIDATION (override rationale, S5)"
  ],
  "success": [
   "Submission received (S9)",
   "\"Received. Your reference code is {code} — keep it; it's the only way to check status.\"",
   "\"تم الاستلام. رمز متابعتك {code} — احتفظ به؛ فهو وسيلتك الوحيدة للاستعلام.\"",
   "Round opened (S4)",
   "\"Round opened — 2 reviewers, blind copies, due in 48 hours.\""
  ]
 },
 "briefLine": "The review model is two-eyed by design. The triage editor sees full identity (conflict-of-interest matching, contributor history); staff reviewers see only an anonymized view — byline, affiliations, self-identifying phrases scrubbed by deterministic rules — so recommendations form around the argument, not the name. A reviewer who spots a residual leak flags it; the view regenerates and the round pauses until clean. This imports the evidence base of anonymized review from scholarly publishing into opinion journalism, where name-recognition bias is a stated concern and no current tool addresses it (01)."
} as const;
export type Spec = typeof SPEC;
