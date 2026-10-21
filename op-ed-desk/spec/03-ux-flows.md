# 03 — UX Flows: op-ed-desk

SME-C pass · 5 critical paths. (C) = contributor-surface step. Coverage table at end traces every 07b operation.

## CP-1 — Submit → triage → anonymized round → decision + feedback (the spine)

1. (C) Farida opens the intake form, pastes her draft, fills identity/disclosures, attests exclusivity, submits → receipt with reference code; no account. `submitDraft`
2. Amina opens the triage queue (arrival sort, SLA state per row); intake pre-checks already ran — word band, language, first deterministic lint summary. `listSubmissions`
3. She opens a submission: full view with identity (editor role only), lint sidebar, contributor history panel. Triage: advance / decline (fast-path letter) / hold. `getSubmission` · `updateTriage` · `getContributor`
4. On advance she picks reviewers; the COI guard warns/blocks on organization or prior-relationship matches (category only — never identity to reviewers); the anonymized view generates (deterministic scrub + leak pass). `openReviewRound` · `getAnonymizedView`
5. Youssef opens his round → blind workspace: anonymized text, findings sidebar, recommendation composer; confirms review integrity and submits. `getAnonymizedView` · `submitReview`
6. Round completes → round summary (aggregate + individual recommendations, unresolved findings carried in) → decision composer (letter from structured parts) → record, send. `submitReview` · `recordDecision` · `sendDecision`
7. (C) Farida checks status by code → status + letter. `getSubmissionStatus`

**Edges**: COI match at assignment; over-length piece (policy warning at intake, never auto-reject); mixed-language draft (bidi-isolated spans, numeral-mix finding); leak mid-round (below); revision (CP-4).
**Failures**: missing attestation → VALIDATION (field-linked); blocked COI pair → VALIDATION naming category; review after round closed → CONFLICT; send failure → typed error + manual path (08 N3); offline queue → NETWORK (P20).
**Recovery**: submissions immutable (revisions = new linked submissions); decisions recorded before send (send retriable, idempotent); declines archive with letters.

## CP-2 — Style-lint pass (the gate every piece passes)

1. Trigger from detail or blind workspace: deterministic pass always; full pass (AI categories) when capability active (08 N2). `runStyleLint`
2. Lint is a Job per async-contract — category-paced progress, cancellable. `listJobs`
3. Report renders in the sidebar: policy / style / integrity groups, span anchors, bidi-safe. `getLintReport`
4. Resolve findings: acknowledge / dismiss / fixed; resolutions persist per report; unresolved ride into the decision summary. `updateFinding`
5. Full-pass quota metered before/after (P14). `getUsage`

**Edges**: full-pass unavailable → deterministic-only report with degraded notice (ai-native-patterns §5); revisions keep prior reports linked to old versions (chain diff P16); dialect in quoted speech → register flag with acknowledge option; tashkeel flag with line-height headroom → rendering note only.
**Failures**: lint Job failure → typed retry, prior report remains; RATE_LIMIT on full pass → ladder notice, deterministic unaffected; mixed-direction spans → anchors recompute on bidi isolate boundaries.
**Recovery**: reports re-runnable; resolutions preserved; deterministic core never depends on the capability (08 map).

## CP-3 — Escalation, reassignment, override

1. Round overdue (visible SLA state, never a hidden timer) → reassign with reason (logged). `reassignReviewer`
2. Reviewer recuses mid-round → reassign; if recusal implies identity knowledge, view regenerates. `reassignReviewer` · `getAnonymizedView`
3. Split round (1–1) → decision with override flag + REQUIRED rationale (P15: UI shows the split, blocks submit until rationale non-empty). `recordDecision`
4. Second round on a revision → new round, fresh anonymized view. `openReviewRound` · `getAnonymizedView`

**Edges**: reassign to COI match → guard warns; every reassignment/override logs (P17).
**Failures**: unknown/inactive reviewer → NOT_FOUND/VALIDATION; override without rationale → VALIDATION.
**Recovery**: reassignment retains prior reviewer's partial notes; overrides final but appealable via a new linked submission.

## CP-4 — Contributor revision cycle

1. (C) Farida checks status → "طلب تعديل" + feedback letter (findings digest + notes). `getSubmissionStatus`
2. (C) She revises, resubmits with her reference code → linked chain; desk sees direction-aware diff (P16). `submitDraft` (revisionOf)
3. Desk triages the revision with prior findings as baseline; round opens on revised text. `listSubmissions` · `getSubmission` · `runStyleLint` · `openReviewRound`

**Edges**: revision exceeds band after cut request → warning on chain; mistyped code → VALIDATION with no identity hint; post-final-rejection resubmit → new chain, clearly separated.
**Failures**: revision of a differently-decided piece → CONFLICT explaining both states.
**Recovery**: chain view keeps every version and letter (accountability spine).

## CP-5 — Slush queue management (the daily surface)

1. Work the queue with filters (status, language, topic, SLA); shareable URL views (P08, client-side). `listSubmissions`
2. Bulk triage: select rows (keyboard range, P07) → bulk decline with fast-path letters; confirm names count and consequence (P04 L2 — content retained). `updateTriage` ×N · `sendDecision` ×N
3. Contributor files: search + history (editor-only). `listContributors` · `getContributor`
4. Activity/jobs console: P17 log + lint jobs. `listJobs`

**Edges**: filtered-empty declares itself (P01); >200 rows virtualize (P19); bulk decline on a piece advanced elsewhere → CONFLICT naming the row.
**Failures**: NETWORK mid-bulk → per-item states, retry scoped to unsent letters (async-contract §4).
**Recovery**: triage is non-destructive — declines archive, holds park, advances open rounds.

## Non-happy paths

- **Leak mid-round**: Youssef flags a span → round pauses, view regenerates (v+1) with span scrubbed, reviewers get resume notice; flag anonymous within round. `flagAnonymizationLeak` · `getAnonymizedView`
- **First-run desk**: honest queue empty + intake link + sample piece (11 A).
- **Text-analysis capability down**: full-pass affordance disabled with reason; deterministic lint unaffected.
- **Notification channel down**: letters render with copy-to-clipboard manual path, marked unsent.

## Failure → error mapping

VALIDATION (intake fields, COI blocks, integrity attestation, override rationale, revision linkage) · NOT_FOUND (stale submission/reviewer/letter/code links) · PERMISSION (reviewer full-view scoping, contributor files) · CONFLICT (closed rounds, concurrent triage, decided-elsewhere revisions) · RATE_LIMIT (full-pass quota) · NETWORK (queue fetch, send, job polling) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | all (entry/role/locale) | `submitReview` | CP-1.5–6 |
| `submitDraft` | CP-1.1, CP-4.2 | `recordDecision` | CP-1.6, CP-3.3 |
| `getSubmissionStatus` | CP-1.7, CP-4.1 | `sendDecision` | CP-1.6, CP-5.2, non-happy |
| `listSubmissions` | CP-1.2, CP-4.3, CP-5.1 | `runStyleLint` | CP-2.1, CP-4.3 |
| `getSubmission` | CP-1.3, CP-2.1, CP-4.3 | `getLintReport` | CP-2.3 |
| `updateTriage` | CP-1.3, CP-5.2 | `updateFinding` | CP-2.4 |
| `openReviewRound` | CP-1.4, CP-3.4, CP-4.3 | `listContributors` | CP-1.3, CP-5.3 |
| `getAnonymizedView` | CP-1.4–5, CP-3.2/4, leak path | `getContributor` | CP-1.3, CP-5.3 |
| `flagAnonymizationLeak` | leak path | `listJobs` | CP-2.2, CP-5.4 |
| `reassignReviewer` | CP-3.1–2 | `getUsage` | CP-2.5 |

20 operations, 0 orphans (Critic-verified).
