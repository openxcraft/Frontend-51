# 08 — Integration Map: arabic-copy-studio

SME-G + SME-H pass · External touchpoints expressed ONLY as abstract needs (LOOP-5/7/13 discipline). Core value requires ZERO integrations — the product is fully functional standalone against the Mock Adapter.

## Abstract needs (all optional; none chosen)

| # | Abstract need | Why it would exist | Manual alternative (pre-integration usefulness, credential-contract §6) |
|---|---------------|--------------------|------------------------------------------------------------------------|
| N1 | **Outbound document delivery** ("deliver formatted document to an external destination") | Reviewers/clients live outside the workspace; Omar hands approved copy to campaign owners | Export artifact download + paste; clipboard bundle (CP-5) — fully covers the workflow today |
| N2 | **Usage digest messaging** ("send a periodic summary message to workspace members") | Omar wants weekly usage/quota digests without logging in | Usage screen (S12) + manual sharing of the audit export |
| N3 | **Term-sheet file ingestion** ("parse an uploaded structured file into glossary terms") | Teams hold glossaries as sheets | CSV/TSV paste into the import flow (07c mock demonstrates the paste path); template file downloadable in-app |
| N4 | **External identity sign-in** ("prove member identity via an external identity system") | Enterprise buyers will demand workspace SSO at purchase time | Email-invite member model (S14) suffices for v1 scale; session contract (07b) is already identity-agnostic so binding later changes no UI |
| N5 | **AI text capability** ("generate/transform text per the declared operations") | The AI operations must run somewhere real eventually | The product remains a complete bilingual writing environment without it (degradation rung 4 in 11); mock serves development |

## Risk flags (LOOP-7 style, for later batches' owners)

- N1 delivery formats depend on destination capabilities; no public contract exists for arbitrary destinations — treat as destination-specific bindings, each with its own risk assessment at binding time.
- N5 capability choice (any AI text engine) has quality/latency/cost variability; the 07b contract deliberately demands normalization and citation events so the UI never depends on engine specifics. Register-consistency quality gates (ai-native-patterns §7) are evaluated at binding time with a fixed evaluation set — recorded as owner decision (12).

## Degradation map (ai-native-patterns §8)

| Surface | AI available | AI reduced (rung 2) | Templates (rung 3) | Unavailable (rung 4) |
|---|---|---|---|---|
| Editor, revisions, review, export | full function, AI panel live | shorter suggestions, notice shown | brief templates + phrase bank, labeled non-generative | drafting/editing/versioning/review/export fully functional; AI panel shows clean unavailability + reset time |
| Glossary manager | AI-assisted import conflict hints | hints off, manual resolve | manual only | manual only (unchanged) |
| Parity Weave | transform live | reduced block concurrency | no transform; manual bilingual columns (P23 editing only) | manual columns; parity flags from inspectText unavailable |

No integration, credential, or provider is named anywhere in the product UI; capability language per credential-contract §2.3.
