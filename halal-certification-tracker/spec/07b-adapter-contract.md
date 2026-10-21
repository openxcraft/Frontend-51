# 07b — Adapter Contract: halal-certification-tracker (TypeScript, v1)

SME-G pass · `HalalCertificationAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. **AI declaration: none** — every operation is deterministic data work; there is no assist, no generation, no metered capability (ai-native-patterns §1). Types only — no implementation. Entity semantics (Applicant, Facility, Product, Application, Ingredient, SupplierCertificate, Formulation, FormulationLine, ResolutionRecord, AuditRecord, CommitteeDecision, Certificate, RenewalLadder, RungInstance, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
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
```

## Rules (binding)

1. **Determinism is the contract**: `getIngredientImpact`, rung computation inside `getCertificate`, zone derivation inside `listCertificates`, and all resolution-state reads are pure functions of stored state + the session clock — the same state always yields the same result (the reproducibility an accreditation assessor expects; 07a obligations). No operation has hidden ordering, randomness, or model calls (non-AI declaration).
2. **Issuance gate totality**: `issueCertificate` with any unresolved formulation line, open/waived-missing non-conformity, or absent grant decision → VALIDATION with `details` naming every unresolved line (ingredient name + state) and every missing record. The refusal is the workflow's honesty — never a generic failure.
3. **Role enforcement is typed, not advisory**: viewer mutations → PERMISSION (naming the seat's view rights); assessor/committee attempts on `updateRenewalLadder` → PERMISSION (owner-only policy); non-committee attempts on decision-bearing surfaces → PERMISSION. `recordAuditOutcome` requires assessor-or-owner; `issueCertificate` requires assessor-or-owner; formulation and ingredient edits require assessor-or-owner.
4. **Stage-order semantics**: `advanceApplication` forward-only along the typed ladder unless `returnedReason` is present (backward honesty, logged as `application-returned`); skipping stages → VALIDATION; advancing a case with no formulation to `formulation` stage → VALIDATION.
5. **Renewal integrity**: `openRenewalCase` on a certificate with an existing successor or an open renewal application → CONFLICT naming it; on a suspended certificate → VALIDATION (resolve suspension first); the created application carries `kind: 'renewal'`, `linkedCertificateId`, and the P11 recall behavior (applicant/product data pre-populated — no redundant entry).
6. **Immutability**: pinned ladders never change under policy edits (`updateRenewalLadder` bumps version; live certificates keep theirs); `setCertificateStatus` to 'withdrawn' is terminal (subsequent status changes → VALIDATION); formulation snapshots on issued certificates are frozen.
7. **Idempotency**: `importIngredients`, `exportRegister`, `exportCertificate` carry idempotency keys; a retried submit returns the original job (async-contract §5).
8. **Partial results**: import delivers ingested-so-far with named invalid rows (retry scoped to failed rows); exports declare per-format retry; both policies surface in the job result (async-contract §4).
9. **Ladder policy validation**: `updateRenewalLadder` rung offsets must be strictly monotonic (each rung's date strictly before the previous's, all before expiry) and validity ≥ 1 month → VALIDATION otherwise; CONFLICT on stale `baseVersion` with both payloads in `details`.
10. **Concurrent-edit conflicts**: `setFormulation`, `updateApplicant`, `updateIngredient`, `updateRenewalLadder` with stale `baseVersion` → CONFLICT carrying both payloads — never silent overwrite (P10).
11. **Typed pagination on every list**; cursors opaque; no orphan methods — the 03 coverage table is the audit surface (verified at Critic pass).
12. **No provider names**: document storage, notification, and delivery appear nowhere on this contract; documents travel as `DocumentRef` metadata with the metadata-mode path always accepted (LOOP-5).
