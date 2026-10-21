# 00 — Brief: media-asset-hub

Family: content_tools · Tier: 3 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A bilingual digital asset library for small media teams: one shared home for the images, video, audio, and documents a producing team accumulates, organized around Arabic/English metadata instead of folder trees. Assets arrive through a staged, observable, resumable ingest pipeline that derives renditions, extracts text living inside the asset (titles burned into broadcast graphics, signage in photography, slide text — an abstract text-extraction capability), and proposes bilingual tags via an abstract auto-tagging capability that is reviewable and never authoritative (P15). Findability is the product: one dual-script search bar covers filenames, bilingual titles/descriptions/keywords, tags, and extracted in-asset text, with Arabic query normalization (alef/hamza, taa marbuta/heh, yaa forms, tashkeel) applied at index and query time and disclosed (ai-native-patterns §7.4).

It is deliberately a library, not an editor: it stores, describes, finds, and packages assets — never modifies them. Teams assemble ordered collections with bilingual notes for briefs and handoffs, maintain rights records per asset (usage terms, credit, expiry with an expiring-soon console), and export packages or manifests. Everything the UI knows of backends it knows through `AssetHubAdapterV1`; every external capability (object storage, text extraction, auto-tagging, notifications) is abstract in 08 with a manual alternative — link-catalog mode, pasted transcriptions, manual bilingual tagging — so the library is fully usable pre-integration.

Bilingual by construction: every descriptive field exists in both locales (title, description, keywords, alt text — the a11y obligation DAMs routinely skip), per IPTC-style language-alternative practice (01 [8][9]); search accepts either script and returns either script's matches; Arabic filenames are first-class, never transliterated away. The AI stance is honest: auto-tagging degrades to manual bilingual tagging, extraction degrades to pasted transcription, and the core library never requires any AI capability (ai-native-patterns §8).

## Buyer

Small media teams (2–10 seats) in MENA: production houses, publisher media desks, boutique agencies, brand content teams. Daily users: video producers, brand designers, archive editors. Economic buyer: studio/content lead. Personas in 02.

## Surface

Web app, desktop-first (≥1280px), responsive to 360px. Zones: left rail (Library · Collections · Ingest · Rights · Activity); top dual-script search + filter builder; virtualized asset grid; right metadata drawer. Breakpoints: ≥1280 three-zone; 768–1279 drawer as sheet; <768 single column, rail → bottom tabs, browse/search/read-only. No public-facing surface of any kind (LOOP-10).

## Unique feature

Bilingual metadata with Arabic in-asset search: (a) every descriptive field is a language-alternative pair with parity tooling; (b) ingest runs a text-extraction capability (OCR-on-ingest intent, abstract per 08) whose Arabic output is normalized into the search index — "مؤتمر" finds a photo whose only trace of the word is the conference banner in the image. Defensible because: mainstream DAM is English-first (01); OCR-to-searchable-metadata exists only in niche Latin-focused tools; Arabic extraction is honestly hard (65–75% general benchmarks — 01 [23][24]), so we ship confidence-gating, per-asset review, and manual transcription — the bilingual workflow around the capability is the moat, not a claim that the capability is solved.

## Exclusions (LOOP-10, binding)

- No editing: no transformation of originals beyond internal renditions (thumbnails/previews).
- No public portals: no brand portals or guest galleries; collections export as packages/manifests.
- No CDN/publishing claims: no delivery-network or distribution promises; exports are files with expiry windows.
- No AI generation: tagging proposes only; suggestions stay drafts until accepted (P15).
- No workflow/approval routing beyond tag review and rights states; no usage analytics; no stock marketplace.

## Success signals (definition of done vs Mock Adapter)

A small team can, against the deterministic mock: ingest 12 mixed files with bilingual metadata via staged, cancellable progress; review auto-tag suggestions and correct two; find any seeded asset by an Arabic query matching only extracted in-asset text (normalized variants included); assemble a 6-asset collection with bilingual notes; set a rights expiry and see it in the review console; export a manifest — zero provider knowledge in UI, zero AI requirements blocking any core path.
