# 02 — User Research: policy-acknowledgment-portal

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (sources cited per the research digest numbering); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Layla, Compliance Administrator (primary)

**Role**: compliance admin at a 240-person multi-site trading group headquartered in Riyadh with offices in Dubai and Doha; a two-person governance team (Layla + the group GC) owning a register of ~30 live policies — code of conduct, information security, acceptable use, health & safety, anti-bribery — each existing in an English master and a lawyer-reviewed Arabic side, maintained in a shared drive plus a spreadsheet of who signed what, assembled by memory and email chasing.
**JTBD**: "When a policy changes or an auditor arrives, I want every employee's acknowledgment pinned to the exact bilingual version they were shown, with coverage I can compute in one look and export as evidence, so I stop rebuilding the proof from an inbox the night before an audit."
**Triggers**: a superseded information-security policy that half the company never re-acknowledged (the spreadsheet says "signed 2024" but the version changed twice since); a customer security review asking for per-version attestation records; Saudi NCA ECC evidence conversations pushing the team from annual assumption-based compliance toward continuous evidence (digest [40]); the Arabic-side obligation — workplace policies must be in Arabic even if bilingual (digest [33]) — turning every English-only acknowledgment into a gap.
**Objections + responses**: "another GRC suite I can't afford or staff?" → a focused portal, admin seats only, free acknowledger seats (12 Q-3); "our policies live in the drive, I won't re-author them" → bodies are uploaded/pasted and stored whole — no authoring, no re-formatting (LOOP-10); "will it mangle the Arabic?" → each locale renders at its own direction, per-locale read evidence, and the governing-locale rule mirrors KSA Article 9 (digest [33][34]).
**Onboarding motive**: import last year's people list, publish one real policy in both locales, run a campaign on one segment, and read a real coverage number on day one.
**Verbatim (paraphrase, persona voice)**: "I don't need more compliance software. I need the ledger an auditor reads without me in the room."

## Persona 2 — Tariq, HR Operations Lead (co-admin, joiner/leaver flow)

**Role**: HR operations lead at the same group's Dubai entity; runs onboarding for ~8 joiners a month across retail and warehouse roles plus leaver processing; owns handbook acknowledgment as part of the joiner checklist — today a printed form signed at the front desk and filed in a cabinet, re-typed into the spreadsheet later.
**JTBD**: "When someone joins, I want the current policy set assigned to them automatically on day one, in the language they actually read, so acknowledgment stops being a paper form I chase and re-key."
**Triggers**: a joiner whose signed form went missing in a site move; a leaver whose historical acknowledgments an auditor asked about (and nobody could produce); bilingual joiners — some read Arabic-first, some English-first, and the printed form only came in one language.
**Objections + responses**: "HRIS already does acknowledgment checkboxes" → those checkboxes don't keep per-version evidence auditors can read (01 indirect analysis); "I don't want another system to feed" → CSV import is the primary path and the directory capability is optional (08 N2); "frontline joiners have no email" → the acknowledger portal is a link on any phone — no install, no login wall (digest [56][61]).
**Verbatim (paraphrase)**: "The paper form exists so the file exists. The file exists so the audit passes. Neither means anyone read anything."

## Persona 3 — Mariam, Retail Shift Supervisor (the acknowledger)

**Role**: shift supervisor at a Doha retail branch; no corporate email, no desk; a personal Android phone; reads policy updates when a manager sends a link or texts her; Arabic-first reader who can work in English but trusts Arabic for anything with legal weight.
**JTBD**: "When a policy changes, I want to read it on my phone in Arabic in the five minutes before my shift, say I've read it once, and be done — so policy day stops meaning a queue at the back office computer."
**Triggers**: an annual policy day that eats a shift-hour in front of a shared terminal; a link that opened an English PDF she scrolled without reading; a reminder email that went to an address she never checks.
**Objections + responses**: "is this going to time me like a test?" → read evidence records timestamps, not quiz scores — no comprehension testing by design (LOOP-10); "will my name be attached to something I didn't understand?" → the reader shows the governing locale prominently and the attestation names exactly which locale she attested against; "another app to install?" → none — a link in a browser (digest [61]).
**Verbatim (paraphrase)**: "Give it to me in Arabic, on my phone, and let me sign once. Then leave me alone until it changes."

## Persona 4 — Omar, Group General Counsel (audit owner, viewer seat)

**Role**: group GC; owns legal defensibility of the policy program; requests evidence packs for customer security reviews and certification audits; cares about the difference between "we have a policy" and "we can prove who saw which version when" (digest [20][22]); wary of jurisdiction variation in acknowledgment enforceability (digest [19], qualitative).
**JTBD**: "When an auditor or a customer's counsel asks for attestation evidence, I want an export that shows per-person, per-version, per-locale acknowledgments with timestamps and an intact chain to the attestation text — produced in minutes, not assembled from three systems."
**Triggers**: a customer security review that asked for signed-policy evidence per employee; SOC 2-style review cycles demanding policies be formally accepted by employees (digest [27]); a labor dispute where the company's proof of notice was weak.
**Objections + responses**: "is a typed-name attestation legally equal to a signature?" → the ledger records a deterministic digest, the attestation text, and the timestamps; the legal posture is declared honestly (12 Q-5) and dedicated e-signature is an abstract channel, not a promise; "can this be tampered with?" → append-only by contract (07b rules), exports regenerate from immutable state, never edit history; "I don't want discipline tooling" → none — declines are recorded facts, the follow-up is human (LOOP-10).
**Verbatim (paraphrase)**: "Evidence is what survives an adversary reading it. Version, person, time, language. Everything else is decoration."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Layla | policy version → audited coverage evidence | per policy change / per audit cycle | audit-grade defensibility without suite weight |
| Tariq | joiner/leaver → correctly-scoped acknowledgments | per joiner, per leaver | no re-keying; works for email-less staff |
| Mariam | policy notice → honest attestation on her phone | per campaign | Arabic-first, no app, no quiz |
| Omar | audit request → evidence pack export | per audit/review | legal posture honesty + immutability |

## Objection matrix (with responses)

| Objection | Response grounded in specs |
|---|---|
| "We already have a policy tool / HRIS checkboxes" | Version-pinned per-locale attestation records + ledger exports are the artifact auditors ask for (01; 07a state obligations) — checkboxes don't keep them |
| "Policy content changes constantly; re-importing is work" | Publish is document-control metadata + bodies; supersedes chains keep old evidence valid for the period it covered (07a) |
| "Our workforce won't read English/Arabic" | Bilingual bodies with governing-locale rule; reader locale toggle; attestation records the locale read (03 CP-3) |
| "Frontline staff are unreachable" | Link-based acknowledger portal on any phone; manual chase list + site rollout posters with QR path (08 N1 manual alternative) |
| "Typed names aren't signatures" | Honest posture declared (12 Q-5): deterministic digest + attestation text pinning; dedicated e-signature channel abstract for later |
| "Declines will create HR problems" | Declines are recorded facts surfaced to admins, never auto-escalated (LOOP-10 no incident management; 07a state obligations) |
| "Attestation fatigue is real" | Version-scoped asks (only what changed), calm reminder cadence per P21 digest ladder, campaign-level not blanket annual spam (03 CP-2; 11 E) |

## Voice derivation (SME-J)

Ledger voice: registrar-plain — declarative, evidence-forward, zero hype (copy-voice §1). States what the record shows and what it doesn't; coverage gaps are named plainly ("11 of 28 acknowledged; 4 overdue; 1 declined — the names are one click away"). English register: professional-neutral, contractions off (governance family per copy-voice §4). Arabic UI copy is فصحى بيضاء (plain MSA), utility register; politeness sparing (لطفاً in attestation confirmations only). Fixed terminology (one concept, one term, everywhere — copy-voice §3): سياسة=policy · إصدار=policy version · acknowledgment=الإقرار (attestation record=سجل الإقرار — the lock decision below records the rejected alternatives اعتماد and إفادة) · the ledger=السجل · segment=شريحة · campaign=حملة · coverage=التغطية · governing locale=اللغة الحاكمة. Terminology lock decision (recorded): acknowledgment=الإقرار, attestation record=سجل الإقرار, evidence pack=حزمة الأدلة, decline=الاعتذار عن الإقرار (recorded decline, not refusal — الرفض is reserved for system rejections), overdue=متأخر, version label=مُعرِّف الإصدار. Numerals Western per ledger row (data/evidence surface — design-language-map §7); never mixed systems mid-sentence (copy-voice §1.7). Warmth lives in the reader surface's success copy ("شكراً — إقرارك مُسجَّل") and never in errors.
