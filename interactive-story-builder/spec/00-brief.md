# 00 — Brief: interactive-story-builder

Family: content_tools · Tier: 3 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A scrollytelling builder for newsrooms, NGOs, and universities. A story is a sequence of chapters; each chapter a sequence of steps; each step pairs a scroll behavior with an RTL-native layout — full-bleed media, text-over-media, media+text side-by-side on logical axes, figure-with-caption, pull-quote, or stat band. Authoring is structure-first: producers think in chapters and steps, not canvas pixels, which is what makes review, bilingual alignment, and long-story maintenance tractable. An in-app preview renders the real scroll experience in either direction before anything is exported.

Bilingual by construction: every step carries Arabic and English `LocaleVariant`s aligned one-to-one by structure. The bilingual chapter sync surface shows per step whether the locales are in-sync, edited-since-other, missing-in-locale, length-divergent, or layout-override — the portfolio's P23 parity discipline applied to narrative structure. RTL is native, not mirrored-after-the-fact: layouts are defined on inline-start/inline-end axes so an Arabic chapter reflows by design, with optional per-locale layout overrides when a step's visual argument demands it (rtl-rules §2).

AI stance is conditional (ai-native-patterns §1): one suggestion operation proposes chapter/step outlines from a story brief; when that capability is unavailable it degrades to deterministic chapter templates (newsroom investigation arc, NGO impact arc, university field-trip arc) — first-class objects, not consolation prizes. Drafting, sync, QA, review, and export never require the suggestion capability.

## Buyer

Visual journalism producers at regional newsrooms (primary); NGO communications teams producing bilingual impact/annual reports; university instructors and research communicators. Economic buyer: visual/digital journalism lead, communications director, department. Daily user: producer, editor, reviewer. Personas in 02.

## Surface

Web app, desktop-first (≥1280px authoring; responsive read-down to 360px). Zones: story library · template gallery · outline editor (chapter rail + step board) · step editor (scroll canvas + inspector) · sync panel · preview with direction toggle · QA report · review surface · jobs & exports · settings. Authoring ≥1024px; preview/review usable at 768px/360px. No mobile app, no public API at v1.

## Unique feature + defensibility

RTL-native step layouts with bilingual chapter sync. Defensible: (a) logical-axis layouts make direction a rendering mode, not re-authoring — no surveyed competitor documents RTL-native layouts (01); (b) step-index bilingual sync with derived states is meaningless to single-locale tools; (c) the buyer triple sits between $200+/mo editorial tools and GIS-centric builders (01 pricing evidence).

## Exclusions (LOOP-10, binding)

- No audience analytics — reads/engagement/funnels (analytics family; flagged in 12).
- No member management — roles exist in the session model; no invite/admin surfaces (07b).
- No site building — exports are standalone artifacts/embed packages, not hosted sites (08).
- No media library CRUD — media attach by external URL or abstract capability (08; media-asset-hub owns libraries).
- No chart/dataviz authoring — data figures are embedded media, not authored here.

## Success signals (definition of done vs Mock Adapter)

A producer can: create a story from a template; build a 3-chapter, 9-step story with media and per-locale text; clear a missing-English flag in the sync panel; preview both directions with numerals per policy; pass the QA gate; export an HTML bundle via the Job flow with expiry and renewal — first session, Mock Adapter, zero provider knowledge in UI, suggestion capability off end-to-end.
