# 07c — Mock Adapter: seo-brief-builder

In-memory, deterministic, zero external dependencies. Implements `SeoBriefBuilderAdapterV1` (07b). SERP-data ingestion (`fetchKeywordSignals`) is a **simulated async stage** per async-contract.md: a Job that walks queued → running (milestone progress) → succeeded against fixed tables — no network, no timers beyond declared cadences.

## Seeds (fixed, named)

### Topic T1 — "إنشاء متجر إلكتروني" / "start an online store" (market: GCC; locales: ar+en) — the fully-worked fixture
- **AR keywords (14)** — real Arabic search terms: متجر إلكتروني · متجر الكتروني (hamza-omission variant — normalization fixture) · إنشاء متجر إلكتروني · كيفية إنشاء متجر إلكتروني · تصميم متجر إلكتروني · تكلفة إنشاء متجر إلكتروني · أفضل منصة لإنشاء متجر إلكتروني · متجر إلكتروني مجاني · متاجر إلكترونية جاهزة · متاجر جاهزه (taa-marbuta spelling variant — normalization fixture) · ربح من المتجر الإلكتروني · شراء قالب متجر إلكتروني · سلة · زد منصة. Volumes/cpc are SYNTHETIC fixture values (not market data — honest mock): 90–5,400 range, cpc 0.4–3.2.
- **EN keywords (11)**: online store · how to start an online store · online store design · online store ideas · best ecommerce platform · free online store builder · ready made ecommerce store · online store cost · buy ecommerce template · salla · zid pricing. (Latin-script brand queries of the Saudi platforms are real EN-side search behavior in this market.)
- **AR clusters (6)**: C-ar-1 "إنشاء متجر إلكتروني" informational ×5 (normalizationApplied: true — متجر الكتروني grouped via alef rule) · C-ar-2 "اختيار المنصة والتكلفة" commercial ×3 · C-ar-3 "متاجر جاهزة" commercial ×2 (normalizationApplied: true — متاجر جاهزه via taa-marbuta rule) · C-ar-4 "الربح من المتجر" informational ×1 · C-ar-5 "شراء قالب" transactional ×1 · C-ar-6 "منصات: سلة وزد" navigational ×2. All intents confirmed except C-ar-4 (suggested — the "confirm to include" fixture).
- **EN clusters (7)**: C-en-1 "starting an online store" informational ×4 · C-en-2 "choosing an ecommerce platform" commercial ×2 · C-en-3 "online store cost" commercial ×1 · C-en-4 "ready-made stores" commercial ×1 · C-en-5 "buying templates" transactional ×1 · C-en-6 "zid pricing" commercial ×1 · C-en-7 "brand: salla" navigational ×1. All confirmed.
- **Parity result P1 (snapshot)**: matched pairs — C-ar-1↔C-en-1 (informational, 0.72) · C-ar-2↔C-en-2 (commercial, 0.58) · C-ar-3↔C-en-4 (commercial, 0.81) · C-ar-5↔C-en-5 (transactional, 0.90) · C-ar-6↔C-en-7 (navigational, 0.85). Gaps — **G1 open**: informational anchored AR "الربح من المتجر", missing in en · **G2 open**: commercial anchored EN "zid pricing", missing in ar · **G3 accepted**: commercial anchored EN "online store cost", missing in ar, acceptance note "covered inside C-ar-2's matched article plan". unconfirmedIntents: {ar: 1, en: 0}.
- **Brief B-1 (draft, v3)**: 6 sections — heading "إنشاء متجر إلكتروني: الدليل الشامل" (both, bound C-ar-1+C-en-1) · question "كم تبلغ تكلفة إنشاء متجر إلكتروني؟" (ar, bound C-ar-2) · question "How much does it cost to start an online store?" (en, bound C-en-3) · heading "اختيار المنصة المناسبة" (both, bound C-ar-2+C-en-2) · term "متاجر جاهزة" (ar, bound C-ar-3) · note from G2 "Zid pricing coverage — decide before handoff" (en, bound C-en-6, carries the open-gap flag).
- **Jobs history**: ingest-ar succeeded (14 rows, 0 dup) · ingest-en succeeded (11 rows, 1 duplicate counted) · clustering succeeded (modeUsed: deterministic, degraded: false — the honest-provenance fixture).

### Topic T2 — "التسويق بالمحتوى" / "content marketing" (researching)
- 12 keywords (6 ar: التسويق بالمحتوى، ما هو التسويق بالمحتوى، استراتيجية التسويق بالمحتوى، أفضل أدوات التسويق بالمحتوى، دورات التسويق بالمحتوى، شركات تسويق بالمحتوى / 6 en: content marketing, what is content marketing, content marketing strategy, best content marketing tools, content marketing courses, content marketing agency). Deterministic clusters present with ALL intents suggested, none confirmed → **parity-gate fixture**: `runParityCheck(T2)` → VALIDATION ("zero confirmed intents on either locale").

### Topic T-sample — "باقات الاستضافة" / "hosting plans" (first-run sample, P22)
- 6 ar (استضافة مواقع، أفضل استضافة، سعر الاستضافة، استضافة ووردبريس، الفرق بين أنواع الاستضافة، شراء استضافة) + 6 en (web hosting, best hosting, hosting price, wordpress hosting, hosting types explained, buy hosting); pre-clustered deterministic, confirmed intents, parity P-sample with 1 open gap (transactional "شراء الاستضافة" ar-anchored, missing in en — the experienceable parity moment); **brief B-2 ready** · **artifact A-1 EXPIRED** (7-day window elapsed — NOT_FOUND + renew fixture).

## Deterministic grouping rules (the degradation path — fixed tables)

- **Normalization at ingest**: strip tashkeel; أ/إ/آ → ا; ة → ه; ى → ي (rtl-rules §4); normalized form stored read-only and disclosed on the keyword panel.
- **Grouping**: shared normalized stem/term overlap ≥ fixed threshold (Jaccard 0.34) → same cluster; the two spelling-variant fixtures above MUST land in their declared clusters on every run (regression assertions).
- **Intent cue rules (deterministic suggestions)**: AR — كيف/دليل/ما هو → informational · أفضل/مقارنة/مجاني → commercial · شراء/سعر/تكلفة → transactional (note: تكلفة cost-query cue maps commercial in the assisted refinement, transactional-adjacent — the mock records the deterministic call, keyword-level override available) · brand table (سلة، زد) → navigational. EN — how to/what is/ideas/explained → informational · best/free/vs → commercial · buy/price/pricing → transactional · brand table (salla, zid) → navigational.
- **Parity computation**: confirmed clusters only; matched pairs via fixed cross-language similarity table; gaps per 07a semantics; acceptance records persist across re-runs (gap state 'accepted' carried forward — fixture: re-run P1 keeps G3 accepted).

## Assist simulation (mode: 'assist', when `assistEnabled`)

- Clustering run emits one extra refinement vs deterministic: splits تصميم متجر إلكتروني out of C-ar-1 as a separate suggested cluster (provenance: assist, state: suggested) — the draft-by-default suggestion a human must confirm (P15); with `editPolicy: 'preserve'`, prior confirmations (C-ar-1..6) are preserved and marked human-confirmed.
- `modeUsed` + `degraded` returned honestly: assistEnabled=false + mode 'assist' → run completes deterministic with degraded: true (degradation-ladder fixture, 08 map rung 4).

## Behavior

- `ingestKeywords`: paced 60ms/row-chunk; malformed row (e.g. empty text) → VALIDATION naming the first bad row + prior-good rows kept (partial policy); duplicate normalized form → counted in `duplicates`, both rows kept verbatim (real behavior: spelling variants are separate rows that cluster together); idempotency key replay returns the original job.
- `fetchKeywordSignals`: consent flag off → PERMISSION naming the SERP-data capability class (credential-contract §2 kind-not-vendor language); consented → Job paced in fixed stages (queued 100ms → running milestones "terms 2 of 4" → succeeded) returning 8 fixed EN + 8 fixed AR keyword additions to the seed terms (simulated async stage; source: 'serp-capability').
- `runClustering`: 100ms per cluster emitted; both locales atomic per run; `editPolicy: 'discard'` executes only what the UI's P04 level-2 confirm already named (03 CP-2.4) — the job result carries a kept/discarded accounting of confirmations and manual moves, never a silent drop; `'preserve'` keeps every human confirmation intact.
- `updateCluster`/`updateBriefSection` stale baseVersion → CONFLICT with both payloads; intent confirm requires the explicit `{label, confirm: true}` shape (the P15 gate).
- `runParityCheck`: synchronous, <300ms at seed scale (10-performance budget fixture); T2 → VALIDATION (gate); single-locale keyword-empty topic → valid result with single-locale notice (not an error).
- `exportBrief`: markdown + writer-bundle (bundle = brief + parity appendix); artifact expiry 7 days; A-1 expired → NOT_FOUND + regenerable path; `failExportFormatOnce` config → partial bundle failure with per-format retry (async-contract §4); idempotent re-export returns same artifact.
- `getUsage`: window "monthly"; assistRuns 3 of 20 (85% warn-zone fixture); deterministicRuns unmetered (rendered without a meter — 06 rule).
- Error injection per method: MockConfig { latencyMs, errorRate, errorCode, assistEnabled, consentGranted, quotaExhausted, failExportFormatOnce }; fixed correlationIds `sb-corr-0001`…

## Test-support

reset() / snapshot() / replay(): full state restore, no randomness, no network, no timers beyond the declared cadences. Regression assertions: normalization fixtures group as declared; T2 parity gate fires; G3 acceptance survives re-run; assist-off run returns degraded:true; every error class injectable and typed per the 07b union.
