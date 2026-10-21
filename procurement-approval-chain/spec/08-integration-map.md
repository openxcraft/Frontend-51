# 08 — Integration Map: procurement-approval-chain

Declared non-AI (ai-native-patterns §1/§8): there is no AI capability anywhere in this product, so no AI degradation ladder applies — the "non-AI core" is the entire product. Every abstract need below is optional from the first run; the manual alternative is the PRIMARY path, not a fallback bolted on (LOOP-5) — the 00 success signals are tested against the all-capabilities-unbound configuration of the Mock Adapter (07c).

## Abstract needs (capability language only — no vendors, credential-contract §2)

| # | Abstract need | Why it would exist | Manual alternative (always available, primary) |
|---|---------------|--------------------|------------------------------------------------|
| N1 | **Quote-document storage** ("store quote documents attached to requests") | Quotes arrive as photos and PDFs in vendor chats; a document reference makes the evidence self-contained at audit time | Typed quote totals + free-text reference field — the composer's default posture (03 CP-1.4); the comparison, gates, and exports run entirely on typed data |
| N2 | **Member directory source** ("read the workspace member list from the company directory") | Position assignment without retyping members; new-staff onboarding | Type members into positions in Org & Delegation (CP-4.6) — the seeded five-member path; the directory stays authoritative here regardless |
| N3 | **Notification channel** ("notify members of awaiting steps and decisions") | Cross-context delivery when approvers navigate away (async-contract §6 rung 2) | The register's My-Queue default view + return-state surfacing (S1 badges, S9) — the product's own honest queues; the loop never blocks on a channel |
| N4 | **Finance document channel** ("deliver approval packages and audit registers to finance destinations") | Period-close automation for the accounting desk | Download the export artifact and carry it by hand (05 in 00's success signal); the approved request and its evidence live on as records regardless |

## Consent semantics (credential-contract)

- Grants are per-capability-class, displayed before save in capability language ("Stores quote documents for this workspace", "Reads the member list", "Sends workflow notifications", "Delivers export artifacts to finance destinations") — never a vendor name; extension to a new operation class asks explicitly (credential-contract §4).
- Credential health surfaces where the capability is used (S2 quote entry for N1, S6 for N2, queues for N3, S9/S3 for N4), never only in Settings; failure states degrade the capability path with the manual path stated in the same surface (credential-contract §3/§6).
- N3 notification payloads name the request code and status only — **amounts are excluded by default** (privacy posture; a workspace may widen it deliberately). N4 delivers artifacts out only; it never writes back — accounting systems stay authoritative (LOOP-10).
- Every credential event (create, verify, rotate, revoke, extension, failure) appends to the activity log (P17).

## Degradation map (what the UI shows when each capability is absent — the default state)

| Surface | N1 bound | N1 unbound (default) |
|---|---|---|
| S2 quote entry | document reference field attaches stored documents | the same field holds a free-text reference; totals typed — identical gates, identical comparison |
| S3 request detail | quote documents open inline | the reference renders as text in a bidi-isolated container; nothing else changes |
| S6 Org & Delegation | member picker reads the directory | members typed by hand; savePosition/saveVendor carry the same bilingual fields |
| S1/S3 queues & register | N3 delivers cross-context notifications | My-Queue default view, request-row state changes, S9 badges on re-entry; "did you see my request?" is answered by the register itself |
| S9 Jobs / exports | N4 delivers artifacts to the finance destination | download-and-carry; artifact expiry countdown and renewal stay identical |

No surface pauses when a capability is absent; no surface requires a credential to be useful — the rejection bar of credential-contract §6.

## Risk flags & binding gates

- **N1 binding gate**: retention of stored quote documents must cover the request's own retention horizon, and deletion must never orphan a quote row (the typed total survives document loss by design). Bilingual file naming is not assumed — references stay plain text.
- **N2 binding gate**: read-only. The directory may populate the member list; positions, delegations, and roles are authored in-product and never written back (authority data is this workspace's own record — the audit argument depends on it).
- **N3 binding gate**: digest tiers per P21 (instant only for the awaiting-your-decision class; daily digest for register movement); quiet hours honored; payloads amount-free by default (above). No workflow blocks on delivery (async-contract §6).
- **N4 binding gate**: delivery confirmation is recorded on the job; a failed delivery never invalidates the artifact (regenerable from live state, 07b rule 10); the channel carries evidence out, never accounting state in.
- **General**: no capability may introduce non-determinism into routing, budget findings, or quote deltas — the 07b rule 1 determinism spine is the gate every binding must pass; a capability that scores, ranks, or "optimizes" approvals is out of scope by declaration (00 LOOP-10, ai-native-patterns §1).
