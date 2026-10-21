# 08 — Integration Map: social-clip-cutter

## Abstract needs (LOOP-5: every capability has a manual alternative; the product is fully useful with zero credentials and zero render binding)

| # | Abstract need | Why it exists | Consent semantics (credential-contract §4) | Manual alternative (first-class, never buried) |
|---|---------------|---------------|---------------------------------------------|--------------------------------------------------|
| N1 | **Media source import** ("pull transcripts from an external media source the team already uses") | Teams hold episode transcripts in their production stack; pulling avoids re-pasting hour-long text | Grant shown pre-save: "يقرأ التفريغات باسم مساحة العمل" / "Reads transcripts on behalf of the workspace"; read-only class; verification exercises one real fetch | **Paste** — always works, zero setup (CP-1.3); file import from disk. The media itself NEVER imports at all: playback is a local reference (07a recorded rule), so the media-source need is transcript-only by design |
| N2 | **Render/export capability** ("burn captions into vertical clip masters") | Burned-in 9:16/1:1/16:9 masters are the deliverable short-form platforms consume without caption-toggle support | Product-internal capability at v1 (the simulated async stage in 07c); declared abstract for binding-time — if a binding later requires an external render grant, it will follow credential-contract §4 with a scoped write class shown pre-save | **The export recipe** — sidecar SRT/VTT caption files + boundary timecode sheet + the burn-in spec manifest (a complete, human-readable rendering instruction set for any external editor). Downloadable without rendering, unlimited, and co-equal in the export composer (CP-5.6). This is the declared path for teams whose render pipeline is their own NLE |
| N3 | **Notification channel** ("notify the team about job completions") | Import/export completions while the operator is elsewhere | Grant: "يرسل إشعارات اكتمال المهام إلى قناة إشعار مساحة العمل" / "Sends job-completion notifications to the workspace's notification channel"; per-class tier control (P21: instant for blocking exports, digest otherwise) | **In-app return state** — unfinished and recently-finished jobs surface on the board and exports library at re-entry (async-contract §6 rung 3, always on — the seed's expired notification credential proves the fallback) |

## Risk flags (binding-time obligations)

- **N2 render fidelity on Arabic captions** is the wedge-defining risk: the burned-in master must match the spec's bidi/line policy exactly (the documented NLE breakage class — 01 evidence). Binding-time evaluation set required: the ES-1/ES-2 fixtures (mixed-direction runs, tashkeel mode, safe-zone geometry) rendered and diffed against the spec manifest; the lint warnings must reproduce identically in the rendered output. Mirrors the portfolio pattern: the guardrail promise gets an evaluation gate (12 Q-5).
- **N1 transcript timing fidelity** gates the anti-drift spine: segment timings that drift from the media corrupt every derived timecode; import reports coverage honestly, and the ±2s re-anchor rule (07c) is the tolerance — binding must verify against real transcript sources' timing quality.
- **N3 channel semantics** vary per destination (what a "job notification" means); delivery is validated against the channel's declared capabilities at binding; the in-app return state is the unconditional floor.

## Degradation map (ai-native-patterns §8 discipline applied to a NON-AI product)

There is no AI capability to degrade (00 declaration). The degradable classes are the metered render window and the credential-backed conveniences:

| Surface | Render window healthy | Render window exhausted (P14 rung 4) | Credential degraded |
|---|---|---|---|
| Transcript import & alignment | full (paste always; pull when credential active) | full | pull path offers paste inline (NETWORK/degraded copy names the credential + date) |
| Search, selection, heuristics | full — never metered | full — never metered | full |
| Boundary refinement | full | full | full |
| Burn-in studio + lint | full | full (lint is local and deterministic) | full |
| Export | render mode + recipe mode, co-equal | **recipe mode only — complete function**: caption files + timecodes + spec manifest, unlimited; clean-unavailability state with reset time on the render path (11 §C) | full (recipe never touches credentials) |
| Job notifications | in-app + channel | in-app + channel | in-app return state only (seed-fixture proof) |

The core workbench (import via paste, search, heuristic pass, selection, boundaries, specs, lint, recipe export) is useful with zero credentials and zero render minutes — the LOOP-5 bar, provable on the Mock Adapter in one session (00 success signals).

## Privacy boundaries

Transcript and clip content stays within the 07a data contract; the heuristic pass is a local deterministic function, not an external capability — content never leaves the contract through selection (ai-native-patterns §9 analog for non-AI products: the only content-bearing external surface is the declared transcript pull and the declared render/export, both abstract and consented). Media bytes never enter the contract at all (local reference only).

## Credential ownership

Credentials belong to the workspace (credential-contract §5): owner manages lifecycle; editor may import via an active media-source credential and export, but not create/revoke credentials. Every credential event (create/verify/revoke/failure) appends to the activity log (P17, `listActivity`). No secret ever renders outside the single creation-time display (§2, §7 never-events).
