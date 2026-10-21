# 02 — User Research: kyc-onboarding-flow

SME-B pass · Personas are synthesized from market research (01) and public complaint/discussion patterns (research log, batch8). All verbatims are PARAPHRASES of recurring public sentiment (marked), never invented quotes. Four personas: the applicant (the person the funnel exists to convert — primary on the applicant shell), the KYC operations lead (economic buyer), the reviewer (primary daily console user), and the compliance officer (the audit/dispute authority). The two shells have different primary personas — every design decision below names which persona it serves.

## Persona 1 — Amal, applicant (primary user, applicant shell, phone-only)

**Role**: 29-year-old Egyptian retail supervisor in Riyadh opening a digital-wallet account so her sister can send her money without the exchange-house queue. Her Iqama residence permit is real, valid, and in a drawer at home — not in her hand at 21:40 when she starts the application on her phone in bed.
**Context**: Arabic-first (applicant flow in Arabic, RTL), comfortable with app-switching, distrustful of "government forms" from years of paper bureaucracy; mid-range Android phone, evening data plan. She has abandoned a bank's onboarding before — the form asked for her document "now" and offered no way back.
**JTBD**: "When I open a wallet account at night and realize my Iqama is in the other room, I want the application to save itself and let me finish tomorrow from where I stopped — without re-typing my name and number into a form that already asked me."
**Triggers**: the evening sign-up intent; the moment the document step demands the physical card; a glare-heavy retake loop under her bedroom lamp; a needs-attention message after review ("your document's back side didn't match the front").
**Objections**: "it will eat my answers like the last bank's form did" (autosave is a visible, persistent state — P10 — not a hope); "they'll make me take the photo a hundred times with no reason" (each failed gate names itself: وهج، ضبابية، إطار — the failing rule is the message); "why do they need my face if they have my ID?" (the presence step is policy-optional with its purpose stated and an alternative path — a11y-baseline §7); "if I stop, will they keep my data forever?" (retention policy stated at attestation, 11).
**Onboarding motive**: complete the identity steps in the first session and FEEL the application persist — the resume link arriving by message is the proof moment.
**Verbatim (paraphrase of recurring applicant sentiment in fintech onboarding threads)**: "I got to the photo part, my card was in the car, and that was the end of it."

## Persona 2 — Khalid, KYC operations lead (economic buyer, admin role)

**Role**: onboarding ops lead at a Riyadh digital wallet (Sadeem-class, ~4,000 applications/month); owns two numbers on the same slide: onboarding completion rate and review backlog SLA. Hired two reviewers last quarter because the queue aged; watched completion sit at 61% while marketing spend doubled.
**Context**: Saudi, bilingual ar/en (dashboards in English, applicant copy in Arabic — he reviews both); desktop + evening phone checks. Has trialed an IDV platform SDK embedded in three screens; the completion curve didn't move because the drop-off was at the document step and the resume behavior was a cookie.
**JTBD**: "When I present the onboarding funnel to the board, I want to show where applications die, what we changed in the flow, and what happened to the reviewers' queue — so the board funds flow work, not just more checks."
**Triggers**: the monthly conversion review; a regulator's question about a rejected applicant; a reviewer quitting over ticket-tool friction; the UAE e-KYC utility news prompting a tooling audit (01 §4.1).
**Objections**: "another SDK wrapped in nicer screens?" (the product is the flow entity + the console, capability-abstract — his EXISTING verification binding plugs in as an abstract capability, 08 N1); "my compliance officer will hate a new decision surface" (the decision discipline is the product: reason codes, immutable chains, two-click dispute export — CP-5); "we'll re-train reviewers again?" (the console is keyboard-first with one-key decisions and zero configuration for the reviewer role — 04 role routing); "what happens when we switch verification engines?" (nothing visible: the adapter is the boundary, machine assessments arrive as typed inputs with provenance — 07b).
**Onboarding motive**: stand up the flow spine in 30 minutes (00 success signal 3), bind NOTHING (degradation test), and read the operational counters after one week of real applications.
**Verbatim (paraphrase of ops-lead sentiment)**: "The SDK's demo converts at 100% — because demos don't run at 21:40 on a cracked screen with a lamp for lighting."

## Persona 3 — Maryam, reviewer (primary daily user, review console)

**Role**: KYC reviewer at the same wallet; works the queue 6 hours a day, 40–60 tasks, deadline-stressed at month-end. Today she reviews in a ticketing board: applicant documents in one tab, the verification vendor's dashboard in another, decisions in a comment field with no structure.
**Context**: Jordanian, Arabic-first (console in Arabic, English field labels tolerated); desktop, two monitors, fast typist, keyboard-first by conviction. Her recurring edge cases are exactly the industry's: blurry IDs, minor name mismatches (01 §9).
**JTBD**: "When I open the review queue at 08:00, I want the twelve oldest tasks ranked by deadline with their documents, quality reports, and mismatch flags already assembled — so I decide in ninety seconds and never hunt across tabs."
**Triggers**: the morning queue; a task aging past SLA; a rework round returning (did the applicant fix the document?); an escalated task from the evening shift.
**Objections**: "will it make me click through evidence like the vendor dashboard?" (the Evidence Dossier is one surface, layered, keyboard-navigable — CP-5.3); "what if I disagree with the machine's assessment?" (machine assessments render as inputs with provenance, never verdicts — she decides, with reason codes; disagreeing is a first-class path); "decisions must be defensible in an audit" (every decision chains to evidence + rationale, immutable — 07a); "rework loops are where I lose time" (request-rework targets exact steps; the applicant's notice names them; the return lands in MY queue flagged round 2 — CP-5.5).
**Onboarding motive**: clear her first 12-task queue keyboard-only in the first session — the dossier, the reason codes, and the deadline ribbons all visible without training (00 success signal 2).
**Verbatim (paraphrase of reviewer sentiment)**: "A blurry document in my queue is five minutes gone for the applicant AND me; I'd rather the phone told them at the camera."

## Persona 4 — Sami, compliance officer (audit & dispute authority, admin role read-path)

**Role**: compliance officer at the wallet; answers to SAMA-class examination posture and the wallet's own MLRO. Owns the question every rejected applicant's lawyer or the regulator asks: show me the file.
**Context**: Saudi, bilingual; desktop; reads ledgers, not queues. Currently assembles "the file" from screenshots, the ticket tool's export, and email.
**JTBD**: "When the regulator asks why applicant X was rejected in March, I want the complete chain — documents, quality reports, machine assessments, reviewer decision with reason codes, rework rounds, attestation — in two clicks, exportable, with nothing edited after the fact."
**Triggers**: a regulatory examination; an applicant dispute reaching support; a periodic internal audit; a policy change requiring justification of past decisions.
**Objections**: "audit trails are always afterthoughts bolted on" (the ledger is a top-level destination — 04; every consequential mutation appends, P17, by contract rule); "machine assessments in the file will scare the examiner" (provenance is displayed: engine, version, timestamp — the examiner sees a human decided, with the machine as input — the Gradient Labs debate formalized, 01 §2); "how long do we retain applicant documents?" (retention policy is workspace data surfaced in policy — 12 Q-8); "exports must carry expiry discipline" (artifacts with declared windows, async-contract §2).
**Onboarding motive**: resolve one seeded dispute end-to-end via the ledger view in the first session (00 success signal 4).
**Verbatim (paraphrase of compliance sentiment)**: "The file isn't what happened — it's the only surviving record of what happened."

## JTBD summary matrix

| Persona | Core job | Trigger frequency | Primary objection to overcome |
|---|---|---|---|
| Amal | Finish a high-stakes application across interruptions, without re-work or mystery failures | one application per relationship, evening sessions | data-loss fear + opaque capture failures |
| Khalid | Convert the funnel AND keep the review queue honest — with one tool story for the board | monthly reviews, ad-hoc audits | SDK-fatigue + engine lock-in fear |
| Maryam | Decide 40–60 applications a day at keyboard speed, defensibly | daily, 2 crunches (08:00 / month-end) | tab-hopping evidence + unstructured decisions |
| Sami | Produce the complete decision file on demand | audits ad-hoc; policy changes quarterly | audit trails as afterthoughts |

## Onboarding motives → flow mapping (feeds 03)

First-session value proof per persona drives first-run: applicants land on the ENTRY doors with the resume contract stated up front (CP-1); the ops lead's path is flow-program spine → templates → policy (CP-6); reviewers land on the QUEUE (CP-5); compliance lands on the LEDGER dispute test (CP-5.8). The P22 onboarding checklist (04 S14) offers four entry paths — one per persona — each linking directly into the flow that achieves it; no tours-of-balloons (ux-patterns §22).

## Objection → design response matrix (spec-level sales honesty; every 02 objection answered)

| Persona | Objection (above) | Where the spec answers it |
|---|---|---|
| Amal | "it will eat my answers" | autosave is a persistent visible state cycling saving → saved → conflict per P10 (03 CP-2.4); drafts survive timeout and device change by entity design (07a Application lifecycle); the resume link returns to the exact step with prior answers rendered as recalled (P11 marking — CP-1.4) |
| Amal | "photo loop with no reason" | every capture gate failure names itself in words ("وهج" / "glare") with the failing metric shown and the fix instruction (CP-3.4; 11 §D2 quality-report copy); retakes are unlimited within policy; the assist capability enriches guidance when bound and degrades to the checklist never-worse-than-rules (08 N2) |
| Amal | "why my face?" | the presence step is policy-optional (FlowProgram), its purpose is stated in copy, and it always carries an alternative path — a11y-baseline §7's "no biometric step is the only path" is a contract rule (07b rule 8) |
| Amal | "data kept forever?" | retention policy is workspace data declared at attestation (11 §D7) and surfaced in policy center (12 Q-8); withdrawal discards drafts on request (CP-4.6) |
| Khalid | "another wrapped SDK?" | capability-abstract adapter: verification assessment is ONE abstract need (08 N1) whose results arrive as typed, provenance-labeled inputs; the flow, resumability, and console are the product (00; 07b has no engine-name anywhere) |
| Khalid | "compliance will hate it" | reason-coded decisions, immutable chains, two-click dispute export (CP-5.8; 07b rule 10) — the console IS the compliance surface |
| Khalid | "re-training reviewers?" | reviewer role sees zero configuration surfaces (04 role routing); one-key decisions; the 12-task < 5 min signal is the training plan (00) |
| Khalid | "switching engines?" | the adapter boundary means engine changes are binding-time events (08 N1); machine assessments keep the same typed shape; the UI never names the engine (LOOP-5, credential-contract §2) |
| Maryam | "evidence click-through" | the Evidence Dossier assembles everything one surface deep, keyboard-navigable, with mismatch flags pre-computed (CP-5.3; 06 EvidenceDossier) |
| Maryam | "disagree with the machine?" | assessments render with provenance and confidence-shown-as-input; the decision is always hers with reason codes (07b rule 4: machine output never auto-resolves a task) |
| Maryam | "defensible decisions" | every decision writes an immutable ReviewDecision + ActivityEntry chain (07a); the dispute view assembles it in two clicks (CP-5.8) |
| Maryam | "rework time sink" | request-rework targets exact step ids; the applicant notice names them; round-2 returns flagged and deadline-adjusted (CP-5.5; 07c §2.3) |
| Sami | "audit afterthoughts" | ledger is a top-level IA destination (04); no mutation path bypasses the accountability record (07b rule 10) |
| Sami | "machine in the file" | provenance sentences in both locales state engine + version + that a human decided (11 §D4); the deterministic capture gates are published spec rules (07c §2.1) |
| Sami | "retention" | workspace retention policy (12 Q-8); exports carry expiry windows (async-contract §2) |
| Sami | "export discipline" | ledger export is a Job with artifact + expiry + renewal (CP-6.9; async-contract §2) |

## Voice derivation (feeds 05/11 via SME-J)

Two registers, two surfaces, one product. **Applicant-facing copy: فصحى وسطى (middle MSA)** — a trust surface under high stakes: calm, respectful, second-person-plural courtesy where addressed, no urgency theater, no dark patterns; reassurance copy states data use plainly (CleverTap's reassurance-nudge pattern, adopted with the copy-voice discipline). **Console chrome: فصحى بيضاء (plain MSA)** — precise, evidence-forward, actor-named. English: professional-neutral, contractions off (specialized family, governance-adjacent). One concept, one term, everywhere (glossary pinned in 11 §I): طلب = application · مقدّم الطلب = applicant · خطوة = step · مستند = document · التقاط = capture · الإطار = frame · وهج = glare · ضبابية = blur · مراجعة = review · قرار = decision · رمز السبب = reason code · إعادة العمل = rework · استئناف = resume · جلسة = session · إقرار = attestation · دليل = evidence · السجل = ledger · بوابة الجودة = quality gate. Numbers render Western in BOTH locales (ledger numeral policy — data/finance surface); never mixed mid-sentence (copy-voice §1.7). Errors follow [what]+[why]+[next] and never blame the applicant's skill ("تعذّر قراءة المستند — وهج على الزاوية العلوية. ابعد المستند قليلاً عن الضوء وأعد المحاولة" — the failing gate IS the why). Success moments are calm-warm; the only ceremony is the fold (05 motion signature) and the decision seal — never confetti (motion-language §2). Warmth lives in the resume moment ("استؤنف طلبك من حيث توقفت" — the sentence the product exists to make true), never in failure copy.
