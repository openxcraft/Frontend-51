# 07c — Mock Adapter: translation-review-hub

In-memory, deterministic, zero external dependencies. Implements `TranslationReviewHubAdapterV1` (07b) over the entities of 07a. No randomness, no network, no timers beyond the declared cadences; identical call sequences produce identical states (the determinism contract is the mock's own test oracle).

## Seed dataset (fixed, named)

**Workspace** — "Marafi Localization" (defaultLocale `ar`; lengthPolicyDefaults: proportionalBand `{min: 0.6, max: 1.35}`, charLimitCriticalAt `1.10` — band labeled heuristic in-product: no published ar↔en expansion table exists, 01 honest gap → 12 Q-11).

**Glossaries** (2):
- **"Marafi Brand Terms (en→ar)"** (`gls-001`) — 24 active entries + 2 deprecated, seeded with realistic fintech/e-commerce terminology; representative entries (verbatim fixtures used by the findings below):
  | id | source (en) | mandated target (ar) | forbidden | severity | note |
  |---|---|---|---|---|---|
  | term-001 | shopping cart | السلة | عربة التسوق | critical | Brand decision 2024-11: cart is a basket, not a vehicle |
  | term-002 | cash on delivery | الدفع عند الاستلام | الدفع عند التسليم | critical | Regulatory wording — do not vary |
  | term-003 | account statement | كشف الحساب | — | critical | Banking convention |
  | term-004 | settlement | تسوية | — | advisory | Preferred; "تسوية حسابات" acceptable in legal long-form |
  | term-005 | refund | استرداد | — | advisory | "إرجاع المبلغ" reads as return-of-goods |
  | term-006 | Marafi Pay | Marafi Pay (stays Latin — bidi-isolated at render) | مرافي باي | critical | Brand names are never transliterated |
  | term-007 | dashboard | لوحة التحكم | — | advisory | "لوحة القيادة" flagged as preferred-variant miss |
  | term-008 | checkout | إتمام الشراء | الدفع والخروج | critical | Literal renderings break flow analytics naming |
  | … 16 further entries of the same shape (log in / تسجيل الدخول, sign up / إنشاء حساب, order tracking / تتبع الطلب, …) and 2 `deprecated` entries (old "المحفظة الرقمية" wording) proving deprecation keeps history and stops checks. |
- **"Marafi Brand Terms (ar→en)"** (`gls-002`) — 8 entries mirroring the critical subset for the reversed-direction job (e.g. ar "الدفع عند الاستلام" → mandated en "cash on delivery"; forbidden "payment on receipt").

**Review jobs** (3 + sample):
1. **`rj-001` "Release 14 — checkout UI (en→ar)"** — glossary `gls-001`; document **`doc-001` "checkout-ui-strings"** (kind `ui-strings`): **220 segment pairs** with declared char limits (10–60) — realistic button/label/toast copy; segment excerpts that fix behavior:
   - `seg-0042`: "Save your card for faster checkout" [limit 42] → "احفظ بطاقتك لإتمام شراء أسرع" (28 chars — fits; term-008 satisfied).
   - `seg-0047`: "Review your shopping cart before checkout" [limit 48] → "راجع عربة التسوق قبل إتمام الشراء" — **planted critical `forbidden-present`** (عربة التسوق; mandated السلة), match normalized, offsets into targetText fixed.
   - `seg-0051`: "Card saved" [limit 12] → "تم حفظ البطاقة بنجاح" (20 chars, ratio 1.67) — **planted critical length over**.
   - `seg-0007` / `seg-0031`: "Get started" → "ابدأ الآن" / "لنبدأ" — **planted consistency pair** (source-same-target-differs, siblings linked).
   - `seg-0088`: "Terms apply" → "" — **planted missing translation** (gate blocker).
   - `seg-0113`: "Pay with Marafi Pay later" [limit 28] → "ادفع لاحقاً عبر Marafi Pay" — mixed-script fixture: Latin brand term inside RTL target, bidi-isolated; term-006 satisfied via exact match.
   - `seg-0150`: "Refund issued to your card" [limit 34] → "أُرسل الإرجاع إلى بطاقتك" — **planted advisory `preferred-variant`** (term-005: استرداد mandated).
   - Decision state fixture: 120 approved, 85 unreviewed (bulk path), 6 rejected with comments, 9 queried (2 with answered threads — answer-appends, no silent re-open).
   - `rj-001` totals after first scan: term violations 6 critical + 4 advisory open; length warnings 3 critical + 6 advisory open; consistency 2 open; missing translations 1 — **the gate is blocked** (refusal fixture).
2. **`rj-002` "Privacy policy update (ar→en)"** — glossary `gls-002`; document **`doc-002` "privacy-long-form"** (kind `legal`): **96 segment pairs**, no char limits (proportional policy); e.g. `seg-0102`: "يمكنك إلغاء الطلب خلال 24 ساعةً" → "You can cancel the order within 24 hours" (ratio 1.26 — inside band); one planted proportional-breach advisory (ratio 1.52) and one ar→en term fixture (forbidden en "payment on receipt" present). Fully reviewed except 4 segments — near-signable fixture.
3. **`rj-003` "Ramadan campaign microcopy"** — glossary `gls-001`; document **`doc-003` "campaign-copy"** (kind `marketing`): **64 segment pairs**; clean scan except **1 acknowledged overflow** (resolution fixture with reason: "two-line label approved by design") — an almost-clean job demonstrating advisory visibility at sign-off.
4. **`rj-s01` "Sample — see the gate refuse"** (first-run, flag `sample: true`, clearable): 12 segments, glossary attached, **1 open critical violation + 1 unreviewed segment** — the P22 value moment: the reviewer watches the gate refuse, resolves the violation by edit, approves the last segment, and signs (00 success signals).

**Jobs history**: one succeeded import (`job-001`, 220 pairs, "340 of 520" pacing fixture not used here — 220/220), one succeeded scan (`job-002`, result counts exactly the planted totals), one export (`job-003`) with artifact `art-001` (formats all three; expiresAt = seed time + 7 days; regenerable), one **failed import** (`job-004`: invalid block at row 17 — VALIDATION fixture with named block, rows 1–16 retained as partial). **Activity entries**: ~40 seeded covering every action kind in 07a (incl. two override-with-reason and one false-positive on `rj-003`).

## Deterministic computation rules (the whole QA engine — non-AI, specified exactly)

1. **Normalization pipeline** (applied to term texts, segment source/target text, and search input; the applied ruleset is disclosed in-product per ai-native-patterns §7.4): strip tashkeel (U+064B–U+065F, U+0670) and tatweel (U+0640); unify alef variants (أ إ آ ٱ → ا); taa marbuta (ة → ه); alif maqsura (ى → ي); for Latin: case-fold, trim, collapse internal whitespace. A match on raw text records `matcher: 'exact'`; a match only after normalization records `matcher: 'normalized'` (both disclosed on the chip detail).
2. **Term matching** (word-boundary containment on normalized strings; Arabic boundaries = whitespace/punctuation per the pipeline): for every **active** TermEntry whose normalized source term occurs in the segment's normalized **source** text:
   - no mandated target present in normalized target text → violation, `detail: 'missing-mandated'` when entry.severity = critical, `detail: 'preferred-variant'` when advisory;
   - any forbidden target present in normalized target text → violation, `detail: 'forbidden-present'`, severity mirrors the entry;
   - `match` records the first occurring non-conforming span (matchedText/start/end over the RAW targetText, offsets computed against the normalization map — fixed tables in the mock, no runtime search ambiguity).
   Findings carry `termEntryId` + `termVersion` at computation time (07a pin).
3. **Missing translations**: empty target with non-empty source → counted in QaReport (`missingTranslations`) and listed as gate blockers with `segmentPairId` — not a QaFinding kind (deliberate: it is segment state, not a rule opinion).
4. **Length-fit**: declared `charLimit` → `ratio = targetLength / charLimit` (character counts, Western numerals at display); `ratio ≤ 1.0` fits (no finding); `1.0 < ratio ≤ charLimitCriticalAt (1.10)` → advisory; `ratio > 1.10` → critical. No limit → proportional: `ratio = targetLength / sourceLength` against the job's band (default `{0.6, 1.35}`); outside band → advisory; beyond band edge by >15% (`ratio > max × 1.15` or `< min × 0.85`) → critical. Both formulas are pure arithmetic on declared values — no expansion-rate folklore.
5. **Consistency**: within a document, segments grouped by normalized source text; groups of >1 with differing normalized target texts → one `source-same-target-differs` finding per group (advisory, siblings linked, exemplar texts verbatim). Reverse rule: segments sharing the same normalized **target** text while their normalized **source** texts differ (and neither pair already grouped above) → `target-term-differs-source` (advisory). Duplicate segment pairs imported verbatim are counted (`duplicates`) and excluded from false consistency noise.
6. **Recompute triggers**: full scan (Job, `runQaScan`) recomputes all findings for the scoped documents; `updateSegmentTarget` recomputes only that segment's term + length findings live (simulated ≤30ms; UI budget ≤50ms per 10) — resolved-by-edit transitions happen ONLY here; resolutions by `resolveQaFinding` never alter computed fields, they set `state` + `resolution` (audit chain).
7. **Sign-off gate**: `signOffReviewJob` evaluates the live QaReport; any open critical finding / missing translation / unreviewed segment → VALIDATION with `details.blockers[]` naming each; success writes an immutable SignOffRecord with the resolution ledger counts; any later mutation on the job sets `reopened-pending`.

## Behavior (per operation class)

- `createReviewJob` — glossary direction mismatch (glossary sourceLocale ≠ job sourceLocale) → VALIDATION naming both directions; no glossary → job created with term checks honestly OFF (11 copy).
- `importDocument` (paste) — block format: source line, target line, optional `[limit: N]` annotation line; blank line separates blocks. Odd/unmatched lines → VALIDATION naming the first broken block, prior blocks retained (partial); empty target lines import as empty targets (scan flags them); mixed-script lines import verbatim. `source: 'intake-capability'` without granted consent → PERMISSION (capability language). Job pacing: determinate "n of total" at fixed 40ms per 10 pairs.
- `importGlossary` (paste) — row format: `source | target(s) | severity | note`; malformed rows named in `invalidRows`; severity outside {critical, advisory} → row invalid; pure-forbidden rows allowed (mandate inferred `forbidden` when only forbidden column filled).
- `runQaScan` — recomputes per rules 1–6; result carries `mode: 'deterministic'` and exact counts; re-running produces identical findings from identical state (the test oracle); pacing determinate per segment.
- `updateSegmentTarget` — stale `baseRevision` → CONFLICT with both payloads; empty target allowed (missing translation recomputes in); returned view carries recomputed findings (rule 6).
- `setSegmentDecision` — reject without comment → VALIDATION; query requires addressee + question; re-decide supersedes (chain); answering a query (viewer role permitted) appends `query.answer` and never re-opens a standing decision.
- `bulkSetSegmentDecisions` — `confirmCount` mismatch against the live filtered set → CONFLICT with the recounted set; segments with open critical findings in the set are skipped and named (never silently approved).
- `resolveQaFinding` — `override`/`acknowledge` without `reason` → VALIDATION; resolving an already-resolved finding → CONFLICT showing current state; `edit-resolved` is never accepted via this operation (rule 6).
- `saveTermEntry` — mandated entry with empty `targetTerms` → VALIDATION; two active entries mandating the same normalized source term with conflicting targets → VALIDATION naming both; stale `baseVersion` → CONFLICT both kept; save bumps glossary version (existing findings keep their pinned termVersion).
- `deleteTermEntry` — requires `confirm.openFindingCount` matching the live count → else VALIDATION; on delete, that entry's open findings remain (pinned to the deleted version) and close only on next scan.
- `exportReviewPackage` — artifacts expire at creation + 7 days; `regenerable: true` always; partial failure injectable per format; idempotent re-submit returns the original job.
- `getArtifact` — expired → NOT_FOUND with regenerate path; `signedReviewJobVersion` set when the job was signed at export time, and flags newer pending state.
- `getUsage` — fixed window with seeded scan/export counts; quota exhaustion injectable (RATE_LIMIT ladder copy in 11).

## Failure injection

`MockConfig { latencyMs (default 90), errorRate (default 0), errorCode?, failImportAtBlock?, failExportFormat?, quotaExhausted? }` — per-method injection; fixed correlationIds `trh-corr-0001`…; failure responses follow the 7-token taxonomy of 07b exactly. No random jitter: latency and failure points are configuration, not chance.

## Test-support

`reset()` → seed state; `snapshot()` → named state capture; `replay(events)` → deterministic re-derivation; state hashes stable across runs (determinism oracle). Zero external deps; no Date.now in finding computation (timestamps derive from a fixed seeded clock that advances only on declared actions).
