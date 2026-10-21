# 02 — User Research: invoice-generator-desk

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (bilingual workaround demand [33][34][37][38], late-payment reality [28][29], GCC tax spread [22][23][24], numeral conventions [21]); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Layla, Saudi freelance brand designer (primary)

**Role**: independent visual-identity designer in Riyadh; 60% of her billing is to Saudi corporates and institutions who process invoices through Arabic-first finance teams, 40% to remote international clients who pay in USD. Today she keeps two invoice files — an Arabic Word template and an English one — hand-numbers them from a notebook, and re-types every figure twice. Her corporate clients' accountants have bounced invoices back for a missing tax-registration number and for figures they wanted in Arabic-Indic numerals on the Arabic copy; her international clients want Western digits. She has never found one tool that does both documents without becoming an accounting suite.
**JTBD**: "When I finish a project phase, I want to issue one invoice that my Saudi client's finance team accepts on first pass — Arabic labels, their numerals, the registration numbers, the amount in words — and issue the USD invoice to my remote client from the same place with Western digits, so I stop maintaining two template files and stop losing evenings to re-typing figures."
**Triggers**: a bounced invoice ("missing VAT registration number — resend"); month-end when she re-types 4–6 invoices into two templates; the notebook sequence slipping after a voided invoice left a gap she had to explain.
**Objections + responses**: "I already have free invoicing" → her free tool renders Latin documents; the bilingual paper is what this one composes (01). "Will changing numerals change my numbers?" → the toggle is render-only; storage is canonical Western-digit money and the issued PDF records the render config it used (05/07a). "What about payment collection?" → deliberately out of scope; the document and payment marks are the product, the rail belongs to her bank (00 exclusions).
**Onboarding motive**: issue one real SAR invoice with Arabic-Indic numerals and the amount in words, in the first sitting.
**Verbatim (paraphrase, persona voice)**: "I don't need the money chased. I need the paper to stop coming back."

## Persona 2 — Omar, UAE micro-agency owner

**Role**: founder of a 4-person digital agency in Dubai; bills retainer clients monthly in AED with 5% VAT, occasionally in USD for a European client, and once a quarter to a Bahraini distributor at 10% VAT. His accountant receives a folder of PDFs at quarter end and complains about sequence gaps and inconsistent tax labels. He currently uses a free invoicing tier designed around card payments he never asks clients to use.
**JTBD**: "When I bill my monthly retainers, I want each invoice numbered from one unbroken series with the right tax scheme attached — 5% here, 10% for Manama, 0% for a Kuwaiti pilot — so my accountant stops reconciling my numbering and my clients see a consistent, professional document."
**Triggers**: the accountant's quarter-end email ("invoice 0093 is missing — did you void it?"); a Bahraini client's query about the VAT label on a UAE-shaped invoice; discovering his free tier's "recurring" feature sends invoices he hasn't reviewed.
**Objections + responses**: "recurring billing would save me hours" → deliberately excluded (LOOP-10): duplicating last month's invoice is two clicks and keeps a human's eyes on every document (03 CP-2); "my accountant wants an accounting integration" → the export artifact is the handoff; the no-ledger boundary is what keeps this tool light; "multi-currency scares me" → currency and its minor digits are scheme-level data; three-decimal Gulf currencies round at three places by rule (07c).
**Onboarding motive**: set up the UAE scheme, one series, and duplicate-issue this month's retainer in one sitting.
**Verbatim (paraphrase)**: "The sequence is my credibility. The tax label is my client's clerical friction. Both should just be right."

## Persona 3 — Sara, cross-border consultant (secondary)

**Role**: Cairo-based strategy consultant working with GCC and European clients; invoices in SAR, AED, USD, and EUR from a laptop. English is her working language; her Saudi client's back office reads Arabic. She currently assembles invoices in a spreadsheet, exports to PDF, and asks a colleague to proof the Arabic label line — because her spreadsheet mixes scripts badly and her numerals render inconsistently across the client's devices.
**JTBD**: "When I invoice across borders, I want one document that renders correctly for whichever finance team receives it — English block, Arabic block, digits each side reads comfortably — without me becoming a typography engineer, so invoicing stops being the annoying part of consulting."
**Triggers**: a client printing her PDF and finding the Arabic line broken; catching herself re-checking every figure twice because two scripts make her doubt the arithmetic; a currency-decimal scare on a Bahraini invoice.
**Objections + responses**: "spreadsheets are free and flexible" → flexibility without integrity: sequences, tax blocks, and bidi-correct rendering are the failure modes (01 complaints); "Arabic proofing by a colleague is fine" → the product renders both blocks natively with bidi isolation; the colleague proof becomes a nicety, not a dependency.
**Onboarding motive**: one SAR invoice to her Riyadh client with the bilingual amount-in-words rendered correctly.
**Verbatim (paraphrase)**: "I bill in four currencies and two scripts. The tool should carry that complexity, not me."

## Persona 4 — Tariq, the client-side accountant (document receiver)

**Role**: senior accountant at a Saudi trading company; receives 30–50 supplier invoices a month from freelancers and small agencies, in every state of bilingual health: Latin-only PDFs, Arabic PDFs with Western numerals, hand-numbered sequences with gaps, missing tax-registration fields. He clears clean invoices into the payment run the same week and bounces the rest with a query note. He will never log into the invoicing tool — he is the reason the document must stand alone.
**JTBD**: "When a freelancer's invoice arrives, I want the tax block complete and correctly labeled, the number sequential and traceable, and the figures in the numerals my team reads fast — so I clear it into the payment run instead of spending a query cycle on it."
**Triggers**: a supplier invoice missing the seller's tax-registration number (an immediate query); a sequence gap that forces him to ask whether a document went missing; an Arabic invoice whose amounts are in Western digits — readable, but slower for his Arabic-first data-entry colleague.
**Objections + responses**: "suppliers should just use the accounting portal" → most freelancers won't buy a ledger to invoice him; a standalone document that arrives correct is the pragmatic optimum (the two-column template vendor's "clears accounting queues" claim is this persona's voice, 01 [38]).
**Onboarding motive**: none — his satisfaction is measured in invoices he never has to query.
**Verbatim (paraphrase)**: "I don't chase bad invoices. I query them, and the clock starts over."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Layla | one bilingual SAR/USD document per project phase, accepted on first pass | weekly–biweekly | "will the numeral toggle change my numbers?" (render-only proof) |
| Omar | monthly retainer invoices from an unbroken sequence with per-client tax schemes | monthly + quarterly | recurring-billing absence (deliberate; duplicate path) |
| Sara | correct cross-border documents without becoming a typography engineer | per-engagement | spreadsheet inertia (integrity vs flexibility) |
| Tariq | receive documents he clears without a query cycle | 30–50/month (receiver) | none — the document must stand alone |

## Voice derivation (SME-J)

Counter-plain voice: the clerk at the counter, not the marketer at the booth — declarative, amount-forward, zero hype (copy-voice §1). Copy states the figure, the rule that produced it, and the next action; adjectives carry evidence or get cut. Arabic UI copy is فصحى بيضاء utility register. Fixed terminology (one concept, one term, everywhere — 07a glossary + 11 matrix): فاتورة=invoice · بند=line item · العميل=client · الإجمالي الفرعي=subtotal · الخصم=discount · ضريبة القيمة المضافة=the VAT label (the tax label itself is scheme data, rendered bilingually from the jurisdiction table) · المجموع الكلي=grand total · رقم الفاتورة=invoice number · سلسلة الترقيم=number series · نظام الأرقام=numeral system (الأرقام الغربية=Western digits · الأرقام العربية الهندية=Arabic-Indic digits) · المبلغ كتابةً=amount in words · تاريخ الاستحقاق=due date · النطاق الضريبي=tax scheme (jurisdiction profile) · إصدار الفاتورة=issue · إبطال الفاتورة=void · تسجيل دفعة=payment mark · تسليم=delivery · تصدير=export. Numerals in system chrome are Western per the ledger row (data/finance surface — design-language-map §7); Arabic-Indic glyphs appear only as document-render specimens (the toggle's own labels and document examples), never mixed mid-sentence in system prose (copy-voice §7).
