# 00 — Brief: op-ed-desk

Family: content_tools · Tier: 3 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A submission-and-review workflow application for newspaper opinion desks: the slush pipeline, turned from a shared email inbox into a structured queue. Contributors submit completed op-ed drafts through an accountless intake form (bilingual ar/en, word band, exclusivity attestation, disclosures); the desk triages arrivals, advances promising pieces into anonymized review rounds, records a decision, and returns a feedback letter. Contributors check status with nothing but a reference code. It is a newsroom tool, not a reading product — nothing here publishes anything.

The review model is two-eyed by design. The triage editor sees full identity (conflict-of-interest matching, contributor history); staff reviewers see only an anonymized view — byline, affiliations, self-identifying phrases scrubbed by deterministic rules — so recommendations form around the argument, not the name. A reviewer who spots a residual leak flags it; the view regenerates and the round pauses until clean. This imports the evidence base of anonymized review from scholarly publishing into opinion journalism, where name-recognition bias is a stated concern and no current tool addresses it (01).

The second pillar is Arabic editorial style linting: every submission passes a deterministic rule set — desk word band, paragraph/sentence length, numeral-system consistency (Arabic-Indic vs Western in Arabic prose), Arabic punctuation (، ؟ ؛), tashkeel inconsistency, dialect/register flags against MSA, a desk cliché/jargon list, and identity-leak detection feeding the anonymization pass. A conditional AI layer adds coherence, redundancy, and unsourced-claim hints when available and degrades cleanly to the deterministic set when not (ai-native-patterns §8) — the lint gate never blocks the pipeline on the AI capability.

## Buyer

Opinion desks at Arabic-first and bilingual MENA newspapers (3–15 seats: opinion editor buys, staff reviewers use daily), plus the public-contributor relationship those desks serve. Secondary: English regional dailies with Arabic sister desks. Personas in 02.

## Surface

Web app, desktop-first (≥1280px): triage queue (home), submission detail with lint sidebar, anonymized review workspace, decision composer, contributor files, activity/jobs console, desk-policy settings. A separate contributor surface — intake form + reference-code status check — is fully functional at 360px. Screens in 04.

## Unique feature + why defensible

Slush pipeline with anonymized review + Arabic editorial style linting in one queue. Defensible: incumbents are grant/litmag (Submittable) or scholarly (Scholastica, Editorial Manager class) — none opinion-desk-shaped or bilingual-Arabic; Arabic proofing exists only as standalone checkers (01), never as an in-queue desk gate; anonymized review answers a documented implementation problem — anonymization feasibility and leak management — with a designed mechanism (leak-flag → regenerate → pause), not a policy memo; and both mechanisms are typed operations on one adapter contract (07b) — the workflow, not any provider, is the product.

## Exclusions (LOOP-10, binding)

- No print layout or pagination tooling (production systems own that).
- No reader-facing site, article pages, comments, or publishing of any kind (letters are outbound messages, not pages).
- No ad ops, monetization, paywalls.
- No editor-side rewriting of submission text (letters quote findings; line editing happens in the desk's own tools).
- No public contributor accounts — intake is form + reference code only.

## Success signals (definition of done vs Mock Adapter)

On the Mock Adapter, zero provider knowledge in UI, a desk can: submit via intake form and get a reference code; triage (advance/decline/hold); open an anonymized round with two reviewers, exercising the COI assignment guard; run a style-lint pass and resolve findings; record a decision including the split-round override with mandatory rationale; deliver the letter via the notification path or its manual alternative; let the contributor retrieve status and feedback by reference code. Leak-flag → regenerate → resume and lint degradation (deterministic-only) are both exercised end-to-end.
