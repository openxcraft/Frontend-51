# 08 — Integration Map: visitor-badge-checkin

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Host notification channel** ("deliver arrival notifications to hosts outside the app") | The arrival ping is the core promise; hosts in meetings do not watch a board | The in-app host surface + the desk today board ARE the delivery — both render every arrival the moment it commits; the outbound channel is an add-on, never a dependency (07b rule 1: the event records regardless) |
| N2 | **Invitation delivery channel** ("deliver visit invitations to visitors") | Email/SMS-style invite delivery is the category's expected convenience | The invitation's check-in code + link render for copy/relay through whatever the office already uses (chat, phone call, printed note) — pre-registration works fully (00 success signal tests this configuration) |
| N3 | **Badge print channel** ("send print-ready badge artifacts to a printing device") | Offices with adhesive/card printers want the print click to just work | On-screen badge passes are first-class issuance (`issuedVia: 'screen-pass'`); print-ready artifacts download directly for standard adhesive and card stock targets (01 evidence [29][31] conventions) |
| N4 | **Log export delivery channel** ("deliver log artifacts to external destinations") | Compliance-office automation someday | Download/copy the artifact (daily log, in-building list, archive) — the primary path by design |

## Consent semantics (credential-contract)

- N1/N2 are per-capability-class grants displayed in capability language before save ("Sends arrival notifications to hosts on behalf of the workspace" / "Sends visit invitations to visitors") — never a vendor name; grant extension asks explicitly if scope widens (e.g., invitations to phone numbers when only email was granted).
- Channel credentials surface lifecycle states (unverified → active → … → failed) wherever the capability is used (S7 settings + the arrival surfaces), never only in a settings graveyard; failure degrades the surface with the manual path stated in the same panel (credential-contract §3/§6).
- Notification tiers per class (P21): arrival = instant (or off); invitation-sent and sweep-summary = daily digest (or off); tier control is the member's, the channel is the workspace's.
- Privacy boundary: outbound notifications carry minimum facts — visitor name, host name, visit link — never the phone, never badge codes, never history (12 Q-7; research digest sources 50–54: visitor data is personal data; minimize at every boundary).

## Risk flags

- N1 binding-time evaluation: delivery latency and retry semantics at the provider boundary (a notification that arrives after the visitor leaves is worse than none — the desk board must remain the visible fallback on any delivery failure flag).
- N2 address-quality risk: invitations sent to mistyped addresses look like our failure; the composer validates format at the field and the code-for-copy path always displays post-save (the honest fallback).
- N3 print-stock mismatch (adhesive rolls vs card trays) is the classic lobby failure; artifacts declare their stock size and the kiosk config pins one (07a KioskConfig).
- N4 is ambient only — no workflow may block on it (async-contract §6 ladder).

## Degradation map (ai-native-patterns §8 — declared NON-AI)

The product declares no AI capability, so no AI-degradation ladder applies; the equivalent honesty here is the **capability-off map** — the product's usefulness with every channel unbound (the 00 success signal's tested configuration):

| Surface | All channels bound | Channel unbound / failed |
|---|---------|--------------------------------|
| Kiosk check-in (S9) | full (code, walk-in, returning, badge pass) | full — badge = on-screen pass; no channel touches check-in |
| Host notification (S1/S8) | outbound delivery + in-app | in-app host surface + desk board; `host-notified` event still records, flagged undelivered-on-channel (07b rule 1) |
| Pre-registration (S3) | invitation delivered to visitor | code + link displayed for copy/relay — the record is complete either way |
| Badge issuance (S4/S9) | print click delivers to device | screen-pass default + print-ready artifact download (N3 manual path) |
| Log/exports (S5) | artifact delivered externally | direct download/copy (the primary path by design) |
| Sweeps/retention (S10) | unchanged — deterministic jobs, channel-independent | unchanged |

Binding gates before any channel ships active: N1 — a fixed delivery-latency budget test (notification visible to host ≤10s from check-in on the bound channel, or the fallback stays primary); N2 — address-validation pass rate on a fixed bilingual list; N3 — print artifact geometry verification against the declared stock size. No gate may gate the manual paths.
