# 09 — Accessibility: kpi-alert-watch

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-en model, Arabic full citizen) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5 class — e.g. "معدل إتمام الطلبات المؤكدة عند الاستلام" as a feed name, "نسبة رفض الدفع عند الاستلام" as a digest section header) for truncation/reflow.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search — alef/taa-marbouta/yaa normalization per rtl-rules §4); ? opens shortcut help; skip-link to main content; Tab order follows the visual reading order per direction; focus ring = Tanbih Magenta-Plum ≥2px with 3.93:1-on-canvas / 4.28:1-on-white change-contrast and 2.4.11 scroll-margin so sticky headers (the triage filter bar, the digest's page-class banner) never cover it; global shortcuts are modified chords, while the list/grid-context single keys named in the CP map below (J/K item traversal, A/D/S status actions, N narration, X acknowledge, B/R/P editor keys) bind by PHYSICAL key position (event.code) so Arabic keyboard layouts keep the physical mapping stable (rtl-rules §4) — the layout-conflict note of a11y-baseline §3 declared rather than avoided (the sales-cohort-view resolution); every shortcut has a visible button/menu equivalent.
- **CP-1 (S2 feed workspace + S3 watch editor)**: P18 grid — ↑/↓ move series points, ←/→ move table columns (physical mapping stable in both directions, rtl-rules §4); Enter opens the point inspector (observed/expected/deviation, announced); ⌘V lands focus in the paste field from anywhere in the ingest dialog; in the watch editor: Tab walks band inputs in order (warning edge → critical edge → sustained → tier), B adds the anomaly layer (P09 progressive disclosure), R runs the backtest preview (result announced politely with the count).
- **CP-2 (S6 digest + S5 detection detail)**: the digest document is a semantic article — J/K move between digest items (reading order follows the active language section's direction); Enter opens the item's detection detail (deep link, focus lands on the explanation card heading, return path preserved); A acknowledges from the row, D opens the dismissal dialog, S opens the snooze dialog; N runs the narration assist on the open detection (provenance change announced politely); Esc returns from detail to the digest position that launched it (trap-free, focus to trigger).
- **CP-3 (S3 policy editor)**: sensitivity slider is arrow-key operable (↑/↓ 0.1σ steps) with value changes announced politely ("2.5 sigma — about one detection per month at this feed's history" class readings); ⌘↑/⌘↓ reorder nothing (no drag surfaces in the editor); P opens the tier ladder (radio group semantics, ↑/↓ + Space); the backtest result region is focusable with counts as text.
- **CP-4 (S7 season calendar)**: list navigation (standard); Enter opens the upsert dialog; the season strip is decorative-adjacent — its state is always available as text in the list (never strip-only).
- **CP-5 (S1/S4 triage)**: ↑/↓ move detection rows; Space toggles row selection (P07 bulk); X acknowledges the focused row; the bulk action bar is reachable with one Tab from the last selected row and names the count.

## Focus order rationale

Per surface, focus follows the triage reading order: page-class banner (if present) → open-detection queue → feed-health strip → secondary navigation. In RTL the order mirrors. Within the digest document, focus follows the ACTIVE language section first, then the second language section — never interleaved (the bilingual pair is two complete documents, not a zipped list; comparison semantics are preserved for SR users the same way P23 preserves authoring columns).

## Live-region announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Detection arrival (queue insert) | polite | feed name + observed vs baseline + tier — the same numbers the row shows ("متوسط زمن التوصيل 37.2 minutes against a Thursday baseline of 32.6 — digest-class") |
| Page-class arrival | assertive — justified: page-class is the product's only interrupt tier; an interrupt that is not announced assertively is a silent page, and the visible banner is its twin (live regions pair with visible surfaces) | feed name + critical band + observed |
| Backtest result | polite | count + season intersections + journal overlap, as text |
| Digest assembled / quiet day | polite | counts or the quiet-day sentence |
| Status change (ack/dismiss/snooze) | polite | detection id-free name (feed + date) + outcome; dismissal includes the recorded reason |
| Snooze expiry resumption | polite | "Watching resumed after snooze" + feed name |
| Narration provenance change | polite | "Narration: template" / "Narration: assist" — the provenance itself is announced because it is information |
| Validation errors (snooze without reason, malformed rows, sub-minimum series) | assertive | field-linked via described association |
| Job progress (ingest/sync/evaluation) | polite | units ("89 of 89 points", "watch 3 of 5") |
| Autosave-equivalent (preferences) | polite | saving → saved (fade) |

Decorative layout shifts, band shading, and the arrival micro-interaction's motion are NEVER announced; every state change has a visible text equivalent (a11y-baseline §4). Streaming narration announces start and completion with a word count, never per-token (ai-native-patterns §2).

## Per-surface WCAG 2.2 AA checklist

- **S1 console home**: page-class banner uses critical red as a rule line + icon + text (never color alone; ≤5% discipline); detection rows are list items with row-count context on region entry; feed-health chips carry text states; targets ≥24×24 (2.5.8).
- **S2 feed workspace**: series chart carries its data-table alternative (per-point observed/expected/deviation rows — the SR path to the same arithmetic); band edges render their numbers in text in the legend; point inspector is keyboard-reachable (Enter) and SR-readable; mixed-script rows bidi-isolated (`dir="auto"` on inputs, isolate marks on interpolations — rtl-rules §2); invalid-point gaps announced in the table alternative as "no value — invalid row".
- **S3 watch editor**: labels persist above fields (ghost text never the label — a11y-baseline §5); sensitivity slider has programmatically-associated value text; page-class opt-in shows the interrupt-cost sentence as part of the field's description; errors on-blur-or-submit, summary focuses first error.
- **S4 triage list**: virtualized >200 rows with focus preservation (P19); bulk action bar names the count and scopes every action (P07); filter chips carry accessible predicate descriptions (P08).
- **S5 detection detail**: the explanation card's two language blocks are separate regions with language tags (`lang="en"` / `lang="ar"` — correct SR pronunciation per script); number slots are emphasized text inside the sentence (not images, not color); narration section heading announces provenance; snooze dialog's reason field is required programmatically; dismissal dialog's reason-code radio group has visible labels.
- **S6 digest view**: document semantics (article/section headings per feed); page-class section precedes digest-class sections in BOTH language sections (the hierarchy is identical in both); quiet-day state is a text sentence with the feed-health summary; delivery-state chips are icon+text.
- **S7 season calendar**: the strip is never the only state carrier (list text mirrors it); upsert dialog dates are text inputs with declared format; overlapping windows both listed.
- **S9 settings**: tier ladder is a radio group with visible labels; consent state renders capability language (credential-contract §2); the baseline disclosure is a readable region (not a tooltip).
- **Overlays (dialogs, palette)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05); Esc closes returning focus.

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (explanation sentences, digest sections, feed names) · pure-English render · mixed strings (Latin metric names inside Arabic digest sections; Arabic feed names inside English chrome — bidi isolation proves out on both) · numeral rendering under the Western policy (observed values, baselines, σ, counts, dates — identical digits in both directions; alignment inline-end in data columns) · embedded Latin tokens in RTL context (units "minutes", "SAR" inside Arabic sentences — isolated marks) · tables/grids column order mirrored with alignment rules held · series chart axis direction (RTL charts run right-to-left, value axis on the inline-end) with band-edge numbers in the legend both directions · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings ("نسبة رفض الدفع عند الاستلام" class) breaking at word boundaries (no hyphenation exists) · 400% zoom reflow in one dimension · bidi isolation on all user-generated strings (dismissal notes, snooze reasons). Seeded fixtures (07c: the bilingual feed-name pairs, the DG3 season note, dismissal notes authored in English by Arabic-locale members) are the regression set for both directions.

## Reduced-motion contract (motion-language §5)

"The Explained Arrival" (the single signature micro-interaction) collapses to an instant row render + the polite announcement carrying the same numbers — identical perceivability by construction. Route changes become hard cuts; the digest document renders fully settled (no stagger); series-band transitions are already opacity-only (≤2 steps); the energetic overshoot is unreachable under reduced motion (the state chip and text carry the arrival). The release matrix (a11y-baseline §8.6) runs every critical path with reduced-motion enabled: every state change remains perceivable — motion never carried information in this product, so removing it removes nothing.
