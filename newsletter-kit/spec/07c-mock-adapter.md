# 07c — Mock Adapter: newsletter-kit

In-memory, deterministic, zero dependencies. Implements `NewsletterKitAdapterV1`. No network, no timers beyond declared cadences, no randomness.

## Seeds (fixed, named)

**Issues (5):**
1. `issue-101` "Weekly Briefing #14" — sent bilingual (ar+en complete, 8 block pairs, primary variants both locales, QA run clear, succeeded send: 10,540 ar / 1,860 en).
2. `issue-102` "Weekly Briefing #15" — draft bilingual; ar complete / en 5 of 8 pairs; AR has 3 variants (one at 58 chars → C03 warn); EN has 2.
3. `issue-103` "Ramadan Series #3" — Arabic-only draft with seeded QA fixtures: subject embeds a Latin product name unisolated (C02 fail), pasted "٣ من 12" digits (C05 warn), preheader missing (C04 warn), italic-on-Arabic quote (C07 fail).
4. `issue-104` "Briefing #14 — EN→AR copy" — duplicateIssue product (provenance recorded; pairKeys preserved; AR blocks hold English text awaiting translation — length-far-apart fixture).
5. `issue-100` — first-run **sample issue**: short bilingual issue with 2 seeded fails + 1 warn for the new user to fix (P22 onboarding).

**Subscriber lists (3):** `list-community` (4,860 subs: 62% ar / 36% en / 2% unspecified; 8 unconsented rows — send-gate fixture) · `list-flagship` (12,400: 85% ar; all consented) · `list-beta` (210 rows: 5 duplicate, 3 invalid, 4 consent-missing, 6 locale-missing — awaiting-input fixtures).

**Channels (2):** `channel-1` active email-delivery binding (hint "••ab", verified, granted issue-send) · `channel-2` unverified (hint "••q7" — verification fixture).

**Jobs history:** one succeeded send (`issue-101`); one send failed mid-run with NETWORK at 40% of the en edition (scoped-retry fixture); one import job in `awaiting-input` (the `list-beta` fixtures); one succeeded QA run (10/10 pass, `issue-101`); one export job with an expired artifact (renewal fixture); one succeeded assist job (2 proposals, `issue-102` en).

## Deterministic behavior

- **runQaChecklist**: checks evaluate from fixed rule tables over issue content (C01 direction flags on ar blocks; C02 isolate-mark scan; C03 budget counts; C04–C10 declared style/content facts). Paces 120ms/check; results pin issueRevision; re-run regenerates, prior run retained.
- **suggestSubjectVariants**: `count` deterministic proposals from the issue heading block via three fixed template shapes per locale (question/number/plain — exact strings pinned per seed issue); streams one proposal per 400ms via `partial`; quota window 40 generations, seeds use 11 (RATE_LIMIT with resetAt when over); injection can fail after proposal 2 (partial retained + marked).
- **importSubscribers**: rows parse deterministically; invalid/duplicate/consent-missing/locale-missing rows pause the job in `awaiting-input` with fixed `ImportRowIssue`s; `resolveImportRows` applies decisions and completes with imported/skipped counts; same `(sourceLabel, contentHash)` returns the original job (idempotent). Pace 30ms/row.
- **scheduleSend**: gate sequence in fixed order (QA fails → channel status → unconsented count → policy validation → double-schedule CONFLICT); job simulates the abstract channel: queued until `scheduledAt`, then per-locale batches of 500 at 60ms/batch with honest counts — never instant; channel-expiry injection pauses in `awaiting-input` (verify-or-cancel); NETWORK injection at a configurable batch index leaves partial per-locale counts; `retryJob` sends only unsent.
- **exportIssue**: renders HTML + text per locale from the same content model the preview renders (single source), plus CSV segments per policy; artifacts expire in 7 days; `getArtifact` on expired → NOT_FOUND + renew path; regeneration re-derives identical bytes (regenerable: true).
- **updateIssueContent**: stale baseRevision → CONFLICT with both revisions; sent issue → VALIDATION (locked); primary collision → VALIDATION with field details.
- **verifyDeliveryChannel** on `channel-2`: deterministic outcome from MockConfig (`verifyOutcome: 'success' | 'failed'`) — never fake success (credential-contract §7).
- **Error injection** per method: `MockConfig { latencyMs, errorRate, errorCode, failBatchAtIndex, failAssistAfter, verifyOutcome }`; fixed correlationIds `nk-corr-0001`…, incrementing per injected failure.

## Test support

`reset()` restores seeds verbatim; `snapshot()` / `replay()` record and re-run operation sequences deterministically. No external dependencies; dates fixed to ISO strings; pagination cursors are stable opaque strings derived from item ids.
