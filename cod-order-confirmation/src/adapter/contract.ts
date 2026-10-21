// VERBATIM from specs-source/cod-order-confirmation/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// ===== Foundation (shared contract shapes) =====
// Error taxonomy — the portfolio-standard 7 classes:
//   ValidationError | NotFoundError | PermissionError | ConflictError
//   | RateLimitError | NetworkError | UnknownError
// mapped onto the 7-token ErrorCode union below. Every failure in this
// product resolves to exactly one of these classes (03 failure-mode table).
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;                       // developer-facing; user copy comes from the 11 matrix
  correlationId: string;                 // surfaces in UnknownError user copy (copy-voice §1.4)
  retryable: boolean;
  details?: Record<string, string[]>;    // field/row/rule → issues (ValidationError names the failed rule)
}

// Auth-agnostic session: implementations resolve identity however their
// environment dictates (phone-pin for agents, enterprise SSO — 08 N7).
// The UI never sees a provider.
export interface Session {
  userId: string;
  workspaceId: string;
  role: 'agent' | 'manager' | 'dispatch';
  locale: 'ar' | 'en';
  siteIds: string[];                     // agent scope for multi-site workspaces
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

export interface CursorQuery<F, S> {
  filter?: F;
  sort: S;
  sortDir: 'asc' | 'desc';
  search?: string;   // Arabic-normalized server-side (rtl-rules §4: alef/taa-marbuta/yaa variants, tashkeel stripped)
  cursor?: string;
  limit: number;     // ≤ 50 (10 data-path rule)
}

// ===== Domain types (mirror 07a; entity contracts live there) =====
export type Role = 'agent' | 'manager' | 'dispatch';
export type AttemptKind = 'message' | 'sms' | 'voice' | 'agent-call';
export type BuyerResponseType = 'confirm' | 'cancel' | 'reschedule-request' | 'wrong-number';
export type OrderStatus = 'received' | 'triaged' | 'ladder-running' | 'awaiting-agreement' | 'confirmed'
  | 'held-review' | 'auto-cancelled' | 'buyer-cancelled' | 'merchant-cancelled'
  | 'cancelled-upstream' | 'manifested' | 'out-for-delivery' | 'delivered' | 'refused' | 'returned';
export type RiskBand = 'low' | 'medium' | 'high';

export interface UserSummary {
  id: string; displayName: string; role: Role; siteIds: string[];
  locale: 'ar' | 'en'; status: 'active' | 'suspended'; joinedAt: string;
}

export interface BuyerSummary {
  id: string; phone: string; displayName: string | null;
  locale: 'ar' | 'en'; status: 'active' | 'blocked'; blocklistReason: string | null;
  history: { windowDays: number; completed: number; refused: number; unreachable: number; cancelled: number };
  firstOrderAt: string | null; totalOrders: number;
}

export interface BuyerFilter {
  status?: BuyerSummary['status'][]; siteId?: string;
  historyRatioBelow?: number;        // e.g., 0.5 surfaces the risky book (Salem's review)
  phonePrefix?: string;
}
export type BuyerSort = 'displayName' | 'totalOrders' | 'historyRatio';

export interface CodOrderSummary {
  id: string; orderRef: string; buyerId: string; buyerDisplayName: string | null;
  buyerPhone: string; siteId: string; zoneCode: string | null; district: string | null;
  city: string; valueAmount: number; currency: string; language: 'ar' | 'en';
  status: OrderStatus; holdReason: { kind: string; detail: string } | null;
  riskBand: RiskBand | null;            // null only pre-triage; never rendered unscored
  riskTotal: number | null;
  ladderState: { activeKind: AttemptKind | null; attemptCount: number;
                 nextAttemptAt: string | null; expiresAt: string | null } | null;
  agreement: { windowId: string; date: string; startsAt: string; endsAt: string;
               labelAr: string; labelEn: string } | null;   // null = agreement owed (CP-3.7 flag lives here)
  manifestId: string | null;
  agingMinutes: number;
  createdAt: string;
}

export interface CodOrderFilter {
  status?: OrderStatus[]; siteId?: string; zoneCode?: string;
  riskBand?: RiskBand[]; agreementState?: 'stamped' | 'owed' | 'none';
  holdKind?: string[]; manifestId?: string | null;   // null filters the unmanifested book
  routeDate?: string;                  // manifest draft view grouping
  agingMinutesOver?: number;
}
export type CodOrderSort = 'nextAttemptAt' | 'riskTotal' | 'valueAmount' | 'agingMinutes' | 'createdAt';

export interface LadderPolicyDTO {
  version: number; siteId: string | null;
  attemptSequence: AttemptKind[];
  cooldownHours: Record<AttemptKind, number>;
  quietHours: { startLocal: string; endLocal: string; enabled: boolean };
  ladderExpiryHours: number; autoCancelOnExhaustion: boolean;
  autoStart: 'all' | 'below-high-risk' | 'none';
  minimumLeadHours: number; windowHorizonDays: number;
  publishedAt: string; publishedByUserId: string;
  // read-only preview the engine computes for the editor (CP-6.2):
  nextEligibleSendCalendar: { from: string; to: string; eligible: { at: string }[] } | null;
}

export interface AttemptSummary {
  id: string; orderId: string; kind: AttemptKind; sequence: number;
  state: 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'responded' | 'failed' | 'skipped' | 'cancelled';
  scheduledFor: string; sentAt: string | null; stateDetail: string | null;
  templateId: string | null; loggedByUserId: string | null;
  responseSummaries: { id: string; type: BuyerResponseType; rawText: string | null;
                       capturedVia: string; capturedAt: string }[];
}

export interface DeliveryWindowDTO {
  id: string; siteId: string; zoneCode: string; date: string;
  startsAt: string; endsAt: string; dayPart: 'morning' | 'afternoon' | 'evening' | 'night';
  capacity: number; committed: number; labelAr: string; labelEn: string;
}

export interface EligibleWindow extends DeliveryWindowDTO {
  remaining: number;          // capacity − committed (never < 0)
  eligibleForLeadTime: boolean;   // false → shown-but-gated in the sheet (visible, never hidden)
}

export interface RiskComponentDTO {
  kind: 'buyer-history' | 'value-band' | 'confirmation-latency' | 'channel-engagement'
      | 'address-quality' | 'buyer-tenure';
  rawValue: number; normalized: number; weight: number; points: number;
  explanationAr: string; explanationEn: string;
}

export interface RiskScoreDTO {
  id: string; orderId: string; totalPoints: number; band: RiskBand;
  components: RiskComponentDTO[];
  engine: 'rule-scorecard' | 'model-assisted';   // provenance displayed in UI (contract rule 4)
  policyVersion: number; computedAt: string; computedByUserId: string | null;
}

export interface RiskPolicyDTO {
  version: number;
  weights: Record<'buyer-history' | 'value-band' | 'confirmation-latency' | 'channel-engagement'
                  | 'address-quality' | 'buyer-tenure', number>;   // sums to 1
  valueCap: number;
  bandThresholds: { lowMin: number; highMax: number };
  holdRules: { overCapToHold: boolean; highBandOverHalfCapToHold: boolean };
  historyWindowDays: number; newBuyerNeutralScore: number;
  publishedAt: string; publishedByUserId: string;
}

export interface RiskSimulationDTO {
  currentPolicy: RiskPolicyDTO; proposedPolicy: RiskPolicyDTO;
  ordersEvaluated: number;
  bandRollup: { band: RiskBand; currentCount: number; proposedCount: number }[];
  biggestMovers: { orderId: string; orderRef: string; currentTotal: number; proposedTotal: number;
                   currentBand: RiskBand; proposedBand: RiskBand }[];   // top 5 by |delta|
}

export interface MessageTemplateDTO {
  id: string; slot: AttemptKind | 'final-notice' | 'cancel-ack' | 'window-quick-replies';
  bodyAr: string; bodyEn: string;
  quickReplyWindowOptions: boolean; keypadMenuWindowOptions: boolean;
  version: number; updatedAt: string; updatedByUserId: string;
}

export interface MessagePreview {
  templateId: string; orderId: string;
  buyerLocale: 'ar' | 'en';               // the BUYER's locale, not the console's (05 direction model)
  composedBody: string;                   // parameters filled; bidi-isolated interpolation points
  quickReplies: { id: string; label: string; windowId: string | null }[];  // as the buyer sees them
  keypadMenu: string | null;              // numbered window menu for voice rungs
}

export interface ManifestSummary {
  id: string; siteId: string; routeDate: string;
  status: 'draft' | 'sealed' | 'exported';
  rollup: { count: number; totalValue: number;
            windows: { windowId: string; labelAr: string; labelEn: string; count: number }[];
            bands: { low: number; medium: number; high: number }; agreementOwed: number };
  sealedAt: string | null; sealedByUserId: string | null;
  exportedAt: string | null; artifactId: string | null;
  nextManifestPath: { routeDate: string } | null;   // the late-order answer (CP-5.4)
}

export interface NotificationEventDTO {
  id: string; userId: string;
  kind: 'agreement-stamped' | 'hold-awaiting-decision' | 'ladder-transition'
      | 'auto-cancelled' | 'capacity-warning' | 'policy-published' | 'outcome-recorded';
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // P21 ladder
  payload: Record<string, string>; createdAt: string; seenAt: string | null;
}

export interface ActivityEntryDTO {
  id: string; actorUserId: string | null; action: string; targetId: string;
  detail: Record<string, string>; at: string;
}

export interface JobDTO<T = unknown> {
  id: string; kind: 'order-import' | 'manifest-export' | 'ledger-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T; result?: T;
  error?: { code: ErrorCode; message: string; correlationId: string };
}

// Live order events (subscribeOrderEvents payload)
export type OrderEvent =
  | { type: 'order.imported'; orderId: string; orderRef: string }
  | { type: 'order.triaged'; orderId: string; band: RiskBand; total: number }
  | { type: 'order.held'; orderId: string; holdKind: string }
  | { type: 'ladder.started'; orderId: string; expiresAt: string }
  | { type: 'attempt.state'; orderId: string; attemptId: string; kind: AttemptKind; state: string }
  | { type: 'attempt.scheduled'; orderId: string; attemptId: string; scheduledFor: string }
  | { type: 'response.captured'; orderId: string; responseId: string; responseType: BuyerResponseType }
  | { type: 'agreement.stamped'; orderId: string; windowId: string; remaining: number }
  | { type: 'order.resolved'; orderId: string; status: OrderStatus; reason: string }
  | { type: 'window.capacity'; windowId: string; remaining: number }
  | { type: 'manifest.sealed'; manifestId: string; count: number }
  | { type: 'outcome.recorded'; orderId: string; outcome: string };
export type OrderEventSink = (event: OrderEvent) => void;

// ===== The Adapter (v1) =====
export interface CodOrderConfirmationAdapterV1 {
  // Session & identity
  getSession(): Promise<Result<Session, AdapterError>>;

  // Orders (abstract source — paste is the LOOP-5 primary path; a bound order
  // channel is 08 N1, a binding-time upgrade, never a UI assumption)
  listCodOrders(query: CursorQuery<CodOrderFilter, CodOrderSort>): Promise<Result<Page<CodOrderSummary>, AdapterError>>;
  getCodOrder(id: string): Promise<Result<CodOrderSummary & { attempts: AttemptSummary[]; responses: { id: string; type: BuyerResponseType; rawText: string | null; capturedVia: string; capturedAt: string; capturedByUserId: string | null }[]; risk: RiskScoreDTO | null }, AdapterError>>;
  importOrders(input: { format: 'csv' | 'tsv'; content: string; defaultSiteId: string; idempotencyKey: string }): Promise<Result<JobDTO<{ imported: number; awaitingRows: number; failedRows: { row: number; issue: string }[] }>, AdapterError>>;
  setOrderHold(input: { orderId: string; held: boolean; reason: string; idempotencyKey: string }): Promise<Result<CodOrderSummary, AdapterError>>;   // releasing a hold may auto-start the ladder per policy
  cancelCodOrder(input: { orderId: string; reason: 'merchant-decision' | 'stock-out' | 'duplicate' | 'other'; note?: string; idempotencyKey: string }): Promise<Result<CodOrderSummary, AdapterError>>;
  startLadder(input: { orderId: string; idempotencyKey: string }): Promise<Result<{ orderId: string; ladderExpiresAt: string; firstAttemptScheduledFor: string }, AdapterError>>;

  // Ladder engine
  getLadderPolicy(siteId?: string): Promise<Result<LadderPolicyDTO, AdapterError>>;
  updateLadderPolicy(input: Omit<LadderPolicyDTO, 'version' | 'publishedAt' | 'publishedByUserId' | 'nextEligibleSendCalendar'> & { idempotencyKey: string }): Promise<Result<LadderPolicyDTO, AdapterError>>;
  rescheduleAttempt(input: { orderId: string; attemptId: string; toAbsolute?: string; deltaMinutes?: number; reason?: string }): Promise<Result<AttemptSummary, AdapterError>>;   // defer OR advance; engine validates quiet hours + expiry (contract rule 7)
  logManualContact(input: { orderId: string; kind: 'call' | 'note'; outcome: 'confirmed-with-window' | 'confirmed-no-window' | 'cancelled' | 'reschedule-request' | 'unreachable' | 'wrong-number'; note?: string; idempotencyKey: string }): Promise<Result<{ orderId: string; attemptId: string; orderStatus: OrderStatus }, AdapterError>>;
  recordBuyerResponse(input: { orderId: string; type: BuyerResponseType; windowId?: string; rawText?: string; capturedVia: 'agent-capture' | 'manual-call'; attemptId?: string; idempotencyKey: string }): Promise<Result<{ orderId: string; responseId: string; agreementId: string | null; orderStatus: OrderStatus }, AdapterError>>;

  // Delivery windows (one catalog, three rungs — CP-3.3)
  listDeliveryWindows(query: CursorQuery<{ siteId?: string; zoneCode?: string; date?: string; dateFrom?: string; dateTo?: string }, 'date'>): Promise<Result<Page<DeliveryWindowDTO>, AdapterError>>;
  upsertDeliveryWindow(input: Omit<DeliveryWindowDTO, 'committed'> & { idempotencyKey: string }): Promise<Result<DeliveryWindowDTO, AdapterError>>;
  proposeWindowsForOrder(orderId: string): Promise<Result<EligibleWindow[], AdapterError>>;   // zone-matched, capacity>0, lead-time & horizon aware; bounded ≤ 24

  // Risk (deterministic floor + declared optional enrichment — contract rule 4)
  computeRiskScore(input: { orderId: string; note?: string }): Promise<Result<RiskScoreDTO, AdapterError>>;   // appends immutable row; UI-visible recompute names the actor
  getRiskPolicy(): Promise<Result<RiskPolicyDTO, AdapterError>>;
  updateRiskPolicy(input: RiskPolicyDTO & { simulationConfirmed: boolean; idempotencyKey: string }): Promise<Result<RiskPolicyDTO, AdapterError>>;   // simulationConfirmed false → VALIDATION (contract rule 3)
  simulateRiskPolicy(input: { proposed: RiskPolicyDTO }): Promise<Result<RiskSimulationDTO, AdapterError>>;

  // Buyers
  listBuyers(query: CursorQuery<BuyerFilter, BuyerSort>): Promise<Result<Page<BuyerSummary>, AdapterError>>;
  getBuyer(id: string): Promise<Result<BuyerSummary & { orders: { orderId: string; orderRef: string; status: OrderStatus; outcome: string | null; createdAt: string }[] }, AdapterError>>;
  setBuyerStatus(input: { buyerId: string; status: 'active' | 'blocked'; reason: string; idempotencyKey: string }): Promise<Result<BuyerSummary, AdapterError>>;   // manager+ (PERMISSION class); reason REQUIRED on block

  // Templates (bilingual, versioned — human-authored only)
  listMessageTemplates(query: CursorQuery<{ slot?: string[] }, 'slot'>): Promise<Result<Page<MessageTemplateDTO>, AdapterError>>;
  upsertMessageTemplate(input: Omit<MessageTemplateDTO, 'version' | 'updatedAt' | 'updatedByUserId'> & { idempotencyKey: string }): Promise<Result<MessageTemplateDTO, AdapterError>>;
  previewMessage(input: { templateId: string; orderId: string }): Promise<Result<MessagePreview, AdapterError>>;

  // Manifests
  listHandoffManifests(query: CursorQuery<{ siteId?: string; status?: ('draft' | 'sealed' | 'exported')[]; routeDate?: string }, 'routeDate'>): Promise<Result<Page<ManifestSummary>, AdapterError>>;
  createHandoffManifest(input: { siteId: string; routeDate: string; orderIds?: string[]; byFilter?: CodOrderFilter; idempotencyKey: string }): Promise<Result<ManifestSummary, AdapterError>>;   // engine admits confirmed orders only; exclusions named in details (contract rule 8)
  sealHandoffManifest(input: { manifestId: string; confirmedCount: number; idempotencyKey: string }): Promise<Result<ManifestSummary, AdapterError>>;   // confirmedCount mismatch → CONFLICT (the review gate is contractual)
  exportManifest(input: { manifestId: string; idempotencyKey: string }): Promise<Result<JobDTO<{ artifactId: string; expiresAt: string; orderCount: number }>, AdapterError>>;

  // Ambient
  listActivity(query: CursorQuery<{ actorUserId?: string | null; action?: string[]; targetId?: string; since?: string; until?: string }, 'at'>): Promise<Result<Page<ActivityEntryDTO>, AdapterError>>;
  exportConfirmationLedger(input: { from: string; to: string; orderId?: string; idempotencyKey: string }): Promise<Result<JobDTO<{ artifactId: string; expiresAt: string; entries: number }>, AdapterError>>;
  listNotifications(query: CursorQuery<{ unseenOnly?: boolean; kind?: NotificationEventDTO['kind'][] }, 'createdAt'>): Promise<Result<Page<NotificationEventDTO>, AdapterError>>;
  markNotificationsSeen(input: { ids: string[]; allSeen?: boolean }): Promise<Result<{ marked: number }, AdapterError>>;
  subscribeOrderEvents(sink: OrderEventSink): Promise<() => void>;          // returns unsubscribe

  // Jobs (async-contract §2; imports + both export classes)
  getJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;
  retryJob(id: string): Promise<Result<JobDTO<unknown>, AdapterError>>;     // failed-rows/items only (async-contract §4)
  cancelJob(id: string): Promise<Result<{ cancelled: true }, AdapterError>>;

  // People (manager+ surface)
  listUsers(query: CursorQuery<{ role?: Role[]; status?: ('active' | 'suspended')[] }, 'displayName'>): Promise<Result<Page<UserSummary>, AdapterError>>;
  inviteUser(input: { displayName: string; role: Role; siteIds: string[]; locale: 'ar' | 'en' }): Promise<Result<UserSummary, AdapterError>>;
  updateUser(input: { userId: string; role?: Role; siteIds?: string[]; locale?: 'ar' | 'en'; status?: 'active' | 'suspended' }): Promise<Result<UserSummary, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export interface User {
  id: string;
  workspaceId: string;
  displayName: string;            // bidi-isolated on render (rtl-rules §2)
  role: Role;                     // structural roles only (02 Salem: no per-user ACL at v1)
  siteIds: string[];              // scope for agents (multi-site policy, 07a LadderPolicy.siteScoped)
  locale: Locale;                 // console locale — independent of buyer template locales
  status: 'active' | 'suspended';
  joinedAt: string;
}

// ===== Buyers (the phone-book the scorecard learns from) =====
export interface Buyer {
  id: string;
  workspaceId: string;
  phone: string;                  // E.164 canonical; the buyer's identity key
  displayName: string | null;     // may be null — phone-only buyers are normal
  locale: Locale;                 // template locale for THIS buyer (independent of console locale)
  status: 'active' | 'blocked';
  blocklistReason: string | null; // REQUIRED when blocked (manager decision record)
  history: BuyerHistory;          // trailing-window outcomes (scorecard input)
  firstOrderAt: string | null;
  totalOrders: number;
}
export interface BuyerHistory {
  windowDays: number;             // trailing window (RiskPolicy.historyWindowDays, default 180)
  completed: number;              // delivered + cash collected
  refused: number;                // refused at door / RTO
  unreachable: number;            // ladder exhausted without response
  cancelled: number;              // buyer-cancelled before dispatch
  // derived elsewhere: completionRatio = completed / max(1, completed + refused + unreachable)
}

// ===== Orders =====
export type OrderSource = 'paste-import' | 'order-channel';   // abstract source (08 N1) or manual paste
export interface CodOrder {
  id: string;
  workspaceId: string;
  orderRef: string;               // the merchant's own reference; bidi-isolated Latin token
  buyerId: string;
  buyerPhoneAtOrder: string;      // snapshot — phone changes never rewrite history
  siteId: string;
  zoneCode: string | null;        // delivery zone (window-catalog match key; null = unmatched)
  district: string | null;
  city: string;
  valueAmount: number;            // workspace currency, canonical minor units
  currency: string;               // e.g. 'SAR' — display formatting only (no FX, no payment)
  itemsNote: string | null;       // bounded plain-text summary from the source
  language: Locale;               // buyer language for THIS order's templates
  source: OrderSource;
  sourceImportedAt: string | null;
  importedByUserId: string;
  createdAt: string;
  riskScoreId: string | null;     // latest computed score (immutable rows; recompute appends)
  ladderId: string | null;        // active ladder instance
  agreementId: string | null;     // WindowAgreement when confirmed-with-window
  manifestId: string | null;      // set at manifest inclusion (sealed batch)
  status: 'received' | 'triaged' | 'ladder-running' | 'awaiting-agreement' | 'confirmed'
        | 'held-review' | 'auto-cancelled' | 'buyer-cancelled' | 'merchant-cancelled'
        | 'cancelled-upstream' | 'manifested' | 'out-for-delivery' | 'delivered'
        | 'refused' | 'returned';
  holdReason: { kind: 'value-cap' | 'high-risk-band' | 'blocked-buyer' | 'manual';
                detail: string } | null;
  outcome: 'delivered' | 'refused' | 'returned' | 'lost' | null;  // post-handoff event record (LOOP-10: recorded, not worked)
  outcomeAt: string | null;
}

// ===== The confirmation ladder =====
export interface LadderPolicy {
  version: number;
  siteId: string | null;                 // null = workspace default; site overrides (02 Salem)
  attemptSequence: AttemptKind[];        // ordered; seeded [message, sms, voice, agent-call]
  cooldownHours: Record<AttemptKind, number>;   // wait AFTER that kind before the next (seeded: message 4, sms 16, voice 8, agent-call 0)
  quietHours: { startLocal: string; endLocal: string; enabled: boolean };  // '21:00'–'08:00' buyer-local, seeded
  ladderExpiryHours: number;             // from ladder start; seeded 48
  autoCancelOnExhaustion: boolean;       // seeded true
  autoStart: 'all' | 'below-high-risk' | 'none';   // seeded 'below-high-risk'
  minimumLeadHours: number;              // window start ≥ now + lead; seeded 6
  windowHorizonDays: number;             // propose windows within; seeded 7
  publishedAt: string;
  publishedByUserId: string;
}
export interface ConfirmationLadder {
  id: string;
  orderId: string;
  policyVersion: number;          // the ladder policy in force at start
  startedAt: string;
  startedBy: 'engine-auto' | 'user';
  expiresAt: string;              // startedAt + ladderExpiryHours (quiet-hour shifts applied)
  state: 'running' | 'completed' | 'expired' | 'halted';
  attemptIds: string[];           // ordered rung instances
}
export interface ConfirmationAttempt {
  id: string;
  ladderId: string;
  orderId: string;
  kind: AttemptKind;
  sequence: number;               // 1-based rung position
  state: 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'responded'
       | 'failed' | 'skipped' | 'cancelled';
  scheduledFor: string;           // engine-computed send time (quiet-hour aware)
  sentAt: string | null;
  stateDetail: string | null;     // channel failure class etc., verbatim-safe
  templateId: string | null;      // the template composed for this attempt
  responseIds: string[];          // responses captured against this attempt
  loggedByUserId: string | null;  // for agent-call rungs
}

// ===== Buyer responses & the agreement =====
export interface BuyerResponse {
  id: string;
  orderId: string;
  attemptId: string | null;       // null when captured free-standing (agent-initiated)
  type: BuyerResponseType;
  capturedVia: 'channel-event' | 'agent-capture' | 'manual-call';
  rawText: string | null;         // the buyer's reply verbatim, bidi-isolated (≤280 chars)
  windowId: string | null;        // set when confirm carries a window choice
  capturedByUserId: string | null;
  capturedAt: string;
}
export interface DeliveryWindow {
  id: string;
  workspaceId: string;
  siteId: string;
  zoneCode: string;
  date: string;                   // ISO date (Gregorian canonical; Hijri display per P24)
  startsAt: string;               // local time 'HH:mm'
  endsAt: string;
  dayPart: 'morning' | 'afternoon' | 'evening' | 'night';
  capacity: number;               // total slots
  committed: number;              // agreements count (denormalized, event-consistent)
  labelAr: string;                // 'صباحاً' / 'بعد الظهر' / 'مساءً' / 'ليلاً' + time range
  labelEn: string;
}
export interface WindowAgreement {
  id: string;
  orderId: string;
  windowId: string;
  responseId: string;             // the response that produced it — evidence chain
  attemptId: string;              // the rung it arrived on (channel kind derivable)
  agreedAt: string;
  supersededById: string | null;  // reschedules chain forward, never overwrite (07a immutability)
  active: boolean;
}

// ===== Risk (deterministic scorecard — conditionally-AI enrichment declared) =====
export type RiskComponentKind =
  | 'buyer-history' | 'value-band' | 'confirmation-latency'
  | 'channel-engagement' | 'address-quality' | 'buyer-tenure';
export interface RiskComponent {
  kind: RiskComponentKind;
  rawValue: number;               // e.g., completion ratio; value/cap ratio; hours-to-response
  normalized: number;             // 0–1 under the active policy (07c §2 formulas)
  weight: number;                 // policy weight at computation time
  points: number;                 // normalized × weight × 100
  explanationAr: string;          // composed from versioned bilingual templates, numeric params
  explanationEn: string;
}
export interface RiskScore {
  id: string;
  orderId: string;
  totalPoints: number;            // 0–100
  band: 'low' | 'medium' | 'high';  // thresholds from policy (seeded: low ≥70, high <40)
  components: RiskComponent[];    // the inspectable math (02 Fahad: "no black boxes")
  engine: 'rule-scorecard' | 'model-assisted';   // provenance, always displayed (ai-native §8)
  policyVersion: number;
  computedAt: string;
  computedByUserId: string | null; // explicit recomputes name the actor
}
export interface RiskPolicy {
  version: number;
  weights: Record<RiskComponentKind, number>;   // sums to 1 (VALIDATION otherwise, CP-6.2)
  valueCap: number;               // workspace currency minor units (seeded 500.00 → 50000)
  bandThresholds: { lowMin: number; highMax: number };  // seeded { lowMin: 70, highMax: 39 }
  holdRules: { overCapToHold: boolean; highBandOverHalfCapToHold: boolean };
  historyWindowDays: number;      // buyer-history trailing window (seeded 180)
  newBuyerNeutralScore: number;   // buyer-history component for zero history (seeded 0.5)
  publishedAt: string;
  publishedByUserId: string;
}

// ===== Templates (bilingual, versioned — no AI writes these) =====
export type TemplateSlot = AttemptKind | 'final-notice' | 'cancel-ack' | 'window-quick-replies';
export interface MessageTemplate {
  id: string;
  workspaceId: string;
  slot: TemplateSlot;
  bodyAr: string;                 // with {{name}} {{orderRef}} {{value}} {{window}} parameters
  bodyEn: string;
  quickReplyWindowOptions: boolean;   // message rung: encode eligible windows as reply buttons
  keypadMenuWindowOptions: boolean;   // voice rung: read windows as numbered keypad choices
  version: number;
  updatedAt: string;
  updatedByUserId: string;
}

// ===== Manifests =====
export interface HandoffManifest {
  id: string;
  workspaceId: string;
  siteId: string;
  routeDate: string;              // the delivery date band the batch targets
  orderIds: string[];             // frozen at seal
  status: 'draft' | 'sealed' | 'exported';
  rollup: { count: number; totalValue: number; windows: { windowId: string; count: number }[];
            bands: { low: number; medium: number; high: number }; agreementOwed: number };
  sealedAt: string | null;
  sealedByUserId: string | null;
  exportedAt: string | null;
  artifactId: string | null;      // export artifact (expiry per async-contract §2)
}

// ===== Ambient =====
export interface NotificationEvent {
  id: string;
  userId: string;
  kind: 'agreement-stamped' | 'hold-awaiting-decision' | 'ladder-transition'
      | 'auto-cancelled' | 'capacity-warning' | 'policy-published' | 'outcome-recorded';
  tier: 'instant' | 'daily-digest' | 'weekly-digest';   // P21 class ladder
  payload: Record<string, string>;
  createdAt: string;
  seenAt: string | null;
}
export interface ActivityEntry {   // P17 — actor-action-target-timestamp
  id: string;
  workspaceId: string;
  actorUserId: string | null;      // null = engine ('auto-cancel', 'channel-event')
  action: string;                  // 'order.imported' | 'ladder.started' | 'attempt.sent' | …
  targetId: string;
  detail: Record<string, string>;
  at: string;
}
export interface Job<T = unknown> {   // async-contract §2 state machine
  id: string;
  kind: 'order-import' | 'manifest-export' | 'ledger-export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: { code: string; message: string; correlationId: string };
}

