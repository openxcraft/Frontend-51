# 02 — User Research: podcast-publish-kit

SME-B pass · Paraphrased sentiment only (marked). No invented quotes; personas are synthesized composites grounded in 01 evidence (category complaints, Arab-world listening reports, bilingual practice).

## Persona 1 — Rakan, Solo Interview Host (primary)

**Role**: runs a weekly Arabic tech-culture interview show from Riyadh; 34 episodes in; records remotely, edits audio with a freelancer, then does the publishing layer himself at 23:00 the day before release. Show notes go out in Arabic with an English summary block because his guests and half his press mentions are English-reading.
**Job-to-be-done**: "When an episode is edited and in my hands, I want its chapters and bilingual notes done in under an hour, so release night is scheduling, not assembling."
**Triggers**: a listener wrote asking "which minute was the part about X?" (no chapters, no timestamps); a guest shared the episode with an English-only caption and the notes were useless to that audience; the 3-hour publishing evening that made him skip a week.
**Objections + responses**: "I don't need another editor" (we are not one — audio never uploads); "AI notes sound like AI" (suggestions are drafts with rationale; chapters and notes are hand-authored objects — P15); "my show is Arabic, tools treat that as an afterthought" (bilingual-ar direction, RTL-native workbench, MSA terminology discipline).
**Onboarding motive**: import last week's transcript, mark the chapters he already knows by heart, and compare the generated chapter list's timestamps against the ones he typed last month.

## Persona 2 — Dalia, Narrative Series Producer

**Role**: produces a biweekly Arabic narrative series (documentary-style, scripted segments); episodes are 20–35 minutes with 6–10 natural movements; transcripts come back from her transcription workflow as clean text with timings. She hand-builds chapter titles and per-locale episode pages.
**Job-to-be-done**: "When a cut is final, I want chapter structure that mirrors my script's movements with bilingual titles, so my episode pages build themselves."
**Triggers**: re-titling a chapter late at night meant re-typing timestamps in two documents that then disagreed; her season page drifts between locales because the Arabic and English notes are maintained in separate files.
**Objections + responses**: "my structure is mine" (suggestions are optional and adjustable; manual marking is first-class — ai-native-patterns §8); "will it fight my dialect quotes?" (transcript text is preserved verbatim; only UI copy is MSA).

## Persona 3 — Yousef & Mariam, Two-Seat Show Team

**Role**: host + producer pair on a mixed Arabic/English business podcast; Mariam owns the publishing layer: transcripts, notes, packaging, upload to their host. They split duties across two seats and a shared checklist living in a chat thread.
**Job-to-be-done**: "When the episode is locked, Mariam wants a shared, visible production checklist and a package she can hand to the upload step in one artifact, so nothing ships half-done."
**Triggers**: an episode went out with Arabic-only notes by mistake; the chat-thread checklist failed silently twice; re-exports after a fix meant rebuilding files by hand.
**Objections + responses**: "we already have a process" (the checklist panel IS their process, with sign-offs and derived state — P17 trail); "what happens when the assist quota runs out mid-month?" (degradation ladder: manual marking continues fully — 11 §E).

## Persona 4 — Fahad, English-Language Regional Podcaster

**Role**: records an English show for a MENA business audience from Dubai; wants Arabic show notes to widen reach, but his Arabic is passive — he can review, not draft.
**Job-to-be-done**: "When my episode is ready, I want Arabic notes drafted alongside my English ones with clear parity signals, so I can ship bilingual without a translator in the loop."
**Triggers**: an Arabic-listening audience segment he cannot serve with notes; ad-hoc translation rounds that arrive after release day.
**Objections + responses**: "machine Arabic embarrasses me" (Arabic-side drafting is sectioned, reviewable, and parity-checked; nothing publishes without human confirmation — P15); "I don't want RTL UI forced on me" (bilingual workspace: full LTR rendering as citizen — rtl-rules §1).

## Job-to-be-done summary

| Persona | Core job | Frequency | Primary objection answered by |
|---|---|---|---|
| Rakan | edited audio → chapters + bilingual notes, < 1 hour | weekly | transcript-anchored chapters; assist-as-draft |
| Dalia | script movements → titled bilingual chapters + pages | biweekly | manual-first marking; per-locale parity |
| Yousef & Mariam | locked episode → checked, packaged handoff | weekly | checklist + PublicationPackage |
| Fahad | English episode → reviewed Arabic notes | weekly | parity signals; trust checkpoints |

## Pain inventory (paraphrased from category sentiment, 01)

1. Timecode scrubbing — hunting boundaries with a player and a notepad (chapter-tool users, paraphrase).
2. Timestamp drift — notes list and chapters file disagree after edits (AI-generator skeptics, paraphrase).
3. Locale drift — Arabic and English notes maintained separately, one always staler (bilingual practice evidence, 01 [31][32]).
4. Half-done releases — no shared completeness gate before upload (two-seat teams).
5. Tool overshoot — paying for an editing suite to get notes (Descript-alternative threads, paraphrase).

## Voice derivation (SME-J)

Producer-practical voice, energetic but honest: copy names real objects (chapters, segments, minutes) and real states ("3 chapters missing Arabic titles"). Arabic UI copy is فصحى بيضاء; dialect appears only inside transcript content (preserved verbatim, never normalized). Fixed terminology (one concept, one term, everywhere — copy-voice §3): برنامج = show · حلقة = episode · تفريغ = transcript · مقطع = segment · فصل = chapter · ملاحظات الحلقة = show notes · قائمة التحقق = checklist · حزمة النشر = publication package · قناة النشر = publication channel · اقتراح = suggestion. Warmth lives in success and empty states; errors state what failed, why, and the next action (copy-voice §1.4).
