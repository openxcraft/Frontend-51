# 07b — Adapter Contract: marketplace-listing-sync (TypeScript, v1)

SME-G pass · `MarketplaceListingAdapterV1` · 33 operations. Full 7-class error taxonomy, typed pagination, auth-agnostic session, idempotency keys, partial-result policies. **Types only — no implementation.** Entity semantics (Workspace, Channel, ChannelAttribute, ComplianceRule, RulePack, MasterProduct, BilingualText, MappingRow, FieldMap, Listing, ListingOverride, PublishPin, ChannelRejection, ComplianceFinding, ComplianceReport, MappingSuggestion, Job, ExportArtifact, ActivityEntry, CapabilityState): 07a. Every operation traces to ≥1 flow (03 coverage table — 33 operations, 0 orphans).

```ts
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
```

## Rules

1. **Determinism contract**: `runComplianceCheck` and every recompute inside `updateMasterProduct`/`updateListing`/`saveFieldMap`/`updateChannel` implement exactly the rules specified in 07c — identical listing inputs (master version + field map version + rule pack version + overrides) yield identical findings and the same readiness verdict. Every check result carries `mode: 'deterministic'`. No finding is created or closed by hand: `edit-resolved`/`rule-change-resolved` transitions are recomputed; only `acknowledge` records a human decision (warnings only, reason required).
2. **Pin discipline**: findings pin `ruleVersion`; listings pin `checkedAgainst` and `publishedAgainst` (the triple: master/map/pack). Rule-pack edits and mapping saves never retroactively mutate computed findings — drift surfaces as derived staleness, and the next check uses the new versions.
3. **Stale-version semantics**: `updateChannel` (baseVersion), `updateMasterProduct` (baseVersion), `saveFieldMap` (baseVersion), `updateListing` (baseUpdatedAt) → CONFLICT with both payloads in `details`. `bulkCreateListings` verifies `confirmCount` against the live filtered set; drift → CONFLICT with the recounted set (never a partial silent apply).
4. **Viewer role**: every mutation operation (channel/rule-pack edits, catalog writes, mapping saves, suggestion resolutions, finding acknowledgments, listing mutations, publish, export) → PERMISSION naming the seat's capability in capability language; reads and artifact retrieval remain open to the viewer seat (02 Noura).
5. **Consent enforcement**: `importCatalog` with `source: 'catalog-intake-capability'` without a granted catalog-intake consent → PERMISSION naming the capability class (credential-contract §4) — never a vendor; `publishListings` without a bound channel-publish capability → PERMISSION with the export path offered inline; `suggestFieldMappings` without the mapping-assist capability → PERMISSION with the manual editor offered inline. Paste, export-file, and manual mapping paths have no consent requirement, ever (LOOP-5).
6. **Publish gate and partial policy**: `publishListings` refuses blocked/stale/paused listings per listing — skipped-and-named in `PublishJobResult.skipped`, the batch proceeds (async-contract §4); channel-side rejections land per listing as `ChannelRejection` with the channel's code and message verbatim, taxonomy-mapped (unmappable → UNKNOWN with the verbatim message preserved — never a fabricated translation); idempotent re-submit returns the original job.
7. **Suggestion discipline (conditionally-AI)**: `suggestFieldMappings` output is draft-only — `resolveMappingSuggestion` stages the row into the draft map and `saveFieldMap` is the only write path to a live mapping (double-gated, P15); confidence and its formula are disclosed in every result (`formulaNote`); the capability's state is visible via `listCapabilities` so the UI never renders a magic surface without provenance.
8. **Bulk honesty**: `bulkUpdateMasterFields` touches only the declared field; listings stale iff the field map maps that field (07c rule 8 — computed from the mapping, never blanket-staled); per-row errors are named and valid rows proceed (partial policy).
9. **Recompute honesty**: `updateMasterProduct` and `updateListing` return the recomputed `ListingView` set or an explicit `staleListings` count — the UI renders what the adapter computed, never an assumption; mapping saves re-stale dependents with the count in the response.
10. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (33/33).
