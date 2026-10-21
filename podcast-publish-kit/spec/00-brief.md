# 00 — Brief: podcast-publish-kit

Family: content_tools · Tier: 3 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

An episode production companion for Arabic podcasters: the workspace that sits between "recording finished" and "episode published". The podcaster creates an episode, imports a transcript (pasted or pulled from an abstract "transcript source"), and the transcript becomes the episode's spine — every chapter is anchored to transcript segments, so chapter timecodes are derived from segment timings instead of hand-typed, and the bilingual show notes are composed section-by-section (summary, takeaways, links, guest, chapter list) with per-locale parity indicators. A pre-publication checklist verifies completeness (chapters titled in both locales, notes complete, timestamps monotonic, metadata filled), and the final step assembles a PublicationPackage: a chapters file in the open Podcasting 2.0 JSON chapters shape (or a plain-timestamps fallback), show notes in both locales, and episode metadata — exported as files, or delivered to an abstract "publication channel" through a workspace credential.

The product is deliberately not an editor. Audio never passes through the adapter: an optional local audio reference (a file on the podcaster's own machine, never uploaded) plays back in the workbench purely so the human can verify chapter boundaries by ear. There is no waveform surgery, no cut/trim/normalize, no hosting, no RSS generation, no analytics (LOOP-10, binding). What it removes from the podcaster's evening is the unglamorous publishing layer — the timestamps hunt, the second-language notes draft, the "did I title every chapter in both languages?" scan — which category research shows is exactly where solo producers lose hours (01).

Bilingual by construction: every user-facing string ships in Arabic and English, chapters and show notes are authored per-locale with alignment links between corresponding blocks (P23), and the buyer's reality — an Arabic-first show with English-reading distribution platforms, guests, and press — is modeled as a first-class workflow rather than a translation afterthought. The AI stance is conditionally-AI: a chapter-suggestion assist proposes boundaries and titles from the imported transcript, always as a reviewable draft with per-suggestion rationale; when the assist capability is unavailable or its quota is exhausted, the product degrades cleanly to manual chapter marking, which is a fully supported first-class path (ai-native-patterns.md §8).

## Buyer

Arabic podcasters: solo hosts and small shows (1–3 people) across MENA producing weekly or biweekly episodes in Arabic, in mixed Arabic/English, or in English for regional audiences — from interview shows and narrative series to tech and culture programs. Secondary: small production teams (a host plus an editor-producer) who split the publishing layer between two seats. The buyer already records and edits elsewhere; they pay to reclaim the production evening, not to re-buy editing.

## Surface

Web application, desktop-first (≥1280px primary; the workbench is a three-zone surface — transcript pane, chapter timeline, show-notes composer — plus a persistent playback bar). Responsive down to 360px: episodes board, package library, and job center remain usable; the workbench stacks to a single column with zone switching; playback bar persists. Zones: left rail (Episodes board · Packages · Jobs · Settings), episode workbench (transcript · timeline · notes + checklist drawer), packages library, job center.

## Unique feature

Transcript-aligned chapters with a bilingual show notes workflow. Chapters anchor to transcript segment indices — timecodes derive from the segments, so the chapter list inside the show notes is generated from the same source of truth and can never drift out of sync with the chapters file. The bilingual show-notes editor composes both locales side-by-side with parity signals (in-sync / edited-since / missing-locale), and the export produces a portable PublicationPackage targeting the open Podcasting 2.0 JSON chapters format with a plain-timestamps fallback — provider-agnostic by design, because the exclusion says no hosting/RSS at v1. Defensible because the narrow competitors are chapter-tag editors without transcripts (monolingual, file-level) and the show-notes generators are transcript-agnostic black boxes, English-first, with no bilingual construct (01); nobody binds chapters to transcript segments and ships a bilingual publishing package.

## Exclusions (LOOP-10, binding)

- No audio editing (no cut/trim/fade/normalize/effects; playback is verification only; audio is never uploaded).
- No hosting, no RSS feed generation, no episode distribution at v1 — hosting is an abstract "publication channel" with a manual alternative (download + upload by hand).
- No analytics (no download counts, listener stats, retention curves — a different family's problem).
- No transcription of its own at v1 — transcripts are imported (pasted or via an abstract transcript source); the product never claims to transcribe.
- No clip cutting or caption burn-in (social-clip-cutter and caption-lab own those workflows; adjacency flagged in 12).
- No guest-outreach, scheduling, or recording features.

## Success signals (definition of done, Mock Adapter)

A podcaster can: create a show and an episode; paste an hour-long bilingual transcript and see it land as ~900 timed segments; mark 8 chapters manually in under 10 minutes without touching a timecode; request chapter suggestions, review the drafts with rationales, accept 5 and adjust 2; complete bilingual show notes with the chapter list auto-inserted and parity warnings resolving; clear the pre-publication checklist; and build + download a PublicationPackage whose chapters file validates against the Podcasting 2.0 JSON chapters shape — all in one session on the Mock Adapter, with zero provider names anywhere in the UI, and the same session repeatable with the assist disabled end-to-end (manual degradation path proven).
