# 07b — Adapter Contract: policy-acknowledgment-portal (TypeScript, v1)

SME-G pass · `PolicyAcknowledgmentAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session, idempotency keys, partial-result policies. Types only — no implementation. AI declaration (ai-native-patterns.md §1): **declared non-AI — deterministic attestation ledger**; zero assist/generation/inspection operations exist on this surface, and none may be added without a LOOP-4 record. Entity semantics (Policy, PolicyVersion, PolicyBody, Segment, Person, AttestationText, Campaign, Assignment, Acknowledgment, DeclineRecord, ReadEvidence, LedgerEntry, JobRecord, ExportArtifact): 07a. Every operation traces to ≥1 flow (03 coverage table, verified zero-orphans).

```ts
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
```

## Binding rules

1. **Atomicity of attestations**: `submitAcknowledgment` and `submitDecline` are all-or-nothing — exactly one terminal record plus exactly one ledger entry, or a typed error; a replayed idempotency key returns the original result and appends nothing (async-contract §4's declared attestations exception + §5).
2. **Evidence immutability**: no operation mutates a recorded `Acknowledgment`, `DeclineRecord`, `PolicyBody` digest, or `LedgerEntry`; `updateCampaign`'s due-window extension appends a `campaign-extended` ledger entry carrying before/after values in `detail` — corrections append, never edit (house grammar shared with contract-lifecycle-manager's Q-14).
3. **Version pins are permanent**: campaign, acknowledgment, and decline records carry `policyVersionId` resolved at creation; superseding a version never re-points them, and `listAcknowledgments`/`getAcknowledgment` return the label of the version as pinned (the evidence reads the version the person saw).
4. **Snapshot scope**: `createCampaign` resolves segment membership into per-person assignments at launch; `updateSegment` afterwards affects future campaigns only. One assignment per person per campaign — overlapping segment membership is deduplicated at launch and the overlap is named in the result.
5. **Gates are typed, never silent**: publishing requires the governing locale's body, a label matching the grammar (draft `v0.x` / published `v1.0+`), and a non-past effective date; launching requires the governing-locale attestation text, a due window ≥ 1, non-empty segments, and no active campaign overlapping the same version+person scope; submitting requires `localesAttested` ⊆ `localesOpened` and satisfying `requireLocale`, plus a typed name matching the person's recorded name. Every refusal returns VALIDATION naming the exact gate (03 edge copy in 11 C).
6. **Derived zones are pure functions**: `coverageState: 'overdue'` is computed at read from `dueDate` and terminal-state absence — same state, same zone, every read; it is never stored, never a judgment, and never triggers automated escalation (LOOP-10).
7. **Session scope is honest**: `role: 'viewer'` mutations → PERMISSION with the seat's scope named; `role: 'acknowledger'` reads only its own `personId`'s assignments and evidence; session links for inactive persons → PERMISSION with the admin-contact copy (no orphan attestations).
8. **Idempotency on every consequential submit**: publish, withdraw, campaign create/cancel, import, acknowledgment/decline submit, and evidence-pack export all carry idempotency keys; a retried submit returns the original result (async-contract §5) — a double-send never double-records.
9. **Partial-result policies are declared per job kind**: import delivers prior-good rows + named invalid rows; dispatch delivers per-recipient accounting with failed-recipient retry (channel failure never fails the campaign); export delivers per-section partial with per-section retry. No job ever fakes synchronous completion (async-contract §1).
10. **Quota bounds delivery, never truth**: RATE_LIMIT applies to dispatch batches and evidence-pack exports only; ledger reads, coverage reads, and acknowledgment submits are never rate-limited — a compliance product that rations its own audit trail is a design failure (01 pricing posture; P14 governs the metered surfaces only).
11. **Bilingual copy parity**: every human-facing string the adapter returns (labels, warnings, validation messages) exists in both locales with Western numerals in both; unpaired states surface as warnings, never blocks, except where the governing-locale gate applies (07a obligations; 11 matrix is the record).
12. **No AI surface**: no operation name, parameter, or result field may suggest generation, suggestion, or scoring; adding any such operation requires a LOOP-4 record in 12 first (ai-native-patterns §1 declaration discipline).
