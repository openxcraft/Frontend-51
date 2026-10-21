# 02 — User Research: store-performance-scorecard

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (S1/S7 comp conventions, S8 operations narrative, S3 KPI canon, S4 chain scale); zero invented verbatims — quotes are paraphrased persona voice, marked as such.

## Persona 1 — Khalid, Retail Performance Analyst (primary, daily user)

**Role**: performance analyst at a 40-store Saudi grocery chain (HQ Riyadh); owns the weekly store-performance review pack. Every Sunday he pulls the POS export, rebuilds the pivot by store, writes the YoY column, mentally excludes the two newest stores and one under renovation, and argues with regional managers about "the Ramadan weeks" in every quarter that touches them.
**JTBD**: "When I build the weekly store review, I want every store's delta computed like-for-like under rules I can show the room, so the meeting argues about performance instead of arguing about my spreadsheet."
**Triggers**: a regional manager rejecting a bottom-rank store because "the total includes the renovation week"; a quarter where week-matched YoY quietly compared pre-Ramadan to peak-Ramadan; the analyst-on-leave incident (a review ran with a new store inside the comp set).
**Objections + responses**: "my spreadsheet already does this" → it does the arithmetic, not the policy: comp eligibility, matched weeks, and composition disclosure are rules here, not memory (01 complaints); "another dashboard?" → not a dashboard — a comparison instrument with a published method (00); "our chain is too messy" → coverage marks and annotations exist precisely for messy chains (11).
**Onboarding motive**: import one real week of shift-level records and see the ranked board with the fairness rules attached, in the first session.
**Verbatim (paraphrase, persona voice)**: "Everyone trusts the ranking until they're bottom of it. Then they audit my exclusions. I want the exclusions to audit themselves."

## Persona 2 — Amna, Head of Retail Operations (economic buyer)

**Role**: retail-ops lead at the same chain; owns store standards, staffing budgets, and the P&L conversation with the commercial director. Reads the ranked board weekly, decides which stores get a standards visit, and defends staffing spend with performance evidence.
**JTBD**: "When I allocate attention across 40 stores, I want to know which stores genuinely underperform their like-for-like peers — by shift, not by total — so the fix lands on staffing, standards, or local demand and I stop guessing."
**Triggers**: a mall store "winning" on totals while its evening shift bleeds labor efficiency (the S8 narrative pattern, paraphrased); a staffing budget defense that needed per-labor-hour numbers nobody had; a consultancy scorecard engagement priced like a program (01 indirect class).
**Objections + responses**: "we have POS reports" → POS reports period totals; comparability policy and shift normalization are not modules there (01 competitor table); "my BI team can build it" → they can build the numbers, not the governed method — versioned policies and pinned definitions are the product (01); "sensors?" → none: this reads records you already export (00 exclusions).
**Verbatim (paraphrase)**: "Totals flatter the big stores and bury the small ones. I need the comparison that would survive a store manager reading it about their own store."

## Persona 3 — Faisal, Regional Manager (secondary, reader)

**Role**: regional manager for the Jeddah cluster; reads scorecards on tablet during store visits, drills the stores he owns, writes the context the HQ cannot see (renovation, roadworks, a competitor opening across the street).
**JTBD**: "When HQ ranks my stores, I want the context attached to the number and the drill that shows which shift slipped, so my defense is evidence, not anecdote."
**Triggers**: a bottom-decile rank caused by five renovation days inside the window (the incomplete-period mark, 11); an evening-shift slide he could see on the floor but not in the weekly PDF.
**Objections + responses**: "ranking shames stores" → flags carry text reasons and annotations are first-class (11 D); "I read Arabic first" → the board is bilingual, store names and copy both scripts (05 direction model).
**Verbatim (paraphrase)**: "Give me the number, the reason, and the shift — the floor already told me the story; I need the paper to agree."

## Persona 4 — Noura, BI/Data Owner (gatekeeper seat)

**Role**: the analytics-platform owner who receives every "can you build us a store scorecard" request; guards the POS export schedule; cares about definitions governance and audit trails more than ranks.
**JTBD**: "When the ops team asks for store comparisons, I want a tool with pinned formula versions and an activity log instead of another notebook SQL, so the numbers in the monthly review are traceable to the data and the method."
**Triggers**: two meetings where two different "YoY" definitions were used in the same deck; an ad-hoc scorecard built on a partial extract that ranked a store last for missing data (the coverage lie, 11).
**Objections + responses**: "this shadows our BI platform" → it binds your export channel or takes pasted records; definitions are versioned and exportable (07a state obligations); "import burden" → the channel is abstract and consent-scoped; paste always works (08 N1).
**Verbatim (paraphrase)**: "I don't need another source of truth. I need the one we have, compared honestly, with the method stamped on it."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Khalid | weekly POS export → defensible like-for-like ranked board | weekly | spreadsheet already "does this" |
| Amna | fair attention allocation + staffing defense across stores | weekly–monthly | POS reports already exist |
| Faisal | context + shift-level drill for his region | per-review | ranking without reasons |
| Noura | governed definitions + traceable method | per-cycle | BI-platform shadowing |

## Voice derivation (SME-J)

Scorecard voice: **floor-manager plain** — declarative, evidence-forward, retail-register English and فصحى بيضاء Arabic (copy-voice §1/§3). States the delta, the basis, and the reason; never editorializes performance ("lazy shift" is banned; "evening-shift sales per labor hour in the bottom decile of its peer group" is the register). Numbers are Western per the ledger row, rendered as signage-grade figures (05). Fixed terminology, one concept one term everywhere: المتجر=store · الوردية=shift · فئة الوردية=shift class · المقارنة المثل بالمثل=like-for-like comparison · مؤهل للمقارنة=comp-eligible · بطاقة الأداء=scorecard · مجموعة الأقران=peer group · نمط التشغيل=operating pattern · التغطية=coverage · نافذة الموسم=season window · حزمة التصدير=export pack. "Like-for-like" is never loosely translated — المقارنة المثل بالمثل everywhere.
