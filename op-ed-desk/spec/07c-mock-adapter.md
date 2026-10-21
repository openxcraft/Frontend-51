# 07c — Mock Adapter: op-ed-desk

In-memory, deterministic, zero external dependencies. Implements `OpEdDeskAdapterV1`. Slush-scale seeds; bilingual fixtures; lint as a simulated async stage per async-contract.

## Seeds (fixed, named)

- **Submissions (48)** — one week of a regional desk's slush (unverified estimate calibrated to 01 evidence): 30 received/triage (mixed ar/en; economy, education, energy, culture, municipal), 8 in-round, 6 decided, 4 revision-chain pieces (two chains of two — CP-4 fixtures). Named edge fixtures: `sub-over-length` (1,340 words EN — policy warning) · `sub-short-ar` (410 words — band violation) · `sub-levantine` (Levantine passages — register fixture) · `sub-numeral-mix` (٠-٩ and 0-9 mixed in Arabic prose) · `sub-tashkeel` (inconsistent vocalization) · `sub-leak-ceo` ("As the chief executive of …, I" — IDENTITY_LEAK fixture) · `sub-mixed-bidi` (Arabic body with Latin runs, trailing-punctuation traps) · `sub-exclusive-attest-fail` (intake VALIDATION fixture).
- **Contributors (35)**: `contrib-serial` (6 prior, 6 rejects — pattern fixture), `contrib-prior-accept` (academic, 1 accept), `contrib-org-match` (organization engineered to COI-match reviewer `rev-002` — assignment-guard fixture).
- **ReviewRounds**: `round-agree` (2× publish), `round-split` (1 publish / 1 decline — override fixture), `round-overdue` (SLA past, 1 review in — reassign fixture), `round-paused` (leak regeneration fixture), `round-recused` (mid-round recusal).
- **AnonymizedViews**: v1 for every in-round submission; `view-leak` at v2 with one residual suspect span.
- **LintReports**: `report-det-ar` (14 findings: band, paragraph length, numeral mix, AR punctuation ، ؟ ؛, cliché "في نهاية المطاف", honorifics), `report-full-en` (+ ai-enhanced coherence/redundancy, marked), `report-degraded` (degradedCategories populated — notice fixture), `report-integrity` (IDENTITY_LEAK blocker).
- **DecisionRecords**: `dec-accept` (AR letter, sent) · `dec-reject-fast` (template, sent) · `dec-revise` (EN letter with findings digest, sent) · `dec-unsent` (send-failed — manual-path fixture).
- **Jobs**: one succeeded lint, one failed lint (NETWORK), one queued.

## Behavior (deterministic)

- `submitDraft`: missing attestation → VALIDATION field-linked; out-of-band word counts → receipt carries policyFlags, submission CREATED (warning, never rejection); stale `revisionOf` code → NOT_FOUND (no identity hint); revision of a differently-decided piece → CONFLICT.
- Intake pre-checks + deterministic findings computed from **fixed rule tables**: band 650–900, paragraph ≤120 words, sentence ≤35, bilingual cliché list, numeral-mix patterns, AR punctuation, tashkeel inconsistency, dialect lexicon regions, identity-leak phrase list. No randomness.
- `runStyleLint` Job paces per category (~120ms × 7 categories) — a real Job, never fake completion; `pass:'full'` with capability flag off → succeeds degraded with dropped categories listed.
- `getSubmission` as reviewer → PERMISSION (mock enforces scoping, not the UI). `flagAnonymizationLeak` → version+1, round → paused-leak, flagged span scrubbed, resume on next fetch.
- `openReviewRound`: `rev-002` × `contrib-org-match` → COI warning (category "organization"); with policy-block config → VALIDATION naming category only.
- `submitReview` on closed round → CONFLICT; `integrityConfirmed: false` → VALIDATION.
- `recordDecision` on split round without rationale → VALIDATION; `sendDecision` on `dec-unsent` with failure config → send-failed + manual flag; repeat send → same result (idempotent).
- `updateFinding` records actor/timestamp (undo window is UI-side P03; mock re-records).
- Error injection per method: `MockConfig { latencyMs, errorRate, errorCode, failLintOnce, capabilityFullPass }`. Fixed correlationIds `opd-corr-0001`…

## Test-support

`reset()` / `snapshot()` / `replay()`; no randomness, no network, no timers beyond the declared job cadence; deterministic lint core runs locally so the degradation path is testable with no capability bound.
