# 02 — User Research: halal-certification-tracker

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (workflow-stage documentation [17]–[21], renewal-window conventions [25]–[31], bilingual labeling obligations [36]–[38], supplier-certificate expiry pain [9]); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Maryam, Certification Program Manager (primary)

**Role**: program manager at a Gulf-zone halal certification body (12 staff: 6 assessors, 2 technical reviewers, a 5-member shariah committee, a director). She owns the pipeline: applications in, stages moving, certificates issued, renewals opened on time, the register presentable when the accreditation assessor visits. Today the register is a spreadsheet, renewal dates live in one analyst's memory, and the director asks her every Sunday "what expires this quarter?"
**JTBD**: "When I run the certification pipeline, I want every certificate's renewal to compute as a staged schedule the body can act on and every formulation question to resolve from linked data, so nothing lapses because a person forgot and no accreditation question ends in 'let me check the shared drive'."
**Triggers**: a certificate that lapsed for three weeks before anyone noticed; an accreditation assessment that asked for decision records and audit reports she assembled by hand from email; an importer verification call that took two days to answer.
**Objections + responses**: "our workflow platform already has certificates" → it has certificate records with attachments, not a formulation graph — ask it what the gelatin supplier's expiry touches and it opens files (01 gap column); "the committee won't learn a tool" → committee members see a dossier and press Record decision; they never touch the register; "migration from spreadsheets will hurt" → paste the ingredient directory and the applicant list; the register import is a job with row counts (07c).
**Onboarding motive**: import one applicant's real formulation and run one impact analysis from the supplier-certificate vault — the Sunday question answered by a computed digest.
**Verbatim (paraphrase, persona voice)**: "A lapsed certificate is not paperwork dying. It is a mosque, a distributor, and an importer finding out at once."

## Persona 2 — Khalid, Senior Halal Assessor (Arabic-first)

**Role**: technical assessor, 15 years in food compliance, reviews formulations and evidence for each application. Arabic-first: reads and annotates in Arabic, works with English-language supplier documents. Today he tracks formulations in a personal spreadsheet with one row per ingredient and a notes column that has become a private knowledge base the body cannot audit.
**JTBD**: "When I review a product's formulation, I want every line to show its ingredient status, its supplier evidence, and its expiry as linked data I can trust, so my review is a judgment — not an archaeology dig through attachments."
**Triggers**: a supplier certificate he certified against last year quietly expiring mid-cycle; the same mushbooh mono-diglyceride question answered three different ways in three spreadsheets; a reformulation the applicant sent as a scanned list that changed one line he could not diff.
**Objections + responses**: "my spreadsheet notes are my method" → they become ingredient-level resolution records with your name and date, queryable across the body (the knowledge survives you); "Arabic ingredient names will mangle in search" → normalization is disclosed and tested (rtl-rules §4; 07c regression fixtures); "I don't want to re-enter supplier documents" → metadata-mode: record number, issuer, dates, and a reference; attach the file when storage is bound (08 N1).
**Onboarding motive**: paste one ingredient list and watch normalization group "جيلاتين" with "جيلاتين" spelled variants, statuses included.
**Verbatim (paraphrase)**: "The formulation is the certificate. Everything else is ceremony around a list of ingredients."

## Persona 3 — Dr. Ahmad, Shariah Committee Member (occasial decision user)

**Role**: Islamic-law scholar on the body's committee; meets monthly to resolve mushbooh classifications and ratify issuance decisions. Not a daily tool user; needs the dossier — the formulation, the statuses, the evidence, the audit outcome — presented so a decision can be recorded with a justification, and needs the trail to show what he decided and when.
**JTBD**: "When the committee meets, I want the contested ingredients and the pending decisions laid out with their evidence, so I record a ruling with a justification in minutes and the register shows exactly what we decided, on what basis, and when."
**Triggers**: a mushbooh resolution he signed verbally surfacing later as "the committee approved" with no record; being handed a 40-page PDF the night before a meeting; the same ingredient re-litigated because last year's rationale was not queryable.
**Objections + responses**: "I decide, I don't do data entry" → the decision surface is read-and-record: a dossier, a decision, a justification, done; "computers deciding halal status worries me" → the product decides nothing: statuses are the committee's own classifications and Khalid's evidence; the graph only carries them (declared non-AI, 00).
**Onboarding motive**: attend one meeting where the contested-ingredient digest replaces the night-before PDF.
**Verbatim (paraphrase)**: "I will rule on what is in front of me. Bring me the whole ingredient, not the first page of it."

## Persona 4 — Fahad, Certification Body Director (economic buyer)

**Role**: director of a smaller independent certification body (5 staff) issuing export-accepted halal certificates; bought the body's current tooling (email, spreadsheets, a shared drive). Answers for accreditation survival, certificate credibility with importers, and staff throughput. Signs the software check.
**JTBD**: "When I buy software for the body, I want the register to defend itself — computed renewal schedules, linked formulations, an audit trail — so accreditation assessments stop being fire drills and our certificates mean something at the import desk."
**Triggers**: a competitor body's lapse becoming WhatsApp-group news; an accreditation finding about records; renewal revenue lost because cases opened too late to complete before expiry.
**Objections + responses**: "we can't afford a suite" → this is not a suite: no audit scheduling, no lab management, no public portal — the register's spine only, priced per staff seat with register-size tiers (12 Q-3); "staff will resist" → assessors paste what they already maintain; the committee records what they already decide; "what if we leave" → the register exports bilingually, whole (08 N3, LOOP-5).
**Onboarding motive**: the first computed "due this month" digest that replaces the Sunday interrogation.
**Verbatim (paraphrase)**: "Our product is trust. The register is where trust is kept."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Maryam | pipeline + register without silent lapses | daily | workflow-platform complacency |
| Khalid | formulation review on linked, trusted data | daily | method ownership + Arabic-tool distrust |
| Dr. Ahmad | contested-ingredient rulings with recorded rationale | monthly | tool aversion; status-authority concern |
| Fahad | buy a defensible register, not a suite | once + renewal | price + change fatigue |

## Voice derivation (SME-J)

Registrar voice: formal-precise, evidence-forward, zero warmth in errors, calm ceremony in issuance — the trust/premium register (copy-voice §3: فصحى وسطى for trust surfaces). States what the record shows; never speculates; every status has a named actor and a date. Arabic UI copy is MSA وسطى — this is a شبهة-adjacent governance surface, not a utility app; politeness sparing but present (تفضل/لطفاً only at decision points). English is professional-neutral, contractions off (specialized family per copy-voice §4).

**Terminology discipline (one concept, one term, everywhere — 07a entities carry the glossary):**

| Concept | Term (EN) | Term (AR) |
|---|---|---|
| certification body (the workspace) | the body | جهة منح الشهادات |
| applicant | applicant | مقدم الطلب |
| application case | application | طلب الشهادة |
| ingredient | ingredient | المكوّن |
| formulation | formulation | التركيبة |
| supplier | supplier | المورّد |
| supplier certificate | supplier certificate | شهادة المورّد |
| certificate (issued) | certificate | الشهادة |
| register | the register | السجل |
| renewal | renewal | التجديد |
| renewal ladder | renewal ladder | سلّم التجديد |
| ladder rung | rung | درجة السلّم |
| traceability / impact analysis | impact analysis | تحليل الأثر |
| halal / haram / mashbooh / under review | halal / haram / mashbooh / under review | حلال / حرام / مشبوه / قيد المراجعة |
| audit record | audit record | محضر التدقيق |
| committee decision | decision | قرار اللجنة |
| issuance / suspension / withdrawal | issue / suspend / withdraw | الإصدار / الإيقاف / السحب |
| expiry | expiry | انتهاء الصلاحية |
| scheme | scheme | النظام |

"مطابقة" is reserved for accreditation contexts and never used for renewal status; "شهادة" alone always means the body's issued certificate — supplier certificates are always "شهادة المورّد", never bare "شهادة". Numerals Western per ledger row (data surface — dates, counts, rung offsets); never mixed systems mid-sentence.
