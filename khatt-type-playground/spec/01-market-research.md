# 01 — Market Research: khatt-type-playground

SME-A pass · URLs retrieved 2026-10-16 · Raw results: research/batch2/khatt-type-playground-research.md.

## Category overview

Three tool categories feed this product: font-pairing discovery (generators + curated sites — Latin-only today), type-scale/specimen utilities, and foundry specimen pages (single-family marketing). A fourth layer — Arabic/Latin pairing practice — exists as knowledge (foundry docs, agency blogs, W3C layout requirements) rather than tooling. khatt occupies the empty intersection: an interactive bilingual pairing bench where Arabic OpenType behavior (contextual alternates, kashida/`jalt`) is a first-class control surface.

## Direct competitors (≥5)

| # | Competitor | Proof | What it does | Gap we exploit |
|---|---|---|---|---|
| 1 | Fontjoy | https://fontjoy.com · https://fontjoy.com/pairing | Deep-learning pairing generator, one-click | Latin-only; black-box (no inspectable criteria); community skepticism about randomness (r/Design thread, paraphrased) |
| 2 | Typewolf (+ Lookbooks) | https://www.typewolf.com · https://www.typewolf.com/lookbooks | Curated pairing recommendations; paid lookbooks (12 palettes each — pricing unverified) | Latin-only curation to *read*, not a bench to *work*; no feature-level controls |
| 3 | Typescale | https://typescale.com | Modular scale generator with CSS | Scale-only, single font, Latin-only; no Arabic constraints (tracking 0, joined-script rules) |
| 4 | TypeDetail Font Playground | https://play.typedetail.com | Variable-font playground, single font | No pairing lab, no Arabic script depth; experimenter chrome |
| 5 | Online specimen generators | https://typedrawers.com/discussion/4309/online-specimen-generators | Web specimen generation limited to present glyphs | Foundry-marketing shape (one family); no bilingual pairing, no kashida demo |
| 6 | Foundry specimen pages (Boutros, 29LT, TPTQ Arabic, Alif Type) | https://www.boutrosfonts.com/+-Modern-Arabic-Bilingual-Fonts-+.html · https://www.29lt.com/custom-type · https://tptq-arabic.com · https://aliftype.com/blog/introducing-raqim-kashida/english | Showcase Arabic/Latin families | One family at a time; the *pairing* decision and interactive controls are the buyer's problem |

## Indirect competitors (≥3)

- **Bilingual brand-identity agencies** (Sukara https://www.sukaradesign.com/arabic-english-brand-identity · Nihad Taisir Studio https://nihadstudio.com/services · GLDS https://gaellelamirault.com/blog/arabic-english-bilingual-branding): sell the pairing judgment as a service — the ceiling above us; we sell the bench.
- **Design-suite typography panels**: deep but embedded in print-era dialogs (community threads, e.g., https://community.adobe.com/questions-671/elaborating-on-kashida-justification-875892); not a standalone pairing lab.
- **DIY pairing boards/lists** (Pinterest; Reddit asks like https://www.reddit.com/r/typography/comments/1ndj288/typefaces_with_arabic_support): free, chaotic, unverifiable — the manual status quo we formalize.

## Market / demand evidence

- Pairing behavior is established: Fontjoy and Typewolf operate at designer scale; Typewolf monetizes curation (lookbooks — unverified estimate: paid knowledge products).
- Arabic type demand rising: "Arabic type is a hot design topic this year" (https://www.papercutinteractive.com/type-foundry-of-the-month-arabic-typography); dedicated Arabic/Latin foundries are commercial businesses (Boutros, 29LT, TPTQ).
- Bilingual branding is a paid Gulf service category (Sukara; Dubai Monsters, https://dubaimonsters.com/bilingual-logos-arabic-and-english-cost-design-challenges); agencies publish pairing heuristics ("match visual weight… equally bold or light at the same point size", GLDS) because no tool carries them (https://cpoint-sa.com/en/blog/brand-typography; https://the-brandidentity.com/project/zainas-bilingual-identity-for-mira-unites-arabic-and-latin-scripts-through-shared-punctuation).
- The kashida/`jalt` gap is documented, not speculative: ATypI "Deficiencies of Handling Arabic Script in OpenType" (https://atypi.org/presentation/deficiencies-of-handling-arabic-script-in-opentype-and-some-possible-solutions); Reading typoarabic (https://research.reading.ac.uk/typoarabic/on-arabic-justification-part-2-software-implementations); `jalt` documentation scarcity (https://typedrawers.com/discussion/5704/jalt-feature-in-arabic-fonts-support-and-practical-experiences); "justification alternates… not widely supported" (Typst #195, https://github.com/typst/typst/issues/195); W3C ALREQ (https://www.w3.org/International/alreq); Arabic font-stretch failing on the web (https://stackoverflow.com/questions/55463144/how-to-make-arabic-font-stretch-condensed-or-expanded-in-css).

## Pricing landscape

Free utilities anchor the tier (Fontjoy, Typescale, Font Playground); paid curation anchors knowledge products (Typewolf lookbooks); agencies price pairing judgment into engagements (four-figure-plus — unverified estimate). Recommended posture (12 Q-3): flat solo tier; free bench limited by saved-session count, not canvas time.

## Positioning statement

For bilingual brand designers, khatt-type-playground is the pairing lab where Arabic and Latin meet under honest controls: contextual alternates, kashida modes, numeral systems, a shared scale — every claim inspectable. Unlike Latin-only generators (Fontjoy, Typewolf, Typescale), Arabic typography is the subject, not an edge case; unlike foundry specimens, it compares two scripts side by side; unlike agencies, it charges for the bench, not the judgment.
