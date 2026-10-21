# 09 — Accessibility: halal-certification-tracker

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-ar model) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5 class, plus this product's own long joined-word cases: "مستشارو التدقيق والحوكمة", "أحادي وثنائي الجليسريدات", "شهادة المورّد منتهية الصلاحية"). This product carries the a11y-baseline §7 **legal/audit overlay obligations** (it is the register of record for an accredited body): timestamps are announced with their actions, the activity log is keyboard-navigable and exportable, and attestation-shaped flows (committee decisions) preserve focus order across the full dossier text.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search — alef/hamza variants, taa marbuta/heh, yaa forms); ? opens shortcut help; skip-link to main content; Tab order follows the visual reading order per active direction; focus ring = Itqan Forest ≥2px at 9.74:1 on canvas (2.4.13 area and change-contrast exceeded by construction), 2.4.11 scroll-margin so the sticky register header never covers it; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class, a11y-baseline §3); every shortcut has a visible button/menu equivalent.
- **CP-1 (S3 formulation editor)**: Tab walks formulation lines in reading order (mirrored in RTL); Enter opens the line's resolution drawer (P06 inline-edit — Esc restores, Tab commits+advances, focus returns to the triggering line, never trapped); ⌘V lands focus in the paste field from anywhere in the import dialog; line reorder via ⌘↑/⌘↓ (2.5.7 drag equivalent); E edits the focused line's function note in place.
- **CP-2 (S5 vault / S4 directory / impact)**: ↑/↓ navigate rows; ←/→ move between grid columns with physical mapping stable in both directions (rtl-rules §4); Space toggles row selection (P07 bulk where applicable); I opens the impact drill on the focused ingredient/supplier-cert row; Enter opens the detail drawer; drawer Esc returns focus to the row.
- **CP-3 (S3 decision dossier)**: R walks the dossier's read-only sections in document order (formulation → evidence → audit → decision form — the committee reads before ruling, 06 DecisionDossier obligation); the decision radio group is ↑/↓ + Space with visible labels; justification textarea has a persistent label; recording announces actor + action + timestamp assertively once (a11y-baseline §7).
- **CP-4 (S7 renewal console / S6 ladder)**: the digest is a semantic list — ↑/↓ walk rung rows grouped by zone; Enter opens the linked certificate; on S6 the ladder timeline is an arrow-navigable ordered list with rung state announced as text ("درجة التقديم — فائتة، تاريخ 5 يناير 2027"); G jumps to the next missed rung; O opens the renewal case from the focused certificate.
- **CP-5 (S1 register)**: P18 grid — ↑/↓ rows, ←/→ columns, range selection with Shift; Enter opens certificate detail; S suspends (confirm dialog names consequence, P04 level 2); the activity log (S9) is a keyboard-navigable table with row-date announced on focus; exports via visible buttons only.

## Focus order rationale

Per surface, focus follows the register's accountability reading order: identity (certificate/applicant name) → state (zone/status) → evidence (ladder/rungs) → action. In RTL the order mirrors wholesale; the dossier's read-then-rule order is direction-invariant (reading the evidence before the decision form is the same obligation in both directions — the legal/audit focus contract).

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Import job progress | polite | rows done of total, named directory |
| Formulation autosave | polite | "جارٍ الحفظ…" → "حُفظ" (fade) |
| Line resolution change | polite | ingredient name + new state (text, never color) |
| Impact result ready | polite | severity + counts in text first ("٣ شهادات متأثرة" — Western numerals per ledger: "3 certificates affected") |
| Rung state change (incl. the rung settle) | polite | rung label + new state, simultaneous with the motion |
| Issuance refused (gate) | assertive | the named unresolved lines (field-linked via described association) |
| Decision recorded | assertive once | actor + outcome + timestamp (a11y-baseline §7) |
| Certificate issued / suspended / withdrawn | assertive once | number + new status + actor |
| Validation errors (all forms) | assertive | message + field link; error summary focuses first error on submit |
| Export ready / artifact expired | polite | format + expiry window |
| Register list staleness (NETWORK) | polite | banner text, paired with visible banner |

Decorative occlusion shadows, zone recolors, stagger reveals, and the certificate-document settle are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces — a11y-baseline §4).

## Per-surface WCAG 2.2 AA checklist

- **S1 RegisterGrid**: zone chips icon+text+color (05 status palette; never color alone); mixed-script applicant names bidi-isolated (`dir="auto"` on authoring inputs, isolate marks on interpolated display — rtl-rules §2); Western numerals, tabular figures (Newsreader `tabular-nums` binding, 05); >200 rows virtualize with focus preservation + row-count context on region entry (P19); targets ≥24×24; suspended rows expose reason on focus AND hover (keyboard parity); 400% reflow — grid collapses to cards at 360px.
- **S3 FormulationEditor + decision dossier**: labels persist above fields (ghost text never the label — a11y-baseline §5); on-blur-or-submit validation with field-linked messages; haram lines render a named blocking chip (not just red); dossier is a readable region with landmarks; autocomplete tokens off on committee names (no personal-data echo, a11y-baseline §5); justification required on reject — programmatic, not asterisk-only.
- **S6 LadderTimeline**: rungs are list items with state text; the rung settle's motion is accompanied by simultaneous text change (never motion-only); missed rungs announced on detail entry; dates Western numerals; timeline order mirrors in RTL with the reading-direction arrow flipped (06 icon decisions).
- **S7 RenewalDigest**: zone groups announce counts; empty zones render their own line ("no certificates due this month" — information, not absence); each row is a link with descriptive text (certificate number + rung label), not a bare colored row.
- **S4 IngredientDirectory / S5 vault**: search input has persistent label + the normalization disclosure reachable from the empty-of-results state; status chips icon+text+color; expiring/expired states distinguished by glyph (clock vs clock-slash), not hue distance alone (color-vision safety — the two-step amber contract in 05 exists for exactly this).
- **S8 PolicyLadderEditor**: owner-role gating surfaced as text (viewer sees the PERMISSION copy, not a disabled mystery); non-monotonic offsets announce the offending rung; the impact preview is text-first.
- **S9 Activity log**: keyboard-navigable table; row timestamps announced with the action (§7 obligation); exportable via the register export; actor names bilingual, per-side direction.
- **Overlays (dialogs, palette, drawers)**: focus trap + return to trigger (a11y-baseline §3); palette results grouped and keyboard-selectable (P05); the import paste dialog lands ⌘V focus by design.

## RTL/LTR verification matrix (per surface, both directions — the bilingual-ar floor)

Pure-Arabic render (register rows, ingredient names, dossier text) · pure-English render (export-facing chrome after locale flip) · mixed strings (Latin certificate numbers "HCT-2026-0118" and E-codes "E441" inside Arabic sentences; Arabic applicant names inside English chrome — bidi isolation proves out, never ambient-direction sorting) · numeral rendering under the Western policy (dates, days-to-expiry, rung offsets, counts — never mixed systems mid-sentence) · embedded Latin tokens in RTL and Arabic tokens in LTR (isolating containers) · tables/grids column order mirrored with alignment rules held (register grid mirrors; numeric columns keep inline-end alignment) · ladder timeline order + stage-ladder direction mirrored; certificate-seal and status glyphs never mirrored · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings ("أحادي وثنائي الجليسريدات") breaking at word boundaries (no hyphenation exists — rtl-rules §4) · 400% zoom reflow in one dimension on both viewport widths · bidi isolation on all user-entered strings (applicant names, auditor names, justification text). Seeded fixtures (07c: جيلاتين variant merge, HCT numbers in Arabic rows, the bilingual applicant set) are the regression set.

## Reduced-motion contract (motion-language §5)

Stately surfaces degrade first: the rung settle collapses to an instant state chip + polite announcement (the information is the announcement, never the travel); staggered register reveals render simultaneously; the certificate-document settle becomes a 2-step opacity (≤2 steps); route changes hard-cut; modal scale-fade becomes fade-only. Every animated state change retains a perceivable non-motion equivalent — zone changes, rung states, issuance, and status transitions all carry text+glyph changes independent of motion. The release testing matrix (a11y-baseline §8) runs items 1–6 with reduced-motion enabled, both directions, on this product's worst-case strings above.
