# 07a — Data Contract: ad-spend-consolidator

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — every computation in this product is a deterministic rule (FX conversion arithmetic, overlap detection by key+day+epsilon, overlay-window calendar math, linear pacing). There is no AI operation on the adapter, no AI capability any core workflow requires, and no AI affordance may appear in any surface (00/08 degradation map: nothing degrades, because nothing is bound). TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';

// ISO 4217 alphabetic currency codes (research Source 10) — storage is canonical;
// display is formatting. Codes render in Latin always, bidi-isolated in RTL (rtl-rules §2).
export type CurrencyCode = string;   // validated against the workspace's active-code list (3 uppercase letters)

// ---- Workspace & policy ----

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;              // chrome direction default (either direction is a full citizen — 05)
  reportingCurrency: CurrencyCode;    // ONE per workspace — the functional-currency convention (Source 11)
  policyId: string;                   // active NormalizationPolicy
  fxRateTableId: string;              // declared policy data — never a market feed (08 N3)
  createdAt: string;
  updatedAt: string;
}

export type FxBasis = 'daily-rate' | 'monthly-average';   // declared convention — no research source (01 honest gap 3)

export interface NormalizationPolicy {
  id: string;
  workspaceId: string;
  fxBasis: FxBasis;                   // default 'daily-rate' = the rate dated on each line item's spend day
  dedupeEpsilon: number;              // fractional tolerance for overlap amount matching (default 0.02)
  pacingVarianceThresholdPct: number; // on/over/under-pace boundary (default 10)
  version: number;                    // edits re-version; snapshots pin the version they computed under
  createdAt: string;
  updatedAt: string;
}

export interface FxRate {
  id: string;
  from: CurrencyCode;
  to: CurrencyCode;                   // 'to' is always the workspace reporting currency in v1
  date: string;                       // ISO date; the rate's effective day (daily basis)
  month?: string;                     // ISO month; set for monthly-average rows
  rate: number;                       // declared policy fixture value; provenance is 'declared-policy'
  basis: FxBasis;
  source: 'declared-policy' | 'accepted-proposal';   // accepted-proposal = entered via reviewed rate-source suggestion (08 N3, P15)
  enteredByMemberId: string;
  at: string;
}

// ---- Channel connections (abstract kinds — capability language, never vendors) ----

export type ChannelKind =
  | 'search-ads-class'
  | 'social-ads-class'
  | 'video-ads-class'
  | 'marketplace-ads-class'
  | 'offline-media-class'
  | 'agency-report-class'
  | 'other-class';

export interface ChannelKindDescriptor {
  kind: ChannelKind;
  labelEn: string;                    // e.g. "Search ads channel"
  labelAr: string;                    // e.g. "قناة إعلانات البحث"
  typicalCadence: 'daily' | 'weekly' | 'monthly';
  metricShapeNotesEn: string;         // what spend-date vs report-date means for this class (01 honest gap 2 — declared policy, not cited fact)
  metricShapeNotesAr: string;
}

export type Cadence = 'daily' | 'weekly' | 'monthly';
export type MetricShape = 'spend-date' | 'report-date';   // which day a reported amount belongs to (declared per connection)
export type ConnectionStatus = 'unverified' | 'active' | 'degraded' | 'revoked';

export interface ChannelConnection {
  id: string;
  workspaceId: string;
  name: string;                       // operator-chosen, e.g. "Primary Search Ads"
  kind: ChannelKind;
  nativeCurrency: CurrencyCode;
  cadence: Cadence;
  metricShape: MetricShape;
  fxBasisOverride?: FxBasis;         // per-connection invoicing reality (agency statements settle at monthly average; platform consoles at daily) — absent = workspace policy basis
  dedupePriority: number;             // 1 = highest; keep-first resolutions use this (07c rule 4)
  status: ConnectionStatus;
  credential?: {
    state: 'unverified' | 'active' | 'expiring-soon' | 'expired' | 'revoked' | 'failed';   // credential-contract §3
    kindLabel: string;                // capability language, e.g. "Spend report reader credential"
    lastVerifiedAt?: string;
  };
  version: number;                    // policy edits re-version; snapshots pin connection versions (audit honesty)
  createdAt: string;
  updatedAt: string;
}

// ---- Raw spend line items (the ledger's grain) ----

export type ImportSource = 'paste' | 'file-upload' | 'channel-pull' | 'revision-batch';

export interface ImportBatch {
  id: string;
  workspaceId: string;
  connectionId?: string;              // paste/upload batches may be connection-less (offline media) or bound to one
  source: ImportSource;
  windowStart?: string;
  windowEnd?: string;
  revisionOfBatchId?: string;         // set for 'revision-batch' — the superseded import
  importedByMemberId: string;
  at: string;
}

export interface SpendLineItem {
  id: string;
  workspaceId: string;
  connectionId: string;
  batchId: string;
  externalKey: string;                // channel-native campaign/line identifier — the dedupe join key (bidi-isolated at render)
  campaignRef: string;                // display name for campaign grouping (verbatim, mixed-script-safe)
  spendDate: string;                  // ISO date the amount belongs to per the connection's metricShape
  reportDate: string;                 // ISO date the channel reported it (revisions arrive after the fact — Source 12)
  nativeAmount: number;               // ≥ 0; in nativeCurrency
  nativeCurrency: CurrencyCode;
  revision: number;                   // 1 on first import; a same (connection, externalKey, spendDate) re-import bumps this and supersedes
  supersededByLineItemId?: string;    // present when a newer revision replaced this row (old rows stay queryable — never hard-deleted)
  at: string;
}

// ---- Normalization outputs (computed by the consolidation engine — 07c rules) ----

export interface ConversionReceipt {
  lineItemId: string;
  nativeAmount: number;
  nativeCurrency: CurrencyCode;
  rate?: number;                      // present unless rate-unavailable
  rateId?: string;                    // the declared FxRate row used (audit pin)
  basis: FxBasis;
  policyVersion: number;
  reportingCurrency: CurrencyCode;
  reportingAmount?: number;           // nativeAmount × rate; absent iff rate is unavailable (honest gap, flagged — never zero)
  state: 'converted' | 'rate-unavailable' | 'native';    // 'native' when nativeCurrency === reportingCurrency
}

export interface NormalizedSpendRecord {
  id: string;
  snapshotId: string;
  lineItemIds: string[];              // ≥1; >1 only for split resolutions (07c rule 4)
  connectionId: string;
  campaignRef: string;
  day: string;                        // spendDate after metric-shape normalization (07c rule 1)
  amountReporting: number;            // sum of the members' reporting amounts
  receipts: ConversionReceipt[];      // one per member line item — the evidence chain
  dedupeState: 'single' | 'kept-first' | 'split' | 'both-counted' | 'overlap-open';
}

export interface ConsolidationSnapshot {
  id: string;
  workspaceId: string;
  version: number;                    // monotonic per workspace; versions are immutable once written
  windowStart: string;
  windowEnd: string;
  computedAt: string;
  policyVersion: number;
  connectionVersions: Record<string, number>;   // pinned versions per contributing connection
  fxRateTableVersion: number;
  status: 'current' | 'superseded';
  supersededByVersion?: number;
  health: {
    openOverlaps: number;
    lateCadenceConnections: string[]; // connectionIds whose latest line item predates cadence expectation
    revisionsApplied: number;         // revision-batches folded into this version vs the previous
    rateUnavailableDays: string[];    // days excluded from ratios (07c rule 6)
  };
  totals: {                           // derived at read — never authoritative storage
    reportingCurrency: CurrencyCode;
    total: number;
    byConnection: Record<string, number>;
    byDay: Record<string, number>;
    lineItemCount: number;
  };
}

// ---- Overlap findings (dedupe detection is flagging, never silent) ----

export type OverlapResolutionKind =
  | 'keep-first'        // by declared connection priority — the named channel of record wins
  | 'split'             // a declared portion to each (genuinely distinct buys sharing a key)
  | 'both-counted';     // two different spends; one is re-keyed

export interface OverlapResolution {
  kind: OverlapResolutionKind;
  reason: string;                      // REQUIRED — recorded in the ledger and the export (P04/P17)
  splitPortion?: number;               // required for 'split' (0–1, the second connection's share)
  actorMemberId: string;
  at: string;
  snapshotVersionApplied?: number;     // the version whose re-derivation folded this resolution
}

export interface OverlapFinding {
  id: string;
  workspaceId: string;
  lineItemIds: [string, string];       // the candidate pair (different connections, 07c rule 4)
  clusterKey: string;                  // externalKey + day — groups multi-member clusters (03 CP-3 edge)
  match: {
    externalKey: string;
    day: string;
    convertedDelta: number;            // |a − b| in reporting currency after conversion
    withinEpsilon: boolean;            // convertedDelta ≤ epsilon × max(a, b) under the active policy version
    score: number;                     // deterministic match score (07c rule 4)
  };
  state: 'open' | 'resolved' | 'archived';   // archived = the finding no longer exists under a new policy (re-checked, never orphaned)
  resolution?: OverlapResolution;
  detectedInSnapshotVersion: number;
  at: string;
}

// ---- Holiday overlays (the calendar layer) ----

export type MomentKind = 'hijri-anchored' | 'gregorian-fixed' | 'movable-gregorian';
export type HijriMethod = 'umm-al-qura' | 'tabular';   // presentation method, disclosed in-product (portfolio default: Umm al-Qura for KSA contexts)

export type AnchorRule =
  | { kind: 'hijri-anchored'; hijriMonth: number; hijriDay: number; method: HijriMethod }
  | { kind: 'gregorian-fixed'; month: number; day: number }
  | { kind: 'movable-gregorian'; ruleId: 'friday-following-fourth-thursday-nov' | 'custom-weekday-offset'; weekday?: number; month?: number; ordinal?: number };

export type MarketScope = 'KSA' | 'UAE' | 'EGY' | 'OTHER';

export interface HolidayMoment {
  id: string;
  workspaceId: string;
  nameEn: string;                      // e.g. "White Friday — KSA"
  nameAr: string;                      // e.g. "الجمعة البيضاء — السعودية"
  kind: MomentKind;
  anchor: AnchorRule;
  lengthDays: number;                  // window length per occurrence
  scope: MarketScope[];                // per-market naming reality (Source 9) — same weekend, different moments per market
  status: 'active' | 'retired';
  version: number;                     // anchor/name edits re-version; computed windows and exports pin the version
  createdAt: string;
  updatedAt: string;
}

export interface OverlayWindow {
  momentId: string;
  momentVersion: number;
  occurrenceLabel: string;             // e.g. "Ramadan 1447" (hijri) or "2026" (gregorian)
  start: string;                       // ISO date — computed by the declared method (07c rule 8)
  end: string;                         // inclusive
  method?: HijriMethod;                // disclosed for hijri-anchored moments
  partialCoverage?: boolean;           // window extends beyond the snapshot window (03 CP-4 edge)
}

export interface OverlayComparison {   // derived read — deterministic arithmetic (07c rule 6)
  momentId: string;
  window: OverlayWindow;
  priorOccurrenceWindow?: OverlayWindow;   // same moment's previous occurrence — lunar matching for hijri-anchored (never Gregorian lookalike)
  controlWindow: { start: string; end: string };   // equal length immediately preceding the window start
  controlConfoundedBy?: string[];      // momentIds overlapping the control window (honesty flag, 03 CP-4 edge)
  meanDailyWindow: number;             // reporting currency — rate-unavailable days excluded AND NAMED
  meanDailyControl: number;
  liftRatio: number;                   // meanDailyWindow / meanDailyControl
  likeForLikeDelta?: number;           // this occurrence vs prior occurrence mean-daily delta (absolute + pct)
  channelSplit: Record<string, number>;
  excludedDays: string[];
}

// ---- Budgets & pacing ----

export interface BudgetLine {
  id: string;
  workspaceId: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  amount: number;                      // in the workspace reporting currency ONLY (VALIDATION otherwise — 03 CP-5 edge)
  momentRef?: { momentId: string; occurrenceLabel: string };   // optional binding to a planned occurrence
  status: 'draft' | 'active' | 'closed';
  amendments: { amount: number; periodStart: string; periodEnd: string; reason: string; actorMemberId: string; at: string }[];
  version: number;                     // closed lines are immutable — edits are new amendment entries, never mutations
  createdAt: string;
  updatedAt: string;
}

export interface PacingStatus {        // derived read — linear arithmetic, no forecasting (07c rule 7)
  budgetLineId: string;
  snapshotVersion: number;
  coveredDays: number;
  totalDays: number;                   // period length; partial coverage flagged when covered < total
  partialCoverage: boolean;
  spentToDate: number;                 // cumulative normalized spend in period (rate-unavailable days excluded and named)
  linearPaceToDate: number;            // budget × (coveredDays / totalDays)
  variancePct: number;                 // (spentToDate − linearPaceToDate) / linearPaceToDate × 100
  state: 'on-pace' | 'over-pace' | 'under-pace';   // vs the policy threshold
  excludedDays: string[];
}

// ---- Async jobs, exports, activity ----

export type JobKind = 'import' | 'consolidation' | 'export';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';   // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };   // units: line items / records / formats
  partial?: unknown;                   // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;              // async-contract §5 — double-submit never double-imports/consolidates/exports
  workspaceRef?: string;
}

export type ReportFormat = 'consolidated-statement' | 'reconciliation-ledger' | 'overlay-analysis' | 'raw-line-items';

export interface ExportArtifact {
  id: string;
  workspaceId: string;
  formats: ReportFormat[];             // per-format retry on partial failure (async-contract §4)
  snapshotVersion: number;             // exports pin their version (07a pinning)
  supersededAtExport?: number;         // names a newer snapshot version at handoff (honesty, 03 CP-5 edge)
  expiresAt: string;                   // declared retention window at creation
  regenerable: boolean;                // deterministic from immutable snapshot state — always true in v1
}

export interface ActivityEntry {       // P17 — the accountability surface
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'connection-created' | 'connection-updated' | 'connection-verified' | 'connection-revoked'
    | 'lines-imported' | 'revision-imported'
    | 'policy-updated' | 'rate-entered' | 'rate-accepted'
    | 'consolidation-run'
    | 'overlap-resolved'
    | 'moment-saved' | 'moment-retired'
    | 'budget-saved' | 'budget-amended'
    | 'export-run' | 'consent-change';
  targetRef: string;
  detail?: string;                     // e.g. resolution reason, delta totals — provenance audit
  at: string;
}
```

## Relationships

Workspace 1—1 NormalizationPolicy (active; history of versions) · Workspace 1—N ChannelConnection · Workspace 1—N ImportBatch · ChannelConnection 1—N SpendLineItem (via connectionId) · ImportBatch 1—N SpendLineItem · SpendLineItem 1—0..1 SpendLineItem (supersededByLineItemId — the revision chain) · Workspace 1—N ConsolidationSnapshot (versions, monotonic, immutable) · Snapshot 1—N NormalizedSpendRecord · NormalizedSpendRecord N—M SpendLineItem (via receipts, one receipt per member) · Workspace 1—N OverlapFinding · OverlapFinding N—1 ImportBatch pair context · Workspace 1—N HolidayMoment (versioned) · HolidayMoment 1—N OverlayWindow (computed per occurrence) · OverlayWindow 1—0..1 OverlayComparison (derived) · Workspace 1—N BudgetLine (versioned, amendment chain) · BudgetLine 1—N PacingStatus (derived per snapshot) · Workspace 1—N ExportArtifact · Job spans import/consolidation/export work.

## State obligations

- **Immutability of snapshots**: a ConsolidationSnapshot is written once and never mutated; re-running a consolidation produces a NEW version. Superseded versions keep `supersededByVersion` and remain fully queryable. Export artifacts pin their snapshot version and flag newer ones at handoff.
- **Revision chains, never overwrites**: re-importing the same (connection, externalKey, spendDate) supersedes the old row (`revision` bump + `supersededByLineItemId`) and appends; superseded amounts stay queryable. A revision must be same-currency (VALIDATION otherwise — a currency change is a different line item).
- **Determinism is a contract**: identical (line items, policy version, connection versions, rate table version) always yields identical snapshot content; findings, records, totals, and comparisons are computed — never hand-authored. `rate-unavailable` is a state, not a zero: affected days are excluded from ratios and named in `excludedDays`.
- **Dedupe flags, humans decide**: overlap detection only creates findings; every state change to `resolved` carries a resolution with a REQUIRED reason and actor. Resolution effects apply at the NEXT consolidation (`snapshotVersionApplied`), never retroactively inside a written snapshot.
- **Version pinning everywhere**: snapshots pin policy, connection, rate-table, and moment versions; findings pin the snapshot version that detected them; exports pin snapshot version + formats. No later edit retroactively mutates a pinned artifact.
- **One reporting currency, per-connection FX basis**: the workspace declares exactly one reporting currency and a default FX basis; a connection may override the basis (the invoicing reality — agency statements settle at monthly average, platform consoles report at daily rates; 07c seeds exercise both). Budget lines are declared in the reporting currency (VALIDATION otherwise); FX rates always convert INTO it; `native` receipts mark same-currency rows.
- **Partial-result policies** (async-contract §4): import delivers rows-so-far + named bad rows; consolidation is per-record re-runnable (determinism makes re-runs safe); export delivers per-format partial with per-format retry.
- **No provider names anywhere** — channels appear as kinds, credentials as capability labels, rates as declared policy data (08).
