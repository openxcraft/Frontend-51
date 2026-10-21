// GENERATED from specs-source/meeting-notes-action-desk/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "meeting-notes-action-desk",
 "title": "Meeting Notes Action Desk",
 "family": "business_ops",
 "tier": 3,
 "flagship": false,
 "adapter": "MeetingNotesAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Maqam Lilac",
  "pairing": "P07",
  "radius": "8px",
  "elevation": "soft-lift",
  "icon": "line-1.5",
  "motion": "minimal",
  "fonts": [
   "Readex Pro",
   "DM Sans"
  ],
  "primary": "#7682BC",
  "accent": "#464F8C",
  "canvas": "#1F212B"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Desk home",
   "purpose": "loop digest (zones + counts, each row a live link), meetings list with rollups, onboarding checklist (P22)",
   "shell": "",
   "data": "listActions, listMeetings, getMeeting, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Meeting detail — Capture",
   "purpose": "notes/transcript revisions, per-segment direction, speaker labels, evidence-highlight spans, ingest actions",
   "shell": "",
   "data": "getNotes, importNotes, transcribeAudio, getMeeting",
   "archetype": "wizard-flow"
  },
  {
   "id": "S3",
   "name": "Meeting detail — Summary",
   "purpose": "mode-labeled summary, proposals review (accept/edit/dismiss), regenerate, assist meter",
   "shell": "Meeting detail — Summary",
   "data": "runSummarization, getMeeting, getUsage, listJobs",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "Meeting detail — Decisions",
   "purpose": "decision list, create/edit, evidence links",
   "shell": "",
   "data": "createDecision, listDecisions, updateDecision",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "Meeting detail — Actions",
   "purpose": "action list for the meeting, ActionComposer drawer, send-for-confirmation",
   "shell": "",
   "data": "createAction, listActions, getAction, updateAction, requestConfirmation, updateActionStatus",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Loop desk",
   "purpose": "confirmation queue (awaiting / questioned / declined / confirmation-overdue), respond surfaces for owners, escalation review",
   "shell": "Loop desk",
   "data": "listActions, getAction, respondToConfirmation, updateAction, requestConfirmation, listActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Actions register",
   "purpose": "all actions across meetings; filters owner/status/zone/meeting/date; export register",
   "shell": "",
   "data": "listActions, getAction, updateActionStatus, exportMinutes",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Members & Settings",
   "purpose": "bilingual member directory, seat roles, locale/assist/respond-by defaults, consent state",
   "shell": "",
   "data": "listMembers, addMember, getSession, getUsage",
   "archetype": "settings-admin"
  },
  {
   "id": "S9",
   "name": "Command palette (overlay) + Jobs & activity console",
   "purpose": "bilingual search across meetings/actions/members/jobs; job rows with cancel/retry and link-to-context; activity feed",
   "shell": "",
   "data": "client-side over S1/S6/S7 data; listJobs, listActivity",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — New meeting → capture in → first proposals (value proof)",
   "steps": [
    "First read done: the meeting now has capture, summary, ≥1 decision, ≥1 authored action — the desk digest updates. getUsage (assist meter, P14)",
    "*Recovery: capture revisions persist across failed jobs; summarization is re-runnable; nothing entered is ever lost to a job failure."
   ]
  },
  {
   "title": "CP-4 — Follow-through: in-progress → done; overdue zones; the desk review",
   "steps": [
    "Any mutation is in the activity log — actor, action, target, timestamp (P17). listActivity",
    "*Recovery: reopen returns the action to in-progress with the full prior history; nothing is destructive except withdrawal, which is itself logged."
   ]
  },
  {
   "title": "CP-5 — Decisions, minutes export, register export, workspace management",
   "steps": [
    "Meeting metadata edits (title pair, date, participants — e.g., a name correction) with revision history. updateMeeting · getMeeting · listMeetings",
    "Register export variant: the actions register alone (filtered as displayed) for Reem's quarterly review. exportMinutes (register option)"
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "Offline (P20): reads work; writes (confirmations, status changes, edits) queue with per-item state; jobs reconcile to authoritative state on return.",
    "Viewer seat: read-only across the desk; PERMISSION surfaces name the seat's duties instead of hiding data."
   ]
  }
 ],
 "components": [
  {
   "name": "NotesIngestPanel",
   "purpose": "the capture surface: type-notes editor (always-available floor), paste/import field, optional transcribe-audio path with consent surface",
   "obligations": "Typed path needs zero capabilities (LOOP-5 floor); paste validation names the first bad row; the transcribe path renders optional with capability-language consent (credential-contract §2), never as the front door; mixed-script input gets dir=\"auto\" + isolate marks (rtl-rules §2); autosave draft state persistent (P10); upload progress is a determinate Job row, not a blocking spinner"
  },
  {
   "name": "CaptureStream",
   "purpose": "read view of a notes/transcript revision: speaker chips, timestamps, per-segment direction (ar/en/mixed), evidence-highlight spans where proposals/decisions/actions are bound",
   "obligations": "Each segment renders at its own direction with bidi isolation; code-switched segments never force ambient direction; evidence spans are focusable links with the target artifact named (\"التكليف A-001\") — the span is a visible, keyboard-reachable anchor, never color-only; row-count context on region entry; >200 segments virtualize with focus preservation (P19)"
  },
  {
   "name": "SummaryPanel",
   "purpose": "the mode-labeled summary: bilingual paragraphs, provenance chip (assist/deterministic/manual), proposals review (accept/edit/dismiss per proposal), regenerate",
   "obligations": "Streaming disclosure per ai-native-patterns §2 — reserved region, start/completion announced, stop/regenerate always available, partial marked; every proposal carries confidence label with the fixed low-confidence mark (<0.70) as text, evidence-span link, and accept/override actions (P15 draft-by-default); provenance chip is icon+text; deterministic mode renders NO meter (the floor must not read as rationed — 06 QuotaMeter rule)"
  },
  {
   "name": "ActionComposer",
   "purpose": "authoring surface: bilingual text pair (side-by-side, per-side direction), single-owner picker (refuses a second owner), due date (Gregorian storage, dual-calendar display P24), respond-by override, evidence-span link",
   "obligations": "Pair sides render per-side direction with length-far-apart/unpaired warning (P23 sibling logic scoped to pairs); empty side is an honest slot, never auto-filled; single-owner enforcement is visible copy + picker behavior, not an after-submit error; due-date-before-respond-by warning; labels persist above fields (a11y-baseline §5); keyboard-complete (P06 inline edit + escape); draft autosave (P10)"
  },
  {
   "name": "ConfirmationLoopCard",
   "purpose": "the signature component: one action's loop state — chip (proposed/questioned/confirmed/declined), respond-by countdown, owner name, respond actions (Confirm / Ask / Decline), the clarification thread",
   "obligations": "The three responses are visible buttons with verb+object labels (copy-voice §1.5), ≥24px targets (2.5.8); disable-on-submit to prevent double response (ux-guidelines row 33) + idempotency keys (07b); racing responses surface CONFLICT with the recorded response; the thread is a chronological list with timestamps announced politely; the Ta'ahhud Settle (05) renders here — opacity-only, reduced-motion-safe"
  },
  {
   "name": "LoopDeskDigest",
   "purpose": "S1/S6 surface: counts by zone (awaiting-confirmation, confirmation-overdue, overdue, due-soon, done-this-week) with live drill-down rows",
   "obligations": "Zone counts are text first (charts contract: numbers always present, never heat-only); each row links to its action; confirmation-overdue rows name their values (\"requested 8 Oct, respond-by 11 Oct, 10 days unanswered\"); digest refreshes politely, never auto-updates under the caret; owner-scoped variant for owner mode"
  },
  {
   "name": "ActionRegisterTable",
   "purpose": "the cross-meeting register: virtualized rows (bilingual action text, owner, meeting, zone chip, status, due date), filters, bulk ops",
   "obligations": "P18 grid (arrow navigation, range selection); >200 rows virtualize (P19); zone chips are color+glyph+text (readable with color disabled — 05); filtered state declares itself (P08); mixed-script cells bidi-isolated; Western numerals; export-register action anchored to the current filter state and saying so"
  },
  {
   "name": "MinutesPreview",
   "purpose": "bilingual minutes preview + action register appendix preview, export controls, artifact list with expiry",
   "obligations": "Fixed, inspectable structure (header, participants, summary, decisions, actions with confirmation provenance); both locales' sections render per-side direction; unconfirmed actions export flagged proposed (honest, not blocking); capture-revision provenance line; artifact expiry + regeneration per async-contract §2"
  }
 ],
 "ops": [
  "getSession",
  "listMembers",
  "addMember",
  "createMeeting",
  "listMeetings",
  "getMeeting",
  "updateMeeting",
  "importNotes",
  "getNotes",
  "transcribeAudio",
  "runSummarization",
  "createDecision",
  "listDecisions",
  "updateDecision",
  "createAction",
  "listActions",
  "getAction",
  "updateAction",
  "updateActionStatus",
  "requestConfirmation",
  "respondToConfirmation",
  "exportMinutes",
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
    },
    {
     "name": "assistDefault",
     "optional": false,
     "type": "SummarizationMode"
    },
    {
     "name": "respondByDefaultDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "meetingTitleLanguageHint",
     "optional": false,
     "type": "Locale"
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
     "name": "workspaceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "displayNameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "displayNameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "seat",
     "optional": false,
     "type": "'lead' | 'member' | 'viewer'"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Meeting",
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
     "optional": true,
     "type": "string"
    },
    {
     "name": "titleAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "heldOn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "participantMemberIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "seriesLabel",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'open' | 'closed'"
    },
    {
     "name": "counts",
     "optional": false,
     "type": "{"
    },
    {
     "name": "decisions",
     "optional": false,
     "type": "number"
    },
    {
     "name": "actions",
     "optional": false,
     "type": "number"
    },
    {
     "name": "actionsConfirmed",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "CaptureSegment",
   "fields": [
    {
     "name": "index",
     "optional": false,
     "type": "number"
    },
    {
     "name": "speakerMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "speakerLabel",
     "optional": true,
     "type": "string"
    },
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "direction",
     "optional": false,
     "type": "SegmentDirection"
    },
    {
     "name": "startTs",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "CaptureRevision",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "meetingId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number"
    },
    {
     "name": "source",
     "optional": false,
     "type": "CaptureSource"
    },
    {
     "name": "capturedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "segments",
     "optional": false,
     "type": "CaptureSegment[]"
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
    }
   ]
  },
  {
   "name": "Summary",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "meetingId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "captureRevisionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "mode",
     "optional": false,
     "type": "SummarizationMode"
    },
    {
     "name": "degraded",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "textEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "textAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "proposedDecisions",
     "optional": false,
     "type": "DecisionDraft[]"
    },
    {
     "name": "proposedActions",
     "optional": false,
     "type": "ActionDraft[]"
    },
    {
     "name": "generatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "DecisionDraft",
   "fields": [
    {
     "name": "textEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "textAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "evidenceSpan",
     "optional": true,
     "type": "{ revisionId: string; segmentIndex: number; charStart: number; charEnd: number }"
    },
    {
     "name": "confidence",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "ActionDraft",
   "fields": [
    {
     "name": "textEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "textAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "ownerMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "ownerGuessBasis",
     "optional": false,
     "type": "'speaker-match' | 'third-person-cue' | 'assist' | 'none'"
    },
    {
     "name": "dueOn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "dueGuessBasis",
     "optional": false,
     "type": "'date-expression' | 'assist' | 'none'"
    },
    {
     "name": "evidenceSpan",
     "optional": true,
     "type": "{ revisionId: string; segmentIndex: number; charStart: number; charEnd: number }"
    },
    {
     "name": "confidence",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "Decision",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "meetingId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "textEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "textAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "evidenceSpan",
     "optional": true,
     "type": "{ revisionId: string; segmentIndex: number; charStart: number; charEnd: number }"
    },
    {
     "name": "createdByMemberId",
     "optional": false,
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
   "name": "ActionItem",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "meetingId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "textEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "textAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "ownerMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "dueOn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "ActionStatus"
    },
    {
     "name": "evidenceSpan",
     "optional": true,
     "type": "{ revisionId: string; segmentIndex: number; charStart: number; charEnd: number }"
    },
    {
     "name": "origin",
     "optional": false,
     "type": "'assist-proposal' | 'deterministic-cue' | 'manual'"
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
  }
 ],
 "copy": {
  "empty": [
   "S1 desk first-run",
   "\"No meetings yet. Create one, or open the sample debrief and watch a confirmation overdue in the loop.\"",
   "\"لا اجتماعات بعد. أنشئ اجتماعاً، أو افتح جلسة التذوّق النموذجية وشاهد تأخراً في التأكيد داخل الحلقة.\"",
   "New meeting / Open sample meeting",
   "S1 meetings filtered-empty"
  ],
  "loading": [
   "S1 digest skeleton",
   "digest rows + meetings skeleton ×8 + \"Loading your desk…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل لوحتك…\"",
   "Capture import job (determinate)",
   "\"Importing 9 of 14 segments — 'لازم تجديد الفحص' recognized as an action cue.\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (empty capture text)",
   "\"Segment 7 has no text — the segments around it imported fine. Fix segment 7 and import just it.\"",
   "\"المقطع 7 بلا نص — استُوردت المقاطع من حوله سليمة. صحّح المقطع 7 واستورد وحده.\"",
   "VALIDATION (confirmation without owner)"
  ],
  "success": [
   "Capture imported",
   "\"14 segments in, 0 invalid — speakers matched by name: omar haddad, ساره الراشد, and 5 more.\"",
   "\"دخل 14 مقطعاً، و0 غير صالحة — طُوبِع المتحدثون بالأسماء: omar haddad و ساره الراشد و5 آخرين.\"",
   "Summarization done (cue mode)",
   "\"9 proposals from 14 segments — 8 actions and 1 decision; cue mode, no capability used.\""
  ]
 },
 "briefLine": "The unique feature is the owner confirmation loop. In the incumbent workflow — notes in a document, actions shouted across a room, follow-through left to memory — an \"assigned\" task is a hope, not a commitment. This product makes assignment a handshake with a state machine: a lead proposes an action to an owner; the owner explicitly confirms it (the action becomes a commitment, with the confirm timestamp and the owner's own session recorded), questions it (asks for clarification; the action returns to the lead's desk with the question attached), or declines it (the action lands in a reassignment-needed state instead of silently dying). Unconfirmed actions escalate honestly — they sit in the loop desk, past their respond-by window, visible to the lead, never auto-reassigned and never silently dropped. Follow-through continues on the same rail: confirmed actions move in-progress → done by their owners; overdue is a derived, computed zone, not a judgment. The loop is the accountability grammar Gulf office culture already runs on paper — the attestation instinct behind عهدة custody logs and signed hand-offs (asset-register-tracker's grammar) — applied to commitments instead of equipment."
} as const;
export type Spec = typeof SPEC;
