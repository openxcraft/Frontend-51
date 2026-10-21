# 02 — User Research: cod-order-confirmation

SME-B pass · Personas are synthesized from market research (01) and public complaint/discussion patterns (research log, batch6). All verbatims are PARAPHRASES of recurring public sentiment (marked), never invented quotes. Four personas: the confirmation agent (the daily surface), the founder/e-commerce manager (economic buyer), the dispatch lead (the gate), the multi-site ops manager (the policy + dispute authority).

## Persona 1 — Hessa, confirmation agent (primary daily user, console queue)

**Role**: confirmation agent at a Riyadh home-goods D2C merchant (سلة-class storefront, ~350 orders/day, ~65% COD). Her title in the back office is effectively "مسؤولة تأكيد الطلبات" — she owns the WhatsApp Web tab, the phone dialer, and a printed order sheet that is stale by 11:00.
**Context**: Sudanese expatriate, Arabic-first (console in Arabic, RTL), comfortable with light English for platform labels; desktop during the shift, phone for the evening surge. She currently juggles three windows (storefront orders, WhatsApp Web, the courier driver group) and keeps a mental blocklist of "numbers that never answer".
**JTBD**: "When a batch of COD orders lands in the morning, I want to see — in one queue, already sorted by risk and time — who needs a message, who needs a call, and who already replied, so I can clear the board before the dispatch cutoff instead of hunting across three windows."
**Triggers**: the morning order batch (09:30); the pre-cutoff crunch (14:00 — nothing unconfirmed ships at 15:00); a buyer who replies "لا لاحقاً" (not now) and needs a scheduled retry; a number that rings out three times.
**Objections**: "another dashboard my manager bought and I'll work around" (the queue must be faster than her paper list — 00 success signal 1); "the script changes per order — where do I see what to say?" (call scripts + buyer history inline, CP-2); "if WhatsApp is down, my whole day is down" (channel-abstract ladder + manual-call logging, 08); "I don't want to call people at 22:00 by mistake" (quiet hours enforced by the engine, not by her memory).
**Onboarding motive**: clear her first 10-order queue in the first session — the trail, the stamps, and the call script all visible without training.
**Verbatim (paraphrase of recurring confirmation-agent sentiment in practitioner threads)**: "I do the same three taps and the same two sentences two hundred times a day; the tool should know that."

## Persona 2 — Fahad, founder / e-commerce manager (economic buyer)

**Role**: co-founder of the same merchant; owns the P&L line where COD failures land (double shipping, blocked stock, repack labor). Runs the storefront himself, reads courier invoices monthly, has watched the COD share of his orders drift down while the COD failure share stayed stubborn.
**Context**: Saudi, bilingual ar/en (console in either; dashboards in English, messages to buyers in Arabic); desktop + evening phone checks. Has trialed a storefront-platform confirmation app (WhatsApp blast) and dropped it: "it sent messages, but I still had to decide everything myself and the callers had no record."
**JTBD**: "When the courier invoice lands with 18% of last month's COD parcels returned, I want to see which orders failed at which confirmation step and what it cost, so I can change the policy — not just pay the invoice again."
**Triggers**: the monthly courier reconciliation; a high-value order that RTO'd after "confirmation" by a stale app; a dispute where a buyer claimed they never confirmed; quarter-end margin review.
**Objections**: "will my agents actually use it, or is it another license we pay for and they dodge?" (agent ergonomics is the adoption plan — Hessa's queue speed, 00); "I won't buy a black box that scores MY customers" (deterministic scorecard with rendered components, 07c — inspectability); "what happens when we change couriers or platforms?" (channel-abstract, LOOP-5 — paste import works on day one, 08); "does it touch payments? I don't want compliance exposure" (no payment processing anywhere — LOOP-10, 00).
**Onboarding motive**: import one real day of COD orders by paste, run the ladder, and read the outcomes panel the same afternoon — ROI visible before the first invoice cycle.
**Verbatim (paraphrase of merchant sentiment in COD/RTO threads)**: "The failed parcel isn't the cost; it's the second shipping fee on a sale I never collected."

## Persona 3 — Munira, dispatch & warehouse lead (the gate owner)

**Role**: dispatch lead at the merchant's single Riyadh warehouse; she packs by manifest and physically refuses to ship unconfirmed COD boxes (her rule: no green stamp, no pallet).
**Context**: Egyptian, Arabic-first; desktop at the packing station; her day is governed by the courier pickup time (15:00) and by window promises ("if the buyer chose Thursday evening, that box does not go on Wednesday's truck").
**JTBD**: "When the courier truck arrives at 15:00, I want a sealed manifest of ONLY confirmed orders with their delivery windows and risk notes, so I can hand over exactly what should move and hold the rest without arguing with sales."
**Triggers**: the 14:30 pre-pickup crunch; a sealed manifest that needs one late order added (re-open cost); a high-risk order that confirmed at 14:58 (does it make the truck?); boxes returned from a window the buyer missed.
**Objections**: "another system that says 'confirmed' but means 'probably'" (the stamp is evidence-grade — attempt, channel, timestamp, response, window — 07a); "if the manifest is wrong, the courier blames me" (seal gate with count + review diff, CP-5; async job honesty); "I need it printed — the driver takes paper" (manual alternative: print/download path is first-class, 08 N4).
**Onboarding motive**: build, seal, and export (print) one real manifest from today's confirmed orders — with the window column correct — in the first session.
**Verbatim (paraphrase of dispatch-lead sentiment)**: "The truck leaves at three; everything after that is tomorrow's argument."

## Persona 4 — Salem, multi-site operations manager (policy + dispute authority)

**Role**: ops manager for a 4-branch Gulf retail group (Riyadh ×2, Jeddah, Dammam); owns confirmation policy per site, buyer blocklists, and the dispute file when a buyer claims a wrong confirmation.
**Context**: Saudi, bilingual; desktop-first, on-call phone checks on weekends. Currently holds policy in a memo, blocklists in an agent's memory, and disputes in an email folder.
**JTBD**: "When a buyer swears they never confirmed a Thursday-evening delivery, I want the ledger entry — attempt, channel, timestamp, their reply, the stamped window — in under a minute, so the dispute ends in evidence instead of a goodwill voucher."
**Triggers**: a buyer dispute reaching WhatsApp-escalation or the platform's support; an HR/ops audit of agent conduct; a city-specific fraud wave (Jeddah cluster); Ramadan quiet-hours re-planning (delivery cadence shifts).
**Objections**: "policy changes must not surprise agents or buyers" (versioned ladder/risk policies + before/after simulation, CP-6); "quiet hours differ by city and by season" (per-site policy scoping, 07a); "I will not grant every agent blocklist power" (role model: agent / manager / dispatch — blocklist and policy are manager+ only, 07b PERMISSION classes); "exports must survive audits" (ledger export artifact with expiry, async-contract §2).
**Onboarding motive**: stand up the policy spine (ladder, quiet hours, value cap, window catalog) for ONE site in under 30 minutes (00 success signal 3), then resolve one seeded dispute via the ledger view end-to-end.
**Verbatim (paraphrase of ops/compliance sentiment)**: "Disputes aren't won by who's right; they're won by who has the record."

## JTBD summary matrix

| Persona | Core job | Trigger frequency | Primary objection to overcome |
|---|---|---|---|
| Hessa | Clear the confirmation queue before cutoff, channel by channel, evidence left behind | daily, 2 crunches (09:30 / 14:00) | tool vs paper ergonomics |
| Fahad | Turn failure economics into policy changes with visible ROI | monthly invoice + ad-hoc disputes | black-box aversion + adoption risk |
| Munira | Ship only confirmed boxes against agreed windows, on time | daily at 14:30 | manifest trustworthiness + paper reality |
| Salem | Set policy per site; end disputes with evidence | disputes ad-hoc; policy quarterly | policy-change safety + permission hygiene |

## Onboarding motives → flow mapping (feeds 03)

First-session value proof per persona drives first-run: agents land on the QUEUE (CP-1/CP-2); the founder's path is paste-import → outcomes panel (CP-1, CP-4); dispatch lands on MANIFESTS with today's confirmed set (CP-5); ops gets the policy-spine checklist (ladder → risk → windows → templates → blocklist, CP-6; P22 value milestones, no tours-of-balloons). The onboarding checklist (P22) offers four entry paths — one per persona — each linking directly into the flow that achieves it.

## Objection → design response matrix (spec-level sales honesty; every 02 objection answered)

| Persona | Objection (above) | Where the spec answers it |
|---|---|---|
| Hessa | "another dashboard I'll work around" | CP-1 queue is a keyboard-speed instrument: j/k rows, one-key attempt/agreement actions, risk + ladder + time-to-next-attempt visible WITHOUT opening the drawer (04 S2); 12-order queue < 6 min is a success signal (00) |
| Hessa | "where's the script?" | call-leg drawer renders the bilingual call script + buyer history + prior responses side-by-side (CP-2 step 5, 06 CallLegSheet); templates are versioned data, not improvisation |
| Hessa | "WhatsApp down = day down" | channel-abstract ladder: SMS and voice rungs are separate abstract channels (08 N2/N3); the manual-call logging path (logManualContact) is a first-class primary path, not a fallback (CP-2 step 6) |
| Hessa | "no 22:00 calls by mistake" | quiet hours are policy-enforced in the engine (07a LadderPolicy.quietHours; 07c §2 computes next eligible send time); the queue shows time-to-next-attempt, never a guess |
| Fahad | "agents won't use it" | agent ergonomics is the adoption plan (queue speed, stamps, scripts); agent role requires no configuration surface at all (04 role routing) |
| Fahad | "no black boxes on MY customers" | deterministic scorecard: every score renders its components and weights (07c §2 formulas; 06 RiskRail drill); optional model enrichment is labeled with engine provenance and degrades to the scorecard (08, ai-native-patterns §8) |
| Fahad | "we'll change platforms/couriers" | channel-abstract adapter with manual alternatives for every need (08): paste import, manual calls, printed manifests — zero bindings required for full function (LOOP-5) |
| Fahad | "does it touch payments?" | no payment processing anywhere in the contract (00 LOOP-10; 07b has no money-touching operation; the manifest carries evidence, not payment instructions) |
| Munira | "'confirmed' must mean confirmed" | the Agreement Stamp is ledger-grade: attempt id + channel kind + timestamp + response verbatim + window id (07a WindowAgreement); the stamp glyph is semantically reserved for confirmed-with-agreement only (06) |
| Munira | "wrong manifest = courier blames me" | seal gate shows count + window/date mix + risk-band rollup for review before sealing (CP-5 step 4); sealed manifests are immutable — late orders go to the NEXT manifest (07a state machine), never a silent edit |
| Munira | "I need it printed" | export path produces the print-ready artifact via the abstract handoff channel OR download/print (08 N4 manual alternative); the driver paper is a designed output, not an afterthought |
| Salem | "policy changes surprise people" | policies are versioned; update requires simulation preview (before/after band rollup) before publish (CP-6 step 5, 07b simulateRiskPolicy); every order names the policy version it was scored under (07a) |
| Salem | "quiet hours differ by city" | ladder policy is site-scoped (07a scope on LadderPolicy); per-site catalogs and caps (07c seeded multi-site fixture) |
| Salem | "not everyone gets blocklist power" | three structural roles only (agent/manager/dispatch); blocklist, policy, template-publish are manager-class operations (07b PERMISSION semantics); no per-user ACL surface at v1 |
| Salem | "exports must survive audits" | ledger export is a Job with artifact + expiry (async-contract §2); every consequential mutation appends an ActivityEntry (P17); the dispute view assembles the full chain in two clicks (CP-4) |

## Voice derivation (feeds 05/11 via SME-J)

Dispatch-room voice: precise, calm, evidence-forward. Arabic UI copy: فصحى بيضاء (plain MSA) with disciplined terminology — one concept, one term (طلب = order, تأكيد = confirmation, محاولة = attempt, نافذة التسليم = delivery window, اتفاق النافذة = window agreement, درجة الخطورة = risk score, بيان الشحن = handoff manifest, ساعات الهدوء = quiet hours, سلم المحاولات = attempt ladder, ختم = stamp — glossary pinned in 11 §I and 07a field comments). English: professional-neutral, short. Confirmation copy states facts and times ("أُكّد الطلب — نافذة التسليم: الخميس 16–20", "Order confirmed — delivery window: Thu 16:00–20:00"). Errors follow the [what]+[why]+[next] formula (copy-voice §1.4); success moments may be firm-warm but never celebratory (no confetti — motion-language §2; the Agreement Stamp is the one ceremony, 05). Buyer-facing message templates are authored at فصحى وسطى (middle register — trust surface) with Western numerals in both locales (ledger numeral policy; copy-voice §1.7). Warmth lives in the window-agreement moment, never in failure copy.
