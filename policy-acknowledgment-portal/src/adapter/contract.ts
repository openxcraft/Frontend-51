// VERBATIM from specs-source/policy-acknowledgment-portal/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (Policy, PolicyVersion,
// Segment, Acknowledgment, LedgerEntry, LedgerActionKind, Locale — and their
// fields) are declared canonically in 07a and are part of this contract by
// reference; 07b declares only the operational wrappers (summaries, views,
// jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (publish metadata/label grammar, campaign gates, CSV rows, withdraw/cancel guards)
 * 'NOT_FOUND'    -> NotFoundError     (stale policy/version/campaign/person/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (role scope, inactive-person session links, unconsented channels)
 * 'CONFLICT'     -> ConflictError     (concurrent metadata/campaign/composer edits, stale assignment submits)
 * 'RATE_LIMIT'   -> RateLimitError    (dispatch batches, evidence-pack exports)
 * 'NETWORK'      -> NetworkError      (list fetches, submits, job polling, artifact delivery)
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
  role: 'owner' | 'admin' | 'viewer' | 'acknowledger';
  // owner/admin: full console. viewer: read + export (Omar, 02). acknowledger:
  // the employee shell — reads own assignments, records views, submits
  // acknowledgment/decline; never sees other people's records.
  personId?: string;                      // present for role 'acknowledger'
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (summaries/views; entities per 07a) ----

export type CoverageState = 'acknowledged' | 'pending' | 'overdue' | 'declined';

export interface PolicySummary {
  id: string;
  titleEn: string;
  titleAr?: string;
  category: 'conduct' | 'information-security' | 'hr' | 'safety' | 'finance' | 'data-privacy' | 'other';
  governingLocale: 'ar' | 'en';
  currentVersion?: { id: string; label: string; effectiveDate: string; status: 'published' | 'superseded' | 'withdrawn' };
  coverage: { acknowledged: number; pending: number; overdue: number; declined: number };  // across ACTIVE campaigns, latest version
  unpairedTitle: boolean;                 // honest warning surface (never blocks)
  updatedAt: string;
}

export interface VersionSummary {
  id: string;
  policyId: string;
  label: string;
  status: 'draft' | 'published' | 'superseded' | 'withdrawn';
  effectiveDate?: string;
  supersedesVersionId?: string;
  localesPresent: Locale[];
  unpairedWarning: boolean;               // published without the non-governing side
  acknowledgmentCount: number;            // lifetime census for this version
  publishedAt?: string;
}

export interface PersonRow {
  id: string;
  employeeNumber: string;                 // Western numerals (05)
  nameEn: string;
  nameAr?: string;                        // bidi-isolated at render (rtl-rules §2)
  site: string;
  kind: 'employee' | 'contractor';
  status: 'active' | 'inactive';
  readingLocale: Locale;
  segmentIds: string[];
}

export interface CampaignSummary {
  id: string;
  policyVersionId: string;
  policyTitleEn: string;
  policyTitleAr?: string;
  versionLabel: string;
  state: 'running' | 'cancelled';
  dueDate: string;
  reminderCadenceDays: number[];
  requireLocale: 'governing' | 'both';
  coverage: { assigned: number; acknowledged: number; pending: number; overdue: number; declined: number };
  // overdue = past dueDate AND not acknowledged/declined — derived at read,
  // deterministic; never stored as a judgment (07a state obligations).
  launchedAt: string;
}

export interface AssignmentView {
  id: string;
  campaignId: string;
  person: PersonRow;
  state: 'assigned' | 'acknowledged' | 'declined';
  coverageState: CoverageState;           // derived: assigned+past-due -> 'overdue'
  localesAttested?: Locale[];
  submittedAt?: string;
  declinedAt?: string;
}

export interface AcknowledgmentView {
  id: string;
  person: PersonRow;
  campaignId: string;
  policyVersionId: string;
  versionLabel: string;
  attestationTextId: string;
  attestationText: { textEn: string; textAr?: string };
  localesAttested: Locale[];
  readEvidence: { locale: Locale; openedAt: string }[];
  submittedAt: string;
  attestationDigest: string;
  ledgerEntryId: string;
}

export interface MyAssignmentView {
  assignmentId: string;
  policyTitleEn: string;
  policyTitleAr?: string;
  versionLabel: string;
  effectiveDate: string;
  governingLocale: Locale;
  requireLocale: 'governing' | 'both';
  dueDate: string;
  state: 'assigned' | 'acknowledged' | 'declined';
  localesOpened: Locale[];                // from this person's read evidence
  attestedAt?: string;
}

export interface ReaderBodyView {
  assignmentId: string;
  policyVersionId: string;
  titleEn: string;
  titleAr?: string;
  versionLabel: string;
  effectiveDate: string;
  governingLocale: Locale;
  requireLocale: 'governing' | 'both';
  bodies: { locale: Locale; text: string; contentDigest: string }[];
  attestationText: { textEn: string; textAr?: string };
  personName: string;                     // pre-fill for typed-name confirmation (P11)
  localesOpened: Locale[];                // read evidence to date (03 CP-3.4)
}

export interface LedgerRow {
  id: string;
  actorMemberId: string;
  actorKind: 'admin' | 'acknowledger' | 'system';
  action: LedgerActionKind;               // per 07a
  targetRef: string;
  detail?: string;
  at: string;
}

export interface Job<T> {                 // operational view over 07a's JobRecord entity
  id: string;
  kind: 'import-people' | 'dispatch' | 'export-evidence-pack';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface PolicyAcknowledgmentAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // policies (register)
  listPolicies(query: {
    filter?: { category?: PolicySummary['category'][]; governingLocale?: ('ar' | 'en')[]; status?: ('active' | 'draft-only' | 'retired')[] };
    search?: string;                      // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'titleEn' | 'category';
    cursor?: string; limit: number;
  }): Promise<Result<Page<PolicySummary>, AdapterError>>;
  getPolicy(id: string): Promise<Result<PolicySummary & { versions: VersionSummary[] }, AdapterError>>;
  createPolicy(input: {
    titleEn: string; titleAr?: string;
    category: PolicySummary['category'];
    ownerMemberId: string;
    governingLocale: 'ar' | 'en';
  }): Promise<Result<PolicySummary, AdapterError>>;
  updatePolicyMetadata(id: string, patch: {
    titleEn?: string; titleAr?: string; category?: PolicySummary['category'];
    ownerMemberId?: string; governingLocale?: 'ar' | 'en';
    baseUpdatedAt: string;
  }): Promise<Result<PolicySummary, AdapterError>>;

  // versions (document-control publish; bodies are read-only evidence — LOOP-10)
  publishPolicyVersion(input: {
    policyId: string;
    label: string;                        // grammar: drafts 'v0.x', published 'v1.0+' (07c validation rules)
    status: 'draft' | 'published';
    bodies: { locale: Locale; source: 'paste' | 'upload'; text: string }[];
    changeSummaryEn?: string;
    changeSummaryAr?: string;
    effectiveDate: string;                // ISO date; not in the past when status='published'
    supersedesVersionId?: string;         // proposed: current published version
    idempotencyKey: string;               // async-contract §5 — a double-click never double-publishes
  }): Promise<Result<VersionSummary & { policy: PolicySummary }, AdapterError>>;
  listPolicyVersions(query: {
    policyId: string;
    filter?: { status?: VersionSummary['status'][] };
    sort: 'effectiveDate' | 'label';
    cursor?: string; limit: number;
  }): Promise<Result<Page<VersionSummary>, AdapterError>>;
  getPolicyVersion(id: string): Promise<Result<VersionSummary & {
    bodies: { locale: Locale; source: 'paste' | 'upload'; text: string; contentDigest: string; charCount: number }[];
    changeSummaryEn?: string; changeSummaryAr?: string;
    withdrawalReason?: string;
    campaignHistory: { campaignId: string; state: 'running' | 'cancelled'; coverage: CampaignSummary['coverage'] }[];
  }, AdapterError>>;
  withdrawPolicyVersion(input: {
    versionId: string; reason: string;    // required; appended to the ledger, never edited
    idempotencyKey: string;
  }): Promise<Result<VersionSummary, AdapterError>>;

  // people (directory; manual paths are PRIMARY — LOOP-5)
  listPeople(query: {
    filter?: { site?: string; kind?: ('employee' | 'contractor')[]; status?: ('active' | 'inactive')[]; segmentId?: string };
    search?: string;                      // matches nameEn/nameAr (normalized) or employeeNumber
    sort: 'nameEn' | 'employeeNumber' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<PersonRow>, AdapterError>>;
  createPerson(input: {
    employeeNumber: string; nameEn: string; nameAr?: string;
    email?: string; phone?: string; site: string;
    kind: 'employee' | 'contractor'; readingLocale: Locale; segmentIds: string[];
  }): Promise<Result<PersonRow, AdapterError>>;
  importPeople(input: {
    rows: { employeeNumber: string; nameEn: string; nameAr?: string; email?: string; phone?: string; site: string; kind: 'employee' | 'contractor'; readingLocale: Locale; segmentIds: string[] }[];
    idempotencyKey: string;
  }): Promise<Result<Job<{ imported: number; duplicates: number; invalidRows: string[]; updated: number }>, AdapterError>>;
  updatePerson(id: string, patch: {
    nameEn?: string; nameAr?: string; email?: string; phone?: string; site?: string;
    readingLocale?: Locale; segmentIds?: string[];
    status?: 'active' | 'inactive';       // deactivation NEVER deletes history (07a)
  }): Promise<Result<PersonRow, AdapterError>>;

  // segments (membership edits affect FUTURE campaigns only)
  listSegments(query: {
    filter?: { siteScope?: string };
    search?: string;
    sort: 'nameEn' | 'memberCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<Segment & { memberCount: number }>, AdapterError>>;
  createSegment(input: { nameEn: string; nameAr?: string; memberPersonIds: string[] }): Promise<Result<Segment, AdapterError>>;
  updateSegment(id: string, patch: { nameEn?: string; nameAr?: string; memberPersonIds?: string[] }): Promise<Result<Segment & { memberCount: number }, AdapterError>>;

  // campaigns (launch = membership snapshot + dispatch handoff)
  createCampaign(input: {
    policyVersionId: string;
    segmentIds: string[];
    dueWindowDays: number;                // >= 1
    reminderCadenceDays: number[];
    attestationText: { textEn: string; textAr?: string };   // governing-locale text REQUIRED (03 CP-2 gate)
    requireLocale: 'governing' | 'both';
    idempotencyKey: string;
  }): Promise<Result<CampaignSummary & { dispatchJobId?: string; chaseListAvailable: boolean }, AdapterError>>;
  updateCampaign(id: string, patch: {
    dueWindowDays?: number;               // appends campaign-extended with before/after (ledger, never edit)
    reminderCadenceDays?: number[];
  }): Promise<Result<CampaignSummary, AdapterError>>;
  listCampaigns(query: {
    filter?: { state?: ('running' | 'cancelled')[]; policyId?: string; policyVersionId?: string; segmentId?: string };
    sort: 'launchedAt' | 'dueDate';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CampaignSummary>, AdapterError>>;
  getCampaign(id: string): Promise<Result<CampaignSummary & { segments: { id: string; nameEn: string; nameAr?: string; memberCountAtLaunch: number }[]; attestationText: { textEn: string; textAr?: string } }, AdapterError>>;
  cancelCampaign(input: { campaignId: string; reason: string; idempotencyKey: string }): Promise<Result<CampaignSummary, AdapterError>>;

  // acknowledgments (admin views + drills)
  listAcknowledgments(query: {
    campaignId?: string;
    personId?: string;
    policyVersionId?: string;
    filter?: { coverageState?: CoverageState[] };
    sort: 'submittedAt' | 'personName';
    cursor?: string; limit: number;
  }): Promise<Result<Page<AssignmentView>, AdapterError>>;
  getAcknowledgment(id: string): Promise<Result<AcknowledgmentView | DeclineView, AdapterError>>;

  // acknowledger path (employee shell; role 'acknowledger', own data only)
  listMyAssignments(query: {
    filter?: { state?: ('assigned' | 'acknowledged' | 'declined')[] };
    sort: 'dueDate' | 'launchedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<MyAssignmentView>, AdapterError>>;
  getPolicyVersionForReader(assignmentId: string): Promise<Result<ReaderBodyView, AdapterError>>;
  recordView(input: { assignmentId: string; locale: Locale }): Promise<Result<{ localesOpened: Locale[] }, AdapterError>>;
  submitAcknowledgment(input: {
    assignmentId: string;
    localesAttested: Locale[];            // must satisfy the campaign's requireLocale rule and localesOpened
    typedName: string;                    // typed-name confirmation; must match person name (07c rule)
    idempotencyKey: string;               // double-submit returns the existing acknowledgment (atomic, 07a)
  }): Promise<Result<{ acknowledgmentId: string; ledgerEntryId: string; attestationDigest: string; submittedAt: string }, AdapterError>>;
  submitDecline(input: { assignmentId: string; reason?: string; idempotencyKey: string }): Promise<Result<{ declineId: string; ledgerEntryId: string; declinedAt: string }, AdapterError>>;

  // ledger (append-only; keyboard-navigable + exportable — a11y-baseline §7)
  listLedger(query: {
    filter?: { action?: LedgerActionKind[]; actorKind?: ('admin' | 'acknowledger' | 'system')[]; policyId?: string; campaignId?: string; from?: string; to?: string };
    sort: 'at' | 'action';
    cursor?: string; limit: number;
  }): Promise<Result<Page<LedgerRow>, AdapterError>>;

  // evidence packs (export is the audit deliverable; download is primary — LOOP-5)
  exportEvidencePack(input: {
    scope: { campaignId?: string; policyVersionId?: string };   // at least one required
    options: { attestationTextAppendix?: boolean };            // default true
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[]; packDigest: string }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; campaignId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    dispatchBatches: number; dispatchRecipients: number;
    exports: number;
    resetAt: string;
  }, AdapterError>>;
}

// DeclineView mirrors AcknowledgmentView for declined assignments (07a DeclineRecord):
export interface DeclineView {
  id: string;
  person: PersonRow;
  campaignId: string;
  policyVersionId: string;
  versionLabel: string;
  reason?: string;
  declinedAt: string;
  ledgerEntryId: string;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type GoverningLocaleRule = 'ar' | 'en';        // per policy; KSA Labor Law Article 9 posture → 'ar' (research [33][34])
export type PolicyCategory =
  | 'conduct' | 'information-security' | 'hr'
  | 'safety' | 'finance' | 'data-privacy' | 'other';
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;                 // admin chrome default (LOOP-6 proposed)
  governingLocaleHint: GoverningLocaleRule; // default proposed at policy creation (jurisdiction posture)
  createdAt: string;
}
export interface Policy {
  id: string;
  workspaceId: string;
  titleEn: string;                        // human-authored pair; never auto-translated
  titleAr?: string;                       // unpaired sides warn, never block (02 voice: honesty)
  category: PolicyCategory;
  ownerMemberId: string;
  governingLocale: GoverningLocaleRule;
  currentVersionId?: string;              // latest PUBLISHED version
  status: 'active' | 'draft-only' | 'retired';
  createdAt: string;
  updatedAt: string;
}
export type VersionStatus =
  | 'draft'          // label 0.x, bodies may be unpaired, not targetable by campaigns
  | 'published'      // label 1.0+, governing-locale body required, campaigns may target
  | 'superseded'     // a later version superseded it; evidence for its period remains valid
  | 'withdrawn';     // administratively withdrawn with a recorded reason; never silently deleted
export interface PolicyBody {
  locale: Locale;
  source: 'paste' | 'upload';             // paste is the always-available path (LOOP-5)
  text: string;                           // stored whole, read-only (LOOP-10: no authoring)
  contentDigest: string;                  // deterministic digest of the body text (computed, never edited)
  charCount: number;
}
export interface PolicyVersion {
  id: string;
  policyId: string;
  label: string;                          // document-control grammar: drafts 'v0.x', published 'v1.0+' (research [44]–[51])
  status: VersionStatus;
  bodies: PolicyBody[];                   // 1 or 2 entries; governing locale REQUIRED when status='published'
  changeSummaryEn?: string;
  changeSummaryAr?: string;
  effectiveDate: string;                  // ISO date, not in the past at publish time
  supersedesVersionId?: string;           // set at publish; the chain is the policy's history
  withdrawalReason?: string;              // required when status='withdrawn'
  publishedAt?: string;
  publishedByMemberId?: string;
  createdAt: string;
}
export interface Person {
  id: string;
  employeeNumber: string;                 // unique, Western numerals (05 typography)
  nameEn: string;
  nameAr?: string;                        // unpaired names render honestly (bidi-isolated)
  email?: string;                         // optional: frontline staff may have none (02 Mariam)
  phone?: string;
  site: string;
  kind: 'employee' | 'contractor';
  status: 'active' | 'inactive';          // never deleted — audit honesty (07a state obligations)
  deactivatedAt?: string;
  readingLocale: Locale;                  // acknowledger portal default (E1/E2)
  segmentIds: string[];
  createdAt: string;
  updatedAt: string;
}
export interface Segment {
  id: string;
  workspaceId: string;
  nameEn: string;
  nameAr?: string;
  memberPersonIds: string[];              // membership edits affect FUTURE campaigns only (snapshot contract)
  createdAt: string;
  updatedAt: string;
}
export interface AttestationText {
  id: string;
  textEn: string;                         // the exact words a person attests to; human-authored pair
  textAr?: string;                        // governing-locale text REQUIRED at campaign launch
  createdAt: string;
}
export interface Campaign {
  id: string;
  workspaceId: string;
  policyVersionId: string;                // pinned: campaigns target versions, not policies
  segmentIds: string[];                   // membership SNAPSHOTTED into assignments at launch
  dueWindowDays: number;                  // >= 1
  dueDate: string;                        // computed at launch: launchAt + dueWindowDays
  reminderCadenceDays: number[];          // e.g. [3, 7] — calm schedule, P21
  attestationTextId: string;              // pinned: the acknowledgment pins the exact text
  requireLocale: 'governing' | 'both';    // what MUST be read before submit unlocks
  state: 'running' | 'cancelled';
  launchedAt: string;
  launchedByMemberId: string;
  cancelledAt?: string;
  cancellationReason?: string;
}
export interface Assignment {
  id: string;
  campaignId: string;
  personId: string;                       // deduplicated per campaign (one assignment per person)
  state: 'assigned' | 'acknowledged' | 'declined';
  assignedAt: string;                     // snapshot moment — membership drift never rewrites this
}
export interface ReadEvidence {
  locale: Locale;
  openedAt: string;                       // per-locale view events; timestamps, not scroll policing (LOOP-10)
}
export interface Acknowledgment {
  id: string;
  assignmentId: string;
  personId: string;
  campaignId: string;
  policyVersionId: string;                // permanent pin — evidence never drifts (00 unique feature)
  attestationTextId: string;              // permanent pin to the exact words agreed
  localesAttested: Locale[];              // what the person actually attested against
  readEvidence: ReadEvidence[];           // which locales were opened, when
  submittedAt: string;                    // announced with the action (a11y-baseline §7)
  attestationDigest: string;              // deterministic digest over (personId, policyVersionId, attestationTextId, submittedAt)
}
export interface DeclineRecord {
  id: string;
  assignmentId: string;
  personId: string;
  campaignId: string;
  policyVersionId: string;
  reason?: string;                        // optional; a recorded fact, never auto-escalated (LOOP-10)
  declinedAt: string;
}
export type LedgerActionKind =
  | 'policy-created' | 'metadata-updated' | 'version-published' | 'version-withdrawn'
  | 'campaign-launched' | 'campaign-extended' | 'campaign-cancelled' | 'dispatch-sent' | 'dispatch-failed'
  | 'view-recorded' | 'acknowledgment-recorded' | 'decline-recorded' | 'reminder-sent'
  | 'person-created' | 'person-updated' | 'segment-created' | 'segment-updated'
  | 'consent-changed' | 'export-run';
export interface LedgerEntry {            // the attestation audit trail — append-only (P17 + §7 overlay)
  id: string;
  workspaceId: string;
  actorMemberId: string;                  // for employee-path entries: the person's acknowledger session
  actorKind: 'admin' | 'acknowledger' | 'system';
  action: LedgerActionKind;
  targetRef: string;                      // entity id the action concerns
  detail?: string;                        // e.g. version label + effective date; extension before/after values
  at: string;
}
export type JobKind = 'import-people' | 'dispatch' | 'export-evidence-pack';
export interface JobRecord {              // the persisted job entity; 07b's Job<T> is the
  id: string;                            // operational view over it (typed partial/result)
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                      // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                 // async-contract §5
}
export interface ExportArtifact {
  id: string;
  jobId: string;
  scope: { campaignId?: string; policyVersionId?: string };
  includesAttestationTextAppendix: boolean;
  expiresAt: string;                      // declared retention window at creation
  regenerable: boolean;                   // from immutable state, always true at v1
}

