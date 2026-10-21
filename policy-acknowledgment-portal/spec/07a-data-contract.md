# 07a — Data Contract: policy-acknowledgment-portal

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns.md §1): **declared non-AI — deterministic attestation ledger**. Zero AI operations exist on the adapter (07b); no assist, no clustering, no generation, no inspection. The product's intelligence is arithmetic: coverage counts, derived overdue zones, and version pins — the same input state always yields the same output facts. TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type GoverningLocaleRule = 'ar' | 'en';        // per policy; KSA Labor Law Article 9 posture → 'ar' (research [33][34])

export type PolicyCategory =
  | 'conduct' | 'information-security' | 'hr'
  | 'safety' | 'finance' | 'data-privacy' | 'other';

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;                 // admin chrome default (LOOP-6 proposed)
  governingLocaleHint: GoverningLocaleRule; // default proposed at policy creation (jurisdiction posture)
  createdAt: string;
}

export interface Policy {
  id: string;
  workspaceId: string;
  titleEn: string;                        // human-authored pair; never auto-translated
  titleAr?: string;                       // unpaired sides warn, never block (02 voice: honesty)
  category: PolicyCategory;
  ownerMemberId: string;
  governingLocale: GoverningLocaleRule;
  currentVersionId?: string;              // latest PUBLISHED version
  status: 'active' | 'draft-only' | 'retired';
  createdAt: string;
  updatedAt: string;
}

export type VersionStatus =
  | 'draft'          // label 0.x, bodies may be unpaired, not targetable by campaigns
  | 'published'      // label 1.0+, governing-locale body required, campaigns may target
  | 'superseded'     // a later version superseded it; evidence for its period remains valid
  | 'withdrawn';     // administratively withdrawn with a recorded reason; never silently deleted

export interface PolicyBody {
  locale: Locale;
  source: 'paste' | 'upload';             // paste is the always-available path (LOOP-5)
  text: string;                           // stored whole, read-only (LOOP-10: no authoring)
  contentDigest: string;                  // deterministic digest of the body text (computed, never edited)
  charCount: number;
}

export interface PolicyVersion {
  id: string;
  policyId: string;
  label: string;                          // document-control grammar: drafts 'v0.x', published 'v1.0+' (research [44]–[51])
  status: VersionStatus;
  bodies: PolicyBody[];                   // 1 or 2 entries; governing locale REQUIRED when status='published'
  changeSummaryEn?: string;
  changeSummaryAr?: string;
  effectiveDate: string;                  // ISO date, not in the past at publish time
  supersedesVersionId?: string;           // set at publish; the chain is the policy's history
  withdrawalReason?: string;              // required when status='withdrawn'
  publishedAt?: string;
  publishedByMemberId?: string;
  createdAt: string;
}

export interface Person {
  id: string;
  employeeNumber: string;                 // unique, Western numerals (05 typography)
  nameEn: string;
  nameAr?: string;                        // unpaired names render honestly (bidi-isolated)
  email?: string;                         // optional: frontline staff may have none (02 Mariam)
  phone?: string;
  site: string;
  kind: 'employee' | 'contractor';
  status: 'active' | 'inactive';          // never deleted — audit honesty (07a state obligations)
  deactivatedAt?: string;
  readingLocale: Locale;                  // acknowledger portal default (E1/E2)
  segmentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Segment {
  id: string;
  workspaceId: string;
  nameEn: string;
  nameAr?: string;
  memberPersonIds: string[];              // membership edits affect FUTURE campaigns only (snapshot contract)
  createdAt: string;
  updatedAt: string;
}

export interface AttestationText {
  id: string;
  textEn: string;                         // the exact words a person attests to; human-authored pair
  textAr?: string;                        // governing-locale text REQUIRED at campaign launch
  createdAt: string;
}

export interface Campaign {
  id: string;
  workspaceId: string;
  policyVersionId: string;                // pinned: campaigns target versions, not policies
  segmentIds: string[];                   // membership SNAPSHOTTED into assignments at launch
  dueWindowDays: number;                  // >= 1
  dueDate: string;                        // computed at launch: launchAt + dueWindowDays
  reminderCadenceDays: number[];          // e.g. [3, 7] — calm schedule, P21
  attestationTextId: string;              // pinned: the acknowledgment pins the exact text
  requireLocale: 'governing' | 'both';    // what MUST be read before submit unlocks
  state: 'running' | 'cancelled';
  launchedAt: string;
  launchedByMemberId: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface Assignment {
  id: string;
  campaignId: string;
  personId: string;                       // deduplicated per campaign (one assignment per person)
  state: 'assigned' | 'acknowledged' | 'declined';
  assignedAt: string;                     // snapshot moment — membership drift never rewrites this
}

export interface ReadEvidence {
  locale: Locale;
  openedAt: string;                       // per-locale view events; timestamps, not scroll policing (LOOP-10)
}

export interface Acknowledgment {
  id: string;
  assignmentId: string;
  personId: string;
  campaignId: string;
  policyVersionId: string;                // permanent pin — evidence never drifts (00 unique feature)
  attestationTextId: string;              // permanent pin to the exact words agreed
  localesAttested: Locale[];              // what the person actually attested against
  readEvidence: ReadEvidence[];           // which locales were opened, when
  submittedAt: string;                    // announced with the action (a11y-baseline §7)
  attestationDigest: string;              // deterministic digest over (personId, policyVersionId, attestationTextId, submittedAt)
}

export interface DeclineRecord {
  id: string;
  assignmentId: string;
  personId: string;
  campaignId: string;
  policyVersionId: string;
  reason?: string;                        // optional; a recorded fact, never auto-escalated (LOOP-10)
  declinedAt: string;
}

export type LedgerActionKind =
  | 'policy-created' | 'metadata-updated' | 'version-published' | 'version-withdrawn'
  | 'campaign-launched' | 'campaign-extended' | 'campaign-cancelled' | 'dispatch-sent' | 'dispatch-failed'
  | 'view-recorded' | 'acknowledgment-recorded' | 'decline-recorded' | 'reminder-sent'
  | 'person-created' | 'person-updated' | 'segment-created' | 'segment-updated'
  | 'consent-changed' | 'export-run';

export interface LedgerEntry {            // the attestation audit trail — append-only (P17 + §7 overlay)
  id: string;
  workspaceId: string;
  actorMemberId: string;                  // for employee-path entries: the person's acknowledger session
  actorKind: 'admin' | 'acknowledger' | 'system';
  action: LedgerActionKind;
  targetRef: string;                      // entity id the action concerns
  detail?: string;                        // e.g. version label + effective date; extension before/after values
  at: string;
}

export type JobKind = 'import-people' | 'dispatch' | 'export-evidence-pack';

export interface JobRecord {              // the persisted job entity; 07b's Job<T> is the
  id: string;                            // operational view over it (typed partial/result)
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                      // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                 // async-contract §5
}

export interface ExportArtifact {
  id: string;
  jobId: string;
  scope: { campaignId?: string; policyVersionId?: string };
  includesAttestationTextAppendix: boolean;
  expiresAt: string;                      // declared retention window at creation
  regenerable: boolean;                   // from immutable state, always true at v1
}
```

## Relationships

Workspace 1—N Policy · Policy 1—N PolicyVersion (ordered supersedes chain; exactly one `currentVersionId` among `published`) · PolicyVersion 1—N PolicyBody (per locale, max 2) · Workspace 1—N Segment N—M Person (membership via segmentIds/memberPersonIds) · Workspace 1—N Person · PolicyVersion 1—N Campaign · Campaign 1—N Assignment · Assignment 1—1 (Acknowledgment | DeclineRecord) — a person's campaign outcome is exactly one terminal record · Person 1—N Acknowledgment across campaigns (the history surface S6) · AttestationText 1—N Campaign (texts reusable; each acknowledgment pins the exact id) · LedgerEntry N—1 target entity · JobRecord 1—N ExportArtifact.

## Operations (summary; typed signatures in 07b)

Policies: create, list, get, updateMetadata. Versions: publish (atomic, idempotent), list, get, withdraw. People: list, create, importPeople (Job), update. Segments: list, create, update. Campaigns: create (launch = snapshot + dispatch), update (reminders, extend due window), list, get, cancel. Acknowledgments: list (campaign/person/version scopes), get; acknowledger path: listMyAssignments, getPolicyVersionForReader, recordView, submitAcknowledgment (atomic, idempotent), submitDecline. Ledger: list. Exports: exportEvidencePack (Job), getArtifact. Platform: getSession, listJobs (JobRecord views as Job<T>), getUsage.

## State obligations

- **Versions are immutable once published**: corrections are new versions in the supersedes chain; `withdrawPolicyVersion` changes status with a recorded reason and never deletes bodies. Existing acknowledgments of a superseded version remain valid evidence for the period it governed (03 CP-1; the audit-legacy case in CP-5).
- **Acknowledgments pin permanently**: `policyVersionId`, `attestationTextId`, `localesAttested`, `readEvidence`, `submittedAt`, and the digest are write-once; no field of a recorded acknowledgment or decline is ever mutated. `submitAcknowledgment` is atomic (either exactly one record + one ledger entry exist, or the submit failed — async-contract §4's attestations-class atomicity, declared here).
- **The ledger is append-only**: no entry is edited or deleted, including for corrections — a due-window extension appends a `campaign-extended` entry with before/after values in `detail`; the ledger records its own exports (`export-run`).
- **Assignment snapshots**: campaign launch copies current segment membership into assignments; later segment edits never rewrite an existing campaign's scope (recomputing membership would silently rewrite evidence scope — 03 CP-4 edge). One assignment per person per campaign (dedup at launch, overlap named).
- **People are never hard-deleted**: deactivation preserves identity and every historical acknowledgment; attestations of inactive people remain queryable and exportable (audit honesty).
- **Declines are terminal facts**: a declined assignment may be re-opened only by a new campaign on a new or same version (a fresh ask, honestly dated); the original decline record persists untouched. Declines never trigger notifications to managers-of-managers or any escalation automation (LOOP-10).
- **Draft versions are not evidence**: campaigns may target only `published` versions; publishing requires the governing locale's body and a non-past effective date; superseding marks the prior version `superseded` at the same instant (atomic publish).
- **Partial-result policies**: importPeople delivers prior-good rows + named bad rows; dispatch delivers per-recipient accounting with failed-recipient retry; evidence-pack export delivers per-section partial with per-section retry (async-contract §4). Acknowledgment submit is the declared atomic exception.
- **Digests are computed, never asserted**: body digests and attestation digests are deterministic functions of their inputs (07c declares the exact mock rules); the same state always yields the same digest — the determinism contract the non-AI stance promises.
- **No provider names anywhere**: channels appear as abstract capabilities (08); consent state is per capability class, kind-not-vendor (credential-contract §2).
