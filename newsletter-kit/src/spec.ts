// GENERATED from specs-source/newsletter-kit/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "newsletter-kit",
 "title": "Newsletter Kit",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "NewsletterKitAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Zaytoun Marigold",
  "pairing": "P10",
  "radius": "14px",
  "elevation": "soft-lift",
  "icon": "line-2",
  "motion": "calm",
  "fonts": [
   "El Messiri",
   "Lora"
  ],
  "primary": "#E58C40",
  "accent": "#A15F27",
  "canvas": "#382B1E"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Issues home",
   "purpose": "issue list, statuses, onboarding checklist (P22)",
   "shell": "",
   "data": "listIssues, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Issue composer",
   "purpose": "bilingual block columns, variant tabs, assist (CP-1/2)",
   "shell": "",
   "data": "getIssue, createIssue, updateIssueContent, duplicateIssue, suggestSubjectVariants, getUsage",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "QA & preview studio",
   "purpose": "checklist panel + direction/width preview (CP-3)",
   "shell": "QA & preview studio",
   "data": "runQaChecklist, listQaResults, updateIssueContent",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Subscribers",
   "purpose": "lists, virtualized table, import review (CP-4)",
   "shell": "Subscribers",
   "data": "listSubscriberLists, createSubscriberList, listSubscribers, importSubscribers, resolveImportRows, updateSubscriber, removeSubscribers",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "Send desk",
   "purpose": "channels, schedule, jobs, export (CP-5)",
   "shell": "",
   "data": "listDeliveryChannels, verifyDeliveryChannel, scheduleSend, listJobs, getJob, cancelJob, retryJob, exportIssue, getArtifact",
   "archetype": "calendar-grid"
  },
  {
   "id": "S6",
   "name": "Settings",
   "purpose": "locale defaults, numeral display, assist quota",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Create or duplicate an issue, compose bilingually",
   "steps": [
    "Composer opens two columns (ar RTL / en LTR, P23) with pairKey alignment links; sync chips per pair: in-sync / edited-since / missing-in-locale.",
    "Autosave per edit (P10: saving → saved → conflict); CONFLICT surfaces both revisions side-by-side for a choice.",
    "Locale variant tabs hold per-locale subject variants + preheader (CP-2); progress ring = block-pair completion.",
    "*Failures: stale revision (CONFLICT, both versions); stale link (NOT_FOUND); seat without edit rights (PERMISSION).",
    "*Recovery: revisions retained; offline queue keeps local text (P20)."
   ]
  },
  {
   "title": "CP-2 — Subject variants per locale (manual editor + assist)",
   "steps": [
    "Mark one variant primary per locale (what sends absent split testing — split testing itself out of scope).",
    "Quota surface (P14); ladder: fewer proposals (rung 2) → none with reset time (rung 4); the manual editor is untouched at every rung.",
    "Assist unavailable entirely: the manual editor shows a calm notice — identical flow, no proposals (degradation map, 08).",
    "*Failures: assist stream drop (partial proposals kept + marked, retry-continues or discard); quota (RATE_LIMIT with reset); empty variant text (VALIDATION).",
    "*Recovery: variant sets autosave and version with the issue."
   ]
  },
  {
   "title": "CP-3 — RTL render QA pass (the gate)",
   "steps": [
    "Checklist panel fills per-check rows: pass/warn/fail with detail and block reference; completion announced politely.",
    "Fix path: each fail/warn links to the offending block/field; edit inline; re-run regenerates (prior runs retained).",
    "*Failures: QA job failure (NETWORK/UNKNOWN, retry); results for deleted issue (NOT_FOUND).",
    "*Recovery: re-runnable indefinitely; the gate consults the latest run."
   ]
  },
  {
   "title": "CP-4 — Subscriber list import & management",
   "steps": [
    "Column mapping: email / display name / locale preference / consent proof (unmapped locale preference → per-row choice later, never a silent default).",
    "Resolution surface: per-row and bulk decisions; \"Apply\" resumes the job.",
    "Consent semantics: every row carries scope + proof + date; a list with unconsented rows cannot be scheduled — VALIDATION naming the count (08).",
    "*Recovery: idempotent per (list, sourceLabel + content hash) — re-running the same file never duplicates rows."
   ]
  },
  {
   "title": "CP-5 — Schedule via delivery channel, monitor, or export manually",
   "steps": [
    "Jobs surface: all kinds, filter by state, cancel/retry scoped, link-to-context per row.",
    "*Recovery: issue stays schedulable after cancelled/failed jobs; sent issues lock content — duplication continues the work."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "First-run: issues home offers the sample bilingual issue with seeded QA fails — fixing two fails is the onboarding (P22).",
    "No channel ever bound: send desk renders permanent manual mode — export is the default surface, not a degraded corner.",
    "Offline: composer queues writes (P20); jobs reconcile to authoritative state (async-contract §5).",
    "Assist degraded: manual alternates editor, unchanged."
   ]
  }
 ],
 "components": [
  {
   "name": "BlockComposer",
   "purpose": "bilingual block columns with pairKey links + sync chips",
   "obligations": "columns reflow stacked ≤ tablet (400% safe); drag-reorder has keyboard equivalent (2.5.7); explicit mirror-order action; bidi isolation on input (dir=auto); blocks are list semantics in reading order"
  },
  {
   "name": "SubjectVariantEditor",
   "purpose": "per-locale variant set: add/edit/delete, primary marker, live budget, mobile-clip preview",
   "obligations": "budgets printed as text (EN 43/70, AR 55/80 — disclosed heuristic); assist proposals land in reserved region with draft styling (P13/P15); delete-primary falls to first variant, announced"
  },
  {
   "name": "QAChecklistPanel",
   "purpose": "10-check rows with pass/warn/fail, detail, block link",
   "obligations": "status never color/icon-only; fails deep-link to block/field; run pinned to revision; \"record why sending anyway\" note attaches to the job"
  },
  {
   "name": "PreviewPane",
   "purpose": "per-locale render at desktop/tablet/320px",
   "obligations": "width toggle is a segmented control (keyboard); explicit RTL/LTR direction toggle (defaults to the selected locale; manual override for mixed-direction inspection — the RTL preview control, 00); long-word probe available; preview and export render one content model (single source); media glyphs unmirrored"
  },
  {
   "name": "ImportReview",
   "purpose": "awaiting-input rows (invalid/duplicate/consent-missing/locale-missing)",
   "obligations": "bulk + per-row resolution; applying resumes the job; skipped rows listed with reasons; consent field carries a persistent label, never ghost text alone"
  },
  {
   "name": "SubscriberTable",
   "purpose": "virtualized rows with locale-preference column + filters",
   "obligations": "P19 virtualization >200 rows with focus preservation; Arabic-normalized search (rtl-rules §4); bulk select + action bar (P07); removal type-to-confirm (P04 L3)"
  },
  {
   "name": "SendProgress",
   "purpose": "send-job per-locale determinate progress + outcome",
   "obligations": "progress labels are written copy with counts; channel-expiry pause surfaces verify-or-cancel; rows link to context"
  }
 ],
 "ops": [
  "getSession",
  "listIssues",
  "getIssue",
  "createIssue",
  "updateIssueContent",
  "duplicateIssue",
  "runQaChecklist",
  "listQaResults",
  "suggestSubjectVariants",
  "listSubscriberLists",
  "createSubscriberList",
  "listSubscribers",
  "updateSubscriber",
  "removeSubscribers",
  "importSubscribers",
  "resolveImportRows",
  "listDeliveryChannels",
  "verifyDeliveryChannel",
  "scheduleSend",
  "getJob",
  "listJobs",
  "cancelJob",
  "retryJob",
  "exportIssue",
  "getArtifact",
  "getUsage"
 ],
 "entities": [
  {
   "name": "Issue",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; workspaceId: string"
    },
    {
     "name": "internalTitle",
     "optional": false,
     "type": "string; issueNumber: number | null"
    },
    {
     "name": "locales",
     "optional": false,
     "type": "Locale[]"
    },
    {
     "name": "status",
     "optional": false,
     "type": "IssueStatus"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number"
    },
    {
     "name": "duplicatedFrom",
     "optional": false,
     "type": "{ issueId: string; fromLocale: Locale; toLocale: Locale } | null"
    },
    {
     "name": "content",
     "optional": false,
     "type": "Record<Locale, LocaleContent>"
    },
    {
     "name": "scheduledSendJobId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "sentAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string; updatedAt: string"
    }
   ]
  },
  {
   "name": "LocaleContent",
   "fields": [
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "subjectVariants",
     "optional": false,
     "type": "SubjectVariant[]"
    },
    {
     "name": "preheader",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "blocks",
     "optional": false,
     "type": "IssueBlock[]"
    }
   ]
  },
  {
   "name": "SubjectVariant",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; locale: Locale"
    },
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "characterCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "primary",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'manual' | 'assist' | 'imported'"
    },
    {
     "name": "assistProposal",
     "optional": true,
     "type": "{ jobId: string; partial: boolean }"
    }
   ]
  },
  {
   "name": "IssueBlock",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; locale: Locale"
    },
    {
     "name": "pairKey",
     "optional": false,
     "type": "string"
    },
    {
     "name": "type",
     "optional": false,
     "type": "'heading' | 'paragraph' | 'quote' | 'linkList' | 'image' | 'divider' | 'cta' | 'signature'"
    },
    {
     "name": "fields",
     "optional": false,
     "type": "Record<string, string>"
    },
    {
     "name": "style",
     "optional": false,
     "type": "{ italic: boolean }"
    }
   ]
  },
  {
   "name": "QACheckResult",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; issueId: string; issueRevision: number; locale: Locale | 'both'"
    },
    {
     "name": "checkId",
     "optional": false,
     "type": "QaCheckId"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'pass' | 'warn' | 'fail' | 'not-applicable'"
    },
    {
     "name": "detail",
     "optional": false,
     "type": "string"
    },
    {
     "name": "blockId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "checkedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "QaRunSummary",
   "fields": [
    {
     "name": "issueId",
     "optional": false,
     "type": "string; issueRevision: number; runJobId: string"
    },
    {
     "name": "fails",
     "optional": false,
     "type": "number; warns: number; passes: number; notApplicable: number"
    },
    {
     "name": "sendGate",
     "optional": false,
     "type": "'blocked' | 'warned' | 'clear'"
    }
   ]
  },
  {
   "name": "SubscriberList",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; workspaceId: string; name: string; description: string | null"
    },
    {
     "name": "localeMix",
     "optional": false,
     "type": "{ ar: number; en: number; unspecified: number }"
    },
    {
     "name": "unconsentedCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "sourceLabels",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string; updatedAt: string"
    }
   ]
  },
  {
   "name": "Subscriber",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; listId: string"
    },
    {
     "name": "email",
     "optional": false,
     "type": "string; displayName: string | null"
    },
    {
     "name": "localePreference",
     "optional": false,
     "type": "Locale | 'unspecified'"
    },
    {
     "name": "consent",
     "optional": false,
     "type": "{ scope: 'broadcast'; proof: string; date: string } | null"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'removed'"
    },
    {
     "name": "sourceImportJobId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "addedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ImportRowIssue",
   "fields": [
    {
     "name": "rowIndex",
     "optional": false,
     "type": "number; kind: 'invalid-email' | 'duplicate' | 'consent-missing' | 'locale-missing'; value: string; }"
    },
    {
     "name": "id",
     "optional": false,
     "type": "string; workspaceId: string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'email-delivery'"
    },
    {
     "name": "label",
     "optional": false,
     "type": "string; hint: string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "ChannelStatus"
    },
    {
     "name": "grantedOperations",
     "optional": false,
     "type": "('issue-send')[]"
    },
    {
     "name": "verifiedAt",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "SendOutcome",
   "fields": [
    {
     "name": "perLocale",
     "optional": false,
     "type": "{ locale: Locale; sent: number; total: number }[]"
    },
    {
     "name": "renderedEditions",
     "optional": false,
     "type": "{ locale: Locale; artifactId: string }[]"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 issues, first-run",
   "\"Your desk is ready. Open the sample issue and clear its two QA fails — that's the whole job in three minutes.\"",
   "\"مكتبك جاهز. افتح العدد النموذجي وأصلح الفحصين الفاشلين فيه — هذه هي المهمة كلها في ثلاث دقائق.\"",
   "Open sample issue / افتح العدد النموذجي",
   "S1 issues, filtered-empty"
  ],
  "loading": [
   "S1 list skeleton",
   "(skeleton rows ×8) + SR: \"Loading your issues…\"",
   "(صفوف هيكلية ×8) + \"جارٍ تحميل أعدادك…\"",
   "S2 composer boot",
   "two-column skeletons + SR: \"Opening «{title}»\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (QA fails block schedule)",
   "\"Scheduling is blocked — the Arabic edition still has 2 fails. Open the checklist to fix them.\"",
   "\"الجدولة محجوبة — ما زالت النسخة العربية فيها فشلان. افتح قائمة الفحص لإصلاحهما.\"",
   "VALIDATION (subject over budget)"
  ],
  "success": [
   "Autosave (P10 cycle)",
   "\"Saving…\" → \"Saved\" (fades)",
   "\"جارٍ الحفظ…\" → \"حُفظ\"",
   "Variant undo (P03)",
   "\"Variant deleted — Undo (7s)\""
  ]
 },
 "briefLine": "The product is deliberately not an email-marketing suite. It is the bilingual desk where an issue gets made and verified before it leaves: the composer (blocks with locale alignment links, subject-variant editor, preview in both directions and at narrow widths), the QA studio (a deterministic 10-check pre-flight checklist, pass/warn/fail per locale), and the subscriber views (lists with locale mixes, consent-tracked imports, per-subscriber locale preference). With no channel bound, the whole loop still works — the issue exports as rendered HTML/text per locale, the list exports as CSV, and the human pastes both into whatever sending arrangement they already have."
} as const;
export type Spec = typeof SPEC;
