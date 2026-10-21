# 09 — Accessibility: zakat-calculation-suite

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions (ar/en — bilingual-ar product, full-citizen verification), 1280px and 360px viewports, 200% and 400% zoom. Keyboard contract per critical path; announcement schedule; per-surface checklist; RTL/LTR matrix with worst-case Arabic strings; reduced-motion contract. Shortcut discipline: modified keys only (Arabic layout safety, a11y-baseline §3).

## Keyboard map (per CP)

| CP | Keys | Behavior |
|---|---|---|
| CP-1 (case → items → calculation) | Tab/Shift+Tab | order: case header → tab row (Items/Calculation/Review/Chain) → item toolbar (filter chips, search, add-item, import) → item table rows (P18 arrow grid) → run-calculation button; focus never enters voided rows' edit affordances (they are read-only history) |
| | ↑/↓ ←/→ | item-grid cell navigation, physical mapping stable in both directions (inline-end arrow = next item, rtl-rules §4) |
| | F2 or Enter | activate inline edit on focused cell (P06); Escape cancels and restores; Tab commits and advances; focus returns to trigger on close |
| | Space | toggle row selection (P07 bulk bar follows: void-with-reason, export items-csv) |
| | ⌘Enter / Ctrl+Enter | run calculation (the case's primary action) |
| | ⌘K / Ctrl+K | command palette (S11) — bilingual normalized search |
| CP-2 (comparison) | Tab | profile picker (checkbox group) → run-comparison → matrix table (row/col headers) → divergence rows expand |
| | ↑/↓ | divergence list navigation; Enter opens the rule pair side-by-side panel (focus trap with return) |
| | Esc | close rule panel, focus returns to the divergence row |
| CP-3 (references & pinning) | Tab | reference list → new-reference form (amount → as-of → source note) → pin action; pin announces both metals |
| | ⌘P / Ctrl+P | pin references to the open case (P-03's fast path) |
| CP-4 (review → lock → export) | Tab | review packet reads in attestation order (a11y-baseline §7): evidence summary → trace → pins → history → decision note field → decision buttons |
| | ⌘⇧L / Ctrl+Shift+L | lock case (P04 Level-2 confirm: names the freeze consequence) |
| | ⌘E / Ctrl+E | export audit bundle (locale picker first, then confirm) |
| CP-5 (register, admin, jobs) | ↑/↓ | case list rows; Enter opens; ←/→ collapse/expand saved-view chips |
| | / | focus the register search field (bilingual normalization active) |

**Focus-order contracts**: logical DOM order mirrors reading order in both directions (no positive tabindex anywhere); sticky headers reserve scroll-margin so focus is never obscured (2.4.11); focus ring = Zakat Jade ≥2px, ≥3:1 change-contrast, 2.4.13-compliant area (05); modals trap focus and return it to the trigger (rule-panel, confirm dialogs, export locale picker); nothing in the trace ledger is focusable per-line except its expand affordances (reading, not navigation, surface).

## Announcement schedule (a11y-baseline §4)

| Event | Politeness | Justification |
|---|---|---|
| Calculation completion + verdict | polite | the summary lands while the user is on the surface; the Verdict Settle's motion duplicates text already present — the announcement carries verdict + figure ("فوق النصاب — الزكاة واجبة ٥٦٬٢٤٠٫٨٠ ريال" / "Above nisab — zakat due SAR 56,240.80") |
| Trace completion summary | polite | "تم اشتقاق النتيجة في ١٦ سطرًا" / "Result derived in 16 lines" — start/end only, never per-line (P13 discipline) |
| Import progress | polite, throttled | row-count milestones only ("تم قبول ٥ صفوف من ٦" / "5 of 6 rows accepted") — never per-row |
| Validation errors (item form, gates) | assertive | the user must act; message references its field via described association |
| CONFLICT on inline edit | assertive | both payloads surfaced; recovery is the point |
| Review/lock/export state changes | polite | state transitions with actor + timestamp (P17 grammar) |
| RATE_LIMIT warn (80%) | polite, once | meter text is the visible twin |
| Job failure | assertive | typed error + next action (11) |
| Decorative gauge geometry, skeleton shimmer, stagger cascades | never | motion carries no information (05 motion; a11y §4) |

Every announcement pairs with a visible surface — no invisible-region narration.

## Per-surface WCAG 2.2 AA checklist

- **S1 cases home**: list semantics + row count on region entry (P19); filter chips carry predicate descriptions (P08); no-access cases render PERMISSION surfaces, never "empty" (P01).
- **S2 item table**: P18 grid grammar; target sizes ≥24×24 (2.5.8) including row checkboxes and void affordances; inline-edit fields labeled; error placement on the inline-start edge per direction; virtualization preserves focus (scroll follows focus, never the reverse).
- **S3 calculation**: the NisabGauge's figures in text (verdict, threshold, net base, distance with sign words); trace is a semantic table (step/rule/narrative/amount headers); rule chips are links with described association to source notes.
- **S5 comparison matrix**: table with scope headers; divergence cells `aria-describedby` their bilingual reason; in-kind cells announce kind names, never bare numbers — the label reads "حِقّة ×٣" / "3 ḥiqqah" (pluralized kind names authored, never digits alone).
- **S6 references**: money inputs carry currency in the label; superseded rows read as history (not disabled junk); pin action announces both metals by name.
- **S7 profile admin**: verify-flag chips are icon+text (never color alone); rule edits re-version with status change announced; owner-only affordances hidden from non-owner sessions, and attempts return typed PERMISSION (never a disabled mystery button).
- **S8 jobs console**: progress as text with units; expiry windows announced with the artifact link; cancel is one key/action, fast (async-contract §2).
- **S4 review packet**: attestation focus order across the full packet (a11y-baseline §7 legal/audit obligation); decision buttons are verbs with objects; timestamps announced with actions; the lock confirm names the consequence and count of frozen elements.
- **Forms everywhere**: labels persistent (ghost text never the label, a11y §5); on-blur validation; error summary focuses first error; required is programmatic.
- **Overlay family note**: this is a legal/audit-adjacent surface — the activity log is keyboard-navigable and exportable; attestation order preserved (§7 of the baseline).

## RTL/LTR verification matrix (per surface, per direction)

Worst-case Arabic strings used across the matrix: **"مستشارو التدقيق والحوكمة"** (long joined words), **"الذمم المدينة التجارية المحصلة ضمن الدورة المالية"** (item description), **"قيمة مرجعية مُصطنعة للتجربة — نمط جدول الدار؛ ليست بيانات سوق"** (source note with embedded punctuation), **"٣ حِقّة و٢ تبيع و٢ شاة"** (in-kind dues line), plus mixed strings: **"SAR 56,240.80 — شركة النور للتجارة"** (Latin currency + Arabic subject).

Checks per surface (pass required both directions): pure-Arabic render · pure-English render · mixed strings bidi-isolated (`dir="auto"` inputs, isolate marks on interpolations) · numerals under the declared system (AR-indic in Arabic prose, Western in tables/amounts — never mixed mid-sentence) · embedded Latin tokens in RTL (currency codes, ids like `calc-z1042-r2` render LTR in isolating containers) · tables/grids mirrored with column order and alignment held · trace ledger reading direction (lines flow inline-start; amounts align inline-end) · forms: label/input alignment + error placement on the correct inline edge · truncation at 320px container breaks at word boundaries (no mid-word clips of joined Arabic) · **400% zoom reflow: no horizontal scrolling in one dimension, long-word cases included** (the item description worst-case reflows to multi-line rows; the comparison matrix degrades to stacked category cards at 360px per 06 C-06) · charts: none in v1 (the gauge is a text-duplicated figure) · pagination advances toward inline-end in RTL.

## Reduced-motion contract (motion-language §5)

- The **Verdict Settle** collapses to simultaneous render: gauge, verdict chip, and distance appear at once with the same polite announcement — identical perceivability (05).
- Trace cascades render all lines simultaneously (stagger removed); content never spins in.
- Route transitions become hard cuts; the stately 280ms content settle becomes an instant crossfade-off.
- Skeletons become static geometry (P02 direction-mirrored stills); no shimmer.
- Errors still arrive without bounce; nothing in the reduced-motion path removes information — every animated state change has a text twin by construction.
