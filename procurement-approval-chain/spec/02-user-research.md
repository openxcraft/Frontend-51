# 02 — User Research: procurement-approval-chain

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (q4 DOA guides, q6 requisition practice, q7 MENA status quo, q15 cycle-time benchmarks); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Amal, Department Requester (primary, highest volume)

**Role**: marketing executive at a Riyadh distribution company; raises 3–6 purchase requests a month — event print materials, sponsorship items, agency retainers, office equipment for her team. Collects quotes by phone and WhatsApp from vendors whose invoices arrive in Arabic, whose quotes arrive as photos, and whose names she knows in both scripts. Today she chases approvals through her department manager's chat: request sent, screenshot taken, "did you see it?" sent again.
**Context**: Arabic-first reader, English-first tooling; drafts requests between meetings on her phone; the vendor conversation is bilingual by construction (Arabic negotiation, English email trails).
**Goals**: know instantly *who* will approve and *when*; never have a request vanish into a chat; submit once with quotes attached so nobody asks her for "the papers" later.
**Frustrations**: no visibility after submission (the 55-hour median wait [57] feels like silence); being asked to re-explain the request at approval time; justifying vendor choice verbally instead of once, in writing.
**Quote (paraphrase, persona voice)**: "I don't mind the wait. I mind not knowing there is one."
**Objections + responses**: "another tool to learn?" → the composer asks for what she already assembles by hand (lines, quotes, needed-by); "my manager approves on WhatsApp fine" → the chain records the approval with its rule and evidence, which chat cannot; "my Arabic vendor names will break the English tool" → names are bilingual by construction, searchable through normalization (rtl-rules §4).

## Persona 2 — Reem, Department Manager (first-line approver)

**Role**: operations department manager at the same company; holds DOA authority to 50,000 under the matrix; approves ~10 requests a week between her real work. Her signature is the one auditors ask about.
**Context**: reviews on desktop during morning admin blocks and on her phone in corridors; reads Arabic and English equally; distrusts numbers she cannot trace.
**Goals**: see the request, its quotes, and its budget impact in one screen; decide in under two minutes for routine items; return sloppy requests with a note instead of rejecting them.
**Frustrations**: requests that arrive without quotes attached (chasing Amal for "the papers"); discovering a budget overrun *after* approving (no envelope view at decision time [40's soft/hard-stop gap in her status quo); being an approver on things her position shouldn't see.
**Quote (paraphrase, persona voice)**: "If the number is over the envelope, tell me before I sign, not at quarter close."
**Objections + responses**: "I'll be the bottleneck" → the chain names the next signer and the queue is honest about what waits on her; "delegation when I travel?" → delegation windows are a first-class feature (position authority, human cover, audit-recorded); "why can't I just approve everything?" → the matrix is the company's policy, not the tool's opinion — she can see exactly which band fired.

## Persona 3 — Faisal, Finance Manager (policy owner + budget authority)

**Role**: finance manager; owns the DOA matrix, the budget envelopes, and the quote policy; second-level approver on the 5,001–50,000 band; the economic buyer. Answers when an auditor asks "who authorized this and on what evidence" [his JTBD's trigger].
**Context**: desktop power user; lives in the register, the budgets console, and the matrix studio; bilingual reporting duties (Arabic board summaries, English audit files).
**Goals**: one versioned DOA matrix that matches the board-ratified policy document [20]; budget projections that include in-flight requests (committed, not just spent [39][42]); quote discipline above thresholds without policing every request; an export that satisfies the auditor in one artifact.
**Frustrations**: approvals happening in chat that reconcile to nothing [28]; budgets discovered overrun at period close; the "3 quotes" rule enforced by memory, not by system [22]; suite pricing that taxes every requester seat [8][44].
**Quote (paraphrase, persona voice)**: "I don't need spend analytics. I need the audit question answered before it is asked."
**Objections + responses**: "an ERP module does this" → the mechanics are proven there [26][41] at enterprise shape and price; this is the discipline at team price; "my matrix is peculiar" → rules are scope-keyed and banded, matching the board document, versioned; "will it post to my books?" → never (LOOP-10): it records commitments and exports evidence; accounting stays authoritative.

## Persona 4 — Noura, General Manager (final authority + delegator)

**Role**: general manager; approves the above-50,000 band; travels two weeks a month; delegates her authority when away. Signs few, heavy requests — sponsorship contracts, fleet, fit-outs.
**Context**: reviews on tablet in corridors and airports; reads the summary first, the evidence on demand; hates being shown a request twice.
**Goals**: final-level review that fits one screen (total, quotes compared, budget state, chain so far); delegation that is explicit, time-boxed, and audit-visible; rejection with a reason that reaches the requester intact.
**Frustrations**: being the invisible bottleneck at the top of the chain [58's >90-hour laggard band]; delegation by forwarding emails (authority with no record); requests re-routed to her after edits without a note of what changed.
**Quote (paraphrase, persona voice)**: "Delegate my signature, not my accountability — the record should know which one of us signed."
**Objections + responses**: "I approve five things a month, why a tool?" → the top of the chain is where delay concentrates; her queue is five things that each took weeks to reach her; "delegation sounds risky" → the step records delegate-vs-holder and the window bounds it; "show me what changed since last time" → resubmission carries the previous chain version and a change note (03 CP-3).

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Amal | quotes + lines → submitted request with visible routing | 3–6/month | tool fatigue + chat-is-easier inertia |
| Reem | queue → evidence-based decision in ≤2 min | ~10/week | "I'll be the bottleneck" + late budget discovery |
| Faisal | board policy + envelopes → runtime discipline + audit export | matrix quarterly; envelopes at period open; review daily | ERP-module sufficiency + suite pricing |
| Noura | final review → decision (or delegation) with audit-clean record | ~5/month | low volume ≠ low stakes; delegation trust |

## Objection ledger (buy-side, beyond personas)

- "We already pay for a procure-to-pay suite" → the suite's approval module is configuration inside PO/invoice scope [2][11]; this is the focused instrument for the 64% with nothing [38] — and for suite owners, the bilingual DOA layer their suite lacks.
- "Approvals by email are free" → free until the audit question, the overrun discovery, or the 11-working-day request [61]; the cost is invisible until it isn't.
- "Our DOA is in the policy binder" → binder policy cannot route, project, or record; versioned matrix policy can [20][15].
- "Quote comparison is clerical work" → it is the audit evidence: lowest named, deltas computed, non-lowest justified [22][23] — clerical work that fails silently when done from memory.

## Voice derivation (SME-J)

Clerk-of-record voice: declarative, evidence-forward, zero hype, no warmth in errors, calm warmth in success and empty states (copy-voice §1/§6). English register: professional-neutral, contractions off (governance-adjacent family). Arabic register: فصحى بيضاء-to-وسطى utility tone — this is a trust surface, so middle register for approval/authority language, plain register for operational chrome. Fixed terminology (one concept, one term, everywhere): طلب الشراء=purchase request · سلسلة الاعتماد=approval chain · مصفوفة التفويض=approval matrix (DOA) · عرض السعر=quote · المورّد=vendor · مركز التكلفة=cost center · مخصص الموازنة=budget envelope · الالتزام=commitment · شريحة الحد=threshold band · المسوّغ=justification · المعتمِد=approver · الطالب=requester · التفويض=delegation · الإرجاع=return (for revision) · الرفض=rejection. Numerals Western per ledger row (amounts, thresholds, percentages — storage canonical, display formatted). Amount copy always names the currency per locale direction: EN chrome "SAR 12,050.00", AR chrome "12,050.00 ريال" (never mixed mid-sentence, copy-voice §1.7).
