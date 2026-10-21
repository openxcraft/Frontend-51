# 09 — Accessibility: clinic-appointment-desk

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-ar model — RTL default, LTR full citizen) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: "مستشارو التدقيق والحوكمة" class; clinic worst-case: "استشاريو الغدد الصماء والسكري" and the joined-word fixture "مسؤولو الاستقبال والتنسيق") · **Healthcare/PHI overlay obligations BINDING (a11y-baseline §7): health data never appears in page titles or URLs; validation errors do not echo answers; session screens carry a shoulder-surfing consideration (declared below).**

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search — alef/hamza variants, taa marbuta/heh, yaa forms, tashkeel stripped); ? opens shortcut help; skip-link to main; Tab order follows visual reading order per direction; focus ring = leaf-deep ≥2px at 7.46:1 change-contrast (05), 2.4.11 scroll-margin so the sticky day-summary bar never covers it; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class); every shortcut has a visible button/menu equivalent.
- **CP-1 (S2 booking)**: the finder is a combobox — type to filter, ↑/↓ walk results (grouped matched-name / matched-phone / create-new), Enter selects, ⌘V lands focus in the field from anywhere in the overlay; slot picker is a P18 grid — arrows move slots (physical mapping stable in both directions, rtl-rules §4), Enter books the focused slot, F opens the flag panel on the focused patient result; Esc cancels the overlay and returns focus to the trigger (trap-free, a11y-baseline §3).
- **CP-2 (S1 day board)**: P18 board grid — ↑/↓ move time rows within a provider column, ←/→ move provider columns (inline-end arrow = next column in both directions); Enter opens the appointment drawer for the focused block; C checks the focused patient in; N opens the no-show confirm, which names the consequence in full (P04 level 2 — generic consequence-free confirms are banned by copy-voice §2); M marks in-consult → complete path; K opens the fill panel when the focused slot is open.
- **CP-3 (S4 waitlist console)**: candidate rows are focusable listitems in rank order; ↑/↓ walk rows with score + inputs re-announced on focus; S sends the offer to the focused candidate; R records the phone outcome (dialog: outcome radio-group + script copy); O opens the out-of-rank override (reason field REQUIRED — 07b rule 5); G jumps to the next pending offer; countdown text updates politely, never per-second (announcement throttled to minute boundaries).
- **CP-4 (S5 messages)**: standard list navigation; Enter opens the message detail with reply-record action; B sends the next-day batch (confirm names the count — P04 level 2); the call-script copy action announces what was copied.
- **CP-5 (S7/S8/S9)**: schedule grids follow P18; policy fields are standard labeled inputs with on-blur-or-submit validation (a11y-baseline §5); the policy change confirm shows the DiffView with keyboard-verified old→new values; export actions are buttons with live-region job updates.

## Focus order rationale

Per surface, focus follows the working-day reading order: day summary → provider columns (inline-start column first) → appointment blocks (time order) → actions inline-end. In RTL the order mirrors wholesale; patient names inside blocks keep their own direction (bidi isolation — never interleave the two scripts in one tab run). The appointment drawer traps focus while open and returns to the invoking block (a11y-baseline §3); the booking overlay traps in dialog semantics with Esc restore.

## Announcement schedule (a11y-baseline §4 — polite unless justified)

| Event | Mode | Copy shape |
|---|---|---|
| Day-summary count delta (check-in, completion, refill) | polite | counts in text, Western numerals ("المؤكدون 9 من 18") — pairs with the visible bar |
| Check-in / consult-complete | polite | patient name + state change (names only — never reasons) |
| No-show declared | assertive | patient name + the consequence named (pattern count becomes N; slot open/closed for refill) — destructive-adjacent, warrants assertive |
| Fill proposal ready | polite | slot time + candidate count ("5 مرشحين، 4 مؤهلون") |
| Offer sent / accepted (Slot Refill moment) | polite | "تمت تعبئة الموعد من قائمة الانتظار" + remaining-entry count |
| Offer expiry countdown | polite, throttled to minute boundaries | minutes remaining as text |
| Ladder reply recorded | polite | outcome + appointment time |
| Validation errors (booking form, policy edits) | assertive | field-linked via described association; **errors never echo reason-for-visit or note text (PHI — a11y-baseline §7)** |
| Channel send failure | polite | failed message + retry/script next action (11 formula) |
| Autosave cycle (policy/template editors) | polite | saving → saved (fade) |

Decorative block recolors, drawer settle, skeleton swaps, and the Slot Refill's visual settle are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces — a11y-baseline §4). Page titles never carry patient data ("لوحة اليوم — عيادة روضة الخليج", never a patient name — §7).

## Per-surface WCAG 2.2 AA checklist

- **S1 DayBoard**: mixed-script names bidi-isolated (`dir="auto"` on name fields, isolate marks on interpolations); state chips icon+text+color (05 contracts — never color alone); flagged blocks carry the flag glyph at ≥24px target (2.5.8); >200 blocks virtualize per column with focus preservation and row-count context on region entry (P19); worst-case Arabic names truncate at word boundaries (no hyphenation — rtl-rules §4); 400% reflow — the board collapses to single-provider card list at 360px (Table Handling adoption, 05).
- **S2 Booking**: labels persist above fields (ghost text never the label); phone field autocomplete token declared (`tel`); required programmatic; duration-fit disclosure is SR-readable text; the flag panel lists dated states only (PHI: never reasons).
- **S3 Appointment drawer**: focus trap + return; timeline is an ordered list with state+actor+time as text; ladder steps icon+text; reason/staff note fields mask-on-blur is NOT needed here (staff-active surface) — the declared shoulder-surfing measure lives in S6 (below).
- **S4 Waitlist console**: candidate rows show every ranking input as text (the defensibility surface — score, tier, waited days, penalty); override reason field required programmatically; countdown text ≥ the same 24px target discipline; the offer card's soft-lift never carries meaning alone (state is text).
- **S5 Messages**: locale mark visible per row (ar/en as text); record-reply dialog radio-group semantics; failed rows carry retry as the first action.
- **S6 Patient view**: **shoulder-surfing measure declared (a11y-baseline §7): the phone number and note fields mask on blur by default (reveal-on-focus, announced)**; the flag panel (Maha's verify list) is a table with dated rows, keyboard-navigable, SR-readable; history rows carry states + dates only.
- **S7/S8 Schedule & policies**: session-hours editor is a grid with P18 discipline; self-overlap VALIDATION announced assertively and field-linked; policy DiffView meets text contrast contracts (deletions/insertions at ink strength — P16).
- **S9 Day sheet**: print stylesheet honors the same type scale and Western numerals; artifacts are minimum-facts (07a) so no clinical text can leak into print.
- **Forms (all)**: on-blur-or-submit validation; error summary focuses first error; paste never blocked (3.3.8 — phone paste is sacred at a reception desk).

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (board blocks, waitlist rows, policy text) · pure-English render (the full console under an en session) · mixed strings (Latin patient name "Ina Sharma" inside RTL board column; Arabic provider name inside an LTR session — bidi isolation proves out) · numeral rendering under the Western policy (times, durations, counts, phone numbers, countdowns — never Arabic-Indic in system chrome; storage canonical, display formatted per rtl-rules §3) · embedded Latin tokens in RTL context (provider codes like "CONS" inside Arabic labels — isolating containers) · tables/grids column order mirrored with alignment rules held (board columns mirror; time values never reorder) · day-summary Hijri↔Gregorian cross-reference rendering per direction (P24; Umm al-Qura presentation for KSA contexts disclosed per portfolio Q-5) · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings ("مسؤولو الاستقبال والتنسيق") · 400% zoom reflow in one dimension · bidi isolation on all user-entered strings (names, notes, search). Seeded fixtures (07c: P-008 Latin-only name in RTL board, P-013 shared-phone pair, hamza/taa-marbuta name variants) are the regression set.

## Reduced-motion contract (motion-language §5)

Calm personality, 200–320ms: under reduced-motion every transition renders as hard cuts or ≤2-step opacity changes — the Slot Refill settle becomes a 2-step opacity fill with the same announcement and count update (identical perceivability by construction); drawer and dialog transitions become instant reveals with focus handled identically; the offer countdown is text-only already (no motion carries information); no staggered reveals exist to collapse (calm forbids them). The release matrix (a11y-baseline §8.6) runs every CP in both directions with reduced-motion enabled.
