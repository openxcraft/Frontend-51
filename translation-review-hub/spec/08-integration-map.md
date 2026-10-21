# 08 — Integration Map: translation-review-hub

Declared non-AI (ai-native-patterns §1): no operation on the adapter (07b) invokes an AI capability, and no abstract need below is required by any core workflow — the review loop, all deterministic checks, sign-off, and export complete with every capability unbound (the 00 success signal, tested against the Mock Adapter's capability-off configuration). Architecture speaks only in abstract capabilities; UI copy says kind, not vendor (credential-contract §2).

## Abstract needs (4 — all optional; manual alternatives per LOOP-5)

| # | Abstract need | Why it exists | Consent semantics (credential-contract §4) | Manual alternative (always first-class) |
|---|---------------|---------------|---------------------------------------------|------------------------------------------|
| N1 | **Content intake source** — "parses uploaded bilingual documents into segment pairs" | Teams hold translated content in files (bilingual exchange formats, exported tables) too large or too structured for hand-pasting | Grant displayed as: "Reads documents you upload and converts them into segment pairs for this workspace" — per-operation-class; extension asks explicitly if a new document shape is requested | **Paste** (paired blocks with limit annotations — 07c format) and **file upload** through the same paste parser; the sample job/glossary demonstrates the format before any credential exists |
| N2 | **Review export channel** — "delivers review packages to a destination" | Some buyers want packages filed automatically (document vaults, delivery folders) rather than downloaded | Grant: "Writes review export files on behalf of the workspace" — writes are scoped to the export class only | **Download/copy** the package (bilingual table, QA report, termbase) — the default handoff; artifacts regenerable for 7 days |
| N3 | **Notification channel** — "notifies members outside the app" | Query-addressed source owners (02 Sarah) and sign-off stakeholders live outside the review surface | Grant: "Sends notifications about review queries and sign-off events to workspace members" — message class only, per P21 tier control | **In-app notification center + daily digest** on the jobs home; queries surface on app entry (return state, async-contract §6.3) — never orphaned in email only |
| N4 | **Machine-translation assist channel** — "proposes draft target text for a segment" | Declared **out-of-scope for v1 logic** but contract-compatible (mandated by the task directive; LOOP-10 exclusion "no MT engine of its own" preserved — this is an inbound suggestion capability, never an engine) | If ever bound: grant would read "Proposes draft translations for segments you select — drafts require your confirmation before any write" (P15 review-diff gate structurally required); consent + cost transparency per ai-native-patterns §4 would apply | **The reviewer's own translation typed into the target pane** — the product's native path; a future binding only pre-fills an edit-confirmation step, never a silent write to reviewed segments |

## Capability binding gates (LOOP-7 posture — evaluated at binding time, not now)

- **N1 parse fidelity**: a fixed bilingual evaluation set (segment alignment, limit-annotation retention, mixed-script survival) must pass before N1 ships active — import errors poison every downstream finding (07c rule: findings derive from segment state).
- **N2 delivery fidelity**: package integrity at destination (the QA report is a governance artifact — corruption or partial delivery must surface as typed errors, not silent truncation).
- **N3 address hygiene**: consent-scoped recipients only; queries carry segment context but never full documents (data-minimization posture per credential-contract §7).
- **N4 (if ever activated)**: draft-quality gates are irrelevant to the review product's integrity (drafts are confirm-gated), but **cost transparency and the P15 diff-confirm step are non-negotiable**; the adapter surface would extend with a `proposeTargetDraft` operation declared through LOOP-4 before any binding.

## Degradation map (ai-native-patterns §8 — trivial by declaration, stated for completeness)

| Surface | All capabilities unbound (default v1 state) | Any capability failing mid-session |
|---|---|---|
| Review workspace, findings, glossaries, sign-off | **Full function** — deterministic checks are local rules (07c); nothing pauses | Full function — capability failures surface only on their own affordances (intake/import, export delivery, outbound notify), typed per the 7-class taxonomy |
| Document/termbase intake | Paste + file upload (the primary paths) | N1 failure → typed error + paste path offered inline |
| Export & handoff | Download/copy artifacts | N2 failure → per-format retry + manual download of what delivered |
| Notifications | In-app center + digest | N3 failure → in-app surfaces unchanged |

Quota ladder (ai-native-patterns §5) applies only to the metered platform operations (QA scan runs, export packages — P14, 07b getUsage); the deterministic checks themselves are never metered and never degrade — there is no AI rung to fall from, and the product must not fabricate one (no "reduced checking" states exist; a scan either runs or fails typed).

## Risk flags for the owner

- N1 is the highest-leverage binding (large documents are paste-hostile); its absence is honestly survivable but caps per-document volume at paste-scale (~hundreds of segments comfortably).
- N4's declaration is a forward-compatibility statement, not a roadmap commitment — activating it requires the LOOP-4 process (proposed operation, owner confirmation) and would re-open 00's exclusions discussion (LOOP-10 record in 12).
