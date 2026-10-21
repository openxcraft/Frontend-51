# 02 — User Research: marketplace-listing-sync

SME-B pass · Paraphrased sentiment only, marked (paraphrase) — zero verbatim quotes; personas synthesized from the research digest's practitioner sources (research/batch7/marketplace-listing-sync-q1…q13) and portfolio-adjacent buyer patterns. Personas use regional names; no real individuals are represented.

## Persona 1 — Badr, Founder & E-commerce Lead (primary buyer)

**Role**: runs a 380-SKU home-goods and fragrance import business in Riyadh selling on two regional bilingual marketplaces, one global marketplace's regional site, and an Arabic-first storefront platform. He personally built the bilingual catalog in a spreadsheet over two years; his team now copies fields into three seller dashboards by hand, and he answers when a channel freezes listings for title-length violations the team never saw coming (paraphrase of the rejection-decomposition evidence, digest [26]).
**JTBD**: "When we add or change a channel, I want the catalog mapped once, per channel, with each marketplace's rules checked before anything is submitted, so expansion stops costing a week of copy-paste and a month of rejection fixing."
**Triggers**: a title-rule wave (the 200→75-character enforcement class, digest [19][20]) that would silently invalidate a third of the catalog; a channel onboarding where the bilingual fields had no obvious home (locale-attribute mismatch); the founder's own audit — the same product with three different Arabic titles across channels.
**Objections + responses**: "We already pay for a listing suite" → the suites meter orders, and their listing surface is a sync status, not a rule verdict (01 pricing + gaps); "another seat-heavy tool?" → per-seat with viewer seats free for read-only readiness (12 Q-3); "will it fight our storefront platform?" → channels are abstract — the storefront is one channel archetype among others, and the export path always works (08 N1/N4).
**Pains**: rejection surprises that arrive after submission (the "diagnostics, not rejections" surface, digest [27]); no single place that says *this listing is ready for this channel*; bilingual copy drift across channels.

## Persona 2 — Amira, Catalog Manager (primary daily user)

**Role**: owns the master spreadsheet — paired Arabic/English titles, descriptions, bullets, images, attributes — for the same business; her week is dominated by re-entering the same product into three dashboards and re-fixing titles that broke a ceiling she only learns about from an error file (paraphrase of flat-file error-list practice, digest [29][31]).
**JTBD**: "When I map our catalog to a channel, I want each field's Arabic and English variants placed deliberately — with the channel's title ceiling and required attributes checked as I map — so I stop discovering violations one error file at a time."
**Triggers**: an error-file download that lists 40 SKUs with a code she has to look up; a new-attribute request from a channel (the mapping has to grow); a master title edit that leaves published listings silently outdated (staleness).
**Objections + responses**: "I don't trust auto-mapping — it put the brand into the category once" (paraphrase of automation-rigidity sentiment in the category, digest [5]) → every suggestion is draft-by-default with disclosed confidence; accept/edit/reject is the whole interaction, and the manual editor is the full citizen (P15 discipline); "keyboard-first or I won't use it daily" → full keyboard traversal of the mapping table and catalog grid (09); "our Arabic titles run longer" → the checklist's ceiling rule is per-locale where the channel demands it, and truncation transforms break at word boundaries (07c rule 4).
**Pains**: mapping knowledge lives in her head, not in a reviewable object; per-channel ceilings differ, and nothing computes them before submission; bilingual parity is a manual double-check.

## Persona 3 — Salem, Channel Owner (readiness and publish gatekeeper)

**Role**: e-commerce specialist who owns ONE channel end-to-end — its rule pack, its publishing cadence, and the answer when that channel complains. Today he keeps a private checklist document of the channel's rules, half of them outdated after the last rule wave (digest [19][20][23] as the wave evidence).
**JTBD**: "When I publish a batch, I want every listing's checklist verdict in one console — blockers named, warnings acknowledged — so I never submit a batch I haven't seen the verdict for."
**Triggers**: a published listing that later failed on the channel (error state with the channel's code); a rule wave announcement that means re-auditing 380 SKUs; the founder asking "are we ready on your channel?" with no honest answer available.
**Objections + responses**: "The channel's own dashboard shows errors" → after submission — this desk computes the same class of verdicts before, against an editable rule pack the owner curates (07c rule 5); "I don't want a shared mapping others can change under me" → the field map is versioned; edits re-version and stale-mark dependent listings rather than silently propagating (07a state obligations); "batch publishing with one bad SKU ruins the batch" → per-listing partial policies — blocked listings are skipped and named, ready ones go (07b rule 7).
**Pains**: rule knowledge is stale-document-shaped; the publish moment is all-or-nothing hope; channel error codes need translating into work.

## Persona 4 — Noura, Founder-Viewer of a second brand (read-only seat)

**Role**: co-founder who reads readiness across channels for a second brand the team launched — she never edits catalog data or mappings but needs the honest state ("how many listings are blocked and why") for weekly ops reviews; she also answers when a marketplace relationship asks for evidence of listing-quality discipline.
**JTBD**: "When I review the week, I want the readiness board per channel — blocked, ready-with-warnings, published, stale counts with named blockers — without asking anyone to build me a report."
**Triggers**: weekly ops review; a channel partnership review; post-wave re-audit questions ("did the 75-character change hit us?").
**Objections + responses**: "I don't want to learn a mapping tool" → viewer seat: readiness boards, findings, and exports are readable; zero mutation surfaces (07b role rule); "reports by screenshot" → the readiness console IS the report, exportable (artifact path).

## JTBD summary

| Persona | Core job | Frequency | Primary objection → answer |
|---|---|---|---|
| Badr | new channel → mapped + rule-checked catalog in days not weeks | per expansion / per rule wave | "another suite?" → content desk, not order pipeline |
| Amira | master fields → correctly mapped, rule-clean listings | daily (mapping + fixing) | "auto-map misfires" → draft-by-default suggestions + manual full citizen |
| Salem | batch publish → verified readiness, no surprises | per publish batch | "channel shows errors after" → before-submission verdicts, editable rule pack |
| Noura | weekly review → honest readiness state | weekly | "no new software" → viewer seat, board-first surface |

## Voice derivation (SME-J)

Listing-desk voice: **trader-plain, evidence-first** — states what the rule measured, what the mapping did, and what the human decided, never editorializes about the listing's quality ("Title is 90 characters — the ceiling is 75. Edit the title or change the mapping's transform; the blocker clears when the count does."). Arabic register فصحى بيضاء (utility precision for a trade desk); English professional-neutral, contractions off (commerce-governance adjacency). Fixed terminology (locked across 05/07a/11; one concept, one term — copy-voice §3): القناة=channel · الإدراج=listing · المنتج الرئيسي=master product · الكتالوج=catalog · ربط الحقول=field mapping · الحقل=field · الخاصية=attribute · قاعدة=rule · حزمة القواعد=rule pack · قائمة فحص الامتثال=compliance checklist · المانع=blocker · التحذير=warning · الجاهزية=readiness · النشر=publish · التصدير=export · الاقتراح=suggestion · مستوى المخزون=stock level · متقادم=stale · التحويل=transform · النسخة المحلية=locale variant. Numbers Western per ledger row (ceilings, counts, confidence, character counts — a data surface, design-language-map §7); Arabic strings may run ~125% of English length — layout budgets for it (10) and the 11 matrix lists both strings verbatim (copy-voice §5).
