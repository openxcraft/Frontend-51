# 09 — Accessibility: policy-acknowledgment-portal

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model — Arabic full citizen) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: "مستشارو التدقيق والحوكمة" class, plus seeded policy titles like "سياسة الصحة والسلامة المهنية في مواقع العمل والمستودعات"). **The §7 legal/audit overlay is BINDING on this product**: attestation flows preserve focus order across the entire agreement text (with a structured alternative), timestamps are announced with the action, and the ledger is keyboard-navigable and exportable.

## Keyboard map (critical paths; modified chords only — no raw letters, the Arabic-layout conflict class per a11y-baseline §3)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search over policies/campaigns/people/ledger); ? opens shortcut help; skip-link to main content; Tab order follows visual reading order per direction; focus ring = Ittibaq Denim ≥2px at 2.4.13 strength (6.80:1 on canvas), scroll-margin honored so sticky coverage headers never cover focus (2.4.11); every shortcut has a visible button/menu equivalent.
- **CP-1 (S2/S3 register → publish)**: P18 grid on PolicyRegisterGrid — ↑/↓ rows, ←/→ columns (physical mapping stable in both directions, rtl-rules §4); Enter opens policy detail; ⌘P opens the publish panel; the DocumentControlForm is a P09 progressive form — Tab advances fields, each independently valid; Esc closes the publish panel returning focus to the version-timeline node that invoked it (trap-free); ⌘Enter submits the publish (the visible Publish button is always present).
- **CP-2 (S4 composer)**: Tab walks composer fields in composition order (version → segments → window → cadence → attestation pair → rule); Space toggles segment selection with the live membership count announced politely; ⌘L launches (visible Launch button always present); the overlap-warning panel is focusable and links to the named campaigns.
- **CP-3 (E2 reader — THE attestation flow, §7 overlay)**: focus order runs **across the entire agreement text** top-to-bottom — every heading and paragraph of the policy body is focusable content in reading order; ↑/↓ move between headings once a heading is focused (heading navigation mode), or continuous reading with Tab advancing interactive elements in document order; the **structured alternative** is the outline panel (⌘O) — a semantic heading list of the same body that navigates identically and satisfies §7's "structured alternative" clause; Alt+L toggles the locale (announced as text — "Arabic body, governing"; modified chord only — raw letter keys conflict with Arabic layouts, a11y-baseline §3); the attestation gate is reached only after the body (focus order enforces document-then-gate — evidence-shaped, not checkbox-shaped); typed-name field: label persistent, Enter submits, Esc restores; Decline is a peer button, never buried.
- **CP-4 (S5 coverage console)**: zone rosters are P18 grids — ↑/↓ rows, Space bulk-selects (P07 action bar for bulk remind/export); Enter drills into the person row; ⌘R sends the reminder for the focused row's campaign; ⌘E extends the due window (dialog names before/after values).
- **CP-5 (S7/S8 ledger + export)**: **ledger is keyboard-navigable** (P18 grid, row focus visible, filter chips reachable by Tab, every filter has a menu equivalent) **and exportable** (⌘X opens the evidence-pack scope picker; the Export button is always visible — a11y-baseline §7 obligation met by construction); artifact rows carry expiry in text.
- **CP-6 (S9 people/segments)**: standard list navigation; import wizard fields with inputmode on numeric columns (employee numbers) per the ux-guidelines Mobile Keyboards row; ⌘I opens the import dialog.

## Focus order rationale

Per surface, focus follows the evidence reading order: register → detail → version timeline → bodies (the document IS the object); in the reader (E2), body-before-gate is a legal-design decision, not a convenience — a screen-reader user traverses the same agreement a sighted user scrolls, with the outline panel as the sanctioned shortcut (§7). In RTL chrome every order mirrors (timeline spine inline-start, gate submit at inline-end); the two locale bodies are never interleaved in focus order — each body is one navigable region with its own direction (comparison is not the reader's job, unlike seo-brief-builder's parity surface).

## Announcement schedule (a11y-baseline §4 — polite/assertive justified)

| Event | Mode | Copy shape |
|---|---|---|
| Version published | polite | policy + label + effective date (timestamp WITH the action — §7) |
| Campaign launched | polite | version + segment count + due date |
| Dispatch progress (job) | polite | recipients delivered of total, per-site |
| Import progress (job) | polite | rows imported of total; bad rows named on completion |
| Body locale switched (E2) | polite | locale name in text ("Arabic body — governing locale") |
| Read evidence recorded | never | view events are record-keeping, not state changes the reader needs spoken (the visible locale-open state beside the toggle carries it) |
| Attestation submitted | polite | **the Ledger Line moment: version label + timestamp announced with the action (§7)** — "Acknowledged: Information Security Policy v2.3, 21 Oct 2026 14:03" |
| Decline recorded | polite | declined + reason-presence (never the reason's content unless focused) |
| Validation errors (publish gates, campaign gates, typed-name mismatch, locale gates) | assertive | field-linked via described association; the gate's exact rule named (11 C) |
| Due window extended | polite | before → after values |
| Export ready / expired | polite | scope + expiry window |
| Reminder batch sent | polite | recipient count |

Decorative recolors (zone chip tints), the Ledger Line's draw, and skeleton geometry are NEVER announced; every announced state has a visible text equivalent (a11y-baseline §4 — live regions pair with visible surfaces).

## Per-surface WCAG 2.2 AA checklist

- **S1 register**: bilingual titles bidi-isolated (`dir="auto"` semantics on title cells; isolate marks on interpolations); mixed-script rows never force ambient direction; coverage chips icon+text+count; virtualized >200 rows with focus preservation + row-count context on region entry (P19); 360px card collapse; targets ≥24×24 (2.5.8).
- **S2/S3 policy detail + publish**: version timeline is an ordered list (SR reads newest→oldest with status labels); change summaries render per-side direction; DocumentControlForm labels persist above fields (ghost text never substitutes — a11y-baseline §5); on-blur-or-submit validation with field-linked messages; error summary focuses the first error on submit failure.
- **S4 composer**: membership counts as live text; attestation-text pair editors are plain textareas with persistent labels; the governing-locale gate error names the missing side; paste never blocked (3.3.8).
- **S5 coverage console**: arithmetic as text first; zone rosters keyboard grids; overdue is announced as a state, never only a color (4.86:1 red + icon + word); declined rows carry the plum label + icon + word; sticky headers obey 2.4.11 scroll-margin.
- **S6 person history**: inactive-person marker is text+icon; historical acknowledgments list version labels + dates as text; exportable via S8 scope.
- **S7 ledger**: keyboard-navigable grid + filters; entries immutable (no edit affordances — and no implied affordance via focus, per §7's exportable obligation the surface ships an Export action reachable by keyboard); timestamps Western numerals, tabular figures.
- **S8 evidence pack**: scope picker is a radio/checkbox group with visible labels; pack contents preview is a semantic list; artifact expiry in text with renew action.
- **S9 people/segments**: roster grid P18; import wizard: labels persistent, per-row validation surfaced on completion with first-error focus; inputmode on numeric fields.
- **E1 my policies**: due dates as text + icon; locale badges text; pending-first ordering announced on region entry; no urgency theater (no red pulsing) — overdue is a calm word.
- **E2 reader + gate (§7 core)**: full-text focus order + outline alternative (above); Arabic body ≥1.7 line-height with tashkeel headroom (rtl-rules §3); tracking 0 Arabic; typed-name field has autocomplete off + label persistent; the gate's locale-read states are text ("Arabic — opened · English — not opened"); Decline peer-visible; on validation failure the typed name is retained (P11 — 3.3.7 redundant-entry); no time limits anywhere (2.2.1 trivially satisfied — attestations have due dates, not session timers).
- **Overlays (dialogs, palette)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (AR-governing policy bodies, AR names, attestation text AR) · pure-English render · mixed strings (Latin employee numbers inside Arabic chrome; Arabic policy titles inside EN chrome — seeded P-002 AR title in the register; the AR body's embedded Latin runs) · numeral rendering under Western policy (version labels v2.3, EMP-1004, counts 11 of 28 — Western in both directions, never mixed systems) · embedded Latin tokens in RTL context and Arabic tokens in LTR context (bidi isolation on all user-generated/ingested strings) · tables/grids column order mirrored with alignment rules held (numerals aligned inline-end in both) · version timeline spine mirrors (reading-axis geometry) · forms label/input alignment + error placement on the correct inline edge · the Ledger Line's writing axis mirrors (inline-start → inline-end in RTL chrome) · truncation at 320px container with worst-case joined-word strings ("مستشارو التدقيق والحوكمة" and the seeded long policy titles — word-boundary ellipsis only, no hyphenation exists) · 400% zoom reflow in one dimension on E2 (the reading surface — body reflows, gate stays reachable, no horizontal scroll) · bidi isolation on all user-entered strings. Seeded fixtures (07c: P-002 mixed-script AR body, P-004 tashkeel heading, AR-only person names, the unpaired P-003/P-005 warnings) are the regression set for this matrix.

## Reduced-motion contract (motion-language §5)

The product's only motion is the Ledger Line (≤120ms opacity + width) and opacity-only state fades: under `prefers-reduced-motion` the Ledger Line renders at full width instantly with the text fact + polite announcement carrying the moment; route changes are hard cuts (they already are — minimal personality); skeleton geometry is static; no staggered reveals exist to collapse; every state change keeps a perceivable non-motion equivalent by construction (the announcement schedule above is the contract). The release matrix (a11y-baseline §8) runs the reduced-motion pass on every CP — for this product that pass is trivially clean because nothing but opacity ever moves.
