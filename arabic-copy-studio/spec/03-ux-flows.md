# 03 — UX Flows: arabic-copy-studio

SME-C pass · Critical paths, edge cases, failure modes, recovery, non-happy paths. Every path below is the justification source for adapter operations in 07a/07b (no orphan methods).

## CP-1 — First-run → brand kit → first register-controlled draft (value proof)

1. Workspace creation (name, default locale ar/en, default register proposal).
2. Brand kit quick-start: paste a voice description or import a term sheet (abstract file-parse need, manual paste alternative per LOOP-5); skip is explicit ("Continue without a brand kit — AI suggestions will be marked unbranded").
3. New document: brief form (asset type, audience, length target, key points) — progressive disclosure (P09): required fields only, optional tone hints behind "more".
4. Register selection via Register Dial (فصحى بيضاء / فصحى وسطى / declare-dialect-tolerant) with one-line plain-language effect previews.
5. Generation streams into the document canvas (P13): reserved space, stop/regenerate present, citations if brief referenced facts.
6. Save state persists (P10); user edits freely; register drift flags appear inline as they edit.

**Edge cases**: skipped brand kit (generation proceeds, suggestions carry "unbranded" treatment, non-blocking banner offers setup later); brief contains English for an Arabic document (transform suggestion, not silent translation); register selection contradicts glossary register hints (warning card with choice).
**Failure modes**: stream fails at token N (partial retained + marked, retry-continue or discard); quota exhausted pre-generation (quota ladder rung 2: reduced length with notice); validation failure on brief (field-linked errors, error summary focus).
**Recovery**: all autosave states (P10); conflict resolution offers both versions side-by-side (P16-lite for blocks).

## CP-2 — Inline refine loop (the daily loop; performance-critical)

1. Open the day's document from the workspace home (S1) into the editor (getDocument — staged boot: shell → blocks → glossary highlights, 04 S3), then select a passage → AI panel contextualizes (rewrite shorter / stronger hook / register tighten / glossary-align).
2. Suggestion streams into a DiffBrush overlay on the passage (old text struck, new text inked).
3. Accept (⌘⏎) / Reject (Esc) / Refine-again with a note.
4. Accepted change commits to a new revision; undo window (P03) applies.

**Edge cases**: selection spans mixed ar/en (bidi isolation per span, both directions render correctly); selection inside a tashkeel-on document (suggestions preserve vocalization policy); concurrent editor same passage (block-level lock indication + conflict path per P16).
**Failure modes**: suggest fails (typed error inline in panel — passage untouched, never half-applied); latency >4s (inline progress with honest indeterminate state + cancel per async-contract).
**Recovery**: every refine action is a revision; revision history is the recovery surface.

## CP-3 — Bilingual transform with parity review (unique feature path)

1. Source document (or selection) → "Transform" → target locale + target register + length policy (strict/comfortable).
2. Job (async-contract §1) with per-block progress; transform preserves block structure.
3. Parity Weave view: source and transform blocks aligned with links (P23); length deltas flagged per block; glossary terms rendered as chips in both columns (term parity visible).
4. Writer reconciles per block: accept / edit transform / re-transform single block.
5. Commit creates the paired document version (en↔ar linkage recorded in 07a).

**Edge cases**: length-strict policy violated (explicit per-block warning with alternatives — never silent truncation); idioms detected (flag with note, not literal conversion); source contains dialect (dialect warning card pre-transform with normalize choice); glossary term missing in target (term chip red, manual entry requested).
**Failure modes**: job fails mid-way (partial blocks delivered + marked per async-contract §4, retry scoped to failed blocks); awaiting-input state when glossary conflicts detected (job pauses; decision surface links to the job).
**Recovery**: partial transform is a first-class saved state, never discarded.

## CP-4 — Glossary enforcement pass (governance loop, Omar's path)

1. Open document or batch-select documents → "Glossary check".
2. Inspection report: term hits, term misses (concept present, preferred term absent), banned-term violations, register drift summary.
3. Apply suggestions selectively (bulk-apply with per-item opt-out per ai-native-patterns §6).
4. Report exports as audit artifact (activity log entry appended).
5. Glossary upkeep rides the same loop, above document scope (S6 manager): browse/filter the term list with a conflicts-only view (listGlossaryTerms); a term miss in the report — or a red term chip in Parity Weave — deep-links to adding the missing preferred term (upsertGlossaryTerm, the manual-entry path in the CP-3 edge); two terms sharing a conflictGroup end in the owner's keep-one decision (resolveGlossaryConflict — the contradictory-terms edge below, never a silent pick).

**Edge cases**: contradictory glossary terms (same concept, two definitions — LOOP-9 surface: both shown, owner decision required, never silent pick); term matches inside code/Latin runs (bidi-isolated, excluded); document locale mixed.
**Failure modes**: inspection timeout (typed error, retry); report >500 items (virtualized list P19 + filter by severity).
**Recovery**: check is read-only until applied; application is revisioned.

## CP-5 — Review, approve, export (handoff path)

1. Send document to review (status → in-review; reviewer sees diff since last approval).
2. Reviewer annotates block-level comments; resolves or requests changes.
3. Approve (status → approved; approval recorded with actor + timestamp — activity log).
4. Export: format choice (plain text, doc format, clipboard bundle per asset), watermark option "AI-assisted draft" for governance-sensitive buyers; artifact delivered per async-contract §2 (succeeded → linked artifact with expiry).

**Edge cases**: reviewer edits directly (permission allows; changes enter the diff trail); export of paired bilingual documents (bundle both locales with parity links); approved document edited later (status → auto "amended", re-approval required).
**Failure modes**: export job failure (typed error + retry; partial bundles per policy); reviewer removed mid-review (reassignment path).
**Recovery**: approval history is immutable; amendments are new revisions.

## Non-happy-path walkthroughs (documented, tested)

- **AI fully unavailable (degradation rung 4)**: drafting/editing/versioning/review/export all function; AI panel shows clean unavailability state with reset-time; quota ladder documented in 11 matrix. Product remains a real writing environment (LOOP-5 posture).
- **Offline mid-session**: banner (P20), local queue for edits, conflict path on reconnect; AI operations explicitly disabled with reason.
- **First-session abandonment**: return state (async-contract §6.3) resumes the unfinished brief exactly where left (3.3.7 redundant-entry satisfied).
- **Malicious-input briefs** (e.g., 500KB brief text): length validation, typed error, honest limit copy — no silent truncation.

## Operation coverage table (no-orphan proof, Critic evidence)

| 07b operation | Flow step (above) that exercises it |
|---|---|
| getSession | App entry · S1 first paint — the auth-agnostic session surface (role, locale) read once on entry; not forced into a CP step |
| listDocuments | S1 list (workspace home) |
| getDocument | CP-2.1 (open from S1 into the staged S3 editor); CP-4.1 open/batch-select; CP-5.1 reviewer diff loads the document at its revision range (S9) |
| createDocument | CP-1.3 brief form |
| updateBlocks | CP-2.3 accept commits; CP-3.4 reconcile/edit transform (the paired-doc variant write is updateBlocks) |
| updateDocumentStatus | CP-5.1 send to review (→ in-review) |
| startGeneration | CP-1.3 brief submit → CP-1.5 stream |
| subscribeGeneration | CP-1.5, CP-2.2 (quotaBlocked rides the stream) |
| stopGeneration | CP-1.5 stop/regenerate |
| startRefinement | CP-2.1 selection refine |
| acceptSuggestion | CP-2.3, CP-4.3 apply suggestions |
| transformContent | CP-3.1/CP-3.2 transform job; CP-3.5 commit (pairedDocumentId) |
| getJob | CP-3.2, CP-5.4 |
| retryJob | CP-3.2 (failed-blocks scope, async-contract §4) |
| cancelJob | CP-3.2 |
| inspectText | CP-1.6 drift flags, CP-4.2 inspection report |
| listGlossaryTerms | CP-4.5 (S6 term list, conflict-only filter) |
| upsertGlossaryTerm | CP-4.5 add/edit term; CP-3 edge manual entry for a missing target term |
| resolveGlossaryConflict | CP-4.5 + CP-4 edge (contradictory terms → owner keep-one, LOOP-9) |
| importGlossary | CP-1.2 term-sheet import |
| getBrandKit | CP-1.2 brand kit quick-start, S7 |
| updateBrandKit | CP-1.2 |
| addComment | CP-5.2 annotations |
| approveDocument | CP-5.3 |
| exportDocument | CP-5.4 |
| getArtifact | CP-5.4 artifact with expiry |
| getUsage | S12 usage & quota; degradation/quota ladder rungs (non-happy paths) |

27 operations, 0 orphans — every 07b operation appears above exactly once; every row is a 07b method (reverse check: zero phantoms). CP-1.1 workspace creation and S14 seat/role admin bind to workspace-settings operations outside 07b v1 scope (declared scope, not orphans).

## Failure-mode → error-class mapping (feeds 07b/11)

| UX failure | Error class | User-facing surface |
|---|---|---|
| Brief invalid | ValidationError | field-linked inline |
| Document gone (deleted elsewhere) | NotFoundError | editor safe-state + list refresh |
| No permission (shared doc revoked) | PermissionError | lock screen with request-access action |
| Concurrent edit | ConflictError | both-versions compare |
| Meter/window exceeded | RateLimitError | quota surface + ladder |
| Stream/transport drop | NetworkError | partial-kept + retry |
| Anything else | UnknownError | correlation-id copy (copy-voice §1.4) |
