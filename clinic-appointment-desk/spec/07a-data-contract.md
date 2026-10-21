# 07a — Data Contract: clinic-appointment-desk

SME-G pass · Backend-agnostic. **AI declaration (ai-native-patterns §1): declared non-AI** — no generation, inspection, clustering, or transformation operations exist anywhere in this contract; the waitlist ranking and no-show flags are deterministic arithmetic over clinic-configured rulesets (rendered inspectable in S8). TypeScript declarations for every entity follow; 07b composes them into operation signatures.

```ts
export type Locale = 'ar' | 'en';
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

export type AppointmentState =
  | 'booked' | 'confirmed' | 'checked-in' | 'in-consult' | 'completed'
  | 'no-showed' | 'cancelled';

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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed'
    | 'cancelled' | 'expired';            // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                      // per-kind partial policy (07b rules)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                 // async-contract §5
}

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
```

## Relationships

ClinicSettings 1—1 Workspace · Workspace 1—N Provider · Workspace 1—N VisitType · Workspace 1—N Patient · Provider 1—N Appointment · Patient 1—N Appointment · VisitType N—M Provider (visitTypeIds) · Appointment 1—N OutboundMessage (ladder) · Patient 1—N WaitlistEntry · WaitlistEntry 1—N WaitlistOffer · WaitlistFill 1—N WaitlistOffer · WaitlistOffer 1—0..1 OutboundMessage (offer message) · Appointment 1—0..1 WaitlistFill (triggering cancellation/no-show) · Appointment 0..1—1 Appointment (rescheduledFrom chain) · Job spans message-batch/fill-run/export work · ExportArtifact renders a date's Appointment state.

## State obligations (lifecycle invariants)

- **Appointment lifecycle order**: `booked → confirmed → checked-in → in-consult → completed` is the only forward walk; `booked/confirmed → cancelled` and `booked/confirmed → no-showed` are terminal-with-refill transitions; `no-showed → checked-in` is allowed same-day as a **correction event** (late patient, 03 CP-2 edge) — appended to the timeline, never a rewrite; completed/cancelled are terminal.
- **The timeline is append-only**: every state change appends actor+timestamp+state; corrections and overrides are new entries with notes; history is never edited or compacted (P17 posture).
- **No-show stats are derived, never stored as authorless truth**: `patient.derived.noShowCountWindow` recomputes from the trailing window against `NoShowPolicy` at read; a flag is never hand-set or hand-cleared.
- **The flag never blocks**: `NoShowPolicy.bookingBehavior` is `'notice-only'` at v1 — no operation may refuse a booking because a flag is active (00 promise, enforced at 07b validation).
- **Waitlist fills are immutable snapshots**: `candidates` and `policyVersion` freeze at computation; a re-run creates a new fill; offers append to their fill; `respondWaitlistOffer` mutates only the offer state and books the appointment — it never rewrites the ranking.
- **Offer boundedness**: a fill carries at most `maxOffersPerSlotPerRun` offers (default 3); declined/expired offers advance to the next candidate; a declined offer never penalizes the entry for other slots.
- **Duration freeze**: an appointment keeps its booked `durationMinutes` even if the visit type later changes (03 CP-5 edge) — overlap arithmetic always uses the appointment's frozen value.
- **PHI invariants**: appointment ids are opaque; `reasonForVisitNote` and `staffNote` render only in S3 and never appear in exports, toasts, announcements, message payloads, or job results (a11y-baseline §7 + 08 privacy boundary).
- **Partial-result policies**: message batches deliver sent-so-far + named failed messages with per-message retry; exports deliver per-format partial with per-format retry (async-contract §4); fill runs are atomic synchronous computations.
- **No provider names anywhere** — the outbound channel appears as an abstract capability (08); templates reference the clinic and appointment facts only.
