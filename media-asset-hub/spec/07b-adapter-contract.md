# 07b — Adapter Contract: media-asset-hub (TypeScript, v1)

SME-G pass. TYPES ONLY. Entity types are defined in 07a and referenced by name below (`BilingualMetadata`, `AssetTag`, `ExtractedText`, `AssetVariant`, `RightsRecord`, `Tag`, `Collection`, `IngestJob`, `ActivityEntry`, `UsageWindow`, `AssetQuery`). LOOP-15 satisfied: exact 7-class taxonomy, typed pagination, auth-agnostic session. Every operation traces to ≥1 flow (03 coverage table; no orphans).

```ts
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
```

## Rules

1. **Suggested tags are drafts**: `submitTagReview` is the only path from `suggested` → `applied`; suggestions expire after the declared window, never auto-apply (P15, 03 CP-1.6).
2. **Ingest partial policy**: per-item states + per-item retry; a failed item never fails the job (async-contract §4); repeated `idempotencyKey` returns the existing job, never a duplicate.
3. **Concurrency**: stale `baseRevision`/`baseVersion` → CONFLICT with both payloads in `details`; UI shows both (P10). `archiveAssets` is Level-1 destructive (undo window in response — P03/P04).
4. **`updateExtractedText`** always records `source: 'human-pasted'`, `confidence: null` — human provenance never laundered as machine extraction (ai-native-patterns §6); pasted text indexes identically for search.
5. **Search normalization** (alef/hamza, taa marbuta/heh, yaa forms, tashkeel) applies at BOTH index and query time adapter-side; cursors stable per filter-state.
6. **Rate limits** apply only to metered ingest stages (extraction runs, auto-tag batches) — `listAssets`, metadata, collections, rights, activity are NEVER rate-limited.
7. **No orphans**: 24/24 operations traced in 03's coverage table.
8. **Auth-agnostic**: no credential semantics here; capability credentials (object storage, text extraction, notification channel) are workspace-level abstract bindings per credential-contract — surfaced via job-stage errors, not vendor states.
