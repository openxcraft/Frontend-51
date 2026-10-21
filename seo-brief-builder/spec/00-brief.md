# 00 — Brief: seo-brief-builder

Family: content_tools · Tier: 3 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A bilingual SERP-intent content brief builder for MENA content leads and agencies. The user starts from a topic (e.g. "إنشاء متجر إلكتروني" / "start an online store"), brings keyword data into the topic through the abstract SERP-data capability or by pasting/importing a keyword list, and the product turns that raw keyword soup into clustered, intent-labeled structure: Arabic keywords clustered with Arabic-aware normalization and morphology, English keywords clustered on the same principles, every cluster carrying a search-intent label (informational / commercial / transactional / navigational). From that structure the product assembles a writer-ready brief — outline sections, target clusters, questions to answer, must-cover terms — with declared length guidance. The brief is a structured, editable artifact, not a document dump: sections bind to the clusters and intent labels that justify them, so a brief is auditable back to its keyword evidence.

The product's second face is the one no competitor ships: the **intent-parity check**. Bilingual teams in MENA routinely maintain an Arabic content plan and an English content plan for the same topic, built from two keyword universes that nobody reconciles — the Arabic plan quietly misses the transactional intent the English plan covers, or the English plan never answers the informational questions Arabic searchers actually ask (evidence in 01). seo-brief-builder compares the two locales' clustered intent structure and produces a parity result: an intent-by-locale coverage matrix, matched cluster pairs, and named gaps — an intent present in one locale with no counterpart in the other. Gaps can be resolved into brief sections, so both content plans are brought into honest alignment before a single word is commissioned. The check is deterministic comparison logic, not an AI judgment — the same cluster state always yields the same parity result, which is exactly what a QA artifact requires.

Clustering is where the conditionally-AI stance lives (ai-native-patterns.md §1 declaration): an intent-clustering **assist** refines cluster boundaries and suggests intent labels when the capability is available, and the operation degrades to deterministic keyword grouping — normalized-term frequency, Arabic affix rules (definite article, conjunction prefixes, common plural suffixes), shared-term overlap thresholds — when it is not (degradation map in 08, per §8 of the shared AI patterns). The deterministic path is not a stub: it is the orthodox grouping method practitioners already run by hand (research digest Q8), and every assist suggestion is draft-by-default until a human confirms it (P15). Rank tracking, site audits, and backlink data are out of scope (LOOP-10): this product ends at the brief and its handoff export.

## Buyer

Content leads and agencies running bilingual (ar/en) content programs for MENA markets: in-house content managers at brands and publishers commissioning both locales, and agency SEO/content strategists delivering bilingual briefs to clients. The economic buyer is the content lead who answers for whether both locales' content covers the intent ground; the daily user is the strategist or senior editor who turns keyword exports into briefs today, in documents, by hand. Per-seat team tool, not a solo gadget — the parity artifact is only meaningful when someone commissions content from briefs.

## Surface

Web application, desktop-first (≥1280px primary; responsive to 360px in read/review modes). Zones: topic workspace with a per-locale keyword table; cluster canvas (clustered view with assist affordances); intent assignment; parity view (side-by-side ar/en intent coverage with gap list); brief outline editor; briefs library; jobs/activity console. No mobile app; no browser extension; no public API at v1.

## Unique feature

Bilingual SERP-intent briefs with Arabic keyword clustering and an ar/en intent-parity check. Defensible on three grounds (01 evidence): (1) global brief/optimization tools are Latin-market-first — Arabic normalization and morphology is not a first-class clustering input anywhere in the category, so Arabic work stays a human-services business; (2) cross-language intent parity exists as consultancy practice but not as a product artifact (research Q3 — cross-language intent-analysis firms sell it as engagement, not software); (3) the parity result is a governance artifact for the buyer — briefs that keep both locales honest, with gaps traceable to keyword evidence, which a single-locale tool structurally cannot produce.

## Exclusions (LOOP-10)

- No rank tracking, position monitoring, or SERP volatility reporting.
- No site audits (crawl, technical SEO, Core Web Vitals).
- No backlink data or link-building workflows.
- No content optimization scoring of live URLs (the product ends at the brief; optimization-in-editor belongs to the optimization-platform class, 01).
- No publishing/CMS delivery (handoff export only; destination integration is an abstract need with a manual alternative).
- No AI generation of article content — the assist is confined to clustering and intent-label suggestion.

## Success signals

A content lead can: create a bilingual topic; ingest keywords for both locales (manual paste works with zero credentials); run clustering with the assist (or deterministic grouping when the assist is unavailable); confirm intent labels; run the parity check and read the gap list; resolve one gap into a brief section; export the brief for handoff — all in the first session, on the Mock Adapter, with zero provider-specific knowledge anywhere in the UI. Deterministic-grouping mode alone must produce a complete, parity-checked brief (the degradation promise, tested against the Mock Adapter's assist-off configuration).
