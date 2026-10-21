# 01 — Market Research: podcast-publish-kit

SME-A pass · URLs retrieved 2026-10-16 (research digest: /home/z/my-project/research/batch3/podcast-publish-kit-research.md).

## Category overview

Podcast post-production splits into three layers with different owners: audio editing (Descript-class editors), the publishing layer — transcripts, chapters, show notes, metadata, package handoff — and hosting/distribution. This product competes only in the middle layer. A distinct category recently formed there around AI-generated show notes and timestamps (Castmagic, Swell, Recast-class), while an older, narrower one handles chapter tags as file metadata (MP3/ID3 chapter editors). The two have not merged: chapter editors do not read transcripts; show-notes generators emit unanchored text blobs. A third force — hosting platforms — bundles show-notes guidance but treats chapters as a tag problem, not an authoring workflow. None of the three serves Arabic-first bilingual production.

## Direct competitors (6)

| Competitor | Proof | Signal | Gap we exploit |
|---|---|---|---|
| Descript (show-notes generator + transcript editor) | descript.com [1]; show-notes tool page [2]; third-party pricing review $0–65/mo [3] | Category anchor: transcript-centric editing with generated show notes; buyers already think "transcript in → notes out" | Bundled to a heavyweight editor we exclude (LOOP-10); English-first; chapters are not a transcript-anchored authoring object; no bilingual construct |
| Castmagic | castmagic.io [4]; transcription/pricing page ($19/300min transcription claim; manual transcription $60–180/hr claim — vendor-published, unverified) [5] | "10x your content" — upload audio, get transcripts, notes, summaries, highlights; the publishing-layer pain is their entire pitch | Black-box generation posture; no reviewable rationale per suggestion; monolingual outputs; no chapters file authoring |
| Swell (AI podcast content assistant) | swellai.com comparison content [6] | Positions as the assistant layer over finished episodes | Same black-box posture; no chapter-timing workflow; no bilingual parity concept |
| Recast Studio (show-notes generator) | recast.studio tool page [7]; templates guide [8] | Free-generator funnel proves recurring demand for structured notes (summaries, timestamps, chapter-style segments) | Timestamps emitted as text, not bound to a chapter object; no export of a standards-shaped chapters file; English-first |
| Podcast Chapters (macOS chapter editor) | App Store listing [9] | Existence proof that dedicated chapter tooling is bought; adds MP3 chapter markers "supported by most podcast clients" | File-tag tooling: no transcript, no notes, no bilingual titles, desktop-macOS-only, manual timecode hunting |
| MP3 Chapters (open-source online editor) | mp3chapters.github.io [10] | Free chapter editing with local-only processing (privacy posture worth borrowing) | Same ID3-tag limitations; no transcript alignment; no publishing package |

[1] https://www.descript.com · [2] https://www.descript.com/tools/podcast-show-notes-generator · [3] https://www.castmagic.io/software-reviews/descript · [4] https://www.castmagic.io · [5] https://www.castmagic.io/tools/podcast-transcription · [6] https://www.swellai.com/blog/castmagic-vs-descript · [7] https://recast.studio/tools/podcast-show-notes-generator · [8] https://recast.studio/blog/write-podcast-show-notes-templates-examples · [9] https://apps.apple.com/us/app/podcast-chapters/id1070963477 · [10] https://mp3chapters.github.io

## Indirect competitors (4)

- **Hosting platforms with bundled guidance (Captivate, Buzzsprout, Podbean, Riverside, Resound class)** [11][12][13][14][15]: they define the show-notes craft (3–4 takeaways, links, timestamps, summary, CTA) but chapters remain tag metadata and the workflow is do-it-yourself per episode; their interest is hosting lock-in, which our package export deliberately avoids.
- **General AI assistants**: paste a transcript, get notes — free-form, no chapter-timing binding, no structure enforcement, drift between sessions; the manual status quo our structured workflow formalizes.
- **Manual workflow (word processor + player + notepad)**: the real incumbent for most Arabic podcasters — scrub, note a timecode, retype it twice (once per locale). Free, and it is exactly the evening this product removes.
- **Podlove / Podcast-namespace ecosystem tooling** [16][17]: open, podcaster-friendly chapter tooling exists in the Podcasting 2.0 orbit (chapter JSON, apps that render it), which validates our export format choice — but the authoring UX is developer-adjacent and monolingual.

[11] https://www.captivate.fm/learn-podcasting/podcast-show-notes · [12] https://www.buzzsprout.com/blog/podcast-show-notes · [13] https://blog.podbean.com/how-to-write-podcast-show-notes · [14] https://riverside.com/blog/podcast-show-notes · [15] https://www.resound.fm/blog/podcast-show-notes · [16] https://podcastnamespace.org · [17] https://podcasting2.org/docs/podcast-namespace

## Market & demand evidence

- **Arab-world podcasting has documented scale**: DPC's industry report (2024) frames a growing Arab sector against 464.7M global listeners / 5M podcasts / 70M episodes (2023 baselines) [18]; 5.1M regular listeners in Saudi Arabia, 52% KSA share of Arab-world listening (10% UAE, 6% Egypt) [19]; 67% of Saudi listeners tune in at least weekly, 30% daily [20].
- **Regional size claims**: KSA podcast market USD 450M (Ken Research — unverified estimate) [21]; MEA ≈5.9% of global podcasting (IMARC — unverified estimate) [22]; global $30.7B (2024) → $131.1B (2030) at 27.0% CAGR (Grand View Research) [23]; 4.72M active feeds / 166M episodes, ad revenue +17.6% YoY (Libsyn, 2026) [24].
- **The publishing layer is a paid category**: Castmagic/Swell/Recast exist and price monthly ($19–65/mo anchors [3][5]); r/podcasting threads ask for exactly "finished audio in → publishing layer out" (paraphrased) [25]; Descript funnels with a free show-notes generator [2] — recurring, monetizable pain.
- **Chapters are standards-bound and portable**: the open Podcast Namespace defines chapters as an external JSON file referenced from the feed [26][27]; ID3-tag chapters remain ≈1.5× more prevalent than namespace chapters (Livewire, 2024) [28]; major apps accept MP4-header/ID3 chapters [29]; platform support is inconsistent [30] — hence a package exporting BOTH the JSON shape and a plain-timestamps fallback.
- **Bilingual show-notes practice exists without tooling**: language-learning and MSA/English shows produce bilingual companion notes by hand [31][32] — weak-signal gap finding (no structured bilingual show-notes tool surfaced in searches; labeled as such, not claimed as a statistic).

[18] https://dpc.org.ae/-/media/ce7edc283f1f4c9bb050ad990b3e37c2.ashx · [19] https://www.podcastinc.io/post/podcast-industry-in-the-arab-world · [20] https://www.arabnews.com/media/new-report-explores-podcast-consumption-in-saudi-arabia-1960016 · [21] https://www.kenresearch.com/ksa-podcast-market · [22] https://www.imarcgroup.com/podcasting-market · [23] https://www.grandviewresearch.com/industry-analysis/podcast-market · [24] https://libsyn.com/blog/podcast-statistics-2026-listeners-downloads-ad-spend-and-industry-growth · [25] https://www.reddit.com/r/podcasting/comments/1so33ie/need_an_alternative_to_descript · [26] https://podcasting2.org/docs/podcast-namespace/tags/chapters · [27] https://github.com/podcastindex-org/podcast-namespace · [28] https://livewire.io/podcast-chapters-stats · [29] https://blog.castopod.org/apple-podcasts-embraces-chapters-another-victory-for-podcasting-2-0 · [30] https://james.cridland.net/blog/2023/spotify-chapters-kludge · [31] https://www.americathebilingual.com/episodes · [32] https://podcasts.apple.com/us/podcast/things-you-need-to-know-about-arabic-and-english/id1568964667

## Pricing landscape

Anchors: Descript $0–65/mo (per-seat + media-hours + AI credits) [3]; Castmagic ≈$19–39+/mo with per-minute transcription economics [5][6]; manual transcription $60–180/hr (vendor-published, unverified) [5]. Recommended posture (Q-3): flat solo tier in the $12–20/mo band (category-comparable, under the editing suites), with the chapter-suggestion assist metered per-run in the buyer's work units (suggestion runs per month — P14), because the manual path is fully capable and the meter only ever governs convenience, not core function (ai-native-patterns §5).

## Complaints mined (paraphrased patterns)

- Editing suites are overkill for finished audio; podcasters want the publishing layer without the editor (Descript-alternative threads, paraphrase [25]) — the LOOP-10 exclusion is the wedge, not a handicap.
- AI-generator outputs "need heavy editing"; emitted timestamps drift from real content (paraphrased sentiment [3][6][25]) — reviewable rationale + transcript-anchored timing answer both.
- Chapter-tool users loathe manual timecode scrubbing (paraphrase [9][10]) — segment-anchored marking removes the scrub entirely.

## Positioning statement

For Arabic podcasters who finish recording and dread the publishing evening, podcast-publish-kit is the episode production companion that turns one imported transcript into aligned chapters and bilingual show notes, and packages them in open, portable formats — unlike editing suites that bundle the pain with features you did not buy, black-box generators that emit unanchored text, and chapter-tag editors that make you hunt timecodes by hand.

## Market size (honest)

Long-tail of active Arab-world shows (5.1M regular KSA listeners implies a four-digit-plus show population — direction, not a statistic); self-serve at $12–20/mo with a metered assist. The package export keeps the door open to the hosting layer without building it (LOOP-10).
