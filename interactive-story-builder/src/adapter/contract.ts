// VERBATIM from specs-source/interactive-story-builder/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Iso8601 = string;                               // UTC timestamps
export interface Workspace {
  id: string; name: string; defaultLocale: Locale;
  directionDefault: 'rtl' | 'ltr'; numeralPolicy: 'ar-indic-prose' | 'western';
}
export type SyncRowState = 'in-sync' | 'edited-since' | 'missing-in-locale'
  | 'length-divergent' | 'layout-override';

