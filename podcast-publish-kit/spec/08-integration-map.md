# 08 — Integration Map: podcast-publish-kit

## Abstract needs (LOOP-5: every capability has a manual alternative; the product is fully useful with zero credentials)

| # | Abstract need | Why it exists | Consent semantics (credential-contract §4) | Manual alternative (first-class, never buried) |
|---|---------------|---------------|---------------------------------------------|--------------------------------------------------|
| N1 | **Transcript source** ("pull transcripts from an external provider of transcripts") | Podcasters produce transcripts in dedicated workflows; pulling avoids re-pasting | Grant shown pre-save: "يقرأ تفريغات الحلقات باسم مساحة العمل" / "Reads episode transcripts on behalf of the workspace"; read-only class; verification exercises one real fetch | **Paste** — always works, zero setup (CP-1.4); file import from disk |
| N2 | **Publication channel** ("receive and publish episode packages") | The hosting/upload step the podcaster already has | Grant: "يستقبل حزم الحلقات وينشرها باسم مساحة العمل" / "Receives episode packages and publishes them for the workspace"; write class scoped to packages only; rotating grace window per credential-contract §3 | **Download + manual upload** — the package bundle (chapters file + notes + metadata) downloads and is uploaded to the host by hand; this path sits beside delivery in the same UI, never below it |
| N3 | **Chapter-suggestion assist** (the declared AI capability — conditionally-AI) | Boundary/title drafting from transcripts is genuinely assistive | No credential class: it is a product-internal capability consumed under the metered quota (P14); privacy boundary per ai-native-patterns §9 — transcript content never leaves the product's data contract through the assist | **Manual chapter marking** — the complete core path (segment-anchored, no timecodes typed); the assist only ever drafts (P15) |
| N4 | **Notification channel** ("notify the team about job completions") | Import/build/delivery completions while the podcaster is elsewhere | Grant: "يرسل إشعارات اكتمال المهام إلى قناة إشعار مساحة العمل" / "Sends job-completion notifications to the workspace's notification channel"; per-class tier control (P21: instant for delivery, digest otherwise) | **In-app return state** — unfinished and recently-finished jobs surface on the relevant screen at re-entry (async-contract §6 rung 3, always on) |

## Risk flags (binding-time obligations)

- **N3 assist quality on Arabic transcripts** is the wedge-defining risk: dialect-heavy or mixed-script transcripts may yield poor boundary suggestions. Binding-time evaluation set required (fixed dialect/mixed fixtures; rationale text auditable per suggestion — the acceptance review makes quality visible per run). Mirrors the portfolio pattern: guardrail promises get evaluation gates (12 Q-5).
- **N2 channel semantics** vary per host (what a "package delivery" means — chapters file support is inconsistent across the ecosystem per 01 [28][30]): delivery is validated against the channel's declared capabilities at binding; the BOTH-formats export is the default posture.
- **N1 transcript timing fidelity** gates the unique feature: untimed or drifting segment timings degrade chapter timecodes; import reports coverage and drift honestly, never silently (07c behavior).

## Degradation map (ai-native-patterns §8 — conditionally-AI)

| Surface | Assist available | Assist degraded (rungs 2–3: reduced/template) | Assist unavailable (rung 4) |
|---|---|---|---|
| Transcript import & alignment | full | full (deterministic — no assist involvement) | full |
| Chapter marking | suggestions + manual, both first-class | fewer/shorter suggestion drafts, labeled | **manual marking only — complete function**; suggestion entry point renders unavailability with reset estimate (11 §E) |
| Show notes composition | full (notes drafting is manual by design; assist never writes notes at v1 — declared scope) | full | full |
| Checklist & packaging | full | full | full |
| Delivery/credentials | full | full | full |

Non-AI core (import, marking, notes, checklist, packaging, export, delivery) never requires the assist — the quota ladder (ai-native-patterns §5: reduced → template-suggestion → clean unavailability with reset time) applies ONLY to suggestion runs, in the buyer's work units (runs/month), warn at 80% (P14).

## Privacy boundaries

Transcript and notes content stays within the 07a data contract; the assist operates as a declared adapter operation (`suggestChapters`) and nothing else exfiltrates content (ai-native-patterns §9). Audio never enters the contract at all (client-side local reference only — 07a recorded rule).

## Credential ownership

Channel credentials belong to the workspace (credential-contract §5): owner manages lifecycle; editor may deliver with an active credential but not create/revoke (role model in 07b Session). Every credential event (create/verify/revoke/failure) appends to the activity log (P17). No secret ever renders outside the single creation-time display (§2, §7 never-events).
