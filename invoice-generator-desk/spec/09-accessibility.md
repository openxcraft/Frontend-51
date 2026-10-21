# 09 — Accessibility: invoice-generator-desk

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings for truncation/reflow (rtl-rules §5 class): "مستشارو التدقيق والحوكمة" · "تصميم وتطوير هوية بصرية متكاملة للمتجر الإلكتروني" · client name "بيت الأعمال للاستشارات" · the seeded synthetic IBAN and postal-code-inside-Arabic fixtures (07c) are the mixed-direction regression set.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search — alef/hamza variants, taa marbuta, yaa forms, tashkeel stripped); ? opens shortcut help; skip-link to main content; Tab order follows visual reading order per direction; focus ring = Hisab Slate-Blue ≥2px at 2.4.13 area/contrast strength (5.92:1 on canvas), 2.4.11 scroll-margin so the sticky totals rail never covers the focused element; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class); every shortcut has a visible button/menu equivalent.
- **CP-1 (S2 composer)**: LineItemGrid is a P18 grid — ↑/↓ move rows, ←/→ move columns (physical mapping stable in both directions, rtl-rules §4); Enter activates inline edit on the focused cell (P06 — Esc restores, Tab commits + advances, focus never trapped in a cell); ⌘N new line item; N opens the numeral toggle (radio group, ←/→ + Space); G jumps focus to the grand-total figure with its breakdown panel open (the money voice is keyboard-first); I opens the issue gate dialog; the bilingual description fields accept both scripts with `dir="auto"` and caret-follows-script navigation (rtl-rules §4).
- **CP-2 (S1→S2 duplicate loop)**: D on a focused list row duplicates (the P04-free reversible action — a draft, undo window applies); the resulting draft lands focus on the first stale-anything warning if present, else the first line item.
- **CP-3 (S3 issued view)**: standard document reading order — document blocks, then delivery panel, then payment marks; P opens the record-payment form (labels persist, autocomplete tokens on amount/date fields); M on a focused mark reveals delete (7s undo, P03); R opens render controls; arrows navigate the marks table with headers re-announced.
- **CP-4 (S6 setup)**: scheme table is a semantic grid (row navigation with scheme name + rate re-announced per row); E edits the focused scheme (dialog, Esc closes returning focus to the row); S creates a series (focus lands on the prefix field).
- **CP-5 (S1/S7/S8)**: standard list navigation; Enter opens invoice/job/activity detail; V on a focused issued invoice opens the void gate (P04 level-2 — reason field required, focus locked to the dialog until resolved).

## Focus order rationale

Per surface, focus follows the document's reading logic: in the composer, editing pane first (top-down: client → scheme → dates → line items → totals), then a single tab-stop crosses to the preview pane (the artifact is read after it is shaped); in RTL chrome the panes mirror (preview sits inline-start) and the tab order mirrors with it — the cross-over stop is always at the pane boundary, never mid-grid. In the issued view, the frozen document is the first reading region (it is the artifact), followed by the action panels — an accountant-visiting screen reader hears the paper before the machinery.

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Line-item mutation (add/edit/remove) | polite | new line total + running subtotal ("line total 4,500.00 SAR — subtotal 20,350.00 SAR") |
| Totals recompute (tax-visible change) | polite | tax label (bilingual per scheme) + amount ("ضريبة القيمة المضافة / VAT — 2,377.50 SAR") |
| **Numeral flip (the signature)** | polite | "Arabic-Indic numerals on — stored values unchanged" / "الأرقام العربية الهندية مفعّلة — القيم المخزنة دون تغيير" |
| Issue gate failure | assertive | field + scheme named, focus moves to the first offending field |
| Invoice issued | polite | number + grand total ("issued INV-2026-0007, total 18,227.50 SAR") |
| Void gate | assertive | consequence named (number consumed, no gap) before confirmation commits |
| Payment mark recorded | polite | state + residual ("partially settled — 9,500.00 SAR remaining") |
| Payment mark deleted (undo window) | polite | "mark removed — Undo (7 seconds)" |
| Delivery state change | polite | channel (capability language) + state |
| Export ready / artifact expired | polite | format + expiry window |
| Autosave cycle (draft) | polite | saving → saved (fades) |
| Conflict (concurrent edit) | assertive | both versions kept, choose — focus to the diff surface |

Decorative layout shifts, the numeral crossfade itself, paper hairline re-rules, and state-chip recolors are NEVER announced; every state change has a visible text equivalent paired with its live region (a11y-baseline §4). Money is always announced with currency and full precision — never rounded by the announcer.

## Per-surface WCAG 2.2 AA checklist

- **S2 LineItemGrid/TotalsRail**: figures render Inter 500 tnum Western in chrome (ledger); description fields `dir="auto"` bidi-isolated with isolate marks on interpolations (rtl-rules §2); zero-quantity validation inline, field-linked via described association; targets ≥24×24 (2.5.8); grid arrow navigation with visible focus at 2.4.11/2.4.13 strength; 400% reflow — the grid collapses to stacked line cards at 360px (ux-guidelines Table Handling adoption, 05 record).
- **S2/S3 DocumentPreview**: the paper is a reading surface — Arabic blocks flow RTL inside LTR chrome with correct block directions per field script; embedded Latin tokens (IBAN, currency codes, series numbers) isolated; document figures render per the render config's numeral system (the one sanctioned Arabic-Indic surface); contrast contracts per 05 (ink 15.25:1 on paper; numeral emphasis 13.60:1); preview geometry reserved (no CLS on render flips).
- **S3 PaymentMarksPanel/DeliveryPanel**: table semantics with headers; marks append-only with delete-undo (P03); states icon+text+color; overpayment plain text; channel named in capability language (credential-contract §2).
- **S5/S6 setup forms**: labels persist above fields (ghost text never the label — a11y-baseline §5); on-blur-or-submit validation with field-linked messages; error summary focuses first error; autocomplete tokens declared for the email/registration fields (3.3.7 redundant-entry: seller profile and client data recalled across invoices).
- **Overlays (issue gate, void gate, dialogs, palette)**: focus trap + return to trigger; the void gate names the consequence and requires a reason — never a content-free confirmation (P04's banned generic-confirm rule).
- **Keyboard-only pass** of every CP in both directions is the release gate (a11y-baseline §8.1).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (client blocks, notes, amount-in-words Arabic line) · pure-English render · mixed strings (the seeded postal code inside the Arabic address; the Latin IBAN inside Arabic payment instructions; an EN-only line description inside the bilingual table — bidi isolation proves out on all three) · numeral rendering under the Western-chrome policy (lists, totals rail, marks, job counters) versus the document render policy (toggle-governed) · embedded Latin tokens in RTL context and Arabic tokens in LTR context (isolating containers) · tables/grids column order mirrored with alignment rules held (figures inline-end-aligned both directions) · document preview block directions data-driven per field script, pane position chrome-driven · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with the worst-case joined-word strings above (word-boundary ellipsis only — Arabic has no hyphenation, rtl-rules §4) · 400% zoom reflow in one dimension (composer collapses to single column, paper first) · bidi isolation on all user-generated strings (descriptions, notes, client names). Seeded fixtures (07c) are the regression set for every mixed-direction row.

## Reduced-motion contract (motion-language §5)

The numeral flip collapses to an instant swap with the same polite announcement (identical perceivability — the announcement IS the non-motion equivalent); route changes hard-cut; the paper crossfade renders as a single opacity step; staggered reveals render simultaneously; no state change anywhere depends on motion to be perceived (announcement + visible text pair per the schedule above). A reduced-motion pass is part of the release matrix (a11y-baseline §8.6).
