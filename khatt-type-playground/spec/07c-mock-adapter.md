# 07c — Mock Adapter: khatt-type-playground

In-memory, deterministic, zero external dependencies. Implements `KhattPlaygroundAdapterV1`. Font family names are catalog CONTENT (real market families as references — allowed; foundry/vendor names are not used here).

## Seeds (fixed, named)

**FontProfiles — catalog (14)**, weights/kashida classes chosen to exercise every control path:
1. **Reem Kufi** — ar, kufi/display, 400–700, `tatweel-only`, features calt/liga/ss01 (the product's own identity family — self-reference fixture).
2. **Amiri** — ar, naskh, 400/700, `jalt-and-tatweel`, features calt/liga/dlig/ss01/ss02/jalt/kern/mark (deep-feature fixture).
3. **Raqim** — ar, naskh, 400/700, `jalt-and-tatweel` with per-line alternate levels (justification-craft fixture).
4. **Cairo** — ar, sans, 200–900 variable wght, `tatweel-only`.
5. **Tajawal** — ar, sans, 200–900, `none` (kashida-disabled fixture — disabled-with-reason path).
6. **Noto Naskh Arabic** — ar, naskh, 400–700, `tatweel-only`.
7. **Noto Kufi Arabic** — ar, kufi, 100–900 variable, `none`.
8. **Readex Pro** — ar+latin dual-script single family, sans, 160–700 variable (same-family-both-scripts pairing edge).
9. **Scheherazade New** — ar, naskh (traditional), 400–700, `jalt-and-tatweel`, tashkeel-heavy samples (line-height floor fixture).
10. **Dubai Font** — ar+latin, sans, 100–900 (bilingual civic face; pairing fixture).
11. **Fraunces** — latin, serif, variable opsz/wght/SOFT/WONK (optical-size control fixture).
12. **Source Serif 4** — latin, serif, 200–900 variable.
13. **Archivo** — latin, sans, 100–900 variable.
14. **Space Mono** — latin, mono, 400/700 (feature-code chrome fixture; western-only numerals path).

**FontProfiles — uploaded (2)**: one `active` (`GE SS`, `user-licensed` badge, attested in ActivityEntry); one `rejected` (parse failure: malformed table directory — VALIDATION fixture with details).

**GlyphData**: full joining-form sets for Amiri and Raqim (isolated/initial/medial/final for ب ت س ص ع ك ل م ن هـ ي); Latin set for Fraunces (a–z with ss01 alternates on a/g/y). Blocks: Arabic (U+0600), Arabic Presentation Forms-A/B, Basic Latin, Latin Extended-A. Coverage counts fixed per font.

**CuratedPairingNotes (6)**: Reem Kufi↔Fraunces ("constructed Kufi geometry meets a wonk-tamed serif — match at display sizes, mind the 700 weight in Kufi"); Amiri↔Source Serif 4 (book-weight pairing + justification behavior note citing foundry guidance); Tajawal↔Archivo ("match visual weight by eye at 18px — Archivo runs light"); Dubai Font↔itself (single-family bilingual note); Scheherazade New↔Source Serif 4 (tashkeel headroom note); Cairo↔Archivo (variable-axis pairing note). Sources labeled `foundry`/`curator`.

**PairingSessions (3)**: "Ramadan campaign pairing" (Amiri+Source Serif 4, kashida `jalt` 0.4, revision 4); "Fintech refresh" (Cairo+Archivo, kashida off, Latin tracking 0.01em, revision 2); "Heritage masthead" (Scheherazade New+Source Serif 4, tashkeel on, leading 1.85, revision 7 — floor-clamp fixture).

**Specimens (2)**: a 6-block draft (pair-headline, body ×2, numeral-run, mixed-line, feature-notes) pinned to session 1 revision 3 (stale-pin provenance fixture); a `final` specimen with export history.

**Jobs (3)**: one succeeded render-export (artifact live); one partial-failure (block 4 failed once — per-block retry fixture); one expired artifact (NOT_FOUND + renew fixture).

## Behavior (deterministic)

- **Pacing**: job blocks advance at fixed 120ms/block; `latencyMs` per method; no timers beyond declared cadences; no randomness — injectable error streams use fixed seeds.
- **`listFontProfiles`**: fixed ordering by `familyName`; filters intersect exactly; `search` applies the Arabic normalization table (أ/إ/آ→ا، ة→ه، ى→ي، tashkeel stripped).
- **`getFontFile`**: fixture URLs with fixed `fileSizeKb`; unsupported weight → VALIDATION listing the family's real weights; format always `woff2`.
- **`setKashidaSettings`**: mode `jalt` on `tatweel-only`/`none` fonts → VALIDATION with `details.fontId = ['jalt not supported — family ships tatweel-only']`; per-line overrides validated against block count.
- **`setAlternateSelection`**: feature not in `openTypeFeatures` → VALIDATION citing the actual feature list.
- **`updatePairingSession`**: leading clamps applied and RETURNED (never silent); stale `baseRevision` → CONFLICT with both payloads in details.
- **`uploadFontFile`**: `licenseAttested: false` → VALIDATION ("attestation required"); fixture fileRef `bad-table-dir` → state `rejected` with parse details; otherwise `pending`→`active` on second poll (fixed cadence).
- **`exportSpecimen`**: idempotency-key match returns the same job (no duplicates); artifact expiry fixed at 7 days; css/json exports emit Western numerals in LTR-isolated code containers; partial-failure injection via `failBlockOnce: 4`.
- **`getUsage`**: counters derived from executed operations only (no synthetic history).

## Failure injection (MockConfig)

`{ latencyMs, errorRate, errorCode (one of the 7), failMethod?, failBlockOnce? }` — injected errors carry fixed correlationIds `kh-corr-0001`… and correct `retryable` flags per class.

## Test-support

`reset()` (seeds) · `snapshot()` / `replay()` (operation log) · zero network, zero external deps, zero clocks beyond declared cadences.
