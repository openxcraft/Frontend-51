# 09 — Accessibility: op-ed-desk

SME-F pass · WCAG 2.2 AA floor, both directions, both surfaces.

## Keyboard map (critical paths)

- **CP-1/CP-5 (S1 queue)**: ↑/↓ navigate rows (physical mapping stable both directions — inline-end arrow = next); Enter opens detail; Space toggles bulk selection; modified keys only (⌘/Ctrl+D decline, ⌘/Ctrl+A advance, ⌘/Ctrl+H hold) — raw letters avoided for Arabic layouts (a11y-baseline §3). ⌘K palette (P05) with normalized Arabic search (alef/taa-marbuta/yaa variants, tashkeel stripped).
- **CP-2 (lint sidebar)**: findings are a focusable list in severity order; Enter jumps the anchor (focus follows, scroll-margin honored, 2.4.11); ⌘/Ctrl+Enter acknowledges the focused finding; resolution changes announced politely.
- **CP-1.5 (S3 blind workspace)**: Tab order = text → findings → recommendation composer; integrity confirmation is a required checkbox with linked explanation; leak-flag span selection has a keyboard equivalent (⌘/Ctrl+B marks start/end — 2.5.7).
- **CP-1.6/CP-3.3 (S5 composer)**: override rationale programmatically required; error summary focuses first error; letter preview focusable as document region; send enters busy state (double-submit prevention).
- Escape closes overlays with focus return to trigger; traps only inside modals, which trap-and-return.

## Focus order rationale

Queue → detail follows the workday (triage first); inside detail, text before findings (the argument outranks the flags — the product's thesis); identity/history panels last (editor privileges, not the primary task).

## Announcement schedule

| Event | Mode | Visible equivalent |
|---|---|---|
| Lint job queued/running/done | polite | JobRow state + sidebar summary |
| Finding resolved | polite | resolution chip |
| Leak flagged / view regenerated | **assertive** | round pause banner + version badge |
| Review submitted / round complete | polite | round state chip / summary |
| Override rationale missing (submit blocked) | **assertive** | inline field error |
| Decision recorded / sent / send failed | polite | sendState chip |
| COI guard warning/block | **assertive** | warning card naming category |
| Status result (S9) | polite | status region |

Decorative layout shifts, skeleton transitions, virtualization scrolling are never announced (P19: focus moves scroll, not the reverse).

## Per-surface WCAG 2.2 checklist

2.4.11/2.4.13: sticky queue header never covers focused rows; 2px ink focus ring at ≥3:1 change-contrast. 2.5.7: leak-flag span selection ships keyboard equivalent. 2.5.8: dense rows keep ≥24×24 targets (spacing exception in 06). 3.3.7: revision intake recalls chain fields via reference code (marked recalled); policy form recalls values. 3.3.8: no cognitive tests; contributor surface paste never blocked (reference code IS access). Forms: labels persist (placeholder never label); on-blur-or-submit validation, field-linked; autocomplete tokens on contributor name/email. Letters and submission text render at own direction with bidi isolation on mixed runs (rtl-rules §2).

## RTL/LTR verification matrix (per surface, both directions)

S1: column order mirrored; numeral columns Western; SLA chips text+icon. S2: text region at document direction; identity panel bidi-safe with isolated Latin names. S3: scrubbed text at document direction; leak spans anchor across mixed runs. S5: letter preview at letter locale; AR letters offer AR-Indic toggle (05). S9: labels/inputs per surface locale; reference-code input LTR-isolated (codes are Latin). Truncation at 320px with worst-case Arabic ("مستشارو التدقيق والحوكمة"); 400% reflow both directions on 1280px and 360px. Seeded mixed/bidi fixtures (07c) are the test corpus.
