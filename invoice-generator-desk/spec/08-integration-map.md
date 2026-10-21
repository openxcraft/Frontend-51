# 08 — Integration Map: invoice-generator-desk

## Abstract needs (the manual alternative is the primary path from first run — LOOP-5; a product that is useless without a credential is a rejected spec)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Document delivery channel** ("deliver the issued invoice document to the client's contact on file") | Sending without copy-paste; delivery state as honest evidence on the invoice | Download the PDF (or print it) and send it yourself through whatever channel the buyer already uses — the manual path is a first-class DeliveryRecord (`manual-download`), not a degraded mode; it is never rate-limited |
| N2 | **Export artifact storage** ("store generated PDF artifacts for retrieval within a retention window") | Retrievable downloads with expiry + renewal instead of regenerating on demand | The browser download itself — the artifact lands in the buyer's own files; expiry is an in-product retrieval concern, never data loss for a document already downloaded |
| N3 | **Notification channel** ("notify the member of job completions when they navigate away") | Cross-context delivery per async-contract §6 ladder | In-context completion + return-state surfacing (jobs console + invoice badges on re-entry); the digest tier is the only rung that needs the channel — no workflow blocks on it |

All three are optional at v1. Nothing in the product's core loop (compose → issue → download → mark payments) requires any capability: the 00 success signals are tested against the Mock Adapter with every capability unbound.

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "deliver invoice documents to client contacts on file" — displayed in capability language before save, never a vendor name; grant extension asks explicitly if delivery widens scope. The credential's lifecycle states (unverified → active → … → failed) surface WHERE the channel is used (the issued invoice view), never only in settings; failure degrades the send path with the download alternative stated in the same surface.
- N2 needs no credential class at v1: artifacts are product-internal deliverables with declared expiry; the download is the point.
- N3 tier control per class (P21); delivery of notifications never carries invoice amounts in payloads by default (money stays in-product).
- No payment-related capability exists anywhere in the map — the LOOP-10 boundary (no payment collection) is enforced by the absence of any such need, not merely by disuse.

## Risk flags

- N1 binding-time evaluation: bilingual document fidelity at the delivery boundary — the delivered PDF must be the artifact the preview showed (same render snapshot); a fixed render-fidelity check (numeral system, bidi block directions, amount-in-words) must pass before the capability ships active. Second risk: delivery metadata minimization (recipient address only, never invoice totals in channel telemetry).
- N2 retention window is a posture decision, not a technical default: artifacts hold full invoice documents; the 7-day seed window is a proposal for the owner (12 Q-13).
- N3 is ambient only — no workflow may block on it (async-contract §6).

## Degradation map (what the UI shows when each capability is absent)

| Surface | Capability present | Capability absent (the v1 default state) |
|---|---------|------------------------------------------|
| Issued invoice view (S3) | send action with channel state queued→delivered | send action renders as the consent surface ("connect a document delivery channel — or download, always"); delivery panel shows manual-download records with equal visual weight |
| Delivery panel | channel deliveries + manual records | manual records only, labeled plainly ("downloaded by Layla, 17 Oct") — never an error state |
| Jobs console (S7) | export + delivery job classes | export jobs only; the delivery filter chip hides itself (P01: absence of a class is not an empty) |
| Exports/artifacts (S3/S7) | full retrieval within window | full — N2 absent means artifacts are browser-downloaded on generation; the artifact list degrades to "generated + downloaded" records with regenerable action |
| Composer, issuing, numbering, payment marks, schemes, series (S2/S4/S5/S6) | — | FULL in every configuration: the core loop touches no capability |

## AI degradation map (ai-native-patterns §8 — non-AI declaration)

Not applicable by declaration: the product declares non-AI (07a/07b) and ships zero AI operations; there is no assist rung, no quota ladder for generation, no streaming surface. The complete core workflow — bilingual composition, deterministic totals, numeral rendering, issuing, delivery (manual path), payment marks, export — requires no AI capability in any configuration, and no surface in this product will ever render an AI-affordance shape (no sparkles, no suggestions — ai-native-patterns §1, enforced in 05/06).

## Binding gates

1. N1 ships active only after the bilingual render-fidelity check passes (the delivered artifact equals the previewed document, numeral system included).
2. Any future capability that touches money movement (payment links, processing) is BLOCKED by the LOOP-10 exclusion — it cannot bind without an owner-mandated scope change (12 Q-16).
3. N3 activation requires the notification tier ladder to be configurable per class before any digest sends (P21).
