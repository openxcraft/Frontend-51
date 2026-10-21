# 07c — Mock Adapter: cod-order-confirmation

SME-G pass · The mock is SPEC, not implementation: it defines the data and behavior a development environment must reproduce. Fully in-memory, deterministic, zero external dependencies, no network, no timers beyond declared cadences. It implements `CodOrderConfirmationAdapterV1` exactly. A CI run twice produces identical transcripts. **Declared conditionally-AI posture honored by construction**: the mock's risk engine is the deterministic rule scorecard ONLY (`engine: 'rule-scorecard'` on every score — the optional model enrichment is an unbound abstract capability; there is no model to stub, and the provenance field is always truthful).

## 1. Deterministic seed dataset (fixed, named; never random)

**Workspace**: `ws-cod` — "متجر الندى — الرياض" / "Al-Nada Store — Riyadh" (bilingual-ar, workspace currency SAR, values in halalas minor units).

**Sites (2)**: `site-riyadh-main` (الرياض — المستودع الرئيسي / Riyadh — Main Warehouse), `site-riyadh-north` (الرياض — فرع الشمال / Riyadh — North Branch; site-scoped policy fixture).

**Users (4, named)**:

| id | name | role | sites | purpose in fixtures |
|---|---|---|---|---|
| `u-hessa` | حسّاء إدريس / Hessa I. | agent | main | CP-2 queue persona; call-leg fixtures |
| `u-fahad` | فهد العنزي / Fahad A. | manager | both | CP-4/CP-6 persona; hold releases; policy publishes |
| `u-munira` | منيرة صابر / Munira S. | dispatch | main | CP-5 persona; manifest seal/export |
| `u-salem` | سالم القحطاني / Salem Q. | manager | both | dispute + blocklist fixtures |

**Buyers (12, named — the scorecard's learning set)**:

| id | name | locale | history (completed/refused/unreachable/cancelled) | totalOrders | purpose |
|---|---|---|---|---|---|
| `b-noura` | نورة السالم / Noura S. | ar | 12/0/0/1 | 13 | scorecard angel: completionRatio 1.0 |
| `b-maha` | مها فؤاد / Maha F. | ar | 8/1/0/1 | 10 | solid history; window-owed fixture |
| `b-tarif` | طارف حسين / Tarif H. | ar | 3/2/1/0 | 6 | mediocre ratio 0.5 |
| `b-rakan` | راكان العمر / Rakan A. | en | 1/3/2/1 | 7 | chronic refuser: ratio 0.167; blocklist candidate |
| `b-layan` | ليان قاسم / Layan Q. | ar | 0/0/0/0 | 0 | NEW buyer → neutral 0.5 component |
| `b-joud` | جود خالد / Joud K. | ar | 2/0/1/0 | 3 | small clean history |
| `b-omar` | عمر بسام / Omar B. | en | 5/1/1/2 | 9 | typical; zone-unmatched address fixture |
| `b-fatima` | فاطمة الزهراء / Fatima Z. | ar | 4/0/0/0 | 4 | tenure ≥4 fixture |
| `b-yousef` | يوسف نعمان / Yousef N. | ar | 2/1/0/1 | 4 | value-over-cap fixture holder |
| `b-hind` | هند مرعي / Hind M. | ar | 1/0/2/1 | 4 | unreachable-heavy; expiry/auto-cancel fixture |
| `b-dana` | دانة الفهد / Dana F. | en | 6/0/0/0 | 6 | blocked-buyer fixture (blocked, reason "طلبات وهمية متكررة" / "repeated fake orders") |
| `b-sami` | سامي راشد / Sami R. | ar | 3/1/0/0 | 4 | wrong-number response fixture |

**Zones (3)**: `R-1` (النرجس / An Narjis), `R-7` (العليا / Olaya), `R-12` (الملقا / Malqa). Catalog windows seeded for R-1 and R-7; R-12 exists as a zone code with NO windows (the 0.6 address-quality + empty-proposal fixture).

**DeliveryWindows (12, fixed three-day catalog 2026-10-22 → 2026-10-24)**: per R-1 and R-7 per day — morning 09:00–12:00 (capacity 20), afternoon 13:00–16:00 (20), evening 17:00–20:00 (24), night 20:30–22:00 (8). Committed counts seeded to create capacity variety: one R-1 evening window at 23/24 committed (capacity-warning fixture ≥80%), one R-7 morning at 20/20 FULL (zero-remaining fixture), others lightly committed (2–7). Labels bilingual with Western numerals: "مساءً 17–20" / "Evening 17:00–20:00".

**LadderPolicy (workspace default v3 + site-north v2)**: default v3 — sequence [message, sms, voice, agent-call]; cooldowns {message 4h, sms 16h, voice 8h, agent-call 0}; quietHours 21:00–08:00 enabled; expiry 48h; autoCancel true; autoStart `below-high-risk`; lead 6h; horizon 7d. Site-north v2 differs (expiry 36h; quietHours 22:00–07:00) — the per-site scoping fixture.

**RiskPolicy v1 (published)**: weights {buyer-history .30, value-band .20, confirmation-latency .15, channel-engagement .15, address-quality .10, buyer-tenure .10}; valueCap 50000 (500.00 SAR); bandThresholds {lowMin 70, highMax 39}; holdRules {overCapToHold true, highBandOverHalfCapToHold true}; historyWindowDays 180; newBuyerNeutralScore 0.5.

**MessageTemplates (5, versioned, bilingual, verbatim bodies in 11 §D)**: `tpl-msg-1` (message rung with quickReplyWindowOptions true), `tpl-sms-2` (sms rung), `tpl-voice-3` (voice script with keypadMenuWindowOptions true), `tpl-final` (final notice), `tpl-cancel-ack` (cancel acknowledgment).

**Mock clock (fixed, seeded)**: the mock's "now" is frozen at `2026-10-21T10:30:00+03:00` — every countdown (cooldown arcs, expiry, lead time, aging) computes against this instant, never wall-clock. The clock advances ONLY through the declared cadences in §3 (import row progression 8 rows / 1.6s; event replay 40ms cadence) and `reset()` restores it. Two runs at any real-world time produce identical state, scores, and copy.

**CodOrders (30, fixed; the state spread the spec needs)**:

| state | count | fixtures of note |
|---|---|---|
| `received`/`triaged` | 2 | pre-ladder arrivals awaiting auto-start tick |
| `ladder-running` | 11 | attempt-1 sent for 4 (2 responded-with-window → awaiting-agreement edge), attempt-2 sms sent for 3, voice rung active for 2, agent-call rung for 1 (Hessa's live work), 1 rescheduled +90m (reschedule fixture) |
| `awaiting-agreement` | 3 | confirm captured without window (Maha fixture — "window owed") |
| `confirmed` (agreement stamped) | 6 | full WindowAgreement chains incl. one superseded-by-reschedule pair (immutability chain fixture) |
| `held-review` | 3 | one value-cap (`b-yousef`, 640.00 SAR > 500 cap), one blocked-buyer (`b-dana`), one high-band-over-half-cap |
| `auto-cancelled` | 2 | ladder-expired orders incl. `b-hind` (unreachable history updated; final-notice attempt recorded) |
| `buyer-cancelled` | 1 | response fixture with rawText "ألغي الطلب" |
| `manifested` (sealed, pre-export) | 1 batch link | `mfs-draft` holds 12 |
| `out-for-delivery` / `delivered` / `refused` / `returned` | 1 / 2 / 1 / 1 | outcome-event fixtures feeding buyer history |
| `cancelled-upstream` | 1 | source-refresh fixture (ladder halted with reason) |

Orders span values 85.00–640.00 SAR; zones R-1/R-7/R-12/null; buyers from the table above; `b-omar`'s order carries zoneCode null + district present (address-quality 0.4 fixture); `b-layan`'s order is the new-buyer neutral fixture. Every order's `riskScoreId` points at a score computed BY THE ENGINE at seed-build time (below) — the mock never hardcodes a number its engine cannot reproduce.

**ConfirmationAttempts**: full rung chains for every ladder order with monotonic fixed timestamps relative to the mock clock (e.g., the canonical order `ord-1001` for `b-noura`: attempt-1 message sent 2026-10-20T11:00, delivered 11:02, read 11:07, responded 11:09 → agreement on evening window 2026-10-22 R-1); one attempt with `state: 'failed'` + stateDetail naming a channel delivery failure (failover fixture); one `skipped` rung (reschedule carried).

**BuyerResponses**: one per captured attempt incl. verbatim rawText fixtures — "أكد الطلب — الخميس مساءً" (confirm with window), "ألغي الطلب" (cancel), "الرقم غير صحيح" (wrong-number), a dialect free-text fixture "خلاص ابعتوه بكرة" recorded verbatim with agent-captured type `confirm` (the no-silent-AI-classification fixture, 07a).

**WindowAgreements**: 6 active + 1 superseded chain (same order, first agreement Thursday evening → reschedule → active Friday morning; both rows intact with `supersededById`).

**HandoffManifests (2)**: `mfs-sealed-hist` (sealed + exported 2026-10-20; 18 orders; artifact `art-mfs-1` expiring 6 days from mock-now; rollup computed from its frozen order set); `mfs-draft` (draft; 12 confirmed orders for routeDate 2026-10-22; rollup: count 12, value 3,120.00, windows mix 4, bands {low 8, medium 3, high 1}, agreementOwed 1 — Munira's CP-5 fixtures).

**NotificationEvents (10)**: one per class, spanning the three P21 tiers, mixed seen/unseen — `capacity-warning` on the 23/24 window, `hold-awaiting-decision` on `b-yousef`'s cap hold, `agreement-stamped` instant for Hessa, `auto-cancelled` digest, etc.

**ActivityEntries**: 47 entries — the full chain for every seeded mutation (import → triage → ladder start → attempt sends → responses → agreements → holds → seal → export → outcomes), actor ids or `null` (engine) with policy versions in detail, monotonically increasing fixed timestamps.

**Jobs (3)**: `job-imp-1` completed order-import (60 rows: 56 imported, 2 failed with row-quoted issues, 2 awaiting-input rows parked with both shown — the partial-results fixtures); `job-led-1` succeeded ledger-export (artifact `art-led-1`, 47 entries, expiry 7 days); `job-mfs-2` queued manifest-export (cancel fixture).

## 2. Behavior specification

### 2.1 The risk engine (EXACT deterministic rules — the core heuristic)

`computeRiskScore(orderId)` (and the seed-build pre-pass) computes, with `policy = RiskPolicy v1`:

1. **buyer-history** (weight .30): let `c`, `r`, `u` = buyer's completed/refused/unreachable counts in the trailing 180-day window. If `c + r + u = 0` → normalized `n = 0.5` (newBuyerNeutralScore; rawValue = −1). Else `n = c / (c + r + u)`; rawValue = ratio × 100 (rounded to 1 decimal for display only — computation uses full precision).
2. **value-band** (weight .20): `x = valueAmount / valueCap`. If `x ≤ 0.5` → `n = 1`. If `0.5 < x ≤ 1.0` → `n = 1 − (x − 0.5) × 2` (linear: 1.0 at half-cap, 0.0 at cap). If `x > 1.0` → `n = 0` AND the import/triage path routes the order to `held-review` with holdReason `value-cap` (hard rule, contract rule 8).
3. **confirmation-latency** (weight .15): if a response exists → `h` = hours from the ladder's first attempt `scheduledFor` to `response.capturedAt`; `n = 1` if `h ≤ 2`; else `n = max(0, 1 − (h − 2) / (ladderExpiryHours − 2))` with expiry 48h. If no response yet → `n = 0.5` (provisional — recomputes on every response capture; the UI labels provisional scores "مؤقتة" / "provisional").
4. **channel-engagement** (weight .15): best observed engagement ordinal → `n`: message-rung interactive response = 1.0; SMS reply keyword = 0.8; voice keypad confirm = 0.7; agent-logged manual confirm = 0.6; delivered-and-read without response = 0.3; nothing = 0.0. rawValue = ordinal code 0–5.
5. **address-quality** (weight .10): zoneCode set AND catalog windows exist for that zone → `n = 1.0`; zoneCode set, no windows → `n = 0.6`; zoneCode null, district present → `n = 0.4`; zoneCode null, district null → `n = 0.2`.
6. **buyer-tenure** (weight .10): prior orders `p = max(0, totalOrders − 1)` (a first-ever order has p = 0): `p = 0` → `n = 0`; `1 ≤ p ≤ 3` → `n = 0.5`; `p ≥ 4` → `n = 1.0`.

`totalPoints = Σ (n_k × w_k) × 100`, rounded half-up to integer for display; band: `total ≥ 70` → low; `40 ≤ total < 70` → medium; `total ≤ 39` → high (bandThresholds lowMin 70 / highMax 39). Explanations are composed from versioned bilingual templates with numeric params (11 §D2) — e.g., EN "Buyer history: 12 delivered, 0 refused in 180 days" / AR "سجل المشتري: 12 طلباً مكتمل، 0 مرفوض خلال 180 يوماً". Scores are immutable rows: recompute appends. The engine field is always `'rule-scorecard'` in the mock (§5).

### 2.2 The ladder engine (EXACT timing rules)

- **Start**: `startLadder` (or auto-start at triage per `autoStart`) sets `startedAt = max(now, nextQuietExit(now))`; attempt 1 `scheduledFor = startedAt`. Quiet window = [21:00, 08:00) buyer-local (site policy): any candidate send time inside it shifts to the next 08:00.
- **Sequencing**: attempt k (>1) `scheduledFor = max(attempt_{k−1}.sentAt + cooldownHours[kind_{k−1}], now)`, then quiet-shifted. Cooldowns: message→next 4h; sms→next 16h; voice→next 8h; agent-call terminal.
- **Expiry**: `expiresAt = startedAt + ladderExpiryHours` (48h default; no quiet shift — expiry is a deadline). When the mock clock passes `expiresAt` with no confirm captured (only via the declared clock-advance cadence or replay), the order resolves `auto-cancelled`, a final-notice attempt records as sent at `expiresAt`, buyer history `unreachable += 1`, `auto-cancelled` digest notification emits.
- **Dispatch**: attempts fire when their `scheduledFor` passes the mock clock during declared cadences; state machine queued → sending → sent → delivered → read → responded (channel-state fixtures advance on the event script, §4); channel failure → `failed` + failover: next rung's cooldown runs from the failure time (policy `failover: true` seeded).
- **rescheduleAttempt**: accepts `toAbsolute` OR `deltaMinutes` (mutually exclusive — VALIDATION otherwise); validates: target outside quiet hours (else VALIDATION with `nextEligibleTime` in details — contract rule 7), target < `expiresAt` (else VALIDATION naming expiry), attempt still `queued` (else CONFLICT). Updates `scheduledFor`; emits `attempt.scheduled`.
- **Manual paths**: `logManualContact` creates an agent-call rung (or records against the active one), appends the BuyerResponse-equivalent outcome to buyer history (confirmed-with-window also requires a subsequent recordBuyerResponse carrying windowId — the two-step mirrors real call flow), and appends ActivityEntry. `recordBuyerResponse`: type+windowId validated against eligibility (zone match, remaining > 0, lead time — else VALIDATION with the eligible set in details); confirm+window creates exactly ONE WindowAgreement chained to (responseId, attemptId, capturedAt) and decrements window committed (event `window.capacity`); reschedule-request on a confirmed order supersedes the old agreement (chain preserved); duplicate response on a resolved order → CONFLICT with both payloads (idempotency-key duplicates return the ORIGINAL result — never a second mutation).

### 2.3 The window engine

`proposeWindowsForOrder`: filter catalog by (zoneCode match), (remaining > 0), (window date + start ≥ now + minimumLeadHours 6h), (date ≤ now + horizon 7d); sort by date then startsAt; cap 24. Full windows return as `remaining: 0` entries ONLY inside listDeliveryWindows — proposals exclude them but the UI's filtered-empty names them (P01 discipline, 11 copy).

### 2.4 Imports, manifests, jobs

- **importOrders**: fixed row-splitting (no randomness); column mapping preview; row validation (orderRef/phone/city/value required; zone optional); unknown zone → `awaiting-input` row (both rows shown, explicit choice); duplicate orderRef → `awaiting-input` with keep/skip; progresses determinate 8 rows / 1.6s; partial-results with failed-row retry; every imported order is triaged through §2.1 (risk computed at import; holds routed per rules; auto-start per policy) — the queue NEVER renders an unscored row.
- **createHandoffManifest**: by selection or byFilter; engine admits ONLY `confirmed` orders for the routeDate window set; a selection containing non-confirmed returns VALIDATION with excluded ids in `details` (visible-not-silent); rollup computed from admitted set; draft editable.
- **sealHandoffManifest**: requires `confirmedCount` echo; mismatch → CONFLICT (contract rule 6 demo); seals freeze orderIds; sets orders `manifested`; emits `manifest.sealed`; late confirmations surface via `nextManifestPath` (next routeDate with open capacity).
- **exportManifest / exportConfirmationLedger**: Jobs producing fixed artifact descriptors with expiry (7 days); ledger scope by period or orderId; retry scoped to failed items; `cancelJob` resolves within one interaction.
- **simulateRiskPolicy**: pure recompute of §2.1 for all open (non-terminal) orders under current vs proposed weights → band rollup + top-5 |delta| movers. `updateRiskPolicy` without `simulationConfirmed: true` → VALIDATION (contract rule 3 demo); weight sums ≠ 1 → VALIDATION with component details.

### 2.5 Permissions, errors, idempotency

- Role gates: agent — queue/ladder/manual-contact/response/window proposal; manager — everything incl. holds, policies, buyers, templates, users; dispatch — manifests (build/seal/export) + read. Violations → PERMISSION with the named capability. Suspended users → PERMISSION on all mutations.
- Every method can return each applicable error class via failure injection; correlationIds fixed (`corr-0001`…).
- Idempotency: duplicate keys on the 15 keyed operations return the original result — never a second mutation (contract rule 2 demo).

## 3. Failure injection (per method, configurable)

`MockConfig = { latencyMs?: number; errorRate?: number; errorCode?: ErrorCode; failChannelKinds?: AttemptKind[]; clockAdvanceHours?: number; offlineQueueBehavior?: 'discard-resolved' | 'flush-all' }` — applied per method name via a config map; `failChannelKinds` makes those rung kinds return channel-level failures (failover fixtures); `clockAdvanceHours` advances the seeded clock deterministically to exercise expiry/auto-cancel without wall-clock dependence. Defaults: zero latency, zero errors, no clock advance. One config object at construction (no environment variables, no network).

## 4. Test-support operations (mock-only, outside v1 contract)

`reset()` — restores seeds and clock · `snapshot()` — deep clone for assertion · `replay(events)` — applies a recorded event list to reach a state deterministically · `seedSummary()` — emits the fixture tables above as data (tests assert against the same named world the spec documents). The live subscription replays a fixed 7-event script at 40ms cadence on subscribe (imported → triaged → attempt.state → response.captured → agreement.stamped → window.capacity → manifest.sealed), then emits on real mutations; unsubscribe is exact (no leaks). Never called by product UI.

## 5. No-go guarantees

No timers beyond declared cadences; no randomness anywhere (variation = seeded fixture selection by input hash); no network; no provider imports; no persistence across resets; the risk engine and the ladder engine are pure and shared between seed-build and runtime — the mock cannot ship a score or a schedule its own engines cannot reproduce. Two identical runs produce identical transcripts, including explanation strings, event order, and artifact descriptors. **No AI anywhere in the mock**: the declared conditionally-AI posture (00, 07a determinism statement) is honored by construction — every `RiskScore.engine` is `'rule-scorecard'`, there is no model call to stub, and the enrichment capability is simply unbound (the degraded posture IS the shipped mock posture, 08 degradation map).
