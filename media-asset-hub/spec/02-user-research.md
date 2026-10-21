# 02 — User Research: media-asset-hub

SME-B pass · Paraphrased sentiment only (marked). No invented quotes.

## Persona 1 — Rania, Video Producer (primary daily user)

6-person bilingual production house; hundreds of clips/stills/audio beds per season across shared drives and laptops; filenames mix scripts ("لقاء_الشيخ_v4.mp4", "interview_sh_final_v2.mov").
**Job-to-be-done**: "When an editor asks for the second-day interviews, I want every usable take with its Arabic slate text in under a minute, so edit sessions start with footage, not archaeology."
**Triggers**: nightly "where is the good version" threads; a re-shoot ordered because a clip couldn't be found; deadline-eve version confusion.
**Objections → responses**: "another tool nobody maintains" → tag review keeps metadata honest from day one (P15); "our files are named in Arabic, tools choke" → Arabic filenames/metadata first-class, normalization-aware; "I don't trust robot tags" → suggestions are drafts; manual bilingual tagging always available.
**Pains** (paraphrased, practitioner threads — 01 [7]): version dig, renamed downloads, "what did we name it", approved-asset ambiguity.
**Onboarding motive**: import one real project folder, find three assets by Arabic slate text in the first session.

## Persona 2 — Hisham, Brand Designer

Sole designer at a retail brand; logos, key visuals, Ramadan/Eid sets, packaging shots; obsessive about which version is approved.
**Job-to-be-done**: "When I hand a campaign pack to the social team, I want them to find approved files themselves with rights attached, so I stop being the human search engine."
**Triggers**: an outdated logo published; a licensed stock image used past expiry; one asset re-exported four times in a week.
**Objections → responses**: "design tools have libraries" → single-seat; this is the shared shelf; "rights tracking is overkill" → expiry surfacing is what prevents the stock lapse.
**Pains**: approval ambiguity; license expiry invisible until legal.
**Onboarding motive**: build one "approved Ramadan set" collection with bilingual alt text and expiry notes.

## Persona 3 — Dina, Archive Editor

Archive editor at a digital publisher digitizing years of Arabic-labeled material — broadcast graphics with burned-in Arabic titles, event photography with Arabic signage, old documents.
**Job-to-be-done**: "When a journalist needs archive material for an anniversary story, I want to search the text inside the old graphics, not just folder names, so the archive becomes usable history."
**Triggers**: research requests that mean three days of digging; knowing the asset exists, not its container.
**Objections → responses**: "OCR gets Arabic wrong" → extraction is confidence-gated and correctable; paste-transcription exists for hard cases (08); "our old metadata is inconsistent" → bilingual fields edit inline with autosave (P10) — the archive gets cleaner by being used.
**Pains**: content-known-location-unknown; transliterated vs Arabic filenames diverging over years.
**Onboarding motive**: paste one legacy transcription, immediately find that asset by its Arabic text.

## Persona 4 — Tariq, Studio Content Lead (economic buyer)

Runs the team; approves spend; accountable for rights hygiene on client work.
**Job-to-be-done**: "When a client audits our licensed material, I want every rights record and expiry one click away, so audits are an export, not a scramble."
**Triggers**: a client license question; search-hours lost (the 5.8 h/week figure resonates — 01 [5], unverified estimate); heavyweight DAM onboarding costs.
**Objections → responses**: "Bynder-class tools exist" → enterprise-priced (01); "another subscription" → per-seat entry below the self-serve floor (12 Q-3); "what if we leave" → bilingual metadata exports in IPTC-style structure [8][9].

## Job-to-be-done summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Rania | footage/stills findability across seasons | daily | tool abandonment / metadata rot |
| Hisham | approved-pack handoff with rights notes | per-campaign | single-seat habits |
| Dina | archive findability incl. in-asset text | research-driven | Arabic OCR reliability |
| Tariq | rights hygiene + tool economics | quarterly | price vs team size |

## Voice derivation (SME-J)

Archivist-practical: calm, precise, never cute; states what was indexed, what matched, what needs review. Arabic فصحى بيضاء in system chrome; user content renders as-is with bidi isolation. Fixed terminology: أصل/أصول=asset، نسخة=variant، وسم=tag، مجموعة=collection، الحقوق=rights، الإدخال=ingest، النص داخل الأصل=in-asset text — one concept, one term, everywhere.
