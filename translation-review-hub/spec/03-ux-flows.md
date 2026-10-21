# 03 — UX Flows: translation-review-hub

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation — no orphans. Terminology per 02: review job · document · segment pair · glossary · term violation · length-fit warning · consistency finding · decision (approve/reject/query) · sign-off · export package.

## CP-1 — Review job → document intake → first QA scan (value proof)

1. Rana creates a review job: name ("Biweekly release 14 — checkout flows"), direction pair — source locale and target locale in either order (en→ar **and** ar→en are both first-class; pane order renders source inline-start, target inline-end, each pane at its own script direction per the pane-direction contract, 05/09) — and the glossary it enforces (from workspace glossaries, or "none for now" → term checks simply off until one is attached). `createReviewJob`
2. She imports the first document. Manual path (always available, zero credentials — LOOP-5): paste bilingual content (segment pairs one-per-block: source line, target line, optional context/limit annotations) or upload a file for the abstract intake capability to parse when bound. Import is a Job per async-contract: paced, cancellable, row-count progress ("Importing 120 of 220 segment pairs" — the seed's scale). `importDocument` · `listJobs`
3. Import lands the document with a per-segment table: source text, target text, declared character limit where the source carried one (UI strings), segment numbers as the shared referent (Sarah's pain, 02). Segment count and word-count totals are shown on the document overview. `listDocuments` · `getDocument`
4. She attaches/verifies the glossary (from step 1 or now) and runs the QA scan — a Job (deterministic; see 07c computation rules) that computes term violations, length-fit warnings, and consistency findings for every segment pair. Progress is per-segment determinate. `runQaScan`
5. First read: document overview shows the QA report — findings by kind and severity, decision state (all segments start unreviewed), and the sign-off gate status ("3 critical blockers stand"). `getQaReport`
6. Session context: her role/locale render the workspace chrome; Omar-style analysts land on the same job with the same deterministic state — same input, same findings, every time (non-AI declaration, 00). `getSession`

**Edges**: pasted rows with empty target segments (imported as-is; the QA scan flags them as missing-translation violations — category convention, 01 q2 — never dropped); mismatched source/target line counts in a block (VALIDATION naming the first broken block; import-before-the-error retained, partial policy per async-contract §4); mixed-script segments (bidi isolation at render, never force-flipped — rtl-rules §2); duplicate segment pairs (imported, flagged as consistency-relevant duplicates, not silently deduplicated); a glossary attached after import (scan re-runs, findings regenerate — never partial-remembered).
**Failures**: malformed paste → VALIDATION with the first bad row named and its neighborhood confirmed imported; intake capability unconsented → PERMISSION naming the capability class in capability language with the paste path offered inline (credential-contract §4); import job failure mid-way → typed error + retry, previously imported rows kept; scan quota (P14) → RATE_LIMIT ladder notice.
**Recovery**: documents persist across re-imports; the QA scan is re-runnable at will and after every target edit; nothing reviewed is ever lost to a failed re-scan (findings are recomputed, decisions are not).

## CP-2 — Segment-by-segment side-by-side review with terminology flags (the daily loop)

1. Yusuf opens the review workspace: segment navigator (virtualized pair list with decision + finding state) on the inline-start edge; the side-by-side pair view center — source pane and target pane each rendering at its own direction (en source LTR beside ar target RTL, or the reverse job); findings rail for the focused segment on the inline-end edge. `listSegmentPairs` · `getSegmentPair`
2. He traverses pairs by keyboard: ↓/↑ move through the navigator; Enter focuses the pair view; within the pair, focus moves source pane → findings rail → target pane in reading order, and both panes announce the pair number on focus (dual-pane focus synchronization, 09). No raw-letter shortcuts anywhere (Arabic-layout conflict class, a11y-baseline §3) — ⌘K palette, ⌘↓/⌘↑ for next/previous **unreviewed-or-flagged** pair, ⌘Enter to approve-and-advance.
3. Terminology flags render inline in the target pane: each violation is a chip on the matched span — critical (glossary-mandated term missing or forbidden term present) and advisory (preferred variant), each carrying the glossary's mandated/forbidden text so the fix is one glance away. The findings rail lists the same findings with severity and the term entry's note. `listQaFindings` (segment-scoped)
4. He resolves a violation by editing the target in place (P06 inline edit; Escape cancels; on commit the term check re-runs on that segment live — deterministic recompute, ≤50ms budget, 10) — the chip dissolves only when the rule passes. `updateSegmentTarget`
5. Or he resolves without editing: mark the finding a false-positive (recorded with the matcher's normalization note) or override a critical violation with a typed reason (the sign-off gate accepts overrides with reasons, never silence). `resolveQaFinding`
6. He sets the segment decision: approve (⌘Enter advances), reject (comment required — what was wrong, for the agency/translator loop), or **query** (routed to Sarah, the source owner: the pair view + the query text is her entire surface; her answer arrives as a comment on the pair and Yusuf re-decides). Re-deciding is always possible; history is kept. `setSegmentDecision`
7. Bulk path for clean stretches: filter the navigator (e.g., unreviewed AND no findings) and bulk-approve the filtered set — the action bar names the count and the criteria (P07); the confirm names what is being approved (P04 discipline — reversible via decision history, not silent). `bulkSetSegmentDecisions`
8. Concurrent edits (Omar on another seat): stale target edit → CONFLICT with both payloads; Sarah's source-side late edit → the segment shows a source-changed staleness mark and the decision re-opens (honesty: a decision made on a dead source is not a decision).

**Edges**: segment with 12 violations (findings rail groups by term entry, chips cluster with overflow count — never a wall); identical source translated differently (consistency finding lists sibling segment numbers as links — CP-2 jumps); the same target term used for different sources (reverse consistency, listed the same way); query answered after Yusuf already approved (his decision stands, the answer is appended history — no silent re-open); job direction ar→en flips every pane and mirror (verification matrix, 09).
**Failures**: finding resolution on a stale finding (another seat resolved it) → CONFLICT, current state shown; NETWORK mid-list → banner + retry, review state safe (P20).
**Recovery**: every decision, resolution, and edit is versioned and logged (P17); the navigator's filters and cursor persist per session (P11 — recall across sessions).

## CP-3 — Length-fit warnings + resolution (the signature check)

1. In the pair view, every segment with a declared character limit renders the **length-fit meter** next to the target pane: current length / limit as a two-tone bar with the ratio in Western numerals, severity zones — fits (≤100%), tight (100–110%, advisory), over (>110%, critical for UI-string documents) — computed arithmetically from declared values (07c rules; no assumed expansion folklore — 01 honest gap).
2. Segments without declared limits (long-form documents) render a proportional check instead: target/source length ratio against the document's declared band (default band is a workspace-configurable heuristic, labeled as such in-product — no published ar↔en table exists to cite, 01 q4).
3. Yusuf resolves an over-limit warning by editing the target to fit (live meter — the number is the budget, the pane is the proof) — the warning closes on recompute. `updateSegmentTarget`
4. Or he acknowledges the overflow with a reason ("design approved a two-line label for this one") — recorded on the finding, visible at sign-off and in the export QA report. `resolveQaFinding`
5. Rana adjusts the document's length policy defaults when the source declared bad limits (e.g., the import mis-read a 40-char limit as 4): the policy edit re-runs affected warnings deterministically. `updateReviewJob` (length-policy patch, versioned) — edge-warned in the UI that this re-computes findings, never silently.

**Edges**: zero-limit source with a long target (proportional band catch); ar target shorter than en source yet visually overflowing (ratio + declared limit only — the meter never guesses visual width; the review pair view itself is where the eye test happens, 09); limits changed upstream after decisions exist (affected decisions re-open, same as source staleness).
**Failures**: none specific — falls into the shared error mapping (VALIDATION on policy edit sanity, e.g., band min > max).
**Recovery**: length policies are versioned on the review job; warnings are recomputed from declared values — re-running never mutates decision history.

## CP-4 — Glossary management (the terminology asset)

1. Rana (or Omar, per-client) creates a glossary: name, language pair matching the job direction, note. Workspace scoping keeps client termbases apart (Omar's pain, 02). `createGlossary` · `listGlossaries`
2. Term entry authoring: source term, target term(s), direction of mandate (e.g., en "shopping cart" → mandated ar "السلة"; forbidden ar "عربة التسوق"), severity (critical | advisory), status (active | deprecated), note for reviewers (the "why" that Yusuf reads in the chip). Keyboard-complete editor; validation on save (both-language terms required for mandated entries). `saveTermEntry`
3. Editing an active term that is already enforced: the edit re-versions the entry; existing findings keep the version they were computed against, and the next scan (or per-segment live recheck) uses the new version — findings carry the term version (audit honesty). `saveTermEntry` (baseVersion → CONFLICT on stale)
4. Deprecating/deleting a term: delete is P04 level-2 (confirm naming the entry and that its findings will close on next scan); deprecate is the reversible alternative (entry stays, checks stop, history intact). `deleteTermEntry`
5. Termbase intake by paste (CSV-ish lines: source, target, severity, note) — the manual LOOP-5 path; the abstract intake capability can also deliver termbases when bound. Bulk import is a Job with row-count progress and named bad rows. `importGlossary` — see 07b signature
6. Yusuf consults the glossary mid-review: normalized bilingual search (alef/hamza, taa marbuta/heh, yaa/alif maqsura, tashkeel-stripped — rtl-rules §4; normalization disclosed in the search panel per ai-native-patterns §7.4 — a non-AI product still discloses its matching rules). `listTermEntries` · `getGlossary`

**Edges**: two active entries mandating the same source term differently (VALIDATION on save — the conflict is named, not silent); a term whose target contains Latin script inside an Arabic mandate (bidi-isolated render in the editor preview); forbidden-term entries with an empty mandate side (allowed — pure blacklist entries).
**Failures**: stale term edit → CONFLICT both kept; delete of an entry with open findings → allowed only through the P04 confirm which names the open-finding count (never a silent mass-close).
**Recovery**: term entries are versioned; glossary state is snapshot-able (07c) and every finding carries the term version it was computed against.

## CP-5 — Sign-off, export & handoff (the governance gate)

1. Rana opens sign-off on a review job: the gate reads live state — unresolved critical findings (term violations + over-limit warnings + missing translations) and unreviewed segments. The gate REFUSES while any stand: the refusal names the blockers with links (never a generic "not ready" — P04 discipline at job scale). `getReviewJob` (gate state) · `getQaReport`
2. Yusuf/Rana clear the blockers: approve remaining segments, resolve findings (edit / override-with-reason / false-positive). The gate status updates live.
3. Sign-off executes: recorded with actor, timestamp, and the full resolution ledger (every override reason, every false-positive, every acknowledged overflow) — the audit artifact (P17 + async-contract honesty). Post-sign-off edits re-open the sign-off (a signed job is a version; edits create a new pending state, the old signature stays). `signOffReviewJob`
4. Export the review package: bilingual review table (segment pairs + decisions + comments), QA report (findings, resolutions, severity summary), and the termbase as reviewed — a Job with expiry + regeneration per async-contract; quota shown before running (P14). Manual handoff is the default: download/copy; the abstract "review export channel" delivers when bound (08 N2). `exportReviewPackage` · `getArtifact` · `listJobs`
5. Jobs console across the product: imports, scans, exports — filterable, cancel/retry, link-to-context (async-contract §7). Settings: direction/locale defaults (informational — workspace-level length-policy defaults are read at job creation, 07a Workspace), capability consent state (kind, not vendor — credential-contract), usage window. Job rename happens from the jobs-home row menu (versioned write). `listJobs` · `getSession` · `getUsage` · `updateReviewJob` (rename)

**Edges**: sign-off with advisory findings open (allowed — advisories are warnings by definition; they are listed in the sign-off summary, not blockers); export of a job signed before a late source edit (the package carries the signed version and flags the newer pending state — honesty at handoff); artifact expired → NOT_FOUND with regenerate (the review state is unchanged — regeneration is deterministic).
**Failures**: export quota → RATE_LIMIT ladder with reset time; export failure mid-package → partial policy (per-format retry, async-contract §4); NETWORK during delivery → retry, artifact held.
**Recovery**: sign-offs are immutable records; export packages re-generate from review state at any time; the jobs console reconciles after reconnect (async-contract §5).

## Non-happy paths

- **No glossary yet** (first-run): the product states term checks are off and offers the sample glossary + sample job (P22 value checklist — the parity moment for this product is *seeing a critical violation block a sign-off*, so the sample job ships with one planted). `createGlossary` · `importDocument` on the sample, or `listGlossaries` first-run empty state (11).
- **Intake capability unbound** (LOOP-5): paste/upload is the primary path from first run; the capability path renders as optional with its consent surface, never a wall (08 N1).
- **Machine-translation assist channel** (08 N4): declared contract-compatible but v1 logic out of scope — if a future binding provides suggestions, they land as *draft target text* in an edit-confirmation step, never as silent writes to reviewed segments (P15 discipline carried structurally).
- **Offline**: reads work; decisions/edits queue with per-item state and recompute findings on reconnect (P20; deterministic checks make offline review safe — same input, same findings).

## Failure → error mapping

VALIDATION (malformed import rows, glossary/term field rules, length-policy sanity, sign-off gate attempts) · NOT_FOUND (stale job/document/segment/artifact links, expired artifacts) · PERMISSION (capability consent, workspace scoping, viewer-role mutations) · CONFLICT (concurrent target edits, term-entry edits, finding resolutions) · RATE_LIMIT (QA scan runs, export packages) · NETWORK (list fetches, job polling, export delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.6, CP-5.5 |
| `createReviewJob` | CP-1.1 |
| `listReviewJobs` | App entry · S1 jobs home (04) — the workspace's first screen, exercised on entry by every persona in 02 |
| `getReviewJob` | CP-1.5 (job header), CP-5.1 (gate state) |
| `updateReviewJob` | CP-3.5 (length policy), CP-5.5 (rename from jobs home) |
| `importDocument` | CP-1.2, non-happy sample job |
| `importGlossary` | CP-4.5 (termbase paste/import) |
| `listDocuments` | CP-1.3 |
| `getDocument` | CP-1.3, CP-1.5 (document overview) |
| `listSegmentPairs` | CP-2.1, CP-2.7 (filtered bulk set) |
| `getSegmentPair` | CP-2.1, CP-2.8 (sibling links), CP-2.6 (query thread) |
| `updateSegmentTarget` | CP-2.4, CP-3.3 |
| `setSegmentDecision` | CP-2.6 |
| `bulkSetSegmentDecisions` | CP-2.7 |
| `runQaScan` | CP-1.4, CP-4.3 (post-term-edit rescan) |
| `getQaReport` | CP-1.5, CP-5.1 |
| `listQaFindings` | CP-2.3 (rail), CP-2.8, CP-3.4, S4 findings console (04) |
| `resolveQaFinding` | CP-2.5, CP-3.4 |
| `listGlossaries` | CP-4.1, non-happy first-run |
| `createGlossary` | CP-4.1 |
| `getGlossary` | CP-4.6 |
| `listTermEntries` | CP-4.6 |
| `saveTermEntry` | CP-4.2, CP-4.3 |
| `deleteTermEntry` | CP-4.4 |
| `signOffReviewJob` | CP-5.3 |
| `exportReviewPackage` | CP-5.4 |
| `getArtifact` | CP-5.4 |
| `listJobs` | CP-1.2, CP-5.4, CP-5.5 |
| `getUsage` | CP-5.4 (pre-export quota), CP-5.5 |

29 operations, 0 orphans (Critic-verified — the table above lists every 07b operation exactly once). `listReviewJobs` is the jobs-home entry surface (04 S1) — the workspace's first screen, exercised on app entry by every persona in 02.
