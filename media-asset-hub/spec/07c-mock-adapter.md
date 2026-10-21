# 07c — Mock Adapter: media-asset-hub

Deterministic, in-memory, zero external dependencies. Implements `AssetHubAdapterV1` (07b) fully — every operation, every error class. No network, no randomness, no timers beyond declared cadences.

## Seed dataset — "Al-Mahatta Archive" (named, fixed)

A production house's realistic library; volumes exercise virtualization (>200 grid rows — P19) and pagination.

- **Assets: 240** — 120 images, 48 videos, 30 audio, 42 documents. Filenames mix scripts as real teams do: Arabic-with-Latin-ext ("لقاء_مؤتمر_v3.mp4", "بانر_رمضان_2026_final.png"), Latin-with-Arabic-content ("press_conference_day2.mov"), pure-Latin ("brand_guide_v7.pdf"). 38 assets carry Arabic `extractedText` (conference banners, signage, broadcast title cards — "مؤتمر التقنية 2024", "افتتاح الفرع الجديد"), 26 Latin in-image text ("Q1 REPORT", "SALE 50%"), 176 none (honest absence). Confidence spans 0.42–0.98 (9 assets < 0.7 — needs-review fixtures). 6 assets carry `source: 'human-pasted'` (provenance fixtures).
- **Tags: 40** — bilingual twins with domain spread (مقابلة/interview، إطلاق/launch، رمضان/ramadan، مؤتمر/conference، خلفية_خضراء/green-screen، معتمد/approved…) + 3 with a missing twin (parity-flag fixture, never auto-filled).
- **Collections: 6** — "حملة رمضان 2026 / Ramadan 2026" (18 ordered), "Q1 Press Kit" (12), "Approved Logos" (9), "Archive Migration Batch 1" (40 — over-viewport fixture), "Client: Al-Noor Retail" (14), one empty (empty-state fixture).
- **Rights: 240 records (1:1)** — owned/licensed/unknown mix; fixtures: 7 expiring-soon (≤30 days), 4 expired (usage-paused), 41 unknown-rights; one past-date-entry history (validation fixture).
- **Ingest job history: 4** — one succeeded 12-file job (full stage trail); one partial-failure (9/12; items 4, 7, 10 failed at probe — retry fixtures); one cancelled mid-run (partial artifacts kept); one awaiting-review (3 assets with pending suggestions — CP-1 fixture).
- **Activity: 60 entries** covering the full action vocabulary (07a), fixed ordered timestamps.
- **Usage window**: 214/300 extractions, 9/20 auto-tag batches, fixed resetAt; a `nearLimit: true` variant (250/300) triggers the P14 80% warning.

## Simulated stages & pacing (async-contract compliant)

- `createIngestJob` builds per-item stage machines advancing on a fixed 90ms cadence — determinate counts only ("File 3 of 12 — extracting text"), never synthetic percentages. Stages: upload → probe → rendition → text-extract (if enabled) → auto-tag (if enabled) → awaiting-review.
- Extraction reads a fixed per-file table: scripted fixtures produce their text/confidence; unlisted files produce `null` (no in-asset text — honest). One scripted failure ("corrupted_tape.wav" → NETWORK at probe, retryable).
- Auto-tag suggestions come from a fixed tag/confidence mapping; NEVER auto-apply — the awaiting-review job's suggestions expire at a fixed future timestamp (7-day window).
- `submitTagReview` records decisions + appends activity; `createTag` requires both names (empty twin → VALIDATION with field details); `applyTags` updates counts deterministically.

## Behavior specifics

- `listAssets`: bilingual matching over filename, metadata (ar/en), applied tags (both names), extractedText; normalization applied (ا/أ/إ/آ، ة/ه، ي/ى، tashkeel stripped) so "مؤتمر" matches "المؤتمَر" and hamza variants; relevance = fixed score table (exact-title > tag > keyword > extracted-text); cursor pagination ≤60, cursors stable per filter-state; all facets fixed-behavior.
- `updateAssetMetadata`/`updateCollection` stale tokens → CONFLICT with both payloads; `archiveAssets` returns `undoWindowSeconds: 7`; archived assets leave default results but appear under the archive filter.
- `setRightsRecord` with past `expiresAt` → VALIDATION; valid updates re-derive status immediately.
- `retryIngestItems` on the partial-failure fixture: items 7 and 10 succeed; item 4 succeeds only on the SECOND retry (honest double-failure fixture).
- `listRightsAlerts` buckets fixed; `daysLeft` computed against a fixed "now" anchor.
- `getUsage` returns the fixed window (or the `nearLimit` variant after `setMockConfig`).

## Failure injection (MockConfig)

`{ latencyMs?: number; errorCode?: ErrorCode; errorRate?: number; failStage?: IngestStage; nearLimit?: boolean }` — per-method injection with fixed correlationIds `mah-corr-0001`…; `failStage` forces a scripted stage failure on the next created job; `errorRate` fails every Nth call (N fixed — no RNG).

## Test-support

`reset()` → pristine seed · `snapshot(label)` / `replay(label)` → state capture/restore. Idempotency: repeated `createIngestJob` idempotencyKey returns the existing job. Seeds include worst-case long Arabic strings for truncation tests (rtl-rules §5); safe under reduced-motion and both directions.
