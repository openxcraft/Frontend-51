# 04 — Information Architecture: media-asset-hub

## Navigation model

Left rail (mirrors RTL): Library · Collections · Ingest · Rights · Activity. Metadata drawer is a contextual zone of Library, not a destination. ⌘K/Ctrl+K palette (P05 — Tier 3 with >3 list surfaces) reaches assets, collections, tags, nav actions; bilingual search with Arabic normalization (rtl-rules §4), grouped keyboard-selectable results. Two levels: section → item; asset detail is the grid's contextual expansion (drawer → full-screen at <768px).

Breakpoints: ≥1280 rail + grid + persistent drawer; 768–1279 drawer as overlay sheet; <768 single-column grid, rail → bottom tabs (Library/Collections/Ingest/Activity; Rights = Library filter + Activity alert), drawer full-screen, metadata read-only. Ingest console and bulk review are desktop/tablet surfaces.

## Entity overview (07a)

Workspace 1—N Asset/Collection/IngestJob/ActivityEntry/Tag; Asset 1—N AssetVariant, 1—1 BilingualMetadata + RightsRecord, N—M Tag (stateful AssetTag), N—M Collection (ordered); IngestJob 1—N items → each succeeded item one Asset. Saved views = URL-serialized filter state, deliberately NOT a backend entity at v1 (12 Q-8).

## Screen inventory (7)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Library home | grid, dual-script search, filter builder, action bar | listAssets, listTags, listCollections, getSession |
| S2 | Asset detail (drawer/full) | bilingual metadata, variants, rights, extracted text | getAsset, updateAssetMetadata, updateExtractedText, archiveAssets, createTag, applyTags, setRightsRecord |
| S3 | Ingest console | staging, staged progress, extraction + tag review | createIngestJob, getIngestJob, submitTagReview, retryIngestItems, cancelIngestJob, listTags, applyTags, getUsage |
| S4 | Collections | list + ordered view, export | listCollections, getCollection, createCollection, updateCollection, modifyCollectionAssets, listAssets |
| S5 | Rights review | state buckets, record editing | listRightsAlerts, setRightsRecord, getAsset |
| S6 | Activity | jobs history + log (T3-consolidated job center, async-contract §7) | listIngestJobs, listActivity, cancelIngestJob, retryIngestItems |
| S7 | Settings | locale, capability status + consent, quota | getSession, getUsage |

Command palette overlays all screens (surface, not screen).

## Per-screen state obligations

Four empties per P01, enumerated per entity in 11 (first-run: sample + ingest CTA; no-data-after-activity: archive explanation; no-access: workspace copy; filtered-empty: reset). Skeletons mirror geometry RTL-flipped (P02); errors per 03 mapping; job copy per async-contract §8.

## IA decisions and rationale

- **Search is S1's spine**: findability is the core job-to-be-done (02); the bar owns the top zone on every breakpoint.
- **Ingest is a destination**: library quality is decided at ingest; burying it is how libraries rot.
- **Rights is a destination**: Tariq's audit job needs state buckets, not a date column.
- **Drawer-not-page for asset detail**: metadata work happens in search context (CP-2.5); full-drawer exists for deep single-asset work.
- **Activity consolidates jobs + log** (T3, async-contract §7): one accountability surface.
