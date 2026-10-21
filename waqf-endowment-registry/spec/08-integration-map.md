# 08 — Integration Map: waqf-endowment-registry

**AI declaration (ai-native-patterns §1): declared non-AI — deterministic distribution ledger.** No AI capability is bound, declarable, or degradable anywhere in this product: allocation is arithmetic over recorded entries and policy shares, ratios are division, reports are pure functions over ledger state, seals are state machines. There is no AI degradation map because there is no AI surface — the non-AI core IS the product (07b rule 2). The four abstract needs below are storage/delivery/notification classes only.

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Document storage capability** ("store and retrieve deed documents, receipts, and evidence files for ledger entries") | Attaching the actual receipt/deed scan beside its evidence note; auditor-grade completeness | Evidence is recorded as bilingual notes + hand-entered document references (a number, a filing label, a bank-statement line) — the entry is complete and auditable with its note alone; files attach later without touching the ledger (metadata mode, 11 E) |
| N2 | **Disbursement record channel** ("confirm that a beneficiary's amount was delivered, with a channel receipt") | Delivery confirmation beyond hand-recording | Hand-recorded delivery with method + bilingual evidence note + date — the primary path; banks and cashier receipts stay wherever they already live, referenced by note |
| N3 | **Report delivery channel** ("deliver sealed transparency reports and beneficiary statements to boards, auditors, authorities, beneficiaries") | Sending the sealed artifact where it must go at close | Download the export artifact and deliver it by whatever channel the workspace already trusts (hand, mail, meeting, portal upload) — export-only handoff at v1 (00 exclusions) |
| N4 | **Notification channel** ("notify members of job completions") | Cross-context delivery for imports/exports when the administrator navigates away (async-contract §6) | In-context completion + return-state surfacing (jobs console, digest badges on re-entry); the digest tier is the only rung that needs the channel |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "store and retrieve endowment documents for evidence references" — displayed in capability language before save (credential-contract §4), never a vendor name. Credential surfaces follow the lifecycle states (unverified → active → … → failed) wherever evidence is recorded (S5 drawer), never only in settings; a failed storage credential degrades the drawer to metadata mode with the manual path stated in the same surface (credential-contract §3/§6).
- N2 consent names the capability class ("confirm deliveries for recorded distribution lines") — grant display per operation class; extension asks explicitly if the binding widens scope. The product never holds funds, never moves money, and the channel is a *recording* surface only (LOOP-10 enforced in 07b rule 6).
- N3/N4: notification tier control per class (P21); report delivery never requires N4; delivery failure of a report never invalidates the sealed report (it is regenerated and re-delivered — the seal is pinned to the ledger, not the channel).
- Ownership: credentials belong to the workspace; every credential event appends to the activity log (P17) — credential audit is part of the accountability surface (credential-contract §5).

## Risk flags

- N1 binding-time evaluation: bilingual document-reference fidelity (do stored documents surface with their entry references intact on both-script searches? does retrieval degrade to metadata mode cleanly when the credential fails?) — a fixed bilingual evaluation set must pass before the capability ships active (12 Q-6).
- N2 is the trust-sensitive binding: a delivery confirmation that reports success without exercising a real channel round-trip is a never-event (credential-contract §7) — verification requires a real capability round-trip, and the UI's delivery evidence always names the method, never a vendor.
- N4 delivery is ambient only — no workflow blocks on it (async-contract §6 ladder).

## Degradation map (capability-absent behavior — what the UI shows)

| Surface | All capabilities unbound (v1 default posture) | What changes when bound |
|---|---|---|
| S5 Ledger / evidence drawer (N1) | Full: bilingual evidence notes + hand-entered references; drawer states the metadata-mode notice | Adds document thumbnails/retrieval links beside the note |
| S6 Delivery tracking (N2) | Full: hand-recorded delivery (method + note + date) — the primary path | Adds channel-confirmed delivery states with receipt references |
| S7 Reports / exports (N3) | Full: direct download of bilingual document / ledger CSV / print bundle | Adds delivered-to destinations with delivery status per artifact |
| Jobs console (N4) | Full: in-context completion, return-state surfacing, digest badges | Adds permissioned cross-context notifications per P21 tier |

The 00 Mock-Adapter Definition-of-Done runs the entire CP-1…CP-4 loop in the all-unbound column — the product is fully useful with zero credentials (LOOP-5 bar; a registry that demands a vendor before it can record an entry is a rejected spec).

## Binding gates

1. N1 ships active only after the bilingual evaluation set passes (12 Q-6); until then the capability renders as available-to-bind with the metadata-mode notice.
2. N2 ships active only with a real round-trip verification path; no simulated "connected" state (credential-contract §7).
3. N3 ships active only with per-artifact delivery receipts that degrade to the download path on failure.
4. N4 never gates any workflow; tier control is per-class and user-owned (P21).
