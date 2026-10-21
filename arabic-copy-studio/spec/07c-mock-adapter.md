# 07c — Mock Adapter: arabic-copy-studio

SME-G pass · The mock is SPEC, not implementation: it defines data and behavior a development environment must reproduce. Fully in-memory, deterministic, zero external dependencies. It implements `ContentStudioAdapterV1` exactly.

## 1. Deterministic seed data (fixed, never random)

- **Workspaces**: `ws-demo` (Arabic-default, register mSA-middle, numerals Western-with-prose-AR-indic toggle off), `ws-en` (English-default, for Hussein-style separation testing).
- **Members**: `m-owner` (owner), `m-editor` (editor), `m-reviewer` (editor; used for review flows).
- **BrandKit** (ws-demo): voiceTraits ["واثق، هادئ، دقيق" / "confident, calm, precise"], sampleCopy [3 fixed samples: campaign line, PDP paragraph, email opener], bannedTerms ["الأفضل عالمياً", "ثورة"], registerHint mSA-middle. ws-en BrandKit: partial state (voiceTraits only) to exercise "unbranded" treatment.
- **GlossaryTerms** (40 fixed, ws-demo): includes e-commerce terms (e.g., termAr "الدفع عند الاستلام" ↔ termEn "cash on delivery"), a `doNotUse` pair ("كاش" → prefer "الدفع النقدي عند الاستلام"), and ONE seeded conflictGroup containing two contradictory definitions (concept: "السلة" — cart vs basket metaphor) to exercise CP-4 conflict UX deterministically.
- **Documents** (12 fixed): statuses spread across all five lifecycle states; 3 paired ar↔en documents (one with length-strict violation seeded on block 2 — deterministic Parity Weave warning); one document with dialectFlag detected:levantine (seeded trigger for DialectWarningCard); one in-review with two open comments; one approved with an export artifact near expiry.
- **Revisions**: 4–8 per document with monotonically increasing fixed timestamps.
- **Streaming corpus**: a fixed 140-token Arabic campaign text + a fixed 120-token English text; token events replay in fixed order at fixed 40ms cadence; one seeded citation event pair (anchor+source) at token 38.

## 2. Behavior specification

- **Generation**: `startGeneration` validates brief (empty keyPoints → ValidationError with field details; words < 5 → ValidationError); quota state machine: workspace usage counters increment per generation; rungs simulated by configuration (§3). Stream emits token events from the corpus; `subscribeGeneration` returns an unsubscribe; mid-stream stall/event injection configurable.
- **Refinement**: selection-based; returns a fixed rewrite that demonstrably tightens/tone-shifts the seeded passage; `acceptSuggestion` produces a Revision and bumps document revision.
- **Transform**: creates a Job progressing queued(100ms)→running with per-block determinate progress (7 blocks over 1.4s)→awaiting-input if the seeded glossary conflict intersects the document (deterministic for doc `doc-paired-2`), else succeeded with pairedDocumentId. `retryJob('failed-items-only')` re-runs only blocks marked failed (seed config can mark block 4 failed once, succeed on retry — testing partial-results UI deterministically).
- **inspectText**: registerDrift seeded for the phrase "هيّا يلا نشتري" inside mSA documents; dialect detection returns levantine at confidence 0.86 for seeded strings; glossaryHits computed by exact-match over seed terms with normalization (alef/taa-marbuta/yaa variants applied).
- **Conflicts**: `updateBlocks` with stale baseRevisionId → CONFLICT error carrying both revisions in details.
- **Errors**: every method can return each applicable error code via failure-injection config; messages include fixed correlationIds (`corr-0001`…).
- **Idempotency**: retry of a completed `transformContent` with the same idempotency key returns the same job (never duplicates).

## 3. Failure injection (per method, configurable)

`MockConfig = { latencyMs?: number; errorRate?: number; errorCode?: ErrorCode; stallAfterTokens?: number; quotaRung?: 1|2|3|4; failBlockOnce?: number }` — applied per method name via a config map. Defaults: zero latency, zero errors, quota rung 1. Environment override via a single config object passed at construction (no environment variables, no network).

## 4. Test-support operations (mock-only, outside v1 contract)

`reset()` — restores seeds · `snapshot()` — deep clone of state for assertion · `replay(events)` — applies a recorded event list to reach a state deterministically. These are mock-only extensions and are never called by product UI.

## 5. No-go guarantees

No timers beyond declared cadences; no randomness anywhere (all "variation" is seeded fixture selection by input hash); no network; no provider imports; no storage persistence across resets. A CI run twice produces identical transcripts.
