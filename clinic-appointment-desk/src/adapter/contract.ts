// VERBATIM from specs-source/clinic-appointment-desk/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below. Implementation corrections applied: 1 (see portfolio SPEC_DEFECTS.md; specs-source untouched).
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below are declared
// canonically in 07a and are part of this contract by reference; 07b declares
// only the operational wrappers (summaries, views, jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (lifecycle-order violations, malformed patient/provider/visit-type inputs, self-overlapping session hours, un-offerable slot remainders)
 * 'NOT_FOUND'    -> NotFoundError     (stale appointment/patient/entry/fill/artifact links)
 * 'PERMISSION'   -> PermissionError   (provider/viewer-role attempts on staff mutations, workspace scoping)
 * 'CONFLICT'     -> ConflictError     (concurrent appointment edits, slot double-fill, already-replied messages)
 * 'RATE_LIMIT'   -> RateLimitError    (channel sends when the bound channel meters, export bursts)
 * 'NETWORK'      -> NetworkError      (board/list fetches, outbox polling, artifact delivery)
 * 'UNKNOWN'      -> UnknownError      (typed retry, correlationId)
 */
export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;
  correlationId: string;
  retryable: boolean;
  details?: Record<string, string[]>;
}

export interface Session {
  memberId: string;
  workspaceId: string;
  role: 'owner' | 'frontdesk' | 'provider';
  // owner: everything incl. policies/schedule; frontdesk: booking/day/waitlist/messages/patients,
  // policies read-only; provider: own-day review + consult transitions only (04 §permissions)
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entity summaries (full shapes per 07a) ----

export type Locale = 'ar' | 'en';
export type AppointmentState =
  | 'booked' | 'confirmed' | 'checked-in' | 'in-consult' | 'completed'
  | 'no-showed' | 'cancelled';

export interface ProviderSummary {
  id: string;
  displayNameAr: string;
  displayNameEn: string;
  visitTypeIds: string[];
  sessionHours: { dayOfWeek: number; startMinute: number; endMinute: number }[];
  active: boolean;
}

export interface VisitTypeSummary {
  id: string;
  code: string;
  labelAr: string;
  labelEn: string;
  durationMinutes: number;
  active: boolean;
}

export interface PatientSummary {
  id: string;
  nameParts: { fullAr?: string; fullEn?: string };
  phone: string;                          // masked at display beyond finder/booking contexts
  preferredLocale: Locale;
  derived: {
    noShowCountWindow: number;
    patternFlagActive: boolean;
    totalAppointments: number;
  };
}

export interface AppointmentSummary {
  id: string;                             // opaque — no patient data in ids (a11y-baseline §7)
  patientId: string;
  patientName: string;                    // render-ready, bidi-isolated at display
  providerId: string;
  visitTypeId: string;
  date: string;                           // ISO Gregorian
  startMinute: number;
  durationMinutes: number;                // frozen at booking
  state: AppointmentState;
  confirmation: 'unconfirmed' | 'confirmed' | 'declined';
  patternFlagVisible: boolean;            // board/drawer render the flag glyph (never the reason)
  rescheduledFromId?: string;
  version: number;
}

export interface AppointmentDetail extends AppointmentSummary {
  lifecycle: { state: AppointmentState; at: string; actorMemberId: string;
               note?: string }[];
  ladder: { messageId: string; kind: 'reminder' | 'confirmation-request';
            state: 'scheduled' | 'sent' | 'replied-confirmed' | 'replied-declined'
              | 'replied-change' | 'expired' | 'failed';
            locale: Locale; scheduledFor: string }[];
  fillRef?: { fillId: string; offeredByRank: number };   // provenance when booked from waitlist
  staffNote?: string;
  reasonForVisitNote?: string;            // renders only in S3 (07a PHI invariant)
}

export interface WaitlistEntrySummary {
  id: string;
  patientId: string;
  patientName: string;
  visitTypeId: string;
  providerId: string | 'any';
  windowStart: string;
  windowEnd: string | null;
  tier: 'routine' | 'urgent';
  state: 'active' | 'booked' | 'withdrawn';
  requestedAt: string;
  waitedDays: number;                     // derived at read
  patientPatternFlag: boolean;
}

export interface WaitlistFillView {       // immutable snapshot + live offer states
  fillId: string;
  slotRef: { providerId: string; date: string; startMinute: number; durationMinutes: number };
  triggeredBy: { kind: 'cancellation' | 'no-show' | 'manual'; appointmentId?: string };
  policyVersion: number;
  candidates: {
    entryId: string; patientId: string; patientName: string;
    inputs: { tier: 'routine' | 'urgent'; waitedDays: number;
              noShowCountWindow: number; penaltyApplied: number };
    score: number; eligible: boolean;
    ineligibilityReason?: 'window-miss' | 'already-booked' | 'duration-mismatch'
      | 'provider-mismatch' | 'entry-closed';
  }[];
  offers: {
    offerId: string; entryId: string; patientName: string;
    state: 'pending' | 'accepted' | 'declined' | 'expired' | 'superseded';
    sentVia: 'channel' | 'phone-script';
    expiresAt: string; respondedAt?: string;
  }[];
  state: 'open' | 'slot-refilled' | 'exhausted' | 'closed';
  computedAt: string;
}

export interface MessageRow {
  id: string;
  kind: 'reminder' | 'confirmation-request' | 'waitlist-offer';
  appointmentId?: string;
  offerId?: string;
  patientId: string;
  patientName: string;
  locale: Locale;
  sendPath: 'channel' | 'phone-script';
  state: 'scheduled' | 'sent' | 'replied-confirmed' | 'replied-declined'
    | 'replied-change' | 'expired' | 'failed';
  scheduledFor: string;
  sentAt?: string;
  replyRecordedBy?: string;
  error?: AdapterError;
}

export interface Job<T> {
  id: string;
  kind: 'message-batch' | 'fill-run' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface ClinicAppointmentAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // providers (schedule authoring — S7; owner/frontdesk only)
  createProvider(input: {
    displayNameAr: string; displayNameEn: string;
    visitTypeIds: string[];
    sessionHours: { dayOfWeek: number; startMinute: number; endMinute: number }[];
  }): Promise<Result<ProviderSummary, AdapterError>>;
  listProviders(query: {
    filter?: { active?: boolean; visitTypeId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ProviderSummary>, AdapterError>>;
  updateProvider(id: string, patch: {
    displayNameAr?: string; displayNameEn?: string;
    visitTypeIds?: string[];
    sessionHours?: { dayOfWeek: number; startMinute: number; endMinute: number }[];
    active?: boolean;
  }): Promise<Result<ProviderSummary, AdapterError>>;

  // visit types (S7)
  createVisitType(input: {
    code: string; labelAr: string; labelEn: string; durationMinutes: number;
  }): Promise<Result<VisitTypeSummary, AdapterError>>;
  listVisitTypes(query: {
    filter?: { active?: boolean };
    cursor?: string; limit: number;
  }): Promise<Result<Page<VisitTypeSummary>, AdapterError>>;
  updateVisitType(id: string, patch: {
    labelAr?: string; labelEn?: string; durationMinutes?: number; active?: boolean;
  }): Promise<Result<VisitTypeSummary, AdapterError>>;

  // patients (finder + record — S2/S6; frontdesk/owner; provider sees own-day context only)
  createPatient(input: {
    nameParts: { fullAr?: string; fullEn?: string };   // at least one required
    phone: string;                                      // canonical storage; exact-match key
    preferredLocale: Locale;
    notes?: string;
  }): Promise<Result<PatientSummary, AdapterError>>;
  listPatients(query: {
    search?: string;                    // normalized bilingual (rtl-rules §4); phone exact-match first
    filter?: { patternFlag?: boolean; preferredLocale?: Locale };
    sort: 'updatedAt' | 'createdAt' | 'nameAr';
    cursor?: string; limit: number;
  }): Promise<Result<Page<PatientSummary>, AdapterError>>;
  getPatient(id: string): Promise<Result<PatientSummary & {
    appointmentHistory: AppointmentSummary[];          // states + dates only, never reason notes
    waitlistEntries: WaitlistEntrySummary[];
    flagAppointments: { id: string; date: string; state: AppointmentState }[];  // Maha's verify list
  }, AdapterError>>;
  updatePatient(id: string, patch: {
    nameParts?: { fullAr?: string; fullEn?: string };
    phone?: string;
    preferredLocale?: Locale;
    notes?: string;
  }): Promise<Result<PatientSummary, AdapterError>>;

  // appointments (the day — S1/S2/S3)
  createAppointment(input: {
    patientId: string; providerId: string; visitTypeId: string;
    date: string; startMinute: number;
    reasonForVisitNote?: string; staffNote?: string;
    bookWaitlistedEntryId?: string;      // set when the booking comes from an accepted offer
    idempotencyKey: string;              // async-contract §5 — double-submit never double-books
  }): Promise<Result<AppointmentDetail, AdapterError>>;
  listAppointments(query: {
    date?: string;                       // the board fetches one day
    providerId?: string;
    filter?: { state?: AppointmentState[]; confirmation?: ('unconfirmed' | 'confirmed' | 'declined')[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<AppointmentSummary>, AdapterError>>;
  getAppointment(id: string): Promise<Result<AppointmentDetail, AdapterError>>;
  updateAppointment(id: string, patch: {
    staffNote?: string; visitTypeId?: string;
    baseVersion: number;
  }): Promise<Result<AppointmentDetail, AdapterError>>;
  cancelAppointment(input: {
    appointmentId: string;
    reason: 'patient-cancelled' | 'clinic-cancelled';
    sourceMessageId?: string;            // provenance when a message reply drove it (CP-4.4)
    baseVersion: number;
  }): Promise<Result<AppointmentDetail & { openedSlotRef: {
    providerId: string; date: string; startMinute: number; durationMinutes: number } | null
  }, AdapterError>>;
  rescheduleAppointment(input: {
    appointmentId: string;
    newDate: string; newStartMinute: number; newProviderId?: string;
    reason: 'patient-requested' | 'clinic-requested';
    sourceMessageId?: string;
    baseVersion: number;
    idempotencyKey: string;
  }): Promise<Result<AppointmentDetail, AdapterError>>;
  checkInAppointment(id: string): Promise<Result<AppointmentDetail, AdapterError>>;
  markNoShow(input: {
    appointmentId: string;
    declaredBy: string;                  // memberId — the human who saw the empty chair
    correctionOf?: string;               // when reverting an earlier same-day no-show (correction event)
  }): Promise<Result<AppointmentDetail & { openedSlotRef: {
    providerId: string; date: string; startMinute: number; durationMinutes: number } | null
  }, AdapterError>>;
  completeAppointment(id: string): Promise<Result<AppointmentDetail, AdapterError>>;

  // waitlist (the signature subsystem — S4; runs are synchronous + budget-bound per 10)
  addWaitlistEntry(input: {
    patientId: string; visitTypeId: string;
    providerId: string | 'any';
    windowStart: string; windowEnd?: string | null;
    tier: 'routine' | 'urgent';          // urgent is staff-set only — the adapter never upgrades
    createdReason?: string;
  }): Promise<Result<WaitlistEntrySummary, AdapterError>>;
  listWaitlistEntries(query: {
    filter?: { state?: ('active' | 'booked' | 'withdrawn')[]; tier?: ('routine' | 'urgent')[];
               visitTypeId?: string; providerId?: string | 'any' };
    sort: 'requestedAt' | 'waitedDays';
    cursor?: string; limit: number;
  }): Promise<Result<Page<WaitlistEntrySummary>, AdapterError>>;
  removeWaitlistEntry(input: {
    entryId: string; reason?: string;    // withdrawn-by-patient / closed-by-staff
  }): Promise<Result<WaitlistEntrySummary, AdapterError>>;
  runWaitlistFill(input: {
    slotRef: { providerId: string; date: string; startMinute: number; durationMinutes: number };
    triggeredBy: { kind: 'cancellation' | 'no-show' | 'manual'; appointmentId?: string };
  }): Promise<Result<WaitlistFillView, AdapterError>>;   // deterministic, synchronous, <150ms at seed scale (10)
  getWaitlistFill(fillId: string): Promise<Result<WaitlistFillView, AdapterError>>;
  respondWaitlistOffer(input: {
    offerId: string;
    outcome: 'accepted' | 'declined';
    recordedVia: 'channel-reply' | 'phone-outcome';
    overrideReason?: string;             // REQUIRED when accepting out-of-rank order (recorded, P17)
    idempotencyKey: string;
  }): Promise<Result<{ offer: WaitlistFillView['offers'][number];
    appointment?: AppointmentDetail }, AdapterError>>;

  // outbound messages (S5; the phone-script path is a first-class sendPath — LOOP-5)
  sendMessage(input: {
    kind: 'reminder' | 'confirmation-request' | 'waitlist-offer';
    appointmentId?: string; offerId?: string; patientId: string;
    sendPath: 'channel' | 'phone-script';   // phone-script marks the record sent-by-call
    idempotencyKey: string;
  }): Promise<Result<MessageRow, AdapterError>>;
  listMessages(query: {
    filter?: { state?: MessageRow['state'][]; kind?: MessageRow['kind'][];
               locale?: Locale[]; patientId?: string; date?: string };
    sort: 'scheduledFor' | 'sentAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<MessageRow>, AdapterError>>;
  recordMessageReply(input: {
    messageId: string;
    outcome: 'replied-confirmed' | 'replied-declined' | 'replied-change';
    baseState: MessageRow['state'];         // CONFLICT when the message already carries a reply
  }): Promise<Result<MessageRow, AdapterError>>;

  // policies (S8 — the inspectable deterministic rulesets)
  getClinicSettings(): Promise<Result<ClinicSettingsView, AdapterError>>;
  updateClinicSettings(patch: {
    defaultLocale?: Locale;
    workingDaysMask?: number[];
    reminderLadder?: ClinicSettingsPatch['reminderLadder'];
    noShow?: ClinicSettingsPatch['noShow'];
    waitlist?: ClinicSettingsPatch['waitlist'];
    messageTemplates?: ClinicSettingsPatch['messageTemplates'];
    baseVersion: number;
  }): Promise<Result<ClinicSettingsView, AdapterError>>;

  // exports (S9)
  exportDaySheet(input: {
    date: string;
    formats: ('board-print' | 'provider-lists' | 'day-counts')[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
}

// 07b-local view types (ClinicSettings is canonical in 07a; the view adds rendering aids)
export interface ClinicSettingsView {    // rendered with plain-language explanations in S8
  settings: ClinicSettingsRef;           // canonical shape per 07a (by reference)
  explanations: Record<string, { ar: string; en: string }>;  // per-rule bilingual explanations
  version: number;
  updatedAt: string;
}
export interface ClinicSettingsRef { /* 07a ClinicSettings fields, by reference */ }
export interface ClinicSettingsPatch { reminderLadder?: ReminderLadderPolicy; noShow?: NoShowPolicy; waitlist?: WaitlistPolicy; messageTemplates?: ClinicSettings['messageTemplates']; } // SPEC_DEFECTS D: fields mirrored from ClinicSettings (07a)

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type StaffRole = 'owner' | 'frontdesk' | 'provider';

// ---- Deterministic policy rulesets (all clinic-configurable, all inspectable in S8) ----
export interface ReminderLadderPolicy {
  steps: { offsetHoursBefore: number; kind: 'reminder' | 'confirmation-request' }[];
  // default seed: [{48,'reminder'},{0,'confirmation-request'}] where offset 0 = same-day 08:00 clinic-local
  minStepSpacingHours: number;            // default 4
  bookInsideWindowBehavior: 'send-first-immediately' | 'skip-first';
  cancellationPolicyLine: { ar: string; en: string } | null;  // clinic-authored (evidence: 01 source 7)
}
export interface NoShowPolicy {
  trailingWindowDays: number;             // default 180
  flagThreshold: number;                  // default 2 — count >= threshold flags the pattern
  bookingBehavior: 'notice-only';         // v1: the flag NEVER blocks booking (00)
}
export interface WaitlistPolicy {
  tierPoints: number;                     // default 100 — routine 0 / urgent tierPoints
  waitedDayPoints: number;                // default 2 per full day waited
  waitedDayCapDays: number;               // default 60 — points cap
  noShowPenaltyPoints: number;            // default 10 per trailing no-show
  noShowPenaltyCap: number;               // default 30
  offerExpiryMinutesSameDay: number;      // default 15
  offerExpiryMinutesFuture: number;       // default 120
  maxOffersPerSlotPerRun: number;         // default 3 — never a broadcast (00)
  sameDayRefillFloorMinutes: number;      // default 15 — remainders below are not offerable
}
export interface ClinicSettings {
  workspaceId: string;
  defaultLocale: Locale;                  // console chrome locale (05 direction model)
  workingDaysMask: number[];              // 0=Sunday..6=Saturday; e.g. KSA default [0,1,2,3,4]
  reminderLadder: ReminderLadderPolicy;
  noShow: NoShowPolicy;
  waitlist: WaitlistPolicy;
  messageTemplates: Record<'reminder' | 'confirmation-request' | 'waitlist-offer',
    { ar: string; en: string }>            // clinic-authored per-locale, never machine-translated
  version: number;
  updatedAt: string;
}

// ---- Core entities ----
export interface Provider {
  id: string;
  displayNameAr: string;
  displayNameEn: string;
  visitTypeIds: string[];                 // visit types this provider accepts
  sessionHours: { dayOfWeek: number; startMinute: number; endMinute: number }[];
  // minutes from 00:00 clinic-local; overlap-free (07b validates self-intersection)
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface VisitType {
  id: string;
  code: string;                           // short staff code, e.g. "CONS"
  labelAr: string;
  labelEn: string;
  durationMinutes: number;
  active: boolean;                        // soft-archive: never hard-deleted with future bookings
}
export interface Patient {
  id: string;
  nameParts: { fullAr?: string; fullEn?: string };  // at least one required; each renders at own direction
  phone: string;                          // exact-match finder key; E.164-canonical storage
  preferredLocale: Locale;                // outbound template rendering locale
  notes?: string;                         // desk facts only — never clinical content (LOOP-10)
  // Deterministic derived stats (computed at read; never client-authored):
  derived: {
    noShowCountWindow: number;            // trailing no-shows per NoShowPolicy window
    patternFlagActive: boolean;           // noShowCountWindow >= flagThreshold
    totalAppointments: number;
  };
  createdAt: string;
  updatedAt: string;
}
export interface Appointment {
  id: string;                             // opaque — never carries patient data (a11y-baseline §7)
  patientId: string;
  providerId: string;
  visitTypeId: string;
  startMinute: number;                    // clinic-local minutes from 00:00 of `date`
  date: string;                           // ISO Gregorian date (display may render Hijri per P24)
  durationMinutes: number;                // frozen at booking from the visit type's value then
  state: AppointmentState;
  confirmation: 'unconfirmed' | 'confirmed' | 'declined';
  reasonForVisitNote?: string;            // optional free text; PHI: renders ONLY in S3, never exports/toasts/announcements
  staffNote?: string;                     // desk facts (directions, interpreter needed)
  bookedByMemberId: string;
  rescheduledFromId?: string;             // provenance chain when CP-4.5 moved it
  cancelReason?: 'patient-cancelled' | 'clinic-cancelled' | 'no-show-declared';
  lifecycle: { state: AppointmentState; at: string; actorMemberId: string;
               note?: string }[];         // append-only timeline — corrections are new events
  version: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Waitlist (the signature subsystem) ----
export type WaitlistTier = 'routine' | 'urgent';  // urgent is staff-set only, never auto (00)
export interface WaitlistEntry {
  id: string;
  patientId: string;
  visitTypeId: string;
  providerId: string | 'any';             // flexible entries match any provider who accepts the type
  windowStart: string;                    // earliest acceptable ISO date
  windowEnd: string | null;               // null = open-ended
  tier: WaitlistTier;
  state: 'active' | 'booked' | 'withdrawn';
  requestedAt: string;                    // the waited-days input
  createdReason?: string;
  closedAt?: string;
}
export interface WaitlistCandidateRow {   // one ranked row inside a fill snapshot
  entryId: string;
  patientId: string;
  patientName: string;                    // render-ready, bidi-isolated at display
  inputs: { tier: WaitlistTier; waitedDays: number;
            noShowCountWindow: number; penaltyApplied: number };
  score: number;                          // tierPoints + waitedDayPoints*days(capped) - penalty(capped)
  eligible: boolean;
  ineligibilityReason?: 'window-miss' | 'already-booked' | 'duration-mismatch'
    | 'provider-mismatch' | 'entry-closed';
}
export interface WaitlistOffer {
  id: string;
  fillId: string;
  entryId: string;
  patientId: string;
  slotRef: { providerId: string; date: string; startMinute: number; durationMinutes: number };
  state: 'pending' | 'accepted' | 'declined' | 'expired' | 'superseded';
  sentVia: 'channel' | 'phone-script';    // the manual path is a first-class send method (LOOP-5)
  expiresAt: string;                      // honest expiry per WaitlistPolicy
  outcomeRecordedBy?: string;             // memberId who recorded phone outcome, when applicable
  respondedAt?: string;
}
export interface WaitlistFill {           // immutable snapshot per slot per run
  id: string;
  slotRef: { providerId: string; date: string; startMinute: number; durationMinutes: number };
  triggeredBy: { kind: 'cancellation' | 'no-show' | 'manual'; appointmentId?: string };
  policyVersion: number;                  // the settings snapshot the ranking ran against
  candidates: WaitlistCandidateRow[];     // ranked desc; ties: requestedAt asc, then entryId
  offers: WaitlistOffer[];
  state: 'open' | 'slot-refilled' | 'exhausted' | 'closed';
  computedAt: string;
}

// ---- Outbound messages (reminder ladder + offers + confirmation requests) ----
export type MessageKind = 'reminder' | 'confirmation-request' | 'waitlist-offer';
export type MessageState = 'scheduled' | 'sent' | 'replied-confirmed'
  | 'replied-declined' | 'replied-change' | 'expired' | 'failed';
export interface OutboundMessage {
  id: string;
  kind: MessageKind;
  appointmentId?: string;                 // ladder messages bind to appointments
  offerId?: string;                       // waitlist-offer messages bind to offers
  patientId: string;
  locale: Locale;                         // rendered from the patient's file, per-locale template
  templateRef: string;                    // the policy template version used — provenance
  sendPath: 'channel' | 'phone-script';
  state: MessageState;
  scheduledFor: string;
  sentAt?: string;
  replyRecordedAt?: string;
  replyRecordedBy?: string;               // phone outcomes are recorded by staff (the tested default)
  expiresAt?: string;
  error?: { code: string; correlationId: string };
}

// ---- Jobs, exports, activity ----
export type JobKind = 'message-batch' | 'fill-run' | 'export';
export interface ExportArtifact {
  id: string;
  kind: 'day-sheet';
  date: string;                           // the clinic day the sheet renders
  formats: ('board-print' | 'provider-lists' | 'day-counts')[];
  expiresAt: string;                      // declared retention at creation
  regenerable: boolean;
  phiPolicy: 'minimum-facts';             // names/times/visit types only — never reason notes (08)
}
export interface ActivityEntry {          // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'appointment-booked' | 'appointment-cancelled' | 'appointment-rescheduled'
    | 'check-in' | 'no-show-declared' | 'consult-completed' | 'waitlist-entry-added'
    | 'waitlist-fill-run' | 'offer-sent' | 'offer-outcome-recorded' | 'policy-changed'
    | 'provider-updated' | 'visit-type-updated' | 'patient-updated' | 'message-recorded'
    | 'export-run' | 'override-recorded';
  targetRef: string;
  detail?: string;                        // e.g. ranking override reason, policy version delta
  at: string;
}

