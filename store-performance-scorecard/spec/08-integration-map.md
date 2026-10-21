# 08 — Integration Map: store-performance-scorecard

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Sales-data capability** ("return shift-level sales and labor aggregates for stores and periods") | Weekly records without a paste in hand; freshness on the analyst's cadence | Paste/import CSV with date, store code, shift class, net sales, transactions, labor hours (labor cost, traffic optional) — the seeded workflow every persona already runs (02); the product is fully useful on manual data alone |
| N2 | **Schedule-export ingestion** ("read published operating patterns or roster exports from planning tools") | Pattern governance without re-authoring windows the chain already planned | The OperatingPatternEditor authors shift windows by hand (versioned, effective-dated) — planning tools' exports arrive as reference for manual entry; no live join, ever (12 Q-5) |
| N3 | **Notification channel** ("notify members of job completions and ready packs") | Cross-context delivery when the analyst navigates away (async-contract §6) | In-context completion + return-state surfacing (S1 artifact panel, S8 jobs console); the digest tier is the only rung that needs the channel |
| N4 | **Pack delivery** ("deliver scorecard packs to external destinations") | Leadership-review automation someday | Download/copy the export artifact (leadership-pack or data-csv) into the destination — export-only handoff at v1 (00 exclusions) |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "read shift-level sales and labor aggregates for specified stores and periods" — displayed in capability language before save (credential-contract §4), never a vendor name; grant extension asks explicitly if fetches widen scope (new stores, new periods).
- N1 credential surfaces follow lifecycle states (unverified → active → … → failed) wherever records arrive (S6), never only in settings; failure degrades the S6 channel path with the paste path stated in the same surface (credential-contract §3/§6).
- N2 consumes artifacts, not credentials: schedule exports are files the user already holds; no consent surface, no connection state, no polling — the boundary with attendance-shift-planner is export-only by construction (12 Q-5).
- N3/N4: notification tier control per class (P21); pack delivery never requires N3.

## Risk flags

- N1 binding-time evaluation: record granularity at the provider boundary (are rows per-shift or per-day? does the shape carry labor hours or only sales?) — a fixed evaluation set (one known week, pasted AND fetched) must reconcile within declared tolerance before the capability ships as active (12 Q-6).
- N1 overlap discipline: fetched rows meeting pasted rows (externalKey + date + class) are detected and marked, newest authoritative — the mock implements the exact rule (07c §2.7/§3); the UI surfaces the overlap list, never a silent overwrite (07b rule 6).
- Shift-class mapping risk: a source that returns day-level totals cannot be bucketed to classes without a declared split rule — the capability contract requires class-level rows or the workspace refuses the binding (VALIDATION at binding evaluation), because silent splitting would fabricate shift-awareness.
- N3 delivery is ambient only — no workflow may block on it (async-contract §6 ladder).

## Degradation map (ai-native-patterns §8 — this product is declared non-AI; the map covers capability absence, not AI rungs)

| Surface | N1 bound + healthy | N1 unbound / failed / quota |
|---|---|---|
| Chain overview (S1) | full (coverage + latest run + channel health) | full — paste-basis coverage posture shown; channel chip reads "not bound" with the paste path stated |
| Ranked board (S2) / store detail (S3) / shift lens (S4) | full — deterministic engines, channel-independent | full (unchanged) — analysis never requires the channel |
| Data & imports (S6) | paste/import + channel fetch paths both offered | paste/import primary; channel path renders as optional with consent surface and failure state + paste alternative in the same surface (credential-contract §3) |
| Definitions & policy (S7) | full — policy governance is local data | full (unchanged) |
| Exports/jobs (S8) | full | full — export jobs unaffected; channel-fetch jobs show their typed failure |

The core loop (register stores → author patterns → paste records → run scorecard → drill → export) is complete with zero capabilities bound — the 00 success signal tests exactly this against the mock's consent-off configuration.

## Binding gates

1. **N1 granularity gate**: class-level rows (or explicit per-class split in the source's own export semantics) — else refuse binding (the shift-aware promise is only as honest as the bucketing).
2. **N1 reconciliation gate**: a known-week reconciliation (pasted vs fetched) within declared tolerance, run once at binding and re-runnable from S6.
3. **N4 never-before-review gate**: pack delivery is post-review distribution — it may never deliver a run the analyst has not opened (async-contract §6 ladder discipline).
