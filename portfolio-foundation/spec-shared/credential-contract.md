# Credential Contract — Abstract Secret Presentation & Management

Status: SHARED FOUNDATION · How products present and manage secrets, keys, and connection credentials. This file names zero providers; every external capability is an abstract need (LOOP-5, LOOP-13). Concrete bindings happen later in a single adapter file against 07b.

---

## 1. Scope

"Credentials" = any secret or grant the workspace supplies to enable an abstract integration need (outbound message sending, file storage, channel publishing, external identity). Session tokens of the product's own users are NOT credentials — they are the session model in 07b and never appear in UI surfaces.

## 2. Presentation Rules

- **Masked by default.** A credential renders as its kind + a non-reversible hint (last 2–4 characters of the identifier portion, never of the secret portion). Reveal-on-hold is not offered for secrets — reveal applies to identifiers only.
- **Screenshot-safe by construction.** Credential surfaces render with visual masking that survives export/print. Full secrets are displayed exactly once, at creation time, in a copyable field with the copy action announced.
- **Kind, not vendor.** UI copy says "Email sender credential", "File storage credential", "Channel publisher credential" — with the capabilities it grants, never the vendor it binds (the adapter file knows the vendor; the UI does not).

## 3. Lifecycle States

A credential's health is a first-class status: `unverified → active → rotating → expiring-soon → expired → revoked → failed`.

- **unverified**: created, not yet exercised. The verification action is explicit and its result (typed success/error from the adapter) is shown inline.
- **rotating**: a new credential is active in parallel with the old during a grace window; both are shown with window countdown; old credential revokes automatically at window end.
- **expiring-soon / expired**: surfaced where the credential's capability is used, with renewal action — never only in a settings graveyard.
- **failed / revoked**: every surface depending on the credential degrades explicitly ("Bilingual send-outs are paused — the email sender credential failed verification on 12 Oct") with a manual alternative path (§6).

## 4. Scoping & Grant Display

Before a credential is saved, the UI displays what it will be used for, in capability language: "Sends transactional messages on behalf of the workspace", "Writes export files", "Publishes scheduled posts". Scope display is per-operation-class, and any later operation outside granted classes asks for extension — grants are never blanket-implied.

## 5. Ownership & Audit

Credentials belong to the workspace, not the individual. Assignment of who may view/manage each credential class is declared per product. Every credential event (create, verify, rotate, revoke, grant extension, failure) appends to the activity log (P17) with actor and timestamp — credential audit is part of the accountability surface, exportable for the legal/audit overlay family.

## 6. Manual Alternative (no-credential usefulness)

Per LOOP-5, every capability a credential unlocks must have a manual alternative so the product is useful pre-integration: paste-the-export, download-and-upload, copy-into-destination. The alternative is declared in each product's 08-integration-map.md and its copy appears in the degraded-state messaging. A product that is useless without a credential is a rejected spec.

## 7. Never Events

- A secret in a URL, log line, export, notification, or screen-reader announcement.
- Plain-text secret storage in UI state beyond the single creation-time display.
- "Test connection" that reports success without exercising a real capability round-trip.
- Silent credential reuse for a capability class the user never granted.
