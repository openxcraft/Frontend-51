# 08 — Integration Map: customs-tariff-lookup

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5; the product must be fully useful with every capability unbound, tested by the 00 Definition-of-Done)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Nomenclature-content capability** ("publish national tariff schedule editions, description amendments, and updated ruling notes into the workspace") | Keeps the reference layer current: national editions amend on their own cadence (01: a December 2025 Saudi schedule amendment; a January 2026 platform tariff-code update), and notes get superseded | The workspace runs on its bundled editions with effective-date labels and honest staleness banners; the desk checks the national portal themselves and the product labels exactly what edition every rate and note belongs to — the product never pretends currency (the honesty posture IS the manual path) |
| N2 | **Classification-search assist capability** ("map a free-text bilingual product description to candidate headings with reasoning") | Assist quality on ambiguous goods descriptions (mixed goods, borderline headings, colloquial trade names) | Deterministic spine: hierarchical browse + normalized bilingual keyword search over the indexed nomenclature — declared rules, disclosed normalization, always-on (07c fixed tables); suggestions from the deterministic-keyword mode carry matched terms as their rationale |
| N3 | **Evidence-pack delivery channel** ("deliver export artifacts to external destinations") | Someday: drop the pack straight into the broker's or auditor's intake | Download the artifact (markdown/csv) and send it however the desk already sends anything — the pack is a file, not an integration (LOOP-5 floor: downloads never rate-limited) |
| N4 | **Notification channel** ("notify members of edition updates affecting saved codes, and of completed exports") | Edition-change awareness when the desk is away (async-contract §6 rung 2) | In-context banners + return-state surfacing (the "3 of your saved codes need review" banner on re-entry, 03 CP-5 trigger); the digest tier is the only rung that needs the channel |

## Consent semantics (credential-contract)

- N1 is a content subscription, not a workspace credential in the classic sense — but its binding follows the same contract: the grant display says "publishes tariff schedule editions and ruling-note updates into this workspace" in capability language before save (credential-contract §4); the N1 surface renders lifecycle state (unverified → active → …) wherever edition currency is shown (rail edition banner), never only in settings; failure degrades the edition banner to "bundled edition, last refresh failed on {date}" with the manual portal-check path stated in the same surface (credential-contract §3/§6).
- N2 assist consent is separate: the assist runs on the desk's typed product descriptions — the privacy boundary is ai-native-patterns §9 (descriptions stay within the declared adapter operation; no silent exfiltration); assist is metered per window with pre/post visibility (P14) and quota warnings at 80%.
- N3/N4: notification tier control per class (P21); export delivery never requires N4; downloads are never rate-limited and never gated on N3.

## Risk flags

- N1 binding-time evaluation: bilingual fidelity at the content boundary — does the incoming edition carry the Arabic national rendering where one exists, and are amendment deltas (added/retired/description-changed codes) delivered as change records so the desk's reconciliation works? A fixed bilingual evaluation set must pass before N1 ships active (12 Q-9).
- N1 editorial layer: ruling-note summaries are curated content, not generated at read time — the curation pipeline must keep the "source as-carried" discipline (goods descriptions never machine-translated; 07a state obligations) or the library's trust value collapses (12 Q-10).
- N2 assist quality on Arabic trade names and dialect terms is the guardrail risk; mitigations: deterministic baseline always side-by-side, provenance per suggestion, human-verification gate on every saved code (07b rules 3–4).
- N4 is ambient only — no workflow may block on it (async-contract §6 ladder).

## AI degradation map (ai-native-patterns §8 — conditionally-AI declaration)

| Surface | Assist available | Assist unavailable / quota (rungs 2–4) |
|---|---------|--------------------------------|
| Nomenclature home + search (S1/S4) | assist panel beside deterministic results; ranked candidates with rationale + provenance (draft-by-default) | deterministic keyword search unchanged and primary; assist panel shows the ladder notice; rung 4: clean unavailability with reset time; rungs 2–3: reduced candidate counts, then deterministic-keyword-only labeled as such |
| Hierarchy navigator (S2) | full — assist-independent by construction | full (unchanged) |
| Reading pane (S3) + rate compare | full — deterministic reference rendering | full (unchanged) |
| Notes library (S5) | full — deterministic search over curated records | full (unchanged) |
| Saved lists + edition checks (S6/S7) | full — deterministic reconciliation | full (unchanged) |
| Exports/jobs/activity (S8) | full | full |

Non-AI core (browse, bilingual search, reading, notes, lists, edition reconciliation, evidence packs) never requires N2 — the 00 success signals test exactly this against the Mock Adapter's assist-off configuration. The meter surfaces assist runs only; deterministic search renders no meter (the floor must not read as rationed — 06 reused-with-twist).

## Binding gates

1. **N1 gate**: bilingual evaluation set (Arabic rendering fidelity, amendment-delta completeness, note-supersession chains) passes before the capability renders active; until then the edition banner honestly says "bundled".
2. **N2 gate**: assist runs must return provenance + degraded flags in every mode (07b rule 3) — a binding that cannot honor the honesty contract does not ship.
3. **N3 gate**: the manual download path exists and is complete before any delivery binding; artifact expiry windows are declared at creation and renewal is regeneration from current list state.
4. **No-guarantee gate (product-level)**: no capability binding may introduce computed or guaranteed duty figures — the contract has no operation to hang them on (07b rule 2); any future guarantee-shaped capability requires a new contract version (LOOP-4 seam, 12 Q-12).
