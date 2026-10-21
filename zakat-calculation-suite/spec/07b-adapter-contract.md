# 07b — Adapter Contract: zakat-calculation-suite (TypeScript, v1)

SME-G pass · `ZakatCalculationAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session, idempotency keys on every submit-shaped operation. Types only — no implementation. Entity semantics (Workspace, ZakatCase, CaseItem, MethodologyProfile, NisabReference, CalculationResult, ComparisonSet, Job, ExportArtifact, ActivityEntry): 07a; 07b declares only the operational wrappers its signatures need. AI declaration: **non-AI** — no operation in this contract generates, inspects, clusters, or transforms content by model; the arithmetic is deterministic by construction (ai-native-patterns §1 — absence declared, not hidden).

```ts
// Single contract surface. Entities are declared canonically in 07a and are
// part of this contract by reference; 07b adds only summaries and view types.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (bad import rows, draft/retired profile gate,
 *                                        locked-case mutation gate, unpinned nisab)
 * 'NOT_FOUND'    -> NotFoundError     (stale case/item/calculation/artifact links)
 * 'PERMISSION'   -> PermissionError   (role gates: review, lock, approve, export classes)
 * 'CONFLICT'     -> ConflictError     (concurrent case/item/profile edits)
 * 'RATE_LIMIT'   -> RateLimitError    (imports, exports — never calculations)
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
  role: 'owner' | 'officer' | 'reviewer' | 'viewer';   // 07a role grammar
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entity summaries (full shapes per 07a) ----

export type CaseStatus =
  | 'draft' | 'in-review' | 'approved' | 'locked' | 'exported-versions-exist';

export interface CaseSummary {
  id: string;
  reference: string;
  subject: { en?: string; ar?: string };   // bidi-isolated at render (rtl-rules §2)
  periodEnd: string;
  currency: string;
  status: CaseStatus;
  profileId: string;
  itemCounts: { active: number; voided: number };
  latestCalculationId?: string;
  latestComparisonId?: string;
  predecessorCaseId?: string;
  updatedAt: string;
}

export interface ItemRow {
  id: string;
  caseId: string;
  category: ItemCategory;                    // 07a union
  side: 'asset' | 'liability';
  description: { en?: string; ar?: string };
  amountDisplay: string;                     // canonical Western-digit string (rtl-rules §3);
                                            // display formatting happens above the adapter
  quantity?: { value: number; unit: 'head' | 'kg' };
  weightGrams?: number;
  isJewelry?: boolean;
  irrigation?: 'rain-fed' | 'irrigated-at-cost' | 'mixed';
  recoverability?: 'strong' | 'weak';
  acquiredMidHawl?: boolean;
  sourceNote?: string;
  voided?: { reason: string; at: string };
  createdAt: string;
}

export interface ProfileSummary {
  id: string;
  name: { en?: string; ar?: string };
  school: 'hanafi' | 'shafii' | 'maliki' | 'hanbali' | 'contemporary';
  institutionalPreset?: 'aaoifi-fas9-net-asset' | 'corporate-regulation' | 'custom-institutional';
  nisabBasis: 'gold' | 'silver';
  status: 'draft' | 'approved' | 'retired';
  version: number;
  approvedAt?: string;
  updatedAt: string;
}

export interface NisabReferenceSummary {
  id: string;
  metal: 'gold' | 'silver';
  perGramDisplay: string;                    // canonical string per 07a Money
  currency: string;
  asOf: string;
  sourceNote: string;
  active: boolean;
  createdAt: string;
}

export interface CalculationSummary {
  id: string;
  caseId: string;
  caseVersion: number;
  profileId: string;
  profileVersion: number;
  zakatDueDisplay: string;                   // canonical string; AR-indic/Western is display
  aboveNisab: boolean;
  inKindDues: { kind: string; count: number }[];
  generatedAt: string;
}

export interface ComparisonSummary {
  id: string;
  caseId: string;
  profileIds: string[];
  divergenceCount: number;
  generatedAt: string;
}

export interface JobView {
  id: string;
  kind: 'import' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  error?: AdapterError;
  createdAt: string;
}

// ---- Contract ----

export interface ZakatCalculationAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // cases
  createCase(input: {
    reference: string;
    subject: { en?: string; ar?: string };
    subjectType: 'individual' | 'entity';
    periodStart: string;
    periodEnd: string;
    currency: string;
    profileId: string;                // must reference an approved profile (typed gate)
  }): Promise<Result<CaseSummary, AdapterError>>;
  listCases(query: {
    filter?: { status?: CaseStatus[]; school?: ProfileSummary['school'][]; currency?: string[] };
    search?: string;                  // normalized bilingual search (rtl-rules §4)
    sort: 'periodEnd' | 'updatedAt' | 'reference';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CaseSummary>, AdapterError>>;
  getCase(id: string): Promise<Result<CaseSummary & {
    pinnedNisabRefs: { gold?: string; silver?: string };
    version: number;
  }, AdapterError>>;
  updateCase(id: string, patch: {
    subject?: { en?: string; ar?: string };
    periodStart?: string;
    periodEnd?: string;
    profileId?: string;               // draft-only mutation; re-runs produce new results
    baseVersion: number;
  }): Promise<Result<CaseSummary, AdapterError>>;

  // items (manual single-add is the LOOP-5 primary path; bulk import is the convenience)
  addCaseItem(caseId: string, input: Omit<ItemRow,
    'id' | 'caseId' | 'createdAt' | 'voided'
  >): Promise<Result<ItemRow, AdapterError>>;
  importItems(input: {
    caseId: string;
    rows: { rawLine: string;          // parsed per the declared import grammar (07c)
            categoryHint?: string; descriptionHint?: string;
            amountText?: string; quantityText?: string }[];
    idempotencyKey: string;           // async-contract §5 — double-submit never double-imports
  }): Promise<Result<JobView & { result?: { accepted: number; badRows: string[] } }, AdapterError>>;
  listCaseItems(query: {
    caseId: string;
    filter?: { category?: ItemCategory[]; side?: ('asset' | 'liability')[]; voided?: boolean };
    search?: string;
    sort: 'category' | 'createdAt' | 'amount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ItemRow>, AdapterError>>;
  updateCaseItem(itemId: string, patch: {
    amount?: { minorUnits: number; currency: string; minorDigits: 2 | 3 };
    quantity?: { value: number; unit: 'head' | 'kg' };
    weightGrams?: number;
    isJewelry?: boolean;
    irrigation?: 'rain-fed' | 'irrigated-at-cost' | 'mixed';
    recoverability?: 'strong' | 'weak';
    acquiredMidHawl?: boolean;
    description?: { en?: string; ar?: string };
    sourceNote?: string;
    baseCaseVersion: number;
  }): Promise<Result<ItemRow, AdapterError>>;
  voidCaseItem(itemId: string, reason: string): Promise<Result<ItemRow, AdapterError>>;

  // calculations (deterministic, synchronous, budget-bound per 10-performance)
  runCalculation(caseId: string): Promise<Result<CalculationSummary & {
    basket: { netBaseDisplay: string; nisabValueDisplay: string; aboveNisab: boolean };
    trace: unknown[];                 // TraceLine[] per 07a — the audit spine
    perCategory: unknown[];
  }, AdapterError>>;
  getCalculation(caseId: string): Promise<Result<CalculationSummary & {
    trace: unknown[];
    perCategory: unknown[];
    basket: { netBaseDisplay: string; nisabValueDisplay: string; aboveNisab: boolean };
  }, AdapterError>>;
  listCalculations(query: {
    caseId: string;
    sort: 'generatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<CalculationSummary>, AdapterError>>;

  // methodology comparison (the signature flow — same items, named differences)
  createComparison(caseId: string, profileIds: string[]): Promise<Result<ComparisonSummary & {
    results: { profileId: string; calculationId: string; zakatDueDisplay: string }[];
    divergences: { category: ItemCategory; perProfile: { profileId: string; due: string }[];
                   ruleRef: string; reason: { en?: string; ar?: string } }[];
  }, AdapterError>>;
  getComparison(id: string): Promise<Result<ComparisonSummary & {
    results: { profileId: string; calculationId: string; zakatDueDisplay: string }[];
    divergences: { category: ItemCategory; perProfile: { profileId: string; due: string }[];
                   ruleRef: string; reason: { en?: string; ar?: string } }[];
  }, AdapterError>>;
  listComparisons(query: {
    filter?: { caseId?: string };
    sort: 'generatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ComparisonSummary>, AdapterError>>;

  // methodology profiles (rules as sourced data; owner-role approval gate)
  listProfiles(query: {
    filter?: { school?: ProfileSummary['school'][]; status?: ProfileSummary['status'][] };
    sort: 'updatedAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ProfileSummary>, AdapterError>>;
  getProfile(id: string): Promise<Result<ProfileSummary & {
    nisabGrams: { gold: number; silver: number };
    rules: Record<string, unknown>;          // CategoryRules per 07a, source notes included
    sourceNotes: unknown[];
  }, AdapterError>>;
  saveProfile(profile: {
    id?: string;
    name: { en?: string; ar?: string };
    school: ProfileSummary['school'];
    institutionalPreset?: ProfileSummary['institutionalPreset'];
    nisabBasis: 'gold' | 'silver';
    nisabGrams: { gold: number; silver: number };
    rules: Record<string, unknown>;
    baseVersion?: number;
  }): Promise<Result<ProfileSummary, AdapterError>>;   // owner role only (typed PERMISSION)
  approveProfile(id: string, note: string): Promise<Result<ProfileSummary, AdapterError>>;
  retireProfile(id: string, note: string): Promise<Result<ProfileSummary, AdapterError>>;

  // nisab & valuation references (entered references are the primary path — LOOP-5)
  listNisabReferences(query: {
    filter?: { metal?: ('gold' | 'silver')[]; active?: boolean };
    sort: 'asOf' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<NisabReferenceSummary>, AdapterError>>;
  setNisabReference(input: {
    metal: 'gold' | 'silver';
    perGram: { minorUnits: number; currency: string; minorDigits: 2 | 3 };
    asOf: string;
    sourceNote: string;                // where the value came from — accountability field
  }): Promise<Result<NisabReferenceSummary, AdapterError>>;
  pinNisabReferences(caseId: string, refs: {
    gold: string; silver: string;      // NisabReference ids; frozen into results
    baseCaseVersion: number;
  }): Promise<Result<CaseSummary, AdapterError>>;

  // review & certification (role-gated; locked cases are frozen evidence)
  submitCaseForReview(caseId: string, note: string): Promise<Result<CaseSummary, AdapterError>>;
  reviewCase(caseId: string, decision: { approve: true; note: string } |
    { approve: false; note: string }): Promise<Result<CaseSummary, AdapterError>>;
  lockCase(caseId: string): Promise<Result<CaseSummary, AdapterError>>;
  createSuccessorCase(caseId: string, reason: string): Promise<Result<CaseSummary, AdapterError>>;

  // exports (jobs; audit-bundle requires locked; items-csv any status)
  exportCase(input: {
    caseId: string;
    format: 'audit-bundle' | 'items-csv';
    options: { includeTrace?: boolean; locale: 'ar' | 'en' | 'bilingual' };
    idempotencyKey: string;
  }): Promise<Result<JobView & { result?: { artifacts: { artifactId: string; expiresAt: string }[] } }, AdapterError>>;
  exportComparison(input: {
    comparisonId: string;
    format: 'audit-bundle';
    options: { locale: 'ar' | 'en' | 'bilingual' };
    idempotencyKey: string;
  }): Promise<Result<JobView & { result?: { artifacts: { artifactId: string; expiresAt: string }[] } }, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string; expiresAt: string; regenerable: boolean; format: string;
  }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: JobView['state'][]; kind?: JobView['kind'][]; caseId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<JobView>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    calculationsRun: number; comparisonsRun: number; imports: number; exports: number;
    resetAt: string;
    note: string;                     // calculations never metered — determinism is not rationed
  }, AdapterError>>;
}
```

## Rules

1. **Determinism is the contract**: `runCalculation` is a pure function of (items at `caseVersion`, profile at `profileVersion`, pinned nisab references); re-running an unchanged case returns the identical result id. The audit export and every comparison cell inherit this invariant — a number that cannot be reproduced is a defect, not a rounding difference.
2. **Approval gate**: `runCalculation` on a case whose profile is `draft` or `retired` → VALIDATION naming the approval gate and the profile owner; `createCase` with a non-approved profileId → VALIDATION at the door. Comparison runs refuse mixed-status profile sets the same way.
3. **Lock gate**: mutations (`updateCase`, item writes, `pinNisabReferences`, `submitCaseForReview`) on a `locked` or `approved` case → VALIDATION naming the successor path (`createSuccessorCase`); `exportCase` format `audit-bundle` requires `locked` (the audit artifact represents a certified computation — a draft audit is a contradiction); `items-csv` is allowed on any status because it is data extraction, not certification.
4. **Role gates**: `saveProfile`/`approveProfile`/`retireProfile` → owner only (the shariah authority — PERMISSION in capability language, never a vendor or role-shaming message); `reviewCase`/`lockCase`/`createSuccessorCase` → reviewer or owner; `submitCaseForReview` → officer+; viewer role → read + export-artifact reads only. Export of locked cases is deliberately open to viewers — the external auditor's seat (02 Ibrahim/Fatima).
5. **Nisab pinning honesty**: `runCalculation` with no pinned references → VALIDATION naming the two metals and the manual entry path; results freeze `nisabRefs` so later reference changes never rewrite history (07a evidence pins).
6. **Idempotency**: `importItems`, `exportCase`, `exportComparison` carry idempotency keys; a retried submit returns the original job, never a second import or a duplicate artifact (async-contract §5).
7. **Partial-result policies**: import delivers accepted-so-far with named bad rows and per-row retry; exports are per-artifact atomic with scoped retry; calculations are all-or-nothing (atomicity is semantically required for a certified number — declared per async-contract §4).
8. **Concurrency**: `updateCase`, `updateCaseItem`, `saveProfile`, `pinNisabReferences` validate base versions; stale → CONFLICT with both payloads in `details`; the item grid's inline edits are recoverable without data loss (P06 escape hatch).
9. **Rate limiting never touches arithmetic**: `getUsage` reports import/export consumption; `runCalculation` and `createComparison` are unlimited by policy — metering a deterministic computation would ration honesty (the note field says so in-product).
10. **Non-AI is load-bearing**: no operation accepts or returns model output; any future assist-shaped operation (statement OCR, import parsing assist) requires a new contract version, LOOP-4 owner confirmation, and a re-opened 00 exclusions record (12 Q-14) — the declaration is the boundary, not a vow.
11. **Typed pagination on every list**; cursors opaque. Every operation traces to ≥1 flow (03 coverage table — zero orphans, zero phantoms).
