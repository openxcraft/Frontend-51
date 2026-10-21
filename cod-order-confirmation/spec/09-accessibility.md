# 09 — Accessibility: cod-order-confirmation

SME-F pass · Baseline: _shared/a11y-baseline.md (WCAG 2.2 AA, both directions, 200% & 400% zoom, 360px and 1280px viewports). This file adds the console + on-call keyboard maps, the announcement schedule (ladder-event live regions — the queue is a live surface), the RTL/LTR verification matrix, and per-surface checklists. The console queue is the a11y-critical surface: an agent works it at speed, keyboard-only, in Arabic, for hours (02 Hessa). The on-call view is the away-from-desk leg: touch-first, ≥44px targets, same announcement contracts.

## Keyboard map (critical paths; per surface)

### Console surface (keyboard-first — P18)

**CP-1 (queue + intake)**: j/k or ↑/↓ move queue rows (roving tabindex; both physical mappings stable in RTL — rtl-rules §4); Enter expands the order drawer in place; I opens the import sheet (paste flow is a standard form: column mapping → preview → commit; first error focused on submit failure — a11y-baseline §5); F focuses the filter chip row (P08); / focuses queue search (bilingual normalized); filters declare predicates accessibly.
**CP-2 (ladder work)**: in the drawer — Tab order is decision-weighted: buyer card → risk rail (drill = Enter on the rail figure) → ladder trail (rungs tab-navigable, response tags readable) → action row; R reschedules the active attempt (opens the reschedule popover: T absolute time, +/- minutes steppers, Enter commits — engine validation errors announce assertively with the named rule and next eligible time); C opens the call-leg sheet (script is a readable article; outcome recorder is a radio group; N focuses the note field; ⌘⏎ submits; Esc closes with restore-on-reopen — P11); Y records a buyer response (opens the response capture: type radios, window picker when confirm, Enter commits).
**CP-3 (agreement)**: W opens the agreement sheet on an awaiting-agreement order; the window picker is an arrow-navigable radio grid (day groups are fieldset/legend; Home/End jump day groups); Enter commits the selection (no confirm dialog — the stamp IS the commit, reversible per P03 within 7s); the Agreement Stamp announcement is assertive-once then polite summary (below).
**CP-4 (holds + disputes)**: H opens HOLDS; A releases the focused hold (manager) with a reason field (required — VALIDATION announced); X cancels with rationale; L jumps to the order's ledger tab (dispute chain); E exports the ledger scope (job toast follows async-contract §8 copy).
**CP-5 (manifests)**: ⌘M opens MANIFESTS (the rail surface is also the ⌘K palette's first manifests result — dispatch lands there by role routing at entry, CP-1.1); space toggles row selection, shift+arrows range-select (P07); B builds the manifest from selection; S seals (consequence-naming rollup is read before the action; count echo is a required field — mismatch = CONFLICT announced); P prints/exports.
**CP-6 (policy)**: policy sheets are standard forms; simulation diff is two tab-navigable band tables with alignment links (P23-style) — before/after counts announced on focus; weight inputs are sliders WITH numeric text fields (2.5.7-safe); quiet-hours ribbon is a focusable figure with the next eligible time in words.
**⌘K palette (P05)** on console: bilingual normalized search (rtl-rules §4), grouped results (orders / buyers / manifests / templates / actions), recent items.

### On-call surface (touch + external keyboard supported; Arabic-layout-safe)

Cards navigate by swipe-order = focus order; the order sheet is a bottom sheet (Esc/back closes, focus returns to card); decide actions (log contact, record response, agreement) are the same P09-step forms re-flowed; every touch target ≥44px with ≥8px spacing (05 integration record); the queue's countdown text is tabular-numeral text (never a graphic).

Global: no raw-letter-ONLY bindings (Arabic layout safety — every letter shortcut carries a modified-key equivalent, a navigation-key equivalent, or a ⌘K palette path; modified keys and navigation keys are preferred wherever they suffice — a11y-baseline §3); every drag interaction has a keyboard equivalent (none exist at v1 — selection is keyboard-native); focus-visible at 2.4.13 strength (≥2px ring at accent.bright, ≥3:1 change-contrast — the 05 ladder's 8.59:1); sticky rails never obscure focused elements (2.4.11 — scroll-margin is a token obligation on queue rows); targets ≥24px floor (2.5.8) with console rows at 44px and on-call at 44px+.

## Screen-reader announcement schedule (ladder-event live regions)

| Event | Mode | Copy shape (bilingual in 11) |
|---|---|---|
| Order imported / triaged (own site queue) | never on arrival | visible list mutation only; region count context on region entry (P19) |
| Attempt sent (own queue row focused) | polite once | "أُرسلت المحاولة 2 — رسالة نصية" / attempt kind + ordinal |
| Attempt failed (channel error) | assertive (focused row) | failure + reason class + failover statement |
| Response captured (focused row / own capture) | polite | response type + window if present |
| **Agreement stamped (the Stamp moment)** | assertive once, then polite summary | "اعتُمدت النافذة — الخميس من 17:00 إلى 20:00، مسجَّلة مع رد الرسالة" + order facts (11 §D5 verbatim); the stamped chip carries the state for later review |
| Auto-cancelled (ladder exhausted) | assertive once (focused row) | resolution + reason + buyer-history effect |
| Hold awaiting decision (manager) | instant-tier notification + polite on inbox open | hold kind + order facts |
| Validation errors (rule-named: quiet hours, cap, capacity, weights) | assertive | the failing rule's plain-language string, field/rule-linked |
| Countdown ticks, capacity decrements, rank-ish re-sorts | NEVER announced | visible text only (tabular numerals); polite on focus if asked |
| Job progress (imports/exports) | polite on the job row only | "استيراد الصف 4 من 60" per async-contract §3 copy |

Live regions always pair with visible surfaces (a11y-baseline §4): every announcement above has a visible chip/row/badge — an announcement without a visible surface is a defect. The Stamp motion is never the information carrier (the state chip + ledger entry are — 06 AgreementStamp).

## Per-surface checklist (S1–S13; WCAG 2.2 AA + product floors)

All surfaces: four empties (P01) implemented with correct copy; skeletons mirror final geometry RTL-flipped (P02); focus-visible per 2.4.13; targets per surface floors; contrast per the 05 ladder contracts (all reading pairs AAA, body pairs AA, UI pairs ≥3:1); skip-to-main on console; no color-only state anywhere (band chips, attempt states, aging badges are text+icon — 05/06).

- **S2 queue**: 400% zoom reflow single column at 1280px→320px-equivalent with worst-case Arabic strings ("مستشارو التدقيق والحوكمة"-class + "ساعات الهدوء" product terms); row summaries via described-by; countdowns are text; virtualization above 200 rows preserves focus (P19); the aging badge is notice-toned text, never a red pulse.
- **S3 drawer**: expansion is aria-expanded on the row; drawer content in tab order after the row; risk drill is a disclosure; trail rungs are list items with ordinal text; response rawText is bidi-isolated inline content.
- **S4 agreement sheet**: window chips are radios with capacity in the label; disabled-by-capacity carries reason text; the stamp announcement contract above; undo (P03) is the first tab stop for 7s with focus preserved.
- **S5 call leg**: script at Arabic line-height 1.75 (05); outcome radios labeled; note field with live character count; ⌘⏎ submit; Esc restore (P11); the sheet never traps focus beyond its cycle.
- **S6 holds**: hold reason fields are required with linked validation; release/cancel are consequence-naming (P04).
- **S7 manifests**: rollup is a definition list; seal requires the count echo (mismatch = announced CONFLICT); selection state is per-row checkbox with count in the action bar (P07).
- **S8 templates**: bilingual columns are labelled regions with per-side dir; parameter syntax has described help; publish preview is readable as an article; length warnings are text.
- **S9 policy**: sliders + numeric fields pairs (2.5.7); simulation diff tables keyboard-navigable with delta announcements; quiet-hours ribbon figure has described-by; weight-sum error focuses the first offending field.
- **S10 buyers**: history counts are text+icon; blocklist action requires reason; blocked state is an alert region with restore path.
- **S11 ledger/jobs**: activity log is a navigable table (P17); export expiry announced with artifact name; job progress text equivalents (async-contract §8).
- **S12 inbox**: P21 tiers per class; seen state is programmatic; instant-tier rows badge only (digest classes never badge — 06).
- **S13 onboarding**: P22 checklist is a link list (no tours); each entry leads into the flow it names.

## RTL/LTR verification matrix (per surface, both directions)

For each of S1–S13, recorded pass/fail on: pure-Arabic render; pure-English render; mixed strings (Latin orderRef/buyer names inside Arabic rows — bidi isolation on every interpolation per rtl-rules §2); numeral rendering under the Western-numeral policy inside Arabic prose (no mid-sentence mixing — copy-voice §1.7); embedded Latin tokens in RTL (orderRef `ORD-10231`, currency `SAR` inside Arabic value cells — isolating containers); table/grid mirroring (queue columns, manifest rollup, activity log — column order mirrors, time columns keep LTR-embedded numerals with isolation); ladder-trail mirroring (rungs progress toward inline-end in RTL; timestamps stay readable); risk-rail direction (the rail's band order low→medium→high reads inline-start→inline-end in both directions — the RISK DIRECTION is semantic, not geometric); quiet-hours ribbon time axis (RTL runs inline-end→inline-start with labels preserved); icon flipping per the 06 metaphor ledger; truncation at 320px container with worst-case Arabic; 400% zoom reflow; focus order matching visual order in both directions. The mock's seeded mixed-locale fixtures (07c §1: bilingual buyer names, Latin orderRefs, rawText verbatims) guarantee a test fixture for every cell.

## Shortcut table (complete, Arabic-layout-safe — every letter binding carries a modified-key equivalent, a navigation-key equivalent, or a ⌘K palette path)

| Context | Shortcut | Action |
|---|---|---|
| Global (console) | ⌘K / Ctrl+K | command palette |
| Global (console) | / | queue search focus |
| Global (console) | H | open Holds (manager default alternative) |
| Global (console) | ⌘M | open Manifests (dispatch default surface) |
| Queue | j / k (or ↑/↓) | row navigation (roving tabindex) |
| Queue | Enter | expand order drawer |
| Queue | I | import sheet (paste flow) |
| Queue | F | filter chips focus |
| Drawer | R | reschedule active attempt (popover) |
| Drawer | C | call-leg sheet |
| Drawer | Y | record buyer response |
| Drawer (call-leg sheet) | N | note field focus |
| Drawer / queue | W | agreement sheet (awaiting-agreement orders) |
| Drawer | L | ledger tab for this order (dispute chain) |
| Holds | A / X | release hold / cancel order (manager) |
| Holds | E | export ledger scope |
| Manifests | space / shift+arrows | toggle / range select |
| Manifests | B / S / P | build / seal / print-export |
| Any sheet | Esc | close + focus return (trap-free guarantee) |
| Any form | ⌘⏎ | submit |
| Inbox | M | mark seen |

## Overlay applicability & privacy posture

No fintech/healthcare/legal overlay applies (a11y-baseline §7). Commerce-ops privacy posture is structural (08 consent semantics): buyer-facing data in the console is bounded to phone, display name, locale, and outcome COUNTS (07a Buyer) — no address text beyond zone/district/city, no retained message bodies beyond the ≤280-char evidence field, no geolocation, no payment data anywhere (LOOP-10). Response rawText is evidence (dispute-grade, 02 Salem) and is treated as such: it renders bidi-isolated, never in page titles or URLs, and ledger exports carry it verbatim with actor + timestamp. Buyer phone numbers render masked in list surfaces (last 4 visible) and fully only in the call-leg sheet where dialing is the job. The conditionally-AI enrichment consumes counts and bands only — never identifiers or raw text (ai-native-patterns §9).
