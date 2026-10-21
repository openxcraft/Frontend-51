// Verbatim TS blocks from specs-source/price-rule-engine/07a-data-contract.md — 07b imports this module by name.
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
export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';  // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: rows / items / formats
  partial?: unknown;                     // per-kind partial policy (07b rules)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;                // async-contract §5 — double-submit never double-imports/simulates/exports
  refId?: string;                        // simulationId / proposalId for link-to-context (04 S8)
}
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
