# 03 — UX Flows: hiring-pipeline-desk

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation — no orphans. Terminology per 02: job opening · candidate · application · stage · pipeline board · interview kit · competency · question · interview · scorecard · recommendation · hiring decision · bias nudge · debrief · independence seal · rejection reason · activity log · export.

## CP-1 — Opening → bilingual kit → candidate intake → the board lights up (value proof)

1. Hessa creates the opening: bilingual title pair (EN "Customer Success Specialist — Arabic-fluent" / AR "أخصائي نجاح العملاء — إتقان العربية"), department, location, employment type, openings count. The workspace's default stage template seeds the stage set (Applied → Screening → Interview → Decision + terminal Hired/Rejected/Withdrawn); she may reorder stages at creation only — later edits are a versioned template change for future openings, never a silent board reshuffle. `createOpening` · `getSession` (role/locale render the chrome)
2. She authors the interview kit in the kit studio: competencies (4–6 per the category convention, 01 q4) — each with EN name, AR name, and a weight (must sum to 100) — then questions per competency in **both** languages. Each question row shows its origin: `human`, `template`, or `ai-assisted`. Validation on save: 4–6 competencies, weights 100, every competency ≥1 EN and ≥1 AR question (the bilingual completeness rule — enforced here as authoring guidance AND at scheduling as the hard gate, CP-3.1). `getKit` · `saveKit` (baseVersion → CONFLICT on stale)
3. **The question assist (conditionally-AI)**: for the "Communication in Arabic" competency she opens the assist panel: language 'ar', count 3, seniority 'mid'. Quota shown before running (P14 — assist runs are the metered unit). With the capability unbound, the panel returns the **template bank** deterministically — three vetted bilingual questions for competency-class × seniority, origin `template`, labeled "from the template bank — not generated" (ai-native-patterns §5 rung 3). With the capability bound and consented, proposals stream into the reserved region (P13: start/completion announced, stop/regenerate available, stall >8s declared) as origin `ai-assisted` drafts; each proposal lands behind the P15 gate — accept (with optional edit) or dismiss, per question; nothing writes to the kit without her click. Exhausted quota mid-flow → the panel drops to the template bank with an explicit notice (the ladder, 11). `proposeKitQuestions` · `getUsage`
4. Candidate intake, manual first (LOOP-5): Hessa adds "Nouf Al-Rashed / نوف الراشد" — name pair (Latin field + Arabic field, each rendering its own direction, both stored; at least one required), email, phone, optional links and a free-text note. She attaches the CV as a file reference or leaves it out (no parsing, ever, at v1). `createCandidate`
5. Paste-import for the backlog: she pastes 14 rows (one per candidate: name-latin | name-ar | email | phone | source); the import runs as an async Job with row-count progress, delivers imported-so-far plus named invalid rows on partial failure (async-contract §4). Duplicate detection on email (and on normalized Arabic name when the Latin name is empty) → duplicates skipped and named, never merged silently. `importCandidates` · `listAsyncJobs`
6. She fixes one candidate's phone typo in place (P06 inline edit; Escape restores). `updateCandidate`
7. She attaches candidates to the opening (or they arrived attached by the import's target-opening option): source recorded ('manual' | 'referral' | 'intake-channel'), stage = Applied. `createApplication`
8. The board lights up: stage columns with bilingual candidate cards; counts per column; anonymized-screening toggle visible in the board header when workspace-enabled. `listApplications` (per opening, stage-filtered pages) · `getOpening` (stage set for column rendering)

**Edges**: an import row with only an Arabic name (allowed — Latin field empty, name renders RTL with bidi isolation); two candidates sharing an email (named duplicate, skipped); kit saved with 3 competencies (VALIDATION — the 4–6 rule with the count named); title pair with the AR side left empty (allowed — the opening renders its single-language title honestly; the bilingual gap surface is the kit, not the title).
**Failures**: malformed paste row → VALIDATION naming row 7 with rows 1–6 retained; assist capability unconsented → PERMISSION naming the capability class in capability language, template bank offered inline (never a wall); quota exhausted → RATE_LIMIT ladder copy with reset time + template-bank path; kit save on stale version → CONFLICT with both payloads.
**Recovery**: candidates persist across failed imports; the kit is versioned — a failed save loses nothing; the assist's refused proposals leave no residue in the kit.

## CP-2 — The pipeline board: moves, rejects, filters (the daily loop)

1. Hessa opens the opening's board: columns per stage, cards bilingual (name pair rendered per-side direction; the display name follows the workspace locale with the other side one hover/expand away). Every card carries stage tenure ("in Screening 6 days"), next-interview chip when scheduled, and a recommendation tally once cards exist. `listApplications` · `getOpening`
2. Board navigation is keyboard-complete (P18): ←/→ move focus between columns, ↑/↓ between cards, Enter opens the application detail, Space selects for bulk (P07), Alt+M opens the move menu (a modified chord — raw-letter shortcuts are the Arabic-layout conflict class, a11y-baseline §3) — the drag-and-drop path's full equivalent (WCAG 2.2 §2.5.7).
3. She drags Nouf's card from Applied to Screening (or selects it and presses Alt+M → chooses Screening). The move is optimistic with the 6-second undo affordance (P03 — reversible, single-item); the adapter remains authoritative; a failed confirmation rolls back with a typed error. `moveApplication` (baseStage → CONFLICT if another seat moved it first — both states shown)
4. She opens the application detail: timeline of every move with actor and timestamp, interviews with their language and state, the decision record when present. `getApplication`
5. Reject: she moves a card to Rejected → the terminal-reason dialog (P04 level-2: single item, irreversible in v1's stage model): reason category + free-text, both required; the card lands in the terminal column and the reason is on the record forever. Rejecting N selected cards names the count and applies one reason to all (P07 discipline). `moveApplication` (terminal stage + reason)
6. The opening's lifecycle: she pauses the opening (cards stay, no new applications accepted from the intake channel), closes it, or marks it filled — status changes are versioned writes with baseVersion. `updateOpening`
7. She tags a note on the application ("strong referral — ops director") — notes are versioned, listed in the detail timeline, and never editable-after-the-fact (append-only discipline). `updateApplication`
8. Filters and saved views: stage, source, has-interview, tenure-overdue (P08 — removable chips, shareable views, filtered lists declare themselves). Bulk stage-move on a filtered set names the count (P07). `listApplications` (filter params)

**Edges**: moving into a stage the workspace template later removed (per-opening stages are frozen at creation — impossible by construction, stated here as the invariant); anonymized screening ON → cards in Applied/Screening render "Candidate #12" for recruiter/hiring-manager roles until the application passes Screening (display discipline, names remain in data — 07c rule); moving an application with scheduled interviews (warned inline: "2 interviews scheduled — they stay attached"; cancel is explicit, never implicit).
**Failures**: stale baseStage on move → CONFLICT with the current stage shown; NETWORK mid-list → banner + retry, board state safe (P20); PERMISSION when an interviewer-role seat tries a move (interviewers read the board and write scorecards only — role table, 07b).
**Recovery**: every move/reject/note lands in the activity log (P17); the board's filters and cursor persist per session (P11).

## CP-3 — Schedule → conduct → scorecard (the interviewer's path, with the nudges)

1. Hessa schedules the interview: application, round (1), interviewers (Dalal + Tarek), **language** ('ar' | 'en' | 'bilingual'), scheduled time, duration, mode label (onsite / phone / video — a free label, no provider binding). The adapter runs the **bilingual coverage gate**: the kit must hold ≥1 question per competency in the interview's language — an 'ar' interview against an EN-only kit → VALIDATION naming the competencies missing AR questions (the gap is caught here, not in the room). Double-booking check: overlapping time with another interview for the same interviewer → CONFLICT naming both interviews. `scheduleInterview` · `getKit` (coverage pre-check renders as a coverage meter in the UI)
2. When the gate refuses, she jumps to the kit studio, adds the missing AR questions (typed by hand or via the assist/template bank), saves, and re-schedules — the gate now passes. `saveKit`
3. Dalal opens **her** interview: the kit's questions rendered in the interview's language ('ar' — RTL surface), candidate name pair, schedule, and her scorecard state. For 'bilingual' interviews the question list renders side-by-side EN/AR with alignment links (P23 adapted to delivery). `getInterview` · `getSession` (her role/locale)
4. Reschedule/cancel before it happens: cancel states why (candidate / interviewer / scheduling) and notifies the affected members through the in-app surface (N3 when bound). A no-show is recorded as a state, not a deletion — the interview and its history stay. `updateInterview`
5. After the interview, Dalal opens her scorecard: one rating per competency on the anchored 1–4 scale (1 "below the bar" · 2 "approaching the bar" · 3 "meets the bar" · 4 "exceeds the bar" — anchors render with every rating control), an evidence field per competency, and the recommendation segmented control (strong-yes / yes / no / strong-no). Autosave as draft (P10 — saving → saved → conflict states; her seat's draft is private to her seat). `getScorecard`
6. She rates "Communication in Arabic" a 4 and types one line: "متحدثة رائعة، لبقة، وأجابت بثقة على كل الأسئلة." (8 words). Autosave fires. `saveScorecard` (draft)
7. Submit: validation — every competency rated, every evidence field non-empty, recommendation chosen. On submit, the deterministic nudge rules run on the card (07c): her rating 4 (extreme) with 8 words of evidence → the **evidence-thin nudge** fires ("Extreme rating — 8 words. Ratings of 1 or 4 carry the argument; 15+ words of evidence is the bar."); and because "متحدثة رائعة" ("great speaker") matches the trait lexicon with zero behavior words present, the **trait-language nudge** fires beside it ("Trait words without observed behavior — what did she do?"). The card still submits — nudges mark, they never block (00). Her card lands **sealed** to peers and visible in her own surface with its nudges attached. `submitScorecard` (baseVersion)
8. She reads the nudges on her submitted card and resolves each: thickens the evidence — "شرحت مسار تصعيد الاسترداد دون تلميح، وبدّلت السجل من الفصحى إلى اللهجة الخليجية مع عميل غاضب، وأتقنت الاعتذار." (18 words, behavior words present) → the evidence-thin nudge closes on recompute and the trait-language nudge with it (the rules re-run on her edit — same input, same verdict); or dismisses one with a reason ("interview ran long; card submitted from the lobby"). `resolveNudge` · `listNudges` (her card's nudge list)
9. The debrief view from Dalal's seat: peers' cards remain sealed until she submits her own (independence seal — PERMISSION if fetched directly: "Scorecards are sealed until you submit yours"). `listScorecards` (independence-filtered) · `getDebrief` (means withheld until all-in for the round)

**Edges**: an interviewer removed from the company mid-round (their unsubmitted card is voided, the debrief gate recounts — named, never silent); a rescheduled interview after cards were submitted (cards stay; the round's scheduled set is recomputed); mixed-script evidence ("asked about SLA في سياق الدعم") → bidi isolation at render, never reordered (rtl-rules §2); a no-show interview (no scorecard required; the gate skips it — declared at schedule-completion time).
**Failures**: submit with a missing rating → VALIDATION naming the competency; submit on stale draft (another device saved later) → CONFLICT with both payloads side-by-side; quota on nothing here — scorecards are never metered (only the assist is, P14).
**Recovery**: drafts autosave; submitted cards are immutable (corrections append — the 07a chain); every submit and nudge resolution logs (P17).

## CP-4 — Debrief → decision (the signature path)

1. Hessa opens the debrief for Nouf's round: the readiness state — which cards are in, which are sealed, which interviewer has not submitted. The debrief's aggregate (competency means, recommendation tally) is withheld until **all** scheduled-and-completed interviews of the current round have submitted cards (the gate that makes the aggregate honest — a mean of 1.5 cards is a rumor). `getDebrief`
2. As the last card lands, the **independence seal opens** — the T2 signature moment (05): peers' cards flip into view in a ≤60ms stagger (capped at 5 rows), the means settle beneath them, and the announcement carries the summary ("All scorecards in — 2 interviewers, 4 competencies, recommendation split 1 yes / 1 strong-no"). Reduced-motion: instant render + full-summary announcement (09). `listScorecards`
3. The debrief computes and shows: per-competency **weighted mean** across cards (weights from the kit), the recommendation tally, the per-card ratings grid, and the **divergence marks** — any competency where max−min across cards ≥ 2 gets the divergence treatment (plum mark + spread "4 vs 2 — Dalal / Tarek" + each side's evidence one click away). Divergence is information for the humans, never a verdict. `getDebrief` · `listNudges` (divergence findings list with jump links)
4. Hessa and Tarek read the split: Dalal's 4 with the register-switching evidence; Tarek's 2 with "answers felt rehearsed" — the trait-language nudge already sits on Tarek's card (it fired at his submit; he dismissed it with "standing by my read"). The record shows all of it. `listNudges` · `getScorecard` (via listScorecards)
5. The decision: advance / reject / hold. **The debrief gate**: recordDecision requires all current-round cards in — attempting it early → VALIDATION naming the missing card(s) ("1 of 2 scorecards submitted — Dalal's card is missing"). Rejections require a rationale that is not a nudge echo (free text, required); advances move the application to the next stage (or, at final round, to the Hired-adjacent decision state — offer handling is excluded, LOOP-10: "decision recorded — offer process is yours"); holds require a review-on date. `recordDecision`
6. The decision lands on the application timeline, in the activity log with actor and timestamp, and in the export package (CP-5). A re-opened decision appends — it never rewrites (07a chain). `getApplication` (timeline view) · `listActivity`

**Edges**: a single-interviewer round (seal opens trivially; divergence impossible — arithmetic says so); a voided interviewer (gate recounted); decision recorded while a late card arrives in the same second (CONFLICT — the decision's baseDebriefVersion protects it; the late card lands as post-decision history, never silently absorbed); 'hold' past its review date (the application surfaces in the board's aging filter).
**Failures**: decision without rationale on reject → VALIDATION; decision on a voided round → VALIDATION naming the void; PERMISSION if an interviewer seat attempts the decision (recruiter/hiring-manager only).
**Recovery**: decisions are versioned records with the full debrief snapshot pinned (07a — the decision cites the exact card versions it was made on); the debrief is re-derivable from card state at any time (deterministic — 07c).

## CP-5 — Export, activity, jobs, settings (the governance path)

1. Yasmin opens the activity log for the opening: every mutation — created opening, saved kit (v3), moved (Screening, Hessa), scheduled (round 1, ar), submitted card, fired nudge, resolved nudge, recorded decision — actor-action-target-timestamp, filterable (P17). `listActivity`
2. She exports the opening package: candidate slate with stage histories, interview rounds with languages and kits-as-used (question set pinned per interview), scorecards with nudges and resolutions, decisions with rationales, and the activity ledger — an async Job with expiry + regeneration (async-contract). Quota shown before running (P14, softly metered exports). Manual download is the default handoff; an abstract delivery channel exists for future binding (08 N2). `exportOpeningPackage` · `getUsage`
3. The artifact lands in the jobs console with its expiry window stated; expired → NOT_FOUND with regenerate (deterministic from state — identical package). `getArtifact` · `listAsyncJobs`
4. The jobs console lists imports and exports — filterable, cancel/retry, link-to-context (async-contract §7). `listAsyncJobs`
5. Settings: stage template (workspace default for new openings), anonymized-screening toggle, capability consents (kind-not-vendor, credential-contract §2), usage window for the assist quota. She pauses an opening or closes a filled one from the openings home row menu. `getSession` · `getUsage` · `updateOpening` · `listInterviews` (the upcoming-interviews digest on settings/home — "3 interviews this week: 2 ar, 1 en")
6. The interviews list across openings — upcoming and past, mine vs all (role-scoped), with language chips. `listInterviews`

**Edges**: export while a decision is being recorded (the package carries the state at export start and flags in-flight changes honestly — same honesty as the siblings' signed-version flags); anonymized screening ON at export (names included only with the export's explicit include-names toggle — the anonymization is a display discipline, the export is the audit moment, so the default is include with the toggle stated); artifact regeneration after kit edits (the package pins kit/question versions — regenerating yields the same package, 07c determinism).
**Failures**: export quota → RATE_LIMIT ladder with reset; partial export failure → per-format retry (slate, cards, ledger); NETWORK during delivery → retry, artifact held.
**Recovery**: exports regenerate deterministically; the jobs console reconciles after reconnect (async-contract §5).

## Non-happy paths

- **No kit yet** (first-run / a rushed opening): the board works, but scheduling any interview hits the coverage gate with zero questions — the product states "no kit — interviews need questions in the interview's language" and offers the sample kit. The **sample opening** (first-run, flag `sample`, clearable) ships with a planted round: an extreme rating with thin evidence and a trait-language evidence line, so a new team *watches a nudge fire* in the first session (P22 value moment — the parity moment for this product is seeing the evidence-thin nudge mark a card). `getKit` empty-state · `saveKit`
- **Assist unbound** (default state, LOOP-5): the template bank is the panel's native content — labeled, deterministic, bilingual; the capability path renders as optional with its consent surface, never a wall (08 N1). `proposeKitQuestions` (template mode)
- **Anonymized screening on**: board cards and application headers in Applied/Screening render "Candidate #N" for recruiter and hiring-manager roles; names surface at Interview stage and beyond; the toggle is workspace-level with per-opening override display (07c rule A5).
- **Offline**: reads work; scorecard drafts autosave locally with per-item state and submit on reconnect (P20 — the interviewer's lobby scenario is the offline design case).
- **Wrong-language interview discovered late**: an 'en' interview where the candidate clearly needed Arabic — the fix is honest bookkeeping: complete the card as-is, record the round, schedule a follow-up 'ar' round; the product never re-labels a held interview (the language is part of the record's truth, 12 Q-10).

## Failure → error mapping

VALIDATION (kit rules 4–6/weights/bilingual completeness at scheduling, scorecard submit completeness, decision gates, import row shape, reject-without-reason) · NOT_FOUND (stale opening/candidate/application/interview/artifact links, expired artifacts) · PERMISSION (capability consent, role boundaries — interviewer mutations beyond scorecards, sealed-card fetches) · CONFLICT (concurrent kit saves, stage moves, scorecard submits, decision vs late card, interviewer double-booking) · RATE_LIMIT (question-assist runs, export packages) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.1, CP-3.3, CP-5.5 |
| `getUsage` | CP-1.3 (pre-assist quota), CP-5.2, CP-5.5 |
| `createOpening` | CP-1.1 |
| `listOpenings` | App entry · S1 openings home (04) — the workspace's first screen, exercised on entry by every persona in 02 |
| `getOpening` | CP-1.8 (stage set), CP-2.1 (board boot), CP-5.5 |
| `updateOpening` | CP-2.6 (pause/close/fill), CP-5.5 (row-menu from S1) |
| `createCandidate` | CP-1.4 |
| `updateCandidate` | CP-1.6 |
| `listCandidates` | S7 candidates directory (04); CP-1.7 duplicate check before manual add |
| `importCandidates` | CP-1.5, non-happy sample-kit path (batch attach) |
| `createApplication` | CP-1.7 |
| `listApplications` | CP-2.1, CP-2.8 (filtered/saved views), S2 board (04) |
| `getApplication` | CP-2.4, CP-4.6 (timeline), S3 application detail (04) |
| `moveApplication` | CP-2.3, CP-2.5 |
| `updateApplication` | CP-2.7 |
| `getKit` | CP-1.2, CP-3.1 (coverage pre-check), non-happy empty kit |
| `saveKit` | CP-1.2, CP-3.2 (fix after gate refusal) |
| `proposeKitQuestions` | CP-1.3 (assist + template bank), non-happy unbound state |
| `scheduleInterview` | CP-3.1 |
| `listInterviews` | S8 interviews list (04), CP-5.5 (weekly digest) |
| `getInterview` | CP-3.3, S5 interview detail (04) |
| `updateInterview` | CP-3.4 |
| `getScorecard` | CP-3.5, CP-4.4 (card open from debrief) |
| `saveScorecard` | CP-3.6 |
| `submitScorecard` | CP-3.7 |
| `listScorecards` | CP-3.9 (independence-filtered), CP-4.2 |
| `getDebrief` | CP-4.1, CP-4.3, CP-4.5 (gate state re-read before recording) |
| `recordDecision` | CP-4.5 |
| `listNudges` | CP-3.8 (card nudges), CP-4.3 (divergence findings) |
| `resolveNudge` | CP-3.8 |
| `exportOpeningPackage` | CP-5.2 |
| `getArtifact` | CP-5.3 |
| `listAsyncJobs` | CP-1.5, CP-5.3, CP-5.4 |
| `listActivity` | CP-5.1, CP-4.6 (decision trail), S10 activity log (04) |

34 operations, 0 orphans (Critic-verified — the table above lists every 07b operation exactly once). `listOpenings` is the openings-home entry surface (04 S1) — the workspace's first screen, exercised on app entry by every persona in 02.
