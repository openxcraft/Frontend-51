// Verbatim TS blocks from specs-source/social-clip-cutter/07a-data-contract.md — 07b imports this module by name.
import type { AdapterError } from './contract'; // SPEC_DEFECTS C: 07a references the foundation error type defined in 07b
/** Bilingual content container. At least one locale must be non-empty
 *  (validated at operation time; storage keeps both optional so
 *  in-progress drafts round-trip losslessly). */
export interface LocaleContent { ar?: string; en?: string; }
export type EpisodeLanguage = 'ar' | 'en' | 'mixed';
export interface MediaRef {
  kind: 'local-file' | 'external-locator';   // label + locator only — NEVER an upload
  label: string;                              // e.g. "EP-47-final.mov (edit bay share)"
  locator?: string;                           // path/URL hint for the team's own use
}
export type EpisodeStage = 'draft' | 'transcript' | 'clips' | 'specced' | 'exported';
export interface EpisodeSource {
  id: string;
  workspaceId: string;
  title: LocaleContent;
  language: EpisodeLanguage;
  mediaRef?: MediaRef;                        // optional; playback is client-side only
  plannedDurationSec?: number;                // declared; transcript coverage may correct it
  stage: EpisodeStage;                        // DERIVED by the adapter — never stored client-side
  version: number;                            // optimistic-concurrency token
  createdAt: string; updatedAt: string;
}
export interface Transcript {
  id: string; episodeSourceId: string;
  language: 'ar' | 'en' | 'mixed';
  sourceKind: 'pasted' | 'transcript-source' | 'file-import';
  format: 'timestamped-plain' | 'srt' | 'vtt' | 'untimed-plain';
  segmentCount: number;
  durationSec?: number;                      // coverage end of last timed segment
  revision: number;                          // bumps on any segment edit
  importedAt: string;
}
export interface TranscriptSegment {
  index: number;                             // 0-based, contiguous, immutable order
  startMs?: number; endMs?: number;          // absent only in 'untimed-plain' transcripts
  text: string;                              // verbatim; direction rendered per content (dir="auto")
  speaker?: string;
  needsReview: boolean;                      // operator-set ASR-suspect flag
  edited: boolean;                           // derived: differs from import
}

/** A DRAFT proposal from the deterministic highlight pass — never a ClipSelection
 *  until a human accepts it. Scores are inspectable; rationale is content, not
 *  decoration (00 unique feature). */
export interface HighlightCandidate {
  startSegmentIndex: number;
  endSegmentIndex: number;                   // inclusive
  durationSec?: number;                      // derived when timed
  scores: {
    keywordDensity: number;                  // 0–1, computed over declared keyword sets
    pauseSupport: number;                    // 0–1, boundary agreement with detected pauses
    hookPattern: number;                     // 0–1, rule match strength (question/imperative/numbered)
  };
  rationale: string;                         // human-readable WHY (bilingual per session locale)
  matchedKeywords?: string[];                // the terms that fired (disclosure)
}

/** Segment-anchored clip boundary. Timecodes DERIVE from anchors + bounded
 *  offsets — never authored as free values (the product's anti-drift spine). */
export interface ClipBoundary {
  startSegmentIndex: number;
  endSegmentIndex: number;                   // inclusive; ≥ start
  startOffsetMs: number;                     // 0..(startSegment duration); default 0
  endOffsetMs: number;                       // 0..(endSegment duration); default = full duration
  startMs?: number; endMs?: number;          // DERIVED (absent when segments untimed)
}
export interface ClipSelection {
  id: string; episodeSourceId: string;
  boundary: ClipBoundary;
  title: LocaleContent;                      // clip title/caption hook draft
  origin: 'manual' | 'highlight';            // provenance (audit trail)
  highlightRef?: {                           // pinned candidate provenance when origin = 'highlight'
    rationale: string; scores: HighlightCandidate['scores'];
  };
  burnInSpec?: BurnInSpec;                   // absent until CP-4 composes one
  specWarnings: BurnInWarning[];             // DERIVED by lint on every spec/boundary change
  revision: number;                          // optimistic concurrency
  createdAt: string; updatedAt: string;
}

/** A caption style = the LOOK. Stock catalog ships Arabic-safe families with
 *  REAL weight sets (no synthetic bold — rtl-rules §3); workspace styles are
 *  versioned duplicates. Deep refinement of captions belongs to caption-lab
 *  (LOOP-10 boundary); these are convenience-grade presets + lint. */
export interface CaptionStyle {
  id: string;
  scope: 'stock' | 'workspace';
  name: LocaleContent;
  family: {
    arabic: string;                          // from the Arabic-safe catalog (07c seeds)
    latin: string;
    weights: number[];                       // REAL available weights for the family
  };
  sizeScale: { basePx: number; minPx: number; maxPx: number };
  stroke: { color: string; widthPx: number } | null;
  shadow: { color: string; blurPx: number; offsetYPx: number } | null;
  background: { kind: 'none' | 'band' | 'box'; color: string; opacity: number };
  version: number;                           // workspace styles; stock styles pin at 1
  createdAt?: string; updatedAt?: string;
}
export type SafeZonePreset = 'tiktok-class' | 'shorts-class' | 'reels-class' | 'square-1-1' | 'wide-16-9';

/** Burn-in spec = WHERE + HOW captions render on THIS clip. The lint validates
 *  it deterministically and returns warnings — never a silent accept (00). */
export interface BurnInSpec {
  captionStyleId: string;
  placement: {
    preset: SafeZonePreset;                  // encodes the platform overlay band
    verticalPosition: 'lower-third' | 'center' | 'upper-third';  // constrained within the band
    alignment: 'start' | 'center' | 'end';   // logical (inline-start/end — flips with direction)
    nudgePercent?: number;                   // ±10% within the band, keyboard-steppable
  };
  linePolicy: {
    maxLines: number;                        // 1–3
    maxCharsPerLineAr: number;               // Arabic budget (joined words — no hyphenation)
    maxCharsPerLineEn: number;
  };
  readingSpeed: {
    charsPerSecAr: number;                   // gate per script (declared product default; tunable)
    charsPerSecEn: number;
  };
  tashkeelMode: 'off' | 'on';                // 'on' widens line-height (≥1.8 — rtl-rules §3)
  bidiPolicy: 'isolate-runs' | 'dominant-script';   // isolate-runs is the default and the safe answer
  sidecar: 'srt-and-vtt' | 'srt' | 'vtt' | 'none';  // default srt-and-vtt (accessibility answer — 01)
}
export type BurnInWarningKind =
  | 'reading-speed-exceeded'                 // a caption line outruns its display window at the gate
  | 'safe-zone-violation'                    // placement intersects the preset's overlay band
  | 'line-overflow'                          // a line exceeds the width budget (joined word cannot break)
  | 'bidi-reorder-risk'                      // mixed-direction run without isolation under the current policy
  | 'tashkeel-clipping-risk';                // line-height cannot host stacked marks
export interface BurnInWarning {
  kind: BurnInWarningKind;
  segmentIndex: number;                      // the offending caption line's segment
  detail: string;                            // exact numbers ("17 chars in 0.9s at gate 14")
  fixTarget: 'placement' | 'linePolicy' | 'readingSpeed' | 'tashkeelMode' | 'bidiPolicy';
}
export type ExportFormat = '9:16-burned' | '1:1-burned' | '16:9-burned' | 'caption-srt' | 'caption-vtt' | 'export-manifest' | 'recipe-bundle';
export interface ExportArtifact {
  id: string; jobId: string; clipId?: string;     // recipe-bundle/manifest artifacts are batch-level
  kind: ExportFormat;
  url: string;                                     // adapter-issued, expiring
  expiresAt: string;                               // declared at creation (async-contract §2)
}
export type JobKind = 'transcript-import' | 'clip-export';
export type JobState = 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';

/** Export/trace options for a batch. The RECIPE path is a first-class mode:
 *  caption files + boundary timecodes + burn-in spec sheet, no rendering. */
export interface ExportOptions {
  aspectRatios: ('9:16' | '1:1' | '16:9')[];       // per-batch; 9:16 default
  burnIn: boolean;                                 // master render carries captions when true
  sidecar: 'srt-and-vtt' | 'srt' | 'vtt' | 'none';
  mode: 'render' | 'recipe';                       // recipe = the LOOP-5 manual alternative, always available
}
export interface ExportJob {
  id: string; kind: JobKind; episodeSourceId?: string;
  state: JobState;
  progress: { determinate: boolean; done?: number; total?: number };   // per-clip counts for exports
  input: { clipIds?: string[]; options?: ExportOptions };
  perClipResults?: Array<{ clipId: string; state: 'succeeded' | 'failed' | 'skipped'; artifactIds: string[]; error?: AdapterError }>;
  result?: { artifactIds: string[]; warningsCarried: string[] };       // lint warnings attached, honestly
  error?: AdapterError;                                                // AdapterError defined in 07b
}
export type CredentialKind = 'media-source' | 'notification-channel';
export interface Credential {              // credential-contract; kind, never vendor
  id: string; kind: CredentialKind;
  displayName: string;
  identifierHint: string;                  // last 2–4 chars of identifier portion only
  capabilities: string[];                  // operation classes granted, e.g. ['read-transcripts'] | ['send-job-notifications']
  state: 'unverified' | 'active' | 'rotating' | 'expiring-soon' | 'expired' | 'revoked' | 'failed';
  verifiedAt?: string; expiresAt?: string;
}
export interface ActivityEntry { id: string; at: string; memberId: string; action: string; targetRef: string; }   // P17
export interface Usage {
  window: string;                          // calendar month
  renderMinutes: number; renderMinutesCap: number;   // the ONLY metered class (P14)
  resetAt: string;
}
