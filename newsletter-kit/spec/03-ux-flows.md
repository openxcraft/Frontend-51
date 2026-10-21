# 03 — UX Flows: newsletter-kit

SME-C pass. Five critical flows; every failure names its typed error class (07b taxonomy); recoveries are real states.

## CP-1 — Create or duplicate an issue, compose bilingually

1. Issues home → "New issue" (title + locales from workspace default) — or "Duplicate for locale": copy a sent/draft issue's blocks from one locale into the other locale of a new issue (pairKeys preserved; provenance "copied from EN #14" recorded).
2. Composer opens two columns (ar RTL / en LTR, P23) with pairKey alignment links; sync chips per pair: in-sync / edited-since / missing-in-locale.
3. Compose blocks (heading, paragraph, quote, linkList, image, divider, cta, signature) per locale; reorder in one locale offers explicit "mirror order to other locale" — never automatic.
4. Autosave per edit (P10: saving → saved → conflict); CONFLICT surfaces both revisions side-by-side for a choice.
5. Locale variant tabs hold per-locale subject variants + preheader (CP-2); progress ring = block-pair completion.

**Edges**: pair length divergence (length-far-apart warning, P23); block in one locale only (chip "missing in AR" — allowed, surfaced); mixed-direction text isolated on input (dir=auto), QA verifies later; duplicating an issue with unlinked legacy blocks preserves them unlinked.
**Failures**: stale revision (CONFLICT, both versions); stale link (NOT_FOUND); seat without edit rights (PERMISSION).
**Recovery**: revisions retained; offline queue keeps local text (P20).

## CP-2 — Subject variants per locale (manual editor + assist)

1. Locale tabs (AR/EN) each hold a variant set: add/edit/delete; live character count vs locale budget (EN warn >43 / fail >70; AR warn >55 / fail >80 — heuristic, disclosed, 12 Q-9) and a mobile-clip preview (~43 chars as an inbox row).
2. Mark one variant primary per locale (what sends absent split testing — split testing itself out of scope).
3. Optional assist: "Draft variants" — N proposals for the focused locale derived from the issue's heading block; proposals stream into a reserved region (P13: start/completion announced, stop available), draft-by-default (P15) — promote, edit, or discard each.
4. Quota surface (P14); ladder: fewer proposals (rung 2) → none with reset time (rung 4); the manual editor is untouched at every rung.
5. Assist unavailable entirely: the manual editor shows a calm notice — identical flow, no proposals (degradation map, 08).

**Edges**: embedded Latin in an Arabic subject (isolation inserted; QA C02 verifies); duplicate variant text (allowed, flagged); primary deleted (falls to first variant, announced).
**Failures**: assist stream drop (partial proposals kept + marked, retry-continues or discard); quota (RATE_LIMIT with reset); empty variant text (VALIDATION).
**Recovery**: variant sets autosave and version with the issue.

## CP-3 — RTL render QA pass (the gate)

1. "Run QA" from composer or send desk — job runs the 10-check catalog per composed locale (C01 direction containers · C02 subject bidi isolation · C03 subject length · C04 preheader · C05 numeral consistency · C06 Arabic line-height floor · C07 italic-on-Arabic · C08 font fallback stack · C09 CTA alignment/mirroring · C10 consent footer).
2. Checklist panel fills per-check rows: pass/warn/fail with detail and block reference; completion announced politely.
3. Fix path: each fail/warn links to the offending block/field; edit inline; re-run regenerates (prior runs retained).
4. Preview pane: per-locale render at desktop/tablet/320px, direction per locale; worst-case long-word probe (rtl-rules §5). Preview is a render, not a promise — the checklist is the gate.
5. Send gate: scheduling with open fails is blocked (typed VALIDATION naming them); warns allowed but listed at confirmation; "record why you're sending anyway" note attaches to the send job.

**Edges**: locale not composed (QA runs on composed locales only, stated); concurrent edit (results pin issueRevision — stale runs marked); non-applicable check (auto-pass with "not applicable", e.g. C07 with no italic).
**Failures**: QA job failure (NETWORK/UNKNOWN, retry); results for deleted issue (NOT_FOUND).
**Recovery**: re-runnable indefinitely; the gate consults the latest run.

## CP-4 — Subscriber list import & management

1. Subscribers → create list → import: paste CSV or upload (abstract parse; paste always works), or connect an abstract "subscriber import source" if bound (manual path is paste/upload — LOOP-5).
2. Column mapping: email / display name / locale preference / consent proof (unmapped locale preference → per-row choice later, never a silent default).
3. Import job runs (async-contract) with streaming row progress; ambiguous rows pause the job into **awaiting-input** — invalid email (skipped with reason), duplicate email (keep existing / replace), consent-missing (provide proof / skip), locale-missing (ar / en / ask-later).
4. Resolution surface: per-row and bulk decisions; "Apply" resumes the job.
5. List view: virtualized table (P19), Arabic-normalized search (rtl-rules §4), filter chips (P08); inline locale edit (P06); bulk removal via action bar (P07) with P04 level-3 type-to-confirm.
6. Consent semantics: every row carries scope + proof + date; a list with unconsented rows cannot be scheduled — VALIDATION naming the count (08).

**Edges**: BOM/RTL-mixed CSV headers (mapping normalizes, encoding noted); import into non-empty list (dedupe by email); "ask-later" persists as unspecified (schedule surfaces the list-default choice).
**Failures**: malformed CSV (VALIDATION with row/field detail); partial import (imported kept, failed rows retryable scoped — async-contract §4); source binding failure (typed per 07b; paste path unaffected).
**Recovery**: idempotent per (list, sourceLabel + content hash) — re-running the same file never duplicates rows.

## CP-5 — Schedule via delivery channel, monitor, or export manually

1. Send desk: channel bindings (masked kind + hint per credential-contract — "Email delivery credential ••ab", status lifecycle); verify runs a real round-trip, typed result inline.
2. "Schedule send": issue + list + channel + time + locale policy — `preference` (each subscriber their locale), `combined` (both editions in one message, Arabic first), `single-edition` (requires exactly one composed locale).
3. Gate sequence: QA fails → blocked; channel not active → blocked; unconsented rows → blocked (count); policy mismatch → blocked; double-schedule → CONFLICT; then issue status → scheduled.
4. Send job (async-contract): queued → running with per-locale determinate progress ("Sending the Arabic edition — 1,240 of 3,000") → succeeded (per-locale counts, rendered editions linked) | failed (typed error; retry sends only unsent) | cancelled (fast, real). Completion ladder: in-context → permissioned notification via abstract "notification channel" if bound → return-state on re-entry.
5. Manual alternative (always first-class): "Export instead" — rendered HTML + text per locale + subscriber CSV segments per policy; artifacts expire with renewal (async-contract §2).
6. Jobs surface: all kinds, filter by state, cancel/retry scoped, link-to-context per row.

**Edges**: past schedule time (VALIDATION); list edited after scheduling (job pins list snapshot, count frozen, surfaced); channel expires between schedule and send (job pauses awaiting-input: verify or cancel); scheduling is naive by default — dual-calendar display only, no quiet-hours assumptions (12 Q-8).
**Failures**: channel verification failure (typed inline; send desk degrades with export path emphasized); mid-run network failure (partial per-locale counts retained, scoped retry); quota class reserved (RATE_LIMIT — only assist is metered at v1).
**Recovery**: issue stays schedulable after cancelled/failed jobs; sent issues lock content — duplication continues the work.

## Non-happy paths

- **First-run**: issues home offers the sample bilingual issue with seeded QA fails — fixing two fails is the onboarding (P22).
- **No channel ever bound**: send desk renders permanent manual mode — export is the default surface, not a degraded corner.
- **Offline**: composer queues writes (P20); jobs reconcile to authoritative state (async-contract §5).
- **Assist degraded**: manual alternates editor, unchanged.

## Failure→error mapping (full taxonomy)

ValidationError (gate blocks, CSV/mapping, malformed input) · NotFoundError (stale links) · PermissionError (seat rights) · ConflictError (concurrent edit, double-schedule) · RateLimitError (assist quota) · NetworkError (job/stream drops) · UnknownError (ref-id'd, retry).

## Flow → operation coverage table (every 07b operation — no orphans)

| # | 07b operation | Covered by |
|---|---|---|
| 1 | getSession() | all flows (S1 boot); CP-1.1 workspace defaults |
| 2 | listIssues(query) | CP-1.1 issues home |
| 3 | getIssue(id) | CP-1.2 composer open; CP-3 stale-link edge |
| 4 | createIssue(input) | CP-1.1 |
| 5 | updateIssueContent(id, patch, baseRevision) | CP-1.4 autosave; CP-2.1–2.2 edits; CP-3.3 fix path |
| 6 | duplicateIssue(id, mode) | CP-1.1 duplicate-for-locale; CP-5 sent-issue re-edit |
| 7 | runQaChecklist(issueId, locales?) | CP-3.1 |
| 8 | listQaResults(query) | CP-3.2 panel; CP-3.3 run history |
| 9 | suggestSubjectVariants(issueId, locale, input) | CP-2.3 |
| 10 | listSubscriberLists(query) | CP-4.1 home; CP-5.2 picker |
| 11 | createSubscriberList(input) | CP-4.1 |
| 12 | listSubscribers(query) | CP-4.5 list view |
| 13 | updateSubscriber(id, patch) | CP-4.5 inline edit |
| 14 | removeSubscribers(ids) | CP-4.5 bulk removal (P04 L3) |
| 15 | importSubscribers(listId, input) | CP-4.1–4.3 |
| 16 | resolveImportRows(jobId, resolutions) | CP-4.4 |
| 17 | listDeliveryChannels() | CP-5.1 |
| 18 | verifyDeliveryChannel(channelId) | CP-5.1 |
| 19 | scheduleSend(issueId, input) | CP-5.2–5.3 |
| 20 | getJob(id) | CP-3.1 / CP-4.3 / CP-5.4 detail |
| 21 | listJobs(query) | CP-5.6 jobs surface |
| 22 | cancelJob(id) | CP-5.4; CP-5 channel-expiry edge |
| 23 | retryJob(id) | CP-4.4 scoped import retry; CP-5.4 scoped send retry |
| 24 | exportIssue(issueId, options) | CP-5.5 manual alternative |
| 25 | getArtifact(artifactId) | CP-5.5 fetch/expiry renewal |
| 26 | getUsage() | CP-2.4 quota surface |
