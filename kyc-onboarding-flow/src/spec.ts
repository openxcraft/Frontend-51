// GENERATED from specs-source/kyc-onboarding-flow/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "kyc-onboarding-flow",
 "title": "Kyc Onboarding Flow",
 "family": "specialized",
 "tier": 1,
 "flagship": true,
 "adapter": "KycOnboardingAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Madar Navy",
  "pairing": "P07",
  "radius": "8px",
  "elevation": "layered-depth",
  "icon": "line-2",
  "motion": "stately",
  "fonts": [
   "Readex Pro",
   "DM Sans"
  ],
  "primary": "#00375B",
  "accent": "#003859",
  "canvas": "#F3F7FA"
 },
 "screens": [
  {
   "id": "S1",
   "name": "ENTRY",
   "purpose": "Applicant ≥360",
   "shell": "ENTRY",
   "data": "two doors (start/resume), locale pick, resume contract, data-use statement",
   "archetype": "wizard-flow"
  },
  {
   "id": "S2",
   "name": "STEP FLOW",
   "purpose": "Applicant ≥360",
   "shell": "STEP FLOW",
   "data": "one-question-per-screen identity micro-steps; autosave indicator; recall chips; spine",
   "archetype": "wizard-flow"
  },
  {
   "id": "S3",
   "name": "CAPTURE STEP",
   "purpose": "Applicant ≥360 (dark-navy viewport)",
   "shell": "CAPTURE STEP",
   "data": "coached document capture: frame guide, live gate checklist, retake loop, upload alternative",
   "archetype": "wizard-flow"
  },
  {
   "id": "S4",
   "name": "PRESENCE STEP",
   "purpose": "Applicant ≥360",
   "shell": "PRESENCE STEP",
   "data": "policy-optional selfie-class capture with purpose + alternative stated",
   "archetype": "wizard-flow"
  },
  {
   "id": "S5",
   "name": "REVIEW & SUBMIT",
   "purpose": "Applicant ≥360",
   "shell": "REVIEW & SUBMIT",
   "data": "full summary as readable evidence + attestation with preserved focus order",
   "archetype": "review-queue"
  },
  {
   "id": "S6",
   "name": "STATUS",
   "purpose": "Applicant ≥360",
   "shell": "STATUS",
   "data": "live application state; needs-attention rework instructions; outcome + dispute path",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "CONSOLE SIGN-IN",
   "purpose": "Console ≥1024",
   "shell": "",
   "data": "session entry, locale pick, role routing",
   "archetype": "list-console"
  },
  {
   "id": "S8",
   "name": "REVIEW QUEUE",
   "purpose": "Console ≥1024 (reviewer default)",
   "shell": "REVIEW QUEUE",
   "data": "deadline-ranked work order: SLA ribbons, rework badges, warning counts, counters",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "EVIDENCE DOSSIER",
   "purpose": "Console (drawer over S8)",
   "shell": "",
   "data": "four-layer evidence assembly + mismatch flags",
   "archetype": "list-console"
  },
  {
   "id": "S10",
   "name": "DECISION COMPOSER",
   "purpose": "Console (sheet over S9)",
   "shell": "",
   "data": "reason-coded decisions; rework step targeting; consequence naming",
   "archetype": "editor-studio"
  },
  {
   "id": "S11",
   "name": "APPLICANTS",
   "purpose": "Console",
   "shell": "APPLICANTS",
   "data": "directory with history trails; nudge actions; retention/withdrawal admin",
   "archetype": "list-console"
  },
  {
   "id": "S12",
   "name": "TEMPLATES STUDIO",
   "purpose": "Console (admin)",
   "shell": "",
   "data": "bilingual applicant-facing notices; versioning; applicant-view preview",
   "archetype": "editor-studio"
  },
  {
   "id": "S13",
   "name": "PROGRAM",
   "purpose": "Console (admin)",
   "shell": "",
   "data": "flow program: steps, thresholds, session policy, type catalog, reason codes, retention, capability posture",
   "archetype": "settings-admin"
  },
  {
   "id": "S14",
   "name": "TEAM · LEDGER & JOBS · INBOX",
   "purpose": "Console (admin/reviewer per section)",
   "shell": "TEAM · LEDGER & JOBS · INBOX",
   "data": "people management; the dispute chain view; exports; jobs; notification ladder",
   "archetype": "review-queue"
  }
 ],
 "flows": [],
 "components": [
  {
   "name": "ProgressSpine",
   "purpose": "The application's step sequence as a fold-marked rail (applicant shell) and its compact echo in the dossier (console): completed steps carry navy fold-mark chips; the active step is raised; needs-attention steps carry the notice flag; RTL: the rail reads inline-start→inline-end with progress toward inline-end (mirrors, rtl-rules §2)",
   "obligations": "Semantics: an ordered list — step ordinal announced on focus (\"الخطوة 3 من 5 — المستندات\" / \"step 3 of 5 — documents\"); fold states are text+icon (never color alone); the spine is a navigation region with roving tabindex; fold-in announces politely once; the resume cascade announces the summary (\"استؤنف الطلب — خطوتان متبقيتان\" / \"Application resumed — 2 steps remaining\"). Motion: fold-in 320ms emphasized-decelerate with depth settle; resume unfold cascade ≤60ms stagger capped at 5; reduced-motion: all steps render at final state simultaneously, cascade collapses to the summary announcement (13 §B1)"
  },
  {
   "name": "StepCard",
   "purpose": "The one-question-per-screen working surface: label group, fields, validation, the recall chips, the step's save-state indicator (P10)",
   "obligations": "Focus order: field group → save indicator → primary action; validation on-blur-or-submit with field-linked messages (a11y-baseline §5); required is programmatic; recalled values carry the P11 chip with described text; save indicator cycles saving→saved→conflict→offline-queued with polite announcements only on conflict; settle-in 280ms fade, never spin-in"
  },
  {
   "name": "CaptureCoach",
   "purpose": "The coached capture surface inside the dark viewport: frame guide overlay (document-type-shaped), guidance line, gate checklist, capture/retake actions, upload-alternative link",
   "obligations": "Camera-start guidance is CONTRACT COPY announced assertively once: \"امسك المستند مسطحاً، والأركان الأربعة داخل الإطار\" / \"Hold the document flat, all four corners inside the frame\" (a11y-baseline §7); the frame guide is decorative — the checklist is the information; the shutter is always operable (gates advise, submit enforces — CP-3.3); the alternative path (\"no good camera? upload\") is present BEFORE camera start and remains one action away; permission-denied renders the upload path as primary with the choice stated; 400% reflow: the viewport stacks with identical labels; reduced-motion: guide hints change without pointer animation (state text only)"
  },
  {
   "name": "GateChecklist",
   "purpose": "The five deterministic quality gates as a live bilingual checklist: framing, glare, blur, alignment, edge completeness — each row label + pass/fail state + fix instruction when failing",
   "obligations": "States are text+icon (check-circle / alert-triangle + \"مجتازة\" / \"passed\", \"غير مجتازة — وهج\" / \"failed — glare\"); rows announce on state CHANGE politely (never per frame tick — 09 schedule); the ready state (\"جاهز — التقط الآن\") is announced politely once; in the upload path the checklist renders as the post-hoc report with values+thresholds as text; contrast per the capture-surface ladder (text.on-capture 13.51:1, capture.beacon labels 6.43:1)"
  },
  {
   "name": "CaptureEvidenceCard",
   "purpose": "A submitted capture as evidence (applicant summary + dossier layer two): thumbnail, source glyph (camera/upload), side label, the quality report with per-gate values, retake-chain count, timestamp",
   "obligations": "The thumbnail is a labeled figure (document type + side + gate summary in words); zoom is keyboard-operable with Escape restore; the quality report renders as a definition list (gate → value → threshold → verdict); retake chain is a browsable list with the submitted frame marked; on the applicant shell this card IS \"what the reviewer will see\" — the trust symmetry is the component's purpose (CP-4.1)"
  },
  {
   "name": "SessionRibbon",
   "purpose": "The applicant session's persistent state: idle-timeout countdown, extend action, absolute-cap statement, save-and-exit",
   "obligations": "The 2-minute warning is ASSERTIVE (a11y-baseline §7 — contract rule, 07b rule 6) with the extend action focused; countdown ticks are text (tabular numerals) at 1Hz, never announced per tick; extend success announces politely with the new deadline; timeout-ends state offers the resume link with data-safety stated; the ribbon never obscures focused fields (2.4.11 — scroll-margin token obligation)"
  },
  {
   "name": "RecallChip",
   "purpose": "The P11 marking: a compact chip rendered on pre-filled/recalled values (\"مسترجع\" / \"recalled\") with described-by explaining the source",
   "obligations": "The chip is decorative-reinforcing: the RECALLED FACT is in the field's described-by text, not only the visual chip; changing a recalled value keeps a subtle amended mark with the timeline note; never traps focus; ≥24px target"
  },
  {
   "name": "AttestationPanel",
   "purpose": "The agreement + consent surface at submit: full text with preserved focus order, consent control, timestamp capture",
   "obligations": "Focus order traverses the ENTIRE agreement text end-to-end before the consent control (a11y-baseline §7 legal discipline); a structured-alternative mode (sectioned summary with full text expandable) is provided for long agreements; the consent control is a named checkbox with consequence text; attested timestamp announced with the action (\"اعتُمد الإقرار الساعة 21:47\"); the seal glyph renders post-attest; reduced-motion: seal crossfades in place"
  },
  {
   "name": "ReviewQueueRow",
   "purpose": "The console queue's dense row: applicant name, document types, deadline ribbon (SLA class + time remaining), rework-round badge, capture-warning count, assessment-presence glyph, aging",
   "obligations": "Row is a single focusable element with described-by summary (\"طلب مراجعة — مهلة 4 ساعات، جولة إعادة عمل 2، تحذيرات جودة 1\" / \"review task — 4h deadline, rework round 2, 1 quality warning\"); deadline urgency is text+icon+position (notice tone at <2h, critical at breach — never a red pulse); j/k navigation with 2.4.13-strength focus; virtualization above 200 rows preserves focus (P19); settle-in 280ms fade"
  },
  {
   "name": "EvidenceDossier",
   "purpose": "The four-layer evidence assembly over the queue: application summary + step timeline → captures + quality reports → machine assessments with provenance → mismatch flags; decision composer entry",
   "obligations": "One drawer, four tab-regions traversed by keyboard in layer order (02 Maryam's no-tab-hopping requirement); every layer announces its region on entry; assessments render provenance-first (engine label, version, timestamp, \"مدخل للمراجعة — ليس قراراً\" / \"an input for review — not a decision\"); mismatch flags are text+icon with the deterministic rule named; layer occlusion is layered-depth with border.subtle edges (never shadows over text); drawer focus returns to the row on close (a11y-baseline §3)"
  }
 ],
 "ops": [
  "getSession",
  "startApplication",
  "resumeApplication",
  "extendSession",
  "getApplication",
  "saveStepDraft",
  "submitStep",
  "evaluateCaptureFrame",
  "submitCapture",
  "submitApplication",
  "cancelApplication",
  "listReviewTasks",
  "getReviewTask",
  "assignReviewTask",
  "decideReviewTask",
  "requestVerificationAssessment",
  "listApplications",
  "listApplicants",
  "getApplicant",
  "sendResumeLink",
  "getFlowProgram",
  "updateFlowProgram",
  "listMessageTemplates",
  "upsertMessageTemplate",
  "previewMessage",
  "listUsers",
  "inviteUser",
  "updateUser",
  "listNotifications",
  "markNotificationsSeen",
  "listActivity",
  "exportAuditLedger",
  "subscribeApplicationEvents",
  "getJob",
  "retryJob",
  "cancelJob"
 ],
 "entities": [
  {
   "name": "User",
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
     "type": "ConsoleRole"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'suspended'"
    },
    {
     "name": "joinedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Applicant",
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
     "name": "contactRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "displayName",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "firstApplicationAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "totalApplications",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "DocumentTypeSpec",
   "fields": [
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
     "name": "sides",
     "optional": false,
     "type": "('front' | 'back')[]"
    },
    {
     "name": "orientation",
     "optional": false,
     "type": "'landscape' | 'portrait' | 'auto'"
    },
    {
     "name": "expiresCheck",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "GateThresholds",
   "fields": [
    {
     "name": "framingMin",
     "optional": false,
     "type": "number"
    },
    {
     "name": "framingMax",
     "optional": false,
     "type": "number"
    },
    {
     "name": "glareMaxCoverage",
     "optional": false,
     "type": "number"
    },
    {
     "name": "blurMinSharpness",
     "optional": false,
     "type": "number"
    },
    {
     "name": "alignmentMaxDegrees",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "StepSpec",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "StepKind"
    },
    {
     "name": "order",
     "optional": false,
     "type": "number"
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
     "name": "required",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "fieldKeys",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "documentTypes",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "alternativePathLabelAr",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "alternativePathLabelEn",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "FlowProgram",
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
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "programCode",
     "optional": false,
     "type": "string"
    },
    {
     "name": "steps",
     "optional": false,
     "type": "StepSpec[]"
    },
    {
     "name": "documentTypeCatalog",
     "optional": false,
     "type": "DocumentTypeSpec[]"
    },
    {
     "name": "gateThresholds",
     "optional": false,
     "type": "GateThresholds"
    },
    {
     "name": "sessionPolicy",
     "optional": false,
     "type": "SessionPolicy"
    },
    {
     "name": "slaHours",
     "optional": false,
     "type": "Record<SlaClass, number>"
    },
    {
     "name": "reasonCodeCatalogs",
     "optional": false,
     "type": "ReasonCodeCatalog[]"
    },
    {
     "name": "retentionDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "attestationTextAr",
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
     "name": "workspaceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "applicantId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "applicationRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "programId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "programVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "status",
     "optional": false,
     "type": "ApplicationStatus"
    },
    {
     "name": "currentStepId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "reworkRounds",
     "optional": false,
     "type": "number"
    },
    {
     "name": "startedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "lastActivityAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "StepState",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "applicationId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "stepSpecId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "StepStatus"
    },
    {
     "name": "answers",
     "optional": false,
     "type": "Record<string, string>"
    },
    {
     "name": "recalledKeys",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "amendedAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "firstSubmittedAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "lastValidatedAt",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "CaptureMetrics",
   "fields": [
    {
     "name": "documentCoverage",
     "optional": false,
     "type": "number"
    },
    {
     "name": "glareCoverage",
     "optional": false,
     "type": "number"
    },
    {
     "name": "sharpness",
     "optional": false,
     "type": "number"
    },
    {
     "name": "rotationDegrees",
     "optional": false,
     "type": "number"
    },
    {
     "name": "edgesComplete",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "GateResult",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "GateKind"
    },
    {
     "name": "value",
     "optional": false,
     "type": "number | boolean"
    },
    {
     "name": "threshold",
     "optional": false,
     "type": "number | boolean"
    },
    {
     "name": "passed",
     "optional": false,
     "type": "boolean"
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
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 ENTRY — first-run (no resumable application)",
   "Start a new application",
   "S1 ENTRY — no-data-after-activity (application resolved)",
   "\"Your last application reached an outcome. It lives on the status page with its full record — a new application starts fresh.\"",
   "\"بلغ طلبك الأخير نتيجة. يبقى في صفحة الحالة بسجله الكامل — والطلب الجديد يبدأ من جديد.\""
  ],
  "loading": [
   "S1 ENTRY — resume resolution",
   "\"Checking your resume link…\"",
   "\"جارٍ التحقق من رابط الاستئناف…\"",
   "S2 STEP FLOW — step hydration",
   "(skeleton: spine structure + one step card) + \"Restoring your step…\""
  ],
  "error": [
   "Trigger (operation)",
   "Malformed contact identifier (startApplication)",
   "Step validation rule failed (submitStep / saveStepDraft)",
   "\"لا يطابق {field} قاعدته: {rule}. الصيغة المتوقعة معروضة تحت الحقل — صحّحوه وأكملوا؛ وبقية إجاباتكم محفوظة.\"",
   "Capture gate failure — the named-gate error (submitCapture)"
  ],
  "success": [
   "Autosave settles (indicator)",
   "\"Step complete — {title}\"",
   "\"اكتملت الخطوة — {title}\"",
   "Capture accepted",
   "\"Capture accepted — the five gates passed\""
  ]
 },
 "briefLine": "The flagship mechanic is document-capture guidance. The document step is where onboarding funnels die (01 §4.2), and the category's answer is either a black-box SDK or a wall of error messages after a failed upload. Here the capture step is a coached, inspectable instrument: a frame guide with real-time quality feedback — glare, blur, framing, alignment, edge completeness — evaluated by deterministic rule gates whose exact thresholds are published in the spec (07c §2.1) and rendered to the applicant as a live bilingual checklist that ticks as each gate passes. The AI stance is conditionally-AI (declared in 07a/07b/08): exactly one capability — the document-capture quality assist — may be enriched by an abstract model capability when a workspace binds one; when unbound, rate-limited, or failed, the product degrades to the checklist guidance and the rule gates, total and instant, with engine provenance displayed honestly. No other surface reads a model. The product never decides identity: the automated document-verification and face-matching engines are abstract capabilities (08 N1) whose machine assessments arrive as review inputs, never as verdicts — the human reviewer decides, always (LOOP-10)."
} as const;
export type Spec = typeof SPEC;
