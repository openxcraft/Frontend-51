# 02 — User Research: contract-lifecycle-manager

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence ([2] shared-drive status quo, [30]–[33] bilingual legal-ops staffing, [19][21] abstraction practice, [23][24] renewal pain); zero invented verbatims — quotes are paraphrased persona voice, marked as such.

## Persona 1 — Layla, General Counsel (primary, economic buyer)

**Role**: GC and head of a 3-person legal department at a GCC trading-and-distribution group (~350 employees, ~400 live contracts). She answers to the CFO when a vendor agreement auto-renews for a year nobody budgeted, and to the board's auditor when the register is requested. Her contracts live half in English (vendor MSAs, SaaS agreements) and half in Arabic (leases, government-adjacent supply agreements), and her tracker spreadsheet holds one title per row — whichever language the intern typed first.
**JTBD**: "When a contract lands in my inbox or my door, I want it registered with its counterparty, dates, notice window, and obligations within the day, so my team stops discovering deadlines after they pass and I can hand an auditor a register instead of an apology."
**Triggers**: an auto-renewal that slipped a 60-day notice window by three weeks (the [23][24] pain, lived); an audit request that took two weeks of spreadsheet archaeology; a lease dispute where the Arabic title in the spreadsheet didn't match the executed document.
**Objections + responses**: "another enterprise CLM we can't implement?" → the vault is metadata-first, works from the first uploaded contract, no workflow consultant needed ([14] implementation-weight objection); "my business teams won't buy seats just to see their own contracts" → viewer seats are free (12 Q-3); "AI reading my contracts makes me nervous" → the extraction assist is consent-gated, suggestion-only, and dismissible; manual entry is the primary path (P15).
**Onboarding motive**: load the twenty highest-value contracts (the [19] triage advice), see the reminder schedule come alive, and export the register once — proof before migration.
**Verbatim (paraphrase, persona voice)**: "I don't need the contracts drafted again. I need them to stop surprising me."

## Persona 2 — Omar, Corporate Counsel (daily user)

**Role**: the GC's second lawyer; intakes every incoming agreement, abstracts metadata by hand into the spreadsheet today, and runs the extraction-assist evaluation in his head: would he trust a machine's reading of a 30-page English MSA with an Arabic-referenced annex?
**JTBD**: "When I abstract a contract, I want the first-draft metadata and obligations proposed for me and confirmed by me, so the abstraction hour becomes an abstraction fifteen minutes and every field still has my eyes on it."
**Triggers**: abstraction backlog after a busy quarter ([20] abstraction-as-a-service exists because this work is heavy); a false extraction he caught by luck, not process; bilingual annexes where party names flip scripts mid-document.
**Objections + responses**: "the assist will miss the obligations buried in schedules" → suggestions are drafts with per-item accept/edit/dismiss and the planted-false-positive fixture trains the review habit (07c); "I already have a checklist" → the manual wizard IS that checklist, formalized ([19] top-fifty/ten-fields discipline).
**Verbatim (paraphrase)**: "Extraction saves me typing, not thinking. Keep the thinking mine."

## Persona 3 — Nadia, Legal Operations Coordinator (the spine)

**Role**: paralegal/legal-ops coordinator; maintains the tracker, chases obligation owners across procurement and facilities, and assembles the audit binder. Bilingual by job description ([30]–[33] evidence): she is the person today who holds both spellings of every counterparty in her head.
**JTBD**: "When a deadline approaches, I want the reminder to reach the owner who owes the action with the contract and the clause reference attached, so I stop being the human notification system."
**Triggers**: a missed insurance-certificate renewal discovered by the counterparty first; owners claiming they were never told; the audit binder assembly week.
**Objections + responses**: "owners ignore email reminders" → the reminder ladder is tiered and the in-product console is the return-state surface (P21); "both languages double my data entry" → bilingual fields are optional-by-field, not mandatory-both; either side alone is valid state (P23 logic, applied to metadata).
**Verbatim (paraphrase)**: "I am the reminder system. I would like to be a person again."

## Persona 4 — Faisal, Business Contract Owner (viewer seat)

**Role**: head of procurement at the same group; holds obligations in vendor contracts (notice letters, certificate requests, renew-or-drop decisions) and needs to see his contracts' dates without asking legal. Today he gets a forwarded spreadsheet snapshot from Nadia, always stale.
**JTBD**: "When a vendor contract is nearing its renewal window, I want to see the window, the owner, and the document myself, so my decision is made inside the notice period, not after it."
**Triggers**: learning of a renewal window after it closed; a vendor auto-renewing a service his team wanted to re-tender.
**Objections + responses**: "I won't pay for read access" → viewer seats are free and scoped to his contracts ([9][11] per-viewer pricing is the counter-position); "legal language loses me" → the obligation ledger states obligations in plain bilingual summaries with direction marks, not clause citations alone.
**Verbatim (paraphrase)**: "Tell me the window before it closes, and show me the paper when I ask."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Layla | company's contracts → governed, auditable register | continuous (buyer) | implementation weight + trust |
| Omar | contract document → abstracted bilingual metadata + obligations | per-contract (daily) | assist reliability + judgment ownership |
| Nadia | upcoming deadlines → owners notified with evidence | daily | reminder deliverability + double-entry burden |
| Faisal | own contracts' windows → decisions inside the notice period | weekly | seat cost + legibility |

## Objections + responses (consolidated)

| Objection | Response |
|---|---|
| "CLM projects fail at small teams" | The vault is post-drafting by design (LOOP-10): no templates, no negotiation, no signature hosting — the failure-prone pipeline is out of scope; what remains is register + reminders + audit. |
| "AI extraction is wrong too often" | Suggestion-only with per-item confirmation (P15); a planted false positive ships in the mock seed so review discipline is trained, not assumed; manual entry is unlimited and primary. |
| "Our contracts are in Arabic; tools mangle Arabic" | Bilingual fields with per-side direction rendering, Arabic-normalized search (rtl-rules §4), and Arabic obligations copy in فصحى (11 matrix) — the schema holds both scripts natively ([30]–[33] staffing evidence says the need is real). |
| "We already have the spreadsheet" | The spreadsheet tracks renewal dates; the vault tracks *notice windows* and derives the reminder schedule ([24]: the 60–90-day window is the date that hurts); migration starts with the top-20 by value, not a big bang. |
| "What happens when the AI quota dies?" | Manual entry keeps working identically (degradation map 08); reminders are deterministic and never quota-dependent. |

## Voice derivation (SME-J)

Vault voice: registrar-plain — declarative, evidence-forward, calm about deadlines and unpanicked about overdues (copy-voice §1: say the true thing, briefly; the error formula carries next actions). English register: professional-neutral, contractions off (governance family). Arabic UI copy is فصحى بيضاء utility register; obligation summaries are data, not legal prose — plain declarative sentences. Fixed terminology (one concept, one term, everywhere): العقد=contract · الطرف المقابل=counterparty · الالتزام=obligation · التذكير=reminder · جدول التذكيرات=reminder schedule · نافذة الإخطار=notice window · إشعار عدم التجديد=non-renewal notice · منفَّذ=executed (status) · السجل=register (the vault) · التصدير=export. Numerals Western per ledger row (data/finance surface). "Notice window" is never loosened to "reminder" in copy — نافذة الإخطار is the term of art, and reminders are the product's actions inside it.
