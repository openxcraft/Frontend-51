# 07a — Data Contract: invoice-generator-desk

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **non-AI** — there is no AI-touching operation anywhere in this product; tax and total arithmetic, number-to-words conversion, and numeral-system rendering are deterministic computation over fixed tables (07c). No generation, suggestion, or inspection operations exist on the adapter (07b). TypeScript declarations for every named entity follow; 07b composes them into operation signatures.

```ts
// ---- Foundational value types ----

export type Locale = 'ar' | 'en';

/** Bilingual field: at least ONE script must be present (state obligation #5);
 *  the absent side renders nothing — the document degrades gracefully and is
 *  never auto-translated. */
export interface BilingualString {
  en?: string;
  ar?: string;
}

/** Numeral system is a RENDER choice only. Storage is canonical Western-digit
 *  money (rtl-rules §3: numeral choice never changes parsing semantics). */
export type NumeralSystem = 'western' | 'arabic-indic';

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

export type InvoiceStatus = 'draft' | 'issued' | 'voided';
export type PaymentState = 'unmarked' | 'partial' | 'settled';

/** Render/display configuration — editable on drafts AND issued invoices
 *  (display is formatting; content is frozen — obligation #2). */
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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  targetInvoiceId?: string;
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                   // async-contract §5
}

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
```

## Relationships

Workspace 1—1 SellerProfile · Workspace 1—N Client · Workspace 1—N JurisdictionProfile · Workspace 1—N NumberSeries · Workspace 1—N Invoice · Invoice 1—N LineItem · Invoice 1—N PaymentMark · Invoice 1—N DeliveryRecord · Invoice 1—N ExportArtifact · Invoice N—1 Client · Invoice N—1 NumberSeries · Invoice N—1 JurisdictionProfile (live on drafts; SchemeSnapshot frozen at issue) · Invoice N—0..1 Invoice (duplicateOf) · Job spans export/delivery work targeting invoices · ActivityEntry references any workspace entity.

## Glossary (fixed terminology — one concept, one term; 02 voice derivation)

فاتورة=invoice · بند=line item · العميل=client · الإجمالي الفرعي=subtotal · الخصم=discount · المجموع الكلي=grand total · رقم الفاتورة=invoice number · سلسلة الترقيم=number series · نظام الأرقام=numeral system · الأرقام الغربية=Western digits · الأرقام العربية الهندية=Arabic-Indic digits · المبلغ كتابةً=amount in words · تاريخ الاستحقاق=due date · النطاق الضريبي=tax scheme · إصدار الفاتورة=issue · إبطال الفاتورة=void · تسجيل دفعة=payment mark · تسليم=delivery · تصدير=export. The tax label itself (e.g. ضريبة القيمة المضافة / VAT) is scheme DATA rendered bilingually from JurisdictionProfile.taxLabel, not system copy.

## State obligations (lifecycle invariants)

1. **Atomic sequential numbering**: numbers are assigned only by a successful `issueInvoice`, only from the invoice's series, atomically with validation success; a failed issue never consumes a number; numbers are never reused; a voided invoice keeps its number (the sequence has no gaps). Series counters are append-only — never hand-editable.
2. **Issue freeze, render freedom**: at issue, the invoice's content (line items, header fields, notes) and its computation (ComputedTotals + SchemeSnapshot) become immutable; DocumentRender remains editable post-issue because display is formatting over canonical values — the exact separation the numeral toggle embodies. Every render change is logged (`render-changed`).
3. **Payment marks are append-only evidence**: marks never mutate the document; PaymentState is always recomputed from marks; overpayment (Σ marks > grandTotal) is permitted, plainly flagged, never auto-reconciled; marks are blocked on voided invoices. No ledger semantics attach to any mark (LOOP-10).
4. **Canonical money discipline**: all amounts are integer minor units; quantities are decimal strings; all arithmetic rounds half-up at the scheme currency's minorDigits (2 or 3); no floating-point money exists anywhere in the contract.
5. **Bilingual degradation, never fabrication**: BilingualString fields require ≥1 script at save; a missing side renders nothing; the product never auto-translates any field (parity of content is the user's authorship, 12 Q-8).
6. **Scheme versioning & pinning**: scheme edits increment version and log; issued invoices read their SchemeSnapshot forever; drafts recompute against the live scheme; scheme deletion is blocked while referenced.
7. **Derived overdue**: never stored; recomputed at read (due date vs current date on the authoritative clock, fixed in the Mock Adapter).
8. **Delivery/export isolation**: delivery records and export artifacts never mutate invoice content; the artifact snapshots the DocumentRender it was generated under.
9. **Sample honesty**: the seeded sample draft carries `sample: true`; clearing it is one action, logged, and a cleared sample never returns (07c).
10. **No provider names** — the delivery path appears as channel kind `document-delivery-channel` and an abstract need in 08.
