# 07a — Data Contract: kyc-onboarding-flow (backend-agnostic)

SME-G pass · Entities, relationships, state machines. Every entity/operation below is justified by a flow in 03; every operation appears as an adapter method in 07b (bidirectional no-orphan proof in 03 Tables A/B). No backend, provider, engine, storage, or transport is named — this is the source of truth from which any backend can be built or bound. **TypeScript types only** (types + pure interface shapes; no implementation code).

## Entities (TypeScript)

```ts
// ===== Locales & people =====
export type Locale = 'ar' | 'en';
export type ConsoleRole = 'reviewer' | 'admin';   // two structural roles (04); applicants are NOT console roles

export interface User {
  id: string;
  workspaceId: string;
  displayName: string;            // bidi-isolated on render (rtl-rules §2)
  role: ConsoleRole;
  locale: Locale;                 // console locale — independent of applicant locales
  status: 'active' | 'suspended';
  joinedAt: string;
}

// The person applying. Contact identity is the resume key; PII is bounded
// to what the flow itself collected (09 privacy posture; 08 consent semantics).
export interface Applicant {
  id: string;
  workspaceId: string;
  contactRef: string;             // channel-abstract contact identifier (phone/email class, canonical)
  displayName: string | null;     // may be null until the identity step completes
  locale: Locale;                 // applicant-facing notice locale
  firstApplicationAt: string | null;
  totalApplications: number;
}

// ===== The flow program (versioned; in-flight applications pin their version) =====
export type StepKind =
  | 'identity-fields'            // one-question-per-screen micro-steps (P09)
  | 'document-capture'           // the coached capture step (CP-3)
  | 'presence-capture'           // policy-optional selfie-class step (LOOP-10: capture-only semantics)
  | 'contact-verification'       // channel-abstract contact confirmation (08 N3)
  | 'disclosures'                // data-use / consent reading step
  | 'review-submit';             // the summary + attestation step (CP-4)

export interface DocumentTypeSpec {
  code: string;                  // workspace-configured catalog code ('national-id', 'residence-permit', ...) — DATA, never hard-coded geography (01 §4.5)
  labelAr: string;
  labelEn: string;
  sides: ('front' | 'back')[];
  orientation: 'landscape' | 'portrait' | 'auto';
  expiresCheck: boolean;         // drives the expiry mismatch flag (07c §2.4)
}

export interface GateThresholds {              // the five deterministic capture gates — tunable per workspace, spec-proposed defaults in 07c §2.1
  framingMin: number;             // document-area coverage ratio, minimum
  framingMax: number;             // maximum (too close)
  glareMaxCoverage: number;       // fraction of document area above glare threshold
  blurMinSharpness: number;       // normalized sharpness score floor
  alignmentMaxDegrees: number;    // absolute rotation tolerance
}

export interface SessionPolicy {
  idleTimeoutMinutes: number;     // seeded 20 — warning at 2 min remaining, assertive + extend (a11y-baseline §7)
  absoluteSessionMinutes: number; // seeded 60
  resumeWindowDays: number;       // seeded 30 — resume token validity from last activity
  nudgeThresholdHours: number;    // seeded 48 — idling applications become nudge-eligible
  nudgeCapPerDay: number;         // seeded 3 — rate guard (CP-1.5)
  maxReworkRounds: number;        // seeded 3 — contract-enforced rework ceiling (07b rule 7)
}

export interface StepSpec {
  id: string;
  kind: StepKind;
  order: number;                  // 1-based sequence position
  titleAr: string;
  titleEn: string;
  required: boolean;
  fieldKeys: string[];            // identity-fields: declared field set (grouped micro-steps)
  documentTypes: string[];        // document-capture: catalog codes required
  alternativePathLabelAr: string | null;   // presence/disclosures: the declared alternative (a11y-baseline §7 — no biometric step is the only path)
  alternativePathLabelEn: string | null;
}

export interface FlowProgram {
  id: string;
  workspaceId: string;
  version: number;                // in-flight applications pin the version they started (versioning rule, CP-6.2)
  programCode: string;            // deep-link key for applicant entry (CP-1.1)
  steps: StepSpec[];
  documentTypeCatalog: DocumentTypeSpec[];
  gateThresholds: GateThresholds;
  sessionPolicy: SessionPolicy;
  slaHours: Record<SlaClass, number>;        // deadline = submittedAt + slaHours[class] (07c §2.2)
  reasonCodeCatalogs: ReasonCodeCatalog[];
  retentionDays: number;                    // applicant-data retention posture (12 Q-8)
  attestationTextAr: string;
  attestationTextEn: string;
  publishedAt: string;
  publishedByUserId: string;
}

// ===== The application (the resumable multi-session entity — the product's core object) =====
export type ApplicationStatus =
  | 'in-progress'      // durable draft; steps advancing (autosave P10)
  | 'submitted'        // attested, frozen, ReviewTask created
  | 'in-review'        // opened by a reviewer (dossier assembled)
  | 'needs-attention'  // rework requested; applicant resumes (CP-4.5)
  | 'approved'
  | 'rejected'
  | 'withdrawn'        // applicant or admin cancellation
  | 'expired';         // resume window elapsed without completion

export interface Application {
  id: string;
  workspaceId: string;
  applicantId: string;
  applicationRef: string;          // short display token, e.g. 'APP-1042' — bidi-isolated Latin token
  programId: string;
  programVersion: number;          // PINNED at start; program changes affect new applications only
  locale: Locale;                  // applicant locale for this application
  status: ApplicationStatus;
  currentStepId: string | null;
  reworkRounds: number;            // increments per request-rework decision (07c §2.2)
  startedAt: string;
  lastActivityAt: string;          // drives resume-window validity (SessionPolicy.resumeWindowDays)
  submittedAt: string | null;
  attestationId: string | null;    // set at submit (CP-4.2)
  resumeToken: string;             // opaque; single active token; regenerates per nudge (CP-1.5)
  resumeTokenExpiresAt: string;    // lastActivityAt + resumeWindowDays
  decidedAt: string | null;
  reviewTaskId: string | null;
}

// ===== Steps & answers =====
export type StepStatus =
  | 'not-started' | 'in-progress' | 'submitted'
  | 'needs-attention'   // targeted by a rework decision (reason-linked)
  | 'accepted';         // reviewer-confirmed post-rework

export interface StepState {
  id: string;
  applicationId: string;
  stepSpecId: string;
  status: StepStatus;
  answers: Record<string, string>;   // canonical values; recall provenance below
  recalledKeys: string[];            // keys pre-filled from prior steps/sessions — P11 marking (CP-1.3)
  amendedAt: string | null;          // post-submit amendments are timeline entries, never silent
  firstSubmittedAt: string | null;
  lastValidatedAt: string | null;
}

// ===== Capture evidence =====
export type CaptureSource = 'camera' | 'upload';   // identical evidence structure (CP-3.5 — the alternative path is first-class)

export interface CaptureMetrics {   // declared frame metrics the deterministic gates evaluate (07c §2.1)
  documentCoverage: number;         // 0–1 fraction of frame occupied by detected document bounds
  glareCoverage: number;            // 0–1 fraction of document area above glare threshold
  sharpness: number;                // 0–1 normalized sharpness
  rotationDegrees: number;          // signed
  edgesComplete: boolean;           // all four corners detected inside frame
}

export type GateKind = 'framing' | 'glare' | 'blur' | 'alignment' | 'edges';

export interface GateResult {
  kind: GateKind;
  value: number | boolean;
  threshold: number | boolean;      // the GateThresholds in force at evaluation (program version pinned)
  passed: boolean;
  labelAr: string;                  // composed from versioned bilingual templates (11 §D2)
  labelEn: string;
}

export interface QualityReport {
  gates: GateResult[];              // exactly five, in fixed order
  overallPassed: boolean;           // AND of all gates — the pure-function verdict (07c §2.1)
  evaluatedAt: string;
  engine: 'rule-gates' | 'assist-enriched';   // provenance, always displayed (ai-native-patterns §8)
  assistHints: { ar: string; en: string } | null;  // present only when engine = 'assist-enriched'
}

export interface CaptureRecord {
  id: string;
  applicationId: string;
  stepStateId: string;
  documentTypeCode: string;
  side: 'front' | 'back' | 'presence';
  source: CaptureSource;
  imageRef: string;                // opaque artifact reference — never a URL in UI state (privacy posture)
  metrics: CaptureMetrics;
  quality: QualityReport;
  attempt: number;                 // 1-based within the retake chain (CP-3.5)
  submittedAsEvidence: boolean;    // exactly one per side per submission cycle
  capturedAt: string;
}

// ===== Attestation (CP-4.2) =====
export interface Attestation {
  id: string;
  applicationId: string;
  programVersion: number;          // attested under the STARTED version (versioning rule)
  attestedAt: string;              // announced with the action (a11y-baseline §7)
  focusTraversalCompleted: boolean; // the preserved-focus-order contract outcome, recorded
}

// ===== Review =====
export type SlaClass = 'standard' | 'priority' | 'urgent';

export interface ReviewTask {
  id: string;
  workspaceId: string;
  applicationId: string;
  applicationRef: string;          // denormalized for queue rows (one round trip — 10 data-path rules)
  applicantDisplayName: string | null;
  applicantLocale: Locale;
  documentTypeCodes: string[];
  status: 'queued' | 'in-review' | 'decided' | 'withdrawn-underneath';
  slaClass: SlaClass;              // deterministic: escalated → urgent; reworkRounds ≥ 2 OR gateWarnings ≥ 3 → priority; else standard (07c §2.2)
  deadlineAt: string;              // submittedAt + slaHours[slaClass]
  reworkRounds: number;
  captureWarningCount: number;     // gates failed at submit-time re-evaluation (07c §2.4)
  assessmentAvailable: boolean;    // machine assessment present (provenance-visible glyph, CP-5.1)
  assigneeUserId: string | null;   // null = shared pool (CP-5.2)
  submittedAt: string;
  decidedAt: string | null;
}

export type DecisionKind = 'approve' | 'reject' | 'request-rework' | 'escalate' | 'reverse';

export interface ReasonCode {
  code: string;                    // catalog codes are versioned program data (bilingual)
  labelAr: string;
  labelEn: string;
  scope: DecisionKind[];           // which decisions may cite this code
}

export interface ReasonCodeCatalog {
  programVersion: number;
  codes: ReasonCode[];
}

export interface ReviewDecision {
  id: string;
  reviewTaskId: string;
  applicationId: string;
  decision: DecisionKind;
  reasonCodes: string[];           // REQUIRED for reject / request-rework (07b rule 5)
  note: string | null;             // ≤280 chars, bidi-isolated
  reworkStepIds: string[];         // targeted steps when decision = request-rework
  decidedByUserId: string;
  decidedAt: string;
  supersededByDecisionId: string | null;  // reversal chains forward, never edits (P17 discipline)
}

// ===== Machine assessment (abstract verification capability INPUT — never a verdict) =====
export interface VerificationAssessment {
  id: string;
  applicationId: string;
  reviewTaskId: string;
  engineLabel: string;             // capability-abstract label (credential-contract §2 kind-not-vendor)
  engineVersion: string;
  requestedAt: string;
  completedAt: string | null;
  state: 'running' | 'completed' | 'failed' | 'unavailable';   // unbound capability = 'unavailable' (08 N1)
  fieldResults: { fieldKey: string; extractedValue: string; confidenceAsInput: number }[];
  documentFindings: { captureId: string; findingAr: string; findingEn: string; severity: 'advisory' | 'blocking-class' }[];
  provenanceAr: string;            // composed provenance sentence (11 §D4): engine + version + human-decides
  provenanceEn: string;
}

// ===== Applicant-facing notices (bilingual, versioned — no AI writes these) =====
export type NoticeSlot =
  | 'submitted-notice' | 'rework-request' | 'decision-approved' | 'decision-rejected'
  | 'resume-nudge' | 'session-expired' | 'withdrawal-ack';

export interface MessageTemplate {
  id: string;
  workspaceId: string;
  slot: NoticeSlot;
  bodyAr: string;                  // {{applicant}} {{applicationRef}} {{steps}} {{deadline}} parameters
  bodyEn: string;
  version: number;
  updatedAt: string;
  updatedByUserId: string;
}

// ===== Ambient =====
export interface NotificationEvent {
  id: string;
  userId: string;
  kind: 'rework-returned' | 'sla-breach-warning' | 'task-escalated'
      | 'submissions-digest' | 'nudge-delivered' | 'program-published' | 'artifact-expiring';
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // P21 class ladder
  payload: Record<string, string>;
  createdAt: string;
  seenAt: string | null;
}

export interface ActivityEntry {   // P17 — actor-action-target-timestamp
  id: string;
  workspaceId: string;
  actorUserId: string | null;      // null = engine/session events
  action: string;                  // 'application.started' | 'session.extended' | 'capture.submitted' | 'decision.made' | …
  targetId: string;
  detail: Record<string, string>;
  at: string;
}

export interface Job<T = unknown> {   // async-contract §2 state machine
  id: string;
  kind: 'ledger-export' | 'assessment-run';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: { code: string; message: string; correlationId: string };
}
```

## Relationships

Workspace 1—N User, Applicant, Application, FlowProgram (versioned history retained), MessageTemplate, ActivityEntry. Applicant 1—N Application (contactRef is the resume key; applications pin programVersion at start). Application 1—N StepState (ordered by StepSpec.order); 1—N CaptureRecord (retake chains per side; exactly one submittedAsEvidence per side per submission cycle); 1—0..1 Attestation (created at submit); 1—0..1 ReviewTask (created at submit; rework keeps the SAME task, rounds increment — ownership retained through round 2 per seeded policy); 1—N ReviewDecision (immutable chain; reversals supersede forward); 1—0..N VerificationAssessment (abstract capability inputs). ReviewTask N—0..1 User (assignee). User 1—N NotificationEvent. Job 1—0..1 export artifact (expiry window per async-contract §2). All list-bearing relations paginate via the typed Page model (07b).

## State machines (declared transitions only — others are contract violations)

- **Application**: in-progress → submitted (attested submit, CP-4.3) → in-review (dossier opened) → approved | rejected (decisions); submitted/in-review → needs-attention (request-rework decision) → in-progress (applicant resumes, fixes targeted steps) → submitted (re-submission; reworkRounds already incremented at decision time); any pre-decision state → withdrawn (applicant or admin-with-rationale); in-progress → expired (resume window elapsed — the durable draft's honest end, notice sent). Terminal: approved / rejected / withdrawn / expired. needs-attention is reachable only via a rework decision; expiry never deletes evidence already captured (retention policy governs).
- **StepState**: not-started → in-progress → submitted → accepted (post-rework reviewer confirmation); submitted → needs-attention (targeted by rework) → in-progress (amendment) → submitted; amendments post-submission are pre-decision only and append timeline entries (amendedAt set, ledger entry written).
- **CaptureRecord**: created (attempt n) → submittedAsEvidence=true exactly once per side per submission cycle; earlier attempts remain in the chain, browsable, never mutated; submit-time re-evaluation appends a fresh QualityReport row when program gates re-run (07c §2.4) — quality reports are immutable rows, recompute appends.
- **ReviewTask**: queued → in-review (assignment OR dossier open) → decided (approve/reject/escalate-resolved) | withdrawn-underneath (applicant withdrew mid-review — no phantom decision); request-rework does NOT close the task: it parks the task awaiting re-submission, deadline recomputed (07c §2.2), round+1. escalated → queued (slaClass urgent, senior/admin pool). Reversal decisions create a NEW decision row superseding forward; the task re-opens as queued with the reversal chain visible.
- **VerificationAssessment**: running → completed | failed | unavailable (unbound capability); completed assessments are immutable inputs to the dossier; re-runs append.
- **Job**: async-contract §2 verbatim.

## State obligations summary (per entity)

Every async operation follows the async-contract state machine; ledger exports carry expiry windows with renewal actions. Partial-results policy: assessment runs and exports deliver per-item results with failed-item retry scoped to failures (async-contract §4). Every consequential mutation appends an ActivityEntry (P17) — including engine-side events (session extended, nudge delivered, assessment completed) with actor null and program version in detail. Every application names the program version it runs under (pinned); every decision names its reason codes and its task; every assessment names engine label + version + that it is an input; every attestation records the traversal contract outcome and timestamp. Applicant PII is bounded to the flow's own collection (contactRef, displayName, locale, step answers, captures) — no geolocation, no device fingerprints, no biometric templates retained by this product (captures are images passed to the abstract capability; retention per program policy, 12 Q-8). No entity references a provider, engine vendor, transport, or external system by name — external touchpoints are abstract needs in 08 only.

## Determinism statement (conditionally-AI — declared per ai-native-patterns §1)

The **rule-gates** capture evaluation is a pure function of (declared inputs: CaptureMetrics + the program's GateThresholds) → (five GateResults + overallPassed + bilingual labels): two evaluations over identical inputs produce identical output (07c §5 guarantees this in the mock). The SLA classification is a pure function of (escalation state, reworkRounds, captureWarningCount) → SlaClass. The mismatch flags are pure functions of (step answers, capture metadata, document type specs) → flags. The **declared AI surface is exactly one optional capability**: the document-capture quality assist (08 N2) — when bound, `evaluateCaptureFrame` and `submitCapture` MAY return `engine: 'assist-enriched'` reports carrying assistHints; the contract requires: (a) the deterministic rule-gates result is always computed and retained as the floor; (b) the engine provenance is a first-class field the UI displays in both locales; (c) degradation to rule-gates + checklist guidance is total and instant when the capability is unbound, rate-limited, or fails (08 degradation map). No other surface touches a model: notices are human-authored versioned data (11 §D6), decisions are human reason-coded judgments, mismatch flags are rules, assessments are the ABSTRACT verification capability's typed inputs (a different, non-AI-declared binding — N1). There is no AI-written applicant message and no AI-made decision anywhere in the contract.
