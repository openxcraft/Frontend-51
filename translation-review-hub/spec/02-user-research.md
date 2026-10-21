# 02 — User Research: translation-review-hub

SME-B pass · Paraphrased sentiment only, marked (paraphrase) — zero verbatim quotes; personas synthesized from the research digest's practitioner sources (research/batch3/trh-q1…q8) and portfolio-adjacent buyer patterns. Personas use regional names; no real individuals are represented.

## Persona 1 — Rana, Localization Lead (primary buyer)

**Role**: runs a 6-person localization pod inside a MENA fintech's product org; every biweekly release ships an English source and an Arabic target across product UI, legal/privacy copy, and campaign pages. Translation arrives from an external agency plus an internal post-editing pass; Rana owns the release-quality answer when something ships wrong.
**JTBD**: "When translated content lands for a release, I want every segment reviewed against our terminology and UI budgets before sign-off, so I can defend what shipped — to regulators, to support, and to my own VP — with an audit trail, not a screenshot of a chat thread."
**Triggers**: a regulator-facing privacy screen that shipped with the wrong Arabic term for "account statement"; a UI release where Arabic button labels overflowed their containers (paraphrase of the layout-overflow failure class, digest q8); an agency deliverable that passed a spreadsheet spot-check and still failed in-country reading.
**Objections + responses**: "We already pay for a TMS — why another seat?" → reviewers outnumber translators in her flow and don't live in CAT tooling; a reviewer-first seat is cheaper than production seats (01 pricing). "Will this replace our reviewers' judgment?" → the product's checks are deterministic rules; decisions, overrides, and sign-off are human and logged. "Another tool to onboard the agency into?" → intake is paste/upload; no vendor routing, no marketplace (LOOP-10).
**Pains**: review happens in shared sheets where terminology decisions evaporate between releases; sign-off is an email that proves nothing later; critical vs. advisory term issues arrive undifferentiated (digest q2 — the severity convention practitioners already trust in Xbench-class tools).

## Persona 2 — Yusuf, Senior Arabic Reviewer (primary daily user)

**Role**: in-country linguistic reviewer, 12 years across legal, fintech, and product UI; reviews 400–900 segments on a heavy day; cares about فصحى register precision, term fidelity, and not being blamed for overflow he flagged verbally and nobody recorded.
**JTBD**: "When I open a batch, I want to read source and target side-by-side with the terminology already flagged and my decisions one keystroke away, so my expertise goes into judgment, not into hunting terms in a separate glossary PDF."
**Triggers**: glossary drift — the same English term rendered three different ways in one document (digest q3: terminology inconsistency as rework driver); length complaints from design that arrive as screenshots after ship; fatigue from flipping between a CAT preview, a glossary spreadsheet, and a bug tracker (paraphrase of tool-hopping sentiment, digest q1).
**Objections + responses**: "I don't want an AI telling me my Arabic is wrong" → declared non-AI: normalized term matching and length arithmetic only; the machine proposes findings, he disposes (00). "Keyboard-first or I won't use it daily" → full keyboard traversal map (09) with no raw-letter shortcuts (Arabic-layout conflicts, a11y-baseline §3). "False positives will waste my day" → every finding resolves as edit / false-positive / recorded override, and false-positive rates are reviewable per glossary (07c rule).
**Pains**: RTL corruption when reading mixed-script segments in LTR-first tools (digest q8 — bidi isolation as the fix, rtl-rules §2); truncation and wrapping of long Arabic words in narrow panes (rtl-rules §4); re-checking the same term violation across dozens of segments by hand.

## Persona 3 — Sarah, Source-Content Owner (English side)

**Role**: product marketing manager who writes the English source; she is not a localization professional and will never learn a CAT tool, but she owns the queries: is "settlement account" the same as "clearing account" in this screen? Can the button label be 3 characters shorter?
**JTBD**: "When a reviewer has a question about my copy, I want to see exactly the segment pair in question and answer in place, so the release doesn't wait on a meeting."
**Triggers**: queries arriving as out-of-context screenshots pasted into chat; last-minute source edits that invalidate reviews already done (version staleness, 03 CP-2 edge); being asked to shorten labels with no idea of the Arabic budget consequence.
**Objections + responses**: "I'm not learning review software" → viewer seat: read the pair, answer the query, see the length meter; that's the whole surface for her (07b Session role 'viewer'). "Why can't they just decide?" → register/domain nuance sometimes only the source owner can settle; the query state exists precisely for this (03 CP-2).
**Pains**: no shared referent for "which string" — segment numbers and pair view give the referent (04); guessing character budgets blind.

## Persona 4 — Omar, Localization QA Analyst at a small LSP (volume path)

**Role**: QA analyst at a 15-person language services provider delivering ar↔en work to four retained clients; runs batch QA today in a desktop checker, assembles findings into a client report document, and repeats the assembly by hand each delivery cycle.
**JTBD**: "When a delivery cycle closes, I want the QA findings, resolutions, and sign-off exported as one package per client, so my report assembly stops being an evening of copy-paste."
**Triggers**: client auditors asking how a known term violation passed (needs the override reason trail, 07a); per-client glossaries that must not leak into each other (workspace scoping, digest q1 role-based workflows as category norm); checker reports that name errors but not *decisions* (digest q2).
**Objections + responses**: "Our checker already finds these" → finding ≠ resolution: this product's finding lifecycle ends in a decision and an export artifact (07b resolveQaFinding/signOffReviewJob). "Per-seat pricing punishes my bench" → recommended reviewer-seat model with viewer seats free (12 Q-3). "Clients want *their* tool" → export-first posture: the deliverable is a self-contained package, no destination binding required (08 N2).
**Pains**: report assembly by hand each cycle; override memory living in email; client-specific severity policies (critical for client A is advisory for client B) — modeled as per-glossary term severity (07a).

## JTBD summary

| Persona | Core job | Frequency | Primary objection → answer |
|---|---|---|---|
| Rana | translated batch → defensible sign-off w/ audit trail | per release (biweekly-ish) | "another seat?" → reviewer-first economics |
| Yusuf | segment stream → precise decisions, fast | daily (400–900 segments) | "no AI judgment" → non-AI declaration |
| Sarah | reviewer query → in-place answer | few per week | "no new software" → viewer seat, one surface |
| Omar | delivery cycle → client QA package | per cycle | "checker already finds" → findings + resolutions + export |

## Voice derivation (SME-J)

Reviewer-desk voice: **precise, unhurried, evidence-first** — states what the rule found and what the human decided, never editorializes about the translation's quality ("Term violation: 'عربة التسوق' found; glossary mandates 'السلة' — edit, override with reason, or mark false-positive"). Arabic register فصحى بيضاء (utility precision surface); English professional-neutral, contractions off (governance-adjacent family). Fixed terminology (locked in 07a/11; one concept, one term, everywhere — copy-voice §3): مهمة مراجعة=review job · مستند=document · مقطع=segment · زوج المقاطع=segment pair · المصدر/الهدف=source/target · مسرد=glossary · مصطلح=term · مخالفة مصطلحية=term violation · تحذير ملاءمة الطول=length-fit warning · ملاحظة اتساق=consistency finding · قرار المراجعة=review decision · اعتماد نهائي=sign-off · تصدير=export · مراجع=reviewer. Numbers Western per ledger row (counts, ratios, character budgets — a data surface, design-language-map §7); Arabic strings may run ~125% of English length — layout budgets for it (10) and the 11 matrix lists both strings verbatim (copy-voice §5).
