# 00 — Brief: newsletter-kit

Family: content_tools · Tier: 3 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A bilingual newsletter composer with subscriber views for MENA publishers and community builders. An issue is composed once, in two locales: block-by-block in Arabic and English side-by-side, with a per-locale subject-variant set, per-locale preheader, and a pre-send render QA pass that checks what actually breaks Arabic email — direction containers, bidi isolation of embedded Latin, subject truncation budgets, numeral consistency, line-height floors, email-safe font fallbacks. Sending is an abstract "delivery channel": the product composes, QA-gates, schedules, and monitors; it never owns send infrastructure.

The product is deliberately not an email-marketing suite. It is the bilingual desk where an issue gets made and verified before it leaves: the composer (blocks with locale alignment links, subject-variant editor, preview in both directions and at narrow widths), the QA studio (a deterministic 10-check pre-flight checklist, pass/warn/fail per locale), and the subscriber views (lists with locale mixes, consent-tracked imports, per-subscriber locale preference). With no channel bound, the whole loop still works — the issue exports as rendered HTML/text per locale, the list exports as CSV, and the human pastes both into whatever sending arrangement they already have.

The AI surface is narrow and honest: a subject-line variant assist that proposes alternates per locale — metered, draft-by-default — which degrades to the manual alternates editor that is always present and always authoritative. Everything else is deterministic, because the buyer's core pain (broken RTL renders, truncated Arabic subjects, mixed numerals) is a rules problem, not a generation problem.

## Buyer

Publishers (regional desks, bilingual briefings) and community builders (developer communities, associations, cultural programs with mixed ar/en audiences) — 1–5 seats. Secondary: solo bilingual creators past paste-into-whatever workflows. The send-automation buyer is explicitly not served (LOOP-10).

## Surface

Web app, desktop-first (≥1280px), responsive to 360px in read/monitor modes. Zones: issues home; issue composer (bilingual block columns + locale variant tabs); QA & preview studio (checklist panel + direction/width preview); subscribers (lists, virtualized table, import review); send desk (channel bindings, schedule, jobs, export); settings. Composer and QA studio are desktop/tablet; mobile covers lists, statuses, job monitoring.

## Unique feature + why defensible

Bilingual issue composition with per-locale subject variants and RTL render QA. Email clients ignore or strip `dir=rtl` in documented cases, producing overlapping/reordered Arabic text (Mailtester; CanIEmail per-client data; a Gmail RTL-stripping report; an open-source email-builder issue losing direction on Arabic elements) — yet no mainstream newsletter composer treats RTL render QA as a first-class pre-send gate. Per-locale subject variants exist nowhere as a structured object: global tools treat subject lines as single fields, while truncation budgets differ in practice (mobile shows 33–50 characters; English guidance clusters ~35–60; no published Arabic benchmark exists — our budget is a disclosed internal heuristic, 12 Q-9). A bilingual publisher needs distinct alternates per locale, length-checked per locale — a small structure with no competitor equivalent.

## Exclusions (LOOP-10, binding)

- No monetization/paywalls/subscription billing.
- No website builder or hosted archive pages.
- No send infrastructure: delivery is an abstract "delivery channel" bound at implementation; manual alternative = rendered export + CSV (LOOP-5, always available).
- No marketing automation (drip/behavioral) — single issues and their send jobs only.
- No analytics beyond send-job outcome counts (opens/clicks are the channel's business).
- No AI beyond the subject-variant assist (degradation map in 08; manual alternates editor is the declared fallback and always-present base).

## Success signals (definition of done vs Mock Adapter)

A publisher can: create a bilingual issue and compose 6+ linked block pairs in both locales with per-locale subject variants; run the QA checklist and clear every fail in one loop; import a 100-row CSV with locale preferences and consent review; schedule through a bound channel and watch the send job complete per locale — or, with no channel bound, export the rendered issue (HTML/text, both locales) plus the subscriber CSV and send manually. All on the Mock Adapter, zero provider knowledge in the UI.
