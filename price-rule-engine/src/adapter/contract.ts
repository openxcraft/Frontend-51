// VERBATIM from specs-source/price-rule-engine/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (PricingRule, RuleAction,
// SimulationScope, SimulationRow, FormulaStep, PriceProposal, ProposalRow,
// ApprovalRecord — and their fields) are declared canonically in 07a and are part
// of this contract by reference; 07b declares only the operational wrappers
// (summaries, views, job payloads) its signatures need. This product is DECLARED
// NON-AI (ai-native-patterns §1): no operation invokes any AI capability, and the
// deterministic pipeline (rebase/compound actions → ending round → floor clamp →
// VAT display) specified exactly in 07c is the whole of the pricing engine.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (malformed import rows, scope/price sanity, priority collisions,
 *                                      empty rule conditions, submission gate attempts, empty simulation scope)
 * 'NOT_FOUND'    -> NotFoundError     (stale item/rule/simulation/proposal/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (viewer/editor-role mutations, non-approver approvals, capability consent)
 * 'CONFLICT'     -> ConflictError     (concurrent rule/item/workspace/proposal edits, stale approvals,
 *                                      concurrent proposal review)
 * 'RATE_LIMIT'   -> RateLimitError    (simulation runs, export packages)
 * 'NETWORK'      -> NetworkError      (list fetches, job polling, artifact delivery)
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
  role: 'owner' | 'editor' | 'approver' | 'viewer';   // viewer: read-only (Salem's seat); approver: read + approval
  locale: 'ar' | 'en';                    // chrome direction; item names render at their own direction per row (05)
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Operational wrappers (entity fields per 07a) ----

export interface CatalogItemRow {         // table rows (virtualized above 200 — P19)
  id: string;
  sku: string;                            // bidi-isolated at render (rtl-rules §2)
  nameEn: string;
  nameAr?: string;                        // renders at own direction in the names column (05)
  categoryId: string;
  marketCode: 'KSA' | 'UAE' | 'OTHER';
  channel: string;
  currentNetPrice: number;                // canonical minor units, net of VAT
  displayPrice?: number;                  // VAT-inclusive per market (derived at read)
  landedCost?: number;                    // active cost basis; absent = no cost record yet
  marginPermille?: number;                // absent when no cost record (never faked, 03 CP-1.3)
  belowFloor: boolean;                    // live catalog warning (07a invariant)
  updatedAt: string;
}

export interface CatalogItemView extends CatalogItemRow {
  version: number;                        // optimistic concurrency for manual edits
  floorOverride?: { absoluteFloorNet: number };
  costBasis?: { landedCost: number; costRecordId: string; effectiveFrom: string };
  appliedRuleTrace: { simulationId: string; steps: FormulaStep[] } | null;   // last simulation's trace for this item
  priceHistoryCount: number;
}

export interface RuleSummary {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused';
  priority: number;
  validFrom?: string;
  validTo?: string;
  conditionSummary: string;               // rendered scope sentence ("category = Kitchen AND market = KSA")
  actionSummary: string;                  // rendered action chain ("target margin 38% → round whole-unit")
  inertByTime: boolean;                   // window has passed (console badge, 03 CP-2 edge)
  version: number;
  updatedAt: string;
}

export interface RuleView extends RuleSummary {
  conditions: import('./07a').RuleCondition[];
  actions: import('./07a').RuleAction[];
  note?: string;
  revisions: { version: number; actorMemberId: string; at: string; changeNote?: string }[];
}

export interface ImportJobResult {
  kind: 'catalog' | 'cost-sheet';
  imported?: number;                      // items upserted / cost records appended
  skippedNoCost?: number;                 // catalog rows imported without a cost column value
  invalidRows?: string[];                 // named bad rows — partial policy (async-contract §4)
  unmatchedSkus?: string[];               // cost-sheet rows naming SKUs not in the catalog
}

export interface SimulationJobResult {
  simulationId: string;
  summary: import('./07a').SimulationSummary;
  mode: 'deterministic';                  // non-AI declaration made explicit in every result
}

export interface SimulationRowPageItem extends SimulationRow {
  // full row shape per 07a (trace included) — the table virtualizes pages of these
  reviewedInProposal?: { proposalId: string; state: 'included' | 'excluded' };  // join for review-state badges
}

export interface ProposalSummary {
  id: string;
  name: string;
  simulationId: string;
  status: 'draft' | 'in-review' | 'approved' | 'withdrawn';
  counts: { included: number; excluded: number; unreviewed: number };
  gate: PriceProposal['gate'];            // derived live from row states (07a)
  updatedAt: string;
}

export interface ProposalView extends ProposalSummary {
  note?: string;
  version: number;                        // optimistic concurrency for review edits
  approval?: import('./07a').ApprovalRecord;
  simulationRef: { simulationId: string; name: string; costSnapshotAsOf: string };
}

export interface Job<T> {                 // 07a Job entity with its result channel typed per kind
  id: string;
  kind: 'import' | 'simulation' | 'export';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
  idempotencyKey: string;                 // async-contract §5
  refId?: string;                         // simulationId / proposalId — link-to-context (04 S8)
}

// ---- Contract ----

export interface PriceRuleEngineAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // workspace configuration (markets/VAT/floor defaults — versioned, 03 CP-5.6)
  getWorkspace(): Promise<Result<import('./07a').Workspace, AdapterError>>;
  updateWorkspace(patch: {
    markets?: import('./07a').Market[];       // VAT-rate edits bump version; running jobs keep their snapshot
    defaultFloor?: { markupPermille: number };
    defaultLocale?: 'ar' | 'en';
    baseVersion: number;                     // stale -> CONFLICT with both payloads
  }): Promise<Result<import('./07a').Workspace, AdapterError>>;

  // catalog intake & maintenance (paste = the LOOP-5 always-available path)
  importCatalog(input: {
    source: 'paste';                          // file-upload parses through the same row grammar when bound (08 N1)
    content: string;                          // rows: sku | nameEn | nameAr? | category | market | channel | net | cost? | floor?
    idempotencyKey: string;
  }): Promise<Result<Job<ImportJobResult>, AdapterError>>;
  importCostSheet(input: {                    // the vendor-increase moment (03 CP-5.1)
    source: 'paste';
    content: string;                          // rows: sku | totalLandedCost | effectiveFrom | note?
    idempotencyKey: string;
  }): Promise<Result<Job<ImportJobResult>, AdapterError>>;
  listCatalogItems(query: {
    filter?: {
      categoryId?: string[];
      marketCode?: ('KSA' | 'UAE' | 'OTHER')[];
      channel?: string[];
      belowFloor?: boolean;
      hasCost?: boolean;
      marginBand?: { minPermille?: number; maxPermille?: number };
    };
    search?: string;                          // normalized bilingual search over sku + names (rtl-rules §4)
    sort: 'sku' | 'updatedAt' | 'marginPermille' | 'currentNetPrice';
    cursor?: string; limit: number;           // virtualized surface: cursor pages ≤ 100
  }): Promise<Result<Page<CatalogItemRow>, AdapterError>>;
  getCatalogItem(id: string): Promise<Result<CatalogItemView, AdapterError>>;
  updateCatalogItem(id: string, patch: {
    currentNetPrice?: number;                 // manual fix path — note REQUIRED with it (03 CP-5.5)
    note?: string;                            // REQUIRED iff currentNetPrice present -> VALIDATION without
    nameEn?: string; nameAr?: string; categoryId?: string; channel?: string;
    floorOverride?: { absoluteFloorNet: number } | null;
    baseVersion: number;                      // stale -> CONFLICT with both payloads
  }): Promise<Result<CatalogItemView, AdapterError>>;

  // cost records (append-only, effective-dated)
  saveCostRecord(input: {
    itemId: string;
    components: import('./07a').CostComponents;
    effectiveFrom: string;                    // back-dating allowed and recorded (03 CP-5 edge)
    note?: string;
    correctsRecordId?: string;
  }): Promise<Result<import('./07a').CostRecord, AdapterError>>;
  listCostRecords(query: {
    itemId: string;
    sort: 'effectiveFrom' | 'createdAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<import('./07a').CostRecord>, AdapterError>>;

  // categories (rename-only lifecycle — 07a invariant)
  listCategories(query: {
    search?: string;                          // normalized bilingual search
    cursor?: string; limit: number;
  }): Promise<Result<Page<import('./07a').Category>, AdapterError>>;
  saveCategory(input: {
    id?: string;                              // omitted = create
    nameEn: string; nameAr?: string; note?: string;
    renameFromId?: string;                    // merge-by-rename: items/rules follow the surviving id
  }): Promise<Result<import('./07a').Category, AdapterError>>;

  // rules
  createRule(input: {
    name: string;
    note?: string;
    status?: 'draft' | 'active';
    priority: number;                         // collision with an active rule's priority -> VALIDATION naming it
    validFrom?: string; validTo?: string;
    conditions: import('./07a').RuleCondition[];   // empty -> VALIDATION (a rule matching nothing is a mistake)
    actions: import('./07a').RuleAction[];
  }): Promise<Result<RuleView, AdapterError>>;
  listRules(query: {
    filter?: { status?: ('draft' | 'active' | 'paused')[]; inertByTime?: boolean };
    search?: string;
    sort: 'priority' | 'updatedAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<RuleSummary>, AdapterError>>;
  getRule(id: string): Promise<Result<RuleView, AdapterError>>;
  updateRule(id: string, patch: {
    name?: string; note?: string;
    status?: 'draft' | 'active' | 'paused';
    priority?: number;                       // collision -> VALIDATION naming the other rule (total order, 03 CP-2 edge)
    validFrom?: string; validTo?: string;
    conditions?: import('./07a').RuleCondition[];
    actions?: import('./07a').RuleAction[];
    baseVersion: number;                     // stale -> CONFLICT with both payloads
  }): Promise<Result<RuleView, AdapterError>>;
  deleteRule(input: {
    ruleId: string;
    confirm: { pinnedSimulationCount: number };  // P04 level-2: UI names the simulations keeping pinned snapshots
  }): Promise<Result<{ deletedRuleId: string }, AdapterError>>;

  // simulation (the deterministic core — non-AI: rules per 07c)
  runSimulation(input: {
    name: string;
    scope: import('./07a').SimulationScope;
    ruleMode: 'active-set' | 'selected';
    ruleIds?: string[];                       // required iff ruleMode = 'selected'
    costSnapshotAsOf?: string;                // default: seeded now; back-dating uses effective costs (03 CP-3.1)
    idempotencyKey: string;
  }): Promise<Result<Job<SimulationJobResult>, AdapterError>>;
  getSimulation(id: string): Promise<Result<import('./07a').Simulation, AdapterError>>;
  listSimulationRows(query: {
    simulationId: string;
    filter?: {
      floorApplied?: boolean;
      direction?: ('up' | 'down' | 'flat')[];
      endingBrokenByFloor?: boolean;
      marketCode?: ('KSA' | 'UAE' | 'OTHER')[];
      categoryId?: string[];
      noCost?: boolean;                       // the skippedNoCost rows (visible, never hidden — 03 CP-3 edge)
    };
    search?: string;                          // normalized match over sku + names
    sort: 'sku' | 'direction' | 'marginDelta' | 'currentNetPrice';
    cursor?: string; limit: number;           // virtualized surface: cursor pages ≤ 100
  }): Promise<Result<Page<SimulationRowPageItem>, AdapterError>>;

  // price proposals (the governance chain — 03 CP-4)
  createPriceProposal(input: {
    simulationId: string;
    name: string;
    note?: string;
    rowSelection: { filter?: import('./07a').SimulationScope } | { itemIds: string[] };   // subset of simulation rows
  }): Promise<Result<ProposalView, AdapterError>>;
  listPriceProposals(query: {
    filter?: { status?: ('draft' | 'in-review' | 'approved' | 'withdrawn')[]; simulationId?: string };
    search?: string;
    sort: 'updatedAt' | 'createdAt' | 'name';
    cursor?: string; limit: number;
  }): Promise<Result<Page<ProposalSummary>, AdapterError>>;
  getPriceProposal(id: string): Promise<Result<ProposalView & { rows: import('./07a').ProposalRow[] }, AdapterError>>;
  updatePriceProposal(id: string, patch: {
    name?: string; note?: string;
    rowReviews?: { itemId: string; state: 'included' | 'excluded'; exclusionReason?: string }[];
                                              // exclusionReason REQUIRED for 'excluded' -> VALIDATION without it
    baseVersion: number;                      // stale/concurrent review -> CONFLICT with both payloads
  }): Promise<Result<ProposalView, AdapterError>>;
  submitPriceProposal(input: {
    proposalId: string;                       // gate: refuses while any row is 'unreviewed' (07a)
  }): Promise<Result<ProposalView, AdapterError>>;
  approvePriceProposal(input: {
    proposalId: string;
    acknowledgeGate: false;                   // literal type: the gate NEVER passes with blockers (07a obligation)
  }): Promise<Result<import('./07a').ApprovalRecord, AdapterError>>;
  withdrawPriceProposal(input: {
    proposalId: string;                       // in-review -> draft; withdrawal recorded (03 CP-4 edge)
  }): Promise<Result<ProposalView, AdapterError>>;

  // export (the deliverable — manual download is the primary path, 08 N2)
  exportPricePackage(input: {
    proposalId: string;                       // must be status 'approved' -> else VALIDATION naming the status
    formats: ('price-sheet' | 'audit-ledger')[];
    effectiveDate?: string;
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{
    url: string;
    expiresAt: string;
    regenerable: boolean;
    formats: ('price-sheet' | 'audit-ledger')[];
  }, AdapterError>>;

  // platform
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][]; refId?: string };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;
  getUsage(): Promise<Result<{
    window: string;
    simulationRuns: number;
    exportPackages: number;
    resetAt: string;
  }, AdapterError>>;
  listActivity(query: {
    filter?: { actorMemberId?: string; action?: string[]; targetRef?: string };
    search?: string;
    cursor?: string; limit: number;
  }): Promise<Result<Page<import('./07a').ActivityEntry>, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type Locale = 'ar' | 'en';
export type CurrencyCode = 'SAR' | 'AED' | 'USD' | 'EUR' | 'EGP' | 'JOD';
export type MarketCode = 'KSA' | 'UAE' | 'OTHER';

// ---- Workspace & market configuration ----
export interface Market {
  code: MarketCode;                      // workspace-configured, not hardcoded (00)
  nameEn: string;                        // "Saudi Arabia"
  nameAr: string;                        // "المملكة العربية السعودية"
  currency: CurrencyCode;
  currencyMinorDigits: 2 | 3;            // JOD/KWD-class currencies round at 3 (invoice-generator-desk kinship)
  vatRatePermille: number;               // 150 = 15% (KSA), 50 = 5% (UAE), 0 = none; integer permille avoids float drift
  displayRule: 'vat-inclusive';          // v1 invariant: display prices are VAT-inclusive per market (01 §E)
}
export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;                 // chrome direction default; either direction is a full citizen (05)
  markets: Market[];                     // seeded KSA + UAE; editable as versioned configuration
  defaultFloor: {
    markupPermille: number;              // default cost floor = landed × (1 + markup/1000); seed 80 (8%)
  };
  version: number;                       // optimistic concurrency for market/floor edits (03 CP-5.6)
  createdAt: string;
  updatedAt: string;
}

// ---- Catalog ----
export interface Category {
  id: string;
  nameEn: string;
  nameAr?: string;                       // bilingual pair; renders at own direction per row (05)
  note?: string;
  createdAt: string;
  updatedAt: string;
}                                        // categories are renamed/merged by rename only — never hard-deleted
                                          // (rules reference ids; 07a invariant, 03 CP-2 edge)
export type FloorOverride = { absoluteFloorNet: number };   // per-item absolute floor; wins by max vs derived floors
export interface CatalogItem {
  id: string;
  workspaceId: string;
  sku: string;                           // bidi-isolated Latin token; physical order stable in both directions
  nameEn: string;
  nameAr?: string;                       // sibling field pair (05 direction model)
  categoryId: string;
  marketCode: MarketCode;                // the item's market → currency + VAT rate + display rounding
  channel: string;                       // free-scoped channel label ("storefront", "marketplace-eg", "wholesale")
  currentNetPrice: number;               // canonical currency minor units, NET of VAT; display is formatting (rtl-rules §3)
  floorOverride?: FloorOverride;
  costBasis?: {                          // derived at read: the latest CostRecord effective ≤ read time
    landedCost: number;                  // minor units
    costRecordId: string;
    effectiveFrom: string;
  };
  marginPermille?: number;              // derived: (net − landed)/net × 1000; absent when no cost record
  belowFloor: boolean;                   // derived: currentNetPrice < activeFloor (landed-based — 07c rule 4); the live catalog warning
  version: number;                       // optimistic concurrency for manual edits (03 CP-5.5)
  createdAt: string;
  updatedAt: string;
}
export interface CostComponents {        // the landed-cost discipline (01 §B): components are data, not folklore
  supplierCost: number;                  // minor units, per unit
  freight?: number;
  duty?: number;
  fees?: number;
  packaging?: number;
}
export interface CostRecord {
  id: string;
  itemId: string;
  components: CostComponents;            // landed = sum(components) — computed, never stored as a second opinion
  effectiveFrom: string;                 // ISO date; history is effective-dated (the delayed-response pain, 01 [53])
  note?: string;                         // "Vendor increase Q4"; corrections are new records with notes (append-only)
  correctsRecordId?: string;             // a correction references the record it supersedes; never overwrites
  actorMemberId: string;
  createdAt: string;
}
export interface PriceHistoryEntry {
  id: string;
  itemId: string;
  fromNetPrice: number;
  toNetPrice: number;
  origin: 'manual' | 'proposal';         // manual fixes carry a note; proposal rows carry the proposal id
  note?: string;                         // REQUIRED for origin 'manual' (03 CP-5.5)
  proposalId?: string;
  actorMemberId: string;
  at: string;
}

// ---- Rules ----
export type RuleStatus = 'draft' | 'active' | 'paused';
export type RuleCondition =
  | { kind: 'category'; categoryIds: string[] }
  | { kind: 'channel'; channels: string[] }
  | { kind: 'market'; marketCodes: MarketCode[] }
  | { kind: 'price-band'; minNet?: number; maxNet?: number }     // on current net price
  | { kind: 'margin-band'; minPermille?: number; maxPermille?: number }; // on current margin (requires cost)
export type EndingMode = 'none' | 'whole-unit' | 'charm-9' | 'nearest-half';
export type RuleAction =
  | { kind: 'set-markup'; markupPermille: number }        // REBASE: net = landed × (1 + m/1000)
  | { kind: 'set-target-margin'; marginPermille: number } // REBASE: net = landed / (1 − g/1000)
  | { kind: 'adjust-price'; deltaPermille: number }       // COMPOUND: net = net × (1 + d/1000) (negative = markdown)
  | { kind: 'floor-at-markup'; floorMarkupPermille: number } // raises the item's floor: landed × (1 + f/1000)
  | { kind: 'ending-round'; mode: EndingMode };           // registered; applied LAST before the final clamp (07c rule 4)
export interface PricingRule {
  id: string;
  workspaceId: string;
  name: string;
  note?: string;
  status: RuleStatus;
  priority: number;                      // total order, ascending evaluation; ties rejected (03 CP-2 edge)
  validFrom?: string;                    // optional window (Ramadan markdown shape — 01 §F)
  validTo?: string;
  conditions: RuleCondition[];           // AND-composed; empty is invalid (a rule matching nothing is a mistake)
  actions: RuleAction[];                 // ordered; rebase/compound/floor semantics per 07c rule 3
  version: number;                       // bumped on save; simulations pin the versions they evaluated (audit honesty)
  actorMemberId: string;                 // last editor
  createdAt: string;
  updatedAt: string;
}

// ---- Simulation (immutable snapshot) ----
export interface SimulationScope {
  categoryIds?: string[];
  channels?: string[];
  marketCodes?: MarketCode[];
  itemIds?: string[];                    // explicit subset (proposal-precursor simulations)
}
export interface FormulaStep {           // the per-row derivation trace (the derivation-forward voice, 02)
  seq: number;
  kind: 'cost' | 'rule' | 'ending' | 'floor' | 'final';
  ruleId?: string;
  ruleName?: string;
  ruleVersion?: number;
  arithmetic: string;                    // rendered plain arithmetic: "net = 61.40 ÷ (1 − 0.380)"
  valueAfter: number;                    // minor units after this step
  skipped?: { reason: 'window' | 'scope' | 'no-cost' };
}
export interface SimulationRow {
  simulationId: string;
  itemId: string;
  sku: string;
  nameEn: string;
  nameAr?: string;
  marketCode: MarketCode;
  landedCostAtSnapshot?: number;         // absent → row not simulated (skippedNoCost)
  currentNetPrice: number;
  rawRulePrice?: number;                 // after all rebase/compound actions, pre-ending
  roundedPrice?: number;                 // after ending convention
  proposedNet?: number;                  // final after the LAST-step floor clamp; invariant: ≥ activeFloor (07c)
  activeFloor?: { value: number; source: 'workspace-default' | 'rule' | 'item-override' };
  floorApplied?: boolean;                // clamp fired (raw or rounded < floor)
  endingBrokenByFloor?: boolean;         // rounding dipped below floor and the clamp lifted the final (flagged, 03 CP-3 edge)
  marginBeforePermille?: number;
  marginAfterPermille?: number;
  displayBefore?: number;                // VAT-inclusive per market: roundHalfUp(net × (1 + vat/1000), minorDigits)
  displayAfter?: number;
  direction?: 'up' | 'down' | 'flat';    // price direction — ink channel, never the judgment channel (05)
  trace: FormulaStep[];
}
export interface SimulationSummary {     // the margin preview aggregate (catalog-weighted, honestly labeled)
  itemsScoped: number;
  itemsSimulated: number;
  skippedNoCost: number;                 // rows without a cost record at snapshot — never faked (03 CP-3 edge)
  priceUp: number; priceDown: number; priceFlat: number;
  floorClamped: number;
  endingBrokenByFloor: number;
  perMarket: {                           // aggregates are PER MARKET — never a cross-currency sum (SAR ≠ AED minor units)
    marketCode: MarketCode;
    itemsSimulated: number;
    blendedMarginBeforePermille?: number;   // Σ(net − landed) / Σnet over that market's simulated rows — catalog-weighted ONLY
    blendedMarginAfterPermille?: number;    // no sales-velocity weighting at v1 (LOOP-10: no analytics ingestion)
    netRevenueDelta: number;                // Σ(proposed − current), this market's minor units
  }[];
  vatRatesUsed: { marketCode: MarketCode; vatRatePermille: number }[];
  costSnapshotAsOf: string;
}
export interface Simulation {
  id: string;
  workspaceId: string;
  name: string;
  scope: SimulationScope;
  ruleMode: 'active-set' | 'selected';
  rulePins: { ruleId: string; ruleVersion: number; name: string }[];   // evaluated rules + versions (audit chain)
  rulesNotApplied: { ruleId: string; name: string; reason: 'window' }[]; // visible, never silently dropped
  costSnapshotAsOf: string;              // cost records effective ≤ this date (07c rule 1)
  summary: SimulationSummary;            // derived at completion — recomputed identically on re-read (determinism)
  createdById: string;
  createdAt: string;                     // immutable once written; re-running creates a NEW simulation
}

// ---- Price proposal (the governance chain) ----
export type ProposalRowState = 'unreviewed' | 'included' | 'excluded';
export interface ProposalRow {
  proposalId: string;
  simulationRowRef: { simulationId: string; itemId: string };   // pinned to the simulation snapshot
  state: ProposalRowState;
  exclusion?: { reason: string; actorMemberId: string; at: string };  // REQUIRED for 'excluded' (03 CP-4.2)
  values: {                              // copied from the simulation row at proposal creation (snapshot chain)
    sku: string; nameEn: string; nameAr?: string; marketCode: MarketCode;
    currentNetPrice: number; proposedNet: number;
    marginBeforePermille?: number; marginAfterPermille?: number;
    displayAfter?: number; floorApplied?: boolean;
  };
}
export interface PriceProposal {
  id: string;
  workspaceId: string;
  simulationId: string;                  // source simulation (pinned cost snapshot + rule versions ride along)
  name: string;
  note?: string;
  status: 'draft' | 'in-review' | 'approved' | 'withdrawn';
  rows: ProposalRow[];
  gate: {
    blocked: boolean;
    blockers: { kind: 'unreviewed-row'; itemId: string; sku: string }[];  // submission gate (03 CP-4.3)
  };                                     // derived at read from row states
  approval?: ApprovalRecord;             // present iff status = 'approved' (immutable once written)
  createdById: string;
  createdAt: string;
  updatedAt: string;
  version: number;                       // optimistic concurrency for review edits (03 CP-4.2)
}
export interface ApprovalRecord {
  id: string;
  proposalId: string;
  proposalVersion: number;               // the exact reviewed state that was approved
  approverMemberId: string;
  at: string;
  counts: { included: number; excluded: number; floorClampedIncluded: number };
}

// ---- Async jobs, exports, activity ----
export type JobKind = 'import' | 'simulation' | 'export';
export type ExportFormat = 'price-sheet' | 'audit-ledger';
export interface ExportArtifact {
  id: string;
  proposalId: string;
  formats: ExportFormat[];               // per-format retry on partial failure (async-contract §4)
  approvalSnapshot: ApprovalRecord;      // the package carries the approved state (audit chain)
  effectiveDate?: string;                // optional effective date carried on the price sheet rows
  expiresAt: string;                     // declared retention window at creation
  regenerable: boolean;                  // deterministic from the approved proposal — always true in v1
}
export interface ActivityEntry {         // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'catalog-imported' | 'cost-record-saved' | 'cost-sheet-imported'
    | 'rule-created' | 'rule-updated' | 'rule-deleted' | 'rule-status-changed'
    | 'simulation-run' | 'proposal-created' | 'proposal-row-reviewed'
    | 'proposal-submitted' | 'proposal-approved' | 'proposal-withdrawn'
    | 'price-edited-manually' | 'workspace-config-changed'
    | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                       // e.g. exclusion reason, margin delta, floor-policy change
  at: string;
}

