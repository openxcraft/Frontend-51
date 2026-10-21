# 07b — Adapter Contract: price-rule-engine (TypeScript, v1)

SME-G pass · `PriceRuleEngineAdapterV1` · LOOP-15 satisfied: full 7-class error taxonomy, typed pagination, auth-agnostic session. **Types only — no implementation.** Entity semantics (Workspace, Market, Category, CatalogItem, CostRecord, PriceHistoryEntry, PricingRule, Simulation, SimulationRow, SimulationSummary, PriceProposal, ProposalRow, ApprovalRecord, ExportArtifact, Job, ActivityEntry): 07a. Every operation traces to ≥1 flow (03 coverage table — 32 operations, 0 orphans).

```ts
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
```

## Rules

1. **Determinism contract**: `runSimulation` implements exactly the pipeline specified in 07c — rebase/compound action evaluation in priority order, ending round, floor clamp LAST (the invariant `proposedNet ≥ activeFloor`), VAT display rounding per market — and identical inputs (catalog state, effective cost records, pinned rule versions, scope, snapshot date) yield identical rows and summary. Every simulation result carries `mode: 'deterministic'`. Simulations are immutable snapshots; re-running creates a new simulation; no operation mutates a written one.
2. **The floor is a clamp, not a suggestion**: a row whose raw or rounded price falls below its active floor is clamped to the floor, flagged `floorApplied` (and `endingBrokenByFloor` when the clamp lifted a rounded price) — the adapter NEVER returns a proposed price below floor, and never silently omits the clamp from the trace.
3. **Submission and approval gates**: `submitPriceProposal` with any `unreviewed` row → VALIDATION whose `details` name the first unreviewed row and the count. `approvePriceProposal` with role not owner/approver → PERMISSION naming the seat's capability; success writes an immutable ApprovalRecord pinning `proposalVersion`; later workspace edits never mutate the approved proposal; `acknowledgeGate: false` makes bypass impossible at the type level (the trh `signOffReviewJob` pattern).
4. **Role model**: viewer = zero mutations (all writes → PERMISSION in capability language); editor = catalog/rules/simulations/proposal-review writes but NOT approval; approver = editor's reads + approval only; owner = everything. Manual price edits (`updateCatalogItem` with `currentNetPrice`) require the note — VALIDATION without it — and append a PriceHistoryEntry with `origin: 'manual'`.
5. **Stale-version semantics**: `updateWorkspace`, `updateCatalogItem`, `updateRule`, `updatePriceProposal` (baseVersion/baseVersion fields) → CONFLICT with both payloads in `details`; approving an already-approved/withdrawn proposal or reviewing a concurrently-updated one → CONFLICT with current state. Bulk row reviews apply atomically per call (all rows verified against the live proposal version — never a partial silent apply).
6. **Priority is a strict total order**: saving a rule whose priority collides with another ACTIVE rule → VALIDATION naming the other rule; draft rules may share priorities only if no active collision exists (the console shows the collision risk before activation).
7. **Idempotency**: import/simulation/export submits carry idempotency keys; a retried submit returns the original job (async-contract §5). Progress is determinate in units (rows, items, formats) — an indeterminate bar claiming percentage is a contract violation (async-contract §3).
8. **Partial policies**: catalog/cost-sheet imports deliver imported-so-far + named invalid rows and unmatched SKUs (async-contract §4); simulations are all-or-nothing snapshots (atomicity is semantically required — a half-computed margin preview is a lie); exports deliver per-format partial with per-format retry.
9. **VAT honesty**: `displayPrice`/`displayBefore`/`displayAfter` derive from the market's `vatRatePermille` at read/simulation time; simulations record `vatRatesUsed`; workspace market edits never retro-mutate written simulations (the snapshot states the rates it used — 07a).
10. **Cost-snapshot honesty**: `runSimulation` resolves each scoped item's cost as the latest CostRecord with `effectiveFrom ≤ costSnapshotAsOf`, else the earliest record; items with zero cost records are counted `skippedNoCost` and returned by the row filter `noCost: true` — never simulated with an invented cost.
11. Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass (32/32).
