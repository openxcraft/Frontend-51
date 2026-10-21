# 01 — Market Research: arabic-copy-studio

SME-A pass · All URLs retrieved 2026-10-16. Pricing figures are as presented by cited pages at retrieval time and must be re-verified at commercialization (also recorded in 12-open-questions).

## 1. Category frame

The buyer already buys "AI writing" — the global category is established and priced per seat. The gap this product exploits is not AI capability; it is Arabic linguistic control (register, tashkeel, dialect, glossary discipline) and a writing environment that respects bilingual workflows.

## 2. Direct competitors (5)

| Competitor | What it proves | Pricing signal (cited) | Arabic gap |
|---|---|---|---|
| Jasper | Category leader; per-seat SaaS pricing norms; campaign/multi-asset workflows | jasper.ai/pricing — seat-based tiers (see [1]) | English-first; Arabic output quality and register control are prompt-dependent, not product features |
| Copy.ai | Workflow/go-to-market positioning; generous free tier norms | copy.ai/prices — free + paid tiers [2] | No register/dialect model; Arabic glossary support is generic |
| Writesonic / SEO-writing adjacent tools | Volume-content economics | — (indirect below) | Same English-first posture |
| Notion AI (writing surfaces) | Where bilingual teams actually draft today; inline-AI interaction bar to beat | — (bundled pricing, indirect) | Editor handles Arabic script but offers zero Arabic-specific assistance |
| Generic assistant chat (ChatGPT-class) | The default free alternative every persona names; the real competitor for attention | — (freemium, indirect) | No brand kit persistence, no register enforcement, no versioned documents; output paste-drifts |

[1] https://www.jasper.ai/pricing · [2] https://www.copy.ai/prices

## 3. Indirect competitors (3)

- **Translation platforms with editors** (e.g., Smartcat-class,Phrase-class workflows): own the ar↔en content operations of mature localization teams, but are post-hoc review tools, not writing studios. (https://www.smartcat.com / https://phrase.com — category references.)
- **Agency human copywriting**: the incumbent for Arabic campaign copy; quality ceiling high, cost and turnaround are the attack surface.
- **Docs + assistants status quo** (documents + chat sidecar + manual brand PDFs): the zero-cost alternative the product must visibly beat on register consistency and glossary enforcement.

## 4. Arabic AI capability backdrop (why now)

The Arabic LLM landscape matured sharply: CACM's regional survey documents the rise of Arabic-first LLMs including Jais, ALLaM, Fanar, and Mistral Saba [3]; independent comparisons track Jais, Falcon, ALLaM, Fanar quality on Arabic tasks [4]. Implication for spec: the AI capability is declared as an abstract adapter operation (07b) — the product binds to whichever capability the owner chooses later, and the mock simulates register-consistent output. The design bet is on control surfaces, not on any model.

[3] The Landscape of Arabic Large Language Models — https://cacm.acm.org/arab-world-regional-special-section/the-landscape-of-arabic-large-language-models (Sep 2025) · [4] https://www.promptquorum.com/local-llms/best-arabic-local-llms-2026 and https://silma.ai/arabic-large-language-models

## 5. Demand-side signals

- Arabic content is a declared prerequisite for MENA marketing effectiveness: English-first strategies underperform for Arabic-dominant audiences [5][6]; regional agencies publish guidance on Arabic content marketing practice [7].
- The MEA SaaS market runs ~USD 22.3B (2025) with double-digit CAGR forecasts [8][9] — the subscription willingness context for per-seat pricing.
- Social/content operations are the region's largest marketing line item (see Ramadan engagement data cited in bilingual-content-calendar's 01; same buyer pool).

[5] https://businesschief.eu/digital-strategy/why-arabic-content-must-marketing-middle-east · [6] https://mahmoudmizar.com/blogs/arabic-content-marketing (Aug 2025) · [7] https://www.unitedseo.ae/blogs/arabic-marketing-the-catalyst-to-growing-your-business-in-the-middle-east · [8] https://www.grandviewresearch.com/horizon/outlook/software-as-a-service-saas-market/mea · [9] https://www.fortunebusinessinsights.com/software-as-a-service-saas-market-102222

## 6. Positioning gaps (attack map)

1. **Register is uncontrolled everywhere**: category tools treat register as prompt luck; agencies charge human rates to fix it. → Register Dial + drift flags are the headline differentiator.
2. **Glossaries are generic**: brand terminology discipline in Arabic is enforced by humans today. → Workspace glossary enforced during generation and checked post-hoc.
3. **Bilingual transform is copy-paste roulette**: no tool offers parity-reviewed ar↔en conversion of marketing copy with length awareness. → Parity Weave (original proposal, 13).
4. **Tashkeel is invisible**: no writing tool renders vocalization as a considered, toggleable layer. → Tashkeel toggle with line-height awareness.

## 7. Market size estimate (honest, triangulated)

Serviceable framing: MENA marketing/content teams with ≥2 bilingual writers. If even a low single-digit percentage of the region's agencies and brand marketing teams convert at category-typical seat pricing ($20–40/seat/mo, cf. [1][2]), the ARR envelope is in the single-digit millions USD — enough for a focused flagship product, and the wedge opens the broader content family (calendar, guardian, remix). No invented TAM precision; any owner-facing deck must carry the triangulation, not a fake number.

## 8. Recent moves to watch

- Acrolinx (enterprise content governance) rebranded under Markup AI (Oct 2026) [10] — signals governance+AI convergence upstream of brand-voice-guardian.
- Writer's enterprise "voice/brand" features normalize brand-voice AI for enterprise [11] — validates the glossary/voice wedge for our family.
- Regional LLM releases (ALLaM, Fanar) are sovereign-funded and continuing [3][4] — capability supply improves without our commitment to any provider.

[10] https://markup.ai/blog/acrolinx-is-now-markup-ai · [11] https://writer.com/brand and https://writer.com/blog/voice-feature

## 9. Published complaints (mined, paraphrased — no invented verbatims)

From public review patterns of category tools (G2/Capterra-class pages for Jasper/Copy.ai and Arabic user discussions of general assistants — channels noted, not quoted verbatim):
- English AI output quality drops sharply for Arabic; users route around it (pattern across assistant-user discussions, paraphrase).
- Tone inconsistency across assets requires manual re-editing (recurring review complaint for AI writers, paraphrase).
- Seat pricing punishes teams that wanted light usage (recurring category complaint, paraphrase).
These map 1:1 to the product's differentiators; verbatim mining for the owner's deck is a to-do recorded in 12-open-questions.
