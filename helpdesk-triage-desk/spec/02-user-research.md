# 02 — User Research: helpdesk-triage-desk

SME-B pass · Paraphrased sentiment only, marked (paraphrase) — zero verbatim quotes; personas synthesized from the research digest's practitioner sources (research/batch5/helpdesk-triage-desk-q1…q10) and portfolio-adjacent buyer patterns. Personas use regional names; no real individuals are represented.

## Persona 1 — Maysoon, Support Lead (primary buyer)

**Role**: runs a 7-agent bilingual support pod inside a Riyadh-based e-commerce and delivery company; three queues (orders, payments, technical), two SLA tiers by customer segment, and a weekly ops review where she is the one who explains why P1 first-response slipped on Thursday. Tickets arrive in Arabic, English, and mixed-script (Latin brand names inside Arabic sentences); her team answers in whatever the customer wrote, through a response platform the company already licenses per-agent.
**JTBD**: "When the morning wave lands — 80 tickets, two languages, one broken payment gateway — I want every ticket language-detected, severity-assessed, clustered, and routed before my stand-up, so the pod starts on the incident, not on sorting."
**Triggers**: a Thursday where 40 Arabic and 25 English tickets about the same checkout failure were triaged as two unrelated waves by three different agents (the cross-language blindness — 01's core gap); an ops review where "why was this P2?" had no answer better than "Yousef felt it was"; requested-priority inflation (every customer marks urgent — the q2 practitioner pain); per-agent suite pricing she cannot justify for a 7-seat pod (01 pricing).
**Objections + responses**: "We already pay for a helpdesk — why another tool?" → this is the triage layer *beside* it, priced on lead+triage seats, not another per-agent suite (12 Q-3). "Will the AI get our Arabic right?" → clustering is confirm-gated and the keyword floor carries the day when it doesn't (conditionally-AI, 00); severity is rules, never AI. "My team won't maintain signature terms" → clusters start from 6–10 seeded intents and the assist proposes new ones for her confirm — authoring is editing, not writing from scratch.
**Pains**: routing decisions that cannot be explained afterward (q10's opacity complaint class); SLA reporting assembled by hand in a sheet every Friday; no audit answer when finance asks why a key account's ticket sat unrouted for 6 hours.

## Persona 2 — Tarek, Triage Specialist (primary daily user)

**Role**: the pod's first pair of hands — opens the intake queue at 07:30, clears 150–350 tickets before lunch; keyboard-first; previously triaged in a shared inbox with hand-typed tags and a priority column he distrusts because customers set it themselves (q2 reddit sentiment, paraphrased). Reads Arabic natively, English fluently; the mixed-script tickets (Arabic body, Latin brand terms) are his daily bread.
**JTBD**: "When I open the queue, I want language, severity, and cluster pre-computed with the reasons on the row, so my keystrokes go to judgment calls — merges, overrides, escalations — not to sorting."
**Triggers**: false clusters that swallow unrelated tickets (he distrusts auto-tagging from prior tools — q6's black-box complaint pattern, paraphrased); a P1 that sat behind 20 P4s because a keyword rule nobody could read routed it wrong; duplicate tickets from one customer emailing three times about one failed payment.
**Objections + responses**: "Auto-clustering will mis-file Arabic" → every rule assignment carries method + matched terms on the row; the assist's proposals are labeled and confirm-gated; unclustered is an honest state, never a hidden one. "Keyboard or I won't use it" → full keyboard map (09), no raw-letter shortcuts (Arabic-layout conflict class, a11y-baseline §3). "Another console to learn" → four verbs he already performs (log/categorize/prioritize/route, q2) — the console names them, it does not invent new ones.
**Pains**: re-reading the same ticket to re-derive what a rule could have told him; escalations that happen in chat instead of the record; his shift-ending summary hand-written for Maysoon.

## Persona 3 — Nora, Senior Responder (Arabic-first)

**Role**: the pod's strongest Arabic responder — takes the hard Arabic payments and technical tickets; English-capable but slower in it. Today Arabic tickets scatter across all agents because nothing routes by language capability; she re-opens tickets others misread, and her reopen-rate complains on her behalf (q8 reopen-rate vocabulary).
**JTBD**: "When Arabic tickets arrive, I want them routed to agents who can actually answer them, so the customer doesn't get a machine-translated apology and a reopened ticket two days later."
**Triggers**: Arabic tickets routed to English-only queue members; mixed-script tickets (Arabic + Latin product names) rendered corrupted or force-flipped in prior tools (rtl-rules §2's corruption class); first-response clocks that run while a ticket sits in the wrong queue.
**Objections + responses**: "I'm not a triage person" → her seat is responder-grade: acknowledge, log the response reference, close with disposition — three actions, keyboard-complete (09). "The SLA clock will blame me" → clocks are policy objects with declared start-points (first-response from receivedAt, resolution from routedAt — 07a), and the breach ledger names the queue, not the person, in v1 metrics (12 Q-12).
**Pains**: bidi corruption of mixed-script tickets; being the invisible cleanup for wrong-language routing; no record that she answered at 11:40 when the clock said 12:00.

## Persona 4 — Faisal, Operations Viewer (read-only stakeholder)

**Role**: ops manager above the pod; reads the weekly triage digest before the ops review; never logs into the response platform; asks questions like "how many of Thursday's 200 were actually the gateway incident?" and "which SLA tier did we miss?"
**JTBD**: "When the week closes, I want the triage log — clusters, severities, routing reasons, SLA ledger — exported as one artifact, so I stop asking Maysoon to assemble the Friday sheet."
**Triggers**: hand-assembled Friday sheets that disagree with the response platform's numbers; incident retrospectives where "how big was it?" has no cluster answer.
**Objections + responses**: "I don't want a seat" → viewer seats are free and read-only; the export artifact is his surface (07b exportTriageLog). "Is the clustering trustworthy?" → the export carries per-cluster provenance (rules vs assist-confirmed) and per-ticket assignment methods — the audit answer ships with the numbers.

## JTBD summary

| Persona | Core job | Frequency | Primary objection → answer |
|---|---|---|---|
| Maysoon | morning wave → triaged, routed, defensible SLA answer | daily + weekly review | "another tool?" → sidecar seat economics |
| Tarek | ticket stream → judgment calls only (merges, overrides, escalations) | daily (150–350 tickets) | "auto-clustering mis-files" → reasons on every row, confirm gates |
| Nora | Arabic tickets → capable responders | daily | "SLA blames me" → clocks as policy, breach ledger names queues |
| Faisal | week → audited triage digest | weekly | "no seat" → free viewer + export artifact |

## Voice derivation (SME-J)

Triage-desk voice: **control-tower brisk** — states the signal, the rule it came from, and what happened next, in that order; never editorializes about the customer or the agent ("Severity P2 — impact: priority account; urgency: billing terms present; routed to Payments queue by rule R-04 at 09:41"). Arabic register فصحى بيضاء (utility precision surface); English professional-neutral, contractions off (business_ops family register). Fixed terminology (locked in 07a/11; one concept, one term, everywhere — copy-voice §3): تذكرة=ticket · عنقود=cluster · عنقود النية=intent cluster · التجميع=clustering · الخطورة=severity · التوجيه=routing · قاعدة التوجيه=routing rule · الطابور=queue · اتفاقية مستوى الخدمة=SLA · التصعيد=escalation · الدمج=merge · الإغلاق=disposition · الاستلام=intake · كشف اللغة=language detection · إشارة=signal · مصفوفة الخطورة=severity matrix · سجل الرد=response log. Numbers Western per ledger row (severity tiers, SLA minutes, counts — a data surface, design-language-map §7); Arabic strings may run ~125% of English length — layout budgets for it (10) and the 11 matrix lists both strings verbatim (copy-voice §5).
