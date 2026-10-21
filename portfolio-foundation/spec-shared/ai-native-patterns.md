# AI-Native Interface Patterns

Status: SHARED FOUNDATION · SME-H governs. Every product declares in its 00-brief.md and 07b-adapter-contract.md whether it uses AI. If it does not, the declaration is explicit and no pattern below applies. AI absence is never a defect; silent AI presence is.

---

## 1. Declaration Rule

AI usage is declared as operations on the adapter contract (07b) — e.g., generation, inspection, clustering, transformation. If a product's value flow requires no such operation, the product is non-AI and its specs must not leak AI affordances (no magic buttons, no "smart" copy, no pulsing sparkles). Declared AI operations follow every rule below.

## 2. Streaming Contract

- Output streams into a **reserved region** whose size is estimated before arrival (CLS budget ≤0.02 per stream, per 10-performance.md). Streaming never pushes page chrome.
- The stream surface announces **start and completion**, never per-token updates (a11y-baseline.md §4). A completion summary (word count / duration / actions) is announced politely.
- **Stop and Regenerate** are available from the first token. Stopping preserves the partial output, visibly marked as partial (P13). Regenerate re-runs with identical parameters unless the user changed them — never silently re-roll.
- **Stall handling**: >8s silence declares a stalled state with retry guidance; the user is never left watching a frozen caret.
- Stream failure mid-way retains the partial text, marks it, and offers retry-continuation or discard. Partial text is never silently promoted to complete.

## 3. Citation Contract

Any AI output that asserts facts, prices, names, regulations, or market claims must carry **source anchors**: span-bound citations rendered as chips/footnotes linking to a source panel. Outputs that assert without anchors render with an explicit "unverified" treatment in trust-sensitive surfaces (research, legal, medical adjacents). Generated creative copy (marketing text) is exempt unless it makes factual claims. Citation links open in context (side panel), preserving the user's place in the output.

## 4. Cost Transparency

- Metered operations surface consumption **before** running (estimated units) and after (actual units). Batch operations (multi-document, multi-clip) show totals before commit.
- A running session/day meter is persistent but calm — never a red panic surface under normal operation. Warnings at 80% of window quota (ux-patterns.md P14).
- Costs are expressed in the buyer's operational units (documents, minutes, generations) — not model tokens — because buyers budget in work units. Model-token telemetry is a diagnostic, not a UI surface.

## 5. Quota Fallback Ladder

When quota is exhausted, surfaces degrade in this order, and the ladder is documented per surface in each product's 11-empty-loading-error.md:
1. Full AI capability.
2. Reduced capability (shorter outputs, fewer variants) with an explicit notice.
3. Cached/template-based suggestions, clearly labeled non-generative.
4. Clean unavailability state with reset time and upgrade path.
The product must remain useful at every rung — a quota wall that blocks all work is a design failure.

## 6. Trust Checkpoints

AI output is **draft-by-default**. Promotion to authoritative state (publish, send, save as record, apply to live data) requires a review diff + explicit confirm (ux-patterns.md P15). Destructive AI actions (bulk rewrite, deletion proposals) always show before/after with per-item opt-out. The system never applies AI output to other users' work without their review.

## 7. Arabic-Specific Quality Gates

For products generating or judging Arabic text:
- **Register consistency**: the selected register (فصحى بيضاء / فصحى وسطى, or a declared colloquial tolerance) is enforced and drift is flagged inline, not silently corrected.
- **Tashkeel handling**: generation default is unvocalized; optional tashkeel is a first-class toggle with a rendering warning when line-height cannot host stacked marks (rtl-rules.md §3).
- **Dialect detection**: non-MSA input or requests produce a warning card with an explicit choice — never a silent dialect switch.
- **Normalization transparency**: search/processing normalization (rtl-rules.md §4) is disclosed in inspection reports so editors understand what was matched.

## 8. Degradation Map

Each product's 08-integration-map.md includes an AI degradation map: which surfaces keep full function, which fall back, and which pause when the AI capability is unavailable. Non-AI core workflows (drafting, editing, scheduling, counting) must never require the AI capability to function.

## 9. Privacy Boundaries

Prompts and outputs containing customer content remain within the product's data contract (07a); no AI operation silently exfiltrates content outside the declared adapter operations. Where an external AI capability is an abstract integration need, it is declared in 08-integration-map.md as "abstract need — no provider chosen" with a manual alternative (LOOP-5).
