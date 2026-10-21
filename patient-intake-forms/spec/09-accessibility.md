# 09 — Accessibility: patient-intake-forms

SME-F pass · WCAG 2.2 AA floor (a11y-baseline), both directions, 1280px and 360px viewports, 200%/400% zoom. The product's structural a11y problem is also its identity: **a clinical form answered by an anxious, possibly low-vision, Arabic-first patient on a phone** — solved below as the fill-surface contract — plus the **PHI overlay** (a11y-baseline §7 healthcare/PHI: health data never in page titles or URLs; validation errors do not echo answers; shoulder-surfing consideration declared).

## Keyboard map (critical paths; no raw-letter shortcuts — Arabic-layout conflict class, a11y-baseline §3)

| Surface / path | Keys | Behavior |
|---|---|---|
| Global (staff console) | ⌘K / Ctrl+K | Command palette: bilingual normalized search (rtl-rules §4) over forms, submissions, terms, jump-to-question in the open builder; recent items (P05) |
| S1 forms library · S5 submissions console | ↑/↓ · Enter · / | Row traversal (P18); open item; focus search; filter chips removable with Delete (P08); ⌘A select-all + bulk action bar (P07) |
| S2 builder | Tab · ⌘S · ⌘Enter · Alt+↑/↓ | Field palette traversal; ⌘S saves draft (P10 indicator); ⌘Enter publishes from the gate panel; Alt+↑/↓ moves the focused field within its section (drag-reorder's keyboard equivalent — WCAG 2.5.7) |
| S6 review workspace | ↑/↓ · Enter · Space · ⌘Enter | Normalization-panel rows: ↑/↓ traverse; Enter opens confirm/correct; Space toggles the escalation checkbox; ⌘Enter marks reviewed (disabled with reason while confirmations pend — the gate is keyboard-honest) |
| S7 vocabulary manager | Tab · ⌘S · ⌘Enter | Field order canonical-ar → canonical-en → variants → urgent → note; blur validation (skill row 56); Escape cancels the row edit |
| **S8 patient fill surface** | Tab · ↑/↓ · Enter · Space · Escape | The flow contract: Tab/↑/↓ move between the question card's controls in reading order; Enter advances (equivalent of the Next button — always a visible button too); Space selects radio/checkbox options; Escape in an edited symptom entry cancels the edit and restores (P06); Back is always a visible button (a patient never depends on hidden gestures); NO shortcuts exist at all — this surface is used once, not learned |
| S8 symptom input | typing · ↑/↓ · Enter | Chips are focusable: ↑/↓ move through suggestions; Enter accepts the focused chip (dictionary modes only — assist chips accept as "attach suggestion for staff review", stated in the chip's accessible description); typing never traps focus |
| Dialogs / print preview | Tab · Escape | Trap-free with focus return to trigger (a11y-baseline §3); 2.4.11 scroll-margin so sticky bars never cover focus |

Focus-visible is the sage-deep ring at 2.4.13 strength (≥2px, ≥3:1 change-contrast — sage-deep on canvas is 7.40:1) on every interactive element, both shells. Every shortcut has a visible button equivalent; the fill surface carries zero shortcuts by design.

## Focus-order & direction contracts

**Fill surface (S8)**: reading order = progress spine → question card (label → help → input → chips region) → back/next controls — in the patient's locale direction (RTL-first). The spine sits inline-start and mirrors; question cards slide along the reading axis on advance (inline-start reveal in RTL). One question per screen means focus order IS the flow — no tab traps, no off-screen focus (P09's purest form). On resume, focus lands on the exact `currentFieldId` question (P11) — announced as recalled, not re-asked.

**Review workspace (S6)**: answers region → normalization panel → flags → review gate, in the console's active direction, while **each free-text answer renders at its own direction** (dir="auto", bidi-isolated — the answer-direction contract, 05) with the canonical pair beside it; mixed-script answers (seeded Latin drug names inside Arabic text — 07c fixtures) render isolated so punctuation stays put (rtl-rules §2). Region labels announce language ("إجابة المريض — العربية" / "Patient answer — Arabic") so screen-reader users hear the script switch before the content.

**Builder (S2)**: palette → canvas → inspector in console direction; the bilingual inspector's pair rows render per-side direction with alignment links (P23); Tab order follows the pair row, not the visual column.

## Live-region announcement schedule

| Event | Mode | Copy shape (PHI rule: labels + counts, NEVER answer text) |
|---|---|---|
| Fill-surface autosave | polite | "محفوظة تلقائياً" / "Autosaved" (P10) |
| Question advanced | polite | question label + position ("السؤال 5 من 18 — التاريخ الطبي") |
| Suggestion chips available | polite | "تتوفر 3 مطابقات من المسرد" / "3 vocabulary matches available" — terms named only when the patient focuses a chip, never en masse into a waiting room |
| Chip accepted | polite | "أُضيف مصطلح: صداع — صداع" pair + mode |
| Required-field advance block | assertive | the question LABEL + "هذا السؤال مطلوب" / "This question is required" — never the attempted value (a11y-baseline §7) |
| Submit validation summary | assertive | "أجب عن 3 أسئلة مطلوبة — أولها: تاريخ الميلاد" / "3 required questions remain — first: date of birth" + focus moves to the first error (a11y-baseline §5) |
| Submit success (the Calm Hand-off) | polite | section counts only ("قُبلت استمارتك — 4 أقسام، 18 إجابة") / "Intake received — 4 sections, 18 answers" |
| Session near expiry | assertive | expiry honesty + "keep my place" action (extends once) |
| Staff: match confirmed / corrected | polite | "أُكّدت المطابقة — صداع" (canonical pair, never the raw text in toasts) |
| Staff: urgent flag arrives | assertive (ONCE) | "إشارة عاجلة: ضيق التنفس — 1 مصطلح" / "Urgent flag: shortness of breath — 1 term" (canonical pair + count) |
| Staff: review gate blocked | polite | "مطابقتان قيد التأكيد تعترضان المراجعة" / "2 pending confirmations block review" |
| Import/export progress | polite | determinate units only — "استيراد المصطلحات — السطر 17 من 36" (async-contract §3) |
| Validation (builder/vocabulary) | assertive | field-linked message; error summary focuses first error on save (a11y-baseline §5) |

Live regions pair with visible equivalents — every announcement above has a visible surface (autosave chip, spine position, chip region, gate bar, banner, toast) per a11y-baseline §4. Toast text never contains answer content or patient identifiers (counts and canonical pairs only).

## PHI & privacy posture (a11y-baseline §7 healthcare overlay — declared, not aspired)

- **No PHI in page titles or URLs**: fill URLs carry the opaque fill token only (`/f/{token}`); staff routes are workspace-scoped ids; document title renders the form title, never patient names.
- **Validation errors never echo answers** — error copy names fields and rules (07b rule 6, typed).
- **Announcements and toasts carry labels/counts/pairs, never answer text** (schedule above) — the waiting-room screen-reader privacy rule.
- **Shoulder-surfing posture (declared)**: the review console is a full-fidelity work surface by default (reviewers ARE the job — 02 Tariq); mask-on-blur is NOT defaulted at v1. The declared mitigations: no PHI in titles/URLs/toasts, queue rows carry counts not content, print exports offer an optional answer-masking mode for hand-offs, and the console's density targets a desk-facing screen. A blur-on-idle shoulder-surfing mode is recorded as an owner question (12 Q-12), not a silent default — mirroring kyc-onboarding-flow's Q-15 record posture.
- **Autocomplete tokens** declared for contact fields (tel / email per a11y-baseline §5); paste is never blocked (3.3.8).

## Per-surface WCAG 2.2 AA checklist

- **S8 fill surface (the hard one)**: 400% zoom reflow with worst-case Arabic strings ("مستشارو التدقيق والحوكمة" class — rtl-rules §5) in question labels and symptom entries; single-column reflow at 320px container; truncation breaks at word boundaries only (Arabic hyphenation does not exist); mixed-script input bidi-isolated (`dir="auto"` on inputs, isolate marks on interpolations); labels persistent above inputs — placeholders structurally absent (05/06, NN/g S8); required marks programmatic (`aria-required` + visible mark); targets ≥24×24 with the chip row's spacing documented; Arabic body 1.7 line-height with tashkeel-bearing seeded content reserving ≥1.8 (rtl-rules §3); pain-scale values in Western numerals with text alternatives ("7 من 10").
- **S6 review workspace**: normalization panel rows are definition-list semantics (mode + pair + status as text, never color alone — the indigo/caution/ink mode chips carry text labels); urgent banner announces once; answer regions language-labeled; 400% reflow stacks answer/panel panes.
- **S2 builder**: drag-reorder has Alt+↑/↓ equivalent (2.5.7); the publish-gate gap list is keyboard-traversable with jump links; bilingual pair rows keep 4.5:1 on both render directions (05 contracts).
- **S1/S4/S5/S7/S9/S10 lists & consoles**: virtualization preserves focus (P19); filtered states declare themselves (P08); four empties distinct per P01 (11); JobRow states keyboard-complete; QR renders ≥4:1 against its quiet zone and is never the only path (the read-aloud link is its equivalent).
- **Print exports**: bilingual per-page direction; answer-masking option; contrast survives grayscale (the one-step surface difference rule — 05).

## RTL/LTR verification matrix (per surface, both console directions, both patient locales)

For each of S1–S10 and the fill surface, both directions: pure-Arabic render · pure-English render · mixed strings (Latin drug names inside Arabic symptom answers — seeded `sub-002` fixtures) · numeral rendering under Western policy inside Arabic chrome (dates, counts, pain scales — physical order stable in both directions, rtl-rules §4) · embedded Latin/numeric tokens in RTL · tables/grids mirrored (submissions queue, vocabulary list) with alignment held · forms (builder inspector label/error placement on the correct inline edge; fill-surface error placement inline-end of the question label in RTL) · truncation at 320px with worst-case strings · 400% zoom reflow · bidi isolation on user-generated content (symptom raw text above all). **Patient-locale fixtures run both ways**: Arabic-first fill (`sub-001`/`sub-002`) and an English-locale fill fixture; the review console renders Arabic answers inside English chrome and the reverse (the answer-direction contract verified in all four combinations).

## Reduced-motion contract (motion-language §5)

Crossfades → hard cuts; question slides → instant advance + position announcement; suggestion chips → instant render + polite "N matches available"; the Calm Hand-off settle → simultaneous render + the full-counts announcement (the signature's information is fully redundant with text — 05); the review-gate settle → instant chip + announcement. All state changes remain perceivable by construction — the announcement schedule IS the reduced-motion equivalent of every animated transition. Stagger never exceeds 60ms anywhere and collapses to 0 under reduced motion.
