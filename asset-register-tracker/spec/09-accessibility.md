# 09 — Accessibility: asset-register-tracker

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1: both directions, 200% + 400% zoom, 1280px + 360px viewports). This product carries a **legal/audit-adjacent obligation set** (a11y-baseline §7): attestation flows (custody signatures) preserve focus order, timestamps are announced with the action, and the activity log / custody timeline are keyboard-navigable and exportable.

## Keyboard map (critical paths)

- **CP-1 (register → label → apply)**: registry grid follows P18 — arrows move cell focus (inline-end arrow = next item in both directions, physical mapping stable per rtl-rules §4); Enter activates inline edit (P06, Escape restores, Tab commits-and-advances, never trapped); Space toggles row selection; bulk label request from the action bar (P07) is a single target. Label request dialog: size/layout as radio groups, focus-trapped with return. Batch screen: checklist rows tab-navigable; "mark applied" per row is a button target (keyboard path equal to the scan path — scanning is an enhancement, never the only route).
- **CP-2 (hand-off with signature)**: person picker is a combobox with list navigation and inline-create (Enter on "add new person" opens the two-field mini-form, focus moves there, Escape returns to the picker); signature block: typed-name input is the first focusable and the default path; drawn-mark canvas exposes a "sign by keyboard" toggle (drawing is never the only path — 2.5.7 spirit for pointer-centric capture); the confirm action announces the full event summary assertively before commit (the attestation moment); Escape anywhere before commit cancels with nothing recorded (no half-signed states).
- **CP-3 (scan lookup)**: camera view announces decode status politely ("scanning… hold the code steady"); manual tag entry is an equal first-class field on the same screen (`inputmode` numeric per ux-guidelines 63); asset card actions are buttons in reading order; wrong-asset escape: the card's prominent tag/serial block is announced first so mis-scans are caught before action.
- **CP-4 (registry table & timeline)**: grid per P18/P19 (virtualization never moves focus; focus moves scroll into view; row-count context on region entry); timeline events tab-navigable in reading order (chain order = seq, mirrored in RTL); correction events expose their reference link with its target announced; filters are chips with accessible descriptions of each predicate (P08); ⌘K palette: modified-key shortcuts only (Arabic layout safe, a11y-baseline §3).
- **CP-5 (walk, retirement, export)**: walk mode progress announced politely per sighting ("sighted AST-0107 — 14 of 31 expected"); retirement dialog: focus order runs identity → method → references → the type-to-confirm field (P04 level 3); export scope form validates on submit with error summary focusing the first error.

## Announcement schedule

| Event | Mode | Copy shape |
|---|---|---|
| Label batch progress | polite | "Generating labels — 23 of 60." |
| Label applied | polite | "AST-0107 label applied — the register now lists it active." |
| Custody event recorded | assertive | the attestation summary: kind, parties, signature signer + method + timestamp |
| Correction recorded | assertive | "Correction recorded — event 4 of AST-0107 referenced; the chain is unchanged, the correction is appended." |
| Return-pending transition (derived, on view) | polite | "3 assets are past their return date in this view." |
| Scan decode | polite | "Scanning…" → result or "no code found — enter the tag manually" |
| Sighting recorded (walk) | polite | "Sighted AST-0107 — 14 of 31 expected at Storeroom 3-B." |
| Retirement recorded | assertive | "AST-0301 retired — destroyed, certificate SHRD-2026-0117. The record is frozen, not deleted." |
| Export ready | polite | "Register export ready — CSV, custody history included, expires in 7 days." |
| Offline queue state (P20) | polite | "1 hand-off waiting to sync — it will send when you're back online." |
| Never announced | — | decorative layout shifts, virtualization row churn, per-keystroke search results (announce result count on pause) |

## Per-surface checklist

- Custody state and label state are icon+text+color — never color alone (ux-guidelines 37); the custody-state palette contracts declared in 05.
- S1 registry grid: sticky header never obscures focused rows (2.4.11 — focus scroll-margin is a token obligation); targets ≥24×24 with row-height comfort at density B (2.5.8); 360px collapse to stacked cards (ux-guidelines 71), each card carrying the full state set.
- S2 asset detail: timeline is a list semantically (ordered by seq); correction plum marker duplicated in text ("correction — references event 4"); retirement block announces method + certificate together.
- S3 label sheet preview: the screen-reader alternative is the batch checklist (equal information, text-first — QR cells are images with the tag as accessible name; a QR code is never the only carrier of identity).
- Signature surfaces: signer name typed field labeled persistently (hint text inside the field is never the label — §5 baseline); drawn canvas has text alternative (typed witness name mandatory); timestamps announced with the action (§7 baseline).
- M1 scan companion: one-thumb targets ≥24px (44px comfort); camera denied → manual entry is a visible equal path, never an error dead-end; queue states visible per offline item (P20).
- Forms: labels persist; validation on-blur-or-submit, inline and field-linked; error summary on submit focuses first error; P11 redundant-entry honored (quick-add recalls last category/location).
- 3.3.8: no cognitive-function auth tests anywhere (session model is provider-agnostic; paste never blocked).

## RTL/LTR verification matrix (per surface, both directions — bilingual-en product, both full citizens)

| Surface (S1–S9, M1) | Verified in LTR + RTL |
|---|---|
| S1 registry grid | column order mirrored; tag column LTR-isolated cells ("AST-0107" never reorders inside Arabic chrome); per-row name direction with paired-locale secondary line; numerals Western in both; truncation at 320px container with worst-case strings ("مستشارو التدقيق والحوكمة" class); 400% reflow to stacked cards |
| S2 asset detail + timeline | timeline mirrors (chain flows inline-start→inline-end in RTL); correction reference links across directions; signature seal mark position flips (inline-start edge); mixed-script names bidi-isolated |
| S3 labels | sheet preview is a print artifact (LTR physical sheet — declared and constant in both UI directions; the preview frame mirrors its UI chrome, the sheet itself does not); batch checklist fully mirrored |
| S4 people | person names at own direction (bidi isolation, `dir="auto"` on inputs); holding/return-pending counts Western numerals |
| S5 places & categories | location tree mirrors; tree expand chevrons flip; bilingual sibling fields side-by-side per P23 spirit |
| S6 activity / S7 jobs | log rows mirror; actor names isolated; timestamps per locale calendar display |
| S9 export | scope form mirrored; artifact list mirrored |
| M1 scan companion | full RTL flip when locale ar (navigation, cards, actions, progress); tag entry field LTR-isolated; one-thumb action placement flips to the inline-start thumb zone |
| Charts | none at v1 (no chart surfaces — counts live in text) |

Mixed-string fixtures: P-0007 "Daniel Whitfield" inside Arabic chrome; P-0002 "عبدالرحمن الشهري" inside English chrome; location "مركبة الخدمة ١" (Arabic-Indic digits in a *name*, while data numerals stay Western — the deliberate contrast fixture); tags with hyphens inside Arabic sentences (isolation marks authored per rtl-rules §2).
