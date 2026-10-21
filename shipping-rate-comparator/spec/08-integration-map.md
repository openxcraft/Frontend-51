# 08 — Integration Map: shipping-rate-comparator

All needs abstract (channel/capability language only — no vendors, ever). v1 ships with ZERO bound capabilities: the product is complete on hand-entered rate cards, hand-authored profiles, and download-path exports (LOOP-5 bar). N1/N2 are declared binding seams with no v1 operations on the adapter (LOOP-4 record, 12 Q-14) — they exist here so the future contract version that binds them does not silently widen scope.

## Abstract needs

| # | Abstract need | Why | Manual alternative (always available, v1 primary) |
|---|---------------|-----|--------------------------------------------------|
| N1 | **Rate-quote capability** ("return live rate quotes for a shipment profile from channels the workspace grants") | Someday: rate a parcel against a courier's live tariff without waiting for the annual card; inject live quotes as an additional quote source beside the card library | The workspace's own card library — the negotiated cards the merchant already holds, entered or pasted once and versioned forever; comparisons, batches, and exports are complete on cards alone (00 success signals test exactly this) |
| N2 | **Label / booking channel** ("create a shipment and purchase its label for a chosen quote") | The natural continuation after a quote is chosen — declared as the seam per the LOOP-10 exclusion (no label printing at v1) | Copy the chosen quote's reference (channel, service, zone, chargeable weight, total) from the breakdown sheet into whatever booking system the merchant already uses; the export artifact can carry the same reference for the ops team |
| N3 | **Export artifact storage & delivery** ("store comparison export artifacts and deliver them to a destination") | Renewal-file sharing to the procurement seat beyond the download path | Browser download of the markdown/CSV artifact (loop-free, credential-free); pin the comparison so the artifact regenerates identically on demand |
| N4 | **Notification channel** ("notify members of job completions — imports, batches, exports") | Cross-context delivery when a manager walks away from a 30-destination batch (async-contract §6) | In-context completion + return-state surfacing: the jobs console and the comparisons-history badge on re-entry; the digest tier is the only rung that needs the channel |

## Consent semantics (credential-contract)

- N1, when bound in a future version, is per-capability-class consent: "returns live rate quotes for shipment profiles on behalf of the workspace" — displayed in capability language BEFORE any grant (credential-contract §4), never a vendor name; the credential's lifecycle states (unverified → active → … → failed) render wherever quotes appear, with the card-library path stated in the same surface on failure (§3/§6). Live quotes must carry their own provenance field — the comparison table distinguishes card-derived quotes (versioned, auditable) from capability-derived quotes (stamped with fetch time) so the trust posture survives the binding. **Binding gate (12 Q-12)**: a live-quote source may only join a comparison as a clearly-labeled additional row set — never as a silent replacement for the merchant's card data.
- N2, when bound: the quote reference is the handoff payload; the channel grants "create shipments from chosen quotes" scope; the v1 copy/export path stays available in every state (the LOOP-5 floor is structural, not transitional).
- N3/N4: notification tier control per class (P21); export delivery never requires N4.

## Risk flags

- N1 binding-time evaluation: divisor and surcharge fidelity at the capability boundary — a live quote that ignores the workspace's COD amount or applies an undisclosed divisor would poison cross-card comparisons; the evaluation set must compare capability quotes against the same card's arithmetic on identical profiles before the capability ships active (12 Q-12).
- N2 scope creep is the LOOP-10 boundary itself: booking pulls tracking, tracking pulls claims — the exclusion list is the guardrail, and the quote-reference handoff is deliberately narrow.
- N4 delivery is ambient only — no workflow blocks on it (async-contract §6 ladder).

## Degradation map (capability absence — v1 ships with ALL unbound)

| Surface | With capability (future) | Without (v1 state — the shipped reality) |
|---|---------|------------------------------------------|
| Comparison workbench (S4) | card quotes + labeled live-quote rows | **full** — card quotes only; no live-quote affordance rendered at all (no dead buttons, no "coming soon" chrome) |
| Quote breakdown sheet (S5) | provenance field distinguishes card-version vs fetch-time | **full** — every quote pins its card version (the shipped provenance) |
| Jobs console (S8) | delivery notifications reach members off-context | **full** — in-context completion + return-state badges (async-contract §6 rungs 1 and 3) |
| Export panel (S5) | artifacts delivered to a destination | **full** — download path, expiry stated, regeneration free |
| Card library / editor (S1–S3) | unchanged — cards are workspace data, never capability-dependent | **full** |
| Batch matrix (S4) | unchanged | **full** |

## AI degradation map (ai-native-patterns §8 — non-AI declaration)

This product is **declared non-AI** (00/07a/07b): zero AI operations exist, therefore no surface depends on any AI capability and no AI degradation ladder applies. The deterministic core (card authoring, zone resolution, dimensional and chargeable-weight arithmetic, comparison, batching, export) is the entire product — there is no assist to lose, no quota to exhaust, no rung to fall to. The only metered resource is the export window (P14), whose floor is the never-limited download path (07b rule 10). Any future assist-shaped operation (e.g., import parsing suggestions) requires a new contract version and a re-opened 00 exclusions discussion with the owner (12 Q-14) — the non-AI declaration is the boundary, not a permanent vow.
