// GENERATED from specs-source/field-service-dispatch/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "field-service-dispatch",
 "title": "Field Service Dispatch",
 "family": "business_ops",
 "tier": 3,
 "flagship": false,
 "adapter": "FieldServiceDispatchAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Mawqi Teal",
  "pairing": "P15",
  "radius": "8px",
  "elevation": "soft-lift",
  "icon": "outline-geometric",
  "motion": "crisp",
  "fonts": [
   "Mada",
   "Instrument Sans"
  ],
  "primary": "#006F50",
  "accent": "#005236",
  "canvas": "#162525"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Dispatch board",
   "purpose": "the operating day: technician lanes + unassigned lane, drag/keyboard scheduling, day header with tally + dual-calendar chip (P24)",
   "shell": "",
   "data": "getDayPlan, scheduleJobCard, listJobCards, listTechnicians, getSession",
   "archetype": "calendar-grid"
  },
  {
   "id": "S2",
   "name": "Job card detail (drawer/page)",
   "purpose": "lifecycle timeline, touchpoints with states/expiry, notes, customer block, asset reference, dispute-ready export action",
   "shell": "",
   "data": "getJobCard, requestConfirmation, recordTouchpointReply, recordUnconfirmedDispatch, dispatchJobCard, closeJobCard, exportJobHistory",
   "archetype": "jobs-centre"
  },
  {
   "id": "S3",
   "name": "Intake (new job)",
   "purpose": "customer lookup/create + job fields + schedule action",
   "shell": "",
   "data": "listCustomers, createCustomer, createJobCard, updateJobCard, scheduleJobCard",
   "archetype": "calendar-grid"
  },
  {
   "id": "S4",
   "name": "Confirmation queue",
   "purpose": "touchpoint rows by state, expiry sort, phone-outcome recording, unconfirmed-dispatch decision",
   "shell": "",
   "data": "listTouchpoints, recordTouchpointReply, requestConfirmation, recordUnconfirmedDispatch, getDayPlan",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "Jobs register",
   "purpose": "all job cards; filters + saved views (P08); virtualized",
   "shell": "",
   "data": "listJobCards, getJobCard",
   "archetype": "jobs-centre"
  },
  {
   "id": "S6",
   "name": "Customers",
   "purpose": "searchable register + drawer with history and dispute export",
   "shell": "",
   "data": "listCustomers, getCustomer, updateCustomer, createCustomer, exportJobHistory",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Technicians",
   "purpose": "roster, skills, duty, per-day load",
   "shell": "",
   "data": "listTechnicians, createTechnician, updateTechnician",
   "archetype": "list-console"
  },
  {
   "id": "S8",
   "name": "Day sheet & jobs",
   "purpose": "export actions, job list with cancel/retry, artifact links + expiry",
   "shell": "",
   "data": "exportDaySheet, exportJobHistory, getArtifact, listJobs, getUsage",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "locale default, confirmation policy, day-of cadence, minimum window, lane order",
   "shell": "",
   "data": "getWorkspace, updateWorkspace, getSession",
   "archetype": "settings-admin"
  },
  {
   "id": "S10",
   "name": "Technician mobile — My day",
   "purpose": "job-card stack, state actions, offline queue state (P20)",
   "shell": "Technician mobile — My day",
   "data": "getJobCard, checkInJobCard, startJobCard, pauseJobCard, resumeJobCard, completeJobCard, markNoShow",
   "archetype": "review-queue"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — The dispatch run (the signature flow: gate → journey → completion → close)",
   "steps": [
    "The customer confirms completion (reply recorded, or Nora attests on the phone); the job closes. Terminal. recordTouchpointReply · closeJobCard",
    "The card settles into the closed row of the lane with its lifecycle timeline readable in full. getJobCard"
   ]
  },
  {
   "title": "CP-3 — The confirmation queue (Nora's evening and morning sweep)",
   "steps": [
    "Day-of reminders are requested for still-pending jobs (policy cadence, or her bulk action). requestConfirmation",
    "The confirmation tally on the day header updates as she works: \"confirmed 8 of 12 · declined 1 · expired 2 · unanswered 1\" — counts as text, always. getDayPlan"
   ]
  },
  {
   "title": "CP-5 — Board, records, and administration (the daily surface)",
   "steps": [
    "Technicians: roster with skills, duty state, per-day load; create/update (bilingual names, skills, duty). listTechnicians · createTechnician · updateTechnician",
    "Customers: searchable register; customer drawer with full job history and dispute-ready export. listCustomers · getCustomer · updateCustomer",
    "Jobs register: all job cards across states and dates with filters and saved views (P08); virtualized beyond 200 rows (P19). listJobCards · getJobCard",
    "Usage: confirmation sends and exports against the window (P14 — sends surface before sending when a channel is bound; the phone path never meters). getUsage",
    "*Failures: NETWORK mid-list → banner + retry (P20); stale workspace-settings edit → CONFLICT; quota read failure → usage surface degrades to \"last known\".",
    "*Recovery: all list surfaces cursor-paginated and re-fetchable; exports regenerate from current state."
   ]
  }
 ],
 "components": [
  {
   "name": "DispatchBoard",
   "purpose": "the operating day: technician lanes + unassigned lane; drag-and-drop scheduling; day header with dual-calendar chip (P24) + confirmation tally",
   "obligations": "Lane drag has keyboard equivalent (S schedules focused card; ⌘↑/⌘↓ moves card between lanes — 2.5.7); board is a grid of lists semantically (lane = list, card = listitem, SR row-count context on region entry, P19); overlap refusal announces assertively and names both jobs; cards > 40 per day virtualize; tally is always text (\"مؤكدة 8 من 12\") never color-only"
  },
  {
   "name": "JobCardTile",
   "purpose": "the board card: code, title, window, state chip, gate chip, priority mark, customer name",
   "obligations": "State = icon+text+color (05 palette); gate chip is focusable with expiry announced; card is one target for open-detail and a separate visible button for the primary lane action (never nested interactive targets); truncation at word boundaries (rtl-rules §4) with worst-case Arabic titles seeded; Western numerals"
  },
  {
   "name": "LifecycleTimeline",
   "purpose": "append-only event list on the job detail: state events + touchpoint events, actor, timestamp, source (board/mobile/touchpoint)",
   "obligations": "Reverse-chronological with anchored oldest-first toggle; every entry has text (actor + action + time) — never icon-only; timestamps in workspace locale with dual-calendar on hover (P24); keyboard-scrollable list; correction events (e.g., resumed-after-pause) render inline with the event they answer"
  },
  {
   "name": "GateChip",
   "purpose": "the confirmation gate state on a card/touchpoint: awaiting / confirmed / declined / expired / superseded + unconfirmed-dispatch mark",
   "obligations": "Icon+text+color always; expiry countdown as text (\"تنتهي بعد 40 دقيقة\"); the Gate Clears micro-interaction lives here ONLY (05); assertive announcement on gate refusal with the two honest paths as buttons; superseded state renders strikethrough + icon (never color alone)"
  },
  {
   "name": "TouchpointQueueRow",
   "purpose": "one touchpoint in the confirmation queue: customer, job, window, state, channel, expiry, outcome actions",
   "obligations": "Phone-outcome recording is a 3-button inline group (confirmed / declined / unreachable) — one click, no dialog; recording is disabled once terminal (CONFLICT guard surfaces calmly); rows sorted expiry-first; day-of reminder action available per row; queue virtualizes > 200 (P19)"
  },
  {
   "name": "MyDayStack",
   "purpose": "technician mobile: job-card stack ordered by window; active card pinned with current state + next-action button",
   "obligations": "One-thumb: primary action button ≥44×44 (ux-guidelines row 22); state buttons are verbs-with-objects (\"تسجيل الوصول\" not \"موافق\"); pause reasons are one-tap chips + optional note; offline actions queue with per-item state (P20) — queued state visible as text; address/direction rendered own-script isolated; no desktop chrome on this surface"
  },
  {
   "name": "WindowField",
   "purpose": "schedule control: date + start/end with minimum-window validation and conflict feedback",
   "obligations": "Field-linked validation naming the minimum and the conflicting job (03 CP-1); dual-calendar date picker (P24) with active system explicit; times in 24h Western numerals; conflict surface offers the three resolutions (new window / new technician / shorter window) as buttons"
  },
  {
   "name": "DayHeader",
   "purpose": "the board's masthead: date (dual calendar), confirmation tally, lane-load summary, policy link",
   "obligations": "Tally is text counts (confirmed/declined/expired/unanswered); policy link opens the confirmation-policy disclosure at point-of-use (04 IA decision); day navigation prev/next/next-with-pending-gate — all keyboard-reachable"
  },
  {
   "name": "StateTransitionBar",
   "purpose": "the drawer's action bar for the focused job card: the legal next transitions as buttons, illegal ones absent (never disabled-littered)",
   "obligations": "Buttons render only legal transitions per the 07b state machine (adapter is authority — the UI never guesses); each names its gate requirement inline when one applies; destructive transitions (cancel) use P04 level 2 naming the consequence; dispatcher and technician roles see their own action sets"
  }
 ],
 "ops": [
  "getSession",
  "getWorkspace",
  "updateWorkspace",
  "listJobCards",
  "getJobCard",
  "createJobCard",
  "updateJobCard",
  "scheduleJobCard",
  "dispatchJobCard",
  "recordUnconfirmedDispatch",
  "checkInJobCard",
  "startJobCard",
  "pauseJobCard",
  "resumeJobCard",
  "completeJobCard",
  "closeJobCard",
  "cancelJobCard",
  "markNoShow",
  "requestConfirmation",
  "recordTouchpointReply",
  "listTouchpoints",
  "listTechnicians",
  "createTechnician",
  "updateTechnician",
  "listCustomers",
  "createCustomer",
  "updateCustomer",
  "getCustomer",
  "getDayPlan",
  "exportDaySheet",
  "exportJobHistory",
  "getArtifact",
  "listJobs",
  "getUsage"
 ],
 "entities": [
  {
   "name": "VisitWindow",
   "fields": [
    {
     "name": "date",
     "optional": false,
     "type": "string"
    },
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
     "name": "confirmationPolicy",
     "optional": false,
     "type": "{"
    },
    {
     "name": "autoRequestBooking",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "dayOfReminder",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "dayOfLeadMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "bookingExpiryLeadMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "dayOfExpiryLeadMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "minimumWindowMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "laneOrder",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "clock",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Customer",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "phone",
     "optional": false,
     "type": "string"
    },
    {
     "name": "district",
     "optional": true,
     "type": "string"
    },
    {
     "name": "address",
     "optional": true,
     "type": "string"
    },
    {
     "name": "preferredLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
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
   "name": "Technician",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "phone",
     "optional": true,
     "type": "string"
    },
    {
     "name": "skills",
     "optional": false,
     "type": "JobCategory[]"
    },
    {
     "name": "duty",
     "optional": false,
     "type": "'on-duty' | 'off-duty'"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "AssetReference",
   "fields": [
    {
     "name": "tag",
     "optional": true,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "JobCard",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "code",
     "optional": false,
     "type": "string"
    },
    {
     "name": "workspaceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "customerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "technicianId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "titleAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "titleEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "category",
     "optional": false,
     "type": "JobCategory"
    },
    {
     "name": "priority",
     "optional": false,
     "type": "JobPriority"
    },
    {
     "name": "window",
     "optional": true,
     "type": "VisitWindow"
    },
    {
     "name": "problemNote",
     "optional": true,
     "type": "string"
    },
    {
     "name": "completionNote",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "JobStateEvent",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "jobCardId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "from",
     "optional": false,
     "type": "JobState"
    },
    {
     "name": "to",
     "optional": false,
     "type": "JobState"
    },
    {
     "name": "action",
     "optional": false,
     "type": "JobTransitionAction"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "actorNameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "actorNameEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'board' | 'mobile' | 'touchpoint'"
    },
    {
     "name": "note",
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
   "name": "ConfirmationTouchpoint",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "jobCardId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "TouchpointKind"
    },
    {
     "name": "state",
     "optional": false,
     "type": "TouchpointState"
    },
    {
     "name": "via",
     "optional": false,
     "type": "TouchpointVia"
    },
    {
     "name": "requestedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "requestedBy",
     "optional": false,
     "type": "string"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "resolvedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "resolvedBy",
     "optional": true,
     "type": "string"
    },
    {
     "name": "replyNote",
     "optional": true,
     "type": "string"
    },
    {
     "name": "supersededById",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "ExportArtifact",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'day-sheet' | 'job-history'"
    },
    {
     "name": "jobId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "regenerable",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "ActivityEntry",
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
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "targetRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "detail",
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
   "S1 board first-run",
   "\"The board is empty. Add today's first job — or open the sample day and watch a job clear the confirmation gate.\"",
   "\"اللوح فارغ. أضف أول بطاقة عمل لهذا اليوم — أو افتح اليوم العيّنة وشاهد بطاقة تعبر بوابة التأكيد.\"",
   "New job card / Open sample day",
   "S1 no jobs that day"
  ],
  "loading": [
   "S1 board skeleton",
   "lane skeletons + \"Setting up today's board…\"",
   "هيكلية المسارات + \"جارٍ تجهيز لوح اليوم…\"",
   "S4 queue skeleton",
   "queue row skeletons ×8"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (dispatch gate)",
   "\"لا يمكن توزيع JOB-1003 — انتهت صلاحية تأكيد حجزه الساعة 08:00. سجّل تأكيد العميل هاتفياً، أو سجّل توزيعاً غير مؤكد مع سبب.\"",
   "VALIDATION (close gate)",
   "\"JOB-1001 can't close — the completion sign-off is still pending. Wait for the customer's reply, or record a staff attestation.\""
  ],
  "success": [
   "Job scheduled",
   "\"JOB-1005 scheduled — Reda, 12:00–14:00. Booking confirmation requested; it expires at 10:00.\"",
   "\"جُدولت JOB-1005 — رضا، 12:00–14:00. طُلب تأكيد الحجز؛ وينتهي الساعة 10:00.\"",
   "Confirmation link ready",
   "\"رابط التأكيد جاهز — أرسله عبر القناة، أو انسخه للعميل.\""
  ]
 },
 "briefLine": "The unique feature is the job-card lifecycle with customer confirmation touchpoints. The customer-facing half of the lifecycle is modeled as first-class data: a booking confirmation request when the job is scheduled, a day-of reminder before the visit, an arrival notice when the technician is dispatched, and a completion sign-off when the work is done. Each touchpoint is a record with a state (pending, confirmed, declined, superseded, expired, unanswered), a channel (the abstract customer-messaging capability when bound, or a manual phone confirmation the dispatcher records), and an honest expiry. Two gates make the feature structural rather than decorative: a job cannot move to en route without either a confirmed touchpoint or an explicit, reason-recorded unconfirmed-dispatch decision, and it cannot move to closed without a completion sign-off (customer reply, or a staff-attested record when the customer is unreachable). A gate that can be waved through silently is a gate nobody trusts; here the bypass itself becomes data the job card carries forever. The evidence that this matters is the category's own literature: confirmation reminder practice is taught in FSM playbooks and template libraries (ServiceTitan's contractor playbook devotes a chapter to confirming appointments; \"Reply YES to confirm\" is the standard template idiom), and reminder mechanics are the best-evidenced no-show reducer in the research corpus (01)."
} as const;
export type Spec = typeof SPEC;
