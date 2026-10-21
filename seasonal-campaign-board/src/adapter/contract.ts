// VERBATIM from specs-source/seasonal-campaign-board/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// ---------- Result & error taxonomy (EXACT 7 classes) ----------
export type Result<T> = { ok: true; data: T } | { ok: false; error: AdapterError };

export type ErrorCode =
  | 'VALIDATION'    // ValidationError  — rejected input (empty name, past moment, blocked-without-reason, empty export selection, closure discipline)
  | 'NOT_FOUND'     // NotFoundError     — unknown id, campaign deleted elsewhere, expired artifact
  | 'PERMISSION'    // PermissionError   — viewer-role write, wrong workspace
  | 'CONFLICT'      // ConflictError     — stale revision on campaign/item/note/template concurrent writes
  | 'RATE_LIMIT'    // RateLimitError    — export quota window (the only metered surface)
  | 'NETWORK'       // NetworkError      — transport failure, offline
  | 'UNKNOWN';      // UnknownError      — unclassified, correlation-quoted

export interface AdapterError {
  code: ErrorCode;
  message: string;
  correlationId: string;
  retryable: boolean;
  details?: Record<string, string[]>;
}

// ---------- Session (auth-agnostic) & pagination ----------
export interface Session {
  memberId: string;
  workspaceId: string;
  role: 'owner' | 'planner' | 'viewer'; // viewers read everything, write nothing
  locale: 'ar' | 'en';
  serverTime: string;                  // countdown anchor source — the UI never trusts client clocks (CP-1.6)
}
export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean }

// ---------- Wire shapes (07a entities unless noted) ----------
export interface MomentSummary {      // library card row; detail via getMoment
  id: string;
  seasonId: string;
  kind: MomentKind;
  name: { ar: string | null; en: string | null };
  anchorDate: string;
  driftAware: boolean;
  daysUntilAnchor: number;            // vs serverTime — deterministic
  campaignCount: number;
}
export interface CampaignSummary {    // board lane row; detail via getCampaign
  id: string;
  name: string;
  momentId: string;
  momentName: { ar: string | null; en: string | null };
  status: CampaignStatus;
  anchorDate: string;
  ownerId: string;
  readiness: { percentComplete: number; criticalOpen: number; atRiskCount: number; overdueCount: number; blocked: number };
  daysUntilAnchor: number;            // negative when past anchor
  updatedAt: string;
}
export interface CampaignDetail {
  campaign: Campaign;
  moment: MomentSummary;
  checklistCounts: ReadinessSummary['counts'];
  closureNote: ClosureNote | null;
}
export type ClosureInput = Omit<ClosureNote, 'campaignId' | 'closedBy' | 'closedAt' | 'revision'>;
export type ItemPatch = Partial<Pick<ChecklistItem, 'title' | 'status' | 'assigneeId' | 'critical'>> & {
  blockedReason?: string | null;
  dueDateOverride?: { date: string; reason: string } | null;
};
export interface JobRow { exportJob: ExportJob; campaignNames: string[] }

// ---------- The contract (30 operations) ----------
export interface SeasonalCampaignBoardAdapterV1 {
  // Session
  getSession(): Promise<Result<Session>>;

  // Moments & calendar
  listSeasons(query: { status?: Season['status'][] }): Promise<Result<Page<Season>>>;
  listMoments(query: {
    filter?: { seasonId?: string; kind?: MomentKind[]; withinDays?: number; driftAwareOnly?: boolean };
    text?: string;                     // bilingual search, Arabic-normalized (rtl-rules §4)
    cursor?: string; limit: number;
  }): Promise<Result<Page<MomentSummary>>>;
  getMoment(id: string): Promise<Result<Moment & { templatePreview: ChecklistTemplate }>>;
  getCalendarFrame(input: {
    startsOn: string;                  // ISO date
    days: number;                      // strip length (≤ 92)
    includeMoments: boolean;
  }): Promise<Result<CalendarDay[]>>;

  // Campaigns
  listCampaigns(query: {
    filter?: { status?: CampaignStatus[]; momentId?: string; assigneeId?: string };
    sort: 'anchorDate' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CampaignSummary>>>;
  getCampaign(id: string): Promise<Result<CampaignDetail>>;
  createCampaign(input: {
    momentId: string;
    name: string;
    templateId?: string;               // defaults to the moment's template
    goLiveOverride?: string;           // ISO date; recorded, never silent
    ownerId?: string;                  // Assignee id; defaults to session member's linked assignee
  }): Promise<Result<CampaignDetail>>; // checklist instantiated synchronously (deterministic, small)
  updateCampaign(id: string, patch: {
    name?: string;
    status?: CampaignStatus;           // explicit reopen is a recorded transition
    goLiveOverride?: string | null;
    confirmedDate?: string;            // drift resolution on the moment's anchor for this campaign
  }, baseRevision: number): Promise<Result<CampaignSummary>>;
  closeCampaign(id: string, closure: ClosureInput & { waiveOpenCriticalItems: boolean }, baseRevision: number)
    : Promise<Result<CampaignDetail>>;
  updateClosureNote(campaignId: string, note: ClosureInput, baseRevision: number)
    : Promise<Result<CampaignDetail>>;

  // Checklist
  listChecklistItems(campaignId: string, query: {
    filter?: { status?: ItemStatus[]; assigneeId?: string; criticalOnly?: boolean; dueWithinDays?: number };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ChecklistItem>>>;
  updateChecklistItem(itemId: string, patch: ItemPatch, baseRevision: number): Promise<Result<ChecklistItem>>;
  addChecklistItem(campaignId: string, input: {
    title: { ar?: string; en?: string };   // at least one locale required
    assigneeId?: string;
    role?: string;
    critical?: boolean;
    dueOffsetDays?: number;
  }): Promise<Result<ChecklistItem>>;
  removeChecklistItem(itemId: string): Promise<Result<{ removedItemId: string; undoWindowSeconds: number }>>;
  bulkUpdateChecklistItems(itemIds: string[], patch: {
    status?: ItemStatus; assigneeId?: string;
  }): Promise<Result<{ updated: string[]; skipped: { itemId: string; reason: string }[] }>>;

  // Readiness (deterministic derivation vs serverTime)
  getReadiness(campaignId: string): Promise<Result<ReadinessSummary>>;

  // Team roster (thin; no permission semantics)
  listAssignees(query: { active?: boolean; cursor?: string; limit: number }): Promise<Result<Page<Assignee>>>;
  createAssignee(input: { name: string; role: string }): Promise<Result<Assignee>>;
  updateAssignee(id: string, patch: { name?: string; role?: string; active?: boolean }): Promise<Result<Assignee>>;

  // Templates (versioned; closure-to-template loop)
  listChecklistTemplates(query: {
    filter?: { momentKind?: MomentKind[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ChecklistTemplate>>>;
  getChecklistTemplate(id: string): Promise<Result<ChecklistTemplate>>;
  saveChecklistTemplate(template: Omit<ChecklistTemplate, 'updatedAt'>, baseVersion?: number)
    : Promise<Result<ChecklistTemplate>>;  // CONFLICT on stale baseVersion; versions append, never overwrite

  // Exports & jobs (async-contract; only metered surface)
  exportReadinessReport(input: {
    campaignIds: string[];
    format: 'board-summary' | 'item-detail';
    idempotencyKey: string;
  }): Promise<Result<ExportJob>>;
  exportTaskHandoff(input: {
    campaignId: string;
    assigneeIds?: string[];            // omit = whole campaign
    format: 'handoff-list';
    idempotencyKey: string;
  }): Promise<Result<ExportJob>>;
  listJobs(query: { state?: ExportJob['state'][]; cursor?: string; limit: number })
    : Promise<Result<Page<JobRow>>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; renewable: boolean }>>;
  renewArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; renewable: boolean }>>;

  // Usage & activity
  getUsage(): Promise<Result<UsageWindow>>;
  listActivity(query: {
    filter?: { actorId?: string; campaignId?: string; action?: ActivityEntry['action'][] };
    since?: string; cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntry>>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type BilingualText = { ar: string | null; en: string | null };
export type MomentKind =
  | 'religious-season'    // Ramadan
  | 'religious-festival'  // Eid al-Fitr, Eid al-Adha
  | 'commerce-event'      // White Friday
  | 'national-day'        // Saudi National Day, Founding Day, UAE Eid Al Etihad
  | 'school-term';        // back-to-school
export type PhaseName = 'build-up' | 'peak' | 'wind-down';
export type HijriMethod = 'ummalqura'; // presentation conversion; disclosed in-app (portfolio Q-5)
export interface PhaseWindow {
  phase: PhaseName;
  startsOffsetDays: number; // relative to moment anchor (negative = before)
  endsOffsetDays: number;
}

// ---------- Season ----------
export interface Season {
  id: string;
  label: BilingualText;              // e.g. { ar: 'سنة التجزئة 2026', en: '2026 retail year' }
  gregorianYear: number;
  status: 'upcoming' | 'current' | 'past';
}

// ---------- Moment (library entity) ----------
export interface Moment {
  id: string;
  seasonId: string;
  kind: MomentKind;
  name: BilingualText;               // { ar: 'رمضان 1447', en: 'Ramadan 1447' }
  anchorDate: string;                // ISO Gregorian date the countdown anchors to (moment start, or event day)
  anchorKind: 'starts' | 'event-day';// Ramadan anchors at start; National Day anchors at the day itself
  hijriDate: { day: number; month: number; year: number; label: string } | null; // Western digits; null for Gregorian-only moments
  hijriMethod: HijriMethod | null;
  driftDisclosure: { driftAware: boolean; note: BilingualText } | null;
  // driftAware = true for moon-sighting-dependent dates (±1 day; presentation only, subject to official announcement)
  phases: PhaseWindow[];             // build-up / peak / wind-down with offsets
  checklistTemplateId: string;       // default template for this moment kind (inspectable, overridable per campaign)
  guidance: BilingualText | null;    // curated cultural/timing notes (content, not AI)
  confirmedDate: string | null;      // set when an official announcement resolves drift
}

// ---------- ChecklistTemplate ----------
export interface TemplateItem {
  id: string;
  title: BilingualText;
  role: string;                      // e.g. 'e-commerce', 'content', 'merchandising', 'field'
  critical: boolean;
  dueOffsetDays: number;             // T-minus days relative to campaign anchor (negative = before anchor)
}
export interface ChecklistTemplate {
  id: string;
  momentKind: MomentKind;
  name: BilingualText;
  version: number;                   // closure-to-template loop bumps versions (CP-5)
  items: TemplateItem[];
  updatedAt: string;
}

// ---------- Assignee (thin roster; no permission semantics) ----------
export interface Assignee {
  id: string;
  name: string;                      // display name, bidi-isolated on render
  role: string;                      // free-form team role
  active: boolean;                   // false = left the team; items keep history (CP-2 edge c)
}

// ---------- Campaign ----------
export type CampaignStatus = 'draft' | 'active' | 'closed';
export interface Campaign {
  id: string;
  workspaceId: string;
  momentId: string;
  templateId: string;                // template instantiated at creation (pins template id, not version)
  name: string;
  anchorDate: string;                // moment anchor unless goLiveOverride was set
  goLiveOverride: string | null;     // explicit countdown anchor override (recorded, never silent)
  status: CampaignStatus;
  ownerId: string;                   // Assignee id (the accountable lead)
  createdAt: string;
  updatedAt: string;
  revision: number;                  // optimistic concurrency (CONFLICT on stale)
}

// ---------- ChecklistItem ----------
export type ItemStatus = 'not_started' | 'in_progress' | 'blocked' | 'done' | 'na';
export interface ChecklistItem {
  id: string;
  campaignId: string;
  templateItemId: string | null;     // null = custom item added beyond template (visibly marked)
  title: BilingualText;              // custom items may be mono-lingual (one side null)
  role: string;
  critical: boolean;
  dueOffsetDays: number;             // from template or custom offset
  dueDate: string;                   // computed: anchorDate + dueOffsetDays (display: "T-14 · Tue 10 Feb")
  dueDateOverride: { date: string; reason: string } | null; // override preserved for template honesty
  status: ItemStatus;
  assigneeId: string | null;
  blockedReason: string | null;      // required when status = 'blocked' (accountability record, LOOP-10)
  completedAt: string | null;        // lateness preserved in activity even after done
  revision: number;
}

// ---------- ClosureNote ----------
export interface ClosureNote {
  campaignId: string;                // 1—1 with a closed campaign
  whatShipped: string;               // deterministic summary pre-fill, editable
  whatSlipped: string;               // pre-filled from open/overdue items, editable
  lessons: string | null;            // free text; explicit skip allowed
  waivedCriticalItems: string[];     // ids of critical items open at close (recorded, not escalated)
  carriedToTemplate: boolean;        // closure → next template version (CP-5)
  closedBy: string;                  // memberId
  closedAt: string;
  revision: number;
}

// ---------- Readiness (derived view, deterministic) ----------
export interface ReadinessSummary {
  campaignId: string;
  computedAt: string;                // vs serverTime — never client clock
  phase: PhaseName | 'pre-season' | 'post-season';
  percentComplete: number;           // done+na / total (critical-weighted variant shown as counts, not a second %)
  counts: { total: number; done: number; na: number; inProgress: number; blocked: number; notStarted: number };
  criticalOpen: number;
  atRiskCount: number;               // open items due within the attention threshold (7 days)
  overdueCount: number;
  nextDueAt: string | null;
}

// ---------- Dual-calendar frame (presentation data, deterministic conversion) ----------
export interface CalendarDay {
  gregorianIso: string;              // ISO date
  weekday: BilingualText;
  hijri: { day: number; month: number; year: number; label: string; method: HijriMethod } | null;
  momentMarkers: { momentId: string; phase: PhaseName | 'anchor' }[];
}

// ---------- Job (async-contract) ----------
export type JobKind = 'export-readiness' | 'export-task-handoff';
export interface ExportJob {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  requestedBy: string;
  createdAt: string;
  finishedAt: string | null;
  artifact: { id: string; format: string; expiresAt: string } | null; // expiry declared at creation (async-contract §2)
  error: { code: string; message: string; correlationId: string } | null;
  campaignIds: string[];
}

// ---------- Activity (P17) ----------
export interface ActivityEntry {
  id: string;
  actorId: string;                   // memberId (or 'system' for date-confirm migrations)
  action:
    | 'campaign-created' | 'campaign-updated' | 'campaign-closed' | 'campaign-reopened'
    | 'item-updated' | 'item-added' | 'item-removed' | 'items-bulk-updated'
    | 'assignee-created' | 'assignee-updated'
    | 'template-saved' | 'export-requested' | 'artifact-renewed' | 'date-confirmed';
  targetId: string;                  // campaign / item / assignee / template / artifact id
  targetLabel: string;               // human-readable, bidi-safe
  detail: string | null;             // e.g. blockedReason, override reason
  at: string;
}

// ---------- Usage (exports are the only metered surface) ----------
export interface UsageWindow {
  windowLabel: string;
  exportsUsed: number;
  exportsLimit: number;
  resetAt: string;
}

