# 07a — Data Contract: field-service-dispatch

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — every operation is deterministic dispatch state-machine logic; no operation generates, scores, ranks, or transforms content by model; no AI affordance may appear in any surface built on this contract. TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type JobCategory =
  | 'ac' | 'plumbing' | 'electrical' | 'appliance' | 'cleaning' | 'handyman';
export type JobPriority = 'routine' | 'urgent' | 'emergency';

/** The job-card lifecycle — the product's law. Legal transitions are
 *  enumerated in JobTransition and validated by the adapter (07b); the
 *  UI renders only legal next actions (06 StateTransitionBar). */
export type JobState =
  | 'draft'            // created, unscheduled
  | 'scheduled'        // window + technician assigned
  | 'customer-confirmed' // a booking/day-of touchpoint is currently confirmed
  | 'en-route'         // dispatched; arrival notice sent
  | 'on-site'          // technician checked in
  | 'in-progress'      // work started
  | 'paused'           // work paused with a reason
  | 'work-done'        // technician completed; completion sign-off pending
  | 'closed'           // terminal: sign-off recorded
  | 'cancelled'        // terminal
  | 'no-show'          // terminal: customer absent after arrival
  | 'rescheduled';     // transient: superseded by the new scheduled state

export type JobTransitionAction =
  | 'schedule'          // draft|rescheduled -> scheduled (window + technician)
  | 'reschedule'        // scheduled|customer-confirmed -> rescheduled -> scheduled
  | 'dispatch'          // customer-confirmed|scheduled+waived -> en-route (GATED)
  | 'check-in'          // en-route -> on-site
  | 'start'             // on-site -> in-progress
  | 'pause'             // in-progress -> paused (reason required)
  | 'resume'            // paused -> in-progress
  | 'complete'          // in-progress|paused -> work-done
  | 'close'             // work-done -> closed (GATED: completion sign-off)
  | 'cancel'            // draft|scheduled|customer-confirmed|en-route -> cancelled
  | 'mark-no-show';     // en-route|on-site -> no-show

export type TouchpointKind =
  | 'booking'           // requested when the job is scheduled
  | 'day-of'            // reminder before the visit window
  | 'arrival-notice'    // sent on dispatch (en-route)
  | 'completion-sign-off'; // requested when work-done

export type TouchpointState =
  | 'pending'
  | 'confirmed'
  | 'declined'
  | 'unanswered'        // terminal manual outcome: no reply by expiry
  | 'expired'           // derived at read: pending past expiresAt (fixed clock)
  | 'superseded';       // replaced by a newer touchpoint (reschedule/re-request)

export type TouchpointVia = 'channel' | 'phone-manual' | 'staff-attest' | 'link';

export interface VisitWindow {
  date: string;         // ISO date (Gregorian; Hijri is presentation, P24)
  start: string;        // HH:mm, workspace timezone
  end: string;          // HH:mm, >= start + workspace minimum minutes
}

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;
  confirmationPolicy: {
    autoRequestBooking: boolean;       // request booking confirmation on schedule
    dayOfReminder: boolean;            // auto-request day-of touchpoint
    dayOfLeadMinutes: number;          // when the day-of reminder is requested
    bookingExpiryLeadMinutes: number;  // touchpoint expiry = window.start - lead
    dayOfExpiryLeadMinutes: number;
  };
  minimumWindowMinutes: number;        // schedule validation floor
  laneOrder: string[];                 // technicianIds, board lane rendering order
  clock: string;                       // fixed ISO instant the board renders "now" from
}

export interface Customer {
  id: string;
  nameAr: string;
  nameEn?: string;
  phone: string;                       // E.164-ish storage; renders never-flipped
  district?: string;
  address?: string;                    // free text, own-script rendering
  preferredLocale: Locale;             // touchpoint copy locale
  note?: string;
  archived: boolean;                   // never deleted: history must keep naming
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  nameAr: string;
  nameEn?: string;
  phone?: string;
  skills: JobCategory[];
  duty: 'on-duty' | 'off-duty';        // manually set; shift plans are another product (LOOP-3)
  active: boolean;                     // deactivated techs stay named on history forever
  createdAt: string;
}

/** Plain-text asset reference — the LOOP-3 boundary with
 *  asset-register-tracker: a tag string, never a shared entity or custody write. */
export interface AssetReference {
  tag?: string;        // e.g. "AST-0107" — free text, bidi-isolated rendering
  note?: string;
}

export interface JobCard {
  id: string;
  code: string;                        // JOB-#### — sequential, never reused
  workspaceId: string;
  customerId: string;
  technicianId?: string;               // set by schedule; cleared only by reschedule-to-unassigned
  titleAr: string;
  titleEn?: string;
  category: JobCategory;
  priority: JobPriority;
  window?: VisitWindow;                // required for every state past draft
  problemNote?: string;
  completionNote?: string;
  asset?: AssetReference;              // plain text (LOOP-3)
  addressOverride?: string;
  state: JobState;
  rescheduleCount: number;
  unconfirmedDispatch?: { reason: string; by: string; at: string }; // honest bypass, permanent
  version: number;                     // optimistic concurrency
  createdAt: string;
  updatedAt: string;
}

/** Append-only lifecycle evidence. Corrections are new events; history is never edited. */
export interface JobStateEvent {
  id: string;
  jobCardId: string;
  from: JobState;
  to: JobState;
  action: JobTransitionAction;
  actorMemberId: string;               // dispatcher/owner; or technician memberId via mobile
  actorNameAr: string;                 // rendered name on exports (bilingual)
  actorNameEn?: string;
  source: 'board' | 'mobile' | 'touchpoint';
  note?: string;                       // pause reason / completion note / cancel reason
  at: string;
}

export interface ConfirmationTouchpoint {
  id: string;
  jobCardId: string;
  kind: TouchpointKind;
  state: TouchpointState;
  via: TouchpointVia;                  // how the outcome was recorded
  requestedAt: string;
  requestedBy: string;                 // memberId
  expiresAt: string;                   // fixed formula per kind + policy
  resolvedAt?: string;
  resolvedBy?: string;                 // memberId (manual) or 'channel'
  replyNote?: string;                  // free text when recorded manually
  supersededById?: string;             // link to the replacement touchpoint
}

export type JobKind = 'confirmation-send' | 'day-sheet-export' | 'job-history-export';

export interface Job<T> {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed'
    | 'cancelled' | 'expired';         // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;              // async-contract §5
}

export interface ExportArtifact {
  id: string;
  kind: 'day-sheet' | 'job-history';
  jobId: string;
  locale: Locale;                      // artifact rendering locale
  expiresAt: string;                   // declared retention window at creation
  regenerable: boolean;
}

export interface ActivityEntry {       // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'job-created' | 'job-scheduled' | 'job-rescheduled' | 'job-dispatched'
    | 'unconfirmed-dispatch-recorded' | 'job-checked-in' | 'job-started'
    | 'job-paused' | 'job-resumed' | 'job-completed' | 'job-closed'
    | 'job-cancelled' | 'no-show-recorded'
    | 'touchpoint-requested' | 'touchpoint-resolved'
    | 'customer-created' | 'customer-updated' | 'technician-created'
    | 'technician-updated' | 'settings-changed' | 'export-run';
  targetRef: string;
  detail?: string;
  at: string;
}
```

## Relationships

Workspace 1—N Technician / Customer / JobCard · Customer 1—N JobCard · Technician 1—N JobCard (lane membership per day) · JobCard 1—N JobStateEvent (append-only) · JobCard 1—N ConfirmationTouchpoint (one active touchpoint per kind at a time; reschedule supersedes) · Job 1—N ExportArtifact · ActivityEntry references all consequential mutations.

## State obligations (lifecycle invariants)

- **The state machine is the contract**: only `JobTransitionAction` edges are legal; any other transition attempt returns VALIDATION naming the current state and the attempted action (07b rule 1). Terminal states (`closed`, `cancelled`, `no-show`) never reopen — needed work is a NEW job card.
- **The dispatch gate**: `dispatch` requires the job's latest booking-or-day-of touchpoint to be `confirmed`, OR a recorded `unconfirmedDispatch` with reason. Both paths are data; neither is silent (07b rule 2).
- **The close gate**: `close` requires a `completion-sign-off` touchpoint resolved `confirmed` (customer reply) or via `staff-attest` (named member, timestamp) — an attested operational record, never a contractual e-signature claim (mirrors asset-register-tracker's 12 Q-5 posture).
- **History is append-only**: JobStateEvent and touchpoint resolutions are never edited or deleted; corrections are new records. Cancelled jobs keep every event.
- **Reschedule supersedes, never deletes**: a reschedule increments `rescheduleCount`, moves the job through `rescheduled` to `scheduled`, and marks the prior confirmed/pending touchpoints `superseded` with a link to the new booking touchpoint.
- **Expiry is derived, recorded states are not**: `expired` is computed at read (`pending` past `expiresAt` against the fixed clock); `unanswered` is a recorded manual outcome. Both are terminal for the touchpoint; a late customer reply still lands as a resolution event on the timeline (03 CP-3 edge) but does not rewind job state.
- **Codes and names are permanent**: job codes are sequential and never reused; customers and technicians are archived/deactivated, never deleted — every event names real people forever (custody-grade integrity for dispute exports, 02 Basma).
- **Windows are validated at schedule time**: minimum-length floor and same-technician overlap check (interval arithmetic; travel time explicitly NOT modeled — 10/Q-13); off-duty technicians refuse assignment.
- **Partial-result policies**: confirmation-send jobs deliver per-recipient outcomes with named failures (per-item retry); exports are all-or-nothing per artifact with regeneration. Idempotency keys on `schedule`, `requestConfirmation`, and both export submits (07b rule 7).
- **No provider names anywhere**: the messaging path appears as `via: 'channel'` and an abstract need in 08; the phone-manual path is a first-class citizen by contract.
