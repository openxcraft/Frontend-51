# 08 — Integration Map: contract-lifecycle-manager

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Extraction-assist capability** ("read an uploaded contract document and propose metadata fields and obligation drafts") | Abstraction hours: a 30-page agreement → first-draft fields and obligations ([20][21] evidence — abstraction is currently human labor) | The hand-entry wizard IS the top-ten-field checklist practitioners already run ([19]: rank by value, capture ~10 fields starting with expiry + renewal mechanism); manual entry is unlimited, primary, and never metered |
| N2 | **Execution channel** ("send a document for signature and return an execution confirmation") | Signature routing when the team wants it someday — explicitly NOT hosted at v1 (LOOP-10: no e-signature) | Download the document (`getDocumentArtifact`), arrange signature entirely outside the product (counter-signatures, notarization, wet ink), upload the executed copy, record execution with channel 'manual' — the seeded C-5 path; asset-register-tracker's 12 Q-5 anticipated exactly this boundary |
| N3 | **Notification channel** ("deliver reminders and completion notices to members outside the product") | Cross-context delivery when Nadia is not in the console (async-contract §6 ladder) | In-product reminders console as the return-state surface + digest banner on vault home; the P21 tier ladder makes the channel the ambient rung only — no workflow blocks on it |
| N4 | **Party-registry capability** ("look up counterparty registry identifiers from an official company register") | Saves typing CR/DED numbers and prevents identifier drift across 300 contracts | Type the identifier from the trade license; the field records provenance (manual vs capability) either way — identifiers are data, lookups are convenience |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "read contract documents uploaded to this workspace and return structured field/obligation proposals" — displayed in capability language before save (credential-contract §4), never a vendor name. Grant extension is never blanket-implied: a future widening of read scope asks explicitly.
- N1 credential lifecycle surfaces where extraction happens (intake wizard step 4, contract detail re-run), never only in settings; failure degrades the same surfaces with the manual path stated alongside (credential-contract §3/§6).
- Privacy boundary (ai-native-patterns §9): documents and proposed fields stay within the declared adapter operations; the assist never touches documents outside the workspace that granted consent; dismissed suggestions are never re-transmitted.
- N2 consent (when bound later): "send documents for signature on behalf of the workspace and return execution confirmations" — the vault records execution facts; the channel carries the signing. Execution records name the channel kind ('execution-channel'), never a vendor.
- N3: notification tier control per class (P21): reminder-due = instant-tier candidate when permissioned; weekly digest for approaching-zone summaries; owners control tiers per class. Outbound payloads carry minimum facts (obligation summary, due date, action link) — never document contents, never the full register.
- N4: lookup consent returns identifiers only — the capability class is explicitly barred from risk judgments (00 exclusion); no scoring, no screening, no enrichment beyond registry fields.

## Risk flags

- N1 binding-time evaluation set: bilingual document pairs (EN MSA with Arabic annex; AR lease; bilingual supply agreement) with ground-truth field/obligation tables — precision on dates/values AND on Arabic-party-name transliteration must pass before the capability ships active (12 Q-6). The planted false-positive discipline (07c) stays in the product regardless: review is the feature, extraction the accelerant.
- N1 recall asymmetry: obligations buried in schedules/annexes are the known miss class ([2] practitioner sentiment) — the manual checklist remains the completeness backstop; the extraction result always displays a "suggestions cover pages 1–22; obligations in schedules may be missing" honesty line.
- N2 is the e-signature boundary: binding it must not silently import signature-flow UX into the vault (LOOP-10 discipline) — the channel delivers confirmations; the product never renders a signing ceremony at v1.
- N3 delivery is ambient only — reminder correctness never depends on delivery; the in-product console is the source of truth (async-contract §6).

## AI degradation map (ai-native-patterns §8 — conditionally-AI declaration)

| Surface | Assist available | Assist unavailable / quota (rungs 2–4) |
|---|---------|--------------------------------|
| Intake wizard (S3) | full: metadata/obligation proposals, draft-by-default review step | full: wizard skips step 4 with a one-line manual-path notice (rung 4); rung 2 = reduced suggestion count (conf ≥ 0.77, labeled); rung 3 = no suggestions, checklist only — all labeled |
| Contract detail (S2) | re-run extraction on a document version; suggestion panel mode | full: suggestion panel absent; metadata/obligations editable by hand as always |
| Obligations console (S4) | full — console is deterministic, assist-independent | full (unchanged) |
| Register / renewal window (S1/S2) | full — deterministic arithmetic, assist-independent | full (unchanged) |
| Review workflow / execution (CP-4) | full — deterministic state machine | full (unchanged) |
| Reminders (all surfaces) | full — pure computation from obligation state | full (unchanged) — the spine never degrades |
| Exports / activity (S7) | full | full |

Non-AI core (register, bilingual metadata, manual obligations, reminder engine, workflow, audit trail, exports) never requires N1 — the 00 success signal tests exactly this against the Mock Adapter's assist-off configuration (`assistEnabled: false` → degraded: true, zero suggestions, manual path proceeds).
