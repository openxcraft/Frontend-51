# 07a — Data Contract: contract-lifecycle-manager

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — the extraction assist may bind a document-reading capability (abstract, 08 N1) that proposes metadata and obligation drafts; every suggestion is draft-by-default until human resolution (P15), and the manual entry path is the always-available primary. The reminder engine, workflow, register, and audit trail are deterministic by construction and never require the assist. TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type ContractType = 'msa' | 'sow' | 'lease' | 'supply' | 'nda' | 'other';
export type ContractLanguage = 'ar' | 'en' | 'bilingual';
export type ObligationKind =
  | 'renewal-notice' | 'expiry' | 'payment' | 'deliverable'
  | 'report' | 'certificate' | 'other';
export type ObligationDirection = 'we-owe' | 'they-owe';
export type ContractStatus =
  | 'draft' | 'in-review' | 'awaiting-execution'
  | 'active' | 'terminated' | 'archived';          // stored states only
export type UrgencyZone = 'overdue' | 'imminent' | 'approaching' | 'later';  // derived, never stored

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;
  reminderDefaults: {
    firstLeadDays: number;               // default 30 — D−firstLead reminder entry
    finalLeadDays: number;               // default 7  — D−finalLead reminder entry
  };
  noticeWindowDefaultDays: number;       // default 60 — suggested at intake ([24] band)
}

export interface Counterparty {
  id: string;
  workspaceId: string;
  legalNameEn: string;                   // bilingual identity: either side alone is valid
  legalNameAr?: string;
  kind: 'company' | 'individual' | 'government';
  registryId?: string;                   // e.g. commercial-registration number (Latin digits)
  registryIdSource: 'manual' | 'party-registry-capability';  // provenance, never vendor
  note?: string;
  activeContractCount: number;           // derived at read
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TermRecord {            // append-only term history (CP-3)
  id: string;
  effectiveDate: string;                 // ISO date
  terminationDate: string | null;        // null = open-ended
  provenance: 'intake' | 'renewal' | 'correction';
  correctionOf?: string;                 // term-record id when correcting, never editing history
  note?: string;
  recordedByMemberId: string;
  recordedAt: string;                    // timestamp announced with the action (a11y-baseline §7)
}

export interface ContractRecord {
  id: string;
  workspaceId: string;
  counterpartyId: string;
  titleEn: string;                       // internal title; either side alone is valid (P23 logic)
  titleAr?: string;
  contractType: ContractType;
  tags: string[];
  ownerMemberId: string;                 // accountable owner (Layla/Faisal role)
  valueAmount?: number;                  // register metadata for triage; no financial posting (LOOP-10)
  currency?: string;                     // free-text ISO-style code, Latin
  language: ContractLanguage;
  autoRenew: boolean;
  noticeWindowDays?: number;             // required semantics when autoRenew = true
  terms: TermRecord[];                   // current term = last entry; history is the audit spine
  status: ContractStatus;
  execution?: ExecutionRecord;           // present once recorded (CP-4)
  primaryDocumentId?: string;
  suggestionJobIds: string[];            // extraction provenance chain
  version: number;                       // optimistic concurrency (CONFLICT on stale)
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionRecord {       // attestation-shaped fact, append-only semantics
  executedAt: string;                    // ISO date
  channel: 'manual' | 'execution-channel';  // abstract channel when bound (08 N2); manual is primary
  recordedByMemberId: string;
  documentId?: string;                   // the executed copy uploaded as a document version
  recordedAt: string;
}

export interface ContractDocument {
  id: string;
  contractId: string;
  fileName: string;
  language: ContractLanguage;
  pageCount?: number;
  bytes: number;
  uploadedByMemberId: string;
  uploadedAt: string;
  version: number;                       // document versions replace whole files, never patch
}

export interface ReviewStep {            // workflow track (CP-4), append-only
  id: string;
  contractId: string;
  requestedByMemberId: string;
  requestedAt: string;
  note?: string;
  state: 'pending' | 'approved' | 'returned';
  assigneeMemberId: string;
  decisionComment?: string;
  decidedAt?: string;
}

export interface Obligation {
  id: string;
  workspaceId: string;
  contractId: string;
  direction: ObligationDirection;
  summaryEn: string;                     // plain bilingual summary; either side alone is valid
  summaryAr?: string;
  kind: ObligationKind;
  ownerMemberId: string;
  recurrence: { kind: 'one-time'; dueDate: string }
    | { kind: 'recurring'; intervalDays: number; anchorDate: string };
  leadOverride?: { firstLeadDays?: number; finalLeadDays?: number };
  status: 'open' | 'acknowledged' | 'completed' | 'closed-by-termination';
  provenance: 'manual' | 'assist' | 'import';
  assistSuggestionId?: string;           // provenance chain to the accepted suggestion
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ObligationCompletion { // append-only evidence event (CP-2)
  id: string;
  obligationId: string;
  completedByMemberId: string;
  completedAt: string;                   // ISO datetime — announced with the action
  evidenceNote?: string;
  documentRef?: string;                  // optional reference to an uploaded document
}

export interface ReminderEntry {         // DERIVED — never stored; computed from
  // obligation state + workspace defaults + the fixed clock (07c formulas)
  obligationId: string;
  contractId: string;
  kind: 'first-lead' | 'final-lead' | 'due' | 'overdue-daily' | 'notice-deadline';
  fireDate: string;                      // deterministic date
  zone: UrgencyZone;     // overdue | imminent(≤7d) | approaching(≤30d) | later — computed
}

export interface ExtractionSuggestion { // draft-by-default (P15); never authoritative
  id: string;
  jobId: string;
  contractId: string;
  documentId: string;
  target: { kind: 'metadata-field'; field: string; proposedValue: string }
    | { kind: 'obligation'; proposed: Omit<Obligation, 'id' | 'workspaceId' | 'version'
        | 'createdAt' | 'updatedAt' | 'status' | 'provenance' | 'assistSuggestionId'> };
  confidence: number;                    // 0–1, labeled figure at render
  anchor?: { page: number; excerpt: string };  // citation anchor into the document
  state: 'proposed' | 'accepted' | 'dismissed';
  resolvedByMemberId?: string;
  resolvedAt?: string;
}

export type JobKind = 'extraction' | 'export';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';               // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };  // pages / artifact steps
  partial?: unknown;                     // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                // async-contract §5
}

export interface ExportArtifact {
  id: string;
  scope: 'contracts' | 'obligations' | 'activity';
  format: 'csv' | 'register-bundle';     // bundle = contracts + obligations appendix
  filtersApplied: Record<string, string>;
  expiresAt: string;                     // declared retention window at creation
  regenerable: boolean;
}

export interface ActivityEntry {         // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'contract-created' | 'metadata-updated' | 'document-uploaded'
    | 'review-requested' | 'review-decided' | 'execution-recorded'
    | 'renewal-recorded' | 'termination-recorded' | 'contract-archived'
    | 'obligation-created' | 'obligation-updated' | 'obligation-completed'
    | 'suggestion-accepted' | 'suggestion-dismissed' | 'counterparty-created'
    | 'counterparty-updated' | 'export-run' | 'consent-change' | 'correction-recorded';
  targetRef: string;
  detail?: string;                       // e.g. "assist-proposed, human-edited" provenance
  correctionOf?: string;                 // references the erroneous entry — never edit history
  at: string;
}
```

## Relationships

Workspace 1—N Counterparty / ContractRecord / Obligation / ActivityEntry · Counterparty 1—N ContractRecord · ContractRecord 1—N ContractDocument (versioned whole) · ContractRecord 1—N TermRecord (append-only; current = last) · ContractRecord 1—1 ExecutionRecord (once present) · ContractRecord 1—N ReviewStep (ordered, append-only) · ContractRecord 1—N Obligation · Obligation 1—N ObligationCompletion (append-only) · Obligation 1—N ReminderEntry (derived at read) · Job 1—N ExtractionSuggestion · Job 1—N ExportArtifact · ExtractionSuggestion → Obligation provenance chain via `assistSuggestionId`.

## State obligations

- **Stored vs derived discipline**: only the six ContractStatus values are stored; expiring-soon/expired are derived display states computed at read from term dates + clock (07c) — a derived state is never written back.
- **Append-only histories**: terms, executions, review steps, completions, and activity entries are never edited; corrections append a referencing record (`correctionOf`) — the audit trail is the product's integrity (house grammar shared with asset-register-tracker).
- **The reminder engine is pure computation**: ReminderEntry is derived from (obligation state, recurrence rule, workspace defaults, clock); the same state always yields the same schedule and zones — deterministic by construction (07c regression assertions).
- **Suggestion resolution is the P15 gate**: an accepted suggestion creates the authoritative record with `provenance: 'assist'` + `assistSuggestionId` chain; edit-then-accept records "assist-proposed, human-edited" in the activity detail; dismissed suggestions are retained, never purged.
- **Termination closes obligations honestly**: `markTerminated` sets every open obligation to `closed-by-termination` — each closure is listed in the termination event, never silently dropped.
- **Auto-renew requires a notice window**: metadata save with `autoRenew: true` and no `noticeWindowDays` → VALIDATION at the boundary; window larger than the current term → VALIDATION.
- **Version concurrency**: ContractRecord, Obligation, Counterparty carry `version`; stale mutations → CONFLICT with both payloads (P10).
- **No provider names anywhere** — capabilities appear as abstract kinds (`execution-channel`, `party-registry-capability`) and consent states, per credential-contract §2.
