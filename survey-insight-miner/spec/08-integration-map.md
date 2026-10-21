# 08 — Integration Map: survey-insight-miner

**Conditionally-AI declaration** (ai-native-patterns §1): exactly one capability class touches a model — the abstract **response-clustering capability** (N2). Every other engine (detection, tone, keyword floor, quote selection, coverage, crosstab) is deterministic and published (07c). Architecture speaks only in abstract capabilities; UI copy says kind, not vendor (credential-contract §2). No core workflow requires any capability: the full journey — import, detect, floor-cluster, curate, quote, cover, crosstab, export — completes with every capability unbound (the 00 success signal, tested against the Mock Adapter's default `capability: 'unbound'` state).

## Abstract needs (4 — all optional; manual alternatives per LOOP-5)

| # | Abstract need | Why it exists | Consent semantics (credential-contract §4) | Manual alternative (always first-class) |
|---|---------------|---------------|---------------------------------------------|------------------------------------------|
| N1 | **Response intake source** — "parses uploaded survey response exports into question and response rows with metadata columns" | Teams hold response exports in files (CSV-ish exports from their collection platform) too large or too structured for hand-pasting; per-wave imports repeat | Grant displayed as: "Reads survey response files you upload and converts them into responses for this workspace" — per-operation-class; a new export shape asks for explicit extension | **Paste** (rows of `respondent-ref \| response text \| metadata values` — 07c format, taught by the sample project) and **file upload** through the same parser; the intake preview shows per-row detection before anything commits |
| N2 | **Response-clustering capability** — "proposes refined themes for a question's responses" | The floor is a grid; a model can propose themes the keyword table cannot express (multi-word concepts like "خيارات التغليف"); proposals are confirm-gated, so binding it accelerates curation without touching integrity | Grant: "Proposes themes for responses you select a run for — every proposal requires human confirmation before it becomes a theme" (P15 gate is structural: `confirmTheme` is the only promotion path, 07b rule 2); consent + cost transparency per ai-native-patterns §4; quota window with 80% warning (P14) | **The keyword-frequency floor** — deterministic, disclosed, unlimited, and never metered; it is not a fallback shaped like an apology, it is the product's auditable backbone (01 q5: buyers explicitly notice when tools hide their keyword layer) |
| N3 | **Export destination channel** — "delivers theme reports and coded datasets to a destination" | Research pods file deliverables into client vaults and delivery folders rather than downloading | Grant: "Writes export files on behalf of the workspace" — writes scoped to the export class only | **Download/copy** the report and dataset (the default handoff); artifacts regenerable for 7 days, deterministic forever |
| N4 | **Notification channel** — "notifies members outside the app" | Run and export completion matters to people who left the surface mid-wave (02 Mariam's deadline) | Grant: "Sends notifications about clustering runs and export completions to workspace members" — message class only, per P21 tier control | **In-app jobs feed + return-state surfacing** (async-contract §6.3): unfinished and recently-finished jobs appear on the relevant surface at app re-entry — never orphaned in a notification center only |

## Capability binding gates (LOOP-7 posture — evaluated at binding time, not now)

- **N1 parse fidelity**: a fixed bilingual evaluation set (row structure, metadata mapping, mixed-script survival, empty-text retention) must pass before N1 ships active — import errors poison every downstream engine (07c: all engines derive from response state). Empty texts must survive as empties, dialect must arrive verbatim.
- **N2 proposal quality floor + containment**: proposals must carry per-member confidence evidence; the gate's `membersExcluded` (below-evidence-floor) preview must be truthful against the underlying membership set; **the confirm gate, provenance bands, and the never-auto-apply rule are non-negotiable** — a binding that cannot express evidence per member does not bind. Cost telemetry in work units (model-assisted runs), never tokens (ai-native-patterns §4).
- **N3 delivery fidelity**: report/dataset integrity at destination (a research deliverable corrupted in transit must surface as a typed error, not a silent truncation).
- **N4 address hygiene**: consent-scoped recipients only; notifications carry run/export context, never response verbatims (respondent data minimization per credential-contract §7).

## Degradation map (ai-native-patterns §8 — the conditionally-AI ladder, stated per surface)

| Surface | All capabilities unbound (default v1 state) | N2 failing / rate-limited mid-session |
|---|---|---|
| Theme board, reader, curation, quotes, coverage, crosstab | **Full function on the floor** — deterministic engines are local rules (07c); provenance reads `keyword-grouping`; the disclosure panel shows exactly what ran | Unchanged — only the proposal stream is N2's; confirmed and keyword-derived themes never pause |
| Clustering runs | Floor-only runs (`engine: 'keyword-floor'`, `mode: 'deterministic-floor'`) — the tested default | Model-assisted runs degrade: quota → RATE_LIMIT ladder with reset time and the floor offered inline (rung discipline — the product stays useful at every rung); stream failure mid-run → run completes floor-only, typed error on the job, retry re-requests proposals for unconfirmed groups only (partial-result policy) |
| Import | Paste + file upload (primary paths) | N1 failure → typed error + paste path offered inline |
| Export & handoff | Download/copy artifacts | N3 failure → per-format retry + manual download of what delivered |
| Notifications | In-app jobs feed + return state | N4 failure → in-app surfaces unchanged |

Quota ladder (ai-native-patterns §5) applies to exactly two metered classes: model-assisted runs and export packages (P14, 07b getUsage). The keyword floor, detection, tone, quotes, coverage, and crosstab are **never metered and never degrade** — there is no rung below them, and the product must not fabricate one (a floor run either runs or fails typed; no "reduced checking" states exist).

## Risk flags for the owner

- N2 is the highest-leverage binding (proposal quality is the curation accelerant) and the lowest-risk one *because* of the gate: a bad model wastes analyst attention, never integrity. The floor is the product.
- N1 is the volume path (paste caps comfortable scale at ~hundreds of rows); its absence is honestly survivable and caps per-question size at paste-scale.
- A future two-way bridge back into the team's collection platform (writing coded results beside the source survey) would be a new capability class requiring LOOP-4 owner confirmation FIRST and would re-open the 00 exclusions discussion; nothing lands silently (12 Q-17).
