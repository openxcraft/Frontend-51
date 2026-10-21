# 08 — Integration Map: helpdesk-triage-desk

AI declaration (ai-native-patterns §1): **conditionally-AI** — one capability may touch an AI: the **ticket-clustering assist** (N1). Every core workflow (intake, language detection, severity assessment, keyword clustering, routing, SLA clocks, merges, dispositions, exports) completes with every capability unbound — the 00 success signals test exactly that state against the Mock Adapter's all-off configuration. Architecture speaks only in abstract capabilities; UI copy says kind, not vendor (credential-contract §2).

## Abstract needs (4 — N1 optional-AI, N2–N4 optional; manual alternatives per LOOP-5)

| # | Abstract need | Why it exists | Consent semantics (credential-contract §4) | Manual alternative (always first-class) |
|---|---------------|---------------|---------------------------------------------|------------------------------------------|
| N1 | **Ticket-clustering assist** — "proposes intent clusters and ticket assignments from ticket text" | Cross-language intent discovery beyond authored keyword lists: grouping novel Arabic and English waves the signature terms do not yet cover | Grant displayed as: "Reads ticket subjects and bodies in this workspace and proposes intent clusters — proposals wait for your confirmation" — read class only; per ai-native-patterns §4, consumption surfaces before and after runs (estimated + actual assist runs per window, P14) | **The keyword engine**: authored bilingual signature terms + deterministic rule-match assignment (07c rule 3) — the product's default state, fully functional, honestly labeled "keyword engine" on every clustering result |
| N2 | **Message intake channel** — "delivers customer messages from an inbound address or form into the ticket queue" | Real pods receive email/form traffic too continuous for paste | Grant: "Reads inbound messages and creates tickets in this workspace" — intake class only; binding health is a first-class status (credential-contract §3) with intake pausing on failure (never silent drops by this product's contract) | **Paste/manual creation** — subject, body, requester, received-at; back-datable for stragglers (CP-1.3); the sample batch demonstrates the format |
| N3 | **Notification channel** — "notifies members outside the app" | Escalations and at-risk surfaces must reach leads who are not watching the console | Grant: "Sends notifications about escalations and SLA breaches to workspace members" — message class only, per P21 tier control (instant for escalations, digest for everything else) | **In-app notification center + the SLA monitor on entry** (async-contract §6.3 return state) — escalations surface on app re-entry, never orphaned in email only |
| N4 | **Triage export channel** — "files triage log artifacts to a destination" | Some buyers want the weekly digest filed into a document vault rather than downloaded | Grant: "Writes triage export files on behalf of the workspace" — write class scoped to export artifacts only | **Download/copy the artifact** — the default handoff; regenerable for 7 days, deterministic forever |

## Capability binding gates (LOOP-7 posture — evaluated at binding time, not now)

- **N1 clustering quality**: a fixed bilingual evaluation set (mixed-script tickets, dialect-bearing Arabic, cross-language duplicates) must pass before N1 ships active — proposals that miss Arabic dialect phrasing would poison the confirm queue with noise; every proposal remains confirm-gated (P15) regardless, so the worst failure mode is reviewer time, not corrupted state. Cost transparency (ai-native-patterns §4) is non-negotiable at activation.
- **N2 intake fidelity**: message-id dedupe and payload completeness must hold at the binding — a channel that re-delivers creates phantom duplicates (07b rule 6 is the contract gate); the binding's own delivery semantics (what happens to messages while intake is paused on failure) are a binding-time evaluation with the hold-or-drop posture declared, never assumed.
- **N3 address hygiene**: consent-scoped recipients only; notification payloads carry ticket number + severity + queue, never full bodies (data minimization per credential-contract §7).
- **N4 delivery fidelity**: artifact integrity at destination — the SLA ledger is an audit artifact; corruption surfaces as typed errors, not silent truncation.

## Degradation map (ai-native-patterns §8)

| Surface | All capabilities unbound (default v1 state) | Capability failing mid-session |
|---|---|---|
| Intake, language detection, severity, routing, SLA clocks, merges, dispositions | **Full function** — every one of these is deterministic local rules (07c); nothing pauses | Full function — deterministic paths have no capability dependency |
| Clustering | **Keyword engine**: authored signature terms, rule-match assignments, honest `unclustered` residue; `engine: 'keyword-rules'` on every result | Assist failure mid-run → keyword assignments already delivered are kept and marked; failed scope named for per-ticket retry (07c partial policy); next run works |
| Cluster proposals / confirm gates | Do not render (assist-only affordance — the P15 surface appears only when there is something to confirm) | Pending proposals persist unconfirmed; nothing auto-promotes (P15 holds through failures) |
| Notifications | In-app center + monitor-on-entry + digest | N3 failure → in-app surfaces unchanged |
| Exports & artifacts | Download/copy, regenerable | N4 failure → per-format retry + manual download of what delivered |

Quota ladder (ai-native-patterns §5) applies to the metered assist runs only (P14, 07b getUsage): rung 2 reduces the assist's proposal scope with an explicit notice; rung 3 falls to keyword-engine-only — which is the default state anyway, so the ladder bottoms out at full core function, never a work-blocking wall. The keyword engine itself is never metered and never degrades. Severity assessment, routing, and SLA computation are never AI and never metered.

## Risk flags for the owner

- N1 is the product's headline accelerant and its most dangerous dependency: the honest posture (deterministic floor + confirm gates) is already structural, but binding-time evaluation must specifically cover Arabic dialect phrasing (01 q7's evidence: dialect diversity is a distinct modeling challenge) — an assist that proposes English-only-shaped clusters for Arabic text would quietly undo the cross-language value.
- N2 is the highest-leverage binding (paste does not scale to a real inbox's volume); its absence caps intake at paste-scale — comfortable for evaluation and small pods, honest for everyone.
- The response platform the team already runs (the full-desk and shared-inbox classes — 01) is deliberately NOT an integration need at v1: this product hands off routed tickets through queue ownership inside the workspace and the export artifact; a future two-way bridge (ticket state sync with an external desk) would be a new LOOP-4 proposal and a new capability class, never a silent addition.
