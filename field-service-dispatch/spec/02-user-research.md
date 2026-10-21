# 02 — User Research: field-service-dispatch

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (complaint mining, category playbook literature, MENA WhatsApp-channel evidence); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Salem, Owner-Dispatcher of an AC maintenance company (primary; buyer)

**Role**: owns a 12-technician AC/refrigeration maintenance company in Riyadh — residential split units, villa package units, small-office contracts. He answers the phone himself in the morning, writes job slips, photographs them into the technician WhatsApp group, and spends his afternoon asking "وين وصلت؟" ("where have you got to?") one technician at a time. Two recurring-contract clients ask for monthly visit reports he assembles from memory and chat-scrollback.
**Context**: Arabic-first; his customer base is mixed Saudi households and expat compound managers; his technicians are a mix of Arabic and Urdu/Hindi speakers who all read Arabic job slips but chat among themselves in three languages.
**JTBD**: "When a customer calls in the morning, I want the job on the board with a window and a technician in under a minute, so my day is dispatching — not re-explaining the day to twelve people on the phone."
**Triggers**: a customer dispute ("your man never came") with no record to answer it with; two technicians sent to the same villa on the same day (a slip he lost); an afternoon lost to status phone calls.
**Objections + responses**: "I already have WhatsApp" → the board replaces the coordination half of the group and leaves an audit trail (structured notes replace chat; LOOP-10 bans chat by design); "my customers won't install anything" → touchpoints are outbound messages and a copyable confirmation link; the phone-recording path exists for customers who never reply to anything; "another subscription?" → flat band under the suite tier, and the phone path is free by construction (12 Q-3).
**Onboarding motive**: enter yesterday's ten jobs, dispatch tomorrow's first job through the confirmation gate, and print the day sheet for the morning meeting.
**Verbatim (paraphrase, persona voice)**: "The work gets done. What I can't prove, six hours later, is who confirmed what."

## Persona 2 — Nora, Dispatcher at a facility-services company (the daily board user)

**Role**: dispatch coordinator at a 30-technician facility-services company in Dubai — AC, electrical, plumbing, and handyman visits for residential buildings and small commercial clients. She runs a spreadsheet of booked visits, calls each customer the evening before to confirm, and her confirmations live in her notebook. No-shows and "we were never told" complaints land on her desk.
**Context**: bilingual workday — English with compound managers, Arabic with landlords and technicians; Dubai's mixed customer base replies on WhatsApp or not at all.
**JTBD**: "When I dispatch a day, I want every customer's confirmation visible on the job card before the van leaves, so a missed confirmation is a decision I make on purpose — not a surprise the technician discovers at the door."
**Triggers**: a technician arriving to an empty apartment (customer forgot — the 30%+ no-show mechanism evidence in 01); a customer claiming they were never notified; her own evening-calling ritual consuming two hours.
**Objections + responses**: "calling works fine" → calling becomes the manual record path, one click per outcome, with the tally the queue shows (her calls become data); "what if the customer doesn't reply?" → expiry + the honest unconfirmed-dispatch decision, recorded with a reason; "will technicians actually update status?" → the mobile view is one-thumb state buttons, not forms (03 CP-2).
**Verbatim (paraphrase)**: "I confirm forty visits by phone every evening. If the customer later says nobody called, it's my word against theirs."

## Persona 3 — Waleed, Senior Technician (the mobile user)

**Role**: AC technician, eight years on Riyadh villa calls; reads Arabic and basic English; works from a phone with a cracked screen, one-handed, often standing in a stairwell. Today his "system" is WhatsApp voice notes and photographs of paper slips.
**Context**: ten-plus visits a day during peak season; hates typing on the phone; his status updates are currently "on my way" voice notes to the group.
**JTBD**: "When I finish a job, I want to close it on my phone in two taps with a photo-free note, so the next address and window are already in front of me without calling the office."
**Triggers**: being sent to a job whose customer was never confirmed (empty house, wasted trip); needing the office to resend an address mid-traffic; a completion dispute where his voice note vanished in the scroll.
**Objections + responses**: "I won't type reports" → pause reasons and completion notes are one-tap chips plus optional free text; "another app?" → the mobile view is the job cards, nothing else; "what if there's no signal in the basement?" → actions queue offline and reconcile (P20; 03 CP-2 edge).
**Verbatim (paraphrase)**: "Give me the address, the window, and a big button that says I arrived. The rest is the office's business."

## Persona 4 — Basma, Service Supervisor / Quality Lead (the audit reader)

**Role**: service-quality supervisor at the same Dubai facility-services company; owns escalation handling and the monthly report to two contract clients. When a customer disputes a visit — timing, attendance, completion — she reconstructs the day from chat scrollback and her dispatcher's notebook.
**Context**: reads English reports, works in Arabic; needs evidence she can forward, not screenshots.
**JTBD**: "When a customer disputes a visit, I want the job's full timeline — confirmations, arrival, pauses, completion sign-off — exportable in both languages, so the dispute ends with a document instead of a debate."
**Triggers**: a contract client's monthly "prove attendance" request; a no-show dispute where the company and customer each remember a different day; an insurance-style claim on a damaged unit requiring the visit record.
**Objections + responses**: "is a customer reply legally binding?" → touchpoints are operational records with named source and timestamp, attested staff records where the customer is unreachable — accountability artifacts, not contracts (mirrors the asset-register-tracker signature posture, its 12 Q-5); "will exports expose customer phone numbers?" → exports carry minimum facts (12 Q-8, 08 risk flags).
**Verbatim (paraphrase)**: "I don't need more cameras on technicians. I need the visit to leave a paper trail that writes itself."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Salem | call → scheduled job card → dispatched technician → provable day | per call, all day | "I already have WhatsApp" |
| Nora | day-of confirmation sweep → gate-clean dispatch run | daily (evening + morning) | customers who never reply |
| Waleed | job card → arrived → work done → next card, one-thumb | 6–12×/day | typing on a phone |
| Basma | dispute → full bilingual timeline export | per dispute / monthly | evidentiary weight of records |

## Voice derivation (SME-J)

Dispatch-desk voice: floor-plain — present-tense state, past-tense outcome, numbers in the sentence ("3 jobs awaiting confirmation"). Arabic UI copy is فصحى بيضاء, utility register; imperative softened with لطفاً only in customer-facing touchpoint copy (the customer is spoken to politely; the board speaks fact). Warmth lives in success moments only; errors carry [what]+[why]+[next] per copy-voice §1.4 and never blame the dispatcher or the technician. Fixed terminology (one concept, one term, everywhere — copy-voice §3):

بطاقة العمل=job card · التوزيع=dispatch · الفني=technician · العميل=customer · نافذة الزيارة=visit window · التأكيد=confirmation · نقطة التواصل=touchpoint · لوح التوزيع=dispatch board · طابور التأكيدات=confirmation queue · تسجيل الوصول=check-in · إيقاف مؤقت=pause · الاعتماد على الإنجاز / اعتماد الإتمام=completion sign-off (locked to اعتماد الإتمام) · عدم الحضور=no-show · إعادة الجدولة=reschedule · ورقة اليوم=day sheet · المهمة غير المؤكدة=unconfirmed dispatch · المهمل/Mؤجل — rejected synonyms: وظيفة/خدمة for "job" (one term: بطاقة العمل), رسالة تأكيد العميل word-order variants — "التأكيد" always.

Numerals: Western everywhere (ledger row — data/dispatch surface; storage canonical, display formatted). Technician names and addresses render at their own script and direction inside isolating containers (rtl-rules §2); phone numbers never flip.
