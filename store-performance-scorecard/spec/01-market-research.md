# 01 — Market Research: store-performance-scorecard

SME-A pass · Raw results in research/batch10/store-performance-scorecard-q*.json (retrieved 2026-10-17 via agent-browser direct fetches; the z-ai search API was 429-rate-limited and search engines bot-challenged — environment honestly recorded in the research digest). Zero invented statistics; unverified figures marked. Sentiment items are paraphrased patterns, marked as such.

## Category overview

Three currents collide here. **POS-suite reporting** (Lightspeed, Square for Retail, Shopify POS, LS Retail, KORONA class): every multi-location POS ships period-over-period sales reporting bundled at its tiers, with advanced reporting gated upward (S2: Lightspeed's "Advanced sales, staff and inventory reports" sit on the Plus tier; multi-location pricing is custom-quote). The reporting is chain-flat — period totals by store, maybe by register or staff — with no comp-method policy, no week-matched YoY construct, no shift-level normalization. **In-store analytics platforms** (RetailNext class, S5/S8): traffic sensors plus analytics that normalize sales against traffic ("conversion at each location"), align staffing to demand, and benchmark stores against each other — genuinely close to the job, but platform-shaped: hardware-adjacent sensing, enterprise rollout, AI-branded querying (Pulse AI), and priced as a program, not a seat. **The spreadsheet incumbent**: the weekly POS export pivoted by store with a YoY column, rebuilt by hand, adjusted by memory ("skip the new store, Ramadan was different last year") — the true mass-market state and the one every persona in 02 describes. The wedge this product occupies: the like-for-like discipline (S1/S7 conventions) and the shift-aware normalization instinct (S8) exist in the world as *practice*; nothing retrieved productizes them together as an inspectable, deterministic store scorecard.

## Direct competitors (6)

| Competitor | Class | Proof | Signal | Gap we exploit |
|---|---|---|---|---|
| RetailNext | in-store analytics platform (traffic + performance) | retailnext.net (S5, S8) | Closest to the job: cross-store visibility, underperformer identification, traffic-normalized conversion, staffing alignment | Sensor/platform posture and AI querying; no comp-method policy, no shift-class grammar, no versioned LFL basis; enterprise program, not an analyst's seat |
| LS Retail | unified-commerce POS + reporting suite | lsretail.com (S11) | Enterprise multi-format chains (retail, pharmacy, gas stations) run reporting inside the POS backbone | Reporting is a module of the commerce suite — no standalone LFL scorecard construct; weight and cost of a suite for the performance question |
| Lightspeed Retail | multi-location retail POS with tiered reporting | lightspeedhq.com/pos/retail/pricing/ (S2) | $89/$149/$289 per-register ladder; advanced reports gated to Plus; multi-location custom-quote | Period reporting only; no comp eligibility concept; per-register pricing taxes the analysis seat |
| Square for Retail | multi-location retail POS | squareup.com/us/en/point-of-sale/retail (S10) | Real-time cross-location inventory + sales reporting inside the POS tier | Chain-flat reporting; no like-for-like policy; no shift normalization beyond register/staff cuts |
| Shopify POS | commerce-platform POS with multi-store tiers | shopify.com/pos (S9) | Explicit "Multi-store POS" positioning with analytics bundled | Platform lock-in posture: analytics sells the commerce suite; store-comparison methodology is not a product surface |
| KORONA POS | POS + KPI reporting for multi-store/franchise | koronapos.com/blog/retail-metrics-kpis/ (S3) | Publishes the exact KPI canon our scorecard draws from; "Franchise & Multi-Store" CRM inside the POS | KPIs without a comparison methodology: no comp policy, no matched-week YoY, no shift classes; English-first |

[1] https://www.retailnext.net/ · [2] https://www.retailnext.net/solutions/store-operations · [3] https://www.lsretail.com/ · [4] https://www.lightspeedhq.com/pos/retail/pricing/ · [5] https://squareup.com/us/en/point-of-sale/retail · [6] https://www.shopify.com/pos · [7] https://koronapos.com/blog/retail-metrics-kpis/

## Indirect competitors (4)

- **Spreadsheet status quo** (the pivot-table scorecard): free, flexible, already owned — and the incumbent that misleads by memory (the analyst "knows" which stores to exclude; the Ramadan adjustment is folklore, not policy). Our comp policy, matched-week YoY, and composition disclosure are this workflow, made inspectable. No URL — it is the buyer's own hard drive; the pattern is attested by every persona source pattern in 02.
- **KPI dashboard tools** (Klipfolio class, S6 [8]): spreadsheet-to-dashboard automation, 25,000+ customers, 200+ connectors — proves buyers pay to escape hand-built reporting. But dashboards visualize; they do not decide comparability. No comp-method concept, no shift-class normalization, no eligibility transparency.
- **Retail-execution / store-audit apps** (store-checklist class): adjacency, not competitor — they score *visit compliance* (checklist completion), not like-for-like trading performance. (Not retrieved this pass — no verified URL recorded; named as a class, honestly.)
- **BI suites / data teams** (enterprise business-intelligence platforms): the SQL-and-dashboard route mid-size chains grow into; a governed definitions surface is exactly what a BI build struggles to give a retail-ops buyer at seat price. Generic class, no vendor named.

[8] https://www.klipfolio.com/

## Market & demand evidence (with sources)

- **The comparison discipline is a named, published convention**: same-store/comps methodology documented in detail — two methods, weekly-vs-monthly cadence split between operations and finance, 13-month MoM trading requirement (S1 [9]); the ≥12-month "at least one year" eligibility convention and the calculation recipe from the investor-relations side (S7 [10]).
- **The buyer job is named at vendor level**: "identify underperformers, benchmark best practices, and act before the numbers slip" across "dozens or hundreds of locations simultaneously" (S8 [2]); "align staffing with real customer demand, reduce wasted labor hours" — the shift-aware instinct, stated as an operations-team job.
- **Normalization as honesty is vendor-marketed**: "Traffic-normalized conversion metrics reveal what raw sales figures hide" (S8 [2]) — the exact argument this product generalizes to open-hours and labor-hours normalization.
- **MENA chain scale is real**: a Dubai-headquartered retail & hospitality group with ~2,400 locations, US$7B revenue (2016), 55,000+ employees (S4 [11]) — the multi-store chain class at regional scale.
- **Category spend is real**: POS-suite reporting ladders clear $89–289 per register/month with reporting gated upward (S2 [4]); dashboard tooling monetizes the escape from spreadsheet reporting at 25,000+ customers (S6 [8]).
- **The KPI canon is public and stable**: the practitioner list (YoY growth, sales per square foot, ATV, labor cost %, conversion, shrinkage, GMROI, sell-through — S3 [7]) — our scorecard's KPI set is drawn from it, with the two hardware-dependent members (traffic, shrinkage) treated as optional imported data.

[9] https://en.wikipedia.org/wiki/Same-store_sales · [10] https://www.fool.com/terms/s/same-store-sales/ · [11] https://en.wikipedia.org/wiki/Landmark_Group

## Pricing landscape

Verified this pass: Lightspeed Retail at $89/$149/$289 per register/month (S2, official pricing page; multi-location custom-quote). Klipfolio, Square, Shopify, LS Retail pricing pages were not numerically captured (fetch limitations recorded in the digest) — their tiers exist but figures here would be invention. **No standalone store-scorecard pricing was retrievable anywhere — an honest gap.** Our posture (12 Q-9): per-seat analyst pricing in the band the category already pays, plus a chain-scale factor (store-count band), with unlimited manual imports — the paste path is never metered (the LOOP-5 floor). Any specific price point in this spec would carry an **unverified estimate** mark and none is offered.

## Positioning statement

For retail chains in MENA, store-performance-scorecard is the store scorecard that compares fairly: every store's performance measured like-for-like against the same matched weeks of the prior year, under a comp policy that says out loud what is excluded and why; every KPI normalized to the shift class the trading actually happened in, so a three-shift mall store and a one-shift community store are never ranked against each other's ghosts; and every comparison window carrying its season-composition disclosure, so Ramadan never silently misleads a week-matched read. Unlike POS-suite reporting, it is not a module under a register bill; unlike sensor platforms, it sells no hardware and no black box — the formulas, weights, and eligibility rules are a published surface, and the deliverable is an exportable, reproducible scorecard pack.

## Complaints mined (paraphrased patterns)

- POS-suite reporting users (S2/S5 pattern, paraphrased): period totals hide more than they show — "up 3%" means nothing when the new store is inside the number and last year's Ramadan was in the base.
- Analyst sentiment (02 persona evidence pattern, paraphrased): the weekly comparison is rebuilt by hand and defended by memory — the exclusions live in one person's head, and when that person is on leave the review runs raw.
- Operations-lead sentiment (S8 narrative, paraphrased): over/under-performance arguments stall on fairness — the mall store always "wins" the total, the staffing question drowns in averages.

## Market size (honest)

Multi-store retail chains in MENA (grocery, pharmacy, F&B, specialty) plus the consultancies serving them — a mid-funnel slice of retail software spend already paying per-register POS reporting and enterprise analytics programs. No auditable MENA-specific TAM figure exists in the retrieved corpus; any number would be invented, so none is offered. Envelope: per-seat SaaS with a store-count band — the same shape the category pays, minus the register tax.
