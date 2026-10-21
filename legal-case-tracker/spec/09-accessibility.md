# 09 — Accessibility: legal-case-tracker

SME-F pass · WCAG 2.2 AA floor, both directions (ar/en chrome with bilingual fields rendered per-side), 200% and 400% zoom, 1280px and 360px viewports (a11y-baseline §1). Legal/audit overlay obligations (a11y-baseline §7) are first-class here: timestamps announced with actions, the activity log keyboard-navigable and exportable, and closure — this product's attestation-shaped act — preserves focus across the whole gate.

## Keyboard map (per CP; modified chords only — no raw-letter shortcuts, Arabic-layout conflict class per a11y-baseline §3)

| CP / surface | Keys |
|--------------|------|
| Global | ⌘K/Ctrl+K command palette (P05, bilingual normalized search); ⌘/ Ctrl+/ shortcut sheet; Skip link "تخطَّ إلى المحتوى الرئيسي / Skip to main content" first in tab order (palette-first navigation, skill row 45) |
| CP-1 intake wizard | Tab flows client-search → results listbox (↑/↓ + Enter to pick) → matter fields in authored order; BilingualFieldPair sides are one tab group with ⌥←/⌥→ (Alt+arrows) to cross from the Arabic side to the English side (direction follows caret — rtl-rules §4); ⌘Enter submits the step; Escape cancels the wizard to the docket with focus returned to the intake trigger |
| CP-2.1 docket board | ↑/↓ traverse zone groups then rows (overdue first — traversal order equals visual consequence order); Enter opens the hearing (S3); ⌘↓/⌘↑ jump to the next/previous zone group; Z toggles the zone filter menu as a listbox; region entry announces "لوحة الجلسات: 14 جلسة، 2 متأخرة / Hearing board: 14 hearings, 2 overdue" (row-count context, P19) |
| CP-2.2–2.5 event view + recorder | Tab order: event header → countdown → reschedule history → generated-deadline lineage → linked documents → actions; R opens the reschedule ledger (reason field focused first); O opens the OutcomeRecorder — kind listbox → Arabic summary → ⌥→ to English summary → next-hearing date → ⌘Enter records; Escape closes and returns focus to the trigger; the recorder's double-submit guard keeps focus on the submit button with `aria-disabled` until resolved |
| CP-2.6 chronicle | ↑/↓ move through event cards (P18); Enter expands a card to its detail; ⌘F opens the timeline filter panel (chips focusable, Space toggles, Backspace removes the focused chip); the zone=overdue honesty filter is one chord: ⌘⇧O |
| CP-3 documents & custody | Table grid navigation (P18: arrows move cell-to-cell, F2 activates the row's actions); on the CustodyStrip, ←/→ traverse seq nodes **in physical order in both directions** (inline-end arrow = higher seq in RTL and LTR alike — rtl-rules §4); V triggers verifyChain from the strip; C opens the custody-entry dialog with the action listbox first |
| CP-4 rules console | ↑/↓ rule rows; Enter opens the editor; ⌘S saves from anywhere in the form (the editor's autosave indicator is announced politely); ⌫ on a row opens the P04 level-2 delete with focus on the cancel action first (destructive defaults are never focus-defaults) |
| CP-5 closure & export | Tab order is the gate's reading order: blocker rows (each a link — Enter jumps to the blocker's event/document) → resolution ledger → ClosureRecord → export composer; ⌘Enter on the composer runs the export (quota shown and focusable above it — read before run, P14); G re-evaluates the gate live; J opens the jobs console; the activity log (S10) is a virtualized table with the same P18 grid navigation and an export action |

**Focus-order contracts**: focus follows consequence, not geometry — the board's traversal equals the zone sort; the recorder's focus path mirrors the record's own field order (kind → summary → next hearing) so the announced sequence matches the persisted fact; focus returns to the invoking trigger on every dialog close (modal/popover trap-free guarantee, a11y-baseline §3); the sticky date rail and zone header compensate padding so focused elements are never occluded (2.4.11); focus indicators are the Qada Indigo ring, ≥2px, 8.22:1 on canvas (2.4.13, 05 §Color).

**Closure is an attestation-shaped act** (a11y-baseline §7 legal/audit overlay): `closeMatter` renders the full blocker manifest in DOM order *before* the confirm control — focus traverses every blocker row before reaching the action; the ClosureRecord result announces actor, timestamp, and resolution-ledger counts with the action ("أقفل عبد الله القضية 2041/45 في 22 أكتوبر 2026، 09:41 — 6 نتائج جلسات، 9 مواعيد منجزة، 5 مستندات، أصلان مسترجعان" / "Abdullah closed matter 2041/45 on 22 Oct 2026, 09:41 — 6 hearing outcomes, 9 deadlines completed, 5 documents, 2 originals returned"); the structured-alternative obligation is met because the gate is a structured list, never a wall of prose.

## Live-region announcement schedule

| Event | Politeness | Justification |
|-------|-----------|----------------|
| Outcome recorded (gavel settles) | polite | success confirmation; the recorder already owns the user's context — the announcement carries the full fact (kind, next hearing, day-count, actor) so reduced-motion users receive identical content (05 signature contract) |
| Reschedule committed | polite | state change with dates; the regeneration preview names moved deadlines |
| Deadline completed | polite | quiet success; completion is routine by design |
| Custody entry appended | polite | seq + action + actor; the strip updates with the announcement |
| Chain verified intact | polite | shield state — information, not urgency |
| Chain broken (firstBrokenSeq) | **assertive** | an integrity failure the custodian must see now |
| Outcome-due surfaced (board load) | assertive on first encounter per session | a missed court decision is the product's red state — announced once per session, then visual (repeated assertive would train users to dismiss it) |
| Gate refusal (closure attempt) | assertive | a blocked legal act with named blockers |
| Validation errors (all forms) | assertive, field-linked | per a11y-baseline §4; error summary on submit focuses the first error |
| Export progress | polite at part boundaries only | per-part ("تنسيق 2 من 3 / format 2 of 3"), never per-tick |
| Board re-derivation | never | derived reads never announce — the visible board is the truth (no announcement without a visible surface) |
| Decorative motion, ring drains | never | motion is never the only channel (05; announcements above carry the same content) |

Every announcement pairs with its visible surface (a11y-baseline §4); live regions are attached to the recorder, the strip, the gate panel, and the board header — not to a global toast stack that could outrun the UI.

## Per-surface WCAG 2.2 AA checklist

| Surface | Checks (all must pass; worst risks named) |
|---------|--------------------------------------------|
| S1 docket home | zone state never color-alone (icon + day-count + color — 05 contract); row targets ≥24×24 (2.5.8); group headers associate counts; virtualized rows keep names+roles (P19); 400% reflow: board collapses to single-column zone list, no horizontal scroll |
| S2 matter chronicle | date groups are H2 with counts; event cards expose state (upcoming/completed/outcome-due) as text, not tint; sticky rail clears focus (2.4.11); bed/panel contrast pairs per 05 (primary on bed 7.38:1, ink on bed 12.78:1) |
| S3 event detail | outcome history renders as a list with actors and timestamps (tables for screen readers); correction chains expose supersede state as text; lineage badges are links with discernible text |
| S4/S5 documents & custody | strip nodes keyboard-scrollable without drag (2.5.7 — drag-based strip reading is not the only path); seq numerals Western, physical order stable; sealed state text + shield glyph; verify results announced per schedule |
| S6 clients | bilingual names render per-side direction with bidi isolation; search normalization disclosed beside the field |
| S7 rules | sanity errors inline + linked (3.3.1/3.3.3); regeneration preview is a named list, focusable; owner-only surfaces degrade to read-only with a capability note — no mystery locks |
| S8 closure & export | attestation contract (above); quota before action (P14 visible + focusable); determinate progress with text labels; artifacts list expiry as text dates (dual-calendar) |
| S9 jobs | job states as text; per-format retry rows are discrete targets (2.5.8); link-to-context on every row |
| S10 activity log | keyboard-navigable grid; exportable (a11y-baseline §7 obligation); filterable with chips; timestamps dual-calendar |
| S11 settings | capability consent in kind-language; policy defaults labeled with consequences ("التحقق من استرجاع الأصول عند الإقفال / original tracking checked at closure") |
| All forms | labels persist (the in-input hint is never the label); required programmatic; autocomplete tokens on personal-data fields (client contact); error placement on the correct inline edge per direction |

## RTL/LTR verification matrix (per surface, both directions)

| Check | ar-primary (RTL) | en-primary (LTR) |
|-------|------------------|-------------------|
| Pure-Arabic render | Scheherazade New ≥17px body, line-height ≥1.8 on timeline/detail surfaces (05 binding); navigator rows 15px/1.8 | same Arabic rendering inside field containers (content direction wins over chrome) |
| Pure-English render | Libre Caslon Text inside LTR field containers | full chrome |
| Mixed strings (Arabic court name + Latin case number in one row) | case number bidi-isolated, physical order stable (rtl-rules §2/§4); worst-case: "2041/45" inside "المحكمة التجارية بالرياض — القضية 2041/45" renders with the number readable left-to-right | mirrored: Arabic names isolated inside LTR chrome |
| Worst-case Arabic long-word truncation | "مستشارو التدقيق والحوكمة" and "الاستئناف النقض الجزئي" break at word boundaries only; min-content sizes budget for joined words (rtl-rules §4) | same strings in isolated containers |
| Numerals | Western everywhere (ledger row — day-counts, case numbers, seq, dates); never mixed systems mid-sentence (copy-voice §1.7) | same |
| Dual-calendar | Gregorian primary + Hijri cross-reference (Umm al-Qura presentation for KSA contexts, method disclosed — 05/P24) | same |
| Tables/grids | column order mirrored; day-count column alignment by fixed cell width (05 typography) | canonical |
| Charts/strips (custody strip, ring) | strip advances toward inline-end = higher seq; ring arc direction follows reading axis | mirrored |
| Forms | labels and errors on the correct inline edge; BilingualFieldPair sides keep their own directions | mirrored |
| 320px container + 400% zoom | single-column chronicle, board zone list, stacked custody strip (scrollable) — no one-dimensional horizontal scrolling | same |
| Command palette | normalized bilingual search both directions (rtl-rules §4 pipeline disclosed) | same |

## Reduced-motion contract (motion-language §5; 05)

Hard cuts replace every crossfade (route changes ≤280ms become instant-with-settle); the Gavel Settles collapses to: cards appear instantly in final state, the outcome chip renders, and the polite announcement carries identical content ("الجلسة 4 في القضية 2041/45 مؤجلة إلى 12 نوفمبر 2026 — الجلسة التالية بعد 21 يوماً. سجّلت ليلى النتيجة." / "Hearing 4 of case 2041/45 adjourned to 12 Nov 2026 — next hearing in 21 days. Outcome recorded by Layla."); countdown-ring arc changes render instantly with the day-count text delta; staggered reveals render simultaneously; no ambient motion exists in the product to begin with (no pulses, no shimmer fields — 05 anti-patterns honored). A reduced-motion pass is part of the release matrix (a11y-baseline §8.6): every state change remains perceivable — text, glyph, or announcement.
