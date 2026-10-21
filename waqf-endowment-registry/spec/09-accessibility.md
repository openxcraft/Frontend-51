# 09 — Accessibility: waqf-endowment-registry

SME-F pass · WCAG 2.2 AA floor (a11y-baseline §1) · both directions (bilingual-ar model — RTL Arabic-first default, LTR English full citizen) · 1280px and 360px · 200% and 400% zoom · worst-case Arabic strings (rtl-rules §5: "مستشارو التدقيق والحوكمة" class — deed purposes and beneficiary names carry joined-word worst cases). **Family overlay applied: legal/audit (a11y-baseline §7)** — this is a governed-record product: attestation flows (distribution commit, report seal) preserve focus order across the attestation text, timestamps are announced with the action, and the activity log (P17) is keyboard-navigable and exportable.

## Keyboard map (critical paths)

- **Global**: ⌘K/Ctrl+K command palette (P05, bilingual normalized search — alef/hamza variants, taa marbuta, yaa forms); ? opens shortcut help; skip-link to main content; Tab order follows the visual reading order per direction; focus ring = Waqf Garnet ≥2px, 8.20:1 on canvas, 2.4.11 scroll-margin so sticky headers never cover it; all shortcuts are modified chords (no raw letters — Arabic-layout conflict class, a11y-baseline §3); every shortcut has a visible button/menu equivalent.
- **CP-1 (S2 deed panel, S3 assets, S4 beneficiaries)**: P18 grids — ↑/↓ move rows, ←/→ move cells (physical mapping stable in both directions, rtl-rules §4); the ShareEditor fraction cells (numerator/denominator) are separate tab stops with live sum-meter announcements (polite); Enter opens the edit surface on the focused row (P06 inline edit — Esc restores, Tab commits+advances); the activation gate's missing-side marks are links that focus the exact bilingual field.
- **CP-2 (S5 ledger)**: P18 grid on the entry browser; E opens the EvidenceDrawer on the focused entry; R opens the reversal dialog (reason field auto-focused, the reversal names the entry and its amount — never a bare confirm); I opens the inflow dialog; X opens the expense dialog; import action is a labeled button (never hotkey-only); seq is announced per row ("entry 214, inflow, October").
- **CP-3 (S6 worksheet)**: Tab walks the totals band then the lines in reading order; each line's derivation row is a tab stop (SR-readable arithmetic); H holds the focused line (reason field required — focus lands in it); A adjusts (amount + reason fields); Enter on the review summary opens the attestation step; the attestation text is traversed in full before the commit control is reachable (a11y-baseline §7 legal/audit overlay — attestation is read, not scrolled past); commit announces assertively on validation failure and politely on success with the line count.
- **CP-4 (S7 reports)**: the report view is a structured document — headings per section, figures as tabular data; V opens the variance compare (DiffView, direction-aware); S seals (the confirm names the pin: "seal and pin to seq 214" — a single explicit action, no ladder needed since sealing is one-way and named); export opens the format menu; the seal state is announced politely with timestamp.
- **CP-5 (S1 registry, S9 activity)**: standard list navigation; the period digest is a navigable region with per-endowment balance cells; the activity log rows carry action/actor/timestamp as text in one row (never column-fragmented announcements); log export is a visible button.

## Focus order rationale

Per surface, focus follows the registrar's reading order: identity (deed/title) → the record (entries/lines) → the action (inline-end). In RTL the order mirrors. The worksheet's order is deliberate: totals before lines (the reader meets the arithmetic's inputs first), derivation before controls (the number before the action that changes it) — the same order a reviewer reads a paper worksheet.

## Announcement schedule (a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Entry recorded (inflow/expense) | polite | kind, amount, period, seq ("inflow 2,400,000 riyals recorded — entry 215") |
| Reversal appended | assertive | the reversed entry's seq + the reason ("entry 212 reversed — duplicate receipt, per your reason") |
| Allocation run done | polite | totals summary — distributable, line count, held count |
| Line held / adjusted | polite | beneficiary + share + reason |
| Distribution committed | polite | line count + attestation actor + timestamp |
| Delivery recorded | polite | beneficiary + method + date |
| Report generated | polite | period, kind, state (draft) |
| **Report sealed** | polite | "Report sealed — pinned to entry 214, 3 Nov 2026" (with the visible seal mark + timestamp pair) |
| Validation errors (share overflow, missing reason, one-script gates) | assertive | field/row-linked via described association |
| Export ready / artifact expired | polite | format + expiry window |
| Autosave cycle (policy/deed edits) | polite | saving → saved (fade) |

Decorative layout shifts, the seal settle's motion phase, and row stagger are NEVER announced; every state change has a visible text equivalent (live regions pair with visible surfaces — a11y-baseline §4).

## Per-surface WCAG 2.2 AA checklist

- **S5 LedgerBook**: tabular numerals right/inline-end aligned per direction; >200 entries virtualize with focus preservation (P19); row-count context on region entry; kind is glyph+text (never color alone); the reversal mark on a reversed entry is icon+text ("reversed — see entry 219"); evidence drawer is keyboard-reachable and traps-free (focus returns to the row); targets ≥24×24 (2.5.8).
- **S6 AllocationWorksheet**: the derivation row ("3/24 × 3,504,000 = 438,000" — share × distributable) is text, tab-reachable, SR-readable; held/adjusted lines show computed-vs-adjusted side by side with the reason as text; the stale-inputs banner is a live region; the commit control names its consequence ("Record distribution — 9 lines, 1 held"); the attestation step preserves focus across the attestation text (overlay obligation).
- **S7 TransparencyReportView**: every figure sits in a semantic table or a labeled figure; ratios render their division as text; the seal state is mark + timestamp + pin line (never the mark alone); draft watermark is text; variance compare is direction-aware (P16); the document surface at 400% reflows as a single column (one-dimension scroll).
- **S4 ShareEditor**: the sum meter is a live region announcing overflow/underflow with the fraction spoken ("shares sum to 25/24 — the deed's whole is exceeded by 1/24"); fraction cells accept typed numerators/denominators (Western numerals in the data surface); share changes never commit silently (the meter is advisory, the gate is at save).
- **Forms (deed, policy, entry dialogs)**: labels persist above fields (ghost text is never the label); on-blur-or-submit validation with field-linked messages; error summary focuses the first error; bilingual fields are two labeled inputs (AR label + EN label), never one field with a script guess.
- **Overlays (dialogs, palette, attestation)**: focus trap + return to trigger; palette results grouped and keyboard-selectable (P05).
- **3.3.7 Redundant Entry**: evidence notes for a repeated receipt pattern recall the last-used bilingual pair; period pre-fills from the ledger context; beneficiary class pre-fills from the endowment's dominant class.

## RTL/LTR verification matrix (per surface, both directions)

Pure-Arabic render (deed panels, ledger rows, report Arabic side) · pure-English render (auditor LTR sessions) · mixed strings (Latin deed numbers "WQR-1187-1421" inside Arabic rows; Arabic beneficiary names inside the English report side — bidi isolation proves out, rtl-rules §2) · numeral rendering under the declared policy (Western in all data cells both directions; AR-indic ONLY in Arabic prose panels when the workspace policy enables it — never in tables, never mixed mid-sentence) · embedded Latin tokens in RTL and Arabic tokens in LTR (isolating containers) · tables/grids column order mirrored with alignment rules held (amount columns stay inline-end aligned per direction) · ledger seq order follows the reading direction (inline-end advance) · forms label/input alignment + error placement on the correct inline edge · truncation at 320px container with worst-case joined-word strings (beneficiary names like "مستشارو التدقيق والحوكمة" class) · 400% zoom reflow in one dimension · bidi isolation on all user-generated strings (evidence notes, deed purposes). Seeded fixtures (07c W-S: the bilingual deed, "WQR-1187-1421" in Arabic rows, Arabic names in the EN report side) are the regression set.

## Reduced-motion contract (motion-language §5)

The seal settle collapses to a 2-step opacity + the state chip + polite announcement; the distribution settle becomes an instant append with the row-count announcement; staggered registry-row reveals render simultaneously; route changes hard-cut; every animated state change has its perceivable non-motion equivalent by construction. A reduced-motion pass is part of the release testing matrix (a11y-baseline §8.6).
