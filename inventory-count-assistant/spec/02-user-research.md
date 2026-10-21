# 02 — User Research: inventory-count-assistant

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (Q8 manual-status-quo sources, Q7 bilingual-retail context, Q2/Q11 counting-discipline conventions); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Faisal, Store Manager (primary)

**Role**: manager of a home-goods store in Riyadh (single door, ~1,400 SKUs: kitchenware, prayer rugs, LED and phone accessories, bakhoor and gift boxes). Runs the floor with an assistant manager and 4 shift staff. Counts stock today with a printed sheet and a spreadsheet re-keyed at night; does one full physical before Eid and one before fiscal year-end, and knows the numbers drift in between.
**JTBD**: "When my stock numbers drift between physicals, I want cycle counts small enough to run during a slow Tuesday without closing, with variances judged against a tolerance I set once, so counting becomes a weekly habit instead of an annual ordeal."
**Triggers**: a customer asks for an item the system says exists and the shelf says otherwise; an owner conversation about shrink he cannot quantify; the Eid pre-count night that costs him a closed store and three staff overtime hours.
**Objections + responses**: "my staff will miscount to match the sheet" → blind mode hides book quantities from counters entirely (01 [25][26][27]); "another system to re-key" → book quantities paste in and adjustment sheets export out (the stock-level channel is optional at v1); "counting software is suite software" → this product ends at the counted truth (LOOP-10 exclusions are the feature).
**Onboarding motive**: paste his item list, paste his book quantities, and run one 12-item blind slice on Tuesday close — see the variance reveal before believing anything.
**Verbatim (paraphrase, persona voice)**: "I close the store one night a year to count. The other 364 nights, the numbers drift and nobody writes it down."

## Persona 2 — Amal, Assistant Manager and count organizer

**Role**: bilingual assistant manager; owns the practical machinery of counting — prints the sheets, walks zones, chases counters, re-types numbers, argues about whether 3 missing air-fryer units is "a problem" or "noise". English-first in the office, Arabic with the floor staff.
**JTBD**: "When I run a count, I want the session to walk the counter zone by zone with both scripts on every label, and variances to tell me which ones need a recount and which are inside tolerance, so the count ends when the counting ends — not three hours later in a spreadsheet."
**Triggers**: a counter asking "what's this item called in Arabic?" on an English-only sheet; a recount argument resolved by whoever sounded most confident; midnight re-typing sessions after closing counts.
**Objections + responses**: "tolerance rules will be yet another policy nobody reads" → the policy editor shows a worked example live (06) and every variance row prints its own arithmetic; "my counters can't all get accounts" → counters are a typed roster on the session — attribution without seats; "recounts will double the work" → recounts are auto-scoped to breaches only, and a resolved breach is a two-tap decision.
**Verbatim (paraphrase)**: "The count takes an hour. The typing and the arguing take three."

## Persona 3 — Sami, Seasonal Counter (floor staff)

**Role**: part-time shelf-stocker, Arabic-first, counts during Tuesday slow hours on his own phone. Has no accounts in any business system and never will. Needs to find items fast, type quantities with big targets, and know he's done.
**JTBD**: "When I'm handed a count, I want a list I can walk in shelf order with Arabic names I recognize, a scanner that jumps to the right row, and a progress number that says when I can stop, so counting a zone takes one pass."
**Triggers**: sheets printed in English only; item names that don't match the shelf labels; not knowing whether a missed item matters.
**Objections + responses**: "the system will blame me for missing stock" → blind mode means he never sees book quantities, and variance resolution is the manager's explicit act with a recorded reason (P17); "phone apps lose my numbers in dead zones" → entries queue offline with per-item state (P20) and reconcile on signal.
**Verbatim (paraphrase)**: "Give me the Arabic name and a big number pad. I count what I see and move on."

## Persona 4 — Noura, Small-Chain Owner

**Role**: owns two doors of the same brand (flagship + branch), wants cross-store honesty: which store's book is drifting, which category leaks, and evidence she can hand an auditor or franchisor without a consulting engagement.
**JTBD**: "When I ask how accurate our stock records are, I want a per-store accuracy number computed the same way every time, with variances traceable to dated sessions and resolutions, so shrink conversations start from evidence instead of moods."
**Triggers**: an inventory loss the accountant cannot explain; branch stock that "shouldn't" be different from the flagship's; auditor requests for count evidence.
**Objections + responses**: "accuracy numbers are consultant math" → IRA is one subtraction shown inline (items within tolerance ÷ items counted) — no black box; "I don't want a data project" → the catalog and book register paste in; nothing binds before she says so.
**Verbatim (paraphrase)**: "Don't tell me accuracy is 'good'. Tell me 96 out of 100, from which store, and show me the other 4."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Faisal | book drift → weekly cycle counts with tolerance | weekly | blind-count trust + suite aversion |
| Amal | count session → reconciled variances, zero re-typing | weekly | policy legibility + counter attribution |
| Sami | zone walk → counted quantities, one pass | per-session (as rostered) | Arabic-first usability + blame fear |
| Noura | store records → accuracy evidence per store | monthly review | audit-grade defensibility without consulting |

## Voice derivation (SME-J)

Counter-manager voice: floor-practical — short, action-forward sentences that name the number and the next move (copy-voice §1.1); no warehouse-consultant vocabulary. Arabic UI copy is فصحى بيضاء, utility register; dialect never appears in system chrome. Fixed terminology (one concept, one term everywhere — 07a glossary mirrors it):

| English | Arabic | Note |
|---|---|---|
| count session | جلسة جرد | the product's core object |
| cycle count | الجرد الدوري | vs full count = الجرد الكلي |
| blind count | الجرد الأعمى | established Arabic accounting term |
| directed count | الجرد الموجّه | |
| item | صنف | retail SKU |
| book quantity | الكمية الدفترية | expected, from the register |
| counted quantity | الكمية المعدودة | |
| variance | فرق الجرد | signed delta, shown with sign |
| tolerance | السماحية | band, not a magic threshold |
| recount | إعادة العدّ | |
| adjustment | تسوية المخزون | |
| inventory record accuracy | دقة سجلات المخزون | IRA |
| zone | منطقة | |
| count policy | سياسة الجرد | |
| variance report | تقرير الفروقات | |
| adjustment sheet | ورقة التسويات | |

Numerals Western everywhere (ledger row — data surface; quantities, percentages, IRA are Latin digits inside Arabic strings, never mixed systems mid-sentence, per copy-voice §1.7).
