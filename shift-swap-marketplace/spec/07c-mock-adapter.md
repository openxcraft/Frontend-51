# 07c — Mock Adapter: shift-swap-marketplace

SME-G pass · The mock is SPEC, not implementation: it defines the data and behavior a development environment must reproduce. Fully in-memory, deterministic, zero external dependencies, no network, no timers beyond declared cadences. It implements `ShiftSwapAdapterV1` exactly. A CI run twice produces identical transcripts.

## 1. Deterministic seed dataset (fixed, named; never random)

**Workspace**: `ws-front` (bilingual-ar, one site cluster "الرياض — الرياض بارك" / "Riyadh — Riyadh Park" with 3 teams).

**Workers (12, named)** — the roster spans every rule edge the spec needs:

| id | name | role | team | seniorityAnchor | qualifications | swapBalance | purpose in fixtures |
|---|---|---|---|---|---|---|---|
| `w-amna` | أمنة حسين / Amna H. | worker | `t-checkout` | 2023-04-01 | `q-cash-l2`, `q-selfco` | +1 (given more) | CP-1/CP-3 offerer; senior |
| `w-yusuf` | يوسف عبد الله / Yusuf A. | worker | `t-warehouse` | 2026-03-10 | `q-forklift` (expires in 21 days) | −2 (took more) | CP-2 requester; junior; qualification-expiry fixture |
| `w-sara` | سارة مطر / Sara M. | worker | `t-checkout` | 2024-09-15 | `q-cash-l2`, `q-foodsafe` | 0 | ranked #1 on the seeded offer (balance + seniority mix) |
| `w-layla` | ليلى قاسم / Layla Q. | worker | `t-checkout` | 2025-06-01 | `q-cash-l2` | −1 | ranked #2; rationale-diff fixture vs Sara |
| `w-omar` | عمر شاكر / Omar Sh. | worker | `t-warehouse` | 2024-01-20 | `q-forklift`, `q-coldchain` | +2 | forklift-qualified; max-weekly-hours edge (72h if accepted) |
| `w-hind` | هند العلي / Hind A. | worker | `t-fnb` | 2023-11-05 | `q-foodsafe`, `q-barista` | 0 | clopening edge: close 23:00, target opens 07:00 (8h < 11h rule) |
| `w-faisal` | فيصل الدوسري / Faisal D. | worker | `t-fnb` | 2026-08-01 | `q-foodsafe` | 0 | newest hire; recency-of-last-swap tiebreak fixture |
| `w-mariam` | مريم صالح / Mariam S. | worker | `t-checkout` | 2025-01-15 | (none) | 0 | zero-qualification fixture → visible-but-gated board card |
| `w-noora` | نورة الراشد / Noora R. | supervisor | all 3 teams | 2022-05-01 | — | — | CP-4 console persona |
| `w-tariq` | طارق الحربي / Tariq H. | ops-lead | workspace | 2021-10-01 | — | — | CP-5 admin persona |
| `w-extra-1..2` | (fixed Arabic names) | worker | `t-warehouse` | 2024-07-01 | `q-forklift` | +1/−1 | bulk queue volume; bulk-approve fixtures |

**Qualifications (6)**: `q-cash-l2` (cashier L2, renewal 24m), `q-selfco` (self-checkout attendant, null), `q-forklift` (forklift permit, renewal 12m), `q-coldchain` (cold-chain handling, 12m), `q-foodsafe` (food safety, 12m), `q-barista` (barista certified, 24m). One seeded **conflict pair**: `q-coldchain` vs `q-foodsafe` marked `conflictsWithIds` — surfaces in the registry as explicit keep-decisions (LOOP-9 pattern, CP-5.2). `q-roleband-k` seeds a `role-band` kind qualification (nationalization-band stand-in mapping, kind `jurisdiction-eligibility`) to exercise the Saudization-shaped rule class (01 §5).

**BlackoutRules (5, active)**:
- `br-rest-11`: minimum-rest 11h, workspace scope (cited default — 01 §4 DOL/clopening precedent).
- `br-week-60`: max-weekly-hours 60, workspace.
- `br-clopen`: no-clopening (derived; displays "derived from minimum-rest" in notes — CP-5.4 conflict surface with `br-rest-11` renders a precedence row: narrower scope wins).
- `br-ramadan`: date-window freeze on the F&B team for two fixed future dates (holiday freeze fixture).
- `br-band-k`: jurisdiction-pack stand-in, role-band scope, packCode `KSA-2026-A`, notes name it as owner-supplied configuration (12 Q-8 — the mock carries NO invented legal text).

**FairnessPolicy v1 (published)**: weights seniority .30, swap-balance .30, qualification-coverage .20, rest-compliance .10, recent-swap-load .10; tiebreak order [seniority, swap-balance, …]; blackoutHardGates true; caps {3 open offers, 5 requests/day}; offerExpiry 12h before start; balanceWindow 90 days.

**Shifts (28, fixed two-week window `2026-10-19 → 2026-11-01`)**: per team ~9 shifts; sources mixed (`schedule-import` with `sourceImportedAt` 2 days stale — staleness copy fixture; `manual-entry` for 3). Statuses spread: 20 scheduled, 3 open-swap, 2 swap-pending, 1 covered, 1 completed, 1 cancelled-upstream (its offer auto-withdrawn with reason — CP-3 edge fixture). `w-hind`'s adjacent close/open pair seeds the clopening violation; `w-omar`'s week seeds the 72h cap violation.

**Mock clock (fixed, seeded)**: the mock's "now" is frozen at `2026-10-21T08:00:00+03:00` (mid-window, Riyadh offset) — every countdown (offer expiry 12h-before-start), aging badge (24h SLA), and staleness age is computed against this instant, never wall-clock. The clock advances ONLY through the declared cadences in §2 (import row progression 6 rows / 1.2s; event replay 40ms cadence) and `reset()` restores it — two runs at any real-world time produce identical state and copy.

**SwapOffers (5 live + 3 historical)**: `off-amna-ev` (the canonical flow offer — evening checkout shift 2026-10-22 15:00–23:00, note "مناسبة عائلية" / family event); one warehouse night offer (forklift required) with 3 requests where Yusuf is ranked #2; one F&B offer blocked for Hind by the rest rule (EligibilityReport fixture with hoursShort: 3); one offer with zero eligible takers (qualification gap named — CP-2 edge); historical: matched+confirmed (with full ApprovalRecord + snapshot), expired (expiry copy fixture), withdrawn-upstream.

**SwapRequests (7 live)**: on `off-amna-ev`: Sara (#1), Layla (#2), Faisal (#3 — recency fixture); on the night offer: Yusuf #2 + two warehouse workers; plus one `declined-by-outcome` (historical, for MY SWAPS outcome states). Each carries its computed FairnessScore with full components + rationale string.

**FairnessScores**: computed by the rules engine below at seed build time (not hardcoded numbers — the mock COMPUTES, so the engine and the data cannot drift). Rationale strings composed from the policy's bilingual templates with numeric params (e.g., EN "Ranked 2: seniority 16 months lower than top; swap balance −1 (took 2, gave 1 in 90 days)" / AR "رُتّبت ثانياً: أقدمية أقل بـ16 شهراً من الأول؛ رصيد التبديل −1 (أخذ 2، منح 1 خلال 90 يوماً)" — Western numerals in both locales per ledger numeral policy, 05).

**ApprovalRecords**: 2 historical (1 approved with snapshot; 1 denied with rationaleTemplate `rest-rule` + note — denial-copy fixture); the snapshot's ranking rows are frozen copies (top-3 + selected).

**NotificationEvents (10)**: one per class, spanning all three P21 tiers, mixed seen/unseen — the inbox fixtures for 11 copy and the tier control.

**ActivityEntries**: full chain for every seeded mutation (post → request → accept → decision), 34 entries, monotonically increasing fixed timestamps.

**Jobs**: 1 completed schedule-import (with 2 failed rows + 1 awaiting-input row — partial-results fixtures); 1 fairness-ledger-export `succeeded` with artifact expiry in 6 days; 1 `queued` import (cancel fixture).

## 2. Behavior specification

- **Eligibility**: `checkSwapEligibility` evaluates, in order: worker status (suspended → PERMISSION-flavored report with `eligible: false` + reason), qualification gaps (missing required ids), blackout rules (minimum-rest vs worker's adjacent shifts in the seed window; weekly hours incl. the target; date-window; jurisdiction pack → param echo only). Output is the full `EligibilityReport` with named rules and plain-language strings — the panel never renders a bare boolean.
- **Ranking (the deterministic engine — inspectable, non-AI)**: `computeFairnessRanking(offerId)`: (1) collect requests on the offer; (2) run the eligibility check per requester; if `blackoutHardGates`, ineligible requests are excluded from the ladder (they remain visible in `listRequestsForOffer` with their violation reason — visible-but-gated at request level); (3) for eligible requesters compute components: seniority = tenure months from `seniorityAnchorDate` (min-max normalized across the candidate set); swap-balance = −|balance| normalized (closer to zero = fairer); qualification-coverage = held-required / required; rest-compliance = 1 − (violation severity, 0 if clean); recent-swap-load = days since last accepted swap (min-max); (4) points = normalized × policy weight; sort by total, tiebreak by policy order; (5) rationale = template composition with the top candidate as reference point for deltas. Same inputs → same output, byte-identical (§5).
- **Requests**: `createSwapRequest` re-validates everything server-side (VALIDATION with the failed rule named in `details` — the exact copy hook for 11); enforces daily cap (RATE_LIMIT with count + reset); duplicate request on same offer → VALIDATION; worker suspended → PERMISSION. Rank of others updates via `rank.changed` events on the subscription.
- **Accept & match**: `acceptSwapRequest` → SwapMatch `pending-supervisor` + offer `awaiting-supervisor` + other requests `declined-by-outcome` + balance pending; supervisor decision (`recordSupervisorDecision`) → match confirmed/denied, shift status flips, balances commit, ApprovalRecord appended with frozen snapshot, instant-tier notifications emitted, `match.confirmed` event. Deny without rationale → VALIDATION (contract rule 3 demonstrated).
- **Live events**: `subscribeSwapEvents` replays a fixed event script (7 events at 40ms cadence) on subscribe, then emits on real mutations; unsubscribe is exact (no leaks).
- **Conflicts**: stale-queue writes (decision on already-resolved match) → CONFLICT with both payloads in `details`; upstream roster change flagging → `match.flagged` + `blackout-violated` status; re-accept creates a NEW match (immutability, 07a).
- **Errors**: every method can return each applicable error class via failure injection; correlationIds fixed (`corr-0001`…).
- **Idempotency**: duplicate `idempotencyKey` on offer/request/accept/decision/import/export returns the original result — never a second mutation (contract rule 2 demonstrated).
- **Jobs**: import parses the pasted content with fixed row-splitting (no randomness), progresses determinate per row (6 rows / 1.2s), parks on ambiguous site codes as `awaiting-input` (row-level choice), partial-results on failure with failed-row retry; export produces a fixed artifact descriptor with expiry; `retryJob` re-runs failed rows only; `cancelJob` resolves within one interaction.
- **Policy simulation**: `updateFairnessPolicy` with `simulationConfirmed: false` → VALIDATION naming `simulationConfirmed` (the gate is contractual); with true → version bump + `policy-changed` digest events + all future scores name the new version. Weight sums ≠ 1 → VALIDATION with component details.

## 3. Failure injection (per method, configurable)

`MockConfig = { latencyMs?: number; errorRate?: number; errorCode?: ErrorCode; stallRankingAfterMs?: number; offlineQueueBehavior?: 'discard-dead-offers' | 'flush-all' }` — applied per method name via a config map. Defaults: zero latency, zero errors. Environment override via one config object at construction (no environment variables, no network). `stallRankingAfterMs` exercises the ranking-progress honesty surface (>2s → Job-style per async-contract §1; the mock caps it deterministically).

## 4. Test-support operations (mock-only, outside v1 contract)

`reset()` — restores seeds · `snapshot()` — deep clone for assertion · `replay(events)` — applies a recorded event list to reach a state deterministically · `seedSummary()` — emits the fixture table above as data (so tests assert against the same named roster the spec documents). Never called by product UI.

## 5. No-go guarantees

No timers beyond declared cadences; no randomness anywhere (variation = seeded fixture selection by input hash); no network; no provider imports; no persistence across resets; the fairness engine is pure and shared between seed-build and runtime — the mock cannot ship a ranking its own engine cannot reproduce. Two identical runs produce identical transcripts, including rationale strings and event order. **No AI anywhere in the mock**: the declared non-AI stance (00, 07a determinism statement) is honored by construction — there is no model call to stub, and the rationale templates are versioned data.
