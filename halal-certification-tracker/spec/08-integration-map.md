# 08 — Integration Map: halal-certification-tracker

All needs are optional at v1; the manual alternative is the PRIMARY path from first run (LOOP-5). The product is **declared non-AI** (00/07a/07b) — there is no AI capability anywhere in this map, and the degradation map below is correspondingly trivial.

## Abstract needs

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Document storage capability** ("store, version, and retrieve uploaded evidence documents — audit reports, supplier certificates, decision letters") | Evidence documents are the register's physical backing; attaching bytes beats reference strings | **Metadata-mode** (the default): every document field accepts a reference string (cabinet/drive locator) with number, issuer, and dates typed as data; the staff keep files where they already keep them. The full workflow — intake, formulation, audit records, decisions, issuance, renewals, exports — completes in metadata-mode (07c fixture; 00 success signal) |
| N2 | **Applicant notification channel** ("deliver milestone and decision notifications to applicants on the body's behalf") | Renewal ladders work best when the applicant is chased, not just the staff | The renewal console IS the notification: in-product digests with copyable bilingual summary text a staff member pastes into email; nothing blocks on the channel (CP-4 works channel-free) |
| N3 | **Certificate delivery channel** ("deliver issued certificate documents to the applicant's contact") | Same rationale, delivery side | Download the artifact and send it — the certificate document is a bilingual export artifact by construction (07c); delivery is a staff action |
| N4 | **Calendar feed export** ("expose the computed renewal schedule as an external calendar subscription") | Directors live in calendars; the Monday digest as calendar rows is a nice rung | The ladder table and renewal console render dates in copyable text; the register export (register-document) carries the full schedule; copying rungs into a calendar is a manual action |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "stores evidence documents for this workspace" — displayed in capability language before save, never a vendor name (credential-contract §4). The credential's lifecycle states render wherever documents are attached (S3 evidence tab, S5 vault), never only in settings; a failed verification degrades those surfaces to metadata-mode with the manual path stated in-place (credential-contract §3/§6).
- N2/N3 are outbound messaging classes: grants name the operation class ("sends renewal milestone notifications to applicant contacts"; "delivers certificate documents to applicant contacts") — separate grants, never blanket-implied; extension asks explicitly when a new message class appears.
- N4 is read-only export: no credential class beyond the workspace's own export surface; the feed exposes computed dates only, never applicant contact data or document contents.
- Grant display per operation class, revocation degrades to the manual alternative in the same surface (§6), every credential event appends to the activity log (P17) — credential audit is part of the register's accountability surface, exportable.

## Risk flags

- N1 binding-time evaluation: document-integrity fidelity (checksum round-trip), versioning semantics at the provider boundary (does replace keep history?), and retrieval latency on the evidence surfaces — a fixed evaluation set must pass before N1 ships active (12 Q-6). Until then metadata-mode is the honest default.
- N2/N3 misdelivery risk: applicant contact data is the sensitive surface — notifications carry certificate numbers and milestone dates, never ingredient compositions or committee justifications (the dossier stays internal). Binding-time gate: a delivery round-trip test with a workspace-owned address before active status.
- N4 staleness risk: a calendar feed is a cached projection of computed rungs; the feed declares its computed-at timestamp and the console remains authoritative — a feed that silently diverges would manufacture false deadlines, the exact failure this product exists to prevent.

## AI degradation map (ai-native-patterns §8 — non-AI declaration)

| Surface | AI capability available | AI capability unavailable |
|---|---------|--------------------------|
| All surfaces (S1–S12) | not applicable — no AI capability exists in this product by declaration (07b has no model-backed operation) | not applicable — nothing degrades, nothing pauses |

The non-AI core (applicants, applications, ingredients, formulations, supplier certificates, audit records, decisions, certificates, ladders, impact analysis, exports) is the entire product; there is no capability whose absence changes any surface's behavior. The import/export job windows (RATE_LIMIT) are the only consumption surfaces, and they are plain volume meters, not capability quotas (06 QuotaMeter note).
