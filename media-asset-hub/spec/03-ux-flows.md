# 03 — UX Flows: media-asset-hub

SME-C pass. Five critical paths; edges/failures/recovery per flow; coverage table maps EVERY 07b operation (no orphans).

## CP-1 — Ingest → extraction → auto-tag review → publish (value proof)

1. Ingest console (S3): drag-drop or file-pick ≤50 mixed files; per-file size/type readout before upload (P09).
2. Batch defaults once: rights basis, optional target collection, extraction toggle with capability disclosure (08 consent).
3. Commit → `createIngestJob` (async-contract Job); per-file × per-stage progress: upload → probe → rendition → text-extract → auto-tag → review — determinate counts ("File 3 of 12 — extracting text"), never synthetic percentages (§3).
4. Extraction streams into per-asset rows with confidence chips; low-confidence Arabic marked "needs review", never silently promoted (ai-native-patterns §6); no-text assets marked honestly.
5. Auto-tag suggestions are bilingual draft chips (P15): accept / edit / reject, one keystroke each; batch-accept names its scope ("Accept all 38 suggestions across 12 files").
6. `submitTagReview` records decisions (actor+timestamp → P17). Untouched suggestions expire after a declared 7-day window — never auto-promote.
7. Publish: bilingual metadata defaults (filename-derived title in the filename's script; empty twin flagged, never fake-translated).
8. Completion per async-contract §6: in-context if visible, else Activity surfaces it on re-entry.

**Edges**: over-cap file (validation + skip-or-continue); duplicate filename (versioned, both kept, flagged); mixed-script batch (per-file direction, bidi isolation); extraction off (stage skipped; honest per-asset mark); quota 80% warning pre-commit (P14); network drop (job reconciles on reconnect, P20).
**Failures**: per-file probe failure (partial policy: succeeded files continue, failed retryable via `retryIngestItems` — §4); extraction-stage failure (asset still publishes; paste-transcription offered); whole-job failure (typed error + retry).
**Recovery**: `cancelIngestJob` real and fast; partial artifacts kept; job history re-enterable.

## CP-2 — Bilingual & in-asset search (daily loop)

1. Focus dual-script search bar ("/"); type either script — direction auto-detected; bar announces index scopes (metadata + tags + in-asset text).
2. Debounced suggestions (≤150ms perceived — 10) grouped: recent / assets / tags; no-results never renders as blank "0 results" — it offers normalization variants (11).
3. Virtualized grid results with hit highlighting: matched spans in titles/descriptions, tag chips, "in-asset text" badge when the match came from extracted text — match source visible, never merged silently; normalization disclosure chip when normalization fired (ai-native-patterns §7.4).
4. Filter builder refines (P08): kind, tag, collection, rights state, date, has-in-asset-text; removable chips with accessible predicate descriptions; filtered state declares itself; state serializes to URL (saved-view link — 06).
5. Open asset → metadata drawer with hit context preserved (scroll-to + highlight; extracted-text panel shows the matching line).

**Edges**: tashkeel query (normalized both sides, disclosed); mixed-script single query (per-token script routing); filtered-empty (reset action, P01); beyond-viewport results (P19 virtualization, counts announced on region entry).
**Failures**: search request failure (typed error; last good results stay with a stale notice — never blank); suggestion rate-limit (suggestions pause, full search unaffected).
**Recovery**: local query history; re-run one keypress.

## CP-3 — Metadata stewardship (bilingual parity work)

1. Asset detail (S2): inline edit bilingual fields (P06 — display = edit surface; Escape cancels/restores; Tab commits/advances; focus returns to trigger).
2. Bilingual alt text is first-class with its own completeness flag — missing alt is a visible gap.
3. Tags: add existing bilingual tags (searchable picker), create with both names (missing twin flagged, never machine-filled), remove with undo (P03).
4. Autosave per field group (P10: saving → saved-fades → conflict → offline-queued); conflict shows both versions — no silent overwrite.
5. Archive not delete: `archiveAssets` leaves default views, reversible via undo; permanent deletion out of v1 (12 Q-7).
6. Extracted-text panel: provenance always shown; paste-transcription for machine-failed or capability-unavailable assets (`updateExtractedText` — human-pasted provenance, 07b rule 4).

**Edges**: long Arabic single words (word-boundary truncation, 320px test — rtl-rules §5); keyword parity threshold documented in 06; editing during re-tag (suggestions queue as pending; manual tags win — ai-native-patterns §6).
**Failures**: stale revision (CONFLICT, both versions); offline (queued writes, P20).
**Recovery**: field revisions retained; activity log records actor-action-target-timestamp (P17).

## CP-4 — Collection assembly (briefs and handoffs)

1. "Add to collection" from results/detail, or range-select → action bar (P07) → bulk add; selection fully keyboard-complete.
2. Create inline: bilingual name + notes; cover = first asset (changeable; keyboard reorder — 2.5.7).
3. Collection view (S4): ordered set, per-asset notes; drag reorder with keyboard equivalent; remove with undo.
4. Update collection metadata (versioned save; conflict handling).
5. Export: bilingual manifest and/or file package (Job, artifact + 7-day expiry + renewal — async-contract §2). Export is a handoff artifact, NOT a portal (LOOP-10).

**Edges**: archived assets inside (render archived, excluded from export by default with count + include toggle); empty collection at export (validation naming the count); 100+ asset collections (virtualized).
**Failures**: export job failure (typed error; per-file retry for packages — partial policy); concurrent edit (CONFLICT, both kept).
**Recovery**: collection versions restorable; exports regenerable.

## CP-5 — Rights & expiry review (hygiene loop)

1. Rights console (S5): buckets expiring-soon (≤30 days) / expired / unknown-rights; counts per state, keyboard-navigable.
2. Open record: bilingual usage terms, credit, license reference, valid-from/expires-at (Gregorian storage; dual-calendar display P24 with method disclosure).
3. `setRightsRecord`: extend, change basis, add restrictions; every change appends to the activity log (append-only history).
4. Expired assets carry a persistent non-modal state in the library (badge + filter) and "usage paused" semantics in exports — never silently hidden or removed.
5. Weekly digest option via notification ladder (P21, digest tier, user-controlled); manual alternative = the console (08).

**Edges**: unknown-rights asset in a collection (warning chip at export — the honest moment); Arabic-Indic date digits entered (parsed canonically, display stays Western); past expires-at (validation with correction).
**Failures**: rights update failure (typed error; record unchanged).
**Recovery**: rights history retained per asset.

## Non-happy paths

- **No auto-tagging capability** (unbound/quota-exhausted, rung 4 — 08): ingest goes straight to manual bilingual tagging on the same review surface — identical shape, empty hand-filled chips; library fully functional.
- **No text-extraction capability**: in-asset search covers pasted transcriptions only; drawer offers paste per asset (LOOP-5).
- **No object storage credential** (link-catalog mode — 08): metadata + external link; kind glyphs replace thumbnails; search/collections/rights fully functional.
- **First-run**: P01 first-run with sample dataset + ingest CTA; P22 value checklist, no tours.
- **Offline**: cached reads; metadata edits queue (P20); ingest blocked honestly.

## Failure→error mapping (exact 7)

ValidationError (oversized file, empty export, past expiry, invalid filter) · NotFoundError (stale asset link, expired artifact) · PermissionError (workspace scoping, revoked seat) · ConflictError (concurrent metadata/collection edits) · RateLimitError (metered extraction/auto-tag windows) · NetworkError (job drops, offline) · UnknownError (unclassified, correlation-quoted).

## Flow → operation coverage table (07b `AssetHubAdapterV1` — 24 operations, no orphans)

| Operation | Flows | Screens | | Operation | Flows | Screens |
|---|---|---|---|---|---|---|
| `getSession` | boot all CPs | all | | `retryIngestItems` | CP-1 fail-rec | S3,S6 |
| `listAssets` | CP-2,3,4,5 | S1,S4,S5 | | `submitTagReview` | CP-1.6, manual | S3 |
| `getAsset` | CP-2.5,3,4,5 | S1d,S2 | | `listTags` | CP-1.5,2,3 | S1,S2,S3 |
| `updateAssetMetadata` | CP-3.1–4 | S2 | | `createTag` | CP-3.3 | S2 |
| `archiveAssets` | CP-3.5 | S1,S2 | | `applyTags` | CP-1 manual, CP-3.3 | S1,S2,S3 |
| `updateExtractedText` | CP-3.6, CP-1 edge | S2 | | `listCollections` | CP-4.1 | S1,S4 |
| `createIngestJob` | CP-1.3 | S3 | | `getCollection` | CP-4.3 | S4 |
| `getIngestJob` | CP-1.3–6 | S3 | | `createCollection` | CP-4.2 | S4 |
| `listIngestJobs` | CP-1.8, re-entry | S6 | | `updateCollection` | CP-4.4 | S4 |
| `cancelIngestJob` | CP-1 recovery | S3,S6 | | `modifyCollectionAssets` | CP-4.1/3 | S1,S4 |
| `getUsage` | CP-1.2 (P14) | S3,S7 | | `setRightsRecord` | CP-5.3 | S2,S5 |
| `listActivity` | CP-1.8, P17 | S6 | | `listRightsAlerts` | CP-5.1 | S5 |

Critic pass: 24/24 operations covered; reverse check — flows call only these 24.
