# 03 — UX Flows: policy-acknowledgment-portal

SME-C pass · 6 critical paths (2 admin shells' faces + the acknowledger portal walk). Coverage table at end traces every 07b operation exactly once — no orphans, no phantoms. Non-AI declaration holds throughout: every step is deterministic state arithmetic; no assist, no suggestions, no generation (ai-native-patterns §1).

## CP-1 — Policy record → bilingual version publish (the register's intake)

1. Layla creates a policy record: bilingual titles (EN + AR), category (code of conduct / information security / HR / safety / finance), owner member, governing locale (`ar` for policies under KSA Labor Law Article 9 posture — digest [33]; `en` or `ar` otherwise). `createPolicy`
2. The policy detail opens with an empty version timeline and the publish panel. She uploads or pastes the finished policy body per locale — bodies are stored whole and read-only; the portal never edits policy text (LOOP-10). `getPolicy`
3. She fills document-control metadata per house grammar (digest [44]–[51]): version label (drafts 0.x / published 1.0+), effective date, bilingual change summary, and the supersedes link (auto-proposed: latest published version). `publishPolicyVersion`
4. Validation gates fire before anything is written: label grammar (mono-locale draft allowed; a published bilingual policy requires the governing locale's body — an unpaired second locale warns, never blocks), effective date not in the past for a new publish, supersedes target must be a published version of the same policy. Failures name the exact field (11 C). `publishPolicyVersion` (retry)
5. Publish appends to the ledger (policy-published, actor, version, supersedes) and marks the superseded version `superseded` — its existing acknowledgments remain valid evidence for the period they covered (07a state obligations). `listLedger`
6. She previews the version's reader rendering in both locales before any campaign targets it (bidi-safe bodies, per-side direction). `getPolicyVersion`

**Edges**: pasted body with embedded Latin runs inside the Arabic side (rendered bidi-isolated, never force-flipped — rtl-rules §2); draft published without second locale (honest unpaired warning on the version, surfaced again at campaign time); version label colliding with an existing label for that policy (VALIDATION naming both); withdrawing a version that active campaigns target (blocked with the campaign list named — withdraw first cancels or re-points nothing silently).
**Failures**: malformed metadata → VALIDATION with field errors; concurrent metadata edit → CONFLICT both payloads; upload too large for the storage channel → VALIDATION naming the channel limit and the paste alternative (LOOP-5).
**Recovery**: drafts are saved as unpublished versions and never lost; a failed publish leaves the prior published version untouched (publish is atomic — async-contract §4 attestations-class atomicity, declared).

## CP-2 — Campaign composition → launch (assignment as a deliberate act)

1. Layla opens the campaign composer from a published version: segment pickers, due window (days), reminder cadence (e.g. day 3 and day 7, calm per P21), attestation text pair (EN + AR, authored here — the exact words the person will agree to), required-locale rule (`governing` or `both`). `getPolicyVersion`
2. She reviews segment membership as it stands at composition time — membership is snapshotted into the campaign's assignment list at launch; later segment edits affect future campaigns only (07a). `listSegments`
3. Launch validates: attestation text present in the governing locale (unpaired second locale warns, never blocks), due window ≥ 1 day, segments non-empty, no active campaign already targeting the same version + segment overlap (overlapping assignments would double-count coverage — blocked with both campaigns named). `createCampaign`
4. Launch creates one Assignment per person in the snapshotted membership (state `assigned`), appends the ledger entry, and hands the notification batch to the abstract channel (email/SMS per delivery preference) — or, channel-unbound, renders the manual chase list (downloadable, per-site) plus the acknowledger link for posters/QR (08 N1). `createCampaign` · `listJobs` · `getUsage`
5. The coverage console appears immediately with the campaign's opening arithmetic: 0 acknowledged / N assigned / 0 overdue / 0 declined. `getCampaign`

**Edges**: a person belongs to two segments both targeted → deduplicated to one assignment per person per campaign (validation pre-computes and names the overlap); contractors in segment (person kind `contractor`) → campaign carries an explicit contractor window note (12 Q-10); campaign on a superseded version → blocked, directing to the newer version (evidence must point at the current document).
**Failures**: notification channel credential failed → campaign still launches; dispatch job records the failure and the console shows the chase-list alternative in the same surface (credential-contract §3/§6); dispatch quota → RATE_LIMIT with the batch partially sent and per-recipient retry (partial policy); concurrent composer edit → CONFLICT both payloads.
**Recovery**: a launched campaign never orphans assignments — cancel keeps attestations already given (07a); the dispatch job is retryable per failed recipient only.

## CP-3 — The acknowledgment walk (the acknowledger portal — the product's second face)

1. Mariam opens her policy inbox from a texted link (no install, no login wall beyond the session link — digest [61]): pending acknowledgments with due dates and locale badges, plus her completed history. `listMyAssignments` · `getSession`
2. She opens one: the reader surface shows the policy version's bilingual header (titles, version label, effective date), the locale toggle (defaults to her reading preference; the governing locale is marked), and the body rendered at its own direction with heading navigation. Focus order runs across the entire agreement text with a structured outline panel as the keyboard/sr alternative (a11y-baseline §7 legal/audit overlay — binding on this product). `getPolicyVersionForReader`
3. Read tracking begins when the body opens and records per-locale view events (locale, openedAt) — timestamps, not quiz scores; no comprehension testing ever (LOOP-10). `recordView`
4. She reads in Arabic, switches to English to check one clause, and returns — each locale switch appends its own view event; the attestation gate shows which locales she opened and lets her attest against what she actually read (the required-locale rule from CP-2 governs what MUST be read). `recordView`
5. The attestation gate: the attestation text renders in the locale she will attest in, her name is pre-filled for typed-name confirmation, and submit records the acknowledgment — person, policy version, locales attested, attestation text id, timestamp, deterministic digest. Success lands as a calm confirmation with the ledger fact announced (timestamp + version — a11y-baseline §7). `submitAcknowledgment`
6. Decline path (the honest alternative): if she cannot attest, Decline records a refusal with optional reason — a fact for the admin, never an escalation, never discipline (LOOP-10). `submitDecline`

**Edges**: version superseded while a campaign runs → her assignment re-points to the new version only if the campaign is re-issued; an in-flight acknowledgment of the old version still records (evidence for the period it covered); session link for an inactive person → PERMISSION with the admin contact copy (no orphan attestations — 07a); double-submit after a network blip → idempotent: the existing acknowledgment returns, never a duplicate ledger entry (async-contract §5); attestation without opening the required locale → the gate shows the un-read locale state and requires the read first (an honest gate, not a quiz).
**Failures**: submit mid-disconnect → NETWORK with queued-retry semantics and the ledger as the reconciliation authority on return (P20); stale assignment state → CONFLICT with the current assignment payload; reader body fetch failure → typed error with retry, read evidence preserved for what did open.
**Recovery**: acknowledgments are atomic (either the ledger entry exists exactly once or the submit failed — declared atomicity per async-contract §4); her history persists across campaigns and versions.

## CP-4 — Coverage monitoring + follow-up (the admin's daily surface)

1. The coverage console opens per campaign: assigned / acknowledged / overdue / declined counts as text (never color-only), coverage percentage computed deterministically, and the derived-zone roster (overdue = past due window and not acknowledged — computed, not judged). `getCampaign` · `listAcknowledgments`
2. Layla drills into a zone: person rows with name (bilingual), employee number, segment, assignment state, locales attested, timestamps; each row opens the full acknowledgment record — read evidence per locale, attestation text, digest, ledger link. `listAcknowledgments` · `getAcknowledgment`
3. Follow-up actions: send a reminder (calm cadence — the campaign's declared schedule plus manual sends, each appended to the ledger as a fact); extend the due window for the campaign (recorded with before/after values — corrections append, never edit). `updateCampaign`
4. Declined rows surface with the reason (if given) and the admin's out-of-product follow-up note — the product records, humans handle (LOOP-10). `getAcknowledgment`
5. Cross-campaign view: the person history page — every version a person ever acknowledged, when, in which locale, plus pending items across all campaigns (Omar's "what does the record show" surface). `listAcknowledgments`

**Edges**: person deactivated mid-campaign → assignment keeps its state with an inactive-person marker (never deleted — audit honesty, 07a); filtered-empty declares itself with the filter reset (P01); overdue roster >200 rows virtualizes (P19); segment membership drift after launch → the campaign's snapshot stays intact (assignments are people, not segment rules — recomputing membership would silently rewrite evidence scope).
**Failures**: stale console under reconnect → NETWORK banner, re-fetch with cursor continuity; reminder dispatch partial failure → per-recipient retry scoped to failures; extending a cancelled campaign → VALIDATION naming the cancel event.
**Recovery**: every follow-up action appends to the ledger; the console re-derives from authoritative state on every entry (no local-only truth).

## CP-5 — Ledger review + evidence pack export (the audit moment)

1. Omar (viewer seat) opens the attestation ledger: append-only entries — publish, launch, dispatch, view, acknowledge, decline, remind, extend, cancel, export — filterable by actor, action kind, policy, campaign, and date range; keyboard-navigable and exportable (a11y-baseline §7 obligation). `listLedger`
2. He builds an evidence pack: scope picker — a campaign (per-person attestation records with coverage arithmetic) and/or a policy version (the full bilingual version record + change summary + its acknowledgment census); attestation-text appendix included by default (the chain from signature to words agreed). `exportEvidencePack`
3. Export runs as a Job (honest progress, determinate unit counts, cancellation real); the artifact carries a declared expiry window with regeneration from immutable state. `exportEvidencePack` · `listJobs` · `getArtifact`
4. The pack lands in-context when he is on the surface, or surfaces on re-entry (async-contract §6); direct download is the primary delivery — an abstract delivery channel is optional (08 N4). `getArtifact`
5. Usage meter reads before/after: exports and notification batches per window (the ledger itself is never metered — 01 pricing posture). `getUsage`

**Edges**: evidence pack for a superseded version → allowed and explicitly labeled (period evidence — the audit-legacy case); person history spanning withdrawn versions → records remain with the withdrawal event visible in the chain; artifact expired → NOT_FOUND with the regenerate path and the unchanged-source statement.
**Failures**: export job failure mid-pack → partial policy with per-section retry (async-contract §4); quota on exports → RATE_LIMIT with the window reset and the ledger unaffected; viewer attempting mutation → PERMISSION with the seat's honest scope.
**Recovery**: packs regenerate from immutable state — nothing is ever lost to an export failure; every export appends its own ledger entry (the evidence about the evidence).

## CP-6 — People, segments, and platform management (the keep-the-lights-on path)

1. Tariq imports the people CSV: columns (employee number, name EN, name AR, email?, phone?, site, employment type, segments) with row-level validation — first bad row named, prior-good rows kept (partial policy); duplicates by employee number counted, both handled explicitly. `importPeople` · `listJobs`
2. Single-person add for the one-off joiner (the always-available path); deactivation for leavers (never deletion — 07a). `createPerson` · `updatePerson` · `listPeople`
3. Segment maintenance: create with bilingual names, edit membership — with the explicit rule that edits affect future campaigns only (the snapshot contract from CP-2). `createSegment` · `updateSegment` · `listSegments`
4. Jobs console: import, dispatch, and export jobs with state, cancel/retry, link-to-context (async-contract §7; T3-consolidated single console). `listJobs`
5. Settings: workspace locale default, governing-locale default hint per jurisdiction (KSA → ar), notification channel consent state (kind, not vendor — credential-contract §2), and the attestation-text library. `getSession`

**Edges**: CSV with Arabic names in a Latin-codepage column → VALIDATION naming the encoding expectation; person appearing in CSV twice with different numbers → both rows named for human dedup; segment renamed mid-campaign → campaign snapshot unaffected (assignments pinned at launch).
**Failures**: import partial failure → per-row report (11 C); channel consent revoked mid-campaign → dispatch pauses with the chase-list alternative surfaced (credential-contract §3); role violations → PERMISSION per seat scope.
**Recovery**: people import is resumable by failed-row resubmit; every directory mutation appends to the ledger.

## Non-happy paths

- **No notification channel bound (rung floor, 08 map)**: campaigns launch with the manual chase list (downloadable per-site) + the acknowledger link for posters/QR — the campaign is fully runnable and auditable without a single message sent (LOOP-5 bar; the 00 success signal tests this configuration).
- **No directory capability bound**: CSV import + single-person add are the primary paths; nothing waits on HR sync (08 N2).
- **No document storage channel bound**: pasted text bodies render identically; upload is an accelerator, paste is the floor (08 N3).
- **First-run**: the register offers the seeded sample policy + campaign (P22 value checklist: publish → assign → attest → read coverage, experienceable before real data lands).
- **Offline**: reads work; submits queue with per-item state and reconcile to the ledger on return (P20, async-contract §5) — the ledger remains the single authority.
- **Attestation fatigue posture**: no blanket annual re-attest button exists; campaigns target versions and segments, and a version whose content did not change does not need a new campaign (03 CP-1 gates; 11 E copy states it).

## Failure → error mapping

VALIDATION (publish metadata/label grammar, campaign gates, CSV rows, withdraw/cancel guards) · NOT_FOUND (stale policy/version/campaign/person/artifact links, expired artifacts) · PERMISSION (role scope, inactive-person session links, unconsented channels) · CONFLICT (concurrent metadata/campaign/composer edits, stale assignment submits) · RATE_LIMIT (dispatch batches, evidence-pack exports) · NETWORK (list fetches, submits, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation exactly once)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-3.1, CP-6.5 | `updateCampaign` | CP-4.3 (reminder/extend) |
| `listPolicies` | CP-6.5 (register home — settings-adjacent reads) | `listCampaigns` | CP-4.1 entry (campaign picker), CP-6.4 |
| `getPolicy` | CP-1.2 (detail open) | `getCampaign` | CP-2.5, CP-4.1 |
| `createPolicy` | CP-1.1 | `cancelCampaign` | CP-1.4 edge (withdraw guard path), CP-4 recovery note |
| `updatePolicyMetadata` | CP-1 (metadata maintenance pass — owner/category/titles) | `listAcknowledgments` | CP-4.1/2/5 |
| `publishPolicyVersion` | CP-1.3/4 | `getAcknowledgment` | CP-4.2/4 |
| `listPolicyVersions` | CP-1.6 (timeline render) | `listMyAssignments` | CP-3.1 |
| `getPolicyVersion` | CP-1.6, CP-2.1 | `getPolicyVersionForReader` | CP-3.2 |
| `withdrawPolicyVersion` | CP-1.4 edge (withdrawal action) | `recordView` | CP-3.3/4 |
| `listPeople` | CP-6.2 (roster reads) | `submitAcknowledgment` | CP-3.5 |
| `createPerson` | CP-6.2 | `submitDecline` | CP-3.6 |
| `importPeople` | CP-6.1 | `listLedger` | CP-1.5, CP-5.1 |
| `updatePerson` | CP-6.2 (deactivate/edit) | `exportEvidencePack` | CP-5.2/3 |
| `listSegments` | CP-2.2, CP-6.3 | `getArtifact` | CP-5.4 |
| `createSegment` | CP-6.3 | `listJobs` | CP-2.4, CP-5.3, CP-6.1/4 |
| `updateSegment` | CP-6.3 | `getUsage` | CP-2.4, CP-5.5 |
| `createCampaign` | CP-2.3/4 | | |

33 operations, 0 orphans, 0 phantoms (Critic-verified; scripted check re-run at audit — see worklog entry).
