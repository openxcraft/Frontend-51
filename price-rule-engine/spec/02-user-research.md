# 02 — User Research: price-rule-engine

SME-B pass · Paraphrased sentiment only, marked (paraphrase) — zero verbatim quotes; personas synthesized from the research digest's practitioner sources (research/batch7/price-rule-engine-q1…q14) and portfolio-adjacent buyer patterns (catalog scale bands cross-referenced from marketplace-listing-sync's on-disk research, B7-4). Personas use regional names; no real individuals are represented. Team-size and SKU-count figures are desk-research bands from category norms (digest §B, honest gap 2), not survey data.

## Persona 1 — Layla, Pricing Lead (primary buyer + daily user)

**Role**: commercial pricing lead at a Riyadh-based D2C home-goods brand selling ~900 SKUs across their own storefront, one regional bilingual marketplace, and one global marketplace's regional site; two markets (KSA 15% VAT, UAE 5% VAT). She owns the price file: when supplier costs move — freight rates, duty changes, a vendor's annual increase — she reworks the price sheet in a spreadsheet, checks a few rows by hand, and defends the result in the Monday commercial meeting.
**JTBD**: "When supplier costs change, I want to re-price by rule against our landed costs and see the margin consequence before anyone commits, so the Monday meeting argues about strategy, not about whether my formula was right."
**Triggers**: a vendor cost increase landing as a PDF while the price sheet still carries last quarter's costs (the delayed-response erosion class, digest [53]); a Ramadan markdown plan that needs to be scoped to categories with start/end dates; discovering a SKU selling below floor after a "quick discount" someone applied months ago.
**Objections + responses**: "We already track competitor prices" → this product doesn't and says why: the legal ground under scraping is unsettled (01) and the internal cost truth is what she can defend; competitor data is her market context, not her price authority. "Is this a repricer?" → no: nothing executes at v1; the deliverable is an approved price sheet, by roster decision with competition-law grounding (01). "Will the simulator lie to me with averages?" → every row shows its own formula trace; blended margin is labeled catalog-weighted with no sales data (honesty posture, 00).
**Pains**: spreadsheet formulas that break silently when a row is inserted; no cost history — she cannot say what a SKU's landed cost was when its price was set; VAT-inclusive display mismatches surfacing as customer complaints (digest [31]); markdowns that outlive their season because nothing expires them.

## Persona 2 — Faisal, Finance Reviewer (the approval gate)

**Role**: finance manager at the same company; the person who must be able to answer "why did this price change, and who approved it?" He reviews price proposals line by line — today, in a meeting with a projector.
**JTBD**: "When a price proposal reaches me, I want every row's cost, floor status, and margin delta in one review surface, so I approve in twenty minutes and my audit trail is the artifact itself."
**Triggers**: proposals that arrive as a spreadsheet with no derivation; floor breaches nobody noticed; seasonal markdowns that were never un-applied and now sit in the P&L as permanent discounts.
**Objections + responses**: "Another tool between me and the numbers?" → the proposal review surface is read-mostly: rows, deltas, exclusions with reasons, one gate; no rule authoring required of him (07b role 'approver'). "Who is the system to say a price is wrong?" → it doesn't: it clamps at the floor the workspace set and states the clamp; judgment stays human (00). "What if costs in the system are stale?" → cost records are effective-dated and the simulation states which cost snapshot it used; a proposal from a stale snapshot is visible as such (07a).
**Pains**: no audit trail tying a price change to a person and a reason; re-deriving margin math by calculator during meetings; the markup-vs-margin confusion in legacy sheets (digest [17] — the named retailer error).

## Persona 3 — Noura, Category Manager (rule scoping)

**Role**: category manager for kitchen and home textiles; she scopes promotions and pricing moves to her categories and hands a request to Layla — today, as a message with a screenshot of a competitor's product page (market context, not data).
**JTBD**: "When I want my category's prices moved for a season or a cost swing, I want to scope the rule myself and simulate it on my category only, so I hand Layla a preview, not a request."
**Triggers**: Ramadan and White Friday planning windows (digest [37]); new collection intake with different cost structure; slow movers she wants to mark down by a bounded percentage.
**Objections + responses**: "I don't write formulas" → rule authoring is condition + action pickers with the deterministic formula rendered in plain arithmetic beside them (03 CP-2); no expression syntax to learn. "What if I get it wrong?" → simulation is read-only; a wrong rule costs a re-run, never a price (00). "Can I see only my categories?" → catalog and simulation rows filter by category scope (04).
**Pains**: requesting price work through people; markdown requests specified in words ("let's make it feel cheaper") that lose their meaning in translation to a formula.

## Persona 4 — Salem, Founder/Commercial Manager (viewer)

**Role**: founder who reads margin previews on his phone during supplier meetings and asks the one question that matters: "if we accept this cost increase, what happens to blended margin?"
**JTBD**: "When I'm negotiating with a supplier, I want the margin consequence of a hypothetical cost level in a minute, so I negotiate with numbers instead of hope."
**Triggers**: supplier meetings; monthly margin reviews; deciding whether a market's prices need a move after a VAT or duty change.
**Objections + responses**: "I don't want a seat that edits" → viewer seat: read simulations, proposals, and the margin preview; zero mutations (07b role 'viewer'). "Just tell me the number" → the summary header is the number — blended margin before/after, catalog-weighted, labeled (00); the rows are there when he wants to check one. "Will this replace Layla?" → it replaces her spreadsheet, not her judgment (00 non-AI).
**Pains**: waiting a day for the analyst answer while the supplier waits an hour; numbers that arrive without derivation he can trust.

## JTBD summary

| Persona | Core job | Frequency | Primary objection → answer |
|---|---|---|---|
| Layla | cost change → rule-based re-price w/ margin preview | per cost event + weekly reviews | "we track competitors" → inward truth, legal grounding |
| Faisal | price proposal → audited approval | per proposal (weekly-ish) | "another tool?" → read-mostly review + the gate |
| Noura | seasonal/cost intent → scoped rule + preview | per season / per collection | "I don't write formulas" → pickers + rendered arithmetic |
| Salem | supplier negotiation → margin consequence now | ad-hoc, mobile read | "just the number" → summary header, labeled honestly |

## Voice derivation (SME-J)

Pricing-desk voice: **numerical, unhurried, derivation-forward** — states the arithmetic and its inputs, never editorializes about whether a price is "aggressive" or "smart" ("Floor clamped: rule price 84.50, floor 96.14 — proposed 96.14"). Arabic register فصحى بيضاء (utility precision surface); English professional-neutral, contractions off (governance-adjacent commerce family). Fixed terminology (locked in 07a/11; one concept, one term, everywhere — copy-voice §3): قاعدة التسعير=pricing rule · الكتالوج=catalog · صنف=catalog item · التكلفة المتجلبة=landed cost · الحد الأدنى (أرضية التكلفة)=cost floor · المحاكاة=simulation · معاينة الهامش=margin preview · المقترح السعري=price proposal · الاعتماد=approval · تصدير=export · السوق=market (KSA/UAE) · القناة=channel · هامش الربح=gross margin · الفئة=category · سجل النشاط=activity log. Numbers Western per ledger row (prices, margins, counts — a finance surface, design-language-map §7); currency amounts render with Western digits and the market currency code (SAR/AED), bidi-isolated inside Arabic strings (rtl-rules §2). Arabic strings may run ~125% of English length — layout budgets for it (10) and the 11 matrix lists both strings verbatim (copy-voice §5). The word "repricer" (مُعيد التسعير) never appears in product copy — the product is not one (LOOP-10), and the voice says what it is instead: محرّك قواعد التسعير (pricing rule engine).
