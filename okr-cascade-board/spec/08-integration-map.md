# 08 — Integration Map: okr-cascade-board

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Bilingual objective-drafting assist capability** ("draft objective and key-result text pairs in EN and AR from a short focus brief") | Proposal quality beyond the deterministic lint: first drafts in both languages for a lead staring at a blank pair editor | The plain bilingual editor with the deterministic writing lint (07c rule 7 fixed tables): pair columns authored by hand, task-verb/soft-verb/length/parity findings firing as typed — the v1 default and the always-on floor; the entire cascade is authorable with N1 unbound |
| N2 | **Export delivery channel** ("deliver cycle-package and grade-report artifacts to external destinations") | Delivery automation for leadership rituals that circulate by document | Download/copy the artifact — the export-only handoff posture at v1; the artifact carries both locales' text and the deterministic trail |
| N3 | **Notification/digest channel** ("notify members of due check-ins, grace deadlines, and coverage digests") | Cross-context reach for Tariq-class participants who live outside the app (02) | In-app check-in desk + return-state surfacing on app entry (S4 badge, S5 digest view) + the copyable check-in link (share by whatever channel the team already uses); the cadence never blocks on N3 |
| N4 | **Workspace member-directory source** ("list members and teams from an external directory") | Larger groups already maintain a directory; manual member upkeep drifts | In-product member and team records (07a) — manual entry is the primary path; the directory read is a convenience binding, never a dependency |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "draft objective and key-result text in both workspace languages from focus briefs" — displayed in capability language before save (credential-contract §4), never a vendor name; `requestDraft` without the grant → PERMISSION naming the class (07b rule 6). Quota metering is visible before and after each run (P14) in units the buyer understands (draft runs, not model tokens — ai-native-patterns §4).
- N2/N3 carry no content-bearing secrets in v1 (delivery and notification only); N3 payload discipline: digests carry check-in *state* (period, zone, KR names) — never blocker free text — because notification channels are the product's least-controlled surface; the full text stays in-app and in the export.
- N4 consent scopes a read-only directory listing; grant extension to write-back (provisioning) is NOT requested at v1 and would be a LOOP-4 owner decision.
- Credential lifecycle surfaces (unverified → active → … → failed) render where the capability is used (S3 assist panel, S9 settings), never only in settings (credential-contract §3).

## Risk flags

- **N1 binding-time evaluation gate (12 Q-15)**: a fixed bilingual evaluation set must pass before N1 ships active — EN/AR pair fidelity (does the AR side read as authored Arabic, not translated-English cadence?), MSA register (فصحى بيضاء, copy-voice §3), metric extraction from focus briefs (numbers land as baselines/targets, never invented), and pair-parity honesty (the proposals themselves must pass the lint they will be judged by). No public bilingual OKR-drafting benchmark exists (research digest honest gap) — the gate is ours and disclosed as such.
- N1 privacy boundary (ai-native-patterns §9): focus briefs and proposals stay within the declared adapter operation; no silent exfiltration of cycle content; the capability is abstract with no provider named anywhere in the UI.
- N3 delivery is ambient only — no workflow blocks on a notification (async-contract §6); the overdue zone is the in-product truth, the digest is a pointer.
- **The deliberate non-need**: no two-way bridge to task/project tools, no HRIS write-back, no chat-channel bot — each would re-open LOOP-10 boundaries (meeting-notes-action-desk owns actions; performance systems are excluded on principle). Recorded so the absence is a decision, not an omission.

## AI degradation map (ai-native-patterns §8 — conditionally-AI declaration)

| Surface | Assist available | Assist unavailable / quota (rungs 2–4) |
|---|---------|--------------------------------|
| Objective/KR authoring (S3) | drafting proposals stream into the panel (P13/P15: draft-by-default, accept/edit/dismiss) | rung 4 (unbound): the panel renders the plain bilingual editor guidance — the assist affordance is absent, not disabled-mysterious; the lint runs as always. Rungs 2–3: shorter proposal sets then lint-only suggestions, each labeled non-generative |
| Deterministic lint | always on — assist-independent | always on (unchanged; the lint is a pure function, 07c rule 7) |
| Cascade board / check-in desk / cadence dashboard | full | full (unchanged — no AI anywhere in the cadence) |
| Grading console | full — grading is arithmetic | full (unchanged; there is no AI grading, ever) |
| Exports/jobs/settings | full | full |
| Coverage/at-risk derivation | full — derived by rule | full (unchanged — rules, not models) |

Non-AI core (cycles, cascade authoring, lint, check-ins, corrections, derived states, grading, export) never requires N1 — the 00 success signal tests exactly this against the Mock Adapter's assist-off configuration (`assistEnabled: false`, consent `not-granted`).
