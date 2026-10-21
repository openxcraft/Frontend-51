# 07b — Adapter Contract: clinic-appointment-desk (TypeScript, v1)

SME-G pass · `ClinicAppointmentAdapterV1` · The product is **declared non-AI** (ai-native-patterns §1): every operation below is deterministic — the waitlist ranking and no-show flags are arithmetic over `ClinicSettings` rulesets, never model inferences. LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. Types only — no implementation. Entity semantics (ClinicSettings, Provider, VisitType, Patient, Appointment, WaitlistEntry, WaitlistFill, WaitlistOffer, OutboundMessage, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
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
export interface ClinicSettingsPatch {  /* mirrors the 07a policy sub-shapes for patching */ }
```

## Rules (binding)

1. **Determinism honesty (the non-AI declaration, enforced)**: `runWaitlistFill` returns the same candidates for the same slot + waitlist + `policyVersion` on every call; `PatientSummary.derived` recomputes from appointment history — no operation accepts or stores a "score", "probability", or model output anywhere in the contract. Any future assist must go through LOOP-4 owner confirmation FIRST and re-opens the LOOP-10 record.
2. **The overlap rule is hard arithmetic**: `createAppointment`/`rescheduleAppointment` refuse same-provider bookings whose `[startMinute, startMinute+durationMinutes)` intersects an existing non-cancelled appointment → CONFLICT naming both; no overbooking pathway exists (00/12 Q-14).
3. **The flag never blocks**: no operation may fail because `patternFlagActive` is true; `NoShowPolicy.bookingBehavior` is `'notice-only'` at v1 — `createAppointment` returns the appointment with `patternFlagVisible: true` and succeeds (07a invariant).
4. **Lifecycle guards**: state transitions that skip the declared order → VALIDATION naming the required previous state; corrections (`no-showed → checked-in` same-day, via `markNoShow.correctionOf`) append timeline events and recompute derived stats — history is append-only, never rewritten.
5. **Fill immutability + bounded offers**: fills are immutable snapshots keyed to `policyVersion`; `respondWaitlistOffer` mutates only offer state and books the appointment (with `bookWaitlistedEntryId`); a fill carries at most `maxOffersPerSlotPerRun` offers; out-of-rank acceptance requires `overrideReason` and logs an `override-recorded` activity entry; the slot double-filling meanwhile → CONFLICT naming the slot.
6. **Offer lifecycle honesty**: offers expire at their declared `expiresAt` (never silently extended); `superseded` state is set when the slot re-fills by any other path; a declined offer never affects the entry's eligibility for other slots (07a invariant); the phone-script path is a first-class `sendPath` — a message sent by call is `sent`, not failed.
7. **Consent enforcement (capability language only)**: channel sends with the patient-messaging capability unbound succeed as `phone-script` records when `sendPath: 'phone-script'` is requested; a `channel` send with the capability unbound returns PERMISSION naming the capability class in capability language (credential-contract §4) — never a vendor name — and the same surface states the script path (LOOP-5).
8. **Stale-version semantics**: `updateAppointment`, `cancelAppointment`, `rescheduleAppointment`, `updateClinicSettings` with stale `baseVersion` → CONFLICT with both payloads in `details`; `recordMessageReply` with a stale `baseState` → CONFLICT keeping both timestamps.
9. **Idempotency**: booking, reschedule, offer-response, message-send, and export submits carry idempotency keys; a retried submit returns the original result (async-contract §5) — a double-submitted booking never double-books.
10. **Partial results**: message batches deliver sent-so-far + per-message failures with per-message retry; exports deliver per-format partial with per-format retry (async-contract §4); `runWaitlistFill` is atomic and synchronous.
11. **PHI invariants (a11y-baseline §7)**: `reasonForVisitNote` and `staffNote` appear ONLY in `AppointmentDetail` (S3 surface); they never appear in summaries, messages, jobs, artifacts, or errors; validation errors never echo note text; appointment ids are opaque strings.
12. **Typed pagination on every list; cursors opaque; no orphan methods** — the 03 coverage table is the verification (34/34, Critic-checked).
