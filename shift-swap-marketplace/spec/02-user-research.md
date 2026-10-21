# 02 — User Research: shift-swap-marketplace

SME-B pass · Personas are synthesized from market research (01) and public complaint/discussion patterns (research log, batch4). All verbatims are PARAPHRASES of recurring public sentiment (marked), never invented quotes. Four personas: two worker personas (the daily surface), one supervisor (the console + accountability), one ops lead (the rules authority).

## Persona 1 — Amna, supermarket cashier (primary daily user, worker surface)

**Role**: cashier and self-checkout attendant at a Riyadh hypermarket (2 shifts: morning 07:00–15:00, evening 15:00–23:00 rotating); 3 years' tenure — senior in her section.
**Context**: Sudanese expatriate, Arabic-first (phone entirely in Arabic), phone-only (mid-range device, prepaid data), no work email. Currently manages swaps in the store's chat group: posts a screenshot of the roster, waits for replies, takes it to the floor supervisor for a verbal OK. Has watched junior colleagues "win" desirable swaps by replying fastest, and has lost count of favors owed.
**JTBD**: "When my family needs me for an afternoon, I want to offer my evening shift to a qualified colleague through a system my supervisor trusts, so I don't spend my break negotiating in a chat group and hoping it's fair."
**Triggers**: a family obligation colliding with an evening shift; returning from annual leave to find the roster unfavorable; a junior colleague replying "أنا" first on a swap she needed.
**Objections**: "another app my supervisor won't look at"; "the ranking will favor whoever the supervisor likes"; "my data — where does it go?"; "if my phone is offline at break time, the swap is gone" (offline queue must satisfy her — P20).
**Onboarding motive**: post ONE real swap from her phone in the first session and see the supervisor confirmation arrive as a notification — no training, no desktop, no English.
**Verbatim (paraphrase, recurring frontline-chat sentiment)**: "The group chat decides by who replies first, not who needs it."

## Persona 2 — Yusuf, warehouse picker (worker surface, high-volume swapper)

**Role**: junior picker at a Jeddah fulfillment center (night shifts 20:00–04:00); 7 months' tenure — bottom of the seniority band.
**Context**: Egyptian, Arabic-first with working English (site signage is bilingual), aggressive swap behavior: wants more night shifts (transport allowance) and gives away Fridays. Mobile-only; checks the board between picks on a shared-break phone slot.
**JTBD**: "When I want more night shifts and fewer Fridays, I want to see every open shift I'm qualified for and know my real position in the queue, so I stop wasting requests on swaps I'll never win."
**Triggers**: a new night-shift swap posted; seeing his request ranked second with no explanation; hitting a "not eligible" wall with no reason.
**Objections**: "why am I always ranked below seniors — show me the math" (rationale strings exist for him); "my forklift certificate expired — why did the board just hide everything?" (qualification expiry must degrade visibly, not silently); "too many pings" (notification ladder control, P21).
**Onboarding motive**: browse the board filtered to forklift-qualified night shifts and see his own rank preview before requesting — the system shows him his chances honestly.
**Verbatim (paraphrase, junior-worker sentiment in scheduling discussions)**: "Nobody tells you the rules; you learn them by losing."

## Persona 3 — Noora, floor supervisor (economic buyer, console surface)

**Role**: floor supervisor at a Dubai F&B group (4 venues, ~60 scheduled workers); answers to the ops lead; personally approves every swap today.
**Context**: Emirati, bilingual ar/en (console in English, worker communication in Arabic), desktop at the venue office + phone for approvals on the floor. Burned twice: a swap that left a venue without a certified barista, and a grievance where a worker claimed favoritism with no records to answer it.
**JTBD**: "When workers swap shifts, I want every request to arrive pre-checked against qualifications and rest rules with a fair ranking I can defend, so I stop being the referee and start being the record."
**Triggers**: a coverage hole 30 minutes before opening; a fairness grievance with no audit trail; end-of-week swap reconciliation paperwork.
**Objections**: "will I approve MORE work than the chat group?" (the queue must be faster than chat — 12 items < 5 min, 00 §success signals); "if I deny a swap, I need the denial to explain itself" (mandatory rationale on deny — CP-4); "the rules must match UAE hours law, not a US template" (jurisdiction packs, 12 Q-8).
**Onboarding motive**: import this week's real roster (paste/manual — LOOP-5), load two blackout rules, and clear the first queue with the fairness snapshot visible — in one sitting.
**Verbatim (paraphrase, supervisor sentiment in workforce-tool discussions)**: "I don't need another dashboard; I need the chat group to stop deciding my roster."

## Persona 4 — Tariq, operations lead (rules authority, admin surface)

**Role**: ops lead for a 12-site retail chain in KSA; owns qualification registries (food-safety certificates, machine permits, Saudization-mapped role bands) and answers to HR for labor-rule compliance.
**Context**: Saudi, Arabic-first with fluent English; desktop-only; quarterly meetings with HR where he must produce records. Currently keeps qualifications in a spreadsheet that drifts from reality.
**JTBD**: "When the rules change (a new certificate requirement, a rest-rule update), I want to update the swap guardrails once and have every worker see the change and its reason, so compliance is a living system instead of a spreadsheet archaeology project."
**Triggers**: an HR audit; a new Saudization band mapping for a role family; a certificate expiring across the roster; a fairness-policy complaint that reaches the chain's HR.
**Objections**: "rules setup must not cost me a workshop day" (paste-import + review, CP-5); "if the fairness weights are wrong, the whole floor will feel it — I want tuning with a preview, not a leap" (policy simulation before publish); "I will not own per-worker permissions by hand at 12 sites" (roles are structural: worker/supervisor/ops-lead, 07a).
**Onboarding motive**: paste the qualification sheet, map two role bands, publish the fairness policy, and export the first month's fairness ledger for HR — all without a support call.
**Verbatim (paraphrase, ops/compliance sentiment)**: "Audits don't ask what happened; they ask what you can prove."

## JTBD summary matrix

| Persona | Core job | Trigger frequency | Primary objection to overcome |
|---|---|---|---|
| Amna | Swap out a shift via a trusted, fair channel | ~2–4×/month | trust in ranking + offline reality |
| Yusuf | See true eligibility + rank before requesting | daily | opacity of rules and rank |
| Noora | Defensible approvals with zero referee work | daily (queue) | approval overhead vs chat group |
| Tariq | Living rules spine + provable compliance | rules-change cadence + quarterly audits | setup cost + policy tuning risk |

## Onboarding motives → flow mapping (feeds 03)

First-session value proof per persona drives first-run: worker surfaces open on MY SHIFTS with the board one tap away (Amna), offer detail shows rank preview (Yusuf), supervisor console opens on the approval queue with fairness snapshots (Noora), ops lead gets the rules-spine checklist (qualifications → blackout rules → policy publish; Tariq). The onboarding checklist (P22) offers four entry paths — one per persona — each linking directly into the flow that achieves it (no tours-of-balloons, ux-patterns.md P22).

## Objection → design response matrix (spec-level sales honesty; every 02 objection answered)

| Persona | Objection (above) | Where the spec answers it |
|---|---|---|
| Amna | "supervisor won't look at it" | supervisor console CP-4 is a single queue with keyboard-speed decisions; worker sees supervisor's decision as a notification — the loop closes inside the product |
| Amna | "ranking favors the liked" | deterministic policy (07a FairnessPolicy, versioned), rationale string on every match, worker-visible policy sheet (CP-2 step 4, 05 §inspectability); nothing in the engine reads identity beyond declared inputs |
| Amna | "my data — where does it go?" | workspace-scoped entities (07a); session model auth-agnostic (07b); no cross-workspace operation exists on the adapter; worker data surfaces limited to what scheduling needs (09 §privacy) |
| Amna | "offline at break = swap gone" | offline banner + queued writes (P20): request posts locally, syncs on reconnect, conflict path defined (CP-6) |
| Yusuf | "show me the math" | FairnessScore components + rationale string rendered in offer detail (CP-2) and in every decision (CP-3/4); policy sheet bilingual |
| Yusuf | "certificate expired, board silently hid things" | qualification expiry surfaces as an explicit degraded state on the board with renewal action (11 matrix); never silent filtering |
| Yusuf | "too many pings" | notification digest ladder (P21): instant only for blocking workflow events (match confirmed / supervisor decision); digest for ambient board activity |
| Noora | "more work than chat" | approval queue with pre-checked eligibility + top-3 fairness snapshot; one-key decisions; denial rationale is a 2-tap template + note (CP-4); 12-item queue < 5 min is a success signal (00) |
| Noora | "denials must explain themselves" | deny requires rationale (template picker with editable note — 03 CP-4, 07a ApprovalRecord); the rationale reaches the worker verbatim (11 copy) |
| Noora | "rules must match my jurisdiction" | jurisdiction-configurable blackout rules with cited defaults and owner-supplied packs (12 Q-8); no compliance guarantee claimed (00 exclusions, 11 copy) |
| Tariq | "setup cost" | paste-import for qualifications (CP-5, LOOP-5 manual alternative), two-rule quick start, policy publish with preview (CP-5) |
| Tariq | "policy tuning risk" | policy simulation (preview ranking under new weights on current open offers, CP-5 step 6) before publish; policy versioned; ledger always names the version (07a) |
| Tariq | "per-worker permissions by hand" | three structural roles only (worker/supervisor/ops-lead), role-scoped adapter operations (07b PERMISSION class), no per-worker ACL surface at v1 |

## Voice derivation (feeds 05/11 via SME-J)

Floor-floor voice: plain, energetic, never bureaucratic. Arabic UI copy: فصحى بيضاء with disciplined terminology (one concept = one term: المناوبة = shift, التبديل = swap, القاعدة العادلة = fairness rule… glossary pinned in 11 §I + 07a field comments). English: professional-neutral, short. Fairness copy states facts and reasons ("رُتّبت ثانياً: أقدمية أقل بـ4 أشهر" — ranked second: 4 months less seniority). Errors follow the [what]+[why]+[next] formula (copy-voice.md §1.4); success moments may be warm but never cute (no confetti — motion-language §2; the Swap Handshake weld is the one celebration, 05).
