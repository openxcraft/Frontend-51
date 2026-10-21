# 02 — User Research: customs-tariff-lookup

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (misclassification-pain practitioner sources, bilingual-documentation requirements, government-portal behavior, ruling-database practice); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Noura, Trade Compliance Specialist (primary)

**Role**: trade-compliance lead at a Riyadh food-products importer (180 SKUs, mixed container imports from Brazil, Turkey, and India). She owns the classification file: every product line's HS code, its duty reference, and the paper trail that answers a customs query. Arabic-first reader (the national schedule's Arabic side is her working text), English correspondent (brokers, suppliers, and auditors email in English).
**Context**: today she flips between the national authority's tariff inquiry portal, a saved PDF of the schedule, an email folder titled "rulings", and a spreadsheet of "our codes" maintained by hand. When the December 2025 schedule amendment landed (01 [9]), her spreadsheet quietly went stale on three lines and nobody noticed for a month.
**Goals**: reach the right tariff line from an Arabic goods description without translating it first; attach the ruling she is going to cite before the query comes; know when an edition change touches one of her lines; hand the broker an evidence pack, not an email chain.
**Frustrations**: portal keyword search returns 60 undifferentiated hits for "جبن" (cheese); the portal's Arabic and English sides never render together; her saved rulings reference codes by edition and she can no longer tell which edition a number came from; every re-check of the spreadsheet is manual.
**Quote (paraphrase, persona voice)**: "I don't need the portal to guess my code. I need it to remember mine."
**Onboarding motive**: bring one real product (frozen poultry), search it in Arabic, save it, link the ruling, and see the edition check run in the first 15 minutes.

## Persona 2 — Fahad, Import Documentation Coordinator

**Role**: import documentation coordinator at a Dubai electronics distributor (40–60 clearance lines a week). English-first; prepares the documentation packet the licensed broker files: commercial invoice lines, packing lists, and the classification reference for each new SKU. UAE clearance requires bilingual commercial invoices (01 [6]) — the Arabic side of every goods description is part of his daily work.
**Context**: his bottleneck is the new-SKU loop: supplier sends an English spec sheet, he hunts the code, copies a description into the invoice, asks a colleague to write the Arabic goods description, and repeats the search next month because nothing was saved.
**Goals**: search a technical English description ("LED desk lamp with dimmer") and get candidate headings with the reasoning visible; read the Arabic rendering of the chosen line so the invoice's Arabic description matches the schedule's wording; keep a per-shipment list of verified codes the broker can be pointed at.
**Frustrations**: free lookup engines give him a code with no reason attached; when the broker challenges a line he has nothing to show but the search he ran; the Arabic wording he improvises for invoices drifts from schedule wording.
**Quote (paraphrase)**: "The broker asks why 9405 and not 8539. I need to answer with something better than 'the search engine said so'."

## Persona 3 — Mariam, Classification Reviewer at a forwarding documentation desk

**Role**: senior documentation officer at a Jeddah freight forwarder's desk team (the team that prepares declaration data for licensed brokers — the desk never files itself; the exclusion boundary is her daily reality). Reviews other people's code choices before they go to the broker; trains juniors.
**Context**: she is the reason the ruling-notes library exists: when she rejects a junior's classification she writes a paragraph explaining which note settles the question, and that paragraph lives in a chat thread that evaporates.
**Goals**: search the ruling-notes library directly ("screen protector", "smartwatch charger") and find the controlling note; keep a shared desk list of settled classifications juniors can consult; export an evidence pack per client file.
**Frustrations**: public ruling databases exist but are single-country, English-only, and unattached to the schedule she browses; her desk's settled decisions have no shared home; juniors re-litigate the same questions.
**Quote (paraphrase)**: "Every classification argument this desk has ever won is stored in nobody's memory."

## Persona 4 — Sultan, Procurement & Sourcing Lead (secondary)

**Role**: sourcing lead at a Dammam retail group evaluating new product lines (home goods, small appliances). Not a classification professional; needs the duty reference early — before finance runs landed-cost — and needs to not be wrong about it.
**Context**: he currently asks "what's the duty on this?" in a group chat and receives a percentage repeated from an old PDF, edition unknown. Finance then builds landed-cost numbers on top (freight comparison is a sibling product's lane — 12 Q-4; his need here stops at the reference).
**Goals**: find the line for a candidate product, read the published rate with its structure and edition, mark it as a candidate in a shared list, and let the compliance desk verify it.
**Frustrations**: he cannot tell whether the number he was quoted is current; he does not know the rate is a reference, not an assessment, until someone tells him; he has no way to hand his candidate to Noura-shaped colleagues formally.
**Quote (paraphrase)**: "I just need to know which edition that 5% came from."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Noura | defend the classification file: right line, cited note, current edition | daily; deep re-checks on edition changes | "the government portal is free" — must stay true and useful against it (01) |
| Fahad | new-SKU loop: spec sheet → candidate line → bilingual description → broker reference | 40–60 lines/week | "I already have a lookup engine" — engines assign, this workspace defends |
| Mariam | review juniors' codes against controlling notes; keep settled decisions alive | every review | "rulings are public, why a product" — they are public and unattached; the library attaches them |
| Sultan | early duty reference for candidate lines, edition-labeled | per sourcing cycle | "isn't this just a calculator" — no: no guarantees, no computation, a reference desk (LOOP-10) |

## Objections + responses (sales-facing, SME-B)

- "The national portal already does this, free." → It does lookup. This is the desk's working memory: saved lists that reconcile across editions, notes attached to headings, bilingual reading in one surface, evidence packs out. The portal stays the authority; this is where the desk works (01).
- "AI can classify for us." → The assist proposes; the desk officer disposes — every candidate carries provenance and every saved code carries a human's verification status. Automation assigns codes to pipelines; desks defend codes to authorities (01).
- "We can't rely on unofficial duty numbers." → Correct, and neither do we: rates render as published reference with edition and structure, and the adapter contract forbids guarantee-shaped operations outright (07b rule 2). The product's honesty is the feature.
- "Our broker handles classification." → Then the broker receives an evidence pack instead of an email chain, and the desk stops paying for re-litigated questions (Mariam, 02).
- "Another seat fee?" → The desk already pays in hours: portal tabs, stale spreadsheets, re-checks after every amendment (01 [9][10]). Per-seat pricing with an unmetered deterministic spine is the cheaper of the two (12 Q-3).

## Voice derivation (SME-J)

Desk-voice: clerk-precise — states the code, the edition, the rate's structure, and what is NOT known, in that order (copy-voice §1: say the true thing, briefly). Reference-tool register: no urgency adjectives, no "smart", no celebration; the product's warmth budget goes to empty-state teaching, never to errors. Arabic UI copy is فصحى بيضاء (plain MSA), the register of schedule prose, with fixed terminology (one concept, one term, everywhere):

النظام المنسق = Harmonized System (HS) · القسم = section · الفصل = chapter · البند = heading/tariff line · الرسم الجمركي = customs duty · الرسم القيمي = ad valorem duty · الرسم النوعي = specific duty · القرار التصنيفي = classification ruling · ملاحظات التفسير = interpretation notes · جدول التعريفات الجمركية = tariff schedule · الإصدار = edition · قائمة الرموز المحفوظة = saved classification list · حزمة الأدلة = evidence pack · مساعد البحث = search assist · التطبيع = normalization.

Numerals Western per ledger row (data/reference surface — rtl-rules §3, design-language-map §7); HS codes are always Western digits in both locales, bidi-isolated inside Arabic prose (rtl-rules §2).
