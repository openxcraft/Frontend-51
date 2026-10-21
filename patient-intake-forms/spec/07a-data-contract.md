# 07a — Data Contract: patient-intake-forms

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — the product's core is deterministic (orthographic normalization + dictionary lookup against workspace vocabulary, arithmetic gates, state machines); exactly one capability — the vocabulary-normalization assist that resolves dialectal paraphrases the dictionary misses — MAY be enriched by an abstract model capability when a workspace binds one (08 N1). Unbound, that capability contributes nothing and every workflow completes. Assist output is draft-by-default and enters canonical state ONLY through a human confirmation (P15, `resolveSymptomMatch`). No operation returns an assessment, score, triage, or diagnosis — the exclusion is typed into the contract (07b rule 4). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type BilingualText = { ar: string; en: string };      // BOTH required wherever it appears — the publish gate enforces this at form level

// ---- Workspace (the clinic) ----

export interface Workspace {
  id: string;
  name: BilingualText;                              // clinic name renders bilingually (attestation, exports)
  defaultLocale: Locale;                             // console chrome default (either direction is a full citizen — 05)
  policies: {
    fillTokenExpiryHours: number;                    // default 72; kiosk sessions shorter (07c rule 7)
    retentionDays: number;                           // default 90 post-resolution; owner-configurable (12 Q-11)
  };
  createdAt: string;
  updatedAt: string;
}

// ---- Intake form authoring ----

export type FormStatus = 'draft' | 'active' | 'archived';

export type FieldKind =
  | 'short-text' | 'long-text' | 'select-one' | 'select-many'
  | 'date' | 'number' | 'pain-scale'                // 0–10 fixed scale, Western numerals
  | 'contact'                                        // phone/email with autocomplete tokens (a11y-baseline §5)
  | 'consent'                                        // attestation line + explicit agree control
  | 'symptom';                                       // binds the vocabulary — the signature field

export interface FieldOption {
  id: string;
  label: BilingualText;                              // BOTH locales required (publish gate)
}

export interface FormField {
  id: string;
  sectionId: string;
  kind: FieldKind;
  label: BilingualText;                              // persistent label — placeholders are structurally absent (05/06)
  helpText?: BilingualText;                          // plain-MSA reading register on the ar side (02)
  required: boolean;                                 // programmatic, not asterisk-decorative (a11y-baseline §5)
  options?: FieldOption[];                           // select-one / select-many
  symptomField?: {
    vocabularyId: string;                            // the bound vocabulary scope
    allowMultiple: boolean;
    allowFreeText: boolean;                          // unmatched text kept verbatim when true
  };
  order: number;
}

export interface FormSection {
  id: string;
  title: BilingualText;
  order: number;
}

export interface IntakeForm {
  id: string;
  workspaceId: string;
  title: BilingualText;
  visitType: 'new-patient' | 'follow-up' | 'procedure' | 'other';
  status: FormStatus;
  version: number;                                   // drafts bump on save; publish pins a version
  sections: FormSection[];
  fields: FormField[];
  counts: {                                          // derived at read — never authoritative storage
    submissions: number;
    inProgress: number;
    flagged: number;
    pendingConfirmation: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FormVersion {                       // the version pin submissions answer on
  formId: string;
  version: number;
  publishedAt: string;
  snapshot: Pick<IntakeForm, 'sections' | 'fields' | 'title' | 'visitType'>;
}

// ---- Symptom vocabulary (the clinic's linguistic asset) ----

export type DialectTag = 'gulf' | 'levantine' | 'egyptian' | 'msa-adjacent' | 'unlabeled';
export type TermStatus = 'active' | 'deprecated';

export interface SymptomTerm {
  id: string;
  vocabularyId: string;
  canonical: BilingualText;                          // صداع / headache — BOTH required
  variants: { text: string; locale: Locale; dialect?: DialectTag }[];   // colloquial/dialectal phrasings
  bodySystem?: string;                               // organizing tag only — NEVER used for inference (06)
  urgentAttention: boolean;                          // clinic-owned clinical policy: matched term surfaces a red flag
  provenance: 'seeded-spec' | 'clinic-authored';     // trust-as-receipts (05 integration record)
  note?: string;                                     // reviewer-facing "why"
  status: TermStatus;
  version: number;                                   // matches pin the version they were computed against
  createdAt: string;
  updatedAt: string;
}

// ---- Fill sessions & submissions ----

export type FillChannel = 'link' | 'kiosk' | 'printed-qr';

export interface FillSession {
  id: string;
  formId: string;
  formVersion?: number;                              // pinned at first answer; unbound until then
  channel: FillChannel;
  token: string;                                     // opaque; carries NO PHI (09) — not a patient identifier
  state: 'open' | 'submitted' | 'expired';
  expiresAt: string;                                 // declared window honored (11 copy)
  openedByMemberId?: string;                         // staff creator (kiosk pre-fill attribution)
  prefill?: { name?: string; dateOfBirth?: string };// kiosk basics ONLY — clinical answers are never prefilled (P11 scoping)
  createdAt: string;
}

export type SubmissionState =
  | 'in-progress'    // draft exists under an open fill session
  | 'submitted'      // attested by the patient (or staff-authored, attribution recorded)
  | 'flagged'        // staff escalated an urgent flag
  | 'reviewed'       // review gate passed (zero pending confirmations)
  | 'exported';      // package generated (state, not a lock — re-export allowed)

export interface Submission {
  id: string;
  workspaceId: string;
  formId: string;
  formVersion: number;                               // the pinned published version
  fillSessionId?: string;                            // staff-authored submissions carry none
  authoredBy?: 'patient' | 'staff';                  // the honest paper path (08) — attribution is explicit
  authoredByMemberId?: string;                       // when 'staff'
  patient: {
    displayName?: string;                            // what the patient/prefill provided — a convenience label, not an identity system
    locale: Locale;                                  // the locale she answered in
  };
  answers: SubmissionAnswer[];                       // one per answered field; unanswered requireds block submit
  symptomEntries: SymptomEntry[];
  state: SubmissionState;
  flags: UrgentFlag[];                               // derived from matched urgentAttention terms (07c rule 4)
  retentionExpiresAt?: string;                       // set at terminal transition, per workspace policy
  submittedAt?: string;
  revision: number;                                  // CONFLICT base for staff-side writes
  createdAt: string;
  updatedAt: string;
}

export type SubmissionAnswer =
  | { fieldId: string; kind: 'short-text' | 'long-text'; value: string }          // verbatim; bidi-isolated at render
  | { fieldId: string; kind: 'select-one'; optionId: string }
  | { fieldId: string; kind: 'select-many'; optionIds: string[] }
  | { fieldId: string; kind: 'date'; value: string }                              // ISO; display per locale + dual-calendar option
  | { fieldId: string; kind: 'number'; value: number }
  | { fieldId: string; kind: 'pain-scale'; value: number }                        // 0–10, Western numerals
  | { fieldId: string; kind: 'contact'; value: { phone?: string; email?: string } }
  | { fieldId: string; kind: 'consent'; attested: boolean; attestedAt?: string };

// ---- Symptom normalization (deterministic core + assist layer) ----

export type MatchMode =
  | 'exact'          // raw string equals a canonical/variant — dictionary
  | 'normalized'     // equal after the fixed orthographic pipeline (07c rule 1) — dictionary
  | 'assist'         // proposed by the bound normalization capability — DRAFT until confirmed (P15)
  | 'unmatched';     // kept verbatim, flagged for staff — never silently coerced

export interface SymptomEntry {
  id: string;
  submissionId: string;
  fieldId: string;
  rawText: string;                                   // IMMUTABLE — the patient's words (bidi-isolated at render)
  locale: Locale;                                    // the entry's dominant script/direction
  matchedTermId?: string;
  matchedTermVersion?: number;                       // pin — audit honesty (term edits never mutate past matches)
  matchMode: MatchMode;
  matchedSpan?: { start: number; end: number };      // offsets into rawText
  confirmation?: {                                   // present iff matchMode was 'assist' or remapped by staff
    state: 'pending' | 'confirmed' | 'corrected';
    resolvedByMemberId?: string;
    correctedToTermId?: string;                      // 'corrected': the mapping changed; rawText unchanged
    at?: string;
  };
  computedAt: string;
}

export interface UrgentFlag {
  submissionId: string;
  termId: string;
  termVersion: number;
  canonical: BilingualText;                          // rendered pair — never the raw answer text (PHI discipline, 09)
  escalated: boolean;                                // staff acted on it or not
  escalatedByMemberId?: string;
  escalatedAt?: string;
  note?: string;
}

// ---- Review, activity, jobs, artifacts ----

export interface ReviewRecord {
  submissionId: string;
  state: 'reviewed' | 'un-reviewed';                 // un-review is an explicit logged action, never silent
  actorMemberId: string;
  note?: string;
  at: string;
}

export interface ActivityEntry {                     // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId?: string;                            // patient-originated entries carry none (token-scoped)
  actorKind: 'staff' | 'patient' | 'system';
  action:
    | 'form-created' | 'form-published' | 'form-archived' | 'form-duplicated'
    | 'fill-session-opened' | 'submission-resumed'
    | 'submission-submitted' | 'submission-staff-authored'
    | 'match-confirmed' | 'match-corrected' | 'term-saved' | 'term-deleted'
    | 'flag-raised' | 'flag-escalated' | 'submission-reviewed' | 'submission-un-reviewed'
    | 'export-run' | 'consent-change' | 'policy-change';
  targetRef: string;
  detail?: string;                                   // counts and states ONLY — no PHI in log details (09)
  at: string;
}

export type JobKind = 'vocabulary-import' | 'intake-export';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: rows / formats
  partial?: unknown;                                 // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                            // async-contract §5
  createdAt: string;
}

export type ExportFormat = 'intake-record-pdf' | 'answers-csv' | 'normalization-annex';

export interface ExportArtifact {
  id: string;
  submissionIds: string[];                           // single or bulk (P07)
  formats: ExportFormat[];
  expiresAt: string;                                 // declared retention window at creation (7 days, 07c)
  regenerable: boolean;                              // deterministic from submission state — always true in v1
  createdAt: string;
}
```

## Relationships

Workspace 1—N IntakeForm · Workspace 1—1 SymptomVocabulary 1—N SymptomTerm (versioned) · IntakeForm 1—N FormVersion (published pins) · IntakeForm 1—N FillSession · FillSession 1—0..1 Submission (staff-authored submissions have none) · Submission N—1 FormVersion (pinned) · Submission 1—N SubmissionAnswer (per field) · Submission 1—N SymptomEntry (raw immutable; N—1 SymptomTerm-at-version when matched) · Submission 1—N UrgentFlag (N—1 SymptomTerm) · Submission 1—N ReviewRecord · Submission 1—N ExportArtifact (via export jobs) · Job spans vocabulary-import / intake-export work · ActivityEntry spans everything (actor-attributed).

## State obligations (lifecycle invariants)

- **The publish gate is contract law**: a form reaches `active` only with every label, help text, option, and attestation present in BOTH locales, ≥1 consent field, ≤10 sections, ≤120 fields (07c rule 6). Half-translated forms cannot ship — the bilingual discipline is structural, not editorial.
- **Version pinning**: submissions pin `formVersion` at first answer; edits/publishes create new versions and never mutate an in-flight or past submission's rendering. Symptom entries pin `matchedTermVersion`; term edits never mutate past matches — the next normalization run uses the new version.
- **Raw text is immutable**: `SymptomEntry.rawText` never changes after creation; corrections change the MAPPING (`correctedToTermId`), never the patient's words. `unmatched` entries never silently coerce.
- **Assist is draft-by-default (P15)**: `matchMode: 'assist'` entries carry `confirmation.state: 'pending'` and are invisible to the review gate until confirmed or corrected; the review gate (`reviewed` transition) requires zero pending confirmations.
- **Urgent flags are derived + counted**: flags derive from matched terms with `urgentAttention: true` (07c rule 4) — the system counts clinic-configured vocabulary, it never grades severity; escalation is a staff action with attribution.
- **Submit is idempotent and attested**: `submitIntake` requires required-field completeness (VALIDATION listing labels, never values), records the consent answer's attestation, invalidates kiosk tokens, and double-submits return the original submission (idempotency key).
- **Retention honesty**: terminal-state submissions carry `retentionExpiresAt` per workspace policy; expiry sweeps mark records expired (07c rule 7) — deletion is a declared policy event, logged, never silent decay.
- **PHI posture (typed, not aspirational)**: fill tokens are opaque non-identifiers; `prefill` carries basics only; ActivityEntry `detail` carries counts/states only; no entity stores a chart, a longitudinal history, or anything beyond one submission's scope (LOOP-10: the artifact is the intake record).
- **Partial-result policies** (async-contract §4): vocabulary import delivers valid rows + named invalid rows; export delivers per-format partial with per-format retry.
- **No provider names anywhere** — channels/capabilities appear as types and abstract needs in 08.
