# 12 — Open Questions: arabic-copy-studio

Tier-1 depth: each question carries status, options, recommended default, and why. None block the batch; owner-input needs are flagged (LOOP-12) in specs/_verification.md.

| # | Question | Status | Options | Recommended default | Why |
|---|----------|--------|---------|--------------------|-----|
| Q-1 | Roster confirmation for this product (slug/scope) | OPEN — owner | confirm / replace | proceed as specified | roster is researched proposal (Step 1 finding) |
| Q-2 | Direction default (LOOP-6) | OPEN — owner | ar / en / bilingual-ar | bilingual-ar | buyer geography (02); per-document locale covers en-primary teams |
| Q-3 | Pricing model | OPEN — owner | per-seat / seat+metered / flat | seat + generation meter (value metric aligns with cost transparency P14) | category norm $20–40/seat (01 [1][2]) + AI usage economics; Nour persona demands cost-per-approved-asset clarity |
| Q-4 | Dialect scope at v1 | OPEN | detect+warn / also generate-in-dialect | detect+warn only | generation quality risk; detection alone defends register (CP-1); dialect generation is a v2 decision with quality gates |
| Q-5 | Tashkeel default | OPEN | off / on | off (opt-in) | vocalized marketing copy is niche; toggle covers it (05/11 F) |
| Q-6 | LOOP-9 record: serif chrome vs small-size legibility | RESOLVED (documented) | full-serif / hybrid | hybrid: read=serif, click=sans (05) | both SME positions preserved in 05; resolution rule is teachable and testable |
| Q-7 | LOOP-3 record: adjacency with translation-review-hub | OPEN — owner review | boundary as specified / merge | boundary as specified (transform-at-authoring vs post-hoc review) | both products' 12s carry the flag; merging violates single-function rule (LOOP-10) |
| Q-8 | LOOP-3 record: adjacency with brand-voice-guardian | OPEN — owner review | boundary as specified | boundary: authoring-time enforcement vs governance-grade auditing | same reasoning; guardian owns org-scale drift reporting |
| Q-9 | LOOP-10 record: rejected scope — translation memory & vendor routing | REJECTED & recorded | — | — | belongs to localization tooling (translation-review-hub family); requested by Layla persona research, rejected to keep single function |
| Q-10 | LOOP-4 record: `inspectText` + citation stream events declared proposed | OPEN — binding-time | keep / revise | keep | extends operation vocabulary honestly; mock demonstrates contract sufficiency |
| Q-11 | Real-time co-authoring at v1 | OPEN | conflict-detection only / presence+locks | conflict-detection only | CP-2 edge case handled; full presence is v2 (adapter shape already supports it — no breaking change) |
| Q-12 | Watermark "AI-assisted draft" default | OPEN | on / off / per-workspace policy | per-workspace policy, default off | enterprise governance buyers (Omar) may require it; individual writers may not |
| Q-13 | Verbatim mining for owner-facing deck | OPEN — owner-facing task | — | to-do | 02 verbatims are honestly-marked paraphrases; real quote collection needs a sourcing pass with consent |
| Q-14 | Arabic-Indic numerals in prose default | OPEN | Western / AR-indic | Western with toggle | mixed-market buyer; canonical storage unaffected either way |
| Q-15 | LOOP-3 record: adjacency with seo-brief-builder (research briefs vs writing studio) | OPEN — owner review | boundary: brief-builder = pre-writing research artifact (keywords → clusters → intent → brief structure, ends at handoff export); studio = writing-time register/dialect control. Studio excludes SEO tooling (LOOP-10); brief-builder excludes writing/generation. Handoff = brief export → studio input; no shared entity at v1 | mirrored from seo-brief-builder/12 Q-4 at batch-3 close; both sides carry the flag |
