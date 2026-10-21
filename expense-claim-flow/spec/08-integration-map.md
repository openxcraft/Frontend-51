# 08 — Integration Map: expense-claim-flow

Declared **conditionally-AI** (ai-native-patterns §1): exactly one operation family (`extractReceiptDraft` / `applyReceiptDraft` — receipt extraction proposals, confirm-gated per field) touches a model capability, and it is an abstract need. Every core workflow — claim authoring with computed per-diem/mileage, policy findings, the approval chain, payout recording, export — is deterministic and completes with every capability below unbound (the 00 success signals are tested in exactly that configuration, 07c default `extractionCapability: 'off'`). Architecture speaks only in abstract capabilities; UI copy says kind, not vendor (credential-contract §2).

## Abstract needs (4 — all optional; manual alternatives per LOOP-5)

| # | Abstract need | Why it exists | Consent semantics (credential-contract §4) | Manual alternative (always first-class) |
|---|---------------|---------------|---------------------------------------------|------------------------------------------|
| N1 | **Receipt extraction capability** — "reads captured receipts and proposes vendor, date, amount, tax, and receipt-number fields for you to confirm" | Typing five fields per receipt is the delay psychology that makes claimants postpone filing (01 q8/q12); a proposal surface collapses it to confirm-taps — with confidence bands because Arabic receipts specifically challenge extraction (RTL orientation, numeral systems, layout variation — 01 q11) | Grant displayed as: "Reads receipts you capture and proposes their fields — nothing writes to a claim until you confirm each field" — per-operation-class; cost transparency per ai-native-patterns §4 (metered extractions, P14) | **Manual entry on the same form** — the identical fields in the identical order, always rendered; the form is the designed default posture, not a fallback (07c: the capability ships OFF by default) |
| N2 | **Finance document channel** — "delivers claim evidence packages to a destination" | Some finance teams want period packs filed automatically into a document vault instead of downloaded at close | Grant: "Writes claim evidence exports on behalf of the workspace" — writes scoped to the export class only | **Download** the package (claim ledger, receipts manifest, findings report, approval trail, payout records) — the default handoff to whatever posts the money (the no-ERP boundary made concrete); artifacts regenerable for 7 days |
| N3 | **Notification channel** — "notifies members outside the app" | Threshold-routed approvers (02 Salem) and waiting claimants (02 Huda) live outside the claims surface between sessions | Grant: "Sends notifications about approval turns, queries, and payout events to workspace members" — message class only, per P21 tier control; payloads carry minimum facts (claim reference, kind of turn) — never receipt images or extracted fields (07a no-leak rule) | **In-app notification center + daily digest** on claims home; pending steps surface on app entry (return state, async-contract §6.3) — never orphaned in an inbox only |
| N4 | **Member directory source** — "resolves workspace members and roles from the company's directory" | Multi-hundred-employee buyers maintain people data elsewhere; re-typing names into an approval matrix drifts stale | Grant: "Reads member names and roles to populate approval routing" — read class only, no writes back | **Manual member list** (S6) — bilingual names + roles maintained by a finance-admin; the matrix's stale-member warnings keep manual directories honest |

## Capability binding gates (LOOP-7 posture — evaluated at binding time, not now)

- **N1 proposal fidelity**: a fixed bilingual evaluation set (Arabic ZATCA-class tax invoices, English receipts, mixed-script, crumpled-photo degradations) must clear per-field precision floors per confidence band before N1 ships active — the confirm-gate makes errors safe, but a proposal surface that is mostly wrong is a UX tax (metered) with no value; every proposal retains the region anchor (the evidence link).
- **N2 delivery fidelity**: package integrity at destination — the findings report and approval trail are audit artifacts; corruption or partial delivery surfaces as typed errors, never silent truncation.
- **N3 address hygiene + payload minimization**: consent-scoped recipients only; notifications name the claim and the turn, never amounts by default (a push notification reading an employee's reimbursement amount is a privacy defect, not a feature — configurable inward).
- **N4 directory fidelity**: member resolution must round-trip identity (no silent merges of two people into one approver); deactivation propagation must never remove names from historical chains (07a).

## Degradation map (ai-native-patterns §8 — the conditionally-AI ladder, concretely)

| Surface | Extraction capability ON | Extraction capability OFF / failed / quota-limited (the default v1 state) |
|---|---|---|
| Claim composer, per-diem/mileage computation, findings, approvals, payout, export | **Full function** — the deterministic engine has no dependency on any capability | **Full function — identical**; nothing in the pipeline notices |
| Receipt capture panel | Draft fields proposed with confidence bands; region anchors; one-tap confirm on high-band fields | The manual form IS the panel (same fields, same order); the assist affordance renders as optional with its consent surface — never a wall, never an error (07c PERMISSION detail carries the manual path inline) |
| Quota-exhausted (RATE_LIMIT ladder, ai-native-patterns §5) | Reduced rung: the remaining window's extractions still run; at exhaustion the manual form carries on with the reset time stated | — (clean unavailability state with reset time; the product stays fully useful — a quota wall that blocked claiming would be a design failure) |
| Mid-run failure | Partial fields kept and marked `partial`; retry or manual per field (ai-native-patterns §2) | Manual form (the partial fields persist as pre-typed suggestions the claimant confirms) |
| Notifications / exports / member directory | Unaffected | In-app center + digest; download handoff; manual member list (N2–N4 independent of N1) |

Quota ladder (ai-native-patterns §5) applies to the two metered classes — receipt extractions and export packages (P14, 07b `getUsage`); the deterministic engine (computation, findings, routing) is never metered and never degrades.

## Risk flags for the owner

- N1 is the highest-leverage binding (manual entry is the documented delay driver, 01 q12) and the only one whose absence slows *claimants* rather than finance; its absence is honestly survivable and the metering model (12 Q-3) prices it as an accelerant, not a toll on the right to be reimbursed.
- N4 staleness is the quiet governance risk: a matrix pointing at departed approvers silently stalls claims; v1 mitigates with stale-member warnings on the manual directory, and the N4 binding gate makes round-trip identity a hard requirement.
- Activating any future *automatic* application of draft fields would violate the P15 confirm-gate that the whole contract is built on (07b rule 2) — recorded here so the boundary survives binding-time enthusiasm.
