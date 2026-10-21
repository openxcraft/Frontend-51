# 07a — Data Contract: inventory-count-assistant

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI product** — variance arithmetic, tolerance evaluation, recount triggering, ABC classification, cadence proposal, and IRA computation are deterministic functions over declared data; no operation generates, scores, or transforms content by model; the spec leaks no AI affordances. TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type AbcClass = 'A' | 'B' | 'C';
export type CountMode = 'blind' | 'directed';
export type SessionState = 'draft' | 'open' | 'reconciling' | 'closed' | 'cancelled';
export type VarianceOutcome = 'within-tolerance' | 'out-of-tolerance';
export type VarianceState =
  | 'auto-accepted'      // within tolerance at reveal (or after recount)
  | 'recount-pending'    // out-of-tolerance, recount requested, not yet submitted
  | 'recount-done'       // recount submitted; recomputed variance still out-of-band
  | 'review-required'    // manager decision owed (recount-done, or breach resolved by hand)
  | 'resolved';          // explicit manager resolution recorded
export type ResolutionKind = 'accept-count' | 'keep-book' | 'investigate';

export interface Workspace {
  id: string;
  name: string;
  defaultLocale: Locale;            // bilingual-ar product: 'ar' default proposal
  currency: string;                 // single-currency cost context (fixtures: 'SAR')
}

export interface Store {
  id: string;
  workspaceId: string;
  nameAr: string;
  nameEn: string;
  code: string;                     // short code, e.g. 'RY-OLY'
  active: boolean;
}

export interface Location {         // a countable zone inside a store
  id: string;
  storeId: string;
  nameAr: string;
  nameEn: string;
  code: string;                     // zone code, e.g. 'Z-BR'
  active: boolean;
}

export interface CatalogItem {
  id: string;
  workspaceId: string;
  sku: string;                      // unique, Latin
  barcode?: string;                 // EAN-13-class string; optional — type/search fallback is first-class
  nameAr?: string;                  // at least one name required (07b rule 4)
  nameEn?: string;
  unit: string;                     // 'piece' | 'box' | 'set' | 'kg' | 'pack' ...
  unitCost: number;                 // single-currency, >= 0
  classComputed: AbcClass;          // Pareto rule over stock value share (07c rule 5)
  classOverride?: AbcClass;         // manager pin; visible in catalog + activity log
  class: AbcClass;                  // derived: override ?? computed
  active: boolean;
  version: number;                  // optimistic concurrency
  createdAt: string;
  updatedAt: string;
}

export interface StockLevel {       // the book register row (per item per store)
  id: string;
  storeId: string;
  itemId: string;
  expectedQty: number;              // book quantity, integer >= 0
  asOf: string;                     // when the book row was imported/last posted
  lastCountedAt?: string;           // stamped at session close (cadence input)
  source: 'manual-paste' | 'stock-channel' | 'session-adjustment';
}

export interface ToleranceBand {
  absTolerance: number;             // units, >= 0
  pctTolerance: number;             // percent, >= 0
  valueTolerance?: number;          // optional cost-value ceiling, >= 0
  bandStrategy: 'union' | 'intersect';
  // allowedBand (units) = strategy === 'union'
  //   ? max(absTolerance, round(pctTolerance/100 * expectedQty))
  //   : min(absTolerance, round(pctTolerance/100 * expectedQty))
  // within tolerance iff |delta| <= allowedBand
  // value rule (when set): a variance whose |delta * unitCost| > valueTolerance is
  // out-of-tolerance regardless of the unit band (strict ceiling, deterministic)
}

export interface CountPolicy {
  id: string;
  workspaceId: string;
  nameAr: string;
  nameEn: string;
  tolerance: ToleranceBand;
  cadence: {
    classIntervals: Record<AbcClass, number>;  // days between counts per class
    sliceSize: number;                          // max items per proposed slice
  };
  autoRecount: boolean;             // out-of-tolerance breaches request recounts automatically
  version: number;
  active: boolean;
}

export interface CounterRef {        // typed roster entry — attribution without a seat
  ref: string;                      // stable key within the session, e.g. 'amal'
  name: string;                     // display name, any script, bidi-isolated at render
  memberRef?: string;               // links a workspace member when one exists
  locale: Locale;                   // the counter's sheet locale preference
}

export type SessionScope =
  | { kind: 'cycle-slice'; itemIds: string[]; proposalRef?: string }
  | { kind: 'zone'; locationId: string; itemIds: string[] }
  | { kind: 'full'; itemIds: string[] };

export interface CountSession {
  id: string;
  storeId: string;
  policyId: string;
  policyVersion: number;            // pinned at creation — later policy edits never re-judge a running session
  mode: CountMode;
  scope: SessionScope;
  counters: CounterRef[];
  state: SessionState;
  createdAt: string;
  openedAt?: string;
  revealedAt?: string;              // blind book quantities withheld until this moment (07b rule 3)
  closedAt?: string;
  closedBy?: string;                // memberId
  note?: string;
}

export interface CountEntry {
  id: string;
  sessionId: string;
  itemId: string;
  locationId?: string;              // optional per-entry zone attribution (guided walk)
  countedQty: number;               // integer >= 0
  counterRef: string;               // key into session counters
  kind: 'count' | 'recount';        // recount entries reference a breached variance
  varianceRef?: string;             // set when kind === 'recount'
  revision: number;                 // 1-based; corrections bump, never overwrite (07b rule 7)
  superseded: boolean;              // prior revision marker
  lateEntry: boolean;               // submitted after reveal (reconciling state) — recorded, never hidden
  submittedAt: string;
}

export interface VarianceResolution {
  kind: ResolutionKind;
  note?: string;                    // required when kind === 'keep-book' or 'investigate'
  by: string;                       // memberId
  at: string;
}

export interface Variance {
  id: string;
  sessionId: string;
  itemId: string;
  expectedQty: number;              // book quantity at reveal (register snapshot)
  countedQty?: number;              // final count (recount when present); undefined while uncounted
  delta?: number;                   // counted - expected (signed)
  absDelta?: number;
  pctDelta?: number;                // undefined when expectedQty === 0 (declared, not faked — 07c rule 4)
  valueDelta?: number;              // absDelta * unitCost at reveal
  band: number;                     // allowedBand units, computed per pinned policy
  outcome?: VarianceOutcome;
  state: 'uncounted' | VarianceState;
  resolution?: VarianceResolution;  // set when state === 'resolved'
  recountEntryId?: string;
  computedAt: string;               // reveal/recompute timestamp
}

export interface Adjustment {       // posted at finalize; immutable
  id: string;
  sessionId: string;
  itemId: string;
  storeId: string;
  fromQty: number;
  toQty: number;                    // the accepted counted quantity
  delta: number;                    // toQty - fromQty (signed)
  reason: string;                   // auto note or resolution note
  postedAt: string;
  postedBy: string;
}

export interface ReportArtifact {
  id: string;
  sessionId: string;
  format: 'variance-report' | 'adjustment-sheet';
  expiresAt: string;                // declared retention window at creation
  regenerable: boolean;
}

export type JobKind = 'catalog-import' | 'stock-import' | 'report-export';

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded'
    | 'failed' | 'cancelled' | 'expired';               // async-contract §2
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;               // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;           // async-contract §5
}

export interface ActivityEntry {    // P17 — actor-action-target-timestamp
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action:
    | 'catalog-imported' | 'item-created' | 'item-updated' | 'class-overridden'
    | 'stock-imported' | 'zone-created'
    | 'policy-saved'
    | 'session-created' | 'session-opened' | 'session-revealed' | 'session-closed'
    | 'session-cancelled'
    | 'entry-submitted' | 'entry-corrected' | 'recount-requested'
    | 'variance-resolved' | 'adjustment-posted'
    | 'report-exported' | 'consent-change';
  targetRef: string;
  detail?: string;                  // e.g. resolution kind, adjustment delta, late-entry flag
  at: string;
}
```

## Relationships

Workspace 1—N Store · Store 1—N Location · Workspace 1—N CatalogItem · CatalogItem + Store 1—1 StockLevel (the book register row) · Workspace 1—N CountPolicy · Store 1—N CountSession · CountSession 1—N CountEntry · CountSession 1—N Variance (one per scope item, computed at reveal) · CountEntry N—1 CatalogItem · Variance 1—0..1 VarianceResolution · CountSession 1—N Adjustment (posted at finalize) · CountSession 1—N ReportArtifact · Job spans catalog-import/stock-import/report-export work.

## State obligations (lifecycle invariants)

- **Session state machine is closed**: draft → open (openCountSession) → reconciling (reveal) → closed (finalize); draft|open → cancelled. Entries are accepted in open (kind count) and reconciling (late entries, and recount kinds); entries are REJECTED in draft/closed/cancelled. Corrections (revision bumps) are allowed only in open.
- **Blind withholding is a contract invariant**: while a session is blind and state ∈ {draft, open}, book quantities and computed variances for its scope items are omitted from every read surface (07b rule 3) — not merely hidden by CSS. The reveal (state → reconciling) is one-way and stamped.
- **Policy pinning**: a session pins policyVersion at creation; later policy edits never re-judge a running session. Variance band and recount automation evaluate against the pinned version.
- **Variance derivation is deterministic and immutable post-close**: variances are computed from the register snapshot at reveal (expectedQty frozen into the Variance row) and the final counted quantity (recount when present); closed-session variances never recompute.
- **Adjustments are immutable posted records**: fromQty/toQty/delta/reason/postedBy frozen at posting; the book register's expectedQty updates and lastCountedAt stamps at close — the register is mutable, the adjustment history is not.
- **Resolutions require notes for keep-book and investigate** (the honest "we don't know yet" states); accept-count requires none (the recount evidence stands).
- **Entries are append-with-revision**: corrections bump revisions and mark predecessors superseded; nothing is silently overwritten; late entries are flagged at the data level.
- **Class is derived with an override path**: classComputed is recomputed only on import/stock changes; classOverride wins and is activity-logged; the cadence engine reads the effective class.
- **Partial-result policies**: catalog import delivers good rows + named bad rows; stock import delivers applied rows + named invalid rows (kept out, never half-applied); report export delivers per-format artifacts with per-format retry (async-contract §4).
- **No provider names anywhere** — the stock-level channel appears as source:'stock-channel' and an abstract need in 08.
