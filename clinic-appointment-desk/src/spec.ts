// GENERATED from specs-source/clinic-appointment-desk/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "clinic-appointment-desk",
 "title": "Clinic Appointment Desk",
 "family": "specialized",
 "tier": 3,
 "flagship": false,
 "adapter": "ClinicAppointmentAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Sihha Leaf",
  "pairing": "P15",
  "radius": "14px",
  "elevation": "soft-lift",
  "icon": "filled-rounded",
  "motion": "calm",
  "fonts": [
   "Mada",
   "Instrument Sans"
  ],
  "primary": "#5B8944",
  "accent": "#2F5A14",
  "canvas": "#1C241F"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Today board",
   "purpose": "the operating day: provider columns × time ruler, appointment blocks, day summary bar, filters, booking entry",
   "shell": "",
   "data": "listAppointments, listProviders, getAppointment, checkInAppointment, completeAppointment, markNoShow, updateAppointment",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Booking flow (overlay)",
   "purpose": "patient find-or-create → visit type → slot picker → confirm; no-show flag surface; waitlist alternative",
   "shell": "",
   "data": "listPatients, createPatient, getPatient, listVisitTypes, listProviders, listAppointments, createAppointment, addWaitlistEntry",
   "archetype": "list-console"
  },
  {
   "id": "S3",
   "name": "Appointment detail (drawer)",
   "purpose": "lifecycle timeline, reminder ladder, waitlist-fill provenance, staff note",
   "shell": "",
   "data": "getAppointment, updateAppointment, cancelAppointment, rescheduleAppointment, getWaitlistFill",
   "archetype": "list-console"
  },
  {
   "id": "S4",
   "name": "Waitlist console",
   "purpose": "entries with tier/window/age; fill proposals with ranked candidates and inputs; offer states",
   "shell": "",
   "data": "listWaitlistEntries, removeWaitlistEntry, runWaitlistFill, getWaitlistFill, respondWaitlistOffer, sendMessage",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "Messages outbox",
   "purpose": "outbound records with states and locale marks; batch send; record-reply; call-script path",
   "shell": "",
   "data": "listMessages, sendMessage, recordMessageReply",
   "archetype": "list-console"
  },
  {
   "id": "S6",
   "name": "Patient view",
   "purpose": "contact, locale, history, no-show stats + pattern flag, waitlist entries",
   "shell": "",
   "data": "getPatient, updatePatient, listAppointments, listWaitlistEntries",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Schedule",
   "purpose": "providers (bilingual names, session hours, working-days mask), visit types (duration, labels)",
   "shell": "",
   "data": "createProvider, listProviders, updateProvider, createVisitType, listVisitTypes, updateVisitType",
   "archetype": "calendar-grid"
  },
  {
   "id": "S8",
   "name": "Policies",
   "purpose": "the inspectable deterministic rules: reminder ladder + templates, no-show policy, waitlist weights; workspace locale",
   "shell": "",
   "data": "getClinicSettings, updateClinicSettings, getSession",
   "archetype": "settings-admin"
  },
  {
   "id": "S9",
   "name": "Day sheet export",
   "purpose": "printable board + per-provider lists + counts; artifact history",
   "shell": "",
   "data": "exportDaySheet, getArtifact, listJobs",
   "archetype": "board"
  },
  {
   "id": "S10",
   "name": "Jobs console",
   "purpose": "message batches, fill runs, exports — cancel/retry, link-to-context",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S11",
   "name": "Command palette (overlay)",
   "purpose": "bilingual search across patients/appointments/waitlist/providers/jobs",
   "shell": "",
   "data": "client-side over S1/S4/S5/S6/S7 data",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — Run the day (the operating surface)",
   "steps": [
    "*Trigger: the clinic day itself; Reem lives on the day board from 07:30 to close.",
    "The provider walks the patient in; he or Reem marks in-consult → completed from the block or the detail drawer. completeAppointment",
    "She edits a staff note or corrects the visit type; baseVersion guards concurrent edits (the evening desk's session included). updateAppointment"
   ]
  },
  {
   "title": "CP-3 — Cancellation → waitlist auto-fill → offer accepted (the signature flow)",
   "steps": [
    "*Trigger: a patient cancels (call, message reply, or walk-in), or CP-2 declares a no-show with usable remaining time.",
    "Meanwhile a second patient on the phone says \"call me if anything opens\" → she adds the entry from the same surface. addWaitlistEntry · listWaitlistEntries"
   ]
  },
  {
   "title": "CP-4 — Reminder ladder and confirmation capture (the daily sweep)",
   "steps": [
    "*Trigger: the evening sweep (Yasmin) and the automatic ladder cadence (T-48h and same-day defaults, clinic-configurable).",
    "The reply is \"I can't make it\" → she records declined; the cancellation path runs (CP-3) with the reply as provenance. cancelAppointment",
    "The appointment detail shows the ladder: each step's state and the reply, so the morning desk knows which patients confirmed. getAppointment"
   ]
  },
  {
   "title": "CP-5 — Schedule, policies, exports, and jobs (administration)",
   "steps": [
    "*Trigger: Maha's setup week and the monthly rhythm; the morning huddle needs the day sheet.",
    "Visit types: code, bilingual label, duration minutes, session-fit rules. createVisitType · listVisitTypes · updateVisitType",
    "Patient-record corrections (name spelling, locale, phone) with the history intact. listPatients · updatePatient",
    "Jobs/activity console: message batches, fill runs, exports with state, cancel/retry, link-to-context (T3 consolidation per async-contract §7). listJobs",
    "Session settings: workspace locale (ar/en — the whole console flips, 05 direction model). getSession"
   ]
  }
 ],
 "components": [
  {
   "name": "DayBoard",
   "purpose": "the operating surface: provider columns × time ruler, appointment blocks, gaps readable at a glance",
   "obligations": "Grid semantics per P18 (arrow navigation column-then-time, focus visible at 2.4.11/2.4.13 strength); ruler times at 700 display weight, Western numerals, tabular figures; >200 blocks per day virtualize per column (P19) with focus preserved and row-count context on region entry; sticky day-summary bar never covers focus (scroll-margin token); at 360px collapses to single-provider card list (09 reflow); direction flip mirrors column order and ruler flow, time values never reorder (rtl-rules §2)"
  },
  {
   "name": "AppointmentBlock",
   "purpose": "one appointment in the board: patient name (bidi-isolated, own direction), visit-type color mark, lifecycle state chip, confirmation chip, no-show flag glyph when active",
   "obligations": "State always icon+text+color (05 contracts — never color alone); flagged blocks carry the flag glyph at 24px minimum target (2.5.8); patient names truncate at word boundaries (no hyphenation exists — rtl-rules §4, worst-case strings in 09); the optional reason-for-visit never renders here (PHI discipline, 04); block press ≤80ms tactile confirm; state flips pair a text delta + polite announcement (a11y-baseline §4)"
  },
  {
   "name": "SlotPicker",
   "purpose": "booking-time free-slot grid per provider: session hours as rows, free/occupied/filtered marks",
   "obligations": "Free slots are buttons with time + duration text (never color-only); duration-fit filtering disclosed (\"الفترات الأقصر من مدة الزيارة مخفية\" — why hidden); conflict-marked slots name the occupying appointment when focused; keyboard-complete selection (arrow grid + Enter); selected slot carries the leaf-tint fill + leaf-deep border (05 contracts); same-day slots render the time-until marker in text"
  },
  {
   "name": "PatientFinder",
   "purpose": "search-or-create control: normalized bilingual search (rtl-rules §4 — alef/hamza, taa marbuta, yaa forms, tashkeel stripped), phone exact-match, \"2 patients share this number\" disclosure, recents",
   "obligations": "Combobox semantics with visible listbox; results grouped (matched-name / matched-phone / create-new); each result row shows name at its own direction + phone masked; create-new is a persistent action, never a fallback trap; ⌘V lands focus in the field from anywhere in the booking overlay; search normalization disclosed in the panel (what was matched)"
  },
  {
   "name": "NoShowFlagChip",
   "purpose": "the pattern-flag surface: count + trailing window + policy link (\"وسم نمط عدم الحضور: 3 في آخر 180 يوماً\")",
   "obligations": "Icon+text+color always (red family, 4.80:1 text contract); tooltip/panel discloses the rule (threshold, window) and the appointment list behind the count (Maha's verify-before-believe demand, 02); the chip never blocks actions (00) — it informs; screen-reader text carries the full count phrase, not just \"flagged\"; PHI: the panel lists appointment dates and states only, never reasons"
  },
  {
   "name": "WaitlistPanel",
   "purpose": "the signature surface: entries list (tier, waited-days, window, age) + the fill proposal with ranked candidates and per-row ranking inputs",
   "obligations": "Ranked rows are focusable listitems; every input renders as text (tier, days, penalty, total) — the formula disclosure is the defensibility promise (00); offer actions per row (send/record-decline); expiry countdown in text (Western numerals); out-of-order override requires an explicit reason field (recorded); declined/expired states icon+text; the offer card carries the 16px deepest soft-lift (05); candidate rows render patient names bidi-isolated"
  },
  {
   "name": "LadderTimeline",
   "purpose": "reminder ladder per appointment: steps with states (scheduled, sent, replied-confirmed, replied-declined, replied-change, expired, failed) and record-reply actions",
   "obligations": "Timeline semantics as an ordered list; each step's state icon+text; record-reply is a dialog with outcome radio-group + phone-script copy button; ladder never auto-cancels (staff decides — 03 CP-4); step updates announce politely; template locale mark visible per step (ar/en)"
  },
  {
   "name": "PolicyRulesPanel",
   "purpose": "the inspectable-rules surface: reminder ladder cadence + templates, no-show policy (window, threshold, behavior), waitlist weights (tier points, waited-day points, penalty cap, expiry minutes, max offers)",
   "obligations": "Every rule renders value + plain-language explanation (bilingual, per S8); edit confirm shows the DiffView of old→new values (P04 level 2 — policy changes name what changes); mid-day edits apply forward-only (03 CP-5 edge, stated in the confirm); templates edit with autosave (P10) + per-locale columns (P23); the ranking formula renders with its weights inline so the waitlist panel and the policy panel never disagree"
  },
  {
   "name": "DaySummaryBar",
   "purpose": "the day header: six counts (booked/confirmed/checked-in/completed/no-showed/cancelled), fill-rate, dual Hijri/Gregorian date (P24), week stepper",
   "obligations": "Counts as text with tabular figures; large display numerals qualify for the primary's 3.78:1 large-text exception only at ≥24px/700 (05), otherwise ink; date cross-references Hijri↔Gregorian on hover/focus with conversion disclosure (Umm al-Qura presentation for KSA contexts, portfolio Q-5); week stepper arrows flip in RTL (icon-flip decision); the bar is the polite live region for count deltas (announcements pair with visible numbers)"
  },
  {
   "name": "CallScriptCard",
   "purpose": "the manual path's dignity: copyable bilingual script per outbound intent (reminder, waitlist offer, confirmation request) with patient-locale rendering and the clinic's policy line",
   "obligations": "Copy action announced with what was copied; script text renders per patient locale with bidi isolation for embedded times/numbers; the card states the honest path (\"أرسلها عبر القناة إن كانت مربوطة — أو اتصل واقرأ النص ثم سجّل النتيجة\"); zero network dependency (LOOP-5: the tested default path); scripts pull template text from policy (single source — templates edited once)"
  }
 ],
 "ops": [
  "getSession",
  "createProvider",
  "listProviders",
  "updateProvider",
  "createVisitType",
  "listVisitTypes",
  "updateVisitType",
  "createPatient",
  "listPatients",
  "getPatient",
  "updatePatient",
  "createAppointment",
  "listAppointments",
  "getAppointment",
  "updateAppointment",
  "cancelAppointment",
  "rescheduleAppointment",
  "checkInAppointment",
  "markNoShow",
  "completeAppointment",
  "addWaitlistEntry",
  "listWaitlistEntries",
  "removeWaitlistEntry",
  "runWaitlistFill",
  "getWaitlistFill",
  "respondWaitlistOffer",
  "sendMessage",
  "listMessages",
  "recordMessageReply",
  "getClinicSettings",
  "updateClinicSettings",
  "exportDaySheet",
  "getArtifact",
  "listJobs"
 ],
 "entities": [
  {
   "name": "Provider",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "displayNameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "displayNameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "visitTypeIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "sessionHours",
     "optional": false,
     "type": "{ dayOfWeek: number; startMinute: number; endMinute: number }[]"
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
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "VisitType",
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
     "name": "durationMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "Patient",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameParts",
     "optional": false,
     "type": "{ fullAr?: string; fullEn?: string }"
    },
    {
     "name": "phone",
     "optional": false,
     "type": "string"
    },
    {
     "name": "preferredLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "notes",
     "optional": true,
     "type": "string"
    },
    {
     "name": "derived",
     "optional": false,
     "type": "{"
    },
    {
     "name": "noShowCountWindow",
     "optional": false,
     "type": "number"
    },
    {
     "name": "patternFlagActive",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "totalAppointments",
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
   "name": "Appointment",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "patientId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "providerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "visitTypeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "startMinute",
     "optional": false,
     "type": "number"
    },
    {
     "name": "date",
     "optional": false,
     "type": "string"
    },
    {
     "name": "durationMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "state",
     "optional": false,
     "type": "AppointmentState"
    },
    {
     "name": "confirmation",
     "optional": false,
     "type": "'unconfirmed' | 'confirmed' | 'declined'"
    },
    {
     "name": "reasonForVisitNote",
     "optional": true,
     "type": "string"
    },
    {
     "name": "staffNote",
     "optional": true,
     "type": "string"
    },
    {
     "name": "bookedByMemberId",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "WaitlistEntry",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "patientId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "visitTypeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "providerId",
     "optional": false,
     "type": "string | 'any'"
    },
    {
     "name": "windowStart",
     "optional": false,
     "type": "string"
    },
    {
     "name": "windowEnd",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "tier",
     "optional": false,
     "type": "WaitlistTier"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'active' | 'booked' | 'withdrawn'"
    },
    {
     "name": "requestedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "createdReason",
     "optional": true,
     "type": "string"
    },
    {
     "name": "closedAt",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "WaitlistCandidateRow",
   "fields": [
    {
     "name": "entryId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "patientId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "patientName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "inputs",
     "optional": false,
     "type": "{ tier: WaitlistTier; waitedDays: number"
    },
    {
     "name": "noShowCountWindow",
     "optional": false,
     "type": "number; penaltyApplied: number }"
    },
    {
     "name": "score",
     "optional": false,
     "type": "number"
    },
    {
     "name": "eligible",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "ineligibilityReason",
     "optional": true,
     "type": "'window-miss' | 'already-booked' | 'duration-mismatch'"
    }
   ]
  },
  {
   "name": "WaitlistOffer",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "fillId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "entryId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "patientId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "slotRef",
     "optional": false,
     "type": "{ providerId: string; date: string; startMinute: number; durationMinutes: number }"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'pending' | 'accepted' | 'declined' | 'expired' | 'superseded'"
    },
    {
     "name": "sentVia",
     "optional": false,
     "type": "'channel' | 'phone-script'"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "outcomeRecordedBy",
     "optional": true,
     "type": "string"
    },
    {
     "name": "respondedAt",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "WaitlistFill",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "slotRef",
     "optional": false,
     "type": "{ providerId: string; date: string; startMinute: number; durationMinutes: number }"
    },
    {
     "name": "triggeredBy",
     "optional": false,
     "type": "{ kind: 'cancellation' | 'no-show' | 'manual'; appointmentId?: string }"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "candidates",
     "optional": false,
     "type": "WaitlistCandidateRow[]"
    },
    {
     "name": "offers",
     "optional": false,
     "type": "WaitlistOffer[]"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'open' | 'slot-refilled' | 'exhausted' | 'closed'"
    },
    {
     "name": "computedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "OutboundMessage",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "MessageKind"
    },
    {
     "name": "appointmentId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "offerId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "patientId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "templateRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sendPath",
     "optional": false,
     "type": "'channel' | 'phone-script'"
    },
    {
     "name": "state",
     "optional": false,
     "type": "MessageState"
    },
    {
     "name": "scheduledFor",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sentAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "replyRecordedAt",
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
     "type": "'day-sheet'"
    },
    {
     "name": "date",
     "optional": false,
     "type": "string"
    },
    {
     "name": "formats",
     "optional": false,
     "type": "('board-print' | 'provider-lists' | 'day-counts')[]"
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
    },
    {
     "name": "phiPolicy",
     "optional": false,
     "type": "'minimum-facts'"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (sample day offered)",
   "\"لا يوم عيادة محمّلاً بعد. افتح اليوم التجريبي — إلغاء مزروع وقائمة انتظار وتعبئة مرتّبة جاهزة للتجربة.\"",
   "Open sample day / افتح اليوم التجريبي",
   "S1 no-data-after-activity (cleared sample)",
   "\"The sample day is cleared. Real appointments appear here the moment the desk books them.\""
  ],
  "loading": [
   "S1 board skeleton",
   "column-shaped skeleton ×3 + \"Loading the clinic day…\" (SR)",
   "هيكل أعمدة ×3 + \"جارٍ تحميل يوم العيادة…\"",
   "Slot picker compute",
   "\"Finding free slots for Tuesday…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (booking overlap)",
   "\"Dr. Amina already has an appointment 11:00–11:20 that day. Pick another slot — the picker shows every free one.\"",
   "\"لدى د. أمينة موعد 11:00–11:20 في ذلك اليوم. اختر فترة أخرى — المنتقي يعرض كل الفترات الحرة.\"",
   "VALIDATION (required field)"
  ],
  "success": [
   "Appointment booked",
   "\"Booked — 9:40 with Dr. Amina, 20 minutes. The reminder ladder is scheduled.\"",
   "\"تم الحجز — 9:40 مع د. أمينة، 20 دقيقة. سلسلة التذكيرات مجدولة.\"",
   "Check-in",
   "\"Checked in — the block moves to waiting.\""
  ]
 },
 "briefLine": "The unique feature is waitlist auto-fill with no-show pattern flags, and both halves are deterministic by construction. When a cancellation or a declared no-show opens a slot, the waitlist engine computes a ranked list of eligible waitlist entries using a fixed, inspectable formula — priority tier, days waited, and a no-show penalty — and presents the fill proposal to the staff with every ranking input visible. The top candidate gets an offer (sent through the abstract patient-messaging capability when bound, or called by the receptionist from a prepared bilingual script — the manual path is the tested default); offers carry honest expiry (15 minutes for same-day slots), decline or expiry advances to the next candidate, and at most three candidates are offered per slot so the waitlist never becomes a broadcast. The second half is the no-show pattern flag: a per-patient count of no-showed appointments in a trailing window (default: ≥2 in 180 days flags the pattern), surfaced to staff as a chip naming the count and the window, feeding the waitlist ranking penalty, and never blocking a booking — care access beats punitive gates. The flag rules, thresholds, and ranking weights are clinic-configurable data rendered in an inspectable policy panel, the same inspectability grammar as the portfolio's labor-rule guardrails (attendance-shift-planner kinship — judged honestly in 12, no artifact adjacency claimed)."
} as const;
export type Spec = typeof SPEC;
