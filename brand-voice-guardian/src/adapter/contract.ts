// VERBATIM from specs-source/brand-voice-guardian/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below. Implementation corrections applied: 1 (see portfolio SPEC_DEFECTS.md; specs-source untouched).
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
export type Result<T, E extends AdapterError = AdapterError> = { ok: true; data: T } | { ok: false; error: E };
export type ErrorCode = 'VALIDATION'|'NOT_FOUND'|'PERMISSION'|'CONFLICT'|'RATE_LIMIT'|'NETWORK'|'UNKNOWN';
export interface AdapterError { code: ErrorCode; message: string; correlationId: string; retryable: boolean; details?: Record<string,string[]>; }
export interface Session { memberId: string; workspaceId: string; role: 'owner'|'checker'; locale: 'ar'|'en'; }
export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export type Register = 'mSA-plain' | 'mSA-middle';
export interface BrandProfile {
  id: string; name: string; declaredRegister: Register; locales: ('ar'|'en')[];
  health: { terms: number; banned: number; samples: number; regulatedPhrases: number; calibrated: boolean };
  version: number;
}
export interface CheckInput { profileId: string; text: string; label?: string; }
export type FindingClass = 'terminology'|'banned'|'register'|'consistency';
export interface Finding {
  id: string; runId: string; class: FindingClass; spanStart: number; spanEnd: number; excerpt: string;
  ruleId: string; suggestion?: string; state: 'open'|'accepted'|'dismissed'; dismissReason?: string;
  resolvedBy?: string; resolvedAt?: string;
}
export interface CheckRun { id: string; profileId: string; profileVersion: number; state: 'queued'|'running'|'succeeded'|'failed';
  progress: { determinate: boolean; done?: number; total?: number };
  counts?: Record<FindingClass, number>; degraded?: { registerHeuristicOnly: boolean }; error?: AdapterError; }
export interface RecordSummary { id: string; runId: string; actorId: string; at: string; profileVersion: number; findingsResolved: number; findingsOpen: number; }
export interface Job<T> { id: string; kind: string; state: 'queued'|'running'|'awaiting-input'|'succeeded'|'failed'|'cancelled'|'expired'; progress: { determinate: boolean; done?: number; total?: number }; result?: T; error?: AdapterError; }

export interface GuardianAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  listProfiles(query: { cursor?: string; limit: number }): Promise<Result<Page<BrandProfile>, AdapterError>>;
  getProfile(id: string): Promise<Result<BrandProfile & { terms: unknown[]; banned: unknown[] }, AdapterError>>;
  createProfile(input: { name: string; declaredRegister: Register; locales: ('ar'|'en')[] }): Promise<Result<BrandProfile, AdapterError>>;
  updateProfile(id: string, patch: { name?: string; declaredRegister?: Register; terms?: TermInput[]; banned?: BannedInput[] }, baseVersion: number): Promise<Result<BrandProfile, AdapterError>>;
  importTerms(profileId: string, source: { format: 'csv'|'tsv'; content: string }): Promise<Result<Job<{ imported: number; conflicts: string[] }>, AdapterError>>;
  calibrate(profileId: string, samples: string[]): Promise<Result<Job<{ thresholds: string[] }>, AdapterError>>;

  runCheck(input: CheckInput): Promise<Result<CheckRun, AdapterError>>;
  getRun(runId: string): Promise<Result<CheckRun, AdapterError>>;
  listFindings(query: { runId: string; filter?: { class?: FindingClass[]; state?: ('open'|'accepted'|'dismissed')[] }; sort: 'position'|'class'; cursor?: string; limit: number }): Promise<Result<Page<Finding>, AdapterError>>;
  resolveFinding(findingId: string, resolution: { kind: 'accept' } | { kind: 'dismiss'; reason: string }): Promise<Result<Finding, AdapterError>>;
  bulkResolve(runId: string, scope: { class?: FindingClass }): Promise<Result<Job<{ resolved: number; skipped: number }>, AdapterError>>;

  listRecords(query: { filter?: { since?: string; profileId?: string; authorId?: string }; cursor?: string; limit: number }): Promise<Result<Page<RecordSummary>, AdapterError>>;
  getRecord(id: string): Promise<Result<RecordSummary & { findings: Finding[] }, AdapterError>>;

  exportReport(input: { recordIds: string[] }): Promise<Result<Job<{ artifactId: string; expiresAt: string }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string }, AdapterError>>;

  getUsage(): Promise<Result<{ window: string; checks: number; exports: number; resetAt: string }, AdapterError>>;
}

// ===== Implementation correction (SPEC_DEFECTS.md) =====
export interface TermInput { termAr?: string; termEn?: string; definition?: string; doNotUse?: string[]; conflictGroup?: string | null; } export interface BannedInput { term: string; severity?: string; note?: string; } // SPEC_DEFECTS A: from 07a prose (GlossaryTerm/BannedTerm)

