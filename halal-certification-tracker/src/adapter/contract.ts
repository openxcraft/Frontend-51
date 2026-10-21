// VERBATIM from specs-source/halal-certification-tracker/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below are declared canonically
// in 07a and are part of this contract by reference; 07b declares only the
// operational wrappers (summaries, views, jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (one-script identities, malformed import rows, issuance-gate
 *                                       refusals naming unresolved lines, stage-order violations,
 *                                       non-monotonic ladder offsets, renewal-on-suspended)
 * 'NOT_FOUND'    -> NotFoundError     (stale ids, expired artifacts, deleted ingredients)
 * 'PERMISSION'   -> PermissionError   (viewer mutations, assessor ladder edits, non-committee decisions)
 * 'CONFLICT'     -> ConflictError     (concurrent formulation/applicant/ladder edits, renewal on renewed)
 * 'RATE_LIMIT'   -> RateLimitError    (ingredient imports and exports per window)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact delivery)
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

export interface Session {
  memberId: string;
  workspaceId: string;
  role: 'owner' | 'assessor' | 'committee' | 'viewer';
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export type Locale = 'ar' | 'en';
export type BilingualString = { ar: string; en: string };
export type HalalStatus = 'halal' | 'haram' | 'mashbooh' | 'under-review';
export type ApplicationKind = 'initial' | 'renewal' | 'modification';
export type ApplicationStage =
  | 'intake' | 'documents' | 'formulation' | 'audit' | 'decision' | 'issued';
export type CertificateStatus = 'active' | 'suspended' | 'withdrawn' | 'renewed';
export type UrgencyZone = 'steady' | 'due-soon' | 'overdue' | 'lapsed';

export interface ApplicantSummary {
  id: string;
  legalName: BilingualString;
  tradeName?: BilingualString;
  jurisdiction: string;
  liveCertificates: number;
  openApplications: number;
  version: number;
  updatedAt: string;
}

export interface ApplicationSummary {
  id: string;
  applicantId: string;
  kind: ApplicationKind;
  schemeId: string;
  stage: ApplicationStage;
  returnedToApplicant: boolean;
  linkedCertificateId?: string;
  issuedCertificateId?: string;
  formulationComplete: boolean;        // derived at read: all lines resolved
  updatedAt: string;
}

export interface IngredientRow {
  id: string;
  name: BilingualString;               // per-side direction rendering, bidi-isolated fields
  eNumber?: string;                    // Latin token, isolated in Arabic prose
  sourceCategory: 'plant' | 'animal' | 'synthetic' | 'microbial' | 'mineral';
  status: HalalStatus;
  statusChangedBy?: string;
  statusChangedAt?: string;
  evidenceRequired: boolean;
  usageCount: number;                  // formulations referencing it (derived)
  version: number;
}

export interface SupplierCertificateRow {
  id: string;
  supplierName: BilingualString;
  certificateNumber: string;
  issuer: string;
  scope: string;
  issuedAt: string;
  expiresAt: string;
  state: 'valid' | 'expiring-soon' | 'expired';   // derived at read (07a formula)
  documentMode: 'attached' | 'metadata-only';    // storage capability state (08 N1)
  linkedLineCount: number;             // derived: formulation lines evidencing it
}

export interface FormulationView {
  id: string;
  productId: string;
  applicationId: string;
  version: number;
  lines: {
    id: string;
    ingredientId: string;
    ingredientName: BilingualString;
    ingredientStatus: HalalStatus;
    functionNote?: string;
    supplierCertificateId?: string;
    supplierCertState?: 'valid' | 'expiring-soon' | 'expired';
    resolutionId?: string;
    resolutionState:
      | 'resolved' | 'needs-evidence' | 'evidence-expiring-soon'
      | 'evidence-expired' | 'unresolved-mashbooh' | 'unresolved-review' | 'haram';
  }[];
  resolvedCount: number;               // derived: lines with resolutionState 'resolved'
  totalCount: number;
}

export interface CertificateRow {
  id: string;
  certificateNumber: string;
  applicantId: string;
  applicantLegalName: BilingualString;
  schemeId: string;
  productCount: number;
  issuedAt: string;
  expiresAt: string;
  daysToExpiry: number;                // derived at read; Western numerals at display
  status: CertificateStatus;
  displayState: CertificateStatus | 'lapsed';    // derived: active + past expiry => 'lapsed'
  urgencyZone: UrgencyZone | null;     // null when suspended/withdrawn/renewed/lapsed-archived
  openRenewalApplicationId?: string;
  supersededBy?: string;
}

export interface CertificateDetail extends CertificateRow {
  formulationSnapshot: { formulationId: string; version: number };
  productIds: string[];
  productNames: BilingualString[];
  pinnedLadder: { ladderId: string; version: number };
  rungs: RungInstanceView[];           // computed at read — never stored
  supersedes?: string;
  suspension?: { reason: string; by: string; at: string };
  traceabilitySummary: {
    ingredientCount: number;
    resolvedCount: number;
    attentionCount: number;            // unresolved + evidence-expiring + haram lines
  };
}

export interface RungInstanceView {
  kind: 'notify' | 'docs' | 'submit' | 'audit' | 'issue';
  label: BilingualString;
  dueDate: string;
  state: 'upcoming' | 'reached' | 'cleared' | 'missed';
  clearedBy?: string;
}

export interface LadderView {
  id: string;
  schemeId: string;
  schemeName: BilingualString;
  validityMonths: number;
  rungs: { kind: 'notify' | 'docs' | 'submit' | 'audit' | 'issue';
           offsetDays: number; label: BilingualString }[];
  version: number;
  liveCertificateCount: number;        // certificates pinned to this ladder (any version)
  updatedAt: string;
}

export interface ImpactResult {
  ingredientId: string;
  severity: 'blocking' | 'review' | 'evidence' | 'none';
  affectedProducts: { productId: string; name: BilingualString;
                      formulationVersion: number }[];
  affectedCertificates: { certificateId: string; certificateNumber: string;
                          applicantId: string; daysToExpiry: number;
                          urgencyZone: UrgencyZone | null }[];   // sorted by daysToExpiry ASC
  affectedApplicants: { applicantId: string; legalName: BilingualString }[];
  lineStates: Record<string, number>;  // resolutionState -> count across affected formulations
  computedAt: string;
}

export interface Job<T> {
  id: string;
  kind: 'ingredient-import' | 'register-export' | 'certificate-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface HalalCertificationAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // applicants
  listApplicants(query: {
    filter?: { jurisdiction?: string; hasOpenApplications?: boolean };
    search?: string;                    // normalized bilingual search (rtl-rules §4)
    sort: 'legalNameAr' | 'legalNameEn' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ApplicantSummary>, AdapterError>>;
  createApplicant(input: {
    legalName: BilingualString;
    tradeName?: BilingualString;
    jurisdiction: string;
    contact: { name: BilingualString; email?: string; phone?: string };
    facilities: { name: BilingualString; address: string; activityScope: string }[];
  }): Promise<Result<ApplicantSummary, AdapterError>>;
  getApplicant(id: string): Promise<Result<ApplicantSummary & {
    facilities: { id: string; name: BilingualString; address: string; activityScope: string }[];
    products: { id: string; name: BilingualString }[];
    certificates: CertificateRow[];
    openApplications: ApplicationSummary[];
  }, AdapterError>>;
  updateApplicant(id: string, patch: {
    legalName?: BilingualString; tradeName?: BilingualString;
    jurisdiction?: string; contact?: { name: BilingualString; email?: string; phone?: string };
    baseVersion: number;
  }): Promise<Result<ApplicantSummary, AdapterError>>;

  // applications (case workflow — the typed stage ladder)
  listApplications(query: {
    filter?: { kind?: ApplicationKind[]; stage?: ApplicationStage[];
               applicantId?: string; linkedCertificateId?: string };
    sort: 'updatedAt' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ApplicationSummary>, AdapterError>>;
  createApplication(input: {
    applicantId: string;
    kind: ApplicationKind;              // 'renewal' requires linkedCertificateId
    schemeId: string;
    productIds: string[];
    linkedCertificateId?: string;
  }): Promise<Result<ApplicationSummary, AdapterError>>;
  getApplication(id: string): Promise<Result<ApplicationSummary & {
    auditRecords: { id: string; auditDate: string; auditorName: string;
                    nonconformityState: 'open' | 'closed' | 'waived' }[];
    decision?: { id: string; outcome: 'grant' | 'reject'; decidedBy: string; at: string };
    formulation: FormulationView;
  }, AdapterError>>;
  advanceApplication(input: {
    applicationId: string;
    to: ApplicationStage;
    returnedReason?: string;            // required on backward moves
    baseStage: ApplicationStage;
  }): Promise<Result<ApplicationSummary, AdapterError>>;

  // audit outcomes (records, never scheduling — LOOP-10)
  recordAuditOutcome(input: {
    target: { applicationId?: string; certificateId?: string };  // exactly one
    auditDate: string;
    siteId?: string;
    auditorName: string;
    findingsSummary: string;
    nonconformities: { count: number; state: 'open' | 'closed' | 'waived'; waiverReason?: string };
    document?: { reference: string };  // metadata-mode always accepted (LOOP-5)
  }): Promise<Result<{ auditRecordId: string; applicationStageAdvanced?: boolean }, AdapterError>>;

  // ingredients (the master directory)
  listIngredients(query: {
    filter?: { status?: HalalStatus[]; sourceCategory?: string[]; evidenceRequired?: boolean };
    search?: string;                    // matches normalized Arabic + Latin; disclosure per rtl-rules §4
    sort: 'nameAr' | 'nameEn' | 'usageCount' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<IngredientRow>, AdapterError>>;
  createIngredient(input: {
    name: BilingualString;
    eNumber?: string;
    sourceCategory: 'plant' | 'animal' | 'synthetic' | 'microbial' | 'mineral';
    status: HalalStatus;
  }): Promise<Result<IngredientRow, AdapterError>>;
  updateIngredient(id: string, patch: {
    status?: HalalStatus; sourceCategory?: 'plant' | 'animal' | 'synthetic' | 'microbial' | 'mineral';
    name?: BilingualString; eNumber?: string;
    baseVersion: number;
  }): Promise<Result<IngredientRow, AdapterError>>;

  // traceability (deterministic graph walk — the signature computation)
  getIngredientImpact(ingredientId: string): Promise<Result<ImpactResult, AdapterError>>;

  // bulk import (the LOOP-5 always-available path; Job per async-contract)
  importIngredients(input: {
    rows: { nameAr: string; nameEn: string; eNumber?: string;
            sourceCategory?: 'plant' | 'animal' | 'synthetic' | 'microbial' | 'mineral';
            status?: HalalStatus }[];
    idempotencyKey: string;             // async-contract §5 — double-submit never double-imports
  }): Promise<Result<Job<{ ingested: number; mergedVariants: number; invalidRows: string[] }>, AdapterError>>;

  // formulations (versioned; authored inside cases)
  getFormulation(applicationId: string): Promise<Result<FormulationView, AdapterError>>;
  setFormulation(input: {
    applicationId: string;
    lines: { ingredientId: string; functionNote?: string;
             supplierCertificateId?: string; resolutionId?: string }[];
    baseVersion: number;
  }): Promise<Result<FormulationView, AdapterError>>;

  // supplier certificates (evidence records)
  listSupplierCertificates(query: {
    filter?: { state?: ('valid' | 'expiring-soon' | 'expired')[]; supplier?: string };
    search?: string;
    sort: 'expiresAt' | 'recordedAt' | 'supplier';
    cursor?: string; limit: number;
  }): Promise<Result<Page<SupplierCertificateRow>, AdapterError>>;
  createSupplierCertificate(input: {
    supplierName: BilingualString;
    certificateNumber: string;
    issuer: string;
    scope: string;
    issuedAt: string;
    expiresAt: string;
    document?: { reference: string };  // metadata-mode primary path (08 N1)
  }): Promise<Result<SupplierCertificateRow, AdapterError>>;
  updateSupplierCertificate(id: string, patch: {
    // replacement model: a renewal ADDS a successor record (07a); this op edits
    // metadata errors ONLY — dates/number corrections, logged as corrections
    certificateNumber?: string; issuer?: string; scope?: string;
    issuedAt?: string; expiresAt?: string; document?: { reference: string };
  }): Promise<Result<SupplierCertificateRow, AdapterError>>;

  // certificates (issuance + register)
  issueCertificate(input: {
    applicationId: string;
    certificateNumber: string;
  }): Promise<Result<CertificateDetail, AdapterError>>;   // gate: 07a state obligations; VALIDATION names lines
  listCertificates(query: {
    filter?: { status?: CertificateStatus[]; urgencyZone?: UrgencyZone[];
               schemeId?: string; applicantId?: string; search?: string };
    sort: 'expiresAt' | 'issuedAt' | 'certificateNumber';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CertificateRow>, AdapterError>>;
  getCertificate(id: string): Promise<Result<CertificateDetail, AdapterError>>;
  setCertificateStatus(input: {
    certificateId: string;
    status: 'suspended' | 'active' | 'withdrawn';   // suspends; reinstates; withdraws (terminal)
    reason: string;                                // required for suspend and withdraw
  }): Promise<Result<CertificateDetail, AdapterError>>;

  // renewal ladder (policy + computed rungs)
  openRenewalCase(certificateId: string): Promise<Result<ApplicationSummary, AdapterError>>;
  getRenewalLadder(schemeId: string): Promise<Result<LadderView, AdapterError>>;
  updateRenewalLadder(input: {
    schemeId: string;
    patch: { validityMonths?: number;
             rungs: { kind: 'notify' | 'docs' | 'submit' | 'audit' | 'issue';
                      offsetDays: number; label: BilingualString }[] };
    baseVersion: number;
  }): Promise<Result<LadderView, AdapterError>>;

  // exports (bilingual artifacts; Jobs per async-contract)
  exportRegister(input: {
    format: 'register-document';
    options: { zones?: UrgencyZone[]; includeLadders?: boolean };
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifactId: string; expiresAt: string }>, AdapterError>>;
  exportCertificate(input: {
    certificateId: string;
    format: 'certificate-document';
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifactId: string; expiresAt: string }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  listActivity(query: {
    filter?: { actorMemberId?: string; action?: string[]; targetRef?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<ActivityEntryRow>, AdapterError>>;
}

export interface ActivityEntryRow {
  id: string;
  actorMemberId: string;
  actorDisplayName: BilingualString;
  action: string;
  targetRef: string;
  targetLabel?: BilingualString;
  detail?: string;
  at: string;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type SourceCategory = 'plant' | 'animal' | 'synthetic' | 'microbial' | 'mineral';
export type WorkspaceRole = 'owner' | 'assessor' | 'committee' | 'viewer';
export interface Workspace {
  id: string;
  name: BilingualString;                 // the certification body's own name
  defaultLocale: Locale;
  schemeIds: string[];                   // configured schemes (policy data, no scheme-owner brands)
}
export interface Member {
  id: string;
  workspaceId: string;
  displayName: BilingualString;
  role: WorkspaceRole;
}
export interface Applicant {
  id: string;
  workspaceId: string;
  legalName: BilingualString;            // required both locales (00 bilingual-by-construction)
  tradeName?: BilingualString;
  jurisdiction: string;                  // free-text registration jurisdiction
  contact: { name: BilingualString; email?: string; phone?: string };
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface Facility {
  id: string;
  applicantId: string;
  name: BilingualString;
  address: string;                       // free text, may be mixed-script (bidi-isolated at render)
  activityScope: string;
}
export interface Product {
  id: string;
  applicantId: string;
  name: BilingualString;
  formulationId?: string;                // current formulation version pointer
}
export interface Application {
  id: string;
  workspaceId: string;
  applicantId: string;
  kind: ApplicationKind;
  schemeId: string;
  productIds: string[];
  stage: ApplicationStage;
  returnedToApplicant?: { reason: string; by: string; at: string };   // backward-move honesty
  linkedCertificateId?: string;          // renewal: the expiring cert; modification: the cert being changed
  auditRecordIds: string[];
  decision?: CommitteeDecision;
  issuedCertificateId?: string;
  createdAt: string;
  updatedAt: string;
}
export interface Ingredient {
  id: string;
  workspaceId: string;
  name: BilingualString;                 // both locales required
  eNumber?: string;                      // Latin token; bidi-isolated in Arabic prose
  sourceCategory: SourceCategory;
  status: HalalStatus;
  statusChangedBy?: string;              // memberId — classifications are acts, never ambient
  statusChangedAt?: string;
  evidenceRequired: boolean;             // animal-derived + mashbooh => true (07c rule)
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface SupplierCertificate {
  id: string;
  workspaceId: string;
  supplierName: BilingualString;
  certificateNumber: string;             // the issuing body's own number (Latin digits)
  issuer: string;                        // free text — issuing body name
  scope: string;
  issuedAt: string;                      // ISO date
  expiresAt: string;                     // ISO date
  documentRef?: DocumentRef;             // present when storage capability bound; metadata-mode otherwise
  // Derived at read (never stored): state: 'valid' | 'expiring-soon' | 'expired'
  // valid: expiresAt > now + 90d ; expiring-soon: now < expiresAt <= now + 90d ; expired: expiresAt <= now
}
export interface DocumentRef {
  kind: 'attached' | 'metadata-only';    // metadata-only = LOOP-5 manual path (reference string, no file)
  reference?: string;                    // cabinet/drive reference when metadata-only
  uploadedAt?: string;
  checksum?: string;                     // when attached — integrity evidence, never a secret
}
export interface ResolutionRecord {
  id: string;
  formulationLineId: string;
  basis: 'committee-decision' | 'supplier-evidence' | 'classification';
  justification: string;                 // required text — the recorded rationale
  decidedBy: string;                     // memberId
  committeeRef?: string;                 // meeting/decision reference
  at: string;
}
export type LineResolutionState =
  | 'resolved' | 'needs-evidence' | 'evidence-expiring-soon'
  | 'evidence-expired' | 'unresolved-mashbooh' | 'unresolved-review' | 'haram';
export interface FormulationLine {
  id: string;
  ingredientId: string;
  functionNote?: string;                 // role in formulation (e.g. "مثبت" / stabiliser)
  supplierCertificateId?: string;        // required when ingredient.evidenceRequired
  resolutionId?: string;                 // required when ingredient.status === 'mashbooh'
  // Derived at read: resolutionState per 07c rules — the issuance gate reads this, never free text
}
export interface Formulation {
  id: string;
  productId: string;
  applicationId: string;                 // formulations are authored inside cases (04 IA decision)
  version: number;
  lines: FormulationLine[];
  createdAt: string;
}
export type NonconformityState = 'open' | 'closed' | 'waived';
export interface AuditRecord {
  id: string;
  workspaceId: string;
  target: { applicationId?: string; certificateId?: string };  // case audits + surveillance audits
  auditDate: string;
  siteId?: string;                       // Facility id when case-scoped
  auditorName: string;                   // typed text (no scheduling — LOOP-10)
  findingsSummary: string;
  nonconformities: { count: number; state: NonconformityState; waiverReason?: string };
  documentRef?: DocumentRef;
  recordedBy: string;                    // memberId
  recordedAt: string;
}
export interface CommitteeDecision {
  id: string;
  applicationId: string;
  outcome: 'grant' | 'reject';
  justification: string;                 // required on both outcomes (rejections are records too)
  decidedBy: string;                     // committee memberId — PERMISSION-enforced role
  committeeRef?: string;
  at: string;
}
export interface Certificate {
  id: string;
  workspaceId: string;
  certificateNumber: string;             // the body's own numbering (Western numerals)
  applicantId: string;
  schemeId: string;
  productIds: string[];
  formulationSnapshot: { formulationId: string; version: number };   // what was certified
  issuedAt: string;
  expiresAt: string;                     // issuedAt + scheme.validityMonths
  status: CertificateStatus;
  suspension?: { reason: string; by: string; at: string };
  pinnedLadder: { ladderId: string; version: number };               // policy frozen at issuance
  supersedes?: string;                   // predecessor certificate id
  supersededBy?: string;                 // successor certificate id
  decisionId: string;                    // the grant that authorized issuance
}
export type RungKind =
  | 'notify' | 'docs' | 'submit' | 'audit' | 'issue';
export interface RungSpec {
  kind: RungKind;
  offsetDays: number;                    // days BEFORE expiry; strictly monotonic increasing per ladder
  label: BilingualString;
}
export interface RenewalLadder {
  id: string;
  workspaceId: string;
  schemeId: string;                      // one live ladder version per scheme
  validityMonths: number;
  rungs: RungSpec[];                     // ordered by offsetDays DESC (180 before 120 before 90…)
  version: number;
  updatedBy: string;
  updatedAt: string;
}

// Computed at read from (certificate, pinnedLadder, now, linked application state) — NEVER stored:
export interface RungInstance {
  kind: RungKind;
  label: BilingualString;
  dueDate: string;                       // expiresAt - offsetDays
  state: 'upcoming' | 'reached' | 'cleared' | 'missed';
  clearedBy?: string;                    // activityEntryId / applicationId when cleared
}
export type JobKind = 'ingredient-import' | 'register-export' | 'certificate-export';
export interface ExportArtifact {
  id: string;
  jobId: string;
  format: 'register-document' | 'certificate-document';
  bilingual: true;                       // exports carry both scripts by contract
  expiresAt: string;                     // 7-day retention declared at creation
  regenerable: boolean;
}
export interface ActivityEntry {         // P17 — the accountability spine
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'applicant-created' | 'applicant-updated'
    | 'application-created' | 'application-advanced' | 'application-returned'
    | 'ingredients-imported' | 'ingredient-created' | 'ingredient-updated'
    | 'formulation-saved'
    | 'supplier-cert-recorded' | 'supplier-cert-replaced'
    | 'resolution-recorded'
    | 'audit-recorded'
    | 'decision-recorded'
    | 'certificate-issued' | 'certificate-suspended' | 'certificate-withdrawn'
    | 'renewal-opened' | 'ladder-updated'
    | 'export-run';
  targetRef: string;
  detail?: string;                       // e.g. "status: mashbooh -> haram" — provenance audit
  at: string;
}

