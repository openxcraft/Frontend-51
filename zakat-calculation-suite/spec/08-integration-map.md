# 08 — Integration Map: zakat-calculation-suite

SME-H pass · Abstract capability language only — zero vendors, zero providers (credential-contract §2; LOOP-5 binding). Four integration needs, each with its manual alternative as the PRIMARY path from first run: the product is fully useful with every capability unbound (00 DoD tests exactly that configuration). Channel/capability grammar throughout; the adapter (07b) stays the only contract surface.

## N1 — Reference-price observation capability

**Need**: an abstract channel that supplies observed per-gram market reference values for gold and silver (the entered-reference workflow's convenience tier). **Manual alternative (PRIMARY)**: the officer enters each reference value by hand — per-gram amount, as-of date, and a source note naming where the value came from (mint table, jeweler quote, treasury listing, feed export pasted by hand). Every entered reference is an accountable act in the activity log (P17); the seeded fixtures demonstrate the full discipline with synthetic values marked as such. **Degradation when absent**: none to the calculation path — pinning, computation, comparison, and audit export all run on entered references; the only missing surface is the convenience pre-fill, and the NisabReferenceBoard renders exactly as designed (first-run empty state teaches the manual path, 11 C-05). **Binding gate**: a bound channel must pass the reference-integrity set before shipping active — every value it supplies lands as an ENTERED reference with source note and actor (never a silent auto-overwrite of pins); pins already frozen on calculations are never rewritten (07a evidence pins). A channel that cannot prove per-value provenance fails the gate.

## N2 — Evidence document storage capability

**Need**: an abstract storage channel for evidence documents an officer may attach to items or cases (bank statement exports, count sheets, mint listings). **Manual alternative (PRIMARY)**: bilingual evidence notes + hand-entered reference metadata on the item (07a sourceNote; the "metadata mode" — the note names the document, its date, and where it lives in the buyer's own filing). **Degradation when absent**: items carry their evidence as notes; the audit bundle exports notes verbatim; nothing in the calculation, review, lock, or export chain touches a stored file. **Binding gate**: retrieval must degrade to metadata mode explicitly and visibly when the credential fails (11 G-class copy: "الأدلة المتاحة كبيانات وصفية فقط" / "evidence available in metadata mode only") — a storage binding whose failures are silent is rejected.

## N3 — Export artifact delivery capability

**Need**: an abstract delivery channel for audit bundles and items-csv artifacts beyond the browser (handing the bilingual bundle to an external auditor's desk or a filing workflow). **Manual alternative (PRIMARY)**: direct download — the artifact downloads from the jobs console with its expiry window and regeneration path stated. **Degradation when absent**: downloads always work (they are never rate-limited as the LOOP-5 floor — imports/exports are window-metered as anti-runaway rails, but a delivered artifact's re-download regenerates deterministically from locked state). **Binding gate**: the channel must deliver the artifact unmodified — the audit bundle's integrity is its content (trace, pins, methodology version, numeral policy on its face); any channel that re-renders or summarizes the bundle fails.

## N4 — Notification channel

**Need**: an abstract notification channel for cross-context job completion (import finished while the officer is elsewhere; export ready for the auditor's viewer session). **Manual alternative (PRIMARY)**: in-context completion first (P12), plus return-state surfacing — unfinished and recently-finished jobs greet the user on the relevant surface at re-entry (async-contract §6 ladder rungs 1 and 3). **Degradation when absent**: the jobs console and surface-level return states carry the information; no workflow blocks on a notification. **Binding gate**: notifications carry artifact FACTS (job kind, case reference, expiry window), never amounts in the notification body — a zakat figure does not travel through a notification surface the product does not control (privacy boundary, ai-native-patterns §9's spirit applied to channels).

## AI degradation map (ai-native-patterns §8)

**Declared non-AI — nothing to degrade.** No operation generates, inspects, clusters, or transforms content by model (07b declaration). The full workflow — item intake, calculation, comparison, review, lock, export — runs identically with every AI-shaped capability absent; there is no quota ladder, no cost meter, no assist surface. The one future seam (statement OCR / import parsing assist) is declared, NOT implemented, and lands only through LOOP-4 owner confirmation and a new contract version (07b rule 10; 12 Q-14).

## Risk flags

- N1 is the only capability with arithmetic-adjacent risk: a feed-supplied value entering a calculation must remain an accountable, pinned, provenance-bearing reference — the gate above exists so convenience can never become silent data entry into a certified number.
- Artifact expiry (14-day seeded windows, 07c) is a posture decision, not a technical default: locked cases regenerate deterministically forever; the window governs the delivered file's freshness story for auditors (12 Q-15).
