# 08 — Integration Map: op-ed-desk

Abstract needs only (credential-contract: kind, not vendor). Every need has a manual alternative (LOOP-5) — the desk is fully useful with zero credentials bound.

| # | Abstract need | Why | Manual alternative (LOOP-5) |
|---|---------------|-----|------------------------------|
| N1 | **Submission intake channel** ("receive submissions from external contributors") | Desks take email today (01); the built-in form is the default path, email ingestion the scale path | The built-in intake form (always available); email submissions are entered into the form by desk staff with the original attached to disclosures |
| N2 | **Text-analysis capability** ("style-lint submission text") | Deterministic rule core is built-in; the FULL pass (coherence, redundancy, unsourced-claim hints, nuanced register drift) binds externally | Deterministic lint + the desk's style checklist rendered in the sidebar in degraded mode (findings limited to deterministic categories, clearly labeled) |
| N3 | **Notification channel** ("deliver decision letters and status updates") | Contributors must receive letters without accounts | Copy-letter-to-clipboard path, marked `sent-manually` with actor/timestamp (07a) |
| N4 | **Audit export capability** ("write audit-trail exports for ombudsman review") | Tariq's accountability job (02) | Activity log renders as a selectable, copyable table; per-round records copy individually |

## Consent semantics (credential-contract §4)

- N3 credential kind: **"Decision-letter sender credential"** — grant display: "Sends decision letters and status updates on behalf of the desk"; masked identifier hint; lifecycle surfaced where letters are sent (S5), never in a settings graveyard; rotation grace window per contract §3.
- N2 consumption metered per full-pass run (P14, units = lint passes — the buyer's work unit); the deterministic core is unmetered — the floor, not a luxury.
- N1/N4 are inbound/read-only — no credential classes; contributor data processing is disclosed at intake.

## Privacy boundaries (ai-native-patterns §9)

Contributor content stays inside the data contract (07a). The full-pass lint sends submission TEXT to the text-analysis capability — never identity, never contact data: a full pass sees the anonymized view, disclosed in the degraded-mode notice and desk-policy screen. No AI operation resolves `contributorId` (reviewer scope already forbids it).

## Degradation map (ai-native-patterns §8 — required)

| Surface | Capability available | Unavailable / quota exhausted |
|---|---|---|
| Intake + queue + triage | full (deterministic pre-checks) | full — never depends on any capability |
| Deterministic lint | full | full — local and unconditional |
| Full-pass lint | deterministic + AI categories | rung 2 fewer categories with notice → rung 3 deterministic-only labeled → rung 4 full-pass affordance disabled with reason + reset time; checklist mode in sidebar (N2 manual path) |
| Anonymized rounds | full (deterministic scrub + leak rules) | full — the blind-review promise never rests on the AI capability |
| Decision + letters + send | full | full (send degrades to manual path on N3 failure, 11 C) |
| Activity/audit | full | full |

The pipeline (submit → triage → blind round → decision) runs end-to-end with every capability unbound — the AI layer only deepens the lint; it never gates the workflow.
