# 02 — User Research: social-clip-cutter

SME-B pass · Paraphrased sentiment only (marked). No invented quotes; personas are synthesized composites grounded in 01 evidence (category complaint threads, RTL subtitle breakage documentation, MENA short-form scale reports, suite-bundled clipping friction).

## Persona 1 — Nawaf, Video-Podcast Studio Producer (primary)

**Role**: produces a weekly Arabic video-podcast from Riyadh (tech + culture interviews, 60–75 min episodes, 2–3 speakers); a freelancer edits the full episodes in an NLE, and Nawaf's job every Sunday is pulling 3–5 clips for TikTok/Shorts/Reels. He selects moments by scrubbing the timeline, cuts each clip by hand, and then spends the worst hour of his week fighting Arabic captions: text pasted into the NLE arrives reversed or clipped, so he re-types lines, drags direction controls, and re-exports twice.
**Job-to-be-done**: "When the edited episode lands, I want its 4 best moments cut and captioned in Arabic correctly within the hour, so clip night stops eating my Sunday."
**Triggers**: a clip's captions rendered reversed on the phone after export — caught by a viewer, not by him; the NLE subtitling thread he bookmarked as a "fix" that broke again after a project migration; a month where clipping slipped and the channel went quiet.
**Objections + responses**: "another AI clip tool — I tried one and reviewed 30 clips to post 2" (selection here is his: the transcript is the surface, heuristics only propose with visible rationale — 01 complaint evidence inverted); "my captions break in the editor I already pay for" (burn-in specs are Arabic-safe by construction — bidi policy, no mid-word breaks, mirrored punctuation; lint refuses unreadable specs); "I won't upload my episode video again to some suite" (media never uploads — a local reference plays back in the workbench).
**Onboarding motive**: import last week's transcript, search for the segment he already knows was the best moment, and watch it become a captioned clip without touching the NLE.

## Persona 2 — Layan, Agency Social-Video Editor

**Role**: editor at a small Dubai agency serving Arabic-first and bilingual clients; works in English UI by team convention while cutting Arabic client episodes (interviews, panels, event coverage) into platform clips; every client has caption style rules (their brand font weight, their placement) and the agency's own turnaround SLA.
**Job-to-be-done**: "When a client episode arrives, I want its clips selected and captioned to each platform's safe zones by Thursday review, so re-export rounds stop eating the margin."
**Triggers**: a client rejected a batch because captions sat under the TikTok UI buttons; a mixed-direction caption ("جديد Aljazeera+ سنة 2026"-class) embarrassed a review; three re-export rounds on one batch.
**Objections + responses**: "the team works in English" (bilingual-en direction: English-first chrome with Arabic as a full rendering citizen — the workbench verifies both directions, 09); "clients own their caption look" (caption styles are versioned workspace objects; per-clip burn-in specs carry placement + platform preset; export ships sidecar caption files so the client's post team can restyle downstream); "is this replacing my editor?" (no — it replaces the scrubbing and the caption breakage, not the NLE).
**Onboarding motive**: run one client episode through: search, select, spec burn-in, export, and compare the Thursday-review rework count against last week's.

## Persona 3 — Salma, Solo Interview Host with Producer Hat

**Role**: solo host of a bilingual (Arabic-primary, English guest segments) interview show from Cairo; 34 episodes in; does everything herself including clipping at 23:00. She reads transcripts fast (she writes show notes from them) but has never opened a timeline editor she liked.
**Job-to-be-done**: "When an episode ships, I want to choose the moments from the transcript the way I read it — by text, not waveforms — so clipping matches how my brain already works."
**Triggers**: waveform tools made her feel like an outsider in her own workflow; English guest segments meant captions switching scripts mid-clip, which her toolchain garbled; clipping fell off entirely for three weeks.
**Objections + responses**: "I don't edit video" (boundaries move in transcript steps with keyboard only — no timeline literacy required); "my show is Arabic with English moments" (per-segment direction rendering with bidi isolation; burn-in handles mixed-direction runs — the documented breakage class, 01); "subscription fatigue" (selection workbench unmetered; render minutes metered in clip-minutes she understands — P14; the recipe path is always free).
**Onboarding motive**: paste an episode transcript, find the moment a guest said the thing people quote, and have it be a clip before bed.

## Persona 4 — Omar, Newsroom Social-Video Desk Lead

**Role**: runs a 3-seat social-video desk at a regional publisher; the desk clips newsroom interviews and panels daily under quota pressure; standardized caption house style; an editor queue where one bad RTL render reaches the platform before anyone notices.
**Job-to-be-done**: "When today's episodes land, I want the desk cutting from the transcript with our house caption style applied and linted, so nothing broken ships and I can see the queue."
**Triggers**: a reversed-punctuation caption shipped publicly; desk editors each clipping with personal workflows (no repeatability); the desk's render queue is invisible — nobody knows what's pending.
**Objections + responses**: "newsroom tools already exist" (they bundle recording or suites; the transcript-first selection surface and Arabic-safe lint are the missing layer — 01); "we need to know what's rendering" (jobs are first-class: per-clip progress, partial-failure retry, expiry + renewal — async-contract); "standards?" (exports ship sidecar SRT/VTT beside the burned-in master — accessibility desk satisfied, 01 caption evidence).
**Onboarding motive**: put the desk's worst RTL offender episode through the burn-in lint and watch the warnings name every defect the desk had been catching by eye.

## Job-to-be-done summary

| Persona | Core job | Frequency | Primary objection answered by |
|---|---|---|---|
| Nawaf | edited episode → 4 Arabic-captioned clips, < 1 hour | weekly | text-first selection; Arabic-safe burn-in |
| Layan | client episode → platform-safe captioned batch by review day | per-client, weekly cadence | safe-zone presets; versioned styles; bilingual-en workbench |
| Salma | transcript reading → chosen moments as clips | weekly | transcript-as-surface; keyboard-only boundaries |
| Omar | daily episodes → linted desk queue, nothing broken ships | daily | burn-in lint; first-class jobs; house-style presets |

## Pain inventory (paraphrased from category sentiment, 01)

1. **Review overhead** — machine-picked clips reviewed and mostly discarded ("30 clips, post 2" thread sentiment, paraphrase).
2. **RTL caption breakage** — reversed runs, clipped glyphs, migrating punctuation in mainstream NLEs/players; workaround culture of file conversions and control characters (community-thread sentiment, paraphrase).
3. **Scrub-based selection** — moment-finding by waveform scrubbing for people whose natural surface is the transcript (suite-friction thread shows even NLE-first users loop through re-uploads, paraphrase).
4. **Safe-zone blindness** — captions landing under platform UI overlays, discovered at client review.
5. **Invisible render queues** — no per-item progress, no scoped retry, credits lost to processing failures (credit-mechanics complaints, paraphrase).

## Voice derivation (SME-J)

Clip-desk voice: energetic but exact — copy names real objects (segments, boundaries, clip-minutes, safe zones) and real states ("3 clips missing a burn-in spec"). Arabic UI copy is فصحى بيضاء; dialect appears only inside transcript content (preserved verbatim, never normalized — rtl-rules §2). Warmth lives in success and empty states; errors state what failed, why, and the next action (copy-voice §1.4). Fixed terminology (one concept, one term, everywhere — copy-voice §3):

| Concept | EN term | AR term |
|---|---|---|
| the imported episode container | episode source | مصدر الحلقة |
| the text | transcript | التفريغ |
| transcript row | segment | المقطع |
| a selected moment | clip | الكليب |
| clip start/end | boundary | حدّ الكليب |
| heuristic proposal | highlight candidate | المرشّح |
| caption look | caption style | نمط التسميات |
| burn-in settings | burn-in spec | مواصفة الحرق |
| render + download | export | التصدير |
| the render job | export job | مهمة التصدير |
| safe zone | safe zone | النطاق الآمن |
| job output file | artifact | الملف الناتج |

Numeral policy: Western digits everywhere per ledger row (including inside Arabic strings — copy-voice §1.7); timecodes render LTR-isolated in a mono utility face inside Arabic prose (05).
