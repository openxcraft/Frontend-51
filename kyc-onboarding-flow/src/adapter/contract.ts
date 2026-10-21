// VERBATIM from specs-source/kyc-onboarding-flow/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
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

