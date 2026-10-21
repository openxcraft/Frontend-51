# 02 — User Research: funnel-drop-off-explorer

SME-B pass · Personas are synthesized from market research (01) and the documented behavior patterns of the retrieved corpus (vendor funnel docs as *observed analyst workflow* evidence — q11's hand-off flow, q19's "paths can be overwhelming" admission, q9's data-quality anxiety). All verbatims are PARAPHRASES of recurring practitioner sentiment (marked), never invented quotes. Four personas: the growth analyst (the daily surface), the product manager (the consumer of drop-off evidence), the data/growth engineer (the taxonomy owner), and the growth lead (the economic buyer).

## Persona 1 — Omar, growth analyst (primary daily user, the canvas)

**Role**: growth analyst at Wasl Commerce, a Riyadh delivery super-app (~2M monthly users, bilingual AR/EN user base). His week: activation and checkout funnels, segment deep-dives, experiment readouts for the growth squad. Today he works in an event-metered vendor's funnel chart, a SQL notebook, and a queue of his own hypotheses — and a growing queue of "can you check why X dropped" requests from PMs.
**Context**: Saudi-educated, bilingual ar/en; console in English (faster for him), comfortable reading Arabic labels when sharing with leadership; desktop-first, two monitors, keyboard-heavy. He has memorized the vendor's funnel builder clicks and resents that every why-question is a new chart configuration or a notebook session.
**JTBD**: "When checkout conversion drops 3 points week-over-week, I want to select the exact seam that leaked, see which segment explains it with numbers I can defend, and hand the PM an evidence link — in one sitting, not a two-day turnaround."
**Triggers**: the weekly metrics review (Sunday); a PM's "did you see the drop?" message; an instrumented feature launch (did the new step leak?); the growth lead asking for the quarterly funnel story.
**Objections**: "another query builder with extra steps" (the seam is the unit of work — no chart re-configuration per question; CP-2); "I don't trust scores I can't audit" (the anneal publishes its iteration trace, support floors, and the exact separation math — 07c §2.2); "my taxonomy is a mess — garbage in, garbage analytics" (the governed bilingual dictionary + lint report is a first-class surface, CP-4); "if the source binding dies, I'm blind" (paste-sample path + source freshness honesty, 08 N1); "I will not learn a new keyboard religion" (j/k/B/A/C map mirrors the tools he already knows — 09).
**Onboarding motive**: paste a sample, compose the team's real funnel, run one anneal on the known leak, and save the analysis — proof in the first session that the tool answers a question he already has (P22).
**Verbatim (paraphrase of recurring analyst sentiment in practitioner threads and doc comments)**: "I can get the funnel bar chart from three tools; what I can't get is the 'which users and how sure' without a notebook."

## Persona 2 — Sara, product manager (the evidence consumer)

**Role**: PM on the checkout squad at the same company; owns the conversion roadmap. She reads funnel screenshots in Slack, argues priorities with gut-plus-anecdote, and asks Omar for "a quick segment cut" that takes two days.
**Context**: bilingual ar/en, prefers reading summaries in Arabic when briefing regional leadership, English in squad channels; desktop + tablet in meetings. She will never compose a funnel; she will absolutely open an evidence link, read a narrative, and forward it.
**JTBD**: "When the analyst shares a drop-off finding, I want to read what the segment is, how big the leak is, and what the team should do next — without scheduling a walkthrough — and I want the link to still say the same thing next week."
**Triggers**: a shared analysis landing in the feed; the sprint-planning debate over which leak to fix; leadership asking "why did conversion move"; her own curiosity after a release.
**Objections**: "analyst tools speak analyst" (narrated analyses with plain-language segment stories, bilingual — 11 §D; the digest feed, not a chart dump); "screenshots rot, links should not" (saved analyses are parameter-backed and recompute deterministically — 07a/07c); "I need it readable in Arabic for the exec review" (bilingual taxonomy labels and narrative templates render per reader locale — 05 direction model).
**Onboarding motive**: open Omar's shared analysis on her tablet, read the narration and the Anneal Spine without training, and forward the exported evidence pack to leadership (the ≥820px review posture — 04).
**Verbatim (paraphrase of recurring PM sentiment)**: "Give me the 'who and how sure' in one paragraph and the receipts one tap deeper, and I'll stop scheduling analytics meetings."

## Persona 3 — Reem, data/growth engineer (the taxonomy owner)

**Role**: the engineer who owns event instrumentation at Wasl: the tracking plan, the SDK versions, the naming fights between squads. She has read the vendors' taxonomy guides (q9/q10 posture) and lived the "Song Played vs song played" class of incident (q10's own example).
**Context**: bilingual, console in English, GitHub-first workflow; she is skeptical of any analytics tool that silently invents events or hides instrumentation drift. She currently discovers taxonomy rot when an analyst's numbers look wrong — the worst possible discovery path.
**JTBD**: "When someone renames an event or ships a new property, I want the dictionary to be the single place it lands — with naming lint, bilingual labels, an owner, and an impact check on every funnel that uses it — so analysis garbage never ships."
**Triggers**: a new squad instrumenting its first flow; a lint failure surfacing in the weekly digest; an analyst asking "what is Promocode Applied, exactly?"; deprecating a legacy event after a migration.
**Objections**: "governance theater that nobody maintains" (lint is computed, violations are listed with usage counts and fixes preview against real funnels — CP-4); "my tracking plan lives where my code lives" (the taxonomy is adapter-bound data with versioned changes and activity trails — 07a; paste/CLI-shaped import paths at binding time, 08); "bilingual labels are nice-to-have until the exec review renders squares" (bilingual labels are REQUIRED fields with lint-enforced completeness — 07c §2.5); "who broke the funnel?" (every taxonomy change that touches a saved funnel names the impact before commit — CP-4 step 4).
**Onboarding motive**: run the lint report on the existing dictionary, fix one naming violation end-to-end with the usage-count preview, and watch the deprecated-event conflict surface with its resolution paths (CP-4).
**Verbatim (paraphrase of recurring data-engineering sentiment)**: "Taxonomy debt is invisible until the day it isn't, and that day is always a leadership review."

## Persona 4 — Layla, head of growth (economic buyer)

**Role**: growth lead at Wasl; owns the activation and checkout conversion numbers, walks into the quarterly business review with a funnel story, and answers for both the conversion trend and the team's tooling spend (an event-metered platform bill that scales with success — the more events the product emits, the more the vendor charges).
**Context**: Saudi, bilingual ar/en — reads English dashboards, briefs in Arabic; desktop and evening tablet reviews. She has watched the team's vendor bill grow with usage while the why-questions still route through one analyst.
**JTBD**: "When I sign off on a tool for the squad, I want the analysts faster on why-questions, the PMs self-serving evidence, and the bill NOT scaling with our event volume — and I want the quarterly story reproducible, not a screenshot."
**Triggers**: the quarterly review; the vendor renewal with its overage line; a hiring decision (another analyst vs. a better instrument); a leadership dispute over which leak to fund.
**Objections**: "we already pay an analytics platform — why a second one?" (the exploration desk binds existing sources and prices seats, not events — Q-3; it answers the question the platform's funnel chart cannot — 01 §5.1); "will non-analysts actually use it?" (the review posture + narrated analyses make evidence self-serve for Sara — 04); "I won't buy a black box that scores MY users" (published anneal math, iteration traces, pseudonymous user keys — 07c/09; the same inspectability posture that sold shift-swap's fairness ledger and cod's risk scorecard); "compliance: what user data leaves our stack?" (the product drills to pseudonymous keys only; no emails, phones, or names anywhere in the entity model — 07a/09 privacy posture).
**Onboarding motive**: read the weekly digest on her tablet, open one shared analysis, and forward its exported evidence pack into the QBR deck — the tool's ROI visible as a leadership artifact, not a usage statistic (P22).
**Verbatim (paraphrase of recurring growth-lead sentiment)**: "The platform bill grows with every event we ship; the insight count doesn't. Fix that ratio."

## JTBD summary matrix

| Persona | Core job | Trigger frequency | Primary objection to overcome |
|---|---|---|---|
| Omar | Explain a leaking seam with defensible numbers, in one sitting | weekly cadence + ad-hoc fires | tool-vs-notebook ergonomics + auditability |
| Sara | Consume and forward drop-off evidence without an analyst intermediary | per analysis, weekly-ish | readability + rotting links |
| Reem | Keep the event dictionary governed, bilingual, and impact-checked | per instrumentation change | governance that actually runs |
| Layla | Buy insight throughput without event-metered bill growth and defend the conversion story | quarterly + renewal cycles | second-tool justification + black-box aversion |

## Onboarding motives → flow mapping (feeds 03)

First-session value proof per persona drives first-run: Omar lands on the CANVAS with the paste-sample path offered (CP-1); Reem lands on the TAXONOMY lint report (CP-4); Sara's first touch is a SHARED ANALYSIS link (the review posture — she is not a first-run author); Layla gets the digest preview + one shared analysis (CP-5). The P22 checklist (11 §H) carries four entry paths, one per persona — no tours-of-balloons (ux-patterns §22).

## Objection → design response matrix (spec-level sales honesty; every 02 objection answered)

| Persona | Objection (above) | Where the spec answers it |
|---|---|---|
| Omar | "another query builder" | The seam is the unit of work: compose the funnel once, then j/k seams, one-key drill (B breakdown, A anneal, C compare — CP-2/09); the cascade never re-configures per question |
| Omar | "scores I can't audit" | The anneal publishes separation math, support floor, epsilon, depth cap, and the full per-iteration trace (admitted/rejected candidates with their scores — 07c §2.2); evidence exports carry the trace verbatim (11 §D) |
| Omar | "taxonomy is a mess" | Governed bilingual dictionary as a first-class surface: lint rules from the vendors' own published conventions (q9/q10), usage counts, deprecation with funnel-impact gates (CP-4) |
| Omar | "source binding dies" | Source freshness chips everywhere data renders (11 §G); paste-sample import as a v1 PRIMARY path (CP-1, 08 N1); the canvas never renders unsourced numbers silently |
| Omar | "new keyboard religion" | The shortcut table is modified-key/navigation-key-first, Arabic-layout-safe, ⌘K for everything else (09); j/k/B/A/C mirror tools he knows |
| Sara | "analyst tools speak analyst" | Narrated analyses (plain-language, bilingual, provenance-labeled — 11 §D); the Anneal Spine renders the chain as readable facts, not a chart to decode (06/13) |
| Sara | "screenshots rot" | Analyses are parameter-backed entities that recompute deterministically (07a Analysis; 07c §5); the link says the same thing next week, or names exactly what changed (freshness/coverage chips) |
| Sara | "readable in Arabic" | bilingual-en workspace: reader-locale rendering of taxonomy labels and narrative templates (05 direction model; 11 matrix carries both strings) |
| Reem | "governance theater" | Lint is computed on every dictionary change and on demand (getTaxonomyLintReport); violations carry usage counts and fix previews against real funnels (CP-4 step 3) |
| Reem | "tracking plan lives in code" | The taxonomy is versioned data with activity trails (07a); upsert carries lint results synchronously; bulk paths at binding time are an owner question (Q-10), not a silent side door |
| Reem | "bilingual labels rot" | labelEn/labelAr are REQUIRED on active events; completeness is a lint ERROR class (07c §2.5); the seeded fixture ships a real gap for the demo (07c §1) |
| Reem | "who broke the funnel?" | Taxonomy changes that touch saved funnels return impact lists; deprecating a referenced event requires an explicit resolution (CP-4 step 4; 07b rule 7) |
| Layla | "why a second analytics tool?" | It binds existing sources (no re-instrumentation), prices the desk not the events (Q-3), and answers the why-question the platform's chart cannot (01 §5.1/§5.5) |
| Layla | "will non-analysts use it?" | The ≥820px review posture with narrated evidence, the digest ladder, and exportable packs (04; 11 §E) — Sara's self-service is the adoption story |
| Layla | "no black boxes on MY users" | Published anneal math + iteration traces (07c §2.2); pseudonymous keys only (07a); provenance on every narrative (07b rule 4) |
| Layla | "what data leaves our stack?" | The entity model has no PII fields: user keys are pseudonymous, properties are declared taxonomy axes, no emails/phones/names/geo-IP anywhere (07a privacy posture; 09) |

## Voice derivation (feeds 05/11 via SME-J)

Workshop-room voice: precise, direct, evidence-forward, dry-warm. English: professional-neutral, contractions off (analytics is a governance-adjacent family surface), sentence-case buttons, no hype adjectives (copy-voice §2). Arabic: فصحى بيضاء (plain MSA) for console chrome and narrative templates — disciplined one-term-one-concept glossary pinned in 11 §I (مسار = funnel step, هبوط = drop-off, درز = seam (the product's coined term — glossary note), تلبيد = annealing (coined), سلسلة المقاطع = segment chain, مسرد الأحداث = event taxonomy). Numbers state facts and name their basis: "86 of 271 users — 31.7% of the step — did not continue to Add to Cart". Confidence is never adjectives: it is support counts and excess figures ("60 users, 60.0% drop-off, +28.3 points above baseline, 17 excess drop-offs"). Errors follow [what]+[why]+[next] (copy-voice §1.4). Success moments are calm — the Anneal Pinch is the one ceremony (05). Narration copy is honest about provenance ("template-metrics" vs "model-assisted" — 11 §D2) and never claims causality the math does not support: the anneal finds ASSOCIATION with excess drop-off, and the narration says so in both locales (11 §D1 — the correlation-honesty sentence is a matrix-of-record string).
