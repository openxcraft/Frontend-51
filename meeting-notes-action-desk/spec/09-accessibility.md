# 09 — Accessibility: meeting-notes-action-desk

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: "مستشارو التدقيق والحوكمة" class) for truncation/reflow. Owner mode at 360px is a first-class release surface (Faisal's phone — 02), not a responsive afterthought.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search — alef variants, taa marbouta, yaa forms, tashkeel strip); ? opens shortcut help; skip-link to main content; Tab order follows visual reading order per direction; focus ring = Maqam Lilac ≥2px, 3.39:1 on canvas (UI-component-safe per 05 contract), 2.4.11 scroll-margin so sticky headers never cover it; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class, a11y-baseline §3); every shortcut has a visible button/menu equivalent.
- **CP-1 (S2 capture + S3 summary)**: paste focus lands in the capture field from anywhere in the ingest dialog (⌘V path); segment list is a P18 list — ↑/↓ move segments, Enter opens the evidence-span links of the focused segment; on S3, A accepts the focused proposal, E edits it (inline P06 — Esc restores, Tab commits), D dismisses it (dismissal is undo-window P03, never a confirm dialog); R regenerates the summary (P04 level-2 confirm names what a re-run replaces).
- **CP-2 (S5 action composer)**: the bilingual pair is a two-field group — Tab moves EN→AR→owner→due; O opens the member picker (menu semantics, ↑/↓ + Space, searchable with normalization); the single-owner picker refuses a second selection with visible copy, not an after-submit error; ⌘Enter sends for confirmation; the respond-by override is a labeled field (never a hidden default).
- **CP-3 (S6 loop desk / owner mode)**: queue rows focus in reading order (awaiting → questioned → declined → confirmation-overdue); on a focused row, C confirms, Q asks (focuses the note field — empty submit is a linked VALIDATION), X declines (note required, same rule); the countdown is text ("respond-by 22 Oct, 8 hours left"), never a color-only meter; racing responses surface the CONFLICT dialog with focus returned to the row.
- **CP-4 (S7 register)**: P18 grid — ↑/↓ rows, ←/→ columns (physical mapping stable in both directions, rtl-rules §4); Space toggles row selection (P07 bulk send-for-confirmation); Enter opens the action detail; S marks the focused confirmed action in-progress, ⌘S marks done (completion-note field optional, focus moves into it when present); zone chips are read as text, never color-only.
- **CP-5 (S4 decisions + exports)**: decision rows: E edits inline (P06); the minutes preview is a reading surface — H jumps between sections; the export button names its format and filter state ("Export action register — Faisal, 4 actions").

## Focus order rationale

Per surface, focus follows the accountability reading order: the loop's state first (zone/digest), then the artifact (action/segment text), then the actions inline-end. In RTL the order mirrors. The confirmation card's three responses sit after the action text so the commitment is read before it is made — focus order carries the product's ethics. The bilingual pair fields are navigated EN-then-AR in LTR chrome and mirrored in RTL chrome, each rendering its own content direction (never interleaved).

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Capture import progress (job) | polite | segments landed of total, named meeting |
| Summarization started/done | polite | mode (assist/deterministic), proposal count |
| Assist proposal appears | polite | "Suggestion: … — accept, edit, or dismiss" (never auto-applied, P15) |
| Confirmation requested | polite | action text + owner name + respond-by date |
| **Owner confirms (the Ta'ahhud Settle)** | polite | "Faisal confirmed 'تجديد فحص السلامة من الحريق' — committed 21 Oct" (state + actor + timestamp; the motion is opacity-only and never the sole carrier — a11y-baseline §4) |
| Owner questions / declines | assertive | response + note (returns to the lead's desk — the lead must not miss it) |
| Confirmation-overdue entry | polite (digest refresh) | named values: requested/respond-by/days unanswered |
| Status change (in-progress/done) | polite | actor + action + new state |
| Validation errors (missing owner/due, out-of-sequence) | assertive | field-linked via described association |
| Autosave cycle (composer) | polite | saving → saved (fade) |
| Export ready / artifact expired | polite | format + expiry window |

Decorative layout shifts, zone-chip recolors, and the Settle crossfade are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces — a11y-baseline §4).

## Per-surface WCAG 2.2 AA checklist

- **S2 CaptureStream/NotesIngestPanel**: mixed-script segments bidi-isolated (`dir="auto"` on inputs, isolate marks on interpolations — rtl-rules §2); evidence spans are focusable anchors with the target named; >200 segments virtualize with focus preservation (P19) and row-count context on region entry; targets ≥24×24 (2.5.8); 400% reflow — segment list collapses to full-width cards at 360px.
- **S3 SummaryPanel**: streaming disclosure per ai-native-patterns §2 — reserved region (CLS budget 10), start/completion announced, stop/regenerate reachable from first token, partial output marked; confidence 'low' label is text + icon, never a bare meter; provenance chip icon+text.
- **S5 ActionComposer**: labels persist above fields (ghost text never substitutes for a label — a11y-baseline §5); on-blur-or-submit validation with field-linked messages; error summary focuses the first error; the unpaired-pair warning is text, not color; due-date input is a native date control with dual-calendar display (P24) rendered as text beside, not inside, the field.
- **S6 ConfirmationLoopCard / owner mode at 360px**: the three responses are ≥24px buttons with verb+object labels; disable-on-submit (double-response prevention) + the idempotency contract in 07b; the clarification thread is a chronological list; countdown as text; self-assignment labeled.
- **S7 ActionRegisterTable**: P18 grid + P19 virtualization; zone chips color+glyph+text (readable with color disabled — 05); Western numerals, inline-end alignment mirrored; filtered state declares itself (P08); bulk action bar names the count ("Send 4 selected for confirmation").
- **S9 Jobs & activity**: standard list navigation; job rows with cancel/retry and link-to-context; activity feed filterable by keyboard.
- **Forms (member add, meeting create)**: autocomplete tokens declared for name fields (3.3.7 redundant-entry recall across the create→composer chain); paste is never blocked (3.3.8).
- **Overlays (dialogs, palette, composer drawer)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (capture segments, AR pair sides, Arabic owner names) · pure-English render · mixed strings (Latin token "POS" inside an Arabic segment — R-001 fixture; Arabic action text inside EN chrome — bidi isolation proves out) · numeral rendering under the Western policy (dates, countdowns, register cells, day counts) · embedded Latin tokens in RTL context and Arabic tokens in LTR context (isolating containers) · tables/grids column order mirrored with alignment rules held · the loop glyph mirrors (06 flip decision), the check/question/x respond glyphs never flip · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings ("مستشارو التدقيق والحوكمة" class) · 400% zoom reflow in one dimension, owner-mode 360px included · bidi isolation on all user-generated/ingested strings (capture text, notes, clarification threads). Seeded fixtures (07c R-001 segment 1 'mixed', "omar haddad" Latin speaker label, "ميرا" third-person owner cue) are the regression set.

## Reduced-motion contract

The identity is minimal (05): opacity-only ≤120ms everywhere; route changes crossfade ≤180ms; the Ta'ahhud Settle collapses to an instant state change + the same polite announcement (identical perceivability); zone-chip changes become instant with the text delta always present; streaming summaries render in paragraph chunks instead of progressive fill (announced per chunk completion, politely — motion-language §5); no parallax, no overshoot, no celebratory motion exists to suppress — the reduced-motion pass must verify that NO state change loses its perceivable equivalent, which by construction is the text/announcement pairing above.
