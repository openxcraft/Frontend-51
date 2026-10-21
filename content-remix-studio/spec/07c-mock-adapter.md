# 07c — Mock Adapter: content-remix-studio

In-memory, deterministic, zero deps. Implements `RemixAdapterV1`.

## Seeds (fixed)
- **Sources** (5): a 1,200-word bilingual tech newsletter issue (mixed language with isolated Latin runs); a 900-word Arabic article with levantine dialect passages (dialect trigger); a 700-word English essay; a 400-word short post (below thread-recipe minimum — validation fixture); a sample source for first-run remix (non-happy path fixture).
- **Recipes**: 5 stock (thread 8-section, carouselOutline 10-card, emailTeaser 3-section, shortVideoScript 4-beat, communityAnnouncement 2-section — all with fixed structureMaps) + 1 workspace recipe at v2 (Samar-style client clone, edited structure) + 1 invalid draft (min>max in one section — validate fixture).
- **Derivatives** (6): a completed thread derivative with full receipt (12 links: 7 drawn, 4 condensed, 1 recipe-added); one editedBeyondRecipe (two blocks manually rewritten — derived flag on); a paired bilingual pair from the mixed source; one ready, one exported.
- **Jobs history**: one successful run, one partial-failure run (block 4 failed once, succeeded on retry), one export bundle with an expired artifact.

## Behavior
- `runRecipe`: source below recipe minimum → VALIDATION with the minimum statement; dialect source without explicit resolution → VALIDATION demanding the choice (never defaults); job paces per-block deterministically (80ms/block); partial-failure injectable via config (fail block 4 once).
- Receipt computation: deterministic span mapping from fixed tables; condensation ratios computed from word counts; recipe-added blocks marked.
- `updateDerivative` stale revision → CONFLICT; edits set editedBeyondRecipe derived flag.
- `regenerate` block-scoped re-runs only that block; whole-discard regenerates all (after UI confirm per 07b rule 2).
- `exportDerivatives`: watermark flag baked when set; bilingual pairs bundle linked; expired artifact → NOT_FOUND + renew path; idempotent re-run same ids returns same artifact.
- Error injection per method: MockConfig {latencyMs, errorRate, errorCode, failBlockOnce}. Fixed correlationIds `rx-corr-0001`…

## Test-support
reset/snapshot/replay. No randomness, no network, no timers beyond declared cadences.
