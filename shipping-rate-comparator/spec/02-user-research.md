# 02 — User Research: shipping-rate-comparator

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (negotiation-cycle sources [7][8][12], overcharge/invoice-variance sources [56][57][60][62], DIM-weight explainer demand [16]–[23], MENA context [50]–[55]); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Khalid, Shipping Manager (primary, economic buyer)

**Role**: shipping manager at a Riyadh-based D2C merchant (perfume + home goods, ~600 parcels/day in season, COD-heavy). Owns relationships with three courier channels, each with its own negotiated card: a domestic express card, a domestic economy card, and a GCC cross-border card. The cards live in three spreadsheets he maintains by hand; his renewal negotiation happens every year over email with PDFs and a calculator. He answers for the shipping line on the P&L and gets blindsided by invoice variance at month-end.
**Context**: Arabic-first reader, English-fluent working language; lives in a desktop console; his team is 3 ops specialists plus a finance analyst who audits courier invoices.
**JTBD**: "When I choose a courier for a shipment — or defend my spend at renewal — I want every card's zone table, weight break, divisor, and surcharge stack computed against the same box, so I stop discovering at invoice time what I could have known at decision time."
**Triggers**: a month-end invoice with re-attempt COD fees he never modeled; a bulky-light gift box that billed 12 kg volumetric when it weighed 1 kg (the DIM surprise, 01); a courier renewal email asking whether last year's 4% increase is fair.
**Objections + responses**: "my spreadsheet works" → paste-import turns that spreadsheet into a validated, versioned card in minutes (CP-1); "I already have a label platform" → this desk rates YOUR negotiated cards, needs no carrier connection, and stops before the label (00 exclusions); "arithmetic tools lie with hidden assumptions" → every quote renders its full chain — divisor, weights, zone, break, surcharges — nothing is a black box (P15-adjacent trust posture, applied to arithmetic instead of AI).
**Onboarding motive**: paste one real card, enter the standard box, see the three-weight settle and the cheapest card flip.
**Verbatim (paraphrase, persona voice)**: "The quote I trust is the one I can re-do with a calculator."

## Persona 2 — Noura, E-commerce Operations Specialist (daily user)

**Role**: ops specialist on Khalid's team; decides each morning which courier rides which destination batch. Works a paste-list of yesterday's destinations against the three cards, mentally applying "Riyadh is zone 2 on express, zone A on economy, but the economy card doesn't cover the Eastern Province at all" — per-card zone systems (01: zone structures vary by carrier [38]).
**JTBD**: "When I rate today's destinations, I want the batch pasted once and every destination resolved through every active card's own zones, so the morning routing takes ten minutes and names its own exceptions."
**Triggers**: a destination that silently falls outside a card's coverage and bills as a remote surcharge later; an urgent box whose dimensions push it into volumetric pricing on one card but not another (divisors differ — 01 [18]).
**Objections + responses**: "typing destinations twice is the real cost" → batch paste with per-row resolution and one honest no-coverage row per gap (CP-4); "I don't trust machines to match my city names" → matching is exact-after-normalization only, disclosed in-product, and the zone probe names what matched (07c rules; P11-adjacent recall for repeated destinations).
**Verbatim (paraphrase)**: "Give me the exceptions first — the routine parcels route themselves."

## Persona 3 — Hana, Finance / Procurement Analyst (secondary seat)

**Role**: analyst who audits courier invoices against quotes and prepares the renewal negotiation file. Consumes comparisons rather than authoring cards; needs the artifact that shows "card A was cheapest for our standard box at last year's terms, card B's renewal offer changes the break at 3 kg" — the weight-break shift that quietly reprices the modal parcel (01: weight breaks are where services stop being cheapest [40]).
**JTBD**: "When renewal season opens, I want pinned comparisons from before and after each proposed card change, so the negotiation runs on documented deltas instead of vibes."
**Triggers**: a renewal quote that lowers headline base prices but tightens the divisor (invisible without dim modeling); an invoice whose surcharge lines exist nowhere in the spreadsheet card.
**Objections + responses**: "I need it in my negotiation deck" → comparison export (markdown/CSV table with breakdowns) is a first-class artifact with an expiry and regeneration path (CP-5); "viewer seats shouldn't pay full price" → viewer role reads, runs comparisons, and exports but never mutates cards (07b session model).
**Verbatim (paraphrase)**: "A price change I can show is a negotiation; one I can't is a loss."

## Persona 4 — Adel, Solo Merchant Self-Shipping (secondary)

**Role**: runs a 15-orders-a-day specialty store from Jeddah; uses two couriers' apps; keeps both cards in his head and one Notes file. Not a spreadsheet power user — needs the calculator more than the library.
**JTBD**: "When a bulky order comes in, I want to know which courier charges it by the scale and which by the box, so I stop eating volumetric surprises on oversized perfume gift sets."
**Triggers**: a birthday-box order billed at triple the expected rate (DIM weight); comparing a new courier's pitch against his current card.
**Objections + responses**: "team tools overcharge solo" → free-forever solo tier (12 Q-3), comparisons unmetered; "I don't know my divisor" → the card editor explains each field with its real-world meaning and the calculator shows the arithmetic live (CP-3).
**Verbatim (paraphrase)**: "I don't need a logistics platform. I need the number before I promise the customer a number."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Khalid | negotiated cards → auditable quote desk | per card change + renewal cycle | trust in visible arithmetic |
| Noura | destination batch → per-card cheapest + exceptions | daily | data-entry cost; matching trust |
| Hana | comparison history → negotiation evidence file | per renewal + invoice audit | export artifact quality |
| Adel | one box → honest number before promising | per oversized order | pricing + complexity fear |

## Voice derivation (SME-J)

Rate-desk voice: arithmetician-plain — states the number, then the chain that produced it; never haggles, never hypes (copy-voice §1). Every figure is a fact with a derivation; surprises are named, not softened. Arabic UI copy is فصحى بيضاء, utility register. Fixed terminology (one concept, one term, everywhere — the product glossary): بطاقة الأسعار=rate card · منطقة=zone · شريحة الوزن=weight break · الوزن الفعلي=actual weight · الوزن الحجمي=volumetric weight · الوزن القابل للشحن=chargeable weight · القاسم=divisor · عرض السعر=quote · المقارنة=comparison · الرسوم الإضافية=surcharges · مواصفة الشحنة=shipment profile · الوجهة=destination · الدفعة=batch. "Quote" is never loosely translated (عرض السعر everywhere; تسعير never appears as a noun for quote). Numerals Western per ledger row (data surface; rtl-rules §3). Surcharges copy always names the rule, not just the amount ("رسم الوقود الإضافي 12.5% على الأساس" style — the rule IS the copy).
