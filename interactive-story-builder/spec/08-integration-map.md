# 08 — Integration Map: interactive-story-builder

All needs are ABSTRACT capabilities — no provider chosen at spec time (LOOP-5/LOOP-13). The core product (authoring, sync, QA, review, template-based structure) requires ZERO of them: external media URLs + downloadable exports make it fully useful pre-integration.

## Abstract needs

| # | Abstract need | Why | Consent semantics (credential-contract §4) | Manual alternative (LOOP-5) |
|---|---|---|---|---|
| N1 | **Narrative-structure suggestion capability** ("propose chapter/step outlines from a brief") | Structure drafting velocity (CP-4) | Pre-run grant: "reads the story brief you submit; returns structure proposals; nothing is applied without your confirmation". Quota before/after (P14). Data boundary: prompts contain only the submitted brief (ai-native-patterns §9) | Deterministic chapter templates (listTemplates) — first-class, labeled non-generative; manual outlining in the editor |
| N2 | **Media file storage capability** ("store and serve story media") | Stable, hosted media for long stories and exports | Grant: "writes media files for this workspace; serves them to exported stories" | External media URLs typed into MediaRef.sourceUrl — always supported, QA-checkable |
| N3 | **Export/render channel** ("render final story artifacts") | Server-side rendering beyond browser patience | Grant: "renders story artifacts from this workspace's content" | Client-rendered export path with honest progress; downloaded bundle is the deliverable |
| N4 | **Story delivery channel** (optional) ("host/publish rendered stories") | Direct publishing someday | Grant: "publishes approved story versions on behalf of the workspace" — per-version consent; approval state required first | Download bundle / embed package → host anywhere (LOOP-10: no site building, no hosting claims) |

## Credential presentation (binding)

Capability language only: "Suggestion capability credential" · "Media storage credential" · "Export renderer credential" · "Delivery channel credential". Masked by default; lifecycle states (unverified → active → rotating → expiring-soon → expired → revoked → failed) surface where the capability is used, never only in settings; every credential event appends to the activity log (P17); never-events honored (no secret in URLs/exports/announcements).

## Risk flags

- N1 quality gate: outline usefulness evaluated at binding time against a fixed bilingual evaluation set (12 Q-2) — the degradation ladder keeps the product safe regardless.
- N2/N4 are hosting-adjacent; N4 must not grow into site building (LOOP-10 boundary — single-story delivery only).
- Media rights/DRM out of scope: credit/alt-text discipline (QA) only, no rights-management claim.

## Degradation map (ai-native-patterns §8 — binding)

| Surface | N1 available | N1 unavailable (rung 3–4) |
|---|---|---|
| Library / outline / step editor / sync / QA / review | full | full (deterministic authoring never requires AI) |
| "Suggest structure" | generated outlines (draft, review diff, per-item opt-out) | deterministic audience-arc templates, labeled non-generative; clean unavailability + reset time if even templates are unreachable |
| Exports when N3 unavailable | server-rendered artifacts | client-rendered path with progress honesty; bundle download remains |

Quota ladder rungs 2–3 (shorter outlines; template-only) labeled per ai-native-patterns §5.
