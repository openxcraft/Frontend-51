# Copy Voice — Tone, Tense, Error Language, Arabic/English Register

Status: SHARED FOUNDATION · SME-J governs; the Critic rejects generic copy at any tier. Per-product voice is derived in each 02-user-research.md (personas) and applied in 05/11 files.

---

## 1. Portfolio Voice Principles

1. **Say the true thing, briefly.** Copy states what happened, what it costs, and what to do next. Adjectives must carry evidence or be cut.
2. **Present tense for state, past for outcome.** "Exporting…" → "Export ready". Never future tense for what is already done ("will be saved" after save completes is a defect).
3. **Active voice, named actors.** "Reem approved the shift swap" — not "The shift swap was approved". The activity log (P17) and toasts share this grammar.
4. **The error formula**: [what failed] + [why, if known] + [next action]. "Couldn't save the document — the connection dropped mid-save. Your edits are queued; retry when you're back online."
5. **Buttons are verbs with objects**: "Approve claim", not "OK". Destructive buttons name the destruction: "Delete 12 clips".
6. **No blame, no cuteness in errors.** "Whoa there!", "Oops!", and emoji in error states are forbidden. Warmth lives in success and empty-state copy, never in failure.
7. **Numbers are rendered per the product's numeral system** (design-language-map §7) and never mixed mid-sentence ("٣ من 12" is a defect in ar-primary prose).

## 2. Banned Generic Phrases (portfolio-wide)

"Something went wrong" · "An error occurred" · "Please try again later" (without stating what to retry or why it failed) · "Are you sure?" (without consequence) · "It's not you, it's us" · "Oops/Whoops/Uh-oh" · "Powered by AI" as an explanation · "Seamlessly" · "Effortlessly" · "Revolutionary" · "Welcome to the future of…" · "Let's get started!" as the only onboarding copy.

## 3. Arabic Register Guide

- **UI copy is MSA (فصحى)**, register بيضاء (plain) for utility products, وسطى (middle) for trust/premium surfaces. Dialect appears ONLY in user-content features (dialect detection, social copy the user themselves writes) and in verbatims — never in system chrome.
- **Terminology discipline**: one concept, one term, everywhere (a product glossary lives in 07a entities + 12 open questions). Mixing مرادفات for the same UI concept (مهمة/عمل for "task") across screens is a defect.
- **Politeness register**: imperative softened with لطفاً/تفضل sparingly; error copy addresses the situation, not the user's skill.
- **Direction discipline in copy**: strings with embedded Latin terms (product names, currencies) are authored with bidi isolation in mind (rtl-rules §2) — copy authors mark interpolation points.
- **Tashkeel in UI copy**: unvocalized by default; vocalize only where ambiguity is probable (homographs in short labels), and consistently.

## 4. English Register Guide

Professional-neutral: contractions allowed in Tier 3 consumer-adjacent products, off in governance/specialized families. No hype adjectives (§2). Sentence-case buttons; title-case only in marketing surfaces. Error copy never uses humor.

## 5. Length Budgets

Buttons ≤3 words · field labels ≤3 words · toasts ≤12 words · error messages ≤2 sentences · empty states ≤3 sentences + 1 action · onboarding step intro ≤2 sentences. Arabic strings may run ~125% of English length — layout must budget for it (10-performance.md) and bilingual matrices (11) must list both strings.

## 6. Microcopy Ownership & Review

Each product's 11-empty-loading-error.md is the copy matrix of record: every state's string in both directions, matching the persona-derived voice in 02. The Critic compares matrix copy against the banned list, the length budgets, and the persona voice — a mismatch is a LOOP-14 rejection. Onboarding copy follows P22 (value checklist, honest milestones).
