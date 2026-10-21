# 02 — User Research: legal-case-tracker

SME-A pass · 4 personas (composite, research-grounded — quotes are **paraphrase-marked** reconstructions of category evidence q1–q12 + the seeded firm shape of 07c, not interview verbatims: no user interviews were possible this pass; recorded as an honest method note). Voice derived here is binding on 05/11: **the courtroom registrar** — plain, unhurried, names actors and facts, never dramatizes; Arabic register فصحى بيضاء with legal terminology locked below.

## Locked bilingual terminology (one concept, one term, everywhere — copy-voice §3.2)

matter = **القضية** · hearing = **الجلسة** · deadline = **الموعد النهائي** · timeline = **التسلسل الزمني** · document = **المستند** · document version = **إصدار المستند** · chain of custody = **سلسلة العهدة** · hearing outcome = **نتيجة الجلسة** · adjourned = **تأجيل** · verdict = **حكم** · ruling = **قرار** · dismissed = **رفض الدعوى** · reschedule = **تأجيل موعد الجلسة** (a reschedule of the *date*, distinct from an adjournment *outcome*) · closure = **إقفال القضية** · deadline rule = **قاعدة المواعيد** · hearing board = **لوحة الجلسات** · client = **العميل** · party = **الخصم/الأطراف** (party roles: client العميل, opposing الخصم, co-counsel محامي مشارك, court المحكمة, other طرف آخر) · export = **تصدير** · activity log = **سجل النشاط**.

## Personas

### P1 — Abdullah, managing partner (the buyer)

- **Role/context**: owner of a 5-seat Riyadh litigation firm (4 lawyers + 1 paralegal, 07c "Mizan Advocates" shape). Commercial and labor litigation; ~40 live matters across the Commercial, Labor, and General courts. Keeps the firm's master tracker in a spreadsheet he built himself in 2019 and updates "when he remembers."
- **Goals**: never learn about a missed hearing from the client; know every matter's state in one glance before agreeing to take a new case; be able to hand an auditor or the client a defensible record of what happened and where the originals are.
- **Frustrations**: the spreadsheet is *his* — nobody else maintains it, so it is stale the moment he is in a hearing all day; closure decisions are vibes ("I think that one finished in March"); original documents surface in desks and drawers weeks after the matter closed; the court portal tells *him* about sessions, but the client asks *the firm* what is happening (q8 — the court is digital, the firm is not).
- **Quote (paraphrase-marked)**: "I lost a whole evening once trying to remember whether we returned the power of attorney to the client or it's still in the safe. A tracker that refuses to close a case until the papers are back — that is not bureaucracy, that is my sleep."
- **Product answer**: the docket home (counts + zones, no spreadsheet archaeology), the closure gate (closure is earned, blockers named), the activity log + export (the defensible record), owner-only rule management (07b role model).

### P2 — Layla, litigation lead attorney (the daily driver)

- **Role/context**: senior associate running 12–15 active hearings a month across three courts. Every morning she reconstructs "what is due this week and in which courtroom" from the board SMS, her notes app, and yesterday's memory.
- **Goals**: a single morning surface sorted by *consequence*, not by case number; record a hearing outcome in under a minute *from the courtroom corridor*; never lose the thread when a hearing adjourns ("adjourned to 12 November" should *create* 12 November, not become a sticky note); see the appeal window open the day the verdict lands.
- **Frustrations**: adjournment dates live in her notebook until someone types them; the deadline between hearings (prep, client update, translation delivery — 07c rule-001/002/005) is recomputed by hand and sometimes missed (07c m-002's overdue prep deadline is *her* failure mode); recording outcomes is the first thing dropped on a heavy day, so past hearings linger outcome-less (m-003's outcome-due fixture is her honesty bill).
- **Quote (paraphrase-marked)**: "The adjournment is the work. Everything else is typing. If the system makes the next hearing itself when I record the adjournment, I will use it in the corridor, one-handed."
- **Product answer**: the hearing board (zone-sorted cross-matter docket), `recordHearingOutcome` with `scheduledNextHearing` (deterministic side-effect + the Gavel Settles, 05), deadline rules that regenerate on reschedule, outcome-due as a first-class red state.

### P3 — Faisal, paralegal & custody keeper (the chain operator)

- **Role/context**: the firm's one paralegal; keeper of the originals register (a paper notebook: "safe A", "with counsel Layla", "court file"). Documents leave to hearings, translation desks, and client meetings; they come back — eventually.
- **Goals**: one register for every document and version with *who has it now*; a check-out/check-in habit the attorneys actually complete; know before closing a matter which originals never came back; be able to prove a document's chain intact when a court or counterparty challenges it (q7 — custody as authentication).
- **Frustrations**: attorneys borrow originals with a verbal "I'll bring it back"; sealed/filed versions get edited "just a small fix" and nobody knows which copy went to court; when the judge asks "where was this document between September and November," the honest answer is nowhere written down.
- **Quote (paraphrase-marked)**: "People treat the originals like library books with no due date. I want a system where taking one out *requires* leaving a line in the ledger — and where the case cannot close while the library is still missing books."
- **Product answer**: the custody chain (append-only, `seq = last + 1`), check-out/presented/check-in/returned actions, version sealing (immutable + fingerprint), `verifyChain`, the unreturned-originals closure blocker, paralegal-permissioned document work (07b roles).

### P4 — Hind, client-side in-house counsel (the viewer)

- **Role/context**: in-house counsel at Marafi Trading (07c seed client), the firm's institutional client with 2 live commercial matters. Today she gets hearing dates by asking Abdullah's office to email her, and answers *her* CFO with "I'll check with the firm."
- **Goals**: see her matters' timelines and upcoming hearing dates herself, without asking; know the next date the moment it exists (the adjournment) so her internal reporting is same-day; read it in Arabic, with the case numbers readable as case numbers.
- **Frustrations**: second-hand information latency measured in days; the emailed PDF snapshot is stale by the next adjournment; being forced into the firm's *English* interface to read an Arabic court's schedule (locale-as-afterthought — D1–D6 pattern, 01).
- **Quote (paraphrase-marked)**: "I don't need to edit anything in the firm's system. I need to *see* the timeline — in Arabic, with the countdown — the same day the judge moves the hearing."
- **Product answer**: the free viewer seat (reads timeline + hearing dates of attached matters, nothing else — 07b Session role `viewer`), bilingual-ar chrome default, zone-colored countdown visible read-only.

## Jobs-to-be-done

| # | Job (user's words, paraphrase-marked) | Persona | Map (03) |
|---|----------------------------------------|---------|----------|
| J1 | "When I open my laptop at 8:30, tell me which hearings need me this week — most urgent first." | Layla (Abdullah secondary) | CP-2.1 hearing board |
| J2 | "When the judge adjourns to a new date, make the new hearing exist and recompute everything that depends on it." | Layla | CP-2.5 outcome + rule-8 side-effect |
| J3 | "When a hearing's date passes, keep asking me what the court decided — don't let it silently become history." | Layla / Abdullah | outcome-due zone + closure gate (CP-2.1, CP-5.1) |
| J4 | "When I take an original out of the safe, record that it left, with whom, for what; and when it comes back, close the loop." | Faisal | CP-3.3–3.6 custody entries |
| J5 | "Before I tell the client their case is done, show me everything that says it isn't." | Abdullah | CP-5.1 closure gate |
| J6 | "When we open a matter, set up the standard deadlines automatically from the kind of case it is — and nothing more." | Abdullah / Faisal | CP-1.4 stock rules |
| J7 | "When the client's counsel asks about her case, let her read the timeline herself instead of emailing my office." | Abdullah / Hind | viewer seat (04 S2 read mode) |
| J8 | "When an auditor or opponent challenges our record of a document, prove the chain intact — every entry, in order, with fingerprints." | Faisal | CP-3.7 verifyChain |
| J9 | "When we close a file, produce the archive: the timeline, the custody ledger, the deadlines — as one package." | Abdullah | CP-5.3 export |

## Objections & responses (sales-blocking, honestly answered)

| Objection | Response (product-grounded) |
|-----------|------------------------------|
| "We already pay for a practice-management suite — this is a second seat cost." | The suite is billing-led and its calendaring is an integration promise (01 D1–D4); this is the docket instrument the litigation bench actually opens every morning. 12 Q-3 prices it *below* the suites' per-seat band ($30–$75 anchor range, CaseFleet-adjacent [q6]) with the client viewer free. |
| "The court's platform already tells lawyers about sessions." | The court tells *lawyers with a license login* about *court-side* events [q8]; it does not run the firm's deadlines, custody, or closure — and it is not bilingual firm-side data. Adjacent by design (00 LOOP-10: no e-filing, no court integration). |
| "Deadlines here are jurisdiction rules, not formulas — rules change." | The product never asserts jurisdiction rules: rules are *firm-authored parameters* (trigger, offset, lead, scope) over the firm's own events (07a DeadlineRule); CalendarRules-style rule-set content is an explicit future-loop, not v1 (12 Q-6). The firm tunes its own practice discipline. |
| "Attorneys won't record outcomes — it will go stale like the spreadsheet." | Outcome-due is a first-class red state on the board and a hard closure blocker — staleness becomes visible and consequential, not silent (m-003 fixture proves the surfacing). And the adjournment flow *reduces* typing: recording the outcome creates the next hearing (J2). |
| "A chain of custody is criminal-law theater; we do commercial work." | Custody is an authentication convention in civil litigation too (q7) — and the immediate value is internal: unreturned originals block closure, borrowed originals are locatable, sealed versions stop "just a small fix" edits. |
| "No AI? Everyone's selling AI legal assistants." | The engine is deterministic deadline and custody rules — same state, same outputs, every time (07a declaration). Nothing in a docket clock or a custody ledger should be probabilistic; the AI wave is refused at the identity level (05 brand-distance: no AI-purple, no sparkle glyphs). |

## Method note (honest)

No interviews were conductable this pass (no panel access; category evidence is vendor-page and editorial review shaped — q1–q12). Personas are composites grounded in: the retrieved category's own marketing fears (deadline misses, "slips through the cracks" [q12]), the docketing category's existence [q11], court-side digitization [q8], bilingual staffing evidence [q10], and the seeded firm of 07c (which was authored from the same evidence). 02-level claims stop where the evidence stops.
