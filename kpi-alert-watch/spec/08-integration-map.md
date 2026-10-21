# 08 — Integration Map: kpi-alert-watch

## Abstract needs (all optional at v1; the manual alternative is the PRIMARY path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Metric-source capability** ("return metric series data for declared feeds on their cadence") | Feed data without a paste in hand; fresh points on the workspace clock | Paste/import daily or weekly snapshots — the seeded workflow every persona already runs (02); the product is fully useful on manual data alone (the 00 success signal 1 tests exactly this) |
| N2 | **Anomaly narration assist capability** ("produce bilingual narrative context for a detection from its computed rule state") | Richer context paragraphs on page-class items and weekly digests | The templated bilingual rule text — the shipped default, complete on its own (07b rule 1: the assist appends, never replaces; provenance chip names which engine produced the text) |
| N3 | **Digest delivery channel** ("deliver rendered digests to destinations members read") | The digest-reader seat (Shaikha) reads outside the console; weekly cadence for Arabic-first directors | The in-console digest view (viewer-permission, digest-first home) — delivery is a convenience tier, never a dependency (P21 ladder: tier control per member) |

Three abstract needs — inside the portfolio's 3–5 band, recorded deliberately: every other capability a monitoring product might reach for (webhook alert routing, chat-bot interactivity, warehouse queries) falls inside LOOP-10 exclusions (incident routing, log analytics) or would add a sixth need with no manual alternative worth its weight.

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "read metric series for the declared feeds" — displayed in capability language before save (credential-contract §4), never a vendor name; grant extension asks explicitly if syncs widen scope (new feeds, new lookback).
- N1 credential surfaces follow lifecycle states (unverified → active → … → failed) wherever ingestion happens (S2's capability tab), never only in settings; failure degrades the capability tab with the paste path stated in the same surface (credential-contract §3/§6).
- N2 assist consent is separate from N1: the assist runs on already-stored series and rule state (it reads computed detections, not raw capability data); quota-metered, pre/post visible (P14); privacy boundary per ai-native-patterns §9 — no metric data leaves the declared adapter operations for the assist.
- N3 delivery is ambient only: no workflow blocks on it (async-contract §6); delivery failure never destroys the digest document (07b rule 9).

## Risk flags

- N1 binding-time evaluation: numeric fidelity at the boundary (does the capability return the metric at the declared unit and cadence? gaps disclosed or silently skipped?) — a fixed bilingual fixture feed must pass before the capability ships active (12 Q-6).
- N2 assist quality on bilingual explanation context is the guardrail risk; mitigations: the template pair is always rendered above the assist section, provenance is per-narration, and the assist is quota-metered with the deterministic floor unmetered (the anti-fatigue posture applied to the AI layer itself).
- N3 delivery destinations carrying different retention than the console must surface THEIR windows in the delivery record (async-contract §2; the 7-day artifact discipline the portfolio runs).

## AI degradation map (ai-native-patterns §8 — conditionally-AI declaration)

| Surface | Assist available | Assist unavailable / quota (rungs 2–4) |
|---|---------|--------------------------------|
| Console home / triage (S1/S4) | full — detection rows are deterministic; no assist involvement | full (unchanged) |
| Detection detail (S5) | narration section appends with provenance 'assist' (draft-by-default posture: it is context text, never a status change — P15's spirit applied to read-only narration) | template narration with provenance 'template' — the same action, zero content loss, quota notice through the usage surface only (rung 2: reduced assist length; rung 3: template-only labeled; rung 4: capability off with reset time) |
| Digest document (S6) | assist context paragraphs on page-class items when bound | template explanations verbatim — the digest is fully consumable in both languages with the assist off (the 00 success signal 3) |
| Feed workspace / watch editor / backtest (S2/S3) | full — deterministic engines, no assist involvement | full (unchanged) |
| Season calendar (S7) | full — deterministic | full (unchanged) |
| Delivery (S6/S9) | full | full — delivery never depends on the assist |

Non-AI core (feeds, ingestion, baselines, thresholds, seasonal suspension, backtest, digests, preferences, delivery) never requires N2 — the 00 success signal 3 tests exactly this against the Mock Adapter's assist-off configuration. The deterministic engines render no usage meter anywhere (unmetered by design — the degradation floor must not read as rationed; 06's QuotaMeter reuse rule).
