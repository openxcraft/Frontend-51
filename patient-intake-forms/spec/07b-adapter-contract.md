# 07b — Adapter Contract: patient-intake-forms (TypeScript, v1)

SME-G pass · `PatientIntakeAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, IntakeForm, FormVersion, SymptomTerm, FillSession, Submission, SubmissionAnswer, SymptomEntry, UrgentFlag, ReviewRecord, ActivityEntry, Job, ExportArtifact): 07a. Every operation traces to ≥1 flow (03 coverage table — 29 operations, 0 orphans).

```ts
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
```

## Rules

1. **Determinism contract (the dictionary core)**: `normalizeSymptomText` implements exactly the rules specified in 07c §1–2 — identical (text, vocabulary term versions) yield identical suggestions, and the result carries its `engine` provenance. Assist suggestions append only when the capability is bound, are marked `requiresStaffConfirmation: true`, and never mutate a SymptomEntry — assist becomes canonical state ONLY through `resolveSymptomMatch` (P15). With the capability unbound, failed, or rate-limited, the operation returns the dictionary result unchanged (degradation by construction — 08).
2. **No assessment anywhere**: no operation returns a severity, score, triage, likelihood, or diagnosis. Urgent flags derive arithmetically from matched terms whose entries carry `urgentAttention: true` — clinic-configured vocabulary, counted and surfaced (07c rule 4); escalation is a staff write with attribution. The LOOP-10 exclusion is typed into the contract surface.
3. **The bilingual publish gate**: `publishForm` with any gap → VALIDATION whose `details` enumerate every (field, locale, kind) triple; forms flip to `active` only gate-clean. `saveForm` drafts may be half-translated (honest draft state, gate state live in every read) but never publish.
4. **Scope and role enforcement**: patient-token operations (`resumeFillSession`, `saveDraftAnswers`, `submitIntake`, patient-scope `normalizeSymptomText` reads) touch exactly ONE submission draft — anything else → PERMISSION. Reviewer-role seats attempting builder writes (`createForm`, `saveForm`, `publishForm`, `saveSymptomTerm`, `deleteSymptomTerm`, `importVocabulary`, `updateWorkspace`) → PERMISSION naming the seat's capability in capability language; builders cannot review (`setSubmissionReviewState`, `resolveSymptomMatch`, `flagSubmission` → PERMISSION); owner holds settings + everything reviewer+builder.
5. **Stale-version semantics**: `saveForm` (baseVersion), `saveSymptomTerm` (baseVersion), `setSubmissionReviewState` (baseRevision), `resolveSymptomMatch` (already resolved) → CONFLICT with both payloads in `details`. `archiveForm`/`deleteSymptomTerm` verify their confirm counts against live state; drift → CONFLICT/VALIDATION with the recounted number (never a silent partial apply).
6. **Submit honesty**: `submitIntake` VALIDATION lists missing REQUIRED field labels (never values — a11y-baseline §7); the consent field's `attested: true` is mandatory; idempotency keys make double-submits return the original submission; kiosk tokens invalidate on submit; the returned `confirmation.sectionCounts` carries counts only — the announcement payload is PHI-free by type.
7. **Idempotency & partial policies** (async-contract §4/§5): `openFillSession`, `submitIntake`, `exportIntakePackage`, `importVocabulary` carry idempotency keys — retries return the original result/job. Vocabulary import delivers valid rows + named invalid rows; export delivers per-format partial with per-format retry. Progress is determinate in units (rows, formats) — an indeterminate bar claiming percentage is a contract violation.
8. **Retention & expiry**: fill tokens expire at the declared window (`NOT_FOUND` with re-open guidance); terminal submissions carry `retentionExpiresAt` per workspace policy; artifacts expire at creation + 7 days and regenerate deterministically from submission state (`regenerable: true` always in v1). Expiry events log to the activity chain.
9. **PHI posture (typed)**: fill tokens are opaque non-identifiers; submission list rows and activity details carry counts/states/canonical pairs, never answer text; `getSubmission` is the only answer-bearing read and requires a staff role. No operation echoes answer values in any error, message, or confirmation payload (07a state obligations enforced here).
10. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (29/29).
