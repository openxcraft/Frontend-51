# 08 — Integration Map: khatt-type-playground

Non-AI product: no AI capability bound anywhere; degradation covers *font-file and export* capabilities only. Abstract capabilities only (credential-contract.md); LOOP-5: every abstract need has a manual alternative.

## Abstract needs

| # | Abstract need | Why | Consent/grant semantics | Manual alternative (LOOP-5) |
|---|---------------|-----|-------------------------|------------------------------|
| N1 | **Font binary delivery** ("serve catalog font files for canvas rendering") | the bench renders real fonts | Grant: "Serves font files to this workspace for rendering" — read-class; no credential UI at v1 (catalog fonts are open-license; adapter binds delivery) | Catalog metadata + glyph data render text-first; canvas falls back to system stack with per-font notices (declared path) |
| N2 | **Licensed font storage** ("store the seat's attested font files") | designers bring purchased families (02 Lina) | Grant: "Stores your attested font files under this seat" — write-class; license attestation required at upload (07b rule 5); activity-logged (P17) | Work catalog-only: pairing, kashida lab, specimens, exports all complete |
| N3 | **Specimen export channel** ("write export artifacts and issue retrievable links") | export delivery needs an artifact home | Grant: "Writes export files for this seat" — write-class; artifacts expire (7-day window) with renewal (async-contract §2) | Download-and-reattach: artifact retrieved once, carried by the designer (share views still render in-app) |
| N4 | **Foundry referral data** ("display foundry names + outbound links on font profiles") | catalog provenance is part of the product's honesty | Display-only referral data, no tracking parameters; NO transactions ever (LOOP-10) | Not a capability — data; if absent, license badges render without links |

## Credential surfaces

None at v1 beyond N2's attestation checkbox (an attestation is not a credential). If implementation later binds N1/N3 to credentialed services, the credential-contract lifecycle applies (masked, kind-not-vendor, expiring-soon surfaced at point-of-use); the UI never names a vendor.

## Degradation map (non-AI adaptation of ai-native-patterns §8)

| Surface | Font files available | Font files unavailable |
|---|---|---|
| Catalog / glyph grid / pairing notes | full | full (text-first: metadata, coverage, notes) |
| Session bench canvas | full rendering | system-fallback rendering with per-font notices; controls still commit to session state |
| Kashida/alternates lab | full | settings persist + validate against the capability model; visual demo degraded, per-line readout still computed |
| Specimen composer | full | block editing + versions full; rendering degraded as above |
| Exports | full | css-tokens/json-spec still export (settings-derived); sheet/image exports pause with reason |
| Uploads (N2) | full | unavailable with explanation; catalog-only work unaffected |

Fully useful with zero capabilities bound (catalog + text-first inspection + code exports) — the LOOP-5 bar is cleared by construction.

## Risk flags

- N2 license integrity: attestation is an honesty mechanism, not legal verification; abuse posture = takedown path at binding time (12 Q-5).
- N1 delivery cost: font binaries are the bandwidth center; subset discipline is a performance obligation (10), not an integration one.
- No roster adjacency overlaps: no sibling product renders font-feature playgrounds (LOOP-3 register clean — 12 Q-10).
