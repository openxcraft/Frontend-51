# 02 — User Research: expense-claim-flow

SME-B pass · Paraphrased sentiment only, marked (paraphrase) — zero verbatim quotes; personas synthesized from the research digest's practitioner sources (research/batch4/expense-claim-flow-q1…q15) and portfolio-adjacent buyer patterns. Personas use regional names; no real individuals are represented.

## Persona 1 — Faisal, Finance Manager (primary buyer)

**Role**: finance manager at a Riyadh-headquartered trading & logistics company (~340 employees, 6 finance seats); owns the expense policy — a bilingual memo last revised when the AED/SAR travel tiers were set two years ago — and answers when reimbursement is late, a duplicate slips through, or the external auditor asks for evidence. Reimbursement today: claims arrive as photographed receipts in a chat thread or a spreadsheet row, approvals happen by email forward, payouts are recorded in a workbook he audits quarterly.
**JTBD**: "When employees spend their own money on the company, I want every claim checked against our actual rate tables and threshold rules before it is paid, so reimbursement is fast for the honest majority and the audit trail answers itself."
**Triggers**: a duplicate receipt paid twice in the same quarter (the deterministic failure his workbook catches too late — digest q10's misappropriation-subclass framing, paraphrase); an auditor asking for the approval evidence on a set of claims (digest q7's input-VAT recovery posture); the CEO asking why a Dubai trip's reimbursement took five weeks (digest q8's 47%-delay figure is his lived reality — unverified estimate, paraphrase).
**Objections + responses**: "Another per-seat SaaS taxing all 340 staff?" → pricing inverts the category: finance seats paid, submission free (12 Q-3). "Will this try to replace our policy?" → the product *encodes* his memo as rate tables he owns — effective-dated, versioned, cited by every computation (00). "We don't want AI approving anything" → the only AI-touching operation proposes receipt fields; humans confirm every field and make every decision (conditionally-AI, 07b).
**Pains**: policy lives in a memo nobody reads at claim time; per-diem disputes argued from memory; approval thresholds enforced by who happens to be in the email chain.

## Persona 2 — Huda, Regional Sales Lead (the frequent claimant — primary daily user)

**Role**: covers Riyadh↔Jeddah↔Dubai; files a claim roughly every three weeks — mileage to client sites, per-diem days on regional trips, and a shoebox of Arabic and English receipts. Files from her phone in taxis and hotel lobbies; has delayed claims until they were borderline late (digest q8's delay psychology — paraphrase) because the spreadsheet + email loop punishes every submission.
**JTBD**: "When I get back from a trip, I want to file the whole claim from my phone in ten minutes — receipts photographed, per-diem and mileage computed for me — so the money comes back before the next trip starts."
**Triggers**: a 40-minute form session after a 3-day trip (digest q12's ~20-minutes-per-report manual-entry figure — unverified estimate, paraphrase); a per-diem amount challenged by finance with no shared numbers to look at; an Arabic receipt whose vendor name an English-only form mangled.
**Objections + responses**: "I don't want to learn a finance tool" → her surface is a claim composer with three item kinds and a phone-first capture mode; the arithmetic is the product's job (CP-1). "What if the OCR gets my amount wrong?" → every extracted field shows a confidence band and waits for her confirmation — nothing writes itself (P15). "What if I'm somewhere with no signal?" → offline queue keeps her captures and submits on reconnect (P20, CP-5 edge).
**Pains**: typing amounts from crumpled receipts twice (form + spreadsheet); guessing which per-diem tier applies; not knowing where her claim sits in the approval chain (digest q8's black-box approval pain — paraphrase).

## Persona 3 — Salem, Head of Commercial (the threshold-routed approver)

**Role**: department head who approves claims above his matrix line (SAR 2,500 at this company); sees claims in bursts between meetings; wants to be able to approve the clean ones in seconds and interrogate exactly the ones that smell wrong — not to become a part-time accountant.
**JTBD**: "When a claim over my threshold lands, I want the computation and the receipts in one glance with anything unusual already flagged, so my approval is a judgment call, not an audit project."
**Triggers**: a claim where the mileage rate didn't match the policy he remembered (the mid-year rate change — digest q5's IRS July 1 change is the pattern); being asked to approve a per-diem total he couldn't decompose; a missing receipt discovered *after* his approval.
**Objections + responses**: "I approve from my phone between meetings" → the approval workspace is mobile-complete for review and decision (04). "I'm not the policy police" → the findings rail names what the deterministic rules caught; his job is the human call, delegation, or the reasoned override (CP-3). "Why is this claim blocked?" → the gate refusal names the blocking finding and links it (never a generic refusal — P04 discipline).
**Pains**: approving blindly because the evidence is an attachment gallery; no record of *why* he approved something six months later; delegation-by-email leaving no trail.

## Persona 4 — Amal, Junior Accountant (the payout processor & audit assembler)

**Role**: the accountant who reconciles approved claims to bank transfers, records what actually moved, and assembles the quarterly evidence pack for the external auditor (claim ledger, findings, approvals, payouts). Today she rebuilds that pack by hand from the email trail — the exact evening-of-copy-paste labor the neighboring specs' analyst personas know.
**JTBD**: "When the month closes, I want every approved claim recorded as paid with method and reference, and the evidence pack exported as one artifact per period, so the audit conversation starts from a document, not an archaeology project."
**Triggers**: a payout recorded in the workbook with no approval trail attached (digest q8's slow-reporting downstream cost — paraphrase); duplicate receipt numbers across two claimants surfacing at reconciliation (deterministic cross-claim rule, CP-3); an expired export link breaking an audit request (artifact expiry discipline, async-contract §2).
**Objections + responses**: "We post payments in the accounting system — I don't need double entry" → this product records *evidence* (method/reference/date/actor), not ledger entries — no ERP posting is exactly the boundary (LOOP-10); the export is the handoff. "What about FX?" → v1 is single-currency per workspace (12 Q-5) — she records the workspace-currency amount the policy pays. "Can I fix a wrong payout record?" → corrections append with reasons; records never silently rewrite (07a).
**Pains**: rebuilding evidence packs per audit; payout records without decision provenance; late-submission advisories arriving after the books closed.

## JTBD summary

| Persona | Core job | Frequency | Primary objection → answer |
|---|---|---|---|
| Faisal | workforce spend → policy-checked, evidenced payouts | continuous (owns the policy) | "taxes all staff?" → finance-seat pricing, submission free |
| Huda | trip → filed claim in minutes, from a phone | every 2–3 weeks | "OCR errors?" → confidence-banded, confirm-every-field |
| Salem | threshold-routed claim → informed approval | bursts, 5–15/week | "not the policy police" → findings named, human calls his |
| Amal | approved claims → paid records + audit artifact | monthly + quarterly | "double entry?" → evidence not posting; export is the handoff |

## Voice derivation (SME-J)

Pipeline voice: **plain, ledger-true, and quick** — states the number, the rule it came from, and what happens next ("Per-diem, Dubai tier: 4 days at SAR 500.00, first day at 75% — SAR 2,187.50 computed"). Arabic register فصحى بيضاء (utility precision); English professional-neutral, contractions off (governance-adjacent family per copy-voice §4). Fixed terminology (locked across 07a/11; one concept, one term, everywhere — copy-voice §3): المطالبة=claim · بند=claim item · إيصال=receipt · البدل اليومي=per-diem · تعويض المسافة=mileage · جدول المعدلات=rate table · حزمة السياسة=policy pack · سلسلة الموافقات=approval chain · ملاحظة سياسة=policy finding · معترض=blocking · اعتماد=approve · رفض=reject · استفسار=query · الصرف=payout · سجل الصرف=payout record · تصدير=export · مساحة العمل=workspace. Numbers Western per ledger row (amounts, rates, days, thresholds — a money surface, design-language-map §7); Arabic strings may run ~125% of English length — layout budgets for it (10) and the 11 matrix lists both strings verbatim (copy-voice §5).
