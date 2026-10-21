# 02 — User Research: meeting-notes-action-desk

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (sources 21–28 action-item practice; 34–42 bilingual Gulf meeting reality; 59 adoption/privacy posture); zero invented verbatims — quotes are paraphrased persona voice, marked as such.

## Persona 1 — Sara Al Rashid, Operations Lead (primary buyer + daily user)

**Role**: ops lead at a Dubai-headquartered F&B group running 12 venues and a weekly bilingual ops huddle with 6–8 participants (venue managers, procurement, marketing, finance, food safety). Sara runs the meeting in Khaleeji-inflected Arabic with English mixed in for systems and finance terms; her notes today are a mix of a phone voice-note to herself and a bullet list in a shared doc. Her pain is not capture — it is the two weeks after: "who was supposed to chase the fire-safety certificate renewal?" is a question she answers by scrolling a chat thread.
**JTBD**: "When I run my weekly huddle, I want every commitment captured with a single named owner and a real deadline — and confirmed by that owner — so that when I ask 'where is it?' two weeks later, the answer is a record, not a memory."
**Triggers**: a food-safety audit that surfaced an unfinished commitment nobody remembered owning; a venue manager who disputes ever being assigned something ("that was for the other branch"); minutes she re-writes for leadership by hand in two languages.
**Objections + responses**: "another AI notetaker?" → this product never joins a call and never bots into a room (LOOP-10; the privacy posture answers the 73%-barrier evidence [59]); "my team won't adopt another tool" → owners pay nothing and use one surface: confirm, question, decline, complete; "the summaries get Arabic wrong" → the assist proposes, humans dispose (P15); bilingual pairs are authored, never auto-translated.
**Onboarding motive**: paste last week's notes from the shared doc and watch the desk turn them into proposed actions she can assign in the first 15 minutes.
**Verbatim (paraphrase, persona voice)**: "I don't need prettier notes. I need the person who said 'أتكفل بها' to click one button that makes it theirs."

## Persona 2 — Faisal Al Zaabi, Venue Manager (action owner, Arabic-first)

**Role**: venue manager in Abu Dhabi; attends the huddle; receives actions today as English bullets in a doc nobody localizes. Faisal reads English fine but commits faster in Arabic; on his phone between shifts he wants to know exactly what he owes and say yes once. His unconfirmed-action reality: tasks arrive implicitly, he misses some silently, and the eventual conversation is blame-shaped.
**JTBD**: "When Sara assigns me something from the huddle, I want it in Arabic with the due date in front of me, and one tap to confirm it — or to say 'هذا موعد غير واقعي' — so my yes actually means yes and my no is visible early."
**Triggers**: an action he never saw (buried in slide 14 of a doc); a deadline that was never realistic; being asked about something weeks after the room assumed he'd agreed.
**Objections + responses**: "I won't check another app" → owner mode is one responsive page reachable from a link; the loop desk is his queue — nothing else demands attention; "will it judge me?" → no leaderboards, no productivity scoring (LOOP-10); the register reports state, not people-ranking.
**Verbatim (paraphrase)**: "Give me the list that has my name on it, in my language, and I'll tell you honestly what I can commit to."

## Persona 3 — Layla Kassem, Marketing Lead (bilingual power user, second desk seat)

**Role**: marketing lead at the same group; English-first, fluent Arabic; runs her own smaller campaign meetings and participates in Sara's huddle. Today she double-logs actions out of meetings into her team's project board — the re-entry tax is hers to pay, and attribution drifts in the copy-over.
**JTBD**: "When I leave a meeting with four commitments for my team, I want them structured once — owner, due date, evidence — and exportable, so I stop re-typing them into our work board and arguing later about what was actually agreed."
**Triggers**: a deadline that mutated in the copy-over; a decision (not an action) that everyone remembers differently; leadership asking for "the minutes" and her assembling them by hand.
**Objections + responses**: "my team lives in the project board" → the register export and the action link are the handoff; the product stops at meeting actions (LOOP-10) and never becomes the board; "auto-extraction misattributes owners" → every proposal is draft-by-default with the evidence span one click away (P15); owner matching is disclosed, deterministic, and overridable.
**Verbatim (paraphrase)**: "The meeting ends, and then the real work begins: turning what everyone nodded at into rows. I want the rows to already exist."

## Persona 4 — Reem Nasser, PMO Coordinator (minutes assembler + confirmation chaser)

**Role**: program coordinator who supports three team leads; assembles bilingual minutes for leadership review and chases owners for status by chat today. She is the human confirmation loop the product replaces — and its heaviest desk user: she works the loop desk, the register filters, and the export surfaces all day.
**JTBD**: "When leadership asks 'what did we commit to this quarter?', I want one export — bilingual minutes plus an action register with who confirmed what and when — instead of three docs and a chat scroll."
**Triggers**: a quarterly review where commitments and reality diverged; owners who say "nobody asked me"; minutes assembly eating her Sunday.
**Objections + responses**: "leadership wants their format" → the minutes export is bilingual with a fixed, inspectable structure (decisions, actions, evidence) — format obedience is not a feature, structure is; "chasing is my job" → the loop desk does the chasing visibly; her job upgrades from chasing to adjudicating (questioned and declined items are where judgment lives).
**Verbatim (paraphrase)**: "I chase twelve people by chat every week to confirm things they already agreed to out loud. The tool should hold the yes, and I should handle only the 'but actually…' cases."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Sara | meeting capture → owner-confirmed commitments | weekly per huddle, daily desk review | tool fatigue + Arabic quality distrust |
| Faisal | confirm/question/decline + complete own actions | per action, on phone | adoption friction; being scored |
| Layla | structured actions out of every meeting, exportable | per meeting | double-logging vs her real board |
| Reem | minutes + register assembly; loop adjudication | daily | leadership-format obedience |

## Objections + responses (cross-persona)

| Objection | Response (product-grounded) |
|---|---|
| "It's another AI notetaker and they all overpromise" | It is not a notetaker: no conferencing, no bots (LOOP-10); capture can be typed notes; the spine is the confirmation state machine, which no source in the category documents [01 gap analysis] |
| "Extraction will invent owners and deadlines" | Every assist proposal is draft-by-default (P15), carries a confidence label with a fixed low-confidence mark (<0.70), and links to its evidence span; deterministic cue mode labels its own provenance and is always available |
| "Our meetings are mixed Arabic-English; tools mangle them" | Mixed-script is the design center: per-segment direction, bidi isolation, authored bilingual pairs — and the transcription capability binding carries a dialect/code-switching evaluation gate before it ships active (08) |
| "Owners will ignore confirmation requests" | Unconfirmed actions escalate visibly (loop desk, confirmation-overdue zone with named respond-by); they are never silently dropped and never auto-reassigned — the lead adjudicates, the record shows the stall |
| "We already pay for a notetaker / a task board" | Paste their transcript in; export the register out; the desk sits between them and owns neither — the record of commitment is the only thing it claims |

## Voice derivation (SME-J)

Desk voice: plain, accountable, named-actor — the register's grammar is declarative ("Faisal confirmed this action on 21 Oct") and never evaluative about people (copy-voice §1.3; no leaderboards by exclusion). Arabic UI copy is فصحى بيضاء utility register; politeness via لطفاً/تفضل sparingly; errors address the situation. Fixed terminology (one concept, one term, everywhere — copy-voice §3): الاجتماع=meeting · الملاحظات=notes · التفريغ=transcript · الملخص=summary · القرار=decision · التكليف=action item · التكليفات=action items · صاحب التكليف=action owner · تأكيد التكليف=action confirmation · مكتب التكليفات=loop desk · سجل التكليفات=actions register · المحضر=minutes · تاريخ الاستحقاق=due date · متأخر=overdue. Numerals Western per ledger row (dates, counts, deadlines — data surface). "Confirm" is never softened into synonyms (تأكيد everywhere, never إقرار/اعتماد mixed mid-product); "decline" is رفض, "question" is استفسار — the three responses keep their Arabic labels wherever the loop renders.
