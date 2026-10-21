# 00 — Brief: arabic-copy-studio

Family: content_tools · Tier: 1 (FLAGSHIP) · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

An AI-assisted Arabic/English copywriting studio for MENA marketing and content teams. Writers draft, transform, and refine marketing copy — product descriptions, campaign lines, email bodies, social posts — with explicit control over Arabic register (فصحى بيضاء / فصحى وسطى), optional tashkeel, dialect detection and warnings, and a brand kit + glossary that the AI respects during generation. The product is a writing environment first and an AI tool second: it is fully usable as a bilingual drafting surface with versioning, review, and export, and the AI capability augments it without ever being required (ai-native-patterns.md §8).

## Buyer

In-house Arabic-first content and marketing teams (2–50 seats) at brands, e-commerce companies, publishers, and agencies across MENA. Secondary: bilingual freelancers serving those teams. Primary economic buyer: content lead / marketing director. Primary daily user: copywriter or bilingual content designer. Full personas in 02-user-research.md.

## Surface

Web application, desktop-first (≥1280px primary), responsive to 360px with a reduced editor layout. Three core zones: document workspace (list + editor), context rail (brand kit, glossary, register settings), AI side panel. No mobile app, no browser extension, no public API at v1.

## Unique feature

Register and dialect control as first-class editing dimensions: the writer selects an Arabic register and the studio enforces it — inline flags on register drift, dialect detection with an explicit accept/normalize choice, tashkeel toggle with rendering-aware line-height, and bilingual transform that converts ar↔en drafts while preserving register parity and glossary terms. No product in the current category treats register as a controlled dimension rather than a prompt suggestion (evidence in 01-market-research.md).

## Exclusions (narrow scope, enforced by LOOP-10)

- No publishing, scheduling, or channel distribution (content calendar family owns planning; see _index.md adjacencies).
- No image, video, or audio generation. Text only.
- No SEO tooling (keyword research, rank tracking — seo-brief-builder's family).
- No translation-memory/agency workflow (TMs, vendor routing — translation-review-hub's family; adjacency flagged in both 12-open-questions).
- No team roles beyond Owner / Editor at v1.
- No offline mode beyond autosave queuing (P20); no real-time co-authoring presence beyond conflict detection at v1 (upgrade path documented in 12).

## Success signals (for spec-level definition of done)

A bilingual copy team can: set up a brand kit + glossary in under 20 minutes; produce a register-consistent Arabic campaign set (3 assets) with AI assistance in under 40 minutes; transform an English master copy to register-matched Arabic and back with parity review; and hand off approved copy with versioned exports — all against the Mock Adapter, with zero provider-specific knowledge anywhere in the UI.
