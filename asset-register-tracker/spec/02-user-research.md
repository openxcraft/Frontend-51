# 02 — User Research: asset-register-tracker

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (vendor funnel copy naming spreadsheet chaos [GoCodes], audit-readiness expectations in KSA [ZATCA-linked guidance], practitioner setup-weight sentiment [r/sysadmin]); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Maha, Office Manager, Riyadh professional-services firm (primary)

**Role**: runs the office of a 60-person legal-consulting firm (Riyadh HQ + Jeddah branch): procurement lands on her desk, IT is one contracted person, and she personally answers for ~300 tracked assets — laptops, monitors, phones, meeting-room AV, and the wall of evidence binders. Her registry today is a spreadsheet maintained by an assistant and a paper sign-out sheet at the IT storeroom door.
**JTBD**: "When equipment moves between people or offices, I want the hand-off recorded and signed at the moment it happens, so that when a laptop goes missing or an auditor asks who held asset 107 in March, the answer is one lookup — not an afternoon of WhatsApp archaeology."
**Triggers**: a departing consultant's laptop dispute where two people each swore the other had it; a zakat-season conversation where the external accountant asked for the asset register and disposal records and she rebuilt them from email; the moment the spreadsheet and the storeroom shelf disagreed about what exists.
**Objections + responses**: "my spreadsheet works" → it cannot say who has an item right now (01: the incumbent's own named weakness); "another system to maintain" → registration is quick-add rows, labels are batch-printed once, and the scan companion means *other people* maintain the truth as they hand off; "will this become an IT project?" → non-AI, zero integrations required, works from the first printed sheet (LOOP-5); "I don't want finance thinking we do depreciation here" → the register stops at existence/custody/disposal evidence — accounting keeps the numbers (LOOP-10, a relief not a gap).
**Onboarding motive**: register 20 real laptops, print one label sheet, and run one real signed hand-off on her own phone before trusting it with 300.
**Verbatim (paraphrase, persona voice)**: "The sheet in the drawer is the system. The problem is nobody signs it anymore."

## Persona 2 — Tariq, IT Operations Lead, Jeddah e-commerce company

**Role**: owns a 150-device fleet (laptops, monitors, deskside networking) for a 90-person company; runs onboarding/offboarding hand-offs weekly and fights the laptop-lost-at-exit battle. Evaluated the free open-source registry and the $125/mo tracker; the first meant he became a sysadmin for a side tool, the second was priced fine but shaped for an IT asset database he doesn't run (software spend, compliance modules).
**JTBD**: "When I hand a laptop to a new hire, I want their signature captured with the scan at the desk, so offboarding disputes end before they start and my return-pending list is a screen, not a memory."
**Triggers**: an exit interview where the returned laptop was not the issued one; onboarding days where hand-offs stack up and the paper sheet runs out of rows; a security review asking for device custody history.
**Objections + responses**: "open source is free" → it is free the way a puppy is free — hosted tiers and setup weight are the real price (01 sentiment); "we need software-license tracking too" → deliberately out of scope (LOOP-10): this register does custody and labels better than suites do everything; "signatures on a phone, really?" → typed-name signature with the hand-off facts captured is an operational attestation (12 Q-6 records the e-signature posture); "CSV or nothing" → the register exports cleanly for any downstream system.
**Verbatim (paraphrase)**: "I don't need another database of things I bought. I need to know where the things went."

## Persona 3 — Noor, Assets Coordinator, Dubai production house

**Role**: manages a gear cage — cameras, lenses, lighting, audio kits — checked out daily by staff and freelancers in both Arabic and English; churn is high, damage disputes are monthly, and her current tool is a booking sheet plus a Google form nobody signs.
**JTBD**: "When a freelancer takes a kit for a shoot, I want each item's scan and their signature to close the hand-off, and the return scan to record condition, so damage conversations start from evidence — both languages, because my crews work in both."
**Triggers**: a lens returned scratched with no record of who signed it out; an Arabic-only freelancer lost in an English-only form; a month-end reconciliation done by memory.
**Objections + responses**: "freelancers won't install an app" → scan-companion is the web; the person signing needs no seat, no install, no account — the QR is the entry point; "our gear needs bookings, not just custody" → booking/reservation flows are checkout-suite scope; v1 custody with due dates on return-pending covers the accountability half (12 Q-9 records the boundary); "labels die on set" → damaged/missing label states with replacement flow are first-class (03 CP-1) — the register knows a label died instead of silently re-printing.
**Verbatim (paraphrase)**: "The kit list is the easy half. The hard half is whose signature is on which item at 9 p.m. before a shoot."

## Persona 4 — Saad, Branch Administrator & audit-facing coordinator (secondary)

**Role**: branch administrator at a multi-branch firm; during audit season he becomes the person walking floors with a printout verifying that listed assets physically exist, and assembling the evidence pack (register, additions, disposals, custody records) for the external accountant.
**JTBD**: "When audit season starts, I want to walk each location scanning labels to sight assets, and export the register with custody and disposal records as one pack, so the evidence conversation takes hours instead of weeks."
**Triggers**: auditor requests for the fixed-asset register with disposals support (01 Q4 evidence expectations); a physical count that found retired equipment still on the books; disposal records scattered across emails.
**Objections + responses**: "is this an accounting system?" → no, and that's the point — it produces the existence/custody/disposal evidence while accounting owns valuation (LOOP-10); "walks are on paper anyway" → the scan-companion sighting event turns the walk itself into the audit trail; "our auditor wants specific formats" → CSV and JSON exports with custody history included (03 CP-5).
**Verbatim (paraphrase)**: "The auditor doesn't care what the laptop cost. They care that it exists, that someone answers for it, and that when it left, there's a record."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Maha | asset registry truth + signed hand-offs + audit answer | daily (hand-offs), seasonal (audit) | system-maintenance fatigue |
| Tariq | fleet custody at onboard/offboard | weekly batches | setup weight / scope sprawl |
| Noor | high-churn gear custody with condition evidence | daily, many events | external users won't adopt |
| Saad | audit walks + evidence pack export | seasonal | is-this-accounting confusion |

## Voice derivation (SME-J)

Registry voice: **registrar-plain** — ledger-grade declarative sentences; states what the register records and what it does not; no reassurance theater (copy-voice §1: adjectives carry evidence or are cut). Numbers are counts and dates, rendered Western per ledger row. Arabic UI copy is فصحى بيضاء, utility register — the domain vocabulary of Gulf office practice, locked one-term-per-concept: الأصل = asset · الفئة = category · الموقع = location · تسمية QR = QR label · دفعة التسميات = label batch · العهدة = custody (the office term for assigned equipment responsibility) · سلسلة العهدة = custody chain · حدث العهدة = custody event · الإسناد = assign (hand-out) · الاسترجاع = return · التحويل = transfer (person-to-person) · المشاهدة = sighting (audit walk verification) · التصحيح = correction event · التوقيع = signature · سحب من الخدمة = retire from service · سجل النشاط = activity log. "العهدة" is deliberately the load-bearing term: it is the word Maha's firm already uses for the drawer sheet — the product speaks the buyer's existing language instead of teaching new vocabulary.
