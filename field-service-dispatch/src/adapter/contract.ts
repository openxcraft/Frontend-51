// VERBATIM from specs-source/field-service-dispatch/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
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

