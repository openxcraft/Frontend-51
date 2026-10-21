# 08 — Integration Map: newsletter-kit

## Abstract capabilities (all optional at runtime; the manual alternative is always the designed path — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Delivery channel** ("send rendered issues on behalf of the workspace") | Scheduling/monitoring without owning send infrastructure (LOOP-10) | Export rendered HTML/text per locale + subscriber CSV segments per policy; paste into any sending arrangement (CP-5.5 — first-class surface) |
| N2 | **Subscriber import source** ("pull subscriber rows from an external list origin") | Publishers hold lists elsewhere | CSV paste/upload with column mapping (CP-4.1) — resolves to the same `ImportInput` shape |
| N3 | **Notification channel** ("deliver job completion notices outside the app") | Completion when the user navigated away (async-contract §6.2) | Return-state on re-entry + jobs surface (async-contract §6.3) — complete without N3 |
| N4 | **Subject-variant assist capability** ("propose subject-line alternates per locale") | The one conditionally-AI surface (07a) | Manual alternates editor — always-present base; degradation map below |

## Credential presentation (credential-contract)

- N1 binds as an **email-delivery credential**: masked kind + last-2–4 identifier hint (never the secret); grant display "Sends issues on behalf of the workspace" (operation class `issue-send` only); lifecycle `unverified → active → expiring-soon/expired/failed/revoked`; verification is a real round-trip with typed inline result (CP-5.1); `failed` status degrades every send surface explicitly with the export path offered in place (contract §6).
- N2/N3 bind as scoped credentials at implementation time; their absence is the normal state — paste/upload and in-app completion are complete paths.
- Credential events (create/verify/rotate/revoke/failure) append to the activity log (P17).

## Consent semantics (binding on send)

Subscriber rows carry scope + proof + date (07a). Lists with unconsented rows cannot be scheduled — VALIDATION naming the count (07b rule 1); unconsented rows surface in the list view and import review, never silently dropped or skipped. QA C10 verifies the consent/unsubscribe footer exists in every composed locale. Product-level guarantee, independent of any channel binding.

## Risk flags

- N1 render fidelity per client mix is existential to the QA promise: the checklist certifies OUR render model (preview + export share one source); what a bound channel does to HTML at delivery is binding-time risk — per-binding evaluation set required (12 Q-5). The export path inherits the same risk, honestly stated: the checklist is the best-effort gate (00/01).
- N4 assist quality on Arabic subjects is a trust surface, not an existential one (manual editor is the base); binding-time evaluation set + the P15 draft gate cover it.

## AI degradation map (ai-native-patterns §8 — conditionally-AI declaration)

| Surface | Assist available | Assist unavailable (rung 4) |
|---|---|---|
| Composer (blocks, preheader) | full — unaffected | full — unaffected (deterministic) |
| Subject variants | manual editor + draft proposals in reserved region | manual editor only, calm notice; identical flow minus proposals |
| QA studio | full — never AI | full |
| Subscribers / import | full | full |
| Send desk / export | full | full |

Quota ladder (rungs 2–3) applies to assist generations only: reduced proposal count (labeled) → none with reset time (labeled). Non-AI core workflows (compose, QA, import, schedule, export) never require the assist capability — this map is the guarantee.
