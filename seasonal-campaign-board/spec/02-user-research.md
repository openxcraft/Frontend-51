# 02 — User Research: seasonal-campaign-board

SME-B pass · Paraphrased sentiment only, marked — zero invented quotes. Personas are synthesized from the demand/complaint evidence in 01 (guides, comparison threads, checklist-template genre) and the sibling calendar's buyer pool; they are research-grounded composites, not interviewed individuals.

## Persona 1 — Reem, Retail Marketing Lead (primary, economic buyer)

**Role**: heads a 6-person marketing team for a mid-size KSA home & kitchen retailer (2 e-com + 20 stores). Owns the seasonal calendar: Ramadan, both Eids, White Friday, Saudi National Day, Founding Day, back-to-school. Runs readiness today in a spreadsheet she built in 2023 and a group chat.
**JTBD**: "When a season is 8 weeks out, I want every campaign's readiness visible on one countdown board, so I know two weeks before go-live — not two days — what is slipping and who owns the fix."
**Triggers**: last Ramadan's gifting teaser shipped 4 days late because the brief sat unread in chat; her spreadsheet hard-codes Hijri dates that shifted; the CEO asks "are we ready for White Friday?" and the honest answer requires three phone calls.
**Objections + responses**: "another tool my team won't maintain" → checklist items arrive pre-populated from the moment template with owners; maintenance is checking a box, not authoring a doc. "we plan seasons, not dates" → moment library with phases and drift, not a blank calendar grid. "I don't need AI guessing" → non-AI by design (00).
**Success moment**: opens the board in Monday stand-up, reads at-risk/overdue counts per campaign, assigns one fix, done.
**Sentiment (paraphrase)**: seasonal readiness today feels like memory work — the knowledge of what must be ready by when lives in heads and old spreadsheets, and leaves when people do.

## Persona 2 — Fahad, E-commerce Specialist

**Role**: runs the storefront campaigns (homepage takeovers, category merchandising briefs, COD flows) for the same retailer; his work must be *live* at T-3 days before a moment, not at the moment.
**JTBD**: "When the countdown hits my due dates, I want my checklist items to arrive already sequenced — storefront banner at T-14, promo config at T-7, price-file freeze at T-2 — so I stop rebuilding the sequence each season."
**Triggers**: a White Friday price freeze that almost missed the deal week; being blamed for "late" when the brief reached him late.
**Objections + responses**: "checklists are for juniors" → items carry criticality and role metadata from the template; blocked-with-reason is his defense record. "I live in the storefront platform" → task handoff export (08) lands the work where he works; the board stays the source of readiness truth.
**Sentiment (paraphrase)**: the pain isn't doing the tasks, it's discovering the task exists when it's already late.

## Persona 3 — Noura, Content Coordinator

**Role**: bilingual content — seasonal copy in Arabic and English, gift-guide pages, national-day creative briefs. Interacts with the sibling bilingual-content-calendar for slot planning; needs *when* the campaign needs *what*.
**JTBD**: "When a moment's build-up window opens, I want the countdown-linked content deadlines surfaced early — teaser at T-21, guide at T-10 — so bilingual content isn't the thing that slips."
**Triggers**: Eid copy written twice because the brief changed after drafting; Arabic copy blocked on a national-day tone review nobody scheduled.
**Objections + responses**: "will this fight my content calendar?" → boundary is explicit (12): this board owns readiness deadlines; slot/channel planning stays in the calendar; handoff between them is export. "dates in Hijri confuse my EN stakeholders" → dual-calendar strip with active-system disclosure and hover cross-reference.
**Sentiment (paraphrase)**: content is always the last domino, because its deadlines are never anyone's first.

## Persona 4 — Yousef, Store Marketing / Field (secondary)

**Role**: 20 store managers' point of contact; seasonal POS materials, staff briefing sheets, in-store event nights (Ramadan majlis-style evenings, national-day decor).
**JTBD**: "When a season approaches, I want a printable/forwardable readiness list per store campaign with owners and dates, so store execution doesn't depend on me forwarding chat messages."
**Triggers**: stores received national-day materials 2 days late via courier because nobody tracked a "print and dispatch by T-5" item; staff evening scheduling clashes found on the day.
**Objections + responses**: "store people won't use a web app" → read-only mobile monitoring + task handoff export (a list, not an app requirement); assignment works for field owners with the same checklist rows.

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Reem | season → all-campaign readiness oversight | per moment (6–9/yr) + daily glance | tool-maintenance fatigue |
| Fahad | countdown → sequenced storefront readiness | per campaign, daily in build-up | checklist stigma; lives in storefront tool |
| Noura | build-up window → bilingual content deadlines | per campaign | calendar-tool turf confusion |
| Yousef | campaign → store-floor readiness handoff | per campaign | field workers outside the web app |

## Voice derivation (SME-J)

Board voice: coach-calm, deadline-honest — energetic about the season, never panic about the clock. Numbers are facts ("3 items overdue"), not scolding. Arabic is فصحى بيضاء (plain MSA) in all system chrome; seasonal warmth ("رمضان كريم" style greetings) is *content*, never button copy. Error copy addresses the situation (a blocked item, a stale edit), not the person. Fixed terminology (one term per concept everywhere, copy-voice §3.3): لحظة moment · موسم season · حملة campaign · قائمة الجهوزية checklist · بند item · المسؤول assignee · العدّ التنازلي countdown · الجهوزية readiness · ملاحظة الإغلاق closure note · قالب template · سجل النشاط activity log · التمهيد build-up · الذروة peak · الانحسار wind-down.

## Pains → spec traces

- Memory-work readiness → moment library + templates + closure-to-template loop (03 CP-1/CP-5).
- Late discovery of owned tasks → countdown-linked due offsets + at-risk thresholds (06 CountdownTile, 07b getReadiness).
- Hijri drift breakage → driftDisclosure + goLiveOverride (07a Moment, 03 CP-1 edges).
- Field/executor handoff → task handoff export + read-only mobile (08, 04).
- "Are we ready?" reporting → readiness meter + readiness report export (03 CP-3, 07b).
