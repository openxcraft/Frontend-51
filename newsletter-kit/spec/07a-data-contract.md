# 07a — Data Contract: newsletter-kit (backend-agnostic)

SME-G pass · TypeScript types only. AI declaration: **conditionally-AI, one operation** — subject-variant assist (07b), draft-by-default, manual alternates editor always present (degradation map in 08). Every entity traces to a flow in 03; every operation appears in 07b — no orphans, either direction. No backend/provider/transport named; external touchpoints are abstract needs in 08 only.

```ts
// ——— Core ———
export type Locale = 'ar' | 'en';
export type NumeralPolicy = 'western'; // ledger binding; display-only, storage canonical

// ——— Issue composition ———
export type IssueStatus = 'draft' | 'scheduled' | 'sent';

export interface Issue {
  id: string; workspaceId: string;
  internalTitle: string; issueNumber: number | null;
  locales: Locale[];                      // composed locales (CP-1)
  status: IssueStatus;
  revision: number;                       // conflict base (P10 / CP-1.4)
  duplicatedFrom: { issueId: string; fromLocale: Locale; toLocale: Locale } | null;
  content: Record<Locale, LocaleContent>;
  scheduledSendJobId: string | null;      // set by scheduleSend (CP-5.3)
  sentAt: string | null;                  // send completion locks content (CP-5 recovery)
  createdAt: string; updatedAt: string;
}

export interface LocaleContent {
  locale: Locale;
  subjectVariants: SubjectVariant[];      // per-locale variant set (CP-2)
  preheader: string | null;
  blocks: IssueBlock[];                   // ordered
}

export interface SubjectVariant {
  id: string; locale: Locale;
  text: string;                           // bidi isolation applied on input (rtl-rules §2)
  characterCount: number;                 // budgets EN warn>43/fail>70, AR warn>55/fail>80 (heuristic, disclosed)
  primary: boolean;                       // at most one per locale (CP-2.2)
  source: 'manual' | 'assist' | 'imported';
  assistProposal?: { jobId: string; partial: boolean }; // P15 draft marker
}

export interface IssueBlock {
  id: string; locale: Locale;
  pairKey: string;                        // alignment link across locales (P23; preserved by duplicateIssue)
  type: 'heading' | 'paragraph' | 'quote' | 'linkList' | 'image' | 'divider' | 'cta' | 'signature';
  fields: Record<string, string>;         // per-type text/URL/alt; direction derives from locale
  style: { italic: boolean };             // C07 guard: italic renders only for 'en'
}

// ——— QA (deterministic catalog — never AI) ———
export type QaCheckId =
  | 'C01-direction-containers' | 'C02-subject-bidi-isolation' | 'C03-subject-length'
  | 'C04-preheader' | 'C05-numeral-consistency' | 'C06-arabic-line-height'
  | 'C07-italic-on-arabic' | 'C08-font-fallback-stack' | 'C09-cta-alignment' | 'C10-consent-footer';

export interface QACheckResult {
  id: string; issueId: string; issueRevision: number; locale: Locale | 'both';
  checkId: QaCheckId;
  status: 'pass' | 'warn' | 'fail' | 'not-applicable';
  detail: string;                         // written copy per 11
  blockId: string | null;                 // fix-path deep link (CP-3.3)
  checkedAt: string;
}

export interface QaRunSummary {
  issueId: string; issueRevision: number; runJobId: string;
  fails: number; warns: number; passes: number; notApplicable: number;
  sendGate: 'blocked' | 'warned' | 'clear'; // CP-3.5
}

// ——— Subscribers & consent ———
export interface SubscriberList {
  id: string; workspaceId: string; name: string; description: string | null;
  localeMix: { ar: number; en: number; unspecified: number };  // derived
  unconsentedCount: number;               // derived; send-gate input (CP-4.6)
  sourceLabels: string[];                 // import provenance
  createdAt: string; updatedAt: string;
}

export interface Subscriber {
  id: string; listId: string;
  email: string; displayName: string | null;
  localePreference: Locale | 'unspecified'; // explicit; never silently defaulted (CP-4.2)
  consent: { scope: 'broadcast'; proof: string; date: string } | null; // null = unconsented (CP-4.3)
  status: 'active' | 'removed';
  sourceImportJobId: string | null;
  addedAt: string;
}

export interface ImportRowIssue { rowIndex: number; kind: 'invalid-email' | 'duplicate' | 'consent-missing' | 'locale-missing'; value: string; }

// ——— Delivery (abstract channel — LOOP-10/LOOP-5) ———
export type ChannelStatus = 'unverified' | 'active' | 'expiring-soon' | 'expired' | 'failed' | 'revoked'; // credential-contract §3

export interface DeliveryChannelBinding {
  id: string; workspaceId: string;
  kind: 'email-delivery';                 // capability language, never vendor (credential-contract §2)
  label: string; hint: string;            // masked identifier fragment; secret never shown
  status: ChannelStatus;
  grantedOperations: ('issue-send')[];    // grant display (credential-contract §4)
  verifiedAt: string | null;
}

export type SendLocalePolicy = 'preference' | 'combined' | 'single-edition'; // CP-5.2

// ——— Jobs (async-contract §2; five kinds) ———
export type JobKind = 'qa-run' | 'subject-assist' | 'import' | 'export' | 'send';
export type JobState = 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';

export interface Job<K extends JobKind, TResult> {   // K narrows kind per call-site (07b); Job<JobKind, unknown> is the any-job view
  id: string; kind: K; state: JobState;
  issueId: string | null; listId: string | null;
  progress: { determinate: boolean; done: number | null; total: number | null };
  partial: TResult | null;                // streamed/interim (assist proposals, import stats, per-locale counts)
  result: TResult | null;
  error: { code: string; message: string; correlationId: string } | null;
  note: string | null;                    // "record why sending anyway" (CP-3.5) on send jobs
  createdAt: string; updatedAt: string;
}

export interface SendOutcome {
  perLocale: { locale: Locale; sent: number; total: number }[];
  renderedEditions: { locale: Locale; artifactId: string }[]; // linked deliverables (async-contract §2)
}

export interface SendJob extends Job<'send', SendOutcome> {
  channelId: string; scheduledAt: string; localePolicy: SendLocalePolicy;
  listSnapshot: { listId: string; counts: { ar: number; en: number; unspecified: number }; takenAt: string }; // CP-5 edge
}

export interface ExportArtifact {
  id: string; exportJobId: string; issueId: string;
  format: 'html' | 'text' | 'subscriber-csv'; locale: Locale | 'n/a';
  expiresAt: string; regenerable: true;   // async-contract §2 expired + renewal
}

export interface UsageWindow { window: string; assistGenerations: number; assistGenerationsLimit: number; resetAt: string; } // P14 — assist only
export interface ActivityEntry { id: string; workspaceId: string; actorId: string; action: string; targetRef: string; timestamp: string; } // P17
```

## Relationships

Workspace 1—N Issue / SubscriberList / DeliveryChannelBinding / ActivityEntry. Issue 1—2 LocaleContent (per composed locale); LocaleContent 1—N SubjectVariant + IssueBlock (pairKey links blocks across the issue's two LocaleContents). SubscriberList 1—N Subscriber. Issue 1—N QACheckResult (runs pin issueRevision). SendJob / export Job 1—N ExportArtifact; SendJob pins listSnapshot. All list-bearing relations paginate via the typed `Page` model (07b).

## State obligations

Issue content locks on `sentAt` (re-editing spawns a duplicated draft). QACheckResults pin issueRevision — stale runs marked, never rewritten (P16). `primary` unique per locale; assist-sourced variants carry their proposal job for audit. Consent is per-row (proof+date); unconsented rows block sends with a typed count, never silently dropped. Imports idempotent per (list, sourceLabel + content hash). Send jobs pin a list snapshot at schedule time. No entity references a provider, transport, or external system by name.
