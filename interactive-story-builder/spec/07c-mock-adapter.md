# 07c — Mock Adapter: interactive-story-builder

In-memory, deterministic, zero external dependencies. Implements `StoryBuilderAdapterV1`. Behavior described, not implemented.

## Seed dataset (fixed, bilingual-realistic)

- **Workspace**: "Madar Desk" — defaultLocale ar, directionDefault rtl, numeralPolicy `ar-indic-prose`.
- **Stories (5)**:
  1. "نهر العاصي يغيّر مجراه / The Orontes Changes Course" — newsroom arc, 5 chapters × 6/4/5/3/4 steps; ar complete; en missing chapter 4 + 3 length-divergent steps (sync fixtures); approved, revision 34.
  2. "تقرير الأثر السنوي / Annual Impact Report" — NGO arc, 4 chapters; in-sync except one edited-since row; in-review; 2 unresolved step-pinned notes (one per locale) + 2 resolved.
  3. "رحلة ميدانية إلى وادي موسى / Field Trip to Wadi Musa" — university arc, 3 chapters; en complete; ar missing 5 steps (reverse-gap fixture); draft.
  4. "خط ساحلي يتقلص / A Shrinking Coastline" — 6 chapters × 8 steps (48 steps — virtualization fixture, 10); mixed-direction credit strings (bidi fixtures); one step missing en altText (QA error) + one numeral-policy warning.
  5. "مسودة غير معنونة / Untitled draft" — 1 empty chapter, 1 empty step (empty-chapter QA fixture).
- **Templates (3)**: newsroom five-part investigation (5 chapters, 18 steps, mixed layouts incl. stat-band + full-bleed); NGO impact (4 chapters, 14 steps); university field-trip (3 chapters, 12 steps). Bilingual skeleton titles.
- **MediaRefs (10)**: 4 images, 1 video (posterTimecode), 1 audio, 1 data-figure (external embed), 1 map-embed, 1 unreachable sourceUrl (warning fixture), 1 image missing en altText (QA fixture). Credits include Latin names inside Arabic captions (bidi fixtures).
- **Jobs history (3)**: succeeded export (html-bundle, both locales, artifact expiring in 2 days — renewal fixture); succeeded suggestion with `origin:'generated'` (6-chapter outline); failed export (chapter 3 render failed; 4/5-chapter partial artifact — partial-results fixture).
- **Activity (12)**: status transitions, approvals, "mark reviewed" acts, deletions, export completions — fixed actors/timestamps.
- **Usage**: suggestions 3/10, exports 2/5, fixed future resetAt.

## Behavior

- **Determinism**: no randomness, no wall-clock (fixed timestamps), no network. Job pacing = declared cadences (suggest 90ms/chapter; export 120ms/chapter) advanced by the harness clock, not real timers.
- **getSession**: fixed session; role switchable via MockConfig to exercise PERMISSION paths (reviewer mutations → PERMISSION naming the operation).
- **listStories**: cursor pagination at limit granularity; search normalization per rtl-rules §4 (alef/taa-marbuta/yaa variants, tashkeel stripped) over bilingual titles; deterministic sort.
- **createStory**: fromTemplateId instantiates the skeleton (steps with empty localeVariants); blank creates Chapter 1 + Step 1 (`full-bleed-media`); empty title both locales → VALIDATION (field-linked details).
- **updateStep/updateChapter/updateStoryDetails**: stale baseRevision → CONFLICT with both payloads; updates bump revision; step locale writes set lastEditedByLocale.
- **reorderChapters/reorderSteps**: full-array idempotent; partial/unknown ids → VALIDATION.
- **deleteStep**: removes the step (both locales) — the P04 confirm happened UI-side before the call.
- **getSyncState**: computed from seeded revisions/lastEditedByLocale/wordCounts — all five row states present; one row carries reviewedAt (mark-reviewed fixture).
- **suggestStructure**: fixed brief → fixed 6-chapter outline at the declared cadence; MockConfig `suggestionMode: 'generated' | 'template' | 'fail'` — 'template' succeeds with `origin:'template'`; 'fail' = mid-stream failure retaining a partial outline (retry-continuation fixture); quota exhausted → RATE_LIMIT with resetAt.
- **validateStory**: deterministic findings from seeded defects (missing en alt; empty chapter; missing-locale steps; unreviewed divergence; bidi hazard on the mixed credit; numeral-policy warning; one override with empty reason); severity order fixed.
- **Review notes**: append-only; resolve stamps fixed resolvedAt.
- **exportStory**: VALIDATION-blocked when the export scope contains missing-alt errors (details name the steps); else Job → artifacts with 7-day expiry; same idempotencyKey + revision → same artifacts; MockConfig `failChapter: n` → partial artifacts + scoped retry.
- **getExportArtifact**: post-expiry → NOT_FOUND; **renewExportArtifact** re-issues from current revision with extended expiry.
- **listJobs/cancelJob**: cancel completes within one cadence tick (async-contract §5 — no zombie cancelling).
- **Remaining operations** (deterministic, no special behavior): `getStory`/`listChapters`/`listSteps`/`listTemplates` return seeded state (templates paginate at limit granularity); `duplicateStory` copies structure + media refs, resets locale text, stamps a new id/revision; `deleteChapter` cascades its steps (post-confirm, per 07b rule 1); `setStoryStatus` applies the guarded transition machine (approved → draft on later content mutation, 07b rule 3) and appends the ActivityEntry; `getUsage` returns the seeded counters; `listActivity` paginates the fixed log; `resolveReviewNote`/`addReviewNote` append-only per 07a. Every method accepts the error-injection config below.
- **Error injection**: MockConfig { latencyMs, errorRate, errorCode, suggestionMode, failChapter } per method; fixed correlationIds `sb-corr-0001`….
- **Test support**: reset() / snapshot() / replay(). Zero external dependencies.
