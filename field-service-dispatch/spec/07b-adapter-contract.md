# 07b — Adapter Contract: field-service-dispatch (TypeScript, v1)

SME-G pass · `FieldServiceDispatchAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. Types only — no implementation. Entity semantics (Workspace, Customer, Technician, JobCard, JobStateEvent, ConfirmationTouchpoint, Job, ExportArtifact, ActivityEntry, and their enums) are declared canonically in 07a and are part of this contract by reference; 07b declares only the operational wrappers (summaries, views, day-plan composites, jobs) its signatures need — the house by-reference convention (identifiers duplicated across 07a/07b intentionally; merge strips the aliases). Every operation traces to ≥1 flow (03 coverage table, script-verified).

```ts
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (illegal lifecycle transitions, dispatch/close gate refusals,
 *                                       window minimum + overlap conflicts, malformed intake)
 * 'NOT_FOUND'    -> NotFoundError     (stale job-card / customer / technician / touchpoint / artifact links)
 * 'PERMISSION'   -> PermissionError   (technician-role scoping, workspace boundaries)
 * 'CONFLICT'     -> ConflictError     (concurrent job-card edits, terminal touchpoint double-record, stale settings)
 * 'RATE_LIMIT'   -> RateLimitError    (confirmation sends via bound channel, exports)
 * 'NETWORK'      -> NetworkError      (list fetches, queued writes, export delivery)
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
  role: 'owner' | 'dispatcher' | 'technician';
  // technician: reads own job cards, runs mobile state actions, sees own-job customer contact only.
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (canonical entities per 07a) ----

export type Locale = 'ar' | 'en';
export type JobCategory = 'ac' | 'plumbing' | 'electrical' | 'appliance' | 'cleaning' | 'handyman';
export type JobPriority = 'routine' | 'urgent' | 'emergency';
export type JobState =
  | 'draft' | 'scheduled' | 'customer-confirmed' | 'en-route' | 'on-site'
  | 'in-progress' | 'paused' | 'work-done' | 'closed' | 'cancelled' | 'no-show' | 'rescheduled';
export type TouchpointKind = 'booking' | 'day-of' | 'arrival-notice' | 'completion-sign-off';
export type TouchpointState =
  | 'pending' | 'confirmed' | 'declined' | 'unanswered' | 'expired' | 'superseded';

export interface JobCardSummary {
  id: string;
  code: string;
  customerId: string;
  customerNameAr: string;
  customerNameEn?: string;
  technicianId?: string;
  technicianNameAr?: string;
  titleAr: string;
  titleEn?: string;
  category: JobCategory;
  priority: JobPriority;
  windowDate?: string;                // ISO date; present for every state past draft
  windowStart?: string;               // HH:mm
  windowEnd?: string;
  state: JobState;
  gate: 'awaiting' | 'confirmed' | 'declined' | 'expired' | 'not-required' | 'waived';
  // 'waived' = unconfirmedDispatch recorded (honest bypass, permanent on the card)
  rescheduleCount: number;
  updatedAt: string;
}

export interface TouchpointView {
  id: string;
  jobCardId: string;
  kind: TouchpointKind;
  state: TouchpointState;             // 'expired' derived at read vs the fixed clock
  via: 'channel' | 'phone-manual' | 'staff-attest' | 'link';
  requestedAt: string;
  expiresAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  replyNote?: string;
  supersededById?: string;
}

export interface JobCardDetail extends JobCardSummary {
  problemNote?: string;
  completionNote?: string;
  assetTag?: string;                  // plain text (LOOP-3 boundary — never a registry entity)
  assetNote?: string;
  addressOverride?: string;
  unconfirmedDispatch?: { reason: string; by: string; at: string };
  version: number;
  events: {                           // append-only lifecycle (07a JobStateEvent, summarized)
    id: string; from: JobState; to: JobState; action: string;
    actorNameAr: string; actorNameEn?: string;
    source: 'board' | 'mobile' | 'touchpoint'; note?: string; at: string;
  }[];
  touchpoints: TouchpointView[];
  customer: {
    id: string; nameAr: string; nameEn?: string; phone: string;
    district?: string; address?: string; preferredLocale: Locale;
  };
}

export interface TechnicianSummary {
  id: string;
  nameAr: string;
  nameEn?: string;
  skills: JobCategory[];
  duty: 'on-duty' | 'off-duty';
  active: boolean;
  loadToday?: { date: string; jobCount: number; minutes: number };  // derived at read
}

export interface CustomerSummary {
  id: string;
  nameAr: string;
  nameEn?: string;
  phone: string;
  district?: string;
  preferredLocale: Locale;
  archived: boolean;
  jobCount: number;                   // derived at read
  lastJobAt?: string;
}

export interface DayLane {
  technicianId: string;               // 'unassigned' for the intake lane
  technicianNameAr: string;
  technicianNameEn?: string;
  duty: 'on-duty' | 'off-duty' | 'unassigned';
  jobs: JobCardSummary[];             // ordered by windowStart then code
}

export interface DayPlan {
  date: string;                       // ISO date of the operating day
  hijriLabel: string;                 // presentation-only dual-calendar chip (P24)
  lanes: DayLane[];                   // workspace laneOrder; unassigned lane first
  tally: { confirmed: number; declined: number; expired: number; unanswered: number; pending: number };
  totals: { jobCards: number; techniciansOnDuty: number };
}

export interface JobView<T> {         // operational async wrapper (canonical Job in 07a)
  id: string;
  kind: 'confirmation-send' | 'day-sheet-export' | 'job-history-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;
  jobCardId?: string;                 // context links for the job center
  date?: string;
}

// ---- Contract ----

export interface FieldServiceDispatchAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // workspace
  getWorkspace(): Promise<Result<Workspace, AdapterError>>;
  updateWorkspace(patch: {
    defaultLocale?: Locale;
    confirmationPolicy?: {
      autoRequestBooking: boolean;
      dayOfReminder: boolean;
      dayOfLeadMinutes: number;
      bookingExpiryLeadMinutes: number;
      dayOfExpiryLeadMinutes: number;
    };
    minimumWindowMinutes?: number;
    laneOrder?: string[];
    baseVersion: number;
  }): Promise<Result<Workspace, AdapterError>>;

  // job cards
  listJobCards(query: {
    filter?: {
      state?: JobState[];
      technicianId?: string;
      customerId?: string;
      date?: string;
      priority?: JobPriority[];
      category?: JobCategory[];
      activeOnly?: boolean;           // excludes closed/cancelled/no-show (board default)
    };
    search?: string;                  // normalized bilingual search on code/title/customer (rtl-rules §4)
    sort: 'windowStart' | 'updatedAt' | 'code';
    cursor?: string; limit: number;
  }): Promise<Result<Page<JobCardSummary>, AdapterError>>;
  getJobCard(id: string): Promise<Result<JobCardDetail, AdapterError>>;
  createJobCard(input: {
    customerId: string;
    titleAr: string; titleEn?: string;
    category: JobCategory; priority: JobPriority;
    problemNote?: string;
    assetTag?: string; assetNote?: string;   // plain text (LOOP-3)
    addressOverride?: string;
  }): Promise<Result<JobCardSummary, AdapterError>>;
  updateJobCard(id: string, patch: {
    titleAr?: string; titleEn?: string;
    category?: JobCategory; priority?: JobPriority;
    problemNote?: string; completionNote?: string;
    assetTag?: string; assetNote?: string;
    addressOverride?: string;
    baseVersion: number;
  }): Promise<Result<JobCardSummary, AdapterError>>;

  // lifecycle transitions (the state machine; every one validated + recorded)
  scheduleJobCard(input: {
    jobCardId: string;
    window: { date: string; start: string; end: string };
    technicianId: string | null;      // null = unassign back to intake lane
    idempotencyKey: string;
  }): Promise<Result<JobCardSummary, AdapterError>>;   // draft|rescheduled|scheduled|customer-confirmed -> scheduled
  dispatchJobCard(input: {
    jobCardId: string;                // GATED: latest booking/day-of touchpoint confirmed, or waiver on record
  }): Promise<Result<JobCardSummary, AdapterError>>;   // -> en-route; arrival-notice touchpoint auto-requested
  recordUnconfirmedDispatch(input: {
    jobCardId: string; reason: string;   // mandatory; permanent on the card (the honest bypass)
  }): Promise<Result<JobCardSummary, AdapterError>>;
  checkInJobCard(input: { jobCardId: string }): Promise<Result<JobCardSummary, AdapterError>>;
  startJobCard(input: { jobCardId: string }): Promise<Result<JobCardSummary, AdapterError>>;
  pauseJobCard(input: { jobCardId: string; reason: 'awaiting-customer' | 'awaiting-permission' | 'other'; note?: string }): Promise<Result<JobCardSummary, AdapterError>>;
  resumeJobCard(input: { jobCardId: string }): Promise<Result<JobCardSummary, AdapterError>>;
  completeJobCard(input: { jobCardId: string; completionNote?: string }): Promise<Result<JobCardSummary, AdapterError>>;  // completion-sign-off touchpoint auto-requested
  closeJobCard(input: { jobCardId: string }): Promise<Result<JobCardSummary, AdapterError>>;  // GATED: sign-off confirmed or staff-attested
  cancelJobCard(input: { jobCardId: string; reason: string }): Promise<Result<JobCardSummary, AdapterError>>;
  markNoShow(input: { jobCardId: string; note?: string }): Promise<Result<JobCardSummary, AdapterError>>;  // en-route|on-site only

  // customer confirmation touchpoints (the unique feature's data path)
  requestConfirmation(input: {
    jobCardId: string;
    kind: 'booking' | 'day-of';       // arrival-notice/completion-sign-off ride dispatch/complete (policy)
    idempotencyKey: string;           // double-submit never double-sends (async-contract §5)
  }): Promise<Result<TouchpointView, AdapterError>>;
  recordTouchpointReply(input: {
    touchpointId: string;
    outcome: 'confirmed' | 'declined' | 'unanswered';
    via: 'channel' | 'phone-manual' | 'staff-attest' | 'link';
    replyNote?: string;               // manual path context (e.g. phone outcome)
  }): Promise<Result<TouchpointView, AdapterError>>;   // terminal touchpoint -> CONFLICT naming the outcome
  listTouchpoints(query: {
    filter?: {
      state?: TouchpointState[];      // 'expired' filter matches the derived-at-read state
      kind?: TouchpointKind[];
      date?: string;                  // touchpoint's job window date
      jobCardId?: string;
    };
    sort: 'expiresAt' | 'requestedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<TouchpointView>, AdapterError>>;

  // technicians
  listTechnicians(query: {
    filter?: { skill?: JobCategory[]; duty?: ('on-duty' | 'off-duty')[]; active?: boolean };
    search?: string;
    sort: 'nameAr' | 'loadToday';
    date?: string;                    // load computation date (defaults to workspace day)
    cursor?: string; limit: number;
  }): Promise<Result<Page<TechnicianSummary>, AdapterError>>;
  createTechnician(input: {
    nameAr: string; nameEn?: string; phone?: string; skills: JobCategory[];
  }): Promise<Result<TechnicianSummary, AdapterError>>;
  updateTechnician(id: string, patch: {
    nameAr?: string; nameEn?: string; phone?: string;
    skills?: JobCategory[];
    duty?: 'on-duty' | 'off-duty';
    active?: boolean;                 // deactivate never deletes (07a obligation)
  }): Promise<Result<TechnicianSummary, AdapterError>>;

  // customers
  listCustomers(query: {
    filter?: { archived?: boolean; preferredLocale?: Locale[] };
    search?: string;                  // normalized bilingual (rtl-rules §4)
    sort: 'nameAr' | 'lastJobAt' | 'jobCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CustomerSummary>, AdapterError>>;
  createCustomer(input: {
    nameAr: string; nameEn?: string; phone: string;
    district?: string; address?: string; preferredLocale: Locale; note?: string;
  }): Promise<Result<CustomerSummary, AdapterError>>;
  updateCustomer(id: string, patch: {
    nameAr?: string; nameEn?: string; phone?: string;
    district?: string; address?: string; preferredLocale?: Locale;
    note?: string; archived?: boolean;
  }): Promise<Result<CustomerSummary, AdapterError>>;
  getCustomer(id: string): Promise<Result<CustomerSummary & {
    note?: string;
    jobs: JobCardSummary[];           // history, newest first (dispute drawer, 02 Basma)
  }, AdapterError>>;

  // the board
  getDayPlan(date: string): Promise<Result<DayPlan, AdapterError>>;

  // exports & jobs
  exportDaySheet(input: {
    date: string; locale: Locale;      // per-technician printable day, bilingual by locale
    idempotencyKey: string;
  }): Promise<Result<JobView<{ artifactId: string; expiresAt: string }>, AdapterError>>;
  exportJobHistory(input: {
    jobCardId: string; locale: Locale;  // full timeline + touchpoint audit
    idempotencyKey: string;
  }): Promise<Result<JobView<{ artifactId: string; expiresAt: string }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;
  listJobs(query: {
    filter?: { state?: JobView<unknown>['state'][]; kind?: JobView<unknown>['kind'][]; jobCardId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<JobView<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    confirmationSends: number; exports: number;   // phone-manual path contributes ZERO sends (never metered)
    resetAt: string;
  }, AdapterError>>;

  // Workspace (07a) referenced by getWorkspace/updateWorkspace above.
  // Canonical declarations: Workspace, Customer, Technician, JobCard, JobStateEvent,
  // ConfirmationTouchpoint, Job, ExportArtifact, ActivityEntry.
}
```

## Rules

1. **The state machine is authoritative**: every lifecycle operation validates the transition against the 07a state machine and returns VALIDATION with `details` naming the current state, the attempted action, and the legal next actions when the transition is illegal. Terminal states never reopen; needed work is a new job card.
2. **The dispatch gate**: `dispatchJobCard` on a job whose latest booking-or-day-of touchpoint is not `confirmed` and which carries no `unconfirmedDispatch` record → VALIDATION naming the gate and the two honest paths (record a reply; record the waiver). `recordUnconfirmedDispatch` requires a non-empty `reason`, is idempotent per job-card window, and is permanent — it renders on every later view and export of the card.
3. **The close gate**: `closeJobCard` without a completion-sign-off touchpoint resolved `confirmed` or `staff-attest` → VALIDATION naming the requirement and the attest path. Staff attest records the named member and timestamp — an operational attestation, never a contractual e-signature claim (asset-register-tracker 12 Q-5 posture mirrored).
4. **Role scoping**: technician sessions may read only their own job cards and may run only `checkInJobCard`/`startJobCard`/`pauseJobCard`/`resumeJobCard`/`completeJobCard`/`markNoShow` on their own assigned cards — anything else → PERMISSION naming the scope. Dispatchers and owners run the full surface.
5. **Touchpoint integrity**: `recordTouchpointReply` on a terminal touchpoint → CONFLICT naming the existing outcome (double-processing guard). Resolutions are immutable; corrections are new records. `expired` is derived at read against the fixed clock and never mutated.
6. **Schedule validation**: window shorter than the workspace minimum → VALIDATION naming the minimum; same-technician overlap (`startA < endB && startB < endA`, back-to-back allowed) → VALIDATION naming both job codes and both windows; off-duty technician → VALIDATION naming the duty fact. Travel time is never modeled (LOOP-10; disclosure in 10/Q-13). Reschedule supersedes prior touchpoints (supersededById link) and increments rescheduleCount.
7. **Idempotency**: `scheduleJobCard`, `requestConfirmation`, `exportDaySheet`, `exportJobHistory` carry idempotency keys — a retried submit returns the original result (async-contract §5). State actions are naturally idempotent by state: re-invoking the current state's action is a calm no-op success with a notice (03 CP-2 edge), never an error and never a duplicate event.
8. **Honest jobs**: confirmation-send jobs show per-recipient determinate progress with named failures and per-item retry (async-contract §4); exports are atomic per artifact with expiry + regeneration. The phone-manual path touches no job and no quota — `getUsage().confirmationSends` counts channel sends only.
9. **Search normalization** follows rtl-rules §4 (alef variants, taa marbuta/heh, yaa forms, tashkeel stripped) on codes, titles, customer and technician names; normalization is disclosed in-product (ai-native-patterns §7.4 discipline applied to non-AI matching).
10. **Typed pagination** on every list; cursors opaque. Technician load and customer job counts are derived at read, never stored stale.
11. **Non-AI by construction**: no operation in this contract ranks, scores, predicts, or generates — dispatch decisions are human; the adapter validates and records. Any future assist capability must arrive as a new contract version through LOOP-4 owner confirmation first (12 Q-11).
12. **No orphan methods**: every operation traces to the 03 coverage table (script-verified at audit).
