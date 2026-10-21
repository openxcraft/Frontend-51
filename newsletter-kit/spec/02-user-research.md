# 02 — User Research: newsletter-kit

SME-B pass · Paraphrased sentiment only (marked). Persona counts are illustrative.

## Persona 1 — Rania, Community Program Manager (primary)

**Role**: runs a bilingual developer-community newsletter (weekly issue, ~4,800 members, locale mix ≈60% ar / 40% en by stated preference). Two seats: her + a part-time editor.
**JTBD**: "When Monday comes, I want both language editions composed, checked, and out the door in one morning, so the newsletter stops eating the community program's week."
**Triggers**: an Arabic issue rendered with reversed punctuation and overlapping lines for part of her list; subject lines that truncated into nonsense on mobile; members complaining they got the wrong-language edition.
**Objections**: "I already have a sending arrangement — I don't want to migrate it" (answer: the delivery channel is abstract; export path works forever); "another tool that half-handles Arabic" (answer: the QA checklist is the product, not a promise).
**Onboarding motive**: run the QA checklist on her current draft and see it catch what broke last month.

## Persona 2 — Faris, Digital Editor at a Regional Publisher

**Role**: responsible for a daily Arabic-first briefing + weekly English digest; 12,000+ subscribers; sends through the publisher's existing mail arrangement which he cannot change.
**JTBD**: "When I schedule the briefing, I want proof it will render correctly before it leaves — not an apology after," so QA becomes a gate, not a post-mortem.
**Triggers**: an issue-wide RTL failure that reached the full list; italic-styled Arabic paragraphs that broke in clients; mixed numerals in the same sentence surviving three proofreads.
**Objections**: "checklists become checkbox theater" (answer: fails block scheduling — the gate is mechanical); "my sending stack is not yours to replace" (answer: channel binding is abstract, verification is a round-trip, export is the fallback).

## Persona 3 — Huda, Solo Bilingual Creator

**Role**: consultant writing a biweekly ar/en newsletter to ~2,300 professional readers; one seat; price-sensitive.
**JTBD**: "When I write the issue, I want subject variants for both languages drafted fast and picked deliberately, so open rates stop being a coin flip I can't study."
**Triggers**: watching subject rewrites outperform her originals; paying for a growth platform whose funnels she never uses.
**Objections**: "AI suggestions are a coin flip themselves" (answer: assist is draft-by-default, metered, and degrades to a manual alternates editor that is always there); "I won't pay subscriber-volume pricing for a tool that doesn't send" (answer: flat per-seat posture, 01).

## JTBD summary

| Persona | Core job | Frequency | Primary objection → answer |
|---|---|---|---|
| Rania | bilingual issue out the door, verified | weekly | keep existing sending → abstract channel + export |
| Faris | prove render correctness pre-send | daily/weekly | QA must gate mechanically → fails block scheduling |
| Huda | subject variants per locale, cheaply | biweekly | AI trust + price → draft-by-default assist + flat seat |

## Voice derivation (SME-J)

Newsletter-kit voice: desk-editor practical — calm, specific, checklist-honest ("QA found 2 fails in the Arabic edition — fix them or record why you're sending anyway"). Arabic فصحى بيضاء for system copy; dialect never appears in chrome. Fixed terminology (one concept, one term): عدد=issue، كتلة=block، نظير=twin block، نسخة موضوع=subject variant، قائمة المشتركين=subscriber list، قائمة الفحص=QA checklist (distinct term from قائمة المشتركين)، قناة الإرسال=delivery channel، فحص=check، نتيجة الفحص=check result، مهمة إرسال=send job. Numbers: Western digits everywhere (ledger), never mixed mid-sentence.
