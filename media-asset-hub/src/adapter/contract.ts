// VERBATIM from specs-source/media-asset-hub/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// ---------- Result & error taxonomy (EXACT 7 classes) ----------
export type Result<T> = { ok: true; data: T } | { ok: false; error: AdapterError };

export type ErrorCode =
  | 'VALIDATION'    // ValidationError  — rejected input (oversized file, empty export, past expiry)
  | 'NOT_FOUND'     // NotFoundError     — unknown id, archived-away link, expired artifact
  | 'PERMISSION'    // PermissionError   — wrong workspace, insufficient role
  | 'CONFLICT'      // ConflictError     — stale revision/version on concurrent writes
  | 'RATE_LIMIT'    // RateLimitError    — metered extraction/auto-tag quota window
  | 'NETWORK'       // NetworkError      — transport failure, offline
  | 'UNKNOWN';      // UnknownError      — unclassified, correlation-quoted

export interface AdapterError {
  code: ErrorCode;
  message: string;
  correlationId: string;
  retryable: boolean;
  details?: Record<string, string[]>;
}

// ---------- Session (auth-agnostic) & pagination ----------
export interface Session {
  memberId: string; workspaceId: string;
  role: 'owner' | 'librarian' | 'contributor';
  locale: 'ar' | 'en';
}
export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean }

// ---------- Wire shapes (07a entities unless noted) ----------
export interface AssetSummary {        // grid row; detail via getAsset
  id: string;
  kind: 'image' | 'video' | 'audio' | 'document' | 'other';
  fileName: string;
  status: 'processing' | 'published' | 'archived';
  title: { ar: string | null; en: string | null };
  hasExtractedText: boolean;
  rightsStatus: 'ok' | 'unknown' | 'expiring-soon' | 'expired';
  appliedTagCount: number; pendingTagCount: number;
  ingestedAt: string; updatedAt: string; revision: number;
}
export interface AssetDetail {
  summary: AssetSummary;
  metadata: BilingualMetadata;
  tags: AssetTag[];
  extractedText: ExtractedText | null;
  variants: AssetVariant[];
  rights: RightsRecord;
  sourceLink: string | null;
  ingestedBy: string; updatedAt: string; revision: number;
}
export type IngestJobState = IngestJob['state'];

// ---------- The contract (24 operations) ----------
export interface AssetHubAdapterV1 {
  getSession(): Promise<Result<Session>>;

  listAssets(query: AssetQuery): Promise<Result<Page<AssetSummary>>>;
  getAsset(id: string): Promise<Result<AssetDetail>>;

  updateAssetMetadata(id: string, metadata: BilingualMetadata, baseRevision: number)
    : Promise<Result<{ revision: number; updatedAt: string }>>;
  archiveAssets(ids: string[])
    : Promise<Result<{ archived: number; undoWindowSeconds: number }>>;
  updateExtractedText(id: string, text: string, language: 'ar' | 'en' | 'mixed')
    : Promise<Result<ExtractedText>>;   // manual transcription paste (LOOP-5)

  createIngestJob(input: {
    files: { fileId: string; fileName: string; sizeBytes: number; mimeType: string }[];
    options: IngestJob['options'];
    idempotencyKey: string;
  }): Promise<Result<IngestJob>>;
  getIngestJob(id: string): Promise<Result<IngestJob>>;
  listIngestJobs(query: { state?: IngestJobState[]; cursor?: string; limit: number })
    : Promise<Result<Page<IngestJob>>>;
  cancelIngestJob(id: string): Promise<Result<IngestJob>>;
  retryIngestItems(jobId: string, fileIds: string[]): Promise<Result<IngestJob>>;

  submitTagReview(assetId: string, decisions: {
    acceptTagIds: string[]; rejectTagIds: string[];
    editTagId?: string; editName?: Tag['name'];
  }): Promise<Result<{ applied: string[]; rejected: string[] }>>;
  listTags(query: { text?: string; cursor?: string; limit: number }): Promise<Result<Page<Tag>>>;
  createTag(input: { name: Tag['name'] }): Promise<Result<Tag>>;
  applyTags(assetIds: string[], tagIds: string[], mode: 'add' | 'remove')
    : Promise<Result<{ updatedAssets: number }>>;

  listCollections(query: { text?: string; cursor?: string; limit: number }): Promise<Result<Page<Collection>>>;
  getCollection(id: string): Promise<Result<Collection>>;
  createCollection(input: { name: Collection['name']; description: Collection['description'] })
    : Promise<Result<Collection>>;
  updateCollection(id: string, patch: {
    name?: Collection['name']; description?: Collection['description'];
    coverAssetId?: string | null; assetOrder?: string[];
  }, baseVersion: number): Promise<Result<Collection>>;
  modifyCollectionAssets(id: string, changes: { add?: string[]; remove?: string[] })
    : Promise<Result<Collection>>;

  setRightsRecord(assetId: string, rights: Omit<RightsRecord, 'assetId' | 'updatedAt' | 'revision'>)
    : Promise<Result<RightsRecord>>;
  listRightsAlerts(query: {
    status: ('ok' | 'unknown' | 'expiring-soon' | 'expired')[];
    expiringWithinDays?: number; cursor?: string; limit: number;
  }): Promise<Result<Page<{ asset: AssetSummary; rights: RightsRecord; daysLeft: number | null }>>>;

  getUsage(): Promise<Result<UsageWindow>>;
  listActivity(query: { action?: string[]; targetAssetId?: string; since?: string; cursor?: string; limit: number })
    : Promise<Result<Page<ActivityEntry>>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export interface BilingualText { ar: string | null; en: string | null }
export interface BilingualKeywords { ar: string[]; en: string[] }
export interface Workspace { id: string; name: string; defaultLocale: Locale; createdAt: string }
export type MemberRole = 'owner' | 'librarian' | 'contributor';
export type AssetKind = 'image' | 'video' | 'audio' | 'document' | 'other';
export type AssetStatus = 'processing' | 'published' | 'archived';
export interface ExtractedText {
  text: string;                       // may be mixed-script
  language: Locale | 'mixed';
  source: 'machine-extracted' | 'human-pasted';
  confidence: number | null;          // 0..1; null when human-pasted or extraction off
  extractedAt: string;                // ISO 8601
}
export interface BilingualMetadata {
  title: BilingualText;               // filename-derived default
  description: BilingualText;
  keywords: BilingualKeywords;
  altText: BilingualText;             // a11y obligation — first-class, completeness-flagged
  creditLine: BilingualText;
}
export interface AssetTag {
  tagId: string;
  state: 'applied' | 'suggested';     // 'suggested' = draft (P15)
  suggestedAt?: string;
  confidence?: number;                // auto-tag confidence; undefined for manual
}
export interface AssetVariant {
  id: string; assetId: string;
  role: 'original' | 'thumbnail' | 'preview' | 'audio-waveform';
  widthPx?: number; heightPx?: number; durationSeconds?: number;
  sizeBytes: number; mimeType: string; createdAt: string;
}
export type RightsBasis = 'owned' | 'licensed' | 'unknown';
export type RightsStatus = 'ok' | 'unknown' | 'expiring-soon' | 'expired'; // derived from basis+dates
export interface RightsRecord {
  assetId: string; basis: RightsBasis;
  usageTerms: BilingualText;
  licenseReference: string | null;
  validFrom: string | null; expiresAt: string | null;  // ISO dates; past ⇒ 'expired'
  restrictions: BilingualText;
  updatedAt: string; revision: number; // append-only history retained (CP-5)
}
export interface Asset {
  id: string; workspaceId: string;
  kind: AssetKind;
  fileName: string;                   // any script; bidi isolation = UI duty
  status: AssetStatus;
  metadata: BilingualMetadata;
  tags: AssetTag[];
  extractedText: ExtractedText | null;
  variants: AssetVariant[];           // empty in link-catalog mode
  sourceLink: string | null;          // link-catalog mode: external path/URL
  ingestedBy: string; ingestedAt: string; updatedAt: string;
  revision: number;                   // metadata optimistic-concurrency token
}
export interface Tag { id: string; name: BilingualText; usageCount: number; createdAt: string }
export interface Collection {
  id: string; workspaceId: string;
  name: BilingualText; description: BilingualText;
  assetIds: string[];                 // ordered (2.5.7 keyboard reorder)
  coverAssetId: string | null;
  createdBy: string; createdAt: string; updatedAt: string; version: number;
}
export type IngestStage = 'upload' | 'probe' | 'rendition' | 'text-extract' | 'auto-tag' | 'review';
export type IngestItemState = 'queued' | 'running' | 'awaiting-review' | 'succeeded' | 'failed' | 'cancelled';
export interface IngestItem {
  fileId: string; fileName: string; sizeBytes: number; mimeType: string;
  state: IngestItemState;
  stagesCompleted: IngestStage[]; currentStage?: IngestStage;
  error?: { code: string; message: string };   // typed per 07b taxonomy
  resultingAssetId?: string;
}
export interface IngestJob {
  id: string; workspaceId: string;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  items: IngestItem[];                // per-item partial policy
  progress: { determinate: boolean; done: number; total: number };
  options: { extractionEnabled: boolean; autoTagEnabled: boolean; rightsBasis: RightsBasis; targetCollectionId: string | null };
  createdBy: string; createdAt: string;
  idempotencyKey: string;
}
export interface ActivityEntry {
  id: string; workspaceId: string; actor: string;
  action:  // closed vocabulary, append-only (P17)
    | 'asset.ingested' | 'asset.published' | 'asset.archived' | 'asset.unarchived'
    | 'metadata.updated' | 'rights.updated' | 'extracted-text.pasted'
    | 'tag.created' | 'tag.applied' | 'tag.removed' | 'tag-review.submitted'
    | 'collection.created' | 'collection.updated' | 'collection.assets.modified'
    | 'job.cancelled' | 'job.retried';
  targetAssetId?: string; targetCollectionId?: string; at: string;
}
export interface AssetQuery {
  text?: string;                      // normalized both sides
  filter?: {
    kinds?: AssetKind[]; tagIds?: string[]; collectionId?: string;
    rightsStatus?: RightsStatus[]; hasExtractedText?: boolean;
    ingestedAfter?: string; ingestedBefore?: string;
  };
  sort: 'relevance' | 'ingestedAt' | 'updatedAt' | 'fileName';
  direction: 'asc' | 'desc';
  cursor?: string; limit: number;     // ≤60
}
export interface UsageWindow { window: string; extractionsUsed: number; autoTagBatchesUsed: number; resetAt: string }

