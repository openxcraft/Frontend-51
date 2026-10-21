# 02 — User Research: loyalty-stamp-card

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (practitioner threads 17/44; POS-speed guidance 51; bilingual retail sources 24/25/28; fraud doctrine 19–23); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Faisal, Cafe Owner (economic buyer)

**Role**: owner-operator of a 30-seat specialty coffee shop in Riyadh with 5 staff across two shifts. Runs paper "buy 8 get 1" cards he designed at a print shop; estimates (his own words, paraphrase-marked) that a fifth of the stamps on circulating cards were stamped by someone other than a cashier. Buys the paper cards 500 at a time and still sees regulars lose them weekly.
**Context**: Arabic-first, comfortable in English for tooling; makes software decisions in one evening after Salat al-Isha with a coffee; abandons anything that asks him to change his register.
**Goals**: make the loyalty reward an honest cost instead of a leak; see — without spreadsheets — how many cards are actually alive and how many rewards went out this month; stop reprinting cards.
**Frustrations**: tools that assume a POS he doesn't have; free tiers that meter stamps or members (he refuses to ration a kindness); Arabic reward names that end up hand-written on printed English cards.
**JTBD**: "When I run a stamp program at my counter, I want every stamp recorded against the staff member who issued it and every correction to require a reason, so the loyalty I pay for in free coffee matches the loyalty I actually sold."
**Quote (paraphrase, persona voice)**: "Paper was fine until I counted the stamps I never gave."
**Onboarding motive**: publish one bilingual card and stamp his first real member before the evening rush.

## Persona 2 — Amna, Counter Staff (primary speed user)

**Role**: morning-shift barista, Arabic-first, hourly, 150–200 transactions per shift. Her loyalty ritual today: punch the card mid-espresso-pull while the queue watches.
**Context**: moves between register, machine, and counter; one hand occupied most of the time; tolerates exactly one extra tap per transaction and nothing that asks her to read a manual.
**Goals**: identify a member in one gesture (they show the QR, she scans or they say a phone number); stamp; move on. Redeem a reward without calling the manager for the common case.
**Frustrations**: member search that can't find "ساره" when typed "سارة" (normalization failures); confirm dialogs on every action (P03/P04 discipline is her ally); being blamed for a stamp mistake she can't undo.
**JTBD**: "When a member is standing in front of me with the queue behind them, I want their card resolved and stamped in under three seconds with one hand available, so loyalty never slows the line."
**Quote (paraphrase)**: "If it takes longer than giving change, I'll stop doing it by Thursday."
**Objection + response**: "another screen between me and the coffee?" → the stamper is one field and one key; the member QR does the finding; undo covers her mistakes without the manager.

## Persona 3 — Majed, Shift Manager (integrity owner)

**Role**: evening-shift supervisor at the same cafe; bilingual (Arabic home, English schooling); trains new staff; handles the disputes ("I had 6 stamps, not 4") and the quiet conversations about a colleague's generosity with the stamp marker.
**Context**: reviews the day before close from the back office on a laptop; cares about audit trails the way the portfolio's ledger personas do (P17 instincts).
**Goals**: edit the program (tiers, caps, expiry) without breaking live cards; make corrections with a reason and see them recorded; spot the pattern ("three adjustments by the same staff member in a day") from a surface, not from memory.
**Frustrations**: paper has no answer to "who stamped this"; generic tools offer deletion, which is worse than nothing (deletion hides, correction explains); reward names that exist in one language only, so night staff invent translations on the spot.
**JTBD**: "When I correct a member's card, I want the adjustment to carry a reason code and my name into an immutable ledger, so the correction is part of the record instead of an erasure of it."
**Quote (paraphrase)**: "I don't need to catch anyone. I need the record to make honesty the easy path."
**Objections + responses**: "staff will hate gates" → the manager gate applies only to corrections, never to stamping; "I can't babysit a dashboard" → flags are deterministic thresholds on the audit surface, not another feed to watch.

## Persona 4 — Noura, Member (transient participant)

**Role**: regular at Faisal's cafe — a designer, Arabic-first, iPhone in hand, already keeps transit passes and boarding passes in her phone wallet.
**Context**: transient like the front-desk products' visitors — she holds no merchant-side account; her entire relationship with the product is a pass view reached from a QR on the counter.
**Goals**: join in seconds at the counter; see her stamps climb and the next reward with its distance ("2 stamps to the cookie"); keep the pass after changing phones; see the reward names in Arabic, with the English there when she shows the pass to an expat colleague.
**Frustrations**: losing paper cards (twice); apps that demand an account, email verification, and marketing consent for a free cookie; passes that render English-only on an Arabic phone.
**JTBD**: "When I visit my regular places, I want one pass per place that shows my progress and works at the counter by showing a code, so the tenth coffee actually becomes free."
**Quote (paraphrase)**: "I'll scan anything once. I'll install nothing for a cookie."
**Objections + responses**: "are they tracking me?" → the record is stamps at this store, phone-matched, with a retention policy the store sets and the pass states (09 privacy posture); no purchase history, no profiling, no marketing list (LOOP-10).

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Faisal | honest, measurable bilingual stamp program without changing his register | setup + weekly glance | tool sprawl / metered kindness |
| Amna | 3-second member identify + stamp at peak queue | 150–200×/shift | anything that slows the line |
| Majed | correction with reason + visible patterns | daily review + edits | gates that punish the honest |
| Noura | carry progress on her phone, redeem with dignity | 1–2 visits/week | accounts, apps, tracking |

## Voice derivation (SME-J)

Console voice: **counter-plain** — short declarative sentences a person can say aloud mid-rush, warm but concrete (copy-voice §1: say the true thing, briefly). Warmth lives in success and empty states ("بطاقتك بدأت — أول ختم بانتظارك"); errors are situation-addressed, never skill-addressed; no cuteness in failure. Arabic UI copy is فصحى بيضاء utility register (copy-voice §3), unvocalized by default. **Terminology locked (one concept, one term everywhere)**: الختم=stamp · البطاقة=card · العميل=member · مكافأة=reward · مستوى المكافأة=reward tier · استبدال=redeem · تعديل=adjustment · سجل التدقيق=audit ledger · منطقة الختم=stamper · بطاقة العميل=member pass · رصيد الأختام=stamp balance? — rejected, stamps are counted not balanced: "عدد الأختام" only · انتهاء الصلاحية=expiry. "Member" renders العميل (retail register language) — never عضو (club connotation, rejected). Numerals Western per ledger row (stamp counts are data: "6 من 8") and never mixed systems mid-sentence. Buttons are verbs with objects: "أضف ختماً", "استبدل المكافأة".
