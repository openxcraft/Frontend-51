# 00 — Brief: seasonal-campaign-board

Family: content_tools · Tier: 3 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A seasonal planning board that turns MENA's retail moment calendar into campaign readiness. The product ships with a **moment library** — Ramadan, Eid al-Fitr, Eid al-Adha, White Friday, Saudi National Day, Saudi Founding Day, UAE Eid Al Etihad, back-to-school, and next-season previews — each moment carrying its dual Hijri/Gregorian dates (Umm al-Qura presentation with in-app method disclosure per portfolio Q-5), its drift disclosure (±1 day for moon-sighting-dependent dates), and its **phase map**: a build-up window (when preparation shopping and campaign work actually begins — weeks before the moment), the peak window (the last-10-days-style surge documented for Ramadan, the deal week for White Friday), and the wind-down. A retail marketing team picks a moment, and the board creates a campaign with a **countdown** to go-live and a readiness checklist instantiated from the moment's template: every item has an owner, a status, and a due date derived from a countdown-linked offset (T-minus days before the moment), so "shot the Eid gifting teaser" is due when the countdown says 21 days — not when someone remembers.

The daily surface is the board: campaign lanes against a dual-calendar strip (Hijri + Gregorian, active system explicit, hover cross-reference), countdown tiles per campaign, and readiness meters that compute percent-complete, at-risk (due within the threshold), overdue, and blocked counts from the checklist. Work happens in the checklist: inline status changes, assignment, blocked-with-reason, custom items beyond the template, and bulk moves. The product is deliberately dumb in the best way — deterministic counting, deterministic dates, deterministic math (ai-native-patterns §1: **declared non-AI product**; no generation, no prediction, no scoring intelligence; the intelligence is in the curated moment data and checklist templates, which are inspectable, editable objects). When a moment passes, campaigns close with a **closure note** — what shipped, what slipped, lessons — and the note can carry into the next season's template, so the board learns organizationally instead of algorithmically.

Why this shape: MENA retail seasonality is the demand engine (01) — Ramadan drives a documented region-wide spending surge with a nighttime economy and last-10-days peak, Eid weeks are gift-led spikes, White Friday multiplies weekly spend in KSA, and national days carry explicit brand-participation expectations from consumers. Yet readiness practice lives in static checklist documents and chat threads (01 Q5 evidence): checklists with owners and due dates are established practice, but nothing couples them to a per-moment countdown on a dual Hijri/Gregorian timeline. The defensible uniqueness is exactly that coupling — moment library (with drift and phase semantics) × countdown-linked checklist offsets × closure-to-template loop — none of which is replicated by channel/content calendar tools, task boards, or the portfolio sibling bilingual-content-calendar (boundary in 12).

## Buyer

Retail marketing teams (3–12 seats) at MENA retailers, e-commerce merchants, and the agencies serving them: retail marketing leads (economic buyer), e-commerce and merchandising specialists, content coordinators, store marketing staff. The team plans campaigns around moments, not around channels — this is the readiness layer beneath channel execution (which the family excludes).

## Surface

Web application, desktop-first board (campaign lanes × dual-calendar strip, ≥1024px full experience; 768–1023px board with collapsed rail; <768px read-only monitoring: countdown tiles, readiness meters, checklist status — no template editing, no bulk operations). Zones: moment library browser · campaign board with countdown tiles · campaign checklist detail · closure & retro · template editor · team roster · activity log · settings (locale, calendar method disclosure, notification tiers).

## Unique feature

MENA moment library with countdown-linked readiness checklists: a curated, bilingual, dual-calendar moment dataset (dates, drift disclosure, phase windows, per-moment checklist templates with role and criticality metadata) that instantiates campaigns whose every checklist item carries a T-minus due offset from the moment — so readiness is always expressed in countdown time, and closure notes feed template versions for the next season.

## Exclusions (LOOP-10)

- No ad buying or media placement (any kind; spend tools are another family).
- No asset creation or design (media-asset family owns libraries; design tooling is out of family).
- No approvals escalation or multi-stage sign-off (checklist items are done/blocked, not routed through approval chains; accountability is the activity log).
- No channel publishing or scheduling (bilingual-content-calendar sibling owns slot planning; handoff is export).
- No analytics or performance reporting (analytics family owns measurement).
- No AI features (declared non-AI).

## Success signals (definition of done, Mock Adapter)

A team can: browse the moment library and read a moment's phases, drift disclosure, and template; create a campaign from a national-day moment in under a minute (quick-start path) with checklist instantiated; drive the checklist to a readiness state where every critical item is done, with at-risk and overdue counts visible; export a readiness report and a task handoff for executors; close the campaign with a closure note carried into the next template version — all on the deterministic Mock Adapter with zero provider knowledge in the UI and zero AI affordances anywhere.
