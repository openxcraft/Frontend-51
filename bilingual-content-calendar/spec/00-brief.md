# 00 — Brief: bilingual-content-calendar

Family: content_tools · Tier: 2 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is
A bilingual (ar/en) editorial planning calendar for social and content teams: slot-based planning across channels and campaigns, where every slot holds paired Arabic/English post variants, planned against a dual Hijri/Gregorian timeline with a Ramadan-aware planning mode. It is a planning and collaboration surface — teams decide *what publishes when and in which language variant*; execution (actual publishing) is explicitly out of scope and handed off via export.

## Buyer
Bilingual social media and content teams (3–15 users) at MENA brands, agencies, and publishers — the same buyer pool as arabic-copy-studio's teams but the planner role (social media managers, content leads) rather than the writer role. Economic buyer: social/content lead.

## Surface
Web application, desktop-first calendar grid (day/week/month/season modes), tablet-usable, mobile review-only (view + approve comments). No publishing connections, no mobile app, no public API at v1.

## Unique feature
Dual-calendar planning with cultural season intelligence: the timeline renders both Hijri and Gregorian dates (method declared per workspace), and Ramadan mode reshapes the grid around iftar/suhoor timing patterns, seasonal moments library (Eid, White Friday, national days), and quiet-hours conventions — with ar/en variant pairing per slot so bilingual parity is planned, not retrofitted.

## Exclusions (LOOP-10 discipline)
- No channel publishing or connection credentials (the commerce/social execution layer; export is the handoff).
- No analytics or performance reporting (analytics family owns measurement).
- No asset editing or design (media-asset family owns).
- No AI generation (declared non-AI product per ai-native-patterns §1 — planning is deterministic collaboration).
- No approval workflows beyond reviewer comments + slot status at v1.

## Success signals
A team can: build a Ramadan campaign grid in under an hour with moments from the library; keep ar/en variants linked with parity status visible; hand a fully-specified week to executors via export; and run entirely on the Mock Adapter with zero provider knowledge in the UI.
