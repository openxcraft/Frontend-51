# 07a — Data Contract: survey-insight-miner

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — exactly one capability class touches a model: the abstract **response-clustering capability** (08 N2) whose proposals land as `proposed` themes with confidence bands and pass a human confirm gate (P15). Everything else is deterministic and published: language-class detection (marker rule), tone signal (disclosed lexicon), keyword-frequency grouping (normalization + stopwords + thresholds), quote selection (coverage-length-stability formula), coverage and crosstab arithmetic — all specified exactly in 07c. When the capability is unbound, rate-limited, or failed, the keyword floor carries the whole product (degradation map in 08). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type BilingualLabel = { ar: string; en: string };   // every theme is named in both scripts from creation (00)

// ---- Workspace & projects ----

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction default (either direction is a full citizen — 05)
}

export type MetadataColumnType = 'text' | 'enum' | 'number';

export interface MetadataColumn {      // the segments the team already thinks in (city, channel, plan, satisfaction)
  id: string;
  key: string;                         // stable slug used in imports
  label: BilingualLabel;
  type: MetadataColumnType;
  distinctValueLimit: number;          // crosstab collapses to top 19 + "other" beyond this (declared: 20)
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  note?: string;
  metadataColumns: MetadataColumn[];
  sample: boolean;                     // seeded sample project (P22); clearable, never returns once cleared
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Questions & responses ----

export type LanguageClass = 'msa' | 'dialect-leaning' | 'mixed-script' | 'empty';

export interface LanguageDetection {
  langClass: LanguageClass;
  markers: string[];                   // the rule's evidence, named (e.g. ['اللي', 'بس']); empty for 'msa'/'empty'
  ruleVersion: number;                 // detection rule version at computation (07c rule 2)
  override?: {                         // human disagreement is recorded, never silent (03 CP-2.5)
    langClass: LanguageClass;
    reason?: string;
    actorMemberId: string;
    at: string;
  };
}

export type ToneClass = 'positive' | 'negative' | 'neutral' | 'mixed';

export interface ToneSignal {
  tone: ToneClass;
  lexiconHits: { positive: string[]; negative: string[] };   // verbatim matched terms — the evidence
  heuristic: true;                     // ALWAYS labeled heuristic in-product (01 q8 evidence posture)
  ruleVersion: number;
}

export interface Response {
  id: string;
  questionId: string;
  respondentRef: string;               // pseudonymous verbatim from the import; never enriched (09)
  text: string;                        // verbatim; NEVER normalized — detection/tone are views, text is data (07c rule 1)
  metadata: Record<string, string>;    // keyed by MetadataColumn.key; blanks allowed ("unspecified" bucket)
  detection: LanguageDetection;
  tone: ToneSignal;
  importBatchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  projectId: string;
  prompt: BilingualLabel;              // the question as asked (imported; editable by saveTheme-free path? no — immutable post-import, 07b)
  responseCount: number;               // derived at read
  languageMix: Record<LanguageClass, number>;   // derived at read — counts, never charts alone (09)
  toneMix: Record<ToneClass, number>;
  lastRunId?: string;
  createdAt: string;
}

// ---- Themes, memberships, quotes ----

export type ThemeProvenance = 'keyword-grouping' | 'model-proposed' | 'human-confirmed';
export type ThemeState = 'proposed' | 'confirmed' | 'merged-away' | 'deleted';

export interface Theme {
  id: string;
  questionId: string;                  // themes are per-question at v1 (12 Q-11)
  label: BilingualLabel;               // the craft act — named in both scripts (02 Dana)
  definition?: BilingualLabel;         // one line per language; the report's credibility layer
  keywords: string[];                  // the floor's anchor keywords (verbatim, normalized-matched — 07c rule 3)
  provenance: ThemeProvenance;
  state: ThemeState;
  confidenceBand?: 'high' | 'medium' | 'low';   // model-proposed only; disclosed on the card
  memberCount: number;                 // derived at read
  shareOfAssigned: number;             // derived; shares may sum past 100% — overlap honesty (07c rule 7)
  mergedIntoThemeId?: string;          // present when state = 'merged-away'
  version: number;                     // bumps on label/definition/keyword edits (audit chain)
  createdAt: string;
  updatedAt: string;
}

export interface ThemeMembership {
  id: string;
  themeId: string;
  responseId: string;
  evidence:
    | { kind: 'keyword'; matchedKeywords: string[] }          // the floor: which top-K keywords matched
    | { kind: 'model'; confidenceBand: 'high' | 'medium' | 'low' }
    | { kind: 'manual'; actorMemberId: string };              // human coding — the analyst's act (03 CP-3.5)
  assignedAt: string;
}

export interface ThemeQuote {
  id: string;
  themeId: string;
  responseId: string;
  selection:
    | { kind: 'rule'; rank: number; rationale: string }        // deterministic rule, rationale rendered (07c rule 6)
    | { kind: 'pinned'; actorMemberId: string; at: string };   // human override — pins sit above rule quotes (03 CP-3.8)
}

// ---- Derived reads (never authoritative storage) ----

export interface CoverageReport {
  questionId: string;
  responses: number;
  assigned: number;                    // responses in ≥1 confirmed or proposed theme
  unassigned: number;                  // the honest tail — stays visible (00)
  inMultipleThemes: number;            // overlap, counted not flattened
  emptyResponses: number;              // imported blank — excluded from clustering, counted here
  sharesMayExceedTotal: true;          // literal: the honesty line is structural, rendered in-surface (04 S6)
  generatedAt: string;
}

export interface CrosstabCell {
  themeId: string;
  columnKey: string;
  columnValue: string;                 // includes 'unspecified' and 'other' buckets
  count: number;
  shareWithinColumn: number;           // count / column total (responses — overlap counts in each theme row)
}

export interface Crosstab {
  questionId: string;
  columnKey: string;
  collapsedToTopValues: boolean;       // true when distinct values > 20 → top 19 + 'other'
  cells: CrosstabCell[];
  overlapFootnote: true;               // literal: rendered in-surface (06 CrosstabGrid)
  generatedAt: string;
}

// ---- The clustering run (deterministic floor + optional model proposals) ----

export interface ClusterRunParams {
  topK: number;                        // default 12 — top-K keywords become floor themes
  minGroupSize: number;                // groups below this member count stay in the keyword table, unthemed; default 5
  stopwords: 'default' | 'custom';     // the default list is disclosed in-product (07c rule 4)
}

export interface ClusterRunResult {
  questionId: string;
  engine: 'keyword-floor' | 'keyword-floor+model-proposals';
  keywordTable: { keyword: string; count: number }[];      // the floor's published intermediate (inspectability)
  groups: { themeId: string; label: string; members: number }[];   // floor groups landed as 'keyword-grouping' themes
  proposals?: { themeId: string; confidenceBand: 'high' | 'medium' | 'low'; members: number }[];
  coverage: CoverageReport;
  mode: 'deterministic-floor' | 'model-assisted-proposals'; // provenance made explicit in every result (ai-native-patterns §1)
}

// ---- Async jobs, exports, activity ----

export type JobKind = 'import' | 'clustering' | 'export';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: response rows / responses / formats
  partial?: unknown;
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;              // async-contract §5 — double-submit never double-imports/runs/exports
}

export type ExportFormat = 'theme-report' | 'coded-dataset';

export interface ExportArtifact {
  id: string;
  projectId: string;
  questionId?: string;                 // omitted = whole-project package
  formats: ExportFormat[];
  themeSetVersion: number;             // pins the state the artifact came from; flags newer-pending (03 CP-5 edge)
  expiresAt: string;                   // declared retention window at creation (7 days)
  regenerable: boolean;                // deterministic from analysis state — always true in v1
}

export interface ActivityEntry {       // P17 — the methodology defense as a data surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'project-created' | 'responses-imported' | 'run-executed'
    | 'theme-created' | 'theme-renamed' | 'theme-confirmed' | 'theme-proposal-rejected'
    | 'themes-merged' | 'theme-deleted'
    | 'response-assigned' | 'response-unassigned' | 'bulk-assigned'
    | 'quote-pinned' | 'quote-unpinned'
    | 'language-override-set' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                     // e.g. merge counts, override reason, confirm confidence — provenance audit
  at: string;
}
```

## Relationships

Workspace 1—N Project · Project 1—N Question · Project 1—N MetadataColumn · Question 1—N Response · Question 1—N Theme (per-question at v1) · Theme 1—N ThemeMembership N—1 Response · Theme 1—N ThemeQuote N—1 Response · Theme 0..N—1 Theme (mergedIntoThemeId for merged-away) · Question 1—N derived reads (CoverageReport, Crosstab — recomputed, never stored as opinions) · Job spans import/clustering/export work · ExportArtifact N—1 Project (+optional Question) · ClusterRunResult is a Job result carrying the published keyword table.

## State obligations (lifecycle invariants)

- **The verbatim is sacred**: `Response.text` is never mutated by any engine, capability, or edit — detection and tone are computed *views* with rule versions; a human language override changes `detection.override`, never the text (dialect stays dialect in every quote; ai-native-patterns §7).
- **Determinism is a contract**: identical (response texts, run params, theme definitions) yield identical floor groups, keyword tables, quote selections, coverage, and crosstabs (07c oracle). Derived fields (memberCount, shareOfAssigned, mixes, CoverageReport, Crosstab) are computed at read and never authoritative storage.
- **Confirm gate semantics**: only `confirmTheme` promotes `proposed` → `confirmed` (actor + timestamp recorded); model proposals are never auto-applied, never bulk-accepted (00 LOOP-10). A dismissed proposal id is dead for that run; re-running generates fresh proposals.
- **Confirmed themes survive re-runs**: a re-run regenerates proposals and floor groups but never mutates `confirmed` or `merged-away` themes; memberships of confirmed themes change only through explicit human operations (assign/unassign/merge).
- **Merge is an audit chain**: `mergeThemes` moves memberships to the survivor, sets the source theme `merged-away` with `mergedIntoThemeId`, re-runs quote selection over the union (pinned quotes survive marked), and records both counts in the activity detail. The merged-away theme's history is never rewritten.
- **Version pinning**: `Theme.version` bumps on label/definition edits; `ExportArtifact.themeSetVersion` pins the state an artifact came from — later mutations flag newer-pending on the artifact row, never silently re-baking. ThemeQuote pins record actor + timestamp; rule selections record rank + rationale.
- **Overlap honesty**: a response may hold N memberships (N ≥ 0); `shareOfAssigned` values may sum past 1.0 and every surface that renders shares also renders the structural honesty lines (`sharesMayExceedTotal`, `overlapFootnote` literals).
- **Empty responses are facts, not noise**: imported blank texts are counted in coverage (`emptyResponses`), excluded from clustering, and never silently dropped.
- **Partial-result policies** (async-contract §4): import delivers rows-so-far + named bad rows; a model-assisted run that loses its proposal stream completes as floor-only and says so (`engine` + `mode` fields); export delivers per-format partial with per-format retry.
- **No provider names anywhere** — intake appears as import sources and abstract needs in 08; the clustering capability appears as provenance bands, never a vendor.
