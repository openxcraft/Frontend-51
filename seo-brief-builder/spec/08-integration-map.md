# 08 — Integration Map: seo-brief-builder

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **SERP-data capability** ("return keyword sets and intent signals for seed terms in a market/locale") | Keyword ingestion without an export in hand; fresh signals at brief time | Paste/import keyword lists with optional volume/cost columns — the seeded workflow every persona already runs (02); the product is fully useful on manual data alone |
| N2 | **Intent-clustering assist capability** ("refine cluster boundaries and suggest intent labels from keyword sets") | Assist quality on ambiguous clusters (mixed-intent members, cross-language matching) | Deterministic grouping: normalized-term frequency, Arabic affix rules, shared-term overlap thresholds, intent cue rules — declared, inspectable, always-on as a mode (07c fixed tables) |
| N3 | **Brief handoff export** ("deliver brief artifacts to external destinations") | Agency delivery automation someday | Download/copy the export artifact (markdown or writer-bundle) into the destination — export-only handoff at v1 (00 exclusions) |
| N4 | **Notification channel** ("notify members of job completions and ready-brief handoffs") | Cross-context delivery when strategists navigate away (async-contract §6) | In-context completion + return-state surfacing (jobs console, topic badges on re-entry); the digest tier is the only rung that needs the channel |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "read keyword and intent signals for specified markets" — displayed in capability language before save (credential-contract §4), never a vendor name; grant extension asks explicitly if fetches widen scope (new markets/locales).
- N1 credential surfaces follow lifecycle states (unverified → active → … → failed) wherever ingestion happens (S2), never only in settings; failure degrades the S2 capability path with the paste path stated in the same surface (credential-contract §3/§6).
- N2 assist consent is separate from N1: the assist may run on manually-ingested data (no SERP credential needed) — quota-metered, pre/post visible (P14); privacy boundary per ai-native-patterns §9: keyword sets stay within the declared adapter operations, no silent exfiltration.
- N3/N4: notification tier control per class (P21); export delivery never requires N4.

## Risk flags

- N1 binding-time evaluation: Arabic normalization fidelity at the provider boundary (are returned keyword strings pre-normalized? do volumes cover Arabic script rows?) — a fixed bilingual evaluation set must pass before the capability ships as active (12 Q-5).
- N2 assist quality on Arabic morphology is the guardrail risk; mitigations: deterministic baseline always comparable side-by-side, provenance per cluster, human confirmation gate before parity (07a state obligations).
- N4 delivery is ambient only — no workflow may block on it (async-contract §6 ladder).

## AI degradation map (ai-native-patterns §8 — conditionally-AI declaration)

| Surface | Assist available | Assist unavailable / quota (rungs 2–4) |
|---|---------|--------------------------------|
| Topic/keyword ingestion (S2) | full (manual + capability paths) | full — manual paste/import path unaffected |
| Cluster canvas (S3) | assist refinements + intent suggestions (draft-by-default) | deterministic grouping with explicit notice; cue-rule intents; provenance chip flips to deterministic (rung 4: capability clean-off with reset time; rungs 2–3: reduced suggestion volume, then template/cue-only labels — all labeled) |
| Intent assignment (S3) | suggestions with confidence | cue-rule suggestions only, labeled as such |
| Parity view (S4) | full — parity is deterministic comparison, assist-independent | full (unchanged) |
| Brief assembly + editor (S5) | full — deterministic assembly, assist-independent | full (unchanged) |
| Exports/jobs (S6/S7) | full | full |

Non-AI core (topics, keywords, deterministic clustering, parity computation, brief editing, export) never requires N2 — the 00 success signal tests exactly this against the Mock Adapter's assist-off configuration.
