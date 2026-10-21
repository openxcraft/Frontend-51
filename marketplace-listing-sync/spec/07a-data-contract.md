# 07a — Data Contract: marketplace-listing-sync

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **conditionally-AI** — exactly one surface, bilingual field-mapping suggestions (`suggestFieldMappings`), may be produced by an abstract mapping-assist capability when a workspace binds one. Every suggestion is draft-by-default and becomes data only through a human resolution (accept / edit-then-accept / reject); the manual mapping editor is the complete v1 path and no core workflow (mapping authoring, compliance checking, publishing, exporting) requires the capability. No AI writes listing content, no AI judges compliance (the checklists are deterministic arithmetic), no AI touches prices or stock levels. TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type LocaleRequirement = 'both-required' | 'en-primary' | 'ar-primary';

// ---- Workspace ----

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction default (bilingual-en: either direction is a full citizen — 05)
  createdAt: string;
  updatedAt: string;
}

// ---- Channels & their rule packs ----

export type ChannelArchetype = 'bilingual-marketplace' | 'global-marketplace' | 'arabic-storefront-platform';

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;                        // seller-given, e.g. "Khaleej main marketplace" — never a vendor binding
  archetype: ChannelArchetype;         // seeds the attribute catalog + rule pack at creation (07c)
  localeRequirement: LocaleRequirement;
  attributeCatalog: ChannelAttribute[];
  rulePack: RulePack;                  // versioned; editable numbers (12 Q-9 — demonstration values, never marketplace truth)
  connectionState: 'manual' | 'capability-bound';  // capability language only (credential-contract §2)
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelAttribute {
  key: string;                         // channel-side identifier, Latin key + bilingual label
  label: string;                       // display label in workspace locale
  required: boolean;
  kind: 'text' | 'long-text' | 'numeric' | 'image-list' | 'enum';
  acceptsLocale: 'none' | 'ar' | 'en' | 'both';   // the pair dimension: which locale variants this attribute can hold
  constraint?: {
    maxLength?: number;                // per-attribute ceiling where the channel declares one
    minItems?: number;                 // image-list minimums
  };
}

export type RuleKind =
  | 'title-length'                     // measured chars vs max, per locale where the attribute acceptsLocale targets one
  | 'description-length'
  | 'bullet-count'                     // bullets count min/max
  | 'bullet-length'                    // per-bullet min/max
  | 'required-attribute'               // mapped value non-empty
  | 'image-count'                      // images >= min
  | 'forbidden-characters'             // title must not contain the set
  | 'bilingual-parity';                // both locale variants non-empty where the channel requires both

export type RuleSeverity = 'blocker' | 'warning';

export interface ComplianceRule {
  id: string;
  kind: RuleKind;
  severity: RuleSeverity;
  params: {                            // per-kind; the editable numbers (CP-3.4)
    max?: number;                      // ceilings (chars, counts)
    min?: number;                      // floors (counts, image minimums)
    chars?: string[];                  // forbidden set
    locale?: Locale;                   // for per-locale ceilings (Arabic titles run longer — 02)
  };
  note?: string;                       // provenance note the owner writes ("channel policy sheet, Mar")
}

export interface RulePack {
  channelId: string;
  version: number;                     // findings pin the version they were computed against
  rules: ComplianceRule[];
  updatedAt: string;
}

// ---- Master catalog ----

export interface BilingualText {
  ar?: string;
  en?: string;                         // absence is honest data — the bilingual-parity rule flags it, never dropped
}

export interface MasterProduct {
  id: string;
  workspaceId: string;
  sku: string;                         // unique per workspace; the shared referent (02)
  title: BilingualText;
  description: BilingualText;
  bullets: BilingualText[];            // paired highlights; per-bullet parity checked by rule
  brand: BilingualText;                // Latin brand marks commonly stay Latin in ar — bidi-isolated at render
  attributes: Record<string, BilingualText>;   // seller-defined attribute keys
  images: { url: string; isMain: boolean }[];
  price: number;                       // plain data carried to listings — NO rules, NO schedules (LOOP-10: price-rule-engine)
  stockLevel: number;                  // plain data; count-verified ingestion is NOT a v1 feature (12 Q-4)
  status: 'active' | 'draft' | 'archived';
  version: number;                     // listings pin the version they were published/checked against
  createdAt: string;
  updatedAt: string;
}

// ---- Field mapping (one per channel, versioned) ----

export type TransformKind =
  | 'none'
  | 'truncate-word-boundary'           // params.maxLength — computed at word boundaries (rtl-rules §4)
  | 'template';                        // params.template — "{brand} {title}" composition over declared fields

export interface MappingRow {
  channelAttributeKey: string;
  source: {
    masterField: 'title' | 'description' | 'bullets' | 'brand' | 'attributes' | 'images' | 'price' | 'stockLevel' | 'sku';
    localeVariant: 'ar' | 'en' | 'none';   // 'none' for numeric/image fields — the pair dimension (00)
    attributeKey?: string;             // when masterField = 'attributes'
    bulletIndex?: number;              // when masterField = 'bullets'
  };
  transform: TransformKind;
  transformParams?: { maxLength?: number; template?: string };
}

export interface FieldMap {
  channelId: string;
  version: number;                     // listings pin the version they were checked against
  rows: MappingRow[];
  updatedAt: string;
}

// ---- Listings ----

export type ListingState =
  | 'draft'                            // created, never checked
  | 'ready'                            // checked: zero open blockers (warnings may stand acknowledged)
  | 'ready-with-warnings'              // checked: zero blockers, >=1 unacknowledged warning
  | 'blocked'                          // checked: >=1 open blocker
  | 'publishing'                       // inside a publish job
  | 'published'
  | 'error'                            // channel rejection recorded
  | 'paused';                          // operator hold — sync updates stop for this listing

export interface ListingOverride {    // per-channel exception — never masquerades as master data (CP-4.5)
  channelAttributeKey: string;
  value: string;                       // rendered with the override mark in the mapped preview
  reason?: string;
}

export interface PublishPin {          // the audit chain: what exact state went out
  masterVersion: number;
  fieldMapVersion: number;
  rulePackVersion: number;
}

export interface ChannelRejection {    // channel-side error surfaced on the listing (CP-4.3)
  code: string;                        // the channel's own code, verbatim
  message: string;                     // the channel's own message, verbatim
  taxonomyCode: 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT' | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';
  at: string;
}

export interface Listing {
  id: string;
  channelId: string;
  masterProductId: string;
  state: ListingState;
  overrides: ListingOverride[];
  checkedAgainst?: PublishPin;         // last check's pins
  publishedAgainst?: PublishPin;       // last successful publish's pins
  stale: boolean;                      // DERIVED: checkedAgainst trails current master/map/pack versions (07c rule 8)
  lastRejection?: ChannelRejection;    // present iff state = 'error'
  createdAt: string;
  updatedAt: string;
}

// ---- Deterministic compliance findings ----

export type FindingState = 'open' | 'resolved';

export interface ComplianceFinding {
  id: string;
  listingId: string;
  channelId: string;
  ruleId: string;
  ruleVersion: number;                 // pin: the rule-pack version this was computed against
  kind: RuleKind;
  severity: RuleSeverity;
  state: FindingState;
  measured: {                          // the arithmetic, always rendered (trader-plain voice — 02)
    locale?: Locale;                   // per-locale rules name their locale
    value: number | string;            // char count / item count / missing key / matched char
    limit?: number | string;
  };
  resolution?: {
    action: 'edit-resolved'            // recomputed by the rule after a data/mapping edit — never hand-set
      | 'rule-change-resolved'         // recomputed after a rule-pack edit — the edit trail carries the rule diff
      | 'acknowledge';                 // warnings only; reason REQUIRED
    reason?: string;                   // required for 'acknowledge'
    actorMemberId: string;
    at: string;
  };
  computedAt: string;
}

export interface ComplianceReport {    // derived aggregate (per channel, or per listing)
  channelId: string;
  listingId?: string;
  findings: { open: { blocker: number; warning: number }; resolved: { blocker: number; warning: number } };
  byRule: { ruleId: string; ruleVersion: number; open: number }[];
  listings: { draft: number; ready: number; readyWithWarnings: number; blocked: number; publishing: number; published: number; error: number; paused: number; stale: number };
  generatedAt: string;
}

// ---- Conditionally-AI mapping suggestions ----

export interface MappingSuggestion {
  id: string;
  channelId: string;
  candidate: MappingRow;               // the proposed row, exactly the shape a human would author
  confidence: number;                  // 0–1, two decimals; formula disclosed (07c rule 3)
  rationale: string;                   // deterministic rationale text (token overlap, catalog constraint match)
  provenance: 'assist-simulated' | 'assist-bound';  // the mock simulates; a binding carries its capability label
  state: 'proposed' | 'accepted' | 'edited-accepted' | 'rejected';
  resolution?: { actorMemberId: string; at: string; editedRow?: MappingRow };
  createdAt: string;
}

// ---- Async jobs, exports, activity, capabilities ----

export type JobKind = 'import' | 'check' | 'publish' | 'export' | 'bulk-update';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: products / listings / rows
  partial?: unknown;                   // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;              // async-contract §5 — double-submit never double-publishes
}

export interface ExportArtifact {
  id: string;
  channelId: string;
  listingIds: string[];
  verdictsCarried: boolean;            // always true in v1 — blocked excluded-and-named, warnings annotated (CP-4.4)
  expiresAt: string;                   // declared retention window at creation
  regenerable: boolean;                // deterministic from listing state — always true in v1
}

export interface ActivityEntry {       // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'channel-created' | 'rule-pack-edited' | 'catalog-imported'
    | 'product-created' | 'product-updated' | 'bulk-updated'
    | 'field-map-saved' | 'suggestion-resolved'
    | 'listing-created' | 'listing-overridden' | 'listing-paused' | 'listing-deleted'
    | 'check-run' | 'finding-acknowledged'
    | 'published' | 'publish-rejected' | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                     // e.g. rule diff summary, publish pin set, acknowledgment reason
  at: string;
}

export interface CapabilityState {     // abstract needs, kind-not-vendor (credential-contract §2)
  kind: 'channel-publish' | 'catalog-intake' | 'mapping-assist' | 'export-delivery';
  state: 'unbound' | 'active' | 'failed' | 'expiring-soon';
}
```

## Relationships

Workspace 1—N Channel · Workspace 1—N MasterProduct · Channel 1—1 FieldMap (versioned) · Channel 1—1 RulePack (versioned) · Channel 1—N Listing · MasterProduct 1—N Listing (one per channel per product; uniqueness on (channelId, masterProductId)) · Listing 1—N ComplianceFinding (each pins ruleVersion; resolved findings keep their resolution history) · MappingSuggestion N—1 Channel (resolution may write a MappingRow through saveFieldMap) · Job spans import/check/publish/export/bulk-update work · ExportArtifact N—1 Channel, N—M Listing · ActivityEntry covers every consequential mutation (P17).

## State obligations

- **Determinism is a contract**: identical (listing inputs = master version + field map version + rule pack version + overrides) always yields identical findings and the same readiness verdict; findings are never hand-created — `edit-resolved` and `rule-change-resolved` transitions are recomputed by the rule; only `acknowledge` records a human decision, warnings only, reason required.
- **Pin discipline**: ComplianceFinding pins `ruleVersion`; Listing pins `checkedAgainst` (check time) and `publishedAgainst` (publish time); rule-pack edits and mapping saves never retroactively mutate computed findings — the next check uses the new versions and stale-marked listings surface the drift (audit honesty).
- **Staleness is derived, never stored-and-forgotten**: `stale` recomputes from the pin comparison on every read (07c rule 8); a listing whose master is deleted goes to a final decision state (unpublish-or-archive offered, never auto-delete).
- **Publish is pin-gated**: publishListings refuses blocked and stale listings per listing (skipped-and-named, never batch-aborted); successful publish writes the pin triple; error listings keep `lastRejection` verbatim with the taxonomy mapping.
- **The mapping is free, readiness is honest**: a field map may leave required attributes unmapped (the seller's choice at mapping time); the checklist then flags the resulting listings — mapping freedom never silently fabricates readiness.
- **Suggestions never write**: a MappingSuggestion becomes a MappingRow only through resolveMappingSuggestion → the accepted row lands in the DRAFT field map which still requires saveFieldMap (double-gated human confirmation, P15).
- **Partial-result policies** (async-contract §4): import delivers rows-so-far + named bad blocks; check is per-listing re-runnable; publish delivers per-listing outcomes with per-listing retry on the un-attempted remainder; export delivers the file or a typed failure (single artifact — no partial file).
- **No provider names anywhere** — channels are archetypes + seller-given names; capabilities are kinds (08); the only vendor-adjacent strings live in 01/02/13 market citations.
