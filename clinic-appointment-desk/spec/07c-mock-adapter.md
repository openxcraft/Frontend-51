# 07c — Mock Adapter: clinic-appointment-desk

In-memory, deterministic, zero external dependencies. Implements `ClinicAppointmentAdapterV1` (07b). The patient-messaging channel is **simulated only**: `channelBound: false` is the audited default state — channel sends return PERMISSION naming the capability class (07b rule 7) and every outbound surface completes through the phone-script path, which is the tested primary (LOOP-5). No network, no timers beyond declared cadences.

## Seeded world (fixed, named)

**Clinic W-1 — "عيادة روضة الخليج" / "Gulf Rose Clinic"** (Riyadh; working days Sunday–Thursday `[0,1,2,3,4]`; default locale `ar`). **Seeded clock: Sunday 2026-10-18T09:15:00+03:00** — the mock clock is fixed; it advances only through the declared `tick(minutes)` test hook, never on its own.

### Providers (3)

- **PR-1 — د. أمينة الرشيد / Dr. Amina Al-Rashid** (GP): sessions Sun–Thu 08:00–13:00, 16:00–19:00; visit types CONS/FU/VAX.
- **PR-2 — د. فاريس حداد / Dr. Faris Haddad** (Pediatrics): Sun–Thu 09:00–13:00, 17:00–20:00; CONS/FU/VAX.
- **PR-3 — د. ريمي شاهين / Dr. Remy Shahine** (Dental): Sun, Tue, Thu 10:00–14:00; CONS/DC.

### Visit types (5)

CONS استشارة / Consultation 20m · FU متابعة / Follow-up 10m · VAX تطعيم / Vaccination 15m · DC تنظيف أسنان / Dental cleaning 45m · UR مراجعة عاجلة / Urgent review 15m.

### Patients (14, bilingual; phone = Saudi mobile format, Western numerals)

P-001 مريم عبدالله القحطاني / Mariam Al-Qahtani (ar, 0551000001, 0 no-shows) · P-002 أحمد الغامدي / Ahmed Al-Ghamdi (ar) · P-003 ليلى منصور / Layla Mansour (ar, 0551000003) · **P-004 خالد العتيبي / Khalid Al-Otaibi (ar, 3 no-shows in window → pattern flag ACTIVE — the verify-before-believe fixture; his `flagAppointments` list carries the 3 dated entries)** · P-005 نورة الشمري / Noura Al-Shammari (ar) · P-006 سارة فؤاد / Sara Fouad (en — English-template fixture) · P-007 سعود الدوسري / Saud Al-Dosari (ar) · **P-008 إينا شارما / Ina Sharma (en, Latin-only name — bidi fixture)** · **P-009 نادية إبراهيم / Nadia Ibrahim (ar, 1 no-show in window → NO flag — threshold boundary fixture)** · P-010 عبدالعزيز الحربي / Abdulaziz Al-Harbi (ar) · P-011 هند المطيري / Hind Al-Mutairi (ar) · **P-012 ديفيد أوكافور / David Okafor (en, 2 no-shows BOTH older than 180 days → NO flag — window boundary fixture)** · **P-013 نور ليلى منصور / Nour Layla Mansour (ar — child; SHARES 0551000003 with P-003 → "2 patients share this number" finder fixture)** · P-014 محمد السبيعي / Mohammed Al-Subaie (ar).

### Today's board — Sunday 2026-10-18 (18 appointments, all states planted)

PR-1: A-1001 (08:20, P-002, CONS, completed) · A-1002 (08:40, P-005, FU, completed) · A-1003 (09:00, P-006, CONS, checked-in) · **A-1007 (09:00, P-009, CONS, no-showed — declared 09:10 by frontdesk; the 09:00–09:20 slot's remaining time at the seeded clock is 5 minutes < the 15-minute same-day floor → refill correctly NOT offerable: the `sameDayRefillFloorMinutes` fixture)** · A-1004 (09:40, P-001, CONS, confirmed) · A-1012 (11:00, P-011, CONS, **cancelled 09:02 patient-cancelled via message reply M-1031 — the seeded value moment: its slot opened and fill F-1 ran**) · A-1005 (11:40, P-010, VAX, confirmed) · A-1006 (12:20, P-013, VAX, booked — the child on the shared phone).
PR-2: A-1008 (09:20, P-003, CONS, in-consult) · A-1009 (10:00, P-007, FU, confirmed) · A-1010 (10:40, P-012, CONS, booked — flagged-history patient, NO active flag) · A-1013 (11:20, P-005, CONS, booked) · A-1011 (12:00, P-002, FU, unconfirmed booked).
PR-3: A-1014 (10:00, P-008, DC, checked-in) · A-1015 (11:00, P-004, CONS, booked — **the active-flag patient on today's board: the flag glyph renders, booking proceeded (07b rule 3 fixture)**) · A-1016 (12:00, P-014, DC, booked) · A-1018 (13:00, P-006, CONS, booked).
Tomorrow (Monday 2026-10-19): 6 booked appointments across PR-1/PR-2 (ladder fixture — their reminders are scheduled) · **F-0 superseded fill fixture** (see below).

### Waitlist (6 entries)

W-1 P-001, CONS, provider any, window 2026-10-18→31, routine, requestedAt 2026-10-05 (waitedDays 13, no-shows 0 → **score 26**) · **W-3 P-007, CONS, provider any, routine→URGENT (staff-set), requestedAt 2026-10-16 (waitedDays 2 → 100+4 = 104)** · W-4 P-009, CONS, any, routine, requestedAt 2026-10-12 (waitedDays 6, no-shows 1 → penalty 10, **score 2**) · **W-2 P-004, CONS, any, routine, requestedAt 2026-10-10 (waitedDays 8 → 16, no-shows 3 → penalty 30, score −14 — ranked last of eligible: the penalty-disclosure fixture)** · W-5 P-011, CONS, any, window starts 2026-10-20 → **window-miss ineligible for today's slots** · W-6 P-014, DC, PR-3, routine → **already-booked ineligible (A-1016 today) AND duration-mismatch vs 20m CONS slots — the double-ineligibility fixture; first reason wins in declared filter order**.

### Fill F-1 — the seeded open fill (for A-1012's cancelled 11:00 PR-1 CONS slot)

Triggered-by cancellation A-1012; policyVersion v1. Candidates in rank order: **W-3 (104)** → W-1 (26) → W-4 (2) → W-2 (−14) → W-5 (window-miss) → W-6 (already-booked). Offer **O-1 pending to W-3 (P-007 سعود الدوسري), sent 09:04 via `sendPath: 'phone-script'` (Reem called and read the script; outcome pending) — expires 09:19, 4 minutes remain at the seeded clock: the live countdown fixture (phone-script offers expire on the same clock, rule 5). Accepting O-1 books P-007 into the 11:00 slot (Slot Refill moment), closes W-3, sets F-1 state slot-refilled.**

### Fill F-0 — superseded fill (yesterday's Monday 2026-10-19 10:00 PR-2 slot)

Offer O-0 to P-010 declined 2026-10-17 14:10 (recorded via phone) → next candidate W-1 offered → offer expired (120-minute future-window expiry) → the slot was then booked directly by phone (A-1019 exists on Monday) → F-0 state **superseded**; the declined offer never penalized any entry (regression assertion).

### Messages (outbox, ~20 rows)

Today: confirmation-request batch sent 08:00 for today's appointments — M-1029 replied-confirmed (P-001, ar) · **M-1031 replied-declined (P-011, ar — the reply that drove A-1012's cancellation; `cancelAppointment.sourceMessageId` provenance fixture)** · M-1033 pending reply (P-002, ar) · **M-1030 replied-confirmed (P-006, en — English template rendering fixture)** · **M-901 waitlist-offer (P-007, ar, sent, offer O-1)** · M-902 waitlist-offer phone-script path fixture (P-010, en, sent via `sendPath: 'phone-script'` with `replyRecordedBy` frontdesk F-2 — the manual path as first-class success) · **M-1040 failed (NETWORK, correlationId cad-corr-0007) with per-message retry available — the failure fixture**. Tomorrow's ladder: 6 reminders scheduled (M-2001..M-2006, mixed locales ar/en per patient file). Yesterday: message-batch job with 2-of-14 partial failure (per-message retry fixture).

### Jobs & artifacts

Export E-1 (day-sheet 2026-10-17, formats board-print + provider-lists + day-counts) succeeded — artifact **A-sheet-1017 valid, expires 2026-10-24** (regenerable); **artifact A-sheet-1016 (day-sheet 2026-10-10) EXPIRED — `getArtifact` returns NOT_FOUND with the regenerate path (the expired-artifact fixture, 11 C)**. Export E-2 (2026-10-18) queued at 09:00 — running fixture with determinate progress. Message-batch B-1 succeeded 08:00; B-0 failed partial (12 sent, 2 failed). Activity log carries entries for every seeded mutation (P-004's three no-show declarations included, with actors).

## Deterministic computation rules (fixed — the product's core heuristics, EXACT)

1. **Normalization at search**: strip tashkeel; أ/إ/آ → ا; ة → ه; ى → ي (rtl-rules §4); phone digits compared exactly (Western numerals canonical).
2. **No-show derived stats**: `noShowCountWindow` = count of the patient's appointments with state `no-showed` whose state-entered timestamp falls within `trailingWindowDays` (180) before the mock clock's now; `patternFlagActive` = `noShowCountWindow >= flagThreshold (2)` — recomputed at every read; never stored authorless.
3. **Waitlist ranking (the fixed formula)**: for each active entry, `waitedDays = floor((slot.startDate − requestedAt) / 1 day)`; `score = (tier === 'urgent' ? tierPoints 100 : 0) + min(waitedDays, waitedDayCapDays 60) × waitedDayPoints 2 − min(noShowCountWindow × noShowPenaltyPoints 10, noShowPenaltyCap 30)`. Rank: score descending; ties → `requestedAt` ascending; then `entryId` ascending (lexicographic). The same slot + waitlist + policyVersion always yields the same candidates array.
4. **Eligibility filter order (declared, first-match-wins on reason)**: entry closed (`entry-closed`) → patient already booked that date (`already-booked`) → visit-type duration > slot duration (`duration-mismatch`) → provider mismatch (`provider-mismatch`) → slot date outside [windowStart, windowEnd] (`window-miss`). Ineligible rows render in the fill view with their reason — the why-not-offered disclosure (06).
5. **Offer lifecycle**: expiry = send time + 15 minutes (same-day slot) or + 120 minutes (future slot); a fill carries at most 3 offers per run; decline/expiry advances to the next ELIGIBLE candidate; `superseded` set when the slot books by any other path; phone-script offers expire on the same clock.
6. **Same-day refill floor**: a slot's remaining time (now → slot end) < `sameDayRefillFloorMinutes` (15) → `runWaitlistFill` returns a VALIDATION naming the remaining minutes (the A-1007 fixture must fire this on every run).
7. **Reminder ladder scheduling** (default policy): T-48h reminder + same-day 08:00 confirmation-request; booked inside the 48h window → first message sends immediately (`send-first-immediately`); template rendering per patient `preferredLocale`; the clinic's cancellation-policy line (seeded bilingual text) appends to reminder templates only. The ladder NEVER auto-cancels — unconfirmed at expiry renders `expired`, staff decides.
8. **Slot computation**: free slots derive from provider session hours minus active (non-cancelled) appointments; duration-fit filters slots shorter than the visit type's duration (disclosed in the picker, 06).

## Behavior (per method, deterministic)

- `createAppointment`: overlap with an active same-provider appointment → CONFLICT naming both; seeded `conflictOnNextBooking` config forces the next call into the same CONFLICT (race fixture); success freezes `durationMinutes`, schedules ladder messages, appends activity, recomputes nothing hidden.
- `markNoShow`: appends the timeline event with `declaredBy`; recomputes derived stats deterministically (P-009's count goes 1→1 for older fixture or 0→1 as appropriate); remaining-time floor applies to any triggered refill (rule 6); `correctionOf` reverts a same-day no-show as a new event.
- `runWaitlistFill`: synchronous, <150ms at seed scale (10 budget); A-1012's slot → F-1 candidates exactly per rule 3/4 (regression assertion: W-3 before W-1 before W-4 before W-2, W-5/W-6 ineligible with reasons); re-run creates a NEW immutable fill (never mutates F-1).
- `respondWaitlistOffer`: accept → books the appointment with `bookWaitlistedEntryId`, closes the entry, sets fill `slot-refilled`, fires the Slot Refill moment (05) — the announcement text and count delta are asserted; out-of-rank accept (e.g., W-1 while W-3 pending) without `overrideReason` → VALIDATION; with a reason → succeeds + `override-recorded` activity entry; decline → next candidate offerable; expiry via `tick` past `expiresAt` → offer `expired`, next candidate available.
- `sendMessage` with `sendPath: 'channel'` and `channelBound: false` (default) → PERMISSION naming the patient-messaging capability class in capability language + the script path stated in `details` (the copy matrix renders both, 11); `sendPath: 'phone-script'` → succeeds with `sent` + `replyRecordedBy` pending — the tested primary.
- `recordMessageReply`: `replied-declined` on a confirmation-request surfaces the cancellation step with `sourceMessageId` provenance (M-1031 fixture); stale `baseState` → CONFLICT keeping both timestamps.
- `cancelAppointment`: opens the slot; same-day remaining time ≥ floor → the fill proposal becomes available immediately (CP-3); `sourceMessageId` provenance lands in the timeline.
- `updateClinicSettings`: mid-day policy edits apply forward-only (already-sent messages stay sent); `baseVersion` stale → CONFLICT both payloads; `policyVersion` increments — the next fill run records the new version (provenance).
- `exportDaySheet`: 3-stage paced job (queued 100ms → rendering milestones → succeeded); artifact expiry 7 days; `failExportFormatOnce` → partial delivery (2 of 3 formats) with per-format retry (async-contract §4); idempotent re-export returns the same artifact.
- `listJobs`: all seeded jobs with state, progress, link-to-context; cancel/retry honored (T3 consolidation).
- `getUsage`: not in this contract — the product is non-AI with no metered operations; quota surfaces exist ONLY as channel-side RATE_LIMIT errors (honesty: the desk never renders a meter of its own).

## Error injection

`MockConfig { latencyMs, errorRate, errorCode, channelBound (default false), quotaExhausted, failExportFormatOnce, conflictOnNextBooking }`; fixed correlationIds `cad-corr-0001…`; every 07b error class injectable per method and typed per the union — VALIDATION, NOT_FOUND (stale links + the expired A-sheet-1016 fixture), PERMISSION (channel-off), CONFLICT, RATE_LIMIT, NETWORK (the M-1040 fixture), and UNKNOWN (returns the correlationId and a typed retry per the 11 copy formula).

## Test-support

`reset()` / `snapshot()` / `replay()`: full state restore, no randomness, no network, no timers beyond the declared cadences; `tick(minutes)` advances the fixed clock deterministically (offer expiry, ladder timing, artifact expiry are all clock-derived). Regression assertions: F-1 candidate order exact (rule 3/4); O-1 expiry at 09:19 via `tick(4)`; A-1007 floor VALIDATION fires; P-004 flag active (3), P-009 inactive (1), P-012 inactive (window); phone-number share fixture renders two patients; channel-off PERMISSION carries the script path; F-0's declined offer never penalized W-1; policy mid-day edit forward-only; every error class injectable and typed per the 07b union.
