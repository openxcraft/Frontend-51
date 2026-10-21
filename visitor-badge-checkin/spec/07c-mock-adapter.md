# 07c — Mock Adapter: visitor-badge-checkin

In-memory, deterministic, zero external dependencies. Implements `VisitorBadgeAdapterV1` (07b). Exports and sweeps are **simulated async stages** per async-contract.md: Jobs that walk queued → running (milestone progress) → succeeded against fixed tables — no network, no timers beyond declared cadences. **Seeded clock: 2026-11-04T09:40:00+03:00 (Wednesday, Riyadh)** — every derived computation below is evaluated against that instant unless a test advances it.

## Seeds (fixed, named)

### Workspace W1 — "دار مجد للاستشارات" / "Dar Majd Consulting"
Riyadh professional-services firm, 180 staff. defaultLocale 'ar'. retention { visitLogMonths: 12, archiveExportable: true }. Purposes: اجتماع/meeting · مقابلة عمل/job interview · تسليم مستندات/document delivery · صيانة/repair visit · جولة تعريفية/office tour. Notify tiers: arrival=instant, invitation-sent=daily-digest, sweep-summary=daily-digest.

### Members (5)
Muna Al-Otaibi — owner/admin (مونة العتيبي) · Reem Hassan — receptionist (ريم حسن) · Khalid Al-Shammari — host, Advisory (خالد الشمري, notify app-plus-channel) · Faisal Al-Otaibi — host, Tax (فيصل العتيبي, notify app) · Salma Al-Qahtani — viewer, Facilities (سلمى القحطاني). One **inactive** host fixture: Hend Al-Dosari (هند الدوسري, active: false) — CP-2 edge fixture (picker filters her; old visits still name her).

### VisitorProfiles (2)
"أحمد الشمري" — normalizedName "احمد الشمري" (tashkeel stripped, hamza unified), phoneLast4 4417, lastVisit 2026-10-12 (vendor type then). "Sarah Mitchell" — normalizedName "sarah mitchell", no phone. The returning-visitor kiosk fixture types **"احمد الشمرى"** (hamza-less alef + alif-maqsura spelling variant) → `lookupReturningVisitor` returns the first profile with `normalizationApplied: true` (the alef and yaa rules fired) — regression assertion.

### BadgeTemplates (3)
T1 "البطاقة القياسية" / "Standard badge" — **v2 ACTIVE**: fields all on; bands for all five types (guest slate · vendor amber · contractor teal · interview violet · VIP green, each with its locked deep text token per 05); layoutDefault rtl-first; layoutVariantForLatinVisitors true; stockSize adhesive-standard; nameLengthBudget 28. **v1 RETIRED** (history). T2 "بطاقة الزوار الكبار" / "Executive badge" — **v3 DRAFT** with one planted BLOCKING validation issue (vendor band carries no deep text variant — the 05 contrast lock) and one WARNING (nameLengthBudget 22 < the longest seeded name's 30 chars). Validation fixture for CP-5.3.

### Visits (the sample day + history)
- **V1 invited (expected next)**: نورة القحطاني · company هيئة التنمية · type guest · purpose اجتماع · host Khalid · window 11:00–12:00 · checkInCode **7K4QM2** (deterministic rule below). Events: invitation-created. At 09:40 she renders in expectedNext with derivedNoShow false.
- **V2 checked-in (in building, Latin-script + correction-chain fixture)**: Sarah Mitchell · type interview · purpose مقابلة عمل · host Faisal · window 09:00–10:00 · walk-in origin · checked-in 09:07 · badge B-2a voided (reason: correction, note "name rendered as Sara Mitchel — one l missing") → replacement **B-2b issued** (screen-pass, 09:09; lineage links both ways) · host-notified (channel in-app, delivered true). Events chain: checked-in → badge-issued → badge-voided → badge-corrected → badge-issued.
- **V3 checked-out (complete lifecycle fixture)**: ماجد الحربي · company شركة الأنظمة الذكية · type vendor · purpose صيانة · host Khalid · walk-in · window 08:30–09:30 · checked-in 08:34 · badge B-3 issued (print) · checked-out 09:22 via badge-code · B-3 voided (reason: checked-out).
- **V4 invited, derived no-show (long-name fixture)**: عبدالعزيز بن سليمان الرشد · type vip · purpose جولة تعريفية · host Muna · window 08:00–08:30 (elapsed at 09:40) · derivedNoShow **true** at read; status stays 'invited' — never auto-cancelled (07a obligation).
- **V5 invited (tomorrow)**: Mohammed Al-Zahrani · type contractor · purpose تسليم مستندات · host Faisal · window 2026-11-05 10:00–11:00 · code **3F8NRW**. Early-arrival fixture: advancing the clock to 10:31 (window.end + 31 min > 15 grace) makes it derivedNoShow; at 10:20 check-in succeeds inside the grace.
- **V6 archived history**: 14 visits from 2026-06/09 (mix of types, hosts, statuses) — log pagination and search fixtures; one carries hostId = inactive Hend (07a: members never deleted, history keeps naming her).

### Jobs & artifacts history
Export daily-log for 2026-11-03 succeeded (artifact A-1, **EXPIRED** at 09:40 — NOT_FOUND + regenerable fixture) · end-of-day-sweep 2026-11-03 18:05 succeeded ("checked out 1 visit left open at 18:05" — the swept-open-visit event fixture) · retention-sweep: never run (first run scheduled end of month).

## Deterministic computation rules (EXACT — fixed tables, no randomness)

1. **Check-in code**: `code = first6(base32(sha256(workspaceId ':' visitId)))` over the unambiguous charset `23456789ABCDEFGHJKLMNPQRSTUVWXYZ` (no 0/O/1/I by construction). Lookup normalization: uppercase + strip spaces/hyphens; because the charset excludes ambiguous glyphs, an input containing O or I normalizes to nothing — it returns NOT_FOUND, never a guess (disambiguation-by-rejection, stated in the lookup's rule disclosure).
2. **Name normalization pipeline** (returning-visitor + search): strip tashkeel → أ/إ/آ→ا → ة→ه → ى→ي → strip tatweel (ـ) → collapse internal spaces → lowercase Latin letters. Stored read-only on VisitorProfile; disclosed at the match surface (ai-native-patterns §7.4 discipline applied to deterministic matching).
3. **Returning-visitor match rule**: normalized-name exact AND phoneLast4 exact → single auto-offered candidate; normalized-name exact only → candidate list, each requiring explicit confirm; phone-only NEVER matches (no fishing by number). The seeded variant "احمد الشمرى" MUST land on "أحمد الشمري"'s profile on every run (regression assertion).
4. **Script detection**: Arabic-block letters ≥ 50% → 'arabic'; Latin ≥ 50% → 'latin'; otherwise 'mixed' (drives the badge layout variant).
5. **Badge validity window**: `from = checkInAt`, `to = max(window.end, checkInAt + 120 minutes)` — printed on the badge; all badges additionally void at same-day 23:59 local by the end-of-day sweep (materialized as void reason 'expired').
6. **No-show derivation (read-time)**: `status = 'invited' AND now > window.end + 15 minutes`. V4 satisfies it at the seeded instant; V5 does not (window tomorrow).
7. **In-building list (read-time)**: `status = 'checked-in'` at the query instant; durations computed as `now − checkInAt` in Western numerals.
8. **End-of-day sweep (Job, 18:05)**: appends `swept-open-visit` events to visits still checked-in at 18:00, voids their badges (reason 'expired'); appends `swept-no-show` events to elapsed invitations; produces the sweep-summary artifact. Atomic per visit.
9. **Retention sweep (Job, monthly)**: visits whose last event predates `now − visitLogMonths` move to archived state: excluded from live lists, included in archive exports (V6-class rows remain live — 12 months has not elapsed; the rule is exercised by the configurable window in tests).
10. **Host notification (checkInVisitor side-effect)**: event `host-notified` with `channel = 'outbound-channel'` when the outbound channel is bound AND the host's notifyPrefs = 'app-plus-channel', else `channel = 'in-app'`; `delivered = true` always for in-app (the desk board + host surface are the fallback — LOOP-5); for outbound, `delivered = false` only when `failNotifyOnce` is set (the recorded-event-before-delivery fixture: the event persists, flagged).
11. **Badge spec resolution**: active template for the visit's visitorType (fall back to T1 if a type's template was retired without successor → VALIDATION at saveKioskConfig prevents this); spec pinned at resolution; visitor name truncates at word boundaries with a trailing ellipsis when display length exceeds `nameLengthBudget` (28) — the preview flags it as a WARNING, issuance proceeds (V4's 30-char name exercises the truncation on the fixture path).

## Behavior

- `getVisitByCheckInCode('7k4qm2')` (lowercase input) → V1 with prefill (company, purpose) — case normalization fixture; '7K4QMX' → NOT_FOUND with the walk-in offer (11 copy).
- `checkInVisitor` (code path) → V1 transitions, `host-notified` appended, badge B-1 created **ready** with resolvedSpec from T1 v2 (rtl-first, guest slate band, name نورة القحطاني, validity computed by rule 5); `issueBadge` with via 'print' → issued + print-ready artifact (expiry 7 days); replaying the same idempotency key returns the identical visit+badge state (double-tap fixture).
- `checkInVisitor` (walk-in path) with the variant name + profileId → linked profile, event detail records the confirm; without profileId → normal walk-in (the confirm is offered, never forced).
- `checkInVisitor` on V4 at the seeded instant → VALIDATION ("window elapsed 70 minutes ago — the host stopped expecting this visit; reception can help" + the honest state, 11 copy).
- `updateVisit`/`saveBadgeTemplate`/`updateHost` stale versions → CONFLICT with both payloads. `updateVisit` on V2 (checked-in) → VALIDATION naming the forward-only rule.
- `voidBadge` without reason → VALIDATION ("the correction chain needs its why"); with `replacement.fieldPatches { nameDisplay: 'Sarah Mitchell' }` → voided + chained replacement, both lineage links populated (the V2 chain replays this rule).
- `exportVisitorLog('daily-log', 2026-11-03)` → Job paced in fixed stages (queued 100ms → running "visit 12 of 23" → succeeded, 23 rows); artifact expiry 7 days; A-1 expired → NOT_FOUND + regenerable; `failExportFormatOnce` → partial delivery (1 of 2 formats) with per-format retry (async-contract §4).
- `listVisits` search 'احمد الشمرى' → normalized match on profile-liked names across V6 history (rtl-rules §4 fixture); `mine: true` under Khalid's session → V1, V3 only (host-mode scoping).
- `getUsage`: window "monthly"; invitationsCreated 41; outboundNotifications 12 of 500; exports 6 — no meter renders for records or check-ins (00 pricing posture: the loop is never rationed).
- Error injection per method: MockConfig `{ latencyMs, errorRate, errorCode, channelBound, failNotifyOnce, failExportFormatOnce, offlineKiosk }`; fixed correlationIds `vbc-corr-0001`…; `offlineKiosk` simulates the P20 local queue (check-ins queue with per-item state and reconcile by code on reconnect — CP-1 failure path fixture).
- **Remaining error-class fixtures (typed per the 07b union)**: PERMISSION — a host-session attempt to `updateVisit` on Khalid's V1 under Faisal's session, and a viewer-session `issueBadge`, both → PERMISSION naming the role rule (07b rule 7); a check-in on a visit hosted by inactive Hend → PERMISSION with the pick-another-host edge. RATE_LIMIT — `quotaExhausted` config drives `checkInVisitor` to succeed (the arrival always records) while the outbound channel surface returns RATE_LIMIT with the window reset (11 copy); an export beyond the hourly window → RATE_LIMIT naming the retry time. NETWORK — `offlineKiosk` and a list-fetch interruption exercise the P20 banner copy; the kiosk commit reconciles by code on reconnect. UNKNOWN — `errorCode: 'UNKNOWN'` injection returns the typed retry surface with correlationId `vbc-corr-0001` (11 copy).

## Test-support

reset() / snapshot() / replay(): full state restore, no randomness, no network, no timers beyond the declared cadences. Regression assertions: the normalization variant lands on its profile; V4 reads as derivedNoShow without status mutation; the V2 correction chain renders both lineage links; code lookup is case-normalized and rejection-safe; replayed idempotency keys return identical states; every 07b error class injectable and typed per the union; the expired artifact returns NOT_FOUND with a regenerate path; clock advancement (to 10:20, 10:31, 18:05, month-end) exercises rules 5–9 exactly as written.
