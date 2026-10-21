# 03 — UX Flows: shipping-rate-comparator

SME-C pass · 6 critical paths. Coverage table at end traces every 07b operation exactly once — no orphans, no phantoms. All arithmetic per 07c's deterministic rules; every quote renders its full derivation chain (zone → weights → break → surcharges).

## CP-1 — First rate card: paste-import → fix rows → activate (value proof: the spreadsheet escape)

1. Khalid opens Cards home (S1) first-run: onboarding checklist (P22) — "Rate your first parcel in 10 minutes" with three milestones (paste a card, enter your box, run a comparison), each linking into the flow that achieves it. `getSession`
2. He opens the paste-import surface (S3): a paste field, a card header form (channel label — his own naming, never a vendor list — service label, currency, unit system, divisor), and a live preview grid that parses as he types. `importRateCard`
3. The import is a Job per async-contract §1 (determinate per-row progress, cancellable); the preview shows parsed zones × breaks × prices with normalization applied to his destination names (strip tashkeel, unify alef/hamza variants — rtl-rules §4, disclosed in the surface). `listJobs`
4. Two rows land as named issues ("Row 17: price '١٥٫٠٠' uses a decimal separator the parser does not accept — re-enter as digits"; "Row 22: weight break 5 kg overlaps 3–5 kg"). He fixes them inline; re-import is idempotent (same key, same draft). `importRateCard`
5. Draft card review: zone list with coverage, break ladder contiguity check, divisor field with its live meaning ("at 5000, five liters of box equals one kilogram of billed weight" — research Q30's liters intuition), surcharge stack defaults empty. `getRateCard`
6. Activate: the completeness gate validates (≥1 zone with coverage, ≥1 break, ladder contiguous from 0, currency set) — a P04 level-2 confirm naming what activation means ("this card now rates comparisons"). `setRateCardStatus`

**Edges**: pasted table with merged cells / prose notes (non-numeric rows → named issues, surrounding rows kept — partial policy); a zone with zero coverage destinations (gate blocks with the zone named); prices with mixed decimal separators (Arabic decimal separator rows are flagged, never silently coerced); duplicate paste of the same table (idempotency key returns the original draft, no double card).
**Failures**: malformed rows → VALIDATION naming first bad row + kept-good-rows accounting; import job cancelled mid-parse → draft keeps parsed-so-far rows, named remainder; active gate failure → VALIDATION naming the missing piece.
**Recovery**: the draft persists across sessions (P11 recall); nothing is lost to a cancelled import.

## CP-2 — Card maintenance: zone/break/surcharge editing + renewal duplicate (the manager's daily loop)

1. Noura opens a card in the editor (S2): tabs for Zones · Breaks & pricing · Dimensional policy · Surcharges; every tab renders the same completeness gate state. `getRateCard`
2. Zones tab: coverage chips per zone (destination names, bidi-isolated rendering); she adds "الأحساء" to the regional zone; the zone probe field resolves a test destination live and names the match ("الاحساء (normalized) → Zone 2 — matched coverage entry الأحساء"). `resolveZone`
3. Breaks tab: the zone × break price grid — inline edit per cell (P06: display and edit surface are the same region; Esc restores, Tab commits and advances). `updateRateCard`
4. Surcharges tab: typed stack — fuel percentage on base, COD fee on COD amount, remote-area flat tied to zone flags, declared-value percentage; each row states its own rule in copy. `updateRateCard`
5. Renewal: Khalid duplicates the card (new effective date, same structure) and edits prices on the copy — the original stays intact as last cycle's terms; both versions are diffable by re-running an old comparison. `duplicateRateCard`
6. Card status flip (retire) is a P04 level-2 confirm naming active comparisons that reference it. `setRateCardStatus`

**Edges**: a cell edit that breaks ladder contiguity (blocked inline with the neighbor named); zone-coverage edit while a comparison is open elsewhere (comparison pinned to card VERSION — the open view stays on the old version with a "card changed since run" chip); probe destination that normalizes to nothing (no match → "no coverage on this card" — a data fix, not an error).
**Failures**: stale baseVersion edit → CONFLICT with both payloads; probe on a retired card → NOT_FOUND-ish handled as a valid "retired card" probe result (reported, not errored).
**Recovery**: all card edits are versioned (activity log records every mutation, P17); retired cards remain readable and diffable.

## CP-3 — Single comparison: profile → live chargeable-weight settle → side-by-side quotes (the signature flow)

1. Noura opens the Comparison workbench (S4): left pane = shipment profile (destination, actual weight, dimensions, optional COD amount and declared value); right pane = results table; top = card selector chips (active cards only by default). `listRateCards`
2. She types the destination; per-card zone resolution renders inline ("Zone 2 · Zone A · no coverage" per selected card) as she types. `resolveZone` (per card)
3. The live chargeable-weight calculator: three figures — actual, volumetric, chargeable — re-settle on every weight/dimension keystroke; the winning figure carries the amber mark and a one-line derivation ("volumetric: 35×25×15 cm ÷ 5000 = 2.63 kg → rounds up to 3.0 kg at the 0.5 kg step"). `computeChargeableWeight`
4. Run comparison (synchronous, budget-bound per 10): every selected card produces a quote row — total, currency badge, delta vs cheapest, and the derivation chain behind a "why" disclosure; quotes group by currency with cheapest-per-group flagged (no cross-currency ranking — 12 Q-9). `runComparison`
5. She opens the breakdown sheet on the cheapest row: weights (which weight won and why), matched zone + the coverage entry that matched, break + base, overage math, surcharge lines each with its rule. `getComparison`
6. Non-happy path: a card returns "no coverage" (destination outside every zone — the row shows the fix action: open the card's zones) or "out of weight range" (18 kg over a 10 kg table with no overage policy — the row names the card's ceiling).

**Edges**: destination matching two zones on one card (VALIDATION-blocked at card-save time — overlapping coverage is a card defect, CP-2 gate); mixed currencies across selected cards (grouped, ranked per group, honest notice); profile edited after run (comparison snapshot pins inputs — re-run to refresh); one-off comparison without saving a profile (inline profile mode, 07b `profileInline`).
**Failures**: zero active cards selected → VALIDATION ("select at least one active card"); destination empty → VALIDATION naming the field; weights/dims non-positive → VALIDATION.
**Recovery**: comparisons are immutable snapshots keyed to profile + card versions; re-running creates a new snapshot, history never mutates.

## CP-4 — Batch comparison: paste destinations → per-destination cheapest (the morning surface)

1. Noura opens Batch mode in the workbench: same profile template (weight, dims, COD/declared value apply to all rows), a destinations paste field (one per line), and the card selector. `listRateCards`
2. Paste 30 destinations; per-row normalization preview with duplicate accounting; she runs the batch. `runBatchComparison`
3. The batch is a Job (async-contract §1: determinate destination-by-destination progress, cancellable); the result renders as a destinations × cards matrix with cheapest-per-destination flagged per currency group and every cell's total present as text (never heat-only — charts.csv contract). `listJobs` · `getComparison`
4. Exception rows float to the top: destinations with any no-coverage or out-of-range cell, sorted by exception count, each with its fix action.
5. She saves the batch's single-destination rows she wants to keep as profiles (P11: the repeated destinations become recallable profiles). `createShipmentProfile`

**Edges**: duplicate destinations in the paste (counted, deduplicated in the matrix with a count badge); a destination normalizing to an existing profile's destination (recall suggestion, P11); mixed-script rows (Arabic + Latin destination names in one paste — per-row `dir="auto"` isolation); batch over the progress-honesty budget (destination count in job copy, never fake percentages).
**Failures**: all rows invalid (empty lines only) → VALIDATION; batch job failure mid-run → partial policy (completed rows delivered, failed remainder named, retry scoped to remainder); zero active cards → VALIDATION.
**Recovery**: batch results are immutable snapshots like singles; the job's partial artifact is kept.

## CP-5 — Pin + export: comparison → negotiation evidence (the renewal file)

1. Hana opens a comparison from history (S6), filters to the pre-renewal snapshot. `listComparisons` · `getComparison`
2. She pins it as evidence with a note ("2026 renewal baseline — standard box, 3 cards"). `setComparisonPin`
3. Export: markdown table or CSV, with or without per-quote breakdowns — a Job with expiry + regeneration per async-contract §2. `exportComparison`
4. The artifact downloads (manual path, zero credentials, LOOP-5); the export panel states the retention window. `getArtifact`
5. After the courier's new card lands, Khalid duplicates + updates the card (CP-2.5), Hana re-runs the same profile and pins the after snapshot; the two pinned comparisons are the negotiation's before/after file.

**Edges**: exporting a comparison whose cards have since changed (snapshot semantics — the export carries the versions that rated it, plus a staleness chip in the artifact header); pin on an already-pinned comparison (note update, single pin state); export with breakdowns off (totals-only table, still versioned).
**Failures**: expired artifact → NOT_FOUND with regenerate path; export job failure → typed error + retry, artifact idempotent; pin on a batch comparison (allowed — pins the whole matrix).
**Recovery**: artifacts regenerate from immutable snapshots; nothing is ever lost to an export failure.

## CP-6 — Libraries, jobs, settings (the management surface)

1. Cards home: filter by status/channel, saved views (P08), coverage-gap warnings ("2 active cards have zones with empty coverage"). `listRateCards` · `getSession`
2. Profiles library: labels, last-run, usage counts. `listShipmentProfiles` · `getShipmentProfile` · `updateShipmentProfile` · `deleteShipmentProfile`
3. Comparisons history: singles + batches, pinned filter, date sorts. `listComparisons`
4. Jobs console: import/batch/export jobs with state, cancel/retry, link-to-context (async-contract §7; T3-consolidated console). `listJobs`
5. Settings: default currency, unit system default, normalization disclosure (the exact rules the matcher applies), capability consent state in kind-not-vendor language (credential-contract §2). `getSession` · `getUsage`
6. Activity log: every card mutation, status flip, pin, and export (P17). `listActivity`

**Edges**: filtered-empty declares itself (P01); >200 history rows virtualize (P19); no-access surfaces → PERMISSION, never "empty".
**Failures**: NETWORK mid-list → banner + retry (P20); usage read failure → "last known" degradation.
**Recovery**: all lists cursor-paginated and re-fetchable; session locale switch re-renders without data loss.

## Non-happy paths

- **No rate-quote capability bound (LOOP-5 default posture)**: the workspace's own cards are the primary path from first run; the capability renders as optional with its consent surface, never as a wall (08 N1).
- **First-run with zero cards**: the workbench teaches via a seeded sample card + sample profile (P22; 07c fixtures) so the comparison moment is experienceable before real data.
- **Retired-card world**: all cards retired → workbench explains and links to activation; comparisons against retired cards require the explicit include-retired toggle.
- **Offline**: reads work; card edits and profile writes queue with per-item state (P20); jobs reconcile to authoritative state on return (async-contract §5).
- **Recovery from wrong defaults**: divisor, rounding step, and minimum billable weight are per-card EDITABLE policy fields with their meaning in copy (12 Q-11) — a wrong default is a field edit, not a migration.

## Failure → error mapping

VALIDATION (malformed import rows, completeness/contiguity gates, empty destination/cards, non-positive weights) · NOT_FOUND (stale card/comparison/profile/artifact links, expired artifacts) · PERMISSION (capability consent, workspace scoping, viewer-role mutations) · CONFLICT (concurrent card edits, concurrent profile edits) · RATE_LIMIT (exports near window; capability fetches if bound) · NETWORK (list fetches, artifact delivery, job polling) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, CP-6.1/5, entry (role/locale) | `runComparison` | CP-3.4 |
| `createRateCard` | CP-2 (blank-card path alongside import), CP-6.1 | `getComparison` | CP-3.5, CP-4.3, CP-5.1 |
| `listRateCards` | CP-3.1, CP-4.1, CP-6.1 | `listComparisons` | CP-5.1, CP-6.3 |
| `getRateCard` | CP-1.5, CP-2.1 | `setComparisonPin` | CP-5.2 |
| `updateRateCard` | CP-2.3/4 | `runBatchComparison` | CP-4.2 |
| `setRateCardStatus` | CP-1.6, CP-2.6 | `exportComparison` | CP-5.3 |
| `duplicateRateCard` | CP-2.5 | `getArtifact` | CP-5.4 |
| `importRateCard` | CP-1.2/4 | `listJobs` | CP-1.3, CP-4.3, CP-6.4 |
| `resolveZone` | CP-2.2, CP-3.2 | `getUsage` | CP-6.5 |
| `computeChargeableWeight` | CP-3.3 | `listActivity` | CP-6.6 |
| `createShipmentProfile` | CP-4.5, CP-3 (save-profile path) | `listShipmentProfiles` | CP-6.2 |
| `updateShipmentProfile` | CP-6.2 | `getShipmentProfile` | CP-6.2 |
| `deleteShipmentProfile` | CP-6.2 | | |

25 operations, 0 orphans (Critic-verified).
