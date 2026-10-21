# 02 — User Research: abandoned-cart-recovery

SME-B pass · Paraphrased sentiment only, marked (paraphrase) — zero verbatim quotes; personas synthesized from the research digest's practitioner sources (research/batch7/abandoned-cart-recovery-q1…q13) and portfolio-adjacent buyer patterns. Personas use regional names; no real individuals are represented.

## Persona 1 — Nayla, D2C Growth Lead (primary buyer)

**Role**: head of growth at a KSA home-goods D2C brand running bilingual storefronts on a regional platform; she owns the P&L line that reads "recovered revenue" and reports it monthly to a founder who asks why the number moves. She has watched the ~70% abandonment benchmark (01) apply to her own store with mobile-shaped severity, and she is done buying contact-volume seats on a full lifecycle suite to get one flow right.
**JTBD**: "When carts pile up unrecovered, I want a scheduled, inspectable recovery practice my team operates deliberately — sequences, quiet hours, discount discipline — so the recovered-revenue line is something we run, not something a platform does to us."
**Triggers**: a quarter where blanket 15% recovery codes ate more margin than the recovered orders brought (the flat-discount complaint class, 01 q9 — paraphrase); a compliance scare after reading about quiet-hour litigation (01 q4); a suite renewal priced on contacts she mostly does not email.
**Objections + responses**: "Why a console beside my platform's native reminders?" → platform defaults are one rung, one channel, the platform's cadence (01); inspectability and bilingual authoring are the delta. "Will this fight my marketing platform?" → no: channel-abstract, export-first; it sends nothing and owns no contact database of record. "Another seat bill?" → a small operator desk, not contact volume (12 Q-3).
**Pains**: cannot see *when* a message will actually go out versus when it was scheduled (quiet hours happen invisibly inside suites — paraphrase of help-doc-burial sentiment, 01); cannot answer "what did we offer and to whom" with an audit trail; discount policy lives in nobody's head.

## Persona 2 — Faisal, Retention Operator (primary daily user)

**Role**: the retention operator who builds the flows, writes the copy, and watches the queue; bilingual Saudi, comfortable in an English-first console (the workspace default, 05) while writing shopper-facing Arabic copy all day. He lives in Klaviyo-style flow builders at a previous job and distrusts anything he cannot preview.
**JTBD**: "When I build a recovery sequence, I want to write the English and the Arabic side by side, see the exact send times per timezone before anything goes live, and know which carts need a human decision today — so my craft goes into copy and judgment, not into reverse-engineering a scheduler."
**Triggers**: a bilingual send that rendered Arabic subject lines broken or italicized (the RTL rendering failure class, 01 q6); a 2 a.m. send to a US shopper because the flow builder evaluated the store's timezone, not the shopper's (the exact quiet-hours failure our scheduler exists to prevent); copy edits that silently affected a live flow.
**Objections + responses**: "AI writing my Arabic?" → generation is draft-only with provenance, promotes through a review diff, and the template library carries the work when the capability is off (00). "Keyboard-first or I won't live here" → full keyboard traversal map (09), ⌘K palette, no raw-letter shortcuts. "I don't trust previews that lie" → previewSchedule is the same deterministic function the scheduler runs — identical inputs, identical timeline (07c).
**Pains**: writing AR copy in an EN tool treats Arabic as an afterthought locale; timing doctrine confusion (Omnisend's 30 minutes vs Klaviyo's 2–4 hours — the contested doctrine, 01) with no way to see what his own policy actually does; deferred/suppressed sends invisible until a customer complains.

## Persona 3 — Dana, Store & Margin Manager (policy owner)

**Role**: runs store operations for the same brand; co-owns pricing with the founder and is the person who says no to discounts. She cares about value bands (a 40-riyal cart is not a 1,500-riyal cart), about the quiet-hours posture (she read the GCC compliance summaries and wants the store's position explicit, not accidental), and about suppression hygiene after an opt-out complaint.
**JTBD**: "When recovery incentives go out, I want value-band routing and quiet-hours windows I set as versioned policy — so margin discipline and compliance posture are decisions with my name on them, not defaults."
**Triggers**: a recovered order that cost more margin than it made (discount economics, 01 q9); an opt-out shopper who kept receiving messages (suppression failure class); a jurisdiction question nobody could answer ("is 9 p.m. legal there?" — the state-by-state variance, 01 q4).
**Objections + responses**: "Policy surfaces are usually unmaintained graveyards" → policy is three small surfaces (routing, quiet hours, consent basis) with defaults, diffs, and a preview gate before activation. "I don't want to become a lawyer" → jurisdiction windows ship as editable rows with source labels — statutory anchors marked statutory, GCC rows marked workspace policy (12 Q-8); the product never claims legal advice.
**Pains**: discount codes leaking across bands; no record of *why* a window was set; renewal-time arguments built on numbers nobody can reproduce.

## Persona 4 — Karim, Agency Retention Specialist (volume path)

**Role**: retention lead at a 12-person commerce agency serving six D2C brand workspaces across KSA/UAE; he must answer "what did recovery do this month" per brand, and his clients' platforms differ (one regional platform, two global ones, one custom).
**JTBD**: "When a client's month closes, I want per-brand recovery reports and sequence archives I can export and defend — so my reporting is an artifact, not a screenshot of someone's dashboard."
**Triggers**: a client on a platform the agency's main tool does not integrate (channel-abstract intake is the answer — carts arrive by import); per-client policies that must not leak between workspaces (workspace scoping); a client auditor asking for the suppression ledger (evidence export).
**Objections + responses**: "Six brands, six suites?" → one console, six workspaces, channel-abstract; the send-list export covers clients with no bound channel at all. "Contact-volume pricing kills agency margins" → per-seat with generous allowances (12 Q-3). "My clients want *their* numbers, not the vendor's" → the report computes recovery from recorded events per workspace and cites no external benchmark in-product (01 honest gaps).
**Pains**: report assembly by hand each cycle (the pattern every portfolio analytics sibling hears); switching costs between platform-native recovery tools; no cross-brand learning without a shared vocabulary for sequences (the versioned sequence archive is his reusable asset).

## JTBD summary

| Persona | Core job | Frequency | Primary objection → answer |
|---|---|---|---|
| Nayla | unrecovered carts → operated recovery practice w/ P&L answer | monthly review, continuous oversight | "another suite?" → operator sidecar, not contact volume |
| Faisal | build & write → bilingual sequences with visible clocks | daily (queue + authoring) | "AI writing my Arabic" → draft-only generation + template library floor |
| Dana | incentive & compliance posture → versioned policy she owns | per season + at every incident | "policy graveyards" → small surfaces, defaults, preview gate |
| Karim | client cycle → defensible per-brand recovery artifacts | per client, per month | "six brands, six suites" → channel-abstract workspaces + exports |

## Voice derivation (SME-J)

Operator-desk voice: **plain, clock-aware, ledger-honest** — states what is scheduled, what it costs in margin, when the window opens, and what happened, never sells ("Step 2 sends at 09:00 Riyadh time — 23:40 fell inside quiet hours and was deferred to the window's opening"). Arabic register فصحى بيضاء (utility precision); English professional-neutral, contractions off (commerce-governance-adjacent family). Fixed terminology (locked in 07a/11; one concept, one term, everywhere — copy-voice §3): سلة متروكة=abandoned cart · متسوّق=shopper · تسلسل الاسترداد=recovery sequence · خطوة=step · قالب=template · نافذة الإرسال=send window · ساعات الهدوء=quiet hours · تأجيل=deferral · جدول الإرسال=send ledger · قائمة الأولوية / طابور الاسترداد=recovery queue · نطاق القيمة=value band · حافز=incentive · توجيه=routing · إخضاد=suppression · انسحاب=opt-out · تقرير الاسترداد=recovery report · تصدير=export · أولوية=priority. Numbers Western per ledger row (totals, times, counts, percentages — a commerce data surface, design-language-map §7); Arabic strings may run ~125% of English length — layout budgets for it (10) and the 11 matrix lists both strings verbatim (copy-voice §5).
