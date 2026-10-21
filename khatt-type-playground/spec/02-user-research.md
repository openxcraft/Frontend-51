# 02 — User Research: khatt-type-playground

SME-B pass · Paraphrased insights only; zero invented quotes (sentiment marked as paraphrase).

## Persona 1 — Lina, Senior Brand Designer at a Dubai boutique (primary)

**Role**: bilingual identity systems for hospitality, culture, fintech clients; each ships a type chapter (pairing, scale, weights, guidelines).
**JTBD**: "When I define a client's bilingual type system, I want to test Arabic/Latin pairings under real controls — weights matched by eye, kashida behavior seen, alternates toggled — so the type chapter survives production, not just the pitch."
**Triggers**: a guideline rejected because Arabic justification behaved differently in production than in her desktop mock; billable hours burned rebuilding comparison sheets per client.
**Objections + responses**: "I already have my fonts" → catalog + attested licensed-font upload; "I won't learn a tool for a decision I make four times a year" → resumable sessions + exportable specs accumulate value; "my pairings are opinion, don't score them" → no scoring anywhere (deterministic stance).
**Pains (paraphrased from agency guidance + community threads, 01)**: visual-weight matching across scripts is manual eyeballing; justification differs per engine; specimens rebuilt per engagement.

## Persona 2 — Yusuf, Freelance Type-Focused Designer

**Role**: identity work with calligraphic sensibility; explores joining forms, stylistic sets, display Kufi; advises on Arabic font behavior.
**JTBD**: "When I evaluate an Arabic family, I want glyph-level inspection — joining forms, alternates, tatweel behavior — so I know what the face does before I spec it."
**Triggers**: discovered too late a display face shipped no `jalt` and broke under justification.
**Objections + responses**: "font detail belongs in a font editor" → we inspect, never edit (LOOP-10); "desktop apps already do this" → the web bench is instant, shareable, bilingual by default.

## Persona 3 — Dana, Design Lead at a Regional Publisher

**Role**: editorial refresh; must prove a Naskh body + Latin serif pairing at production sizes before committing a masthead.
**JTBD**: "When I refresh an editorial type system, I want reading-condition specimens — long paragraphs at real sizes, tashkeel-on variants, numeral runs — so the choice survives a print committee."
**Triggers**: committees arguing from screenshots; diacritic clipping in a past refresh.
**Objections + responses**: "committees need documents" → exportable sheets with settings printed on them (the artifact *is* the meeting input); "body text needs tashkeel headroom" → leading floors + warnings.

## Persona 4 — Mariam, Creative Director (reviewer, secondary)

**Role**: reviews type proposals across accounts; wants comparability and provenance.
**JTBD**: "When a designer proposes a pairing, I want the proposal to show its settings and provenance — weights, alternates, who curates the notes — so review is minutes, not a workshop."
**Triggers**: proposals as unlabeled screenshots; disputes over what was tested.
**Objections + responses**: "I don't open tools to review" → share views render read-only with the settings panel visible.

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Lina | client type system → tested pairing + guideline artifact | per-engagement | her fonts, her opinions — tool must not judge |
| Yusuf | family evaluation at glyph depth | per-evaluation | inspection ≠ editing |
| Dana | editorial pairing proof at reading sizes | per-refresh | committee needs documents |
| Mariam | review with settings + provenance visible | weekly | won't open a tool to review |

## Voice derivation (SME-J)

Lab-bench voice: precise, quiet, craft-proud — states what a control did and what a font does, never what the user should prefer ("Kashida at 40% — two lines stretched, joins intact", not "Beautiful spacing!"). Arabic فصحى بيضاء with real terminology (كشيدة/تطويل، بدائل السياق، الضبط). Fixed glossary: جلسة اقتران=pairing session · نموذج عرض=specimen · عائلة خطية=font family · ميزة OpenType=feature · شبكة المحارف=glyph grid.
