# 07c — Mock Adapter: asset-register-tracker

In-memory, deterministic, zero external dependencies. Implements `AssetRegisterAdapterV1` (07b). Label-batch generation and register exports are **simulated async stages** per async-contract.md: Jobs that walk queued → running (determinate, unit counts) → succeeded against fixed tables — no network, no timers beyond the declared cadences. Non-AI by construction: every "decision" (tag sequence, label code derivation, custody state transitions) is a fixed table or pure function specified below.

## Seeds (fixed, named)

Workspace WS-1 — "Riyadh Legal Consultancy / الرياض للاستشارات" · tagPrefix "AST" · nextTagSequence 0313 (tags 0001–0312 seeded; retirement never returns tags to the pool) · defaultLocale 'en'.

### Categories (6)
CAT-1 "Laptops / حاسوب محمول" (code LAP, 84 assets) · CAT-2 "Monitors / شاشات" (MON, 96) · CAT-3 "Phones / هواتف" (PHN, 58) · CAT-4 "Printers & AV / طابعات وصوتيات" (AV, 31) · CAT-5 "Networking / شبكات" (NET, 22) · CAT-6 "Furniture & fixtures / أثاث وتجهيزات" (FX, 21). **312 assets total** — the realistic-volume registry (Maha's firm, 02).

### Locations (11-node tree)
L-1 "Riyadh HQ / المركز الرئيسي" (building) → L-2 "Floor 3 / الطابق الثالث" → L-3 "Storeroom 3-B / مخزن ٣-ب" (storeroom), L-4 "Floor 4 / الطابق الرابع" → L-5 "Meeting rooms / قاعات الاجتماعات", L-6 "Floor 5 / الطابق الخامس" → L-7 "Open desks / مكاتب مفتوحة" · L-8 "Jeddah Branch / فرع جدة" (building) → L-9 "Jeddah office / مكتب جدة" → L-10 "Jeddah storeroom / مخزن جدة" (storeroom) · L-11 "Service vehicle 1 / مركبة الخدمة ١" (vehicle — the bidi-fixture location name carrying Arabic-Indic digits in its name while asset numerals stay Western per ledger).

### People (28)
P-0001..P-0028 — bilingual fixtures: Arabic-only names ("عبدالرحمن الشهري", "نورة القحطاني"), Latin-only names ("Daniel Whitfield", "Priya Nair"), and dual-script pairs ("Omar Haddad / عمر حداد", "Reem Al-Rashid / ريم الراشيد") — the bidi-isolation test set (rtl-rules §2). P-0021 "Sara Mahfouz / سارة محفوظ" is `inactive` with two historical custody events (the never-deleted-person fixture). Departments: Legal, Ops, IT, Finance, Translation.

### Assets (312, generated deterministically)
AST-0001..AST-0312 distributed across the six categories and eleven locations by fixed modulo tables (e.g. laptops cycle desks/storeroomes; monitors dense on floors 4–5; AV concentrated in meeting rooms + vehicle). Identity data: bilingual names ("Dell Latitude 5540 — Sarah's loaner / حاسوب سارة الاحتياطي"), serials ("5CG1394MXQ"), models. ** custody states by fixture**: 214 in-stock, 71 with-holder, 27 return-pending (due dates in the past — the P21 digest fixture). Every asset carries `version` derived from its event history.

### Custody chains (the named fixtures)
- **AST-0107 (laptop) — the full-chain fixture**: seq 1 assign → P-0003 (typed-name signature "عبدالرحمن الشهري") · seq 2 return (good, staff-attest) · seq 3 assign → P-0011 (scan-ack, two-device path) · seq 4 transfer P-0011 → P-0017 (drawn mark + typed witness "Priya Nair") · seq 5 **correction** — corrects seq 4: "transfer recorded to the wrong person at hand-off; the kit moved to Omar Haddad (P-0009)" (plum marker fixture; the chain never edits) · seq 6 assign → P-0009 (typed-name) — currently with-holder, due date future.
- **AST-0231 (projector) — return-pending fixture**: assign → P-0014 with dueOn 9 days past; condition at assign "good".
- **AST-0199 (camera lens) — damaged-return fixture**: assign → P-0022 · return with condition "damaged" + note "front element scratched" (the condition-evidence fixture Noor lives on).
- **AST-0044 — sighting fixtures**: three sighting events at L-7 from an audit walk (kind 'sighting', no signature, condition good) + one at L-11 locating it away from its registered location (the sighting-updates-location fixture, 03 CP-5.1 edge).
- **AST-0288 — inactive-person fixture**: two historical events naming P-0021 (inactive) — the chain keeps her name (never-deleted people).
- **AST-0301, AST-0302 — retired fixtures**: retirement records — AST-0301 method 'destroyed', certificateRef "SHRD-2026-0117", counterparty "destruction vendor", disposalDate 2026-02-11 (data-bearing-device fixture); AST-0302 method 'donated', counterparty "school retrofit program", certificateUnreferenced: false. Their labels are state 'retired'; custody chains end with automatic retirement events.

### Labels & batches
- **LB-2026-03-01** (succeeded): 60 labels (25mm, a4-65up) for AST-0228..AST-0287 — 57 applied, 2 printed-not-applied (the normal long-lived partial state), 1 damaged (AST-0251, note "label peeled off the dock") with replacement label LB-2026-03-01-R1 state 'requested' (replacedByLabelId chain fixture). Sheet artifact ART-0021 **EXPIRED** (7-day window elapsed — NOT_FOUND + renew fixture).
- **LB-2026-03-09** (succeeded): 12 labels (40mm, a4-24up) for the AV refresh — all applied.
- Scattered single labels in 'printed' state for draft assets (registration-before-labeling fixture).

### Jobs history
LB-2026-03-01 (succeeded, 60/60 labels) · LB-2026-03-09 (succeeded) · EXP-0001 (succeeded — full register CSV, custody history included, artifact ART-0017 active, expires 7 days from seed time) · EXP-0002 (failed — NETWORK fixture with typed error + retry).

## Deterministic functions (the non-AI declaration made concrete)

- **Tag assignment**: `AST-` + zero-padded 4-digit `nextTagSequence`, incremented per create, never reused (retirement does not return tags to the pool).
- **Label code derivation**: fixed per asset from a stable hash table seeded in the fixture (opaque, non-sequential, registry-scoped); identical input always yields identical code — regression-assertable.
- **Custody transitions**: pure state machine per 07a — assign: in-stock→with-holder (dueOn optional; when present and past, with-holder→return-pending is a derived read, not a write); return: with-holder/return-pending→in-stock at event location; transfer: holder swap; sighting: custody untouched, location updated to the scanned location (the event is the evidence); correction: no custody mutation, references the corrected event; retirement: freeze + label retired.
- **Return-pending derivation**: `custody.state` is recomputed at read from (holder, dueOn, now) — the mock's clock is the seed's fixed timestamp so the fixture is stable.
- **Progress cadences**: label batch 40ms/label determinate; export 100ms per stage (scope → rows → pack), all announced in unit counts.

## Behavior

- `createAsset`: tag assigned sequentially; duplicate serial within workspace → allowed (serials are facts, not identity — recorded note in response); draft status, labelState 'none'.
- `requestLabelBatch`: any asset with a live label not in damaged/missing/retired → VALIDATION naming the asset and the report-label path; batch paces 40ms/label; `failBatchOnce` config → failed job with typed error, labels remain in 'requested' (atomic per batch — never half-printed); idempotency-key replay returns the original job.
- `confirmLabelApplied`: label not 'printed' → VALIDATION ("already applied" / "not in a printed batch" — the exact state named); success → label 'applied', asset 'active' if draft; replay-safe via idempotencyKey (offline queue fixture).
- `reportLabelState`: live label → damaged/missing with note + reporter logged; then `requestLabelBatch([assetId])` succeeds and creates the replacement (replacedByLabelId chain).
- `recordCustodyEvent`: signature-shape violations → VALIDATION naming the missing element ("assign requires the receiver's signature"); assign on retired asset → VALIDATION naming the retirement; sighting never requires a signature; correction without `correctsEventId` → VALIDATION; stale offline queue replays reconcile by idempotencyKey; `conflictPersonCreate` config → createPerson CONFLICT with both payloads (12 Q-8 merge fixture).
- `lookupByScan`: known code or typed tag → ScanLookupResult with actorScopes by session role (shared-link session → read-only scopes); unknown → NOT_FOUND with last-4 of the code; `throttleScans` config → RATE_LIMIT after N calls in the window (abuse-posture fixture — human rates never trip it).
- `updateAsset`: stale baseVersion → CONFLICT with both payloads; edits to retired assets → PERMISSION ("retired registers are frozen — corrections live on the activity log").
- `retireAsset`: with-holder/return-pending → VALIDATION naming the holder; success → RetirementRecord + retirement event + label 'retired' + version bump; idempotent replay returns the same record.
- `exportRegister`: scope matching zero assets → VALIDATION naming the empty scope; format csv|json; `includeCustodyHistory: true` packs per-asset chains; artifact 7-day expiry; ART-0021 expired → NOT_FOUND + regenerable path; `failExportOnce` config → failed job + retry (per-job retry, register state untouched).
- `getUsage`: window "monthly"; assetsTracked 312; labelBatches 2; exports 1 of 10 (the meter that matters is volume, not seats — 12 Q-3 pricing posture).
- Error injection per method: MockConfig { latencyMs, errorRate, errorCode, failBatchOnce, failExportOnce, throttleScans, conflictPersonCreate, expireArtifact }. Fixed correlationIds `ar-corr-0001`…

## Test-support

reset() / snapshot() / replay(): full state restore; no randomness, no network, no timers beyond the declared cadences. Regression assertions: tag sequence never reuses retired tags; AST-0107's correction references seq 4 and mutates nothing; the 27 return-pending fixtures derive identically at the fixed clock; ART-0021 stays NOT_FOUND until renewed; replacement-chain (LB-2026-03-01-R1) links via replacedByLabelId; every error class injectable and typed per the 07b union; offline-queue replay (idempotencyKey) never double-appends events or applies.
