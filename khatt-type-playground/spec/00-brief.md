# 00 — Brief: khatt-type-playground

Family: content_tools · Tier: 3 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A typography playground for bilingual brand systems: pick an Arabic family and a Latin family from a curated catalog, then work them against each other on a large, quiet canvas — headline pairs, body blocks, numeral runs, mixed-direction lines — under real controls: weights, optical sizes, a shared modular scale, leading, and tracking where the script allows it. Deliberately deterministic: every value on screen is a direct manipulation of inspectable font metadata; nothing is generated, scored, or "smart." A lab bench, not an oracle.

Its depth is Arabic-specific. Specimen blocks expose OpenType features per font — contextual alternates (`calt`), ligatures, stylistic sets, justification alternates (`jalt`) — with an honest capability model: a font without `jalt` shows that control disabled with an explanation, never faked. A dedicated kashida surface lets designers stretch justified Arabic via tatweel density or justification alternates and immediately see where word shapes break — the documented pain (01) no mainstream web tool exposes interactively.

Output is a deliverable, not a screenshot: a composed specimen (headline pair, scale table, kashida demo, feature notes) exports as a specimen sheet, image sheet, or CSS-token + JSON spec, with the session's settings printed on it — the artifact a committee or developer can act on. Sessions persist and resume; specimens are versioned so guideline work survives review rounds.

## Buyer

Designers and agencies building bilingual (Arabic/Latin) brand and editorial type systems across MENA: senior brand designers at boutiques, design leads at publishers and cultural institutions, freelance type-focused designers. Daily user: the individual designer at a large canvas; secondary: the art director reviewing exported specimens. Seat model — no team features at v1 (LOOP-10).

## Surface

Web app, desktop-first, large canvas (≥1280px primary). Zones: catalog rail (font browsing + glyph grid), pairing canvas (hero: two-script blocks + controls column), session/specimen bar. Breakpoints: 1280+ full lab · 768–1279 compact (collapsible rails) · <768 read-only specimen viewer. No mobile app, no extension, no public API at v1.

## Unique feature + why defensible

Arabic/Latin pairing lab with contextual alternates and kashida controls. Defensible (01): pairing generators and curation sites are Latin-only; Arabic/Latin pairing knowledge lives in agency services and blog heuristics ("match visual weight"); kashida/`jalt` behavior is documented as under-served across layout engines and invisible until a font is bought and tested in desktop apps; foundry specimens show one family at a time, never a pairing. Reproducing it requires Arabic feature modeling (joining forms, justification behavior, numeral systems) the Latin-first category has no reason to build.

## Exclusions (LOOP-10, binding)

- No font sales or licensing — foundry refs are display-only links; never transact.
- No full font editor — no glyph drawing, no modified font binaries; rendering settings only.
- No team libraries — no shared collections, roles, comments; sharing is export/link.

## AI stance

Declared non-AI product (deterministic tool). No adapter operation generates, scores, or transforms content by model; curated pairing notes are human-authored data with recorded sources, labeled as such.

## Success signals (definition of done vs Mock Adapter)

A designer can: inspect a font's glyph grid and feature list; assemble an Arabic+Latin session; tune weights, scale, leading; toggle a contextual alternate set and a kashida mode on a justified Arabic block with honest disabled-state explanations; compose a specimen with a both-systems numeral run; export it as a job with expiry; resume the session later — first session, zero provider knowledge in UI.
