# 02 — User Research: survey-insight-miner

SME-B pass · Paraphrased sentiment only, marked (paraphrase) — zero verbatim quotes except research-file quotes explicitly attributed; personas synthesized from the research digest's practitioner sources (research/batch10/survey-insight-miner-q1…q14) and portfolio-adjacent buyer patterns. Personas use regional names; no real individuals are represented.

## Persona 1 — Mariam, Insights & Research Lead (primary buyer)

**Role**: runs a 5-person research pod inside a Riyadh consumer-super-app (food delivery, payments, subscriptions). She fields quarterly CSAT/NPS waves plus ad-hoc UX surveys through the company's collection platform; every wave ends with ~1,200 open-ended answers in Arabic (Gulf dialect heavy), ~8% English or mixed, and a reporting deadline ten days out. She owns the methodology defense when a stakeholder asks "who coded these, and how?"
**JTBD**: "When a fielding wave closes, I want the open-ends turned into a named bilingual theme set with quotes and coverage in days instead of analyst-weeks, so my report stands behind its numbers and my pod stops burning billable hours on a spreadsheet."
**Triggers**: a client-facing debrief where a theme count was challenged and the coding trail lived in one analyst's head; a wave where the team simply skipped the Arabic open-ends and reported only the closed scores (paraphrase of the skip-the-text folklore, 01 honest gap); an agency coding line-item quoted in analyst-days (01 q13 manual-coding arithmetic).
**Objections + responses**: "We already have a survey platform" → collection platforms gate a text summary behind the collection plan (01 q9); the analysis workspace is a different purchase that starts at the export. "Will reviewers accept AI themes?" → proposals are confirm-gated one by one with engine provenance on every theme; the keyword floor is deterministic and disclosed (07c). "Another seat bill?" → analyst seats priced, associates cheap, stakeholders free (12 Q-3).
**Pains**: theme names authored in one language and translated at report time (the bilingual naming is an afterthought everywhere she has worked); coding speed versus audit trail as a zero-sum choice; nobody can reproduce last quarter's theme set when the analyst who made it is on leave.

## Persona 2 — Khalid, Senior Research Analyst (primary daily user)

**Role**: 9 years in quantitative-plus-qual research; codes open-ends today in a spreadsheet column beside the verbatims, with a personal macro for counts, and has tried a CAQDAS license twice and abandoned it for survey work (transcript-era machinery — paraphrase of the QDA-class posture, 01 q6). He wants speed without losing the ability to defend every grouping.
**JTBD**: "When I open a 300-response question, I want the clustering already grouped, my job being to rename, merge, and assign the strays — so my craft lands on judgment calls, not on copy-paste."
**Triggers**: a 500-response wave at 2–5 minutes per response (01 q13 — the arithmetic that eats his week); re-coding because a client renamed a category after the fact; dialect responses his tools normalized into gibberish (Arabic NLP evidence, 01 q8).
**Objections + responses**: "Keyword grouping will produce garbage buckets" → the floor is a starting grid, not the deliverable: he confirms, merges, renames, and assigns — and the coverage panel says what remains unassigned; thresholds are disclosed and per-question configurable (07c). "I don't trust a model's clusters" → nothing auto-applies; proposals carry confidence bands and pass his gate (P15). "Keyboard or I won't use it" → full traversal map (09), no raw-letter shortcuts.
**Pains**: reading dialect responses mixed into MSA without knowing which is which until the third re-read; overlap honesty — his spreadsheet counts force single codes per response and quietly lie about multi-theme responses; quote hunting at report time (scrolling for "a good verbatim" the night before the debrief).

## Persona 3 — Dana, Bilingual Research Associate (the craft seat)

**Role**: MA in applied linguistics; reads Arabic verbatims natively (MSA + Gulf), drafts theme names that a C-suite stakeholder and an English-speaking product manager can both parse, and writes the one-line theme definitions that make a report credible. She is the person the theme-naming phase (Braun & Clarke phases 5 — defining and naming, 01 q7) actually belongs to.
**JTBD**: "When a theme lands on my desk as 'keyword: التوصيل', I want to read its member responses and quotes, rename it bilingually with a definition, and pin the verbatim that best carries it — so the report reads like research, not like a word cloud."
**Triggers**: theme labels that are keywords rather than names (the floor's honest output — her job is the craft on top); English-only theme names in past reports that failed the Arabic-reading exec; a quote in the deck that turned out to be truncated out of context.
**Objections + responses**: "The machine will flatten dialect into فصحى" → detection is disclosed per response and never normalizes the verbatim — dialect stays dialect in every quote (07c rule 1; ai-native-patterns §7). "Pin, merge, rename — how much is manual?" → that IS the product: deterministic selection proposes, she disposes (quotes by rule with pinning; merges with counts named). "Tashkeel and long words break layouts" → rtl-rules §3/§4 obligations carried in 05/09.
**Pains**: bilingual authoring in two fields that never talk to each other; theme definitions living in slide notes; being the last line of defense before a mislabeled theme reaches a client.

## Persona 4 — Faisal, Stakeholder Viewer (report reader)

**Role**: product director who reads two theme reports a quarter; never codes, never should. He wants the three themes that matter, the quotes that prove them, and the share numbers — in the language he is reading the deck in.
**JTBD**: "When Mariam's wave lands, I want to open the theme board read-only, see counts and quotes per theme, and slice by city for my region — without asking anyone to export anything."
**Triggers**: reports delivered as PDFs he cannot slice; theme counts that changed definition between waves without a note; quotes he could not verify against the data.
**Objections + responses**: "Why do I need a tool to read a report?" → the read-only board is the sliceable report: crosstab by metadata, quotes in place, coverage stated (04 S6). "The numbers disagree with the deck" → exports pin the theme-set version they came from (07a versioning); nothing silent.
**Pains**: waiting on an analyst for a one-number question; not knowing whether "31% shipping complaints" means 31% of responses or of assigned responses.

## JTBD summary

| Persona | Core job | Frequency | Primary objection → answer |
|---|---|---|---|
| Mariam | fielded survey → defensible bilingual theme set w/ quotes + coverage | per wave (weekly–quarterly) | "AI themes won't survive review" → confirm gate + provenance |
| Khalid | response wall → curated themes fast | daily during a wave | "keyword buckets = garbage" → floor is a grid, curation is the job |
| Dana | keyword grid → named, defined, quoted themes | per wave (deep sessions) | "dialect gets flattened" → disclosed detection, verbatim preserved |
| Faisal | theme set → decisions, slices, quotes | per report | "just send a PDF" → read-only board is the sliceable report |

## Objection → response matrix (buyer-level)

| Objection | Response (evidence-grounded) |
|---|---|
| "Our survey platform already does text analysis" | Platform modules are plan-gated summaries with no confirm gate, no quote evidence, no engine disclosure (01 q9); the research deliverable needs an analysis workspace, not a summary feature |
| "CAQDAS does this" | CAQDAS is interview-transcript machinery — a 300–1,200-row survey column in NVivo still hand-groups; no quotes-by-rule, no coverage/overlap accounting, no survey metadata crosstab (01 q6) |
| "Just use an AI chat" | No persistence, no reproducible run, no theme lifecycle — re-paste, re-prompt, different themes (01 indirect); a research deliverable must be reproducible by construction |
| "Arabic clustering isn't good enough yet" | The literature agrees (01 q8/q14) — which is exactly why the deterministic floor with disclosed detection is the product's spine, and why model proposals are confirm-gated with confidence bands |
| "Pricing will look like the VoC platforms" | Deliberately not: per-seat workspace band, viewers free, keyword floor unlimited, model runs metered within a generous window (12 Q-3) |

## Voice derivation (SME-J)

Research-desk voice: **measured, evidence-first, bilingual by reflex** — states what the engine found, what it disclosed, and what the human decided; never editorializes about respondents ("Theme 'الشحن والتوصيل' — 93 responses, 31% of assigned; keyword grouping; 3 quotes by rule; confirmed by Khalid"). Arabic register فصحى بيضاء (utility precision surface); English professional-neutral, contractions off (governance-adjacent analytics family). Fixed terminology (locked in 07a/11; one concept, one term, everywhere — copy-voice §3): مشروع=project · سؤال=open-ended question (سؤال مفتوح) · استجابة=response · محور=theme · تجميع=clustering · تجميع بحسب تكرار الكلمات=keyword-frequency grouping · اقتباس=quote · تثبيت=pin · تغطية=coverage · جدول متقاطع=crosstab · ترميز=coding · تعيين=assign · دمج=merge · اعتماد=confirm · اكتشاف اللغة=language detection · نبرة=tone · لهجة=dialect · فصحى=MSA · تصدير=export · تشغيل=run. Numbers Western per ledger row (counts, shares, response totals — a data surface, design-language-map §7); Arabic strings may run ~125% of English length — layout budgets for it (10) and the 11 matrix lists both strings verbatim (copy-voice §5).
