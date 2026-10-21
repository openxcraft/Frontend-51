// GENERATED from specs-source/arabic-copy-studio/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "arabic-copy-studio",
 "title": "Arabic Copy Studio",
 "family": "content_tools",
 "tier": 1,
 "flagship": true,
 "adapter": "ContentStudioAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Dahriz Ink",
  "pairing": "P08",
  "radius": "4px",
  "elevation": "layered-depth",
  "icon": "line-1.5",
  "motion": "stately",
  "fonts": [
   "Amiri",
   "Source Serif 4"
  ],
  "primary": "#1E2247",
  "accent": "#F2B94B",
  "canvas": "#F5F2EA"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Workspace home",
   "purpose": "documents list, onboarding checklist (P22), recent jobs",
   "shell": "",
   "data": "listDocuments(Query), getUsage()",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "First-run setup",
   "purpose": "workspace prefs, brand kit quick-start, register defaults",
   "shell": "",
   "data": "getBrandKit(), updateBrandKit(), importGlossary(Job)",
   "archetype": "wizard-flow"
  },
  {
   "id": "S3",
   "name": "Document editor",
   "purpose": "write/edit/refine; DiffBrush; drift flags",
   "shell": "",
   "data": "getDocument(), updateBlocks(base), startGeneration(), subscribeGeneration(), inspectText()",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "AI panel",
   "purpose": "brief forms, refine actions, stream states",
   "shell": "",
   "data": "startGeneration(), startRefinement()",
   "archetype": "wizard-flow"
  },
  {
   "id": "S5",
   "name": "Parity Weave",
   "purpose": "bilingual transform review",
   "shell": "Parity Weave",
   "data": "transformContent(Job), getJob(), commitTransform()",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Glossary manager",
   "purpose": "term CRUD, conflicts, import/export",
   "shell": "",
   "data": "listGlossaryTerms(Query), upsertGlossaryTerm(), resolveGlossaryConflict()",
   "archetype": "jobs-centre"
  },
  {
   "id": "S7",
   "name": "Brand kit",
   "purpose": "voice traits, samples, banned terms",
   "shell": "",
   "data": "getBrandKit(), updateBrandKit()",
   "archetype": "settings-admin"
  },
  {
   "id": "S8",
   "name": "Register settings",
   "purpose": "defaults, tashkeel policy, dialect tolerances",
   "shell": "",
   "data": "workspace settings ops",
   "archetype": "settings-admin"
  },
  {
   "id": "S9",
   "name": "Review mode",
   "purpose": "diff vs last approval, comments, approve",
   "shell": "Review mode",
   "data": "getDocument(revision range), addComment(), reviewDocument()",
   "archetype": "review-queue"
  },
  {
   "id": "S10",
   "name": "Revision history",
   "purpose": "version list, block diffs (P16)",
   "shell": "",
   "data": "listRevisions(), getRevision()",
   "archetype": "review-queue"
  },
  {
   "id": "S11",
   "name": "Templates gallery",
   "purpose": "asset-type brief templates (campaign, PDP, email…)",
   "shell": "",
   "data": "listTemplates()",
   "archetype": "board"
  },
  {
   "id": "S12",
   "name": "Usage & quota",
   "purpose": "meter, window reset, cost transparency",
   "shell": "",
   "data": "getUsage(), getQuotaPolicy()",
   "archetype": "list-console"
  },
  {
   "id": "S13",
   "name": "Jobs center",
   "purpose": "async-contract §7 surface",
   "shell": "",
   "data": "listJobs(Query)",
   "archetype": "jobs-centre"
  },
  {
   "id": "S14",
   "name": "Seats & workspace admin",
   "purpose": "members, roles (owner/editor)",
   "shell": "",
   "data": "listMembers(), inviteMember(), updateMemberRole()",
   "archetype": "editor-studio"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — First-run → brand kit → first register-controlled draft (value proof)",
   "steps": [
    "Workspace creation (name, default locale ar/en, default register proposal).",
    "Register selection via Register Dial (فصحى بيضاء / فصحى وسطى / declare-dialect-tolerant) with one-line plain-language effect previews.",
    "Generation streams into the document canvas (P13): reserved space, stop/regenerate present, citations if brief referenced facts.",
    "Save state persists (P10); user edits freely; register drift flags appear inline as they edit.",
    "*Recovery: all autosave states (P10); conflict resolution offers both versions side-by-side (P16-lite for blocks)."
   ]
  },
  {
   "title": "CP-2 — Inline refine loop (the daily loop; performance-critical)",
   "steps": [
    "Suggestion streams into a DiffBrush overlay on the passage (old text struck, new text inked).",
    "Accept (⌘⏎) / Reject (Esc) / Refine-again with a note.",
    "Accepted change commits to a new revision; undo window (P03) applies.",
    "*Recovery: every refine action is a revision; revision history is the recovery surface."
   ]
  },
  {
   "title": "CP-3 — Bilingual transform with parity review (unique feature path)",
   "steps": [
    "Source document (or selection) → \"Transform\" → target locale + target register + length policy (strict/comfortable).",
    "Job (async-contract §1) with per-block progress; transform preserves block structure.",
    "Writer reconciles per block: accept / edit transform / re-transform single block.",
    "Commit creates the paired document version (en↔ar linkage recorded in 07a).",
    "*Recovery: partial transform is a first-class saved state, never discarded."
   ]
  },
  {
   "title": "CP-4 — Glossary enforcement pass (governance loop, Omar's path)",
   "steps": [
    "Open document or batch-select documents → \"Glossary check\".",
    "Inspection report: term hits, term misses (concept present, preferred term absent), banned-term violations, register drift summary.",
    "Apply suggestions selectively (bulk-apply with per-item opt-out per ai-native-patterns §6).",
    "Report exports as audit artifact (activity log entry appended).",
    "*Failure modes: inspection timeout (typed error, retry); report >500 items (virtualized list P19 + filter by severity).",
    "*Recovery: check is read-only until applied; application is revisioned."
   ]
  },
  {
   "title": "CP-5 — Review, approve, export (handoff path)",
   "steps": [
    "Send document to review (status → in-review; reviewer sees diff since last approval).",
    "Reviewer annotates block-level comments; resolves or requests changes.",
    "Approve (status → approved; approval recorded with actor + timestamp — activity log).",
    "*Failure modes: export job failure (typed error + retry; partial bundles per policy); reviewer removed mid-review (reassignment path).",
    "*Recovery: approval history is immutable; amendments are new revisions."
   ]
  },
  {
   "title": "Non-happy-path walkthroughs (documented, tested)",
   "steps": [
    "Offline mid-session: banner (P20), local queue for edits, conflict path on reconnect; AI operations explicitly disabled with reason.",
    "First-session abandonment: return state (async-contract §6.3) resumes the unfinished brief exactly where left (3.3.7 redundant-entry satisfied).",
    "Malicious-input briefs (e.g., 500KB brief text): length validation, typed error, honest limit copy — no silent truncation."
   ]
  }
 ],
 "components": [
  {
   "name": "RegisterDial",
   "purpose": "Register selection (بيضاء/وسطى/dialect-tolerant) with plain-language effect previews",
   "obligations": "Radio-group semantics; keyboard native; preview text changes announced politely; no radial-drag dependency (2.5.7-safe)"
  },
  {
   "name": "TashkeelToggle",
   "purpose": "Vocalization layer on/off with line-height warning",
   "obligations": "Announces state + effect (\"تشكيل مفعّل — سيتم تكبير تباعد الأسطر\"); reflow budgeted (CLS ≤0.02 by pre-reserved line boxes)"
  },
  {
   "name": "DialectWarningCard",
   "purpose": "Dialect detection result + normalize/accept choice",
   "obligations": "Explicit choice pattern (ai-native-patterns §7); choice recorded in document metadata; Esc-safe"
  },
  {
   "name": "StreamCanvas",
   "purpose": "Reserved-region streaming text with citation anchors and Ink Settle motion",
   "obligations": "P13 contract; live-region start/end only; citation chips focusable in source panel; reduced-motion = chunk fade"
  },
  {
   "name": "DiffBrush",
   "purpose": "Inline passage refine overlay (old struck / new inked)",
   "obligations": "Accept/reject keyboard-first (⌘⏎/Esc); contrast 4.5:1 for both layers; RTL strike direction follows text direction"
  },
  {
   "name": "GlossaryChip",
   "purpose": "Term marker in text + parity chip in Parity Weave",
   "obligations": "Hover/focus shows term definition popover; chips are exemption-aware (code/Latin runs excluded); screen-reader text includes term id"
  },
  {
   "name": "ParityWeave",
   "purpose": "Side-by-side ar/en aligned blocks with sync states (P23)",
   "obligations": "Alignment links keyboard-navigable; length-delta flags; narrow-viewport stacked compare (400% reflow-safe); direction rendering per column"
  }
 ],
 "ops": [
  "getSession",
  "listDocuments",
  "getDocument",
  "createDocument",
  "updateBlocks",
  "updateDocumentStatus",
  "startGeneration",
  "subscribeGeneration",
  "stopGeneration",
  "startRefinement",
  "acceptSuggestion",
  "transformContent",
  "getJob",
  "retryJob",
  "cancelJob",
  "inspectText",
  "listGlossaryTerms",
  "upsertGlossaryTerm",
  "resolveGlossaryConflict",
  "importGlossary",
  "getBrandKit",
  "updateBrandKit",
  "addComment",
  "approveDocument",
  "exportDocument",
  "getArtifact",
  "getUsage"
 ],
 "entities": [
  {
   "name": "Block",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "'paragraph'|'heading'|'list'|'cta'; text: string; }"
    },
    {
     "name": "id",
     "optional": false,
     "type": "string; title: string; locale: 'ar'|'en'; register: Register"
    },
    {
     "name": "tashkeelEnabled",
     "optional": false,
     "type": "boolean; dialectFlag: { none: true } | { detected: string } | { accepted: string }"
    },
    {
     "name": "blocks",
     "optional": false,
     "type": "Block[]; status: DocStatus; currentRevisionId: string"
    },
    {
     "name": "pairedDocumentId",
     "optional": false,
     "type": "string | null; updatedAt: string"
    }
   ]
  },
  {
   "name": "Revision",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; createdAt: string; actorId: string; changeSummary: string; }"
    },
    {
     "name": "assetType",
     "optional": false,
     "type": "'campaign'|'productDescription'|'email'|'socialPost'|'adCopy'"
    },
    {
     "name": "audience",
     "optional": false,
     "type": "string; keyPoints: string[]; lengthTarget: { words: number; policy: 'strict'|'comfortable' }"
    },
    {
     "name": "register",
     "optional": false,
     "type": "Register; locale: 'ar'|'en'; glossaryEnforced: boolean"
    }
   ]
  },
  {
   "name": "GlossaryTerm",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; termAr: string; termEn: string; definition: string"
    },
    {
     "name": "doNotUse",
     "optional": false,
     "type": "string[]; register: Register; conflictGroup: string | null"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no docs, no brand kit)",
   "\"Your studio is ready. Start with one brief — or set up your brand kit first.\"",
   "\"الاستوديو جاهز. ابدأ بموجزٍ واحد — أو أعدّ حزمة علامتك أولاً.\"",
   "New document / Set up brand kit",
   "S1 no-data-after-activity"
  ],
  "loading": [
   "S1 list skeleton",
   "(skeleton rows ×8) + \"Loading your documents…\" (SR)",
   "(صفوف هيكلية) + \"جارٍ تحميل مستنداتك…\"",
   "S3 editor boot (staged)",
   "shell → blocks → highlights; SR: \"Opening «{title}»\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (brief)",
   "\"يحتاج الموجز إلى نقطة أساسية واحدة على الأقل. أضف ما يجب أن تقوله الصياغة.\"",
   "NOT_FOUND (doc opened from stale link)",
   "\"This document no longer exists in this workspace. It may have been archived or deleted.\" → Back to documents"
  ],
  "success": [
   "First approved document",
   "\"Approved. This version is now the record — further edits will ask for re-approval.\"",
   "\"تمت الموافقة. هذا الإصدار الآن السجل — التعديلات اللاحقة ستطلب موافقة جديدة.\"",
   "Transform committed",
   "\"Paired version saved. The two documents now travel together.\""
  ]
 },
 "briefLine": "In-house Arabic-first content and marketing teams (2–50 seats) at brands, e-commerce companies, publishers, and agencies across MENA. Secondary: bilingual freelancers serving those teams. Primary economic buyer: content lead / marketing director. Primary daily user: copywriter or bilingual content designer. Full personas in 02-user-research.md."
} as const;
export type Spec = typeof SPEC;
