# 08 — Integration Map: attendance-shift-planner

SME-G + SME-H pass · Declared **non-AI** (ai-native-patterns §1): no operation on the adapter (07b) invokes an AI capability and no need below is an AI need — the N-list contains no AI entry, and no AI degradation ladder applies (there is no rung to fall from; the deterministic engine is local rule arithmetic over versioned data). Architecture speaks only in abstract capabilities; UI copy says kind, not vendor (credential-contract §2). Core value requires **zero integrations**: the full loop — roster, rulesets, grid authoring, guardrails, publication gate, export, swap recording — completes against the Mock Adapter with every capability unbound (the 00 success signals; 07c's capability-off configuration is the tested state).

## Abstract needs (4 — all optional; manual alternatives per LOOP-5)

| # | Abstract need | Why it exists | Consent semantics (credential-contract §4) | Manual alternative (always first-class) |
|---|---------------|---------------|---------------------------------------------|------------------------------------------|
| N1 | **Schedule export channel** — "delivers the published-plan artifact in the marketplace-compatible format to an external scheduling or swap system" | The published week must reach the swap system (shift-swap-marketplace class) or an incumbent roster tool; hand-downloading does not scale past weekly cadence across branches | Grant displayed as: "Writes published-schedule export files on behalf of the workspace" — write class scoped to export delivery; re-publish never rewrites a delivered artifact, it delivers a new one (immutability travels) | **Download / copy / print the export bundle** (team grid, worker views, marketplace-compatible format — 07c's declared artifact schema). The manual handoff is the v1 default: the artifact is the boundary object, not a live connection |
| N2 | **Schedule change channel** — "receives agreed-swap notifications from external swap systems" | When the group runs a swap marketplace, confirmed swaps should flow back without the supervisor re-typing them | Grant: "Reads agreed-swap change notices for this workspace and applies them as pending amendments" — read/apply class; every applied change still lands as a human-confirmed pending amendment (P15 discipline carried structurally) | **Paste a swap set** (07c format — one line per agreed swap) or **record a single swap manually** (CP-4.2, phone-sized). Paste never requires consent, ever (07b rule 5) |
| N3 | **Notification channel** — "notifies workers and supervisors outside the app that a plan is live or amended" | The floor reads the plan on phones; a published week nobody knows about is operationally unpublished | Grant: "Sends schedule-publication and amendment notifications to workspace members" — message class only, P21 tier control (publication = instant, amendment = instant, waiver digests = digest tier) | **Shareable in-workspace published-plan view** (S9 worker review — link-share, no login ceremony for readers) + the exported worker-view slips for printing/posting; return-state surfaces unfinished amendments on app entry (async-contract §6.3) |
| N4 | **Worker identity source** — "proves supervisor/planner identity via an external identity system" | Multi-branch groups will ask for workforce sign-on at purchase time; the v1 session model is the honest smaller choice | Grant: "Verifies workspace members through your identity system" — identity class; roles (owner/planner/supervisor/viewer) stay the product's own (07b Session is auth-agnostic by contract) | **Workspace session model** with the four seeded roles — the adapter never learns the identity mechanism, so a later binding changes no UI surface |

## Capability binding gates (LOOP-7 posture — evaluated at binding time, not now)

- **N1 fidelity gate**: a delivered marketplace-compatible artifact must round-trip its declared schema byte-exactly (07c format) — a truncated or re-ordered artifact poisons the receiving system's import; delivery failures surface as typed errors per the 7-class taxonomy, never silent truncation.
- **N2 conflict gate**: an inbound change notice colliding with a newer publication (the week was superseded) must surface as CONFLICT naming the live publication (07b rule 3) — the binding must honor the amendment state machine or refuse loudly; a swap arriving for a different week is rejected naming both week starts (07c validation order).
- **N2 provenance gate**: every applied change records from/to/agreed-at/source (07a AssignmentProvenance) — a binding that strips provenance to "an update" is rejected: the swap log is the boundary's audit artifact (12 Q-4).
- **N3 scope gate**: notifications carry plan-level facts (week, team, publication actor) — never full rosters or worker-level detail strings in payloads; credential-contract §7 never-events apply (no payload in URLs/logs).
- **N4 role gate**: the binding may authenticate, never authorize — role assignment stays inside the workspace session model; an identity binding that implies "all authenticated users are planners" is a rejection.

## Degradation map (ai-native-patterns §8 — trivial by declaration, stated for completeness)

| Surface | All capabilities unbound (default v1 state) | Any capability failing mid-session |
|---|---|---|
| Planning grid, guardrails, violation inspector, waivers, publication gate | **Full function** — the engine is local deterministic arithmetic (07c); nothing pauses, nothing degrades | Full function — capability failures surface only on their own affordances, typed per the 7-class taxonomy |
| Export & handoff (S5) | Download/copy/print artifacts; expiry + regeneration declared (07c) | N1 failure → per-format retry + manual download of what delivered (the seeded job-004 fixture) |
| Swap-in paths (S6) | Paste swap set + manual single record — the primary v1 paths | N2 failure → typed error, paste path offered inline (credential-contract §4 posture) |
| Worker/supervisor review (S9) | Shareable in-workspace published-plan view + printed slips | N3 failure → in-app surfaces unchanged; return state still surfaces amendments |
| Sign-in (all) | Workspace session model, four roles | N4 failure → session model unchanged |

Quota ladder (ai-native-patterns §5) applies only to the four metered platform operations (guardrail scans, roster pastes, swap-set imports, exports — P14, 07b getUsage). The deterministic checks inside every grid mutation are **never metered and never degrade** — a placement either re-checks or fails typed; there is no "reduced checking" state and the product must never fabricate one.

## Risk flags for the owner

- N1+N2 together are the shift-swap-marketplace adjacency made mechanical (LOOP-3, 12 Q-4): both products' specs keep the boundary a **text artifact**, not a shared entity — binding N1/N2 into a live pipe is a cross-product contract decision for the owner (re-publish semantics, conflict resolution on double-application), not a silent v1 default. The sibling's own integration map records the same posture from its side (its N1 risk flag).
- N3 is the highest-leverage buyer-facing binding (the floor's "is the plan out?" question); its absence is honestly survivable — printed slips + the shareable review view were the status quo's only virtue, kept on purpose.
- N4 is the lowest-risk binding (auth-agnostic session by contract) but the highest procurement pressure; deferring it costs nothing structural.
