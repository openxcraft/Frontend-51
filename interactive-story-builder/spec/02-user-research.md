# 02 — User Research: interactive-story-builder

SME-B pass · Paraphrased insight statements only — zero invented verbatim quotes.

## Persona 1 — Rania, Visual Journalism Producer (primary)

**Context**: 2–4 interactive features monthly at a pan-Arab newsroom; investigations + photography + data figures; Arabic master + English edition; previously waited on a shared dev queue. **Tools today**: slide-to-HTML handoff, a map-story builder, developer time.
**Goals**: compose scroll features herself in a day; keep Arabic first-class, not a translation appendix; hand editors a reviewable structure.
**Frustrations**: admired tools are LTR-first (sentiment around award roundups, research 01); mirrored templates break Arabic typography; two separate story copies drift within days.
**JTBD**: "When an investigation closes, I want to assemble the bilingual scroll structure — chapters, steps, media — myself in a day, so the feature ships while the story is still news."

## Persona 2 — Omar, NGO Communications Lead

**Context**: regional humanitarian NGO comms lead; owns the bilingual annual/impact report; last year's interactive was an agency build he cannot edit. **Tools today**: design agency for interactives; document suite for the PDF fallback.
**Goals**: rebuild the annual narrative in-house; keep ar/en aligned (funders read English, communities read Arabic); duplicate last year's story as next year's skeleton.
**Frustrations**: agency cost per report; pay-to-publish tools recharge for every correction (sentiment around per-story pricing, research 01).
**JTBD**: "When the program year closes, I want to assemble the impact story from our media and numbers without an agency, so it costs staff hours, not retainer fees."

## Persona 3 — Dr. Farida, University Instructor

**Context**: teaches field-research methods; map-story tools overshoot for narrative field trips (tool-fit sentiment, research 01). **Tools today**: library map-story subscription, slide tools, hand-built pages.
**Goals**: assign story-building as no-code coursework; review and grade per-student stories; reuse a field-trip arc each term.
**Frustrations**: slide tools produce quizzes, not narratives; free embed tools are fragments without a reviewable workflow.
**JTBD**: "When the field course runs, I want students to build a step-by-step narrative from their photos and notes, so the artifact demonstrates method, not tooling luck."

## Persona 4 — Lina, Bilingual Story Editor (reviewer)

**Context**: edits and approves Rania's features; guardian of Arabic style and parity standards; reviews in Arabic, sanity-checks English. **Tools today**: document comments, then hope.
**Goals**: review chapter-by-chapter against sync state; pin notes to steps; approve with an auditable trail.
**Frustrations**: parity checking across two copies is manual; post-approval structural changes are invisible to her.
**JTBD**: "When a story reaches me, I want to see exactly where the two locales disagree and approve against a QA report, so my sign-off means both editions are shippable."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Rania | investigation → bilingual scroll feature | 2–4×/month | RTL native, not mirrored hacks |
| Omar | program year → bilingual impact story | 1–2×/year + campaigns | in-house cost control; no per-story ransoms |
| Dr. Farida | course → per-student story artifacts | per term | no-code students; reviewable/gradable |
| Lina | bilingual story → approved | per story | parity visibility before sign-off |

## Trigger events

Investigation closes (Rania) · program-year/funding deadline (Omar) · term start and field-trip return (Farida) · story entering review (Lina) · a competitor's expensive interactive ships and editors ask "why not us".

## Objections + responses (spec answers)

- "We already pay for an editorial storytelling tool." → It is LTR-first with pay-to-publish friction (01 [2][3][4]); our value is the bilingual/RTL capability it does not model.
- "Students can use free tools." → Free tools are fragments without structure, review, or grading workflow.
- "Our developer builds these." → Developer time is the bottleneck the category exists to remove; structure-first authoring makes the producer autonomous.
- "Is AI writing our journalism?" → No: suggestions propose structure only, draft-by-default, degrading to deterministic templates (ai-native-patterns §6/§8).

## Workflow pains (cross-persona)

1. Two copies of every story drift; parity is unauditable (Rania/Lina).
2. Arabic layout is a mirroring afterthought that breaks typography and media placement (Rania).
3. Review happens outside the tool, on exports and screenshots (Lina).
4. Annual rebuilds restart from zero; nothing reusable (Omar/Farida).
5. Per-story publishing fees punish corrections (Omar).

## Voice derivation (SME-J)

Editor-calm: a patient desk editor — precise, unhurried, structure-literate. English professional-neutral, contractions off. Arabic فصحى بيضاء, unvocalized. Fixed terminology: قصة=story · فصل=chapter · خطوة=step · مزامنة=sync · معاينة=preview · تصدير=export · قالب=template · اقتراح البنية=structure suggestion.
