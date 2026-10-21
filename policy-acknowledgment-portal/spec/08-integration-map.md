# 08 — Integration Map: policy-acknowledgment-portal

All needs are optional at v1; the manual alternative is the PRIMARY path from first run (LOOP-5). Non-AI declaration (ai-native-patterns.md §1): there is no AI capability to integrate, degrade, or consent to — the degradation map below is channel-level only, and every row keeps the full evidence workflow intact.

## Abstract needs (channel/capability language only — no vendors)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Notification channel** ("deliver assignment and reminder messages to members by email or SMS per delivery preference") | Campaign reach without admin legwork; the frontline reality is SMS-first (open rates >90%, no install/login — 01 evidence [58][61]) | The acknowledger link itself: copy it into any channel the org already uses; the downloadable per-site chase list (CoverageConsole, P07 bulk) and the poster/QR sheet for site rollout — a campaign is fully runnable and auditable with zero messages sent |
| N2 | **Directory capability** ("read people records from the organization's employee directory") | Joins/leavers without re-keying (Tariq's 8 joiners a month, 02) | CSV import with row-level validation + single-person add — the primary path; leavers deactivated by hand from the same surface |
| N3 | **Document storage channel** ("store and serve uploaded policy document files") | Policies exist as PDFs/DOCX in the drive today; upload keeps fidelity | Paste the body text — renders identically in the reader surface, carries the same digest, the same evidence weight |
| N4 | **Evidence-pack delivery channel** ("deliver exported artifacts to external destinations") | Sending the pack straight to an auditor/reviewer someday | Direct download — the primary delivery (Omar hands the file across, or uploads it to whatever review portal is asking) |

## Consent semantics (credential-contract)

- N1 consent is per capability class: the workspace grants "send policy-assignment and reminder messages to workspace members on behalf of the workspace" — displayed in capability language before save (credential-contract §4), never a vendor name; extension to a new channel kind (email → SMS) asks explicitly.
- N1 credential surfaces follow lifecycle states (unverified → active → … → failed) wherever dispatch happens (S4 composer, S5 console), never only in settings; a failed/expired credential degrades the dispatch path with the chase-list alternative stated in the same surface (credential-contract §3/§6).
- N2 consent: read-only people records; the directory capability NEVER writes back (deactivation stays a human act — the product records, humans decide); scope display says exactly "read employee names, numbers, sites, and status".
- N3/N4: notification-tier control per class (P21); export delivery never requires N1.
- Every credential event (verify, rotate, revoke, grant extension, failure) appends to the ledger (`consent-changed` / `dispatch-failed`) — credential audit is part of the attestation audit trail (credential-contract §5).

## Degradation map (channel-level; ai-native-patterns §8 applied to a non-AI product)

| Surface | All channels bound | Any/all channels absent (the LOOP-5 floor) |
|---|---------|----------------------------------------|
| Register + version publish (S1–S3) | full (upload + paste both work) | full — paste path unaffected; N3 absence changes nothing observable except the upload affordance's hint |
| Campaign composer + launch (S4) | full (dispatch via N1) | full — campaign launches with chase list + acknowledger link; dispatch job records its own absence honestly |
| Coverage console (S5) | full (reminder sends) | full — manual chase list + per-site rosters; extend-window unchanged |
| Acknowledger portal (E1/E2) | full (assignment arrives by message) | full — the link opens directly (SMS'd/shared/posted by any means the org already has); read tracking + attestation identical |
| Ledger (S7) | full | full — the ledger records everything regardless of channels |
| Evidence pack export (S8) | full (optional delivery) | full — direct download is the primary path |

The 00 success signal tests exactly the all-channels-absent configuration on the Mock Adapter (`channelConsentGranted: false`, no N2/N3/N4 bindings simulated): the full loop — publish, import, launch, attest, decline, export — completes with identical coverage arithmetic.

## Risk flags

- N1 SMS/email deliverability is the reach risk (a message that never arrived reads as a non-compliant worker — unfair evidence); mitigations: dispatch jobs carry per-recipient accounting, failures surface per recipient with retry, and the chase list is the ground truth the admin can act on; a person with NO email and NO phone is flagged at campaign composition time (reachable-by-channel check, honest, never silently included).
- N2 binding-time evaluation: employee-number stability and Arabic-name fidelity at the directory boundary (does the source render names in both locales? does it carry site/kind?) — a fixed bilingual evaluation set must pass before N2 ships active (12 Q-11).
- N3 upload fidelity: the reader surface renders text; a PDF that renders as gibberish after channel conversion would corrupt evidence — the paste path is the guaranteed-fidelity baseline and the digest makes any later body drift detectable.
- N4 is delivery-only and ambient (async-contract §6) — no workflow may block on it.

## No-AI leakage audit (declaration discipline)

No operation, field, or surface in this product names or implies generation, suggestion, summarization, or scoring (07b rule 12). The UI carries no sparkle glyphs, no "smart" copy, no assist affordances (05; ai-native-patterns §1). Should a future comprehension-check or policy-diffing assist be wanted, it enters through a LOOP-4 record in 12 FIRST, as a declared abstract need with a manual alternative — never as a silent feature.
