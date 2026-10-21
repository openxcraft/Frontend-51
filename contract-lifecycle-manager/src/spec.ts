// GENERATED from specs-source/contract-lifecycle-manager/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "contract-lifecycle-manager",
 "title": "Contract Lifecycle Manager",
 "family": "business_ops",
 "tier": 3,
 "flagship": false,
 "adapter": "ContractLifecycleAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Ahd Slate",
  "pairing": "P01",
  "radius": "8px",
  "elevation": "layered-depth",
  "icon": "line-1.5",
  "motion": "stately",
  "fonts": [
   "IBM Plex Sans Arabic",
   "IBM Plex Sans"
  ],
  "primary": "#23436C",
  "accent": "#132E50",
  "canvas": "#1B222B"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Vault home",
   "purpose": "register grid (virtualized), renewal/obligation digest banner, onboarding checklist (P22), saved views",
   "shell": "",
   "data": "listContracts, getSession",
   "archetype": "editor-studio"
  },
  {
   "id": "S2",
   "name": "Contract detail",
   "purpose": "bilingual metadata panel, document versions, obligation ledger, review track, renewal window bar, activity thread",
   "shell": "Contract detail",
   "data": "getContract, listObligations, listActivity, getDocumentArtifact",
   "archetype": "review-queue"
  },
  {
   "id": "S3",
   "name": "Intake wizard",
   "purpose": "counterparty → metadata → upload → optional extraction → review suggestions",
   "shell": "Intake wizard",
   "data": "listCounterparties, createCounterparty, createContract, uploadDocument, runExtraction, listSuggestions, resolveSuggestion, listReminders",
   "archetype": "wizard-flow"
  },
  {
   "id": "S4",
   "name": "Obligations & reminders console",
   "purpose": "derived schedule by zone, complete/acknowledge, owner filters",
   "shell": "",
   "data": "listObligations, listReminders, completeObligation, updateObligation, getWorkspace",
   "archetype": "calendar-grid"
  },
  {
   "id": "S5",
   "name": "Extraction review panel (mode of S3/S2)",
   "purpose": "suggestion list with accept/edit/dismiss, confidence, document anchors",
   "shell": "Extraction review panel (mode of S3/S2)",
   "data": "listSuggestions, resolveSuggestion",
   "archetype": "review-queue"
  },
  {
   "id": "S6",
   "name": "Counterparties directory",
   "purpose": "bilingual names, identifiers, contract counts",
   "shell": "",
   "data": "listCounterparties, createCounterparty, updateCounterparty",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "Activity log",
   "purpose": "append-only audit surface, filters, keyboard-navigable, exportable",
   "shell": "",
   "data": "listActivity, exportRegister",
   "archetype": "board"
  },
  {
   "id": "S8",
   "name": "Jobs console",
   "purpose": "extraction/export jobs, cancel/retry, link-to-context",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "workspace defaults (lead times), locale, consent state (kind-not-vendor), usage meter",
   "shell": "",
   "data": "getWorkspace, updateWorkspace, getSession, getUsage",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — Obligation capture → derived reminders → completion (the daily loop)",
   "steps": [
    "Nadia edits an obligation's dates or owner (ownership handover when a department changes). Stale baseRevision → CONFLICT with both payloads. updateObligation",
    "Workspace defaults adjusted once, globally: first lead 30 → 45 days for certificate kinds, etc. updateWorkspace",
    "*Recovery: completions are append-only events; edits are versioned; the schedule always recomputes from current state."
   ]
  },
  {
   "title": "CP-3 — Renewal window defense → renewal or termination (the money path)",
   "steps": [
    "Every step appends to the activity log with actor and timestamp — the auditor's thread for this contract. listActivity",
    "Nadia exports the obligations schedule for the quarter as the follow-up artifact. exportRegister · getExportArtifact",
    "*Failures: VALIDATION (new termination date before current effective date); CONFLICT (concurrent edit on the contract record); RATE_LIMIT (export quota)."
   ]
  },
  {
   "title": "CP-4 — Review workflow → execution record → activation",
   "steps": [
    "A draft contract record (created via CP-1 on a request) is submitted for legal review with an assignee and a note. requestReview",
    "The assignee records a decision: approve (proceed to execution) or return (with comments — status back to draft). recordReviewDecision"
   ]
  },
  {
   "title": "CP-5 — Register reading, audit, and administration (the accountability surface)",
   "steps": [
    "Usage meter visible before/after assist runs (P14). getUsage",
    "*Failures: NETWORK (banner + queued writes, P20); RATE_LIMIT (export/assist metering); UNKNOWN (typed retry with correlationId).",
    "*Recovery: all list surfaces cursor-paginated and re-fetchable; jobs reconcile to authoritative state on reconnect."
   ]
  }
 ],
 "components": [
  {
   "name": "VaultRegister",
   "purpose": "the virtualized register grid: bilingual title cell (per-side direction rendering inside the cell), counterparty, status seal, zone chips, owner, value",
   "obligations": "P18 grid (arrow navigation, range selection); virtualized >200 rows (P19) with focus preservation + row-count context on region entry; mixed-script cells bidi-isolated (dir=\"auto\"); Western numerals, tabular figures; 400% reflow → card collapse at 360px; row menu has visible button equivalents"
  },
  {
   "name": "StatusSeal",
   "purpose": "the lifecycle state seal (draft / in-review / awaiting-execution / active / terminated / archived + derived expiring-soon/expired marks)",
   "obligations": "State is icon+text (never color alone); derived states render as a corner ribbon on the seal, not a second seal (one state per record — display-only derivation, never stored); the Seal Settles moment (05) fires only on execution-record success; reduced-motion = instant + chip + announcement"
  },
  {
   "name": "BilingualMetadataPanel",
   "purpose": "paired EN/AR fields (title, counterparty legal name, obligation summary): per-field direction rendering, either-side-alone validity, sync indicator (both-authored / en-only / ar-only)",
   "obligations": "Each field is a labeled pair with its own direction container (rtl-rules §2 isolation); sync state is text (\"Arabic title not yet recorded\"), never a bare glyph; inline edit (P06 — Esc restores, Tab commits+advances); the panel is the detail surface's spine — screen-reader order reads EN field then AR field with language announced"
  },
  {
   "name": "ObligationLedger",
   "purpose": "obligations table: direction glyph (we-owe/they-owe), plain bilingual summary, kind, owner, due date, zone chip, provenance chip (manual/assist/import)",
   "obligations": "P18 grid semantics; direction is arrow+label (flips in RTL); zone chips icon+text; provenance chip states the origin honestly (assist-suggested → human-accepted history travels with the row); complete action is a visible button on the row (not menu-only); overdue rows announce politely on region entry with count"
  },
  {
   "name": "ReminderTimeline",
   "purpose": "the derived schedule: upcoming reminder entries grouped by zone (overdue / imminent / approaching / later), each linked to its obligation + contract",
   "obligations": "Entries are focusable list items; each states what fires when (\"Reminder 30 days before 12 Dec\"); the timeline is a list semantically; recomputation is instant + announced once (\"Schedule updated — 1 overdue, 2 imminent\"); never a heat blob — counts as text everywhere"
  },
  {
   "name": "RenewalWindowBar",
   "purpose": "per-contract renewal arithmetic: termination date, notice window days, computed notice deadline, days remaining (deterministic formulas, 07c)",
   "obligations": "Every number is text with its label; the bar's states (window-open / window-missed / expiry-mode when auto-renew off) pair text + icon; missed-window copy states the consequence plainly without blame ([23][24] posture); day-count changes always pair a text delta (motion never carries information alone)"
  },
  {
   "name": "ExtractionReviewPanel",
   "purpose": "assist suggestions: proposed metadata fields + obligations, each with confidence, document anchor, accept/edit-then-accept/dismiss",
   "obligations": "Draft-by-default (P15): nothing applies without per-item resolution; anchors link into the document view (context-preserving side panel per ai-native-patterns §3); confidence renders as a labeled figure, never a bare meter; dismissed suggestions stay visible in a collapsed \"dismissed\" group (audit honesty); the panel works identically as wizard step (S3) and detail mode (S2)"
  },
  {
   "name": "DocumentVersions",
   "purpose": "uploaded document versions: file name, language marks (ar/en/bilingual), pages, uploaded-by, uploaded-at, download",
   "obligations": "Version list is a semantic table; download opens the artifact link with expiry announced; replacing a post-review version surfaces the re-review warning chip (CP-4 edge) as text+icon; language marks are text labels (bilingual docs mark both scripts)"
  },
  {
   "name": "ReviewTrack",
   "purpose": "workflow steps: requested → assigned → decision (approve/return) entries in order",
   "obligations": "Ordered list semantics; each entry names actor + decision + timestamp (announced with the action per a11y-baseline §7); return-for-changes carries its comment visibly; the track is append-only — no entry ever edits another"
  },
  {
   "name": "AuditTrail",
   "purpose": "activity log surface: filterable (actor, action class, target, date range), keyboard-navigable, exportable",
   "obligations": "P17 accountability surface; every row is actor-action-target-timestamp (copy-voice §1.3 grammar); correction events reference the erroneous entry visibly; the export action sits on the surface itself (not only in settings — credential-contract §3 pattern applied to audit exports); >200 entries virtualize (P19)"
  }
 ],
 "ops": [
  "getSession",
  "getWorkspace",
  "updateWorkspace",
  "listContracts",
  "getContract",
  "createContract",
  "updateContract",
  "uploadDocument",
  "getDocumentArtifact",
  "requestReview",
  "recordReviewDecision",
  "recordExecution",
  "recordRenewalTerm",
  "markTerminated",
  "archiveContract",
  "listCounterparties",
  "createCounterparty",
  "updateCounterparty",
  "listObligations",
  "getObligation",
  "createObligation",
  "updateObligation",
  "completeObligation",
  "runExtraction",
  "listSuggestions",
  "resolveSuggestion",
  "listReminders",
  "listActivity",
  "exportRegister",
  "getExportArtifact",
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
     "name": "reminderDefaults",
     "optional": false,
     "type": "{"
    },
    {
     "name": "firstLeadDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "finalLeadDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "noticeWindowDefaultDays",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "Counterparty",
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
     "name": "legalNameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "legalNameAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'company' | 'individual' | 'government'"
    },
    {
     "name": "registryId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "registryIdSource",
     "optional": false,
     "type": "'manual' | 'party-registry-capability'"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "activeContractCount",
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
   "name": "TermRecord",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "effectiveDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "terminationDate",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "provenance",
     "optional": false,
     "type": "'intake' | 'renewal' | 'correction'"
    },
    {
     "name": "correctionOf",
     "optional": true,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "recordedByMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "recordedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ContractRecord",
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
     "name": "counterpartyId",
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
     "optional": true,
     "type": "string"
    },
    {
     "name": "contractType",
     "optional": false,
     "type": "ContractType"
    },
    {
     "name": "tags",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "ownerMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "valueAmount",
     "optional": true,
     "type": "number"
    },
    {
     "name": "currency",
     "optional": true,
     "type": "string"
    },
    {
     "name": "language",
     "optional": false,
     "type": "ContractLanguage"
    },
    {
     "name": "autoRenew",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "ExecutionRecord",
   "fields": [
    {
     "name": "executedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "channel",
     "optional": false,
     "type": "'manual' | 'execution-channel'"
    },
    {
     "name": "recordedByMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "documentId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "recordedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ContractDocument",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "contractId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "fileName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "language",
     "optional": false,
     "type": "ContractLanguage"
    },
    {
     "name": "pageCount",
     "optional": true,
     "type": "number"
    },
    {
     "name": "bytes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "uploadedByMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "uploadedAt",
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
   "name": "ReviewStep",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "contractId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "requestedByMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "requestedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'pending' | 'approved' | 'returned'"
    },
    {
     "name": "assigneeMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "decisionComment",
     "optional": true,
     "type": "string"
    },
    {
     "name": "decidedAt",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Obligation",
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
     "name": "contractId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "direction",
     "optional": false,
     "type": "ObligationDirection"
    },
    {
     "name": "summaryEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "summaryAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "ObligationKind"
    },
    {
     "name": "ownerMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "recurrence",
     "optional": false,
     "type": "{ kind: 'one-time'; dueDate: string }"
    },
    {
     "name": "leadOverride",
     "optional": true,
     "type": "{ firstLeadDays?: number; finalLeadDays?: number }"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'open' | 'acknowledged' | 'completed' | 'closed-by-termination'"
    },
    {
     "name": "provenance",
     "optional": false,
     "type": "'manual' | 'assist' | 'import'"
    }
   ]
  },
  {
   "name": "ObligationCompletion",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "obligationId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "completedByMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "completedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "evidenceNote",
     "optional": true,
     "type": "string"
    },
    {
     "name": "documentRef",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "ReminderEntry",
   "fields": [
    {
     "name": "obligationId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "contractId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'first-lead' | 'final-lead' | 'due' | 'overdue-daily' | 'notice-deadline'"
    },
    {
     "name": "fireDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "zone",
     "optional": false,
     "type": "UrgencyZone"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 vault first-run",
   "\"The vault starts with one contract. Register the twenty that matter most — or open the sample and watch the reminders compute.\"",
   "\"يبدأ السجل بعقدٍ واحد. سجّل العشرين الأهم — أو افتح العيّنة وشاهد التذكيرات تُحسب.\"",
   "New contract / Open sample",
   "S1 filtered-empty"
  ],
  "loading": [
   "S1 register skeleton",
   "skeleton rows ×8 + \"Loading your register…\" (SR)",
   "صفوف هيكلية ×8 + \"جارٍ تحميل سجلك…\"",
   "S1 digest counting",
   "\"Counting renewals and overdues…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (metadata rule)",
   "\"Auto-renew needs a notice window in days — 60 is the common default. Add one to save.\"",
   "\"التجديد التلقائي يحتاج نافذة إخطار بالأيام — 60 هو الافتراضي الشائع. أضفها للحفظ.\"",
   "VALIDATION (date logic)"
  ],
  "success": [
   "Contract registered",
   "\"Contract registered — bilingual titles, term to 31 Jan 2027, 60-day notice window.\"",
   "\"سُجّل العقد — عنوانان بلغتين، ومدة حتى 31 يناير 2027، ونافذة إخطار 60 يوماً.\"",
   "Obligation added",
   "\"Obligation recorded — they owe the certificate, due 15 Oct 2026. First reminder 15 Sep.\""
  ]
 },
 "briefLine": "The unique feature is bilingual contract metadata with obligation-extraction reminders. In Gulf practice the same agreement routinely lives in two scripts — an English governing text whose counterparty is filed under an Arabic commercial-registration name, a lease whose Arabic title is what the team actually calls it — so every identity-bearing field (contract title, counterparty legal name, obligation summary) is authored in both locales, rendered per-side direction, and searchable through Arabic-aware normalization (rtl-rules §4). Obligations are the second axis: renewal-notice windows, expiry dates, payment cadences, insurance certificates, deliverable milestones — each a structured record with an owner, a due date (one-time or recurring), and a derived reminder schedule computed from workspace-default lead times (30/7 days, overridable per obligation). The AI stance is conditionally-AI (ai-native-patterns §1): an obligation-extraction assist may propose metadata and obligation drafts from an uploaded document when the capability is bound and consented; every suggestion is draft-by-default until a human accepts, edits, or dismisses it (P15); and when the assist is unbound, exhausted, or refused, the product degrades to fully manual entry — the hand-entry wizard with the top-ten field checklist practitioners already run by hand (research [19][21]) — while the deterministic reminder engine keeps firing unchanged. Extraction is an accelerant on top of a workflow that must work without it; the reminders are the product's spine and are never AI-dependent."
} as const;
export type Spec = typeof SPEC;
