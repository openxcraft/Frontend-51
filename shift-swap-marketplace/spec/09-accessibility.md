# 09 — Accessibility: shift-swap-marketplace

SME-F pass · Baseline: _shared/a11y-baseline.md (WCAG 2.2 AA, both directions, 200% & 400% zoom, 360px and 1280px viewports). This file adds the two-surface keyboard maps, announcement schedule (swap-event live regions — worker-facing pings), RTL/LTR verification matrix, and per-surface checklists. The worker surface is the a11y-critical surface: frontline workers on mid-range phones, mid-shift, in both locales.

## Keyboard map (critical paths; per surface)

### Worker surface (touch + external keyboard supported; Arabic-layout-safe)

**CP-1 (post a swap)**: tab order = shift card → offer-for-swap button → wizard steps (P09: each step independently valid); note field is a standard textarea (Esc cancels sheet with restore-on-reopen — P11); post = Enter on the review step; undo window is focus-preserving (focus stays on the posted card; "تراجع" / "Undo" is the first tab stop for 7s).
**CP-2 (browse & request)**: board = roving-tabindex listbox (arrows move; inline-end arrow = next in both directions — rtl-rules §4 mapping); card activate = Enter → detail sheet; eligibility panel is in tab order before the request button (decision-relevant info precedes action); policy sheet link after the ladder; request = Enter on request button (no confirm dialog); rank delta announcements are polite-on-focus only.
**CP-3 (ladder & accept)**: ladder = ordered list, ↑/↓ navigate rows; Enter expands rationale drill (disclosure); A accepts the focused candidate (modified-key alternative ⌘⏎ also bound — Arabic layout safe); S skips to next candidate; the Swap Handshake announcement is assertive-once (below).
**S7 inbox / S5 my swaps**: standard list navigation; M marks seen; status-ladder steps are tab-stops with state text.

### Console surface (keyboard-first — P18)

**CP-4 (approval queue)**: j/k or ↑/↓ row navigation (both physical mappings stable in RTL per rtl-rules §4); Enter opens match drawer; A approve / D deny (modified equivalents ⌘A/⌘D for layout safety); deny opens the rationale template picker (T templates cycle, N note field, ⌘⏎ submits); Esc closes drawer and returns focus to the row; bulk-select = shift+arrows with the P07 action bar; flagged rows are excluded from bulk via disabled checkbox + visible reason (never silently).
**CP-5 (rules center)**: registry tables = P18 grid navigation; paste-import sheet = standard form with row-error focus jumps (first error focused on submit failure — a11y-baseline §5); policy simulation = two ladders tab-navigable with alignment links (P23-style crossing) — before/after rows announce deltas on focus.
**⌘K palette (P05)** on console + hybrid worker: bilingual normalized search (rtl-rules §4: alef variants, taa marbuta/heh, yaa forms, tashkeel stripped), grouped results, recent items.

Global: no raw-letter shortcuts (Arabic layout safety); every drag interaction (none exist at v1 — the ladder is order-only, never user-dragged) would require a 2.5.7 alternative; focus-visible at 2.4.13 strength (≥2px ring, ≥3:1 change-contrast, focus.ring tokens per 05 contrast ladder); sticky bottom tabs never obscure focused elements (2.4.11 — scroll-margin is a token obligation on worker cards).

## Screen-reader announcement schedule (swap-event live regions — worker pings)

| Event | Mode | Copy shape (bilingual in 11) |
|---|---|---|
| Offer posted (own) | polite | "نُشر عرض التبديل — ينتهي قبل بداية المناوبة بـ12 ساعة" / posting + expiry |
| Request created (own) | polite | request + current rank |
| Rank delta (own request) | polite on focus, never on change | "المرتبة 2 من 5 — تراجعت درجة واحدة" / rank + delta |
| Match accepted (instant tier) | assertive once | candidate name + pending-supervisor state |
| **Match confirmed (instant tier — the Handshake moment)** | assertive once, then polite summary | "تم تأكيد التبديل — التغطية مؤكدة" + shift facts; the weld-mark badge carries the state for later review |
| Supervisor decision (instant tier) | assertive once | decision + rationale verbatim (denials read their reason — 02 objection matrix) |
| Offer expired / board activity / qualification expiring / policy changed | never instant — inbox + digest surfaces only | inbox rows are standard readable content |
| Validation errors (rule-named) | assertive | the failing rule's plain-language string, field-linked |
| Live board mutations (offer posted/matched on the visible board) | never announced on arrival | visible list mutation only; region count context on region entry (P19) |

Live regions always pair with visible surfaces (a11y-baseline §4): every announcement above has a visible card/badge/row — an announcement without a visible surface is a defect. Decorative Handshake motion is never the information carrier (the state chip + text are).

## Per-surface checklist (S1–S17; WCAG 2.2 AA + product floors)

All surfaces: four empties (P01) implemented with correct copy; skeletons mirror final geometry RTL-flipped (P02); focus-visible per 2.4.13; targets ≥24px (2.5.8) with the worker surface at **≥44px** + 8px spacing (05 integration record; ux-guidelines rows 22/23); contrast per the 05 ladder contracts; skip-to-main on console.

- **S1/S2/S5 (worker core)**: 400% zoom reflow single column at 360px with worst-case Arabic strings ("مستشارو التدقيق والحوكمة"-class long words + "التبديل العادل للمناوبات" product terms); bottom tabs remain operable at 400%; rank chips are text+icon (never color-only); OfferCard gated state is announced with reason (`aria-disabled` + described-by).
- **S3 offer detail**: the Fairness Reveal cascade has a simultaneous reduced-motion render; rationale drill is a disclosure with correct aria-expanded; eligibility panel announces its state (green/amber/red) by heading text — color is decoration.
- **S6 ranked ladder**: rank is list position + announced ordinal; score de-emphasis does not drop below contrast contracts; drill rows meet 4.5:1.
- **S4 wizard**: labels persist (hint text never substitutes for a label); numeric time fields declare inputmode; each step independently valid (P09) so errors never span hidden fields; error summary focuses first error.
- **S11/S12 console queue**: row height + aging badge pass target-size spot audit; drawer focus trap with return (a11y-baseline §3); deny rationale is required both in contract (07b rule 3) and in the form (aria-required + validation announcement).
- **S14/S15 rules/policy**: rule previews are text (plain-language strings from the contract — never images); simulation diff ladders are keyboard-navigable with delta announcements; weight inputs are sliders WITH numeric text fields (2.5.7-safe: no drag-only value entry).
- **S13 schedule view**: table column order mirrors RTL; time columns keep LTR-embedded numerals with bidi isolation; source badge (import/manual) is text.
- **S17 ledger/jobs**: activity log is a navigable table (not graphics); export expiry is announced with the artifact name; job progress has text equivalents ("استيراد 4 من 6 صفوف" / "importing row 4 of 6").

## RTL/LTR verification matrix (per surface, both directions)

For each of S1–S17, recorded pass/fail on: pure-Arabic render; pure-English render; mixed strings (Latin worker names inside Arabic rationale strings — bidi isolation on every interpolated name/site per rtl-rules §2); numeral rendering under the Western-numeral policy inside Arabic prose (no mid-sentence mixing — copy-voice §1.7); embedded Latin tokens in RTL (qualification codes like `FOOD-SAFETY-L2` inside Arabic rationale — isolating containers); table/grid mirroring (queue rows, registry tables, schedule grid); ladder/step-strip mirroring (progress toward inline-end); RestRibbon time axis direction (RTL runs inline-end→inline-start with labels preserved); icon flipping per the 06 metaphor ledger; truncation at 320px container with worst-case Arabic; 400% zoom reflow; focus order matching visual order in both directions. The mock's seeded mixed-locale fixtures (07c §1: bilingual names, Latin codes in rationale strings) guarantee a test fixture for every cell.

## Shortcut table (complete, Arabic-layout-safe — modified keys or navigation keys only)

| Context | Shortcut | Action |
|---|---|---|
| Global (console + hybrid worker) | ⌘K / Ctrl+K | command palette |
| Worker board | ↑/↓ or inline-end/inline-start arrows | navigate offer cards (roving tabindex) |
| Worker detail sheet | Esc | close sheet (focus returns to card) |
| Worker ladder | A / ⌘⏎ | accept focused candidate |
| Worker ladder | S | skip to next candidate |
| Worker wizard | Enter (review step) | post offer |
| Console queue | j / k (or ↑/↓) | row navigation |
| Console queue | Enter | open match drawer |
| Console queue | A / ⌘A | approve focused match |
| Console queue | D / ⌘D | deny (opens rationale picker) |
| Rationale picker | T | cycle template · N note field · ⌘⏎ submit |
| Any list | shift+arrows | range select (console bulk) |
| Inbox | M | mark seen |
| Any sheet | Esc | close + focus return (trap-free guarantee) |

## Overlay applicability & privacy posture

No fintech/healthcare/legal overlay applies. Frontline privacy posture is structural (08 consent semantics): the worker-facing data surface is bounded to what the swap contract needs (name, team, seniority band, qualifications, swap history — 07a Worker); no contact details, no documents, no location. Supervisor consoles show the same bounded set plus decision history — no sensitive-category fields exist in the entity model at v1. Denial rationales are worker-visible by design (accountability over privacy of judgment — a declared product stance, 02 Noora objection matrix), and rationale templates are review-language-constrained (07b template union).
