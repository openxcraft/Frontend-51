# 07a — Data Contract: loyalty-stamp-card

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns §1): **declared non-AI** — every operation (stamping, redemption, adjustment, expiry, flags, insights) is a deterministic rule over recorded state; no operation generates, scores, or transforms content by model, and no spec surface leaks AI affordances. TypeScript declarations for every entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type StaffRole = 'owner' | 'manager' | 'staff';
export type ProgramMode = 'classic' | 'ladder';
export type ProgramStatus = 'draft' | 'published' | 'archived';
export type CardStatus = 'active' | 'expiring-soon' | 'expired' | 'archived';
export type AdjustmentReason = 'counter-error' | 'missing-purchase' | 'goodwill' | 'fraud-correction';
export type AuditActionKind =
  | 'program-created' | 'program-updated' | 'program-published' | 'program-archived'
  | 'member-enrolled' | 'member-updated' | 'member-blocked' | 'member-unblocked'
  | 'stamp-issued' | 'stamp-undone' | 'stamp-blocked' | 'card-renewed'
  | 'reward-redeemed' | 'stamps-adjusted' | 'pass-issued' | 'pass-rotated'
  | 'staff-created' | 'staff-deactivated' | 'staff-reactivated'
  | 'settings-updated' | 'export-run';

export interface Workspace {
  id: string;
  nameAr: string;                       // bilingual store identity is authored, not translated
  nameEn: string;
  defaultLocale: Locale;                // console chrome default (LOOP-6 proposal: ar)
  joinCode: string;                     // 6-char code on the counter QR; member self-enrollment key
  retentionMonths: number;              // member-data retention posture (09 privacy; 12 Q-11)
  policyDefaults: ProgramPolicy;        // seeds new programs in the studio
  timezone: string;                     // IANA zone; daily-cap calendar + display times
}

export interface ProgramPolicy {
  expiryMonths: number;                 // card expires this long after the last stamp (1–24)
  dailyStampCap: number;                // max counter stamps per member per program per day (1–3)
}

export interface RewardTier {
  id: string;
  stampsRequired: number;               // strictly ascending; final tier equals program.stampCount
  nameAr: string;                       // required — bilingual tiers are the product's spine (00)
  nameEn: string;                       // required — blank locale fails validation (CP-1 edge)
  final: boolean;                       // redeeming a final tier resets the card cycle
}

export interface LoyaltyProgram {
  id: string;
  workspaceId: string;
  nameAr: string;
  nameEn: string;
  mode: ProgramMode;                    // classic = single final tier; ladder = ordered tiers
  stampCount: number;                   // 4–12 (research band 8–10 recommended; 07c seed = 8)
  tiers: RewardTier[];                  // classic: exactly 1, final; ladder: 2–4, ascending
  policy: ProgramPolicy;
  status: ProgramStatus;
  version: number;                      // draft edits bump version; publish pins a published version
  publishedVersion?: number;            // the live card members carry; drafts never leak to members
  createdAt: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  displayNameAr: string;                // audit entries render the actor's name in the reading locale
  displayNameEn: string;
  role: StaffRole;                      // staff: stamp/redeem/lookup/enroll; manager+: adjust/publish/settings
  counterPin: string;                   // hashed at the binding; never rendered (credential-contract posture)
  status: 'active' | 'inactive';        // deactivated staff keep their ledger attribution (append-only)
  createdAt: string;
}

export interface Member {
  id: string;
  nameAr?: string;                      // at least one script is required; both is the norm
  nameEn?: string;
  phoneCanonical: string;               // normalized E.164-shaped digits; displayed masked (last 2–4)
  locale: Locale;                       // pass rendering + receipt line language
  status: 'active' | 'blocked';
  blockReason?: string;                 // required when status = 'blocked' (12 Q-10)
  note?: string;                        // staff-internal, never on the pass
  enrolledChannel: 'counter' | 'self';
  createdAt: string;
}

export interface Card {
  id: string;
  programId: string;
  memberId: string;
  stamps: number;                       // 0..stampCount of the program's published version
  cycle: number;                        // increments on final-tier redemption or expiry renewal
  redeemedTierIds: string[];            // tiers redeemed in the CURRENT cycle (ladder mid-tiers)
  status: CardStatus;                   // derived at read from lastStampAt + policy (lazy expiry)
  lastStampAt?: string;                 // anchor of expiry computation
  expiredAt?: string;                   // set when the derived expiry passes (read-time evaluation)
  openedAt: string;
}

export interface StampEvent {
  id: string;
  cardId: string;
  actorStaffId: string;                 // staff-verified — every stamp names its stamper (00)
  source: 'counter' | 'adjustment';
  delta: number;                        // counter: +1; adjustment: any int (clamped ≥0 at the card)
  reason?: AdjustmentReason;            // required when source = 'adjustment' (07b rule)
  note?: string;                        // free-text reason detail, ledgered verbatim
  idempotencyKey?: string;              // counter stamps only — double-tap never double-stamps
  at: string;
  undone?: boolean;                     // a counter stamp undone within the 120s window
}

export interface Redemption {
  id: string;
  cardId: string;
  tierId: string;
  actorStaffId: string;
  stampsAtRedemption: number;           // feeds insights avgStampsAtRedemption (deterministic)
  cycle: number;
  at: string;
}

export interface PassToken {
  id: string;
  memberId: string;                     // one stable token per member; rotation preserves the member
  token: string;                        // deterministic seeded value (07c); never a credential secret
  issuedBy: 'enrollment' | 'rotation';
  createdAt: string;
}

export interface AuditEntry {           // P17 — the accountability surface (S9)
  id: string;
  workspaceId: string;
  actorStaffId: string | 'self-enrollment';   // member self-join actor is the join code, not a person
  action: AuditActionKind;
  targetRef: string;                    // member/card/program/staff/artifact id
  detail?: string;                      // e.g. "cap 1/day reached — earlier stamp by أمينة at 08:12"
  at: string;
}

export interface InsightsSnapshot {     // deterministic counts; formulas in 07c §2
  programId: string;
  windowDays: number;                   // default 30
  activeMembers: number;                // ≥1 counter stamp in window, not blocked
  stampsIssued: number;                 // counter-source events in window (excludes adjustments)
  redemptions: number;
  tierMix: { tierId: string; count: number }[];
  adjustmentsByReason: { reason: AdjustmentReason; count: number }[];
  undoCount: number;
  completionRate: number;               // final-tier redemptions ÷ cards with ≥1 stamp in window; floored to 2dp, never rounded up
  avgStampsAtRedemption: number | null; // mean of stampsAtRedemption, 1dp; null when no redemptions
}

export type JobKind = 'export';

export interface Job<T = unknown> {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };   // row counts (async-contract §3)
  result?: T;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;               // async-contract §5
}

export interface ExportArtifact {
  id: string;
  kind: 'members-csv';
  expiresAt: string;                    // declared retention window at creation
  regenerable: boolean;                 // deterministically rebuildable from state
}
```

## Relationships

Workspace 1—1..N LoyaltyProgram (one active published program is the norm; drafts coexist) · LoyaltyProgram 1—N RewardTier (ordered) · Workspace 1—N StaffMember · Workspace 1—N Member · Member 1—N Card (one per active program; cycles archive) · Card 1—N StampEvent · Card 1—N Redemption · Member 1—1 PassToken (rotatable, never deleted) · Every consequential mutation appends exactly one AuditEntry · Job wraps exports; ExportArtifact is the deliverable with expiry.

## State obligations (lifecycle invariants)

- **Stamps are staff-attributed or they do not exist**: every StampEvent carries actorStaffId; member-originated writes are impossible by construction (the pass view is read-only; 07b gates `issueStamp` on a staff session).
- **One live card per member per program**: enrollment under a published program opens the card; expiry renewal (CP-2 edge) archives the old card and opens cycle+1 — stamps never carry across cycles and unredeemed tiers die with the card (stated, ledgered as `card-renewed`).
- **Expiry is derived, not stored judgment**: status computes at read from lastStampAt + policy.expiryMonths against the workspace timezone; the same inputs always yield the same status (the determinism contract behind 10's budget).
- **Redemption semantics**: ladder mid-tier redemption appends to redeemedTierIds without touching stamps; final-tier (or classic) redemption resets stamps to 0 and increments cycle; redeemedTierIds clears with the new cycle.
- **Adjustments are append-only corrections**: a StampEvent with source 'adjustment' never rewrites an earlier event; negative deltas clamp at 0 and the clamp is recorded in the result, never silent.
- **Program versioning protects live members**: edits create draft versions; members only ever see the publishedVersion; archive leaves existing cards to complete (nothing deletes).
- **Members are unique by canonical phone**: normalized match returns the existing member (no duplicates ever — CP-4 invariant); blocked members keep their records and audit history.
- **The audit ledger is append-only**: no operation deletes or edits an AuditEntry; corrections are new entries (the integrity posture Majed buys — 02).
- **Partial-result policy** (async-contract §4): exports deliver per-segment with per-segment retry; stamps and redemptions are atomic single-record writes (no partial state exists).
- **No provider names anywhere** — sale events arrive as an abstract capability class (08 N1); the data model records source semantics, never vendors.
