# 07b — Adapter Contract: kyc-onboarding-flow (TypeScript, v1)

SME-G pass · Backend-agnostic by construction: no REST verbs, no provider names, no transport assumptions. The UI talks ONLY to this interface; binding to a real backend later = implementing this interface in one adapter file. Version: **v1** — breaking changes require `KycOnboardingAdapterV2`, never modified signatures. LOOP-15 checklist satisfied: full 7-class error taxonomy, typed pagination/sort/filter, auth-agnostic session model (console) + opaque resume-token model (applicant — deliberately separate, below), idempotency keys on reconnectable mutations. **TypeScript types only** — no implementation code in this contract.

```ts
// ===== Foundation (shared contract shapes) =====
// Error taxonomy — the portfolio-standard 7 classes:
//   ValidationError | NotFoundError | PermissionError | ConflictError
//   | RateLimitError | NetworkError | UnknownError
// mapped onto the 7-token ErrorCode union below. Every failure in this
// product resolves to exactly one of these classes (03 failure-mode table).
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;                       // developer-facing; user copy comes from the 11 matrix
  correlationId: string;                 // surfaces in UnknownError user copy (copy-voice §1.4)
  retryable: boolean;
  details?: Record<string, string[]>;    // field/step/gate/rule → issues (ValidationError names the failed rule)
}

// Auth-agnostic session: console-side identity resolves however the
// environment dictates (email-link for reviewers, enterprise SSO — 08 N4).
// The applicant side is deliberately NOT this session: applicants address
// their applications through opaque resume tokens (resumeApplication) —
// a public-adjacent actor model with its own semantics, never a console
// session. The UI never sees a provider for either.
export interface Session {
  userId: string;
  workspaceId: string;
  role: 'reviewer' | 'admin';
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export interface CursorQuery<F, S> {
  filter?: F;
  sort: S;
  sortDir: 'asc' | 'desc';
  search?: string;   // Arabic-normalized server-side (rtl-rules §4: alef/taa-marbuta/yaa variants, tashkeel stripped)
  cursor?: string;
  limit: number;     // ≤ 50 (10 data-path rule)
}

// ===== Domain types (mirror 07a; entity contracts live there) =====
export type Locale = 'ar' | 'en';
export type ConsoleRole = 'reviewer' | 'admin';
export type ApplicationStatus =
  | 'in-progress' | 'submitted' | 'in-review' | 'needs-attention'
  | 'approved' | 'rejected' | 'withdrawn' | 'expired';
export type StepStatus = 'not-started' | 'in-progress' | 'submitted' | 'needs-attention' | 'accepted';
export type SlaClass = 'standard' | 'priority' | 'urgent';
export type DecisionKind = 'approve' | 'reject' | 'request-rework' | 'escalate' | 'reverse';
export type GateKind = 'framing' | 'glare' | 'blur' | 'alignment' | 'edges';

export interface UserSummary {
  id: string; displayName: string; role: ConsoleRole;
  locale: Locale; status: 'active' | 'suspended'; joinedAt: string;
}

// --- Applicant-side context (the resume payload; NOT a session) ---
export interface ApplicantContext {
  application: ApplicationSummary;
  currentStep: StepBundle | null;
  session: { idleTimeoutMinutes: number; absoluteSessionMinutes: number; expiresAt: string };
  programVersion: number;
  resumeTokenExpiresAt: string;
}

export interface ApplicationSummary {
  id: string; applicationRef: string; applicantId: string;
  programId: string; programVersion: number; locale: Locale;
  status: ApplicationStatus; currentStepId: string | null;
  reworkRounds: number; startedAt: string; lastActivityAt: string;
  submittedAt: string | null; reviewTaskId: string | null;
  needsAttentionSteps: { stepId: string; titleAr: string; titleEn: string }[];   // rework targets render first on resume (CP-4.5)
}

export interface StepBundle {
  stepStateId: string; stepSpecId: string; kind: string; order: number;
  titleAr: string; titleEn: string; required: boolean;
  status: StepStatus;
  answers: Record<string, string>;
  recalledKeys: string[];
  fieldKeys: string[];
  validationIssues: Record<string, string[]> | null;
}

export interface CaptureGuidance {          // evaluateCaptureFrame return — the declared conditionally-AI surface
  gates: { kind: GateKind; passed: boolean; labelAr: string; labelEn: string }[];
  readyToCapture: boolean;
  engine: 'rule-gates' | 'assist-enriched'; // provenance, always displayed (ai-native-patterns §8)
  hintAr: string | null;                    // present only when assist-enriched (degrades to checklist row guidance otherwise)
  hintEn: string | null;
  checklistAr: { gate: GateKind; guidance: string }[];   // the static bilingual floor (Persona-checklist discipline, 01 §4.4)
  checklistEn: { gate: GateKind; guidance: string }[];
}

export interface CaptureSubmission {
  captureId: string;
  side: 'front' | 'back' | 'presence';
  documentTypeCode: string;
  source: 'camera' | 'upload';
  attempt: number;
  quality: {
    gates: { kind: GateKind; value: number | boolean; threshold: number | boolean;
             passed: boolean; labelAr: string; labelEn: string }[];
    overallPassed: boolean;
    engine: 'rule-gates' | 'assist-enriched';
    assistHints: { ar: string; en: string } | null;
  };
  stepStatus: StepStatus;
}

// --- Console-side DTOs ---
export interface ApplicationFilter {
  status?: ApplicationStatus[]; applicantId?: string;
  programVersion?: number; reworkRoundsOver?: number;
  submittedSince?: string; submittedUntil?: string;
}
export type ApplicationSort = 'lastActivityAt' | 'submittedAt' | 'applicationRef';

export interface ApplicationDetail extends ApplicationSummary {
  steps: (StepBundle & { amendedAt: string | null; firstSubmittedAt: string | null })[];
  captures: CaptureSubmission[];
  attestation: { attestedAt: string; programVersion: number; focusTraversalCompleted: boolean } | null;
  decisionChain: { decisionId: string; decision: DecisionKind; reasonCodes: string[];
                   note: string | null; decidedByUserId: string; decidedAt: string;
                   supersededByDecisionId: string | null }[];
}

export interface ReviewTaskFilter {
  status?: ('queued' | 'in-review' | 'decided' | 'withdrawn-underneath')[];
  slaClass?: SlaClass[]; assigneeUserId?: string | null;   // null filters the shared pool
  reworkRoundsOver?: number; documentTypeCode?: string[];
  deadlineBefore?: string; programVersion?: number;
}
export type ReviewTaskSort = 'deadlineAt' | 'submittedAt';

export interface ReviewTaskSummary {
  id: string; applicationId: string; applicationRef: string;
  applicantDisplayName: string | null; applicantLocale: Locale;
  documentTypeCodes: string[];
  status: 'queued' | 'in-review' | 'decided' | 'withdrawn-underneath';
  slaClass: SlaClass; deadlineAt: string; reworkRounds: number;
  captureWarningCount: number; assessmentAvailable: boolean;
  assigneeUserId: string | null; submittedAt: string; decidedAt: string | null;
  agingMinutes: number;
}

export interface EvidenceDossierDTO {
  task: ReviewTaskSummary;
  application: ApplicationDetail;
  captures: (CaptureSubmission & { imageRef: string; capturedAt: string; documentTypeCode: string })[];
  assessment: {
    state: 'running' | 'completed' | 'failed' | 'unavailable';
    engineLabel: string | null; engineVersion: string | null;
    fieldResults: { fieldKey: string; extractedValue: string; confidenceAsInput: number }[];
    documentFindings: { captureId: string; findingAr: string; findingEn: string;
                        severity: 'advisory' | 'blocking-class' }[];
    provenanceAr: string | null; provenanceEn: string | null;
  } | null;
  mismatchFlags: { ruleCode: string; labelAr: string; labelEn: string;
                   severity: 'advisory' | 'blocking-class';
                   valueA: string; valueB: string }[];      // deterministic cross-checks (07c §2.4)
}

export interface ReasonCodeDTO {
  code: string; labelAr: string; labelEn: string; scope: DecisionKind[];
}

export interface FlowProgramDTO {
  version: number; programCode: string;
  steps: { id: string; kind: string; order: number; titleAr: string; titleEn: string;
           required: boolean; fieldKeys: string[]; documentTypes: string[];
           alternativePathLabelAr: string | null; alternativePathLabelEn: string | null }[];
  documentTypeCatalog: { code: string; labelAr: string; labelEn: string;
                         sides: ('front' | 'back')[]; orientation: string; expiresCheck: boolean }[];
  gateThresholds: { framingMin: number; framingMax: number; glareMaxCoverage: number;
                    blurMinSharpness: number; alignmentMaxDegrees: number };
  sessionPolicy: { idleTimeoutMinutes: number; absoluteSessionMinutes: number;
                   resumeWindowDays: number; nudgeThresholdHours: number;
                   nudgeCapPerDay: number; maxReworkRounds: number };
  slaHours: Record<SlaClass, number>;
  reasonCodeCatalogs: ReasonCodeDTO[];
  retentionDays: number;
  attestationTextAr: string; attestationTextEn: string;
  publishedAt: string; publishedByUserId: string;
}

export interface ApplicantSummary {
  id: string; contactRef: string; displayName: string | null; locale: Locale;
  firstApplicationAt: string | null; totalApplications: number;
}
export interface ApplicantFilter {
  status?: ApplicationStatus[]; locale?: Locale[]; idledOverHours?: number;  // nudge-eligibility surface
  searchNormalized?: string;
}
export type ApplicantSort = 'displayName' | 'totalApplications' | 'lastActivityAt';

export interface MessageTemplateDTO {
  id: string; slot: string; bodyAr: string; bodyEn: string;
  version: number; updatedAt: string; updatedByUserId: string;
}

export interface MessagePreview {
  templateId: string; applicationId: string;
  applicantLocale: Locale;               // the APPLICANT's locale, not the console's (05 direction model)
  composedBody: string;                  // parameters filled; bidi-isolated interpolation points
}

export interface NotificationEventDTO {
  id: string; userId: string; kind: string;
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // P21 ladder
  payload: Record<string, string>; createdAt: string; seenAt: string | null;
}

export interface ActivityEntryDTO {
  id: string; actorUserId: string | null; action: string; targetId: string;
  detail: Record<string, string>; at: string;
}

export interface JobDTO<T = unknown> {
  id: string; kind: 'ledger-export' | 'assessment-run';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T; result?: T;
  error?: { code: ErrorCode; message: string; correlationId: string };
}

// Live application events (subscribeApplicationEvents payload)
export type ApplicationEvent =
  | { type: 'application.started'; applicationId: string; applicationRef: string }
  | { type: 'session.warning'; applicationId: string; expiresAt: string }
  | { type: 'session.ended'; applicationId: string; reason: 'idle' | 'absolute' }
  | { type: 'session.extended'; applicationId: string; expiresAt: string }
  | { type: 'step.submitted'; applicationId: string; stepStateId: string }
  | { type: 'capture.submitted'; applicationId: string; captureId: string; overallPassed: boolean }
  | { type: 'application.submitted'; applicationId: string; reviewTaskId: string; deadlineAt: string }
  | { type: 'rework.requested'; applicationId: string; reviewTaskId: string; stepIds: string[]; reworkRounds: number }
  | { type: 'application.resumed'; applicationId: string; fromDevice: string }
  | { type: 'task.assigned'; reviewTaskId: string; assigneeUserId: string | null }
  | { type: 'task.decided'; reviewTaskId: string; applicationId: string; decision: DecisionKind }
  | { type: 'task.escalated'; reviewTaskId: string; slaClass: SlaClass }
  | { type: 'assessment.completed'; applicationId: string; engineLabel: string }
  | { type: 'application.resolved'; applicationId: string; status: ApplicationStatus; reason: string }
  | { type: 'sla.breach-warning'; reviewTaskId: string; minutesRemaining: number };
export type ApplicationEventSink = (event: ApplicationEvent) => void;

// ===== The Adapter (v1) =====
export interface KycOnboardingAdapterV1 {
  // --- Console session ---
  getSession(): Promise<Result<Session, AdapterError>>;

  // --- Applicant shell: the two doors + session discipline (CP-1) ---
  startApplication(input: { programCode: string; applicantLocale: Locale; contactRef: string; idempotencyKey: string }): Promise<Result<ApplicantContext, AdapterError>>;
  resumeApplication(input: { resumeToken: string }): Promise<Result<ApplicantContext, AdapterError>>;   // validates resume window; returns recalled-marked state (P11)
  extendSession(input: { applicationId: string; idempotencyKey: string }): Promise<Result<{ applicationId: string; expiresAt: string; absoluteCapAt: string }, AdapterError>>;   // the a11y-baseline §7 extend action (contract rule 6)

  // --- Applicant shell: steps + capture (CP-2, CP-3) ---
  getApplication(applicationId: string): Promise<Result<ApplicationDetail, AdapterError>>;   // applicant summary leg + console dossier layer one
  saveStepDraft(input: { applicationId: string; stepStateId: string; answers: Record<string, string>; idempotencyKey: string }): Promise<Result<{ stepStateId: string; status: StepStatus; savedAt: string; conflict: boolean }, AdapterError>>;   // the P10 autosave loop
  submitStep(input: { applicationId: string; stepStateId: string; answers: Record<string, string>; idempotencyKey: string }): Promise<Result<StepBundle, AdapterError>>;
  evaluateCaptureFrame(input: { applicationId: string; stepStateId: string; side: 'front' | 'back' | 'presence'; frameMetrics: { documentCoverage: number; glareCoverage: number; sharpness: number; rotationDegrees: number; edgesComplete: boolean } }): Promise<Result<CaptureGuidance, AdapterError>>;   // the DECLARED conditionally-AI surface (contract rule 4): assist-enriched when bound, rule-gates + checklist otherwise — never blocks the shutter
  submitCapture(input: { applicationId: string; stepStateId: string; documentTypeCode: string; side: 'front' | 'back' | 'presence'; source: 'camera' | 'upload'; imageRef: string; idempotencyKey: string }): Promise<Result<CaptureSubmission, AdapterError>>;   // deterministic five-gate evaluation (07c §2.1); camera and upload are identical evidence paths

  // --- Applicant shell: submission + withdrawal (CP-4) ---
  submitApplication(input: { applicationId: string; attestationConfirmed: boolean; idempotencyKey: string }): Promise<Result<{ applicationId: string; reviewTaskId: string; deadlineAt: string; slaClass: SlaClass }, AdapterError>>;   // attestationConfirmed false → VALIDATION (contract rule 8)
  cancelApplication(input: { applicationId: string; by: 'applicant' | 'admin'; reason: string; idempotencyKey: string }): Promise<Result<ApplicationSummary, AdapterError>>;   // admin leg REQUIRES rationale; consequence stated in copy (P04)

  // --- Console: review queue, dossier, decisions (CP-5) ---
  listReviewTasks(query: CursorQuery<ReviewTaskFilter, ReviewTaskSort>): Promise<Result<Page<ReviewTaskSummary>, AdapterError>>;
  getReviewTask(taskId: string): Promise<Result<EvidenceDossierDTO, AdapterError>>;
  assignReviewTask(input: { taskId: string; assigneeUserId: string | null; idempotencyKey: string }): Promise<Result<ReviewTaskSummary, AdapterError>>;   // null = return to shared pool
  decideReviewTask(input: { taskId: string; decision: DecisionKind; reasonCodes: string[]; note?: string; reworkStepIds?: string[]; idempotencyKey: string }): Promise<Result<{ taskId: string; applicationId: string; applicationStatus: ApplicationStatus; reworkRounds: number; deadlineAt: string | null }, AdapterError>>;   // reasonCodes REQUIRED for reject/request-rework; reworkStepIds REQUIRED for request-rework; rework beyond maxReworkRounds → VALIDATION (contract rules 5/7)
  requestVerificationAssessment(input: { applicationId: string; idempotencyKey: string }): Promise<Result<JobDTO<{ assessmentId: string; state: string }>, AdapterError>>;   // abstract capability (08 N1): unbound → resolves 'unavailable' honestly, manual review unchanged

  // --- Console: applications & applicants directory (CP-6) ---
  listApplications(query: CursorQuery<ApplicationFilter, ApplicationSort>): Promise<Result<Page<ApplicationSummary>, AdapterError>>;
  listApplicants(query: CursorQuery<ApplicantFilter, ApplicantSort>): Promise<Result<Page<ApplicantSummary & { lastActivityAt: string; openApplicationId: string | null }>, AdapterError>>;
  getApplicant(applicantId: string): Promise<Result<ApplicantSummary & { applications: { applicationId: string; applicationRef: string; status: ApplicationStatus; submittedAt: string | null; decidedAt: string | null }[] }, AdapterError>>;
  sendResumeLink(input: { applicationId: string; idempotencyKey: string }): Promise<Result<{ applicationId: string; deliveredVia: 'channel' | 'manual-copy'; nudgeCountToday: number; nudgeCap: number }, AdapterError>>;   // channel-abstract nudge; manual-copy path returns the link + QR for the console (LOOP-5)

  // --- Console: program, templates, people (CP-6) ---
  getFlowProgram(): Promise<Result<FlowProgramDTO, AdapterError>>;
  updateFlowProgram(input: Omit<FlowProgramDTO, 'version' | 'publishedAt' | 'publishedByUserId'> & { inFlightDeclarationAccepted: boolean; idempotencyKey: string }): Promise<Result<FlowProgramDTO, AdapterError>>;   // in-flight versioning rule is contractual (rule 9)
  listMessageTemplates(query: CursorQuery<{ slot?: string[] }, 'slot'>): Promise<Result<Page<MessageTemplateDTO>, AdapterError>>;
  upsertMessageTemplate(input: Omit<MessageTemplateDTO, 'version' | 'updatedAt' | 'updatedByUserId'> & { idempotencyKey: string }): Promise<Result<MessageTemplateDTO, AdapterError>>;
  previewMessage(input: { templateId: string; applicationId: string }): Promise<Result<MessagePreview, AdapterError>>;
  listUsers(query: CursorQuery<{ role?: ConsoleRole[]; status?: ('active' | 'suspended')[] }, 'displayName'>): Promise<Result<Page<UserSummary>, AdapterError>>;
  inviteUser(input: { displayName: string; role: ConsoleRole; locale: Locale }): Promise<Result<UserSummary, AdapterError>>;
  updateUser(input: { userId: string; role?: ConsoleRole; locale?: Locale; status?: 'active' | 'suspended' }): Promise<Result<UserSummary, AdapterError>>;

  // --- Ambient: notifications, ledger, events, jobs (CP-5/CP-6) ---
  listNotifications(query: CursorQuery<{ unseenOnly?: boolean; kind?: string[] }, 'createdAt'>): Promise<Result<Page<NotificationEventDTO>, AdapterError>>;
  markNotificationsSeen(input: { ids: string[]; allSeen?: boolean }): Promise<Result<{ marked: number }, AdapterError>>;
  listActivity(query: CursorQuery<{ actorUserId?: string | null; action?: string[]; targetId?: string; since?: string; until?: string }, 'at'>): Promise<Result<Page<ActivityEntryDTO>, AdapterError>>;
  exportAuditLedger(input: { from: string; to: string; applicationId?: string; idempotencyKey: string }): Promise<Result<JobDTO<{ artifactId: string; expiresAt: string; entries: number }>, AdapterError>>;
  subscribeApplicationEvents(sink: ApplicationEventSink): Promise<() => void>;          // returns unsubscribe
  getJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;
  retryJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;     // failed items only (async-contract §4)
  cancelJob(id: string): Promise<Result<{ cancelled: true }, AdapterError>>;
}
```

## Contract rules

1. **Authoritative adapter**: optimistic writes (P03) and the offline queues (P20, both shells) live in UI hooks; the adapter always confirms and reconciles — a queued decision or draft that reaches a resolved application resolves to a discard notice, never a phantom write (CP-6.11).
2. **Idempotency**: `startApplication`, `extendSession`, `saveStepDraft`, `submitStep`, `submitCapture`, `submitApplication`, `cancelApplication`, `assignReviewTask`, `decideReviewTask`, `requestVerificationAssessment`, `sendResumeLink`, `updateFlowProgram`, `upsertMessageTemplate`, `exportAuditLedger` take `idempotencyKey` — resubmission after reconnect never double-creates a ReviewTask, double-writes a decision, or double-sends a nudge (async-contract §5). The mock demonstrates this (07c §3).
3. **The deterministic floor + provenance (conditionally-AI)**: `evaluateCaptureFrame` and `submitCapture` MUST compute the five rule gates (07c §2.1) on every call; when the optional assist capability (08 N2) is bound the result MAY carry `engine: 'assist-enriched'` with hints, but the gate results are always present as the floor, the engine field is always truthful, and any assist failure degrades to rule-gates + checklist guidance within the same call — never a spinner, never missing guidance (ai-native-patterns §8). `evaluateCaptureFrame` NEVER blocks capture: it advises; `submitCapture` enforces.
4. **Machine output never decides**: `requestVerificationAssessment` results arrive as `EvidenceDossierDTO.assessment` — an input with provenance sentences in both locales; no adapter operation auto-resolves a ReviewTask, and a decision that diverges from any assessment suggestion is not blocked, warned, or specially logged (02 Maryam; 00 LOOP-10: no identity decisioning engine).
5. **Reason-code discipline**: `decideReviewTask` with decision `reject` or `request-rework` and empty `reasonCodes` returns VALIDATION with details naming `reasonCodes`; `request-rework` without non-empty `reworkStepIds` returns VALIDATION naming `reworkStepIds` — the audit chain is only as good as its weakest decision record (02 Sami).
6. **Session warnings are contract law**: `getSession`-scoped idle timeouts fire server-side; `session.warning` events (2 minutes before idle end) ALWAYS precede `session.ended`, and `extendSession` is available from warning until end — the a11y-baseline §7 fintech overlay (assertive warning + extend action) is enforced by the contract, not by UI goodwill.
7. **Rework ceiling**: `decideReviewTask` with decision `request-rework` on an application whose `reworkRounds` ≥ `sessionPolicy.maxReworkRounds` returns VALIDATION naming the policy and its value — the loop is bounded by design (CP-5.5), and the composer's copy states the remaining options.
8. **Attestation is explicit**: `submitApplication` with `attestationConfirmed: false` returns VALIDATION naming `attestationConfirmed`; implementations MUST record the focus-traversal contract outcome with the attestation (07a Attestation.focusTraversalCompleted) — click-wrapped consent is a contract violation, not a style choice (a11y-baseline §7).
9. **In-flight versioning is contractual**: `updateFlowProgram` with `inFlightDeclarationAccepted: false` returns VALIDATION; published program versions affect NEW applications only — in-flight applications keep their pinned `programVersion` through resolution, and every pinned entity (steps, captures' gate thresholds, attestation text) names it (07a versioning rule; CP-6.2).
10. **Ledger completeness**: every consequential mutation (application started/resumed/submitted/withdrawn, session extended, capture submitted, nudge sent, task assigned/decided/escalated, assessment completed, program/template published, job lifecycle) appends an `ActivityEntry` naming the actor (or null for engine events with program version in detail) — no mutation path bypasses the accountability record (P17; 00 success signal 4).
11. **Search normalization**: `search` normalizes Arabic variants (rtl-rules §4) — implementations must implement it; the contract demands it (applicant/application lookup by transliterated or Arabic names).
12. **Bilingual copy parity**: every applicant-facing or explanation string arrives from the adapter as composable bilingual data — gate labels, mismatch-flag labels, reason-code labels, template bodies, provenance sentences — with Western numerals rendered in BOTH locales (ledger numeral policy; copy-voice §1.7). The UI never machine-translates contract copy; the glossary pinned in 11 §I is the only vocabulary.
13. **No-orphan rule**: every method traces to flows in 03 (Tables A/B, 36/36 both directions); every flow operation has a method. Verified at Critic pass. The 36-method count sits at the portfolio 20–35 band's ceiling +1; the deviation is recorded in 12 Q-16 (two-shell flagship scope: applicant flow + capture engine + submission + review console + program/templates/people/ambient, each flow-traced — same posture as the cod-order-confirmation Q-16 precedent at 40).
