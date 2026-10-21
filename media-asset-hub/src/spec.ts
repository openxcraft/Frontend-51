// GENERATED from specs-source/media-asset-hub/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "media-asset-hub",
 "title": "Media Asset Hub",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "AssetHubAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Nakhl Spruce",
  "pairing": "P07",
  "radius": "8px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "minimal",
  "fonts": [
   "Readex Pro",
   "DM Sans"
  ],
  "primary": "#29836D",
  "accent": "#005B4A",
  "canvas": "#7DB1A2"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Library home",
   "purpose": "grid, dual-script search, filter builder, action bar",
   "shell": "",
   "data": "listAssets, listTags, listCollections, getSession",
   "archetype": "editor-studio"
  },
  {
   "id": "S2",
   "name": "Asset detail (drawer/full)",
   "purpose": "bilingual metadata, variants, rights, extracted text",
   "shell": "",
   "data": "getAsset, updateAssetMetadata, updateExtractedText, archiveAssets, createTag, applyTags, setRightsRecord",
   "archetype": "list-console"
  },
  {
   "id": "S3",
   "name": "Ingest console",
   "purpose": "staging, staged progress, extraction + tag review",
   "shell": "Ingest console",
   "data": "createIngestJob, getIngestJob, submitTagReview, retryIngestItems, cancelIngestJob, listTags, applyTags, getUsage",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "Collections",
   "purpose": "list + ordered view, export",
   "shell": "",
   "data": "listCollections, getCollection, createCollection, updateCollection, modifyCollectionAssets, listAssets",
   "archetype": "jobs-centre"
  },
  {
   "id": "S5",
   "name": "Rights review",
   "purpose": "state buckets, record editing",
   "shell": "Rights review",
   "data": "listRightsAlerts, setRightsRecord, getAsset",
   "archetype": "review-queue"
  },
  {
   "id": "S6",
   "name": "Activity",
   "purpose": "jobs history + log (T3-consolidated job center, async-contract §7)",
   "shell": "",
   "data": "listIngestJobs, listActivity, cancelIngestJob, retryIngestItems",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Settings",
   "purpose": "locale, capability status + consent, quota",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Ingest → extraction → auto-tag review → publish (value proof)",
   "steps": [
    "Ingest console (S3): drag-drop or file-pick ≤50 mixed files; per-file size/type readout before upload (P09).",
    "Batch defaults once: rights basis, optional target collection, extraction toggle with capability disclosure (08 consent).",
    "submitTagReview records decisions (actor+timestamp → P17). Untouched suggestions expire after a declared 7-day window — never auto-promote.",
    "Publish: bilingual metadata defaults (filename-derived title in the filename's script; empty twin flagged, never fake-translated).",
    "Completion per async-contract §6: in-context if visible, else Activity surfaces it on re-entry.",
    "*Recovery: cancelIngestJob real and fast; partial artifacts kept; job history re-enterable."
   ]
  },
  {
   "title": "CP-2 — Bilingual & in-asset search (daily loop)",
   "steps": [
    "Focus dual-script search bar (\"/\"); type either script — direction auto-detected; bar announces index scopes (metadata + tags + in-asset text).",
    "Open asset → metadata drawer with hit context preserved (scroll-to + highlight; extracted-text panel shows the matching line).",
    "*Recovery: local query history; re-run one keypress."
   ]
  },
  {
   "title": "CP-3 — Metadata stewardship (bilingual parity work)",
   "steps": [
    "Asset detail (S2): inline edit bilingual fields (P06 — display = edit surface; Escape cancels/restores; Tab commits/advances; focus returns to trigger).",
    "Bilingual alt text is first-class with its own completeness flag — missing alt is a visible gap.",
    "Tags: add existing bilingual tags (searchable picker), create with both names (missing twin flagged, never machine-filled), remove with undo (P03).",
    "Autosave per field group (P10: saving → saved-fades → conflict → offline-queued); conflict shows both versions — no silent overwrite.",
    "Archive not delete: archiveAssets leaves default views, reversible via undo; permanent deletion out of v1 (12 Q-7).",
    "*Failures: stale revision (CONFLICT, both versions); offline (queued writes, P20).",
    "*Recovery: field revisions retained; activity log records actor-action-target-timestamp (P17)."
   ]
  },
  {
   "title": "CP-4 — Collection assembly (briefs and handoffs)",
   "steps": [
    "\"Add to collection\" from results/detail, or range-select → action bar (P07) → bulk add; selection fully keyboard-complete.",
    "Create inline: bilingual name + notes; cover = first asset (changeable; keyboard reorder — 2.5.7).",
    "Collection view (S4): ordered set, per-asset notes; drag reorder with keyboard equivalent; remove with undo.",
    "Update collection metadata (versioned save; conflict handling).",
    "*Failures: export job failure (typed error; per-file retry for packages — partial policy); concurrent edit (CONFLICT, both kept).",
    "*Recovery: collection versions restorable; exports regenerable."
   ]
  },
  {
   "title": "CP-5 — Rights & expiry review (hygiene loop)",
   "steps": [
    "Rights console (S5): buckets expiring-soon (≤30 days) / expired / unknown-rights; counts per state, keyboard-navigable.",
    "Open record: bilingual usage terms, credit, license reference, valid-from/expires-at (Gregorian storage; dual-calendar display P24 with method disclosure).",
    "setRightsRecord: extend, change basis, add restrictions; every change appends to the activity log (append-only history).",
    "Expired assets carry a persistent non-modal state in the library (badge + filter) and \"usage paused\" semantics in exports — never silently hidden or removed.",
    "Weekly digest option via notification ladder (P21, digest tier, user-controlled); manual alternative = the console (08).",
    "*Failures: rights update failure (typed error; record unchanged).",
    "*Recovery: rights history retained per asset."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "No text-extraction capability: in-asset search covers pasted transcriptions only; drawer offers paste per asset (LOOP-5).",
    "No object storage credential (link-catalog mode — 08): metadata + external link; kind glyphs replace thumbnails; search/collections/rights fully functional.",
    "First-run: P01 first-run with sample dataset + ingest CTA; P22 value checklist, no tours.",
    "Offline: cached reads; metadata edits queue (P20); ingest blocked honestly."
   ]
  }
 ],
 "components": [
  {
   "name": "AssetGrid",
   "purpose": "virtualized bilingual tile grid",
   "obligations": "Virtualizes >200 tiles (P19): scroll never moves focus; row/filtered counts announced on region entry; tile = thumbnail OR duotone kind glyph (link-catalog mode) + filename (bidi-isolated, dir=\"auto\") + state badges (archived, rights-expired, in-asset-text). Keyboard: arrows traverse (inline-end = next, both directions), Enter opens drawer, Space selects, Shift+arrow range; focus 2.4.13 strength; selection never color-only (checkmark + border). Hover = border+opacity only. Skeleton mirrors tile geometry RTL-flipped."
  },
  {
   "name": "DualScriptSearchBar",
   "purpose": "single input, either script, multi-index search",
   "obligations": "Script auto-detection sets direction; suggestions grouped (recent/assets/tags), debounced ≤150ms perceived; active scopes announced (\"searching metadata, tags, and in-asset text\"); normalization disclosure chip when normalization fired (rtl-rules §4); \"/\" focuses; Escape clears + restores prior results."
  },
  {
   "name": "FilterBuilder",
   "purpose": "faceted predicates (P08)",
   "obligations": "Facets: kind, tag, collection, rights state, date range, has-in-asset-text. Removable chips with accessible predicate descriptions; filtered state declares itself; state serializes to URL (shareable saved-view links without backend — 12 Q-8); filtered-empty offers reset (P01)."
  },
  {
   "name": "MetadataDrawer",
   "purpose": "contextual bilingual editing (P06/P10/P23)",
   "obligations": "Paired ar/en fields with parity indicators: in-sync / one-side-empty (flagged, never machine-filled) / length-far-apart (keywords only, 3:1 char threshold). Inline edit: Escape cancels, Tab commits/advances, focus returns to trigger; autosave cycle visible (P10); conflict shows both versions. Alt-text completeness flag is a visible gap. Extracted-text panel states provenance (machine+confidence / human-pasted) — never hidden."
  },
  {
   "name": "TagReviewList",
   "purpose": "ingest auto-tag review (P15)",
   "obligations": "One row per suggestion: bilingual chip + source note + confidence; accept/edit/reject (A/E/R), full keyboard path; batch-accept names scope; untouched suggestions show 7-day expiry countdown, never auto-promote; in manual mode the same component is an empty bilingual entry list — identical shape, zero AI dependency."
  },
  {
   "name": "RightsBadge",
   "purpose": "per-asset rights state",
   "obligations": "ok / unknown / expiring-soon (amber, days-left) / expired (critical, \"usage paused\"); text+icon never color-only; Western numerals; long Arabic terms truncate at word boundaries with tooltip."
  }
 ],
 "ops": [
  "getSession",
  "listAssets",
  "getAsset",
  "updateAssetMetadata",
  "archiveAssets",
  "updateExtractedText",
  "createIngestJob",
  "getIngestJob",
  "listIngestJobs",
  "cancelIngestJob",
  "retryIngestItems",
  "submitTagReview",
  "listTags",
  "createTag",
  "applyTags",
  "listCollections",
  "getCollection",
  "createCollection",
  "updateCollection",
  "modifyCollectionAssets",
  "setRightsRecord",
  "listRightsAlerts",
  "getUsage",
  "listActivity"
 ],
 "entities": [
  {
   "name": "BilingualText",
   "fields": [
    {
     "name": "ar",
     "optional": false,
     "type": "string | null; en: string | null }"
    },
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "language",
     "optional": false,
     "type": "Locale | 'mixed'"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'machine-extracted' | 'human-pasted'"
    },
    {
     "name": "confidence",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "extractedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "BilingualMetadata",
   "fields": [
    {
     "name": "title",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "description",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "keywords",
     "optional": false,
     "type": "BilingualKeywords"
    },
    {
     "name": "altText",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "creditLine",
     "optional": false,
     "type": "BilingualText"
    }
   ]
  },
  {
   "name": "AssetTag",
   "fields": [
    {
     "name": "tagId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'applied' | 'suggested'"
    },
    {
     "name": "suggestedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "confidence",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "AssetVariant",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; assetId: string"
    },
    {
     "name": "role",
     "optional": false,
     "type": "'original' | 'thumbnail' | 'preview' | 'audio-waveform'"
    },
    {
     "name": "widthPx",
     "optional": true,
     "type": "number; heightPx?: number; durationSeconds?: number"
    },
    {
     "name": "sizeBytes",
     "optional": false,
     "type": "number; mimeType: string; createdAt: string"
    }
   ]
  },
  {
   "name": "RightsRecord",
   "fields": [
    {
     "name": "assetId",
     "optional": false,
     "type": "string; basis: RightsBasis"
    },
    {
     "name": "usageTerms",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "licenseReference",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "validFrom",
     "optional": false,
     "type": "string | null; expiresAt: string | null"
    },
    {
     "name": "restrictions",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string; revision: number"
    }
   ]
  },
  {
   "name": "Asset",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; workspaceId: string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "AssetKind"
    },
    {
     "name": "fileName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "AssetStatus"
    },
    {
     "name": "metadata",
     "optional": false,
     "type": "BilingualMetadata"
    },
    {
     "name": "tags",
     "optional": false,
     "type": "AssetTag[]"
    },
    {
     "name": "extractedText",
     "optional": false,
     "type": "ExtractedText | null"
    },
    {
     "name": "variants",
     "optional": false,
     "type": "AssetVariant[]"
    },
    {
     "name": "sourceLink",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "ingestedBy",
     "optional": false,
     "type": "string; ingestedAt: string; updatedAt: string"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "Tag",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; name: BilingualText; usageCount: number; createdAt: string }"
    },
    {
     "name": "id",
     "optional": false,
     "type": "string; workspaceId: string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "BilingualText; description: BilingualText"
    },
    {
     "name": "assetIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "coverAssetId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "createdBy",
     "optional": false,
     "type": "string; createdAt: string; updatedAt: string; version: number"
    }
   ]
  },
  {
   "name": "IngestItem",
   "fields": [
    {
     "name": "fileId",
     "optional": false,
     "type": "string; fileName: string; sizeBytes: number; mimeType: string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "IngestItemState"
    },
    {
     "name": "stagesCompleted",
     "optional": false,
     "type": "IngestStage[]; currentStage?: IngestStage"
    },
    {
     "name": "error",
     "optional": true,
     "type": "{ code: string; message: string }"
    },
    {
     "name": "resultingAssetId",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "IngestJob",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; workspaceId: string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired'"
    },
    {
     "name": "items",
     "optional": false,
     "type": "IngestItem[]"
    },
    {
     "name": "progress",
     "optional": false,
     "type": "{ determinate: boolean; done: number; total: number }"
    },
    {
     "name": "options",
     "optional": false,
     "type": "{ extractionEnabled: boolean; autoTagEnabled: boolean; rightsBasis: RightsBasis; targetCollectionId: string | null }"
    },
    {
     "name": "createdBy",
     "optional": false,
     "type": "string; createdAt: string"
    },
    {
     "name": "idempotencyKey",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ActivityEntry",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; workspaceId: string; actor: string"
    },
    {
     "name": "targetAssetId",
     "optional": true,
     "type": "string; targetCollectionId?: string; at: string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "Library first-run",
   "\"Your library is empty. Ingest your first batch — or load the sample archive to see search work on bilingual files.\"",
   "\"مكتبتك فارغة. أدخل أول دفعة ملفات — أو حمّل الأرشيف النموذجي لترى البحث يعمل على ملفات ثنائية اللغة.\"",
   "Ingest files / Load sample",
   "Library archive view (no-data-after-activity)"
  ],
  "loading": [
   "Library grid",
   "tile skeletons ×24 (fixed aspect) + SR: \"Loading your library…\"",
   "هياكل بلاطات ×24 + \"جارٍ تحميل مكتبتك…\"",
   "Drawer boot",
   "field skeletons per pair + SR: \"Opening «{fileName}»\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (file over cap)",
   "\"One file exceeds the 2 GB cap — «{fileName}» is 3.4 GB. Skip it or remove it from the batch.\"",
   "\"ملف واحد يتجاوز حد 2 غيغابايت — «{اسم الملف}» بحجم 3.4 غيغابايت. تجاوزه أو أزله من الدفعة.\"",
   "VALIDATION (past expiry)"
  ],
  "success": [
   "Batch published",
   "\"12 files published — 38 tag suggestions await review.\"",
   "\"نُشر 12 ملفاً — 38 اقتراح وسم بانتظار المراجعة.\"",
   "Tag accepted",
   "\"Tag «مقابلة / interview» applied to 12 assets.\""
  ]
 },
 "briefLine": "It is deliberately a library, not an editor: it stores, describes, finds, and packages assets — never modifies them. Teams assemble ordered collections with bilingual notes for briefs and handoffs, maintain rights records per asset (usage terms, credit, expiry with an expiring-soon console), and export packages or manifests. Everything the UI knows of backends it knows through AssetHubAdapterV1; every external capability (object storage, text extraction, auto-tagging, notifications) is abstract in 08 with a manual alternative — link-catalog mode, pasted transcriptions, manual bilingual tagging — so the library is fully usable pre-integration."
} as const;
export type Spec = typeof SPEC;
