// Verbatim TS blocks from specs-source/interactive-story-builder/07a-data-contract.md — 07b imports this module by name.
import type { AdapterError } from './contract'; // SPEC_DEFECTS C: 07a references the foundation error type defined in 07b
export type Locale = 'ar' | 'en';
export type LocalizedText = { ar?: string; en?: string };   // ≥1 locale at creation
export type Iso8601 = string;                               // UTC timestamps
export interface Workspace {
  id: string; name: string; defaultLocale: Locale;
  directionDefault: 'rtl' | 'ltr'; numeralPolicy: 'ar-indic-prose' | 'western';
}
export type StoryStatus = 'draft' | 'in-review' | 'approved';
export interface Story {
  id: string; workspaceId: string;
  title: LocalizedText; description?: LocalizedText;
  directionDefault: 'rtl' | 'ltr';
  theme: { fontScale: 'normal' | 'large'; spacing: 'normal' | 'relaxed' };
  status: StoryStatus; revision: number;             // optimistic-concurrency guard
  chapterCount: number;                              // derived
  syncRollup: { inSync: number; issues: number };    // derived
  createdAt: Iso8601; updatedAt: Iso8601;
}
export type StorySummary = Omit<Story, 'theme' | 'description'>;
export interface Chapter {
  id: string; storyId: string; order: number;
  title: LocalizedText; revision: number; stepCount: number;   // stepCount derived
}
export type StepLayoutKind = 'full-bleed-media' | 'text-over-media'
  | 'media-text-inline'        // media on inline-start or inline-end (logical axes)
  | 'figure-with-caption' | 'pull-quote' | 'stat-band';
export interface LocaleVariant {              // per-locale step content — the bilingual unit
  heading?: string;
  bodyBlocks: { kind: 'paragraph' | 'pull-quote' | 'stat-line'; text: string }[];
  wordCount: number;                         // derived
}
export interface MediaRef {
  id: string;
  kind: 'image' | 'video' | 'audio' | 'data-figure' | 'map-embed';
  sourceUrl: string;                         // external URL or abstract media capability handle (08)
  altText: LocalizedText;                    // required per locale within export scope (QA gate)
  credit?: string;                           // bidi-isolated at render
  captions?: LocalizedText;
}
export interface LayoutOverride {
  locale: Locale; property: 'mediaSide' | 'textPosition';
  value: 'inline-start' | 'inline-end'; reason: string;   // empty reason = QA finding
}
export interface Step {                       // shared structure for BOTH locales
  id: string; chapterId: string; order: number;
  layout: StepLayoutKind; media?: MediaRef;
  localeVariants: { ar?: LocaleVariant; en?: LocaleVariant };
  layoutOverride?: LayoutOverride;
  revision: number;
  lastEditedByLocale?: { locale: Locale; at: Iso8601 };
}
export interface StoryTemplate {              // deterministic; suggestion-degradation substrate
  id: string; audience: 'newsroom' | 'ngo' | 'university'; name: LocalizedText;
  chapters: { title: LocalizedText;
    steps: { layout: StepLayoutKind; suggestedMediaType?: MediaRef['kind'] }[] }[];
}
export interface StructureOutline {          // suggestion job result
  origin: 'generated' | 'template';          // 'template' = degradation, labeled non-generative
  partial?: boolean;
  chapters: { title: LocalizedText; steps: { layout: StepLayoutKind; note?: string }[] }[];
}
export type SyncRowState = 'in-sync' | 'edited-since' | 'missing-in-locale'
  | 'length-divergent' | 'layout-override';
export interface SyncReport {                // derived, never hand-authored
  storyId: string;
  rows: { stepId: string; chapterId: string; state: SyncRowState;
          lastEdited: { ar?: Iso8601; en?: Iso8601 };
          wordCounts: { ar?: number; en?: number }; reviewedAt?: Iso8601 }[];
  chapterRollups: { chapterId: string; inSync: number; issues: number }[];
  storyRollup: { inSync: number; issues: number };
}
export interface ReviewNote {
  id: string; storyId: string;
  targetRef: { kind: 'story' | 'chapter' | 'step'; id: string; locale?: Locale };
  body: string; authorMemberId: string;
  createdAt: Iso8601; resolvedAt?: Iso8601;
}
export interface QaReport {                  // derived, deterministic
  storyId: string; revisionChecked: number; checkedAt: Iso8601;
  findings: { severity: 'error' | 'warning';
    kind: 'missing-alt' | 'missing-locale' | 'unreviewed-divergence' | 'empty-chapter'
        | 'bidi-hazard' | 'numeral-policy' | 'override-without-reason';
    stepRef?: { chapterId: string; stepId: string }; message: string }[];
}
export interface Job<T> {
  id: string; kind: 'suggest-structure' | 'export-story';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T; result?: T; error?: unknown;   // AdapterError shape in 07b
  createdAt: Iso8601; updatedAt: Iso8601;
}
export type JobSummary = Omit<Job<unknown>, 'partial' | 'result'> & { storyId?: string };
export interface ExportArtifact {
  artifactId: string; storyId: string; jobId: string;
  format: 'html-bundle' | 'embed-package'; localeScope: 'both' | 'ar' | 'en';
  expiresAt: Iso8601; regenerable: true;
}
export interface ActivityEntry {             // P17
  id: string; actorMemberId: string; action: string;
  targetKind: string; targetId: string; detail?: string; at: Iso8601;
}
export interface UsageSummary {
  window: string; suggestions: number; suggestionWindowMax: number;
  exports: number; exportWindowMax: number; resetAt: Iso8601;
}
export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }
