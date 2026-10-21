# 07b — Adapter Contract: interactive-story-builder (TypeScript, v1)

TYPES ONLY — no implementation. Entity types defined in 07a (imported below; `StructureOutline` is the suggestion job payload). LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. AI declaration: `suggestStructure` is the single AI-flavored operation; degradation is modeled by `origin` (ai-native-patterns §1/§8).

```ts
import type {
  Locale, LocalizedText, Story, StorySummary, StoryStatus, Chapter, Step,
  StepLayoutKind, LocaleVariant, MediaRef, LayoutOverride, StoryTemplate,
  StructureOutline, SyncReport, ReviewNote, QaReport, ExportArtifact,
  ActivityEntry, UsageSummary, Page
} from './07a-data-contract';

export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode; message: string; correlationId: string; retryable: boolean;
  details?: Record<string, string[]>;          // field-linked validation targets
}

export interface Session {                     // auth-agnostic; no member management (LOOP-10)
  memberId: string; workspaceId: string;
  role: 'owner' | 'editor' | 'reviewer';       // reviewer: read + notes + approve; no mutations
  locale: Locale;
}

export interface Job<T> {
  id: string; kind: 'suggest-structure' | 'export-story';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T; result?: T; error?: AdapterError;
  createdAt: string; updatedAt: string;
}
export type JobSummary = Omit<Job<unknown>, 'partial' | 'result'> & { storyId?: string };

export interface StoryListQuery {
  filter?: { status?: StoryStatus[]; query?: string };   // normalized per rtl-rules §4
  sort: 'updatedAt' | 'title' | 'status';
  cursor?: string; limit: number;
}

export interface StoryBuilderAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // Stories
  listStories(query: StoryListQuery): Promise<Result<Page<StorySummary>, AdapterError>>;
  createStory(input: { title: LocalizedText; directionDefault: 'rtl' | 'ltr'; fromTemplateId?: string }): Promise<Result<Story, AdapterError>>;
  getStory(id: string): Promise<Result<Story, AdapterError>>;
  updateStoryDetails(id: string, patch: { title?: LocalizedText; description?: LocalizedText; directionDefault?: 'rtl' | 'ltr'; theme?: Story['theme'] }, baseRevision: number): Promise<Result<Story, AdapterError>>;
  duplicateStory(id: string, title: LocalizedText): Promise<Result<Story, AdapterError>>;
  deleteStory(id: string): Promise<Result<{ deleted: true }, AdapterError>>;
  setStoryStatus(id: string, status: StoryStatus, baseRevision: number): Promise<Result<Story, AdapterError>>;

  // Templates (deterministic; suggestion-degradation substrate)
  listTemplates(query: { audience?: ('newsroom' | 'ngo' | 'university')[]; cursor?: string; limit: number }): Promise<Result<Page<StoryTemplate>, AdapterError>>;

  // Chapters
  listChapters(storyId: string): Promise<Result<Chapter[], AdapterError>>;
  createChapter(storyId: string, input: { title: LocalizedText }): Promise<Result<Chapter, AdapterError>>;
  updateChapter(chapterId: string, input: { title?: LocalizedText }, baseRevision: number): Promise<Result<Chapter, AdapterError>>;
  reorderChapters(storyId: string, orderedIds: string[]): Promise<Result<Chapter[], AdapterError>>;
  deleteChapter(chapterId: string): Promise<Result<{ deleted: true }, AdapterError>>;

  // Steps (shared structure; locale variants per step)
  listSteps(chapterId: string): Promise<Result<Step[], AdapterError>>;
  createStep(chapterId: string, input: { layout: StepLayoutKind; media?: Omit<MediaRef, 'id'>; localeVariants?: { ar?: LocaleVariant; en?: LocaleVariant } }): Promise<Result<Step, AdapterError>>;
  updateStep(stepId: string, input: { layout?: StepLayoutKind; media?: Omit<MediaRef, 'id'> | null; localeVariants?: { ar?: LocaleVariant; en?: LocaleVariant }; layoutOverride?: LayoutOverride | null }, baseRevision: number): Promise<Result<Step, AdapterError>>;
  reorderSteps(chapterId: string, orderedIds: string[]): Promise<Result<Step[], AdapterError>>;
  deleteStep(stepId: string): Promise<Result<{ deleted: true }, AdapterError>>;

  // Bilingual sync (derived)
  getSyncState(storyId: string): Promise<Result<SyncReport, AdapterError>>;

  // Structure suggestion (conditionally-AI; degrades to templates — ai-native-patterns §8)
  suggestStructure(input: { storyId: string; brief: LocalizedText; audience: 'newsroom' | 'ngo' | 'university' }): Promise<Result<Job<StructureOutline>, AdapterError>>;

  // QA gate (derived, deterministic)
  validateStory(storyId: string): Promise<Result<QaReport, AdapterError>>;

  // Review loop
  addReviewNote(storyId: string, input: { targetRef: ReviewNote['targetRef']; body: string }): Promise<Result<ReviewNote, AdapterError>>;
  listReviewNotes(storyId: string, query?: { resolved?: boolean }): Promise<Result<ReviewNote[], AdapterError>>;
  resolveReviewNote(noteId: string): Promise<Result<ReviewNote, AdapterError>>;

  // Export & delivery
  exportStory(storyId: string, input: { format: 'html-bundle' | 'embed-package'; localeScope: 'both' | 'ar' | 'en'; watermark?: 'story-credit'; idempotencyKey?: string }): Promise<Result<Job<{ artifacts: ExportArtifact[] }>, AdapterError>>;
  getExportArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string }, AdapterError>>;
  renewExportArtifact(artifactId: string): Promise<Result<ExportArtifact, AdapterError>>;

  // Jobs / activity / usage
  listJobs(query: { filter?: { state?: JobSummary['state'][]; kind?: JobSummary['kind'][] }; cursor?: string; limit: number }): Promise<Result<Page<JobSummary>, AdapterError>>;
  cancelJob(jobId: string): Promise<Result<JobSummary, AdapterError>>;
  listActivity(query: { cursor?: string; limit: number }): Promise<Result<Page<ActivityEntry>, AdapterError>>;
  getUsage(): Promise<Result<UsageSummary, AdapterError>>;
}
```

## Rules

1. **Steps are the bilingual unit**: `deleteStep` removes both locales' content; `deleteStory`/`deleteChapter` cascade — the UI-side P04 confirm (both-locale counts) happens BEFORE the call; the adapter executes what was confirmed.
2. **Sync is derived**: `getSyncState` recomputes from step revisions + `lastEditedByLocale`; "mark reviewed" is an editorial act logged as an ActivityEntry, never silent.
3. **Status transitions guarded**: draft → in-review → approved; content mutation after approval returns the story to draft, carried in the response (surfaced per CP-5.1).
4. **Stale revisions → CONFLICT** with both payloads; reorders are full-array idempotent (partial arrays → VALIDATION).
5. **suggestStructure degradation**: capability unavailable → Job still succeeds with `origin: 'template'` (rung 3, ai-native-patterns §5); rung 4 (clean unavailability + reset time) only if even templates are unreachable.
6. **Export idempotency**: identical (story revision + params + idempotencyKey) → same artifacts; partial render failures deliver per-chapter partial artifacts with scoped retry (async-contract §4).
7. **Reviewer role**: any mutation → PERMISSION with details naming the operation; notes/approval/listing stay open.
8. **No orphan methods**: every operation traces to ≥1 flow in 03 (coverage table) and ≥1 screen in 04.
