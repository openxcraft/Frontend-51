// VERBATIM from specs-source/arabic-copy-studio/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below. Implementation corrections applied: 1 (see portfolio SPEC_DEFECTS.md; specs-source untouched).
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// ===== Foundation (shared contract shapes) =====
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;            // developer-facing; user copy comes from 11 matrix
  correlationId: string;      // surfaces in UnknownError user copy (copy-voice §1.4)
  retryable: boolean;
  details?: Record<string, string[]>; // field → issues (ValidationError)
}

export interface Session { memberId: string; workspaceId: string; role: 'owner'|'editor'; locale: 'ar'|'en'; }
// Auth acquisition is OUT of contract scope: implementations resolve the session
// however their environment dictates. The UI never sees a provider.

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ===== Domain types (mirror 07a) =====
export type Register = 'mSA-plain' | 'mSA-middle' | 'dialectTolerant';
export type DocStatus = 'draft'|'in-review'|'approved'|'amended'|'archived';
export interface DocumentSummary {
  id: string; title: string; locale: 'ar'|'en'; register: Register;
  status: DocStatus; updatedAt: string; pairedDocumentId: string | null;
}
export interface Block { kind: 'paragraph'|'heading'|'list'|'cta'; text: string; }
export interface Document {
  id: string; title: string; locale: 'ar'|'en'; register: Register;
  tashkeelEnabled: boolean; dialectFlag: { none: true } | { detected: string } | { accepted: string };
  blocks: Block[]; status: DocStatus; currentRevisionId: string;
  pairedDocumentId: string | null; updatedAt: string;
}
export interface DocumentFilter {
  status?: DocStatus[]; locale?: ('ar'|'en')[]; register?: Register[];
  collectionId?: string; editedSince?: string;
}
export type DocumentSort = 'updatedAt' | 'createdAt' | 'title';
export interface CursorQuery<F, S> {
  filter?: F; sort: S; sortDir: 'asc'|'desc'; search?: string; // search is Arabic-normalized server-side (rtl-rules §4)
  cursor?: string; limit: number;
}
export interface Revision { id: string; createdAt: string; actorId: string; changeSummary: string; }

export interface GenerationBrief {
  assetType: 'campaign'|'productDescription'|'email'|'socialPost'|'adCopy';
  audience: string; keyPoints: string[]; lengthTarget: { words: number; policy: 'strict'|'comfortable' };
  register: Register; locale: 'ar'|'en'; glossaryEnforced: boolean;
}
export interface GenerationHandle { id: string; createdAt: string; }
export type StreamEvent =
  | { type: 'token'; text: string }
  | { type: 'anchor'; spanStart: number; spanEnd: number; anchorId: string }
  | { type: 'citation'; anchorId: string; source: { title: string; url: string } }
  | { type: 'stalled'; sinceMs: number }
  | { type: 'quotaBlocked'; rung: 2 | 3 | 4; resetAt: string }  // ai-native-patterns §5 ladder
  | { type: 'done'; wordCount: number }
  | { type: 'failed'; error: AdapterError };
export type StreamSink = (event: StreamEvent) => void;

export interface TransformInput {
  sourceDocumentId: string; targetLocale: 'ar'|'en'; targetRegister: Register;
  lengthPolicy: 'strict'|'comfortable'; glossaryEnforced: boolean;
}
export interface TextInspection {
  text: string; checks: ('register'|'dialect'|'glossary'|'bannedTerms')[]; glossaryScope?: 'document'|'batch';
}
export interface InspectionReport {
  registerDrift: { spanStart: number; spanEnd: number; current: string; expected: Register }[];
  dialect: { region: string; confidence: number } | null;
  glossaryHits: { termId: string; spanStart: number; spanEnd: number; kind: 'preferred'|'miss'|'banned' }[];
}
export interface GlossaryTerm {
  id: string; termAr: string; termEn: string; definition: string;
  doNotUse: string[]; register: Register; conflictGroup: string | null;
}
export interface Job<T> { id: string; kind: string; state: 'queued'|'running'|'awaiting-input'|'succeeded'|'failed'|'cancelled'|'expired';
  progress: { determinate: boolean; done?: number; total?: number }; partial?: T; result?: T; error?: AdapterError; }

// ===== The Adapter (v1) =====
export interface ContentStudioAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  listDocuments(query: CursorQuery<DocumentFilter, DocumentSort>): Promise<Result<Page<DocumentSummary>, AdapterError>>;
  getDocument(id: string): Promise<Result<Document, AdapterError>>;
  createDocument(input: { title: string; locale: 'ar'|'en'; register: Register; blocks?: Block[] }): Promise<Result<Document, AdapterError>>;
  updateBlocks(id: string, blocks: Block[], baseRevisionId: string): Promise<Result<{ document: Document; revision: Revision }, AdapterError>>;
  updateDocumentStatus(id: string, status: DocStatus): Promise<Result<Document, AdapterError>>;

  startGeneration(brief: GenerationBrief): Promise<Result<GenerationHandle, AdapterError>>;
  subscribeGeneration(handle: GenerationHandle, sink: StreamSink): Promise<() => void>; // returns unsubscribe
  stopGeneration(handle: GenerationHandle): Promise<Result<{ partialText: string }, AdapterError>>;

  startRefinement(input: { documentId: string; spanStart: number; spanEnd: number; kind: 'rewrite'|'tighten'|'register'|'glossary'; note?: string }): Promise<Result<GenerationHandle, AdapterError>>;
  acceptSuggestion(input: { documentId: string; replacement: string; spanStart: number; spanEnd: number; baseRevisionId: string }): Promise<Result<{ document: Document; revision: Revision }, AdapterError>>;

  transformContent(input: TransformInput): Promise<Result<Job<{ pairedDocumentId: string }>, AdapterError>>;
  getJob(id: string): Promise<Result<Job<unknown>, AdapterError>>;
  retryJob(id: string, scope: 'failed-items-only'): Promise<Result<Job<unknown>, AdapterError>>;
  cancelJob(id: string): Promise<Result<{ cancelled: true }, AdapterError>>;

  inspectText(input: TextInspection): Promise<Result<InspectionReport, AdapterError>>;

  listGlossaryTerms(query: CursorQuery<{ conflictOnly?: boolean }, 'termAr'>): Promise<Result<Page<GlossaryTerm>, AdapterError>>;
  upsertGlossaryTerm(term: Omit<GlossaryTerm, 'id'> & { id?: string }): Promise<Result<GlossaryTerm, AdapterError>>;
  resolveGlossaryConflict(conflictGroup: string, keepTermId: string): Promise<Result<{ resolved: true }, AdapterError>>;
  importGlossary(source: { format: 'csv'|'tsv'; content: string }): Promise<Result<Job<{ imported: number; conflicts: string[] }>, AdapterError>>;

  getBrandKit(): Promise<Result<BrandKit, AdapterError>>;
  updateBrandKit(kit: BrandKit): Promise<Result<BrandKit, AdapterError>>;

  addComment(input: { documentId: string; blockIndex: number; body: string }): Promise<Result<Comment, AdapterError>>;
  approveDocument(id: string, note?: string): Promise<Result<{ document: Document; revision: Revision }, AdapterError>>;

  exportDocument(id: string, format: 'plain'|'doc'|'bundle', options: { watermark?: 'ai-assisted' }): Promise<Result<Job<{ artifactId: string; expiresAt: string }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string }, AdapterError>>;

  getUsage(): Promise<Result<{ window: string; used: number; rung: 1|2|3|4; resetAt: string }, AdapterError>>;
}

// ===== Implementation correction (SPEC_DEFECTS.md) =====
export interface BrandKit { id: string; workspaceId: string; voiceTraits: string[]; sampleCopy: string[]; bannedTerms: string[]; registerHint?: string; } // SPEC_DEFECTS A: defined from 07a prose fields

