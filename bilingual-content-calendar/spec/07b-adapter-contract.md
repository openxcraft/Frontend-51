# 07b — Adapter Contract: bilingual-content-calendar (TypeScript, v1)

LOOP-15 satisfied: full error taxonomy, typed pagination/filter/sort, auth-agnostic session. No transport/provider semantics. Version v1; breaking changes → V2.

```ts
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };
export type ErrorCode = 'VALIDATION'|'NOT_FOUND'|'PERMISSION'|'CONFLICT'|'RATE_LIMIT'|'NETWORK'|'UNKNOWN';
export interface AdapterError { code: ErrorCode; message: string; correlationId: string; retryable: boolean; details?: Record<string,string[]>; }
export interface Session { memberId: string; workspaceId: string; role: 'owner'|'planner'|'reviewer'; locale: 'ar'|'en'; }
export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export type SlotKind = 'paired' | 'singleLocale';
export type SlotStatus = 'empty'|'briefed'|'drafted'|'approved';
export type ParityState = 'bothReady'|'oneMissing'|'diverged'|'notApplicable';
export interface SlotSummary {
  id: string; horizonId: string; channelId: string; scheduledAt: string; title: string;
  kind: SlotKind; status: SlotStatus; parityState: ParityState; momentId: string | null;
}
export interface Slot extends SlotSummary { variants: Variant[]; overrideReason?: string; }
export interface Variant {
  id: string; slotId: string; locale: 'ar'|'en'; status: SlotStatus;
  content?: string; ownerId?: string; divergenceNote?: string;
}
export interface SlotFilter { channelId?: string[]; status?: SlotStatus[]; parity?: ParityState[]; momentId?: string; since?: string; until?: string; }
export type SlotSort = 'scheduledAt' | 'updatedAt' | 'title';
export interface Moment {
  id: string; libraryRef: string; nameAr: string; nameEn: string;
  kind: 'ramadan'|'eid'|'whiteFriday'|'nationalDay'|'custom';
  dateAnchor: string; city?: string;
  timingPattern?: { windows: { label: string; start: string; end: string }[]; quietHours: { start: string; end: string } };
}
export interface Horizon { id: string; title: string; kind: 'month'|'season'|'custom'; start: string; end: string;
  status: 'planning'|'in-review'|'approved'; seasonConfig?: { quietHours?: { start: string; end: string }; city?: string }; }
export interface Job<T> { id: string; kind: string; state: 'queued'|'running'|'awaiting-input'|'succeeded'|'failed'|'cancelled'|'expired';
  progress: { determinate: boolean; done?: number; total?: number }; partial?: T; result?: T; error?: AdapterError; }

export interface PlannerAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  listHorizons(query: { sort: 'start' | 'updatedAt'; cursor?: string; limit: number }): Promise<Result<Page<Horizon>, AdapterError>>;
  createHorizon(input: { title: string; kind: 'month'|'season'|'custom'; start: string; end: string }): Promise<Result<Horizon, AdapterError>>;
  updateSeasonConfig(horizonId: string, config: Horizon['seasonConfig']): Promise<Result<Horizon, AdapterError>>;

  listSlots(query: { filter?: SlotFilter; sort: SlotSort; cursor?: string; limit: number }): Promise<Result<Page<SlotSummary>, AdapterError>>;
  getSlot(id: string): Promise<Result<Slot, AdapterError>>;
  createSlot(input: { horizonId: string; channelId: string; scheduledAt: string; title: string; kind: SlotKind; momentId?: string }): Promise<Result<Slot, AdapterError>>;
  updateSlot(id: string, patch: { title?: string; scheduledAt?: string; channelId?: string }, baseUpdatedAt: string): Promise<Result<Slot, AdapterError>>;
  moveSlot(id: string, scheduledAt: string): Promise<Result<Slot, AdapterError>>; // undo window handled hook-side (P03)

  setVariant(input: { variantId: string; status?: SlotStatus; content?: string; ownerId?: string; divergenceNote?: string }): Promise<Result<Variant, AdapterError>>;

  listMomentLibrary(horizon?: { start: string; end: string }): Promise<Result<Moment[], AdapterError>>;
  placeMoment(input: { horizonId: string; libraryRef: string; dateAnchor: string; city?: string }): Promise<Result<Moment, AdapterError>>;
  applyPattern(input: { horizonId: string; momentId: string; weekStart: string; channels: string[] }): Promise<Result<Job<{ applied: number; conflicts: string[] }>, AdapterError>>;

  getReviewSummary(horizonId: string): Promise<Result<{ conflicts: { slotId: string; reason: string }[]; parityGaps: string[] }, AdapterError>>;
  addComment(input: { slotId: string; variantId?: string; body: string }): Promise<Result<Comment, AdapterError>>;
  approveHorizon(horizonId: string, note?: string): Promise<Result<Horizon, AdapterError>>;

  exportHorizon(horizonId: string, format: 'structured'|'presentation'): Promise<Result<Job<{ artifactId: string; expiresAt: string }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string }, AdapterError>>;

  listJobs(query: { state?: Job<unknown>['state'][]; cursor?: string; limit: number }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
}
```

## Rules
1. `updateSlot` with stale `baseUpdatedAt` → CONFLICT (both versions returned in details).
2. `applyPattern` and `exportHorizon` are idempotent-capable Jobs (resubmission never duplicates artifacts/apply).
3. Channel daily-limit validation raises VALIDATION with per-channel counts in details (CP-3 edge).
4. No orphan methods: every method traces to CP-1…CP-4/S1–S10 (verified at Critic pass).
