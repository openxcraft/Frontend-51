# 07a — Data Contract: translation-review-hub

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — every check in this product is a deterministic rule (normalized term matching, length arithmetic, exact/normalized consistency comparison). There is no AI operation on the adapter, no AI capability the core workflows require, and no AI affordance may appear in any surface (00/08 degradation map: nothing degrades, because nothing is bound). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';

// ---- Workspace & terminology assets ----

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction default (either direction is a full citizen — 05)
  lengthPolicyDefaults: LengthPolicy; // inherited by new review jobs; overridable per job (versioned)
}

export interface Glossary {
  id: string;
  workspaceId: string;
  name: string;
  sourceLocale: Locale;               // glossary direction must match the review job it enforces
  targetLocale: Locale;
  entryCount: number;                 // active entries
  version: number;                    // bumped on any term-entry change (audit chain)
  createdAt: string;
  updatedAt: string;
}

export type TermSeverity = 'critical' | 'advisory';   // category convention (01: Xbench-class critical vs advisory)
export type TermStatus = 'active' | 'deprecated';

export interface TermEntry {
  id: string;
  glossaryId: string;
  sourceTerm: string;                 // verbatim, in glossary sourceLocale; bidi-isolated at render
  targetTerms: string[];              // mandated renderings (≥1 when mandate = 'mandated')
  forbiddenTargets: string[];         // renderings that must NOT appear (pure blacklist entries may carry only these)
  mandate: 'mandated' | 'forbidden';
  severity: TermSeverity;             // critical blocks sign-off; advisory warns and is listed
  status: TermStatus;                 // deprecated = checks stop, history intact
  note?: string;                      // the reviewer-facing "why" (rendered in the chip detail)
  version: number;                    // findings carry the version they were computed against
  createdAt: string;
  updatedAt: string;
}

// ---- Review container ----

export interface LengthPolicy {
  proportionalBand: { min: number; max: number };  // target/source length ratio band for segments w/o declared limits
  charLimitCriticalAt: number;                    // ratio over declared limit that escalates to critical (default 1.10)
}

export interface ReviewJob {
  id: string;
  workspaceId: string;
  name: string;
  sourceLocale: Locale;               // either direction pair is first-class: en→ar AND ar→en
  targetLocale: Locale;
  glossaryId?: string;                // term checks off while unbound (honest state, 11)
  lengthPolicy: LengthPolicy;         // job-level; edits re-version the job and recompute warnings
  status: 'open' | 'signed' | 'reopened-pending';
  signOff?: SignOffRecord;            // present when status = 'signed' (immutable once written)
  counts: {                           // derived at read — never authoritative storage
    documents: number;
    segments: number;
    reviewed: number;
    openCriticalFindings: number;
    openAdvisoryFindings: number;
  };
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface SignOffRecord {
  id: string;
  reviewJobId: string;
  reviewJobVersion: number;           // the exact state that was signed
  actorMemberId: string;
  at: string;
  resolutionLedger: {                 // the audit artifact the export carries
    overrides: number;                // critical findings overridden WITH reasons
    falsePositives: number;
    acknowledgedOverflows: number;
    rejectedSegments: number;
  };
}

// ---- Documents & segments ----

export type DocumentKind = 'ui-strings' | 'long-form' | 'marketing' | 'legal' | 'other';
export type ImportSource = 'paste' | 'file-upload' | 'intake-capability';

export interface DocumentSummary {
  id: string;
  reviewJobId: string;
  title: string;
  kind: DocumentKind;
  segmentCount: number;
  importSource: ImportSource;
  lastScanAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentPair {
  id: string;
  documentId: string;
  index: number;                      // segment number — the shared referent (02 Sarah); Western numerals, physical order stable in both directions
  sourceText: string;                 // verbatim; pane renders at sourceLocale direction (pane-direction contract)
  targetText: string;                 // verbatim; pane renders at targetLocale direction
  charLimit?: number;                 // declared budget (UI strings); absence → proportional policy
  sourceRevision: number;             // late source edits re-open decisions (staleness honesty)
  targetRevision: number;             // CONFLICT base for updateSegmentTarget
  decisionState: 'unreviewed' | 'approved' | 'rejected' | 'queried';
  updatedAt: string;
}

// ---- Deterministic QA findings (one union, three kinds) ----

export type FindingState = 'open' | 'resolved';

export interface FindingResolution {
  action:
    | 'edit-resolved'                 // target edited; rule now passes (recomputed, never hand-set)
    | 'override'                      // critical finding overridden — reason REQUIRED
    | 'false-positive'                // matcher wrong; normalization note referenced
    | 'acknowledge'                   // length overflow accepted — reason REQUIRED
    | 'choose-canonical';             // consistency: sibling chosen as canonical
  reason?: string;                    // required for 'override' and 'acknowledge'
  actorMemberId: string;
  at: string;
  canonicalSegmentId?: string;        // for 'choose-canonical'
}

export interface QaFindingBase {
  id: string;
  reviewJobId: string;
  documentId: string;
  segmentPairId: string;
  kind: 'term' | 'length' | 'consistency';
  state: FindingState;
  resolution?: FindingResolution;     // present iff state = 'resolved'
  computedAt: string;                 // scan/segment-recompute stamp
}

export interface TermViolation extends QaFindingBase {
  kind: 'term';
  termEntryId: string;
  termVersion: number;                // pin: the entry version this was computed against (audit honesty)
  detail: 'missing-mandated' | 'forbidden-present' | 'preferred-variant';
  severity: TermSeverity;             // mirrors the term entry at computation time
  match?: {                           // present when the target contains a non-preferred/forbidden rendering
    matchedText: string;
    start: number;                    // offsets into targetText
    end: number;
    matcher: 'exact' | 'normalized';  // normalized = rtl-rules §4 ruleset disclosed in-product
  };
  mandatedText?: string;              // the fix, one glance away (chip + rail)
}

export interface LengthFitWarning extends QaFindingBase {
  kind: 'length';
  severity: 'advisory' | 'critical';  // critical iff ratio > charLimitCriticalAt on a declared limit (07c rules)
  policy: { type: 'char-limit'; limit: number } | { type: 'proportional'; band: { min: number; max: number } };
  measured: {
    targetLength: number;             // character count, Western numerals at display
    ratio: number;                    // targetLength/limit, or targetLength/sourceLength for proportional
  };
}

export interface ConsistencyFinding extends QaFindingBase {
  kind: 'consistency';
  severity: 'advisory';               // consistency findings advise; humans choose the canonical rendering
  variant: 'source-same-target-differs' | 'target-term-differs-source';
  siblingSegmentIds: string[];        // jump links in the rail/console (03 CP-2.8)
  exemplarTexts: { segmentIndex: number; targetText: string }[];   // the differing renderings, verbatim
}

export type QaFinding = TermViolation | LengthFitWarning | ConsistencyFinding;

// ---- Decisions (the human layer) ----

export interface ReviewDecision {
  id: string;
  segmentPairId: string;
  actorMemberId: string;
  kind: 'approve' | 'reject' | 'query';
  comment?: string;                   // required for 'reject'; free-form for others
  query?: {
    addresseeMemberId: string;        // the source-content owner (02 Sarah)
    question: string;
    answer?: string;                  // appended history — never silently re-opens a standing decision
    answeredAt?: string;
  };
  supersededByDecisionId?: string;    // decision history is a chain, never overwritten
  at: string;
}

// ---- QA report (aggregate, derived) ----

export interface QaReport {
  reviewJobId: string;
  documentId?: string;                // omitted = whole-job aggregate
  findings: {
    term: { open: { critical: number; advisory: number }; resolved: { critical: number; advisory: number } };
    length: { open: { critical: number; advisory: number }; resolved: { critical: number; advisory: number } };
    consistency: { open: number; resolved: number };
  };
  decisionProgress: { unreviewed: number; approved: number; rejected: number; queried: number };
  missingTranslations: number;        // empty targets — sign-off blockers (category check, 01 q2)
  gate: {
    blocked: boolean;
    blockers: { findingId?: string; segmentPairId?: string; kind: 'critical-finding' | 'unreviewed-segment' | 'missing-translation' }[];
  };
  generatedAt: string;
}

// ---- Async jobs, exports, activity ----

export type JobKind = 'import' | 'scan' | 'export';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: segment pairs / rows / formats
  partial?: unknown;                  // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;             // async-contract §5 — double-submit never double-imports/scans/exports
}

export type ExportFormat = 'bilingual-table' | 'qa-report' | 'termbase';

export interface ExportArtifact {
  id: string;
  reviewJobId: string;
  formats: ExportFormat[];            // the package's parts; per-format retry on partial failure
  signedReviewJobVersion?: number;    // carries the signed state; flags newer pending state at handoff (03 CP-5 edge)
  expiresAt: string;                  // declared retention window at creation
  regenerable: boolean;               // deterministic from review state — always true in v1
}

export interface ActivityEntry {      // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'job-created' | 'document-imported' | 'scan-run'
    | 'segment-decided' | 'bulk-decided' | 'target-edited'
    | 'finding-resolved' | 'term-saved' | 'term-deprecated' | 'term-deleted'
    | 'glossary-created' | 'signed-off' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                    // e.g. override reason, scan finding counts — provenance audit
  at: string;
}
```

## Relationships

Workspace 1—N Glossary · Workspace 1—N ReviewJob · Glossary 1—N TermEntry (versioned) · ReviewJob N—1 Glossary (optional; pins glossary + term versions per finding) · ReviewJob 1—N Document · Document 1—N SegmentPair · SegmentPair 1—N ReviewDecision (chain via supersededByDecisionId) · QaFinding N—1 SegmentPair (polymorphic on kind; TermViolation N—1 TermEntry-at-version) · ReviewJob 1—N QaReport (derived snapshots) · ReviewJob 1—0..1 SignOffRecord (immutable) · ReviewJob 1—N ExportArtifact · Job spans import/scan/export work.

## State obligations

- **Determinism is a contract**: identical (segment state, glossary term versions, length policy) always yields identical findings; findings are never hand-created or hand-closed — `edit-resolved` is recomputed by the rule, and every other resolution records the human actor and reason where required.
- **Version pinning**: TermViolation carries `termVersion`; edits to a term entry do not retroactively mutate existing findings — the next scan or per-segment recompute uses the new version. SignOffRecord pins `reviewJobVersion`. ExportArtifact carries the signed version and flags newer pending state.
- **Sign-off is a gate, not a checkbox**: sign-off succeeds only with zero open critical findings, zero missing translations, zero unreviewed segments (QaReport.gate); post-sign-off mutations set status `reopened-pending` — the old signature stays immutable.
- **Decision history is a chain**: re-deciding appends and supersedes; answered queries append, they never silently reopen a standing decision (03 CP-2 edge).
- **Source staleness re-opens decisions**: a source-side edit bumps `sourceRevision`; segments whose decision predates it render staleness and the decision re-opens.
- **Partial-result policies** (async-contract §4): import delivers rows-so-far + named bad blocks; scan is per-segment and re-runnable (no all-or-nothing); export delivers per-format partial with per-format retry.
- **No provider names anywhere** — intake appears as `ImportSource` values and abstract needs in 08.
