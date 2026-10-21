# 09 — Accessibility: loyalty-stamp-card

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-ar model — RTL chrome default, LTR full citizen) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: the "مستشارو التدقيق والحوكمة" class — for this product's own worst case, the longest realistic tier name "قهوة مثلجة كبيرة على حساب المتجر" and member names like "عبدالرحمن بن عبدالعزيز المطيري").

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05) with normalized bilingual search; ? opens shortcut help; skip-link to main content; Tab follows visual reading order per direction; focus ring = rose-deep ≥2px at 7.61:1 change-contrast on canvas (the 05 contract — focus never rides the primary's 3.27:1 edge) with 2.4.11 scroll-margin so the stamper's sticky search never covers it; all shortcuts are modified chords except the stamper's single-letter action keys (below — the cod-order-confirmation queue-surface precedent, recorded); every shortcut has a visible button equivalent.
- **CP-1 (S3 studio)**: Tab walks tier rows in authoring order (stepper → nameAr → nameEn → row actions); the P23 alignment link jumps between a row's two name fields; ⌘↑/⌘↓ reorder the focused tier row (drag alternative, 2.5.7); Esc cancels an in-place edit and restores (P06); publish opens the P04 level-2 confirm where Enter commits on the primary only after focus has visited the consequence text.
- **CP-2 (S2 stamper)**: `/` or ⌘K→"stamp" focuses the search field (one chord from anywhere); typing filters (≤16ms keystroke budget, 10); ↓/↑ walk the results listbox; Enter resolves the focused member; with the card sheet open: **S stamps**, **U undoes** (only while the undo affordance is live), **R opens redemption**, **1** resolves the top search result — single-letter keys only inside the sheet (the counter speed surface; visible Stamp/Undo/Redeem buttons carry every action — the letters are accelerators, never the only path; the Arabic-layout caveat is declared: keys are physical-position-stable on the counter's Latin-keyed tablets, and the on-screen buttons are the guaranteed path on any layout); Esc closes the sheet returning focus to the search field.
- **CP-3 (S2/S6 redemption)**: with the redeem panel focused, Enter opens the confirm; the confirm's consequence text is in the tab order BEFORE the commit button; the receipt line lands in a polite live region.
- **CP-4 (S5/S6/S7 enrollment + pass)**: the join form (S7 phone surface) is three fields with persistent labels and Enter-to-submit; the near-match confirm renders as a dialog with two explicit choices; the pass QR sheet's print action is a button, and the short code is copyable with the copy action announced.
- **CP-5 (S9 staff & audit)**: the ledger is a P18 grid — ↑/↓ rows, ←/→ between filter chips and rows; F jumps to the flag board; every flag links to its filtered ledger view (Enter follows); staff actions are menus with visible-button equivalents.
- **CP-6 (S8/S10)**: standard list navigation; insight tiles expose their formula panel with Enter; export actions confirm with the row count named (P04 level 2).

## Focus order rationale

Per surface, focus follows the counter's working order: search → results → card sheet → actions inline-end; in RTL the order mirrors (rtl-rules §4). The studio's bilingual tier row keeps nameAr before nameEn in RTL chrome (reading order) and reversed in LTR — the alignment link (P23) is the guaranteed jump between them for keyboard users. The member pass (S7) is a reading surface: card → tier ladder → QR, no actions beyond copy — focus is short and linear by construction.

## Announcement schedule (a11y-baseline §4 — live regions pair with visible surfaces)

| Event | Mode | Copy shape |
|---|---|---|
| Member resolved from search | polite | member name + card state ("نورة العتيبي — 3 من 8 أختام") |
| Stamp committed (the signature moment) | polite | "ختم 4 من 8" + tier approach when crossing a tier boundary ("بقي ختم واحد حتى 'كوكيز مجاني'") — the motion is decoration, the announcement is the information |
| Stamp blocked (cap/full) | assertive | the failing rule + the named earlier stamp (07c fixture copy) |
| Undo performed | polite | "أُلغي الختم — 3 من 8" |
| Tier redeemable (on resolve) | polite | tier name in member locale |
| Redemption committed | polite | receipt line (reward name + actor) |
| Adjustment recorded | polite | delta + reason + actor |
| Validation errors (tier row, policy, phone) | assertive | field/row-linked via described association; error summary focuses first error on submit |
| Artifact ready / expired | polite | format + expiry window |
| Autosave cycle (studio) | polite | saving → saved (fade) |

Decorative dot fills, flag-chip recolors, and skeleton geometry are NEVER announced; every state change has a visible text equivalent (the count, the chip label, the badge text).

## Per-surface WCAG 2.2 AA checklist

- **S2 Stamper**: search results are listbox semantics with row-count context on region entry (P19); the card sheet is a dialog with trap + return; action targets ≥56px tablet / ≥44px desktop (2.5.8 exceeded); the undo affordance is a visible button with a live countdown, not a hidden gesture; mixed-script member names render bidi-isolated (`dir="auto"` inputs; isolate marks on interpolations).
- **S3 Studio**: both locale fields of a tier row have persistent labels ("الاسم بالعربية" / "Name in English" — ghost text is never the label, a11y-baseline §5); the blank-locale error links to its exact row and side; the live preview is aria-hidden (it duplicates editable content — its state changes never announce); tier reorder has the ⌘↑/⌘↓ equivalent (2.5.7).
- **S5/S6 Members**: >200 rows virtualize with focus preservation (P19); masked phone hints are text (never color-only truncation); the timeline is a chronological list with header groups; block/unblock confirms name the frozen scope (P04).
- **S7 Member pass (phone, 360px)**: one-hand reach for the QR (bottom third on phone layouts); the pass works at 200%/400% zoom with reflow in one dimension — worst-case tier names wrap at word boundaries (Arabic has no hyphenation, rtl-rules §4); the short code renders LTR-isolated inside RTL chrome; contrast contracts from 05 hold on the pass face (ink 14.37:1 on canvas; rose-deep 7.61:1 for tier emphasis).
- **S8 Insights**: counts are text in ink (never color-carrying heat); formula panels keyboard-reachable; floored percentages render with their denominator ("0.14 — 1 من 7 بطاقات").
- **S9 Staff & audit**: ledger rows ≥44px with generous spacing (2.5.8); flags are icon+text+count; the actor names render in the reading locale.
- **Forms (join, enroll, settings)**: labels persist; on-blur-or-submit validation with linked messages; paste never blocked (3.3.8); autocomplete tokens declared for name/phone fields (`name`, `tel`).
- **Overlays (palette, confirms, sheet)**: focus trap + return to trigger; the P04 confirms read their consequence before the commit button in tab order.

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (console chrome RTL default; member names; tier names) · pure-English render (locale-flipped chrome; en-locale members) · mixed strings (an en-locale member name inside Arabic chrome; "wrd-pass-K7M2QA" tokens and short codes LTR-isolated in RTL; Arabic tier names inside the English pass face) · numeral rendering under the Western policy (stamp counts "6 من 8", times, phone hints — never Arabic-Indic in system chrome, never mixed systems mid-sentence) · embedded Latin tokens in RTL (short codes, artifact ids) · tables/grids (audit ledger, members table) column order mirrored with alignment rules held · the stamp-dot fill order mirrors (inline-start → inline-end per direction — the card's progress direction follows the reading direction, P24-adjacent clock logic) · forms (label/input alignment, error placement on the correct inline edge) · truncation at 320px container with worst-case joined-word tier names · 400% zoom reflow in one dimension on S2/S5/S7 · bidi isolation on all member-entered strings. Seeded fixtures (07c: ساره/سارة pair, M-1002 en-locale name in Arabic chrome, C-2's bilingual tier ladder) are the regression set.

## Reduced-motion contract (motion-language §5)

The Stamp Landing degrades to a ≤2-step opacity fill + the polite count announcement (identical information, zero motion dependency); the card sheet settles without transition; confirms and toasts appear without movement; skeletons remain (geometry, not motion); the undo countdown is text, not animation. Every animated state change has a perceivable non-motion equivalent — the reduced-motion pass is part of the release matrix (a11y-baseline §8.6) and a failure here blocks release.
