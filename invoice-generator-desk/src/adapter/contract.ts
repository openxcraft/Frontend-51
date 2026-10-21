// VERBATIM from specs-source/invoice-generator-desk/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below. Implementation corrections applied: 2 (see portfolio SPEC_DEFECTS.md; specs-source untouched).
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types are declared canonically in 07a and
// are part of this contract by reference; 07b declares only the operational
// wrappers (summaries, views, jobs) its signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (issue-gate fields, zero-quantity rows,
 *                                      series prefix clashes, mark/void rules)
 * 'NOT_FOUND'    -> NotFoundError     (stale invoice/client/artifact links,
 *                                      expired artifacts)
 * 'PERMISSION'   -> PermissionError   (delivery-channel consent, viewer role,
 *                                      workspace scoping)
 * 'CONFLICT'     -> ConflictError     (concurrent draft edits, concurrent
 *                                      payment marks, concurrent scheme edits)
 * 'RATE_LIMIT'   -> RateLimitError    (channel sends, export jobs — soft quota)
 * 'NETWORK'      -> NetworkError      (list fetches, artifact delivery,
 *                                      job polling)
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
  role: 'owner' | 'editor' | 'viewer';   // viewer: read + export, no mutations
  locale: 'ar' | 'en';
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export type Locale = 'ar' | 'en';
export type NumeralSystem = 'western' | 'arabic-indic';
export type PaymentState = 'unmarked' | 'partial' | 'settled';
export type InvoiceStatus = 'draft' | 'issued' | 'voided';

export interface SellerProfileView {
  id: string;
  legalName: { en?: string; ar?: string };
  address: { en?: string; ar?: string };
  contactEmail: string;
  paymentInstructions: { en?: string; ar?: string };
  taxRegistrations: { schemeId: string; registrationNumber: string }[];
  updatedAt: string;
}

export interface ClientSummary {
  id: string;
  name: { en?: string; ar?: string };
  taxRegistrationNumber?: string;
  defaultCurrency?: string;
  invoiceCount: number;
  updatedAt: string;
}

export interface JurisdictionView {
  id: string;
  code: 'SA' | 'AE' | 'BH' | 'OM' | 'QA' | 'KW' | 'CUSTOM';
  label: { en?: string; ar?: string };
  taxLabel: { en?: string; ar?: string };
  defaultRateBps: number;
  requiresSellerTaxNumber: boolean;
  requiresClientTaxNumber: boolean;
  currency: { code: string; minorDigits: 2 | 3 };
  sourceNote: string;
  version: number;
  updatedAt: string;
}

export interface SeriesView {
  id: string;
  prefix: string;
  nextValue: number;                     // read-only preview; assigned at issue only
  issuedCount: number;
}

export interface LineItemView {
  id: string;
  description: { en?: string; ar?: string };
  quantity: string;
  unitPrice: { amountMinor: number; currency: string };
  discountBps: number;
  order: number;
}

export interface InvoiceSummary {
  id: string;
  clientId: string;
  clientName: { en?: string; ar?: string };
  schemeCode: JurisdictionView['code'];
  status: InvoiceStatus;
  number?: string;
  issueDate?: string;
  dueDate?: string;
  grandTotal?: { amountMinor: number; currency: string };
  paymentState: PaymentState;            // derived from marks at read (07a #3)
  overdue: boolean;                      // DERIVED, never stored (07a #7)
  numeralSystem: NumeralSystem;          // render config echo
  sample: boolean;
  updatedAt: string;
}

export interface InvoiceDetailView extends InvoiceSummary {
  seriesId: string;
  notes: { en?: string; ar?: string };
  render: {
    numeralSystem: NumeralSystem;
    layout: 'side-by-side-bilingual' | 'stacked-bilingual';
    showAmountInWords: boolean;
    showHijriDate: boolean;
    includePaymentHistoryInExport: boolean;
  };
  lineItems: LineItemView[];
  totals?: {                              // present on issued/voided; live on draft reads
    subtotal: { amountMinor: number; currency: string };
    discountTotal: { amountMinor: number; currency: string };
    taxableBase: { amountMinor: number; currency: string };
    rateBps: number;
    taxAmount: { amountMinor: number; currency: string };
    grandTotal: { amountMinor: number; currency: string };
    minorDigits: 2 | 3;
    roundingRule: 'half-up';
  };
  schemeSnapshot?: {
    schemeId: string;
    code: JurisdictionView['code'];
    taxLabel: { en?: string; ar?: string };
    rateBps: number;
    currency: { code: string; minorDigits: 2 | 3 };
  };
  payments: {
    id: string;
    amount: { amountMinor: number; currency: string };
    date: string;
    methodLabel: string;
    reference?: string;
    recordedAt: string;
  }[];
  deliveries: {
    id: string;
    channel: 'document-delivery-channel' | 'manual-download';
    state: 'queued' | 'delivered' | 'failed';
    requestedAt: string;
    deliveredAt?: string;
  }[];
  voidReason?: string;
  duplicateOf?: string;
  residual?: { amountMinor: number; currency: string };  // grandTotal − Σ marks (issued only)
}

export interface Job<T> {
  id: string;
  kind: 'export' | 'delivery';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  targetInvoiceId?: string;
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface InvoiceGeneratorAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // seller profile (the letterhead)
  getSellerProfile(): Promise<Result<SellerProfileView, AdapterError>>;
  updateSellerProfile(patch: {
    legalName?: { en?: string; ar?: string };
    address?: { en?: string; ar?: string };
    contactEmail?: string;
    paymentInstructions?: { en?: string; ar?: string };
    taxRegistrations?: { schemeId: string; registrationNumber: string }[];
  }): Promise<Result<SellerProfileView, AdapterError>>;

  // clients
  listClients(query: {
    filter?: { currency?: string; hasTaxNumber?: boolean };
    search?: string;                      // normalized bilingual search (rtl-rules §4)
    sort: 'nameEn' | 'updatedAt' | 'invoiceCount';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ClientSummary>, AdapterError>>;
  createClient(input: {
    name: { en?: string; ar?: string };   // ≥1 script required (VALIDATION otherwise)
    address?: { en?: string; ar?: string };
    email?: string;
    taxRegistrationNumber?: string;
    defaultCurrency?: string;
  }): Promise<Result<ClientSummary, AdapterError>>;
  updateClient(id: string, patch: {
    name?: { en?: string; ar?: string };
    address?: { en?: string; ar?: string };
    email?: string;
    taxRegistrationNumber?: string | null;
    defaultCurrency?: string;
    notes?: { en?: string; ar?: string };
  }): Promise<Result<ClientSummary, AdapterError>>;

  // tax schemes (jurisdiction-configurable tax fields)
  listJurisdictions(): Promise<Result<JurisdictionView[], AdapterError>>;
  updateJurisdiction(id: string, patch: {
    label?: { en?: string; ar?: string };
    taxLabel?: { en?: string; ar?: string };
    defaultRateBps?: number;              // 0–10000
    requiresSellerTaxNumber?: boolean;
    requiresClientTaxNumber?: boolean;
    currency?: { code: string; minorDigits: 2 | 3 };
    sourceNote?: string;
    baseVersion: number;                  // stale version -> CONFLICT
  }): Promise<Result<JurisdictionView, AdapterError>>;

  // number series (append-only counters)
  listNumberSeries(): Promise<Result<SeriesView[], AdapterError>>;
  createNumberSeries(input: {
    prefix: string;                       // VALIDATION on clash or malformed
  }): Promise<Result<SeriesView, AdapterError>>;

  // invoices — composition
  createInvoice(input: {
    clientId: string;
    schemeId: string;
    seriesId: string;
    dueDate?: string;                     // defaults to workspace defaultDueDays
    notes?: { en?: string; ar?: string };
    render?: Partial<InvoiceDetailView['render']>;
    duplicateOf?: string;                 // set by duplicateInvoice, not by hand
  }): Promise<Result<InvoiceDetailView, AdapterError>>;
  getInvoice(id: string): Promise<Result<InvoiceDetailView, AdapterError>>;
  listInvoices(query: {
    filter?: {
      status?: InvoiceStatus[];
      schemeCode?: JurisdictionView['code'][];
      clientId?: string;
      paymentState?: PaymentState[];
      overdue?: boolean;                  // derived-filter server-side at read
      sample?: boolean;
    };
    search?: string;                      // matches client names + invoice numbers
    sort: 'issueDate' | 'updatedAt' | 'grandTotal';
    cursor?: string; limit: number;
  }): Promise<Result<Page<InvoiceSummary>, AdapterError>>;
  updateInvoice(id: string, patch: {
    clientId?: string;
    schemeId?: string;                    // draft recompute is live (07a #6)
    seriesId?: string;
    dueDate?: string | null;
    notes?: { en?: string; ar?: string };
    baseUpdatedAt: string;                // stale -> CONFLICT with both payloads
  }): Promise<Result<InvoiceDetailView, AdapterError>>;

  // line items (drafts only; issued content is frozen — 07a #2)
  addLineItem(input: {
    invoiceId: string;
    description: { en?: string; ar?: string };
    quantity: string;                     // '2.5'; > 0 enforced (VALIDATION)
    unitPrice: { amountMinor: number; currency: string };
    discountBps?: number;                 // 0–10000
  }): Promise<Result<InvoiceDetailView, AdapterError>>;
  updateLineItem(id: string, patch: {
    description?: { en?: string; ar?: string };
    quantity?: string;
    unitPrice?: { amountMinor: number; currency: string };
    discountBps?: number;
    order?: number;
  }): Promise<Result<InvoiceDetailView, AdapterError>>;
  removeLineItem(id: string): Promise<Result<InvoiceDetailView, AdapterError>>;

  // lifecycle
  issueInvoice(input: {
    invoiceId: string;
    idempotencyKey: string;               // async-contract §5 — double-submit issues once
  }): Promise<Result<InvoiceDetailView, AdapterError>>;   // assigns number atomically (07a #1)
  voidInvoice(input: {
    invoiceId: string;                    // issued (or draft discard) — P04 level-2 in UI
    reason: string;                       // mandatory (VALIDATION if empty)
    idempotencyKey: string;
  }): Promise<Result<InvoiceDetailView, AdapterError>>;   // number stays consumed — no gaps
  duplicateInvoice(input: {
    invoiceId: string;                    // any non-sample source (even voided: template, not number)
    idempotencyKey: string;
  }): Promise<Result<InvoiceDetailView, AdapterError>>;   // new draft; NO number copied
  updateDocumentRender(id: string, patch: {
    numeralSystem?: NumeralSystem;        // render-only; allowed on issued invoices
    layout?: 'side-by-side-bilingual' | 'stacked-bilingual';
    showAmountInWords?: boolean;
    showHijriDate?: boolean;
    includePaymentHistoryInExport?: boolean;
  }): Promise<Result<InvoiceDetailView, AdapterError>>;   // logged as 'render-changed'

  // payment marks (append-only evidence — 07a #3)
  recordPayment(input: {
    invoiceId: string;                    // issued, non-voided only
    amount: { amountMinor: number; currency: string };   // currency must match invoice
    date: string;
    methodLabel: string;
    reference?: string;
    idempotencyKey: string;
  }): Promise<Result<InvoiceDetailView, AdapterError>>;
  deletePaymentMark(id: string): Promise<Result<InvoiceDetailView, AdapterError>>;  // P03 undo window in UI

  // delivery (abstract channel; manual path is download — 08 N1)
  sendInvoice(input: {
    invoiceId: string;                    // issued only
    idempotencyKey: string;
  }): Promise<Result<Job<{ deliveryId: string; channel: 'document-delivery-channel' }>, AdapterError>>;

  // export (manual path is primary from first run — LOOP-5)
  exportInvoice(input: {
    invoiceId: string;
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifactId: string; expiresAt: string }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>; // SPEC_DEFECTS B: stray > after inline object in spec

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; targetInvoiceId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    exports: number; sends: number;       // soft-quota meters (P14)
    exportLimit: number; sendLimit: number;
    resetAt: string;
  }, AdapterError>>;
  listActivity(query: {
    filter?: { actor?: string; action?: string[]; targetRef?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<{
    id: string; actorMemberId: string; action: string;
    targetRef: string; detail?: string; at: string;
  }>, AdapterError>>; // SPEC_DEFECTS B: Page<T> closed inside Result in spec
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export interface BilingualString {
  en?: string;
  ar?: string;
}

/** Numeral system is a RENDER choice only. Storage is canonical Western-digit
 *  money (rtl-rules §3: numeral choice never changes parsing semantics). */
export type RoundingRule = 'half-up';   // at the currency's minor digits (07c)
export interface CurrencyInfo {
  code: string;            // ISO 4217 alpha-3, e.g. 'SAR', 'AED', 'BHD'
  minorDigits: 2 | 3;      // BHD/KWD/OMR are 3-decimal currencies; the rest 2
}

/** Canonical money: integer minor units. No floats anywhere in money (obligation #4).
 *  Display divides by 10^minorDigits of the invoice's scheme currency and
 *  formats per the active numeral system at render time only. */
export interface Money {
  amountMinor: number;
  currency: string;
}

// ---- Workspace & configuration entities ----
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;
  defaultNumeralSystem: NumeralSystem;      // document render default
  defaultDueDays: number;                   // due-date suggestion on new invoices
  createdAt: string;
}

/** The issuer's letterhead. Tax registrations are per-scheme because the
 *  issue gate reads the scheme's required-field flags (obligation #1). */
export interface SellerProfile {
  id: string;
  workspaceId: string;
  legalName: BilingualString;
  address: BilingualString;
  contactEmail: string;
  contactPhone?: string;
  /** Payment instructions are DOCUMENT CONTENT (evidence for the payer),
   *  not payment collection (LOOP-10). Free-text bilingual block. */
  paymentInstructions: BilingualString;
  taxRegistrations: { schemeId: string; registrationNumber: string }[];
  updatedAt: string;
}

/** Client (the invoice's recipient). */
export interface Client {
  id: string;
  workspaceId: string;
  name: BilingualString;
  address: BilingualString;
  email?: string;
  taxRegistrationNumber?: string;
  defaultCurrency?: string;
  notes?: BilingualString;
  createdAt: string;
  updatedAt: string;
}

/** Tax scheme: the jurisdiction-configurable tax fields. Workspace-owned,
 *  seeded with the GCC landscape (07c fixed table), editable, versioned. */
export interface JurisdictionProfile {
  id: string;
  workspaceId: string;
  code: 'SA' | 'AE' | 'BH' | 'OM' | 'QA' | 'KW' | 'CUSTOM';
  /** Scheme display name, e.g. en 'Saudi Arabia' / ar 'السعودية'. */
  label: BilingualString;
  /** The tax block's label AS PRINTED, e.g. en 'VAT' / ar 'ضريبة القيمة المضافة'. */
  taxLabel: BilingualString;
  defaultRateBps: number;                   // 1500 = 15%; 0 = no-VAT regime
  requiresSellerTaxNumber: boolean;
  requiresClientTaxNumber: boolean;
  currency: CurrencyInfo;
  /** Rates are data, not law: every seeded row carries this source note. */
  sourceNote: string;
  version: number;
  updatedAt: string;
}

/** Immutable snapshot of the scheme AS USED at issue time — the issued
 *  document's tax block never drifts when the scheme is later edited. */
export interface SchemeSnapshot {
  schemeId: string;
  code: JurisdictionProfile['code'];
  taxLabel: BilingualString;
  rateBps: number;
  currency: CurrencyInfo;
}

/** Number series: strictly sequential, append-only counters. The product's
 *  compliance spine (obligation #1/#7). */
export interface NumberSeries {
  id: string;
  workspaceId: string;
  prefix: string;                           // e.g. 'INV-2026-'
  nextValue: number;                        // read-only to the UI; assigned at issue only
  createdAt: string;
}

// ---- The invoice ----
export interface DocumentRender {
  numeralSystem: NumeralSystem;
  layout: 'side-by-side-bilingual' | 'stacked-bilingual';
  showAmountInWords: boolean;
  showHijriDate: boolean;                   // display-only, method disclosed (12 Q-9)
  includePaymentHistoryInExport: boolean;
}
export interface LineItem {
  id: string;
  invoiceId: string;
  description: BilingualString;
  /** Decimal string, canonical ('2.5'); up to 2 fractional places. */
  quantity: string;
  unitPrice: Money;
  discountBps: number;                      // 0–10000 (0–100%), default 0
  order: number;
}

/** Deterministic computation result — recomputed live on drafts,
 *  PINNED at issue (obligation #2). Every figure carries its breakdown. */
export interface ComputedTotals {
  subtotal: Money;                          // Σ round(qty × unitPrice)
  discountTotal: Money;                     // Σ line discounts
  taxableBase: Money;                       // subtotal − discountTotal
  rateBps: number;                          // scheme rate at computation time
  taxAmount: Money;                         // round(taxableBase × rateBps / 10000)
  grandTotal: Money;                        // taxableBase + taxAmount
  minorDigits: 2 | 3;                       // rounding places used
  roundingRule: RoundingRule;
}
export interface PaymentMark {
  id: string;
  invoiceId: string;
  amount: Money;                            // evidence, same currency as invoice (obligation #3)
  date: string;
  methodLabel: string;                      // free text, seeded list ('bank transfer', …)
  reference?: string;                       // e.g. bank transfer reference
  recordedBy: string;                       // memberId
  recordedAt: string;
}
export type DeliveryChannelKind =
  | 'document-delivery-channel'             // abstract capability (08 N1)
  | 'manual-download';                      // the always-available LOOP-5 path
export interface DeliveryRecord {
  id: string;
  invoiceId: string;
  channel: DeliveryChannelKind;
  state: 'queued' | 'delivered' | 'failed';
  requestedAt: string;
  deliveredAt?: string;
  error?: { code: string; message: string; correlationId: string };
}
export interface Invoice {
  id: string;
  workspaceId: string;
  clientId: string;
  seriesId: string;
  schemeId: string;                         // live link on drafts
  status: InvoiceStatus;
  /** Assigned ONLY at issue (never on drafts, never reused, void consumes). */
  number?: string;                          // prefix + zero-padded sequence value
  issueDate?: string;                       // Gregorian ISO storage (rtl-rules §3)
  dueDate?: string;                         // optional; workspace default suggests
  notes: BilingualString;
  render: DocumentRender;
  lineItems: LineItem[];
  /** Pinned at issue: content + computation freeze together. */
  totals?: ComputedTotals;
  schemeSnapshot?: SchemeSnapshot;
  voidReason?: string;                      // mandatory when status = 'voided'
  duplicateOf?: string;                     // invoiceId this draft was duplicated from
  sample: boolean;                          // seeded sample flag (07c); clearable, never returns
  createdAt: string;
  updatedAt: string;
}

/** Derived, never stored: due date passed AND payment state ≠ settled. */
export type DerivedOverdue = boolean;

// ---- Jobs, artifacts, audit ----
export type JobKind = 'export' | 'delivery';
export interface ExportArtifact {
  id: string;
  invoiceId: string;
  format: 'pdf';
  renderConfigSnapshot: DocumentRender;     // the artifact records what it rendered
  expiresAt: string;                        // declared retention window at creation
  regenerable: boolean;
}
export interface ActivityEntry {            // P17
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'seller-profile-updated' | 'client-created' | 'client-updated'
    | 'scheme-updated' | 'series-created'
    | 'invoice-created' | 'invoice-duplicated' | 'line-items-edited'
    | 'invoice-issued' | 'invoice-voided' | 'render-changed'
    | 'payment-recorded' | 'payment-mark-deleted'
    | 'delivery-sent' | 'export-run' | 'sample-cleared';
  targetRef: string;
  detail?: string;                          // e.g. 'numeral system: arabic-indic (render-only)'
  at: string;
}

