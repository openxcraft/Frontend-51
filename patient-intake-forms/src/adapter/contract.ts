// VERBATIM from specs-source/patient-intake-forms/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (SymptomEntry,
// MatchMode, BilingualText, ExportFormat — and their fields) are declared
// canonically in 07a and are part of this contract by reference; 07b declares
// only the operational wrappers (summaries, views, jobs, sessions) its
// signatures need. AI DECLARATION (ai-native-patterns §1): conditionally-AI —
// exactly one operation (`normalizeSymptomText`) consults the vocabulary-
// normalization assist capability WHEN BOUND, and its assist results are
// DRAFTS requiring human confirmation; every other operation is deterministic.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (publish-gate bilingual gaps, required-field submit attempts, malformed vocabulary rows, fill-token creation sanity, resolve-without-target)
 * 'NOT_FOUND'    -> NotFoundError     (expired fill tokens, stale submission/form/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (patient-token scope violations, reviewer-role builder writes, unconsented capability use, cross-workspace access)
 * 'CONFLICT'     -> ConflictError     (concurrent form edits, concurrent review-state changes, resolving already-resolved matches, stale term edits)
 * 'RATE_LIMIT'   -> RateLimitError    (export packages, vocabulary imports)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact delivery, patient autosave round-trips)
 * 'UNKNOWN'      -> UnknownError      (typed retry, correlationId)
 */
export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;
  correlationId: string;
  retryable: boolean;
  details?: Record<string, string[]>;
}

export interface Session {                           // auth-agnostic (07a Session family)
  memberId: string;
  workspaceId: string;
  role: 'owner' | 'builder' | 'reviewer';            // owner=clinic manager w/ settings; builder=Nour; reviewer=Tariq (viewer reads ride reviewer reads)
  locale: 'ar' | 'en';                               // console chrome direction
}

export interface PatientSession {                    // the fill-token session kind — no account, opaque token
  fillToken: string;                                 // carries NO PHI (09); scoped to ONE submission draft
  formSummary: {
    title: BilingualText;
    visitType: IntakeForm['visitType'];
    sectionTitles: BilingualText[];
    questionCount: number;
  };
  patientLocale: 'ar' | 'en';
  expiresAt: string;                                 // declared window honored (03 CP-2.6, 11)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export interface FormSummary {
  id: string;
  title: BilingualText;
  visitType: IntakeForm['visitType'];
  status: 'draft' | 'active' | 'archived';
  version: number;
  counts: { submissions: number; inProgress: number; flagged: number; pendingConfirmation: number };
  updatedAt: string;
}

export interface FormOverview extends FormSummary {
  completionRate: number;                            // submitted / (submitted + abandoned-expired), Western numerals
  medianCompletionSeconds?: number;                  // honest operational counters — the analytics ceiling (03, 12 Q-6)
}

export interface PublishGateReport {
  formId: string;
  publishable: boolean;
  gaps: { fieldId: string; fieldLabel: BilingualText; locale: 'ar' | 'en'; kind: 'label' | 'help' | 'option' | 'attestation' }[];
  checks: { sectionsWithinLimit: boolean; fieldsWithinLimit: boolean; hasConsentField: boolean };
}

export interface SubmissionSummary {
  id: string;
  formId: string;
  formVersion: number;
  state: Submission['state'];
  authoredBy: 'patient' | 'staff';
  patientLocale: 'ar' | 'en';
  urgentFlagCount: number;                           // count + canonical pairs only — no PHI in list rows (09)
  pendingConfirmationCount: number;
  ageHours: number;
  updatedAt: string;
}

export interface SubmissionView {
  submission: Submission;                            // 07a full shape (answers + symptomEntries + flags)
  formSnapshot: FormVersion['snapshot'];             // the pinned version renders — never the live draft
  reviewHistory: ReviewRecord[];
}

export interface NormalizationSuggestion {
  termId: string;
  canonical: BilingualText;
  mode: 'exact' | 'normalized' | 'assist';           // assist entries are DRAFTS (P15) — patient surface renders them as neutral hints only
  matchedText?: string;                              // the span the matcher proposes
  confidence?: number;                               // assist only; never rendered as a promise — 12 Q-13
  requiresStaffConfirmation: boolean;                // true iff mode = 'assist'
}

export interface NormalizationResult {
  suggestions: NormalizationSuggestion[];            // dictionary core ALWAYS included; assist layer appended when bound
  unmatchedRemainder?: string;                       // text no rule matched — kept verbatim (07c rule 2)
  engine: 'dictionary' | 'dictionary+assist';        // provenance displayed honestly (ai-native-patterns §3)
}

export interface FillSessionResult {
  fillSession: FillSession;
  fillToken: string;
  shareRef: { kind: 'link' | 'kiosk' | 'printed-qr'; qrPayload?: string };   // QR payload = opaque token, never data
}

export interface DraftStateResult {
  submissionId: string;
  answers: SubmissionAnswer[];                       // prior answers, marked recalled at render (P11)
  currentFieldId: string;                            // the exact question she left (03 CP-2.6)
  formSummary: PatientSession['formSummary'];
}

export interface TermSummary {
  id: string;
  canonical: BilingualText;
  variantCount: number;
  urgentAttention: boolean;
  provenance: SymptomTerm['provenance'];
  status: 'active' | 'deprecated';
  version: number;
  updatedAt: string;
}

export interface ImportJobResult {
  kind: 'vocabulary';
  imported: number;
  invalidRows: string[];                             // named bad rows — partial policy (async-contract §4)
  deprecationNotice?: string;                        // when identical canonical pairs existed (07c)
}

export interface JobView<T> {                        // 07a Job with its result channel typed per kind
  id: string;
  kind: 'vocabulary-import' | 'intake-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                            // async-contract §5
  createdAt: string;
}

// ---- Contract ----

export interface PatientIntakeAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // intake form authoring (CP-1)
  listForms(query: {
    filter?: { status?: FormSummary['status'][]; visitType?: IntakeForm['visitType'][] };
    search?: string;                                 // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'title' | 'submissions';
    cursor?: string; limit: number;
  }): Promise<Result<Page<FormSummary>, AdapterError>>;
  createForm(input: {
    title: BilingualText;                            // BOTH locales required from birth — gate runs anyway (07c rule 6)
    visitType: IntakeForm['visitType'];
    structure: 'blank' | 'duplicate' | 'sample';
    duplicateOfFormId?: string;
  }): Promise<Result<FormSummary, AdapterError>>;
  getForm(id: string): Promise<Result<FormSummary & {
    sections: IntakeForm['sections'];
    fields: IntakeForm['fields'];
    versionHistory: { version: number; publishedAt?: string; note?: string }[];
    publishGate: PublishGateReport;                  // live gate state — the builder/preview render it (03 CP-1.5/6)
  }, AdapterError>>;
  saveForm(id: string, input: {
    title?: BilingualText;
    sections?: IntakeForm['sections'];
    fields?: IntakeForm['fields'];
    baseVersion: number;                             // stale -> CONFLICT with both payloads (P10 conflict discipline)
  }): Promise<Result<FormSummary & { publishGate: PublishGateReport }, AdapterError>>;
  publishForm(id: string): Promise<Result<{ version: number; publishedAt: string }, AdapterError>>;
  // ^ gate violations -> VALIDATION whose details list every gap (field, locale, kind) — never a generic refusal
  archiveForm(input: {
    formId: string;
    confirm: { openSubmissionCount: number };        // P04 level-2: UI names the count; adapter verifies (drift -> CONFLICT)
  }): Promise<Result<{ archivedFormId: string }, AdapterError>>;
  duplicateForm(input: { formId: string; title: BilingualText }): Promise<Result<FormSummary, AdapterError>>;

  // patient fill surface (CP-2 — token-scoped; no Session required)
  openFillSession(input: {
    formId: string;                                  // active forms only -> VALIDATION otherwise
    channel: 'link' | 'kiosk' | 'printed-qr';
    prefill?: { name?: string; dateOfBirth?: string };   // basics only; clinical answers NEVER prefilled (07a)
    idempotencyKey: string;
  }): Promise<Result<FillSessionResult, AdapterError>>;
  resumeFillSession(fillToken: string): Promise<Result<PatientSession & { draft?: DraftStateResult }, AdapterError>>;
  // ^ expired token -> NOT_FOUND with re-open guidance (11); tampered token -> PERMISSION
  saveDraftAnswers(fillToken: string, input: {
    submissionId: string;
    answers: SubmissionAnswer[];                     // the autosave payload — full draft state per round-trip (idempotent)
    currentFieldId: string;
  }): Promise<Result<{ submissionId: string; savedAt: string; expiresAt: string }, AdapterError>>;
  submitIntake(fillToken: string, input: {
    submissionId: string;
    answers: SubmissionAnswer[];                     // must include every required field (labels listed on VALIDATION — never values)
    attestation: { consentFieldId: string; attested: true };
    idempotencyKey: string;                          // double-submit returns the original submission (07a)
  }): Promise<Result<{ submissionId: string; submittedAt: string; confirmation: { sectionCounts: { title: BilingualText; count: number }[] } }, AdapterError>>;

  // symptom normalization — the ONE conditionally-AI operation (CP-2.4/2.5)
  normalizeSymptomText(input: {
    text: string;                                    // free text, either locale, mixed script allowed (bidi-isolated upstream)
    vocabularyId: string;
    locale?: 'ar' | 'en';
  }): Promise<Result<NormalizationResult, AdapterError>>;
  // ^ dictionary core is deterministic and ALWAYS runs; assist layer appends ONLY when the
  //   workspace capability is bound (08 N1) and appends ONLY draft suggestions requiring
  //   staff confirmation (P15). Unbound -> engine: 'dictionary', identical suggestions
  //   for identical input — the determinism contract (07c rule 2).

  // submissions & review (CP-3)
  listSubmissions(query: {
    filter?: {
      formId?: string;
      state?: SubmissionSummary['state'][];
      hasUrgentFlags?: boolean;
      hasPendingConfirmations?: boolean;
      authoredBy?: ('patient' | 'staff')[];
    };
    search?: string;
    sort: 'updatedAt' | 'submittedAt' | 'ageHours';
    cursor?: string; limit: number;                  // virtualized surface: cursor pages <= 100
  }): Promise<Result<Page<SubmissionSummary>, AdapterError>>;
  getSubmission(id: string): Promise<Result<SubmissionView, AdapterError>>;
  resolveSymptomMatch(input: {
    symptomEntryId: string;
    action: 'confirm' | 'correct';
    correctedToTermId?: string;                      // REQUIRED for 'correct' -> VALIDATION without it
  }): Promise<Result<SymptomEntry, AdapterError>>;
  // ^ confirms/corrects assist + unmatched mappings; rawText never changes (07a);
  //   already-resolved entry -> CONFLICT with current state
  flagSubmission(input: {
    submissionId: string;
    flagTermId: string;
    escalate: boolean;                               // true records actor + timestamp + note (P17)
    note?: string;
  }): Promise<Result<{ submissionId: string; urgentFlagCount: number }, AdapterError>>;
  setSubmissionReviewState(input: {
    submissionId: string;
    state: 'reviewed' | 'un-reviewed';
    note?: string;
    baseRevision: number;                            // concurrent review changes -> CONFLICT, both states shown
  }): Promise<Result<{ submissionId: string; state: Submission['state']; reviewHistory: ReviewRecord[] }, AdapterError>>;
  // ^ 'reviewed' REQUIRES zero pending confirmations -> VALIDATION naming the pending entries (the review gate)

  // export & handoff (CP-5)
  exportIntakePackage(input: {
    submissionIds: string[];                         // single or bulk (P07); UI names the count
    formats: ('intake-record-pdf' | 'answers-csv' | 'normalization-annex')[];
    idempotencyKey: string;
  }): Promise<Result<JobView<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: ExportFormat[];
    submissionCount: number;
  }, AdapterError>>;

  // symptom vocabulary (CP-4)
  listSymptomTerms(query: {
    vocabularyId: string;
    search?: string;                                 // normalized bilingual term search; ruleset disclosed in-panel (05/09)
    filter?: { status?: ('active' | 'deprecated')[]; urgentOnly?: boolean };
    sort: 'canonical' | 'updatedAt' | 'variantCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<TermSummary>, AdapterError>>;
  saveSymptomTerm(input: {
    vocabularyId: string;
    entry: Omit<SymptomTerm, 'version' | 'createdAt' | 'updatedAt'> & { id?: string };
    baseVersion?: number;                            // stale -> CONFLICT with both payloads
  }): Promise<Result<SymptomTerm, AdapterError>>;
  // ^ canonical pair BOTH locales required -> VALIDATION; two active terms normalizing
  //   identically -> VALIDATION naming both (03 CP-4 edge); urgentAttention toggle is
  //   clinic policy — no system judgment anywhere in this signature
  deleteSymptomTerm(input: {
    termEntryId: string;
    confirm: { openMatchCount: number };             // P04 level-2: names open matches; drift -> VALIDATION
  }): Promise<Result<{ deletedTermEntryId: string }, AdapterError>>;
  importVocabulary(input: {
    vocabularyId: string;
    source: 'paste' | 'file-upload';
    content?: string;                                // rows: canonical-ar | canonical-en | variants (;-separated) | urgent | note
    idempotencyKey: string;
  }): Promise<Result<JobView<ImportJobResult>, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: JobView<unknown>['state'][]; kind?: JobView<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<JobView<unknown>>, AdapterError>>;
  listActivity(query: {
    filter?: { action?: ActivityEntry['action'][]; actorKind?: ('staff' | 'patient' | 'system')[]; since?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntry>, AdapterError>>;
  getFormOverview(formId: string): Promise<Result<FormOverview, AdapterError>>;
  updateWorkspace(input: {
    policies?: { fillTokenExpiryHours?: number; retentionDays?: number };
    defaultLocale?: 'ar' | 'en';
    name?: BilingualText;
    baseUpdatedAt: string;                           // policy edits are rare + owner-logged -> CONFLICT on stale
  }): Promise<Result<Workspace, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    exportPackages: number;
    vocabularyImports: number;
    normalizationCalls: 'unmetered';                 // typed literal: normalization is NEVER metered (12 Q-3)
    resetAt: string;
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type BilingualText = { ar: string; en: string };      // BOTH required wherever it appears — the publish gate enforces this at form level

// ---- Workspace (the clinic) ----
export interface Workspace {
  id: string;
  name: BilingualText;                              // clinic name renders bilingually (attestation, exports)
  defaultLocale: Locale;                             // console chrome default (either direction is a full citizen — 05)
  policies: {
    fillTokenExpiryHours: number;                    // default 72; kiosk sessions shorter (07c rule 7)
    retentionDays: number;                           // default 90 post-resolution; owner-configurable (12 Q-11)
  };
  createdAt: string;
  updatedAt: string;
}

// ---- Intake form authoring ----
export type FormStatus = 'draft' | 'active' | 'archived';
export type FieldKind =
  | 'short-text' | 'long-text' | 'select-one' | 'select-many'
  | 'date' | 'number' | 'pain-scale'                // 0–10 fixed scale, Western numerals
  | 'contact'                                        // phone/email with autocomplete tokens (a11y-baseline §5)
  | 'consent'                                        // attestation line + explicit agree control
  | 'symptom';                                       // binds the vocabulary — the signature field
export interface FieldOption {
  id: string;
  label: BilingualText;                              // BOTH locales required (publish gate)
}
export interface FormField {
  id: string;
  sectionId: string;
  kind: FieldKind;
  label: BilingualText;                              // persistent label — placeholders are structurally absent (05/06)
  helpText?: BilingualText;                          // plain-MSA reading register on the ar side (02)
  required: boolean;                                 // programmatic, not asterisk-decorative (a11y-baseline §5)
  options?: FieldOption[];                           // select-one / select-many
  symptomField?: {
    vocabularyId: string;                            // the bound vocabulary scope
    allowMultiple: boolean;
    allowFreeText: boolean;                          // unmatched text kept verbatim when true
  };
  order: number;
}
export interface FormSection {
  id: string;
  title: BilingualText;
  order: number;
}
export interface IntakeForm {
  id: string;
  workspaceId: string;
  title: BilingualText;
  visitType: 'new-patient' | 'follow-up' | 'procedure' | 'other';
  status: FormStatus;
  version: number;                                   // drafts bump on save; publish pins a version
  sections: FormSection[];
  fields: FormField[];
  counts: {                                          // derived at read — never authoritative storage
    submissions: number;
    inProgress: number;
    flagged: number;
    pendingConfirmation: number;
  };
  createdAt: string;
  updatedAt: string;
}
export interface FormVersion {                       // the version pin submissions answer on
  formId: string;
  version: number;
  publishedAt: string;
  snapshot: Pick<IntakeForm, 'sections' | 'fields' | 'title' | 'visitType'>;
}

// ---- Symptom vocabulary (the clinic's linguistic asset) ----
export type DialectTag = 'gulf' | 'levantine' | 'egyptian' | 'msa-adjacent' | 'unlabeled';
export type TermStatus = 'active' | 'deprecated';
export interface SymptomTerm {
  id: string;
  vocabularyId: string;
  canonical: BilingualText;                          // صداع / headache — BOTH required
  variants: { text: string; locale: Locale; dialect?: DialectTag }[];   // colloquial/dialectal phrasings
  bodySystem?: string;                               // organizing tag only — NEVER used for inference (06)
  urgentAttention: boolean;                          // clinic-owned clinical policy: matched term surfaces a red flag
  provenance: 'seeded-spec' | 'clinic-authored';     // trust-as-receipts (05 integration record)
  note?: string;                                     // reviewer-facing "why"
  status: TermStatus;
  version: number;                                   // matches pin the version they were computed against
  createdAt: string;
  updatedAt: string;
}

// ---- Fill sessions & submissions ----
export type FillChannel = 'link' | 'kiosk' | 'printed-qr';
export interface FillSession {
  id: string;
  formId: string;
  formVersion?: number;                              // pinned at first answer; unbound until then
  channel: FillChannel;
  token: string;                                     // opaque; carries NO PHI (09) — not a patient identifier
  state: 'open' | 'submitted' | 'expired';
  expiresAt: string;                                 // declared window honored (11 copy)
  openedByMemberId?: string;                         // staff creator (kiosk pre-fill attribution)
  prefill?: { name?: string; dateOfBirth?: string };// kiosk basics ONLY — clinical answers are never prefilled (P11 scoping)
  createdAt: string;
}
export type SubmissionState =
  | 'in-progress'    // draft exists under an open fill session
  | 'submitted'      // attested by the patient (or staff-authored, attribution recorded)
  | 'flagged'        // staff escalated an urgent flag
  | 'reviewed'       // review gate passed (zero pending confirmations)
  | 'exported';      // package generated (state, not a lock — re-export allowed)
export interface Submission {
  id: string;
  workspaceId: string;
  formId: string;
  formVersion: number;                               // the pinned published version
  fillSessionId?: string;                            // staff-authored submissions carry none
  authoredBy?: 'patient' | 'staff';                  // the honest paper path (08) — attribution is explicit
  authoredByMemberId?: string;                       // when 'staff'
  patient: {
    displayName?: string;                            // what the patient/prefill provided — a convenience label, not an identity system
    locale: Locale;                                  // the locale she answered in
  };
  answers: SubmissionAnswer[];                       // one per answered field; unanswered requireds block submit
  symptomEntries: SymptomEntry[];
  state: SubmissionState;
  flags: UrgentFlag[];                               // derived from matched urgentAttention terms (07c rule 4)
  retentionExpiresAt?: string;                       // set at terminal transition, per workspace policy
  submittedAt?: string;
  revision: number;                                  // CONFLICT base for staff-side writes
  createdAt: string;
  updatedAt: string;
}
export type SubmissionAnswer =
  | { fieldId: string; kind: 'short-text' | 'long-text'; value: string }          // verbatim; bidi-isolated at render
  | { fieldId: string; kind: 'select-one'; optionId: string }
  | { fieldId: string; kind: 'select-many'; optionIds: string[] }
  | { fieldId: string; kind: 'date'; value: string }                              // ISO; display per locale + dual-calendar option
  | { fieldId: string; kind: 'number'; value: number }
  | { fieldId: string; kind: 'pain-scale'; value: number }                        // 0–10, Western numerals
  | { fieldId: string; kind: 'contact'; value: { phone?: string; email?: string } }
  | { fieldId: string; kind: 'consent'; attested: boolean; attestedAt?: string };

// ---- Symptom normalization (deterministic core + assist layer) ----
export type MatchMode =
  | 'exact'          // raw string equals a canonical/variant — dictionary
  | 'normalized'     // equal after the fixed orthographic pipeline (07c rule 1) — dictionary
  | 'assist'         // proposed by the bound normalization capability — DRAFT until confirmed (P15)
  | 'unmatched';     // kept verbatim, flagged for staff — never silently coerced
export interface SymptomEntry {
  id: string;
  submissionId: string;
  fieldId: string;
  rawText: string;                                   // IMMUTABLE — the patient's words (bidi-isolated at render)
  locale: Locale;                                    // the entry's dominant script/direction
  matchedTermId?: string;
  matchedTermVersion?: number;                       // pin — audit honesty (term edits never mutate past matches)
  matchMode: MatchMode;
  matchedSpan?: { start: number; end: number };      // offsets into rawText
  confirmation?: {                                   // present iff matchMode was 'assist' or remapped by staff
    state: 'pending' | 'confirmed' | 'corrected';
    resolvedByMemberId?: string;
    correctedToTermId?: string;                      // 'corrected': the mapping changed; rawText unchanged
    at?: string;
  };
  computedAt: string;
}
export interface UrgentFlag {
  submissionId: string;
  termId: string;
  termVersion: number;
  canonical: BilingualText;                          // rendered pair — never the raw answer text (PHI discipline, 09)
  escalated: boolean;                                // staff acted on it or not
  escalatedByMemberId?: string;
  escalatedAt?: string;
  note?: string;
}

// ---- Review, activity, jobs, artifacts ----
export interface ReviewRecord {
  submissionId: string;
  state: 'reviewed' | 'un-reviewed';                 // un-review is an explicit logged action, never silent
  actorMemberId: string;
  note?: string;
  at: string;
}
export interface ActivityEntry {                     // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId?: string;                            // patient-originated entries carry none (token-scoped)
  actorKind: 'staff' | 'patient' | 'system';
  action:
    | 'form-created' | 'form-published' | 'form-archived' | 'form-duplicated'
    | 'fill-session-opened' | 'submission-resumed'
    | 'submission-submitted' | 'submission-staff-authored'
    | 'match-confirmed' | 'match-corrected' | 'term-saved' | 'term-deleted'
    | 'flag-raised' | 'flag-escalated' | 'submission-reviewed' | 'submission-un-reviewed'
    | 'export-run' | 'consent-change' | 'policy-change';
  targetRef: string;
  detail?: string;                                   // counts and states ONLY — no PHI in log details (09)
  at: string;
}
export type JobKind = 'vocabulary-import' | 'intake-export';
export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: rows / formats
  partial?: unknown;                                 // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                            // async-contract §5
  createdAt: string;
}
export type ExportFormat = 'intake-record-pdf' | 'answers-csv' | 'normalization-annex';
export interface ExportArtifact {
  id: string;
  submissionIds: string[];                           // single or bulk (P07)
  formats: ExportFormat[];
  expiresAt: string;                                 // declared retention window at creation (7 days, 07c)
  regenerable: boolean;                              // deterministic from submission state — always true in v1
  createdAt: string;
}

