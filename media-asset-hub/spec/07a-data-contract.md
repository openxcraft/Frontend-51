# 07a — Data Contract: media-asset-hub

SME-G pass. Backend-agnostic. TypeScript TYPES ONLY. AI declaration: **conditionally-AI** — two abstract capabilities (text extraction, auto-tagging) may bind behind ingest stages; both degrade to declared manual paths (08); core entities are AI-free.

```ts
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
```

## Relationships

Workspace 1—N Asset/Collection/IngestJob/ActivityEntry/Tag. Asset 1—N AssetVariant; 1—1 BilingualMetadata, RightsRecord; N—M Tag (stateful `AssetTag`); N—M Collection (ordered). IngestJob 1—N IngestItem; each succeeded item → one Asset.

## State obligations

- `AssetTag.state='suggested'` is never searchable as applied and never survives its review window unreviewed (suggestions expire, never promote — P15).
- `extractedText.source` provenance always surfaced; `confidence < 0.7` renders needs-review — search still matches; provenance explains (ai-native-patterns §7.4).
- `RightsStatus` derived at read; expiry transitions surfaced, never hidden (CP-5).
- `revision`/`version` are optimistic-concurrency tokens — stale writes return CONFLICT with both payloads (07b).
- Filenames/user text carry no script assumption; storage verbatim; bidi isolation is UI obligation (rtl-rules §2).
- Numerals/dates/sizes stored canonically (ISO/UTF-8/bytes); Western numeral rendering is display-only (ledger).
