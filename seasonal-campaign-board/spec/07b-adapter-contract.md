# 07b — Adapter Contract: seasonal-campaign-board (TypeScript, v1)

SME-G pass. **TYPES ONLY.** Entity types are defined in 07a and referenced by name below (`Season`, `Moment`, `MomentKind`, `ChecklistTemplate`, `Campaign`, `CampaignStatus`, `ChecklistItem`, `ItemStatus`, `Assignee`, `ClosureNote`, `ReadinessSummary`, `CalendarDay`, `ExportJob`, `JobKind`, `ActivityEntry`, `UsageWindow`) — the two files form one contract surface. **AI declaration: non-AI product** (ai-native-patterns §1) — every operation is deterministic read/write/compute; no AI affordances leak into the surface. LOOP-15 satisfied: exact 7-class taxonomy, typed pagination, auth-agnostic session. Every operation traces to ≥1 flow (03 coverage table; no orphans).

```ts
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
```

## Rules

1. **Countdown truth**: every `daysUntilAnchor` / `ReadinessSummary.computedAt` / due-state derivation uses the adapter's clock (surfaced as `Session.serverTime`); the UI renders countdowns from that anchor — client-clock drift is a defect (03 CP-1.6, 07c fixed-clock determinism).
2. **Instantiation honesty**: `createCampaign` snapshots template items into checklist items (pinning `templateItemId`); later template versions never mutate live campaigns; `addChecklistItem` rows carry `templateItemId: null` and render as "added beyond template".
3. **Concurrency**: stale `baseRevision`/`baseVersion` → CONFLICT with both payloads in `details`; the UI surfaces both versions and asks (P10). `removeChecklistItem` is Level-1 destructive — the adapter returns the undo window and honors re-put within it (P03/P04).
4. **Blocked discipline**: `updateChecklistItem` to `status: 'blocked'` without a non-empty `blockedReason` → VALIDATION listing the field; the reason is stored, rendered, and logged (LOOP-10 accountability).
5. **Closure discipline**: `closeCampaign` with open critical items and `waiveOpenCriticalItems: false` → VALIDATION listing the open critical item ids (`details.openCriticalItems`) — the UI presents the waiver confirm naming them (03 CP-5.3); `waivedCriticalItems` is recorded on the note.
6. **Partial results**: `bulkUpdateChecklistItems` never all-or-nothing — per-item outcomes with skipped reasons (async-contract §4 posture applied synchronously); skipped items remain selectable for a scoped retry.
7. **Exports**: repeat `idempotencyKey` returns the existing job (never a double charge); artifacts declare expiry at creation; expired artifact → NOT_FOUND from `getArtifact` with the renew path (`renewArtifact`) and re-export available; RATE_LIMIT applies only to these two operations — reads, checklist writes, roster, templates, activity are never metered.
8. **No orphans**: 30/30 operations traced in 03's coverage table (Critic check).
9. **Auth-agnostic**: no credential semantics here; workspace-level abstract capability bindings (calendar sync, notification channel, file storage for artifacts) live in 08 per credential-contract — surfaced via job-state errors, never vendor states.
