// VERBATIM from specs-source/content-remix-studio/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
export type Result<T, E extends AdapterError = AdapterError> = { ok: true; data: T } | { ok: false; error: E };
export type ErrorCode = 'VALIDATION'|'NOT_FOUND'|'PERMISSION'|'CONFLICT'|'RATE_LIMIT'|'NETWORK'|'UNKNOWN';
export interface AdapterError { code: ErrorCode; message: string; correlationId: string; retryable: boolean; details?: Record<string,string[]>; }
export interface Session { memberId: string; workspaceId: string; role: 'owner'|'editor'; locale: 'ar'|'en'; }
export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export type RecipeKind = 'thread'|'carouselOutline'|'emailTeaser'|'shortVideoScript'|'communityAnnouncement';
export interface SourceSummary { id: string; title: string; language: 'ar'|'en'|'mixed'; dialectFlag: { none: true } | { detected: string }; words: number; version: number; updatedAt: string; }
export interface Recipe {
  id: string; scope: 'stock'|'workspace'; kind: RecipeKind; version: number;
  structureMap: { role: string; minLength: number; maxLength: number; toneNote?: string }[];
  bilingualPolicy: 'mono' | 'paired';
}
export interface DerivativeBlock { role: string; text: string; }
export interface ReceiptLink { sourceSpanStart: number; sourceSpanEnd: number; derivativeBlockIndex: number; ratio: number; kind: 'drawn'|'condensed'|'recipe-added'; }
export interface Derivative {
  id: string; sourceId: string; sourceVersion: number; recipeId: string; recipeVersion: number;
  locale?: 'ar'|'en'; blocks: DerivativeBlock[]; status: 'draft'|'ready'|'exported-versions-exist';
  editedBeyondRecipe: boolean; revision: number;
  receipt: ReceiptLink[]; dialectResolution?: 'preserved'|'flagged';
}
export interface Job<T> { id: string; kind: string; state: 'queued'|'running'|'awaiting-input'|'succeeded'|'failed'|'cancelled'|'expired';
  progress: { determinate: boolean; done?: number; total?: number }; partial?: T; result?: T; error?: AdapterError; }

export interface RemixAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  listSources(query: { filter?: { language?: ('ar'|'en'|'mixed')[]; dialectOnly?: boolean }; sort: 'updatedAt'|'title'; cursor?: string; limit: number }): Promise<Result<Page<SourceSummary>, AdapterError>>;
  createSource(input: { title: string; text: string }): Promise<Result<SourceSummary, AdapterError>>;
  updateSource(id: string, text: string, baseVersion: number): Promise<Result<SourceSummary, AdapterError>>;

  listRecipes(query: { scope?: ('stock'|'workspace')[]; kind?: RecipeKind[]; cursor?: string; limit: number }): Promise<Result<Page<Recipe>, AdapterError>>;
  saveRecipe(recipe: Omit<Recipe, 'version'> & { id?: string }, baseVersion?: number): Promise<Result<Recipe, AdapterError>>;
  validateRecipe(structureMap: Recipe['structureMap']): Promise<Result<{ valid: boolean; issues: string[] }, AdapterError>>;

  runRecipe(input: { sourceId: string; recipeId: string; dialectResolution: 'preserved'|'flagged'; locales?: ('ar'|'en')[] }): Promise<Result<Job<{ derivativeId: string }>, AdapterError>>;
  getDerivative(id: string): Promise<Result<Derivative, AdapterError>>;
  listDerivatives(query: { filter?: { status?: Derivative['status'][]; sourceId?: string }; sort: 'updatedAt'; cursor?: string; limit: number }): Promise<Result<Page<Derivative>, AdapterError>>;
  updateDerivative(id: string, blocks: DerivativeBlock[], baseRevision: number): Promise<Result<Derivative, AdapterError>>;
  regenerate(id: string, scope: { blockIndex: number } | { whole: true; editPolicy: 'preserve'|'discard' }): Promise<Result<Job<{ derivativeId: string }>, AdapterError>>;
  setDerivativeStatus(id: string, status: 'ready'): Promise<Result<Derivative, AdapterError>>;

  exportDerivatives(ids: string[], format: 'text-bundle' | 'clipboard-bundle', options: { watermark?: 'remixed-from-source' }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string }, AdapterError>>;

  getUsage(): Promise<Result<{ window: string; runs: number; exports: number; resetAt: string }, AdapterError>>;
}

