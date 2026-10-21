# 08 — Integration Map: cod-order-confirmation

SME-G + SME-H pass · External touchpoints expressed ONLY as abstract needs (LOOP-5/7/13 discipline; credential-contract grammar). Core value requires ZERO integrations — the product is fully functional standalone against the Mock Adapter with the manual paths below, and the manual paths are v1 PRIMARY paths, not fallback theater. **Declared conditionally-AI product**: exactly one AI-touching capability exists (N6, risk-score enrichment); every other need is non-AI, and the AI degradation ladder below covers N6 only.

## Abstract needs (all optional; none chosen)

| # | Abstract need | Why it would exist | Manual alternative (pre-integration usefulness — credential-contract §6) |
|---|---------------|--------------------|------------------------------------------------------------------------|
| N1 | **Order source channel** ("pull COD order drafts from the storefront/marketplace the merchant already runs into this workspace") | The daily batch is today exported by hand; a bound channel removes the paste step and enables `cancelled-upstream` events (CP-2 edge) when the source refreshes | Paste-import (CSV/TSV with column mapping + row-level validation — CP-1.2) is the v1 PRIMARY path; `sourceImportedAt` staleness always displayed ("آخر استيراد: قبل 6 ساعات" / "last import: 6 hours ago") |
| N2 | **Rich interactive message channel** ("send templated messages with quick-reply buttons to buyers, and receive their structured replies") | Attempt rung 1 is the highest-response rung in practice (01 §4.3 vendor-claimed band); buttons carry window ids so the buyer's tap IS the agreement | Agent works the queue with manual calling + `logManualContact`/`recordBuyerResponse` (the console IS the manual path); templates + previews still authored and printable as call scripts |
| N3 | **Plain-text/SMS channel** ("send short text messages with a reply keyword and link") | Rung 2 reaches buyers without rich-messaging presence; SMS reply keywords map to the same typed responses | Same as N2 — the ladder degrades to voice+agent rungs when unbound (failover is engine policy, not improvisation) |
| N4 | **Courier handoff channel** ("deliver sealed manifests to the courier operation the merchant uses") | Manifest delivery today is paper and portal uploads; a bound channel confirms receipt and (optionally) returns outcome events | Download/print the manifest artifact (Munira's driver-sheet reality — CP-5.5); outcome events can be entered via the ledger import path until bound |
| N5 | **Buyer phone verification capability** ("verify a phone number belongs to a reachable subscriber before the ladder runs") | Wrong-number and dead-number orders burn ladder time (07c `b-sami` fixture) | Agent judgment at the call leg + `wrong-number` response type + blocklist (CP-4.3); the product never claims verified identity — only recorded confirmation (00 exclusions) |
| N6 | **Risk-score enrichment capability** ("supplement the deterministic RTO scorecard with a model-assisted score") | Network-scale risk signals (GoKwik-class shopper history — 01 §2) can beat local history for NEW buyers, where the scorecard is deliberately neutral (0.5) | The deterministic rule scorecard IS the shipped default: components, weights, and thresholds are inspectable and versioned (07c §2.1); the engine provenance field displays `rule-scorecard` honestly; enrichment binding changes nothing structurally (contract rule 4) |
| N7 | **Workforce identity source** ("prove console-user identity via an external identity system") | Enterprise buyers will demand SSO at purchase time; phone-pin identity is v1 scale's honest choice | Phone-pin invite + workspace-scoped user records (07a); the session contract (07b) is identity-agnostic so binding later changes no UI |

## Risk flags (LOOP-7 style, for binding-time owners)

- **N2/N3 message-channel semantics**: buyer-facing templates are the trust surface — a channel binding must not alter template content, must deliver both locales faithfully (bidi isolation preserved), and must return replies as STRUCTURED events (button id / keyword), never free-text-only. Quiet hours (contract rule 7) apply to channel dispatch: a bound channel that fires inside quiet hours is a contract violation, not a feature.
- **N2 template approval reality**: rich-message channels in the region typically require template pre-approval per locale; the template studio's versioning + preview is designed for that workflow (bind-time owner operationalizes approval cycles; the product itself claims no approval guarantee — 11 copy states the dependency plainly when a channel rejects a template, surfaced as the attempt `failed` state with the reason verbatim).
- **N4 is a one-way handoff at v1**: courier outcome events (delivered/refused/returned) are RECORDED inputs (buyer history), never a tracking/booking surface — a binding that implies courier control would violate LOOP-10 and the honest boundary in 11.
- **N6 is the only AI-adjacent need**: the enrichment must satisfy ai-native-patterns §9 (no silent exfiltration: enrichment consumes declared scorecard inputs only — buyer history counts, order value band, zone match — never raw buyer text or phone numbers); the provenance field is the buyer-facing honesty contract; degradation is total and instant (below).
- **N1 upstream-cancel semantics**: a bound order source must declare what happens on order cancellation/refresh upstream — the spec's answer is declared behavior (order resolves `cancelled-upstream`, ladder halts with reason, CP-2 edge); a binding must honor it or surface divergence explicitly.
- **N5 verification ≠ identity**: a verification binding changes what the UI may SAY (a "number reachable" fact) but never the product's claims (recorded confirmation, not verified identity — 00 exclusions); owner must re-review copy implications at binding time.

## Consent semantics (per credential-contract)

- Credential-class surfaces are console-side only (order source, message channels, courier handoff, verification, enrichment, identity) presented in capability language — "يرسل رسائل تأكيد باسم مساحة العمل" / "sends confirmation messages on behalf of the workspace" — kind-not-vendor, masked by default, screenshot-safe by construction (credential-contract §2).
- Grant display precedes any save (credential-contract §4): each need's grant names the operation classes it unlocks (read order drafts / send buyer messages / deliver manifests / verify numbers / score enrichment / prove user identity).
- **Buyer data minimality is structural**: the buyer entity carries phone, display name, locale, and outcome COUNTS (07a) — no address text beyond zone/district/city, no message bodies retained beyond the ≤280-char rawText evidence field, no geolocation. The N6 enrichment consumes counts and bands, never identifiers (ai-native-patterns §9). Agent-visible buyer data is bounded to the same set (09 privacy posture).
- Channel failures surface where the capability is used (the rung's `failed` state with the reason verbatim — credential-contract §3's degraded-explicitly rule), never only in a settings graveyard.

## Degradation map (conditionally-AI: the N6 ladder + channel absence)

| Surface | All channels bound | Channels partially/fully unbound (manual mode) | N6 enrichment unbound / rate-limited / failed |
|---|---|---|---|
| Queue + ladder | engine dispatches rungs on schedule; replies stamp the trail automatically | ladder still runs as the record of truth: agents work manual calls (logManualContact), capture responses (recordBuyerResponse), print templates as scripts; time-to-next-attempt shows the manual cadence; rungs record `agent-call` and manual outcomes identically | unaffected (scoring never touches channels) |
| Agreement + windows | quick-reply taps carry window ids; capacity syncs live | agent selects windows in the sheet (same catalog, same capacity math); the Agreement Stamp is identical evidence | unaffected |
| Risk scores | `engine: 'model-assistant'` where bound, floor retained, provenance displayed | identical function | **full function on `rule-scorecard`** — provenance reads `rule-scorecard`; no surface pauses, no quota wall (ai-native-patterns §5's ladder collapses to rung-3-by-default here: the scorecard IS the clean default, not a degraded mode) |
| Manifests | artifact delivered to courier channel; outcome events return | download/print path (first-class); outcomes entered via ledger import | unaffected |
| Ledger + exports | full | full (every manual action was logged identically) | full |

The product remains a complete confirmation desk in every column — the LOOP-5 bar ("a product that is useless without a credential is a rejected spec") is met by construction: paste import, manual calling, sheet-based agreement, printed manifests, deterministic bands, full ledger. The 00 §success-signal 5 degradation test runs the same day twice (bound vs unbound) with byte-identical ledger chains for the manual actions.

## Provider-name discipline

No integration, credential, or provider is named anywhere in the product UI; capability language per credential-contract §2.3. This file names zero providers; competitor/provider references (couriers, platforms, tooling) live only in 01/02/13 per the portfolio provider-name ban (audit_batch rule 2).
