// VERBATIM from specs-source/marketplace-listing-sync/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (MappingRow, RulePack,
// Listing, ComplianceFinding, ComplianceReport, PublishPin, ChannelRejection —
// and their fields) are declared canonically in 07a and are part of this
// contract by reference; 07b declares only the operational wrappers (summaries,
// views, jobs, suggestion states) its signatures need. AI DECLARATION
// (ai-native-patterns §1): this adapter is CONDITIONALLY-AI — exactly one
// operation (suggestFieldMappings) may invoke an abstract mapping-assist
// capability; every other operation is deterministic data work, and the
// suggestion surface degrades to the manual mapping editor (a UI state, not a
// contract hole) when the capability is unbound or fails.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed import blocks, mapping collisions, transform misuse, rule-pack param sanity, bulk row errors)
 * 'NOT_FOUND'    -> NotFoundError     (stale channel/listing/product/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (capability consent, workspace scoping, viewer-role mutations)
 * 'CONFLICT'     -> ConflictError     (concurrent master/mapping/rule-pack/listing edits, double-resolved findings)
 * 'RATE_LIMIT'   -> RateLimitError    (compliance check runs, publish batches, export files, assist suggestions)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, publish/export delivery)
 * 'UNKNOWN'      -> UnknownError      (unmappable channel rejection codes, typed retry, correlationId)
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
  role: 'owner' | 'manager' | 'viewer';  // viewer: read boards/findings/exports only, zero mutations (02 Noura)
  locale: 'ar' | 'en';                    // chrome direction; content fields follow their own locales (05)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export type Locale = 'ar' | 'en';

export interface ChannelSummary {
  id: string;
  name: string;
  archetype: 'bilingual-marketplace' | 'global-marketplace' | 'arabic-storefront-platform';
  localeRequirement: 'both-required' | 'en-primary' | 'ar-primary';
  connectionState: 'manual' | 'capability-bound';
  rulePackVersion: number;
  fieldMapVersion: number;
  listings: { total: number; ready: number; blocked: number; stale: number; error: number };
  updatedAt: string;
}

export interface ChannelTemplate {
  archetype: ChannelSummary['archetype'];
  label: string;
  localeRequirement: ChannelSummary['localeRequirement'];
  attributeCatalogPreview: { key: string; required: boolean; acceptsLocale: 'none' | 'ar' | 'en' | 'both' }[];
  seededRules: { kind: string; severity: 'blocker' | 'warning'; paramSummary: string }[];  // every number editable (12 Q-9)
}

export interface ChannelView extends ChannelSummary {
  attributeCatalog: ChannelAttribute[];
  rulePack: RulePack;
}

export interface MasterProductRow {          // catalog rows (virtualized above 200 — P19)
  id: string;
  sku: string;
  titleExcerpt: { ar?: string; en?: string }; // bidi-isolated at render (rtl-rules §2)
  imageCount: number;
  price: number;
  stockLevel: number;
  status: 'active' | 'draft' | 'archived';
  listingCoverage: number;                   // channels this product is listed on
  version: number;
  updatedAt: string;
}

export interface MasterProductView extends MasterProduct {
  listings: { listingId: string; channelId: string; state: ListingState; stale: boolean }[];
}

export interface FieldMapView extends FieldMap {
  diagnostics: {
    unmappedRequiredAttributes: string[];    // mapping freedom, readiness honesty (07a state obligation)
    collisionRows: string[];                 // would-be collisions — save-time VALIDATION sources
  };
}

export interface SuggestionResult {
  suggestions: MappingSuggestion[];           // 07a shape — draft-by-default, confidence disclosed
  provenance: 'assist-simulated' | 'assist-bound';
  formulaNote: string;                        // the deterministic confidence formula, disclosed (07c rule 3)
}

export interface ListingRow {
  id: string;
  channelId: string;
  channelName: string;
  masterProductId: string;
  sku: string;
  state: ListingState;
  stale: boolean;
  openFindings: { blocker: number; warning: number };
  lastRejectionCode?: string;                 // the channel's own code, verbatim (CP-4.3)
  updatedAt: string;
}

export interface ListingView {
  listing: Listing;
  master: { id: string; sku: string; version: number; title: BilingualText };
  mappedPreview: { channelAttributeKey: string; value: string; locale?: Locale; transformApplied: string; overridden: boolean }[];
  checklist: ComplianceFinding[];             // all rules for this listing, pass rows included
  publishHistory: { at: string; pins: PublishPin; outcome: 'published' | 'rejected'; rejection?: ChannelRejection }[];
}

export interface CheckJobResult {
  channelId: string;
  listingsChecked: number;
  findings: { open: { blocker: number; warning: number }; resolved: { blocker: number; warning: number } };
  mode: 'deterministic';                      // non-AI declaration made explicit in every result
}

export interface PublishJobResult {
  channelId: string;
  published: { listingId: string; pins: PublishPin }[];
  rejected: { listingId: string; rejection: ChannelRejection }[];   // channel-side, taxonomy-mapped, message verbatim
  skipped: { listingId: string; reason: 'blocked' | 'stale' | 'paused' | 'not-ready' }[];   // never silently included
}

export interface ImportJobResult {
  productsCreated: number;
  productsUpdated: number;                    // SKU-collision merge per declared policy
  invalidBlocks: string[];                    // named bad blocks — partial policy (async-contract §4)
  bilingualGaps: number;                      // products missing a locale variant — flagged at check, never dropped
}

export interface BulkUpdateResult {
  rowsAffected: number;
  staleListings: number;                      // only mapped-dependency changes stale (07c rule 8)
  rowErrors: { sku: string; reason: string }[];
}

export interface Job<T> {                     // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'import' | 'check' | 'publish' | 'export' | 'bulk-update';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                     // async-contract §5
  channelId?: string;                         // link-to-context for the jobs console (04 S10)
}

// ---- Contract ----

export interface MarketplaceListingAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;
  listCapabilities(): Promise<Result<{ capabilities: CapabilityState[] }, AdapterError>>;

  // channels (archetypes seed catalog + rule pack; numbers editable — 12 Q-9)
  listChannelTemplates(query: {
    filter?: { archetype?: ChannelSummary['archetype'][] };
  }): Promise<Result<{ templates: ChannelTemplate[] }, AdapterError>>;
  createChannel(input: {
    name: string;
    archetype: ChannelSummary['archetype'];   // seeds attributeCatalog + rulePack (07c seeds)
    localeRequirement: ChannelSummary['localeRequirement'];
  }): Promise<Result<ChannelSummary, AdapterError>>;
  listChannels(query: {
    filter?: { archetype?: ChannelSummary['archetype'][]; connectionState?: ('manual' | 'capability-bound')[] };
    search?: string;                          // normalized bilingual search (rtl-rules §4)
    sort: 'updatedAt' | 'name' | 'readiness';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ChannelSummary>, AdapterError>>;
  getChannel(id: string): Promise<Result<ChannelView, AdapterError>>;
  updateChannel(id: string, patch: {
    name?: string;
    localeRequirement?: ChannelSummary['localeRequirement'];
    rulePack?: RulePack;                      // edit re-versions the pack; findings recompute declared (CP-3.4)
    baseVersion: number;                      // stale -> CONFLICT with both payloads
  }): Promise<Result<ChannelView, AdapterError>>;

  // master catalog (paste = the LOOP-5 always-available path; capability path consent-gated — 08 N2)
  importCatalog(input: {
    source: 'paste' | 'file-upload' | 'catalog-intake-capability';
    content?: string;                         // paste payload: one block per product (07c format)
    capabilityRef?: string;                   // catalog-intake path only; consent enforced server-side
    idempotencyKey: string;                   // async-contract §5
  }): Promise<Result<Job<ImportJobResult>, AdapterError>>;
  listMasterProducts(query: {
    filter?: { status?: ('active' | 'draft' | 'archived')[]; listingCoverage?: 'listed' | 'unlisted' };
    search?: string;                          // normalized bilingual match inside titles/brand/SKU
    sort: 'updatedAt' | 'sku' | 'title';
    cursor?: string; limit: number;           // virtualized surface: cursor pages <= 100
  }): Promise<Result<Page<MasterProductRow>, AdapterError>>;
  getMasterProduct(id: string): Promise<Result<MasterProductView, AdapterError>>;
  createMasterProduct(input: {
    sku: string;
    title: BilingualText;
    description?: BilingualText;
    bullets?: BilingualText[];
    brand?: BilingualText;
    attributes?: Record<string, BilingualText>;
    images?: { url: string; isMain: boolean }[];
    price: number;
    stockLevel: number;
  }): Promise<Result<MasterProductView, AdapterError>>;
  updateMasterProduct(id: string, patch: {
    title?: BilingualText;
    description?: BilingualText;
    bullets?: BilingualText[];
    brand?: BilingualText;
    attributes?: Record<string, BilingualText>;
    images?: { url: string; isMain: boolean }[];
    price?: number;                           // plain data carry — price RULES are price-rule-engine's (LOOP-10)
    stockLevel?: number;                      // count-verified ingestion NOT a v1 feature (12 Q-4)
    status?: 'active' | 'draft' | 'archived';
    baseVersion: number;                      // stale -> CONFLICT with both payloads
  }): Promise<Result<MasterProductView, AdapterError>>;
  bulkUpdateMasterFields(input: {
    field: 'price' | 'stockLevel';
    updates: { productId: string; value: number }[];
    idempotencyKey: string;
  }): Promise<Result<Job<BulkUpdateResult>, AdapterError>>;

  // field mapping (the unique object) + the conditionally-AI suggestion surface
  getFieldMap(channelId: string): Promise<Result<FieldMapView, AdapterError>>;
  saveFieldMap(channelId: string, input: {
    rows: MappingRow[];
    baseVersion: number;                      // stale -> CONFLICT with both payloads; save re-versions + re-stales listings
  }): Promise<Result<FieldMapView, AdapterError>>;
  suggestFieldMappings(input: {
    channelId: string;
    scope?: { unmappedAttributeKeys?: string[] };   // default: all unmapped required attributes
  }): Promise<Result<SuggestionResult, AdapterError>>;
  // ^ requires the mapping-assist capability (08 N3): unbound -> PERMISSION naming the
  // capability class with the manual editor offered inline; rate-limited ->
  // RATE_LIMIT with the ladder copy. The manual editor is the FULL v1 path (00 stance).
  resolveMappingSuggestion(input: {
    suggestionId: string;
    decision: 'accept' | 'edited-accept' | 'reject';
    editedRow?: MappingRow;                   // required for 'edited-accept'
  }): Promise<Result<MappingSuggestion, AdapterError>>;
  // ^ resolution stages the row into the DRAFT field map; saveFieldMap remains the
  // only write path to a live mapping (double-gated human confirmation, P15).

  // deterministic compliance check (non-AI: rules per 07c)
  runComplianceCheck(input: {
    channelId: string;
    listingIds?: string[];                    // omitted = all listings on the channel; stale-scoped per CP-5.3
    idempotencyKey: string;
  }): Promise<Result<Job<CheckJobResult>, AdapterError>>;
  getComplianceReport(query: { channelId: string; listingId?: string }): Promise<Result<ComplianceReport, AdapterError>>;
  listComplianceFindings(query: {
    channelId?: string;
    listingId?: string;
    filter?: { kind?: string[]; severity?: ('blocker' | 'warning')[]; state?: ('open' | 'resolved')[] };
    sort: 'severity' | 'computedAt' | 'sku';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ComplianceFinding>, AdapterError>>;
  resolveComplianceFinding(input: {
    findingId: string;
    action: 'acknowledge';                    // warnings only — blockers resolve by data or rule change (CP-3 edge)
    reason: string;                           // REQUIRED
  }): Promise<Result<ComplianceFinding, AdapterError>>;

  // listings
  createListing(input: {
    channelId: string;
    masterProductId: string;
  }): Promise<Result<ListingView, AdapterError>>;
  bulkCreateListings(input: {
    channelId: string;
    filter: { masterProductIds?: string[]; status?: 'active' };   // board's one-action scale path (03)
    confirmCount: number;                     // UI echoes the counted set (P04/P07 — the adapter verifies)
  }): Promise<Result<{ created: number; skipped: { productId: string; reason: 'already-listed' | 'archived' }[] }, AdapterError>>;
  listListings(query: {
    channelId?: string;                       // omitted = all channels (the board's cross-channel view)
    filter?: { state?: ListingState[]; stale?: boolean; openBlockers?: boolean };
    search?: string;                          // normalized SKU/title match
    sort: 'updatedAt' | 'state' | 'sku';
    cursor?: string; limit: number;           // virtualized surface: cursor pages <= 100
  }): Promise<Result<Page<ListingRow>, AdapterError>>;
  getListing(id: string): Promise<Result<ListingView, AdapterError>>;
  updateListing(id: string, patch: {
    overrides?: ListingOverride[];            // per-channel exceptions — rendered with the override mark (CP-4.5)
    baseUpdatedAt: string;                    // stale -> CONFLICT with both payloads
  }): Promise<Result<ListingView, AdapterError>>;
  setListingPaused(id: string, paused: boolean, reason?: string): Promise<Result<ListingRow, AdapterError>>;
  deleteListing(input: {
    listingId: string;
    confirm: { publishedCount: number };      // P04 level-2: UI names the listing + its publish history (11 C)
  }): Promise<Result<{ deletedListingId: string }, AdapterError>>;

  // publish & export (the handoff gate — CP-4)
  publishListings(input: {
    channelId: string;
    listingIds?: string[];                    // omitted = all ready listings on the channel
    idempotencyKey: string;                   // per batch — double-submit never double-publishes
  }): Promise<Result<Job<PublishJobResult>, AdapterError>>;
  // ^ requires the channel-publish capability (08 N1): unbound -> PERMISSION naming
  // the capability class with the export path offered inline (the LOOP-5 manual path).
  // Blocked/stale/paused listings are skipped-and-named, never batch-aborted (07b rule 6).
  exportChannelFile(input: {
    channelId: string;
    listingIds?: string[];                    // omitted = all ready + ready-with-warnings listings
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifactId: string; expiresAt: string; listingCount: number; excludedBlocked: number }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    listingCount: number;
    verdictsCarried: boolean;
  }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; channelId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    complianceChecks: number;
    publishBatches: number;
    exportFiles: number;
    assistSuggestions: number;
    resetAt: string;
  }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
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

