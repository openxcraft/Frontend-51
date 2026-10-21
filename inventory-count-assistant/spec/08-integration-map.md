# 08 — Integration Map: inventory-count-assistant

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Stock-level channel** ("read book quantities from the store's system of record; deliver adjustment sheets back to it") | Book registers drift from paste-in snapshots; a bound channel keeps expectedQty current without re-pasting | Paste book quantities (always works — CP-1.4) and download the adjustment sheet for the external system (CP-5.4); the register and all counting discipline function fully on pasted truth |
| N2 | **Count-sheet and label print channel** ("render printable bilingual count sheets and shelf labels") | Some counters work from paper; shelf labels reinforce the bilingual label discipline | Browser print of the count sheet and item labels from the catalog (the sheet prints with both scripts and barcodes; on-screen counting never requires print) |
| N3 | **Notification channel** ("notify members of session assignments, reveals, and closures") | Cross-context delivery when managers navigate away (async-contract §6) | In-context completion + return-state surfacing (sessions home badges, jobs console on re-entry); the digest tier is the only rung that needs the channel |
| N4 | **Report delivery channel** ("deliver variance reports and adjustment sheets to external destinations") | Noura-tier owners route evidence to auditors/franchisors automatically someday | Download/copy the export artifact (variance report, adjustment sheet) — export-only delivery at v1 (00 exclusions) |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "read stock levels for specified stores and deliver adjustment sheets" — displayed in capability language before save (credential-contract §4), never a vendor name. The adapter enforces the boundary: `updateStockLevels` with `source: 'stock-channel'` and no granted consent → PERMISSION naming the capability class (07b rule 10). Grant extension asks explicitly if the channel widens scope (new stores).
- N1 credential lifecycle surfaces wherever book quantities are imported (S7), never only in settings; failure degrades the channel path with the paste path stated in the same surface (credential-contract §3/§6): "الكتاب يقدِم من اللصق — القناة معطّلة حالياً" class copy (11 E).
- N2–N4: notification tier control per class (P21); printing and delivery never require N3; no credential silently enables a class the workspace never granted.

## Risk flags

- N1 binding-time evaluation: book-quantity fidelity at the boundary (are quantities pre-rounded? do row identities map to SKU or barcode?) — a fixed bilingual evaluation set must pass before the channel ships active (12 Q-5). Adjustment-sheet delivery must be acknowledged by the external system before the channel claims "posted" (never a silent one-way write — credential-contract §7 "test connection" rule applied to data, not just auth).
- N2 print fidelity for bilingual sheets: Arabic line-height and barcode print density are the risk; the printed sheet is a first-class artifact, not an afterthought of the screen layout.
- N3 delivery is ambient only — no workflow blocks on it (async-contract §6 ladder).
- POS-shaped scope creep: N1 is deliberately named a stock-level channel, NOT a POS integration — checkout data, sales rows, and payment state never enter this product (LOOP-10; the abstract channel carries book quantities and adjustment acknowledgments only).

## Degradation map (ai-native-patterns §8 — declared non-AI)

The AI degradation ladder is trivial by declaration: no AI capability exists to degrade — counting, tolerance arithmetic, cadence proposal, and IRA are deterministic functions over local data (00 declaration; 07c rules 1–8). The no-AI leakage audit holds: no sparkle glyphs, no "smart" copy, no suggestion affordances, no quota walls on the core discipline (counting is unmetered by design, 06).

| Surface | N1 channel bound | N1 channel absent/unbound (v1 default) |
|---|---|---|
| Book register (S7) | quantities sync per consented cadence; adjustments deliver back with acknowledgment | paste is the primary path; register snapshots at reveal stay self-consistent (07a pinning) |
| Count sessions (S2–S4) | full function — sessions read the register either way | full function (identical — sessions pin register state at reveal) |
| Reconciliation + IRA (S4/S5) | full | full (deterministic arithmetic is local) |
| Reports/exports (S5/S9) | delivery channel sends artifacts | download/copy the artifact (manual handoff) |

Every row keeps the product fully useful with zero capabilities bound — the 00 success signals test exactly this against the Mock Adapter's channel-off state (`consentGranted: false` is the seeded default).

## Binding gates

1. N1 ships active only after the bilingual evaluation set passes (12 Q-5) AND the manual paste path remains first-class for one full release (deprecation of paste is never an option — it is the LOOP-5 floor).
2. N2 activates behind a print-preview gate: the bilingual sheet must pass the 09 RTL/LTR matrix in print form (both scripts, barcode density, word-boundary truncation) before the channel is offered.
3. N3/N4 activate only as P21-tiered digests and download-links — never as blocking dependencies of any flow.
