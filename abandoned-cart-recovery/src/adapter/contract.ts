// VERBATIM from specs-source/abandoned-cart-recovery/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
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

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type CurrencyCode = string;                                    // declared per workspace (seed: 'SAR')

// ---- Workspace ----
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;                    // chrome direction default — bilingual-en proposal (LOOP-6)
  currencies: CurrencyCode[];               // declared set — intake VALIDATION references it
  abandonmentThresholdMinutes: number;      // default 60 — a cart is abandoned past this idle age absent completion
  valueNormalizer: number;                   // priority-score divisor — default 1000 (07c §D; workspace-settable)
  defaultQuietHourRowId: string;            // fallback row for shoppers outside every jurisdiction row
  createdAt: string;
  updatedAt: string;
}

// ---- Shoppers & consent ----
export type ConsentBasis =
  | 'marketing-consent'                     // shopper opted into marketing explicitly
  | 'soft-opt-in'                           // ePrivacy-style: collected in a sale/quote context, no objection
  | 'legitimate-interest'                   // workspace-recorded posture for the jurisdiction
  | 'unknown';                              // no recorded basis — consent-only sequences skip, reason recorded
export interface Shopper {
  id: string;
  displayName: string;                      // bidi-isolated at render (rtl-rules §2)
  locale: Locale;                           // shopper-facing message language — routes template column
  jurisdiction: string;                     // policy-row key (e.g. 'US-FED', 'US-TX', 'KSA', 'ARE')
  timezone: string;                         // IANA zone — the scheduler evaluates HERE (00)
  consentBasis: ConsentBasis;
  contact: { channelKind: ChannelKind; handle: string }[];  // abstract handles; never rendered with vendor semantics
  firstSeenAt: string;
}

// ---- Carts ----
export interface CartLineItem {
  productId: string;
  nameEn: string;                           // bilingual item names — authored by the source, stored verbatim
  nameAr: string;
  quantity: number;
  unitPrice: number;                        // minor-free decimal in workspace currency; canonical storage
}
export type CartProvenance = 'paste-import' | 'cart-source-capability';
export type CartState =
  | 'abandoned-pending'                     // idle age under threshold — or parked at routing (consent-basis skip against a consent-only sequence, 07c rule 3) — becomes eligible when the threshold lapses or a route admits it
  | 'in-recovery'                           // routed to a sequence; sends exist or are scheduled
  | 'recovered'                             // checkout-completed event landed
  | 'expired'                               // passed sequence expiry without completion
  | 'suppressed-at-intake'                  // shopper suppressed before entry — recorded, never bounced silently
  | 'cancelled';                            // operator cancelled with reason
export interface PriorityComponents {       // the queue-rank math, rendered WITH its math (07c §D)
  value: number;                             // min(total / valueNormalizer, 1) — normalizer 1000 (workspace-settable)
  recency: number;                           // max(0, 1 - hoursSinceAbandonment / 72)
  engagement: number;                        // 0 none · 0.5 delivered · 1 clicked (latest event wins)
}
export interface AbandonedCart {
  id: string;
  workspaceId: string;
  shopperId: string;
  items: CartLineItem[];
  total: number;                             // sum(items) at intake — frozen; later edits re-version the cart
  currency: CurrencyCode;
  locale: Locale;                            // mirrors shopper at intake (frozen copy — the routed column)
  provenance: CartProvenance;
  sourceRef?: string;                        // the source system's own cart id when capability-delivered
  lastActivityAt: string;                    // the abandonment anchor — ISO instant, UTC storage
  abandonedAt?: string;                      // set when threshold lapsed (the sequence anchor)
  state: CartState;
  stateReason?: string;                      // expiry/suppression/cancel reasons — always recorded on terminal states
  assignment?: SequenceAssignment;
  priority: { score: number; components: PriorityComponents };
  events: ShopperEvent[];                    // appended, never rewritten
  version: number;                           // item/total edits re-version; state reads derive
  createdAt: string;
  updatedAt: string;
}

// ---- Sequences ----
export type SequenceStatus = 'draft' | 'active' | 'paused' | 'retired';
export interface SequenceStep {
  id: string;
  order: number;                             // 1-based — ladder position
  delayMinutes: number;                      // CUMULATIVE offset from the cart's anchor event — step 1 anchors abandonment itself (the category's 1h/24h/72h ladder is offsets from abandonment, 01 q7; the activation gate checks each delayMinutes ≤ expiryHours×60, 07c rule 5)
  channelKind: ChannelKind;
  templateId: string;
  templateVersion: number;                   // pinned at step save — later template edits never mutate bound steps
  incentiveRef?: string;                     // routing-policy incentive id — evaluated at send time, versioned
}
// NOTE: steps deliberately carry NO quiet-hours field of their own — quiet-hours
// evaluation ALWAYS resolves the recipient's jurisdiction row (Shopper.jurisdiction
// → QuietHourRow), with the workspace default row as fallback (07c rule 4). A
// step-level window override would let a merchant contract around the recipient's
// jurisdiction — a compliance hazard this contract refuses by construction.
export interface RecoverySequence {
  id: string;
  workspaceId: string;
  name: string;
  status: SequenceStatus;
  consentBasis: 'any' | 'consent-only';      // 'consent-only' skips shoppers with basis 'unknown', reason recorded
  expiryHours: number;                       // default 72 — the recovery-window convention (01)
  steps: SequenceStep[];
  version: number;                           // active sequences serve their pinned version; edits fork a draft
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
}
export interface SequenceAssignment {
  sequenceId: string;
  sequenceVersion: number;                   // pinned — sends carry this version (audit honesty)
  assignedAt: string;
  assignedBy: 'routing' | 'operator-override';
  overrideReason?: string;                   // required when assignedBy = 'operator-override'
}

// ---- Templates (bilingual by construction) ----
export type TemplateStatus = 'draft' | 'approved' | 'retired';
export interface TemplateLocaleContent {
  subject: string;                           // ≤ 60 chars (budget meter — 06)
  body: string;                              // ≤ 900 chars; variables in double braces
}
export interface MessageTemplate {
  id: string;
  workspaceId: string;
  name: string;
  status: TemplateStatus;
  content: { en: TemplateLocaleContent; ar: TemplateLocaleContent };  // P23 two columns, both first-class
  channelKind: ChannelKind;                  // the column shape the channel kind accepts
  origin: 'stock' | 'authored' | 'generated-promoted';                 // provenance is permanent, never scrubbed
  variables: string[];                       // declared set — save-time VALIDATION source
  version: number;                           // revisions fork versions; bound steps pin theirs
  approvedAt?: string;
  approvedByMemberId?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Routing & incentives (value bands) ----
export type ValueBand = 'low' | 'mid' | 'high';
export type IncentiveKind = 'none' | 'free-shipping' | 'percent' | 'fixed';
export interface IncentivePolicy {
  id: string;
  kind: IncentiveKind;
  percent?: number;                          // 0 < percent ≤ 100 when kind = 'percent'
  amount?: number;                           // when kind = 'fixed'
  codeRef?: string;                          // the merchant's own code string — NEVER generated/verified here (LOOP-10)
  note?: string;                             // the margin owner's recorded rationale
}
export interface RoutingPolicy {
  id: string;
  workspaceId: string;
  thresholds: { lowMax: number; highMin: number };   // low < total ≤ lowMax; highMin < total ≤ high (sanity: lowMax < highMin)
  bandRoutes: Record<ValueBand, { sequenceId: string; incentiveId?: string }>;
  incentives: Record<string, IncentivePolicy>;
  version: number;
  updatedAt: string;
}

// ---- Quiet-hours policies ----
export type PolicySourceLabel =
  | { kind: 'statutory-anchor'; citation: string }   // e.g. '47 CFR 64.1200(c)(1)' — retrieved anchor, cited
  | { kind: 'workspace-policy'; note: string };      // e.g. 'no retrieved statutory hour rule for KSA' — honest label
export interface QuietHourRow {
  id: string;
  jurisdiction: string;                      // policy key matched against shopper.jurisdiction
  windowStart: string;                       // 'HH:MM' local, 24h — sendable window [start, end)
  windowEnd: string;                         // start > end models a midnight-crossing window (07c rule 4)
  source: PolicySourceLabel;                 // the honesty field — rendered on every row and every deferral
  version: number;
}
export interface QuietHourPolicy {
  id: string;
  workspaceId: string;
  rows: QuietHourRow[];
  version: number;
  updatedAt: string;
}

// ---- Sends (the scheduler's ledger) ----
export type SendState =
  | 'scheduled'                              // due time computed, inside window, awaiting dispatch
  | 'deferred'                               // due time fell in quiet span — rescheduled to window opening
  | 'dispatched'                             // handed to the abstract channel (or marked for manual export)
  | 'delivered'                              // delivered event recorded
  | 'clicked'                                // click event recorded
  | 'failed'                                 // channel/network failure — typed error attached
  | 'cancelled'                              // recovery cancelled / sequence paused-retired before dispatch
  | 'skipped-suppressed';                    // opt-out or suppression landed before dispatch — the compliance stop
export interface DeferInfo {
  dueAt: string;                             // original due instant (shopper-local time derivable)
  deferredUntil: string;                     // window opening instant
  localDueTime: string;                      // 'HH:MM' in shopper timezone — the human-readable trigger
  quietHourRowId: string;
  quietHourRowVersion: number;               // pinned — the row that deferred THIS send, immutably
  reason: string;                            // rendered verbatim in the ledger (11 copy shape)
}
export interface SendRecord {
  id: string;
  cartId: string;
  workspaceId: string;
  sequenceId: string;
  sequenceVersion: number;                   // pinned assignment version
  stepId: string;
  stepOrder: number;
  channelKind: ChannelKind;
  templateId: string;
  templateVersion: number;                   // pinned at send creation — never mutates after
  state: SendState;
  dueAt: string;                             // scheduler-computed due instant (UTC storage)
  defer?: DeferInfo;                         // present iff state was ever deferred (kept after dispatch — history)
  dispatchedAt?: string;
  deliveredAt?: string;
  clickedAt?: string;
  error?: { code: string; message: string; correlationId: string };  // 7-class taxonomy (07b)
  manualExportMarkedAt?: string;             // send-list export stamped the send for manual dispatch
  createdAt: string;
  updatedAt: string;
}

// ---- Shopper events (the return path) ----
export type EventKind = 'delivered' | 'clicked' | 'checkout-completed' | 'opt-out';
export type EventProvenance = 'channel' | 'manual';   // manual entry is first-class (LOOP-5)
export interface ShopperEvent {
  id: string;
  cartId: string;
  workspaceId: string;
  shopperId: string;
  kind: EventKind;
  provenance: EventProvenance;
  sendId?: string;                           // events bind to their send when one exists
  eventKey: string;                          // idempotency key — same event twice writes once
  occurredAt: string;                        // claimed occurrence time (manual entry may backdate, honestly rendered)
  recordedAt: string;
  recordedByMemberId?: string;               // present when provenance = 'manual'
  payload?: Record<string, string>;          // channel-kind-specific return data, opaque here
}

// ---- Suppression ----
export interface SuppressionEntry {
  id: string;
  workspaceId: string;
  shopperId: string;
  reason: 'opt-out' | 'complaint' | 'manual';
  note?: string;                             // required for 'manual' and restores, per block/restore symmetry
  sourceEventId?: string;                    // the opt-out event that triggered it, when event-driven
  suppressedAt: string;
  suppressedByMemberId?: string;
  restoredAt?: string;                       // present iff restored — restores are ledger entries too
  restoreNote?: string;                      // required on restore
}

// ---- Generation (the single conditionally-AI surface) ----
export interface GeneratedVariant {
  locale: Locale;
  subject: string;
  body: string;
}
export interface DraftVariantSet {
  id: string;
  workspaceId: string;
  baseTemplateId: string;
  baseTemplateVersion: number;               // the diff baseline
  tone: 'plain' | 'warm' | 'urgent';
  variants: GeneratedVariant[];
  provenance: 'generated';                   // permanent badge — never ambiguous with library templates
  partial?: boolean;                         // stream failure mid-way keeps partial drafts, marked (P13)
  createdAt: string;
  expiresAt: string;                         // drafts expire — unlike approved templates
}

// ---- Report (derived, never authoritative) ----
export interface StepFunnelRow {
  stepOrder: number;
  scheduled: number;
  dispatched: number;
  delivered: number;
  clicked: number;
  recoveredAfter: number;                    // carts whose completion followed this step
}
export interface RecoveryReport {
  workspaceId: string;
  generatedAt: string;
  window: { from: string; to: string };
  carts: { abandonedPending: number; inRecovery: number; recovered: number; expired: number; suppressedAtIntake: number; cancelled: number };
  recoveredRevenue: Record<CurrencyCode, number>;          // sums recovered cart totals — reconciles to carts
  recoveryRate: { recovered: number; enteredRecovery: number };  // denominator STATED, not implied (01 definitional noise)
  funnel: StepFunnelRow[];
  deferrals: { total: number; byJurisdiction: { jurisdiction: string; count: number }[]; topReasons: string[] };
  suppressions: number;
  perSequence: { sequenceId: string; sequenceVersion: number; carts: number; recovered: number; recoveredRevenue: number }[];
}

// ---- Async jobs, exports, activity ----
export type JobKind = 'import' | 'generation' | 'export';
export type ExportFormat = 'recovery-report' | 'send-list' | 'sequence-archive';
export interface ExportArtifact {
  id: string;
  workspaceId: string;
  formats: ExportFormat[];                  // per-format retry on partial failure (async-contract §4)
  reportWindow?: { from: string; to: string };              // recovery-report + send-list provenance stamp
  expiresAt: string;                        // declared retention at creation (7 days, renewable by regeneration)
  regenerable: boolean;                     // deterministic from state — always true in v1
}
export interface ActivityEntry {            // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'workspace-viewed' | 'carts-imported'
    | 'sequence-created' | 'sequence-updated' | 'sequence-activated' | 'sequence-paused' | 'sequence-retired'
    | 'template-saved' | 'template-approved' | 'template-retired'
    | 'generation-run' | 'draft-promoted'
    | 'routing-updated' | 'quiet-hour-policy-updated'
    | 'sequence-overridden' | 'recovery-cancelled'
    | 'shopper-suppressed' | 'suppression-restored'
    | 'event-recorded' | 'export-run';
  targetRef: string;
  detail?: string;                          // override reasons, suppression notes, policy diffs — provenance audit
  at: string;
}

