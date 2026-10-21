# 03 — UX Flows: zakat-calculation-suite

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation exactly once — no orphans, no phantoms. All arithmetic in every path is deterministic (00 non-AI declaration); every edge below has a copy line in 11.

## CP-1 — New case → item intake → first calculation (value proof)

1. Nadia creates a case: external reference from her register, bilingual subject name ("شركة النور للتجارة" / Al-Noor Trading Co.), subject type, hawl/fiscal period (Gregorian dates, Hijri shown secondary per P24), reporting currency, and an **approved** methodology profile from the picker. `createCase` · `getSession` (role/locale entry)
2. Case workspace opens on the Items tab — empty on first run (P01 first-run copy teaches the category-first intake). Subject/period corrections and a profile switch are draft-time edits. `getCase` · `updateCase`
3. She adds items one by one — the LOOP-5 primary path: category → amount/quantity → flags (jewelry, recoverability, irrigation, mid-hawl acquisition) → evidence note. Category choice re-shapes the item's fields (progressive disclosure, P09: the form asks only what the category needs). `addCaseItem`
4. Bulk convenience: she pastes the statement export — a Job with row-count progress, named bad rows, per-row retry. `importItems` · `listJobs`
5. Item table review: category filter chips, bilingual search, inline edit with escape hatch (P06), void-with-reason (never hard delete — audit trail). `listCaseItems` · `updateCaseItem` · `voidCaseItem`
6. **Run the calculation** (⌘Enter): the basket aggregates per the profile's rules, the nisab gate fires, the derivation trace renders line by line. Below nisab is an honest result, not an error. `runCalculation`
7. First read: zakat due (or the below-nisab state with the distance figure), per-category dues, in-kind dues (livestock heads, crop kg), the trace with every rule and its source chip. `getCalculation`

**Edges**: a gold-silver item with no pinned reference for its metal → VALIDATION naming the metal and the manual entry path (CP-3 link); an agriculture item with irrigation 'mixed' while the profile has no mixed rate → VALIDATION naming the shariah-owner configuration path; a receivable marked weak → treated per the profile's rule and narrated in the trace (never silently dropped); an item flagged acquired-mid-hawl → included per the profile's hawl-continuity note with the flag visible on the trace line (the product takes no silent side); liability items with side 'liability' but a category the profile does not deduct → trace line says so in plain text.
**Failures**: malformed import row → VALIDATION with the first bad row named, prior-good rows kept (partial policy); stale inline edit → CONFLICT with both values; draft/retired profile at calculation time → VALIDATION naming the approval gate.
**Recovery**: items persist across failed calculations; every re-run with unchanged inputs returns the identical result (determinism contract, 07b rule 1); calculations are versioned history. `listCalculations`

## CP-2 — Madhhab comparison (the signature flow)

1. With items in place, Nadia (or Sheikh Salman during methodology review) opens Compare: picks 2–5 approved profiles — e.g. Hanafi vs Shafi'i on Huda's individual case. `listProfiles`
2. The comparison runs the same case under every selected profile, synchronously (budget-bound per 10). Each cell is a pinned, reproducible calculation. `createComparison` · `runCalculation` (per-profile under the hood)
3. Comparison view: category rows × profile columns, per-cell due values, and the **divergence markers** — every category where the schools differ is flagged with the rule pair that made the difference ("jewelry zakatable (Hanafi) vs exempt-within-uruf (Shafi'i)"). `getComparison`
4. Rule inspection: opening a divergence shows both rules side by side with their source notes — the shariah reviewer reads the fiqh basis, not a black box. `getProfile`
5. The shariah authority decides; the officer exports the comparison for the methodology file. `exportComparison` · `getArtifact` · `listJobs`

**Edges**: profile sets mixing statuses → VALIDATION (only approved profiles compare — an unapproved rule set must never reach a reviewer's desk); a profile retired after the comparison was generated → the comparison snapshot stays valid (version pins); divergence in in-kind dues (sheep 145 → 2 heads under both, camels 121 → different kinds per school on the 121–129 band — the seeded Hanafi variant band, verify-flagged per 07c) → shown as kind names, never monetized silently; identical results across schools → the matrix says "no divergence" plainly (the absence of a difference is information, not a dead screen).
**Failures**: export failure mid-bundle → per-artifact retry (async-contract §4); artifact expired → NOT_FOUND with renew path.
**Recovery**: comparisons are immutable snapshots; re-running after item edits creates a new comparison, never mutates history. `listComparisons`

## CP-3 — Nisab references & pinning (reference discipline)

1. The Nisab & Valuations surface lists entered references per metal — value per gram, currency, as-of date, the officer's source note, active flag. Empty on first run: the manual entry path is the primary path (LOOP-5 — no feed credential is ever required). `listNisabReferences`
2. Nadia enters today's references from her source (mint table, jeweler quote, treasury feed export): value per gram + as-of date + source note. The entry is an accountable act (activity log). `setNisabReference`
3. She pins references to the case — both metals frozen; every future calculation of this case uses the pin until re-pinned (a re-pin + re-run produces a NEW result version; history is never rewritten). `pinNisabReferences` · `updateCase` (re-pin flows through case version)
4. The NisabGauge on the calculation surface shows the threshold arithmetic: nisab value (grams × pinned per-gram), the basket, above/below, and the signed distance when below. `getCalculation`

**Edges**: one metal pinned, the other missing → VALIDATION naming exactly which metal; a reference entered in a different currency than the case → the surface flags it at pin time (conversion is the officer's documented decision via the source note, never a silent FX guess — 12 Q-12); a case pinned to a retired reference → still computes (the pin is frozen evidence); the workspace numeral policy renders AR-indic in Arabic prose and Western in data tables per the ledger row.
**Failures**: pin on a locked case → VALIDATION naming the successor path; stale case version at pin → CONFLICT.
**Recovery**: references are append-only history; wrong entries are superseded (new entry, old one deactivated), never edited in place.

## CP-4 — Review → lock → audit export (certification)

1. The reviewer opens an in-review case: calculation summary, the trace, item states, the pinned references — the review reads the evidence, not a summary of it. `getCase` · `getCalculation` · `listCalculations` (result history)
2. The officer submits the case for review with a note (draft → in-review; the case freezes for review). `submitCaseForReview`
3. The reviewer approves (with note) or returns it to draft (with the reason the officer must act on). Both decisions append to the activity log with actor and timestamp (P17). `reviewCase`
4. **Lock** (⌘⇧L): the case freezes — items, profile, period, pins all immutable; the locked calculation becomes the certified number. `lockCase`
5. **Export the audit bundle** (bilingual, trace included): a Job with honest progress; the artifact carries an expiry window and a regeneration path. `exportCase` · `getArtifact` · `listJobs`
6. Correction after lock: a locked case is never edited — the reviewer spawns a successor case linked through `predecessorCaseId` with the reason on the chain. `createSuccessorCase`

**Edges**: reviewer attempts to lock without approval → VALIDATION naming the review decision gate; officer edits an in-review case → typed refusal naming the return-to-draft path; export with locale 'bilingual' → both languages' labels, amounts canonical; the export artifact names the case's methodology profile and version, pinned reference values, and the workspace's numeral policy.
**Failures**: bundle generation failure → scoped retry, artifact atomicity; expired artifact → NOT_FOUND + regenerate (regenerable is true while the case stays locked); NETWORK mid-export → banner + retry (P20), the job reconciles to authoritative state.
**Recovery**: locked cases are re-exportable forever; artifact expiry never loses the case — regeneration is deterministic from the frozen state.

## CP-5 — Case register, methodology admin, jobs, settings (the daily surface)

1. Cases home: register list with status, period-end dates (Hijri secondary), currency, profile school chips, filters + saved views (P08). `listCases` · `getSession`
2. Jobs console: import/export jobs with state, cancel/retry, link-to-context (async-contract §7). `listJobs`
3. Methodology profiles admin: the shariah owner inspects rules with source notes, edits policy data (e.g., sets the agriculture mixed rate, adjusts a livestock band after verifying the schedule), approves, retires — every edit re-versions the profile and reverts to draft. `listProfiles` · `getProfile` · `saveProfile` · `approveProfile` · `retireProfile`
4. Settings: default locale, numeral policy (AR-indic in Arabic prose — the ledger default), Hijri display method, workspace default profile. `getUsage` (import/export window meter — calculations deliberately unmetered)

**Edges**: filtered-empty declares itself (P01); >200 item rows virtualize (P19); no-access cases → PERMISSION surface, never "empty"; retired profiles remain listed (history), marked unusable for new cases.
**Failures**: NETWORK mid-list → banner + retry (P20); usage read failure → "last known" degrade.
**Recovery**: all list surfaces cursor-paginated; session locale switch re-renders both directions without data loss.

## Non-happy paths

- **First-run (P22)**: the cases home offers a seeded sample case (fully worked trading-company computation) so the trace, the nisab gate, and the comparison moment are experienceable before real data arrives; the sample carries its badge and clears in one action.
- **Below nisab**: the calculation completes with a below-nisab state — distance figure, per-category thresholds that fired independently (livestock counts and crop weights do not wait for metal nisab), and plain copy: no zakat is due on this basket, and here is exactly how far below it sits. A below-nisab result is exportable like any other (auditors ask for negatives too).
- **No reference feed bound (LOOP-5)**: entered references are the primary path from minute one; the abstract feed capability (08 N1) renders as optional convenience, never a wall.
- **Draft methodology in the workspace**: the Shafi'i default is seeded approved; the Maliki draft-profile fixture exists to exercise the approval gate honestly (07c).
- **Offline (P20)**: reads work; item edits queue with per-item state; jobs reconcile on return (async-contract §5).

## Failure → error mapping

VALIDATION (bad import rows; draft/retired profile gate; locked/approved-case mutation gate; unpinned metal; missing mixed rate; review-decision gate) · NOT_FOUND (stale case/item/calculation/comparison/artifact links) · PERMISSION (role gates: profile approval, review, lock; workspace scoping) · CONFLICT (concurrent case/item/profile/pin edits) · RATE_LIMIT (imports, exports — never calculations) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, CP-5.1/4 | `createComparison` | CP-2.2 |
| `createCase` | CP-1.1 | `getComparison` | CP-2.3 |
| `listCases` | CP-5.1 | `listComparisons` | CP-2.5 (history), CP-5.3 |
| `getCase` | CP-1.2, CP-3.3, CP-4.1 | `listProfiles` | CP-1.3 (picker), CP-2.1, CP-5.3 |
| `updateCase` | CP-1.3, CP-3.3 (re-pin path) | `getProfile` | CP-2.4, CP-5.3 |
| `addCaseItem` | CP-1.4 | `saveProfile` | CP-5.3 |
| `importItems` | CP-1.5 | `approveProfile` | CP-5.3 |
| `listCaseItems` | CP-1.6, CP-2.1 (item context) | `retireProfile` | CP-5.3 |
| `updateCaseItem` | CP-1.7 | `listNisabReferences` | CP-3.1 |
| `voidCaseItem` | CP-1.8 | `setNisabReference` | CP-3.2 |
| `runCalculation` | CP-1.6, CP-2.2 (per profile) | `pinNisabReferences` | CP-3.3 |
| `getCalculation` | CP-1.7, CP-3.4, CP-4.1 | `submitCaseForReview` | CP-4.2 |
| `listCalculations` | CP-4.1 (result history) | `reviewCase` | CP-4.3 |
| `exportCase` | CP-4.5 | `lockCase` | CP-4.4 |
| `exportComparison` | CP-2.5 | `createSuccessorCase` | CP-4.6 |
| `getArtifact` | CP-2.5, CP-4.5 | `listJobs` | CP-1.5, CP-4.5, CP-5.2 |
| `getUsage` | CP-5.4 | | |

33 operations, 0 orphans (Critic-verified).
