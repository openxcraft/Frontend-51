# 02 — User Research: clinic-appointment-desk

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (q3 suite-buyer comparison threads, q5/q8 MENA channel sources, q9 front-desk workflow sources); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Reem, Lead Receptionist (primary)

**Role**: lead receptionist at a three-provider family clinic in Riyadh (GP, pediatrics, dental); eight years at the desk; answers the clinic phone, the WhatsApp business thread, and walk-ins simultaneously during the morning rush. Runs today's day sheet in a paper ledger plus the clinic's WhatsApp history as her memory of who was promised what.
**JTBD**: "When a patient cancels at 9:47 for an 11:00 slot, I want the next eligible waiting patient proposed to me with the reason they're first, so I spend the 73 minutes calling one right patient instead of scrolling a list hoping."
**Triggers**: the mid-morning cancellation with no refill path; a double-booked slot she discovers when both patients are in the waiting room; the evening receptionist not knowing what she promised a patient in the morning.
**Objections + responses**: "the day sheet on paper works" → the exported day sheet here prints better than the ledger, and the cancellation→offer loop is the thing paper never did; "patients won't reply to messages" → the phone path is first-class with a prepared bilingual script; replies are a bonus, not a dependency; "another system the clinic abandons" → the console is one surface (the day board) with the rules rendered in-product — nothing to train on that isn't visible.
**Onboarding motive**: bring one real clinic day, watch the waitlist fill one real cancellation in the first 15 minutes.
**Verbatim (paraphrase, persona voice)**: "The doctor's 11 o'clock just cancelled. Give me someone to call — and tell me why it's them."

## Persona 2 — Maha, Clinic Manager (economic buyer)

**Role**: office director of the same clinic; owns provider schedules, the reminder policy, and the monthly review with the owner-director where fill rate and no-show losses are counted by hand from the paper ledger.
**JTBD**: "When the owner asks what the 40 no-shows last month cost us, I want the day counts and the no-show pattern list ready and honest, so the conversation is about policy, not anecdote."
**Triggers**: the owner-director's monthly questions; a receptionist waiving the cancellation policy inconsistently because nothing is written down; the decision of whether to call patients who miss appointments before rebooking them.
**Objections + responses**: "AI scores will do this better" → the flags here are counts she can verify appointment-by-appointment in front of the patient's file — no black box in a clinical setting (01 counter-position); "we don't want to punish patients" → the flag never blocks a booking; it ranks waitlist offers and informs staff — the policy panel says so in writing; "suites give us more" → suites give charting and billing she does not buy here (LOOP-10), at per-practitioner prices with add-on creep (01 pricing).
**Onboarding motive**: configure the reminder ladder and read the policy panel once — if the rules read like arithmetic, she trusts the machine.
**Verbatim (paraphrase)**: "If the system flags a patient, I need to see the three appointments behind that flag myself."

## Persona 3 — Dr. Faris Haddad, Pediatrician (thin provider participant)

**Role**: pediatric provider, two session blocks a day, sees 25–30 patients; wants his day legible at 8:00 AM and hates discovering a double-booking when both families are in the waiting room.
**JTBD**: "When I start my day, I want my column on one board with every appointment's state already true, so I walk into the room knowing who is checked in and who is missing."
**Triggers**: a double-booked vaccination slot; a no-show he learned about at noon; his day sheet being wrong at the morning huddle.
**Objections + responses**: "I don't want to learn software" → his surface is review-only: his column, his day sheet, marking consult states — nothing else; "will it put two babies in one chair?" → the overlap rule is hard arithmetic and refuses the booking with the named conflict (03 CP-1); "I was promised an AI assistant" → this is not that; it is a ledger that doesn't double-book, and the front desk that fills cancellations.
**Onboarding motive**: the printed day sheet at the morning huddle, correct, with states.
**Verbatim (paraphrase)**: "I don't need smart. I need my 9:20 to exist exactly once."

## Persona 4 — Yasmin, Evening Desk (bilingual operator)

**Role**: part-time evening-shift receptionist; handles the English-speaking expat families and the Arabic-speaking ones in the same hour; today she rewrites reminder texts by hand in both languages.
**JTBD**: "When I confirm tomorrow's appointments, I want each patient to get the reminder in the language their file says, so I stop hand-writing two versions of every message."
**Triggers**: a patient replying "sorry, I don't read Arabic" to an Arabic reminder; the evening rush of next-day confirmations she chases by phone; templates she cannot keep consistent with the morning shift's.
**Objections + responses**: "our patients are on WhatsApp, not SMS" → the outbound channel is abstract — templates render per patient locale wherever the clinic binds the channel, and the copy-script path works through whatever app the patient actually uses (08); "English patients are an afterthought here" → both locales are full citizens: templates, scripts, search, and the console itself flip by workspace locale (05 direction model).
**Onboarding motive**: send tomorrow's reminder batch and watch each one render in its patient's locale.
**Verbatim (paraphrase)**: "One patient answers in English, the next in Arabic — the desk has to speak both without me translating in my head."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Reem | cancellation → offered, accepted refill | daily, per cancellation | must beat the paper list on the first try |
| Maha | policy + monthly honesty about no-shows | monthly + at setup | trust: verify-before-believe on flags |
| Dr. Haddad | legible, conflict-free day | daily 8:00 AM | zero learning budget |
| Yasmin | bilingual outbound + next-day confirmation sweep | every evening | both locales first-class |

## Voice derivation (SME-J)

Reception-desk voice: calm-plain, present tense, names and times over adjectives (copy-voice §1). The desk is a care surface — warmth lives in success and empty-state copy, never in errors; no urgency theatrics (the console is calm motion and calm language). Arabic UI copy is فصحى بيضاء utility register; patient-facing outbound copy is simple MSA with the clinic's name and the appointment facts (time, provider, cancellation-policy line the clinic itself wrote — 07c templates). Fixed terminology (one concept, one term everywhere): الموعد=appointment · الحجز (verb يحجز)=to book · الطبيب=provider · نوع الزيارة=visit type · قائمة الانتظار=waitlist · التعبئة التلقائية=auto-fill · عدم الحضور=no-show · وسم نمط عدم الحضور=no-show pattern flag · التذكير=reminder · سلسلة التذكيرات=reminder ladder · تسجيل الحضور=check-in · العرض=offer · الاستقبال=front desk · كشف اليوم=day sheet · الفترة=slot. Numerals Western per ledger row (times, counts, phone numbers are data). "No-show" is never translated loosely — عدم الحضور everywhere, never تغيّب in one screen and عدم حضور in another.
