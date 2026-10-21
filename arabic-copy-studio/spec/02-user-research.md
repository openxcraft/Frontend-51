# 02 — User Research: arabic-copy-studio

SME-B pass · Personas are synthesized from market research (01) and public category-review patterns. All verbatims are PARAPHRASES of recurring public sentiment (marked), never invented quotes.

## Persona 1 — Layla, Agency Copy Lead (primary daily user)

**Role**: leads a 6-writer bilingual copy team at a Riyadh brand agency; 12–18 active campaign assets at any time; answers to account directors and client brand managers.
**Context**: bilingual (Arabic-dominant), works in Arabic, briefs often arrive in English, masters in Arabic: register precision is her craft identity.
**JTBD**: "When a client campaign needs Arabic copy that doesn't read like translated English, I want to control the register per asset and enforce the client's terminology, so the work survives brand review without a third revision cycle."
**Triggers**: client brand manager rejected copy for being "too stiff" (فصحى وسطى needed, بيضاء delivered); a new client glossary arrived as a messy spreadsheet; deadline compression making human-only drafting uneconomic.
**Objections**: "AI writes generic MSA with no house voice"; "my glossary is client-confidential — where does it go?"; "register toggles will produce mush neither formal nor human".
**Onboarding motive**: prove register control on ONE real campaign asset in the first session, not a demo sandbox.
**Verbatim (paraphrase, recurring agency-writer sentiment in public AI-writing discussions)**: "It's fast, but I spend the saved time fixing tone."

## Persona 2 — Omar, Brand Manager (economic buyer voice, reviewer)

**Role**: brand manager at a UAE e-commerce group; owns brand voice across ~40 people who touch copy; not a daily writer.
**Context**: Arabic-first brand, English corporate layer; obsessed with consistency; burned by freelancers drifting terminology.
**JTBD**: "When 12 writers and 3 agencies produce copy for my brand, I want drift surfaced before publish, so I stop being the human spell-checker."
**Triggers**: a regional campaign shipped with three different Arabic renderings of the same product feature name; audit found off-register copy in email flows.
**Objections**: "another tool my team will abandon"; "glossary setup must not cost me a workshop day"; "what happens when the AI is down on deadline day?" (degradation map must satisfy him — ai-native-patterns §8).
**Onboarding motive**: import the existing brand-voice PDF + term sheet and see drift flags on current live copy within the trial.
**Verbatim (paraphrase, common brand-manager complaint in content-governance discussions)**: "Consistency is the whole job; speed is negotiable."

## Persona 3 — Nour, E-commerce Content Lead (volume user)

**Role**: runs a 3-person content desk at a Cairo marketplace seller; 200+ product descriptions per month in ar+en.
**Context**: price-sensitive, deadline-driven, quality bar "good enough to convert"; currently uses a general assistant with copy-paste.
**JTBD**: "When we onboard 60 SKUs a week, I want register-consistent bilingual product copy at volume, so conversion doesn't die on robotic Arabic."
**Triggers**: assistant output needs so much cleanup the time saving evaporates; brand audit failed on terminology.
**Objections**: per-seat + AI metering must beat the free assistant on effective cost per approved description; "I won't babysit a queue".
**Onboarding motive**: run a 20-SKU batch through transform + glossary and measure cleanup time against last month.
**Verbatim (paraphrase, marketplace content-desk sentiment)**: "Volume tools forget Arabic isn't just another language dropdown."

## Persona 4 — Hussein, Independent Bilingual Copywriter (solo tier)

**Role**: freelancer serving 5 retained clients from Amman; each client has its own voice and glossary.
**JTBD**: "When I switch between client voices daily, I want workspace-per-client separation with instant voice recall, so setup cost never eats my day rate."
**Triggers**: sent Client A's terminology into Client B's deck (his nightmare story); assistant chats leak context across clients.
**Objections**: subscription must be one seat, multi-client; "if it stores my prompts across clients, I'm out".
**Onboarding motive**: create two client workspaces and see strict separation guarantees in the credential/privacy copy.
**Verbatim (paraphrase, freelancer privacy sentiment in creator forums)**: "My clients pay for separation, not just quality."

## JTBD summary matrix

| Persona | Core job | Trigger frequency | Primary objection to overcome |
|---|---|---|---|
| Layla | Register-controlled campaign copy | weekly | AI quality skepticism |
| Omar | Pre-publish drift control | campaign cycle | tool-abandonment risk |
| Nour | Volume bilingual product copy | daily | effective cost per approved asset |
| Hussein | Client-separated voice recall | daily | confidentiality/separation |

## Onboarding motives → flow mapping (feeds 03)

First-session value proof per persona drives the first-run flow: brand kit quick-start (Omar), single-asset register demo with sample brief (Layla), batch transform trial (Nour), multi-workspace separation (Hussein). The onboarding checklist (P22) therefore offers four entry paths, not one linear tour.

## Objection → design response matrix (spec-level sales honesty)

| Persona | Objection (02 above) | Where the spec answers it |
|---|---|---|
| Layla | "AI writes generic MSA" | Register Dial + drift flags (CP-1); register pinned on every document (07a) |
| Layla | "register toggles produce mush" | Register preview before commit (13 B2); accept/reject always (CP-2) |
| Omar | "another abandoned tool" | Value-checklist onboarding (P22, S2); first-session proof per persona path |
| Omar | "glossary setup cost" | Paste-import + skip-with-consequences (CP-1.2); 30-min counterpart documented in guardian's 00 for comparison |
| Omar | "AI down on deadline day" | Degradation map (08): writing/review/export survive rung 4 |
| Nour | "cost per approved description" | Cost transparency (P14) + usage ledger (07a); metered units = work units (ai-native-patterns §4) |
| Nour | "won't babysit a queue" | Jobs center with per-item retry (S13); partial results policy (async-contract §4) |
| Hussein | "multi-client separation" | Workspace-scoped glossaries/docs (07a); no cross-workspace operation exists on the adapter |
| Hussein | "prompts leak across clients" | Session bound to workspace (07b); no cross-workspace read anywhere in contract |

## Voice derivation (feeds 05/11 via SME-J)

Studio voice: master-craftsman register — precise, calm, confident; zero marketing glitter. Arabic UI copy: فصحى بيضاء, terminology disciplined (مفردات ثابتة: مسودة=draft, صياغة=generation, معجم=glossary). English: professional-neutral, short. Errors are situation-focused, never user-blaming (copy-voice.md §1.4).
