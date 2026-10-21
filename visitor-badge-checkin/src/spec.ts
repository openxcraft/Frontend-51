// GENERATED from specs-source/visitor-badge-checkin/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "visitor-badge-checkin",
 "title": "Visitor Badge Checkin",
 "family": "business_ops",
 "tier": 3,
 "flagship": false,
 "adapter": "VisitorBadgeAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Barid Sky",
  "pairing": "P06",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "line-2",
  "motion": "minimal",
  "fonts": [
   "Almarai",
   "Inter"
  ],
  "primary": "#209385",
  "accent": "#005E51",
  "canvas": "#162427"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Today board",
   "purpose": "desk",
   "shell": "",
   "data": "expected next, in-building now, recent arrivals, no-show zone; arrival actions",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Visits list",
   "purpose": "desk",
   "shell": "",
   "data": "all visits, filters + saved views (P08), bulk none (single-item actions only)",
   "archetype": "review-queue"
  },
  {
   "id": "S3",
   "name": "Pre-registration composer",
   "purpose": "desk/host",
   "shell": "",
   "data": "invitation fields, window, host, type; code + link on save",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Visit detail",
   "purpose": "desk",
   "shell": "",
   "data": "timeline (P17), badge panel with lineage, host-notify events, state chip",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "Visitor log & exports",
   "purpose": "desk",
   "shell": "",
   "data": "log table, in-building list view, export jobs, retention statement",
   "archetype": "review-queue"
  },
  {
   "id": "S6",
   "name": "Badge studio",
   "purpose": "desk",
   "shell": "",
   "data": "template list, spec editor, validation issues, live bilingual preview",
   "archetype": "editor-studio"
  },
  {
   "id": "S7",
   "name": "Settings",
   "purpose": "desk",
   "shell": "",
   "data": "kiosk config, retention window, purposes, notification tiers, roles note",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "Host surface — my guests",
   "purpose": "host (360px-capable)",
   "shell": "",
   "data": "expected guests, arrival pings, compose, cancel; notification-link target",
   "archetype": "list-console"
  },
  {
   "id": "S9",
   "name": "Kiosk check-in",
   "purpose": "kiosk",
   "shell": "",
   "data": "welcome/language → code / walk-in / returning → confirm → badge-ready pass",
   "archetype": "list-console"
  },
  {
   "id": "S10",
   "name": "Jobs console",
   "purpose": "desk",
   "shell": "",
   "data": "export jobs, retention/end-of-day sweeps, cancel/retry, link-to-context",
   "archetype": "review-queue"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Kiosk check-in: arrival → host notified → badge (the value proof, visitor-facing)",
   "steps": [
    "Kiosk wakes from idle welcome loop (language toggle ar/en front and center, workspace name, courtesy greeting per kiosk config). getKioskConfig",
    "*Recovery: nothing is lost on failure — the invitation record persists, walk-in forms persist locally, and the state machine is resumable by code."
   ]
  },
  {
   "title": "CP-2 — Pre-registration: invitation composition → send (the host's path)",
   "steps": [
    "Corrections before arrival: reschedule the window, edit details, reassign the host — each edit is versioned on the visit record. updateVisit",
    "Cancellation: host or desk cancels before arrival; the record states cancelled with actor and reason — never deleted (audit honesty). cancelVisit",
    "A host not yet in the list is added inline from the picker (bilingual name, department, notification preference). addHost · listHosts",
    "*Recovery: invitations are re-editable and re-cancellable until check-in; after check-in the record is the visit (append-only events)."
   ]
  },
  {
   "title": "CP-4 — Visitor log, in-building list, retention, and export (the record's surface)",
   "steps": [
    "Artifact delivery: download/copy is the primary path (LOOP-5); the abstract delivery channel is optional. getArtifact · listJobs",
    "Session/role checks on entry (admin vs receptionist vs host vs viewer). getSession",
    "*Recovery: exports regenerate from log state; the log itself never loses records to an export failure."
   ]
  },
  {
   "title": "CP-5 — Badge studio & kiosk setup (the admin's configuration path)",
   "steps": [
    "*Failures: stale version on save (CONFLICT, both kept); kiosk config referencing a deactivated template (VALIDATION naming it).",
    "*Recovery: template versions are restorable; the stock template can always be re-cloned — the workspace can never strand itself without an active spec."
   ]
  }
 ],
 "components": [
  {
   "name": "KioskFlowStep",
   "purpose": "one question per screen with step count (\"Step 2 of 3\"), giant labels (Almarai 800 at confirmation), ≥56px primary targets, ≥12px gaps",
   "obligations": "Focus order enforced (form → primary action → secondary); every step SR-announced on entry (polite); input dir=\"auto\" with bidi isolation; back action is a real button with focus return; idle-timeout resets to welcome with a polite announcement; keyboard path exists for receptionist-assisted mode (09)"
  },
  {
   "name": "CheckInCodePad",
   "purpose": "the six-character code entry: large numeric-capacity field with code-grouped display, camera-scan affordance, and \"no code? walk in\" escape",
   "obligations": "Code renders tabular figures LTR always (an alphanumeric code is a Latin-script token — rtl-rules §2); scan and type are the same lookup; failure copy names the next action; auto-submit on 6th character is OFF by default (deliberate — premature submit is the standing-visitor's worst moment)"
  },
  {
   "name": "HostPickerField",
   "purpose": "searchable host selection with Arabic normalization (alef/hamza, taa marbuta/heh, yaa forms — rtl-rules §4), normalized-match disclosure",
   "obligations": "Search input dir=\"auto\"; results announce count on region entry; normalization rule disclosed at point-of-use (ai-native-patterns §7.4 discipline applies to deterministic matching too); \"host not listed → add host\" is an inline action, not a dead end"
  },
  {
   "name": "TodayBoardColumn",
   "purpose": "the board's three zones (expected next / in-building now / recent arrivals) + derived no-show strip",
   "obligations": "Zone semantics as labeled regions; visit rows are focusable with named actions (badge, notify-again, check-out); counts as text in every zone header (never color-only); in-building durations tick in text, never by animation (minimal motion); column order mirrors in RTL"
  },
  {
   "name": "VisitTimeline",
   "purpose": "append-only event rail per visit (created, notified ×channel, checked-in, badge issued/voided/corrected, checked-out, swept)",
   "obligations": "List semantics, newest-first with a toggle; each event carries actor+timestamp+channel as TEXT; correction chains render as linked entries (voided-by → replacement) with focus-follows-chain action; log-style density with row-count context on region entry"
  },
  {
   "name": "BadgeSpecEditor",
   "purpose": "the studio's field toggles, band mapping, direction variant, stock size, and live validation issues",
   "obligations": "Field-level validation messages linked by described association; both direction variants must validate before activation (05 obligation); band picker enforces the deep-variant lock (type text never renders on band amber); version badge + autosave (P10); save conflict surfaces both versions (P10/P04)"
  },
  {
   "name": "BadgePreviewCard",
   "purpose": "deterministic preview of the spec with sample or real visit data, per direction, text-first",
   "obligations": "Preview is a semantic description list (field → value), not an image-only render — SR parity by construction; worst-case long-name fixture toggle (مستشارو التدقيق والحوكمة class); preview re-renders per direction on toggle; the band strip and code render exactly as the artifact will"
  },
  {
   "name": "ReturningVisitorConfirm",
   "purpose": "the \"we met you on 12 Oct — same details?\" candidate match surface",
   "obligations": "Match is offered, never applied silently (P15-shaped discipline on a deterministic suggestion); normalized-name disclosure (\"مطابقة بعد التطبيع\"); each candidate requires explicit confirm; declining falls through to the manual form with typed data preserved"
  }
 ],
 "ops": [
  "getSession",
  "getFrontDeskBoard",
  "listVisits",
  "getVisit",
  "createVisitInvitation",
  "updateVisit",
  "cancelVisit",
  "getVisitByCheckInCode",
  "lookupReturningVisitor",
  "checkInVisitor",
  "checkOutVisitor",
  "listBadgeTemplates",
  "getBadgeTemplate",
  "saveBadgeTemplate",
  "validateBadgeTemplate",
  "previewBadge",
  "issueBadge",
  "voidBadge",
  "getBadge",
  "getBadgeArtifact",
  "listHosts",
  "addHost",
  "updateHost",
  "getKioskConfig",
  "saveKioskConfig",
  "getWorkspaceSettings",
  "saveWorkspaceSettings",
  "exportVisitorLog",
  "getArtifact",
  "listJobs",
  "getUsage"
 ],
 "entities": [
  {
   "name": "VisitWindow",
   "fields": [
    {
     "name": "start",
     "optional": false,
     "type": "string"
    },
    {
     "name": "end",
     "optional": false,
     "type": "string"
    }
   ]
  },
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
     "name": "retention",
     "optional": false,
     "type": "{"
    },
    {
     "name": "visitLogMonths",
     "optional": false,
     "type": "number"
    },
    {
     "name": "archiveExportable",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "purposes",
     "optional": false,
     "type": "PurposeItem[]"
    },
    {
     "name": "notifyTiers",
     "optional": false,
     "type": "Record<NotifyClass, 'instant' | 'daily-digest' | 'off'>"
    }
   ]
  },
  {
   "name": "PurposeItem",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "label",
     "optional": false,
     "type": "{ ar: string; en: string }"
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
     "name": "nameAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "department",
     "optional": true,
     "type": "string"
    },
    {
     "name": "role",
     "optional": false,
     "type": "'owner' | 'admin' | 'receptionist' | 'host' | 'viewer'"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "notifyPrefs",
     "optional": false,
     "type": "{ arrival: 'app' | 'app-plus-channel' }"
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
    }
   ]
  },
  {
   "name": "VisitorProfile",
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
     "name": "normalizedName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "phoneLast4",
     "optional": true,
     "type": "string"
    },
    {
     "name": "lastVisitId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "lastVisitAt",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Visit",
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
     "name": "visitorName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "visitorNameScript",
     "optional": false,
     "type": "'arabic' | 'latin' | 'mixed'"
    },
    {
     "name": "company",
     "optional": true,
     "type": "string"
    },
    {
     "name": "phone",
     "optional": true,
     "type": "string"
    },
    {
     "name": "visitorType",
     "optional": false,
     "type": "VisitorType"
    },
    {
     "name": "purposeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "hostId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "window",
     "optional": false,
     "type": "VisitWindow"
    },
    {
     "name": "origin",
     "optional": false,
     "type": "VisitOrigin"
    },
    {
     "name": "status",
     "optional": false,
     "type": "VisitStatus"
    }
   ]
  },
  {
   "name": "VisitEvent",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "visitId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "VisitEventKind"
    },
    {
     "name": "actorMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "actorLabel",
     "optional": true,
     "type": "'visitor-kiosk' | 'system-sweep'"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    },
    {
     "name": "detail",
     "optional": true,
     "type": "{"
    },
    {
     "name": "channel",
     "optional": true,
     "type": "'in-app' | 'outbound-channel'"
    },
    {
     "name": "targetMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "reason",
     "optional": true,
     "type": "string"
    },
    {
     "name": "replacedBadgeId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "code",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "BadgeTemplateFieldSet",
   "fields": [
    {
     "name": "visitorName",
     "optional": false,
     "type": "true"
    },
    {
     "name": "hostName",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "company",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "date",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "validityWindow",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "checkOutCode",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "BadgeTypeBand",
   "fields": [
    {
     "name": "visitorType",
     "optional": false,
     "type": "VisitorType"
    },
    {
     "name": "stripToken",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "BadgeTemplate",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "{ ar: string; en: string }"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'draft' | 'active' | 'retired'"
    },
    {
     "name": "appliesTo",
     "optional": false,
     "type": "VisitorType[]"
    },
    {
     "name": "fields",
     "optional": false,
     "type": "BadgeTemplateFieldSet"
    },
    {
     "name": "bands",
     "optional": false,
     "type": "BadgeTypeBand[]"
    },
    {
     "name": "layoutDefault",
     "optional": false,
     "type": "'rtl-first' | 'ltr-first'"
    },
    {
     "name": "layoutVariantForLatinVisitors",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "stockSize",
     "optional": false,
     "type": "'adhesive-standard' | 'card-standard'"
    },
    {
     "name": "nameLengthBudget",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 board first-run",
   "\"No visits yet today. Load the sample day — four visits with a badge correction to explore — or pre-register your first guest.\"",
   "\"لا زيارات بعد اليوم. حمّل يوم العيّنة — أربع زيارات مع تصحيح بطاقة للاستكشاف — أو سجّل مسبقاً ضيفك الأول.\"",
   "Load sample day / Pre-register a guest",
   "S1 board quiet-day (after activity)"
  ],
  "loading": [
   "S1 board skeleton",
   "three zone skeletons + \"Loading today's visits…\" (SR)",
   "هياكل المناطق الثلاث + \"جارٍ تحميل زيارات اليوم…\"",
   "Kiosk code lookup",
   "inline field pulse ≤300ms; then result"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (code not found)",
   "\"That code isn't in today's visits — check the six characters on your invitation, or continue as a walk-in below.\"",
   "\"هذا الرمز ليس في زيارات اليوم — تحقق من الأحرف الستة في دعوتك، أو تابع كزائر غير مسجّل أدناه.\"",
   "VALIDATION (window elapsed)"
  ],
  "success": [
   "Check-in committed (kiosk)",
   "\"Welcome, Noura — Khalid has been told you're here.\"",
   "\"أهلاً بك يا نورة — أُخبر خالد بأنك هنا.\"",
   "Check-in committed (desk mirror)",
   "\"Noura Al-Qahtani checked in at 11:02 — host notified.\""
  ]
 },
 "briefLine": "The unique feature is the badge spec. Every badge the product issues is rendered from a versioned template the office admin designs once: which fields appear (visitor name in the visitor's own script, host name, company, date, validity window), the layout grammar for dual-script rendering (RTL-first field order with bidi-isolated Latin runs), the visitor-type color band (guest, vendor, contractor, interview candidate, VIP), and the check-out code that travels on the badge. The badge lifecycle is modeled as data, not as a print event: a badge is *ready* when check-in completes, *issued* when the desk or kiosk confirms delivery (printed or shown as an on-screen pass), and *voided* by check-out, end-of-day expiry, or correction — a misspelled name voids the old badge and issues a replacement with the correction chained to the original (the audit instinct the portfolio's custody products share, applied to lobby artifacts). Pre-registration and host notify complete the loop the roster names: an invitation carries the visit window, the purpose, the host, and a check-in code; at arrival the host is notified through the workspace's notification channel, and the notification is a recorded event on the visit timeline — who was told, when, through which channel — because \"the host knows you're here\" is a check-in system's core promise, not a side effect."
} as const;
export type Spec = typeof SPEC;
