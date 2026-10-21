# 02 — User Research: seo-brief-builder

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (Q2 Arabic-practitioner guides, Q4/Q5 bilingual workflow sources); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Dalia, Bilingual Content Lead (primary)

**Role**: content lead at a GCC retail/e-commerce brand; owns a team of 4 (2 Arabic-first writers, 2 English-first) producing guides and category content for the same topics in both locales. Today she reconciles two keyword exports in spreadsheets, writes briefs in a docs template, and answers to marketing when one locale's page underperforms the other's.
**JTBD**: "When I commission a bilingual content set, I want both locales' briefs derived from clustered, intent-labeled keyword data with the gaps between them named up front, so I stop discovering after publication that the Arabic plan never covered the transactional intent the English plan did."
**Triggers**: a post-mortem where the English "best X" page converted and the Arabic equivalent didn't exist; an agency invoice for Arabic keyword research she suspects her own team could run; brief drift — writers ignoring briefs that no longer match the keyword sheet.
**Objections + responses**: "another SEO score to chase?" → the product ends at the brief (LOOP-10 exclusions are a feature); "my keyword tool is fine" → ingest what you already have (paste/import); "AI clustering will hallucinate clusters" → assist is draft-by-default, deterministic grouping is always available and always shown as provenance (P15 trust checkpoint).
**Onboarding motive**: bring one real bilingual topic, paste both keyword lists, see the parity check in the first 15 minutes.
**Verbatim (paraphrase, persona voice)**: "I don't need more data. I need the two languages to stop lying to each other."

## Persona 2 — Yousef, Agency SEO Strategist

**Role**: senior strategist at a 20-person digital agency serving MENA clients; delivers content plans and briefs as billable work product. Runs Arabic keyword research by hand (normalization find-and-replace, manual clustering) because the agency's platform licenses are Latin-first.
**JTBD**: "When I deliver a bilingual content plan, I want defensible clusters with intent labels and a parity report I can put my name on, so the deliverable takes hours instead of days and survives the client's questions."
**Triggers**: a client asking why the Arabic plan has half the English plan's coverage; margin compression on research hours; repeated re-work when an intern's clustering doesn't match his.
**Objections + responses**: "my methodology is mine" → clustering rules are inspectable and overridable, deterministic provenance is recorded per cluster; "clients won't pay for a new tool" → per-seat pricing amortizes into the deliverable's day rate; "will it leak client data to an AI capability?" → assist is abstract and consent-scoped (credential-contract §4/§9), manual mode touches nothing.
**Verbatim (paraphrase)**: "The clustering is the deliverable. Everything after it is formatting."

## Persona 3 — Huda, Senior Editor (Arabic-first)

**Role**: senior editor at a bilingual publisher; receives briefs from strategists, commissions writers, guards Arabic quality. Reads English keyword lists with effort; needs the Arabic side of any brief to be first-class, not a translation of the English side.
**JTBD**: "When I commission Arabic content, I want the brief's sections justified by Arabic search behavior — Arabic questions, Arabic terms, Arabic intent — so my writers aren't writing translated-English SEO."
**Triggers**: writers returning copy that answers English SERP questions in Arabic; dialect/MSA mismatches between brief terms and the publication's register (arabic-copy-studio adjacency — the writing register is that product's job, the brief's term list is ours); parity reports she can't read.
**Objections + responses**: "clustering tools mangle Arabic" → normalization is disclosed in-product and cluster membership is auditable keyword-by-keyword; "I don't trust machine intents" → every intent label is confirmable and keyword-level overrides exist.
**Verbatim (paraphrase)**: "Give me an Arabic brief that an Arabic searcher would recognize as written for them."

## Persona 4 — Marwan, Independent SEO Consultant (secondary)

**Role**: solo consultant rotating across small clients; needs fast, repeatable brief production without seat-heavy team pricing pressure.
**JTBD**: "When I take a new bilingual client, I want a brief workflow I can run solo in an afternoon, so research stops being the loss-leader of my retainer."
**Triggers**: scope creep from research hours; tool sprawl (he pays for a keyword-data suite already and refuses a second full platform).
**Objections + responses**: "seat pricing puns solo" → deterministic mode is unlimited; assist metering is the only consumption surface; "I already pay for keyword data" → the product ingests exports, sells no data of its own.

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Dalia | bilingual topic → paired, parity-checked briefs | weekly–biweekly | audit/governance value must be visible |
| Yousef | keyword export → defensible client deliverable | per-engagement | methodology ownership + defensibility |
| Huda | brief → commissioned Arabic content | per-issue | Arabic-first quality of clustering |
| Marwan | solo repeatable brief production | per-client | pricing + data he already owns |

## Voice derivation (SME-J)

Brief-builder voice: analyst-plain — declarative, evidence-forward, zero hype (copy-voice §1). States what the data shows and what it doesn't; parity gaps are named plainly ("no Arabic cluster answers the transactional intent 'تكلفة إنشاء متجر إلكتروني'"). Arabic UI copy is فصحى بيضاء, utility register. Fixed terminology (one concept, one term everywhere): الموضوع=topic · الكلمة المفتاحية=keyword · العنقود=cluster · نية البحث=search intent · مطابقة النوايا=intent parity · الموجز=brief. Numerals Western per ledger row (data surface). "Parity" is never translated loosely — مطابقة النوايا everywhere.
