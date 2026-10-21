# 09 — Accessibility: procurement-approval-chain

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model, 05) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: "مستشارو التدقيق والحوكمة" class, plus seeded joined names like "شركة الأفق للتوريدات") for truncation and reflow. Focus ring contract: honey-deep ≥2px, 5.66:1 change-contrast on canvas, 2.4.13 area satisfied (05); the honey primary itself never carries focus.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05 — bilingual normalized search over requests, envelopes, positions, vendors, jobs); ? opens shortcut help; skip-link to main content; Tab follows visual reading order per direction; scroll-margin tokens so sticky headers never cover focus (2.4.11). Every shortcut is a modified chord — no raw letter keys (Arabic-layout conflict class, a11y-baseline §3) — and every shortcut has a visible button equivalent.
- **CP-1 (S2 composer)**: fields first (bilingual title pair in per-field direction containers), then lines editor, then quote panel, then the routing-preview rail (a landmark region, keyboard-reachable, 06), then Submit. Lines editor is a P18 grid — ↑/↓ move rows, ←/→ move cells with physical mapping stable in both directions (rtl-rules §4); Enter activates inline edit (P06: Esc restores, Tab commits and advances, never traps); ⌘Enter adds a line; amount cells use AmountInput (paste never blocked, 3.3.8; spellcheck=false on codes and references). Quote rows: Enter opens the row's actions (select / edit / remove); selecting a non-lowest row moves focus to the justification field with its requirement announced (the gate pre-empted at the surface, 06); Esc closes dialogs returning focus to the trigger.
- **CP-2 (S3 approval workspace)**: opening an awaiting step lands focus on the DecisionBar anchored to that step (06); Approve / Return for revision / Reject are buttons with visible focus, ≥24×24 targets (44px ≤767px, 2.5.8); Return and Reject move focus to the required note field, which validates inline on submit attempt; the chain rail is a semantic ordered list navigated with ↑/↓ with step states spoken as text; prior chain versions are collapsed headers expandable with Enter (aria-expanded), trap-free; ⌘Enter submits the note-and-decision pair.
- **CP-3 (revision loop)**: the returned request's edit surface is the composer with the prior chain rendered read-only beneath — Tab order: edit surface first, history second (fix before reading); Withdraw and Cancel-after-approval carry P04 level-2 confirms naming the consequence and the released amount ("Cancel approved request — 28,000.00 releases from the envelope"); the confirm dialog is type-free but consequence-named (single irreversible act), focus returns to the trigger on dismiss.
- **CP-4 (S5/S4/S6 policy consoles)**: ThresholdMatrixEditor band rows navigate with ↑/↓; ⌘↑/⌘↓ reorder bands and chain positions (2.5.7 drag alternative); Enter edits band bounds in AmountInput fields; validation messages land inline and are field-linked; the matrix version and last-save actor are plain text on the surface. Budgets console: envelope table is a P18 grid; the commitment bar is decorative geometry — its values always render as text beside it (06). Org & Delegation: delegation windows use native date inputs; the delegate picker is a listbox (↑/↓ + Space); both identities preview before save.
- **CP-5 (S1 register / S8 / S9)**: register is a P18 virtualized grid — ↑/↓ rows, ←/→ columns, Enter opens the focused request; / on filtered-empty offers filter reset; row selection (P07) via Space with the floating action bar scoping every action to "N selected" (bulk export fans out to per-request jobs, no phantom adapter surface); S8 activity is a keyboard-navigable table filterable by actor/action; S9 job rows open detail with link-to-context and the expiry countdown as text.

## Focus-order rationale

Per surface, focus follows the document's reading order: header evidence → lines → quote comparison → budget evidence → chain rail → decision bar (the approver reads everything before acting — the product's governance posture made navigation). In RTL the order mirrors wholesale; the bilingual title pair navigates ar-then-en in AR chrome and en-then-ar in EN chrome (authored order follows the workspace locale, never interleaved mid-field). The register's column focus order mirrors with amount columns at the inline end (rtl-rules §5 grids).

## Announcement schedule (a11y-baseline §4 — live regions pair with visible surfaces)

| Event | Mode | Copy shape / justification |
|---|---|---|
| Line arithmetic change | polite | "Line total 3,450.00 — request total 12,050.00" (06 RequestComposer); totals are ambient, never urgent |
| Routing preview update | polite | total-anchored: "12,050.00 — band 5,001–50,000, two approvers, within envelope" (06); preview is reading, not alarm |
| Autosave cycle (P10) | polite | saving → saved (fades) → conflict (conflict is assertive below) |
| Chain step state change | polite | "Reem approved step 1 — Finance Manager is next" — movement Amal waits for (02) |
| Final approval ("The Chain Closes") | polite | "Approved — PR-1041, SAR 12,050.00 committed to Marketing × Events, FY2026" (05 verbatim) — celebration-with-facts; the seal motion is decorative and never the carrier |
| Commitment / envelope projection change | polite | "Marketing × Events: 74,550.00 of 100,000.00 — within" |
| Export progress / ready / expiry countdown | polite | per-format milestones; expiry warning once, with the renewal action named |
| Validation errors (all gates) | assertive | field- or gate-linked via described association — submission refusals interrupt: they block the user's committed intent (gate + resolving action named, 03 CP-1) |
| Decision failures (PERMISSION / CONFLICT) | assertive | authority acts fail loudly at decision time — the approver's hands are on the bar |
| Autosave conflict (P10) | assertive | both versions surfaced, a choice demanded — never a silent overwrite |
| Decorative seal stamp, bar recolors, row settle, skeleton shimmer | never | motion never carries information (a11y-baseline §4; motion-language §2) |

## Per-surface WCAG 2.2 AA checklist

- **S1 register**: virtualizes past 200 rows with focus preservation and row-count context on region entry (P19); rows ≥24px targets; request codes ("PR-1041") render in bidi isolating containers inside Arabic chrome (rtl-rules §2); status seals carry icon+text labels (06 StatusSeal — the mark is decorative structure); overdue flag is text+icon, never color alone; 400% reflow — the grid collapses to stacked cards at 360px (ux-guidelines row 71).
- **S2 composer**: labels persist above fields (ghost text is never the label, a11y-baseline §5); on-blur-or-submit validation with field-linked messages and an error summary focusing the first error; per-field direction containers with bidi isolation on both title and line pairs; AmountInput refuses negatives inline with named messages; P11 recalls prior values across sessions (draft persistence, 03 CP-1 recovery).
- **S3 approval workspace**: the chain rail is an ordered list (a chain is an ordered record, 06); delegation badges carry both identities as text; the self-approval block renders as a named refusal, never a silent skip; decision notes are textareas with programmatic labels; the document-paper strata carry all state changes as text deltas paired with the settle transition.
- **S4 budgets console**: commitment bars render values as text always (value-label contract, 06); the honey→honey-deep→red ramp duplicates state with icon+label ("ضمن المخصص" / "Within envelope" · "قرب الحد" / "Approaching limit" · "تجاوز" / "Over"); blocking-vs-advisory is a distinct badge, not a shade; bar geometry reserved pre-render (CLS, 10).
- **S5 matrix studio**: band gaps/overlaps named at save with the range spoken; duplicate-scope errors name both rules; keyboard reordering (2.5.7); the version and actor visible as text — audit weight is readable, not decorative.
- **S6 org & delegation**: window validation announced with the field; the delegate-must-be-a-member rule stated in the error itself.
- **S7 directories / S8 activity / S9 jobs**: plain P18 tables; activity rows announce actor-action-target with timestamps spoken with the action (the audit-adjacent obligation adopted from a11y-baseline §7's legal/audit family); job rows carry expiry as text with the renewal action inline.
- **Overlays (palette, dialogs)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05).

## RTL/LTR verification matrix (per surface, both directions — bilingual-en, both full citizens)

Pure-Arabic render (titles, vendor names, Arabic decision notes) · pure-English render · mixed strings (Latin vendor "Al-Ufuq Supplies Co." inside Arabic chrome; Arabic note "موافق عليها ضمن خطة التوسع" inside EN chrome — bidi isolation proves out, never ambient-direction sorting) · numeral rendering under the Western policy in both directions (amounts, thresholds, percentages, codes, dates) · embedded Latin tokens in RTL (PR-1041, SAR) in isolating containers · tables and grids mirrored with amount columns at the inline end and alignment rules held (05's fixed 2-decimal inline-end presentation) · forms: label/input alignment and error placement on the correct inline edge per direction · truncation at 320px containers with worst-case joined words ("مستشارو التدقيق والحوكمة", "شركة الاستمرار للصيانة") breaking at word boundaries only · 400% zoom reflow in one dimension on every surface · bidi isolation on all user-generated content (titles, descriptions, notes, terms). Seeded fixtures (07c: PR-1033's Arabic GM note, the tie fixture, PR-1041's bilingual title pair) are the regression set.

## Reduced-motion contract (motion-language §5)

"The Chain Closes" collapses to the seal and state chip appearing instantly with the polite announcement carrying identical content (05 — celebration-with-facts, never motion as the only carrier); route crossfades become hard cuts; the 3-element stagger renders simultaneously; register rows settle in place without transition; the envelope bar's state changes render as instant recolor with the text delta unchanged. A reduced-motion pass is part of the release matrix (a11y-baseline §8.6) on both directions.

## Declared deviations (recorded)

- **P20 deviation (03 non-happy path)**: offline drafts queue locally with per-item state, but **decisions never queue blind** — authority acts require a live connection and reconcile to authoritative state; the deviation is declared here and in 03.
- **P03 deviation (03 CP-2 recovery)**: no optimistic undo on decisions — authority acts are recorded policy; correction is a new recorded decision. The note text alone carries an edit window before the decision commits.
