# 07a — Data Contract: podcast-publish-kit

SME-G pass · Backend-agnostic · TypeScript interfaces ONLY (no implementation). AI declaration (ai-native-patterns §1): **conditionally-AI** — exactly one declared assist operation (`suggestChapters`, 07b) proposing chapter boundaries/titles from an imported transcript; it is draft-only (P15), metered (P14), and degrades to manual chapter marking which is a fully supported first-class path (08 §degradation map). Audio is NEVER persisted: an optional local audio reference is a client-side playback concern outside this contract (recorded rule, not an entity).

## Core entities

```ts
/** Bilingual content container. At least one locale must be non-empty
 *  (validated at operation time; storage keeps both optional so
 *  in-progress drafts round-trip losslessly). */
export interface LocaleContent { ar?: string; en?: string; }

export interface Show {
  id: string;
  workspaceId: string;
  title: LocaleContent;
  category?: string;
  numbering: { mode: 'seasons' | 'sequential' | 'none' };
  notesTemplate: NotesSectionKind[];      // default section order for new episodes
  activeLocales: ('ar' | 'en')[];          // locales the show ships notes in
  version: number;                          // optimistic-concurrency token
  createdAt: string; updatedAt: string;
}

export type EpisodeStage = 'draft' | 'transcript' | 'chapters' | 'notes' | 'packaged';

export interface Episode {
  id: string; showId: string;
  number?: number; season?: number;
  title: LocaleContent;
  plannedReleaseDate?: string;              // ISO 8601 (Gregorian canonical; Hijri display is presentation)
  recordingDate?: string;
  durationSec?: number;                     // declared or derived from transcript coverage
  stage: EpisodeStage;                      // DERIVED by the adapter (rule below) — never stored client-side
  version: number;
  createdAt: string; updatedAt: string;
}

export interface Transcript {
  id: string; episodeId: string;
  language: 'ar' | 'en' | 'mixed';
  sourceKind: 'pasted' | 'transcript-source' | 'file-import';
  format: 'timestamped-plain' | 'srt' | 'vtt' | 'untimed-plain';
  segmentCount: number;
  durationSec?: number;                     // coverage end of last timed segment
  revision: number;                         // bumps on any segment edit
  importedAt: string;
}

export interface TranscriptSegment {
  index: number;                            // 0-based, contiguous, immutable order
  startMs?: number; endMs?: number;         // absent only in 'untimed-plain' transcripts
  text: string;                             // verbatim; direction rendered per content (dir="auto")
  speaker?: string;
  needsReview: boolean;                     // podcaster-set ASR-suspect flag
  edited: boolean;                          // derived: differs from import
}

export interface Chapter {
  id: string; episodeId: string;
  startSegmentIndex: number;                // anchor — timecodes DERIVE from the segment
  endSegmentIndex: number;                  // inclusive; equals start for single-segment chapters
  startMs?: number; endMs?: number;         // derived from segment timings (absent when untimed)
  title: LocaleContent;
  summaryHint?: LocaleContent;              // optional one-liner feeding notes drafting
  origin: 'manual' | 'assist';              // provenance of the accepted draft (P15 audit trail)
  version: number;
  createdAt: string; updatedAt: string;
}

export interface ChapterSuggestion {        // DRAFT object — never a Chapter until human acceptance
  startSegmentIndex: number; endSegmentIndex: number;
  title: LocaleContent;
  rationale: string;                        // why this boundary — inspectability contract
  confidence: 'high' | 'medium' | 'low';
}
```

## Show notes entities

```ts
export type NotesSectionKind = 'summary' | 'takeaways' | 'links' | 'guest' | 'chapter-list' | 'cta';

export interface NotesLink { url: string; label: LocaleContent; }   // one URL, bilingual labels

export interface NotesSection {
  kind: NotesSectionKind;
  ar?: string;                              // prose sections
  en?: string;
  takeaways?: { ar?: string[]; en?: string[] };
  links?: NotesLink[];
  chapterListGenerated?: boolean;           // true → section content is GENERATED from chapters
}

export interface ShowNotes {
  episodeId: string;
  sections: NotesSection[];
  shipSingleLocale?: ('ar' | 'en')[];       // explicit conscious single-locale sections (checklist-visible)
  revision: number;                         // optimistic concurrency
  updatedAt: string;
}

export type ParityState = 'in-sync' | 'edited-since' | 'missing-locale' | 'length-far-apart';
```

## Package & delivery entities

```ts
export interface ExportArtifact {
  id: string; packageId: string;
  kind: 'chapters-namespace-json' | 'chapters-plain-timestamps' | 'show-notes-md' | 'show-notes-txt' | 'episode-metadata' | 'bundle-zip';
  url: string;                              // adapter-issued, expiring
  expiresAt: string;                        // declared at creation (async-contract §2)
}

export interface DeliveryReceipt {
  channelCredentialId: string;
  deliveredAt: string;
  receiptRef: string;                       // channel-issued reference
  state: 'delivered' | 'failed';
  detail?: string;
}

export interface PublicationPackage {
  id: string; episodeId: string;
  version: number;                          // increments per rebuild; history retained
  options: {
    chaptersFormat: 'namespace-json' | 'plain-timestamps' | 'both';
    includeLocales: ('ar' | 'en')[];
    notesForm: 'markdown' | 'plain-text';
  };
  chaptersDigest: { count: number; firstStartMs?: number; lastEndMs?: number; untitled: number };
  artifacts: ExportArtifact[];
  deliveries: DeliveryReceipt[];
  builtAt: string;
}
```

## Checklist, credentials, jobs, accountability

```ts
export interface ChecklistItem {
  key: string;                              // stable key, e.g. 'chapters.titled-both-locales'
  kind: 'derived' | 'sign-off';
  label: LocaleContent;
  state: 'open' | 'done' | 'blocked';
  fixTarget?: { surface: 'timeline' | 'notes' | 'metadata'; ref?: string };  // derived items link to their fix
  signOff?: { memberId: string; at: string };  // sign-off items only (P17 actor+timestamp)
}

export interface EpisodeChecklist { episodeId: string; items: ChecklistItem[]; }

export interface ChannelCredential {        // "publication channel" abstract need (credential-contract)
  id: string;
  kind: 'publication-channel';
  displayName: string;
  identifierHint: string;                   // last 2–4 chars of identifier portion only
  capabilities: string[];                   // operation classes granted, e.g. ['receive-package']
  state: 'unverified' | 'active' | 'rotating' | 'expiring-soon' | 'expired' | 'revoked' | 'failed';
  verifiedAt?: string; expiresAt?: string;
}

export type JobKind = 'transcript-import' | 'chapter-suggestion' | 'package-build' | 'package-delivery';
export type JobState = 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';

export interface Job<T> {
  id: string; kind: JobKind; episodeId?: string;
  state: JobState;
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T; result?: T; error?: AdapterError;   // AdapterError defined in 07b
}

export interface ActivityEntry { id: string; at: string; memberId: string; action: string; targetRef: string; }  // P17

export interface Usage { window: string; suggestionRuns: number; suggestionRunsCap: number; resetAt: string; }
```

## Relationships

Workspace 1—N Show · Show 1—N Episode · Episode 1—(0..1) Transcript · Transcript 1—N TranscriptSegment (ordered by index) · Episode 1—N Chapter (ranges over that episode's segments) · Episode 1—1 ShowNotes · Episode 1—N PublicationPackage (versioned) · Package 1—N ExportArtifact · Package 0—N DeliveryReceipt → ChannelCredential · Episode 1—1 EpisodeChecklist.

## State & derivation obligations

1. **Chapter timecodes are derived, never authored**: startMs/endMs come from segment timings; moving a boundary means moving the segment anchor — the notes chapter-list and the exported chapters file share this single source (00 unique feature; 07b rule).
2. **EpisodeStage derivation (adapter-side, the board's truth)**: `draft` (no transcript) → `transcript` (transcript exists, 0 chapters) → `chapters` (≥1 chapter) → `notes` (summary section non-empty in ≥1 active locale) → `packaged` (≥1 package). No client-stored status exists to drift.
3. `origin: 'assist'` chapters record their promotion provenance; suggestions themselves are ephemeral drafts (retained only while under review or in job partials).
4. `revision`/`version` tokens are optimistic-concurrency guards: stale writes return CONFLICT with both payloads (P10).
5. Untimed transcripts are legal: chapters anchor by segment index with timecodes pending; packaging requires either timed segments or a declared duration (checklist blocks otherwise).
6. Secrets never appear in any entity above; credential identifiers render as hints only (credential-contract §2).
