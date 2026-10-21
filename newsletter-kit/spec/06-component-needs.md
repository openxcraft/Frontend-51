# 06 — Component Needs: newsletter-kit

## Shared primitives consumed

Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, JobRow, QuotaMeter, ActionBar, CommandPalette (P05).

## Invented components (7)

| Component | Purpose | Obligations |
|---|---|---|
| **BlockComposer** | bilingual block columns with pairKey links + sync chips | columns reflow stacked ≤ tablet (400% safe); drag-reorder has keyboard equivalent (2.5.7); explicit mirror-order action; bidi isolation on input (dir=auto); blocks are list semantics in reading order |
| **SubjectVariantEditor** | per-locale variant set: add/edit/delete, primary marker, live budget, mobile-clip preview | budgets printed as text (EN 43/70, AR 55/80 — disclosed heuristic); assist proposals land in reserved region with draft styling (P13/P15); delete-primary falls to first variant, announced |
| **QAChecklistPanel** | 10-check rows with pass/warn/fail, detail, block link | status never color/icon-only; fails deep-link to block/field; run pinned to revision; "record why sending anyway" note attaches to the job |
| **PreviewPane** | per-locale render at desktop/tablet/320px | width toggle is a segmented control (keyboard); explicit RTL/LTR direction toggle (defaults to the selected locale; manual override for mixed-direction inspection — the RTL preview control, 00); long-word probe available; preview and export render one content model (single source); media glyphs unmirrored |
| **ImportReview** | awaiting-input rows (invalid/duplicate/consent-missing/locale-missing) | bulk + per-row resolution; applying resumes the job; skipped rows listed with reasons; consent field carries a persistent label, never ghost text alone |
| **SubscriberTable** | virtualized rows with locale-preference column + filters | P19 virtualization >200 rows with focus preservation; Arabic-normalized search (rtl-rules §4); bulk select + action bar (P07); removal type-to-confirm (P04 L3) |
| **SendProgress** | send-job per-locale determinate progress + outcome | progress labels are written copy with counts; channel-expiry pause surfaces verify-or-cancel; rows link to context |

## Layer-3 token additions

`composer.block.pair.state.*` (in-sync/edited-since/missing-in-locale) · `variant.budget.state.*` (within/warn/fail) · `qa.check.status.*` (pass/warn/fail + settle) · `send.progress.locale.*` — Layer 2 bindings, no raw values (token-architecture §2.1).

## Reused-with-twist

- **EmptyState**: first-run sample issue with seeded QA fails — fixing two fails IS the onboarding (P22).
- **JobRow**: four job kinds share one row grammar (icon+word kind; per-kind progress shape: rows/checks/formats/locales).
- **QuotaMeter**: assist generations only — the product meters nothing else; warns at 80% (P14).

## Acceptance notes (ui-ux-pro-max pre-delivery checklist, 05 record)

No emoji-as-icons; targets ≥24×24 (2.5.8); hover 150–300ms (calm: opacity/border only); focus-visible at 2.4.13 strength; reduced-motion on QA settle + assist stream; layouts checked at 375/768/1024/1440 + 320px preview container.
