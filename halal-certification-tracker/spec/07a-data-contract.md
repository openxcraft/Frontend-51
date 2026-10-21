# 07a — Data Contract: halal-certification-tracker

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns.md §1): **declared non-AI** — no operation generates, scores, clusters, or transforms content by model; the traceability graph is deterministic set-arithmetic over typed links; the ladder engine is date arithmetic over versioned policy; the issuance gate is a typed refusal over formulation state. There is no assist, no fallback ladder, no quota for capabilities that do not exist (08's degradation map says so plainly). TypeScript declarations for every entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type BilingualString = { ar: string; en: string };   // identity-bearing fields: BOTH required (VALIDATION otherwise)

export type HalalStatus = 'halal' | 'haram' | 'mashbooh' | 'under-review';
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

export type ApplicationKind = 'initial' | 'renewal' | 'modification';
export type ApplicationStage =
  | 'intake' | 'documents' | 'formulation'
  | 'audit' | 'decision' | 'issued';

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

export type CertificateStatus = 'active' | 'suspended' | 'withdrawn' | 'renewed';
// Derived at read (never stored): lapsed — active && now > expiresAt (11 renders it as its own state)

export type UrgencyZone = 'steady' | 'due-soon' | 'overdue' | 'lapsed';

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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                     // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                // async-contract §5
}

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
```

## Relationships

Workspace 1—N Member · Workspace 1—N Applicant · Applicant 1—N Facility · Applicant 1—N Product · Product 1—N Formulation (versioned) · Formulation 1—N FormulationLine · FormulationLine N—1 Ingredient · FormulationLine N—0..1 SupplierCertificate · FormulationLine 1—0..1 ResolutionRecord · Applicant 1—N Application · Application N—0..1 linked Certificate (renewal/modification) · Application 1—N AuditRecord · Application 1—0..1 CommitteeDecision · Application 1—0..1 issued Certificate · Certificate N—1 CommitteeDecision (grant) · Certificate 1—N AuditRecord (surveillance) · Certificate N—1 RenewalLadder (pinned version) · Certificate 0..1—0..1 Certificate (supersedes/supersededBy) · Workspace 1—N RenewalLadder (per scheme, versioned) · Job spans imports/exports · Job 1—N ExportArtifact.

## State obligations (lifecycle invariants)

- **Immutability of computed history**: pinned ladders never mutate when policy changes (a ladder edit creates version N+1; existing certificates keep their pinned version — the register never rewrites history); formulation snapshots on certificates are frozen pointers; parity-class immutability extends to resolutions (a resolution binds its formulation line version).
- **Status derivation is read-time, honest, and total**: certificate `lapsed` derives from active + past expiry; supplier-certificate states derive from expiry vs now with the fixed 90-day horizon; rung states derive from (dueDate, now, clearance evidence); urgency zones derive from rung states + days-to-expiry (07c formulas). The same state always yields the same derived view — the reproducibility an accreditation assessor expects.
- **The issuance gate is total and typed**: issueCertificate requires (a) every formulation line resolutionState = 'resolved', (b) an audit record with nonconformities.state = 'closed' or 'waived', (c) a grant decision. Any failure returns VALIDATION naming the exact unresolved lines and missing records — never a generic rejection.
- **Line resolution rules (07c, fixed)**: `resolved` iff (status='halal' AND (NOT evidenceRequired OR supplierCertificate state ∈ {valid, expiring-soon})) OR (status='mashbooh' AND resolutionId present AND supplier evidence valid where required); `haram` status ⇒ never resolved; `under-review` ⇒ never resolved; evidence-expired ⇒ unresolved (a dated committee acceptance recorded as a resolution can supersede — the honesty valve).
- **Suspended certificates exit urgency zones**: zone derivation reads status='active' only; a suspended certificate's problem is not time (CP-5 edge).
- **Renewal chain integrity**: `supersedes`/`supersededBy` are set at issuance and never edited; a renewal case links exactly one live certificate; a certificate with a successor cannot open another renewal (CONFLICT).
- **Append-only accountability**: every consequential mutation appends an ActivityEntry; corrections (applicant name fixes, classification changes) append rather than overwrite — `detail` carries the delta ("mashbooh -> haram").
- **Partial-result policies**: ingredient-import delivers ingested-so-far + named bad rows (per-row retry); exports deliver per-format with per-format retry (async-contract §4); nothing else is a Job.
- **No provider names anywhere**: document storage, notification, and delivery appear as abstract capabilities in 08; documents render metadata-mode when unbound.
