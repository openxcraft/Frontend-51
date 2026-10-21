# 02 — User Research: sales-cohort-view

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (vendor grid conventions S1–S3, storefront metric baseline S12, season mathematics S7/S11/S13, commerce-analytics pricing S5); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Nadia, Revenue Operations Lead (primary, economic buyer)

**Role**: revenue-ops lead at Qamar Retail, a Riyadh-headquartered omnichannel retailer (home goods and small electronics) selling through its own storefront and marketplaces in KSA and UAE. Owns the repeat-purchase-rate and customer-revenue KPI lines; presents the quarterly customer review to the commercial director with a cohort chart she rebuilt by hand from the analyst's spreadsheet export.
**Context**: works in English, reads Arabic fluently; her quarterly deck's most contested slide is "are we getting better at keeping customers" — and last year the same slide was quietly incomparable because Ramadan moved eleven days.
**Goals**: one reproducible cohort grid instead of a rebuilt spreadsheet each quarter; a defensible answer to "did last Ramadan's customers retain like the year before"; an evidence artifact she can attach to the board pack without a screenshot of a pivot table.
**Frustrations**: the analyst's grid and her deck drift apart; every season alignment argument is verbal ("trust me, compare Ramadan to Ramadan") with nothing in the artifact that shows the alignment; the CRM team and the BI team each say the cohort grid is the other's job.
**Quote (paraphrase, persona voice)**: "Every quarter I rebuild the same grid. Every year Ramadan moves. Nobody's slide deck has ever said which of those two facts it is correcting."
**Objections + responses**: "isn't this just a filtered report?" → the grid is the artifact, not a filter: acquisition cohorts, published arithmetic, season-anchored comparison, reproducible snapshot (03/07); "our BI stack could build this" → it could, as a project — this is a product: the season calendar, drift disclosure, and suppression honesty are already decided (07c §2).

## Persona 2 — Faisal, Retention Analyst (daily user)

**Role**: the analyst who has hand-built the cohort grid for two years: SQL against the commerce warehouse, CSV into a spreadsheet, pivot by acquisition month, conditional formatting, a manual "Ramadan adjustment" column that shifts which months he compares, and a slide export.
**Context**: Arabic-first, works bilingually; the season names he thinks in are Arabic (رمضان، الجمعة البيضاء، العيد) while his SQL and column headers are English — the product's bilingual surface is his actual working posture, not a nicety.
**Goals**: kill the quarterly rebuild; anchor cohorts to seasons without hand-maintaining a date table; drill a cell to customers without writing another query; trust the small cohorts he currently eyeballs ("N=8, don't quote that").
**Frustrations**: the Ramadan drift means his "March" columns mean different retail moments in different years; the ±1-day moon-sighting variance he handles by rounding; his suppression judgment is invisible to the people who read his chart.
**Quote (paraphrase)**: "I compare Ramadan to Ramadan and I spend a paragraph in the deck defending the dates. The tool should carry that paragraph for me."
**Objections + responses**: "I already have the SQL" → the SQL stays his; the product's value is the calendar, the alignment, the disclosure, and the reproducible snapshot his SQL doesn't produce (07a state obligations); "will it fight my definitions?" → the definitions surface shows every formula and the ruleset version each grid ran under (S7); he can audit it against his own numbers.

## Persona 3 — Mariam, Commercial Director (reader, budget holder)

**Role**: the commercial director who reads the season story and allocates the next season's retention budget. Doesn't query anything; reads comparisons and asks the second question.
**Context**: Arabic-first reader; wants the season narrative in Arabic chrome when she flips the workspace locale; distrusts charts whose axes she can't see the construction of.
**Goals**: "did the Ramadan customers we acquired this year behave like last year's, better, or worse — and is that a real difference or a small-sample story?"; one comparison view she can read without the analyst in the room.
**Frustrations**: analyst charts that hide sample sizes; being shown "March vs March" and later told it wasn't comparable; not knowing which cohorts are season-tainted before she quotes them in a budget meeting.
**Quote (paraphrase)**: "Show me Ramadan against Ramadan, tell me how many customers are behind each number, and mark the ones too small to argue from."
**Objections + responses**: "another dashboard?" → no dashboard: one grid, one comparison surface, and an export — the product refuses the widget wall (04 IA rationale); "I don't read English charts" → bilingual-en with Arabic as full citizen: her locale flip re-renders chrome and copy; season names she reads are the Arabic ones the workspace authored (05 direction model).

## Persona 4 — Sami, BI / Data Engineer (source owner, secondary)

**Role**: owns the commerce data estate — the storefront, the marketplace feeds, the warehouse. Gets the ad-hoc cohort request every quarter and each time it's slightly different.
**Context**: English-first, technical; cares about query scope, freshness honesty, and not becoming the on-call for an analytics tool.
**Goals**: bind the source once, declare the coverage window, let the grid compute; freshness visible to the reader (stale data should shame the pipeline, not the analyst); an imported-sample path so the team stops asking him for one-off extracts.
**Frustrations**: "cohort" meaning a different thing in every request; tools that cache silently and present stale numbers as current; being asked to "just also add the seasons" to a warehouse table nobody maintains.
**Quote (paraphrase)**: "Give me one contract for what a cohort is, show the freshness on every grid, and stop asking me for Ramadan dates."
**Objections + responses**: "this duplicates the warehouse" → the product stores no orders and runs no pipeline: it computes over the bound source's declared coverage and shows freshness everywhere (07b rules; 08 N1); "season windows will rot" → windows are versioned workspace data with drift disclosure and an owner-reviewable calendar surface (03 CP-3), not a hidden constant.

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Nadia | quarterly customer review backed by a reproducible cohort artifact | quarterly | "isn't this just a filtered report?" |
| Faisal | season-anchored cohort grids without the hand-built date table | weekly–quarterly | "I already have the SQL" |
| Mariam | read the season story, allocate retention budget | quarterly | "another dashboard?" |
| Sami | one binding, honest freshness, no ad-hoc cohort requests | setup + on incidents | "this duplicates the warehouse" |

## Voice derivation (SME-J)

sales-cohort-view voice: **analyst-plain, numbers-forward** — states the arithmetic and its limits in the same breath (copy-voice §1: say the true thing, briefly). Every rate names its denominator; every comparison names its composition; every small cohort is flagged before it is quoted. Arabic UI copy is فصحى بيضاء utility register. Fixed terminology (one concept, one term, everywhere — the glossary is also a LOOP-3 instrument, see 12 Q-4): **الفوج = cohort** (a revenue acquisition group — deliberately NOT the event-space term the growth family uses), **شبكة الفوج = cohort grid**, **نافذة الموسم = season window**, **تراكب المواسم = season overlay**, **التوافق مع الموسم = season alignment**, **تركيبة المواسم = season composition**, **الاكتساب = acquisition**, **الشراء المتكرر = repeat purchase**, **الإيراد = revenue**, **الفترة = period**, **السوق = market**, **العميل = customer**, **الطلب = order**, **حزمة الأدلة = evidence pack**. Numerals Western per ledger row (data surface — rtl-rules §3). The product deliberately says "repeat purchase," not "retention": the return event here is a purchase, and the vocabulary says so (the vendor convention "retention grid" is mapped, not adopted — S2).
