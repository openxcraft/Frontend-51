# 09 — Accessibility: contract-lifecycle-manager

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: "مستشارو التدقيق والحوكمة" class) for truncation/reflow. **Legal/audit overlay obligations apply** (a11y-baseline §7): the execution-record attestation flow preserves focus order through the metadata confirmation; timestamps are announced with the action; the activity log is keyboard-navigable and exportable.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search — rtl-rules §4); ? opens shortcut help; skip-link to main content; Tab order follows visual reading order per direction; focus ring = Ahd Slate ≥2px, 9.18:1 on canvas, 2.4.11 scroll-margin so sticky headers never cover it; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class); every shortcut has a visible button/menu equivalent.
- **CP-1 (S3 intake wizard)**: wizard is a P09 progressive form — Enter advances a valid step, ⌘Enter submits the whole record; counterparty search field receives ⌘V from anywhere in step 1 (paste never blocked — 3.3.8); suggestion list navigation: ↑/↓ moves suggestions, A accepts the focused suggestion, E opens it in edit-then-accept mode, D dismisses (each also a visible button on the row — no key is the only path); Esc cancels the wizard with a P04-level confirm naming what is kept (metadata already saved).
- **CP-2 (S4 obligations console)**: P18 grid — ↑/↓ rows, ←/→ columns (physical mapping stable in both directions, rtl-rules §4); Space toggles row selection (P07 bulk); Enter opens the complete-with-evidence dialog on the focused obligation; Z jumps to the next zone group (overdue first); G jumps to the next overdue row; Esc closes dialogs returning focus to the trigger.
- **CP-3 (S2 contract detail)**: the renewal window bar is a labeled region reachable by Tab; R opens the record-renewal / begin-termination decision menu (visible buttons on the bar too); the bilingual metadata panel: Tab walks EN field then AR field with the language announced per field; M triggers inline edit (P06 — Esc restores, Tab commits+advances).
- **CP-4 (workflow + execution)**: review track is an ordered list; A approves / R returns the focused pending step (with comment dialog). **Execution attestation contract**: `recordExecution` opens a confirmation that walks the metadata summary in reading order (counterparty → executed date → channel → executed copy) — focus preserves through every line (a11y-baseline §7), Tab advances, Enter records; the timestamp is announced WITH the action ("Executed — 04 Nov 2026, manual channel"), and the Seal Settles moment is announced politely with identical facts (never motion-only).
- **CP-5 (S1 register, S7 activity)**: register grid P18 with range selection; saved views reachable via V; S7 activity log: ↑/↓ entries, E expands a correction entry's referenced predecessor (correctionOf chain), X exports the filtered view from the surface itself (visible button too).

## Focus order rationale

Per surface, focus follows the registrar's reading order: identity (title/counterparty) → state (seal/zones) → obligations → actions inline-end. In RTL the order mirrors. The bilingual metadata panel always reads EN-then-AR in LTR chrome and AR-then-EN in RTL chrome (workspace-locale-driven primary first — the workspace's own language leads), with each field's language announced; the two fields of a pair are never interleaved with other pairs.

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Reminder schedule recompute | polite | "Schedule updated — 1 overdue, 2 imminent" (counts as text) |
| Zone change on an obligation row | polite | obligation summary + old→new zone |
| Obligation completed | polite | summary + date + evidence presence |
| Suggestion appears (extraction job) | polite | "Proposal: obligation they-owe, certificate, due 15 Oct 2026 — accept, edit, or dismiss" (draft-by-default, never auto-applied) |
| Suggestion accepted / dismissed | polite | field/obligation + outcome |
| Validation errors (metadata, date logic, gates) | assertive | field-linked via described association |
| Execution recorded (attestation) | polite | full fact line: executed date + channel + obligations-scheduled count |
| Review decision recorded | polite | decision + actor + timestamp |
| Renewal term / termination recorded | polite | new term end or effective date + closed-obligations count |
| Export ready / artifact expired | polite | scope + expiry window |
| Overdue entry on region entry (S4) | polite | "3 overdue obligations — earliest 20 days overdue" |

Decorative layout shifts, seal settle motion, window-bar day-count ticks, and register settle are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces).

## Per-surface WCAG 2.2 AA checklist

- **S1 VaultRegister**: mixed-script cells bidi-isolated (`dir="auto"` per cell, isolate marks on interpolations — rtl-rules §2); zone chips icon+text+color (never color alone); >200 rows virtualize with focus preservation + row-count context (P19); derived-lifecycle ribbons carry text ("expiring-soon — 41 days"); targets ≥24×24 (2.5.8); 400% reflow → card collapse at 360px with the bilingual pair stacked (ux-guidelines row 71).
- **S2 BilingualMetadataPanel**: per-field direction containers; sync state is text ("Arabic title not yet recorded"); inline edit P06; value/currency cells Western numerals with tabular figures; renewal window bar: every number labeled, states text+icon.
- **S3 wizard + ExtractionReviewPanel**: labels persist above fields (ghost text is never the label — a11y-baseline §5); on-blur-or-submit validation with field-linked messages; error summary on submit focuses the first error; suggestion confidence is a labeled figure ("confidence 0.62 — low"), never a bare meter; document anchors open in a context-preserving side panel (ai-native-patterns §3).
- **S4 ObligationLedger**: direction is arrow+label (we-owe/they-owe — flipped in RTL, announced as words); provenance chips text-bearing; overdue rows never rely on the red alone (icon + day count).
- **S7 AuditTrail**: keyboard-navigable (above); actor-action-target-timestamp grammar announced; correction chains expandable via keyboard; export action on-surface; >200 entries virtualize (P19).
- **Forms (counterparty, metadata, obligation)**: autocomplete tokens on person/organization name fields; spellcheck=false on registry-code inputs; paste never blocked (3.3.8); required programmatic not asterisk-only.
- **Overlays (dialogs, palette)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (Arabic contract titles, counterparty legal names, obligation summaries) · pure-English render · mixed strings (Arabic title inside EN chrome row; Latin registry id inside AR chrome — bidi isolation proves out) · numeral rendering under Western policy (values, dates, day counts, confidences — never mixed systems mid-sentence) · embedded Latin tokens in RTL context and Arabic tokens in LTR context (isolating containers) · register/ledger column order mirrored with alignment rules held (numerals stay inline-end-aligned per direction) · bilingual metadata pair order (locale-primary first) · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings (e.g. "مستشارو التدقيق والحوكمة" class titles) · 400% zoom reflow in one dimension · bidi isolation on all user-generated/ingested strings. Seeded fixtures (07c: شركة الوفاء للمواد الغذائية title pair, غلف داتا سيستمز in an EN-chrome row, the mixed-script supply agreement) are the regression set.

## Reduced-motion contract

The Seal Settles moment collapses to instant appearance + state chip + the polite announcement (identical facts — motion never the only carrier); staggered metadata settles render simultaneously; route crossfades become hard cuts; window-bar day-count ticks become text changes only. Every animated state change keeps a perceivable non-motion equivalent (motion-language §5): opacity in ≤2 steps or instant change + announcement. A reduced-motion pass is part of the release matrix (a11y-baseline §8.6).
