# 07a — Data Contract: abandoned-cart-recovery

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI, one surface** — bilingual recovery-copy generation (`DraftVariantSet` via the abstract generation capability) which degrades to the template library when unbound, rate-limited, or failed. Scheduling, banding, priority scoring, quiet-hours deferral, suppression, expiry, and reporting are deterministic rules with no model anywhere in them. TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type ChannelKind = 'email' | 'rich-message' | 'plain-text';   // abstract capability kinds — never vendors
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

export interface Job {
  id: string;
  workspaceId: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';  // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // carts / variants / formats
  partial?: unknown;                        // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                   // async-contract §5 — double-submit never double-imports/generates/exports
  createdAt: string;
}

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
```

## Relationships

Workspace 1—N AbandonedCart · Workspace 1—N Shopper · Workspace 1—N RecoverySequence · Workspace 1—N MessageTemplate · Workspace 1—1 RoutingPolicy (versioned) · Workspace 1—1 QuietHourPolicy (rows versioned individually) · Workspace 1—N SuppressionEntry · AbandonedCart N—1 Shopper · AbandonedCart 1—0..1 SequenceAssignment (pinned sequence + version) · RecoverySequence 1—N SequenceStep · SequenceStep N—1 MessageTemplate (at pinned version) · SequenceStep N—1 QuietHourRow (by id, at send-time version) · AbandonedCart 1—N SendRecord (each pins sequence/template/policy versions) · AbandonedCart 1—N ShopperEvent (append-only) · ShopperEvent 1—0..1 SendRecord · Shopper 1—N SuppressionEntry (restores append) · DraftVariantSet N—1 MessageTemplate (base at version) · Job spans import/generation/export work · ExportArtifact 1—N formats · Workspace 1—N ActivityEntry.

## State obligations

- **Determinism is a contract**: identical (cart state, sequence version, quiet-hour row versions, routing policy version, event history) always yields identical schedules, deferrals, band assignments, and priority scores. Every derived value (priority components, band, deferral, report) is recomputed from recorded state — never hand-set, never stored authoritative.
- **Version pinning everywhere a send touches a policy**: SendRecord pins `sequenceVersion`, `templateVersion`, and — inside `DeferInfo` — the exact `quietHourRowVersion` that deferred it. Editing a sequence, template, or policy row never mutates existing sends: later evaluations use the new version, and the ledger displays both with version stamps. A cart's assignment pins the sequence version it entered.
- **Suppression is a state machine, not a flag**: an opt-out event cancels every scheduled AND deferred send for that shopper (state `skipped-suppressed`), writes a SuppressionEntry, and routes future carts to `suppressed-at-intake` at intake. A send already dispatched when the opt-out lands is history — recorded, never rewritten; the ledger notes the race honestly.
- **Expiry is terminal**: past `expiryHours` without a completion event, remaining sends cancel (`cancelled`, stateReason carries the expiry) and the cart becomes `expired`. Nothing resurrects an expired cart; a new cart for the same shopper is a new recovery object.
- **Recovery is event-driven**: only a `checkout-completed` ShopperEvent flips a cart to `recovered`; the event idempotency key makes duplicate delivery write once. Recovered carts freeze their send history (evidence for the report and the export).
- **Manual and channel events are peers**: provenance differs, ledger shape does not — the report may group by provenance but never silently drops manual events (LOOP-5 discipline).
- **Generation is quarantined**: DraftVariantSets carry permanent provenance `generated`, expire, and can never bind a sequence step directly — promotion lands in a DRAFT template (origin `generated-promoted`) which still requires explicit approval (07b double gate).
- **Partial-result policies** (async-contract §4): cart imports deliver rows-so-far + named bad rows; generation retains partial variants, marked; exports deliver per-format with per-format retry. An empty send-list export is refused with typed VALIDATION naming the queue state — never a blank artifact.
- **Canonical money and time**: totals are stored canonically per currency and rendered per numeral policy (Western, design-language-map §7); instants are UTC ISO; local times derive from the shopper timezone at render — display is formatting, never storage (rtl-rules §3 numerals rule, applied to clocks).
- **No provider names anywhere** — channels appear as `ChannelKind` values, sources as `CartProvenance` values, capabilities as abstract needs in 08.
