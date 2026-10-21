# 08 — Integration Map: meeting-notes-action-desk

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Transcription capability** ("convert an audio file the workspace already possesses into a segmented transcript") | Turning the team's own recordings into capture without retyping | Type notes during/after the meeting (the floor path); paste the transcript from whatever the team already uses to record — the product is fully useful on typed and pasted capture alone |
| N2 | **Bilingual summarization assist capability** ("propose summary paragraphs, decision candidates, and action candidates from a capture revision") | Proposal quality on long, mixed-script captures | Deterministic cue mode (07c fixed tables: bilingual cue phrases, third-person owner matching, date-expression parsing — labeled, inspectable, always-on) plus fully manual authoring on the same surfaces |
| N3 | **Export delivery channel** ("deliver minutes/register artifacts to external destinations") | Automation for Reem's quarterly distribution someday | Download/copy the artifact — export-only handoff at v1 (00 exclusions); the register link is shareable in the workspace |
| N4 | **Notification channel** ("notify owners of confirmation requests and leads of responses/escalations") | The loop's cross-context delivery when owners are not in the product (Faisal's phone) | In-context surfacing: the owner-mode link (shareable), the loop desk digest, return-state surfacing on re-entry (async-contract §6 ladder 1/3); nothing in the loop blocks on N4 |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "transcribe audio files supplied by the workspace" — displayed in capability language before save (credential-contract §4), never a vendor name. Grant extension asks explicitly if transcription widens scope. N1 credential lifecycle states surface wherever capture happens (S2), never only in settings; failure degrades the transcribe path with the typed/pasted paths stated in the same surface (credential-contract §3/§6).
- N2 assist consent is separate from N1: the assist runs on capture the workspace already holds (typed or pasted) — quota-metered, pre/post visible (P14); privacy boundary per ai-native-patterns §9: capture content stays within the declared adapter operations, no silent exfiltration. Assist-off is a fully supported posture, not an error.
- N3/N4: notification tier control per class (P21); export delivery never requires N4; owner-mode links carry an action id and a workspace-scoped grant, never a session secret in the URL (credential-contract §7 never-events).

## Risk flags

- N1 binding-time evaluation: dialect and code-switching fidelity at the capability boundary (does it handle Khaleeji/Najdi/MSA interleaved with English — the documented Gulf meeting reality, research digest source 42; "test with real dialectal speech, not just MSA text" — source 45). A fixed bilingual evaluation set (code-switched segments from real-shaped meetings, speaker-label fidelity, Arabic-script integrity) must pass before the capability ships as active (12 Q-4 gate). Confidence: no public benchmark for Arabic action-item extraction exists (honest gap) — the gate is our own.
- N2 assist quality on mixed-script captures is the guardrail risk; mitigations: deterministic cue baseline always comparable side-by-side, provenance per proposal, confidence labels with the fixed <0.70 'low' mark, human accept/edit/dismiss gate before anything enters the loop (P15; 07a state obligations).
- N4 delivery is ambient only — no workflow may block on it (async-contract §6); an unheard confirmation request degrades to the visible confirmation-overdue zone, never to data loss.

## AI degradation map (ai-native-patterns §8 — conditionally-AI declaration)

| Surface | Assist available | Assist unavailable / quota (rungs 2–4) |
|---|---------|--------------------------------|
| Capture ingestion (S2) | full (typed/pasted + transcribe paths) | full — typed/pasted paths unaffected; transcribe path degrades only if N1 is the failed capability (typed/pasted stated in the same surface) |
| Summary + proposals (S3) | assist proposals with confidence labels (draft-by-default) | deterministic cue mode with explicit notice: template summary paragraphs + cue-phrase candidates, provenance chip flips to deterministic (rung 4: clean-off with reset time; rungs 2–3: fewer proposals, then cue-only — all labeled) |
| Action authoring (S5) | full — authoring is manual by design; assist only pre-fills from accepted proposals | full (unchanged — authoring never requires the assist) |
| Confirmation loop (S6) | full — the loop is deterministic by construction, assist-independent | full (unchanged) |
| Actions register + zones (S7) | full — zone derivation is deterministic | full (unchanged) |
| Decisions (S4) | decision-candidate proposals | cue-rule candidates only, labeled as such |
| Exports/jobs (S9) | full | full |

Non-AI core (typed/pasted capture, deterministic cue mode, action authoring, the entire confirmation loop, status transitions, zone derivation, minutes/register assembly, exports) never requires N2 — the 00 success signal tests exactly this against the Mock Adapter's assist-off configuration. No-AI leakage audit: no sparkle affordances, no "smart" copy, no pulsing generation surfaces anywhere (ai-native-patterns §1); the assist is a labeled proposal source and nothing else.
