# 08 — Integration Map: marketplace-listing-sync

Declared **conditionally-AI** (ai-native-patterns §1): exactly one adapter operation (`suggestFieldMappings`, 07b) may invoke an abstract mapping-assist capability. That capability is optional everywhere — mapping authoring, compliance checking, publishing, and exporting are complete with every capability unbound (the 00 success signal tests the all-off configuration against the Mock Adapter). Architecture speaks only in abstract capabilities; UI copy says kind, not vendor (credential-contract §2).

## Abstract needs (4 — all optional; manual alternatives per LOOP-5)

| # | Abstract need | Why it exists | Consent semantics (credential-contract §4) | Manual alternative (always first-class) |
|---|---------------|---------------|---------------------------------------------|------------------------------------------|
| N1 | **Channel publish capability** — "writes ready listings to the connected sales channel" | Sellers want listings live on the channel without manual upload; the capability pushes mapped, readiness-verified listings | Grant displayed as: "Publishes listings for this workspace's channels and returns the channel's own acceptance or rejection per listing" — write class only, per channel | **Export the channel-ready file** and upload it in the channel's own seller surface (CP-4.4): the file carries the same checklist verdicts (blocked excluded-and-named, warnings annotated). ch-003 ships manual by seed — the permanent demonstration that the product never requires the capability |
| N2 | **Catalog intake capability** — "parses uploaded catalog files into master products" | Catalogs above paste scale (hundreds–thousands of SKUs) arrive as structured files too large for hand-pasting | Grant: "Reads catalog files you upload and converts them into master products for this workspace" — read class scoped to catalog files | **Paste** (one block per product, 07c format) and **file upload** through the same parser; the sample channel + sample catalog demonstrate the format before any credential exists |
| N3 | **Mapping-assist capability** — "proposes bilingual field-mapping candidates with disclosed confidence" | The conditionally-AI surface (00): mapping a 24-attribute channel by hand is the buyer's largest setup cost; ranked candidates with visible confidence cut it | Grant: "Proposes mapping candidates for channels you select — every proposal waits for your accept, edit, or reject" (P15 structurally guaranteed: resolution stages a draft row; saveFieldMap remains the only write path — 07b rule 7); metered per ai-native-patterns §4 | **The manual mapping editor** — the complete v1 path, identical output surface (MappingRow rows authored by hand); the suggestion panel states this when unbound (11 A) |
| N4 | **Export delivery capability** — "delivers exported channel files to a destination" | Some buyers want channel files filed into a shared location their channel operator picks up | Grant: "Writes export files on behalf of the workspace" — export class only | **Download the artifact** (7-day expiry, regenerable) — the default handoff |

## Capability binding gates (LOOP-7 posture — evaluated at binding time, not now)

- **N1 publish fidelity + rejection fidelity**: a fixed evaluation set (mapped-preview equality with the channel's received state; rejection codes surface verbatim with taxonomy mapping; unmappable codes stay UNKNOWN with the verbatim message — never a fabricated translation) must pass before N1 ships active on any channel. The mock's DN-1012 fixture (ampersand the channel forbids, our seeded pack does not) is the standing test of that honesty.
- **N2 parse fidelity**: bilingual field retention (both locale variants + image ordering) across the evaluation set; import errors poison every downstream finding (07c rule: findings derive from master state).
- **N3 suggestion honesty**: the binding must return confidence + rationale + provenance (the contract's `formulaNote` equivalent) — a capability that cannot disclose its confidence shape is rejected at binding; cost transparency per ai-native-patterns §4 applies at rung 1, and the degradation ladder below governs the rest.
- **N4 delivery integrity**: file integrity at destination; typed failures, never silent truncation.

## Degradation map (ai-native-patterns §8 — the conditionally-AI ladder on ONE surface)

| Surface | All capabilities unbound (default v1 state) | Capability failing mid-session |
|---|---|---|
| Catalog, mappings, rule packs, compliance check, readiness console | **Full function** — deterministic rules are local arithmetic (07c); mapping authoring is fully manual | Full function — capability failures surface only on their own affordances, typed per the 7-class taxonomy |
| Mapping suggestions (the ONE AI surface) | **Rung 4**: the manual editor is the complete path — the panel states it plainly; no "reduced mapping" state exists (11 A row) | Rung order on quota/failure: full suggestions → RATE_LIMIT ladder with reset time (rung 3 is not applicable — there is no cache of suggestions worth serving) → manual editor (rung 4, the full product). The editor never pauses |
| Publish | **Export-first**: channel files with verdicts baked in (the LOOP-5 path; ch-003 seed) | Per-listing outcomes kept; un-attempted listings return to ready with typed error + retry (the job-004 fixture) |
| Export & delivery | Download artifacts | N4 failure → typed error + manual download of what delivered |

Quota ladder (ai-native-patterns §5) applies to the metered operations only (compliance check runs, publish batches, export files, assist suggestions — P14, 07b getUsage): checks warn at 80% of window and the ladder refuses with reset time; **readiness computation on already-imported data never meters and never degrades** — a rule either runs (deterministically) or fails typed; the product must not fabricate a "reduced checking" state.

## Risk flags for the owner

- N1 is the highest-leverage binding (manual upload is the single largest recurring friction); its absence is honestly survivable — the export path carries verdicts and the product remains a complete readiness desk (the 00 degradation test).
- N3's binding re-opens the AI-declaration review: if a future capability also proposes *content* (translations, titles), that is OUT of the declared surface and requires LOOP-4 owner confirmation first — the contract deliberately has no operation for it (12 Q-8).
- Channel-side rule drift (the channel changes its rules, as the 75-character waves prove — 01 §2) is a *data* risk, not an integration risk: seeded rule packs are demonstration values and the owner's channel owners must curate them (12 Q-9); no binding can promise channel-rule truth.
