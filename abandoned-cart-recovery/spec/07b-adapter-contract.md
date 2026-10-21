# 07b — Adapter Contract: abandoned-cart-recovery (TypeScript, v1)

SME-G pass · `AbandonedCartAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, Shopper, AbandonedCart, SequenceStep, RecoverySequence, MessageTemplate, RoutingPolicy, QuietHourPolicy, SendRecord, ShopperEvent, SuppressionEntry, DraftVariantSet, RecoveryReport, Job, ExportArtifact, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table — 33 operations, 0 orphans). AI declaration: exactly one conditionally-AI surface — `generateMessageVariants` (+ its draft read/promote pair); every other operation is deterministic rule execution.

```ts
// Single contract surface. Entity types referenced below (AbandonedCart,
// RecoverySequence, SequenceStep, MessageTemplate, SendRecord, ShopperEvent,
// SuppressionEntry, DraftVariantSet, RecoveryReport, ExportArtifact — and
// their fields) are declared canonically in 07a and are part of this contract
// by reference; 07b declares only the operational wrappers (summaries, views,
// jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed cart rows, unknown template variables, activation-gate rules, routing threshold sanity, quiet-window sanity, override-on-suppressed, promotion-without-review, empty send-list export)
 * 'NOT_FOUND'    -> NotFoundError     (stale cart/sequence/template/artifact links, expired artifacts and draft sets, unknown event targets)
 * 'PERMISSION'   -> PermissionError   (capability consent for cart-source/message-channel/generation, viewer-role mutations)
 * 'CONFLICT'     -> ConflictError     (concurrent sequence/template/policy edits, concurrent cart overrides)
 * 'RATE_LIMIT'   -> RateLimitError    (generation runs, export packages)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact download, channel dispatch failures)
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
  role: 'owner' | 'operator' | 'viewer';   // viewer: read + report access, zero mutations (02 Nayla's board seat)
  locale: 'ar' | 'en';                      // chrome direction — bilingual-en default, either direction full citizen
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export type Locale = 'ar' | 'en';
export type ChannelKind = 'email' | 'rich-message' | 'plain-text';

export interface CartRow {                   // queue rows (virtualized above 200 — P19)
  id: string;
  shopperDisplayName: string;                // bidi-isolated at render
  total: number;
  currency: string;
  locale: Locale;
  band: 'low' | 'mid' | 'high';
  state: 'abandoned-pending' | 'in-recovery' | 'recovered' | 'expired' | 'suppressed-at-intake' | 'cancelled';
  priorityScore: number;
  sequenceName?: string;
  nextSendAt?: string;                       // due or rescheduled instant
  nextSendDeferred: boolean;                 // the deferral mark renders on the row (CP-1.4)
  needsDecision: boolean;                    // failed dispatch / override candidate (CP-3)
  lastActivityAt: string;
}

export interface CartView {                  // full cart detail
  cart: AbandonedCart;                       // 07a full shape (items, shopper ref, priority WITH components)
  shopper: {
    displayName: string; jurisdiction: string; timezone: string;
    consentBasis: 'marketing-consent' | 'soft-opt-in' | 'legitimate-interest' | 'unknown';
    suppressed: boolean; suppressionEntryId?: string;
  };
  sends: SendRecord[];                       // the timeline's send nodes
  events: ShopperEvent[];                    // the timeline's event nodes (provenance shown)
}

export interface ImportJobResult {
  imported: number;
  skippedRows: string[];                     // named bad rows — partial policy (async-contract §4)
  parkedPending: number;                     // carts under the abandonment threshold — parked, never dropped
  suppressedAtIntake: number;                // opted-out shoppers' carts — recorded holds
}

export interface SequenceSummary {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'retired';
  stepCount: number;
  version: number;
  hasDraftFork: boolean;                     // edits exist beyond the serving version (activation prompt)
  consentBasis: 'any' | 'consent-only';
  expiryHours: number;
  updatedAt: string;
}

export interface SequenceView extends SequenceSummary {
  steps: SequenceStep[];                     // 07a full shapes (template/policy refs with pinned versions)
  assignedCartCount: number;
  activationBlockers?: string[];             // present when status change to 'active' would fail — named rules
}

export interface TemplateSummary {
  id: string;
  name: string;
  status: 'draft' | 'approved' | 'retired';
  channelKind: ChannelKind;
  origin: 'stock' | 'authored' | 'generated-promoted';
  version: number;
  boundStepCount: number;                    // steps pinning this template (retire gate references it)
  updatedAt: string;
}

export interface PreviewRequest {
  sequenceId: string;
  sequenceVersion?: number;                  // defaults to the version under edit
  sampleCartTotal: number;
  shopperLocale: Locale;
  jurisdiction: string;
  timezone: string;                          // IANA — the clock evaluates HERE
  anchorAt: string;                          // abandonment anchor instant for the simulation
}

export interface PreviewStepTiming {
  stepOrder: number;
  dueAt: string;
  dueLocalTime: string;                      // 'HH:MM' in the given timezone
  deferred: boolean;
  deferInfo?: { deferredUntil: string; localDueTime: string; quietHourRowId: string; reason: string };
  windowLabel: string;                       // 'send window 08:00–21:00 · quiet 21:00–08:00'
}

export interface PreviewResult {
  request: PreviewRequest;
  timings: PreviewStepTiming[];
  computedBy: 'deterministic-scheduler';     // the same pure function the live scheduler runs (07c rule 9)
}

export interface SendRow {                   // send-ledger rows
  id: string;
  cartId: string;
  shopperDisplayName: string;
  jurisdiction: string;
  timezone: string;
  stepOrder: number;
  sequenceName: string;
  channelKind: ChannelKind;
  state: 'scheduled' | 'deferred' | 'dispatched' | 'delivered' | 'clicked' | 'failed' | 'cancelled' | 'skipped-suppressed';
  dueAt: string;
  dueLocalTime: string;
  defer?: { deferredUntil: string; reason: string; quietHourRowId: string; quietHourRowVersion: number };
  error?: AdapterError;
  manualExportMarkedAt?: string;
}

export interface DraftVariantSetView extends DraftVariantSet {   // 07a full shape + envelope
  baseTemplateName: string;
}

export interface SuppressionRow {
  entry: SuppressionEntry;                   // 07a full shape
  shopperDisplayName: string;
  affectedPendingSends: number;              // sends that were cancelled when suppression landed
}

export interface ReportJobResult { artifacts: { artifactId: string; expiresAt: string }[]; }

export interface Job<T> {                    // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'import' | 'generation' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                    // async-contract §5
}

// ---- Contract ----

export interface AbandonedCartAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // cart intake (paste = the LOOP-5 always-available path; capability path consent-gated — 08 N1)
  importCarts(input: {
    source: 'paste' | 'cart-source-capability';
    content?: string;                        // paste payload: one cart per block (shopper, locale, jurisdiction, timezone, lines, total, currency, consent basis, last-activity)
    capabilityRef?: string;                  // cart-source path only; consent enforced server-side
    idempotencyKey: string;                  // async-contract §5
  }): Promise<Result<Job<ImportJobResult>, AdapterError>>;
  listCarts(query: {
    filter?: {
      state?: CartRow['state'][];
      band?: ('low' | 'mid' | 'high')[];
      locale?: Locale[];
      needsDecision?: boolean;
      sequenceId?: string;
      suppressedShopper?: boolean;
    };
    search?: string;                         // normalized bilingual search over shopper + item names (rtl-rules §4)
    sort: 'priority' | 'total' | 'lastActivityAt';
    cursor?: string; limit: number;          // virtualized surface: cursor pages ≤ 100
  }): Promise<Result<Page<CartRow>, AdapterError>>;
  getCart(id: string): Promise<Result<CartView, AdapterError>>;

  // sequence studio
  createSequence(input: {
    name: string;
    consentBasis: 'any' | 'consent-only';
    expiryHours?: number;                    // default 72 (workspace default otherwise)
  }): Promise<Result<SequenceSummary, AdapterError>>;
  listSequences(query: {
    filter?: { status?: SequenceSummary['status'][]; consentBasis?: ('any' | 'consent-only')[] };
    search?: string;
    sort: 'updatedAt' | 'name' | 'assignedCartCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<SequenceSummary>, AdapterError>>;
  getSequence(id: string): Promise<Result<SequenceView, AdapterError>>;
  updateSequence(id: string, patch: {
    name?: string;
    consentBasis?: 'any' | 'consent-only';
    expiryHours?: number;
    steps?: SequenceStep[];                  // full step array replace — reordering is explicit
    baseVersion: number;                     // stale -> CONFLICT with both payloads; editing ACTIVE forks a draft
  }): Promise<Result<SequenceView, AdapterError>>;
  setSequenceStatus(id: string, input: {
    status: 'active' | 'paused' | 'retired';
    confirm?: { remainingSendsCount: number };   // pause/retire of an ACTIVE sequence: UI names the count (P04 level-2)
  }): Promise<Result<SequenceView, AdapterError>>;   // activation runs the gate — VALIDATION names every failed rule

  // templates (bilingual library + the generation dock)
  listTemplates(query: {
    filter?: { status?: TemplateSummary['status'][]; channelKind?: ChannelKind[]; origin?: TemplateSummary['origin'][] };
    search?: string;                         // normalized bilingual search over names + content
    sort: 'updatedAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<TemplateSummary>, AdapterError>>;
  saveTemplate(input: {
    template: Omit<MessageTemplate, 'version' | 'createdAt' | 'updatedAt' | 'approvedAt' | 'approvedByMemberId'> & { id?: string };
    baseVersion?: number;                    // stale -> CONFLICT both kept
  }): Promise<Result<TemplateSummary, AdapterError>>;
  approveTemplate(input: {
    templateId: string;
    baseVersion: number;                     // approval pins the version it approves
  }): Promise<Result<TemplateSummary, AdapterError>>;
  retireTemplate(input: {
    templateId: string;
    confirm: { boundStepCount: number };     // retire gate: bound steps keep their pins; future binds refuse
  }): Promise<Result<TemplateSummary, AdapterError>>;
  generateMessageVariants(input: {
    baseTemplateId: string;
    baseTemplateVersion: number;             // the diff baseline is pinned
    locales: Locale[];                       // 'ar', 'en', or both
    tone: 'plain' | 'warm' | 'urgent';
    variantCount: 1 | 2 | 3;
    idempotencyKey: string;
  }): Promise<Result<Job<{ draftVariantSetId: string }>, AdapterError>>;   // the ONE conditionally-AI operation
  getDraftVariantSet(id: string): Promise<Result<DraftVariantSetView, AdapterError>>;
  promoteDraftVariant(input: {
    draftVariantSetId: string;
    variantIndex: number;
    baseTemplateId: string;
    confirmReviewed: true;                   // literal type: the P15 review-diff gate is structural (07a quarantine)
  }): Promise<Result<TemplateSummary, AdapterError>>;   // lands as a DRAFT template (origin 'generated-promoted') — approval still required

  // routing, incentives, quiet hours (the policy surfaces)
  getRoutingPolicy(): Promise<Result<RoutingPolicy, AdapterError>>;
  updateRoutingPolicy(patch: {
    thresholds?: { lowMax: number; highMin: number };     // sanity: lowMax < highMin -> else VALIDATION
    bandRoutes?: RoutingPolicy['bandRoutes'];
    incentives?: RoutingPolicy['incentives'];
    baseVersion: number;                     // stale -> CONFLICT both kept
  }): Promise<Result<RoutingPolicy, AdapterError>>;
  listQuietHourPolicies(): Promise<Result<QuietHourPolicy, AdapterError>>;   // single workspace policy, rows versioned
  saveQuietHourPolicy(patch: {
    rows?: QuietHourRow[];                   // full row array replace; row edits bump only that row's version
    baseVersion: number;                     // stale -> CONFLICT; deleting a row referenced by a step -> VALIDATION naming sequences
  }): Promise<Result<QuietHourPolicy, AdapterError>>;

  // the clock (preview = pure function; ledger = recorded state)
  previewSchedule(input: PreviewRequest): Promise<Result<PreviewResult, AdapterError>>;
  listSends(query: {
    filter?: {
      state?: SendRow['state'][];
      channelKind?: ChannelKind[];
      cartId?: string;
      sequenceId?: string;
      jurisdiction?: string[];
      deferredOnly?: boolean;
    };
    sort: 'dueAt' | 'updatedAt';
    cursor?: string; limit: number;          // virtualized ledger: cursor pages ≤ 100
  }): Promise<Result<Page<SendRow>, AdapterError>>;

  // queue work (the operator's decisions)
  assignSequence(input: {
    cartId: string;
    sequenceId: string;
    overrideReason: string;                  // required — overrides are ledger entries (CP-3.4)
    reanchorFrom: 'now' | 'original-abandonment';
  }): Promise<Result<CartView, AdapterError>>;
  cancelCartRecovery(input: {
    cartId: string;
    reason: string;                          // required — P04 level-2 names remaining steps in UI, adapter records reason
  }): Promise<Result<CartView, AdapterError>>;
  recordShopperEvent(input: {
    cartId: string;
    kind: 'delivered' | 'clicked' | 'checkout-completed' | 'opt-out';
    eventKey: string;                        // idempotency — same event twice writes once (07a)
    occurredAt: string;                      // manual entry may backdate; rendered honestly as claimed time
    sendId?: string;
    note?: string;
  }): Promise<Result<CartView, AdapterError>>;   // provenance 'manual' — first-class peer of channel events
  addSuppression(input: {
    shopperId: string;
    reason: 'complaint' | 'manual';
    note: string;                            // required — the ledger entry carries the why
  }): Promise<Result<SuppressionRow, AdapterError>>;
  listSuppressions(query: {
    filter?: { reason?: ('opt-out' | 'complaint' | 'manual')[]; restored?: boolean };
    search?: string;
    sort: 'suppressedAt' | 'shopperDisplayName';
    cursor?: string; limit: number;
  }): Promise<Result<Page<SuppressionRow>, AdapterError>>;
  removeSuppression(input: {
    entryId: string;
    restoreNote: string;                     // required — restores are ledger entries (block/restore symmetry)
  }): Promise<Result<SuppressionRow, AdapterError>>;

  // report, export, jobs
  getRecoveryReport(query: { from: string; to: string }): Promise<Result<RecoveryReport, AdapterError>>;
  exportRecoveryPackage(input: {
    formats: ('recovery-report' | 'send-list' | 'sequence-archive')[];
    reportWindow?: { from: string; to: string };         // required for recovery-report / send-list
    sequenceId?: string;                                 // required for sequence-archive
    idempotencyKey: string;
  }): Promise<Result<Job<ReportJobResult>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: ('recovery-report' | 'send-list' | 'sequence-archive')[];
  }, AdapterError>>;
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    generatedVariants: number; generatedVariantsLimit: number;   // P14 — warn at 80%
    exports: number; exportsLimit: number;
    resetAt: string;
  }, AdapterError>>;
}
```

## Rules

1. **Determinism contract**: `previewSchedule`, the scheduler behind `SendRecord` creation, band assignment, priority scoring, and deferral implement exactly the rules specified in 07c — identical inputs (sequence version, policy-row versions, routing version, event history) yield identical outputs. `previewSchedule` is a pure function: it mutates nothing, and its `computedBy: 'deterministic-scheduler'` marker states that the preview and the live scheduler are the same computation.
2. **Version pinning**: `updateSequence` (baseVersion), `updateRoutingPolicy` (baseVersion), `saveQuietHourPolicy` (baseVersion), `saveTemplate` (baseVersion), and `approveTemplate` (baseVersion) → CONFLICT with both payloads in `details` when stale. Editing an ACTIVE sequence forks a draft (the serving version keeps serving); activation promotes the draft. SendRecords pin sequence/template/policy-row versions at creation and are never mutated by later policy edits (07a).
3. **Activation gate**: `setSequenceStatus → 'active'` with any failed rule (empty steps; a step binding a non-approved template; a step naming a missing quiet-hours row; expiry ≤ the last step's due offset; zero steps inside the expiry window) → VALIDATION whose `details` name every failed rule with links. Pause/retire of an active sequence requires `confirm.remainingSendsCount` matching the live count — drift → VALIDATION with the recounted count, never a partial silent apply.
4. **Suppression is absolute**: `assignSequence` on a suppressed shopper → VALIDATION naming the suppression entry; an opt-out event recorded via `recordShopperEvent` cancels every scheduled AND deferred send for that shopper (state `skipped-suppressed`) and writes the suppression entry server-side; `addSuppression` for a shopper with pending sends cancels them the same way. `removeSuppression` requires `restoreNote` and appends a restore entry — suppression history is append-only.
5. **The double generation gate**: `promoteDraftVariant` without `confirmReviewed: true` is unrepresentable at the type level, and the runtime validates the draft set exists and is unexpired (NOT_FOUND otherwise); promotion lands ONLY as a draft template with origin `generated-promoted` — `approveTemplate` is always a second, separate human act. No operation anywhere binds a draft template to a step (VALIDATION naming the draft).
6. **Consent enforcement**: `importCarts` with `source: 'cart-source-capability'` without a granted cart-source consent → PERMISSION naming the capability class (credential-contract §4) — never a vendor; the paste path has no consent requirement, ever (LOOP-5). `generateMessageVariants` without a granted generation capability → PERMISSION, with the template-library fallback stated in the error's next-action copy (11).
7. **Idempotency**: import/generation/export submits carry idempotency keys — a retried submit returns the original Job (async-contract §5). `recordShopperEvent` is idempotent by `eventKey`: the same event twice writes once and returns current state. Progress is determinate in units (carts, variants, formats) — an indeterminate bar claiming percentage is a contract violation (async-contract §3).
8. **Partial policies**: cart imports deliver imported-so-far + named bad rows (`skippedRows`) and park under-threshold carts (`parkedPending` — never dropped); generation retains partial variants marked `partial` with retry-continuation or discard; exports deliver per-format with per-format retry. `exportRecoveryPackage` for a send-list with zero pending shoppers → VALIDATION naming the queue state (never a blank artifact).
9. **Viewer role**: every mutation (import, sequence/template/policy writes, status changes, generation, promotion, override, cancel, events, suppression writes, exports) → PERMISSION naming the seat's capability in capability language; viewer reads (lists, views, report, artifacts) are unrestricted.
10. **Quiet-hours evaluation is recipient-local**: due times are computed in the shopper's timezone (`Shopper.timezone`) against the jurisdiction row matched from `Shopper.jurisdiction`, with the workspace default row as fallback (recorded on the send when it governs). A send whose due time falls in the quiet span is created in state `deferred` with `DeferInfo` carrying the pinned row version and a human-readable reason — deferral never happens silently and never mutates the sequence (07c rule 4).
11. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (33/33).
