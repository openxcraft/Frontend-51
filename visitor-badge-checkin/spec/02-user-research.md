# 02 — User Research: visitor-badge-checkin

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (category/pricing sources, GCC-integrator pages, hospitality-customs sources 38–42, privacy sources 50–54); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Muna, Office Administrator / Front-Desk Lead (primary)

**Role**: office administrator at a 180-person Riyadh professional-services firm (seed org in 07c is modeled on her workplace). Runs a staffed lobby with one receptionist under her; greets 15–40 visitors a day — client partners, auditors, job candidates, vendors, delivery-repair technicians. Speaks Arabic at the desk and English with the expat staff; the paper logbook is her system of record today, and the badge sticker sheet her badge "policy".
**Context**: her lobby is a hospitality surface first — coffee and dates for waiting guests (sources 38–40) — and a record-keeping surface second. Her worst moments: a candidate left waiting 25 minutes because the host was in a meeting and nobody called; an auditor asking for last month's visitor list and the logbook page being torn out; a vendor still wearing yesterday's badge.
**JTBD**: "When a visitor walks in, I want their host notified the moment check-in finishes — with a record of it — so nobody sits in reception wondering whether anyone knows they arrived, and when anyone asks who is in the building, I can answer in one export."
**Triggers**: the 25-minute abandoned candidate; the auditor's request; a VIP delegation arriving during Ramadan reception hours with three hosts and no pre-registration; handwritten badges being unreadable at a glance (name, host, date).
**Objections + responses**: "we already have a paper book that works" → the paper book cannot notify, cannot compute who is in the building, and cannot export (01 indirect competitors); "another per-user subscription?" → per-front-desk pricing; hosts free, because the notification loop dies if hosts cost money; "visitors won't fumble a kiosk" → three-field walk-in form, Arabic-first, one-thumb targets, and the returning-visitor match that remembers their last details (research digest Q7/Q13 conventions).
**Onboarding motive**: pre-register tomorrow's first guest tonight, and tomorrow watch the notification land — the product's promise is proven in one morning shift.
**Verbatim (paraphrase, persona voice)**: "I don't need a security system. I need the host out of their chair when their guest is in mine."

## Persona 2 — Khalid, Host Employee (the notification loop's other half)

**Role**: senior consultant at the same firm; hosts 3–8 guests a week (client meetings, candidate interviews). Today he pre-registers nothing — he messages the receptionist on the office chat "expecting Ms. Noura at 11" and hopes she is at the desk.
**Context**: thin, mobile-ish user. He will open a host-mode surface on his phone from a notification link; he will never learn the desk surfaces. He pre-registers from his laptop when he remembers, which is the behavior the invitation composer is shaped around.
**JTBD**: "When I invite a client to the office, I want reception to know who, when, and why before they arrive — and to be told the second they check in — so I stop racing downstairs to beat my own guest to the lobby."
**Triggers**: a guest who arrived while he was finishing a call; a missed chat message to the receptionist; a candidate the front desk could not place ("are you here for the interview? with whom?").
**Objections + responses**: "I won't use a new tool for guests" → host mode is a link and a two-minute composer, not a seat to learn; "will it spam me?" → notification tiers per class, instant only for arrivals (P21); "privacy — why does the system need my guest's phone number?" → phone is optional at kiosk, used only for the returning-visitor match, retention-configurable (12 Q-8).
**Verbatim (paraphrase)**: "Tell me they've arrived. That's the whole job."

## Persona 3 — Salma, Facilities & Compliance Coordinator (secondary, the record's owner)

**Role**: facilities coordinator overseeing three floors; answers to management after every incident review and to external auditors annually. Owns the questions: who was in the building during the incident window, and can we prove the visitor record is honest?
**Context**: reads the visitor log, not the kiosk. Wants the in-building list ("fire list"), the day's export, retention she can defend (sources 50–54: no fixed legal period; "no longer than necessary"; PDPL records-plus-five-years reading in 74), and badges that visibly expire so a vendor cannot wear Monday's badge on Thursday.
**JTBD**: "When an incident or an audit asks who was in the building and when, I want a computed, exportable answer from the visitor log — with badge validity, voids, and corrections visible — so I stop reconstructing history from a paper book."
**Triggers**: an incident review where the visitor page was missing; a vendor wandering floors with an expired badge; an auditor asking how long visitor records are kept and by what rule.
**Objections + responses**: "is this an access-control system?" → no — deliberately not (LOOP-10): badges identify people, hardware is another system's job; "we need watchlists" → out of scope by mandate, recorded honestly in 12 Q-10 posture; "retention is a legal question" → configurable windows with a declared default and exportable archive (12 Q-8) — the product carries the mechanism, the office sets the policy.
**Verbatim (paraphrase)**: "The record has to be boring and provable. Every correction visible, every badge accounted for."

## Persona 4 — Noura, The Visitor (the kiosk's user — transient, first-class)

**Role**: a client-side program director visiting the firm for a 11:00 meeting with Khalid. Arabic-first reader, uses her phone constantly, is wary of leaving her phone number on lobby forms (privacy sentiment per sources 50–53 patterns).
**Context**: she met the kiosk once. Her entire experience is: does the screen speak her language, can she finish in under a minute, does she trust where her data goes, and does she get something recognizable (a badge, a person, an acknowledgement) at the end. She was pre-registered by Khalid — her invitation carries a code.
**JTBD**: "When I arrive at an office I've never visited, I want to announce myself in under a minute, in Arabic, without handing over more than the meeting needs — and see that the person I'm here to see actually knows I've arrived."
**Triggers**: English-only lobby screens that make her guess; forms demanding employer ID and phone when the meeting only needs her name; arriving to find the host "will be told".
**Objections + responses** (kiosk-design answers, not hers to speak): privacy notice at the field that collects (a11y-baseline §5; credential-adjacent disclosure), optional phone with the reason stated, and the retention sentence in plain language (11 copy matrix).
**Verbatim (paraphrase)**: "A minute, in my language, and someone actually comes down."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Muna | visitor arrival → notified host + issued badge + clean record | every arrival (15–40/day) | paper works "fine"; pricing shape |
| Khalid | invite → pre-registered visit → arrival ping | 3–8/week | tool fatigue; notification spam |
| Salma | question "who was in the building" → computed export | per-incident / per-audit | honesty of the record; retention defensibility |
| Noura | arrive → announced, badged, welcomed | per-visit | language trust; data minimization |

## Voice derivation (SME-J)

Front-desk voice: **lobby-plain** — courteous, brisk, hospitality-first. Visitor-facing kiosk copy is short imperative sentences with the softening register MSA allows (تفضل/لطفاً used sparingly per copy-voice §3); desk copy is professional-neutral; errors never blame the visitor (a failed code lookup is our sentence to fix, not theirs). Warmth lives in welcome and success states; failure copy states the fact and the next action (copy-voice §1). Arabic UI copy is فصحى بيضاء. Fixed terminology (one concept, one term, everywhere — 07a glossary): زيارة=visit · زائر=visitor · المضيف=host · الاستقبال=reception/front desk · تسجيل الحضور=check-in · تسجيل المغادرة=check-out · بطاقة الزائر=visitor badge · مواصفة البطاقة=badge spec · الدعوة المسبقة=pre-registration (invitation) · رمز الدخول=check-in code · سجل الزوار=visitor log · من في المبنى=in-building (fire) list. Numerals Western per ledger row (times, counts, dates on badges and logs). "Badge" is never softened to بطاقة تعريف (ID card) — the artifact is a visitor badge (بطاقة زائر) with a spec (مواصفة), always.
