# 00 — Brief: caption-lab

Family: content_tools · Tier: 2 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is
A transcript-linked caption refinement studio: import a video/transcript pair, get baseline captions, then refine Arabic captions with tashkeel-aware editing, RTL-safe line-breaking, Arabic-Indic/Western numeral policy, and burn-in style specifications for handoff. It refines what exists; it does not cut video (clip-cutting is social-clip-cutter — boundary in both 12s) and it does not publish.

## Buyer
Video producers, education/media teams, and post-production shops in MENA delivering Arabic-subtitled content: e-learning teams, broadcasters' digital desks, agencies delivering client video, and mosques/community educators producing lecture captions. 2–20 seats.

## Surface
Web application: media/transcript workspace with a timecode-linked caption editor, line-break workbench, style studio (burn-in specs), and export queue. Desktop-first (post-production posture); tablet review; no mobile app, no API v1.

## Unique feature
Arabic caption craft tooling: tashkeel handling in time-linked captions (legibility policy per reading-speed), RTL-safe line-breaking rules (no mid-word breaks, punctuation mirroring, line-order integrity), reading-speed gates (CPM/ WPM per audience), and burn-in style specs (font weight, size, stroke, background) exported as render instructions — the first caption tool to treat Arabic typography as a first-class discipline rather than a font dropdown.

## Exclusions (LOOP-10)
- No clip cutting/timeline editing (social-clip-cutter family).
- No ASR engine of its own (transcript import is the input; ASR is an abstract future integration — LOOP-5, manual alternative: import existing transcripts).
- No video rendering at v1 (burn-in specs + caption file exports are the deliverable; rendering is an abstract need with manual path).
- No translation of captions (transform belongs to studio family; imported transcripts arrive in their language).
- No publishing/distribution.

## Success signals
A producer can: import transcript+video; refine Arabic captions with correct line-breaks and reading-speed gates within the video's duration; produce burn-in style spec + standard caption file exports; run entirely on the Mock Adapter.
