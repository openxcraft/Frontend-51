# 09 — Accessibility: expense-claim-flow

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions, 1280px and 360px viewports, 200%/400% zoom. The product's structural a11y problems are (1) money tables read vertically, (2) an OCR proposal surface that must never let machine output masquerade as confirmed data, and (3) bilingual receipts rendered against either chrome direction — all three contracted below.

## Keyboard map (critical paths; no raw-letter shortcuts — Arabic-layout conflict class, a11y-baseline §3)

| Surface / path | Keys | Behavior |
|---|---|---|
| Global | ⌘K / Ctrl+K | Command palette: bilingual normalized search (rtl-rules §4) over claims, rate tables, packs, members; jump-to-reference `CLM-`; recent items |
| S1 claims home | ↑/↓ · Enter · / · Space | Queue row traversal (P18, virtualized — focus moves scroll into view, never the reverse, P19); Enter opens the claim in the session role's mode (composer for own drafts, approval workspace for pending steps, payout view for finance); `/` focuses search; Space toggles bulk selection (P07) |
| S2 composer — item rail | ↑/↓ · Enter · Alt+N | Item rows focusable with kind + amount announced; Enter opens the item's inline edit (P06); Alt+N opens the kind-chooser (receipt / per-diem / mileage) — modified key, no raw letters |
| S2 composer — amount/distance fields | digits · Tab · Escape | `inputmode="decimal"` on amounts/rates, `inputmode="numeric"` on distances/days (skill row 64); Tab commits and advances; Escape cancels and restores (P06); live recompute ≤50ms announced as a totals update, never per keystroke |
| S3 receipt panel | Tab · Enter · R | Tab walks image preview → draft fields in display order (vendor → date → amount → tax → number); each draft field is a confirm-control (Enter confirms, typing edits); region-link focus highlights the receipt area; R re-runs extraction; the manual form shares the exact field order — muscle memory transfers between capability states |
| S4 approval workspace | ↑/↓ · Tab · ⌘Enter · ⌘⇧Q | Findings rail rows focusable, blocking first; Tab order: claim header → item table → findings rail → decision bar → chain steps (reading order; the rail sits between items and decisions so blockers are met before the controls); ⌘Enter approves (only from the decision bar — never a global hotkey on a money decision); ⌘⇧Q opens the query composer; reject requires the comment field focused by the dialog |
| S4 chain steps | ←/→ · Enter | Traverse levels in order (direction mirrors in RTL — inline-end arrow = next level in both directions, rtl-rules §4); Enter opens the decision detail incl. delegation provenance |
| S5 policy studio | Tab · ⌘S · ↑/↓ (matrix grid) | Matrix grid follows P18 (roving tabindex); threshold fields `inputmode="decimal"`; ⌘S saves with the version-consequence note; validation issues are focusable list entries linking to fields; drag-reorder has the ⌘+↑/↓ equivalent (2.5.7) |
| S7 payout recorder | Tab · ⌘⏎ | Fields method → reference → date → amount; ⌘⏎ records (double-submit guard active); corrections open the supersede dialog with the reason field focused |

Every shortcut has a visible button/menu equivalent; focus-visible is the primary ring (Masruf Vermilion #CA545A, 3.89:1 change-contrast ≥3:1 at 2.4.13 strength — ≥2px, ≥ area of a 2px outline) on every interactive element; in dense amount tables the ring binds vermilion-ink #4F191C (12.91:1) for row-adjacent visibility. Sticky queue and findings headers clear focused rows (2.4.11 — scroll-margin token obligation). Modals/popovers trap-free with focus return to trigger (a11y-baseline §3). Targets ≥24×24 CSS px throughout; the mobile capture mode's three capture affordances ≥44×44 (touch-first surface, skill row 23).

## Focus-order & reading contracts

Reading order per surface follows the visual order (skill row 42): on S4, claim header → item table (rows top-to-bottom, amounts as the last cell per row) → findings rail (blocking before advisory, DOM order matches visual) → decision bar → chain steps. The receipt image preview is a labeled region whose accessible name derives from the applied/typed fields (never an empty alt on a money document); the preview precedes the draft fields so the evidence is met before the proposals. Mixed-script rows (Arabic vendor inside English chrome) use bidi isolation on the cell content (rtl-rules §2) — focus and reading order never reorder numbers between directions (rtl-rules §4).

## Live-region announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Queue region entry | polite | "24 claims, 3 with blocking findings" (row-count context, P19) |
| Item added / edited | polite | "Mileage item added — SAR 156.20 computed from 142 km at SAR 1.10" (the computation is the announcement) |
| Totals update (composer) | polite | "Claim total SAR 2,680.25 — 2 receipts, 1 per-diem, 1 mileage" (on commit, never per keystroke) |
| Extraction start / completion | polite | "Reading the receipt…" / "Draft ready — 5 fields proposed, 2 need your confirmation" (ai-native-patterns §2 — start and completion only, never per field) |
| Draft field confirmed | polite | "Amount confirmed — SAR 460.00" |
| Finding arrives / dissolves | polite | "Blocking finding: receipt required above SAR 75.00 — item 4 has none" / "Resolved by edit — the rule re-ran and passed" |
| Gate refusal (approve attempt) | **assertive** | "Approval refused — 2 blocking findings stand. First: item 4, receipt required above SAR 75.00" |
| Chain advanced | polite | "Level 1 approved by Salem — now with Faisal, level 2 of 2" |
| Payout recorded | polite | "Paid SAR 772.00 — bank transfer, reference TRF-8841" (carries the full summary when the stamp animation is reduced-motion-disabled) |
| Validation error (composer/studio) | **assertive** | field-linked message; error summary on submit focuses the first error (a11y-baseline §5) |
| Extraction partial failure | **assertive** | "The draft stopped at the tax field — 2 fields kept, marked partial. Retry, or type the rest yourself" |

Live regions pair with visible equivalents — every announcement above has a visible surface (totals rail, findings row, chain chip, toast, gate banner) per a11y-baseline §4.

## Per-surface WCAG 2.2 AA checklist

- **S2 composer**: labels persist above fields — never inside them as ghost text (a11y-baseline §5); amount fields currency-formatted with tabular figures (vertical scanning — 05 §Typography); the reserved totals rail means amount updates cause zero layout shift (2.2 reflow stability); item removal undo (P03) is keyboard-reachable from the row.
- **S3 receipt panel**: the draft region is reserved at full size before extraction starts (CLS ≤0.02); confidence bands are text+glyph ("medium confidence"), never color alone; region anchors are keyboard-focusable and highlight visibly (≥3:1 change contrast); the manual form is programmatically identical to the draft form (same labels, same order) — switching capability states never reorders muscle memory; the receipt image zoom is keyboard-operable with focus preserved.
- **S4 approval workspace**: findings are icon+text+color (05 pipeline palette contract — severity carries weight+glyph+word); blocker links traverse in listed order and jump with return-trip; the decision bar disables during submit (double-submit guard, skill row 33) with a polite announcement; reject's required comment is enforced at the field with the assertive validation message.
- **S1/S7 queues**: virtualization preserves focus (P19); chain-position chips carry the approver name as text; paid/rejected/queried states are icon+text; four empties distinct per P01 (11).
- **S5 policy studio**: matrix grid P18 keyboard-complete; validation messages field-linked; effective-range overlaps render as two-row comparisons (never color-only diffs); version-consequence notes are announced on save.
- **S9 settings**: consent state displayed in capability language (kind, not vendor — credential-contract §2); no cognitive-function tests anywhere (3.3.8 — paste never blocked); receipt evidence never in URLs (07a).

## RTL/LTR verification matrix (per surface, both workspace directions)

For each of S1–S9, both directions: pure-Arabic render (Arabic vendor names, member names in Arabic script) · pure-English render · mixed strings (Arabic vendor + Latin claim reference in one queue row; the seeded `rcp-103` Arabic receipt inside English chrome) · numeral rendering under the Western policy inside Arabic chrome (amounts, rates, days, references — never mixed systems mid-sentence) · embedded Latin/numeric tokens in RTL (`CLM-0141`, `TRF-8841` bidi-isolated) · tables/grids mirrored (queue column order, rate-table grid, findings rail placement) with alignment rules held · forms (label/error placement on the correct inline edge) · truncation at 320px container with worst-case strings (Arabic vendor "مؤسسة النور للتجهيزات المكتبية — فرع دبي", tier name "الرياض — سفر محلي", rtl-rules §5's "مستشارو التدقيق والحوكمة") · 400% zoom reflow (composer stacks totals below the rail; approval workspace stacks item table → findings → decisions; receipt panel stacks image above fields) · bidi isolation on user-generated content (vendor names, rejection reasons) · receipt image preview direction follows the receipt's script, never the chrome (05 pane-content contract).

## Reduced-motion contract (motion-language §5)

Crossfades → hard cuts; finding chips arrive/dissolve → instant with the polite announcements above; queue row settle → instant; the draft-field populate settle → instant render with the completion announcement; "The Reimbursement Stamp" → the seal renders instantly and the announcement carries the full summary (amount + method + reference). All state changes remain perceivable by construction — the announcement schedule is the reduced-motion equivalent of every animated transition, and no information ever travels by motion alone (a11y-baseline §4).
