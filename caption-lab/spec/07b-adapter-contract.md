# 07b — Adapter Contract: caption-lab (TypeScript, v1)

LOOP-15 satisfied: full taxonomy, typed pagination/filter/sort, session model.

```ts
export type Result<T, E extends AdapterError = AdapterError> = { ok: true; data: T } | { ok: false; error: E };
export type ErrorCode = 'VALIDATION'|'NOT_FOUND'|'PERMISSION'|'CONFLICT'|'RATE_LIMIT'|'NETWORK'|'UNKNOWN';
export interface AdapterError { code: ErrorCode; message: string; correlationId: string; retryable: boolean; details?: Record<string,string[]>; }
export interface Session { memberId: string; workspaceId: string; role: 'owner'|'editor'|'reviewer'; locale: 'ar'|'en'; }
export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export type CueState = 'proposed'|'verified'|'locked';
export type CueFlag = 'over-gate'|'too-long'|'overlap'|'bidi-complex';
export interface Cue {
  id: string; projectId: string; index: number; timeStart: number; timeEnd: number; // canonical ms
  text: string; lines: string[]; state: CueState; flags: CueFlag[]; speedCPM: number; revision: number;
}
export interface CueFilter { state?: CueState[]; flags?: CueFlag[]; overGateOnly?: boolean; searchText?: string; }
export type CueSort = 'index' | 'timeStart';
export interface TranscriptInput { format: 'srt'|'vtt'|'text-with-timecodes'|'plain-text'; content: string; }
export interface StylePreset {
  id: string; name: string; version: number;
  spec: { fontFamily: string; fontWeight: number; sizePolicy: string; stroke: string; shadow: string;
    background: string; position: string; safeMargins: string; maxLines: number };
  legibility: { contrastPair: string; sizeMatrix: string };
}
export interface Job<T> { id: string; kind: string; state: 'queued'|'running'|'awaiting-input'|'succeeded'|'failed'|'cancelled'|'expired';
  progress: { determinate: boolean; done?: number; total?: number }; partial?: T; result?: T; error?: AdapterError; }

export interface CaptionLabAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  listProjects(query: { sort: 'updatedAt'|'title'; cursor?: string; limit: number }): Promise<Result<Page<ProjectSummary>, AdapterError>>;
  createProject(input: { title: string; mediaRef?: string; transcript: TranscriptInput }): Promise<Result<Job<{ projectId: string; cues: number; proposed: number }>, AdapterError>>;
  getProject(id: string): Promise<Result<ProjectSummary & { policies: unknown }, AdapterError>>;

  listCues(query: { projectId: string; filter?: CueFilter; sort: CueSort; cursor?: string; limit: number }): Promise<Result<Page<Cue>, AdapterError>>;
  updateCue(id: string, patch: { text?: string; lines?: string[]; timeStart?: number; timeEnd?: number }, baseRevision: number): Promise<Result<Cue, AdapterError>>;
  nudgeTiming(id: string, frameDelta: number): Promise<Result<Cue, AdapterError>>;
  splitCue(id: string, atTextOffset: number): Promise<Result<{ original: Cue; created: Cue }, AdapterError>>;
  suggestBreaks(id: string): Promise<Result<{ options: { lines: string[]; ruleNote: string }[] }, AdapterError>>;
  bulkApply(input: { projectId: string; scope: { cueIds?: string[] }; policy: 'numerals'|'tashkeel'|'break-rules' }): Promise<Result<Job<{ applied: number; skipped: string[] }>, AdapterError>>;

  listPresets(query: { cursor?: string; limit: number }): Promise<Result<Page<StylePreset>, AdapterError>>;
  savePreset(preset: Omit<StylePreset, 'id' | 'version'> & { id?: string }): Promise<Result<StylePreset, AdapterError>>;
  importPreset(spec: unknown): Promise<Result<StylePreset, AdapterError>>; // validated; conflicts listed in details

  requestPreview(input: { projectId: string; presetId: string; atMs: number }): Promise<Result<Job<{ stillRef: string }>, AdapterError>>;

  exportProject(input: { projectId: string; presetId: string; formats: ('srt'|'vtt'|'burnin-spec'|'stills-bundle')[] }): Promise<Result<Job<{ artifacts: { format: string; artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string }, AdapterError>>;
  renewArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string }, AdapterError>>;

  getUsage(): Promise<Result<{ window: string; exports: number; minutesRefined: number; resetAt: string }, AdapterError>>;
}
```

## Rules
1. `updateCue` stale baseRevision → CONFLICT with both cue versions.
2. `createProject` and `exportProject` are idempotent-capable Jobs; per-format partial results follow async-contract §4.
3. `suggestBreaks` is read-only (declared computation) — the workbench never mutates without `updateCue`.
4. Cues with `state: 'proposed'` watermark exports (flag surfaces in the artifact and UI per CP-4).
5. No orphan methods: traced to CP-1…CP-4 / S1–S9 at Critic pass.
