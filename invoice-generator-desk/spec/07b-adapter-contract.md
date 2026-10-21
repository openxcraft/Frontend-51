# 07b — Adapter Contract: invoice-generator-desk (TypeScript, v1)

SME-G pass · `InvoiceGeneratorAdapterV1` · Non-AI declaration (ai-native-patterns §1): zero AI operations exist on this contract; every computation below is deterministic arithmetic over canonical data (07a/07c). LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session, idempotency keys on every submit-shaped operation. Types only — no implementation. Entity semantics (Workspace, SellerProfile, Client, JurisdictionProfile, NumberSeries, Invoice, LineItem, ComputedTotals, PaymentMark, DeliveryRecord, ExportArtifact, Job, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table).

```ts
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
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }>, AdapterError>>;

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
  }, AdapterError>>;
}
```

## Rules (binding)

1. **Sequence integrity**: `issueInvoice` is the ONLY operation that advances a series counter, atomically with full gate validation; a failed gate consumes nothing; numbers are never reused; `voidInvoice` keeps the number consumed (the sequence never gaps); `duplicateInvoice` never copies a number. Series counters are read-only to every other operation.
2. **Issue gate**: validation order is (a) ≥1 line item with quantity > 0 and unitPrice ≥ 0; (b) scheme required-field gates — seller AND (if the scheme demands) client tax-registration numbers present; (c) currency consistency across items; (d) client exists. Any failure returns VALIDATION naming the field and the scheme; nothing is mutated.
3. **Freeze semantics**: `updateInvoice`/`addLineItem`/`updateLineItem`/`removeLineItem` on an issued or voided invoice → VALIDATION ("issued content is frozen — void or duplicate instead"); `updateDocumentRender` remains legal on issued invoices (display over canonical values) and every call appends an activity entry; totals and SchemeSnapshot are pinned at issue and never recomputed.
4. **Canonical money**: all arithmetic is integer minor units with half-up rounding at the scheme currency's minorDigits; `recordPayment` with a currency differing from the invoice's → VALIDATION naming both; marks on voided invoices → VALIDATION.
5. **Derived state honesty**: `paymentState` and `overdue` are computed at read from marks and dates — never stored, never stale; the `overdue` filter resolves server-side at query time.
6. **Consent enforcement**: `sendInvoice` without a granted document-delivery-channel consent → PERMISSION naming the capability class in capability language (credential-contract §4), with the manual download alternative stated in the SAME error surface; the channel never appears under a vendor name.
7. **Idempotency**: `issueInvoice`, `voidInvoice`, `duplicateInvoice`, `recordPayment`, `sendInvoice`, `exportInvoice` carry idempotency keys; a retried submit returns the original result (async-contract §5) — a double-clicked issue never issues twice.
8. **Partial-result policies**: exports are atomic per artifact (a failed export yields nothing but is idempotently retryable); delivery jobs expose honest queued→delivered|failed states with retry scoped to the delivery, never re-issuing or re-numbering anything; progress is determinate in units (artifacts, sends) — never fake percentages (async-contract §3).
9. **Stale-version semantics**: `updateJurisdiction` (baseVersion) and `updateInvoice` (baseUpdatedAt) → CONFLICT with both payloads in `details`; concurrent payment marks → CONFLICT with both marks kept.
10. **Soft quota ladder**: `sendInvoice`/`exportInvoice` near or past the window limit → RATE_LIMIT with ladder copy (reduce → notice → reset time); the manual download path is NEVER rate-limited (the LOOP-5 floor cannot be rationed).
11. **Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass.**
12. **No AI operations exist on this contract** (declaration, ai-native-patterns §1); any future assist-shaped operation requires a new contract version and a re-opened 00 exclusions discussion with the owner (12 Q-14).
